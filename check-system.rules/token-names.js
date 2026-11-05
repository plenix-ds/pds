// Plenix · check-system rule "token-names" (plan §7 check 7, docs/adr/0002): a token name says its role or step, never its value.
// A name (any tier) is a finding when one of its parts:
//   unit       is a number with a unit (4px, 13rem, 200ms, 50%): radius-card-12px, size-4px
//   value      is a bare number equal to the token's own value, resolved through its references, read as px (1rem =
//              16px), as a percent (0.3 -> 30) or as ms (0.2s -> 200): font-size-13 (0.8125rem), opacity-30 (0.3),
//              font-weight-regular-400 (400)
//   breakpoint is a bare number equal to a breakpoint's px value (a plx-ref breakpoint-*): from-1440
// Ordinal steps (color-blue-500, 2xs … 4xl) are fine: their number is not their value. A $deprecated token (the old name a
// rename keeps as an alias until 2.0.0, docs/adr/0002) is skipped.
// Known findings (the 0.x debt, measured 2026-11-05) are in token-names.baseline.json; it only shrinks: a known finding
// that is renamed must be removed from it (a stale entry is a finding). New findings fail. Only pds1-ds-architect edits it.
// Alone: node check-system.rules/token-names.js   -> TOKEN_NAMES_OK, or the findings and exit 1
const path = require('path');
const G = require('./token-graph.js');

const NAME = 'token-names';
const BASELINE = path.join(__dirname, 'token-names.baseline.json');
const UNIT = /^\d*\.?\d+(px|rem|em|ms|s|pt|deg|vh|vw|pct|percent)$/;

// the numbers a literal value can be read as: 0.8125rem -> 13; 0.3 -> 0.3, 30; 200ms -> 200; 0.2s -> 200
function readings(value) {
  const out = new Set();
  const s = String(value).trim();
  const m = s.match(/^(-?\d*\.?\d+)(px|rem|em|ms|s|%)?$/);
  if (!m) return out;
  const n = parseFloat(m[1]), u = m[2] || '';
  const add = (x) => out.add(Math.round(x * 1000) / 1000);
  add(n);
  if (u === 'rem' || u === 'em') add(n * 16);
  if (u === 's') add(n * 1000);
  if (!u && n > 0 && n < 1) add(n * 100);
  return out;
}

function raw(docs) {
  const defs = G.definitions(docs);
  const byName = new Map();
  for (const d of defs) if (!byName.has(d.tier + '.' + d.name)) byName.set(d.tier + '.' + d.name, d);
  const resolve = (d, depth = 0) => {
    if (!d || depth > 20) return null;
    if (!d.refs.length) return d.value;
    if (d.refs.length !== 1 || typeof d.value !== 'string' || !/^\{[^}]+\}$|^var\([^)]*\)$/.test(d.value.trim())) return null;
    return resolve(byName.get(d.refs[0].tier + '.' + d.refs[0].name), depth + 1);
  };
  const breakpoints = new Set();
  for (const d of defs) if (d.tier === 'plx-ref' && /^breakpoint-/.test(d.name)) for (const r of readings(d.value)) if (r >= 320) breakpoints.add(r);
  const out = [], seen = new Set();
  for (const d of defs) {
    const self = d.tier + '.' + d.name;
    if (seen.has(self)) continue;
    if (d.deprecated) continue;   // a deprecated name (a renamed token's alias, docs/adr/0002) is on its way out
    const parts = d.name.split('-');
    const value = resolve(d), read = value == null ? new Set() : readings(value);
    let why = null;
    for (const p of parts) {
      if (UNIT.test(p)) { why = 'has a unit in its name (' + p + ')'; break; }
      if (/^\d+$/.test(p)) {
        const n = parseInt(p, 10);
        if (read.has(n)) { why = 'has its value in its name (' + p + ' = ' + value + ')'; break; }
        if (breakpoints.has(n)) { why = 'has a breakpoint value in its name (' + p + '): name the breakpoint by role'; break; }
      }
    }
    if (why) { seen.add(self); out.push({ key: self, file: d.file, text: self + ' ' + why }); }
  }
  return out;
}

function findings(docs = G.load(), known = G.baseline(BASELINE)) {
  const list = raw(docs), keys = new Set(list.map((f) => f.key));
  const out = list.filter((f) => !known.has(f.key)).map(({ file, text }) => ({ file, text }));
  for (const k of [...known].sort()) if (!keys.has(k)) out.push({ file: BASELINE, text: 'fixed, remove it from the baseline: ' + k });
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, raw, readings, NAME, BASELINE };

if (require.main === module) {
  if (process.argv.includes('--write-baseline')) {
    const keys = [...new Set(raw(G.load()).map((f) => f.key))].sort();
    require('fs').writeFileSync(BASELINE, JSON.stringify({ $description: 'token-names (check 7) known findings from 0.x, measured 2026-11-05. Shrink-only: remove an entry when it is renamed; never add one (docs/adr/0002).', known: keys }, null, 1) + '\n');
    console.log('wrote ' + keys.length + ' known findings'); process.exit(0);
  }
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(G.ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'TOKEN_NAMES_FAIL (' + list.length + ')' : 'TOKEN_NAMES_OK');
  process.exit(list.length ? 1 : 0);
}
