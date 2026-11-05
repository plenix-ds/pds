// Plenix tests · contrast (platform/utils/contrast.ts, the Contrast rules page): every role pair in CONTRAST_PAIRS meets its
// rule (WCAG 2.2: 4.5:1 text, 3:1 large text and non-text) in every theme of platform/standards/themes.json, light and
// dark, read from the token source (platform/tokens/*.tokens.json) with the palette resolved. Also checks the functions on
// known values. No browser; the repository is never changed.
//   node tests/contrast.test.js           ALL=1 node tests/contrast.test.js   (print every pair with its ratio)
const shared = require('./check.js');   // the shared check helper: parts (TEST_ONLY) and the results file (TEST_RESULTS)
const fs = require('fs');
const path = require('path');
const { css: tokenCss } = require('../tools/token-value.js');   // a $value as CSS text: the W3C typed values too (#872)
const vm = require('vm');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

const ROOT = path.join(__dirname, '..');
const TOK = path.join(ROOT, 'platform', 'tokens');
const res = [], check = (n, ok, d) => { if (shared.check(n, ok, d)) res.push([n, ok, d]); };

// the module (TypeScript; Babel strips the types), run as a script (its exports become globals of the context)
const src = require('@babel/standalone').transform(fs.readFileSync(path.join(ROOT, 'platform', 'utils', 'contrast.ts'), 'utf8'), { filename: 'contrast.ts', presets: ['typescript'] }).code.replace(/^export (const|function) /gm, '$1 ');
const C = {}; vm.createContext(C);
vm.runInContext(src + '\nthis.api = { CONTRAST_MINIMUMS, CONTRAST_PAIRS, parseColor, relativeLuminance, contrastRatio, meetsContrast };', C);
const { CONTRAST_PAIRS, contrastRatio, meetsContrast, parseColor } = C.api;

// the functions
check('black on white is 21:1', Math.abs(contrastRatio('#000', '#ffffff') - 21) < 1e-9, contrastRatio('#000', '#ffffff'));
check('a color on itself is 1:1', contrastRatio('rgb(10, 20, 30)', '#0a141e') === 1, '');
check('#767676 on white meets text (4.54:1)', meetsContrast(contrastRatio('#767676', '#fff'), 'text'), contrastRatio('#767676', '#fff').toFixed(2));
check('#777777 on white fails text (4.48:1)', !meetsContrast(contrastRatio('#777777', '#fff'), 'text'), contrastRatio('#777777', '#fff').toFixed(2));
check('not a color gives NaN', Number.isNaN(contrastRatio('var(--x)', '#fff')) && parseColor('nope') === null, '');
let threw = false; try { meetsContrast(5, 'loose'); } catch (e) { threw = true; }
check('an unknown rule is refused', threw, '');

// the palette: reference tokens, name -> hex
const ref = JSON.parse(fs.readFileSync(path.join(TOK, 'reference.tokens.json'), 'utf8'))['plx-ref'];
const refValue = (name) => { const t = ref[name]; return t ? tokenCss(t.$value) : undefined; };
const resolveIn = (set, v, depth = 0) => {
  if (depth > 10 || typeof v !== 'string') return v;
  const m = /^\{plx-(ref|sys)\.([a-z0-9-]+)\}$/.exec(v);
  if (!m) return v;
  return resolveIn(set, m[1] === 'ref' ? refValue(m[2]) : ((set[m[2]] || {}).$value === undefined ? undefined : tokenCss(set[m[2]].$value)), depth + 1);
};

// pairs the themes do not meet yet: reported, not failed, until the owner remaps the role in that theme and mode. Empty
// since 2026-10-12 (the owner remapped the 13 pairs of 2026-10-11); a new pending pair needs the owner (palette-contrast rule: remap per theme, never add a color, never loosen the
// rule). A pending pair that starts to pass fails the test until it is removed here, so the list only shrinks.
const PENDING = new Set([]);
const pending = [];

const themes = JSON.parse(fs.readFileSync(path.join(ROOT, 'platform', 'standards', 'themes.json'), 'utf8')).themes;
const rows = [];
for (const [name, t] of Object.entries(themes)) {
  for (const mode of ['light', 'dark']) {
    const set = JSON.parse(fs.readFileSync(path.join(TOK, t[mode]), 'utf8'))['plx-sys'];
    for (const p of CONTRAST_PAIRS) {
      const val = (k) => (set[k] && set[k].$value !== undefined ? tokenCss(set[k].$value) : undefined);
      const fg = resolveIn(set, val(p.fg)), bg = resolveIn(set, val(p.bg));
      const where = name + ' ' + mode + ': ' + p.fg + ' on ' + p.bg;
      if (!parseColor(fg) || !parseColor(bg)) { check(where + ' resolves to colors', false, fg + ' / ' + bg); continue; }
      const r = contrastRatio(fg, bg);
      rows.push([where, r, p.rule]);
      const ok = meetsContrast(r, p.rule), detail = r.toFixed(2) + ':1 (' + fg + ' on ' + bg + ')';
      if (PENDING.has(where)) {
        if (ok) check(where + ' now meets ' + p.rule + ': remove it from PENDING', false, detail);
        else pending.push(where + ' ' + detail);
        continue;
      }
      check(where + ' meets ' + p.rule, ok, detail);
    }
  }
}

if (process.env.ALL) rows.forEach(([w, r, rule]) => console.log(r.toFixed(2).padStart(6) + '  ' + rule.padEnd(10) + ' ' + w));
PENDING.forEach((w) => { if (!rows.some((r) => r[0] === w)) check('pending pair ' + w + ' is still a pair of CONTRAST_PAIRS', false, ''); });
if (pending.length) { console.log('pending (' + pending.length + ', the owner remaps the roles):'); pending.forEach((p) => console.log('           ' + p)); }
const bad = res.filter((r) => !r[1]);
res.forEach(([n, ok, d]) => { if (!ok || process.env.VERBOSE) console.log((ok ? 'ok   ' : 'FAIL ') + n + (d !== '' ? '  ' + d : '')); });
console.log(bad.length ? '\nCONTRAST_FAIL ' + bad.length + ' of ' + res.length : 'CONTRAST_OK ' + res.length + ' checks (' + rows.length + ' pairs)');
process.exit(bad.length ? 1 : 0);
