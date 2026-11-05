/* global DS, loadSheets, React, ReactDOM, Plenix */
/* Plenix master spec · Layout system: the five layers and control sizing, read live from the system files
   (platform/system: tokens/, grid.css, density.css, controls.css, interaction.css; the data grid: components/DataGrid) and checked against the live pages. */
window.DSLayoutLab = function (api) {
  var section = api.section, data = api.data;
  var tokenValue = {}, fullOf = {}, valueOfFull = {}; data.groups.forEach(function (g) { g.tokens.forEach(function (t) { tokenValue[t.name] = t.value; fullOf[t.name] = t.full; valueOfFull[t.full] = t.value; }); });
  var get = function (u) { return fetch(u, { cache: 'no-store' }).then(function (r) { return r.text(); }); };
  function card(s, title, lead) { var c = DS.el('div', 'ds-group ds-lay-card'); c.appendChild(DS.el('h3', '', title)); if (lead) c.appendChild(DS.el('p', 'ds-lay-lead', lead)); s.appendChild(c); return c; }
  // a table: its heads and rows handed to the Platform Table (DS.grid, Strict DS 6c)
  function table(parent, heads, rows, live) { var t = DS.grid(heads, rows, { live: live }); t.classList.add('ds-lay-table'); parent.appendChild(t); return t; }
  // a code sample that may scroll: in the Tab order, so the keyboard can scroll it (batch 211)
  var pre = function (parent, txt) { var p = DS.el('pre', 'ds-lay-pre', txt); p.tabIndex = 0; p.setAttribute('role', 'region'); p.setAttribute('aria-label', 'Code'); parent.appendChild(p); return p; };
  // a low-level wireframe: lettered regions with no text inside the drawing, and the legend beside it.
  // rows: [letter, name, code (classes, tokens), note, inside (the letter of the region it sits in), kind ('grid' | 'foot')]
  function wire(parent, kind, rows) {
    var w = DS.el('div', 'ds-wire'), f = DS.el('div', 'ds-wire__frame ds-wire__frame--' + kind), dl = DS.el('dl', 'ds-wire__legend'), box = {};
    f.setAttribute('role', 'img'); f.setAttribute('aria-label', 'Wireframe, regions ' + rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('; '));
    rows.forEach(function (r) {
      var b = DS.el('div', 'ds-wire__box ds-wire__box--' + (r[4] ? r[5] : r[0].toLowerCase()));
      b.appendChild(DS.el('span', 'ds-wire__marker', r[0]));
      if (r[5] === 'grid') { var g = DS.el('div', 'ds-wire__cols'); for (var i = 0; i < 12; i++) g.appendChild(DS.el('span')); b.appendChild(g); }
      (r[4] ? box[r[4]] : f).appendChild(b); box[r[0]] = b;
      var dt = DS.el('dt'); dt.appendChild(DS.el('span', 'ds-wire__marker ds-wire__marker--key', r[0])); dl.appendChild(dt);
      var dd = DS.el('dd'); dd.appendChild(DS.el('span', 'ds-wire__term', r[1]));
      if (r[2]) dd.appendChild(DS.el('code', 'ds-wire__code', r[2]));
      if (r[3]) dd.appendChild(DS.el('span', 'ds-wire__note', r[3]));
      dl.appendChild(dd);
    });
    w.appendChild(f); w.appendChild(dl); parent.appendChild(w); return w;
  }

  // ---- overview
  var ov = section('l-overview', 'Overview', 'Five independent layers. Each answers one kind of question, so changing one never moves another: density does not change columns, the grid does not size buttons, a table owns its own columns.', 'platform/system/grid.css · density.css · controls.css · interaction.css · table.css · platform/providers/theme-boot.js');
  var c0 = card(ov, 'The layers');
  table(c0, ['Layer', 'File', 'Controls', 'Does not control'], [
    ['1 Spatial', 'tokens/reference.css', 'Padding, gaps, alignment steps, sizing rhythm (4px base)', 'Number of columns, page hierarchy'],
    ['2 Layout', 'grid.css', 'Shell regions, content columns (4/8/12/16), spans, max-widths', 'A table\'s inner columns, button size'],
    ['3 Density', 'density.css', 'Row and control heights, padding, gaps, gutter, preferred panel widths', 'Shell structure, column count'],
    ['4 Interaction & responsive', 'interaction.css', 'Pointer / touch / mobile, target sizes, hover, focus; reflow, collapse, overlay, drill-in', 'A page\'s purpose; whether a dense table stays a table'],
    ['5 Data grids', 'components/DataGrid/data-grid.css', 'Every table is a DataGrid: its columns, pinning, sideways scroll, sort, filter; row height and text by density', 'The page grid\'s column count'],
    ['Control sizing (beneath all)', 'controls.css', 'The 24–52px control scale and the control roles', 'The shell, the grid']]);
  var c0b = card(ov, 'How a screen is decided', 'Three separate choices, not one "responsive size": layout mode + density + interaction environment = the rendered workspace.');
  table(c0b, ['Environment', 'Layout', 'Density', 'Interaction', 'Example'], [
    ['Asset browser on a desktop workstation', '12 or 16 columns', 'Compact', 'Pointer', 'Browser, table, filters, inspector'],
    ['Asset browser on a 40-inch 3280px monitor', '16 columns + ultra-wide regions', 'Compact', 'Pointer', 'Navigation + filters + wide table + inspector'],
    ['Standard desktop tool', '12 columns', 'Standard', 'Pointer', 'Search, record detail, standard admin'],
    ['Settings page on desktop', '12 columns, contained form', 'Comfortable (by choice)', 'Pointer', 'Configuration form + help or preview'],
    ['Touch laptop', '8 or 12 columns', 'Standard or Comfortable', 'Touch', 'Dashboard, record management'],
    ['Tablet', '8 columns', 'Standard or Comfortable', 'Touch', 'List, detail, filter drawer'],
    ['Phone', '4 columns, re-composed', 'Mobile-appropriate', 'Mobile', 'Prioritized list → record detail']]);
  var live = card(ov, 'This page, right now'); var liveP = DS.el('p', 'ds-lay-lead'); live.appendChild(liveP);
  var showLive = function () { var r = document.documentElement; liveP.textContent = 'Density: ' + (r.dataset.plxDensity || 'standard (no workspace script on this page)') + ' · interaction: ' + (r.dataset.plxInteraction || (matchMedia('(pointer: coarse)').matches ? 'touch' : 'pointer')) + ' · window ' + innerWidth + 'px.'; };
  showLive(); addEventListener('resize', showLive);

  // ---- 1 spatial
  var sp = section('l-spatial', 'Spatial', 'A 4px base unit: every standard spacing and dimensional step is a multiple of 4px. Token names carry their value (--plx-ref-space-16px is 16px). 1px and 2px remain for borders and fine alignment.', 'platform/system/tokens/reference.css');
  // a value in px (the tokens are written in rem, at the page's root size)
  var toPx = function (v) { var m = /^(-?[\d.]+)rem$/.exec(String(v).trim()); return m ? +m[1] * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) + 'px' : v; };
  var off = function (prefix) { return Object.keys(tokenValue).filter(function (n) { return n.indexOf(prefix) === 0; }).map(function (n) { return [n, parseFloat(toPx(tokenValue[n]))]; }).filter(function (x) { return x[1] > 2 && x[1] % 4; }); };
  var c1 = card(sp, 'Off the 4px grid', 'A live check of the spacing and size tokens: any that are not a multiple of 4px are listed here.');
  var offRows = off('space-').concat(off('size-'));
  var uses = DS.el('p', 'ds-lay-lead', 'Counting uses…'); c1.appendChild(uses);
  var offUses = [];   // the Uses cells, counted once the stylesheets are read
  table(c1, ['Token', 'Value', 'Nearest on the grid', 'Uses'], offRows.map(function (x) { var v = x[1], lo = Math.floor(v / 4) * 4, hi = lo + 4; return ['--' + fullOf[x[0]], v + 'px', lo + ' or ' + hi + 'px', offUses[offUses.push(DS.el('span', '', '…')) - 1]]; }), [3]);
  (typeof loadSheets === 'function' ? loadSheets(PlenixSource.at('platform.css')) : Promise.resolve([])).then(function (sheets) {   // every stylesheet in use, counted once
    var seen = {}, all = sheets.filter(function (x) { if (seen[x.file]) return false; seen[x.file] = 1; return true; });
    var cnt = function (n) { return all.reduce(function (a, s) { return /tokens\/[a-z]+\.css$/.test(s.file) ? a : a + (s.text.match(new RegExp('var\\(--' + n + '\\)', 'g')) || []).length; }, 0); };
    offUses.forEach(function (cell, i) { cell.textContent = cnt(fullOf[offRows[i][0]]); });
    uses.textContent = offRows.length ? offRows.length + ' tokens are off the 4px grid.' : 'None: every spacing and size token is a multiple of 4px.';
  });

  var c1b = card(sp, 'Corrections', 'The 14 tokens that were off the grid (2026-10-04). Owner: the design system (platform/system/tokens/reference.css). Nothing is temporary: the old tokens are gone.');
  table(c1b, ['Token', 'Value', 'Uses', 'Category', 'Replacement or reason kept'], [
    ['--space-6', '6px', '556', 'Spacing: control internals, icon and label gaps', '--space-8 (the spec’s 8px role); default table cell padding → --space-4 (its 4–6px range)'],
    ['--space-10', '10px', '474', 'Spacing: compact card and cell padding', '--space-12'],
    ['--space-14', '14px', '211', 'Spacing: standard component padding', '--space-16'],
    ['--space-50', '50px', '5', 'Spacing: major section separation', '--space-48'],
    ['--size-6', '6px', '19', 'Optical: dots, pips, chevron height, checkmark', 'Kept as --plx-ref-glyph-size-6px (documented optical size)'],
    ['--size-10', '10px', '15', 'Optical: small icons, version dots, chevron width', 'Kept as --plx-ref-glyph-size-10px'],
    ['--size-14', '14px', '34', 'Optical: icons, spinner, file badge, info dot', 'Kept as --plx-ref-glyph-size-14px'],
    ['--size-18', '18px', '8', 'Optical: icons, separators; two 18px buttons', 'Kept as --plx-ref-glyph-size-18px; the saved-search × and the card menu button became 24px inline actions'],
    ['--size-70', '70px', '13', 'Layout: column widths, heights', '--plx-ref-size-72px'],
    ['--size-78', '78px', '1', 'Layout: a minimum height', '--plx-ref-size-80px'],
    ['--size-90', '90px', '2', 'Layout: widths', '--plx-ref-size-92px (new)'],
    ['--size-110', '110px', '6', 'Layout: label columns', '--plx-ref-size-112px (new)'],
    ['--size-130', '130px', '7', 'Layout: columns', '--plx-ref-size-132px (new)'],
    ['--size-150', '150px', '2', 'Layout: columns', '--plx-ref-size-152px (new)']]);
  c1b.appendChild(DS.el('p', 'ds-lay-lead', 'Allowed off the 4px grid, by category and never as spacing or control boxes: border widths (1–4px), typography line heights, glyph optical sizes (--plx-ref-glyph-size-*), hairline separators.'));

  // placement: every icon on the 4px grid, horizontally and vertically (batch 127)
  var c1c = card(sp, 'Placement on the grid', 'Not only the tokens: where things land is on the 4px grid too. Every icon\'s box (its x, y, width and height) measured from its region (the header, the navigation pane, a rail, the inspector, the switcher) is a multiple of 4px, in every density and at every width. A labeled control\'s width follows its text, so an icon inside one is measured from the control\'s own start edge.');
  table(c1c, ['Rule', 'How the system keeps it', 'Where'], [
    ['An icon sits on the grid inside its control', 'The icon is the control height\'s grid icon: (height − icon) ÷ 2 is a multiple of 4. Never a size picked by eye', '--plx-sys-control-icon-<role> (table below); Button, NavList rows and their pin and actions, SearchField, SegmentedControl, ToolRail, CollapsibleSection, SidePanel'],
    ['Dividers take no space', 'A 1px divider is drawn inside its box (an inset shadow, or a centered 1px line in a 4px box), so it never shifts what follows by 1px', 'The header\'s edge and divider, the navigation pane, the rails, the inspector, the switcher panel, section headings, the rail divider'],
    ['Padding counts the border', 'A bordered control\'s inline padding is its token minus the border width, so its icon starts on the grid', 'Button (calc(var(--plx-comp-button-padding) − 1px))'],
    ['Fixed chrome, fixed sizes', 'Density never changes the shell: the header is 56px, its items 40px with 24px icons, the avatar 32px, the action 32px with a 16px icon, the header name 160px', '--plx-comp-app-header-item-size, -icon-size, -avatar-size, -action-height, -action-icon-size, -name-width'],
    ['Text that stacks with icons has a grid line height', 'Labels whose box decides where the next icon lands use a line height in px tokens (16px for 11px text, 20px for 13px), not a unitless one', 'Field labels, switcher tile labels, the inspector\'s preview label'],
    ['No numbers in code', 'Icon and avatar sizes are names (Icon size="xs | sm | md | lg", Avatar size="xs … 2xl") or come from the container; breakpoints, widths and steps are read from tokens (tokenPx, below)', 'node check-style.js: rules icon-size and media']]);
  var c1d = card(sp, 'The grid icon of each control height', 'Set per density with the control heights (platform/system/tokens/semantic.css). A control with an icon uses its role\'s icon token, so the icon is centered on the grid whatever the density.');
  table(c1d, ['Control height', 'Grid icon', 'Offset ((height − icon) ÷ 2)'], [
    ['24px', '16px', '4px'], ['28px', '12px', '8px'], ['32px', '16px', '8px'], ['36px', '20px', '8px'], ['40px', '24px', '8px'], ['44px (touch, mobile)', '20px', '12px']]);
  table(c1d, ['Token', 'Compact', 'Standard', 'Comfortable', 'Touch / mobile'], [
    ['--plx-sys-control-icon-inline', '16px (24)', '12px (28)', '16px (32)', '20px (44)'],
    ['--plx-sys-control-icon-toolbar', '12px (28)', '12px (28)', '16px (32)', '20px (44)'],
    ['--plx-sys-control-icon-standard', '12px (28)', '16px (32)', '20px (36)', '20px (44)'],
    ['--plx-sys-control-icon-prominent', '16px (32)', '16px (32)', '20px (36)', '20px (44)'],
    ['--plx-sys-control-icon-dialog', '20px (36)', '20px (36)', '24px (40)', '20px (44)']]);
  table(c1d, ['Named size', 'Token', 'Value', 'Use'], [
    ['xs', '--plx-sys-icon-size-xs', '12px', 'Inline with 11–12px text'],
    ['sm', '--plx-sys-icon-size-sm', '16px', 'Inline with body text (the default, --plx-sys-icon-size)'],
    ['md', '--plx-sys-icon-size-md', '20px', 'Badges on media, viewer controls'],
    ['lg', '--plx-sys-icon-size-lg', '24px', 'Empty states, previews, drop zones, the header']]);
  pre(card(sp, 'Markup'), '<Button icon="upload">Upload</Button>          the icon is --plx-sys-control-icon-standard\n<Icon name="folder" size="lg" />               a named size (never size={24})\n<Avatar name="Jordan Avery" size="md" />      xs 24 · sm 28 · md 32 · lg 40 · xl 48 · 2xl 64\n.my-row { --plx-comp-icon-size: var(--plx-sys-control-icon-standard); }   a container sets its icons\' size\nconst w = tokenPx(\'--plx-sys-shell-nav-width\');    window.matchMedia(below(\'--plx-sys-shell-rail-below\'))');

  // ---- 2 layout
  var la = section('l-layout', 'Layout', 'The shell owns navigation, filter and inspector panels, the header and overlays. The content grid lives only inside the main region and follows the main region\'s width (a container query), not the window\'s. At most 16 columns.', 'platform/system/grid.css');
  var c2 = card(la, 'Shell');
  wire(c2, 'shell', [
    ['A', 'Header', '.plx-shell-header · --plx-sys-shell-header-height', '56px, the full width'],
    ['B', 'Navigation', '.plx-shell-nav · --plx-sys-shell-nav-width', '240px; 272px from a 1440px window; 320px from 1920px'],
    ['C', 'Filter rail', '.plx-shell-filters · --plx-sys-panel-filter-width', 'By density'],
    ['D', 'Main region', '.plx-shell-main', 'The container the content grid measures'],
    ['E', 'Content grid', '.plx-page-grid', '4, 8, 12 or 16 columns, inside the main region', 'D', 'grid'],
    ['F', 'Inspector', '.plx-shell-inspector · --plx-sys-panel-inspector-width', 'By density']]);
  table(c2, ['Region', 'Token', 'Behavior'], [
    ['Header (.plx-shell-header)', '--plx-sys-shell-header-height (56px)', 'Header name (the application switcher), pinned applications, search, global actions'],
    ['Navigation (.plx-shell-nav)', '--plx-sys-shell-nav-width (240px under 1440px; 272px at 1440–1919px; 320px at 1920px and wider)', 'Resizable 140–320px, never wider than 90% of the window; its Collapse button makes it a rail; a rail below 840px (Medium); a bottom navigation bar below 600px (Narrow)'],
    ['Filter rail (.plx-shell-filters)', '--plx-sys-panel-filter-width (by density: 280 / 320 / 360px)', 'Docked; a drawer on narrow regions'],
    ['Main region (.plx-shell-main)', '—', 'Holds the content grid; data-plx-layout picks the mode'],
    ['Inspector (.plx-shell-inspector)', '--plx-sys-panel-inspector-width (by density: 320 / 360 / 400px)', 'Docked; an overlay when the main region is narrow']]);
  table(card(la, 'Pane widths by window width', 'The panes start wider on larger windows (system/grid.css; the -from-1440 and -from-1920 size tokens). A width a person dragged to, or one an application sets, wins.'), ['Window width', 'Navigation pane', 'Side panel', 'Middle pane (SecondaryPane sm / md / lg)'], [
    ['Under 1440px', '240px', '240px', '180 / 220 / 280px'],
    ['1440–1919px', '272px', '320px', '220 / 260 / 320px'],
    ['1920px and wider', '320px', '400px', '260 / 320 / 400px']]);
  table(card(la, 'Pane limits'), ['Rule', 'Detail'], [
    ['Size steps', 'A pane snaps to the size tokens (--plx-ref-size-*), from 4px up to 1600px; the largest steps are 960, 1000, 1200, 1400 and 1600px, so a pane or a Resizable box drags to at most 1600px'],
    ['Narrowest middle pane', 'The secondary pane drags no narrower than its own token, --plx-comp-secondary-pane-width-min (180px)'],
    ['Window share', 'A pane is never wider than --plx-sys-shell-pane-window-share (90%) of the window, and a table column never wider than 90% of its table, taken down to the 4px grid. A smaller limit of the component or the application still applies.'],
    ['Remembered per monitor', 'The width a person drags the navigation pane or the side panel to is saved per monitor, named by its physical size (the screen size times the device pixel ratio, to the nearest 10px). A stored size within 10px counts as the same monitor. A saved width that no longer fits the window is not used and is kept for when it fits again.']]);
  var c3 = card(la, 'Columns', 'By main-region width. Density changes the gutter and margins, never the column count.');
  table(c3, ['Main region', 'Columns', 'Gutter', 'Page margin', 'Behavior'], [
    ['under 600px', '4', '12px', '16px', 'single column, focused mobile composition'],
    ['600–1023px', '8', 'density (12/16/24px)', '24px', 'tablet: controls become drawers or stacked regions'],
    ['1024–1439px', '12', 'density', 'density (24/24/32px)', 'standard desktop'],
    ['1440px and wider', '16', 'density', 'density (24/32/48px)', 'wide workspace'],
    ['1920px and wider', '16', 'density', 'density', 'ultra-wide: expand, add regions, compare, constrain; never more columns']]);
  var c4 = card(la, 'Column calculator', 'W main = viewport − navigation − filters − inspector; W grid = W main − 2 × margin; W column = (W grid − (N − 1) × gutter) ÷ N; a span of S columns = S × W column + (S − 1) × gutter.');
  var form = DS.el('div', 'ds-lay-form'); c4.appendChild(form);
  var inputs = {};
  [['Viewport', 'vp', 3280], ['Navigation', 'nav', 240], ['Filters', 'fil', 0], ['Inspector', 'ins', 360]].forEach(function (f) {
    var l = DS.el('label', 'ds-lay-field'); l.appendChild(DS.el('span', '', f[0]));
    var i = document.createElement('input'); i.type = 'number'; i.min = 0; i.step = 4; i.value = f[2]; i.setAttribute('aria-label', f[0] + ' width in px'); l.appendChild(i); l.appendChild(DS.el('span', '', 'px')); form.appendChild(l); inputs[f[1]] = i;
  });
  var dsel = document.createElement('select'); ['compact', 'standard', 'comfortable'].forEach(function (d) { dsel.appendChild(new Option(d.charAt(0).toUpperCase() + d.slice(1), d)); }); dsel.value = 'standard'; dsel.setAttribute('aria-label', 'Density');
  var dl = DS.el('label', 'ds-lay-field'); dl.appendChild(DS.el('span', '', 'Density')); dl.appendChild(dsel); form.appendChild(dl);
  var out = DS.el('div'); c4.appendChild(out);
  function calc() {
    var W = (+inputs.vp.value) - (+inputs.nav.value) - (+inputs.fil.value) - (+inputs.ins.value);
    var N = W < 600 ? 4 : W < 1024 ? 8 : W < 1440 ? 12 : 16, dn = dsel.value;
    var G = W < 600 ? 12 : { compact: 12, default: 16, comfortable: 24 }[dn];
    var M = W < 600 ? 16 : W < 1024 ? 24 : W < 1440 ? { compact: 24, default: 24, comfortable: 32 }[dn] : { compact: 24, default: 32, comfortable: 48 }[dn];
    var Wg = W - 2 * M, Wc = (Wg - (N - 1) * G) / N, r = function (x) { return Math.round(x * 10) / 10; };
    out.innerHTML = '';
    out.appendChild(DS.el('p', 'ds-lay-result', 'Main region ' + W + 'px → ' + N + ' columns' + (W >= 1920 ? ' (ultra-wide)' : '') + ' · gutter ' + G + 'px · margin ' + M + 'px · grid ' + Wg + 'px · column ' + r(Wc) + 'px'));
    table(out, ['Span', 'Width'], [2, 3, 4, 6, 8, 12, 16].filter(function (s) { return s <= N; }).map(function (s) { return [s + ' columns', r(s * Wc + (s - 1) * G) + 'px']; }));
    var bar = DS.el('div', 'ds-lay-cols'); DS.sample(bar, 'grid-template-columns', 'repeat(' + N + ',1fr)'); for (var i = 0; i < N; i++) bar.appendChild(DS.el('span')); out.appendChild(bar);
  }
  Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener('input', calc); }); dsel.addEventListener('change', calc); calc();
  // the layout standard: the design system's definition (platform/standards/layout.json). The applications' code is
  // generated from it (build-standards.js), so what is defined here is what every app does.
  var c5 = card(la, 'Layout modes', 'The five ways a page can be laid out, as the layout standard defines them (platform/standards/layout.json).');
  var c5b = card(la, 'The layout standard', 'An application only says what a page is (<AppShell page="settings">, or a pattern that is that kind of page, such as SettingsLayout). This standard decides how each kind of page is laid out. Change it in platform/standards/layout.json, rebuild, and every page of that kind, in every app, follows. The system check rejects an application that sets a layout itself (rule page-layout) and any hand edit to the generated code (rule generated).');
  fetch(PlenixSource.at('standards/layout.json'), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (std) {
    var val = function (v) { return String(v).replace(/^\{(plx-[a-z]+)\.([a-z0-9-]+)\}$/, '--$1-$2'); };
    table(c5, ['Mode', 'What it does', 'Defined values'], Object.keys(std.modes).map(function (m) {
      var o = std.modes[m], vals = Object.keys(o).filter(function (k) { return k !== 'description'; }).map(function (k) { return k + ': ' + (Array.isArray(o[k]) ? o[k].join(', ') : val(o[k])); });
      return [m, o.description, vals.join(' · ') || '—'];
    }));
    table(c5b, ['Kind of page (page=)', 'Layout mode', 'For'], Object.keys(std.pages).map(function (k) { return [k + (k === std.default ? ' (default)' : ''), std.pages[k].mode, std.pages[k].use]; }));
  });
  var c6 = card(la, 'Spans, compositions and bounded content');
  pre(c6, '<div class="plx-shell-main" data-plx-layout="multi-pane">\n  <div class="plx-page-grid">\n    <header class="plx-span-full">…</header>     every child picks its span\n    <section class="plx-span-4">filters</section>\n    <section class="plx-span-12">workspace</section>\n    <form class="plx-content-form">…</form>       at most 960px wide\n  </div>\n</div>\n\nSpans:        .plx-span-1 … .plx-span-16 (never wider than the grid: a span of 12 is the full width of 8 columns)  .plx-span-full\nCompositions: .plx-workspace-4-8-4  .plx-workspace-4-12  .plx-workspace-12-4  .plx-workspace-8-8\n              side regions .plx-workspace__start and .plx-workspace__end leave it below their usable width\nBounded:      .plx-content-prose (760) .plx-content-form (960) .plx-content-detail (1200) .plx-content-editor (1600) .plx-content-workspace (fluid)\nUltra-wide: still 16 columns. Expand the work surface, add a region only when it is used again and again, compare,\nconstrain forms and prose. Never scale controls or type with the screen.');

  // ---- 3 density
  var de = section('l-density', 'Display density', 'Display density controls the amount of information and interaction affordance visible within a stable workspace. It is a user- and workflow-oriented presentation preference, not a breakpoint, a device class or a page-layout mode.', 'platform/system/density.css');
  var cp = card(de, 'Policy');
  table(cp, ['Rule', 'Statement'], [
    ['Modes', 'Compact, Standard, Comfortable (Standard is the system default). A mode is a bundle of approved values, not a multiplier; its anchor is the standard control (28 / 32 / 36px).'],
    ['What it changes', 'Control roles, table and list row height, cell padding, component inset, local and toolbar gaps, card-grid gap, grid gutter, page margins, preferred panel widths, and the prominence of optional secondary information.'],
    ['What it never changes', 'The 4px foundation, the app shell, page hierarchy, the responsive column count (4 / 8 / 12 / 16), a table\'s column model, the navigation model, the mobile composition.'],
    ['What it never hides', 'Required information: status, warnings, ownership, labels, and every action (a destructive action keeps an accessible route). Compact may shorten optional metadata or move it to the record\'s detail.'],
    ['Interaction wins', 'Touch and Mobile use 44px minimum targets whatever the density. Compact is a pointer-and-keyboard mode; phones are not offered it.'],
    ['Context is kept', 'A change keeps selection, focus, scroll position (the item at the top stays), expanded state, filters, sorting, columns, saved views and panel state. No animated resizing; virtualized lists re-measure on plenix:densitychange.'],
    ['One system', 'The same tokens, classes and state apply to every application. No application selector, token, script branch or documentation exception.']]);
  var cs2 = card(de, 'Scope', 'The first that applies wins. Set by platform/providers/theme-boot.js.');
  table(cs2, ['Order', 'Scope', 'How', 'Example'], [
    ['1', 'Interaction environment', 'data-plx-interaction (interaction.css)', 'A tablet: every target 44px'],
    ['2', 'The user\'s explicit choice', 'PlenixWorkspace.setDensity(d)', 'An analyst chooses Comfortable'],
    ['3', 'Saved workspace or view', '<html data-plx-density-view="…"> + setViewDensity(view, d)', '“Audit log” saved as Compact'],
    ['4', 'Page or region policy', 'data-plx-density-policy on <html> or a region', 'A dense work queue; a compact table inside a standard page'],
    ['5', 'System default', '—', 'Standard']]);
  var cc = card(de, 'The density control', 'A labeled choice in settings (never an icon-only switch). It states the active density, describes each option, applies at once, persists, keeps the task context and announces the change. Try it: this preview does not save.');
  var tf = document.createElement('iframe'); tf.className = 'ds-frame ds-lay-frame'; tf.title = 'Display density control';
  // the Platform stylesheet: foundations and components
  var PREVIEW_CSS = [PlenixSource.css].map(function (u) { return '<link rel="stylesheet" href="' + new URL(u, location.href).href + '">'; }).join('');
  var ws = PlenixSource.themeBoot;
  var FONTS = '<link rel="stylesheet" href="' + PlenixSource.fonts + '">';   // the hosted fonts (batch 227)
  // the markup the React Button renders (platform/components/Button/Button.tsx): variant and size classes, a label span, or an icon for an icon-only button
  var button = function (label, variant, size, icon) {
    return '<button type="button" class="plx-button plx-button--' + variant + (size ? ' plx-button--size-' + size : '') + (icon ? ' plx-button--icon-only" aria-label="' + label : '') + '">'
      + (icon ? '<span class="plx-button__icon">' + DS.icon(icon) + '</span>' : '<span class="plx-button__label">' + label + '</span>') + '</button>';
  };
  // a DataGrid drawn into a preview frame's placeholder (every table is a DataGrid, batch 226): it runs on the frame's own
  // Platform and takes the frame's density; the frame is measured again once the grid is drawn
  var gridInFrame = function (f, refit) {
    try {
      var d = f.contentDocument, host = d && d.querySelector('.ds-frame-grid'); if (!host || host.dsDrawn) return; host.dsDrawn = true;
      ReactDOM.createRoot(host).render(React.createElement(Plenix.DataGrid, { label: 'Categories', headerMenu: false,
        data: [{ id: 1, name: 'Banner icon', count: '24' }, { id: 2, name: 'Bookshelf', count: '18' }, { id: 3, name: 'Borders', count: '245' }, { id: 4, name: 'Certificates', count: '387' }],
        columns: [{ title: 'Category', field: 'name', kind: 'name' }, { title: 'Assets', field: 'count', kind: 'data', align: 'right' }] }));
      [300, 900].forEach(function (ms) { setTimeout(refit, ms); });
    } catch { /* not readable */ }
  };
  var TOOLBAR = '<div class="row">' + button('Filter', 'secondary', 'sm') + button('Sort', 'secondary', 'sm') + button('Grid', 'secondary', 'sm', 'grid-2x2') + '</div>';
  // the density control is the Platform ChoiceList with useDensity, as in both applications
  // the production React build, as react-loader.js gives every page (the development build is 1 MB more and slower)
  var REACT = PlenixSource.react.concat([PlenixSource.js]).map(function (u) { return '<script src="' + new URL(u, location.href).href + '"></script>'; }).join('') +
    '<script>var h = React.createElement; function D() { var s = Plenix.useDensity(); return h(Plenix.ChoiceList, { legend: "Display density", value: s[0], onChange: s[1], options: PlenixWorkspace.densities() }); }' +
    ' ReactDOM.createRoot(document.getElementById("plx-density")).render(h(Plenix.ThemeProvider, null, h(D)));</script>';
  tf.srcdoc = '<!doctype html><html lang="en" data-plx-interaction="pointer"><head><script>try{Object.defineProperty(window,"localStorage",{value:(function(){var m={};return{getItem:function(k){return k in m?m[k]:null},setItem:function(k,v){m[k]=String(v)},removeItem:function(k){delete m[k]}}})()})}catch{}</script><script src="' + ws + '"></script>' + FONTS + PREVIEW_CSS + '' + '<link rel="stylesheet" href="' + new URL('layout-lab-frame.css', location.href).href + '">' + '</head><body class="ds-frame-density"><div id="plx-density"></div><div>' + TOOLBAR + '<div class="ds-frame-grid"></div></div>' + REACT + '</body></html>';
  var fit = function () { try { DS.sample(tf, 'height', tf.contentDocument.documentElement.scrollHeight + 'px'); } catch { /* not readable */ } };
  tf.addEventListener('load', function () { fit(); gridInFrame(tf, fit); try { tf.contentWindow.addEventListener('plenix:densitychange', function () { setTimeout(fit, 30); }); } catch { /* not readable */ } });
  cc.appendChild(tf);
  table(cc, ['Option', 'Description'], [['Compact', 'Show more rows and controls for dense desktop work'], ['Standard', 'Balance information density and readability'], ['Comfortable', 'Add space for easier scanning and interaction']]);
  var c7 = card(de, 'The modes, as defined in tokens/semantic.css'); var c7body = DS.el('div', '', 'Reading semantic.css…'); c7.appendChild(c7body);
  get(PlenixSource.at('system/tokens/semantic.css')).then(function (css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');   // comments mention the mode names
    var modes = { compact: {}, standard: {}, comfortable: {} };
    var re = /([^{}]+)\{([^{}]*)\}/g, m;
    while ((m = re.exec(css))) {
      var sel = m[1], mode = /comfortable/.test(sel) ? 'comfortable' : /compact/.test(sel) ? 'compact' : /standard/.test(sel) ? 'standard' : null;
      if (!mode || /density-changing|interaction|radius/.test(sel)) continue;
      m[2].split(';').forEach(function (d) { var kv = d.split(':'); if (kv.length > 1 && !/radius/.test(kv[0])) modes[mode][kv[0].trim()] = kv.slice(1).join(':').trim(); });   // the control radius is the Radius section's
    }
    var px = function (v) { if (!v) return '—'; var t = /var\(--([a-z0-9-]+)\)/.exec(v); return t ? toPx(valueOfFull[t[1]] || tokenValue[t[1]] || t[1].replace(/.*-(\d+)px$/, '$1px').replace(/^(space|size)-(\d+)$/, '$2px')) : v; };
    c7body.textContent = '';
    table(c7body, ['Token', 'Compact', 'Standard', 'Comfortable'], Object.keys(modes.standard).map(function (k) { return [k, px(modes.compact[k]), px(modes.standard[k]), px(modes.comfortable[k])]; }));
    c7body.appendChild(DS.el('p', 'ds-lay-lead', 'Dialog and destructive-confirmation actions carry more consequence: 36px in compact and standard, 40px in comfortable.'));
  });
  var c8 = card(de, 'Preview', 'The same toolbar, form row and data grid drawn with the system stylesheet at each density.');
  var row = DS.el('div', 'ds-lay-previews'); c8.appendChild(row);
  ['compact', 'standard', 'comfortable'].forEach(function (d) {
    var box = DS.el('div', 'ds-lay-preview'); box.appendChild(DS.el('div', 'ds-lay-preview-title', d));
    var f = document.createElement('iframe'); f.className = 'ds-frame ds-lay-frame'; f.title = 'Density preview: ' + d;   // ds-frame: measured again when the section is shown (ds-view.js)

    f.srcdoc = '<!doctype html><html lang="en" data-plx-density="' + d + '" data-plx-interaction="pointer"><head>' + FONTS + PREVIEW_CSS + '' + '<link rel="stylesheet" href="' + new URL('layout-lab-frame.css', location.href).href + '">' + '</head><body class="ds-frame-preview">'
      + TOOLBAR
      + '<div class="row"><input class="plx-input" type="text" aria-label="Name" value="Name">' + button('Save', 'primary') + '</div>'
      + '<div class="ds-frame-grid"></div></body></html>';
    var refit = function () { try { DS.sample(f, 'height', f.contentDocument.documentElement.scrollHeight + 'px'); } catch { /* not readable */ } };
    f.addEventListener('load', function () { refit(); gridInFrame(f, refit); });
    box.appendChild(f); row.appendChild(box);
  });

  // ---- control sizing
  var ct = section('l-controls', 'Control sizing', 'Every shared control is 24, 28, 32, 36, 40, 44, 48 or 52px. The role picks the height, not the emphasis. All controls of one standard row share one role. Text buttons use a minimum height; icon-only buttons are square.', 'platform/system/controls.css');
  var c9 = card(ct, 'Roles by density', 'Density sets the defaults; a control’s role can pick an approved larger size. Touch and mobile set every role to at least 44px.');
  table(c9, ['Role', 'Token · where', 'Compact', 'Standard', 'Comfortable', 'Touch / Mobile'], [
    ['Dense inline action (table row, asset card, pane close/minimize)', '--plx-sys-control-height-inline · Button size="xs"', '24', '28', '32', '44+'],
    ['Standard toolbar row (icon and labeled buttons, search, selects, triggers, overflow)', '--plx-sys-control-height-toolbar · Button size="sm"', '28', '28', '32', '44+'],
    ['Standard form control', '--plx-sys-control-height-standard · Button (size="md", the default), fields', '28', '32', '36', '44+'],
    ['Standard page action', '--plx-sys-control-height-prominent · beside the page title, Button size="lg"', '32', '32', '36', '44+'],
    ['Dialog / confirmation action', '--plx-sys-control-height-dialog · dialog footers', '36', '36', '40', '44+'],
    ['Destructive confirmation action', '--plx-sys-control-height-dialog-destructive · red dialog actions', '36', '36', '40', '44+'],
    ['Prominent touch / mobile call to action', '--plx-comp-button-height-3xl / -4xl, chosen on purpose', '—', '—', '—', '48–52']]);
  var c9b = card(ct, 'Rules');
  table(c9b, ['Rule', 'Statement'], [
    ['Toolbar consistency', 'A standard toolbar is one control row. Every control in it (icon-only and labeled buttons, search fields, selects, comboboxes, date pickers, split buttons, dropdown triggers, overflow) uses the toolbar height: 28px in compact. A glyph may be 16px; the icon button’s box stays 28px.'],
    ['Inline-action scope', '24px is only for dense local pointer actions: table-row actions, asset-card actions, pane close and minimize. Never a mixed-height member of a toolbar or form row.'],
    ['Dialog actions', 'Compact density applies to ordinary high-frequency controls. Dialog and destructive-confirmation actions carry more consequence: 36px in compact and standard, 40px in comfortable, 44px+ on touch and mobile.'],
    ['Role, not application', 'A component picks its role from its context (dialog footer, table row, toolbar), never from the application it is in. A pattern no role describes gets a new generic role (e.g. --plx-sys-control-height-list-row-action).'],
    ['Row alignment', 'All controls of one standard row use the same role token, so they line up.'],
    ['Model', '24px inline and pane chrome · 28px compact toolbars and controls · 32px page and form actions · 36px dialogs and confirmations · 44px+ touch and mobile']]);
  var c10 = card(ct, 'Scale', 'Control-only sizes (value in the name) and the neutral scale for a size chosen on purpose (data-size).');
  table(c10, ['Size', 'Token', 'Use'], [['24px', '--plx-ref-control-size-24px · xs', 'dense expert actions (pointer only)'], ['28px', '--plx-ref-control-size-28px · sm', 'compact toolbars, filters'], ['32px', '--plx-ref-control-size-32px · md', 'standard desktop controls'], ['36px', '--plx-ref-control-size-36px · lg', 'dialog actions, prominent forms'], ['40px', '--plx-ref-control-size-40px · xl', 'comfortable, lower-frequency'], ['44px', '--plx-ref-control-size-44px · 2xl', 'touch and mobile default'], ['48px', '--plx-ref-control-size-48px · 3xl', 'large mobile action'], ['52px', '--plx-ref-control-size-52px · 4xl', 'prominent mobile call to action']]);
  var c11 = card(ct, 'Control audit', 'Every visible button, input and select on the live pages, measured as drawn. Anything off the scale or under 24px needs fixing or a documented exception.');
  var auditOut = DS.el('div', '', 'Waiting for this section to be shown…'); c11.appendChild(auditOut);
  var PAGES = [['Asset browser', '../../dam/index.html'], ['System settings', '../../dam/settings-system.html'], ['Dashboard', '../../dashboard/index.html']];
  var OK = [24, 28, 32, 36, 40, 44, 48, 52];
  function measure(page) {
    return new Promise(function (resolve) {
      var f = document.createElement('iframe'); f.className = 'ds-radius-probe'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.src = page[1];
      f.addEventListener('load', function () {
        setTimeout(function () {
          var res = { page: page[0], ok: 0, off: {} };
          try {
            var d = f.contentDocument;
            d.querySelectorAll('button,input:not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=range]):not([type=color]),select,[role=button]').forEach(function (e) {
              if (!e.offsetParent || e.classList.contains('visually-hidden')) return;
              var tgt = e, b4 = f.contentWindow.getComputedStyle(e, '::before'); if (b4.position === 'absolute' && b4.content !== 'none' && b4.top === '0px' && b4.bottom === '0px') { var pp = e.parentElement; while (pp && f.contentWindow.getComputedStyle(pp).position === 'static') pp = pp.parentElement; if (pp) tgt = pp; }   // a stretched target: its hit area is the parent
              var h = Math.round(tgt.getBoundingClientRect().height * 10) / 10; if (!h) return;
              if (OK.indexOf(h) >= 0) res.ok++; else { var k = e.tagName.toLowerCase() + '.' + Array.prototype.slice.call(e.classList, 0, 2).join('.') + ' · ' + h + 'px'; res.off[k] = (res.off[k] || 0) + 1; }
            });
            res.density = d.documentElement.dataset.plxDensity; res.interaction = d.documentElement.dataset.plxInteraction;
          } catch { res.error = true; }
          f.remove(); resolve(res);
        }, 1500);
      });
      document.body.appendChild(f);
    });
  }
  var ran = false;
  function runAudit() {
    if (ran) return; ran = true; auditOut.textContent = 'Measuring…';
    PAGES.reduce(function (p, pg) { return p.then(function (acc) { return measure(pg).then(function (r) { acc.push(r); return acc; }); }); }, Promise.resolve([])).then(function (list) {
      auditOut.textContent = '';
      list.forEach(function (r) {
        auditOut.appendChild(DS.el('h4', 'ds-lay-h4', r.page + (r.density ? ' · ' + r.density + ', ' + r.interaction : '')));
        var offs = Object.keys(r.off);
        auditOut.appendChild(DS.el('p', 'ds-lay-lead', r.ok + ' controls on the scale; ' + (offs.length ? offs.reduce(function (a, k) { return a + r.off[k]; }, 0) + ' off it:' : 'none off it.')));
        if (offs.length) table(auditOut, ['Control', 'Count'], offs.sort().map(function (k) { return [k, String(r.off[k])]; }));
      });
    });
  }
  if (window.ResizeObserver) new ResizeObserver(function () { if (c11.offsetParent) runAudit(); }).observe(c11);

  // ---- 4 interaction
  var ia = section('l-interaction', 'Interaction & responsive', 'Pointer, Touch and Mobile are environments, not densities. platform/providers/theme-boot.js sets data-plx-interaction on <html> from the device and follows it live.', 'platform/system/interaction.css');
  var c12 = card(ia, 'Environments');
  table(c12, ['Environment', 'What it is', 'Targets', 'Rules'], [
    ['Pointer', 'Mouse or trackpad with keyboard', 'By density; 24px only for dense expert actions', 'Hover only enhances; visible focus; keyboard shortcuts; dense toolbars and tables where the task needs them'],
    ['Touch', 'Touch is expected: tablet, touch laptop, kiosk', '44px by default', 'More space between actions; no hover-only actions; larger handles; drawers and sheets for side regions'],
    ['Mobile', 'Touch on a phone-sized screen', '44px; 48px for prominent primary actions', '4 columns; collapsed navigation; filters in a drawer or screen; full-screen detail; prioritized data; single-task flows']]);
  var c13 = card(ia, 'Responsive operations', 'Reflow · collapse · overlay · prioritize · reveal · constrain · drill-in · re-architect. Every region hidden on a smaller screen stays reachable by a labeled, keyboard-operable control.');
  table(c13, ['Requirement', 'Rule'], [['Smallest target', '24 × 24px (WCAG 2.2, 2.5.8), or spaced so 24px circles do not overlap'], ['Touch and mobile', '44 × 44px by default'], ['Hover', 'Never the only way to find or use an action; a part shown on hover reads --plx-sys-hover-reveal-opacity and -visibility at rest, so it is shown on touch'], ['Focus', 'Always visible, never hidden by the target']]);

  // ---- page areas: the AppShell (the Layout grid's shell)
  var pa = section('l-areas', 'Page areas', 'Every application page is an AppShell, the Layout grid\'s shell (above): the header, the navigation pane on the left, the main region, the inspector panel on the right and the footer. The header and the footer always span the full width, above and below both side areas; the navigation and the inspector live between them, also when they open over the main region. The panes carry their own Collapse button; collapsed, each is a rail with Expand. Pages give only their content.');
  wire(card(pa, 'The areas'), 'areas', [
    ['A', 'Header', '--plx-sys-shell-header-height', '56px; spans the full width, above both panes'],
    ['B', 'Navigation pane', '--plx-sys-shell-nav-width', '240px, 272px or 320px by window width; resizable 140–320px'],
    ['C', 'Pane footer', '--plx-comp-pane-footer-height', 'Pinned to the bottom of the navigation pane', 'B', 'foot'],
    ['D', 'Main region', '', 'The content grid; it scrolls itself'],
    ['E', 'Inspector panel', '--plx-sys-panel-inspector-width', 'By density: 320 / 360 / 400px'],
    ['F', 'Pane footer', '--plx-comp-pane-footer-height', 'Pinned to the bottom of the inspector: its actions', 'E', 'foot'],
    ['G', 'Footer', '', 'Spans the full width, below both panes']]);
  var cA = card(pa, 'Navigation pane (left)');
  table(cA, ['Behavior', 'Rule'], [
    ['Width', '--plx-sys-shell-nav-width, by window width: 240px under 1440px; 272px at 1440–1919px (--plx-sys-shell-nav-width-from-1440); 320px at 1920px and wider (--plx-sys-shell-nav-width-from-1920). Drag the splitter on its edge from --plx-sys-shell-nav-min-width (140px) to --plx-sys-shell-nav-max-width (320px), one grid line (4px) at a time, and it stays on the grid when let go; it is never wider than --plx-sys-shell-pane-window-share (90%) of the window. The arrow keys move it --plx-sys-shell-splitter-step (16px), Home and End go to the limits.'],
    ['Remembered width', 'The width a person drags to is remembered per monitor: the monitor is named by its physical size (the screen size times the device pixel ratio, to the nearest 10px, so browser zoom does not change it), and a stored size within 10px counts as the same monitor. A remembered width that no longer fits the window is not used and is kept for when it fits again; without it the pane starts at its default.'],
    ['Collapse', 'The Collapse button in the pane\'s own header row (at its end; a pane may put it first), or Ctrl+[. Collapsed, the pane is a rail: the page\'s rail items (e.g. Home, Files, Categories, Collections), then Expand. Remembered.'],
    ['Below --plx-sys-shell-rail-below (840px, Medium)', 'A rail; Expand opens the expanded rail over the main region with a scrim. Escape or a click outside closes it.'],
    ['Below --plx-sys-shell-phone-below (600px, Narrow)', 'Never a drawer: the page\'s destinations in a bottom navigation bar (up to four and Browse), or a parent row; the pane is a screen of its own.'],
    ['Footer', 'Every navigation pane has a footer row pinned to its bottom, inside the pane and above the page footer: the application’s or section’s settings (System settings, Notes settings, Projects settings) or, on a settings screen, the way back (Back to Asset Manager, Back to Dashboard). Its height is --plx-comp-pane-footer-height: a toolbar control (size="sm") with 8px above and below; its divider is drawn inside.'],
    ['Screens that own their navigation', 'A screen whose navigation keeps its own state (Settings, the project list) places it in the navigation area with SideNavPortal; it then behaves exactly as above.']]);
  var cB = card(pa, 'Inspector panel (right)');
  table(cB, ['Behavior', 'Rule'], [
    ['Width', 'The SidePanel opens at --plx-comp-side-panel-width-default, by window width: 240px under 1440px (its own token, --plx-comp-side-panel-width-default); 320px at 1440–1919px; 400px at 1920px and wider. A resizable panel drags from 240px to 560px (--plx-comp-side-panel-width-min, -max), never wider than 90% of the window; its width is remembered per monitor, as the navigation pane\'s. The shell\'s own inspector region (.plx-shell-inspector) takes --plx-sys-panel-inspector-width, by density: 320 / 360 / 400px. Docked.'],
    ['Collapse', 'The Collapse button first in its header row ("Minimize panel" on the asset home); collapsed, a rail with Expand panel. Not every capability has an inspector.'],
    ['Footer', 'A footer row pinned to its bottom with the panel’s actions (the asset home: Save, Cancel), the same row as the navigation pane’s footer (--plx-comp-pane-footer-height).'],
    ['Below --plx-sys-shell-inspector-overlay-below (1024px)', 'Collapsed to its rail; Expand opens it over the main region with a scrim, between the header and the footer. Escape closes it.']]);
  pre(card(pa, 'Markup'), '<AppShell header={<AppHeader…/>} sideNav={<NavPane label="Sections" rail={<ToolRail.Item…/>}>…</NavPane>}\n  panel={<SidePanel title="Details" open={open} onOpenChange={setOpen}>…</SidePanel>}\n  footer={<StatusBar…/>}>\n  {main}\n</AppShell>\n\n<SideNavPortal><NavPane label="Settings">…</NavPane></SideNavPortal>   a screen hands its own navigation to the shell');

  // ---- navigation pane: one left pane everywhere (platform/patterns/NavPane)
  var np = section('l-navpane', 'Navigation pane', 'Every page that has a left navigation uses the one pane, NavPane, as the shell\'s navigation: the same surface, divider, width, full height between the header and the footer, inset, gap, scrolling and Collapse button on the asset home, both settings pages and every dashboard screen. Pages bring only their content: NavList groups (whose headings are collapsible section headers), a filter field, buttons, and the rail items shown while it is collapsed.');
  var c16 = card(np, 'What the pane owns');
  table(c16, ['Part', 'Value', 'Token'], [
    ['Surface', 'White', '--plx-comp-nav-pane-background → --plx-sys-surface-default'],
    ['Width', '240px under 1440px, 272px at 1440–1919px, 320px at 1920px and wider; resizable 140–320px, never wider than 90% of the window; remembered per monitor', '--plx-comp-nav-pane-width → --plx-sys-shell-nav-width'],
    ['Divider', '1px on the inline end; the splitter line shows on hover and focus', '--plx-sys-border-default, --plx-sys-focus-ring-color'],
    ['Height', 'The full height between the header and the footer, whatever the content\'s length', '—'],
    ['Slots', 'header (a row that stays put; it holds the Collapse button), body (scrolls), footer (a row pinned to the bottom: settings, or the way back; every page’s pane has one)', '--plx-comp-pane-footer-height'],
    ['Collapsed', 'A rail (ToolRail): the page\'s rail items, a divider, Expand', 'ToolRail'],
    ['Inset and gap', '8px inset, 12px between blocks', '--plx-sys-space-inset-sm, --plx-sys-space-stack-md'],
    ['Group headings', 'Accent uppercase, divider, end chevron; collapsible', 'CollapsibleSection (NavList groups)'],
    ['Scrolling', 'The body scrolls; the bar shows on hover', 'Scrolling, below']]);
  pre(card(np, 'Markup'), '<NavPane label="Projects" title="Projects" actions={<>Filter · New</>} rail={<ToolRail.Item…/>}>\n  <CollapsibleSection title="Collections" icon="briefcase">…</CollapsibleSection>\n  <NavList label="Settings sections" groups={[{ heading: \'Content\', items }]} />\n</NavPane>');

  // ---- scrolling: bars appear on hover (platform/system/scrolling.css)
  var sc = section('l-scrolling', 'Scrolling', 'Scroll areas keep their scrollbar out of sight until it is needed. The bar shows while the pointer is over the area, or while focus is inside it, so keyboard users still see where they are, and it fades when the pointer leaves. Its space stays reserved, so nothing shifts when it appears. One rule for every scroll area in every application: platform/system/scrolling.css, part of the Layout layer.');
  var c17 = card(sc, 'Rules');
  table(c17, ['Rule', 'Detail'], [
    ['Hidden at rest', 'The thumb and track are transparent until the area is hovered'],
    ['Shown on hover', 'Over the area (or anything inside it), the thumb takes --plx-sys-scrollbar-thumb (light: gray 300; dark: gray 600)'],
    ['Shown with focus', 'While focus is inside the area (:focus-within), for keyboard scrolling'],
    ['No layout shift', 'The track keeps its space; showing the thumb never moves content'],
    ['Thin', 'scrollbar-width: thin everywhere'],
    ['Touch', 'Phones and tablets show their own overlay bars while scrolling'],
    ['Do not', 'Hide a scrollbar for good (overflow without a bar), or style one area differently']]);
  var demo = card(sc, 'Try it', 'Hover the list: its bar appears; move away: it fades.');
  var box = DS.el('div', 'ds-scroll-demo'); box.tabIndex = 0; box.setAttribute('aria-label', 'Scrolling example');
  for (var i = 1; i <= 24; i++) box.appendChild(DS.el('div', 'ds-scroll-demo-row', 'Row ' + i));
  demo.appendChild(box);
  pre(card(sc, 'The stylesheet'), '*{scrollbar-color:transparent transparent;scrollbar-width:thin;}\n*:hover,*:focus-within{scrollbar-color:var(--plx-sys-scrollbar-thumb) transparent;}');
};
