#!/usr/bin/env node
// PreToolUse guard: blocks edits to a few protected files, even on bypass.
// Exit code 2 blocks the tool call and shows stderr to the agent.
const fs = require('fs');

let data;
try { data = JSON.parse(fs.readFileSync(0, 'utf8')); } catch { process.exit(0); }

const ti = data.tool_input || {};
const path = String(ti.file_path || ti.notebook_path || '').replace(/\\/g, '/');
if (!path) process.exit(0);

const rules = [
  [/\/docs\/pds1\/plan\.md$/, 'docs/pds1/plan.md is the owner-approved delivery system. Open a GitHub issue to propose a change.'],
  [/\/docs\/i18n\/arabic\.md$/, 'docs/i18n/arabic.md is the owner-approved Arabic standard. Propose changes on a GitHub issue (pds1-i18n-engineer).'],
  [/\/docs\/legacy\//, 'docs/legacy/ is retired 0.x history. Read it; do not edit it.'],
];

for (const [re, msg] of rules) {
  if (re.test(path)) {
    process.stderr.write(`BLOCKED by PDS1 guard: ${msg}\nPath: ${path}\n`);
    process.exit(2);
  }
}
process.exit(0);
