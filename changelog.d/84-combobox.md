### Added

- DataGrid: the `combobox` cell editor (ADR 0016, #84 phase 2), turned on with `editing={{ types: ['combobox'] }}` and `editor: 'combobox'` plus `editorProps: { options }` or `{ loadOptions(text) }` on a column. Plenix's Combobox opens in the cell, bare, with its list open; typing filters (or loads), choosing an option saves it at once; with the list closed Enter saves the current value; the first Escape closes the list and the second cancels; Tab saves and moves. Without the type turned on, nothing changes.
