#!/usr/bin/env node
// SessionStart: reminds every PDS1 session what to load first.
const role = process.env.PDS1_ROLE || 'unknown role';
process.stdout.write(
  `PDS1 session (${role}). Before working: read CLAUDE.md ("Rules for every role"), ` +
  `docs/lessons.md, and your open GitHub issues: ` +
  `gh issue list -R plenix-ds/pds --label agent:${role} --state open. ` +
  `Concurrency limits: agents.config.yaml. Sign GitHub comments "— PDS1-<Role>".\n`
);
