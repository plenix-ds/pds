# ADR 0052: Code loads per screen: one ES module entry per export, on npm and on the CDN

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's performance rules for all apps (chat, 2026-11-10, #1201, D-0160), rule 2. The release architect owns the build, the CDN layout and the loader. This entry owns the package boundaries and the import API.
- **Issue:** #1201 (S2), slice B1 #1207. Related: #1188 (the CSS), #1194 (loading thresholds). Decision D-0162.

## Context

- **The CDN ships Plenix as two whole files:** `plenix.js` (the browser global, 2,691,608 B raw, 572 KB brotli) and `plenix.esm.js` (one ES module). An app that loads either gets every component, pattern and hook on every screen.
- **The npm package is already split** (#685, the audit #684). Vite's `esm` build (`vite.packages.config.mjs`, `partEntries`) writes one ES module per module that `platform/index.ts` exports from, at its own path, and puts shared code once in `dist/chunks/`. `sideEffects` marks every part pure, so a bundler drops what an app doesn't import. But the only public entry is the barrel `.`. An app without a bundler, or one that wants a screen to load its parts on demand (`import()`), has no stable path to name.
- **Already on demand:** the engines (rich text, charts, PDF) through `plenix-engines.js` (#456, #457); Arabic (`@plenix-ds/react/i18n/ar`, #702); the icon sets (`plenix-icons-<set>.js`); the DataGrid full-text dialog (#1145).
- **`cdn/latest.json` keeps its shape, including `pins`** (CTM reads it every 30 minutes).
- The ESM part build already works out its own address for icon files (`import.meta.url`, #284), so a module served from the CDN finds the files beside it.

### Measured (1.6.1, 2026-11-10)

| What | Minified | gzip | brotli 5 |
|---|---|---|---|
| CDN `plenix.js` (global, all of it) | 2,691,608 B raw | 622,416 B | 552,947 B |
| CDN `plenix.esm.js` (one ES module, all of it) | 2,844,296 B raw | 647,533 B | 574,301 B |
| npm `{ Badge }` alone | 16.5 KB | 6.7 KB | |
| npm `{ Button }` alone | 95.4 KB | 33.6 KB | |
| npm `{ DataGrid }` alone | 454.4 KB | 149.8 KB | |
| npm `* as P` (everything) | 1,430.4 KB | 454.6 KB | |

- Commands: `node build-packages.js`, then `node tools/agent/one-part-sizes.js` (Vite, minified, React external). The CDN files are gzip `-9` and Node's brotli at quality 5 (the web host's setting, #1191) on `release/cdn/1.6.1/`.
- The npm part build has 148 component modules and 130 shared chunks today.

### Who loads what

| App | How | What it loads per screen |
|---|---|---|
| CTM (Django, no bundler) | `<script>` tags: `vendor/react*.production.min.js`, then `plenix.js`; reads `window.Plenix` (CTM `docs/architecture/CTM-Plenix-CDN-contract.md`) | everything, 553 KB brotli |
| RedSave (browser extension, WXT and Vite) | vendored `plenix.esm.js` with its types, bundled | what Rollup keeps from one large module (no per-part entries) |
| npm apps (GitHub Packages) | `@plenix-ds/react` barrel, bundled | only the parts imported (tree-shaken, #685) |

## Options

| Option | For | Against |
|---|---|---|
| **A. One public entry per export name: `@plenix-ds/react/<Export>` on npm and `/cdn/<v>/esm/<Export>.js` on the CDN, from the existing per-part build; the barrel stays; the whole files stay through 1.x** | Stable, readable paths (`DataGrid`, `Dialog`); a screen can `import()` its parts; no rename; the build exists. | About 450 entry files (thin re-exports). |
| B. Expose the module paths (`@plenix-ds/react/components/DataGrid/DataGrid`) | No new files | Internal folder layout becomes public API; moving a file is a breaking change. |
| C. Family bundles (`forms`, `data`, `layout`, …) | Few files | The families overlap, and every app still loads parts it does not use. |
| D. Keep one file; make it smaller only | No API change | Doesn't meet rule 2: the screen still loads everything. |

## Decision

**Option A.**

### Entries

- **One entry per public export name** that `platform/index.ts` exports (the same list as `/api/v1/exports`):
  - npm: the subpath `@plenix-ds/react/<Export>`, for example `import { DataGrid } from '@plenix-ds/react/DataGrid'`. `exports` maps `"./*"` to `./dist/parts/*.js`, with types at `./parts/*.d.ts`.
  - CDN: `/cdn/<version>/esm/<Export>.js`, the same modules. Also `/cdn/<version>/esm/index.js` (the barrel) and `/cdn/<version>/esm/chunks/*` (the shared code, content-hashed names).
- **An entry re-exports only its own name** from its module (`export { DataGrid } from '../components/DataGrid/DataGrid.js'`). Names a module exports together, such as `Tabs` and `TabPanel`, still get one entry each. They share the module, so loading both costs the module once.
- **Types and props types** come from the same entry: `export type { DataGridProps, DataGridColumn } …` sit in `parts/DataGrid.d.ts`, and all are also in the barrel.
- **The barrel `.` stays,** for apps that bundle (a bundler tree-shakes it as before).
- **A manifest:** `/cdn/<version>/esm/manifest.json` (`{ version, entries: { "<Export>": { file, imports: [chunk files] } } }`). It lets a page or the loader preload a screen's chunks (`<link rel="modulepreload">`). It is generated, never edited.
  - **Optional fields (#1301, D-0171):** an entry may also carry `chunk` (the shared file that holds the part) and `binding` (its name there), so the loader imports the chunk directly. A reader of 1.7.0's shape (`file`, `imports`) keeps working; new fields are only ever added.
  - **Chunks are layers, not one per part (#1293, D-0171):** the CDN's `esm/` groups shared code by what loads together (core, grid, shell, forms, charts), so a screen is a handful of files. Each layer is limited once in `perf-budget.json`, and each part by what it adds. The npm part modules stay one per part, for bundlers.
- **React for the CDN modules:** they import `react`, `react-dom` and `react/jsx-runtime` as bare names. The version's own vendor folder provides ES module builds of them (`vendor/react.esm.js` and the others; release architect), and an import map resolves the names.
- **The CSS stays one file** (`@plenix-ds/styles`, `plenix.css`). Splitting it per part is a later ADR, once #1188's scope fix is measured. A part's CSS is small next to its JS.

### The loader call (apps without a bundler, such as CTM)

- **`plenix-loader.js`** (CDN, beside `plenix.js`) is one small classic script. It writes the import map for the version's React, sets up `window.Plenix` and adds one function:
  - **`Plenix.load(names: string[]): Promise<void>`** imports `esm/<name>.js` for each name, waits for all, and sets `window.Plenix[name]`. A name already loaded resolves at once. An unknown name rejects with its name. Loads are deduplicated, so two screens asking for `DataGrid` load it once.
- A screen calls it before it renders: `await Plenix.load(['DataGrid', 'Dialog', 'Button']); render(...)`. Everything after that is today's `window.Plenix.<Name>`, so CTM's screens change one line each.
- The loader holds no component code. Its size has a budget (release architect).

### Icons per set

- The icon sets stay one file per set: `plenix-icons-<set>.js` (global) and `esm/icons/<set>.js` (ES module). A screen loads only the sets it draws. The icon names stay a chunk of their own (#702).

### On demand inside Plenix

- Code that runs only after an interaction, and is large, loads on first use inside its part (`import()` behind the part's API), as DataGrid's overflow dialog does (#1145). Candidates are listed by the release architect's per-entry budget, and each one is its own PR with G3 review. The public API never changes for it.
- The engines, Arabic and the icon sets stay as they are.

### Compatibility (1.x)

- `plenix.js` (global), `plenix.esm.js` (one ES module) and `plenix.global.js` (npm) stay, unchanged, through 1.x.
- **Deprecated** in the minor that ships the entries: a docs note ("load per screen from `esm/`"), a changelog line, and a console note only in development builds. **Removed in 2.0.0.**
- `cdn/latest.json`: same shape, including `pins`. The `esm/` folder sits under the same version path, so an app builds its address from the version it already reads.
- Published CDN versions are immutable. The entries start with the next minor, and older folders don't change.

## Consequences

- **Semver: MINOR (1.7.0 or the next).** Added: about 450 entry points (npm subpaths and CDN `esm/`), `esm/manifest.json`, `plenix-loader.js` with `Plenix.load()`, and `esm/icons/<set>.js`. Deprecated (removed in 2.0.0): the whole-file CDN and global builds. No rename, and no prop change.
- **App side (documented in `docs/integration/performance.md`, rule 2):** a bundled app imports its parts from their entries, and a router loads a screen with `import()`. Apps that bundle get most of this from tree-shaking already. CTM swaps `plenix.js` for `plenix-loader.js` and adds one `Plenix.load([...])` per screen (slice B5).
- **Follow-up slices:** B2 is the build, `esm/`, the manifest, the loader and the vendor ESM React (release architect). B3 is icons per set in `esm/icons/`. B4 is the docs. B5 is CTM's adoption. Each on-demand candidate inside Plenix is its own slice.
- **An export name is now also a path.** Renaming an export is breaking, as before. A new export gets its entry automatically, and a check enforces that.

## Enforced by

- G3 on every PR that adds or removes an export: its entry exists (or is removed) with the same name.
- A build check (release architect, #1201 rule 7): every name in `/api/v1/exports` has `dist/parts/<name>.js` and `esm/<name>.js`, and nothing else is there; each entry's size is under its budget.
- The publish dry run: `esm/` and `esm/manifest.json` exist under the new version, `plenix-loader.js` loads a named part in a headless page, and `latest.json` keeps its shape and `pins`.
