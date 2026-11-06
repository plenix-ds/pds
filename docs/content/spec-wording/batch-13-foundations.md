# Spec wording, batch 13: Foundations (24 questions)

Issue #120. Each question of the Foundations group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 20 of the 24 questions are already answered by text written after the questions were asked.
- 4 had one cause: Heading hierarchy, Sizing scale, Content widths and Responsive sizing showed a write-up that does not fit them (the SectionHeading write-up, and the Spacing write-up about gaps). They now show only their own purpose, text, use and avoid lines and examples (`parts/w00A.records.js`, `parts/w00B.records.js`).
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Control heights | Role names | inline, toolbar, standard, prominent, dialog and dialog-destructive. | Control heights use line. |
| Layers | Order | behind, base, raised, sticky, menu, overlay, modal, popover, toast, critical, on both lines. | Layers use line. |
| Heading hierarchy | Own purpose; default label size | Own purpose (an outline: one page title, then sections in order); changed to show no borrowed write-up. The default label (level 3) is 11px bold; level 4 and a plain label are 10px. | Record; Heading contrast row. |
| Font size | rem or px? | rem (`--plx-ref-font-size-09` to `-20`), so text follows the person's font settings; the parts list says "in rem". | Typography anatomy; `reference.tokens.json`. |
| Font weight | Unclear sentence | Four weights, each with its role: regular for body text, medium for row names, semibold for labels and headings, bold for page titles. | Font weight text. |
| Sizing scale | Numbers in props | A size prop names a size token; a number in a stylesheet or a prop snaps to the nearest step. The raw-number rule is for stylesheets. Own text, changed to show no borrowed write-up. | Sizing scale text. |
| Icon | Optical size 24 | In the app header, in Comfortable density and for the large sizes. | Icon text. |
| Semantic, Component, State, Theme and Responsive tokens; the typography pages; the spacing pages | Shared family write-up | Kept on purpose: each family page shows its family's write-up, so the copies cannot disagree; each page has its own purpose line. | Decision below. |
| Content widths | Own purpose | Own: content widths cap how wide text and page content can grow. Changed to show no borrowed write-up. | Record. |
| Responsive sizing | Own purpose; "columns never change" | Own: sizes follow the person's font size, the density and touch. | Record. |
| Icon alignment | Show the Icons write-up | Yes, by `docsFrom`. | Record. |
| Surface fills | Show Surface colors | Yes, by `docsFrom`. | Record. |
| Border style | Token names | Components use `--plx-sys-border-style-solid` and `-dashed`, which point to `--plx-ref-border-style-*`; both exist. | Border style text. |
| Border color | Which border for a control? | The text names the control edge for controls and the default and subtle borders for separation. | Border color text. |
| Shape treatment | Badges | Badges and chips use 4px corners; nothing is fully round. | Shape treatment text. |
| Easing | Shared parts list | The Motion parts list names the durations (instant, quick, fast, base, slow), both easings, the enter scale and the stagger delay. | Motion anatomy. |
| Status colors | Do not disturb | Presence has five roles: online, away, busy, do not disturb (red) and offline. | Status colors text. |
| Illustration | May a drawing add information? | No: it is decorative only; anything it shows is also said in the text. | Illustration use and avoid lines. |
| Type styles | "Secondary" style | Secondary exists (12px); the list includes it. | Type styles text. |
| Content style | Template rows | Own purpose and rows about rules for words. | Content style docs. |
| Content style | Sub-pages repeat the main page | Each sub-page has its own guidance. | Variant pages. |
| Design principles | Guidance row repeats the purpose | Own purpose and rows. | Design principles docs. |

## Decision card

- **Applied:** four pages stop borrowing a write-up that does not fit; the family pages keep their shared write-up. Everything else stays.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 14 is "Written since 2026-10-21" (11 questions), then "Guidance for items not built yet" (19 questions), one list per pull request.
