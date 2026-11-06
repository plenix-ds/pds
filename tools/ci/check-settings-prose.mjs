#!/usr/bin/env node
// Check 15, settings in prose (template v2.4 §5.1 rule 4, §9; #768): no document states a value of an agents.config.yaml
// setting that differs from the file. Documents name the setting (`long_work.max_running`) instead of quoting it.
// Scans the instructions (CLAUDE.md, AGENTS.md, .rulesync/rules, .claude/agents), docs/pds1 (but not the template,
// whose skeleton holds the defaults) and the root plans.
//   node tools/ci/check-settings-prose.mjs
import fs from 'node:fs';
import path from 'node:path';
import { load, flattenSettings, settingsInProse } from '../../deploy/agents/registry.mjs';

const files = ['CLAUDE.md', 'AGENTS.md', 'ONBOARDING.md', 'docs/MASTER_PLAN.md'].filter((f) => fs.existsSync(f));
const walk = (dir, skip) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name).split(path.sep).join('/');
  if (skip.some((s) => p.startsWith(s))) return [];
  return e.isDirectory() ? walk(p, skip) : (p.endsWith('.md') ? [p] : []);
}) : []);
files.push(...walk('.rulesync/rules', []), ...walk('.claude/agents', []), ...walk('docs/pds1', ['docs/pds1/template', 'docs/pds1/slices']));
let settings;
try { settings = flattenSettings(load('agents.config.yaml')); } catch (e) { console.log(`SETTINGS_PROSE_FAIL: ${e.message}`); process.exit(1); }
const found = settingsInProse(Object.fromEntries(files.map((f) => [f, fs.readFileSync(f, 'utf8')])), settings);
for (const m of found) console.log(`::error file=${m.file},line=${m.line}::states ${m.setting} as ${m.stated}; agents.config.yaml says ${m.value}. Name the setting instead of its value (check 15)`);
if (found.length) { console.log(`SETTINGS_PROSE_FAIL (${found.length})`); process.exit(1); }
console.log(`SETTINGS_PROSE_OK (${Object.keys(settings).length} settings, ${files.length} documents)`);
