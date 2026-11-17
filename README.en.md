# D&D 2014 Character Builder

**[Open in English](https://allenhu132-dev.github.io/dnd-2014-character-builder/?lang=en)** · **[打开中文版](https://allenhu132-dev.github.io/dnd-2014-character-builder/?lang=zh-CN)** · [Download the offline file](https://raw.githubusercontent.com/allenhu132-dev/dnd-2014-character-builder/main/DND-2014-Character-Builder.txt) · [简体中文 README](README.md)

## About the builder

This bilingual character builder uses the 2014 rules for D&D 5th Edition. Choose a race and class, assign ability scores with point buy, and pick equipment and spells. Then check your character’s stats, compare subclasses, and plan levels 1–20 on the same page. The builder opens with an editable level 1 human fighter and requires no account.

## Create your first character

1. Explore the example or choose **Start from Scratch**. Pick your race, class, ability scores, background, equipment, and spells from the home screen. Items under **Build Checklist** take you to the relevant choices.
2. Click an option to preview it. Open **Full Rules** to read the details, or click **Select This Option** to apply it.
3. Use **Leveling** to preview future levels and see what unlocks. Click **Set as Actual Level** when you're ready to level up.

For a walkthrough of the controls, choose **Starter Guide → Start Page Guide** from the home screen and follow the highlights.

## Use it offline

Choose **Settings → Download Offline Tool** and open `DND-2014-Character-Builder.html` in your browser. If you download the `.txt` file directly from GitHub, save it and change the extension to `.html`. You can share that HTML file with your group. Use **Settings → Language** to switch between English and Simplified Chinese in either version.

## Customize the view and plan your build

- Use **Theme** in the upper right to choose a leather book cover. Click the figure at the top to open **Character Sketch**, then click an ability marker to edit that score.
- As you scroll, the navigation stays at the top. Click **HP / AC** on the right to see the full stats.
- Use **Compare Subclasses** above the subclass list to compare two options by level. Each card names its source book. Follow **Full Rules → Sources** for links.

## Save and share characters

- Characters save automatically in your current browser. The website and the offline file keep separate saves.
- To move between devices or versions, export a JSON save from **Settings** and import it on the other side. A full save can include private notes.
- Use **Share Character** to preview a public summary before sending it to your group. It hides race and private notes by default.

## Rules coverage

Plan single-class progression for all 12 classes in the 2014 *Player’s Handbook* and use options from selected older supplements. The rule cards give details and sources in English and Simplified Chinese. Some supplemental effects require manual entry or a ruling from your DM. [2014 Basic Rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014) · [Sage Advice Compendium](https://www.dndbeyond.com/sources/dnd/sac/sage-advice-compendium)

## Build from the public source

After checking out this repository, run `python3 build_characters.py` with Python 3 to generate the offline HTML. Add `--web` to produce the GitHub Pages files in `published-site/dist`. From the local development workspace, use `python3 build_characters.py --web --export-source <directory>` to export the public source and tests. Commit them alongside the site files from the same build.

Run `node tests/character-builder.test.cjs` for rule checks. Browser tests require Chrome and Playwright. Install Playwright with `npm install --no-save --no-package-lock playwright`, then run `node tests/character-builder.browser.cjs`.

## AI-assisted development

The maintainer guides development. OpenAI Codex assists with coding, writing rules summaries, and running tests. Some illustrations were created with OpenAI’s image generation tools. Character calculations and saves run in the browser, and the downloaded builder works offline.
