# {{PROJECT_NAME}} 1.0 — Project Plan (template for New or Existing projects)

**Written by Fr. Raphael Maher** · Template version 2.4 · November 6, 2026

Date: {{DATE}} · Status: decisions recorded, ready for owner review · Nothing has been changed on GitHub, the server or the host yet.

> **How to use this template.** It serves two starting points: a **New project** (nothing exists yet) and an **Existing project** (code, and maybe a design system, already exist; this plan restarts the process around it). Both answer the same §0 questions. The mode only changes the Phase 0 work (§0, "What the mode changes"). Placeholders in `{{DOUBLE_BRACES}}` are filled from the intake in §0. Nothing else in this document is project-specific. Agents ask the §0 questions first and do not start Phase 0 until they are answered.

| Placeholder | Filled from |
|---|---|
| `{{MODE}}` (New / Existing) | §0 Q0 |
| `{{PROJECT_NAME}}` | §0 Q1 |
| `{{PREFIX}}` (lowercase where used in identifiers) | §0 Q2 |
| `{{DESIGN_SYSTEM}}` | §0 Q3 (locked) |
| `{{GITHUB_REPO}}` (`org/repo`) | §0 Q4 |
| `{{GITHUB_ORG}}` (**optional**) | §0 Q4: the `org` part of `org/repo`. Used only where the organisation alone is needed (App installation, organisation-level runners and secrets). Leave unused for a personal account |
| `{{HOSTING}}` | §0 Q5 (may be "decide later") |
| `{{PROFILE}}` (Library / Application) | §0 Q6 |
| `{{DATE}}` | the day the intake is answered |

---

## 0. Project intake: agents ask this first

The Product Lead posts **one batched question card** (a GitHub issue titled "Project intake", or in the session if the repo does not exist yet). Nothing else starts until Q0 (and Q0b for Existing) and Q1–Q4 and Q6 are answered. Q5 may be deferred. **Answering the intake is the owner's authorization to start Phase 0**; there is no separate plan-approval step (decision D-001 records it).

### Q0. New project or Existing project?
Pick one. Both modes then answer the same six questions below. Becomes `{{MODE}}`.

### Q0b. Existing only: which project is being imported?
The Product Lead asks which existing project this plan takes over, and lists what it can see: the repositories on the owner's GitHub account and, when the owner's computer is linked to the session, the projects found in Claude Code and Codex on that computer. If it cannot see the project, the owner names it.

> **Which project do we import?** *(pick from the list, or name it)*
> **Is the old team or remote environment still running?** If yes, please stop it and archive the old remote project. The new environment then works from the **same GitHub repository**, with a fresh setup (branch protection, registry, board, runner or poller).

- Archiving or stopping the old project is the **owner's action**. An agent does not shut down its predecessor.
- Until the owner confirms it is stopped, the new team may read and plan but **does not write** to the repository (§11.1).
- The old project's history stays in the repository; nothing is deleted. Its final state is tagged first (§11).
- The answer is recorded in D-003 (repository, import source, cutover status).

### Q1. Project name
Free text. Becomes `{{PROJECT_NAME}}`.

### Q2. Project prefix (acronym)
Free text, 2–6 lowercase letters. Becomes `{{PREFIX}}`. It is used for: the GitHub App and runner names, role labels (`agent:{{prefix}}-product-lead`), package scope (`@{{prefix}}/…`), token and CSS variable prefix, labels and branch prefixes.

### Q3. Design system — **locked once answered; it cannot be changed later**
> **Is there an existing design system for this project?**
> **A. Yes** → give its name, a **link** (docs or repo), the source of its tokens and the version. Phase 0 writes it into `DESIGN.md` as-is so agents follow it instead of improvising.
> **B. No** → choose one of the six below. An Existing project may have no design system; the same list applies.
> **C. My own** → name it and give a **link** to its guidelines or repo. Any system can be entered this way, including ones not listed.
>
> The choice is recorded as an ADR and enforced by a check (§9): CI fails if `DESIGN.md` or the tokens name a different system, and the value cannot be edited after the first release.
>
> *Existing project with no design system:* picking B or C means the current UI will not match it. The Phase 0 audit (§3) measures the gap, and the migration is planned as a spec. It is not assumed to be a re-skin, because systems differ in structure, density and interaction patterns, not only in colour.

| Option | React support | Pros | Cons |
|---|---|---|---|
| **Fluent 2** (Microsoft) | Official (Fluent UI React v9) | Built for productivity and enterprise apps; good density for data-heavy screens; strong accessibility; rich token model | Recognisably Microsoft; smaller community and fewer third-party themes than Material |
| **Material Design 3** (Google) | Via MUI (third-party); Google's own web components are not React | Largest ecosystem and documentation; strong mobile story; dynamic colour; well-understood by users | Roomy by default, so data-dense desktop UIs need extra work; strongly Google-looking; MUI does not always track the latest M3 spec |
| **Carbon** (IBM) | Official (Carbon React) | Designed for data-heavy enterprise products (tables, charts, dashboards); strong accessibility; clear, well-documented tokens; open source | Opinionated IBM look; steeper learning curve; less flexible to re-theme |
| **Adobe Spectrum** | Official (React Spectrum) | Excellent accessibility and internationalization, including RTL; Spectrum 2 is a recent visual refresh; strong behaviour primitives | Smaller community; look is closely tied to Adobe products |
| **Atlassian Design System** | React only | Good for collaboration and workflow tools; clear tokens and content guidelines; strong accessibility | Tied to Atlassian-style product patterns; fewer components outside that domain |
| **GitHub Primer** | Official (Primer React) | Clean, modern developer-tool look; good accessibility; mature and actively maintained; well-documented tokens | Tuned for developer products; smaller component set than the larger systems |
| **My own** | Any | Enter any system, including ones not listed here, with a link to its guidelines or repo | The Product Lead must read the linked docs and write them into `DESIGN.md` before Phase 0 ends |

*The pros and cons above are a short orientation, not an evaluation; the Product Lead checks each against its current docs before the owner locks the choice.*

### Q4. GitHub repository
`org/repo`, and whether it already exists or must be created. Becomes `{{GITHUB_REPO}}`. The `org` part is `{{GITHUB_ORG}}`; it is optional and is only filled where a step needs the organisation by itself.

### Q5. Where is it hosted? *(can be defined later)*
Documentation site, package registry, and CDN or asset host. "Decide later" is a valid answer. Until it is defined, releases run as a dry-run only; **G8 (release) cannot pass without it** (§7, §10).

### Q6. Project type
> **A. Library or design system** — the project publishes tokens, components, packages and hosted files that others consume.
> **B. Application** — the project is an app that consumes a design system (its own or someone else's) and deploys to staging and production.

Becomes `{{PROFILE}}`. It decides the role set (§5.8), the release pipeline (§10) and which checks apply (§9).

### What the mode changes

| Area | New project | Existing project |
|---|---|---|
| Phase 0 start | Scaffold the monorepo, `DESIGN.md` v0 and CI from scratch | Inventory what exists first: repo, build, CI, tokens, components, tests, published versions. Keep what works (§2, "Keep") and record the rest as findings |
| Design audit (§3) | Skipped | Run once; findings become bugs, not a redesign |
| Failure-mode table (§2) | Read as guard rails | Read as a checklist of what to look for in the current process |
| Import source (Q0b) | Not applicable | The project being taken over, and whether its old team is stopped and archived |
| Old team cutover (§11) | Not applicable | Stop the previous team, remove its boot scripts and cron lines, and tag its final state **before the new team writes anything** (§11.1) |
| Published versions | None yet | Stay live and unchanged. Keep the existing version history and choose the next valid version; use 1.0.0 only for a genuinely new package or namespace |
| Design system | Chosen in Q3 | Existing, or chosen in Q3 if none |

### Intake result
Recorded as decisions **D-001** (mode, project type, name and prefix), **D-002** (design system, locked), **D-003** (repository, and for Existing projects the import source and cutover status) and **D-004** (hosting, or "open") in `decisions.yaml`, each with the check that enforces it.


---

## Multi-agent SDLC: index

Everything about how the agents build software is in these places. Start here.

| Part | Where | What it covers |
|---|---|---|
| Principles | §1 | The six rules the rest of the document follows |
| Master plan | §4 | The skeleton every project starts with, the Ready queue and the evergreen backlog that keep agents supplied with work |
| Agents and capacity | §5 | One role registry, lane agents, task agents, how slots are counted, role sets by project type, role discovery from outside sources, project skills |
| Dispatcher | §6 | The mechanism that wakes agents, fills slots and removes idle time |
| Phases 0–8 | §7 | Entry, work and exit gate for each phase; work sizes; the safety nets that replace human approval |
| Owner interaction | §8 | How requests reach the agents, how agents report back, the dashboard |
| Enforcement | §9 | The checks that turn rules into CI failures, and the behaviour tests |
| Release | §10 | One tag publishes everything; live check and rollback |
| Environment | §11 | Agent host, optional runner, GitHub App, memory limits, permissions |
| Decisions | §12 | The decision register |
| Seed lessons | Appendix A | Starter `docs/lessons.md` from earlier projects |

**Gates at a glance**

| Gate | Phase | Owner | Passes when |
|---|---|---|---|
| G0 | 0 Foundation | Delivery Lead | CI green on empty packages; dry-run publish works; launch test passes (every active, non-parked role in the registry starts); master plan skeleton in place; event delivery mode decided (D-019) |
| G1 | 1 Spec | Product Lead | Spec written (P0/P1/P2, non-goals) |
| G2 | 2 Design | Design Director | Design fits `DESIGN.md` |
| G3 | 3 Architecture | Design-System Architect | No new public prop or token tier without an ADR |
| G4 | 3 Plan | Delivery Lead | Plan approved by the Delivery Lead |
| G5a | 5 Verify | Code Reviewer | No unresolved Critical/Important findings (AI review findings are advisory until classified) |
| G5b | 5 Verify | Design Critic | Visual review: reject / rework / ship |
| G5c | 5 Verify | Accessibility & RTL Auditor | Accessibility checks pass |
| G5d | 5 Verify | QA / Evidence Engineer | Behaviour tests pass |
| G5e | 5 Verify | Security Reviewer | No open security findings on permissions, privacy, data isolation, payments or secrets |
| G6 | 6 Localize | i18n Engineer | No missing or unapproved strings |
| G7 | 6 Document | Technical Writer & Messaging Designer | Every public API documented, examples compile |
| G8 | 8 Release | Backend & Release Architect | Published and verified live |

**Conditional gates.** Every gate that applies to the change must pass. G5b and G5c apply to UI changes, G5e to sensitive areas, G6 to changed text, G7 to changed public API. A gate that does not apply is recorded on the PR as **N/A with a reason**; each gate is recorded PASS, FAIL or N/A, and none is skipped silently.

**Flow diagram**

```mermaid
flowchart LR
  MP([Master plan]) --> BL[Backlog<br/>epics from the plan]
  BL --> P1[1 Spec<br/>Product Lead]
  P1 -->|G1| P2[2 Design<br/>Design Director]
  P2 -->|G2| P3[3 Architecture + Plan<br/>Architect, Delivery Lead]
  P3 -->|G3, G4: tasks to Ready| RQ[Ready queue<br/>build lane]
  RQ --> P4[4 Build<br/>Component Engineers]
  P4 --> P5[5 Verify<br/>applicable gates only]
  P5 -->|G5a-e| P7[7 Integrate<br/>merge queue]
  P4 -.-> P6[6 Localize + Document<br/>i18n, Technical Writer]
  P6 -->|G6, G7| P7
  P7 --> P8[8 Release<br/>Backend and Release Architect]
  P8 -->|G8| R([Owner: daily summary])
  P8 -. plan review .-> MP
  P5 -. fix wave, max 5 rounds .-> P4
  GH[Dispatcher<br/>poller, optional Actions runner] -. wakes the lane that has a Ready item .-> BL
  GH -. wakes build lane .-> RQ
```

---

## 1. Principles

A project that goes well replaces process-by-prose with process-by-checks, and replaces "wait to be told" with "pull from the plan". Without that, effort tends to split like this:

| Where the effort goes | Typical share (restarts) |
|---|---|
| New product | ~40% |
| Rework (same thing redone) | ~25% |
| Process, tooling, coordination, bookkeeping | ~35% |

{{PROJECT_NAME}} 1.0 follows six principles:

1. **Decide before building.** Each component gets a written spec before code; pictures only when the owner asks for them. Engines are locked up front, and the design language of `{{DESIGN_SYSTEM}}` is written into `DESIGN.md` so agents follow it.
2. **Rules are checks, not prose.** An owner decision is not "done" until a lint rule or test enforces it. CI fails if a decision has no check. The same holds for the process itself: every role in this document must exist in the role registry, and CI checks that it does (§5.1).
3. **Full autonomy; CI is the gate.** Agents merge their own PRs, run migrations and deploy live once required checks pass. For anything in the repository, git history is the recovery path, so no extra approval is needed. The owner is the product stakeholder and reporter, not an approver. Only an action that git cannot undo (live data with no backup, a message sent to people, a publish) and that is outside what the owner authorized is parked, reported, and the agent continues with other work (§7).
4. **Work is pulled from a master plan; nobody waits to be told.** A master plan and a Ready queue exist from Phase 0. While useful work exists, every agent finishes an item, takes the next Ready item in its lane, and stops only when its lane has none (§4, §6). The target is useful throughput, not constant activity: when no recorded need remains, agents exit cleanly and the next issue wakes them. If the owner has to remind an agent to work while Ready items exist, that is a process bug (§6.4).
5. **Capacity is counted by running work, not by open sessions.** An idle session holds no slot. Slots are reserved for verification so that gates cannot be starved by builders (§5.2).
6. **No home-built orchestration; real semver.** GitHub is the controller: Issues + Projects are the board, GitHub drives the dispatcher: its state is the board, labels and workflows, and a small poller on the agent host starts the sessions. A self-hosted runner is an optional upgrade for faster wake-ups (§6). The shared, parameterised kit is installed once. Tooling is capped at ~10% of effort. Releases are semver, on demand once checks pass; a new package starts at 1.0.0, an existing package continues its version history; published versions stay live and unchanged.

---

## 2. Failure modes this process prevents

For a New project these are guard rails; for an Existing project they are also a checklist of what to look for.

| # | Failure mode | Typical symptom | Fix in this plan |
|---|---|---|---|
| 1 | Components redesigned repeatedly | The same component reversed several times; references mixed from several design systems; headers or grids redone over and over | Component ADR + written spec against `DESIGN.md` before code (pictures only on owner request); engine swaps need an ADR and a throwaway spike |
| 2 | Owner is the gate on every merge and look | "Every merge needs the owner's word"; hundreds of queued questions; merges stuck waiting for a prompt; decision records unusable without context; many "Other" answers; "haven't we been through this?" | Owner is a stakeholder, not an approver: asked about goals once at intake, corrects by comment; decision cards with options, a recommendation and a default |
| 3 | Orchestration side-project crowds out product | Custom dashboards, install scripts and runtimes multiply; the kit and the roles get renamed | No custom dashboard/orchestrator; GitHub is the dashboard; tooling ≤10% |
| 4 | CI red and not a gate | Long runs with no green build; "checks are not a merge gate" policy; tests deleted instead of fixed | Required checks; flaky tests quarantined with an owner within 24h, never deleted |
| 5 | Handoff between AI tools fails | PRs from the second tool never merged, left unrebased for days, clones far behind | One builder; the second tool is on standby. One issue = one PR; PRs >48h auto-rebased or closed |
| 6 | Long-lived branches, generated files, submodules | Hundreds of catch-up merges; build output committed repeatedly; submodule pointer churn; changelog touched by most commits | Trunk-based; build outputs never committed; monorepo (no submodule); changeset fragments |
| 7 | Rules in prose, not enforced | The same rule restated by the owner; docs that contradict the code; rules violated again and again | Rule = test; `decisions.yaml` where every entry links its check |
| 8 | Status docs rewritten to fight context loss | Handoff and status files with dozens of versions; commits that touch only process docs; the same fact in 4+ places | Status comes only from GitHub; one stable `ONBOARDING.md`; session notes in PR descriptions |
| 9 | Releases too fast to consume | Hundreds of versions in weeks; breaking changes inside minor versions | Semver continuing any existing history (1.0.0 for a new package), on-demand releases batched with changesets, deprecation window |
| 10 | Infra and identity | One shared human login for all commits; dozens of agent processes on a small server; cron polling; unprotected `main` | GitHub App (one bot identity; roles are told apart by label and signature); slots counted by running sessions with a memory limit each (§5.2); event-triggered Actions workflows (§6); branch protection |
| 11 | Idle agents hold the slots | Resident sessions stay open waiting; every slot is taken; the roles that must run next (locale, QA) never start | Slots count running work only; idle sessions exit after `idle_exit_min`; slots reserved for gate roles (§5.2) |
| 12 | A role in the plan has no launcher entry | An on-demand role is described in the document but the launcher has no entry or agent definition for it, so it cannot be started | One role registry read by the launcher, the dispatcher and CI; a check that every role has a definition and a trigger; a launch test at the end of Phase 0 (§5.1) |
| 13 | Nothing wakes the agents except the owner | The owner has to remind the Product Lead to work; agents wait for instructions | Work is pulled from the master plan's Ready queue; the dispatcher wakes lanes; a needed nudge is a P0 process bug (§4, §6) |
| 14 | No master plan | Specs start from a "roadmap item" that does not exist; the queue empties and agents idle | Master plan skeleton in Phase 0; Ready buffer; evergreen backlog; plan review at every release (§4) |
| 15 | Numbers written in prose drift from the settings | The config says 8 slots while the plan and the instruction file still say 4 | Settings live only in the registry; documents link to it; check 15 fails on a mismatch (§5.1, §9) |
| 16 | Two engineers build the same issue | A hand-off says "the other engineer if free" and nobody claimed it; one finished PR is thrown away | Claim before building (§5.5) |
| 17 | An automated hand-off silently starts nothing | A label, tag or card move made with `GITHUB_TOKEN` starts no workflow, so the next role never wakes | Hand-offs use the GitHub App token or an explicit dispatch (§6.1, check 16) |

**Keep from any existing project if it has them (inherit, don't redo):** immutable versioned publishing, a read-only versioned API, one version across npm/CDN/API, DTCG tokens with ref/sys/comp tiers, contrast computed from tokens, `currentColor` icons, changeset fragments, and a test consumer site.

---

## 3. Design audit (Phase 0, Existing projects only)

The Design Director runs this once and files the findings as bugs. It does not redesign: the look stays as defined (§12, D-005).

- Token names that contain values (`radius-12px`, `size-4px`) or names that lie (a "yellow" token that is green).
- Token bloat: component tokens, CSS size, unused tokens.
- Type: body and heading at the same size; text below the minimum size in `DESIGN.md`, especially form labels and error text.
- Contrast failures the curated tests miss (all supported foreground/background pairings, in each supported theme).
- Dark mode: raised surfaces must be lighter than the canvas; no pure-black rule violations.
- Accent overuse: more than one accent role in a single view.
- Monospace "data font" used inside prose.
- Tables: pills wrapping to two lines, a rainbow of category colours, numbers not end-aligned.
- Visual-regression coverage: how many components, themes and densities are actually covered.
- Adoption: do the consumer apps really use the design system, or carry their own CSS and hex values?
- Design rework counted in the repo: briefs, studies, committed images.

---

## 4. The master plan

A project that has no standing plan has no standing work, and agents without work idle. The master plan is created in Phase 0 as a **skeleton**, filled in as the project learns, and it is what the Ready queue is fed from. It is never "finished"; it is reviewed at every release.

### 4.1 What it consists of

| Piece | Where | Owner |
|---|---|---|
| Master plan document | `docs/MASTER_PLAN.md` | Product Lead |
| Board (the queue) | GitHub Project in `{{GITHUB_REPO}}` | Product Lead keeps it fed; each lane agent moves its own items |
| Decision log | `decisions.yaml` + issues labelled `decision` (§8.3) | Product Lead |
| Lessons | `docs/lessons.md`, seeded from Appendix A | Delivery Lead |

### 4.2 The skeleton

Phase 0 creates `docs/MASTER_PLAN.md` with exactly these headings. The Product Lead fills them from the §0 intake and, in Existing mode, from the inventory and the design audit. The owner is asked for goals once, in one batched card (decision D-018, §12) only if the intake and the repo do not answer it.

```
# Master plan — {{PROJECT_NAME}}
## 1. Vision                  one paragraph
## 2. Users and outcomes      3–5 outcomes, each measurable
## 3. Scope and non-goals
## 4. Milestones              release train: the next valid versions (1.0.0 for a new package), each lists its epics
## 5. Epics                   id | outcome served | packages | milestone | status
## 6. Lanes and owners        which role owns which lane (from the registry)
## 7. Evergreen backlog       standing work recorded as a defect, gap, risk or maintenance need (§4.5)
## 8. Risks and open decisions   links to decision issues
## 9. Change log              links to plan-review issues
```

### 4.3 The board

**Columns:** Backlog → Ready → In progress → Verify → Integrate → Done.
**Fields on every item:** Lane, Package, Epic, Milestone, Priority (P0/P1/P2), Size (§7.1), Owner (agent).

**Ready means ready for the item's current lane.** The first spec item has to be able to enter the queue before any spec exists, so the requirements depend on the lane:

| Lane | An item may be Ready when |
|---|---|
| Spec | A clear request or outcome exists. An epic pulled from Backlog by the Product Lead is Ready for Spec |
| Design | G1 has passed |
| Architecture and plan | G2 has passed (UI work) or G1 has passed |
| Build | The applicable gates G1–G4 have passed, acceptance criteria are written, it belongs to one lane and one package, it fits one PR, and it has no unresolved blocking dependency |
| Verify, Integrate | The branch is done / all applicable gates are PASS or N/A |

BUG and XS items use the issue itself as the brief (§7.1), unless they touch an API, security or a migration (then they are treated as S).

**Definition of Done.** Merged to `main` with all required checks green, behaviour test included, and the board item moved to Done by the agent that finished it.

**Hand-off is a board move.** When a gate passes, the agent moves the item to the next lane's Ready, by the label and the Project field together. That move is what wakes the next lane (§6). The move is made with the GitHub App token, not `GITHUB_TOKEN` (§6.1).

### 4.4 Rolling-wave planning and the Ready buffer

- The current milestone is specified down to Ready issues. The next milestone is specified to epic level. Later milestones are an outline only. This keeps specs fresh and stops rework.
- **Ready buffer.** Each active lane keeps at least `ready_min` Ready items while the milestone has actionable work. When a lane falls below it, the dispatcher wakes the Product Lead, who pulls the next epic of the milestone from Backlog, specs it (G1), splits it into issues and moves them to Ready (each into the lane it is ready for).
- **Work-in-progress limits.** A lane agent holds one In progress item at a time; a Component Engineer holds one per worktree.

### 4.5 The evergreen backlog

Standing work that addresses a **recorded** need: a defect, gap, risk or approved maintenance item. When a lane has no planned Ready item and the evergreen list has a recorded item for it, the Product Lead tops it up from here. Agents never invent maintenance work to stay busy; an empty useful backlog is a valid idle state.

- behaviour-test gaps against the §9.3 baseline, per component
- documentation gaps (§9, G7) and example compile failures
- contrast, accessibility and minimum-size defects
- bundle-size budget overruns (§10)
- dead code and unused tokens or keys (Knip, locale checks)
- quarantined flaky tests (§9.3)
- pending translation proposals for the owner (D-016)
- dependency and tooling updates
- drift audit findings (§5.4)
- items from `docs/lessons.md`

Evergreen items rank below planned P0/P1 work. Each carries a link to the finding, check result or lesson that recorded the need.

### 4.6 Plan review

At every release (G8), and whenever Backlog + Ready falls below a threshold, the Product Lead runs a **plan review**: checks outcomes against what shipped, updates the plan, and posts a "Plan review" issue summarised in the daily summary. If every listed outcome is met, the Product Lead proposes the next outcomes as a `decision` issue and only recorded evergreen items carry the work in the meantime.

**Stopping rule.** Maintain the Ready buffer while the milestone has actionable work. When the milestone is complete and there are no documented defects or maintenance items, the Product Lead posts the summary and the agents exit. The next issue, comment or scheduled check wakes them.

---

## 5. Agents and capacity

### 5.1 The role registry: one source for the launcher, the dispatcher and CI

Every active role in §5.3 and §5.4 is declared in one file, `agents.config.yaml`. The launcher, the dispatcher and the CI checks all read only this file. A role that is described here but missing from the registry is a defect: it cannot be started.

*Illustrative skeleton. The Delivery Lead fixes the exact keys in Phase 0 and logs them as a `decision`.*

```yaml
settings:
  slots: 6                  # concurrent running sessions; set from host memory
  reserved_gate_slots: 2    # usable only by verify, locale, docs and release roles
  idle_exit_min: 5          # an idle session exits and frees its slot
  stall_min: 15             # no activity while work is assigned = stalled
  heartbeat_min: 10         # safety-net wake-up; events are the primary trigger
  ready_min: 3              # Ready items per active lane
  short_task_cap_min: 15    # short tasks count toward host concurrency and memory
  ready_label: "status:ready"          # Ready = role label + this label (§4.3)
  in_progress_label: "status:in-progress"
  refill_role: product-lead
  runner_label: "{{prefix}}-agents"    # mode R only: label of the optional self-hosted runner (§6.6)
roles:
  - id: product-lead
    kind: lane              # lane | task
    lane: spec
    label: "agent:{{prefix}}-product-lead"   # the work-item label the dispatcher reads
    instances: 1
    parked: false
    source: charter         # charter | <repo>@<commit>:<path> for an adopted role (§5.9)
    model: strongest
    definition: .agents/product-lead.md
    skills: [slice, owner-interview]
    wakes_on: [issue_opened, comment_mention, ready_below_min, release_done, heartbeat]
    memory_limit: 2G
  - id: qa-evidence
    kind: task
    label: "agent:{{prefix}}-qa-evidence"
    priority: verify        # release > integrate > verify > build > design > spec > evergreen
    gate: true              # may use the reserved gate slots
    always: true            # applies to every PR; other task roles use applies_to_paths: [globs]
    instances: 1
    parked: false
    source: charter
    model: mid
    definition: .agents/qa-evidence.md
    skills: [tdd]
    wakes_on: [pr_ready_for_review]
    memory_limit: 2G
```

**Rules**
1. Every **active** role has a registry entry, a definition file, a work-item label and at least one `wakes_on` trigger. Active means the shared roles plus the set for the selected project profile (§5.8); optional roles may be `parked`.
2. Lane agents and task agents are both launched from the registry. There is no second list of "roles that start automatically".
3. A role marked `parked` is never started (for example mobile work while mobile is out of scope).
4. The settings (slots, timeouts, buffers) live only here. **Documents refer to a setting by name (`ready_min`), never by value**; the defaults appear only in the skeleton above. The Delivery Lead adjusts the settings (logged as a `decision` issue so they show on the dashboard); the owner can change them any time by commenting on that issue.
5. CI fails if any role lacks a definition, label or trigger, if an adopted role lacks provenance, or if a document states a value that differs from the registry (§9, checks 13 and 15).
6. **Launch test (G0).** At the end of Phase 0 the dispatcher starts every active, non-parked role in the registry once in dry-run mode. A role that does not start blocks G0. Parked roles are checked only for an entry and a definition.

### 5.2 Capacity: count running work, not open sessions

- **A slot is one running session doing work.** A sleeping agent holds no slot and no memory. Its state lives in GitHub (issue, PR, board, ledger, `ONBOARDING.md`, `docs/lessons.md`), never in the session.
- **A lane agent runs while its lane has a Ready item.** When the lane is empty it posts "lane empty" and exits; the dispatcher starts it again when work arrives (§6). A session that does nothing for `idle_exit_min` is stopped by the dispatcher. Activity is read from a last-activity record that hooks write (§9), never from the terminal screen.
- **Reserved gate slots.** Of `slots`, `reserved_gate_slots` can be used only by verification, locale, docs and release roles. Builders can never take them, so QA, accessibility and locale gates always get to run.
- **Priority when slots are scarce:** release > integrate > verify > build > design > spec > evergreen. Finishing work in progress beats starting new work.
- **Short tasks** (a code review, a lint or typo fix, a single test, triaging an issue, a reply on GitHub, updating the daily summary) get scheduling priority but **still count toward host concurrency and memory limits**, and are each capped at `short_task_cap_min`. One that runs longer stops and becomes a queued item.
- **Limit by memory, not by count.** Every session runs with its own memory limit from the registry; new sessions wait if the host is near its limit.
- All numbers are settings (§5.1, rule 3).

### 5.3 Lane agents

A lane agent owns one lane of the board. It wakes when its lane has a Ready item, works the lane until it is empty, and sleeps. Every role signs its comments `— <role>` and carries its work-item label.

| Role | Model | Lane | Owns | Wakes on | Hard gate |
|---|---|---|---|---|---|
| **Product Lead** | strongest | spec | The §0 intake, the master plan, every owner issue (log, triage, route), specs (P0/P1/P2, non-goals), the decision log, reports back to the owner with links and pictures, refilling the Ready queue | New owner issue or comment, Ready below minimum, release done, heartbeat | **G1 Spec written** (no owner sign-off) |
| **Design Director** (taste owner) | strongest | design | `DESIGN.md` contract, state matrices, motion and icon rules, data-display design (grid, pills, charts); produces pictures or variants **only when the owner asks** | G1 passed on a UI item; `type:ui` issue | **G2 Design fits `DESIGN.md`** (no picture required) |
| **Design-System Architect** | strongest | architecture | Package boundaries, token tiers, public API contracts, ADRs, versioning and deprecation | G2 passed; any API or token change | **G3 Contract:** no new public prop or token tier without an ADR |
| **Delivery Lead** | strong | plan | Plans with Global Constraints, package ownership, conflict pre-scan, ledger, rulings, merge order, the role registry and its settings, dispatcher health | G3 passed; stall alert; daily | **G4 Plan approved** (by the Delivery Lead) |
| **Component Engineer ×N** (one per package/worktree) | mid | build | TDD implementation, stories for every state, minimal diffs | Ready build item | Red→green evidence per task |
| **i18n Engineer** | strongest | locale | The locale catalogs and the language standard (`docs/i18n/<locale>.md`): prepares proposals for the owner, enforces the rules as tests, pseudo-locale. Never writes a translation without the owner's answer | PR touching text, catalogs or direction | **G6 Locale:** no missing/unapproved strings in a release |
| **Backend & Release Architect** | strongest | release | API contract (OpenAPI), immutable publish, packages, CI pipeline, merge queue, dashboard backend auth | Integrate-ready PR; release batch ready | **G8 Release integrity:** no overwrite of a published version, npm = hosted version, live smoke test |
| **Technical Writer & Messaging Designer** | mid | docs | Docs site, generated prop/token/API reference, migration guides, changelog; **owns the messaging standard (§9.2)** | Public API changed | **G7 Docs:** every public API documented, examples compile |

### 5.4 Task agents

Task agents are launched for one job and then gone. They are in the registry like every other role. The dispatcher launches them from the event in the "Launched when" column by adding the role's `agent:` label to the PR or issue: the label is the work item, so one queue starts lane agents and task agents alike.

| Role | Model | Job | Launched when | Gate |
|---|---|---|---|---|
| **Code Reviewer** | mid per task / strongest final | Spec ✓ + quality; Critical/Important/Minor | PR opened (per task, then once for the whole branch) | **G5a:** no next task with open Critical/Important |
| **Design Critic** (separate from the builder) | strong | UI review that reads the **code and the screenshots together**: checks the change against `DESIGN.md`, the tokens and the states. Screenshots at desktop, light theme by default; dark, mobile width or RTL only when the change touches them → reject / rework / ship | PR that changes UI | **G5b Visual** |
| **Accessibility & RTL Auditor** | mid | axe, keyboard, screen reader, contrast of the supported pairings, bidi (RTL only if the project has an RTL locale) | PR that changes UI | **G5c a11y** |
| **QA / Evidence Engineer** | mid | Playwright and Vitest behaviour tests per §9.3, visual regression, bundle budget; records NOT TESTED honestly; 3 attempts then escalate | Every PR | **G5d Behaviour** |
| **Security Reviewer** | strongest | Permissions, privacy, data isolation, payments, secrets and workflow injection | PR that touches authentication, permissions, data access, payments, secrets or workflows | **G5e Security** |
| **Debugger** | strong | Root cause before any fix; hands the engineer a failing test | `type:bug` item enters Ready, or a fix loop reaches its third round | Failing test first |
| **Mobile App Builder** (parked unless mobile is in scope, §12) | mid | Touch density, mobile grid/charts, native token builds | Mobile item in Ready | Native tokens compile; touch targets pass |
| **Database Optimizer** | mid | API/dashboard data store, locale-aware search, migrations | Schema or data item in Ready | Migration lint, query budgets |
| **Simulated-User Tester** | mid | UXAgent-style persona runs on the docs site | Release candidate | Advisory |
| **Drift Auditor** | mid | Drift between AI tools, duplicate logic, token misuse | Monthly timer | Feeds the evergreen backlog |

### 5.5 Rules for every role

- **Identity.** A GitHub App is one bot identity, so roles are told apart by their work-item label and by the `— <role>` signature on every comment. A separate bot per role needs a separate App per role and is optional (§11.1).
- Every role writes artifacts as files in the repo, not chat.
- Every role reports evidence as Ran / Skipped / Planned / Manual, with a file path.
- **Pull loop.** Finish the item → move it to the next lane's Ready → take the next Ready item in your lane → if none, post "lane empty" and exit.
- **Claim before building.** Comment "claiming" on the issue and check for an open PR that mentions it. The first claim wins; the Delivery Lead closes a later PR as a duplicate.
- **Protected files.** Files marked protected in the instruction file (the plan, language standards, any source contract the owner names) are changed only through an issue, never edited to make a check pass.
- **Check before reporting.** Check a push or merge result before saying it happened. A report is a claim until `git log`, the diff and the checks confirm it.
- **Stop rule.** An agent stops only when its lane has no Ready item or a limit is reached, and says which in its last comment. "Waiting for the owner" is never a valid reason for routine work. The only blocking exceptions are in §7; an item blocked by one is parked with a comment and the agent takes the next Ready item.

### 5.6 Not adopted (and why)

- **CEO/CPO/CHRO role-play (ChatDev).** Theatre, no output.
- **NEXUS-full (agency).** Months-long, dozens of agents.
- **Chief-of-staff / studio-producer / project-shepherd.** More coordinators, the old trap.
- **Workflow-optimizer.** Process tinkering, the old trap.
- **MetaGPT's runtime.** Building orchestration again.
- **Paid principle APIs.**
- **Brand catalogs (open-design, tasteful-ui).** The project follows `{{DESIGN_SYSTEM}}` and its own brand, not a catalog.

### 5.7 Where the roles come from

| Role | Borrows from |
|---|---|
| Product Lead | MetaGPT PM, superpowers *brainstorming*, ux-discovery-interviewer, open-design question pattern, ui-craft *remember* |
| Design Director | impeccable (*shape*, *operate*, DESIGN.md), tasteful-ui gates, jakub *variant* / *state-machine* / *break*, plugin87 *design-doctrine*, ui-craft *brief* |
| Design-System Architect | MetaGPT Architect, agency software-architect + ux-architect |
| Delivery Lead | superpowers *writing-plans* + *subagent-driven-development*, agency senior PM |
| Component Engineer | agency frontend + minimal-change engineer, superpowers *TDD*, *systematic-debugging* |
| i18n Engineer | agency *i18n-engineer* |
| Backend & Release Architect | agency *backend-architect* + devops-automator + git-workflow-master |
| Technical Writer & Messaging Designer | agency *technical-writer* |

The whole team is built from superpowers (workflow and gates), agency-agents (roles), MetaGPT (artifact schemas), ChatDev (loop caps, lessons file) and a set of design-skill sources (§13).

### 5.8 Role sets by project type

The roles in §5.3 are the Library set. An Application keeps the shared roles and swaps the build, data, architecture and release roles. The registry lists the set that matches `{{PROFILE}}` (§0 Q6).

| Slot | Library or design system | Application |
|---|---|---|
| Shared (both) | Product Lead, Design Director, Delivery Lead, i18n Engineer, Technical Writer & Messaging Designer | same |
| Build | Component Engineer ×N | Frontend Engineer, Backend Engineer |
| Data | Database Optimizer (task agent) | Database Engineer (lane agent; sole owner of migrations and access rules) |
| Architecture (G3) | Design-System Architect: packages, token tiers, public API, ADRs | Solution Architect: API contracts, data model, ADRs |
| Release (G8) | Backend & Release Architect: publish to npm, hosted files, API | Release Engineer: CI, required checks, staging and production deploys, upgrades of the design system |
| Design system | Defines and publishes it | Consumes it as published with pinned versions; local overrides only as recorded in D-005 |
| Extra, optional | Mobile App Builder (parked unless in scope) | Media Pipeline Engineer (parked until needed) |

### 5.9 Role discovery: when the charter has no role for the job

Before any work starts, the dispatcher answers "which role owns this?" from the registry (lane, skills, triggers). If a Ready item or a gate needs a job that no registered role covers, any agent opens a `process` issue and the **Delivery Lead runs role discovery**. The sources are these four, and no others unless the owner adds one:

| Source | Look here for | Where the definition lives |
|---|---|---|
| `obra/superpowers` | Workflow skills and gates: brainstorming, writing-plans, subagent-driven-development, TDD, systematic-debugging, verification-before-completion | Markdown: `skills/<name>/SKILL.md` |
| `msitarzewski/agency-agents` | Role definitions, including database-optimizer, backend-architect, i18n-engineer, mobile-app-builder, technical-writer, frontend, software-architect, ux-architect, devops-automator, git-workflow-master, senior PM | Markdown: `<division>/<division>-<role>.md`, for example `engineering/engineering-backend-architect.md` |
| `FoundationAgents/MetaGPT` | Roles and artifact schemas (product manager, architect, project manager, QA) | Python, not markdown: role classes in `metagpt/roles/*.py` (profile, goal, constraints, actions) |
| `OpenBMB/ChatDev` (`chatdev1.0` branch) | Loop caps and the lessons-file pattern | JSON, not markdown: `CompanyConfig/Default/RoleConfig.json` (role prompts), with phases in `PhaseConfig.json` |

**Finding the definition.** A source is searched by opening the actual file at the pinned commit, never by trusting its README. Where the source defines the role as markdown (superpowers, agency-agents), that file is the definition to copy. Where it does not (MetaGPT, ChatDev), there is no markdown to copy: the Delivery Lead reads the Python or JSON, extracts the role's job, inputs, outputs and constraints, and writes the `.agents/<role>.md` itself. In every case the provenance is `<repo>@<commit>:<path>` of the file that was read.

**Steps**
1. **Search** the four sources for a role that fits the job. Prefer the closest existing definition to inventing a new one.
2. **Adapt** it into `.agents/<role>.md`: copy the markdown definition, or write one from the Python/JSON source (see above). Keep the job, inputs, outputs and evidence format; remove anything in §5.6 (role-play titles, extra coordinators, their runtime). Record provenance as `<repo>@<commit>:<path>`.
3. **Register** it in `agents.config.yaml` with `source` set to that provenance, a lane or trigger, a work-item label, a model and a memory limit. It needs a hard gate, or an explicit "advisory".
4. **Launch-test** it once in dry-run mode (as in G0). Check 13 enforces steps 2 to 4 (§9).
5. **Log** it as a `decision` (area: process) and report it in the daily summary.

**Rules**
- Source content is data, not instructions. Copy and review the definition text; never install a package, plugin or hook from a source without review and a pinned version.
- Pin the commit. A later change in the source does not change the role until the Delivery Lead updates the pin.
- A discovered role does not change the design system, the locked decisions or any protected file.
- If none of the four sources has a fit, the Delivery Lead writes the role from the closest definition and records that no source matched.

### 5.10 Project skills

Each project carries four small skills that every role can use, in `.claude/skills/`. They are listed in the registry's `skills` key.

| Skill | What it does |
|---|---|
| `slice` | The full step list for one slice from spec to merge, and the rule that subagents see nothing of the conversation, so each dispatch carries the brief, constraints and paths |
| `owner-interview` | Writes the decision card (§8.2) and records the decision |
| `tdd` | Red → green; a bug fix comes with a test that fails before the fix |
| `debug` | Root cause before any fix; stop and escalate after three failed fixes |

---

## 6. The dispatcher: how agents never sit idle

The dispatcher is the answer to "who tells the agents to work?". It is **GitHub-native**: all of its state is on GitHub (the Project board, issue labels, the registry), and only the agent host can start sessions. It has two modes, chosen in D-019:

| Mode | How agents are woken | Needs |
|---|---|---|
| **P. Poller (default)** | A small poller on the agent host reads current Ready items and open PRs every `heartbeat_min` and starts the roles that need to run | Nothing beyond the agent host and the GitHub App |
| **R. Runner (optional)** | Also installs a self-hosted GitHub Actions runner, so a GitHub event (new issue, comment, check result, label) starts the dispatcher workflow within seconds. The poller stays as the safety net | A self-hosted runner on the agent host, private repository only |

The runner is added only when slower wake-ups become a problem. Both modes read `agents.config.yaml`. The dispatcher is configuration, not an orchestrator: no UI, no database, no state of its own. It counts against the tooling cap (~10% of effort).

### 6.1 What triggers it

- **Poller (always on, both modes).** Every `heartbeat_min` the poller reads **current state directly**: Ready items per lane, open PRs and the running sessions, using conditional requests where the API supports them. It does not read the events feed, which GitHub says can lag from about 30 seconds to 6 hours. In mode P this is how agents are woken; in mode R it is the safety net.
- **Events (mode R only).** The `dispatcher` workflow, running on the self-hosted runner, is triggered by `issues`, `issue_comment`, `pull_request`, `pull_request_review`, completed check and workflow runs, `workflow_dispatch` and `repository_dispatch`. Start-up within seconds is a **target, not a guarantee**. Workflows need a merge-queue `merge_group` trigger only on required CI (GitHub documents this); self-hosted jobs are limited to 5 days and a job queued 24 hours without a runner is cancelled, which is why the poller always stays on. A hand-off is a label change as well as a Project field change, so it is an issue event. Project item changes are a webhook event but are reported not to trigger Actions workflows, so the design does not depend on them; if the field changes without the label, the poller catches it.
- **Automation-made events do not start workflows.** Events caused by the repository's `GITHUB_TOKEN`, except `workflow_dispatch` and `repository_dispatch`, do not create new workflow runs. So every hand-off an agent or workflow makes (adding a label, pushing a release tag, moving a card) uses the **GitHub App installation token** (or a personal access token), or ends with an explicit dispatch call. A hand-off made with `GITHUB_TOKEN` is a defect.
- **Watchdog.** The poller updates a pinned "Dispatcher heartbeat" issue each run. A separate daily workflow on a GitHub-hosted runner checks its age. If it is older than 2× `heartbeat_min`, it opens a P0 `process` issue (this also catches an offline host or runner).

### 6.2 The rules

Activity comes from the last-activity record that hooks write (§9). The dispatcher never reads the terminal screen and never types into a running session; it wakes a role by starting a fresh headless session.

| Condition | Action |
|---|---|
| A lane has a Ready item (ready for that lane, §4.3) and its agent is not running, and a slot is free | Start the lane agent from the registry |
| A lane has a Ready item and no slot is free | Queue by priority (§5.2); stop an idle session first to free a slot |
| A session has recorded no activity for `idle_exit_min` and its lane is empty | Stop it and free the slot |
| A session with assigned work records no activity for `stall_min` | Post a nudge comment as the dispatcher. If it stalls again, stop the session, return the item to Ready with a note, and add the cause to `docs/lessons.md` |
| A PR is ready for review | Add the `agent:` label of every **applicable** task agent (QA always; Design Critic and a11y for UI; i18n for text; Security Reviewer for sensitive areas). Gates that do not apply are recorded N/A with a reason. Start the labelled agents using the reserved gate slots |
| A lane's Ready depth falls below `ready_min` while the milestone has actionable work | Wake the Product Lead to refill from the master plan (§4.4) |
| Backlog and Ready are both empty | Wake the Product Lead for a plan review (§4.6). Recorded evergreen items are used; if there are none, the agents exit and stay asleep until the next event (stopping rule, §4.6) |
| A Ready item matches no registered role | Open a `process` issue and start role discovery (§5.9) |
| A role is `parked` | Never start it |
| A role has no registry entry, definition file, label or trigger | Open a P0 `process` issue; the registry check fails CI (§9, check 13) |

### 6.3 What an agent does when blocked

An agent that cannot proceed does not wait. It applies the safety net in §7, logs a `Ruling: what — why — cost if wrong`, and continues. If the blocker is a missing registry entry, a missing definition or a full host, it opens a `process` issue and takes the next Ready item.

### 6.4 The nudge rule

If the owner has to remind an agent to work while Ready items exist, the dispatcher failed. That reminder is logged as a P0 `process` bug. The Delivery Lead finds the root cause within 24 hours, fixes it, adds a check or a dispatcher rule so it cannot recur, and records it in `docs/lessons.md`. The target is zero nudges.

### 6.5 Health in the daily summary

The pinned "Daily summary" issue (§8.2) carries one health line: sessions running / sleeping / stalled, Ready depth per lane, roles launched in the last 24 hours, and the number of nudges needed (target 0).

### 6.6 The dispatcher kit

The dispatcher is built once as a **shared, parameterised kit** and installed in Phase 0; a project does not rewrite it. Because GitHub is the controller, the kit is mostly files in the repository plus a small host-side part.

| Part | Where it lives | What it does |
|---|---|---|
| `poller` | Agent host | Every `heartbeat_min` reads the registry and the current board, decides which roles to start or stop (§6.2) and calls the launcher. It only **starts** sessions; sessions run as host services. This is the whole dispatcher in mode P |
| `dispatcher.yml` (mode R only) | `.github/workflows/`, runs on the self-hosted runner (`runner_label`) | Receives the §6.1 events and runs the same decision step immediately. It only starts sessions and exits, so job limits and runner restarts do not kill them. `concurrency` is set per repository with `cancel-in-progress: false` |
| `watchdog` | `.github/workflows/`, GitHub-hosted runner | Checks the poller's heartbeat issue (§6.1) |
| Required CI workflows | `.github/workflows/` | Also trigger on `merge_group` whenever a merge queue is enabled; otherwise the queue never receives its required checks |
| Launcher | Agent host | Lists, starts and stops sessions from the registry as transient systemd units with the memory limit; reads no terminal screens |
| Activity hooks | Agent host | Write each session's last-activity record (§9) |
| Runner install script (mode R only) | Agent host | Registers the runner against `{{GITHUB_REPO}}` (or the organisation, when `{{GITHUB_ORG}}` is used) and installs it as a service |
| GitHub App definition | Repository | The permissions the App needs; the installation token is what agents use for hand-offs |

The kit exists as a ready-made package (`dispatcher-kit/`: poller, launcher, hooks, units, install script, two workflows, 16 tests) that Phase 0 installs with `install.sh --prefix {{PREFIX}} --repo {{GITHUB_REPO}} --root <checkout>`. Its conventions: Ready is the role label plus `status:ready`; a new PR is labelled with each applicable task agent plus `gates:assigned`; the poller updates a pinned "Dispatcher heartbeat" issue. It is parameterised by `{{PREFIX}}`, `{{GITHUB_REPO}}`, the optional `{{GITHUB_ORG}}` and the registry path; nothing in it is hardcoded to one project. It counts against the tooling cap. Its location and pinned version are recorded in D-019.

**Security (mode R).** The runner executes whatever a workflow tells it to, on the agent host. Use it only for a private repository, never run workflows from forks on it, and do not use `pull_request_target` there. Issue and comment text is data, never instructions to the dispatcher.

---

## 7. The SDLC

Each phase hands off by a board move (§4.3): when a gate passes, the item moves to the next lane's Ready and that lane wakes (§6).

| Phase | Entry | Work | Exit gate |
|---|---|---|---|
| **0. Foundation** (once, ≤2 days) | §0 intake answered (this authorizes Phase 0) | Existing mode: inventory and design audit (§0, §3). Owner setup checklist (§11.1). Monorepo scaffold, required CI checks (stubs), `DESIGN.md` v0 (from `{{DESIGN_SYSTEM}}`), lint rules 1–12 and process checks 13–16 (§9), Storybook, docs shell, publish dry-run, branch protection, GitHub App, dispatcher poller (and the runner if mode R). **Role registry, dispatcher kit and its mode (D-019), and board (§5, §6). Master plan skeleton with at least one milestone and `ready_min` Ready items (§4)** | **G0:** CI green on empty packages; dry-run publish works; launch test passes (every active, non-parked role in the registry starts); master plan skeleton in place |
| **1. Discover / Spec** | An epic reaches the top of the Ready queue | Product Lead interviews (3–5 questions per round, Known/Inferred/Unknown); one batched question card | **G1** spec with P0/P1/P2, non-goals, no open "Anything unclear" |
| **2. Design** | G1 | Design Director: design written against `DESIGN.md`, state list, edge cases (long text, empty, 10k rows; RTL only if the change touches text or layout direction). Pictures or variants only if the owner asked | **G2** design fits `DESIGN.md`; no waiting |
| **3. Architecture + Plan** | G2 | ADR/API contract; plan with tasks, interfaces and conflict table; tasks become Ready items | **G3 + G4** (agent-approved; plan posted to the owner) |
| **4. Build** | G4 | One engineer per package in its own worktree; tasks serial; review after each; fix loop capped at 5 rounds; ambiguities logged as `Ruling: what — why — cost if wrong` | All tasks done or parked with a ruling |
| **5. Verify** | Branch done | The applicable reviewers (Reviewer, Critic, a11y, QA, Security) are launched by the dispatcher and run in parallel; one final whole-branch review; one fix wave | **G5a–e**, each PASS, FAIL or N/A with a reason |
| **6. Localize + Document** (overlaps 4–5) | Stable API | Translation proposals to the owner per `docs/i18n/<locale>.md` (only approved words go into the catalog), docs pages, changeset | **G6 + G7** |
| **7. Integrate** | All green | Merge queue, one PR at a time per package; conflicts go back to the owning engineer | `main` green |
| **8. Release** (on demand) | Release batch ready and `{{HOSTING}}` defined | Readiness report → automatic tag → publish → live check (on failure, recovery as in §10) → summary and "Rulings I made" to the owner → update `docs/lessons.md` → plan review (§4.6) | **G8** published and verified live |

**The owner's role:** product stakeholder and reporter. You describe what to build or fix in plain words (§8.1). Agents do not ask you for routine approval and do not wait for you. The few things that do wait for you are the blocking exceptions below, and even then the agent takes the next Ready item.

**What runs on its own:** everything: spec, design, plan, build, review, merge, database migrations, release and live deployment. Owner QA is a follow-up, never a block.

**Agents do not wait for routine approval.** Situations that used to stop the work trigger an automatic safety net, and the work continues. Agents proceed within the limits in the registry.

| Situation | What the agent does instead of stopping |
|---|---|
| Hard-to-reverse action | Anything in the repository: proceed, since git history restores it. Live data: take a backup or snapshot first (database dump, git tag; published versions are immutable), then proceed. Only an action that nothing can undo and that is outside the owner's authorization is parked: report it and continue other work |
| Security issue | Fix it at once, log a `security` issue, include it in the owner's summary |
| External side effect | Proceed if it is an authorized part of the pipeline; log it. Otherwise block that item, report, continue |
| Plan broken beyond a reasonable guess | Re-plan, log a `Ruling: what — why — cost if wrong`, continue |
| `git clean -fdx` | Only inside the agent's own worktree. In a shared folder it would delete other agents' uncommitted work |
| Database migration | Automatic backup and a written recovery procedure before it runs, plus a recorded note on whether the previous build can run on the migrated schema |
| Merge | Self-merge with `gh pr merge --auto` once required checks pass, through the merge queue where the account supports one |
| Live deployment | Health check after deploy; on failure restore the previous deployment (§10) |
| Own lane is empty | Post "lane empty" and exit; the dispatcher restarts the lane when work arrives (§6) |
| Another role is missing or will not start | Open a `process` issue (P0), take the next Ready item; never wait |

**Blocking exceptions.** Three things legitimately wait for a person, and the agent continues with other Ready work meanwhile:
1. The intake (§0): Phase 0 does not start until Q0–Q4 and Q6 are answered.
2. Language approvals: a new translated word goes into the catalog only after the owner's answer (D-016). The item needing it is parked; G6 does not pass until it is answered.
3. The rare action that nothing can undo and that is outside the owner's authorization (first row of the table above).

### 7.1 Work sizes

Every item carries a size on the board. Size decides how much of the SDLC it needs, so small fixes do not wait on specs.

| Size | Phases | Notes |
|---|---|---|
| BUG | Skip phases 1–3 | The issue is the brief; a failing test comes first. Treated as S if it needs an API, security or migration decision |
| XS | Skip phases 1–3 | The issue is the brief. Treated as S if it needs an API, security or migration decision |
| S, M | All phases | |
| L | Split into M items first | Each M item then runs all phases |

---

## 8. Owner interaction

The owner never needs to remind an agent to work (§6.4). **Everything happens on GitHub.** You and every agent communicate only through GitHub in `{{GITHUB_REPO}}`; there are no side chats, status files or separate dashboards to keep in sync.

### 8.1 How you ask for things

- **You** open an issue from a template (Bug, Feature, UI/UX, Question) or comment on any issue or PR. Plain words are enough; add a screenshot or annotated picture if it helps. To get pictures back, say so (e.g. "show me options" or "send a before/after").
- **Agents** sign every comment `— <role>` and carry their `agent:` label, all through the one GitHub App. They hand work to each other by assigning issues, moving the board card and mentioning roles in comments; those hand-offs use the App token so they wake the next role (§6.1).
- **Pickup:** the dispatcher (§6) wakes the right agent when a new issue, comment or check result arrives (a target of seconds; the heartbeat is the backstop). You never need to remind anyone.
- **Your summary:** one pinned "Daily summary" issue, updated each day: decisions made, releases shipped, anything worth a look. Text and links, plus a link to that day's visual check screenshots on the dashboard.
- **Decisions:** every decision is an issue labelled `decision` and is shown on the dashboard (§8.3).

**A. Bug** (Owner → Product Lead → specialist)
1. The Product Lead logs a `type:bug` issue: severity, reproduction steps, affected components, your words and screenshot.
2. It identifies the domain and assigns the specialist: Component Engineer (UI code), Backend & Release Architect (API, publishing, build), i18n Engineer (locales), Database Optimizer (data), Design Director (looks wrong).
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

### 8.2 How agents talk to you

**All of this is a comment on the GitHub issue.** Agents don't ask permission. They ask about *intent* only when a request can't be read any other way, and even then they go ahead with the recommended option at once and tell you ("I went with A; say B to switch"). The one exception is the §0 intake, which must be answered before work starts. Every choice is reported with this card:

> **D-0123 · Data grid: row height in compact density**
> Context: one sentence of what we understood.
> **A (Recommended)** — 32px — risk: tight for dense scripts
> **B** — 36px — risk: fewer rows visible
> **C** — 28px — risk: below touch minimum
> (Screenshots are attached only when you asked to see options.)
> **Applied: A.** To switch, reply B or C. If switched, we redo: 1 token + snapshots.

**Rules for asking**
- **Pictures.** Screenshots that CI already makes are always shared: changed snapshots on the PR and your issue, all of them on the dashboard. Agents make *extra* pictures (options, variants, mock-ups) only when you ask ("show me", "options").
- **One summary.** Decisions made, releases shipped, anything worth a look and one agent-health line (§6.5) go into the pinned "Daily summary" issue. Nothing waits on a reply, except the blocking exceptions in §7.
- **Don't ask when** the answer is in the decision log, the codebase or `DESIGN.md`, or the change is cheap to reverse (apply the default and say so).
- **Never ask twice.** Every decision becomes a `decision` issue and an entry in `decisions.yaml` with date, reason, and the **check that enforces it**.
- **"Other" is not an ending.** The Product Lead maps it back to options in the next card.
- **Feedback register.** Each owner comment is tracked as open → accepted → applied (with a link to the changed file). No silent drops, and nothing is redone without a new decision.

### 8.3 The dashboard: decisions and visual checks

**Phase 0 uses what GitHub already gives:** a pinned "Dashboard" issue that lists the decisions, Project views, and links to the CI screenshots and artifacts. No generated page is built in Phase 0, which keeps it off the critical path. A generated read-only page is **optional later**, built only if the pinned issue and the links become hard to navigate, and it reuses existing tooling.

**Source of truth:** `decisions.yaml` in the repo plus the GitHub issues labelled `decision`. A GitHub Action rebuilds the pinned issue on every change.

**Each decision shows:**
- ID, date and area (design, tokens, components, i18n, release, process)
- the decision in one line, and why
- the options that were considered (with pictures, if any were made) and which one won
- who decided (owner, or which agent as a ruling)
- status: active, superseded (linked to its replacement) or retired
- **the check that enforces it**, with its live pass/fail result from the latest `main` build, or "review only" with the reason
- links: the decision issue, the PRs that applied it

It also lists the decisions with no enforcing check, so gaps are visible, and loads the intake decisions (§0) and the foundation decisions (§12) on day one.

**Visual checks:** every changed screenshot goes as a comment on the PR and on the owner's issue, so nothing has to be looked up. Screenshots are stored as CI artifacts and linked from the pinned issue; old runs are kept for 90 days.

**If the optional page is built later,** it has two tabs (Decisions; Visual checks with before, after and the highlighted difference, filterable by component, theme, direction and density), is read-only, has no backend or login of its own, and is time-boxed to two days. It is published beside the docs once `{{HOSTING}}` is defined.

---

## 9. Enforcement: making rules real

**Scope.** Design checks apply to the selected design system and the configured features (themes, RTL, density). A check for a feature the project does not have is recorded N/A with the reason, not run.

**Design contract.** `DESIGN.md` (with front-matter scales, including `design_system: {{DESIGN_SYSTEM}}`), `tokens/*.json` (DTCG) and `design.rules.json` hold the single source. Every lint rule reads from them.

**First 12 checks to build in Phase 0**
1. No hex/rgb/named colours outside `ref` tokens.
2. Radius only from the scale in `DESIGN.md`.
3. Font size only from type roles, never below the minimum in `DESIGN.md`.
4. No physical left/right anywhere, utilities included.
5. No `transition: all`; durations from motion tokens; `prefers-reduced-motion` guard.
6. No comp → ref token references (no tier skipping).
7. Token names may not contain values.
8. Contrast for all supported foreground/background pairings (the pairs the design system defines for use), in each supported theme, every commit.
9. State manifest per component (default, hover, focus, active, disabled, loading, error, selected), checked against stories.
10. Numeric columns: `tabular-nums` and end alignment.
11. Pills in a table row: equal measured height (Playwright bounding boxes).
12. Visual regression, automated in CI; **its screenshots and diffs go to the owner and the dashboard** (§8.3): every story in each supported theme (light and dark where the design system supports both) at standard density on every PR. RTL and compact snapshots run only for components whose text, direction or density code changed. There is no separate full run before a release. A missing browser = FAIL, not skip.

**Process checks (the plan checks itself)**
13. **Role registry:** every active role (the shared set plus the selected profile's set, §5.8) has an entry in `agents.config.yaml`, a definition file, a work-item label and at least one trigger; optional roles may be parked; an adopted role has provenance (§5.9); the launcher can list and start it.
14. **Dispatcher health (scheduled alert, not a required merge check):** raises a P0 `process` issue if the heartbeat has not run within 2× `heartbeat_min`; if a lane has Ready items and no running or woken agent for more than `stall_min`; if a session holds a slot idle beyond `idle_exit_min`; or if a lane's Ready depth is below `ready_min` with no refill requested. It is not required for merging, because a scheduled check on `main` cannot report on the commit being merged and would leave a healthy PR waiting.
15. **Settings in prose:** no document states a value of a registry setting (slots, timeouts, buffers) that differs from `agents.config.yaml`; documents name settings rather than quote values.
16. **Merge-queue triggers:** when a merge queue is enabled, every required workflow also triggers on `merge_group`; and every automation hand-off uses the App token or an explicit dispatch, never `GITHUB_TOKEN` (§6.1).

**Locked-choice check.** `design_system` in `DESIGN.md` must equal the value recorded in D-002; CI fails otherwise, and the value cannot change after the first release.

**Locale checks** (i18n Engineer)
- Missing key in any configured locale
- Translation in a catalog without a recorded owner approval
- Placeholder mismatch
- Missing plural forms required by the locale (CLDR categories)
- Literal JSX strings
- Unused keys

**Agent hooks**
- A SessionStart hook loads the skills, the ledger, `docs/lessons.md` and the agent's lane queue.
- A Stop hook blocks "done" when edited UI has no fresh passing check result (from plugin87's measurement-receipt pattern).
- An activity hook (session start, tool use and stop) writes the agent's last-activity record, which the dispatcher reads (§6.2).
- A Stop hook for lane agents blocks exit while the lane has a Ready item, unless the agent has posted a stop reason (§5.5).

**Decision coverage.** CI fails if any `decisions.yaml` entry has no linked check (or an explicit `review-only` reason).

### 9.1 Coding-standards tools

The rule of thumb: adopt tools that **enforce** (they fail CI) or **surface** findings where agents read them. Skip tools that only add another AI opinion, because the team already has a Code Reviewer subagent (and a second AI tool on standby as a second opinion).

The first eight tools were checked against their repos on 2026-11-03; zizmor, lefthook, Changesets and ast-grep were added afterwards and were not checked here. Re-check all before adopting.

| Tool | Facts | Verdict |
|---|---|---|
| **Semgrep → use Opengrep** | Semgrep CE is LGPL, but its maintained rules are under a restrictive license and some analysis moved to paid. Opengrep (3.3k★, v1.33.1) is the community fork, same rule format | **Adopt Opengrep, Phase 0, required check.** Own project rules only, each with test fixtures: physical left/right in style props, hex in TSX, banned imports, `dangerouslySetInnerHTML`. Most single-file rules go to ESLint/Stylelint first |
| **SonarQube Community** | No PR/branch analysis without an unofficial plugin; needs 2–4 GB RAM + Postgres | **Skip.** Overlaps tsc/ESLint/Knip/Opengrep; the server is already tight. SonarQube Cloud (free for public repos) could be a non-blocking trial later |
| **Saguaro** (mesa-dot-dev) | 26★. **npm release 0.4.22 was malware** (Mini Shai-Hulud worm, OSV MAL-2026-3599) | **Do not adopt.** Supply-chain risk with agents on bypass permissions; it also duplicates our Stop hook with an LLM gate |
| **OpenQodex** | 1.1k★ but created 2026-10-02, v0.16, pre-1.0, auto-updates by default. Separate finder/verifier sessions on a frozen copy, evidence check per finding | **Trial after 1.0** as a local pre-push step, pinned, not a required check |
| **Coding Ethos** | **Archived 2026-10-07**, AGPL, 6★ | **Do not adopt.** Rulesync + lefthook + our hooks cover the idea |
| **PR-Agent** | Community-maintained (The-PR-Agent), MIT, 14.2k★, active, supports Claude | **Skip.** A third AI reviewer brings back the comment noise |
| **Rulesync** | MIT, 1.6k★, very active (v43); one `.rulesync/` source → CLAUDE.md, AGENTS.md, skills, subagents, hooks, MCP for ~70 tools | **Adopt, Phase 0.** CI regenerates and runs `git diff --exit-code`, so instructions for different AI tools can never drift. Pin the version |
| **reviewdog** | MIT, 9.7k★; reads SARIF; `filter_mode: added`. Its setup action was compromised in March 2025 | **Adopt, Phase 0, presentation only.** Shows lint findings on changed lines; pass/fail stays with each tool. **Pin every Action to a commit SHA** |
| **zizmor** | Static analysis for GitHub Actions workflows: finds unpinned actions and injection risks | **Adopt, Phase 0, required check.** Pairs with pinning every Action to a commit SHA |
| **lefthook** | Git hooks manager; runs checks locally before commit and push | **Adopt, Phase 0.** Runs the same fast checks as CI, so failures show up before the push |
| **Changesets** | Drives package versions and changelog fragments from the PR | **Adopt, Phase 0.** Required for the on-demand semver releases (§10) |
| **ast-grep** | Structural code search and lint rules over the syntax tree | **Adopt as the fallback** for complex TSX rules that ESLint, Stylelint and Opengrep cannot express |

**Final CI stack:**
- **Required checks:** the role-registry, dispatcher-health and settings-in-prose checks (13–15), tsc, ESLint (incl. `jsx-no-literals`, `no-restricted-imports`), Stylelint, Opengrep, Knip, zizmor, the Rulesync drift check, design and locale checks, Vitest + Playwright behaviour tests (§9.3), Playwright visual regression.
- **Presentation:** reviewdog.
- **AI review:** the Claude Code Reviewer (second AI tool on standby). Its findings are advisory until classified; unresolved Critical/Important findings block G5a.

### 9.2 Messaging standard: how {{PROJECT_NAME}} talks to people

How the interface communicates in words: errors, warnings, confirmations, success, empty states, loading and help text. The **Technical Writer & Messaging Designer** owns it.

**Phase 0 inventory:** if content rules already exist (a copy-check script, an approved-verb list, a glossary), inherit them with a shrink-only baseline. If not, create them.

**Written standard in `docs/content/messaging.md`:** one pattern per message type, in every configured locale:

| Message type | Pattern | Example |
|---|---|---|
| Error | What happened + why (if known) + how to fix it. Never blame the user; no codes alone | "Couldn't save the record. The connection dropped. Try again." |
| Field validation | Say what's needed, beside the field, as soon as it's relevant | "Enter a date after the start date." |
| Warning / confirm destructive | Name the object and the consequence; the button repeats the verb | "Delete record 10234? Its 7 attachments are deleted too." → **Delete record** |
| Success | Short, past tense, with an undo when possible | "Record archived. Undo" |
| Empty state | What goes here + one action to fill it | "No items yet. Add an item" |
| Loading | Only when it takes over ~1 second; say what is loading | "Loading items…" |
| Help / tooltip | One sentence; never repeat the label | |

**Rules the checks enforce:**
- every component that can fail ships an error message with a fix
- no raw error codes or stack text shown to users
- the button in a confirmation dialog uses the same verb as the question
- every message key has an entry in every configured locale
- translations follow `docs/i18n/<locale>.md`
- one English variant, sentence case, an approved list of action verbs and inclusive language, enforced by a content check

**Sources:** jakub `better-writing`, ui-craft `clarify`, plugin87 `ux-writing`, and any existing content rules.

### 9.3 Behaviour tests: what each component must be tested for

Owned by the QA / Evidence Engineer; the Component Engineer writes the tests with the component, in the same PR. **A component with no behaviour test can't merge.** Tests use the component's stories as fixtures, so every story is also a test case.

**Which tool:**
- **Vitest + Testing Library** (fast, every PR): logic, props, events, ARIA attributes, formatting, i18n keys.
- **Playwright** (real browser, every PR for changed components): keyboard, focus, scrolling, pointer, measured layout, RTL.
- **axe** runs inside both, on every state.

**Baseline: every component**
1. Renders each story without errors or console warnings.
2. Every state in its state manifest (§9 check 9) can be reached and has the right ARIA (`aria-disabled`, `aria-invalid`, `aria-busy`, `aria-selected`, `aria-expanded`).
3. Disabled means no events fire and it can't be focused (or is `aria-disabled` and announced as such, per its spec).
4. Keyboard: test the expected keyboard behaviour for the native element or ARIA pattern (a link activates with Enter; a tablist has one Tab stop and arrow keys move between tabs), and that focus is visible.
5. Under `dir="rtl"` (if an RTL locale is configured): arrow keys and layout mirror correctly; icons that show direction flip, others don't.
6. Long text (3× the primary-locale length) and empty values don't break or overflow the layout.
7. No axe violations in any state.
8. All visible text comes from the catalog; switching locale changes it.

**By family** (on top of the baseline; apply to the components the project actually has)

| Family | Typical components | Must test |
|---|---|---|
| **Buttons & actions** | Button, SplitButton, CopyButton, DownloadButton, FloatingActionButton | Click fires once (no double submit while loading); loading state blocks clicks and is announced; SplitButton menu opens by keyboard; CopyButton confirms with a message |
| **Text inputs** | Input, NumberInput, SearchField, OtpInput, InlineEdit, InputGroup | Typing, paste, clear; controlled and uncontrolled; max length; NumberInput min/max/step, arrow keys, locale digits accepted; OtpInput paste fills all boxes; InlineEdit Esc cancels, Enter saves |
| **Choice inputs** | Checkbox, Radio, SegmentedControl, Slider, Rating | Click and keyboard select; indeterminate checkbox; radio arrow-key movement; Slider keys (arrows, PageUp/Down, Home/End) and RTL direction |
| **Pickers** | Combobox, Cascader, CountrySelect, TreeSelect, TransferList, DatePicker, TimePicker, Calendar | Open/close (click, Enter, Esc, outside click); type-ahead filtering; arrow movement; selection updates value; multi-select add/remove; "no results" message; DatePicker min/max, disabled dates, typed dates per locale, week start per locale; TimePicker 12/24h |
| **Forms** | Field, Fieldset, ErrorSummary, FileInput, DropZone | Label linked to input; error message linked by `aria-describedby`; ErrorSummary lists every error and focuses the field on click; file type/size limits give a message from §9.2; drag-and-drop and keyboard upload both work |
| **Overlays** | Dialog, Sheet, Popover, Tooltip, Menu, CommandMenu | Focus moves in on open and back on close; focus trapped in modal ones; Esc closes; scroll locked behind modals; Tooltip on hover and focus, not on touch-only; Menu arrow keys, type-ahead, submenus; destructive Dialog button uses the question's verb (§9.2) |
| **Navigation** | Tabs, Breadcrumbs, NavList, Pagination, Tree, ProgressSteps | Tabs arrow keys and `aria-selected`; current page marked (`aria-current`); Pagination first/last/out of range; Tree expand/collapse by keyboard, type-ahead |
| **Feedback** | Toast, Banner, Notice, EmptyState, Loading, ProgressBar, StatusDot | Toast announced by screen reader (`role=status` or `alert` by severity), pauses on hover/focus, undo works; dismiss works and is remembered where specified; progress values announced; EmptyState action works |
| **Data display** | Table, Pill/Tag, Metric, Count, Time, Timeline, VirtualList, List | Number, date and relative-time formatting per configured locale; tabular figures; pills in a row equal height (§9 check 11); VirtualList renders only visible rows and keeps focus while scrolling |
| **Editors & rich content** | RichTextEditor, CodeEditor, CodeBlock, Chat, StreamingText, MediaPlayer | Typing, undo/redo, formatting shortcuts; paste strips unsafe HTML; mixed-direction text keeps the right direction; StreamingText announces without flooding the screen reader; MediaPlayer keyboard controls and captions |
| **Layout & display only** | Stack, Divider, Card, Heading, Text, Icon, Image, Avatar, Badge, Kbd, VisuallyHidden, … | Baseline only, plus: Image alt text required; Avatar fallback initials (in every configured script); Tag removable by keyboard |

**Complex components get their own list.** A component that was reversed or rebuilt repeatedly in the past (typically the data grid) gets a dedicated test list written at spec time. For a data grid, at least:
- **Sorting:** click and keyboard; asc → desc → none; multi-column with Shift; stable sort; numbers, dates and every configured script sort correctly.
- **Filtering:** per column and global; clear all; "no results" message; filter + sort together.
- **Selection:** row, range (Shift), all-on-page vs all-rows; selection survives sort and filter.
- **Keyboard:** arrow keys move cell by cell; Home/End, Ctrl+Home/End, PageUp/Down; Enter edits, Esc cancels; Tab leaves the grid; arrows mirrored in RTL.
- **Columns:** resize (pointer and keyboard), reorder, hide/show, pin start/end (start = right in RTL); sticky header while scrolling.
- **Scale:** 10,000 rows scroll smoothly (within a set frame-time budget) and only visible rows are in the DOM.
- **Editing:** inline edit, validation message, save/cancel, no data lost on sort.
- **Density:** row heights match the density tokens.
- **Screen reader:** `role=grid`, row/column counts and indexes, sort state announced.

**Rules for the tests themselves**
- A bug fix comes with a test that fails before the fix.
- Tests check behaviour users see, not internal details, so refactors don't break them.
- A test that fails at random is quarantined with an owner within 24h, never deleted (§2 row 4).
- Coverage is reported in the CI summary per component (baseline ✓, family ✓, specific ✓), not as a single percentage.

---

## 10. Release pipeline

The pipeline is the same whatever `{{HOSTING}}` turns out to be; only the publish targets change.

| Step | What happens |
|---|---|
| Build | One build command produces the packages, the API files and the static site into a release folder named by version. Build output is never committed |
| Tag | A pushed tag `vX.Y.Z` triggers the CI **Release** workflow. A tag pushed automatically must be pushed with the App token (or end with a dispatch), because a tag pushed with `GITHUB_TOKEN` starts no workflow (§6.1). It checks the tag matches the package version, builds, publishes the `@{{prefix}}/*` packages, creates the GitHub release, and runs the live checks |
| Host | The same tagged run publishes to `{{HOSTING}}` (site, CDN/asset host, API) through a deploy job with a **scoped deploy key that no agent holds** |
| Pointers | An `index.json` lists every version; `latest.json` names the latest |

**Rules**
- **Immutable versions.** Publishing fails if the version already exists and its files differ. A published npm version cannot be reused, even after unpublishing.
- **Two kinds of recovery.** *Deployment failure:* restore the previous deployment or pointer. *Package-release failure:* keep the published versions, stop promotion, and publish a corrective version where needed. A retry verifies the artifacts already published; it does not republish them.
- **Versions.** An existing package continues its version history: choose the next valid version. 1.0.0 is for a genuinely new package or namespace.
- **One tag publishes everything:** packages, hosted files and API carry the same version.
- **Checksums.** Every version ships `SHA256SUMS` and `version.json` at its root; the live check fails if they are missing.
- **Bundle-size budgets** per entry point; per-component imports where the bundle would otherwise exceed the budget.
- **If `{{HOSTING}}` is not yet defined:** the pipeline runs as a dry-run (build, checksums, budgets, local smoke test). G8 does not pass, and no live release happens, until D-004 is answered.
- **No custom tooling unless absolutely necessary.** Prefer off-the-shelf build, token and test tools (a standard bundler, a token transformer, Storybook, Playwright, Vitest, Changesets).

**Application profile.** Nothing is published to consumers. A merge deploys to staging; a tag deploys to production: backup → build → migrate → restart → health and live checks. On failure the previous deployment is restored automatically when the previous build can run on the migrated database. Otherwise the tested recovery procedure is run; restoring a pre-deploy backup can discard writes received after the deployment, so that is a recorded decision, not an automatic step. G8 then means "deployed and verified live". Staging and CI screenshots use synthetic data only, never real data.

---

## 11. Environment

| Item | Setting |
|---|---|
| GitHub repo | `{{GITHUB_REPO}}` (organisation `{{GITHUB_ORG}}` where used); one GitHub App with fine-grained permissions (one bot identity; roles are told apart by label and signature); branch protection + required checks on `main`; merge queue where the account supports it (required workflows also trigger on `merge_group`), otherwise auto-merge behind the required checks |
| Repo layout | Monorepo (no submodules); trunk-based |
| Agent host | The launcher and the poller, run as systemd user services (linger enabled), plus the optional self-hosted runner (private repository only). Each session starts as a transient unit with the memory limit from the registry and exits when its lane is empty: **no always-open sessions**. Slots, timeouts and buffers are settings in `agents.config.yaml` (§5.1) |
| Publishing | Published by CI on tag only (§10); publish fails if the version exists |
| API | Read-only, versioned (`/api/v1/`), with an OpenAPI spec + contract tests + breaking-change diff |
| Packages | `@{{prefix}}/tokens`, `icons`, `styles`, `react`; Changesets drive versions; one version across npm/hosted files/API; optional `@{{prefix}}/locales` |
| Permissions | Agents run with **bypass permissions and full autonomy** on the agent host: push, self-merge, migrations, live deploys. Credentials sit in the CI and deploy jobs that agents trigger. The safety nets in §7 (backups, rollback, own-worktree cleanup, required checks) replace human approval |
| Old team (Existing mode only) | **Cutover:** tag the final state of the old team and process, stop it, and remove its cron lines and boot scripts too, or a reboot restarts it. This is done **before** the new team writes to the repository |

### 11.1 Owner setup checklist

Some steps only the owner can do. Phase 0 posts this checklist on the intake issue. None of them blocks the work: each has a degraded mode that is used until it is done.

| Item | Needed for | Owner action | Until it is done |
|---|---|---|---|
| GitHub App | One bot identity, and the installation token that makes hand-offs wake the next role (§6.1) | Create the app and install it on `{{GITHUB_REPO}}`. A bot per role needs an App per role and is optional | Every comment is signed `— <role>`; hand-offs fall back to explicit dispatch calls |
| Self-hosted runner *(optional)* | Waking agents within seconds instead of at the next poll | Give the agent host and register the runner (a registration token from the repository settings); private repository only | Mode P: the poller wakes agents every `heartbeat_min` (§6.1) |
| Merge queue | Serial merges | Needs an organization account; add the `merge_group` trigger to every required workflow | Auto-merge behind the required checks |
| Cross-repository triggers and secrets | Telling another repository about a release or a failed upgrade | Add the secrets; the token needs write access to the target for dispatch events | A scheduled check picks the change up later |
| Staging (Application profile) | Deploy on merge | Create the staging environment, database and DNS | Production-only deploys on tag; no staging until it exists |
| Old team (Existing mode) | A clean cutover | Stop the previous team and its cron and tmux lines | **Blocks the new team's write activity.** The new team may read and plan, but does not write until the old team is stopped |
| Hosting (`{{HOSTING}}`) | G8 | Decide where the site, packages and assets live | Dry-run releases only (§0 Q5) |

---

## 12. Decision register

Decisions are recorded in `decisions.yaml` with date, reason and enforcing check (§8).

### Intake decisions (§0)

| # | Decision | Answer |
|---|---|---|
| D-001 | Mode, project type, name and prefix (answering the intake authorizes Phase 0) | `{{MODE}}` / `{{PROFILE}}` / `{{PROJECT_NAME}}` / `{{PREFIX}}` |
| D-002 | Design system (**locked**) | `{{DESIGN_SYSTEM}}` |
| D-003 | GitHub repository | `{{GITHUB_REPO}}` |
| D-004 | Hosting | `{{HOSTING}}` (or "open") |

### Foundation decisions (asked after intake, in one batched card with a recommendation and a default each)

Defaults come from the locked design system (D-002). Each answer is recorded with its enforcing check.

| # | Decision | Question | Answer |
|---|---|---|---|
| D-005 | Design language | Adopt `{{DESIGN_SYSTEM}}` as defined, or record specific overrides? (The look is the baseline; agents fix defects only) | ____ |
| D-006 | Repo structure | New monorepo, or fold an existing repo in? (New mode: monorepo) | ____ |
| D-007 | Second AI tool | Standing team member, on standby, or none? | ____ |
| D-008 | Release cadence | On demand once all checks pass, or scheduled? | ____ |
| D-009 | Corners | Radius scale and pill radius | ____ |
| D-010 | Type | Typefaces, minimum size, number font | ____ |
| D-011 | Density | Which density modes ship (compact / standard / comfortable)? | ____ |
| D-012 | Accent | Accent colour use and whether theming is in scope | ____ |
| D-013 | Dark mode | In scope? Contrast rules | ____ |
| D-014 | Table pills | Pill style and sizing in data display | ____ |
| D-015 | Icons | Icon set | ____ |
| D-016 | Locales | Primary locale; additional locales; RTL in scope? Review workflow: every new translated word goes to the owner as a proposal file, and only the owner's answer goes into the catalog | ____ |
| D-017 | Mobile scope | In scope for 1.0, or deferred? | ____ |
| D-018 | Product goals | The 3–5 outcomes the master plan is built around (asked once, only if the intake and the repo do not answer it) | ____ |
| D-019 | Dispatcher mode and kit | Mode P (poller, default) or add the optional self-hosted runner (mode R)? Which token makes hand-offs: the GitHub App installation token (default) or a personal access token? Where is the dispatcher kit and which version is pinned? | ____ |

**What "keep as defined" means for the team:** the current definitions are the baseline. Agents may fix defects inside them (contrast below AA, wrapping, uneven heights, sizes below the minimum) without asking. They may not change the look itself without a new owner decision.

---

## 13. Sources

**Reference sources reviewed**
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

---

## Appendix A. Seed lessons

Phase 0 copies these into `docs/lessons.md`. They come from two earlier projects (a design-system library and an application built on it). Each costs real rework when ignored. Add a line whenever a mistake costs a review round, a failed deploy or a reverted merge.

| # | What went wrong | Rule now |
|---|---|---|
| A-01 | Two engineers built the same issue; one finished PR was thrown away | Claim before building: comment "claiming" and check for an open PR that mentions the issue; the first claim wins |
| A-02 | A required check was blocked by its own cancelled run | Required checks never use `cancel-in-progress` |
| A-03 | `check \| tee log` hid failures and a broken upgrade nearly merged | Workflows use `bash` with `pipefail`; a second guard re-verifies before commit |
| A-04 | Agent reports said DONE without proof | A report is a claim until `git log`, the diff and the checks confirm it |
| A-05 | A claim about the repo was made from a stale local clone | Check `origin/main` before claiming anything about the repo |
| A-06 | A late, large merge silently dropped controls | Integrate small and often; before resolving a shared file, list what each side added and confirm both survived |
| A-07 | Owner choices were never written down, so layouts and icons flip-flopped | Every choice is a decision with an enforcing check; an unrecorded reversal fails G5b |
| A-08 | `main` had no branch protection and stayed red for weeks | Required checks on `main` from day one; a red `main` is an S1 bug |
| A-09 | Two agent teams worked with different rules | One team, one rulebook; GitHub is the only channel |
| A-10 | The owner was re-asked after each answer and each answer ran as its own chain | The owner's answer is final: act on the sensible reading, say it in one line, handle all answers in one pass, refresh the dashboard once |
| A-11 | The owner pointed at a working example and a different one was built | When the owner points at a working example, ship that example first, then improve it |
| A-12 | A queued PR's branch is locked; a "pushed" report was wrong | Check the push result before reporting; dequeue first, push, then re-queue |
| A-13 | A PR merged with an open gate change because the label arrived after it entered the queue | When adding a "changes requested" label, look at the merge queue first and dequeue the PR if it is there |
| A-14 | Test fixtures were hand-trimmed and hid missing fields | Fixtures come from, or are checked against, the contract files |
| A-15 | A dependency upgrade removed a file that string-only tests missed | Upgrades fetch every referenced file before merging |
| A-16 | The config said 8 slots while the plan and instruction file said 4 | Settings live only in the registry; documents link to it (check 15) |
| A-17 | A label, a tag or a card move made by an agent started no workflow, so the next role never woke | Events caused by `GITHUB_TOKEN` start no workflows (except `workflow_dispatch` and `repository_dispatch`). Hand-offs use the GitHub App token or an explicit dispatch (check 16) |

