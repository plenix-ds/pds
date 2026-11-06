# date-only

This test makes sure a date with no time, such as a due date of October 18, shows as October 18 for everyone, wherever they are in the world.

- File: `tests/date-only.test.js`

## What it checks
- In five time zones (New York, Los Angeles, UTC, Cairo, Tokyo), the value 2026-10-18 lands on October 18.
- Without a browser:
  - the shared date reader (parseDate) and isoDay give back that calendar day; a local time just after midnight is that local day, not the UTC day;
  - formatDate writes "Oct 18, 2026";
  - the "within the last 7 days" filter and the date quick filter count local days (Oct 18 and Oct 13 are inside a 7-day window ending Oct 20; Oct 12 is not);
  - the chart time scale starts on Oct 18.
- In the browser (each time zone emulated): GanttChart, HeatMap calendar, LineChart over time and TimelineChart show Oct 18 (never Oct 17) in their data tables; Time shows Oct 18 with the right date attribute; DatePicker shows the 18th.
- No script errors.

## Why it exists
- Issue #342: Time showed a date-only value ("2026-10-18") as the day before in US time zones, because it was read as midnight UTC, which is the evening before in the Americas. Found by the St. John test site.
- The owner's option A, 2026-10-29: a date-only value is that calendar day wherever the reader is, everywhere (file header).
- Added in commit 65797dab "#342: a date-only value is that calendar day wherever the reader is, everywhere (the owner's option A)".

## How it checks
- First in Node: loads `platform/utils/format.ts`, `utils/fields.ts` and `charts/scales.ts` (converted with Babel) and switches the time zone between checks.
- Then in headless Chrome at 1100 by 900 pixels: emulates each time zone, opens `tests/fixtures/platform-host.html`, draws the charts, Time and DatePicker, and reads their text.

## What a failure means
- People in the Americas would see dates one day early, for example a deadline or an event shown on the wrong day, and date filters could drop or add the wrong rows.

## When it runs
- A child test of the Layout test (`tests/layout.test.js`), which is AUTOMATIC in `tests/run.js`. Before issue #756 it was started by hand only.
- In changed mode (`npm test` and CI), Layout starts it when DatePicker, Time or `utils/format.ts` changes, or a part built on one of them changes.
- Layout also starts it when a global file changes (the small fixed slice) or when `tests/layout.test.js` itself changes. A change under `platform/charts/`, `platform/templates/` or `platform/providers/` reaches that slice too.
- Layout also starts it when this test's own file, or a fixture it loads, changes. By hand: `node tests/date-only.test.js`.
- A full run (`npm run test:full`, and the full suite `.github/workflows/full.yml`) runs it every time.
- CI job: the "fixtures" browser job (Layout's job), on every pull request and on pushes to styling/phase-2 and main.
- Related #342 checks in `tests/formats.test.js` (parseDate in a US time zone, no private date-only readers, Time's output) do run automatically.

## What it needs
- Node, with `@babel/standalone` from `node_modules`.
- Headless Chrome (CHROME_PATH) and the local test server (`tests/lib.js`).
- `tests/fixtures/platform-host.html` and the built Platform bundle.
