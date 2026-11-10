# ADR 0053: DataGrid `cachedRows`: rows the app already has show at once, and fetchRows refreshes them quietly

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), for the owner's performance rule 4 (#1201, D-0160); the gap found in #1214.
- **Issue:** #1219 (S3).

## Context

- Rule 4: data a person has already seen shows at once and refreshes quietly.
- With `data`, the grid shows rows at once. While rows are shown, `loading` changes nothing (`DataGrid.tsx`): that is the quiet half.
- With `fetchRows` (`engine/useRemoteRows.ts`), the grid starts empty on every mount and on every new request (page, sort, filter or search). A screen the person just left and came back to shows the region LoadingState again.
- Rule 8: prefetched or kept data lives in memory only, is permitted data only, and is cleared on sign-out. Plenix must not keep app data itself.

## Options

| Option | For | Against |
|---|---|---|
| **A. `cachedRows?(request): { rows, total } \| undefined`, a synchronous read of the app's own cache, asked for the same request `fetchRows` gets** | The app owns the cache (rule 8); one prop; works for every page, sort and filter, not only the first. | The app keeps a cache keyed by request. |
| B. `initialRows` | Simplest | Only the first request; the next page, sort or filter shows the loader again. |
| C. Plenix caches `fetchRows` answers itself | No app work | Plenix would hold app data, outside the app's sign-out and permission rules (rule 8). |

## Decision

**Option A.**

- **`cachedRows?(request: DataGridFetch): { rows: R[]; total: number } | undefined`.**
  - `DataGridFetch` is the existing public request type, `{ page, size, sort, filters, search }`.
  - It is called, synchronously, before each `fetchRows` call that **replaces** the rows, with the same request: the first request (while the first render is drawn, so the rows are there at once), and each new page, sort, filter or search.
  - It is **not** called for a later page in `"fill"` and `"load-more"`: that answer is appended to the rows, not put in their place (#1223).
  - A `total` left out defaults to `rows.length`.
- **With rows returned:**
  - they render at once, and no LoadingState is drawn;
  - `fetchRows` still runs, and its answer replaces them in place: same scroll position, same focus, the selection kept by row key;
  - a failure keeps the cached rows and shows the existing Retry row.
- **With `undefined`:** today's behavior, unchanged.
- **Ignored without `fetchRows`,** with a `devWarn`.
- The app updates its cache from its own `fetchRows`. Plenix never stores the rows.

## Consequences

- **Semver: MINOR.** Added: `DataGridProps.cachedRows` (it reuses the public `DataGridFetch`). No deprecation.
- `ListingPage` passes it through `grid`; it needs no prop of its own.
- `docs/integration/performance.md`, rule 4, links it.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Behavior tests (#1219):
  - cached rows render with no LoadingState;
  - `fetchRows` is still called once per request;
  - `cachedRows` is not asked for a later page in `fill` and `load-more`;
  - fresh rows replace the cached ones with focus and scroll kept;
  - a failure keeps the cached rows and shows Retry;
  - without `cachedRows`, nothing changes;
  - `cachedRows` without `fetchRows` warns.
