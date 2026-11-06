### Added

- ViewMenu (ADR 0016, #477 item 2): the optional `editModes` prop (`['inline', 'form']`) adds an "Editing" group (Inline Edit, Form Edit) to the page's View menu, held in `value.editMode`; pass it only when the table has an editable column. `useCollectionView`'s view carries `editMode` (remembered with the rest) and `tableProps` hands it to the DataGrid with `onViewChange` reporting back, so the page's menu and the grid's own view menu are one value. A DataGrid that has `onViewChange` now follows its `editMode` prop. Without `editModes` nothing appears.
