#!/usr/bin/env node
// Diff-aware checks (plan §7, "Only new problems block"; issue #197).
//
//   node tools/ci/new-problems.mjs run <tool> <out.json>         run <tool> in the current directory, write its findings
//   node tools/ci/new-problems.mjs compare <tool> <base.json> <head.json>
//
// A finding is "<tool> | <file> | <rule> | <message>", without line or column, so moving code does not make a problem
// new. compare fails (exit 1) when the head has a finding more often than the base; old findings are counted in the
// summary but never block. A tool that crashes (no parsable output) fails the run: a crash is never a pass.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const rel = (f) => path.relative(ROOT, path.resolve(ROOT, f)).split(path.sep).join('/');
const clean = (s) => String(s).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').trim();
// line/column numbers inside messages ("at line 12", "(3,4)") would make moved code look new
const noNumbers = (s) => clean(s).replace(/\b(line|col|column)\s+\d+/gi, '$1 N').replace(/\(\d+,\d+\)/g, '(N,N)');

function exec(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, shell: false });
  if (r.error) throw new Error(`${cmd} did not start: ${r.error.message}`);
  return r;
}
const npx = (...args) => exec('npx', ['--no-install', ...args]);
function parseJson(text, tool) {
  const start = text.search(/[[{]/);
  if (start < 0) throw new Error(`${tool} printed no JSON`);
  return JSON.parse(text.slice(start));
}

// check-system.js / check-style.js print "<rule>: <n>" then "  <file>[:line]  <text>" (check-common.js reporter)
function reporterFindings(tool, script, okWord, failWord) {
  const r = exec('node', [script, '--all']);
  const out = r.stdout || '';
  const last = out.trim().split('\n').pop() || '';
  if (!last.startsWith(okWord) && !last.startsWith(failWord)) throw new Error(`${script} ended without ${okWord}/${failWord}:\n${out.slice(-2000)}\n${r.stderr}`);
  if (/build outputs are missing/.test(last)) throw new Error(`${script}: build outputs are missing`);
  const list = [];
  const prefix = path.basename(ROOT) + '/';
  let rule = null;
  for (const line of out.split('\n')) {
    const h = line.match(/^(\S[^:]*): \d+$/);
    if (h) { rule = h[1]; continue; }
    const f = line.match(/^ {2}(\S+?)(?::\d+)? {2}(.*)$/);
    // check-common.js prints paths from the checkout's parent ("pds/x.css", "base/x.css"): drop the checkout's folder
    if (f && rule) list.push([tool, f[1].startsWith(prefix) ? f[1].slice(prefix.length) : f[1], rule, noNumbers(f[2])]);
  }
  return list;
}

const TOOLS = {
  eslint() {
    const r = npx('eslint', '--no-error-on-unmatched-pattern', '-f', 'json', 'platform', 'suite', 'dam/app', 'dashboard', 'projects',
      'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings', 'lanes');
    if (r.status !== 0 && r.status !== 1) throw new Error(`eslint crashed (exit ${r.status}):\n${r.stderr}`);
    return parseJson(r.stdout, 'eslint').flatMap((f) => f.messages.map((m) => ['eslint', rel(f.filePath), m.ruleId || 'parse', noNumbers(m.message)]));
  },
  stylelint() {
    const r = npx('stylelint', '--formatter', 'json', 'platform/**/*.css', 'services/**/*.css');
    if (r.status !== 0 && r.status !== 2) throw new Error(`stylelint crashed (exit ${r.status}):\n${r.stderr}`);
    // stylelint 16 prints the JSON report on stderr when there are problems, on stdout otherwise
    const text = (r.stdout || '').trim() ? r.stdout : r.stderr;
    return parseJson(text, 'stylelint').flatMap((f) => f.warnings.map((w) => ['stylelint', rel(f.source), w.rule, noNumbers(w.text)]));
  },
  tsc() {
    const r = npx('tsc', '--noEmit', '--pretty', 'false');
    const out = (r.stdout || '') + (r.stderr || '');
    const list = [];
    for (const line of out.split('\n')) {
      const m = line.match(/^(.+?)\(\d+,\d+\): error (TS\d+): (.*)$/) || line.match(/^()error (TS\d+): (.*)$/);
      if (m) list.push(['tsc', m[1] ? rel(m[1]) : '(project)', m[2], noNumbers(m[3])]);
    }
    if (r.status !== 0 && !list.length) throw new Error(`tsc failed with no diagnostics (exit ${r.status}):\n${out.slice(-2000)}`);
    return list;
  },
  knip() {
    const r = npx('knip', '--no-exit-code', '--no-progress', '--reporter', 'json');
    if (r.status !== 0) throw new Error(`knip crashed (exit ${r.status}):\n${r.stderr}`);
    const data = parseJson(r.stdout, 'knip');
    const list = (data.files || []).map((f) => ['knip', rel(f), 'files', 'unused file']);
    for (const issue of data.issues || []) {
      for (const [kind, value] of Object.entries(issue)) {
        if (kind === 'file' || kind === 'owners') continue;
        const items = Array.isArray(value) ? value : value && typeof value === 'object' ? Object.values(value) : [];
        for (const it of items.flat()) if (it && typeof it === 'object' && it.name) list.push(['knip', rel(issue.file), kind, clean(it.name)]);
      }
    }
    return list;
  },
  system: () => reporterFindings('system', 'check-system.js', 'SYSTEM_OK', 'SYSTEM_FAIL'),
  style: () => reporterFindings('style', 'check-style.js', 'STYLE_OK', 'STYLE_FAIL'),
};

const key = (f) => f.join(' | ');
function count(list) {
  const m = new Map();
  for (const f of list) m.set(key(f), (m.get(key(f)) || 0) + 1);
  return m;
}
function summary(text) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
}

const [cmd, tool, a, b] = process.argv.slice(2);
if (!TOOLS[tool]) { console.error(`unknown tool "${tool}"; known: ${Object.keys(TOOLS).join(', ')}`); process.exit(2); }

if (cmd === 'run') {
  const list = TOOLS[tool]().sort((x, y) => key(x).localeCompare(key(y)));
  fs.writeFileSync(a, JSON.stringify(list, null, 0));
  console.log(`${tool}: ${list.length} findings in ${ROOT} -> ${a}`);
} else if (cmd === 'compare') {
  const base = count(JSON.parse(fs.readFileSync(a, 'utf8')));
  const head = JSON.parse(fs.readFileSync(b, 'utf8'));
  const added = [];
  for (const [k, n] of count(head)) for (let i = base.get(k) || 0; i < n; i++) added.push(k);
  const total = head.length;
  const fixed = [...base].reduce((s, [k, n]) => s + Math.max(0, n - (count(head).get(k) || 0)), 0);
  console.log(`${tool}: ${total} findings on head, ${added.length} new, ${fixed} fixed, ${total - added.length} old (reported, not blocking)`);
  summary(`### ${tool}\n\n${added.length ? '❌' : '✅'} ${added.length} new · ${fixed} fixed · ${total - added.length} old (not blocking)\n`);
  if (added.length) {
    for (const k of added.slice(0, 200)) console.log(`::error title=${tool}: new problem::${k}`);
    summary(['```', ...added.slice(0, 200), added.length > 200 ? `… and ${added.length - 200} more` : '', '```'].join('\n'));
    process.exit(1);
  }
} else {
  console.error('usage: new-problems.mjs run <tool> <out.json> | compare <tool> <base.json> <head.json>');
  process.exit(2);
}
