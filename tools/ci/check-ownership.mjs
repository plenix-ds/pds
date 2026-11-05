#!/usr/bin/env node
// Ownership (plan §7; ADR 0001 `planned:ownership`; #197): only pds1-ds-architect changes the token tier files and the
// packages' public API (the `exports` of packages/*/package.json).
//
//   PR_LABELS='["agent:pds1-ds-architect", …]' node tools/ci/check-ownership.mjs <base ref>
//
// Owned changes:
//   - any file under packages/tokens/** except its package.json (the tier files after the source move, ADR 0001)
//   - platform/tokens/**/*.tokens.json (where the tier files live until then)
//   - packages/*/package.json, only when its "exports" differ from the base (a version bump is not an API change)
//   - platform/index.js and platform/exports/*.js, only when the set of exported names differs (#370)
// A PR with owned changes needs the label agent:pds1-ds-architect. Every agent shares one GitHub identity until the
// GitHub App's bot identities exist, so the label is how a PR says which role made it; a change by another role is
// handed to (or agreed with) the DS Architect, who adds the label. Without PR_LABELS (a merge-queue run) nothing is
// enforced: the PR's own run already was.
import { execFileSync } from 'node:child_process';

const base = process.argv[2];
if (!base) { console.error('usage: check-ownership.mjs <base ref>'); process.exit(2); }
const OWNER = 'agent:pds1-ds-architect';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const show = (ref, f) => { try { return git('show', `${ref}:${f}`); } catch { return null; } };
const exportsOf = (text) => { try { return JSON.stringify(text == null ? null : JSON.parse(text).exports ?? null); } catch { return 'unreadable'; } };

const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
// the export list of @plenix-ds/react (#370): platform/index.js and platform/exports/*.js. A change counts only when the
// set of exported names differs (a path re-pointed from .jsx to .tsx under the same names stays free)
const EXPORT_FILE = /^platform\/(index\.js|exports\/[^/]+\.js)$/;
function exportedNames(ref) {
  const files = ['platform/index.js', ...git('ls-tree', '--name-only', ref, 'platform/exports/').split('\n').filter((f) => /\.js$/.test(f))];
  const names = new Set();
  for (const f of files) {
    const text = show(ref, f) || '';
    for (const m of text.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of m[1].split(',')) {
        const p = part.replace(/^\s*type\s+/, '').trim();
        if (p) names.add(p.split(/\s+as\s+/).pop().trim());
      }
    }
  }
  return names;
}
const owned = [];
if (changed.some((f) => EXPORT_FILE.test(f))) {
  const before = exportedNames(base), after = exportedNames('HEAD');
  const added = [...after].filter((n) => !before.has(n)), removed = [...before].filter((n) => !after.has(n));
  if (added.length || removed.length) owned.push(`platform/index.js + platform/exports (the @plenix-ds/react export list: ${added.length ? 'added ' + added.slice(0, 8).join(', ') : ''}${added.length && removed.length ? '; ' : ''}${removed.length ? 'removed ' + removed.slice(0, 8).join(', ') : ''})`);
}
for (const f of changed) {
  if (f.startsWith('packages/tokens/') && f !== 'packages/tokens/package.json') owned.push(`${f} (token package)`);
  else if (/^platform\/tokens\/.+\.tokens\.json$/.test(f)) owned.push(`${f} (token tier file)`);
  else if (/^packages\/[^/]+\/package\.json$/.test(f) && exportsOf(show(base, f)) !== exportsOf(show('HEAD', f))) owned.push(`${f} ("exports", the public API)`);
}

if (!owned.length) { console.log(`OWNERSHIP_OK (no token tier or public API change in ${changed.length} files)`); process.exit(0); }
if (process.env.PR_LABELS === undefined || process.env.PR_LABELS === '') {
  console.log(`OWNERSHIP_SKIPPED: ${owned.length} owned change(s), but no PR labels here (merge queue); the PR's own run enforces it`);
  process.exit(0);
}
let labels;
try { labels = JSON.parse(process.env.PR_LABELS); } catch { console.log('OWNERSHIP_FAIL: PR_LABELS is not JSON'); process.exit(1); }
if (labels.includes(OWNER)) { console.log(`OWNERSHIP_OK (${owned.length} owned change(s), PR labeled ${OWNER})`); process.exit(0); }
for (const o of owned) console.log(`::error title=ownership::${o}: only pds1-ds-architect changes token tiers and the public API (ADR 0001). Hand the change to the DS Architect, or have it agree and add the label ${OWNER} to this PR.`);
console.log(`OWNERSHIP_FAIL (${owned.length} owned change(s); the PR has no ${OWNER} label)`);
process.exit(1);
