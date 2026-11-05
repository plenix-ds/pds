/* global DS */
/* Plenix master spec · the navigation labs (Every Variant, batch 318): Tabs, Application header, Navigation rail, Product
   switcher and Action menu, each style, tone, label mode, name and placement with the one --plx-comp-* token that sets
   each value (tokenize-component.js; the header's tones and its own sizes as tokens: tone-tokens.js, local-to-tokens.js). */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var STATIC = [['default', 'Default']];
  var TB = function (n) { return 'plx-comp-tabs-' + n; }, AH = function (n) { return 'plx-comp-app-header-' + n; },
    TR = function (n) { return 'plx-comp-tool-rail-' + n; }, MN = function (n) { return 'plx-comp-menu-' + n; };
  var ICON = function (name, cls) { return DS.icon(name, cls); };
  var st = function (state) { return state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : state === 'pressed' ? ' is-pressed' : ''; };

  // ---- Tabs (<Tabs>): contained, folder, segmented
  DS.registerLab('tabs', {
    name: 'Tabs', title: 'Plenix tabs', file: 'platform/components/Tabs/tabs.css', compPrefix: /^plx-comp-tabs-/,
    store: 'plenix-tabs-lab-tokens', sizes: [['default', 'Default', '.plx-tabs']],
    variants: [['contained', 'Contained'], ['folder', 'Folder'], ['segmented', 'Segmented']],
    states: [['default', 'Default'], ['hover', 'Hover (the second tab)']],
    content: [['text', 'Labels'], ['icon', 'Icons and labels']],
    labels: { size: 'Size', variant: 'Style', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'contained', state: 'default', content: 'text' },
    props: [
      { id: 'lgap', label: 'Gap between tabs', css: ['column-gap'], part: '.plx-tabs__list', cat: 'space' },
      { id: 'lbg', label: 'Tab border color (segmented)', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-top-color', part: '.plx-tabs__tab', cat: 'color' },
      { id: 'lrad', label: 'Outer corner radius (segmented)', css: ['border-top-left-radius', 'border-bottom-left-radius'], show: 'border-top-left-radius', part: '.plx-tabs__tab', cat: 'radius' },
      { id: 'th', label: 'Tab height', css: ['min-block-size'], show: 'min-height', part: '.plx-tabs__tab', cat: 'control-height' },
      { id: 'tpx', label: 'Tab padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-tabs__tab', cat: 'space' },
      { id: 'tfs', label: 'Tab font size', css: ['font-size'], part: '.plx-tabs__tab', cat: 'font-size' },
      { id: 'sbg', label: 'Open tab background', css: ['background-color'], part: '.plx-tabs__tab.is-selected', cat: 'color' },
      { id: 'sfg', label: 'Open tab text color', css: ['color'], part: '.plx-tabs__tab.is-selected', cat: 'color' },
      { id: 'sfw', label: 'Open tab font weight', css: ['font-weight'], part: '.plx-tabs__tab.is-selected', cat: 'font-weight' },
      { id: 'ofg', label: 'Other tab text color', css: ['color'], part: '.plx-tabs__tab:not(.is-selected)', cat: 'color' },
      { id: 'pbg', label: 'Panel background (contained)', css: ['background-color'], part: '.plx-tabs__panel', cat: 'color' },
      { id: 'pbc', label: 'Panel border color (contained)', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-bottom-color', part: '.plx-tabs__panel', cat: 'color' },
      { id: 'prad', label: 'Panel corner radius (contained)', css: ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-right-radius'], show: 'border-bottom-left-radius', part: '.plx-tabs__panel', cat: 'radius' },
      { id: 'ppx', label: 'Panel padding left & right (contained)', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-tabs__panel', cat: 'space' }
    ],
    token: function (id, size, variant, state) {
      var seg = variant === 'segmented', con = variant === 'contained';
      switch (id) {
        case 'lgap': return seg ? TB('segmented-list-gap') : TB('folder-list-gap');
        case 'lbg': return seg ? TB('segmented-tab-border-color') : null;
        case 'lrad': return seg ? TB('segmented-tab-radius') : null;
        case 'th': return seg ? TB('segmented-tab-min-height') : TB('folder-tab-min-height');
        case 'tpx': return seg ? TB('segmented-tab-padding-inline') : TB('folder-tab-padding-inline');
        case 'tfs': return seg ? TB('segmented-tab-font-size') : TB('folder-tab-font-size');
        case 'sbg': return seg ? TB('segmented-tab-selected-background') : TB('folder-tab-selected-background');
        case 'sfg': return seg ? TB('segmented-tab-selected-text') : TB('folder-tab-selected-text');
        case 'sfw': return seg ? TB('segmented-tab-font-weight') : TB('folder-tab-selected-font-weight');
        case 'ofg': return state === 'hover' ? (seg ? TB('segmented-tab-hover-text') : TB('folder-tab-hover-text')) : (seg ? TB('segmented-tab-text') : TB('folder-tab-text'));
        case 'pbg': return con ? TB('contained-panel-background') : null;
        case 'pbc': return con ? TB('contained-panel-border-color') : null;
        case 'prad': return con ? TB('contained-panel-radius') : null;
        case 'ppx': return con ? TB('contained-panel-padding-inline') : null;
        default: return null;
      }
    },
    reach: function (full) { return /tabs-segmented-/.test(full) ? 'every segmented tab strip' : /tabs-contained-/.test(full) ? 'every contained tab panel' : /tabs-folder-/.test(full) ? 'every folder and contained tab strip' : 'every tab strip'; },
    every: 'every tab strip',
    html: function (variant, size, state, extraCls, ui) {
      var icons = ui && ui.content === 'icon';
      // the classes Tabs renders (Tabs.jsx): every part carries its kind; segmented tabs carry their edge
      var seg = variant === 'segmented';
      var tab = function (label, icon, on, s, edge) { return '<button type="button" role="tab" tabindex="-1" aria-selected="' + on + '" class="plx-tabs__tab plx-tabs__tab--' + variant + (on ? ' is-selected' : '') + (seg ? ' ' + edge : '') + s + '">' + (icons ? '<span class="plx-tabs__icon">' + ICON(icon) + '</span>' : '') + '<span class="plx-tabs__label">' + label + '</span></button>'; };
      return '<div class="plx-tabs plx-tabs--' + variant + (extraCls ? ' ' + extraCls : '') + '"><div class="plx-tabs__list plx-tabs__list--' + variant + '"><div role="tablist" aria-label="Asset views" class="plx-tabs__tablist plx-tabs__tablist--' + variant + '">'
        + tab('Details', 'circle-info', true, '', 'plx-tabs__tab--first') + tab('Activity', 'clock', false, st(state), 'plx-tabs__tab--joined') + tab('Versions', 'ed-copy', false, '', 'plx-tabs__tab--joined plx-tabs__tab--last')
        + '</div></div><div role="tabpanel" class="plx-tabs__panel plx-tabs__panel--' + variant + (variant === 'contained' ? ' plx-tabs__panel--corner' : '') + '">The asset’s details.</div></div>';
    },
    labelSelector: '.plx-tabs__tab.is-selected',
    parts: { lgap: 'A', lbg: 'A', lrad: 'A', th: 'B', tpx: 'B', tfs: 'B', sbg: 'B', sfg: 'B', sfw: 'B', ofg: 'C', pbg: 'D', pbc: 'D', prad: 'D', ppx: 'D' },
    anchors: { A: { part: '.plx-tabs__list', side: 'top' }, B: { part: '.plx-tabs__tab.is-selected', side: 'left' }, C: { part: '.plx-tabs__tab:not(.is-selected)', side: 'top' }, D: { part: '.plx-tabs__panel', side: 'bottom' } },
    sections: [['Tab strip', ['lgap', 'lbg', 'lrad']], ['Open tab', ['th', 'tpx', 'tfs', 'sbg', 'sfg', 'sfw']], ['Other tabs', ['ofg']], ['Panel', ['pbg', 'pbc', 'prad', 'ppx']]],
    matrixLabel: 'Tab values by style and state',
    statesHead: 'Styles and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Application header (<AppHeader>): accent, frost, plain
  var headerHtml = function (tone, inner, extraCls) { return '<header' + (tone === 'accent' ? ' data-plx-surface="accent"' : '') + ' class="plx-app-header plx-app-header--' + tone + (extraCls ? ' ' + extraCls : '') + '">' + inner + '</header>'; };
  var NAME = '<span class="plx-app-header__name"><span class="plx-app-header__product">Plenix</span><span class="plx-app-header__app">Notes</span></span>';
  DS.registerLab('application-header', {
    name: 'Application header', title: 'Plenix application header', file: 'platform/patterns/AppHeader/app-header.css', compPrefix: /^plx-comp-app-header-/,
    store: 'plenix-application-header-lab-tokens', sizes: [['default', 'Default', '.plx-app-header']],
    variants: [['accent', 'Accent'], ['frost', 'Frost'], ['plain', 'Plain']],
    states: [['default', 'Default'], ['hover', 'Hover (the search item)']],
    content: [['default', 'Brand and two utilities']],
    labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'accent', state: 'default', content: 'default' },
    props: [
      { id: 'bg', label: 'Surface', css: ['background-color'], cat: 'color' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
      { id: 'gap', label: 'Gap between areas', css: ['column-gap'], cat: 'space' },
      { id: 'mark', label: 'Brand mark color', css: ['color'], part: '.plx-brand-mark', cat: 'color' },
      { id: 'afs', label: 'Application name font size', css: ['font-size'], part: '.plx-app-header__app', cat: 'font-size' },
      { id: 'ifg', label: 'Utility icon color', css: ['color'], part: '.plx-app-header__item', cat: 'color' },
      { id: 'isz', label: 'Utility item size', css: ['block-size'], show: 'height', part: '.plx-app-header__item', cat: 'size' },
      { id: 'irad', label: 'Utility item corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-app-header__item', cat: 'radius' },
      { id: 'ihv', label: 'Utility item hover background', css: ['background-color'], part: '.plx-app-header__item', cat: 'color' }
    ],
    token: function (id, size, variant, state) {
      switch (id) {
        case 'bg': return AH(variant + '-surface');
        case 'h': return AH('height');
        case 'px': return AH('padding-inline');
        case 'gap': return AH('gap');
        case 'mark': return AH(variant + '-brand');
        case 'afs': return AH('app-font-size');
        case 'ifg': return AH(variant + '-content');
        case 'isz': return AH('item-size');
        case 'irad': return AH('item-radius');
        case 'ihv': return state === 'hover' ? AH(variant + '-hover') : null;
        default: return null;
      }
    },
    reach: function (full) { var m = /app-header-(accent|frost|plain)-/.exec(full); return m ? 'every ' + m[1] + ' header' : 'every application header'; },
    every: 'every application header',
    html: function (variant, size, state, extraCls) {
      return headerHtml(variant, '<div class="plx-app-header__start"><span class="plx-app-header__brand">' + '<span aria-hidden="true" class="plx-brand-mark"></span>' + NAME + '</span></div>'
        + '<div class="plx-app-header__end"><div class="plx-app-header__utilities"><button type="button" tabindex="-1" class="plx-app-header__item' + st(state) + '" aria-label="Search">' + ICON('search', 'plx-icon--size-lg') + '</button>'
        + '<button type="button" tabindex="-1" class="plx-app-header__item" aria-label="Notifications">' + ICON('hdr-bell', 'plx-icon--size-lg') + '</button></div></div>', extraCls);
    },
    labelSelector: '.plx-app-header__app',
    parts: { bg: 'A', h: 'A', px: 'A', gap: 'A', mark: 'B', afs: 'B', ifg: 'C', isz: 'C', irad: 'C', ihv: 'C', icon: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-app-header__brand', side: 'bottom' }, C: { part: '.plx-app-header__item', side: 'bottom' } },
    sections: [['Bar', ['bg', 'h', 'px', 'gap']], ['Brand', ['mark', 'afs']], ['Utilities', ['ifg', 'isz', 'irad', 'ihv', 'icon']]],
    matrixLabel: 'Application header values by tone', matrixColumnWidth: '--plx-ref-size-400px',
    statesHead: 'Tones and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Product switcher (the header's application name, AppSwitcher): the name, or a brand mark before it
  DS.registerLab('product-switcher', {
    name: 'Product switcher', title: 'Plenix product switcher', file: 'platform/patterns/AppHeader/app-header.css', compPrefix: /^plx-comp-app-(header|switcher)-/,
    store: 'plenix-product-switcher-lab-tokens', sizes: [['default', 'Default', '.plx-app-header__brand--switch']],
    variants: [['name', 'The application name'], ['brand', 'A brand mark before the name']], states: STATIC,
    content: [['default', 'Plenix · Notes']],
    labels: { size: 'Size', variant: 'Name', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'brand', state: 'default', content: 'default' },
    props: [
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
      { id: 'gap', label: 'Gap (name, chevron)', css: ['column-gap'], cat: 'space' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
      { id: 'plh', label: 'Product line height', css: ['line-height'], part: '.plx-app-header__product', cat: 'line-height' },
      { id: 'afs', label: 'Application font size', css: ['font-size'], part: '.plx-app-header__app', cat: 'font-size' },
      { id: 'afw', label: 'Application font weight', css: ['font-weight'], part: '.plx-app-header__app', cat: 'font-weight' },
      { id: 'mark', label: 'Brand mark color', css: ['color'], part: '.plx-brand-mark', cat: 'color' },
      { id: 'chev', label: 'Chevron size', css: ['inline-size'], show: 'width', part: '.plx-app-header__switch-chevron', cat: 'icon' }
    ],
    token: function (id, size, variant) {
      switch (id) {
        case 'w': return AH('name-width');
        case 'gap': return AH('brand-gap');
        case 'rad': return AH('switch-radius');
        case 'plh': return AH('product-line-height');
        case 'afs': return AH('app-font-size');
        case 'afw': return AH('app-font-weight');
        case 'mark': return variant === 'brand' ? AH('accent-brand') : null;
        case 'chev': return AH('chevron-size');
        default: return null;
      }
    },
    reach: function () { return 'every application header’s switcher'; },
    every: 'every application header’s switcher',
    html: function (variant, size, state, extraCls) {
      return headerHtml('accent', '<div class="plx-app-header__start"><div class="plx-app-switcher' + (variant === 'brand' ? ' plx-app-switcher--brand' : '') + '">'
        + '<button type="button" tabindex="-1" class="plx-app-header__brand plx-app-header__brand--switch' + (extraCls ? ' ' + extraCls : '') + '" aria-haspopup="dialog" aria-expanded="false">'
        + (variant === 'brand' ? '<span aria-hidden="true" class="plx-brand-mark"></span>' : '') + NAME + ICON('chevron-down', 'plx-app-header__switch-chevron') + '</button></div></div>', '');
    },
    labelSelector: '.plx-app-header__app',
    parts: { w: 'A', gap: 'A', rad: 'A', plh: 'B', afs: 'B', afw: 'B', mark: 'C', chev: 'D' },
    anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-app-header__name', side: 'bottom' }, C: { part: '.plx-brand-mark', side: 'left' }, D: { part: '.plx-app-header__switch-chevron', side: 'right' } },
    sections: [['Switch', ['w', 'gap', 'rad']], ['Name', ['plh', 'afs', 'afw']], ['Brand mark', ['mark']], ['Chevron', ['chev']]],
    matrixLabel: 'Product switcher values by name',
    statesHead: 'Names · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Navigation rail (<ToolRail>): icons only, or labels under the icons
  DS.registerLab('navigation-rail', {
    name: 'Navigation rail', title: 'Plenix navigation rail', file: 'platform/patterns/ToolRail/tool-rail.css', compPrefix: /^plx-comp-tool-rail-/,
    store: 'plenix-navigation-rail-lab-tokens', sizes: [['default', 'Default', '.plx-tool-rail']],
    variants: [['icons', 'Icons only'], ['labels', 'With labels']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['pressed', 'Pressed (current)'], ['focus', 'Focus']],
    content: [['three', 'Three tools']],
    labels: { size: 'Size', variant: 'Labels', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'icons', state: 'pressed', content: 'three' },
    props: [
      { id: 'bg', label: 'Rail background', css: ['background-color'], cat: 'color' },
      { id: 'py', label: 'Rail padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
      { id: 'gap', label: 'Gap between tools', css: ['row-gap'], cat: 'space' },
      { id: 'ibg', label: 'Tool background', css: ['background-color'], part: '.plx-tool-rail__item', cat: 'color' },
      { id: 'ifg', label: 'Tool color', css: ['color'], part: '.plx-tool-rail__item', cat: 'color' },
      { id: 'iw', label: 'Tool width', css: ['inline-size'], show: 'width', part: '.plx-tool-rail__item', cat: 'size' },
      { id: 'ih', label: 'Tool height', css: ['block-size'], show: 'height', part: '.plx-tool-rail__item', cat: 'size' },
      { id: 'irad', label: 'Tool corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-tool-rail__item', cat: 'radius' },
      { id: 'lfs', label: 'Label font size', css: ['font-size'], part: '.plx-tool-rail__label', cat: 'font-size' }
    ],
    token: function (id, size, variant, state) {
      var lab = variant === 'labels';
      switch (id) {
        case 'bg': return TR('background');
        case 'py': return TR('padding-block');
        case 'gap': return TR('row-gap');
        case 'ibg': return state === 'hover' ? TR('item-hover-background') : state === 'pressed' ? TR('item-pressed-background') : null;
        case 'ifg': return state === 'hover' ? TR('item-hover-text') : state === 'pressed' ? TR('item-pressed-text') : TR('item-text');
        case 'iw': return lab ? TR('labels-item-width') : TR('item-width');
        case 'ih': return lab ? null : TR('item-height');
        case 'irad': return TR('item-radius');
        case 'lfs': return lab ? TR('label-font-size') : null;
        default: return null;
      }
    },
    reach: function (full) { return /labels-/.test(full) ? 'every labeled rail' : /item-(hover|pressed)-/.test(full) ? 'every rail tool in that state' : 'every navigation rail'; },
    every: 'every navigation rail',
    html: function (variant, size, state, extraCls) {
      var lab = variant === 'labels';
      var item = function (icon, label, s) { return '<button type="button" tabindex="-1" class="plx-tool-rail__item' + s + '"' + (lab ? '' : ' aria-label="' + label + '"') + (s === ' is-pressed' ? ' aria-pressed="true"' : '') + '>' + ICON(icon) + (lab ? '<span class="plx-tool-rail__label">' + label + '</span>' : '') + '</button>'; };
      return '<div role="toolbar" aria-orientation="vertical" aria-label="Tools" class="plx-tool-rail' + (lab ? ' plx-tool-rail--labels' : '') + (extraCls ? ' ' + extraCls : '') + '">'
        + item('home', 'Home', st(state)) + item('folder', 'Files', '') + item('grid-2x2', 'Categories', '') + '</div>';
    },
    labelSelector: null,
    parts: { bg: 'A', py: 'A', gap: 'A', ibg: 'B', ifg: 'B', iw: 'B', ih: 'B', irad: 'B', lfs: 'C' },
    anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-tool-rail__item', side: 'right' }, C: { part: '.plx-tool-rail__label', side: 'right' } },
    sections: [['Rail', ['bg', 'py', 'gap']], ['Tool', ['ibg', 'ifg', 'iw', 'ih', 'irad']], ['Label', ['lfs']]],
    matrixLabel: 'Navigation rail values by labels and state',
    statesHead: 'Labels and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Action menu (<Menu>): four placements (drawn open, in place, without the top layer)
  var PLACES = [['bottom-start', 'Bottom start'], ['bottom-end', 'Bottom end'], ['top-start', 'Top start'], ['top-end', 'Top end']];
  DS.registerLab('action-menu', {
    name: 'Action menu', title: 'Plenix action menu', file: 'platform/components/Menu/menu.css', compPrefix: /^plx-comp-menu-/,
    store: 'plenix-action-menu-lab-tokens', sizes: [['default', 'Default', '.plx-menu']],
    variants: PLACES, states: [['default', 'Default'], ['hover', 'Hover (the first item)']],
    content: [['items', 'Three items'], ['danger', 'With a danger item']],
    labels: { size: 'Size', variant: 'Placement', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'bottom-start', state: 'default', content: 'items' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'], show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
      { id: 'minw', label: 'Minimum width', css: ['min-inline-size'], show: 'min-width', cat: 'size' },
      { id: 'off', label: 'Distance from the trigger', css: ['inset-block-start'], show: 'top', cat: 'space' },
      { id: 'offt', label: 'Distance from the trigger', css: ['inset-block-end'], show: 'bottom', cat: 'space' },
      { id: 'ih', label: 'Item height', css: ['min-block-size'], show: 'min-height', part: '.plx-menu__item', cat: 'control-height' },
      { id: 'ipx', label: 'Item padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-menu__item', cat: 'space' },
      { id: 'ifs', label: 'Item font size', css: ['font-size'], part: '.plx-menu__item', cat: 'font-size' },
      { id: 'ifg', label: 'Item text color', css: ['color'], part: '.plx-menu__item', cat: 'color' },
      { id: 'ihv', label: 'Item hover background', css: ['background-color'], part: '.plx-menu__item', cat: 'color' },
      { id: 'dfg', label: 'Danger item color', css: ['color'], part: '.plx-menu__item--danger', cat: 'color' }
    ],
    token: function (id, size, variant, state, content) {
      var top = /^top/.test(variant);
      switch (id) {
        case 'bg': return MN('background');
        case 'bc': return MN('border-color');
        case 'bw': return MN('border-width');
        case 'rad': return MN('radius');
        case 'py': return MN('padding-block');
        case 'minw': return MN('min-width');
        case 'off': return top ? null : MN('fallback-' + variant + '-inset-block-start');
        case 'offt': return top ? MN('fallback-' + variant + '-inset-block-end') : null;
        case 'ih': return MN('item-min-height');
        case 'ipx': return MN('item-padding-inline');
        case 'ifs': return MN('item-font-size');
        case 'ifg': return MN('item-text');
        case 'ihv': return state === 'hover' ? MN('item-hover-background') : null;
        case 'dfg': return content === 'danger' ? MN('item-danger-text') : null;
        default: return null;
      }
    },
    reach: function (full) { var m = /menu-fallback-([a-z-]+)-inset/.exec(full); return m ? 'every menu placed ' + m[1].replace('-', ' ') : 'every menu'; },
    every: 'every menu',
    html: function (variant, size, state, extraCls, ui) {
      var danger = ui && ui.content === 'danger';
      var item = function (label, s, cls) { return '<button type="button" role="menuitem" tabindex="-1" class="plx-menu__item' + (cls || '') + s + '"><span class="plx-menu__label">' + label + '</span></button>'; };
      return '<div class="ds-menu-row ds-menu-row--' + variant + '"><span class="plx-menu-anchor"><button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--caret is-selected" aria-expanded="true">Actions</button>'
        + '<div role="menu" aria-label="Actions" class="plx-menu plx-menu--' + variant + (extraCls ? ' ' + extraCls : '') + '">'
        + item('Rename', st(state)) + item('Move to…', '') + (danger ? item('Delete', '', ' plx-menu__item--danger') : item('Download', '')) + '</div></span></div>';
    },
    labelSelector: '.plx-menu__label',
    parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', py: 'A', minw: 'A', off: 'B', offt: 'B', ih: 'C', ipx: 'C', ifs: 'C', ifg: 'C', ihv: 'C', dfg: 'D' },
    anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'top' }, C: { part: '.plx-menu__item', side: 'left' }, D: { part: '.plx-menu__item--danger', side: 'left' } },
    sections: [['Surface', ['bg', 'bc', 'bw', 'rad', 'py', 'minw']], ['Placement', ['off', 'offt']], ['Items', ['ih', 'ipx', 'ifs', 'ifg', 'ihv', 'dfg']]],
    matrixLabel: 'Action menu values by placement and state',
    statesHead: 'Placements and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
})();
