#!/usr/bin/env node
// Traceability (plan §7 "Borrowed from CTM": check_slice_trace; #197). Every acceptance ID in a slice's brief must appear
// in its tests and, before merge, in its evidence.
//
//   node tools/ci/check-trace.mjs <base ref>          (the PR's merge base; CI passes it)
//
// A slice is docs/pds1/slices/<issue>-<name>/ (or <issue>/) with a brief.md that lists acceptance criteria as **AC-<n>**.
// Diff-aware: a slice is checked only when this PR changes its tests or its evidence (an implementation PR). A PR that
// only writes or edits the brief is not checked: tests come later.
// - Its tests: files under tests/ or platform/ named *-<issue>.test.* (or .spec.*), or whose first 15 lines name
//   "issue <issue>" or "#<issue>". Each AC ID must appear in one of them.
// - Its evidence: docs/pds1/slices/<slice>/evidence.md and every file under evidence/. Each AC ID must appear there too.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const base = process.argv[2];
if (!base) { console.error('usage: check-trace.mjs <base ref>'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
const SLICES = 'docs/pds1/slices';
const slices = fs.existsSync(SLICES) ? fs.readdirSync(SLICES).filter((d) => /^\d+(-|$)/.test(d) && fs.existsSync(path.join(SLICES, d, 'brief.md'))) : [];
const issueOf = (d) => d.match(/^(\d+)/)[1];

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'vendor', 'design-system', 'dist'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p.split(path.sep).join('/'));
  }
  return out;
};
const testFiles = [...walk('tests'), ...walk('platform')].filter((f) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(f));
const head15 = (f) => fs.readFileSync(f, 'utf8').split('\n').slice(0, 15).join('\n');
const testsFor = (n) => testFiles.filter((f) => new RegExp(`[-_.]${n}\\.(test|spec)\\.`).test(f) || new RegExp(`(issue ${n}\\b|#${n}\\b)`).test(head15(f)));
const evidenceFor = (d) => walk(path.join(SLICES, d)).filter((f) => /\/evidence(\.md$|\/)/.test(f));

const errors = [];
let checked = 0;
for (const d of slices) {
  const n = issueOf(d);
  const tests = testsFor(n);
  const evidence = evidenceFor(d);
  const touched = changed.some((f) => tests.includes(f) || evidence.includes(f) || f.startsWith(`${SLICES}/${d}/evidence`));
  if (!touched) continue;
  const ids = [...new Set([...fs.readFileSync(path.join(SLICES, d, 'brief.md'), 'utf8').matchAll(/\*\*(AC-\d+)\*\*/g)].map((m) => m[1]))];
  if (!ids.length) continue;
  checked++;
  const has = (files, id) => files.some((f) => new RegExp(`\\b${id}\\b`).test(fs.readFileSync(f, 'utf8')));
  for (const id of ids) {
    if (!has(tests, id)) errors.push(`${d}: ${id} is in brief.md but in no test for #${n} (${tests.length ? tests.join(', ') : `no test named *-${n}.test.* or naming "issue ${n}"`})`);
    if (!has(evidence, id)) errors.push(`${d}: ${id} is in brief.md but not in its evidence (${SLICES}/${d}/evidence.md or evidence/): report it as Ran / Skipped / Planned / Manual`);
  }
}

if (errors.length) {
  for (const e of errors) console.log(`::error title=traceability::${e}`);
  console.log(`TRACE_FAIL (${errors.length} gap${errors.length > 1 ? 's' : ''} in ${checked} slice${checked > 1 ? 's' : ''} this PR implements)`);
  process.exit(1);
}
console.log(`TRACE_OK (${checked} slice${checked === 1 ? '' : 's'} checked; ${slices.length} with a brief)`);
