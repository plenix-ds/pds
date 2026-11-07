# Decisions, one file per decision (#955)

- A new decision is a new file, `decisions.d/D-NNNN.yaml`, named for its id. Two PRs that each add a decision never touch the same file.
- Take the id from `node tools/decision-id.mjs`: one past the highest on main and in the open PRs.
- The file is one YAML mapping with the fields `decisions.yaml` uses: `id`, `date`, `area`, `decided_by`, `decision`, `options`, `why`, `status`, `superseded_by`, `check`. One line per field.
- Never rewrite a past decision: supersede it with a new file, and set the old one's `status: superseded` and `superseded_by`.
- Later dates win. Every decision names the check that enforces it, or `review-only (<reason>)`; `check: planned:<name>` names a check still to build.
- `decisions.yaml` is retired: its 100 entries moved here unchanged (#955 PR 2), and adding it back fails the check.
- Shown on the dashboard (plan §6a; `dashboard/pds1/collect.py`).
- Enforced by `tools/ci/check-decisions.mjs` (CI job "Decisions"): valid YAML for the dashboard's parser, unique ids, the file named for its id, past entries unchanged, and no new id already taken on main.
