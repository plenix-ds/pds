// #369 (ADR 0011): every converted file exports its <Name>Props type.
const fs = require('fs'); const path = require('path');
let bad = 0;
for (const n of ['CodeBlock', 'RefineMenu', 'SuggestedEdit']) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'platform', 'components', n, n + '.tsx'), 'utf8');
  if (!new RegExp('^export type ' + n + 'Props\\b', 'm').test(src)) { console.log('MISSING export type ' + n + 'Props'); bad++; }
}
if (bad) { console.log('PROPS_EXPORT_FAIL ' + bad); process.exit(1); }
console.log('PROPS_EXPORT_OK 3 types');
