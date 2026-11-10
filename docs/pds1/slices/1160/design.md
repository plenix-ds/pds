# #1160 Light page background #e8e9ec (G2)

- **Request:** the owner (chat, 2026-11-10 11:58 UTC): "for the page background color.. change it to #e8e9ec". **D-0149.**
- **Change:** light `surface-canvas` changes from `gray-75` (#f7f7f8) to `gray-200` (#e8e9ec). That is an existing ref, so no new colour is needed. Dark is unchanged (D-0025).
- **Extends:** the page canvas (`system/base.css` `body`, AppShell, `theme-zone--canvas`) and the bars that sit on it: `command-bar-sticky-background`, `action-bar-background`, `image-editor-bar-background`, `scrim-inverse-background`.
- **Readings applied (D-0151, the owner may switch):**
  - **A. EntityHeader fact tiles keep today's fill (gray-75).** The owner named the page background. On gray-200, a fact tile's `border-subtle` border (also gray-200) disappears, and the tile would turn from near-white to grey. So `entity-header-fact-background` stops reading the canvas and reads a sys role at gray-75 (G3 names it; dark keeps its current value). Reply **B** to let the tiles follow the canvas.
  - **A pressed fill is visible on the canvas (a defect, fixed without asking).** `state-pressed` is gray-200, the new canvas itself, so a ghost Button pressed on the page or on a bar shows no fill (1.00:1). Light `state-pressed` becomes **gray-250** (#dcddde), the owner's allowed grey: 1.12:1 on the canvas and 1.36:1 on white (it was 1.21). Hover stays `state-hover` (gray-100). On the canvas it is 1.09:1, about the same step as before (1.04:1 on gray-75).

## 1. Contrast on the new canvas (light; check 8)

| Role | On gray-75 (before) | On gray-200 (after) |
|---|---|---|
| `content-strong` | 15.39 | 13.57 |
| `content-default` | 11.29 | 9.96 |
| `content-muted`, `content-subtle` | 6.64 | 5.86 |
| `content-link` | 6.04 | 5.33 |
| `content-link-visited` | 10.29 | 9.07 |
| `status-pill-*-text` (lowest: action-required) | 6.52 | 5.75 |
| `status-done` / `-online` (icon colour) | 5.01 | 4.42 (≥ 3:1 for an icon) |
| `status-not-started` / `-offline` (icon colour) | 4.76 | 4.20 (≥ 3:1 for an icon) |
| `focus-ring-color` | 4.46 | 3.94 (≥ 3:1) |
| `content-disabled` (exempt) | 2.99 | 2.63 |
| `surface-default` (cards) against the canvas | 1.07 | 1.21 |

- Every text role stays ≥ 4.5:1. The `status-*` presence colours are icon fills (statuses are Badges with their icon), so 3:1 applies, and they pass. They are never text on the canvas.
- **Open defect, listed in DESIGN §12 #11 (not caused by this change, but made worse by it):** a control that sits straight on the canvas (a bar field) has a `control-border` (gray-500) at 2.63:1, below the 3:1 boundary rule. It was already 2.99:1 on gray-75. `field-border` (gray-400) is 2.01:1. The fix is tracked separately, because it changes every control's border.
- Decorative roles on the canvas: `border-subtle` and `content-decorative` are now the canvas colour (1.00:1). They are exempt, but any line drawn in them directly on the page disappears. Reading A covers the one canvas-coloured tile.

## 2. State matrix (the canvas and what sits on it)

| State | Tokens |
|---|---|
| default | `surface-canvas` gray-200; text roles per §1 |
| hover | `state-hover` gray-100 (unchanged) |
| focus | `focus-ring-color`, 2px, 2px offset: 3.94:1 on the canvas |
| active | `state-pressed` gray-250 (was gray-200), plus `motion-press-scale` |
| disabled | `content-disabled` (exempt), unchanged |
| loading | Skeleton: base and highlight unchanged; it sits on cards. Directly on the canvas, `skeleton-highlight` (gray-75) shows lighter than the page, which is still a visible shimmer |
| error | `feedback-danger-*` on its own soft fill, unchanged |
| selected | `state-selected` blue-100 on the canvas: 1.06:1 plus `state-selected-border`, unchanged |
| empty | EmptyState sits on a card or the canvas; its text is `content-muted` (5.86:1) |
| long text | n/a (colour only) |

- **Densities:** n/a (colour only). **Dark:** unchanged. **Arabic:** n/a (no text or direction change). **Forced colours:** `Canvas`, unchanged.

## 3. Choices the engineer must not invent

- Light `surface-canvas` → `{plx-ref.color-gray-200}`. Dark is untouched.
- Light `state-pressed` → `{plx-ref.color-gray-250}`.
- `entity-header-fact-background` reads a sys role at gray-75 (G3 names it), not the canvas.
- Tests:
  - light `body` and AppShell background computes to #e8e9ec;
  - a pressed ghost Button on the canvas computes to #dcddde;
  - the EntityHeader fact tile stays #f7f7f8;
  - dark is unchanged.

## Pictures (light; the 1.5.0 CDN CSS with the canvas set)

- Before: `page-before.png`. After: `page-after.png`.
