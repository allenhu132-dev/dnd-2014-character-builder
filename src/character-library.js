/* Versioned browser-local character archives. Full backups include private fields. */
const CharacterLibrary = (() => {
  const version = 2;
  const limit = 200;
  const id = () => globalThis.crypto?.randomUUID?.() ?? 'character-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  const record = build => ({id: id(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), build: structuredClone(build)});
  function validBuild(build) {
    if (!(build && typeof build === 'object' && !Array.isArray(build) && typeof build.job === 'string' && typeof build.ancestry === 'string' &&
      Number.isInteger(build.level) && build.level >= 1 && build.level <= 20 && Array.isArray(build.base) && build.base.length === 6 && build.base.every(Number.isInteger)
    )) return false;
    if (build.scoreMode === 'manual') return Array.isArray(build.manual) && build.manual.length === 6 && build.manual.every(value => Number.isInteger(value) && value >= 3 && value <= 18);
    const costs = [0,1,2,3,4,5,7,9];
    return build.base.every(value => value >= 8 && value <= 15) && build.base.reduce((sum, value) => sum + costs[value - 8], 0) <= 27;
  }
  function validate(value, normalize) {
    if (!value || value.schemaVersion !== version || value.format !== 'dnd2014-library' ||
        !Array.isArray(value.characters) || !value.characters.length) {
      throw new Error('存档格式或版本不支持。请选择本工具导出的 v2 JSON 存档。');
    }
    const seen = new Set();
    const characters = value.characters.map(item => {
      if (!item || typeof item.id !== 'string' || !validBuild(item.build) || seen.has(item.id)) {
        throw new Error('存档中的角色记录损坏或编号重复。原角色库已保留。');
      }
      seen.add(item.id);
      return {...record(normalize(item.build)), id: item.id, createdAt: item.createdAt, updatedAt: item.updatedAt};
    });
    return {format: 'dnd2014-library', schemaVersion: version,
      activeId: seen.has(value.activeId) ? value.activeId : characters[0].id, characters};
  }
  function load(storage, key, legacyKey, initial, normalize) {
    let warning = '';
    let recovery = '';
    try {
      const raw = storage.getItem(key);
      if (raw) {
        recovery = raw;
        return {library: validate(JSON.parse(raw), normalize), warning, raw};
      }
      const old = JSON.parse(storage.getItem(legacyKey) || 'null');
      const first = record(old?.version === 1 && old.state ? normalize(old.state) : initial());
      const library = {format: 'dnd2014-library', schemaVersion: version, activeId: first.id, characters: [first]};
      const serialized = JSON.stringify(library);
      storage.setItem(key, serialized);
      return {library, warning: old?.version === 1 ? '已迁移旧角色，原存档仍保留。' : '', raw: serialized};
    } catch (error) {
      warning = '读取或保存角色库失败。请先导出备份。' + (error instanceof SyntaxError ? ' 存档 JSON 损坏。' : ' ' + error.message);
    }
    const first = record(initial());
    return {library: {format: 'dnd2014-library', schemaVersion: version, activeId: first.id, characters: [first]}, warning, recovery, raw: recovery || null};
  }
  const sameBuild = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  function merge(base, local, remote) {
    const previous = new Map(base.characters.map(entry => [entry.id, entry]));
    const merged = new Map(remote.characters.map(entry => [entry.id, entry]));
    const localIds = new Set(local.characters.map(entry => entry.id));
    let activeId = local.activeId;
    let conflicts = 0;
    for (const old of previous.values()) {
      if (localIds.has(old.id) || !merged.has(old.id)) continue;
      if (sameBuild(old.build, merged.get(old.id).build)) merged.delete(old.id);
      else conflicts++;
    }
    for (const entry of local.characters) {
      const old = previous.get(entry.id);
      if (old && sameBuild(old.build, entry.build)) continue;
      const other = merged.get(entry.id);
      if (other && sameBuild(other.build, entry.build)) continue;
      if (old && (!other || !sameBuild(old.build, other.build))) {
        const copy = record({...entry.build, name: ((entry.build.name || '未命名角色').slice(0, 80) + ' · 编辑副本')});
        merged.set(copy.id, copy);
        if (activeId === entry.id) activeId = copy.id;
        conflicts++;
      } else {
        merged.set(entry.id, entry);
      }
    }
    const characters = [...merged.values()];
    return {library: {...remote, characters, activeId: merged.has(activeId) ? activeId : characters[0]?.id}, conflicts};
  }
  function importArchive(text, normalize) {
    if (text.length > 8 * 1024 * 1024) throw new Error('存档超过 8 MB，请使用单角色存档。');
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('这个文件不是有效的 JSON，原角色库已保留。'); }
    if (data?.format === 'dnd2014-character' && data.schemaVersion === version && validBuild(data.build)) {
      return [record(normalize(data.build))];
    }
    return validate(data, normalize).characters.map(item => ({...item, id: id()}));
  }
  return {version, limit, record, load, validate, importArchive, merge, sameBuild};
})();
