// Plenix · token values in the W3C Design Tokens format (2025.10), #372 step 9 (#872, owner's choice A, 2026-11-02).
//
// A token's $value is a string (a reference, {plx-ref.size-4px}, or a value only the web has: calc(), var(), env(),
// keywords, mixed strings) or one of the format's typed values:
//   dimension   { "value": 4, "unit": "px" }               (px or rem)                   written  4px
//   duration    { "value": 0.2, "unit": "s" }              (ms or s)                     written  0.2s
//   color       { "colorSpace": "srgb", "components": [r, g, b], "alpha"?: a, "hex": "#rrggbb" }   written  its hex (+ alpha)
//   number      1.5, and fontWeight 600                                               written  1.5, 600
//   fontFamily  [ "DM Sans", "system-ui", "sans-serif" ]                                written  "DM Sans", system-ui, sans-serif
//   cubicBezier [ x1, y1, x2, y2 ]                                                      written  cubic-bezier(x1, y1, x2, y2)
// Every script and check that reads a token's value as CSS text calls css(); nothing else needs to know the two forms.
// typed(text, type) is the way back: the typed value of a CSS text, or the text itself when the format has no exact
// typed form for it (css(typed(text, type)) === text, always). The token save service writes an edit through it, so an
// edited typed value stays typed.

// a family name written bare: a CSS generic family or system keyword, or a single word of letters (Arial, Menlo);
// every other name is quoted ("DM Sans", "SFMono-Regular")
const BARE_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'math', 'emoji', 'fangsong',
  'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', '-apple-system']);
const family = (name) => (BARE_FAMILIES.has(name) || /^[A-Za-z]+$/.test(name) ? name : '"' + name + '"');

const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0');

function css(v) {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) {
    if (v.length === 4 && v.every((n) => typeof n === 'number')) return 'cubic-bezier(' + v.join(', ') + ')';
    if (v.every((n) => typeof n === 'string')) return v.map(family).join(', ');
  } else if (v && typeof v === 'object') {
    if (typeof v.value === 'number' && typeof v.unit === 'string') return v.value + v.unit;
    if (typeof v.colorSpace === 'string') {
      const base = typeof v.hex === 'string' ? v.hex : v.colorSpace === 'srgb' && Array.isArray(v.components) ? '#' + v.components.map(hex2).join('') : null;
      if (base) return typeof v.alpha === 'number' && v.alpha < 1 ? base + hex2(v.alpha) : base;
    }
  }
  throw new Error('a token value the build cannot write as CSS: ' + JSON.stringify(v));
}

const NUM = '(-?(?:\\d+\\.?\\d*|\\.\\d+))';
const exactNumber = (s) => (String(Number(s)) === s ? Number(s) : null);

function typed(text, type) {
  if (typeof text !== 'string' || /^\{plx-/.test(text)) return text;
  let out = text, m;
  if (type === 'dimension' && (m = new RegExp('^' + NUM + '(px|rem)$').exec(text)) && exactNumber(m[1]) !== null) out = { value: exactNumber(m[1]), unit: m[2] };
  else if (type === 'duration' && (m = new RegExp('^' + NUM + '(ms|s)$').exec(text)) && exactNumber(m[1]) !== null) out = { value: exactNumber(m[1]), unit: m[2] };
  else if (type === 'color' && (m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(text))) {
    const unit = (h) => Number((parseInt(h, 16) / 255).toFixed(4));
    const components = [0, 2, 4].map((i) => unit(m[1].slice(i, i + 2)));
    out = m[2] ? { colorSpace: 'srgb', components, alpha: unit(m[2]), hex: '#' + m[1] } : { colorSpace: 'srgb', components, hex: '#' + m[1] };
  } else if ((type === 'number' || type === 'fontWeight') && exactNumber(text) !== null) out = exactNumber(text);
  else if (type === 'cubicBezier' && (m = new RegExp('^cubic-bezier\\(' + [NUM, NUM, NUM, NUM].join(', ') + '\\)$').exec(text))) out = m.slice(1, 5).map(Number);
  else if (type === 'fontFamily' && !/[{}()]/.test(text)) out = text.split(',').map((s) => s.trim().replace(/^"(.*)"$/, '$1'));
  return out !== text && css(out) === text ? out : text;
}

module.exports = { css, typed };
