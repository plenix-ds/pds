// Plenix tests · the 12px type floor and the retired density file (#206, DESIGN.md §12 items 4 and 7). Node only (no browser).
// Fails when any token file under platform/tokens/ points a value at plx-ref.font-size-09, -10 or -11 (the retired steps
// below 12px), when a utility class still sets one of them, when the retired "standard-comfortable" density file or its
// build entries come back, or when plx-sys.radius-control (the one token that file held) is no longer defined.
// Prints TYPE_FLOOR_OK or each failure, and exits 1 on a failure.
//   node tests/type-floor-206.test.js
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
require('./limit.js');

const ROOT = path.join(__dirname, '..');
const TOKENS = path.join(ROOT, 'platform', 'tokens');
const RETIRED = /\{plx-ref\.font-size-(09|10|11)\}/;
let failed = 0;
function check(name, ok, detail) {
  if (!shared.check(name, ok, detail)) return;
  if (!ok) { failed++; console.log('FAIL ' + name + (detail ? ': ' + detail : '')); }
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(path.join(dir, e.name))
    : e.name.endsWith('.json') ? [path.join(dir, e.name)] : []);
}
function values(node, at, out) {
  if (node && typeof node === 'object') {
    if ('$value' in node) out.push([at, node.$value]);
    else for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) values(v, at ? at + '.' + k : k, out);
  }
  return out;
}

const below = [];
for (const file of files(TOKENS)) {
  for (const [name, value] of values(JSON.parse(fs.readFileSync(file, 'utf8')), '', [])) {
    if (RETIRED.test(String(value))) below.push(path.relative(TOKENS, file) + ' ' + name);
  }
}
check('Type floor: no token points at a size below 12px', below.length === 0, below.length + ' tokens: ' + below.slice(0, 5).join(', '));

const typo = values(JSON.parse(fs.readFileSync(path.join(TOKENS, 'semantic', 'typography.tokens.json'), 'utf8')), '', []);
for (const role of ['caption', 'eyebrow']) {
  const v = (typo.find(([n]) => n === 'plx-sys.text-' + role + '-font-size') || [])[1];
  check('Type floor: the ' + role + ' role is 12px', v === '{plx-ref.font-size-100}', String(v));
}

const utilities = fs.readFileSync(path.join(ROOT, 'platform', 'system', 'utilities.css'), 'utf8');
check('Type floor: no utility class sets a size below 12px', !/var\(--plx-ref-font-size-(09|10|11)\)/.test(utilities));

check('Density: the retired standard-comfortable file is gone', !fs.existsSync(path.join(TOKENS, 'semantic.density-standard-comfortable.tokens.json')));
const build = fs.readFileSync(path.join(TOKENS, 'build.json'), 'utf8');
check('Density: build.json has no standard-comfortable entry', !build.includes('standard-comfortable'));
check('Density: no Style Dictionary config for standard-comfortable', !fs.existsSync(path.join(ROOT, 'style-dictionary', 'index', 'density-standard-comfortable.config.json')));
const semantic = values(JSON.parse(fs.readFileSync(path.join(TOKENS, 'semantic.tokens.json'), 'utf8')), '', []);
check('Density: plx-sys.radius-control is still defined (4px)', semantic.some(([n, v]) => n === 'plx-sys.radius-control' && v === '{plx-sys.radius-control-sm}'));

console.log(failed ? 'TYPE_FLOOR_FAIL ' + failed : 'TYPE_FLOOR_OK');
process.exit(failed ? 1 : 0);
