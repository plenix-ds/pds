# Ledger: slice `1201` (performance standard)

Rulings: `Ruling: what, why, cost if wrong`. Newest last.

- 2026-11-10, **Ruling:** the slice is split into 15 tasks (plan.md), 11 new issues #1205 to #1215 plus the in-flight #1188 and #1194. Why: the owner asked for rule 2 and the #1188 CSS fix first; rule 2 needs an ADR before any build, so B1 and C1 start now and the builds wait. Cost if wrong: a re-order of blocked issues.
- 2026-11-10, **Ruling:** blocked tasks carry the `blocked` label and the Delivery Lead removes it when the blocker merges. Why: the scheduler starts a role for any labelled open issue without `later` or `blocked` (D-0155); a role started with nothing to do stops after idle_exit_min. Cost if wrong: a role is started for a task that is not ready.
- 2026-11-10, **Ruling:** #1191 merges before #1197. Why: #1197 is then measured by the budget check it relies on; the check is not changed by #1197. Cost if wrong: a rebase.
- 2026-11-10, **Ruling:** E2 (#1215) is closed as superseded by PR #1204, and E1 (#1214) becomes a check of that doc's API claims. Why: the Technical Writer wrote `docs/integration/performance.md` at 17:06Z, before the slice issues existed; a second E2 would be the same file twice. Cost if wrong: none.
- 2026-11-10, **Ruling:** the Remote Control decision (PR #1198) is renumbered D-0161. Why: #1198 and #1200 both took D-0159; #1200's design text cites D-0159 by name, so renaming mine costs less. Cost if wrong: a one-line rename.
- 2026-11-10, **Note:** the DS Architect's ADR 0052 (PR #1217) decides one public entry per export (`@plenix-ds/react/<Export>`, `esm/<Export>.js`). After it merges I unblock #1208 and #1209 and file one slice for the release-architect build, then one per on-demand candidate the ADR names.
