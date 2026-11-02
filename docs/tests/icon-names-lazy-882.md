# icon-names-lazy-882

This test makes sure an app built from the Plenix package loads the list of icon names only when it draws an icon by name, so a small part such as a Badge or a Button stays small.

- File: `tests/icon-names-lazy-882.test.js`

## What it checks
- The package's Icon code holds no icon name table; the separate icon-names file holds all four tables (the Plenix names, symbols and mirrored symbols, and the Material library's names).
- The browser global (`platform/dist/platform.js`), the CDN's `plenix.esm.js` and the CommonJS build still hold the tables built in.
- In a browser, left to right and right to left:
  - an icon drawn from an imported module (StatusIcon) loads no icon-names file;
  - `resolveIcon('add')` answers nothing before the tables arrive and the Plenix icon after;
  - an Icon named "arrow-back" loads the icon-names file once, then carries the mirrored class;
  - an unknown name warns once, after the tables arrive.
- No script errors.

## Why it exists
- Issue #882 (code health check, item 11): since #702 the Material library's names (54 KB) loaded on demand, but the Plenix set's tables (about 10 KB) still came with every part that draws an icon. The owner-approved icon bank (#896) adds 42 names, which pushed `{ Button }` over its 105 KB limit.
- Written before the change: the Icon code held the Plenix tables, so the first check fails on the old build.

## How it checks
- It reads the built package (`packages/react/dist/`), then headless Chrome imports the package's Icon module from a made-up address, with an import map for React, and watches which files it asks for.

## What a failure means
- Every app that uses one Plenix part would carry the whole icon name list again, or an icon drawn by name would never appear in an app built from the package.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when Icon changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- The package build (`npm ci`, or `node build-packages.js`) and headless Chrome (CHROME_PATH).
