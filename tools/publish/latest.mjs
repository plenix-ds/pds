#!/usr/bin/env node
// The next cdn/latest.json (P0-12, #194). CTM reads it every 30 minutes and auto-upgrades, so its shape is a contract:
// every field of the current file is kept (pins above all: "pins": {"ctm": "<version>"} holds CTM on a version);
// only "latest" changes. Never removes or renames a field.
//
//   node tools/publish/latest.mjs <version> --current <file|url> --out <file>
//
// Prints the diff and fails (exit 1) when the result would lose or rename a field, change a pin, or move "latest"
// backwards. A pre-release (x.y.z-…) is never made the latest: it is refused.
import fs from 'node:fs';

const args = process.argv.slice(2);
const version = args[0];
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const current = opt('--current');
const out = opt('--out');
if (!version || !current || !out) { console.error('usage: latest.mjs <version> --current <file|url> --out <file>'); process.exit(2); }

const parse = (v) => (v.match(/^(\d+)\.(\d+)\.(\d+)$/) || []).slice(1).map(Number);
const cmp = (a, b) => { const x = parse(a), y = parse(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; };

const text = /^https?:/.test(current) ? await (await fetch(current, { cache: 'no-store' })).text() : fs.readFileSync(current, 'utf8');
const old = JSON.parse(text);
const errors = [];
if (typeof old.latest !== 'string' || !old.pins || typeof old.pins !== 'object') errors.push('the current latest.json has no "latest" string or no "pins" object: refusing to guess its shape');
if (!parse(version).length) errors.push(`${version} is not a release version (x.y.z); a pre-release never becomes the latest`);
else if (typeof old.latest === 'string' && parse(old.latest).length && cmp(version, old.latest) <= 0) errors.push(`${version} is not newer than the current latest ${old.latest}`);

const next = { ...old, latest: version, pins: old.pins };
for (const k of Object.keys(old)) if (!(k in next)) errors.push(`field "${k}" would be lost`);
if (JSON.stringify(next.pins) !== JSON.stringify(old.pins)) errors.push('pins would change');

const show = (o) => JSON.stringify(o, null, 1);
console.log('latest.json now:\n' + show(old) + '\nlatest.json next:\n' + show(next));
for (const k of new Set([...Object.keys(old), ...Object.keys(next)])) {
  if (JSON.stringify(old[k]) !== JSON.stringify(next[k])) console.log(`diff: ${k}: ${JSON.stringify(old[k])} -> ${JSON.stringify(next[k])}`);
}
if (errors.length) { for (const e of errors) console.log(`LATEST_FAIL: ${e}`); process.exit(1); }
fs.writeFileSync(out, show(next) + '\n');
console.log(`LATEST_OK -> ${out}`);
