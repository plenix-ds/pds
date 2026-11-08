### Added

- `DataGrid` `columns[].lines` (1 to 4): the cell shows that many lines, then an ellipsis, and implies `wrap`. The grid uses the smallest row-height step whose rows hold the most lines asked for, measured from the row-height and line-height tokens at the current density; the app's `rowHeight` or the person's choice wins when taller. A value outside 1 to 4 warns in development and is clamped.
- `DataGrid` `columns[].overflow` (`"tooltip"` or `"none"`): the full text in a Tooltip on pointer hover and on keyboard focus of the cell, only while the text is cut. It is the default for a wrapping column; `"none"` opts out (ADR 0043, D-0133, #1044).

### Fixed

- A `Tooltip` around a grid cell's content takes the cell's width, so the text can truncate with an ellipsis instead of growing past the cell.
