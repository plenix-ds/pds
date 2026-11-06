### Fixed

- DataGrid (#161, DT-7): a column of `type: "date"` now reads a bare `"YYYY-MM-DD"`, a `Date` and a timestamp the same way, as the viewer's local calendar day. Before, in a time zone west of Greenwich a `Date` showed an empty cell, a timestamp its raw milliseconds and a bare date its raw text; sorting put a `Date` ahead of an earlier calendar day. The cell shows the formatted date, sorting is in time order (a bare date is its local midnight, an empty date sorts last), and day grouping puts a `Date` or a timestamp under its local day.
