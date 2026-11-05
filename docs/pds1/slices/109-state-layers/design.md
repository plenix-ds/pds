# #109: Fluent 2 state layers and confirm on destructive commands (G2)

- **Decision:** D-0037 (applies D-0023 and the owner's #109 decision 3 of 2026-10-24). Owner may switch.
- **Already built and measured** (#109, 2026-10-29): 4px corners, 1px borders, all six variants' states, menus and command bar.
- **Open since 2026-10-29:** (1) state layers, (2) confirm before a destructive command in the command bar.

## 1. State layers

- One see-through layer over any fill. Hover 8%, pressed 10%, focus 10% (owner, 2026-10-24).
- **Applied (A):** the layer is an existing colour at opacity, so no new colour is added:
  `background-image: linear-gradient(color-mix(in srgb, var(--plx-sys-state-layer-color) var(--plx-sys-state-layer-hover-opacity), transparent) 0 0)` over the variant's own fill.
  - `plx-sys.state-layer-color` → `plx-sys.content-default` on neutral, subtle and outline fills, and `plx-sys.action-primary-content` (white) on primary and danger.
  - New mix amounts `plx-ref.mix-amount-xs` (8%) and `plx-ref.mix-amount-sm` (10%), not colours, as `plx-sys.state-layer-{hover,pressed,focus}-opacity`; on primary and danger the colour role is `plx-sys.state-layer-on-accent-color` (ADR 0004, #229).
- **B (reply B on #109):** new see-through palette colours instead (`plx-ref.color-*-alpha-8/10`). Not recommended, because of the "no new colours" rule.
- The glow (D-0023, #910) stays the rest image. The layer sits above it, and pressed stays flat (no shadow), as today.

| State | Tokens |
|---|---|
| default | the variant's fill, border and glow (unchanged) |
| hover | fill + layer at `state-layer-hover-opacity` (8%); border unchanged except secondary (`state-hover-border`) |
| focus | `:focus-visible`: fill + layer at 10% + the focus ring (unchanged: 2px, 2px offset) |
| active | fill + layer at 10%, `motion-press-scale`, no shadow |
| disabled | unchanged (gray fill, border and text; no layer) |
| loading | unchanged (keeps width and name; no layer while busy) |
| error | n/a (buttons have no error state) |
| selected | toggle buttons: `state-selected` fill, plus the layer on hover and press |
| empty | n/a (a button always has a name) |
| long text | unchanged (ellipsis, full name in the tooltip; fit-and-overflow.md) |

- Outline variants (tertiary, danger-secondary) stop filling solid on hover; they get the layer instead.
- Densities: none affected (colour only). Light and dark: the layer colour follows the theme's `content-default` and stays readable over every fill. The contrast check (check 8) covers text on the layered fill.
- Forced colours: the layer is dropped (system colours), as the state colours are today.

## 2. Confirm before a destructive command

- `actions[].confirm` on CommandBar and BarActions: `{ title, body, confirmLabel }`. The wording is the Technical Writer's (messaging.md). The confirm button uses the question's verb.
- It opens the existing destructive Dialog (`control-height-dialog-destructive`). Focus starts on Cancel, Esc cancels, and focus returns to the command.
- A command folded into More confirms the same way.

## Choices the engineer must not invent

- No new colour values. Only the two mix amounts above (ADR 0004).
- No layer on disabled or loading buttons. No change to the focus ring.
