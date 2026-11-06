# zero-overlap

Each part of the Plenix interface gets each style from exactly one rule, so changing one component's look never changes another by accident.

- File: `tests/zero-overlap.test.js`

## What it checks
- The audit's own fixtures: on a sample page, every element reports exactly the overlaps (a property set by two or more rules) and the dependencies (inherited settings it reads) it declares it should. Hover, focus and pressed states are forced on where the page asks.
- The pilot page (Button, Input, a navigation list, open popovers and icons, in every state):
  - Every element has zero overlap, at standard and comfortable density, with and without reduced motion.
  - Under reduced motion, no animation or transition lasts longer than 0 seconds.
  - Under reduced motion, every element's computed style is the same as in the recorded snapshot. Seven properties are left out because they differ between Chrome versions and fonts: `text-decoration-skip-spaces`, `width`, `inline-size`, `transform-origin`, `perspective-origin`, `text-decoration-inset`, `position-visibility`.
- Prints the conditions the pilot ran in (its coverage).

## Why it exists
- Zero overlap at run time: the Plenix Styling Standard, section 3.5 (in the file header).
- Added in commit 0b2fa81c "Zero overlap: the Standard, the selector-kinds check, the strict audit, fixtures and backlogs".
- The left-out properties: issue #359 (the first five) and #46 (the CI runner's Chrome, the last two) ("zero-overlap: 1230 text-decoration-skip-spaces findings on cc-server Chrome (baseline mismatch)"). The file header gives the reasons: Chrome 156 no longer lists one of them, and measured widths change with each computer's fonts.

## How it checks
- Serves `tests/fixtures/zero-overlap/audit.html` and `tests/fixtures/zero-overlap/pilot.html` (with `pilot.js`) from the local test server and opens them in Chrome at 1440 × 1000.
- Forces hover, focus and pressed states through Chrome's developer interface.
- Runs the strict audit of `tests/clash-audit.js` in the page.
- Compares the pilot's computed styles with `tests/baselines/pilot-computed.json`. `--record` takes a new snapshot.

## What a failure means
- Two rules fight over the same style on one element. A change to one component could silently change another, or a state (hover, focus) could look different from what the design says.
- The pilot components changed their look when they should not have.

## When it runs
- AUTOMATIC group in `tests/run.js`, so `npm test` and `npm run test:full` run it. It has no changed-mode filter: it always runs its checks when started.
- CI: the "Zero overlap" job of `ci.yml`, part of the required "CI result" check (#46). It is diff-aware: it runs only when `platform/`, `build-app.js`, `ci.yml`, this test, `tests/clash-audit.js`, `tests/lib.js`, the fixtures or the snapshot changed; otherwise it passes without running. A missing Chrome fails it.
- By hand: `node tests/zero-overlap.test.js`.

## What it needs
- Chrome (headless) and the local test server (`tests/lib.js`).
- The fixtures in `tests/fixtures/zero-overlap/` and the audit in `tests/clash-audit.js`.
- The snapshot `tests/baselines/pilot-computed.json`.
