# Architecture decision records

Owner: `pds1-ds-architect`. Gate G3 (plan §5) reads these files.

- One file per decision: `docs/adr/NNNN-<slug>.md`, numbered in order, never renumbered.
- Every ADR has five sections: **Context**, **Options**, **Decision**, **Consequences**, **Enforced by**.
- Status is one of `proposed`, `accepted`, `superseded by NNNN`. Only an `accepted` ADR passes G3.
- A change to an accepted ADR is a new ADR that supersedes it. The old file keeps its text and gets the new status.
- Every new public prop, export, CSS custom property, token tier or `/api/v1` shape needs an accepted ADR before merge. A PR without one gets REQUEST CHANGES.
- An engine swap (grid, charts, editor) also needs a throwaway spike, linked from the ADR.
- An ADR that settles a choice the owner could reverse is also logged in `decisions.yaml` with a decision card on its issue.

## The index

- The list of ADRs is generated from the files, never committed: `node tools/ci/adr-index.mjs` prints it (number, title, status), in number order.
- A committed table made every ADR PR edit this file, so two ADR PRs queued together conflicted (#955, #956).
- CI runs `node tools/ci/adr-index.mjs --check`: every ADR starts with `# ADR NNNN: <title>` matching its file name, has a `- **Status:**` line, has a number of its own, and this file holds no table.
