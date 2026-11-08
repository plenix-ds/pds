### Added

- `EntityHeader`: a fact in `facts[]` takes `tone` (`negative` or its alias `danger`, the softer `action-required`, and the other Status tones) and is drawn as a status tile in that tone, with or without an icon; an icon takes the tone's text colour. Use it to flag a missing required value, with an `invalid` `EntityPicker` or `Select` inside the tile. No new tokens (#990, D-0118, D-0120).
