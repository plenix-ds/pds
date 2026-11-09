### Added
- DataGrid: `columns[].overflow="dialog"`. While the pointer is on a cut cell, or the cell is active, a small button at its inline end opens the whole text in a Dialog titled with the column title; F2 on the focused read-only cell does the same (Enter still opens the row; an editable cell keeps F2 = edit). The cut is measured on hover or focus only (#1122).
