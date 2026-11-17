// Sources on the reference site for the 2014 rules family. Reprints stay separate.
const raceBooks = {
  phb: ['玩家手册 2014', '玩家手册/种族/'],
  scag: ['剑湾冒险者指南', '剑湾冒险者指南/种族/'],
  volo: ['瓦罗怪物指南', '瓦罗怪物指南/玩家可用种族/'],
  tome: ['魔邓肯的众敌卷册', '魔邓肯的众敌卷册/玩家可用种族/'],
  eberron: ['艾伯伦：从终末战争中崛起', '艾伯伦：从终末战争中崛起/第一章/种族/'],
  ravnica: ['拉尼卡公会长指南', '拉尼卡公会长指南/'],
  theros: ['塞洛斯之神话奥德赛', '塞洛斯之神话奥德赛/角色选项/种族/'],
  wildemount: ['荒洲探险家指南', '荒洲探险家指南/角色选项/种族/'],
  multiverse: ['多元宇宙的怪物', '多元宇宙的怪物/种族/'],
  spelljammer: ['星界冒险者指南', '星界冒险者指南/'],
  ravenloft: ['范·里希腾的鸦阁魔域指南', '范·里希腾的鸦阁魔域指南/角色创建/'],
  fizban: ['费资本的巨龙宝库', '费资本的巨龙宝库/玩家选项/'],
  witchlight: ['妖精荒野之外', '模组/巫光/'],
  dragonlance: ['龙枪：龙后之影', '龙枪：龙后之影/创立角色/'],
  tasha: ['塔莎的万事坩埚', '塔莎的万事坩埚/玩家选项/'],
  humblewood: ['谦卑林 · 第三方', '第三方/谦卑林/种族/'],
};

// Fixed bonuses use 力量 / 敏捷 / 体质 / 智力 / 感知 / 魅力 order.
const legacyRaceOptions = {
  variantHuman: {name: '变体人类', book: 'phb', file: '人类.html', boost: 'two', picks: 1, languagePicks: 1, note: '变体规则还给你一个专长，请在 1 级补记。'},
  ghostwise: {name: '鬼智半身人', book: 'scag', file: '鬼智半身人.htm', bonus: [0,2,0,0,1,0], speed: 25, languages: ['通用语','半身人语'], shape: 'lightfoot'},
  oldDuergar: {name: '灰矮人', book: 'scag', file: '灰矮人.htm', bonus: [1,0,2,0,0,0], speed: 25, languages: ['通用语','矮人语','地底通用语'], shape: 'hillDwarf'},
  oldDeepGnome: {name: '地底侏儒', book: 'scag', file: '地底侏儒.htm', bonus: [0,1,0,2,0,0], speed: 25, languages: ['通用语','侏儒语','地底通用语'], shape: 'rockGnome'},
  oldEladrin: {name: '雅灵', book: 'tome', file: '精灵-亚种（玩家可选）.html', bonus: [0,2,0,0,0,1], skills: ['察觉'], languages: ['通用语','精灵语'], shape: 'highElf'},
  oldSeaElf: {name: '海精灵', book: 'tome', file: '精灵-亚种（玩家可选）.html', bonus: [0,2,1,0,0,0], skills: ['察觉'], languages: ['通用语','精灵语','水族语'], shape: 'woodElf'},
  oldShadarKai: {name: '影灵', book: 'tome', file: '精灵-亚种（玩家可选）.html', bonus: [0,2,1,0,0,0], skills: ['察觉'], languages: ['通用语','精灵语'], shape: 'drow'},
  oldGithyanki: {name: '吉斯洋基人', book: 'tome', file: '吉斯人角色（玩家可选）.html', bonus: [2,0,0,1,0,0], note: '可选一项技能或工具熟练。', languages: ['通用语','吉斯语'], languagePicks: 1},
  oldGithzerai: {name: '吉斯泽莱人', book: 'tome', file: '吉斯人角色（玩家可选）.html', bonus: [0,0,0,1,2,0], languages: ['通用语','吉斯语']},
  protectorAasimar: {name: '守护阿斯莫', book: 'volo', file: '阿斯莫.html', bonus: [0,0,0,0,1,2], languages: ['通用语','天界语']},
  scourgeAasimar: {name: '灾厄阿斯莫', book: 'volo', file: '阿斯莫.html', bonus: [0,0,1,0,0,2], languages: ['通用语','天界语']},
  fallenAasimar: {name: '堕落阿斯莫', book: 'volo', file: '阿斯莫.html', bonus: [1,0,0,0,0,2], languages: ['通用语','天界语']},
  oldFirbolg: {name: '费尔伯格人', book: 'volo', file: '费尔伯格人.html', bonus: [1,0,0,0,2,0], languages: ['通用语','精灵语','巨人语']},
  oldGoliath: {name: '歌利亚', book: 'volo', file: '歌利亚.html', bonus: [2,0,1,0,0,0], skills: ['运动'], languages: ['通用语','巨人语'], shape: 'halfOrc'},
  oldKenku: {name: '天狗', book: 'volo', file: '天狗.html', bonus: [0,2,0,0,1,0], pool: ['特技','欺瞒','隐匿','巧手'], picks: 2, languages: ['通用语','气族语']},
  oldLizardfolk: {name: '蜥蜴人', book: 'volo', file: '蜥蜴人.html', bonus: [0,0,2,0,1,0], pool: ['驯兽','自然','察觉','隐匿','求生'], picks: 2, languages: ['通用语','龙语'], naturalArmor: [13,1], shape: 'dragonborn'},
  oldTabaxi: {name: '斑猫人', book: 'volo', file: '斑猫人.html', bonus: [0,2,0,0,0,1], skills: ['察觉','隐匿'], languagePicks: 1, shape: 'highElf'},
  oldTriton: {name: '梭螺鱼人', book: 'volo', file: '梭螺鱼人.html', bonus: [1,0,1,0,0,1], languages: ['通用语','原初语']},
  oldBugbear: {name: '熊地精', book: 'volo', file: '怪物冒险者/熊地精.htm', bonus: [2,1,0,0,0,0], skills: ['隐匿'], languages: ['通用语','地精语'], shape: 'halfOrc'},
  oldGoblin: {name: '地精', book: 'volo', file: '怪物冒险者/地精.htm', bonus: [0,2,1,0,0,0], languages: ['通用语','地精语'], shape: 'forestGnome'},
  oldHobgoblin: {name: '大地精', book: 'volo', file: '怪物冒险者/大地精.htm', bonus: [0,0,2,1,0,0], languages: ['通用语','地精语']},
  oldKobold: {name: '狗头人', book: 'volo', file: '怪物冒险者/狗头人.htm', bonus: [0,2,0,0,0,0], languages: ['通用语','龙语'], shape: 'forestGnome'},
  oldOrc: {name: '兽人', book: 'volo', file: '怪物冒险者/兽人.htm', bonus: [2,0,1,0,0,0], picks: 2, pool: ['驯兽','洞悉','威吓','医药','自然','察觉','求生'], languages: ['通用语','兽人语'], shape: 'halfOrc'},
  oldYuanTi: {name: '纯血原体蛇人', book: 'volo', file: '怪物冒险者/纯血原体蛇人.htm', bonus: [0,0,0,1,0,2], languages: ['通用语','深渊语','龙语']},
  kalashtar: {name: '离梦人', book: 'eberron', file: '离梦人.htm', bonus: [0,0,0,0,2,1], languages: ['通用语','梦灵语'], languagePicks: 1},
  warforged: {name: '战俑', book: 'eberron', file: '战俑.htm', bonus: [0,0,2,0,0,0], boost: 'single', picks: 1, languagePicks: 1, armorBonus: 1},
  beasthide: {name: '兽皮化兽者', book: 'eberron', file: '化兽者.htm', bonus: [1,0,2,0,0,0], skills: ['运动'], shape: 'halfOrc'},
  longtooth: {name: '长牙化兽者', book: 'eberron', file: '化兽者.htm', bonus: [2,1,0,0,0,0], skills: ['威吓'], shape: 'halfOrc'},
  swiftstride: {name: '迅步化兽者', book: 'eberron', file: '化兽者.htm', bonus: [0,2,0,0,0,1], skills: ['特技']},
  wildhunt: {name: '野猎化兽者', book: 'eberron', file: '化兽者.htm', bonus: [0,1,0,0,2,0], skills: ['求生']},
  loxodon: {name: '象族', book: 'ravnica', file: '象族.htm', bonus: [0,0,2,0,1,0], languages: ['通用语','象族语'], naturalArmor: [12,2], shape: 'halfOrc'},
  simic: {name: '析米克混生体', book: 'ravnica', file: '析米克混生体.htm', bonus: [0,0,2,0,0,0], boost: 'single', languagePicks: 1, languagePool: ['维多肯语','精灵语']},
  vedalken: {name: '维多肯', book: 'ravnica', file: '维多肯.htm', bonus: [0,0,0,2,1,0], pool: ['奥秘','历史','调查','医药','表演','巧手'], picks: 1, languages: ['通用语','维多肯语'], languagePicks: 1},
  oldCentaur: {name: '人马', book: 'theros', file: '人马.htm', bonus: [2,0,0,0,1,0], speed: 40, pool: ['驯兽','医药','自然','求生'], picks: 1, languages: ['通用语','木族语']},
  oldMinotaur: {name: '牛头人', book: 'ravnica', file: '牛头人.htm', bonus: [2,0,1,0,0,0], pool: ['威吓','游说'], picks: 1, languages: ['通用语','米诺陶语'], shape: 'tiefling'},
  leonin: {name: '狮族', book: 'theros', file: '狮族.htm', bonus: [1,0,2,0,0,0], speed: 35, pool: ['运动','威吓','察觉','求生'], picks: 1, languages: ['通用语','狮族语'], shape: 'halfOrc'},
  oldSatyr: {name: '半羊人', book: 'theros', file: '半羊人.htm', bonus: [0,1,0,0,0,2], speed: 35, skills: ['表演','游说'], languages: ['通用语','木族语'], shape: 'tiefling'},
  oldAarakocra: {name: '阿兰寇拉鹰人', book: 'wildemount', file: '阿兰寇拉鹰人.htm', bonus: [0,2,0,0,1,0], speed: 25, languages: ['通用语','阿兰寇拉语','气族语']},
  vulpin: {name: '狡狐族', book: 'humblewood', file: '狡狐族.htm', bonus: [0,0,0,2,0,1], languages: ['鸟族语','狡狐语']},
  customLineage: {name: '自定义血统', book: 'tasha', file: '定制血统.htm', boost: 'plusTwo', languagePicks: 1, note: '按原书选择黑暗视觉或一项技能熟练，并把起始专长记在 1 级。'},
};

const natureSkills = ['驯兽','医药','自然','察觉','隐匿','求生'];
const multiverseRaces = [
  ['aarakocra','阿兰寇拉鹰人'], ['bugbear','熊地精',{skills:['隐匿'],shape:'halfOrc'}],
  ['centaur','人马',{speed:40,pool:['驯兽','医药','自然','求生'],picks:1}],
  ['deepGnome','地底侏儒',{shape:'rockGnome'}], ['duergar','灰矮人',{shape:'hillDwarf'}],
  ['eladrin','雅灵',{skills:['察觉'],shape:'highElf'}], ['fairy','仙灵',{shape:'forestGnome'}],
  ['firbolg','费尔伯格人',{shape:'halfOrc'}], ['githyanki','吉斯洋基人'], ['githzerai','吉斯泽莱人'],
  ['goblin','地精',{shape:'forestGnome'}], ['harengon','兔人',{skills:['察觉']}],
  ['hobgoblin','大地精'], ['kenku','天狗',{picks:2}],
  ['kobold','狗头人',{shape:'forestGnome',note:'狗头人传承为三选一。选择机智时，可在种族补记中添加一项指定技能。'}],
  ['lizardfolk','蜥蜴人',{pool:natureSkills,picks:2,naturalArmor:[13,1],shape:'dragonborn'}],
  ['minotaur','牛头人',{shape:'tiefling'}], ['satyr','半羊人',{speed:35,skills:['表演','游说'],shape:'tiefling'}],
  ['seaElf','海精灵',{skills:['察觉'],shape:'woodElf'}], ['shadarKai','影灵',{skills:['察觉'],shape:'drow'}],
  ['tabaxi','斑猫人',{skills:['察觉','隐匿'],shape:'highElf'}],
  ['tortle','龟人',{pool:natureSkills,picks:1,naturalArmor:[17,null]}], ['triton','梭螺鱼人'],
  ['yuanTi','原体蛇人'], ['aasimar','阿斯莫'],
  ['changeling','幻身灵',{pool:['欺瞒','洞悉','威吓','表演','游说'],picks:2}],
  ['goliath','歌利亚',{skills:['运动'],shape:'halfOrc'}], ['orc','兽人',{shape:'halfOrc'}],
  ['shifter','化兽者',{pool:['特技','运动','威吓','求生'],picks:1}],
  ...[['airGenasi','气元素裔',35],['earthGenasi','土元素裔',30],['fireGenasi','火元素裔',30],['waterGenasi','水元素裔',30]]
    .map(([id,name,speed])=>[id,name,{speed,file:'元素裔.html'}]),
];
for (const [id,name,traits] of multiverseRaces) {
  legacyRaceOptions['mpmm-' + id] = {name,book:'multiverse',file:name + '.html',boost:'flex',languagePicks:1,...traits};
}
for (const [id,name,book,file,traits] of [
  ['astralElf','星界精灵','spelljammer','星界精灵.htm',{skills:['察觉'],shape:'highElf'}],
  ['autognome','自动侏儒','spelljammer','自动侏儒.htm',{naturalArmor:[13,1],shape:'rockGnome'}],
  ['hadozee','鼯猴人','spelljammer','鼯猴人.htm'], ['giff','诘弗人','spelljammer','诘弗人.htm',{shape:'halfOrc'}],
  ['plasmoid','流浆体','spelljammer','流浆体.htm'], ['thriKreen','螳螂人','spelljammer','螳螂人.htm'],
  ['dhampir','半血裔','ravenloft','半血裔.htm',{speed:35,note:'先祖遗赠可保留原技能及适用的移动速度，或选两项技能。'}],
  ['hexblood','巫咒之子','ravenloft','巫咒之子.htm',{note:'先祖遗赠可保留原技能及适用的移动速度，或选两项技能。'}],
  ['reborn','复生者','ravenloft','复生者.htm',{note:'先祖遗赠可保留原技能及适用的移动速度，或选两项技能。'}],
  ['chromaticDragon','色彩龙裔','fizban','色彩龙裔.htm',{shape:'dragonborn'}],
  ['metallicDragon','金属龙裔','fizban','金属龙裔.htm',{shape:'dragonborn'}],
  ['gemDragon','宝石龙裔','fizban','宝石龙裔.htm',{shape:'dragonborn'}],
  ['witchFairy','仙灵','witchlight','仙灵.htm',{shape:'forestGnome'}],
  ['witchHarengon','兔人','witchlight','兔人.htm',{skills:['察觉']}],
  ['kender','坎德人','dragonlance','新种族.htm',{pool:['洞悉','调查','巧手','隐匿','求生'],picks:1,shape:'lightfoot'}],
]) legacyRaceOptions[id] = {name,book,file,boost:'flex',languagePicks:1,...traits};

Object.assign(raceBooks, {
  dragonmark: ['艾伯伦龙纹', '艾伯伦：从终末战争中崛起/第一章/龙纹/'],
  strixhaven: ['斯翠海文：混沌研习', '斯翠海文：混沌研习/玩家选项/'],
  acquisitions: ['艾奎兹玄有限责任公司', '艾奎兹玄有限责任公司/玩家选项/'],
  locathah: ['洛卡鱼人的崛起', '模组/洛卡鱼人的崛起/'],
});
for (const [id, name, bonus, traits] of [
  ['detection','侦测龙纹',[0,0,0,0,2,0],{boost:'single',shape:'halfElf',languages:['通用语','精灵语'],languagePicks:1}],
  ['finding','探寻龙纹',[0,0,1,0,2,0],{languages:['通用语','地精语']}],
  ['handling','畜牧龙纹',[0,0,0,0,2,0],{boost:'single',languagePicks:1}],
  ['healing','医疗龙纹',[0,2,0,0,1,0],{speed:25,shape:'lightfoot',languages:['通用语','半身人语']}],
  ['hospitality','招待龙纹',[0,2,0,0,0,1],{speed:25,shape:'lightfoot',languages:['通用语','半身人语']}],
  ['making','创造龙纹',[0,0,0,2,0,0],{boost:'single',languagePicks:1}],
  ['passage','通行龙纹',[0,2,0,0,0,0],{boost:'single',speed:35,languagePicks:1}],
  ['scribing','抄录龙纹',[0,0,0,2,0,1],{speed:25,shape:'rockGnome',languages:['通用语','侏儒语'],languagePicks:1}],
  ['sentinel','哨戒龙纹',[0,0,2,0,1,0],{languagePicks:1}],
  ['shadow','阴影龙纹',[0,2,0,0,0,1],{skills:['察觉'],shape:'highElf',languages:['通用语','精灵语']}],
  ['storm','暴风龙纹',[0,1,0,0,0,2],{shape:'halfElf',languages:['通用语','精灵语'],languagePicks:1}],
  ['warding','守御龙纹',[0,0,2,1,0,0],{speed:25,shape:'hillDwarf',languages:['通用语','矮人语']}],
]) legacyRaceOptions['mark-' + id] = {name, book:'dragonmark', file:name + '.htm', bonus, ...traits};
for (const [id, name, ability] of [
  ['baalzebul','巴尔泽布',3], ['dispater','迪斯帕特',1], ['fierna','菲尔娜',4],
  ['glasya','格莱西雅',1], ['levistus','莱维斯图斯',2], ['mammon','马曼',3],
  ['mephistopheles','墨菲斯托菲利斯',3], ['zariel','扎瑞尔',0],
]) {
  const bonus = [0,0,0,0,0,2];
  bonus[ability] = 1;
  legacyRaceOptions['tiefling-' + id] = {name:name + '血统提夫林',book:'tome',
    file:'提夫林亚种（玩家可选）.html',bonus,languages:['通用语','炼狱语'],shape:'tiefling'};
}
Object.assign(legacyRaceOptions, {
  owlin: {name:'枭人',book:'strixhaven',file:'种族-枭人.html',boost:'flex',skills:['隐匿'],languagePicks:1},
  verdan: {name:'佛丹人',book:'acquisitions',file:'种族-佛丹人.html',bonus:[0,0,1,0,0,2],skills:['游说'],languages:['通用语','地精语'],languagePicks:1,shape:'forestGnome'},
  locathah: {name:'洛卡鱼人',book:'locathah',file:'洛卡鱼人.html',bonus:[2,1,0,0,0,0],skills:['运动','察觉'],languages:['通用语','水族语'],naturalArmor:[12,1]},
  scagHalfElf: {name:'半精灵血统变体',book:'scag',file:'半精灵变体.htm',bonus:[0,0,0,0,0,2],boost:'twoOther',
    languages:['通用语','精灵语'],languagePicks:1,shape:'halfElf',note:'按原文选择代替多才多艺的精灵血统特质。'},
  feralTiefling: {name:'狂野提夫林',book:'scag',file:'提夫林变体.htm',bonus:[0,2,0,1,0,0],languages:['通用语','炼狱语'],shape:'tiefling'},
});
