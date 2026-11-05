### Added

- DataGrid: the `textarea` cell editor (ADR 0016, #84 phase 2), turned on with `editing={{ types: ['textarea'] }}` and `editor: 'textarea'` on a column. The cell shows the value's first line; a box under the cell holds a text area for the whole value, which grows to 8 lines and then scrolls. Enter adds a line, Ctrl or Command with Enter saves, Escape cancels, a click outside saves, Tab saves and moves. A message from `validate` shows under the text. Without the type turned on, nothing changes.
