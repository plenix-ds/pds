#!/usr/bin/env node
// SessionStart: reminds every PDS session what to load first (PDS2 team, dispatch kit; D-0174).
process.stdout.write(
  'PDS session. Before working, read .agents/RULES.md (the team\'s rules), then docs/project-rules.md, ' +
  'CLAUDE.md and docs/lessons.md. G2 and G3 verdicts keep the sign-off line the "G2 (design review)" check reads ' +
  '("— PDS1-Design-Director" or "— PDS1-DS-Architect") above your own signature.\n'
);
