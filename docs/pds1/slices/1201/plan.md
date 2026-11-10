# Plan: Performance standard (slice `1201`)

Owner of this plan: PDS1-Delivery-Lead. Parent issue: #1201 (owner rules, D-0160; CTM tracks it as CTM#311). Related: #1188 (CSS and compression), #1194 (loading thresholds). G4 is approved by the Delivery Lead (see the end).

## What the owner asked
- **Rule 2, code per screen:** an app loads only the components a screen uses. `plenix.js` is 2,691,608 B raw (572 KB brotli); the all-in-one file stays for the current major version.
- **Rule 7, speed is measured:** main content within 2.5 s (LCP), a click answered within 0.2 s (INP), on reference pages (a DataGrid with 50 rows, a record page, a form). A build check fails when a page gets slower than its budget.
- **Rules 1, 3, 4, 5, 6, 8** are app-side: Plenix documents them and links the API that supports each.
- Order: rule 2 and the #1188 CSS fix first, since they are the measured slowness.

## Global constraints (copied into every task)
- Tokens only; logical CSS properties only; EN and AR strings through the catalog; no unapproved Arabic (D-0012).
- §7e behaviour tests in the same PR as the code; test first (RED then GREEN evidence).
- No build outputs committed. Published CDN versions are immutable; `cdn/latest.json` keeps its shape, including `pins`.
- `DESIGN.md` is the contract. Token tiers and public API files belong to the DS Architect.
- Never run a test locally; static checks only before a push. Fix rounds: 5 per task, then re-plan.
- A role is started by the label on its issue (D-0155, #1182): every task below carries its role's `agent:` label. A task waiting on another carries `blocked`; the Delivery Lead removes it when the blocker merges.

## Tasks
| ID | Issue | Task | Owner role | Files (sole owner) | Depends on | Proof |
|---|---|---|---|---|---|---|
| A1 | #1188, PR #1191 | Brotli on the web host; budget check for scope tokens and `plenix.js` | release-architect | `tools/checks/perf-budget.*`, `deploy/web/**`, `deploy.sh`, `.github/workflows/ci.yml`, `.github/workflows/release.yml` | none (in flight) | `node tools/checks/perf-budget.test.mjs`; live `Content-Encoding: br` |
| A2 | #1188, PR #1197 | Re-declare component tokens only where they can change (ADR 0050) | ds-architect | `packages/tokens/sd/assemble.cjs`, `platform/tokens/components.tokens.json`, `docs/adr/0050-*`, `changelog.d/1188.md` | none (in flight) | scope count per DataGrid 5,737 → 512; `perf-budget.mjs` |
| A3 | #1205 | Lower the scope-token limit to the new count | release-architect | `tools/checks/perf-budget.json` | A1, A2 | `node tools/checks/perf-budget.mjs` and its self-test |
| A4 | #1206 | Before/after trace of the CSS fix | qa-engineer | `tests/perf/**` (with C1) | A2 released, C1 | trace output under `docs/pds1/slices/1188/evidence/` |
| B1 | #1207 | ADR: entry points, loader and icon sets for code per screen | ds-architect | `docs/adr/00NN-*`, `decisions.d/D-NNNN.yaml` | none | measured table in the ADR |
| B2 | #1208 | Build per-family parts, CDN layout, loader | release-architect | `platform/loader/**`, `deploy.sh`, `build-packages.js`, `vite.packages.config.mjs` | B1 | bytes loaded by a one-screen page below the all-in-one; G8 |
| B3 | #1209 | Icons per set | component-engineer 1 | `build-icons.js`, `packages/icons/**` | B1 | bytes for one set; typings unchanged |
| B4 | #1210 | Integration doc, code per screen | technical-writer | `docs/integration/code-per-screen.md` | B2 | samples run against the release |
| B5 | #1211 | CTM loads per screen | component-engineer 2 | LighthouseCollection/CTM (its own CI) | B2 released, B4 | before/after bytes and LCP |
| C1 | #1212 | Reference pages and a headless trace harness | qa-engineer | `tests/perf/**` | none | `node tests/perf/run.mjs` prints LCP and INP |
| C2 | #1213 | CI check: a page slower than its budget fails | release-architect | `tools/checks/perf-budget.*`, `.github/workflows/ci.yml` | C1, A1 | a breaching throwaway PR fails |
| D1 | #1194, PRs #1199, #1200 | LoadingState 1 s / 10 s thresholds (D-0158) | component-engineer 2 | `platform/components/Loading/**` | none (in flight) | its own §7e tests |
| E1 | #1214 | Which Plenix API supports each app-side rule; gaps filed | ds-architect | none (a comment on #1201) | none | table on #1201 |
| E2 | #1215 | Integration doc for the app-side rules | technical-writer | `docs/integration/performance.md` | E1 | linked APIs exist at the paths named |

## Ownership
- One owner per file; no file has two owners except the two hotspots below, each with a change plan.
- One engineer per package; each in their own worktree. Public API and token tiers: DS Architect only.
- **Hotspot `tools/checks/perf-budget.json`** (A1 creates it; A3, C2 and B2 add to it): release-architect only, one PR at a time, each task adds its own top-level key (`scopeTokens`, `bundles`, `traces`) and never edits another task's. Order: A1, A3, C2, then B2's `bundles`.
- **Hotspot `.github/workflows/ci.yml`**: release-architect only (A1, then C2); the other roles never edit it.
- **Hotspot `tests/perf/**`**: C1 creates it (QA); A4 adds files under `tests/perf/runs/` only.
- **`changelog.d/`**: each PR adds its own fragment file (no shared file).
- **Package entry points** (`packages/react`, `platform/index.ts`): B1 decides, B2 changes; no other task edits them.

## Conflict pre-scan (2026-11-10, `gh pr list`)
- #1191 (A1) and #1197 (A2) share no file. #1197's token output feeds the check #1191 adds; #1191 lands first, so #1197 is measured by it, and A3 lowers the limit after both.
- #1199 and #1200 (D1) touch ADR and design files only. #1193 (DataGrid row hover) touches `data-grid.css`, which no slice here edits.
- #1177 (Arabic "upcoming") touches `platform/i18n/ar.js` and the approved-Arabic list, which no slice edits.
- No open PR touches the files of B1 to E2.

## Merge order
A1 (#1191) → A2 (#1197) → A3 → release (the CSS fix reaches the CDN) → A4 trace. In parallel from the start: C1, B1, E1, D1. After B1: B2, B3 (B3 before or with B2; icons are a separate package). After B2: B4, B5. After C1: C2. After E1: E2. Within a package one PR at a time through the merge queue.
- Releases: the CSS fix and brotli ship in the next patch or minor; code per screen (B2, B3) is a minor release of its own. The release-architect decides the version; fragment PRs are held while a version PR is open, as usual.

## Sessions
- `long_work.max_running` and `reserved_gate_slots` in `agents.config.yaml`. Roles with work now: ds-architect (A2, B1, E1), release-architect (A1, then A3), qa-engineer (C1), component-engineer 2 (D1). Technical-writer, component-engineer 1 and the rest start when their blockers clear (their `blocked` label is removed). Idle roles stop after `long_work.idle_exit_min` and restart on their label (D-0155).
- QA runs a browser: its own memory limit applies (`memory_limit_gb`, role QA).

## G4
Every task has an owner, files and a proof; no file has two owners; the three shared files have a change plan and an order. Approved by PDS1-Delivery-Lead.
