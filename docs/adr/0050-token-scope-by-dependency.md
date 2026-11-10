# ADR 0050: Component tokens are re-declared only where they can change (density, interaction, theme)

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's "why does the site feel sluggish?" (#1188, via CTM3 - PM).
- **Issue:** #1188 (S2).

## Context

- A custom property is computed where it is declared, and children inherit the computed value. So a component token such as `--plx-comp-x: var(--plx-sys-space-inset-sm)` follows a region's density only if it is declared again on that region (batch 221).
- To do that, `components.tokens.json` and every per-component token file were written under `:root,[data-plx-density],[data-plx-interaction]`: **5,564 declarations re-declared on every element that carries a density or interaction attribute.**
- `DataGrid` sets `data-plx-density` on itself, and ThemeZone sets it too. Every grid therefore recomputes about 5.5k variables for its whole subtree, on every style recalculation (hover, update).
- Measured on 1.6.x (`packages/tokens/sd/assemble.cjs` dependency walk):
  - 253 of the 5,564 reach a density or interaction value;
  - 2,441 reach a theme value (ThemeZone relies on the density attribute to re-resolve them today; a zone with no density above it does not re-resolve them at all);
  - 2,872 reach neither.

## Options

| Option | For | Against |
|---|---|---|
| **A. The assembler writes each broad-scope token by what its references reach: density or interaction -> the broad scope; theme -> `:root,[data-plx-theme],[data-plx-mode]`; both -> both; neither -> `:root`** | Same names and values; a grid re-declares 512 variables, not 5,737. A ThemeZone re-resolves theme tokens even with no density above it. Generated, so no token file changes. | The assembler follows references (a small fixpoint). |
| B. Components read sys roles directly in their CSS (no comp indirection for density values) | No re-declaration at all | Rewrites hundreds of components and the tier rule (comp tokens are the components' API). |
| C. Keep as is; only shrink the bundle | No work here | The recalc cost stays (the main cause). |

## Decision

**Option A.**

- `scopesOf()` in `packages/tokens/sd/assemble.cjs`:
  - **Seeds:** every token declared in a density or interaction set (`layerOf() !== 'base'`) is density-dependent. Every token declared in a theme stylesheet (`platform/system/themes/`) is theme-dependent.
  - **Walk:** a token of a broad set is density-dependent or theme-dependent when its `$value` references such a token, until nothing changes. The walk goes through the broad sets' own tokens only, because a token declared on `:root` alone is computed there and is the same everywhere.
- **Blocks** for a broad set: `:root {…}` (neither), then `:root,[data-plx-density],[data-plx-interaction]{…}` (density), `:root,[data-plx-theme],[data-plx-mode]{…}` (theme) and the union (both). The layered `--plx-ctx-*` tokens keep the broad scope.
- **No token name, value or tier changes.** Each token is still declared once.

## Consequences

- **Semver: PATCH** (a performance fix). The public custom properties keep their names and values.
  - The one behavior change is a fix: a theme-dependent component token now re-resolves on every ThemeZone. Before, it did so only when the zone also carried a density.
  - A theme-only token no longer re-resolves on a bare density element, but its value there is the same: no theme value changes at a density element.
- `components.css`: the density scope drops from 5,737 declarations to 512 (with the layered `--plx-ctx-*` picks); the theme scope holds 2,345 and `:root` alone 2,879.
- A new density-dependent token is placed automatically; no file lists it.

## Enforced by

- `npm run tokens:sd:check` (`--bytes`: the stylesheets from Style Dictionary equal the JSON's own) and `style-dictionary/build.mjs --stale` (check-system, rule `generated`).
- The diff check for this change: every token keeps its name and value, and is declared once (#1188 evidence).
- Planned: the release architect's perf budget on #1188 caps the declarations in the density scope, so a regression fails CI.
