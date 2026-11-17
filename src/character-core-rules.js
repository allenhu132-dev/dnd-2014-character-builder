// 2014 PHB facts, paraphrased for offline character creation. No adventure content.
const coreRules = (() => {
  const source = '2014 玩家手册';
  const rule = (name, desc, effects = {}) => ({name, desc, effects, status: Object.keys(effects).length ? 'auto' : 'rules', source});
  const item = (id, quantity = 1) => ({id, quantity});
  const option = (id, name, items = [], note = '') => ({id, name, items, note});
  const pick = (id, name, pool, count = 1) => ({id, name, items: [], pick: {type: 'weapon', pool, count}});
  const equipment = (id, label, options) => ({id, label, options});
  const items = {};
  const weapon = (id, name, type, category, damage, damageType, cost, weight, properties = [], range = null, versatile = '') => {
    items[id] = {id, name, type, category, damage, damageType, cost, weight, properties, range, versatile, kind: 'weapon'};
  };
  [
    ['club','木棒','simple','melee','1d4','钝击',.1,2,['light']],
    ['dagger','匕首','simple','melee','1d4','穿刺',2,1,['finesse','light','thrown'],[20,60]],
    ['greatclub','巨棒','simple','melee','1d8','钝击',.2,10,['two-handed']],
    ['handaxe','手斧','simple','melee','1d6','挥砍',5,2,['light','thrown'],[20,60]],
    ['javelin','标枪','simple','melee','1d6','穿刺',.5,2,['thrown'],[30,120]],
    ['light-hammer','轻锤','simple','melee','1d4','钝击',2,2,['light','thrown'],[20,60]],
    ['mace','硬头锤','simple','melee','1d6','钝击',5,4],
    ['quarterstaff','长棍','simple','melee','1d6','钝击',.2,4,['versatile'],null,'1d8'],
    ['sickle','镰刀','simple','melee','1d4','挥砍',1,2,['light']],
    ['spear','矛','simple','melee','1d6','穿刺',1,3,['thrown','versatile'],[20,60],'1d8'],
    ['light-crossbow','轻弩','simple','ranged','1d8','穿刺',25,5,['ammunition','loading','two-handed'],[80,320]],
    ['dart','飞镖','simple','ranged','1d4','穿刺',.05,.25,['finesse','thrown'],[20,60]],
    ['shortbow','短弓','simple','ranged','1d6','穿刺',25,2,['ammunition','two-handed'],[80,320]],
    ['sling','投石索','simple','ranged','1d4','钝击',.1,0,['ammunition'],[30,120]],
    ['battleaxe','战斧','martial','melee','1d8','挥砍',10,4,['versatile'],null,'1d10'],
    ['flail','链枷','martial','melee','1d8','钝击',10,2],
    ['glaive','长柄刀','martial','melee','1d10','挥砍',20,6,['heavy','reach','two-handed']],
    ['greataxe','巨斧','martial','melee','1d12','挥砍',30,7,['heavy','two-handed']],
    ['greatsword','巨剑','martial','melee','2d6','挥砍',50,6,['heavy','two-handed']],
    ['halberd','戟','martial','melee','1d10','挥砍',20,6,['heavy','reach','two-handed']],
    ['lance','骑枪','martial','melee','1d12','穿刺',10,6,['reach','special']],
    ['longsword','长剑','martial','melee','1d8','挥砍',15,3,['versatile'],null,'1d10'],
    ['maul','巨锤','martial','melee','2d6','钝击',10,10,['heavy','two-handed']],
    ['morningstar','钉头锤','martial','melee','1d8','穿刺',15,4],
    ['pike','长枪','martial','melee','1d10','穿刺',5,18,['heavy','reach','two-handed']],
    ['rapier','刺剑','martial','melee','1d8','穿刺',25,2,['finesse']],
    ['scimitar','弯刀','martial','melee','1d6','挥砍',25,3,['finesse','light']],
    ['shortsword','短剑','martial','melee','1d6','穿刺',10,2,['finesse','light']],
    ['trident','三叉戟','martial','melee','1d6','穿刺',5,4,['thrown','versatile'],[20,60],'1d8'],
    ['war-pick','战镐','martial','melee','1d8','穿刺',5,2],
    ['warhammer','战锤','martial','melee','1d8','钝击',15,2,['versatile'],null,'1d10'],
    ['whip','鞭','martial','melee','1d4','挥砍',2,3,['finesse','reach']],
    ['blowgun','吹箭筒','martial','ranged','1','穿刺',10,1,['ammunition','loading'],[25,100]],
    ['hand-crossbow','手弩','martial','ranged','1d6','穿刺',75,3,['ammunition','light','loading'],[30,120]],
    ['heavy-crossbow','重弩','martial','ranged','1d10','穿刺',50,18,['ammunition','heavy','loading','two-handed'],[100,400]],
    ['longbow','长弓','martial','ranged','1d8','穿刺',50,2,['ammunition','heavy','two-handed'],[150,600]],
    ['net','捕网','martial','ranged','','',1,3,['special','thrown'],[5,15]],
  ].forEach(args => weapon(...args));
  const armor = (id,name,type,baseAC,dexCap,strength,stealthDisadvantage,cost,weight) => {
    items[id] = {id,name,type,baseAC,dexCap,strength,stealthDisadvantage,cost,weight,kind:'armor'};
  };
  [
    ['padded','布甲','light',11,'all',0,true,5,8],['leather','皮甲','light',11,'all',0,false,10,10],
    ['studded-leather','镶钉皮甲','light',12,'all',0,false,45,13],['hide','兽皮甲','medium',12,2,0,false,10,12],
    ['chain-shirt','链甲衫','medium',13,2,0,false,50,20],['scale-mail','鳞甲','medium',14,2,0,true,50,45],
    ['breastplate','胸甲','medium',14,2,0,false,400,20],['half-plate','半身板甲','medium',15,2,0,true,750,40],
    ['ring-mail','环甲','heavy',14,null,0,true,30,40],['chain-mail','链甲','heavy',16,null,13,true,75,55],
    ['splint','条板甲','heavy',17,null,15,true,200,60],['plate','板甲','heavy',18,null,15,true,1500,65],
    ['shield','盾牌','shield',2,null,0,false,10,6],
  ].forEach(args => armor(...args));
  [
    ['arrows','箭（20支）',1,1],['bolts','弩矢（20支）',1,1.5],['sling-bullets','投石索弹丸（20枚）',.04,1.5],
    ['backpack','背包',2,5],['bedroll','睡袋',1,7],['blanket','毯子',.5,3],['crowbar','撬棍',2,5],
    ['torch','火把',.01,1],['ration','干粮（1日）',.5,2],['waterskin','水袋',.2,5],['hempen-rope','麻绳（50尺）',1,10],
    ['thieves-tools','盗贼工具',25,1],['disguise-kit','易容工具',25,3],['forgery-kit','文书伪造工具',15,5],
    ['herbalism-kit','草药工具',5,3],['poisoners-kit','制毒工具',50,2],['navigators-tools','领航工具',25,2],
    ['smiths-tools','铁匠工具',20,8],['brewers-supplies','酿酒工具',20,9],['masons-tools','石匠工具',10,8],
    ['dungeoneers-pack','地城套组',12,61.5],['explorers-pack','探索套组',10,59],['burglars-pack','窃贼套组',16,47.5],
    ['diplomats-pack','外交套组',39,36],['entertainers-pack','艺人套组',40,38],['priests-pack','祭司套组',19,24],
    ['scholars-pack','学者套组',40,10],['component-pouch','施法材料包',25,2],['arcane-focus','奥术法器（法杖）',5,4],
    ['druidic-focus','德鲁伊法器（槲寄生）',1,0],['holy-symbol','圣徽（护符）',5,1],['spellbook','法术书',50,3],
    ['lute','鲁特琴',35,2],['flute','长笛',2,1],['drum','鼓',6,3],['viol','提琴',30,1],
    ['gaming-set','骰子套组',.1,0],['fine-clothes','高档服装',15,6],['common-clothes','普通服装',.5,3],
    ['travelers-clothes','旅行者服装',2,4],['healers-kit','医疗工具（10次）',5,3],['healing-potion','治疗药水',50,.5],
    ['lantern','有罩提灯',5,2],['oil','灯油（1品脱）',.1,1],['tinderbox','火绒盒',.5,1],['mess-kit','餐具',.2,1],
    ['hammer','锤子',1,3],['pitons','岩钉（10枚）',.5,2.5],['caltrops','铁蒺藜（20枚）',1,2],['ball-bearings','滚珠（1000枚）',1,2],
  ].forEach(([id,name,cost,weight]) => {items[id] = {id,name,cost,weight,kind:'gear'};});
  const gear = (id,name,cost,weight,note='') => {items[id] = {id,name,cost,weight,note,kind:'gear'};};
  [
    ['blowgun-needles','吹箭（50支）',1,1],['focus-crystal','奥术法器（水晶）',10,1],['focus-orb','奥术法器（宝珠）',20,3],
    ['focus-rod','奥术法器（权杖）',10,2],['focus-wand','奥术法器（魔杖）',10,1],['druidic-totem','德鲁伊法器（图腾）',1,0],
    ['druidic-staff','德鲁伊法器（木杖）',5,4],['druidic-wand','德鲁伊法器（紫杉魔杖）',10,1],['holy-emblem','圣徽（纹章）',5,0],
    ['holy-reliquary','圣徽（圣物盒）',5,2],['abacus','算盘',2,2],['acid','强酸（小瓶）',25,1,'以临时武器攻击，命中2d6强酸。'],
    ['alchemists-fire','炼金火（瓶）',50,1,'投掷命中后目标回合开始受1d4火焰，可动作做DC10敏捷检定扑灭。'],
    ['antitoxin','解毒剂（小瓶）',50,0,'饮用后1小时对抗毒素豁免有优势；亡灵与构装无效。'],
    ['barrel','木桶',2,70],['basket','篮子',.4,2],['bell','铃铛',1,0],['block-and-tackle','滑轮组',1,5,'可吊起通常四倍的重量。'],
    ['book','书',25,5],['glass-bottle','玻璃瓶',2,2],['bucket','水桶',.05,2],['candle','蜡烛',.01,0,'燃烧1小时，5尺明光及额外5尺微光。'],
    ['bolt-case','弩矢筒',1,1],['scroll-case','图卷筒',1,1],['chain','铁链（10尺）',5,10],['chalk','粉笔',.01,0],['chest','箱子',5,25],
    ['climbers-kit','攀爬工具',25,12,'用动作固定自己，距固定点至多25尺。'],['costume','演出服',5,4],['fishing-tackle','钓具',1,4],
    ['flask','长颈瓶或酒杯',.02,1],['grappling-hook','抓钩',2,4],['sledgehammer','大锤',2,10],
    ['holy-water','圣水（瓶）',25,1,'以临时武器攻击命中邪魔或亡灵时造成2d6光耀。'],['hourglass','沙漏',25,1],
    ['hunting-trap','捕猎陷阱',5,25,'踩中时须做DC13敏捷豁免；失败受1d4穿刺并停止移动。'],['ink','墨水（1盎司）',10,0],
    ['ink-pen','墨水笔',.02,0],['jug','罐或壶',.02,4],['ladder','梯子（10尺）',.1,25],['lamp','灯',.5,1],
    ['bullseye-lantern','聚光提灯',10,2],['lock','锁',10,1],['magnifying-glass','放大镜',100,0],['manacles','镣铐',2,6],
    ['steel-mirror','钢镜',5,.5],['paper','纸（1张）',.2,0],['parchment','羊皮纸（1张）',.1,0],['perfume','香水（小瓶）',5,0],
    ['miners-pick','矿镐',2,10],['piton','岩钉（1枚）',.05,.25],['basic-poison','基础毒药（小瓶）',100,0],['pole','长杆（10尺）',.05,7],
    ['iron-pot','铁锅',2,10],['pouch','小袋',.5,1],['quiver','箭袋',1,1],['portable-ram','便携撞锤',4,35],['robes','长袍',1,4],
    ['silk-rope','丝绳（50尺）',10,5],['sack','布袋',.01,.5],['merchants-scale','商人秤',5,3],['sealing-wax','封蜡',.5,0],
    ['shovel','铲子',2,5],['signal-whistle','信号哨',.05,0],['signet-ring','印戒',5,0],['soap','肥皂',.02,0],
    ['iron-spikes','铁桩（10枚）',1,5],['spyglass','望远镜',1000,1],['tent','双人帐篷',2,20],['vial','小瓶',1,0],['whetstone','磨刀石',.01,1],
    ['alchemists-supplies','炼金工具',50,8],['calligraphers-supplies','书法工具',10,5],['carpenters-tools','木匠工具',8,6],
    ['cartographers-tools','制图工具',15,6],['cobblers-tools','鞋匠工具',5,5],['cooks-utensils','厨具',1,8],
    ['glassblowers-tools','玻璃工工具',30,5],['jewelers-tools','珠宝匠工具',25,2],['leatherworkers-tools','皮匠工具',5,5],
    ['painters-supplies','画具',10,5],['potters-tools','陶匠工具',10,3],['tinkers-tools','修补匠工具',50,10],
    ['weavers-tools','织布工具',1,5],['woodcarvers-tools','木雕工具',1,5],['dragonchess','龙棋套组',1,.5],
    ['playing-cards','纸牌套组',.5,0],['three-dragon-ante','三龙牌套组',1,0],
    ['bit-and-bridle','嚼子与缰绳',2,1],['carriage','马车',100,600],['cart','货车',15,200],['chariot','战车',250,100],
    ['feed','饲料（1日）',.05,10],['saddlebags','鞍袋',4,8],['sled','雪橇',20,300],['wagon','四轮货车',35,400],
    ['exotic-saddle','异种鞍',60,40],['military-saddle','军用鞍',20,30],['pack-saddle','驮鞍',5,15],['riding-saddle','骑乘鞍',10,25],
  ].forEach(args=>gear(...args));
  for (const [id,name,cost,speed,capacity] of [
    ['camel','骆驼',50,50,480],['mule','驴或骡',8,40,420],['elephant','象',200,40,1320],['draft-horse','挽马',50,40,540],
    ['riding-horse','乘用马',75,60,480],['mastiff','獒犬',25,40,195],['pony','小马',30,40,225],['warhorse','战马',400,60,540],
  ]) items[id]={id,name,cost,weight:0,kind:'mount',stats:[['步速', speed + ' 尺'], ['载重', capacity + ' 磅']]};
  for (const [id,name,cost,speed] of [
    ['galley','桨帆船',30000,4],['keelboat','龙骨船',3000,1],['longship','长船',10000,3],
    ['rowboat','划艇',50,1.5],['sailing-ship','帆船',10000,2],['warship','战舰',25000,2.5],
  ]) items[id]={id,name,cost,weight:id==='rowboat'?100:0,kind:'vehicle',stats:[['航速', speed + ' 英里/小时']]};
  Object.assign(items.lance,{note:'对5尺内目标攻击有劣势；未骑乘时必须双手持握。'});
  Object.assign(items.net,{note:'命中大型或更小且有固定形体的目标时使其束缚。可用动作做 DC 10 力量检定释放自己或触及内的生物，也可对 AC 10 的捕网造成 5 点挥砍伤害来破网。每次用于捕网攻击的动作、附赠动作或反应只能攻击一次。'});
  const gearEffects = {
    'healing-potion': {stats: [['恢复', '2d4 + 2 HP']], note: '喝下或喂给他人都需要一个动作。'},
    'healers-kit': {stats: [['次数', '10 次']], note: '以动作消耗一次用量，让生命值为 0 的生物稳定，无需医药检定。'},
    acid: {stats: [['伤害', '2d6 强酸'], ['泼洒 / 投掷', '5 / 20 尺']]},
    'alchemists-fire': {stats: [['每回合伤害', '1d4 火焰'], ['投掷距离', '20 尺'], ['扑灭检定', 'DC 10 敏捷']]},
    'holy-water': {stats: [['伤害', '2d6 光耀（邪魔或亡灵）'], ['泼洒 / 投掷', '5 / 20 尺']]},
    'hunting-trap': {stats: [['伤害', '1d4 穿刺'], ['触发豁免', 'DC 13 敏捷'], ['脱困检定', 'DC 13 力量']],
      note: '用动作设下。触发豁免失败会受伤并停下。被夹住后活动范围受铁链长度限制，通常为 3 尺。可用动作检定脱困或解救他人，失败时被困者再受 1 点穿刺伤害。'},
    'basic-poison': {stats: [['伤害', '1d4 毒素'], ['豁免', 'DC 10 体质'], ['生效时长', '1 分钟']],
      note: '用动作涂在一把挥砍或穿刺武器上，或涂在至多三发弹药上。命中后目标豁免失败才受毒素伤害。'},
    'ball-bearings': {stats: [['覆盖', '10 尺见方'], ['豁免', 'DC 10 敏捷']],
      note: '用动作洒在平地上。穿越时豁免失败会倒地，以半速穿过则免掷。'},
    caltrops: {stats: [['覆盖', '5 尺见方'], ['豁免', 'DC 15 敏捷'], ['伤害', '1 穿刺']],
      note: '用动作撒开。豁免失败会停步并受伤，步速减 10 尺，直到恢复至少 1 点生命值。以半速穿过免掷。'},
    torch: {stats: [['燃烧时间', '1 小时'], ['照明', '20 尺明光 + 20 尺微光'], ['近战命中', '1 火焰']]},
    lamp: {stats: [['每瓶油可燃烧', '6 小时'], ['照明', '15 尺明光 + 30 尺微光']]},
    lantern: {stats: [['每瓶油可燃烧', '6 小时'], ['照明', '30 尺明光 + 30 尺微光']], note: '用动作合上罩子，可将照明缩为 5 尺微光。'},
    'bullseye-lantern': {stats: [['每瓶油可燃烧', '6 小时'], ['锥形照明', '60 尺明光 + 60 尺微光']]},
    'hempen-rope': {stats: [['生命值', '2 HP'], ['扯断检定', 'DC 17 力量']]},
    'silk-rope': {stats: [['生命值', '2 HP'], ['扯断检定', 'DC 17 力量']]},
    backpack: {stats: [['容量', '1 立方尺 / 30 磅']]},
    quiver: {stats: [['容量', '20 支箭']]},
    lock: {stats: [['撬锁检定', 'DC 15 敏捷']], note: '无钥匙时，需要盗贼工具熟练才能用检定撬开。'},
  };
  for (const [id, effect] of Object.entries(gearEffects)) Object.assign(items[id], effect);
  for (const [id,contents] of Object.entries({
    'burglars-pack':[['backpack',1],['ball-bearings',1],['bell',1],['candle',5],['crowbar',1],['hammer',1],['piton',10],['lantern',1],['oil',2],['ration',5],['tinderbox',1],['waterskin',1],['hempen-rope',1]],
    'diplomats-pack':[['chest',1],['scroll-case',2],['fine-clothes',1],['ink',1],['ink-pen',1],['lamp',1],['oil',2],['paper',5],['perfume',1],['sealing-wax',1],['soap',1]],
    'dungeoneers-pack':[['backpack',1],['crowbar',1],['hammer',1],['piton',10],['torch',10],['tinderbox',1],['ration',10],['waterskin',1],['hempen-rope',1]],
    'entertainers-pack':[['backpack',1],['bedroll',1],['costume',2],['candle',5],['ration',5],['waterskin',1],['disguise-kit',1]],
    'explorers-pack':[['backpack',1],['bedroll',1],['mess-kit',1],['tinderbox',1],['torch',10],['ration',10],['waterskin',1],['hempen-rope',1]],
    'priests-pack':[['backpack',1],['blanket',1],['candle',10],['tinderbox',1],['ration',2],['waterskin',1]],
    'scholars-pack':[['backpack',1],['book',1],['ink',1],['ink-pen',1],['parchment',10]],
  })) {
    items[id].contents=contents.map(([id,quantity])=>item(id,quantity));
    items[id].note=items[id].contents.map(({id,quantity})=>`${items[id].name} × ${quantity}`).join('、')+
      ({'burglars-pack':'，另有10尺细绳。','priests-pack':'，另有施舍箱、两块熏香、香炉与祭服。','scholars-pack':'，另有一袋沙和小刀。'}[id]??'。');
    items[id].weight=contents.reduce((weight,[id,quantity])=>weight+items[id].weight*quantity,0);
  }
  const simple = count => pick('simple-'+count,'任选'+count+'件简易武器','simple',count);
  const martial = count => pick('martial-'+count,'任选'+count+'件军用武器','martial',count);
  const melee = count => pick('simple-melee-'+count,'任选'+count+'件简易近战武器','simple-melee',count);
  const pack = (a,b) => equipment('pack','冒险套组',[option(a,items[a].name,[item(a)]),option(b,items[b].name,[item(b)])]);
  const classes = {
    barbarian: {primary:[0,2],armor:['light','medium','shield'],weapons:['simple','martial'],tools:[],wealth:{count:2,dice:4,multiplier:10},equipment:[equipment('weapon','主武器',[option('axe','巨斧',[item('greataxe')]),pick('martial-melee','任意军用近战武器','martial-melee')]),equipment('sidearm','副武器',[option('axes','两把手斧',[item('handaxe',2)]),simple(1)])],fixedEquipment:[item('explorers-pack'),item('javelin',4)]},
    bard: {primary:[5,1],armor:['light'],weapons:['simple','hand-crossbow','longsword','rapier','shortsword'],tools:['自选三种乐器'],wealth:{count:5,dice:4,multiplier:10},equipment:[equipment('weapon','武器',[option('rapier','刺剑',[item('rapier')]),option('longsword','长剑',[item('longsword')]),simple(1)]),pack('diplomats-pack','entertainers-pack'),equipment('instrument','乐器',[option('lute','鲁特琴',[item('lute')]),{id:'instrument',name:'另一种乐器',items:[],pick:{type:'instrument',pool:'instrument',count:1}}])],fixedEquipment:[item('leather'),item('dagger')]},
    cleric: {primary:[4,2],armor:['light','medium','shield'],weapons:['simple'],tools:[],wealth:{count:5,dice:4,multiplier:10},equipment:[equipment('weapon','主武器',[option('mace','硬头锤',[item('mace')]),{...option('warhammer','战锤（须有熟练）',[item('warhammer')]),requiresWeapon:'warhammer'}]),equipment('armor','护甲',[option('scale','鳞甲',[item('scale-mail')]),option('leather','皮甲',[item('leather')]),{...option('chain','链甲（须重甲熟练）',[item('chain-mail')]),requiresArmor:'heavy'}]),equipment('sidearm','第二件武器',[option('crossbow','轻弩和20弩矢',[item('light-crossbow'),item('bolts')]),simple(1)]),pack('priests-pack','explorers-pack')],fixedEquipment:[item('shield'),item('holy-symbol')]},
    druid: {primary:[4,2],armor:['light','medium','shield'],weapons:['club','dagger','dart','javelin','mace','quarterstaff','scimitar','sickle','sling','spear'],tools:['草药工具'],wealth:{count:2,dice:4,multiplier:10},equipment:[equipment('shield','盾或武器',[option('shield','木盾',[item('shield')]),simple(1)]),equipment('weapon','主武器',[option('scimitar','弯刀',[item('scimitar')]),melee(1)])],fixedEquipment:[item('leather'),item('explorers-pack'),item('druidic-focus')],note:'德鲁伊不穿戴金属护甲，也不使用金属盾牌。'},
    fighter: {primary:[0,1,2],armor:['light','medium','heavy','shield'],weapons:['simple','martial'],tools:[],wealth:{count:5,dice:4,multiplier:10},equipment:[equipment('armor','护甲',[option('chain','链甲',[item('chain-mail')]),option('leather-bow','皮甲、长弓和20箭',[item('leather'),item('longbow'),item('arrows')])]),equipment('weapon','主武器',[]),equipment('sidearm','副武器',[option('crossbow','轻弩和20弩矢',[item('light-crossbow'),item('bolts')]),option('axes','两把手斧',[item('handaxe',2)])]),pack('dungeoneers-pack','explorers-pack')],fixedEquipment:[]},
    monk: {primary:[1,4],armor:[],weapons:['simple','shortsword'],tools:['自选一种工匠工具或乐器'],wealth:{count:5,dice:4,multiplier:1},equipment:[equipment('weapon','武器',[option('shortsword','短剑',[item('shortsword')]),simple(1)]),pack('dungeoneers-pack','explorers-pack')],fixedEquipment:[item('dart',10)]},
    paladin: {primary:[0,5],armor:['light','medium','heavy','shield'],weapons:['simple','martial'],tools:[],wealth:{count:5,dice:4,multiplier:10},equipment:[equipment('weapon','主武器',[]),equipment('sidearm','副武器',[option('javelins','五支标枪',[item('javelin',5)]),melee(1)]),pack('priests-pack','explorers-pack')],fixedEquipment:[item('chain-mail'),item('holy-symbol')]},
    ranger: {primary:[1,4],armor:['light','medium','shield'],weapons:['simple','martial'],tools:[],wealth:{count:5,dice:4,multiplier:10},equipment:[equipment('armor','护甲',[option('scale','鳞甲',[item('scale-mail')]),option('leather','皮甲',[item('leather')])]),equipment('weapon','近战武器',[option('shortswords','两把短剑',[item('shortsword',2)]),melee(2)]),pack('dungeoneers-pack','explorers-pack')],fixedEquipment:[item('longbow'),item('arrows')]},
    rogue: {primary:[1,3,5],armor:['light'],weapons:['simple','hand-crossbow','longsword','rapier','shortsword'],tools:['盗贼工具'],wealth:{count:4,dice:4,multiplier:10},equipment:[equipment('weapon','主武器',[option('rapier','刺剑',[item('rapier')]),option('shortsword','短剑',[item('shortsword')])]),equipment('sidearm','第二件武器',[option('bow','短弓和20箭',[item('shortbow'),item('arrows')]),option('shortsword','短剑',[item('shortsword')])]),equipment('pack','套组',['burglars-pack','dungeoneers-pack','explorers-pack'].map(id=>option(id,items[id].name,[item(id)])))],fixedEquipment:[item('leather'),item('dagger',2),item('thieves-tools')]},
    sorcerer: {primary:[5,2],armor:[],weapons:['dagger','dart','sling','quarterstaff','light-crossbow'],tools:[],wealth:{count:3,dice:4,multiplier:10},equipment:[equipment('weapon','主武器',[option('crossbow','轻弩和20弩矢',[item('light-crossbow'),item('bolts')]),simple(1)]),equipment('focus','施法材料',[option('pouch','材料包',[item('component-pouch')]),option('focus','奥术法器',[item('arcane-focus')])]),pack('dungeoneers-pack','explorers-pack')],fixedEquipment:[item('dagger',2)]},
    warlock: {primary:[5,2],armor:['light'],weapons:['simple'],tools:[],wealth:{count:4,dice:4,multiplier:10},equipment:[equipment('weapon','主武器',[option('crossbow','轻弩和20弩矢',[item('light-crossbow'),item('bolts')]),simple(1)]),equipment('focus','施法材料',[option('pouch','材料包',[item('component-pouch')]),option('focus','奥术法器',[item('arcane-focus')])]),pack('scholars-pack','dungeoneers-pack'),equipment('sidearm','另一件简易武器',[simple(1)])],fixedEquipment:[item('leather'),item('dagger',2)]},
    wizard: {primary:[3,2],armor:[],weapons:['dagger','dart','sling','quarterstaff','light-crossbow'],tools:[],wealth:{count:4,dice:4,multiplier:10},equipment:[equipment('weapon','武器',[option('staff','长棍',[item('quarterstaff')]),option('dagger','匕首',[item('dagger')])]),equipment('focus','施法材料',[option('pouch','材料包',[item('component-pouch')]),option('focus','奥术法器',[item('arcane-focus')])]),pack('scholars-pack','explorers-pack')],fixedEquipment:[item('spellbook')]},
  };
  for (const job of ['fighter','paladin']) {
    classes[job].equipment.find(entry=>entry.id==='weapon').options = [
      {...pick('weapon-shield','一件军用武器与盾牌','martial'),items:[item('shield')]},martial(2),
    ];
  }
  const races = {
    human: {features:[rule('多才的属性','六项属性各提高1。')],weapons:[],tools:[],senses:[]},
    variantHuman: {features:[rule('自选天赋','两项不同属性各提高1，一项技能熟练，以及一个符合前提的专长。')],weapons:[],tools:[],senses:[]},
    highElf: {features:[rule('妖精血统','对抗魅惑的豁免有优势，魔法不能令你入睡。'),rule('出神','按旧版官方答疑，冥想4小时可以完成长休。'),rule('附赠戏法','自选一个法师戏法，使用智力施放。')],weapons:['longsword','shortsword','shortbow','longbow'],tools:[],senses:['黑暗视觉60尺']},
    woodElf: {features:[rule('妖精血统','对抗魅惑的豁免有优势，魔法不能令你入睡。'),rule('出神','按旧版官方答疑，冥想4小时可以完成长休。'),rule('荒野面具','仅被树叶、大雨、落雪或雾等自然现象轻度遮蔽时，也能尝试躲藏。')],weapons:['longsword','shortsword','shortbow','longbow'],tools:[],senses:['黑暗视觉60尺']},
    drow: {features:[rule('妖精血统','对抗魅惑的豁免有优势，魔法不能令你入睡。'),rule('出神','按旧版官方答疑，冥想4小时可以完成长休。'),rule('日光敏感','你或目标在直射阳光下时，攻击检定及依赖视觉的察觉检定有劣势。'),rule('卓尔魔法','1级舞光术，3级妖火，5级黑暗术；魅力施法，后两者各每长休一次。')],weapons:['rapier','shortsword','hand-crossbow'],tools:[],senses:['黑暗视觉120尺']},
    hillDwarf: {features:[rule('矮人韧性','毒素伤害抗性，对抗中毒的豁免有优势。'),rule('石中精妙','涉及石质结构起源的历史检定按熟练并加入双倍熟练加值。'),rule('矮人刚毅','最大生命值每级额外增加1。',{hpPerLevel:1}),rule('稳健步伐','穿重甲时不因力量不足而降低速度。')],weapons:['battleaxe','handaxe','light-hammer','warhammer'],tools:['铁匠工具 / 酿酒工具 / 石匠工具三选一'],senses:['黑暗视觉60尺']},
    mountainDwarf: {features:[rule('矮人韧性','毒素伤害抗性，对抗中毒的豁免有优势。'),rule('石中精妙','涉及石质结构起源的历史检定按熟练并加入双倍熟练加值。'),rule('矮人护甲训练','获得轻甲与中甲熟练。',{armor:['light','medium']}),rule('稳健步伐','穿重甲时不因力量不足而降低速度。')],weapons:['battleaxe','handaxe','light-hammer','warhammer'],tools:['铁匠工具 / 酿酒工具 / 石匠工具三选一'],senses:['黑暗视觉60尺']},
    lightfoot: {features:[rule('幸运','攻击、属性检定或豁免的d20掷出1时可重掷一次，采用新结果。'),rule('勇气','对抗恐慌的豁免有优势。'),rule('半身人灵巧','能穿过体型比自己大的生物所在空间。'),rule('天生善匿','仅被至少比自己大一类的生物遮蔽时，也能尝试躲藏。')],weapons:[],tools:[],senses:[],size:'小型'},
    stout: {features:[rule('幸运','攻击、属性检定或豁免的d20掷出1时可重掷一次，采用新结果。'),rule('勇气','对抗恐慌的豁免有优势。'),rule('半身人灵巧','能穿过体型比自己大的生物所在空间。'),rule('强心韧性','毒素伤害抗性，对抗中毒的豁免有优势。')],weapons:[],tools:[],senses:[],size:'小型'},
    forestGnome: {features:[rule('侏儒狡黠','对抗魔法的智力、感知和魅力豁免有优势。'),rule('自然幻术师','掌握次级幻影，以智力施法。'),rule('小型兽类交谈','用声音和手势向小型或更小野兽表达简单想法。')],weapons:[],tools:[],senses:['黑暗视觉60尺'],size:'小型'},
    rockGnome: {features:[rule('侏儒狡黠','对抗魔法的智力、感知和魅力豁免有优势。'),rule('工匠学识','涉及魔法物品、炼金物品或技术装置的历史检定加入双倍熟练加值。'),rule('修补匠','1小时及10gp材料制作一种微型发条装置，最多同时3件，正常运转24小时。')],weapons:[],tools:['修补匠工具'],senses:['黑暗视觉60尺'],size:'小型'},
    halfElf: {features:[rule('妖精血统','对抗魅惑的豁免有优势，魔法不能令你入睡。'),rule('多才多艺','自选两项技能熟练。')],weapons:[],tools:[],senses:['黑暗视觉60尺']},
    halfOrc: {features:[rule('顽强不屈','降至0HP但未立即死亡时，可改为1HP；每长休一次。'),rule('凶蛮攻击','近战武器攻击造成重击时，额外投一枚该武器的伤害骰。')],weapons:[],tools:[],senses:['黑暗视觉60尺']},
    dragonborn: {features:[rule('龙族先祖','选择龙的颜色，决定吐息形状、豁免属性和伤害抗性。'),rule('吐息武器','用动作吐息。DC=8+体质调整值+熟练加值，伤害随等级增加，豁免成功减半；短休或长休恢复。'),rule('龙鳞抗性','对与你所选先祖对应的伤害类型有抗性。')],weapons:[],tools:[],senses:[]},
    tiefling: {features:[rule('炼狱抗性','火焰伤害抗性。'),rule('炼狱遗赠','1级奇术，3级以2环施放炼狱叱喝，5级黑暗术；魅力施法，后两者各每长休一次。')],weapons:[],tools:[],senses:['黑暗视觉60尺']},
  };
  const backgrounds = {
    acolyte:{name:'侍僧',skills:['洞悉','宗教'],tools:[],languageCount:2,desc:'神殿生活与宗教服务。',feature:'同信仰者为你提供基本照料，适用神殿可提供简单食宿与常规宗教服务。'},
    charlatan:{name:'骗子',skills:['欺瞒','巧手'],tools:['易容工具','文书伪造工具'],languageCount:0,desc:'擅长表演骗局和经营身份。',feature:'拥有一套现成假身份及文书、人脉；能仿造自己见过样本的官方或私人文书。'},
    criminal:{name:'罪犯',skills:['欺瞒','隐匿'],tools:['盗贼工具','自选一种赌具'],languageCount:0,desc:'熟悉地下活动与犯罪圈。',feature:'有一位可靠接头人，并知道如何经由当地信使与之传递消息。'},
    '艺人':{name:'艺人',skills:['特技','表演'],tools:['易容工具','自选一种乐器'],languageCount:0,desc:'以表演取悦观众。',feature:'能找到适合演出的场所，以演出换取简单食宿，并可能被当地观众认出。'},
    '平民英雄':{name:'平民英雄',skills:['驯兽','求生'],tools:['自选一种工匠工具','载具（陆运）'],languageCount:0,desc:'普通人中声名在外的英雄。',feature:'普通民众愿意提供藏身或休息处，但通常不会为你冒生命危险。'},
    guild:{name:'公会工匠',skills:['洞悉','游说'],tools:['自选一种工匠工具'],languageCount:1,desc:'公会训练与同业联系。',feature:'公会提供食宿、人脉与一定的法律支持；每月通常需缴5gp会费。'},
    '隐士':{name:'隐士',skills:['医药','宗教'],tools:['草药工具'],languageCount:1,desc:'在隔绝生活中思考、研究或修行。',feature:'与DM一起确定一项隐居时获得的重要发现，它可以成为角色动机。'},
    '贵族':{name:'贵族',skills:['历史','游说'],tools:['自选一种赌具'],languageCount:1,desc:'熟悉上流社会与身份责任。',feature:'凭身份更容易获得体面接待、进入上流场合，并请求当地贵族接见。'},
    '化外之民':{name:'化外之民',skills:['运动','求生'],tools:['自选一种乐器'],languageCount:1,desc:'习惯荒野、迁徙与自给自足。',feature:'容易记住地形；当地有足够资源时，每天可为自己与至多5名同伴找到食物和清水。'},
    sage:{name:'智者',skills:['奥秘','历史'],tools:[],languageCount:2,desc:'以研究知识为生。',feature:'遇到未知问题时，通常知道可以去哪里或找谁获取答案，寻找过程仍可能需要冒险。'},
    '水手':{name:'水手',skills:['运动','察觉'],tools:['领航工具','载具（水运）'],languageCount:0,desc:'熟悉船只、航线与船员生活。',feature:'可借旧部或同业关系为自己和同伴争取搭船，路线和时程受船只安排限制。'},
    '士兵':{name:'士兵',skills:['运动','威吓'],tools:['自选一种赌具','载具（陆运）'],languageCount:0,desc:'有军旅分工和军衔。',feature:'旧部可能承认你的军衔，并让你取得适当军用营地或设施的协助。'},
    '流浪儿':{name:'流浪儿',skills:['巧手','隐匿'],tools:['易容工具','盗贼工具'],languageCount:0,desc:'熟悉城镇边缘和隐秘通路。',feature:'在城镇非战斗移动时，可带同伴走近路，以通常两倍的速度到达目的地。'},
    '间谍':{name:'间谍',skills:['欺瞒','隐匿'],tools:['盗贼工具','自选一种赌具'],languageCount:0,feature:'罪犯的变体，使用接头人渠道传递情报。'},
    '角斗士':{name:'角斗士',skills:['特技','表演'],tools:['易容工具','自选一种乐器'],languageCount:0,feature:'艺人的变体，以竞技演出换取食宿与名声，可用廉价特色武器替换起始乐器。'},
    '公会商人':{name:'公会商人',skills:['洞悉','游说'],tools:['领航工具或额外一种语言'],languageCount:1,feature:'使用公会会员特性，工具和出行安排更偏向贸易。'},
    '骑士':{name:'骑士',skills:['历史','游说'],tools:['自选一种赌具'],languageCount:1,feature:'贵族变体，可拥有三名忠诚侍从；他们为日常事务服务，不承担冒险战斗。'},
    '海盗':{name:'海盗',skills:['运动','察觉'],tools:['领航工具','载具（水运）'],languageCount:0,feature:'水手变体，恶名使普通人不愿举报一些轻微违法行为；重罪仍会招来后果。'},
  };
  const backgroundEquipment = {
    acolyte:[['holy-symbol','common-clothes','pouch'],'祈祷书或祈祷轮、五根熏香、祭服。'],
    charlatan:[['fine-clothes','disguise-kit','pouch'],'带上你选的骗局道具，例如做过手脚的赌具或假印章。'],
    criminal:[['crowbar','common-clothes','pouch'],'普通服装是深色的，带兜帽。'],
    '艺人':[['costume','pouch'],'一件自选乐器，以及一位崇拜者赠予的小物。'],
    '平民英雄':[['shovel','iron-pot','common-clothes','pouch'],'一套你选的工匠工具。'],
    guild:[['travelers-clothes','pouch'],'一套你选的工匠工具、公会介绍信。'],
    '隐士':[['scroll-case','blanket','common-clothes','herbalism-kit','pouch'],'图卷筒装着研究笔记；毯子是冬毯。'],
    '贵族':[['fine-clothes','signet-ring','pouch'],'一卷证明家族来历的文书。'],
    '化外之民':[['quarterstaff','hunting-trap','travelers-clothes','pouch'],'一件猎物纪念品。'],
    sage:[['ink','ink-pen','common-clothes','pouch'],'小刀，以及一封已故同事写给你的未解问题。'],
    '水手':[['club','silk-rope','common-clothes','pouch'],'短木棒可描述为系索栓；另有一件护身小物。'],
    '士兵':[['common-clothes','pouch'],'军衔标志、从敌人处取得的纪念物，以及骨制骰子或一副纸牌。'],
    '流浪儿':[['common-clothes','pouch'],'小刀、家乡城镇地图、宠物小鼠与父母留下的信物。'],
    '间谍':[['crowbar','common-clothes','pouch'],'采用罪犯起始装备。'],
    '角斗士':[['costume','pouch'],'自选一件廉价特殊武器或乐器，另有崇拜者赠物。'],
    '公会商人':[['travelers-clothes','pouch'],'公会介绍信，可依变体用一头骡与货车替代工匠工具。'],
    '骑士':[['fine-clothes','signet-ring','pouch'],'家族来历文书；如有侍从，可另记一面象征身份的旗帜。'],
    '海盗':[['club','silk-rope','common-clothes','pouch'],'采用水手起始装备。'],
  };
  for (const [id,[equipment,equipmentNote]] of Object.entries(backgroundEquipment)) {
    backgrounds[id].equipment=equipment.map(id=>item(id));
    backgrounds[id].equipmentNote=equipmentNote;
  }
  const feat = (id,name,desc,stats=[],prerequisites=[],effects={}) => ({id,name,desc,stats,prerequisites,effects,book:'PHB',source,status:Object.keys(effects).length?'auto':'rules'});
  const feats = [
    feat('alert','警觉','先攻+5；清醒时不能被突袭；不可见敌人不会仅因不可见而对你攻击有优势。',[],[],{initiative:5}),
    feat('phb:athlete','运动员','力量或敏捷+1；起身只耗5尺移动，攀爬不额外耗移动，助跑跳跃只需5尺助跑。',[0,1]),
    feat('actor','演员','魅力+1；冒充他人的欺瞒与表演有优势，听过至少1分钟发声可模仿其声音。',[5]),
    feat('phb:charger','冲锋手','疾走后可用附赠动作近战攻击或推撞；先直行至少10尺，可给该次命中伤害+5或把推撞距离改为至多10尺。'),
    feat('phb:crossbow-expert','强弩专家','熟练弩忽略装填；敌人在5尺内不会仅因此使远程攻击有劣势；单手武器攻击动作后可附赠动作以持握的手弩攻击。仍需装弹所用空手。'),
    feat('phb:defensive-duelist','防御式决斗','持有熟练的灵巧武器，被近战攻击命中时可用反应为该次攻击把熟练加值加到AC。',[],[{stat:1,min:13}]),
    feat('phb:dual-wielder','双持客','双手各持近战武器时AC+1；双武器战斗可用非轻型单手近战武器；可同时拔出或收起两件单手武器。'),
    feat('phb:dungeon-delver','地城探索者','寻找暗门的察觉和调查检定、抵抗陷阱的豁免有优势；抗陷阱伤害；快速旅行时被动察觉不减5。'),
    feat('phb:durable','耐性','体质+1；休息时花生命骰恢复的每枚骰总回血至少为体质调整值的两倍，最低2。',[2]),
    feat('phb:elemental-adept','元素导师','选择强酸、寒冷、火焰、闪电或雷鸣；所施法术忽略该伤害抗性，相关伤害骰的1视为2。可重复选取不同类型。',[],[{spellcasting:true}]),
    feat('phb:grappler','擒抱者','攻击自己擒抱的生物有优势；可用动作再做擒抱检定，成功则自己与目标同时受束缚直到擒抱结束。',[],[{stat:0,min:13}]),
    feat('phb:great-weapon-master','巨武器大师','自己回合近战武器重击或把生物打至0HP后，可附赠动作近战攻击；熟练的重型近战武器攻击可选择命中−5、伤害+10。'),
    feat('phb:healer','医疗师','医疗工具稳定濒死生物时还使其恢复1HP；可用动作及一次医疗工具治疗1d6+4+目标生命骰数，每目标每短休或长休一次。'),
    feat('phb:heavily-armored','重甲运用','力量+1，获得重甲熟练。',[0],[{armor:'medium'}],{armor:['heavy']}),
    feat('phb:heavy-armor-master','重甲大师','力量+1；穿重甲时，来自非魔法攻击的钝击、穿刺、挥砍伤害各减少3。',[0],[{armor:'heavy'}]),
    feat('phb:inspiring-leader','领袖之证','花10分钟激励至多6名能理解你的友方，给予等级+魅力调整值的临时HP；每个目标每短休或长休一次。',[],[{stat:5,min:13}]),
    feat('phb:keen-mind','敏锐心灵','智力+1；总知道北方和距下次日出日落的小时数，能准确回忆过去一个月见过或听过的事。',[3]),
    feat('phb:lightly-armored','轻甲运用','力量或敏捷+1，获得轻甲熟练。',[0,1],[],{armor:['light']}),
    feat('linguist','语言学家','智力+1；另学三种语言，可自创密码。解密检定DC为你的智力值+熟练加值。',[3],[],{languageChoices:3}),
    feat('lucky','幸运','每长休3点幸运点，可为自己的攻击、检定或豁免加掷d20并选用一个，也可影响别人对你的攻击；在结果公布前决定。'),
    feat('phb:mage-slayer','巫师杀手','5尺内生物施法时可反应近战攻击；你使施法者做的维持专注豁免有劣势；抵抗5尺内生物所施法术的豁免有优势。'),
    feat('phb:magic-initiate','魔法学徒','选吟游诗人、牧师、德鲁伊、术士、邪术师或法师，学该列表两个戏法与一个1环法术。1环法术按原环阶免费一次/长休，施法属性随所选职业。'),
    feat('phb:martial-adept','战技专家','选两项战斗大师战技，获得一枚d6卓越骰，短休或长休恢复；豁免DC用力量或敏捷。'),
    feat('phb:medium-armor-master','中甲大师','穿中甲不因护甲使隐匿有劣势；敏捷至少16时，中甲的敏捷AC上限变为+3。',[],[{armor:'medium'}],{mediumDexCap:3,noMediumStealthDisadvantage:true}),
    feat('mobile','灵活移动','速度+10尺；疾走时困难地形不额外耗移动；近战攻击过的目标本回合不能对你借机。',[],[],{speed:10}),
    feat('phb:moderately-armored','中甲运用','力量或敏捷+1，获得中甲与盾牌熟练。',[0,1],[{armor:'light'}],{armor:['medium','shield']}),
    feat('phb:mounted-combatant','骑乘战斗','骑乘未失能时，近战攻击比坐骑小且未骑乘的生物有优势；可把对坐骑的攻击转向自己；坐骑的敏捷半伤豁免成功免伤、失败半伤。'),
    feat('observant','观察力','智力或感知+1；看见嘴形且懂语言即可读唇；被动察觉与被动调查+5。',[3,4],[],{passivePerception:5,passiveInvestigation:5}),
    feat('phb:polearm-master','长柄武器大师','仅以长柄刀、戟、长棍或矛执行攻击动作后，可附赠动作以另一端作1d4钝击，使用同一属性调整值。持这些武器或长枪时，生物进入触及范围可触发借机。'),
    feat('resilient','强健身心','自选属性+1，并获得该属性豁免熟练。',[0,1,2,3,4,5],[],{selectedSave:true}),
    feat('phb:ritual-caster','仪式施法者','选一种施法职业，仪式书起始记两个该职业1环仪式，可按限制抄入新仪式；仅以仪式方式使用。',[],[{any:[{stat:3,min:13},{stat:4,min:13}]}]),
    feat('phb:savage-attacker','凶蛮打手','每回合一次，近战武器攻击伤害可重掷武器伤害骰，选择其中一组结果。'),
    feat('phb:sentinel','哨兵','借机命中使目标本回合速度归0；目标撤离仍可触发你的借机；5尺内生物攻击其他目标时，可反应近战攻击，另有哨兵目标例外。'),
    feat('phb:sharpshooter','神射手','远程武器长射程攻击不因距离有劣势，忽略半身和四分之三掩护；熟练远程武器攻击可选命中−5、伤害+10。'),
    feat('phb:shield-master','盾牌大师','持盾且本回合采取攻击动作时可附赠动作推撞5尺内生物；对仅以自己为目标的有害效应，敏捷豁免加盾牌AC；允许敏捷成功半伤时，可反应使成功免伤。'),
    feat('phb:skilled','熟习','自选三项技能或工具熟练。',[],[],{proficiencyChoices:3}),
    feat('skulker','潜伏者','轻度遮蔽时能尝试躲藏；隐藏时远程武器攻击未命中不暴露；微光不降低依赖视觉的察觉。',[],[{stat:1,min:13}]),
    feat('phb:spell-sniper','法术射手','须攻击检定的法术射程翻倍，远程法术攻击忽略半身和四分之三掩护；选一个需要攻击检定的戏法。',[],[{spellcasting:true}]),
    feat('phb:tavern-brawler','斗殴高手','力量或体质+1，熟练临时武器；徒手伤害d4；自己回合徒手或临时武器命中后，可附赠动作擒抱。',[0,2],[],{improvisedWeapons:true,unarmedDie:'1d4'}),
    feat('tough','健壮','最大HP增加角色等级×2，以后每级额外增加2。',[],[],{hpPerLevel:2}),
    feat('phb:war-caster','战地施法者','因受伤维持专注的体质豁免有优势；持武器或盾仍可做姿势成分；生物移动触发借机时，可反应施放施法时间1动作且仅以其为目标的法术。',[],[{spellcasting:true}]),
    feat('phb:weapon-master','武器大师','力量或敏捷+1，选择四种简易或军用武器熟练。',[0,1],[],{weaponChoices:4}),
  ];
  const classFeatures = {
    barbarian: {
      1:[rule('狂暴','附赠动作发动，至多1分钟。未穿重甲时，力量检定与豁免有优势，抗钝击/穿刺/挥砍，力量近战武器伤害+2（9级+3，16级+4）。不能施法或专注。长休恢复2次，3/6/12/17级变为3/4/5/6次，20级不限。若昏迷或回合结束前自上回合以来既没攻击敌对生物也未受伤，会提前结束；15级起放宽。'),rule('无甲防御','未穿护甲时AC=10+敏捷调整值+体质调整值，可以使用盾牌。')],
      2:[rule('鲁莽攻击','自己回合首次攻击前决定，令本回合力量近战武器攻击有优势，但直到下回合敌人攻击你也有优势。'),rule('险境感知','能看见的效应所要求的敏捷豁免有优势，目盲、耳聋或失能时无效。')],
      3:[rule('原初道途','选择狂战士或图腾武者，依道途取得能力。')],5:[rule('额外攻击','攻击动作可攻击两次。',{attackCount:2}),rule('快速移动','未穿重甲时速度增加10尺。')],
      7:[rule('野性直觉','先攻有优势。被突袭但未失能时，若先发动狂暴即可在首回合正常行动。')],
      9:[rule('凶蛮重击','近战攻击重击额外掷一枚武器伤害骰；13级两枚，17级三枚。')],
      11:[rule('坚韧狂暴','狂暴中降到0HP但未即死，可做DC10体质豁免，成功改为1HP。再次使用DC加5，短休或长休重置。')],
      13:[rule('凶蛮重击提升','近战重击额外掷两枚武器伤害骰。')],15:[rule('持久狂暴','狂暴只会因昏迷或你主动结束而提前终止，至多仍为1分钟。')],
      17:[rule('凶蛮重击提升','近战重击额外掷三枚武器伤害骰。')],18:[rule('不屈勇武','力量检定结果低于力量值时，可改用力量值。')],20:[rule('原初斗士','力量和体质各+4，两项上限升至24；狂暴次数不限。')],
    },
    bard: {
      1:[rule('诗人施法','以魅力施法，选已知戏法与法术。已知仪式法术可作为仪式施放。'),rule('诗人激励','附赠动作给予60尺内能听见你的另一生物d6激励骰，10分钟内可用于一次攻击、检定或豁免；每长休魅力调整值次，至少1次。')],
      2:[rule('万事通','未加入熟练加值的属性检定可加入一半熟练加值，向下取整。'),rule('休憩曲','短休时用生命骰回血的你和能听见演奏的友方额外回复1d6。')],
      3:[rule('专精','两项已有技能熟练计入双倍熟练加值；10级再选两项。')],5:[rule('激励之源','诗人激励改为短休或长休恢复，骰变为d8。')],
      6:[rule('反迷惑','动作演奏至下回合结束，30尺内能听见的友方对抗恐慌或魅惑的豁免有优势。')],
      9:[rule('休憩曲提升','休憩曲改为d8。')],10:[rule('魔法奥秘','从任意职业列表自选两个不超过可施环阶的法术或戏法，视为诗人法术并计入已知法术数。'),rule('激励提升','激励骰改为d10，另选两项技能专精。')],
      13:[rule('休憩曲提升','休憩曲改为d10。')],14:[rule('魔法奥秘','再学两个任意职业法术。')],15:[rule('激励提升','诗人激励骰改为d12。')],17:[rule('休憩曲提升','休憩曲改为d12。')],18:[rule('魔法奥秘','再学两个任意职业法术。')],20:[rule('先发激励','掷先攻时若没有剩余诗人激励次数，恢复一次。')],
    },
    cleric: {
      1:[rule('牧师施法','以感知施法，每日准备感知调整值+牧师等级个法术，至少1个；领域法术始终准备且不占数量。已准备仪式可作为仪式施放。')],
      2:[rule('引导神力','短休或长休恢复，可用驱散亡灵或领域选项；2级1次、6级2次、18级3次。'),rule('驱散亡灵','动作举圣徽，30尺内能看或听见你的亡灵做感知豁免，失败则被驱散1分钟或直到受伤。')],
      5:[rule('摧毁亡灵','驱散亡灵失败的CR1/2及以下亡灵直接被摧毁；阈值于8/11/14/17级升为1/2/3/4。')],6:[rule('引导神力提升','每次短休或长休可恢复两次引导神力。')],
      8:[rule('摧毁亡灵提升','可摧毁CR1及以下亡灵。')],10:[rule('神圣干预','动作请求神祇援助，d100结果不高于牧师等级时成功，由DM决定干预；成功后7日恢复，失败后长休恢复。')],
      11:[rule('摧毁亡灵提升','可摧毁CR2及以下亡灵。')],14:[rule('摧毁亡灵提升','可摧毁CR3及以下亡灵。')],17:[rule('摧毁亡灵提升','可摧毁CR4及以下亡灵。')],18:[rule('引导神力提升','每次短休或长休可恢复三次引导神力。')],20:[rule('精通神圣干预','神圣干预请求自动成功，其余限制照常。')],
    },
    druid: {
      1:[rule('德鲁伊语','掌握秘密语言德鲁伊语，并能留下只有知情者容易发现的讯息。'),rule('德鲁伊施法','以感知施法，每日准备感知调整值+德鲁伊等级个法术，至少1个；已准备仪式可作为仪式施放。')],
      2:[rule('荒野变形','动作变成见过的野兽，每短休或长休2次。通常至多CR1/4且无游泳/飞行速度，持续至多半个德鲁伊等级小时；兽形HP与本体分别计算。')],
      4:[rule('荒野变形提升','通常至多CR1/2，可有游泳速度，仍不能飞行。')],8:[rule('荒野变形提升','通常至多CR1，可有飞行速度。')],
      18:[rule('不朽身','每实际经过10年只衰老1年。'),rule('野兽施法','兽形中能施德鲁伊法术，可做言语与姿势成分，材料成分仍受限制。')],20:[rule('大德鲁伊','荒野变形次数不限。德鲁伊法术可忽略言语、姿势及未注明费用且不消耗的材料成分。')],
    },
    fighter: {
      1:[rule('战斗风格','选择一种战斗风格。相同风格不能重复取得。'),rule('回气','附赠动作回复1d10+战士等级HP，每短休或长休一次。')],
      2:[rule('动作如潮','自己回合额外获得一个动作，每短休或长休一次；17级两次，但每回合至多用一次。')],5:[rule('额外攻击','攻击动作可攻击两次。',{attackCount:2})],9:[rule('不屈','豁免失败后重掷并采用新结果，每长休一次；13级两次，17级三次。')],
      11:[rule('额外攻击提升','攻击动作可攻击三次。',{attackCount:3})],13:[rule('不屈提升','每长休可使用两次不屈。')],17:[rule('动作如潮与不屈提升','每短休动作如潮两次（每回合至多一次）；每长休不屈三次。')],20:[rule('额外攻击提升','攻击动作可攻击四次。',{attackCount:4})],
    },
    monk: {
      1:[rule('无甲防御','未穿护甲且未持盾时，AC=10+敏捷调整值+感知调整值。'),rule('武艺','未穿护甲/持盾、徒手或只持武僧武器时，可用敏捷攻击与伤害，徒手/武僧武器可用d4伤害；攻击动作以其攻击后可附赠动作徒手攻击。')],
      2:[rule('气','气点等于武僧等级，短休或长休期间冥想至少30分钟恢复。1气可附赠动作疾风连击（两次徒手）、闪避，或疾走/撤离并使跳跃距离翻倍。'),rule('无甲移动','无甲无盾时速度+10尺，6/10/14/18级依次变为+15/+20/+25/+30尺。')],
      3:[rule('拨挡飞弹','反应减免远程武器命中伤害1d10+敏捷调整值+武僧等级。降至0且空手接住时，可花1气作为该反应以20/60尺投回。')],
      4:[rule('轻身坠','反应使坠落伤害减少武僧等级×5。')],5:[rule('额外攻击','攻击动作可攻击两次。',{attackCount:2}),rule('震慑拳','近战武器攻击命中时可花1气，目标体质豁免失败则震慑至你下回合结束。武艺伤害变d6。')],
      6:[rule('真气注拳','徒手攻击对抗非魔法抗性和免疫时视为魔法；无甲移动+15尺。')],7:[rule('反射闪避','允许敏捷成功半伤的效应，成功无伤、失败半伤。'),rule('心如止水','动作结束自己身上一项魅惑或恐慌效应。')],
      9:[rule('无甲移动提升','自己回合可沿垂直表面或水面移动而不坠落。')],10:[rule('百病不侵','免疫疾病与毒素，无甲移动+20尺。')],11:[rule('武艺提升','武艺伤害骰改为d8。')],13:[rule('天语通','理解所有说出的语言，任何能理解语言的生物都能理解你。')],
      14:[rule('金刚魂','所有豁免熟练。豁免失败后可花1气重掷并采用新结果；无甲移动+25尺。',{saves:[0,1,2,3,4,5]})],15:[rule('不朽身','免受衰老的虚弱、不能被魔法催老，不再需食物和水，仍会自然老死。')],17:[rule('武艺提升','武艺伤害骰改为d10。')],
      18:[rule('空灵体','动作花4气隐形1分钟，并抗除力场以外的所有伤害；或花8气对自己施星界投射而无需材料。无甲移动+30尺。')],20:[rule('超凡入圣','掷先攻时若没有气，恢复4点。')],
    },
    paladin: {
      1:[rule('神圣感知','动作感知60尺内非全掩护的天界、邪魔、亡灵及祝圣/亵渎区域，持续至下回合结束；每长休1+魅力调整值次。'),rule('圣疗','治疗池为圣武士等级×5HP，长休恢复。动作触碰分配治疗，或每5点解除一项疾病/毒素；对亡灵和构装无效。')],
      2:[rule('战斗风格','选择防御、对决、巨武器战斗或守护。'),rule('圣武士施法','以魅力施法，每日准备魅力调整值+半圣武士等级（向下取整）个法术，至少1个。'),rule('至圣斩','近战武器命中时消耗法术位，1环额外2d8光耀，每升一环加1d8，通常至多5d8；对邪魔或亡灵再加1d8。')],
      3:[rule('神佑','免疫疾病。'),rule('神圣誓言','获得誓言法术和引导神力，誓言法术始终准备且不占准备数。')],5:[rule('额外攻击','攻击动作可攻击两次。',{attackCount:2})],
      6:[rule('守护灵光','清醒时，你与10尺内友方的豁免加魅力调整值，至少+1；18级范围30尺。')],10:[rule('勇气灵光','清醒时，你与10尺内友方不能陷入恐慌；18级范围30尺。')],11:[rule('精通至圣斩','所有近战武器命中额外造成1d8光耀，可与至圣斩叠加。')],
      14:[rule('净化之触','动作结束自己或自愿生物身上的一个法术，每长休魅力调整值次，至少1次。')],18:[rule('灵光范围提升','守护灵光与勇气灵光扩大至30尺。')],
    },
    ranger: {
      1:[rule('宿敌','选择一种生物类别或两种类人生物种族，对追踪它们的求生与回忆它们的智力检定有优势，学一种它们使用的语言。'),rule('自然探索者','选择偏好地形，取得相应旅行能力；在该地形的熟练智力/感知检定加入双倍熟练加值。')],
      2:[rule('战斗风格','选择箭术、防御、对决或双武器战斗。'),rule('游侠施法','以感知施法，选已知法术，升级可替换一个已知法术。')],3:[rule('原初意识','动作花法术位，感知特定超自然生物是否在1里内（偏好地形6里），每环1分钟；不透露位置或数量。')],
      5:[rule('额外攻击','攻击动作可攻击两次。',{attackCount:2})],6:[rule('探索与宿敌提升','再选一种偏好地形与一种宿敌，并学习相关语言。')],8:[rule('大地行者','非魔法困难地形不额外耗移动，可穿过非魔法植物而不额外耗移动或受其伤害；抵抗妨碍移动的魔法植物豁免有优势。')],
      10:[rule('遁术','花1分钟以自然材料伪装，贴着合适表面不动时，隐匿+10；移动、动作或反应终止。再选一种偏好地形。')],14:[rule('无踪步','附赠动作躲藏，无法被非魔法方式追踪，除非主动留痕。再选一种宿敌与相关语言。')],
      18:[rule('野性感官','攻击看不见的生物不因此有劣势；未目盲/耳聋时知道30尺内未隐藏的隐形生物位置。')],20:[rule('屠灭众敌','每自己回合一次，对宿敌的攻击或伤害检定可加感知调整值，在得知结果前决定。')],
    },
    rogue: {
      1:[rule('专精','选两项已有技能熟练，或一项技能和盗贼工具，相关检定加入双倍熟练加值。'),rule('偷袭','每回合一次，用灵巧或远程武器命中且有优势时额外1d6；或目标5尺内有另一敌对未失能生物且你攻击无劣势。每两个游荡者等级多1d6。'),rule('盗贼黑话','秘密用语与符号，可在普通交谈中隐藏讯息，交谈耗时约四倍。')],
      2:[rule('灵巧动作','附赠动作疾走、撤离或躲藏。躲藏仍需合理遮蔽条件。')],5:[rule('直觉闪避','可见攻击者命中你时，反应使该次攻击伤害减半。')],6:[rule('专精提升','再选两项已有熟练，计入双倍熟练加值。')],7:[rule('反射闪避','允许敏捷成功半伤的效应，成功无伤、失败半伤。')],
      11:[rule('可靠才能','能加入熟练加值的属性检定，d20的1–9视为10。')],14:[rule('听声辨位','能听见时，知道10尺内隐藏或隐形生物的位置。')],15:[rule('圆滑心智','获得感知豁免熟练。',{saves:[4]})],18:[rule('飘忽不定','你未失能时，针对你的攻击不能获得优势。')],20:[rule('幸运一击','短休或长休一次，把对范围内目标的一次未命中改为命中，或把失败属性检定的d20视为20。')],
    },
    sorcerer: {
      1:[rule('术士施法','以魅力施法，从术士列表选已知戏法与法术，升级可替换一个已知法术。')],2:[rule('魔力泉涌','术法点等于术士等级，长休恢复。附赠动作可把法术位换成等环阶术法点，或按表花点数创造至多5环法术位。')],3:[rule('超魔法','选两项超魔法，以术法点改变法术。通常一法术只能用一项超魔法。')],10:[rule('额外超魔法','再选一项超魔法。')],17:[rule('额外超魔法','再选一项超魔法。')],20:[rule('术法复苏','每次短休恢复4术法点。')],
    },
    warlock: {
      1:[rule('契约魔法','以魅力施法，少量契约法术位按最高可用环阶施放，短休或长休恢复；宗主扩展列表只增加可选法术。')],2:[rule('魔能祈唤','初选两项祈唤，升级可替换一项，部分需特定邪术师等级、魔契或戏法。')],3:[rule('魔契恩泽','选择链、刃或书之魔契。')],
      11:[rule('玄奥秘法·六环','选一个6环邪术师法术，每长休免费施放一次；它独立于契约法术位。')],13:[rule('玄奥秘法·七环','再选一个7环邪术师法术，每长休免费施放一次。')],15:[rule('玄奥秘法·八环','再选一个8环邪术师法术，每长休免费施放一次。')],17:[rule('玄奥秘法·九环','再选一个9环邪术师法术，每长休免费施放一次。')],20:[rule('魔能掌控','花1分钟恢复所有契约法术位，每长休一次。')],
    },
    wizard: {
      1:[rule('法师施法','以智力施法，法术书起始六个1环法术，每升一级免费加入两个可施环阶法术；每天准备智力调整值+法师等级个，至少1个。书中仪式无需准备也能仪式施放。'),rule('奥术回想','每日一次，在短休后恢复总环阶至多半法师等级（向上取整）的法术位，不能恢复6环或更高。')],
      18:[rule('法术精通','选法术书中的一个1环与一个2环法术，已准备时可按原环阶免费施放；花8小时学习可更换。')],20:[rule('招牌法术','选两个书中的3环法术，始终准备且不占准备数；每个可按3环免费施放一次，每短休或长休恢复。')],
    },
  };
  const divineStrike = type => rule('神圣打击',`每自己回合一次，武器命中附加1d8${type}伤害；14级改为2d8。`);
  const potentCantrip = rule('强力施法','牧师戏法伤害加感知调整值。');
  const savant = school => rule(school+'学者',`抄写${school}法术入法术书所需时间和金币减半。`);
  const subclassFeatures = {
    barbarian: {
      '狂战士道途': {
        3:[rule('狂怒','开启狂暴时选择狂怒。开启的回合之后，每回合可附赠动作近战武器攻击一次；狂暴结束获得一级力竭。')],
        6:[rule('无我狂暴','狂暴时免于魅惑与恐慌；之前已受影响则在狂暴期间暂停。')],
        10:[rule('威慑之姿','动作恐吓30尺内可见、能看或听见你的目标；其感知豁免对抗魅力DC，失败则恐慌，之后可花动作维持。')],
        14:[rule('报偿','5尺内生物对你造成伤害时，可反应对其发动近战武器攻击。')],
      },
      '图腾武者道途': {
        3:[rule('精魄追寻','可用仪式施展野兽感官与动物交谈。'),rule('图腾精魄','选熊、鹰或狼，取得对应的狂暴能力。')],
        6:[rule('兽之形','再选一种图腾动物；可以不同于3级图腾。')],
        10:[rule('精魄行者','可用仪式施展问道自然。')],14:[rule('图腾同调','选择一种图腾动物，取得新的狂暴能力。')],
      },
    },
    bard: {
      '逸闻学院': {
        3:[rule('附赠熟练','选三项新的技能熟练。'),rule('语出惊人','60尺内能听见且可被魅惑的生物做攻击、检定或伤害掷骰时，可反应花一个激励骰减其结果，须在结果确定前使用。')],
        6:[rule('额外魔法奥秘','从任意职业选两个可施法术或戏法，视为诗人法术，但不计入常规已知法术数。')],
        14:[rule('超凡技艺','自己做属性检定时可花一个激励骰加到结果，须在成败公布前决定。')],
      },
      '勇气学院': {
        3:[rule('附赠熟练','获得中甲、盾牌和军用武器熟练。',{armor:['medium','shield'],weapons:['martial']}),rule('战斗激励','获得你激励骰的同伴可将其加入武器伤害，或受攻击时用反应加到AC。')],
        6:[rule('额外攻击','攻击动作可攻击两次。',{attackCount:2})],14:[rule('战斗魔法','用动作施放吟游诗人法术后，可以附赠动作作一次武器攻击。')],
      },
    },
    cleric: {
      '知识领域': {
        1:[rule('知识祝福','选择两门语言，及奥秘、历史、自然、宗教中的两项技能，取得熟练并计入双倍熟练加值。')],
        2:[rule('岁月知识','引导神力，以动作获得自选一项技能或工具熟练，持续10分钟。')],
        6:[rule('读取思想','引导神力，60尺内目标感知豁免失败后可读表层思想1分钟，可提前结束并使其自动失败于你的暗示术。')],
        8:[potentCantrip],17:[rule('透视过去','专注冥想可读取物品过去主人的重要事件，或附近区域的近期往事；短休或长休恢复。')],
      },
      '生命领域': {
        1:[rule('附赠熟练','获得重甲熟练。',{armor:['heavy']}),rule('生命门徒','以1环或更高法术治疗生物时，多回复2+法术环阶点HP。')],
        2:[rule('维持生命','引导神力，分配牧师等级×5的治疗给30尺内生物，最多补至半血，亡灵或构装无效。')],
        6:[rule('神佑医者','用1环或更高法术治疗他人时，自己回复2+法术环阶点HP。')],8:[divineStrike('光耀')],17:[rule('极效治疗','法术治疗所投的治疗骰直接取最大值。')],
      },
      '光明领域': {
        1:[rule('附赠戏法','获得光亮术且不占已知戏法数；若已会则不重复。'),rule('守御闪光','30尺内可见生物攻击你时，反应令攻击有劣势；对不能目盲的目标无效，每长休感知调整值次，至少一次。')],
        2:[rule('黎明光辉','引导神力，驱散30尺内魔法黑暗，并令范围内敌对生物做体质豁免，对抗2d10+牧师等级光耀伤害。')],
        6:[rule('精通闪光','也能在可见生物攻击你30尺内其他生物时使用守御闪光。')],8:[potentCantrip],
        17:[rule('光冕','动作发出60尺明光及另30尺微光，持续1分钟；明光范围内敌人抵抗你火焰或光耀法术的豁免有劣势。')],
      },
      '自然领域': {
        1:[rule('自然侍僧','选一个德鲁伊戏法作为牧师戏法，并在驯兽、自然、求生中选一项熟练。'),rule('附赠熟练','获得重甲熟练。',{armor:['heavy']})],
        2:[rule('魅惑动物与植物','引导神力，让30尺内能看见你的野兽或植物做感知豁免，失败则魅惑1分钟或直到受伤。')],
        6:[rule('抑制元素','自己或30尺内生物受到强酸、寒冷、火焰、闪电或雷鸣伤害时，反应赋予该次伤害抗性。')],
        8:[rule('神圣打击','每自己回合一次，武器命中额外1d8寒冷、火焰或闪电，自选；14级2d8。')],17:[rule('自然之主','附赠动作口头命令被你引导神力魅惑的动物或植物。')],
      },
      '风暴领域': {
        1:[rule('附赠熟练','获得军用武器和重甲熟练。',{armor:['heavy'],weapons:['martial']}),rule('风暴狂怒','5尺内可见生物命中你时，反应迫使其敏捷豁免，对抗2d8闪电或雷鸣伤害；每长休感知调整值次，至少一次。')],
        2:[rule('毁灭狂怒','引导神力，用最大骰值结算一次闪电或雷鸣伤害。')],6:[rule('雷霆打击','对大型或更小生物造成闪电伤害时，可将其推远10尺。')],8:[divineStrike('雷鸣')],17:[rule('风暴降生','在室外且非地下时获得等同步速的飞行速度。')],
      },
      '诡术领域': {
        1:[rule('诡术祝福','动作触碰另一自愿生物，使其隐匿检定有优势，持续1小时或直到你再次使用。')],
        2:[rule('召唤分身','引导神力创造幻象，专注最多1分钟。可从幻象位置施法；你与幻象都在可见目标5尺内时，对其攻击有优势。')],
        6:[rule('暗影斗篷','引导神力，动作隐形至下回合结束；攻击或施法会提前终止。')],8:[divineStrike('毒素')],17:[rule('精通分身','召唤分身可造至多四个幻象，并用一个附赠动作移动它们。')],
      },
      '战争领域': {
        1:[rule('附赠熟练','获得军用武器和重甲熟练。',{armor:['heavy'],weapons:['martial']}),rule('战争祭司','自己回合采取攻击动作后可附赠动作作一次武器攻击，每长休感知调整值次，至少一次。')],
        2:[rule('引导打击','引导神力给自己一次攻击检定+10，见到掷骰后、知道命中结果前决定。')],
        6:[rule('战神祝福','引导神力并用反应给30尺内一生物的攻击检定+10，在结果公布前决定。')],
        8:[rule('神圣打击','每自己回合一次，武器命中额外1d8该武器类型伤害；14级2d8。')],17:[rule('战斗化身','对非魔法武器造成的钝击、穿刺和挥砍伤害有抗性。')],
      },
    },
    druid: {
      '大地结社': {
        2:[rule('附赠戏法','自选一个额外德鲁伊戏法。'),rule('自然恢复','每日一次短休时恢复总环阶至多半德鲁伊等级（向上取整）的法术位，不能恢复6环及以上。')],
        3:[rule('结社法术','选择一种地形，在3、5、7、9级获得始终准备的法术，不占准备数。')],
        6:[rule('大地行者','非魔法困难地形不额外耗移动，非魔法植物不妨碍或伤害你；抵抗妨碍移动的魔法植物豁免有优势。')],
        10:[rule('自然之护','免疫毒素和疾病，不能被元素生物或妖精魅惑或恐慌。')],
        14:[rule('自然庇护所','野兽或植物攻击你时先做感知豁免，失败须换目标或攻击失败；成功者24小时内免疫该效果。')],
      },
      '月亮结社': {
        2:[rule('战斗荒野变形','可附赠动作变形。兽形中附赠动作消耗法术位，每环恢复1d8HP。'),rule('结社形态','2级可变至多CR1野兽，6级起上限为德鲁伊等级÷3向下取整；仍遵守游泳与飞行限制。')],
        6:[rule('原初打击','兽形攻击对抗非魔法抗性或免疫时视为魔法。')],
        10:[rule('元素荒野变形','同时花两次荒野变形，可变成气、土、火或水元素。')],14:[rule('千面相','随意施展变身术。')],
      },
    },
    fighter: {
      '勇士': {
        3:[rule('精通重击','武器攻击掷19或20即重击。',{criticalRange:19})],
        7:[rule('非凡运动员','未加熟练的力量、敏捷、体质检定加入一半熟练加值（向上取整）；助跑跳远距离再加力量调整值尺。')],
        10:[rule('额外战斗风格','再选一种此前没有的战斗风格。')],15:[rule('高等重击','武器攻击掷18–20即重击。',{criticalRange:18})],
        18:[rule('生还者','每回合开始时若HP大于0且不超过一半，回复5+体质调整值HP。')],
      },
      '战斗大师': {
        3:[rule('卓越战技','选三项战技。初始四枚d8卓越骰，短休或长休恢复。每攻击仅用一项战技，DC=8+熟练+力量或敏捷调整值。'),rule('战争学徒','选一种工匠工具熟练。')],
        7:[rule('知己知彼','战斗外观察或交谈至少1分钟，选两项能力与自己比较强弱。另学两项战技、增加一枚卓越骰。')],
        10:[rule('精通卓越战技','卓越骰升为d10，再学两项战技。')],15:[rule('坚韧','掷先攻时若没有卓越骰则恢复一枚。另学两项战技、增加一枚卓越骰。')],18:[rule('精通卓越战技提升','卓越骰升为d12。')],
      },
      '奥法骑士': {
        3:[rule('施法','以智力使用法师法术，主要学防护和塑能；特定选择名额不受学派限制。'),rule('武器联结','一小时联结武器，最多两件。未失能时不能被解除武装，同一位面可附赠动作召回一件。')],
        7:[rule('战争魔法','用动作施放戏法后可附赠动作作一次武器攻击。')],
        10:[rule('奥法打击','武器命中后，目标抵抗你在下回合结束前施放的下一个法术的首次豁免有劣势。')],
        15:[rule('奥法冲锋','动作如潮时可在额外动作前或后传送至30尺内可见空位。')],18:[rule('精通战争魔法','用动作施放任意法术后可附赠动作作一次武器攻击。')],
      },
    },
    monk: {
      '散打宗': {
        3:[rule('散打技巧','疾风连击命中可附加：敏捷豁免倒地、力量豁免推远至多15尺，或使目标到你下回合结束前不能反应。')],
        6:[rule('混元体','动作回复武僧等级×3的HP，每长休一次。')],11:[rule('宁静','长休后受庇护术保护，持续至下次长休开始，仍受法术的提前终止条件约束。')],
        17:[rule('震颤掌','徒手命中花3气植入震动，最多维持武僧等级天。与目标同一位面可动作引爆，目标体质豁免失败降至0HP，成功承受10d10暗蚀。')],
      },
      '暗影宗': {
        3:[rule('暗影技艺','学次级幻影；花2气可施黑暗术、黑暗视觉、行动无踪或沉默术，无需材料。')],
        6:[rule('暗影步','从微光或黑暗中以附赠动作传送至60尺内可见的微光或黑暗空位，并使该回合首次近战攻击有优势。')],
        11:[rule('影遁','微光或黑暗中用动作隐形，直到攻击、施法或进入明亮光照。')],17:[rule('把握时机','5尺内生物被另一生物攻击命中时，可反应对其近战攻击。')],
      },
      '四象宗': {
        3:[rule('元素戒律','学元素调和及一项自选戒律。花气施展戒律时无需材料；6级起部分法术能耗更多气升环，受等级上限约束。')],
        6:[rule('额外元素戒律','再学一项戒律，可替换一项旧戒律。单次施法至多花3气。')],11:[rule('额外元素戒律','再学一项戒律，可替换一项旧戒律。单次施法至多花4气。')],17:[rule('额外元素戒律','再学一项戒律，可替换一项旧戒律。单次施法至多花6气。')],
      },
    },
    paladin: {
      '奉献之誓': {
        3:[rule('引导神力：神圣武器','动作使一件持握武器1分钟内攻击检定加魅力调整值（至少+1）、发光并视为魔法武器。'),rule('引导神力：驱散不洁','动作使30尺内能看或听见你的邪魔与亡灵进行感知豁免，失败被驱散1分钟或直到受伤。')],
        7:[rule('奉献灵光','清醒时，你与10尺内友方不能被魅惑，18级扩大至30尺。')],
        15:[rule('纯净之魂','持续受到防护善恶法术的保护。')],20:[rule('神圣光晕','动作发动1分钟；30尺明光内敌人在自己回合开始时受10光耀，你抵抗邪魔或亡灵法术的豁免有优势；每长休一次。')],
      },
      '古贤之誓': {
        3:[rule('引导神力：自然之怒','动作令10尺内可见目标用力量或敏捷豁免，失败被藤蔓束缚，每回合结束重试。'),rule('引导神力：驱散不信者','动作驱散30尺内的妖精和邪魔，感知豁免；被驱散者的伪装会显露其真形。')],
        7:[rule('守御灵光','你和10尺内友方对法术伤害有抗性，18级扩大至30尺。')],
        15:[rule('不死哨兵','降至0HP但未即死时可改为1HP，每长休一次；也不受衰老的虚弱或魔法老化影响。')],
        20:[rule('远古斗士','动作变身1分钟，回合开始回复10HP，1动作圣武士法术可改用附赠动作，10尺内敌人抵抗你的圣武士法术和引导神力有劣势；每长休一次。')],
      },
      '复仇之誓': {
        3:[rule('引导神力：弃绝仇敌','60尺内可见目标感知豁免；失败恐慌且速度为0，成功则速度减半，持续1分钟或直到受伤。'),rule('引导神力：仇敌誓言','附赠动作选10尺内可见生物，对其攻击有优势1分钟或直到其昏迷/降至0HP。')],
        7:[rule('无情复仇者','借机攻击命中后可作为同一反应移动半速，不引发借机。')],15:[rule('复仇之魂','仇敌誓言目标攻击时，若在触及内可反应对其近战武器攻击。')],
        20:[rule('复仇天使','动作变身1小时，飞行60尺。30尺内敌人首次进入范围或开始回合时感知豁免，失败恐慌1分钟，针对其的攻击有优势；每长休一次。')],
      },
    },
    ranger: {
      '猎人': {
        3:[rule('猎人技艺','选巨像屠夫、巨人杀手或歼敌者。')],7:[rule('防御战术','选逃脱兽群、多重攻击防御或钢铁意志。')],
        11:[rule('多重攻击','选远程的箭雨或近战的旋风攻击。')],15:[rule('高等猎人防御','选反射闪避、借势卸力或直觉闪避。')],
      },
      '驯兽师': {
        3:[rule('游侠伙伴','选中型或更小且CR不高于1/4的野兽。其AC、攻击、伤害及已有熟练的豁免/技能加入你的熟练加值；最大HP为其原值与游侠等级×4中的较高者。')],
        7:[rule('特殊训练','若野兽本回合未攻击，可附赠动作命令它疾走、撤离或协助；其攻击视为魔法以克服抗性或免疫。')],
        11:[rule('野兽之怒','命令伙伴采取攻击动作时，它可攻击两次，或使用其已有的多重攻击。')],15:[rule('共享法术','对自己施法时，可同时影响30尺内的野兽伙伴。')],
      },
    },
    rogue: {
      '盗贼': {
        3:[rule('快手','灵巧动作额外可用于巧手、盗贼工具开锁拆陷阱或使用物件。'),rule('梁上君子','攀爬不额外耗移动，助跑跳远加敏捷调整值尺。')],
        9:[rule('极效潜行','本回合移动不超过半速时，隐匿检定有优势。')],13:[rule('使用魔法装置','使用魔法物品可忽略职业、种族和等级要求。')],17:[rule('窃盗本能','未被突袭时，战斗首轮额外在先攻−10处再行动一个回合。')],
      },
      '刺客': {
        3:[rule('附赠熟练','获得易容工具和制毒工具熟练。',{tools:['易容工具','制毒工具']}),rule('暗杀','攻击战斗中尚未行动者有优势，命中被突袭者为重击。')],
        9:[rule('专业渗透','花7天及25gp建立一个新身份，备齐历史、职业和关系。正确易容后一般能使人相信，除非有明显反证。')],
        13:[rule('冒充者','至少观察3小时后模仿目标言语、笔迹与举止；遭怀疑时为保持身份做欺瞒有优势。')],
        17:[rule('致命一击','命中被突袭者时令其做体质豁免（DC=8+熟练+敏捷调整值），失败该次攻击伤害翻倍。')],
      },
      '诡术师': {
        3:[rule('施法','以智力学法师戏法与法术，主要选幻术或惑控；指定名额可任选学派。'),rule('法师之手诈术','手可隐形并用于藏取物品、远程开锁或拆陷阱；灵巧动作也能控制手。')],
        9:[rule('诡术伏击','向你已成功躲藏于其感知之外的生物施法时，其本回合抵抗该法术的豁免有劣势。')],
        13:[rule('万能诡术','附赠动作指明法师之手5尺内目标，本回合对其攻击有优势。')],
        17:[rule('法术窃贼','反应对抗一个影响你的法术。施法者豁免失败时你免受影响，并可在可施环阶内暂学该法术8小时，每长休一次。')],
      },
    },
    sorcerer: {
      '龙族血脉': {
        1:[rule('龙族先祖','选龙的颜色，决定后续亲和的伤害类型；懂龙语，与龙交涉时已有熟练的魅力检定计双倍熟练。',{languages:['龙语']}),rule('龙族体魄','最大HP每级额外+1。无甲时AC可用13+敏捷调整值。',{hpPerLevel:1,naturalAC:13})],
        6:[rule('元素亲和','施放先祖类型伤害的法术时，一次伤害掷骰加魅力调整值；可花1术法点取得该类型抗性1小时。')],
        14:[rule('龙翼','附赠动作长出或收回龙翼，飞行速度等于步速；护甲或衣物要能容纳翅膀。')],
        18:[rule('龙威','动作花5术法点，60尺灵光使敌人感知豁免，失败则魅惑或恐慌；需专注，最长1分钟。')],
      },
      '狂野魔法': {
        1:[rule('狂野浪潮','施放1环以上术士法术后，DM可让你掷d20；掷出1时再掷浪潮表。'),rule('混沌潮汐','使一次攻击、检定或豁免有优势，每长休一次；DM也可在之后施术士法术时触发浪潮并恢复此能力。')],
        6:[rule('拨弄运气','可见的其他生物做攻击、检定或豁免时，反应花2术法点加或减1d4，在成败确定前决定。')],
        14:[rule('掌控混沌','掷狂野浪潮表时掷两次，自选采用哪一项。')],18:[rule('法术轰炸','每回合一次，法术伤害骰掷出最大值时，可选其中一个骰再掷并把结果加入伤害。')],
      },
    },
    warlock: {
      '至高妖精': {
        1:[rule('妖精仪态','动作使10尺立方内生物感知豁免，失败则魅惑或恐慌至下回合结束；短休或长休恢复。')],
        6:[rule('迷雾遁形','受伤时反应传送至60尺可见空位并隐形至下回合开始；攻击或施法提前结束，短休或长休恢复。')],
        10:[rule('迷惑防御','免疫魅惑。生物试图魅惑你时，可反应令其感知豁免，失败则反被魅惑1分钟或直到受伤。')],
        14:[rule('黑暗迷梦','动作使60尺内目标感知豁免，失败则陷入只能感知你与幻境的魅惑或恐慌；专注最多1分钟，受伤结束，短休或长休恢复。')],
      },
      '邪魔': {
        1:[rule('黑暗赐福','将敌对生物降至0HP时，获得邪术师等级+魅力调整值临时HP，最低1。')],
        6:[rule('黑暗强运','属性检定或豁免加1d10，在成败公布前决定；每短休或长休一次。')],
        10:[rule('邪魔体魄','短休或长休后选一种伤害抗性；魔法武器及镀银武器的伤害可绕过这份抗性。')],
        14:[rule('直坠炼狱','命中目标后将其送往下层位面至你下回合结束；非邪魔返回时受10d10心灵伤害，每长休一次。')],
      },
      '旧日支配者': {
        1:[rule('觉醒心灵','可对30尺内可见且懂至少一种语言的生物传念，无需共享语言。')],
        6:[rule('熵光守御','被攻击时可反应让该次攻击有劣势；若未命中，下回合结束前对攻击者的下一次攻击有优势。短休或长休恢复。')],
        10:[rule('思想之盾','未经允许不能被读心；抗心灵伤害，造成此伤害的生物受到与你实际承受相同的心灵伤害。')],
        14:[rule('造物奴仆','动作触碰失能类人生物使其被魅惑，直到解除诅咒、魅惑被移除或你再次使用；同位面可传念。')],
      },
    },
    wizard: {
      '防护学派': {
        2:[savant('防护'),rule('奥术守御','每日首次施1环以上防护法术可造守御，最大HP=法师等级×2+智力调整值，先替你承伤；继续施防护法术回复每环2HP。')],
        6:[rule('投射守御','30尺内可见生物受伤时，反应令守御替其吸收伤害。')],10:[rule('精通防护','防护法术要求属性检定时加入熟练加值，例如反制法术或解除魔法。')],14:[rule('法术抗性','抵抗法术的豁免有优势，并抗法术伤害。')],
      },
      '咒法学派': {
        2:[savant('咒法'),rule('次级造物','动作在手中或10尺内造一个见过的非魔法物件，至多3尺、10磅，发微光，1小时或受伤/造成伤害后消失。')],
        6:[rule('良性传送','动作传送至30尺内可见空位，或与范围内自愿的中型或更小生物交换位置。长休或施1环以上咒法后恢复。')],
        10:[rule('专注咒法','受到伤害不会打断你对咒法法术的专注。')],14:[rule('坚韧召唤','咒法召唤或创造的生物获得30临时HP。')],
      },
      '预言学派': {
        2:[savant('预言'),rule('预兆','长休后预掷2枚d20。可在掷骰前用预兆替换你或可见生物的攻击、属性检定或豁免，每回合至多一次。')],
        6:[rule('预言专家','用法术位施2环以上预言法术后，恢复一个更低环且不超过5环的已耗法术位。')],
        10:[rule('天眼','动作选黑暗视觉、以太视野、通晓语言文字或识破隐形之一，持续至休息或失能，短休或长休恢复。')],14:[rule('高等预兆','长休后改为预掷3枚d20。')],
      },
      '惑控学派': {
        2:[savant('惑控'),rule('催眠凝视','动作令5尺内能看或听见你的目标感知豁免；失败时魅惑、失能、速度0，可每回合用动作维持，离开5尺或受伤终止。')],
        6:[rule('本能魅惑','30尺内可见生物攻击你且范围内有其他目标时，可反应迫使其感知豁免，失败改打最近合法目标。成功者在你长休前免疫。')],
        10:[rule('惑控分流','1环及以上且只能指定一个生物的惑控法术，可额外指定第二个目标。')],14:[rule('篡改记忆','魅惑法术可让目标不意识到被魅惑；结束前可令其智力豁免，失败忘记部分魅惑期间的时间。')],
      },
      '塑能学派': {
        2:[savant('塑能'),rule('法术塑形','塑能法术影响你看得见的其他生物时，保护至多1+环阶个目标，使其自动成功且免受原本半伤。')],
        6:[rule('强效戏法','伤害戏法的目标豁免成功仍受一半伤害，不受其他效果。')],10:[rule('强化塑能','法师塑能法术的一次伤害掷骰加智力调整值。')],
        14:[rule('超限导能','使1–5环伤害法师法术取最大伤害；每长休首次无代价，再用会受到随使用次数和环阶增加的暗蚀伤害。')],
      },
      '幻术学派': {
        2:[savant('幻术'),rule('精通次级幻影','免费学次级幻影（已有则另选法师戏法），可让同一次次级幻影同时产生图像与声音。')],
        6:[rule('可塑幻术','自己施放且持续1分钟以上的幻术可用动作改变，仍受原法术限制。')],10:[rule('幻觉自我','被攻击命中前可反应造一个幻象，使该次攻击自动落空；短休或长休恢复。')],
        14:[rule('幻觉成真','施1环以上幻术时，可附赠动作让其中一个无生命的非魔法物件实体化1分钟；不能直接伤害他人。')],
      },
      '死灵学派': {
        2:[savant('死灵'),rule('恐怖收割','每回合一次，以1环以上法术击杀一或多个生物时回复环阶×2HP，死灵法术×3，击杀构装或亡灵无效。')],
        6:[rule('亡灵奴仆','把操纵死尸加入法术书；施放时可多造一具亡灵。你的死灵法术创造的亡灵最大HP加法师等级，武器伤害加熟练。')],
        10:[rule('不死习性','抗暗蚀伤害，最大HP不能被降低。')],14:[rule('命令亡灵','动作让60尺内可见亡灵做魅力豁免，失败受控；聪明亡灵有优势且可能定期重试。')],
      },
      '变化学派': {
        2:[savant('变化'),rule('次级炼金术','专注改变木、石（非宝石）、铁、铜或银的材质，每10分钟可处理1立方尺，持续最多1小时。')],
        6:[rule('变化师之石','花8小时造石，携带者获得选定的黑暗视觉、速度+10、体质豁免熟练或一种元素抗性；施1环以上变化法术可更换。')],
        10:[rule('变形者','把变形术写入法术书，可免费对自己变为CR1或更低的野兽一次/短休或长休。')],
        14:[rule('变化大师','动作消耗变化师之石，选择转化物件、解除诅咒疾病毒素并全回血、死者复活或表面返老还童。')],
      },
    },
  };
  const decisionOptions = entries => entries.map(([id,name,desc,effects={},minLevel=1,prerequisites=[]])=>({id,name,desc,effects,minLevel,prerequisites}));
  const choices = [];
  function choose(id,name,level,count,options,scope={}) {
    choices.push({id,name,level,count,options,mode:'add',...scope});
  }
  const artisanTools = ['炼金工具','酿酒工具','书法工具','木匠工具','制图工具','鞋匠工具','厨具','玻璃工工具','珠宝匠工具','皮匠工具','石匠工具','画具','陶匠工具','铁匠工具','修补匠工具','织布工具','木雕工具'];
  const instruments = ['风笛','鼓','扬琴','长笛','鲁特琴','里拉琴','号角','排箫','肖姆管','提琴'];
  const languageOptions = ['通用语','矮人语','精灵语','巨人语','侏儒语','地精语','半身人语','兽人语','深渊语','天界语','龙语','深潜语','炼狱语','原初语','木族语','地底通用语']
    .map(name=>({id:name,name,desc:'掌握这门语言。',effects:{languages:[name]}}));
  const toolOptions = names => names.map(name=>({id:name,name,desc:'取得这项工具熟练。',effects:{tools:[name]}}));
  const skillOptions = (names,expertise=false) => names.map(name=>({id:name,name,desc:expertise?'获得熟练及双倍熟练加值。':'取得这项技能熟练。',effects:expertise?{expertise:[name]}:{skills:[name]}}));
  const colors = [
    ['black','黑龙','强酸','5×30尺直线','敏捷'],['blue','蓝龙','闪电','5×30尺直线','敏捷'],
    ['brass','黄铜龙','火焰','5×30尺直线','敏捷'],['bronze','青铜龙','闪电','5×30尺直线','敏捷'],
    ['copper','赤铜龙','强酸','5×30尺直线','敏捷'],['gold','金龙','火焰','15尺锥形','敏捷'],
    ['green','绿龙','毒素','15尺锥形','体质'],['red','红龙','火焰','15尺锥形','敏捷'],
    ['silver','银龙','寒冷','15尺锥形','体质'],['white','白龙','寒冷','15尺锥形','体质'],
  ];
  choose('draconic-ancestry','龙族先祖',1,1,colors.map(([id,name,damage,area,save])=>({id,name,desc:`${damage}抗性；吐息为${area}，${save}豁免。起始2d6，6/11/16级分别为3/4/5d6。`,effects:{resistance:[damage],breath:{damage,area,save}}})),{race:'dragonborn'});
  choose('sorcerer-draconic-ancestry','龙族血脉颜色',1,1,colors.map(([id,name,damage])=>({id,name,desc:`6级的元素亲和对应${damage}。`,effects:{draconicElement:damage}})),{job:'sorcerer',subclass:'龙族血脉'});
  for (const race of ['hillDwarf','mountainDwarf']) choose('dwarf-tool-'+race,'矮人工具熟练',1,1,toolOptions(['铁匠工具','酿酒工具','石匠工具']),{race});
  choose('bard-instruments','吟游诗人乐器熟练',1,3,toolOptions(instruments),{job:'bard'});
  choose('monk-tool','武僧工具或乐器熟练',1,1,toolOptions([...artisanTools,...instruments]),{job:'monk'});
  choose('lore-skills','逸闻学院附赠技能',3,3,skillOptions(['运动','特技','巧手','隐匿','奥秘','历史','调查','自然','宗教','驯兽','洞悉','医药','察觉','求生','欺瞒','威吓','表演','游说']),{job:'bard',subclass:'逸闻学院'});
  choose('knowledge-skills','知识祝福的技能',1,2,skillOptions(['奥秘','历史','自然','宗教'],true),{job:'cleric',subclass:'知识领域'});
  choose('knowledge-languages','知识祝福的语言',1,2,languageOptions,{job:'cleric',subclass:'知识领域'});
  choose('nature-skill','自然侍僧附赠技能',1,1,skillOptions(['驯兽','自然','求生']),{job:'cleric',subclass:'自然领域'});
  choose('land-terrain','结社法术地形',3,1,decisionOptions([
    ['arctic','极地','偏向冰雪与阻滞，获得定身、冰风暴等法术。'],['coast','海岸','偏向雾、传送与水上行动。'],
    ['desert','沙漠','偏向幻影、环境生存与干扰。'],['forest','森林','偏向植物、动物与林地移动。'],
    ['grassland','草原','偏向潜行、速度和自然预言。'],['mountain','山地','偏向攀爬、石质地形和雷电。'],
    ['swamp','沼泽','偏向黑暗、酸液和疫病。'],['underdark','幽暗地域','偏向蛛网、毒素和地下生物。'],
  ]),{job:'druid',subclass:'大地结社'});
  const totem = (id,name,desc)=>[id,name,desc];
  for (const [level,name,options] of [
    [3,'图腾精魄',[
      totem('bear','熊','狂暴期间抗除心灵外的所有伤害。'),totem('eagle','鹰','未穿重甲的狂暴期间，敌人借机攻击有劣势，你可附赠动作疾走。'),totem('wolf','狼','狂暴时，友方近战攻击你5尺内的敌对生物有优势。'),]],
    [6,'兽之形',[
      totem('bear','熊','负重翻倍，推动、拖拽、举起或打破物件的力量检定有优势。'),totem('eagle','鹰','可看清1里内细节；微光不使察觉有劣势。'),totem('wolf','狼','快速旅行仍可追踪，普通旅行速度可隐匿。'),]],
    [14,'图腾同调',[
      totem('bear','熊','狂暴时，5尺内敌人攻击你以外的目标有劣势；看听不到你或免恐慌者例外。'),totem('eagle','鹰','狂暴期间飞行速度等同步速；回合结束无支撑即坠落。'),totem('wolf','狼','狂暴中近战武器命中大型或更小生物后，可附赠动作使其倒地。'),]],
  ]) choose('totem-'+level,name,level,1,decisionOptions(options),{job:'barbarian',subclass:'图腾武者道途'});
  const maneuvers = decisionOptions([
    ['commanders-strike','指挥官打击','放弃攻击动作中的一次攻击，附赠动作耗骰命令同伴反应攻击，伤害加卓越骰。'],
    ['disarming-attack','缴械攻击','武器命中加卓越骰伤害，目标力量豁免失败则放下你选的一件持物。'],
    ['distracting-strike','分心打击','命中加卓越骰伤害；你下回合开始前，另一生物下次攻击该目标有优势。'],
    ['evasive-footwork','闪避步法','移动时花卓越骰加到AC，直到你停止移动。'],
    ['feinting-attack','佯攻','附赠动作花卓越骰，选择5尺内目标，本回合下次攻击该目标有优势且命中加骰伤害。'],
    ['goading-attack','挑衅攻击','命中加卓越骰伤害；目标感知豁免失败至你下回合结束前攻击其他人有劣势。'],
    ['lunging-attack','突刺','自己回合近战武器攻击可延长触及5尺，命中加卓越骰伤害。'],
    ['maneuvering-attack','机动攻击','命中加卓越骰伤害，让能看或听见你的同伴以反应移动半速，不受目标借机。'],
    ['menacing-attack','恐吓攻击','命中加卓越骰伤害，目标感知豁免失败则恐慌至你下回合结束。'],
    ['parry','格挡','被近战攻击伤害时，反应减少卓越骰+敏捷调整值的伤害。'],
    ['precision-attack','精准攻击','武器攻击检定可加卓越骰，应用攻击效果前决定。'],
    ['pushing-attack','推击','命中加卓越骰伤害，大型或更小目标力量豁免失败则推远至多15尺。'],
    ['rally','重整旗鼓','附赠动作让能看或听见你的友方获得卓越骰+魅力调整值的临时HP。'],
    ['riposte','回击','敌人近战攻击未命中时，可反应近战武器攻击，命中加卓越骰伤害。'],
    ['sweeping-attack','横扫攻击','近战命中后，若同一攻击掷骰也能命中原目标5尺内且在你触及内的另一目标，对其造成卓越骰伤害。'],
    ['trip-attack','摔绊攻击','命中加卓越骰伤害；大型或更小目标力量豁免失败则倒地。'],
  ]);
  for (const [level,count] of [[3,3],[7,2],[10,2],[15,2]]) choose('maneuvers-'+level,'战斗大师战技',level,count,maneuvers,{job:'fighter',subclass:'战斗大师',group:'maneuvers'});
  choose('student-of-war','战争学徒工具',3,1,toolOptions(artisanTools),{job:'fighter',subclass:'战斗大师'});
  const styleOptions = decisionOptions([
    ['defense','防御','穿甲时AC+1。',{fightingStyle:'防御'}],['dueling','对决','单手持近战武器且不持其他武器时伤害+2。',{fightingStyle:'对决'}],
    ['great-weapon-fighting','巨武器战斗','双手使用双手或两用近战武器时，武器伤害骰1或2可重掷一次。',{fightingStyle:'巨武器战斗'}],
    ['protection','守护','持盾时可反应使对你5尺内另一目标的攻击有劣势。',{fightingStyle:'守护'}],
    ['archery','箭术','远程武器攻击检定+2。',{fightingStyle:'箭术'}],['two-weapon-fighting','双武器战斗','副手附赠动作攻击可把属性调整值加入伤害。',{fightingStyle:'双武器战斗'}],
  ]);
  choose('champion-style','额外战斗风格',10,1,styleOptions,{job:'fighter',subclass:'勇士',group:'fighting-style'});
  const weaponOptions = Object.values(items).filter(entry=>entry.kind==='weapon').map(({id,name,damage,damageType})=>({id,name,desc:damage?`${damage} ${damageType}。`:'限制目标行动。'}));
  choose('bladesinger-weapon', '战歌训练 · 单手近战武器熟练', 2, 1, weaponOptions.filter(({id}) =>
    items[id].category === 'melee' && !items[id].properties.includes('two-handed') && id !== 'lance')
    .map(option => ({...option, effects:{weapons:[option.id]}})), {job:'wizard', subclass:'剑咏'});
  choose('weapon-bond','联结武器（至多两件）',3,2,weaponOptions,{job:'fighter',subclass:'奥法骑士',optional:true});
  const disciplines = decisionOptions([
    ['elemental-attunement','元素调和','小范围操纵元素、点灭小火或暂时改变少量水土火气形态。'],
    ['breath-of-winter','冬之吐息','花6气施展寒冰锥。',{},17],
    ['clench-of-north-wind','北风之握','花3气施展人类定身术。',{},6],
    ['eternal-mountain-defense','不动山御','花5气对自己施石肤术。',{},17],
    ['fangs-of-fire-snake','火蛇牙','攻击动作时花1气使本回合徒手触及增加10尺，伤害变火焰；命中后可花1气额外1d10火焰。'],
    ['fist-of-four-thunders','四雷之拳','花2气施展雷鸣波。'],
    ['fist-of-unbroken-air','不绝风拳','动作花2气，30尺内目标力量豁免抵抗3d10钝击；失败可推远20尺并倒地，额外气点提高伤害。'],
    ['flames-of-phoenix','凤凰之焰','花4气施展火球术。',{},11],
    ['gong-of-summit','山巅之锣','花3气施展粉碎音波。',{},6],
    ['mist-stance','云雾之态','花4气对自己施气化形体。',{},11],
    ['ride-the-wind','乘风','花4气对自己施飞行术。',{},11],
    ['river-of-hungry-flame','饥火之河','花5气施展火墙术。',{},17],
    ['rush-of-gale-spirits','疾风之灵','花2气施展造风术。'],
    ['shape-the-flowing-river','流水塑形','动作花1气，改变120尺内至多30尺立方的水和冰的形态，不能直接伤害生物。'],
    ['sweeping-cinder-strike','扫烬击','花2气施展燃烧之手。'],
    ['water-whip','水鞭','动作花2气，30尺内目标敏捷豁免抵抗3d10钝击；失败可拉近25尺或使其倒地，额外气点提高伤害。'],
    ['wave-of-rolling-earth','滚土之浪','花6气施展石墙术。',{},17],
  ]);
  for (const level of [3,6,11,17]) choose('disciplines-'+level,'额外元素戒律',level,1,level===3?disciplines.filter(option=>option.id!=='elemental-attunement'):disciplines,{job:'monk',subclass:'四象宗',group:'disciplines'});
  const terrains = decisionOptions([
    ['arctic','极地','适用极地旅行及环境检定。'],['coast','海岸','适用海岸旅行及环境检定。'],['desert','沙漠','适用沙漠旅行及环境检定。'],
    ['forest','森林','适用森林旅行及环境检定。'],['grassland','草原','适用草原旅行及环境检定。'],['mountain','山地','适用山地旅行及环境检定。'],
    ['swamp','沼泽','适用沼泽旅行及环境检定。'],['underdark','幽暗地域','适用幽暗地域旅行及环境检定。'],
  ]);
  const enemyTypes = ['异怪','野兽','天界生物','构装体','龙','元素生物','妖精','邪魔','巨人','怪兽','泥怪','植物','亡灵']
    .map(name=>({id:name,name,desc:'追踪此类生物的求生和回忆其知识的智力检定有优势。'}));
  enemyTypes.push({id:'humanoids',name:'两种类人生物',desc:'接下来指定两个类人生物族群。'});
  const humanoids = ['人类','矮人','精灵','半身人','侏儒','兽人','地精','大地精','熊地精','狗头人','豺狼人','蜥蜴人','鱼人','蛇人','卓尔精灵','灰矮人','半兽人','半精灵','龙裔','提夫林']
    .map(name=>({id:name,name,desc:'成为对应的类人宿敌。'}));
  for (const level of [1,6,14]) {
    choose('favored-enemy-'+level,'宿敌类别',level,1,enemyTypes,{job:'ranger',group:'favored-enemy'});
    choose('humanoid-enemies-'+level,'类人宿敌族群',level,2,humanoids,{job:'ranger',group:'humanoid-enemies',dependsOn:{choice:'favored-enemy-'+level,option:'humanoids'}});
    choose('enemy-language-'+level,'宿敌使用的语言（如有）',level,1,languageOptions,{job:'ranger',optional:true,group:'enemy-language'});
  }
  for (const level of [1,6,10]) choose('ranger-terrain-'+level,'偏好地形',level,1,terrains,{job:'ranger',group:'ranger-terrain'});
  for (const [level,name,options] of [
    [3,'猎人技艺',[
      ['colossus-slayer','巨像屠夫','武器命中已损失HP的目标额外1d8伤害，每回合一次。'],
      ['giant-killer','巨人杀手','5尺内可见的大型或更大生物攻击你后，可立即反应攻击它。'],
      ['horde-breaker','歼敌者','自己回合一次武器攻击时，同一武器再攻击该目标5尺内且在射程中的另一生物。'],]],
    [7,'防御战术',[
      ['escape-the-horde','逃脱兽群','对你的借机攻击有劣势。'],['multiattack-defense','多重攻击防御','某生物命中你后，你对其同回合后续攻击的AC+4。'],['steel-will','钢铁意志','对抗恐慌的豁免有优势。'],]],
    [11,'多重攻击',[
      ['volley','箭雨','动作向射程内一点周围10尺的多个目标远程攻击，各自掷命中并消耗弹药。'],['whirlwind-attack','旋风攻击','动作分别近战攻击你5尺内任意数量的生物。'],]],
    [15,'高等猎人防御',[
      ['evasion','反射闪避','允许敏捷成功半伤的效应，成功免伤，失败半伤。'],['stand-against-the-tide','借势卸力','敌对生物近战攻击未命中你时，反应使其对你以外自选生物重做同一攻击。'],['uncanny-dodge','直觉闪避','可见攻击者命中你时，反应让该次攻击伤害减半。'],]],
  ]) choose('hunter-'+level,name,level,1,decisionOptions(options),{job:'ranger',subclass:'猎人'});
  const companionNames = ['獾','蝙蝠','血鹰','野猪','猫','螃蟹','鹿','鹰','飞蛇','蛙','山羊','鬣狗','胡狼','蜥蜴','獒犬','章鱼','猫头鹰','豹','毒蛇','小马','鼠','渡鸦','食人鱼','蝎子','海马','蜘蛛','蚊蝠','秃鹫','黄鼠狼','狼','巨獾','巨蜈蚣','巨蟹','巨蛙','巨毒蛇','巨鼠','巨黄鼠狼','翼龙','其他符合条件的野兽'];
  choose('ranger-companion','野兽伙伴',3,1,companionNames.map(name=>({id:name,name,desc:'须为中型或更小、CR不高于1/4，由DM确认可获得。'})),{job:'ranger',subclass:'驯兽师'});
  const metamagic = decisionOptions([
    ['careful','谨慎法术','花1点，指定至多魅力调整值名生物自动成功于这次法术豁免。'],
    ['distant','远程法术','花1点，使至少5尺的距离加倍，或将触碰改为30尺。'],
    ['empowered','强效法术','花1点，重掷至多魅力调整值个法术伤害骰并采用新结果，可与其他超魔法同用。'],
    ['extended','延效法术','花1点，持续至少1分钟的法术持续时间翻倍，至多24小时。'],
    ['heightened','升阶法术','花3点，令一个目标对该法术的第一次豁免有劣势。'],
    ['quickened','瞬发法术','花2点，把施法时间1动作改为附赠动作；仍受附赠动作施法规则限制。'],
    ['subtle','精妙法术','花1点，省去言语和姿势成分。'],
    ['twinned','孪生法术','法术只能以一个生物为目标且距离非自身时，花等于环阶的术法点（戏法1点）增加第二目标。'],
  ]);
  for (const [level,count] of [[3,2],[10,1],[17,1]]) choose('metamagic-'+level,'超魔法',level,count,metamagic,{job:'sorcerer',group:'metamagic'});
  choose('pact-boon','魔契恩泽',3,1,decisionOptions([
    ['chain','链之魔契','掌握寻获魔宠，可仪式施放；可选特殊形态。攻击动作时可放弃一次攻击让魔宠以反应攻击。'],
    ['blade','刃之魔契','可召出契约近战武器并视为熟练，对非魔法抗性和免疫视为魔法；也可联结符合条件的魔法武器。'],
    ['tome','书之魔契','获得影之书，从任意职业列表选择三个额外戏法，持书时按邪术师法术施放。'],
  ]),{job:'warlock'});
  choose('pact-familiar','链之魔契魔宠',3,1,decisionOptions([
    ['imp','小魔鬼','邪魔形态，善于潜行与侦察。'],['pseudodragon','伪龙','具有限度心灵感应的小型龙类形态。'],
    ['quasit','小恶魔','邪魔形态，有变形与隐形能力。'],['sprite','小仙灵','妖精形态，擅长隐蔽和窥探。'],
    ...['蝙蝠','猫','螃蟹','蛙','鹰','蜥蜴','章鱼','猫头鹰','毒蛇','食人鱼','鼠','渡鸦','海马','蜘蛛','黄鼠狼'].map(name=>['familiar-'+name,name,'寻获魔宠的常规形态。']),
  ]),{job:'warlock',dependsOn:{choice:'pact-boon',option:'chain'}});
  choose('pact-weapon','契约武器形态',3,1,weaponOptions.filter(option=>items[option.id].category==='melee'),{job:'warlock',dependsOn:{choice:'pact-boon',option:'blade'},optional:true});
  const blade = [{choice:'pact-boon',option:'blade'}];
  const chain = [{choice:'pact-boon',option:'chain'}];
  const tome = [{choice:'pact-boon',option:'tome'}];
  const blast = [{spell:'eldritch-blast'}];
  const invocations = decisionOptions([
    ['agonizing-blast','苦痛魔爆','魔能爆命中时伤害加魅力调整值。',{},2,blast],
    ['armor-of-shadows','影甲','随意对自己施法师护甲，不耗法术位或材料。'],
    ['ascendant-step','飞升步','随意对自己施浮空术，不耗法术位或材料。',{},9],
    ['beast-speech','兽语','随意施动物交谈，不耗法术位。'],
    ['beguiling-influence','迷惑之力','获得欺瞒和游说熟练。',{skills:['欺瞒','游说']}],
    ['bewitching-whispers','魅惑之语','用契约法术位施强迫术，每长休一次。',{},7],
    ['book-of-ancient-secrets','远古秘密之书','将两个任意职业1环仪式加入影之书；之后可抄录不高于半邪术师等级（向上取整）的仪式。',{},3,tome],
    ['chains-of-carceri','卡瑟利锁链','无需法术位或材料对天界、邪魔或元素生物施怪物定身术；同一生物每长休一次。',{},15,chain],
    ['devils-sight','魔鬼视觉','在120尺内的普通或魔法黑暗中正常视物。',{senses:['魔鬼视觉120尺']}],
    ['dreadful-word','惊骇言语','用契约法术位施困惑术，每长休一次。',{},7],
    ['eldritch-sight','魔能视界','随意施侦测魔法，不耗法术位。'],
    ['eldritch-spear','魔能长枪','魔能爆射程变为300尺。',{},2,blast],
    ['eyes-of-the-rune-keeper','符文守护者之眼','能阅读所有文字。'],
    ['fiendish-vigor','邪魔活力','随意对自己以1环施虚假生命，不耗法术位或材料。'],
    ['gaze-of-two-minds','双重心灵凝视','动作触碰自愿类人生物，借其感官观察至下回合结束；可逐回合用动作维持。'],
    ['lifedrinker','饮命者','契约武器命中时附加魅力调整值点暗蚀伤害，至少1。',{},12,blade],
    ['mask-of-many-faces','千面面具','随意施易容术，不耗法术位。'],
    ['master-of-myriad-forms','万相大师','随意施变身术，不耗法术位。',{},15],
    ['minions-of-chaos','混沌仆役','用契约法术位施召唤元素，每长休一次。',{},9],
    ['mire-the-mind','心灵泥沼','用契约法术位施缓慢术，每长休一次。',{},5],
    ['misty-visions','迷雾幻景','随意施无声幻影，不耗法术位或材料。'],
    ['one-with-shadows','影中一体','在微光或黑暗中以动作隐形，移动、动作或反应后结束。',{},5],
    ['otherworldly-leap','异界跳跃','随意对自己施跳跃术，不耗法术位或材料。',{},9],
    ['repelling-blast','斥力魔爆','魔能爆命中可沿直线把目标推远至多10尺。',{},2,blast],
    ['sculptor-of-flesh','肉体雕塑家','用契约法术位施变形术，每长休一次。',{},7],
    ['sign-of-ill-omen','凶兆','用契约法术位施降咒，每长休一次。',{},5],
    ['thief-of-five-fates','五命窃贼','用契约法术位施灾祸术，每长休一次。'],
    ['thirsting-blade','饥渴之刃','采取攻击动作时可用契约武器攻击两次。',{},5,blade],
    ['visions-of-distant-realms','远域幻视','随意施秘法眼，不耗法术位。',{},15],
    ['voice-of-the-chain-master','链主之声','同位面可与魔宠传念并借其感官，也可借其说话。',{},3,chain],
    ['whispers-of-the-grave','墓穴低语','随意施死者交谈，不耗法术位。',{},9],
    ['witch-sight','巫视','看清30尺内可见变形生物及被幻术或变化魔法掩饰者的原形。',{},15],
  ]);
  for (const [level,count] of [[2,2],[5,1],[7,1],[9,1],[12,1],[15,1],[18,1]]) choose('invocations-'+level,'魔能祈唤',level,count,invocations,{job:'warlock',group:'invocations'});
  choose('fiend-resistance','邪魔体魄抗性',10,1,['强酸','寒冷','火焰','力场','闪电','暗蚀','毒素','心灵','光耀','雷鸣','钝击','穿刺','挥砍'].map(name=>({id:name,name,desc:'选择该伤害类型的抗性；魔法武器或镀银武器伤害可绕过。',effects:{resistance:[name]}})),{job:'warlock',subclass:'邪魔'});
  choose('transmuters-stone','变化师之石效果',6,1,decisionOptions([
    ['darkvision','黑暗视觉','获得60尺黑暗视觉。',{senses:['黑暗视觉60尺']}],['speed','步速','未超载时速度增加10尺。'],['constitution-save','体质豁免','获得体质豁免熟练。',{saves:[2]}],
    ...['强酸','寒冷','火焰','闪电','雷鸣'].map(name=>['resist-'+name,name+'抗性','携带该石时取得抗性。',{resistance:[name]}]),
  ]),{job:'wizard',subclass:'变化学派'});
  const spellChoices = [
    {id:'high-elf-cantrip',name:'高等精灵附赠戏法',race:'highElf',level:1,count:1,jobList:'wizard',ring:0,ability:3},
    {id:'nature-cantrip',name:'自然侍僧戏法',job:'cleric',subclass:'自然领域',level:1,count:1,jobList:'druid',ring:0,ability:4,mode:'classKnown'},
    {id:'land-cantrip',name:'大地结社附赠戏法',job:'druid',subclass:'大地结社',level:2,count:1,jobList:'druid',ring:0,ability:4,mode:'classKnown'},
    {id:'illusion-cantrip',name:'精通次级幻影',job:'wizard',subclass:'幻术学派',level:2,count:1,jobList:'wizard',ring:0,ability:3,alreadyKnows:'minor-illusion',mode:'classKnown'},
    {id:'tome-cantrips',name:'书之魔契附赠戏法',job:'warlock',level:3,count:3,jobList:'any',ring:0,ability:5,mode:'classKnown',dependsOn:{choice:'pact-boon',option:'tome'}},
    {id:'ancient-rituals',name:'远古秘密之书的初始仪式',job:'warlock',level:3,count:2,jobList:'any',ring:1,ritual:true,ability:5,dependsOn:{group:'invocations',option:'book-of-ancient-secrets'}},
    {id:'spell-mastery-1',name:'法术精通 · 1环',job:'wizard',level:18,count:1,jobList:'wizard',ring:1,bookOnly:true,ability:3},
    {id:'spell-mastery-2',name:'法术精通 · 2环',job:'wizard',level:18,count:1,jobList:'wizard',ring:2,bookOnly:true,ability:3},
    {id:'signature-spells',name:'招牌法术',job:'wizard',level:20,count:2,jobList:'wizard',ring:3,bookOnly:true,ability:3,mode:'alwaysPrepared'},
  ];
  choose('genie-kind','巨灵宗主类型',1,1,decisionOptions([
    ['dao','土巨灵','获得土巨灵扩展法表。'], ['djinni','气巨灵','获得气巨灵扩展法表。'],
    ['efreeti','火巨灵','获得火巨灵扩展法表。'], ['marid','水巨灵','获得水巨灵扩展法表。'],
  ]),{job:'warlock',subclass:'巨灵宗主'});
  choose('profane-ability','鲜血秘法属性',3,1,decisionOptions([
    ['intelligence','智力','默认用智力施法。'], ['wisdom','感知','经 DM 同意，改用感知施法。'],
  ]),{job:'bloodhunter',subclass:'渎魂结社',optional:true});
  const featSpellChoices = {
    'phb:magic-initiate':{classes:['bard','cleric','druid','sorcerer','warlock','wizard'],choices:[{ring:0,count:2},{ring:1,count:1}]},
    'phb:ritual-caster':{classes:['bard','cleric','druid','sorcerer','warlock','wizard'],choices:[{ring:1,count:2,ritual:true}]},
    'phb:spell-sniper':{classes:['bard','cleric','druid','sorcerer','warlock','wizard'],choices:[{ring:0,count:1,attack:true}]},
  };
  for (const [id,name,cost,weight] of [
    ['bagpipes','风笛',30,6],['drum','鼓',6,3],['dulcimer','扬琴',25,10],['flute','长笛',2,1],['lute','鲁特琴',35,2],
    ['lyre','里拉琴',30,2],['horn','号角',3,2],['pan-flute','排箫',12,2],['shawm','肖姆管',2,1],['viol','提琴',30,1],
  ]) items[id] = {id,name,cost,weight,kind:'instrument'};
  const toolPools = {
    instruments, artisan:artisanTools, gaming:['骰子套组','龙棋套组','纸牌套组','三龙牌套组'],
    all:[...artisanTools,...instruments,'骰子套组','龙棋套组','纸牌套组','三龙牌套组','易容工具','文书伪造工具','草药工具','领航工具','制毒工具','盗贼工具','载具（陆运）','载具（水运）'],
  };
  const featChoices = {
    'phb:martial-adept':{name:'战技专家的战技',count:2,options:maneuvers},
    'phb:elemental-adept':{name:'元素导师的伤害类型',count:1,options:['强酸','寒冷','火焰','闪电','雷鸣'].map(name=>({id:name,name,desc:`你的法术忽略${name}抗性，法术的${name}伤害骰掷出1视为2。`}))},
    'phb:skilled':{name:'熟习的技能或工具',count:3,options:[...skillOptions(['运动','特技','巧手','隐匿','奥秘','历史','调查','自然','宗教','驯兽','洞悉','医药','察觉','求生','欺瞒','威吓','表演','游说']),...toolOptions(toolPools.all)]},
  };
  const verification = {
    edition:'2014', source,
    sources:[
      {name:'官方 2014 基础规则',url:'https://www.dndbeyond.com/sources/dnd/basic-rules-2014'},
      {name:'官方旧版装备表',url:'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment'},
      {name:'2014 玩家手册勘误',url:'https://media.wizards.com/2021/dnd/downloads/PH-Errata.pdf'},
      {name:'旧版官方规则答疑',url:'https://media.wizards.com/2020/dnd/downloads/SA-Compendium.pdf'},
      {name:'中文旧版玩家手册 · 专长',url:'https://5echm.kagangtuya.top/topics/玩家手册/自定义选项/专长.html'},
    ],
    notes:['数据为建卡用的独立摘要；自动计算状态取决于计算器实际接入的效果。','部分现场判定需要DM；情境效果不作为常驻加值。'],
  };
  return {source,classes,classFeatures,races,backgrounds,feats,choices,subclassFeatures,items,spellChoices,featSpellChoices,featChoices,toolPools,verification};
})();
