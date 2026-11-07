# Decisions, one file per decision (#955)

- A new decision is a new file, `decisions.d/D-NNNN.yaml`, named for its id. Two PRs that each add a decision never touch the same file.
- Take the id from `node tools/decision-id.mjs`: one past the highest on main and in the open PRs.
- The file is one YAML mapping with the fields `decisions.yaml` uses: `id`, `date`, `area`, `decided_by`, `decision`, `options`, `why`, `status`, `superseded_by`, `check`. One line per field.
- Never rewrite a past decision: supersede it with a new file, and set the old one's `status: superseded` and `superseded_by`.
- `decisions.yaml` is read with this folder until its entries move here (#955 PR 2).
- Enforced by `tools/ci/check-decisions.mjs` (CI job "Decisions"): valid YAML for the dashboard's parser, unique ids, the file named for its id, past entries unchanged, and no new id already taken on main.
