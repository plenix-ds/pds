// Plenix · shared reader for the token rules token-tiers (check 6) and token-names (check 7), docs/adr/0002.
// Not a rule itself (no check export). Reads every platform/tokens/**/*.tokens.json and returns each definition of a
// plx-ref, plx-sys or plx-comp token: { tier, name, value, file, refs: [{ tier, name }], deprecated }. A reference is
// {plx-<tier>.<name>} or, in a condition set, var(--plx-<tier>-<name>).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TIERS = ['plx-ref', 'plx-sys', 'plx-comp'];
const REF = /\{(plx-ref|plx-sys|plx-comp)\.([^}]+)\}|var\(--(plx-ref|plx-sys|plx-comp)-([a-z0-9-]+)/g;

function walkFiles(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const n of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) walkFiles(p, out);
    else if (/\.tokens\.json$/.test(n)) out.push(p);
  }
  return out;
}

function refsOf(value) {
  const s = typeof value === 'string' ? value : JSON.stringify(value);
  const out = [];
  for (const m of s.matchAll(REF)) out.push({ tier: m[1] || m[3], name: m[2] || m[4] });
  return out;
}

// docs: [{ file, data }] (data = parsed JSON). Returns the definitions in file order.
function definitions(docs) {
  const out = [];
  for (const { file, data } of docs) {
    for (const tier of TIERS) {
      const walk = (o, at) => {
        if (!o || typeof o !== 'object') return;
        if ('$value' in o) { out.push({ tier, name: at.join('-'), value: o.$value, file, refs: refsOf(o.$value), deprecated: '$deprecated' in o }); return; }
        for (const k of Object.keys(o)) if (k[0] !== '$') walk(o[k], at.concat(k));
      };
      if (data && data[tier]) walk(data[tier], []);
    }
  }
  return out;
}

function load(root = ROOT) {
  const docs = [];
  for (const file of walkFiles(path.join(root, 'platform', 'tokens'), [])) {
    try { docs.push({ file, data: JSON.parse(fs.readFileSync(file, 'utf8')) }); } catch (e) { /* token-sets reports invalid JSON */ }
  }
  return docs;
}

// the component names: one per platform/tokens/components/<name>[.<context>].tokens.json
function components(docs) {
  const set = new Set();
  for (const { file } of docs) {
    if (path.basename(path.dirname(file)) === 'components') set.add(path.basename(file).replace(/\..*$/, ''));
  }
  return [...set].sort((a, b) => b.length - a.length);
}
// the component a plx-comp token belongs to: the longest component name it starts with, or null
const componentOf = (name, comps) => comps.find((c) => name === c || name.startsWith(c + '-')) || null;

// a shrink-only baseline: { "$description": "...", "known": ["key", ...] }
function baseline(file) {
  try { return new Set(JSON.parse(fs.readFileSync(file, 'utf8')).known || []); } catch (e) { return new Set(); }
}

module.exports = { ROOT, TIERS, load, definitions, components, componentOf, baseline, refsOf };
