### Added

- DataGrid: `inline?: boolean` on a row menu item (`DataGridMenuAction`). `inline: false` keeps an item in the ⋮ menu; `inline: true` lets a fourth icon item show as an icon. A `danger` item is never an icon (ADR 0022, D-0090, #800).

### Changed (visual)

- DataGrid: with room, a grid's row actions show as icon-only buttons at the row's inline end, on row hover, focus inside the row and when the row is selected: the first three items of `rowMenu` that have an icon and are not `danger`, each named by its label. The ⋮ stays after them only when some action stays in the menu. Without room, or on touch, the ⋮ holds every action as before. Set `inline: false` on an item to keep the old look (#800 AC-5).

### Fixed

- DataGrid: a column with `kind: "actions"` keeps its natural width and sits at the grid's inline end with its content end-aligned (also in a right-to-left grid, where the cell's `dir="auto"` placed it at the wrong edge); the spare room goes to the columns before it, never to a gap after it (#844).
