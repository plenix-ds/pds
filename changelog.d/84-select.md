### Added

- DataGrid: the `select` cell editor (ADR 0016, #84 phase 2), turned on with `editing={{ types: ['select'] }}` and `editor: 'select'` plus `editorProps: { options: [{ value, label }] }` on a column. Plenix's own Select opens in the cell with its list open, drawn bare through Input's context hooks (the cell's editing outline is the frame). Picking an option saves it at once; the first Escape closes the list and the second cancels; with the list closed Enter saves the current choice and Tab saves and moves. Without the type turned on, nothing changes.
