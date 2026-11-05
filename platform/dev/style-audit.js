/* Plenix · Style audit (platform/dev/style-audit.js): rejects styling that does not come from the design system.
   Loaded by every Plenix page (check-system.js, rule "audit", keeps it there). On a page served from this machine
   (localhost) it watches the whole document and reports, as a console error, every:
     1. style element: a style block written into the page (styles come from platform.css and the page's own
        stylesheet files only);
     2. undefined custom property: a style attribute that sets a custom property other than a Platform one (--plx-…;
        the design system page's own --ds-… names on that page);
     3. font written inline: a font family that is not a Platform token reference (a font is never computed on the spot);
     4. DataGrid density: an inline height, min-height, max-height, line-height or padding on a DataGrid row or cell that does not equal a token
        (token-sized native geometry is allowed; arbitrary density overrides remain errors; owner, 2026-10-16);
     User content (an element inside .plx-user-content: the RichTextEditor's area and RichText showing saved HTML) may carry
     the person's own formatting, as Tiptap stores it: color, background-color, font-family, font-size and text-align
     only (owner, 2026-10-14: "the colors and fonts rule is limited to just the UI, not the user in Tiptap"); any other
     property there is checked as everywhere else.
     The chart engine's drawing (an element inside .plx-chart__engine: Apache ECharts, platform/charts/echarts/) may carry
     the sizes and fonts ECharts writes on its own elements, read from the chart tokens (owner, 2026-10-26, issue 353: the
     same exception as the text editor). Only these, on these elements (what ECharts writes for Line, Area, Bar and Pie):
     its div: position, overflow-x, overflow-y, width, height; its svg: position, left, top, user-select; its text:
     font-size, font-family, and font-weight (TreeChart's name in focus; owner, 2026-10-26, charts-tree-26) only when it
     equals one of the font-weight tokens (--plx-sys-font-weight-*). Any other inline property inside the engine, and
     everything Plenix draws on top of it, is checked as everywhere else.
     5. off the grid: an inline length that is neither a Platform token reference (var) nor a whole number of grid steps (the base
        spacing token, --plx-ref-space-1u; utils/grid.ts): "has to conform to fit into the grid system!!! important"
        (owner, 2026-10-13). A length in another unit than px (rem, em, vw…) is reported too; a percentage is a
        proportion, not a length, and 0 is on every grid. Border widths and separator thickness may equal the thin-border token (owner, 2026-10-16).
   Inline styles written by JavaScript are otherwise allowed (owner, 2026-10-13): "sometimes we have situations in which
   JavaScript is needed to make adjustments on the spot. And these adjustments make inline styles. However these
   adjustments are based on tokens and defined styles to make inline adjustments for that moment." Whether a written value
   comes from a token or is a hard-coded literal is a question of the source: check-system.js (rule inline-style) rejects
   style written in markup and literal values written by code before a page runs; this audit catches what only appears at
   run time.
     PlenixStyleAudit.audit()   -> [{ kind, element, detail }] for the current document
     PlenixStyleAudit.report()  -> the same, printed to the console
   Findings also go to document.documentElement's data-plx-style-findings (a count), which the page checks read.
   It also warns (console.warn, once per name; not a finding) about a deprecated bare icon class: plx-icon plx-icon--<name>
   written without the Icon component, which stops drawing at icon stage 5c-2 (issue 557). */
(function () {
  'use strict';
  var ON_THIS_MACHINE = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var SPEC = /\/platform\/design-system\//.test(location.pathname);
  var allowedVar = function (name) { return /^--plx-/.test(name) || (SPEC && /^--ds-/.test(name)); };
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  var total = 0, contexts = new WeakMap();
  // Each audit batch reads the computed token context once per grid, after the engine has drawn.
  function context(el) {
    var at = el.closest && el.closest('.plx-data-grid') || document.documentElement, cached = contexts.get(at);
    if (cached) return cached;
    var cs = getComputedStyle(at), root = getComputedStyle(document.documentElement), step = parseFloat(cs.getPropertyValue('--plx-ref-space-1u')) || 4, lengths = new Set([0]);
    if (/rem$/.test(cs.getPropertyValue('--plx-ref-space-1u').trim())) step *= parseFloat(root.fontSize) || 16;
    for (var i = 0; i < cs.length; i++) {
      var name = cs[i]; if (!/^--plx-(?:ref-(?:size|space)-|(?:sys|comp)-data-grid-.*(?:height|padding|size|width))/.test(name)) continue;
      var value = cs.getPropertyValue(name).trim(), match = /^(-?\d*\.?\d+)(px|rem)$/.exec(value);
      if (!match) continue;
      var px = +match[1] * (match[2] === 'rem' ? parseFloat(root.fontSize) || 16 : 1);
      if (Math.abs(px / step - Math.round(px / step)) < .001) lengths.add(px);
    }
    var thin = cs.getPropertyValue('--plx-sys-border-width-thin').trim();
    cached = { step: step, lengths: lengths, thin: /^\d+(?:\.\d+)?px$/.test(thin) ? parseFloat(thin) : 0 }; contexts.set(at, cached); return cached;
  }
  function tokenSize(value, el) {
    if (/^\s*var\(--plx-/.test(value)) return true;
    return String(value).trim().split(/\s+/).every(function (part) { return /^(?:0|\d+(?:\.\d+)?px)$/.test(part) && context(el).lengths.has(parseFloat(part)); });
  }

  function describe(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    var cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 3);
    return cls.length ? s + '.' + cls.join('.') : s;
  }
  // the grid step: the base spacing token in pixels (utils/grid.ts reads the same token)
  function gridStep(el) {
    return context(el).step;
  }
  // the first length in a value that is not on the grid (var(…) references are tokens; a percentage is a proportion)
  function offGrid(value, el, property) {
    // Native vertical extents include token-sized rows and thin separators. Only widths must land on the grid
    // (owner, 2026-10-16); source checks still forbid arbitrary literal inline styles.
    var v = String(value).replace(/var\([^()]*(\([^()]*\)[^()]*)*\)/g, ' '), step = gridStep(el), m, re = /(-?\d*\.?\d+)(px|rem|em|pt|pc|vh|vw|vmin|vmax|ch|ex|cm|mm|in)(?![\w-])/gi;
    while ((m = re.exec(v))) {
      var n = parseFloat(m[1]);
      if (!n) continue;
      if (m[2].toLowerCase() === 'px' && Math.abs(n) === context(el).thin && (/^border(?:-(?:top|right|bottom|left|block(?:-(?:start|end))?|inline(?:-(?:start|end))?))?-width$/.test(property) || (el.getAttribute('role') === 'separator' && /^(?:width|height|inline-size|block-size)$/.test(property)))) continue;
      if (m[2].toLowerCase() !== 'px') return m[0];
      var q = Math.abs(n) / step; if (Math.abs(q - Math.round(q)) * step > .001) return m[0];
    }
    return null;
  }
  // the person's own formatting on user content (the editor's area and saved rich text): these properties only
  var USER_FORMAT = /^(color|background-color|font-family|font-size|text-align)$/;
  function userContent(el) { return !!(el.closest && el.closest('.plx-user-content')); }
  var DENSITY = /^(height|min-height|max-height|line-height|padding(-(top|right|bottom|left|block|inline)(-(start|end))?)?)$/;
  // the chart engine's own sizes and fonts (owner, 2026-10-26, issue 353): these properties on these elements only
  var ENGINE_OWN = { div: /^(position|overflow-x|overflow-y|width|height)$/, svg: /^(position|left|top|user-select)$/, text: /^(font-size|font-family|font-weight)$/ };
  // a font weight ECharts writes must be one of the weight tokens' values (TreeChart reads them; charts-tree-26)
  var WEIGHTS = ['regular', 'medium', 'semibold', 'bold'];
  function weightToken(el, v) { var cs = getComputedStyle(el.ownerDocument.documentElement); return WEIGHTS.some(function (w) { return cs.getPropertyValue('--plx-sys-font-weight-' + w).trim() === String(v).trim(); }); }
  function engineOwn(el, p) { var host = el.parentElement && el.parentElement.closest && el.parentElement.closest('.plx-chart__engine'), r = host && ENGINE_OWN[String(el.tagName).toLowerCase()]; return !!(r && r.test(p) && (p !== 'font-weight' || weightToken(el, el.style.getPropertyValue(p)))); }
  function inlineFinding(el) {
    if (el.isConnected === false) return null;   // an element already gone from the page
    var st = el.style, bad = [], table = !!(el.matches && el.matches('.plx-data-grid .plx-data-grid__grid-row, .plx-data-grid .plx-data-grid__grid-cell')), user = userContent(el);
    for (var i = 0; i < st.length; i++) {
      var p = st[i], v = st.getPropertyValue(p);
      if (user && USER_FORMAT.test(p)) continue;
      if (engineOwn(el, p)) continue;
      if (/^--/.test(p) ? !allowedVar(p) : (p === 'font-family' && !/^\s*var\(--plx-/.test(v)) || (table && DENSITY.test(p) && !tokenSize(v, el))) bad.push(p + ': ' + v);
      else { var off = offGrid(v, el, p); if (off) bad.push(p + ': ' + v + ' (' + off + ' is off the grid)'); }
    }
    return bad.length ? { kind: 'inline style', element: describe(el), detail: bad.join('; ') } : null;
  }
  function audit(root) {
    var out = [], scope = root || document;
    var styled = scope.querySelectorAll ? scope.querySelectorAll('[style]') : [];
    if (root && root.nodeType === 1 && root.hasAttribute('style')) styled = [root].concat([].slice.call(styled));
    [].forEach.call(styled, function (el) { var f = inlineFinding(el); if (f) out.push(f); });
    var blocks = scope.querySelectorAll ? scope.querySelectorAll('style') : [];
    if (root && root.tagName === 'STYLE') blocks = [root];
    [].forEach.call(blocks, function (el) { out.push({ kind: 'style element', element: describe(el.parentNode || el), detail: (el.textContent || '').trim().slice(0, 120) }); });
    return out;
  }
  function flag(findings, el) {
    findings.forEach(function (f) {
      if (seen && el && seen.has(el)) return;
      total++;
      console.error('[Plenix style audit] ' + f.kind + ' on ' + f.element + ': ' + f.detail + ' — style it with Platform classes and tokens');
    });
    if (seen && el && findings.length) seen.add(el);
    document.documentElement.setAttribute('data-plx-style-findings', String(total));
  }
  function report() { contexts = new WeakMap(); var f = audit(); f.forEach(function (x) { console.error('[Plenix style audit] ' + x.kind + ' on ' + x.element + ': ' + x.detail); }); return f; }
  // a bare icon class (plx-icon plx-icon--<name> written without the Icon component: no plx-icon--inline) is deprecated
  // (owner, issue 277 Q3; issue 557): it draws from the stylesheet only until stage 5c-2. A warning, once per name, not a finding
  var bareWarned = new Set();
  function bareIcons(scope) {
    var list = scope.querySelectorAll ? [].slice.call(scope.querySelectorAll('.plx-icon:not(.plx-icon--inline)')) : [];
    if (scope.nodeType === 1 && scope.matches && scope.matches('.plx-icon:not(.plx-icon--inline)')) list.unshift(scope);
    list.forEach(function (el) {
      var name = ((typeof el.className === 'string' ? el.className : '').match(/\bplx-icon--([a-z0-9_-]+)/) || [])[1];
      if (!name || /^size-|^(filled|outline|mirrored)$/.test(name) || bareWarned.has(name)) return;
      bareWarned.add(name);
      console.warn('[Plenix] the bare icon class plx-icon--' + name + ' on ' + describe(el) + ' is retired and stops drawing at icon stage 5c-2 (issue 557): use <Icon name="' + name + '"> or, where the page writes HTML, Plenix.iconMarkup(\'' + name + '\')');
    });
  }
  window.PlenixStyleAudit = Object.freeze({ audit: function () { contexts = new WeakMap(); return audit(); }, report: report });

  if (!ON_THIS_MACHINE) return;
  function start() {
    bareIcons(document);
    audit().forEach(function (f) { flag([f]); });
    document.documentElement.setAttribute('data-plx-style-findings', String(total));
    var pending = new Set(), frame = 0;
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === 'attributes') pending.add(r.target);
        else [].forEach.call(r.addedNodes, function (n) { if (n.nodeType === 1) pending.add(n); });
      });
      if (!frame) frame = requestAnimationFrame(function () {
        frame = 0; contexts = new WeakMap();
        var nodes = Array.from(pending), pendingParents = new Set(nodes); pending.clear();
        nodes.forEach(function (n) {
          if (!n.isConnected) return;
          for (var parent = n.parentElement; parent; parent = parent.parentElement) if (pendingParents.has(parent)) return;
          bareIcons(n);
          audit(n).forEach(function (f) { flag([f], n); });
        });
      });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
