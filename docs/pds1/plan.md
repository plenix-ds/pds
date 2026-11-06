# PDS 1.0 — Restart Plan

Date: 2026-11-04 · Status: decisions recorded, ready for owner review · Nothing has been changed on GitHub, the server or the CDN yet.

---

## 1. The short version

The old PDS (Oct 8 – Nov 2) had solid plumbing but a broken process. Estimated split of effort:

| Where the effort went | Share (est.) |
|---|---|
| New product | ~40% |
| Rework (same thing redone) | ~25% |
| Process, tooling, coordination, bookkeeping | ~35% |

PDS 1.0 fixes this with five changes:

1. **Decide before building.** Each component gets a written spec before code; pictures only when the owner asks for them. Engines are locked up front, and the existing design language is written into `DESIGN.md` so agents follow it.
2. **Rules are checks, not prose.** An owner decision is not "done" until a lint rule or test enforces it. CI fails if a decision has no check.
3. **Full autonomy; CI is the gate.** Agents run with all permissions: they merge their own PRs, run migrations and deploy live once required checks pass. The owner is the product stakeholder and reporter, never an approver. Automatic safety nets (backups, rollback, own-worktree cleanup) replace human approval.
4. **No home-built orchestration.** GitHub Issues + Projects is the dashboard. Tooling is capped at ~10% of effort.
5. **Real semver from 1.0.0.** Agents release on demand once checks pass. Old CDN versions stay live and unchanged.

---

## 2. What went wrong in the old PDS (evidence)

| # | Bottleneck | Evidence | PDS 1.0 fix |
|---|---|---|---|
| 1 | Components redesigned repeatedly | Data grid reversed 5 times in 3 weeks (Table→DataGrid→Tabulator→TanStack→DataTable/Table split→responsive cards); charts custom SVG→ECharts (Codex PRs #222–225 thrown away); header redone ~6 times (27 PRs, 9 header briefs); design references mixed (Fluent, Carbon, Material, Blueprint, Explorer) | Component ADR + written spec against `DESIGN.md` before code (pictures only on owner request); engine swaps need an ADR and a throwaway spike |
| 2 | Owner was the gate on every merge and look | "every merge needs the owner's word"; 341 spec questions queued; 19–21 stuck merges needing an unblock prompt; 31 of 59 decision records unusable without context; ~18 "Other" answers; "why do i feel we have been through this multiple times?!" | The owner gates nothing: decision cards with options and the recommendation applied ("reply B to switch") |
| 3 | Orchestration side-project crowded out product | AITEAM: 978 files, 137 deploy + 128 install scripts, ~12 runtimes evaluated, dashboard rebuilt to v12, kit renamed twice, roles renamed | No custom dashboard/orchestrator; GitHub is the dashboard; tooling ≤10% |
| 4 | CI red and not a gate | 0 successes in 1,509 runs since Oct 27 (partly a missing `red-main` label); policy "Checks are not a merge gate"; tests removed instead of fixed; "QA runs no tests" | Required checks; flaky tests quarantined with an owner within 24h, never deleted |
| 5 | Codex↔Claude handoff failed | 58 Codex PRs, **0 merged**; ~22 sat 4–7 days unrebased; Codex clone 515 commits behind | Claude builds; Codex is on standby (decision 2). One issue = one PR; PRs >48h auto-rebased or closed |
| 6 | Long-lived branch, generated files, submodule | 266 catch-up merges from `styling/phase-2`; `dist/platform.js` committed 188×; submodule pointer bumped 340×; CHANGELOG touched by 39% of commits | Trunk-based; build outputs never committed; monorepo (no submodule); changeset fragments |
| 7 | Rules in prose, not enforced | Radius 2–6 restated by owner, `AGENTS.md` still says "Menus 8px"; pill-size rule spread over 5 PRs; tooltips "light yellow" never applied; "no black" violated 56×; ~23 of ~56 design decisions enforced | Rule = test; `decisions.yaml` where every entry links its check |
| 8 | Status docs rewritten to fight context loss | HANDOFF.md 38 versions, STATUS.md 24; 94 commits touched only process docs; facts in 4+ places | Status comes only from GitHub; one stable ONBOARDING.md; session notes in PR descriptions |
| 9 | Releases too fast to consume | 241 versions in 26 days, 85 minor (breaking under 0.x) | 1.0.0 semver, on-demand releases batched with changesets, deprecation window |
| 10 | Infra and identity | One shared owner GitHub login (715/786 commits under one identity); ~56 agent processes on 15 GB (near-OOM); cron polling; `main` unprotected | GitHub App with bot identity per role; ≤4 long-running agents, plus short-task agents as needed, each with a memory limit; webhooks; branch protection |

**Keep from the old PDS (it worked):**
- Immutable versioned CDN (`/cdn/<version>/`, `index.json`, `SHA256SUMS`)
- Read-only `/api/v1/`
- One version across npm, CDN and API
- DTCG tokens with ref/sys/comp tiers
- The `token-definitions`, `logical-properties`, `inline-style` and `ownership` checks
- Contrast computed from tokens
- ECharts themed from tokens
- `currentColor` icons
- `changelog.d` fragments
- The St. John site as test consumer
- Final engine choices: **TanStack** for the grid, **ECharts** for charts

---

## 3. Design audit of the current PDS

Strong plumbing, weak design language.

**Strong**
- 0 raw hex values in component CSS
- 2,218 logical properties vs 0 physical in components
- 0 `!important` in 0.85
- Token-driven ECharts theme
- Forced-colors support

**Problems found**
- **Token names contain values** (`radius-card-12px`, `size-4px`); some palette names lie (`yellow-600 → green-500`). In 0.85, five radius names all equal 6px.
- **5,216 component tokens** (431 KB CSS); `plenix.css` is 2 MB; 119 tokens unused.
- **Type:** body and heading are both 13px; 83 references to 9–11px sizes, including form labels and error text.
- **Contrast failures the curated test misses**, e.g. dark `content-subtle` 2.22–3.05:1, dark neutral feedback label 1.39:1, dark borders 1.37:1.
- **Dark mode is inverted:** raised surfaces (#444) are lighter than a pure-black canvas, which breaks the "no black" rule.
- **Accent overused:** blue header, labels, nav, buttons, checkboxes and borders all in one view.
- **Mono "data font" inside prose** ("7 events") reads like a typewriter.
- **Tables:** pills wrap to two lines, a rainbow of category colours, numbers left-aligned.
- **Visual regression** covers only Button, in light mode, at one density.
- **Not adopted:** `ctm-admin` doesn't actually use PDS (own 2,764-line CSS, 257 hex values).

**Design rework counted in the repo:**
- 45 design briefs, 6 studies and 178 committed PNGs
- Corners changed 5 times; pill radius still conflicts with the written rule (4px in code, 6px in DECISIONS)

---

## 4. The team

Built from superpowers (workflow and gates), agency-agents (roles), MetaGPT (artifact schemas), ChatDev (loop caps, lessons file) and the 13 design-skill sources.

**Rules for every role**
- Every role posts under its own bot identity.
- Every role writes artifacts as files in the repo, not chat.
- Every role reports evidence as Ran / Skipped / Planned / Manual, with a file path.

### Always-on agents (persistent sessions; at most `long_work.max_running` doing long work at once)

| Role | Model | Owns | Hard gate | Borrows from |
|---|---|---|---|---|
| **Product Lead** (intake and triage: picks up every owner issue on GitHub) | strongest | Logs owner bugs, features and UI feedback as issues, triages and routes them to the right agent, writes specs (P0/P1/P2, non-goals), keeps the decision log, reports back to the owner with links and pictures | **G1 Spec written** (no owner sign-off) | MetaGPT PM, superpowers *brainstorming*, ux-discovery-interviewer, open-design question pattern, ui-craft *remember* |
| **Design Director** (taste owner) | strongest | `DESIGN.md` contract, state matrices, motion and icon rules, data-display design (grid, pills, charts); produces pictures or variants **only when the owner asks** | **G2 Design fits `DESIGN.md`** (no picture required) | impeccable (*shape*, *operate*, DESIGN.md), tasteful-ui gates, jakub *variant* / *state-machine* / *break*, plugin87 *design-doctrine*, ui-craft *brief* |
| **Design-System Architect** | strongest | Package boundaries, token tiers, public API contracts, ADRs, versioning and deprecation | **G3 Contract:** no new public prop or token tier without an ADR | MetaGPT Architect, agency software-architect + ux-architect |
| **Delivery Lead** | strong | Plans with Global Constraints, package ownership, conflict pre-scan, ledger, rulings, merge order | **G4 Plan approved** (by the Delivery Lead) | superpowers *writing-plans* + *subagent-driven-development*, agency senior PM |
| **Component Engineer ×2** (one per package/worktree) | mid | TDD implementation, stories for every state, minimal diffs | Red→green evidence per task | agency frontend + minimal-change engineer, superpowers *TDD*, *systematic-debugging* |
| **i18n Engineer** (EN + AR) | strongest | The existing EN/AR catalogs and Arabic standard (`docs/i18n/arabic.md`): prepares Arabic proposals for the owner, enforces the rules as tests, pseudo-locale. Never writes Arabic without the owner's answer | **G6 Locale:** no missing/unapproved AR strings in a release | agency *i18n-engineer* |
| **Backend & Release Architect** | strongest | `/api/v1` OpenAPI contract, immutable CDN publish, npm packages, CI pipeline, merge queue, the generated dashboard build (static, no backend) | **G8 Release integrity:** no CDN overwrite, npm = CDN version, live smoke test | agency *backend-architect* + devops-automator + git-workflow-master |
| **Technical Writer & Messaging Designer** | mid | Docs site (EN/AR), generated prop/token/API reference, migration guides, changelog; **owns the messaging standard (§7d)**: every error, empty state, confirmation, warning, success and loading message in components and docs | **G7 Docs:** every public API documented, examples compile | agency *technical-writer* |

**How many agents run at once:**
- **Long work: at most `long_work.max_running` at a time** (`agents.config.yaml`). Building a component, a design, a migration, a release. The Delivery Lead starts these sessions as work needs them, so the roster can be eight roles.
- **Small tasks: as many as needed, on top of the long-work slots.** Short jobs that aren't time-consuming: a code review, a lint or typo fix, a single test, triaging an issue, a reply on GitHub, updating the daily summary. Each one is capped at `small_tasks.max_minutes`; if it runs longer, it stops and becomes long work queued behind the long-work slots.
- **Limit by memory, not by count.** Every agent runs with its own memory limit, and new small tasks wait if the server is near its limit. This avoids the old ~56-process near-crash on the 15 GB server.
- **All of these are settings, not fixed rules.** The long-work limit, the small-task time cap and the memory limits (`long_work.max_running`, `small_tasks.max_minutes`, `memory.*`) live in one file, `agents.config.yaml`. The Delivery Lead adjusts them as needed (logged as a `decision` issue, so they show on the dashboard), and the owner can change them any time by commenting on that issue.

### On-demand subagents (spawned for a job, then gone)

| Role | Model | Job | Gate |
|---|---|---|---|
| **Code Reviewer** | mid per task / strongest final | Spec ✓ + quality; Critical/Important/Minor | **G5a:** no next task with open Critical/Important |
| **Security Reviewer** (read-only; from CTM) | strong | Every PR touching HTML injection points (RichText, RichTextEditor paste, CodeBlock, MediaViewer URLs), dependencies, CI workflows, npm/CDN publish or `/api/v1`. Checks for XSS, unsafe URLs, secrets, supply-chain risk | **G5e Security:** APPROVE / REQUEST CHANGES |
| **Debugger** (from CTM) | strong | Called when a test or CI job fails and the owner can't name the cause, or after a second failed fix. Root cause with evidence and a failing test before any fix; tags environment problems as `ENV` instead of looping | Stops after 3 failed fixes and escalates |
| **Design Critic** (separate from the builder) | strong | UI review that reads the **code and the screenshots together** (as CTM's UI review does): checks the change against `DESIGN.md`, the tokens and the states. Screenshots at desktop, light theme by default; dark, mobile width or Arabic/RTL only when the change touches them → reject / rework / ship | **G5b Visual** |
| **Accessibility & RTL Auditor** | mid | axe, keyboard, screen reader, contrast matrix, bidi | **G5c a11y** |
| **QA / Evidence Engineer** | mid | Playwright and Vitest behaviour tests per §7e, visual regression, bundle budget; records NOT TESTED honestly; 3 attempts then escalate | **G5d Behaviour** |
| **Mobile App Builder** (parked: mobile deferred, decision 13) | mid | Touch density, mobile grid/charts, native token builds (Swift/Kotlin/Dart) | Native tokens compile; touch targets pass |
| **Database Optimizer** | mid | API/dashboard data store, Arabic-aware search, migrations | Migration lint, query budgets |
| **Simulated-User Tester** | mid | UXAgent-style persona runs on the docs site ("enable compact grid in Arabic") | Advisory |
| **Drift Auditor** (monthly) | mid | Claude-vs-Codex drift, duplicate logic, token misuse | Feeds backlog |

**Not adopted** (and why):
- **CEO/CPO/CHRO role-play (ChatDev).** Theatre, no output.
- **NEXUS-full (agency).** Months-long, dozens of agents.
- **Chief-of-staff / studio-producer / project-shepherd.** More coordinators, the old trap.
- **Workflow-optimizer.** Process tinkering, the old trap.
- **MetaGPT's runtime.** Building orchestration again.
- **Paid principle APIs (uxuiprinciples).**
- **Brand catalogs (open-design, tasteful-ui).** PDS is its own brand.

---

## 5. The SDLC

| Phase | Entry | Work | Exit gate |
|---|---|---|---|
| **0. Foundation** (once, ≤2 days) | Owner approves this plan | Monorepo scaffold, required CI checks (stubs), `DESIGN.md` v0, lint rules 1–12 (§7), Storybook, docs shell, publish dry-run, branch protection, GitHub App | CI green on empty packages; dry-run publish works |
| **1. Discover / Spec** | Roadmap item | Product Lead interviews (3–5 questions per round, Known/Inferred/Unknown); one batched question card | **G1** spec with P0/P1/P2, non-goals, no open "Anything unclear" |
| **2. Design** | G1 | Design Director: design written against `DESIGN.md`, state list, edge cases (long text, empty, 10k rows; Arabic only if the change touches text or layout direction). Pictures or variants only if the owner asked | **G2** design fits `DESIGN.md`; no waiting |
| **3. Architecture + Plan** | G2 | ADR/API contract; plan with tasks, interfaces and conflict table | **G3 + G4** (agent-approved; plan posted to the owner) |
| **4. Build** | G4 | One engineer per package in its own worktree; tasks serial; review after each; fix loop capped at 5 rounds; ambiguities logged as `Ruling: what — why — cost if wrong` | All tasks done or parked with a ruling |
| **5. Verify** | Branch done | Critic, a11y, QA (and Security when the change needs it) run in parallel; one final whole-branch review; one fix wave | **G5a–e** |
| **6. Localize + Document** (overlaps 4–5) | Stable API | Arabic proposals to the owner per `docs/i18n/arabic.md` (only approved words go into `ar.js`), docs pages, changeset | **G6 + G7** |
| **7. Integrate** | All green | Merge queue, one PR at a time per package; conflicts go back to the owning engineer | `main` green |
| **8. Release** (on demand) | Release batch ready | Readiness report → automatic tag → npm + CDN + API publish → live check (automatic rollback on failure) → summary and "Rulings I made" to the owner → update `docs/lessons.md` | **G8** published and verified live |

**The owner's role:** product stakeholder and reporter. You describe what to build or fix in plain words (§5a). Agents never ask you for permission.

**What runs on its own:** everything: spec, design, plan, build, review, merge, database migrations, release and live deployment. Owner QA is a follow-up, never a block.

**Agents never stop to wait.** Situations that used to stop the work now trigger an automatic safety net, and the work continues:

| Situation | What the agent does instead of stopping |
|---|---|
| Hard-to-reverse action | Anything in the repository: proceed, since git history restores it. Live data: take a backup or snapshot first (database dump, git tag; CDN versions are immutable), then proceed. Only an action that nothing can undo and that the owner has not authorized is parked: report it and continue other work |
| Security issue | Fix it at once, log a `security` issue, include it in the owner's summary |
| External side effect | Proceed if it is part of the pipeline; log it |
| Plan broken beyond a reasonable guess | Re-plan, log a `Ruling: what — why — cost if wrong`, continue |
| `git clean -fdx` | Only inside the agent's own worktree. In a shared folder it would delete other agents' uncommitted work |
| Database migration | Automatic backup, reversible migration, automatic rollback if it fails |
| Merge | Self-merge with `gh pr merge --auto` through the merge queue once required checks pass |
| Live deployment | Health check after deploy; automatic rollback to the previous version if live checks fail |
| Own lane is empty | Post "lane empty" and exit; the dispatcher restarts the lane when work arrives |
| Another role is missing or will not start | Open a `process` issue (P0), take the next Ready item; never wait |

**Source and adoption.** This plan follows the owner's project plan template v2.4 (`docs/pds1/template/project-plan-template-v2.4.md`, D-0084). Where this file and the template differ on process, the template wins; where they differ on a PDS-specific fact (packages, CDN, tokens), this file wins. The master plan (milestones, epics, lanes, evergreen backlog) is `docs/MASTER_PLAN.md`.

### 5.1 Gates: PASS, FAIL or N/A

Every gate is recorded as **PASS, FAIL or N/A with a reason** on the PR (the PR template lists them). A gate with no entry is not passed. N/A is allowed only when the gate does not apply to the change, and the reason says why.

| Gate | Passes when | N/A when |
|---|---|---|
| G1 spec | P0/P1/P2, non-goals, no open question | BUG or XS item (the issue is the brief) |
| G2 design | the design fits `DESIGN.md` | no UI change |
| G3 contract | no new public prop or token tier without an ADR | no API or token-tier change |
| G4 plan | tasks, owners, files and proof commands; no file with two owners | BUG or XS item |
| G5a code review | no open Critical or Important finding | never |
| G5b visual | the Design Critic passes code and screenshots together | no visual change |
| G5c a11y and RTL | axe, keyboard and contrast pass | no UI change |
| G5d behaviour | the §7e tests pass | never |
| G5e security | APPROVE | the change touches none of the security surfaces (§4) |
| G6 locale | no missing or unapproved AR string | no user-visible string changed |
| G7 docs | every public API documented; examples compile | no public API change |
| G8 release | published and verified live | not a release |

### 5.2 Work sizes

Every item carries a size on the board. Size decides how much of the SDLC it needs, so small fixes do not wait on specs.

| Size | Phases | Notes |
|---|---|---|
| BUG | Skip phases 1 to 3 | The issue is the brief; a failing test comes first. Treated as S if it needs an API, security or migration decision |
| XS | Skip phases 1 to 3 | The issue is the brief. Same exception as BUG |
| S, M | All phases | |
| L | Split into M items first | Each M item then runs all phases |

### 5.3 Blocking exceptions

Only three things wait for a person, and the agent takes the next Ready item meanwhile: the intake (§5a); a new translated word, until the owner answers (D-0012); and the rare action that nothing can undo and that the owner has not authorized. "Waiting for the owner" is never a reason to stop routine work.

### 5.4 The dispatcher: agents never sit idle

The pull loop: finish the item, hand it off (move it to the next lane's Ready by label and board field), take the next Ready item in your lane, and if there is none post "lane empty" and exit. The dispatcher (event pickup, the scheduler and the nudge timer on the agent host) wakes the lane when work arrives. If the owner has to remind an agent to work while Ready items exist, the dispatcher failed: that is a P0 `process` bug, root cause within 24 hours, with a check or rule added and an entry in `docs/lessons.md`. The target is zero nudges. Detail: template §6.

## 5a. Owner intake: how you ask for things

**Everything happens on GitHub.** You and every agent communicate only through GitHub in `plenix-ds/pds`; there are no side chats, status files or separate dashboards to keep in sync.

- **You** open an issue from a template (Bug, Feature, UI/UX, Question) or comment on any issue or PR. Plain words are enough; add a screenshot or annotated picture if it helps. To get pictures back, say so (e.g. "show me options" or "send a before/after").
- **Agents** each post under their own bot identity (`pds-product-lead[bot]`, `pds-design-director[bot]`, …) through the GitHub App. They hand work to each other by assigning issues, mentioning roles in comments, and reviewing PRs.
- **Pickup:** GitHub webhooks (routed through the proxy to VM 131) wake the right agent within seconds of a new issue, comment or check result.
- **Your summary:** one pinned "Daily summary" issue, updated each day: decisions made, releases shipped, anything worth a look. Text and links, plus a link to that day's visual check screenshots on the dashboard.
- **Decisions:** every decision is an issue labelled `decision` and is shown on the dashboard (§6a).

**A. Bug** (Owner → Product Lead → specialist)
1. The Product Lead logs a `type:bug` issue: severity, reproduction steps, affected components, your words and screenshot.
2. It identifies the domain and assigns the specialist: Component Engineer (UI code), Backend & Release Architect (API, CDN, build), i18n Engineer (EN/AR), Database Optimizer (data), Design Director (looks wrong).
3. The specialist reproduces the bug as a failing test, fixes it, runs the checks and any migrations, opens a PR and self-merges when green. The fix ships in the next automatic release.
4. The agent replies on your issue with the PR link and the visual check's before/after screenshots for any UI change, and closes it when released.

**B. Feature** (Owner → Product Lead → Architect + Delivery Lead → engineers)
1. The Product Lead logs a `type:feature` issue and writes the spec.
2. The Design-System Architect and Delivery Lead break it into sub-tasks per package (tokens, components, API, docs, i18n) and assign them.
3. Engineers build in parallel on separate packages; reviewers and QA verify; everything self-merges and releases.
4. The spec and the release link are posted on your issue (pictures if you asked).

**C. UI/UX improvement** (Owner → Product Lead → Design Director → Component Engineer)
1. The Product Lead logs a `type:ui` issue with your words and picture.
2. The Design Director audits it against `DESIGN.md` and the design system and decides the fix. Variants or pictures only if you asked for them. The Design Critic reviews the code and screenshots.
3. The Component Engineer implements it, visual regression baselines are updated, and it self-merges and releases.
4. The PR, the visual check's before/after screenshots and the release link are posted on your issue. If you redirect in a comment, that becomes a new `decision` issue.

---

## 6. How agents talk to the owner

**All of this is a comment on the GitHub issue.** Agents don't ask permission. They ask about *intent* only when a request can't be read any other way, and even then they go ahead with the recommended option at once and tell you ("I went with A; say B to switch"). Every choice is reported with this card:

> **D-0123 · Data grid: row height in compact density**
> Context: one sentence of what we understood.
> **A (Recommended)** — 32px — risk: tight for Arabic diacritics
> **B** — 36px — risk: fewer rows visible
> **C** — 28px — risk: below touch minimum
> (Screenshots are attached only when you asked to see options.)
> **Applied: A.** To switch, reply B or C. If switched, we redo: 1 token + snapshots.

**Rules for asking**
- **Pictures.** Screenshots that CI already makes are always shared: changed snapshots on the PR and your issue, all of them on the dashboard. Agents make *extra* pictures (options, variants, mock-ups) only when you ask ("show me", "options").
- **One summary.** Decisions made, releases shipped and anything worth a look go into the pinned "Daily summary" issue. Nothing waits on a reply.
- **Don't ask when** the answer is in the decision log, the codebase or `DESIGN.md`, or the change is cheap to reverse (apply the default and say so).
- **Never ask twice.** Every decision becomes a `decision` issue and an entry in `decisions.yaml` with date, reason, and the **check that enforces it**.
- **"Other" is not an ending.** The Product Lead maps it back to options in the next card.
- **Feedback register.** Each owner comment is tracked as open → accepted → applied (with a link to the changed file). No silent drops, and nothing is redone without a new decision.
- **The owner's answer is final** (D-0035). Agents pick the sensible reading, act on it and say in one line on the thread how they read it; an answer never produces a new question card. All pending answers are handled in one pass, and the dashboard is refreshed once at the end. Threads use plain words, not card jargon; the A/B options stay so the dashboard can show them.

---

## 6a. The dashboard: decisions and visual checks

**Interactive dashboard (D-0034, P1).** The dashboard is built like the CTM 3.0 dashboard: an interactive page with Overview, To decide, To do, Decisions, Done, Checks, Team and Screenshots tabs, where the owner answers decisions in place with his own fine-grained key (Issues read and write on plenix-ds/pds only). It reads GitHub; its acceptance tests are `docs/pds1/slices/195-dashboard/brief.md` (AC-1 to AC-6). The generated read-only page described below follows as P2.

One read-only page with two tabs: **Decisions**, where every decision is logged and presented, and **Visual checks**, where every screenshot CI takes is logged. It is generated, not a hand-built dashboard, so it can't drift from GitHub.

**Source of truth:** `decisions.yaml` in the repo plus the GitHub issues labelled `decision`. A GitHub Action rebuilds the page on every change and publishes it beside the docs (`design-system.lighthouseway.org/decisions/`).

**Each decision shows:**
- ID, date and area (design, tokens, components, i18n, release, process)
- the decision in one line, and why
- the options that were considered (with pictures, if any were made) and which one won
- who decided (owner, or which agent as a ruling)
- status: active, superseded (linked to its replacement) or retired
- **the check that enforces it**, with its live pass/fail result from the latest `main` build, or "review only" with the reason
- links: the decision issue, the PRs that applied it

**On the page:**
- search, filters by area, status and "decided by"
- a list of decisions with no enforcing check, so gaps are visible
- the 13 restart decisions (§9) loaded on day one

**Visual checks tab:**
- one entry per PR: which components changed, pass / changed / failed
- the screenshots side by side: before, after, and the highlighted difference
- filters by component, theme (light/dark), direction (EN/AR) and density, for the screenshots that run
- every changed screenshot also goes as a comment on the PR and on the owner's issue, so nothing has to be looked up
- screenshots are stored as CI artifacts and published with the page; old runs are kept for 90 days

**Limits** (lessons from the old dashboards): no backend and no data store of its own; GitHub is the source. The generated page is read-only and has no login of its own. The interactive dashboard writes only through the owner's own fine-grained key (Issues read and write on plenix-ds/pds). To change a decision, answer it on the dashboard or comment on its GitHub issue. Building it (both tabs) is time-boxed to two days in Phase 0.

## 7. Enforcement: making rules real

**Design contract.** `DESIGN.md` (with front-matter scales), `tokens/*.json` (DTCG) and `design.rules.json` hold the single source. Every lint rule reads from them.

**First 12 checks to build in Phase 0**
1. No hex/rgb/named colours outside `ref` tokens.
2. Radius only from the scale (0, 2, 4, 6, circle).
3. Font size only from type roles, ≥12px.
4. No physical left/right anywhere, utilities included.
5. No `transition: all`; durations from motion tokens; `prefers-reduced-motion` guard.
6. No comp → ref token references (no tier skipping).
7. Token names may not contain values.
8. Full fg×bg contrast matrix in light and dark, every commit.
9. State manifest per component (default, hover, focus, active, disabled, loading, error, selected), checked against stories.
10. Numeric columns: `tabular-nums` and end alignment.
11. Pills in a table row: equal measured height (Playwright bounding boxes).
12. Visual regression, automated in CI; **its screenshots and diffs go to the owner and the dashboard** (see §6a): every story in light and dark at standard density on every PR. RTL/Arabic and compact snapshots run only for components whose text, direction or density code changed. There is no separate full run before a release. A missing browser = FAIL, not skip.

**Locale checks** (i18n Engineer)
- Missing AR key
- Arabic in `ar.js` without a recorded owner approval
- Placeholder mismatch
- Missing Arabic plural forms (zero/one/two/few/many/other)
- Literal JSX strings
- Unused keys

**Agent hooks**
- A SessionStart hook loads the skills, the ledger and `docs/lessons.md`.
- A PreToolUse guard (as CTM's `guard-protected`) blocks agents, even on bypass, from editing a few protected files: the Arabic standard and approved glossary (`docs/i18n/arabic.md`), past entries in `decisions.yaml`, and published release manifests. To change one, they open a GitHub issue.
- A Stop hook blocks "done" when edited UI has no fresh passing check result (from plugin87's measurement-receipt pattern).

**Decision coverage.** CI fails if any `decisions.yaml` entry has no linked check (or an explicit `review-only` reason).

**Borrowed from CTM** (already working in CTM's repo, 2026-11-04):
- **Only new problems block.** Every check compares against the PR's base: problems the PR adds fail it; old debt is reported but doesn't block. This is how CI gets green from day one instead of the old 0-of-1,509.
- **Ownership check.** The files a PR changes must belong to the package or role that made it (`check_ownership`); only the DS Architect touches token tiers and public API files.
- **Traceability check.** Every acceptance ID in a spec must appear in its tests and, before merge, in the evidence report (`check_slice_trace`).
- **Test first, with proof.** Engineers follow a TDD skill (from superpowers, as CTM's `ctm-tdd`): the report shows the failing test (RED) and then the pass (GREEN).
- **Evidence labels.** Every report marks each check **Ran / Skipped / Planned / Manual** with a path. A report is a claim until the git log and the checks confirm it.
- **Workflows use `bash` with `pipefail`.** Without it, `check | tee log` reports success when the check fails (CTM learned this from a real run).

### 7e. Behaviour tests: what each component must be tested for

Owned by the QA / Evidence Engineer; the Component Engineer writes the tests with the component, in the same PR. **A component with no behaviour test can't merge.** Tests use the component's stories as fixtures, so every story is also a test case.

**Which tool:**
- **Vitest + Testing Library** (fast, every PR): logic, props, events, ARIA attributes, formatting, i18n keys.
- **Playwright** (real browser, every PR for changed components): keyboard, focus, scrolling, pointer, measured layout, RTL.
- **axe** runs inside both, on every state.

**Baseline: every one of the 141 components**
1. Renders each story without errors or console warnings.
2. Every state in its state manifest (§7 check 9) can be reached and has the right ARIA (`aria-disabled`, `aria-invalid`, `aria-busy`, `aria-selected`, `aria-expanded`).
3. Disabled means no events fire and it can't be focused (or is `aria-disabled` and announced as such, per its spec).
4. Keyboard: everything clickable can be reached with Tab and used with Enter/Space; focus is visible.
5. Under `dir="rtl"`: arrow keys and layout mirror correctly; icons that show direction flip, others don't.
6. Long text (3× the English length) and empty values don't break or overflow the layout.
7. No axe violations in any state.
8. All visible text comes from the catalog; switching locale to `ar` changes it.

**By family** (on top of the baseline)

| Family | Components | Must test |
|---|---|---|
| **Buttons & actions** | Button, AIButton, SplitButton, CopyButton, DownloadButton, RowButton, FloatingActionButton, SuggestedAction | Click fires once (no double submit while loading); loading state blocks clicks and is announced; SplitButton menu opens by keyboard; CopyButton confirms with a message |
| **Text inputs** | Input, NumberInput, SearchField, OtpInput, MentionInput, PromptInput, InlineEdit, InputGroup, RelativeDateInput | Typing, paste, clear; controlled and uncontrolled; max length; NumberInput min/max/step, arrow keys, Arabic-Indic digits accepted; OtpInput paste fills all boxes; InlineEdit Esc cancels, Enter saves |
| **Choice inputs** | Checkbox, RadioTiles, SegmentedControl, Slider, Rating, Checklist | Click and keyboard select; indeterminate checkbox; radio arrow-key movement; Slider keys (arrows, PageUp/Down, Home/End) and RTL direction |
| **Pickers** | Combobox, Cascader, CountrySelect, TimeZoneSelect, EntityPicker, TreeSelect, TransferList, DatePicker, TimePicker, Calendar | Open/close (click, Enter, Esc, outside click); type-ahead filtering; arrow movement; selection updates value; multi-select add/remove; "no results" message; DatePicker min/max, disabled dates, typed dates in EN and AR, week start per locale; TimePicker 12/24h |
| **Forms** | Field, Fieldset, ErrorSummary, FileInput, DropZone | Label linked to input; error message linked by `aria-describedby`; ErrorSummary lists every error and focuses the field on click; file type/size limits give a message from §7d; drag-and-drop and keyboard upload both work |
| **Overlays** | Dialog, Sheet, Popover, Tooltip, Menu, MegaMenu, CommandMenu, TeachingBubble, Spotlight, Scrim, LoadingOverlay | Focus moves in on open and back on close; focus trapped in modal ones; Esc closes; scroll locked behind modals; Tooltip on hover and focus, not on touch-only; Menu arrow keys, type-ahead, submenus; destructive Dialog button uses the question's verb (§7d) |
| **Navigation** | Tabs, Breadcrumbs, NavList, Pagination, Tree, MillerColumns, ProgressSteps, BackToTop, LoadMore | Tabs arrow keys and `aria-selected`; current page marked (`aria-current`); Pagination first/last/out of range; Tree expand/collapse by keyboard, type-ahead; MillerColumns arrow keys move across columns (mirrored in RTL) |
| **Feedback** | Toast, Banner, Notice, Announcement, EmptyState, Loading, ProgressBar, ProgressCircle, StatusDot | Toast announced by screen reader (`role=status` or `alert` by severity), pauses on hover/focus, undo works; dismiss works and is remembered where specified; progress values announced; EmptyState action works |
| **Data display** | Table, DataTableNext, DataPill, Metric, MetricCard, Count, DateBadge, Time, Timeline, VirtualList, List | Number, date and relative-time formatting in en-US and ar-EG; tabular figures; pills in a row equal height (§7 check 11); VirtualList renders only visible rows and keeps focus while scrolling |
| **Editors & rich content** | RichTextEditor, RichText, CodeEditor, CodeBlock, Chat, StreamingText, Comment, SuggestedEdit, DocumentViewer, MediaPlayer | Typing, undo/redo, formatting shortcuts; paste strips unsafe HTML; mixed Arabic/English text keeps the right direction; StreamingText announces without flooding the screen reader; MediaPlayer keyboard controls and captions |
| **Layout & display only** | Stack, Columns, Divider, Card, Heading, Text, Icon, Image, Avatar, Badge, Tag, Kbd, VisuallyHidden, … | Baseline only, plus: Image alt text required; Avatar fallback initials (including Arabic names); Tag removable by keyboard |

**DataGrid** (the component reversed 5 times in the old project, so it gets its own list)
- **Sorting:** click and keyboard; asc → desc → none; multi-column with Shift; stable sort; numbers, dates and Arabic text sort correctly.
- **Filtering:** per column and global; clear all; "no results" message; filter + sort together.
- **Selection:** row, range (Shift), all-on-page vs all-rows; selection survives sort and filter.
- **Keyboard:** arrow keys move cell by cell; Home/End, Ctrl+Home/End, PageUp/Down; Enter edits, Esc cancels; Tab leaves the grid; arrows mirrored in RTL.
- **Columns:** resize (pointer and keyboard), reorder, hide/show, pin start/end (start = right in RTL); sticky header while scrolling.
- **Scale:** 10,000 rows scroll smoothly (no more than a set frame-time budget) and only visible rows are in the DOM.
- **Editing:** inline edit, validation message, save/cancel, no data lost on sort.
- **Density:** row heights match compact/standard/comfortable tokens.
- **Screen reader:** `role=grid`, row/column counts and indexes, sort state announced.

**Rules for the tests themselves**
- A bug fix comes with a test that fails before the fix.
- Tests check behaviour users see, not internal details, so refactors don't break them.
- A test that fails at random is quarantined with an owner within 24h, never deleted (§2 row 4).
- Coverage is reported in the CI summary per component (baseline ✓, family ✓, specific ✓), not as a single percentage.

### Coding-standards tools

The rule of thumb: adopt tools that **enforce** (they fail CI) or **surface** findings where agents read them. Skip tools that only add another AI opinion, because the team already has a Code Reviewer subagent (and Codex on standby as a second opinion).

All eight tools were checked against their repos on 2026-11-03.

| Tool | Facts | Verdict for PDS |
|---|---|---|
| **Semgrep → use Opengrep** | Semgrep CE is LGPL, but its maintained rules are under a restrictive license and some analysis moved to paid. Opengrep (3.3k★, v1.33.1) is the community fork, same rule format | **Adopt Opengrep, Phase 0, required check.** Own PDS rules only, each with test fixtures: physical left/right in style props, hex in TSX, banned imports, `dangerouslySetInnerHTML`. Most single-file rules go to ESLint/Stylelint first |
| **SonarQube Community** | No PR/branch analysis without an unofficial plugin; needs 2–4 GB RAM + Postgres | **Skip.** Overlaps tsc/ESLint/Knip/Opengrep; the VM is already tight. SonarQube Cloud (free for public repos) could be a non-blocking trial later |
| **Saguaro** (mesa-dot-dev) | 26★. **npm release 0.4.22 was malware** (Mini Shai-Hulud worm, OSV MAL-2026-3599) | **Do not adopt.** Supply-chain risk with agents on bypass permissions; it also duplicates our Stop hook with an LLM gate |
| **OpenQodex** | 1.1k★ but created 2026-10-02, v0.16, pre-1.0, auto-updates by default. Separate finder/verifier sessions on a frozen copy, evidence check per finding | **Trial after 1.0** as a local pre-push step, pinned, not a required check. Good design; worth a look since Codex is only on standby |
| **Coding Ethos** | **Archived 2026-10-07**, AGPL, 6★ | **Do not adopt.** Rulesync + lefthook + our hooks cover the idea |
| **PR-Agent** | Now community-maintained (The-PR-Agent), MIT, 14.2k★, active, supports Claude | **Skip.** A third AI reviewer brings back the comment noise |
| **Rulesync** | MIT, 1.6k★, very active (v43); one `.rulesync/` source → CLAUDE.md, AGENTS.md, skills, subagents, hooks, MCP for ~70 tools | **Adopt, Phase 0.** CI regenerates and runs `git diff --exit-code`, so Claude and Codex instructions can never drift again. Pin the version |
| **reviewdog** | MIT, 9.7k★; reads SARIF; `filter_mode: added`. Its setup action was compromised in March 2025 | **Adopt, Phase 0, presentation only.** Shows lint findings on changed lines; pass/fail stays with each tool. **Pin every Action to a commit SHA** |

**Also adopt (not on the list):**
- **zizmor** checks GitHub workflows for unpinned actions and injection.
- **lefthook** runs the same fast checks locally before commit and push.
- **Changesets** drives package versions.
- **ast-grep** is the fallback for complex TSX rules.

**Final CI stack:**
- **Required checks:** tsc, ESLint (incl. `jsx-no-literals`, `no-restricted-imports`), Stylelint, Opengrep, Knip, zizmor, the Rulesync drift check, ownership and traceability checks, design and locale checks, Vitest + Playwright behaviour tests (§7e), Playwright visual regression.
- **Presentation:** reviewdog.
- **AI review:** the Claude Code Reviewer (Codex on standby), advisory.

## 7d. Messaging standard: how PDS talks to people

How the interface communicates in words: errors, warnings, confirmations, success, empty states, loading and help text. The **Technical Writer & Messaging Designer** owns it.

**Already on `main`:** `check-copy.js` and `platform/standards/content/rules.json`, covering American English, sentence case, 77 approved action verbs, inclusive language and a small glossary, with a shrink-only baseline.

**Missing, and added in PDS 1.0:** a written standard in `docs/content/messaging.md`, with one pattern per message type, in English and Arabic:

| Message type | Pattern | Example |
|---|---|---|
| Error | What happened + why (if known) + how to fix it. Never blame the user; no codes alone | "Couldn't save the case. The connection dropped. Try again." |
| Field validation | Say what's needed, beside the field, as soon as it's relevant | "Enter a date after the filing date." |
| Warning / confirm destructive | Name the object and the consequence; the button repeats the verb | "Delete case 10234? Its 7 documents are deleted too." → **Delete case** |
| Success | Short, past tense, with an undo when possible | "Case archived. Undo" |
| Empty state | What goes here + one action to fill it | "No hearings yet. Schedule a hearing" |
| Loading | Only when it takes over ~1 second; say what is loading | "Loading hearings…" |
| Help / tooltip | One sentence; never repeat the label | |

**Rules the checks enforce:**
- every component that can fail ships an error message with a fix
- no raw error codes or stack text shown to users
- the button in a confirmation dialog uses the same verb as the question
- every message key has both EN and AR entries
- Arabic messages follow `docs/i18n/arabic.md`

**Sources:** jakub `better-writing`, ui-craft `clarify`, plugin87 `ux-writing`, and the existing Plenix content rules.

## 7b. Build tooling already done in the old repo (inherit, don't redo)

The newer work exists only on GitHub `main` (released as 0.86.0). Every local clone predates it.

| Item | State on `main` | PDS 1.0 action |
|---|---|---|
| **Vite** (#709) | **Done.** 3 Vite configs; builds platform, apps, npm and CDN files since 0.79.0 | Inherit the configs |
| **TypeScript** (#708) | **~41% done.** Strict `tsconfig`; utils, hooks and providers fully converted; 98 of 146 component folders converted. Still JS: DataGrid (41 files), Table, Tabs, Tree, DatePicker, Calendar, 95 patterns, all charts, templates. `.d.ts` is still generated by the custom `build-types.js` | Inherit the converted files; finish the rest during each component's rebuild; generate `.d.ts` with tsc and retire `build-types.js` |
| **Style Dictionary** (#372) | **~4–5 of 10 steps.** Runs beside `build-tokens.js` only as a comparison; only the token index uses it. PR #928 (W3C format, step 9 part 1) is open. CDN CSS still comes from the old script | Finish in Phase 0 together with the token rename (§3); keep `build-mobile.js` for native tokens (owner decision #872) |
| **Storybook** | Approved, **not started** | Phase 0 (the state-matrix and visual checks depend on it) |
| **Playwright Test / Vitest** | Proposed in #866, waiting on owner; tests still run on a custom Puppeteer runner | Phase 0: adopt both |
| **Generated files out of git** (#692) | Mostly done | Finish |
| **Changesets, workspaces / monorepo** | Never planned | Phase 0 |

**Translations (correction):** an earlier draft said Arabic never shipped. That was wrong; it came from local copies dated Oct 26. On `main` there is:
- a full Arabic catalog, `platform/i18n/ar.js` (2,811 lines, plus `ar.global.js` and `ar.optin.js`)
- the language standard `docs/i18n/arabic.md`
- the test `tests/arabic-catalog-427.test.js`
- Arabic fonts (IBM Plex Sans Arabic, Readex Pro)
- a translation PRD at `capabilities/translation/`

Arabic is opt-in: the CDN bundle references it through `addLanguage`, and npm has an `ar` entry. It is not a separate file at `cdn/<version>/i18n/`. PDS 1.0 inherits all of this.

## 7c. How the current CDN is built and published

| Step | What happens | Where |
|---|---|---|
| Build | `node build-app.js` (Vite inside) + `build-usage.js` + `check-system.js` + `check-style.js` + `build-packages.js`. Output goes to `release/cdn/<version>/` and `release/api/` | `package.json` `release:build` |
| npm packages | A pushed tag `vX.Y.Z` triggers the GitHub Actions **Release** workflow. It checks the tag matches `package.json`, builds, publishes the four `@plenix-ds/*` packages to GitHub Packages, creates the GitHub release, and checks the live CDN | `.github/workflows/release.yml` |
| CDN + API | **Not done by CI.** `deploy.sh` is run by hand from a machine with SSH to the web host (VM 130). It builds, tars the site, `scp`s it over, and on the host (with `sudo`): extracts to `/srv/plenix/www.new`, **refuses to overwrite a published version whose files differ** (immutability), rewrites every app page to load Plenix through the CDN loader with a fallback version, swaps `/srv/plenix/api`, moves the build to `/srv/plenix/cdn/<version>`, and publishes the Material icon library once per icon commit at `/cdn/material/<commit>/` | `deploy.sh`, `tools/publish-config.sh` |
| Pointers | `cdn/index.json` lists every version (now 239); `cdn/latest.json` says `latest: 0.86.0` with empty `pins` | live CDN |

**Live state (2026-11-04):**
- The latest is **0.86.0**, released 2026-11-03 09:42 UTC, after this plan's first draft.
- `plenix.js` is 2.5 MB, `plenix.esm.js` 2.7 MB, `plenix.css` 2.0 MB, `tokens/tokens.json` 3.9 MB.
- **`SHA256SUMS` and `version.json` are missing (404) at the version root**, even though the CDN docs say every pinned version has a `SHA256SUMS`.

**What PDS 1.0 changes:**
- Keep the immutability check and the loader-with-fallback idea.
- Move the CDN/API publish out of a hand-run script into the same tagged CI release as npm, so one tag publishes npm, CDN and API together. The host-side steps stay identical, but run by a deploy job with a scoped deploy key that no agent holds.
- Generate `SHA256SUMS` and `version.json` for every version.
- Add bundle-size budgets. 2.5 MB of JS and 2 MB of CSS is far over a sensible design-system budget; per-component ESM imports would fix most of it.

The build is still 17 custom `build-*.js` scripts with Vite called from inside them. The owner's rule from #712 ("no custom tooling unless absolutely necessary") carries forward.

---

**CTM depends on this CDN.** CTM checks `cdn/latest.json` every 30 minutes, upgrades itself, tests against the live CDN and merges if green. So PDS 1.0 must:
- keep `latest.json` in its current shape, including `pins` (`"pins": {"ctm": "<version>"}` holds CTM on a version);
- talk to CTM **both ways through the PDS GitHub App** (owner decision, 2026-11-05). No personal tokens in either direction:
  - **PDS → CTM:** after each release, the release agent sends CTM a `plenix-release` signal (`repository_dispatch`) so CTM upgrades within minutes, not 30. PDS agents can also comment on CTM's upgrade issues.
  - **CTM → PDS:** when CTM's upgrade breaks, CTM's workflow uses the same app to open (or comment on) "CTM: Plenix <version> breaks CTM" in `plenix-ds/pds`, with the logs and screenshots. The Product Lead treats it like an owner bug.
  - **App permissions:** Issues read/write on `plenix-ds/pds` and `LighthouseCollection/CTM` only. Note: GitHub requires **Contents: write** on CTM to send the `plenix-release` signal, which would also let the app push code to CTM. Owner to choose: grant it, or skip the instant signal and rely on CTM's own schedule (owner decision pending).
  - **Owner setup, once, after Phase 0 creates the app:** install the app on the CTM repo (one click), and add its Client ID and private key to CTM as repository secrets (CTM currently reads `PDS_APP_ID` + `PDS_APP_PRIVATE_KEY`; `app-id` is deprecated in favour of `client-id`). The key doesn't expire and isn't tied to anyone's personal account.

## 8. Environment: same everything, set up properly

| Item | Keep | Change |
|---|---|---|
| GitHub org | `plenix-ds` | GitHub App with one bot identity per role; fine-grained permissions; also installed on `LighthouseCollection/CTM` for two-way CTM ↔ PDS reporting (§7c); branch protection + required checks + merge queue on `main` |
| Repo | `plenix-platform` stays as-is for 0.x consumers | **New monorepo `plenix-ds/pds`** (decision 1). Fold the private `plenix-design-system` submodule in |
| Server | VM 131 (Ubuntu, 8 cores, 15 GB), agent account | Turn on Linger; agents as systemd user services instead of cron/tmux scripts; ≤4 long-running agents plus any number of short-task agents (≈15 min cap; both adjustable in `agents.config.yaml`), each with a memory limit, new ones held back when memory is low; webhooks via proxy instead of 1–2 min polling |
| CDN | `design-system.lighthouseway.org/cdn/<version>/`, `index.json`, `SHA256SUMS`, all old versions immutable | 1.0.0+ published by CI on tag only; publish fails if version exists |
| API | `/api/v1/` read-only | OpenAPI spec + contract tests + breaking-change diff |
| Packages | `@plenix-ds/tokens`, `icons`, `styles`, `react` on GitHub Packages | Changesets drive versions; one version across npm/CDN/API; optional `@plenix-ds/locales` |
| Permissions | — | Agents run with **bypass permissions and full autonomy** on VM 131: push, self-merge, migrations, live deploys. Credentials sit in the CI and deploy jobs that agents trigger. The safety nets in §5 (backups, rollback, own-worktree cleanup, required checks) replace human approval |
| Old team | — | **Cutover:** owner stopped the old team on 2026-11-04. Before Phase 0, confirm the cron lines (`team.sh` at reboot, `test-runner.sh` every minute) are removed too, or a reboot restarts the old team |

---

## 9. Owner decisions (recorded 2026-11-04)

| # | Decision | Owner's answer |
|---|---|---|
| 1 | Repo | **New `plenix-ds/pds` monorepo** |
| 2 | Codex | **On standby**, called in only when needed (not a standing team member) |
| 3 | Release cadence | **On demand**, triggered by agents once all checks pass; no owner yes |
| 4 | Design language | **Keep the existing PDS design language.** It is already part of the design system and stays as defined; Phase 0 writes it down in `DESIGN.md` as-is so agents follow it instead of improvising |
| 5 | Corners | **2 / 4 / 6px, pills at 4px** (replaces the old written "pills at 6") |
| 6 | Type | **Keep as defined:** DM Sans + Reddit Mono for numbers |
| 7 | Density | **Three modes:** compact, standard, comfortable (drop "standard-comfortable") |
| 8 | Accent | **Keep current blue use as the default theme**; theming is a future build |
| 9 | Dark mode | **Keep as defined**; contrast failures fixed as bugs, no redesign |
| 10 | Table pills | **Keep as defined**; wrapping and uneven heights fixed as bugs |
| 11 | Icons | **Keep Material Symbols Sharp** (current set) |
| 12 | Arabic review | **Keep the existing workflow** (`docs/i18n/arabic.md`, #427): Modern Standard Arabic, Microsoft terminology, one English word = one Arabic word, `ar-EG` CLDR formats with Arabic-Indic digits, IDs/emails/URLs stay Latin. Every new Arabic word goes to the owner as a proposal file; only the owner's answer goes into `ar.js`. The i18n Engineer prepares proposals and enforces it in CI; it never writes Arabic on its own |
| 13 | Mobile scope | **Deferred.** No new mobile work in 1.0. What exists is carried over unchanged and not extended: responsive and touch behaviour, DataGrid row cards, the native token files from `build-mobile.js`, the 114 native specs and the web-to-native map. The Mobile App Builder role stays parked. Issues #53, #54, #221 and #265 move to the backlog as `later` |

**What "keep as defined" means for the team:** the current definitions are the baseline. Agents may fix defects inside them (contrast below AA, wrapping, uneven heights, sizes below 12px) without asking. They may not change the look itself without a new owner decision.


## 10. Sources

**Old project**
- `Documents/Plenix` (STATUS, HANDOFF, AGENTS, CHANGELOG)
- `Documents/Codex/2026-10-28/aiteam/work/private/handover/codex-handover/` (charter, DECISIONS.md, process-review, INFRA-HANDOVER)
- GitHub `plenix-ds/plenix-platform`: 2,360 commits, 507 PRs, 437 issues, 3,000 Actions runs (read-only)
- The live CDN `index.json`

**Reference sources reviewed (files, not just READMEs)**
- Agent frameworks and roles:
  - obra/superpowers
  - msitarzewski/agency-agents, including database-optimizer, backend-architect, i18n-engineer, mobile-app-builder and technical-writer
  - FoundationAgents/MetaGPT
  - OpenBMB/ChatDev (`chatdev1.0` branch)
- Design and UX skills:
  - skovalik/perception-first-design
  - impeccable.style (pbakaus/impeccable)
  - plugin87/ux-ui-agent-skills
  - neuhai/uxagent
  - jakubkrehel/skills
  - jakubkrehel/make-interfaces-feel-better
  - educlopez/ui-craft
  - sergekostenchuk/ui-ux-agent-skill-system
  - DonkeyKing01/tasteful-ui-skill
  - sugarforever/open-design-skill
  - uxuiprinciples/agent-skills
  - JacobLinCool/ux-discovery-interviewer-skill
