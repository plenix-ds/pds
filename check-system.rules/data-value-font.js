// Plenix · check-system rule "data-value-font" (owner, #252 choice A): a Select or Combobox that holds a number or a date shows it in the data font.
// What it rejects:
//   helper   utils/dataValue.ts without isDataValue, or the helper no longer recognizing a number, a date and a size, or recognizing a plain word
//   use      Select (Input.tsx) or Combobox no longer asking isDataValue when their data prop is not set, or going back to `data && 'plx-input--data'`
// Alone: node check-system.rules/data-value-font.js     -> DATA_VALUE_FONT_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'data-value-font';
const ROOT = path.join(__dirname, '..');
const read = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { return ''; } };

function check({ add }) {
  const hf = path.join(ROOT, 'platform/utils/dataValue.ts'), h = read('platform/utils/dataValue.ts');
  if (!/export const isDataValue/.test(h)) add(NAME, hf, 0, 'dataValue.ts must export isDataValue');
  else {
    // the helper is TypeScript: Babel's typescript preset strips its types before it runs here
    const js = require('@babel/standalone').transform(h, { filename: 'dataValue.ts', presets: ['typescript'] }).code;
    const fn = new Function(js.replace(/export const isDataValue/, 'const isDataValue') + '; return isDataValue;')();
    for (const yes of ['10', '1,000', '2026-10-25', 'Oct 25, 2026', 'September 3, 2026', '25 Oct 2026', '10:42 AM', '12 MB', '3 kB', 'v1.2.3', 'report.csv', 'IMG_2041.jpg', 'plenix-0.73.0.zip', '#1234']) if (!fn(yes)) add(NAME, hf, 0, '"' + yes + '" must be a data value');
    for (const no of ['Compact', '15 minutes', 'Oct 25, 2026 and later', 'Light', '', 'Mark 5', 'Market 3', 'Junior 2', '3 Decisions', 'Node.js', 'Vue.js', 'Character.ai', 'Read me.md', 'Export as report.csv', '5 b']) if (fn(no)) add(NAME, hf, 0, '"' + no + '" must not be a data value');
  }
  for (const [f, re] of [['platform/components/Input/Input.tsx', /data === undefined \? !!\(current && isDataValue\(/], ['platform/components/Combobox/Combobox.tsx', /data === undefined \? isDataValue\(/]]) {
    const s = read(f), file = path.join(ROOT, f);
    if (!re.test(s)) add(NAME, file, 0, 'a Select or Combobox with no data prop must ask isDataValue about what it shows');
    if (/\bdata && 'plx-input--data'/.test(s) && /Combobox/.test(f)) add(NAME, file, 0, 'the data font is asData, not the data prop alone');
  }
}
module.exports = { name: NAME, check };

if (require.main === module) {
  const findings = [];
  check({ add: (rule, file, line, text) => findings.push(path.relative(ROOT, file) + (line ? ':' + line : '') + '  ' + text) });
  if (findings.length) { findings.forEach((x) => console.log(x)); console.log('DATA_VALUE_FONT_FAIL (' + findings.length + ')'); process.exit(1); }
  console.log('DATA_VALUE_FONT_OK');
}
