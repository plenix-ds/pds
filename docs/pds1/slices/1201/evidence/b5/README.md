# B5 (#1211): CTM loading per screen, measured before building

Measured 2026-11-11 on the agent host, headless Chrome, cache off, Plenix 1.7.0 from the CDN, React from its vendor files.

- **CTM's use:** its 30 scripts read 87 distinct `P.<Name>` (`static/ctm/*.js`); `app.js` and `shell-layout.js` alone read 45 (AppShell, NavPane, DataGrid, Dialog, Tabs, …).
- **The page:** a Panel with a Button inside a ThemeProvider (the same for both), loaded two ways.
  - `plenix.js` (all of Plenix): 6 requests, 786 KB on the wire including the CSS, ready at 501 ms.
  - `plenix-loader.js` + `Plenix.load([the 45 names])`: 214 requests, 648 KB on the wire, ready at 635 to 642 ms.
- **The 87 names CTM uses over all its screens:** 305 files, about 390 KB brotli, against about 553 KB for `plenix.js`.
- **Reading:** on CTM's first screen the shell and DataGrid parts dominate. Loading by part saves about 18% of the bytes and is about 140 ms slower to ready, because of the number of requests. A per-screen split would save a little more on the later screens, not on the first.

Script: `node load-vs-plenix-js.cjs` (from this folder, with `tests/lib`). It is a measurement, not a test.
