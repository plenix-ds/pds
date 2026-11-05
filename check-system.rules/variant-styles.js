// Plenix · check-system rule "variant-styles" (docs/adr/0015, #116): each variation documents what it sets, read from its
// own rules in the stylesheets (tools/variant-styles.js) or written in platform/standards/variants/styles.json.
//   neither   a variation with neither is listed in variant-styles.baseline.json, which only shrinks: a new variation needs
//             one or the other, and a listed one that gains a table must leave the baseline
//   tokens    every token a styles.json row names is defined (in the token index)
// Alone: node check-system.rules/variant-styles.js [--write-baseline]   -> VARIANT_STYLES_OK (css n, table n, neither n)
const fs = require('fs');
const path = require('path');
const V = require('../tools/variant-records.js');
const S = require('../tools/variant-styles.js');

const NAME = 'variant-styles';
const ROOT = path.join(__dirname, '..');
const BASELINE = path.join(__dirname, 'variant-styles.baseline.json');

function run() {
  const recs = V.loadInventory(ROOT); if (!recs) return null;
  const r = V.derive(recs, ROOT), counts = S.apply(r.variants, recs, ROOT);
  return { r, counts };
}
function findings() {
  const x = run(); if (!x) return { list: [], counts: null };
  const known = new Set((() => { try { return JSON.parse(fs.readFileSync(BASELINE, 'utf8')).known || []; } catch (e) { return []; } })());
  const neither = new Set(x.counts.neither), list = [];
  for (const id of neither) if (!known.has(id)) list.push({ file: path.join(ROOT, 'platform', 'standards', 'variants', 'styles.json'), text: id + ' documents nothing it sets: no rule of its own selector in its stylesheet and no styles.json entry (docs/adr/0015)' });
  for (const id of known) if (!neither.has(id)) list.push({ file: BASELINE, text: 'covered now, remove it from the baseline: ' + id });
  let names = new Set();
  try { names = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'platform', 'tokens', 'tokens.index.json'), 'utf8')).tokens.map((t) => t.name)); } catch (e) { /* no index */ }
  for (const v of x.r.variants) if (v.setsSource === 'table') for (const row of v.sets) if (row.token && names.size && !names.has(row.token)) list.push({ file: path.join(ROOT, 'platform', 'standards', 'variants', 'styles.json'), text: v.id + ': ' + row.token + ' is not a token' });
  return { list, counts: x.counts };
}

function check({ add }) { for (const f of findings().list) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME, BASELINE };

if (require.main === module) {
  if (process.argv.includes('--write-baseline')) {
    const x = run(); fs.writeFileSync(BASELINE, JSON.stringify({ $description: 'variant-styles (docs/adr/0015): variations that document nothing they set yet (no rule of their own selector, no styles.json entry), measured 2026-11-05. Shrink-only: a variation leaves when it gains a table; none is added.', known: x.counts.neither.slice().sort() }, null, 1) + '\n');
    console.log('wrote ' + x.counts.neither.length); process.exit(0);
  }
  const { list, counts } = findings();
  list.slice(0, 30).forEach((f) => console.log('  ' + f.text));
  const c = counts ? ' (css ' + counts.css + ', table ' + counts.table + ', neither ' + counts.neither.length + ')' : '';
  console.log(list.length ? 'VARIANT_STYLES_FAIL (' + list.length + ')' + c : 'VARIANT_STYLES_OK' + c);
  process.exit(list.length ? 1 : 0);
}
