  // The page guide navigates and marks controls. Character edits still go through
  // the regular editors and save flow.
  const pageGuideSteps = [
    {
      task: 'home', title: '角色名称',
      text: '点角色名旁的笔可以改名。首页的七个入口会打开对应的建卡页面。',
      targets: ['[data-form="character-name"]:not([hidden]) input', '[data-action="edit-name"]'],
    },
    {
      task: 'ancestry', title: '种族与语言',
      text: '单击种族卡预览，点「选择此项」才应用。可在「完整规则」读特性，也可展开「语言」查看自选项。',
      targets: ['#branch-inspector .choice-actions', '[data-detail="languages"][open] [data-open-branch]',
        '.branch-card[data-selected]:not([hidden]) .branch-option', '[data-open-branch="ancestry"]'],
    },
    {
      task: 'job', title: '职业、子职和技能',
      text: '从「换职业」查看职业选项，在「选职业技能」分配熟练项。子职入口会标出解锁等级。',
      targets: ['[data-open-branch="jobSkills"]', '[data-open-branch="job"]'],
    },
    {
      task: 'scores', title: '分配属性',
      text: '在购点面板加减属性原值，顶部会显示剩余点数。掷骰或用标准数组时，切换到「手动原值」。',
      targets: ['[data-score-input="0"]'],
    },
    {
      task: 'background', title: '选择背景',
      text: '背景决定角色冒险前的身份，也会提供技能等熟练项。选好背景后，查看页面上是否还有语言或工具待选。',
      targets: ['#branch-inspector .choice-actions', '.branch-card[data-selected]:not([hidden]) .branch-option',
        '[data-open-branch="background"]'],
    },
    {
      task: 'armor', title: '装备与背包',
      text: '从「起始装备」选择物品，再到「背包」穿戴护甲或装备武器。已装备的物品会计入角色卡。',
      targets: ['[data-equipment-jump="equipment-backpack-title"]'],
    },
    {
      task: 'spells', title: '学习与准备法术',
      text: '可施法的角色会在这里看到学法术、准备法术或安排法术位等入口。可用选项取决于职业和当前等级。',
      targets: ['[data-active-task="spells"] [data-open-branch="plan.spellsAdded"]',
        '[data-active-task="spells"] [data-open-branch="preparations"]',
        '[data-active-task="spells"] [data-action="spell-slots"]', '[data-active-task="spells"] .task-empty'],
      dialogTarget: '#workbench-dialog [data-slot-plan]',
    },
    {
      task: 'treeLevel', title: '预览等级',
      text: '用「预览等级」查看未来能获得的能力和选择。准备好升级后，再点「设为实际等级」。',
      targets: ['[data-preview-level]'],
    },
    {
      task: 'sheet', title: '查看角色卡',
      text: '在角色卡核对攻击、技能和装备。用上方的章节按钮直接跳到对应栏目。',
      targets: ['.sheet-jumps'],
    },
    {
      task: 'home', title: '保存与分享',
      text: '在「设置」里导出 JSON 存档或预览公开摘要。需要离线使用时，选择「下载离线工具」。',
      targets: ['.header-actions [data-action="library"]'],
      dialogTarget: '#workbench-dialog [data-action="export"]',
    },
  ];

  let pageGuideIndex = null;
  let pageGuideFrame = 0;

  function renderPageGuide() {
    if (pageGuideIndex === null) return '';
    const step = pageGuideSteps[pageGuideIndex];
    const finished = pageGuideIndex === pageGuideSteps.length - 1;
    return `<aside class="page-guide" aria-label="页面引导" data-page-guide>
      <div class="page-guide-heading">
        <p class="starter-progress">第 ${pageGuideIndex + 1} / ${pageGuideSteps.length} 步</p>
        <button type="button" data-action="page-guide-close" data-focus="page-guide-close">关闭引导</button>
      </div>
      <h3 tabindex="-1" id="page-guide-title">${step.title}</h3>
      <p>${step.text}</p>
      <div class="page-guide-actions">
        <button type="button" data-action="page-guide-locate">定位本步</button>
        ${pageGuideIndex ? '<button type="button" data-action="page-guide-prev">上一步</button>' : ''}
        <button type="button" class="primary" data-action="page-guide-next">${finished ? '完成指南' : '下一步'}</button>
      </div>
    </aside>`;
  }

  function highlightPageGuide() {
    const step = pageGuideSteps[pageGuideIndex];
    const dialog = root.querySelector('#workbench-dialog[open]');
    const selectors = dialog ? [step.dialogTarget].filter(Boolean) : activeTask === step.task ? step.targets : [];
    const target = selectors.flatMap(selector => [...root.querySelectorAll(selector)])
      .find(element => element.getClientRects().length);
    for (const element of root.querySelectorAll('[data-page-guide-target]')) {
      if (element !== target) element.removeAttribute('data-page-guide-target');
    }
    target?.setAttribute('data-page-guide-target', '');
    return target;
  }

  function queuePageGuideHighlight() {
    if (pageGuideIndex === null || pageGuideFrame) return;
    pageGuideFrame = requestAnimationFrame(() => {
      pageGuideFrame = 0;
      if (pageGuideIndex !== null) highlightPageGuide();
    });
  }

  function locatePageGuideTarget() {
    const target = highlightPageGuide();
    if (!target || target.closest('dialog')) return;
    const panel = root.querySelector('[data-page-guide]').getBoundingClientRect();
    const bounds = target.getBoundingClientRect();
    const board = root.querySelector('.workbench-top');
    const top = target.closest('.masthead') ? 0 : pinnedHeight(board);
    if (bounds.top < top + 8 || bounds.bottom > panel.top - 8) {
      const center = (top + panel.top - bounds.height) / 2;
      window.scrollBy({top: bounds.top - Math.max(top + 12, center), behavior: 'instant'});
    }
  }

  function openPageGuideStep(index) {
    pageGuideIndex = index;
    const {task} = pageGuideSteps[index];
    if (activeTask === task) render();
    else openTask(task);
    if (activeTask === 'home' && task === 'home') window.scrollTo({top: 0, behavior: 'instant'});
    root.querySelector('#page-guide-title').focus({preventScroll: true});
    requestAnimationFrame(() => {
      if (pageGuideIndex === index) locatePageGuideTarget();
    });
  }

  function handlePageGuideButton(button) {
    if (button.dataset.action === 'page-guide-start') {
      openPageGuideStep(0);
      return true;
    }
    if (pageGuideIndex === null) return false;
    switch (button.dataset.action) {
      case 'page-guide-prev':
        openPageGuideStep(Math.max(0, pageGuideIndex - 1));
        return true;
      case 'page-guide-next':
        if (pageGuideIndex < pageGuideSteps.length - 1) openPageGuideStep(pageGuideIndex + 1);
        else {
          pageGuideIndex = null;
          openTask('starter');
        }
        return true;
      case 'page-guide-close':
        pageGuideIndex = null;
        render();
        root.querySelector('#task-title')?.focus({preventScroll: true});
        return true;
      case 'page-guide-locate':
        if (activeTask !== pageGuideSteps[pageGuideIndex].task) openPageGuideStep(pageGuideIndex);
        else locatePageGuideTarget();
        return true;
      default:
        return false;
    }
  }

  root.addEventListener('toggle', queuePageGuideHighlight, true);
  root.addEventListener('close', queuePageGuideHighlight, true);
  root.addEventListener('click', queuePageGuideHighlight, true);
  root.addEventListener('input', queuePageGuideHighlight, true);
  root.addEventListener('keydown', queuePageGuideHighlight, true);
