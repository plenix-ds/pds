# metric-card-rank-rtl-897

This test makes sure a metric card's ranked list reads "#1", "#2", "#3" on Arabic (right-to-left) pages too, never "1#".

- File: `tests/metric-card-rank-rtl-897.test.js`

## What it checks
- At 600 by 400 pixels, a MetricCard list of three ranked rows, in English (left to right) and Arabic (right to left):
  - each rank's text is "#" then its number (Arabic digits in Arabic);
  - each rank draws the "#" to the left of its number.
- No script errors.

## Why it exists
- Issue #897: the UX Designer saw "1#" in the right-to-left rows. The number is its own left-to-right island (issue 838), so the "#" before it was left alone and a right-to-left row drew it after the number.
- Written before the fix: right to left, the "#" sat to the right of the number.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html`, draws the card, and measures where the "#" and the number are drawn.

## What a failure means
- Arabic readers would see the rank's mark on the wrong side of its number.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when MetricCard changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
