/* Plenix design system · library part w02C (wave 2, lane C): foundations of interaction. Pressable (hooks/usePressable.ts),
   Focusable (hooks/useFocusable.ts: useFocusable, useFocusGroup), Selectable and Single selection (hooks/useSelection.ts),
   Gesture interaction and Gesture motion (hooks/useGesture.ts, system/gesture.css, the gesture motion tokens), the
   Read-only state (providers/ReadOnly.tsx, system/read-only.css) and Semantic HTML (check-system.rules/semantic-html.js).
   Every example is drawn with Platform components, the foundations' own classes and the specimen frames of w02C.css. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, m = H.m, A = H.A, C = H.C, M = H.M, F = H.F;
  var SP = ['Spectrum'], PO = ['Polaris'];
  var stack = function () { return h.apply(null, [P.Stack, { gap: 'sm' }].concat([].slice.call(arguments))); };
  var caption = function (t, extra) { return h(P.Text, Object.assign({ variant: 'secondary' }, extra || {}), t); };
  var data = function (t) { return h(P.Text, { variant: 'data' }, t); };
  var FOLDERS = ['Crosses', 'Borders', 'Banner icons', 'Bookshelf', 'Certificates'];
  var keyOf = function (s) { return s.toLowerCase().replace(/\s+/g, '-'); };

  /* ── pressable ── */
  function PressDemo() {
    var last = H.use('Not pressed yet'), n = H.use(0);
    var p = P.usePressable({ onPress: function (e) { n[1](function (c) { return c + 1; }); last[1]('Pressed with ' + e.pointerType); } });
    return stack(
      h('div', { className: 'ds-state-frame ds-state-frame--surface' },
        h('button', Object.assign({ type: 'button', className: 'plx-state ds-state-specimen' + (p.pressed ? ' is-pressed' : '') }, p.pressProps), 'Archive')),
      h(P.Text, { 'aria-live': 'polite' }, last[0], ' · ', data(P.formatNumber(n[0])), n[0] === 1 ? ' press' : ' presses'),
      caption('Click, tap, or focus it and press Enter or Space. Hold it and slide off before releasing: no press.'));
  }
  function SurfaceDemo() {
    var on = H.use(false);
    var p = P.usePressable({ onPress: function () { on[1](function (v) { return !v; }); } });
    return stack(
      h('div', Object.assign({ role: 'button', tabIndex: 0, 'aria-pressed': on[0], className: 'plx-state ds-state-specimen' + (p.pressed ? ' is-pressed' : '') + (on[0] ? ' is-selected' : '') }, p.pressProps), on[0] ? 'Pinned' : 'Pin'),
      caption('A custom surface: role="button", tabIndex 0 and a name are yours; the press is the hook’s.'));
  }
  var pressable = { id: 'pressable', icon: 'button', sec: 'interaction', sub: 'Interaction foundations', leaf: 'Pressable', title: 'Pressable',
    plenix: 'usePressable', src: 'hooks/usePressable.ts', css: [], level: 'Utility', interaction: 'Utility',
    text: 'usePressable turns a mouse click, a tap, a pen, Enter or Space and a screen reader’s click into one onPress, with the kind of input that made it. While a press is held the element stays pressed, so it can show the pressed treatment. The press is made on release, so sliding off cancels it.',
    aliases: ['usePress', 'Press events', 'Press handler', 'Tap handler'],
    use: ['A custom surface that acts on press and is not a Button, RowButton or link: a tile, a canvas object, a cell widget', 'The pressed treatment (is-pressed) while a press is held, from pressed', 'Telling how a press was made (pointerType) when the result differs: a keyboard press moves focus into what it opens, a pointer press does not'],
    avoid: ['A plain action: use Button (it is a native button already)', 'Navigation: use a link, so the browser opens it in a new tab and reads it as a link', 'A press on pointer down: people cannot cancel it (WCAG 2.2, 2.5.2)', 'A div with the hook and no role: the check-system rule semantic-html rejects it'],
    related: ['button', 'interactive-list', 'interaction-states', 'focusable'],
    map: [m(A, 'Pressable'), m(SP, 'usePress (React Aria)'), m(M, 'Interaction states', 'Partial'), m(F, 'useARIAButtonProps', 'Partial')],
    examples: [
      ['Pointer, touch and keyboard as one press', function () { return box(360, h(PressDemo)); }],
      ['A custom surface', function () { return box(360, h(SurfaceDemo)); }],
      ['In code', function () { return h(P.CodeBlock, null, 'const { pressed, pressProps } = usePressable({ onPress: (e) => open(e.pointerType) });\n<button type="button" className={cx(\'plx-state\', pressed && \'is-pressed\')} {...pressProps}>Open</button>'); }]] };

  /* ── focusable ── */
  function FocusVisibleDemo() {
    var f = P.useFocusable();
    return stack(
      h('div', Object.assign({ role: 'region', 'aria-label': 'Release notes', className: 'plx-state ds-state-specimen' + (f.focusVisible ? ' is-focus-visible' : '') }, f.focusProps), 'Release notes'),
      h(P.Text, { 'aria-live': 'polite' }, f.focused ? (f.focusVisible ? 'Focused from the keyboard: the ring shows' : 'Focused by a click: no ring') : 'Not focused'),
      caption('Tab to it, then click it: the focus treatment shows only for the keyboard.'));
  }
  function FocusGroupDemo() {
    var ref = React.useRef(null), cur = H.use('crosses');
    var g = P.useFocusGroup(ref, { orientation: 'vertical' });
    return stack(
      h('div', Object.assign({ ref: ref, role: 'listbox', 'aria-label': 'Folders', className: 'plx-stack plx-stack--gap-xs' }, g.groupProps),
        FOLDERS.map(function (l) {
          var k = keyOf(l);
          return h('div', { key: k, role: 'option', tabIndex: -1, 'aria-selected': cur[0] === k, className: 'plx-state ds-state-specimen' + (cur[0] === k ? ' is-selected' : ''),
            onClick: function () { cur[1](k); }, onKeyDown: function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); cur[1](k); } } }, l);
        })),
      caption('One Tab stop: Tab enters the list on the item last used, Up and Down move, Home and End jump, Tab leaves.'));
  }
  var focusable = { id: 'focusable', icon: 'select', sec: 'interaction', sub: 'Interaction foundations', leaf: 'Focusable', title: 'Focusable',
    plenix: 'useFocusable, useFocusGroup', src: 'hooks/useFocusable.ts', css: [], level: 'Utility', interaction: 'Utility',
    text: 'Focus for custom elements, as native controls have it. useFocusable makes an element a Tab stop (or a focus target only) and tells whether its focus came from the keyboard (focus-visible), so the focus treatment shows for the keyboard and not after a click. useFocusGroup makes a group of controls one Tab stop whose items are reached with the arrow keys: roving focus, in reading order.',
    aliases: ['useFocusRing', 'Focus-visible', 'Roving tabindex', 'Focus group', 'Arrow-key navigation'],
    use: ['A custom widget that takes focus: an option, a tile, a canvas object (with its role)', 'A scroll area that holds no control: tabStop "tab" and a name, so the keyboard can scroll it', 'A group of related controls that should be one Tab stop: a list of options, a grid of tiles, a segmented row', 'focusVisible to draw the focus treatment only for keyboard focus'],
    avoid: ['Making text, headings or images focusable: only what people act on, and scroll areas', 'tabIndex above 0: the Tab order follows the page', 'Removing the focus treatment without its replacement (Focus treatment)', 'A focus group around controls people expect to Tab through one by one: a form’s fields'],
    related: ['focus-ring', 'pressable', 'toolbar'],
    map: [m(SP, 'useFocusRing, useFocusable (React Aria)'), m(A, 'Focusable / Focus ring'), m(M, 'Focus state', 'Partial'), m(F, 'Tabster (focus groups)', 'Partial')],
    examples: [
      ['Focus-visible: keyboard focus shows the ring', function () { return box(360, h(FocusVisibleDemo)); }],
      ['A focus group: one Tab stop, arrow keys inside', function () { return box(280, h(FocusGroupDemo)); }]] };

  /* ── selectable ── */
  function MultiDemo() {
    var keys = FOLDERS.map(keyOf);
    var sel = P.useSelection({ items: keys, mode: 'multiple', defaultSelected: ['borders'] });
    return stack(
      h(P.Checkbox, { label: 'Select all', checked: sel.allSelected, indeterminate: sel.someSelected, onChange: sel.toggleAll }),
      h(P.Stack, { gap: 'xs', inset: 'none' }, FOLDERS.map(function (l) { var k = keyOf(l); return h(P.Checkbox, { key: k, label: l, checked: sel.isSelected(k), onChange: function () { sel.toggle(k); } }); })),
      h(P.Text, { 'aria-live': 'polite' }, data(P.formatNumber(sel.count)), ' selected'));
  }
  function RangeDemo() {
    var keys = FOLDERS.map(keyOf);
    var sel = P.useSelection({ items: keys, mode: 'multiple', behavior: 'replace', defaultSelected: ['crosses'] });
    return stack(
      h(P.Stack, { gap: 'xs' }, FOLDERS.map(function (l) {
        var k = keyOf(l);
        return h(P.RowButton, { key: k, pressed: sel.isSelected(k), onClick: function (e) { sel.choose(k, e); } }, h(P.Inline, { gap: 'sm' }, h(P.Icon, { name: sel.isSelected(k) ? 'check' : 'folder', size: 'sm' }), h(P.Text, null, l)));
      })),
      caption('Click selects one; Shift-click extends from the last one; Ctrl- or ⌘-click adds or removes.'),
      h(P.Text, { 'aria-live': 'polite' }, data(P.formatNumber(sel.count)), ' selected'));
  }
  var selectable = { id: 'selectable', icon: 'circle-check', sec: 'interaction', sub: 'Interaction foundations', leaf: 'Selectable', title: 'Selectable',
    plenix: 'useSelection', src: 'hooks/useSelection.ts', css: [], level: 'Utility', interaction: 'Utility',
    text: 'One selection model for every collection: lists, tile grids and table rows. useSelection holds which items are selected, in single mode (choosing one replaces the other) or multiple mode (toggle, extend a range from the anchor with Shift, add or remove with Ctrl or ⌘, select all). It also gives the counts that a select-all checkbox (checked, mixed) and a selection summary need.',
    aliases: ['useSelection', 'Selection model', 'Multi-select', 'Range selection', 'Select all'],
    use: ['A collection whose items people select to act on together (bulk actions)', 'Checkbox lists: behavior "toggle"; file-manager lists and grids: behavior "replace" with Shift and Ctrl or ⌘', 'The select-all checkbox from allSelected and someSelected (its mixed state)', 'The count in a selection summary, announced when a bulk change happens'],
    avoid: ['Selection that opens or navigates: opening is its own action (a title link, Enter, a double-click)', 'Selection shown by color alone: the selected treatment and a check (Use of color)', 'Clearing the selection when the list is sorted or filtered: keep it and say what is hidden'],
    related: ['single-selection', 'focusable', 'checkbox', 'interactive-list'],
    map: [m(SP, 'useMultipleSelectionState / Selection (React Aria)'), m(F, 'useSelection'), m(C, 'Selectable tile', 'Partial'), m(M, 'Selected state', 'Partial'), m(PO, 'Bulk actions selection', 'Partial')],
    examples: [
      ['Multiple with select all', function () { return box(280, h(MultiDemo)); }],
      ['Range and toggle (Shift, Ctrl or ⌘)', function () { return box(320, h(RangeDemo)); }]] };

  /* ── single selection ── */
  function SingleListDemo() {
    var keys = FOLDERS.map(keyOf), ref = React.useRef(null);
    var sel = P.useSelection({ items: keys, mode: 'single', defaultSelected: ['crosses'], disallowEmpty: true });
    var g = P.useFocusGroup(ref, { orientation: 'vertical' });
    return stack(
      h('div', Object.assign({ ref: ref, role: 'listbox', 'aria-label': 'Folder', className: 'plx-stack plx-stack--gap-xs' }, g.groupProps),
        FOLDERS.map(function (l) {
          var k = keyOf(l), on = sel.isSelected(k);
          return h('div', { key: k, role: 'option', tabIndex: -1, 'aria-selected': on, className: 'plx-state ds-state-specimen' + (on ? ' is-selected' : ''),
            onClick: function () { sel.select(k); }, onKeyDown: function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); sel.select(k); } } },
            h(P.Inline, { gap: 'sm' }, h(P.Icon, { name: on ? 'check' : 'folder', size: 'sm' }), h(P.Text, null, l)));
        })),
      h(P.Text, { 'aria-live': 'polite' }, 'Chosen: ', sel.selected[0] ? FOLDERS[keys.indexOf(sel.selected[0])] : 'none'));
  }
  function RadioDemo() {
    var v = H.use('png');
    return h(P.RadioGroup, { label: 'Format', value: v[0], onChange: v[1], options: [{ value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' }, { value: 'svg', label: 'SVG' }] });
  }
  var single = { id: 'single-selection', icon: 'check', sec: 'patterns', sub: 'Selection and organization', leaf: 'Single selection', title: 'Single selection',
    plenix: 'useSelection, RadioGroup, RadioTiles, Select', src: 'hooks/useSelection.ts', css: [], level: 'Pattern', interaction: 'Utility',
    text: 'Exactly one option from a set: choosing another replaces it. The control depends on the list: a RadioGroup for a short list people compare (RadioTiles when the options need a picture or a description); a Select or a Combobox for a long list or a tight space; for rich rows, a listbox whose selection is useSelection in single mode, reached with the arrow keys through useFocusGroup.',
    aliases: ['Radio selection', 'Exclusive choice', 'Single-select list', 'Choose one'],
    use: ['Up to 7 options to compare: RadioGroup (RadioTiles with previews)', '8 to about 15 options: Select; more than 15, or a list people search: Combobox', 'Rich rows (an icon, two lines): a listbox with useSelection({ mode: \'single\', disallowEmpty: true }) and useFocusGroup', 'A safe default chosen at first when one exists'],
    avoid: ['More than one choice: use checkboxes (Selectable, multiple mode)', 'An instant on or off setting: use a Switch', 'A single-selection list that also opens the item on the same click'],
    related: ['selectable', 'radio-group', 'radio-tiles', 'native-select'],
    map: [m(C, 'Radio button'), m(A, 'Radio'), m(M, 'Radio button'), m(F, 'Radio group'), m(PO, 'Choice list'), m(SP, 'Radio group')],
    examples: [
      ['A short list: RadioGroup', function () { return box(280, h(RadioDemo)); }],
      ['Rich rows: a single-selection listbox', function () { return box(280, h(SingleListDemo)); }]] };

  /* ── gestures ── */
  // a pad that takes one gesture and says what it saw; the visible control beside it does the same thing
  function Pad(props) {
    var ref = React.useRef(null), said = H.use(props.idle), armed = H.use(false);
    var g = P.useGesture(ref, props.options(said[1], armed[1]));
    return stack(
      h('div', { ref: ref, role: 'group', 'aria-label': props.label, className: 'ds-gesture-pad plx-gesture ' + (props.cls || '') + (armed[0] ? ' is-selected' : '') },
        h(P.Text, { variant: 'label' }, props.label), h(P.Text, { variant: 'secondary', 'aria-live': 'polite' }, said[0]), g.active ? caption('Tracking: ' + g.active) : null),
      props.alt ? h(P.Inline, { gap: 'sm' }, h(P.Button, { size: 'sm', onClick: function () { said[1](props.altSays); } }, props.alt), caption('The same action without the gesture')) : null);
  }
  var px = function (n) { return P.formatNumber(Math.round(n)) + ' px'; };
  var GESTURES = {
    swipe: function () { return h(Pad, { label: 'Swipe left or right', idle: 'Swipe across the pad', cls: 'plx-gesture--pan-x', alt: 'Archive', altSays: 'Archived (button)',
      options: function (say, arm) { return { axis: 'x', onPan: function (e) { arm(Math.abs(e.dx) >= P.gestureTokens(null).swipeDistance); }, onPanEnd: function () { arm(false); }, onSwipe: function (e) { say('Swiped ' + e.direction + ' (' + e.inline + '): archived'); } }; } }); },
    'long press': function () { return h(Pad, { label: 'Press and hold', idle: 'Hold a finger or the mouse still', alt: 'More actions', altSays: 'Menu opened (button)',
      options: function (say, arm) { return { onLongPress: function () { arm(true); say('Long press: the menu would open here'); }, onTap: function () { arm(false); say('Tap: too short for a long press'); } }; } }); },
    'pinch zoom': function () { return h(Pad, { label: 'Pinch with two fingers', idle: 'Scale 1×', cls: 'plx-gesture--pinch', alt: 'Zoom in', altSays: 'Zoomed in (button)',
      options: function (say) { return { onPinch: function (e) { say('Scale ' + P.formatNumber(Math.min(e.scale, e.maxScale), { decimals: 2 }) + '× (up to ' + e.maxScale + '×)'); } }; } }); },
    pan: function () { return h(Pad, { label: 'Drag anywhere', idle: 'Moved 0 px, 0 px',
      options: function (say, arm) { return { onPanStart: function () { arm(true); }, onPan: function (e) { say('Moved ' + px(e.dx) + ', ' + px(e.dy)); }, onPanEnd: function (e) { arm(false); say((e.canceled ? 'Canceled at ' : 'Dropped at ') + px(e.dx) + ', ' + px(e.dy)); } }; } }); },
    'pull to refresh': function () { return h(Pad, { label: 'Pull down', idle: 'Pull down to refresh', cls: 'plx-gesture--pan-y', alt: 'Refresh', altSays: 'Refreshed (button)',
      options: function (say, arm) { return { pull: true, onPull: function (e) { arm(e.ready); if (!e.released) say(e.ready ? 'Release to refresh' : 'Pull ' + P.formatPercent(e.progress)); }, onRefresh: function () { say('Refreshed'); } }; } }); },
    fling: function () { return h(Pad, { label: 'Throw quickly', idle: 'Flick across the pad', cls: 'plx-gesture--pan-x',
      options: function (say) { return { onPanEnd: function (e) { if (Math.hypot(e.vx, e.vy) < P.gestureTokens(null).flingVelocity) say('Too slow for a fling'); }, onFling: function (e) { say('Fling ' + e.direction + ': it would coast ' + px(Math.abs(Math.abs(e.vx) > Math.abs(e.vy) ? e.travelX : e.travelY))); } }; } }); }
  };
  var gesture = { id: 'gesture-interaction', icon: 'drag', sec: 'interaction', sub: 'Interaction foundations', leaf: 'Gesture interaction', title: 'Gesture interaction',
    plenix: 'useGesture, gestureTokens, flingDistance', src: 'hooks/useGesture.ts', css: ['system/gesture.css'], level: 'Utility', interaction: 'Utility',
    text: 'Touch, pen and mouse gestures from pointer events: tap, long press, pan, swipe, fling, pinch to zoom and pull to refresh. useGesture reports what the pointers do, with distances, times and rates from the gesture motion tokens; the component decides what moves. Every gesture is a shortcut: the same action is always a visible control.',
    aliases: ['useGesture', 'Touch gestures', 'Swipe', 'Long press', 'Pinch to zoom', 'Pull to refresh', 'Drag'],
    use: ['Platform gestures for the actions people expect: swipe to dismiss or archive, pinch to zoom an image, pull to refresh a list, long press for the item’s menu', 'A gesture as a shortcut for an action that also has a visible control with the same name', 'Set touch-action on the element with system/gesture.css (plx-gesture, --pan-x, --pan-y, --pinch)'],
    avoid: ['An action reachable only by a gesture (WCAG 2.2, 2.5.1 and 2.5.7)', 'Gestures that fight the browser or the system: edge swipes, three-finger gestures', 'Committing on pointer down: a gesture commits on release, so moving back cancels it', 'Distances or delays written in code: use the gesture motion tokens'],
    related: ['gesture-motion', 'device-behavior', 'pressable', 'sheet'],
    map: [m(M, 'Gestures'), m(SP, 'usePress, useMove (React Aria)', 'Partial'), m(F, 'Touch and gestures (iOS, Android)', 'Partial')],
    examples: [['Gesture', Object.keys(GESTURES).map(function (k) { return [H.cap(k), function () { return box(360, GESTURES[k]()); }]; })]] };

  /* ── gesture motion ── */
  var TOKENS = [['slop', 'Slop', 'How far a press may move before it becomes a pan'], ['swipe-distance', 'Swipe distance', 'The distance that commits a slow swipe'],
    ['fling-velocity', 'Fling velocity', 'The release speed of a fling (px per ms)'], ['fling-decay', 'Fling decay', 'Speed kept each millisecond while coasting'],
    ['long-press-delay', 'Long-press delay', 'Held still this long: a long press'], ['pull-distance', 'Pull distance', 'The pull at which releasing refreshes'],
    ['pull-resistance', 'Pull resistance', 'The share of the movement a pull follows'], ['pinch-max-scale', 'Pinch maximum scale', 'The largest pinch scale'],
    ['settle-duration', 'Settle duration', 'The settle after release'], ['settle-easing', 'Settle easing', 'Leaves at the finger’s speed, decelerates into place']];
  function TokenTable() {
    var cs = getComputedStyle(document.documentElement);
    var rows = TOKENS.map(function (t, i) { return { id: i + 1, name: t[1], token: '--plx-sys-gesture-' + t[0], value: cs.getPropertyValue('--plx-sys-gesture-' + t[0]).trim() || '—', use: t[2] }; });
    return h(P.Table, { label: 'Gesture motion tokens', data: rows, columns: [
      { title: 'Role', field: 'name', kind: 'name', rowLabel: true, width: '--plx-ref-size-160px' }, { title: 'Token', field: 'token', kind: 'data' },
      { title: 'Value', field: 'value', kind: 'data', width: '--plx-ref-size-200px' }, { title: 'Use', field: 'use', kind: 'wrap' }] });
  }
  function SettleDemo() {
    var on = H.use(false);
    return stack(
      h('div', { className: 'ds-gesture-track' }, h('div', { className: 'ds-gesture-puck plx-gesture-settle' + (on[0] ? ' is-selected' : ''), 'aria-hidden': true })),
      h(P.Inline, { gap: 'sm' }, h(P.Button, { size: 'sm', onClick: function () { on[1](!on[0]); } }, on[0] ? 'Spring back' : 'Settle at the end'),
        caption('.plx-gesture-settle: --plx-sys-gesture-settle-duration, -easing')));
  }
  var gestureMotion = { id: 'gesture-motion', icon: 'move', sec: 'foundations', sub: 'Motion', leaf: 'Gesture motion', title: 'Gesture motion',
    plenix: 'gestureTokens, flingDistance, .plx-gesture-settle', src: 'hooks/useGesture.ts', css: ['system/gesture.css'], level: 'Foundation', interaction: 'Static',
    text: 'The movement that follows direct manipulation. While a finger or the pointer holds an element, the element follows it one to one; on release it settles where it lands or springs back, over the settle duration with an ease-out and no overshoot. A fling coasts on the decay rate. The thresholds that turn movement into a gesture (slop, swipe distance, fling velocity, long-press delay, pull distance) are tokens in tokens/semantic/motion-gesture.tokens.json; useGesture reads them when a gesture starts.',
    aliases: ['Direct manipulation motion', 'Drag motion', 'Fling', 'Settle', 'Spring back'],
    use: ['Following the finger one to one while it moves, with no easing or delay', 'The settle (.plx-gesture-settle) when the finger lifts: to where the gesture commits, or back to where it started', 'flingDistance(velocity, decay) for how far a flung list or sheet coasts', 'The commit point shown before release (the pad or the drop target takes the selected treatment)'],
    avoid: ['Bounce or overshoot in work areas', 'An animation while the finger is down: it lags the finger', 'A settle when people ask for reduced motion (system/motion.css sets every duration to 0)', 'A threshold or a rate in a component’s code: read gestureTokens()'],
    related: ['gesture-interaction', 'motion', 'device-behavior'],
    map: [m(M, 'Gestures (motion)'), m(F, 'Motion (direct manipulation)', 'Partial'), m(SP, 'Motion', 'Partial'), m(A, 'Drag and drop (motion)', 'Partial')],
    examples: [
      ['The gesture motion tokens, in this context', function () { return box(null, h(TokenTable)); }],
      ['Settle and spring back', function () { return box(360, h(SettleDemo)); }],
      ['Fling distance in code', function () {
        var t = P.gestureTokens(null);
        return stack(h(P.Text, { as: 'p' }, 'flingDistance(1, gestureTokens().flingDecay) = ', data(P.formatNumber(Math.round(P.flingDistance(1, t.flingDecay))) + ' px')),
          caption('Released at 1 px per ms, it coasts this far before it stops.'));
      }]] };

  /* ── read-only state ── */
  var RO = {
    'Region read-only': function () {
      return h(P.ReadOnly, { reason: 'Set by your administrator' }, h(P.Stack, { gap: 'sm' },
        h(P.Field, { label: 'Library name' }, h(P.Input, { defaultValue: 'Liturgical art' })),
        h(P.Checkbox, { label: 'Show on the home page', defaultChecked: true }),
        h(P.Switch, { label: 'Allow downloads', defaultChecked: true }),
        h(P.Button, { size: 'sm', icon: 'ed-copy' }, 'Copy link')));
    },
    'Form read-only': function () {
      var on = H.use(true);
      return h(P.Stack, { gap: 'sm' },
        h(P.Switch, { label: 'Locked after approval', checked: on[0], onChange: function (e) { on[1](e.target.checked); } }),
        h(P.ReadOnly, { as: 'form', readOnly: on[0], 'aria-label': 'Asset details', onSubmit: function (e) { e.preventDefault(); } }, h(P.Stack, { gap: 'sm' },
          h(P.Field, { label: 'Title' }, h(P.Input, { defaultValue: 'Cross 014' })),
          h(P.Field, { label: 'Description' }, h(P.Textarea, { defaultValue: 'Traditional cross, gold border.' })),
          h(P.RadioGroup, { label: 'License', value: 'internal', onChange: function () {}, options: [{ value: 'internal', label: 'Internal' }, { value: 'public', label: 'Public' }] }))));
    },
    'Field read-only': function () {
      return h(P.Field, { label: 'Asset ID', description: 'Assigned when the file was uploaded' }, h(P.Input, { defaultValue: 'AST-2026-00148', readOnly: true }));
    }
  };
  var readOnly = { id: 'read-only-state', icon: 'lock', sec: 'feedback', sub: 'Empty, failure, and recovery', leaf: 'Read-only state', title: 'Read-only state',
    plenix: 'ReadOnly, ReadOnlyProvider, useReadOnly', src: 'providers/ReadOnly.tsx', css: ['system/read-only.css'], level: 'Foundation', interaction: 'Static',
    text: 'A value people can read, select and copy but not change. One field is read-only with its own readOnly prop. A whole region or form is <ReadOnly>: its text fields become readOnly; its checkboxes, switches, radios, selects and sliders keep their value and their focus but do not change; a form inside does not submit; and an optional reason with the lock icon says why. data-plx-readonly="true" draws its controls with the read-only roles (system/read-only.css): the sunken surface, a quiet border and full content contrast.',
    aliases: ['Read only', 'View only', 'Locked', 'Non-editable'],
    use: ['A value set by the system or by someone with more permission (an ID, a field an administrator controls)', 'A record or a form people may view but not edit, or that is locked after a step (approved, submitted)', 'A short reason when it helps (“Set by your administrator”)', 'useReadOnly(props.readOnly) in a component that draws its own read-only state'],
    avoid: ['Read-only for a control that will be available after another step: that is disabled', 'Dimming the value: read-only keeps full contrast (4.5:1) and stays in the Tab order', 'Disabled Save and Delete buttons in a read-only region: hide the actions that would change it', 'A border that makes the field look editable'],
    related: ['text-field', 'field', 'feedback-disabled-state', 'interaction-states'],
    map: [m(C, 'Read-only states'), m(SP, 'Read-only (field)', 'Partial'), m(F, 'Read-only (input)', 'Partial'), m(A, 'Read-only (inline edit)', 'Partial')],
    examples: [['Scope', Object.keys(RO).map(function (k) { return [k.replace(' read-only', ''), function () { return box(360, RO[k]()); }]; })]] };

  /* ── semantic html ── */
  var semantic = { id: 'semantic-html', icon: 'doc-text', sec: 'interaction', sub: 'Accessibility', leaf: 'Semantic HTML', title: 'Semantic HTML',
    plenix: 'check-system rule semantic-html', src: '../check-system.rules/semantic-html.js', css: [], level: 'Foundation', interaction: 'Static',
    text: 'Native elements first, ARIA second. An action is a button, a destination is a link, a field is a form element, a page has landmarks (banner, navigation, main) and headings in order, a list is a list, and a table is a DataGrid (sort, filter, group, search) or a Table (static). Platform components render the right element; the system check’s rule semantic-html (check-system.rules/semantic-html.js) rejects a click handler on an element with no meaning (div, span, p, li, td, section, article, img, i) that has no role, and an anchor that acts with no href; its rule links-not-buttons (check-system.rules/links-not-buttons.js) rejects a button styled as a link (a link goes somewhere, a button does something), a link with no href, a link whose click prevents navigation to run an action and a link built from Text instead of Link. tests/semantic-html.test.js reads the rendered application pages: one banner, one main region, named navigation regions, at most one level 1 heading and no skipped heading level.',
    aliases: ['Native HTML', 'First rule of ARIA', 'Landmarks', 'WCAG 1.3.1', 'WCAG 4.1.2'],
    use: ['Button for an action, a link (href) for a destination; a destination that should look like a button is a Button with href', 'AppShell’s landmarks (header, nav, main) and one level 1 heading per page, then sections in order', 'List for a list of statements; DataGrid or Table for rows of fields', 'A role (with its keys and tabIndex) only for a widget HTML has no element for: an option, a tab, a tree item'],
    avoid: ['A div or a span with a click handler: use Button or RowButton (the rule rejects it)', 'An anchor with no href that acts: use a button', 'A button styled as a link: a quiet action is a ghost or tertiary Button (the rule links-not-buttons rejects it)', 'A role that repeats or contradicts the element (role="button" on a button)', 'Headings picked for their size: the level follows the outline'],
    related: ['accessible-descriptions', 'use-of-color', 'pressable', 'focusable'],
    map: [m(A, 'Primitives (Box as)', 'Partial'), m(PO, 'Accessibility', 'Partial'), m(C, 'Accessibility for developers', 'Partial'), m(SP, 'Accessibility', 'Partial')],
    examples: [
      ['Buttons and links', function () { return row(h(P.Button, { size: 'sm', icon: 'archive' }, 'Archive'), h(P.Button, { size: 'sm', variant: 'secondary', href: '#/interaction/semantic-html' }, 'Open the guide'), h(P.Link, { href: '#/interaction/semantic-html' }, 'Read the rule')); }],
      ['Lists and tables', function () {
        return stack(h(P.List, { label: 'Before you publish', items: [{ icon: 'circle-check', tone: 'success', children: 'The title names the asset' }, { icon: 'circle-check', tone: 'success', children: 'The license is set' }] }),
          h(P.Table, { label: 'Elements by meaning', data: [{ id: 1, meaning: 'An action', element: 'button (Button, RowButton)' }, { id: 2, meaning: 'A destination', element: 'a href (link, Button with href)' }, { id: 3, meaning: 'Rows of fields', element: 'DataGrid, Table' }],
            columns: [{ title: 'Meaning', field: 'meaning', kind: 'name', rowLabel: true }, { title: 'Element', field: 'element', kind: 'data' }] }));
      }],
      ['What the rule rejects', function () {
        return h(P.CodeBlock, null, '<div onClick={open}>Cross 014</div>          // rejected: <RowButton onClick={open}>Cross 014</RowButton>\n<a onClick={save}>Save</a>                    // rejected: <Button onClick={save}>Save</Button>\n<div role="option" tabIndex={-1} aria-selected={on} onClick={pick}>…</div>   // a widget with its role: accepted');   // plx-allow-semantic plx-allow-links: the samples the rules reject
      }]] };

  return [pressable, focusable, selectable, single, gesture, gestureMotion, readOnly, semantic];
});
