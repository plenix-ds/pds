# Case timeline study

The study behind the **Timeline variation** requested in #987: events grouped by
year, each event in its own container coloured by category, and the date inside
a calendar icon.

- `index.html`: the interactive study. Open it in a browser. Its default
  settings are the CTM owner's decision (CTM D-0058, 2026-11-07); the other
  options are the alternatives that were considered.
- Source: LighthouseCollection/CTM `docs/design/timeline-study.html` (CTM PR #255),
  spec in CTM `DESIGN.md` section 4 "Case timeline".
- All data in it is fictional.

The decided look, for the component:

| Part | Decision |
|---|---|
| Year group | Year heading 20 px bold, secondary ink, 72 x 2 px soft line under it; 80 px between years; no divider |
| Watermark | Faint rotated year beside every event, centred on it, start-aligned with the heading, 8 px from the event |
| Event | Own container, `shape-sm` (6 px), soft category tint and border, title in the category colour, category tag at the end; upcoming events dashed; no dots |
| Date | Calendar icon with a category-coloured top band and binder rings, bold uppercase month, large bold day; upcoming shows "Pending" |
| Categories | 8 colours, light and dark: plum, slate, teal, violet, copper, navy, green, gold |
