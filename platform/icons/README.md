# Plenix icons

Material Symbols Sharp, weight 300 (Google, Apache License 2.0), copied unedited from
https://github.com/google/material-design-icons/tree/737e3324305806514d7909874fa1818ae1808232/symbols/web
(`<symbol>/materialsymbolssharp/<symbol>_wght300[fill1]_{20,24}px.svg`).

| File | Source file |
|---|---|
| `<symbol>.svg` | `<symbol>_wght300_20px.svg` (optical size 20, outline) |
| `<symbol>-fill.svg` | `<symbol>_wght300fill1_20px.svg` (optical size 20, filled) |
| `<symbol>-24.svg` | `<symbol>_wght300_24px.svg` (optical size 24, outline) |
| `<symbol>-24-fill.svg` | `<symbol>_wght300fill1_24px.svg` (optical size 24, filled) |

`map.json` names the symbol behind every Plenix icon name (`<Icon name="folder-open">` -> `folder_open`).
`node build-app.js` runs `build-icons.js`, which checks every file, writes `components/Icon/glyphs.js` (the names) and the asset layout (the files and modules), and writes `components/Icon/icon.css`, which holds only presentation since #557 (no drawing).

Rules: never edit, redraw, re-pad or re-weight a file; never mix in another set. To add an icon: pick the symbol on
https://fonts.google.com/icons?icon.style=Sharp, download its four files from the same commit, add its name to
`map.json`, build. A concept with no symbol is listed for a decision, not drawn. Icons Plenix draws itself on the owner's decision live apart
in `custom/` (see its README: person-male, person-female, 2026-10-19); build-icons.js reads it after this folder.

## The full library (batch 273)

`library/` holds every symbol of the set (4,150 symbols, 16,600 files: the same four files each, same names, unedited) at
the same commit, and `library/index.json` lists them. Hosted with the site:
https://plenix.lighthouseway.org/Plenix/platform/icons/library/<symbol>.svg (and design-system.lighthouseway.org at the
same path). To use a symbol, add its Plenix name to `map.json`: build-icons.js takes a file from this folder first, then
from `library/`, so nothing needs copying.

## The whole library on the CDN (2026-10-22)

`/cdn/material/<commit>/` (on design-system.lighthouseway.org, open to other sites with CORS) holds every symbol's four
files; deploy.sh copies `library/` there once per pinned commit. `<Icon name="person_cancel">` loads a Material name's
files from there the first time it is drawn, or draws its imported or registered module. A Material name that is already
a Plenix name keeps the Plenix meaning (`check`, `home`). `icons-all.css` (bare Material class names) is retired (#557).

## The naming contract (2026-10-22)

| Spelling | Works | Example |
|---|---|---|
| Plenix name, dashes | always | `mic-off`, `person-cancel`, `check-square` |
| The same name with underscores, where the Plenix name is its Material symbol with dashes | always | `mic_off`, `person_cancel` |
| Any other Material Symbols name | always (its module, or its library file) | `rocket_launch`, `10k` |
| A Material name that is also a Plenix name | draws the Plenix icon | `check` (check_small), `home` |

## The icon inventory and restyled icons (2026-10-24, #301)

The rules above cover the Material Symbols files: they stay unedited. Icons from other libraries are a different
thing: the owner asked for them to be restyled to the Plenix icon guidance (`platform/standards/icons.md`), and a
restyled icon is a new Plenix drawing, not an edited Material file. They live in `inventory/` (see its README), apart
from this folder, with each library's original kept beside it. Apps draw none of them until the owner approves one;
it then joins the working set through `map.json` like any icon. Tools: `tools/icons/` (`check-icon.js` reports how an
SVG is built against the guidance, `restyle-icon.js` refuses to write over the Material files).

## The asset layout (#279, stage 1 of #277)

One layout and one naming for every icon source, written by `layout.js` (generated, never committed):

| Set | Where it is written | By | Size |
|---|---|---|---|
| `plenix` (the names in `map.json`) | `platform/dist/icons/plenix/` and `release/cdn/<v>/icons/plenix/` | `build-icons.js` (every `build-app.js` run) and `build-packages.js` | 212 icons, 1,061 files, 0.8 MB |
| `material` (every symbol in `library/`) | `release/cdn/<v>/icons/material/` | `build-packages.js` (each release) | 4,150 icons, 20,751 files, 20.2 MB, under 1 s |

- **Files per icon:** `<name>.svg`, `<name>-fill.svg`, `<name>-24.svg`, `<name>-24-fill.svg` (the source files, unedited), and `<name>.js`.
- **The module:** `export default { name, set, symbol, fillOutline, mirrored, drawings: { 20: { outline, fill }, 24: { outline, fill } } }`. Each drawing is `{ viewBox, d, transform?, fillRule?, clipRule? }`. Both optical sizes are in every module (owner, #277 answer 7).
- **`index.json` per set:** every name with its symbol and files, and every alias with its name.
- **Names:** lowercase with dashes (`mic_off` is `mic-off`); the variant suffixes are `-fill`, `-24` and `-24-fill`. An alias (a symbol's underscore spelling) has no file of its own; `index.json` maps it to its name, so every name has exactly one module.
- **The CDN path:** `/cdn/<version>/icons/<set>/<name>.js` (and `.svg`), under the release's version, so it never changes once published. The existing `/cdn/material/<commit>/` stays for the Icon component's fetch.
- **One set on its own:** `node platform/icons/layout.js <plenix|material> <folder>`.
- **No consumer reads the layout yet** (stage 1): `icon.css`, `glyphs.js` and the Icon component draw every icon as before. Stage 2 (#282) makes the modules importable.

## Importing icons (#282, stage 2)

- **In an application:** `import Add from 'plenix-platform/icons/plenix/add'` (or `…/icons/material/rocket-launch`), then `<Icon icon={Add} />`.
  - `build-app.js` bundles the module into that application's script.
  - A Material module is written on demand into `platform/dist/icons/material/`: only the names imported, under the same folder guard.
- **Outside the suite:** the CDN's stage 1 paths, `/cdn/<version>/icons/<set>/<name>.js`.
- **The `icon` prop:** Icon draws from the module's own drawings, with the same classes as by name, so `icon.css` still chooses the optical size (20 or 24) and the fill, and mirrors in right to left.
- **`registerIcons(...modules)`:** a name (and its symbol's spelling) draws from its module first.
  - It is stage 2 minimal; #281 extends it with the library choice and the development fetch.
  - Unregistered names draw as before: Plenix names from `icon.css`, Material names from the library.
- **No consumer is switched yet:** every page draws from `icon.css` as before.

## One resolver (#281, stage 3)

- **The order, in the default library `plenix`:** registered Plenix modules, then the Plenix set (`icon.css`), then registered Material modules, then the run-time file fetch (as before). Other libraries look only at their own registered modules (and, for `material`, the Material files).
- **The `library` choice:** `<Icon library="plenix" | "material" | "<project>">`, or `setDefaultIconLibrary(name)` for the page. Call it at startup, before icons draw: icons already on the page don't draw again.
- **Plenix names win in the default library:** a registered Material module never replaces a Plenix name (importing `material/home` leaves every `<Icon name="home">` drawing Plenix's `home`); it serves only names outside the Plenix set.
  - `material` draws Material's own symbol even where a Plenix name exists: `check` is `check`, not `check_small`.
  - A project's library draws only the modules registered into it: `registerIcons(...modules, { library: 'acme' })`.
- **Development notice:** a name drawn by a run-time fetch warns once, in development only (`devWarn`'s check), that production should import or register it. The fetch itself stays in production for now; switching it off belongs to a later stage, once sites ship icon files.
- **Right to left:** a module outside the Plenix set whose symbol points along the reading direction (`mirrored`) gets `plx-icon--mirrored`, which `icon.css` mirrors. Plenix names keep their own per-name rules.
- **Build errors:**
  - An unknown `plenix-platform/icons/material/<name>` import stops the build, as an unknown Plenix name does.
  - An icon value that is not a module warns once.

## Untrusted icon files (#285, stage 4)

- **One allow-list:** every icon file and every module drawing goes through `platform/utils/iconSafety.ts`. That covers the run-time fetch, `registerIcons`, the `icon` prop, `layout.js` and `build-icons.js`.
- **The shape:** one `<svg>` (`xmlns` = the SVG namespace, `width`, `height`, `viewBox`) holding exactly one `<path>` (`d`, `transform`, `fill-rule`, `clip-rule`).
- **Values by grammar:**
  - `viewBox`: four numbers, with a positive width and height
  - `d`: path data only
  - `transform`: matrix, translate, scale, rotate or skew of numbers only, with a space or a comma between numbers (`translate(10 -5)` passes; `translate(10-5)` is refused)
  - the rules: `nonzero` or `evenodd`
- **Everything else refuses the whole file:** other elements (the basic shapes too: an icon is drawn as one path), other attributes, doctypes, entities, CDATA, comments, processing instructions, and text.
- **Bounded:** a file over 32 KB, or a path over 16 KB, is refused before it is read. The largest shipped file is 4.3 KB.
- **When a file is refused:**
  - at run time, the icon draws nothing, and development warns once with the reason
  - at build time, the build stops, naming the file and the reason
- **The shipped files:** all 17,120 pass and read exactly as before. The checks are `tests/icon-safety.test.js` (Node only).

## A site's icon file (#553, stage 5)

A site that loads Plenix from the CDN (`plenix.js`, `window.Plenix`) registers the icons its pages draw by name. Each icon then draws from its own module, not from `icon.css`. There are two choices. Each is a classic script, loaded after `plenix.js`:

| File | What it registers | Made by | When to use it |
|---|---|---|---|
| `plenix-icons-<site>.js` | Exactly the icons the site's source uses | `node tools/icons/site-icons.js <site> <folder or file> …` | Production (recommended) |
| `plenix-icons-plenix.js` | Every Plenix icon (the 212 names in `map.json`; their symbol spellings answer too) | `node build-app.js` into `platform/dist/`; `build-packages.js` puts it beside `plenix.js` on the CDN | A site without its own file yet |

```html
<script src="https://design-system.lighthouseway.org/cdn/<version>/plenix.js"></script>
<script src="/plenix-icons-st-john.js"></script>
```

- **For an extension or an offline app, build your site icon file with tools/icons/site-icons.js; don't copy icon files.**
- **The generator:** `node tools/icons/site-icons.js <site> <folder or file> … [--out <folder>] [--allow-unknown]`
  - **Without a Plenix checkout:** `npx plenix-site-icons <site> <folder or file> …` runs the same tool from `@plenix-ds/icons` (its one dependency is `@babel/parser`). It knows every Plenix icon and the Material symbols the package ships in `svg/`; another Material Symbols name is reported as unknown, and `--allow-unknown` writes the file without it.
  - **What it reads:** `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.html` and `.htm`, including a page's inline scripts (TypeScript is read with Babel's own TypeScript parser, as JSX is). It skips `node_modules`, `dist`, `vendor` and dot folders.
  - **Point it at the site's own source,** not at a built file that bundles Plenix.
  - **A use is one of these:**
    - an icon slot, read with Babel as the Platform's own check reads it (`platform/icons/uses.js`): `<Icon name>`, `icon="…"`, `{ icon: '…' }`, `h(Plenix.Icon, { name })`, a constant whose name ends in `Icon` or `Icons`, or a parameter's default
    - an imported module (`plenix-platform/icons/<set>/<name>` or `/cdn/<version>/icons/<set>/<name>.js`)
    - a bare class name (`plx-icon--<name>`)
  - **How a name resolves:** as `<Icon name>` does. A Plenix name (with dashes, or its symbol's underscore spelling) comes first, then a Material Symbols name from `library/`.
  - **Unknown names and run-time names:** an unknown name, or a name built at run time (`'size-' + s`), is reported with its file and line, and the generator stops without writing (exit 1). List a run-time name's possible values in a `/* plx-icons: … */` comment on its line, or pass `--allow-unknown` to write the file without those names.
- **Safe:** a file holds data only, as `{ name, set, symbol, fillOutline, mirrored, drawings }` objects passed to `registerIcons`. The Icon component checks every drawing with the allow-list (#285) and draws it as React props, never as HTML. A path used by several icons is written once.
- **Offline:** the file loads nothing else, so it works offline and from `file://`. Loaded before `plenix.js`, it warns once and registers nothing.
- **`<Icon name>` keeps working without either file:** from stage 5c a Plenix name with no module loads its files once from the asset layout (online only). Load one of the two files for production and for `file://`.
- **check-system:** fails when `platform/dist/plenix-icons-plenix.js` differs from what `map.json` generates. The test is `tests/site-icons.test.js`.

## Icons come only from modules (#557, stage 5c)

- **The resolver's order for a name:**
  1. a registered or imported module
  2. a Plenix name with no module: its four files, loaded once from `icons/plenix/` beside `plenix.js` or `plenix.css` (the CDN's `/cdn/<version>/icons/plenix/`, a self-hosted archive), or `platform/dist/icons/plenix/` in this repository; development warns once that production should load an icon file, import or register it
  3. any other Material name: its files from the library, as before
  4. an unknown name: nothing, with a warning
- **Never from the stylesheet:** the Icon component no longer reads `--plx-comp-icon-glyph-*`. This also ends the first-paint empty icon (an icon drawn before the stylesheet arrived stayed empty).
- **This repository's pages:** `node build-app.js` writes each page's icon file, which loads after `platform.js`:
  - each suite application: `<app>/plenix-icons-<app>.js`, from its own source and `suite/`
  - the Asset Manager: `dam/plenix-icons-dam.js`, for its four pages
  - the design spec: the compatibility file
  - the login service: `services/login/icons.js`, its two icons as markup for the server-rendered page
  - check-system fails when any of them differs from its source.
- **Mirroring:** every icon that points along the reading direction carries `plx-icon--mirrored`, which mirrors it in right to left. A module is marked by its `mirrored` flag, a name by its symbol (`glyphs.js`, `MIRRORED`).
- **`iconMarkup(icon, { size, filled, label, className })`:** the component's markup as an HTML string, for code that writes HTML.
  - The drawing comes only from a module (imported, or registered by name), through the allow-list; every value is escaped.
  - A name with no module gives the span without a drawing, and development warns once.
- **Removed in stage 5c-2 (the owner, #277 Q3 and Q5; the notice is in the CDN README and the changelog):**
  - the bare classes (`plx-icon plx-icon--<name>` without the component): they draw nothing. The style audit warns about each name in development, and check-system (`bare-icons`) refuses one in the Platform, the applications and the spec.
  - the glyph settings (`--plx-comp-icon-glyph-*`), their per-density aliases (`--plx-comp-icon-auto-*`), the per-name rules and the mask on `.plx-icon`: `icon.css` went from 555 KB to 4 KB.
  - the per-name right-to-left rules: `plx-icon--mirrored` does it.
  - `icons-all.css`: no longer published.
