// Plenix tests · #181: the icon set has calendar-add, balance, gavel and certificate (Material Symbols Sharp names, D-0011).
//   node tests/icons-181.test.js   → ICONS_181_OK
const fs = require('fs'); const path = require('path'); const assert = require('assert/strict');
const root = path.join(__dirname, '..', 'platform');
const map = JSON.parse(fs.readFileSync(path.join(root, 'icons', 'map.json'), 'utf8')).map;
const want = { 'calendar-add': 'calendar_add_on', balance: 'balance', gavel: 'gavel', certificate: 'workspace_premium' };
const glyphs = fs.readFileSync(path.join(root, 'components', 'Icon', 'glyphs.js'), 'utf8');
for (const [n, sym] of Object.entries(want)) {
  assert.equal(map[n], sym, n + ' maps to ' + sym);
  assert.ok(glyphs.includes('"' + n + '"'), n + ' is in the built glyph names (run build-icons.js)');
}
console.log('ICONS_181_OK');
