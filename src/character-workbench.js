  function normalizeSpellIds(value) {
    return Array.isArray(value) ? [...new Set(value.filter(id => coreSpells.some(spell => spell.id === id)))].slice(0, 500) : [];
  }

  function normalizeDecisionMap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([key, list]) => key.length < 160 && Array.isArray(list))
      .map(([key, list]) => [key, [...new Set(list.filter(item => typeof item === 'string' && item.length < 100))].slice(0, 30)]));
  }

  function normalizeEquipmentItems(value) {
    return Array.isArray(value) ? value.filter(item => Object.hasOwn(coreRules.items, item?.id) && isScore(item.quantity, 1, 999))
      .map(item => ({id: item.id, quantity: item.quantity})).slice(0, 200) : [];
  }

  function normalizeExtras(build, raw) {
    build.actualLevel = isScore(raw.actualLevel, 1, 20) ? raw.actualLevel : build.level;
    build.levelCap = Math.max(build.actualLevel, isScore(raw.levelCap, 1, 20) ? raw.levelCap : 20);
    build.level = Math.min(build.level, build.levelCap);
    build.decisions = normalizeDecisionMap(raw.decisions);
    build.preparations = normalizeSpellIds(raw.preparations);
    build.spellSlotPlan = Object.fromEntries(Object.entries(raw.spellSlotPlan ?? {}).filter(([key, id]) =>
      /^[1-9]:[0-3]$/.test(key) && coreSpells.some(spell => spell.id === id && spell.level > 0)));
    build.copiedSpells = normalizeSpellIds(raw.copiedSpells);
    build.inventory = normalizeEquipmentItems(raw.inventory);
    build.registeredEquipment = normalizeEquipmentItems(raw.registeredEquipment);
    build.equipmentChoices = raw.equipmentChoices && typeof raw.equipmentChoices === 'object' ?
      Object.fromEntries(Object.entries(raw.equipmentChoices).filter(([key, value]) => key.length < 100 && typeof value === 'string' && value.length < 100)) : {};
    if (raw.equipmentChoices === undefined && build.job === 'rogue' && typeof raw.weapon === 'string') {
      build.equipmentChoices = {
        weapon: build.weapon,
        sidearm: build.ranged === 'shortsword' ? 'shortsword' : 'bow',
        pack: {burglar: 'burglars-pack', dungeon: 'dungeoneers-pack', explorer: 'explorers-pack'}[build.pack],
      };
    }
    build.equipmentMode = raw.equipmentMode === 'gold' ? 'gold' : 'pack';
    build.wealthRoll = isScore(raw.wealthRoll, 0, 1000) ? raw.wealthRoll : 0;
    const primaryWeapon = raw.equippedWeapon ?? (build.job === 'rogue' ? raw.weapon : '');
    build.equippedWeapon = coreRules.items[primaryWeapon]?.kind === 'weapon' ? primaryWeapon : '';
    build.equippedOffhand = coreRules.items[raw.equippedOffhand]?.kind === 'weapon' ? raw.equippedOffhand : '';
    build.weaponGrip = raw.weaponGrip === 'two' ? 'two' : 'one';
    build.magicArmor = raw.magicArmor === true;
    const languageCount = coreRules.backgrounds[build.background]?.languageCount ?? 0;
    build.backgroundLanguages = Array.from({length: languageCount}, (_, index) => langs.includes(raw.backgroundLanguages?.[index]) ? raw.backgroundLanguages[index] : '');
    build.backgroundTools = Array.isArray(raw.backgroundTools) ? raw.backgroundTools.filter(item => typeof item === 'string').slice(0, 5) : [];
    build.rules = {feats: raw.rules?.feats !== false, variantHuman: raw.rules?.variantHuman !== false, tashaSpells: raw.rules?.tashaSpells === true};
    build.publicFields = {ancestry: raw.publicFields?.ancestry === true, features: raw.publicFields?.features === true, notes: raw.publicFields?.notes === true};
    build.archivedSelections = Array.isArray(raw.archivedSelections) ? raw.archivedSelections.slice(-20) : [];
  }

  function coreSubclass(build) {
    return build.level >= activeTrack(build).sub[0] ? chosenSubclass(build) : '';
  }

  function activeDecisions(build, level = build.level) {
    const subclass = level >= activeTrack(build).sub[0] ? chosenSubclass(build) : '';
    const choices = coreRules.choices.filter(choice => (!choice.job || choice.job === build.job) &&
      (!choice.subclass || choice.subclass === subclass) && (!choice.race || choice.race === build.ancestry) && choice.level <= level && dependencyMet({...build, level}, choice.dependsOn));
    if (build.job === 'bloodhunter' && subclass === '渎魂结社') choices.push({
      id:'profane-patron', name:'渎魂宗主', level:3, count:1,
      options:Object.entries(profanePatronSpells).map(([id, [name, revealed, unsealed]]) => ({
        id, name, desc:'7 级 · ' + coreSpells.find(spell => spell.id === revealed)?.name + '，15 级 · ' + coreSpells.find(spell => spell.id === unsealed)?.name,
      })),
    });
    return choices;
  }

  function dependencyMet(build, condition) {
    if (!condition) return true;
    if (condition.choice) return (build.decisions[condition.choice] ?? []).includes(condition.option);
    if (condition.group === 'invocations') return effectiveInvocations(build).some(option => option.id === condition.option);
    if (condition.group) return coreRules.choices.some(choice => choice.group === condition.group && choice.level <= build.level && (build.decisions[choice.id] ?? []).includes(condition.option));
    if (condition.spell) {
      const learned = new Set();
      for (let level = 1; level <= build.level; level++) {
        planStep(build, level).spellsRemoved.forEach(id => learned.delete(id));
        planStep(build, level).spellsAdded.forEach(id => learned.add(id));
      }
      return learned.has(condition.spell);
    }
    return true;
  }

  function decisionOptionAvailable(build, choice, option) {
    if (option.minLevel > build.level || !(option.prerequisites ?? []).every(condition => dependencyMet(build, condition))) return false;
    if (choice.group === 'invocations') return true;
    if (option.effects?.skills?.some(skill => [...ancestries[build.ancestry][3], ...build.ancestrySkills, ...build.backgroundSkills, ...build.jobSkills].includes(skill))) return false;
    return !choice.group || !coreRules.choices.some(other => other.id !== choice.id && other.group === choice.group && other.level <= build.level &&
      (!other.job || other.job === build.job) && (build.decisions[other.id] ?? []).includes(option.id));
  }

  function selectedDecisionOptions(build, level = build.level) {
    const options = activeDecisions(build, level).filter(choice => choice.group !== 'invocations').flatMap(choice => (build.decisions[choice.id] ?? [])
      .map(id => choice.options.find(option => option.id === id))
      .filter(option => option && decisionOptionAvailable({...build, level}, choice, option)));
    return build.job === 'warlock' ? [...options, ...effectiveInvocations(build, level)] : options;
  }

  function effectiveInvocations(build, level = build.level) {
    const choices = coreRules.choices.filter(choice => choice.group === 'invocations');
    const options = choices[0]?.options ?? [];
    const selected = new Map();
    for (let rank = 1; rank <= level; rank++) {
      const current = {...build, level: rank};
      const available = option => option && option.minLevel <= rank && (option.prerequisites ?? []).every(condition => dependencyMet(current, condition));
      for (const choice of choices.filter(choice => choice.level === rank)) for (const id of (build.decisions[choice.id] ?? []).slice(0, choice.count)) {
        const option = options.find(option => option.id === id);
        if (available(option)) selected.set(id, option);
      }
      const removed = build.decisions['invocation-remove:' + rank]?.[0];
      const added = build.decisions['invocation-add:' + rank]?.[0];
      const replacement = options.find(option => option.id === added);
      if (selected.has(removed) && !selected.has(added) && available(replacement)) {selected.delete(removed); selected.set(added, replacement);}
    }
    return [...selected.values()];
  }

  function applyCoreProficiencies(build, totals, proficiencies, expertise, issues, saves) {
    const effects = selectedDecisionOptions(build).map(option => option.effects ?? {});
    const subclass = coreSubclass(build);
    for (const [rank, features] of Object.entries(coreRules.subclassFeatures[build.job]?.[subclass] ?? {})) {
      if (+rank <= build.level) effects.push(...features.map(feature => feature.effects ?? {}));
    }
    for (const effect of effects) {
      (effect.skills ?? []).forEach(skill => proficiencies.add(skill));
      (effect.expertise ?? []).forEach(skill => {proficiencies.add(skill); expertise.add(skill);});
      (effect.saves ?? []).forEach(index => saves.add(index));
    }
    if (build.ancestry === 'variantHuman' && !build.rules.variantHuman) issues.push('DM 已关闭变体人类，请更换种族或开启对应规则');
    if (build.jobSkills.some(skill => !classSpec(build)[4].includes(skill))) issues.push('保留的旧职业技能与当前职业不符，请重新分配');
    if (build.expertise.some(skill => skill && !proficiencies.has(skill) && skill !== '盗贼工具')) issues.push('保留的专精缺少技能熟练，请重新分配');
  }

  function armorItem(id) {
    const alias = {none: '', studded: 'studded-leather', shirt: 'chain-shirt', scale: 'scale-mail',
      halfPlate: 'half-plate', ring: 'ring-mail', chain: 'chain-mail'};
    return coreRules.items[alias[id] ?? id];
  }

  function armorStateId(itemId) {
    const item = coreRules.items[itemId];
    return Object.keys(armors).find(id => armorItem(id) === item) ?? 'none';
  }

  const expansionClassEquipmentTraining = {
    artificer: {armor:['light','medium','shield'], weapons:['simple'], tools:['盗贼工具','修补工具']},
    bloodhunter: {armor:['light','medium','shield'], weapons:['simple','martial'], tools:['炼金工具']},
  };
  const expansionSubclassEquipmentTraining = {
    artificer: {'装甲师':{armor:['heavy']}, '战地匠师':{weapons:['martial']}},
    bard: {'剑舞学院':{armor:['medium'], weapons:['scimitar']}},
    cleric: {'锻造领域':{armor:['heavy']}, '秩序领域':{armor:['heavy']}, '暮光领域':{armor:['heavy'], weapons:['martial']},
      '死亡领域':{weapons:['martial']}},
    warlock: {'咒剑':{armor:['medium','shield'], weapons:['martial']}},
    wizard: {'剑咏':{armor:['light']}},
  };

  function pactWeaponId(build) {
    if (build.job !== 'warlock' || build.level < 3 || !build.decisions['pact-boon']?.includes('blade')) return '';
    const id = build.decisions['pact-weapon']?.[0];
    const item = coreRules.items[id];
    return item?.kind === 'weapon' && item.category === 'melee' ? id : '';
  }

  function coreProficiencies(build, taken = new Map()) {
    const cls = coreRules.classes[build.job] ?? expansionClassEquipmentTraining[build.job] ?? {};
    const subclass = coreSubclass(build);
    const race = coreRules.races[build.ancestry] ?? {};
    const fixedTools = [...(cls.tools ?? []), ...(race.tools ?? []), ...(coreRules.backgrounds[build.background]?.tools ?? [])].filter(name => !/自选|选择|任选|三选一|或/.test(name));
    const result = {armor: new Set([...(cls.armor ?? []), ...(race.armor ?? [])]), weapons: new Set([...(cls.weapons ?? []), ...(race.weapons ?? [])]), tools: new Set([...fixedTools, ...build.backgroundTools])};
    const effects = [
      ...selectedDecisionOptions(build).map(option => option.effects ?? {}),
      ...(race.features ?? []).map(feature => feature.effects ?? {}),
      expansionSubclassEquipmentTraining[build.job]?.[subclass] ?? {},
    ];
    const pactWeapon = pactWeaponId(build);
    if (pactWeapon) result.weapons.add(pactWeapon);
    for (const featId of taken.keys()) {
      const effect = coreRules.feats.find(feat => feat.id === featId)?.effects;
      if (effect) effects.push(effect);
      if (effect?.weaponChoices) (build.decisions['feat:' + featId] ?? []).forEach(id => result.weapons.add(id));
      if (effect?.proficiencyChoices) (build.decisions['feat:' + featId] ?? []).filter(id => !skillNames.includes(id)).forEach(id => result.tools.add(id));
    }
    for (const [rank, features] of Object.entries(coreRules.subclassFeatures[build.job]?.[subclass] ?? {})) {
      if (+rank <= build.level) effects.push(...features.map(feature => feature.effects ?? {}));
    }
    for (const effect of effects) for (const key of ['armor', 'weapons', 'tools']) (effect[key] ?? []).forEach(value => result[key].add(value));
    return result;
  }

  function weaponTrained(item, proficiencies) {
    return proficiencies.weapons.has(item.type) || proficiencies.weapons.has(item.id) || proficiencies.weapons.has(item.name);
  }

  function startingEquipmentAvailable(option, proficiencies) {
    return !(option.requiresArmor && !proficiencies.armor.has(option.requiresArmor) ||
      option.requiresWeapon && !weaponTrained(coreRules.items[option.requiresWeapon], proficiencies));
  }

  function equipmentInventory(build, proficiencies) {
    const packMode = build.equipmentMode === 'pack';
    const cls = packMode ? coreRules.classes[build.job] : null;
    const background = packMode ? coreRules.backgrounds[build.background] : null;
    const items = [...(cls?.fixedEquipment ?? []), ...(background?.equipment ?? [])];
    for (const branch of cls?.equipment ?? []) {
      const selected = branch.options.find(option => option.id === build.equipmentChoices[branch.id]);
      if (!selected || !startingEquipmentAvailable(selected, proficiencies)) continue;
      items.push(...(selected.items ?? []));
      if (selected.pick) for (let index = 0; index < selected.pick.count; index++) {
        const id = build.decisions['gear:' + branch.id + ':' + index]?.[0];
        const item = coreRules.items[id];
        if (item && equipmentPickPool(selected.pick).some(option => option.id === id)) items.push({id, quantity: 1});
      }
    }
    const counts = new Map();
    const pactWeapon = pactWeaponId(build);
    if (pactWeapon && ![...items, ...build.inventory, ...build.registeredEquipment].some(item => item.id === pactWeapon)) {
      items.push({id: pactWeapon, quantity: 1});
    }
    for (const {id, quantity} of [...items, ...build.inventory, ...build.registeredEquipment]) {
      if (coreRules.items[id]) counts.set(id, (counts.get(id) ?? 0) + quantity);
    }
    return [...counts].map(([id, quantity]) => ({id, quantity}));
  }

  function usesBothHands(item, grip) {
    return Boolean(item?.properties.includes('two-handed') || item?.versatile && grip === 'two');
  }

  function equippedFromInventory(build, inventory) {
    const owned = new Map(inventory.map(item => [item.id, item.quantity]));
    const unlisted = new Set();
    const has = item => {
      if (!item) return false;
      if (owned.has(item.id)) return true;
      unlisted.add(item.name);
      return false;
    };
    const armor = has(armorItem(build.armor)) ? build.armor : 'none';
    const shield = build.shield && has(coreRules.items.shield);
    let equippedWeapon = has(coreRules.items[build.equippedWeapon]) ? build.equippedWeapon : '';
    let equippedOffhand = has(coreRules.items[build.equippedOffhand]) ? build.equippedOffhand : '';
    let weaponGrip = build.weaponGrip;
    const main = coreRules.items[equippedWeapon];
    const offhand = coreRules.items[equippedOffhand];
    const twoHands = usesBothHands(main, weaponGrip);
    const invalidOffhand = offhand && (!equipmentSlots(offhand).includes('equippedOffhand') ||
      equippedOffhand === equippedWeapon && owned.get(equippedOffhand) < 2);
    if (shield && twoHands) {
      if (main.properties.includes('two-handed')) equippedWeapon = '';
      weaponGrip = 'one';
    }
    if (shield || twoHands || invalidOffhand) equippedOffhand = '';
    const handConflict = Boolean(invalidOffhand || (shield || twoHands) && offhand || shield && twoHands);
    return {armor, shield, equippedWeapon, equippedOffhand, weaponGrip, unlisted: [...unlisted], handConflict};
  }

  function applyHandEquipment(build, key, value) {
    if (key === 'equippedWeapon') {
      build.weaponGrip = 'one';
      if (!usesBothHands(coreRules.items[value], 'one')) return;
    }
    if (key === 'weaponGrip' && value === 'two' || key === 'equippedWeapon') {
      build.shield = false;
      build.equippedOffhand = '';
    }
    if (key === 'shield' && value || key === 'equippedOffhand' && value) {
      if (key === 'shield') build.equippedOffhand = '';
      else build.shield = false;
      if (usesBothHands(coreRules.items[build.equippedWeapon], 'one')) build.equippedWeapon = '';
      build.weaponGrip = 'one';
    }
  }

  function calculateCore(build, calc, equipment, inventory, proficiencies) {
    const {mods, issues} = calc;
    let {hp, ac, speed} = calc;
    const subclass = coreSubclass(build);
    const armor = armorItem(build.armor);
    if (armor && !proficiencies.armor.has(armor.type)) issues.push('未熟练当前护甲，部分检定有劣势且不能施法');
    if (build.shield && !proficiencies.armor.has('shield')) issues.push('未熟练盾牌，部分检定有劣势且不能施法');
    if (armor?.strength && calc.totals[0] < armor.strength && !['hillDwarf', 'mountainDwarf'].includes(build.ancestry)) speed = Math.max(0, speed - 10);
    if (subclass === '龙族血脉') {
      hp += build.level;
      if (build.armor === 'none') ac = Math.max(ac, 13 + mods[1] + (build.shield ? 2 : 0));
    }
    const options = selectedDecisionOptions(build);
    if (build.armor !== 'none' && options.some(option => option.effects?.fightingStyle === '防御') && planStep(build, styleLevel(build.job)).style !== '防御') ac++;
    const coreFeatures = [
      ...Object.entries(coreRules.classFeatures[build.job] ?? {}),
      ...Object.entries(coreRules.subclassFeatures[build.job]?.[subclass] ?? {}),
    ].filter(([rank]) => +rank <= build.level).flatMap(([, features]) => features);
    const languages = [...new Set([...options.flatMap(option => option.effects?.languages ?? []), ...coreFeatures.flatMap(feature => feature.effects?.languages ?? []),
      ...[...calc.featsTaken.keys()].flatMap(id => coreRules.feats.find(feat => feat.id === id)?.effects?.languageChoices ? build.decisions['feat:' + id] ?? [] : [])])];
    let attackCount = Math.max(1, ...coreFeatures.map(feature => feature.effects?.attackCount ?? 1));
    if (build.armor === 'none' && build.magicArmor) ac = Math.max(ac, 13 + mods[1] + (build.shield ? 2 : 0));
    const wielded = [coreRules.items[build.equippedWeapon], coreRules.items[build.equippedOffhand]];
    if (calc.featsTaken.has('phb:dual-wielder') && !build.shield && build.weaponGrip !== 'two' &&
        wielded.every(item => item?.category === 'melee' && !item.properties.includes('two-handed'))) ac++;
    if (calc.featsTaken.has('phb:medium-armor-master') && armor?.type === 'medium') ac += Math.max(0, Math.min(mods[1], 3) - Math.min(mods[1], 2));
    for (const choice of activeDecisions(build)) {
      const selected = (build.decisions[choice.id] ?? []).filter(id => choice.options.some(option => option.id === id && decisionOptionAvailable(build, choice, option)));
      if (selected.length > choice.count || !choice.optional && selected.length !== choice.count) issues.push(choice.name + '还需选择 ' + Math.max(0, choice.count - selected.length) + ' 项');
    }
    const background = coreRules.backgrounds[build.background];
    if (build.backgroundLanguages.some(value => !value)) issues.push('背景语言尚未选满');
    if ((background?.tools ?? []).some(tool => /自选|选择|任选/.test(tool)) && !build.backgroundTools.length) issues.push('背景工具尚未选择');
    for (const featId of calc.featsTaken.keys()) {
      const effect = coreRules.feats.find(feat => feat.id === featId)?.effects ?? {};
      const count = effect.proficiencyChoices || effect.languageChoices || effect.weaponChoices;
      if (count && (build.decisions['feat:' + featId] ?? []).length !== count) issues.push(featMap[featId].name + '的自选项未完成');
      if (coreRules.featSpellChoices[featId] && !build.decisions['feat-class:' + featId]?.length) issues.push(featMap[featId].name + '需选择法术来源职业');
    }
    if (build.job === 'warlock') {
      const expected = activeDecisions(build).filter(choice => choice.group === 'invocations').reduce((sum, choice) => sum + choice.count, 0);
      if (effectiveInvocations(build).length !== expected) issues.push('魔能祈唤有重复或前提不满足，请调整');
      for (let rank = 3; rank <= build.level; rank++) {
        if (!!build.decisions['invocation-remove:' + rank]?.length !== !!build.decisions['invocation-add:' + rank]?.length) issues.push(rank + ' 级祈唤替换需要同时选择旧项与新项');
      }
    }
    const style = styleLevel(build.job);
    if (build.level >= style && classStyleOptions(build.job).length && !classStyleOptions(build.job).includes(planStep(build, style).style)) issues.push(style + ' 级战斗风格未选择');
    const spells = calculateSpells(build, calc.totals, calc.featsTaken);
    issues.push(...spells.issues);
    const wealth = coreRules.classes[build.job]?.wealth;
    const startingGold = build.equipmentMode === 'gold' ? build.wealthRoll * (wealth?.multiplier ?? 1) : 0;
    const cost = build.inventory.reduce((sum, item) => sum + coreRules.items[item.id].cost * item.quantity, 0);
    const backgroundGold = build.backgroundGold ?? backgrounds[build.background][2] ?? 0;
    const gold = Math.round(((build.equipmentMode === 'gold' ? startingGold : backgroundGold) - cost) * 100) / 100;
    if (gold < 0) issues.push('装备购置超出起始金币');
    if (build.equipmentMode === 'gold' && wealth && (build.wealthRoll < wealth.count || build.wealthRoll > wealth.count * wealth.dice)) issues.push('起始财富骰子合计应为 ' + wealth.count + '–' + wealth.count * wealth.dice);
    if (build.equipmentMode === 'pack') for (const group of coreRules.classes[build.job]?.equipment ?? []) {
      const selected = group.options.find(option => option.id === build.equipmentChoices[group.id]);
      if (selected?.pick) for (let index = 0; index < selected.pick.count; index++) {
        if (!equipmentPickPool(selected.pick).some(item => item.id === build.decisions['gear:' + group.id + ':' + index]?.[0])) issues.push(group.label + '的指定物品尚未选满');
      }
      if (selected?.requiresArmor && !proficiencies.armor.has(selected.requiresArmor)) issues.push(group.label + '缺少所需护甲熟练');
      if (selected?.requiresWeapon && !weaponTrained(coreRules.items[selected.requiresWeapon], proficiencies)) issues.push(group.label + '缺少所需武器熟练');
    }
    const martialUnarmed = build.job === 'monk' && build.armor === 'none' && !build.shield;
    const martialDie = build.level >= 17 ? 10 : build.level >= 11 ? 8 : build.level >= 5 ? 6 : 4;
    const unarmedAbility = martialUnarmed && mods[1] > mods[0] ? 1 : 0;
    let attack = {name: '徒手打击', hit: mods[unarmedAbility] + calc.pb,
      damage: (martialUnarmed ? '1d' + martialDie + sign(mods[unarmedAbility]) : Math.max(0, 1 + mods[0])) + ' 钝击', trained: true, ability: unarmedAbility};
    const item = coreRules.items[build.equippedWeapon];
    if (item?.kind === 'weapon') {
      const rangedWeapon = item.category === 'ranged';
      const martialArts = build.job === 'monk' && build.armor === 'none' && !build.shield && (item.id === 'shortsword' || item.type === 'simple' && item.category === 'melee' && !item.properties.includes('two-handed') && !item.properties.includes('heavy'));
      const ability = item.properties?.includes('finesse') || martialArts ? (mods[1] > mods[0] ? 1 : 0) : rangedWeapon ? 1 : 0;
      const pactWeapon = pactWeaponId(build) === item.id;
      const trained = weaponTrained(item, proficiencies);
      const styles = [planStep(build, styleLevel(build.job)).style, ...options.filter(option => /箭术|对决|Archery|Dueling/.test(option.name)).map(option => option.name)];
      const hit = mods[ability] + (trained ? calc.pb : 0) + (rangedWeapon && styles.includes('箭术') ? 2 : 0);
      const twoHands = usesBothHands(item, build.weaponGrip);
      const damage = mods[ability] + (!rangedWeapon && !build.equippedOffhand && !twoHands && styles.includes('对决') ? 2 : 0);
      let die = twoHands && item.versatile ? item.versatile : item.damage;
      if (martialArts && /^1d\d+$/.test(die) && Number(die.slice(2)) < martialDie) die = '1d' + martialDie;
      if (pactWeapon && options.some(option => option.id === 'thirsting-blade')) attackCount = Math.max(2, attackCount);
      const lifeDrinker = pactWeapon && options.some(option => option.id === 'lifedrinker') ? ' + ' + Math.max(1, mods[5]) + ' 暗蚀' : '';
      attack = {name: item.name, hit, damage: die ? die + sign(damage) + ' ' + (item.damageType ?? '') + lifeDrinker : '特殊效果，见武器说明', trained, ability};
    }
    return {hp, ac, speed, spells, proficiencies, inventory, equipment, gold, attack, attackCount, languages, issues};
  }

  function spellSubclass(build, level) {
    return level >= activeTrack(build).sub[0] ? chosenSubclass(build) : '';
  }

  function characterSpellTrack(build, level) {
    const ability = build.decisions['profane-ability']?.[0] === 'wisdom' ? 4 : 3;
    return spellTrack(build.job, level, spellSubclass(build, level), ability);
  }

  function spellMaximum(build, level) {
    return characterSpellTrack(build, level)?.slots.length ?? 0;
  }

  function profileSpellsAt(table, level) {
    return Object.entries(table ?? {}).filter(([rank]) => +rank <= level)
      .flatMap(([, ids]) => typeof ids === 'string' ? ids.split(' ') : ids);
  }

  function knowsMinorIllusion(build) {
    return planStep(build, 1).spellsAdded.includes('minor-illusion') || build.ancestry === 'forestGnome' ||
      build.ancestry === 'highElf' && build.decisions['spell:high-elf-cantrip']?.includes('minor-illusion');
  }

  function spellAccess(build, level) {
    const subclass = spellSubclass(build, level);
    const job = build.job;
    const profile = spellProfiles[job]?.[subclass] ?? {};
    const base = coreSpellRestrictions[subclass]?.classList ?? (subclass === '渎魂结社' ? 'warlock' : job);
    const terrain = coreRules.choices.find(choice => choice.id === 'land-terrain')?.options.find(option =>
      option.id === build.decisions['land-terrain']?.[0])?.name;
    const classic = coreSpellAdditions[subclass === '大地结社' && terrain ? '大地结社:' + terrain : subclass];
    const genie = subclass === '巨灵宗主' ? genieExpandedSpells[build.decisions['genie-kind']?.[0]] : '';
    const expanded = [...(profile.expanded?.split(' ') ?? []), ...(genie ? genie.split(' ') : []),
      ...(classic?.type === 'expandedList' ? profileSpellsAt(classic.levels, level) : [])];
    const prepared = [...profileSpellsAt(profile.prepared, level),
      ...(classic?.type === 'alwaysPrepared' ? profileSpellsAt(classic.levels, level) : [])];
    const granted = profileSpellsAt(profile.known, level);
    const affinity = build.decisions['spell:divine-affinity']?.[0];
    if (profile.swap === 'divine' && Object.hasOwn(divineSpellAffinities, affinity)) granted.push(affinity);
    if (subclass === '幻术学派' && !knowsMinorIllusion(build)) granted.push('minor-illusion');
    const limited = profileSpellsAt(profile.limited, level).map(id => ({id, note: profile.use ?? '按该子职的特性施放。'}));
    if (subclass === '渎魂结社') {
      const patron = profanePatronSpells[build.decisions['profane-patron']?.[0]];
      if (patron && level >= 7) limited.push({id: patron[1], note: '消耗一个契约法术位，每长休一次。'});
      if (patron && level >= 15) limited.push({id: patron[2], note: '无需法术位，每长休一次。'});
    }
    return {base, borrowed: profile.lists ?? [], expanded, prepared, granted, limited, swap: profile.swap,
      optional: build.rules.tashaSpells && job === base, subclass};
  }

  function spellListOrigin(spell, access) {
    if (spell.classes.includes(access.base)) return classList[access.base][0] + '法表';
    const borrowed = access.borrowed.find(job => spell.classes.includes(job));
    if (borrowed) return classList[borrowed][0] + '法表 · ' + access.subclass;
    if (access.expanded.includes(spell.id)) return access.subclass + '扩表';
    if (access.optional && spell.optionalClasses?.includes(access.base)) return '塔莎可选职业法表';
    return '';
  }

  function classSpellPool(access, track, max, job) {
    return coreSpells.filter(spell => spell.level <= max && spellListOrigin(spell, access) &&
      (!track.prepared || job === 'wizard' || spell.level === 0));
  }

  function spellSwapOptions(access, from, max) {
    if (!from) return [];
    if (access.swap === 'divine') return coreSpells.filter(spell => spell.level > 0 && spell.level <= max && spell.classes.includes('cleric'));
    const schools = access.swap === 'psionic' ? ['D', 'E'] : ['A', 'T'];
    return coreSpells.filter(spell => spell.level === from.level && schools.includes(spell.schoolCode) &&
      ['sorcerer', 'warlock', 'wizard'].some(job => spell.classes.includes(job)));
  }

  function calculateSpells(build, totals, featsTaken = new Map()) {
    const spellMap = new Map(coreSpells.map(spell => [spell.id, spell]));
    const known = new Set();
    const unrestrictedKnown = new Set();
    const subclassKnown = new Set();
    const issues = [];
    const stages = new Map();
    const extraChoices = spellChoiceDefinitions(build, featsTaken);
    const bonuses = extraChoices.filter(choice => !choice.bookOnly && choice.mode !== 'affinity').flatMap(choice =>
      (build.decisions['spell:' + choice.id] ?? []).filter(id => validSpellForChoice(build, choice, spellMap.get(id)))
        .slice(0, choice.count).map(id => ({id, choice})));
    const access = spellAccess(build, build.level);
    for (let level = 1; level <= build.level; level++) {
      const track = characterSpellTrack(build, level);
      if (!track) continue;
      const levelAccess = spellAccess(build, level);
      const priorAccess = spellAccess(build, level - 1);
      const previousTrack = characterSpellTrack(build, level - 1);
      for (const id of levelAccess.granted) if (!priorAccess.granted.includes(id)) subclassKnown.add(id);
      const max = track.slots.length;
      const step = planStep(build, level);
      const swapFrom = build.decisions['bonus-swap-from:' + level]?.[0];
      const swapTo = build.decisions['bonus-swap-to:' + level]?.[0];
      const swapEligible = level > 1 && !!levelAccess.swap;
      const swapPool = swapEligible && subclassKnown.has(swapFrom) ? spellSwapOptions(levelAccess, spellMap.get(swapFrom), max)
        .filter(spell => !subclassKnown.has(spell.id) && !known.has(spell.id) && !step.spellsAdded.includes(spell.id)) : [];
      const swapApplied = swapPool.some(spell => spell.id === swapTo);
      const swapOriginals = swapEligible ? [...subclassKnown] : [];
      if (swapApplied) {
        subclassKnown.delete(swapFrom);
        subclassKnown.add(swapTo);
      } else if (swapEligible && (swapFrom || swapTo)) issues.push(level + ' 级的子职法术替换尚未完成或已不适用');
      const replacesCantrip = build.job === 'artificer';
      const replaceAllowed = previousTrack && (replacesCantrip || !track.prepared && !(levelAccess.swap === 'divine' && swapApplied)) ? 1 : 0;
      const replacementPool = [...known].filter(id => (spellMap.get(id)?.level === 0) === replacesCantrip);
      const removed = step.spellsRemoved.filter(id => replacementPool.includes(id));
      if (removed.length !== step.spellsRemoved.length) issues.push(level + ' 级保留了不适用的法术替换');
      if (removed.length > replaceAllowed) issues.push(level + ' 级替换法术数量超限');
      const replaced = removed.slice(0, replaceAllowed);
      const replacedUnrestricted = replaced.filter(id => unrestrictedKnown.has(id));
      replaced.forEach(id => {known.delete(id); unrestrictedKnown.delete(id);});
      const priorCount = [...known].filter(id => spellMap.get(id).level > 0).length;
      const priorCantrips = [...known].filter(id => spellMap.get(id).level === 0).length;
      const pool = classSpellPool(levelAccess, track, max, build.job);
      const poolIds = new Set(pool.map(spell => spell.id));
      const featureChoices = bonuses.filter(entry => entry.choice.mode === 'classKnown' && entry.choice.level <= level);
      const bonusKnownAtLevel = new Set([...subclassKnown, ...featureChoices.map(entry => entry.id)]);
      const added = step.spellsAdded.filter(id => poolIds.has(id) && !known.has(id) && !bonusKnownAtLevel.has(id));
      if (added.length !== step.spellsAdded.length) issues.push(level + ' 级保留了重复或不适用的法术，请调整');
      const restriction = coreSpellRestrictions[levelAccess.subclass];
      let freeSlots = 0;
      let designated = [];
      let learnedThisLevel = added;
      if (restriction) {
        freeSlots = (restriction.unrestrictedAt.includes(level) ? 1 : 0) + replacedUnrestricted.length;
        const leveled = added.filter(id => spellMap.get(id).level > 0);
        const outsideSchool = leveled.filter(id => !restriction.schools.includes(spellMap.get(id).schoolCode));
        designated = [...new Set([...step.freeSpells.filter(id => leveled.includes(id)), ...outsideSchool, ...leveled])].slice(0, freeSlots);
        learnedThisLevel = added.filter(id => spellMap.get(id).level === 0 || restriction.schools.includes(spellMap.get(id).schoolCode) || designated.includes(id));
        if (learnedThisLevel.length !== added.length) issues.push(level + ' 级的跨学派法术超过本级可用名额，超出项目未计入');
      }
      const secretsAtLevel = extraChoices.filter(choice => choice.countsKnown && choice.level === level).reduce((sum, choice) => sum + choice.count, 0);
      const toLearn = build.job === 'wizard' ? level === 1 ? 6 : 2 : Math.max(0, (track.known ?? 0) - (previousTrack?.known ?? 0) - secretsAtLevel + replaced.length);
      const newCantrips = track.cantrips - (previousTrack?.cantrips ?? 0) + (replacesCantrip ? replaced.length : 0);
      const acceptedCantrips = learnedThisLevel.filter(id => spellMap.get(id).level === 0).slice(0, newCantrips);
      const acceptedLeveled = learnedThisLevel.filter(id => spellMap.get(id).level > 0).slice(0, toLearn);
      const accepted = [...acceptedCantrips, ...acceptedLeveled];
      accepted.forEach(id => known.add(id));
      designated = designated.filter(id => acceptedLeveled.includes(id));
      designated.forEach(id => unrestrictedKnown.add(id));
      if (accepted.length !== learnedThisLevel.length) issues.push(level + ' 级法术选择超限，超出项目未计入');
      const cantrips = [...known].filter(id => spellMap.get(id).level === 0);
      const learned = [...known].filter(id => spellMap.get(id).level > 0);
      if (cantrips.length !== track.cantrips) issues.push(level + ' 级戏法应为 ' + track.cantrips + ' 个');
      if (build.job === 'wizard' && acceptedLeveled.length !== toLearn) issues.push(level + ' 级法术书应新增 ' + toLearn + ' 个法术');
      if (!track.prepared && track.known !== undefined) {
        const secrets = featureChoices.filter(entry => entry.choice.countsKnown).length;
        if (learned.length + secrets !== track.known) issues.push(level + ' 级已知法术应为 ' + track.known + ' 个');
      }
      stages.set(level, {max, cantripCount: track.cantrips, knownCount: track.prepared ? undefined : track.known, priorCantrips, priorCount, replaceAllowed,
        learned, cantrips, added: accepted, removed: replaced, freeSlots, designated, pool, access: levelAccess,
        toLearn, newCantrips, swapEligible, swapOriginals, swapPool, swapApplied, bonusKnownAtLevel, replacementPool, replacesCantrip});
    }

    const restriction = coreSpellRestrictions[access.subclass];
    if (restriction?.requiredCantrips.some(id => !known.has(id))) issues.push('诡术师必须掌握法师之手');
    const max = spellMaximum(build, build.level);
    if (build.job === 'wizard') {
      const copies = build.copiedSpells.filter(id => {
        const spell = spellMap.get(id);
        return spell?.level > 0 && spell.level <= max && spellListOrigin(spell, access);
      });
      copies.forEach(id => known.add(id));
      if (copies.length !== build.copiedSpells.length) issues.push('法术书中部分抄录法术不适用当前法表或等级');
    }
    const alwaysPrepared = new Set(access.prepared);
    for (const choice of extraChoices) {
      const values = build.decisions['spell:' + choice.id] ?? [];
      const selected = values.filter(id => validSpellForChoice(build, choice, spellMap.get(id), known)).slice(0, choice.count);
      if (choice.mode === 'alwaysPrepared') selected.forEach(id => alwaysPrepared.add(id));
      if ((!choice.optional && selected.length !== choice.count) || selected.length !== values.length) issues.push(choice.name + '需选择 ' + choice.count + ' 个符合条件的法术');
    }
    const track = characterSpellTrack(build, build.level);
    const preparedPool = track?.prepared ? coreSpells.filter(spell => spell.level > 0 && spell.level <= max &&
      spellListOrigin(spell, access) && !alwaysPrepared.has(spell.id) && (build.job !== 'wizard' || known.has(spell.id))) : [];
    const preparationLevels = ['paladin','artificer'].includes(build.job) ? Math.floor(build.level / 2) : build.level;
    const preparedMax = track?.prepared ? Math.max(1, mod(totals[track.stat]) + preparationLevels) : 0;
    const prepared = build.preparations.filter(id => preparedPool.some(spell => spell.id === id));
    if (prepared.length > preparedMax) issues.push('准备法术超过当前上限 ' + preparedMax);
    const validPrepared = prepared.slice(0, preparedMax);
    if (track?.prepared && build.preparations.some(id => !prepared.includes(id) && !alwaysPrepared.has(id))) issues.push('部分准备法术已不适用，请调整或清空准备列表');
    if (track?.prepared && !validPrepared.length && preparedMax) issues.push('尚未准备法术');
    const innate = profileSpellsAt(coreSpellAdditions['race:' + build.ancestry]?.levels, build.level);
    if (build.ancestry === 'forestGnome') innate.push('minor-illusion');
    const bonusKnown = [...new Set([...(track ? subclassKnown : access.granted), ...bonuses.filter(entry => entry.choice.mode === 'classKnown').map(entry => entry.id)])];
    const bonus = bonuses.filter(entry => !['classKnown','alwaysPrepared'].includes(entry.choice.mode)).map(entry => entry.id);
    return {known: [...known], stages, issues, preparedPool, preparedMax, prepared: validPrepared, track, access,
      bonus, bonusKnown, alwaysPrepared: [...alwaysPrepared], expandedList: access.expanded, innate, limited: access.limited, extraChoices};
  }

  function spellChoiceDefinitions(build, featsTaken = new Map()) {
    const subclass = coreSubclass(build);
    const scope = choice => (!choice.job || choice.job === build.job) && (!choice.race || choice.race === build.ancestry) &&
      (!choice.subclass || choice.subclass === subclass) && choice.level <= build.level && dependencyMet(build, choice.dependsOn);
    const choices = coreRules.spellChoices.filter(scope).filter(choice => !choice.alreadyKnows || knowsMinorIllusion(build));
    if (subclass === '神圣之魂') choices.push({id: 'divine-affinity', name: '神力亲和 · 额外习得', level: 1, count: 1,
      jobList: 'any', ids: Object.keys(divineSpellAffinities), mode: 'affinity'});
    if (subclass === '奥秘领域') {
      choices.push({id:'arcana-cantrips', name:'奥术传承 · 法师戏法', level:1, count:2, jobList:'wizard', ring:0, mode:'classKnown'});
      if (build.level >= 17) for (const ring of [6,7,8,9]) choices.push({id:'arcana-mastery-' + ring,
        name:'奥术精通 · ' + ring + ' 环常备法术', level:17, count:1, jobList:'wizard', ring, mode:'alwaysPrepared'});
    }
    if (subclass === '死亡领域') choices.push({id:'death-cantrip', name:'收割者 · 死灵戏法', level:1, count:1, jobList:'any', ring:0, schools:['N'], mode:'classKnown'});
    if (subclass === '魔射手') choices.push({id:'arcane-archer-cantrip', name:'魔箭学识 · 附赠戏法', level:3, count:1, jobList:'any', ids:['druidcraft','prestidigitation']});
    if (build.job === 'artificer' && build.level >= 11) choices.push({id:'spell-storing-item', name:'储法物品 · 1 动作法术', level:11, count:1,
      jobList:'artificer', minRing:1, maxRing:2, action:true, optional:true});
    if (build.job === 'bard') {
      for (const level of [10, 14, 18]) if (build.level >= level) choices.push({id: 'magical-secrets-' + level, name: level + ' 级魔法奥秘', level, count: 2,
        jobList: 'any', maxRing: spellMaximum(build, level), countsKnown: true, mode:'classKnown'});
      if (subclass === '逸闻学院' && build.level >= 6) choices.push({id: 'lore-secrets', name: '逸闻学院额外魔法奥秘', level: 6, count: 2,
        jobList: 'any', maxRing: spellMaximum(build, 6), mode:'classKnown'});
      if (subclass === '精魂学院' && build.level >= 6) choices.push({id:'spirit-session', name:'精魂仪式 · 临时法术', level:6, count:1,
        jobList:'any', minRing:1, maxRing:Math.min(spellMaximum(build, build.level), proficiencyAt(build.level)),
        schools:['D','N'], optional:true, mode:'classKnown'});
    }
    if (build.job === 'warlock') for (const [level, ring] of [[11, 6], [13, 7], [15, 8], [17, 9]]) if (build.level >= level) {
      choices.push({id: 'arcanum-' + level, name: ring + ' 环玄奥秘法', level, ring, count: 1, jobList: 'warlock', classAccess:true});
    }
    for (const [id, level] of featsTaken) {
      const config = coreRules.featSpellChoices[id];
      if (!config) continue;
      const jobList = build.decisions['feat-class:' + id]?.[0];
      if (!jobList) continue;
      for (const choice of config.choices) choices.push({...choice, id: id + '-' + choice.ring, name: featMap[id].name + ' · ' + (choice.ring ? '法术' : '戏法'), level, jobList});
    }
    return choices;
  }

  function validSpellForChoice(build, choice, spell, book) {
    if (!spell || choice.ids && !choice.ids.includes(spell.id) || choice.ring !== undefined && spell.level !== choice.ring ||
        choice.maxRing !== undefined && spell.level > choice.maxRing || choice.minRing !== undefined && spell.level < choice.minRing) return false;
    if (!choice.bookOnly && (choice.classAccess ? !spellListOrigin(spell, spellAccess(build, choice.level)) :
        choice.jobList === 'any' ? !spell.classes.length && !choice.ids : !spell.classes.includes(choice.jobList))) return false;
    if (choice.ritual && !spell.ritual || choice.schools && !choice.schools.includes(spell.schoolCode) || choice.action && spell.time !== '1 动作') return false;
    if (choice.attack && !spell.spellAttack && !['chill-touch', 'eldritch-blast', 'fire-bolt', 'produce-flame', 'ray-of-frost', 'shocking-grasp', 'thorn-whip'].includes(spell.id)) return false;
    if (choice.bookOnly) return book?.has(spell.id) ?? false;
    return true;
  }

  function featPrerequisiteError(feat, build, totals, level, taken) {
    const prerequisites = coreRules.feats.find(item => item.id === feat.id)?.prerequisites ?? [];
    const proficiencies = coreProficiencies({...build, level}, taken);
    const meets = condition => {
      if (condition.any) return condition.any.some(meets);
      if (condition.stat !== undefined) return totals[condition.stat] >= condition.min;
      if (condition.armor) return proficiencies.armor.has(condition.armor);
      if (condition.spellcasting) return !!spellTrack(build.job, level, coreSubclass({...build, level})) || ['highElf', 'forestGnome', 'drow', 'tiefling'].includes(build.ancestry);
      return true;
    };
    return prerequisites.every(meets) ? '' : '尚未满足这个专长的属性、护甲或施法前提。';
  }

  function elementalAdeptError(build, level) {
    const selected = build.decisions['feat:phb:elemental-adept:' + level]?.[0];
    if (!selected) return '元素导师需要选择一种伤害类型。';
    const duplicate = growthLevels.slice(0, level - 1).some(rank => planStep(build, rank).feat === 'phb:elemental-adept' && build.decisions['feat:phb:elemental-adept:' + rank]?.includes(selected));
    return duplicate ? '再次选择元素导师时，需要选择另一种伤害类型。' : '';
  }

  function applyFeatChoices(feat, build, proficiencies, expertise, saves, stat) {
    const values = build.decisions['feat:' + feat.id] ?? [];
    const effect = coreRules.feats.find(item => item.id === feat.id)?.effects ?? {};
    if (effect.proficiencyChoices) values.filter(skill => skillNames.includes(skill)).forEach(skill => proficiencies.add(skill));
    if (effect.selectedSave && stat >= 0) saves.add(stat);
  }

  function previewBuild(key, option) {
    const draft = structuredClone(state);
    const branch = branches.get(key);
    if (key === 'careerSubclass') updateBuildStep(draft, activeTrack(draft).sub[0], {subclassName: option.id});
    else if (key === 'treeLevel') draft.level = Number(option.id);
    else if (key === 'subclass') {
      setBuildField(draft, key, option.id);
      updateBuildStep(draft, 3, {subclassName: ''});
    } else if (branch.multiple) {
      const values = currentBranchValues(key, draft);
      setBuildField(draft, key, option.selected ? values.filter(value => value !== option.id) : [...values, option.id]);
    } else setBuildField(draft, key, option.id);
    return normalize(draft);
  }

  function renderChoiceActions(option) {
    const multiple = Boolean(branches.get(branchKey)?.multiple);
    const alreadySelected = Boolean(option.selected && !multiple);
    const reopensEquipment = alreadySelected && branchKey.startsWith('equipmentChoices.') &&
      equipmentPickBranch(state, branchKey.slice('equipmentChoices.'.length), {first:true});
    const action = multiple && option.selected ? '移除此项' : branchKey === 'job' ? '选择此职业' : '选择此项';
    const label = reopensEquipment ? '展开装备选项' : alreadySelected ? (branchKey === 'job' ? '已选择此职业' : '已选择此项') : action;
    return `<button type="button" class="primary" data-apply-choice="${esc(option.id)}"${option.disabled || alreadySelected && !reopensEquipment ? ' disabled' : ''}>${label}</button>`;
  }

  function renderImpact(option, calc, preview, showNow = false) {
    const changed = [['HP', calc.hp, preview.hp], ['AC', calc.ac, preview.ac], ['先攻', calc.initiative, preview.initiative], ['速度', calc.speed, preview.speed],
      ...attrs.map((name, index) => [name, calc.totals[index], preview.totals[index]])].filter(([, before, after]) => before !== after);
    const training = (value) => new Set([...value.proficiencies,
      ...['armor', 'weapons', 'tools'].flatMap(key => proficiencyNames(value.core.proficiencies[key]))]);
    const currentTraining = training(calc);
    const nextTraining = training(preview);
    const added = [...nextTraining].filter(name => !currentTraining.has(name));
    const removed = [...currentTraining].filter(name => !nextTraining.has(name));
    const pending = [...new Set(preview.issues.filter(issue => !calc.issues.includes(issue)))];
    const changes = `${changed.length ? previewFacts(changed.map(([label, before, after]) => [label, `${before} → ${after}`])) : ''}
      ${added.length ? `<p><strong>新增熟练</strong> · ${esc(added.join('、'))}</p>` : ''}
      ${removed.length ? `<p><strong>移除熟练</strong> · ${esc(removed.join('、'))}</p>` : ''}
      ${pending.length ? `<p><strong>应用后待办</strong></p><ul>${pending.map(issue => `<li>${esc(issue)}</li>`).join('')}</ul>` : ''}`;
    const hasChanges = changed.length || added.length || removed.length || pending.length;
    const summary = hasChanges ? changes : '<p>常驻数值没有变化。</p>';
    const compare = isRuleSubclass(branchKey) ? '' : `<button type="button" data-compare-choice="${esc(option.id)}">${(optionComparisons.get(branchKey) ?? []).includes(String(option.id)) ? '移出对比' : '加入对比'}</button>`;
    if (showNow) return `<section class="preview-impact"><h5>对当前角色的影响</h5>${summary}</section>
      ${compare ? `<details class="selection-impact"><summary>选项对比</summary><div>${compare}</div></details>` : ''}`;
    return `<details class="selection-impact" data-detail="impact-${esc(branchKey)}-${esc(option.id)}"><summary>数值变化与对比</summary><div>${summary}${compare}</div></details>`;
  }

  function proficiencyNames(values) {
    const groups = {light: '轻甲', medium: '中甲', heavy: '重甲', shield: '盾牌', simple: '简易武器', martial: '军用武器'};
    return [...values].map(id => coreRules.items[id]?.name ?? groups[id] ?? id);
  }

  function renderProficiencySummary(calc) {
    const names = values => esc(proficiencyNames(values).join('、') || '无');
    return `<dl class="glossary"><dt>护甲熟练</dt><dd>${names(calc.core.proficiencies.armor)}</dd>
      <dt>武器熟练</dt><dd>${names(calc.core.proficiencies.weapons)}</dd><dt>工具熟练</dt><dd>${names(calc.core.proficiencies.tools)}</dd>
      <dt>已知语言</dt><dd>${esc(calc.languages.join('、'))}</dd><dt>种族感官</dt><dd>${esc((coreRules.races[state.ancestry]?.senses ?? []).join('、') || '见种族补记')}</dd>
      <dt>攻击动作</dt><dd>通常 ${calc.core.attackCount} 次攻击，具体触发条件见职业能力。</dd></dl>`;
  }

  function renderOptionComparison(calc) {
    const ids = optionComparisons.get(branchKey) ?? [];
    const branch = branches.get(branchKey);
    const options = ids.map(id => branch.options.find(option => String(option.id) === id)).filter(Boolean);
    if (!options.length || branchKey === 'subclass') return '';
    const records = options.map(option => optionDetail(branchKey, option, calc));
    const labels = [...new Set(records.flatMap(record => (record.facts ?? []).map(([label]) => label)))];
    return `<section class="option-comparison"><h4>选项对比</h4><table><thead><tr><th>项目</th>${options.map(option => `<th>${esc(option.title)}</th>`).join('')}</tr></thead>
      <tbody><tr><th>用途</th>${records.map(record => `<td>${esc(record.note || '见下方能力')}</td>`).join('')}</tr>
      ${labels.map(label => `<tr><th>${esc(label)}</th>${records.map(record => `<td>${esc(record.facts?.find(row => row[0] === label)?.[1] ?? '—')}</td>`).join('')}</tr>`).join('')}
      ${[...new Set(records.flatMap(record => (record.features ?? []).map(([level]) => +level)))].sort((a, b) => a - b).map(level =>
        `<tr><th>${level} 级</th>${records.map(record => `<td>${esc(record.features?.find(row => +row[0] === level)?.[1]?.join(' · ') ?? '—')}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`;
  }

  function missingEquipmentBranch(build = state) {
    if (build.equipmentMode !== 'pack') return '';
    for (const group of coreRules.classes[build.job]?.equipment ?? []) {
      const option = group.options.find(item => item.id === build.equipmentChoices[group.id]);
      if (!option) return 'equipmentChoices.' + group.id;
      if (!option.pick) continue;
      const pool = equipmentPickPool(option.pick);
      for (let i = 0; i < option.pick.count; i++) {
        const decision = 'gear:' + group.id + ':' + i;
        if (!pool.some(item => item.id === build.decisions[decision]?.[0])) return 'decision.' + decision;
      }
    }
    return '';
  }

  function checklistBuild() {
    return state.level === state.actualLevel ? state : {...state, level: state.actualLevel};
  }

  function buildTasks(build, calc) {
    const cls = classSpec(build);
    const needsSubclass = build.level >= activeTrack(build).sub[0] && !calc.subclass;
    const needsJobSkills = build.jobSkills.filter(skill => cls[4].includes(skill) && calc.proficiencies.has(skill)).length < cls[3] ||
      calc.issues.includes('职业技能未选满');
    const backgroundIssue = calc.issues.some(issue => /背景|专精缺少|待选两项不同|熟练来源重复/.test(issue));
    const equipmentIncomplete = Boolean(missingEquipmentBranch(build)) || (build.equipmentMode === 'gold' && !build.wealthRoll) ||
      calc.core.equipment.unlisted.length || calc.core.equipment.handConflict || calc.issues.some(issue => /护甲|盾牌|金币|起始财富/.test(issue));
    return [
      {id: 'ancestry', name: '种族与语言', done: !build.pendingIdentity.includes('ancestry') && !calc.issues.some(issue => /种族|语言重复|变体人类/.test(issue))},
      {id: 'job', name: '职业与子职', done: !build.pendingIdentity.includes('job') && !needsSubclass && !needsJobSkills},
      {id: 'scores', name: '属性与购点', done: build.scoreMode === 'manual' || spent(build.base) === 27},
      {id: 'background', name: '背景与熟练', done: !build.pendingIdentity.includes('background') && !backgroundIssue},
      {id: 'armor', name: '装备与金币', done: !equipmentIncomplete},
      {id: 'spells', name: '法术选择', done: !calc.core.spells.issues.length},
      {id: 'treeLevel', name: '升级选择', done: !calc.issues.some(issue => !calc.core.spells.issues.includes(issue) && /^\d+\s*级/.test(issue))},
    ];
  }

  function renderGuide(preview, opened) {
    const build = checklistBuild();
    const calc = build === state ? preview : calculate(build);
    const tasks = buildTasks(build, calc);
    const issues = [...new Set(calc.issues)];
    const pending = tasks.filter(task => !task.done);
    const [next, ...remaining] = pending;
    const more = (remaining.length ? `<div class="task-grid">${remaining.map(task => `<button type="button" data-task="${task.id}" class="task-card">${task.name}</button>`).join('')}</div>` : '') +
      (issues.length ? `<ul class="task-issues">${issues.map((issue, index) => `<li><button type="button" data-issue="${index}">${esc(issue)} →</button></li>`).join('')}</ul>` : '');
    return `<section class="guide-panel" aria-label="建卡待办">
      <section class="guide-checklist" aria-labelledby="checklist-title">
        <h3 id="checklist-title">建卡检查</h3>
        ${build !== state ? `<p class="hint">实际 ${build.level} 级</p>` : ''}
        ${!pending.length && !issues.length ? '<p>已完成</p>' : ''}
        ${next ? `<button type="button" class="primary" data-task="${next.id}">下一步 · ${next.name}</button>` : ''}
        ${more ? details('checklist', '查看全部待办', more, opened) : ''}
        ${state.archivedSelections.length ? details('archived', `已保留的旧配置 · ${state.archivedSelections.length} 项`, `<ul class="task-issues">${state.archivedSelections.map(entry => `<li>${esc(entry.label)} · ${esc(classList[entry.job]?.[0] ?? entry.ancestry ?? entry.background ?? '')} · ${esc((entry.skills ?? entry.languages ?? []).join('、'))}</li>`).join('')}</ul>`, opened) : ''}
      </section>
      ${persistenceError || notice ? `<p role="status" class="notice${persistenceError ? ' point-notice' : ''}">${esc(persistenceError || notice)}</p>` : ''}
    </section>`;
  }

  const starterGuideSteps = [
    {
      name: '开始建卡', title: '先用战士示例熟悉界面', task: 'home', button: '打开建卡首页',
      points: [
        ['查看示例', '首页的 1 级人类战士已经配好属性、技能和装备。双击左上角的角色名即可改名；也可以点旁边的笔。'],
        ['从空白开始', '准备自己建卡时，点「从空白建卡」。若已有角色，可以在「设置」中新建空白角色，或另开一张战士示例。'],
        ['认识顶部数值', 'HP 是生命值，AC 是护甲等级。改动属性和装备后，可以回顶部看看哪些数值变了。'],
      ],
    },
    {
      name: '种族与职业', title: '挑选种族、职业和技能', task: 'job', button: '打开职业选项', extra: ['ancestry', '打开种族选项'],
      points: [
        ['种族', '从首页打开「种族」，查看属性加值和特性。若该种族有自选语言、技能或属性，把这些选项也填好。'],
        ['职业', '打开「职业」，选择职业和职业技能。子职会在指定等级解锁，解锁等级可在职业页面查看。'],
        ['先看再选', '单击选项先预览。点「完整规则」可读详细效果，点「选择此项」应用。'],
      ],
    },
    {
      name: '属性与背景', title: '分配属性，再选背景', task: 'scores', button: '打开属性面板', extra: ['background', '打开背景选项'],
      points: [
        ['分配六项属性', '「27 点购点」可直接加减原值，顶部会更新剩余点数。如果 DM 让你掷骰或用标准数组，切换到「手动原值」，在「整组录入原值」一次填好。种族加值会另外计算。'],
        ['按职业选重点', '先看职业详情里的主要属性。例如，想用长剑的战士通常优先考虑力量；想用弓的战士可以优先考虑敏捷。'],
        ['选择背景', '在「背景」里选角色冒险前的身份，并填完自选技能、工具和语言。如果熟练项重复，到首页的「建卡检查」查看怎么调整。'],
      ],
    },
    {
      name: '装备', title: '先拿到装备，再穿戴', task: 'armor', button: '打开装备面板',
      points: [
        ['起始装备', '在「装备」里选好每组起始物品。若规则允许用起始金币购买，切换到「起始财富」，填写掷骰合计后去「商店」挑选。'],
        ['背包与穿戴', '选到或买到的物品会进入「背包」。从背包装备护甲、盾牌和武器，顶部的 AC 以及角色卡上的攻击数值才会按穿戴更新。'],
        ['核对数值', '在「查看角色卡」核对已穿戴护甲对应的 AC，以及当前武器的命中加值和伤害。'],
      ],
    },
    {
      name: '法术', title: '先选法术，再看施放方式', task: 'spells', button: '打开法术面板',
      points: [
        ['学会与准备', '如果你的角色能施法，打开「法术」查看当前可选项目。先填「学法术」里的名额；若有「准备法术」，再从可用列表选好今天准备的法术。没有法术的角色可以跳过。'],
        ['读法术详情', '搜索法术后，打开详情查看距离、伤害、命中或豁免 DC，以及是否需要专注。'],
        ['安排法术位', '用「安排法术位」查看计划。可拖放法术，也可用下拉框选择；切换到更高环位时，有升环效果的法术会显示对应数值。'],
      ],
    },
    {
      name: '升级', title: '预览升级，再确认实际等级', task: 'treeLevel', button: '打开成长树',
      points: [
        ['预览未来', '在「升级」里点成长树上的等级，或用「预览等级」下拉框。可以先比较子职和查看新能力。预览会更新显示的数值，但不会更改角色的实际等级。'],
        ['设置等级上限', '用「团的等级上限」把路线缩到本团会用到的等级。只想看看未来的路线时，可以随时回到当前等级。'],
        ['确认升级', '准备好升级时，填完本级选择，再点「设为实际等级」。'],
      ],
    },
    {
      name: '检查角色卡', title: '上桌前做最后检查', task: 'sheet', button: '查看角色卡',
      points: [
        ['处理待办', '回首页看「建卡检查」。展开「查看全部待办」，点一条问题可跳到对应编辑区。'],
        ['核对上桌要用的数值', '打开「查看角色卡」，核对生命值、AC、攻击、技能和装备。用顶部的「能力速览」查看已解锁的本领、法术和优势。'],
      ],
    },
    {
      name: '保存与分享', title: '备份角色，或分享给团友', action: 'library', button: '打开设置',
      points: [
        ['备份或换设备', '角色自动保存在当前浏览器。在「设置」选「导出当前角色 · 完整存档」保存 JSON，再用「导入 JSON 存档」带到另一台设备。'],
        ['分享给团友', '用「分享角色」预览公开摘要。种族和私人补记默认隐藏。完整存档可能含私人资料，分享前先确认用的是哪一种。'],
        ['离线使用', '选「下载离线工具」，保存 HTML 后用浏览器打开。网页版和离线版各自保存角色，迁移时用 JSON 存档。'],
      ],
    },
  ];
  let starterGuideStep = 0;

  function renderStarterGuideStep(index) {
    const {title, points, task, action, button, extra} = starterGuideSteps[index];
    const destination = task ? `data-workbench-task="${task}"` : `data-action="${action}" aria-haspopup="dialog"`;
    return `<section class="starter-lesson panel" aria-labelledby="starter-lesson-title">
      <p class="starter-progress">第 ${index + 1} / ${starterGuideSteps.length} 步</p>
      <h3 id="starter-lesson-title" tabindex="-1">${title}</h3>
      <dl>${points.map(([term, text]) => `<div><dt>${term}</dt><dd>${text}</dd></div>`).join('')}</dl>
      <footer class="starter-lesson-actions">
        <div>
          <button type="button" ${destination}>${button}</button>
          ${extra ? `<button type="button" data-workbench-task="${extra[0]}">${extra[1]}</button>` : ''}
        </div>
        <div>
          ${index ? `<button type="button" data-starter-step="${index - 1}">上一步</button>` : ''}
          ${index < starterGuideSteps.length - 1 ? `<button type="button" class="primary" data-starter-step="${index + 1}">下一步</button>` :
            '<button type="button" class="primary" data-workbench-task="home">完成指南</button>'}
        </div>
      </footer>
    </section>`;
  }

  function renderStarterGuide() {
    return `<div class="starter-guide-launch panel">
        <p>在页面上查看控件的位置和用途，按自己的节奏浏览。</p>
        <button type="button" class="primary" data-action="page-guide-start" data-focus="page-guide-start">开始页面引导</button>
      </div>
      <p class="starter-guide-intro">跟着这八步完成第一张角色卡，或直接跳到你想了解的部分。打开指南不会修改角色。</p>
      <div class="starter-walkthrough">
        <div class="starter-lesson-area">${renderStarterGuideStep(starterGuideStep)}</div>
        <nav class="starter-index" aria-label="指南步骤"><ol>${starterGuideSteps.map(({name}, index) =>
          `<li><button type="button" data-starter-index="${index}"${index === starterGuideStep ? ' aria-current="step"' : ''}>
            <span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${name}</span>
          </button></li>`).join('')}</ol></nav>
      </div>`;
  }

  function changeStarterGuideStep(index) {
    const guide = root.querySelector('.starter-walkthrough');
    if (!guide || !Number.isInteger(index) || !starterGuideSteps[index]) return;
    starterGuideStep = index;
    const lesson = guide.querySelector('.starter-lesson-area');
    lesson.innerHTML = renderStarterGuideStep(index);
    CharacterLocale.localize(lesson);
    for (const button of guide.querySelectorAll('[data-starter-index]')) {
      if (+button.dataset.starterIndex === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    }
    reveal('#starter-lesson-title', {focus: true});
  }

  function decisionField(choice, key = choice.id) {
    const selected = state.decisions[key] ?? [];
    const options = choice.options.map(option => ({id: option.id, title: option.name,
      caption: option.desc ?? option.note ?? '', selected: selected.includes(option.id),
      disabled: !selected.includes(option.id) && (selected.length >= choice.count || !decisionOptionAvailable(state, choice, option))}));
    branches.set('decision.' + key, {label: choice.name + ' · ' + selected.length + '/' + choice.count, options, multiple: true});
    return branchButton((key.startsWith('gear:') ? 'decision.' : 'plan-decision.') + key,
      choice.name + ' · ' + selected.length + '/' + choice.count,
      options.filter(option => option.selected).map(option => option.title).join('、') || '请选择', 'decision.' + key);
  }

  function renderCoreDecisions(calc) {
    const choices = activeDecisions(state).filter(choice => choice.level === state.level);
    const fields = choices.map(choice => decisionField(choice));
    if (state.job === 'warlock' && state.level >= 3) {
      const options = coreRules.choices.find(choice => choice.group === 'invocations').options;
      fields.push(decisionField({name: '可选 · 替换一项旧祈唤', count: 1, options: effectiveInvocations(state, state.level - 1)}, 'invocation-remove:' + state.level));
      fields.push(decisionField({name: '可选 · 换入新祈唤', count: 1, options: options.filter(option => option.minLevel <= state.level &&
        (option.prerequisites ?? []).every(condition => dependencyMet(state, condition)))}, 'invocation-add:' + state.level));
    }
    const feat = coreRules.feats.find(item => item.id === planStep(state, state.level).feat);
    const effect = feat?.effects ?? {};
    const count = effect.proficiencyChoices || effect.languageChoices || effect.weaponChoices;
    if (feat && coreRules.featChoices[feat.id]) fields.push(decisionField(coreRules.featChoices[feat.id], 'feat:' + feat.id + (feat.id === 'phb:elemental-adept' ? ':' + state.level : '')));
    else if (count) fields.push(decisionField({id: 'feat:' + feat.id, name: feat.name + '的自选项', count,
      options: (effect.languageChoices ? langs : effect.weaponChoices ? Object.values(coreRules.items).filter(item => item.kind === 'weapon').map(item => item.id) : skillNames)
        .map(id => ({id, name: coreRules.items[id]?.name ?? id, desc: effect.proficiencyChoices ? '取得这项技能熟练。' : '加入角色的已知项目。'}))}));
    if (feat && coreRules.featSpellChoices[feat.id]) fields.push(decisionField({name: feat.name + ' · 法术来源职业', count: 1,
      options: coreRules.featSpellChoices[feat.id].classes.map(id => ({id, name: classList[id][0], desc: '使用该职业的法术列表与施法属性。'}))}, 'feat-class:' + feat.id));
    return fields.length ? `<section class="core-decisions"><h4>本级细分选择</h4>${fields.join('')}</section>` : '';
  }

  function spellChoiceOptions(spells, selected, optionText) {
    const selectable = new Set(spells.map(spell => spell.id));
    const invalid = coreSpells.filter(spell => selected.includes(spell.id) && !selectable.has(spell.id));
    return [...spells, ...invalid].map(spell => ({id: spell.id, name: spell.name, spell,
      desc: selectable.has(spell.id) ? optionText(spell) : '这项选择已不适用，可点击移除。'}));
  }

  function renderSupplementalSpellChoices(calc) {
    const spells = calc.core.spells;
    const book = new Set(spells.known);
    const fields = spells.extraChoices.map(choice => {
      const key = 'spell:' + choice.id;
      const available = coreSpells.filter(spell => validSpellForChoice(state, choice, spell, book));
      const options = spellChoiceOptions(available, state.decisions[key] ?? [], spell =>
        (choice.mode === 'affinity' ? divineSpellAffinities[spell.id] + ' · ' : '') + spellRingName(spell.level) + ' · ' + spell.summary);
      const name = choice.level < state.level ? choice.name + ' · ' + choice.level + ' 级获得' : choice.name;
      return decisionField({...choice, name, options}, key);
    });
    const names = ids => [...new Set(ids)].map(id => coreSpells.find(spell => spell.id === id)?.name).filter(Boolean).join('、');
    const grants = [['始终准备 · 不占准备名额', spells.alwaysPrepared], ['额外习得 · 不占普通学习名额', spells.bonusKnown],
      ['种族天生魔法', spells.innate], ['专长与特性法术', spells.bonus]]
      .filter(([, ids]) => ids.length).map(([label, ids]) => `<div><dt>${label}</dt><dd>${esc(names(ids))}</dd></div>`);
    for (const {id, note} of spells.limited) {
      const name = coreSpells.find(spell => spell.id === id)?.name;
      if (name) grants.push(`<div><dt>${esc(name)}</dt><dd>${esc(note)}</dd></div>`);
    }
    return fields.length || grants.length ? `<section class="spell-editor" id="spell-features" tabindex="-1"><h3>种族、专长与特性法术</h3>
      ${fields.join('')}${grants.length ? `<dl class="spell-grants">${grants.join('')}</dl>` : ''}</section>` : '';
  }

  function renderSubclassSpellSwap(stage, rank) {
    if (!stage.swapEligible) return '';
    const from = 'bonus-swap-from:' + rank;
    const to = 'bonus-swap-to:' + rank;
    const selectedFrom = state.decisions[from] ?? [];
    const selectedTo = state.decisions[to] ?? [];
    const fromOptions = spellChoiceOptions(coreSpells.filter(spell => stage.swapOriginals.includes(spell.id)), selectedFrom,
      spell => spellRingName(spell.level) + ' · ' + spell.summary);
    if (!fromOptions.length) return '';
    const toOptions = spellChoiceOptions(stage.swapPool, selectedTo, spell => spellRingName(spell.level) + ' · ' + spell.summary);
    const hint = stage.access.swap === 'divine' ? '替换亲和法术时，只能换成牧师法表的有环法术，占本级一次常规替换。' :
      '每级可另换一个子职法术。新法术必须同环，并符合该子职的学派与来源限制。';
    return `<details class="spell-swap"${selectedFrom.length ? ' open' : ''}><summary>替换子职附赠法术</summary>
      <p class="hint">${hint}</p>${decisionField({name:'选择换出的子职法术', count:1, options:fromOptions}, from)}
      ${selectedFrom.length ? decisionField({name:'选择换入的子职法术', count:1, options:toOptions}, to) : ''}</details>`;
  }

  function renderSpellChoices(calc) {
    const {spells} = calc.core;
    const supplemental = renderSupplementalSpellChoices(calc);
    if (!spells.track) return supplemental;
    const rank = state.level;
    const stage = spells.stages.get(rank);
    const step = planStep(state, rank);
    const restriction = coreSpellRestrictions[stage.access.subclass];
    const available = stage.pool.filter(spell => !stage.bonusKnownAtLevel.has(spell.id) &&
      (!restriction || !spell.level || stage.freeSlots > 0 || restriction.schools.includes(spell.schoolCode)));
    const key = 'plan.spellsAdded';
    const options = spellChoiceOptions(available, step.spellsAdded, spell =>
      [spellRingName(spell.level), spell.school, spell.summary].join(' · '));
    branches.set(key, {label: rank + ' 级学习法术', multiple: true, options: options.map(option => ({id: option.id, title: option.name,
      caption: option.desc, listLabel: spellListOrigin(option.spell, stage.access), selected: step.spellsAdded.includes(option.id)}))});
    const selectedNames = ids => ids.map(id => coreSpells.find(spell => spell.id === id)?.name).filter(Boolean).join('、');
    const fields = [];
    if (canLearnSpells(spells)) {
      fields.push(branchButton(key, '学法术 · ' + rank + ' 级', selectedNames(step.spellsAdded) || '选择戏法与法术', key));
    }
    if (stage.freeSlots > 0) {
      const options = step.spellsAdded.map(id => coreSpells.find(spell => spell.id === id)).filter(spell => spell?.level > 0);
      branches.set('plan.freeSpells', {label: '任意学派名额 · ' + stage.freeSlots + ' 项', multiple: true,
        options: options.map(spell => ({id: spell.id, title: spell.name, caption: spell.school, selected: step.freeSpells.includes(spell.id),
          disabled: !step.freeSpells.includes(spell.id) && step.freeSpells.length >= stage.freeSlots}))});
      fields.push(branchButton('plan.freeSpells', '标记任意学派名额', selectedNames(stage.designated) || '先选择本级法术'));
    }
    if (stage.replaceAllowed || step.spellsRemoved.length) {
      const pool = [...new Set([...stage.replacementPool, ...step.spellsRemoved])];
      const label = stage.replacesCantrip ? '替换已知戏法（可选）' : '替换旧法术（可选）';
      branches.set('plan.spellsRemoved', {label, multiple: true,
        options: pool.map(id => ({id, title: coreSpells.find(spell => spell.id === id).name, selected: step.spellsRemoved.includes(id),
          disabled: !step.spellsRemoved.includes(id) && step.spellsRemoved.length >= stage.replaceAllowed}))});
      fields.push(branchButton('plan.spellsRemoved', label, selectedNames(step.spellsRemoved) || '保留现有法术', 'plan.spellsRemoved'));
    }
    if (spells.track.prepared) {
      const selected = state.preparations.filter(id => !spells.alwaysPrepared.includes(id));
      const options = spellChoiceOptions(spells.preparedPool, selected, spell => spellRingName(spell.level) + ' · ' + spell.summary);
      branches.set('preparations', {label: '准备法术 · 最多 ' + spells.preparedMax + ' 个', multiple: true,
        options: options.map(option => ({id: option.id, title: option.name, caption: option.desc,
          listLabel: spellListOrigin(option.spell, stage.access), selected: selected.includes(option.id),
          disabled: !selected.includes(option.id) && spells.prepared.length >= spells.preparedMax}))});
      fields.push(branchButton('plan-preparations', '准备法术 · ' + spells.prepared.length + '/' + spells.preparedMax,
        selectedNames(spells.prepared) || '请选择', 'preparations'));
    }
    if (state.job === 'wizard') {
      const options = spellChoiceOptions(coreSpells.filter(spell => spell.level > 0 && spell.level <= stage.max && spellListOrigin(spell, stage.access)),
        state.copiedSpells, spell => spellRingName(spell.level) + ' · ' + spell.summary);
      branches.set('copiedSpells', {label: '额外抄录进法术书', multiple: true,
        options: options.map(option => ({id: option.id, title: option.name, caption: option.desc,
          listLabel: spellListOrigin(option.spell, stage.access), selected: state.copiedSpells.includes(option.id)}))});
      fields.push(branchButton('plan-copiedSpells', '额外抄录（需有来源及费用）', state.copiedSpells.length + ' 个', 'copiedSpells'));
    }
    const stat = spells.track.stat;
    const attack = calc.mods[stat] + calc.pb;
    const listNames = [stage.access.base, ...stage.access.borrowed].map(job => classList[job][0]).join('、');
    return `<section class="spell-editor"><h3>学习与准备</h3>
      <p class="spell-list-line"><strong>${esc(listNames)}法表</strong>${stage.access.expanded.length ? ' · 含子职扩表' : ''}${stage.access.optional ? ' · 含塔莎可选扩表' : ''}</p>
      <p class="hint">${attrs[stat]}施法 · 法术攻击 ${sign(attack)} · 豁免 DC ${8 + attack} · 最高 ${stage.max} 环</p>
      <p class="hint">本级新增 ${stage.newCantrips} 个戏法、${stage.toLearn} 个有环法术。${stage.knownCount !== undefined ? '累计普通已知法术 ' + stage.knownCount + ' 个。' : ''}</p>
      ${fields.join('')}${renderSubclassSpellSwap(stage, rank)}
      <details><summary>调整保留的选择</summary><p class="hint">${esc(selectedNames(step.spellsAdded) || '本级尚未选择法术')}</p>
      <button type="button" data-action="clear-level-spells">清空本级法术选择</button>${spells.track.prepared ? '<button type="button" data-action="clear-preparations">清空准备列表</button>' : ''}</details></section>${supplemental}`;
  }

  function hasSpellTasks(spells) {
    return Boolean(spells.track || spells.innate.length || spells.bonus.length || spells.bonusKnown.length ||
      spells.alwaysPrepared.length || spells.limited.length || spells.extraChoices.length);
  }

  function canLearnSpells(spells) {
    const stage = spells.stages.get(state.level);
    return Boolean(stage && (stage.toLearn || stage.newCantrips || stage.replaceAllowed || planStep(state, state.level).spellsAdded.length));
  }

  function renderSpellTask(calc, opened) {
    const {spells} = calc.core;
    if (!hasSpellTasks(spells)) return `<div class="panel task-empty">
      <p>当前等级没有可管理的法术。</p><button type="button" data-workbench-task="treeLevel">查看升级</button></div>`;
    const fields = renderSpellChoices(calc);
    const branch = branches.has(branchKey) ? renderBranch(calc, opened) : '';
    return `<div class="task-editor${branch ? ' has-branch' : ''}"><div class="panel spell-task-fields">
      ${spells.track || spellLabels(spells).length ? `<button type="button" class="primary" data-action="spell-slots" aria-haspopup="dialog">${spells.track ? '安排法术位' : '查看已选法术'}</button>` : ''}
      ${fields}</div>${branch}</div>`;
  }

  function equipmentSlots(item) {
    if (item.kind === 'armor') return item.type === 'shield' ? ['shield'] : ['armor'];
    if (item.kind !== 'weapon') return [];
    return item.category === 'melee' && !item.properties.includes('two-handed') ?
      ['equippedWeapon', 'equippedOffhand'] : ['equippedWeapon'];
  }

  function equipmentSlotValue(item, slot) {
    if (slot === 'armor') return armorStateId(item.id);
    if (slot === 'shield') return true;
    return item.id;
  }

  function weaponInOtherHand(id, slot, quantity, equipment) {
    if (quantity !== 1 || equipment[slot] === id) return false;
    if (slot === 'equippedWeapon') return equipment.equippedOffhand === id;
    if (slot === 'equippedOffhand') return equipment.equippedWeapon === id;
    return false;
  }

  const equipmentPurposeViews = new Map();

  function equipmentTrainingNote(item, calc) {
    const training = calc.core.proficiencies;
    if (item.kind === 'armor') {
      return `<p class="hint">${training.armor.has(item.type) ? '已熟练此护甲。' : '未熟练此护甲。穿戴时，涉及力量或敏捷的检定有劣势，且无法施法。'}</p>`;
    }
    if (item.kind === 'weapon') {
      const note = weaponTrained(item, training) ? '已熟练此武器。攻击检定计入熟练加值。' : '未熟练此武器。攻击检定只计入适用的属性调整值等加值。';
      return `<p class="hint">${note}</p>${item.properties.includes('two-handed') ? '<p class="hint">攻击时占用双手。装备后会移除盾牌和副手武器。</p>' : ''}`;
    }
    return '';
  }

  function renderEquipmentUse(key, item) {
    const calc = calculate();
    const slot = equipmentSlots(item)[0];
    if (!slot) return '';
    if (key === 'registerItem') {
      return '<section class="preview-impact"><h3>登记后</h3><p>物品会进入背包。到背包装备后才会计入角色数值。</p></section>';
    }
    if (key === 'shopItem') {
      return `<section class="preview-impact"><h3>买下后</h3><p>物品会进入背包。到背包装备后才会计入角色数值。</p>
        ${equipmentTrainingNote(item, calc)}</section>`;
    }
    const equipped = calc.core.equipment[slot] === equipmentSlotValue(item, slot);
    const draft = structuredClone(state);
    if (!equipped) setBuildField(draft, slot, equipmentSlotValue(item, slot));
    const after = equipped ? calc : calculate(normalize(draft));
    const facts = [];
    if (item.kind === 'armor') facts.push(['你的穿戴后 AC', `AC ${calc.ac} → ${after.ac}`]);
    if (item.kind === 'weapon' && after.core.equipment.equippedWeapon === item.id) {
      facts.push(['你的攻击检定', 'd20 ' + sign(after.core.attack.hit)], ['你的命中伤害', after.core.attack.damage]);
    }
    if (after.speed !== calc.speed) facts.push(['速度', calc.speed + ' → ' + after.speed]);
    if (calc.core.equipment.shield && !after.core.equipment.shield) facts.push(['手部装备', '盾牌将卸下']);
    if (calc.core.equipment.equippedOffhand && !after.core.equipment.equippedOffhand) facts.push(['手部装备', '副手武器将卸下']);
    if (slot === 'shield' && calc.core.equipment.equippedWeapon && !after.core.equipment.equippedWeapon) facts.push(['手部装备', '主手武器将卸下']);
    const copies = calc.core.inventory.find(entry => entry.id === item.id)?.quantity;
    const inOffhand = item.kind === 'weapon' && weaponInOtherHand(item.id, slot, copies, calc.core.equipment);
    const note = inOffhand ? '当前在副手。如只有一件，请先卸下副手再换到主手。' :
      equipped ? '已经装备，当前数值已计入。' : '以下为在背包装备后的数值。';
    return `<section class="preview-impact"><h3>装备效果</h3><p>${note}</p>
      ${equipmentTrainingNote(item, calc)}${inOffhand && !equipped ? '' : previewFacts(facts)}</section>`;
  }

  function equipmentFilterHeader(items, selected, count) {
    return renderPurposeFilter(items.map(equipmentPurposes), selected) +
      `<p class="hint" data-equipment-count role="status">显示 ${count} / ${items.length} 项</p>` +
      purposeNoResults(selected, count > 0);
  }

  function filterEquipmentPurposes(panel) {
    const key = panel.dataset.equipmentPurposeList;
    const purposes = selectedPurposes(panel);
    const search = panel.querySelector('[data-shop-search]');
    const query = search?.value ?? '';
    equipmentPurposeViews.set(key, {purposes, query});
    let count = 0;
    const items = panel.querySelectorAll('[data-equipment-tags]');
    for (const item of items) {
      item.hidden = !matchesPurposes(item.dataset.equipmentTags.split(' '), purposes) ||
        !!search && !item.dataset.shopText.includes(query.trim().toLocaleLowerCase());
      if (!item.hidden) count++;
    }
    updatePurposeEmpty(panel, purposes, count);
    panel.querySelector('[data-equipment-count]').textContent = CharacterLocale.text(`显示 ${count} / ${items.length} 项`);
  }

  function renderBackpack(inventory, equipment) {
    const actions = {
      armor: ['穿戴', '已穿戴'],
      shield: ['装备盾牌', '已装备盾牌'],
      equippedWeapon: ['装备主手', '已装备主手'],
      equippedOffhand: ['装备副手', '已装备副手'],
    };
    const items = inventory.map(({id}) => coreRules.items[id]);
    const available = new Set(items.flatMap(equipmentPurposes));
    const selected = (equipmentPurposeViews.get('backpack')?.purposes ?? []).filter(tag => available.has(tag));
    let count = 0;
    const rows = inventory.map(({id, quantity}) => {
      const item = coreRules.items[id];
      const tags = equipmentPurposes(item);
      const visible = matchesPurposes(tags, selected);
      if (visible) count++;
      const equip = equipmentSlots(item).map(slot => {
        const [label, equippedLabel] = actions[slot];
        const equipped = equipment[slot] === equipmentSlotValue(item, slot);
        if (equipped) return `<span class="inventory-equipped">${equippedLabel}</span>`;
        const inUse = weaponInOtherHand(id, slot, quantity, equipment);
        return `<button type="button" data-equip-item="${esc(id)}" data-equip-slot="${slot}"
          aria-label="${label} · ${esc(item.name)}"${inUse ? ' disabled title="仅有一件，已在另一只手上"' : ''}>${label}</button>`;
      }).join('');
      return `<li data-backpack-item="${esc(id)}" data-equipment-tags="${tags.join(' ')}"${visible ? '' : ' hidden'} tabindex="-1"><strong>${esc(item.name)} × ${quantity}</strong>
        <small>${esc(equipmentSummary(item, true))}</small>
        ${equipmentUse(item) ? `<small>${esc(featureCaption(item.name, equipmentUse(item)))}</small>` : ''}
        <div class="inventory-actions">${equip}<button type="button" class="branch-link" data-inventory-rule="${esc(id)}"
          aria-haspopup="dialog" aria-label="查看${esc(item.name)}的详情">详情</button></div></li>`;
    }).join('');
    return `<section class="equipment-backpack" data-equipment-purpose-list="backpack" aria-labelledby="equipment-backpack-title"><h4 id="equipment-backpack-title" tabindex="-1">背包 · ${inventory.length} 种物品</h4>
      <div class="equipment-shop-bar"><button type="button" data-action="register-equipment" aria-haspopup="dialog">登记已有装备</button></div>
      ${rows ? equipmentFilterHeader(items, selected, count) + '<ul class="inventory-list">' + rows + '</ul>' : '<p class="hint">选好的起始装备和买到的物品会出现在这里。</p>'}
      ${state.inventory.length ? '<details><summary>管理购买记录</summary><button type="button" data-action="empty-inventory">清空已购买物品</button></details>' : ''}</section>`;
  }

  function renderWornEquipment(calc) {
    const {proficiencies, equipment: worn} = calc.core;
    const owned = new Map(calc.core.inventory.map(item => [item.id, item.quantity]));
    const custom = state.job === 'custom';
    const druid = state.job === 'druid';
    const typicalDruidArmor = new Set(['padded', 'leather', 'studded', 'hide']);
    const equipment = Object.values(coreRules.items).filter(item => item.kind === 'armor' || item.kind === 'weapon');
    const slotField = (key, label, fallback, currentItem) => {
      const items = equipment.filter(item => equipmentSlots(item).includes(key));
      const options = items.filter(item => owned.has(item.id)).map(item => {
        const armor = item.kind === 'armor';
        const value = equipmentSlotValue(item, key);
        const trained = armor ? proficiencies.armor.has(item.type) : weaponTrained(item, proficiencies);
        const material = armor && druid && !typicalDruidArmor.has(value) ? '通常含金属，和 DM 确认材质' : '';
        const training = custom ? '' : trained ? '熟练' : armor ? '未熟练 · 无法施法' : '未熟练 · 命中不加熟练加值';
        const inUse = weaponInOtherHand(item.id, key, owned.get(item.id), worn);
        const status = [training, material,
          inUse ? '仅有一件，已在另一只手上' : ''].filter(Boolean).join(' · ');
        return {id: value, title: item.name, caption: '', listLabel: status, selected: worn[key] === value, disabled: inUse};
      });
      const [emptyId, emptyTitle, caption = ''] = fallback;
      options.unshift({id: emptyId, title: emptyTitle, caption, selected: worn[key] === emptyId});
      branches.set(key, {label, options});
      return branchButton(key, label, currentItem?.name ?? emptyTitle);
    };
    const hasShieldTraining = proficiencies.armor.has('shield');
    const hasShield = owned.has('shield');
    const shield = hasShield ?
      `<label class="check"><input type="checkbox" data-key="shield" data-focus="shield"${worn.shield ? ' checked' : ''}>
        装备${druid ? '木制盾牌' : '盾牌'} · AC +2${!hasShieldTraining && !custom ? ' · 未熟练，无法施法' : ''}</label>` : '';
    const classNote = druid ? '德鲁伊通常使用非金属护甲和木盾。需要其他护甲时，可和 DM 确认是否有非金属版本。' :
      state.job === 'monk' ? '武僧穿护甲或装备盾牌时无法使用武艺与无甲移动。' : '';
    const armor = armorItem(worn.armor);
    const mainWeapon = coreRules.items[worn.equippedWeapon];
    const offhand = coreRules.items[worn.equippedOffhand];
    const untrainedWorn = [
      armor && !proficiencies.armor.has(armor.type) ? armor.name : '',
      worn.shield && !hasShieldTraining ? '盾牌' : '',
      ...[mainWeapon, offhand].filter(item => item && !weaponTrained(item, proficiencies)).map(item => item.name),
    ].filter(Boolean);
    return `<h4 id="equipment-worn-title" tabindex="-1">穿戴装备</h4><p class="hint">这里显示背包里的装备。换成盾牌、副手武器或双手握持时，会自动腾出需要的手。</p>` +
      (classNote ? `<p class="hint">${classNote}</p>` : '') +
      (worn.unlisted.length ? `<p class="hint equipment-unlisted-warning">未入包，已停止计入数值 · ${esc(worn.unlisted.join('、'))}</p>` : '') +
      (worn.handConflict ? '<p class="hint equipment-training-warning">旧记录的手部装备互相冲突。当前数值采用可同时使用的装备。</p>' : '') +
      (worn.unlisted.length || worn.handConflict ? '<button type="button" data-action="clear-inactive-equipment">清除已停用的穿戴记录</button>' : '') +
      (!custom && untrainedWorn.length ? `<p class="hint equipment-training-warning">当前穿戴但未熟练 · ${esc([...new Set(untrainedWorn)].join('、'))}</p>` : '') +
      slotField('armor', '穿着护甲', ['none', '无甲', '通常 AC 10 + 敏捷调整值'], armor) + shield +
      slotField('equippedWeapon', '主手武器', ['', '徒手打击'], mainWeapon) +
      `<label class="check"><input type="checkbox" data-key="magicArmor"${state.magicArmor ? ' checked' : ''}>法师护甲已生效</label>` +
      (mainWeapon?.versatile ? branchField('weaponGrip', '两用武器握持', [['one', '单手'], ['two', '双手', '会腾出副手']], worn.weaponGrip) : '') +
      slotField('equippedOffhand', '副手武器', ['', '无副手武器'], offhand);
  }

  function renderCoreEquipment(calc, opened) {
    const cls = coreRules.classes[state.job];
    const {inventory, gold, proficiencies} = calc.core;
    const startingGroups = state.equipmentMode === 'pack' ? cls?.equipment ?? [] : [];
    const branchesHtml = startingGroups.map(group => {
      const field = branchField('equipmentChoices.' + group.id, group.label, group.options.map(option => [option.id, option.name, option.note ?? '']), state.equipmentChoices[group.id]);
      for (const option of branches.get('equipmentChoices.' + group.id).options) {
        option.disabled = !startingEquipmentAvailable(group.options.find(entry => entry.id === option.id), proficiencies);
      }
      const selected = group.options.find(option => option.id === state.equipmentChoices[group.id]);
      if (!selected?.pick) return field;
      const available = equipmentPickPool(selected.pick).map(item => [item.id, item.name, item.note ?? '']);
      return field + Array.from({length: selected.pick.count}, (_, index) => {
        const key = 'gear:' + group.id + ':' + index;
        return branchField('decision.' + key, group.label + ' · 第 ' + (index + 1) + ' / ' + selected.pick.count + ' 件',
          available, state.decisions[key]?.[0]);
      }).join('');
    }).join('');
    const startingEquipment = cls ? `<div class="mode-buttons"><button type="button" data-equipment-mode="pack" aria-pressed="${state.equipmentMode === 'pack'}">起始装备</button>
      <button type="button" data-equipment-mode="gold" aria-pressed="${state.equipmentMode === 'gold'}">起始财富</button></div>` +
      (state.equipmentMode === 'pack' ? branchesHtml : `<p class="hint">掷 ${cls.wealth.count}d${cls.wealth.dice} × ${cls.wealth.multiplier} gp，以购置方式取得全部起始装备。</p>
        ${input('wealthRoll', '起始财富骰子合计', state.wealthRoll, 'type="number" min="0" max="1000"')}`) :
      '<p class="hint">可在下方记录此职业的起始装备。</p>';
    return lane('05', '装备与护甲', `<nav class="equipment-jumps" aria-label="装备快捷入口">
        <button type="button" data-equipment-jump="equipment-start-title">起始装备</button>
        <button type="button" data-equipment-jump="equipment-backpack-title">背包</button>
        <button type="button" data-equipment-jump="equipment-worn-title">穿戴</button>
        <button type="button" data-action="equipment-shop" aria-haspopup="dialog">商店</button>
      </nav><h4 id="equipment-start-title" tabindex="-1">起始装备或金币</h4>` + startingEquipment + `<div class="equipment-shop-bar">
        <p class="equipment-gold">可用金币 <strong>${gold} gp</strong></p>
      </div>` + renderBackpack(inventory, calc.core.equipment) + renderWornEquipment(calc) +
      input('gear', '其他装备补记', state.gear, 'maxlength="200"') +
      details('custom-attack', '手填武器与攻击', input('weaponName', '主武器名称', state.weaponName, 'maxlength="40"') +
        input('weaponDie', '基础伤害骰与类型', state.weaponDie, 'maxlength="20"') +
        branchField('attackAbility', '攻击使用属性', abilityOptions, state.attackAbility) +
        `<label class="check"><input type="checkbox" data-key="attackTraining"${state.attackTraining ? ' checked' : ''}>此武器有熟练</label>`, opened));
  }

  function equipmentPickPool(pick) {
    return Object.values(coreRules.items).filter(item => pick.type === 'instrument' ? item.kind === 'instrument' : item.kind === 'weapon' &&
      (!pick.pool || (pick.pool.includes('simple') ? item.type === 'simple' : item.type === 'martial')) && (!pick.pool?.includes('melee') || item.category === 'melee'));
  }

  function equipmentPickBranch(build, groupId, {first = false} = {}) {
    const group = coreRules.classes[build.job]?.equipment.find(entry => entry.id === groupId);
    const pick = group?.options.find(option => option.id === build.equipmentChoices[groupId])?.pick;
    if (!pick) return '';
    const options = equipmentPickPool(pick);
    const keys = Array.from({length: pick.count}, (_, index) => 'gear:' + groupId + ':' + index);
    const pending = keys.find(key => !options.some(item => item.id === build.decisions[key]?.[0]));
    const key = pending ?? (first ? keys[0] : null);
    return key ? 'decision.' + key : '';
  }

  function renderBackgroundExtras() {
    const background = coreRules.backgrounds[state.background];
    if (!background) return '';
    const fields = Array.from({length: background.languageCount}, (_, index) => branchField('backgroundLanguages.' + index, '背景语言 ' + (index + 1),
      [['', '请选择'], ...langs.filter(language => !ancestries[state.ancestry][5].includes(language) && !state.languages.includes(language) &&
        !state.backgroundLanguages.some((other, i) => i !== index && other === language))], state.backgroundLanguages[index]));
    const tool = background.tools.find(tool => /自选|选择|任选/.test(tool));
    if (tool) {
      const pool = /工匠/.test(tool) ? coreRules.toolPools.artisan : /乐器/.test(tool) ? coreRules.toolPools.instruments : /赌具/.test(tool) ? coreRules.toolPools.gaming : coreRules.toolPools.all;
      fields.push(skillBranch('backgroundTools', '背景工具', pool, state.backgroundTools, 1, []));
    }
    return fields.join('') + `<p class="hint">${esc(background.feature)}</p>`;
  }

  function currentBranchValues(key, build = state) {
    if (key.startsWith('decision.')) return build.decisions[key.slice(9)] ?? [];
    if (key.startsWith('plan.')) return planStep(build, build.level)[key.slice(5)] ?? [];
    return build[key] ?? [];
  }

  function setNameEditing(editing) {
    const form = root.querySelector('[data-form="character-name"]');
    const row = root.querySelector('.character-name-row');
    const input = form.elements.name;
    form.hidden = !editing;
    row.hidden = editing;
    if (editing) {
      input.value = state.name;
      input.focus();
      input.select();
    } else row.querySelector('button').focus({preventScroll: true});
  }

  const themeOptions = new Map([
    ['binding-oxblood', ['绯红典藏', '酒红皮革 · 金色卷叶']],
    ['binding-teal', ['星海罗盘', '深海青皮革 · 金色罗盘']],
    ['binding-forest', ['翠林古卷', '墨绿皮革 · 交织花纹']],
    ['binding-navy', ['骑士誓约', '午夜蓝皮革 · 剑与桂叶']],
    ['parchment', ['羊皮纸', '暖米白 · 墨蓝 · 赤铜']],
    ['daylight', ['晴空', '白底 · 浅蓝 · 深蓝文字']],
    ['nautical', ['海图', '雾蓝 · 深海青 · 古铜']],
    ['woodland', ['林地', '苔绿 · 骨白 · 赭金']],
    ['twilight', ['暮紫', '灰紫 · 李子色 · 莓红']],
  ]);
  const themeStorageKey = 'dnd-2014-workbench-theme-v2';

  function restoreTheme() {
    try {
      const saved = localStorage.getItem(themeStorageKey);
      if (themeOptions.has(saved)) document.documentElement.dataset.workbenchTheme = saved;
    } catch {
      // The default palette also works without access to browser storage.
    }
  }

  function chooseTheme(theme) {
    if (!themeOptions.has(theme)) return;
    document.documentElement.dataset.workbenchTheme = theme;
    for (const button of root.querySelectorAll('[data-theme-option]')) {
      button.setAttribute('aria-pressed', String(button.dataset.themeOption === theme));
    }
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch {
      root.querySelector('[data-theme-note]').textContent = CharacterLocale.text('已切换配色。当前浏览器无法记住这项设置。');
    }
  }

  function openThemePicker() {
    const current = document.documentElement.dataset.workbenchTheme || 'parchment';
    const cards = cover => [...themeOptions].filter(([id]) => id.startsWith('binding-') === cover).map(([id, [name, colors]]) => {
      const preview = cover
        ? `<span class="theme-cover-sample" data-theme-preview="${id}" aria-hidden="true"></span>`
        : `<span class="theme-sample" data-theme-preview="${id}" aria-hidden="true">
          <span class="theme-sample-hologram">${portraitMarkup()}</span>
          <span class="theme-sample-stats"><span class="theme-sample-stat">${hudIcon('eye')}感知 <strong>14</strong></span>
            <span class="theme-sample-selection">已选</span></span>
        </span>`;
      return `<button type="button" class="theme-option" data-theme-option="${id}" aria-pressed="${id === current}">
        ${preview}
        <span class="theme-option-title"><strong>${name}</strong><span class="theme-current" aria-hidden="true">使用中</span></span>
        <small>${colors}</small>
      </button>`;
    }).join('');
    openDialog('工作台配色', `<p class="hint" data-theme-note role="status">点选一种风格，立即应用到建卡器。</p>
      <div class="theme-options theme-cover-options" role="group" aria-label="皮革封面风格">${cards(true)}</div>
      <details class="theme-more"><summary>原有配色</summary>
        <div class="theme-options" role="group" aria-label="原有配色">${cards(false)}</div>
      </details>`, 'theme-dialog');
  }

  function openDialog(title, content, className = '') {
    root.querySelector('#workbench-dialog')?.remove();
    const dialog = document.createElement('dialog');
    dialog.id = 'workbench-dialog';
    dialog.className = className;
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.innerHTML = `<form method="dialog" class="dialog-heading"><h2 id="dialog-title">${esc(title)}</h2><button aria-label="关闭窗口">关闭</button></form><div class="dialog-content">${content}</div>`;
    CharacterLocale.localize(dialog);
    root.append(dialog);
    dialog.addEventListener('close', () => dialog.remove());
    dialog.showModal();
    dialog.style.setProperty('--dialog-heading-height', dialog.querySelector('.dialog-heading').offsetHeight + 'px');
    queuePageGuideHighlight();
    return dialog;
  }

  function downloadFile(filename, text, type = 'application/json;charset=utf-8') {
    const url = URL.createObjectURL(new Blob([text], {type}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportCharacter() {
    downloadFile((state.name || CharacterLocale.text('角色')) + CharacterLocale.text('-完整存档.json'), JSON.stringify({format: 'dnd2014-character', schemaVersion: 2, build: state}, null, 2));
  }

  function publicSummary() {
    const build = {...state, level: state.actualLevel};
    const calc = calculate(build);
    const t = CharacterLocale.text;
    const job = state.job === 'custom' && state.customClassName.trim() ? classSpec(state)[0] : t(classSpec(state)[0]);
    const background = state.background === 'custom' && state.backgroundName.trim() ? backgroundName() : t(backgroundName());
    const lines = [state.name || t('角色卡'), 'D&D 2014 · ' + t(state.actualLevel + ' 级') + ' ' + job,
      t('背景') + ' · ' + background, attrs.map((name, index) => t(name) + ' ' + calc.totals[index]).join(' · '),
      `HP ${calc.hp} · AC ${calc.ac} · ${t('先攻')} ${sign(calc.initiative)} · ${t('速度')} ${t(calc.speed + ' 尺')}`,
      t('技能熟练') + ' · ' + t([...calc.proficiencies].join('、')), t('专精') + ' · ' + t([...calc.expertise].join('、'))];
    if (state.publicFields.ancestry) lines.push(t('种族') + ' · ' + t(ancestries[state.ancestry][0]));
    if (state.publicFields.features) {
      const features = growthLevels.slice(0, state.actualLevel).flatMap(level => [
        ...(coreRules.classFeatures[state.job]?.[level] ?? []),
        ...(coreRules.subclassFeatures[state.job]?.[coreSubclass(build)]?.[level] ?? [])]);
      lines.push(...features.map(feature => t(feature.name) + ' · ' + t(feature.desc)));
      if (state.publicFields.ancestry) lines.push(...(coreRules.races[state.ancestry]?.features ?? []).map(feature => t(feature.name) + ' · ' + t(feature.desc)));
    }
    if (state.publicFields.notes) lines.push(t('角色补记') + ' · ' + state.backgroundNote, ...growthLevels.slice(0, state.actualLevel).map(level => planStep(state, level).note).filter(Boolean));
    return lines.join('\n');
  }

  function openShareDialog() {
    openDialog('公开分享预览', `<p>勾选希望同学看见的内容，下载前可以检查下方预览。</p>
      <div class="privacy-options">${[['ancestry', '公开种族'], ['features', '公开职业能力'], ['notes', '公开补记']].map(([key, label]) =>
        `<label class="check"><input type="checkbox" data-public-field="${key}"${state.publicFields[key] ? ' checked' : ''}>${label}</label>`).join('')}</div>
      <pre class="share-preview" data-share-preview data-user-text>${esc(publicSummary())}</pre>
      <button type="button" class="primary" data-action="download-summary">下载这个公开摘要</button>`);
  }

  function rawRecoveryArchive() {
    try {return recoveryArchive || storage.getItem(libraryKey + '/recovery');}
    catch {return recoveryArchive;}
  }

  function syncWorkbenchLanguage() {
    document.documentElement.lang = CharacterLocale.language;
    document.title = CharacterLocale.text('建卡工作台 · D&D 2014');
  }

  function openLibrary() {
    if (!pendingSave && !persistenceError) {
      try {if (mergeStoredLibrary()) render();} catch {}
    }
    const full = library.characters.length >= CharacterLibrary.limit;
    openDialog('设置', `<label>界面语言<select data-workbench-language aria-label="界面语言">
        <option lang="zh-CN" data-user-text value="zh-CN"${CharacterLocale.language === 'zh-CN' ? ' selected' : ''}>简体中文</option>
        <option lang="en" value="en"${CharacterLocale.language === 'en' ? ' selected' : ''}>English</option>
      </select></label>
      <h3>角色管理</h3>
      <label>切换角色<select data-library-select>${library.characters.map(item => {
        const build = item.build;
        const name = build.name || CharacterLocale.text('未命名角色');
        const job = build.job === 'custom' && build.customClassName.trim() ? classSpec(build)[0] : CharacterLocale.text(classSpec(build)[0]);
        return `<option data-user-text value="${esc(item.id)}"${item.id === library.activeId ? ' selected' : ''}>${esc(name)} · ${esc(job)}</option>`;
      }).join('')}</select></label>
      <div class="dialog-actions"><button type="button" class="primary" data-action="new-blank"${full ? ' disabled' : ''}>从空白建卡</button>
        <button type="button" data-action="new-character"${full ? ' disabled' : ''}>用战士示例</button><button type="button" data-action="copy-character"${full ? ' disabled' : ''}>复制当前角色</button></div>
      ${full ? '<p class="hint">角色库已达 200 张。导出备份并移除部分角色后，可以再新建或导入。</p>' : ''}
      <div class="dialog-actions">
        <button type="button" data-action="export">分享角色</button><button type="button" data-action="download-tool">下载离线工具</button></div>
      <p class="hint">角色自动保存在当前浏览器。完整存档包含私人资料，可导入另一台设备。</p>
      <div class="dialog-actions"><button type="button" data-action="export-character">导出当前角色 · 完整存档</button>
        <button type="button" data-action="export-library">导出整个角色库 · 完整备份</button>
        <button type="button" data-action="import-archive"${full ? ' disabled' : ''}>导入 JSON 存档</button>
        ${rawRecoveryArchive() ? '<button type="button" data-action="export-recovery">下载原始恢复备份</button>' : ''}</div>
      <p role="status">${esc(persistenceError || notice || '当前角色库已保存')}</p>
      <label>重命名当前角色<input data-rename-character value="${esc(state.name)}" maxlength="90"></label>
      <button type="button" data-action="rename-character">保存名称</button>
      <hr><button type="button" class="danger" data-action="ask-delete">删除当前角色</button>
      <details><summary>DM 规则开关</summary><div class="small-stack">
        ${[['feats', '允许专长'], ['variantHuman', '允许变体人类'], ['tashaSpells', '启用《塔莎》可选职业扩表']].map(([key, label]) => `<label class="check"><input type="checkbox" data-rule-switch="${key}"${state.rules[key] ? ' checked' : ''}>${label}</label>`).join('')}
      </div></details>`);
  }

  function resetEditor() {
    activeTask = 'home';
    taskViews.clear();
    historyViews.clear();
    viewId = ++nextViewId;
    window.history?.replaceState({...window.history.state, [historyTaskKey]: activeTask, [historyViewKey]: viewId}, '');
    homeFocus = '';
    branchKey = '';
    treeCategory = '';
    treeView = 'all';
    branchOpener = '';
    growthExpanded = false;
    undoBuild = null;
    growthDrafts.clear();
    branchFilters.clear();
    branchPurposeSelections.clear();
    equipmentPurposeViews.clear();
    branchSpellRings.clear();
    previewedChoice = null;
    optionComparisons.clear();
    subclassComparisons.clear();
    subclassComparisonOpen = false;
  }

  function switchCharacter(id, persist = true) {
    const entry = library.characters.find(item => item.id === id);
    if (!entry) return;
    library.activeId = id;
    state = structuredClone(entry.build);
    resetEditor();
    if (persist) persistLibrary();
    render();
    root.querySelector('[data-action="library"]').focus({preventScroll: true});
  }

  async function addCharacters(makeRecords, imported = false) {
    await save();
    const add = () => {
      mergeStoredLibrary();
      const records = makeRecords();
      if (library.characters.length + records.length > CharacterLibrary.limit) {
        throw new Error('角色库最多保留 200 个角色，请先备份整理。');
      }
      library.characters.push(...records);
      if (imported) notice = '已导入 ' + records.length + ' 个角色，原角色已保留。';
      switchCharacter(records[0].id, false);
      commitLibrary();
    };
    if (globalThis.navigator?.locks) await navigator.locks.request(libraryKey, add);
    else add();
  }

  async function newCharacter(kind) {
    try {
      await addCharacters(() => {
        const build = kind === 'copy' ? structuredClone(state) : kind === 'blank' ? createBlankBuild() : createStarterBuild();
        if (kind === 'copy') {
          build.name = ((state.name || '角色').slice(0, 80) + ' · 副本');
          build.starterExample = false;
        }
        return [CharacterLibrary.record(build)];
      });
      if (kind === 'blank') openTask('ancestry');
    } catch (error) {
      openDialog('无法新建角色', `<p role="alert">${esc(error.message)}</p>`);
    }
  }

  function openShop({scrollTop = 0, bought, register = false} = {}) {
    const key = register ? 'register' : 'shop';
    const {query = '', purposes = []} = equipmentPurposeViews.get(key) ?? {};
    const gold = register ? null : calculate().core.gold;
    const buttonLabel = register ? '登记' : '购买';
    const status = register ? '用于登记团里已经获得的物品。' : '剩余 ' + gold + ' gp';
    const items = Object.values(coreRules.items);
    let count = 0;
    const rows = items.map(item => {
      const summary = equipmentSummary(item, true);
      const use = featureCaption(item.name, equipmentUse(item));
      const tags = equipmentPurposes(item);
      const searchText = optionSearchText([item.name, summary, use, equipmentUse(item), ...tags.flatMap(tag => purposeLabels[tag])]);
      const visible = matchesPurposes(tags, purposes) && searchText.includes(query.trim().toLocaleLowerCase());
      if (visible) count++;
      return `<div data-shop-item="${esc(item.name)}" data-shop-text="${esc(searchText)}" data-equipment-tags="${tags.join(' ')}"${visible ? '' : ' hidden'}>
        <div class="shop-item-title">${optionIllustration('shopItem', {id: item.id, title: item.name})}<span><strong>${esc(item.name)}</strong>
        <small>${esc(summary)}</small>${use ? `<small>${esc(use)}</small>` : ''}</span></div>
        <div class="shop-item-actions"><button type="button" data-shop-rule="${esc(item.id)}"${register ? ' data-register-item' : ''} aria-haspopup="dialog" aria-label="查看${esc(item.name)}的详情">详情</button><button type="button" data-buy-item="${esc(item.id)}"${register ? ' data-register-item' : ''} aria-label="${buttonLabel}${esc(item.name)}">${buttonLabel}</button></div></div>`;
    }).join('');
    const dialog = openDialog(register ? '登记已有装备' : '购置装备', `<div data-equipment-purpose-list="${key}">
      <label>搜索装备<input type="search" data-shop-search placeholder="名称、武器特性或数值" value="${esc(query)}"></label>
      <p data-shop-gold role="status">${bought ? '已放入背包 · ' + esc(bought.name) + (register ? '' : ' · ' + status) : status}</p>
      ${equipmentFilterHeader(items, purposes, count)}
      <div class="shop-list">${rows}</div></div>`, 'equipment-shop-dialog');
    if (bought) {
      dialog.scrollTop = scrollTop;
      dialog.querySelector(`[data-buy-item="${CSS.escape(bought.id)}"]`)?.focus({preventScroll: true});
    }
    dialog.addEventListener('close', () => root.querySelector(register ? '[data-action="register-equipment"]' : '[data-action="equipment-shop"]')?.focus({preventScroll: true}));
  }

  function renderCoverage() {
    const jobs = Object.keys(coreRules.classes);
    return `<section class="coverage-panel panel small-stack"><h3>2014 规则覆盖</h3>
      <p>「自动计算」表示已接入角色数值，「规则说明」表示可在此阅读使用条件，「需手填」表示当前仅提供目录或补记。</p>
      <table><thead><tr><th>内容</th><th>已收录</th><th>范围</th></tr></thead><tbody>
      <tr><td>核心职业</td><td>${jobs.length}</td><td>单职业 1–20 级</td></tr>
      <tr><td>核心种族与变体</td><td>${Object.keys(coreRules.races).length}</td><td>属性、熟练与特性说明</td></tr>
      <tr><td>核心专长</td><td>${coreRules.feats.length}</td><td>前提、自选项与效果说明</td></tr>
      <tr><td>旧版法术</td><td>${coreSpells.length}</td><td>核心与扩展法术，附职业法表及施法参数</td></tr>
      </tbody></table>
      <p>中文条目使用简明摘要。扩展条目按原有收录程度显示。遇到团规可使用手填选项。</p>
      <p class="hint">核对来源 · ${coreRules.verification.sources.map(source => linkTo(source.url, source.name)).join(' · ')}</p>
      <details><summary>术语速查</summary><dl class="glossary">
        <dt>调整值</dt><dd>总属性减 10，除以 2 后向下取整。检定通常使用调整值。</dd>
        <dt>熟练与专精</dt><dd>熟练让相关检定加熟练加值，专精通常改为双倍。重复来源不会再叠加。</dd>
        <dt>优势与劣势</dt><dd>掷两次 d20，优势取较高，劣势取较低，同时存在则抵消。</dd>
        <dt>动作、附赠动作与反应</dt><dd>它们分别计数。拥有能力提供的条件时才能使用对应附赠动作或反应。</dd>
        <dt>准备法术与法术位</dt><dd>准备列表决定当日能施放哪些法术，法术位是施放多数有环法术消耗的资源。</dd>
      </dl></details></section>`;
  }

  function openChecklistEditor(task, key, target = '#task-title', level = state.actualLevel) {
    if (level !== state.level) return setLevel(level, true, {task, key: key ?? taskDefaultBranches[task] ?? '', target});
    return openTask(task, key, target);
  }

  function openBuildTask(task, build = checklistBuild(), calc = calculate(build)) {
    const openBranch = (key = task) => openChecklistEditor(task, key, key ? '#branch-panel' : '#task-title');
    if (build.pendingIdentity.includes(task)) return openChecklistEditor(task);
    if (task === 'scores' || task === 'spells') return openChecklistEditor(task);
    if (task === 'treeLevel') {
      const issueLevel = calc.issues.filter(issue => !calc.core.spells.issues.includes(issue))
        .map(issue => Number(issue.match(/^(\d+)\s*级/)?.[1])).find(level => level <= build.level);
      return openChecklistEditor(task, '', '#level-detail', issueLevel ?? build.level);
    }
    if (task === 'ancestry') {
      const language = build.languages.findIndex(value => !value);
      const duplicate = build.languages.findIndex(value => build.backgroundLanguages.includes(value));
      if (language < 0 && duplicate >= 0) return openBranch(`languages.${duplicate}`);
      const branch = calc.issues.includes('种族技能未选满') ? 'ancestrySkills' : language >= 0 ? `languages.${language}` : 'ancestry';
      return openBranch(branch);
    }
    if (task === 'job') {
      const unlock = activeTrack(build).sub[0];
      if (build.level >= unlock && !calc.subclass) {
        if (build.job === 'custom') return openChecklistEditor('treeLevel', '', '#level-detail', unlock);
        return openBranch(build.job === 'rogue' ? 'subclass' : 'careerSubclass');
      }
      return openBranch(calc.issues.some(issue => /职业技能/.test(issue)) ? 'jobSkills' : 'job');
    }
    if (task === 'background') {
      const skill = build.backgroundSkills.findIndex(value => !value);
      const language = build.backgroundLanguages.findIndex(value => !value);
      if (skill >= 0 && build.background === 'custom' && !build.backgroundName.trim()) return openBranch();
      if (skill >= 0) return openBranch(`backgroundSkills.${skill}`);
      if (language >= 0) return openBranch(`backgroundLanguages.${language}`);
      if (calc.issues.includes('背景工具尚未选择')) return openBranch('backgroundTools');
      const expertise = build.expertise.findIndex((value, i) => !calc.expertise.has(value) || build.expertise.indexOf(value) !== i);
      if (build.job === 'rogue' && expertise >= 0) return openBranch(`expertise.${expertise}`);
      return openBranch();
    }
    if (build.equipmentMode === 'gold' && calc.issues.some(issue => /金币|起始财富/.test(issue))) {
      return openChecklistEditor('armor', '', '[data-key="wealthRoll"]');
    }
    if (calc.core.equipment.unlisted.length || calc.core.equipment.handConflict) {
      return openChecklistEditor('armor', '', '#equipment-worn-title');
    }
    return openBranch(missingEquipmentBranch(build) || 'armor');
  }

  function handleWorkbenchClick(button, event) {
    const {action} = button.dataset;
    const sectionJump = button.dataset.equipmentJump ?? button.dataset.sheetJump;
    if (sectionJump) {
      reveal('#' + CSS.escape(sectionJump), {focus: true});
      return true;
    }
    if (button.dataset.spellJump) {
      button.closest('dialog')?.close();
      const destination = button.dataset.spellJump;
      const features = destination === 'spell-features';
      openTask('spells', features ? '' : destination, features ? '#spell-features' : '#branch-panel');
      return true;
    }
    if (button.dataset.themeOption) {chooseTheme(button.dataset.themeOption); return true;}
    if (handleRuleCardClick(button)) return true;
    if (button.hasAttribute('data-apply-choice')) {chooseBranch(button.dataset.applyChoice); return true;}
    if (button.hasAttribute('data-compare-choice')) {
      const id = button.dataset.compareChoice;
      const current = optionComparisons.get(branchKey) ?? [];
      optionComparisons.set(branchKey, current.includes(id) ? current.filter(value => value !== id) : [...current.slice(-1), id]);
      render(); return true;
    }
    if (button.dataset.treeView) {treeView = button.dataset.treeView; render(); return true;}
    if (button.hasAttribute('data-issue')) {
      const build = checklistBuild();
      const calc = calculate(build);
      const issue = [...new Set(calc.issues)][Number(button.dataset.issue)];
      if (!issue) return true;
      const level = Number(issue.match(/^(\d+)\s*级/)?.[1]);
      if (calc.core.spells.issues.includes(issue)) {
        const extra = calc.core.spells.extraChoices.find(choice => issue.startsWith(choice.name + '需选择'));
        const key = extra ? 'decision.spell:' + extra.id : /准备/.test(issue) ? 'preparations' :
          /抄录/.test(issue) ? 'copiedSpells' : /子职法术替换/.test(issue) ? 'decision.bonus-swap-from:' + level :
          /法术替换|替换法术/.test(issue) ? 'plan.spellsRemoved' : 'plan.spellsAdded';
        openChecklistEditor('spells', key, '#branch-panel', level || build.level);
        return true;
      }
      if (level) {openChecklistEditor('treeLevel', '', '#level-detail', level); return true;}
      const category = /专长|祈唤|战技|图腾|等级|法术来源/.test(issue) ? 'treeLevel' : /背景|专精|熟练来源/.test(issue) ? 'background' :
        /种族|语言|变体人类/.test(issue) ? 'ancestry' : /装备|护甲|盾牌|金币|财富|指定物品|武器|副手/.test(issue) ? 'armor' : 'job';
      openBuildTask(category, build, calc);
      return true;
    }
    if (button.dataset.task) {
      openBuildTask(button.dataset.task);
      return true;
    }
    if (button.dataset.equipmentMode) {
      state.equipmentMode = button.dataset.equipmentMode;
      if (/^(equipmentChoices\.|decision\.gear:)/.test(branchKey)) {
        branchKey = '';
        branchOpener = '';
        previewedChoice = null;
      }
      saveAndRender();
      return true;
    }
    if (button.dataset.equipItem) {
      const id = button.dataset.equipItem;
      const slot = button.dataset.equipSlot;
      const {inventory, equipment} = calculate().core;
      const owned = inventory.find(entry => entry.id === id);
      if (owned && equipmentSlots(coreRules.items[id]).includes(slot) && !weaponInOtherHand(id, slot, owned.quantity, equipment)) {
        setField(slot, equipmentSlotValue(coreRules.items[id], slot));
        saveAndRender();
        root.querySelector(`[data-backpack-item="${CSS.escape(id)}"]`)?.focus({preventScroll: true});
      }
      return true;
    }
    if (button.dataset.buyItem) {
      const item = coreRules.items[button.dataset.buyItem];
      const dialog = button.closest('dialog');
      const status = dialog.querySelector('[data-shop-gold]');
      const register = button.hasAttribute('data-register-item');
      if (!register) {
        const gold = calculate().core.gold;
        if (gold < item.cost) {status.textContent = CharacterLocale.text('金币不足 · 剩余 ' + gold + ' gp'); return true;}
      }
      const inventory = register ? state.registeredEquipment : state.inventory;
      const entry = inventory.find(entry => entry.id === item.id);
      if (entry ? entry.quantity >= 999 : inventory.length >= 200) {
        status.textContent = CharacterLocale.text('装备记录已满。');
        return true;
      }
      if (entry) entry.quantity++; else inventory.push({id: item.id, quantity: 1});
      const scrollTop = dialog.scrollTop;
      saveAndRender();
      openShop({scrollTop, bought: item, register});
      return true;
    }
    switch (action) {
      case 'edit-name': setNameEditing(true); return true;
      case 'cancel-name': setNameEditing(false); return true;
      case 'theme': openThemePicker(); return true;
      case 'hologram': openHologram(); return true;
      case 'ability-overview': openAbilityOverview(); return true;
      case 'spell-slots': openSpellSlots(); return true;
      case 'new-blank': newCharacter('blank'); return true;
      case 'new-character': newCharacter('example'); return true;
      case 'copy-character': newCharacter('copy'); return true;
      case 'library': openLibrary(); return true;
      case 'export-character': exportCharacter(); return true;
      case 'export-library': save().then(() => downloadFile('DND-2014-角色库-完整备份.json', JSON.stringify(library, null, 2))); return true;
      case 'export-recovery': {
        const raw = rawRecoveryArchive();
        if (raw) downloadFile('DND-2014-角色库-原始恢复备份.json', raw);
        return true;
      }
      case 'import-archive': root.querySelector('[data-archive-import]').click(); return true;
      case 'rename-character': state.name = root.querySelector('[data-rename-character]').value; saveAndRender(); return true;
      case 'ask-delete':
        openDialog('删除角色', `<p>删除「${esc(state.name || '未命名角色')}」？如需保留，请先导出存档。</p><button type="button" data-action="delete-character" class="danger">确认删除</button>`);
        return true;
      case 'delete-character':
        library.characters = library.characters.filter(entry => entry.id !== library.activeId);
        if (!library.characters.length) library.characters.push(CharacterLibrary.record(createStarterBuild()));
        switchCharacter(library.characters[0].id); return true;
      case 'download-summary': downloadFile((state.name || CharacterLocale.text('角色')) + CharacterLocale.text('-公开摘要.txt'), publicSummary(), 'text/plain;charset=utf-8'); return true;
      case 'download-tool': {
        const url = location.protocol === 'file:' ? 'DND-2014-Character-Builder.html' : './DND-2014-Character-Builder.txt';
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'DND-2014-Character-Builder.html'; anchor.click(); return true;
      }
      case 'confirm-level': undoBuild = structuredClone(state); state.actualLevel = state.level; saveAndRender(); return true;
      case 'actual-level': setLevel(state.actualLevel); return true;
      case 'undo':
        if (undoBuild) {
          state = undoBuild;
          undoBuild = null;
          undoInProgress = true;
          try {saveAndRender();} finally {undoInProgress = false;}
        }
        return true;
      case 'equipment-shop': openShop(); return true;
      case 'register-equipment': openShop({register: true}); return true;
      case 'clear-inactive-equipment': {
        const worn = calculate().core.equipment;
        for (const key of ['armor','shield','equippedWeapon','equippedOffhand','weaponGrip']) state[key] = worn[key];
        saveAndRender();
        reveal('#equipment-worn-title', {focus: true});
        return true;
      }
      case 'clear-level-spells': undoBuild = structuredClone(state); updateStep(state.level, {spellsAdded: [], spellsRemoved: [], freeSpells: []}); saveAndRender(); return true;
      case 'clear-preparations': undoBuild = structuredClone(state); state.preparations = []; saveAndRender(); return true;
      case 'empty-inventory': undoBuild = structuredClone(state); state.inventory = []; saveAndRender(); return true;
      default: return false;
    }
  }

  root.addEventListener('change', async event => {
    if (event.target.hasAttribute('data-workbench-language')) {
      const nameDraft = root.querySelector('[data-rename-character]').value;
      CharacterLocale.set(event.target.value);
      syncWorkbenchLanguage();
      render();
      openLibrary();
      root.querySelector('[data-rename-character]').value = nameDraft;
      root.querySelector('[data-workbench-language]').focus({preventScroll: true});
      return;
    }
    const target = event.target;
    if (target.dataset.slotPlan) return recordSlotPlan(target.dataset.slotPlan, target.value);
    if (target.hasAttribute('data-library-select')) {save(); switchCharacter(target.value);}
    if (target.dataset.publicField) {
      state.publicFields[target.dataset.publicField] = target.checked;
      save();
      root.querySelector('[data-share-preview]').textContent = publicSummary();
    }
    if (target.dataset.ruleSwitch) {state.rules[target.dataset.ruleSwitch] = target.checked; saveAndRender();}
    if (target.hasAttribute('data-archive-import') && target.files[0]) {
      try {
        const records = CharacterLibrary.importArchive(await target.files[0].text(), normalize);
        await addCharacters(() => records, true);
      } catch (error) {openDialog('导入失败', `<p role="alert">${esc(error.message)}</p>`);}
      target.value = '';
    }
  });
  root.addEventListener('input', event => {
    if (event.target.hasAttribute('data-shop-search')) {
      filterEquipmentPurposes(event.target.closest('[data-equipment-purpose-list]'));
    }
  });
