No tests: see HANDOFF.md (the owner runs them)

# Task #117: DataTable fixes for RedSave, the rest (Codex)

Tracker: https://github.com/plenix-ds/plenix-platform/issues/117 · Plan of record: https://github.com/plenix-ds/plenix-platform/issues/3

### Owner

Codex

### The task

The rest of RedSave's DataTable list (`Redsave-v1/docs/plenix-datatable-issues.md`; GitHub #76–#89), after your
high-impact fixes (#101, released in 0.38.0). Each keeps today's behavior when the new option is not used.

| GitHub | Issue | The fix |
|---|---|---|
| #76 (DT-5) | Can't group by a multi-value field (tags) | `groupBy` on a `multi` field repeats the row in each of its groups; selection stays by record (one record selected once, whatever group it shows in); GroupPanel offers multi fields |
| #77 (DT-6) | Quick filters don't count their matches | `useCollectionView` works out each QuickFilter option's count from the rows it filters, within the other active filters (faceted); an app's own `count` still wins |
| #79 (DT-8) | The list layout switch is fixed at 600px of the table's width | `narrowAt` (a size token or px) and `narrow="auto"` (switch only when the key columns no longer fit) |
| #83 (DT-12) | No convention for deleted or missing values | `empty` per column (the text for a missing value) and a standard "deleted" look (muted, italic) through a cell kind `deleted` |
| #84 (DT-13) | No file-size column type | `type: "bytes"`: formatBytes in Reddit Mono, right-aligned, sorted and filtered on bytes; the filter accepts "> 2 MB" |
| #85 (DT-14) | No undo for destructive row and selection actions | an `undo` handler on row-menu and selection actions: the action runs, a toast says what happened with Undo (useUndo and the toast, as DeleteFlow does) |
| #86 (DT-15) | Rich cells are one React portal per cell | portals only for rows in view (the virtual rows), plus built-in cell kinds that need no portal: avatar + name, tag chips, badge |
| #89 (DT-18) | Column `width` only takes numbers | a CSS length string or a size token name (`"--plx-ref-size-30u"`, `"12ch"`), converted for the legacy grid |
| — | Wave 13 A found: a selectable DataTable that is off-screen and receives `sort`, `groupBy` or `columnOrder` loses its row checkbox labels (axe: missing labels) | Keep the checkbox labels through those updates |

Write each fix where the code already lives; keep the style of the files. New tokens go in a new
`platform/tokens/components/data-table-cells.tokens.json`; new words in the component's `strings`.

### Files you own

- `platform/components/DataTable/` (DataTable.jsx, data-table.css, legacy-grid.js, strict.js, floatingScroll.js)
- `platform/hooks/useCollectionView.js`
- `platform/patterns/CommandBar/panel-parts.jsx` and the GroupPanel/QuickFilter code it holds (only for DT-5 and DT-6)
- `platform/tokens/components/data-table-cells.tokens.json` (new)
- `tests/data-table.test.js` (add cases for each fix) and new tests of your own under `tests/`
- `lanes/dt-rest/design-system/parts/wDTR.records.js` (new example cards on the existing data-table record, through
  `H.record('data-table')`; do not edit inventory.js)

Never edit generated files, and nothing in `dam/` or the other applications.

### Done means

- The quick gates pass: `node tools/agent/lane-overlay.js`, `node build-app.js`, `node check-system.js` (SYSTEM_OK),
  `node check-spec.js` (SPEC_OK); `node --check` on every JS file you wrote.
- `node tests/data-table.test.js` passes with your new cases (every existing table view still passes).
- No generated file in the branch (CI: GENERATED_OK). If CI cannot start, say so in the pull request.
- One pull request from branch `codex/117-datatable-rest`, `Closes #117`, listing per DT number what changed and how an
  app uses it, anything left undone, and **Needs the owner** (the deleted look, the cell kinds' looks).

### Read first

1. `AGENTS.md`
2. `tools/agent/web/BRIEF-web.md` (house rules)
3. Your own #101 changes, and the header comments of `DataTable.jsx` and `useCollectionView.js`
