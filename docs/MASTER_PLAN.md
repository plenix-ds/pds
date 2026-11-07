# Master plan — PDS (Plenix Design System)

Owner of this file: pds1-product-lead. It follows the owner's project plan template v2.4, §4 (`docs/pds1/template/project-plan-template-v2.4.md`). It's reviewed at every release (§4.6). Settings such as slot counts live only in `agents.config.yaml`, so no number from there is repeated here.

## 1. Vision

Plenix is the one design system for the owner's applications: tokens, icons, styles and React components, published together on npm and on the CDN (`design-system.lighthouseway.org/cdn/<version>/`). An app looks and behaves right with no CSS of its own, in English and Arabic. It follows new Plenix versions safely and on its own, and it never needs a person to tell it a release exists.

## 2. Users and outcomes

| # | Outcome | Measured by |
|---|---|---|
| O1 | CTM 3.0 runs on Plenix with no local CSS | CTM#48's Plenix requests (PLX-…) all closed; CTM's own style audit finds 0 local rules |
| O2 | Apps follow releases safely and fast | Every release reaches CTM within minutes (D-0083); 0 breaking changes in a minor or patch (VERSIONING.md); class removals are checked against the connected apps first |
| O3 | Every component is proven by behaviour tests | The plan §7e baseline covered per component; required CI green on `main` |
| O4 | English and Arabic are always complete | G6 passes at every release: no missing or unapproved string; terms follow D-0078 |
| O5 | Typed, readable source | All of `platform/` in TypeScript (#57); no `any` in the published props (#61) |

## 3. Scope and non-goals

- **In scope:** the four packages (`@plenix-ds/tokens`, `icons`, `styles`, `react`), the CDN and API, the docs and design spec, the St. John test site, and the needs of connected apps (CTM, RedSave).
- **Non-goals:** mobile (D-0013, parked); dark-mode redesign (dark mode is worked last, D-0024); theming beyond the blue default (D-0008); app features that belong in the apps themselves.

## 4. Milestones

Current version: 0.90.1. The history continues (template §1, principle 6). The next milestone is specified to Ready issues; the ones after it to epic level only (rolling wave, §4.4).

| Milestone | Contents (epics) | Status |
|---|---|---|
| 0.91.0 to 0.93.1 | E3 TypeScript (done), E4 the class removal, the table fixes (D-0087), the 1366 frame (D-0093), the type fixes (#893) | **Shipped** 2026-11-07 |
| **1.0.0** | O3 the coverage map and S1/S2 gaps (#901); O4 the language gate (#902); G0 closed (#903); no open S1/S2 (D-0095) | Next |
| 1.x | The coverage gaps below S2; E7 docs; dark mode (D-0025, last) | Outline |

## 5. Epics

| Id | Epic | Outcome | Packages | Milestone | Status |
|---|---|---|---|---|---|
| E1 | Phase 0 foundation (#178) | O2, O3 | all | 1.0.0 | Most items closed; G0 open |
| E2 | CTM with no local CSS (CTM#48): print (#87), VoteTally options (#265), RTL coverage (#209), Arabic type (#180), icons (#181), class migration (CTM#144) | O1 | styles, react, icons | continuous | PDS side done; CTM#144 open in CTM |
| E3 | TypeScript (#57, #61) | O5 | react | 0.91.0 → 0.92.0 | Charts done (#618); patterns next |
| E4 | Styling cleanup (#122, #125, #723) | O2 | styles | 0.91.0 | Removal merged, waiting for release |
| E5 | Contrast and minimum sizes (#206, #251, #235) | O3, O4 | tokens | 0.91.0 | Open |
| E6 | Test coverage (#46, St. John site) | O3 | all | 0.92.0 | Open |
| E7 | Docs and spec (#353, the remaining #120 batches) | O3 | docs | 0.92.0 | Open |
| E8 | Process: adopt the owner's template v2.4 (registry, dispatcher rules, board, gates) | O2 | none (tooling) | now | This plan's PR opens it |

## 6. Lanes and owners

The role registry in `agents.config.yaml` is the source (template §5.1). Lanes: spec, product-lead; design, design-director; architecture, ds-architect; plan, delivery-lead; build, component-engineer (one per worktree); locale, i18n-engineer; docs, technical-writer; release, release-architect; verify, qa-engineer, plus the reviewers as task roles.

## 7. Evergreen backlog

Recorded needs only (template §4.5). Each item links its finding. They rank below planned P0/P1 work.

- Behaviour-test gaps against plan §7e, per component (the QA findings)
- Contrast and accessibility defects (check 8 baseline, #251)
- Dead code and unused tokens or keys (Knip; catalog keys #667)
- Quarantined flaky tests (#25)
- Arabic proposals that have no Microsoft or other standard term (D-0078)
- Dependency updates (for example PDF.js, #86 and #384)
- Lessons in `docs/lessons.md`

## 8. Risks and open decisions

- One shared GitHub identity until the PDS GitHub App exists (D-0019, an owner step). Hand-offs made with `GITHUB_TOKEN` start no workflow (template §6.1).
- Merge-queue throughput: changes wait on each other's checks.
- CTM's live site doesn't take new builds until VM 107's deploy runner is installed (CTM#90, an owner step).
- Numbers in prose drift from the settings. Today `CLAUDE.md` and plan.md say 4 long-work slots while `agents.config.yaml` says otherwise; template check 15 fixes this.
- The 1.0.0 definition isn't fixed yet; it goes on a decision issue.

## 9. Change log

- 2026-11-07: plan review: 0.91.0 to 0.93.1 shipped; O2 and O5 met; 1.0.0 defined (D-0095); next: #901, #902, #903.

- 2026-11-06: created from template v2.4 (owner's upload) by pds1-product-lead.
