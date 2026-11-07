# Evidence: #800 column sizing and row actions

Built in #811 (sizing, AC-1 to AC-4, AC-6 to AC-8), #835 (url case) and #844 (AC-5, hover icon actions). Test output is in `evidence/`: `red.txt` and the green runs of `tests/data-grid-column-fit-800.test.js` (`green-url.txt`), `red-ac5.txt` and `green-ac5.txt` of `tests/data-grid-row-actions-inline-800.test.js`, and the regression runs (`regression-ac5.txt`).

- **AC-1** Ran: the owner's case grid at 1,600px, no compact column ends in an ellipsis (`data-grid-column-fit-800`, LTR and RTL).
- **AC-2** Ran: a set width is a minimum; "Reason for divorce" is wider than its set width where its widest value needs it (same test).
- **AC-3** Ran: spare room is shared evenly in whole grid steps across the columns that size themselves; cells start at the start edge (same test).
- **AC-4** Ran: the selection column keeps its width from 900 to 1,900px (same test).
- **AC-5** Ran: with room the first three icon items of `rowMenu` are icon buttons at the inline end, hidden at rest and shown on hover, focus in the row and selection; the ⋮ stays only for the rest; danger never inline; narrow and touch keep only the ⋮; the arrows move between the icons (`data-grid-row-actions-inline-800`, LTR and RTL; `green-ac5.txt`).
- **Actions column at the end** Ran: a `kind: "actions"` column (CTM's Actions with two xs Buttons) ends within a cell padding of the grid's inline-end edge, is the last column and keeps its natural width, LTR and RTL (`data-grid-actions-end-844`, `green-actions-end.txt`; RED `red-actions-end.txt`).
- **AC-6** Ran: with a summary column and too little room only the summary is cut; a `url` column gives way first too (`data-grid-column-fit-800`, `green-url.txt`).
- **AC-7** Ran: every sizing and row-action test above runs in LTR and in RTL.
- **AC-8** Ran: sizing reads the rows of the current view; fitting a column of a 10,000-row virtualized grid takes 2 ms (`data-grid-column-autofit-815`, AC-7 of that slice).
