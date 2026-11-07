#!/usr/bin/env node
// The next free decision id (#955): one past the highest D-NNNN on main (decisions.d/ and decisions.yaml) and in every
// open pull request (a decisions.d/D-NNNN.yaml it adds, or a "- id: D-NNNN" line it adds to decisions.yaml).
// Read-only: it fetches origin/main and reads the open PRs with the gh login. Save the decision as decisions.d/<id>.yaml.
//   node tools/decision-id.mjs            prints D-NNNN, and the ids the open PRs hold, on stderr
import { execFileSync } from 'node:child_process';

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] });
const ids = new Set();
const take = (text) => { for (const m of text.matchAll(/\bD-(\d{4})\b/g)) ids.add(Number(m[1])); };

run('git', ['fetch', '-q', 'origin', 'main']);
try { for (const l of run('git', ['show', 'origin/main:decisions.yaml']).split('\n')) if (/^- id:/.test(l)) take(l); } catch { /* folded */ }
try { take(run('git', ['ls-tree', '--name-only', 'origin/main', 'decisions.d/'])); } catch { /* not yet */ }
const onMain = Math.max(0, ...ids);

const held = [];
const prs = JSON.parse(run('gh', ['pr', 'list', '--state', 'open', '--limit', '200', '--json', 'number,files']));
for (const pr of prs) {
  const files = (pr.files || []).map((f) => f.path);
  for (const f of files) { const m = /^decisions\.d\/(D-\d{4})\.yaml$/.exec(f); if (m) { take(m[1]); held.push(`#${pr.number} ${m[1]}`); } }
  if (files.includes('decisions.yaml')) {
    for (const l of run('gh', ['pr', 'diff', String(pr.number)]).split('\n')) {
      const m = /^\+- id:\s*(D-\d{4})/.exec(l);
      if (m) { take(m[1]); held.push(`#${pr.number} ${m[1]}`); }
    }
  }
}
const next = `D-${String(Math.max(0, ...ids) + 1).padStart(4, '0')}`;
console.error(`highest on main: D-${String(onMain).padStart(4, '0')}; held by open PRs: ${held.join(', ') || 'none'}`);
console.log(next);
