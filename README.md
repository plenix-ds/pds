# Plenix Platform

One design system and component library (React/JSX, `plx-` classes, `plx-ref` / `plx-sys` / `plx-comp` tokens kept as JSON), and the Plenix apps built only from it.

Live: https://plenix.lighthouseway.org/ (apps) · https://design-system.lighthouseway.org/ (design system)

## Use Plenix in another project

Plenix is published like Carbon or Fluent: as versioned packages, a CDN and a JSON API. All three are built from the same Platform sources by `build-packages.js`.

### Packages (GitHub Packages, private)

| Package | What it holds |
|---|---|
| `@plenix-ds/tokens` | token JSON (source), CSS custom properties, a JS module (`tokens`, `token()`, `value()`, `cssVar()`) |
| `@plenix-ds/icons` | SVG icons (Material Symbols Sharp 300), `icons.json`, the icon stylesheet |
| `@plenix-ds/styles` | `plenix.css` (the whole Platform stylesheet), `fonts.css`, `theme-boot.js` |
| `@plenix-ds/react` | every component, pattern, provider and hook (React 18 peer dependency) |

To install, a project needs a `.npmrc` beside its `package.json` and a GitHub token with `read:packages` access to the plenix-ds organization, for example in the environment variable `GITHUB_TOKEN`:

```
@plenix-ds:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```
npm install @plenix-ds/react
```

```js
import '@plenix-ds/styles/plenix.css';
import { AppShell, Button, Table } from '@plenix-ds/react';
```

### CDN (no build tools)

Each version keeps a fixed address and never changes once published. The version list is at https://design-system.lighthouseway.org/cdn/index.json.

```html
<html lang="en" data-plx-density-policy="compact">
<head>
  <script src="https://design-system.lighthouseway.org/cdn/0.1.0/theme-boot.js"></script>
  <link rel="stylesheet" href="https://design-system.lighthouseway.org/cdn/0.1.0/fonts.css">
  <link rel="stylesheet" href="https://design-system.lighthouseway.org/cdn/0.1.0/plenix.css">
  <script src="https://design-system.lighthouseway.org/cdn/0.1.0/vendor/react.production.min.js"></script>
  <script src="https://design-system.lighthouseway.org/cdn/0.1.0/vendor/react-dom.production.min.js"></script>
  <script src="https://design-system.lighthouseway.org/cdn/0.1.0/plenix.js"></script>   <!-- window.Plenix -->
</head>
```

Also on the CDN:
- `plenix.esm.js`: the ES module;
- `tokens/`: `tokens.json` and the token CSS;
- `icons/<name>.svg` and `icons/icons.json`.

### API (read-only JSON)

https://design-system.lighthouseway.org/api/v1/ lists the endpoints:
- `tokens`: every token with its tier, type and values per theme and density;
- `components`: the inventory records;
- `exports`: the React package's public API;
- `taxonomy`: the 14 sections;
- `guidance`: the common-ground guidance for unbuilt items;
- `icons`.

Tools, AI agents and other systems read the rules from here.

### Versions and changes

`VERSIONING.md` says what counts as a breaking change for a component, class, token or API field; `CHANGELOG.md` lists every release.

### Checks

Never run a test: tests run only when the owner starts them himself (HANDOFF.md, "No tests"). For the owner, `npm test` runs the checks for what changed (`tests/changed.js` maps the diff since the previous commit, and the working tree, to the pages, design-system records and labs each test loads; `npm run test:scope` prints it): the visual snapshot (Button), the pages, the accessibility scan (axe-core; known issues in `tests/baselines/a11y.json` may only go down) and the rest. GitHub CI (`.github/workflows/ci.yml`, PDS 1.0) runs the static checks on every pull request and blocks only the problems a pull request adds; the behavior tests move to Vitest and Playwright in Phase 0. `npm run test:full` runs every test on every page, only when the owner starts it. Every test has a time limit (`TEST_TIMEOUT_MS`).

### Releasing a version

1. Raise `version` in `package.json` (semantic versioning; 0.x while the API settles).
2. Run `bash deploy.sh`. It publishes the CDN folder for that version and refreshes the API.
3. Commit, then tag and push: `git tag v0.2.0 && git push origin main v0.2.0`. The Release workflow builds, checks and publishes the four packages, and creates the GitHub release.

## Get it

```
git clone --recurse-submodules https://github.com/plenix-ds/plenix-platform.git Plenix
```

`platform/design-system/` is the **Plenix Design System**, its own repository ([plenix-design-system](https://github.com/plenix-ds/plenix-design-system)) included here as a submodule. Edit and push it there, then record the new version here with `git add platform/design-system`.

## Layout

- `platform/` is the Platform:
  - `components/`, `patterns/`, `providers/`, `hooks/`, `utils/`;
  - `tokens/*.tokens.json` (the source of every value);
  - `icons/`, `system/` (with the token CSS and themes `npm ci` builds), `vendor/` (React), `dist/` (bundles `npm ci` builds; not in git), `dev/` (runtime style guard).
- The apps, one folder each: `dam`, `dashboard`, `notes`, `tasks`, `calendar`, `contacts`, `projects`, `messages`, `files`, `bookmarks`, `settings`, with `suite/` shared by the apps.
- `capabilities/` holds the PRDs and `docs/` the PRD viewer and the live documents; dated material is in `Archived/` (on disk only, not in git), and the team's working history (briefs, study pages, proof folders) is in an archive described by [docs/ARCHIVE.md](docs/ARCHIVE.md).
- Scripts:
  - `build-app.js` builds the tokens, icons and bundles;
  - `build-packages.js` builds the release: the four packages, the CDN files and the API;
  - `check-system.js` checks the system rules;
  - `check-spec.js` checks the design system;
  - `deploy.sh` publishes to the Plenix VM.

## Work

Run `npm ci` first: the built files (`platform/dist/`, each app's `app.js`, the token CSS) are not in git, and `npm ci` builds them (#692). Without it, pages open blank.

```
npm ci
node build-app.js
node check-system.js
node check-style.js
npm run lint:css
node check-spec.js
bash deploy.sh
```

Both checks must pass. The rules:
- nothing hard-coded;
- no style in markup and no hard-coded values; an inline style only as a JavaScript adjustment from tokens, defined styles or measured layout (check-system, rule inline-style);
- no new colors;
- tokens only from `platform/tokens/*.tokens.json`.

Open items are in `TODO.md`.
