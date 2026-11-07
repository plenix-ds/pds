### Fixed

- DataGrid: in a fixed table (`isStatic`, `narrow="table"` or a list), the spare room is shared evenly across the columns that size themselves, as in the default grid. It went to the last one alone, so a short-valued column ("Years married") could take most of a wide grid (#800 AC-3, D-0087).
