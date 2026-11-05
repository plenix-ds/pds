# Evidence: #246 (S1), start waiting roles automatically

| Item | Status | Path / output |
|---|---|---|
| Syntax | Ran | `bash -n deploy/agents/team.sh`, `node --check deploy/agents/scheduler.mjs`: OK |
| Live team, all slots used | Ran (VM 131, dry) | `NUDGE_DRY=1 team.sh schedule`: "waiting component-engineer 2 / technical-writer / i18n-engineer: no long-work slot (4/4)" |
| One free slot | Ran (dry, `NUDGE_MAX_LONG=5`) | "would start component-engineer 2" (S2 outranks the S3 roles) |
| Done-when: i18n Engineer starts | Ran (dry, `NUDGE_MAX_LONG=7`) | "would start component-engineer 2", "would start technical-writer", "would start i18n-engineer" (order: severity, then oldest issue) |
| Memory floor | Ran (dry, `NUDGE_FREE_GB=3`) | all three held: "memory 3.0 GB free, needs 2 GB after a 1.5 GB session" |
| Stop rule | Ran (throwaway tmux session `pds1test`, scratch worktrees) | idle `design-critic` with no issue and no PR → "stop design-critic"; `i18n-engineer` (open issues) kept; freed slot reused; with the 30-minute default nothing just started is stopped |
| A real timer run starts a role and posts on #178 | Planned | After merge, the first run with a free slot (`~/pds1/team.log` "schedule: started") |
