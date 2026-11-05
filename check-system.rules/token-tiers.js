// Plenix · check-system rule "token-tiers" (plan §7 check 6, docs/adr/0002): token tiers go ref -> sys -> comp, no skipping.
//   plx-ref   refers only to plx-ref; the only tier that holds literal values (a number with a unit, a %, a color)
//   plx-sys   refers only to plx-ref or plx-sys
//   plx-comp  refers only to plx-sys or to its own component's plx-comp tokens (never to plx-ref, never to another
//             component's tokens); the component is the platform/tokens/components/<name>.tokens.json its name starts with
// A plx-sys or plx-comp value may still be a CSS keyword (none, auto, initial, transparent, currentColor, 0) or a
// forced-colors system color (Canvas, Highlight, GrayText …), or transparent (written typed as rgba(0, 0, 0, 0) since
// #872): those are not values a palette can hold.
// Known findings (the 0.x debt, measured 2026-11-05) are in token-tiers.baseline.json; it only shrinks: a known finding
// that is fixed must be removed from it (a stale entry is a finding). New findings fail. Only pds1-ds-architect edits it.
// Alone: node check-system.rules/token-tiers.js   -> TOKEN_TIERS_OK, or the findings and exit 1
const path = require('path');
const G = require('./token-graph.js');
const { transparent } = require('../tools/token-value.js');   // a typed fully transparent color is the keyword transparent (#872)

const NAME = 'token-tiers';
const BASELINE = path.join(__dirname, 'token-tiers.baseline.json');
const ALLOWED = { 'plx-ref': ['plx-ref'], 'plx-sys': ['plx-ref', 'plx-sys'], 'plx-comp': ['plx-sys', 'plx-comp'] };
// a literal a palette would hold: a number with a unit or %, a hex color, a color function
const LITERAL = /(^|[\s(,])-?(\d*\.)?\d+(px|rem|em|ms|s|%|deg|vh|vw|pt)\b|#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;

// raw findings, before the baseline: [{ key, file, text }]
function raw(docs) {
  const defs = G.definitions(docs), comps = G.components(docs);
  const out = [], seen = new Set();
  const push = (key, file, text) => { if (!seen.has(key)) { seen.add(key); out.push({ key, file, text }); } };
  for (const d of defs) {
    const self = d.tier + '.' + d.name;
    for (const r of d.refs) {
      const target = r.tier + '.' + r.name;
      if (!ALLOWED[d.tier].includes(r.tier)) {
        const why = d.tier === 'plx-comp' && r.tier === 'plx-ref' ? 'skips the system tier: point it to a plx-sys role' : 'refers up the tiers (ref -> sys -> comp)';
        push(self + ' -> ' + target, d.file, self + ' -> ' + target + ' ' + why);
      } else if (d.tier === 'plx-comp' && r.tier === 'plx-comp') {
        const mine = G.componentOf(d.name, comps), theirs = G.componentOf(r.name, comps);
        if (mine && theirs && mine !== theirs) push(self + ' -> ' + target, d.file, self + ' -> ' + target + ' uses another component\'s token (' + theirs + '): share a plx-sys role instead');
      }
    }
    if (d.tier !== 'plx-ref' && !d.refs.length && !transparent(d.raw) && LITERAL.test(typeof d.value === 'string' ? d.value : JSON.stringify(d.value))) {
      push(self + ' = literal', d.file, self + ' holds a literal (' + JSON.stringify(d.value) + '): only plx-ref holds values');
    }
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
module.exports = { check, findings, raw, NAME, BASELINE };

if (require.main === module) {
  if (process.argv.includes('--write-baseline')) {
    const keys = [...new Set(raw(G.load()).map((f) => f.key))].sort();
    require('fs').writeFileSync(BASELINE, JSON.stringify({ $description: 'token-tiers (check 6) known findings from 0.x, measured 2026-11-05. Shrink-only: remove an entry when it is fixed; never add one (docs/adr/0002).', known: keys }, null, 1) + '\n');
    console.log('wrote ' + keys.length + ' known findings'); process.exit(0);
  }
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(G.ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'TOKEN_TIERS_FAIL (' + list.length + ')' : 'TOKEN_TIERS_OK');
  process.exit(list.length ? 1 : 0);
}
