# Spec wording, batch 4: Content (25 questions)

Issue #120. Each question of the Content group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 24 of the 25 questions are already answered by text written after the questions were asked.
- One needed a change: the Audio page still showed the Video player's shared text ("Lets people watch a video or listen…"), a use line that repeated it and the placeholder "Keep sources and actions explicit." It now has its own text, use and avoid lines (`platform/design-system/parts/w12B.records.js`).

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Text | Seven roles or thirteen? | The overview lists every role: body, secondary, caption, data, label, strong, heading, title, display, lead, eyebrow, accent, success, danger, link. | Text record; `Text.tsx` header. |
| Text | Data size | 12px on its own (the secondary size); inside a sentence it takes the size around it. | Data variant; `Text.tsx`. |
| Text | Data font in a property list | In a property list, the item's own `data` option sets the data font at the value size. | Data variant avoid line; Property list use line. |
| Text | Write-up repeated on seven pages | Kept as one shared write-up shown on each page (`docsFrom`); the pages do not carry separate copies to drift apart. | Decision below. |
| Heading | Two size lists | Heading levels 2 to 4 are 18, 15 and 13px; SectionHeading levels 2 to 4 are 13, 11 and 10px. The two lines now name which component each is for. | Heading use lines. |
| Heading | Purpose covers only the small label | The record has no purpose that covers only the label; the page covers Heading and SectionHeading. | Heading record. |
| Code block | Inverse or default surface? | The page surface, as the parts list says. | Code block text. |
| Avatar | 2xs missing from usage | The usage line names every size: 2xs 20, xs 24, sm 28, md 32, lg 40, xl 48, 2xl 64. | Avatar use line. |
| Avatar | Write-up repeated on User identity | Shared by `docsFrom`; see the decision below. | Decision below. |
| Property list | Technical value on whose baseline? | The same baseline as its label. | Property list use line. |
| Property list | "DataGrid, not PropertyList" | The contrast row no longer says it. | Property list docs. |
| Property list | Write-up repeated on four pages | Shared by `docsFrom`; see the decision below. | Decision below. |
| Thumbnail | Broken picture | A picture that fails to load shows the icon, as when there is none. | Thumbnail error row. |
| Skip link | Own purpose | Yes: lets keyboard users jump past the header and navigation to the main content. | Skip link record. |
| Paragraph | Does "lead" exist? | Yes: `Text variant="lead"`, body text one step up (15px), for the opening paragraph. | `Text.tsx` header. |
| Caption | One line or two? | At most two lines on every page. | Caption variant avoid line. |
| Truncated text | Do lines and Show more exist? | Yes: `lines` 2, 3 or 4 and `expandable` are props of Text. | `Text.tsx` header. |
| Online status | Own purpose | The page has no copied presence purpose. | Online status record. |
| Presence | Write-up repeated on Online status | Shared by `docsFrom`; see the decision below. | Decision below. |
| Swatch | Can pages use a picking swatch alone? | The picking form belongs to ColorPicker, which groups the swatch buttons and marks the chosen one; the avoid line says so. | Swatch avoid line. |
| Timestamp | Who is a Tab stop? | A timestamp with its tooltip is a Tab stop; the tooltip is on by default for relative times and date labels. | Timestamp focus row. |
| People group | "Source" on the Team page | The responsive row names only the name and description for a Team; a source belongs to the Group. | People group docs. |
| Image gallery | Own text | Yes: images in responsive columns or justified rows, with an optional full-screen preview; its own use and avoid lines. | Image gallery record. |
| Video | Own text | Yes: its use says "a recording people watch, with captions and a transcript"; its avoid lines point to Audio and Image. | Video record. |
| Audio | Own text | Changed in this batch: plays a recording with a transcript and speed control; use for podcasts and voice notes; avoid for recordings people need to watch (use Video). | `w12B.records.js`. |

## Decision card

- **Applied:** the Audio text above; everything else stays.
- **Shared write-ups (`docsFrom`):** several pages show one write-up on purpose (the text styles, Avatar and User identity, the Property list pages, Presence and Online status). Applied: keep one source per group, so the copies cannot disagree. To give a page its own write-up, reply on #120 with its name.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 5 is the Data display group (29 questions), then the rest of `questions.md`, one group per pull request.
