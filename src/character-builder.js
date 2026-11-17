(() => {
  const root = document.getElementById('builder');
  const seed = JSON.parse(document.getElementById('character-seed').textContent);
  const privateCopy = seed.private === true;
  const storageKey = 'dnd-2014-character-board/v1/' + (privateCopy ? 'private' : 'player');
  const cost = [0, 1, 2, 3, 4, 5, 7, 9];
  const abilityCodes = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const skillNames = Object.keys(skills);
  const abilityOptions = attrs.map((name, index) => [index, name]);
  const pointBuySource = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/step-by-step-characters';
  const classSource = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes';
  const backgroundSource = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/personality-and-background';
  const changelingSource = 'https://www.dndbeyond.com/sources/dnd/sae/eberron-rising-from-the-last-war';
  const classList = {
    artificer: ['奇械师', 8, [2,3], 2, ['奥秘','历史','调查','医药','自然','察觉','巧手'], 3],
    barbarian: ['野蛮人', 12, [0,2], 2, ['驯兽','运动','威吓','自然','察觉','求生'], 3],
    bard: ['吟游诗人', 8, [1,5], 3, skillNames, 3],
    bloodhunter: ['血猎手', 10, [1,3], 3, ['特技','奥秘','运动','历史','洞悉','调查','宗教','求生']],
    cleric: ['牧师', 8, [4,5], 2, ['历史','洞悉','医药','游说','宗教'], 1],
    druid: ['德鲁伊', 8, [3,4], 2, ['奥秘','驯兽','洞悉','医药','自然','察觉','宗教','求生'], 2],
    fighter: ['战士', 10, [0,2], 2, ['特技','驯兽','运动','历史','洞悉','威吓','察觉','求生'], 3],
    monk: ['武僧', 8, [0,1], 2, ['特技','运动','历史','洞悉','宗教','隐匿'], 3],
    paladin: ['圣武士', 10, [4,5], 2, ['运动','洞悉','威吓','医药','游说','宗教'], 3],
    ranger: ['游侠', 10, [0,1], 3, ['驯兽','运动','洞悉','调查','自然','察觉','隐匿','求生'], 3],
    rogue: ['游荡者', 8, [1,3], 4, roguePool, 3],
    sorcerer: ['术士', 6, [2,5], 2, ['奥秘','欺瞒','洞悉','威吓','游说','宗教'], 1],
    warlock: ['邪术师', 8, [4,5], 2, ['奥秘','欺瞒','历史','威吓','调查','自然','宗教'], 1],
    wizard: ['法师', 6, [3,4], 2, ['奥秘','历史','洞悉','调查','医药','宗教'], 2],
    custom: ['手填职业', 8, [], 2, skillNames],
  };
  // Name, fixed bonuses, walk speed, fixed skills, elective skills, fixed languages, extra languages.
  const ancestries = {
    human: ['人类', [1,1,1,1,1,1], 30, [], 0, ['通用语'], 1],
    highElf: ['高等精灵', [0,2,0,1,0,0], 30, ['察觉'], 0, ['通用语','精灵语'], 1],
    woodElf: ['木精灵', [0,2,0,0,1,0], 35, ['察觉'], 0, ['通用语','精灵语'], 0],
    drow: ['卓尔精灵', [0,2,0,0,0,1], 30, ['察觉'], 0, ['通用语','精灵语'], 0],
    hillDwarf: ['丘陵矮人', [0,0,2,0,1,0], 25, [], 0, ['通用语','矮人语'], 0],
    mountainDwarf: ['山地矮人', [2,0,2,0,0,0], 25, [], 0, ['通用语','矮人语'], 0],
    lightfoot: ['轻足半身人', [0,2,0,0,0,1], 25, [], 0, ['通用语','半身人语'], 0],
    stout: ['强心半身人', [0,2,1,0,0,0], 25, [], 0, ['通用语','半身人语'], 0],
    forestGnome: ['森林侏儒', [0,1,0,2,0,0], 25, [], 0, ['通用语','侏儒语'], 0],
    rockGnome: ['岩地侏儒', [0,0,1,2,0,0], 25, [], 0, ['通用语','侏儒语'], 0],
    halfElf: ['半精灵', [0,0,0,0,0,2], 30, [], 2, ['通用语','精灵语'], 1],
    halfOrc: ['半兽人', [2,0,1,0,0,0], 30, ['威吓'], 0, ['通用语','兽人语'], 0],
    dragonborn: ['龙裔', [2,0,0,0,0,1], 30, [], 0, ['通用语','龙语'], 0],
    tiefling: ['提夫林', [0,0,0,1,0,2], 30, [], 0, ['通用语','炼狱语'], 0],
    changeling: ['幻身灵 · 艾伯伦', [0,0,0,0,0,2], 30, [], 2, ['通用语'], 2],
    custom: ['手动录入', [0,0,0,0,0,0], 30, [], 0, [], 0],
  };
  for (const [id, option] of Object.entries(legacyRaceOptions)) {
    ancestries[id] = [option.name, option.bonus ?? [0,0,0,0,0,0], option.speed ?? 30,
      option.skills ?? [], option.picks ?? 0, option.languages ?? ['通用语'], option.languagePicks ?? 0];
  }
  const coreRaceFiles = {
    human: '人类', highElf: '精灵', woodElf: '精灵', drow: '精灵', hillDwarf: '矮人', mountainDwarf: '矮人',
    lightfoot: '半身人', stout: '半身人', forestGnome: '侏儒', rockGnome: '侏儒', halfElf: '半精灵',
    halfOrc: '半兽人', dragonborn: '龙裔', tiefling: '提夫林',
  };
  const ancestryBook = id => raceBooks[legacyRaceOptions[id]?.book ?? (id === 'changeling' ? 'eberron' : 'phb')];
  const ancestrySource = id => {
    if (id === 'custom') return '';
    if (id === 'changeling') return src(raceBooks.eberron[1] + '幻身灵.html');
    return src(ancestryBook(id)[1] + (legacyRaceOptions[id]?.file ?? coreRaceFiles[id] + '.html'));
  };
  // Illustration presets, independent of the race rules and character scores.
  const portraitPresets = {
    human: {height: 178, build: 100},
    highElf: {height: 192, build: 83, ears: 'pointed'},
    woodElf: {height: 186, build: 86, ears: 'pointed'},
    drow: {height: 175, build: 83, ears: 'pointed'},
    hillDwarf: {height: 132, build: 120},
    mountainDwarf: {height: 140, build: 126},
    lightfoot: {height: 94, build: 78},
    stout: {height: 99, build: 96},
    forestGnome: {height: 100, build: 77, ears: 'tapered'},
    rockGnome: {height: 105, build: 91, ears: 'tapered'},
    halfElf: {height: 182, build: 91, ears: 'tapered'},
    halfOrc: {height: 193, build: 118, fangs: true},
    dragonborn: {height: 202, build: 123, reptilian: true},
    tiefling: {height: 180, build: 94, ears: 'tapered', horns: true},
    changeling: {height: 178, build: 100},
    custom: {height: 178, build: 100},
  };
  const portraitFields = {
    height: {label: '身高', unit: ' cm', min: 85, max: 215},
    build: {label: '体型宽度', unit: '%', min: 70, max: 135},
  };
  const backgrounds = {
    charlatan: ['骗子', ['欺瞒','巧手'], 15, '易容工具、文书伪造工具', '假身份'],
    criminal: ['罪犯', ['欺瞒','隐匿'], 15, '盗贼工具、选一种游戏套组', '罪犯联络人'],
    guild: ['公会工匠', ['洞悉','游说'], 15, '选一种工匠工具、选一种语言', '公会会员'],
    acolyte: ['侍僧', ['洞悉','宗教'], 15, '选两种语言', '信仰庇护'],
    sage: ['智者', ['奥秘','历史'], 10, '选两种语言', '研究者'],
    custom: ['自定义背景', ['', ''], null, '手填工具与语言', '手填背景特性'],
  };
  for (const record of legacyBackgrounds) {
    const existing = Object.values(backgrounds).find(bg => bg[0] === record[0]);
    if (existing) existing[5] = record[5];
    else backgrounds[record[0]] = [record[0], [record[1][0] || '', record[1][1] || ''], ...record.slice(2)];
  }
  // Van Richten’s Investigator and Xanathar’s Inquisitive share a Chinese name.
  const backgroundTitle = id => id === '调查员' && CharacterLocale.language === 'en' ? 'Investigator' : backgrounds[id][0];
  const backgroundName = () => state.background === 'custom' && state.backgroundName.trim() ? state.backgroundName.trim() : backgroundTitle(state.background);
  function sourceLabel(path) {
    if (!path) return '手填';
    const [group, book] = path.split('/');
    if (group === '第三方') return book + ' · 第三方';
    return group === '模组' ? book : group;
  }
  for (const feat of coreRules.feats) {
    if (!featMap[feat.id]) {
      featMap[feat.id] = {...feat, ...(feat.stats?.length ? {stats: feat.stats} : {stats: undefined})};
      feats.push(featMap[feat.id]);
    }
  }
  const manualFeats = Object.fromEntries(legacyFeatNames.flatMap(([path, names]) =>
    names.filter(name => !feats.some(feat => feat.name === name)).map(name => ['catalog:' + name, {name, path}])));

  function subclassCatalog(job) {
    const defaultBook = job === 'artificer' ? 'TCE' : 'PHB';
    const catalog = new Map((phbSubclasses[job] ?? []).map(name => [name, {name, book: defaultBook}]));
    for (const [name, book, path, features] of legacySubclasses[job] ?? []) {
      catalog.set(name, {name, book, url: src(path), features});
    }
    if (job === 'bloodhunter') {
      for (const name of ['弑灵结社', '化狼结社', '突变结社', '渎魂结社']) {
        catalog.set(name, {name, book: '血猎手', url: src('第三方/血猎手/' + name + '.htm')});
      }
    }
    return [...catalog.values()];
  }
  const subclassRecord = (job, name) => subclassCatalog(job).find(option => option.name === name);
  const subclassNames = job => subclassCatalog(job).map(option => option.name);
  const armors = {
    none: ['无甲', 10, Infinity], padded: ['布甲', 11, Infinity], leather: ['皮甲', 11, Infinity],
    studded: ['镶钉皮甲', 12, Infinity], hide: ['兽皮甲', 12, 2], shirt: ['链甲衫', 13, 2],
    scale: ['鳞甲', 14, 2], breastplate: ['胸甲', 14, 2], halfPlate: ['半身板甲', 15, 2],
    ring: ['环甲', 14, null], chain: ['链甲', 16, null], splint: ['条板甲', 17, null], plate: ['板甲', 18, null],
  };
  const weapons = {rapier: ['细剑', '1d8'], shortsword: ['短剑', '1d6']};
  const ranged = {shortbow: '短弓＋20 支箭', shortsword: '短剑'};
  const packs = {burglar: '窃贼套组', dungeon: '地城套组', explorer: '探索套组'};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const userText = value => `<span data-user-text>${esc(value)}</span>`;
  const sign = n => n >= 0 ? '+' + n : String(n);
  const mod = n => Math.floor((n - 10) / 2);
  const pairs = items => Object.entries(items).map(([key, record]) => [key, Array.isArray(record) ? record[0] : record]);
  const input = (key, label, value, attrs = '') => `<label>${label}<input data-key="${key}" data-focus="${key}" value="${esc(value)}" ${attrs}></label>`;
  const linkTo = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>`;
  const badgeList = list => `<div class="choice-pills">${list.map(text => `<span>${esc(text)}</span>`).join('')}</div>`;
  const defaults = {
    name: '', base: [8,15,13,12,14,10], manual: [8,15,13,12,14,10], scoreMode: 'buy',
    level: 1, plans: {}, ancestry: 'human', flex: 1, flex2: 4, ancestrySkills: [], portraits: {},
    languages: [], boostPattern: 'two-one', boostTargets: [1,2,4], raceNote: '',
    customBonuses: [0,0,0,0,0,0], customSpeed: 30, customCount: 0,
    job: 'rogue', subclass: '', jobSkills: [], customClassName: '', customHitDie: 8, customJobSaves: [], customJobSkills: 2,
    customUnlock: 3, customAsi: [],
    background: 'custom', backgroundSkills: ['', ''], backgroundName: '', backgroundNote: '', backgroundGold: null, customRaceName: '',
    expertise: ['', ''], armor: 'leather', shield: false, weapon: 'rapier', ranged: 'shortbow', pack: 'burglar', gear: '',
    weaponName: '', weaponDie: '', attackAbility: 1, attackTraining: false, actualLevel: 1,
    decisions: {}, preparations: [], inventory: [], equipmentChoices: {}, equipmentMode: 'pack', wealthRoll: 0,
    equippedWeapon: '', weaponGrip: 'one', backgroundLanguages: [], backgroundTools: [], rules: {feats: true, variantHuman: true},
    publicFields: {ancestry: false, features: false, notes: false}, archivedSelections: [],
    starterExample: false, pendingIdentity: []
  };
  const known = (list, value, fallback) => Object.hasOwn(list, value) ? value : fallback;
  const isAbility = index => Number.isInteger(index) && index >= 0 && index < 6;
  const limit = (list, allowed, count) => Array.isArray(list)
    ? [...new Set(list.filter(x => allowed.includes(x)))].slice(0, count) : [];
  const knownText = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
  const spent = base => base.reduce((total, score) => total + cost[score - 8], 0);
  const isScore = (score, min, max) => Number.isInteger(score) && score >= min && score <= max;
  const boostValues = (id, pattern) => {
    const mode = legacyRaceOptions[id]?.boost;
    if (mode === 'flex') return pattern === 'three-ones' ? [1,1,1] : [2,1];
    if (mode === 'two' || mode === 'twoOther') return [1,1];
    if (mode === 'plusTwo') return [2];
    return mode === 'single' ? [1] : [];
  };
  const boostPool = id => abilityOptions.filter(([i]) => !['single', 'twoOther'].includes(legacyRaceOptions[id]?.boost) || !ancestries[id][1][i]);
  const scoreRange = state => state.scoreMode === 'buy' ? [8, 15] : [3, 18];
  const baseScores = state => state.scoreMode === 'buy' ? state.base : state.manual;
  const classSpec = state => state.job === 'custom' ? [state.customClassName.trim() || '手填职业',
    state.customHitDie, state.customJobSaves, state.customJobSkills, skillNames] : classList[state.job];
  const activeTrack = state => state.job === 'custom' ? {...classGrowth.custom, sub: state.customUnlock ? [state.customUnlock] : []} : classGrowth[state.job];
  const activeImprovements = state => state.job === 'custom' ? state.customAsi : improvementsFor(state.job);
  const emptyStep = () => ({asi: [0,0,0,0,0,0], feat: '', stat: -1, featSkill: '', featExpert: '',
    expertise: [], hpDie: null, note: '', subclassName: '', customFeat: '', game: '', language1: '', language2: '',
    phantomSkill: '', style: '', decisions: {}, spellsAdded: [], spellsRemoved: [], freeSpells: []});
  const planStep = (state, level, job = state.job) => state.plans[job]?.[level] ?? emptyStep();
  const chosenSubclass = state => planStep(state, activeTrack(state).sub[0]).subclassName.trim() ||
    (state.job === 'rogue' ? (subs[state.subclass]?.name ?? '') : '');

  function normalizePlans(data, job) {
    const plans = {};
    for (const [key, [, die]] of Object.entries(classList)) {
      const hitDie = key === 'custom' && [6,8,10,12].includes(data.customHitDie) ? data.customHitDie : die;
      const steps = {};
      for (const level of growthLevels) {
        const raw = data.plans?.[key]?.[level];
        if (!raw || typeof raw !== 'object') continue;
        const step = emptyStep();
        step.asi = attrs.map((_, i) => isScore(raw.asi?.[i], 0, 2) ? raw.asi[i] : 0);
        if (step.asi.reduce((a, b) => a + b, 0) > 2) step.asi = emptyStep().asi;
        const migratedFeat = typeof raw.feat === 'string' && raw.feat.startsWith('catalog:') ?
          coreRules.feats.find(feat => feat.name === raw.feat.slice(8))?.id ?? raw.feat : raw.feat;
        step.feat = migratedFeat === 'custom' || Object.hasOwn(manualFeats, migratedFeat) ? migratedFeat : known(featMap, migratedFeat, '');
        step.stat = isAbility(raw.stat) ? raw.stat : -1;
        step.hpDie = level > 1 && isScore(raw.hpDie, 1, hitDie) ? raw.hpDie : null;
        const expertisePool = key === 'rogue' ? [...skillNames, '盗贼工具'] : skillNames;
        step.expertise = limit(raw.expertise, expertisePool, 2);
        for (const field of ['featSkill', 'featExpert', 'phantomSkill']) step[field] = skillNames.includes(raw[field]) ? raw[field] : '';
        for (const field of ['language1', 'language2']) step[field] = langs.includes(raw[field]) ? raw[field] : '';
        step.game = games.includes(raw.game) ? raw.game : '';
        step.style = knownText(raw.style, 24);
        step.subclassName = knownText(raw.subclassName, 90);
        step.customFeat = knownText(raw.customFeat, 90);
        step.note = knownText(raw.note, 800);
        if (migratedFeat === 'catalog:位面注能') {
          step.stat = -1;
          const review = '旧存档曾把「位面注能」当作独立专长。它实际属于「外层位面后裔」；请在本级重新选择。';
          step.note = (step.note ? review + '\n' + step.note : review).slice(0, 800);
        }
        step.decisions = normalizeDecisionMap(raw.decisions);
        step.spellsAdded = normalizeSpellIds(raw.spellsAdded);
        step.spellsRemoved = normalizeSpellIds(raw.spellsRemoved);
        step.freeSpells = normalizeSpellIds(raw.freeSpells);
        steps[level] = step;
      }
      if (Object.keys(steps).length) plans[key] = steps;
    }
    if (!data.plans && !['rogue','custom'].includes(job) && knownText(data.customSubclass, 90).trim()) {
      plans[job] = {[classGrowth[job].sub[0]]: {...emptyStep(), subclassName: knownText(data.customSubclass, 90)}};
    }
    return plans;
  }

  function normalize(data) {
    const state = {...structuredClone(defaults), ...data};
    state.starterExample = data.starterExample === true;
    state.pendingIdentity = limit(data.pendingIdentity, ['ancestry','job','background'], 3);
    state.ancestry = known(ancestries, state.ancestry, 'human');
    state.portraits = {};
    for (const ancestry of Object.keys(ancestries)) {
      for (const [key, {min, max}] of Object.entries(portraitFields)) {
        const value = data.portraits?.[ancestry]?.[key];
        if (!isScore(value, min, max) || value === portraitPreset(ancestry)[key]) continue;
        state.portraits[ancestry] ??= {};
        state.portraits[ancestry][key] = value;
      }
    }
    state.boostPattern = state.boostPattern === 'three-ones' ? 'three-ones' : 'two-one';
    const legalBoosts = boostPool(state.ancestry).map(([i]) => i);
    state.boostTargets = [...new Set([...limit(state.boostTargets, legalBoosts, 3), ...defaults.boostTargets, ...legalBoosts])]
      .filter(index => legalBoosts.includes(index)).slice(0, 3);
    state.raceNote = knownText(state.raceNote, 200);
    state.job = known(classList, state.job, 'rogue');
    state.level = isScore(state.level, 1, 20) ? state.level : 1;
    state.plans = normalizePlans(data, state.job);
    state.scoreMode = state.scoreMode === 'manual' ? 'manual' : 'buy';
    state.customClassName = knownText(state.customClassName, 90);
    state.customHitDie = [6,8,10,12].includes(state.customHitDie) ? state.customHitDie : 8;
    state.customJobSaves = limit(state.customJobSaves, [0,1,2,3,4,5], 6);
    state.customJobSkills = isScore(state.customJobSkills, 0, 6) ? state.customJobSkills : 2;
    state.customUnlock = isScore(state.customUnlock, 0, 20) ? state.customUnlock : 3;
    state.customAsi = limit(state.customAsi, growthLevels, 20);
    if (!Array.isArray(data.manual) || data.manual.length !== 6 || !data.manual.every(n => isScore(n, 3, 18))) state.manual = [...defaults.manual];
    state.background = known(backgrounds, state.background, 'custom');
    state.subclass = known(subs, state.subclass, '');
    state.armor = known(armors, state.armor, 'none');
    state.weapon = known(weapons, state.weapon, 'rapier');
    state.ranged = known(ranged, state.ranged, 'shortbow');
    state.pack = known(packs, state.pack, 'burglar');
    state.shield = state.shield === true;
    state.attackAbility = isAbility(state.attackAbility) ? state.attackAbility : 1;
    state.attackTraining = state.attackTraining === true;
    state.weaponName = knownText(state.weaponName, 40);
    state.weaponDie = knownText(state.weaponDie, 20);
    for (const key of ['name', 'backgroundName', 'backgroundNote', 'customRaceName', 'gear']) state[key] = knownText(state[key], key === 'gear' || key === 'backgroundNote' ? 200 : 90);
    state.backgroundGold = isScore(state.backgroundGold, 0, 100000) ? state.backgroundGold : null;
    if (!Array.isArray(state.base) || state.base.length !== 6 ||
        !state.base.every(n => Number.isInteger(n) && n >= 8 && n <= 15) || spent(state.base) > 27) state.base = [...defaults.base];
    if (!data.manual) state.manual = [...state.base];
    state.flex = isAbility(state.flex) && state.flex !== 5 ? state.flex : 1;
    state.flex2 = isAbility(state.flex2) && state.flex2 !== 5 && state.flex2 !== state.flex ? state.flex2 : (state.flex === 4 ? 0 : 4);
    state.customBonuses = attrs.map((_, i) => [0,1,2,3].includes(state.customBonuses?.[i]) ? state.customBonuses[i] : 0);
    state.customSpeed = [20,25,30,35,40,45,50,55,60].includes(state.customSpeed) ? state.customSpeed : 30;
    state.customCount = [0,1,2,3,4].includes(state.customCount) ? state.customCount : 0;
    const ancestry = ancestries[state.ancestry];
    const elective = state.ancestry === 'custom' ? state.customCount : ancestry[4];
    state.ancestrySkills = limit(state.ancestrySkills, ancestryPool(state), elective);
    const allowedLanguages = legacyRaceOptions[state.ancestry]?.languagePool ?? langs;
    state.languages = Array.from({length: ancestry[6]}, (_, i) => allowedLanguages.includes(state.languages?.[i]) ? state.languages[i] : '');
    state.backgroundSkills = [0,1].map(i => skillNames.includes(state.backgroundSkills?.[i]) ? state.backgroundSkills[i] : '');
    const occupied = [...ancestry[3], ...state.ancestrySkills, ...state.backgroundSkills];
    const cls = classSpec(state);
    state.jobSkills = limit(state.jobSkills, skillNames, 6);
    const qualified = [...occupied.filter(Boolean), ...state.jobSkills, '盗贼工具'];
    state.expertise = [0,1].map(i => [...skillNames, '盗贼工具'].includes(state.expertise?.[i]) ? state.expertise[i] : '');
    normalizeExtras(state, data);
    if (data.starterExample === undefined && state.job === 'fighter' && !state.name &&
        CharacterLibrary.sameBuild(state, {...createStarterBuild(), starterExample: false})) state.starterExample = true;
    return state;
  }

  function ancestryPool(state) {
    if (state.ancestry === 'changeling') return ['欺瞒','洞悉','威吓','游说'];
    return legacyRaceOptions[state.ancestry]?.pool ?? skillNames;
  }

  function createStarterBuild() {
    const background = '士兵';
    return normalize({
      starterExample: true,
      ancestry: 'human',
      languages: ['精灵语'],
      job: 'fighter',
      jobSkills: ['察觉', '洞悉'],
      background,
      backgroundSkills: backgrounds[background][1],
      backgroundTools: ['骰子套组'],
      base: [15, 13, 14, 10, 12, 8],
      plans: {fighter: {1: {style: '防御'}}},
      equipmentChoices: {armor: 'chain', weapon: 'weapon-shield', sidearm: 'axes', pack: 'explorers-pack'},
      decisions: {'gear:weapon:0': ['longsword']},
      armor: 'chain',
      shield: true,
      equippedWeapon: 'longsword',
      gear: '军衔标志、战场纪念物、骨骰。',
    });
  }

  function createBlankBuild() {
    return normalize({ancestry: 'custom', job: 'custom', background: 'custom', armor: 'none',
      base: Array(6).fill(8), pendingIdentity: ['ancestry','job','background']});
  }

  const initial = () => privateCopy ? normalize({...seed, backgroundSkills: backgrounds[seed.background ?? 'custom'][1]}) : createStarterBuild();
  const libraryKey = 'dnd-2014-character-board/v2/' + (privateCopy ? 'private' : 'player');
  const storage = {getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value)};
  const loaded = CharacterLibrary.load(storage, libraryKey, storageKey, initial, normalize);
  let recoveryArchive = loaded.recovery;
  let library = loaded.library;
  let savedLibrary = structuredClone(library);
  let savedArchive = loaded.raw;
  let pendingSave = null;
  let state = structuredClone(library.characters.find(item => item.id === library.activeId).build);
  let notice = loaded.warning;
  let persistenceError = '';
  let undoBuild = null;
  let undoInProgress = false;
  let treeView = 'all';
  let activeTask = 'home';
  let homeFocus = '';
  const optionComparisons = new Map();
  const subclassComparisons = new Map();
  let subclassComparisonOpen = false;
  let growthExpanded = false;
  let optionRevealTimer;
  let pendingPreviewButton = null;
  let branchKey = '';
  let treeCategory = '';
  let pointNotice = '';
  let scoreErrorIndex = null;
  let pendingScoreRender = false;
  let pointerDown = false;
  let batchText = '';
  let branchOpener = '';
  const branches = new Map();
  const branchFilters = new Map();
  const branchPurposeSelections = new Map();
  const purposeBranchId = key => ['ancestry', 'job', 'background'].includes(key) ? key : state.job + '/' + key;
  const branchSpellRings = new Map();
  let previewedChoice = null;
  const inlinePreview = window.matchMedia('(max-width: 650px)');
  const compactWorkbench = window.matchMedia('(max-width: 1359px), (max-height: 520px)');
  const treeCategoryNames = {ancestry: '种族', job: '职业', background: '背景', treeLevel: '成长', armor: '装备'};
  const taskNames = {
    ancestry: '种族', job: '职业', scores: '属性', background: '背景', armor: '装备',
    spells: '法术', treeLevel: '升级', sheet: '角色卡', tree: '完整选择树', rules: '规则参考', starter: '新手指南', shortcuts: '快捷键',
  };
  const taskDefaultBranches = {ancestry: 'ancestry', job: 'job', background: 'background'};
  const editorTasks = ['ancestry', 'job', 'scores', 'background', 'armor', 'spells', 'treeLevel'];
  const referenceTasks = ['sheet', 'tree', 'rules', 'starter', 'shortcuts'];
  const shortcutPreference = 'dnd-2014-workbench-single-key-shortcuts';
  let singleKeyShortcuts = true;
  try {
    singleKeyShortcuts = localStorage.getItem(shortcutPreference) !== 'off';
  } catch {
    // The preference remains available for the session with storage disabled.
  }
  const historyTaskKey = 'dndWorkbenchTask';
  const historyViewKey = 'dndWorkbenchView';
  const taskViews = new Map();
  const historyViews = new Map();
  let nextViewId = 0;
  let viewId = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const growthDrafts = new Map();
  const draftKey = () => state.job + ':' + state.level;
  const bodyRegions = [
    {part: '臂膀', hint: '推拉与攀爬', point: [132, 151], row: 2, side: -1},
    {part: '指尖', hint: '反应与灵巧', point: [246, 215], row: 2, side: 1},
    {part: '胸口', hint: '耐力与韧性', point: [167, 128], row: 1, side: -1},
    {part: '额头', hint: '知识与推理', point: [185, 42], row: 0, side: 1},
    {part: '眉眼', hint: '观察与直觉', point: [171, 48], row: 0, side: -1},
    {part: '喉间', hint: '表达与影响', point: [183, 80], row: 1, side: 1},
  ];
  const readingNotes = {
    mastermind: {
      3: ['经营身份 · 协助队友', ['获得易容、伪造文书与游戏套组熟练，另学两种语言并可模仿口音。', '可用附赠动作协助队友。协助攻击时，满足条件可在距目标 30 尺内使用。']],
      9: ['评估人物', ['非战斗中观察或交谈至少 1 分钟，可比较两项能力或职业等级相对自己的高低。', 'DM 也可能给你性格或经历线索。']],
      13: ['转移攻击', ['被攻击时，符合掩护条件可用反应把攻击转给 5 尺内提供掩护的生物。']],
      17: ['保护秘密', ['可阻止别人读取你的思想，也可尝试让对方读到假思想。', '能选择让测谎魔法判你诚实，并免于被魔法强迫说真话。']],
    },
    inquisitive: {
      3: ['直接识谎 · 查线索', ['用洞悉判断对方是否撒谎时，d20 的 1–7 视为 8。', '可用附赠动作发现隐藏目标或调查线索。', '战术洞悉可为你创造对特定目标施加偷袭的机会。']],
      9: ['观察与调查', ['当回合移动不超过半速时，察觉和调查检定获得优势。']],
      13: ['察觉超自然伪装', ['用动作察觉 30 尺内的幻术、变形或其他欺骗感官的魔法。知道有异常，但不会直接看到原形。']],
      17: ['对锁定目标增伤', ['对受你战术洞悉影响的目标偷袭时，额外造成 3d6 伤害。']],
    },
  };
  const boardObserver = new ResizeObserver(() => {
    measureWorkbench();
    positionBranchPreview(root.querySelector('#branch-panel'));
    drawChoiceTree();
    syncPanButtons();
  });

  function pinnedHeight(board) {
    return board.querySelector('.workbench-nav')?.getBoundingClientRect().height ?? 0;
  }

  function measureWorkbench() {
    const board = root.querySelector('.workbench-top');
    if (!board) return;
    document.documentElement.style.setProperty('--board-height', pinnedHeight(board) + 'px');
    if (board.querySelector('.workbench-nav[data-menu-open]')) setTaskMenu(compactWorkbench.matches);
  }

  function toolbarBottom(board) {
    return (board.querySelector('.workbench-nav') ?? board.querySelector('.sticky-board')).getBoundingClientRect().bottom;
  }

  compactWorkbench.addEventListener('change', measureWorkbench);

  function classStyleOptions(job) {
    const styles = ['防御', '对决', '巨武器战斗', '守护', '箭术', '双武器战斗'];
    if (job === 'paladin') return styles.slice(0, 4);
    if (job === 'ranger') return ['箭术', '防御', '对决', '双武器战斗'];
    if (job === 'bloodhunter') return ['箭术', '对决', '巨武器战斗', '双武器战斗'];
    return job === 'fighter' ? styles : [];
  }
  const styleLevel = job => job === 'fighter' ? 1 : 2;

  function growthAtLevel(totals, proficiencies, expertise, saveProficiencies, issues, build = state) {
    const {job, level, subclass} = build;
    const track = activeTrack(build);
    const featsTaken = new Map();
    const stages = new Map();
    for (let rank = 1; rank <= level; rank++) {
      const step = planStep(build, rank);
      if (job === 'rogue' && subclass === 'scout' && rank === 3) {
        for (const skill of ['自然', '求生']) {
          proficiencies.add(skill);
          expertise.add(skill);
        }
      }
      const stage = {totals: [...totals], proficiencies: [...proficiencies], expertise: [...expertise],
        applied: false, error: '', extraExpertise: []};
      stages.set(rank, stage);
      if (track.expertise?.includes(rank)) {
        const pool = [...proficiencies, ...(job === 'rogue' ? ['盗贼工具'] : [])];
        stage.extraExpertise = step.expertise.filter(skill => pool.includes(skill) && !expertise.has(skill));
        stage.extraExpertise.forEach(skill => expertise.add(skill));
        if (stage.extraExpertise.length < 2) issues.push(rank + ' 级专精待补齐');
      }
      const startingFeat = rank === 1 && build.ancestry === 'variantHuman' && build.rules.variantHuman;
      if (!activeImprovements(build).includes(rank) && !startingFeat) continue;
      if (step.feat) {
        const feat = featMap[step.feat];
        if (!build.rules.feats) {
          stage.error = 'DM 已关闭专长选项。';
        } else if (step.feat === 'custom' || manualFeats[step.feat]) {
          if (step.stat >= 0 && totals[step.stat] >= 20) stage.error = '所选属性已经达到 20。';
          else if (manualFeats[step.feat] || step.customFeat.trim()) {
            if (step.stat >= 0) totals[step.stat]++;
            stage.applied = true;
          }
        } else if (featPrerequisiteError(feat, build, totals, rank, featsTaken)) {
          stage.error = featPrerequisiteError(feat, build, totals, rank, featsTaken);
        } else if (feat.id === 'phb:elemental-adept' && elementalAdeptError(build, rank)) {
          stage.error = elementalAdeptError(build, rank);
        } else if (featsTaken.has(feat.id) && feat.id !== 'phb:elemental-adept') {
          stage.error = '这个专长已在较早等级选择。';
        } else if (feat.prereq !== undefined && totals[feat.prereq] < 13) {
          stage.error = '这个专长需要' + attrs[feat.prereq] + ' 13。';
        } else if (feat.stats && (!feat.stats.includes(step.stat) || totals[step.stat] >= 20)) {
          stage.error = '请选择一项可提升且低于 20 的属性。';
        } else if (feat.id === 'expert' && (!step.featSkill || proficiencies.has(step.featSkill) ||
          !step.featExpert || expertise.has(step.featExpert) ||
          !(proficiencies.has(step.featExpert) || step.featExpert === step.featSkill))) {
          stage.error = '请选择一项新熟练，并为一项有熟练但无专精的技能选专精。';
        } else {
          if (feat.stats) totals[step.stat]++;
          if (feat.id === 'resilient') saveProficiencies.add(step.stat);
          if (feat.id === 'expert') {
            proficiencies.add(step.featSkill);
            expertise.add(step.featExpert);
          }
          applyFeatChoices(feat, build, proficiencies, expertise, saveProficiencies, step.stat);
          featsTaken.set(feat.id, rank);
          stage.applied = true;
        }
      } else if (!startingFeat && step.asi.reduce((total, value) => total + value, 0) === 2) {
        if (step.asi.some((value, i) => value && totals[i] + value > 20)) {
          stage.error = '属性值提升后的上限是 20，请重新分配。';
        } else {
          step.asi.forEach((value, i) => { totals[i] += value; });
          stage.applied = true;
        }
      }
      if (!stage.applied) issues.push(rank + ' 级属性提升或专长待完成');
    }
    return {stages, featsTaken};
  }

  function calculate(build = state) {
    const ancestry = ancestries[build.ancestry];
    const cls = classSpec(build);
    const {job, level} = build;
    const subclass = level >= activeTrack(build).sub[0] ? chosenSubclass(build).trim() : '';
    const rogueSub = job === 'rogue' && subclass === subs[build.subclass]?.name ? build.subclass : '';
    const issues = [];
    const bonuses = build.ancestry === 'custom' ? [...build.customBonuses] : [...ancestry[1]];
    if (['halfElf','changeling'].includes(build.ancestry)) bonuses[build.flex]++;
    if (build.ancestry === 'halfElf') bonuses[build.flex2]++;
    boostValues(build.ancestry, build.boostPattern).forEach((value, i) => { bonuses[build.boostTargets[i]] += value; });
    const totals = baseScores(build).map((n, i) => n + bonuses[i]);
    const validJobSkills = build.jobSkills.filter(skill => cls[4].includes(skill)).slice(0, cls[3]);
    const provided = [...ancestry[3], ...build.ancestrySkills, ...build.backgroundSkills, ...validJobSkills].filter(Boolean);
    const proficiencies = new Set(provided);
    const expertise = new Set(job === 'rogue' ? build.expertise.filter(skill => proficiencies.has(skill) || skill === '盗贼工具') : []);
    const saveProficiencies = new Set(cls[2]);
    const languages = [...ancestry[5], ...build.languages.filter(Boolean), ...build.backgroundLanguages.filter(Boolean)];
    if (job === 'rogue' && level >= 15) saveProficiencies.add(4);
    if (job === 'monk' && level >= 14) attrs.forEach((_, i) => saveProficiencies.add(i));
    applyCoreProficiencies(build, totals, proficiencies, expertise, issues, saveProficiencies);
    const {stages, featsTaken} = growthAtLevel(totals, proficiencies, expertise, saveProficiencies, issues, build);
    if (job === 'barbarian' && level === 20) [0, 2].forEach(i => { totals[i] = Math.min(24, totals[i] + 4); });
    const phantomSkill = planStep(build, 3).phantomSkill;
    if (rogueSub === 'phantom' && phantomSkill) proficiencies.add(phantomSkill);
    const mods = totals.map(mod);
    const pb = proficiencyAt(level);
    const skillBonus = skill => mods[skills[skill]] + (expertise.has(skill) ? 2 * pb : proficiencies.has(skill) ? pb :
      job === 'bard' && level >= 2 ? Math.floor(pb / 2) : 0);
    const style = level >= styleLevel(job) ? planStep(build, styleLevel(job)).style : '';
    const equipmentTraining = coreProficiencies(build, featsTaken);
    const inventory = equipmentInventory(build, equipmentTraining);
    const equipment = equippedFromInventory(build, inventory);
    build = {...build, ...equipment};
    if (equipment.unlisted.length) issues.push('背包缺少已记录的装备，未计入数值 · ' + equipment.unlisted.join('、'));
    if (equipment.handConflict) issues.push('旧穿戴记录有手部冲突，请重新选择主手或副手装备');
    const armor = armors[build.armor];
    let ac = armor[1] + (armor[2] === null ? 0 : Math.min(mods[1], armor[2])) + (build.shield ? 2 : 0);
    if (build.armor === 'none' && job === 'barbarian') ac += mods[2];
    if (build.armor === 'none' && job === 'monk' && !build.shield) ac += mods[4];
    const raceTraits = legacyRaceOptions[build.ancestry];
    if (build.armor === 'none' && raceTraits?.naturalArmor) {
      const [base, ability] = raceTraits.naturalArmor;
      ac = Math.max(ac, base + (ability === null ? 0 : mods[ability]) + (build.shield ? 2 : 0));
    }
    ac += raceTraits?.armorBonus ?? 0;
    if (build.armor !== 'none' && classStyleOptions(job).includes(style) && style === '防御') ac++;
    const saveBonus = i => mods[i] + (saveProficiencies.has(i) ? pb : 0) +
      (job === 'paladin' && level >= 6 ? Math.max(1, mods[5]) : 0);
    const initiative = mods[1] + (featsTaken.has('alert') ? 5 : 0) + (rogueSub === 'swashbuckler' ? mods[5] : 0) +
      (job === 'bard' && level >= 2 ? Math.floor(pb / 2) : 0);
    const defaultDie = Math.floor(cls[1] / 2) + 1;
    const hp = Math.max(1, cls[1] + mods[2]) + growthLevels.slice(1, level).reduce((sum, rank) =>
      sum + Math.max(1, (planStep(build, rank).hpDie ?? defaultDie) + mods[2]), 0) +
      level * ((build.ancestry === 'hillDwarf' ? 1 : 0) + (featsTaken.has('tough') ? 2 : 0));
    let speed = (build.ancestry === 'custom' ? build.customSpeed : ancestry[2]) + (featsTaken.has('mobile') ? 10 : 0) +
      (rogueSub === 'scout' && level >= 9 ? 10 : 0) + (job === 'barbarian' && level >= 5 && armor[2] !== null ? 10 : 0) +
      (job === 'monk' && level >= 2 && build.armor === 'none' && !build.shield ? 10 + Math.floor((level - 2) / 4) * 5 : 0);
    const elective = build.ancestry === 'custom' ? build.customCount : ancestry[4];
    if (build.ancestrySkills.length < elective) issues.push('种族技能未选满');
    if (build.languages.some(x => !x)) issues.push('待选种族语言');
    if (new Set(languages).size !== languages.length) issues.push('语言重复');
    if (build.backgroundSkills.some(x => !x)) issues.push('待选背景技能');
    if (new Set(provided).size !== provided.length) issues.push('熟练来源重复，请调整背景或其他技能');
    if (validJobSkills.length < cls[3]) issues.push('职业技能未选满');
    if (build.job === 'rogue' && expertise.size < 2) issues.push('待选两项不同的专精');
    if (level >= activeTrack(build).sub[0] && !subclass) issues.push('待选' + activeTrack(build).title);
    const core = calculateCore(build, {totals, mods, hp, ac, speed, pb, proficiencies, expertise, featsTaken, issues, subclass}, equipment, inventory, equipmentTraining);
    languages.push(...core.languages.filter(language => !languages.includes(language)));
    ac = core.ac;
    speed = core.speed;
    return {bonuses, totals, mods, hp: core.hp, ac, speed, pb, saveBonus, initiative, subclass, rogueSub, core,
      sneak: job === 'rogue' ? Math.ceil(level / 2) : 0, passiveBonus: featsTaken.has('observant') ? 5 : 0,
      proficiencies, expertise, saveProficiencies, skillBonus, issues, languages, stages, featsTaken, defaultDie};
  }

  const details = (key, title, content, opened) =>
    `<details data-detail="${key}"${opened.has(key) ? ' open' : ''}><summary>${title}</summary><div class="small-stack tight">${content}</div></details>`;
  function branchButton(key, label, current, openKey = key) {
    return `<button type="button" class="branch-entry" data-open-branch="${openKey}" data-focus="open-${key}"
      aria-expanded="${branchKey === openKey}" aria-controls="branch-panel">
      <span><small>${esc(label)}</small><strong>${esc(current)}</strong></span><span aria-hidden="true">↳</span>
    </button>`;
  }

  function branchField(key, label, items, value, openKey) {
    const options = items.map(item => {
      const [id, title, caption = '', listLabel] = Array.isArray(item) ? item : [item, item];
      return {id, title, caption, listLabel, selected: id === value};
    });
    branches.set(key, {label, options});
    return branchButton(key, label, options.find(option => option.selected)?.title ?? '请选择', openKey);
  }

  function skillBranch(key, label, pool, selected, count, excluded, display = String) {
    const options = pool.map(skill => {
      const checked = selected.includes(skill);
      const reserved = excluded.includes(skill) && !checked;
      return {id: skill, title: display(skill), selected: checked, caption: reserved ? '已有熟练' : '',
        disabled: !checked && (selected.length >= count || reserved)};
    });
    const title = label + ' · ' + selected.length + '/' + count;
    branches.set(key, {label: title, options, multiple: true});
    return branchButton(key, title, selected.map(display).join('、') || '请选择');
  }
  const lane = (number, label, body) => `<article class="panel build-lane" data-lane="${number}">
    <header class="lane-title"><span>${number}</span><h3 tabindex="-1">${label}</h3></header><div class="lane-body">${body}</div></article>`;

  function renderAncestry(calc, open) {
    const race = ancestries[state.ancestry];
    const traits = legacyRaceOptions[state.ancestry];
    const boost = boostValues(state.ancestry, state.boostPattern);
    const boostFields = (traits?.boost === 'flex' ? branchField('boostPattern', '属性加值组合',
      [['two-one', '一项 +2、另一项 +1'], ['three-ones', '三项各 +1']], state.boostPattern) : '') +
      boost.map((value, i) => branchField('boostTargets.' + i, '第 ' + (i + 1) + ' 项种族加值 +' + value,
        boostPool(state.ancestry).filter(([id]) => !state.boostTargets.slice(0, boost.length).some((other, j) => j !== i && other === id)), state.boostTargets[i])).join('');
    const count = state.ancestry === 'custom' ? state.customCount : race[4];
    const flex = ['changeling','halfElf'].includes(state.ancestry)
      ? branchField('flex', '额外属性 +1', abilityOptions.filter(([id]) => id !== 5 && (state.ancestry !== 'halfElf' || id !== state.flex2)), state.flex)
      : '';
    const flex2 = state.ancestry === 'halfElf'
      ? branchField('flex2', '第二项属性 +1', abilityOptions.filter(([id]) => id !== 5 && id !== state.flex), state.flex2) : '';
    const custom = state.ancestry === 'custom' ? details('race-custom', '手填加值与步速',
      input('customRaceName', '种族 / 亚种名称', state.customRaceName, 'maxlength="90" placeholder="按规则书填写"') +
      attrs.map((name, i) => branchField('customBonuses.' + i, name + '加值', [0,1,2,3], state.customBonuses[i])).join('') +
      branchField('customSpeed', '步行速度（尺）', [20,25,30,35,40,45,50,55,60], state.customSpeed) +
      branchField('customCount', '种族技能数量', [0,1,2,3,4], count), open) : '';
    const raceSkills = count ? skillBranch('ancestrySkills', '种族技能', ancestryPool(state), state.ancestrySkills, count, []) : '';
    const languageChoices = state.languages.map((current, index) => branchField('languages.' + index,
      '额外语言 ' + (index + 1), [['', '请选择'], ...(traits?.languagePool ?? langs).filter(lang => !race[5].includes(lang) &&
        !state.languages.some((other, i) => i !== index && other === lang))], current)).join('');
    const note = state.ancestry === 'changeling' ? details('shape', '艾伯伦种族特性',
      `<p class="hint">可用动作改变外貌和声音，保留体型类别与基本肢体结构。衣物、装备和数值保持原样。</p>${linkTo(changelingSource, '艾伯伦勘误 ↗')}`, open) : '';
    const raceOptions = Object.entries(ancestries).map(([id, [title, , speed]]) =>
      [id, title, id === 'custom' ? '自行录入' : ancestryBook(id)[0] + ' · ' + speed + ' 尺']);
    if (state.pendingIdentity.includes('ancestry')) return lane('01', '种族与加值', branchField('ancestry', '选种族', raceOptions, ''));
    return lane('01', '种族与加值', branchField('ancestry', '种族', raceOptions, state.ancestry) +
      badgeList(calc.bonuses.flatMap((bonus, i) => bonus ? [attrs[i] + sign(bonus)] : [])) + flex + flex2 + boostFields + custom +
      (ancestrySource(state.ancestry) ? `<p class="hint">${linkTo(ancestrySource(state.ancestry), '查看种族原文 ↗')}</p>` : '') +
      badgeList([...race[3], ...state.ancestrySkills]) + raceSkills +
      details('languages', '语言 · ' + esc(calc.languages.join('、') || '手动记录'), languageChoices ||
        '<p class="hint">本选项没有额外的种族语言选择。</p>', open) + note +
      details('race-notes', '种族补记', (traits?.note ? `<p class="hint">${esc(traits.note)}</p>` : '') +
        input('raceNote', '工具、法术、其他移动方式或变体特性', state.raceNote, 'maxlength="200"'), open));
  }

  function renderClass() {
    const cls = classSpec(state);
    const track = activeTrack(state);
    const rogue = state.job === 'rogue';
    const disabled = [...ancestries[state.ancestry][3], ...state.ancestrySkills, ...state.backgroundSkills];
    const jobs = Object.entries(classList).map(([id, [title, die]]) => [id, title,
      id === 'custom' ? '手填生命骰、豁免与成长' : '生命骰 d' + die + (id === 'bloodhunter' ? ' · 第三方' : '')]);
    if (state.pendingIdentity.includes('job')) return lane('02', '职业与子职', branchField('job', '选职业', jobs, ''));
    const jobField = branchField('job', '换职业', jobs, state.job);
    const subclasses = rogue ? [] : subclassNames(state.job);
    const subclassField = rogue ? branchField('subclass', '选子职 · 3 级解锁',
      subclassData.map(sub => [sub.id, sub.name, sub.tag + ' · ' + sub.book]), state.subclass) : subclasses.length ?
      branchField('careerSubclass', '选子职 · ' + track.sub[0] + ' 级解锁', subclasses, chosenSubclass(state)) : track.sub.length ?
      `<button type="button" class="branch-entry" data-level-jump="${track.sub[0]}"><span><small>${track.title} · ${track.sub[0]} 级</small>
        <strong>${esc(chosenSubclass(state) || '前往选择')}</strong></span><span aria-hidden="true">↳</span></button>` : '';
    const custom = state.job === 'custom' ?
      input('customClassName', '职业名称', state.customClassName, 'maxlength="90"') +
      branchField('customHitDie', '生命骰', [6,8,10,12].map(n => [n, 'd' + n]), state.customHitDie) +
      branchField('customJobSkills', '职业技能数量', [0,1,2,3,4,5,6], state.customJobSkills) +
      skillBranch('customJobSaves', '豁免熟练', [0,1,2,3,4,5], state.customJobSaves, 6, [], i => attrs[i]) +
      branchField('customUnlock', '子职解锁等级', [[0, '无子职'], ...growthLevels.map(n => [n, n + ' 级'])], state.customUnlock) +
      skillBranch('customAsi', '属性提升等级', growthLevels, state.customAsi, 20, [], n => n + ' 级') : '';
    return lane('02', '职业与子职', jobField +
      badgeList(['生命骰 d' + cls[1], '豁免 ' + cls[2].map(i => attrs[i]).join('、')]) +
      custom + subclassField +
      skillBranch('jobSkills', '选职业技能', cls[4], state.jobSkills, cls[3], disabled));
  }

  function renderBackground(calc, open) {
    const bg = backgrounds[state.background];
    const gold = state.backgroundGold ?? bg[2];
    const skillFields = [0,1].map(i => branchField('backgroundSkills.' + i, '背景技能 ' + (i + 1),
      [['','请选择'], ...skillNames.filter(skill => skill !== state.backgroundSkills[1 - i])], state.backgroundSkills[i])).join('');
    const expertFields = state.job === 'rogue' ? [0,1].map(i => branchField('expertise.' + i, '专精 ' + (i + 1),
      [['','请选择'], ...[...calc.proficiencies, '盗贼工具'].filter(skill => skill !== state.expertise[1 - i])], state.expertise[i])).join('') : '';
    const backgroundOptions = Object.entries(backgrounds).map(([id, [, skills, gold, , , path]]) =>
      [id, backgroundTitle(id), [sourceLabel(path), skills.filter(Boolean).join('、'), gold === null ? '' : gold + ' gp'].filter(Boolean).join(' · ')]);
    if (state.pendingIdentity.includes('background')) return lane('03', '背景', branchField('background', '选背景', backgroundOptions, ''));
    return lane('03', '背景与专精', branchField('background', '背景', backgroundOptions, state.background) + skillFields + renderBackgroundExtras() +
      badgeList([bg[3], gold === null ? '' : gold + ' gp'].filter(Boolean)) +
      expertFields +
      (bg[5] ? `<p class="hint">${linkTo(backgroundRuleSource(state.background), '背景来源 ↗')}</p>` : '') +
      details('background-notes', '工具、语言、金币与特性',
        `<p class="hint">${esc(bg[4])}</p>` + (state.background === 'custom' ? input('backgroundName', '背景名称', state.backgroundName, 'maxlength="90"') : '') +
        input('backgroundGold', '背景起始金币（gp）', state.backgroundGold ?? '', `type="number" min="0" max="100000" placeholder="${bg[2] ?? '按原文填写'}"`) +
        input('backgroundNote', '背景补记', state.backgroundNote, 'maxlength="200" placeholder="工具、语言、装备、背景专长等"'), open));
  }

  function renderComparisonCell(option, features, level, opened) {
    if (!features.length) return '<td class="hint">本级无单列能力</td>';
    const note = state.job === 'rogue' ? readingNotes[option.id]?.[level] : undefined;
    if (note) {
      const [label, points] = note;
      const [[, title, body]] = features;
      return `<td><span class="compare-tag">${esc(label)}</span><h4>${esc(title)}</h4>
        <ul class="compare-points">${points.map(point => `<li>${esc(point)}</li>`).join('')}</ul>
        ${details('compare-' + option.id + '-' + level, '规则细节', `<p class="hint">${esc(body)}</p>`, opened)}</td>`;
    }
    return `<td>${features.map(([, title, body]) => `<h4>${esc(title)}</h4>${body ? `<p>${esc(body)}</p>` : ''}`).join('')}</td>`;
  }

  function renderSubclassComparison(branch, calc, opened) {
    const pair = subclassComparisons.get(state.job) ?? ['', ''];
    const compared = pair.map(id => branch.options.find(option => String(option.id) === id));
    const count = compared.filter(Boolean).length;
    const unlock = activeTrack(state).sub[0];
    const slots = compared.map((option, index) => {
      const letter = index ? 'B' : 'A';
      const planned = option?.title === chosenSubclass(state);
      return `<div class="comparison-slot">
        <label><span><b class="comparison-letter">${letter}</b> ${index ? '右栏子职' : '左栏子职'}</span>
          <select data-compare-slot="${index}" data-focus="compare-slot-${index}">
            <option value="">选择子职</option>${branch.options.map(item => `<option value="${esc(item.id)}"${item === option ? ' selected' : ''}${item === compared[1 - index] ? ' disabled' : ''}>${esc(item.title)}</option>`).join('')}
          </select>
        </label>
        ${option ? `<p class="hint">${esc(branchOptionSource(branchKey, option))}</p>
          <div class="comparison-actions"><button type="button" data-open-rule="${esc(option.id)}" aria-label="${esc(option.title)}的完整规则" aria-haspopup="dialog">完整规则</button>
          <button type="button" class="comparison-plan" data-apply-choice="${esc(option.id)}" aria-label="${planned ? '当前规划' : '采用'}${esc(option.title)}"${planned ? ' disabled' : ''}>${planned ? '当前规划' : `设为 ${unlock} 级规划`}</button></div>` : ''}
      </div>`;
    }).join('');
    let result = '';
    if (count === 2) {
      const features = compared.map(option => subclassReferenceRows(state.job, option.id) ??
        (optionDetail(branchKey, option, calc).features ?? []).map(([level, [title, body]]) => [Number(level), title, body]));
      const levels = [...new Set(features.flatMap(rows => rows.map(([level]) => Number(level))))].sort((a, b) => a - b);
      const liePair = state.job === 'rogue' && pair.includes('mastermind') && pair.includes('inquisitive');
      result = `${liePair ? `<aside class="compare-verdict"><p><strong>识谎用调查员，支援与伪装用策士。</strong> 调查员 3 级识谎时，洞悉检定的 d20 掷出 7 或更低视为 8。按当前洞悉 ${sign(calc.skillBonus('洞悉'))} 计算，最低为 ${8 + calc.skillBonus('洞悉')}。11 级起，适用可靠才能时，最低骰值为 10。</p></aside>` : ''}
        ${levels.length ? `<table class="subclass-comparison" aria-label="子职能力按等级对照">
          <thead><tr>${compared.map((option, index) => `<th scope="col"><span class="comparison-letter">${index ? 'B' : 'A'}</span> ${esc(option.title)}</th>`).join('')}</tr></thead>
          ${levels.map(level => `<tbody data-comparison-level="${level}"><tr class="comparison-level"><th scope="rowgroup" colspan="2">${level} 级 <small>${state.level >= level ? '已到此等级' : '未来能力'}</small></th></tr>
            <tr>${compared.map((option, index) => renderComparisonCell(option, features[index].filter(row => Number(row[0]) === level), level, opened)).join('')}</tr></tbody>`).join('')}
        </table>` : '<p class="hint">这两个子职暂无按等级整理的能力。可打开完整规则查看已收录的内容。</p>'}`;
    }
    return `<div class="subclass-abilities" data-transition-panel="subclass-comparison" data-transition-key="${esc(state.job)}">
      <div class="comparison-slots">${slots}</div>
      <div class="comparison-toolbar"><p role="status" class="hint">${count < 2 ? `已选 ${count}/2 · ${count ? '再选另一栏' : '选择两个不同的子职'}` : `已选 2/2 · ${unlock} 级解锁子职`}</p>
        ${count ? '<button type="button" data-action="clear-subclass-comparison">清空对照</button>' : state.job === 'rogue' ? '<button type="button" data-action="example-subclass-comparison">试比策士与调查员</button>' : ''}</div>
      ${result}
    </div>`;
  }

  const classUse = {
    artificer: '给装备注入魔法，用工具和法术支援队友。',
    barbarian: '在前排吸收伤害。狂暴时能抵抗常见物理伤害，用力量近战也更有威力。',
    bard: '用魅力施法，并把激励骰交给队友，帮他们通过关键检定。',
    bloodhunter: '靠降咒限制敌人，之后可用猩红仪式强化武器。属于第三方职业。',
    cleric: '用感知施法，治疗、保护队友或对付亡灵。1 级选的领域会决定你的专长方向。',
    druid: '用感知施放自然法术。2 级可变成见过的野兽，用于侦察、探索或战斗。',
    fighter: '以武器和护甲为核心。1 级选战斗风格，还能用附赠动作给自己回血。',
    monk: '依靠敏捷、徒手打击和机动性作战。2 级起可消耗气做出额外动作。',
    paladin: '在前排作战，用圣疗恢复生命。2 级起可以消耗法术位强化近战命中。',
    ranger: '擅长追踪和野外探索。2 级开始搭配战斗风格与感知法术。',
    rogue: '技能选择多，能用专精强化关键检定。战斗中找准时机，用偷袭打出额外伤害。',
    sorcerer: '用魅力施法。3 级起可用超魔法改变某些法术的施放方式。',
    warlock: '借宗主之力用魅力施法。契约法术位较少，短休也能恢复。',
    wizard: '用智力施法，从法术书准备当日所需的法术，擅长提前备好不同的解法。',
  };
  const backgroundUse = {
    charlatan: '你已经建立了一个假身份，有配套的文书和人脉，也能仿造自己见过样本的文书。',
    criminal: '有一个可信的犯罪圈接头人，可以通过这条渠道传递消息。',
    guild: '在有公会据点的地方，可向同业寻求食宿、法律或人脉方面的支持。',
    acolyte: '可以向同信仰的神殿寻求照料，在符合条件的神殿取得简单食宿。',
    sage: '当你不知道答案时，往往知道该去哪座图书馆、找哪份记录或问谁。',
    '调查员': '从洞悉、调查、察觉中选两项熟练，适合盘问证词和搜索现场。',
    '公会商人': '可借助公会的人脉和支持。工具与语言选择偏向贸易和出行。',
    '城市猎人': '选两项适合城市追踪的技能，并从赌具、乐器、盗贼工具中选两项熟练。',
    '派系特工': '在有组织活动的地方，可借助秘密联系人获得帮助或找到安全落脚处。',
    '朝臣': '熟悉官僚体系和宫廷礼仪，知道该找谁打听消息、处理手续或托人办事。',
    '城市守卫': '你熟悉守卫、执法人员与犯罪圈的活动方式，知道去哪里寻找这些人。',
    '与世隔绝的学者': '能借助学术机构的图书馆与同行寻找知识。',
    '艺人': '可以用演出换取简单的食宿，也可能在演出过的地方被人认出。',
    '平民英雄': '可以向普通民众寻求庇护或休息，只要你没有表现出对他们的威胁。',
    '隐士': '隐居期间发现过重要的秘密，和 DM 一起确定它是什么。',
    '化外之民': '擅长记住地形、寻找方向，并在有资源的地方为队伍觅食取水。',
    '流浪儿': '在城镇非战斗移动时，可带同行者走只有你熟悉的近路。',
    '士兵': '旧部可能承认你的军衔，让你获得礼遇或接触军用据点。',
    '贵族': '凭身份更容易进入上流社交场合，也能请求当地贵族接见。',
    '水手': '可以请旧船员或同行帮你和同伴搭船，行程由对方安排。',
  };
  const ancestryUse = {
    human: '六项属性都提高 1，适合同时依赖多项属性的角色。',
    highElf: '额外掌握一个法师戏法，用智力施放。',
    woodElf: '步速较快，在轻度遮蔽的自然现象中也可尝试躲藏。',
    drow: '拥有更远的黑暗视觉和天生魔法，在直射阳光下部分攻击和察觉检定有劣势。',
    hillDwarf: '每级最大生命值额外增加 1 点。',
    mountainDwarf: '兼有力量和体质加值，并获得轻甲和中甲熟练。',
    lightfoot: '能借至少比自己大一类的生物遮挡，尝试躲藏。',
    stout: '对抗中毒的豁免有优势，并抗毒素伤害。',
    forestGnome: '会次级幻影，也能用声音和手势向小型或更小的野兽表达简单想法。',
    rockGnome: '擅长辨识部分造物的来历，可用工匠工具做小型发条装置。',
    halfElf: '魅力之外可自选两项不同属性加 1，还能自选两项技能熟练。',
    halfOrc: '每长休一次，在未被直接杀死而降到 0 HP 时可留在 1 HP；近战武器重击多掷一个武器伤害骰。',
    dragonborn: '龙族血统决定吐息的伤害类型和对应的伤害抗性。',
    tiefling: '拥有火焰抗性，以及随等级解锁的天生魔法。',
    changeling: '可用动作改变外貌与声音，保留体型类别和基本肢体结构。衣物、装备和数值不随之改变。',
  };
  const skillUse = {
    '运动': '攀爬、游泳、跳跃或擒抱。', '特技': '保持平衡、做翻滚或挣脱擒抱。',
    '巧手': '藏起小物、偷取物品或做手上把戏。', '隐匿': '藏身、跟踪或避开守卫。',
    '奥秘': '回忆法术、魔法物品和奥术传说。', '历史': '回忆旧事、名人和古国。',
    '调查': '根据痕迹或物证推断发生过什么。', '自然': '辨识动植物、地形和自然现象。',
    '宗教': '辨认神祇、仪式和宗教传统。', '驯兽': '安抚动物或控制坐骑。',
    '洞悉': '从说话方式、表情或举止推断意图，例如判断一番解释是否可疑。',
    '医药': '稳定濒死的同伴或辨识病症。', '察觉': '发现或听见附近的人、物和动静。',
    '求生': '追踪、找路，或识别野外的危险。', '欺瞒': '用谎话、含糊措辞或举止掩盖真相。',
    '威吓': '通过威胁或施压影响对方。', '表演': '用音乐、戏剧或其他演出取悦观众。',
    '游说': '用理由、礼节或诚意说服对方。',
  };
  const fightingStyleUse = {
    '防御': '穿着护甲时，AC +1。',
    '对决': '只在一只手持有近战武器、且没有持其他武器时，该武器伤害 +2。',
    '巨武器战斗': '用双手握持双手或两用近战武器攻击时，武器伤害骰掷出 1 或 2 可以重掷一次，采用新结果。',
    '守护': '持盾时，可用反应让你看得见的敌人对你身边另一个目标的一次攻击有劣势。目标须在你 5 尺内。',
    '箭术': '用远程武器做攻击检定时 +2。',
    '双武器战斗': '双武器战斗的附赠动作攻击命中时，可以把属性调整值计入伤害。',
  };
  const packUse = {
    burglar: '偏潜入和开锁前后的准备，例如铁蒺藜、撬棍、细绳和有罩提灯。',
    dungeon: '偏地下探索和破障，例如撬棍、锤子、岩钉、火把和绳索。',
    explorer: '偏徒步旅行和野外扎营，例如睡袋、餐具、火把、干粮和绳索。',
  };

  function optionDetail(key, option, calc) {
    const {id, caption} = option;
    const spell = ruleSpell(key, id);
    if (spell) return {
      note: caption || spell.summary, source: spell.sourceBook ?? '2014 玩家手册', facts: [['环级与学派', (spell.level ? spell.level + ' 环' : '戏法') + ' · ' + spell.school],
        ['施法时间', spell.time], ['距离', spell.range], ['持续时间', spell.duration], ['成分', spell.components],
        ['专注', spell.concentration ? '需要专注' : '无需专注'], ['材料', spell.material], ['仪式', spell.ritual ? '可作为仪式（须有对应能力）' : '普通施放']]};
    if (key.startsWith('decision.gear:')) {
      const item = coreRules.items[id];
      if (item) return {note: item.note, facts: [...equipmentStats(item), ...equipmentPriceWeight(item)]};
    }
    if (key.startsWith('decision.')) {
      const choice = coreRules.choices.find(choice => choice.id === key.slice(9));
      const record = choice?.options.find(option => option.id === id);
      return {note: record?.desc || caption || '将此项目加入本项选择。', facts: choice ? [['获得等级', choice.level + ' 级'], ['需选数量', choice.count]] : []};
    }
    if (key.startsWith('equipmentChoices.')) {
      const group = coreRules.classes[state.job]?.equipment.find(group => group.id === key.split('.')[1]);
      const equipment = group?.options.find(option => option.id === id);
      return {note: equipment?.note || '获得这一组职业起始装备。', facts: [['物品', (equipment?.items ?? []).map(item => (coreRules.items[item.id]?.name || item.id) + ' × ' + item.quantity).join('、')]]};
    }
    switch (key) {
      case 'ancestry': {
        if (id === 'custom') return {note: '自己录入种族名称、属性加值、步速和技能数量。'};
        const [, bonuses, speed, fixed, picks, languages, extra] = ancestries[id];
        const traits = legacyRaceOptions[id];
        const flexible = traits?.boost === 'flex' ? '一项 +2 与另一项 +1，或三项各 +1' :
          boostValues(id, state.boostPattern).map(n => '自选 +' + n).join('、');
        const bonus = bonuses.flatMap((value, i) => value ? [attrs[i] + sign(value)] : []);
        if (id === 'changeling' || id === 'halfElf') bonus.push(id === 'changeling' ? '另一项 +1' : '另两项各 +1');
        if (flexible) bonus.push(flexible);
        return {facts: [['属性加值', bonus.join('，')], ['步速', speed + ' 尺'],
          ['技能熟练', [...fixed, ...(picks ? [`另选 ${picks} 项`] : [])].join('、')],
          ['语言', [...languages, ...(extra ? [`另选 ${extra} 门`] : [])].join('、')]],
          note: ancestryUse[id] ?? traits?.note, source: ancestryBook(id)[0], features: (coreRules.races[id]?.features ?? []).map(feature => [feature.level ?? 1, [feature.name, feature.desc]])};
      }
      case 'job': {
        if (id === 'custom') return {note: '自己填写生命骰、豁免、技能数量，以及能选子职和提升属性的等级。'};
        const [, die, saves, count] = classList[id];
        const track = classGrowth[id];
        return {note: classUse[id], facts: [['1 级能力', id === 'rogue' ? '专精、偷袭、盗贼黑话' : track.features[1]],
          ['生命骰', 'd' + die], ['豁免熟练', saves.map(i => attrs[i]).join('、')],
          ['职业技能', `从职业列表选 ${count} 项`], ['子职解锁', `${track.sub[0]} 级 · ${track.title}`]],
          source: id === 'artificer' ? '塔莎的万事坩埚' : id === 'bloodhunter' ? '第三方 · 血猎手' : '2014 玩家手册',
          features: (coreRules.classFeatures[id]?.[1] ?? []).map(feature => [1, [feature.name, feature.desc]])};
      }
      case 'background': {
        const [, proficiencies, gold, tools, feature, path] = backgrounds[id];
        return {note: coreRules.backgrounds[id]?.feature ?? backgroundUse[id] ?? expansionBackgroundRules[id]?.[0][1] ?? (id === 'custom' ? '按 DM 同意的背景配置记录技能、工具、语言、特性和起始金币。' : ''),
          facts: [['技能熟练', proficiencies.filter(Boolean).join('、')], ['背景起始金币', gold === null ? '未录入' : gold + ' gp'],
            ['工具或语言', tools], ['背景特性 / 选项', feature]], source: path && sourceLabel(path)};
      }
      case 'subclass':
      case 'careerSubclass':
      case 'plan.subclassName': {
        const rogue = state.job === 'rogue' && (subs[id] ?? subclassData.find(sub => sub.name === id));
        if (rogue) return {note: rogue.fit, source: rogue.book, features: Object.entries(rogue.features)};
        const core = coreRules.subclassFeatures[state.job]?.[id];
        if (core) return {source: '2014 玩家手册', features: Object.entries(core).flatMap(([level, entries]) =>
          entries.map(feature => [level, [feature.name, feature.desc]]))};
        const record = subclassRecord(state.job, id);
        if (!record) break;
        const expanded = subclassReferenceRows(state.job, id);
        if (expanded) {
          const titles = new Map();
          for (const [level, title] of expanded) {
            if (!titles.has(level)) titles.set(level, []);
            titles.get(level).push(title);
          }
          return {source: record.book, features: [...titles].sort(([a], [b]) => a - b).map(([level, names]) => [level, [names.join('、')]])};
        }
        const features = Object.entries(record.features ?? {}).map(([level, title]) => [level, [title]]);
        return {source: record.book, features, note: features.length ? '' : '本地目录仅收录了这个子职的名称，可在成长计划中补记能力。'};
      }
      case 'treeLevel': {
        const track = activeTrack(state);
        const subclass = id >= track.sub[0] ? chosenSubclass(state) : '';
        const features = levelFeatures(id, subclass).map(([title]) => title);
        return {facts: [['熟练加值', sign(proficiencyAt(id))], ['本级新增', features.join('、')],
          ['本级选择', levelNotes(id, subclass).join(' ')]],
          note: id === track.sub[0] ? '到了这个等级，就可以确定你的子职。' : levelHasChoices(id) ? '选中可打开本级成长设置。' : '这个等级以职业固定成长为主。'};
      }
      case 'armor': {
        const [, base, cap] = armors[id];
        const value = base + (cap === null ? 0 : Math.min(calc.mods[1], cap));
        return {facts: [['计算方式', base + (cap === null ? '（固定）' : ' + 敏捷调整值' + (cap === 2 ? '（最多 +2）' : ''))],
          ['按当前敏捷', `基础 AC ${value}`]], note: 'AC 越高，攻击越难命中你。盾牌、无甲防御、种族和其他加值另计。'};
      }
      case 'plan.feat': {
        const feat = featMap[id];
        if (feat) return {note: feat.desc};
        if (manualFeats[id]) return {source: sourceLabel(manualFeats[id].path), note: '打开详情可离线查看前提、效果和次数；按本级手填栏记录适用加值。'};
        return {note: id ? '在本级手填专长名称与效果。' : '保留本级的属性提升，可选一项 +2 或两项各 +1。'};
      }
      case 'equippedWeapon':
      case 'equippedOffhand': {
        const item = coreRules.items[id];
        const note = key === 'equippedWeapon' ? '主手攻击会计入适用的属性和熟练加值。' : '副手攻击取决于双武器战斗规则和角色能力。';
        return item ? {note: item.note || note, facts: [...equipmentStats(item), ...equipmentPriceWeight(item)]} :
          {note: key === 'equippedWeapon' ? '使用徒手打击。' : '清空副手武器。'};
      }
      case 'plan.style': return {note: fightingStyleUse[id]};
      case 'plan.game': return {note: `取得${id}套组熟练。DM 要求做与这套游戏有关的属性检定时，可加入熟练加值。`};
      case 'weapon': return {note: '灵巧近战武器，可用力量或敏捷计算攻击和伤害。', facts: [['基础伤害', caption]]};
      case 'ranged': return id === 'shortbow' ? {note: '获得短弓和 20 支箭，适合保持距离。超过常规射程攻击有劣势。',
        facts: [['基础伤害', '1d6 穿刺'], ['常规 / 最远射程', '80 / 320 尺']]} :
        {note: '多带一把轻型灵巧近战武器，可用来双武器战斗。', facts: [['基础伤害', '1d6 穿刺']]};
      case 'pack': return {note: packUse[id]};
      case 'boostPattern': return {note: id === 'two-one' ? '把两个加值分别给不同属性，适合集中强化主要属性。' : '把三点分别给三项不同属性，适合平均提升。'};
    }
    if (Object.hasOwn(skills, id)) {
      const expert = key.startsWith('expertise.') || ['plan.expertise', 'plan.featExpert'].includes(key);
      return {note: skillUse[id], facts: [['关联属性', attrs[skills[id]]], ['当前检定加值', sign(calc.skillBonus(id))],
        ['选择效果', expert ? '检定计入双倍熟练加值。' : '取得熟练后，检定计入熟练加值。']]};
    }
    if (id === '盗贼工具') return {note: '开锁或解除陷阱时，符合条件的盗贼工具检定可加入双倍熟练加值。'};
    if (key === 'flex' || key === 'flex2' || key.startsWith('boostTargets.') || key === 'plan.stat') {
      const boost = key.startsWith('boostTargets.') ? boostValues(state.ancestry, state.boostPattern)[Number(key.split('.')[1])] : 1;
      return {note: id === -1 ? '本级不另外分配属性加值。' : `把这项加值 +${boost} 分配给${attrs[id]}。总属性每跨过一个新的偶数门槛，调整值就会上升 1。`};
    }
    if (key.startsWith('languages.') || /^plan\.language[12]$/.test(key)) {
      return {note: id ? `把${id}加入已知语言，可用于与懂这门语言的角色交流。` : '这个语言名额还没有分配。'};
    }
    if (id === '') return {note: '这个名额还没有分配。'};
    return {note: caption || `将「${option.title}」用于${branches.get(key).label.split(' · ')[0]}。`};
  }

  const purposeLabels = {
    melee: ['近战', 'Melee'], ranged: ['远程', 'Ranged'], damage: ['伤害', 'Damage'],
    control: ['控制', 'Control'], defense: ['防护', 'Defense'], healing: ['治疗', 'Healing'],
    support: ['支援', 'Support'], movement: ['移动', 'Mobility'], stealth: ['潜行', 'Stealth'],
    scout: ['侦察', 'Scouting'], exploration: ['探索', 'Exploration'], wilderness: ['野外', 'Wilderness'],
    social: ['社交', 'Social'], lore: ['知识', 'Knowledge'], magic: ['魔法', 'Magic'],
    tools: ['工具', 'Tools'], accuracy: ['提高命中', 'Accuracy'], storage: ['收纳', 'Storage'],
    flexible: ['灵活建卡', 'Flexible Builds'], athletics: ['运动', 'Athletics'], finishing: ['终结', 'Finishing Blows'],
  };
  const purposeLabel = tag => purposeLabels[tag][CharacterLocale.language === 'en' ? 1 : 0];
  const equipmentPurposes = item => [
    ...(optionPurposes.gear.get(item.id) ?? []),
    ...(item.kind === 'weapon' ? [item.category, ...(item.properties.includes('thrown') ? ['ranged'] : []),
      ...(item.damage ? ['damage'] : ['control'])] : []),
    ...(item.kind === 'armor' ? ['defense'] : []),
    ...(item.kind === 'instrument' ? ['social', 'tools'] : []),
    ...(['mount', 'vehicle'].includes(item.kind) ? ['movement', 'exploration'] : []),
  ];

  function equipmentUse(item) {
    if (item.kind === 'armor') return item.type === 'shield' ? '占用一只手，提高 AC。' : '穿戴时决定基础 AC。';
    if (item.kind === 'weapon') {
      if (item.id === 'net') return '命中时可束缚符合条件的目标。';
      if (item.properties.includes('thrown')) return item.category === 'melee' ? '可近战，也可投掷。' : '投掷使用的远程武器。';
      if (item.properties.includes('reach')) return '近战攻击的触及距离更远。';
      if (item.properties.includes('finesse')) return '用力量或敏捷攻击。';
      return item.category === 'ranged' ? '从远处攻击，留意射程和弹药。' : '靠近目标后用来攻击。';
    }
    const lang = CharacterLocale.language === 'en' ? 1 : 0;
    if (gearPurposeCaptions[item.id]) return gearPurposeCaptions[item.id][lang];
    if (item.kind === 'instrument') return lang ? 'Play music during performances or ceremonies.' : '演出或举行仪式时演奏音乐。';
    if (item.kind === 'mount') return lang ? 'Use as a mount or a pack animal when appropriate.' : '按物种和负载情况骑乘，或用来驮货。';
    if (item.kind === 'vehicle') return lang ? 'Use to transport passengers and cargo.' : '用来运送乘客和货物。';
    const fallback = equipmentPurposes(item).find(tag => gearPurposeFallbacks[tag]);
    return item.note || gearPurposeFallbacks[fallback]?.[lang] || '';
  }

  function featureCaption(title, text) {
    const localized = CharacterLocale.text(text ?? '');
    const first = localized.match(/^.*?[。！？]|^.*?[.!?](?=\s|$)/u)?.[0] ?? localized;
    const limit = CharacterLocale.language === 'en' ? 132 : 60;
    if (first && first.length <= limit && (CharacterLocale.language !== 'en' || !/\p{Script=Han}/u.test(first))) return first;
    return CharacterLocale.text(title);
  }

  function optionPurpose(key, option, spell, items) {
    const {id} = option;
    if (spell) {
      const tags = [...(optionPurposes.spell.get(id) ?? [])];
      if (spellResolution[id]?.['伤害'] || spellResolution[id]?.['按效果结算的伤害骰']) tags.push('damage');
      const short = featureCaption(spell.name, spell.summary);
      return {tags, summary: short === CharacterLocale.text(spell.name) ? spell.summary : short};
    }
    if (items.length || key.startsWith('equipmentChoices.')) {
      const bundle = key.startsWith('equipmentChoices.');
      const group = bundle ? coreRules.classes[state.job]?.equipment.find(group => group.id === key.split('.')[1]) : null;
      const pick = group?.options.find(entry => entry.id === id)?.pick;
      const pool = pick && equipmentPickPool(pick);
      const tags = items.flatMap(({item}) => equipmentPurposes(item));
      // A bundle only advertises purposes the fixed items or every eligible pick can fulfill.
      if (pool?.length) tags.push(...equipmentPurposes(pool[0]).filter(tag => pool.every(item => equipmentPurposes(item).includes(tag))));
      const summary = pick ? (pick.type === 'instrument' ? '还需从乐器列表中选择。' : '还需从武器列表中选择。') :
        items.map(({item}) => featureCaption(item.name, equipmentUse(item))).filter(Boolean)[0];
      return {tags, summary};
    }
    if (key === 'ancestry' && id !== 'custom') {
      const traits = expansionAncestryRules[id] ?? [];
      const distinctive = traits.find(([title]) => !/黑暗视觉|敏锐感官|妖精血统|出神|语言|体型|速度|属性值|生物类型|强力体格/.test(title));
      const summary = ancestryUse[id] || (distinctive && featureCaption(...distinctive)) || legacyRaceOptions[id]?.note;
      return {tags: optionPurposes.ancestry.get(id) ?? [], summary};
    }
    if (key === 'job') return {tags: optionPurposes.job.get(id) ?? [], summary: classUse[id]};
    if (key === 'background' && id !== 'custom') {
      const entry = expansionBackgroundRules[backgrounds[id][0]]?.[0];
      const feature = coreRules.backgrounds[id]?.feature;
      return {tags: optionPurposes.background.get(id) ?? [], summary: backgroundUse[id] ??
        (entry ? featureCaption(...entry) : feature && featureCaption(backgrounds[id][4], feature))};
    }
    if (isRuleSubclass(key)) {
      const rogue = state.job === 'rogue' && (subs[id] ?? subclassData.find(sub => sub.name === id));
      const first = coreRules.subclassFeatures[state.job]?.[id]?.[activeTrack(state).sub[0]]?.[0];
      const rows = !first && !rogue && subclassReferenceRows(state.job, id);
      const entry = rows && rows.find(([rank, , description]) => +rank === activeTrack(state).sub[0] && description);
      return {tags: optionPurposes.subclass.get(rogue?.id ?? id) ?? [],
        summary: rogue?.tag || (first ? featureCaption(first.name, first.desc) : entry && featureCaption(entry[1], entry[2]))};
    }
    return {tags: [], summary: ''};
  }

  function renderPurposeFilter(tagLists, selected = []) {
    const tagSet = new Set(tagLists.flat());
    const tags = Object.keys(purposeLabels).filter(tag => tagSet.has(tag));
    if (!tags.length) return '';
    return `<div class="purpose-filter" role="group" aria-label="想做什么">
      <span class="purpose-label">想做什么</span>
      <div class="purpose-buttons"><button type="button" data-purpose-clear aria-pressed="${!selected.length}">全部</button>
      ${tags.map(tag => `<button type="button" data-purpose-tag="${tag}" aria-pressed="${selected.includes(tag)}">${esc(purposeLabel(tag))}</button>`).join('')}</div>
    </div>`;
  }

  function setPurposeButtons(panel, purposes) {
    for (const button of panel.querySelectorAll('[data-purpose-tag], .purpose-buttons [data-purpose-clear]')) {
      const active = button.dataset.purposeTag ? purposes.includes(button.dataset.purposeTag) : !purposes.length;
      button.setAttribute('aria-pressed', active);
    }
  }

  function selectedPurposes(panel) {
    return [...panel.querySelectorAll('[data-purpose-tag][aria-pressed="true"]')].map(button => button.dataset.purposeTag);
  }

  function matchesPurposes(tags, purposes) {
    return purposes.every(tag => tags.includes(tag));
  }

  function purposeNoResults(purposes, hidden = true) {
    return `<div class="purpose-empty" data-purpose-empty data-search-empty${hidden ? ' hidden' : ''}>
      <p>${purposes.length ? '没有符合全部所选用途和其他筛选条件的选项。' : '没有符合条件的选项。可清空搜索或调整筛选。'}</p>
      <button type="button" data-purpose-clear${purposes.length ? '' : ' hidden'}>清除用途筛选</button></div>`;
  }

  function updatePurposeEmpty(container, purposes, count) {
    const empty = container.querySelector('[data-purpose-empty]');
    empty.hidden = count > 0;
    empty.querySelector('p').textContent = CharacterLocale.text(purposes.length ?
      '没有符合全部所选用途和其他筛选条件的选项。' : '没有符合条件的选项。可清空搜索或调整筛选。');
    empty.querySelector('button').hidden = !purposes.length;
  }

  function previewFacts(facts, className = 'equipment-preview-stats') {
    const rows = facts.filter(([, value]) => value !== '' && value !== undefined && value !== null);
    return rows.length ? `<dl class="${className}">${rows.map(([label, value]) =>
      `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>` : '';
  }

  function renderSpellPreview(spell, calc) {
    const {casting, rings} = branchSpellContext(branchKey, spell, calc);
    const track = calc.core.spells.track;
    const classCast = spell.level && track && !branchKey.startsWith('decision.spell:');
    const allowed = classCast ? [...track.slots].flatMap((count, index) => +count && index + 1 >= spell.level ? [index + 1] : []) : [];
    const rank = rings[0] ?? allowed[0] ?? spell.level;
    const resolution = spellResolution[spell.id] ?? {};
    const facts = [['距离', spell.range], ['专注', spell.concentration ? '需要专注' : '无需专注'],
      ['判定', resolution['攻击检定']], ['目标豁免', resolution['目标豁免'] || spell.spellSave]];
    return `<div class="spell-preview" data-preview-spell="${esc(spell.id)}">${previewFacts(facts)}
      ${allowed.length > 1 ? `<label class="spell-preview-rank">试算施放环位<select data-preview-spell-ring>${allowed.map(ring =>
        `<option value="${ring}"${ring === rank ? ' selected' : ''}>${ring} 环施放</option>`).join('')}</select></label>` : ''}
      <div data-preview-spell-values>${renderSpellCastValues(spell, {level: state.level, ring: rank, casting})}</div>
      ${spellDisclosure(spell, {label:'其他施法条件', casting, rings, showEffect:false, showLive:false})}</div>`;
  }

  function renderOptionDetail(option, calc) {
    if (!option) return '';
    const record = optionDetail(branchKey, option, calc);
    const draft = previewBuild(branchKey, option);
    const preview = calculate(draft);
    const item = ruleItem(branchKey, option.id);
    const spell = ruleSpell(branchKey, option.id);
    const items = equipmentChoiceItems(branchKey, option.id);
    const purpose = optionPurpose(branchKey, option, spell, items);
    const identity = ['ancestry', 'job', 'background'].includes(branchKey);
    const subclass = isRuleSubclass(branchKey);
    const summary = spell ? spell.summary : purpose.summary || record.note || option.caption;
    const facts = item ? [...equipmentStats(item), ...equipmentPriceWeight(item)] : items.map(({item, quantity}) =>
      [item.name + ' × ' + quantity, equipmentSummary(item, true)]);
    const future = subclass && state.level < activeTrack(state).sub[0];
    if (identity) facts.push(...(record.facts ?? []).slice(0, 4));
    if (branchKey === 'equippedWeapon') facts.unshift(['你的攻击检定', 'd20 ' + sign(preview.core.attack.hit)], ['你的命中伤害', preview.core.attack.damage]);
    if (branchKey === 'armor') facts.unshift(['你的穿戴后 AC', preview.ac]);
    if (subclass) {
      const unlock = activeTrack(state).sub[0];
      facts.unshift(['获得等级', unlock + ' 级']);
      const opening = (record.features ?? []).filter(([rank]) => +rank === unlock).map(([, [name]]) => name);
      if (opening.length) facts.push(['解锁能力', [...new Set(opening)].join('、')]);
    }
    if (branchKey.startsWith('equipmentChoices.')) {
      const groupId = branchKey.slice('equipmentChoices.'.length);
      const next = equipmentPickBranch(draft, groupId);
      if (next) facts.push(['接下来', purpose.summary || '还需从装备列表中选择。']);
    }
    return `<div class="inspector-title"><h4 id="inspector-heading" tabindex="-1">${esc(option.title)}</h4>
      <button type="button" class="close-preview" data-action="close-preview" aria-label="收起${esc(option.title)}预览">收起</button></div>
      <div class="choice-actions">${renderChoiceActions(option)}<button type="button" class="rule-open" data-open-rule="${esc(option.id)}" aria-haspopup="dialog">完整规则</button></div>
      ${option.disabled ? '<p class="hint">当前不可选，请检查名额和选择条件。</p>' : ''}
      ${summary ? `<p class="inspector-note">${esc(summary)}</p>` : ''}
      ${option.listLabel ? `<p class="hint">${esc(option.listLabel)}</p>` : ''}
      ${future ? '<p class="hint">这是未来的规划，到解锁等级才会生效。</p>' : ''}
      ${item ? equipmentTrainingNote(item, calc) : ''}
      ${spell ? renderSpellPreview(spell, calc) : ''}
      ${previewFacts(facts)}
      ${renderImpact(option, calc, preview, (identity || subclass) && !future)}`;
  }

  function previewOption(options) {
    return options.find(option => String(option.id) === previewedChoice);
  }

  function branchOptionSource(key, option) {
    if (option.id === 'custom') return '手动录入';
    const spell = ruleSpell(key, option.id);
    if (spell) return spell.sourceBook ?? '玩家手册 2014';
    let book = '';
    if (key === 'ancestry') book = ancestryBook(option.id)[0];
    else if (key === 'background') book = sourceLabel(backgrounds[option.id][5]);
    else if (key === 'job') book = optionDetail(key, option).source;
    else if (isRuleSubclass(key)) book = revisedEberronSubclasses.has(option.id) ? '探秘艾伯伦 · 2020 初版 · 第三方' : optionDetail(key, option).source;
    else if (key === 'plan.feat') book = manualFeats[option.id] ? sourceLabel(manualFeats[option.id].path) : featMap[option.id]?.book ?? 'PHB';
    return ({PHB: '玩家手册 2014', '2014 玩家手册': '玩家手册 2014', '玩家手册': '玩家手册 2014',
      XGE: '珊娜萨的万事指南', TCE: '塔莎的万事坩埚', SCAG: '剑湾冒险者指南', '手填': '手动录入'}[book] ?? book) || '';
  }

  function optionSearchText(parts) {
    return [...parts, ...parts.filter(Boolean).map(CharacterLocale.english)].join(' ').toLocaleLowerCase();
  }

  function matchesBranchFilters(option, search, sources, ring, purposes) {
    return (!ring || ring === 'all' || option.optionRing === ring) &&
      (!sources.length || sources.includes(option.optionSource)) && option.optionText.includes(search) &&
      matchesPurposes(option.optionPurposes.split(' '), purposes);
  }

  function renderBranch(calc, opened) {
    const branch = branches.get(branchKey);
    if (!branch) return '<div id="branch-panel" hidden></div>';
    const isSubclass = branchKey === 'subclass';
    const canCompare = isRuleSubclass(branchKey) && branch.options.length >= 2;
    const comparing = canCompare && subclassComparisonOpen;
    const title = branchKey === 'ancestry' ? '种族图鉴' : isSubclass ? '游荡者 · 9 个子职' : branch.label;
    const inPlan = branchOpener.startsWith('open-plan');
    const equipmentGroup = branchKey.startsWith('decision.gear:') ? branchKey.split(':')[1] : '';
    const spellRings = [...new Set(branch.options.map(option => ruleSpell(branchKey, option.id)?.level).filter(level => level !== undefined))].sort((a, b) => a - b);
    const requestedRing = branchSpellRings.get(branchKey);
    const spellRing = spellRings.includes(requestedRing) ? String(requestedRing) : 'all';
    const hasSpellDrop = spellRings.length > 0 && branch.multiple && branchKey !== 'plan.spellsRemoved';
    const intro = `<section class="panel branch-panel" id="branch-panel" aria-labelledby="branch-title" data-current-spell-ring="${spellRing}"${branchKey === 'ancestry' ? ' data-ancestry-catalogue' : ''}
      ${inPlan ? `data-transition-panel="plan-branch" data-transition-key="${esc(branchKey)}"` : ''}>
      <div class="section-head">
        <div><h3 id="branch-title" tabindex="-1">${comparing ? '子职对照 · ' + esc(classSpec(state)[0]) : esc(title)}</h3>
        ${comparing ? '<p class="hint">左右各选一个子职。想采用时，再设为规划。</p>' : ''}</div>
        <div class="branch-header-actions">${canCompare ? `<button type="button" ${comparing ? '' : 'class="primary" '}data-action="toggle-subclass-comparison" data-focus="toggle-subclass-comparison">${comparing ? '返回子职列表' : '子职对照'}</button>` : ''}
        ${equipmentGroup ? `<button type="button" data-open-branch="equipmentChoices.${esc(equipmentGroup)}">返回本组</button>` : ''}
        <button type="button" data-action="close-branch">收起</button></div>
      </div>`;
    if (comparing) return intro + renderSubclassComparison(branch, calc, opened) + '</section>';
    const filter = branchFilters.get(branchKey) ?? {query: '', sources: [], purposes: [], expanded: false};
    const sources = [...new Set(branch.options.map(option => branchOptionSource(branchKey, option)).filter(Boolean))];
    const query = filter.query.trim().toLocaleLowerCase();
    const cards = branch.options.map(option => {
      const source = branchOptionSource(branchKey, option);
      const spell = ruleSpell(branchKey, option.id);
      const items = equipmentChoiceItems(branchKey, option.id);
      const bundle = branchKey.startsWith('equipmentChoices.');
      const stats = items.map(({item, quantity}) => {
        const line = equipmentSummary(item, item.kind !== 'armor' && item.kind !== 'weapon');
        return bundle ? `${item.name} × ${quantity} · ${line}` : line;
      });
      const {tags, summary} = optionPurpose(branchKey, option, spell, items);
      const caption = summary || option.caption;
      return {option, source, spell, stats, tags, caption, filters: {
        optionRing: spell ? String(spell.level) : undefined, optionSource: source, optionPurposes: tags.join(' '),
        optionText: optionSearchText([option.title, branchKey === 'background' ? backgrounds[option.id]?.[0] : '',
          spell?.en, spell?.summary, caption, option.caption, option.listLabel, source, ...tags.flatMap(tag => purposeLabels[tag]), ...stats]),
      }};
    });
    const availableTags = new Set(cards.flatMap(card => card.tags));
    const purposes = (branchPurposeSelections.get(purposeBranchId(branchKey)) ?? []).filter(tag => availableTags.has(tag));
    const purposeFilter = renderPurposeFilter(cards.map(card => card.tags), purposes);
    const hasFilters = purposeFilter || branch.options.length >= 12 || sources.length > 1 || spellRings.length > 0;
    const visible = new Set(cards.filter(card => matchesBranchFilters(card.filters, query, filter.sources, spellRing, purposes)).map(card => card.option));
    const preview = previewOption([...visible]);
    const options = cards.map(({option, source, spell, stats, caption, tags, filters}) => {
      const status = option.selected ? isRuleSubclass(branchKey) ? '已规划' : '已选' : option.disabled ? '暂不可选' : '';
      const showSource = ['ancestry', 'job', 'background'].includes(branchKey) || isRuleSubclass(branchKey);
      const cardSource = showSource ? [source, branchKey === 'ancestry' && option.id !== 'custom' && ancestries[option.id][2] + ' 尺'].filter(Boolean).join(' · ') : '';
      const spellConditions = spell ? [spellRingName(spell.level), spell.concentration && '专注', spell.ritual && '仪式',
        ...tags.slice(0, 2).map(purposeLabel)] : [];
      return `<div class="branch-card"${visible.has(option) ? '' : ' hidden'}${option === preview ? ' data-previewing' : ''}${option.selected ? ' data-selected' : ''}>
      <button type="button" class="branch-option" data-branch-choice="${esc(option.id)}"
        ${spell ? `data-option-ring="${spell.level}"` : ''}${spell && hasSpellDrop && !option.selected && !option.disabled ? ` draggable="true" data-drag-spell="${esc(option.id)}"` : ''}
        data-option-source="${esc(source)}" data-option-text="${esc(filters.optionText)}" data-option-purposes="${esc(filters.optionPurposes)}"
        data-focus="choice-${branchKey}-${esc(option.id)}" aria-expanded="${option === preview}" aria-controls="branch-inspector">
        ${optionIllustration(branchKey, option)}<span class="branch-copy"><span class="branch-label"><strong>${esc(option.title)}</strong>
        ${status ? `<small class="branch-status">${status}</small>` : ''}</span>
        ${spell || option.listLabel ? `<small class="spell-access-label">${esc([...spellConditions, option.listLabel].filter(Boolean).join(' · '))}</small>` : ''}
        ${caption ? `<small class="branch-caption">${esc(caption)}</small>` : ''}
        ${cardSource ? `<small class="purpose-card-source">${esc(cardSource)}</small>` : ''}
        ${stats.map(line => `<small class="equipment-option-stats">${esc(line)}</small>`).join('')}</span>
      </button>
      </div>`;
    }).join('');
    return intro + `
      ${purposeFilter}
      ${hasFilters ? `<div class="branch-filter-bar"><label class="branch-search">搜索<input type="search" data-branch-search
        value="${esc(filter.query)}" autocomplete="off" placeholder="${spellRings.length ? '输入法术名' : '输入名称或关键词'}"></label>
        ${spellRings.length ? `<label>法术环阶<select data-branch-ring data-focus="branch-ring"><option value="all">全部环阶</option>${spellRings.map(rank =>
          `<option value="${rank}"${String(rank) === spellRing ? ' selected' : ''}>${spellRingName(rank)}</option>`).join('')}</select></label>` : ''}
        ${sources.length > 1 ? `<details class="source-filter" data-source-filter="${esc(branchKey)}"${filter.expanded ? ' open' : ''}>
        <summary>规则来源 <small data-source-summary>${filter.sources.length ? filter.sources.length + ' 个' : ''}</small></summary>
        <div class="source-filter-body"><div class="source-filter-toolbar"><strong>可多选</strong><button type="button" data-clear-branch-sources>查看全部来源</button></div>
        <div class="source-filter-options" role="group" aria-label="规则来源，可选择多个">${sources.map(source => `<label><input type="checkbox" data-branch-source value="${esc(source)}"${filter.sources.includes(source) ? ' checked' : ''}><span>${esc(source)}</span></label>`).join('')}</div></div></details>` : ''}
        </div><p class="hint" data-filter-count role="status">显示 ${visible.size} / ${branch.options.length} 项</p>
        ${purposeNoResults(purposes, visible.size > 0)}` : ''}
      ${hasSpellDrop ? `<div class="spell-drop" data-spell-drop="${spellRing}"><strong>${branchKey === 'preparations' ? '已准备' : branchKey === 'plan.spellsAdded' ? '本级已选' : '已选法术'}</strong>
        <span>将法术拖到这里，或点开后选择。</span><div class="spell-chips">${cards.filter(card => card.option.selected && (spellRing === 'all' || card.filters.optionRing === spellRing)).map(card => card.option)
          .map(option => `<span>${esc(option.title)}</span>`).join('')}</div></div><p class="notice" data-spell-drop-status role="status"></p>` : ''}
      <div class="branch-workspace">
        <div class="branch-list">
          <div class="branch-grid" role="group" aria-labelledby="branch-title">${options}</div>
        </div>
        <section class="branch-inspector" id="branch-inspector" aria-labelledby="inspector-heading"${preview ? '' : ' hidden'}>
          <div class="inspector-body" data-inspector-body>${renderOptionDetail(preview, calc)}</div>
        </section>
      </div>
      ${canCompare ? '' : renderOptionComparison(calc)}
    </section>`;
  }

  function renderChoicePath(steps) {
    return `<p class="choice-path"><span>当前位置</span>${steps.map((step, i) => i === steps.length - 1 ?
      `<strong>${esc(step)}</strong>` : `<span>${esc(step)}</span><span aria-hidden="true">›</span>`).join('')}</p>`;
  }

  function renderChoiceTree(calc, opened, lanes) {
    const roots = [
      ['ancestry', '01', ancestries[state.ancestry][0]],
      ['job', '02', classSpec(state)[0]],
      ['background', '03', backgroundName()],
      ['treeLevel', '04', state.level + ' / ' + state.levelCap + ' 级'],
      ['armor', '05', armors[calc.core.equipment.armor][0]],
    ];
    const inTree = !branchOpener.startsWith('open-plan');
    const branch = inTree ? branches.get(branchKey) : null;
    return `<section class="builder-section" id="build-choices" aria-label="选择树">
      <div class="tree-controls" role="group" aria-label="选择树视图">${treeView === 'all' ? `<div class="growth-map-nav" role="group" aria-label="浏览选择树">
          <button type="button" data-tree-scroll="-1" aria-label="向左浏览选择树" aria-controls="full-tree-map">←</button>
          <button type="button" data-tree-scroll="1" aria-label="向右浏览选择树" aria-controls="full-tree-map">→</button></div>` : ''}
        <button type="button" class="tree-view-toggle" data-focus="tree-view" data-tree-view="${treeView === 'focus' ? 'all' : 'focus'}" aria-pressed="${treeView === 'all'}">${treeView === 'all' ? '聚焦当前分类' : '全树总览'}</button></div>
      ${treeView === 'all' ? '<div class="full-tree-scroll" id="full-tree-map" tabindex="0" role="region" aria-label="可左右滚动的角色选择树">' : ''}
      <div class="choice-tree ${treeView === 'focus' ? 'tree-focus' : 'tree-all'}" data-choice-tree>
        <svg class="tree-wires" aria-hidden="true"></svg>
        <div class="tree-start" data-tree-start><span class="eyebrow">起点</span><strong>${state.name.trim() ? userText(state.name.trim()) : '新角色'}</strong>
          <small>${state.level} 级 · ${esc(classSpec(state)[0])}</small></div>
        <div class="tree-roots" role="group" aria-label="选择分类">
          ${roots.map(([key, n, value]) => `<button type="button" class="tree-root"
          data-tree-category="${key}" data-tree-lane="${n}" data-focus="tree-${key}" aria-pressed="${treeCategory === key}"><span>${n}</span><strong>${treeCategoryNames[key]}</strong><small>${esc(value)}</small></button>`).join('')}</div>
        <div class="tree-fields" data-tree-fields data-transition-panel="tree-fields" data-transition-key="${treeCategory}"${treeCategory || treeView === 'all' ? '' : ' hidden'}>${treeView === 'all' ? Object.values(lanes).join('') : lanes[treeCategory] ?? ''}</div>
        <div class="tree-options" data-tree-options data-transition-panel="tree-options" data-transition-key="${esc(branch ? branchKey : '')}"${branch ? '' : ' hidden'}>${branch ? renderBranch(calc, opened) : ''}</div>
      </div>
      ${treeView === 'all' ? '</div>' : ''}
    </section>`;
  }

  function drawChoiceTree() {
    const scene = root.querySelector('[data-choice-tree]');
    if (!scene || treeView !== 'all') return;
    const origin = scene.getBoundingClientRect();
    const svg = scene.querySelector('.tree-wires');
    const nodes = [...scene.querySelectorAll('[data-tree-category]')];
    const active = nodes.find(node => node.dataset.treeCategory === treeCategory);
    const start = scene.querySelector('[data-tree-start]');
    const lane = active && scene.querySelector(`[data-tree-fields] [data-lane="${active.dataset.treeLane}"]`);
    const fields = lane ? [...lane.querySelectorAll('.branch-entry')].filter(node => node.getClientRects().length) : [];
    const opener = fields.find(node => node.dataset.openBranch === branchKey);
    const leaf = scene.querySelector('#branch-title');
    function wire(from, to, selected, option = false) {
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const x1 = a.right - origin.left;
      const y1 = (a.top + a.bottom) / 2 - origin.top;
      const x2 = b.left - origin.left;
      const y2 = (b.top + b.bottom) / 2 - origin.top;
      const mid = (x1 + x2) / 2;
      return `<path class="${selected ? 'tree-wire-active' : ''}${option ? ' tree-option-wire' : ''}" d="M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}"/>`;
    }
    svg.innerHTML = (start.getClientRects().length ? nodes.map(node => wire(start, node, node === active)).join('') : '') +
      (active ? fields.map(field => wire(active, field, field === opener)).join('') : '') +
      (opener && leaf ? wire(opener, leaf, true, true) : '');
  }

  function filterBranchOptions(panel) {
    const query = panel.querySelector('[data-branch-search]').value;
    const sources = [...panel.querySelectorAll('[data-branch-source]:checked')].map(input => input.value);
    const purposes = selectedPurposes(panel);
    branchPurposeSelections.set(purposeBranchId(branchKey), purposes);
    branchFilters.set(branchKey, {query, sources, expanded: panel.querySelector('[data-source-filter]')?.open ?? false});
    const search = query.trim().toLocaleLowerCase();
    const branch = branches.get(branchKey);
    const visible = [];
    panel.querySelectorAll('.branch-option').forEach((button, i) => {
      const card = button.closest('.branch-card');
      card.hidden = !matchesBranchFilters(button.dataset, search, sources, panel.dataset.currentSpellRing, purposes);
      if (!card.hidden) visible.push(branch.options[i]);
    });
    updatePurposeEmpty(panel, purposes, visible.length);
    const summary = panel.querySelector('[data-source-summary]');
    if (summary) summary.textContent = CharacterLocale.text(sources.length ? sources.length + ' 个' : '');
    panel.querySelector('[data-filter-count]').textContent = CharacterLocale.text(`显示 ${visible.length} / ${branch.options.length} 项`);
    const preview = previewOption(visible);
    if (!preview) previewedChoice = null;
    showOptionDetail(panel, preview);
  }

  function usesInlinePreview(panel) {
    return inlinePreview.matches || panel.clientWidth < 500;
  }

  function positionBranchPreview(panel) {
    const inspector = panel?.querySelector('#branch-inspector');
    if (!inspector) return;
    const active = panel.querySelector('.branch-card[data-previewing]');
    const workspace = panel.querySelector('.branch-workspace');
    if (active && usesInlinePreview(panel)) {
      if (active.nextElementSibling !== inspector) active.after(inspector);
    } else if (inspector.parentElement !== workspace) workspace.append(inspector);
  }

  function showOptionDetail(panel, option) {
    const active = panel.querySelector('[data-previewing]');
    const next = option && [...panel.querySelectorAll('[data-branch-choice]')]
      .find(button => button.dataset.branchChoice === String(option.id))?.closest('.branch-card');
    if ((next || null) === active) return;
    active?.removeAttribute('data-previewing');
    active?.querySelector('.branch-option').setAttribute('aria-expanded', 'false');
    next?.setAttribute('data-previewing', '');
    next?.querySelector('.branch-option').setAttribute('aria-expanded', 'true');
    panel.querySelector('#branch-inspector').hidden = !next;
    const body = panel.querySelector('[data-inspector-body]');
    body.innerHTML = renderOptionDetail(option, calculate());
    CharacterLocale.localize(body);
    body.scrollTop = 0;
    positionBranchPreview(panel);
    queuePageGuideHighlight();
  }

  function previewBranchButton(button) {
    const value = button.dataset.branchChoice;
    const option = branches.get(branchKey)?.options.find(item => String(item.id) === value);
    if (!option) return;
    previewedChoice = value;
    const panel = button.closest('#branch-panel');
    showOptionDetail(panel, option);
    panel.querySelector('[data-inspector-body]').scrollTop = 0;
  }

  function closeChoicePreview() {
    clearTimeout(optionRevealTimer);
    const panel = root.querySelector('#branch-panel');
    const choice = panel?.querySelector('[data-previewing] .branch-option');
    if (!choice) return;
    previewedChoice = null;
    showOptionDetail(panel, undefined);
    reveal(`[data-focus="${CSS.escape(choice.dataset.focus)}"]`, {focus: true});
  }

  inlinePreview.addEventListener('change', () => positionBranchPreview(root.querySelector('#branch-panel')));

  function readoutValues(calc) {
    return [['HP', calc.hp], ['AC', calc.ac], ['先攻', sign(calc.initiative)], ['速度', calc.speed + ' 尺'],
      ['熟练加值', sign(calc.pb)], ['被动察觉', 10 + calc.skillBonus('察觉') + calc.passiveBonus],
      ['洞悉', sign(calc.skillBonus('洞悉'))], ['欺瞒', sign(calc.skillBonus('欺瞒'))]];
  }

  function renderStickyBoard(calc, inDialog = false) {
    const mode = state.scoreMode === 'buy' ? '剩余 ' + (27 - spent(state.base)) + ' / 27 点' : '手动原值';
    const {spells} = calc.core;
    return `<section class="sticky-board character-hud" aria-label="等级、属性与当前数值">
      <button type="button" class="hud-portrait" data-action="hologram" aria-label="打开角色草图" aria-haspopup="dialog" style="${portraitProportions()}">${portraitMarkup()}</button>
      <div class="sticky-heading"><span class="budget-chip"${inDialog ? '' : ' id="budget"'} aria-live="polite">${hudIcon('plus')}${mode}</span>
        <button type="button" class="point-toggle" data-action="levels">${hudIcon('stairs')}${state.level} 级 · 升级</button>
        <button type="button" class="hud-action" data-action="ability-overview" aria-haspopup="dialog">${hudIcon('star')}能力速览</button>
        ${activeTask !== 'spells' && hasSpellTasks(spells) ? `<button type="button" class="hud-action" data-action="spell-slots" aria-haspopup="dialog">${hudIcon('wand')}${spells.track ? '法术位' : '法术一览'}</button>` : ''}</div>
      <div class="compact-scores">${attrs.map((name, i) =>
        `<div><span title="${name}" aria-label="${name}">${hudIcon(abilityGlyphs[i])}${CharacterLocale.language === 'en' ? abilityCodes[i] : name}</span><strong>${calc.totals[i]}</strong></div>`).join('')}</div>
      ${state.level !== state.actualLevel ? `<div class="preview-level" role="status">预览 ${state.level} 级 · 实际 ${state.actualLevel} 级 <button type="button" data-action="confirm-level">设为实际等级</button><button type="button" data-action="actual-level">返回实际等级</button></div>` : ''}
      <div class="live-strip" aria-label="当前数值">${readoutValues(calc).map(([label, value], i) =>
        `<span>${hudIcon(statGlyphs[i])}${label} <strong data-value="${label}">${value}</strong></span>`).join('')}</div>
    </section>`;
  }

  function portraitPreset(id) {
    return portraitPresets[id] ?? portraitPresets[legacyRaceOptions[id]?.shape] ?? portraitPresets.human;
  }

  function portraitSettings() {
    return {...portraitPreset(state.ancestry), ...state.portraits[state.ancestry]};
  }

  function renderPortraitFeatures(portrait) {
    if (portrait.reptilian) return `
      <path d="M164 44 L153 25 Q163 27 169 34 L176 20 L180 29 L185 20 L191 34 Q199 27 207 25 L196 44 Q201 55 193 66 L189 76 Q180 82 170 76 L165 66 Q159 54 164 44Z"/>`;
    const ear = portrait.ears === 'pointed' ? 'M161 45 Q151 42 144 33 Q147 50 154 56 Q158 59 163 57' :
      'M161 46 Q153 43 150 38 Q151 50 157 56 L163 57';
    const ears = portrait.ears ? `<path d="${ear}"/><path d="${ear}" transform="translate(360 0) scale(-1 1)"/>` : '';
    return `
      ${portrait.horns ? '<path d="M164 33 Q150 24 152 10 Q158 21 171 23 M196 33 Q210 24 208 10 Q202 21 189 23"/>' : ''}
      ${ears}
      ${portrait.fangs ? '<path d="M169 68l-3-8 7 10m18-2 3-8-7 10"/>' : ''}`;
  }

  function renderPortraitSvg(totals, portrait) {
    const proportions = portraitScales(portrait);
    const height = proportions.height * 0.9;
    const width = proportions.width * 0.92;
    const markerRows = [70 + (1 - height) * 145, 198 + (1 - height) * 95, 332 + (1 - height) * 38];
    return `<svg viewBox="0 0 360 420" class="body-diagram" aria-label="人像属性示意图">
        ${portrait.reptilian ? '<defs><clipPath id="portrait-body"><rect x="52" y="74" width="256" height="325"/></clipPath></defs>' : ''}
        <g class="figure-guides"><path d="M180 11V406M91 397H269"/></g>
        <g transform="translate(180 398) scale(${width} ${height}) translate(-180 -398)">
          <image class="figure-art" href="${workbenchPortrait}" x="52" y="14" width="256" height="384"${portrait.reptilian ? ' clip-path="url(#portrait-body)"' : ''}/>
          <g class="figure-silhouette">${renderPortraitFeatures(portrait)}</g>
        </g>
        ${bodyRegions.map(({point: [x, y], row, side}, i) => {
          const pointX = 180 + (x - 180) * width;
          const pointY = 398 + (y - 398) * height;
          const markerX = 180 + side * 142;
          const markerY = markerRows[row];
          const bendX = 180 + side * 102;
          const bendY = pointY + (markerY - pointY) * 0.28;
          const leadX = markerX - side * 24;
          return `<g class="figure-pin">
            <path class="figure-wire" d="M${pointX} ${pointY} L${bendX} ${bendY} L${leadX} ${markerY} H${markerX}"/>
            <circle class="figure-point" cx="${pointX}" cy="${pointY}" r="4"/>
            <a href="#score-${i}" data-ability-marker="${i}" aria-label="编辑${attrs[i]}原值" transform="translate(${markerX} ${markerY})">
              <circle r="18"/><text y="5">${totals[i]}</text><text class="figure-pin-label" y="34">${attrs[i]}</text>
            </a></g>`;
        }).join('')}
      </svg>`;
  }

  function renderFigure(calc) {
    const portrait = portraitSettings();
    const name = state.ancestry === 'custom' ? state.customRaceName.trim() || '自定义种族' : ancestries[state.ancestry][0];
    return `<div class="figure-stage" id="portrait">
      <div class="figure-caption"><span>${esc(name)}人像</span><small>点击标点编辑属性</small></div>
      ${renderPortraitSvg(calc.totals, portrait)}
      <details class="portrait-adjustments" data-detail="portrait-settings"><summary>调整身高与体型</summary><div class="portrait-controls">
        ${Object.entries(portraitFields).map(([key, {label, unit, min, max}]) => `<div class="portrait-field">
          <label for="portrait-${key}">${label}</label><output for="portrait-${key}">${portrait[key]}${unit}</output>
          <input type="range" id="portrait-${key}" data-portrait="${key}" min="${min}" max="${max}" value="${portrait[key]}"
            aria-valuetext="${portrait[key]}${unit}">
        </div>`).join('')}
        <div class="portrait-footer"><span>外观预设，可自由调整</span>
          <button type="button" data-action="reset-portrait" data-focus="reset-portrait">恢复种族预设</button></div>
      </div></details>
    </div>`;
  }

  function renderScore(calc, i, remaining) {
    const name = attrs[i];
    const [min, max] = scoreRange(state);
    const n = baseScores(state)[i];
    const save = calc.saveBonus(i);
    const cannotAdd = n === max || state.scoreMode === 'buy' && cost[n - 7] - cost[n - 8] > remaining;
    const growth = calc.totals[i] - n - calc.bonuses[i];
    const region = bodyRegions[i];
    const hasError = pointNotice && scoreErrorIndex === i;
    return `<article class="score-card" data-score="${i}" id="score-${i}">
      <div class="score-heading"><span class="score-pin">${i + 1}</span><strong>${name}</strong><small>${abilityCodes[i]}</small></div>
      <p class="score-region">${region.part} · ${region.hint}</p>
      <div class="score-result"><output aria-label="${name}总值">${calc.totals[i]}</output>
        <span>调整 ${sign(calc.mods[i])}</span><span>豁免 ${sign(save)}</span></div>
      <div class="score-adjust">
        <button type="button" data-adjust="-1" data-index="${i}" data-focus="minus-${i}" aria-label="${name}减一"${n === min ? ' disabled' : ''}>−</button>
        <input type="number" inputmode="numeric" min="${min}" max="${max}" step="1" value="${n}"
          data-score-input="${i}" data-focus="score-${i}" aria-label="${name}购点原值"${hasError ? ` aria-describedby="score-error-${i}"` : ''}>
        <button type="button" data-adjust="1" data-index="${i}" data-focus="plus-${i}" aria-label="${name}加一"${cannotAdd ? ' disabled' : ''}>+</button>
      </div><div class="score-meta"><span>${state.scoreMode === 'buy' ? '购点 ' + cost[n - 8] + ' 点' : '手填原值'}</span>
        <span>种族 ${sign(calc.bonuses[i])}${growth ? ' · 成长 ' + sign(growth) : ''}</span></div>
      ${hasError ? `<p class="notice point-notice" id="score-error-${i}" role="status">${esc(pointNotice)}</p>` : ''}
    </article>`;
  }

  function spellChoices(job, level, subclass) {
    const spell = spellTrack(job, level, subclass);
    if (!spell) return [];
    const previous = spellTrack(job, level - 1, subclass);
    const cantrips = spell.cantrips - (previous?.cantrips ?? 0);
    const known = spell.known - (previous?.known ?? 0);
    const result = [];
    if (cantrips > 0) result.push('选 ' + cantrips + ' 个新戏法' + (job === 'rogue' && level === 3 ? '（含法师之手）' : '') + '。');
    if (known > 0) result.push('选 ' + known + ' 个新法术' + (job === 'bard' && [10,14,18].includes(level) ? '（含魔法奥秘）' : '') + '。');
    if (previous && spell.known) result.push('可替换一个已知法术。');
    if (job === 'wizard') result.push(level === 1 ? '在法术书记录 6 个 1 环法术。' : '在法术书增加 2 个法术。');
    if (spell.prepared && (!previous || spell.slots.length > previous.slots.length)) result.push('按当前法术位更新准备法术。');
    return result;
  }

  function levelNotes(level, subclass) {
    const job = state.job;
    const track = activeTrack(state);
    const notes = [];
    if (track.choices?.[level] && track.choices[level] !== '选一种战斗风格。') notes.push(track.choices[level]);
    if (job === 'custom') notes.push('按原书填写本级获得的特性与选项。');
    const subclassChoices = subclassDecisions[subclass]?.[level];
    if (subclassChoices) notes.push(subclassChoices);
    if (job !== 'rogue' && subclass && track.sub.includes(level) && !subclassRecord(job, subclass)?.features?.[level] && !subclassChoices) {
      notes.push('查看所选子职的本级规则，补记特性或选项。');
    }
    if (job === 'rogue' && level === 3 && subclass === '鬼魅') notes.push('临时熟练也可以选工具，在这里补记。');
    if (job === 'rogue' && track.sub.includes(level) && subclass && subclass !== subs[state.subclass]?.name) notes.push('按来源录入子职特性。');
    return notes.concat(spellChoices(job, level, subclass));
  }

  function levelFeatures(level, subclass) {
    const job = state.job;
    const track = activeTrack(state);
    const entries = [];
    if (job === 'rogue') {
      if (!track.sub.includes(level) && !activeImprovements(state).includes(level)) entries.push(baseFeatures[level]);
      if (track.sub.includes(level) && subclass) {
        const detail = chosenSubclass(state) === subs[state.subclass]?.name ? subs[state.subclass].features[level] : null;
        entries.push(detail ?? [subclass + ' · 子职特性', '见该等级的手动记录。']);
      }
      if (level > 1 && level % 2) entries.push(['偷袭增至 ' + Math.ceil(level / 2) + 'd6', '']);
    } else {
      if (track.features[level]) entries.push([track.features[level], '']);
      if (track.sub.includes(level) && subclass) {
        const feature = subclassRecord(job, subclass)?.features?.[level];
        entries.push([feature || subclass + ' · 子职特性', feature ? subclass : '按所选路线的原书条目执行。']);
      }
      if (track.expertise?.includes(level)) entries.push(['再选两项技能专精', '']);
    }
    if (activeImprovements(state).includes(level)) entries.push(['属性值提升 / 专长', '可把一项属性加 2，或把两项各加 1。普通属性提升上限 20。DM 开放专长时可改选专长。']);
    if (level > 1 && proficiencyAt(level) !== proficiencyAt(level - 1)) entries.push(['熟练加值升至 ' + sign(proficiencyAt(level)), '']);
    const current = spellTrack(job, level, subclass);
    if (current && current.slots !== spellTrack(job, level - 1, subclass)?.slots) entries.push([current.pact ? '契约法术位增加或升环' : '法术位增加', '']);
    return entries;
  }

  function levelHasChoices(level) {
    const track = activeTrack(state);
    const subclass = level >= track.sub[0] ? chosenSubclass(state) : '';
    return level === 1 || level === track.sub[0] || track.expertise?.includes(level) ||
      activeImprovements(state).includes(level) || levelNotes(level, subclass).length ||
      activeDecisions(state, level).some(choice => choice.level === level) ||
      classStyleOptions(state.job).length && level === styleLevel(state.job);
  }

  function renderLevels(calc, opened) {
    const {actualLevel, level: current, levelCap} = state;
    const track = activeTrack(state);
    const unlock = track.sub[0];
    const planned = chosenSubclass(state);
    const pending = growthLevels.filter(level => level <= current && levelPending(calc, level));
    const nodes = growthLevels.slice(0, levelCap).map(level => {
        const selected = current === level;
        const expanded = selected && growthExpanded;
        const featureNames = levelFeatures(level, level >= unlock ? planned : '').map(([name]) => name);
        if (level === unlock) featureNames.unshift(planned ? `子职 · ${planned}` : `选择${track.title === '游荡者范型' ? '子职' : track.title}`);
        const status = level === actualLevel ? '实际等级' : selected ? '预览中' : pending.includes(level) ? '待选择' : levelHasChoices(level) ? '有选择' : '';
        const milestone = level === unlock ? '子职' : activeImprovements(state).includes(level) ? '属性 / 专长' : levelHasChoices(level) ? '本级选择' : '';
        return `<li class="growth-node"><button type="button" class="growth-node-button" data-level-pick="${level}" data-growth-node data-focus="level-${level}"
          aria-expanded="${expanded}" aria-controls="growth-current-branch"${selected ? ' aria-current="step"' : ''}>
          <span class="growth-rank">${level} 级</span>${status ? `<span class="growth-node-status">${status}</span>` : ''}
          <span class="growth-node-title">${esc(featureNames.slice(0, 2).join(' · ') || '生命上限成长')}</span>
        </button>${milestone ? `<span class="growth-milestone" aria-hidden="true">${milestone}</span>` : ''}</li>`;
    }).join('');
    return `<section class="level-navigation panel" id="level-navigation" aria-labelledby="level-title">
      <div class="section-head"><h3 id="level-title" tabindex="-1">成长树</h3>
        <div class="level-selectors"><label class="growth-cap">预览等级<select data-preview-level data-focus="preview-level">${growthLevels.slice(0, levelCap).map(level => `<option value="${level}"${level === current ? ' selected' : ''}>${level} 级${level === actualLevel ? ' · 实际' : ''}</option>`).join('')}</select></label>
        <label class="growth-cap">团的等级上限<select data-level-cap data-focus="level-cap">${growthLevels.map(level => `<option value="${level}"${level === levelCap ? ' selected' : ''}${level < actualLevel ? ' disabled' : ''}>${level} 级${level === 6 ? ' · 短团' : level === 15 ? ' · 长团' : level === 20 ? ' · 完整路线' : ''}</option>`).join('')}</select></label></div></div>
      <div class="growth-map-nav"><button type="button" data-growth-scroll="-1" aria-label="向左浏览成长树" aria-controls="growth-map">←</button>
        <button type="button" data-growth-scroll="1" aria-label="向右浏览成长树" aria-controls="growth-map">→</button></div>
      <div class="growth-map" id="growth-map" tabindex="0" role="region" aria-label="横向成长路线">
        <ol class="growth-track"><li class="growth-tree-root"><strong>${esc(classSpec(state)[0])}${planned ? ' · ' + esc(planned) : ''}</strong><span>1–${levelCap} 级 · 实际 ${actualLevel} 级</span></li>${nodes}</ol>
      </div>
      <div id="growth-current-branch" class="growth-node-branch"${growthExpanded ? '' : ' hidden'}>${growthExpanded ? renderPlan(calc, opened) : ''}</div>
    </section>`;
  }

  function revealGrowthNode(level) {
    const map = root.querySelector('#growth-map');
    const node = map?.querySelector(`[data-level-pick="${level}"]`);
    if (!node || !map.clientWidth) return;
    const viewport = map.getBoundingClientRect();
    const card = node.getBoundingClientRect();
    if (card.left < viewport.left || card.right > viewport.right) {
      map.scrollTo({left: map.scrollLeft + card.left - viewport.left - 12, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    }
  }

  function levelPending(calc, level) {
    const track = activeTrack(state);
    const stage = calc.stages.get(level);
    const step = planStep(state, level);
    const subclass = level >= track.sub[0] ? calc.subclass : '';
    const baseIncomplete = level === 1 && (state.backgroundSkills.some(skill => !skill) || state.jobSkills.length < classSpec(state)[3] ||
      state.job === 'rogue' && state.expertise.filter(Boolean).length < 2);
    return baseIncomplete || level === track.sub[0] && !subclass ||
      track.expertise?.includes(level) && stage.extraExpertise.length < 2 ||
      activeImprovements(state).includes(level) && !stage.applied ||
      level === styleLevel(state.job) && classStyleOptions(state.job).length && !step.style ||
      level === 3 && calc.rogueSub === 'mastermind' &&
        (!step.game || !step.language1 || !step.language2 || step.language1 === step.language2 ||
          calc.languages.includes(step.language1) || calc.languages.includes(step.language2)) ||
      levelNotes(level, subclass).some(note => !note.startsWith('可替换')) && !step.note.trim();
  }

  const planField = (key, label, options, value) => branchField('plan.' + key, label, options, value);

  function renderImprovements(step, stage) {
    const used = step.asi.reduce((sum, n) => sum + n, 0);
    const ids = [['', '属性值提升'], ...feats.map(f => [f.id, f.name, f.book]),
      ...Object.entries(manualFeats).map(([id, f]) => [id, f.name, sourceLabel(f.path)]), ['custom', '手填其他专长']];
    const featField = planField('feat', '属性提升或专长', ids, step.feat);
    if (state.level === 1 && state.ancestry === 'variantHuman' && !step.feat) return featField + '<p class="hint">变体人类在此选择一个起始专长。</p>';
    const manual = manualFeats[step.feat];
    if (step.feat === 'custom' || manual) {
      return featField + `<p class="hint">${manual ? '点开专长选项的「详情」确认前提和效果。' : '按采用的规则确认专长前提。'}如有属性 +1，可在这里选择。其他效果记在本级补记。</p>` +
        planField('stat', '额外属性 +1（如适用）', [[-1, '无'], ...abilityOptions], step.stat);
    }
    if (step.feat) {
      const feat = featMap[step.feat];
      const field = feat.stats ? planField('stat', '提升属性 +1', feat.stats.map(i => [i, attrs[i]]), step.stat) : '';
      const prof = step.feat === 'expert' ? planField('featSkill', '新增技能熟练', skillNames.filter(skill => !stage.proficiencies.includes(skill)), step.featSkill) +
        planField('featExpert', '新增技能专精', [...new Set([...stage.proficiencies, step.featSkill].filter(skill => skill && !stage.expertise.includes(skill)))], step.featExpert) : '';
      return featField + `<p class="hint">${esc(feat.desc)}</p>` + field + prof;
    }
    return featField + `<h4 id="asi-title" class="choice-group-heading">分配属性提升点数</h4>
      <div class="asi-grid" role="group" aria-labelledby="asi-title">${attrs.map((name, i) => `<div class="asi-cell">
      <span>${name} <strong>+${step.asi[i]}</strong></span><div>
      <button type="button" data-asi-index="${i}" data-asi-delta="-1" data-focus="asi-${i}-minus"
        aria-label="撤回${name}提升"${step.asi[i] ? '' : ' disabled'}>−</button>
      <button type="button" data-asi-index="${i}" data-asi-delta="1" data-focus="asi-${i}-plus"
        aria-label="提升${name}"${used < 2 && stage.totals[i] + step.asi[i] < 20 ? '' : ' disabled'}>+</button></div></div>`).join('')}</div>
      <p class="hint">已分配 ${used} / 2。两点分完后计入顶部数值。</p>`;
  }

  function renderPlan(calc, opened) {
    const {level, job} = state;
    const track = activeTrack(state);
    const step = planStep(state, level);
    const stage = calc.stages.get(level);
    const improves = activeImprovements(state).includes(level) || level === 1 && state.ancestry === 'variantHuman' && state.rules.variantHuman;
    const atSubclass = level === track.sub[0];
    const options = [];
    if (level === 1) options.push('<button type="button" data-workbench-task="home">编辑 1 级建卡选择</button>');
    if (atSubclass && job === 'rogue') {
      options.push(branchButton('plan-subclass', '选择或比较子职', calc.subclass || '展开游荡者子职', 'subclass'));
    } else if (atSubclass) {
      const subclasses = subclassNames(job);
      if (subclasses.length) options.push(planField('subclassName', track.title, subclasses, calc.subclass));
    }
    if (track.expertise?.includes(level)) {
      const pool = [...stage.proficiencies, ...(job === 'rogue' ? ['盗贼工具'] : [])].filter(skill => !stage.expertise.includes(skill));
      options.push(skillBranch('plan.expertise', '新增专精', pool, stage.extraExpertise, 2, []));
    }
    if (improves) options.push(renderImprovements(step, stage));
    if (classStyleOptions(job).length && level === styleLevel(job)) {
      options.push(planField('style', '战斗风格', classStyleOptions(job), step.style));
    }
    if (level === 3 && calc.rogueSub === 'mastermind') {
      options.push(planField('game', '游戏套组', games, step.game));
      for (const field of ['language1', 'language2']) {
        const other = field === 'language1' ? step.language2 : step.language1;
        const optionsForLanguage = langs.filter(language => !calc.languages.includes(language) && language !== other);
        options.push(planField(field, field === 'language1' ? '第一种额外语言' : '第二种额外语言', optionsForLanguage, step[field]));
      }
    }
    if (level === 3 && calc.rogueSub === 'phantom') {
      options.push(planField('phantomSkill', '亡者余声 · 临时技能熟练', [['', '清空 / 选择工具时补记'],
        ...skillNames.filter(skill => !stage.proficiencies.includes(skill))], step.phantomSkill));
    }
    const base = levelFeatures(level, calc.subclass);
    const richer = [...(coreRules.classFeatures[job]?.[level] ?? []), ...(coreRules.subclassFeatures[job]?.[calc.subclass]?.[level] ?? [])]
      .map(feature => [feature.name, feature.desc]);
    const features = richer.length ? [...richer, ...base.filter(([title]) => /偷袭增至|熟练加值升至|属性值提升|法术位增加/.test(title) && !richer.some(([name]) => name === title))] : base;
    const notes = levelNotes(level, calc.subclass);
    const spell = spellTrack(job, level, calc.subclass);
    const source = subclassRecord(job, calc.subclass)?.url;
    const classRule = job === 'custom' ? '' : job === 'artificer' ? src('塔莎的万事坩埚/玩家选项/职业/奇械师.html') :
      job === 'bloodhunter' ? src('第三方/血猎手/血猎手.htm') : src('玩家手册/职业/' + classSpec(state)[0] + '.html');
    const die = classSpec(state)[1];
    const hasCustomFeat = improves && step.feat === 'custom';
    const formValue = key => esc(growthDrafts.get(draftKey())?.[key] ?? step[key] ?? '');
    return `<section class="panel growth-panel" id="level-detail" aria-labelledby="level-detail-title">
      <div class="section-head"><div><span class="eyebrow">LEVEL ${String(level).padStart(2, '0')}</span>
        <h2 id="level-detail-title" tabindex="-1">${level} 级新增与选择</h2></div>
        <div class="level-nav-actions"><button type="button" data-level-pick="${level - 1}" data-focus="prev-level"${level === 1 ? ' disabled' : ''}>← 上一级</button>
          <button type="button" data-level-pick="${level + 1}" data-focus="next-level"${level === state.levelCap ? ' disabled' : ''}>下一级 →</button></div></div>
      ${renderChoicePath(['成长', classSpec(state)[0], `${level} 级`])}
      <div class="growth-columns" data-transition-panel="growth" data-transition-key="${job}:${level}">
        <div class="growth-features"><h3>本级变化</h3>
          ${features.length ? features.map(([title, detail]) => `<div class="growth-feature"><strong>${esc(title)}</strong>${detail ? `<p>${esc(detail)}</p>` : ''}</div>`).join('') : '<p class="hint">本级没有新的固定职业特性。</p>'}
          ${level > 1 ? `<p class="hint">生命上限增加 ${Math.max(1, (step.hpDie ?? calc.defaultDie) + calc.mods[2])} 点（生命骰结果 + 当前体质，至少 1；额外加值另计）。</p>` : ''}
          ${spell ? `<p class="hint">${spell.pact ? '契约法术位' : '法术位'} · ${Array.from(spell.slots, (count, i) => +count ? (i + 1) + ' 环 × ' + count : '').filter(Boolean).join(' · ')}</p>` : ''}
          ${classRule ? `<p class="hint">${linkTo(classRule, '查阅职业来源 ↗')}${source ? ' · ' + linkTo(source, '查阅子职来源 ↗') : ''}</p>` : ''}
        </div>
        <div class="growth-editor"><h3>本级要做什么</h3>${renderCoreDecisions(calc)}
          ${hasSpellTasks(calc.core.spells) ? `<div class="level-spell-actions">
            ${spellJumpButtons(calc.core.spells)}
            <button type="button" data-workbench-task="spells">查看法术</button></div>` : ''}
          ${options.length ? `<h4 id="growth-options-title" class="choice-group-heading">本级可选项目</h4>
            <div class="level-options" role="group" aria-labelledby="growth-options-title">${options.join('')}</div>` : ''}
          ${stage.error ? `<p class="point-notice" role="status">${esc(stage.error)}</p>` : ''}
          ${notes.length ? `<ul class="level-checklist">${notes.map(note => `<li>${esc(note)}</li>`).join('')}</ul>` :
            !options.length ? '<p class="hint">本级可直接升级，也可以记录掷骰与团规选项。</p>' : ''}
          <details data-detail="growth-notes"${opened.has('growth-notes') ? ' open' : ''}><summary>手动记录与掷骰</summary><form class="growth-form" data-form="growth">
            ${atSubclass ? `<label>${job === 'rogue' ? '手填其他子职（留空使用上方选择）' : '子职名称（可手填扩展）'}
              <input name="subclassName" maxlength="90" value="${formValue('subclassName')}" placeholder="例如书上没有列出的子职"></label>` : ''}
            ${level > 1 ? `<label>本级生命骰结果（1–${die}，可留空）
              <input type="number" inputmode="numeric" min="1" max="${die}" name="hpDie" value="${formValue('hpDie')}" placeholder="默认固定值 ${calc.defaultDie}"></label>` : ''}
            ${hasCustomFeat ? `<label>手填专长名称<input name="customFeat" maxlength="90" value="${formValue('customFeat')}"></label>` : ''}
            <label>本级补记<textarea name="note" maxlength="800" rows="3" placeholder="写下法术、工具、专长效果、子职选项或团规……">${formValue('note')}</textarea></label>
            <button type="submit">保存本级记录</button>
          </form></details>
        </div>
      </div>
      ${branchKey ? renderBranch(calc, opened) : ''}
    </section>`;
  }

  function renderUnlocked(calc) {
    const rows = growthLevels.slice(0, state.level).flatMap(level => {
      const subclass = level >= activeTrack(state).sub[0] ? calc.subclass : '';
      const coreFeatures = coreRules.classFeatures[state.job]?.[level] ?? [];
      const subclassFeatures = coreRules.subclassFeatures[state.job]?.[subclass]?.[level] ?? [];
      const entries = coreFeatures.length || subclassFeatures.length ? [...coreFeatures, ...subclassFeatures].map(feature => [feature.name, feature.desc]) : levelFeatures(level, subclass);
      const feat = planStep(state, level);
      if (calc.stages.get(level).applied && feat.feat) {
        entries.push([feat.feat === 'custom' ? feat.customFeat : (featMap[feat.feat] ?? manualFeats[feat.feat]).name, '已选专长']);
      }
      if (feat.note.trim()) entries.push(['手填记录', feat.note]);
      return entries.map(([name, detail]) => `<li><small>${level} 级</small><div><strong>${esc(name)}</strong>${detail ? `<p>${esc(detail)}</p>` : ''}</div></li>`);
    });
    return `<section class="sheet-section" aria-labelledby="sheet-abilities">
      <h4 id="sheet-abilities" tabindex="-1">已解锁能力与成长 · ${rows.length} 项</h4><ul class="unlocked-list">${rows.join('')}</ul>
    </section>`;
  }

  function renderOverview(calc) {
    const cls = classSpec(state);
    const casting = spellTrack(state.job, state.level, calc.subclass);
    const spells = spellLabels(calc.core.spells);
    const showSpells = hasSpellTasks(calc.core.spells);
    const ancestry = state.ancestry === 'custom' && state.customRaceName.trim() ? state.customRaceName.trim() : ancestries[state.ancestry][0];
    const equipment = calc.core.inventory.map(({id, quantity}) => coreRules.items[id].name + (quantity > 1 ? ' × ' + quantity : ''));
    const customAttack = state.weaponName.trim() ? `<strong>${esc(state.weaponName.trim())}</strong>
      <span>命中 ${sign(calc.mods[state.attackAbility] + (state.attackTraining ? calc.pb : 0))}</span>
      ${state.weaponDie.trim() ? `<span>伤害 ${esc(state.weaponDie.trim())}（属性调整 ${sign(calc.mods[state.attackAbility])}）</span>` : ''}` : '';
    const coreAttack = calc.core.attack ? `<strong>${esc(calc.core.attack.name)}</strong><span>命中 ${sign(calc.core.attack.hit)}</span><span>伤害 ${esc(calc.core.attack.damage)}</span>` : '';
    const attack = customAttack || coreAttack || (state.job === 'rogue' ? `<strong>${weapons[state.weapon][0]}</strong>
      <span>命中 ${sign(calc.pb + calc.mods[1])}</span><span>伤害 ${weapons[state.weapon][1]}${sign(calc.mods[1])} 穿刺</span>` : '');
    const sneak = calc.sneak ? `<span>符合条件时偷袭 +${calc.sneak}d6</span>` : '';
    const spellStats = casting ? `<p class="attack-line"><strong>施法 · ${attrs[casting.stat]}</strong>
      <span>法术命中 ${sign(calc.pb + calc.mods[casting.stat])}</span><span>法术豁免 DC ${8 + calc.pb + calc.mods[casting.stat]}</span></p>` : '';
    return `<section class="builder-section overview panel" aria-labelledby="overview-title">
      <header class="overview-heading"><div>
        <h3 id="overview-title" tabindex="-1">${state.name.trim() ? userText(state.name.trim()) : '未命名角色'}</h3><p>${esc(CharacterLocale.text(state.level + ' 级'))} ${state.job === 'custom' && state.customClassName.trim() ? userText(cls[0]) : esc(cls[0])}${calc.subclass ? ' · ' + esc(calc.subclass) : ''} · ${state.ancestry === 'custom' && state.customRaceName.trim() ? userText(ancestry) : esc(ancestry)} · ${state.background === 'custom' && state.backgroundName.trim() ? userText(backgroundName()) : esc(backgroundName())}</p></div>
        <button type="button" data-workbench-task="scores">编辑属性</button></header>
      <nav class="sheet-jumps" aria-label="角色卡章节">
        <button type="button" data-sheet-jump="sheet-skills">技能</button>
        <button type="button" data-sheet-jump="sheet-gear">装备</button>
        <button type="button" data-sheet-jump="sheet-abilities">能力</button>
        ${showSpells ? '<button type="button" data-sheet-jump="sheet-spells">法术</button>' : ''}
      </nav>
      ${attack ? `<p class="attack-line">${attack}${sneak}</p>` : ''}${spellStats}
      <dl class="skill-numbers" aria-label="属性豁免">${attrs.map((name, i) =>
        `<div><dt>${name}豁免</dt><dd>${sign(calc.saveBonus(i))}</dd></div>`).join('')}</dl>
      <section class="sheet-section" aria-labelledby="sheet-skills"><h4 id="sheet-skills" tabindex="-1">技能与熟练</h4><dl class="skill-numbers">${skillNames.map(skill => {
        const rank = calc.expertise.has(skill) ? '专精' : calc.proficiencies.has(skill) ? '熟练' : '';
        return `<div class="${rank ? 'is-trained' : ''}"><dt>${skill}${rank ? ` <small>${rank}</small>` : ''}</dt><dd>${sign(calc.skillBonus(skill))}</dd></div>`;
      }).join('')}</dl>${renderProficiencySummary(calc)}</section>
      <section class="sheet-section" aria-labelledby="sheet-gear"><div class="section-head">
        <h4 id="sheet-gear" tabindex="-1">装备</h4><button type="button" data-workbench-task="armor">编辑装备</button></div>
        <p>护甲 · ${esc(armors[calc.core.equipment.armor][0])}${calc.core.equipment.shield ? ' · 盾牌' : ''} · 可用金币 ${calc.core.gold} gp</p>
        ${equipment.length ? `<p>${esc(equipment.join('、'))}</p>` : ''}${state.gear.trim() ? `<p>${userText(state.gear.trim())}</p>` : ''}
      </section>
      ${showSpells ? `<section class="sheet-section" aria-labelledby="sheet-spells"><div class="section-head">
        <h4 id="sheet-spells" tabindex="-1">法术 · ${spells.length} 项</h4><button type="button" data-workbench-task="spells">管理法术</button></div>
        ${spells.length ? `<ul class="hud-spell-list">${spells.map(({spell, labels}) =>
          `<li>${hudSpellDisclosure(spell, [spellRingName(spell.level), ...labels], calc)}</li>`).join('')}</ul>` : '<p>尚未选择法术。</p>'}
      </section>` : ''}
      ${renderUnlocked(calc)}
    </section>`;
  }

  function renderAttributeEditor(calc, opened) {
    const remaining = 27 - spent(state.base);
    return `<section class="builder-section overview panel" id="point-buy" aria-label="编辑属性">
      <div class="score-modes">
        <button type="button" data-score-mode="buy" aria-pressed="${state.scoreMode === 'buy'}" data-focus="mode-buy">27 点购点</button>
        <button type="button" data-score-mode="manual" aria-pressed="${state.scoreMode === 'manual'}" data-focus="mode-manual">手动原值</button>
      </div>
      <p class="hint score-guide">${state.scoreMode === 'buy' ? '原值 8–15。加减、键入，或在下方一次填六项。' : '原值 3–18，可填掷骰结果。种族和升级加值会另外计入。'}</p>
      <div class="figure-board">${attrs.map((_, i) => renderScore(calc, i, remaining)).join('')}${renderFigure(calc)}</div>
      <details data-detail="batch-entry"${opened.has('batch-entry') ? ' open' : ''}><summary>整组录入原值</summary><form class="batch-form" data-form="point-buy">
        <label>整组录入原值 <span class="hint">力量、敏捷、体质、智力、感知、魅力</span>
          <input name="scores" data-focus="batch-scores" value="${esc(batchText)}" placeholder="${baseScores(state).join(' ')}" autocomplete="off">
        </label>
        <button type="submit">应用六项</button>
        ${state.scoreMode === 'manual' ? '<button type="button" data-action="standard-array">填入标准数组</button>' : ''}
      </form>
      <p class="notice point-notice" id="batch-notice" role="status">${scoreErrorIndex === null ? esc(pointNotice) : ''}</p></details>
    </section>`;
  }

  function renderTaskHome(calc, opened) {
    const spells = calc.core.spells;
    const spellCount = spellLabels(spells).length;
    const taskIcons = {ancestry: 'person', job: 'sword', scores: 'fist', background: 'scroll', armor: 'pack', spells: 'wand', treeLevel: 'stairs'};
    const {actualLevel, level, levelCap} = state;
    const position = rank => ((rank - 1) / Math.max(1, levelCap - 1)) * 100 + '%';
    const ticks = [...new Set([1, ...[5, 10, 15].filter(rank => rank <= levelCap - 3), levelCap])];
    const levelRuler = `<span class="task-level-ruler" aria-hidden="true">
      <span class="task-level-fill" style="width:${position(actualLevel)}"></span>
      <span class="task-level-marker" style="left:${position(actualLevel)}"></span>
      ${level !== actualLevel ? `<span class="task-level-marker is-preview" style="left:${position(level)}"></span>` : ''}
      ${ticks.map((rank, index) => `<span class="task-level-tick" style="left:${position(rank)}"${index === 0 ? ' data-first' :
        index === ticks.length - 1 ? ' data-last' : ''}>${rank}</span>`).join('')}
    </span>`;
    const rows = [
      ['ancestry', '选种族、语言与加值', state.pendingIdentity.includes('ancestry') ? '待选种族' : ancestries[state.ancestry][0]],
      ['job', '选职业、子职与技能', state.pendingIdentity.includes('job') ? '待选职业' : classSpec(state)[0], !state.pendingIdentity.includes('job') && state.job === 'custom' && state.customClassName.trim()],
      ['scores', '购点或手动录入', state.scoreMode === 'buy' ? '剩余 ' + (27 - spent(state.base)) + ' 点' : '手动原值'],
      ['background', '选背景与熟练', state.pendingIdentity.includes('background') ? '待选背景' : backgroundName(), !state.pendingIdentity.includes('background') && state.background === 'custom' && state.backgroundName.trim()],
      ['armor', '选起始装备、穿戴或购买', missingEquipmentBranch() ? '起始装备待选' : armors[calc.core.equipment.armor][0]],
      ['spells', '学法术、准备与安排法术位', hasSpellTasks(spells) ? '已记录 ' + spellCount + ' 项法术' : '当前等级无可用法术'],
      ['treeLevel', '查看成长和规划等级', '实际 ' + state.actualLevel + ' 级' + (state.level === state.actualLevel ? '' : ' · 预览 ' + state.level + ' 级')],
    ];
    const renderTask = ([key, description, value, custom]) => `<button type="button" class="task-entry${key === 'treeLevel' ? ' task-entry-leveling' : ''}"
      data-workbench-task="${key}" data-focus="task-${key}">
      <span class="task-entry-icon">${hudIcon(taskIcons[key])}</span>
      <span class="task-entry-copy"><strong>${taskNames[key]}</strong>
        <span class="task-value"${custom ? ' data-user-text' : ''}>${esc(value)}</span><small>${description}</small></span>
      <span class="task-entry-arrow">${hudIcon('arrow')}</span>
      ${key === 'treeLevel' ? levelRuler : ''}
    </button>`;
    return `<section class="task-home" aria-labelledby="task-title">
      <div class="task-home-heading">
        <h2 id="task-title" tabindex="-1">建卡任务</h2>
        <button type="button" class="starter-guide-link" data-workbench-task="starter" data-focus="task-starter">新手指南</button>
      </div>
      ${state.starterExample ? `<div class="starter-intro"><span>1 级人类战士示例 · 可直接编辑</span>
        <button type="button" data-action="new-blank">从空白建卡</button></div>` : ''}
      <nav class="task-tiles" aria-label="建卡任务">
        <div class="task-chapters">${rows.slice(0, -1).map(renderTask).join('')}</div>
        ${renderTask(rows.at(-1))}
      </nav>
      <nav class="task-resources" aria-label="角色卡与规则">
        <button type="button" data-workbench-task="sheet" data-focus="task-sheet">查看角色卡</button>
        <button type="button" data-workbench-task="tree" data-focus="task-tree">完整选择树</button>
        <button type="button" data-workbench-task="rules" data-focus="task-rules">规则参考</button>
        <button type="button" data-workbench-task="shortcuts" data-focus="task-shortcuts">快捷键</button>
      </nav>
      ${renderGuide(calc, opened)}
    </section>`;
  }

  function renderTaskNavigation(calc) {
    if (activeTask === 'home') return '';
    const taskLinks = keys => keys.map(key => `<button type="button" data-workbench-task="${key}" data-focus="nav-${key}"${activeTask === key ? ' aria-current="page"' : ''}>${taskNames[key]}</button>`).join('');
    return `<nav class="workbench-nav" aria-label="页面导航">
      <button type="button" class="primary task-return" data-workbench-task="home">← 返回首页</button>
      <button type="button" class="compact-task-toggle" data-action="task-menu" data-focus="task-menu"
        aria-controls="workbench-task-links" aria-expanded="false" aria-label="切换页面，当前为${taskNames[activeTask]}">
        <span>${taskNames[activeTask]}</span><span aria-hidden="true">▾</span></button>
      <div class="workbench-nav-links" id="workbench-task-links">
        <div class="workbench-nav-tasks">${taskLinks(editorTasks)}</div>
        <div class="workbench-nav-references">${taskLinks(referenceTasks)}</div>
      </div>
      <button type="button" class="compact-stats" data-action="full-stats" data-focus="full-stats" aria-haspopup="dialog"
        aria-label="查看${state.level === state.actualLevel ? '完整' : state.level + ' 级预览'}数值，HP ${calc.hp}，AC ${calc.ac}">
        <span>HP <strong>${calc.hp}</strong></span><span>AC <strong>${calc.ac}</strong></span>
        ${state.level === state.actualLevel ? '<span aria-hidden="true">▾</span>' : '<small class="compact-preview">预览</small>'}
      </button>
    </nav>`;
  }

  function renderShortcuts() {
    const key = name => `<kbd>${name}</kbd>`;
    const shiftClick = key('Shift') + ' + <span>点击</span>';
    const undo = key('Ctrl') + ' + ' + key('Z') + ' / ' + key('⌘') + ' + ' + key('Z');
    const groups = [
      ['选择与编辑', [
        ['<span>双击</span> / ' + shiftClick + ' / ' + key('Enter'), '快速应用选项。可多选的项目用同样方式加入或移除。'],
        ['<span>双击角色名</span>', '编辑角色名称。'],
        [undo, '撤销最近一次可撤销的修改。'],
      ]],
      ['导航与搜索', [
        [key('/'), '定位到当前选项列表或装备商店的搜索框。'],
        [key('?'), '打开快捷键页。'],
        [key('Esc'), '收起预览或关闭当前窗口。'],
      ]],
      ['成长树', [
        [key('←') + ' / ' + key('→'), '在成长树的等级节点间移动焦点。'],
        [key('Enter'), '预览聚焦的等级。'],
      ]],
    ];
    return `<div class="shortcut-page">
      <div class="shortcut-groups">${groups.map(([title, rows]) => `<section class="panel shortcut-group">
        <h3>${title}</h3><dl>${rows.map(([keys, description]) => `<div><dt>${keys}</dt><dd>${description}</dd></div>`).join('')}</dl>
      </section>`).join('')}</div>
      <label class="check shortcut-setting"><input type="checkbox" data-single-key-shortcuts${singleKeyShortcuts ? ' checked' : ''}>启用 / 和 ? 单键快捷键</label>
    </div>`;
  }

  function renderTaskContent(calc, opened) {
    if (activeTask === 'home') return renderTaskHome(calc, opened);
    const laneRenderers = {
      ancestry: () => renderAncestry(calc, opened),
      job: renderClass,
      background: () => renderBackground(calc, opened),
      armor: () => renderCoreEquipment(calc, opened),
    };
    let content;
    if (laneRenderers[activeTask]) {
      const fields = laneRenderers[activeTask]();
      const branch = branches.has(branchKey) ? renderBranch(calc, opened) : '';
      content = `<div class="task-editor${branch ? ' has-branch' : ''}">${fields}${branch}</div>`;
    } else if (activeTask === 'scores') content = renderAttributeEditor(calc, opened);
    else if (activeTask === 'treeLevel') content = renderLevels(calc, opened);
    else if (activeTask === 'sheet') content = renderOverview(calc);
    else if (activeTask === 'spells') content = renderSpellTask(calc, opened);
    else if (activeTask === 'starter') content = renderStarterGuide();
    else if (activeTask === 'shortcuts') content = renderShortcuts();
    else if (activeTask === 'tree') {
      const lanes = Object.fromEntries(Object.entries(laneRenderers).map(([key, renderer]) => [key, renderer()]));
      lanes.treeLevel = lane('04', '升级规划', branchField('treeLevel', '预览等级', growthLevels.slice(0, state.levelCap)
        .map(level => [level, level + ' 级', levelHasChoices(level) ? '有待选项目' : '常规成长']), state.level) +
        '<button type="button" data-action="levels">打开升级</button>');
      content = renderChoiceTree(calc, opened, lanes);
    } else {
      content = renderCoverage() + `<section class="panel sheet-section"><h3>2014 规则来源与收录范围</h3>
        <p class="hint">支持 12 个旧版玩家手册职业、奇械师、第三方血猎手和手填职业的单职业成长。扩展种族按书区分版本，法术、未内建的种族与子职特性和团规可补记。</p>
        <p class="hint">${linkTo('https://5echm.kagangtuya.top/?page=%E7%8E%A9%E5%AE%B6%E6%89%8B%E5%86%8C%2F%E5%89%8D%E8%A8%80.htm', '中文旧版规则目录 ↗')}</p>
        <p class="hint">${linkTo(pointBuySource, '27 点购点')} · ${linkTo(classSource, '职业与生命值')} · ${linkTo(backgroundSource, '背景与熟练')}</p></section>`;
    }
    const next = state.pendingIdentity[0];
    const nextIdentity = next && ['ancestry','job','background'].includes(activeTask) && !state.pendingIdentity.includes(activeTask);
    return `<section class="task-view" data-active-task="${activeTask}" aria-labelledby="task-title">
      <h2 id="task-title" tabindex="-1">${taskNames[activeTask]}</h2>${nextIdentity ?
        `<button type="button" class="primary" data-workbench-task="${next}">下一步 · 选${taskNames[next]}</button>` : ''}${content}</section>`;
  }

  function render(view) {
    clearTimeout(optionRevealTimer);
    pendingPreviewButton = null;
    const growthScroll = view?.growthScroll ?? root.querySelector('#growth-map')?.scrollLeft ?? 0;
    const treeScroll = view?.treeScroll ?? root.querySelector('#full-tree-map')?.scrollLeft ?? 0;
    pendingScoreRender = false;
    if (!isRuleSubclass(branchKey)) subclassComparisonOpen = false;
    const focused = document.activeElement?.dataset.focus;
    const opened = view?.opened ?? new Set([...root.querySelectorAll('details[open][data-detail]')].map(node => node.dataset.detail));
    const previousPanels = new Map([...root.querySelectorAll('[data-transition-panel]')].map(node =>
      [node.dataset.transitionPanel, node.dataset.transitionKey]));
    const calc = calculate();
    branches.clear();
    const content = renderTaskContent(calc, opened);
    boardObserver.disconnect();
    root.innerHTML = `<main class="shell">
      <header class="masthead builder-title compact-header">
        <div class="character-heading">
          <span class="hint">D&amp;D 2014 建卡工作台${privateCopy ? ' · 私人' : ''}</span>
          <div class="character-name-row">
            <h1 data-character-name title="双击编辑角色名">${state.name.trim() ? userText(state.name.trim()) : '未命名角色'}</h1>
            <button type="button" class="edit-name" data-action="edit-name" aria-label="编辑角色名">${hudIcon('pen')}</button>
          </div>
          <form class="character-name-form" data-form="character-name" hidden>
            <input name="name" aria-label="角色名" maxlength="90" placeholder="输入角色名" value="${esc(state.name)}">
            <button type="submit" class="primary">保存</button>
            <button type="button" data-action="cancel-name">取消</button>
          </form>
        </div>
        <div class="header-actions">
          <button type="button" class="theme-trigger" data-action="theme" aria-label="配色" aria-haspopup="dialog" title="配色">${hudIcon('palette')}<span>配色</span></button>
          <button type="button" data-action="library" data-focus="library" aria-haspopup="dialog">设置</button>
          ${undoBuild ? '<button type="button" data-action="undo" aria-label="撤销上一次选择">撤销</button>' : ''}</div>
        <input type="file" accept=".json,application/json" data-archive-import hidden>
      </header>
      <div class="builder-body"${pageGuideIndex !== null ? ' data-page-guide-active' : ''}>
        <div class="workbench-top${activeTask === 'home' ? '' : ' has-task-nav'}">${renderStickyBoard(calc)}${renderTaskNavigation(calc)}</div>
        ${activeTask !== 'home' && (persistenceError || notice) ? `<p role="status" class="notice">${esc(persistenceError || notice)}</p>` : ''}
        ${content}
      </div>
      ${renderPageGuide()}
    </main>`;
    CharacterLocale.localize(root);
    const board = root.querySelector('.workbench-top');
    const growthMap = root.querySelector('#growth-map');
    if (growthMap) growthMap.scrollLeft = growthScroll;
    const treeViewport = root.querySelector('.full-tree-scroll');
    if (treeViewport) treeViewport.scrollLeft = treeScroll;
    positionBranchPreview(root.querySelector('#branch-panel'));
    measureWorkbench();
    syncPanButtons();
    boardObserver.observe(board.querySelector('.sticky-board'));
    const navigation = board.querySelector('.workbench-nav');
    if (navigation) boardObserver.observe(navigation);
    const tree = root.querySelector('[data-choice-tree]');
    if (tree) boardObserver.observe(tree);
    if (focused) [...root.querySelectorAll('[data-focus]')].find(el => el.dataset.focus === focused)?.focus({preventScroll: true});
    if (previousPanels.size) root.querySelectorAll('[data-transition-panel]').forEach(panel => {
      if (previousPanels.get(panel.dataset.transitionPanel) !== panel.dataset.transitionKey) animatePanel(panel, panel.dataset.transitionPanel === 'growth');
    });
    queuePageGuideHighlight();
  }

  function animatePanel(panel, vertical = false) {
    if (!panel || reducedMotion.matches) return;
    panel.animate([{opacity: 0.42, clipPath: vertical ? 'inset(0 0 45% 0)' : 'inset(0 8% 0 0)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)'}],
      {duration: 240, easing: 'ease-out'});
  }

  function reveal(selector, {focus = false, minVisible = 100} = {}) {
    const target = root.querySelector(selector);
    const board = root.querySelector('.workbench-top');
    if (!target || !board) return;
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent instanceof HTMLDetailsElement) parent.open = true;
    }
    const rect = target.getBoundingClientRect();
    const treeViewport = target.closest('.full-tree-scroll');
    if (treeViewport) {
      const viewport = treeViewport.getBoundingClientRect();
      if (rect.left < viewport.left || rect.left > viewport.right - Math.min(80, rect.width)) {
        treeViewport.scrollBy({left: rect.left - viewport.left - 6, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
      }
    }
    const top = rect.top;
    const belowBoard = Math.max(0, toolbarBottom(board)) + 12;
    if (top < belowBoard || top > window.innerHeight - minVisible) {
      window.scrollBy({top: top - pinnedHeight(board) - 12, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    }
    if (focus) {
      const focusTarget = target.matches('[tabindex="-1"], button, input, select') ? target : target.querySelector('[tabindex="-1"], .branch-option');
      focusTarget?.focus({preventScroll: true});
    }
  }

  function syncPanButtons() {
    for (const button of root.querySelectorAll('[data-growth-scroll], [data-tree-scroll]')) {
      const viewport = root.querySelector('#' + button.getAttribute('aria-controls'));
      if (!viewport) continue;
      const direction = Number(button.dataset.growthScroll ?? button.dataset.treeScroll);
      const remaining = viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft;
      button.setAttribute('aria-disabled', String(direction < 0 ? viewport.scrollLeft <= 1 : remaining <= 1));
    }
  }

  root.addEventListener('scroll', event => {
    if (event.target.id === 'growth-map' || event.target.id === 'full-tree-map') syncPanButtons();
  }, true);

  function setTaskMenu(open) {
    const nav = root.querySelector('.workbench-nav');
    if (!nav || !open && !nav.hasAttribute('data-menu-open')) return;
    nav.toggleAttribute('data-menu-open', open);
    root.querySelector('.task-view')?.toggleAttribute('inert', open);
    nav.querySelector('[data-action="task-menu"]').setAttribute('aria-expanded', String(open));
    if (!open) return;
    const links = nav.querySelector('#workbench-task-links');
    const bounds = nav.getBoundingClientRect();
    const below = window.innerHeight - bounds.bottom - 12;
    const above = bounds.top - 12;
    links.style.maxHeight = '';
    const openAbove = links.offsetHeight > below && above > below;
    nav.toggleAttribute('data-menu-above', openAbove);
    links.style.maxHeight = Math.max(0, Math.min(330, openAbove ? above : below)) + 'px';
  }

  root.addEventListener('focusout', event => {
    const nav = event.target.closest('.workbench-nav[data-menu-open]');
    if (nav && event.relatedTarget && !nav.contains(event.relatedTarget)) setTaskMenu(false);
  });

  function mergeStoredLibrary() {
    const raw = storage.getItem(libraryKey);
    if (!raw || raw === savedArchive) return false;
    const remote = CharacterLibrary.validate(JSON.parse(raw), normalize);
    const {library: merged, conflicts} = CharacterLibrary.merge(savedLibrary, library, remote);
    if (!merged.characters.length) {
      const entry = CharacterLibrary.record(createStarterBuild());
      merged.characters.push(entry);
      merged.activeId = entry.id;
    }
    const next = merged.characters.find(entry => entry.id === merged.activeId).build;
    const changed = merged.activeId !== library.activeId || !CharacterLibrary.sameBuild(next, state);
    library = merged;
    savedLibrary = remote;
    savedArchive = raw;
    if (changed) {
      state = structuredClone(next);
      undoBuild = null;
    }
    if (conflicts) notice = '两个标签页编辑了同一角色。已保留各自的更改，可在设置中查看。';
    return changed || Boolean(conflicts);
  }

  function commitLibrary() {
    try {
      const changed = mergeStoredLibrary();
      if (recoveryArchive) {
        storage.setItem(libraryKey + '/recovery', recoveryArchive);
        recoveryArchive = '';
      }
      const raw = JSON.stringify(library);
      storage.setItem(libraryKey, raw);
      savedArchive = raw;
      savedLibrary = structuredClone(library);
      const recovered = Boolean(persistenceError);
      persistenceError = '';
      if ((changed || recovered) && !root.querySelector('dialog[open]')) render();
    } catch {
      persistenceError = '当前浏览器未能保存。请立即导出完整备份，再释放浏览器存储空间。';
      if (!root.querySelector('dialog[open]')) render();
    }
  }

  function persistLibrary() {
    if (pendingSave) return pendingSave;
    if (!globalThis.navigator?.locks) {
      commitLibrary();
      return Promise.resolve();
    }
    pendingSave = navigator.locks.request(libraryKey, () => {
      pendingSave = null;
      commitLibrary();
    }).catch(() => {
      pendingSave = null;
      commitLibrary();
    });
    return pendingSave;
  }

  function save() {
    state = normalize(state);
    const current = library.characters.find(item => item.id === library.activeId);
    if (!CharacterLibrary.sameBuild(current.build, state)) {
      if (!undoInProgress) undoBuild = structuredClone(current.build);
      if (state.starterExample && !undoInProgress) state.starterExample = false;
      current.build = structuredClone(state);
      current.updatedAt = new Date().toISOString();
    }
    return persistLibrary();
  }

  function saveAndRender() {
    save();
    render();
  }

  function downloadPublic() {
    const c = calculate();
    const lines = [
      state.name.trim() || '角色卡', 'D&D 2014 · ' + state.level + ' 级', classSpec(state)[0] + ' · ' + backgroundName(),
      attrs.map((name, i) => name + ' ' + c.totals[i]).join(' · '),
      `HP ${c.hp} · AC ${c.ac} · 先攻 ${sign(c.initiative)} · 速度 ${c.speed} 尺`,
      '技能熟练：' + [...c.proficiencies].join('、'),
      ...(c.expertise.size ? ['专精：' + [...c.expertise].join('、')] : []),
      ...(state.job === 'rogue' ? ['装备：' + [armors[state.armor][0], weapons[state.weapon][0], ranged[state.ranged], packs[state.pack]].join('、')] : []),
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], {type: 'text/plain;charset=utf-8'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '角色卡-公开摘要.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function setField(key, value) {
    if (key === 'plan.subclassName') clearSubclassDraft();
    setBuildField(state, key, value);
  }

  function updateStep(level, patch) {
    updateBuildStep(state, level, patch);
  }

  function setBuildField(build, key, value) {
    const [name, index] = key.split('.');
    if (name === 'decision') {
      const id = key.slice(9);
      if (id.startsWith('bonus-swap-from:')) delete build.decisions['bonus-swap-to:' + id.split(':')[1]];
      build.decisions[id] = id.startsWith('gear:') ? [value] : value;
      return;
    }
    if (name === 'plan') {
      const step = planStep(build, build.level);
      const patch = index === 'feat' && step.feat !== value ? {stat: featMap[value]?.stats?.length === 1 ? featMap[value].stats[0] : -1} : {};
      updateBuildStep(build, build.level, {...patch, [index]: value});
      return;
    }
    const old = index === undefined ? build[name] : build[name][index];
    if (build.pendingIdentity.includes(name)) build.pendingIdentity = build.pendingIdentity.filter(key => key !== name);
    if (['shield','equippedWeapon','equippedOffhand','weaponGrip'].includes(name)) applyHandEquipment(build, name, value);
    if (old === value) return;
    if (index === undefined) build[name] = value;
    else build[name][index] = value;
    if (name === 'background') {
      build.archivedSelections.push({label: '更换背景前的配置', background: old, skills: [...build.backgroundSkills], languages: [...build.backgroundLanguages], tools: [...build.backgroundTools]});
      build.backgroundSkills = [...backgrounds[value][1]];
      build.backgroundTools = [];
      build.backgroundLanguages = [];
      build.backgroundGold = null;
    }
    if (name === 'ancestry') {
      build.archivedSelections.push({label: '更换种族前的配置', ancestry: old, skills: [...build.ancestrySkills], languages: [...build.languages]});
      build.ancestrySkills = [];
      build.languages = [];
    }
    if (name === 'job') {
      build.archivedSelections.push({label: '更换职业前的配置', job: old, skills: [...build.jobSkills], expertise: [...build.expertise]});
      build.jobSkills = build.jobSkills.filter(skill => classSpec(build)[4].includes(skill)).slice(0, classSpec(build)[3]);
    }
  }

  function updateBuildStep(build, level, patch) {
    build.plans[build.job] ??= {};
    build.plans[build.job][level] = {...planStep(build, level), ...patch};
  }

  function clearSubclassDraft() {
    const draft = growthDrafts.get(state.job + ':' + activeTrack(state).sub[0]);
    if (draft) delete draft.subclassName;
  }

  function rememberTaskView() {
    const focus = document.activeElement?.closest('.task-view, .task-home') ? document.activeElement.dataset.focus : '';
    const view = {branchKey, branchOpener, previewedChoice, treeCategory, treeView, growthExpanded, subclassComparisonOpen,
      focus, scroll: window.scrollY, growthScroll: root.querySelector('#growth-map')?.scrollLeft ?? 0,
      treeScroll: root.querySelector('#full-tree-map')?.scrollLeft ?? 0,
      opened: new Set([...root.querySelectorAll('details[open][data-detail]')].map(node => node.dataset.detail))};
    historyViews.set(viewId, view);
    taskViews.set(activeTask, view);
  }

  function selectTask(task, key = taskDefaultBranches[task] ?? '', addHistory = true) {
    if (activeTask === 'home' && task !== 'home') homeFocus = 'task-' + task;
    if (task !== activeTask) {
      rememberTaskView();
      if (addHistory) {
        viewId = ++nextViewId;
        window.history?.pushState({...window.history.state, [historyTaskKey]: task, [historyViewKey]: viewId}, '');
      }
    }
    activeTask = task;
    branchKey = key;
    branchOpener = key ? 'open-' + key : '';
    previewedChoice = null;
    subclassComparisonOpen = false;
    if (task === 'treeLevel') growthExpanded = true;
  }

  function openTask(task, key, target = '#task-title', addHistory = true, previousViewId) {
    if (task === activeTask && key === undefined && target === '#task-title' && addHistory) {
      const toggle = root.querySelector('.workbench-nav[data-menu-open] [data-action="task-menu"]');
      setTaskMenu(false);
      toggle?.focus({preventScroll: true});
      return;
    }
    const canRestore = key === undefined && target === '#task-title';
    let view;
    if (canRestore && !addHistory) view = historyViews.get(previousViewId);
    if (canRestore && addHistory && activeTask !== 'home') view = taskViews.get(task);
    selectTask(task, key, addHistory);
    if (!addHistory) viewId = previousViewId ?? ++nextViewId;
    if (view) {
      ({branchKey, branchOpener, previewedChoice, treeCategory, treeView, growthExpanded, subclassComparisonOpen} = view);
    }
    render(view);
    if (view) {
      window.scrollTo({top: view.scroll, behavior: 'instant'});
      const focusKey = task === 'home' ? homeFocus : view.focus;
      const restoredFocus = focusKey && root.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`);
      const title = root.querySelector(view.branchKey ? '#branch-title' : '#task-title') ?? root.querySelector('#task-title');
      const focus = restoredFocus || title;
      const rect = focus.getBoundingClientRect();
      const visible = rect.height && rect.top >= toolbarBottom(root.querySelector('.workbench-top')) &&
        rect.bottom <= window.innerHeight;
      const navigation = root.querySelector(compactWorkbench.matches ? '[data-action="task-menu"]' : '.workbench-nav [aria-current="page"]');
      (visible ? focus : navigation ?? focus).focus({preventScroll: true});
      return;
    }
    if (task === 'home') {
      window.scrollTo({top: 0, behavior: 'instant'});
      (root.querySelector(`[data-focus="${CSS.escape(homeFocus)}"]`) ?? root.querySelector('#task-title')).focus({preventScroll: true});
      return;
    }
    reveal(root.querySelector(target) ? target : '#task-title', {focus: true});
    if (task === 'treeLevel') revealGrowthNode(state.level);
  }

  window.addEventListener('popstate', event => {
    const task = event.state?.[historyTaskKey];
    openTask(Object.hasOwn(taskNames, task) ? task : 'home', undefined, '#task-title', false, event.state?.[historyViewKey]);
  });

  function setLevel(level, jump = false, {task, key = '', target = '#level-detail'} = {}) {
    if (!isScore(level, 1, state.levelCap)) return;
    state.level = level;
    selectTask(task ?? (jump ? 'treeLevel' : activeTask), key);
    saveAndRender();
    if (jump) reveal(root.querySelector(target) ? target : '#task-title', {focus: true});
    revealGrowthNode(level);
  }

  function openTreeBranch(category, key = category) {
    if (activeTask !== 'tree') return openTask(category, key, key ? '#branch-panel' : '#task-title');
    treeCategory = category;
    branchKey = key;
    branchOpener = key ? 'open-' + key : '';
    previewedChoice = null;
    render();
    reveal(key ? '#branch-panel' : '[data-tree-fields]', {focus: true});
  }

  function closeBranch() {
    const key = branchKey;
    const openerKey = branchOpener;
    branchKey = '';
    branchOpener = '';
    previewedChoice = null;
    render();
    const opener = [...root.querySelectorAll('[data-open-branch]')].find(el => openerKey ?
      el.dataset.focus === openerKey : el.dataset.openBranch === key);
    if (opener?.dataset.focus) reveal(`[data-focus="${CSS.escape(opener.dataset.focus)}"]`, {focus: true});
    else if (activeTask === 'tree' && treeCategory) reveal(`[data-focus="tree-${treeCategory}"]`, {focus: true});
    else reveal('#task-title', {focus: true});
  }

  function chooseBranch(value) {
    const branch = branches.get(branchKey);
    const option = branch?.options.find(item => String(item.id) === value);
    if (!option || option.disabled) return;
    if (branchKey === 'plan.spellsAdded' && !option.selected) {
      const before = calculate().core.spells.stages.get(state.level);
      const after = calculate(previewBuild(branchKey, option)).core.spells.stages.get(state.level);
      const hadSpell = [...before.learned, ...before.cantrips, ...state.copiedSpells].includes(option.id);
      if (hadSpell || !after.added.includes(option.id)) {
        const status = root.querySelector('[data-spell-drop-status]');
        if (status) status.textContent = CharacterLocale.text(hadSpell ? '你已掌握这项法术。' : '本级名额已满，或该法术不符合学派限制。');
        return;
      }
    }
    if (branchKey === 'treeLevel') return setLevel(Number(option.id), true);
    const gearGroup = branchKey.startsWith('equipmentChoices.') ? branchKey.slice('equipmentChoices.'.length) :
      branchKey.startsWith('decision.gear:') ? branchKey.split(':')[1] : '';
    if (option.selected && !branch.multiple) {
      const next = gearGroup && branchKey.startsWith('equipmentChoices.') && equipmentPickBranch(state, gearGroup, {first:true});
      if (next) openTreeBranch('armor', next);
      return;
    }
    undoBuild = structuredClone(state);
    const hadPreview = previewedChoice !== null;
    previewedChoice = null;
    if (branchKey === 'subclass') {
      setField('subclass', option.id);
      updateStep(3, {subclassName: ''});
      saveAndRender();
      if (hadPreview) reveal(`[data-focus="${CSS.escape(`choice-subclass-${value}`)}"]`, {focus: true});
      return;
    }
    const previousBranch = branchKey;
    if (branch.multiple) {
      const current = currentBranchValues(branchKey);
      setField(branchKey, option.selected ? current.filter(item => item !== option.id) : [...current, option.id]);
    } else if (branchKey === 'careerSubclass') {
      updateStep(activeTrack(state).sub[0], {subclassName: option.id});
    } else {
      setField(branchKey, option.id);
      if (activeTask === 'tree' && branchKey === 'job' && subclassCatalog(option.id).length) {
        branchKey = option.id === 'rogue' ? 'subclass' : 'careerSubclass';
        branchOpener = 'open-' + branchKey;
      }
    }
    if (gearGroup) {
      const next = equipmentPickBranch(state, gearGroup, {first: previousBranch.startsWith('equipmentChoices.')});
      if (next) {
        treeCategory = 'armor';
        branchKey = next;
        branchOpener = 'open-' + next;
      }
    }
    saveAndRender();
    if (previousBranch !== branchKey) reveal('#branch-panel', {focus: true});
    else if (hadPreview) reveal(`[data-focus="${CSS.escape(`choice-${branchKey}-${value}`)}"]`, {focus: true});
  }

  function flushScoreRender() {
    if (pendingScoreRender && !pointerDown) requestAnimationFrame(() => {
      if (pendingScoreRender && !pointerDown) render();
    });
  }

  function applyScores(next, {batch = false, index = null} = {}) {
    scoreErrorIndex = index;
    const [min, max] = scoreRange(state);
    if (next.length !== 6 || next.some(score => !isScore(score, min, max))) {
      pointNotice = '请输入' + (batch ? '六项 ' : ' ') + min + '–' + max + ' 的整数。';
    } else if (state.scoreMode === 'buy' && spent(next) > 27) {
      pointNotice = '这组数值需要 ' + spent(next) + ' 点，超过 27 点上限。';
    } else {
      state[state.scoreMode === 'buy' ? 'base' : 'manual'] = next;
      pointNotice = '';
      if (batch) batchText = '';
      save();
    }
    if (index !== null) {
      // A number field commits on blur. Preserve the click or Tab that moved focus away.
      pendingScoreRender = true;
      flushScoreRender();
    } else {
      render();
      if (pointNotice) reveal('#batch-notice');
    }
  }

  function focusScore(index) {
    if (activeTask !== 'scores') openTask('scores');
    reveal('[data-score="' + index + '"]');
    root.querySelector('[data-score-input="' + index + '"]')?.focus({preventScroll: true});
  }

  window.addEventListener('pointerdown', () => {
    pointerDown = true;
    clearTimeout(optionRevealTimer);
  });
  function releasePointer() {
    pointerDown = false;
    flushScoreRender();
  }
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  window.addEventListener('blur', releasePointer);

  root.addEventListener('toggle', event => {
    const key = event.target.dataset.sourceFilter;
    if (!key || !event.target.isConnected) return;
    const filter = branchFilters.get(key) ?? {query: '', sources: []};
    branchFilters.set(key, {...filter, expanded: event.target.open});
  }, true);

  root.addEventListener('dblclick', event => {
    if (event.target.closest('[data-character-name]')) {
      window.getSelection()?.removeAllRanges();
      setNameEditing(true);
    }
  });

  root.addEventListener('click', event => {
    if (!event.target.closest('.workbench-nav')) setTaskMenu(false);
    clearTimeout(optionRevealTimer);
    const queuedPreview = pendingPreviewButton;
    pendingPreviewButton = null;
    const disclosure = event.target.closest('summary')?.parentElement;
    if (disclosure && !disclosure.open) requestAnimationFrame(() => {
      if (disclosure.isConnected && disclosure.open) animatePanel(disclosure.querySelector(':scope > .small-stack'));
    });
    const marker = event.target.closest('[data-ability-marker]');
    if (marker) {
      event.preventDefault();
      marker.closest('dialog')?.close();
      focusScore(marker.dataset.abilityMarker);
      return;
    }
    const button = event.target.closest('button');
    if (!button) return;
    const {action, openBranch, branchChoice} = button.dataset;
    if (action === 'task-menu') return setTaskMenu(button.getAttribute('aria-expanded') !== 'true');
    if (action === 'full-stats') {
      setTaskMenu(false);
      return openDialog('角色数值', renderStickyBoard(calculate(), true), 'stats-dialog');
    }
    if (button.dataset.workbenchTask) {
      button.closest('.hologram-dialog')?.close();
      return openTask(button.dataset.workbenchTask);
    }
    if (action === 'portrait-shape') {
      button.closest('dialog')?.close();
      if (activeTask !== 'scores') openTask('scores');
      return reveal('#portrait-height', {focus: true});
    }
    if (handlePageGuideButton(button)) return;
    const guideStep = button.dataset.starterIndex ?? button.dataset.starterStep;
    if (guideStep !== undefined) return changeStarterGuideStep(Number(guideStep));
    if (button.matches('[data-purpose-tag], [data-purpose-clear]')) {
      const panel = button.closest('#branch-panel, [data-equipment-purpose-list]');
      if (!panel) return;
      const tag = button.dataset.purposeTag;
      const current = selectedPurposes(panel);
      const purposes = !tag ? [] : current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag];
      setPurposeButtons(panel, purposes);
      if (panel.id === 'branch-panel') filterBranchOptions(panel);
      else filterEquipmentPurposes(panel);
      if (button.hidden) panel.querySelector('.purpose-buttons [data-purpose-clear]')?.focus({preventScroll: true});
      return;
    }
    if (button.hasAttribute('data-clear-branch-sources')) {
      const panel = button.closest('#branch-panel');
      panel.querySelectorAll('[data-branch-source]').forEach(input => { input.checked = false; });
      filterBranchOptions(panel);
      return;
    }
    if (handleWorkbenchClick(button, event)) return;
    if (button.dataset.treeCategory) return openTreeBranch(button.dataset.treeCategory);
    if (button.dataset.growthScroll || button.dataset.treeScroll) {
      if (button.getAttribute('aria-disabled') === 'true') return;
      const map = root.querySelector('#' + button.getAttribute('aria-controls'));
      const direction = Number(button.dataset.growthScroll ?? button.dataset.treeScroll);
      return map.scrollBy({left: direction * map.clientWidth * 0.8, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    }
    if (button.dataset.levelPick) {
      const level = Number(button.dataset.levelPick);
      if (button.hasAttribute('data-growth-node') && level === state.level && growthExpanded) {
        growthExpanded = false;
        branchKey = ''; branchOpener = ''; previewedChoice = null;
        render();
      } else {
        setLevel(level, true);
      }
      return;
    }
    if (button.dataset.levelJump) return setLevel(Number(button.dataset.levelJump), true);
    if (button.dataset.scoreMode) {
      state.scoreMode = button.dataset.scoreMode;
      pointNotice = '';
      batchText = '';
      saveAndRender();
      return;
    }
    if (button.dataset.asiIndex !== undefined) {
      const asi = [...planStep(state, state.level).asi];
      asi[Number(button.dataset.asiIndex)] += Number(button.dataset.asiDelta);
      updateStep(state.level, {asi});
      saveAndRender();
      return;
    }
    if (action === 'export') return openShareDialog();
    if (action === 'reset-portrait') {
      delete state.portraits[state.ancestry];
      saveAndRender();
      return;
    }
    if (action === 'close-branch') return closeBranch();
    if (action === 'close-preview') return closeChoicePreview();
    if (action === 'toggle-subclass-comparison') {
      subclassComparisonOpen = !subclassComparisonOpen;
      render();
      return reveal('#branch-panel', {focus: subclassComparisonOpen});
    }
    if (action === 'clear-subclass-comparison' || action === 'example-subclass-comparison') {
      if (action === 'clear-subclass-comparison') subclassComparisons.delete(state.job);
      else subclassComparisons.set('rogue', ['mastermind', 'inquisitive']);
      render();
      root.querySelector('[data-compare-slot="0"]')?.focus({preventScroll: true});
      return;
    }
    if (action === 'levels') return openTask('treeLevel', undefined, '#level-title');
    if (action === 'overview') return openTask('sheet');
    if (action === 'current-level') return openTask('treeLevel', '', '#level-detail');
    if (action === 'standard-array') return applyScores([15,14,13,12,10,8], {batch: true});
    if (action === 'build-choices') return openTask('tree');
    if (openBranch) {
      if (branchKey === openBranch) return closeBranch();
      const laneNumber = button.closest('[data-lane]')?.dataset.lane;
      if (laneNumber) treeCategory = ({'01': 'ancestry', '02': 'job', '03': 'background', '04': 'treeLevel', '05': 'armor'})[laneNumber];
      branchOpener = button.dataset.focus ?? '';
      branchKey = openBranch;
      previewedChoice = null;
      render();
      reveal('#branch-panel', {focus: true});
      return;
    }
    if (branchChoice !== undefined) {
      if (event.shiftKey && event.detail > 0 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        window.getSelection()?.removeAllRanges();
        return chooseBranch(branchChoice);
      }
      if (event.detail === 2 && (queuedPreview === button || previewedChoice === branchChoice)) return chooseBranch(branchChoice);
      const revealPreview = () => reveal('#branch-inspector', {focus: true, minVisible: 205});
      const mouseClick = event.detail === 1 && event.pointerType !== 'touch';
      const panel = button.closest('#branch-panel');
      const hasPreview = panel.querySelector('#branch-inspector:not([hidden])');
      if (mouseClick && !usesInlinePreview(panel) && !hasPreview) {
        // Keep the clicked card in place until a possible second click has landed.
        pendingPreviewButton = button;
        optionRevealTimer = setTimeout(() => {
          pendingPreviewButton = null;
          if (!button.isConnected) return;
          previewBranchButton(button);
          revealPreview();
        }, 450);
        return;
      }
      previewBranchButton(button);
      if (mouseClick) optionRevealTimer = setTimeout(revealPreview, 450);
      else revealPreview();
      return;
    }
    if (!button.dataset.adjust) return;
    const next = [...baseScores(state)];
    next[Number(button.dataset.index)] += Number(button.dataset.adjust);
    applyScores(next);
  });

  root.addEventListener('change', event => {
    const target = event.target;
    if (target.hasAttribute('data-single-key-shortcuts')) {
      singleKeyShortcuts = target.checked;
      try {
        localStorage.setItem(shortcutPreference, singleKeyShortcuts ? 'on' : 'off');
      } catch {
        // Retain the selected setting for this session.
      }
      return;
    }
    if (target.hasAttribute('data-preview-spell-ring')) {
      const parent = target.closest('[data-preview-spell]');
      const spell = ruleSpell(branchKey, parent.dataset.previewSpell);
      const casting = spellCastingInBranch(calculate(), branchKey);
      const values = parent.querySelector('[data-preview-spell-values]');
      values.innerHTML = renderSpellCastValues(spell, {level:state.level, ring:Number(target.value), casting});
      CharacterLocale.localize(values);
      return;
    }
    if (target.hasAttribute('data-branch-ring')) {
      if (target.value === 'all') branchSpellRings.delete(branchKey);
      else branchSpellRings.set(branchKey, Number(target.value));
      previewedChoice = null;
      return render();
    }
    if (target.hasAttribute('data-preview-level')) return setLevel(Number(target.value), true);
    if (target.hasAttribute('data-level-cap')) {
      const cap = Number(target.value);
      if (!isScore(cap, state.actualLevel, 20)) return;
      state.levelCap = cap;
      if (state.level > cap) setLevel(cap);
      else saveAndRender();
      return;
    }
    if (target.hasAttribute('data-compare-slot')) {
      const index = Number(target.dataset.compareSlot);
      const pair = [...(subclassComparisons.get(state.job) ?? ['', ''])];
      pair[index] = target.value;
      subclassComparisons.set(state.job, pair);
      render();
      return;
    }
    if (target.dataset.portrait) return save();
    if (target.hasAttribute('data-branch-source')) return filterBranchOptions(target.closest('#branch-panel'));
    if (target.dataset.scoreInput !== undefined) {
      const next = [...baseScores(state)];
      const index = Number(target.dataset.scoreInput);
      next[index] = target.valueAsNumber;
      applyScores(next, {index});
      return;
    }
    const key = target.dataset.key;
    if (!key) return;
    const [name, index] = key.split('.');
    const old = index === undefined ? state[name] : state[name][index];
    const value = key === 'backgroundGold' ? (target.value ? target.valueAsNumber : null) :
      target.type === 'checkbox' ? target.checked : typeof old === 'number' ? Number(target.value) : target.value;
    setField(key, value);
    if (key === 'shield') return saveAndRender();
    save();
    pendingScoreRender = true;
    flushScoreRender();
  });
  root.addEventListener('input', event => {
    const portraitKey = event.target.dataset.portrait;
    if (portraitKey) {
      const {min, max, unit} = portraitFields[portraitKey];
      const value = event.target.valueAsNumber;
      if (!isScore(value, min, max)) return;
      state.portraits[state.ancestry] ??= {};
      state.portraits[state.ancestry][portraitKey] = value;
      const valueLabel = value + unit;
      event.target.setAttribute('aria-valuetext', CharacterLocale.text(valueLabel));
      event.target.closest('.portrait-field').querySelector('output').value = valueLabel;
      root.querySelector('.body-diagram').outerHTML = renderPortraitSvg(calculate().totals, portraitSettings());
      root.querySelector('.hud-portrait')?.setAttribute('style', portraitProportions());
      return;
    }
    if (event.target.name === 'scores') batchText = event.target.value;
    if (event.target.form?.dataset.form === 'growth') {
      const key = draftKey();
      const draft = growthDrafts.get(key) ?? {};
      draft[event.target.name] = event.target.value;
      growthDrafts.set(key, draft);
    }
    if (event.target.hasAttribute('data-branch-search')) {
      filterBranchOptions(event.target.closest('#branch-panel'));
    }
  });
  root.addEventListener('submit', event => {
    if (event.target.dataset.form === 'character-name') {
      event.preventDefault();
      const name = new FormData(event.target).get('name').trim();
      if (name !== state.name) {
        state.name = name;
        saveAndRender();
        root.querySelector('[data-action="edit-name"]').focus({preventScroll: true});
      } else setNameEditing(false);
      return;
    }
    if (event.target.dataset.form === 'growth') {
      event.preventDefault();
      const form = new FormData(event.target);
      const patch = {};
      for (const field of ['subclassName', 'customFeat', 'note']) if (form.has(field)) patch[field] = form.get(field).trim();
      if (form.has('hpDie')) patch.hpDie = form.get('hpDie') ? Number(form.get('hpDie')) : null;
      updateStep(state.level, patch);
      growthDrafts.delete(draftKey());
      saveAndRender();
      return;
    }
    if (event.target.dataset.form !== 'point-buy') return;
    event.preventDefault();
    const raw = new FormData(event.target).get('scores');
    batchText = raw;
    applyScores(raw.trim().split(/[\s,，、;；]+/).map(Number), {batch: true});
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && root.querySelector('.workbench-nav[data-menu-open]') && !event.target.closest('dialog')) {
      event.preventDefault();
      setTaskMenu(false);
      root.querySelector('[data-action="task-menu"]').focus({preventScroll: true});
      return;
    }
    if (event.key === 'Escape' && !event.isComposing && event.target.closest('[data-form="character-name"]')) {
      event.preventDefault();
      setNameEditing(false);
      return;
    }
    if (event.key === 'Enter' && !event.isComposing && !event.repeat) {
      const option = event.target.closest('[data-branch-choice]');
      const apply = event.target.id === 'inspector-heading' ? root.querySelector('#branch-inspector [data-apply-choice]') : null;
      if (option || apply) {
        event.preventDefault();
        clearTimeout(optionRevealTimer);
        const value = option?.dataset.branchChoice ?? apply.dataset.applyChoice;
        return chooseBranch(value);
      }
    }
    if (event.key === 'Escape' && event.target.closest('#branch-panel')) {
      if (previewedChoice !== null && root.querySelector('#branch-inspector:not([hidden])')) closeChoicePreview();
      else closeBranch();
    }
    if (event.key === 'Enter' && event.target.dataset.scoreInput !== undefined) {
      event.preventDefault();
      event.target.blur();
    }
  });
  window.addEventListener('keydown', event => {
    const {target, key, altKey, ctrlKey, metaKey, shiftKey} = event;
    if (event.defaultPrevented || event.repeat || event.isComposing || altKey ||
      target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;

    const dialog = root.querySelector('#workbench-dialog[open]');
    if (ctrlKey || metaKey) {
      const undo = !dialog && !shiftKey && ctrlKey !== metaKey && key.toLowerCase() === 'z' &&
        root.querySelector('[data-action="undo"]');
      if (undo) {
        event.preventDefault();
        undo.click();
      }
      return;
    }
    if (singleKeyShortcuts && key === '?' && !dialog) {
      event.preventDefault();
      openTask('shortcuts');
      return;
    }
    if (singleKeyShortcuts && key === '/') {
      const search = (dialog ?? root).querySelector('input:is([data-branch-search], [data-shop-search])');
      if (search?.getClientRects().length) {
        event.preventDefault();
        setTaskMenu(false);
        if (dialog) search.focus();
        else reveal('#branch-panel [data-branch-search]', {focus: true});
        search.select();
      }
      return;
    }
    const node = !dialog && !shiftKey && target.closest?.('[data-growth-node]');
    if (node && (key === 'ArrowLeft' || key === 'ArrowRight')) {
      const level = Number(node.dataset.levelPick) + (key === 'ArrowLeft' ? -1 : 1);
      const next = node.closest('#growth-map').querySelector(`[data-level-pick="${level}"]`);
      event.preventDefault();
      next?.focus({preventScroll: true});
      if (next) revealGrowthNode(level);
    }
  });
  /* WORKBENCH_EXTENSION */
  /* PAGE_GUIDE_EXTENSION */
  /* HUD_EXTENSION */
  /* RULE_CARD_EXTENSION */
  mountOptionIllustrations();
  syncWorkbenchLanguage();
  restoreTheme();
  if (window.history) {
    window.history.scrollRestoration = 'manual';
    window.history.replaceState({...window.history.state, [historyTaskKey]: activeTask, [historyViewKey]: viewId}, '');
  }
  render();
})();
