# gray-category-882

This test makes sure the gray category color is spelled "gray" (American English), and that pages still writing the old "grey" look exactly the same.

- File: `tests/gray-category-882.test.js`

## What it checks
- At 800 by 600 pixels:
  - the list of category colors ends with "gray" and no longer holds "grey";
  - a Tag in the gray category and one in "grey" draw the same background, border and text colors, the gray category pill colors;
  - a DataPill writes exactly the color it is given (gray or grey), with no color still writes the Deprecated default "grey" (CTM's stylesheet selects it), and all three draw the same;
  - each old `--plx-sys-category-grey…` token gives the same color as its gray one.
- No script errors.

## Why it exists
- Issue #882 (code health check, item 14): the owner's rule is American English, and "grey" was a public color name and token name. "gray" is the new name; "grey" is Deprecated and keeps working until the next minor release (VERSIONING.md).
- Written before the change: there was no "gray" category.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html`, draws the Tags and the DataPill, and reads their computed colors and the tokens' colors.

## What a failure means
- A page that still writes "grey" could lose its category color, or the gray category could stop matching its tokens.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when Tag, DataPill or ColorSwatch changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
