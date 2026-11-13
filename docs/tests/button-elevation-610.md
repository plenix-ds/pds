# button-elevation-610

Action buttons look slightly raised at rest, show hover and pressed as a state layer over the glow, and go flat when disabled, in light and dark.

- File: `tests/button-elevation-610.test.js`

## What it checks
- Secondary, tertiary, primary and danger Buttons, in light and dark:
  - At rest: a soft glow (a radial gradient, fill to 90%) and no shadow (D-0054).
  - On hover: an 8% state layer over the glow, and the Halo shadow. The fill is the rest fill (D-0037, #109).
  - Pressed: a 10% state layer over the glow, the rest fill, no shadow.
  - Disabled: flat (no gradient, no shadow).
- Primary and danger edges: at rest the border is the glow's rim (blue-600, red-800) and the bottom edge one shade deeper (blue-700, red-900); hovered, the border stays the rim.
- Secondary and tertiary fills are the same at rest, hover and pressed: white in light, gray-700 in dark.
- Tertiary's words pass a 4.5:1 contrast on its fill.
- Ghost Buttons are flat at rest and take only the state layer (no glow, no shadow); Buttons inside a Toolbar and the smallest (2xs) size stay flat.
- No script errors.

## Why it exists
- Issue #610 (owner decision: Fluent 2 buttons); the owner's pick G-R4-H, with his go recorded on #610, stated in the file header.
- From the file header: before #610 every button was flat and primary's border was its fill.
- #1333: after #109 (D-0037) hover and pressed are state layers over an unchanged fill, so the 610 hover and pressed assertions were updated.
- Added in commit 93aa9c36 "#610 raised action buttons (the owner's pick G-R4-H): Card glow 55%, Halo at rest, Lifted on hover, flat pressed".

## How it checks
- Opens `tests/fixtures/platform-host.html` and draws each kind of Button in each state (rest, hover, pressed, disabled), a 2xs Button and a Toolbar, with the real Platform, in light and then dark mode.
- Reads each button's background image, shadow, border colors, fill and text color, and computes the text contrast.
- No baseline file: the expected colors are written in the test.

## What a failure means
- Buttons could look flat or wrongly shaded, give no visible feedback on hover or press, or tertiary buttons could become hard to read.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`. (Its header's Usage line names no runner; the wiring is in `tests/layout.test.js`.)
- In changed mode (`npm test` and CI), Layout starts it when Button or Toolbar changes, or a part built on one of them changes.
- Layout also starts it when a global file changes (the small fixed slice) or when `tests/layout.test.js` itself changes.
- Layout also starts it when this test's own file, or a fixture it loads, changes (issue #756). By hand: `node tests/button-elevation-610.test.js`.
- A full run (`npm run test:full`, and the full suite `.github/workflows/full.yml`) runs it every time.
- CI job: the "fixtures" browser job (Layout's job), on every pull request and on pushes to styling/phase-2 and main.

## What it needs
- Headless Chrome (`launch` in `tests/lib.js`, CHROME_PATH).
- The local test server (`serve` in `tests/lib.js`).
- The test page `tests/fixtures/platform-host.html`, which loads this checkout's built Platform (`platform/dist/platform.js`).
- The hard time limit helper `tests/limit.js` (TEST_TIMEOUT_MS).
