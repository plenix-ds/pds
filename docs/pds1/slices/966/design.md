# #966 DataGrid: narrow columns fit their content; the header button overlays on hover (G2)

- **Request:** the owner, 2026-11-07. A "#" column of 1-digit pills is about 125px wide: "this is waste of space."
- **Extends:** the DataGrid column fit (D-0087, `docs/pds1/slices/800-column-fit/design.md`) and the header options button (`.plx-data-grid__grid-header-popup-button`). It reuses the icon column's existing **flush** header mode (`headerRows.tsx`, `titleFixed = 'flush'`), where the title reserves no room for the button.
- **Causes** (`engine/useGridMetrics.ts`). The engineer fixes all three. Fixing only the first leaves the column wide:
  1. The floor is `max(80px, header + 2 × cell padding)`, and the header includes `data-grid-title-reserve` for the options button (line 134).
  2. The 80px minimum is `metrics.min` (`plx-ref.size-20u`), used in the floor, in `least()` and in `useColumns.ts`/`useTableModel.ts`.
  3. Spare room is shared evenly across **every** self-sizing column, the "#" column included (line 276).

## 1. Which columns are narrow

- A column is **narrow** when its natural width is under 80px (`plx-ref.size-20u`). The natural width is `max(title text + its marks, widest value) + 2 × cell padding-inline`.
  - **Marks** are the type icon (when types show), the sort arrow slot when the column is sortable, and the filter funnel when the column is filtered.
- The test is measured. It is not a column kind or a prop. Typical narrow columns are "#", short IDs, 1–3 digit numbers, single pills and flags.
- A column the person sized, or one with an app `minWidth`, keeps that width (unchanged).
- `narrow="table"` and the row cards are unchanged.

## 2. Width of a narrow column

| | Before | Narrow column, after |
|---|---|---|
| Floor | `max(80, title + type icon + title-reserve + 2·pad)` | `max(32px, title text + marks, widest value) + 2·pad`, rounded up to 4px. **No title-reserve, no 80px** |
| Absolute minimum | 80px (`size-20u`) | **32px** (`plx-ref.size-8u`): the overlay button and a header target fit |
| Spare room | shared evenly with all columns | **none**. Spare room goes to the other self-sizing columns. If every column is narrow, it is shared evenly as before (no gap at the end, #844) |
| Squeezed | gives up room down to its floor | never squeezed below its floor (it is already at content) |
| Pills | share the column's widest pill width | unchanged; the widest pill counts as the widest value |

- **The sort arrow slot always counts** in a sortable narrow column, sorted or not, so sorting never changes the width. The slot is the arrow (`data-grid-sorter-inset` × 2) plus `data-grid-header-type-icon-gap`.
- **The filter funnel counts while the column is filtered.** The width may grow by the funnel when a filter is applied, because the funnel is the visible sign of the filter.
- Worked example (standard density, 8px padding): "#" (≈8px) + sort slot (12px) against a 1-digit pill (≈24px). The widest is 24 → 24 + 16 = 40px, against ≈125px today.

## 3. The header options button in a narrow column (pointer)

- **It reserves no room.** The title holder takes the existing flush mode (`--flush`: `holder-reserve` 0, `title-fixed` 0).
- **It overlays at the header's inline end** with the same geometry as today: full header height, its line before it (`data-grid-header-edge`) and its existing inset.
  - It is drawn above the title, so it covers the end of the title while shown.
  - Its fill is `data-grid-header-background`, so the covered title does not show through. On hover of the button itself, the existing gradient (`data-grid-menu-button-hover-top/-bottom`) applies.
- **Shown** while the header cell is hovered, while focus is on the header cell or its button (`:focus-within`), and while its menu is open. **Hidden** otherwise: opacity 0, still in the DOM and in the tab order.
- **Motion:** `opacity` only, over `data-grid-duration`. No `transition: all`. Under `prefers-reduced-motion`, the duration is 0 (reduced-motion tokens).
- **Sorted at rest:** the arrow shows in its slot (it is part of the floor). On hover, the button carries the direction, as today (owner, 2026-10-22).
- **Filtered at rest:** the funnel shows after the title. When the button is shown, it takes `data-grid-filtered-text`, as today.
- **Resize handle:** unchanged. The button never covers it; the existing inset keeps it clear.
- **Touch and no hover** (`@media (hover: none)`): narrow columns keep today's reserved button, because there is no hover to reveal it. The width rule in §2 then adds `data-grid-title-reserve`. The rest of the rule is unchanged.

## 4. State matrix (the options button in a narrow column)

| State | Tokens / behaviour |
|---|---|
| default | opacity 0; no reserved width; the sort arrow and funnel marks show in their slots |
| hover | header hovered: opacity 1, fill `data-grid-header-background`, chevron `data-grid-menu-chevron-text`; button hovered: + gradient `menu-button-hover-top/-bottom`, `data-grid-hover-text` |
| focus | header cell or button focused: opacity 1. The button has its existing focus ring, drawn inset so the next header doesn't clip it |
| active | the existing press (`press_scale` is not used on grid parts; unchanged) |
| disabled | n/a (`headerMenu={false}` or a static grid has no button and no reserve; the column is narrower by the same rule) |
| loading | n/a (headers render before rows; widths settle when the rows arrive, as today) |
| error | n/a (no input) |
| selected | menu open: opacity 1, the existing open state, until the menu closes |
| filtered | at rest the funnel mark shows. Shown, the button uses `data-grid-filtered-text` |
| empty | no values: the width is the title text + marks + padding, at least 32px |
| long text | n/a by definition: a long title makes the column not narrow, and the normal rule applies. A narrow title is never cut at rest |

## 5. Densities, themes, RTL

- **Densities:** the same rule. The cell padding-inline comes from the density, so compact gets narrower columns. The 32px minimum holds at every density.
- **Light and dark:** existing header tokens. No colour changes.
- **RTL:** the button sits at the inline end and mirrors (logical properties). The run covers LTR and RTL.

## 6. Edge cases

- **3× English titles:** such a column is not narrow, so today's rule applies.
- **A narrow column with a 3× pill label:** it becomes wider, by the pill rule.
- **Empty values:** see `empty`.
- **10,000 rows:** the widest value is measured over the rows the engine already measures for D-0087, which is unchanged. Virtualisation is unchanged.
- **Frozen narrow column:** the same rule. The overlay stays inside the frozen cell.

## 7. Choices the engineer must not invent

- The 80px threshold, the 32px minimum, the sort-slot rule, "no spare room" and the touch exception.
- Reuse the flush mode. Do not add a new reserve token.
- **Tests first** (#966):
  - a "#" column with 1-digit pills is `max(pill, "#" + sort slot) + 2·pad` wide (±2px), at 1366 and 1920;
  - it doesn't grow when the grid has spare room;
  - the menu opens by pointer and by keyboard;
  - sorting doesn't change the width;
  - RTL mirrors the button.

## 8. Messages

- None. The button's accessible name is unchanged.
