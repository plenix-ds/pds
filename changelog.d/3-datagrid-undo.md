### Added

- DataGrid: `editing.undo` turns on Ctrl+Z, Ctrl+Y and Cmd+Shift+Z for cell edits (#3, ADR 0021), one step per action, 100 steps, only inside the table. Every change reaches `onCellEdit` once per cell with a new optional `change.source` (`"edit"`, `"undo"` or `"redo"`; `"edit"` for typed edits, so existing apps see nothing new). Off by default. New words: "Edit undone" and "Edit redone" (Arabic to follow from the i18n Engineer).
