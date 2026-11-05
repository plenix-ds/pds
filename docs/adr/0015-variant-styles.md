# ADR 0015: Each variation documents the styling properties it sets

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), on the owner's model in #116 ("each variation should document its styling properties independently; not to be confused with themes") and the Design Director's G2 answer on #116
- **Builds on:** ADR 0013 (variant records, side tables)

## Context

- There are 1,189 variant records (ADR 0013); 1,129 have lab props (`{ variant: 'primary' }`, `{ size: 'sm' }` …).
- G2: a variation lists **only what it sets**, meaning a declaration in a rule of its own selector: its modifier, data attribute or state. It's listed even when the value equals the base's. Everything else "comes from the base", and the page links to the Base table. A variant × state pair lists what its combined selector sets. Themes stay apart (values only).
- Measured: 661 of the 1,129 match a modifier or `data-plx-*` rule by loose matching. Some items style variations another way (`icon {variant:'outline'}` picks a different glyph set, `avatar {size:'2xl'}` a class built from a number), so not every variation can be derived from CSS.

## Options

| Option | For | Against |
|---|---|---|
| **A. Derive from the CSS where the variation's selector is found; a hand-written `styles.json` side table for the rest; a coverage report** | Exact for the derived part (it reads the real rules); the hand-written part is small and checked; the gap is visible and shrinks | Two sources (derived first, the side table wins) |
| B. Hand-write every variation's table | One source | About 1,100 tables, which drift from the CSS the day they're written |
| C. Derive only, and drop what can't be derived | No hand work | Hundreds of variations without a table; the owner's ask unmet |

## Decision

**Option A.**

- **Derivation** (`tools/variant-styles.js`, with PostCSS, already a dependency):
  - The item's block is its `src` stylesheet's `.plx-<block>`.
  - A variation's selector is, for each lab prop `k: v`, `.plx-<block>--<v>` (a modifier on the block or one of its parts) or `[data-plx-<k>="<v>"]` on the block. A state variation (group "State") is `:hover`, `:focus-visible`, `:active`, `[aria-disabled]` / `:disabled`, or `.is-<state>`, on the block or its parts.
  - Every declaration in a rule whose selector contains the variation's selector is a row: `{ property, part, value, tokens }`. `part` is the BEM element (`__icon`) or the block. `tokens` is the chain from each `var(--plx-…)`, resolved through the token index (`--plx-comp-button-primary-background -> --plx-sys-action-primary-background -> blue-600`).
  - Rules under `@media (forced-colors …)`, print or reduced motion are tagged with that condition; they're not themes.
- **The side table** (`platform/standards/variants/styles.json`, ADR 0013): `{ "<variant id>": { "sets": [{ property, part, token }] , "why"?: "…" } }`. It wins over a derived entry. It's for variations whose styling isn't a selector the derivation reads.
- **Coverage:** check-system rule `variant-styles` reports how many variations are derived, hand-written, or neither. "Neither" is a shrink-only baseline: a new variation must have one or the other.
- **API (addition):** each record in `/api/v1/variants.json` gains `sets` (the rows) and `setsSource` (`"css"` or `"table"`).
- **Spec:** the variation page shows "This variation sets" (property · part · token chain), then "Everything else comes from the base", linking to the Base table.

## Consequences

- **Semver: MINOR** (a new API field).
- The derived tables follow the CSS automatically; a CSS change can't make them stale.
- Writing the side table for the uncovered variations is follow-up work, per component, shrinking the baseline. It's the Component Engineers' and the Technical Writer's, with the DS Architect reviewing the token chains.

## Enforced by

- check-system `variant-styles`: every side-table key is a variant id (ADR 0013); every token it names exists; "neither" only shrinks.
- The API contract test for `variants.json` (`sets`, `setsSource`).
