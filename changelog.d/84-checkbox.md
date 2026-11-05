### Added

- DataGrid: the `checkbox` cell editor (ADR 0016, #84 phase 2), an option the application turns on with `editing={{ types: ['checkbox'] }}` and `editor: 'checkbox'` on a column. The cell shows a checkbox named after the column; Space on the cell or a click on the box toggles and saves at once through `onCellEdit` (no editor opens; Enter and F2 do nothing). A cell `editable()` refuses shows a disabled box. Without the type turned on, nothing changes.
