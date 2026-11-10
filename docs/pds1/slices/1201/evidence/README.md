# Perf baseline, Plenix 1.6.1 (#1212, rule 7, D-0160)

- Command: `node tests/perf/run.mjs --json docs/pds1/slices/1201/evidence/baseline-1.6.1.json`
- Pages: a DataGrid (50 rows in the data; the grid draws the 20 that fit its 600px window), a record page, a form. Fixture data, no request except Plenix's own files.
- Numbers: median of 3 loads in headless Chrome, light mode, no CPU throttling. Budgets: LCP 2.5 s, INP 0.2 s.
- INP is the slowest event-to-paint of one click, read from the Event Timing API with a 16 ms floor; a click faster than that reads 0.
- Slice A4 (#1206) reuses this harness: `--base` for a CDN folder, `--dir` for a local build.
