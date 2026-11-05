#!/usr/bin/env node
// decisions.yaml integrity (plan §7 "Decision coverage"; issue #197).
//
//   node tools/ci/check-decisions.mjs [<base-ref>]
//
// Fails when:
// - an entry has no id, date, decision, status or check (check may be "review-only (<reason>)");
// - ids are not D-NNNN, are repeated, or do not increase down the file (a new entry goes at the end);
// - with a base ref: an entry from the base was removed, or its id, date, area, decided_by or decision text changed.
//   Only status, superseded_by and check may change on a past entry (supersede it, never rewrite it).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const FILE = 'decisions.yaml';
const FROZEN = ['id', 'date', 'area', 'decided_by', 'decision'];
const REQUIRED = ['id', 'date', 'decision', 'status', 'check'];

// the file's own simple shape: "- id: X" starts an entry, "  key: value" lines follow (one line each)
function parse(text) {
  const entries = [];
  text.split('\n').forEach((line, i) => {
    if (/^\s*#/.test(line) || !line.trim()) return;
    const start = line.match(/^- id:\s*(.*)$/);
    if (start) { entries.push({ id: start[1].trim(), _line: i + 1 }); return; }
    const kv = line.match(/^\s{2}([a-z_]+):\s*(.*)$/);
    if (kv && entries.length) entries.at(-1)[kv[1]] = kv[2].trim();
    else if (entries.length) entries.at(-1)._bad = `line ${i + 1}: not "  key: value"`;
  });
  return entries;
}

const errors = [];
const head = parse(fs.readFileSync(FILE, 'utf8'));
let prev = 0;
const seen = new Set();
for (const e of head) {
  const where = `${FILE}:${e._line} ${e.id || '(no id)'}`;
  for (const k of REQUIRED) if (!e[k]) errors.push(`${where}: missing "${k}"`);
  if (e._bad) errors.push(`${where}: ${e._bad}`);
  const m = /^D-(\d{4})$/.exec(e.id || '');
  if (!m) { errors.push(`${where}: id must be D-NNNN`); continue; }
  if (seen.has(e.id)) errors.push(`${where}: id is used twice`);
  seen.add(e.id);
  const n = Number(m[1]);
  if (n <= prev) errors.push(`${where}: ids must increase down the file (after D-${String(prev).padStart(4, '0')}); add new entries at the end with the next free id`);
  prev = Math.max(prev, n);
  if (e.status === 'superseded' && !e.superseded_by) errors.push(`${where}: superseded without superseded_by`);
}

const baseRef = process.argv[2];
if (baseRef) {
  let baseText = '';
  try { baseText = execFileSync('git', ['show', `${baseRef}:${FILE}`], { encoding: 'utf8' }); } catch { baseText = ''; }
  const byId = new Map(head.map((e) => [e.id, e]));
  for (const b of parse(baseText)) {
    const h = byId.get(b.id);
    if (!h) { errors.push(`${b.id}: removed; past entries stay (set status: superseded instead)`); continue; }
    for (const k of FROZEN) if ((b[k] || '') !== (h[k] || '')) errors.push(`${b.id}: "${k}" changed; past entries are never rewritten, supersede them with a new entry`);
  }
}

if (errors.length) {
  for (const e of errors) console.log(`::error title=decisions.yaml::${e}`);
  console.log(`DECISIONS_FAIL (${errors.length})`);
  process.exit(1);
}
console.log(`DECISIONS_OK (${head.length} entries, last D-${String(prev).padStart(4, '0')})`);
