## Decision record (2026-10-19): SegmentedControl look
- Asked again 2026-10-19 with the comparison (Today: gray track and white thumb, the iOS look; A: bordered group, tinted
  selection; B: bordered group, filled selection). Decided 2026-10-14 (command bar study, owner "ok"): **A, a bordered
  group with the chosen segment in the blue tint** (Material 3 segmented buttons, Fluent): the same border and height as
  Plenix buttons; B (filled, Carbon) and the iOS track not used.
- Built: SegmentedControl in 0.31.64 (Pills and colors, docs/pills-and-colors.md); Tabs variant="segmented" takes the same
  look (bordered tabs, the tint on the selected one). Nothing pending.

## Batch 440 (2026-10-19): Styling Standard, Phase 2, batch 6 (SplitView → Resizable)
- resizable.css: --fill and --divider rules (SplitView's, with Resizable's own modifier, at the end of the file);
  Resizable.tsx variant and fill (named fillContent inside: fill() is the strings helper — the first build crashed both
  pages, caught by the audit); 9 divider tokens in resizable.tokens.json; SplitView sets the divider size from its gap.
  Design system: Resizable "Variant" cards, SplitView statesFrom resizable.
- Checked: build, SYSTEM_OK, SPEC_OK, ownership --shrink (198 selectors), clash audit app (no element changed but the
  dashboard's date-dependent text), --ds (only documentation differs), compare-styles against 0.57.4 (SplitView 4 and
  Resizable 4 examples SAME). Released as 0.58.0.

## Batch 426 (2026-10-18): Reddit Mono replaces DM Mono
- platform/fonts: reddit-mono-variable-latin(-ext).woff2 (Google Fonts v5), OFL-RedditMono.txt, README. fonts.css:
  Reddit Mono 200–900 with size-adjust 97.1% (12.625/13 from the playground fit at DPR 1.5).
- Tokens: ref font-mono → "Reddit Mono", …; ref word-spacing-mono-fit −0.279em (−0.287em at 12.625px restated at
  13px); sys font-data-word-spacing. check-system.rules/mono-spacing.js (word-spacing on every monospace rule; --fix
  added 130 declarations; 80 files differ by that line only).
- "DM Mono" → "Reddit Mono" in 124 files (comments, docs, standards, native design JSON, tests); history kept
  (CHANGELOG, logs, the font study). Playground: Reddit Mono = the Platform face (no Google copy).
- Checked: build, SYSTEM_OK, SPEC_OK, build-docs; playground at the same 13px: heights 99–100%, stroke 99.8% (400),
  92.1% (500), 93.8% (600), Fit word spacing → −0.279em exactly, match 99%; Files: Reddit Mono 13px, word-spacing
  −3.627px. Released as {V}.
