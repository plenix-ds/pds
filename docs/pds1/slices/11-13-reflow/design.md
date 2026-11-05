# #11 and #13: reflow at 320px (bookstore, directory, document): the fix design (G2)

- **What it's for:** WCAG 1.4.10. At a 320px window no page scrolls sideways and nothing is cut. Owner, 2026-11-05 18:15: these don't wait for an owner test run; CI runs the checks on the PR.
- **Extends:**
  - `platform/standards/fit-and-overflow.md` (the ladders, §2);
  - NavPane's bottom navigation bar (`.plx-nav-bar`);
  - BulkActions, DataToolbar, ResourceList, Pagination.
- **The pages:** St. John `#/bookstore` (#11), `#/directory` (390px wide at 320) and `#/document/d1` ("Browse" cut in the bottom bar) (#13).

## 1. Measure first (red)

- The engineer's first commit is the failing check: the reflow check on these three pages at 320px, LTR and RTL. It records the widest element (selector, its width and its min-content width) and any label cut without an ellipsis.
- The fix follows the part it names. No part is changed on a guess.

## 2. The fix for each part (whichever the measurement names)

| Part | What reading the code finds (2026-11-05) | Fix (ladder, fit-and-overflow §2) |
|---|---|---|
| NavPane bottom bar label ("Browse", #13) | Items share the width (`flex-basis 0`, grow 1, min 44px = `control-target-min`), so 5 items fit 320px. The label has no overflow rule, so a long label overflows its item and is cut by its neighbour or the edge | **Text label ladder:** the label wraps to 2 balanced lines inside its item (`text-wrap: balance`, `overflow-wrap: anywhere`); past 2 lines it ends in an ellipsis with the full name in the Plenix Tooltip (`useTruncated`). The bar's block size grows to fit 2 lines (min stays `nav-bar-height`). Never hide the label: the bottom bar always labels its destinations |
| BulkActions (directory) | An action bar that never wraps | **Action bar ladder:** the secondary actions move into "More actions" (priority order). The count text ("3 of 24 households selected") follows the text label ladder: 2 lines, then an ellipsis |
| DataToolbar (directory: chips + a count) | A toolbar, one row | **Toolbar ladder.** The `start` TagList follows the tags ladder (its chips wrap to new rows, 8px apart, inside the start region). The `end` text follows the text label ladder. When start and end don't fit side by side, `end` moves under `start` (the same move as a label above its control, §4). The bar itself stays one region per row and is never cut |
| ResourceList row (directory, bookstore) | A name, a description and a meta pill in one row | Name and description: text label ladder (2 lines, then an ellipsis). The meta (DataPill) keeps its full width and moves under the text below 360px, the container width §4 uses |
| Pagination | Already wraps (`flex-wrap`) | No change, unless the measurement names it |
| Tabs (bookstore) | Already folds into More | No change, unless named |
| A site-only element (not a Plenix part) | — | A st-john-test-site PR plus the CI pin, as plenix-ds/plenix-platform#826 did. Plenix doesn't change |

## 3. States and edge cases

- **Hover, focus, active, current and disabled** keep their existing tokens. Only the layout changes.
- **A wrapped nav bar label:** the focus outline covers the taller item (existing outline tokens).
- **Tooltip** only while cut (`useTruncated`). Loading, error, selected and empty: n/a (layout only).
- **3x English:** every label in the parts above reaches step 2 or 3 of its ladder; nothing overlaps and nothing scrolls sideways.
- **Arabic and RTL:** the same ladders on logical sides; the ellipsis sits at the start-side end (fit-and-overflow §6).
- **10,000 rows:** n/a; ResourceList pages and DataGrid scroll inside their own frames.
- **Densities:** compact, standard and comfortable change only heights. The nav bar keeps the 44px target in every density.
- **Also fix while there** (a DESIGN.md defect): `nav-pane.css` uses physical `border-left/right/top/bottom` on `.plx-nav-bar__item`. Use the logical forms (same look).

## 4. The engineer must not invent

- No new token, colour or size. The 2-line label uses the existing `nav-bar-label-line-height`; a new comp alias needs the DS Architect.
- Don't hide a bottom bar label, don't add a second toolbar row other than `end` moving under `start`, and don't change a part the measurement doesn't name.

## Evidence

- **Planned:**
  - the reflow check red, then green, on the three pages, LTR and RTL;
  - CI visuals light and dark at standard density, plus RTL (the change touches text layout).
