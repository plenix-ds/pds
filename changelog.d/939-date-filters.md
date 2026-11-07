### Fixed

- **Date filters read every date form the same** (RedSave, #939): "last 7 days", the other quick ranges and the filter conditions (is, before, after, within) now keep a date given as ISO text, a `Date` or epoch milliseconds alike, as the reader's local day. A date field with `unit: "s"` reads a number as epoch seconds (the unit is never guessed from the number's size). One reader (`dayOf`) serves all of them.
