# entity-header-media-275

An EntityHeader icon media shows the icon without a box, filling its square in its hue, unless the usage asks for the box.

- File: `tests/entity-header-media-275.test.js`

## What it checks
- EntityHeader with `media={{ icon, hue }}`, in light, at desktop width:
  - Page (top-small and top-large) and section headers: the media tile has no fill and no border, and the square stays 44px (72px top-large, 32px in a section) and the icon is the square times the icon fill scale (D-0059, #418: 52.8px in 44px), so its drawn shape reaches the square's edges.
  - For every hue (blue, green, purple, red, brown, gray, surface): the icon is drawn in `--plx-comp-entity-header-media-<hue>-icon` (the hue's on-surface colour).
  - `media={{ icon, hue, box: true }}`: the tinted tile with its 1px border, the icon smaller than the tile, as before #275.
- No script errors.

## Why it exists
- Issue #275 (CTM#109): the CTM owner, 2026-11-05, on the case header: "the icon does not have the box around it as we decided". The decision is D-0024 ("do not put an icon inside a box"), applied to this media by D-0036 (design: `docs/pds1/slices/108-icon-box/design.md`, row 1; tokens: `docs/adr/0005-data-color-on-surface.md`).
- Before #275 the media tile had a soft fill and a 1px border, with a 24px icon in a 44px tile.

## How it checks
- Opens `tests/fixtures/platform-host.html` and draws EntityHeaders (the CTM case header, top-large, a section, the box opt-in and one per hue) with the real Platform.
- Reads each tile's fill, border, colour and width and its icon's width; resolves each hue's media icon token on a probe.
- No baseline file: the expected values are written in the test.

## What a failure means
- The icon is back inside a box by default, is not the square times the fill scale, or is drawn in the wrong colour.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode (`npm test` and CI), Layout starts it when EntityHeader, RecordPage or Icon changes. By hand: `node tests/entity-header-media-275.test.js`.

## What it needs
- Headless Chrome (`launch` in `tests/lib.js`, CHROME_PATH).
- The local test server (`serve` in `tests/lib.js`).
- The test page `tests/fixtures/platform-host.html`, which loads this checkout's built Platform (`platform/dist/platform.js`).
- The hard time limit helper `tests/limit.js` (TEST_TIMEOUT_MS).
