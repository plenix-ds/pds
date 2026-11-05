# button-outline-elevation-269

Secondary, tertiary and danger-secondary buttons share one light shadow and a very subtle glow, lighter than the card Halo, in light and dark.

- File: `tests/button-outline-elevation-269.test.js`

## What it checks
- Secondary, tertiary and danger-secondary Buttons, in light and dark:
  - At rest: the same shadow, `--plx-sys-control-raised-shadow`, and a very subtle glow (a radial gradient, the fill to 90%).
  - The shadow is lighter than the card Halo it replaces: fewer layers and a smaller blur.
  - On hover: the same shadow (hover does not deepen it) and the glow on the hover fill.
  - Pressed and disabled: flat (no gradient, no shadow).
- The three share one shadow at rest.
- Stay flat: a danger-secondary Button inside a Toolbar, and at the smallest (2xs) size.
- No script errors.

## Why it exists
- Issue #269 (CTM#115): the CTM owner, 2026-11-05, "Buttons are not consistent. Delete has no glow or shadow. Reduce glow and shadow and make buttons look consistent." It follows his earlier direction on #6 (a very subtle glow, a light shadow).
- Before #269 danger-secondary had no glow and no shadow, and the others carried the card Halo.

## How it checks
- Opens `tests/fixtures/platform-host.html` and draws each of the three Buttons in each state (rest, hover, pressed, disabled), a 2xs danger-secondary and one in a Toolbar, with the real Platform, in light and then dark mode.
- Reads each button's background image and shadow, and resolves `--plx-sys-control-raised-shadow` and the card Halo on a probe to compare them.
- No baseline file: the expected values are written in the test.

## What a failure means
- The outline buttons no longer match each other side by side, or the shadow or glow got heavier again.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode (`npm test` and CI), Layout starts it when Button or Toolbar changes, or a part built on one of them changes. By hand: `node tests/button-outline-elevation-269.test.js`.

## What it needs
- Headless Chrome (`launch` in `tests/lib.js`, CHROME_PATH).
- The local test server (`serve` in `tests/lib.js`).
- The test page `tests/fixtures/platform-host.html`, which loads this checkout's built Platform (`platform/dist/platform.js`).
- The hard time limit helper `tests/limit.js` (TEST_TIMEOUT_MS).
