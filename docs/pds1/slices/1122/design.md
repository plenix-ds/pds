# #1122 Long text: a corner icon that shows the full text (G2)

- **Request:** the owner, chat, 2026-11-09 ~02:00 UTC: "a little corner icon that expands more to show full text or opens the full text in modal". Brief: the issue body (G1, pds1-product-lead).
- **Extends, no new component look:**
  - `Text` (`lines`, `expandable`): the measure that says "is it cut" (`scrollHeight > clientHeight`).
  - DataGrid `CutText` (#1044, ADR 0043): the cut-cell measure and its full-text Tooltip, which stay.
  - `Button` `variant="ghost" size="xs" iconOnly`: the existing inline-action role for dense row and card actions.
  - `Dialog` `size="md"`: the existing dialog, title, scroll body and footer (D-0102, no fill).
  - `PropertyList` tiles (D-0106, D-0132, ADR 0044/0045) and Panel / Card bodies.
- **Decision D-0140** (applied, owner may switch):
  - Clamping stays **opt-in**. A read-only value still wraps and is never cut by default (DESIGN.md §3). The corner icon appears only where an app sets a line count, and only while the text is cut.
  - `Text expandable` keeps its "Show more" button under the text for prose. The corner icon is the look for cut text in a **box**: a tile, a card or Panel body, and a grid cell.
  - Reply B on #1122 to switch either one (B1: read-only values clamp to 3 lines by default; B2: the corner icon replaces "Show more" everywhere).

## 1. What it is

| Part | Look |
|---|---|
| The button | `Button variant="ghost" size="xs" iconOnly`. Icon 16px, `currentColor`, `content-muted` at rest. No border or fill at rest (no icon in a box). Hover and press use the ghost button's own `state-hover` / `state-pressed` |
| Glyph | **Expand in place:** `chevron-down`; `chevron-up` while unfolded. **Opens a Dialog:** `expand` (the diagonal arrows, Material "open in full"). Neither mirrors in RTL (§6 of DESIGN.md: no direction) |
| Where, in a box (tile, card, Panel body, `Text` in corner mode) | The text and the button sit in a two-column grid, `1fr auto`, only while the text is cut or unfolded. The button is at the **inline-end, block-end** corner, beside the last line where the ellipsis is. Gap `space-inline-xs` (4px). When the text fits there is no column and no button (D-0091). Narrowing the text can only cut it more, so the measure never flips back and forth |
| Where, in a DataGrid cell | The button **overlays** the cell's inline-end, vertically centred, on hover of the row and while the cell is the active cell, as the narrow-column header button does (DESIGN.md §8). Behind it, the cell's own background in its current state (row hover, selected), so the text under it is hidden, not overlapped. It reserves no width |
| Which behaviour | **In a box:** expand in place when the whole text is **12 lines or fewer**; else open the Dialog. **In a grid cell:** always the Dialog (a row never grows) |
| Threshold token | new sys `fit-expand-max-lines` = 12, next to `fit-lines` in `fit.tokens.json`. G3 names it; the engineer does not pick another number |
| Unfolded in place | The box grows to the whole text. The button stays at the block-end, inline-end corner, now beside the last line, with `chevron-up`. No motion beyond the height change, which uses `motion-duration-*` from the motion tokens and is instant under `prefers-reduced-motion` |
| The Dialog | `Dialog size="md"`. **Title:** the field's label (a tile's label, the grid column's header, or the `label` the app passes to `Text`). **Body:** the whole text in `body` (13px), `content-default`, wrapping, its line breaks kept (`white-space: pre-wrap`), scrolling inside the body with the hairline rule (D-0102). **Footer:** one `Close` button (secondary, at the end). The header X is there too (known icon, no tooltip, D-0091). No other actions. A data value keeps Reddit Mono and its Isolate rules |
| Name and keys | Accessible name **"Show full text: {label}"** (wording is the Technical Writer's). In place: `aria-expanded` and `aria-controls` the text, the name does not change. Dialog: `aria-haspopup="dialog"`. Focus returns to the button (in a grid: to the cell) on close |
| Tooltip | In place: none (it is the Expand / collapse chevron of the known set, D-0091). Dialog: the button's own Tooltip, "Show full text" (not in the known set). In a grid cell the text's full-text Tooltip (#1044) stays on the text; the button's Tooltip shows only on the button |
| Grid keyboard | The grid keeps one Tab stop. On an active, **not editable** cell whose text is cut, **F2** opens the Dialog (`aria-keyshortcuts="F2"` on the button). Enter keeps its grid meaning (open the row). An editable cell keeps F2 = edit; its editor already shows the whole value |
| Touch | The button shows on a tapped (active) cell; in a box it is always visible while cut. Its hit area is the `xs` button's, with the touch interaction tokens |

- **Where an app gets it:** `Text lines={n}` in corner mode, `PropertyList.Item` with a line count, a Card or Panel body that uses either, and a DataGrid column with `lines` or `truncate` (opt-in per column, as #1044). The prop names and the shared part (likely one `useCut` measure plus one `CutCorner` part) are G3's.

## 2. State matrix

| State | Corner button | Text (box) | Grid cell | Dialog |
|---|---|---|---|---|
| default | ghost xs: `content-muted` icon, no fill, no border | clamped, last line ends in an ellipsis | text cut, button hidden | n/a (closed) |
| hover | `state-hover` fill, `content-default` icon | n/a (static text) | row hover shows the button over the row's `state-hover` | n/a |
| focus | `:focus-visible` ring, `focus-ring-color`, 2px, 2px offset, inside the box's padding (the ring is never clipped) | n/a | the cell's own focus ring; the button shows while the cell is active | the first focus is the body (scrollable) or Close; trapped; returns on close |
| active | `state-pressed`, `motion-press-scale` | n/a | as the button | n/a |
| disabled | n/a (the button exists only while text is cut; a disabled field shows its whole text, as today) | n/a | n/a (a disabled grid shows no button) | n/a |
| loading | n/a (no button until the value has arrived and been measured) | the region's LoadingState (D-0130) | the grid's placeholder rows | n/a (the text is already in the page) |
| error | n/a (no input) | n/a | n/a | n/a |
| selected | n/a (not a toggle; unfolded is `aria-expanded`, shown by the chevron) | n/a | over a selected row the button's backing is `state-selected`, icon `selected-content` | n/a |
| empty | no button (nothing is cut) | the app's empty text, never blank (1043 §2) | an empty cell shows nothing (DESIGN.md §8) | n/a |
| long text | the button never wraps or shrinks; it is fixed size | 3× English: still clamped to its lines, one button; > 12 lines → Dialog | one line or `lines`, ellipsis, Dialog | the body scrolls; the title wraps to 2 lines then ends in an ellipsis (fit-and-overflow, headings row) |

## 3. Densities, light and dark, Arabic

- **Densities:** the button is `xs` at every density (its own density tokens). The grid overlay follows the row height (36 / 40 / 48px) and stays centred. Tile padding is 1043's.
- **Light and dark:** the icon is `content-muted` on the tile, card and row surfaces. It needs 3:1 (non-text, WCAG 1.4.11); `content-muted` is 4.5:1 or more on the surfaces in both themes (DESIGN.md §12, row 1), and the porcelain tile is measured in the specimen. Below 3:1 is a defect fixed with `content-default`, no owner question. The hover icon is `content-default`. Forced colours: the icon is `ButtonText`, the focus ring `Highlight`.
- **Arabic and RTL (text and direction change):**
  - The corner is the inline end: the left in RTL. The ellipsis is at the start-side end of the cut line (fit-and-overflow §RTL), so the button sits beside it in both directions.
  - The glyphs do not mirror.
  - New words: "Show full text: {label}", "Show full text" (Tooltip), "Close" (existing dialog key). The i18n Engineer proposes the Arabic on #1122; it is not written into `ar.js` before the owner approves (D-0012).

## 4. Edge cases

- **3× English:** the box clamps the same; the Dialog title wraps to 2 lines. At 1024×640 the Dialog body scrolls and nothing overlaps.
- **Text exactly at the line count:** not cut, no button.
- **One unbroken long word (an ID, a URL):** `overflow-wrap: anywhere` inside the clamp, so it is cut by lines, not sideways.
- **Width change:** measured again on resize (as `Text expandable` does today); the button appears or goes.
- **Unfolded, then the value changes:** it folds again and is measured anew.
- **Empty values:** no button.
- **10,000 rows:** only rendered rows measure (the grid virtualises); the button is drawn for the hovered row and the active cell only, never once per row. One Dialog instance for the grid.

## 5. Messages

- No new messages. The Dialog is not an error or result; it is content. Wording of the name and Tooltip is the Technical Writer's (`docs/content/messaging.md`).

## 6. Choices the engineer must not invent

- Opt-in only (D-0140): no clamp on a read-only value unless the app sets lines.
- The button is the ghost `xs` icon-only Button. No new button style, no box, no new colour.
- The glyphs: `chevron-down` / `chevron-up` in place, `expand` for the Dialog.
- The threshold: `fit-expand-max-lines` (12). Grid cells always use the Dialog.
- The placement: block-end, inline-end; a grid column `1fr auto` in a box, an overlay in a grid cell.
- The grid key: F2 on a non-editable cut cell. Enter stays the row's.
- The Dialog: `md`, the label as title, the body text kept with its line breaks, one Close.
- One measure for Text, PropertyList and DataGrid (G3 places it; CE2 point 1 on #1122).

## 7. Tests the build must have (red first)

- No button when the text fits; a button when cut; it goes after a widen that makes it fit.
- ≤ 12 lines: unfolds in place, `aria-expanded` toggles, focus stays on the button.
- > 12 lines: opens the Dialog titled with the label; Close returns focus.
- Grid: the button shows on row hover and on the active cell only; F2 opens the Dialog on a read-only cut cell; Enter still opens the row; F2 still edits an editable cell.
- RTL: the button is on the left; the glyph is not mirrored.
- Axe: the button's name is "Show full text: {label}".
- Visual specimens (check 12): `long-text-corner` (a tile, a card body, a grid row) in light and dark at standard, plus compact and RTL (text and direction change).

## 8. Evidence

- Ran: read DESIGN.md §3, §6, §8, §9; `platform/standards/fit-and-overflow.md`; `Text.tsx` (ExpandableText); `DataGrid/cells.tsx` (CutText); `Button.tsx` sizes; the icon set (`release/packages/icons/plenix/expand.svg`, `chevron-down`, `chevron-up`); ADR 0045; `docs/pds1/slices/1043/design.md`.
- Ran: searched the repo for an earlier spec of the corner icon: none (as the brief says).
- Planned: the specimens in §7 on the build PR (CI screenshots shared there).
- Manual: none.
