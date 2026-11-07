# ADR 0032: Tokens for the owner's read-only preset (tile, glow, label, group and card headings)

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on the owner's preset (D-0106) and G2's design (PR #967, D-0107). Decision D-0109 (owner may switch).
- **Issue:** #946 (S1)
- **Supersedes:** ADR 0030 on values. ADR 0030's names, its `layout` API and its 2.0.0 default flip stay.

## Context

- **The owner chose a preset (D-0106)** after iterating CTM's study (LighthouseCollection/CTM#216, the ★ preset). It replaces the Fluent 2 field (D-0101) that ADR 0030 tokenized.
  - Card heading: 14px bold uppercase, secondary ink, with its icon. A soft glow runs from the card top to the heading line, in the tile's tint. The divider is inset to the card padding.
  - Group heading: 13px medium, gold, sentence case, 40px above each group.
  - Field label: 11px regular, brand navy. Value: 13px semibold, secondary ink.
  - Each read-only field sits on a porcelain tile with a 1px border in a deeper shade of the same tint.
  - Label and value at least 4.5:1 on the tile, light and dark.
- **11px is under the 12px type floor** (check 3, rule `type-floor`). The owner kept it knowing that (D-0106). 13px and 14px are above the floor, so only the label needs an exception.
- **No existing ref is a warm neutral at the tile's lightness.** `gray-50` (#fcfcfc) is cool. `yellow-100` is yellow, and the owner said "not yellow". The palette is frozen (rule `token-definitions`).
- **Gold and navy exist:** `brown-600` (#765600) and `yellow-300` (#e8c34a) for gold; `blue-700` (#005a9e) and `blue-275` (#b2cbe9) for navy.
- **The study's gap between tiles is 16px.** ADR 0030 set `space-stack-field` to 20px.

## Options

| Option | For | Against |
|---|---|---|
| **A. Purpose-named sys roles; existing refs for gold, navy and ink; four new porcelain refs; one named type-floor exception** | Every level has one token. Names carry no values. Existing refs first. The exception is a list a check reads. | Four new palette colors and one sub-12px role. |
| B. Point comp tokens straight at the hex values | No new sys names | Breaks check 6 (no comp -> ref) and the frozen palette. |
| C. Use `gray-50` / `gray-200` for the tile | No new colors | Not the owner's warm tint (D-0106 rejects the neutral grey border). |

## Decision

**Option A** (D-0109; reply B or C on #946 to switch).

- **New refs** (`reference.tokens.json`, owner-approved under D-0106, recorded in `check-system.token-definitions.json`):
  - `color-porcelain-50` #fbfaf9 (tile, light) and `color-porcelain-200` #edebe8 (tile border, light).
  - `color-porcelain-800` #484847 (tile, dark) and `color-porcelain-750` #555350 (tile border, dark).
  - The dark values re-base the study's mix (tile + 12% warm) on Plenix's dark surface (#444444).
- **New sys color roles** (theme files, light / dark):
  - `read-only-tile`: porcelain-50 / porcelain-800.
  - `read-only-tile-border`: porcelain-200 / porcelain-750. In more contrast, `border-strong`.
  - `read-only-label`: blue-700 / blue-275.
  - `read-only-group-heading`: brown-600 / yellow-300.
  - `read-only-glow` (sys -> sys): `read-only-tile`. The gradient ends at `surface-default`.
- **Changed sys roles:**
  - `read-only-background` -> `read-only-tile`, and `read-only-border` -> `read-only-tile-border`. Read-only controls match the tiles.
  - `text-field-label-*`: `font-size-11`, regular, 16px line.
  - `text-field-value-*`: `font-size-200` (13px), semibold, 20px line.
  - `space-stack-field`: 16px (`space-4u`), every density.
- **New sys type and space roles:**
  - `text-group-heading-*`: 13px medium, 20px line.
  - `text-card-heading-*`: 14px bold, 20px line, `letter-spacing-caps`. Uppercase is the component's `text-transform`. Arabic keeps tracking 0 (G2).
  - `space-stack-group`: 40px (`space-10u`), every density.
- **Ink:** values and card headings use `content-default`. The inset divider uses `border-subtle`.
- **Type-floor exception:** `EXCEPTIONS` in `check-system.rules/type-floor.js` lists `plx-sys.text-field-label-font-size` -> D-0106, and nothing else. `tests/type-floor-206.test.js` reads the same list and fails if it grows.
  - `plx-ref.font-size-11` stays `$deprecated` for every other reader. It is not removed while D-0106 holds.
- **Comp tokens** (the build PR, comp -> sys only): PropertyList, the read-only Field, `PropertyGroup` and the Panel header point at the roles above.
- **API:** unchanged here. `layout` stays `"columns" | "stacked"`, default `"columns"` in 1.x (D-0107, ADR 0030). New props from the build PR (`PropertyGroup`, `columnCount`) need their own G3 entry on that PR.

## Consequences

- **Semver: MINOR.**
  - *Added:* the porcelain refs, `read-only-tile`, `read-only-tile-border`, `read-only-label`, `read-only-group-heading`, `read-only-glow`, `text-group-heading-*`, `text-card-heading-*` and `space-stack-group`.
  - *Changed:* the field label and value roles, `space-stack-field` (20px -> 16px), and the read-only control fill and border. These change looks within their roles; nothing is removed or renamed.
- The four colors are the second owner exception to the frozen palette, after gray 250.
- CTM picks the preset up on release, through `layout="stacked"`, which it already sets.

## Enforced by

- Check 3 (`check-system.rules/type-floor.js`) and `tests/type-floor-206.test.js`: only the listed exception is under 12px.
- Check 6 (`token-tiers`) and check 7 (`token-names`).
- Check 8 (`check-system.rules/contrast-matrix.js`): `read-only-label` on `read-only-tile`, `surface-default` and `surface-raised`; `content-default` on `read-only-tile`; and `read-only-group-heading` on the card surfaces, at 4.5:1 or more, light and dark.
- `check-system.rules/token-definitions.js`: the four porcelain refs, with their reason.
- The build PR: computed styles and the visual baselines at 1366 and 1920 (D-0106's planned check).
