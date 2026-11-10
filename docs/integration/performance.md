# Performance rules for an app on Plenix

Owner rule for CTM, PDS and every app (D-0160, #1201). Eight rules for business database apps. Plenix owns rules 2 and 7 and documents the other six here, each with the Plenix API that supports it.

## Who does what

| Rule | Owner | Status |
|---|---|---|
| 1. Hashed, compressed, immutable caching | Plenix CDN | In place |
| 2. Code loads per screen | Plenix (#1201 slices) | Released in 1.7.0: the all-in-one `plenix.js` stays through 1.x |
| 3. One parallel data request per screen | The app | Documented below |
| 4. Seen data shows at once and refreshes quietly | The app | Documented below |
| 5. Server paging, 25–50 rows, with server search and sort | The app, with `DataGrid fetchRows` | Documented below |
| 6. Optimistic saves with undo | The app, with `useUndo` | Documented below |
| 7. Speed is measured: main content within 2.5 s (LCP), a click answered within 0.2 s (INP) | Plenix build check | In progress |
| 8. Idle prefetch has limits | The app | Documented below |

Reference pages for rule 7: a DataGrid with 50 rows, a record page and a form.

## Rule 1: caching

- Every published version is immutable: `/cdn/<version>/plenix.js` is served with `cache-control: public, max-age=31536000, immutable`.
- Load Plenix from a versioned URL (or through the page loader and `latest.json`). Never copy a file to a path that has no version in it.
- The app's own assets follow the same rule: a hashed file name, compressed (brotli or gzip), cached for a year. Only the HTML page is revalidated.

## Rule 2: code per screen

- Released in 1.7.0 (ADR 0052): one entry per export. On npm: `@plenix-ds/react/DataGrid`. On the CDN: `/cdn/<version>/esm/DataGrid.js`, loaded with `Plenix.load(['DataGrid'])` from `plenix-loader.js`.
- A screen imports only the parts it uses. A router can `import()` a whole screen.
- `plenix.js` and `plenix.esm.js` stay unchanged through 1.x, are deprecated, and are removed in 2.0.0.
- The guide, with measured sizes and samples, is [code-per-screen.md](code-per-screen.md).

## Rule 3: one parallel data request per screen

- A screen asks for everything it needs in one round, in parallel: start every request when the screen opens, then wait for all of them. Do not chain one request after another unless the second needs the first one's answer.
- Prefer one endpoint that returns the screen's data (the record, its related lists and its lookups) over six small ones.
- Plenix itself makes one request per view: `fetchRows` asks once per page, sort, filter or search and aborts the old request (the request carries an `AbortSignal`). A region shows one loader for all its parts, because only the outermost `LoadingState` draws (ADR 0042).
- Show each region as its own data arrives. Use the region loading state (`loading`, ADR 0042), which shows a spinner only after about 1 second.

## Rule 4: seen data shows at once and refreshes quietly

- Keep the last answer for a screen in memory, keyed by the request. On return, draw it at once, then ask again in the background.
- Replace the rows when the new answer arrives. Do not clear the screen first and do not show a spinner over rows that are already shown: a `DataGrid` with rows changes nothing when `loading` is true, so keep rows in place while the refresh runs.
- Show a spinner or the empty text only when there is nothing to draw yet.
- Gap: `fetchRows` cannot start from rows the app already has, so a revisit to a server-paged grid shows the loader again (#1219). Until it is fixed, pass the kept rows as `data` for a screen that fits in memory.
- When the refresh fails, keep the old data and show a short message with Retry. Say when the data was last updated if it matters to the decision.

## Rule 5: server paging, search and sort

- Give the grid `fetchRows({ page, size, sort, filters, search })` and return `{ rows, total }`.
- Return 25 to 50 rows per page. `size` is `pageSize` (default 50).
- Sort, filter and search on the server. A change starts again from page 1.
- In the default fill mode the grid asks for the next page by itself when the scroll comes within 8 rows of the end. It shows a "Loading records" row while a page is on its way and a row with Retry when a page fails.
- `fetchRows` receives `signal`: pass it to your request so a stale request is aborted.
- Give every row a stable `index` so selection holds while pages arrive.
- Details: [DataGrid and Table in an application](data-grid.md).

## Rule 6: optimistic saves with undo

- Editing a cell or a record: `onCellEdit` and `onRecordEdit` may return a promise. The new value shows at once with a busy cell, and a rejection puts the old value back with its message (ADR 0016). `editing: { undo: true }` adds Ctrl+Z and Ctrl+Y (ADR 0021).
- Bulk actions: show the result at once, send the save in the background, and give the person a way back:

  ```js
  const undoable = useUndo();
  undoable('3 assets archived', {
    onUndo: () => restore(ids),
    onCommit: () => save(ids),
  });
  ```

- `onUndo` puts the data back. `onCommit` runs when the toast leaves without Undo, which is the moment to make the change final.
- If the save fails, put the data back and show an error that says what happened and how to fix it (see `docs/content/messaging.md`).
- Exception: legal and financial actions (sending, paying, signing, publishing, deleting for good) are never optimistic. Ask first with a confirmation that names the object and repeats the verb on its button, then show the result after the server answers.

## Rule 8: idle prefetch limits

An app may fetch data it expects the person to need, only inside these limits:

- Small pages only: the first page of a list, never a whole table.
- Pause while the person is active. Start in idle time and stop at the next click, key press or scroll.
- Memory only. Never write prefetched data to local storage, session storage, IndexedDB or a cache the browser keeps across sessions.
- Permitted data only: prefetch what the person may already open. Never fetch to find out whether they may.
- Nothing sensitive: no personal, health, financial or confidential records.
- Plenix stores no app data, so the cache is the app's. For code, `esm/manifest.json` (ADR 0052, not released yet) lists each screen's chunks for `modulepreload` at idle.
- Clear everything on sign-out and when the person or their role changes.

## Checking it

- Rules 1 and 2 show in the network panel: the Plenix file comes from the cache on the second visit and loads once.
- Rules 3 to 5 show as a request waterfall that is one row wide, with no spinner over rows already shown.
- Rule 7 is a build check: Plenix fails a build that makes a reference page slower than its budget.
