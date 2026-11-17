  // Original inline illustrations keep the catalogue and exported cards usable offline.
  const ruleGlyphs = {
    sword: '<path fill="currentColor" stroke="none" d="m28 7 6 8v18H22V15Z"/><path d="M17 34h22M28 34v13m-4 0h8"/>',
    dagger: '<path fill="currentColor" stroke="none" d="M45 42c-11-2-24-7-30-16l10-10c9 6 16 17 20 26Z"/><path d="m13 26 13-13m-8 7-9-9"/>',
    axe: '<path fill="currentColor" stroke="none" d="M22 13c10 1 17-1 24-7l4 23c-11 2-21 0-29-5Z"/><path d="m24 20-9 26"/>',
    hammer: '<path d="m18 45 17-23m-9-9 14 9-7 11-14-9 7-11Z"/><path d="m22 17-5-3m19 14 5 4"/>',
    bow: '<path d="M19 9c25 9 25 29 0 38V9Zm-9 19h32"/><path fill="currentColor" stroke="none" d="m38 21 12 7-12 7Z"/>',
    spear: '<path d="m14 47 24-31m-5 1 12-7-4 14-8-7ZM20 35l4 4"/>',
    shield: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M28 8c5 4 12 6 18 7v12c0 9-8 17-18 22-10-5-18-13-18-22V15c6-1 13-3 18-7Zm-2 10v7h-8v4h8v10h4V29h8v-4h-8v-7Z"/>',
    armor: '<path d="m19 13-9 7 5 11 6-2v17h14V29l6 2 5-11-9-7-5 5h-8l-5-5Z"/><path d="M21 28h14m-14 9h14m-7-18v25"/>',
    pack: '<path d="M20 19v-5a8 8 0 0 1 16 0v5m-19 0h22a5 5 0 0 1 5 5v19a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V24a5 5 0 0 1 5-5Z"/><path d="M12 30h32m-23 0v8h14v-8"/>',
    book: '<path d="M28 16c-5-4-13-4-18-2v25c6-2 13-2 18 3 5-5 12-5 18-3V14c-5-2-13-2-18 2Zm0 0v26"/><path d="M15 22c3-1 6 0 9 1m-9 5c3-1 6 0 9 1m8-6c3-1 6-2 9-1m-9 7c3-1 6-2 9-1"/>',
    scroll: '<path d="M15 15c0-4 3-6 7-6h20v5h-7v26c0 4-2 7-6 7H12c5 0 6-4 6-8V15m1 4h12m-12 7h12m-12 7h9"/><path d="M12 47a5 5 0 0 1-5-5v-3h11"/>',
    key: '<circle cx="21" cy="20" r="10"/><circle cx="21" cy="20" r="4"/><path d="m28 27 17 17m-7-7 5-5m-9 1 5-5"/>',
    compass: '<circle cx="28" cy="28" r="18"/><path d="m36 19-5 13-12 5 5-13 12-5Zm-8-7v4m0 24v4M12 28h4m24 0h4"/>',
    coin: '<circle cx="28" cy="28" r="17"/><circle cx="28" cy="28" r="13"/><path d="M28 18v20m6-15c-5-5-14-1-9 4l6 2c5 5-4 9-9 4"/>',
    flask: '<path d="M21 10h14v7h-3v9l10 13a5 5 0 0 1-4 8H18a5 5 0 0 1-4-8l10-13v-9h-3v-7Zm-3 26h20"/><path d="M24 40h1m7 3h1"/>',
    lute: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M23 22c3-2 6-2 9 0L42 8l6 4-11 17c1 5-3 12-10 15-8 4-16 0-18-6-2-7 6-14 14-16Zm-1 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/>',
    tool: '<path d="M21 19a10 10 0 0 1 14-9l-6 6 2 5 5 2 6-6a10 10 0 0 1-13 13L16 45a4 4 0 1 1-6-6l15-14-4-6Z"/>',
    dice: '<path d="m28 10 16 9v18l-16 9-16-9V19l16-9Zm0 19 16-10M28 29l-16-10m16 10v17"/><circle cx="28" cy="19" r="1"/><circle cx="20" cy="31" r="1"/><circle cx="36" cy="33" r="1"/>',
    flame: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M29 7c1 9-7 15-8 21-4-2-6-5-6-8-9 9-7 28 13 29 18-1 22-18 10-31 0 5-2 8-4 11 0-8-2-16-5-22Zm-1 25c-4 5-7 11 0 13 7-2 4-8 0-13Z"/>',
    spark: '<path d="M27 10l4 12 12 5-12 4-4 13-4-13-12-4 12-5 4-12ZM43 10v10m-5-5h10M13 37v8m-4-4h8"/>',
    moon: '<path d="M33 10c-8 3-12 9-12 16 0 8 6 14 15 15-3 3-7 4-11 4A17 17 0 1 1 33 10Z"/><path d="M41 14v12m-6-6h12"/>',
    eye: '<path d="M8 28c6-9 13-13 20-13s14 4 20 13c-6 9-13 13-20 13s-14-4-20-13Z"/><circle cx="28" cy="28" r="6"/>',
    leaf: '<path d="M12 37c-3-15 11-24 32-25-2 20-11 35-27 30m-7 5 22-22m-10 10-2-8m8 2 8 1"/>',
    skull: '<path d="M16 34c-4-4-5-8-4-12 2-8 8-12 16-12 9 0 16 6 17 14 1 4-1 7-5 10v7l-6 5H22l-6-5v-7Z"/><circle cx="21" cy="27" r="3"/><circle cx="35" cy="27" r="3"/><path d="m26 35 2-3 2 3m-8 5h12"/>',
    mask: '<path d="M11 18c11 4 23 4 34 0l-3 14c-3 8-8 10-14 4-6 6-11 4-14-4l-3-14Z"/><path d="M16 25c3-1 6 0 8 3-3 1-6 0-8-3Zm24 0c-3-1-6 0-8 3 3 1 6 0 8-3Z"/>',
    hand: '<path d="M15 30v-9a3 3 0 0 1 6 0v6-12a3 3 0 0 1 6 0v11-13a3 3 0 0 1 6 0v13-9a3 3 0 0 1 6 0v15l3-4a3 3 0 0 1 5 3l-6 11a10 10 0 0 1-9 6h-6a10 10 0 0 1-9-6l-5-10a3 3 0 0 1 3-4"/>',
    paw: '<path d="M16 34c0-4 3-6 5-8 4-5 10-5 14 0 2 2 5 4 5 8 0 6-5 8-12 5-7 3-12 1-12-5Z"/><ellipse cx="16" cy="20" rx="3" ry="5"/><ellipse cx="24" cy="15" rx="3" ry="5"/><ellipse cx="32" cy="15" rx="3" ry="5"/><ellipse cx="40" cy="20" rx="3" ry="5"/>',
    speech: '<path d="M9 15h30v22H24l-8 7v-7H9V15Zm30 8h8v18h-6v5l-7-5h-8v-4"/><path d="M15 23h17m-17 6h12"/>',
    stairs: '<path d="M9 45h12V34h11V23h11V11m-8 8 8-8 7 8"/>',
    pen: '<path d="m13 36-3 10 10-3 25-25-7-7-25 25Zm21-21 7 7M13 36l7 7"/>',
    palette: '<path d="M47 27c0-11-8-18-19-18S9 17 9 28s8 19 19 19c4 0 6-2 6-5 0-2-3-3-3-6 0-2 2-4 5-4h5c4 0 6-2 6-5Z"/><path d="M17 27h.1m5-9h.1m10-1h.1m7 7h.1" stroke-width="5"/>',
    star: '<path d="m28 10 5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1 5-12Z"/>',
    arrow: '<path d="M12 28h32m-11-11 11 11-11 11"/>',
    search: '<circle cx="23" cy="23" r="13"/><path d="m33 33 13 13"/>',
    crown: '<path d="m8 18 11 8 9-13 9 13 11-8-4 22H12Zm5 15h30"/>',
    sun: '<circle cx="28" cy="28" r="9" fill="currentColor"/><path d="M28 7v6m0 30v6M7 28h6m30 0h6M13 13l4 4m22 22 4 4M43 13l-4 4M17 39l-4 4"/>',
    fist: '<path d="M16 31V19a4 4 0 0 1 8 0v-4a4 4 0 0 1 8 0v4a4 4 0 0 1 8 0v5a4 4 0 0 1 7 2v6l-8 9v5H20v-6l-7-7c-5-5 1-10 5-6l6 5h9m-9-13v9m8-9v9m8-4v5"/>',
    helmet: '<path d="M13 30v-6a15 15 0 0 1 30 0v6H33v15H19V34l-6-4Z"/><path d="M14 27h28m-18 0v8l-5 2m14 1h7"/>',
    drop: '<path d="M28 9c5 8 14 18 14 25a14 14 0 0 1-28 0c0-7 9-17 14-25Z"/><path d="M21 33c0 5 2 7 6 8"/>',
    wand: '<path d="m12 45 26-26 5 5-26 26Zm19-19 5 5M43 8v9m-5-5h10M22 10v10m-5-5h10"/>',
    psychic: '<path d="m34 17-5 15-8 7-5-5 8-8 10-9ZM13 32l11 11m-8-5-8 8M41 8l1 6 6 1-6 2-1 6-2-6-6-2 6-1Z"/>',
    rapier: '<path d="m25 31 19-21M17 29c-6 2-5 8-1 12s10 3 13-2l-12-10Zm3 14-6 5m-3-3 5 5"/>',
    crossbow: '<path d="M28 15c-6 1-12-2-18 1 2 8 10 15 18 15s16-7 18-15c-6-3-12 0-18-1Zm-18 1h36M28 11v35m-4-30 4-5 4 5m-8 19h8"/>',
    staff: '<path d="m13 45 31-33m-31 29-2 6 6-2m23-32 4-1-1 4"/>',
    chain: '<path d="M17 17h22l9 9-7 8-6-4v15H21V30l-6 4-7-8 9-9Z"/><path d="M22 25h3m6 0h3m-12 7h3m6 0h3m-12 7h3m6 0h3"/>',
    vest: '<path d="m19 12-8 6 4 14 5-1v14h16V31l5 1 4-14-8-6-9 9-9-9Zm9 9v24"/><path d="m23 29 10 5m-10 0 10-5"/>',
    anchor: '<circle cx="28" cy="12" r="4"/><path d="M28 16v31M20 22h16M11 30c0 10 7 17 17 17s17-7 17-17m-38 5 4-5 5 4m24 0 5-4 4 5"/>',
    foot: '<path d="M14 12h14v18c5 4 8 4 13 4 5 0 7 5 5 9H12v-9l2-22Zm-2 25h34m-24-17h6m-6 5h6"/>',
    heart: '<path d="M28 44 12 29c-12-12 5-23 16-11 11-12 28-1 16 11L28 44Z"/><path d="M28 24v12m-6-6h12"/>',
    bolt: '<path d="M31 8 12 31h14l-2 17 20-24H30l1-16Z"/>',
    snow: '<path d="M28 8v40M11 18l34 20M11 38l34-20m-23-4 6 5 6-5m-12 28 6-5 6 5m-21-18 7 1-1-7m18 20-1-7 7 1m-30 0 7-1-1 7m18-20-1 7 7-1"/>',
    cloud: '<path d="M13 36a8 8 0 0 1 1-16 12 12 0 0 1 23-2 9 9 0 0 1 4 18ZM15 43h15m7 0h7"/>',
    feather: '<path d="M10 46 37 18M16 40C8 29 23 11 46 9c0 15-7 25-19 27h-8m9-8h10"/>',
    balance: '<path d="M28 10v34m-11 0h22M10 17h36M15 17l-7 16h14Zm26 0-7 16h14Z"/>',
    knight: '<path d="M18 37c2-5 7-8 9-13l-10 4-5-5 13-12 1-4 6 5c8 2 12 9 12 18v7Zm-3 0h30v7H15Zm17-16h1"/>',
    poison: '<path d="M20 10h16v7h-3v8l9 8v9a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4v-9l9-8v-8h-3Zm3 23 10 8m-10 0 10-8"/>',
    rune: '<path d="m28 7 18 10v22L28 49 10 39V17Zm-5 30V18l12 8-12 11m5-7 7 7"/>',
    echo: '<path d="M12 14h21v26H12Zm21 4h11v26H23v-4"/><path d="m18 29 5-7 5 7"/>',
    ear: '<path d="M14 24a14 14 0 1 1 27 4c-3 5-7 6-8 12-2 7-11 9-14 3m2-19a7 7 0 1 1 13 3c-4 4-6 6-6 10"/>',
    footprints: '<path d="M15 27c-4-5-4-13 1-15 6-2 9 3 9 9l-3 8Zm1 7 7-2 2 5c0 4-6 6-8 2Zm16-4c-1-7 1-13 7-13 6 0 8 7 4 13l-4 4Zm-1 7 8 2-1 5c-2 4-8 2-8-2Z"/>',
    tent: '<path d="M6 43 28 10l22 33Zm12 0 10-18 10 18M28 10l5-5"/>',
    wheat: '<path d="M28 47V16m0 8c-8 0-13-5-13-11 8 0 13 5 13 11Zm0 6c8 0 13-5 13-11-8 0-13 5-13 11Zm0 7c-8 0-13-5-13-11 8 0 13 5 13 11Zm0 4c8 0 13-5 13-11-8 0-13 5-13 11Zm0-25c-4-3-4-7 0-11 4 4 4 8 0 11Z"/>',
    rope: '<ellipse cx="26" cy="27" rx="17" ry="13"/><ellipse cx="26" cy="27" rx="10" ry="6"/><path d="M11 21c7 5 19 8 31 9M13 35c8 0 20-4 28-12m-7 16 11 7"/>',
    lantern: '<path d="M24 12V9a4 4 0 0 1 8 0v3m-13 2h18l6 8H13l6-8Zm-2 8 2 20h18l2-20M15 45h26m-17-8c-3-4 2-8 4-11 2 3 7 7 4 11Z"/>',
    plus: '<path d="M28 11v34M11 28h34"/>',
    minus: '<path d="M11 28h34"/>',
    person: '<circle cx="28" cy="17" r="8"/><path d="M12 44v-5a16 13 0 0 1 32 0v5"/>',
    elf: '<path d="M18 23 7 17l8 15 4 2m19-11 11-6-8 15-4 2M18 24v-4a10 10 0 0 1 20 0v4c0 13-6 19-10 19s-10-6-10-19Zm5 2h1m8 0h1"/>',
    dwarf: '<path d="M15 25v-5a13 13 0 0 1 26 0v5m-29 0h32m-28 0v11l12 12 12-12V25m-18 4h1m10 0h1m-11 9 5-3 5 3"/>',
    halfling: '<path d="M16 27c-8-4-5-12 0-13 1-8 11-9 13-4 6-4 14 1 13 7 4 2 6 9-1 11m-24-3v5c0 7 5 12 11 12s12-5 12-12v-5m-18 4h1m10 0h1m-10 6c2 2 6 2 8 0"/>',
    gnome: '<path d="M11 25 27 7l14 18m-33 0h40m-32 0-5 3 5 4c2 9 7 14 12 14s10-5 12-14l5-4-5-3m-18 4h1m10 0h1m-11 9h10"/>',
    orc: '<path d="M16 28 9 18l7 4c1-8 6-12 12-12s11 4 12 12l7-4-7 10v9l-5 7H21l-5-7Zm5 0 4 2m6 0 4-2m-15 9h16m-13 0-2-5m12 5 2-5"/>',
    dragon: '<path d="M17 22 10 10l13 5 5-4 5 4 13-5-7 12 3 9-7 6-2 7H23l-2-7-7-6Zm3 4 4 1m8 0 4-1m-13 10 5-5 5 5m-8 4h6"/>',
    horns: '<path d="M18 25C9 22 8 13 13 7c1 7 4 9 10 11m15 7c9-3 10-12 5-18-1 7-4 9-10 11M18 25v5c0 8 5 15 10 15s10-7 10-15v-5c-2-4-5-7-10-7s-8 3-10 7Zm5 4h1m8 0h1m-9 8h8"/>',
    cat: '<path d="m12 26 1-17 12 10h6L43 9l1 17v8l-8 8H20l-8-8Zm7 4h3m12 0h3m-11 5h4m-2 0v5M8 31h7m-7 7 8-2m32-5h-7m7 7-8-2"/>',
    bird: '<path d="M13 30v-5a15 15 0 0 1 30 0v5l-6 9-9 7-9-7Zm15-2 6 6-6 10-6-10Zm-8-3h1m14 0h1"/>',
    shell: '<path d="M8 36c0-11 9-21 20-21s20 10 20 21H8Zm5 5h30m-22-5v-9l7-5 7 5v9m-7-14v-7m-7 12-7-5m21 5 7-5"/>',
    cog: '<path d="m23 8 10 0 1 6 5 3 6-2 5 9-5 4v6l5 4-5 8-6-2-5 3-1 3H23l-1-3-5-3-6 2-5-8 5-4v-6l-5-4 5-9 6 2 5-3Z"/><circle cx="28" cy="29" r="8"/>',
  };
  const classArt = {artificer:'tool', barbarian:'axe', bard:'lute', bloodhunter:'drop', cleric:'sun', druid:'leaf', fighter:'sword', monk:'fist', paladin:'shield', ranger:'bow', rogue:'dagger', sorcerer:'flame', warlock:'moon', wizard:'book', custom:'scroll'};
  const rogueArt = {mastermind:'knight', inquisitive:'search', thief:'key', assassin:'poison', arcane:'wand', swashbuckler:'rapier', scout:'compass', phantom:'skull', soulknife:'psychic'};
  const spellArt = {A:'shield', C:'spark', D:'eye', E:'speech', V:'bolt', I:'mask', N:'skull', T:'flask'};
  const skillArt = {'运动':'fist','特技':'balance','巧手':'hand','隐匿':'footprints','奥秘':'spark','历史':'scroll','调查':'search','自然':'leaf','宗教':'sun','驯兽':'paw','洞悉':'ear','医药':'heart','察觉':'eye','求生':'compass','欺瞒':'mask','威吓':'sword','表演':'lute','游说':'speech'};

  function matchIcon(label, groups, fallback) {
    return groups.find(([pattern]) => pattern.test(label))?.[1] ?? fallback;
  }

  const ancestryArt = {
    human:'person', elf:'elf', dwarf:'dwarf', halfling:'halfling', gnome:'gnome', orc:'orc',
    dragonborn:'dragon', tiefling:'horns', changeling:'mask', cat:'cat', bird:'bird', lizard:'dragon',
    goliath:'fist', warforged:'cog', tortle:'shell', centaur:'bow',
  };
  const backgroundIconGroups = [
    [/调查|猎人|审判/, 'search'], [/守卫|士兵|佣兵|骑士|军团|步枪/, 'helmet'],
    [/工匠|船工|符文雕刻|匠人/, 'hammer'], [/贵族|朝臣|继承/, 'crown'],
    [/水手|海盗|海军|渔民|走私/, 'anchor'], [/学者|学生|智者|考古|哲学|人类学/, 'book'],
    [/商人|经商|商会/, 'coin'], [/赌徒/, 'dice'], [/骗子|假面|笑面/, 'mask'],
    [/艺人|角斗|雇工/, 'lute'], [/邪教|噩梦/, 'skull'], [/侍僧|维齐尔|祀徒|传教/, 'sun'],
    [/平民|农/, 'wheat'], [/间谍|特工|联络|线人/, 'eye'], [/罪犯|流浪儿/, 'key'],
    [/隐士|部族|荒宇|迷失/, 'tent'], [/行者|远行|旅者|浪客/, 'compass'],
  ];
  const subclassIconGroups = [
    [/符文/, 'rune'], [/回音|时间/, 'echo'], [/调查|预言|监察/, 'search'],
    [/战斗大师|策士|战略|战争魔法/, 'knight'], [/月|暮光|幽影|阴影/, 'moon'],
    [/锻造|战地匠/, 'hammer'], [/装甲|守护|守望|防护/, 'shield'],
    [/风暴|雷霆/, 'bolt'], [/火|烈焰|野火/, 'flame'], [/光明|天界|荣耀|日魂/, 'sun'],
    [/死亡|永亡|亡灵|坟墓|鬼魅|枯朽/, 'skull'], [/生命|救赎|和平/, 'heart'],
    [/诡术|幻术|迷惑|低语/, 'mask'], [/自然|牧人|原初|古贤/, 'leaf'],
    [/龙/, 'dragon'], [/剑咏|剑舞|剑圣|咒剑|风流/, 'rapier'],
    [/弓|射|猎手|猎人/, 'bow'], [/幽域|侦察|斥候/, 'compass'], [/刺客|瘟疫/, 'poison'],
    [/书|学识|知识|奥秘/, 'book'], [/律|秩序/, 'balance'], [/狂|武僧|斗士/, 'fist'],
    [/灵能|心灵|魂刃|星我/, 'psychic'], [/星|宇宙/, 'spark'], [/变形|野兽|兽群|兽王|化狼/, 'paw'],
    [/血|鲜血/, 'drop'], [/炼金|孢子|突变/, 'flask'], [/骑兵|骑士|征服/, 'helmet'],
    [/海|波涛/, 'anchor'], [/风|云/, 'cloud'], [/魔法|魔能|术法|术士/, 'wand'],
  ];
  const spellIconGroups = [
    [/^(cure-wounds|healing-word|heal|mass-heal|mass-healing-word|mass-cure-wounds|goodberry|lesser-restoration|greater-restoration)$/, 'heart'],
    [/(^|-)fire|flame|burning|heat-metal|scorching/, 'flame'],
    [/frost|ice|cold|freezing|sleet/, 'snow'], [/lightning|thunder|shocking/, 'bolt'],
    [/darkness|moonbeam/, 'moon'], [/daylight|sunbeam|sunburst|sacred-flame|^light$/, 'sun'],
    [/poison|acid|ray-of-sickness/, 'poison'], [/fog|cloud|wind|gaseous/, 'cloud'],
    [/water|rain/, 'drop'], [/silence|whisper|message|sending|tongues/, 'speech'],
    [/thorn|plant|entangle|barkskin/, 'leaf'], [/invisib|disguise|illusion|mirage/, 'mask'],
  ];

  function equipmentGlyph(item) {
    if (!item) return 'pack';
    if (item.kind === 'armor') return {shield:'shield', light:'vest', medium:'chain', heavy:'armor'}[item.type] ?? 'armor';
    if (item.kind === 'instrument') return 'lute';
    if (item.kind === 'weapon') return matchIcon(item.id, [
      [/crossbow/, 'crossbow'], [/rapier/, 'rapier'], [/bow/, 'bow'], [/axe/, 'axe'],
      [/quarterstaff|club/, 'staff'], [/mace|hammer|maul|morningstar|flail/, 'hammer'],
      [/spear|halberd|glaive|trident|pike|lance|javelin/, 'spear'], [/dagger|dart/, 'dagger'],
      [/sling|net|blowgun/, 'rope'],
    ], 'sword');
    return matchIcon(item.id, [
      [/tools|kit|crowbar|smith/, 'tool'], [/potion|water|oil|vial|flask|bottle|jug/, 'flask'],
      [/book/, 'book'], [/paper|parchment|map|scroll/, 'scroll'], [/lamp|lantern/, 'lantern'],
      [/torch|tinderbox/, 'flame'], [/compass|navigator/, 'compass'], [/rope|chain|manacles/, 'rope'],
      [/coin|pouch|scale/, 'coin'], [/wand|orb|crystal|rod/, 'wand'], [/tent|bedroll/, 'tent'], [/ration/, 'wheat'],
    ], 'pack');
  }

  function illustratedOption(key, {id, title}, spell, gear) {
    if (key === 'job') return id === 'custom' ? 'human' : id;
    if (isRuleSubclass(key)) {
      if (/调查|inquisitive/.test(String(id))) return 'investigator';
      if (/策士|mastermind/.test(String(id))) return 'noble';
      return state.job;
    }
    if (key === 'ancestry') {
      if (id === 'custom') return 'human';
      for (const [pattern, image] of [[/幻身灵/, 'changeling'], [/斑猫|狮族|狮人|虎人/, 'cat'], [/鸦人|鹰人|枭人/, 'bird'],
        [/蜥蜴人/, 'lizard'], [/歌利亚|歌利亚人/, 'goliath'], [/铸躯|机关人|战争构装/, 'warforged'], [/龟人/, 'tortle'], [/半人马/, 'centaur'],
        [/龙裔|龙血/, 'dragonborn'], [/提夫林|魔裔/, 'tiefling'], [/兽人/, 'orc'], [/精灵|卓尔/, 'elf'], [/矮人|灰矮/, 'dwarf'],
        [/半身人/, 'halfling'], [/侏儒/, 'gnome'], [/人类/, 'human']]) {
        if (pattern.test(title)) return image;
      }
      return undefined;
    }
    if (key === 'background') {
      for (const [pattern, image] of [[/调查|猎人|守卫|审判|特工|线人/, 'investigator'], [/工匠|船工|雕刻|匠人/, 'artisan'],
        [/贵族|朝臣|继承|受宠/, 'noble'], [/海盗|水手|海军|渔民|浪客|走私/, 'sailor'], [/学者|学生|智者|考古|哲学|人类学/, 'student'],
        [/商人|经商|商会|赌徒/, 'merchant'], [/艺人|假面|骗子|雇工|笑面|角斗/, 'performer'], [/骑士|士兵|佣兵|步枪/, 'fighter'],
        [/邪教|黑暗|噩梦/, 'cultist'], [/侍僧|维齐尔|祀徒|传教/, 'cleric'], [/平民|农/, 'farmer'], [/罪犯|间谍|窃/, 'rogue']]) {
        if (pattern.test(title)) return image;
      }
      return 'traveler';
    }
    if (spell) return spell.ritual ? 'book' : 'wand';
    if (gear) {
      if (gear.kind === 'armor') return gear.type === 'shield' ? 'shield' : /leather|padded|hide/.test(gear.id) ? 'leather' : /chain|scale|ring/.test(gear.id) ? 'mail' : 'plate';
      if (gear.kind === 'weapon') {
        for (const [pattern, image] of [[/rapier/,'rapier'], [/crossbow/,'crossbow'], [/mace|morningstar/,'mace'], [/quarterstaff|^club$|greatclub/,'staff']]) if (pattern.test(gear.id)) return image;
        const symbol = equipmentGlyph(gear);
        return symbol === 'rope' ? undefined : symbol;
      }
      for (const [pattern, image] of [[/rope/,'rope'], [/lamp|lantern|torch/,'lantern'], [/book/,'book'], [/pouch/,'coin'], [/wand|orb|rod|crystal/,'wand']]) if (pattern.test(gear.id)) return image;
      const glyph = equipmentGlyph(gear);
      if (glyph !== 'pack' || /pack|bag|case/.test(gear.id)) return glyph;
      return undefined;
    }
    if (key.startsWith('equipmentChoices.') || key === 'pack') return 'pack';
    if (key === 'plan.feat') return 'scroll';
    return undefined;
  }

  function optionGlyph(key, option, spell, gear) {
    const {id, title} = option;
    if (key === 'job') return classArt[id] ?? 'scroll';
    if (isRuleSubclass(key)) {
      if (state.job === 'rogue') {
        const rogueId = subs[id]?.id ?? subclassData.find(sub => sub.name === title)?.id;
        if (rogueId) return rogueArt[rogueId];
      }
      return matchIcon(title, subclassIconGroups, classArt[state.job] ?? 'star');
    }
    if (key === 'ancestry') {
      if (id === 'custom') return 'scroll';
      const illustration = illustratedOption(key, option);
      if (ancestryArt[illustration]) return ancestryArt[illustration];
      return matchIcon(title, [[/妖精|仙灵|妖/,'spark'], [/龟|海|水|鱼/,'shell'], [/天裔|翼/,'feather'], [/地精|大地精/,'orc'],
        [/炎|火/,'flame'], [/气|云/,'cloud'], [/土|石/,'rune'], [/机器|构装/,'cog']], 'person');
    }
    if (key === 'background') return id === 'custom' ? 'scroll' : matchIcon(title, backgroundIconGroups, 'compass');
    if (spell) return matchIcon(spell.id, spellIconGroups, spellArt[spell.schoolCode] ?? 'wand');
    if (gear) return equipmentGlyph(gear);
    if (key === 'armor' || ['equippedWeapon','equippedOffhand'].includes(key) && !id) return 'minus';
    if (key.startsWith('equipmentChoices.') || key === 'pack') return 'pack';
    if (Object.hasOwn(skills, id)) return skillArt[id];
    if (key === 'treeLevel') return 'stairs';
    if (key === 'plan.feat') return !id ? 'plus' : matchIcon(title, [[/幸运|占卜/,'dice'], [/警觉|观察/,'eye'],
      [/演员|暗影|影界/,'mask'], [/移动|机敏/,'foot'], [/健壮|疗|医疗/,'heart'], [/符文/,'rune'],
      [/盾|护甲|重甲|轻甲|中甲/,'shield'], [/语言|心电/,'speech'], [/射|弓|弩/,'bow'],
      [/武器|双持|长柄|决斗/,'sword'], [/魔|法|妖精/,'wand']], 'star');
    if (key === 'plan.style') return matchIcon(title, [[/箭/,'bow'], [/防御|保护/,'shield'], [/武器|决斗/,'sword']], 'star');
    if (['plan.game', 'customHitDie'].includes(key)) return 'dice';
    if (id === '盗贼工具') return 'key';
    if (/boost|Ability|Bonuses|^flex|plan\.stat/.test(key)) return ['fist','foot','heart','book','eye','speech'][id] ?? 'plus';
    if (/language/i.test(key)) return 'speech';
    if (key.startsWith('decision.')) {
      return matchIcon(branches.get(key)?.label ?? '', [[/伙伴|野兽/,'paw'], [/祈唤|魔|元素/,'wand'], [/武器|战技/,'sword']], 'scroll');
    }
    return 'arrow';
  }

  function optionIllustration(key, option, embed = false) {
    const spell = ruleSpell(key, option.id);
    const gear = ruleItem(key, option.id);
    const character = ['job', 'ancestry', 'background'].includes(key) || isRuleSubclass(key);
    if (embed || character) {
      const illustration = illustratedOption(key, option, spell, gear);
      if (illustration && Object.hasOwn(ruleArtImages, illustration)) {
        if (embed) return '<img class="option-art option-art--drawing" src="' + ruleArtImages[illustration] + '" alt="" width="140" height="140">';
        return '<span class="option-art option-art--drawing" data-illustration="' + illustration + '" aria-hidden="true"></span>';
      }
    }
    const glyph = optionGlyph(key, option, spell, gear);
    return '<svg class="option-art option-art--icon" data-icon="' + glyph + '" viewBox="0 0 56 56" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="3.15" stroke-linecap="round" stroke-linejoin="round"><rect class="option-art-paper" x="1" y="1" width="54" height="54" rx="12" stroke="none"/>' + ruleGlyphs[glyph] + '</svg>';
  }

  function mountOptionIllustrations() {
    const style = document.createElement('style');
    style.textContent = Object.entries(ruleArtImages).map(([id, data]) =>
      '.option-art[data-illustration="' + id + '"]{background-image:url(' + data + ')}').join('\n');
    document.head.append(style);
  }

  function isRuleSubclass(key) {
    return ['subclass', 'careerSubclass', 'plan.subclassName'].includes(key);
  }

  function ruleSpell(key, id) {
    return key.startsWith('plan.spells') || key.startsWith('decision.spell:') || key.startsWith('decision.bonus-swap-') ||
      ['plan.freeSpells','preparations','copiedSpells'].includes(key) ? coreSpells.find(spell => spell.id === id) : undefined;
  }

  function ruleItem(key, id) {
    if (key === 'armor') return id === 'none' ? undefined : armorItem(id);
    if (key.startsWith('decision.gear:') || ['shopItem','inventoryItem','equippedWeapon','equippedOffhand','weapon','ranged'].includes(key)) return coreRules.items[id];
    if (key === 'pack') return coreRules.items[{burglar:'burglars-pack',dungeon:'dungeoneers-pack',explorer:'explorers-pack'}[id]];
    return undefined;
  }

  const ruleBasic = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/';
  const armorNames = {light:'轻甲', medium:'中甲', heavy:'重甲', shield:'盾牌'};
  const weaponProperties = {
    finesse:['灵巧','选力量或敏捷调整值，命中与伤害使用同一项。'],
    light:['轻型','双武器战斗通常要求两只手各持一把轻型近战武器。附赠动作攻击的伤害通常不加正的属性调整值。'],
    'two-handed':['双手','攻击时要用两只手握持。'],
    versatile:['两用','近战攻击可改用双手，并使用物品注明的双手伤害骰。'],
    thrown:['投掷','可投掷作远程攻击。近战武器投掷时沿用该武器近战时所用的属性。'],
    ammunition:['弹药','每次远程攻击消耗一发弹药。单手弹药武器通常需要一只空手装填。'],
    loading:['装填','每次用动作、附赠动作或反应射击时，通常最多射一发。'],
    reach:['触及','用该武器攻击及判断借机攻击触及时，触及距离增加 5 尺。'],
    heavy:['重型','小型或微型生物使用重型武器攻击时有劣势。'],
    special:['特殊','按下方列出的武器专属规则处理。'],
  };

  function equipmentStats(item) {
    if (item.kind === 'weapon') {
      return [
        ['基础伤害', item.damage ? `${item.damage} ${item.damageType}` : '无伤害，命中触发特殊效果'],
        ['武器特性', item.properties.map(key => weaponProperties[key][0]).join('、') || '无'],
        ...(item.versatile ? [['双手伤害', `${item.versatile} ${item.damageType}`]] : []),
        ...(item.range ? [['正常 / 最远射程', item.range.join(' / ') + ' 尺']] : []),
        ...(item.properties.includes('reach') ? [['触及加成', '+5 尺']] : []),
      ];
    }
    if (item.kind === 'armor') {
      const ac = item.type === 'shield' ? '+2' : item.baseAC +
        (item.dexCap === 'all' ? ' + 敏捷调整值' : item.dexCap === 2 ? ' + 敏捷调整值（最多 +2）' : '');
      return [
        ['AC', ac],
        ...(item.strength ? [['力量门槛', String(item.strength)]] : []),
        ...(item.stealthDisadvantage ? [['隐匿', '有劣势']] : []),
      ];
    }
    return item.stats ?? [];
  }

  function equipmentPriceWeight(item) {
    return [['参考价格', item.cost + ' gp'], ['重量', item.weight ? item.weight + ' 磅' : '—']];
  }

  function equipmentSummary(item, withPrice = false) {
    const facts = [...equipmentStats(item), ...(withPrice ? equipmentPriceWeight(item) : [])];
    return facts.map(([label, value]) => label === '基础伤害' || label === '武器特性' && value !== '无' ? value : `${label} ${value}`).join(' · ');
  }

  function equipmentChoiceItems(key, id) {
    const item = ruleItem(key, id);
    if (item) return [{item, quantity: 1}];
    if (!key.startsWith('equipmentChoices.')) return [];
    const group = coreRules.classes[state.job]?.equipment.find(group => group.id === key.split('.')[1]);
    const selected = group?.options.find(option => option.id === id);
    return (selected?.items ?? []).map(({id, quantity}) => ({item: coreRules.items[id], quantity})).filter(entry => entry.item);
  }
  const skillExample = {
    运动:'想用蛮力爬上湿滑的墙，先描述手脚能抓住哪里。', 特技:'想踩着摇晃的木梁通过，重点是维持平衡。',
    巧手:'把小钥匙悄悄放进自己的袖口，手上动作本身是难点。', 隐匿:'利用遮挡接近门口，说明你避开的是视线、动静，还是两者。',
    奥秘:'辨认陌生法阵上的符号，回想这些图形跟哪种魔法有关。', 历史:'看到旧徽记，尝试回忆它属于哪一个时代或组织。',
    调查:'比对门锁上的刮痕和手里的钥匙，推断有没有人用其他工具开过门。', 自然:'根据叶形和环境判断陌生植物的习性。',
    宗教:'辨认祭坛的神徽和献礼方式，回想相关传统。', 驯兽:'用动作和声音安抚受惊的马，让它愿意停下。',
    洞悉:'询问同一事件的两个细节，观察对方在哪一段明显犹豫。DM 可以给你关于意图的线索。',
    医药:'试着判断同伴昏倒是由外伤还是病症导致。', 察觉:'停下听门后有没有脚步声，或搜寻桌下有没有小物。',
    求生:'从地面留下的足迹和折断的枝条追踪移动方向。', 欺瞒:'向守卫解释借来的制服，关键在于让捏造的说法可信。',
    威吓:'明确说出对方若拒绝合作可能面临什么后果。', 表演:'用一段演出吸引酒馆客人，给同伴创造交谈的机会。',
    游说:'提出对方也能接受的条件，说服店主延长交货时间。',
  };
  const expandedSpellRules = {
    'disguise-self': [
      '幻术同时改变别人看见的你和随身衣物、武器等外观。可以显得高或矮约 1 尺，但保留基本肢体结构。',
      '触碰会暴露外观与实体不一致的地方。仔细观察的生物可用动作进行智力（调查）检定，对抗你的法术豁免 DC。',
      '例如可以让普通外衣看起来像制服。若接下来还要接受搜身，提前考虑制服的实体细节。',
    ],
    'mage-hand': [
      '通常要用动作控制魔手，每次可移动至多 30 尺。可以拿取敞开容器中的物品、开没上锁的门，或倒出小瓶里的东西。',
      '魔手拿不动超过 10 磅的物品，也不能攻击或激活魔法物品。离你超过 30 尺、被你解除，或你重施法术时消失。',
      '诡术师的子职能力另有隐形、远程开锁和控制动作规则。普通施法者按这里的基础版本使用。',
    ],
    'magic-missile': [
      '1 环施放产生 3 枚飞弹。每枚对范围内一个你能看见的生物造成 1d4 + 1 力场伤害，无需攻击检定。',
      '飞弹同时命中。你可以集中攻击一个生物，也可以分配给多个目标。每用高一环的法术位多产生一枚。',
      '目标可以用护盾术挡下这些飞弹。需要选择目标或分配伤害时，先声明每枚的去向。',
    ],
    'mage-armor': [
      '触碰一名愿意接受法术且没穿护甲的生物。它的基础 AC 使用 13 + 敏捷调整值。',
      '持续期间若目标穿上护甲，法术结束。工作台里可以在装备栏勾选「法师护甲已生效」来反映当前状况。',
    ],
    'shield': [
      '受到攻击命中，或成为魔法飞弹的目标时可用反应施放。AC +5 持续到下个自己回合开始，触发的那次攻击也要重新与提高后的 AC 比较。',
      '期间免受魔法飞弹伤害。使用时要有可用的反应和法术位，并能提供言语、姿势成分。',
    ],
    'magic-mouth': [
      '选一件看得见且没被其他生物穿戴或携带的物品。录入一段最多 25 个词的话，并指定可见或可听的触发条件。',
      '触发依据限于物品周围 30 尺内的情形。施法时可选择播放一次就结束，或在之后每次触发时重复播放。',
    ],
  };

  function ruleSection(title, {text = [], facts = [], entries = []} = {}) {
    return {title, text, facts: facts.filter(([, value]) => value !== undefined && value !== null && value !== ''), entries};
  }

  function spellResolutionFacts(spell, casting = null) {
    const record = spellResolution[spell.id];
    const facts = Object.entries(record ?? {});
    if (record?.['攻击检定']?.includes('法术攻击')) {
      facts.push(['法术命中公式', casting ? 'd20 ' + sign(casting.bonus) + '（' + casting.ability + '）' : 'd20 + 施法属性调整值 + 熟练加值']);
    }
    if (record?.['目标豁免'] || record?.['判定难度'] === '法术豁免 DC') {
      facts.push(['法术豁免 DC', casting ? String(casting.dc) + '（' + casting.ability + '）' : '8 + 施法属性调整值 + 熟练加值']);
    }
    return facts;
  }

  function spellCastFacts(spell, level, ring = spell.level, casting = null) {
    const record = spellResolution[spell.id] ?? {};
    const result = Object.fromEntries(Object.entries(record).filter(([name]) =>
      ['伤害', '按效果结算的伤害骰', '治疗', '临时生命值'].includes(name)));
    const tier = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
    const higher = Math.max(0, ring - spell.level);
    const addDice = (text, extra) => text?.replace(/\b(\d+)(d\d+)\b/, (_, count, die) => (Number(count) + extra) + die);
    if (standardCantripDice.has(spell.id)) result['伤害'] = addDice(result['伤害'], tier - 1);
    const growth = spellDamageDiceGrowth.get(spell.id);
    if (growth) result['伤害'] = addDice(result['伤害'], growth.dice * Math.floor(higher / growth.interval));
    if (growingSpellHealing.has(spell.id)) result['治疗'] = addDice(result['治疗'], higher);
    Object.assign(result, specialSpellRolls[spell.id]?.({tier, higher, ring}));
    const summon = scalingSummonAttacks[spell.id];
    if (summon) {
      result['伤害'] = summon.damage(ring);
      result['召唤物多重攻击'] = Math.floor(ring / 2) + ' 次';
    }
    if (casting) {
      for (const [name, value] of spellResolutionFacts(spell, casting)) {
        if (name === '法术命中公式' || name === '法术豁免 DC') result[name] = value;
      }
      if (summon) {
        result['召唤物命中'] = 'd20 ' + sign(casting.bonus) + '（' + casting.ability + '）';
        if (summon.save) result['法术豁免 DC'] = casting.dc + '（' + summon.save + '）';
      }
    }
    return Object.entries(result).filter(([, value]) => value);
  }

  function renderSpellCastValues(spell, {level, ring = spell.level, casting = null}, showContext = true) {
    const facts = spellCastFacts(spell, level, ring, casting);
    if (!facts.length) return '';
    return `<div class="spell-cast-values" data-spell-cast-ring="${ring}">
      ${showContext ? `<p>${level} 级角色 · ${ring ? ring + ' 环施放' : '戏法'}</p>` : ''}
      <dl>${facts.map(([name, value]) => `<div><dt>${esc(name === '按效果结算的伤害骰' ? '伤害' : name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
    </div>`;
  }

  function renderSpellCastContexts(spell, {level = state.level, rings = [], casting = null} = {}) {
    return (rings.length ? rings : [spell.level]).map(ring => renderSpellCastValues(spell, {level, ring, casting})).join('');
  }

  function characterCastingNumbers(calc, ability = calc.core.spells.track?.stat) {
    if (ability === undefined) return null;
    const bonus = calc.mods[ability] + calc.pb;
    return {ability: attrs[ability], bonus, dc: 8 + bonus};
  }

  function spellCastingInBranch(calc, key) {
    if (['plan.spellsAdded', 'plan.spellsRemoved', 'preparations', 'copiedSpells', 'plan.freeSpells'].includes(key) ||
        key.startsWith('decision.bonus-swap-')) return characterCastingNumbers(calc);
    if (!key.startsWith('decision.spell:')) return null;
    const choice = calc.core.spells.extraChoices.find(choice => choice.id === key.slice('decision.spell:'.length));
    return choice ? supplementalCastingNumbers(calc, choice) : null;
  }

  function branchSpellContext(key, spell, calc) {
    const casting = spellCastingInBranch(calc, key);
    const classChoice = !key.startsWith('decision.spell:');
    return {casting, rings: classChoice ? plannedSpellRanks(spell, calc.core.spells) : []};
  }

  function supplementalCastingNumbers(calc, choice) {
    if (choice.ability !== undefined) return characterCastingNumbers(calc, choice.ability);
    if (choice.id.startsWith('phb:')) return characterCastingNumbers(calc, classGrowth[choice.jobList]?.casting);
    if (choice.mode || choice.id.startsWith('arcanum-') || choice.id === 'spell-storing-item') return characterCastingNumbers(calc);
    return null;
  }

  function spellDisclosure(spell, {label = '伤害与判定', casting = null, rings = [], showEffect = true, showLive = true} = {}) {
    const liveFacts = new Set(spellCastFacts(spell, state.level, rings[0], casting).map(([name]) => name));
    const facts = [...spellResolutionFacts(spell, casting).filter(([name]) => !liveFacts.has(name)), ['施法时间', spell.time], ['距离', spell.range],
      ['持续时间', spell.duration], ['成分', spell.components], ...(spell.concentration ? [['专注', '需要']] : []),
      ...(spell.ritual ? [['仪式', '可用适用的仪式施法能力施放']] : []),
      ...(spell.material ? [['材料', spell.material]] : []),
      ...(spell.materialCost ? [['材料价值', spell.materialCost + ' gp']] : []),
      ...(spell.materialConsumed ? [['耗材', '施法会消耗注明的材料']] : [])];
    return `<details class="spell-disclosure" data-spell-resolution="${esc(spell.id)}"><summary>${esc(label)}</summary>
      ${showLive ? renderSpellCastContexts(spell, {casting, rings}) : ''}
      ${showEffect ? `<p>${liveFacts.size ? '<span class="hud-spell-source">基础规则</span>' : ''}${esc(spell.summary)}</p>` : ''}
      <dl>${facts.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
    </details>`;
  }

  function spellSections(spell) {
    const components = [['V','言语'],['S','姿势'],['M','材料']].filter(([code]) => spell.components.includes(code)).map(([, name]) => name).join('、');
    const mechanics = [
      spell.level === 0 ? '戏法通常无需消耗法术位。实际伤害或目标数量何时成长，以该戏法自身说明为准。' : `通常需要一枚至少 ${spell.level} 环的法术位。更高法术位是否增强效果，以该法术自身说明为准。`,
      ...(spell.concentration ? ['同一时间只能维持一个专注法术。受伤时做体质豁免，DC 为 10 与所受伤害一半（向下取整）中的较高者。失能会结束专注。'] : []),
      ...(spell.ritual ? ['若你拥有适用的仪式施法能力，可以多花 10 分钟作为仪式施放，不消耗法术位。不同职业对已知、准备或法术书记载有不同要求。'] : []),
      ...(spell.materialCost ? ['有标价的材料需要带来实际物品。'] : []),
      ...(spell.materialConsumed ? ['施法会消耗注明为耗材的成分，每次施放都要重新准备。'] : []),
    ];
    return [ruleSection('施法参数', {facts: [['英文名', spell.en], ['环阶', spell.level ? spell.level + ' 环' : '戏法'], ['学派', spell.school],
      ['施法时间', spell.time], ['距离', spell.range], ['持续时间', spell.duration], ['所需成分', components], ['材料明细', spell.material],
      ['专注', spell.concentration ? '需要' : '无需'], ['仪式', spell.ritual ? '有此标签' : '无此标签']]}),
      ruleSection('伤害与判定', {facts: spellResolutionFacts(spell)}),
      ...(expandedSpellRules[spell.id] ? [ruleSection('效果与用法', {text: expandedSpellRules[spell.id]})] : []),
      ruleSection('资源与限制', {text: mechanics}),
      ruleSection('怎样选到', {facts: [['常规职业列表', spell.classes.map(job => classList[job]?.[0]).filter(Boolean).join('、')]],
        text: ['职业列表决定通常能从哪里选择这个法术。子职、专长或种族也可能另行提供。已知法术、法术书和今日准备是不同的记录。']})];
  }

  function gearSections(item) {
    const categories = {simple:'简易武器', martial:'军用武器', ...armorNames};
    const label = categories[item.type] ?? ({instrument: '乐器', mount: '坐骑', vehicle: '载具'}[item.kind] ?? '冒险装备');
    const base = ruleSection('物品资料', {facts: [['类型', label], ...equipmentStats(item), ...equipmentPriceWeight(item)]});
    if (item.kind === 'weapon') {
      const properties = (item.properties ?? []).map(key => weaponProperties[key]).filter(Boolean);
      const ability = item.properties.includes('finesse') ? '力量或敏捷' : item.category === 'ranged' ? '敏捷' : '力量';
      return [base, ruleSection('怎样攻击', {text: [`通常掷 d20 加${ability}调整值。有该武器熟练时，命中检定再加熟练加值。`,
        item.damage ? `命中后按 ${item.damage} ${item.damageType}结算，通常再加所用属性调整值。` : '命中后按此武器的特殊效果处理。',
        ...(item.range ? [`正常射程为 ${item.range[0]} 尺。超过正常射程但在 ${item.range[1]} 尺内时，攻击检定有劣势。超过最远射程无法攻击。`] : [])]}),
      ...(properties.length ? [ruleSection('武器特性', {entries: properties})] : []),
      ...(item.note ? [ruleSection('专属规则', {text: [item.note]})] : [])];
    }
    if (item.kind === 'armor') {
      return [base, ruleSection('护甲与装备条件', {
        text: ['穿戴不熟练的护甲时，力量或敏捷相关的属性检定、豁免与攻击检定有劣势，并且无法施法。',
          ...(item.type === 'shield' ? ['占用一只手。一次只受益于一面盾牌。'] : []),
          ...(item.strength ? ['力量低于门槛时通常会降低 10 尺步速，矮人的对应特性可免除这项惩罚。'] : [])]})];
    }
    const contents = (item.contents ?? []).map(entry => typeof entry === 'string' ? entry : (coreRules.items[entry.id]?.name ?? entry.id) + ' × ' + entry.quantity);
    return [base, ruleSection('携带与使用', {text: [item.note || item.desc || '按实际携带数量记录。若用于检定，先描述你怎么用，DM 会决定适用的属性及工具熟练。'], facts: [['套组内含', contents.join('、')]]})];
  }

  function choiceRows(choices) {
    return choices.map(choice => [choice.level + ' 级 · ' + choice.name,
      (choice.optional ? '可选，最多 ' : '选择 ') + choice.count + ' 项。' + (choice.options ?? []).map(option => option.name).join('、')]);
  }

  function featureRows(levels) {
    return Object.entries(levels ?? {}).flatMap(([level, entries]) => entries.map(entry => [level + ' 级 · ' + entry.name, entry.desc]));
  }

  function requirementText(condition) {
    if (condition.any) return condition.any.map(requirementText).join(' 或 ');
    if (condition.stat !== undefined) return attrs[condition.stat] + ' 至少 ' + condition.min;
    if (condition.armor) return '拥有' + (armorNames[condition.armor] ?? condition.armor) + '熟练';
    if (condition.spellcasting) return '能施放至少一个法术';
    if (condition.spell) return '已学会' + (coreSpells.find(spell => spell.id === condition.spell)?.name ?? condition.spell);
    if (condition.choice || condition.group) {
      const choice = coreRules.choices.find(item => item.id === condition.choice || item.group === condition.group);
      return '已选「' + (choice?.options.find(option => option.id === condition.option)?.name ?? condition.option) + '」';
    }
    return '满足该条目的特定前提';
  }

  const exploringEberron2020 = 'https://www.dmsguild.com/product/315887/Exploring-Eberron';
  const revisedEberronSubclasses = new Set(['挽歌吟者学院', '心灵领域', '易戎武者', '锻造师', '鬼才']);
  const revisedEberronBackgrounds = new Set(['幻身灵旅者', '达坎地精', '马伦蒂']);
  const extensionClassRows = {artificer: expansionArtificerRules, bloodhunter: expansionBloodHunterRules};
  function backgroundRuleSource(id) {
    const path = backgrounds[id]?.[5];
    return revisedEberronBackgrounds.has(id) ? exploringEberron2020 : path ? src(path) : backgroundSource;
  }
  function subclassReferenceRows(job, id) {
    return expansionSubclassRules[job]?.[id] ?? (job === 'bloodhunter' ? expansionBloodHunterSubclasses[id] : undefined);
  }

  function catalogueRuleCard(key, option) {
    const {id, title, caption} = option;
    const spell = ruleSpell(key, id);
    const item = ruleItem(key, id);
    const card = {title, art: optionIllustration(key, option, true), kind: '建卡选项', summary: '', source: '', links: [], sections: []};
    function source(label, url) {
      card.source = label;
      if (url) card.links.push([label, url]);
    }
    function section(title, content) {
      const value = ruleSection(title, content);
      if (value.facts.length || value.text.length || value.entries.length) card.sections.push(value);
    }
    function levelSections(rows, label) {
      const byLevel = new Map();
      for (const [level, name, body] of rows) {
        if (!byLevel.has(level)) byLevel.set(level, []);
        byLevel.get(level).push([name, body]);
      }
      for (const [level, entries] of [...byLevel].sort(([a], [b]) => a - b)) section(level + ' 级 · ' + label, {entries});
    }
    if (spell) {
      card.kind = '法术';
      card.summary = spell.summary;
      source(spell.sourceBook ?? '2014 玩家手册', spell.source);
      card.links.push(['旧版通用施法规则', ruleBasic + 'spellcasting']);
      if (CharacterLocale.language === 'en' && !spell.sourceBook) card.links.push(['2014 Basic Rules: Spells', ruleBasic + 'spells']);
      card.sections = spellSections(spell);
    } else if (item) {
      card.kind = item.kind === 'armor' ? '护甲' : item.kind === 'weapon' ? '武器' : '装备';
      card.summary = item.kind === 'weapon' ? `${item.category === 'ranged' ? '远程' : '近战'}武器${item.damage ? '，基础伤害 ' + item.damage + ' ' + item.damageType : '，命中后使用特殊规则'}。` :
        item.kind === 'armor' ? '穿戴与熟练情况会影响护甲等级和部分检定。' : '用来安排起始物品、携带量和购置预算。';
      source('2014 装备规则', ruleBasic + 'equipment');
      card.sections = gearSections(item);
    } else if (key === 'job' && id !== 'custom') {
      const base = optionDetail(key, option);
      const [, die, saves, count, pool] = classList[id];
      const track = classGrowth[id];
      const core = coreRules.classes[id];
      card.kind = '职业';
      card.summary = base.note;
      source(base.source, id === 'artificer' ? src('塔莎的万事坩埚/玩家选项/职业/奇械师.html') : id === 'bloodhunter' ? src('第三方/血猎手/血猎手.htm') : src('玩家手册/职业/' + title + '.html'));
      if (CharacterLocale.language === 'en' && core) card.links.push(['2014 Basic Rules: Classes', classSource]);
      section('1 级建卡', {facts: [['主要属性', core?.primary.map(i => attrs[i]).join('、')], ['生命骰', 'd' + die], ['豁免熟练', saves.map(i => attrs[i]).join('、')],
        ['技能名额', '选 ' + count + ' 项'], ['技能可选范围', pool.join('、')], ['护甲熟练', core?.armor.map(id => armorNames[id] ?? id).join('、')],
        ['武器熟练', core?.weapons.map(id => coreRules.items[id]?.name ?? ({simple:'简易武器',martial:'军用武器'}[id] ?? id)).join('、')], ['工具', core?.tools.join('、')]],
        text: [`1 级生命上限通常是 ${die} + 体质调整值。后续升级可按规则取固定值 ${Math.floor(die / 2) + 1} 或记录掷骰结果，再计入体质调整值。`]});
      section('子职与属性提升', {facts: [['子职解锁', `${track.sub[0]} 级 · ${track.title}`], ['子职获得能力', track.sub.join('、') + ' 级'],
        ['属性提升等级', improvementsFor(id).join('、') + ' 级'], ['子职可选', (id === 'rogue' ? subclassData.map(sub => sub.name) : subclassNames(id)).join('、')]]});
      const features = featureRows(coreRules.classFeatures[id]);
      if (extensionClassRows[id]) levelSections(extensionClassRows[id], '职业能力');
      else section('逐级职业能力', {entries: features.length ? features : Object.entries(track.features).map(([level, text]) => [level + ' 级', text])});
      if (id === 'artificer') card.links.push(['奇械师注法', src('塔莎的万事坩埚/玩家选项/职业/奇械师/奇械师注法.html')],
        ['奇械师法术列表', src('塔莎的万事坩埚/玩家选项/职业/奇械师/奇械师法术列表.html')],
        ['旧版官方勘误', 'https://media.wizards.com/2021/dnd/downloads/TCE-Errata.pdf']);
      if (id === 'bloodhunter') {
        section('通用血咒 · 普通与增幅', {entries: expansionBloodHunterCurses});
        card.links.push(['血咒', src('第三方/血猎手/血咒.htm')], ['作者后续版本（供区分）', 'https://www.dndbeyond.com/classes/357975-blood-hunter']);
      }
      section('升级还要选什么', {entries: choiceRows(coreRules.choices.filter(choice => choice.job === id && !choice.subclass))});
      section('起始装备路线', {entries: (core?.equipment ?? []).map(group => [group.label, group.options.map(option => option.name).join(' / ')]),
        facts: [['金币购置替代', core?.wealth && `${core.wealth.count}d${core.wealth.dice} × ${core.wealth.multiplier} gp`]]});
    } else if (isRuleSubclass(key)) {
      const base = optionDetail(key, option);
      const rogue = state.job === 'rogue' && (subs[id] ?? subclassData.find(sub => sub.name === id));
      const record = subclassRecord(state.job, id);
      const detailed = subclassReferenceRows(state.job, id);
      card.kind = '子职';
      card.summary = base.note || `${classList[state.job][0]}的专精路线。按下方等级查看它的能力。`;
      if (revisedEberronSubclasses.has(id)) source('探秘艾伯伦 · 2020 初版 · 第三方', exploringEberron2020);
      else source(base.source || '旧版规则目录', rogue?.url ?? record?.url);
      section('获得时机与定位', {facts: [['所属职业', classList[state.job][0]], ['首次解锁', activeTrack(state).sub[0] + ' 级'], ['玩法侧重', rogue?.tag]],
        text: rogue?.limit ? [rogue.limit] : []});
      if (detailed?.length) {
        levelSections(detailed, '子职能力');
        section('记录方式', {text: ['扩展子职的触发效果和使用次数可按本页在角色卡补记。打开详情不会应用选择。']});
      } else {
        section('逐级子职能力', {entries: (base.features ?? []).map(([level, [name, text]]) => [level + ' 级 · ' + name, text || '此能力尚无核验过的旧版说明。'])});
      }
      section('本路线的细分选择', {entries: choiceRows(coreRules.choices.filter(choice => choice.job === state.job && choice.subclass === title))});
    } else if (key === 'ancestry' && id !== 'custom') {
      const base = optionDetail(key, option);
      const race = coreRules.races[id];
      const traits = legacyRaceOptions[id];
      const detailed = expansionAncestryRules[id];
      card.kind = '种族';
      card.summary = base.note || '确定建卡时的属性加值、移动速度和种族熟练。';
      source(base.source, ancestrySource(id));
      section('起始数据', {facts: [...base.facts, ['体型', race?.size], ['感官', race?.senses?.join('、')],
        ['武器熟练', race?.weapons?.map(id => coreRules.items[id]?.name ?? id).join('、')], ['工具', race?.tools?.join('、')]]});
      section('种族特性与边界', {entries: detailed ?? race?.features.map(feature => [feature.name, feature.desc]) ?? [],
        text: !detailed && traits?.note && !race ? [traits.note] : []});
      section('建卡时还要选择', {entries: choiceRows(coreRules.choices.filter(choice => choice.race === id)),
        text: ['在种族栏填完可选语言、属性和熟练。工具会把适用加值计入总览，触发型特性按本页条件使用。']});
    } else if (key === 'background' && id !== 'custom') {
      const base = optionDetail(key, option);
      const record = coreRules.backgrounds[id];
      const detailed = expansionBackgroundRules[backgrounds[id][0]];
      card.kind = '背景';
      card.summary = record?.desc || base.note || '决定角色的来历、起始熟练及相应的背景资源。';
      source(revisedEberronBackgrounds.has(id) ? '探秘艾伯伦 · 2020 初版 · 第三方' : base.source, backgroundRuleSource(id));
      section('角色拿到什么', {facts: [...base.facts, ['可选语言', record?.languageCount ? record.languageCount + ' 门' : ''], ['工具熟练', record?.tools?.join('、')],
        ['起始物品', record?.equipment?.map(entry => (coreRules.items[entry.id]?.name ?? entry.id) + ' × ' + entry.quantity).join('、')]]});
      section('在团里怎样用', {entries: detailed ?? [], text: detailed ? [] : [record?.feature || base.note, record?.equipmentNote].filter(Boolean)});
      if (backgrounds[id][5]?.startsWith('斯翠海文：')) card.links.push(['斯翠海文学徒专长', src('斯翠海文：混沌研习/玩家选项/专长.html')]);
      section('和其他选择的关系', {text: ['若职业和背景给了同一种熟练，可以与 DM 确定如何替换重复的熟练。背景起始物品与金币按所采用的起始装备方式处理。']});
    } else if (key === 'plan.feat' && (featMap[id] || manualFeats[id])) {
      const feat = featMap[id];
      const manual = manualFeats[id];
      const featName = (feat ?? manual).name;
      const details = expansionFeatRules[featName];
      const expansionPath = manual?.path ?? legacyFeatNames.slice(1).find(([, names]) => names.includes(featName))?.[0];
      const core = coreRules.feats.find(feat => feat.id === id);
      card.kind = '专长';
      card.summary = feat?.desc || (details ? '本页列出旧版专长的前提、效果及限制。' : '此扩展专长暂只有目录资料。');
      source(expansionPath ? sourceLabel(expansionPath) : feat?.book || '2014 玩家手册', expansionPath ? src(expansionPath) : urls.phbfeat);
      section('获得条件', {facts: feat && !details ? [['前提', (core?.prerequisites ?? []).map(requirementText).join('；') || (feat.prereq !== undefined ? attrs[feat.prereq] + ' 至少 13' : '无额外属性前提')],
        ['属性提升', feat.stats?.length ? feat.stats.map(i => attrs[i]).join(' / ') + ' 中选一项 +1' : '视专长效果']] : [],
        text: ['通常以一次属性提升机会换取专长。部分战役也会由背景或额外奖励提供指定专长。']});
      section('使用方式与限制', {entries: details ?? [], text: details ? [] : [core?.desc || feat?.desc, feat?.limit, feat?.fit].filter(Boolean)});
      if (manual) section('记录方式', {text: [details ? '这项专长的角色数值和使用次数仍按本级手填栏记录。' : '此专长的旧版能力尚未核验，可在本级手填。']});
      const choice = coreRules.featChoices[id];
      section('专长内的选择', {facts: [['需选数量', choice?.count], ['可选项', choice?.options.map(option => option.name).join('、')]],
        entries: (coreRules.featSpellChoices[id]?.choices ?? []).map(choice => [choice.ring ? choice.ring + ' 环法术' : '戏法', `选择 ${choice.count} 项${choice.ritual ? '有仪式标签的' : ''}${choice.attack ? '需要攻击检定的' : ''}法术。`])});
    } else if (Object.hasOwn(skills, id)) {
      const expert = key.startsWith('expertise.') || ['plan.expertise', 'plan.featExpert'].includes(key);
      card.kind = expert ? '专精' : '技能';
      card.summary = skillUse[id];
      source('2014 属性检定规则', ruleBasic + 'using-ability-scores');
      section('什么时候掷骰', {text: [skillExample[id], '先描述你做了什么。结果有不确定性时，DM 决定是否需要检定及适用的属性。']});
      section('怎样计算', {facts: [['常用属性', attrs[skills[id]]], ['检定公式', `d20 + ${attrs[skills[id]]}调整值${expert ? ' + 双倍熟练加值' : '（有熟练时再加熟练加值）'}`]],
        text: ['举例，属性调整值 +3、熟练加值 +2 时，熟练检定为 d20 +5。有适用专精时改为 d20 +7。重复熟练来源不会叠加。']});
    } else if (key === 'treeLevel') {
      const job = state.job;
      card.kind = '等级';
      card.summary = `查看${classList[job][0]}在这一等级的通用成长。`;
      source('2014 等级与熟练', pointBuySource);
      section('本级数值和选择', {facts: [['熟练加值', sign(proficiencyAt(id))], ['子职', id === classGrowth[job].sub[0] ? '这一等级解锁子职' : '按职业成长表'],
        ['属性提升', job !== 'custom' && improvementsFor(job).includes(id) ? '这一等级可分配属性提升；DM 开放时可选专长' : '']],
        text: ['查看等级用来规划。只有确认角色等级后，公开摘要中的实际等级才会更新。']});
      section('本级通用职业能力', {entries: featureRows({[id]: coreRules.classFeatures[job]?.[id] ?? []})});
    } else if (key.startsWith('equipmentChoices.')) {
      const group = coreRules.classes[state.job]?.equipment.find(group => group.id === key.split('.')[1]);
      const choice = group?.options.find(choice => choice.id === id);
      card.kind = '起始装备';
      card.summary = choice?.note || '从职业起始装备的这组备选中，选用这一套配置。';
      source('2014 起始装备规则', pointBuySource + '#5ChooseEquipment');
      section('这一组给什么', {facts: [['选择组', group?.label], ['需要熟练', choice?.requiresArmor ? armorNames[choice.requiresArmor] : coreRules.items[choice?.requiresWeapon]?.name],
        ['自选件数', choice?.pick?.count], ['自选范围', choice?.pick ? {instrument:'乐器', simple:'简易武器', martial:'军用武器', 'simple-melee':'简易近战武器', 'martial-melee':'军用近战武器'}[choice.pick.pool ?? choice.pick.type] : '']],
        entries: equipmentChoiceItems(key, id).map(({item, quantity}) =>
          [item.name + ' × ' + quantity, [equipmentSummary(item, true), item.note].filter(Boolean).join(' · ')])});
      section('怎样完成装备', {text: ['如果这条路线有自选名额，应用后再挑指定物品。要把武器或护甲计入战斗数值，可以在装备栏确认当前穿戴和手持项目。']});
    } else if (key.startsWith('decision.')) {
      const choice = coreRules.choices.find(choice => choice.id === key.slice(9));
      const entry = choice?.options.find(option => option.id === id);
      card.kind = '细分选择';
      card.summary = entry?.desc || caption || '把这项选择记入相应的能力或装备栏目。';
      source(choice ? '2014 玩家手册' : '本地建卡目录', choice?.job ? src('玩家手册/职业/' + classList[choice.job][0] + '.html') : '');
      section('获得条件与选择名额', {facts: [['选择组', choice?.name], ['取得等级', choice?.level ? choice.level + ' 级' : ''],
        ['本组名额', choice?.count], ['最低等级', entry?.minLevel > 1 ? entry.minLevel + ' 级' : ''],
        ['前提', (entry?.prerequisites ?? []).map(requirementText).join('；')]]});
      section('使用方式', {text: [entry?.desc || caption || '应用后可从当前选择组核对。更换时先移除不需要的项目。']});
    } else {
      const base = key === 'armor' ? {note: '不穿护甲时，通常从 10 + 敏捷调整值计算基础 AC；职业或种族特性可能提供其他计算方式。'} :
        key.startsWith('boostTargets.') ? {note: '将这个种族加值分配给一项符合条件的属性。'} : optionDetail(key, option);
      card.summary = base.note || '选择后可在相应栏目中记录和调整。';
      source(base.source || '本地建卡目录', key === 'armor' ? ruleBasic + 'equipment' : key === 'plan.feat' && manualFeats[id] ? src(manualFeats[id].path) : '');
      section('规则与填写方式', {facts: base.facts ?? [], text: [card.summary]});
    }
    if (!card.sections.length) section('规则说明', {text: [card.summary || '当前目录提供该选项的基本资料。']});
    return card;
  }

  function renderRuleArticle(card, standalone = false) {
    const mainHeading = standalone ? 'h1' : 'h3';
    const sectionHeading = standalone ? 'h2' : 'h4';
    const sections = card.sections.map((section, index) => `<section class="rule-section" id="rule-card-section-${index}">
      <${sectionHeading}>${esc(section.title)}</${sectionHeading}>
      ${section.facts.length ? `<dl class="rule-facts">${section.facts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>` : ''}
      ${section.text.filter(Boolean).map(text => `<p>${esc(text)}</p>`).join('')}
      ${section.entries.length ? `<ul class="rule-entries">${section.entries.map(([label, body]) => `<li><strong>${esc(label)}</strong><p>${esc(body)}</p></li>`).join('')}</ul>` : ''}
    </section>`).join('');
    return `<article class="rule-sheet">
      <header class="rule-cover">${card.art}<div><p class="rule-kicker">${esc(card.kind)} · ${esc(card.source || '旧版建卡资料')}</p>
      <${mainHeading}>${esc(card.title)}</${mainHeading}><p>${esc(card.summary)}</p></div></header>
      ${card.sections.length > 1 ? `<nav class="rule-nav" aria-label="规则卡目录">${card.sections.map((section, index) => `<a href="#rule-card-section-${index}">${esc(section.title)}</a>`).join('')}</nav>` : ''}
      ${sections}
      ${card.links.length ? `<footer class="rule-citations"><${sectionHeading}>规则出处</${sectionHeading}>
        <ul>${card.links.map(([name, url]) => `<li>${linkTo(url, name + ' ↗')}</li>`).join('')}</ul></footer>` : ''}
    </article>`;
  }

  const ruleCardStyles = "/* RULE_CARD_STYLE_VALUE */";
  let openRuleRecord = null;

  function portableRuleDocument(card) {
    let article = renderRuleArticle(card, true);
    if (CharacterLocale.language === 'en') {
      const main = document.createElement('main');
      main.innerHTML = article;
      CharacterLocale.localize(main);
      article = main.innerHTML;
    }
    const title = CharacterLocale.text(card.title) + ' · ' + CharacterLocale.text('D&D 建卡规则卡');
    return `<!doctype html>
<html lang="${CharacterLocale.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark">
<title>${esc(title)}</title><style>
:root{color-scheme:light dark;--paper:light-dark(#f7f1e7,#20232e);--panel:light-dark(#fffcf6,#292e3b);--ink:light-dark(#27344b,#f3eddf);--muted:light-dark(#566077,#bac2d0);--line:light-dark(#d7d0c8,#51586b);--brass:light-dark(#8a4f43,#eab4a2);--soft:light-dark(#f0e0d6,#463740)}
body{margin:0;padding:clamp(12px,4vw,34px);background:var(--paper);color:var(--ink);font:15px/1.65 system-ui,sans-serif}main{max-width:900px;margin:auto}*{box-sizing:border-box}a{color:var(--brass)}
${ruleCardStyles}
</style></head><body><main>${article}</main></body></html>`;
  }

  function openOptionRule(key, value, register = false) {
    const item = ['shopItem', 'inventoryItem'].includes(key) ? coreRules.items[value] : undefined;
    const branch = branches.get(key);
    const option = item ? {id: item.id, title: item.name} : branch?.options.find(option => String(option.id) === value);
    if (!option) return;
    openRuleRecord = catalogueRuleCard(key, option);
    const spell = ruleSpell(key, value);
    const live = spell ? renderSpellCastContexts(spell, branchSpellContext(key, spell, calculate())) : '';
    const dialog = openDialog('选项详情', `<div class="rule-actions">
        ${item ? (key === 'shopItem' ? (register ? '<button type="button" data-action="register-equipment">返回登记装备</button>' :
          '<button type="button" data-action="equipment-shop">返回装备商店</button>') : '') :
          `<button type="button" class="primary" data-apply-choice="${esc(option.id)}"${option.disabled ? ' disabled' : ''}>${branch.multiple && option.selected ? '移除此项' : '选择此项'}</button>`}
        <button type="button" data-rule-export>下载规则卡 HTML</button><button type="button" data-rule-embed>复制嵌入代码</button>
        <p class="hint rule-export-note">导出内容包含图示和规则，可以独立打开。</p>
        <p class="hint" data-rule-copy-status role="status" hidden></p>
        <label data-rule-embed-field hidden>嵌入代码<textarea readonly data-rule-embed-code rows="4"></textarea></label>
      </div>${item ? renderEquipmentUse(register ? 'registerItem' : key, item) : ''}${live}${renderRuleArticle(openRuleRecord)}`);
    dialog.classList.add('rule-card-dialog');
  }

  function handleRuleCardClick(button) {
    if (button.hasAttribute('data-open-rule')) {openOptionRule(branchKey, button.dataset.openRule); return true;}
    if (button.hasAttribute('data-shop-rule')) {openOptionRule('shopItem', button.dataset.shopRule, button.hasAttribute('data-register-item')); return true;}
    if (button.hasAttribute('data-inventory-rule')) {openOptionRule('inventoryItem', button.dataset.inventoryRule); return true;}
    if (button.hasAttribute('data-rule-export') && openRuleRecord) {
      const filename = CharacterLocale.text(openRuleRecord.title).replace(/[\\/:*?"<>|]/g, '-') + CharacterLocale.text('-规则卡.html');
      downloadFile(filename, portableRuleDocument(openRuleRecord), 'text/html;charset=utf-8');
      return true;
    }
    if (button.hasAttribute('data-rule-embed') && openRuleRecord) {
      const dialog = button.closest('dialog');
      const field = dialog.querySelector('[data-rule-embed-field]');
      const code = field.querySelector('textarea');
      const status = dialog.querySelector('[data-rule-copy-status]');
      code.value = `<iframe title="${esc(CharacterLocale.text(openRuleRecord.title + ' · 规则卡'))}" sandbox="allow-popups allow-popups-to-escape-sandbox" loading="lazy" style="width:100%;height:720px;border:0" srcdoc="${esc(portableRuleDocument(openRuleRecord))}"></iframe>`;
      field.hidden = false;
      status.hidden = false;
      status.textContent = CharacterLocale.text('复制下方代码，粘贴到支持 HTML 嵌入的页面。');
      code.focus();
      code.select();
      navigator.clipboard?.writeText(code.value).then(() => {status.textContent = CharacterLocale.text('已复制嵌入代码。');}).catch(() => {});
      return true;
    }
    return false;
  }
