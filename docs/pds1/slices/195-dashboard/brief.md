# Brief: PDS 1.0 dashboard, built like the CTM 3.0 dashboard (#195)

Owner: pds1-product-lead. Builder: pds1-release-architect (P0-13, 2-day time box). Decision: D-0034.

## Goal

The owner opens one dashboard and sees what PDS needs from him, what the team is doing and what is done. He answers a decision in place, and the answer lands on the GitHub issue under his name. It looks and works like the CTM 3.0 dashboard he already uses.

## Known, inferred, unknown

| | What |
|---|---|
| Known (owner's screenshot of the CTM 3.0 dashboard, 2026-11-05) | Side navigation with counts: Overview, To decide, To do, Decisions, Done, Checks, Team, Screenshots. "To decide" is a table (Decision, Question, Status) with a detail pane: id and question, an "Applied for now" status badge, a link to the issue, the context, an "Applied for now: A" callout, the options as radio buttons (A Recommended, B, Other) with their risks, an optional note, and "Connect GitHub once to answer here". The last one uses a fine-grained key: resource owner, one repository, Issues read and write, nothing else; the key stays in the dashboard. It runs as a Claude artifact. |
| Inferred | The dashboard reads GitHub live (issues, labels, `decisions.yaml`, check runs). An answer posts a comment on the decision issue, and the Product Lead applies it (§6 feedback register). |
| Unknown | Where the CTM dashboard's source lives. We asked on LighthouseCollection/CTM#40. This doesn't block: the layout above is enough to build from. |

## P0

- The same sections, counts and "To decide" detail pane as CTM, for `plenix-ds/pds`.
- To decide: open issues labelled `decision` whose card applied an option the owner hasn't confirmed yet.
- To do: open issues with an `agent:*` label, by severity. Done: issues closed in the last 30 days, with the PR and release links.
- Decisions: every `decisions.yaml` entry, showing id, date, area, decision, decided by, status, and the enforcing check with its latest result on `main`.
- Answering: the owner's answer (A, B or Other, plus a note) posts as a comment on the decision issue, with his own fine-grained key. The key is scoped to plenix-ds/pds, Issues read and write only.
- The interface is built from Plenix components and tokens from the CDN, with no styles of its own.

## P1

- Checks: the required CI checks on `main`, with pass/fail and links.
- Screenshots: the visual-check screenshots of recent PRs (plan §6a Visual checks).
- Team: each `pds1-*` role, with what it's working on (from `agent:*` labels and open PRs).
- Overview: the counts above, plus the latest Daily summary (#179).

## P2

- The generated read-only page at `design-system.lighthouseway.org/decisions/` (plan §6a), once publishing is back on.

## Non-goals

- No backend and no data store of its own. GitHub stays the only source (D-0015).
- No token, key or password in the repo or in CI. The owner's key lives only in his browser storage for the dashboard.
- No answering for anyone but the owner. The dashboard doesn't merge, release or change labels.
- No mobile layout work (D-0013).

## Affected packages

None of the published packages. New: the dashboard source (`dashboard/pds1/`) and its data script. It reads `decisions.yaml`.

## Acceptance

- **AC-1** Given an open `decision` issue with an applied option, when the owner opens "To decide", then it shows with its id, question and status "Applied for now", and the side navigation count includes it.
- **AC-2** Given the owner picks B and writes a note, when he sends it, then a comment with his choice and note appears on that issue under his GitHub name, and nothing else changes in the repo.
- **AC-3** Given no key is connected, when the owner opens a decision, then he can read everything and sees "Connect GitHub once to answer here", with the exact key settings: one repository, Issues read and write.
- **AC-4** Given `decisions.yaml` on `main`, when the owner opens Decisions, then every entry shows, with its check and the latest result or the reason it's review-only.
- **AC-5** Given an issue closed in the last 30 days, when the owner opens Done, then it shows with its PR link.
- **AC-6** Given the dashboard source, when `check-style`/Stylelint runs, then it finds no own colors, inline styles or `!important`, because the dashboard uses Plenix components and tokens only.

## Already implemented

- `dashboard/` (0.x status page: `dashboard.jsx`, `main.jsx`, `index.html`). This is the old team's page; reuse its parts where they fit.
- `decisions.yaml`, the issue labels and the pinned Daily summary #179.

## Anything unclear

None open. The CTM source location (Unknown above) is nice to have and doesn't block the build.
