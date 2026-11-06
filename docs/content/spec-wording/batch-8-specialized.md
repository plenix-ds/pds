# Spec wording, batch 8: Specialized (36 questions)

Issue #120. Each question of the Specialized group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 35 of the 36 questions are already answered by text written after the questions were asked.
- One needed a change (the question that asks all the pages in this part): variant pages that said only "Use this composition when it fits the task." and "Keep generated content identified and actions explicit." now say what each variant shows and when to use it. 20 variants on 8 pages changed: AI label, Generated content, Prompt history, Citation, Suggested action, AI search, Recommendation and Export dialog (`parts/w14B.records.js`, `parts/w11C.records.js`).
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Typing indicator | Left and right | The variants say "on the start side" and "on the end side". | Variant pages. |
| Asset grid | Shows the template's write-up | Own text: the Asset Manager's content grid of media cards, switching to the table for details. | Record text and purpose. |
| Asset browser | Template purpose | Own text: the Asset Manager, with categories in the navigation pane, assets in a grid or table, details in the inspector. | Record text and purpose. |
| Thumbnail | Shows the asset card's write-up | Own text: a small picture beside a name, in a table cell or row; an icon when there is no picture. | Record text and purpose. |
| Notification center | Bell or section of the page? | A section of the page: notifications newest first, unread ones marked. | Record text. |
| Share dialog | Variant pages | Each variant says what it does (People: adds people by name and sets roles; Link: copies a link and sets who it works for) with its own use and avoid lines. | Variant pages. |
| Share dialog | Sentences about tours and checklists | None remain in the write-up. | `parts/w11B.docs.js`. |
| Asset gallery, Download manager, Media player, Metadata editor, Related assets | Shared rows and generic variants | Each page has its own write-up, with none of the other pages' words (forms, FileRow, Carousel, metadata actions); the variants of those pages have their own text. | `parts/w12B.docs.js`. |
| Media player, Audio player | One purpose; own text for Audio | Audio has its own text (batch 4); Video and Audio are variants of the Media player. | Batch 4 record. |
| File picker | Which assets belong here? | Asset picker is the file picker's Assets mode: only managed assets, the files kept with their metadata. | Record text and the Assets variant. |
| Rendition list | Shared rows | Own write-up. | `parts/` docs. |
| Document viewer | Office files | The use lines name PDFs, page images and text; formats it cannot render are offered as a download. | Record use and avoid. |
| Commerce | Title against the ten-page overview | The page is the family page: ten shop pages, each its own variant. | Record text. |
| Presence bar | Comment write-up | Own write-up: no drafts, composer or comment actions. | `parts/w13B.docs.js`. |
| Comment, Comment thread, Image annotation, Presence bar | Same sentence on every variant | Each variant has its own description and use line (Default, Own, Edited, Resolved, With reactions; Viewers and Editors). | Variant pages. |
| Announcement, Audit log, Approval workflow, Mention input | One shared write-up | Each has its own write-up. | `parts/w13C.docs.js`. |
| Version history | File write-up | Own use and avoid lines about versions, restore and Audit history. | Record. |
| AI disclaimer | Dismissal sentence | The sentence is no longer on the page. | AI disclaimer docs. |
| Prompt input, AI chat, Streaming text, Assistant panel | Shared lines | Each page has its own write-up. | `parts/w14A.docs.js`. |
| All pages in this part | Generic variant use and avoid lines | Changed for the 20 variants named in the Result; no other page in this part has them. | Records. |

## Decision card

- **Applied:** real use and avoid lines for the 20 variants above; everything else stays.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 9 is the Page structures group (15 questions), then Implementation (27), Patterns (17), Interaction (24), Foundations (24) and the two extra lists, one group per pull request.
