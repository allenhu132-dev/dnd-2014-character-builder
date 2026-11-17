// Purpose tags describe what an option actually does. The keys are the same IDs
// used by the 2014-era catalogue, including its book-specific variants.
const purposeGroups = {
  ancestry: {
    melee: `
      halfOrc mountainDwarf dragonborn oldBugbear oldOrc longtooth oldCentaur oldMinotaur leonin mpmm-bugbear
      mpmm-centaur mpmm-minotaur mpmm-lizardfolk mpmm-orc chromaticDragon metallicDragon gemDragon
    `,
    ranged: 'woodElf drow giff',
    defense: `
      hillDwarf mountainDwarf stout drow tiefling oldDuergar oldShadarKai oldGithzerai oldGoliath
      oldLizardfolk oldHobgoblin oldYuanTi kalashtar warforged beasthide loxodon simic vedalken oldSatyr
      mpmm-duergar mpmm-githzerai mpmm-goliath mpmm-lizardfolk mpmm-satyr mpmm-shadarKai mpmm-tortle
      mpmm-triton mpmm-yuanTi mpmm-earthGenasi mpmm-fireGenasi mpmm-waterGenasi astralElf autognome hadozee
      plasmoid thriKreen dhampir reborn chromaticDragon metallicDragon gemDragon mark-sentinel mark-warding
      tiefling-levistus locathah feralTiefling
    `,
    stealth: `
      woodElf lightfoot changeling oldDeepGnome oldFirbolg oldBugbear oldGoblin oldKenku swiftstride
      mpmm-deepGnome mpmm-earthGenasi mpmm-firbolg mpmm-bugbear mpmm-goblin mpmm-changeling thriKreen hexblood
      owlin mark-shadow tiefling-glasya
    `,
    scout: `
      woodElf drow ghostwise oldTabaxi wildhunt oldAarakocra mpmm-aarakocra mpmm-fairy mpmm-tabaxi
      mpmm-shifter dhampir witchFairy owlin mark-detection mark-finding
    `,
    control: 'kender',
    social: `
      halfElf changeling forestGnome ghostwise oldFirbolg oldKenku oldTriton kalashtar oldSatyr vulpin
      mpmm-firbolg mpmm-kenku mpmm-satyr mpmm-changeling mpmm-triton mpmm-aasimar thriKreen hexblood gemDragon
      mark-handling mark-hospitality tiefling-baalzebul tiefling-dispater tiefling-fierna tiefling-glasya
      verdan scagHalfElf
    `,
    flexible: 'human halfElf variantHuman customLineage',
    magic: 'highElf tiefling-zariel',
    lore: `
      rockGnome oldGithyanki vedalken mpmm-githyanki astralElf reborn mark-scribing mark-making
      tiefling-mammon tiefling-mephistopheles
    `,
    wilderness: `
      woodElf forestGnome oldSeaElf oldFirbolg oldLizardfolk oldTriton oldCentaur wildhunt simic mpmm-seaElf
      mpmm-firbolg mpmm-lizardfolk mpmm-triton mpmm-waterGenasi mpmm-airGenasi hadozee plasmoid mark-finding
      mark-handling mark-storm locathah
    `,
    movement: `
      woodElf oldEladrin oldShadarKai protectorAasimar oldTabaxi swiftstride simic oldCentaur oldAarakocra
      mpmm-aarakocra mpmm-centaur mpmm-eladrin mpmm-fairy mpmm-harengon mpmm-orc mpmm-shadarKai mpmm-tabaxi
      astralElf hadozee dhampir witchFairy witchHarengon owlin mark-passage mark-storm
    `,
    healing: 'protectorAasimar scourgeAasimar fallenAasimar mpmm-aasimar autognome mark-healing',
    support: `
      oldKobold mpmm-kobold mpmm-hobgoblin oldOrc mark-hospitality mark-healing mark-sentinel metallicDragon
    `,
  },
  job: {
    melee: 'barbarian fighter monk paladin ranger rogue bloodhunter',
    ranged: 'fighter ranger rogue artificer warlock',
    defense: 'barbarian fighter monk paladin artificer cleric',
    support: 'artificer bard cleric druid paladin wizard sorcerer',
    healing: 'artificer bard cleric druid paladin ranger',
    control: 'bard cleric druid monk sorcerer warlock wizard',
    stealth: 'rogue ranger druid monk',
    scout: 'rogue ranger druid monk',
    social: 'bard paladin rogue sorcerer warlock',
    lore: 'wizard artificer bard cleric',
    wilderness: 'barbarian druid ranger',
  },
  background: {
    social: `
      charlatan criminal guild acolyte 远行者 城市猎人 朝臣 骑士团成员 派系特工 深水人贵族 笑面人 粹丽学生 衡鉴学生 靡华学生 银毫学生 走私者 艺人 平民英雄 贵族 士兵
      祀徒 维齐尔 逆徒 间谍 角斗士 公会商人 骑士 海盗 家族代理人 索兰尼亚骑士 受宠者 受难者 假面人 巫光雇工 审判官 名人冒险家的子孙 失败商人 赌徒 起诉人 竞争对手实习生 俄佐立参议院成员
      底密尔会堂成员 欧佐夫集团成员 拉铎斯教派成员 瑟雷尼亚盟会成员 幻身灵旅者 马伦蒂 扣环帮成员 前邪教徒 大陆贵族 虔诚传教士 万象会特工
    `,
    stealth: 'charlatan criminal 城市猎人 派系特工 笑面人 沃什塔克特工 走私者 流浪儿 间谍 荒宇人 假面人 底密尔会堂成员 扣环帮成员',
    lore: `
      sage acolyte 继承人 骑士团成员 与世隔绝的学者 宗族工匠 粹丽学生 衡鉴学生 量析学生 隐士 祀徒 维齐尔 噩梦缠身 调查员 高等术法会大法师 符文雕刻者 位面哲学家 人类学家 考古学家
      俄佐立参议院成员 伊捷联盟成员 欧佐夫集团成员 瑟雷尼亚盟会成员 析米克联合成员 城市守卫（调查者） 达坎地精 学苑学者 前邪教徒 魔法血脉 虔诚传教士
    `,
    scout: '城市猎人 城市守卫 老佣兵 派系特工 沃什塔克特工 流浪儿 间谍 荒宇人 调查员 门镇守卫 精界迷失者 底密尔会堂成员 城市守卫（调查者） 阿沙里人 白石城步枪团 寻宝者 灰色猎手',
    wilderness: '乌斯伽部族成员 渔民 船工 平民英雄 化外之民 水手 海盗 星界浪客 荒宇人 巨人养子 精界迷失者 葛加理群落成员 古鲁部落成员 阿沙里人 幸存者 寻宝者',
    tools: 'guild charlatan criminal 宗族工匠 量析学生 船工 艺人 平民英雄 流浪儿 角斗士 公会商人 考古学家 失败商人 赌徒 伊捷联盟成员 扣环帮成员',
    athletics: '城市守卫 老佣兵 乌斯伽部族成员 海军 士兵 运动员 索兰尼亚骑士 波洛斯教团成员 古鲁部落成员',
  },
  subclass: {
    melee: `
      战地匠师 装甲师 狂战士道途 战狂 图腾武者道途 先祖守卫道途 风暴先驱道途 野兽道途 狂热者道途 巨像道途 勇气学院 剑舞学院 战争领域 月亮结社 孢子结社 勇士 战斗大师 奥法骑士 骑兵 武士 回音骑士
      符文骑士 灵能武士 紫龙骑士 散打宗 暗影宗 永亡宗 醉拳宗 剑圣宗 星我宗 神龙宗 命流宗 钴魂宗 易戎武者 奉献之誓 古贤之誓 复仇之誓 破誓者 王冠之誓 征服之誓 救赎之誓 守望之誓 荣耀之誓 远洋之誓
      猎人 怪物杀手 龙兽守卫 咒剑 剑咏 弑灵结社 化狼结社 突变结社 渎魂结社 thief assassin swashbuckler soulknife
    `,
    ranged: '魔炮师 装甲师 猎人 驯兽师 边界行者 怪物杀手 集群牧者 幽域追踪者 战斗大师 勇士 武士 魔射手 四象宗 日魂宗 scout soulknife',
    damage: '魔炮师 光明领域 风暴领域 死亡领域 风暴术法 邪魔 塑能学派 死灵学派 血魔法',
    defense: `
      月之术法 巨灵宗主 符文之子 魔炮师 装甲师 先祖守卫道途 风暴先驱道途 狂热者道途 图腾武者道途 锻造领域 暮光领域 和平领域 坟墓领域 月亮结社 枯朽结社 奥法骑士 骑兵 灵能武士 符文骑士 永亡宗
      奉献之誓 古贤之誓 王冠之誓 救赎之誓 守望之誓 龙族血脉 时械之魂 符文之子 不朽者 死灵宗主 防护学派 战争魔法 剑咏
    `,
    magic: '鬼才 狂野魔法 巨灵宗主 咒法学派 月之术法 奥秘领域',
    movement: '风暴术法 月亮领域 巨灵宗主 咒法学派',
    control: `
      心灵领域 鲜血领域 散打宗 四象宗 钴魂宗 魔射手 骑兵 符文骑士 重力魔法 时间魔法 惑控学派 悲剧学院 低语学院 迷惑学院 秩序领域 征服之誓 破誓者 远洋之誓 神龙宗 集群牧者 畸变心智 至高妖精
      深海意志 旧日支配者
    `,
    support: `
      心灵领域 鲜血领域 月亮领域 炼金师 魔炮师 战地匠师 锻造师 狂野魔法道途 先祖守卫道途 逸闻学院 勇气学院 创造学院 雄辩学院 迷惑学院 精魂学院 悲剧学院 挽歌吟者学院 知识领域 生命领域 诡术领域
      秩序领域 和平领域 暮光领域 坟墓领域 大地结社 梦境结社 牧人结社 星辰结社 枯朽结社 野火结社 战斗大师 紫龙骑士 灵能武士 命流宗 奉献之誓 古贤之誓 王冠之誓 救赎之誓 守望之誓 荣耀之誓 妖精漫游者
      神圣之魂 时械之魂 天界 预言学派 时间魔法 幻术学派 书士会 变化学派 mastermind
    `,
    healing: '炼金师 生命领域 和平领域 坟墓领域 梦境结社 牧人结社 野火结社 星辰结社 枯朽结社 命流宗 神圣之魂 天界',
    stealth: '幽域追踪者 暗影宗 幽影魔法 诡术领域 幻术学派 assassin thief arcane soulknife',
    scout: '边界行者 幽域追踪者 驯兽师 回音骑士 暗影宗 幽影魔法 预言学派 scout inquisitive phantom',
    social: `
      雄辩学院 低语学院 迷惑学院 诡术领域 妖精漫游者 畸变心智 至高妖精 旧日支配者 惑控学派 幻术学派 assassin mastermind inquisitive swashbuckler
      soulknife
    `,
    lore: '逸闻学院 精魂学院 知识领域 奥秘领域 星辰结社 钴魂宗 书士会 预言学派 phantom',
    wilderness: '图腾武者道途 野兽道途 自然领域 大地结社 月亮结社 牧人结社 驯兽师 集群牧者 龙兽守卫 远洋之誓 scout',
  },
  spell: {
    damage: `
      call-lightning lightning-arrow swift-quiver meteor-swarm jims-magic-missile vitriolic-sphere enervation
      immolation infernal-calling tether-essence shillelagh magic-stone divine-favor hunters-mark hex
      magic-weapon dragons-breath summon-beast conjure-animals animate-dead crusaders-mantle elemental-weapon
      flame-arrows summon-fey summon-lesser-demons summon-shadowspawn summon-undead conjure-minor-elementals
      conjure-woodland-beings giant-insect guardian-of-faith summon-aberration summon-construct
      summon-elemental summon-greater-demon animate-objects conjure-elemental danse-macabre holy-weapon
      summon-celestial summon-draconic-spirit conjure-fey create-undead summon-fiend conjure-celestial
      illusory-dragon blade-of-disaster
    `,
    healing: `
      spare-the-dying cure-wounds goodberry healing-word lesser-restoration prayer-of-healing healing-spirit
      wither-and-bloom aura-of-vitality mass-healing-word revivify life-transference aura-of-life
      greater-restoration mass-cure-wounds raise-dead reincarnate heal regenerate resurrection mass-heal
      power-word-heal true-resurrection
    `,
    support: `
      guidance message resistance bane bless faerie-fire feather-fall heroism longstrider sanctuary
      shield-of-faith beast-bond ceremony gift-of-alacrity silvery-barbs aid darkvision enhance-ability
      enlarge-reduce lesser-restoration magic-weapon pass-without-trace protection-from-poison
      see-invisibility warding-bond air-bubble dragons-breath fortunes-favor wither-and-bloom beacon-of-hope
      create-food-and-water crusaders-mantle elemental-weapon fly haste protection-from-energy remove-curse
      sending tongues water-breathing water-walk catnap flame-arrows intellect-fortress motivational-speech
      aura-of-life aura-of-purity death-ward freedom-of-movement greater-invisibility polymorph stoneskin
      circle-of-power greater-restoration hallow rarys-telepathic-bond skill-empowerment holy-weapon heal
      heroes-feast true-seeing wind-walk fizbans-platinum-shield scatter temple-of-the-gods animal-shapes
      holy-aura mind-blank foresight mass-heal power-word-heal
    `,
    control: `
      chill-touch ray-of-frost shocking-grasp thorn-whip vicious-mockery booming-blade frostbite gust
      infestation lightning-lure mind-sliver sapping-sting arms-of-hadar bane charm-person color-spray command
      compelled-duel dissonant-whispers ensnaring-strike entangle fog-cloud grease hex ray-of-sickness
      searing-smite sleep tashas-hideous-laughter thunderous-smite thunderwave wrathful-smite cause-fear
      earth-tremor magnify-gravity snare blindness-deafness calm-emotions crown-of-madness darkness enthrall
      gust-of-wind heat-metal hold-person levitate phantasmal-force ray-of-enfeeblement silence spike-growth
      suggestion web zone-of-truth earthbind maximilians-earthen-grasp nathairs-mischief pyrotechnics
      rimes-binding-ice tashas-mind-whip vortex-warp warding-wind bestow-curse blinding-smite fear
      hunger-of-hadar hypnotic-pattern magic-circle plant-growth sleet-storm slow spirit-guardians
      stinking-cloud wind-wall enemies-abound erupting-earth fast-friends incite-greed pulse-wave
      summon-shadowspawn tidal-wave wall-of-sand banishment compulsion confusion control-water dominate-beast
      evards-black-tentacles grasping-vine ice-storm otilukes-resilient-sphere phantasmal-killer polymorph
      staggering-smite wall-of-fire charm-monster gravity-sinkhole raulothims-psychic-lance sickening-radiance
      storm-sphere watery-sphere antilife-shell banishing-smite bigbys-hand cloudkill contagion
      destructive-wave dispel-evil-and-good dominate-person geas hold-monster insect-plague modify-memory
      planar-binding telekinesis wall-of-force wall-of-stone control-winds maelstrom synaptic-static
      temporal-shunt transmute-rock wall-of-light wrath-of-nature blade-barrier eyebite flesh-to-stone
      mass-suggestion otilukes-freezing-sphere ottos-irresistible-dance sunbeam wall-of-ice wall-of-thorns
      bones-of-the-earth gravity-fissure investiture-of-ice investiture-of-wind mental-prison scatter
      divine-word forcecage plane-shift prismatic-spray reverse-gravity symbol power-word-pain whirlwind
      antimagic-field antipathy-sympathy dominate-monster earthquake feeblemind maze power-word-stun sunburst
      tsunami dark-star reality-break imprisonment prismatic-wall storm-of-vengeance true-polymorph weird
      mass-polymorph psychic-scream ravenous-void time-ravage
    `,
    accuracy: 'true-strike bless faerie-fire guiding-bolt',
    finishing: 'divine-word power-word-kill',
    defense: `
      freedom-of-the-winds clone time-stop wall-of-water blade-ward resistance alarm armor-of-agathys
      false-life feather-fall heroism mage-armor protection-from-evil-and-good sanctuary shield
      shield-of-faith absorb-elements aid arcane-lock barkskin blur mirror-image protection-from-poison
      rope-trick warding-bond warding-wind blink counterspell dispel-magic feign-death glyph-of-warding
      intellect-fortress leomunds-tiny-hut magic-circle motivational-speech nondetection
      protection-from-energy wind-wall aura-of-life aura-of-purity death-ward fire-shield freedom-of-movement
      guardian-of-faith mordenkainens-private-sanctum otilukes-resilient-sphere shadow-of-moil stoneskin
      antilife-shell circle-of-power dispel-evil-and-good hallow wall-of-force contingency forbiddance
      globe-of-invulnerability guards-and-wards heroes-feast druid-grove fizbans-platinum-shield
      investiture-of-flame investiture-of-ice investiture-of-stone investiture-of-wind primordial-ward
      tashas-otherworldly-guise tensers-transformation sequester temple-of-the-gods antimagic-field holy-aura
      mind-blank mighty-fortress foresight invulnerability prismatic-wall
    `,
    movement: `
      freedom-of-the-winds expeditious-retreat feather-fall jump longstrider tensers-floating-disk
      zephyr-strike alter-self find-steed kinetic-jaunt levitate misty-step spider-climb vortex-warp
      air-bubble ashardalons-stride blink fly gaseous-form haste meld-into-stone phantom-steed thunder-step
      water-breathing water-walk dimension-door find-greater-steed freedom-of-movement control-water far-step
      passwall steel-wind-strike teleportation-circle tree-stride arcane-gate find-the-path scatter
      transport-via-plants wind-walk word-of-recall investiture-of-stone investiture-of-wind
      tashas-otherworldly-guise etherealness plane-shift teleport dream-of-the-blue-veil astral-projection
      gate
    `,
    stealth: `
      minor-illusion disguise-self fog-cloud illusory-script silent-image alter-self darkness invisibility
      nystuls-magic-aura pass-without-trace rope-trick silence major-image nondetection greater-invisibility
      hallucinatory-terrain mislead seeming programmed-illusion mirage-arcane project-image sequester
    `,
    social: `
      jims-glowing-coin friends message prestidigitation thaumaturgy animal-friendship charm-person
      comprehend-languages disguise-self illusory-script speak-with-animals ceremony distort-value
      animal-messenger calm-emotions detect-thoughts enthrall gift-of-gab magic-mouth skywrite suggestion
      zone-of-truth fast-friends incite-greed sending speak-with-dead speak-with-plants tongues charm-monster
      dominate-beast awaken dominate-person dream geas modify-memory rarys-telepathic-bond seeming
      mass-suggestion glibness telepathy
    `,
    exploration: `
      dancing-lights druidcraft light mage-hand mending minor-illusion prestidigitation produce-flame
      thaumaturgy control-flames gust mold-earth shape-water alarm comprehend-languages
      create-or-destroy-water detect-evil-and-good detect-magic detect-poison-and-disease find-familiar
      goodberry identify purify-food-and-drink speak-with-animals tensers-floating-disk unseen-servant augury
      beast-sense continual-flame darkvision detect-thoughts find-traps gentle-repose gust-of-wind knock
      locate-animals-or-plants locate-object magic-mouth rope-trick see-invisibility shatter spider-climb
      borrowed-knowledge immovable-object wristpocket clairvoyance create-food-and-water daylight dispel-magic
      gaseous-form leomunds-tiny-hut meld-into-stone phantom-steed sending speak-with-dead speak-with-plants
      tiny-servant tongues water-breathing water-walk arcane-eye control-water divination fabricate
      hallucinatory-terrain leomunds-secret-chest locate-creature stone-shape awaken commune
      commune-with-nature contact-other-plane creation legend-lore passwall scrying telekinesis
      create-spelljamming-helm control-winds transmute-rock drawmijs-instant-summons find-the-path magic-jar
      move-earth planar-ally true-seeing create-homunculus druid-grove soul-cage etherealness mirage-arcane
      mordenkainens-magnificent-mansion project-image simulacrum control-weather demiplane mighty-fortress
      animal-shapes shapechange true-polymorph wish
    `,
  },
  gear: {
    storage: 'barrel basket glass-bottle scroll-case chest flask jug pouch sack vial quiver',
    exploration: `
      travelers-clothes bell candle chalk sledgehammer iron-pot iron-spikes backpack bedroll blanket crowbar
      torch ration waterskin hempen-rope dungeoneers-pack explorers-pack burglars-pack lantern oil tinderbox
      mess-kit hammer pitons bucket bullseye-lantern climbers-kit fishing-tackle grappling-hook ladder lamp
      piton pole silk-rope spyglass tent signal-whistle
    `,
    tools: `
      hourglass ink ink-pen steel-mirror paper parchment merchants-scale sealing-wax soap thieves-tools
      disguise-kit forgery-kit herbalism-kit poisoners-kit navigators-tools smiths-tools brewers-supplies
      masons-tools abacus block-and-tackle crowbar hammer climbers-kit fishing-tackle miners-pick portable-ram
      shovel whetstone alchemists-supplies calligraphers-supplies carpenters-tools cartographers-tools
      cobblers-tools cooks-utensils glassblowers-tools jewelers-tools leatherworkers-tools painters-supplies
      potters-tools tinkers-tools weavers-tools woodcarvers-tools
    `,
    healing: 'healers-kit healing-potion antitoxin herbalism-kit',
    stealth: 'thieves-tools disguise-kit burglars-pack',
    social: `
      common-clothes robes disguise-kit forgery-kit diplomats-pack entertainers-pack gaming-set fine-clothes
      costume perfume signet-ring dragonchess playing-cards three-dragon-ante
    `,
    control: 'caltrops ball-bearings hunting-trap manacles chain lock',
    damage: 'acid alchemists-fire holy-water basic-poison',
    lore: 'book magnifying-glass scholars-pack',
    magic: `
      component-pouch arcane-focus druidic-focus holy-symbol spellbook focus-crystal focus-orb focus-rod
      focus-wand druidic-totem druidic-staff druidic-wand holy-emblem holy-reliquary priests-pack
    `,
    ranged: 'arrows bolts sling-bullets blowgun-needles bolt-case quiver',
    movement: `
      bit-and-bridle carriage cart chariot feed saddlebags sled wagon exotic-saddle military-saddle
      pack-saddle riding-saddle
    `,
  },
};

const optionPurposes = Object.fromEntries(Object.entries(purposeGroups).map(([group, tags]) => {
  const lookup = new Map();
  for (const [tag, ids] of Object.entries(tags)) {
    for (const id of ids.trim().split(/\s+/u)) {
      if (!lookup.has(id)) lookup.set(id, []);
      if (!lookup.get(id).includes(tag)) lookup.get(id).push(tag);
    }
  }
  return [group, lookup];
}));

// Short advice for gear whose printed statistics describe a cost or capacity
// but don't tell a new player why they would carry it.
const gearPurposeCaptions = {
  'backpack': ['把随身装备集中背在身上。', 'Carry your adventuring gear on your back.'],
  'bedroll': ['在没有床的地方铺开睡觉。', 'Unroll it to sleep without a bed.'],
  'blanket': ['在露营或休息时保暖。', 'Keep warm while resting or camping.'],
  'crowbar': ['借杠杆撬开卡住的东西。', 'Use leverage to pry something open.'],
  'torch': ['点燃后照亮身边。', 'Light it to illuminate your surroundings.'],
  'ration': ['储备旅行途中吃的干粮。', 'Carry food for days on the road.'],
  'waterskin': ['在旅途中携带饮水。', 'Carry drinking water on the road.'],
  'hempen-rope': ['用来攀爬、固定物体或拉拽物品。', 'Climb, secure objects, or haul gear.'],
  'silk-rope': ['比麻绳轻，适合攀爬或拉拽物品。', 'A lighter rope for climbing or hauling.'],
  'thieves-tools': ['开锁或解除陷阱。', 'Pick locks or disarm traps.'],
  'disguise-kit': ['用妆容、假发和道具改换外观。', 'Change your appearance with makeup, wigs, and props.'],
  'forgery-kit': ['制作或仿造文件。', 'Create or forge documents.'],
  'herbalism-kit': ['辨识草药，并用来制作解毒剂或治疗药水。', 'Identify herbs and make antitoxin or healing potions.'],
  'poisoners-kit': ['制作或使用毒药。', 'Create or apply poisons.'],
  'navigators-tools': ['在海上辨认航向并绘制航图。', 'Chart a course and navigate at sea.'],
  'smiths-tools': ['锻造和修理金属制品。', 'Forge and repair metalwork.'],
  'brewers-supplies': ['酿制饮品。', 'Brew drinks.'],
  'masons-tools': ['加工石材或修建石工结构。', 'Work stone and build masonry.'],
  'component-pouch': ['装常用施法材料；标有价格的材料另备。', 'Carry common spell components; buy priced components separately.'],
  'spellbook': ['法师用来抄录和准备有环法术。', 'Record and prepare a wizard’s leveled spells.'],
  'common-clothes': ['适合日常活动的便装。', 'Dress for everyday activities.'],
  'fine-clothes': ['适合觐见或其他正式场合。', 'Dress for audiences and other formal occasions.'],
  'travelers-clothes': ['适合赶路的结实衣服。', 'Wear sturdy clothes for travel.'],
  'oil': ['给油灯供油，也可倒在地面后点燃。', 'Fuel a lamp or spill and ignite it on the ground.'],
  'tinderbox': ['点燃火把、营火或其他燃料。', 'Light torches, campfires, or other fuel.'],
  'mess-kit': ['在路上做饭和进餐。', 'Cook and eat meals on the road.'],
  'pitons': ['为攀爬设置锚点。', 'Set anchor points for a climb.'],
  'bell': ['发出声响，用于传信或设警报。', 'Sound a signal or rig a simple alarm.'],
  'chalk': ['在路上留下记号。', 'Mark routes and surfaces.'],
  'climbers-kit': ['用岩钉、绳带等在攀爬时保护自己。', 'Use pitons and a harness to secure a climb.'],
  'fishing-tackle': ['用来钓鱼获取食物。', 'Catch fish for food.'],
  'grappling-hook': ['抛到高处后固定攀爬绳索。', 'Anchor a rope above you for a climb.'],
  'ladder': ['攀登高度有限的墙或障碍。', 'Climb short walls or obstacles.'],
  'bullseye-lantern': ['把灯光集中照向前方。', 'Shine a focused beam ahead of you.'],
  'magnifying-glass': ['放大字迹或小物件的细节。', 'Examine small objects or writing in detail.'],
  'manacles': ['限制被铐住的目标行动。', 'Restrict a creature’s movements with restraints.'],
  'portable-ram': ['用来破门。', 'Break open a door.'],
  'signal-whistle': ['用清楚的哨声向远处发信号。', 'Send an audible signal over a distance.'],
  'spyglass': ['看清远处物体的细节。', 'See details of distant objects.'],
  'tent': ['扎营时提供遮蔽。', 'Take shelter while camping.'],
  'ink': ['用来写字、绘图或记录信息。', 'Write, draw, or record information.'],
  'ink-pen': ['蘸墨在纸上或羊皮纸上书写。', 'Dip it in ink to write on paper or parchment.'],
  'signet-ring': ['在封蜡上留下身份印记。', 'Stamp an identifying seal in wax.'],
  'healers-kit': ['稳定濒死生物，无需医药检定。', 'Stabilize a dying creature without a Medicine check.'],
  'healing-potion': ['饮用后恢复生命值。', 'Drink it to regain hit points.'],
  'antitoxin': ['短时间内对抗毒素的豁免有优势。', 'Gain temporary advantage on saving throws against poison.'],
  'burglars-pack': ['备有撬棍、灯和铁蒺藜等潜入用品。', 'Carry a crowbar, lantern, and caltrops for infiltration.'],
  'dungeoneers-pack': ['带上撬棍、火把和绳索探索地下。', 'Explore underground with a crowbar, torches, and rope.'],
  'explorers-pack': ['带上睡袋、口粮和火把出门远行。', 'Travel with a bedroll, rations, and torches.'],
  'diplomats-pack': ['带上正式服装、纸笔和封蜡拜会他人。', 'Carry formal clothes, writing supplies, and sealing wax for visits.'],
  'entertainers-pack': ['带上戏服和化妆用具准备演出。', 'Carry costumes and a disguise kit for performances.'],
  'priests-pack': ['带上香、香炉和法衣举行宗教仪式。', 'Carry incense, a censer, and vestments for ceremonies.'],
  'scholars-pack': ['带上书籍和纸笔查阅或记录知识。', 'Carry a book and writing supplies for research.'],
};

const gearPurposeFallbacks = {
  storage: ['装载或保护物品。', 'Carry or protect belongings.'],
  exploration: ['可用于旅途或探索时的准备。', 'Pack it for travel and exploration.'],
  tools: ['做相关手艺、测量或操作时使用。', 'Use it for the relevant craft, measurement, or task.'],
  control: ['用来阻碍行动或限制通行。', 'Hinder movement or restrict access.'],
  damage: ['按物品的条件使用可造成伤害。', 'Deal damage under the item’s listed conditions.'],
  magic: ['在符合职业施法规则时作为法器使用。', 'Use as a spellcasting focus when your class allows it.'],
  lore: ['用来查阅或辨认细节。', 'Consult it or examine details.'],
  social: ['可用于表演、游戏或应对社交场合。', 'Use it for performances, games, or social occasions.'],
  movement: ['用于旅行、运输或照料坐骑。', 'Use for travel, transport, or tending a mount.'],
  ranged: ['配合使用对应弹药的远程武器。', 'Use with a ranged weapon that takes this ammunition.'],
};
