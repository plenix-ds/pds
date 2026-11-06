#!/usr/bin/env node
// Check 13, role registry (template v2.4 §5.1, §9; #768): every role in agents.config.yaml has a definition file, its
// work-item label (on GitHub too) and at least one trigger; a parked role needs only its entry and definition; every role
// described in CLAUDE.md's team table and every .claude/agents/pds1-*.md has an entry.
//   node tools/ci/check-roles.mjs        (GH_TOKEN reads the repo's labels; a failed lookup is a FAIL, never a skip)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { load, checkRoles, roles } from '../../deploy/agents/registry.mjs';

let reg;
try { reg = load('agents.config.yaml'); } catch (e) { console.log(`ROLES_FAIL: ${e.message}`); process.exit(1); }
let labels;
try {
  labels = new Set(JSON.parse(execFileSync('gh', ['label', 'list', '-R', process.env.GITHUB_REPOSITORY || 'plenix-ds/pds', '--limit', '1000', '--json', 'name', '-q', '[.[].name]'], { encoding: 'utf8' })));
} catch (e) { console.log(`ROLES_FAIL: could not read the repo's labels: ${String(e.message).split('\n')[0]}`); process.exit(1); }
const definitions = fs.readdirSync('.claude/agents').filter((f) => /^pds1-.+\.md$/.test(f)).map((f) => f.slice(0, -3));
const described = [...new Set(fs.readFileSync('CLAUDE.md', 'utf8').split('\n').filter((l) => l.startsWith('|'))
  .flatMap((l) => [...l.matchAll(/`(pds1-[a-z0-9-]+)`/g)].map((m) => m[1])))];
const errors = checkRoles(reg, { exists: (f) => fs.existsSync(f), labels, definitions, described });
for (const e of errors) console.log(`::error title=role ${e.id}::${e.message} (agents.config.yaml roles, check 13)`);
if (errors.length) { console.log(`ROLES_FAIL (${errors.length})`); process.exit(1); }
const list = roles(reg);
console.log(`ROLES_OK (${list.length} roles, ${list.filter((r) => r.parked).length} parked; ${described.length} described in CLAUDE.md)`);
