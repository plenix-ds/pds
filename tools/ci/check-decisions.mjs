#!/usr/bin/env node
// Decision log integrity (plan §7 "Decision coverage"; issues #197, #955).
//
//   node tools/ci/check-decisions.mjs [<base-ref>] [--main <ref>]
//
// The log is decisions.d/D-NNNN.yaml, one decision per file (#955: two PRs that each add a decision never touch the same
// file). decisions.yaml, the old single file, is still read at a base ref from before the fold, and fails when a change
// adds it back after the fold.
// Fails when:
// - an entry has no id, date, decision, status or check (check may be "review-only (<reason>)");
// - ids are not D-NNNN or are repeated, across both sources (order is free: parallel PRs reserve ids out of order);
// - a folder file is not named for its id (decisions.d/D-0101.yaml holds id: D-0101), or holds more than one entry;
// - a file is not valid YAML for PyYAML's yaml.safe_load, the parser the dashboard uses (dashboard/pds1/collect.py; #589).
//   A missing python3 or PyYAML is a failure too, never a skip;
// - with a base ref: an entry from the base was removed, or its id, date, area, decided_by or decision text changed, in
//   whichever source it now sits. Only status, superseded_by and check may change on a past entry (supersede it, never
//   rewrite it). Moving an entry from decisions.yaml into the folder unchanged passes;
// - with --main <ref>: an id this change adds (not in the base) is already taken on main by another decision. The author
//   renumbers: node tools/decision-id.mjs prints the next free id.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FILE = process.env.DECISIONS_FILE || 'decisions.yaml'; // DECISIONS_FILE, DECISIONS_DIR: the self-test's fixtures
const DIR = process.env.DECISIONS_DIR || 'decisions.d';
const PYTHON = process.env.DECISIONS_PYTHON || 'python3';
const FROZEN = ['id', 'date', 'area', 'decided_by', 'decision'];
const REQUIRED = ['id', 'date', 'decision', 'status', 'check'];
const NAME = /^D-\d{4}\.yaml$/;

// decisions.yaml's simple shape: "- id: X" starts an entry, "  key: value" lines follow (one line each)
function parseList(text, src) {
  const entries = [];
  text.split('\n').forEach((line, i) => {
    if (/^\s*#/.test(line) || !line.trim()) return;
    const start = line.match(/^- id:\s*(.*)$/);
    if (start) { entries.push({ id: start[1].trim(), _src: `${src}:${i + 1}` }); return; }
    const kv = line.match(/^\s{2}([a-z_]+):\s*(.*)$/);
    if (kv && entries.length) entries.at(-1)[kv[1]] = kv[2].trim();
    else if (entries.length) entries.at(-1)._bad = `line ${i + 1}: not "  key: value"`;
  });
  return entries;
}

// a folder file: one entry, "key: value" lines from the first column (one line each)
function parseOne(text, src) {
  const e = { _src: src, _file: path.posix.basename(src) };
  text.split('\n').forEach((line, i) => {
    if (/^\s*#/.test(line) || !line.trim()) return;
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) { e._bad = `line ${i + 1}: not "key: value" (one decision per file, no list)`; return; }
    if (kv[1] in e) e._bad = `line ${i + 1}: "${kv[1]}" twice (one decision per file)`;
    e[kv[1]] = kv[2].trim();
  });
  return e;
}

// the log's files: [{ name, text, folder }] from the working tree, or from a git ref
function filesNow() {
  const out = [];
  if (fs.existsSync(FILE)) out.push({ name: FILE, text: fs.readFileSync(FILE, 'utf8'), folder: false });
  if (fs.existsSync(DIR)) {
    for (const f of fs.readdirSync(DIR).sort()) {
      if (f === 'README.md') continue;
      out.push({ name: path.posix.join(DIR, f), base: f, text: fs.readFileSync(path.join(DIR, f), 'utf8'), folder: true });
    }
  }
  return out;
}
function filesAt(ref) {
  const git = (args, input) => execFileSync('git', args, { input, maxBuffer: 64 << 20, stdio: ['pipe', 'pipe', 'ignore'] });
  const out = [];
  try { out.push({ name: FILE, text: git(['show', `${ref}:${FILE}`]).toString('utf8'), folder: false }); } catch { /* none at that ref */ }
  let names = [];
  try { names = git(['ls-tree', '-r', '--name-only', ref, '--', DIR]).toString('utf8').split('\n').filter((n) => n && !n.endsWith('/README.md')); } catch { names = []; }
  if (names.length) {
    // one git process for every file: "<sha> blob <size>\n<content>\n" per file
    const buf = git(['cat-file', '--batch'], names.map((n) => `${ref}:${n}`).join('\n') + '\n');
    let at = 0;
    for (const n of names) {
      const nl = buf.indexOf(10, at);
      const size = Number(buf.subarray(at, nl).toString('utf8').split(' ')[2]);
      out.push({ name: n, base: path.posix.basename(n), text: buf.subarray(nl + 1, nl + 1 + size).toString('utf8'), folder: true });
      at = nl + 1 + size + 1;
    }
  }
  return out;
}
const entriesOf = (files) => files.flatMap((f) => (f.folder ? [parseOne(f.text, f.name)] : parseList(f.text, f.name)));

// real YAML, as the dashboard reads it (#589): the light parsers above let through text that yaml.safe_load rejects.
// Every file in one python run; a folder file must load as one mapping.
function yamlErrors(files) {
  const code = [
    'import json, sys, yaml',
    'bad = 0',
    'for name, text, folder in json.load(sys.stdin):',
    '    try:',
    '        v = yaml.safe_load(text)',
    '    except yaml.YAMLError as e:',
    '        print(name + "\\t" + " ".join(str(e).split())); bad = 1; continue',
    '    if folder and not isinstance(v, dict):',
    '        print(name + "\\tnot one decision (a YAML mapping)"); bad = 1',
    'sys.exit(3 if bad else 0)',
  ].join('\n');
  const r = spawnSync(PYTHON, ['-I', '-c', code], { input: JSON.stringify(files.map((f) => [f.name, f.text, f.folder])), encoding: 'utf8' });
  if (r.error) return [`${PYTHON} not found; the YAML parse cannot run (CI installs PyYAML)`];
  if (r.status === 3) return r.stdout.trim().split('\n').map((l) => { const [n, m] = l.split('\t'); return `${n}: not valid YAML (yaml.safe_load, as the dashboard reads it): ${m}`; });
  if (r.status !== 0) return [`the YAML parse did not run (is PyYAML installed?): ${(r.stderr || '').trim().split('\n').at(-1)}`];
  return [];
}

const argv = process.argv.slice(2);
const mainAt = argv.indexOf('--main');
const mainRef = mainAt >= 0 ? argv[mainAt + 1] : '';
const baseRef = argv.filter((a, i) => mainAt < 0 || (i !== mainAt && i !== mainAt + 1))[0];

const errors = [];
const files = filesNow();
if (!files.length) errors.push(`no decision log: neither ${FILE} nor ${DIR}/ exists`);
errors.push(...yamlErrors(files));
for (const f of files.filter((x) => x.folder && !NAME.test(x.base))) errors.push(`${f.name}: a decision file is named D-NNNN.yaml`);
const head = entriesOf(files);
let prev = 0;
const seen = new Map();
for (const e of head) {
  const where = `${e._src} ${e.id || '(no id)'}`;
  for (const k of REQUIRED) if (!e[k]) errors.push(`${where}: missing "${k}"`);
  if (e._bad) errors.push(`${where}: ${e._bad}`);
  const m = /^D-(\d{4})$/.exec(e.id || '');
  if (!m) { errors.push(`${where}: id must be D-NNNN`); continue; }
  if (e._file && NAME.test(e._file) && e._file !== `${e.id}.yaml`) errors.push(`${e._src}: holds ${e.id}; a decision file is named for its id (${e.id}.yaml)`);
  if (seen.has(e.id)) errors.push(`${where}: id is used twice (also ${seen.get(e.id)})`);
  seen.set(e.id, e._src);
  // order is not checked: parallel PRs reserve ids, so a lower free id may land after a higher one (#198)
  prev = Math.max(prev, Number(m[1]));
  if (e.status === 'superseded' && !e.superseded_by) errors.push(`${where}: superseded without superseded_by`);
}

const byId = new Map(head.map((e) => [e.id, e]));
const baseIds = new Set();
if (baseRef) {
  const baseFiles = filesAt(baseRef);
  // the fold (#955 PR 2) retired the single file: once the base has none, adding it back fails
  if (files.some((f) => !f.folder) && !baseFiles.some((f) => !f.folder)) errors.push(`${FILE}: decisions.yaml is retired (#955); add each decision as ${DIR}/<id>.yaml (node tools/decision-id.mjs)`);
  for (const b of entriesOf(baseFiles)) {
    baseIds.add(b.id);
    const h = byId.get(b.id);
    if (!h) { errors.push(`${b.id}: removed; past entries stay (set status: superseded instead)`); continue; }
    for (const k of FROZEN) if ((b[k] || '') !== (h[k] || '')) errors.push(`${b.id}: "${k}" changed; past entries are never rewritten, supersede them with a new entry`);
  }
}
if (mainRef) {
  try { execFileSync('git', ['rev-parse', '--verify', '-q', `${mainRef}^{commit}`], { stdio: 'ignore' }); } catch { errors.push(`--main ${mainRef}: no such ref (fetch it first)`); }
  const onMain = new Map(entriesOf(filesAt(mainRef)).map((e) => [e.id, e]));
  for (const e of head) {
    if (baseIds.has(e.id) || !onMain.has(e.id)) continue;
    if ((onMain.get(e.id).decision || '') !== (e.decision || '')) errors.push(`${e.id}: taken on main by another decision since this branch started; renumber it (node tools/decision-id.mjs prints the next free id)`);
  }
}

if (errors.length) {
  for (const e of errors) console.log(`::error title=decisions::${e}`);
  console.log(`DECISIONS_FAIL (${errors.length})`);
  process.exit(1);
}
const inFolder = files.filter((f) => f.folder).length;
console.log(`DECISIONS_OK (${head.length} entries, ${inFolder} in ${DIR}/, highest D-${String(prev).padStart(4, '0')})`);
