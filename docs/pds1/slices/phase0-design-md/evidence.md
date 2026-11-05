# Evidence: DESIGN.md v0 (#199)

- **Ran:** contrast of text roles × surfaces, light and dark, from `platform/tokens` (WCAG 2 relative luminance) → `contrast-v0.txt`.
- **Ran:** `DESIGN.md` front matter and `decisions.yaml` parse as YAML; `design.rules.json` parses as JSON (python yaml/json, this session).
- **Ran:** grep of `platform/tokens` for `font-size-09|10|11` (24 files) and of DataGrid/DataPill CSS for `tabular-nums`, `white-space`, `min-block-size`.
- **Skipped:** `node check-system.js`: the PR changes no CSS or tokens.
- **Planned:** lint checks 1-12 read `DESIGN.md` + `design.rules.json` (DS Architect, #178).
- **Planned:** defect fixes from DESIGN.md §12, each with a failing test first (issues linked on #199).
- **Manual:** none. No pictures: no look changed (D-0016).

## G2 state matrix (for this change)

DESIGN.md is a contract, not a component: the state cells are n/a(documentation change). §9 defines the matrix every component must fill.
