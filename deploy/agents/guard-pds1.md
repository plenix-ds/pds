# Guard exception for PDS1 sessions (#208)

- `~/team/guard.js` on VM 131 is the shared tool guard; it lives outside the repo.
- `guard-pds1.patch` is the PDS 1.0 exception: sessions with `PDS1_ROLE=pds1-*` may merge their own PRs (D-0014); the main ruleset with the required `CI result` is the gate.
- Still blocked for PDS1 while the owner's 2026-10-29 publishing hold stands: GitHub releases, the release and deploy scripts, tag pushes, direct pushes to main.
- A rebuilt VM applies it from the home folder with `patch -p1 < <repo>/deploy/agents/guard-pds1.patch`. `team.sh` already sets `PDS1_ROLE` for each session.
- Lifting the hold: delete the `held` list in the patch, by PR.
