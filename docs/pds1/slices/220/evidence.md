# Evidence: #220, wake idle sessions (step 1, timer)

| Item | Status | Path / output |
|---|---|---|
| `team.sh` parses | Ran | `bash -n deploy/agents/team.sh`: OK |
| Idle detection on the live team | Ran | `NUDGE_DRY=1 NUDGE_IDLE_S=30 team.sh nudge` on VM 131 (2026-11-05 ~09:25 UTC): would nudge product-lead, delivery-lead; skipped design-director, ds-architect, release-architect (each showed "esc to interrupt") |
| Input-box check | Ran | First dry run nudged 0: the box shows "❯" + U+00A0; fixed by stripping c2 a0 |
| Timer installed and firing | Planned | After merge: copy units, `systemctl --user enable --now pds1-nudge.timer`, then `~/pds1/team.log` "nudge:" lines |
| Webhook pickup (plan §5a) | Planned | Step 2 of #220 |
| shellcheck | Skipped | Not installed on VM 131 |
