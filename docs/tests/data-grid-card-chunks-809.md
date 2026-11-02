# data-grid-card-chunks-809

This test makes sure a data table with thousands of rows stays fast on a phone: its card form draws only the cards near the view, about one screen, instead of all of them.

- File: `tests/data-grid-card-chunks-809.test.js`

## What it checks
- A table of 10,000 rows at 320 pixels, shown as cards:
  - fewer than 40 cards are drawn, with a space standing for the rest;
  - the page answers at once;
  - the screen reader count is the full 10,001 (the rows and the header).
- Scrolling the table to the end draws the last card, still fewer than 40.
- Arrow Down on the last drawn card moves to the next card.
- End on a card moves to the last card within one second, still fewer than 40 drawn.
- Home after End keeps focus on the last card, which stays drawn.
- Select-all selects all 10,000 rows, not only the drawn cards.
- In a grouped list, deep inside the first group, that group's header is still drawn, so it stays stuck at the top.
- Tables of 100 rows or fewer (100, 30) draw every card and no space, as before.
- At 1280 pixels the table is unchanged: virtualized, with no card space.
- The same right to left. No script errors.

## Why it exists
- The reflow job timed out on the test site's Gifts page (10,000 gifts): at 320 pixels the table became cards and drew all of them at once. Issue #809's first step drew the cards in chunks of 100, but End still drew all 10,000 (about 3.8 seconds) and memory grew with each chunk.
- Issue #809, step 2: draw only the cards near the view, each measured, as the table already does with its rows.
- Written before step 2: End drew every card.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html` at 320 by 640 pixels (then 1280), draws a DataGrid of 10,000 rows as cards, scrolls its scroll area, focuses a card's cell, presses Arrow Down, End and Home, clicks the select-all box, and reads the drawn cards, the space, the row count and the focused row.

## What a failure means
- A big table could freeze the page on a phone, the keyboard could lose its place, or a group header could stop staying at the top.
- Select-all could miss the rows not drawn, or a screen reader could announce the wrong total.

## When it runs
- A child of `data-grid` (AUTOMATIC in `tests/run.js`): data-grid starts it when the DataGrid changes, or when this file changes. A full run always runs it.
- CI: the "behavior" browser job. Full suite: the "behavior" job.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
