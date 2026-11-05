/* Plenix design system · library part w00C: the color groups (owner, 2026-10-13). Every color role (--plx-sys-* of type
   color) belongs to exactly one group, written on the role in the token source ($extensions.plenix.group, check-style
   rule color-groups) and copied into tokens.index.json with its purpose. Each group under 01 Foundations › Color has its
   own page here: what the group is for, then every role in it with its light and dark swatch, the palette color it points
   to, its purpose and its contrast pairs (CONTRAST_PAIRS, measured in both modes), read live from tokens.index.json. The
   Neutral colors page adds the gray ramp and the roles each shade serves. The palette itself is the Color palette page
   (inventory.js, record color); Data visualization colors, Dark mode and Contrast rules have their own pages. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, m = H.m, A = H.A, C = H.C, M = H.M, F = H.F;
  var SP = ['Spectrum'], PO = ['Polaris'];

  /* ── the token index (tokens/tokens.index.json, build-tokens.js), loaded once ── */
  var INDEX = null, LOADING = null;
  var loadIndex = function () {
    if (!LOADING) LOADING = window.DSRender.text('tokens/tokens.index.json').then(function (t) { var by = {}; JSON.parse(t).tokens.forEach(function (x) { by[x.name] = x; }); INDEX = by; return by; });
    return LOADING;
  };
  var useIndex = function () {
    var s = React.useState(INDEX);
    React.useEffect(function () { var live = true; if (!s[0]) loadIndex().then(function (by) { if (live) s[1](by); }); return function () { live = false; }; }, []);
    return s[0];
  };
  var ROLE = '--plx-sys-';
  var short = function (name) { return name.replace(ROLE, ''); };
  // a role's value in a mode, followed to the palette: { palette: 'blue-400', hex, via: ['feedback-info-solid'] }
  var inMode = function (idx, name, mode, via) {
    via = via || [];
    var t = idx[name]; if (!t) return { palette: '—', hex: '', via: via };
    var s = t.sets.filter(function (x) { return x.selector.indexOf('data-plx-mode="' + mode + '"') >= 0; })[0] || t.sets.filter(function (x) { return x.selector.indexOf('data-plx-mode') < 0; })[0];
    var r = (/^var\(--plx-(ref|sys)-([a-z0-9-]+)\)$/.exec(s ? s.value : '') || []);
    if (r[1] === 'sys' && via.length < 8) return inMode(idx, ROLE + r[2], mode, via.concat([r[2]]));
    var res = idx[name].resolved || {}, hex = res.all != null ? res.all : (res[mode + '/standard'] || '');
    return { palette: r[1] === 'ref' ? r[2].replace(/^color-/, '') : (s ? s.value : '—'), hex: hex, via: via };
  };
  var swatch = function (hex) { return h('span', { 'aria-hidden': 'true', className: 'ds-vis ds-vis--color ' + DS.sampleClass('background-color', hex || 'transparent') }); };
  var data = function (t) { return h(P.Text, { variant: 'data' }, t); };
  // a mode's line of the swatch cell: the mode, the swatch, the palette color and its value, and the role it goes through
  var modeLine = function (label, x) {
    return h(P.Inline, { gap: 'xs' }, h(P.Text, null, label), swatch(x.hex), data(x.palette + ' ' + x.hex + (x.via.length ? ' (via ' + x.via.join(' → ') + ')' : '')));
  };
  var modeCell = function (r) { return h(P.Stack, { gap: 'xs' }, modeLine('Light', r.light), modeLine('Dark', r.dark)); };
  var ratio = function (a, b) { var r = P.contrastRatio(a, b); return isNaN(r) ? '—' : r.toFixed(2) + ':1'; };
  // the contrast pairs a role is part of (CONTRAST_PAIRS, utils/contrast.ts), measured in light and dark
  var pairsOf = function (idx, role) {
    return (P.CONTRAST_PAIRS || []).filter(function (p) { return p.fg === role || p.bg === role; }).map(function (p) {
      var fgL = inMode(idx, ROLE + p.fg, 'light').hex, bgL = inMode(idx, ROLE + p.bg, 'light').hex, fgD = inMode(idx, ROLE + p.fg, 'dark').hex, bgD = inMode(idx, ROLE + p.bg, 'dark').hex;
      return (p.fg === role ? 'on ' + p.bg : p.fg + ' on it') + ' · ' + p.rule + ' · ' + ratio(fgL, bgL) + ' / ' + ratio(fgD, bgD);
    });
  };
  var roleCell = function (r) { return h(P.Stack, { gap: 'xs' }, data(r.role), h(P.Text, { variant: 'secondary' }, r.purpose)); };
  var pairsCell = function (r) { return r.pairs.length ? h(P.Stack, { gap: 'xs' }, r.pairs.map(function (t) { return h(P.Text, { key: t, variant: 'data' }, t); })) : data('—'); };
  var rolesOf = function (idx, group) {
    return Object.keys(idx).filter(function (n) { var t = idx[n]; return t.tier === 'plx-sys' && t.type === 'color' && t.group === group; }).map(function (n) { return idx[n]; });
  };

  // every role of a group: its light and dark swatch, the palette color it points to, its purpose, its contrast pairs
  function RolesTable(p) {
    var idx = useIndex();
    if (!idx) return h(P.Text, { variant: 'secondary' }, 'Loading the roles…');
    var rows = rolesOf(idx, p.group).map(function (t, i) {
      var role = short(t.name);
      return { id: i + 1, role: role, light: inMode(idx, t.name, 'light'), dark: inMode(idx, t.name, 'dark'), purpose: t.purpose || t.description || '', pairs: pairsOf(idx, role) };
    });
    return h(P.Table, { label: p.label, data: rows, columns: [
      { title: 'Role (--plx-sys-) and purpose', field: 'role', kind: 'wrap', rowLabel: true, render: roleCell },
      { title: 'Light and dark (palette color)', field: 'light', kind: 'wrap', width: '--plx-ref-size-320px', render: modeCell },
      { title: 'Contrast pairs (light / dark)', field: 'pairs', kind: 'wrap', width: '--plx-ref-size-280px', render: pairsCell }] });
  }

  // the gray ramp (the palette's Gray family, black and white included) and the roles each shade serves in light and dark
  function GrayRamp() {
    var idx = useIndex();
    if (!idx) return h(P.Text, { variant: 'secondary' }, 'Loading the ramp…');
    var shades = Object.keys(idx).filter(function (n) { return /^--plx-ref-color-(gray-\d+|black|white)$/.test(n); });
    shades.sort(function (a, b) { var v = function (n) { return /white/.test(n) ? -1 : /black$/.test(n) ? 9999 : +n.replace(/\D/g, ''); }; return v(a) - v(b); });
    var roles = Object.keys(idx).filter(function (n) { return idx[n].tier === 'plx-sys' && idx[n].type === 'color'; });
    var users = function (shade, mode) { return roles.filter(function (n) { var x = inMode(idx, n, mode); return x.palette === shade && !x.via.length; }).length; };
    var rows = shades.map(function (n, i) {
      var shade = n.replace('--plx-ref-color-', ''), t = idx[n], hex = (t.resolved && t.resolved.all) || '';
      return { id: i + 1, shade: shade, hex: hex, light: users(shade, 'light'), dark: users(shade, 'dark') };
    });
    return h(P.Table, { label: 'The gray ramp', data: rows, columns: [
      { title: 'Shade (--plx-ref-color-)', field: 'shade', kind: ['name', 'data'], rowLabel: true, width: '--plx-ref-size-240px', render: function (r) { return h(P.Inline, { gap: 'xs' }, swatch(r.hex), data(r.shade)); } },
      { title: 'Value', field: 'hex', kind: 'data', width: '--plx-ref-size-140px' },
      { title: 'Roles in light', field: 'light', kind: 'data', width: '--plx-ref-size-140px' },
      { title: 'Roles in dark', field: 'dark', kind: 'data', width: '--plx-ref-size-140px' }] });
  }

  var roles = function (group, title) { return [title || 'Every role, light and dark', function () { return box(null, h(RolesTable, { group: group, label: (title || 'Roles') })); }]; };
  var COLOR_REL = ['color', 'contrast-rules', 'themes', 'use-of-color'];
  var base = function (id, leaf, icon, group, o) {
    return Object.assign({ id: id, icon: icon, sec: 'foundations', sub: 'Color', leaf: leaf, title: leaf, level: 'Foundation', interaction: 'Static',
      css: ['system/themes/default.css'], examples: [roles(group)] }, o);
  };

  return [
    base('color-neutral', 'Neutral colors', 'image-a-2', 'neutral', {
      text: 'The gray ramp and the neutral roles drawn from it. The Neutral group holds the neutral fill’s roles; the table of the ramp shows how many roles each shade serves in light and dark mode.',
      aliases: ['Grays', 'Gray ramp', 'Neutral palette'],
      use: ['The neutral fill (--plx-sys-fill-neutral-*) for secondary buttons, chips and tags', 'The gray ramp through roles only: a surface, text or border role names its gray', 'The next shade in the ramp when a role needs more contrast in one mode'],
      avoid: ['A gray from the palette in a stylesheet (--plx-ref-color-gray-*): use the role', 'Gray text below the text rule to make it quieter: use size, weight or position'],
      related: COLOR_REL.concat(['color-surface', 'color-text', 'color-border']),
      map: [m(F, 'Neutral colors'), m(M, 'Neutral and neutral variant palettes', 'Partial'), m(C, 'Gray palette', 'Partial'), m(A, 'Neutral colors', 'Partial')],
      examples: [roles('neutral', 'The neutral fill, light and dark'), ['The gray ramp and the roles each shade serves', function () { return box(null, h(GrayRamp)); }]] }),
    base('color-brand', 'Brand colors', 'app-switcher', 'brand', {
      text: 'The Plenix brand blue and the color on it. The brand role (--plx-sys-brand-primary) is blue-400 in light and dark mode. The logo, the brand mark, the product tiles and, in light mode, the accent header band read it. Text and icons on it use brand-on-primary.',
      aliases: ['Brand color', 'Primary brand color', 'Key color'],
      use: ['The brand mark, the logo and product tiles (BrandMark’s tokens read the brand roles)', 'Where a surface shows the brand, point its role at brand-primary (the accent surface does in light mode)', 'brand-on-primary for text and icons on the brand blue'],
      avoid: ['The brand blue for actions: the primary button is action-primary-background (an Interactive role), even when it has the same value', 'The brand blue for information: that is the Semantic info role', 'A second brand color: the brand is one blue'],
      related: COLOR_REL.concat(['brand-mark', 'color-accent']),
      map: [m(F, 'Brand colors'), m(M, 'Primary key color', 'Partial'), m(A, 'Brand colors', 'Partial'), m(C, 'IBM Design Language color', 'Partial')] }),
    base('color-accent', 'Accent colors', 'image-a-2', 'accent', {
      text: 'The accent tones of the application header and of what sits on it: the accent surface (the brand blue band in light mode, black in dark mode), its raised surface, edges, fields, text and states. The frost tone is the light version of the header.',
      aliases: ['Accent', 'Header colors', 'Frost'],
      use: ['The accent roles for the application header and the elements placed on it (search, buttons, the account menu)', 'accent-content and accent-content-muted for text on the accent surface', 'The frost roles for the light header tone'],
      avoid: ['The accent surface as a page or card background', 'Controls on the accent with the page roles: use the accent field and state roles', 'A new accent color: the accent comes from the theme'],
      related: COLOR_REL.concat(['color-brand', 'application-header']),
      map: [m(M, 'Secondary and tertiary color roles', 'Partial'), m(F, 'Brand colors (accent)', 'Partial'), m(SP, 'Accent color', 'Partial'), m(A, 'Accent colors', 'Partial')] }),
    base('color-semantic', 'Semantic colors', 'info-circle', 'semantic', {
      text: 'The feedback tones: neutral, information, success, warning and danger. Each comes as a solid (dots, bars, marks) with the text and icons on it, a solid fill and edge (count pills), and a soft fill with its edge and the text on it. Messages, notices, banners and validation use them; every pair meets the contrast rules in light and dark mode. Warning is orange (orange-700 solid and text, orange-100 soft fill, orange-300 edge in light; orange-300 solid and orange-200 text in dark): orange replaces brown for statuses (owner, 2026-10-14). Status pills (Badge) have their own roles, in the Status group.',
      aliases: ['Feedback colors', 'Status tones', 'Support colors', 'Intent colors'],
      use: ['The tone that matches the message: danger for errors and destruction, warning for action or correction required, success for completion, information for neutral news', 'The soft fill with its content role for notices; the solid with on-solid for count pills', 'Words or an icon next to the color (Use of color)'],
      avoid: ['A feedback tone for decoration or for a chart series (Data visualization colors)', 'Presence or workflow state: those are the Status roles', 'Mixing a tone’s roles with another tone’s (the pairs are measured together)'],
      related: COLOR_REL.concat(['color-status', 'badge', 'notice']),
      map: [m(C, 'Support colors'), m(A, 'Semantic color tokens'), m(F, 'Semantic colors'), m(M, 'Error color role', 'Partial'), m(PO, 'Critical, warning, success and info colors')] }),
    base('color-surface', 'Surface colors', 'text-card', 'surface', {
      text: 'The backgrounds the interface is built on: the canvas behind everything, the default, raised, overlay and sunken surfaces, the inverse surface, the dialog title area, the media surfaces, the scrim, and the surfaces of read-only controls and sticky rows.',
      aliases: ['Backgrounds', 'Layers', 'Surface tokens'],
      use: ['surface-canvas for the page, surface-default for panels and cards, surface-overlay for menus and dialogs', 'surface-sunken for read-only fields and wells', 'The Text roles on these surfaces (their pairs are measured)'],
      avoid: ['A palette gray as a background', 'Stacking more than two framed surfaces (the nesting rule)', 'The accent surface as a content background'],
      related: COLOR_REL.concat(['color-text', 'color-border', 'shadows']),
      map: [m(M, 'Surface color roles'), m(C, 'Background and layer tokens'), m(A, 'Surface tokens'), m(F, 'Neutral background colors')] }),
    base('color-text', 'Text colors', 'ed-text', 'text', {
      text: 'The colors of text and icons: default, muted and subtle text, disabled and inverse text, links and visited links, text on the dialog title area and on media, placeholders, and the value of a read-only control. Each meets the text rule on the surfaces it is used on.',
      aliases: ['Content colors', 'Foreground colors', 'Text tokens'],
      use: ['content-default for body text and icons, content-muted for secondary text', 'content-link for links; content-link-visited where visited links matter', 'field-placeholder only for placeholders: the label carries the meaning'],
      avoid: ['Lowering text contrast to make text quieter: use size, weight or position', 'content-disabled for text that still carries meaning', 'Text roles as fills or borders'],
      related: COLOR_REL.concat(['color-surface', 'typography']),
      map: [m(M, 'On-surface color roles'), m(C, 'Text tokens'), m(A, 'Text color tokens'), m(F, 'Neutral foreground colors')] }),
    base('color-border', 'Border colors', 'ed-crop', 'border', {
      text: 'The colors of edges and separators: the default border of cards, panels and fields, subtle separators, strong edges that must be seen (3:1), list dividers, the dialog title area’s edge, edges on media and the edge of a read-only control.',
      aliases: ['Stroke colors', 'Outline colors', 'Divider colors'],
      use: ['border-default for the edges of cards and panels, border-subtle inside a surface, border-divider between list items, border-separator (gray 250) between the groups of a menu', 'border-strong, or the control edge, where the edge identifies a control (3:1)', 'Lines drawn inside their box so they never move the grid'],
      avoid: ['A border to separate what spacing already separates', 'Subtle borders as the only edge of a control', 'Border roles as text colors'],
      related: COLOR_REL.concat(['border', 'color-surface']),
      map: [m(M, 'Outline color roles'), m(C, 'Border tokens'), m(A, 'Border color tokens'), m(F, 'Neutral stroke colors')] }),
    base('color-interactive', 'Interactive colors', 'button', 'interactive', {
      text: 'The colors of things people act on and of their states: hover, pressed and selected, the primary and danger actions and their states, the focus indicator, the background and edge of fields and controls, and the edge and text of selected items.',
      aliases: ['Action colors', 'State colors', 'Interaction colors'],
      use: ['The action roles for buttons (primary and danger), the state roles for hover, pressed and selected', 'focus-ring-color for every focus indicator (a focused field changes only its border color)', 'control-background and control-border for fields and controls'],
      avoid: ['The brand role for an action, even with the same value: the two roles can change separately', 'Selection shown by color alone: add a check, a weight or an edge', 'A hover color on something that does nothing'],
      related: COLOR_REL.concat(['interaction-states', 'focus-ring', 'button']),
      map: [m(M, 'State layers', 'Partial'), m(C, 'Interactive and state tokens'), m(A, 'Interaction tokens'), m(F, 'Brand and neutral state colors', 'Partial')] }),
    base('color-status', 'Status colors', 'circle-info', 'status', {
      text: 'The colors of a person’s presence, of the state of work, and of the status pills. Presence: online (green), away (yellow), busy (red), do not disturb (red), offline (gray). Workflow: done (green), in progress (blue), blocked (red), not started (gray). Each dot color is kept at 3:1 or more on its surface, so a status dot is seen in light and dark mode. The status pills (Badge) have six variants, each with a background, a 1px border and a text role (--plx-sys-status-pill-<variant>-*): neutral (gray), success (green), active (blue), waiting (yellow), action required (orange) and negative (red). Light: shade 100 background, shade 300 border, shade 700 text (800 for red). Dark: the soft-on-dark pattern (gray-700 background, gray-800 border, the family’s light shade as text). Yellow means waiting or paused, orange action or correction required, red blocked or unsuccessful; brown is never a status (owner, 2026-10-14, docs/pills-and-colors.md).',
      aliases: ['Presence colors', 'Availability colors', 'Workflow state colors'],
      use: ['The presence roles where a person’s availability is shown (an avatar’s presence dot, a member list)', 'The workflow roles where the state of a task or project is shown', 'The status pill roles through Badge only (tone: neutral, success, active, waiting, action-required, negative)', 'The state in words next to the color, or as the dot’s label'],
      avoid: ['Status roles for messages and validation: those are the Semantic roles', 'A status color without its words', 'Status pill colors for tags or categories: those take the category palette', 'Brown for a status', 'New states with borrowed colors: a new state is the owner’s decision'],
      related: COLOR_REL.concat(['color-semantic', 'status-dot', 'avatar']),
      map: [m(F, 'Presence badge colors'), m(A, 'Lozenge colors', 'Partial'), m(C, 'Status indicator colors', 'Partial'), m(M, 'Status colors', 'Partial')] })
  ];
});
