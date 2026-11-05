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

## Opengrep (2026-11-05)

| Item | Status | Path / output |
|---|---|---|
| Version older than a week | Ran | v1.33.0 (2026-10-27); latest v1.33.1 was a week old minus a day |
| Binary signature | Ran (openssl) | Sigstore certificate: `https://github.com/opengrep/opengrep/.github/workflows/rolling-release.yml@refs/heads/release-v1.33.0`, repo `opengrep/opengrep`, commit `641c730d`; `openssl dgst -sha256 -verify` → "Verified OK". Not checked: the Fulcio chain and the Rekor entry (no cosign on VM 131) |
| Pinned sha256 | Ran | `2545812755572e1355ea60f96288f82a26eebed7fc8b512430d49d5667214c24` (`opengrep_manylinux_x86`), checked with `sha256sum -c` in CI |
| Rules and fixtures | Ran | `opengrep test .opengrep/rules`: "3/3: ✓ All tests passed" (each rule has `ruleid` and `ok` cases; the object-spread form of `dangerouslySetInnerHTML` added after the first scan missed it) |
| Findings on main | Ran | 1: `platform/components/RichText/RichText.jsx:46` (`dangerouslySetInnerHTML` of the sanitized `clean`): old debt, reported, not blocking |
| Diff-aware compare | Ran (local) | empty base → "1 new" exit 1; same base → "0 new, 1 old" exit 0 |
| CI leg `New problems (opengrep)` | Planned | This PR's run |
| Banned imports rule | Skipped | No banned-import list exists; it needs the DS Architect's ADR first |

## Traceability (2026-11-05)

| Item | Status | Path / output |
|---|---|---|
| Convention found on main | Ran (read) | briefs list `**AC-n**` (265, 87, 195); tests carry the issue in the name (`tests/vote-tally-options-265.test.js`) and name the ACs; evidence under `docs/pds1/slices/<slice>/evidence*` |
| No slice touched | Ran (local) | `check-trace.mjs origin/main` → TRACE_OK (0 checked; 3 with a brief) |
| Slices touched (temporary commit on 265 and 195 evidence) | Ran (local) | TRACE_FAIL: 195-dashboard AC-1..6 in no test; 265 AC-1, AC-3, AC-4, AC-5 not in its evidence (the test names all five) |
| CI job "Traceability" | Planned | This PR's run (no slice touched → OK) |

## Findings on the changed line, instead of reviewdog (D-0046)

| Item | Status | Path / output |
|---|---|---|
| Line kept out of a finding's identity | Ran (local) | a base file without lines still matches: "1 findings on head, 0 new, 0 fixed, 1 old" |
| Annotation with file and line | Ran (local) | `::error file=platform/components/RichText/RichText.jsx,line=46,title=opengrep%3A new problem (pds-no-dangerously-set-inner-html)::…` |
| Escaping | Ran (local) | `file=a%2C b.js,line=7,title=eslint%3A new problem (no-x)::bad: thing, here%0Anext` |
## Ownership (2026-11-05)

| Item | Status | Path / output |
|---|---|---|
| Rule source | Ran (read) | ADR 0001 `planned:ownership`: "only pds1-ds-architect changes packages/*/package.json exports and packages/tokens/** tier files"; tier files still live in `platform/tokens/**/*.tokens.json` |
| No owned change | Ran (local) | OWNERSHIP_OK |
| Tier file changed, version bump only, no label | Ran (local, temporary commits) | the tier file fails; the version bump alone is not an API change |
| `exports` changed, no label | Ran (local) | OWNERSHIP_FAIL (2 owned changes) |
| With `agent:pds1-ds-architect` | Ran (local) | OWNERSHIP_OK |
| Merge queue (no labels) | Ran (local) | OWNERSHIP_SKIPPED (the PR's own run enforces it) |
| Required on main | Planned | After merge: ruleset 26593194 gets the second required check |
