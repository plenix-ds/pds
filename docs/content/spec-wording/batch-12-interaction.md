# Spec wording, batch 12: Interaction (24 questions)

Issue #120. Each question of the Interaction group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 18 of the 24 questions are already answered by text written after the questions were asked.
- 6 had one cause: four pages showed another page's write-up that does not fit them (Keyboard support showed the Focus ring write-up, Accessible names the Visually hidden one, Truncate and Clamp the Text type scale). They now show only their own text, use and avoid lines and examples (`parts/w00B.records.js`, `parts/w02B.records.js`). The pages that borrow a fitting write-up keep it: Keyboard navigation shows Focus order, Screen-reader behavior shows Live regions.
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Keyboard support | Own purpose and write-up | Own purpose (every action works from the keyboard alone); changed to show no borrowed Focus ring write-up. | Record; `w00B.records.js`. |
| Keyboard navigation | Show Focus order | Yes: it shows the Focus order write-up. | `docsFrom`. |
| Accessible names | Own write-up | Own purpose (every control has a name a screen reader reads); changed to show no borrowed Visually hidden write-up. | Record; `w00B.records.js`. |
| Screen-reader behavior | Show Live regions | Yes. | `docsFrom`. |
| Reduced motion | Fade or instant? | Instant: every animation and transition takes zero time; the "fade only" wording is gone. | Reduced motion text and Motion docs. |
| Scroll lock | Class or attribute? | The attribute: a locked target carries `data-plx-scroll-lock="locked"`; no page mentions `is-scroll-locked`. | `scrollLock.ts`; `scroll-lock.css`. |
| Use of color | Focus indicator | Reads: a 2px ring on controls and a border color change on fields. | Focus row. |
| Hotkey | Two bindings in one scope | The "innermost scope runs" sentence is gone from the page. | Hotkey docs. |
| Truncate | Own purpose | Own purpose (keeps long text from breaking the layout, the whole text stays in the page); changed to show no borrowed Text write-up. Clamp the same. | Record; `w02B.records.js`. |
| High contrast | Does subtle text change? | Yes: muted and subtle text take the default text color. | Overview and anatomy. |
| Scroll restoration | Rename? | Kept: it is the taxonomy leaf; its text names the three things an application keeps (the last screen, the pane width and the scroll position). | Record text. |
| Gesture interaction | Which way archives? | Toward the start of the line: left in left-to-right text, right in right-to-left. "Swipe left to archive" is the left-to-right example. | Gesture docs. |
| Semantic HTML | "A table is a DataGrid" | Reads: a DataGrid (sort, filter, group, search) or a Table (static). | Semantic HTML text. |
| Semantic HTML | Error row lists two things | The row names what the rule rejects without a closed list. | Semantic HTML docs. |
| Keyboard shortcuts dialog | Variants, rows, Mouse row | Each variant has real use and avoid lines (Grouped: a short list scanned at a glance; Searchable: many shortcuts looked up by name or key); the write-up is about shortcuts. | Variant pages; `w11C.docs.js`. |
| Captions and transcripts | Use and avoid; other pages' rows | Real use (a recording people need to follow) and avoid (decorative video with no speech); its rows are about captions and the transcript. | Record; docs. |
| Accessibility testing | "Default-state snapshots" | Reads: "Do not test only the resting state: check codes, numbers and other technical values also when their row or control is selected, hovered or in error." | Avoid line. |
| Accessibility testing | "Both themes" | Kept as the lasting rule; the order of work (dark mode last) is a scheduling rule, not a testing rule. | Use line. |
| Accessibility testing | Template sections | Own purpose and rows. | Docs. |
| Internationalization | Guidance row repeats the purpose | No guidance row remains. | Docs. |
| Collection view state | "Facet counts" | The sentence is no longer on the page. | Record. |

## Decision card

- **Applied:** the four pages stop borrowing a write-up; everything else stays. "Scroll restoration" keeps its name.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 13 is the Foundations group (24 questions), then the two extra lists, "Written since 2026-10-21" (11) and "Guidance for items not built yet" (19), one group per pull request.
