### Fixed

- Dark mode: the `MetricCard` footer note, ranks and day letters, and the `NavList` count read `content-muted` (they were `content-subtle`, 3.04:1 and 2.22:1 on the dark surfaces). A `MillerColumns` column that has no items (loading, failed, empty) is a group holding its status or message, not a listbox holding a status (axe aria-required-children, #1085).
