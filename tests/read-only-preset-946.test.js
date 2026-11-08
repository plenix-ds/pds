// Plenix tests · the read-only preset on PropertyList and the read-only Field (#946, D-0106, ADR 0032). Node only.
// The comp tokens of PropertyList take the owner's roles: the porcelain tile and its border, the navy 11px regular label,
// the 13px semibold value; the Field label in a read-only region takes the same label role. And label and value meet 4.5:1
// on the tile in light and dark (CONTRAST_PAIRS).
//   node tests/read-only-preset-946.test.js
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
require('./limit.js');

const ROOT = path.join(__dirname, '..');
let failed = 0;
const check = (n, ok, d) => { if (!shared.check(n, ok, d)) return; if (!ok) { failed++; console.log('FAIL ' + n + (d ? ': ' + d : '')); } };
const comp = JSON.parse(fs.readFileSync(path.join(ROOT, 'platform/tokens/components.tokens.json'), 'utf8'))['plx-comp'];
const val = (k) => (comp[k] || {}).$value;
const want = {
  'property-list-label-text': '{plx-sys.read-only-label}',
  'property-list-value-text': '{plx-sys.content-default}',
  'property-list-value-background': '{plx-sys.read-only-tile}',
  'property-list-value-border-color': '{plx-sys.read-only-tile-border}',
  'field-readonly-label-text': '{plx-sys.read-only-label}',
};
for (const [k, v] of Object.entries(want)) check('plx-comp.' + k + ' = ' + v, val(k) === v, String(val(k)));

const css = fs.readFileSync(path.join(ROOT, 'platform/patterns/PropertyList/property-list.css'), 'utf8');
check('the value draws the tile (background and border)', /__value\{[^}]*background-color:var\(--plx-comp-property-list-value-background\)/.test(css) && /__value\{[^}]*border-color:var\(--plx-comp-property-list-value-border-color\)/.test(css));
for (const r of ['label', 'value']) for (const p of ['font-size', 'font-weight', 'line-height'])
  check('the ' + r + ' takes ' + p + ' from the field-' + r + ' role', css.includes(p + ':var(--plx-sys-text-field-' + r + '-' + p + ')') || (r === 'value' && p === 'font-size' && css.includes('font-size:var(--plx-comp-property-list-value-font-size)')));
check('the deprecated label size token is kept (G3)', (comp['property-list-label-font-size'] || {}).$value === '{plx-sys.text-field-label-font-size}' && !!(comp['property-list-label-font-size'] || {}).$deprecated);
check('the value size tokens point at the field-value size', ['property-list-value-font-size', 'property-list-value-data-font-size'].every((k) => (comp[k] || {}).$value === '{plx-sys.text-field-value-font-size}'));
const fcss = fs.readFileSync(path.join(ROOT, 'platform/components/Field/field.css'), 'utf8');
const rcss = fs.readFileSync(path.join(ROOT, 'platform/system/read-only.css'), 'utf8');
check('a Field label reads the read-only context color', /\.plx-field__label\{[^}]*var\(--plx-comp-field-readonly-context-label-text/.test(fcss));
check('a read-only region publishes it from the comp token', /\[data-plx-readonly="true"\]\{[^}]*--plx-comp-field-readonly-context-label-text:var\(--plx-comp-field-readonly-label-text\)/.test(rcss));

const ts = fs.readFileSync(path.join(ROOT, 'platform/utils/contrast.ts'), 'utf8');
for (const [fg, bg] of [['read-only-label', 'read-only-tile'], ['content-default', 'read-only-tile']])
  check('CONTRAST_PAIRS has ' + fg + ' on ' + bg, new RegExp("fg: '" + fg + "', bg: '" + bg + "'").test(ts));

console.log(failed ? '\nREADONLY_PRESET_FAIL ' + failed : 'READONLY_PRESET_OK');
process.exit(failed ? 1 : 0);
