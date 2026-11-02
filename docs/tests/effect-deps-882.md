# effect-deps-882

This test makes sure a photo strip (Carousel) and a row of tabs (Tabs) stop redoing work after every screen update, while they still follow scrolling and tabs that grow wider.

- File: `tests/effect-deps-882.test.js`

## What it checks
- At 1000 by 700 pixels, left to right and right to left:
  - Carousel: ten re-renders with the same slides add no scroll listener (one at mount); scrolling the strip to the third slide still reports page 2;
  - Tabs: twenty tabs in a 400-pixel box fold into More; ten re-renders with the same tabs read no tab's position; when a shown tab's count grows, every shown tab still ends inside the list.
- No script errors.

## Why it exists
- Issue #882 (code health check, item 5): Carousel added its scroll listener again after every render, and Tabs measured every tab after every render.
- Written before the change: both showed that extra work after every re-render.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html`, draws each component, counts listener additions and position reads during re-renders, then scrolls and widens a tab.

## What a failure means
- Pages with a carousel or many tabs would do needless work on every update, or the tab row would stop fitting its tabs.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when Carousel or Tabs changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
