# Chrome trace split, Plenix 1.6.1 (#1226, D-0160)

- Command: `node tests/perf/trace.mjs --runs 3 --json docs/pds1/slices/1226/evidence/trace-1.6.1.json` (add `--keep <folder>` for raw traces that open in DevTools).
- Pages: the three reference pages of `tests/perf/pages.mjs` (DataGrid with 50 rows, record, form). The record page uses a PropertyList, not PropertyGroup tiles.
- Phases: load; hover over rows 3 to 10 (record and form: no hoverable rows, so nothing happens); sort (grid: click the Name header; record and form: click their button).
- Numbers: median of 3, main thread, headless Chrome, no throttling, light mode, milliseconds.
- Categories: `-*,devtools.timeline` only. Extra categories slow the page while tracing and inflated the first numbers about 1.8x (found by the debugger, #1226). `--debug-categories` adds them for selector statistics and the task total; compare numbers only within one category set.
