  const abilityGlyphs = ['fist', 'foot', 'heart', 'book', 'eye', 'speech'];
  const statGlyphs = ['heart', 'shield', 'bolt', 'footprints', 'star', 'eye', 'search', 'mask'];
  const spellById = new Map(coreSpells.map(spell => [spell.id, spell]));
  const spellRingName = rank => rank ? `${rank} 环` : '戏法';
  const portraitMarkup = () => `<img src="${workbenchPortrait}" width="400" height="600" alt="" draggable="false">`;

  function portraitScales({height, build}) {
    return {height: (height / portraitPresets.human.height) ** 0.42, width: 0.3 + 0.7 * build / 100};
  }

  function portraitProportions() {
    const {height, width} = portraitScales(portraitSettings());
    return `--portrait-height:${height};--portrait-width:${width}`;
  }

  function hudIcon(name) {
    return `<svg class="hud-icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ruleGlyphs[name]}</svg>`;
  }

  function openHologram() {
    const calc = calculate();
    const t = CharacterLocale.text;
    const readings = [3, 0, 1, 4, 5, 2].map(i => `<button type="button" class="hologram-reading" data-ability-marker="${i}"
      aria-label="${esc(t('编辑') + ' ' + t(attrs[i]) + ' · ' + calc.totals[i])}">
      ${hudIcon(abilityGlyphs[i])}<span>${CharacterLocale.language === 'en' ? abilityCodes[i] : attrs[i]}</span><strong>${calc.totals[i]}</strong></button>`);
    const ancestry = state.pendingIdentity.includes('ancestry') ? '待选种族' :
      state.ancestry === 'custom' && state.customRaceName.trim() ? userText(state.customRaceName.trim()) : esc(ancestries[state.ancestry][0]);
    const job = state.pendingIdentity.includes('job') ? '待选职业' :
      state.job === 'custom' && state.customClassName.trim() ? userText(state.customClassName.trim()) : esc(classSpec(state)[0]);
    openDialog('角色草图', `<div class="hologram-panel" style="${portraitProportions()}">${portraitMarkup()}${readings.join('')}</div>
      <div class="portrait-identity">
        <button type="button" data-workbench-task="ancestry"><span>种族</span><strong>${ancestry}</strong></button>
        <button type="button" data-workbench-task="job"><span>职业</span><strong>${job}</strong></button>
        <button type="button" data-action="portrait-shape">调整身高与体型</button>
      </div>`, 'hologram-dialog');
  }

  function spellLabels(spells) {
    const groups = [['已知', spells.known], ['已准备', spells.prepared], ['常备', spells.alwaysPrepared],
      ['额外习得', spells.bonusKnown], ['天生魔法', spells.innate], ['特性法术', spells.bonus]];
    for (const {id, note} of spells.limited) groups.push([note, [id]]);
    const names = new Map();
    for (const [label, ids] of groups) for (const id of ids) {
      const spell = spellById.get(id);
      if (!spell) continue;
      if (!names.has(id)) names.set(id, {spell, labels: []});
      names.get(id).labels.push(label === '已知' && spell.level && state.job === 'wizard' ? '法术书' : label);
    }
    return [...names.values()].sort((a, b) => a.spell.level - b.spell.level || a.spell.name.localeCompare(b.spell.name, 'zh-CN'));
  }

  function slotCastableSpells(spells) {
    if (!spells.track) return [];
    const learned = spells.track.prepared ? [...spells.prepared, ...spells.alwaysPrepared] : spells.known;
    return [...new Set([...learned, ...spells.bonusKnown])].map(id => spellById.get(id)).filter(spell => spell?.level > 0);
  }

  function plannedSpellRanks(spell, spells) {
    if (!slotCastableSpells(spells).includes(spell)) return [];
    const slots = spells.track.slots;
    const ranks = Object.entries(state.spellSlotPlan).flatMap(([slot, id]) => {
      if (id !== spell.id) return [];
      const [rank, index] = slot.split(':').map(Number);
      return rank >= spell.level && index < Number(slots[rank - 1]) ? [rank] : [];
    });
    if (!ranks.length && spells.track.pact) return [slots.length];
    return [...new Set(ranks)].sort((a, b) => a - b);
  }

  function spellJumpButtons(spells) {
    const jumps = [];
    if (canLearnSpells(spells)) jumps.push(['plan.spellsAdded', '学法术']);
    if (spells.track?.prepared) jumps.push(['preparations', '准备法术']);
    if (spells.extraChoices.length || spells.innate.length || spells.bonus.length || spells.bonusKnown.length ||
        spells.alwaysPrepared.length || spells.limited.length) jumps.push(['spell-features', '查看特性法术']);
    return jumps.length ? `<div class="spell-jump-actions">${jumps.map(([key, label]) =>
      `<button type="button" data-spell-jump="${key}">${label}</button>`).join('')}</div>` : '';
  }

  function hudSpellDisclosure(spell, labels, calc) {
    const spells = calc.core.spells;
    const classSpell = [spells.known, spells.prepared, spells.alwaysPrepared, spells.bonusKnown].some(ids => ids.includes(spell.id));
    const sources = spells.extraChoices.filter(choice => state.decisions['spell:' + choice.id]?.includes(spell.id));
    const casting = classSpell ? characterCastingNumbers(calc) : sources.length === 1 ? supplementalCastingNumbers(calc, sources[0]) : null;
    return `<span class="hud-spell-source">${esc(labels.join(' · '))}</span>
      ${spellDisclosure(spell, {label:spell.name, casting, rings:plannedSpellRanks(spell, spells)})}`;
  }

  function characterFeatureRows(calc) {
    const subclass = calc.subclass;
    const track = activeTrack(state);
    const expanded = subclass && subclassReferenceRows(state.job, subclass);
    const extension = extensionClassRows[state.job] ?? [];
    const rows = [];
    for (let level = 1; level <= state.level; level++) {
      const source = `${level} 级`;
      const core = coreRules.classFeatures[state.job]?.[level] ?? [];
      const subCore = level >= track.sub[0] ? coreRules.subclassFeatures[state.job]?.[subclass]?.[level] ?? [] : [];
      for (const feature of [...core, ...subCore]) rows.push([source, feature.name, feature.desc]);
      const extra = [...extension, ...(expanded || [])].filter(row => Number(row[0]) === level);
      for (const [, name, text] of extra) rows.push([source, name, text]);
      if (!core.length && !subCore.length && !extra.length) {
        for (const [name, text] of levelFeatures(level, level >= track.sub[0] ? subclass : '')) rows.push([source, name, text]);
      } else if (state.job === 'rogue' && level >= track.sub[0] && !subCore.length && !expanded) {
        const detail = subs[state.subclass]?.name === subclass ? subs[state.subclass].features[level] : null;
        if (detail) rows.push([source, ...detail]);
      }
    }
    const raceFeatures = coreRules.races[state.ancestry]?.features ?? [];
    for (const feature of raceFeatures) if (!feature.level || feature.level <= state.level) rows.push(['种族', feature.name, feature.desc]);
    if (!raceFeatures.length) for (const [name, text] of expansionAncestryRules[state.ancestry] ?? []) rows.push(['种族', name, text]);
    const raceInfo = legacyRaceOptions[state.ancestry]?.note;
    if (raceInfo && !raceFeatures.length && !expansionAncestryRules[state.ancestry]) rows.push(['种族', ancestries[state.ancestry][0], raceInfo]);
    const background = coreRules.backgrounds[state.background];
    const backgroundDetail = background?.feature ?? expansionBackgroundRules[state.background]?.[0]?.[1] ?? backgrounds[state.background][4];
    if (backgroundDetail && state.background !== 'custom') rows.push(['背景', backgroundName(), backgroundDetail]);
    for (const [id, level] of calc.featsTaken) {
      const feat = featMap[id] ?? manualFeats[id];
      const step = planStep(state, level);
      if (feat || step.customFeat) rows.push(['专长', feat?.name ?? step.customFeat, feat?.desc ?? step.note]);
    }
    for (let level = 1; level <= state.level; level++) {
      const step = planStep(state, level);
      const feat = manualFeats[step.feat];
      if (!calc.stages.get(level)?.applied) continue;
      if (feat) {
        const effects = expansionFeatRules[feat.name] ?? [[feat.name, step.note]];
        for (const [name, text] of effects) rows.push(['专长', name, text]);
      } else if (step.feat === 'custom' && step.customFeat) rows.push(['专长', step.customFeat, step.note]);
    }
    for (const choice of activeDecisions(state)) {
      if (choice.group === 'invocations') continue;
      for (const option of choice.options) if ((state.decisions[choice.id] ?? []).includes(option.id) && decisionOptionAvailable(state, choice, option)) {
        rows.push([choice.name, option.name, option.desc ?? option.note ?? '']);
      }
    }
    if (state.job === 'warlock') for (const option of effectiveInvocations(state)) rows.push(['魔能祈唤', option.name, option.desc]);
    const styleRank = styleLevel(state.job);
    const style = planStep(state, styleRank).style;
    if (state.level >= styleRank && classStyleOptions(state.job).includes(style)) {
      const detail = coreRules.choices.find(choice => choice.id === 'champion-style')?.options.find(option => option.name === style);
      rows.push(['战斗风格', style, detail?.desc]);
    }
    return [...new Map(rows.map(row => [row[1] + '\n' + row[2], row])).values()];
  }

  function hudDetailRows(rows, emptyMessage) {
    if (!rows.length) return `<p class="hint">${emptyMessage}</p>`;
    return `<ul class="hud-detail-list">${rows.map(([source, title, description]) => `<li>
      <span>${esc(source)}</span><div><strong>${esc(title)}</strong>${description ? `<p>${esc(description)}</p>` : ''}</div></li>`).join('')}</ul>`;
  }

  function openAbilityOverview() {
    const calc = calculate();
    const spells = spellLabels(calc.core.spells);
    const features = characterFeatureRows(calc);
    const {armor, weapons, tools} = calc.core.proficiencies;
    const training = [
      ['熟练', '技能熟练', [...calc.proficiencies].join('、')],
      ['专精', '专精', [...calc.expertise].join('、')],
      ['熟练', '豁免熟练', [...calc.saveProficiencies].map(i => attrs[i]).join('、')],
      ['熟练', '护甲熟练', proficiencyNames(armor)],
      ['熟练', '武器熟练', proficiencyNames(weapons)],
      ['熟练', '工具熟练', proficiencyNames(tools)],
      ['语言', '已知语言', [...new Set(calc.languages)].join('、')],
      ['感官', '种族感官', (coreRules.races[state.ancestry]?.senses ?? []).join('、')],
    ].filter(([, , text]) => text);
    const spellRows = spells.map(({spell, labels}) => [spellRingName(spell.level), spell.name, `${labels.join('、')} · ${spell.summary}`]);
    const advantageRows = [...features, ...spellRows].filter(([, , text]) => text?.includes('优势'));
    const section = (id, title, icon, body) =>
      `<section class="hud-overview-section" data-ability-section="${id}" aria-labelledby="hud-${id}">
        <h3 id="hud-${id}">${hudIcon(icon)}${title}</h3>${body}</section>`;
    const spellList = spellJumpButtons(calc.core.spells) + `<ul class="hud-spell-list">${spells.map(({spell, labels}) =>
      `<li>${hudSpellDisclosure(spell, [spellRingName(spell.level), ...labels], calc)}</li>`).join('')}</ul>`;
    const dialog = openDialog('能力速览', `<p class="hint">${state.level} 级${state.level !== state.actualLevel ? '预览' : ''}</p>
      <div class="hud-overview">
        ${section('features', '本领', 'star', hudDetailRows([...features, ...training], '当前没有收录的本领。'))}
        <div class="hud-overview-aside">
          ${spellRows.length ? section('spells', '法术', 'wand', spellList) : ''}
          ${section('advantage', '优势', 'bolt', hudDetailRows(advantageRows, '当前没有收录的优势。'))}
        </div>
      </div>`);
    dialog.classList.add('ability-overview-dialog');
  }

  function openSpellSlots(focusSlot = '', expandedRings, expandedSpells = []) {
    const calc = calculate();
    const {spells} = calc.core;
    const casting = characterCastingNumbers(calc);
    const usable = slotCastableSpells(spells);
    const entries = spellLabels(spells);
    const quantities = [...(spells.track?.slots ?? '')];
    const ranks = [...new Set([...quantities.flatMap((n, i) => +n ? [i + 1] : []), ...entries.map(({spell}) => spell.level)])].sort((a, b) => a - b);
    const slotLabel = spells.track?.pact ? '契约法术位' : '法术位';
    const openRank = ranks.find(rank => +quantities[rank - 1]) ?? ranks[0];
    const sections = ranks.map(rank => {
      const count = +quantities[rank - 1] || 0;
      const available = usable.filter(spell => spell.level <= rank);
      const listed = entries.filter(({spell}) => spell.level === rank);
      return `<details class="slot-ring" data-slot-ring="${rank}"${(expandedRings ? expandedRings.includes(rank) : rank === openRank) ? ' open' : ''}>
        <summary>${spellRingName(rank)} <small>${count ? `${count} 个${slotLabel}` : `${listed.length} 个法术`}</small></summary>
        ${listed.length ? `<ul class="equipped-spells">${listed.map(({spell, labels}) => {
          const draggable = usable.includes(spell);
          return `<li ${draggable ? `draggable="true" data-drag-slot-spell="${esc(spell.id)}"` : ''}>${hudSpellDisclosure(spell, labels, calc)}</li>`;
        }).join('')}</ul>` : '<p class="hint">本环暂无已选法术。</p>'}
        ${count ? `<div class="spell-slot-grid">${Array.from({length: count}, (_, i) => {
          const key = `${rank}:${i}`;
          const planned = state.spellSlotPlan[key] ?? '';
          const selected = available.find(spell => spell.id === planned);
          return `<div class="spell-slot" data-slot-drop="${key}"><label>${spellRingName(rank)} · 位 ${i + 1}<select data-slot-plan="${key}">
            <option value="">${planned && !selected ? '原计划已不适用' : '未安排'}</option>
            ${available.map(spell => `<option value="${esc(spell.id)}"${selected === spell ? ' selected' : ''}>${esc(spell.name)}${spell.level < rank ? `（${spellRingName(spell.level)}）` : ''}</option>`).join('')}</select></label>
            <div aria-live="polite">${selected ? renderSpellCastValues(selected, {level:state.level, ring:rank, casting}, false) : ''}</div></div>`;
        }).join('')}</div>` : ''}</details>`;
    }).join('');
    const dialog = openDialog(spells.track ? '法术环位' : '法术一览', `<div class="hud-slot-board"><p class="hint">${state.level} 级${state.level !== state.actualLevel ? '预览' : ''} · ${spells.track ? '可把已知或准备好的法术拖到可用环位，也可用下拉框。这里记录施法计划。' : '以下法术来自种族、专长或职业特性，使用条件见相应规则。'}</p>
      ${spellJumpButtons(spells)}${sections || '<p class="hint">还没有已选法术。</p>'}<p class="hint">${linkTo('https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting#SpellSlots', '查看 2014 法术位规则 ↗')}</p></div>`);
    for (const id of expandedSpells) dialog.querySelector(`[data-spell-resolution="${CSS.escape(id)}"]`)?.setAttribute('open', '');
    if (focusSlot) dialog.querySelector(`[data-slot-plan="${CSS.escape(focusSlot)}"]`)?.focus({preventScroll: true});
  }

  function recordSlotPlan(slot, id) {
    const dialog = root.querySelector('#workbench-dialog');
    const select = dialog?.querySelector(`[data-slot-plan="${CSS.escape(slot)}"]`);
    if (!select || ![...select.options].some(option => option.value === id)) return;
    const open = [...dialog.querySelectorAll('[data-slot-ring][open]')].map(section => Number(section.dataset.slotRing));
    const openSpells = [...dialog.querySelectorAll('[data-spell-resolution][open]')].map(section => section.dataset.spellResolution);
    const scroll = dialog.scrollTop;
    if (id) state.spellSlotPlan[slot] = id;
    else delete state.spellSlotPlan[slot];
    saveAndRender();
    openSpellSlots(slot, open, openSpells);
    root.querySelector('#workbench-dialog').scrollTop = scroll;
  }

  let spellDrag = null;
  function spellDropTarget(event) {
    if (!spellDrag) return null;
    if (spellDrag.slot) {
      const target = event.target.closest('[data-slot-drop]');
      const select = target?.querySelector('select');
      return select && [...select.options].some(option => option.value === spellDrag.id) ? target : null;
    }
    const target = event.target.closest('[data-spell-drop]');
    if (!target || spellDrag.branch !== branchKey ||
        target.dataset.spellDrop !== 'all' && Number(target.dataset.spellDrop) !== spellById.get(spellDrag.id)?.level) return null;
    return target;
  }

  root.addEventListener('dragstart', event => {
    const element = event.target.closest('[data-drag-spell], [data-drag-slot-spell]');
    if (!element || !event.dataTransfer) return;
    const slot = element.hasAttribute('data-drag-slot-spell');
    spellDrag = {id: slot ? element.dataset.dragSlotSpell : element.dataset.dragSpell, slot, branch: branchKey};
    event.dataTransfer.setData('text/plain', spellById.get(spellDrag.id)?.name ?? '');
    event.dataTransfer.effectAllowed = 'copy';
  });
  root.addEventListener('dragover', event => {
    const target = spellDropTarget(event);
    if (!target) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    target.classList.add('is-drop-target');
  });
  root.addEventListener('dragleave', event => {
    const target = event.target.closest('.is-drop-target');
    if (target && !target.contains(event.relatedTarget)) target.classList.remove('is-drop-target');
  });
  root.addEventListener('dragend', () => {
    spellDrag = null;
    root.querySelectorAll('.is-drop-target').forEach(target => target.classList.remove('is-drop-target'));
  });
  root.addEventListener('drop', event => {
    const target = spellDropTarget(event);
    if (!target) return;
    event.preventDefault();
    target.classList.remove('is-drop-target');
    const {id, slot} = spellDrag;
    spellDrag = null;
    if (slot) return recordSlotPlan(target.dataset.slotDrop, id);
    const option = branches.get(branchKey)?.options.find(item => item.id === id);
    if (option && !option.selected && !option.disabled) chooseBranch(id);
  });
