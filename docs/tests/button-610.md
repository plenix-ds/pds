# button-610

Button labels sit exactly in the middle of the button, letters with tails are not cut off, and red Delete buttons show hover and pressed as a state layer over an unchanged red fill.

- File: `tests/button-610.test.js`

## What it checks
- Centering: the capital letters sit within half a pixel of the button's middle, at 32px (medium) and 28px (small) button heights.
- Descenders (letter tails): "gypqjy" and an Arabic label draw as far down as in a version where the label is not clipped at all.
  - The test first proves it can see clipping: with the clip margin taken away, the tails of "gypqjy" are cut at the baseline.
- Danger state layers (D-0037, #109), in the light and the dark theme:
  - Danger: the fill stays red-700 at rest, hover and pressed; hover is a white 8% layer and pressed a 10% layer over the rest glow, which runs red-700 to a red-800 rim.
  - Danger secondary: the fill stays the same in every state; hover is an 8% layer and pressed a 10% layer.
- No script errors.

## Why it exists
- Issue #610 (owner decision: Fluent 2 buttons) and the owner's requests in the button build, 2026-10-29, stated in the file header.
- Red-900 is "the one new color the owner approved" (file header); it is now the bottom edge of Danger, checked in `button-elevation-610`.
- #1333: after #109 (D-0037) hover and pressed no longer change the fill, so the 610 steps (red-800 hover, red-900 pressed) were replaced by the state-layer checks.
- From the file header: before the build, the capitals sat about 1.1px high at 28px, and Danger's pressed color was its hover color.
- Added in commit 1ad1b3d1 "#610: red-900 for the Danger pressed step, and the button label centered by its capitals".

## How it checks
- Opens `tests/fixtures/platform-host.html` and draws Buttons with the real Platform.
- For centering and descenders, photographs each button at four times the pixels and finds the first and last rows of dark ink.
- For the descender control, adds a style that removes the clip margin, and another that removes clipping entirely, and compares.
- For the Danger colors, hovers and presses the mouse on each button and reads its fill color and layer image, in light and dark.
- No baseline file: the expected colors are written in the test.

## What a failure means
- Button text could look slightly off-center, letters such as g, y or p (or Arabic letters) could lose their tails, or a Delete button could give no visible feedback (its state layer) on hover or press.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode (`npm test` and CI), Layout starts it when the Button changes, or a part the Button is built on changes.
- Layout also starts it when a global file changes (the small fixed slice) or when `tests/layout.test.js` itself changes.
- Layout also starts it when this test's own file, or a fixture it loads, changes (issue #756). By hand: `node tests/button-610.test.js`.
- A full run (`npm run test:full`, and the full suite `.github/workflows/full.yml`) runs it every time.
- CI job: the "fixtures" browser job (Layout's job), on every pull request and on pushes to styling/phase-2 and main.

## What it needs
- Headless Chrome (`launch` in `tests/lib.js`, CHROME_PATH).
- The local test server (`serve` in `tests/lib.js`).
- The test page `tests/fixtures/platform-host.html`, which loads this checkout's built Platform (`platform/dist/platform.js`).
