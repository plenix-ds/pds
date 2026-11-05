# P0-8 evidence (checks 9-11)
- RED: red-vitest.txt (both suites fail: modules do not exist yet).
- RED (Playwright): the control test "the measurement sees the stylesheet" failed first (heights 24 = 24, then 22.8 = 22.8) because the page loaded no theme or tokens; fixed by `data-plx-theme="default" data-plx-mode`, a file:// page (about:blank cannot load file stylesheets) and `node build-app.js`.
- GREEN: green-vitest.txt (14 tests), green-playwright.txt (7 tests).
- Skipped: check 9 has no stories to read yet (Storybook is P0-11); manifest.json is empty and the check is diff-aware, so a PR touching platform/components/<X>/ must add X's manifest. Not wired into CI (P0-4 owns workflows).
