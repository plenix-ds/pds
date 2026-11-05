// Plenix · check-system rule "token-definitions" (owner standing rules; tools-follow-up-26): the token source (platform/tokens/**/*.tokens.json)
// follows three rules the owner set, so a stylesheet check never has to:
//   colors   No new colors. The reference palette (every --plx-ref-color-* in reference.tokens.json) is frozen at its list in
//            check-system.token-definitions.json (name and value; gray 250 is the one addition, already in it). A new or changed
//            color fails: a color needs the owner. A hex color written in any other token file fails too.
//   grid     Everything on the 4px grid. A token whose value is a literal length (px or rem, as 16px) is a multiple of 4. Exempt only
//            what GRID_EXEMPT names, with the reason for each; the corner radii have their own rule.
//   corners  Corners are 0, 2, 4 or 6px (D-0005, plan §7 check 2). A radius token (a key with "radius") must be a reference, 0, or a px/rem length of 2, 4 or 6px;
//            anything else (50%, 0.5em, 9999em, 100vh, a keyword) fails, unless RADIUS_EXEMPT names the token and its exact value with the reason (the spinner, and four card inner corners).
//            A reference is followed to the value it ends at, in every file that sets it (each theme, density and interaction), and
//            that value must pass too: {plx-ref.size-3u} is a 12px corner. A reference that ends nowhere (missing, or a loop) fails.
// (The box shadows, 13 tokens with 1, 2, 3 and 5px blur or ring widths, are in the backlog with the reason "optical blur/ring width; owner to decide", not exempt.)
// What already breaks a rule when the rule began is the frozen backlog in the same JSON (grid, corners): by token, with its value.
// It only shrinks: a token that is not listed fails; a listed token that now passes (or is gone) fails until it is removed
// (node check-system.rules/token-definitions.js --shrink). Changing such a token would change the page: that waits for the owner.
// The rule is a module check-style.js runs (a style rule: check-common.js, STYLE_MODULES): require('./check-system.rules/token-definitions.js').check({ add })
// Alone: node check-system.rules/token-definitions.js [--shrink | --baseline]   -> TOKEN_DEFINITIONS_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { css } = require('../tools/token-value.js');   // a $value as CSS text: the W3C typed values too (#872)

const NAME = 'token-definitions';
const ROOT = path.join(__dirname, '..');
const TOKENS = path.join(ROOT, 'platform', 'tokens');
const FROZEN = path.join(ROOT, 'check-system.token-definitions.json');
// off the 4px grid on purpose: a name (or a name prefix ending in -) and why
const GRID_EXEMPT = [
  ['border-width-', 'hairline widths (1, 2 and 3px): a line is thinner than the grid'],
  ['focus-ring-offset', 'an outline offset (2px): a gap between a control and its focus ring, not a space in the layout'],
  ['font-size-', 'type sizes come from the type scale, not the grid'],
];
// a corner token (a key with "radius") may hold 0, a reference, or a length of 2, 4 or 6px; anything else (50%, 0.5em, 9999em, 100vh, any calc(), a keyword)
// fails, unless it is named here with its value and the reason
const RADIUS_EXEMPT = [
  ['spinner-radius', '50%', 'owner, spinner-round-29 (2026-10-27): a spinner is a circle, not a corner'],
  // a card's media or cover sits inside the card's border, so its outer corner is the card's corner minus the border (an inner corner; never above the card's)
  ['feature-card-media-radius', 'calc({plx-comp.card-radius} - {plx-comp.card-border-width})', 'inner corner: card radius minus border width'],
  ['user-card-cover-radius', 'calc({plx-comp.card-radius} - {plx-comp.card-border-width})', 'inner corner: card radius minus border width'],
  ['media-card-media-border-top-left-radius', 'calc({plx-sys.radius-card-md} - {plx-sys.border-width-thin})', 'inner corner: card radius minus border width'],
  ['media-card-media-border-top-right-radius', 'calc({plx-sys.radius-card-md} - {plx-sys.border-width-thin})', 'inner corner: card radius minus border width'],
];
const radiusExempt = (key, value) => RADIUS_EXEMPT.some(([n, v]) => n === key && v === String(value).trim());
const CORNERS = [0, 2, 4, 6];   // px: the corner scale (D-0005); no 1px, 3px or 5px corner
const LEN = /^(-?[\d.]+)(px|rem)$/;
const one = (w) => { const m = String(w).match(LEN); return m ? (m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1])) : null; };
// every length in a value, each part of a compound ("4px 7px"): [] when the value has none (a reference, a keyword, a number)
const lengths = (v) => String(v).split(/\s+/).map(one).filter((n) => n !== null);
const exempt = (key) => GRID_EXEMPT.find(([n]) => (n.endsWith('-') ? key.startsWith(n) : key === n));

// every token of the source: { key, value, file, ref, name } (ref: the file is reference.tokens.json; name: '<tier>.<key>', as a reference writes it)
function tokens() {
  const out = [];
  const walkDir = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkDir(p); else if (/\.tokens\.json$/.test(e.name)) read(p);
  } };
  const read = (f) => {
    let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return; }
    const ref = path.basename(f) === 'reference.tokens.json', file = path.relative(ROOT, f).split(path.sep).join('/');
    const walk = (o, tier) => { for (const k of Object.keys(o)) {
      if (k.charAt(0) === '$') continue;
      const v = o[k]; if (!v || typeof v !== 'object') continue;
      if (v.$value !== undefined) { if (typeof v.$value !== 'number') out.push({ key: k, value: css(v.$value), file, ref, name: tier + '.' + k }); } else walk(v, tier || k);
    } };
    walk(j, '');
  };
  walkDir(TOKENS);
  return out;
}
// a corner length passes when it is 0, or a px or rem length on the corner scale (2, 4 or 6px)
const cornerOk = (p) => /^0(px|rem)?$/.test(p) || (one(p) !== null && CORNERS.includes(one(p)));
const REF = /^\{([^}]+)\}$/;
// the values a reference ends at: every file that sets the token, followed to a value that is not a reference ('?' for a missing token or a loop)
function ends(values, name, seen) {
  if (seen.has(name) || !values[name]) return ['?'];
  const next = new Set(seen).add(name), out = [];
  for (const v of values[name]) { const m = REF.exec(String(v).trim()); if (m) out.push(...ends(values, m[1], next)); else out.push(String(v).trim()); }
  return out;
}
// a radius value passes when every part is 0, a px or rem length of 2, 4 or 6px, or a reference that ends at such a value in every file;
// returns null when it passes, or what it ends at
function radiusFails(v, values) {
  const bad = [];
  for (const p of String(v).trim().split(/\s+/)) {
    const m = REF.exec(p);
    if (!m) { if (!cornerOk(p)) return String(v); continue; }
    for (const e of new Set(ends(values, m[1], new Set()))) if (!e.split(/\s+/).every(cornerOk)) bad.push(e === '?' ? 'nothing (a missing token or a loop)' : e);
  }
  return bad.length ? v + ' (ends at ' + [...new Set(bad)].join(', ') + ')' : null;
}
function measure() {
  const all = tokens(), colors = {}, grid = {}, corners = {}, hex = [], values = {};
  for (const t of all) (values[t.name] = values[t.name] || []).push(t.value);
  for (const t of all) {
    if (t.ref && (/^color-/.test(t.key) || /^#[0-9a-f]{3,8}$/i.test(t.value))) colors[t.key] = t.value;   // a hex value is a color under any key
    else if (!t.ref && /^#[0-9a-f]{3,8}$/i.test(t.value)) hex.push(t);
    if (/radius/.test(t.key)) { const why = radiusExempt(t.key, t.value) ? null : radiusFails(t.value, values); if (why) corners[t.key] = why; continue; }
    const ns = lengths(t.value); if (!ns.length) continue;
    if (ns.some((n) => n !== 0 && n % 4 !== 0) && !exempt(t.key)) grid[t.key] = t.value;
  }
  // a radius with no unit-length value (the pill, 9999px) is a length too: px() read it above
  return { colors, grid, corners, hex };
}
// one color, any spelling (#872: a typed color is written as #rrggbb, or rgba() with its alpha): its four bytes, or the text
const colorBytes = (v) => {
  let m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) : 255).join(',');
  m = /^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/.exec(v);
  return m ? [+m[1], +m[2], +m[3], Math.round(+m[4] * 255)].join(',') : v;
};
const sameColor = (a, b) => a === b || colorBytes(a) === colorBytes(b);
const readFrozen = () => (fs.existsSync(FROZEN) ? JSON.parse(fs.readFileSync(FROZEN, 'utf8')) : { colors: {}, grid: {}, corners: {} });

function check({ add }) {
  const m = measure(), fz = readFrozen(), at = FROZEN;
  for (const t of m.hex) add(NAME, path.join(ROOT, t.file), 0, '--plx-' + t.key + ' is a hex color outside the reference palette: colors need the owner');
  for (const k of Object.keys(m.colors)) {
    if (!(k in fz.colors)) add(NAME, path.join(ROOT, 'platform/tokens/reference.tokens.json'), 0, '--plx-ref-' + k + ' is a new color: the palette is frozen, and a color needs the owner');
    else if (!sameColor(fz.colors[k], m.colors[k])) add(NAME, path.join(ROOT, 'platform/tokens/reference.tokens.json'), 0, '--plx-ref-' + k + ' changed from ' + fz.colors[k] + ' to ' + m.colors[k] + ': a color needs the owner');
  }
  for (const k of Object.keys(fz.colors)) if (!(k in m.colors)) add(NAME, at, 0, 'repaired, still listed: color ' + k + ' (run node check-system.rules/token-definitions.js --shrink)');
  for (const [kind, what, hint] of [['grid', 'is off the 4px grid', 'a multiple of 4, or named in GRID_EXEMPT with its reason'], ['corners', 'is a corner off the scale 0, 2, 4, 6px', '0, 2, 4 or 6px (D-0005)']]) {
    for (const k of Object.keys(m[kind])) if (!(k in fz[kind])) add(NAME, path.join(ROOT, 'platform/tokens'), 0, '--plx-*-' + k + ' = ' + m[kind][k] + ' ' + what + ' (needs ' + hint + ')');
    for (const k of Object.keys(fz[kind])) if (!(k in m[kind])) add(NAME, at, 0, 'repaired, still listed: ' + kind + ' ' + k + ' (run node check-system.rules/token-definitions.js --shrink)');
  }
}
function write(o) { fs.writeFileSync(FROZEN, JSON.stringify(o, null, 2) + '\n'); }
const DESCRIPTION = 'Frozen at 2026-10-27 for check-system.rules/token-definitions.js: the reference palette (name and value; a new or changed color needs the owner; gray 250 is in), and the tokens that were off the 4px grid or outside the 2 to 6px corners when the rule began. The grid and corners lists only shrink: node check-system.rules/token-definitions.js --shrink.';
module.exports = { check, measure, NAME };

if (require.main === module) {
  if (process.argv.includes('--baseline')) { const m = measure(); write({ $description: DESCRIPTION, reasons: readFrozen().reasons || {}, colors: m.colors, grid: m.grid, corners: m.corners }); console.log('baseline written: ' + Object.keys(m.colors).length + ' colors, ' + Object.keys(m.grid).length + ' off the grid, ' + Object.keys(m.corners).length + ' corners'); }
  if (process.argv.includes('--shrink')) {
    const m = measure(), fz = readFrozen(), o = { $description: fz.$description || DESCRIPTION, reasons: fz.reasons || {}, colors: {}, grid: {}, corners: {} };
    for (const k of Object.keys(fz.colors)) if (k in m.colors) o.colors[k] = fz.colors[k];
    for (const kind of ['grid', 'corners']) for (const k of Object.keys(fz[kind])) if (k in m[kind]) o[kind][k] = fz[kind][k];
    write(o); console.log('frozen list: ' + Object.keys(o.colors).length + ' colors, ' + Object.keys(o.grid).length + ' off the grid, ' + Object.keys(o.corners).length + ' corners');
  }
  const out = [];
  check({ add: (rule, file, line, text) => out.push(path.relative(ROOT, file) + '  ' + text) });
  out.forEach((l) => console.log('  ' + l));
  console.log(out.length ? 'TOKEN_DEFINITIONS_FAIL (' + out.length + ')' : 'TOKEN_DEFINITIONS_OK');
  process.exit(out.length ? 1 : 0);
}
