# data-grid-card-count-679

This test makes sure a data table's card list can name its records, so a church app says "6 members" instead of "6 records", with the right plural in English and Arabic.

- File: `tests/data-grid-card-count-679.test.js`

## What it checks
- At 380 by 600 pixels, where the grid shows cards:
  - English, with the app's words: 1 row reads "1 member", 6 rows "6 members"; with no words given, 6 rows still read "6 records";
  - Arabic, right to left, with the app's six plural forms: 1, 2, 3 and 11 rows each take their own form; with none, 6 rows read the built-in "records" form.
- No script errors.

## Why it exists
- Issue #679, the owner's card review: the card header said "6 records" where his sample said "6 members". An app names its records with the grid's `strings.cardCount`.
- Written before the change: the count read only the built-in words, so a grid's own words were ignored.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html`, draws a DataGrid narrow enough to show cards, and reads the card header's text.

## What a failure means
- An app could not name its records, or the count could show the wrong plural.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when DataGrid changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
