# ADR 0004: State layer tokens and confirm on destructive commands

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect, on the G2 design of pds1-design-director (D-0037, #109)
- **Design:** `docs/pds1/slices/109-state-layers/design.md` (PR #227)

## Context

- The owner chose Fluent 2 state layers on 2026-10-24 (#109, decision 3): one see-through layer over any fill, 8% hover, 10% pressed and focus.
- The layer is drawn as `color-mix(in srgb, <color> <amount>, transparent)`. The amount is a percentage. The existing `plx-ref.opacity-*` steps are decimals (0.3) with their value in their name (check 7 baseline), so they can't be reused.
- The owner's rule: no new colors. The layer reuses existing text colors.
- The design adds a public prop: `actions[].confirm` on CommandBar and BarActions.

## Options

| Option | For | Against |
|---|---|---|
| **A. Two new `plx-ref` mix amounts named by step, five `plx-sys` roles** | No new colors; names pass checks 6 and 7; one place to tune the layer | Two more ref steps |
| B. `plx-ref.opacity-8` / `opacity-10`, as the design wrote them | Matches the design text | Fails check 7 (the value is in the name) |
| C. See-through palette colors (`color-*-alpha-8`) | No color-mix | New colors, against the owner's rule (the design's option B) |

## Decision

**Option A.**

**Tokens (all additions):**

| Token | Tier | Value | Use |
|---|---|---|---|
| `plx-ref.mix-amount-xs` | ref | `8%` | a color-mix amount step |
| `plx-ref.mix-amount-sm` | ref | `10%` | a color-mix amount step |
| `plx-sys.state-layer-hover-opacity` | sys | `{plx-ref.mix-amount-xs}` | the layer on hover |
| `plx-sys.state-layer-pressed-opacity` | sys | `{plx-ref.mix-amount-sm}` | the layer while pressed |
| `plx-sys.state-layer-focus-opacity` | sys | `{plx-ref.mix-amount-sm}` | the layer on keyboard focus |
| `plx-sys.state-layer-color` | sys (light, dark) | `{plx-sys.content-default}` | the layer on neutral, subtle and outline fills |
| `plx-sys.state-layer-on-accent-color` | sys (light, dark) | `{plx-sys.action-primary-content}` | the layer on primary and danger fills |

- The color roles live in the light and dark theme files, so a region with its own mode gets its own layer color.
- Components pick the color through their own `plx-comp` token (as `button-primary-state-layer-color -> plx-sys.state-layer-on-accent-color`). A component never points at `plx-ref.mix-amount-*`.
- In forced colors, components draw no layer; the system colors show the state.

**Prop (addition):** `actions[].confirm?: { title: string; body?: string; confirmLabel: string }` on `CommandBar` and `BarActions`.

- When set, the command opens the existing destructive `Dialog`. It doesn't run until the user confirms.
- Focus starts on Cancel, Esc cancels, and focus returns to the command. A command folded into More confirms the same way.
- All three strings come from the catalog (EN and AR). The Technical Writer owns the wording.

## Addendum (2026-11-05, #424): the words built from the command (D-0060)

- `confirm` gains optional fields so the catalog builds the words (the Technical Writer's #414 wording), as DeleteFlow already does:

```ts
actions[].confirm?: {
  title?: string; body?: string; confirmLabel?: string;   // the application's own words win
  name?: string;                                          // title "{verb} {name}?"
  count?: number; plural?: string;                        // title "{verb} {count} {plural}?"
  consequence?: string;                                   // the body
  permanent?: boolean;                                    // adds "This cannot be undone."
}
```

- `title` and `confirmLabel` become optional: a missing one comes from the catalog's `confirmAction` strings, with the command's label as `{verb}`.
- `name`, `plural` and `consequence` are the application's words, already in the page's language (Arabic plural forms included). The bar supplies no nouns.
- `confirm: {}` is valid: the title is "{verb}?" and the confirm button repeats the verb.
- **Semver: MINOR** (optional fields on a new optional prop).
- Enforced by: G3 review of #424 (the API diff matches this shape); the #424 behavior tests; locale checks (`confirmAction` in `en.js`, no unapproved Arabic).

## Consequences

- **Semver: MINOR.** 7 new tokens and 1 new optional prop. Nothing is removed or renamed.
- The design file names `plx-ref.opacity-8/10`. This ADR replaces those two names with `mix-amount-xs/sm`. The `plx-sys` names are as designed.
- The build (Component Engineer) uses only the `plx-sys.state-layer-*` roles, through `plx-comp` tokens.

## Enforced by

- Check 6 `token-tiers` and check 7 `token-names` (check-system): the new tokens add no finding.
- `planned:changeset-required`: the token PR and the component PR each carry a changelog entry (`changelog.d/`).
- G3 review of the CommandBar PR: the prop shape matches this ADR.
