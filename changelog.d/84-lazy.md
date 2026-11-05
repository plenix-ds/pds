### Changed

- DataGrid: the cell editors other than the one-line text and number input (long text, select, date, combobox, tags, person and an application's own component) load on first use, in their own file, so a grid that edits only text and numbers does not carry Select, DatePicker, Combobox and EntityPicker. No behavior change (#84; the `{ DataGrid }` import budget).
