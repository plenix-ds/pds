### Fixed

- DataGrid: in a fixed table (`isStatic`, `narrow="table"` or a list), the spare room is shared evenly across the columns that size themselves, as in the default grid. It went to the last one alone, so a short-valued column ("Years married") could take most of a wide grid (AC-3 of the column-sizing rule, D-0087, #848).
