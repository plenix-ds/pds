# #1122 Long text: a corner icon that shows the full text (G2)

- **Request:** the owner, chat, 2026-11-09 ~02:00 UTC: "a little corner icon that expands more to show full text or opens the full text in modal". Brief: the issue body (G1, pds1-product-lead).
- **API (G3):** ADR 0047, D-0140 (PR #1124): `overflow="dialog"` on `Text` (with `overflowLabel`), on `PropertyList.Item` (with `lines` 2 to 4), and on DataGrid `columns[].overflow`. One internal part, `FullTextAction`, and one measure, `isCut`. This file sets the look and the states; it does not rename anything.
- **Extends, no new component look:**
  - `Button` icon only at `size="2xs"`, ghost (no border or fill at rest).
  - `Dialog` `size="md"`: the existing title, scrolling body and Close (D-0102, no fill).
  - DataGrid `CutText` (#1044, ADR 0043): its full-text Tooltip stays for `overflow="tooltip"`.
  - `PropertyList` tiles (D-0106, D-0132, ADR 0044/0045), and Panel and Card bodies.
- **Decision D-0141** (G2, applied, owner may switch):
  - **One behaviour in 1.4.0: the corner icon opens the full text in a Dialog**, everywhere. The issue allows one behaviour, and ADR 0047 reserves `"expand"` (in-place) as a later minor. In-place expansion is not built now.
  - Clamping stays **opt-in**: a read-only value still wraps and is never cut unless the app sets `lines` (DESIGN.md §3).
  - `Text expandable` keeps its "Show more" button under prose. The corner icon is for cut text in a **box**: a tile, a card or Panel body, a grid cell.
  - Reply on #1122 to switch: **B1** short text unfolds in place (adds `"expand"`), **B2** read-only values clamp to 3 lines by default, **B3** the corner icon replaces "Show more" everywhere.

## 1. What it is

| Part | Look |
|---|---|
| The button | `Button` ghost, `size="2xs"`, icon only. Icon `currentColor`, `content-muted` at rest, `content-default` on hover. No border or fill at rest (no icon in a box). Hover and press use the ghost button's own `state-hover` / `state-pressed` |
| Glyph | `expand` (the diagonal arrows, Material "open in full"). It does not mirror in RTL (no direction, DESIGN.md §6) |
| Where, in a box (`Text`, `PropertyList.Item`, a card or Panel body) | The text and the button sit in a two-column grid, `1fr auto`, only while the text is cut. The button is at the **inline-end, block-end** corner, beside the last line where the ellipsis is. Gap: `plx-comp.text-full-action-gap` → `plx-sys.space-inline-xs` (4px), the one name ADR 0047 allows. When the text fits, there is no column and no button (D-0091). Narrowing only cuts more, so the measure never flips back and forth |
| Where, in a DataGrid cell | The button **overlays** the cell's inline end, centred in the row, on row hover and while the cell has focus, as the narrow-column header button does (DESIGN.md §8). Behind it is the cell's own background in its current state (row hover, selected), so the text under it is hidden, not overlapped: a backing box the button's size, filled with the row's current fill, `var(--plx-comp-data-grid-context-row-fill, var(--plx-comp-data-grid-background))` (the one variable the row sets for rest, hover, selected and selected + hover). The ghost button's own hover and press layers sit on top of it. Its inline position follows the cell's text direction (a cell is `dir="auto"`), so it stays beside the ellipsis (G2 on #1134). It reserves no width |
| The Dialog | `Dialog size="md"`. **Title:** the label (a tile's label, the column's `title`, `overflowLabel`), or "Full text" without one. **Body:** the whole text in `body` (13px), `content-default`, wrapping, its line breaks kept (`white-space: pre-wrap`), `dir="auto"`, scrolling inside the body with the hairline rule (D-0102). **Footer:** the Dialog's Close (secondary, at the end), plus the header X (known icon, no tooltip, D-0091). No other actions. A data value keeps Reddit Mono and its Isolate rules |
| Name | "Show full text: {label}", or "Show full text" without a label (`text.fullTextOf`, `text.fullText`). `aria-haspopup="dialog"`. Focus returns to the button on close (in a grid: to the cell) |
| Tooltip | The button shows its own Tooltip, "Show full text" (it is not in the known set, D-0091). In a grid cell with `"dialog"` the text has no Tooltip of its own (`"dialog"` and `"tooltip"` don't combine, ADR 0047) |
| Grid keyboard | The grid keeps one Tab stop, and it has no key today that enters a cell's controls (`engine/keys.ts`). So: on a focused, **not editable** cell whose text is cut, **F2** opens the Dialog (`aria-keyshortcuts="F2"` on the button), as F2 opens the cell's content in an editable one. Enter keeps its grid meaning (choose and open the row). An editable cell keeps F2 = edit; its editor already shows the whole value |
| Touch | In a box, the button is always visible while cut. In a grid it shows on the tapped (focused) cell. Its hit area follows the touch interaction tokens |

## 2. State matrix

| State | Corner button | Text (box) | Grid cell | Dialog |
|---|---|---|---|---|
| default | ghost 2xs: `content-muted` icon, no fill, no border | clamped, last line ends in an ellipsis | text cut, button hidden | n/a (closed) |
| hover | `state-hover` fill, `content-default` icon | n/a (static text) | row hover shows the button over the row's `state-hover` | n/a |
| focus | `:focus-visible` ring, `focus-ring-color`, 2px, 2px offset, inside the box's padding (the ring is never clipped) | n/a | the cell's own focus ring; the button shows while the cell is active | the first focus is the body (scrollable) or Close; trapped; returns on close |
| active | `state-pressed`, `motion-press-scale` | n/a | as the button | n/a |
| disabled | n/a (the button exists only while text is cut; a disabled field shows its whole text, as today) | n/a | n/a (a disabled grid shows no button) | n/a |
| loading | n/a (no button until the value has arrived and been measured) | the region's LoadingState (D-0130) | the grid's placeholder rows | n/a (the text is already in the page) |
| error | n/a (no input) | n/a | n/a | n/a |
| selected | n/a (not a toggle; it opens a Dialog) | n/a | over a selected row the backing is the row's selected fill (`data-grid-row-selected-background`, selected + hover: `data-grid-row-selected-hover-background`); the icon stays `content-muted`, as the row's text keeps its colour (`data-grid-row-selected-color` = currentcolor). Ran: `content-muted` on the selected fills is 6.21 / 5.20:1 light, 9.39:1 dark | n/a |
| empty | no button (nothing is cut) | the app's empty text, never blank (1043 §2) | an empty cell shows nothing (DESIGN.md §8) | n/a |
| long text | the button never wraps or shrinks; it is fixed size | 3× English: still clamped to its lines, one button, the Dialog | one line or `lines`, ellipsis, Dialog | the body scrolls; the title wraps to 2 lines then ends in an ellipsis (fit-and-overflow, headings row) |

## 3. Densities, light and dark, Arabic

- **Densities:** the button is `2xs` at every density (its own density tokens). The grid overlay follows the row height (36 / 40 / 48px) and stays centred. Tile padding is 1043's.
- **Light and dark:** the icon is `content-muted` on the tile, card and row surfaces. It needs 3:1 (non-text, WCAG 1.4.11); `content-muted` is 4.5:1 or more on the surfaces in both themes (DESIGN.md §12, row 1), and the porcelain tile is measured in the specimen. Below 3:1 is a defect fixed with `content-default`, no owner question. The hover icon is `content-default`. Forced colours: the icon is `ButtonText`, the focus ring `Highlight`.
- **Arabic and RTL (text and direction change):**
  - The corner is the inline end: the left in RTL. The ellipsis is at the start-side end of the cut line (fit-and-overflow §RTL), so the button sits beside it in both directions.
  - The glyph does not mirror.
  - Words: ADR 0047's keys `text.fullText`, `text.fullTextOf`, `text.fullTextTitle`, and the existing `dialog.close`. The i18n Engineer's Arabic is on #1122 (reused, owner-approved terms).

## 4. Edge cases

- **3× English:** the box clamps the same; the Dialog title wraps to 2 lines. At 1024×640 the Dialog body scrolls and nothing overlaps.
- **Text exactly at the line count:** not cut, no button.
- **One unbroken long word (an ID, a URL):** `overflow-wrap: anywhere` inside the clamp, so it is cut by lines, not sideways.
- **Width change:** measured again on resize (as `Text expandable` does today); the button appears or goes.
- **The value changes while the Dialog is open:** the Dialog shows the new value; after close the text is measured anew.
- **Empty values:** no button.
- **10,000 rows:** only rendered rows measure (the grid virtualises); the button is drawn for the hovered row and the active cell only, never once per row. One Dialog instance for the grid.

## 5. Messages

- No new messages. The Dialog is not an error or result; it is content. Wording of the name and Tooltip is the Technical Writer's (`docs/content/messaging.md`).

## 6. Choices the engineer must not invent

- Opt-in only (D-0141): no clamp on a read-only value unless the app sets `lines`.
- One behaviour: the Dialog. No in-place expansion until `"expand"` is added by its own entry.
- The button is the ghost `2xs` icon-only Button. No new button style, no box, no new colour.
- The glyph: `expand`.
- The gap: `plx-comp.text-full-action-gap` → `plx-sys.space-inline-xs`. No other new token.
- The placement: block-end, inline-end; a grid column `1fr auto` in a box, an overlay in a grid cell.
- The grid key: F2 on a non-editable cut cell. Enter stays the row's.
- The Dialog: `md`, the label as title, the body text kept with its line breaks, one Close.
- One measure, `isCut` (ADR 0047).

## 7. Tests the build must have (red first)

- No button when the text fits; a button when cut; it goes after a widen that makes it fit.
- Click, Enter and Space open the Dialog titled with the label ("Full text" without one); Close returns focus.
- The button sits at the block-end, inline-end corner beside the last line, 4px from the text.
- Grid: the button shows on row hover and on the active cell only; F2 opens the Dialog on a read-only cut cell; Enter still opens the row; F2 still edits an editable cell.
- RTL: the button is on the left; the glyph is not mirrored.
- Axe: the button's name is "Show full text: {label}".
- Visual specimens (check 12): `long-text-corner` (a tile, a card body, a grid row) in light and dark at standard, plus compact and RTL (text and direction change).

## 8. Evidence

- Ran: read DESIGN.md §3, §6, §8, §9; `platform/standards/fit-and-overflow.md`; `Text.tsx` (ExpandableText); `DataGrid/cells.tsx` (CutText); `Button.tsx` sizes; `DataGrid/engine/keys.ts` (no key enters a cell's controls); the icon set (`release/packages/icons/plenix/expand.svg`); ADR 0045; ADR 0047 (PR #1124); `docs/pds1/slices/1043/design.md`.
- Ran: searched the repo for an earlier spec of the corner icon: none (as the brief says).
- Planned: the specimens in §7 on the build PR (CI screenshots shared there).
- Manual: none.
