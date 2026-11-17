// Spell grants are keyed by class level. Every entry keeps its own casting mode.
const spellProfiles = {
  cleric: {
    死亡领域: {prepared: {1:'false-life ray-of-sickness',3:'blindness-deafness ray-of-enfeeblement',5:'animate-dead vampiric-touch',7:'blight death-ward',9:'antilife-shell cloudkill'}},
    锻造领域: {prepared: {1:'identify searing-smite',3:'heat-metal magic-weapon',5:'elemental-weapon protection-from-energy',7:'fabricate wall-of-fire',9:'animate-objects creation'}},
    秩序领域: {prepared: {1:'command heroism',3:'hold-person zone-of-truth',5:'mass-healing-word slow',7:'compulsion locate-creature',9:'commune dominate-person'}},
    和平领域: {prepared: {1:'heroism sanctuary',3:'aid warding-bond',5:'beacon-of-hope sending',7:'aura-of-purity otilukes-resilient-sphere',9:'greater-restoration rarys-telepathic-bond'}},
    暮光领域: {prepared: {1:'faerie-fire sleep',3:'moonbeam see-invisibility',5:'aura-of-vitality leomunds-tiny-hut',7:'aura-of-life greater-invisibility',9:'circle-of-power mislead'}},
    坟墓领域: {prepared: {1:'bane false-life',3:'gentle-repose ray-of-enfeeblement',5:'revivify vampiric-touch',7:'blight death-ward',9:'antilife-shell raise-dead'}, known: {1:'spare-the-dying'}},
    奥秘领域: {prepared: {1:'detect-magic magic-missile',3:'magic-weapon nystuls-magic-aura',5:'dispel-magic magic-circle',7:'arcane-eye leomunds-secret-chest',9:'planar-binding teleportation-circle'}},
    光明领域: {known: {1:'light'}},
    月亮领域: {prepared: {1:'faerie-fire silent-image',3:'invisibility moonbeam',5:'hypnotic-pattern major-image',7:'greater-invisibility hallucinatory-terrain',9:'dream passwall'}},
    鲜血领域: {prepared: {1:'false-life sleep',3:'hold-person ray-of-enfeeblement',5:'haste slow',7:'blight stoneskin',9:'dominate-person hold-monster'}},
    心灵领域: {prepared: {1:'command dissonant-whispers',3:'detect-thoughts phantasmal-force',5:'enemies-abound fear',7:'confusion phantasmal-killer',9:'dominate-person telekinesis'}},
  },
  druid: {
    孢子结社: {known: {2:'chill-touch'}, prepared: {3:'blindness-deafness gentle-repose',5:'animate-dead gaseous-form',7:'blight confusion',9:'cloudkill contagion'}},
    野火结社: {prepared: {2:'burning-hands cure-wounds',3:'flaming-sphere scorching-ray',5:'plant-growth revivify',7:'aura-of-life fire-shield',9:'flame-strike mass-cure-wounds'}},
    星辰结社: {known: {2:'guidance'}, prepared: {2:'guiding-bolt'}, limited: {2:'guiding-bolt'}, use: '需持握星图。可用法术位，另有熟练加值次免法术位施放，长休恢复。'},
    梦境结社: {limited: {14:'dream scrying teleportation-circle'}, use: '完成短休时，选择其中一项免材料施放。梦境必须以你为信使，传送目的地限上次长休地点。每长休一次。'},
  },
  paladin: {
    破誓者: {prepared: {3:'hellish-rebuke inflict-wounds',5:'crown-of-madness darkness',9:'animate-dead bestow-curse',13:'blight confusion',17:'contagion dominate-person'}},
    王冠之誓: {prepared: {3:'command compelled-duel',5:'warding-bond zone-of-truth',9:'aura-of-vitality spirit-guardians',13:'banishment guardian-of-faith',17:'circle-of-power geas'}},
    征服之誓: {prepared: {3:'armor-of-agathys command',5:'hold-person spiritual-weapon',9:'bestow-curse fear',13:'dominate-beast stoneskin',17:'cloudkill dominate-person'}},
    救赎之誓: {prepared: {3:'sanctuary sleep',5:'calm-emotions hold-person',9:'counterspell hypnotic-pattern',13:'otilukes-resilient-sphere stoneskin',17:'hold-monster wall-of-force'}},
    守望之誓: {prepared: {3:'alarm detect-magic',5:'moonbeam see-invisibility',9:'counterspell nondetection',13:'aura-of-purity banishment',17:'hold-monster scrying'}},
    荣耀之誓: {prepared: {3:'guiding-bolt heroism',5:'enhance-ability magic-weapon',9:'haste protection-from-energy',13:'compulsion freedom-of-movement',17:'commune flame-strike'}},
    远洋之誓: {prepared: {3:'create-or-destroy-water expeditious-retreat',5:'augury misty-step',9:'call-lightning freedom-of-the-waves',13:'control-water freedom-of-movement',17:'commune-with-nature freedom-of-the-winds'}},
  },
  ranger: {
    幽域追踪者: {known: {3:'disguise-self',5:'rope-trick',9:'fear',13:'greater-invisibility',17:'seeming'}},
    边界行者: {known: {3:'protection-from-evil-and-good',5:'misty-step',9:'haste',13:'banishment',17:'teleportation-circle'},
      limited: {7:'etherealness'}, use: '以附赠动作施放，持续至本回合结束。短休或长休恢复一次。'},
    怪物杀手: {known: {3:'protection-from-evil-and-good',5:'zone-of-truth',9:'magic-circle',13:'banishment',17:'hold-monster'}},
    集群牧者: {known: {3:'mage-hand faerie-fire',5:'web',9:'gaseous-form',13:'arcane-eye',17:'insect-plague'}},
    妖精漫游者: {known: {3:'charm-person',5:'misty-step',9:'dispel-magic',11:'summon-fey',13:'dimension-door',17:'mislead'}},
    龙兽守卫: {known: {3:'thaumaturgy'}},
  },
  sorcerer: {
    神圣之魂: {lists: ['cleric'], swap: 'divine'},
    幽影魔法: {known: {3:'darkness'}},
    畸变心智: {known: {1:'arms-of-hadar dissonant-whispers mind-sliver',3:'calm-emotions detect-thoughts',5:'hunger-of-hadar sending',7:'evards-black-tentacles summon-aberration',9:'rarys-telepathic-bond telekinesis'}, swap: 'psionic'},
    时械之魂: {known: {1:'alarm protection-from-evil-and-good',3:'aid lesser-restoration',5:'dispel-magic protection-from-energy',7:'freedom-of-movement summon-construct',9:'greater-restoration wall-of-force'}, swap: 'clockwork'},
    月之术法: {known: {1:'sacred-flame shield ray-of-sickness color-spray',3:'lesser-restoration blindness-deafness alter-self',5:'dispel-magic vampiric-touch phantom-steed',7:'death-ward confusion hallucinatory-terrain',9:'rarys-telepathic-bond hold-monster mislead'}},
  },
  warlock: {
    不朽者: {expanded: 'false-life ray-of-sickness blindness-deafness silence feign-death speak-with-dead aura-of-life death-ward contagion legend-lore', known: {1:'spare-the-dying'}},
    咒剑: {expanded: 'shield wrathful-smite blur branding-smite blink elemental-weapon phantasmal-killer staggering-smite banishing-smite cone-of-cold'},
    深海意志: {expanded: 'create-or-destroy-water thunderwave gust-of-wind silence lightning-bolt sleet-storm control-water summon-elemental bigbys-hand cone-of-cold',
      known: {10:'evards-black-tentacles'}, limited: {10:'evards-black-tentacles'}, use: '每长休可免法术位施展一次。'},
    巨灵宗主: {expanded: 'detect-evil-and-good phantasmal-force create-food-and-water phantasmal-killer creation wish'},
    天界: {expanded: 'cure-wounds guiding-bolt flaming-sphere lesser-restoration daylight revivify guardian-of-faith wall-of-fire flame-strike greater-restoration', known: {1:'light sacred-flame'}},
    死灵宗主: {expanded: 'bane false-life blindness-deafness phantasmal-force phantom-steed speak-with-dead death-ward greater-invisibility antilife-shell cloudkill'},
  },
  wizard: {
    时间魔法: {expanded: 'sapping-sting gift-of-alacrity fortunes-favor immovable-object wristpocket pulse-wave temporal-shunt tether-essence reality-break time-ravage'},
    重力魔法: {expanded: 'sapping-sting magnify-gravity fortunes-favor immovable-object wristpocket pulse-wave gravity-sinkhole gravity-fissure tether-essence dark-star ravenous-void'},
  },
  artificer: {
    炼金师: {prepared: {3:'healing-word ray-of-sickness',5:'flaming-sphere melfs-acid-arrow',9:'gaseous-form mass-healing-word',13:'blight death-ward',17:'cloudkill raise-dead'},
      limited: {9:'lesser-restoration',15:'greater-restoration heal'}},
    魔炮师: {prepared: {3:'shield thunderwave',5:'scorching-ray shatter',9:'fireball wind-wall',13:'ice-storm wall-of-fire',17:'cone-of-cold wall-of-force'}},
    战地匠师: {prepared: {3:'heroism shield',5:'branding-smite warding-bond',9:'aura-of-vitality conjure-barrage',13:'aura-of-purity fire-shield',17:'banishing-smite mass-cure-wounds'}},
    装甲师: {prepared: {3:'magic-missile thunderwave',5:'mirror-image shatter',9:'hypnotic-pattern lightning-bolt',13:'fire-shield greater-invisibility',17:'passwall wall-of-force'}},
    锻造师: {prepared: {3:'armor-of-agathys shield-of-faith',5:'spiritual-weapon warding-bond',9:'beacon-of-hope remove-curse',13:'death-ward fire-shield',17:'banishing-smite wall-of-force'}},
  },
  monk: {
    暗影宗: {known: {3:'minor-illusion'}, limited: {3:'darkness darkvision pass-without-trace silence'}, use: '花 2 气施放，免材料成分。'},
  },
};

const genieExpandedSpells = {
  dao: 'sanctuary spike-growth meld-into-stone stone-shape wall-of-stone',
  djinni: 'thunderwave gust-of-wind wind-wall greater-invisibility seeming',
  efreeti: 'burning-hands scorching-ray fireball fire-shield flame-strike',
  marid: 'fog-cloud blur sleet-storm control-water cone-of-cold',
};

const divineSpellAffinities = {
  'cure-wounds': '善良',
  'inflict-wounds': '邪恶',
  bless: '守序',
  bane: '混乱',
  'protection-from-evil-and-good': '中立',
};

const profanePatronSpells = {
  archfey: ['至高妖精', 'blur', 'slow'],
  celestial: ['天界', 'lesser-restoration', 'revivify'],
  fathomless: ['深海意志', 'gust-of-wind', 'lightning-bolt'],
  fiend: ['邪魔', 'scorching-ray', 'fireball'],
  genie: ['巨灵', 'phantasmal-force', 'protection-from-energy'],
  greatOldOne: ['旧日支配者', 'detect-thoughts', 'haste'],
  hexblade: ['咒剑', 'branding-smite', 'blink'],
  undead: ['死灵', 'blindness-deafness', 'speak-with-dead'],
  undying: ['不朽者', 'silence', 'bestow-curse'],
};

coreSpells.push(
  {id:'freedom-of-the-waves', name:'浪之自由', en:'Freedom of the Waves', level:3, school:'咒法', schoolCode:'C', classes:[],
    ritual:false, concentration:false, time:'1 动作', range:'120 尺', duration:'立即', components:'V、S、M',
    summary:'创造一柱浪涌，力量豁免失败的生物受 2d8 钝击并倒地。可让选定目标自动通过，也可在水柱内传送。',
    sourceVersion:'2014', sourceBook:'塔尔多雷 · 第三方', source:'https://5echm.kagangtuya.top/topics/第三方/塔尔多雷/玩家选项/圣武士-远洋之誓.htm'},
  {id:'freedom-of-the-winds', name:'风之自由', en:'Freedom of the Winds', level:5, school:'防护', schoolCode:'A', classes:[],
    ritual:false, concentration:true, time:'1 动作', range:'自身', duration:'至多 10 分钟', components:'V、S、M',
    summary:'获得飞行速度和抗束缚能力。成为攻击或法术目标时，可用反应传送，可能离开效果范围。',
    sourceVersion:'2014', sourceBook:'塔尔多雷 · 第三方', source:'https://5echm.kagangtuya.top/topics/第三方/塔尔多雷/玩家选项/圣武士-远洋之誓.htm'},
);
