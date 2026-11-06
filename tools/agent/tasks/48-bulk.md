No tests: see HANDOFF.md (the owner runs them)

# Task #48: Retire BulkActions (#48) (Codex)

Tracker: https://github.com/plenix-ds/plenix-platform/issues/48 · Plan of record: https://github.com/plenix-ds/plenix-platform/issues/3

### Owner

Codex

### The task

The command bar swaps to the selection's commands (since 0.31.69), so BulkActions is no longer needed. The Asset Manager's
Search workspace still uses it (`dam/app/pages/home/HomePage.jsx`, `assetBulk`; SearchWorkspace's `bulk` slot).
1. Give SearchWorkspace's results a CommandBar selection instead (its `bulk` slot takes the CommandBar's selection
   state; keep the slot working for one release, documented as deprecated).
2. Move the Asset Manager's Search workspace onto it (the same actions, words and count).
3. Mark BulkActions deprecated: its header comment and its design-system record say "use CommandBar's selection
   state" (the record through a part file, not inventory.js); it stays exported for one release.

### Files you own

- platform/patterns/SearchWorkspace/
- platform/patterns/BulkActions/BulkActions.tsx (the header comment only)
- dam/app/pages/home/HomePage.jsx (the Search workspace only)
- lanes/bulk/design-system/parts/wBLK.records.js (new: the deprecation note on the bulk-actions record through H.record)

Never edit generated files.

### Done means

- The quick gates pass: `node tools/agent/lane-overlay.js`, `node build-app.js`, `node check-system.js` (SYSTEM_OK),
  `node check-spec.js` (SPEC_OK); `node --check` on every JS file you wrote.
- The Asset Manager home and Search workspace open without console errors; `node tests/keyboard.test.js` passes.
- No generated file in the branch (CI: GENERATED_OK). The browser tests run in CI on the pull request (if CI cannot
  start, say so in the pull request; the integrator checks it locally).
- One pull request from branch `codex/48-bulk`, `Closes #48`, listing what changed and how an app uses it,
  anything left undone, and **Needs the owner**.

### Read first

1. `AGENTS.md`
2. `tools/agent/web/BRIEF-web.md` (house rules)
3. The header comments of the files you edit
