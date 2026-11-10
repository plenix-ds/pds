# Chrome trace split, Plenix 1.6.1 (#1226, D-0160)

- Command: `node tests/perf/trace.mjs --runs 3 --json docs/pds1/slices/1226/evidence/trace-1.6.1.json` (add `--keep <folder>` for raw traces that open in DevTools).
- Pages: the three reference pages of `tests/perf/pages.mjs` (DataGrid with 50 rows, record, form). The record page uses a PropertyList, not PropertyGroup tiles.
- Phases: load; hover over rows 3 to 10 (record and form: no hoverable rows, so nothing happens); sort (grid: click the Name header; record and form: click their button).
- Numbers: median of 3, main thread, headless Chrome, no throttling, light mode, milliseconds.
- Selector statistics (Chrome's own, in the trace): the slowest selectors in one grid hover cost 0.14 ms in total each. Selector matching is not the cost.
