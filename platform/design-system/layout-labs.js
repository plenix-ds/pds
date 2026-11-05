/* global DS */
/* Plenix master spec · the layout labs (Every Variant, batch 333): Stack, Divider, the dashboard grid (WidgetGrid), the content
   grid (ContentGrid), Columns, the split pane (SecondaryPane), the inspector region (SidePanel) and the record page
   (RecordPage.Header, EntityHeader). Each description for the shared component lab (component-lab.js) names the variants,
   every property the lab reads with the one --plx-comp-* token that sets it, and the markup the component renders. A layout
   has no width of its own: its specimen sits in a frame from ds-sample-layout.css. */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var STATIC = [['default', 'Default']];   // a layout has no interactive states
  var ONE = [['default', 'Default']];
  var cls = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
  var ICON = function (name, size) { return DS.icon(name, size ? 'plx-icon--size-' + size : ''); };
  var BOX = function (text) { return '<div class="ds-layout-fill ds-layout-box">' + text + '</div>'; };
  var SPLITTER = function (edge, label) { return '<div role="separator" aria-orientation="vertical" aria-label="' + label + '" tabindex="-1" class="plx-panel-splitter plx-panel-splitter--' + edge + '"></div>'; };
  var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';

  // ---- Stack (<Stack>, div.plx-stack): a column of children spaced by a gap
  var ST = function (n) { return 'plx-comp-stack-' + n; };
  DS.registerLab('stack', {
    name: 'Stack', title: 'Plenix stack', file: 'platform/components/Stack/stack.css', compPrefix: /^plx-comp-stack-/,
    store: 'plenix-stack-lab-tokens', sizes: ONE,
    variants: [['none', 'None'], ['xs', 'Xs'], ['sm', 'Sm'], ['md', 'Md (default)'], ['lg', 'Lg'], ['xl', 'Xl']],
    states: STATIC, content: [['blocks', 'Three blocks']],
    labels: { size: 'Size', variant: 'Gap', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'md', state: 'default', content: 'blocks' },
    props: [{ id: 'gap', label: 'Gap between children', css: ['row-gap'], cat: 'space', extra: ['0'] }],
    token: function (id, size, variant) { return id === 'gap' && variant !== 'none' ? ST('gap-' + variant + '-row-gap') : null; },
    reach: function (full) { var m = /stack-gap-([a-z]+)-/.exec(full); return m ? 'every stack with the ' + m[1] + ' gap' : 'every stack'; },
    every: 'every stack',
    html: function (variant, size, state, extraCls) {
      return '<div class="plx-stack plx-stack--gap-' + variant + ' ds-layout-frame--sm' + cls(extraCls) + '">' + BOX('First') + BOX('Second') + BOX('Third') + '</div>';
    },
    labelSelector: null,
    parts: { gap: 'A' },
    anchors: { A: { part: null, side: 'right' } },
    sections: [['Spacing', ['gap']]],
    matrixLabel: 'Stack values by gap',
    statesHead: 'Gaps · ' + HEAD
  });

  // ---- Divider (<Divider>, div.plx-divider): a thin line between content, across or down
  var DV = function (n) { return 'plx-comp-divider-' + n; };
  DS.registerLab('divider', {
    name: 'Divider', title: 'Plenix divider', file: 'platform/components/Divider/divider.css', compPrefix: /^plx-comp-divider-/,
    store: 'plenix-divider-lab-tokens', sizes: ONE,
    variants: [['horizontal', 'Horizontal (default)'], ['vertical', 'Vertical']],
    states: STATIC, content: [['between', 'Between two blocks']],
    labels: { size: 'Size', variant: 'Orientation', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'horizontal', state: 'default', content: 'between' },
    props: [
      { id: 'hc', label: 'Line color (across)', css: ['border-block-start-color'], show: 'border-top-color', cat: 'color' },
      { id: 'hw', label: 'Line width (across)', css: ['border-block-start-width'], show: 'border-top-width', cat: 'border-width' },
      { id: 'vc', label: 'Line color (down)', css: ['border-inline-start-color'], show: 'border-left-color', cat: 'color' },
      { id: 'vw', label: 'Line width (down)', css: ['border-inline-start-width'], show: 'border-left-width', cat: 'border-width' }
    ],
    token: function (id, size, variant) {
      if (variant === 'horizontal') return { hc: DV('horizontal-border-block-start-color'), hw: DV('horizontal-border-block-start-width') }[id] || null;
      return { vc: DV('vertical-border-inline-start-color'), vw: DV('vertical-border-inline-start-width') }[id] || null;
    },
    reach: function (full) { return /divider-vertical-/.test(full) ? 'every vertical divider' : 'every horizontal divider'; },
    every: 'every divider',
    html: function (variant, size, state, extraCls) {
      var line = '<div role="separator" aria-orientation="' + variant + '" class="plx-divider plx-divider--' + variant + cls(extraCls) + '"></div>';
      return variant === 'vertical' ? '<div class="ds-layout-row ds-layout-frame--sm">' + BOX('Before') + line + BOX('After') + '</div>'
        : '<div class="ds-layout-col ds-layout-frame--sm">' + BOX('Above') + line + BOX('Below') + '</div>';
    },
    labelSelector: null,
    parts: { hc: 'A', hw: 'A', vc: 'A', vw: 'A' },
    anchors: { A: { part: null, side: 'right' } },
    sections: [['Line', ['hc', 'hw', 'vc', 'vw']]],
    matrixLabel: 'Divider values by orientation',
    statesHead: 'Orientations · ' + HEAD
  });

  // ---- Dashboard grid (<WidgetGrid>, div.plx-widget-grid): widgets in columns, each with a drag handle in its corner
  var WG = function (n) { return 'plx-comp-widget-grid-' + n; };
  DS.registerLab('dashboard-grid', {
    name: 'Dashboard grid', title: 'Plenix dashboard grid', file: 'platform/patterns/WidgetGrid/widget-grid.css', compPrefix: /^plx-comp-widget-grid-/,
    store: 'plenix-dashboard-grid-lab-tokens', sizes: ONE,
    variants: [['auto', 'As many as fit (default)'], ['2', '2 columns'], ['3', '3 columns'], ['4', '4 columns'], ['wide', 'Two columns wide']],
    states: [['default', 'Default'], ['hover', 'Handle hover'], ['focus', 'Handle focus']],
    content: [['widgets', 'Four widgets']],
    labels: { size: 'Size', variant: 'Columns', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'auto', state: 'default', content: 'widgets' },
    props: [
      { id: 'cols', label: 'Columns (as many as fit)', css: ['grid-template-columns'], cat: 'columns' },
      { id: 'gap', label: 'Gap between columns', css: ['column-gap'], cat: 'space' },
      { id: 'rgap', label: 'Gap between rows', css: ['row-gap'], cat: 'space' },
      { id: 'rad', label: 'Widget corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-widget-grid__item', cat: 'radius' },
      { id: 'hw', label: 'Handle width', css: ['inline-size'], show: 'width', part: '.plx-widget-grid__handle', cat: 'control-height' },
      { id: 'hh', label: 'Handle height', css: ['block-size'], show: 'height', part: '.plx-widget-grid__handle', cat: 'control-height' },
      { id: 'ht', label: 'Handle inset from the top', css: ['inset-block-start'], show: 'top', part: '.plx-widget-grid__handle', cat: 'space' },
      { id: 'hr', label: 'Handle inset from the end', css: ['inset-inline-end'], show: 'right', part: '.plx-widget-grid__handle', cat: 'space' },
      { id: 'hrad', label: 'Handle corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-widget-grid__handle', cat: 'radius' },
      { id: 'hfg', label: 'Handle icon color', css: ['color'], part: '.plx-widget-grid__handle', cat: 'color' },
      { id: 'hbg', label: 'Handle background color', css: ['background-color'], part: '.plx-widget-grid__handle', cat: 'color', extra: ['transparent'] },
      { id: 'foc', label: 'Focus outline color', css: ['outline-color'], part: '.plx-widget-grid__handle', cat: 'color' },
      { id: 'fow', label: 'Focus outline width', css: ['outline-width'], part: '.plx-widget-grid__handle', cat: 'border-width' }
    ],
    token: function (id, size, variant, state) {
      switch (id) {
        case 'cols': return variant === 'auto' ? WG('grid-template-columns') : null;
        case 'gap': return WG('gap');
        case 'rgap': return WG('row-gap');
        case 'rad': return WG('item-radius');
        case 'hw': return WG('handle-width');
        case 'hh': return WG('handle-height');
        case 'ht': return WG('handle-inset-block-start');
        case 'hr': return WG('handle-inset-inline-end');
        case 'hrad': return WG('handle-radius');
        case 'hfg': return state === 'hover' ? WG('handle-hover-text') : WG('handle-text');
        case 'hbg': return state === 'hover' ? WG('handle-hover-background') : null;
        case 'foc': return state === 'focus' ? WG('handle-focus-outline-color') : null;
        case 'fow': return state === 'focus' ? WG('handle-focus-outline-width') : null;
        default: return null;
      }
    },
    reach: function (full) {
      if (/grid-template-columns/.test(full)) return 'every dashboard grid that fits as many columns as it can';
      if (/handle-hover-/.test(full)) return 'every widget handle under the pointer';
      if (/handle-focus-/.test(full)) return 'every focused widget handle';
      return /handle-/.test(full) ? 'every widget handle' : 'every dashboard grid';
    },
    every: 'every dashboard grid',
    html: function (variant, size, state, extraCls) {
      var columns = variant === 'wide' ? '3' : variant, stateCls = state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '';
      var item = function (title, i) {
        return '<div role="listitem" class="plx-widget-grid__item ds-layout-fill' + (variant === 'wide' && !i ? ' plx-widget-grid__item--wide' : '') + '">'
          + '<button type="button" tabindex="-1" draggable="true" aria-label="Move ' + title + '" class="plx-widget-grid__handle' + (i ? '' : stateCls) + '">' + ICON('drag', 'md') + '</button>' + title + '</div>';
      };
      return '<div role="list" aria-label="Dashboard" class="plx-widget-grid plx-widget-grid--' + columns + ' ds-layout-frame--lg' + cls(extraCls) + '">'
        + ['Revenue', 'Visitors', 'Tasks', 'Storage'].map(item).join('') + '</div>';
    },
    labelSelector: null,
    parts: { cols: 'A', gap: 'A', rgap: 'A', rad: 'B', hw: 'C', hh: 'C', ht: 'C', hr: 'C', hrad: 'C', hfg: 'C', hbg: 'C', foc: 'C', fow: 'C' },
    anchors: { A: { part: null, side: 'bottom' }, B: { part: '.plx-widget-grid__item', side: 'left' }, C: { part: '.plx-widget-grid__handle', side: 'top' } },
    sections: [['Grid', ['cols', 'gap', 'rgap']], ['Widget', ['rad']], ['Handle', ['hw', 'hh', 'ht', 'hr', 'hrad', 'hfg', 'hbg']], ['Focus', ['foc', 'fow']]],
    matrixLabel: 'Dashboard grid values by columns and handle state', matrixColumnWidth: '--plx-ref-size-600px',
    statesHead: 'Columns and handle states · ' + HEAD
  });

  // ---- Content grid (<ContentGrid>, ul.plx-content-grid): cards that fill the row, as many as fit at a minimum card size
  var CG = function (n) { return 'plx-comp-content-grid-' + n; };
  DS.registerLab('responsive-grid', {
    name: 'Content grid', title: 'Plenix content grid', file: 'platform/patterns/ContentGrid/content-grid.css', compPrefix: /^plx-comp-content-grid-/,
    store: 'plenix-content-grid-lab-tokens', sizes: ONE,
    variants: [['xs', 'XS'], ['sm', 'SM'], ['md', 'MD (default)'], ['lg', 'LG']],
    states: STATIC, content: [['cards', 'Six cards']],
    labels: { size: 'Size', variant: 'Card size', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'md', state: 'default', content: 'cards' },
    // the minimum card width is set by each size class on the grid itself (--plx-comp-content-grid-min), so it is fixed here
    props: [
      { id: 'gap', label: 'Gap between columns', css: ['column-gap'], cat: 'space' },
      { id: 'rgap', label: 'Gap between rows', css: ['row-gap'], cat: 'space' }
    ],
    token: function (id) { return { gap: CG('gap'), rgap: CG('row-gap') }[id] || null; },
    reach: function () { return 'every content grid'; },
    every: 'every content grid',
    html: function (variant, size, state, extraCls) {
      return '<ul aria-label="Assets" class="plx-content-grid plx-content-grid--' + variant + ' ds-layout-frame--lg' + cls(extraCls) + '">'
        + ['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(function (t) { return '<li class="plx-content-grid__item">' + BOX(t) + '</li>'; }).join('') + '</ul>';
    },
    labelSelector: null,
    parts: { gap: 'A', rgap: 'A' },
    anchors: { A: { part: null, side: 'bottom' } },
    sections: [['Spacing', ['gap', 'rgap']]],
    matrixLabel: 'Content grid values by card size', matrixColumnWidth: '--plx-ref-size-600px',
    statesHead: 'Card sizes · ' + HEAD
  });

  // ---- Columns (<Columns>, div.plx-columns): two or three equal columns, spaced by a gap or divided by lines
  var CO = function (n) { return 'plx-comp-columns-' + n; };
  DS.registerLab('columns', {
    name: 'Columns', title: 'Plenix columns', file: 'platform/components/Columns/columns.css', compPrefix: /^plx-comp-columns-/,
    store: 'plenix-columns-lab-tokens',
    sizes: [['2', '2 (default)', '.plx-columns--2'], ['3', '3', '.plx-columns--3']],
    variants: [['gap-none', 'None'], ['gap-md', 'Md (default)'], ['gap-lg', 'Lg'], ['divided', 'Divided']],
    states: STATIC, content: [['blocks', 'A block in each column']],
    labels: { size: 'Count', variant: 'Gap', state: 'State', content: 'Content' },
    defaults: { size: '2', variant: 'gap-md', state: 'default', content: 'blocks' },
    props: [
      { id: 'gap', label: 'Gap between columns', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'py', label: 'Column padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: ':scope > :first-child', cat: 'space' },
      { id: 'px', label: 'Column padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: ':scope > :first-child', cat: 'space' },
      { id: 'lc', label: 'Dividing line color', css: ['border-inline-start-color'], show: 'border-left-color', part: ':scope > :nth-child(2)', cat: 'color' },
      { id: 'lw', label: 'Dividing line width', css: ['border-inline-start-width'], show: 'border-left-width', part: ':scope > :nth-child(2)', cat: 'border-width' }
    ],
    token: function (id, size, variant) {
      if (variant === 'divided') return { py: CO('divided-padding-block'), px: CO('divided-padding-inline'), lc: CO('divided-border-inline-start-color'), lw: CO('divided-border-inline-start-width') }[id] || null;
      return id === 'gap' && variant !== 'gap-none' ? CO(variant + '-gap') : null;
    },
    reach: function (full) { var m = /columns-gap-([a-z]+)-/.exec(full); return m ? 'every row of columns with the ' + m[1] + ' gap' : 'every divided row of columns'; },
    every: 'every row of columns',
    html: function (variant, size, state, extraCls) {
      var divided = variant === 'divided', names = ['First', 'Second', 'Third'].slice(0, +size);
      return '<div class="plx-columns plx-columns--' + size + ' plx-columns--' + variant + ' ds-layout-frame' + cls(extraCls) + '">'
        + names.map(function (t) { return divided ? '<div class="ds-layout-cell">' + t + '</div>' : BOX(t); }).join('') + '</div>';
    },
    labelSelector: null,
    parts: { gap: 'A', py: 'B', px: 'B', lc: 'C', lw: 'C' },
    anchors: { A: { part: null, side: 'bottom' }, B: { part: ':scope > :first-child', side: 'left' }, C: { part: ':scope > :nth-child(2)', side: 'top' } },
    sections: [['Spacing', ['gap', 'py', 'px']], ['Dividing line', ['lc', 'lw']]],
    matrixLabel: 'Columns values by count and gap',
    statesHead: 'Gaps and dividers · ' + HEAD
  });

  // ---- Split pane (<SecondaryPane>, aside.plx-secondary-pane): a narrow pane at the start or end of the main content
  var SP = function (n) { return 'plx-comp-secondary-pane-' + n; };
  DS.registerLab('secondary-pane', {
    name: 'Split pane', title: 'Plenix split pane', file: 'platform/patterns/SecondaryPane/secondary-pane.css', compPrefix: /^plx-comp-(secondary-pane|panel-splitter)-/,
    store: 'plenix-secondary-pane-lab-tokens',
    sizes: [['sm', 'SM (180px; 220px from 1440px, 260px from 1920px)', '.plx-secondary-pane--sm'], ['md', 'MD (default, 220px; 260px from 1440px, 320px from 1920px)', '.plx-secondary-pane--md'], ['lg', 'LG (280px; 320px from 1440px, 400px from 1920px)', '.plx-secondary-pane--lg']],
    variants: [['start', 'Start (default)'], ['end', 'End'], ['resized', 'Resized by dragging its edge']],
    states: STATIC, content: [['folders', 'A title and a list']],
    labels: { size: 'Width', variant: 'Side and behavior', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'start', state: 'default', content: 'folders' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
      { id: 'ec', label: 'Edge color (start pane)', css: ['border-inline-end-color'], show: 'border-right-color', cat: 'color' },
      { id: 'ew', label: 'Edge width (start pane)', css: ['border-inline-end-width'], show: 'border-right-width', cat: 'border-width' },
      { id: 'sc', label: 'Edge color (end pane)', css: ['border-inline-start-color'], show: 'border-left-color', cat: 'color' },
      { id: 'sw', label: 'Edge width (end pane)', css: ['border-inline-start-width'], show: 'border-left-width', cat: 'border-width' },
      { id: 'hh', label: 'Header minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-secondary-pane__header', cat: 'control-height' },
      { id: 'hpt', label: 'Header padding top', css: ['padding-block-start'], show: 'padding-top', part: '.plx-secondary-pane__header', cat: 'space' },
      { id: 'hpl', label: 'Header padding left', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-secondary-pane__header', cat: 'space' },
      { id: 'hfs', label: 'Title font size', css: ['font-size'], part: '.plx-secondary-pane__header', cat: 'font-size' },
      { id: 'hfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-secondary-pane__header', cat: 'font-weight' },
      { id: 'bpx', label: 'Body padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-secondary-pane__body', cat: 'space' },
      { id: 'bgap', label: 'Body gap between items', css: ['row-gap'], part: '.plx-secondary-pane__body', cat: 'space' },
      { id: 'spw', label: 'Drag edge width', css: ['inline-size'], show: 'width', part: '.plx-panel-splitter', cat: 'size' }
    ],
    token: function (id, size, variant) {
      var end = variant === 'end';
      switch (id) {
        case 'bg': return SP('background');
        // a dragged width reaches the pane as data-plx-width (its own --plx-comp-secondary-pane-width): fixed here
        case 'w': return variant === 'resized' ? null : SP('width-' + size);
        case 'ec': return end ? null : SP('border-inline-end-color');
        case 'ew': return end ? null : SP('start-border-inline-end-width');
        case 'sc': return end ? SP('border-inline-start-color') : null;
        case 'sw': return end ? SP('end-border-inline-start-width') : null;
        case 'hh': return SP('header-min-height');
        case 'hpt': return SP('header-padding-block-start');
        case 'hpl': return SP('header-padding-inline-start');
        case 'hfs': return SP('header-font-size');
        case 'hfw': return SP('header-font-weight');
        case 'bpx': return SP('body-padding-inline');
        case 'bgap': return SP('body-row-gap');
        case 'spw': return variant === 'resized' ? 'plx-comp-panel-splitter-width' : null;
        default: return null;
      }
    },
    reach: function (full) {
      var m = /secondary-pane-width-(sm|md|lg)$/.exec(full); if (m) return 'every ' + m[1].toUpperCase() + ' split pane';
      if (/panel-splitter-/.test(full)) return 'every drag edge (split pane, inspector, navigation pane)';
      if (/start-border|border-inline-end/.test(full)) return 'every split pane at the start';
      if (/end-border|border-inline-start/.test(full)) return 'every split pane at the end';
      return 'every split pane';
    },
    every: 'every split pane',
    html: function (variant, size, state, extraCls) {
      var end = variant === 'end', resized = variant === 'resized';
      var pane = '<aside aria-label="Folders" class="plx-secondary-pane plx-secondary-pane--' + (end ? 'end' : 'start') + ' plx-secondary-pane--' + size + (resized ? ' plx-secondary-pane--resized' : '') + cls(extraCls) + '"'
        + (resized ? ' data-plx-width="240px"' : '') + '>'
        + '<div class="plx-secondary-pane__header"><span class="plx-secondary-pane__title">Folders</span></div>'
        + '<div class="plx-secondary-pane__body"><span class="ds-layout-cell">Inbox</span><span class="ds-layout-cell">Drafts</span><span class="ds-layout-cell">Archive</span></div>'
        + (resized ? SPLITTER('end', 'Resize Folders') : '') + '</aside>';
      var main = '<div class="ds-layout-main"></div>';
      return '<div class="ds-layout-shell">' + (end ? main + pane : pane + main) + '</div>';
    },
    labelSelector: null,
    parts: { bg: 'A', w: 'A', ec: 'B', ew: 'B', sc: 'B', sw: 'B', hh: 'C', hpt: 'C', hpl: 'C', hfs: 'C', hfw: 'C', bpx: 'D', bgap: 'D', spw: 'E' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'bottom' }, C: { part: '.plx-secondary-pane__header', side: 'left' }, D: { part: '.plx-secondary-pane__body', side: 'left' }, E: { part: '.plx-panel-splitter', side: 'right' } },
    sections: [['Pane', ['bg', 'w', 'ec', 'ew', 'sc', 'sw']], ['Header', ['hh', 'hpt', 'hpl', 'hfs', 'hfw']], ['Body', ['bpx', 'bgap']], ['Drag edge', ['spw']]],
    matrixLabel: 'Split pane values by width, side and behavior', matrixColumnWidth: '--plx-ref-size-600px',
    statesHead: 'Sides and behavior · ' + HEAD
  });

  // ---- Inspector region (<SidePanel>, aside.plx-side-panel): the inspector at the end of the main region
  var SD = function (n) { return 'plx-comp-side-panel-' + n; };
  DS.registerLab('inspector-region', {
    name: 'Inspector region', title: 'Plenix inspector region', file: 'platform/patterns/SidePanel/side-panel.css', compPrefix: /^plx-comp-(side-panel|panel-splitter)-/,
    store: 'plenix-inspector-region-lab-tokens', sizes: ONE,
    variants: [['docked', 'Docked (default)'], ['resizable', 'Resizable: drag its start edge']],
    states: STATIC, content: [['details', 'A title, details and a footer']],
    labels: { size: 'Size', variant: 'Resize', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'resizable', state: 'default', content: 'details' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'sh', label: 'Edge (an inset shadow)', css: ['box-shadow'], cat: 'shadow' },
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
      { id: 'hh', label: 'Header minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-side-panel__header', cat: 'control-height' },
      { id: 'hpt', label: 'Header padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-side-panel__header', cat: 'space' },
      { id: 'hpl', label: 'Header padding left', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-side-panel__header', cat: 'space' },
      { id: 'hgap', label: 'Header gap (icon, title)', css: ['column-gap'], part: '.plx-side-panel__header', cat: 'space' },
      { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-side-panel__icon', cat: 'color' },
      { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-side-panel__title', cat: 'color' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: '.plx-side-panel__title', cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-side-panel__title', cat: 'font-weight' },
      { id: 'bpx', label: 'Body padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-side-panel__body', cat: 'space' },
      { id: 'bpb', label: 'Body padding bottom', css: ['padding-block-end'], show: 'padding-bottom', part: '.plx-side-panel__body', cat: 'space' },
      { id: 'fsh', label: 'Footer line (an inset shadow)', css: ['box-shadow'], part: '.plx-side-panel__footer', cat: 'shadow' },
      { id: 'fpx', label: 'Footer padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-side-panel__footer', cat: 'space' },
      { id: 'fgap', label: 'Footer gap between actions', css: ['column-gap'], part: '.plx-side-panel__footer', cat: 'space' },
      { id: 'spw', label: 'Drag edge width', css: ['inline-size'], show: 'width', part: '.plx-panel-splitter', cat: 'size' }
    ],
    token: function (id, size, variant) {
      return {
        bg: SD('background'), sh: SD('shadow'), w: SD('width-default'), hh: SD('header-min-height'), hpt: SD('header-padding-block'),
        hpl: SD('header-padding-inline-start'), hgap: SD('header-gap'), ic: SD('icon-text'), tc: SD('title-text'), tfs: SD('title-font-size'),
        tfw: SD('title-font-weight'), bpx: SD('body-padding-inline'), bpb: SD('body-padding-block-end'), fsh: SD('footer-shadow'),
        fpx: SD('footer-padding-inline'), fgap: SD('footer-gap'), spw: variant === 'resizable' ? 'plx-comp-panel-splitter-width' : null
      }[id] || null;
    },
    reach: function (full) { return /panel-splitter-/.test(full) ? 'every drag edge (split pane, inspector, navigation pane)' : 'every inspector region'; },
    every: 'every inspector region',
    html: function (variant, size, state, extraCls) {
      var resizable = variant === 'resizable';
      return '<div class="ds-layout-shell"><div class="ds-layout-main"></div>'
        + '<aside aria-label="Details" class="plx-side-panel' + (resizable ? ' plx-side-panel--resizable' : '') + cls(extraCls) + '">'
        + '<div class="plx-side-panel__header"><span class="plx-side-panel__icon" aria-hidden="true">' + ICON('info-circle') + '</span><h2 class="plx-side-panel__title">Details</h2></div>'
        + '<div class="plx-side-panel__body"><span class="ds-layout-cell">Cross 014.png · PNG · 1.2 MB</span></div>'
        + '<div class="plx-side-panel__footer"><button type="button" tabindex="-1" class="plx-button plx-button--primary plx-button--size-sm">Save</button></div>'
        + (resizable ? SPLITTER('start', 'Resize panel') : '') + '</aside></div>';
    },
    labelSelector: '.plx-side-panel__title',
    parts: { bg: 'A', sh: 'A', w: 'A', hh: 'B', hpt: 'B', hpl: 'B', hgap: 'B', ic: 'B', tc: 'C', tfs: 'C', tfw: 'C', bpx: 'D', bpb: 'D', fsh: 'E', fpx: 'E', fgap: 'E', spw: 'F' },
    anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-side-panel__icon', side: 'left' }, C: { part: '.plx-side-panel__title', side: 'right' }, D: { part: '.plx-side-panel__body', side: 'right' }, E: { part: '.plx-side-panel__footer', side: 'bottom' }, F: { part: '.plx-panel-splitter', side: 'left' } },
    sections: [['Panel', ['bg', 'sh', 'w']], ['Header', ['hh', 'hpt', 'hpl', 'hgap', 'ic', 'tc', 'tfs', 'tfw']], ['Body', ['bpx', 'bpb']], ['Footer', ['fsh', 'fpx', 'fgap']], ['Drag edge', ['spw']]],
    matrixLabel: 'Inspector region values by resize', matrixColumnWidth: '--plx-ref-size-600px',
    statesHead: 'Resize · ' + HEAD
  });

  // ---- Object / record page: its header region, an EntityHeader (header.plx-entity-header) for a page that shows one entity,
  // or a RecordPage.Header (div.plx-record-page__header) for a settings screen or a section
  var RP = function (n) { return 'plx-comp-record-page-' + n; };
  var EH = function (n) { return 'plx-comp-entity-header-' + n; };
  var HUE = { blue: '-blue', green: '-green', purple: '-purple', red: '-red', brown: '-brown', gray: '-gray' };
  var ENTITY = {
    person: { media: { person: 'Maya Chen', color: 'blue' }, title: 'Maya Chen', subtitle: 'Creative Director · Apex Co',
      status: { tone: 'action-required', icon: 'alert', label: 'Reconnect due' }, facts: [{ label: 'Last message', value: '10:24 AM', data: true }, { label: 'Owner', value: 'Sam Patel' }],
      next: { title: 'Send the revised quote', detail: 'Due tomorrow · Sam Patel' }, actions: [{ icon: 'phone', label: 'Call' }, { icon: 'message', label: 'Message', primary: true }, { icon: 'share', label: 'Share' }] },
    tile: { media: { icon: 'briefcase', hue: 'purple' }, title: 'AI Writing Tools', subtitle: 'Evaluating AI writing assistants for team adoption',
      status: { tone: 'waiting', label: 'Paused' }, actions: [{ icon: 'flag', label: 'Update status', primary: true }, { icon: 'share', label: 'Share' }] },
    live: { media: { icon: 'sparkle', hue: 'purple' }, title: 'Order status assistant', subtitle: 'Support',
      status: { tone: 'success', icon: 'check', label: 'Running 3 conversations' }, facts: [{ label: 'Channels', value: 'WhatsApp, Web' }, { label: 'Model', value: 'Claude Sonnet' }],
      actions: [{ icon: 'triangle-right', label: 'Test' }, { icon: 'upload', label: 'Publish', primary: true }, { icon: 'share', label: 'Share' }] },
    email: { media: { person: 'David Saad', color: 'green' }, title: 'Re: Kitchen tile quote and the revised schedule for March', subtitle: 'David Saad',
      status: { tone: 'neutral', label: 'Snoozed' }, facts: [{ label: 'Received', value: 'Mar 8, 9:41 AM', data: true }, { label: 'Attachments', value: '2' }],
      actions: [{ icon: 'reply', label: 'Reply', primary: true }, { icon: 'reply-all', label: 'Reply all' }, { icon: 'forward', label: 'Forward' }, { icon: 'archive', label: 'Archive' }] },
    narrow: { media: { icon: 'briefcase', hue: 'blue' }, title: 'Coptic Orthodox Diocese of Los Angeles — Clergy Office Renovation and Records Migration', subtitle: 'Client work',
      status: { tone: 'success', label: 'Active' }, facts: [{ label: 'Due', value: 'Mar 30', data: true }, { label: 'Owner', value: 'R. Maher' }], actions: [{ icon: 'flag', label: 'Update status', primary: true }], narrow: true }
  };
  var isEntity = function (variant) { return !!ENTITY[variant]; };
  // the entity header is the component itself: the specimen is a frame the after hook renders EntityHeader into
  function entityHtml(variant, extraCls) {
    return '<div class="' + (ENTITY[variant].narrow ? 'ds-layout-frame' : 'ds-layout-frame--xl') + '" data-lab-entity="' + variant + '" data-lab-cls="' + (extraCls || '') + '"></div>';
  }
  function drawEntities(doc) {
    // the spec page's React and Platform draw it, also into the lab's frames (they load only the stylesheets)
    var R = window.React, RD = window.ReactDOM, P = window.Plenix;
    if (!R || !RD || !P || !P.EntityHeader) return;
    doc.querySelectorAll('[data-lab-entity]:not([data-lab-drawn])').forEach(function (frame) {
      frame.setAttribute('data-lab-drawn', '');
      var e = ENTITY[frame.getAttribute('data-lab-entity')], root = RD.createRoot(frame);
      RD.flushSync(function () { root.render(R.createElement(P.EntityHeader, Object.assign({ headingLevel: 3, className: frame.getAttribute('data-lab-cls') || undefined }, e))); });
    });
  }
  function recordHtml(variant, extraCls) {
    var plain = variant === 'none' || variant === 'card';
    return '<div class="plx-record-page__header plx-record-page__header--' + (variant === 'md' ? 'md' : 'lg') + (variant === 'card' ? ' plx-record-page__header--card' : '') + ' ds-layout-frame' + cls(extraCls) + '">'
      + (plain ? '<div class="plx-record-page__media">' + ICON('filter', 'lg') + '</div>' : '')
      + '<div class="plx-record-page__text"><h3 class="plx-record-page__title">' + (plain ? 'Filter bar' : 'Cross 014.png') + '</h3>'
      + (plain ? '<p class="plx-record-page__description">A row of filters above a list or grid.</p><div class="plx-record-page__meta"><span class="plx-badge plx-badge--active">Composite</span></div>'
        : '<div class="plx-record-page__meta"><span class="plx-badge plx-badge--success">Active</span><span>PNG · 1.2 MB</span></div>') + '</div>'
      + (plain ? '' : '<div class="plx-record-page__actions"><button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-sm">Edit</button></div>') + '</div>';
  }
  DS.registerLab('record-page', {
    name: 'Record page', title: 'Plenix record page header', file: 'platform/patterns/RecordPage/record-page.css', compPrefix: /^plx-comp-(record-page|entity-header)-/,
    store: 'plenix-record-page-lab-tokens', sizes: ONE,
    variants: [['person', 'Entity · a person'], ['tile', 'Entity · a generic icon'], ['live', 'Entity · live state'], ['email', 'Entity · an email'], ['narrow', 'Entity · narrow'],
      ['lg', 'Header · LG (default)'], ['md', 'Header · MD'], ['none', 'Header · no surface (default)'], ['card', 'Header · card']],
    states: STATIC, content: [['record', 'A record']],
    labels: { size: 'Size', variant: 'Header', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'person', state: 'default', content: 'record' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'], show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
      { id: 'pl', label: 'Padding left', css: ['padding-inline-start'], show: 'padding-left', cat: 'space' },
      { id: 'pr', label: 'Padding right', css: ['padding-inline-end'], show: 'padding-right', cat: 'space' },
      { id: 'gap', label: 'Gap (media, text, actions)', css: ['column-gap'], cat: 'space' },
      { id: 'egap', label: 'Gap (main to aside)', css: ['column-gap'], part: '.plx-entity-header__layout', cat: 'space' },
      { id: 'rgap', label: 'Gap between lines', css: ['row-gap'], cat: 'space' },
      { id: 'mb', label: 'Space below the header', css: ['margin-block-end'], show: 'margin-bottom', cat: 'space' },
      { id: 'avc', label: 'Avatar border color', css: ['border-top-color'], part: '.plx-entity-header__avatar', cat: 'color' },
      { id: 'avw', label: 'Avatar border width', css: ['border-top-width'], part: '.plx-entity-header__avatar', cat: 'border-width' },
      { id: 'tw', label: 'Icon tile width', css: ['inline-size'], show: 'width', part: '.plx-entity-header__tile', cat: 'size' },
      { id: 'th', label: 'Icon tile height', css: ['block-size'], show: 'height', part: '.plx-entity-header__tile', cat: 'size' },
      { id: 'trad', label: 'Icon tile corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-entity-header__tile', cat: 'radius' },
      { id: 'tbg', label: 'Icon tile background (its hue)', css: ['background-color'], part: '.plx-entity-header__tile', cat: 'color' },
      { id: 'tfg', label: 'Icon tile icon color (its hue)', css: ['color'], part: '.plx-entity-header__tile', cat: 'color' },
      { id: 'mfg', label: 'Media color (card)', css: ['color'], part: '.plx-record-page__media', cat: 'color' },
      { id: 'cc', label: 'Subtitle color', css: ['color'], part: '.plx-entity-header__subtitle', cat: 'color' },
      { id: 'cfs', label: 'Subtitle font size', css: ['font-size'], part: '.plx-entity-header__subtitle', cat: 'font-size' },
      { id: 'topgap', label: 'Heading gap (media, title)', css: ['column-gap'], part: '.plx-entity-header__heading', cat: 'space' },
      { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-entity-header__title, .plx-record-page__title', cat: 'color' },
      { id: 'tff', label: 'Title font family', css: ['font-family'], part: '.plx-entity-header__title, .plx-record-page__title', cat: 'font' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: '.plx-entity-header__title, .plx-record-page__title', cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-entity-header__title, .plx-record-page__title', cat: 'font-weight' },
      { id: 'tlh', label: 'Title line height', css: ['line-height'], part: '.plx-entity-header__title', cat: 'line-height' },
      { id: 'agap', label: 'Gap between actions', css: ['column-gap'], part: '.plx-entity-header__actions, .plx-record-page__actions', cat: 'space' },
      { id: 'xgap', label: 'Gap between text lines', css: ['row-gap'], part: '.plx-record-page__text', cat: 'space' },
      { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-record-page__description', cat: 'color' },
      { id: 'dfs', label: 'Description font size', css: ['font-size'], part: '.plx-record-page__description', cat: 'font-size' },
      { id: 'dlh', label: 'Description line height', css: ['line-height'], part: '.plx-record-page__description', cat: 'line-height' },
      { id: 'mgap', label: 'Meta gap', css: ['column-gap'], part: '.plx-record-page__meta', cat: 'space' },
      { id: 'fc', label: 'Fact value color', css: ['color'], part: '.plx-entity-header__fact:not(.plx-entity-header__fact--status) .plx-entity-header__fact-value', cat: 'color' },
      { id: 'ffs', label: 'Fact value font size', css: ['font-size'], part: '.plx-entity-header__fact:not(.plx-entity-header__fact--status) .plx-entity-header__fact-value', cat: 'font-size' },
      { id: 'flc', label: 'Fact tile border color', css: ['border-top-color'], part: '.plx-entity-header__fact:not(.plx-entity-header__fact--status)', cat: 'color' },
      { id: 'flw', label: 'Fact tile border width', css: ['border-top-width'], part: '.plx-entity-header__fact', cat: 'border-width' },
      { id: 'fpt', label: 'Fact tile padding top', css: ['padding-block-start'], show: 'padding-top', part: '.plx-entity-header__fact', cat: 'space' },
      { id: 'sep', label: 'Accent rule color', css: ['background-color'], part: '.plx-entity-header__rule', cat: 'color' }
    ],
    token: function (id, size, variant) {
      if (isEntity(variant)) {
        var e = ENTITY[variant], person = !!e.media.person, hue = person ? null : HUE[e.media.hue], facts = !!(e.facts && e.facts.length);
        switch (id) {
          case 'bg': return EH('background');
          case 'bc': return EH('border-color');
          case 'bw': return EH('border-width');
          case 'rad': return EH('radius');
          case 'py': return EH('padding-block');
          case 'pl': return EH('padding-inline-start');
          case 'pr': return EH('padding-inline-end');
          case 'gap': return null;
          case 'egap': return e.next || e.actions ? EH('column-gap') : null;
          case 'rgap': return null;
          case 'avc': return person ? 'plx-comp-avatar-border-color' : null;   // Avatar's own border (every avatar, owner 2026-10-19)
          case 'avw': return person ? 'plx-comp-avatar-border-width' : null;
          case 'tw': return person ? null : EH('tile-width');
          case 'th': return person ? null : EH('tile-height');
          case 'trad': return person ? null : EH('tile-radius');
          case 'tbg': return person ? null : EH('tile' + hue + '-background');
          case 'tfg': return person ? null : EH('tile' + hue + '-text');
          case 'cc': return e.subtitle ? EH('subtitle-text') : null;
          case 'cfs': return e.subtitle ? EH('subtitle-font-size') : null;
          case 'topgap': return EH('heading-gap');
          case 'tc': return EH('title-text');
          case 'tff': return EH('title-font-family');
          case 'tfs': return EH('title-font-size');
          case 'tfw': return EH('title-font-weight');
          case 'tlh': return EH('title-line-height');
          case 'agap': return e.actions && e.actions.length > 1 ? EH('actions-gap') : null;
          case 'fc': return facts ? EH('fact-value-text') : null;
          case 'ffs': return facts ? EH('fact-value-font-size') : null;
          case 'flc': return facts ? EH('fact-border-color') : null;
          case 'flw': return EH('fact-border-width');
          case 'fpt': return EH('fact-padding-block');
          case 'sep': return EH('rule-color');
          default: return null;
        }
      }
      var card = variant === 'card', md = variant === 'md', plain = variant === 'none' || card;
      switch (id) {
        case 'bg': return card ? RP('header-card-background') : null;
        case 'bc': return card ? RP('header-card-border-color') : null;
        case 'bw': return card ? RP('header-card-border-width') : null;
        case 'rad': return card ? RP('header-card-radius') : null;
        case 'py': return card ? RP('header-card-padding-block') : null;
        case 'pl': return card ? RP('header-card-padding-inline-start') : null;
        case 'pr': return card ? RP('header-card-padding-inline-end') : null;
        case 'gap': return card ? RP('header-card-gap') : RP('header-gap');
        case 'mb': return md ? RP('header-md-margin-block-end') : RP('header-margin-block-end');
        case 'mfg': return card ? RP('header-card-media-text') : null;
        case 'tc': return RP('title-text');
        case 'tff': return RP('title-font-family');
        case 'tfs': return md ? RP('header-md-title-font-size') : RP('title-font-size');
        case 'tfw': return RP('title-font-weight');
        case 'xgap': return RP('text-row-gap');
        case 'agap': return plain ? null : RP('actions-gap');
        case 'dc': return plain ? RP('description-text') : null;
        case 'dfs': return plain ? RP('description-font-size') : null;
        case 'dlh': return plain ? RP('description-line-height') : null;
        case 'mgap': return RP('meta-gap');
        default: return null;
      }
    },
    reach: function (full) {
      if (/entity-header-tile-(blue|green|purple|red|brown|gray)-/.test(full)) return 'every entity header icon tile in that hue';
      if (/entity-header-/.test(full)) return 'every entity header';
      if (/header--card-/.test(full)) return 'every record page header with the card surface';
      if (/header--md-/.test(full)) return 'every MD record page header';
      return 'every record page header';
    },
    every: 'every record page header',
    html: function (variant, size, state, extraCls) { return isEntity(variant) ? entityHtml(variant, extraCls) : recordHtml(variant, extraCls); },
    after: drawEntities,
    labelSelector: '.plx-entity-header__title, .plx-record-page__title',
    parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', py: 'A', pl: 'A', pr: 'A', gap: 'A', egap: 'A', rgap: 'A', mb: 'A',
      avc: 'B', avw: 'B', tw: 'B', th: 'B', trad: 'B', tbg: 'B', tfg: 'B', mfg: 'B',
      cc: 'C', cfs: 'C', topgap: 'C',
      tc: 'D', tff: 'D', tfs: 'D', tfw: 'D', tlh: 'D', xgap: 'D', dc: 'D', dfs: 'D', dlh: 'D', mgap: 'D',
      agap: 'E',
      fc: 'F', ffs: 'F', flc: 'F', flw: 'F', fpt: 'F', sep: 'F' },
    anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-entity-header__media, .plx-record-page__media', side: 'left' }, C: { part: '.plx-entity-header__subtitle', side: 'top' },
      D: { part: '.plx-entity-header__title, .plx-record-page__title', side: 'left' }, E: { part: '.plx-entity-header__actions, .plx-record-page__actions', side: 'right' }, F: { part: '.plx-entity-header__details', side: 'bottom' } },
    sections: [['Surface', ['bg', 'bc', 'bw', 'rad', 'py', 'pl', 'pr', 'gap', 'egap', 'rgap', 'mb']], ['Media', ['avc', 'avw', 'tw', 'th', 'trad', 'tbg', 'tfg', 'mfg']],
      ['Heading and subtitle', ['cc', 'cfs', 'topgap']], ['Title', ['tc', 'tff', 'tfs', 'tfw', 'tlh', 'xgap']], ['Description and meta', ['dc', 'dfs', 'dlh', 'mgap']], ['Actions', ['agap']],
      ['Facts and rule', ['fc', 'ffs', 'flc', 'flw', 'fpt', 'sep']]],
    matrixLabel: 'Record page header values by kind', matrixColumnWidth: '--plx-ref-size-720px',
    statesHead: 'Entity headers and record page headers · ' + HEAD
  });
})();
