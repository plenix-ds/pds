# site-parts

The St. John test site's screens that are the only place a Plenix part is drawn really draw it, so those parts are not left without a browser check.

- File: `tests/site-parts.test.js`

## What it checks
- It opens 10 site screens (documents, document, assistant, announcements, announcement-edit, media, messages, readings, visit, welcome) and asserts that 46 parts draw on them: each part's own class (`plx-<name in kebab case>`), or a named marker for SplitWorkspace and SaveStatus.
- A part counts if it was drawn at any moment in the first 8 seconds, so a tip that goes away by itself still counts.
- No script errors.
- Not asserted, and listed in the file header: parts that draw only after an action (dialogs and popovers), templates and commerce pages with no class of their own, TeachingBubble, and hooks and constants.

## Why it exists
- Issue #64 (follow-up to #675): 74 parts were used only by 12 site screens, and no test named them.

## How it checks
- Starts the St. John site through `tests/site.js` and opens each screen in headless Chrome at 1440 by 1000.

## What a failure means
- A Plenix part no longer draws on the only screen that shows it, or the screen no longer uses it.

## When it runs
- AUTOMATIC in `tests/run.js`. No changed mode.
- By hand: `node tests/site-parts.test.js`.

## What it needs
- Chrome, the local test server, the St. John site (`SITE_DIR`) and this checkout's build in `release/cdn/`.
