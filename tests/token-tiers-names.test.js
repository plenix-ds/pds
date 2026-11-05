// Plenix tests · check-system rules token-tiers (check 6) and token-names (check 7), docs/adr/0002, plenix-ds/pds#201.
// Runs the rules on in-memory fixtures (no browser, no files): each bad token must be found, each good one must not, and
// a baseline entry that no longer matches must be reported as fixed.
//   node tests/token-tiers-names.test.js   -> TOKEN_TIERS_NAMES_OK, or the failures and exit 1
const assert = require('assert');
const tiers = require('../check-system.rules/token-tiers.js');
const names = require('../check-system.rules/token-names.js');

const doc = (file, data) => ({ file, data });
const docs = [
  doc('platform/tokens/reference.tokens.json', { 'plx-ref': {
    'color-blue-500': { $value: '#0f6cbd' }, 'space-4px': { $value: '0.25rem' }, 'font-size-13': { $value: '0.8125rem' },
    'opacity-30': { $value: '0.3' }, 'breakpoint-wide': { $value: '1440px' }, 'space-100': { $value: '0.25rem' },
    'ref-to-sys': { $value: '{plx-sys.accent}' },
  } }),
  doc('platform/tokens/semantic.tokens.json', { 'plx-sys': {
    accent: { $value: '{plx-ref.color-blue-500}' }, 'space-inline-md': { $value: '{plx-ref.space-100}' },
    'radius-control-4px': { $value: '{plx-ref.space-100}' }, 'hidden': { $value: 'none' }, 'forced': { $value: 'Highlight' },
    'sys-literal': { $value: '12px' }, 'sys-to-comp': { $value: '{plx-comp.button-gap}' },
  } }),
  doc('platform/tokens/components/button.tokens.json', { 'plx-comp': {
    'button-gap': { $value: '{plx-sys.space-inline-md}' }, 'button-inner': { $value: '{plx-comp.button-gap}' },
    'button-skip': { $value: '{plx-ref.space-100}' }, 'button-borrow': { $value: '{plx-comp.card-pad}' },
    'button-from-1440': { $value: '{plx-sys.space-inline-md}' }, 'button-lines-2': { $value: '2' },
  } }),
  doc('platform/tokens/components/card.tokens.json', { 'plx-comp': { 'card-pad': { $value: '{plx-sys.space-inline-md}' } } }),
];

const fails = [];
const t = (label, fn) => { try { fn(); } catch (e) { fails.push(label + ': ' + e.message); } };
const tierTexts = tiers.findings(docs, new Set()).map((f) => f.text).join('\n');
const nameTexts = names.findings(docs, new Set()).map((f) => f.text).join('\n');
const has = (s, x) => assert.ok(s.includes(x), 'expected a finding for ' + x);
const lacks = (s, x) => assert.ok(!s.includes(x + ' '), 'unexpected finding for ' + x);

t('comp -> ref is found', () => has(tierTexts, 'plx-comp.button-skip -> plx-ref.space-100 skips'));
t('ref -> sys is found', () => has(tierTexts, 'plx-ref.ref-to-sys -> plx-sys.accent'));
t('sys -> comp is found', () => has(tierTexts, 'plx-sys.sys-to-comp -> plx-comp.button-gap'));
t('another component is found', () => has(tierTexts, 'plx-comp.button-borrow -> plx-comp.card-pad'));
t('sys literal is found', () => has(tierTexts, 'plx-sys.sys-literal holds a literal'));
t('own comp -> comp is fine', () => lacks(tierTexts, 'plx-comp.button-inner'));
t('comp -> sys is fine', () => lacks(tierTexts, 'plx-comp.button-gap'));
t('keywords and system colors are fine', () => { lacks(tierTexts, 'plx-sys.hidden'); lacks(tierTexts, 'plx-sys.forced'); });

t('unit in name is found', () => has(nameTexts, 'plx-ref.space-4px has a unit'));
t('unit in sys name is found', () => has(nameTexts, 'plx-sys.radius-control-4px has a unit'));
t('rem value in name is found', () => has(nameTexts, 'plx-ref.font-size-13 has its value'));
t('fraction value in name is found', () => has(nameTexts, 'plx-ref.opacity-30 has its value'));
t('plain number value is found', () => has(nameTexts, 'plx-comp.button-lines-2 has its value'));
t('breakpoint in name is found', () => has(nameTexts, 'plx-comp.button-from-1440 has a breakpoint'));
t('palette step is fine', () => lacks(nameTexts, 'plx-ref.color-blue-500'));
t('ordinal step is fine', () => lacks(nameTexts, 'plx-ref.space-100'));

t('baseline hides a known finding', () => assert.ok(!tiers.findings(docs, new Set(['plx-comp.button-skip -> plx-ref.space-100'])).some((f) => f.text.includes('button-skip'))));
t('a fixed baseline entry is reported', () => assert.ok(names.findings(docs, new Set(['plx-ref.gone-8px'])).some((f) => f.text === 'fixed, remove it from the baseline: plx-ref.gone-8px')));

fails.forEach((f) => console.log('  ' + f));
console.log(fails.length ? 'TOKEN_TIERS_NAMES_FAIL (' + fails.length + ')' : 'TOKEN_TIERS_NAMES_OK');
process.exit(fails.length ? 1 : 0);
