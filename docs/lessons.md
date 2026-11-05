# Lessons

What the 0.x project taught us (plan §2), plus confirmed lessons added after each M/L item. Keep each lesson to one line: what happened, then the rule.

## From 0.x (2026-10-08 to 2026-11-03)

- **241 versions in 26 days, with the DataGrid reversed 5 times.** → Decide before building: a written spec and `DESIGN.md` come first. Rulings go in the ledger, not silently into code.
- **CI had 0 green runs out of 1,509, and checks weren't a merge gate.** → Required checks only, and diff-aware so only new problems block. Tests are quarantined with an owner within 24h, never deleted.
- **0 of 58 Codex PRs were merged.** → One team and one instruction source (Rulesync). Codex stays on standby.
- **The owner was the gate on every merge and look: 341 queued questions, 19–21 stuck merges.** → Full autonomy, decision cards with the recommendation applied, and never asking twice (`decisions.yaml`).
- **About 35% of effort went to process and 25% to rework.** → Small PRs the same day. Measure with the checks, not with reports.
- **About 56 agent processes ran on 15 GB, near out-of-memory.** → Limits come from `agents.config.yaml`, with a memory limit per session.
- **One shared owner GitHub identity made 715 of 786 commits.** → Bot identity per role through the GitHub App, and signed comments until then.
- **Cron polling every 1–2 minutes.** → Webhooks.
- **An agent's report was taken as fact.** → Evidence (Ran/Skipped/Planned/Manual) plus `git log` and the checks.
- **`check | tee log` hid failures** (from CTM). → Workflows use `bash` with `pipefail`.
- **"Arabic never shipped" was wrong:** a stale local clone was read instead of `main`. → Check `origin/main` before claiming anything about the repo.

## PDS 1.0

- **CTM 3.0 re-asked the owner after each answer (new cards D-0032, D-0033) and ran each answer as its own long chain.** → The owner's answer is final: act on the sensible reading, say it in one line, handle all answers in one pass, and refresh the dashboard once (D-0035).
- **PDS had no dashboard page when the owner asked for "the html page like CTM".** → When the owner points at a working example, ship that example first, then improve it (D-0034).

## From PDS 1.0 (2026-11-05)

- **Twice, changelog fragments merged in the same merge-queue group as the version PR shipped without CHANGELOG lines** (0.87.0: #311; 0.88.0: #334, #292). → At a release, check `changelog.d` at the exact release commit; put any late fragment in the GitHub release notes and fold it on `main` right after.
- **A required check was blocked by its own cancelled run** (#345): opening a PR with a label fires two events, and `cancel-in-progress` cancelled one. → Required checks never use `cancel-in-progress`; a run that takes seconds just finishes.
- **Four duplicate builds in one day** (#324/#320, #364/#365, #417/#420, #422/#425): two engineers built the same issue because a hand-off said "the other engineer if free" and nobody had claimed it first, so one finished PR was thrown away each time. → Before building, comment "claiming" on the issue and check for an open PR that mentions it; the first claim wins, and the Delivery Lead closes the later PR as a duplicate.
- **A queued PR's branch is locked** (#306): pushing to it fails until it is dequeued (`dequeuePullRequest`), and a comment saying "pushed" before checking the push result was wrong. → Check the push result before reporting it; dequeue first, push, then re-queue.
