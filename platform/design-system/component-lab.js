/* global DS, sheetText */
/* Plenix master spec · the component lab (batch 252, from the Button lab of batches 177-238). Draws a Platform component
   with the real stylesheet, platform/platform.css, in frames, from a description of the component (its spec):
   - States: every variant in every state at the chosen size. Hover, focus and pressed are shown by copying the
     stylesheet's :hover, :focus-visible and :active rules onto .ds-hover / .ds-focus / .ds-pressed.
   - Anatomy: the chosen variant, size and state drawn large, with its parts lettered.
   - Properties, the Attributes table and the Edit dialog: each property's value as drawn and the one component token that
     sets it (spec.token), with a control to try another token; the changes are token changes for the token JSON.
   A component's lab registers itself: DS.registerLab(id, spec) puts window.DSLabs[id] = function (section, data, opts).
   spec: { name, file, compPrefix (RegExp of its component tokens), store (localStorage key), sizes, variants, states,
     content, labels: { size, variant, state, content }, props, sections (the Edit dialog), parts (property id -> letter),
     token(id, size, variant, state), reach(full), every (what a fixed property reaches), html(variant, size, state,
     extraCls, ui) (the markup; extraCls goes on the element measured), labelSelector (the text part, for its marker),
     defaults (the first choices), matrixLabel, statesHead, title (frame titles) } */
DS.labs = DS.labs || {};
window.DSLabs = window.DSLabs || {};
DS.registerLab = function (id, spec) { DS.labs[id] = spec; window.DSLabs[id] = function (section, data, opts) { return DS.componentLab(section, data, opts, spec); }; };
DS.componentLab = function (section, data, opts, spec) {
  var FONTS = PlenixSource.fonts;   // the hosted fonts (batch 227)
  var FILE = spec.file;
  var SIZES = spec.sizes, VARIANTS = spec.variants, STATES = spec.states, CONTENT = spec.content;
  var PROPS = spec.props;
  var find = function (list, v) { return list.filter(function (o) { return o[0] === v; })[0]; };
  var TOKEN_FILE = 'platform/tokens/components.tokens.json';
  // the one component token that sets a property at a size, variant and state (spec.token); null when the property is
  // fixed in the component's stylesheet or not drawn
  var buttonToken = spec.token;

  // ---- the tokens to offer and to recognize, by full name: reference and static semantic tokens (data), plus the
  // semantic tokens of the standard density, the plenix light theme and the Button's component tokens, read from their files
  var values = {};
  data.groups.forEach(function (g) { g.tokens.forEach(function (t) { values[t.full] = t.value; }); });
  function rootTokens(text) {
    var out = {}, re = /([^{}]+)\{([^{}]*)\}/g, m;
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    while ((m = re.exec(text))) {
      if (!m[1].split(',').some(function (s) { return s.trim() === ':root'; })) continue;   // the default: light mode, standard density, pointer
      var d = /--([a-z0-9-]+)\s*:\s*([^;]+);/g, x; while ((x = d.exec(m[2]))) out[x[1]] = x[2].trim();
    }
    return out;
  }
  var fetchText = function (u) { return fetch(u, { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }, function () { return ''; }); };
  var tierOf = function (full) { return /^plx-comp-/.test(full) ? 0 : /^plx-sys-/.test(full) ? 1 : 2; };
  var TIERS = ['Component', 'System', 'Reference'];
  var resolve = function (v, depth) { return (depth || 0) > 8 ? v : String(v).replace(/var\(--([a-z0-9-]+)\)/g, function (all, n) { return n in values ? resolve(values[n], (depth || 0) + 1) : all; }); };
  var isColor = function (v) { return /^(#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|transparent)$/i.test(String(v).trim()); };
  function catOf(full) {
    var s = full.replace(/^plx-(ref|sys|comp)-/, ''), n;
    if (/^(radius|shape)-/.test(s)) return 'radius';   // the theme's shape scale too (batch 220)
    if (/^border-width-/.test(s)) return 'border-width';
    if (/^border-style-/.test(s)) return 'border-style';
    if (/^shadow-|^elevation-[a-z-]*shadow$/.test(s)) return 'shadow';
    if (/^control-(height|size)-|^button-height-/.test(s)) return 'control-height';
    if (/^space-|^button-(padding-inline|icon-label-gap)$/.test(s)) return 'space';
    if (/^font-(sans|mono|body|heading|label|code|data)$|^typeface-/.test(s)) return 'font';
    if (/^font-size-/.test(s)) return 'font-size';
    if (/^font-weight-/.test(s)) return 'font-weight';
    if (/^glyph-size-|^icon-size$/.test(s) || ((n = /^size-(\d+)px$/.exec(s)) && +n[1] <= 24)) return 'icon';
    if (/^size-\d+px$/.test(s)) return 'size';   // widths and lengths over 24px (batch 253)
    if (/^line-height-/.test(s)) return 'line-height';
    if (/^opacity-/.test(s)) return 'opacity';
    if (/^color-/.test(s) || (tierOf(full) === 1 && isColor(resolve(values[full])))) return 'color';
    return null;
  }
  var pool = {}, tokensOf = function (cat) { return cat ? (pool[cat] || []) : []; };

  // computed value -> token names: each token's value written the way the browser reports it
  var rgb = function (h) { h = h.slice(1); if (h.length === 3) h = h.replace(/./g, '$&$&'); return 'rgb(' + [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(', ') + ')'; };
  var layers = function (v) { var out = [], depth = 0, cur = ''; for (var i = 0; i < v.length; i++) { var c = v[i]; if (c === '(') depth++; if (c === ')') depth--; if (c === ',' && !depth) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out.map(function (x) { return x.trim(); }); };
  var ROOT = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;   // the tokens are written in rem; the browser reports px
  function norm(cat, v) {
    v = resolve(String(v)).trim().replace(/#[0-9a-f]{3,6}\b/gi, rgb).replace(/(-?\d*\.?\d+)rem\b/g, function (all, n) { return (+n * ROOT) + 'px'; });
    if (cat === 'font') return v.replace(/["']/g, '').replace(/\s*,\s*/g, ',').toLowerCase();
    if (cat === 'shadow') return v === 'none' ? 'none' : layers(v).map(function (l) {
      var color = (/rgba?\([^)]*\)/.exec(l) || [''])[0], rest = l.replace(color, ' ').trim().split(/\s+/).filter(Boolean).map(function (x) { return x === '0' ? '0px' : x; });
      var inset = rest.indexOf('inset') >= 0; rest = rest.filter(function (x) { return x !== 'inset'; }); while (rest.length < 4) rest.push('0px');
      return (inset ? 'inset ' : '') + color.replace(/\s+/g, '') + ' ' + rest.join(' ');
    }).join(',');
    if (cat === 'color') return v.replace(/\s+/g, '');
    return v === '0' ? '0px' : v;
  }
  var tokenMap = {};
  var tokensFor = function (cat, computed) { return cat && tokenMap[cat] ? (tokenMap[cat][norm(cat, computed)] || []) : []; };
  var hex = function (v) {
    var m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(v); if (!m) return v;
    if (m[4] === '0') return 'transparent';
    return '#' + [m[1], m[2], m[3]].map(function (x) { return (+x).toString(16).padStart(2, '0'); }).join('') + (m[4] ? ' at ' + Math.round(m[4] * 100) + '%' : '');
  };

  // ---- what is chosen, and what has been changed (kept in this browser so a reload does not lose it)
  var STORE = spec.store;   // edits are token changes: { '<token>': '<new token or keyword>' }
  var ui = Object.assign({}, spec.defaults), edits = {};
  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && saved.ui && find(SIZES, saved.ui.size) && find(VARIANTS, saved.ui.variant) && find(STATES, saved.ui.state) && find(CONTENT, saved.ui.content)) ui = saved.ui;
    if (saved && saved.edits) edits = saved.edits;
  } catch { /* storage unavailable */ }
  var save = function () { try { localStorage.setItem(STORE, JSON.stringify({ ui: ui, edits: edits })); } catch { /* storage unavailable */ } };
  // a variant's page draws that variant only: its choices are fixed and nothing is remembered
  // a variant page opens the lab on its own setting: a size, a variant, a state or content, or several (batch 333: a page
  // that names only a size or content had fallen back to the defaults)
  if (opts && (opts.variant || opts.size || opts.state || opts.content)) { ui = { size: opts.size || spec.defaults.size, variant: opts.variant || spec.defaults.variant, state: opts.state || 'default', content: opts.content || spec.defaults.content }; edits = {}; save = function () {}; }
  var tokenNow = function (p) { return buttonToken(p.id, ui.size, ui.variant, ui.state, ui.content); };   // content: a part some content leaves out (batch 264)
  // what a token is set to in the JSON: its reference written the way the token files write it ({plx-sys.state-hover}), or a keyword
  var asJson = function (v) { var m = /^var\(--(plx-(?:ref|sys|comp))-([a-z0-9-]+)\)$/.exec(String(v || '').trim()); return m ? '{' + m[1] + '.' + m[2] + '}' : v; };
  var asValue = function (v) { return v in values ? 'var(--' + v + ')' : v; };   // a token (by its full name) or a keyword
  // which buttons a token reaches: the size tokens every button of that size, the variant tokens that variant, the rest every button
  var reachOf = function (full) { return spec.reach(full, { sizes: SIZES, variants: VARIANTS, find: find }); };
  // the edits as the token changes Save sends (POST /api/tokens: { file, changes: [{ token, from, to }] }) and the preview's :root override
  function changes() {
    return Object.keys(edits).sort().map(function (full) { return { token: '--' + full, from: asJson(values[full]), to: asJson(asValue(edits[full])) }; });
  }
  function previewCss() {
    var decl = Object.keys(edits).sort().map(function (full) { return '--' + full + ':' + asValue(edits[full]); });
    return decl.length ? ':root{' + decl.join(';') + ';}' : '';
  }

  // ---- frames drawn with platform.css; :hover and :focus-visible rules are copied onto classes
  function forceStates(doc) {
    var walk = function (list, owner) {
      for (var i = list.length - 1; i >= 0; i--) {
        var r = list[i];
        if (r.styleSheet) { try { walk(r.styleSheet.cssRules, r.styleSheet); } catch { /* unreadable sheet */ } continue; }
        if (r.cssRules && !r.selectorText) { walk(r.cssRules, r); continue; }
        if (r.selectorText && /:hover|:focus-visible|:active/.test(r.selectorText)) {
          try { owner.insertRule(r.selectorText.replace(/:hover/g, '.ds-hover').replace(/:focus-visible/g, '.ds-focus').replace(/:active/g, '.ds-pressed') + '{' + r.style.cssText + '}', i + 1); } catch { /* selector the browser rejects */ }
        }
      }
    };
    Array.prototype.forEach.call(doc.styleSheets, function (s) { try { walk(s.cssRules, s); } catch { /* unreadable sheet */ } });
  }
  function frame(cls, onload) {
    var f = document.createElement('iframe'); f.className = 'ds-frame ds-lab-frame ' + cls; f.title = spec.title;
    f.addEventListener('load', function () { forceStates(f.contentDocument); onload(f.contentDocument); });
    // its stylesheets are files (the Platform, the samples, the frame's own); the edits made with Set are a constructed sheet
    f.srcdoc = '<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="' + FONTS + '"><link rel="stylesheet" href="' + PlenixSource.css + '"><link rel="stylesheet" href="ds-sample.css"><link rel="stylesheet" href="ds-sample-data.css"><link rel="stylesheet" href="ds-sample-more.css"><link rel="stylesheet" href="ds-sample-content.css"><link rel="stylesheet" href="ds-sample-layout.css"><link rel="stylesheet" href="ds-sample-parts.css"><link rel="stylesheet" href="button-lab-frame.css"></head><body></body></html>';
    return f;
  }
  // the component's markup (spec.html): extraCls goes on the element the anatomy measures
  var buttonHtml = function (variant, size, state, extraCls) { return spec.html(variant, size, state, extraCls, ui); };

  // ---- the page parts. opts.only picks what this lab draws (batch 189):
  //   'matrix'  the All buttons page: Size and Content, and every variant in every state (a click opens that variant)
  //   'anatomy' a variant's Attributes card: Size, State and Content, and the lettered drawing (the card's title follows)
  //   'editor'  the Edit dialog: Size, State and Content, the fields by section (tokens only), and the drawing as the preview
  // Each part sits straight in its card: no card inside a card.
  var mode = (opts && opts.only) || 'full';
  var flat = mode !== 'full';
  var lab = DS.el('div', 'ds-lab' + (mode === 'editor' ? ' ds-lab--editor' : ''));
  var bar = DS.el('div', 'ds-lab-bar' + (flat ? ' ds-lab-bar--flat' : '')); lab.appendChild(bar);
  function seg(label, list, key) {
    var g = DS.el('div', 'ds-lab-seg'); g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
    g.appendChild(DS.el('span', 'ds-lab-seg-label', label));
    list.forEach(function (o) {
      var b = DS.el('button', 'ds-lab-seg-btn', o[1]); b.type = 'button'; b.dataset.value = o[0];
      b.addEventListener('click', function () { ui[key] = o[0]; save(); render(); });
      g.appendChild(b);
    });
    bar.appendChild(g); return g;
  }
  var L = spec.labels;
  var segs = SIZES.length > 1 ? { size: seg(L.size, SIZES, 'size') } : {};
  if (mode === 'full') segs.variant = seg(L.variant, VARIANTS, 'variant');
  if (mode !== 'matrix') segs.state = seg(L.state, STATES, 'state');
  if (CONTENT.length > 1) segs.content = seg(L.content, CONTENT, 'content');

  var states = DS.el('div', flat ? 'ds-lab-part' : 'ds-example');
  if (!flat) states.appendChild(DS.el('div', 'ds-example-head', spec.statesHead));
  lab.appendChild(states);
  var anat = DS.el('div', flat ? 'ds-lab-part ds-lab-anatomy' : 'ds-example ds-lab-anatomy'), anatHead = DS.el('div', 'ds-example-head', 'Anatomy');
  if (!flat) anat.appendChild(anatHead);
  var anatBody = DS.el('div', 'ds-lab-anatomy-body');
  // the Edit dialog: the fields beside the preview
  var fields = DS.el('div', 'ds-lab-fields');
  if (mode === 'editor') { var ed = DS.el('div', 'ds-lab-editor'); ed.appendChild(fields); ed.appendChild(anat); lab.appendChild(ed); } else lab.appendChild(anat);
  anat.appendChild(anatBody);
  // one table per property (the full lab): its value, its token, a control to set another, where it applies
  var propGrid = DS.el('div', 'ds-lab-prop-grid');
  var out = DS.el('div', 'ds-example ds-lab-out'), outHead = DS.el('div', 'ds-example-head', 'Token changes (' + TOKEN_FILE + ')'); out.appendChild(outHead);
  var copy = DS.el('button', 'ds-lab-action', 'Copy changes'); copy.type = 'button'; outHead.appendChild(copy);
  var reset = DS.el('button', 'ds-lab-action', 'Reset all'); reset.type = 'button'; outHead.appendChild(reset);
  var outPre = DS.el('pre', 'ds-lab-css'); out.appendChild(outPre);
  var anatGrid = DS.el('div', 'ds-lab-anatomy-grid'); anatBody.appendChild(anatGrid); if (mode === 'full') anatBody.appendChild(propGrid);
  lab.appendChild(out);
  if (mode !== 'full') out.remove();
  if (mode === 'anatomy' || mode === 'editor') states.remove();
  if (mode === 'matrix') anat.remove();
  section.appendChild(lab);

  var docs = {}, mFrame = null, aFrame = null;

  // an edit is a token change: the preview sets the token on the frames' :root; the output is the change list Save writes
  function applyEdits() {
    var css = previewCss();
    [docs.m, docs.a].forEach(function (d) { if (!d || !d.defaultView) return; var sh = d.dsEdits || (d.dsEdits = new d.defaultView.CSSStyleSheet()); sh.replaceSync(css); if (d.adoptedStyleSheets.indexOf(sh) < 0) d.adoptedStyleSheets = d.adoptedStyleSheets.concat([sh]); });
    var list = changes(), text = list.length ? JSON.stringify({ file: TOKEN_FILE, changes: list }, null, 2) : '';
    outPre.textContent = text || 'Nothing changed yet. Pick a token in the Set column; the token changes for ' + TOKEN_FILE + ' appear here.';
    out.classList.toggle('ds-lab-out-empty', !text);
    if (opts && opts.onChange) opts.onChange({ changes: list, json: text, file: TOKEN_FILE, count: list.length });
  }
  if (opts && opts.api) opts.api({ reset: function () { edits = {}; save(); applyEdits(); render(); } });

  function fitMatrix() {
    var d = docs.m, t = d && d.querySelector('.ds-grid'); if (!t || !mFrame.offsetWidth) return;
    void t.offsetHeight; DS.sample(mFrame, 'block-size', d.documentElement.scrollHeight + 'px');
  }
  function drawMatrix() {
    var d = docs.m; if (!d) return;
    // the matrix is a data grid like every table (batch 226), its rows handed to it (batch 286): each cell a picker
    // holding the drawn button, which keeps its click
    var pick = function (v, s) {
      var on = mode === 'full' && v[0] === ui.variant && s[0] === ui.state;   // only the full lab marks the one it draws below
      var p = d.createElement('span'); p.className = 'lab-pick' + (on ? ' on' : ''); p.dataset.v = v[0]; p.dataset.s = s[0]; p.title = 'Inspect ' + v[1] + ' · ' + s[1];
      p.innerHTML = buttonHtml(v[0], ui.size, s[0]);
      p.addEventListener('click', function () {
        if (opts && opts.onPick) { opts.onPick(p.dataset.v, p.dataset.s); return; }   // the All buttons page opens that variant
        ui.variant = p.dataset.v; ui.state = p.dataset.s; save(); render();
      });
      return p;
    };
    d.body.innerHTML = '';
    // a wide lab (it names a column width: a page header, a dashboard grid) draws one variant per row, in each state, the
    // drawing across the full width (owner, #352, option B); a small lab keeps one column per variant and a row per state
    var named = function (v, s) {   // a wide lab's row: its name over its drawing, one column as wide as the lab
      var cell = d.createElement('span'), name = d.createElement('span'); cell.className = 'plx-stack plx-stack--gap-xs lab-named'; name.className = 'plx-text plx-text--secondary';
      name.textContent = STATES.length > 1 ? v[1] + ' · ' + s[1] : v[1]; cell.appendChild(name); cell.appendChild(pick(v, s)); return cell;
    };
    var mBox = spec.matrixColumnWidth
      ? DS.grid(['Variant'], [].concat.apply([], VARIANTS.map(function (v) { return STATES.map(function (s) { return [named(v, s)]; }); })),
        { doc: d, label: spec.matrixLabel, shrink: true })   // each row's wrappers may shrink below the drawing's width (#352)
      : DS.grid(['State'].concat(VARIANTS.map(function (v) { return v[1]; })), STATES.map(function (s) { return [s[1]].concat(VARIANTS.map(function (v) { return pick(v, s); })); }),
        { doc: d, labelled: true, label: spec.matrixLabel, minWidth: spec.matrixColumnWidth });
    mBox.classList.add('lab-matrix'); d.body.appendChild(mBox); mBox.dsDraw();
    fitMatrix(); setTimeout(fitMatrix, 300);
    // what markup cannot say (a checkbox's partial state is a property): spec.after sets it once the cells are drawn (batch 255)
    if (spec.after) { spec.after(d); setTimeout(function () { spec.after(d); }, 300); setTimeout(function () { spec.after(d); }, 900); }
  }

  function drawAnatomy() {
    var named = find(VARIANTS, ui.variant)[1] + ' · ' + find(SIZES, ui.size)[1] + ' · ' + find(STATES, ui.state)[1];
    anatHead.textContent = 'Anatomy · ' + named;
    if (opts && opts.onTitle) opts.onTitle(named);   // the card's own title says what is drawn
    var d = docs.a; if (!d) return;
    d.body.innerHTML = '<div class="lab-anat"><div class="lab-stage"><div class="lab-zoom">' + buttonHtml(ui.variant, ui.size, ui.state, 'lab-specimen') + '</div></div><dl class="lab-legend"></dl></div>';
    if (spec.after) spec.after(d);
    requestAnimationFrame(function () { placeMarks(); readProps(); DS.sample(aFrame, 'block-size', d.documentElement.scrollHeight + 'px'); });
  }

  // the large button with lettered markers on the parts its properties style (a short straight leader from each marker to
  // its part), and the legend beside it: each letter's properties and their tokens (the spec's diagram rule: no text in
  // the drawing). Positions come from the rendered rectangles, so the markers sit exactly on the parts.
  function placeMarks() {
    var d = docs.a; if (!d) return;
    d.querySelectorAll('.lab-pad,.lab-mark,.lab-lead').forEach(function (e) { e.remove(); });
    var b = d.querySelector('.lab-specimen'), stage = d.querySelector('.lab-stage'), legend = d.querySelector('.lab-legend'); if (!b || !stage) return;
    var SW = stage.clientWidth; if (!SW || !b.offsetWidth) return;
    var zoom = b.parentNode, scale = Math.max(1, Math.min(96 / b.offsetHeight, (SW - 160) / b.offsetWidth, 5));
    DS.sample(zoom, 'scale', String(scale));
    var cs = d.defaultView.getComputedStyle(b);
    var pt = parseFloat(cs.paddingTop), pr = parseFloat(cs.paddingRight), pb = parseFloat(cs.paddingBottom), pl = parseFloat(cs.paddingLeft);
    var bt = parseFloat(cs.borderTopWidth), bl = parseFloat(cs.borderLeftWidth), w = b.offsetWidth, h = b.offsetHeight, x0 = b.offsetLeft, y0 = b.offsetTop;
    // the padding, shaded on the specimen (inside the scaled box, so it scales with it)
    [[bl, bt, w - 2 * bl, pt], [bl, h - bt - pb, w - 2 * bl, pb], [bl, bt + pt, pl, h - 2 * bt - pt - pb], [w - bl - pr, bt + pt, pr, h - 2 * bt - pt - pb]].forEach(function (q) {
      if (q[2] <= 0 || q[3] <= 0) return; var e = d.createElement('div'); e.className = 'lab-pad'; DS.place(e, x0 + q[0], y0 + q[1], q[2], q[3]); zoom.appendChild(e);
    });
    // the rendered rectangles, relative to the stage (read after the scale is applied)
    var sr = stage.getBoundingClientRect(), br = b.getBoundingClientRect(), k = scale;
    var r = { left: br.left - sr.left, top: br.top - sr.top, right: br.right - sr.left, bottom: br.bottom - sr.top };
    r.cx = (r.left + r.right) / 2; r.cy = (r.top + r.bottom) / 2;
    var label = (spec.labelSelector && b.querySelector(spec.labelSelector)) || b, lr = label.getBoundingClientRect();
    var t = { left: lr.left - sr.left, right: lr.right - sr.left, cy: (lr.top + lr.bottom) / 2 - sr.top };
    var val = function (cat, prop) { var raw = cs.getPropertyValue(prop).trim(), tk = tokensFor(cat, raw); var pick = cat === 'font' && tk.indexOf('plx-sys-font-label') >= 0 ? 'plx-sys-font-label' : tk[tk.length - 1]; return pick ? '--' + pick : cat === 'color' ? hex(raw) : raw; };
    var px = function (v) { return parseFloat(v) + 'px'; };
    var M = 22;   // the marker's distance from the specimen
    // a marker at (mx, my) and a straight leader to the point (px2, py2) on the part (one horizontal or vertical line)
    function mark(letter, mx, my, x2, y2) {
      var lead = d.createElement('div'); lead.className = 'lab-lead';
      // a vertical or a horizontal line: its length from the geometry, its thickness from the stylesheet (lab-lead--v, --h)
      if (Math.abs(mx - x2) < 1) { lead.classList.add('lab-lead--v'); DS.place(lead, mx, Math.min(my, y2), null, Math.abs(y2 - my)); }
      else { lead.classList.add('lab-lead--h'); DS.place(lead, Math.min(mx, x2), my, Math.abs(x2 - mx), null); }
      stage.appendChild(lead);
      var m = d.createElement('div'); m.className = 'lab-mark'; m.textContent = letter; DS.place(m, mx, my); stage.appendChild(m);
      var dot = d.createElement('div'); dot.className = 'lab-mark lab-mark--dot'; DS.place(dot, x2, y2); stage.appendChild(dot);
    }
    var padMid = r.left + bl * k + Math.max(pl * k / 2, 2);
    var rows = [
      ['A', [['Background color', val('color', 'background-color')]], function () { mark('A', r.cx, r.top - M, r.cx, r.top + bt * k + 4); }],
      // one row when the two sides are equal, each side when they differ (a select keeps room for its chevron; batch 254)
      ['B', pl === pr ? [['Padding-left & -right', val('space', 'padding-left')]] : [['Padding-left', val('space', 'padding-left')], ['Padding-right', val('space', 'padding-right')]], function () { mark('B', padMid, r.bottom + M, padMid, r.bottom - bt * k - 4); }],
      ['C', [['Min-height', val('control-height', 'min-height')], ['Height', px(cs.height)]], function () { mark('C', r.left - M, r.cy, r.left, r.cy); }],
      ['D', [['Margin', px(cs.marginTop)]], function () { mark('D', r.left - M, r.bottom + M, r.left - M, r.bottom); }],
      ['E', [['Border radius', val('radius', 'border-top-left-radius')], ['Border', val('border-width', 'border-top-width') + ' ' + cs.borderTopStyle + ' ' + val('color', 'border-top-color')]], function () { mark('E', r.right - 2, r.top - M, r.right - 2, r.top); }],
      ['F', [['Color', val('color', 'color')], ['Font-size', val('font-size', 'font-size')], ['Font-weight', val('font-weight', 'font-weight')], ['Font-family', val('font', 'font-family')], ['Text-transform', cs.textTransform]], function () { mark('F', r.right + M, t.cy, t.right, t.cy); }],
      ['G', [['Box-shadow', val('shadow', 'box-shadow')]], function () { mark('G', r.right + M, r.bottom + M, r.right + M, r.bottom); }]
    ];
    // a component that names its parts (spec.anchors: letter -> { part: selector, side }): its legend lists the properties
    // of each letter (spec.parts) that it draws in this state, and each marker points at that letter's part (batch 255)
    if (spec.anchors) {
      var letters = [];
      PROPS.forEach(function (p) { var L = PART[p.id]; if (L && letters.indexOf(L) < 0) letters.push(L); });
      letters.sort();
      var rectOf = function (sel) {
        var e = sel ? b.querySelector(sel) : b; if (!e) return null;
        var q = e.getBoundingClientRect(); if (!q.width && !q.height) return null;
        return { left: q.left - sr.left, top: q.top - sr.top, right: q.right - sr.left, bottom: q.bottom - sr.top, cx: (q.left + q.right) / 2 - sr.left, cy: (q.top + q.bottom) / 2 - sr.top };
      };
      var shown = function (p) { var raw = valueOf(cs, p), tk = tokensFor(p.cat, raw), one = tk[tk.length - 1]; return one ? '--' + one : p.cat === 'color' ? hex(raw) : raw; };
      rows = letters.map(function (L) {
        var a = spec.anchors[L] || {};
        var items = PROPS.filter(function (p) { return PART[p.id] === L && tokenNow(p); }).map(function (p) { return [p.label, shown(p)]; });
        return [L, items, function () {
          var q = rectOf(a.part); if (!q) return;
          var side = a.side || 'top';
          if (side === 'top') mark(L, q.cx, q.top - M, q.cx, q.top);
          else if (side === 'bottom') mark(L, q.cx, q.bottom + M, q.cx, q.bottom);
          else if (side === 'left') mark(L, q.left - M, q.cy, q.left, q.cy);
          else mark(L, q.right + M, q.cy, q.right, q.cy);
        }];
      }).filter(function (x) { return x[1].length; });
    }
    rows.forEach(function (x) { x[2](); });
    legend.innerHTML = '';
    rows.forEach(function (x) {
      var dt = d.createElement('dt'), m = d.createElement('span'); m.className = 'lab-mark lab-mark--key'; m.textContent = x[0]; dt.appendChild(m); legend.appendChild(dt);
      var dd = d.createElement('dd');
      x[1].forEach(function (row) { var line = d.createElement('div'); line.className = 'lab-row'; var n = d.createElement('span'); n.className = 'lab-name'; n.textContent = row[0]; line.appendChild(n); var v = d.createElement('span'); v.className = 'lab-val'; v.textContent = row[1]; line.appendChild(v); dd.appendChild(line); });
      legend.appendChild(dd);
    });
  }

  // a property's value as drawn: on the specimen, on its parent (p.host 'parent': a wrapper such as the select's), and/or on
  // a pseudo-element (p.pseudo, e.g. ::placeholder, ::after; batches 253-254)
  function valueOf(cs, p) {
    var d = docs.a, b = (p.pseudo || p.host || p.part) && d && d.querySelector('.lab-specimen');
    if (b && p.host === 'parent') b = b.parentElement;
    if (b && p.part) b = b.querySelector(p.part) || b;   // an inner part: the box of a checkbox, a switch's track (batch 255)
    return (b ? d.defaultView.getComputedStyle(b, p.pseudo || null) : cs).getPropertyValue(p.show || p.v || p.css[0]).trim();
  }

  // the property table: value as drawn, its token, and a control to set another
  function readProps() {
    var d = docs.a; if (!d || !aFrame.offsetWidth) return; var b = d.querySelector('.lab-specimen'); if (!b) return;
    var cs = d.defaultView.getComputedStyle(b);
    if (mode === 'editor') { readFields(cs); return; }
    if (mode === 'anatomy') { readAll(cs); return; }
    if (mode !== 'full') return;
    propGrid.innerHTML = '';
    PROPS.forEach(function (p) {
      var raw = valueOf(cs, p), full = tokenNow(p), edited = full && edits[full];
      var toks = tokensFor(p.cat, raw);
      var propRows = [];
      propGrid.appendChild(DS.el('h4', 'ds-lab-prop-name', p.label));
      var row = function (label, cell) { propRows.push([label, cell]); };
      var shown = p.cat === 'color' ? hex(raw) : p.cat === 'font' ? raw.split(',')[0].replace(/"/g, '') : raw;
      var vc = DS.el('span', 'ds-lab-val');
      if (p.cat === 'color') { var sw = DS.el('span', 'ds-lab-sw'); DS.setVar(sw, '--ds-sample-background-color', raw); vc.appendChild(sw); }
      vc.appendChild(document.createTextNode(shown)); row('Value', vc);
      // one token: the one the anatomy's legend names (the font's role for the font family, else the reference token)
      var one = p.cat === 'font' && toks.indexOf('plx-sys-font-label') >= 0 ? 'plx-sys-font-label' : toks[toks.length - 1];
      row('Token', DS.el('span', 'ds-lab-tok', one ? '--' + one : raw === 'none' || raw === 'auto' || /^0(px)?$/.test(raw) || shown === 'transparent' ? '—' : 'no token'));
      row(spec.name + ' token', DS.el('span', 'ds-lab-tok', full ? '--' + full : 'fixed in ' + FILE));
      var set = DS.el('span'), sel = DS.el('select', 'ds-lab-select'); sel.setAttribute('aria-label', 'Set ' + p.label.toLowerCase()); sel.disabled = !full;
      sel.appendChild(new Option('as styled', ''));
      (p.extra || []).forEach(function (x) { sel.appendChild(new Option(x, x)); });
      var groups = {};
      tokensOf(p.cat).forEach(function (full) {
        var tier = TIERS[tierOf(full)];
        if (!groups[tier]) { groups[tier] = document.createElement('optgroup'); groups[tier].label = tier; sel.appendChild(groups[tier]); }
        groups[tier].appendChild(new Option('--' + full, full));
      });
      sel.value = edited || '';
      sel.addEventListener('change', function () {
        if (sel.value) edits[full] = sel.value; else delete edits[full];
        save(); applyEdits(); drawMatrix(); requestAnimationFrame(function () { placeMarks(); readProps(); });
      });
      set.appendChild(sel); row('Set', set);
      row('Applies to', DS.el('span', 'ds-lab-scope', full ? reachOf(full) : spec.every));
      var t = DS.grid(['Name', 'Value'], propRows, { labelled: true, label: p.label });
      t.classList.add('ds-lab-props', 'ds-lab-prop'); if (edited) t.classList.add('ds-lab-edited');
      propGrid.appendChild(t);
    });
  }

  // the Attributes card's table (the owner, batch 192): every attribute the drawn button uses, not only its variant's own
  // rule: the property, its part in the drawing, its value (the token, or the value when none), where it is set, the visual
  var PART = spec.parts;
  var allTable = DS.el('div', 'ds-lab-all');
  if (mode === 'anatomy') lab.appendChild(allTable);
  function visualOf(p, raw) {
    var v = DS.el('span', 'ds-vis'); v.setAttribute('aria-hidden', 'true');
    if (p.cat === 'color') { if (hex(raw) === 'transparent') return null; v.classList.add('ds-vis--color'); DS.sample(v, 'background-color', raw); return v; }
    if (p.cat === 'font-size' || p.cat === 'font-weight' || p.cat === 'font') { v.textContent = 'Aa'; DS.sample(v, p.cat === 'font' ? 'font-family' : p.cat, raw); return v; }
    if (p.cat === 'radius' && parseFloat(raw)) { v.classList.add('ds-vis--radius'); DS.sample(v, 'border-radius', raw); return v; }
    if ((p.cat === 'space' || p.cat === 'control-height' || p.cat === 'icon') && parseFloat(raw) > 0) { v.classList.add('ds-vis--length'); DS.sample(v, 'inline-size', raw); return v; }
    if (p.cat === 'shadow' && raw !== 'none') { v.classList.add('ds-vis--shadow'); DS.sample(v, 'box-shadow', raw); return v; }
    return null;
  }
  function readAll(cs) {
    var allRows = [];
    PROPS.forEach(function (p) {
      var raw = valueOf(cs, p), toks = tokensFor(p.cat, raw);
      var one = p.cat === 'font' && toks.indexOf('plx-sys-font-label') >= 0 ? 'plx-sys-font-label' : toks[toks.length - 1];
      var shown = p.cat === 'color' ? hex(raw) : p.cat === 'font' ? raw.split(',')[0].replace(/"/g, '') : raw;
      var full = tokenNow(p), vc = DS.el('span'), vis = visualOf(p, raw); if (vis) vc.appendChild(vis);
      allRows.push([p.label, PART[p.id] || '—', one ? '--' + one : shown, full ? '--' + full : FILE + ' (fixed)', vc]);
    });
    allTable.innerHTML = ''; allTable.appendChild(DS.grid(['Property', 'Part', 'Value', 'Set in', 'Visual'], allRows, { labelled: true }));
  }

  // the Edit dialog's fields: one fieldset per section, a Select per property offering only the tokens that fit it
  // (by tier: component, system, reference) and its few keywords; under each, what it is now and where it applies
  // only token-backed properties: each field edits exactly one Button token (border style, text transform and margin are fixed)
  var SECTIONS = spec.sections;
  function readFields(cs) {
    var keep = document.activeElement && fields.contains(document.activeElement) ? document.activeElement.id : null;
    fields.innerHTML = '';
    SECTIONS.forEach(function (sec) {
      var fs = DS.el('fieldset', 'plx-fieldset plx-stack plx-stack--gap-md'); fs.appendChild(DS.el('legend', 'plx-fieldset__legend', sec[0]));
      sec[1].forEach(function (id) {
        var p = PROPS.filter(function (x) { return x.id === id; })[0]; if (!p) return;
        var full = tokenNow(p); if (!full) return;   // not drawn in this variant and state (no shadow, no border on a link)
        var raw = valueOf(cs, p), edited = edits[full];
        var toks = tokensFor(p.cat, raw), one = p.cat === 'font' && toks.indexOf('plx-sys-font-label') >= 0 ? 'plx-sys-font-label' : toks[toks.length - 1];
        var shown = p.cat === 'color' ? hex(raw) : p.cat === 'font' ? raw.split(',')[0].replace(/"/g, '') : raw;
        var fid = 'ds-edit-' + p.id, f = DS.el('div', 'plx-field plx-field--stacked'), head = DS.el('div', 'plx-field__head'), lb = DS.el('label', 'plx-field__label', p.label);
        lb.htmlFor = fid; head.appendChild(lb); f.appendChild(head);
        var ctl = DS.el('div', 'plx-field__control'), wrap = DS.el('span', 'plx-select'), sel = DS.el('select', 'plx-input plx-select__control');
        sel.id = fid; sel.setAttribute('aria-describedby', fid + '-d');
        sel.appendChild(new Option('As styled' + (one ? ' (--' + one + ')' : ''), ''));
        (p.extra || []).forEach(function (x) { sel.appendChild(new Option(x, x)); });
        var groups = {};
        tokensOf(p.cat).forEach(function (full) {
          var tier = TIERS[tierOf(full)];
          if (!groups[tier]) { groups[tier] = document.createElement('optgroup'); groups[tier].label = tier; sel.appendChild(groups[tier]); }
          var v = resolve(values[full]); groups[tier].appendChild(new Option('--' + full + (v && v.length < 32 ? ' · ' + v : ''), full));
        });
        sel.value = edited || '';
        sel.addEventListener('change', function () {
          if (sel.value) edits[full] = sel.value; else delete edits[full];
          save(); applyEdits(); requestAnimationFrame(function () { placeMarks(); readProps(); });
        });
        wrap.appendChild(sel); ctl.appendChild(wrap);
        var desc = DS.el('div', 'plx-field__description', 'Token --' + full + ' · now ' + shown + (one ? ' (--' + one + ')' : '') + ' · changes ' + reachOf(full));
        desc.id = fid + '-d'; ctl.appendChild(desc); f.appendChild(ctl);
        if (edited) f.classList.add('is-edited');
        fs.appendChild(f);
      });
      fields.appendChild(fs);
    });
    if (keep && document.getElementById(keep)) document.getElementById(keep).focus();
  }

  copy.addEventListener('click', function () {
    var t = changes().length ? outPre.textContent : ''; if (!t) return;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy changes'; }, 1500); }, function () {
      var r = document.createRange(); r.selectNodeContents(outPre); var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    });
  });
  reset.addEventListener('click', function () { edits = {}; save(); applyEdits(); render(); });

  function render() {
    Object.keys(segs).forEach(function (k) { segs[k].querySelectorAll('.ds-lab-seg-btn').forEach(function (b) { var on = b.dataset.value === ui[k]; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); });
    applyEdits(); drawMatrix(); drawAnatomy();
  }
  render();

  // ---- once the stylesheet and the token files are read: the token lists, then the frames
  var css = typeof sheetText === 'function' ? sheetText(PlenixSource.at('platform.css')) : Promise.resolve('');
  Promise.all([css, fetchText(PlenixSource.at('system/tokens/semantic.css')), fetchText(PlenixSource.at('system/themes/default.css')), fetchText(PlenixSource.at('system/tokens/components.css'))]).then(function (r) {
    [r[1], r[2]].forEach(function (text) { var t = rootTokens(text); Object.keys(t).forEach(function (n) { if (/^plx-sys-/.test(n)) values[n] = t[n]; }); });
    var comp = rootTokens(r[3]); Object.keys(comp).forEach(function (n) { if (spec.compPrefix.test(n)) values[n] = comp[n]; });
    Object.keys(values).filter(function (n) { return /^plx-(ref|sys|comp)-/.test(n); }).sort(function (a, b) { return tierOf(a) - tierOf(b); }).forEach(function (full) {
      var cat = catOf(full); if (!cat) return;
      (pool[cat] = pool[cat] || []).push(full);
      var m = tokenMap[cat] = tokenMap[cat] || {}, k = norm(cat, values[full]); (m[k] = m[k] || []).push(full);
    });
    mFrame = frame('ds-lab-matrix-frame', function (doc) { docs.m = doc; applyEdits(); drawMatrix(); });
    aFrame = frame('ds-lab-anatomy-frame', function (doc) { docs.a = doc; applyEdits(); drawAnatomy(); });
    states.appendChild(mFrame); anatGrid.appendChild(aFrame);
    // a frame in a hidden section has no styles yet: marks and values are read again once it is shown
    if (window.ResizeObserver) new ResizeObserver(function () { if (aFrame.offsetWidth) { placeMarks(); readProps(); } }).observe(aFrame);
    if (window.ResizeObserver) new ResizeObserver(function () { fitMatrix(); }).observe(mFrame);
  });
};
