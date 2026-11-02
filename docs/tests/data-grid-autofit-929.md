# data-grid-autofit-929

This test makes sure a data table fits its columns to the window and turns into cards (several lines per record) only when even its narrowest readable columns cannot fit.

- File: `tests/data-grid-autofit-929.test.js`

## What it checks
- Left to right and right to left:
  - AITEAM's Issues shape (seven columns of set widths) in a 760-pixel pane, and full width at 1024 and 768: a table, nothing scrolls sideways, no header is cut, and the table fills its width;
  - a St. John directory of six columns at 600: a table; at 390: cards;
  - a plain six-column grid at 600: a table; at 390: cards;
  - the columns size to their content first: at 1024 and 1280 every title reads in full, and Number, Priority and Labels are no wider than their content or header needs;
  - narrow="list" stays cards at 1440; narrow="table" stays a table at 390 and keeps its set widths (in a 760-pixel pane it scrolls sideways).
- No script errors.

## Why it exists
- Issue #929, the owner: "The multiple lines view is only when the datagrid does not fit on a UI. By default, columns should autosize and autofit to the window." The switch compared the width with the columns' set widths and never tried shrinking them, so AITEAM's Issues showed cards in a 760-pixel pane even on a 1440-pixel window.
- Written before the fix: those grids showed cards.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html`, draws each grid at each width, and reads whether it draws a table or cards, its sideways scroll, its headers and its width.

## What a failure means
- Tables would turn into cards while they could still fit, or a fitted table would scroll sideways or cut its headers.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when DataGrid changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
