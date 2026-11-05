// Plenix · check-system rule "variant-records" (docs/adr/0013, #117): every variation of the design spec has its own record
// with a unique id (`<item>--<group>-<name>`, tools/variant-records.js), and every side table (platform/standards/variants/
// <field>.json) and redirect names real variant ids. A duplicate id would make two variations one page and one API record.
// Alone: node check-system.rules/variant-records.js   -> VARIANT_RECORDS_OK (<n> variations), or the problems and exit 1
const path = require('path');
const V = require('../tools/variant-records.js');

const NAME = 'variant-records';
const ROOT = path.join(__dirname, '..');

function findings() {
  const recs = V.loadInventory(ROOT);
  if (!recs) return { list: [], count: 0 };
  const r = V.derive(recs, ROOT);
  return { list: r.problems.map((text) => ({ file: path.join(ROOT, 'platform', 'design-system'), text })), count: r.variants.length };
}

function check({ add }) { for (const f of findings().list) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME };

if (require.main === module) {
  const { list, count } = findings();
  list.forEach((f) => console.log('  ' + f.text));
  console.log(list.length ? 'VARIANT_RECORDS_FAIL (' + list.length + ')' : 'VARIANT_RECORDS_OK (' + count + ' variations)');
  process.exit(list.length ? 1 : 0);
}
