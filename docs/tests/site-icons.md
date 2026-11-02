# site-icons

Each site and app loads a small file with exactly the icons it uses, and those files are safe and up to date.

- File: `tests/site-icons.test.js`

## What it checks
- The compatibility file (`platform/dist/plenix-icons-plenix.js`, every Plenix icon):
  - It is generated and matches `platform/icons`.
  - It registers every Plenix icon once, each the same as its module.
  - Every drawing passes the icon allow-list.
  - Without `plenix.js` on the page it warns and registers nothing.
  - It loads nothing from elsewhere (no fetch, no import, no web address).
- The page icon files of each app, the Asset Manager and the login service are up to date, safe, and loaded by their pages.
- The generator (`tools/icons/site-icons.js`), run on small sample sites:
  - It finds every kind of icon use (JSX, inline page scripts, imported modules, bare class names, Material names) and writes exactly those icons. It ignores `node_modules`.
  - An unknown icon name stops it, unless `--allow-unknown` is given.
  - A name built while the page runs is reported, unless a `plx-icons` comment lists its names.
  - With literals on, a quoted Plenix name in data is included and other words are dropped.
  - The site name "plenix" and a badly formed name are refused.

## Why it exists
- Issue #553, "Icons (#280): per-site icon file generator and the compatibility file plenix-icons-plenix.js". Stage 5 of #280 (in the file header).
- The allow-list check: issue #285. The page icon files: issue #557, "icons come only from modules; bare classes, glyph settings and icons-all.css retire".
- Added in commit 339eefd2 "#553 icons: the per-site icon file generator and the compatibility file plenix-icons-plenix.js".

## How it checks
- Runs each icon file in Node against a stand-in `window.Plenix` that records what it registers. No browser.
- Checks every registered drawing with `platform/utils/iconSafety.ts`.
- Writes small sample sites into a temporary folder and runs the generator on them.

## What a failure means
- A site shows blank icons because its icon file is stale or missing names.
- Or an icon file carries an unsafe drawing, or reaches out to the network.

## When it runs
- AUTOMATIC in `tests/run.js` since issue #756 (before, it was started by hand only), so `npm test` and `npm run test:full` run it. It has no changed mode: it runs all its checks every time.
- CI (`ci.yml`): the "Build and checks" job, in the step "Tests without a browser", on every pull request and on pushes to styling/phase-2 and main.
- Full suite (`full.yml`): the same step of its build job.
- By hand: `node tests/site-icons.test.js`.

## What it needs
- Node only (no browser, no server), with the installed packages (`@babel/standalone`, and `@babel/parser` for the scan).
- The generated icon files (`node build-app.js`), the generator `tools/icons/site-icons.js`, and `platform/icons/`.
