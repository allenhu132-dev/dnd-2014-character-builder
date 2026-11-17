"""Build the offline player and private character boards."""

import argparse
import base64
import json
import shutil
import zipfile
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
EXPANSION_RULE_FILES = ("ancestries", "backgrounds", "subclasses", "feats", "artificer", "bloodhunter")


def build(*, web: bool = False, export_dir: Optional[Path] = None) -> None:
    source_files = set()

    def source_path(name: str) -> Path:
        path = SRC / name
        source_files.add(path)
        return path

    def read(name: str) -> str:
        return source_path(name).read_text(encoding="utf-8")

    def data_url(name: str, media_type: str) -> str:
        encoded = base64.b64encode(source_path(name).read_bytes()).decode("ascii")
        return f"data:{media_type};base64,{encoded}"

    template = read("character-builder.html")
    rule_styles = read("character-rule-card.css")
    rule_app = read("character-rule-card.js").replace('"/* RULE_CARD_STYLE_VALUE */"', json.dumps(rule_styles, ensure_ascii=False))
    illustrations = {
        asset.stem: data_url(f"option-art/{asset.name}", "image/webp")
        for asset in sorted((SRC / "option-art").glob("*.webp"))
    }
    portrait = data_url("workbench-character-linework-relaxed.png", "image/png")
    theme_styles = read("character-themes.css")
    for cover in ("oxblood", "teal", "forest", "navy"):
        marker = f"/* BINDING_{cover.upper()} */"
        theme_styles = theme_styles.replace(marker, data_url(f"workbench-bindings/{cover}.jpg", "image/jpeg"))
    builder_styles = read("character-builder.css")
    for marker, name, media_type in (
        ("LEVEL_ENGRAVING", "workbench-engraving.jpg", "image/jpeg"),
        ("WALNUT_TEXTURE", "workbench-walnut.jpg", "image/jpeg"),
        ("BOOK_DISPLAY_FONT", "workbench-fonts/cormorant-garamond.woff2", "font/woff2"),
        ("BOOK_TEXT_FONT", "workbench-fonts/source-sans-3.woff2", "font/woff2"),
    ):
        builder_styles = builder_styles.replace(f"/* {marker} */", data_url(name, media_type))
    font_licenses = "\n\n".join(
        read(f"workbench-fonts/{font}-OFL.txt")
        for font in ("cormorant-garamond", "source-sans-3")
    ).replace("*/", "* /")
    builder_styles = f"/* Bundled font licenses\n{font_licenses}\n*/\n" + builder_styles
    shared = {
        "SHARED_STYLES": read("campaign.css"),
        "THEME_STYLES": theme_styles,
        "BUILDER_STYLES": builder_styles,
        "RULE_CARD_STYLES": rule_styles,
        "ROGUE_DATA": read("rogue-rules.js"),
        "CATALOG_DATA": read("character-catalog.js"),
        "RACE_DATA": read("character-ancestries.js"),
        "GROWTH_DATA": read("character-growth.js"),
        "CORE_RULES": read("character-core-rules.js"),
        "SPELL_DATA": "\n".join(read(name) for name in (
            "character-spells.js", "character-spell-catalogue.js", "character-spell-profiles.js", "character-spell-resolution.js",
        )),
        "EXPANSION_RULES": "\n".join(read(f"character-expansion-{kind}.js") for kind in EXPANSION_RULE_FILES),
        "OPTION_PURPOSE": read("character-option-purpose.js"),
        "OPTION_ART": "const ruleArtImages = " + json.dumps(illustrations, separators=(",", ":")) + ";\nconst workbenchPortrait = " + json.dumps(portrait) + ";",
        "LIBRARY_APP": read("character-library.js"),
        "LOCALE_APP": read("character-locale.js").replace(
            "/* ENGLISH_CATALOG */", json.dumps(json.loads(read("character-en.json")), ensure_ascii=False).replace("<", "\\u003c")
        ),
        "BUILDER_APP": (read("character-builder.js")
                        .replace("/* WORKBENCH_EXTENSION */", read("character-workbench.js"))
                        .replace("/* PAGE_GUIDE_EXTENSION */", read("character-page-guide.js"))
                        .replace("/* HUD_EXTENSION */", read("character-hud.js"))
                        .replace("/* RULE_CARD_EXTENSION */", rule_app)),
    }
    for marker, value in shared.items():
        template = template.replace(f"/* {marker} */", value, 1)

    public = ROOT / "DND-2014-Character-Builder.html"
    outputs = [(public, {})]
    private_markers = []
    private_config = ROOT / "private-character.local.json"
    if private_config.is_file():
        config = json.loads(private_config.read_text(encoding="utf-8"))
        filename, seed = config["output"], config["seed"]
        if Path(filename).name != filename or not filename.endswith("-private.html"):
            raise ValueError("Private output must be a local filename ending in -private.html")
        if seed.get("private") is not True:
            raise ValueError("The local preset must set seed.private to true")
        outputs.append((ROOT / filename, seed))
        private_markers = [marker for marker in [seed.get("name"), *config.get("private_markers", [])] if marker]

    def check_public(content: bytes, path: Path) -> None:
        if any(marker.encode("utf-8") in content for marker in private_markers):
            raise ValueError(f"Private character data found in public file: {path.name}")

    export_files = []
    if export_dir is not None:
        export_dir = export_dir.resolve()
        if export_dir == ROOT:
            raise ValueError("Export to a separate directory")
        source_files.update(ROOT / name for name in (
            "build_characters.py", ".gitignore",
            "tests/character-builder.test.cjs", "tests/character-builder.browser.cjs",
        ))
        for path in sorted(source_files):
            content = path.read_bytes()
            check_public(content, path)
            export_files.append((path.relative_to(ROOT), content))

    for output, seed in outputs:
        data = json.dumps(seed, ensure_ascii=False).replace("<", "\\u003c")
        document = template.replace("/* CHARACTER_SEED */", data, 1)
        if output == public:
            check_public(document.encode("utf-8"), output)
        output.write_text(document, encoding="utf-8")
        print(output)

    if export_dir is not None:
        for relative_path, content in export_files:
            destination = export_dir / relative_path
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(content)
        print(f"Exported {len(export_files)} public source files to {export_dir}")

    if web:
        project = ROOT / "published-site"
        distribution = project / "dist"
        distribution.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(public, distribution / "index.html")
        # A plain-text delivery asset keeps hosting-side HTML scripts out of the
        # downloaded file. The download button gives it the .html filename.
        payload = distribution / public.with_suffix(".txt").name
        shutil.copyfile(public, payload)
        (distribution / public.name).unlink(missing_ok=True)
        # The deployment repository contains only the general-purpose tool.
        archive = ROOT / "DND-2014-Character-Builder-web.zip"
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as package:
            for asset in (distribution / "index.html", payload, public):
                package.write(asset, asset.name)
        print(archive)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--web", action="store_true", help="build site files and a public ZIP")
    parser.add_argument("--export-source", type=Path, metavar="DIRECTORY", help="export the public build inputs and tests")
    args = parser.parse_args()
    build(web=args.web, export_dir=args.export_source)
