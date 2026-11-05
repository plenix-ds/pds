# Evidence: #449, gate G3 through the `g3-changes-requested` label

| Item | Status | Path / output |
|---|---|---|
| Label exists | Ran | `gh api repos/plenix-ds/pds/labels/g3-changes-requested` (created by the DS Architect) |
| G3 label only | Ran (local) | `PR_LABELS='["g3-changes-requested"]'` → G2_FAIL (g3-changes-requested), the DS Architect's message, exit 1 |
| G2 label only (unchanged) | Ran (local) | → G2_FAIL (g2-changes-requested), the Design Director's message |
| Both labels | Ran (local) | → two errors, G2_FAIL (g2-changes-requested, g3-changes-requested) |
| Neither | Ran (local) | `["phase-0"]` → G2_OK |
| Merge queue, G3 label | Ran (local; label added to merged PR #391, then removed) | `MERGE_BRANCH=gh-readonly-queue/main/pr-391-abc` → G2_FAIL (g3-changes-requested) |
| Check name kept: `G2 (design review)` | Decided | The ruleset requires that exact name; renaming would leave queued PRs waiting for a check that never reports |
