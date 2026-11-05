// Plenix · check-system rule "type-floor" (plan §7 check 3, #206, #189): no text below 12px.
// On the token source (platform/tokens/**/*.tokens.json), a token whose name has "font-size" is a finding when:
//   below   its value, followed through its references, is a length under 12px (1rem = 16px), unless the token itself
//           is $deprecated (plx-ref.font-size-09, -10, -11 stay until 2.0.0 so old readers keep working);
//   reads   it refers to a $deprecated font-size token (a new reader of a step going away).
// In stylesheets, a font size comes from a type role, never the raw scale: Stylelint
// (declaration-property-value-disallowed-list, font-size and var(--plx-ref-font-size-…)).
// Alone: node check-system.rules/type-floor.js   -> TYPE_FLOOR_OK, or the findings and exit 1
const path = require('path');
const G = require('./token-graph.js');

const NAME = 'type-floor';
const FLOOR = 12;
const px = (v) => { const m = String(v).trim().match(/^(\d*\.?\d+)(px|rem)$/); return m ? Number(m[1]) * (m[2] === 'rem' ? 16 : 1) : null; };

function findings(docs = G.load()) {
  const defs = G.definitions(docs), byName = new Map();
  for (const d of defs) if (!byName.has(d.tier + '.' + d.name)) byName.set(d.tier + '.' + d.name, d);
  const resolve = (d, depth = 0) => {
    if (!d || depth > 20) return null;
    if (!d.refs.length) return d.value;
    if (d.refs.length !== 1 || !/^\{[^}]+\}$/.test(String(d.value).trim())) return null;
    return resolve(byName.get(d.refs[0].tier + '.' + d.refs[0].name), depth + 1);
  };
  const out = [];
  for (const d of defs) {
    if (!/(^|-)font-size(-|$)/.test(d.name)) continue;
    const self = d.tier + '.' + d.name;
    for (const r of d.refs) {
      const t = byName.get(r.tier + '.' + r.name);
      if (t && t.deprecated && /(^|-)font-size(-|$)/.test(t.name) && !d.deprecated) out.push({ file: d.file, text: self + ' reads ' + r.tier + '.' + r.name + ', a deprecated size: use a type role (plx-sys.text-*-font-size)' });
    }
    const size = px(resolve(d));
    if (size !== null && size < FLOOR && !d.deprecated) out.push({ file: d.file, text: self + ' is ' + size + 'px, under the ' + FLOOR + 'px type floor: use a type role (plx-sys.text-*-font-size)' });
  }
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME, FLOOR };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(G.ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'TYPE_FLOOR_FAIL (' + list.length + ')' : 'TYPE_FLOOR_OK');
  process.exit(list.length ? 1 : 0);
}
