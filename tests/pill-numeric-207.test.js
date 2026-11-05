// Plenix tests · DataGrid number cells and equal pill height (#207, DESIGN.md §12 items 5 and 6; checks 10 and 11).
// Node only (no browser): reads the component stylesheets. The measured pill heights in a row are check 11's browser test.
// Fails when the DataGrid's end-aligned (number) cell rule has no tabular figures, or when the plain DataPill drops the
// pill's minimum block size (a plain pill next to a filled one in a row would be shorter).
// Prints PILL_NUMERIC_OK or each failure, and exits 1 on a failure.
//   node tests/pill-numeric-207.test.js
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
require('./limit.js');

const ROOT = path.join(__dirname, '..', 'platform', 'components');
let failed = 0;
function check(name, ok, detail) {
  if (!shared.check(name, ok, detail)) return;
  if (!ok) { failed++; console.log('FAIL ' + name + (detail ? ': ' + detail : '')); }
}
function rules(css, selector) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) if (m[1].includes(selector)) out.push(m[2]);
  return out;
}

const grid = fs.readFileSync(path.join(ROOT, 'DataGrid', 'data-grid.css'), 'utf8');
const end = rules(grid, '.plx-data-grid__cell--align-right').filter((body) => /text-align:\s*end/.test(body));
check('DataGrid: number cells are end-aligned', end.length > 0);
check('DataGrid: number cells use tabular figures', end.some((body) => /font-variant-numeric:\s*tabular-nums/.test(body)));

const pill = fs.readFileSync(path.join(ROOT, 'DataPill', 'data-pill.css'), 'utf8');
const plain = rules(pill, '.plx-data-pill--plain');
check('DataPill: the plain pill exists', plain.length > 0);
check('DataPill: the plain pill keeps the pill height', plain.every((body) => !/min-block-size:\s*0\b/.test(body)));
check('DataPill: a pill never wraps', rules(pill, '.plx-data-pill').some((body) => /white-space:\s*nowrap/.test(body)));

console.log(failed ? 'PILL_NUMERIC_FAIL ' + failed : 'PILL_NUMERIC_OK');
process.exit(failed ? 1 : 0);
