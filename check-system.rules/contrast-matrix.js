// Plenix · check-system rule "contrast-matrix" (plan §7 check 8, #189): every foreground role meets WCAG 2.2 contrast on
// the backgrounds it is drawn on, in light and in dark, for every theme of platform/standards/themes.json. Read from the
// token source (no browser): each plx-sys color is followed through its references to the palette's hex value.
// The pairs, built from the roles themselves (no hand-kept list to drift):
//   neutral   every text role (group "text") on every neutral surface (canvas, default, raised, overlay, sunken) and on a
//             hovered or selected item (state-hover, state-selected), except
//             content-disabled (WCAG 1.4.3 exempts disabled text) and the roles that have their own surface (below)
//   named     a role and the background its name points to: <x>-on-solid on <x>-solid, <x>-on-soft on <x>-soft, <x>-on on
//             <x>, <x>-text or <x>-content on <x>-background (or <x>-surface, <x>-soft, or <x>);
//             <x>-on-solid also on <x>-solid-label (a badge's fill), <x>-on-primary on <x>-primary
//   own       content-inverse on surface-inverse, content-on-media(-muted) on surface-media, content-dialog-chrome on
//             surface-dialog-chrome, message-text on both message backgrounds, field-placeholder on surface-default,
//             accent-field-placeholder on accent-field-background, data-color-<hue>-on-surface on surface-default and state-hover
// The minimum: 4.5:1 for text, 3:1 for an icon or mark role (a name ending in -on-surface, or with -icon). A background
// with alpha is laid over surface-canvas first. A value that isn't a plain color (a var(), color-mix, a keyword) is skipped.
// Known failures (the 0.x debt, measured 2026-11-05; dark mode is worked last, D-0025) are in contrast-matrix.baseline.json;
// it only shrinks: a fixed pair must be removed (a stale entry is a finding). New failures fail.
// Alone: node check-system.rules/contrast-matrix.js [--all] [--write-baseline]  -> CONTRAST_MATRIX_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { css } = require('../tools/token-value.js');

const NAME = 'contrast-matrix';
const ROOT = path.join(__dirname, '..');
const TOK = path.join(ROOT, 'platform', 'tokens');
const BASELINE = path.join(__dirname, 'contrast-matrix.baseline.json');
const NEUTRAL = ['surface-canvas', 'surface-default', 'surface-raised', 'surface-overlay', 'surface-sunken', 'state-hover', 'state-selected'];
const OWN = {
  'content-inverse': ['surface-inverse'],
  'content-on-media': ['surface-media'], 'content-on-media-muted': ['surface-media'],
  'content-dialog-chrome': ['surface-dialog-chrome'],
  'message-text': ['message-incoming-background', 'message-outgoing-background'],
  'field-placeholder': ['surface-default'],
  'accent-field-placeholder': ['accent-field-background'],
};
const NOT_NEUTRAL = new Set(['content-disabled', ...Object.keys(OWN)]);

const read = (f) => JSON.parse(fs.readFileSync(path.join(TOK, f), 'utf8'));
function flat(data, tier) {
  const out = {};
  const walk = (o, at) => { if (!o || typeof o !== 'object') return; if ('$value' in o) { out[at.join('-')] = o; return; } for (const k of Object.keys(o)) if (k[0] !== '$') walk(o[k], at.concat(k)); };
  walk(data && data[tier], []);
  return out;
}
function hex(v) {
  const m = String(v).trim().match(/^#([0-9a-f]{3,8})$/i); if (!m) return null;
  let h = m[1]; if (h.length <= 4) h = h.split('').map((c) => c + c).join('');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
}
const over = (c, under) => ({ r: c.r * c.a + under.r * (1 - c.a), g: c.g * c.a + under.g * (1 - c.a), b: c.b * c.a + under.b * (1 - c.a), a: 1 });
const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// the pairs [fg, bg, minimum] for one mode's roles (names without plx-sys.)
function pairs(roles) {
  const names = Object.keys(roles), has = (n) => n in roles, out = [];
  const group = (n) => (((roles[n].$extensions || {}).plenix) || {}).group;
  const min = (n) => (/-on-surface$|(^|-)icon(-|$)/.test(n) ? 3 : 4.5);
  for (const n of names) {
    if (group(n) === 'text' && !NOT_NEUTRAL.has(n)) for (const s of NEUTRAL) if (has(s)) out.push([n, s, min(n)]);
    for (const s of OWN[n] || []) if (has(s)) out.push([n, s, min(n)]);
    if (/^data-color-[a-z]+-on-surface$/.test(n)) for (const s of ['surface-default', 'state-hover']) if (has(s)) out.push([n, s, 3]);
    const cands = [];
    let m;
    if ((m = n.match(/^(.+)-on-solid$/))) { if (has(m[1] + '-solid-label')) out.push([n, m[1] + '-solid-label', min(n)]); cands.push(m[1] + '-solid'); }
    else if ((m = n.match(/^(.+)-on-soft$/))) cands.push(m[1] + '-soft');
    else if ((m = n.match(/^(.+)-on-primary$/))) cands.push(m[1] + '-primary');
    else if ((m = n.match(/^(.+)-on$/))) cands.push(m[1]);
    else if ((m = n.match(/^(.+)-(text|content)$/)) && !OWN[n] && group(n) !== 'text') cands.push(m[1] + '-background', m[1] + '-surface', m[1] + '-soft', m[1]);
    const bg = cands.find(has);
    if (bg) out.push([n, bg, min(n)]);
  }
  return out;
}

function raw() {
  const themes = JSON.parse(fs.readFileSync(path.join(ROOT, 'platform', 'standards', 'themes.json'), 'utf8')).themes;
  const ref = flat(read('reference.tokens.json'), 'plx-ref');
  const out = [];
  for (const [theme, th] of Object.entries(themes)) {
    const base = th.foundations ? flat(read(path.basename(th.foundations)), 'plx-sys') : {};
    for (const mode of ['light', 'dark']) {
      if (!th[mode]) continue;
      const roles = Object.assign({}, base, flat(read(path.basename(th[mode])), 'plx-sys'));
      const resolve = (v, depth = 0) => {
        v = css(v);
        const m = String(v).trim().match(/^\{plx-(ref|sys)\.([^}]+)\}$/);
        if (!m || depth > 20) return v;
        const t = m[1] === 'ref' ? ref[m[2]] : roles[m[2]];
        return t ? resolve(t.$value, depth + 1) : v;
      };
      const color = (n) => hex(resolve(roles[n].$value));
      const canvas = roles['surface-canvas'] ? color('surface-canvas') : null;
      for (const [fg, bg, need] of pairs(roles)) {
        let f = color(fg), b = color(bg);
        if (!f || !b) continue;
        if (b.a < 1 && canvas) b = over(b, canvas);
        if (f.a < 1) f = over(f, b);
        const r = ratio(f, b);
        out.push({ key: theme + ' ' + mode + ' ' + fg + ' on ' + bg, theme, mode, fg, bg, need, ratio: r, ok: r >= need });
      }
    }
  }
  return out;
}

function baseline() { try { return new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8')).known || []); } catch (e) { return new Set(); } }
function findings(list = raw(), known = baseline()) {
  const failing = list.filter((p) => !p.ok), keys = new Set(failing.map((p) => p.key)), file = path.join(TOK, 'theme-default.light.tokens.json');
  const out = failing.filter((p) => !known.has(p.key)).map((p) => ({ file: path.join(TOK, 'theme-' + p.theme + '.' + p.mode + '.tokens.json'), text: p.key + ' is ' + p.ratio.toFixed(2) + ':1, needs ' + p.need + ':1' }));
  for (const k of [...known].sort()) if (!keys.has(k)) out.push({ file: BASELINE, text: 'fixed, remove it from the baseline: ' + k });
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, raw, pairs, ratio, hex, NAME, BASELINE };

if (require.main === module) {
  const list = raw();
  if (process.argv.includes('--write-baseline')) {
    const keys = list.filter((p) => !p.ok).map((p) => p.key).sort();
    fs.writeFileSync(BASELINE, JSON.stringify({ $description: 'contrast-matrix (plan §7 check 8) known failures from 0.x, measured 2026-11-05 (dark mode is worked last, D-0025). Shrink-only: remove an entry when its pair is fixed; never add one.', known: keys }, null, 1) + '\n');
    console.log('wrote ' + keys.length + ' known failures of ' + list.length + ' pairs'); process.exit(0);
  }
  if (process.argv.includes('--all')) list.forEach((p) => console.log((p.ok ? '  ok   ' : '  FAIL ') + p.key + '  ' + p.ratio.toFixed(2) + ' / ' + p.need));
  const f = findings(list);
  f.forEach((x) => console.log('  ' + path.relative(ROOT, x.file).split(path.sep).join('/') + '  ' + x.text));
  console.log(f.length ? 'CONTRAST_MATRIX_FAIL (' + f.length + ')' : 'CONTRAST_MATRIX_OK (' + list.length + ' pairs)');
  process.exit(f.length ? 1 : 0);
}
