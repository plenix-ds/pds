/* Plenix design system · library part w01B (wave 1, lane B): the aspect-ratio scale (system/ratio.css), the interaction
   states (system/interaction.css and the state tokens) and three overlay foundations: floating positioning
   (utils/floating.ts, useFloating), the Portal (utils/portal.tsx) and the intersection observer (hooks/useIntersection.ts).
   Each is a rules page with live examples; their duplicate leaves (Disabled state, Anchored overlay, Floating positioner,
   the utilities' Portal) are thin records that show the main page's written sections. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, use = H.use, eachV = H.eachV, q = H.q;
  var MAT = 'Material 3', CAR = 'Carbon', FLU = 'Fluent 2', SPE = 'Spectrum', ATL = 'Atlassian';

  /* ── the aspect-ratio scale ── */
  var RATIOS = [['1-1', '1:1', 'Square'], ['4-3', '4:3', 'Landscape'], ['3-2', '3:2', 'Photograph'], ['16-9', '16:9', 'Wide'], ['21-9', '21:9', 'Very wide'], ['3-4', '3:4', 'Portrait'], ['9-16', '9:16', 'Tall']];
  var ratioBox = function (r) { return h('div', { className: 'ds-ratio-sample plx-ratio-' + r[0] }, h(P.Text, { variant: 'data' }, r[1])); };

  /* ── the interaction states ── */
  var TREATMENTS = [['rest', 'Rest (default)', 'className="plx-state"'], ['hover', 'Hover', ':hover (is-hover in documentation)'], ['focus', 'Focus', ':focus-visible (is-focus-visible in documentation)'],
    ['pressed', 'Pressed', ':active (is-pressed in documentation)'], ['selected', 'Selected', 'aria-selected, aria-pressed or aria-current="page" (or is-selected)'],
    ['dragged', 'Dragged', 'is-dragging (its origin: is-drag-origin)'], ['disabled', 'Disabled', 'disabled, aria-disabled="true" or is-disabled']];
  var SURFACES = [['surface', 'On a surface'], ['accent', 'On the accent'], ['inverse', 'On the inverse surface']];
  var STATE_CLASS = { hover: ' is-hover', focus: ' is-focus-visible', pressed: ' is-pressed', selected: ' is-selected', dragged: ' is-dragging' };
  // one element in a treatment on a surface: the same markup the lab draws
  var specimen = function (t, s, label) {
    return h('div', { key: s, className: 'ds-state-frame ds-state-frame--' + s },
      h('button', { type: 'button', className: 'plx-state' + (s === 'surface' ? '' : ' plx-state--' + s) + ' ds-state-specimen' + (STATE_CLASS[t] || ''),
        disabled: t === 'disabled', 'aria-pressed': t === 'selected' ? 'true' : undefined }, label || 'Archive'));
  };
  var onEvery = function (t) { var k = Array.isArray(t) ? t[0] : t; return row.apply(null, SURFACES.map(function (s) { return specimen(k, s[0]); })); };

  /* ── floating positioning: a live anchor and its floating element ── */
  var Float = function (p) {
    // placed while the whole stage shows (the browser keeps the last side that fitted, so it opens in view)
    var a = React.useRef(null), f = React.useRef(null), stage = React.useRef(null), seen = P.useIntersection(stage, { threshold: 1 });
    var at = P.useFloating(a, f, { open: seen.visible, placement: p.placement, offset: p.offset, flip: p.flip, shift: p.shift, matchWidth: p.matchWidth });
    return h('div', { ref: stage, className: 'ds-float-stage' },
      h('span', { ref: a, className: 'ds-float-anchor' + (p.wide ? ' ds-float-anchor--wide' : '') }, p.anchor || 'Anchor'),
      seen.visible ? h('span', { ref: f, className: 'ds-float-panel' }, h(P.Text, { variant: p.label ? 'body' : 'data' }, p.label || at.placement)) : null);
  };
  var PointerDemo = function () {
    var point = use(null), stage = React.useRef(null), f = React.useRef(null);
    P.useFloating(stage, f, { open: !!point[0], virtual: point[0] });
    return h('div', { ref: stage, className: 'ds-float-pointer', tabIndex: 0, 'aria-label': 'Right-click or press Shift F10 to open a menu here',
      onContextMenu: function (e) { e.preventDefault(); point[1]({ x: e.clientX, y: e.clientY }); },
      onKeyDown: function (e) { if (e.key === 'Escape') point[1](null); if (e.key === 'F10' && e.shiftKey) { e.preventDefault(); var r = e.currentTarget.getBoundingClientRect(); point[1]({ x: r.left, y: r.bottom }); } },
      onClick: function () { point[1](null); } },
      h(P.Text, { variant: 'secondary' }, point[0] ? 'Click or press Escape to close' : 'Right-click here (or Shift F10)'),
      point[0] ? h('span', { ref: f, className: 'ds-float-panel', role: 'note' }, h(P.Text, null, 'At the pointer')) : null);
  };

  /* ── the Portal: out of a clipped box, into the top layer, into a container ── */
  var PortalDemo = function (p) {
    var open = use(false), a = React.useRef(null), f = React.useRef(null), into = React.useRef(null);
    P.useFloating(a, f, { open: open[0] && !p.container, placement: 'bottom-start' });
    var panel = h('span', { ref: p.container ? null : f, className: 'ds-float-panel' }, h(P.Text, null, p.container ? 'Drawn in the container' : p.layer === 'top' ? 'In the top layer' : 'In the shared root'));
    return h(P.Stack, { gap: 'sm' },
      h('div', { className: 'ds-portal-clip' },
        h('span', { ref: a, className: 'ds-float-anchor' }, h(P.Button, { size: 'sm', onClick: function () { open[1](!open[0]); } }, open[0] ? 'Close' : 'Open')),
        h(P.Text, { variant: 'secondary' }, 'This box clips what overflows it')),
      p.container ? h('div', { ref: into, className: 'ds-portal-target' }, h(P.Text, { variant: 'secondary' }, 'The container')) : null,
      open[0] ? h(P.Portal, { layer: p.layer, container: p.container ? into : null }, panel) : null);
  };

  /* ── the intersection observer: rows that load as they scroll into view ── */
  var Lazy = function (p) {
    var ref = React.useRef(null), seen = P.useIntersection(ref, { root: p.root, once: true, rootMargin: p.margin });
    return h('div', { ref: ref, className: 'ds-io-row' }, h(P.Text, null, 'Asset ' + p.n), seen.visible ? h(P.Badge, { tone: 'success' }, 'Loaded') : h(P.Skeleton, { width: '80px' }));
  };
  var LazyList = function (p) {
    var root = React.useRef(null);
    return h('div', { ref: root, className: 'ds-io-scroll', tabIndex: 0, 'aria-label': 'Assets that load as they scroll into view' },
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (n) { return h(Lazy, { key: n, n: n, root: root, margin: p.margin }); }));
  };
  var RatioDemo = function () {
    var root = React.useRef(null), target = React.useRef(null), seen = P.useIntersection(target, { root: root, threshold: [0, 0.25, 0.5, 0.75, 1] });
    return h(P.Stack, { gap: 'sm' }, h(P.Text, null, h(P.Text, { variant: 'data' }, Math.round(seen.ratio * 100) + '%'), ' of the card shows'),
      h('div', { ref: root, className: 'ds-io-scroll', tabIndex: 0, 'aria-label': 'Scroll to show the card' },
        h('div', { className: 'ds-io-spacer' }), h('div', { ref: target, className: 'ds-io-target' }, h(P.Text, null, 'The watched card')), h('div', { className: 'ds-io-spacer' })));
  };

  // a duplicate leaf: its own page (home = the leaf) showing the main page's written sections and one live example
  var thin = function (r) { return Object.assign({ variantClasses: [], aliases: [], map: [] }, r); };

  return [
    /* ── 01 Foundations › Grid ── */
    { id: 'aspect-ratio-scale', sec: 'foundations', sub: 'Grid', leaf: 'Aspect-ratio scale', level: 'Foundation', interaction: 'Static', icon: 'ed-crop',
      css: ['system/ratio.css', 'system/tokens/reference.css'], aliases: ['Aspect ratios', 'Ratio scale', 'Media ratios'],
      text: 'The fixed set of width-to-height ratios a media frame, preview or card may take: 1:1, 4:3, 3:2, 16:9, 21:9 and the portrait 3:4 and 9:16, as the reference tokens --plx-ref-ratio-<w>-<h> and the classes plx-ratio-<w>-<h>.',
      use: ['A frame for media: .plx-ratio-16-9 on the frame, .plx-ratio-media on the picture or video inside it', 'One ratio per grid of thumbnails, so the rows line up', 'Cover (the default) to crop a decorative picture; plx-ratio-media--contain when the whole asset must show'],
      avoid: ['A ratio of its own for one screen: add it to the scale first (a token), then use it', 'Stretching media to fill a frame', 'A ratio written as a number in a stylesheet (aspect-ratio: 16 / 9)'],
      related: ['spacing', 'breakpoints', 'media-card'], map: [[CAR, 'AspectRatio', 'Partial'], [MAT, 'Aspect ratios (imagery)', 'Partial'], [SPE, 'Aspect ratio (imagery)', 'Partial']],
      examples: [['Ratio', eachV(RATIOS, function (r) { return r[1] + ' · ' + r[2]; }, ratioBox, function (r) { return 'plx-ratio-' + r[0]; }, function (r) { return 'className=' + q('plx-ratio-' + r[0]); }), { prop: 'className' }],
        ['One ratio per grid', function () { return h('div', { className: 'ds-ratio-grid' }, [1, 2, 3, 4].map(function (n) { return h('div', { key: n, className: 'ds-ratio-sample plx-ratio-4-3' }, h(P.Text, null, 'Asset ' + n)); })); }]] },

    /* ── 01 Foundations › Interaction states ── */
    { id: 'interaction-states', lab: true, sec: 'foundations', sub: 'Interaction states', leaf: 'Hover treatment', title: 'State treatment', level: 'Foundation', interaction: 'Static', icon: 'select',
      css: ['system/interaction.css', 'system/tokens/semantic.css'],
      covers: ['Focus treatment', 'Pressed treatment', 'Selected treatment', 'Dragged treatment', 'Disabled treatment'],
      aliases: ['State layer', 'Interactive states', 'Hover state', 'Active state', 'Pressed state'],
      text: 'One treatment per state for every interactive element (hover, focus, pressed, selected, dragged and disabled) on a surface, on the accent surface and on the inverse surface. The colors are the theme’s state roles, in light and dark; system/interaction.css draws them on the plx-state class.',
      use: ['The state roles for every state (--plx-sys-state-hover, -state-pressed, -state-selected, -accent-state-hover), never a color picked per component', 'class="plx-state" (and plx-state--accent or plx-state--inverse on those surfaces) on an element that has no state rules of its own',
        'A second cue for selection (a check, a filled icon, a bar) and its ARIA state, so color is never the only signal', 'Disabled controls with the reason nearby; read-only instead when the value must stay readable'],
      avoid: ['A change of size or layout on hover or press', 'Anything that is found or done only by hover: touch has none', 'Removing the focus ring without a replacement', 'Hover or pressed feedback on a disabled element'],
      related: ['focus-ring', 'device-behavior', 'motion', 'design-tokens'],
      map: [[MAT, 'States (state layers)', 'Direct'], [CAR, 'Interactive states', 'Direct'], [FLU, 'Interaction states', 'Direct'], [SPE, 'States', 'Direct']],
      variantPages: [
        { leaf: 'Hover treatment', group: 'Treatment', name: 'Hover', lab: { variant: 'hover' }, text: 'The one-step fill an interactive element takes while a pointer rests on it.', use: ['Every element a pointer can operate'], avoid: ['Information or actions that only hover reveals'] },
        { leaf: 'Focus treatment', group: 'Treatment', name: 'Focus', lab: { variant: 'focus' }, text: 'The focus ring of the Focus ring item, drawn for keyboard focus only (:focus-visible); a focused field changes only its border color.', use: ['Every element that takes keyboard focus'], avoid: ['An outline removed without a replacement'] },
        { leaf: 'Pressed treatment', group: 'Treatment', name: 'Pressed', lab: { variant: 'pressed' }, text: 'One fill step stronger than hover, only while the pointer or the key is down.', use: ['Buttons, menu items and rows a person clicks'], avoid: ['Showing that something is on: use the selected treatment'] },
        { leaf: 'Selected treatment', group: 'Treatment', name: 'Selected', lab: { variant: 'selected' }, text: 'The selected fill and border of a chosen item, with its ARIA state and a second cue the component draws.', use: ['Selected rows, tabs, navigation items and toggle buttons'], avoid: ['Color as the only sign of selection'] },
        { leaf: 'Dragged treatment', group: 'Treatment', name: 'Dragged', lab: { variant: 'dragged' }, text: 'The lifted item while it moves: raised with the overlay shadow and slightly transparent; its origin dims.', use: ['Reordering a list and moving assets into folders'], avoid: ['Dragging as the only way to move an item'] },
        { leaf: 'Disabled treatment', group: 'Treatment', name: 'Disabled', lab: { variant: 'disabled' }, text: 'The disabled text color (or, on the accent and inverse surfaces, a dimmed element) with no hover or pressed feedback.', use: ['An action that becomes available once a condition is met'], avoid: ['A value people must read or copy: use read-only'] }
      ],
      examples: [['Treatment', eachV(TREATMENTS, function (t) { return t[1]; }, onEvery, function () { return 'plx-state'; }, function (t) { return t[2]; }), { prop: 'className' }],
        ['On every surface', function () { return h(P.Stack, { gap: 'sm' }, SURFACES.map(function (s) { return h('div', { key: s[0], className: 'ds-state-frame ds-state-frame--' + s[0] + ' ds-state-strip' }, TREATMENTS.map(function (t) { return h('button', { key: t[0], type: 'button', className: 'plx-state' + (s[0] === 'surface' ? '' : ' plx-state--' + s[0]) + ' ds-state-specimen' + (STATE_CLASS[t[0]] || ''), disabled: t[0] === 'disabled', 'aria-pressed': t[0] === 'selected' ? 'true' : undefined }, t[1].replace(' (default)', '')); })); })); }]] },

    /* ── 08 Feedback › Disabled state (the disabled treatment) ── */
    thin({ id: 'feedback-disabled-state', sec: 'feedback', sub: 'Empty, failure, and recovery', leaf: 'Disabled state', level: 'Foundation', interaction: 'Static', icon: 'select',
      css: ['system/interaction.css'], docsFrom: 'interaction-states', related: ['interaction-states', 'button', 'field'], aliases: ['Unavailable', 'Inactive control'],
      text: 'A control that exists but cannot be used yet takes the disabled treatment of the Interaction states foundation: the disabled text color, no hover or pressed feedback and the not-allowed pointer.',
      use: ['An action that becomes available once the person does something (select a row to enable Download)', 'The reason in nearby text when it is not obvious'],
      avoid: ['Disabling a form’s submit button to signal errors: let people submit and show the errors', 'Disabled for a value people must read: use read-only', 'A control people can never use: hide it'],
      examples: [['Disabled', function () { return onEvery('disabled'); }]] }),

    /* ── 09 Overlays › Layer behavior: floating positioning ── */
    { id: 'floating', sec: 'overlays', sub: 'Layer behavior', leaf: 'Floating positioning', plenix: 'useFloating', src: 'utils/floating.ts', css: ['system/floating.css', 'system/tokens/semantic.css'],
      level: 'Foundation', interaction: 'Utility', icon: 'move', aliases: ['Positioner', 'Popper', 'Anchor positioning', 'Placement'],
      use: ['Every anchored overlay: menus, popovers, tooltips, combobox lists and date pickers, with one placement name and an offset step', 'matchWidth for a select or combobox list', 'virtual: { x, y } for a context menu at the pointer'],
      avoid: ['Coordinates written by hand or as a style', 'A dialog: it is centered in the window, not anchored', 'An overlay that covers its own trigger, unless it is a menu that replaces it'],
      related: ['overlay-manager', 'portal', 'action-menu', 'tooltip'], map: [[FLU, 'Positioning', 'Direct'], [ATL, 'Popup (placement)', 'Partial'], [CAR, 'Popover (alignment)', 'Partial'], [SPE, 'useOverlayPosition', 'Partial']],
      examples: [['Placement', eachV([['bottom-start', 'Bottom start (default)'], ['bottom', 'Bottom'], ['top-end', 'Top end'], ['end', 'End'], ['start-top', 'Start top']], function (x) { return x[1]; },
          function (x) { return h(Float, { placement: x[0] }); }, function () { return null; }, function (x) { return 'placement=' + q(x[0]); }), { prop: 'placement' }],
        ['Offset', eachV([['none', 'None'], ['xs', 'XS (default)'], ['sm', 'SM'], ['md', 'MD']], function (x) { return x[1]; },
          function (x) { return h(Float, { placement: 'bottom-start', offset: x[0], label: 'offset ' + x[0] }); }, function () { return null; }, function (x) { return 'offset=' + q(x[0]); }), { prop: 'offset' }],
        ['Behavior', [['Match the anchor width', function () { return h(Float, { placement: 'bottom-start', matchWidth: true, wide: true, anchor: 'A wide anchor', label: 'As wide' }); }, null, 'matchWidth'],
          ['Flip and shift off', function () { return h(Float, { placement: 'top-start', flip: false, shift: false, label: 'Stays on top' }); }, null, 'flip={false} shift={false}'],
          ['At the pointer', function () { return h(PointerDemo); }, null, 'virtual={{ x, y }}']]]] },
    thin({ id: 'overlays-anchored-overlay', sec: 'overlays', sub: 'Overlay surfaces', leaf: 'Anchored overlay', plenix: 'useFloating', src: 'utils/floating.ts', css: ['system/floating.css'],
      level: 'Foundation', interaction: 'Utility', icon: 'move', docsFrom: 'floating', related: ['floating', 'portal', 'overlay-manager'], aliases: ['Popup', 'Anchored popover'],
      text: 'Any overlay attached to a trigger (a menu, a popover, a tooltip, a picker) is placed by useFloating, layered by useLayer and, when it must escape its parent, drawn in a Portal: one way to open, place and dismiss.',
      use: ['The base of any new overlay that floats next to a trigger: useFloating for the place, useLayer for Escape and focus'], avoid: ['A new way of anchoring for one component', 'Content not tied to an element: use a dialog or a side panel'],
      examples: [['Anchored', function () { return h(Float, { placement: 'bottom-start', label: 'Anchored here' }); }]] }),

    /* ── 09 Overlays › Layer behavior: the Portal ── */
    { id: 'portal', sec: 'overlays', sub: 'Layer behavior', leaf: 'Portal', plenix: 'Portal', src: 'utils/portal.tsx', css: ['system/portal.css'],
      level: 'Foundation', interaction: 'Utility', icon: 'open', aliases: ['Portal host', 'Layer root', 'Teleport'],
      use: ['An overlay that a scroll area, a card or a pane would clip, or a stacking context would cover', 'layer="top" for an overlay that must sit above dialogs and panes', 'container for a region of the page that hosts the content'],
      avoid: ['Content that belongs in the reading order of the page', 'A Portal without the overlay’s focus handling (useLayer) and the ARIA link to its trigger'],
      related: ['floating', 'overlay-manager', 'layers', 'dialog'], map: [[ATL, 'Portal', 'Direct'], [FLU, 'Portal', 'Direct'], [SPE, 'Overlay container (React Aria)', 'Partial']],
      examples: [['Layer', [['Page (default)', function () { return h(PortalDemo, { layer: 'page' }); }, 'plx-portal', 'layer="page"'],
          ['Top layer', function () { return h(PortalDemo, { layer: 'top' }); }, 'plx-portal--top', 'layer="top"'],
          ['Custom container', function () { return h(PortalDemo, { container: true }); }, 'plx-portal', 'container={ref}']], { prop: 'layer' }]] },

    /* ── 13 Interaction › Behavioral utilities ── */
    thin({ id: 'interaction-portal', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Portal', plenix: 'Portal', src: 'utils/portal.tsx', css: ['system/portal.css'],
      level: 'Foundation', interaction: 'Utility', icon: 'open', docsFrom: 'portal', related: ['portal', 'overlay-manager', 'floating'],
      text: 'The Portal utility draws its children into a shared root at the end of the page, into the browser’s top layer or into a container. They keep the density, theme and direction of the place where the Portal is written.',
      use: ['Menus, popovers, tooltips and toasts that must escape overflow or a stacking context'], avoid: ['A root of its own per overlay: every Portal shares one'],
      examples: [['Out of a clipped box', function () { return h(PortalDemo, { layer: 'page' }); }]] }),
    thin({ id: 'interaction-floating-positioner', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Floating positioner', plenix: 'useFloating', src: 'utils/floating.ts', css: ['system/floating.css'],
      level: 'Foundation', interaction: 'Utility', icon: 'move', docsFrom: 'floating', related: ['floating', 'portal', 'overlay-manager'], aliases: ['Popper', 'useOverlayPosition'],
      text: 'useFloating(anchorRef, floatingRef, options) places a floating element beside its anchor or at a point. The options: a named placement, an offset step, flip, shift and the anchor’s width. It sets data attributes that system/floating.css reads.',
      use: ['Every anchored overlay, also inside a scroll area: CSS anchor positioning follows the anchor'], avoid: ['Fixed offsets or coordinates written by hand', 'Modals, which are centered'],
      examples: [['Placed beside its anchor', function () { return h(Float, { placement: 'end', label: 'end' }); }]] }),
    { id: 'intersection-observer', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Intersection observer', plenix: 'useIntersection', src: 'hooks/useIntersection.ts', css: [],
      level: 'Foundation', interaction: 'Utility', icon: 'visibility', aliases: ['useInView', 'Lazy loading', 'Viewport observer'],
      use: ['Loading thumbnails just before they scroll into view (once, with a root margin)', 'Loading the next page near the end of a list, with a Load more button as the keyboard way', 'Marking a sticky header once content passes under it'],
      avoid: ['Hiding content people need until it scrolls into view', 'Infinite scroll where people must reach the footer: use pagination or Load more', 'A scroll handler that measures positions'],
      related: ['skeleton', 'pagination', 'overlay-manager'], map: [],
      examples: [['Use', [['Visible once', function () { return h(LazyList, {}); }, null, 'once'],
          ['Root margin', function () { return h(LazyList, { margin: '--plx-ref-size-64px' }); }, null, 'rootMargin="--plx-ref-size-64px"'],
          ['Ratio', function () { return h(RatioDemo); }, null, 'threshold={[0, 0.25, 0.5, 0.75, 1]}']], { prop: 'once' }]] }
  ];
});
