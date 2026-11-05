# ADR 0007: `data-color-purple` is renamed `data-color-slate`

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect, on pds1-design-director's call (D-0039, #235)
- **Supersedes:** the purple row of ADR 0005

## Context

- `plx-sys.data-color-purple`, `-soft` and `-on-soft` are blue-650, blue-100 and blue-900 in both modes: a slate blue. The name lies (plan §3).
- D-0004 keeps the look. The Design Director chose to rename the roles, not to recolor them (D-0039, option B). A true purple is the owner's call (option A on #235).
- ADR 0005 gave `data-color-purple-on-surface` purple-300 in dark, which switches hue between modes.

## Options

| Option | For | Against |
|---|---|---|
| **A. Rename to `data-color-slate*`; old names stay as deprecated aliases until 2.0.0** | Names match the look; nothing breaks (CTM, dynamic `data-color-<hue>` names) | 4 aliases per mode until 2.0.0 |
| B. Rename with no aliases | Smaller CSS | Breaks readers on upgrade (MAJOR) |

## Decision

**Option A.**

| New | Light | Dark | Old name (deprecated alias) |
|---|---|---|---|
| `plx-sys.data-color-slate` | blue-650 | blue-650 | `data-color-purple` |
| `plx-sys.data-color-slate-soft` | blue-100 | blue-100 | `data-color-purple-soft` |
| `plx-sys.data-color-slate-on-soft` | blue-900 | blue-900 | `data-color-purple-on-soft` |
| `plx-sys.data-color-slate-on-surface` | `{data-color-slate-on-soft}` | **slate-375** (4.81:1 on `surface-default`, 3.51:1 on `state-hover`) | `data-color-purple-on-surface` |

- Each old name is `{plx-sys.data-color-slate…}` with `$deprecated`, so the token page and the changelog show it.
- Readers move to slate: the EntityHeader and IconTile purple tile tokens, the dataviz series, MetricCard and EntityHeader CSS.
- The **hue value** `purple` (props such as EntityHeader `media.hue`, `data-plx-color="purple"`) is unchanged. It's public API, and `build-steps.js` builds `--plx-sys-data-color-<hue>` from it, which the alias keeps working. Renaming the hue value is a separate, later decision.

## Consequences

- **Semver: MINOR.** 4 tokens added and 4 deprecated, none removed. *Changed (visual):* the purple media icon in dark mode is slate-375, not purple-300. Nothing else looks different.
- 2.0.0 removes the four `data-color-purple*` aliases.

## Enforced by

- Check 6 `token-tiers`, check 7 `token-names`, `token-sets` (light and dark define the same roles).
- `$deprecated` on the four old tokens; the check-style `defined` rule keeps every reader on a defined token.
