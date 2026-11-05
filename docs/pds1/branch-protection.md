# Branch protection on `main` (P0-5, #187)

`main` is protected by a **repository ruleset**, not classic branch protection, because the merge queue only exists in rulesets. So `gh api repos/plenix-ds/pds/branches/main/protection` returns 404 by design.

## Check it

```bash
gh api repos/plenix-ds/pds/rulesets/26593194 -q '{enforcement, bypass: (.bypass_actors|length), rules: [.rules[].type]}'
gh api repos/plenix-ds/pds/rules/branches/main -q '[.[].type]'
```

## Rules (ruleset 26593194, active)

- **Required checks:**
  - `CI result` (from `.github/workflows/ci.yml`). It fails when any check fails, is skipped or is cancelled.
  - `Ownership (token tiers and public API)` (from `.github/workflows/ownership.yml`): a PR that changes token tier files or a package's `exports` needs the `agent:pds1-ds-architect` label (ADR 0001). It re-runs when labels change.
- **Merge queue:** squash only, all-green grouping, up to 5 entries per group. CI runs again on `merge_group`.
- **Pull request required:** no approvals needed (D-0014: CI is the gate).
- **No deletion and no force push** of `main`.
- **No bypass actors** (D-0022). Agents share the owner's GitHub identity, so a bypass would let them skip CI.

## Repository settings

- Auto-merge is on. Every PR author runs `gh pr merge --auto` when opening the PR (#220).
- Head branches are deleted after merge.
- Actions are limited to GitHub-owned actions, and every action must be pinned to a commit SHA (`sha_pinning_required`).

## Change it

Changes go through a PR to this file, by `pds1-release-architect`, with a new `decisions.yaml` entry when the rule itself changes.
