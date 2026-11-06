# Evidence: #815 column autofit

All Ran: `node tests/data-grid-column-autofit-815.test.js` (LTR and RTL), output in `evidence/green.txt`; the failing run before the fix is `evidence/red.txt`. Regression runs in `evidence/regression.txt`.

- **AC-1** Ran: a widened status column goes back to the widest pill and "Abandonment" shows whole after a double-click (test: AC-1).
- **AC-2** Ran: the person chip shows whole, with its icon (test: AC-2).
- **AC-3** Ran: a header wider than its values is not cut (test: AC-3).
- **AC-4** Ran: Enter on the focused handle gives the double-click width (test: AC-4).
- **AC-5** Ran: the column menu's "Size all columns to fit" fits every column, same width as the double-click (test: AC-5). Sharing spare room per D-0087 is #811's rule and its test.
- **AC-6** Ran: the same tests run under `dir="rtl"` (the handle on the column's left edge).
- **AC-7** Ran: a 10,000-row virtualized grid fits a column in 2 ms (test: AC-7, under 50 ms); the fit reads layout only on the cells drawn, not on scroll.
