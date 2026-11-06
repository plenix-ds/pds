### Fixed

- DataGrid (#84, design §6): what was typed in a cell editor is no longer lost when the editing row scrolls out of the virtual window (10,000 rows) and back. The editor leaves with its row, nothing is saved or cancelled, and it comes back holding the typed text; Enter then saves it. The draft is cleared when the edit ends.
