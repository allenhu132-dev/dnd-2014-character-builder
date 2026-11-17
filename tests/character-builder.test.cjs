const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'src', name), 'utf8');
const fakeStorage = new Map();
const context = vm.createContext({console, URLSearchParams, structuredClone, crypto: require('node:crypto').webcrypto,
  document: {head:{append() {}}, documentElement: {}, createElement:() => ({}), getElementById: id => id === 'character-seed' ? {textContent: '{}'} : {addEventListener() {}}},
  localStorage: {getItem: key => fakeStorage.get(key) ?? null, setItem: (key, value) => fakeStorage.set(key, value)},
  window: {matchMedia: () => ({matches: false, addEventListener() {}}), addEventListener() {}},
  ResizeObserver: class {observe() {} disconnect() {}}, setTimeout, requestAnimationFrame() {},
});
const app = read('character-builder.js').replace('/* WORKBENCH_EXTENSION */', read('character-workbench.js'))
  .replace('/* PAGE_GUIDE_EXTENSION */', read('character-page-guide.js'))
  .replace('/* RULE_CARD_EXTENSION */', read('character-rule-card.js'))
  .replace(/  render\(\);\s*\}\)\(\);\s*$/, '  globalThis.workbench = {defaults, normalize, calculate, classSpec, activeDecisions, library, spellChoiceDefinitions, effectiveInvocations, coreRules, coreSpells, CharacterLibrary, catalogueRuleCard, portableRuleDocument, equipmentSummary, spellCastFacts, characterCastingNumbers, setJob(job) {state = normalize({...state, job});}};\n})();');
const sourceFiles = ['rogue-rules.js', 'character-catalog.js', 'character-ancestries.js', 'character-growth.js', 'character-core-rules.js',
  'character-spells.js', 'character-spell-catalogue.js', 'character-spell-profiles.js', 'character-spell-resolution.js', 'character-library.js', 'character-option-purpose.js',
  ...['ancestries','backgrounds','subclasses','feats','artificer','bloodhunter'].map(group => 'character-expansion-' + group + '.js')];
const artDir = path.join(root, 'src', 'option-art');
const ruleArt = Object.fromEntries(fs.readdirSync(artDir).filter(name => name.endsWith('.webp')).map(name =>
  [path.basename(name, '.webp'), 'data:image/webp;base64,' + fs.readFileSync(path.join(artDir, name), 'base64')]));
const locale = read('character-locale.js').replace('/* ENGLISH_CATALOG */', read('character-en.json'));
vm.runInContext(sourceFiles.map(read).join('\n') + '\n' + locale + '\nconst ruleArtImages = ' + JSON.stringify(ruleArt) + ';\n' + app, context);
const api = context.workbench;
const build = values => api.normalize({...structuredClone(api.defaults), ...values});
const calc = values => api.calculate(build(values));
assert.equal(Object.keys(api.coreRules.classes).length, 12);
assert.equal(Object.values(api.coreRules.subclassFeatures).reduce((sum, subclasses) => sum + Object.keys(subclasses).length, 0), 40);
assert.equal(api.coreRules.feats.length, 42);
assert.equal(api.coreSpells.filter(spell => !spell.sourceBook).length, 361);
assert.equal(new Set(api.coreSpells.map(spell => spell.id)).size, api.coreSpells.length);

const starter = api.library.characters[0].build;
const starterStats = api.calculate(starter);
assert.equal(starter.job, 'fighter');
assert.equal(starter.ancestry, 'human');
assert.equal(starter.background, '士兵');
assert.equal(starter.actualLevel, 1);
assert.deepEqual(Array.from(starterStats.totals), [16,14,15,11,13,9]);
assert.deepEqual(Array.from(starterStats.issues), []);
assert.equal(starterStats.hp, 12);
assert.equal(starterStats.ac, 19);
assert.equal(starterStats.core.attack.hit, 5);
assert.match(starterStats.core.attack.damage, /^1d8\+3\s/);
for (const id of ['chain-mail', 'shield', 'longsword', 'handaxe', 'explorers-pack']) {
  assert.ok(starterStats.core.inventory.some(item => item.id === id), id + ' is in the starter backpack');
}
const goldStarter = api.calculate({...starter, equipmentMode: 'gold', wealthRoll: 5});
assert.equal(goldStarter.core.gold, 50);
assert.equal(goldStarter.core.inventory.length, 0);
assert.equal(goldStarter.ac, 12);
assert.equal(goldStarter.core.attack.name, '徒手打击');
assert.equal(goldStarter.core.equipment.unlisted.length, 3);
const oldConflict = api.calculate({...starter, weaponGrip: 'two', equippedOffhand: 'handaxe'});
assert.equal(oldConflict.ac, 19);
assert.match(oldConflict.core.attack.damage, /^1d8\+3\s/);
assert.equal(oldConflict.core.equipment.equippedOffhand, '');
assert.equal(oldConflict.core.equipment.handConflict, true);

const rogue = calc({ancestry: 'changeling', flex: 1, base: [8,15,12,8,14,14], job: 'rogue', background: 'charlatan',
  backgroundSkills: ['欺瞒','巧手'], jobSkills: ['特技','洞悉','隐匿','察觉'], expertise: ['欺瞒','洞悉'], armor: 'leather'});
assert.deepEqual(Array.from(rogue.totals), [8,16,12,8,14,16]);
assert.equal(rogue.hp, 9);
assert.equal(rogue.ac, 14);
assert.equal(rogue.skillBonus('欺瞒'), 7);
assert.equal(rogue.skillBonus('洞悉'), 6);

assert.equal(calc({job: 'monk', ancestry: 'human', manual: [10,16,14,10,16,10], scoreMode: 'manual', armor: 'none'}).ac, 16);
assert.equal(calc({job: 'monk', ancestry: 'human', manual: [10,16,14,10,16,10], scoreMode: 'manual', armor: 'none', shield: true,
  registeredEquipment:[{id:'shield', quantity:1}]}).ac, 15);
const chainFighter = {job:'fighter', manual:[8,10,14,10,10,10], scoreMode:'manual', armor:'chain', equipmentChoices:{armor:'chain'}};
assert.equal(calc({...chainFighter, ancestry:'human'}).speed, 20);
assert.equal(calc({...chainFighter, ancestry:'hillDwarf'}).speed, 25);
assert.equal(calc({job: 'wizard', ancestry: 'mountainDwarf', armor: 'shirt'}).core.proficiencies.armor.has('medium'), true);
const longsword = {ancestry:'human', equippedWeapon:'longsword', registeredEquipment:[{id:'longsword',quantity:1}]};
assert.equal(calc({...longsword, job:'wizard'}).core.attack.trained, false);
assert.equal(calc({...longsword, job:'fighter'}).core.attack.trained, true);
const twilightTraining = calc({job:'cleric', ancestry:'human', plans:{cleric:{1:{subclassName:'暮光领域'}}}}).core.proficiencies;
assert.ok(twilightTraining.armor.has('heavy') && twilightTraining.weapons.has('martial'));
assert.equal(calc({job:'artificer', ancestry:'human'}).core.proficiencies.armor.has('shield'), true);
assert.equal(calc({job:'bloodhunter', ancestry:'human'}).core.proficiencies.weapons.has('martial'), true);
const pactGear = {job:'warlock', ancestry:'human', equippedWeapon:'greatsword', decisions:{'pact-boon':['blade'], 'pact-weapon':['greatsword']}};
assert.equal(calc({...pactGear, level:3}).core.attack.trained, true);
assert.equal(calc({...pactGear, level:2}).core.attack.name, '徒手打击');
const bladeTraining = {job:'wizard', level:2, ancestry:'human', equippedWeapon:'rapier',
  registeredEquipment:[{id:'rapier',quantity:1}],
  plans:{wizard:{2:{subclassName:'剑咏'}}}, decisions:{'bladesinger-weapon':['rapier']}};
assert.equal(calc(bladeTraining).core.attack.trained, true);
assert.equal(calc({...bladeTraining, level:1}).core.attack.trained, false);

for (const job of Object.keys(api.coreRules.classes)) for (let level = 1; level <= 20; level++) {
  const result = calc({job, level, armor: 'none'});
  assert.ok(Number.isFinite(result.hp) && result.hp >= level, job + level + ' HP');
  assert.equal(result.pb, 2 + Math.floor((level - 1) / 4));
}

const levelOneSpells = {bard:[2,4],cleric:[3,0],druid:[2,0],sorcerer:[4,2],warlock:[2,2],wizard:[3,6]};
const firstSubclass = {cleric:'生命领域',sorcerer:'龙族血脉',warlock:'邪魔'};
for (const [job, source] of Object.entries(api.coreRules.classes)) {
  const character = build({job, background:'acolyte', backgroundSkills:['洞悉','宗教'], backgroundLanguages:['矮人语','巨人语'],
    languages:['精灵语'], armor:'none', plans:{[job]:{1:{subclassName:firstSubclass[job] ?? '',style:job === 'fighter' ? '防御' : ''}}}});
  const spec = api.classSpec(character);
  character.jobSkills = spec[4].filter(skill => !character.backgroundSkills.includes(skill)).slice(0,spec[3]);
  if (job === 'rogue') character.expertise = character.jobSkills.slice(0,2);
  for (const choice of api.activeDecisions(character)) character.decisions[choice.id] = choice.options.slice(0,choice.count).map(option => option.id);
  for (const group of source.equipment) {
    const option = group.options.find(option => !option.requiresArmor && !option.requiresWeapon);
    character.equipmentChoices[group.id] = option.id;
    if (option.pick) {
      const {type,pool,count} = option.pick;
      const item = Object.values(api.coreRules.items).find(item => type === 'instrument' ? item.kind === 'instrument' : item.kind === 'weapon' &&
        item.type === (pool.includes('simple') ? 'simple' : 'martial') && (!pool.includes('melee') || item.category === 'melee'));
      for (let i=0;i<count;i++) character.decisions['gear:'+group.id+':'+i] = [item.id];
    }
  }
  if (levelOneSpells[job]) {
    const [cantrips, leveled] = levelOneSpells[job];
    const pool = api.coreSpells.filter(spell => spell.classes.includes(job));
    character.plans[job][1].spellsAdded = [...pool.filter(spell => spell.level === 0).slice(0,cantrips), ...pool.filter(spell => spell.level === 1).slice(0,leveled)].map(spell => spell.id);
    const spells = api.calculate(character).core.spells;
    if (spells.preparedMax) character.preparations = spells.preparedPool.slice(0,spells.preparedMax).map(spell => spell.id);
  }
  assert.deepEqual(Array.from(api.calculate(character).issues), [], job + ' can complete level-one decisions');
}

const low = calc({job:'fighter', ancestry:'human', level:3, plans:{fighter:{4:{asi:[0,0,2,0,0,0]}}}});
const high = calc({job:'fighter', ancestry:'human', level:4, plans:{fighter:{4:{asi:[0,0,2,0,0,0]}}}});
assert.equal(high.mods[2], low.mods[2] + 1);
assert.equal(high.hp - low.hp, 6 + high.mods[2] + 3);
const gold = calc({job:'fighter', background:'charlatan', equipmentMode:'gold', wealthRoll:10, inventory:[{id:'longsword',quantity:1}]}).core.gold;
assert.equal(gold, 85, 'class gold replaces background coins');
const packWithPurchase = calc({job:'rogue', background:'charlatan', equipmentMode:'pack', inventory:[{id:'dagger',quantity:1}]}).core;
assert.equal(packWithPurchase.gold, 13, 'purchases use background coins when taking the starting pack');
assert.equal(packWithPurchase.inventory.find(item => item.id === 'dagger').quantity, 3, 'starting and purchased copies stack in the backpack');

const spellStudy = {job:'fighter', level:3, armor:'none', plans:{fighter:{3:{subclassName:'奥法骑士',
  spellsAdded:['fire-bolt','mage-hand','shield','magic-missile','burning-hands'],freeSpells:['shield']}}}};
const knight = calc(spellStudy).core.spells;
assert.equal(knight.stages.get(3).knownCount,3);
assert.equal(knight.stages.get(3).learned.length,3);
const nextKnight = structuredClone(spellStudy);
nextKnight.level = 4;
nextKnight.plans.fighter[4] = {spellsAdded:['find-familiar']};
assert.ok(!calc(nextKnight).core.spells.known.includes('find-familiar'), 'an unused off-school selection is not transferable to the next level');
nextKnight.plans.fighter[4].spellsRemoved = ['shield'];
assert.ok(calc(nextKnight).core.spells.known.includes('find-familiar'), 'replacing the designated free-school spell permits an off-school spell');
assert.equal(calc({job:'rogue',subclass:'arcane',level:20}).core.spells.stages.get(20).knownCount,13);

const divine = {job:'sorcerer', level:3, plans:{sorcerer:{
  1:{subclassName:'神圣之魂',spellsAdded:['sacred-flame','guidance','mage-hand','fire-bolt','guiding-bolt','shield']},
  2:{spellsAdded:['magic-missile']},
  3:{spellsAdded:['spiritual-weapon']},
}},decisions:{'spell:divine-affinity':['cure-wounds']}};
const divineMagic = calc(divine).core.spells;
assert.equal(divineMagic.track.stat, 5, 'cleric spells learned by Divine Soul use Charisma');
assert.ok(divineMagic.known.includes('guiding-bolt') && divineMagic.known.includes('spiritual-weapon'));
assert.ok(divineMagic.bonusKnown.includes('cure-wounds') && !divineMagic.known.includes('cure-wounds'));
assert.ok(divineMagic.stages.get(1).pool.some(spell => spell.id === 'ceremony'), 'cleric expansion spells are in the borrowed list');
assert.ok(!divineMagic.stages.get(1).pool.some(spell => spell.id === 'spiritual-weapon'));
const swappedDivine = structuredClone(divine);
swappedDivine.decisions['bonus-swap-from:3'] = ['cure-wounds'];
swappedDivine.decisions['bonus-swap-to:3'] = ['aid'];
const afterDivineSwap = calc(swappedDivine).core.spells;
assert.ok(afterDivineSwap.bonusKnown.includes('aid') && !afterDivineSwap.bonusKnown.includes('cure-wounds'));
assert.equal(afterDivineSwap.stages.get(3).replaceAllowed, 0);
const ordinary = structuredClone(divine);
ordinary.plans.sorcerer[1].subclassName = '龙族血脉';
assert.ok(!calc(ordinary).core.spells.known.includes('guiding-bolt'));

const clockwork = calc({job:'sorcerer',level:2,plans:{sorcerer:{1:{subclassName:'时械之魂'}}},
  decisions:{'bonus-swap-from:2':['alarm'],'bonus-swap-to:2':['armor-of-agathys']}}).core.spells;
assert.ok(clockwork.bonusKnown.includes('armor-of-agathys') && !clockwork.bonusKnown.includes('alarm'));
assert.equal(clockwork.stages.get(2).replaceAllowed, 1, 'Clockwork replacement is independent of ordinary replacement');
const genie = calc({job:'warlock',level:17,plans:{warlock:{1:{subclassName:'巨灵宗主',spellsAdded:['sanctuary','hex']}}},
  decisions:{'genie-kind':['dao'],'spell:arcanum-17':['wish']}}).core.spells;
assert.ok(genie.known.includes('sanctuary') && genie.bonus.includes('wish'));
assert.ok(!genie.bonusKnown.includes('wish') && !genie.stages.get(1).pool.some(spell => spell.id === 'fireball'));
const hexblade = calc({job:'warlock',plans:{warlock:{1:{subclassName:'咒剑'}}}}).core.spells;
assert.ok(hexblade.stages.get(1).pool.some(spell => spell.id === 'shield') && !hexblade.bonusKnown.includes('shield'));
const gloom = calc({job:'ranger',level:5,plans:{ranger:{3:{subclassName:'幽域追踪者'}}}}).core.spells;
assert.ok(gloom.bonusKnown.includes('rope-trick') && !gloom.known.includes('rope-trick'));
const domain = calc({job:'cleric',level:5,plans:{cleric:{1:{subclassName:'暮光领域'}}},preparations:['faerie-fire','bless']}).core.spells;
assert.ok(domain.alwaysPrepared.includes('aura-of-vitality'));
assert.deepEqual(Array.from(domain.prepared), ['bless']);
assert.ok(!domain.preparedPool.some(spell => spell.id === 'aura-of-vitality'));
const armorer = calc({job:'artificer',level:5,ancestry:'human',scoreMode:'manual',manual:[8,8,8,15,8,8],
  plans:{artificer:{3:{subclassName:'装甲师'},1:{spellsAdded:['mending','booming-blade']}}},preparations:['cure-wounds']}).core.spells;
assert.equal(armorer.preparedMax, 5);
assert.ok(armorer.known.includes('booming-blade') && armorer.prepared.includes('cure-wounds') && armorer.alwaysPrepared.includes('mirror-image'));
assert.ok(calc({job:'cleric',level:5,rules:{tashaSpells:true}}).core.spells.preparedPool.some(spell => spell.id === 'aura-of-vitality'));
assert.ok(!calc({job:'cleric',level:5}).core.spells.preparedPool.some(spell => spell.id === 'aura-of-vitality'));
const profane = calc({job:'bloodhunter',level:15,plans:{bloodhunter:{3:{subclassName:'渎魂结社'}}},
  decisions:{'profane-patron':['fiend'],'profane-ability':['wisdom']}}).core.spells;
assert.equal(profane.track.stat,4);
assert.equal(profane.track.slots,'002');
assert.deepEqual(Array.from(profane.limited, spell=>spell.id),['scorching-ray','fireball']);

const oldCharacter = build({name:'旧角色',level:7});
const legacyStore = new Map([['old', JSON.stringify({version:1,state:oldCharacter})]]);
const storage = {getItem: key => legacyStore.get(key) ?? null, setItem: (key, value) => legacyStore.set(key, value)};
const migratedLibrary = api.CharacterLibrary.load(storage,'new','old',() => build({}),api.normalize);
assert.equal(migratedLibrary.library.characters[0].build.name,'旧角色');
assert.ok(legacyStore.has('old') && legacyStore.has('new'));
const legacyGear = api.normalize({job:'rogue',weapon:'rapier',ranged:'shortbow',pack:'burglar'});
assert.ok(api.calculate(legacyGear).core.inventory.some(item => item.id === 'burglars-pack'));
assert.ok(api.calculate(legacyGear).core.inventory.some(item => item.id === 'shortbow'));

const invocations = build({job:'warlock', level:3, armor:'none', magicArmor:true, plans:{warlock:{1:{subclassName:'邪魔'}}}, decisions:{
  'invocations-2':['armor-of-shadows','eldritch-sight'], 'pact-boon':['tome'],
  'invocation-remove:3':['eldritch-sight'], 'invocation-add:3':['book-of-ancient-secrets'],
}});
assert.ok(api.effectiveInvocations(invocations).some(option => option.id === 'book-of-ancient-secrets'));
assert.ok(api.spellChoiceDefinitions(invocations).some(choice => choice.id === 'ancient-rituals'));
assert.equal(api.calculate(invocations).ac, 13 + api.calculate(invocations).mods[1]);

const migrated = build({job:'fighter', plans:{fighter:{4:{feat:'catalog:运动员',stat:0}}}});
assert.equal(migrated.plans.fighter[4].feat, 'phb:athlete');
const serialized = JSON.stringify({format:'dnd2014-character',schemaVersion:2,build:invocations});
const imported = api.CharacterLibrary.importArchive(serialized, api.normalize);
assert.equal(imported.length,1);
assert.equal(imported[0].build.decisions['pact-boon'][0],'tome');
assert.throws(() => api.CharacterLibrary.importArchive('{broken', api.normalize), /JSON/);
assert.throws(() => api.CharacterLibrary.importArchive(JSON.stringify({format:'dnd2014-library',schemaVersion:99}), api.normalize), /版本/);

const ids = new Set(api.coreSpells.map(spell => spell.id));
for (const spell of api.coreSpells) {
  assert.equal(spell.sourceVersion, '2014');
  assert.ok(spell.name && spell.summary && (spell.classes.length || spell.sourceBook) && spell.time && spell.range);
  const card = api.catalogueRuleCard('plan.spellsAdded', {id:spell.id,title:spell.name});
  assert.equal(card.kind,'法术');
  assert.ok(card.sections[0].facts.some(([label,value]) => label === '施法时间' && value === spell.time));
  assert.ok(card.sections.find(section => section.title === '伤害与判定')?.facts.length, spell.id);
}
function resolution(id) {
  const spell = api.coreSpells.find(spell => spell.id === id);
  const card = api.catalogueRuleCard('plan.spellsAdded', {id, title: spell.name});
  return Object.fromEntries(card.sections.find(section => section.title === '伤害与判定').facts);
}
assert.match(resolution('fire-bolt')['攻击检定'], /远程法术攻击/);
assert.match(resolution('fireball')['目标豁免'], /敏捷/);
assert.match(resolution('fireball')['伤害'], /8d6/);
assert.match(resolution('magic-missile')['如何结算'], /自动命中/);
assert.equal(resolution('magic-missile')['法术命中公式'], undefined);
assert.match(resolution('counterspell')['如何结算'], /DC = 10 \+ 对方法术环阶/);
assert.match(resolution('minor-illusion')['属性与技能检定'], /智力检定 · 调查/);
assert.match(resolution('minor-illusion')['法术豁免 DC'], /熟练加值/);
assert.match(resolution('spike-growth')['伤害'], /每移动 5 尺受 2d4/);
assert.equal(resolution('maze')['法术豁免 DC'], undefined);
const caster = api.characterCastingNumbers(calc({job:'wizard', level:7}));
const cast = (id, level, ring) => Object.fromEntries(api.spellCastFacts(api.coreSpells.find(spell => spell.id === id), level, ring, caster));
assert.equal(cast('fire-bolt', 4)['伤害'], '1d10 火焰');
assert.equal(cast('fire-bolt', 5)['伤害'], '2d10 火焰');
assert.equal(cast('fire-bolt', 11)['伤害'], '3d10 火焰');
assert.equal(cast('fire-bolt', 17)['伤害'], '4d10 火焰');
assert.match(cast('fire-bolt', 7)['法术命中公式'], /^d20 \+\d+（智力）$/);
assert.equal(cast('fireball', 7, 3)['伤害'], '8d6 火焰');
assert.equal(cast('fireball', 7, 4)['伤害'], '9d6 火焰');
assert.equal(cast('fireball', 7, 4)['法术豁免 DC'], caster.dc + '（智力）');
assert.equal(cast('fireball', 7, 4)['法术命中公式'], undefined);
assert.match(cast('scorching-ray', 7, 4)['伤害'], /5 道射线，每道命中 2d6/);
assert.match(cast('ice-storm', 9, 5)['按效果结算的伤害骰'], /3d8 钝击 \+ 4d6/);
assert.match(cast('witch-bolt', 7, 4)['伤害'], /初次命中 4d12.*后续维持时 1d12/);
assert.match(cast('toll-the-dead', 5)['伤害'], /2d8.*2d12/);
assert.match(cast('spiritual-weapon', 7, 3)['伤害'], /^1d8/);
assert.match(cast('spiritual-weapon', 7, 4)['伤害'], /^2d8/);
assert.match(cast('hail-of-thorns', 17, 9)['伤害'], /^6d10/);
assert.match(cast('shadow-blade', 17, 8)['伤害'], /^5d8/);
assert.match(cast('summon-beast', 7, 4)['伤害'], /1d8 \+ 8 穿刺/);
assert.equal(cast('summon-beast', 7, 4)['召唤物多重攻击'], '2 次');
assert.match(cast('summon-beast', 7, 4)['召唤物命中'], /^d20/);
assert.match(cast('magic-missile', 7, 4)['伤害'], /6 枚，每枚 1d4 \+ 1/);
assert.equal(cast('magic-missile', 7, 4)['法术命中公式'], undefined);
for (const item of Object.values(api.coreRules.items)) {
  const card = api.catalogueRuleCard('shopItem', {id:item.id,title:item.name});
  assert.match(card.art, /<svg |<img /);
  assert.ok(card.sections[0].facts.some(([label,value]) => label === '参考价格' && value === item.cost + ' gp'));
  if (item.kind === 'weapon') assert.ok(card.sections[0].facts.some(([label, value]) => label === '武器特性' && value));
  if (item.kind === 'armor') assert.ok(card.sections[0].facts.some(([label, value]) => label === 'AC' && value));
}
const potion = api.coreRules.items['healing-potion'];
const firstShopVisit = api.equipmentSummary(potion, true);
assert.match(firstShopVisit, /2d4 \+ 2 HP/);
assert.equal(api.equipmentSummary(potion, true), firstShopVisit, 'reopening the shop does not duplicate price or weight');
const portable = api.portableRuleDocument(api.catalogueRuleCard('job', {id:'rogue',title:'游荡者'}));
assert.match(portable, /<h1>游荡者<\/h1>/);
assert.match(portable, /逐级职业能力/);
assert.match(portable, /data:image\/webp;base64,/);
assert.doesNotMatch(portable, /<script|character-seed|localStorage/);
for (const job of Object.values(api.coreRules.classes)) for (const group of job.equipment) for (const option of group.options) {
  for (const entry of option.items ?? []) assert.ok(api.coreRules.items[entry.id], entry.id);
}
console.log('Passed core data, 12 × 20 class levels, numeric regressions, invocation replacement, migration and archives.');

const expansion = vm.runInContext(`({expansionAncestryRules, expansionBackgroundRules, expansionSubclassRules,
  expansionFeatRules, legacyRaceOptions, legacyBackgrounds, legacySubclasses, legacyFeatNames})`, context);
const plain = card => card.sections.flatMap(section => [...section.text, ...section.entries.flat()]).join(' ');
for (const id of ['changeling', ...Object.keys(expansion.legacyRaceOptions)]) assert.ok(expansion.expansionAncestryRules[id]?.length, id);
for (const [name,,,,,source] of expansion.legacyBackgrounds) if (!source.startsWith('玩家手册/') || ['间谍','角斗士','公会商人','骑士','海盗'].includes(name)) {
  assert.ok(expansion.expansionBackgroundRules[name]?.length, name);
}
for (const [job, choices] of Object.entries(expansion.legacySubclasses)) for (const [name, book] of choices) {
  if (book === '玩家手册' || job === 'rogue') continue;
  assert.ok(expansion.expansionSubclassRules[job]?.[name]?.length, name);
}
for (const [, names] of expansion.legacyFeatNames.slice(1)) for (const name of names) assert.ok(expansion.expansionFeatRules[name]?.length, name);
api.setJob('fighter');
const rune = api.catalogueRuleCard('careerSubclass', {id:'符文骑士',title:'符文骑士'});
assert.match(plain(rune), /云雾符文.*反应/);
assert.match(plain(rune), /1d10/);
assert.ok(rune.sections.some(section => section.title.startsWith('18 级')));
assert.match(plain(api.catalogueRuleCard('ancestry', {id:'changeling',title:'幻身灵 · 艾伯伦'})), /保持中型/);
assert.match(plain(api.catalogueRuleCard('ancestry', {id:'mpmm-changeling',title:'幻身灵 · 多元宇宙'})), /小型与中型间变换/);
assert.match(plain(api.catalogueRuleCard('background', {id:'船工',title:'船工'})), /5 × 熟练加值/);
assert.match(plain(api.catalogueRuleCard('plan.feat', {id:'catalog:巨人打击',title:'巨人打击'})), /长休/);
assert.match(plain(api.catalogueRuleCard('job', {id:'artificer',title:'奇械师'})), /人工生命仆从/);
api.setJob('bloodhunter');
assert.match(plain(api.catalogueRuleCard('careerSubclass', {id:'化狼结社',title:'化狼结社'})), /混种形态.*短休或长休/);
const tableMistake = build({job:'fighter', plans:{fighter:{4:{feat:'catalog:位面注能',stat:0}}}});
assert.equal(tableMistake.plans.fighter[4].feat, '');
assert.equal(tableMistake.plans.fighter[4].stat, -1);
assert.match(tableMistake.plans.fighter[4].note, /外层位面后裔/);
console.log('Passed expansion coverage, offline rules, edition split, embedded drawings and legacy feat migration.');
