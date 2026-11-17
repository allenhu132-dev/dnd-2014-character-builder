// Rule IDs and saved character data stay in their original form in both languages.
const CharacterLocale = (() => {
  const storageKey = 'dnd-2014-workbench-language';
  const catalog = /* ENGLISH_CATALOG */;
  const han = /\p{Script=Han}/u;
  const attributes = ['aria-label', 'aria-valuetext', 'title', 'placeholder', 'alt'];
  const templates = [
    [/^剩余 (\d+)\s*\/\s*27 点$/, 'Points left: $1 / 27'],
    [/^剩余 (\d+) 点$/, 'Points left: $1'],
    [/^第 (\d+) \/ (\d+) 步$/, 'Step $1 of $2'],
    [/^预览 (\d+) 级$/, 'Preview: Level $1'],
    [/^实际 (\d+) 级$/, 'Actual: Level $1'],
    [/^显示 (\d+) \/ (\d+) 项$/, 'Showing $1 of $2'],
    [/^(\d+) 个$/, '$1 selected'],
    [/^(\d+) 项$/, '$1 items'],
    [/^(\d+) 种物品$/, '$1 item types'],
    [/^已记录 (\d+) 项法术$/, '$1 spells recorded'],
    [/^(\d+) 级新增与选择$/, 'Level $1 Features and Choices'],
    [/^(\d+) 级角色$/, 'Level $1 character'],
    [/^(\d+)\s*\/\s*(\d+) 级$/, 'Level $1 / $2'],
    [/^(\d+) 级学习法术$/, 'Learn Level $1 Spells'],
    [/^(\d+) 环施放$/, 'Cast with a level $1 slot'],
    [/^(\d+) 束，每束 1d10 力场$/, (_match, count) => count + (count === '1' ? ' beam' : ' beams') + ', each dealing 1d10 force damage'],
    [/^(\d+) 枚，每枚 1d4 \+ 1 力场$/, '$1 darts, each dealing 1d4 + 1 force damage'],
    [/^(\d+) 道射线，每道命中 2d6 火焰。$/, '$1 rays, each dealing 2d6 fire damage on a hit.'],
    [/^(\d+d8) 暗蚀。目标已失去生命值时改为 (\d+d12)。$/, '$1 necrotic damage, or $2 if the target is missing any hit points.'],
    [/^近战命中你且你仍有这份临时 HP 时，攻击者受 (\d+) 寒冷。$/, 'A creature that hits you in melee takes $1 cold damage while you still have these temporary hit points.'],
    [/^掷至多 (\d+) 枚未用生命骰，加施法属性调整值。$/, 'Roll up to $1 unspent Hit Dice and add your spellcasting ability modifier.'],
    [/^每名目标的当前和最大 HP 各增加 (\d+)。$/, 'Each target’s current and maximum hit points increase by $1.'],
    [/^(\d+) 级解锁$/, 'Unlocks at Level $1'],
    [/^(\d+) 级解锁子职$/, 'Subclass unlocks at Level $1'],
    [/^本级新增 (\d+) 个戏法、(\d+) 个有环法术。$/, 'New at this level: $1 cantrips and $2 leveled spells.'],
    [/^累计普通已知法术 (\d+) 个。$/, '$1 regular spells known in total.'],
    [/^最多 (\d+) 个$/, 'Up to $1 spells'],
    [/^最高 (\d+) 环$/, 'Up to spell level $1'],
    [/^熟练加值升至 ([+−-]\d+)$/, 'Proficiency Bonus rises to $1'],
    [/^额外攻击（共 (\d+) 次）$/, 'Extra Attack ($1 attacks total)'],
    [/^动作如潮（(\d+) 次）$/, 'Action Surge ($1 uses)'],
    [/^不屈（(\d+) 次）$/, 'Indomitable ($1 uses)'],
    [/^第 (\d+(?: \/ \d+)?) 件$/, 'Item $1'],
    [/^通常 (\d+) 次攻击，具体触发条件见职业能力。$/, 'Usually $1 attack per Attack action. Check class features for conditions.'],
    [/^从职业列表选 (\d+) 项$/, 'Choose $1 from the class list'],
    [/^通常需要一枚至少 (\d+) 环的法术位。更高法术位是否增强效果，以该法术自身说明为准。$/, 'This requires a spell slot of level $1 or higher. See the spell’s effect for any changes when using a higher-level slot.'],
    [/^近战武器，基础伤害 (.+)。$/, (_match, damage) => 'Melee weapon. Base damage: ' + english(damage) + '.'],
    [/^远程武器，基础伤害 (.+)。$/, (_match, damage) => 'Ranged weapon. Base damage: ' + english(damage) + '.'],
    [/^通常掷 d20 加(.+)调整值。有该武器熟练时，命中检定再加熟练加值。$/, (_match, ability) => 'Roll a d20 and add your ' + english(ability) + ' modifier. Add your proficiency bonus if you are proficient with this weapon.'],
    [/^命中后按 (.+)结算，通常再加所用属性调整值。$/, (_match, damage) => 'On a hit, roll ' + english(damage) + ' damage and usually add the ability modifier used for the attack.'],
    [/^查看(.+)的详情$/, (_match, name) => 'View details for ' + english(name)],
    [/^收起(.+)预览$/, (_match, name) => 'Close preview for ' + english(name)],
    [/^切换页面，当前为(.+)$/, (_match, name) => 'Switch task (current: ' + english(name) + ')'],
    [/^(力量|敏捷|体质|智力|感知|魅力)豁免$/, (_match, name) => english(name) + ' Saving Throw'],
    [/^(.+)法表$/, (_match, name) => english(name) + ' Spell List'],
    [/^(.+)扩表$/, (_match, name) => english(name) + ' Expanded Spell List'],
    [/^(.+)人像$/, (_match, name) => english(name) + ' portrait'],
    [/^(\d+(?:\.\d+)?)\s*(尺|磅)$/, (_match, amount, unit) => amount + (unit === '尺' ? ' ft.' : ' lb.')],
    [/^(\d+)\s*\/\s*(\d+)\s*尺$/, '$1 / $2 ft.'],
    [/^(\d+)\s*(动作|附赠动作|反应|轮|分钟|小时|天)$/, (_match, amount, unit) => amount + ' ' + english(unit) + (amount === '1' ? '' : 's')],
  ];
  let language = 'zh-CN';
  const requested = new URLSearchParams(window.location?.search).get('lang');
  try {
    if (localStorage.getItem(storageKey) === 'en') language = 'en';
  } catch {
    // The language switch works for the session even with storage disabled.
  }
  if (requested === 'en' || requested === 'zh-CN') language = requested;

  const own = key => Object.hasOwn(catalog, key) ? catalog[key] : undefined;
  const damageTypes = '强酸|寒冷|火焰|力场|闪电|暗蚀|毒素|心灵|光耀|雷鸣|钝击|穿刺|挥砍';
  const diceDamage = new RegExp('^(\\d+d\\d+(?:\\s*[+−-]\\s*\\d+)?)\\s*(' + damageTypes + ')$', 'u');
  const diceAtLevel = /^(\d+)\s*级\s*(\d+d\d+)$/u;
  const spellRoll = /^([+−-]?\d+(?:d\d+)?|d20\s*[+−-]\d+)（(力量|敏捷|体质|智力|感知|魅力)）$/u;
  const vocabulary = Object.keys(catalog).filter(key => key.length <= 9 && /^[\p{Script=Han}]{2,9}$/u.test(key)).sort((a, b) => b.length - a.length);
  const termPattern = new RegExp(vocabulary.join('|'), 'gu');

  function piece(text) {
    const key = text.trim();
    const damage = diceDamage.exec(key);
    if (damage) return text.replace(key, () => damage[1] + ' ' + own(damage[2]).toLowerCase() + ' damage');
    const scaling = diceAtLevel.exec(key);
    if (scaling) return text.replace(key, () => 'Level ' + scaling[1] + ': ' + scaling[2]);
    const roll = spellRoll.exec(key);
    if (roll) return text.replace(key, () => roll[1] + ' (' + own(roll[2]) + ')');
    let value = own(key);
    if (!value) {
      for (const [pattern, replacement] of templates) {
        if (pattern.test(key)) {value = key.replace(pattern, replacement); break;}
      }
    }
    if (value) return text.replace(key, () => value);
    if (!/[。！？；，]/u.test(key) && key.length < 110) {
      const compact = text.replace(termPattern, match => ' ' + own(match) + ' ');
      if (!han.test(compact)) return compact.replace(/\s{2,}/g, ' ');
    }
    return text;
  }

  function english(text) {
    if (!han.test(text)) return text;
    const single = piece(text);
    if (single !== text) return single;
    const updated = text
      .split(/(\s*·\s*|[、；\n]|\s*×\s*)/u)
      .map(part => {
        const translated = piece(part);
        if (translated !== part) return translated;
        if (part === '、') return ', ';
        if (part === '；') return '; ';
        const level = /^(\s*)(\d+(?:[–-]\d+)?)\s*级(\s*)$/u.exec(part);
        if (level) return level[1] + 'Level ' + level[2] + level[3];
        const ring = /^(\s*)(\d+)\s*环(\s*)$/u.exec(part);
        if (ring) return ring[1] + (ring[2] === '0' ? 'Cantrip' : 'Level ' + ring[2]) + ring[3];
        const stat = /^(\s*)([^\d]+?)\s*([+−-]?\d+(?:\s*\/\s*\d+)?)(\s*(?:尺|磅)?\s*)$/u.exec(part);
        if (stat && own(stat[2])) return stat[1] + own(stat[2]) + ' ' + stat[3] + (stat[4].includes('尺') ? ' ft.' : stat[4].includes('磅') ? ' lb.' : stat[4]);
        const distance = /^(\s*)(\d+)\s*(尺|磅)(\s*)$/u.exec(part);
        if (distance) return distance[1] + distance[2] + (distance[3] === '尺' ? ' ft.' : ' lb.') + distance[4];
        return part;
      }).join('');
    return updated.replace(/ {2,}/g, ' ');
  }

  function localize(container) {
    if (language !== 'en') return;
    const excluded = 'script, style, textarea, [data-user-text]';
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: node => han.test(node.data) && !node.parentElement?.closest(excluded) ?
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) node.data = english(node.data);
    const attributeSelector = attributes.map(name => '[' + name + ']').join(',');
    const elements = [...container.querySelectorAll(attributeSelector)];
    if (container.matches?.(attributeSelector)) elements.push(container);
    for (const element of elements) {
      for (const name of attributes) {
        const value = element.getAttribute(name);
        if (value && han.test(value)) element.setAttribute(name, english(value));
      }
    }
  }

  return {
    get language() {return language;},
    set(value) {
      if (!['zh-CN', 'en'].includes(value)) return;
      language = value;
      try {localStorage.setItem(storageKey, language);} catch {}
      if (requested && window.location) {
        const url = new URL(window.location.href);
        url.searchParams.delete('lang');
        try {window.history.replaceState(window.history.state, '', url);} catch {}
      }
    },
    text: value => language === 'en' ? english(String(value ?? '')) : value,
    english,
    localize,
  };
})();
