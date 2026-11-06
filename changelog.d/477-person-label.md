### Fixed

- DataGrid (#477): a person column with only `loadOptions` shows the name of a person picked in the editor in its read cell, not the raw id; a person column with `editorProps.options` shows the name for each id. An id the grid has never seen still shows raw, so give `options` or `render` (the DataGrid docs say so).
