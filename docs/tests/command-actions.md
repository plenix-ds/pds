# command-actions

The buttons in a list's command bar (and the small forms they open) behave correctly with the mouse and the keyboard, including when they fold into "More actions" and while rows are ticked.

- File: `tests/command-actions.test.js`

## What it checks
- Busy commands of every kind show a spinner, are marked busy and disabled, and cannot run or open anything, also when folded into "More actions".
- A command's help text shows on focus; a disabled command shows why it is disabled; icon-only and folded commands keep their help.
- The command bar sticks to the top only when it sits directly in the page (or when told to), and stays in place inside a card.
- A selection command's form puts the focus in its first field, and closing it returns the focus to the command without clearing the selection.
- While rows are ticked, search and filters stay and only the page actions give way to the selection commands; Escape in the search field does not clear the selection, but Escape on the bar does (issue #454).
- Folded forms open from their "More actions" item, anchor to it, and return the focus to it; a narrow bar folds selection commands into More.
- The fold order is unchanged, and the primary command is never folded.
- Keyboard: Enter opens a form, Home and the arrow keys edit its text, Tab reaches its button or leaves the form, Escape closes only the form, and Escape on the selection toolbar clears the selection.

## Why it exists
- Its header: "CommandBar contextual-action regressions, including actual keyboard input and folded forms."
- Issue #454 "P-53: Search and Filter vanish while rows are ticked" (named in the check text).
- Added in commit b9502283 (2026-10-16) "0.40.0: Wave 15 B and C (packages: Vue, web components, lint, MCP; i18n), command bar fixes, developer experience".

## How it checks
- Builds the CommandBar's action part (`platform/patterns/CommandBar/BarActions.tsx`) from source with esbuild and adds it to the page.
- Draws CommandBars and Toolbars with sample commands, clicks, focuses and presses keys, and reads focus, roles and tooltips.
- Inside the keyboard test it runs on the St. John test site's Members page; alone, it runs on `tests/fixtures/platform-host.html`.

## What a failure means
- A person could run a command twice while it is busy, lose their ticked rows by pressing Escape in the search, get stuck in a small form, or lose track of the focus after closing it.

## When it runs
- A module of `keyboard` (AUTOMATIC in `tests/run.js`): keyboard loads it into its own browser when the CommandBar (patterns/CommandBar) changes, when the test site's Members page changes, or when this file changes. In a full run it always runs.
- CI: the "behavior" browser job (`ci.yml`), which runs keyboard, on every pull request and on pushes to styling/phase-2 and main. Full suite (`full.yml`): the "fixtures" job, which runs keyboard there.
- It can also be run alone: `node tests/command-actions.test.js`.

## What it needs
- Headless Chrome and the local test server (`tests/lib.js`), and the esbuild package.
- The St. John test site checkout (`tests/site.js`) when run by keyboard; `tests/fixtures/platform-host.html` when run alone.
