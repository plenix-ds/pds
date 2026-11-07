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
| [0013](0013-variant-records.md) | Every variation as its own record (derived ids, side tables, API) | accepted |
| [0014](0014-print-document-parts.md) | Print parts: PrintDocument, AnswerLines, PageBreak | accepted |
| [0015](0015-variant-styles.md) | Each variation documents the styling properties it sets | accepted |
| [0016](0016-datagrid-editing.md) | DataGrid editing: nine cell editors, Inline and Form Edit | accepted |
| [0017](0017-delete-flow-undo-duration.md) | DeleteFlow's undo window: `undoDuration` and `plx-sys.undo-duration` | accepted |
| [0018](0018-commandbar-selection-add.md) | CommandBar with rows selected adds the selection's commands, it doesn't swap | accepted |
| [0019](0019-contentgrid-virtualized.md) | ContentGrid draws only the cards in view (`virtualized`) | accepted |
| [0020](0020-mediaviewer-get-item.md) | MediaViewer builds only the shown item (`count` and `getItem`) | accepted |
| [0021](0021-datagrid-paste-fill-undo.md) | DataGrid paste, fill and undo (`editing.paste`, `.fill`, `.undo`) | accepted |
| [0022](0022-datagrid-row-actions-inline.md) | DataGrid shows row actions as icons on hover (`inline` on a row menu item) | accepted |
| [0023](0023-appshell-frame.md) | AppShell `frame`: the full window, or a centered frame a person can expand | accepted |
| [0025](0025-datagrid-column-description.md) | DataGrid column `description`: the header's tooltip and accessible description | accepted |
| [0026](0026-generic-choice-values.md) | Choice controls are generic over their option values | accepted |
| [0027](0027-textarea-label.md) | Textarea `label`: its accessible name when nothing else names it | accepted |
| [0028](0028-date-timestamp-unit.md) | Dates read one way in columns and filters; `timestamp: "s"` for Unix seconds | accepted |
