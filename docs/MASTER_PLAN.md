# Master plan: PDS (Plenix design system)

Owner of this file: the lead PM, "PDS2 - PM" (team core). It follows `docs/PROJECT_PLAN.md` §4. It is reviewed at every release and whenever Backlog and Ready are both empty (§4.6). Settings such as slot counts and `ready_min` live only in `.agents/agents.config.yaml`; this file names them and never repeats their numbers.

## 1. Vision

Plenix is the one design system for the owner's applications: tokens, icons, styles and React components, published together on GitHub Packages and on the CDN (`design-system.lighthouseway.org/cdn/<version>/`). An app looks and behaves right with no CSS of its own, in English and Arabic. It loads fast, follows new Plenix versions safely and on its own, and never needs a person to tell it a release exists.

## 2. Users and outcomes

| # | Outcome | Measured by |
|---|---|---|
| O1 | CTM runs on Plenix with no local CSS | CTM's Plenix requests all closed; CTM's own style audit finds 0 local rules |
| O2 | Apps follow releases safely | 0 breaking changes in a minor or patch (`VERSIONING.md`); "live in Plenix", "the app loads it" and "the app uses it on its screens" checked separately (`docs/lessons.md`) |
| O3 | Every component is proven by behavior tests | Required CI green on `main`; the §7e baseline covered per component |
| O4 | English and Arabic are always complete | G6 passes at every release with no exception left open |
| O5 | Apps feel fast | The owner's performance standard (D-0160, #1201): LCP ≤ 2.5 s, INP ≤ 0.2 s, code per screen, checked in CI |

## 3. Scope and non-goals

- **In scope:** the four packages (`@plenix-ds/tokens`, `icons`, `styles`, `react`), the CDN and API, the design specification site, and what connected apps (CTM, RedSave, the dashboard) need from Plenix.
- **Non-goals:** mobile (D-0013, parked); dark-mode redesign (dark mode is worked last, D-0025); theming beyond the blue default (D-0008); app features that belong in the apps themselves; app-side patches (D-0121: fixes go into Plenix).

## 4. Milestones

Current version: **1.8.0** (live on the CDN, `latest.json` = 1.8.0, checked 2026-11-13). The current milestone is specified to Ready issues; the next one to epic level only (§4.4).

| Milestone | Contents (epics) | Status |
|---|---|---|
| 1.0.0 to 1.8.0 | Coverage map, language gate, G0; data font (most items); performance slices A–F; person tile; nav-pane design | **Shipped** (1.8.0, PR #1307) |
| **1.9.0** (current) | E9 performance per screen (rest), E10 data font (last item), E11 navigation panes, E12 RTL truncation, E13 PDS2 cutover clean-up | In progress |
| 1.10.0 (next) | E14 releases from CI (#1314), E15 repository clean-up (#1309), E5 contrast (dark phase, `later`) | Epic level |

## 5. Epics

| Id | Epic | Outcome | Packages | Milestone | Status |
|---|---|---|---|---|---|
| E9 | Performance per screen (#1201): on-demand slices #1266, #1267, #1268 (merged: #1319, #1322, #1324); CTM per-screen load #1211 (blocked on its measurement); CDN 429 limit #1287 (blocked on proxy access) | O5 | react, styles | 1.9.0 | Slices done; #1211 and #1287 blocked |
| E10 | Data font (#1232, D-0164): item 18, Chat counts and voice time (#1305, PR #1317) | O1 | styles, react | 1.9.0 | Done (#1317 merged); #1232 closes at the release |
| E11 | Navigation panes (#1242, #1243, D-0168/D-0169, ADR 0057): PR #1269 | O1 | tokens, styles, react | 1.9.0 | Done (#1269 merged) |
| E12 | RTL truncation (#1283): the `bidi-isolate` backlog, part by part | O4 | styles | 1.9.0 | Part 2 merged (#1321); part 3 PR #1323 blocked by the guard (K-0192, K-0193) |
| E13 | PDS2 cutover clean-up: retire the PDS1 watchdog heartbeat (#1312), then the rest of the PDS1 framework in one PR that keeps every required check green (`docs/project-rules.md`) | O2 | none (tooling) | 1.9.0 | #1312 done (#1320); the rest is Backlog |
| E16 | Behavior tests run in CI (#1327, PR #1328), then fix what the first full run found (#1329–#1338, #1343, #1344, #1349; #1335 is S2) | O3 | styles, react | 1.9.0 | #1328 waits on G5d; fixes Ready |
| E14 | Releases from CI: VM 130 reachable, package publishing (#724), keys off the agent host (#1314) | O2 | all | 1.10.0 | Waits for a member (plan §7.2) |
| E15 | Repository clean-up (#1309, owner's four-way method) | O3 | none | 1.10.0 | Backlog |
| E5 | Contrast and minimum sizes (#206, #251, #1085, #1090, #1117, #1120) | O3, O4 | tokens | dark phase | `later` (D-0025) |

## 6. Lanes and owners

The role registry is `.agents/agents.config.yaml`; roles are listed in `.agents/RULES.md`. One team, `core`. Ready items per active lane (target: `ready_min`), as of 2026-11-13 20:40 UTC:

| Lane (role) | Ready | In progress | Short of `ready_min`? |
|---|---|---|---|
| Build (engineer) | #1343, #1331, #1332, #1333, #1349 (after #1338) | #1338, #1334; #1283 part 3 (blocked by the guard); #1335 (parked until #1328) | No |
| Verify (release, qa) | — | #1327 (PR #1328, G5d when CI finishes) | — |
| Release (release) | #1288 (app bumps; now to 1.8.0) | — | Yes: E14 waits for a member |
| Locale (i18n-engineer) | — | #1171, #1203 wait for the owner's Arabic | Yes: nothing else recorded |
| Design (design-director), architecture (architect) | Gate work on PRs #1269, #1317 | — | Gate lanes; no planned items |
| Delivery (delivery-lead), docs (technical-writer) | — | — | Idle: no recorded need |

A lane short of Ready items with no recorded need stays idle (§4.5): agents never invent work.

## 7. Evergreen backlog

Recorded needs only (§4.5). Each item links its finding. They rank below planned work.

- Behavior-test gaps against plan §7e, per component (QA findings)
- Contrast and accessibility defects (#251, story axe findings #1085, #1090, #1117, #1120)
- Dead code and unused tokens or keys (Knip; repository clean-up #1309)
- Arabic proposals without a Microsoft or other standard term (D-0078; #1171, #1203)
- Items from `docs/lessons.md`

## 8. Risks and open decisions

- **Kit guard:** it refused an engineer's edit inside its own working copy (K-0192, K-0193), which blocks #1283 part 3 (PR #1323); and read-only gates can't build or link `node_modules`, so G5d browser checks run only in CI (K-0194 to K-0196). Kit 3.4.3 did not change either. A member fixes them.
- **Releases need a member:** the publish key and package rights are only on the `cc` account (#724, #1314).
- **One shared GitHub identity:** a gate comment alone stops nothing; gate labels and auto-merge do (D-0056, D-0062, #1068).
- **Owner answers pending:** Arabic for #1171 and #1203. Both ship in English until answered.

## 9. Change log

- 2026-11-13 20:40: refreshed by PDS2 - PM: E9 slices, E10, E11 and #1312 done; E16 added for the behavior-test findings; build lane re-filled.
- 2026-11-13: rewritten by PDS2 - PM for the PDS2 cutover (D-0174, D-0175): current version 1.8.0, milestone 1.9.0, lanes from the PDS2 registry.
- 2026-11-07: Plenix 1.0.0 shipped (CDN, npm and API; G8 PASS).
- 2026-11-06: created from template v2.4 by the PDS1 Product Lead.
