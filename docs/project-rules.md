# Plenix design system (PDS): project rules

Written once by dispatch kit 3.4 (Project Plan 3.4); this file now belongs to the project. Every agent follows it together with `.agents/RULES.md`. It adds to those rules and never weakens them.

Add short, definitive rules here as the project needs them, each by a PR that links a recorded decision.

## Rules
- None yet.

## PDS specifics (added when PDS2 was set up, 2026-11-13)

### The owner's standing rules
Moved here from the old team's global instructions on the agent host, so every agent sees them.
- Plain words for the owner: outcome first, short, no jargon. The owner is not a developer.
- Ask before fixing what the owner reports: explain the cause and the options, then fix after the owner chooses.
- Commit and push never wait for the owner. A visual change gets an owner QA item on the dashboard after AI QA, with pictures of the reviewed commit; the owner's "Changes requested" goes back through QA.
- Tokens only. No new colors (exception: gray 250). No inline styles (exceptions: the rich-text engine, ECharts with token values). No `!important`. Corners 2 to 6px. Everything on the 4px grid.
- Fluent-style buttons. No icon in a box. No action links. Statuses are badges with an icon, never a dot. Table header labels left-aligned. Dark mode last.
- American English. Documentation reads as definitive rules, bullets for two sentences or more.
- **Show me first:** when the owner asks to see a change or a design first, show it before building: apply it live in a preview page or a mock, take one headless-Chrome picture, and send it. Build only after the owner says go.

### Tests (settled 2026-11-13)
The old global rule "never run a test" conflicted with this repository's test-first rule, which CI enforces. Test first holds. On the agent host, run only the tests you write and the ones that cover your change, plus the quick static checks for the changed files (`node check-system.js`; `node check-spec.js` when the spec changed) right before a push. Never run the full suites on the host: CI runs them. Use the smallest build that covers a change (for example only the token build for a token change); run `node build-app.js` only when JavaScript or JSX changed.

### Releases
- The release role prepares the version PR (`VERSIONING.md` steps 1 and 2) and the release issue.
- A member runs the rest from the `cc` account: `bash deploy.sh` from a clean working copy of the release commit, then `bash tools/publish/npm-publish.sh <version>` from the version's tag, then pushes the tag, then `node tools/publish/notify-apps.mjs <version>`. The agents' account has neither the publish key nor the package rights (#724).
- **Release holds:** while a version PR is open, queue no PR that adds a `changelog.d/` fragment.

### Required checks and the PDS1 framework
- `CLAUDE.md` and `AGENTS.md` are generated from `.rulesync/rules/overview.md` (`npx rulesync generate`); edit the source there. CI fails when they differ.
- The PDS1 registry, `.claude/agents/pds1-*.md` and `deploy/agents/` are still read by the "CI result" checks (13, 15, 16 and the launch test). Retire them in one PR that keeps every required check green.
- The watchdog workflow and the dashboard's task list assume PDS1 labels (`agent:pds1-*`); the dashboard's decisions view still works.

### Notes from the PDS1 team
The PDS1 roles' handoffs (2026-11-10) are in the project's notes folder on the agent host (`notes/`). They are history; the rules and decisions win.
