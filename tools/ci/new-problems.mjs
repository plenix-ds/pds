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
    const f = line.match(/^ {2}(\S+?)(?::(\d+))? {2}(.*)$/);
    // check-common.js prints paths from the checkout's parent ("pds/x.css", "base/x.css"): drop the checkout's folder
    if (f && rule) list.push([tool, f[1].startsWith(prefix) ? f[1].slice(prefix.length) : f[1], rule, noNumbers(f[3]), Number(f[2]) || 0]);
  }
  return list;
}

// the published TypeScript types of @plenix-ds/react (ADR 0011, #61): build them (build-types.js), then one finding per prop
// typed `any` and per exported component whose whole props object is `any`. index.d.ts and the tsc declarations it
// re-exports are read, so a part converted to TypeScript counts too. A finding names the part and the prop, never a line.
function typesFindings() {
  const r = exec('node', ['build-types.js']);
  if (r.status !== 0) throw new Error(`build-types.js failed (exit ${r.status}):\n${(r.stdout || '').slice(-1500)}\n${r.stderr}`);
  const dir = path.join(ROOT, 'release', 'packages', 'react');
  // only what a consumer gets: index.d.ts and the declarations it re-exports (types/ also holds tsc's output for the
  // JavaScript sources, which nothing points to until the source is TypeScript)
  const index = path.join(dir, 'index.d.ts');
  const text = fs.existsSync(index) ? fs.readFileSync(index, 'utf8') : '';
  const files = [index, ...new Set([...text.matchAll(/from "\.\/(types\/[^"]+)\.js"/g)].map((m) => path.join(dir, m[1] + '.d.ts')))];
  const out = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const name = path.relative(dir, file).split(path.sep).join('/');
    let owner = '';
    fs.readFileSync(file, 'utf8').split('\n').forEach((l, i) => {
      const top = /^export (?:declare )?(?:interface|type|function|const|namespace) ([\w$]+)/.exec(l);
      if (top) owner = top[1];
      const prop = /^\s+([\w$]+)\??: any(?:\[\])?;$/.exec(l);
      if (prop && prop[1] !== 'prop') out.push(['types', name, 'any-prop', `${owner}.${prop[1]} is any`, i + 1]);
      const whole = /^export declare (?:function|const) ([\w$]+)\s*[:(]\s*(?:\{[^}]*\}|props|_props)\s*:\s*any\b/.exec(l)
        || (/^\s+var ([\w$]+): \((?:\{[^}]*\}|props)\s*:\s*any\)/.exec(l) && [null, owner + '.' + /^\s+var ([\w$]+)/.exec(l)[1]]);
      if (whole) out.push(['types', name, 'any-props-object', `${whole[1]}'s props are any`, i + 1]);
    });
  }
  return out;
}

const TOOLS = {
  eslint() {
    const r = npx('eslint', '--no-error-on-unmatched-pattern', '-f', 'json', 'platform', 'suite', 'dam/app', 'dashboard', 'projects',
      'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings', 'lanes');
    if (r.status !== 0 && r.status !== 1) throw new Error(`eslint crashed (exit ${r.status}):\n${r.stderr}`);
    return parseJson(r.stdout, 'eslint').flatMap((f) => f.messages.map((m) => ['eslint', rel(f.filePath), m.ruleId || 'parse', noNumbers(m.message), m.line || 0]));
  },
  stylelint() {
    const r = npx('stylelint', '--formatter', 'json', 'platform/**/*.css', 'services/**/*.css');
    if (r.status !== 0 && r.status !== 2) throw new Error(`stylelint crashed (exit ${r.status}):\n${r.stderr}`);
    // stylelint 16 prints the JSON report on stderr when there are problems, on stdout otherwise
    const text = (r.stdout || '').trim() ? r.stdout : r.stderr;
    return parseJson(text, 'stylelint').flatMap((f) => f.warnings.map((w) => ['stylelint', rel(f.source), w.rule, noNumbers(w.text), w.line || 0]));
  },
  tsc() {
    const r = npx('tsc', '--noEmit', '--pretty', 'false');
    const out = (r.stdout || '') + (r.stderr || '');
    const list = [];
    for (const line of out.split('\n')) {
      const m = line.match(/^(.+?)\((\d+),\d+\): error (TS\d+): (.*)$/) || line.match(/^()()error (TS\d+): (.*)$/);
      if (m) list.push(['tsc', m[1] ? rel(m[1]) : '(project)', m[3], noNumbers(m[4]), Number(m[2]) || 0]);
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
        for (const it of items.flat()) if (it && typeof it === 'object' && it.name) list.push(['knip', rel(issue.file), kind, clean(it.name), it.line || 0]);
      }
    }
    return list;
  },
  // PDS's own Opengrep rules (.opengrep/rules). OPENGREP_RULES names the head's rules, so the base is read with the same
  // rules and only code changes count; OPENGREP_BIN is the pinned binary (ci.yml installs it, sha256-checked)
  opengrep() {
    const rules = process.env.OPENGREP_RULES || path.join(ROOT, '.opengrep', 'rules', 'pds.yml');
    const r = exec(process.env.OPENGREP_BIN || 'opengrep', ['scan', '--config', rules, '--json', '--quiet',
      '--exclude', 'platform/vendor', '--exclude', 'platform/design-system', '--exclude', '.opengrep',
      ...['platform', 'suite', 'dam/app', 'apps'].filter((d) => fs.existsSync(path.join(ROOT, d)))]);
    if (r.status !== 0 && r.status !== 1) throw new Error(`opengrep crashed (exit ${r.status}):\n${r.stderr.slice(-2000)}`);
    const data = parseJson(r.stdout, 'opengrep');
    if ((data.errors || []).some((e) => e.level === 'error')) throw new Error(`opengrep reported errors: ${JSON.stringify(data.errors).slice(0, 1500)}`);
    return data.results.map((x) => ['opengrep', rel(x.path), x.check_id.split('.').pop(), noNumbers(x.extra.lines || x.extra.message), (x.start || {}).line || 0]);
  },
  system: () => reporterFindings('system', 'check-system.js', 'SYSTEM_OK', 'SYSTEM_FAIL'),
  style: () => reporterFindings('style', 'check-style.js', 'STYLE_OK', 'STYLE_FAIL'),
  types: () => typesFindings(),
};

// a finding is [tool, file, rule, message, line?]: the line is only for the annotation, never part of the identity
const key = (f) => f.slice(0, 4).join(' | ');
// GitHub workflow commands: property values escape % \r \n : , and the message escapes % \r \n
const prop = (v) => String(v).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/:/g, '%3A').replace(/,/g, '%2C');
const msg = (v) => String(v).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
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
  const byKey = new Map();
  for (const f of head) (byKey.get(key(f)) || byKey.set(key(f), []).get(key(f))).push(f);
  // the surplus of a key over the base is new; its last occurrences carry the lines to annotate
  for (const [k, n] of count(head)) for (let i = base.get(k) || 0; i < n; i++) added.push(byKey.get(k)[i]);
  const total = head.length;
  const fixed = [...base].reduce((s, [k, n]) => s + Math.max(0, n - (count(head).get(k) || 0)), 0);
  console.log(`${tool}: ${total} findings on head, ${added.length} new, ${fixed} fixed, ${total - added.length} old (reported, not blocking)`);
  summary(`### ${tool}\n\n${added.length ? '❌' : '✅'} ${added.length} new · ${fixed} fixed · ${total - added.length} old (not blocking)\n`);
  if (added.length) {
    for (const f of added.slice(0, 200)) {
      const where = f[1] && !f[1].startsWith('(') ? `file=${prop(f[1])}${f[4] ? `,line=${f[4]}` : ''},` : '';
      console.log(`::error ${where}title=${prop(`${tool}: new problem (${f[2]})`)}::${msg(f[3])}`);
    }
    summary(['```', ...added.slice(0, 200).map(key), added.length > 200 ? `… and ${added.length - 200} more` : '', '```'].join('\n'));
    process.exit(1);
  }
} else {
  console.error('usage: new-problems.mjs run <tool> <out.json> | compare <tool> <base.json> <head.json>');
  process.exit(2);
}
