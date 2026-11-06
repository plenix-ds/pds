#!/usr/bin/env node
// Release readiness (#125 release check; the Product Lead, 2026-11-06): before a release removes classes, scan every
// connected app's main for them. CTM auto-upgrades from cdn/latest.json, so a class it still uses must not go out.
//
//   node tools/publish/removed-in-apps.mjs <previous release tag> [--registry tools/baseline/apps.json]
//
// Removed classes: those on platform/standards/deprecated-classes.json at the previous release that are not on it now
// (VERSIONING.md: a class is removed only after it was deprecated, so the list is the one record of removals).
// Each app with "scan": true in the registry is cloned (depth 1, its branch) and searched, as whole class names, in its
// source files; node_modules, build output, vendored copies and copied Plenix stylesheets are skipped.
// Fails when an app uses a removed class, and when an app can't be fetched while the release removes classes (an app
// that can't be checked is not proven safe). With no removed class it passes without fetching anything.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LIST = 'platform/standards/deprecated-classes.json';
const SOURCE = /\.(jsx?|tsx?|mjs|cjs|vue|svelte|html?|css|scss|less)$/;
const SKIP_DIR = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'coverage', 'vendor', '.next']);
const SKIP_FILE = /(^|\/)plenix[^/]*\.css$|\.min\.(js|css)$/;

export function removedClasses(previous, current) {
  const keep = new Set(current);
  return [...new Set(previous)].filter((c) => !keep.has(c)).sort();
}

// [{ cls, files }] for each class used in dir (files relative, sorted)
export function usesIn(dir, classes) {
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(p); continue; }
      const rel = path.relative(dir, p).split(path.sep).join('/');
      if (SOURCE.test(e.name) && !SKIP_FILE.test(rel)) files.push(rel);
    }
  })(dir);
  const text = new Map(files.map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));
  const out = [];
  for (const cls of classes) {
    const re = new RegExp(`(^|[^\\w-])${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`);
    const hit = files.filter((f) => re.test(text.get(f))).sort();
    if (hit.length) out.push({ cls, files: hit });
  }
  return out;
}

const listAt = (ref) => JSON.parse(execFileSync('git', ['show', `${ref}:${LIST}`], { encoding: 'utf8' })).classes || [];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const base = args[0];
  const reg = args.includes('--registry') ? args[args.indexOf('--registry') + 1] : 'tools/baseline/apps.json';
  if (!base) { console.log('REMOVED_IN_APPS_FAIL: usage: removed-in-apps.mjs <previous release tag>'); process.exit(1); }
  let removed;
  try { removed = removedClasses(listAt(base), JSON.parse(fs.readFileSync(LIST, 'utf8')).classes || []); }
  catch (e) { console.log(`REMOVED_IN_APPS_FAIL: could not read ${LIST} at ${base}: ${String(e.message).split('\n')[0]}`); process.exit(1); }
  if (!removed.length) { console.log(`REMOVED_IN_APPS_OK (this release removes no class since ${base})`); process.exit(0); }
  console.log(`${removed.length} classes removed since ${base}; scanning the connected apps`);
  const apps = JSON.parse(fs.readFileSync(reg, 'utf8')).apps.filter((a) => a.scan);
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'removed-in-apps-'));
  let fail = 0;
  for (const a of apps) {
    const dir = path.join(work, a.name);
    try {
      execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', a.branch || 'main', `https://github.com/${a.repository}.git`, dir],
        { stdio: ['ignore', 'ignore', 'pipe'], timeout: 180000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    } catch (e) {
      fail++; console.log(`::error title=${a.name}::could not fetch ${a.repository}; a release that removes classes needs every connected app checked`);
      continue;
    }
    const commit = execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
    const uses = usesIn(dir, removed);
    if (!uses.length) { console.log(`${a.name} (${a.repository}@${commit}): uses none of them`); continue; }
    fail++;
    for (const u of uses) console.log(`::error title=${a.name} uses ${u.cls}::${a.repository}@${commit}: ${u.files.slice(0, 5).join(', ')}${u.files.length > 5 ? ` and ${u.files.length - 5} more` : ''}`);
  }
  fs.rmSync(work, { recursive: true, force: true });
  if (fail) { console.log(`REMOVED_IN_APPS_FAIL (${fail} app${fail > 1 ? 's' : ''}): keep the classes deprecated until the app moves off them, or pin the app`); process.exit(1); }
  console.log(`REMOVED_IN_APPS_OK (${removed.length} removed classes, ${apps.length} apps checked)`);
}
