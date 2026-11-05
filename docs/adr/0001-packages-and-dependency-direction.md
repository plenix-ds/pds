# ADR 0001: Packages and dependency direction

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (decision D-0022)
- **Issue:** plenix-ds/pds#178 (Phase 0, monorepo scaffold)

## Context

- `build-packages.js` already writes four packages into a generated `packages/` folder: `@plenix-ds/tokens`, `icons`, `styles`, `react`. They are built from one tree (`platform/`), not developed as packages.
- The private `plenix-design-system` submodule (`platform/design-system`) holds the design spec and the API sources. Plan §8 folds it into this repo.
- The owner's rule from plenix-platform#712: no new custom tooling unless absolutely necessary.
- The repo already uses npm (`package-lock.json`), Vite 7 and TypeScript 5.6.

## Options

| Option | For | Against |
|---|---|---|
| **A. npm workspaces + Changesets** | No new package manager; the lockfile and CI cache stay as they are; Changesets works with npm workspaces | Slower installs than pnpm; hoisting can hide a missing dependency (Knip catches it) |
| B. pnpm workspaces + Changesets | Strict dependency isolation, fast | A new tool on every agent and CI runner; the lockfile is regenerated |
| C. Nx or Turborepo on top | Task graph and caching | A new tool and config surface for four packages; against #712 |
| D. Keep generating `packages/` from `platform/` | No move | Packages can't declare their own dependencies or exports; Knip and tsc can't check package boundaries |

## Decision

**Option A.** npm workspaces with Changesets.

**Layout:**

```
packages/tokens   @plenix-ds/tokens   DTCG JSON (source of truth), generated CSS, JS and native outputs
packages/icons    @plenix-ds/icons    SVG icons, icons.json, icon stylesheet
packages/styles   @plenix-ds/styles   plenix.css, per-component CSS, fonts.css, theme-boot.js
packages/react    @plenix-ds/react    components, patterns, hooks, providers (ESM + CJS + types)
packages/locales  @plenix-ds/locales  optional: en and ar catalogs, split out only when react no longer bundles them
apps/docs         private             the design spec (folded-in plenix-design-system) and the docs shell
```

**Dependency direction** (one way only):

```
react -> styles -> tokens
icons            (stands alone; react may depend on it)
locales          (stands alone; react may depend on it)
```

- `tokens` depends on no other `@plenix-ds` package.
- `styles` never imports from `react`. `tokens` never imports from `styles`.
- No cycles. No deep imports into another package's `src/`: only its `exports` map.

**Version:** one version for all packages, the CDN folder and `/api/v1` (Changesets `fixed` group). It starts at 1.0.0 (`VERSIONING.md`).

**Move order:** tokens first (with ADR 0002 and ADR 0003), then icons, styles, react. Each move is its own PR, with the build still producing byte-identical CDN files until the move is done.

## Consequences

- `build-packages.js` stops copying sources into `packages/`: each package builds itself (Vite library mode, tsc for `.d.ts`). `build-types.js` is retired when `react` builds with tsc.
- `packages/` leaves `.gitignore` and becomes source. The generated outputs move to each package's `dist/`.
- CDN and API outputs are still assembled from the package `dist/` folders, so one tag publishes npm, CDN and API together (plan §7c).
- The CDN file names (`plenix.js`, `plenix.css`, `tokens/tokens.json`) stay the same, and so does the shape of `latest.json`, `pins` included.
- Moving files is not a public API change: the published names and exports stay the same. No semver impact on its own.

## Enforced by

- `planned:package-boundaries`: no new tool: Knip workspaces plus an ESLint `no-restricted-imports` rule per package (react may import styles/tokens/icons/locales; styles may import tokens; tokens and icons import no `@plenix-ds` package).
- `planned:ownership`: only `pds1-ds-architect` changes `packages/*/package.json` `exports` and `packages/tokens/**` tier files.
- `planned:changeset-required`: a PR that changes a package's public files carries a changeset.
