---
name: pds1-slice
description: SOP for running one PDS 1.0 request (bug, feature, UI/UX change, token or release work) end to end through phases 1-8 and gates G1-G8 with the pds1-* roles. Use when picking up an owner issue or roadmap item, or when asked to build, finish or fix something in plenix-ds/pds.
---

# PDS1 slice SOP

Source of truth: `docs/pds1/plan.md` §4-§7e. Borrowed from MetaGPT (artifacts),
ChatDev (loop caps, lessons file), obra/superpowers (writing-plans,
subagent-driven development; MIT) and agency-agents (roles).

## Rules for whoever runs the slice (usually the Delivery Lead)

- **Never stop to wait for the owner.** Intent questions go through
  `pds1-owner-interview`: card posted, recommendation applied, work continues.
- **Everything is on GitHub** under the role's bot identity; artifacts are files, not chat.
- **Subagents see nothing of this conversation.** Each dispatch carries: one line
  of context, the issue link, the slice folder, files to read first, the task,
  acceptance IDs, rulings so far, **owned files and forbidden files**, the exact
  commands to run, and where to write the report.
- **Concurrency from `agents.config.yaml`** (adjustable; changes logged as a
  `decision` issue): at most 4 long-work sessions; short tasks (review, lint,
  one test, a reply) run on top, capped at about 15 minutes, else they queue as long work.
- **A report is a claim** until `git log <base>..HEAD --stat`, the ownership
  check and the RED/GREEN evidence confirm it. Evidence: Ran / Skipped / Planned / Manual with a path.

## Size and route

| Size | Example | Route |
|---|---|---|
| S | typo, doc fix, one-line CSS or copy | engineer (`pds1-tdd` if behaviour changes) -> Code Reviewer -> merge. No brief/design/plan files; ledger line on the issue |
| BUG | owner bug, CTM breakage report | Debugger (`pds1-debug`) failing test -> owning engineer -> G5 gates by path -> release |
| M | one component, a token change, a docs section | phases 1-8 below |
| L | new family, token tier, public API, DataGrid work | DS Architect ADR first, then split into M slices |

## Artifacts: `docs/pds1/slices/<id>/`

`brief.md` (spec), `design.md` (design + contract), `plan.md` (tasks, owners,
conflict table), `ledger.md` (rulings, statuses, minors), `evidence.md`
(commands, results, screenshot links). M and L only.

## Phases

0. **Prepare.** `git fetch origin`; branch `work/<area>-<id>` from `origin/main`
   in the engineer's own worktree; read `docs/lessons.md`; record the baseline
   of the checks so old failures are known.
1. **Spec - G1.** Product Lead -> `brief.md`: P0/P1/P2, non-goals, acceptance IDs,
   no open "Anything unclear" (cards applied, not waited on).
2. **Design - G2.** Design Director -> `design.md`: fits `DESIGN.md`, state list,
   edge cases (long text, empty, 10k rows; Arabic only when text or direction changes). Pictures only if the owner asked.
3. **Contract + plan - G3, G4.** DS Architect: ADR for any new public prop or token
   tier. Delivery Lead -> `plan.md`: tasks, interfaces, package owners, conflict
   pre-scan, merge order. A fresh reviewer lists what a builder would have to guess; each item gets an answer or a ruling.
4. **Build.** One Component Engineer per package/worktree; tasks serial; test-first
   (`pds1-tdd`); stories for every state. Status DONE / DONE_WITH_CONCERNS /
   BLOCKED / NEEDS_CONTEXT. BLOCKED gets more context, a split or the Debugger,
   never an unchanged retry. Ambiguity -> `Ruling: what - why - cost if wrong` in the ledger.
5. **Verify - G5a-e**, in parallel, read-only, as the change needs:
   Code Reviewer (always), Design Critic (any visual change), A11y-RTL Auditor
   (any UI change), QA (always; §7e behaviour tests), Security (HTML injection
   points, deps, CI, publish, `/api/v1`). Fix loop: one brief per engineer with
   every blocker; re-run only the gates that raised them. Caps: 2 rounds per review, 3 for QA, 5 per task, then re-plan. ENV failures don't use a round.
6. **Localize + document - G6, G7** (overlaps 4-5). i18n Engineer: AR proposals,
   only owner-approved Arabic in `ar.js`. Technical Writer: docs, messages (§7d), changeset.
7. **Integrate.** PR with the evidence table and CI screenshots; merge queue,
   `gh pr merge --auto` once required checks pass; conflicts go back to the owning engineer.
8. **Release - G8** (Release Architect, on demand): readiness report -> tag ->
   npm + CDN + API -> live check (auto rollback) -> summary with "Rulings I made".

## Close

Lessons that cost a round go to `docs/lessons.md`. Final comment on the owner's
issue: outcome first, PR and release links, before/after screenshots for UI,
evidence summary, rulings, decisions applied (ids), deferred minors. No "done"
without command output from this session.
