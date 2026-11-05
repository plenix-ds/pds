/* global DS, loadSheets */
/* Plenix master spec · Radius section. Reads the radius system from platform/system/radius.css (merged into the tokens by
   spec.js) and runs platform/dev/radius-audit.js on the live pages:
   the rules; the value tokens; the role tokens and what uses them; avatars as rounded squares; derived (concentric)
   radius, live; and the audit's findings. */
window.DSRadiusLab = function (section, data) {
  var groups = data.groups.filter(function (g) { return /^RADIUS/.test(g.title); });
  var values = [], roles = [];
  groups.forEach(function (g) { g.tokens.forEach(function (t) { (/^radius-[a-z]+-\d+px$/.test(t.name) ? roles : values).push(t); }); });
  var px = function (name) { var m = /(\d+)px$/.exec(name); return m ? +m[1] : 0; };
  function card(title, lead) {
    var c = DS.el('div', 'ds-group ds-radius-card'); c.appendChild(DS.el('h3', '', title));
    if (lead) c.appendChild(DS.el('p', 'ds-radius-lead', lead));
    section.appendChild(c); return c;
  }
  // a table: rows collected, then drawn by the Platform Table once placed (DS.grid, Strict DS 6c)
  function table(heads, live) { var rows = []; var t = DS.grid(heads, rows, { live: live }); t.classList.add('ds-radius-table'); return { table: t, add: function (cells) { rows.push(cells); } }; }
  var shape = function (radius, cls) { var b = DS.el('span', 'ds-radius-shape' + (cls ? ' ' + cls : '')); DS.setVar(b, '--ds-sample-border-radius', radius); return b; };

  // ---- 1. the rules
  var rules = card('The rules', 'Files: platform/system/radius.css holds the tokens; platform/dev/radius-audit.js checks the pages against these rules (every page loads it).');
  var ul = DS.el('ul', 'ds-radius-rules');
  [['Controls own their radius.', 'Buttons, inputs, selects, navigation items, menu items and toolbar actions use --plx-sys-radius-control wherever they sit, and never take a radius from their container.'],
   ['Control radius follows density.', '--plx-sys-radius-control is 6px in standard and comfortable density and 4px in compact: a compact control takes the smaller corner. Checks, swatches, tabs and list rows keep their own roles.'],
   ['Menus are containment surfaces.', 'Menus and dropdowns use --plx-sys-radius-menu-6px. A menu item is a control, not a nested surface; only an item whose outer corners meet the menu\'s rounded edge is checked corner by corner: it follows the menu, or the menu clips it.'],
   ['Focus rings follow the corner.', 'An outline (or ring shadow) offset by --plx-sys-focus-ring-offset follows the element\'s corner, so the ring is the element\'s radius + 2px without a separate token.'],
   ['Pills use --plx-sys-shape-pill.', 'Dots, toggles, counters and reactions. Avatars are the documented exception: rounded squares, never circles. The corner grows with the avatar (24px: 4px, larger: 6px).'],
   ['Related surfaces derive their radius.', 'A surface inset inside another rounded surface follows it: inner = max(0, outer − gap), where the gap is the real distance between the curves (border + padding). Use .plx-radius-concentric; a derived value is not snapped to the scale.'],
   ['Tiles are reserved.', 'A tile radius (a calculated 25%) belongs to a tile component only. There is no tile component yet, so there is no token.'],
   ['Names carry the value.', 'Values name their size (--plx-sys-shape-sm); roles name the use and the size (--plx-sys-radius-card-6px); a role that changes with density carries no value (--plx-sys-radius-control). Components use roles.']]
    .forEach(function (r) { var li = DS.el('li'); li.appendChild(DS.el('strong', '', r[0] + ' ')); li.appendChild(document.createTextNode(r[1])); ul.appendChild(li); });
  rules.appendChild(ul);

  // ---- 2. values
  var vc = card('Values', 'The sizes. Components do not use these directly; they use a role below.');
  var vt = table(['Shape', 'Token', 'Value']);
  values.forEach(function (t) {
    vt.add([shape('var(--' + t.full + ')'), '--' + t.full, DS.el('span', 'ds-space-val', t.value)]);
  });
  vc.appendChild(vt.table);

  // ---- 3. roles, with what uses each (read from every stylesheet in use)
  var rc = card('Roles', 'Role + value: the use and the size in one name. Where a role has several sizes, the audit asks whether they should be merged.');
  var rt = table(['Shape', 'Token', 'Value', 'Used by'], [3]), roleUsed = [];   // the Used by cells, filled once the stylesheets are read
  roles.forEach(function (t) {
    var u = DS.el('span', 'ds-radius-used', '…'); u.setAttribute('data-token', t.name); roleUsed.push(u);
    rt.add([shape('var(--' + t.full + ')'), '--' + t.full, DS.el('span', 'ds-space-val', px(t.name) + 'px'), u]);
  });
  rc.appendChild(rt.table);
  if (typeof loadSheets === 'function') loadSheets(PlenixSource.at('platform.css')).then(function (sheets) {
    var used = {}, seen = {};
    sheets.filter(function (x) { if (seen[x.file]) return false; seen[x.file] = 1; return true; }).forEach(function (sheet) {   // every stylesheet in use, each file once
      if (/\/(tokens|themes)\/[a-z-]+\.css$/.test(sheet.file)) return;   // where the tokens are defined, not used
      var re = /([^{}]+)\{([^{}]*)\}/g, m, text = sheet.text.replace(/\/\*[\s\S]*?\*\//g, '');
      while ((m = re.exec(text))) roles.forEach(function (t) {
        if (m[2].indexOf('var(--' + t.full + ')') < 0) return;
        var sel = m[1].trim().split(',')[0].trim().replace(/^:where\(:root\[data-plx-mode="dark"\]\)\s*/, '');
        if (/^(:root|\[data-plx-)/.test(sel)) return;   // a context that sets a token, not a component
        used[t.name] = used[t.name] || []; if (used[t.name].indexOf(sel) < 0) used[t.name].push(sel);
      });
    });
    roleUsed.forEach(function (el) {
      var l = used[el.getAttribute('data-token')] || [];
      el.textContent = l.length ? l.slice(0, 5).join(', ') + (l.length > 5 ? ' and ' + (l.length - 5) + ' more' : '') : 'no rule uses it directly (only through another token, or in markup)';
    });
  });

  // ---- 4. avatars
  var ac = card('Avatars', 'Rounded squares at every size; the corner comes from the avatar\'s size. A circle is reported by the audit.');
  var row = DS.el('div', 'ds-radius-avatars');
  [24, 28, 32, 40, 64, 96].forEach(function (s) {
    var r = s <= 24 ? 4 : s <= 40 ? 6 : s <= 64 ? 8 : 12, box = DS.el('div', 'ds-radius-av-item');
    var av = DS.el('span', 'ds-radius-av', 'RM'); DS.sample(av, 'width', 'var(--plx-ref-size-' + s + 'px)'); DS.sample(av, 'height', 'var(--plx-ref-size-' + s + 'px)'); DS.setVar(av, '--ds-sample-border-radius', 'var(--plx-sys-radius-avatar-' + r + 'px)');
    DS.sample(av, 'font-size', s >= 64 ? 'var(--plx-ref-font-size-18)' : s >= 40 ? 'var(--plx-ref-font-size-14)' : 'var(--plx-ref-font-size-11)');
    box.appendChild(av); box.appendChild(DS.el('div', 'ds-radius-av-label', s + 'px · --plx-sys-radius-avatar-' + r + 'px')); row.appendChild(box);
  });
  var no = DS.el('div', 'ds-radius-av-item ds-radius-av-no'), nav = DS.el('span', 'ds-radius-av', 'RM'); DS.sample(nav, 'width', 'var(--plx-ref-size-40px)'); DS.sample(nav, 'height', 'var(--plx-ref-size-40px)'); DS.setVar(nav, '--ds-sample-border-radius', 'var(--plx-sys-shape-pill)'); DS.sample(nav, 'font-size', 'var(--plx-ref-font-size-14)');
  no.appendChild(nav); no.appendChild(DS.el('div', 'ds-radius-av-label', 'Not this: a circle')); row.appendChild(no);
  ac.appendChild(row);

  // ---- 5. derived (concentric) radius, live
  var cc = card('Derived radius', 'A surface inside another rounded surface: inner = max(0, outer − gap). Move the sliders; the right-hand pair shows the common mistake of repeating the outer radius inside.');
  var ctrl = DS.el('div', 'ds-radius-ctrls');
  function slider(label, min, max, val) {
    var w = DS.el('label', 'ds-radius-slider'); w.appendChild(DS.el('span', '', label));
    var i = document.createElement('input'); i.type = 'range'; i.min = min; i.max = max; i.value = val; i.setAttribute('aria-label', label);
    var o = DS.el('output', 'ds-space-val', val + 'px'); w.appendChild(i); w.appendChild(o); ctrl.appendChild(w); return { input: i, out: o };
  }
  var so = slider('Outer radius', 0, 32, 16), sg = slider('Gap (border + padding)', 0, 32, 8);
  cc.appendChild(ctrl);
  var demos = DS.el('div', 'ds-radius-demos');
  function pair(title) {
    var d = DS.el('div', 'ds-radius-demo'); d.appendChild(DS.el('div', 'ds-radius-demo-title', title));
    var outer = DS.el('div', 'ds-radius-outer'), inner = DS.el('div', 'ds-radius-inner'); outer.appendChild(inner); d.appendChild(outer);
    var cap = DS.el('div', 'ds-radius-demo-cap'); d.appendChild(cap); demos.appendChild(d); return { outer: outer, inner: inner, cap: cap };
  }
  var good = pair('Derived (right)'), bad = pair('Same radius inside (wrong)');
  cc.appendChild(demos);
  var formula = DS.el('pre', 'ds-radius-formula'); cc.appendChild(formula);
  function update() {
    var R = +so.input.value, I = +sg.input.value, inner = Math.max(0, R - I);
    so.out.textContent = R + 'px'; sg.out.textContent = I + 'px';
    [good, bad].forEach(function (p, i) {
      DS.sample(p.outer, 'border-radius', R + 'px'); DS.sample(p.outer, 'padding', I + 'px');
      DS.sample(p.inner, 'border-radius', (i === 0 ? inner : R) + 'px');
      p.cap.textContent = 'outer ' + R + 'px · gap ' + I + 'px · inner ' + (i === 0 ? inner : R) + 'px';
    });
    formula.textContent = '.panel { --plx-sys-radius-outer: ' + R + 'px; --plx-sys-radius-inset: ' + I + 'px; }\n.panel > .well { /* .plx-radius-concentric */ border-radius: max(0px, calc(var(--plx-sys-radius-outer) - var(--plx-sys-radius-inset))); }   /* = ' + inner + 'px */';
  }
  so.input.addEventListener('input', update); sg.input.addEventListener('input', update); update();

  // ---- 6. the audit, run on the live pages
  var au = card('Audit', 'platform/dev/radius-audit.js run on the live pages as they load (hidden dialogs and menus are not drawn, so only their stylesheet rules are checked).');
  var bar = DS.el('div', 'ds-radius-auditbar'); au.appendChild(bar);
  var again = DS.el('button', 'ds-motion-play', 'Run again'); again.type = 'button'; bar.appendChild(again);
  var res = DS.el('div', 'ds-radius-results'); au.appendChild(res);
  var PAGES = [['Asset browser', '../../dam/index.html'], ['System settings', '../../dam/settings-system.html'], ['Image editor', '../../dam/image-editor.html'], ['Dashboard', '../../dashboard/index.html']];
  function runOne(page) {
    return new Promise(function (resolve) {
      var f = document.createElement('iframe'); f.className = 'ds-radius-probe'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.src = page[1];
      var done = function (r) { f.remove(); resolve({ page: page[0], result: r }); };
      f.addEventListener('load', function () { setTimeout(function () { try { done(f.contentWindow.PlenixRadius ? f.contentWindow.PlenixRadius.audit() : null); } catch { done(null); } }, 1500); });
      document.body.appendChild(f);
    });
  }
  function run() {
    res.textContent = 'Running the audit…';
    PAGES.reduce(function (p, page) { return p.then(function (acc) { return runOne(page).then(function (r) { acc.push(r); return acc; }); }); }, Promise.resolve([])).then(function (list) {
      res.innerHTML = '';
      list.forEach(function (r) {
        var box = DS.el('div', 'ds-radius-page'); box.appendChild(DS.el('h4', '', r.page));
        if (!r.result) { box.appendChild(DS.el('p', 'ds-radius-lead', 'Could not run (the page did not load the audit script).')); res.appendChild(box); return; }
        var f = r.result.findings, s = r.result.stats, sum = DS.el('div', 'ds-radius-summary');
        sum.textContent = s.cornersChecked + ' corners in the stylesheets · ' + s.avatars + ' avatars · ' + s.cornersCompared + ' nested corners compared · ' + (f.length ? f.length + ' finding' + (f.length === 1 ? '' : 's') : 'no findings');
        box.appendChild(sum);
        if (f.length) {
          var t = table(['Finding', 'Where', 'Expected', 'Actual']);
          f.forEach(function (x) {
            var c = DS.el('span', 'ds-radius-sev-' + x.severity); c.appendChild(DS.el('strong', '', x.classification)); c.appendChild(DS.el('div', 'ds-radius-detail', x.detail + ' (' + x.severity + ', ' + x.confidence + ' confidence)'));
            t.add([c, x.target, x.expected, x.actual]);
          });
          box.appendChild(t.table);
        }
        res.appendChild(box);
      });
    });
  }
  again.addEventListener('click', run);
  // run once, the first time the section is shown
  var started = false;
  var watch = function () { if (!started && au.offsetParent) { started = true; run(); } };
  if (window.ResizeObserver) new ResizeObserver(watch).observe(au); else run();
};
