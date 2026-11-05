// Check 9 (plan §7): every component declares a state manifest, checked against its stories.
//   node tools/checks/states/states.mjs [baseRef]
// The states come from DESIGN.md front matter (`states: [...]`). A manifest maps each state to a token list or
// `n/a(reason)`. A state with tokens needs a story of that name. Diff-aware: with a base ref, only components whose
// folder the diff touches must have a manifest entry; old debt does not block.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');

function readStates() {
  const m = fs.readFileSync(path.join(root, 'DESIGN.md'), 'utf8').match(/^states:\s*\[([^\]]+)\]/m);
  if (!m) throw new Error('DESIGN.md front matter has no `states:` list');
  return m[1].split(',').map((s) => s.trim());
}
export const STATES = readStates();

const NA = /^n\/a(?:\((.*)\))?$/s;

// manifest: { Component: { state: [tokens] | 'n/a(reason)' } }; stories: { Component: [story names] }
export function checkStates(manifest, stories = {}) {
  const out = [];
  for (const [name, states] of Object.entries(manifest)) {
    for (const s of Object.keys(states)) if (!STATES.includes(s)) out.push(`${name}: unknown state "${s}"`);
    for (const s of STATES) {
      const v = states[s];
      if (v === undefined) { out.push(`${name}: state "${s}" is missing (give tokens, or n/a(reason))`); continue; }
      if (typeof v === 'string') {
        const m = v.match(NA);
        if (!m) out.push(`${name}: state "${s}" must be a token list or n/a(reason)`);
        else if (!(m[1] || '').trim()) out.push(`${name}: n/a for "${s}" needs a reason`);
        continue;
      }
      if (!Array.isArray(v) || !v.length) { out.push(`${name}: state "${s}" has no tokens`); continue; }
      if (!(stories[name] || []).includes(s)) out.push(`${name}: state "${s}" has no story`);
    }
  }
  return out;
}

// stories: platform/components/<Name>/*.stories.* ; a story exports/names a state as `<State>` (e.g. `export const Hover`)
function readStories(dir) {
  const out = {};
  const base = path.join(dir, 'platform/components');
  if (!fs.existsSync(base)) return out;
  for (const name of fs.readdirSync(base)) {
    const d = path.join(base, name);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter((f) => /\.stories\.[jt]sx?$/.test(f))) {
      const text = fs.readFileSync(path.join(d, f), 'utf8');
      for (const m of text.matchAll(/export\s+const\s+([A-Z]\w*)/g)) {
        const s = m[1][0].toLowerCase() + m[1].slice(1);
        (out[name] ||= []).push(s);
      }
    }
  }
  return out;
}

function changedComponents(base) {
  const files = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: root, encoding: 'utf8' }).split('\n');
  return [...new Set(files.map((f) => f.match(/^platform\/components\/([^/]+)\//)?.[1]).filter(Boolean))];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(fs.readFileSync(path.join(here, 'manifest.json'), 'utf8'));
  const base = process.argv[2];
  const errors = checkStates(manifest, readStories(root));
  if (base) for (const c of changedComponents(base)) if (!manifest[c]) errors.push(`${c}: changed in this PR but has no state manifest (tools/checks/states/manifest.json)`);
  for (const e of errors) console.error('states: ' + e);
  console.log(`states: ${Object.keys(manifest).length} manifests, ${errors.length} findings`);
  process.exit(errors.length ? 1 : 0);
}
