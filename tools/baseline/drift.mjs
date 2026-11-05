#!/usr/bin/env node
// The drift report at every release (#114, plan 273 part 3): scan every connected app this job can reach, read-only,
// with tools/baseline/scan.js, and list per app "at baseline" or "N items to fix". Run after the build (the scan reads
// platform/tokens/tokens.index.json).
//
//   node tools/baseline/drift.mjs --out <folder> [--registry tools/baseline/apps.json]
//
// Writes <out>/drift.md (a table, for the release notes and the job summary), <out>/drift.json and each scanned app's
// baseline-<app>.{json,md}. Exit 0 whatever the apps look like, and when an app can't be fetched (reported as such):
// a release never fails because of an app. Exit 1 only when this tool itself can't work (a broken registry, a scan
// that crashes), so a release never ships without the report by accident.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const out = opt('--out');
const here = path.dirname(fileURLToPath(import.meta.url));
const registryFile = opt('--registry', path.join(here, 'apps.json'));
if (!out) { console.error('usage: drift.mjs --out <folder> [--registry <apps.json>]'); process.exit(2); }

let apps;
try {
  apps = JSON.parse(fs.readFileSync(registryFile, 'utf8')).apps;
  if (!Array.isArray(apps) || !apps.length) throw new Error('no "apps" list');
  for (const a of apps) {
    if (!/^[a-z0-9-]+$/.test(a.name || '')) throw new Error(`app name "${a.name}" must be lowercase letters, digits and dashes`);
    if (a.scan && !/^[\w.-]+\/[\w.-]+$/.test(a.repository || '')) throw new Error(`${a.name}: scan is on but repository is not owner/name`);
    if (!a.scan && !a.reason) throw new Error(`${a.name}: scan is off without a reason`);
  }
} catch (e) { console.log(`DRIFT_FAIL: ${registryFile}: ${e.message}`); process.exit(1); }

fs.mkdirSync(out, { recursive: true });
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'plenix-drift-'));
const rows = [];
for (const a of apps) {
  if (!a.scan) { rows.push({ app: a.name, title: a.title, status: 'not scanned', detail: a.reason, channel: a.channel }); continue; }
  const dir = path.join(work, a.name);
  try {
    execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', a.branch || 'main', `https://github.com/${a.repository}.git`, dir],
      { stdio: ['ignore', 'ignore', 'pipe'], timeout: 180000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  } catch (e) {
    rows.push({ app: a.name, title: a.title, status: 'unreachable', detail: `could not fetch ${a.repository} (${String(e.stderr || e.message).trim().split('\n').pop()})`, channel: a.channel });
    continue;
  }
  const commit = execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  try {
    execFileSync('node', [path.join(here, 'scan.js'), dir, '--app', a.name, '--out', path.resolve(out)], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000 });
  } catch (e) {
    console.log(`DRIFT_FAIL: the scan of ${a.name} crashed: ${String(e.stderr || e.message).trim().split('\n').slice(-3).join(' / ')}`);
    process.exit(1);
  }
  const r = JSON.parse(fs.readFileSync(path.join(out, `baseline-${a.name}.json`), 'utf8'));
  const n = r.findings.filter((f) => f.kind !== 'pins').length;
  const by = {};
  for (const f of r.findings) if (f.kind !== 'pins') by[f.kind] = (by[f.kind] || 0) + 1;
  rows.push({ app: a.name, title: a.title, status: n ? `${n} item${n > 1 ? 's' : ''} to fix` : 'at baseline', items: n, byKind: by,
    detail: `${a.repository}@${commit}; loads ${r.pins.length ? r.pins.join(', ') : 'no pinned version'}`, channel: a.channel });
}
fs.rmSync(work, { recursive: true, force: true });

const plenix = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
const md = [`### Connected apps against Plenix ${plenix}`, '', '| App | Status | Details | How it picks its version |', '|---|---|---|---|',
  ...rows.map((r) => `| ${r.title} | ${r.status}${r.byKind ? ' (' + Object.entries(r.byKind).map(([k, v]) => `${k} ${v}`).join(', ') + ')' : ''} | ${r.detail} | ${r.channel} |`),
  '', 'Read-only scan (tools/baseline/scan.js); the per-app pages are in the release records. A release never fails because of an app.'].join('\n');
fs.writeFileSync(path.join(out, 'drift.md'), md + '\n');
fs.writeFileSync(path.join(out, 'drift.json'), JSON.stringify({ plenix, apps: rows }, null, 1) + '\n');
console.log(md);
console.log(`DRIFT_OK (${rows.filter((r) => r.items !== undefined).length} scanned, ${rows.filter((r) => r.status === 'unreachable').length} unreachable, ${rows.filter((r) => r.status === 'not scanned').length} not scanned)`);
