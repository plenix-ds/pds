# The working history: what moved out of the repository, and where it is

The product repository holds the product. The team's working history (briefs, study pages, one-off proof folders and old baselines) moved out in issue #694 (audit finding #684). **Nothing is lost.**

## Where it is
- **The archive:** `~/handoff/plenix-archive/694-working-history/` on the team server, a plain copy with every path kept (so `docs/briefs/<name>/` is `694-working-history/docs/briefs/<name>/`).
- **Git history:** every moved file is still in the history of this repository. The tree before the move is commit `b7d184892293094f4d472d502ddcdf41184bc397`: `git show b7d1848:docs/briefs/<name>/<file>`, or `git checkout b7d1848 -- docs/briefs/<name>` to bring one folder back.
- **No new GitHub repository was made.** Whether the archive becomes one is the owner's call.

## What moved (about 40 MB)
- `docs/briefs/`: 79 of the 84 entries (the working pages of finished briefs).
- Study and sample folders no one opens: `docs/studies/`, `docs/settings-variations/`, `docs/command-bar-study/`, `docs/touch-options/`, `docs/color-consolidation/`.
- One-off proof and review folders in `tests/`: `lane-198-proof`, `lane-201-proof`, `phase2-181-proof`, `phase2-182-proof`, `scroll-147-proof`, `search-149-proof`, `data-grid-next-review`, `table-migration-review`.
- `tests/baselines/pilot-computed-before.json` (14 MB): no test read it.
- The stale entries of `tests/baselines/overlap-strict.json` were removed in place: the Card accent token and the two clashes of `.plx-card--accent`, which #621 removed. (The old file is in the archive.)

## What stayed, and why
- **Published study pages** (`deploy.sh` publishes them): `docs/font-study`, `docs/composition`, `docs/reading-pane-study`, `docs/page-headers`, `docs/grid-header-study`, `docs/grid-row-hover-study`, `docs/grid-row-selection-study`.
- **Briefs a tool still opens:** `docs/briefs/icons` (`tools/agent/datagrid/icon-compare.js` reads it), `docs/briefs/iconography` (a link in `platform/icons/inventory/README.md`).
- **Briefs that go to the archive in the next clean-up:** `docs/briefs/commandbar-find-fold`, `header-labels-start` and `segmented-fold`. Their tests open the stage pages in `tests/fixtures/stages/` since #772, and no test, tool, configuration, `deploy.sh` or live document uses these folders. What stays in them is the brief (`index.html`), pictures and a `capture.js` that points at the removed `stage.html`.
- **Live documents:** `docs/integration`, `docs/i18n`, `docs/accessibility`, `docs/palette.md`, `docs/pills-and-colors.md`, and the PRD viewer files.
- **Baselines a test still reads:** `pilot-computed.json` (`tests/zero-overlap.test.js`), `computed.json`, `computed-ds.json`, `clashes*.json`, `overlap-strict.json` (`tests/clash-audit.js`, run by the styling-proof workflow). `computed.json` and `computed-ds.json` still hold hashes for the removed Card accent; they refresh when the clash audit is next recorded (it is the owner's run).
- **`tools/agent/native/`:** not moved in this pull request (its generators may still be run by hand; see `docs/build.md`).

## Moved later (#706)

- `docs/handoff/` and the briefs `commandbar-find-fold`, `header-labels-start` and `segmented-fold` moved into the repository's own `archive/docs/` (with their history): see `archive/README.md`.
