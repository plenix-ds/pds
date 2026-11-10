# Before and after the CSS fix: 1.6.1 vs 1.7.0 (#1206, #1188, #1201)

- Commands (same machine, same harness, one run set after the other; median of 5, headless Chrome, light, no throttling):
  - `node tests/perf/trace.mjs --base https://design-system.lighthouseway.org/cdn/<version> --runs 5 --json trace-<version>.json`
  - `node tests/perf/run.mjs --base https://design-system.lighthouseway.org/cdn/<version> --runs 5 --json vitals-<version>.json`
- Files: `trace-*.txt|json` (time split per page and phase), `vitals-*.txt|json` (LCP, INP, style recalc).
- 1.7.0 carries #1197 (the `:root` rule fix and fewer re-declared tokens). It does not carry the Stack `:has()` fix (#1255); the three-grid filter and resize numbers show what is still left.
