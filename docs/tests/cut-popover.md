# cut-popover

When text in a table cell is too long and gets cut off, a person can open it in full.

- File: `tests/cut-popover.test.js`

## What it checks
- Pointing at a cell whose text fits shows no button.
- Pointing at a cell whose text is cut (a column with `overflow: 'dialog'`) shows a "Show full text: <column title>" button.
- The button opens a Dialog with the whole text.
- No script errors.

## Why it exists
- Owner decision 2026-10-24, option B (in the file header and the commit).
- Issue #312 "Cut text opens in a popover (option B; builds on #309)" (named for this test in `data-grid.test.js`).
- Added in commit d771ac18 (2026-10-24) "Cut text opens in a popover (owner, 2026-10-24, option B)".
- Updated for #1343: D-0140 and D-0141 (2026-11-09, #1122) replaced the popover with a corner button that opens a Dialog, opt-in per column with `overflow: 'dialog'`. The test had still asserted the old popover button and label, so it failed once data-grid ran every child (#1327). The product is right; the test was stale.

## How it checks
- Opens `tests/fixtures/platform-host.html` in headless Chrome, draws a two-row DataGrid in a 420px box with a two-line `overflow: 'dialog'` Note column (one long note, one short), hovers each Note cell, clicks the button, and reads the Dialog text.

## What a failure means
- A person could not read a long note, address or description that is cut off in a table, or would see a useless button on text that already fits.

## When it runs
- A child of `data-grid` (AUTOMATIC in `tests/run.js`): data-grid starts it as a separate process before its own checks.
- In changed mode it runs when the DataGrid, DataGridEngine or Table changes, or when this test file changes. In a full run it always runs.
- It is skipped when data-grid is started with `DT_ONLY`.
- CI: the "behavior" browser job (`ci.yml`), on every pull request and on pushes to styling/phase-2 and main. Full suite (`full.yml`): the "behavior" job.

## What it needs
- Headless Chrome and the local test server (`tests/lib.js`).
- `tests/fixtures/platform-host.html`.
