### Changed

- DataGrid Form Edit (#84 F4): the row being edited in a form becomes the open, marked row (`aria-current="true"`), and stays so after the form closes, as design form-edit.md §4 says. Only when the application does not control the open row with `openKey`.
