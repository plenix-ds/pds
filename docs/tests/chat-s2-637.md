# chat-s2-637

A chat conversation groups each person's messages, shows date and "New messages" lines, and tells the sender whether each message was sent, delivered or read, readably in light and dark and in Arabic.

- File: `tests/chat-s2-637.test.js`

## What it checks
- Runs (Chat.Group): the photo and the name show on the first message of a run only; a divider inside a run takes none of the run's settings.
- Lines (Chat.Divider): a date line ("Today"); the unread line says "New messages" by default and is bolder than a date line.
- The time is not on the message line; a footer is the last line of the bubble, not under the 12px type floor and not larger than the caption (it was 10px before #206), in the data font:
  - "Sent <time>", and "Sent <time> | Read <time>" once read; "Sending" while sending.
- Status marks after the times (yours only): sending a clock, sent one gray check, delivered two gray checks named "Delivered", read two green checks (green-500 in light, green-200 in dark). "Read" is always written, so green is never the only sign.
- Contrast: the footer gray passes 4.5:1 and the green checks pass 3:1 on every message fill, light and dark.
- Dark: theirs gray-900 with a gray-700 outline, yours gray-700 with a gray-500 outline (no blue).
- Arabic: "New messages", "Sent", "Read" and "Delivered" come in Arabic.
- No script errors.

## Why it exists
- Issue #637 (Chat dialogue interface), slice 2, stated in the file header.
- Times in the data font: the owner's #260 (numbers in the mono font), quoted in the check.
- From the file header: before slice 2 there was no Chat.Group or Chat.Divider, the time sat on the message line, there was no status, and your dark message was blue.
- Added in commit 805fdb1a "#637 slice 2: runs, date and New messages lines, the Sent/Read footer with status marks, dark bubbles in two grays".

## How it checks
- Opens `tests/fixtures/platform-host.html` and draws a chat thread with a run from each person, two date lines and the "New messages" line, with the real Platform, in light, dark and Arabic.
- Reads which messages show a photo or name, the footer text, size, font and color, the status marks' colors and names, and computes contrast ratios.
- No baseline file: the expected colors and texts are written in the test.

## What a failure means
- A person could see repeated photos and names on every message, lose the date lines, or be unable to tell whether a message was delivered or read.
- The small footer text or the read checks could be too faint to read.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`. (Its header's Usage line names no runner; the wiring is in `tests/layout.test.js`.)
- In changed mode (`npm test` and CI), Layout starts it when Chat changes, or a part Chat is built on changes.
- Layout also starts it when a global file changes (the small fixed slice) or when `tests/layout.test.js` itself changes.
- Layout also starts it when this test's own file, or a fixture it loads, changes (issue #756). By hand: `node tests/chat-s2-637.test.js`.
- A full run (`npm run test:full`, and the full suite `.github/workflows/full.yml`) runs it every time.
- CI job: the "fixtures" browser job (Layout's job), on every pull request and on pushes to styling/phase-2 and main.

## What it needs
- Headless Chrome (`launch` in `tests/lib.js`, CHROME_PATH).
- The local test server (`serve` in `tests/lib.js`).
- The test page `tests/fixtures/platform-host.html`, which loads this checkout's built Platform (`platform/dist/platform.js`).
- The hard time limit helper `tests/limit.js` (TEST_TIMEOUT_MS).
