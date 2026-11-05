# Evidence: #396, gate G2 through the `g2-changes-requested` label (D-0056)

| Item | Status | Path / output |
|---|---|---|
| Label created | Ran | `gh api repos/plenix-ds/pds/labels/g2-changes-requested`: `g2-changes-requested B60205` |
| RED: PR labeled | Ran (local) | `PR_LABELS='["phase-0","g2-changes-requested"]' node tools/ci/check-g2.mjs` → G2_FAIL, exit 1 |
| GREEN: PR not labeled | Ran (local) | `PR_LABELS='["phase-0"]'` → G2_OK, exit 0; `[]` → G2_OK |
| Merge queue, no label | Ran (local) | `MERGE_BRANCH=gh-readonly-queue/main/pr-345-abc` → "merge queue: PR #345", G2_OK |
| Merge queue, labeled | Ran (local; label added to merged PR #391, then removed) | `MERGE_BRANCH=gh-readonly-queue/main/pr-391-abc` → G2_FAIL, exit 1 |
| Unreadable queue branch | Ran (local) | `MERGE_BRANCH=main` → G2_FAIL (never a pass) |
| Its own workflow, not a ci.yml job | Decided | Re-runs on labels in seconds; ci.yml (about 14 jobs) is not re-run on every label change. Same blocking: a required check on `main` |
| Required on `main` | Planned | After merge: ruleset 26593194 gets `G2 (design review)` |
