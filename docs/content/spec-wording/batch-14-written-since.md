# Spec wording, batch 14: Written since 2026-10-21 (11 questions)

Issue #120. Each question of this list in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 3 of the 11 questions are already answered by text written after the questions were asked.
- 8 needed a small fix, each checked against the code (`parts/w00B.records.js`, `inventory.js`, `inventory-docs.js`, `parts/w05C.docs.js`, `parts/w10C.docs.js`, `parts/w12C.docs.js`, `parts/w15C.docs.js`).
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Wizard dialog | Unsaved-changes check: required or optional? | Neither always: it applies when there is unsaved work. The anatomy now says so. | Changed. |
| Accessible names | "Words the layout shows" | Reads: words a screen reader needs that the layout does not show. The `label` part has its own condition (when there is no visible text). | Changed. |
| Tabs | Contained and Folder tabs | Two variants. Contained is the default: the open tab joins a framed panel. Folder is the strip alone, with the content unframed. The overview no longer calls contained tabs "folder tabs". | Changed. |
| Swatch picker | Is brown a data hue? | Brown is drawn in orange: "brown (drawn in orange)". | Data palette variant. |
| Typing indicator | Variant pages on the wrong item | The page covers the whole chat surface (the thread and the typing dots), so Theirs, Mine and Typing are its variants. | Record text and variants. |
| Back to top | Sentinel: thin or one window tall? | An invisible strip, thin in width and as tall as the reveal distance (about one window): `--plx-comp-back-to-top-sentinel-width` and `--plx-comp-back-to-top-reveal-distance`. | Changed; `back-to-top.css`. |
| Data grid | Row menu contents | The application's own actions: `rowMenu` entries with a label, an icon, danger, disabled and separators. | Changed; `DataGrid.tsx` header. |
| Data grid | `hozAlign` | The name is no longer on the page. | Content row. |
| MCP tooling | Error wording | A call before the session is initialized is refused (error -32002); a missing, unknown or invalid argument is rejected (error -32602). | Changed; `build-packages.d/mcp.js`. |
| Document viewer | Pointer row | Previous and Next turn the page, the Zoom list steps the zoom, a thumbnail goes to its page. The PDF.js loading and render-cancel text moved to the loading row. | Changed. |

## Decision card

- **Applied:** the eight fixes above.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 15, the last, is "Guidance for items not built yet" (19 questions).
