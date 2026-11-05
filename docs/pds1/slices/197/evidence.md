# Evidence: #197, new diff-aware CI (CI v1)

| Item | Status | Path / output |
|---|---|---|
| zizmor 1.32.0 on `.github/workflows` | Ran (local) | `uvx zizmor@1.32.0 --offline .github/workflows`: "No findings to report" |
| `tools/ci/new-problems.mjs` parses | Ran (local) | `node --check tools/ci/new-problems.mjs`: OK |
| Every action pinned to a commit SHA | Ran (review) | `.github/workflows/ci.yml`: checkout v7.0.1 `3d3c42e5`, setup-node v7.1.0 `949feb24` |
| `run:` steps use bash with pipefail | Ran (review) | `defaults.run.shell: bash` in `ci.yml` |
| Diff-aware checks: tsc, ESLint, Stylelint, Knip, check-system, check-style | Planned (CI) | Results of the first CI run on this PR |
| A PR that adds a new problem fails | Planned | A throwaway PR adding one ESLint error after this merges |
| Opengrep, Rulesync drift, ownership, traceability, design and locale checks | Planned | Later PRs on #197, once their config exists |
| Vitest + Playwright behavior tests, visual regression | Planned | QA Engineer, with Storybook |
| Local test run | Skipped | Owner rule: tests run only in CI or when the owner starts them |

## After merge (2026-11-05)

| Item | Status | Path / output |
|---|---|---|
| #203 merged through the merge queue | Ran | `c81b80f2`; merge_group run 41984242954: success |
| A PR that adds a new problem fails | Ran (CI) | Draft #211, run 41984826800: Knip "124 findings, 1 new, 123 old" → FAIL; `CI result` FAIL; other checks pass. Closed, not merged |
| A change that breaks the build fails every check | Ran (CI) | #211's first push, run 41984644502: `npm ci` (build) failed in all six jobs |
| `decisions.yaml` check | Ran (local) | `node tools/ci/check-decisions.mjs origin/main`: DECISIONS_OK (22); a planted duplicate id and a rewritten D-0006 gave DECISIONS_FAIL (6) |
