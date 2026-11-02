// Plenix · check-system rule "field-background" (owner, 2026-10-14; changed 2026-10-15: "Gray-400 border all around with
// bg of #fcfcfc"): the background of every text field (input, text area, select, combobox, search, number, OTP, input
// group, tag input) is the field background role, plx-sys.field-background (#fcfcfc in light, gray-50), or a field token
// that already points at it.
// Allowed exceptions, each an owner decision:
//   input-readonly-background                 read-only fields stay the sunken gray (they cannot be edited)
//   input-filled-background                   the "filled" appearance, an option that is never the default
//   input-underline-background                the "underline" appearance has no fill
//   search-on-accent-input-background         the search in the blue app header sits on the blue bar
//   app-header-frost-search-input-background  the search in the frosted app header
// So:
//   "search-input-background": { "$value": "{plx-sys.field-background}" }     ok
//   "search-input-background": { "$value": "{plx-sys.fill-neutral}" }         finding
// The rule is a module check-style.js runs (a style rule: check-common.js, STYLE_MODULES) (it loads every file in check-system.rules/):
//   require('./check-system.rules/field-background.js').check({ add })   add(rule, file, line, text)
// Alone: node check-system.rules/field-background.js     -> FIELD_BACKGROUND_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { css } = require('../tools/token-value.js');   // a $value as CSS text: the W3C typed values too (#872)
const { CONDITION_FILE } = require('./token-sets.js');

const NAME = 'field-background';
const ROOT = path.join(__dirname, '..');
const FIELD = /^(input|search-input|select|combobox|text-area|textarea|number-input|otp-input-cell|input-group|tag-input|pagination-select)-background$/;
const ALLOWED = ['input-readonly-background', 'input-filled-background', 'input-underline-background', 'search-on-accent-input-background', 'app-header-frost-search-input-background'];
const WHITE = '{plx-sys.field-background}';

// the token files with component tokens: components.tokens.json and components/*.tokens.json
function files(root) {
  const tok = path.join(root, 'platform', 'tokens'), out = [];
  if (fs.existsSync(path.join(tok, 'components.tokens.json'))) out.push(path.join(tok, 'components.tokens.json'));
  const dir = path.join(tok, 'components');
  // a condition set (#372 step 4: <name>.forced-colors.tokens.json) holds a token's value under a condition, never its base value
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.tokens.json') && !CONDITION_FILE.test(x)).sort()) out.push(path.join(dir, f));
  return out;
}

// the findings of one set of component tokens: [text]; `all` resolves {plx-comp.x} references to their source
function scan(comp, all) {
  const out = [];
  const resolve = (v, seen) => { const m = /^\{plx-comp\.([a-z0-9-]+)\}$/.exec(v || ''); if (!m || seen.has(m[1]) || !all[m[1]]) return v; seen.add(m[1]); return resolve(css(all[m[1]].$value), seen); };
  for (const [name, t] of Object.entries(comp || {})) {
    if (!FIELD.test(name) || ALLOWED.includes(name) || !t) continue;
    const v = resolve(css(t.$value), new Set());
    if (v !== WHITE) out.push('--plx-comp-' + name + ' is ' + css(t.$value) + ': a text field\'s background is the field background role ' + WHITE);
  }
  return out;
}

function check({ add }) {
  const all = {}, per = [];
  for (const f of files(ROOT)) { let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { continue; } const c = j['plx-comp'] || {}; Object.assign(all, c); per.push([f, c]); }
  for (const [f, c] of per) for (const text of scan(c, all)) add(NAME, f, 0, text);
}

module.exports = { name: NAME, check, scan };

if (require.main === module) {
  const found = [];
  check({ add: (rule, file, line, text) => found.push(path.relative(ROOT, file).split(path.sep).join('/') + '  ' + text) });
  const fx = [[{ 'search-input-background': { $value: WHITE } }, 0], [{ 'search-input-background': { $value: '{plx-sys.fill-neutral}' } }, 1],
    [{ 'input-readonly-background': { $value: '{plx-sys.surface-sunken}' } }, 0], [{ 'input-group-background': { $value: '{plx-comp.input-background}' }, 'input-background': { $value: WHITE } }, 0],
    [{ 'select-background': { $value: '#fff' } }, 1]];
  fx.forEach(([c, n]) => { const got = scan(c, c).length; if (got !== n) found.push('fixture: ' + JSON.stringify(c) + ' gives ' + got + ' finding(s), expected ' + n); });
  found.forEach((x) => console.log('FAIL ' + x));
  console.log(found.length ? '\n' + found.length + ' finding(s)' : 'FIELD_BACKGROUND_OK (' + fx.length + ' fixtures)');
  process.exit(found.length ? 1 : 0);
}
