# Spec wording, batch 1: Layout (15 questions)

Issue #120. The owner chose small batches, one group of parts at a time (2026-10-24). Batch 1 is the Layout group of `questions.md`. Each question was checked against the text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- All 15 questions are already answered by text written after the questions were asked (the styling and layout work of late October). No spec string needed to change in this batch.
- Nothing was changed in `platform/design-system/`. The record below is the evidence.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Grid | Two grids (`.plx-layout-grid`, `.plx-page-grid`) with different breakpoints? | Both belong on the page. The content grid follows the main region (4, 8, 12, 16 columns at 600, 1024, 1440px); the layout grid follows the window outside the shell (4, 8, 12 columns at 600 and 840px). | The Grid record text names both and says which applies where. |
| Grid | 1200px contained grid against the 960px contained layout? | Two different things on purpose: `--contained` stops the layout grid at 1200px; a page in the contained layout mode is one centered column at the 960px form width. | The Grid record text says so in one sentence. |
| Grid | Do Columns collapse? | Columns stay side by side unless `collapseBelow` is set, then stack under 600px (medium) or 840px (wide). | Grid and Columns record texts agree. |
| Dashboard grid | Does the handle menu exist? | Yes: a click on the handle, Enter or Space opens Move earlier, Move later, Move to the start, Move to the end (WCAG 2.5.7). | `WidgetGrid.jsx` header and the Dashboard grid record text. |
| Dashboard grid | Which purpose? | The overview describes the dashboard page; the purpose describes the widget grid (arranging and reordering widgets). Both stay: they describe the page and its part. | Record text and purpose. |
| Dashboard grid | "Every widget" avoid line | Already reads: "Making every widget wide: the grid turns into one column. If all widgets need room, choose fewer columns instead." | `variantPages[4].avoid[0]`. |
| Panel | Overview describes PageContent and Center | Panel's overview now describes Panel (a titled, bordered surface, with header actions, an optional footer and folding). | Panel record text. |
| Panel | Purpose copied from Stack and Grid | Removed; Panel has no copied purpose. | Panel record. |
| Panel | Toggle focus style | The collapse toggle shows the Plenix focus ring (`.plx-panel__toggle:focus-visible`, `.plx-card__toggle:focus-visible`). The old "no focus style" sentence is gone. | `card.css` lines 55 and 75. |
| Columns | Overview and purpose describe a two-pane workspace | They now describe Columns (two or three equal columns, or a narrow sidebar beside the main column). | Columns record. |
| Columns | "Lists read one at a time" use line | Gone from Columns; one use line remains. | Columns record. |
| Spacer | Shows the Stack write-up | Spacer has its own text and purpose (push, Toolbar.Spacer) and no copied Stack write-up: the write-ups are keyed by record id. | Spacer record; `inventory-docs.js` has no Spacer entry. |
| Inset | Shows the Stack write-up | Same: its own text and purpose (inset tokens, Bleed). | Inset record. |
| Full-screen workspace | Placeholder variant text | The variant now says what it is: the task takes the whole window, the header and panes step aside, and Close returns. | `variantPages[0]`. |
| Sticky | "Only while stuck" against the Always variant | The overview already says "by default shows a shadow only while it is stuck; it can show the shadow always, or never". | Sticky record text. |

## Decision card

- **Applied:** nothing to rewrite for the Layout group; keep the strings as they are.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 2 is the Forms group (21 questions), then Navigation (14), Content (25) and the rest of `questions.md`, one group per pull request.
