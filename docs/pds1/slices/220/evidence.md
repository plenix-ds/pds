# Evidence: #220, wake idle sessions (step 1, timer)

| Item | Status | Path / output |
|---|---|---|
| `team.sh` parses | Ran | `bash -n deploy/agents/team.sh`: OK |
| Idle detection on the live team | Ran | `NUDGE_DRY=1 NUDGE_IDLE_S=30 team.sh nudge` on VM 131 (2026-11-05 ~09:25 UTC): would nudge product-lead, delivery-lead; skipped design-director, ds-architect, release-architect (each showed "esc to interrupt") |
| Input-box check | Ran | First dry run nudged 0: the box shows "❯" + U+00A0; fixed by stripping c2 a0 |
| Timer installed and firing | Planned | After merge: copy units, `systemctl --user enable --now pds1-nudge.timer`, then `~/pds1/team.log` "nudge:" lines |
| Webhook pickup (plan §5a) | Planned | Step 2 of #220 |
| shellcheck | Skipped | Not installed on VM 131 |

## Step 2: event pickup (D-0041)

| Item | Status | Path / output |
|---|---|---|
| Webhooks to VM 131 | Blocked (owner) | No inbound route (`INFRA-HANDOVER.md`: "the VM is not reachable from the internet, so webhooks need a proxy route"); the gh token has no `admin:repo_hook` scope for `gh webhook forward` |
| `team.sh wake` exit codes | Ran | no window → 4; `component-engineer` (a name prefix) → 4; a busy session → 3 |
| Refactored nudge | Ran (dry) | `NUDGE_DRY=1 team.sh nudge`: scheduler plan, then "nudged 0" (every session busy) |
| Event feed shape | Ran | `IssueCommentEvent` carries issue labels and the comment body; `PullRequestEvent` is trimmed to {id, number, url, head, base}, so the PR is read; event ids are not ordered by time, so pickup keeps the ids it has seen |
| Routing on the live feed | Ran (`PICKUP_DRY=1`) | the last 15 events: unlabeled PR openings, pushes and branch events are ignored; the comment on #4 signed "— PDS1-Component-Engineer-1" does not wake its own author |
| Routing fixtures | Ran | "@pds1-release-architect …— PDS1-Product-Lead" → release-architect; "Fixed. — PDS1-Component-Engineer-1" → nobody; an unsigned comment → product-lead; a self-mention → nobody |
| Service running and a real wake | Ran | `pds1-pickup` active since 12:18 UTC; 12:24:35 "pickup: woke ds-architect: 2 event(s)" (Product Lead comments on #87 and #265, held while it was busy); the pane shows the message |

## True webhooks (2026-11-06)

| Item | Status | Path / output |
|---|---|---|
| `admin:repo_hook` granted | Ran | `gh auth status`: scopes include `admin:repo_hook` (owner, 2026-11-06) |
| `gh webhook forward` works without an inbound route | Ran (live, 45 s) | `--events=pull_request` to stdout; toggling a label on merged #391 delivered `labeled` and `unlabeled` within seconds; the temporary hook was removed on exit (`gh api …/hooks` empty) |
| Listener routes a comment once | Ran (local test instance, fake team.sh, port 8796) | the same `issue_comment` posted twice → one `wake design-director` |
| Failed G2 run by webhook | Ran (same) | `workflow_run` completed/failure, name G2 → no wake |
| Feed fallback kept, no double delivery | Ran (review) | `once()` keys shared by both paths: comment id, review id, workflow run id, issue action |
| Live: pds1-webhook + pickup listener | Planned | After merge: install the unit, restart pds1-pickup, then a real comment wakes its session within seconds |
