#!/usr/bin/env node
// The behavior tests in CI (#1327): tests/run.js on every PR and in the merge group (changed mode, ci.yml "Behavior tests"),
// and every page nightly (--full, tests-nightly.yml). Only new failures block: a failure already known on main is listed in
// tests/quarantine.json with its issue and owner, and is reported, never blocking. Tests are quarantined within 24h, never
// deleted (docs/lessons.md); an entry whose check passes again is reported as stale so it is removed.
//   node tools/ci/behavior-tests.mjs groups
//       the CI matrix: every automatic test of tests/run.js in exactly one group, as JSON [{ name, tests }]
//   node tools/ci/behavior-tests.mjs compare --tests "<names>" --log <run.txt> --results <results.json> [--quarantine <file>]
//       judges one group's run: exit 1 on a failure outside the quarantine, on a run that never printed its last line
//       (TESTS_OK / TESTS_FAIL), or on an invalid quarantine file. Writes a Markdown report to stdout.
// A check is one result in the TEST_RESULTS file (tests/check.js): { test, part, name, ok, detail }, counted by its last
// result. A test that failed without a failing check (it crashed, or it does not use check.js) is a test-level failure,
// covered only by a whole-test entry (an entry with no "check").
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// the browser tests in their own jobs (as the CI before #197 ran them); every other automatic test runs in "other"
const FIXED = [
  { name: 'pages', tests: ['pages'] },
  { name: 'typography', tests: ['typography'] },
  { name: 'reflow', tests: ['reflow'] },
  { name: 'component-tokens', tests: ['component-tokens'] },
  { name: 'fixtures', tests: ['site-coverage', 'site-parts', 'visual', 'layout', 'charts-echarts-353', 'sparkline-echarts-353', 'treechart-echarts'] },
  { name: 'behavior', tests: ['data-grid', 'keyboard', 'focus-order', 'semantic-html', 'utilities', 'navigation', 'one-primary'] },
];

// automatic: tests/run.js AUTOMATIC -> [{ name, tests: 'a b c' }], every automatic test exactly once, no empty group
export function groups(automatic) {
  const out = [], taken = new Set();
  for (const g of FIXED) {
    const tests = g.tests.filter((t) => automatic.includes(t) && !taken.has(t));
    tests.forEach((t) => taken.add(t));
    if (tests.length) out.push({ name: g.name, tests: tests.join(' ') });
  }
  const rest = automatic.filter((t) => !taken.has(t));
  if (rest.length) out.push({ name: 'other', tests: rest.join(' ') });
  return out;
}

// the runner's last line: TESTS_OK <n> tests, or TESTS_FAIL a, b -> { done, failed }
export function parseRun(log) {
  const lines = String(log || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if (/^TESTS_OK\b/.test(last)) return { done: true, failed: [] };
  const m = /^TESTS_FAIL (.+)$/.exec(last);
  if (m) return { done: true, failed: m[1].split(',').map((s) => s.trim()).filter(Boolean) };
  return { done: false, failed: [] };
}

// the quarantine file { entries: [{ test, check?, issue, owner, since, why? }] } -> { entries, errors }
export function readQuarantine(data, known) {
  const errors = [];
  if (!data || !Array.isArray(data.entries)) return { entries: [], errors: ['the file has no "entries" list'] };
  const seen = new Set();
  data.entries.forEach((e, i) => {
    const at = `entry ${i + 1}${e && e.test ? ` (${e.test}${e.check ? ' / ' + e.check : ''})` : ''}`;
    if (!e || typeof e.test !== 'string' || !e.test) { errors.push(`${at}: no "test"`); return; }
    if (known && !known.includes(e.test)) errors.push(`${at}: "${e.test}" is not a test of tests/run.js`);
    if (!Number.isInteger(e.issue) || e.issue <= 0) errors.push(`${at}: "issue" must be the number of the issue that tracks it`);
    if (typeof e.owner !== 'string' || !e.owner.trim()) errors.push(`${at}: no "owner"`);
    if (typeof e.since !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.since)) errors.push(`${at}: "since" must be a date (YYYY-MM-DD)`);
    if (e.check !== undefined && (typeof e.check !== 'string' || !e.check)) errors.push(`${at}: "check" must be a check's full name`);
    const key = e.test + '\n' + (e.check || '');
    if (seen.has(key)) errors.push(`${at}: listed twice`);
    seen.add(key);
  });
  return { entries: data.entries, errors };
}

// ran: the tests this group ran; failed: the runner's failed tests; results: the TEST_RESULTS rows; quarantine: entries
// -> { blocking: [{ test, check?, detail? }], quarantined: [entry + { check? }], stale: [entry] }
export function compare({ ran, failed, results, quarantine }) {
  const last = new Map();
  for (const r of results || []) if (ran.includes(r.test)) last.set(r.test + '\n' + r.name, r);
  const whole = (t) => quarantine.find((e) => e.test === t && !e.check);
  const one = (t, c) => quarantine.find((e) => e.test === t && e.check === c);
  const blocking = [], quarantined = [], stale = [];
  const failing = [...last.values()].filter((r) => !r.ok);
  for (const r of failing) {
    const e = one(r.test, r.name) || whole(r.test);
    if (e) { if (!quarantined.includes(e)) quarantined.push(e); } else blocking.push({ test: r.test, check: r.name, detail: r.detail || '' });
  }
  for (const t of failed) {
    if (!ran.includes(t) || failing.some((r) => r.test === t)) continue;
    const e = whole(t);
    if (e) { if (!quarantined.includes(e)) quarantined.push(e); } else blocking.push({ test: t });
  }
  for (const e of quarantine) {
    if (!ran.includes(e.test) || quarantined.includes(e)) continue;
    if (!e.check) { if (!failed.includes(e.test)) stale.push(e); continue; }
    const r = last.get(e.test + '\n' + e.check);
    if (r && r.ok) stale.push(e);
  }
  return { blocking, quarantined, stale };
}

function report({ name, done, c, errors }) {
  const out = [`### Behavior tests: ${name}`];
  if (errors.length) out.push('', '**The quarantine file is invalid** (tests/quarantine.json):', ...errors.map((e) => `- ${e}`));
  if (!done) out.push('', '**The runner stopped before its last line** (no TESTS_OK or TESTS_FAIL): the run counts as failed.');
  if (c.blocking.length) out.push('', `**New failures (${c.blocking.length}), not in the quarantine: these block.** Fix them, or, when main already fails them, add an entry with an issue and an owner to tests/quarantine.json.`,
    ...c.blocking.map((f) => `- \`${f.test}\`${f.check ? ` · ${f.check}` : ' (the test failed without a recorded check)'}${f.detail ? `: ${String(f.detail).split('\n')[0].slice(0, 200)}` : ''}`));
  if (c.quarantined.length) out.push('', `Known failures, quarantined (${c.quarantined.length}; not blocking):`,
    ...c.quarantined.map((e) => `- \`${e.test}\`${e.check ? ` · ${e.check}` : ' (whole test)'}: #${e.issue}, ${e.owner}, since ${e.since}`));
  if (c.stale.length) out.push('', `Quarantined but passing now (${c.stale.length}): remove these entries from tests/quarantine.json.`,
    ...c.stale.map((e) => `- \`${e.test}\`${e.check ? ` · ${e.check}` : ' (whole test)'}: #${e.issue}`));
  if (done && !errors.length && !c.blocking.length) out.push('', 'No new failures.');
  return out.join('\n') + '\n';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const require = createRequire(import.meta.url);
  const { AUTOMATIC } = require(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../tests/run.js'));
  const args = process.argv.slice(2);
  const arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const cmd = args[0];
  if (cmd === 'groups') {
    console.log(JSON.stringify(groups(AUTOMATIC)));
  } else if (cmd === 'compare') {
    const ran = String(arg('--tests') || '').split(/\s+/).filter(Boolean);
    const logFile = arg('--log'), resultsFile = arg('--results'), qFile = arg('--quarantine') || 'tests/quarantine.json';
    if (!ran.length || !logFile || !resultsFile) {
      console.error('usage: node tools/ci/behavior-tests.mjs compare --tests "<names>" --log <run.txt> --results <results.json> [--quarantine <file>]');
      process.exit(2);
    }
    const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
    let results = [];
    try { results = JSON.parse(fs.readFileSync(resultsFile, 'utf8')).results || []; } catch (e) { /* no test wrote a check */ }
    let q;
    try { q = readQuarantine(JSON.parse(fs.readFileSync(qFile, 'utf8')), AUTOMATIC); } catch (e) { q = { entries: [], errors: [`${qFile}: ${e.message}`] }; }
    const { done, failed } = parseRun(log);
    const c = compare({ ran, failed, results, quarantine: q.errors.length ? [] : q.entries });
    process.stdout.write(report({ name: arg('--name') || ran.join(' '), done, c, errors: q.errors }));
    const ok = done && !q.errors.length && !c.blocking.length;
    console.log(ok ? 'BEHAVIOR_TESTS_OK' : 'BEHAVIOR_TESTS_FAIL');
    process.exit(ok ? 0 : 1);
  } else {
    console.error('usage: node tools/ci/behavior-tests.mjs groups | compare …');
    process.exit(2);
  }
}
