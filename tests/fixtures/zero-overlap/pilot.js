/* Plenix tests · the zero-overlap pilot's page (pilot.html). Every element inside a [data-pilot-scope] section is
   audited by tests/zero-overlap.test.js; data-force names the pseudo-classes the test forces on an element. When the
   page has rendered, <body data-pilot-ready="true">. */
(function () {
  const h = React.createElement, P = window.Plenix;
  const q = new URLSearchParams(location.search);
  // the density through the workspace runtime (theme-boot.js owns the attribute), set on every load: the choice is saved
  if (window.PlenixWorkspace) window.PlenixWorkspace.setDensity(q.get('density') || 'standard');
  const VARIANTS = ['secondary', 'primary', 'ghost', 'danger', 'tertiary', 'danger-secondary'];
  // a state: the props and the forced pseudo-classes; combinations included (3.3: the assignment is exclusive, the states are not)
  const STATES = [
    ['rest', {}],
    ['hover', { 'data-force': 'hover' }],
    ['pressed', { 'data-force': 'hover active' }],
    ['focus', { 'data-force': 'focus focus-visible' }],
    ['hover+focus', { 'data-force': 'hover focus focus-visible' }],
    ['selected', { selected: true }],
    ['selected+hover', { selected: true, 'data-force': 'hover' }],
    ['selected+pressed', { selected: true, 'data-force': 'hover active' }],
    ['toggle on', { pressed: true, icon: 'star' }],
    ['disabled', { disabled: true }],
    ['disabled+hover', { disabled: true, 'data-force': 'hover' }],
    ['disabled+selected', { disabled: true, selected: true }],
    ['loading', { loading: true }],
    ['loading+focus', { loading: true, 'data-force': 'focus focus-visible' }],
    ['caret open', { caret: true, expanded: true }],
  ];
  const section = (name, ...kids) => h('section', { 'data-pilot-scope': name }, h('h2', null, name), ...kids);
  const row = (...kids) => h('div', null, ...kids);
  const btn = (key, props, label) => h(P.Button, Object.assign({ key }, props), label);

  const buttons = section('Button',
    ...VARIANTS.map((v) => row(...STATES.map(([s, p]) => btn(v + s, Object.assign({ variant: v, icon: s === 'toggle on' ? 'star' : 'add' }, p), v + ' ' + s)))),
    row(...['2xs', 'xs', 'sm', 'md', 'lg'].map((z) => btn('size' + z, { size: z }, 'size ' + z)), ...['2xs', 'xs', 'sm', 'md', 'lg'].map((z) => btn('sizeh' + z, { size: z, 'data-force': 'hover' }, 'size ' + z + ' hover'))),
    row(btn('io', { iconOnly: true, icon: 'more_horiz', label: 'More' }), btn('io-h', { iconOnly: true, icon: 'more_horiz', label: 'More', 'data-force': 'hover' }),
      btn('tr', { truncate: true }, 'A truncated label that goes on and on'), btn('st', { stackedLabel: true }, 'Stacked'), btn('lr', { labelRow: true }, 'Label row'),
      btn('js', { joined: { end: 'square' } }, 'Joined start'), btn('je', { joined: { start: 'seam' } }, 'Joined end'), btn('jf', { joined: { start: 'seam' }, 'data-force': 'focus focus-visible' }, 'Joined focused')),
    // raw markup: a native disabled button and one marked aria-disabled, without the component's script
    row(h('button', { key: 'nd', className: 'plx-button', disabled: true }, 'native disabled'), h('button', { key: 'ad', className: 'plx-button plx-button--ghost', 'aria-disabled': 'true', 'data-force': 'hover' }, 'aria-disabled hover')),
    // surfaces: a colored surface holding buttons (SurfaceContext; the attribute only labels the audit's report)
    ...['inverse', 'accent'].map((surface) => h(P.SurfaceContext ? P.SurfaceContext.Provider : React.Fragment, P.SurfaceContext ? { key: surface, value: surface } : { key: surface }, h('div', { 'data-plx-surface': surface },
      ...['primary', 'secondary', 'ghost'].flatMap((v) => [['rest', {}], ['hover', { 'data-force': 'hover' }], ['pressed', { 'data-force': 'hover active' }], ['focus', { 'data-force': 'focus focus-visible' }]].map(([s, p]) => btn(surface + v + s, Object.assign({ variant: v }, p), surface + ' ' + v + ' ' + s)))))),
    // a nested instance: a button inside a hovered, selected primary button's box (a span, so the markup stays valid)
    h('span', { className: 'plx-button plx-button--primary is-selected', 'data-force': 'hover' }, 'outer ', btn('nested', { variant: 'ghost' }, 'nested ghost')));

  const field = (key, props) => h(P.Input, Object.assign({ key, 'aria-label': key, defaultValue: 'Value' }, props));
  const inputs = section('Input',
    row(field('rest', {}), field('hover', { 'data-force': 'hover' }), field('focus', { 'data-force': 'focus focus-visible' }),
      field('invalid', { invalid: true }), field('invalid+hover', { invalid: true, 'data-force': 'hover' }), field('invalid+focus', { invalid: true, 'data-force': 'focus focus-visible' }),
      field('disabled', { disabled: true }), field('disabled+hover', { disabled: true, 'data-force': 'hover' }), field('readonly', { readOnly: true }), field('readonly+focus', { readOnly: true, 'data-force': 'focus' })),
    row(field('filled', { appearance: 'filled' }), field('filled+hover', { appearance: 'filled', 'data-force': 'hover' }), field('filled+invalid', { appearance: 'filled', invalid: true }), field('filled+invalid+focus', { appearance: 'filled', invalid: true, 'data-force': 'focus' }),
      field('width sm', { width: 'sm' }), field('width fill', { width: 'fill' }), field('size sm', { size: 'sm' }), field('data', { data: true }), field('emphasis', { emphasis: true }), field('color', { type: 'color', defaultValue: '#336699' }), field('color focus', { type: 'color', defaultValue: '#336699', 'data-force': 'focus focus-visible' }), field('placeholder', { defaultValue: '', placeholder: 'Placeholder' })),
    row(h(P.Textarea, { key: 'ta', 'aria-label': 'ta', defaultValue: 'Text' }), h(P.Textarea, { key: 'tf', 'aria-label': 'tf', 'data-force': 'focus' }), h(P.Textarea, { key: 'ti', 'aria-label': 'ti', invalid: true }), h(P.Textarea, { key: 'tg', 'aria-label': 'tg', autoGrow: true })));

  const nav = section('NavList',
    h(P.NavList, { label: 'Pilot', value: 'inbox', onSelect: () => {}, items: [
      { id: 'inbox', label: 'Inbox', icon: 'inbox' },
      { id: 'folder', label: 'Folder', icon: 'folder' },
      { id: 'muted', label: 'Muted', icon: 'folder', muted: true },
      { id: 'pinned', label: 'Pinned', icon: 'star', onPin: () => {}, pinned: true },
      { id: 'group', label: 'Group', icon: 'folder', defaultExpanded: true, children: [{ id: 'child', label: 'Child', icon: 'description' }] },
    ] }),
    // Icons alone: their own fill and size, and inside a current, a selected and a pressed element (outline there:
    // nothing fills an icon from an ancestor, owner 2026-10-20)
    row(h(P.Icon, { name: 'star' }), h(P.Icon, { name: 'star', filled: true }), h(P.Icon, { name: 'star', filled: false }), h(P.Icon, { name: 'star', size: 'lg' }), h(P.Icon, { name: 'star', size: 'lg', filled: true }), h(P.Icon, { name: 'star', size: 'xl' }),
      h('span', { 'aria-current': 'page' }, h(P.Icon, { name: 'star' })), h('span', { className: 'is-selected' }, h(P.Icon, { name: 'star' })), h('span', { 'aria-pressed': 'true' }, h(P.Icon, { name: 'star', filled: false })),
      h('span', { 'data-plx-icon-optical': '24' }, h(P.Icon, { name: 'star' }), h(P.Icon, { name: 'star', filled: true }))));

  const anchor = (label) => h(P.Button, null, label);
  const pop = section('Floating',
    row(...[['bottom-start', false], ['top', false], ['bottom', true], ['top-start', true]].map(([placement, arrow]) =>
      h(P.Popover, { key: placement + arrow, trigger: anchor(placement + (arrow ? ' arrow' : '')), triggerOn: 'manual', open: true, onOpenChange: () => {}, placement, arrow, focusOnOpen: false, title: placement }, h('p', null, 'Popover ' + placement)))));

  // the compact person card (issue 1240): its root must not carry a second layout class that sets the same properties
  const personTile = section('MetricCard person tile', h('div', { style: { inlineSize: 280 } }, h(P.MetricCard, { type: 'person', layout: 'tile', person: { name: 'Fr. Example Name', role: 'Council member' }, value: '5', unit: 'active' })));

  function App() {
    React.useEffect(() => {
      // a hovered, not current NavList row and its pin (the generated rows take the forced state after render)
      const items = document.querySelectorAll('.plx-nav-list__item');
      if (items[1]) items[1].setAttribute('data-force', 'hover');
      const t = setTimeout(() => document.body.setAttribute('data-pilot-ready', 'true'), 300);
      return () => clearTimeout(t);
    }, []);
    return h('div', null, buttons, inputs, nav, pop, personTile);
  }
  ReactDOM.createRoot(document.getElementById('pilot')).render(h(App));
})();
