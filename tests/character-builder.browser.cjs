const {chromium} = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname, '..');
const playerPath = path.join(root, 'DND-2014-Character-Builder.html');
const playerUrl = pathToFileURL(playerPath).href;
const taskButton = (page, task) => page.locator(`[data-workbench-task="${task}"]`).first();
const goToTask = async (page, task) => {
  if (await taskButton(page, 'home').count()) await taskButton(page, 'home').click();
  await taskButton(page, task).click();
};

async function checkSharedLibrary(browser) {
  const context = await browser.newContext();
  try {
    const origin = 'https://dnd-workbench-test.example/';
    const key = 'dnd-2014-character-board/v2/player';
    await context.route(origin, route => route.fulfill({path: path.join(root, 'DND-2014-Character-Builder.html'), contentType: 'text/html'}));
    const first = await context.newPage();
    const second = await context.newPage();
    const library = page => page.locator('[data-action="library"]').click();
    const names = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)).characters.map(entry => entry.build.name), key);
    const rename = async (page, name) => {
      await page.locator('[data-rename-character]').fill(name);
      await page.locator('[data-action="rename-character"]').click();
      await page.waitForFunction(({key, name}) => JSON.parse(localStorage.getItem(key)).characters.some(entry => entry.build.name.startsWith(name)), {key, name});
    };
    await first.goto(origin);
    await second.goto(origin);
    await library(second);
    await library(first);
    await first.locator('[data-action="new-character"]').click();
    await first.waitForFunction(key => JSON.parse(localStorage.getItem(key)).characters.length === 2, key);
    await library(first);
    await rename(first, '第二张角色');
    await rename(second, '第一张角色');
    assert.deepEqual(await names(first), ['第一张角色', '第二张角色']);
    await first.reload();
    await library(first);
    await first.locator('[data-library-select]').selectOption({index: 0});
    await library(first);
    await library(second);
    await rename(first, '第一页编辑');
    await rename(second, '第二页编辑');
    assert.deepEqual(await names(first), ['第一页编辑', '第二张角色', '第二页编辑 · 编辑副本']);

    await first.evaluate(key => {
      const archive = JSON.parse(localStorage.getItem(key));
      archive.characters = Array.from({length: 201}, (_, index) => ({...archive.characters[0], id: 'older-record-' + index}));
      archive.activeId = archive.characters[0].id;
      localStorage.setItem(key, JSON.stringify(archive));
    }, key);
    await first.reload();
    await library(first);
    assert.equal(await first.locator('[data-library-select] option').count(), 201);
    assert.ok(await first.locator('[data-action="new-character"]').isDisabled());
    assert.ok(await first.locator('[data-action="copy-character"]').isDisabled());
  } finally {
    await context.close();
  }
}

async function checkCompactNavigation(browser) {
  const page = await browser.newPage({viewport: {width: 320, height: 568}, isMobile: true, hasTouch: true, reducedMotion: 'reduce'});
  try {
    await page.goto(playerUrl);
    await taskButton(page, 'ancestry').tap();
    const menu = page.locator('[data-action="task-menu"]');
    await page.evaluate(() => scrollTo(0, 0));
    await menu.tap();
    const links = page.locator('#workbench-task-links');
    assert.equal(await links.locator('[data-workbench-task]:visible').count(), 12);
    const menuRect = await links.boundingBox();
    assert.ok(menuRect.y >= 0 && menuRect.y + menuRect.height <= 568);
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');

    await page.locator('details[data-detail="languages"] summary').tap();
    await page.locator('[data-open-branch="languages.0"]').tap();
    await page.evaluate(() => scrollTo(0, 600));
    const scroll = await page.evaluate(() => scrollY);
    const dock = await page.locator('.workbench-nav').boundingBox();
    assert.ok(Math.abs(dock.y) <= 1 && dock.height < 60);
    await menu.press('Enter');
    assert.equal(await page.evaluate(() => scrollY), scroll);
    await links.locator('[data-workbench-task="job"]').tap();
    await page.goBack();
    assert.match(await page.locator('#branch-title').innerText(), /额外语言/);
    assert.equal(await page.evaluate(() => scrollY), scroll);
    await page.locator('[data-action="full-stats"]').tap();
    assert.equal(await page.locator('#workbench-dialog .compact-scores strong').count(), 6);
    await page.getByRole('button', {name:'关闭窗口'}).tap();

    await page.locator('[data-action="library"]').tap();
    const closeVisible = await page.locator('#workbench-dialog').evaluate(dialog => {
      dialog.scrollTop = dialog.scrollHeight;
      const bounds = dialog.getBoundingClientRect();
      const close = dialog.querySelector('[aria-label="关闭窗口"]').getBoundingClientRect();
      return close.top >= bounds.top && close.bottom <= bounds.bottom;
    });
    assert.ok(closeVisible);
    await page.getByRole('button', {name:'关闭窗口'}).tap();
    await goToTask(page, 'sheet');
    await page.locator('[data-sheet-jump="sheet-gear"]').tap();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'sheet-gear');
    await goToTask(page, 'tree');
    await page.locator('[data-tree-scroll="1"]').tap();
    assert.ok(await page.locator('#full-tree-map').evaluate(map => map.scrollLeft > 0));
    await menu.tap();
    await links.locator('[data-workbench-task="shortcuts"]').tap();
    assert.equal(await page.locator('#task-title').innerText(), '快捷键');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
  } finally {
    await page.close();
  }
}

async function checkShortcuts(browser) {
  const page = await browser.newPage({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
  try {
    await page.goto(playerUrl + '?lang=en');
    await taskButton(page, 'shortcuts').click();
    const shortcuts = page.locator('[data-active-task="shortcuts"]');
    assert.equal(await shortcuts.locator('#task-title').innerText(), 'Shortcuts');
    assert.doesNotMatch(await shortcuts.innerText(), /\p{Script=Han}/u);
    await goToTask(page, 'ancestry');
    const branch = page.locator('#branch-panel');
    const search = branch.locator('[data-branch-search]');
    await page.keyboard.press('/');
    assert.ok(await search.evaluate(input => document.activeElement === input));
    await page.keyboard.press('?');
    assert.equal(await search.inputValue(), '?');
    assert.equal(await shortcuts.count(), 0);
    await search.fill('');

    const selectedAncestry = () => branch.locator('[data-selected] [data-branch-choice]').getAttribute('data-branch-choice');
    await branch.locator('[data-branch-choice="woodElf"]').click({modifiers:['Shift']});
    assert.equal(await selectedAncestry(), 'woodElf');
    assert.equal(await branch.locator('#branch-inspector:visible').count(), 0);
    await page.keyboard.press('Control+z');
    assert.equal(await selectedAncestry(), 'human');
    await branch.locator('[data-branch-choice="highElf"]').dblclick();
    assert.equal(await selectedAncestry(), 'highElf');

    await goToTask(page, 'job');
    await page.locator('[data-open-branch="jobSkills"]').click();
    const skill = branch.locator('[data-branch-choice="洞悉"]');
    assert.equal(await skill.locator('..').getAttribute('data-selected'), '');
    await skill.click({modifiers:['Shift']});
    assert.equal(await skill.locator('..').getAttribute('data-selected'), null);
    await skill.click({modifiers:['Shift']});
    assert.equal(await skill.locator('..').getAttribute('data-selected'), '');

    await goToTask(page, 'treeLevel');
    const node = rank => page.locator(`[data-growth-node][data-level-pick="${rank}"]`);
    await node(1).press('ArrowRight');
    assert.ok(await node(2).evaluate(button => document.activeElement === button));
    assert.equal(await page.locator('[data-preview-level]').inputValue(), '1');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-preview-level]').inputValue(), '2');
    assert.match(await page.locator('.preview-level').innerText(), /Actual: Level 1/);

    await goToTask(page, 'armor');
    await page.locator('[data-action="equipment-shop"]').click();
    await page.keyboard.press('/');
    assert.ok(await page.locator('[data-shop-search]').evaluate(input => document.activeElement === input));
    await page.keyboard.press('Escape');
    await page.keyboard.press('?');
    assert.ok(await shortcuts.isVisible());
    await shortcuts.locator('[data-single-key-shortcuts]').uncheck();
    await page.reload();
    await page.keyboard.press('?');
    assert.equal(await shortcuts.count(), 0);
    await taskButton(page, 'shortcuts').click();
    assert.equal(await shortcuts.locator('[data-single-key-shortcuts]').isChecked(), false);
  } finally {
    await page.close();
  }
}

async function checkActualLevelChecklist(browser) {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  try {
    await page.goto(playerUrl + '?lang=zh-CN');
    const checklist = page.locator('.guide-checklist');
    const previewLevel = page.locator('[data-preview-level]');
    const home = () => taskButton(page, 'home').click();
    assert.match(await checklist.innerText(), /已完成/);

    await goToTask(page, 'treeLevel');
    await previewLevel.selectOption('5');
    await home();
    assert.match(await checklist.innerText(), /实际 1 级[\s\S]*已完成/);
    assert.equal(await checklist.locator('[data-task], [data-issue]').count(), 0);
    await page.reload();
    assert.match(await checklist.innerText(), /实际 1 级[\s\S]*已完成/);
    await goToTask(page, 'treeLevel');
    assert.equal(await previewLevel.inputValue(), '5');
    await page.locator('[data-growth-node][data-level-pick="3"]').click();
    assert.ok(await page.locator('#level-detail [data-open-branch="plan.subclassName"]').isVisible());

    await previewLevel.selectOption('5');
    await page.locator('[data-action="confirm-level"]').click();
    await previewLevel.selectOption('1');
    await home();
    assert.match(await checklist.innerText(), /实际 5 级/);
    await checklist.locator('[data-task="job"]').click();
    assert.ok(await page.locator('#branch-panel [data-branch-choice="战斗大师"]').isVisible());
    assert.equal(await page.locator('.preview-level').count(), 0);

    await goToTask(page, 'treeLevel');
    await previewLevel.selectOption('1');
    await page.locator('[data-action="confirm-level"]').click();
    await goToTask(page, 'job');
    await page.locator('[data-branch-choice="wizard"]').press('Enter');
    await goToTask(page, 'treeLevel');
    await previewLevel.selectOption('5');
    await home();
    await checklist.locator('summary', {hasText:'查看全部待办'}).click();
    assert.match(await checklist.innerText(), /1 级戏法应为/);
    assert.doesNotMatch(await checklist.innerText(), /[2-5] 级(?:戏法应为|法术书应新增)/);
    await checklist.getByRole('button', {name:/尚未准备法术/}).click();
    assert.ok(await page.locator('[data-active-task="spells"] #branch-panel').isVisible());
    assert.match(await page.locator('#branch-title').innerText(), /准备法术/);
    assert.equal(await page.locator('.preview-level').count(), 0);
  } finally {
    await page.close();
  }
}

async function checkPurposeFilters(browser) {
  for (const [lang, width] of [['zh-CN', 320], ['en', 320], ['zh-CN', 390], ['en', 390], ['en', 1440], ['zh-CN', 1440]]) {
    const page = await browser.newPage({viewport: {width, height: 844}, reducedMotion: 'reduce'});
    try {
      await page.context().setOffline(true);
      await page.goto(playerUrl + '?lang=' + lang);
      const en = lang === 'en';
      const panel = page.locator('#branch-panel');
      const tag = (scope, key) => scope.locator(`[data-purpose-tag="${key}"]`);
      const card = id => panel.locator(`[data-branch-choice="${id}"]`);
      const close = () => page.locator('#workbench-dialog .dialog-heading button').click();
      const save = () => page.evaluate(() => localStorage.getItem('dnd-2014-character-board/v2/player'));
      const original = await save();
      await goToTask(page, 'ancestry');
      assert.match(await card('highElf').innerText(), en ? /wizard cantrip/i : /法师戏法/);
      assert.match(await card('woodElf').innerText(), en ? /lightly obscured|difficult to spot|hide/i : /躲藏/);
      await tag(panel, 'stealth').press('Space');
      assert.equal(await tag(panel, 'stealth').getAttribute('aria-pressed'), 'true');
      assert.equal(await card('highElf').isVisible(), false);
      assert.ok(await card('woodElf').isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await save(), original);
      await goToTask(page, 'job');
      assert.equal(await panel.locator('.purpose-buttons [data-purpose-clear]').getAttribute('aria-pressed'), 'true');
      await goToTask(page, 'ancestry');
      assert.equal(await tag(panel, 'stealth').getAttribute('aria-pressed'), 'true');

      if (width !== 1440 || en) continue;
      await goToTask(page, 'armor');
      const combat = page.locator('.live-strip');
      const before = await combat.innerText();
      await page.locator('[data-action="equipment-shop"]').click();
      let modal = page.locator('#workbench-dialog');
      await tag(modal, 'defense').click();
      await modal.locator('[data-shop-search]').fill('padded');
      await modal.locator('[data-shop-rule="padded"]').click();
      assert.match(await modal.locator('.preview-impact').innerText(), /到背包装备后才会计入角色数值/);
      await modal.getByRole('button', {name:'返回装备商店'}).click();
      assert.equal(await tag(modal, 'defense').getAttribute('aria-pressed'), 'true');
      assert.equal(await modal.locator('[data-shop-search]').inputValue(), 'padded');
      await modal.locator('[data-buy-item="padded"]').click();
      await close();
      assert.equal(await combat.innerText(), before);
      const backpack = page.locator('[data-equipment-purpose-list="backpack"]');
      await tag(backpack, 'defense').click();
      await backpack.locator('[data-inventory-rule="padded"]').click();
      assert.match(await modal.locator('.preview-impact').innerText(), /AC 19 → 16/);
      await close();
      await backpack.locator('[data-equip-item="padded"]').click();
      assert.match(await combat.innerText(), /AC\s*16/);

      await goToTask(page, 'job');
      await card('cleric').press('Enter');
      await goToTask(page, 'treeLevel');
      await page.locator('[data-preview-level]').selectOption('17');
      await goToTask(page, 'spells');
      if (!await card('heal').count()) await page.locator('[data-open-branch="preparations"]').click();
      await tag(panel, 'healing').click();
      assert.ok(await card('healing-word').isVisible());
      await tag(panel, 'support').click();
      assert.equal(await card('healing-word').isVisible(), false);
      assert.ok(await card('heal').isVisible());
      await panel.locator('[data-branch-ring]').selectOption('6');
      assert.ok(await card('heal').isVisible());
      assert.equal(await card('mass-heal').isVisible(), false);
      await panel.locator('[data-source-filter] summary').click();
      await panel.locator('[data-branch-source][value="玩家手册 2014"]').check();
      await panel.locator('[data-source-filter] summary').click();
      assert.ok(await card('heal').isVisible());
      const search = panel.locator('[data-branch-search]');
      await search.fill('Blade Barrier');
      assert.ok(await panel.locator('[data-purpose-empty]').isVisible());
      await panel.locator('[data-purpose-empty] [data-purpose-clear]').press('Enter');
      assert.equal(await search.inputValue(), 'Blade Barrier');
      assert.equal(await panel.locator('[data-branch-ring]').inputValue(), '6');
      assert.ok(await panel.locator('[data-branch-source][value="玩家手册 2014"]').isChecked());
      assert.ok(await card('blade-barrier').isVisible());
      await search.fill('Heal');
      const beforePreview = await save();
      await card('heal').click();
      const inspector = page.locator('#branch-inspector');
      await inspector.locator('#inspector-heading').waitFor();
      assert.match(await inspector.locator('[data-preview-spell-values]').innerText(), /70 HP/);
      await inspector.locator('[data-preview-spell-ring]').selectOption('7');
      assert.match(await inspector.locator('[data-preview-spell-values]').innerText(), /80 HP/);
      assert.equal(await save(), beforePreview);
    } finally {
      await page.close();
    }
  }
}

async function checkEnglishWorkbench(browser) {
  const page = await browser.newPage({viewport: {width: 320, height: 844}});
  try {
    await page.context().setOffline(true);
    await page.goto(playerUrl);
    const settings = page.locator('[data-action="library"]');
    const language = page.locator('[data-workbench-language]');
    const save = () => page.evaluate(() => localStorage.getItem('dnd-2014-character-board/v2/player'));
    const original = await save();
    assert.equal(await settings.innerText(), '设置');
    await settings.click();
    await language.selectOption('en');
    assert.equal(await page.locator('#dialog-title').innerText(), 'Settings');
    assert.equal(await save(), original);
    await page.getByRole('button', {name: 'Close dialog'}).click();
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('#task-title').innerText(), 'Build Tasks');
    await goToTask(page, 'background');
    await page.locator('[data-branch-search]').fill('Investigator');
    await page.locator('[data-branch-choice="调查员"]').click();
    await page.locator('[data-open-rule="调查员"]').click();
    assert.match(await page.locator('.rule-cover').innerText(), /Investigator/);
    assert.match(await page.locator('.rule-sheet').innerText(), /Official Inquiry[\s\S]*official paperwork/);
    await page.getByRole('button', {name: 'Close dialog'}).click();
    await goToTask(page, 'job');
    await page.locator('[data-branch-choice="fighter"]').click();
    await page.locator('[data-open-rule="fighter"]').click();
    assert.match(await page.locator('.rule-sheet').innerText(), /Second Wind[\s\S]*bonus action[\s\S]*1d10 \+ your fighter level in hit points/);
    await page.getByRole('button', {name: 'Close dialog'}).click();
    await page.locator('[data-branch-search]').fill('Wizard');
    assert.equal(await page.locator('.branch-card:visible .branch-label strong').innerText(), 'Wizard');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    await settings.click();
    await language.selectOption('zh-CN');
    assert.equal(await page.locator('#dialog-title').innerText(), '设置');
    await page.getByRole('button', {name: '关闭窗口'}).click();
    assert.equal(await page.locator('#task-title').innerText(), '职业');
    assert.equal(await save(), original);
    await settings.click();
    await language.selectOption('en');
    await page.getByRole('button', {name: 'Close dialog'}).click();
    await page.locator('[data-branch-choice="wizard"]').press('Enter');
    await goToTask(page, 'spells');
    await page.locator('[data-open-branch="plan.spellsAdded"]').click();
    await page.locator('[data-branch-choice="fire-bolt"]').click();
    await page.locator('[data-open-rule="fire-bolt"]').click();
    assert.match(await page.locator('.rule-cover').innerText(), /ranged spell attack for 1d10 fire damage/);
    assert.match(await page.locator('.rule-card-dialog [data-spell-cast-ring="0"]').innerText(), /1d10 fire damage[\s\S]*Spell Attack Roll/);
  } finally {
    await page.close();
  }
}

async function checkStarterGuide(browser) {
  for (const [lang, width] of [['en', 320], ['zh-CN', 1440]]) {
    const page = await browser.newPage({viewport: {width, height: 844}, reducedMotion: 'reduce'});
    try {
      await page.context().setOffline(true);
      await page.goto(playerUrl + '?lang=' + lang);
      const en = lang === 'en';
      const guide = page.locator('.task-home-heading [data-workbench-task="starter"]');
      const save = () => page.evaluate(() => localStorage.getItem('dnd-2014-character-board/v2/player'));
      const original = await save();
      const lesson = page.locator('.starter-lesson');
      const heading = page.locator('#starter-lesson-title');
      const activeStep = page.locator('.starter-index [aria-current="step"]');
      assert.equal(await guide.innerText(), en ? 'Starter Guide' : '新手指南');
      await guide.press('Enter');
      assert.equal(await page.locator('#task-title').innerText(), en ? 'Starter Guide' : '新手指南');
      assert.equal(await lesson.locator('.starter-progress').innerText(), en ? 'Step 1 of 8' : '第 1 / 8 步');
      assert.match(await lesson.innerText(), en ? /level 1 human fighter/ : /1 级人类战士/);
      await lesson.getByRole('button', {name: en ? 'Next' : '下一步', exact: true}).press('Enter');
      assert.equal(await activeStep.getAttribute('data-starter-index'), '1');
      assert.equal(await heading.evaluate(el => el === document.activeElement), true);
      await lesson.getByRole('button', {name: en ? 'Previous' : '上一步', exact: true}).click();
      assert.equal(await activeStep.getAttribute('data-starter-index'), '0');
      for (const [index, task, selector] of [
        [1, 'ancestry', '#branch-panel'], [1, 'job', '#branch-panel'],
        [2, 'scores', '#point-buy'], [2, 'background', '#branch-panel'],
        [3, 'armor', '#equipment-backpack-title'], [4, 'spells', '.task-empty'],
        [5, 'treeLevel', '#growth-map'], [6, 'sheet', '.overview-heading'],
      ]) {
        await page.locator(`[data-starter-index="${index}"]`).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        if (en) assert.doesNotMatch(await lesson.innerText(), /\p{Script=Han}/u);
        await lesson.locator(`[data-workbench-task="${task}"]`).click();
        await page.locator(`[data-active-task="${task}"] ${selector}`).waitFor({state:'visible'});
        await page.goBack();
        assert.equal(await activeStep.getAttribute('data-starter-index'), String(index));
      }
      await page.locator('[data-starter-index="7"]').click();
      await lesson.getByRole('button', {name: en ? 'Open Settings' : '打开设置'}).click();
      assert.equal(await page.locator('#dialog-title').innerText(), en ? 'Settings' : '设置');
      await page.getByRole('button', {name: en ? 'Close dialog' : '关闭窗口'}).click();
      await lesson.getByRole('button', {name: en ? 'Finish Guide' : '完成指南'}).click();
      assert.ok(await guide.isVisible());
      assert.equal(await save(), original);
    } finally {
      await page.close();
    }
  }
}

async function checkPageGuide(browser) {
  for (const [lang, width] of [['en', 320], ['zh-CN', 1440]]) {
    const page = await browser.newPage({viewport: {width, height: 844}, reducedMotion: 'reduce'});
    try {
      await page.context().setOffline(true);
      await page.goto(playerUrl + '?lang=' + lang);
      const en = lang === 'en';
      const save = () => page.evaluate(() => localStorage.getItem('dnd-2014-character-board/v2/player'));
      await page.locator('[data-action="edit-name"]').click();
      await page.locator('[data-form="character-name"] input').fill('Existing Character');
      await page.locator('[data-form="character-name"] input').press('Enter');
      await page.waitForFunction(() =>
        JSON.parse(localStorage.getItem('dnd-2014-character-board/v2/player')).characters[0].build.name === 'Existing Character');
      const original = await save();
      await page.locator('.task-home-heading [data-workbench-task="starter"]').click();
      await page.locator('[data-action="page-guide-start"]').press('Enter');
      const panel = page.locator('[data-page-guide]');
      const target = page.locator('[data-page-guide-target]');
      const next = panel.locator('[data-action="page-guide-next"]');
      const previous = panel.locator('[data-action="page-guide-prev"]');
      assert.equal(await page.locator('h1').innerText(), 'Existing Character');
      assert.equal(await panel.locator('.starter-progress').innerText(), en ? 'Step 1 of 10' : '第 1 / 10 步');
      assert.equal(await target.getAttribute('data-action'), 'edit-name');
      await next.press('Enter');
      await target.waitFor({state: 'visible'});
      assert.equal(await target.getAttribute('data-branch-choice'), 'human');
      await previous.click();
      assert.equal(await panel.locator('.starter-progress').innerText(), en ? 'Step 1 of 10' : '第 1 / 10 步');
      for (const selector of [
        '[data-branch-choice="human"]', '[data-open-branch="jobSkills"]', '[data-score-input="0"]',
        '[data-branch-choice="士兵"]', '[data-equipment-jump="equipment-backpack-title"]',
        '.task-empty', '[data-preview-level]', '.sheet-jumps', '[data-action="library"]',
      ]) {
        await next.click();
        await page.locator(selector + '[data-page-guide-target]').waitFor({state: 'visible'});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        if (en) assert.doesNotMatch(await panel.innerText(), /\p{Script=Han}/u);
      }
      await target.click();
      assert.equal(await page.locator('#dialog-title').innerText(), en ? 'Settings' : '设置');
      await page.locator('#workbench-dialog [data-action="export"][data-page-guide-target]').waitFor({state: 'visible'});
      assert.ok(await page.locator('[data-library-select]').isVisible());
      await page.getByRole('button', {name: en ? 'Close dialog' : '关闭窗口'}).click();
      await next.click();
      assert.equal(await panel.count(), 0);
      assert.ok(await page.locator('[data-active-task="starter"]').isVisible());
      assert.equal(await save(), original);

      await page.locator('[data-action="page-guide-start"]').click();
      await target.click();
      await page.locator('[data-form="character-name"] input[data-page-guide-target]').fill('Edited in Guide');
      await page.locator('[data-form="character-name"] input').press('Enter');
      await panel.locator('[data-action="page-guide-close"]').click();
      assert.equal(await target.count(), 0);
      assert.equal(await panel.count(), 0);
      await page.reload();
      assert.equal(await page.locator('h1').innerText(), 'Edited in Guide');
    } finally {
      await page.close();
    }
  }
}

(async () => {
  const browser = await chromium.launch({channel: 'chrome'});
  try {
    for (const width of [320, 390, 768, 1440]) {
      const mobile = width < 650;
      const height = mobile ? 844 : 1000;
      const page = await browser.newPage({viewport: {width, height}, hasTouch: mobile, isMobile: mobile, colorScheme:'dark'});
      const errors = [];
      page.setDefaultTimeout(9000);
      page.on('pageerror', error => errors.push(error.message));
      await page.route(/^https?:/, route => route.abort());
      await page.goto(playerUrl);
      const selectedJob = () => page.evaluate(() => JSON.parse(localStorage.getItem('dnd-2014-character-board/v2/player')).characters[0].build.job);
      const waitForSavedJob = job => page.waitForFunction(job =>
        JSON.parse(localStorage.getItem('dnd-2014-character-board/v2/player')).characters[0].build.job === job, job);
      assert.equal(await selectedJob(), 'fighter');
      assert.match(await page.locator('.starter-intro').innerText(), /人类战士示例/);
      assert.match(await taskButton(page, 'background').innerText(), /士兵/);
      assert.equal(await page.locator('.guide-checklist p').innerText(), '已完成');
      assert.equal(await page.locator('.branch-option:visible').count(), 0);
      assert.equal(await page.locator('[data-active-task]').count(), 0);
      assert.equal(await page.locator('.compact-scores strong').count(), 6);
      assert.equal(await page.locator('.live-strip strong').count(), 8);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), 'light');
      assert.equal(await page.locator('.sticky-board').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(247, 239, 224)');
      const tasks = ['ancestry', 'job', 'scores', 'background', 'armor', 'spells', 'treeLevel'];
      for (const selector of ['.sticky-board', ...tasks.map(task => `[data-workbench-task="${task}"]`)]) {
        const rect = await page.locator(selector).boundingBox();
        assert.ok(rect.y + rect.height <= height, selector + ' appears on the first screen');
      }
      const editors = {ancestry:'[data-branch-choice="human"]', job:'[data-branch-choice="fighter"]',
        scores:'[data-score-mode="buy"]', background:'#branch-panel', armor:'[data-equipment-mode="pack"]',
        spells:'.task-empty', treeLevel:'#level-detail'};
      for (const [task, selector] of Object.entries(editors)) {
        await taskButton(page, task).press('Enter');
        assert.ok(await page.locator(`[data-active-task="${task}"] ${selector}`).isVisible(), task);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, task);
        assert.equal(await page.locator('#task-title').evaluate(element => element === document.activeElement), true);
        await taskButton(page, 'home').press('Enter');
        assert.equal(await taskButton(page, task).evaluate(element => element === document.activeElement), true);
      }
      await taskButton(page, 'ancestry').click();
      if (width === 1440) {
        await page.evaluate(() => scrollTo(0, 650));
        const dock = await page.locator('.workbench-nav').boundingBox();
        const stats = await page.locator('.sticky-board').boundingBox();
        assert.ok(Math.abs(dock.y) <= 1 && dock.height < 60);
        assert.ok(stats.y + stats.height < 0, 'The full stats scroll out of view on desktop');
        await page.locator('.workbench-nav [data-action="full-stats"]').click();
        assert.equal(await page.locator('.stats-dialog .compact-scores strong').count(), 6);
        await page.keyboard.press('Escape');
        await page.evaluate(() => scrollTo(0, 0));
      }
      if (width <= 800) await page.locator('[data-action="task-menu"]').click();
      await page.locator('.workbench-nav [data-workbench-task="job"]').click();
      await page.goBack();
      assert.ok(await page.locator('[data-active-task="ancestry"]').isVisible());
      await page.goBack();
      assert.ok(await page.locator('.task-home').isVisible());
      await page.goForward();
      assert.ok(await page.locator('[data-active-task="ancestry"]').isVisible());
      await taskButton(page, 'home').click();
      await taskButton(page, 'sheet').click();
      assert.ok(await page.locator('#sheet-skills').isVisible());
      assert.ok(await page.locator('#sheet-gear').isVisible());
      assert.ok(await page.locator('#sheet-abilities').isVisible());
      await goToTask(page, 'ancestry');
      await page.locator('[data-branch-choice="highElf"]').press('Enter');
      await taskButton(page, 'home').click();
      await page.getByText('查看全部待办', {exact:true}).click();
      await page.getByRole('button', {name:/待选种族语言/}).click();
      assert.match(await page.locator('#branch-title').innerText(), /额外语言/);
      await page.locator('[data-action="undo"]').click();
      await goToTask(page, 'job');
      await page.locator('[data-branch-choice="rogue"]').press('Enter');
      await goToTask(page, 'job');
      assert.equal(await page.locator('.branch-option .option-art').count(), await page.locator('.branch-option').count());
      assert.equal(await page.locator('#branch-inspector:visible').count(), 0);
      const fighter = page.locator('[data-branch-choice="fighter"]');
      if (width <= 768) {
        if (mobile) await fighter.tap();
        else await fighter.click();
        assert.equal(await page.locator('.branch-card[data-previewing] + #branch-inspector').count(), 1);
      } else {
        await fighter.click();
        await page.locator('#branch-inspector').waitFor();
        const list = await page.locator('.branch-list').boundingBox();
        const preview = await page.locator('#branch-inspector').boundingBox();
        assert.ok(preview.x >= list.x + list.width);
      }
      await page.locator('[data-open-rule="fighter"]').click();
      assert.match(await page.locator('.rule-card-dialog').innerText(), /逐级职业能力/);
      assert.match(await page.locator('.rule-card-dialog').innerText(), /起始装备路线/);
      assert.equal(await selectedJob(), 'rogue', 'reading a rule card does not choose the option');
      if (width === 390) {
        const download = page.waitForEvent('download');
        await page.locator('[data-rule-export]').click();
        const file = await download;
        const html = fs.readFileSync(await file.path(), 'utf8');
        assert.match(html, /逐级职业能力/);
        assert.match(html, /<img .*data:image\/webp;base64,/);
        assert.doesNotMatch(html, /<script|character-seed/);
        await page.locator('[data-rule-embed]').click();
        const code = await page.locator('[data-rule-embed-code]').inputValue();
        const host = await browser.newPage({viewport: {width: 390, height: 800}});
        await host.route(/^https?:/, route => route.abort());
        await host.setContent(code);
        assert.equal(await host.frameLocator('iframe').locator('h1').innerText(), '战士');
        await host.close();
      }
      await page.locator('#workbench-dialog .dialog-heading button').click();
      await page.locator('[data-action="close-preview"]').press('Escape');
      assert.equal(await page.locator('#branch-inspector:visible').count(), 0);
      assert.equal(await fighter.evaluate(el => el === document.activeElement), true);
      await fighter.click();
      assert.equal(await selectedJob(), 'rogue', 'preview leaves stored character unchanged');
      await page.locator('[data-apply-choice="fighter"]').click();
      await waitForSavedJob('fighter');
      await goToTask(page, 'ancestry');
      await page.locator('[data-branch-choice="changeling"]').click();
      await page.locator('[data-open-rule="changeling"]').click();
      const expanded = page.locator('.rule-card-dialog');
      assert.match(await expanded.innerText(), /保持中型/);
      const image = expanded.locator('img.option-art');
      await image.evaluate(img => img.decode());
      assert.ok(await image.evaluate(img => img.naturalWidth >= 100 && img.getBoundingClientRect().width <= 90));
      await page.locator('#workbench-dialog .dialog-heading button').click();
      await page.locator('[data-action="undo"]').click();
      await waitForSavedJob('rogue');
      await goToTask(page, 'treeLevel');
      await page.locator('[data-preview-level]').selectOption('3');
      assert.match(await page.locator('.preview-level').innerText(), /实际 1/);
      await page.locator('[data-action="confirm-level"]').click();
      assert.equal(await page.locator('.preview-level').count(), 0);
      await goToTask(page, 'tree');
      await page.locator('[data-tree-category="job"]').click();
      assert.ok(await page.locator('[data-choice-tree] [data-branch-choice="fighter"]').isVisible());
      await page.reload();
      assert.equal(await page.locator('.task-tiles button').count(), 7);
      assert.match(await taskButton(page, 'treeLevel').innerText(), /实际 3 级/);
      await page.locator('[data-action="library"]').click();
      await page.locator('[data-action="copy-character"]').click();
      await page.locator('[data-action="library"]').click();
      assert.equal(await page.locator('[data-library-select] option').count(), 2);
      await page.locator('[data-rename-character]').fill('浏览器检查角色');
      await page.locator('[data-action="rename-character"]').click();
      await page.locator('[data-action="library"]').click();
      const download = page.waitForEvent('download');
      await page.locator('[data-action="export-character"]').click();
      const file = await download;
      await page.locator('#workbench-dialog .dialog-heading button').click();
      await page.locator('[data-archive-import]').setInputFiles(await file.path());
      await page.getByText('已导入 1 个角色，原角色已保留。', {exact: true}).waitFor();
      await page.locator('[data-action="library"]').click();
      assert.equal(await page.locator('[data-library-select] option').count(), 3);
      await page.locator('#workbench-dialog .dialog-heading button').click();
      await page.locator('[data-archive-import]').setInputFiles({name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{bad')});
      await page.locator('#workbench-dialog').waitFor();
      assert.match(await page.locator('#workbench-dialog').innerText(), /导入失败/);
      await page.locator('#workbench-dialog .dialog-heading button').click();
      await page.locator('[data-action="library"]').click();
      assert.equal(await page.locator('[data-library-select] option').count(), 3);
      await page.locator('#workbench-dialog .dialog-heading button').click();
      if (width === 390) {
        await page.locator('[data-action="library"]').click();
        await page.locator('[data-action="new-character"]').click();
        await page.locator('.starter-intro').waitFor();
        assert.match(await taskButton(page, 'job').innerText(), /战士/);
        assert.match(await taskButton(page, 'treeLevel').innerText(), /实际 1 级/);
        assert.equal(await page.locator('.guide-checklist p').innerText(), '已完成');
        await page.locator('[data-action="library"]').click();
        const roster = page.locator('[data-library-select]');
        assert.equal(await roster.locator('option').count(), 4);
        await roster.selectOption({index: 0});
        assert.match(await taskButton(page, 'treeLevel').innerText(), /实际 3 级/);
        await page.locator('[data-action="library"]').click();
        await page.locator('#workbench-dialog [data-action="new-blank"]').click();
        await page.locator('[data-active-task="ancestry"]').waitFor();
        assert.match(await page.locator('.branch-entry').first().innerText(), /请选择/);
        await page.locator('[data-branch-choice="human"]').press('Enter');
        await page.getByRole('button', {name:'下一步 · 选职业'}).click();
        assert.ok(await page.locator('[data-branch-choice="fighter"]').isVisible());
        await taskButton(page, 'home').click();
        assert.match(await taskButton(page, 'job').innerText(), /待选职业/);
        assert.match(await taskButton(page, 'scores').innerText(), /剩余 27 点/);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
      assert.deepEqual(errors, []);
      await page.close();
      console.log('Passed offline interaction, archives and layout at', width, 'px');
    }

    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const privateFixtureUrl = 'https://dnd-builder-test.example/private-fixture';
    const fixtureName = '测试用旅人';
    const fixtureSeed = {private: true, name: fixtureName, ancestry: 'changeling', job: 'bard', background: 'acolyte'};
    const fixtureHtml = fs.readFileSync(playerPath, 'utf8').replace(
      'id="character-seed">{}', 'id="character-seed">' + JSON.stringify(fixtureSeed)
    );
    await page.route(privateFixtureUrl, route => route.fulfill({body: fixtureHtml, contentType: 'text/html; charset=utf-8'}));
    await page.goto(privateFixtureUrl);
    assert.equal(await page.locator('[data-character-name]').innerText(), fixtureName);
    await page.locator('[data-action="library"]').click();
    await page.locator('[data-action="export"]').click();
    const summary = await page.locator('[data-share-preview]').innerText();
    assert.ok(!summary.includes('幻身灵') && !summary.includes('变形生物'));
    await page.locator('#workbench-dialog .dialog-heading button').click();
    await page.locator('[data-action="ask-delete"]').count();
    await page.goto(playerUrl);
    await goToTask(page, 'job');
    await page.locator('[data-branch-choice="wizard"]').click();
    await page.locator('[data-apply-choice="wizard"]').click();
    await page.locator('.sticky-board [data-action="levels"]').click();
    await page.locator('[data-level-cap]').selectOption('6');
    assert.equal(await page.locator('[data-growth-node]').count(), 6);
    assert.ok(await page.locator('#level-detail').isVisible());
    await page.locator('[data-action="spell-slots"]').click();
    await page.locator('#workbench-dialog [data-spell-jump="plan.spellsAdded"]').click();
    assert.ok(await page.locator('[data-active-task="spells"] #branch-panel').isVisible());
    const search = page.locator('[data-branch-search]');
    const ringFilter = page.locator('[data-branch-ring]');
    assert.equal(await ringFilter.inputValue(), 'all');
    assert.ok(await page.locator('[data-branch-choice="fire-bolt"]').isVisible());
    await search.fill('Magic Missile');
    assert.match(await page.locator('[data-branch-choice="magic-missile"]').innerText(), /1 环/);
    assert.equal(await page.locator('[data-branch-choice="fire-bolt"]').isVisible(), false);
    await ringFilter.selectOption('0');
    assert.ok(await page.locator('[data-search-empty]').isVisible());
    await ringFilter.selectOption('all');
    await page.locator('[data-branch-choice="magic-missile"]').click();
    await page.locator('#branch-inspector').waitFor();
    assert.match(await page.locator('#branch-inspector').innerText(), /魔法飞弹/);
    const resolution = page.locator('#branch-inspector [data-spell-resolution="magic-missile"]');
    await resolution.locator('summary').click();
    assert.match(await resolution.innerText(), /自动命中/);
    await page.locator('[data-open-rule="magic-missile"]').click();
    assert.match(await page.locator('.rule-card-dialog').innerText(), /每枚.*1d4 \+ 1/);
    await page.locator('.rule-card-dialog [data-apply-choice="magic-missile"]').click();
    assert.equal(await page.locator('.rule-card-dialog').count(), 0);
    await search.fill('');
    await page.locator('[data-branch-choice="fire-bolt"]').click();
    await page.locator('[data-apply-choice="fire-bolt"]').click();
    await page.locator('.sticky-board [data-action="levels"]').click();
    await page.locator('[data-level-cap]').selectOption('7');
    await page.locator('[data-preview-level]').selectOption('5');
    await page.locator('[data-spell-jump="plan.spellsAdded"]').click();
    await page.locator('[data-branch-choice="fireball"]').press('Enter');
    await page.locator('.sticky-board [data-action="levels"]').click();
    await page.locator('[data-preview-level]').selectOption('7');
    await page.locator('[data-spell-jump="preparations"]').click();
    await page.locator('[data-branch-choice="fireball"]').press('Enter');
    await page.locator('[data-active-task="spells"] [data-action="spell-slots"]').click();
    const modal = page.locator('#workbench-dialog');
    const spellRing = rank => modal.locator(`[data-slot-ring="${rank}"] > summary`);
    await spellRing(0).click();
    await modal.locator('[data-spell-resolution="fire-bolt"] > summary').click();
    assert.match(await modal.locator('[data-spell-resolution="fire-bolt"] [data-spell-cast-ring="0"]').innerText(), /2d10 火焰/);
    await spellRing(0).click();
    await spellRing(1).click();
    await spellRing(3).click();
    await spellRing(4).click();
    const fourthSlot = modal.locator('[data-slot-drop="4:0"]');
    await modal.locator('[data-drag-slot-spell="fireball"]').dragTo(fourthSlot, {targetPosition:{x:10,y:10}});
    await fourthSlot.locator('[data-spell-cast-ring="4"]').waitFor({timeout:5000});
    assert.match(await fourthSlot.innerText(), /9d6 火焰[\s\S]*法术豁免 DC/);
    await modal.getByRole('button', {name:'关闭窗口'}).click();
    await goToTask(page, 'job');
    await page.locator('[data-branch-choice="fighter"]').click();
    await page.locator('[data-apply-choice="fighter"]').click();
    await goToTask(page, 'treeLevel');
    await page.locator('[data-preview-level]').selectOption('3');
    await page.getByRole('heading', {name: '3 级新增与选择', exact: true}).waitFor();
    await page.locator('[data-open-branch="plan.subclassName"]').click();
    assert.doesNotMatch(await page.locator('#branch-panel .branch-grid').innerText(), /https?:\/\//);
    assert.equal(await page.locator('[data-branch-choice="战斗大师"] .purpose-card-source').innerText(), '玩家手册 2014');
    await goToTask(page, 'job');
    await page.locator('[data-open-branch="careerSubclass"]').click();
    assert.doesNotMatch(await page.locator('#branch-panel .branch-grid').innerText(), /https?:\/\//);
    assert.equal(await page.locator('[data-branch-choice="灵能武士"] .purpose-card-source').innerText(), '塔莎的万事坩埚');
    await page.locator('[data-action="toggle-subclass-comparison"]').click();
    await page.locator('[data-compare-slot="0"]').selectOption('战斗大师');
    await page.locator('[data-compare-slot="1"]').selectOption('灵能武士');
    assert.deepEqual(await page.locator('[data-comparison-level]').evaluateAll(rows => rows.map(row => row.dataset.comparisonLevel)), ['3', '7', '10', '15', '18']);
    await page.locator('[data-action="toggle-subclass-comparison"]').click();
    await page.locator('[data-branch-choice="战斗大师"]').click();
    assert.doesNotMatch(await page.locator('#branch-inspector').innerText(), /https?:\/\//);
    await page.locator('#branch-inspector [data-open-rule="战斗大师"]').click();
    const subclassSource = await modal.locator('.rule-citations a').first().getAttribute('href');
    assert.match(decodeURIComponent(subclassSource), /\/战斗大师\.html$/);
    await modal.getByRole('button', {name:'关闭窗口'}).click();
    await page.locator('#branch-inspector [data-apply-choice="战斗大师"]').click();
    await page.locator('.sticky-board [data-action="levels"]').click();
    await page.locator('[data-open-branch="decision.maneuvers-3"]').click();
    await page.locator('[data-branch-choice]').first().click();
    await page.locator('[data-apply-choice]').click();
    assert.match(await page.locator('#branch-title').innerText(), /1\/3/);
    await goToTask(page, 'background');
    await page.locator('[data-branch-choice="charlatan"]').press('Enter');
    await goToTask(page, 'armor');
    const gearBranch = key => page.locator(`[data-open-branch="${key}"]`).click();
    const gearOption = id => page.locator(`#branch-panel [data-branch-choice="${id}"]`);
    const backpack = id => page.locator(`[data-backpack-item="${id}"]`);
    const equip = (id, slot) => backpack(id).locator(`[data-equip-slot="${slot}"]`);
    await gearBranch('armor');
    await gearOption('none').press('Enter');
    await page.locator('[data-key="shield"]').uncheck();
    await gearBranch('equippedWeapon');
    await gearOption('').press('Enter');
    await gearBranch('equipmentChoices.armor');
    await gearOption('chain').press('Enter');
    await page.locator('[data-open-branch="equipmentChoices.weapon"]').click();
    await page.locator('[data-branch-choice="martial-2"]').press('Enter');
    assert.match(await page.locator('#branch-title').innerText(), /第 2 \/ 2 件/);
    assert.ok(await backpack('longsword').isVisible(), 'the existing longsword selection is retained');
    await page.locator('[data-branch-choice="rapier"]').press('Enter');
    assert.equal(await page.locator('[data-branch-choice="rapier"] .branch-status').innerText(), '已选');
    assert.ok(await backpack('chain-mail').isVisible());
    assert.ok(await backpack('longsword').isVisible());
    assert.equal(await backpack('shield').count(), 0);
    await gearBranch('armor');
    assert.ok(await gearOption('chain').isVisible());
    assert.equal(await gearOption('plate').count(), 0, 'proficiency does not imply ownership');
    await equip('chain-mail', 'armor').click();
    await equip('longsword', 'equippedWeapon').press('Enter');
    assert.match(await backpack('chain-mail').innerText(), /已穿戴/);
    assert.match(await backpack('longsword').innerText(), /已装备主手/);
    assert.ok(await equip('longsword', 'equippedOffhand').isDisabled());
    const shopSearch = modal.locator('[data-shop-search]');
    const shopGold = modal.locator('[data-shop-gold]');
    const shop = () => page.locator('[data-action="equipment-shop"]').click();
    const buy = async (id, query) => {
      await shopSearch.fill(query);
      await modal.locator(`[data-buy-item="${id}"]`).click();
    };
    await shop();
    await buy('shield', '盾牌');
    assert.match(await shopGold.innerText(), /已放入背包.*剩余 5 gp/);
    assert.equal(await shopSearch.inputValue(), '盾牌');
    await modal.locator('[data-buy-item="shield"]').click();
    assert.match(await shopGold.innerText(), /金币不足.*5 gp/);
    await buy('dagger', '匕首');
    await modal.getByRole('button', {name:'关闭窗口'}).click();
    assert.match(await page.locator('.equipment-gold').innerText(), /3 gp/);
    assert.ok(await backpack('chain-mail').isVisible(), 'the starter pack stays in the backpack after a purchase');
    await equip('shield', 'shield').click();
    assert.ok(await page.locator('[data-key="shield"]').isChecked());
    assert.match(await page.locator('.live-strip').innerText(), /AC\s*19/);
    await gearBranch('weaponGrip');
    await gearOption('two').press('Enter');
    assert.equal(await page.locator('[data-key="shield"]').isChecked(), false);
    assert.match(await page.locator('.live-strip').innerText(), /AC\s*17/);
    await page.locator('[data-key="shield"]').check();
    assert.match(await page.locator('[data-open-branch="weaponGrip"]').innerText(), /单手/);
    await equip('dagger', 'equippedOffhand').click();
    assert.equal(await page.locator('[data-key="shield"]').isChecked(), false);
    await page.locator('[data-key="shield"]').check();
    assert.match(await page.locator('[data-open-branch="equippedOffhand"]').innerText(), /无副手武器/);
    await gearBranch('equippedWeapon');
    assert.ok(await gearOption('dagger').isVisible());
    assert.equal(await gearOption('greatsword').count(), 0);
    await page.locator('[data-equipment-mode="gold"]').click();
    await page.locator('[data-key="wealthRoll"]').fill('12');
    await page.locator('[data-key="wealthRoll"]').press('Tab');
    assert.equal(await backpack('chain-mail').count(), 0);
    assert.match(await page.locator('.live-strip').innerText(), /AC\s*14/);
    await shop();
    await buy('scale-mail', '鳞甲');
    await buy('battleaxe', '战斧');
    await modal.getByRole('button', {name:'关闭窗口'}).click();
    assert.ok(await backpack('scale-mail').isVisible());
    assert.ok(await backpack('battleaxe').isVisible());
    await goToTask(page, 'job');
    await page.locator('[data-branch-choice="wizard"]').press('Enter');
    await goToTask(page, 'armor');
    assert.match(await page.locator('.equipment-training-warning').innerText(), /盾牌/);
    assert.doesNotMatch(await page.locator('.equipment-training-warning').innerText(), /链甲|长剑/);
    assert.match(await page.locator('.equipment-unlisted-warning').innerText(), /链甲.*长剑/);
    await gearBranch('armor');
    assert.ok(await gearOption('none').isVisible());
    assert.match(await gearOption('scale').innerText(), /未熟练/);
    assert.equal(await gearOption('chain').count(), 0, 'unowned legacy equipment is inactive');
    assert.equal(await gearOption('plate').count(), 0);
    await gearBranch('equippedWeapon');
    assert.ok(await gearOption('dagger').isVisible());
    assert.match(await gearOption('battleaxe').innerText(), /未熟练.*命中不加熟练加值/);
    assert.equal(await gearOption('greatsword').count(), 0);
    await goToTask(page, 'ancestry');
    await page.locator('[data-branch-choice="mountainDwarf"]').press('Enter');
    await goToTask(page, 'armor');
    await gearBranch('armor');
    assert.match(await gearOption('scale').innerText(), /^熟练$/m);
    assert.doesNotMatch(await gearOption('scale').innerText(), /未熟练/);
    assert.equal(await gearOption('plate').count(), 0);
    await gearBranch('equippedWeapon');
    assert.ok(await gearOption('battleaxe').isVisible());
    assert.equal(await gearOption('greatsword').count(), 0);
    const cash = await page.locator('.equipment-gold').innerText();
    await page.locator('[data-action="register-equipment"]').click();
    await buy('greatsword', '巨剑');
    await modal.getByRole('button', {name:'关闭窗口'}).click();
    assert.equal(await page.locator('.equipment-gold').innerText(), cash);
    await equip('greatsword', 'equippedWeapon').click();
    assert.equal(await page.locator('[data-key="shield"]').isChecked(), false);
    assert.deepEqual(errors, []);
    console.log('Passed private export, spell learning, subclass subchoices, starting gear, purchases and backpack equipment');
    await checkSharedLibrary(browser);
    console.log('Passed cross-tab saves, conflict copies and oversized legacy archive recovery');
    await checkCompactNavigation(browser);
    console.log('Passed compact navigation, exact Back restoration, visible dialog close and section shortcuts');
    await checkShortcuts(browser);
    console.log('Passed Shift-click and double-click apply, undo, search focus, growth keys and shortcut preferences');
    await checkActualLevelChecklist(browser);
    console.log('Passed actual-level checklist, retained growth preview and checklist editor routing');
    await checkPurposeFilters(browser);
    console.log('Passed purpose intersections, filter isolation, localized summaries, live healing and equipped AC');
    await checkEnglishWorkbench(browser);
    console.log('Passed offline language switching, English search, and shared saves');
    await checkStarterGuide(browser);
    console.log('Passed bilingual offline starter guide, editor jumps, keyboard and unchanged saves');
    await checkPageGuide(browser);
    console.log('Passed bilingual page guide, free navigation, and normal character editing');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exit(1);});
