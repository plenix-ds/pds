// Moves a component's design values into component tokens (the Button treatment, batch 207, as a tool; batch 223).
//   node tokenize-component.js <stylesheet under platform/> [--dry] [--out components/<name>.tokens.json]
//   e.g. node tokenize-component.js components/Input/input.css
//   --out writes the new tokens into that file under platform/tokens/ (a library component's own token file, read by
//   build-tokens.js's glob set) instead of components.tokens.json, which a library lane never edits
//
// Every declaration of a Platform stylesheet whose value points to a shared token (var(--plx-sys-…) / var(--plx-ref-…))
// gets a component token, --plx-comp-<block>-<context>-<property>, written into platform/tokens/components.tokens.json
// (pointing to the same shared token, so nothing changes on screen), and the declaration uses it. Selectors, cascade and
// keywords stay as they are.
//   block    the rule's first block class (plx-input → input, plx-switch → switch)
//   context  its elements, modifiers and states in order (.plx-switch__input:checked+.plx-switch__track::after →
//            input-checked-track-after); none for the block itself
//   property a short name; the four sides of a border color, width or style and the four corners of a radius become one
//            token when all are set and equal (border-color, radius), as do the two inline (or block) paddings and margins
// Values that depend on a custom property some stylesheet sets locally (on an element, e.g. the concentric radius
// inputs --plx-sys-radius-outer / -inset) stay on the element: a component token is computed where it is declared
// (:root and the density and interaction contexts, batch 221), so it would not see the local value.
const fs = require('fs');
const path = require('path');
const { css, typed } = require('./tools/token-value.js');   // the W3C typed values (#872): compared as CSS text, written typed
const ROOT = __dirname;
const P = path.join(ROOT, 'platform');
const TOKENS = path.join(P, 'tokens', 'components.tokens.json');
const OUT_AT = process.argv.indexOf('--out'), OUT = OUT_AT > 0 ? path.join(P, 'tokens', process.argv[OUT_AT + 1]) : TOKENS;

const file = process.argv[2], dry = process.argv.includes('--dry');
if (!file) { console.log('usage: node tokenize-component.js <stylesheet under platform/> [--dry]'); process.exit(1); }
const full = path.join(P, file);
const css = fs.readFileSync(full, 'utf8');

// custom properties set on elements anywhere (not the token stylesheets): values using them stay local
function localVars() {
  const out = new Set();
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!/^(tokens|themes|dist|vendor|design-system)$/.test(e.name)) walk(f); } else if (e.name.endsWith('.css')) {
    const t = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of t.matchAll(/([^{}]+)\{([^{}]*)\}/g)) { if (/^\s*:root\s*$/.test(m[1])) continue; for (const d2 of m[2].matchAll(/(--[a-z0-9-]+)\s*:/g)) out.add(d2[1]); }
  } } };
  walk(P);
  return out;
}
const LOCAL = localVars();

const SHORT = { 'background-color': 'background', color: 'text', 'min-block-size': 'min-height', 'block-size': 'height', 'max-block-size': 'max-height',
  'inline-size': 'width', 'min-inline-size': 'min-width', 'max-inline-size': 'max-width', 'column-gap': 'gap', 'row-gap': 'row-gap', 'box-shadow': 'shadow',
  'transition-duration': 'duration', 'transition-timing-function': 'easing', 'animation-duration': 'animation-duration', 'font-family': 'font-family',
  'font-size': 'font-size', 'font-weight': 'font-weight', 'line-height': 'line-height', 'letter-spacing': 'letter-spacing', opacity: 'opacity' };
const SIDES = { 'border-color': /^border-(top|right|bottom|left)-color$/, 'border-width': /^border-(top|right|bottom|left)-width$/, 'border-style': /^border-(top|right|bottom|left)-style$/,
  radius: /^border-(top-left|top-right|bottom-left|bottom-right)-radius$/, 'padding-inline': /^padding-inline-(start|end)$/, 'padding-block': /^padding-block-(start|end)$/,
  'margin-inline': /^margin-inline-(start|end)$/, 'margin-block': /^margin-block-(start|end)$/ };
const TYPE = (p) => /color|^background|^text$|border-color/.test(p) ? 'color' : /shadow/.test(p) ? 'shadow' : /duration|delay/.test(p) ? 'duration' : /easing/.test(p) ? 'cubicBezier'
  : /font-weight/.test(p) ? 'fontWeight' : /font-family/.test(p) ? 'fontFamily' : /opacity|line-height|z-index/.test(p) ? 'number' : /border-style/.test(p) ? 'strokeStyle' : 'dimension';

// the context words of a selector (its first item), after its block
function context(sel, block) {
  let s = sel.split(',')[0].trim();
  const words = [];
  const add = (w) => { w = w.replace(/[^a-z0-9-]/g, ''); if (w && words.indexOf(w) < 0) words.push(w); };
  s = s.replace(/:has\(([^)]*)\)/g, (m, inner) => ' ' + inner.replace(/^\./, '.') + ' ');
  for (const m of s.matchAll(/\.plx-([a-z0-9-]+?)(?:__([a-z0-9-]+))?(?:--([a-z0-9-]+))?(?=[^a-z0-9_-]|$)|\.is-([a-z0-9-]+)|::?([a-z-]+)(?:\(([^)]*)\))?|\[([a-z-]+)(?:="([^"]*)")?\]/g)) {
    if (m[1] !== undefined) { if (m[1] !== block) add(m[1]); if (m[2]) add(m[2]); if (m[3]) add(m[3]); }
    else if (m[4]) add(m[4] === 'focus-visible' ? 'focus' : m[4]);
    else if (m[5]) { const map = { 'focus-visible': 'focus', 'focus-within': 'focus-within', dir: m[6] || 'dir', not: 'not-' + String(m[6] || '').replace(/[^a-z0-9-]/g, '') }; add(map[m[5]] || m[5]); }
    else if (m[7]) { const v = m[8]; add(m[7] === 'aria-invalid' ? 'invalid' : m[7] === 'aria-disabled' ? 'disabled' : m[7] === 'aria-expanded' ? 'expanded' : m[7] === 'aria-selected' ? 'selected' : m[7] === 'aria-pressed' ? 'pressed' : m[7] === 'aria-current' ? 'current' : m[7] === 'type' ? v : m[7]); }
  }
  return words.join('-');
}

// the names already taken (the shared set and, with --out, the component's own file); new tokens go into OUT
const tok = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { $description: 'Component tokens of ' + path.basename(OUT, '.tokens.json') + ' (a library component file, read by build-tokens.js).', 'plx-comp': {} };
const comp = tok['plx-comp'] = tok['plx-comp'] || {};
const shared = OUT === TOKENS ? {} : JSON.parse(fs.readFileSync(TOKENS, 'utf8'))['plx-comp'];
const taken = (n) => comp[n] || shared[n];
const toJson = (v) => v.replace(/var\(--(plx-(?:ref|sys|comp))-([a-z0-9-]+)\)/g, '{$1.$2}');
const added = [], kept = [];
let out = '', last = 0;
// comments are set aside first: a brace inside one (".plx-badge--{tone}") read as a rule and rewrote the comment (batch 263)
const comments = [];
const body = css.replace(/\/\*[\s\S]*?\*\//g, (c) => '/*@' + (comments.push(c) - 1) + '@*/');
for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selRaw = m[1], decls = m[2];
  const sel = selRaw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (!sel || sel.startsWith('@') || /^\s*:root\s*$/.test(sel)) continue;
  const bm = /\.plx-([a-z0-9-]+?)(?:__|--|[^a-z0-9_-]|$)/.exec(sel);
  if (!bm) continue;
  const block = bm[1], ctx = context(sel, block);
  const list = decls.split(';').filter((d) => d.trim()).map((d) => { const i = d.indexOf(':'); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; });
  const want = (p, v) => !p.startsWith('--') && /var\(--plx-(sys|ref)-/.test(v) && ![...v.matchAll(/var\((--[a-z0-9-]+)/g)].some((x) => LOCAL.has(x[1]));
  // group the sides and corners when their values are equal
  const groups = {};
  for (const [p, v] of list) for (const g in SIDES) if (SIDES[g].test(p)) (groups[g] = groups[g] || []).push([p, v]);
  const nameFor = {};
  // only when every side (or corner) is set: a single padding-inline-end keeps its own name
  for (const g in groups) { const vs = new Set(groups[g].map((x) => x[1])); if (vs.size === 1 && groups[g].length === (/^(border|radius)/.test(g) ? 4 : 2)) groups[g].forEach(([p]) => { nameFor[p] = g; }); }
  const newDecls = list.map(([p, v]) => {
    if (!want(p, v)) { if (/var\(--plx-(sys|ref)-/.test(v) && !p.startsWith('--')) kept.push(sel + ' { ' + p + ' } stays local'); return p + ':' + v; }
    const short = nameFor[p] || SHORT[p] || p;
    let name = block + (ctx ? '-' + ctx : '') + '-' + short;
    const value = toJson(v);
    if (taken(name) && css(taken(name).$value) !== value) { let i = 2; while (taken(name + '-' + i) && css(taken(name + '-' + i).$value) !== value) i++; name = name + '-' + i; }
    if (!taken(name)) { comp[name] = { $value: typed(value, TYPE(short)), $type: TYPE(short) }; added.push('--plx-comp-' + name + ' = ' + value); }
    return p + ':var(--plx-comp-' + name + ')';
  });
  // a rule written one declaration per line (the reflowed sheets, issue 688) stays that way; a one-line rule stays one line
  const lines = /\n/.test(decls), indent = (/\n([ \t]*)\S/.exec(decls) || [])[1] || '  ';
  out += body.slice(last, m.index) + selRaw + '{' + (lines ? '\n' + indent + newDecls.join(';\n' + indent) + ';\n' : newDecls.join(';') + ';') + '}';
  last = m.index + m[0].length;
}
out += body.slice(last);
out = out.replace(/\/\*@(\d+)@\*\//g, (m, i) => comments[+i]);
console.log(file + ': ' + added.length + ' component tokens' + (kept.length ? ', ' + kept.length + ' values stay local' : ''));
if (process.argv.includes('--list')) { added.forEach((a) => console.log('  ' + a)); kept.forEach((k) => console.log('  local: ' + k)); }
if (!dry) {
  fs.writeFileSync(full, out);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(tok, null, 2) + '\n');
}
