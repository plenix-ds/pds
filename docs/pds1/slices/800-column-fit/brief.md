# Brief: DataGrid column sizing that uses the room (#800)

Owner: pds1-product-lead. Design: pds1-design-director (G2). API: pds1-ds-architect (G3, only if a column `kind` prop is added). Build: pds1-component-engineer 1 (the same engine as #783). Decision: D-0087 (owner).

## Goal

In a grid that has room, nothing that fits gets cut off. Names, numbers, dates, IDs, people and status pills always show in full. Only long text (summary, notes) truncates, and only when the room is really gone.

## Known, inferred, unknown

| | What |
|---|---|
| Known | The owner's screenshot (`owner-screenshot.png`): CTM's cases grid, about 1,600px wide, with 6 columns plus a row menu. "Reason for divorce" shows "Abandonm…" and "Status" shows "Op…", with room to spare. CTM sets no CSS. Today's rule (`DataGrid.tsx` 138–140): a column starts at its content **capped at its set width**, and spare room goes to the title only. Pills already equalize to the widest pill in the current view (`uniformPillWidths`, always on). |
| Inferred | The CTM columns carry set widths (for example 120px) that were meant as starting sizes, so the cap truncates the pills. |
| Unknown | None that blocks the build. Column kinds can be inferred from `type`, `cells`, `render` and the values; a `kind` override is P1. |

## P0

1. **Measure:** the grid's current inline size and its visible columns, recomputed on resize, column show or hide, data change, page change and filter change.
2. **Column kinds:** **compact** = number, currency, percent, id, date, date-time, person, name, tag, status, pill, boolean and short text (the widest value at most `long_text_threshold` characters). **Long** = the rest (summary, description, notes).
3. **Width = the widest item:** each compact column's width is max(header, widest rendered value in the current view, its set `width` used as a minimum) plus cell padding. Pills keep equal widths (the widest pill). An app's set `width` is a **minimum, never a cap**, for compact columns.
4. **Spare room is shared evenly** across the non-fixed columns. Cell content stays **left-aligned**, including numbers in compact columns, unless the column says `align`.
5. **First column = selection checkbox:** a fixed width that never grows or shrinks.
6. **Last column = actions:**
   - With room (every compact column fits at its width, plus room for the actions): the row actions are **icon-only buttons, right-aligned, shown on row hover and on focus within the row**, and keyboard reachable.
   - Without room: one **⋮ menu** column, fixed width, pinned to the inline-end edge.
7. **When it doesn't fit:** long-text columns shrink first (to their minimum, then truncate with an ellipsis and a tooltip with the full text), then compact columns drop to their readable minimum, and only then the cards (as #783 fixed). A compact value is never cut while a long-text column still has room to give.
8. A column the person resized keeps its width (as today).

## P1

- A column `kind: "compact" | "long"` override (G3), for when inference is wrong.
- The same rules for the static `Table`.

## P2

- Remember each column's measured width per saved view.

## Non-goals

- No change to row heights, wrapping or density.
- No new colors or tokens beyond the named widths (the checkbox and ⋮ column widths, and `long_text_threshold`, as tokens or constants per G3).
- No change to `narrow="table"` and `narrow="list"` (the escape hatches).

## Affected packages

`@plenix-ds/react` (DataGrid sizing), `@plenix-ds/styles` (the hover-actions column), `@plenix-ds/tokens` (fixed column widths, if they're new tokens).

## Acceptance

- **AC-1** Given the owner's case grid (6 columns: id, two people, a pill, a person, a status pill, plus the row menu) at 1,600px, when it renders, then "Abandonment" and "Open" show in full, with no ellipsis in any compact column.
- **AC-2** Given a compact column with `width: 120` whose widest value needs 180px, with room, when it renders, then it's at least 180px wide.
- **AC-3** Given spare room after every column fits, when it renders, then the extra is shared evenly across the non-fixed columns (equal added width, within 1px), and cell text starts at the column's start edge.
- **AC-4** Given a selection column, when the grid resizes from 600 to 2,000px, then the checkbox column's width doesn't change.
- **AC-5** Given row actions on a wide grid with room, when the pointer is over a row or focus is inside it, then the actions show as icon-only buttons at the row's inline end, and when it leaves they hide. On a grid without room, the last column is a fixed ⋮ at the inline end.
- **AC-6** Given a summary column and too little room, when it renders, then the summary truncates with an ellipsis and a full-text tooltip first, and the compact columns stay in full.
- **AC-7** Given `dir="rtl"`, when AC-1 to AC-6 run, then they hold, mirrored.
- **AC-8** Given a 10,000-row grid, when it measures, then sizing uses the current view's rows (the visible window plus the current page) and stays under the existing performance budget.

## Already implemented

`DataGrid.tsx` sizing (content start, capped at the set width; spare room to the title), equal pill widths (`uniformPillWidths`, always on), the row menu column, and the narrow switch (#783's fix).

## Anything unclear

None open. Kind inference has a stated default (P0 2), and a `kind` override is P1.
