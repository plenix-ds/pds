# Spec wording, batch 3: Navigation (14 questions)

Issue #120. Each question of the Navigation group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- All 14 questions are already answered by text written after the questions were asked. No spec string needed to change in this batch.
- Nothing was changed in `platform/design-system/`. The record below is the evidence.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Navigation menu | Mega menu and side list on one page? | The page is about the mega menu only: many grouped links under a few top navigation items, with a `featured` area. | Record purpose and use. |
| Section navigation | Own purpose? | Yes: it moves between the sections of one page or the subpages of one area, with in-page links or a table of contents that marks where you are. | Record purpose. |
| Saved searches | Own purpose? | Yes: it saves a repeated search (its words and filters) under a name to run again in one step. | Record purpose. |
| Side navigation | Overlay on small screens? | On medium windows the pane opens over the page; on a phone it is a bottom bar and a screen of its own, never a drawer. | Record purpose. |
| Side navigation | Does focus move into the overlay? | No: focus is not moved into the overlay or the pane's screen, and is not trapped; Escape closes it. Bottom navigation says the same. | Side navigation behavior and Bottom navigation focus row. |
| Product navigation | Arrow keys and motion | Tab reaches the header, then the pane, then each row in turn; the pane folds and opens in place with no motion of its own. This agrees with Navigation menu and Side navigation. | Product navigation keyboard and motion rows. |
| Mobile app bar | "Below the Narrow class" | Reads: below 840px (Medium and Narrow windows) the header links leave the bar, which agrees with Application header. | Mobile app bar responsive row. |
| Tabs | "Always" contained | Reads: the contained variant by default; Folder tabs when the whole page body switches; Segmented tabs for a small switch inside a region. | Tabs use line. |
| Progress steps | Does compact show the name? | Yes: "Step 2 of 5: Review" over a bar of one segment per step. | Progress steps text and the Compact variant. |
| Filter bar | Chips only on the search page? | Yes. Filter panel, Quick filter and Command bar say no chips under the command bar, except on the Search workspace, where set filters show as chips. | Filter bar text; the three avoid lines. |
| Query builder | Symbol in the read-back | Operators are words; numbers keep the signs everyone knows (=, ≠, <, >), so "Size (MB) > 40" stays and the content row says so. | Query builder content row. |
| Query builder | "Rule 2" name | Each rule is a group named by its number ("Rule 2"); each control is named by its rule and its role ("Rule 2, Operator"). | Query builder name row. |
| Search result | "Wraps under the thumbnail" | The text keeps its own column beside the thumbnail at every width; the title and path end with an ellipsis, the snippet after two lines. | Search result responsive row. |
| Search result group | Contrast wording | The heading has the SectionHeading contrast; the count uses the muted text color, which keeps 4.5:1 on the page. | Search result group contrast row. |

## Decision card

- **Applied:** nothing to rewrite for the Navigation group; keep the strings as they are.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 4 is the Content group (25 questions), then the rest of `questions.md`, one group per pull request.
