# Architecture decision records

Owner: `pds1-ds-architect`. Gate G3 (plan §5) reads these files.

- One file per decision: `docs/adr/NNNN-<slug>.md`, numbered in order, never renumbered.
- Every ADR has five sections: **Context**, **Options**, **Decision**, **Consequences**, **Enforced by**.
- Status is one of `proposed`, `accepted`, `superseded by NNNN`. Only an `accepted` ADR passes G3.
- A change to an accepted ADR is a new ADR that supersedes it. The old file keeps its text and gets the new status.
- Every new public prop, export, CSS custom property, token tier or `/api/v1` shape needs an accepted ADR before merge. A PR without one gets REQUEST CHANGES.
- An engine swap (grid, charts, editor) also needs a throwaway spike, linked from the ADR.
- An ADR that settles a choice the owner could reverse is also logged in `decisions.yaml` with a decision card on its issue.

| ADR | Title | Status |
|---|---|---|
| [0001](0001-packages-and-dependency-direction.md) | Packages and dependency direction | accepted |
| [0002](0002-token-tiers-and-naming.md) | Token tiers and naming | accepted |
| [0003](0003-style-dictionary-token-build.md) | Style Dictionary is the token build | accepted |
| [0004](0004-state-layers-and-command-confirm.md) | State layer tokens and confirm on destructive commands | accepted |
| [0005](0005-data-color-on-surface.md) | Data colors on the surface (icons without a tile) | accepted (purple row superseded by 0007) |
| [0006](0006-logical-utilities-and-style-checks.md) | Logical utilities, and style checks 1, 4 and 5 | accepted |
| [0007](0007-data-color-slate.md) | `data-color-purple` is renamed `data-color-slate` | accepted |
| [0008](0008-shape-mark.md) | `shape-pill` is renamed `shape-mark` | accepted |
| [0009](0009-vote-tally-options.md) | VoteTally custom choice sets (`options`) | accepted |
| [0010](0010-app-shell-min-size.md) | AppShell minimum screen size notice (`minSize`) | accepted |
| [0011](0011-typescript-source.md) | Plenix's source is TypeScript; declarations come from `tsc` | accepted |
| [0012](0012-token-rename-mechanics.md) | Token rename mechanics and the names of the palette scales | accepted |
| [0014](0014-control-raised-shadow.md) | `plx-sys.control-raised-shadow`, one light elevation for raised buttons | accepted |
