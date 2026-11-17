# D&D 2014 建卡工作台

**[打开中文版](https://allenhu132-dev.github.io/dnd-2014-character-builder/?lang=zh-CN)** · **[Open in English](https://allenhu132-dev.github.io/dnd-2014-character-builder/?lang=en)** · [下载离线文件](https://raw.githubusercontent.com/allenhu132-dev/dnd-2014-character-builder/main/DND-2014-Character-Builder.txt) · [English README](README.en.md)

## 项目简介

这是一个面向 D&D 第五版 2014 规则的中英文建卡器。从种族、职业和购点开始，选好装备和法术后，就能在同一页核对角色数值、比较子职并规划 1–20 级成长。首次打开会载入一张可编辑的 1 级人类战士示例卡，建卡无需账号。

## 第一次建卡

1. 用示例角色熟悉界面，或点「从空白建卡」。在首页选种族、职业、属性、背景、装备或法术。「建卡检查」里的待办会带你到对应选项。
2. 单击选项先预览。点「完整规则」可读详细说明，点「选择此项」应用。
3. 在「升级」里预览未来等级和待选能力。准备好升级时，点「设为实际等级」。

需要指引时，点首页的「新手指南 → 开始页面引导」，跟着高亮逐步认识控件。

## 离线使用

在网页的「设置」里点「下载离线工具」，用浏览器打开下载的 `DND-2014-Character-Builder.html`。如果从 GitHub 直接下载的是 `.txt` 文件，保存后把扩展名改成 `.html`。这个 HTML 文件可以直接发给团友。在线版和离线版都可在「设置 → 界面语言」切换简体中文和 English。

## 界面和规划

- 右上角「配色」可选皮革书封主题。点顶部人像打开「角色草图」，再点任一属性标点进入编辑。
- 往下滚时，顶部保留一行导航。点右侧 **HP / AC** 可查看完整数值。
- 打开子职列表里的「子职对照」，按等级比较两条子职路线。卡面显示来源书名，规则链接在「完整规则 → 规则出处」。

## 保存和分享角色

- 角色自动保存在当前浏览器。在线版和离线版各有自己的存档。
- 换设备或版本时，在「设置」导出 JSON，再到另一端导入。完整存档可能含有私人补记。
- 在「分享角色」里预览公开摘要，再发给团友。摘要默认隐藏种族和私人补记。

## 规则范围

支持 2014《玩家手册》的 12 个核心职业和单职业成长，也收录部分旧版扩展。规则卡提供中英文说明和来源，部分扩展效果需要手填或与 DM 确认。可参照卡片书目及官方规则答疑。[2014 基础规则](https://www.dndbeyond.com/sources/dnd/basic-rules-2014) · [规则答疑](https://www.dndbeyond.com/sources/dnd/sac/sage-advice-compendium)

## 从公开源码构建

检出仓库后，用 Python 3 运行 `python3 build_characters.py`，即可生成离线 HTML。加 `--web` 会在 `published-site/dist` 生成 GitHub Pages 文件。维护时从本地工作区运行 `python3 build_characters.py --web --export-source <目录>`，即可导出通用源码和测试，再将同一次构建的网页和离线文件提交到发布仓库。

规则测试运行 `node tests/character-builder.test.cjs`。浏览器测试需要本机 Chrome 和 Playwright。可用 `npm install --no-save --no-package-lock playwright` 安装 Playwright，再运行 `node tests/character-builder.browser.cjs`。

## AI 辅助开发

本项目根据维护者提出的需求迭代。OpenAI Codex 辅助编写代码、整理规则说明和运行测试，部分插图由 OpenAI 的图像生成工具制作。建卡计算和存档在浏览器中完成，下载后可离线使用。
