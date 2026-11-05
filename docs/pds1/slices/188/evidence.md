# Evidence: #188 (P0-6), Rulesync and lefthook

| Item | Status | Path / output |
|---|---|---|
| Rulesync pinned to a release older than a week | Ran | 43.2.0 (2026-10-27); latest 43.6.2 was 1 hour old (plan §7: Saguaro malware case) |
| Round trip: `.rulesync/rules/overview.md` → CLAUDE.md | Ran | `npx -y rulesync@43.2.0 generate`: CLAUDE.md byte-identical; AGENTS.md now equals it (only its title line changed) |
| Drift detection | Ran (scratch repo) | Appending a line to AGENTS.md → `generate --check` exit 1; clean → exit 0 |
| `generate --check` on this branch | Ran | exit 0 |
| zizmor on the new CI job | Ran | No findings |
| `lefthook.yml` | Ran | `npx -y lefthook@2.2.2 validate`: All good |
| lefthook installed for the shared git dir | Planned | After merge: `npx -y lefthook@2.2.2 install` (all worktrees share one `.git`), announced on #188 |
| CI "Rulesync drift" job | Planned | This PR's run |
