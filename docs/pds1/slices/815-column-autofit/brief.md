# Brief: column autofit on double-click (#815)

Owner: pds1-product-lead. Build: pds1-component-engineer 1 (after #811, the same sizing code). Design: covered by D-0087 (no new look).

## Goal

Double-click the border on a column's end edge, and the column becomes exactly wide enough to show its header and every value in the current view in full, pills and people included, as in Excel.

## Known, inferred, unknown

| | What |
|---|---|
| Known | `engine/columnSizing.ts` `fit(field)` sizes by the canvas width of the raw text, plus `2 × cell space`. It's called from the resize handle's `onDoubleClick` (`headerRows.tsx` 306). No test. Excel, AG Grid and MUI X autofit on a double-click of the boundary after the column. |
| Inferred | Measuring the rendered cells in the current view gives the true width, at a cost of one layout read per fit. |
| Unknown | None. |

## P0

1. A double-click on a column's resize handle (the boundary at the column's **end** edge; in RTL that's the left side) sets the width to the maximum of: the rendered header (title, sort arrow, menu button and padding), and every **rendered** cell of that column in the current view (the visible rows plus the current page), measured from the DOM (`scrollWidth` of the cell content), so pills, chips, icons and formatters count. Rows outside the window use the canvas measure of the formatter's text, plus the column kind's chrome width.
2. It respects `minWidth` and `maxWidth`, and it counts as the person's size (it's kept, as with a drag).
3. **Keyboard:** with the resize handle focused, Enter fits (the same as the double-click), and its `aria-label` says so.
4. **Column menu:** "Fit column" and "Fit all columns". "Fit all" fits every resizable column, then D-0087 shares any room left.
5. It stays light: no new dependency, one read per fit, and no measuring while scrolling.

## P1

- A double-click on the header's last boundary (or "Fit all columns") fits all of them.

## Non-goals

- No change to the automatic sizing of #800 beyond calling it after "Fit all".
- No autofit of row heights.

## Affected packages

`@plenix-ds/react` (DataGrid). New catalog words "Fit column" and "Fit all columns", with Arabic per D-0078.

## Acceptance

- **AC-1** Given a status pill column at 80px with "Abandonment" in view, when its end-edge handle is double-clicked, then "Abandonment" shows in full with its pill padding, and the column isn't wider than the widest pill plus the cell space (±2px).
- **AC-2** Given a person column (icon + name chip), when fitted, then the widest name shows in full with its icon.
- **AC-3** Given a header wider than its values (sort arrow and menu), when fitted, then the header title isn't cut.
- **AC-4** Given the handle focused, when Enter is pressed, then the column fits (the same width as AC-1's double-click).
- **AC-5** Given the column menu, when "Fit all columns" is chosen, then every resizable column fits, and spare room is shared per D-0087.
- **AC-6** Given `dir="rtl"`, when the boundary after the column (on its left) is double-clicked, then that column fits.
- **AC-7** Given 10,000 rows, when a column is fitted, then it finishes in under 50 ms, with no layout read during scroll.

## Already implemented

`fit(field)` (text only) and the double-click hook on the handle.

## Anything unclear

None open.
