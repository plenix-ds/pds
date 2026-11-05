/* Plenix design system · library part w07K: the labs of the command bar (the owner's decisions of 2026-10-14): the Command
   bar in its layouts (one bar, rows selected: the swap of 2026-10-15, the view bar) and two widths, the selection bar
   (BulkActions, for pages without a command bar), and the
   Filter, Sort, Group, Columns and quick filter panels, each drawn with the markup the component renders, so every value
   shows with the one --plx-comp-* token behind it. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var STATIC = [['default', 'Default']];
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name) { return '<span class="plx-button__icon">' + DS.icon(name) + '</span>'; };
    // a ghost toolbar button: o.icon, o.only (icon only), o.caret, o.on (tinted), o.n (count badge), o.off (disabled), o.danger
    var btn = function (label, o) {
      o = o || {};
      var cls = 'plx-button plx-button--ghost plx-button--size-sm' + (o.only && !o.n ? ' plx-button--icon-only' : '') + (o.caret && !o.only ? ' plx-button--caret' : '') + (o.on || o.n ? ' is-selected' : '') + (o.bar ? ' plx-command-bar__button' : '') + (o.danger ? ' plx-command-bar__danger' : '');
      var badge = o.n ? '<span class="plx-badge plx-badge--active plx-badge--sm">' + o.n + '</span>' : '';
      var text = o.only ? (o.n ? badge : '') : '<span class="plx-button__label">' + label + (badge ? ' ' + badge : '') + '</span>';
      return '<button type="button" tabindex="-1" class="' + cls + '"' + (o.only ? ' aria-label="' + label + '"' : '') + (o.off ? ' disabled' : '') + '>' + (o.icon ? icon(o.icon) : '') + text + (o.caret && !o.only ? '<span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span>' : '') + '</button>';
    };
    var group = function (cls, inner) { return '<div class="plx-toolbar__group ' + cls + '">' + inner + '</div>'; };
    var SPACER = '<div class="plx-toolbar__spacer" aria-hidden="true"></div>';
    var search = function (only) {
      return only ? btn('Search', { icon: 'search', only: true }) : '<div class="plx-search plx-search--bar" role="search"><span class="plx-search__icon" aria-hidden="true">' + DS.icon('search') + '</span>'
        + '<input type="search" tabindex="-1" class="plx-search__input" aria-label="Search" placeholder="Search assets"></div>';
    };

    // ---- Command bar (<CommandBar>): the bars, their rows and sides, the count and the danger command
    var CB = function (n) { return 'plx-comp-command-bar-' + n; };
    var bar = function (label, inner) { return '<div class="plx-command-bar__bar"><div role="toolbar" aria-label="' + label + '" class="plx-toolbar plx-toolbar--bar plx-command-bar__row" data-plx-bar-row="">' + inner + '</div></div>'; };
    var DIVIDER = '<div role="separator" aria-orientation="vertical" class="plx-divider plx-divider--vertical"></div>';
    var commandBar = function (layout, only, extraCls) {
      var b = function (l, o) { return btn(l, Object.assign({ bar: true, only: only }, o)); };
      var view0 = group('plx-command-bar__view', b('Sort', { icon: 'sort' }) + b('Group', { icon: 'group-by' }) + b('View', { icon: 'view-table', caret: true }));
      if (layout === 'selected') {
        // the swap: the selection's commands (Rename disabled with two selected), the view side where it was, "× 2 selected"
        var sacts = group('plx-command-bar__actions', b('Download', { icon: 'download-arrow' }) + b('Move', { icon: 'move' }) + b('Rename', { icon: 'rename', off: true })
          + '<span class="plx-bar-actions__divider" aria-hidden="true"></span>' + b('Delete', { icon: 'trash', danger: true }));
        var clear = '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-command-bar__clear" aria-label="2 selected, clear the selection">' + icon('close')
          + '<span class="plx-button__label"><span class="plx-text plx-text--data plx-command-bar__number">2</span> selected</span></button>';
        return '<div class="ds-more-frame ds-more-frame--wide"><div class="plx-command-bar plx-command-bar--selecting' + (only ? ' plx-command-bar--icons' : '') + ex(extraCls) + '" data-plx-layout="one">'
          + bar('Assets actions', sacts + SPACER + view0 + group('plx-command-bar__end', DIVIDER + clear)) + '</div></div>';
      }
      var acts = group('plx-command-bar__actions', b('New', { icon: 'plus', caret: true }) + b('Upload', { icon: 'upload' }) + '<span class="plx-bar-actions__divider" aria-hidden="true"></span>' + b('Delete', { icon: 'trash', danger: true }));
      var find = group('plx-command-bar__find', search(only) + b('Filter', { icon: 'filter', n: 2 }));
      var view = group('plx-command-bar__view', b('Sort', { icon: 'sort' }) + b('Group', { icon: 'group-by' }) + b('View', { icon: 'view-table', caret: true }));
      var tail = group('plx-command-bar__end', (only ? '' : '<span class="plx-text plx-text--data plx-command-bar__count">24 assets</span>') + (layout === 'view' ? b('Export', { icon: 'export' }) : ''));
      var bars = layout === 'view' ? bar('Activity log', find + view + SPACER + tail) : bar('Assets', acts + DIVIDER + find + SPACER + view + tail);
      return '<div class="ds-more-frame ds-more-frame--wide"><div class="plx-command-bar' + (only ? ' plx-command-bar--icons' : '') + ex(extraCls) + '" data-plx-layout="' + layout + '">' + bars + '</div></div>';
    };
    var BAR = '.plx-command-bar__bar', ROW = '.plx-command-bar__row', SIDE = '.plx-command-bar__find', DIV = '.plx-bar-actions__divider', DANGER = '.plx-command-bar__danger';
    DS.registerLab('command-bar', {
      name: 'Command bar', title: 'Plenix command bar', file: 'platform/patterns/CommandBar/command-bar.css', compPrefix: /^plx-comp-command-bar-/,
      store: 'plenix-command-bar-lab-tokens', sizes: [['default', 'Default', '.plx-command-bar']],
      variants: [['one', 'One bar (1A)'], ['selected', 'Rows selected (the swap)'], ['view', 'View bar (1F)']], states: STATIC,
      content: [['labels', 'Icon and label'], ['icons', 'Icons only, the search as its icon (narrow)']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Width' },
      defaults: { size: 'default', variant: 'one', state: 'default', content: 'labels' },
      props: [
        { id: 'bg', label: 'Bar background', css: ['background-color'], part: BAR, cat: 'color' },
        { id: 'bc', label: 'Bar border color', css: ['border-block-start-color'], show: 'border-top-color', part: BAR, cat: 'color' },
        { id: 'bw', label: 'Bar border width', css: ['border-block-start-width'], show: 'border-top-width', part: BAR, cat: 'border-width' },
        { id: 'rad', label: 'Bar corners', css: ['border-start-start-radius'], show: 'border-top-left-radius', part: BAR, cat: 'radius' },
        { id: 'py', label: 'Bar padding top & bottom', css: ['padding-block-start'], show: 'padding-top', part: BAR, cat: 'space' },
        { id: 'px', label: 'Bar padding left & right', css: ['padding-inline-start'], show: 'padding-left', part: BAR, cat: 'space' },
        { id: 'sg', label: 'Space between the sides', css: ['column-gap'], part: ROW, cat: 'space' },
        { id: 'gg', label: 'Space between the controls of a side', css: ['column-gap'], part: SIDE, cat: 'space' },
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-command-bar__count', cat: 'color' },
        { id: 'dh', label: 'Divider height', css: ['block-size'], show: 'height', part: DIV, cat: 'icon' },
        { id: 'dc', label: 'Divider color', css: ['border-inline-start-color'], show: 'border-left-color', part: DIV, cat: 'color' },
        { id: 'dw', label: 'Divider width', css: ['border-inline-start-width'], show: 'border-left-width', part: DIV, cat: 'border-width' },
        { id: 'dt', label: 'Danger command color', css: ['color'], part: DANGER, cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var only = content === 'icons';
        switch (id) {
          case 'bg': return CB('background'); case 'bc': return CB('border-color'); case 'bw': return CB('border-width'); case 'rad': return CB('radius');
          case 'py': return CB('padding-block'); case 'px': return CB('padding-inline'); case 'sg': return 'plx-comp-toolbar-bar-group-gap'; case 'gg': return variant === 'selected' ? null : 'plx-comp-toolbar-bar-control-gap';
          case 'cc': return only || variant === 'selected' ? null : CB('count-text');
          case 'dh': return variant === 'view' ? null : CB('divider-height');
          case 'dc': return variant === 'view' ? null : CB('divider-color');
          case 'dw': return variant === 'view' ? null : CB('divider-width');
          case 'dt': return variant === 'view' ? null : CB('danger-text');
          default: return null;
        }
      },
      // the row is a Toolbar in its bar variant (0.57.0): its gaps are the bar toolbar's
      reach: function (full) { return /toolbar-bar-/.test(full) ? 'every toolbar in its bar variant (command bars, selection bars)' : /danger|divider/.test(full) ? 'every command bar and selection bar' : 'every command bar'; },
      every: 'every command bar',
      html: function (variant, size, state, extraCls, ui) { return commandBar(variant, ui.content === 'icons', extraCls); },
      labelSelector: '.plx-command-bar__count',
      parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', py: 'B', px: 'B', sg: 'C', gg: 'C', cc: 'D', dh: 'E', dc: 'E', dw: 'E', dt: 'E' },
      anchors: { A: { part: BAR, side: 'top' }, B: { part: BAR, side: 'left' }, C: { part: SIDE, side: 'bottom' }, D: { part: '.plx-command-bar__count', side: 'right' }, E: { part: DIV, side: 'top' } },
      sections: [['Bar', ['bg', 'bc', 'bw', 'rad', 'py', 'px']], ['Sides', ['sg', 'gg', 'cc']], ['Danger commands', ['dh', 'dc', 'dw', 'dt']]],
      matrixLabel: 'Command bar values by layout', statesHead: 'Layouts · ' + HEAD
    });

    // ---- Selection bar (<BulkActions>, the 2B bar): the commands, Select all and Clear, the count at the far end
    var BA = function (n) { return 'plx-comp-bulk-actions-' + n; }, SS = function (n) { return 'plx-comp-selection-summary-' + n; };
    var BDIV = '.plx-bulk-actions__divider', COUNT = '.plx-selection-summary__count', LIST = '.plx-bulk-actions__actions';
    DS.registerLab('bulk-action-bar', {
      name: 'Bulk action bar', title: 'Plenix selection bar', file: 'platform/patterns/BulkActions/bulk-actions.css', compPrefix: /^plx-comp-(bulk-actions|selection-summary)-/,
      store: 'plenix-bulk-action-bar-lab-tokens', sizes: [['default', 'Default', '.plx-bulk-actions']],
      variants: [['selected', 'Something selected'], ['empty', 'Nothing selected (always shown, actions disabled)']],
      states: STATIC, content: [['actions', 'Four commands and Delete']],
      labels: { size: 'Size', variant: 'Selection', state: 'State', content: 'Commands' },
      defaults: { size: 'default', variant: 'selected', state: 'default', content: 'actions' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: ['border-block-start-color'], show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: ['border-block-start-width'], show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: ['border-start-start-radius'], show: 'border-top-left-radius', cat: 'radius' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start'], show: 'padding-top', cat: 'space' },
        { id: 'px', label: 'Padding left & right', css: ['padding-inline-start'], show: 'padding-left', cat: 'space' },
        { id: 'gap', label: 'Gap (commands, count)', css: ['column-gap'], part: '.plx-bulk-actions__row', cat: 'space' },
        { id: 'lg', label: 'Gap between commands', css: ['column-gap'], part: LIST, cat: 'space' },
        { id: 'cfg', label: 'Count color', css: ['color'], part: COUNT, cat: 'color' },
        { id: 'cfs', label: 'Count font size', css: ['font-size'], part: COUNT, cat: 'font-size' },
        { id: 'cfw', label: 'Count font weight', css: ['font-weight'], part: COUNT, cat: 'font-weight' },
        { id: 'dh', label: 'Divider height', css: ['block-size'], show: 'height', part: BDIV, cat: 'icon' },
        { id: 'dc', label: 'Divider color', css: ['border-inline-start-color'], show: 'border-left-color', part: BDIV, cat: 'color' },
        { id: 'dw', label: 'Divider width', css: ['border-inline-start-width'], show: 'border-left-width', part: BDIV, cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var empty = variant === 'empty';
        switch (id) {
          case 'bg': return BA(empty ? 'empty-background' : 'background');
          case 'bc': return BA(empty ? 'empty-border-color' : 'border-color');
          case 'bw': return BA('border-width'); case 'rad': return BA('radius'); case 'py': return BA('padding-block'); case 'px': return BA('padding-inline');
          case 'gap': return BA('gap'); case 'lg': return 'plx-comp-toolbar-bar-control-gap'; // the bar toolbar's group gap (BulkActions is a bar toolbar)
          case 'cfg': return empty ? BA('empty-selection-summary-count-text') : SS('count-text');
          case 'cfs': return SS('count-font-size');
          case 'cfw': return empty ? BA('empty-selection-summary-count-font-weight') : SS('count-font-weight');
          case 'dh': return BA('divider-height');
          case 'dc': return BA(empty ? 'empty-divider-border-inline-start-color' : 'divider-border-inline-start-color');
          case 'dw': return BA('divider-border-inline-start-width');
          default: return null;
        }
      },
      reach: function (full) { return /-empty-/.test(full) ? 'every selection bar with nothing selected' : /selection-summary-/.test(full) ? 'every selection count' : 'every selection bar'; },
      every: 'every selection bar',
      html: function (variant, size, state, extraCls) {
        var empty = variant === 'empty', off = { off: empty };
        var cmds = btn('Download', Object.assign({ icon: 'download-arrow' }, off)) + btn('Move', Object.assign({ icon: 'move' }, off)) + btn('Share', Object.assign({ icon: 'share' }, off))
          + btn('Rename', { icon: 'rename', off: true }) + '<span class="plx-bar-actions__divider" aria-hidden="true"></span>' + btn('Delete', Object.assign({ icon: 'trash', danger: true }, off));
        return '<div class="ds-more-frame ds-more-frame--wide"><div class="plx-bulk-actions' + (empty ? ' plx-bulk-actions--empty' : '') + ex(extraCls) + '"><div role="toolbar" aria-label="Selection actions" class="plx-toolbar plx-toolbar--bar plx-bulk-actions__row" data-plx-bar-row="">'
          + group('plx-bulk-actions__actions', cmds + '<span class="plx-bulk-actions__divider" aria-hidden="true"></span>' + btn('Select all') + btn('Clear', { off: empty })) + SPACER
          + group('plx-bulk-actions__end', '<span class="plx-selection-summary__count" aria-live="polite"><span class="plx-text plx-text--data plx-selection-summary__number">' + (empty ? '0' : '3') + '</span> selected</span>')
          + '</div></div></div>';
      },
      labelSelector: COUNT,
      parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', py: 'B', px: 'B', gap: 'B', lg: 'C', cfg: 'D', cfs: 'D', cfw: 'D', dh: 'E', dc: 'E', dw: 'E' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'left' }, C: { part: LIST, side: 'bottom' }, D: { part: COUNT, side: 'bottom' }, E: { part: BDIV, side: 'top' } },
      sections: [['Bar', ['bg', 'bc', 'bw', 'rad']], ['Spacing', ['py', 'px', 'gap', 'lg']], ['Count', ['cfg', 'cfs', 'cfw']], ['Divider', ['dh', 'dc', 'dw']]],
      matrixLabel: 'Selection bar values by selection', statesHead: 'Selections · ' + HEAD
    });

    // ---- the panels (FilterPanel, SortPanel, GroupPanel): the bar button, or the panel drawn open with its rows
    var FP = function (n) { return 'plx-comp-find-panel-' + n; };
    var pick = function (label, size, ic) { return '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-find-pick plx-find-pick--' + size + ' plx-button--caret">' + (ic ? icon(ic) : '') + '<span class="plx-button__label">' + label + '</span><span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span></button>'; };
    var pills = function (list) { return '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-find-pick plx-find-pick--value plx-button--caret"><span class="plx-button__label"><span class="plx-find-pick__pills">' + list.map(function (x) { return '<span class="plx-find-pill" data-plx-category="' + x[1] + '">' + x[0] + '</span>'; }).join('') + '</span></span><span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span></button>'; };
    var tool = function (label, ic) { return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--icon-only' + (ic === 'drag' ? ' plx-find-panel__handle' : '') + '" aria-label="' + label + '">' + icon(ic) + '</button>'; };
    var head = function (title, sub, actions) { return '<div class="plx-find-panel__head"><div class="plx-find-panel__title-row"><span class="plx-find-panel__title"><span class="plx-text plx-text--heading">' + title + '</span>' + tool('About', 'circle-info') + '</span>' + (actions ? '<span class="plx-find-panel__actions">' + actions + '</span>' : '') + '</div>' + (sub ? '<span class="plx-text plx-text--secondary">' + sub + '</span>' : '') + '</div>'; };
    var row = function (inner) { return '<div class="plx-find-panel__row" tabindex="-1">' + inner + '</div>'; };
    var add = function (labels) { return '<div class="plx-find-panel__add">' + labels.map(function (l) { return btn(l, { icon: 'plus' }); }).join('') + '</div>'; };
    var panel = function (kind, inner, extraCls) { return '<div class="ds-more-frame ds-more-frame--wide"><div class="plx-find-panel plx-find-panel--' + kind + ex(extraCls) + '">' + inner + '</div></div>'; };
    var barButton = function (label, ic, n, extraCls) { return '<div class="ds-more-frame"><div role="toolbar" aria-label="Find" class="plx-toolbar' + ex(extraCls) + '">' + btn(label, { icon: ic, n: n, bar: true }) + '</div></div>'; };
    var levelRows = function (levels) { return levels.map(function (l) { return row(pick(l[0], 'field', l[1]) + pick(l[2], 'dir') + tool('Remove', 'close') + tool('Reorder', 'drag')); }).join(''); };
    var ROWPROPS = [
      { id: 'pg', label: 'Space between head, rows and Add', css: ['row-gap'], cat: 'space' },
      { id: 'mw', label: 'Narrowest panel', css: ['min-inline-size'], show: 'min-width', cat: 'size' },
      { id: 'rg', label: 'Space between rows', css: ['row-gap'], part: '.plx-find-panel__rows', cat: 'space' },
      { id: 'cg', label: 'Space between a row’s controls', css: ['column-gap'], part: '.plx-find-panel__row', cat: 'space' },
      { id: 'rr', label: 'Row corners', css: ['border-start-start-radius'], show: 'border-top-left-radius', part: '.plx-find-panel__row', cat: 'radius' },
      { id: 'fw', label: 'Field picker width', css: ['inline-size'], show: 'width', part: '.plx-find-pick--field', cat: 'size' },
      { id: 'dw', label: 'Direction picker width', css: ['inline-size'], show: 'width', part: '.plx-find-pick--dir', cat: 'size' },
      { id: 'ag', label: 'Space between Add buttons', css: ['column-gap'], part: '.plx-find-panel__add', cat: 'space' }
    ];
    var rowToken = function (id, kind) { if (id === 'dw' && kind === 'filter') return null; return { pg: FP('gap'), mw: FP('min-width'), rg: FP('rows-gap'), cg: FP('row-gap'), rr: FP('row-radius'), fw: FP('pick-field-width'), dw: FP('pick-dir-width'), ag: FP('add-gap') }[id] || null; };
    var panelLab = function (id, name, kind, idle, ic, extraProps, extraToken, body, contents) {
      DS.registerLab(id, {
        name: name, title: 'Plenix ' + name.toLowerCase(), file: 'platform/patterns/CommandBar/find-panel.css', compPrefix: /^plx-comp-find-panel-/,
        store: 'plenix-' + id + '-lab-tokens', sizes: [['default', 'Default', '.plx-find-panel']],
        variants: [['idle', idle]].concat(kind === 'filter' ? [['active', 'Filter with conditions (tint and count)']] : []),
        states: STATIC, content: contents, labels: { size: 'Size', variant: 'Bar button', state: 'State', content: 'Panel' },
        defaults: { size: 'default', variant: 'idle', state: 'default', content: contents[0][0] },
        props: ROWPROPS.concat(extraProps), token: function (pid, size, variant, state, content) { return rowToken(pid, kind) || extraToken(pid, content); },
        reach: function () { return 'every Filter, Sort and Group panel'; }, every: 'every find-and-view panel',
        html: function (variant, size, state, extraCls, ui) { return panel(kind, body(ui.content, variant), extraCls); },
        labelSelector: '.plx-find-panel__title .plx-text',
        parts: { pg: 'A', mw: 'A', rg: 'B', cg: 'B', rr: 'B', fw: 'C', dw: 'C', ag: 'D', jw: 'C', ow: 'C', vw: 'C', fb: 'E', fp: 'E', nb: 'E', pr: 'F', pbw: 'F', pfs: 'F', pfw: 'F', ppx: 'F' },
        anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-find-panel__row', side: 'left' }, C: { part: '.plx-find-pick--field', side: 'bottom' }, D: { part: '.plx-find-panel__add', side: 'bottom' }, E: { part: '.plx-find-panel__rows', side: 'right' }, F: { part: '.plx-find-pill', side: 'top' } },
        sections: [['Panel', ['pg', 'mw']], ['Rows', ['rg', 'cg', 'rr', 'fw', 'dw']].concat([]), ['Add', ['ag']]].concat(extraProps.length ? [['More', extraProps.map(function (p) { return p.id; })]] : []),
        matrixLabel: name + ' values', statesHead: name + ' · ' + HEAD
      });
    };
    // Filter: the conditions framed, a condition group on the sunken surface, the values as pills
    panelLab('filter-panel', 'Filter panel', 'filter', 'Filter (no conditions)', 'filter', [
      { id: 'jw', label: 'Join picker width', css: ['inline-size'], show: 'width', part: '.plx-find-pick--join', cat: 'size' },
      { id: 'ow', label: 'Operator picker width', css: ['inline-size'], show: 'width', part: '.plx-find-pick--op', cat: 'size' },
      { id: 'vw', label: 'Value width', css: ['inline-size'], show: 'width', part: '.plx-find-pick--value', cat: 'size' },
      { id: 'fb', label: 'Conditions frame color', css: ['border-block-start-color'], show: 'border-top-color', part: '.plx-find-panel__rows--framed', cat: 'color' },
      { id: 'fp', label: 'Conditions frame padding', css: ['padding-block-start'], show: 'padding-top', part: '.plx-find-panel__rows--framed', cat: 'space' },
      { id: 'nb', label: 'Condition group background', css: ['background-color'], part: '.plx-find-panel__rows--nested', cat: 'color' },
      { id: 'pr', label: 'Pill corners', css: ['border-start-start-radius'], show: 'border-top-left-radius', part: '.plx-find-pill', cat: 'radius' },
      { id: 'pbw', label: 'Pill border width', css: ['border-block-start-width'], show: 'border-top-width', part: '.plx-find-pill', cat: 'border-width' },
      { id: 'pfs', label: 'Pill text size', css: ['font-size'], part: '.plx-find-pill', cat: 'font-size' },
      { id: 'pfw', label: 'Pill text weight', css: ['font-weight'], part: '.plx-find-pill', cat: 'font-weight' },
      { id: 'ppx', label: 'Pill padding left & right', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-find-pill', cat: 'space' }
    ], function (pid) { return { jw: FP('pick-join-width'), ow: FP('pick-op-width'), vw: FP('pick-value-width'), fb: FP('frame-border-color'), fp: FP('frame-padding'), nb: FP('nested-background'), pr: FP('pill-radius'), pbw: FP('pill-border-width'), pfs: FP('pill-font-size'), pfw: FP('pill-font-weight'), ppx: FP('pill-padding-inline') }[pid] || null; },
    function () {
      var cond = function (j, f, fi, op, val) { return row(j + pick(f, 'field', fi) + pick(op, 'op') + val + tool('Remove condition', 'trash') + tool('Reorder', 'drag')); };
      var where = '<span class="plx-text plx-text--secondary plx-find-panel__join">Where</span>';
      return head('Filter', 'In this view, show records') + '<div class="plx-find-panel__rows plx-find-panel__rows--framed">'
        + cond(where, 'Type', 'field-select', 'is any of', pills([['Image', 'blue'], ['Video', 'green']]))
        + cond(pick('and', 'join'), 'Name', 'ed-text', 'contains', '<input type="text" tabindex="-1" class="plx-input plx-find-pick--value" aria-label="Name" value="logo">')
        + row('<span class="plx-text plx-text--secondary plx-find-panel__join">and</span><div class="plx-find-panel__group"><div class="plx-find-panel__rows plx-find-panel__rows--framed plx-find-panel__rows--nested">'
          + cond(where, 'Category', 'field-select', 'is none of', pills([['Finance', 'orange']])) + '</div></div>' + tool('Remove condition group', 'trash') + tool('Reorder', 'drag'))
        + '</div>' + add(['Add condition', 'Add condition group']);
    }, [['conditions', 'The panel with conditions and a group']]);
    // Sort: two levels, or the title while grouped
    panelLab('sort-panel', 'Sort control', 'sort', 'Sort (no levels)', 'sort', [], function () { return null; }, function (content) {
      return head(content === 'grouped' ? 'Sort within groups by' : 'Sort by') + '<div class="plx-find-panel__rows">' + levelRows([['Modified', 'calendar', 'Newest → oldest'], ['Name', 'ed-text', 'A → Z']]) + '</div>' + add(['Add another sort']);
    }, [['levels', 'Two sort levels'], ['grouped', 'Sort within groups by']]);
    // Group: two levels, Collapse all and Expand all
    panelLab('group-panel', 'Grouping', 'group', 'Group (not grouped)', 'group-by', [
      { id: 'hg', label: 'Space between the head’s actions', css: ['column-gap'], part: '.plx-find-panel__actions', cat: 'space' }
    ], function (pid) { return pid === 'hg' ? FP('actions-gap') : null; }, function () {
      return head('Group by', null, btn('Collapse all') + btn('Expand all')) + '<div class="plx-find-panel__rows">' + levelRows([['Type', 'field-select', 'First → Last'], ['Category', 'field-select', 'First → Last']]) + '</div>' + add(['Add subgroup']);
    }, [['levels', 'A group and a subgroup']]);

    // ---- Columns (<ColumnsMenu>, <ManageColumnsDialog>): the list of columns
    var CL = function (n) { return 'plx-comp-columns-list-' + n; };
    var colRow = function (name, first, hidden) {
      return '<div class="plx-columns-list__row" tabindex="-1"><span class="plx-columns-list__handle" aria-hidden="true">' + DS.icon('drag') + '</span>'
        + '<label class="plx-checkbox"><input type="checkbox" tabindex="-1" class="plx-checkbox__input"' + (hidden ? '' : ' checked') + (first ? ' disabled' : '') + '><span class="plx-checkbox__label">' + name + '</span></label>'
        + (first ? '<span class="plx-columns-list__first">' + DS.icon('pin-filled') + '<span class="plx-text plx-text--secondary">First column</span></span>' : '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs">' + icon('pin') + '<span class="plx-button__label">Make first column</span></button>')
        + tool('Move up', 'chevron-up') + tool('Move down', 'chevron-down') + '</div>';
    };
    DS.registerLab('columns-menu', {
      name: 'Reordering', title: 'Plenix columns list', file: 'platform/patterns/CommandBar/find-panel.css', compPrefix: /^plx-comp-(columns-list|find-panel)-/,
      store: 'plenix-columns-menu-lab-tokens', sizes: [['default', 'Default', '.plx-columns-list']],
      variants: [['dropdown', 'The Columns dropdown'], ['dialog', 'The Manage columns dialog']], states: STATIC, content: [['list', 'Five columns, one hidden']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Columns' }, defaults: { size: 'default', variant: 'dropdown', state: 'default', content: 'list' },
      props: [
        { id: 'gap', label: 'Space between rows', css: ['row-gap'], cat: 'space' },
        { id: 'cg', label: 'Space in a row', css: ['column-gap'], part: '.plx-columns-list__row', cat: 'space' },
        { id: 'pad', label: 'Row padding', css: ['padding-block-start'], show: 'padding-top', part: '.plx-columns-list__row', cat: 'space' },
        { id: 'rad', label: 'Row corners', css: ['border-start-start-radius'], show: 'border-top-left-radius', part: '.plx-columns-list__row', cat: 'radius' },
        { id: 'hc', label: 'Handle color', css: ['color'], part: '.plx-columns-list__handle', cat: 'color' },
        { id: 'fc', label: 'First column mark color', css: ['color'], part: '.plx-columns-list__first', cat: 'color' },
        { id: 'fg', label: 'First column mark gap', css: ['column-gap'], part: '.plx-columns-list__first', cat: 'space' }
      ],
      token: function (id) { return { gap: CL('gap'), cg: CL('row-gap'), pad: CL('row-padding'), rad: CL('row-radius'), hc: 'plx-comp-find-panel-handle-text', fc: CL('first-text'), fg: CL('first-gap') }[id] || null; },
      reach: function () { return 'every Columns list (the dropdown and the dialog)'; }, every: 'every Columns list',
      html: function (variant, size, state, extraCls) {
        return '<div class="ds-more-frame ds-more-frame--wide"><div class="plx-columns-list' + ex(extraCls) + '">' + colRow('Name', true) + colRow('Type') + colRow('Category') + colRow('Size (MB)', false, true) + colRow('Modified') + '</div></div>';
      },
      labelSelector: '.plx-checkbox__label', parts: { gap: 'A', cg: 'B', pad: 'B', rad: 'B', hc: 'C', fc: 'D', fg: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-columns-list__row', side: 'top' }, C: { part: '.plx-columns-list__handle', side: 'left' }, D: { part: '.plx-columns-list__first', side: 'bottom' } },
      sections: [['List', ['gap']], ['Row', ['cg', 'pad', 'rad', 'hc']], ['First column', ['fc', 'fg']]],
      matrixLabel: 'Columns list values', statesHead: 'Forms · ' + HEAD
    });

    // ---- Quick filters (<QuickFilter>): the searchable checklist, or the presets and range
    DS.registerLab('quick-filter', {
      name: 'Quick filters', title: 'Plenix quick filter', file: 'platform/patterns/CommandBar/find-panel.css', compPrefix: /^plx-comp-find-panel-/,
      store: 'plenix-quick-filter-lab-tokens', sizes: [['default', 'Default', '.plx-find-panel']],
      variants: [['list', 'Searchable checklist (Tags, Category, Type)'], ['date', 'Presets and a range (Date)']], states: STATIC, content: [['chosen', 'One chosen']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Choice' }, defaults: { size: 'default', variant: 'list', state: 'default', content: 'chosen' },
      props: [
        { id: 'pg', label: 'Space between the find field and the list', css: ['row-gap'], cat: 'space' },
        { id: 'cl', label: 'Space between the values', css: ['row-gap'], part: '.plx-find-panel__checklist', cat: 'space' },
        { id: 'rg', label: 'Space between From and To', css: ['column-gap'], part: '.plx-find-panel__range', cat: 'space' }
      ],
      token: function (id, size, variant) { return id === 'pg' ? FP('gap') : id === 'cl' ? (variant === 'list' ? FP('checklist-gap') : null) : id === 'rg' ? (variant === 'date' ? FP('range-gap') : null) : null; },
      reach: function () { return 'every quick filter panel'; }, every: 'every quick filter panel',
      html: function (variant, size, state, extraCls) {
        var check = function (v, c, on) { return '<label class="plx-checkbox"><input type="checkbox" tabindex="-1" class="plx-checkbox__input"' + (on ? ' checked' : '') + '><span class="plx-checkbox__label"><span class="plx-find-pill" data-plx-category="' + c + '">' + v + '</span></span></label>'; };
        var field = function (l, v) { return '<div class="plx-field"><label class="plx-field__label">' + l + '</label><input type="date" tabindex="-1" class="plx-input plx-input--data" value="' + v + '"></div>'; };
        var body = variant === 'date'
          ? '<div role="radiogroup" aria-label="Date" class="plx-radio-group">' + ['Any time', 'Last 7 days', 'Last 30 days', 'This year', 'Custom range'].map(function (x, i) { return '<label class="plx-radio"><input type="radio" tabindex="-1" class="plx-radio__input" name="w07k-date"' + (i === 1 ? ' checked' : '') + '><span class="plx-radio__label">' + x + '</span></label>'; }).join('') + '</div>'
            + '<div class="plx-find-panel__range">' + field('From', '') + field('To', '') + '</div>'
          : search().replace('plx-search--bar', 'plx-search--fill').replace('Search assets', 'Find a tag') + '<div class="plx-find-panel__checklist">' + check('Approved', 'green') + check('Draft', 'purple') + check('Client', 'orange', true) + check('Internal', 'teal') + '</div>';
        return '<div class="ds-more-frame"><div class="plx-find-panel plx-find-panel--' + (variant === 'date' ? 'date' : 'checklist') + ex(extraCls) + '">' + body + '</div></div>';
      },
      labelSelector: '.plx-find-pill', parts: { pg: 'A', cl: 'B', rg: 'B' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-find-panel__checklist', side: 'right' } },
      sections: [['Panel', ['pg', 'cl', 'rg']]],
      matrixLabel: 'Quick filter values by kind', statesHead: 'Kinds · ' + HEAD
    });
  })();
}
