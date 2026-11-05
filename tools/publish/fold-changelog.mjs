#!/usr/bin/env node
// Fold changelog.d/<pr>.md into CHANGELOG.md for one release (changelog.d/README.md; P0-12, #194/#312).
//
//   node tools/publish/fold-changelog.mjs <version> [--date YYYY-MM-DD] [--upgrading "<text>"]
//
// Every fragment's lines are grouped under their section heading (### Breaking, Added, Changed, Changed (visual),
// Deprecated, Removed, Fixed, Security; any other heading keeps its own name, after these), in fragment order (by PR
// number). The new section goes under "## [Unreleased]", with an "Upgrading from <previous>" note. The fragments are
// deleted. Fails when there is no fragment or the version is already in CHANGELOG.md.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const version = args[0];
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
if (!/^\d+\.\d+\.\d+$/.test(version || '')) { console.error('usage: fold-changelog.mjs <version> [--date YYYY-MM-DD] [--upgrading "<text>"]'); process.exit(2); }
const date = opt('--date', new Date().toISOString().slice(0, 10));
const DIR = 'changelog.d';
const ORDER = ['Breaking', 'Added', 'Changed', 'Changed (visual)', 'Deprecated', 'Removed', 'Fixed', 'Security'];

let log = fs.readFileSync('CHANGELOG.md', 'utf8');
if (log.includes(`## [${version}]`)) { console.log(`FOLD_FAIL: CHANGELOG.md already has ${version}`); process.exit(1); }
const previous = (/^## \[(\d+\.\d+\.\d+)\]/m.exec(log) || [])[1];
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
  .sort((a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0) || a.localeCompare(b));
if (!files.length) { console.log('FOLD_FAIL: changelog.d has no fragment'); process.exit(1); }

const sections = new Map();
for (const f of files) {
  let current = null;
  for (const line of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
    const h = /^###\s+(.+?)\s*$/.exec(line);
    if (h) { current = h[1]; if (!sections.has(current)) sections.set(current, []); continue; }
    if (!current) { if (line.trim()) { console.log(`FOLD_FAIL: ${f}: text before the first ### heading`); process.exit(1); } continue; }
    sections.get(current).push(line);
  }
}
const names = [...ORDER.filter((n) => sections.has(n)), ...[...sections.keys()].filter((n) => !ORDER.includes(n))];
const body = names.map((n) => {
  // one item per line: the blank lines that end each fragment are dropped (a list stays one list)
  const lines = sections.get(n).filter((l) => l.trim()).join('\n');
  return `### ${n}\n${lines}`;
}).join('\n\n');
const upgrading = opt('--upgrading', sections.has('Breaking')
  ? 'See **Breaking** below: each item says what to do instead.'
  : 'Nothing to change. Deprecated names keep working (each says what replaces it). Apps on the CDN loader follow this release by themselves; npm apps update the version as usual.');
const section = `## [${version}] - ${date}\n\n${previous ? `### Upgrading from ${previous}\n${upgrading}\n\n` : ''}${body}\n`;

if (!/^## \[Unreleased\]\s*$/m.test(log)) { console.log('FOLD_FAIL: CHANGELOG.md has no "## [Unreleased]" heading'); process.exit(1); }
log = log.replace(/^## \[Unreleased\]\s*\n/m, `## [Unreleased]\n\n${section}\n`);
fs.writeFileSync('CHANGELOG.md', log);
for (const f of files) fs.unlinkSync(path.join(DIR, f));
console.log(`FOLD_OK ${version}: ${files.length} fragments, sections: ${names.join(', ')}`);
