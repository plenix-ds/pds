### Fixed

- DataGrid: a wide grid in a split view shows the table again, not the narrow card (#783, owner). The card switch weighed every column at the width of its whole title, so about 16 columns with ordinary titles "needed" more than 1,500px. When the whole-title floors do not fit, each column's floor now comes down to its minimum readable width (its `minWidth`, else the grid's minimum) and a title that no longer fits ends in an ellipsis; cards remain for a pane where even those minimums do not fit.
