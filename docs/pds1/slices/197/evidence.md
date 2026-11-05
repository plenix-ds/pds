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
