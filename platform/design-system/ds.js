/* global React, ReactDOM */
/* Plenix design spec: helpers for the spec page and its labs. They read the token files as text, so the page always
   shows the tokens that are really in use. */
var DS = {
  /* an icon as the Icon component draws it, for a lab that writes HTML (issue 557: the bare class plx-icon--<name> is
     retired): Plenix.iconMarkup from the registered module (the spec loads every Plenix icon). cls: more classes, where
     plx-icon--size-<s>, plx-icon--filled and plx-icon--outline become the size and filled options; label: an image's name
     (none: decorative). A release without iconMarkup (up to 0.73.0) gets the class form it still draws. */
  icon: function (name, cls, label) {
    var P = window.Plenix, size, filled;
    var more = String(cls || '').split(/\s+/).filter(function (c) {
      var m = /^plx-icon--size-(xs|sm|md|lg|xl)$/.exec(c);
      if (m) { size = m[1]; return false; }
      if (c === 'plx-icon--filled') { filled = true; return false; }
      if (c === 'plx-icon--outline') { filled = false; return false; }
      return !!c;
    });
    if (P && typeof P.iconMarkup === 'function') return P.iconMarkup(name, { size: size, filled: filled, className: more.join(' ') || undefined, label: label });
    // every value escaped, as iconMarkup does (a class keeps only class characters)
    var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var classes = ['plx-icon', 'plx-icon--' + name, size ? 'plx-icon--size-' + size : '', filled ? 'plx-icon--filled' : filled === false ? 'plx-icon--outline' : ''].concat(more)
      .map(function (c) { return String(c).replace(/[^A-Za-z0-9_-]/g, ''); }).filter(Boolean).join(' ');
    return '<span class="' + classes + '"' + (label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true"') + '></span>';   // plx-allow-bare-icon: a release up to 0.73.0, which draws the class
  },
  /* the token tiers as one text to parse: reference.css with semantic.css's :root added. base: the URL of the platform
     folder (ending in "/"). Resolves to the text. */
  loadTokens: function (base) {
    var get = function (u) { return fetch(base + u, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.text(); }); };
    return Promise.all([get('system/tokens/reference.css'), get('system/tokens/semantic.css')]).then(function (t) {
      return DS.mergeRoot(t[0], t[1]);
    });
  },
  /* token text -> { groups: [{title, tokens: [{name, full, value}]}], dark: {name: value} }. name: the short name that
     sections classify by (the real name without its tier, e.g. color-gray-700); full: the real name without "--"
     (plx-ref-color-gray-700), which is what pages show and what every sample is drawn with. */
  parse: function (text) {
    var light = /:root \{([\s\S]*?)\n\}/.exec(text)[1];
    var groups = [], current = null;
    light.split('\n').forEach(function (line) {
      var head = /\/\* ── (.*?)(?: ──|$)/.exec(line);
      if (head) { current = { title: head[1].replace(/\s*\(.*$/, '').replace(/\..*$/, '').trim(), note: (/\((.*)\)/.exec(head[1]) || [])[1] || '', tokens: [] }; groups.push(current); return; }
      var re = /--([a-z0-9-]+):\s*([^;]+);/g, m;
      while ((m = re.exec(line))) {
        if (!current) { current = { title: 'General', note: '', tokens: [] }; groups.push(current); }
        var full = m[1], short = full.replace(/^plx-(ref|sys|comp)-/, '');
        current.tokens.push({ name: short, full: full, value: m[2].trim() });
      }
    });
    var dark = {}, block = /:root\[data-plx-mode="dark"\] \{([\s\S]*?)\n\}/.exec(text);
    if (block) { var re2 = /--([a-z0-9-]+):\s*([^;]+);/g, d; while ((d = re2.exec(block[1]))) dark[d[1]] = d[2].trim(); }
    return { groups: groups.filter(function (g) { return g.tokens.length; }), dark: dark };
  },
  /* tokens.css with another token file's :root block added (radius.css keeps the radius system), read as one */
  mergeRoot: function (tokensText, otherText) {
    var other = /:root \{([\s\S]*?)\n\}/.exec(otherText || '');
    return other ? tokensText.replace(/(:root \{[\s\S]*?)(\n\})/, function (all, a, b) { return a + '\n' + other[1] + b; }) : tokensText;
  },
  /* what kind of value a token holds, which decides how it is shown and edited */
  kind: function (name, value) {
    if (/^color-/.test(name)) return 'color';
    if (/^-?\d+(\.\d+)?px$/.test(value)) return 'px';
    if (/^font-(sans|mono|body|heading|label|code|data)$/.test(name)) return 'font';
    if (/^shadow-/.test(name)) return 'shadow';
    if (/^-?\d+(\.\d+)?(s|ms)$/.test(value)) return 'time';
    if (/^-?\d*\.?\d+$/.test(value)) return 'number';
    return 'text';
  },
  /* the opacity scale as a table: a black square at each opacity over a checkerboard, the token, its value, what it is
     for, and the rules that use it, read from the stylesheets. sources: [[label, Promise of [{file, text}]]] */
  opacityTable: function (tokens, sources) {
    var PURPOSE = {
      'opacity-30': 'Faint: disabled actions, empty-state icons, sort arrows, resize handles, hints that appear on hover.',
      'opacity-50': 'Half: read-only fields, dropdown chevrons, the veil behind dialogs, secondary details.',
      'opacity-70': 'Strong: icons over images (close, expand), the remove × on a selected chip.'
    };
    var opUsed = [];   // the Used by lines, filled in once the stylesheets are read
    var opRows = tokens.map(function (tk) {
      var box = DS.el('span', 'ds-op-sw'); DS.setVar(box, '--ds-sample-opacity', 'var(--' + tk.full + ')');
      var val = DS.el('span', 'ds-space-val', tk.value);
      var uc = DS.el('span', 'ds-op-usage'); uc.appendChild(DS.el('div', '', PURPOSE[tk.name] || ''));
      var used = DS.el('div', 'ds-op-used', 'Used by: …'); used.setAttribute('data-token', tk.name); uc.appendChild(used); opUsed.push(used);
      return [box, '--' + (tk.full || tk.name), val, uc];
    });
    var t = DS.grid(['Opacity', 'Token', 'Value', 'Common usage'], opRows);

    Promise.all(sources.map(function (s) { return s[1]; })).then(function (all) {
      var used = {};
      all.forEach(function (sheets, i) {
        sheets.forEach(function (sheet) {
          if (/tokens\.css$/.test(sheet.file)) return;
          var re = /([^{}]+)\{([^{}]*)\}/g, m;
          while ((m = re.exec(sheet.text))) tokens.forEach(function (tk) {
            if (m[2].indexOf('var(--' + tk.full + ')') < 0) return;
            var sel = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim().split(',')[0].trim().replace(/^:where\(:root\[data-plx-mode="dark"\]\)\s*/, '');
            (used[tk.name] = used[tk.name] || []).push(sel + (sources.length > 1 ? ' (' + sources[i][0] + ')' : ''));
          });
        });
      });
      opUsed.forEach(function (el) {
        var list = (used[el.getAttribute('data-token')] || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
        el.textContent = 'Used by: ' + (list.length ? list.slice(0, 6).join(', ') + (list.length > 6 ? ' and ' + (list.length - 6) + ' more' : '') : 'nothing yet');
      });
    });
    return t;
  },
  el: function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; },
  /* a value only the page knows at run time (a token being shown, a measured position) becomes a class (batch 283: no
     element ever carries a style attribute): varClass(doc, name, value) generates one rule per custom property and value
     in the document's own constructed sample sheet (document.adoptedStyleSheets: no element), once, and returns its class name;
     a closed document (its frame removed, no defaultView) has nothing left to draw: no class ('') */
  varClass: function (doc, name, value) {
    doc = doc || document;
    var st = doc.__dsSamples;
    if (!st && !doc.defaultView) return '';
    if (!st) { var sheet = new doc.defaultView.CSSStyleSheet(); doc.adoptedStyleSheets = doc.adoptedStyleSheets.concat(sheet); st = doc.__dsSamples = { sheet: sheet, keys: {}, n: 0 }; }
    var key = name + '|' + value, c = st.keys[key];
    if (!c) { c = 'ds-v' + (++st.n); st.sheet.insertRule('.' + c + '{' + name + ':' + value + ';}', st.sheet.cssRules.length); st.keys[key] = c; }
    return c;
  },
  // sets one custom property on an element through its class (the class for the property's previous value is removed)
  setVar: function (n, name, value) {
    var mark = 'dsVar' + name.replace(/[^a-zA-Z0-9]/g, '');
    if (n.dataset[mark]) n.classList.remove(n.dataset[mark]);
    var c = DS.varClass(n.ownerDocument, name, value); if (c) n.classList.add(c); n.dataset[mark] = c; return n;
  },
  /* --ds-sample-<property>, read by the class ds-sample--<property> (ds-sample.css) */
  // a font sample also takes that font's word spacing (Reddit Mono's fitted spaces, owner 2026-10-18; normal for DM Sans)
  sampleSpacing: function (value) { return /mono|font-(data|code)/.test(String(value)) ? 'var(--plx-sys-font-data-word-spacing)' : 'normal'; },
  sample: function (n, prop, value) { n.classList.add('ds-sample--' + prop); if (prop === 'font-family') DS.setVar(n, '--ds-sample-word-spacing', DS.sampleSpacing(value)); return DS.setVar(n, '--ds-sample-' + prop, value); },
  // the same for React: the class names an element needs for a sample (ds-sample--<property> and the value's class)
  sampleClass: function (prop, value) { return 'ds-sample--' + prop + ' ' + DS.varClass(document, '--ds-sample-' + prop, value) + (prop === 'font-family' ? ' ' + DS.varClass(document, '--ds-sample-word-spacing', DS.sampleSpacing(value)) : ''); },
  // a box placed by measurement (left, top and, when given, its width and height, in px)
  place: function (n, x, y, w, hgt) {
    DS.sample(n, 'left', x + 'px'); DS.sample(n, 'top', y + 'px');
    if (w != null) DS.sample(n, 'width', w + 'px');
    if (hgt != null) DS.sample(n, 'height', hgt + 'px');
    return n;
  },
  /* a table built by a page or a lab, drawn as a DataGrid (the owner, batch 226: every table is a Plenix table): its
     header cells are the columns, each row a grid row; a row's <th> makes the first column the row header; a cell's
     content (text, swatches, bars, controls) moves into the grid's cell as it is, so its listeners keep working. The grid
     is named by the table's caption or aria-label, else by the nearest heading before it. Works in a frame too (the
     table's own document). Returns the element the grid is drawn in. */
  /* a table built by a page or a lab (Strict DS 6c, batch 286): its heads and rows handed to the Platform Table, drawn
     as a DataGrid look (the owner, batch 226: every table is a Plenix table). heads: the column titles ('' for none);
     rows: arrays of cells, each a string or a node (swatches, bars, controls keep their listeners); opts: label (default:
     the card or nearest heading's text), labelled (the first column is the row header; default when every row starts
     with a row-header cell), minWidth (a size token: the narrowest a content column gets), live (the indexes of columns
     whose cells the builder fills in later: they stay the given nodes), shrink (every cell's content wrapper gets
     ds-grid__content--shrink, so a cell may be narrower than its content's own width: a wide lab's rows). The grid draws once it is
     placed (DS.grid returns its box at once), so it can find its heading. */
  grid: function (heads, rows, opts) {
    var o = opts || {}, doc = o.doc || document, h = React.createElement, P = window.Plenix;
    var box = doc.createElement('div'); box.className = 'ds-grid'; box.dsPending = true;
    var draw = function () {
      if (!box.dsPending) return; box.dsPending = false;
      var wrap = 'ds-grid__content' + (o.shrink ? ' ds-grid__content--shrink' : '');
      var nodes = rows.map(function (r) { return r.map(function (c) { var s = doc.createElement('span'); s.className = wrap; if (c && c.nodeType) s.appendChild(c); else s.textContent = c == null ? '' : String(c); return s; }); });
      var data = rows.map(function (r, i) { var row = { id: i }; nodes[i].forEach(function (n, j) { row['c' + j] = n.textContent.trim(); }); return row; });
      var cols = Math.max(heads.length, rows.reduce(function (n, r) { return Math.max(n, r.length); }, 0));
      var named = function () {
        if (box.dsLabel || o.label) return box.dsLabel || o.label;
        for (var n = box; n && n !== doc.body; n = n.parentNode) for (var p = n.previousElementSibling; p; p = p.previousElementSibling) {
          if (/^H[1-6]$/.test(p.tagName) && p.textContent.trim()) return p.textContent.trim();
          var q = p.querySelectorAll && p.querySelectorAll('h1, h2, h3, h4, h5, h6'); if (q && q.length) return q[q.length - 1].textContent.trim();
        }
        return 'Table';
      };
      // a cell that holds only text is shown as text (the grid's own look); technical values (token names, numbers, var())
      // in the data font; anything else (swatches, bars, controls) is the cell's own content
      var plain = function (n) { return !n || ![].some.call(n.querySelectorAll('*'), function (e) { return e.tagName !== 'SPAN' && e.tagName !== 'CODE' || e.children.length || !e.textContent.trim(); }); };
      var technical = function (v) { return /^(--|var\(|-?[\d.]+(px|rem|em|%|s|ms)?$|#[0-9a-f]{3,8}$|rgba?\()/i.test(v); };
      function CellNode(props) { var ref = React.useRef(null); React.useLayoutEffect(function () { var host = ref.current; if (host && props.node) host.appendChild(props.node); return function () { if (props.node && props.node.parentNode === host) host.removeChild(props.node); }; }, [props.node]); return h('span', { ref: ref, className: wrap }); }
      var columns = [];
      for (var j = 0; j < cols; j++) (function (j) {
        var title = heads[j] || '', visual = /^(visual|picture|size|rendering|opacity)$/i.test(title) || !title && j > 0 && nodes.some(function (r) { return r[j] && !r[j].textContent.trim() && r[j].firstChild; });
        var text = !visual && (o.live || []).indexOf(j) < 0 && nodes.every(function (r) { return plain(r[j]); });
        var tech = text && data.every(function (row) { return !row['c' + j] || technical(row['c' + j]); });
        columns.push({ title: title, field: 'c' + j, kind: visual ? 'center' : tech ? 'data' : 'wrap', rowLabel: !!o.labelled && j === 0, sortable: !!title && !visual,
          minWidth: o.minWidth && j > 0 ? o.minWidth : undefined,
          render: text ? undefined : function (record) { var r = nodes[record.id]; return h(CellNode, { node: r && r[j] }); } });
      })(j);
      var shown = heads.some(function (x) { return !!x; });
      ReactDOM.createRoot(box).render(h(P.Table, { label: named(), data: data, columns: columns, headerVisible: shown }));
    };
    box.dsDraw = draw;
    Promise.resolve().then(draw);   // after the builder has placed the box (and its card has named it)
    return box;
  },
  // a table that arrives as markup (a page's HTML): its heads and rows read, then drawn by DS.grid in its place
  table: function (t, opts) {
    if (!t || t.tagName !== 'TABLE' || t.dsGrid) return t && t.dsGrid;
    var o = opts || {};
    var heads = [].map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    var trs = [].filter.call(t.querySelectorAll('tbody tr, :scope > tr'), function (tr) { return tr.children.length; });
    var labelled = trs.length && trs.every(function (tr) { return tr.children[0] && tr.children[0].tagName === 'TH'; });
    var rows = trs.map(function (tr) { return [].map.call(tr.children, function (c) { var f = t.ownerDocument.createDocumentFragment(); while (c.firstChild) f.appendChild(c.firstChild); var s = t.ownerDocument.createElement('span'); s.appendChild(f); return s; }); });
    var cap = t.querySelector('caption');
    var box = DS.grid(heads, rows, { doc: t.ownerDocument, labelled: labelled, minWidth: o.minWidth, label: o.label || (cap && cap.textContent.trim()) || t.getAttribute('aria-label') || undefined });
    if (t.parentNode) t.parentNode.insertBefore(box, t);
    t.remove(); t.dsGrid = box; box.dsGrid = box;
    box.dsDraw();
    return box;
  },
  slug: function (t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
};
