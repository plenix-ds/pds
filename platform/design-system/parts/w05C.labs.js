/* Plenix design system · library part w05C: the labs of wave 5, lane C. CommandMenu, the CommandPalette pattern,
   DownloadButton, BackToTop, the rich tooltip (and the tooltip's four placements), and the three new dialog leaves
   (non-modal, prompt, full screen), each drawn in place with the markup the component renders, so every variant shows
   with the one --plx-comp-* token behind each value. The dialog leaves reuse the Dialog lab's values (overlay-labs.js),
   which is registered again here with the two new variants. */
if (window.DS && DS.registerLab) {
  (function () {
    var STATIC = [['default', 'Default']];
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var icon = function (name) { return DS.icon(name); };
    var BTN = function (variant, label, more) { return '<button type="button" tabindex="-1" class="plx-button plx-button--' + variant + (more ? ' ' + more : '') + '"><span class="plx-button__label">' + label + '</span></button>'; };

    // ---- Command menu (<CommandMenu>, div.plx-command-menu): grouped, with shortcuts, nested pages, loading, empty
    var CM = function (n) { return 'plx-comp-command-menu-' + n; };
    var search = function (value, placeholder, loading) {
      return '<div class="plx-search plx-command-menu__search" role="search"><span class="plx-search__icon" aria-hidden="true">' + (loading ? '<span class="plx-spinner plx-spinner--sm" role="status" aria-label="Searching"></span>' : icon('search')) + '</span>'
        + '<input type="search" tabindex="-1" class="plx-search__input" aria-label="Commands" placeholder="' + placeholder + '" value="' + value + '"></div>';
    };
    var item = function (label, opts) {
      opts = opts || {};
      return '<div role="option" aria-selected="' + (opts.active ? 'true' : 'false') + '"' + (opts.disabled ? ' aria-disabled="true"' : '') + ' class="plx-command-menu__item' + (opts.active ? ' is-active' : '') + '">'
        + (opts.icon ? '<span class="plx-command-menu__icon" aria-hidden="true">' + icon(opts.icon) + '</span>' : '')
        + '<span class="plx-command-menu__text"><span class="plx-command-menu__label">' + label + '</span>' + (opts.description ? '<span class="plx-command-menu__description">' + opts.description + '</span>' : '') + '</span>'
        + (opts.keys ? '<kbd class="plx-kbd plx-command-menu__shortcut">' + opts.keys + '</kbd>' : '')
        + (opts.page ? '<span class="plx-command-menu__chevron" aria-hidden="true">' + icon('chevron-right') + '</span>' : '') + '</div>';
    };
    var group = function (label, rows) { return '<div role="group" aria-label="' + label + '" class="plx-command-menu__group"><div class="plx-command-menu__group-label" role="presentation">' + label + '</div>' + rows + '</div>'; };
    var menu = function (variant, extraCls) {
      var page = '', field = search('', 'Type a command or search'), rows;
      if (variant === 'grouped') rows = group('Create', item('Create collection', { icon: 'folder-add', active: true }) + item('Upload files', { icon: 'upload', description: 'Add files to this project' })) + group('Go to', item('Open settings', { icon: 'gear' }) + item('Open trash', { icon: 'trash', disabled: true }));
      else if (variant === 'shortcuts') rows = group('Edit', item('Rename', { icon: 'rename', keys: 'F2', active: true }) + item('Duplicate', { icon: 'ed-copy', keys: 'Ctrl D' }) + item('Delete', { icon: 'trash', keys: 'Delete' }));
      else if (variant === 'nested') {
        page = '<div class="plx-command-menu__page"><button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only" aria-label="Back"><span class="plx-button__icon">' + icon('arrow-left') + '</span></button><span class="plx-command-menu__page-title">Change theme</span></div>';
        field = search('', 'Choose a theme');
        rows = item('Light', { active: true }) + item('Dark') + item('Match the system', { page: true });
      } else if (variant === 'loading') { field = search('inv', 'Type a command or search', true); rows = '<div class="plx-command-menu__status">Loading</div>'; }
      else { field = search('zebra', 'Type a command or search'); rows = '<div class="plx-command-menu__status">No results for “zebra”</div>'; }
      var status = variant === 'loading' || variant === 'empty';
      return '<div class="ds-w05c-menu"><div class="plx-command-menu' + ex(extraCls) + '">' + page + field + (status ? '<div role="listbox" aria-label="Commands" hidden class="plx-command-menu__list"></div>' + rows : '<div role="listbox" aria-label="Commands" class="plx-command-menu__list">' + rows + '</div>') + '</div></div>';
    };
    DS.registerLab('command-menu', {
      name: 'Command menu', title: 'Plenix command menu', file: 'platform/components/CommandMenu/command-menu.css', compPrefix: /^plx-comp-command-menu-/,
      store: 'plenix-command-menu-lab-tokens', sizes: [['default', 'Default', '.plx-command-menu']],
      variants: [['grouped', 'Grouped'], ['shortcuts', 'With shortcuts'], ['nested', 'Nested pages'], ['loading', 'Loading'], ['empty', 'Empty']], states: STATIC,
      content: [['commands', 'Commands']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'grouped', state: 'default', content: 'commands' },
      props: [
        { id: 'gap', label: 'Gap between the field and the list', css: ['row-gap'], cat: 'space' },
        { id: 'lmh', label: 'List maximum height', css: ['max-block-size'], show: 'max-height', part: '.plx-command-menu__list', cat: 'size' },
        { id: 'gfg', label: 'Group label color', css: ['color'], part: '.plx-command-menu__group-label', cat: 'color' },
        { id: 'gfs', label: 'Group label size', css: ['font-size'], part: '.plx-command-menu__group-label', cat: 'font-size' },
        { id: 'gfw', label: 'Group label weight', css: ['font-weight'], part: '.plx-command-menu__group-label', cat: 'font-weight' },
        { id: 'gpt', label: 'Space above a group label', css: ['padding-top'], part: '.plx-command-menu__group-label', cat: 'space' },
        { id: 'ifg', label: 'Command text color', css: ['color'], part: '.plx-command-menu__item', cat: 'color' },
        { id: 'ifs', label: 'Command text size', css: ['font-size'], part: '.plx-command-menu__item', cat: 'font-size' },
        { id: 'ih', label: 'Command row minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-command-menu__item', cat: 'control-height' },
        { id: 'ipx', label: 'Command row padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-command-menu__item', cat: 'space' },
        { id: 'igap', label: 'Gap inside a row', css: ['column-gap'], part: '.plx-command-menu__item', cat: 'space' },
        { id: 'irad', label: 'Row corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-command-menu__item', cat: 'radius' },
        { id: 'abg', label: 'Active row background', css: ['background-color'], part: '.plx-command-menu__item.is-active', cat: 'color' },
        { id: 'icfg', label: 'Icon color', css: ['color'], part: '.plx-command-menu__icon, .plx-command-menu__chevron', cat: 'color' },
        { id: 'dfg', label: 'Description color', css: ['color'], part: '.plx-command-menu__description', cat: 'color' },
        { id: 'dfs', label: 'Description size', css: ['font-size'], part: '.plx-command-menu__description', cat: 'font-size' },
        { id: 'xfg', label: 'Disabled command color', css: ['color'], part: '.plx-command-menu__item[aria-disabled="true"]', cat: 'color' },
        { id: 'ptfg', label: 'Page name color', css: ['color'], part: '.plx-command-menu__page-title', cat: 'color' },
        { id: 'ptfw', label: 'Page name weight', css: ['font-weight'], part: '.plx-command-menu__page-title', cat: 'font-weight' },
        { id: 'pgap', label: 'Gap after Back', css: ['column-gap'], part: '.plx-command-menu__page', cat: 'space' },
        { id: 'sfg', label: 'Status text color', css: ['color'], part: '.plx-command-menu__status', cat: 'color' },
        { id: 'sfs', label: 'Status text size', css: ['font-size'], part: '.plx-command-menu__status', cat: 'font-size' },
        { id: 'spy', label: 'Status padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-command-menu__status', cat: 'space' }
      ],
      token: function (id, size, variant) {
        var rows = variant === 'grouped' || variant === 'shortcuts' || variant === 'nested', grouped = variant === 'grouped' || variant === 'shortcuts';
        var status = variant === 'loading' || variant === 'empty';
        switch (id) {
          case 'gap': return CM('gap');
          case 'lmh': return CM('list-max-height');
          case 'gfg': return grouped ? CM('group-label-text') : null;
          case 'gfs': return grouped ? CM('group-label-font-size') : null;
          case 'gfw': return grouped ? CM('group-label-font-weight') : null;
          case 'gpt': return grouped ? CM('group-label-padding-block-start') : null;
          case 'ifg': return rows ? CM('item-text') : null;
          case 'ifs': return rows ? CM('item-font-size') : null;
          case 'ih': return rows ? CM('item-min-height') : null;
          case 'ipx': return rows ? CM('item-padding-inline') : null;
          case 'igap': return rows ? CM('item-gap') : null;
          case 'irad': return rows ? CM('item-radius') : null;
          case 'abg': return rows ? CM('item-active-background') : null;
          case 'icfg': return grouped || variant === 'nested' ? CM('icon-color') : null;
          case 'dfg': return variant === 'grouped' ? CM('description-text') : null;
          case 'dfs': return variant === 'grouped' ? CM('description-font-size') : null;
          case 'xfg': return variant === 'grouped' ? CM('item-disabled-text') : null;
          case 'ptfg': return variant === 'nested' ? CM('page-title-text') : null;
          case 'ptfw': return variant === 'nested' ? CM('page-title-font-weight') : null;
          case 'pgap': return variant === 'nested' ? CM('page-gap') : null;
          case 'sfg': return status ? CM('status-text') : null;
          case 'sfs': return status ? CM('status-font-size') : null;
          case 'spy': return status ? CM('status-padding-block') : null;
          default: return null;
        }
      },
      reach: function (full) { return /status/.test(full) ? 'every Loading and No results row' : /group-label/.test(full) ? 'every group heading of a command menu' : 'every command menu and command palette'; },
      every: 'every command menu',
      html: function (variant, size, state, extraCls) { return menu(variant, extraCls); },
      labelSelector: '.plx-command-menu__label, .plx-command-menu__status',
      parts: { gap: 'A', lmh: 'A', gfg: 'B', gfs: 'B', gfw: 'B', gpt: 'B', ifg: 'C', ifs: 'C', ih: 'C', ipx: 'C', igap: 'C', irad: 'C', abg: 'C', icfg: 'C', dfg: 'C', dfs: 'C', xfg: 'C', ptfg: 'D', ptfw: 'D', pgap: 'D', sfg: 'E', sfs: 'E', spy: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-command-menu__group-label', side: 'top' }, C: { part: '.plx-command-menu__item', side: 'right' }, D: { part: '.plx-command-menu__page', side: 'top' }, E: { part: '.plx-command-menu__status', side: 'bottom' } },
      sections: [['Menu', ['gap', 'lmh']], ['Group labels', ['gfg', 'gfs', 'gfw', 'gpt']], ['Commands', ['ifg', 'ifs', 'ih', 'ipx', 'igap', 'irad', 'abg', 'icfg', 'dfg', 'dfs', 'xfg']], ['Page', ['ptfg', 'ptfw', 'pgap']], ['Status', ['sfg', 'sfs', 'spy']]],
      matrixLabel: 'Command menu values by variant', matrixColumnWidth: '--plx-ref-size-500px',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Command palette (<CommandPalette>): the Dialog (md) with the CommandMenu; global and scoped draw the same
    var CP = function (n) { return 'plx-comp-command-palette-' + n; };
    DS.registerLab('command-palette', {
      name: 'Command palette', title: 'Plenix command palette', file: 'platform/patterns/CommandPalette/command-palette.css', compPrefix: /^plx-comp-command-palette-/,
      store: 'plenix-command-palette-lab-tokens', sizes: [['md', 'MD (560px)', '.plx-command-palette']],
      variants: [['global', 'Global (Ctrl K)'], ['scoped', 'Scoped']], states: STATIC, content: [['commands', 'Commands']],
      labels: { size: 'Size', variant: 'Scope', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'global', state: 'default', content: 'commands' },
      props: [
        { id: 'gap', label: 'Gap between the field and the list', css: ['row-gap'], part: '.plx-command-palette__menu', cat: 'space' },
        { id: 'lmh', label: 'List maximum height', css: ['max-block-size'], show: 'max-height', part: '.plx-command-menu__list', cat: 'size' }
      ],
      token: function (id) { return id === 'gap' ? CP('gap') : id === 'lmh' ? CP('list-max-height') : null; },
      reach: function () { return 'every command palette'; },
      every: 'every command palette',
      html: function (variant, size, state, extraCls) {
        var title = variant === 'scoped' ? 'Editor commands' : 'Commands';
        var rows = group('Create', item('Create collection', { icon: 'folder-add', keys: 'Ctrl Shift N', active: true }) + item('Upload files', { icon: 'upload', keys: 'Ctrl U' })) + group('Go to', item('Open settings', { icon: 'gear', keys: 'Ctrl ,' }));
        return '<div role="dialog" aria-label="' + title + '" class="plx-dialog plx-dialog--md plx-command-palette' + ex(extraCls) + '">'
          + '<div class="plx-dialog__header"><h2 class="plx-dialog__title">' + title + '</h2><button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--icon-only plx-dialog__close" aria-label="Close">' + icon('close') + '</button></div>'
          + '<div class="plx-dialog__body"><div class="plx-command-menu plx-command-palette__menu">' + search('', 'Type a command or search') + '<div role="listbox" aria-label="' + title + '" class="plx-command-menu__list">' + rows + '</div></div></div></div>';
      },
      labelSelector: '.plx-dialog__title',
      parts: { gap: 'A', lmh: 'B' },
      anchors: { A: { part: '.plx-command-palette__menu', side: 'left' }, B: { part: '.plx-command-menu__list', side: 'right' } },
      sections: [['Palette', ['gap', 'lmh']]],
      matrixLabel: 'Command palette values by scope', matrixColumnWidth: '--plx-ref-size-560px',
      statesHead: 'Scopes · ' + HEAD
    });

    // ---- Download button (<DownloadButton>): icon, with label, with size and format, in progress
    var DB = function (n) { return 'plx-comp-download-button-' + n; };
    var SZ = function (size) { return size === 'md' ? '' : ' plx-button--size-' + size; };
    DS.registerLab('download-button', {
      name: 'Download button', title: 'Plenix download button', file: 'platform/components/DownloadButton/download-button.css', compPrefix: /^plx-comp-download-button-/,
      store: 'plenix-download-button-lab-tokens', sizes: [['md', 'MD (default)', '.plx-download-button'], ['sm', 'SM', '.plx-button--size-sm'], ['xs', 'XS', '.plx-button--size-xs']],
      variants: [['icon', 'Icon'], ['label', 'With label'], ['meta', 'With size and format'], ['progress', 'In progress']], states: STATIC, content: [['file', 'A file']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'meta', state: 'default', content: 'file' },
      props: [
        { id: 'mfg', label: 'File facts color', css: ['color'], part: '.plx-download-button__meta', cat: 'color' },
        { id: 'mff', label: 'File facts font', css: ['font-family'], part: '.plx-download-button__meta', cat: 'font' },
        { id: 'mfs', label: 'File facts size', css: ['font-size'], part: '.plx-download-button__meta', cat: 'font-size' },
        { id: 'mfw', label: 'File facts weight', css: ['font-weight'], part: '.plx-download-button__meta', cat: 'font-weight' },
        { id: 'mgap', label: 'Space before the file facts', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-download-button__meta', cat: 'space' },
        { id: 'pff', label: 'Percent font', css: ['font-family'], part: '.plx-download-button__percent', cat: 'font' },
        { id: 'pgap', label: 'Space before the percent', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-download-button__percent', cat: 'space' }
      ],
      token: function (id, size, variant) {
        var meta = variant === 'meta', prog = variant === 'progress';
        switch (id) {
          case 'mfg': return meta ? DB('meta-text') : null;
          case 'mff': return meta ? DB('meta-font-family') : null;
          case 'mfs': return meta ? DB('meta-font-size') : null;
          case 'mfw': return meta ? DB('meta-font-weight') : null;
          case 'mgap': return meta ? DB('meta-gap') : null;
          case 'pff': return prog ? DB('percent-font-family') : null;
          case 'pgap': return prog ? DB('percent-gap') : null;
          default: return null;
        }
      },
      reach: function () { return 'every download button'; },
      every: 'every download button',
      html: function (variant, size, state, extraCls) {
        var cls = 'plx-button plx-button--secondary' + SZ(size) + ' plx-download-button' + ex(extraCls);
        if (variant === 'icon') return '<button type="button" tabindex="-1" class="' + cls + ' plx-button--icon-only" aria-label="Download cross-014.png (PNG, 4.2 MB)"><span class="plx-button__icon">' + icon('download-arrow') + '</span></button>';
        if (variant === 'progress') return '<button type="button" tabindex="-1" aria-busy="true" aria-disabled="true" class="' + cls + ' is-loading"><span class="plx-button__icon"><span class="plx-spinner plx-spinner--sm" aria-hidden="true"></span></span><span class="plx-button__label">Downloading<span class="plx-download-button__percent">45%</span></span></button>';
        return '<button type="button" tabindex="-1" class="' + cls + '"><span class="plx-button__icon">' + icon('download-arrow') + '</span><span class="plx-button__label">Download' + (variant === 'meta' ? '<span class="plx-download-button__meta">PNG · 4.2 MB</span>' : '') + '</span></button>';
      },
      labelSelector: '.plx-button__label',
      parts: { mfg: 'A', mff: 'A', mfs: 'A', mfw: 'A', mgap: 'A', pff: 'B', pgap: 'B' },
      anchors: { A: { part: '.plx-download-button__meta', side: 'top' }, B: { part: '.plx-download-button__percent', side: 'top' } },
      sections: [['File facts', ['mfg', 'mff', 'mfs', 'mfw', 'mgap']], ['Progress', ['pff', 'pgap']]],
      matrixLabel: 'Download button values by variant', matrixColumnWidth: '--plx-ref-size-240px',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Back to top (<BackToTop>): floating (in a contained frame, so it stays beside its specimen) and inline
    var BT = function (n) { return 'plx-comp-back-to-top-' + n; };
    DS.registerLab('back-to-top', {
      name: 'Back to top', title: 'Plenix back to top', file: 'platform/components/BackToTop/back-to-top.css', compPrefix: /^plx-comp-back-to-top-/,
      store: 'plenix-back-to-top-lab-tokens', sizes: [['default', 'Default', '.plx-back-to-top']],
      variants: [['floating', 'Floating (default)'], ['inline', 'Inline']], states: STATIC, content: [['page', 'A long page']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'floating', state: 'default', content: 'page' },
      props: [
        { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
        { id: 'ib', label: 'Space from the bottom edge', css: ['inset-block-end'], show: 'bottom', cat: 'space' },
        { id: 'ie', label: 'Space from the end edge', css: ['inset-inline-end'], show: 'right', cat: 'space' }
      ],
      token: function (id, size, variant) {
        if (variant !== 'floating') return null;
        return id === 'sh' ? BT('shadow') : id === 'ib' ? BT('inset-block-end') : id === 'ie' ? BT('inset-inline-end') : null;
      },
      reach: function () { return 'every floating back-to-top button'; },
      every: 'every back-to-top button',
      html: function (variant, size, state, extraCls) {
        if (variant === 'inline') return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-back-to-top plx-back-to-top--inline' + ex(extraCls) + '"><span class="plx-button__icon">' + icon('arrow-up') + '</span><span class="plx-button__label">Back to top</span></button>';
        return '<div class="ds-w05c-window"><button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--icon-only plx-back-to-top plx-back-to-top--floating is-shown' + ex(extraCls) + '" aria-label="Back to top"><span class="plx-button__icon">' + icon('arrow-up') + '</span></button></div>';
      },
      labelSelector: '.plx-button__label',
      parts: { sh: 'A', ib: 'A', ie: 'A' },
      anchors: { A: { part: null, side: 'left' } },
      sections: [['Floating', ['sh', 'ib', 'ie']]],
      matrixLabel: 'Back to top values by variant', matrixColumnWidth: '--plx-ref-size-320px',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Rich tooltip (<Tooltip title action>): text only, title and text, with an action; and the plain tooltip on its
    // four sides (the size axis is the placement)
    var TT = function (n) { return 'plx-comp-tooltip-' + n; };
    var SIDE_NAMES = { bottom: 'Bottom (default)', top: 'Top', start: 'Start', end: 'End' };
    DS.registerLab('rich-tooltip', {
      name: 'Rich tooltip', title: 'Plenix rich tooltip', file: 'platform/components/Tooltip/tooltip.css', compPrefix: /^plx-comp-tooltip-/,
      store: 'plenix-rich-tooltip-lab-tokens',
      sizes: ['bottom', 'top', 'start', 'end'].map(function (s) { return [s, SIDE_NAMES[s], '.plx-tooltip__bubble--' + s]; }),
      variants: [['plain', 'Plain'], ['text', 'Text only'], ['title', 'Title and text'], ['action', 'With an action']], states: STATIC, content: [['help', 'Help']],
      labels: { size: 'Placement', variant: 'Content', state: 'State', content: 'Content' },
      defaults: { size: 'bottom', variant: 'title', state: 'default', content: 'help' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: ['border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color'], show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: ['border-top-width'], cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
        { id: 'pad', label: 'Padding', css: ['padding-top'], cat: 'space' },
        { id: 'pdy', label: 'Padding top & bottom', css: ['padding-top'], cat: 'space' },
        { id: 'pdx', label: 'Padding left & right', css: ['padding-left'], cat: 'space' },
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'fs', label: 'Text size', css: ['font-size'], cat: 'font-size' },
        { id: 'gap', label: 'Space between the title and the text', css: ['row-gap'], part: '.plx-tooltip__content', cat: 'space' },
        { id: 'tfg', label: 'Title color', css: ['color'], part: '.plx-tooltip__title', cat: 'color' },
        { id: 'tff', label: 'Title font', css: ['font-family'], part: '.plx-tooltip__title', cat: 'font' },
        { id: 'tfw', label: 'Title weight', css: ['font-weight'], part: '.plx-tooltip__title', cat: 'font-weight' },
        { id: 'amt', label: 'Space above the action', css: ['margin-top'], part: '.plx-tooltip__action', cat: 'space' },
        { id: 'arr', label: 'Arrow color', css: ['border-bottom-color'], pseudo: '::before', cat: 'color' }
      ],
      token: function (id, size, variant) {
        var plain = variant === 'plain', title = variant === 'title' || variant === 'action';
        if (plain) {
          switch (id) {
            case 'bg': return TT('bubble-background');
            case 'fg': return TT('bubble-text');
            case 'rad': return TT('bubble-radius');
            case 'pdy': return TT('bubble-padding-block');
            case 'pdx': return TT('bubble-padding-inline');
            case 'fs': return TT('bubble-font-size');
            case 'arr': return size === 'bottom' ? TT('bubble-bottom-arrow-color') : null;
            default: return null;
          }
        }
        switch (id) {
          case 'bg': return TT('rich-background');
          case 'fg': return TT('rich-text');
          case 'bc': return TT('rich-border-color');
          case 'bw': return TT('rich-border-width');
          case 'rad': return TT('rich-radius');
          case 'sh': return TT('rich-shadow');
          case 'pad': return TT('rich-padding');
          case 'mw': return TT('rich-max-width');
          case 'fs': return TT('rich-font-size');
          case 'gap': return title ? TT('rich-gap') : null;
          case 'tfg': return title ? TT('rich-title-text') : null;
          case 'tff': return title ? TT('rich-title-font-family') : null;
          case 'tfw': return title ? TT('rich-title-font-weight') : null;
          case 'amt': return variant === 'action' ? TT('rich-action-margin-block-start') : null;
          default: return null;
        }
      },
      reach: function (full) { return /rich/.test(full) ? 'every rich tooltip' : 'every tooltip'; },
      every: 'every tooltip',
      html: function (variant, size, state, extraCls) {
        var cls = 'plx-tooltip__bubble plx-tooltip__bubble--' + size + (variant === 'plain' ? '' : ' plx-tooltip__bubble--rich') + ' is-open' + ex(extraCls);
        if (variant === 'plain') return '<div class="ds-w05c-tip"><span role="tooltip" class="' + cls + '">Upload files</span></div>';
        var content = '<span role="tooltip" class="plx-tooltip__content">' + (variant === 'text' ? '' : '<span class="plx-tooltip__title">Retention</span>')
          + '<span class="plx-tooltip__body">Deleted files stay in the trash for 30 days, then they are gone for good.</span></span>';
        var action = variant === 'action' ? '<span class="plx-tooltip__action"><a href="#lab" tabindex="-1" class="plx-link plx-link--standalone">About the trash</a></span>' : '';
        return '<div class="ds-w05c-tip"><span class="' + cls + '">' + content + action + '</span></div>';
      },
      labelSelector: '.plx-tooltip__title, .plx-tooltip__body, .plx-tooltip__bubble',
      parts: { bg: 'A', fg: 'A', bc: 'A', bw: 'A', rad: 'A', sh: 'A', pad: 'A', pdy: 'A', pdx: 'A', mw: 'A', fs: 'A', arr: 'A', gap: 'B', tfg: 'B', tff: 'B', tfw: 'B', amt: 'C' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-tooltip__title', side: 'top' }, C: { part: '.plx-tooltip__action', side: 'bottom' } },
      sections: [['Surface', ['bg', 'fg', 'bc', 'bw', 'rad', 'sh', 'pad', 'pdy', 'pdx', 'mw', 'fs', 'arr']], ['Title', ['gap', 'tfg', 'tff', 'tfw']], ['Action', ['amt']]],
      matrixLabel: 'Tooltip values by content and placement', matrixColumnWidth: '--plx-ref-size-400px',
      statesHead: 'Content · ' + HEAD
    });

    // ---- Dialog (overlay-labs.js) again, with the non-modal and prompt variants; and the labs of the three new leaves,
    // which draw the same window with the Dialog lab's values
    var base = DS.labs && DS.labs.dialog;
    if (base) {
      var FIELD = function (error) {
        return '<div class="plx-field plx-field--stacked' + (error ? ' is-invalid' : '') + '"><div class="plx-field__head"><span class="plx-tooltip plx-field__label-tip"><label class="plx-field__label">Name</label></span></div>'
          + '<div class="plx-field__control"><input type="text" tabindex="-1" class="plx-input" aria-label="Name" value="' + (error ? '' : 'Cross 014') + '"' + (error ? ' aria-invalid="true"' : '') + '>'
          + (error ? '<div class="plx-field__error">Enter a name.</div>' : '') + '</div></div>';
      };
      var CLOSE = '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--icon-only plx-dialog__close" aria-label="Close">' + icon('close') + '</button>';
      var prompt = function (size, error, extraCls) {
        return '<div role="dialog" aria-label="Rename asset" class="plx-dialog plx-dialog--' + size + ex(extraCls) + '">'
          + '<div class="plx-dialog__header"><h2 class="plx-dialog__title">Rename asset</h2>' + CLOSE + '</div>'
          + '<div class="plx-dialog__body"><p class="plx-dialog__description">The new name shows on the asset card.</p>' + FIELD(error) + '</div>'
          + '<div class="plx-dialog__footer">' + BTN('secondary', 'Cancel') + BTN('primary', 'Rename') + '</div></div>';
      };
      var tool = function (size, extraCls) {
        return '<div class="plx-modal-layer--non-modal ds-w05c-layer"><div role="dialog" aria-label="Find and replace" class="plx-dialog plx-dialog--' + size + ex(extraCls) + '">'
          + '<div class="plx-dialog__header"><h2 class="plx-dialog__title">Find and replace</h2>' + CLOSE + '</div>'
          + '<div class="plx-dialog__body"><p class="plx-dialog__description">The page stays usable while this window is open.</p></div>'
          + '<div class="plx-dialog__footer">' + BTN('secondary', 'Replace') + BTN('primary', 'Find next') + '</div></div></div>';
      };
      var drawDialog = function (variant, size, state, extraCls) {
        if (variant === 'prompt' || variant === 'prompt-error') return prompt(size, variant === 'prompt-error', extraCls);
        if (variant === 'non-modal') return tool(size, extraCls);
        return base.html.apply(this, arguments);
      };
      DS.registerLab('dialog', Object.assign({}, base, {
        variants: base.variants.concat([['non-modal', 'Non-modal (show)'], ['prompt', 'Prompt (one field)']]),
        html: drawDialog
      }));
      var leaf = function (id, name, file, sizes, variants, defaults, every) {
        DS.registerLab(id, Object.assign({}, base, {
          name: name, title: 'Plenix ' + name.toLowerCase(), store: 'plenix-' + id + '-lab-tokens', file: file || base.file,
          sizes: sizes, variants: variants, defaults: Object.assign({}, base.defaults, defaults), html: drawDialog, every: every,
          matrixLabel: name + ' values', matrixColumnWidth: '--plx-ref-size-560px'
        }));
      };
      var sized = function (list) { return list.map(function (s) { return [s[0], s[1], '.plx-dialog--' + s[0]]; }); };
      leaf('non-modal-dialog', 'Non-modal dialog', null, sized([['sm', 'SM (400px)'], ['md', 'MD (560px)']]), [['non-modal', 'Non-modal (show)']], { size: 'sm', variant: 'non-modal' }, 'every non-modal dialog');
      leaf('prompt-dialog', 'Prompt dialog', null, sized([['sm', 'SM (400px, default)']]), [['prompt', 'Prompt (one field)'], ['prompt-error', 'With an error']], { size: 'sm', variant: 'prompt' }, 'every prompt dialog');
      leaf('full-screen-dialog', 'Full-screen dialog', null, sized([['full', 'Full screen']]), [['default', 'Dialog']], { size: 'full', variant: 'default' }, 'every full-screen dialog');
    }
  })();
}
