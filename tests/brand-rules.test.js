// Plenix tests · the brand rules (library wave 3, Brand application): platform/brand/brand-rules.json and the brand tokens
// (platform/tokens/components/brand.tokens.json) agree. Every token the rules name exists; the minimum sizes and the size
// steps are the tokens' values; each clear space is on the 4px grid and at least the rules' share of its mark; the files
// brand.json names exist. No browser: it reads the token source.
//   node tests/brand-rules.test.js
//   TEST_SCOPE=full: always; by default (tests/changed.js) when platform/brand, the brand tokens, a global file or this test changed
const shared = require('./check.js');   // the shared check helper: parts (TEST_ONLY) and the results file (TEST_RESULTS)
const fs = require('fs');
const path = require('path');
const { css: tokenCss } = require('../tools/token-value.js');   // a $value as CSS text: the W3C typed values too (#872)
const changed = require('./changed.js');
require('./limit.js');
if (!changed.wants({ units: ['brand', 'components/Brand'] })) changed.none('BRAND_RULES_OK 0 checks');

const ROOT = path.join(__dirname, '..');
const BRAND = path.join(ROOT, 'platform', 'brand');
const TOK = path.join(ROOT, 'platform', 'tokens');
if (!fs.existsSync(path.join(BRAND, 'brand-rules.json'))) {
  console.log('NOTE: platform/brand/brand-rules.json is not there; the brand rules are skipped');
  console.log('BRAND_RULES_OK 0 checks (skipped)');
  process.exit(0);
}
const res = [], check = (n, ok, d) => { if (shared.check(n, ok, d)) res.push([n, !!ok, d || '']); };
const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// every token of the source, by tier and name ({ 'plx-ref': { 'size-16px': '16px' }, … }); the base files win over the
// density and interaction contexts, which only restate a value for their context
const TIERS = { 'plx-ref': {}, 'plx-sys': {}, 'plx-comp': {} };
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (/\.tokens\.json$/.test(e.name)) files.push(f); });
walk(TOK);
files.sort((a, b) => (/\.(density|interaction|dark|light)-?/.test(path.basename(a)) ? 1 : 0) - (/\.(density|interaction|dark|light)-?/.test(path.basename(b)) ? 1 : 0));
for (const f of files) {
  const j = json(f);
  for (const tier of Object.keys(TIERS)) for (const [k, v] of Object.entries(j[tier] || {})) if (v && v.$value !== undefined && !(k in TIERS[tier])) TIERS[tier][k] = tokenCss(v.$value);
}
const px = (value, depth = 0) => {
  if (depth > 10 || value === undefined) return NaN;
  const ref = /^\{(plx-ref|plx-sys|plx-comp)\.([\w-]+)\}$/.exec(String(value).trim());
  if (ref) return px(TIERS[ref[1]][ref[2]], depth + 1);
  const m = /^(-?[\d.]+)(px|rem)?$/.exec(String(value).trim());
  return m ? +m[1] * (m[2] === 'rem' ? 16 : 1) : NaN;
};
const tokenPx = (cssName) => px('{plx-comp.' + cssName.replace(/^--plx-comp-/, '') + '}');

const rules = json(path.join(BRAND, 'brand-rules.json'));
const brandTokens = json(path.join(TOK, 'components', 'brand.tokens.json'))['plx-comp'];

// every token the rules name is a brand token
const named = [].concat(Object.values(rules.clearSpace.tokens), Object.values(rules.minimumSize.tokens));
named.forEach((t) => check('names an existing token: ' + t, brandTokens[t.replace(/^--plx-comp-/, '')], 'not in brand.tokens.json'));

// the minimum sizes are the tokens' values
for (const [kind, want] of Object.entries(rules.minimumSize.px)) {
  const got = tokenPx(rules.minimumSize.tokens[kind]);
  check('minimum size of the ' + kind + ' is ' + want + 'px', got === want, 'the token gives ' + got + 'px');
}
// the size steps: the mark's square and the name's type step
for (const [size, want] of Object.entries(rules.sizes)) {
  const mark = tokenPx('brand-' + size + '-mark-size'), type = tokenPx('brand-' + size + '-font-size');
  check(size + ': the mark is ' + want.mark + 'px', mark === want.mark, 'the token gives ' + mark + 'px');
  check(size + ': the name is ' + want.type + 'px', type === want.type, 'the token gives ' + type + 'px');
  const clear = tokenPx(rules.clearSpace.tokens[size]);
  check(size + ': the clear space is on the 4px grid', clear > 0 && clear % 4 === 0, clear + 'px');
  check(size + ': the clear space is at least ' + rules.clearSpace.ratio * 100 + '% of the mark', clear >= rules.clearSpace.ratio * want.mark, clear + 'px for a ' + want.mark + 'px mark');
}
// the sizes start at the minimum: nothing smaller can be asked for
const smallest = Math.min.apply(null, Object.values(rules.sizes).map((s) => s.mark));
check('the smallest size step is the minimum size of the mark', smallest === rules.minimumSize.px.mark, smallest + 'px');
// the backgrounds name the tones BrandMark has
const TONES = ['brand', 'mono', 'on-accent'];
rules.backgrounds.forEach((b) => check('background "' + b.surface + '": ' + (b.approved ? 'an approved tone' : 'not approved, no tone'), b.approved ? TONES.includes(b.tone) : b.tone === null));
check('the misuse list is not empty', Array.isArray(rules.misuse) && rules.misuse.length > 0);
// the kit's files are there
const kit = json(path.join(BRAND, 'brand.json'));
Object.entries(kit.files).forEach(([k, f]) => check('brand.json ' + k + ': ' + f + ' exists', fs.existsSync(path.join(BRAND, f))));
check('the rules name their source, which exists', fs.existsSync(path.join(BRAND, rules.source)), rules.source);

const failed = res.filter((r) => !r[1]);
res.forEach(([n, ok, d]) => console.log((ok ? '  ok   ' : '  FAIL ') + n + (ok ? '' : ' (' + d + ')')));
console.log((failed.length ? 'BRAND_RULES_FAIL ' : 'BRAND_RULES_OK ') + (res.length - failed.length) + '/' + res.length + ' checks');
process.exit(failed.length ? 1 : 0);
