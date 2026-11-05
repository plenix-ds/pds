---
name: pds1-tdd
description: Test-first rules for PDS 1.0 engineers (tokens, icons, styles, React components, build and CDN scripts). Use whenever writing or changing product code, fixing a bug, adding a story or changing a token. Requires RED then GREEN then whole-suite evidence, with commands and output lines, in the report.
---

# PDS1 test-first rules

Adapted from obra/superpowers `test-driven-development` (MIT, (c) 2025 Jesse Vincent).

## Iron law

No production code without a failing test that demands it. If you wrote code
first, delete it and start from the test. A component with no behaviour test
cannot merge (plan §7e).

## Cycle (per behaviour)

1. **RED** - write one test for one behaviour. Run only that test. It must fail
   **for the expected reason** (an assertion on the missing behaviour), not an
   import error, a typo, a missing story or a missing browser. Copy the command
   and the failing line into the report.
2. **GREEN** - write the smallest code that passes. Re-run the test; copy the result.
3. **Whole relevant suite** - not just your test:
   - Vitest: `npx vitest run packages/<pkg>` (logic, props, events, ARIA, i18n keys)
   - Playwright: `npx playwright test <component>` (keyboard, focus, pointer, measured layout, RTL)
   - Repo runner: `npm test` (= `node tests/run.js`, changed mode); `node tests/run.js <name>` for one test
   - Lint/contract checks the change touches (`npm run lint:system`, `npm run lint:style`)
   Name every failure, including ones you believe pre-existed; check them against
   the base branch before calling them "old" (only new problems block).
4. **Refactor** only while green. Commit.

## What a good PDS test looks like

- **Behaviour users see**, not internals: roles, names, ARIA state, focus, text,
  measured boxes. Query by role/label (`getByRole('button', { name })`), never by
  class name or component state. A refactor must not break it.
- **Stories are the fixtures.** Render the component's stories (`composeStories`
  in Vitest, the story URL in Playwright); every story is a test case. A new
  state gets a story first, then the test that drives it.
- **The §7e baseline** for every component: each story renders with no errors or
  console warnings; every state in the state manifest is reachable with the right
  ARIA; disabled fires no events; Tab/Enter/Space work and focus is visible;
  `dir="rtl"` mirrors arrows and directional icons only; 3x-long text and empty
  values do not overflow; no axe violations in any state; all visible text comes
  from the catalog and switching to `ar` changes it. Then the family rows in §7e.
- Expectations are literals you derived by hand (`'32px'`, `'٣'`, `aria-selected="true"`),
  not values recomputed with the code under test.
- Tokens: assert the resolved CSS value on a rendered element, plus the lint rule
  (no raw hex, radius from the scale, no physical left/right, no `transition: all`).
- Time and locale are explicit: fixed dates, `en-US` and `ar-EG`.
- **Bug fix:** the test reproduces the reported bug and fails before the fix.
  Show that RED in the report. No RED, no fix.
- **Mutation check** before finishing: break the code on purpose (flip a
  condition, drop an `aria-*`); the test must fail. Restore.
- Flaky test: quarantine it with an owner within 24h; never delete it.

## Red flags - stop and restart the cycle

"Too simple to test", "I checked it in Storybook", "the test passes immediately"
(it is not testing the new behaviour), snapshot-only tests, asserting a mock was
called, editing an expectation to match new output without a reason in the
brief, `test.skip` to get green, a browser test that "skipped" because no browser
was installed (that is a FAIL).

## Report block (required)

```
TDD evidence
RED:   <command>  ->  <failing assertion line>
GREEN: <command>  ->  <N passed>
Suite: <command(s)>  ->  <N passed, M failed (names, new vs base)>
Mutation check: <what you broke> -> test failed as expected
Evidence: Ran | Skipped | Planned | Manual - <path to log>
```
