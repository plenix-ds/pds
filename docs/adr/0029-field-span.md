# ADR 0029: A textarea fills its row; no Field `span` until Plenix owns a field grid

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on CTM's report (#947, S2), the Product Lead's intake (D-0078, Microsoft first) and CE1's finding on PR #953. Decision D-0105 (owner may switch).
- **Issue:** #947

## Context

- **Two kinds of "two columns":**
  - `Form layout="two-column"` puts each label beside its control. It never puts two fields side by side.
  - `Columns` (`count` 2 to 4) is Plenix's only side-by-side grid. It's a layout primitive, not a form grid.
- **CTM's form** puts its fields side by side in its own grid (`ctm-case-edit-grid`), not in `Columns`. Its Children field already spans both columns there.
- **The actual defect:** the Textarea is capped by the single-line field cap `--plx-comp-input-max-width` (`size-150u`, 600px), so it stops at about 80% of a wide row.
- A `span` prop on Field acts only inside a Plenix grid, so it would do nothing for CTM.

## Options

| Option | For | Against |
|---|---|---|
| A. `Field.span?: 1 \| 2 \| 3 \| "full"`, long text `"full"` by default | Ready when Plenix owns a form grid | No Plenix form grid exists, and CTM's grid is its own. A prop with no effect for the reporting app. |
| B. A full-row wrapper in `Columns` | Keeps Field unaware of grids | Same: CTM doesn't use `Columns`. |
| **C. The Textarea fills its row: the single-line cap doesn't apply to it** | Fixes what CTM sees, in any grid, with no new API. The Field's own form cap (`app-shell-context-form-max-width`) still bounds it. | A textarea in a wide one-column box is wider than before (on purpose: it lines up with the form's edge). |

## Decision

**Option C** (D-0105, switched from A on 2026-11-07 after #953's finding; reply A or B on #947 to switch back).

- **CSS (`input.css`):** `.plx-input.plx-input--textarea` sets its max inline size to its container (`--plx-state-input-max-inline-size: 100%`). Single-line inputs keep the 600px cap.
- **No new prop, token or export.**
- **Later:** if Plenix gets a multi-column field grid (for example `FormSection columns`), `Field span` is decided then, in a new ADR.

## Consequences

- **Semver: MINOR**, a visual change (*Changed*): a Textarea ends at its row's inline end, in LTR and RTL.
- An app that wants a narrower textarea sets `width` on it, or puts it in a narrower cell.

## Check

- `tests/textarea-span-947.test.js` (PR #953, test first): in a two-column grid of fields at 900 and 1400px, the Textarea's inline-end edge equals the grid's, LTR and RTL; one-line fields keep their 600px cap; at 320px nothing overflows.
