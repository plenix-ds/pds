/* Plenix design system · library part w01C (wave 1, lane C): foundations of color, grid and accessibility. Data
   visualization colors (utils/dataviz.ts, system/dataviz.css), contrast rules (utils/contrast.ts, tests/contrast.test.js),
   the layout grid (system/layout-grid.css, dev/grid-overlay.js), keylines (system/keylines.css, dev/keylines.js), scroll
   lock (utils/scrollLock.ts, system/scroll-lock.css), accessible descriptions (utils/describedBy.ts) and use of color
   (check-system.rules/use-of-color.js). Color contrast (interaction) and Scroll lock (interaction) are thin records of
   their main pages. Every example is drawn with Platform components and the foundations' own classes. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, m = H.m, A = H.A, C = H.C, M = H.M, F = H.F;
  var SP = ['Spectrum'], PO = ['Polaris'];
  var stack = function () { return h.apply(null, [P.Stack, { gap: 'sm' }].concat([].slice.call(arguments))); };
  var caption = function (t) { return h(P.Text, { variant: 'secondary' }, t); };
  var range = function (n) { var out = []; for (var i = 1; i <= n; i++) out.push(i); return out; };

  /* ── data visualization colors ── */
  // one swatch of a scale step: the step is the element's data color (data-plx-dataviz, system/dataviz.css)
  var swatch = function (name, text) { return h(P.Stack, { key: name, gap: 'xs', align: 'center' }, h('span', { className: 'ds-dataviz-swatch', 'data-plx-dataviz': name, 'aria-hidden': true }), caption(text)); };
  var scale = function (names, texts) { return row.apply(null, names.map(function (n, i) { return swatch(n, texts ? texts[i] : String(i + 1)); })); };
  var CAT = ['Blue', 'Green', 'Purple', 'Red', 'Brown', 'Gray'];
  var dataviz = { id: 'dataviz-colors', icon: 'chart', sec: 'foundations', sub: 'Color', leaf: 'Data visualization colors', title: 'Data visualization colors',
    plenix: 'datavizCategory, datavizStep, datavizToken, DATAVIZ_SCALES, DATAVIZ_STATUS, DATAVIZ_ALERT', src: 'utils/dataviz.ts', css: ['system/dataviz.css'], level: 'Foundation', interaction: 'Static',
    text: 'The colors charts use, kept apart from the interface’s status colors: six categorical hues for unrelated series, a sequential scale of one hue for ordered values, a diverging scale around a neutral midpoint, and status and alert colors for data that is a status or a threshold. Every step is a token (--plx-sys-dataviz-*) from existing roles and palette shades; data-plx-dataviz="<scale>-<step>" makes a step an element’s data color.',
    aliases: ['Chart colors', 'Data colors', 'Categorical palette', 'Sequential palette', 'Diverging palette'],
    use: ['Categorical colors for unrelated series, in their order (datavizCategory(index)), so a series keeps its color in every view', 'The sequential scale for ordered values (counts, amounts, density): datavizStep(\'sequential\', value, min, max)', 'The diverging scale for values above and below a meaningful midpoint (change, difference from target)', 'Status colors only where the data is a status; alert colors for thresholds', 'Direct labels, markers or patterns next to color (Use of color)'],
    avoid: ['The interface’s danger or success colors for ordinary series', 'More than six categorical colors in one chart: group the small series or filter', 'Assigning colors by rank: a series changes color when the data changes', 'A color written in a chart’s stylesheet: use var(--plx-comp-data-color) with data-plx-dataviz'],
    related: ['color', 'contrast-rules', 'use-of-color', 'color-picker'],
    map: [m(C, 'Data visualization color palettes'), m(SP, 'Color for data visualization'), m(A, 'Chart colors (data visualization tokens)', 'Partial'), m(PO, 'Data visualization colors', 'Partial')],
    examples: [
      ['Scales', [
        ['Categorical (DATA_COLORS)', function () { return scale(range(6).map(function (i) { return 'categorical-' + i; }), CAT); }],
        ['Sequential (one hue, 7 steps)', function () { return scale(range(7).map(function (i) { return 'sequential-' + i; })); }],
        ['Diverging', function () { return scale(range(7).map(function (i) { return 'diverging-' + i; }), ['−3', '−2', '−1', '0', '+1', '+2', '+3']); }],
        ['Status for charts', function () { return scale(['status-positive', 'status-caution', 'status-negative', 'status-informative', 'status-neutral'], ['Positive', 'Caution', 'Negative', 'Informative', 'Neutral']); }],
        ['Alert / threshold', function () { return scale(['alert-warning', 'alert-critical'], ['Warning', 'Critical']); }]]],
      ['Values to steps: datavizStep(\'sequential\', value, 0, 100)', function () {
        return scale([0, 15, 30, 50, 65, 80, 100].map(function (v) { return P.datavizStep('sequential', v, 0, 100); }), ['0', '15', '30', '50', '65', '80', '100']);
      }]] };

  /* ── contrast ── */
  // the pairs as this page draws them now (the page's theme and mode), from CONTRAST_PAIRS and the computed tokens
  function PairsTable() {
    var cs = getComputedStyle(document.documentElement);
    var read = function (role) { return cs.getPropertyValue('--plx-sys-' + role).trim(); };
    var data = P.CONTRAST_PAIRS.map(function (p, i) {
      var r = P.contrastRatio(read(p.fg), read(p.bg));
      return { id: i + 1, use: p.use, pair: p.fg + ' on ' + p.bg, rule: p.rule + ' (' + P.CONTRAST_MINIMUMS[p.rule] + ':1)', ratio: isNaN(r) ? '—' : r.toFixed(2) + ':1', ok: !isNaN(r) && P.meetsContrast(r, p.rule) };
    });
    return h(P.Table, { label: 'Theme pairs in this mode', data: data, columns: [
      { title: 'Use', field: 'use', kind: 'name', rowLabel: true, width: '--plx-ref-size-240px' },
      { title: 'Roles (--plx-sys-)', field: 'pair', kind: 'data' },
      { title: 'Rule', field: 'rule', kind: 'data', width: '--plx-ref-size-140px' },
      { title: 'Ratio', field: 'ratio', kind: 'data', width: '--plx-ref-size-100px' },
      { title: 'Result', field: 'ok', width: '--plx-ref-size-120px', render: function (row) { return h(P.Badge, { tone: row.ok ? 'success' : 'danger', variant: 'soft' }, row.ok ? 'Meets' : 'Below'); } }] });
  }
  var RULES = [
    { id: 1, rule: 'AA normal text', min: '4.5:1', applies: 'Text under 24px (under 18.66px bold): body, labels, placeholders, table cells', wcag: '1.4.3', key: 'text' },
    { id: 2, rule: 'AA large text', min: '3:1', applies: 'Text of 24px and larger, or 18.66px bold and larger: page titles, display figures', wcag: '1.4.3', key: 'large-text' },
    { id: 3, rule: 'AAA (enhanced)', min: '7:1', applies: 'Dense small text where it can be reached: data grids, code, long reading', wcag: '1.4.6', key: 'enhanced' },
    { id: 4, rule: 'Non-text 3:1', min: '3:1', applies: 'Icons that carry meaning, control edges, focus indicators, chart marks, status dots', wcag: '1.4.11', key: 'non-text' }];
  var rulesTable = function () { return h(P.Table, { label: 'Contrast rules', data: RULES, columns: [
    { title: 'Rule', field: 'rule', kind: 'name', rowLabel: true, width: '--plx-ref-size-160px' }, { title: 'Minimum', field: 'min', kind: 'data', width: '--plx-ref-size-100px' },
    { title: 'Applies to', field: 'applies', kind: 'wrap' }, { title: 'WCAG 2.2', field: 'wcag', kind: 'data', width: '--plx-ref-size-100px' }] }); };
  var contrast = { id: 'contrast-rules', icon: 'visibility', sec: 'foundations', sub: 'Color', leaf: 'Contrast rules', title: 'Contrast rules',
    plenix: 'contrastRatio, meetsContrast, relativeLuminance, parseColor, CONTRAST_MINIMUMS, CONTRAST_PAIRS', src: 'utils/contrast.ts', css: [], level: 'Foundation', interaction: 'Static',
    covers: ['interaction/Color contrast'],
    text: 'The minimum contrast between what is read or seen and what is behind it: 4.5:1 for normal text, 3:1 for large text and for icons, control edges, focus indicators and chart marks (WCAG 2.2 AA), 7:1 where dense small text can reach it. The theme’s role pairs that must meet them are CONTRAST_PAIRS; tests/contrast.test.js checks each in every theme and mode, and the table below measures them live in this page’s mode.',
    aliases: ['Color contrast', 'Contrast ratio', 'WCAG contrast', 'Accessible colors'],
    use: ['contrastRatio(fg, bg) and meetsContrast(ratio, rule) when a pair is chosen or a theme is changed', 'A new foreground and background role pair: add it to CONTRAST_PAIRS so the test keeps it', 'Size, weight or position for secondary content, never lower contrast', 'Text over images: a scrim or surface under the text that meets the rule at the worst point'],
    avoid: ['Loosening a rule or calling small text large to pass', 'Fixing a pair with a new color: point the role at another palette color in that theme and mode', 'Placeholder or helper text below text contrast: people must read it', 'Checking only the light mode or only the rest state'],
    related: ['color', 'use-of-color', 'themes', 'dataviz-colors'],
    map: [m(C, 'Color accessibility'), m(M, 'Color contrast'), m(F, 'Color accessibility'), m(SP, 'Color system contrast'), m(A, 'Accessible colors'), m(PO, 'Color accessibility', 'Partial')],
    examples: [
      ['The rules: AA normal text, AA large text, AAA, non-text', function () { return box(null, rulesTable()); }],
      ['Per theme pairs, measured in this mode (switch the mode to see the other)', function () { return box(null, h(PairsTable)); }],
      ['contrastRatio in code', function () {
        var cs = getComputedStyle(document.documentElement), role = function (n) { return cs.getPropertyValue('--plx-sys-' + n).trim(); };
        var r = P.contrastRatio(role('content-muted'), role('surface-default'));
        return stack(h(P.Text, { as: 'p' }, 'contrastRatio(role("content-muted"), role("surface-default")) = ', h(P.Text, { variant: 'data' }, r.toFixed(2) + ':1')),
          h(P.Text, { as: 'p' }, 'meetsContrast(' + r.toFixed(2) + ', "text") = ', h(P.Text, { variant: 'data' }, String(P.meetsContrast(r, 'text')))));
      }]] };
  var colorContrast = { id: 'interaction-color-contrast', icon: 'visibility', sec: 'interaction', sub: 'Accessibility', leaf: 'Color contrast', title: 'Color contrast',
    plenix: contrast.plenix, src: contrast.src, css: [], level: 'Foundation', interaction: 'Static', variantClasses: [], docsFrom: 'contrast-rules',
    text: 'Every text, icon, control edge and focus indicator meets the Contrast rules (4.5:1 for text, 3:1 for large text and non-text) in every theme and mode. The rules, the role pairs and the test are on the Contrast rules page.',
    aliases: ['Contrast ratio', 'WCAG 1.4.3', 'WCAG 1.4.11'],
    use: ['Checking a component’s colors in light and dark, at rest and in every state', 'Reviewing a theme change: node tests/contrast.test.js'],
    avoid: ['A component color that is not a theme role (its contrast is then unchecked)', 'Disabled styling on content that still carries meaning'],
    related: ['contrast-rules', 'use-of-color', 'color'],
    examples: [['The theme pairs, measured in this mode', function () { return box(null, h(PairsTable)); }]] };

  /* ── layout grid ── */
  var COLS = range(12).map(function (i) { return h('div', { key: i, className: 'plx-layout-grid__column' }); });
  var gridDemo = function (mods) { return box(null, h('div', { className: 'plx-layout-grid__overlay ds-grid-demo', 'aria-hidden': true }, h('div', { className: 'plx-layout-grid plx-layout-grid--overlay ' + mods }, COLS))); };
  // the Grid page (inventory.js) draws the layout grid with this part's helpers
  H.addExamples('grid', [
      ['Window class', [
        ['4 columns (Narrow)', function () { return gridDemo('plx-layout-grid--narrow'); }],
        ['8 columns (Medium)', function () { return gridDemo('plx-layout-grid--medium'); }],
        ['12 columns (Wide)', function () { return gridDemo('plx-layout-grid--wide'); }]]],
      ['Width', [
        ['Fluid', function () { return stack(gridDemo('plx-layout-grid--wide'), caption('The full width of its container, whatever the window.')); }],
        ['Contained', function () { return stack(gridDemo('plx-layout-grid--wide plx-layout-grid--contained'), caption('Stops at --plx-sys-layout-grid-contained-max (1200px) and centers in wider windows.')); }]]],
      ['Grid overlay (dev)', function () {
        return stack(h(P.Text, { as: 'p' }, 'Load platform/dev/grid-overlay.js on a page and open it with ', h(P.Text, { variant: 'data' }, '?grid'), ' (or ', h(P.Text, { variant: 'data' }, '?grid=contained'), '): the window class’s columns are drawn over everything, translucent, and never take a click. Ctrl+Shift+G turns them on and off.'),
          h(P.CodeBlock, null, '<script src="../platform/dev/grid-overlay.js"></script>\nPlenixGridOverlay.show(\'contained\'); PlenixGridOverlay.hide();'));
      }],
      ['Tags that wrap in a narrow box', function () { return box(240, h(P.Inline, { wrap: true, gap: 'xs' }, ['Crosses', 'Borders', 'Banner icons', 'Bookshelf', 'Certificates'].map(function (t) { return h(P.Tag, { key: t }, t); }))); }],
      ['A grid that becomes a list at its own width', (function () { var g = H.record('data-grid').examples.filter(function (e) { return Array.isArray(e[1]) && e[0].indexOf('Narrow') === 0; })[0]; return g[1].filter(function (v) { return v[0].indexOf('Narrow') === 0; })[0][1]; })()]]);

  /* ── keylines ── */
  var keyline = function (shape, icon) { return h('div', { className: 'plx-keylines', 'aria-hidden': true }, h('span', { className: 'plx-keylines__shape plx-keylines__shape--live' }), h('span', { className: 'plx-keylines__shape plx-keylines__shape--' + shape }), icon ? h(P.Icon, { name: icon }) : null); };
  var keylines = { id: 'keylines', icon: 'ed-crop', sec: 'foundations', sub: 'Grid', leaf: 'Keylines', title: 'Keylines',
    plenix: '.plx-keylines, .plx-keylines-content', css: ['system/keylines.css'], also: ['dev/keylines.js'], level: 'Foundation', interaction: 'Static',
    text: 'The lines icons and content align to. Icon keylines: the icon files are drawn on a 24-unit square with 2 units of padding; a round shape fills the 20-unit live area, a square shape is 18 units so it looks as large, and tall and wide shapes are 16 by 20. Content keylines: every row’s content in a view starts at the inset, and its text starts after the leading icon and the gap, so icons and text each line up in one straight line. ?keylines on a page that loads platform/dev/keylines.js outlines every icon square.',
    aliases: ['Icon grid', 'Icon keyline shapes', 'Alignment lines', 'Content start'],
    use: ['Checking an icon against the set’s keyline shapes before it is mapped (the set is never edited: a concept that does not fit is listed for a decision)', 'Rows of a view with the same inset, icon size and gap, so icons and text start on shared lines', 'The keylines overlay (?keylines, Ctrl+Shift+K) to see where icons sit on a page'],
    avoid: ['1px or 2px nudges to make something line up: fix the inset, the icon role or the gap', 'Keylines drawn in the product: they are a design and review tool', 'Indenting text with spaces to fake a keyline'],
    related: ['icon', 'grid', 'spacing', 'control-heights'],
    map: [m(M, 'Keylines (icon and layout)'), m(C, 'Icon grid and keylines'), m(F, 'Icon keylines', 'Partial')],
    examples: [
      ['Icon keylines', [
        ['Square (18 units)', function () { return keyline('square', 'square-plus'); }],
        ['Circle (20 units)', function () { return keyline('circle', 'circle-check'); }],
        ['Portrait (16 by 20)', function () { return keyline('portrait', 'doc-text'); }],
        ['Landscape (20 by 16)', function () { return keyline('landscape', 'mail'); }]]],
      ['Content keylines', function () {
        var line = function (icon, t) { return h(P.Inline, { key: t, gap: 'sm' }, h(P.Icon, { name: icon, size: 'md' }), h(P.Text, null, t)); };
        return box(320, h(P.Stack, { inset: 'md', gap: 'sm', className: 'plx-keylines-content' }, line('folder', 'Liturgical'), line('image-b', 'Crosses'), line('doc-text', 'Certificates')));
      }]] };

  /* ── scroll lock ── */
  function ScrollLockDemo() {
    var ref = React.useRef(null), on = H.use(false);
    P.useScrollLock(on[0], ref);
    return h(P.Stack, { gap: 'sm' },
      h(P.Inline, { gap: 'sm' }, h(P.Button, { size: 'sm', pressed: on[0], onClick: function () { on[1](!on[0]); } }, on[0] ? 'Release the lock' : 'Lock this list'),
        h(P.Text, { variant: 'secondary', 'aria-live': 'polite' }, on[0] ? 'Locked: the list does not scroll; its scrollbar space stays.' : 'Scrolls as usual.')),
      // the scroll container itself takes the ref (Stack does not forward one): Stack's own classes on a div
      h('div', { className: 'plx-stack plx-stack--gap-sm plx-layout--scroll plx-layout--max-sm', ref: ref, tabIndex: 0, role: 'group', 'aria-label': 'Folders' },
        H.FOPTS(['Crosses', 'Borders', 'Banner icons', 'Bookshelf', 'Certificates', 'Icons', 'Seals', 'Initials', 'Frames', 'Ornaments', 'Patterns', 'Maps']).map(function (o) { return h(P.Text, { key: o.value, as: 'p' }, o.label); })));
  }
  var scrollLock = { id: 'scroll-lock', icon: 'lock', sec: 'overlays', sub: 'Layer behavior', leaf: 'Scroll lock', title: 'Scroll lock',
    plenix: 'useScrollLock, lockScroll, isScrollLocked, scrollLockCount', src: 'utils/scrollLock.ts', css: ['system/scroll-lock.css'], level: 'Utility', interaction: 'Utility',
    covers: ['interaction/Scroll lock'],
    text: 'While a modal layer is open, the page behind it does not scroll. useScrollLock(active, ref) locks the page, or one scroll container, while it is active; lockScroll(target) does the same outside React and returns the release. The scroll position is never touched, so the page stays where it was.',
    aliases: ['Prevent scroll', 'Body scroll lock', 'Background scroll lock'],
    use: ['Modal layers: a dialog, a modal drawer or sheet, a full-screen overlay', 'One locked scroll container when only a region is covered'],
    avoid: ['Menus, popovers, tooltips and toasts: the page stays scrollable behind them', 'Locking the modal’s own content: it scrolls as usual', 'Setting overflow on the page by hand: two overlays then release each other’s lock'],
    related: ['overlay-manager', 'dialog', 'side-drawer'],
    map: [m(SP, 'usePreventScroll (React Aria)'), m(A, 'Modal dialog (scroll behavior)', 'Partial'), m(F, 'Dialog (scroll behavior)', 'Partial')],
    examples: [
      ['Element lock', function () { return box(400, h(ScrollLockDemo)); }],
      ['Page lock and nested locks (counted)', function () {
        return h(P.CodeBlock, null, 'useScrollLock(open);              // the page (html), while open\nconst a = lockScroll(); const b = lockScroll();\nb(); isScrollLocked();   // true: a still holds it\na(); isScrollLocked();   // false: the last lock is released');
      }]] };
  var scrollLockUtil = { id: 'interaction-scroll-lock', icon: 'lock', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Scroll lock', title: 'Scroll lock (utility)',
    plenix: scrollLock.plenix, src: scrollLock.src, css: scrollLock.css, level: 'Utility', interaction: 'Utility', variantClasses: [], docsFrom: 'scroll-lock',
    text: 'The scroll lock utility: useScrollLock(active, ref) and lockScroll(target). Locks are counted per target and keep the scrollbar’s space. Where and why overlays use it is on the Scroll lock page (Overlays › Layer behavior).',
    aliases: ['usePreventScroll', 'lockScroll'],
    use: ['A new modal surface: useScrollLock(open)', 'Code outside React that covers the page: lockScroll() and its release'],
    avoid: ['Toggling overflow on html or body by hand'],
    related: ['scroll-lock', 'overlay-manager'],
    examples: [['Element lock', function () { return box(400, h(ScrollLockDemo)); }]] };

  /* ── accessible descriptions ── */
  function DescribedDemo() {
    var hint = P.useDescriptionId('hint'), err = P.useDescriptionId('error');
    var v = H.use('cross 14'), bad = /\s/.test(v[0]);
    return h(P.Stack, { gap: 'xs' },
      h(P.Text, { as: 'label', variant: 'label', htmlFor: hint + 'in' }, 'File name'),
      h(P.Input, { id: hint + 'in', value: v[0], onChange: function (e) { v[1](e.target.value); }, invalid: bad, 'aria-describedby': P.useDescribedBy(hint, bad && err) }),
      h(P.Text, { id: hint, variant: 'secondary' }, 'Letters, numbers and dashes'),
      bad ? h(P.Text, { id: err, variant: 'danger' }, 'Remove the spaces') : null);
  }
  var described = { id: 'accessible-descriptions', icon: 'text-card', sec: 'interaction', sub: 'Accessibility', leaf: 'Accessible descriptions', title: 'Accessible descriptions',
    plenix: 'useDescribedBy, useDescriptionId, joinIds', src: 'utils/describedBy.ts', css: [], level: 'Utility', interaction: 'Utility',
    text: 'A description is text tied to an element by aria-describedby and read after its name and role: the hint under a field, its error, the body of a dialog. Three helpers build it: joinIds merges description ids (the owner’s first, then the component’s own, without empty or repeated ids), useDescriptionId gives a component a stable id, and useDescribedBy builds the attribute from what is shown now. Field and Tooltip connect theirs this way.',
    aliases: ['aria-describedby', 'Helper text', 'Hint text', 'Description'],
    use: ['A field’s hint and error, connected to the control', 'A dialog’s body text, connected to the dialog', 'A hidden description only for what sighted people read from the layout (VisuallyHidden with the id)'],
    avoid: ['Repeating the name in the description', 'Essential instructions only in a description or a tooltip: show them', 'Replacing the ids an element already has: join them'],
    related: ['field', 'tooltip', 'visually-hidden'],
    map: [m(C, 'Helper text', 'Partial'), m(A, 'Helper message', 'Partial'), m(M, 'Supporting text', 'Partial'), m(PO, 'Help text', 'Partial'), m(SP, 'Help text', 'Partial')],
    examples: [
      ['aria-describedby joined', function () { return box(320, h(DescribedDemo)); }],
      ['Description id helper', function () { return h(P.CodeBlock, null, 'joinIds(props[\'aria-describedby\'], hintId, error && errorId)\n// "owner-id plx-hint1 plx-error2"; undefined when there is none'); }],
      ['Hidden description', function () {
        return box(320, h(P.Stack, { gap: 'xs' }, h(P.Button, { size: 'sm', 'aria-describedby': 'ds-w01c-hidden-desc' }, 'Publish'),
          h(P.VisuallyHidden, { id: 'ds-w01c-hidden-desc' }, 'Publishes to the public library; everyone with the link can see it.'), caption('The button’s description is read by screen readers only.')));
      }]] };

  /* ── use of color ── */
  var useOfColor = { id: 'use-of-color', icon: 'info-circle', sec: 'interaction', sub: 'Accessibility', leaf: 'Use of color', title: 'Use of color',
    plenix: 'check-system rule use-of-color', src: '../check-system.rules/use-of-color.js', css: [], level: 'Foundation', interaction: 'Static',
    text: 'Color never carries meaning alone: a state, an error, a link, a selected item or a chart series also has words, an icon, a shape or an underline. The system check’s rule use-of-color (check-system.rules/use-of-color.js) rejects a status dot in a tone without words (its label, or text right beside it).',
    aliases: ['Color alone', 'WCAG 1.4.1', 'Redundant cues'],
    use: ['A status in a tone with its words: a badge’s text, a dot’s label or the text beside it, an icon with the message', 'Links in running text set apart by more than color (weight or underline)', 'Charts with direct labels, markers or patterns as well as color', 'Errors with a message and an icon, not only a red border'],
    avoid: ['Instructions that depend on color (“the green button”)', 'A status dot or a colored row with no words', 'A legend that is the only key to a chart’s colors'],
    related: ['contrast-rules', 'dataviz-colors', 'status-dot', 'badge'],
    map: [m(C, 'Color (accessibility)', 'Partial'), m(A, 'Color', 'Partial'), m(M, 'Color and accessibility', 'Partial'), m(PO, 'Color', 'Partial'), m(SP, 'Color for accessibility', 'Partial')],
    examples: [
      ['Redundant cues', [
        ['Status with icon and text', function () {
          return h(P.Stack, { gap: 'sm' }, row(h(P.Badge, { tone: 'success' }, 'Paid'), h(P.Badge, { tone: 'danger' }, 'Overdue')),
            h(P.List, { items: [{ icon: 'circle-check', tone: 'success', children: 'Uploaded' }, { icon: 'warning', tone: 'danger', children: 'Upload failed: the file is over 50 MB' }] }));
        }],
        ['Links underlined in text', function () { return h(P.Text, { as: 'p' }, 'Read the ', h(P.Link, { href: '#' }, 'licensing terms'), ' before you publish.'); }],
        ['Charts with patterns and labels', function () {
          return row.apply(null, ['Sales', 'Returns', 'Refunds'].map(function (s, i) { return h(P.Inline, { key: s, gap: 'xs' }, h('span', { className: 'ds-dataviz-swatch', 'data-plx-dataviz': P.datavizCategory(i), 'aria-hidden': true }), h(P.Text, null, s)); }));
        }]]]] };

  return [dataviz, contrast, keylines, scrollLock, described, colorContrast, useOfColor, scrollLockUtil];
});
