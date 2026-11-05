### Added

- DataGrid: while editing (ADR 0016, #84 phase 1), Enter and Escape leave the focus on the cell, and Tab / Shift+Tab save and move the focus to the next / previous editable cell in reading order (mirrored in right to left; a column with no editor or a cell that is not editable is skipped; at the end of a row, on to the next row; at the last editable cell the focus stays). A value `validate` refuses keeps the cell open.
