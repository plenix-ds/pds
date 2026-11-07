# ADR 0028: Dates read one way in columns and filters; `timestamp: "s"` for Unix seconds

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on RedSave's recheck DT-7 (#939, S2). Decision D-0100 (owner may switch).
- **Issue:** #939

## Context

- **Columns** (#161) read a date with `parseDate` (`utils/format.ts`): a bare `YYYY-MM-DD` as the local day, a `Date`, or a number as epoch **milliseconds**.
- **Filters** (`matchesDate` in `utils/fields.ts`: the quick ranges "last 7 days", "last 30 days", "this year", a custom range, and the date conditions) still cut the value's text to 10 characters. A `Date`, milliseconds or seconds never match.
- **Unix seconds** (Reddit's format) can't be told from milliseconds by size without guessing. RedSave asked for an explicit marker.
- A number unit for display (`formatUnit`: kg, km) may later want the name `unit` on a number field.

## Options

| Option | For | Against |
|---|---|---|
| **A. `timestamp?: "ms" \| "s"` on a date `Field` and a date `DataGridColumn`; default `"ms"`** | Says exactly what it changes: how a numeric timestamp is counted. Leaves `unit` free for number units. | Not RedSave's word. |
| B. `unit?: "s" \| "ms"` (RedSave's suggestion) | RedSave's word | Collides with a later number unit (kg, km) on the same objects. |
| C. Guess seconds from the number's size | No new prop | Guessing; a wrong day for small or far-future values. Ruled out by RedSave and by D-0087's "no guessing" spirit. |

## Decision

**Option A** (D-0100; reply B or C on #939 to switch).

- **API:**
  - `Field<R>.timestamp?: "ms" | "s"` (`utils/fields.ts`), used when the field's `kind` is `"date"`.
  - `DataGridColumn<R>.timestamp?: "ms" | "s"`, used when `type` is `"date"`.
  - Default `"ms"`: today's behavior for numbers. Ignored for text and `Date` values.
- **One reader:** columns (display, sort) and filters (quick ranges, custom ranges, date conditions, facet counts) read a date through the same function in `utils/format.ts`: `parseDate(value, { timestamp })`.
  - Bare `YYYY-MM-DD`: that local day. ISO text with a time or zone: its instant. `Date`: its instant. Number: epoch ms, or epoch seconds with `timestamp: "s"`.
  - Filters compare the **local calendar day** of that instant, in the `LocaleProvider` `timeZone` when set, else the viewer's.
- **No other prop changes.** Quick-filter value shapes (`DateRange`) stay ISO day strings.

## Consequences

- **Semver: MINOR** (a new optional prop, and a fix: filters now keep dates they wrongly dropped, listed under *Fixed*).
- An app with seconds that already wrote a `get` (RedSave's `TEMP(Plenix DT-7)`) can drop it and set `timestamp: "s"`.

## Check

- A behaviour test (test first, `tests/`): the same day as ISO text, epoch ms, epoch seconds (`timestamp: "s"`) and a `Date` is kept by "last 7 days" and by a custom range that includes it, and dropped by one that doesn't; a column with `timestamp: "s"` shows and sorts that day. Left to right and right to left.
- `tests/fixtures/redsave-types.tsx`: a `CollectionField<Row>` and a `DataGridColumn<Row>` with `timestamp: 's'` compile; `timestamp: 'sec'` fails.
