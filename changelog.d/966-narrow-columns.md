### Changed (visual)

- DataGrid: a narrow column ("#", short ids, 1-digit numbers, single pills: under 80px by content) is as wide as its content plus the cell padding, at least 32px, and takes no share of the spare room, which goes to the other columns. Its options button no longer reserves width: it overlays at the header's inline end on hover, on keyboard focus and while its menu is open (touch keeps the reserve). A column with a set `width` or `minWidth` is unchanged (D-0108, #966).
