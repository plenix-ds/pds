# site-coverage

The St. John test site really uses every part of Plenix, so the automatic tests that run on it reach every component.

- File: `tests/site-coverage.test.js`

## What it checks
- Every public name of the Platform (`platform/index.js`) that draws something (a component, pattern, page template or provider: a name starting with a capital letter), and every hook an application calls itself, is imported by the St. John site and used there.
- Not required: data, plain functions and constants, the building hooks inside components, and a short list of names applications never draw (for example DataGridEngine and Portal).
- Every screen named in the site's `pages.js` has a screen file, and every screen file has a route.
- No screen file is an unfinished stub.
- `--list` prints every required name and the screens that use it; the printed map is kept in `docs/tests/site-coverage-map.md`.

## Why it exists
- Owner, 2026-10-25: "a dummy site that utilizes all the defined pages, controls, components", quoted in the file header.
- Added in commit 83799244 "St. John the Beloved test site: every automatic test runs there, not on the design spec (#338)". Issue #338 asks for a test site that uses every page, control and component, with the tests moved off the design spec.

## How it checks
- Reads files only; it opens no browser.
- Reads the export list in `platform/index.js` and every `.jsx` and `.js` file in the St. John site's `site/` folder, and looks for each name imported from `plenix-platform` and actually used (as an element, a member, a call or a value passed on).
- Reads the site's page list (through `tests/site.js`) and its `site/screens/` folder.
- No baseline.

## What a failure means
- A Plenix component could go untested: the browser tests run on the St. John site, and a component the site never shows is never checked there.
- A site page could point at a screen that does not exist, or a screen could be unreachable.

## When it runs
- AUTOMATIC in `tests/run.js`: part of `npm test` and `npm run test:full`.
- It has no changed mode: it checks everything every time it runs.
- CI: the "fixtures" browser job, on every pull request and on pushes to styling/phase-2 and main.
- Full suite (`.github/workflows/full.yml`): the "fixtures" browser job.

## What it needs
- The St. John test site checkout (`tests/site.js`; default `../st-john-test-site` beside this repository, or SITE_DIR). Without it the test fails with a message saying where to clone it.
- No browser, no web server, no database.
