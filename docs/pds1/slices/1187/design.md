# #1187 DataGrid and Table: every hovered row tints (G2)

- **Request:** the owner (via CTM3 - PM, 2026-11-10, CTM#310): "In the data grids, I need the hover as I go over any of the rows." Brief: issue #1187 (PM).
- **Extends:** the DataGrid row hover that exists today (`DataGrid.tsx` doc: "a hovered row tints gray 100 with its lines in gray 300"; `docs/integration/data-grid.md`). Only rows with `selectable`, `selectableRows` or `onRowClick` get it today. This is a defect against the spec: the look is unchanged, only where it applies.
- **Reading applied (D-0156, the owner may switch):** **A. Table tints too.** Table is `<DataGridEngine isStatic>` with the same row rules, and the owner asked for "any of the rows". Reply **B** to keep Table (static reference data) without a hover tint.

## 1. Look

- **Where:** every data row, `.plx-data-grid__grid-row`, on `:hover`, in DataGrid and Table. Group heads (`__group-*`), the header and the empty state are not data rows and do not change.
- **Fill and lines:** the existing hover tokens, nothing new:
  - fill `data-grid-row-hover-background` -> sys `data-grid-row-hover` (light gray-100, dark gray-900);
  - lines `data-grid-row-hover-line` -> sys `data-grid-row-hover-line` (light gray-300, dark gray-700).
- **Selected rows:** unchanged (blue 100, blue 200 when hovered, the 3px bar).
- **Card rows** (`--template`) and Narrow rows: the same as a selectable card row today: the fill tints and no line is drawn.
- **Cursor:** unchanged. The `cursor` rule stays on `__grid-selectable` (actionable rows only). A read-only row keeps the page's cursor.
- **Behavior:** none added. A read-only row takes no `tabIndex`, no focus ring, no `aria-selected` and no click handler. The tint is the only change.
- **Motion:** none added (the row tint has no transition today).

### Build rule (the engineer must not invent another)

- In `data-grid.css`, the three rules that draw the hover (`context-row-fill` and `-line`, the line `box-shadow` on a row that is not first, and the first row's `::after` line) match `.plx-data-grid__grid-row:hover` instead of `.plx-data-grid__grid-selectable:hover`, with the existing `:where(:not(.plx-data-grid__grid-selected))` guard kept.
- The `--template` rule follows the same selector change.
- `bodyRows.tsx` keeps adding `__grid-selectable` only to actionable rows (it still carries the cursor). No new class or token.

## 2. State matrix (a data row)

| State | Actionable row (select or open) | Read-only row (no action; Table) |
|---|---|---|
| default | unchanged: `data-grid-row` fill and line | unchanged |
| hover | unchanged: `data-grid-row-hover-background`, `-hover-line` | **new:** the same two tokens |
| focus | unchanged: the row focus ring | n/a (not focusable; no action) |
| active | unchanged | n/a (nothing to press) |
| disabled | n/a (rows have none) | n/a (rows have none) |
| loading | n/a in the row (the grid's own loading state) | same |
| error | n/a in the row (the app's Notice above the grid) | same |
| selected | unchanged: `data-grid-row-selected-background`, `-selected-hover-background` | n/a (not selectable) |
| empty (no rows) | the grid's empty state; nothing to hover | same |
| long text | the row tints at its full height, wrapped or cut; the cut-text Tooltip is unchanged | same |

- The actions column already shows on any hovered row (`:is(:hover, .plx-data-grid__grid-selected)`), so nothing changes there.

## 3. Densities, themes, Arabic

- **Densities:** colour only; compact, standard and comfortable are the same rule.
- **Light and dark:** the tokens are already used for actionable rows in both themes, so their text pairs are already checked (`contrast.test.js`). No new pair.
- **Arabic:** n/a (no text or direction change). The first-row line uses logical insets already.
- **Visual check:** light and dark at standard density, a hovered read-only DataGrid and a hovered Table row (D-0017).

## 4. Edge cases

- **3x English:** a wrapped row tints at its full height; a cut cell keeps its Tooltip.
- **Empty values:** an empty cell tints with its row.
- **10,000 rows:** CSS only; no listener or state per row. Virtual rows (`--virtual`) take the same rule.
- **Pointer leaves during scroll:** `:hover` follows the pointer; nothing is remembered.

## 5. Messages

- None. No new text.

## 6. Choices the engineer must not invent

- The selector change in §1 "Build rule"; no new class, token or JavaScript.
- No cursor, focus, `tabIndex`, `aria-*` or click change on read-only rows.
- Table tints (reading A).
- **Tests (test first):**
  - a read-only DataGrid row (no `onRowClick`, no selection) computes its background to the hover token on hover, light and dark;
  - a Table row does the same;
  - an actionable row's hover is unchanged, and a selected row's hover stays `-selected-hover-background`;
  - a read-only row has no `tabindex` and its cursor is not `pointer`;
  - LTR and RTL.
