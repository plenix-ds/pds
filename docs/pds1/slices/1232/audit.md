# #1232 Data-font audit: Reddit Mono for data, never for names or words (G2)

- **Owner decision:** D-0164 (PR #1234), building on D-0006 and DESIGN §"Type".
- **Reading applied:** D-0165 (below).
- **Method (Ran, Design Director, 2026-11-10, on `origin/main` 249ac95fd+):**
  - Every comp `*-font-family` token was resolved through its tiers to its first family: 172 tokens; 79 resolve to Reddit Mono and 93 to DM Sans. Script: the session scratchpad, re-runnable by the check (§5).
  - Every component, pattern and chart stylesheet that sets `tabular-nums` without a data-font family was listed.
  - Each hit was read against its component's doc block.

## 1. The rule (one line, for DESIGN.md §Type)

> **A value that is data (a number, amount, count, date, time, ID, code, key, file name, path, URL, email or version) uses Reddit Mono (`font-data`) wherever it stands as a value. A name or a word never does. In a phrase that mixes them, only the data runs are Reddit Mono (`dataPhrase` / `dataWhenText`).**

- "Stands as a value": a cell, a field or property value, a metric, a chart value or tick, a date tile or day, a count, a counter, a meta line, a code.
- A heading or button label that contains a number stays DM Sans. This keeps DESIGN.md's "never mono in prose": "7 events" in a heading, "Page 3" on a button, a step number in a ProgressSteps marker.
- A slot that can hold either a word or a value (a free "meta" or "title") never sets Reddit Mono for the whole slot. It passes a string through `dataWhenText`.

## 2. Conforming (no change)

- **Numbers, amounts, counts:** AvatarGroup +N, Commerce line total and summary, DownloadButton percent, Field counter, FileList count, Gauge value and ends, HeatMap scale values, LoadMore count, MetricCard delta, Metric change, OtpInput cells, PeopleGroup number, PieChart center value, ProductCard price, ProgressBar value, ProgressCircle value, QueryBuilder number, ResourceList group count, Sankey value, SearchResultGroup count, Slider mark and value, Treemap value, VirtualList count, TransferList counts.
- **Dates and times:** ActivityList time, Calendar week number, Chat time, ConnectedAccounts date, EventChip time, RelativeDateInput range, SessionTimeout time, Time, TimeGrid hour, TimePicker field and option, TimeZoneSelect offset, Timeline time.
- **IDs, codes, keys, technical strings:** Barcode line, Code, CodeBlock pre, CodeEditor, Kbd, RichText pre, QRCode value, VersionLabel, InputGroup data affixes, Input `data`, InlineEdit read `data`, DataPill `data`, Text `data`, PropertyList `value-data`, DataGrid kind `data` (IDs, file names, paths, versions, dates, sizes, counts; names stay `name`), DownloadButton meta (format and size), File meta and name, FileInput, FileRow data, ImageUpload name and size, ComparisonView data and meta.
- **Chart values:** data labels, legend values, reference-line value, value-axis ticks.
- **Words in DM Sans, correctly:** chart axis title, heat-map missing-value label, TimelineChart labels, WordCloud, UploadManager counts line (`dataPhrase`), DateBadge weekday, MetricCard title, figure captions.
- **Mixed phrases:** EntityHeader facts (`dataText`), UploadManager (`dataPhrase`), and the 17 call sites of `dataPhrase` / `dataText` / `dataWhenText`.

## 3. Breaks (each a fix, tests first)

| # | Part | Now | Breaks because | Fix |
|---|---|---|---|---|
| 1 | Chart category axis (BarChart names; every ECharts chart via `engine.ts:169`) | every axis label takes `chart-tick-label-font-family` (Reddit Mono) | names in the data font: the owner's report | category-axis labels in the text font; value-axis ticks stay Reddit Mono. **CE1, claimed** |
| 2 | Chart tooltip title (`chart-tooltip-value-font-family`, "values and data titles") | the title row is Reddit Mono | on a category chart the title is a name | the tooltip title through `dataWhenText` (a date title stays mono, a name goes sans); values stay mono. CE1, with #1 |
| 3 | RadarChart axis names, TreeChart `name`, Treemap `n`, PieChart slice labels and legend names (intake list) | to verify in the engine with #1 | names | text font for every name label; values (`v`, percent) Reddit Mono. CE1, with #1 |
| 4 | Metric value (`metric-value-font-family` -> `font-heading`) | DM Sans | a metric is a number standing as a value (DESIGN §Type names "metrics") | `font-data` at the same size and weight |
| 5 | MetricCard value (`metric-card-value-font-family` -> `font-heading`) | DM Sans | as #4 | `font-data` |
| 6 | Count (`.plx-count`) | inherits DM Sans with `tabular-nums` | a count standing as a value | `font-data` |
| 7 | DateBadge day (`.plx-date-badge__day`) | DM Sans, `tabular-nums` | a date | `font-data` (the weekday stays DM Sans) |
| 8 | Timeline grouped date tile day (`.plx-timeline__date-day`) | DM Sans, `tabular-nums` | a date | `font-data`. The month in the band is a word (a month name) and stays DM Sans. The year heading is a heading and the watermark is decorative: both stay DM Sans |
| 9 | Calendar day numbers | inherit DM Sans | dates in a grid | `font-data` (the week numbers already are) |
| 10 | Pagination info (`.plx-pagination__info`, "1–20 of 312") | DM Sans | a phrase that holds counts | `dataPhrase` (the numbers mono, "of" sans). The page buttons stay DM Sans (button labels) |
| 11 | Tree `meta` (`tree-meta-font-family`) | the whole slot is Reddit Mono | free content: an app may pass a word ("Shared") | `dataWhenText` on a string; the slot family goes to the text font |
| 12 | EntityPicker `meta`, MediaCard and MediaViewer `meta`, MediaViewer counter | the whole slot is Reddit Mono | as #11 (`meta: ['JPG', '2.4 MB']` is fine, but a label is not) | as #11 |
| 13 | CodeBlock `title` (`code-block-title-font-family`) | Reddit Mono | the doc allows "a file name **or caption**"; a caption is words | `dataWhenText` can't tell (a path may have no digits). So the title is Reddit Mono only when it is a path or file name (it contains `/`, `\` or a `.ext`); a caption is DM Sans. The test covers both |
| 14 | VersionCompare text lines (`version-compare-line-font-family`) | Reddit Mono | compared document text is words | the text font; Reddit Mono only for `kind="code"` (an existing or new prop, G3) |
| 15 | Auth `data` (`auth-data-font-family`: "an email and a count in a sentence") | the run is Reddit Mono | conforms only if it is applied to the email or count run, never to the sentence | verify at build; use `dataPhrase` for the sentence |
| 16 | FilterBar count (`filter-bar-count-font-family`) | Reddit Mono | conforms if it is the number alone | verify that "3 filters" is `dataPhrase`, not the whole label |
| 17 | DataGrid kinds `id` and `code` (found by the `type-roles` check, #1237) | no data cell class: DM Sans | IDs and codes are data | the data cell class, as kind `data` |

- #4 to #9 have no font-family token today. The `type-roles` token pass (#1237) cannot see them until their fixes add one: `metric` and `metric-card` values already have tokens; the fixes add `count-`, `date-badge-day-`, `timeline-grouped-date-day-` and `calendar-day-font-family`, each declared `data`. #10 to #16 are runtime (`dataPhrase`, `dataWhenText`, a path test), so their tests carry them.
- #1 to #3 ship in **1.6.2** (the owner's bug). #4 to #16 ship in **1.7.0** with the check.
- #4, #5, #7, #8 and #9 change what a person sees (DM Sans to Reddit Mono). D-0164 asks for exactly this ("one rule in every component"), so they are not new looks. CI's light and dark shots go on the PR as usual.

## 4. Reading applied (D-0165, the owner may switch)

- **A. Technical strings count as data:** file names, paths, URLs, emails and versions stay in Reddit Mono, like IDs and codes. They identify a thing; they are not words people read as language. This keeps DataGrid's `data` kind, File, FileRow, CodeBlock paths and QRCode as they are.
- Reply **B** to limit Reddit Mono to the owner's list (numbers, amounts, counts, dates, times, IDs, codes). File names, paths, URLs and emails would then move to DM Sans.

## 5. For the check (DS Architect, `lint-type-roles`)

- **Token pass:**
  - every comp `*-font-family` resolves to `font-data` or the text font;
  - a token whose name holds `value`, `count`, `number`, `time`, `date`, `price`, `total`, `percent`, `delta`, `offset`, `code` or `id` resolves to `font-data`;
  - one whose name holds `title`, `label`, `name`, `heading`, `caption` or `weekday` resolves to the text font;
  - exceptions go in an allowlist with a reason: `code-block-title`, `file-name-data`, `image-upload-name`, `chart-axis-label`.
- **CSS pass:** a rule with `tabular-nums` and no data-font family is flagged unless it is in the allowlist (heading, button, marker, watermark: `plx-timeline__year`, `plx-timeline__watermark`, `plx-progress-steps__marker`, `plx-text--tabular`).
- **Chart pass:** the ECharts engine's category axis and name labels read the text-font token, and its value axis reads the data-font token.
- **DataGrid kinds:** `data`, `id` and `code` use the data font; `name` and `text` use the text font.

## 6. State matrix

- n/a(type only): a font family changes no state. Every hover, focus, active, disabled, selected, loading and error token of the parts above is unchanged.
- **Long text:** Reddit Mono is wider than DM Sans. #4 to #9 must not wrap or cut where they fit today. The fixed boxes are the 40px and 56px date tiles (two digits) and the DateBadge. The test measures them.
- **Empty values:** unchanged. A missing value shows each part's own empty mark (an en dash, or nothing).
