### Fixed

- Combobox with `chipOverflow="count"` and the DataGrid tags editor (#477, D-0065): the first chip never folds. A single tag in a narrow cell shows its chip (its text ends in an ellipsis) instead of "+1"; "+N" counts only the other tags. A Tag wider than the room it has now shrinks and ends its label in an ellipsis; its remove button keeps its size.
