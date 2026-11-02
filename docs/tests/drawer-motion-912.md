# drawer-motion-912

This test makes sure a side drawer slides in from its own edge, in both reading directions, instead of popping in like a dialog, and stands still when the person asks for reduced motion.

- File: `tests/drawer-motion-912.test.js`

## What it checks
- At 1280 by 800 pixels:
  - left to right: a Drawer at the end slides in from the right, a Drawer at the start from the left, each with its own duration; a Dialog still pops in;
  - right to left: the end slides in from the left, the start from the right; a Dialog still pops in;
  - with reduced motion, every one of them has a duration of 0 seconds.
- No script errors.

## Why it exists
- Issue #912, found in the #882 code health check: Dialog's motion rule came after the Drawer's, and a Drawer is also a dialog, so left to right every Drawer popped in like a dialog, with the dialog's shorter timing.
- Written before the fix: left to right, a Drawer's animation was the dialog's pop-in.

## How it checks
- Headless Chrome opens `tests/fixtures/platform-host.html`, opens a Drawer or a Dialog, and reads its animation name and duration.

## What a failure means
- A drawer would appear in the wrong way (a box growing in the middle of its edge), or would move for a person who asked for no motion.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`.
- In changed mode, Layout starts it when Dialog changes, or when this test's file changes.
- A full run always runs it.
- Written, not run: the owner starts the tests.

## What it needs
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
