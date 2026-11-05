# Plan: Phase 0, PDS 1.0 foundation (slice `phase-0`)

Owner of this plan: PDS1-Delivery-Lead. Parent issue: #178. Spec: plan.md §5 and §7. G4 is approved by the Delivery Lead (see the end).

## Global constraints (copied into every task)
- Tokens only; no raw colors, off-scale radii, numeric font sizes or `transition: all`.
- Logical CSS properties only (no physical left/right).
- EN and AR strings through the catalog; no unapproved Arabic in `ar.js` (D-0012).
- §7e behaviour tests in the same PR as the code.
- No build outputs committed; published CDN versions are immutable; `latest.json` keeps `pins`.
- `DESIGN.md` is the contract. Test first (RED then GREEN evidence). Fix rounds: 5 per task, then re-plan.
- Only new problems block CI (diff-aware).

## Tasks
| ID | Task | Owner role | Files (sole owner) | Depends on | Proof commands |
|---|---|---|---|---|---|
| P0-1 | Monorepo scaffold: `packages/{tokens,icons,styles,react}`, fold in the submodule | ds-architect | `packages/**`, root `package.json`, `package-lock.json`, `tsconfig.json`, `.gitmodules` | none | `npm ci && npm run build --workspaces` |
| P0-2 | Style Dictionary: reuse closed platform#928 (branch `task/872-w3c-readers`) | ds-architect | `style-dictionary/**`, `tokens/*.json` | P0-1 | `node build-tokens.js && node check-spec.js` |
| P0-3 | `DESIGN.md` v0 as-is (D-0004..D-0011) | design-director | `DESIGN.md`, `design.rules.json` | none | `node check-spec.js` |
| P0-4 | New CI, diff-aware; re-enable Actions; replace 0.x workflows | release-architect | `.github/workflows/**`, `tools/ci/**` | P0-1 | workflow run green on a stub PR |
| P0-5 | Branch protection, required checks, auto-merge | release-architect | repo settings (`gh api`), `docs/pds1/branch-protection.md` | P0-4 | `gh api repos/plenix-ds/pds/branches/main/protection` |
| P0-6 | Rulesync (CLAUDE.md/AGENTS.md) and lefthook | release-architect | `rulesync.jsonc`, `.rulesync/**`, `lefthook.yml` | P0-4 | `npx rulesync generate --check` |
| P0-7 | Lint checks 1-7 (stylelint rules) and 8 (contrast matrix) | ds-architect | `tools/stylelint/**`, `tools/checks/contrast/**` | P0-2, P0-3 | `npx stylelint` fixtures RED then GREEN |
| P0-8 | Lint checks 9-11 (state manifest, numeric columns, pill height) | component-engineer 1 | `tools/checks/states/**`, `tools/checks/numeric/**`, `tests/pills/**` | P0-1 | `npx vitest run tools/checks`, `npx playwright test tests/pills` |
| P0-9 | Check 12: visual regression, light and dark per PR | component-engineer 2 | `tests/visual/**` | P0-1, P0-4 | `npx playwright test tests/visual` |
| P0-10 | Locale checks (6 listed in §7) | i18n-engineer | `tools/checks/locale/**` | P0-1 | `npx vitest run tools/checks/locale` |
| P0-11 | Storybook and docs shell | technical-writer (+ CE 1 for stories) | `.storybook/**`, `docs/site/**` | P0-1 | `npm run build-storybook` |
| P0-12 | Publish dry-run: npm + CDN + API, immutable, `pins` kept | release-architect | `tools/publish/**`, `.github/workflows/release.yml` | P0-1, P0-4 | dry-run job output, `node tools/check-live-cdn.js` |
| P0-13 | Dashboard (Decisions and Visual checks), generated, read-only | release-architect | `dashboard/**` | P0-4 | `node dashboard/build.js` |
| P0-14 | Pinned Daily summary issue; triage of the 177 transferred issues | product-lead | GitHub only | none | `gh issue list` |

Note: P0-4, P0-5, P0-6, P0-12, P0-13 are all release-architect: one session, run serially (P0-13 has its own 2-day box).

## Ownership
One owner per file or directory above; no overlap (checked by hand against the table). Token tiers and public API files: ds-architect only. Per-package engineers use their own worktree.

## Conflict pre-scan (2026-11-05)
`gh pr list -R plenix-ds/pds`: no open PRs. Hotspots with a change plan:
- Root `package.json` / `package-lock.json`: only P0-1 edits them first; later tasks add devDependencies in rebased PRs, one at a time through the queue, appending alphabetically in `devDependencies`.
- `.github/workflows/**`: only release-architect (P0-4, P0-12 add new files, never edit the other's).
- `tokens/*.json`: ds-architect only.

## Merge order
tokens (P0-1, P0-2) -> styles (P0-7) -> react/tests (P0-8, P0-9) -> CI/protection (P0-4, P0-5, P0-6) -> docs (P0-3, P0-11) -> publish (P0-12) -> dashboard (P0-13). Locale (P0-10) after P0-1. One PR at a time per package. Conflicts go back to the owning engineer; PRs over 48h are rebased or closed.

## Sessions (agents.config.yaml: long_work.max_running 4)
Wave 1 (4 slots): ds-architect (P0-1, P0-2), release-architect (P0-4), design-director (P0-3), i18n-engineer (P0-10 after P0-1 lands; until then it reads the catalogs). Coordinators (product-lead, delivery-lead) take no slot.
Queued: component-engineer 1 and 2 (P0-8, P0-9) and technical-writer (P0-11) start as slots free after P0-1.

## G4
Every task has an owner, files and proof commands; no file has two owners. Approved by PDS1-Delivery-Lead.
