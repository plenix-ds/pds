# ADR 0049: A softer border for the pink soft pill (a mix amount, no new colour)

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's request (chat, 2026-11-10 11:47 UTC, #1155) and D-0147 (A: mix existing pinks, no new ref).
- **Issue:** #1155 (S3). G2 (`pds1-design-director`) picks the amount and shows the pill before and after, light and dark. This entry owns the names and the tiers.

## Context

- `DataPill gender="female"` uses the hue `pink`. `.plx-data-pill--soft` draws its 1px border from `--plx-comp-category-soft-border`, which `[data-plx-category="pink"]` (`platform/system/steps.css`) sets from `plx-sys.category-pink-soft-border`.
- **The border is `plx-ref.color-pink-700`** (#6c3b4f), the same shade as the text, in light and dark (`theme-default.{light,dark}.tokens.json`). The rule since 2026-10-16 is "the next darker same-family shade when the base and border coincide". Pink has no shade between 300 and 700, so the border jumps to the text colour. The intake's note that the border is pink-300 is not right: pink-300 is the solid fill (`category-pink`).
- Blue's border is `blue-300`, a light step, which is why the male pill reads calmer.
- The palette is frozen: a new pink shade is a new colour (option B of D-0147, owner OK needed).
- Tokens never hold `color-mix()`. Mixes are written in the CSS rule from amount tokens (ADR 0004, ADR 0036).

## Options

| Option | For | Against |
|---|---|---|
| **A. A per-hue amount `category-<hue>-soft-border-amount`, published as `--plx-comp-category-soft-border-amount`; the soft pill's border mixes the border toward its soft fill by that amount. Only pink sets less than full** | No new colour. One rule for every hue; the other 20 hues give exactly today's colour. | One new published context value, one new amount ref (100%). |
| B. Point `category-pink-soft-border` at `pink-300` | One-line change | The border then equals the solid fill and is bright pink: the opposite of "softer dark". |
| C. A new ref `color-pink-400` | Exact shade | A new colour (needs the owner; D-0147 B). |

## Decision

**Option A** (D-0147 applied A; reply B on #1155 for a new ref shade).

### Tokens

- **New ref (an amount, not a colour):** `mix-amount-full` 100%, beside `mix-amount-none` (0%). Plus at most one new `mix-amount-*` step if G2's amount is not an existing step (0, 5, 8, 10, 35%). Its name is a step, never a number (check 7).
- **New sys role, both theme files:** `category-pink-soft-border-amount` -> the `mix-amount-*` ref G2 picks (the share of pink-700 kept; the rest is the pill's `-soft` fill, pink-100). Light and dark may differ.
- **New sys role, `semantic.tokens.json`:** `category-soft-border-amount` -> `{plx-ref.mix-amount-full}`: the default for every other hue.
- **Published context value** (`steps.css`): every `[data-plx-category]` rule gains `--plx-comp-category-soft-border-amount`. Pink reads `--plx-sys-category-pink-soft-border-amount`; every other hue and slot reads `--plx-sys-category-soft-border-amount`. It is comp -> sys.
- **CSS (`data-pill.css`, `.plx-data-pill--soft`):** border colour is `color-mix(in srgb, var(--plx-comp-category-soft-border) var(--plx-comp-category-soft-border-amount), var(--plx-comp-category-soft))`. At 100% that is exactly the border colour of today.
- **Scope:** the DataPill soft border only (the owner's pill). `Tag` and the grouped `Timeline` keep their rules. G2 may extend it to `Tag` in the same PR; the token does not change.

### API

- No prop, export or class changes. The new CSS custom property `--plx-comp-category-soft-border-amount` is public (it is set on `[data-plx-category]`).

## Consequences

- **Semver: MINOR** (a new public custom property, new tokens). Visual change: the female soft pill's border, light and dark. Every other pill is pixel-identical.
- No deprecation.

## Enforced by

- G3 on the build PR: the token diff matches this entry.
- Check 6: the context value is comp -> sys; the amount roles are sys -> ref. Check 7: no values in the names.
- `token-definitions`: no new colour ref.
- Check 8 is not affected: the text (`-on-soft`) and fill do not change; a border is not text.
- The build PR's computed-style test: the female soft pill's border colour is the mix (not pink-700); a blue soft pill's border is unchanged.
