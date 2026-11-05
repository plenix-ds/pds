# Plenix: handoff for a new session (2026-10-24)

> **Handed off, 2026-10-26.** The owner: "so now all the work is ready to hand off to begin a new clean environment based on the plan discussed".
> The **team server** (the Lead's machine) runs Plenix from here. The Windows-VM sessions (Owner desk, Governance and the DND sessions) stand down and start or merge nothing more.
> The hand-off note is in the sessions' shared notes folder on the Windows VM, beside `owner-decisions-log.md` (every owner decision, verbatim). Read it first, then this file and #252.
> State at hand-off: live 0.72.0; `styling/phase-2` green (CI run 40389886058); merged since 0.72.0 and unreleased: #341 (+ spec #5), #345–#351, #355. In flight: charts on ECharts (#353; Line, Area, Bar, Pie approved to ship; branch `claude/charts-echarts-first`; then Diagram retired (breaking), Sparkline and WordCloud to ECharts). No release until the owner asks.

Read this first, then [STATUS.md](STATUS.md) (what is done and left), then `CLAUDE.md` (Claude) or `AGENTS.md` (Codex).
Everything still to do is a GitHub issue in `plenix-ds/plenix-platform`; **issue #252 is the tracking list**. Nothing
is kept in TODO.md any more.

## What Plenix is

One design system and the suite of applications built on it, owned by one person (the "owner"; GitHub org
`plenix-ds`). Applications outside this repository (RedSave, CTM Council, others) load Plenix from its CDN.

| Part | Where | What |
|---|---|---|
| Platform | `platform/` | React components (`components/`), patterns (`patterns/`), hooks, providers; `plx-` CSS classes; tokens in three tiers (`--plx-ref-` values, `--plx-sys-` roles, `--plx-comp-` component settings) as W3C JSON in `platform/tokens/` |
| Design spec | `platform/design-system/` (a **submodule**, private repo `plenix-ds/plenix-design-system`) | The living spec: 689 records, 1,173 taxonomy leaves; `inventory.js` + `parts/*.records.js|docs.js|labs.js`; one page per component (the duplicate merge is permanent, no redirects) |
| Standards | `platform/standards/` | `styling.md` (the Styling Standard: ownership, zero overlap, text contracts, layers), `text-contracts.json`, themes, layout, native design |
| Apps | `dashboard/ projects/ messages/ contacts/ calendar/ tasks/ notes/ bookmarks/ files/ settings/ dam/` | The suite, each `main.jsx` → generated `app.js` |
| Checks | `check-system.js` (+ `check-system.rules/`), `check-style.js`, `check-spec.js`, `check-bundle.js` (+ `check-bundle.baseline.json`); `tests/` | The gates (the tests run only when the owner starts them) |
| Agent tools | `tools/agent/` | Work notes, proof log (`proof-log.md`), release script (`release.sh`), the spec-merge record |

## Where things stand

- **Branch**: `styling/phase-2` in both repositories; everything is committed and pushed (2026-10-24). `main` is behind.
- **Last release: 0.69.4** (tag `v0.69.4`, live at `https://design-system.lighthouseway.org/cdn/0.69.4/`).
  - 0.69.3 shipped EntityHeader's Streamlined header style (`headerStyle="streamlined"`).
  - 0.69.2 shipped the five Structured layouts (`layout`), the tag picker fix and the icon fix.
- **Hosting**: the publish host (`PUBLISH_HOST`, `tools/publish-config.sh`) behind Nginx Proxy Manager; `plenix.lighthouseway.org` (apps), `design-system.lighthouseway.org` (spec, CDN `/cdn/<version>/`, API `/api/v1/`, behind Authentik except `/cdn/`).
- **Unfinished work saved on a branch**: `wip/data-grid-lines-as-borders` (an unverified DataGrid change found on disk): #290.

## The owner's rules (non-negotiable)

- **Ship once QA clears.** The Tech Lead, the Developers, the Defect-fix Developer and the UX Designer merge, release and deploy without asking as soon as the QA Engineer passes a change, and the QA Engineer may merge, release and deploy what it passed; owner QA follows and never blocks. See "Releasing" below.
- **Current hold (owner, 2026-10-29): publishing is off.** No release and no deploy until the owner restores access to the web server and says so; merges continue.
- **Ask before fixing** something the owner reports: explain the cause and the options; fix after they choose.
- **Pixel changes get the owner's QA after AI QA**: a dashboard item with screenshots of the real component at the reviewed commit; his requested changes go back through QA.
- Styling Standard (`platform/standards/styling.md`): no `!important`, no inline styles (not even a style attribute),
  tokens only, no new colors (existing palette), flat selectors (a parent never styles a child; context values and
  state variables instead), every text part declares a text contract, no exceptions.
- **Dark mode last** (#205). American English. Statuses are badges with an icon, never a dot. No action links.
- Write documentation as definitive rules, plain words, bullets for two sentences or more.
- **Other sessions share this folder.** Commit only your own files; build generated files in a clean copy; never `git add -A`.
- Proofs: do not run `tests/clash-audit.js` or `tests/compare-styles.js` (see "No tests"); say in the pull request which pages the change touches.
  The full suite (#58) is the owner's, at the very end.
- Commits: author "Coptic Collection" <frraphaelmaher@gmail.com>, trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. The global git identity is set to this author (owner, 2026-10-24).

## How to work

- **No tests (owner, 2026-10-27).** Never run a test. Tests run only when the owner starts them himself. Reading the code and the quick static checks (check-system, check-style, lint) are fine.
  - This is the one statement of the rule; every other file points here.
  - Commit freely while working. Right before a push run only the build and the static checks: `node build-app.js`, `node check-system.js`, `node check-style.js`, `npm run lint:css`, `node check-spec.js`.
  - The full suite and the on-demand tests are started by the owner. CI is a separate owner decision.
  - The owner starts tests with a run-tests issue in plenix-ds/owner-requests, which `~/team/test-runner.sh` runs. No agent opens, edits or comments on those issues.
- **No custom tooling unless absolutely necessary (owner, 2026-10-31, #712).**
  - Build, check, test and release work uses standard tools; a new custom script, generator or check needs a pull request that shows no standard tool or plugin can do the job.
  - Every custom tool is listed in [docs/build.md](docs/build.md), with what it writes or checks, whether it is necessary, and its standard replacement. The rule itself is in `CLAUDE.md`.
- **Show me, then ship it (owner, 2026-10-26).**
  - "Show me" comes first: a live preview and one picture, with no build, no tests and no PR.
  - "Ship it" comes only after the owner picks: then build, check before the push, open the PR, and merge on the owner's word.
- **On-demand tests (owner only, 2026-10-25; the owner runs them, see No tests).**
  - Accessibility, high contrast, color contrast, themes and density run only when the owner asks for them.
  - They are not in `npm test` (the owner runs it), `npm run test:full`, the per-push CI or the full suite.
  - The owner runs, on this computer: `npm run test:on-demand` checks what changed; `npm run test:on-demand:full` checks every page (accessibility alone takes about two hours).
  - The owner runs, on GitHub: Actions › On-demand tests › Run workflow, then pick "full" or "changed".
  - One test by name (the owner runs): `node tests/run.js a11y` (or `high-contrast`, `contrast`, `theme`, `density`).
  - The overflow audit (owner, fit-and-overflow stage 2; a tool, not a test; the owner runs it, we never do): `node tools/check-overflow.js` opens every design-spec page and the 10 apps in headless Chrome and writes `tools/overflow-report/overflow-report.html` (and `.json`): text cut with no way to read it, content spilling out of a box that does not scroll, children outside their parent, the page scrolling sideways, and any toolbar, menu bar or action bar on more than one row (always an error), grouped by component kind, with the run time (about 20 to 25 minutes). `--dry` loads it and lists what it would open without starting a browser; `--only <text>`, `--limit <n>`, `--no-spec`, `--no-apps`, `--spec-rtl` narrow or widen it. Intentional cases go in `tools/overflow-allow.json`, one entry each with a selector, a page and a reason (no blanket entries); the report counts what each hid.
- **The test site (owner, 2026-10-25).** Every automatic browser test runs on the St. John the Beloved Coptic Orthodox
  Church test site and the suite apps, never on the design spec.
  - The site is its own web app and repository: github.com/LighthouseCollection/st-john-test-site (Node 22 + PostgreSQL 16, Plenix from the CDN), live at https://stjohn.lighthouseway.org behind Authentik.
  - Clone it beside this repository (`../st-john-test-site`, or set `SITE_DIR`). The tests start it on their own server at `/Plenix/test-site/` with a fresh database (PGlite on a computer, the job's PostgreSQL in CI) and point it at this checkout's CDN files at `/cdn/local/`: run `node build-app.js` and `node build-packages.js` first.
  - It is a church database and membership app with made-up data (no sacrament records; "servants", never "volunteers"). Its routes are its `site/pages.js`; tests read them through `tests/site.js`.
  - CI checks the site out with no token: the repository is public on the owner's account (owner, 2026-10-30, st-john-test-site#7). `DS_TOKEN` still reads the spec.
  - A new Platform part must be placed on the site. The owner starts `node tests/site-coverage.test.js` (SITE_COVERAGE_OK) and `node tests/site-check.js` (the site's rules); you do not run them.
  - The spec's component labs are spec-only (`node tests/run.js labs`, the owner runs); `tests/component-tokens.test.js` (the owner runs) checks the tokens on the site's real components.
- **No target-size test.** The owner removed it ("Remove tap areas from all tests", 2026-10-25).
- **Each thing is checked once (reset, owner 2026-10-26).**
  - Visual checks the buttons in light mode at the default density (Standard) only: 840 buttons and the group.
  - Text alignment (`typography.test.js`) runs in light mode only; its baseline keeps only the light findings.
  - Tables (`data-grid.test.js`) has no accessibility scan, no typeface or size check and no inline-style check.
    Accessibility is on demand, typefaces are Text alignment's, and inline styles are Pages'.
  - Utilities has no style-audit check (Pages runs the style audit on every page).
  - Which Platform parts the test site uses is Site coverage's alone; Component settings checks only that each token works.
  - Dark mode, the themes and the densities are checked only on demand (`theme`, `density`) until dark mode work starts (#205).
- Gates before finishing any change: `node build-app.js`, `node check-system.js` (SYSTEM_OK), `node check-style.js` (STYLE_OK), `npm run lint:css` (no errors), `node check-spec.js` (SPEC_OK).
  After a spec change, `node build-spec-parts.js` (build-app runs it).
- Bundle rules (`node check-bundle.js`; owner, bundle-check-27; #456 to #461):
  - It reads the built CDN files in `release/cdn/<version>/` (`plenix.js`, `plenix.css`) and never builds them; CI runs it after "Release build" and the release after `build-packages.js`. Advisory, like the other checks.
  - It counts runtime addresses (P-38), injected scripts (P-45), page prefetch (P-46), raw HTML outside the rich-text engine (P-47) and CSS outside the supported browsers with no `@supports` fallback (P-48). The header of `check-bundle.js` defines each rule. The size of `plenix.css` is not a rule (owner, #460): it prints as a plain number in KB and never fails the check.
  - It fails (BUNDLE_FAIL) when any count goes up from `check-bundle.baseline.json`. When one goes down, lower the baseline in the same pull request with `node check-bundle.js --update`.
  - Never raise the baseline to pass. `--list` shows where each finding comes from: the source module, or the CSS rule.
  - `node build-packages.js` builds the CDN files and runs no test (#466, #472); CI also builds them.
- **Run `npm ci` first in a fresh clone or worktree, and after pulling a build change.** The build outputs are not in git
  (#692, `.gitignore`); `npm ci` builds them (package.json's prepare: `node build-app.js`). Without
  it there is no `platform/dist/platform.js`, no `<app>/app.js` and no token CSS, so pages open blank and check-system
  says "run npm ci first". `node build-app.js` alone rebuilds them after a source change.
- Generated files (never edit by hand, never committed): `platform/dist/`, `<app>/app.js`, `<app>/plenix-icons-<app>.js`,
  `platform/system/steps.css`, `platform/system/tokens/*.css`, `platform/system/themes/`, `platform/tokens/tokens.index.json`,
  `platform/components/Icon/icon.css` and `glyphs.js`, `platform/mobile/`;
  in the spec, `spec-parts.js`, `ds-sample-parts.css`, `native-guidance.js`, `native-guidance-full.js`,
  `platforms-standard.js`, `styling-standard.js`, `reviewed.js` and `usage.js` (ignored in its repository too). Lanes carry
  sources only: check-system fails on one of those under `lanes/<task>/design-system/`. Add `lanes/<task>/BASE` with the
  spec commit you built on (check-system warns when it is missing).
- Clean copy for builds and proofs: a detached `git worktree` (for example `../Plenix-b0`) with `node_modules` linked
  as a junction; copy in only your changed files; for build-app, write `platform/design-system/.git` as
  `gitdir: C:/Users/Administrator/Documents/Plenix/.git/modules/platform/design-system` and remove it after.
- Local server for the spec and apps: `http://localhost:8767/Plenix/…` (the `plenix-static` preview), or `tests/lib.js` `serve()` in scripts.
- Shell quoting: `node -e` and heredocs eat backslashes and quotes; write scripts to files (the Write tool) and run them.

## Green before a merge (issue 690)

- A pull request merges into `styling/phase-2` only when its head commit is green on every check CI runs (`.github/workflows/ci.yml`):
  - `Build and checks`: the generated-files check, build, system check, Stylelint, the Plenix style check, the spec check, the release build, the bundle rules and the tests without a browser.
  - The six browser jobs: `Browser tests (pages)`, `(typography)`, `(reflow)`, `(component tokens)`, `(fixtures)` and `(behavior)`. They run in changed mode, so a job that finds nothing to run is green.
  - The `qa-passed` label on the pull request (the phase guard), recorded by the QA Engineer on that exact commit.
- A check that is red on the pull request is fixed in that pull request. It is never merged around, and never left for the next one.
- A red `styling/phase-2` is reported by CI itself: a push that ends red opens, or updates, one issue labeled `red-main` that names the failing jobs and the commit, and the next green push closes it. It is the `red-main` job at the end of `ci.yml`; it uses only the run's own token.
  - While a `red-main` issue is open, a pull request merges only if it fixes that failure, until the branch is green again.
  - The Tech Lead assigns the fix as the next task. A failure that comes from a recorded baseline (visual, component tokens, typography) is fixed by the owner-approved baseline update or by the fix, never by weakening the check.
- Who may change what protects the branch: required status checks and branch protection are repository settings, owned by the owner. They are not changed from a pull request.

## Releasing (after QA passes; paused while the publishing hold stands)

1. Move the "Unreleased" entries of `CHANGELOG.md` into a file (the release script inserts that file as the new
   version's entry; leaving them under Unreleased duplicates them).
2. Before anything is deployed: `node tools/check-readiness.js` (no open `priority:1` issue; the CDN goes live before the tag, so this runs first). Export the git identity, then:
   `bash tools/agent/release.sh "<subject>" <changelog-entry.md> <work-log-entry.md> platform/exports` (the build outputs are not committed, #692; the script leaves out any path git ignores)
   (the work log is `../Plenix - DAM/audit/batches/15-26.md`; the entry may use `{V}` for the version; take the next batch number).
3. **The script's deploy step runs `check-system` on the folder named `Plenix` beside the deploy copy, which is the
   working folder.** If it stops ("check-system failed" with an OK check in the clean copy), deploy from a temporary
   folder named `Plenix`: `git worktree add --detach <tmp>/Plenix <release commit>`, `git submodule update --init`,
   a `node_modules` junction, `<tmp>/Plenix - DAM/audit/batches/15-26.md` beside it, then `bash deploy.sh` there,
   then `git tag v<version> && git push origin v<version>`. Remove the junction before removing the worktree.
4. Verify: `curl https://design-system.lighthouseway.org/cdn/<version>/plenix.js | grep <something new>`; close the issues with the version.
5. The two release checks (owner, cdn-live-27 and readiness-27; read-only tools, not tests; release.yml runs both, the owner sees red or green):
   - Before deploying (step 2) and again in release.yml before publishing: `node tools/check-readiness.js` lists the open issues labeled `priority:1` and exits 1 while any exists (READINESS_OK when none). A release stops while one is open.
   - After deploying, in release.yml before the npm publish (red stops it): `node tools/check-live-cdn.js <version>` compares `release/cdn/<version>/` with what `https://design-system.lighthouseway.org/cdn/<version>/` serves (sha256 per file; different, missing and extra files); LIVE_CDN_OK or exit 1. It compares the records (`index.json`, `bundle-manifest.json`), the archive `plenix-<version>.tgz` (every runtime file), every top-level file and every small folder in full, and a seeded random sample of the large folders (`--sample 200`; `--all` asks for every file, which takes hours because the server rate-limits). It stops at a 15-minute deadline or after 10 unanswered files in a row (exit 2). `--live-only` checks the live files against the live `bundle-manifest.json` when there is no local build.
   - A tag pushed but never published (the Release run failed or was cancelled): run Release by hand from the branch that has the fix (Actions, Release, Run workflow, input `tag`, for example `v0.74.0`). It builds and publishes exactly that tag's tree with the branch's workflow file and live-CDN check, and refuses a tag that does not match its `package.json` or already has a GitHub release.

## Where to start

Issue #252 lists everything. The current front of the work:
- **Header study** #244: both styles are shipped; left are the 30 capability headers (spec and apps).
- **Styling Standard**: zero overlap for 137 stylesheets (#207–#210, open Codex PRs #222–#234), Phase 5 cascade layers
  and no `!important` (#249), Phase 7 unused classes (#250), Phase 8 bundle size (#152), Phase 4 rest (#253).
- **Icons architecture** epic #277 (#278–#286).
- **The design system as a database** #264 (+ #265 Web/iOS/Android split, #266 a record per variation, #267 styling per variation): needs the owner's schema review.
- **Apps connected to the CDN both ways** #273: needs the owner's choice of channel.
- **Owner decisions waiting**: #217 touch targets, #257 spec wording, #259 black, #260 Mono numbers, #263 the color references bug (page to confirm).
- RedSave and DataGrid findings (P-xx, DT-xx issues), the variant block #251 (Figma limit), the complete library #45.

## Housekeeping you will meet

- Old worktrees and `../Plenix-*` copies (#258). Remove each one's `node_modules` junction first (`rmdir`, or PowerShell
  `(Get-Item <path>\node_modules).Delete()`), never a recursive delete through it, then `git worktree remove --force`.
  - The 2026-10-26 reset listed 51 stale ones (about 5.2 GB), all merged or pushed; their uncommitted leftovers are saved
    in `Archived/worktree-leftovers-2026-10-26/`. Their removal waits for the owner's approval.
  - Keep the worktrees of live sessions and of open PRs.
- Test files: every `tests/*.test.js` is in a list of `tests/run.js`, or started by another test or the package build,
  or named in a component README. A one-off proof test is deleted once its work is merged (git history keeps it).
- `memory/` in the repo root is a stray worktree folder, not project content; do not commit it.
- The older handoff (2026-10-15) is in git history (`git log -p HANDOFF.md`).
