// Plenix · token values in the W3C Design Tokens format (2025.10), #372 step 9 (#872, owner's choice A, 2026-11-02).
//
// A token's $value is a string (a reference, {plx-ref.size-4px}, or a value only the web has: calc(), var(), env(),
// keywords, mixed strings) or one of the format's typed values:
//   dimension   { "value": 4, "unit": "px" }               (px or rem)                   written  4px
//   duration    { "value": 0.2, "unit": "s" }              (ms or s)                     written  0.2s
//   color       { "colorSpace": "srgb", "components": [r, g, b], "hex": "#rrggbb" }    written  #rrggbb
//               with "alpha": a (below 1)                                              written  rgba(r, g, b, a)
//   number      1.5, and fontWeight 600                                               written  1.5, 600
//   fontFamily  [ "DM Sans", "system-ui", "sans-serif" ]                                written  'DM Sans', system-ui, sans-serif
//   cubicBezier [ x1, y1, x2, y2 ]                                                      written  cubic-bezier(x1, y1, x2, y2)
// The CSS text is exactly what plain Style Dictionary's built-in transforms write (color/css, fontFamily/css, size/rem,
// time/seconds, cubicBezier/css; npm run tokens:sd:check compares the two), so the stylesheets do not change when Style
// Dictionary writes them (#372 step 10).
// Every script and check that reads a token's value as CSS text calls css(); nothing else needs to know the two forms.
// typed(text, type) is the way back: the typed value of a CSS text, or the text itself when the format has no typed form
// for it. css(typed(text, type)) is the same CSS value: the same text, except a color's and a font list's spelling
// (#00000080 is rgba(0, 0, 0, 0.502), transparent is rgba(0, 0, 0, 0), "DM Sans" is 'DM Sans'). The token save service
// writes an edit through it, so an edited typed value stays typed.

// a family name with a space is quoted, in single quotes ('DM Sans'); every other name is bare (as fontFamily/css)
const family = (name) => (/\s/.test(name) ? "'" + name.replace(/'/g, "\\'") + "'" : name);

const byte = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255);

function css(v) {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) {
    if (v.length === 4 && v.every((n) => typeof n === 'number')) return 'cubic-bezier(' + v.join(', ') + ')';
    if (v.every((n) => typeof n === 'string')) return v.map(family).join(', ');
  } else if (v && typeof v === 'object') {
    if (typeof v.value === 'number' && typeof v.unit === 'string') return v.value + v.unit;
    if (typeof v.colorSpace === 'string') {
      // as color/css: the components to bytes; opaque as #rrggbb, with alpha as rgba() with the alpha as written
      if (v.colorSpace === 'srgb' && Array.isArray(v.components) && v.components.length === 3) {
        const [r, g, b] = v.components.map(byte);
        if (typeof v.alpha === 'number' && v.alpha < 1) return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + v.alpha + ')';
        return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
      }
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
  else if (type === 'color' && text === 'transparent') out = { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0, hex: '#000000' };
  else if (type === 'color' && (m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(text))) {
    const unit = (h) => Number((parseInt(h, 16) / 255).toFixed(4));
    const components = [0, 2, 4].map((i) => unit(m[1].slice(i, i + 2)));
    out = m[2] ? { colorSpace: 'srgb', components, alpha: unit(m[2]), hex: '#' + m[1] } : { colorSpace: 'srgb', components, hex: '#' + m[1] };
  } else if ((type === 'number' || type === 'fontWeight') && exactNumber(text) !== null) out = exactNumber(text);
  else if (type === 'cubicBezier' && (m = new RegExp('^cubic-bezier\\(' + [NUM, NUM, NUM, NUM].join(', ') + '\\)$').exec(text))) out = m.slice(1, 5).map(Number);
  else if (type === 'fontFamily' && !/[{}()]/.test(text)) out = text.split(',').map((s) => s.trim().replace(/^"(.*)"$/, '$1'));
  if (out === text) return text;
  // a color or a font list is the same value in its new spelling (by construction above); every other value is exact
  return type === 'color' || type === 'fontFamily' || css(out) === text ? out : text;
}

// a fully transparent color (CSS transparent, typed as alpha 0): no color, so a theme may write it where it may not write a
// color of its own
const transparent = (v) => !!v && typeof v === 'object' && !Array.isArray(v) && v.alpha === 0;

module.exports = { css, typed, transparent };
