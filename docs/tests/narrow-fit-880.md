# narrow-fit-880

This test makes sure two parts fit a phone's width: a data toolbar's summary stays inside its row, and the bottom navigation bar keeps all five destinations on screen.

- File: `tests/narrow-fit-880.test.js`

## What it checks
- At 320 pixels, left to right and right to left:
  - a DataToolbar with two Chips at the start and a summary at the end (a Text with truncate) stays within its 320-pixel row, and the summary wraps under the start group and shows whole;
  - a bottom navigation bar of five items in a 310-pixel box keeps every item inside the box, each at least the 44-pixel touch target.
- No script errors.

## Why it exists
- Issue #880: the reflow job, once the Gifts timeout was gone (#809's first step), reached two older findings on the test site. The Directory page was 390 pixels wide at 320, because the DataToolbar's end group (its "N households · N people") did not shrink. The Document page cut off "Browse" in the bottom bar, because each of its five items kept a 64-pixel minimum, which needs 320 pixels, in a 310-pixel bar (the page's scrollbar takes 10).
- Updated for #1331: change #373 (#11, #13, November 5) later made a narrow row wrap, so the summary no longer ends in "…"; the test now checks the wrap and that nothing runs past the row.
- Written before the fix: the toolbar's end group did not shrink and the bar's items kept 64 pixels.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html` at 320 by 640 pixels, draws a DataToolbar and the bottom bar's markup, and measures them.

## What a failure means
- On a phone, a toolbar could run off the screen, or a navigation destination could be cut off.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when DataToolbar, NavPane, Text or Toolbar changes, or when this test's file changes.
- A full run always runs it. CI: the "fixtures" browser job (Layout's job). The reflow job checks the test site's pages themselves.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
