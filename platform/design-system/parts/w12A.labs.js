/* Plenix design system · library part w12A: the labs of wave 12, lane A. MediaCard gains its asset and collection parts
   (the media card lab, and the Asset lab of its own), FileList, FileBrowser, UploadManager and VersionCompare, each drawn
   in place with the markup the pattern renders, so every value shows with the one --plx-comp-* token behind it. The rows,
   the bar, the tree and the badges inside are their components' (their labs have their values). */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name, cls) { return DS.icon(name, cls); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var btn = function (o) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--' + (o.variant || 'secondary') + (o.size ? ' plx-button--size-' + o.size : '') + (o.iconOnly ? ' plx-button--icon-only' : '') + ex(o.cls) + '"'
        + (o.label ? ' aria-label="' + o.label + '"' : '') + '>' + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + (o.text ? '<span class="plx-button__label">' + o.text + '</span>' : '') + '</button>';
    };
    var badge = function (tone, ic, text, sm) { return '<span class="plx-badge plx-badge--' + tone + (sm ? ' plx-badge--sm' : '') + '">' + (ic ? icon(ic, 'plx-badge__icon') : '') + text + '</span>'; };
    var data = function (t) { return '<span class="plx-text plx-text--data">' + t + '</span>'; };
    // one FileRow, drawn as FileRow draws it
    var fileRow = function (o) {
      var dot = o.name.lastIndexOf('.'), folder = o.kind === 'folder';
      var base = !folder && dot > 0 ? o.name.slice(0, dot) : o.name, ext = !folder && dot > 0 ? o.name.slice(dot) : '';
      var file = '<span class="plx-file plx-file--' + (folder ? 'folder' : 'file') + ' plx-file--line"><span class="plx-file__icon" aria-hidden="true">' + icon(o.icon || (folder ? 'folder' : 'file-pdf')) + '</span><span class="plx-file__text">'
        + '<button type="button" tabindex="-1" class="plx-file__name' + (folder ? '' : ' plx-file__name--data') + '"><span class="plx-file__base">' + base + '</span>' + (ext ? '<span class="plx-file__ext">' + ext + '</span>' : '') + '</button></span></span>';
      var body = o.error ? '<span class="plx-file-row__error" role="alert">' + icon('alert', 'plx-file-row__error-icon') + '<span class="plx-file-row__error-text">' + o.error + '</span></span>'
        : typeof o.progress === 'number' ? '<span class="plx-file-row__progress"><div class="plx-progress-bar plx-progress-bar--sm plx-progress-bar--info plx-file-row__bar"><progress class="plx-progress-bar__track plx-progress-bar__meter" value="' + o.progress + '" max="100" aria-label="Uploading ' + o.name + '"></progress></div><span class="plx-file-row__percent" aria-hidden="true">' + o.progress + '%</span></span>'
          : '<span class="plx-file-row__cell plx-file-row__size">' + (o.size || '') + '</span>' + (o.date ? '<time class="plx-file-row__cell plx-file-row__date">' + o.date + '</time>' : '') + (o.status ? '<span class="plx-file-row__cell plx-file-row__status">' + o.status + '</span>' : '');
      var tail = o.error ? btn({ size: 'xs', icon: 'refresh', text: 'Try again' }) : typeof o.progress === 'number' ? btn({ variant: 'ghost', size: 'xs', text: 'Cancel' })
        : o.actions ? btn({ variant: 'ghost', size: 'xs', iconOnly: true, icon: 'more', label: 'More actions for ' + o.name }) : '';
      return '<li class="plx-file-list__item"><div class="plx-file-row' + (typeof o.progress === 'number' ? ' plx-file-row--progress' : '') + (o.actions || o.error ? ' plx-file-row--actions' : '') + (o.error ? ' is-error' : '') + '">'
        + (o.select ? '<span class="plx-file-row__select"><label class="plx-check"><input type="checkbox" tabindex="-1" class="plx-check__input" aria-label="Select ' + o.name + '"></label></span>' : '')
        + '<span class="plx-file-row__file">' + file + '</span>' + body + (tail ? '<span class="plx-file-row__actions">' + tail + '</span>' : '') + '</div></li>';
    };
    var FILES = [{ name: 'Brand kit', kind: 'folder', size: '24 items', date: 'Sep 28, 2026', select: true, actions: true },
      { name: 'Letterhead 2026.pdf', size: '1.2 MB', date: 'Oct 14, 2026', select: true, actions: true },
      { name: 'Cross 014.png', icon: 'file-png', size: '482 kB', date: 'Oct 12, 2026', select: true, actions: true }];
    var rows = function (list, label) { return '<ul class="plx-file-row-list plx-file-list__rows" aria-label="' + (label || 'Files') + '">' + list.map(fileRow).join('') + '</ul>'; };

    // ---- MediaCard's asset and collection parts: the media card lab gains the two variants, and Asset has its own lab
    var MCL = DS.labs && DS.labs['media-card'];
    if (MCL) {
      var MC = function (n) { return 'plx-comp-media-card-' + n; };
      var TYPE = '.plx-media-card__type', STATUS = '.plx-media-card__status', BACK = '.plx-media-card-stack__back', MIDDLE = '.plx-media-card-stack__middle';
      var ASSET_PROPS = [
        { id: 'tyb', label: 'Format badge inset (top)', css: ['inset-block-start'], show: 'top', part: TYPE, cat: 'space' },
        { id: 'tye', label: 'Format badge inset (end)', css: ['inset-inline-end'], show: 'right', part: TYPE, cat: 'space' },
        { id: 'stp', label: 'Space above the status', css: ['padding-block-start'], show: 'padding-top', part: STATUS, cat: 'space' },
        { id: 'shh', label: 'Sheet height', css: ['block-size'], show: 'height', part: BACK, cat: 'size' },
        { id: 'shb', label: 'Sheet fill', css: ['background-color'], part: BACK, cat: 'color' },
        { id: 'shc', label: 'Sheet border color', css: ['border-block-start-color'], show: 'border-top-color', part: BACK, cat: 'color' },
        { id: 'shw', label: 'Sheet border width', css: ['border-block-start-width'], show: 'border-top-width', part: BACK, cat: 'border-width' },
        { id: 'shr', label: 'Sheet corners', css: ['border-start-start-radius', 'border-start-end-radius'], show: 'border-top-left-radius', part: BACK, cat: 'radius' },
        { id: 'sbi', label: 'Back sheet inset', css: ['margin-inline-start', 'margin-inline-end'], show: 'margin-left', part: BACK, cat: 'space' },
        { id: 'smi', label: 'Middle sheet inset', css: ['margin-inline-start', 'margin-inline-end'], show: 'margin-left', part: MIDDLE, cat: 'space' }
      ];
      var mine = function (id) { return ASSET_PROPS.some(function (p) { return p.id === id; }); };
      var hasPart = {}; MCL.props.forEach(function (p) { hasPart[p.id] = !!p.part; });
      var assetToken = function (id, variant, state) {
        var coll = variant === 'collection';
        switch (id) {
          case 'tyb': return coll ? null : MC('type-inset-block-start');
          case 'tye': return coll ? null : MC('type-inset-inline-end');
          case 'stp': return coll ? null : MC('status-padding-block-start');
          case 'shh': return coll ? MC('stack-sheet-height') : null;
          case 'shb': return coll ? MC('stack-sheet-background') : null;
          case 'shc': return coll ? MC('stack-sheet-border-color') : null;
          case 'shw': return coll ? MC('stack-sheet-border-width') : null;
          case 'shr': return coll ? MC('stack-sheet-radius') : null;
          case 'sbi': return coll ? MC('stack-back-inset') : null;
          case 'smi': return coll ? MC('stack-middle-inset') : null;
          default: return null;
        }
      };
      var assetHtml = function (variant, state, extraCls) {
        var coll = variant === 'collection', name = coll ? 'Easter 2026' : 'Window 03.jpg';
        var card = '<article class="plx-media-card plx-media-card--interactive plx-media-card--selectable' + (state === 'hover' ? ' is-hover' : '') + (coll ? '' : ex(extraCls)) + '">'
          + '<div class="plx-media-card__media" data-plx-aspect="4/3"><span class="plx-media-card__placeholder">' + icon(coll ? 'briefcase' : 'image-b', 'plx-icon--size-lg') + '</span>'
          + (coll ? '' : '<span class="plx-media-card__type">' + badge('neutral', 'file-jpg', 'JPG', true) + '</span>') + '</div>'
          + '<input type="checkbox" tabindex="-1" class="plx-media-card__select" aria-label="Select ' + name + '">'
          + '<div class="plx-media-card__info"><div class="plx-media-card__text"><button type="button" tabindex="-1" class="plx-media-card__title' + (state === 'focus' ? ' is-focus-visible' : '') + '">' + name + '</button>'
          + '<span class="plx-media-card__meta">' + (coll ? '24 assets' : '3.4 MB · Oct 15') + '</span>'
          + (coll ? '' : '<span class="plx-media-card__status">' + badge('success', 'circle-check', 'Approved') + '</span>') + '</div></div></article>';
        if (coll) card = '<div class="plx-media-card-stack' + ex(extraCls) + '"><span class="plx-media-card-stack__back" aria-hidden="true"></span><span class="plx-media-card-stack__middle" aria-hidden="true"></span>' + card + '</div>';
        return '<div class="ds-data-box ds-data-box--media">' + card + '</div>';
      };
      var token = function (id, size, variant, state, content) {
        if (variant === 'asset' || variant === 'collection') {
          if (mine(id)) return assetToken(id, variant, state);
          if (variant === 'collection' && !hasPart[id]) return null;   // the specimen is the stack: the card's own values are measured on the asset
          return MCL.token(id, size, 'square', state, content);
        }
        return mine(id) ? null : MCL.token(id, size, variant, state, content);
      };
      var html = function (variant, size, state, extraCls, ui) { return variant === 'asset' || variant === 'collection' ? assetHtml(variant, state, extraCls) : MCL.html(variant, size, state, extraCls, ui); };
      var parts = Object.assign({}, MCL.parts, { tyb: 'H', tye: 'H', stp: 'I', shh: 'J', shb: 'J', shc: 'J', shw: 'J', shr: 'J', sbi: 'J', smi: 'K' });
      var anchors = Object.assign({}, MCL.anchors, { H: { part: TYPE, side: 'right' }, I: { part: STATUS, side: 'bottom' }, J: { part: BACK, side: 'top' }, K: { part: MIDDLE, side: 'left' } });
      var reach = function (full) { return /-stack-/.test(full) ? 'every collection card' : /-(type|status)-/.test(full) ? 'every asset card' : MCL.reach(full); };
      var sections = MCL.sections.concat([['Asset (format, status)', ['tyb', 'tye', 'stp']], ['Collection (the sheets)', ['shh', 'shb', 'shc', 'shw', 'shr', 'sbi', 'smi']]]);
      DS.registerLab('media-card', Object.assign({}, MCL, { variants: MCL.variants.concat([['asset', 'Asset'], ['collection', 'Collection']]), props: MCL.props.concat(ASSET_PROPS),
        token: token, html: html, parts: parts, anchors: anchors, sections: sections, reach: reach }));
      DS.registerLab('asset', Object.assign({}, DS.labs['media-card'], { name: 'Asset', title: 'Plenix asset', store: 'plenix-asset-lab-tokens',
        variants: [['asset', 'Asset'], ['collection', 'Collection']], defaults: Object.assign({}, MCL.defaults, { variant: 'asset' }), every: 'every asset and collection card',
        matrixLabel: 'Asset values by kind and state', statesHead: 'Kinds and states · ' + HEAD }));
    }

    // ---- FileList (<FileList>): the space between its parts; the sortable list's bar (the count and the Sort menu)
    var FLT = function (n) { return 'plx-comp-file-list-' + n; };
    var cells = function () {
      return '<div class="ds-w12a-cells" role="presentation"><div class="ds-w12a-cell-row ds-w12a-cell-row--head"><span>Name</span><span>Size</span><span>Modified</span></div>'
        + FILES.map(function (f) { return '<div class="ds-w12a-cell-row"><span>' + f.name + '</span>' + data(f.size) + data(f.date) + '</div>'; }).join('') + '</div>';
    };
    DS.registerLab('file-list', {
      name: 'File list', title: 'Plenix file list', file: 'platform/patterns/FileList/file-list.css', compPrefix: /^plx-comp-file-list-/,
      store: 'plenix-file-list-lab-tokens', sizes: [['default', 'Default', '.plx-file-list']],
      variants: [['list', 'List (default)'], ['table', 'Table'], ['sortable', 'Sortable']],
      states: [['default', 'Default']], content: [['files', 'A folder and two files']],
      labels: { size: 'Size', variant: 'Look', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'sortable', state: 'default', content: 'files' },
      props: [
        { id: 'g', label: 'Space between the bar and the rows', css: ['row-gap'], cat: 'space' },
        { id: 'bg', label: 'Gap (count to Sort)', css: ['column-gap'], part: '.plx-file-list__bar', cat: 'space' },
        { id: 'bh', label: 'Bar least height', css: ['min-block-size'], show: 'min-height', part: '.plx-file-list__bar', cat: 'size' },
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-file-list__count', cat: 'color' },
        { id: 'cf', label: 'Count font (data)', css: ['font-family'], part: '.plx-file-list__count', cat: 'font' },
        { id: 'cs', label: 'Count size', css: ['font-size'], part: '.plx-file-list__count', cat: 'font-size' },
        { id: 'cl', label: 'Count line height', css: ['line-height'], part: '.plx-file-list__count', cat: 'line-height' }
      ],
      token: function (id, size, variant) {
        var sortable = variant === 'sortable';
        if (id === 'g') return FLT(sortable ? 'sortable-gap' : 'gap');
        if (!sortable) return null;
        return { bg: FLT('bar-gap'), bh: FLT('bar-min-height'), cc: FLT('count-text'), cf: FLT('count-font-family'), cs: FLT('count-font-size'), cl: FLT('count-line-height') }[id] || null;
      },
      reach: function (full) { return /sortable|bar|count/.test(full) ? 'every sortable file list' : 'every file list'; }, every: 'every file list',
      html: function (variant, size, state, extraCls) {
        var bar = variant === 'sortable' ? '<div class="plx-file-list__bar"><span class="plx-text plx-text--data plx-file-list__count">3 items</span>' + btn({ variant: 'ghost', size: 'sm', icon: 'sort-ascending', text: 'Sort by name', cls: 'plx-button--caret' }) + '</div>' : '';
        return '<div class="ds-w12a-lab ds-w12a-lab--wide"><div class="plx-file-list plx-file-list--' + variant + ex(extraCls) + '">' + bar + (variant === 'table' ? cells() : rows(FILES)) + '</div></div>';
      },
      labelSelector: '.plx-file__base',
      parts: { g: 'A', bg: 'B', bh: 'B', cc: 'C', cf: 'C', cs: 'C', cl: 'C' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-file-list__bar', side: 'top' }, C: { part: '.plx-file-list__count', side: 'bottom' } },
      sections: [['List', ['g']], ['Sort bar', ['bg', 'bh']], ['Count', ['cc', 'cf', 'cs', 'cl']]],
      matrixLabel: 'File list values by look', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Looks · ' + HEAD
    });

    // ---- FileBrowser (<FileBrowser>): the space between the breadcrumbs, the bar and the body; the tree's pane; the content
    var FB = function (n) { return 'plx-comp-file-browser-' + n; };
    var crumbs = '<nav aria-label="Location" class="plx-breadcrumbs plx-file-browser__path"><ol class="plx-breadcrumbs__list"><li class="plx-breadcrumbs__item"><a class="plx-breadcrumbs__link" href="#root" tabindex="-1">Library</a></li>'
      + '<li class="plx-breadcrumbs__item"><span class="plx-breadcrumbs__current" aria-current="page">Brand kit</span></li></ol></nav>';
    var cmdBar = '<div class="plx-command-bar" data-plx-layout="one" data-plx-position="static"><div class="plx-command-bar__bar"><div role="toolbar" aria-label="Brand kit" class="plx-toolbar plx-command-bar__row">'
      + btn({ variant: 'ghost', size: 'sm', icon: 'folder-add', text: 'New folder' }) + btn({ variant: 'ghost', size: 'sm', icon: 'upload', text: 'Upload' })
      + '<span class="plx-text plx-text--data plx-command-bar__count">3 items</span></div></div></div>';
    var treeHtml = function (focus) {
      var item = function (label, level, sel, open, kids) {
        return '<li role="treeitem" aria-level="' + level + '" tabindex="-1" aria-selected="' + !!sel + '"' + (kids ? ' aria-expanded="' + !!open + '"' : '') + ' class="plx-tree__item' + (sel ? ' is-selected' : '') + '"><div class="plx-tree__row' + (sel ? ' is-selected' : '') + '" data-plx-level="' + Math.min(level, 12) + '"><span class="plx-tree__toggle' + (open ? ' is-open' : '') + (kids ? '' : ' is-leaf') + '" aria-hidden="true">' + (kids ? DS.icon(open ? 'square-minus' : 'square-plus', 'plx-icon--outline') : '') + '</span>'
          + '<span class="plx-tree__icon">' + icon(open || sel ? 'folder-open' : 'folder') + '</span><span class="plx-tree__label"><span class="plx-file-browser__target plx-dnd-target">' + label + '</span></span></div>' + (kids ? '<ul role="group" class="plx-tree__group">' + kids + '</ul>' : '') + '</li>';
      };
      return '<div class="plx-file-browser__tree"><div class="plx-resizable plx-file-browser__pane" data-plx-width="240px"><div class="plx-resizable__content"><div class="plx-file-browser__tree-scroll' + (focus ? ' ds-focus' : '') + '" role="region" aria-label="Folders">'
        + '<ul role="tree" aria-label="Folders" class="plx-tree">' + item('Library', 1, false, true, item('Brand kit', 2, true, false) + item('Archive', 2, false, false)) + '</ul></div></div></div></div>';
    };
    var gridHtml = '<ul aria-label="Brand kit" class="plx-content-grid plx-content-grid--sm plx-file-browser__grid">' + [['Logos', 'folder', '12 items'], ['Letterhead 2026.pdf', 'file-pdf', 'PDF · 1.2 MB'], ['Cross 014.png', 'file-png', 'PNG · 482 kB']].map(function (c) {
      return '<li class="plx-content-grid__item"><div class="plx-file-browser__card"><article class="plx-media-card plx-media-card--interactive plx-media-card--selectable"><div class="plx-media-card__media" data-plx-aspect="4/3"><span class="plx-media-card__placeholder">' + icon(c[1], 'plx-icon--size-lg') + '</span></div>'
        + '<input type="checkbox" tabindex="-1" class="plx-media-card__select" aria-label="Select ' + c[0] + '"><div class="plx-media-card__info"><div class="plx-media-card__text"><button type="button" tabindex="-1" class="plx-media-card__title">' + c[0] + '</button><span class="plx-media-card__meta">' + c[2] + '</span></div></div></article></div></li>';
    }).join('') + '</ul>';
    DS.registerLab('file-browser', {
      name: 'File browser', title: 'Plenix file browser', file: 'platform/patterns/FileBrowser/file-browser.css', compPrefix: /^plx-comp-file-browser-/,
      store: 'plenix-file-browser-lab-tokens', sizes: [['default', 'Default', '.plx-file-browser']],
      variants: [['list', 'List (default)'], ['grid', 'Grid'], ['tree', 'With the tree'], ['breadcrumbs', 'With breadcrumbs']],
      states: [['default', 'Default'], ['focus', 'Focus (the tree’s scrolling region)']], content: [['folder', 'A folder open']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'tree', state: 'default', content: 'folder' },
      props: [
        { id: 'g', label: 'Space between breadcrumbs, bar and body', css: ['row-gap'], cat: 'space' },
        { id: 'bg', label: 'Gap (tree to content)', css: ['column-gap'], part: '.plx-file-browser__body', cat: 'space' },
        { id: 'tc', label: 'Tree line color', css: ['border-inline-end-color'], show: 'border-right-color', part: '.plx-file-browser__tree', cat: 'color' },
        { id: 'tw', label: 'Tree line width', css: ['border-inline-end-width'], show: 'border-right-width', part: '.plx-file-browser__tree', cat: 'border-width' },
        { id: 'tp', label: 'Tree padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-file-browser__tree-scroll', cat: 'space' },
        { id: 'ti', label: 'Tree padding (to its line)', css: ['padding-inline-end'], show: 'padding-right', part: '.plx-file-browser__tree-scroll', cat: 'space' },
        { id: 'th', label: 'Tree tallest height', css: ['max-block-size'], show: 'max-height', part: '.plx-file-browser__tree-scroll', cat: 'size' },
        { id: 'oc', label: 'Focus ring color', css: ['outline-color'], part: '.plx-file-browser__tree-scroll', cat: 'color' },
        { id: 'ow', label: 'Focus ring width', css: ['outline-width'], part: '.plx-file-browser__tree-scroll', cat: 'border-width' },
        { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], part: '.plx-file-browser__tree-scroll', cat: 'space' },
        { id: 'ch', label: 'Content least height', css: ['min-block-size'], show: 'min-height', part: '.plx-file-browser__content', cat: 'size' }
      ],
      token: function (id, size, variant, state) {
        var tree = variant === 'tree', focus = tree && state === 'focus';
        switch (id) {
          case 'g': return FB('gap');
          case 'bg': return FB(tree ? 'tree-gap' : 'body-gap');
          case 'tc': return tree ? FB('tree-border-color') : null;
          case 'tw': return tree ? FB('tree-border-width') : null;
          case 'tp': return tree ? FB('tree-padding-block') : null;
          case 'ti': return tree ? FB('tree-padding-inline') : null;
          case 'th': return tree ? FB('tree-max-height') : null;
          case 'oc': return focus ? FB('focus-outline-color') : null;
          case 'ow': return focus ? FB('focus-outline-width') : null;
          case 'oo': return focus ? FB('focus-outline-offset') : null;
          case 'ch': return FB('content-min-height');
          default: return null;
        }
      },
      reach: function (full) { return /tree|focus/.test(full) ? 'every file browser with its tree' : 'every file browser'; }, every: 'every file browser',
      html: function (variant, size, state, extraCls) {
        var tree = variant === 'tree', grid = variant === 'grid';
        return '<div class="ds-w12a-lab ds-w12a-lab--browser"><section aria-label="Files" class="plx-file-browser plx-file-browser--' + (grid ? 'grid' : 'list') + (tree ? ' plx-file-browser--tree' : '') + (variant === 'breadcrumbs' || tree ? ' plx-file-browser--breadcrumbs' : '') + ex(extraCls) + '">'
          + (variant === 'breadcrumbs' || tree ? crumbs : '') + cmdBar + '<div class="plx-file-browser__body">' + (tree ? treeHtml(state === 'focus') : '')
          + '<div class="plx-file-browser__content">' + (grid ? gridHtml : '<div class="plx-file-list plx-file-list--list">' + rows(FILES, 'Brand kit') + '</div>') + '</div></div></section></div>';
      },
      labelSelector: '.plx-breadcrumbs__current',
      parts: { g: 'A', bg: 'B', tc: 'C', tw: 'C', tp: 'D', ti: 'D', th: 'D', oc: 'D', ow: 'D', oo: 'D', ch: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-file-browser__body', side: 'bottom' }, C: { part: '.plx-file-browser__tree', side: 'top' }, D: { part: '.plx-file-browser__tree-scroll', side: 'left' }, E: { part: '.plx-file-browser__content', side: 'right' } },
      sections: [['Browser', ['g', 'bg', 'ch']], ['Tree pane', ['tc', 'tw', 'tp', 'ti', 'th']], ['Tree focus', ['oc', 'ow', 'oo']]],
      matrixLabel: 'File browser values by variant and state', matrixColumnWidth: '--plx-ref-size-720px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- UploadManager (<UploadManager>): the panel's frame, its head and counts, the drop zone's words, the queue
    var UM = function (n) { return 'plx-comp-upload-manager-' + n; };
    var zone = '<div class="plx-drop-zone plx-upload-manager__zone">' + icon('upload-2', 'plx-icon--size-lg') + '<span class="plx-upload-manager__drop">Drag and drop files or folders here</span>'
      + '<span class="plx-upload-manager__hint">PNG, JPG or PDF, up to 500 MB each.</span><span class="plx-upload-manager__choose">' + btn({ size: 'sm', icon: 'text-card', text: 'Choose files' }) + btn({ size: 'sm', icon: 'folder-open', text: 'Choose a folder' }) + '</span></div>';
    var umRows = function (variant) {
      var list = variant === 'retry' ? [{ name: 'Border 007.svg', icon: 'file-svg', error: 'The connection was lost.' }, { name: 'Window 03.jpg', icon: 'file-jpg', size: '3.4 MB', status: badge('success', 'circle-check', 'Uploaded'), actions: true }]
        : [{ name: 'Window 03.jpg', icon: 'file-jpg', progress: 64 }, { name: 'Archive 1919.zip', icon: 'file-zip', progress: 18 }, { name: 'Letterhead.pdf', size: '1.2 MB', status: badge('success', 'circle-check', 'Uploaded'), actions: true }];
      return list;
    };
    DS.registerLab('upload-manager', {
      name: 'Upload manager', title: 'Plenix upload manager', file: 'platform/patterns/UploadManager/upload-manager.css', compPrefix: /^plx-comp-upload-manager-/,
      store: 'plenix-upload-manager-lab-tokens', sizes: [['default', 'Default', '.plx-upload-manager']],
      variants: [['panel', 'Panel (default)'], ['dialog', 'Dialog'], ['progress', 'Per file progress'], ['retry', 'Retry'], ['docked', 'Docked']],
      states: [['default', 'Default'], ['focus', 'Focus (the queue)']], content: [['three', 'Three files']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'panel', state: 'default', content: 'three' },
      props: [
        { id: 'g', label: 'Space between the parts', css: ['row-gap'], cat: 'space' },
        { id: 'bg', label: 'Panel surface', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Panel border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Panel border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'r', label: 'Panel corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'py', label: 'Panel padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
        { id: 'px', label: 'Panel padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
        { id: 'hg', label: 'Gap (headline to actions)', css: ['column-gap'], part: '.plx-upload-manager__head', cat: 'space' },
        { id: 'hh', label: 'Head least height', css: ['min-block-size'], show: 'min-height', part: '.plx-upload-manager__head', cat: 'size' },
        { id: 'tc', label: 'Headline color', css: ['color'], part: '.plx-upload-manager__title', cat: 'color' },
        { id: 'ts', label: 'Headline size', css: ['font-size'], part: '.plx-upload-manager__title', cat: 'font-size' },
        { id: 'tw', label: 'Headline weight', css: ['font-weight'], part: '.plx-upload-manager__title', cat: 'font-weight' },
        { id: 'tl', label: 'Headline line height', css: ['line-height'], part: '.plx-upload-manager__title', cat: 'line-height' },
        { id: 'ag', label: 'Gap between actions', css: ['column-gap'], part: '.plx-upload-manager__actions', cat: 'space' },
        { id: 'sg', label: 'Gap (bar to counts)', css: ['column-gap'], part: '.plx-upload-manager__summary', cat: 'space' },
        { id: 'cc', label: 'Counts color', css: ['color'], part: '.plx-upload-manager__counts', cat: 'color' },
        { id: 'cf', label: 'Counts font (data)', css: ['font-family'], part: '.plx-upload-manager__counts', cat: 'font' },
        { id: 'cs', label: 'Counts size', css: ['font-size'], part: '.plx-upload-manager__counts', cat: 'font-size' },
        { id: 'cl', label: 'Counts line height', css: ['line-height'], part: '.plx-upload-manager__counts', cat: 'line-height' },
        { id: 'dg', label: 'Space in the dialog', css: ['row-gap'], part: '.plx-upload-manager__body', cat: 'space' },
        { id: 'dt', label: 'Drop words color', css: ['color'], part: '.plx-upload-manager__drop', cat: 'color' },
        { id: 'ds', label: 'Drop words size', css: ['font-size'], part: '.plx-upload-manager__drop', cat: 'font-size' },
        { id: 'dw', label: 'Drop words weight', css: ['font-weight'], part: '.plx-upload-manager__drop', cat: 'font-weight' },
        { id: 'dl', label: 'Drop words line height', css: ['line-height'], part: '.plx-upload-manager__drop', cat: 'line-height' },
        { id: 'nc', label: 'Limits color', css: ['color'], part: '.plx-upload-manager__hint', cat: 'color' },
        { id: 'ns', label: 'Limits size', css: ['font-size'], part: '.plx-upload-manager__hint', cat: 'font-size' },
        { id: 'nl', label: 'Limits line height', css: ['line-height'], part: '.plx-upload-manager__hint', cat: 'line-height' },
        { id: 'pg', label: 'Gap between pickers', css: ['column-gap'], part: '.plx-upload-manager__choose', cat: 'space' },
        { id: 'kw', label: 'Docked width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'ki', label: 'Docked distance from the edges', css: ['inset-block-end', 'inset-inline-end'], show: 'bottom', cat: 'space' },
        { id: 'ks', label: 'Docked shadow', css: ['box-shadow'], cat: 'shadow' },
        { id: 'qh', label: 'Queue tallest height', css: ['max-block-size'], show: 'max-height', part: '.plx-upload-manager__queue', cat: 'size' },
        { id: 'oc', label: 'Queue focus ring color', css: ['outline-color'], part: '.plx-upload-manager__queue', cat: 'color' },
        { id: 'ow', label: 'Queue focus ring width', css: ['outline-width'], part: '.plx-upload-manager__queue', cat: 'border-width' },
        { id: 'oo', label: 'Queue focus ring offset', css: ['outline-offset'], part: '.plx-upload-manager__queue', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var dialog = variant === 'dialog', panel = !dialog, focus = state === 'focus';
        var PANEL = { bg: 'background', bc: 'border-color', bw: 'border-width', r: 'radius', py: 'padding-block', px: 'padding-inline', hg: 'head-gap', hh: 'head-min-height', ag: 'actions-gap' };
        if (PANEL[id]) return panel ? UM(PANEL[id]) : null;
        var DOCK = { kw: 'docked-width', ki: 'docked-inset', ks: 'docked-shadow' };
        if (DOCK[id]) return variant === 'docked' ? UM(DOCK[id]) : null;
        var ZONE = { dt: 'drop-text', ds: 'drop-font-size', dw: 'drop-font-weight', dl: 'drop-line-height', nc: 'hint-text', ns: 'hint-font-size', nl: 'hint-line-height', pg: 'actions-gap', dg: 'dialog-gap' };
        if (ZONE[id]) return dialog ? UM(ZONE[id]) : null;
        var ALL = { g: 'gap', tc: 'title-text', ts: 'title-font-size', tw: 'title-font-weight', tl: 'title-line-height', sg: 'head-gap', cc: 'counts-text', cf: 'counts-font-family', cs: 'counts-font-size', cl: 'counts-line-height', qh: 'queue-max-height' };
        if (ALL[id]) return UM(ALL[id]);
        var FOCUS = { oc: 'focus-outline-color', ow: 'focus-outline-width', oo: 'focus-outline-offset' };
        return FOCUS[id] && focus ? UM(FOCUS[id]) : null;
      },
      reach: function (full) { return /dialog|drop|hint/.test(full) ? 'every upload dialog' : /docked/.test(full) ? 'every docked upload panel' : /background|border|radius|padding|head|actions/.test(full) ? 'every upload panel' : 'every upload manager'; }, every: 'every upload manager',
      html: function (variant, size, state, extraCls) {
        var dialog = variant === 'dialog', list = umRows(variant), moving = list.filter(function (x) { return typeof x.progress === 'number'; }).length;
        var headline = variant === 'retry' ? '1 upload failed' : 'Uploading ' + moving + ' files';
        var summary = '<div class="plx-upload-manager__summary"><div class="plx-progress-bar plx-progress-bar--sm plx-progress-bar--' + (variant === 'retry' ? 'danger' : 'info') + ' plx-upload-manager__bar"><progress class="plx-progress-bar__track plx-progress-bar__meter" value="' + (variant === 'retry' ? 50 : 61) + '" max="100" aria-label="Overall progress"></progress></div>'
          + '<span class="plx-text plx-text--data plx-upload-manager__counts">' + (variant === 'retry' ? '1 of 2 uploaded · 50%' : '1 of 3 uploaded · 61%') + '</span></div>';
        var queue = '<div class="plx-upload-manager__queue' + (state === 'focus' ? ' ds-focus' : '') + '" role="region" aria-label="Uploads">' + rows(list, 'Uploads') + '</div>';
        if (dialog) {
          return '<div class="ds-w12a-lab ds-w12a-lab--wide"><div class="plx-upload-manager plx-upload-manager--dialog' + ex(extraCls) + '"><div class="plx-upload-manager__body">' + zone
            + '<p class="plx-upload-manager__title">' + headline + '</p>' + summary + queue + '</div></div></div>';
        }
        return '<div class="ds-w12a-lab ds-w12a-lab--wide' + (variant === 'docked' ? ' ds-w12a-dock' : '') + '"><section aria-label="Uploads" class="plx-upload-manager plx-upload-manager--panel' + (variant === 'docked' ? ' plx-upload-manager--docked' : '') + ex(extraCls) + '"><div class="plx-upload-manager__head"><h2 class="plx-upload-manager__title">' + headline + '</h2>'
          + '<span class="plx-upload-manager__actions">' + (moving ? btn({ variant: 'ghost', size: 'sm', text: 'Cancel all' }) : btn({ variant: 'ghost', size: 'sm', text: 'Clear finished' })) + btn({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'chevron-down', label: 'Hide the uploads' }) + '</span></div>'
          + summary + '<div class="plx-upload-manager__body">' + queue + '</div></section></div>';
      },
      labelSelector: '.plx-upload-manager__title',
      parts: { g: 'A', bg: 'A', bc: 'A', bw: 'A', r: 'A', py: 'A', px: 'A', hg: 'B', hh: 'B', tc: 'C', ts: 'C', tw: 'C', tl: 'C', ag: 'D', sg: 'E', cc: 'F', cf: 'F', cs: 'F', cl: 'F', dg: 'G', dt: 'H', ds: 'H', dw: 'H', dl: 'H', nc: 'I', ns: 'I', nl: 'I', pg: 'J', kw: 'A', ki: 'A', ks: 'A', qh: 'K', oc: 'K', ow: 'K', oo: 'K' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-upload-manager__head', side: 'top' }, C: { part: '.plx-upload-manager__title', side: 'top' }, D: { part: '.plx-upload-manager__actions', side: 'right' },
        E: { part: '.plx-upload-manager__summary', side: 'left' }, F: { part: '.plx-upload-manager__counts', side: 'right' }, G: { part: '.plx-upload-manager__body', side: 'left' }, H: { part: '.plx-upload-manager__drop', side: 'top' },
        I: { part: '.plx-upload-manager__hint', side: 'right' }, J: { part: '.plx-upload-manager__choose', side: 'bottom' }, K: { part: '.plx-upload-manager__queue', side: 'right' } },
      sections: [['Panel', ['g', 'bg', 'bc', 'bw', 'r', 'py', 'px']], ['Docked', ['kw', 'ki', 'ks']], ['Head', ['hg', 'hh', 'tc', 'ts', 'tw', 'tl', 'ag']], ['Summary', ['sg', 'cc', 'cf', 'cs', 'cl']], ['Drop zone (dialog)', ['dg', 'dt', 'ds', 'dw', 'dl', 'nc', 'ns', 'nl', 'pg']], ['Queue', ['qh', 'oc', 'ow', 'oo']]],
      matrixLabel: 'Upload manager values by variant and state', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- VersionCompare (<VersionCompare>): the pickers' row, and the text diff's bar, frame and lines
    var VC = function (n) { return 'plx-comp-version-compare-' + n; };
    var pickers = function (variant) {
      var sel = function (label, value) { return '<div class="plx-field plx-field--stacked plx-version-compare__picker"><div class="plx-field__head"><label class="plx-field__label">' + label + '</label></div><div class="plx-field__control"><span class="plx-select"><select class="plx-input plx-select__control" tabindex="-1"><option>' + value + '</option></select></span></div></div>'; };
      var seg = function (v, label) { return '<button type="button" role="radio" tabindex="-1" aria-checked="' + (variant === v) + '" class="plx-segmented__item' + (variant === v ? ' is-selected' : '') + '"><span>' + label + '</span></button>'; };
      return '<div class="plx-version-compare__pickers">' + sel('Compare', 'Version 2 · Oct 2, 2026') + btn({ variant: 'ghost', size: 'sm', text: 'Swap', label: 'Swap the two versions', cls: 'plx-version-compare__swap' }) + sel('With', 'Version 3 · Oct 9, 2026')
        + '<div role="radiogroup" aria-label="View" class="plx-segmented plx-segmented--sm plx-version-compare__modes">' + seg('columns', 'Side by side') + seg('slider', 'Slider') + seg('text', 'Text') + '</div></div>';
    };
    var LINES = [['same', 1, 1, 'Easter vigil'], ['del', 2, '', 'Saturday, April 4, at 8 pm'], ['add', '', 2, 'Saturday, April 4, at 9 pm'], ['same', 3, 3, 'Blessing of the fire in the courtyard'], ['add', '', 4, 'Bring a candle; we will hand out more at the door']];
    var diffHtml = function (focus) {
      return '<div class="plx-version-compare__diff"><div class="plx-version-compare__diff-bar"><p class="plx-version-compare__summary">2 lines added, 1 line removed</p><span class="plx-version-compare__steps">'
        + btn({ variant: 'ghost', size: 'sm', icon: 'chevron-up', text: 'Previous change' }) + btn({ variant: 'ghost', size: 'sm', icon: 'chevron-down', text: 'Next change' }) + '</span></div>'
        + '<div class="plx-version-compare__lines' + (focus ? ' ds-focus' : '') + '" role="region" aria-label="Changes from Version 2 to Version 3"><ol class="plx-version-compare__list">'
        + LINES.map(function (l) {
          return '<li class="plx-version-compare__line' + (l[0] === 'add' ? ' plx-version-compare__line--added' : l[0] === 'del' ? ' plx-version-compare__line--removed' : '') + '"><span class="plx-version-compare__number" aria-hidden="true">' + l[1] + '</span><span class="plx-version-compare__number" aria-hidden="true">' + l[2] + '</span>'
            + '<span class="plx-version-compare__sign" aria-hidden="true">' + (l[0] === 'add' ? '+' : l[0] === 'del' ? '−' : '') + '</span><span class="plx-version-compare__text">' + (l[0] === 'add' ? '<span class="plx-visually-hidden">Added: </span>' : l[0] === 'del' ? '<span class="plx-visually-hidden">Removed: </span>' : '') + l[3] + '</span></li>';
        }).join('') + '<li class="plx-version-compare__fold">' + btn({ variant: 'ghost', size: 'xs', icon: 'chevron-down', text: 'Show 12 unchanged lines' }) + '</li></ol></div></div>';
    };
    var panes = '<section class="plx-comparison-view plx-comparison-view--columns" aria-label="Version comparison"><div class="plx-comparison-view__panes plx-comparison-view__panes--2">' + [['Version 2', 'Oct 2, 2026 · by Maya Chen', '2.4 MB'], ['Version 3', 'Oct 9, 2026 · by Alex Kim', '3.1 MB']].map(function (p) {
      return '<article class="plx-comparison-view__pane"><header class="plx-comparison-view__head"><h3 class="plx-comparison-view__title">' + p[0] + '</h3><span class="plx-comparison-view__meta">' + p[1] + '</span></header>'
        + '<div class="plx-comparison-view__body"><dl class="plx-comparison-view__list"><div class="plx-comparison-view__row"><dt class="plx-comparison-view__label">Size</dt><dd class="plx-comparison-view__value"><span class="plx-comparison-view__data">' + p[2] + '</span></dd></div></dl></div></article>';
    }).join('') + '</div></section>';
    DS.registerLab('version-comparison', {
      name: 'Version comparison', title: 'Plenix version comparison', file: 'platform/patterns/VersionCompare/version-compare.css', compPrefix: /^plx-comp-version-compare-/,
      store: 'plenix-version-compare-lab-tokens', sizes: [['default', 'Default', '.plx-version-compare']],
      variants: [['columns', 'Side by side (default)'], ['slider', 'Slider'], ['text', 'Text diff']],
      states: [['default', 'Default'], ['focus', 'Focus (the lines)']], content: [['two', 'Two versions']],
      labels: { size: 'Size', variant: 'View', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'text', state: 'default', content: 'two' },
      props: [
        { id: 'g', label: 'Space under the pickers', css: ['row-gap'], cat: 'space' },
        { id: 'pg', label: 'Gap between pickers', css: ['column-gap'], part: '.plx-version-compare__pickers', cat: 'space' },
        { id: 'pw', label: 'Picker width', css: ['flex-basis'], part: '.plx-version-compare__picker', cat: 'size' },
        { id: 'dg', label: 'Space under the diff bar', css: ['row-gap'], part: '.plx-version-compare__diff', cat: 'space' },
        { id: 'sc', label: 'Summary color', css: ['color'], part: '.plx-version-compare__summary', cat: 'color' },
        { id: 'ss', label: 'Summary size', css: ['font-size'], part: '.plx-version-compare__summary', cat: 'font-size' },
        { id: 'sl', label: 'Summary line height', css: ['line-height'], part: '.plx-version-compare__summary', cat: 'line-height' },
        { id: 'sg', label: 'Gap (Previous to Next)', css: ['column-gap'], part: '.plx-version-compare__steps', cat: 'space' },
        { id: 'lb', label: 'Lines surface', css: ['background-color'], part: '.plx-version-compare__lines', cat: 'color' },
        { id: 'lc', label: 'Lines border color', css: BORDERS, show: 'border-top-color', part: '.plx-version-compare__lines', cat: 'color' },
        { id: 'lw', label: 'Lines border width', css: WIDTHS, show: 'border-top-width', part: '.plx-version-compare__lines', cat: 'border-width' },
        { id: 'lr', label: 'Lines corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-version-compare__lines', cat: 'radius' },
        { id: 'lh', label: 'Lines tallest height', css: ['max-block-size'], show: 'max-height', part: '.plx-version-compare__lines', cat: 'size' },
        { id: 'ig', label: 'Gap in a line', css: ['column-gap'], part: '.plx-version-compare__line', cat: 'space' },
        { id: 'ip', label: 'Line padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-version-compare__line', cat: 'space' },
        { id: 'it', label: 'Line color', css: ['color'], part: '.plx-version-compare__line', cat: 'color' },
        { id: 'if', label: 'Line font (data)', css: ['font-family'], part: '.plx-version-compare__line', cat: 'font' },
        { id: 'is', label: 'Line size', css: ['font-size'], part: '.plx-version-compare__line', cat: 'font-size' },
        { id: 'il', label: 'Line height', css: ['line-height'], part: '.plx-version-compare__line', cat: 'line-height' },
        { id: 'nw', label: 'Line number width', css: ['inline-size'], show: 'width', part: '.plx-version-compare__number', cat: 'size' },
        { id: 'nc', label: 'Line number color', css: ['color'], part: '.plx-version-compare__number', cat: 'color' },
        { id: 'gw', label: 'Sign width', css: ['inline-size'], show: 'width', part: '.plx-version-compare__sign', cat: 'size' },
        { id: 'ab', label: 'Added line fill', css: ['background-color'], part: '.plx-version-compare__line--added', cat: 'color' },
        { id: 'as', label: 'Added sign color', css: ['color'], part: '.plx-version-compare__line--added .plx-version-compare__sign', cat: 'color' },
        { id: 'rb', label: 'Removed line fill', css: ['background-color'], part: '.plx-version-compare__line--removed', cat: 'color' },
        { id: 'rs', label: 'Removed sign color', css: ['color'], part: '.plx-version-compare__line--removed .plx-version-compare__sign', cat: 'color' },
        { id: 'fb', label: 'Folded lines fill', css: ['background-color'], part: '.plx-version-compare__fold', cat: 'color' },
        { id: 'oc', label: 'Focus ring color', css: ['outline-color'], part: '.plx-version-compare__lines', cat: 'color' },
        { id: 'ow', label: 'Focus ring width', css: ['outline-width'], part: '.plx-version-compare__lines', cat: 'border-width' },
        { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], part: '.plx-version-compare__lines', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var text = variant === 'text', focus = text && state === 'focus';
        var ALL = { g: 'gap', pg: 'pickers-gap', pw: 'picker-width' };
        if (ALL[id]) return VC(ALL[id]);
        var TEXT = { dg: 'diff-gap', sc: 'summary-text', ss: 'summary-font-size', sl: 'summary-line-height', sg: 'steps-gap', lb: 'lines-background', lc: 'lines-border-color', lw: 'lines-border-width', lr: 'lines-radius', lh: 'lines-max-height',
          ig: 'line-gap', ip: 'line-padding-inline', it: 'line-text', if: 'line-font-family', is: 'line-font-size', il: 'line-height', nw: 'number-width', nc: 'number-text', gw: 'sign-width',
          ab: 'added-background', as: 'added-sign-text', rb: 'removed-background', rs: 'removed-sign-text', fb: 'fold-background' };
        if (TEXT[id]) return text ? VC(TEXT[id]) : null;
        var FOCUS = { oc: 'focus-outline-color', ow: 'focus-outline-width', oo: 'focus-outline-offset' };
        return FOCUS[id] && focus ? VC(FOCUS[id]) : null;
      },
      reach: function (full) { return /gap$|picker/.test(full) && !/diff|line|steps/.test(full) ? 'every version comparison' : 'every text diff'; }, every: 'every version comparison',
      html: function (variant, size, state, extraCls) {
        var body = variant === 'text' ? diffHtml(state === 'focus') : variant === 'slider'
          ? '<figure class="plx-comparison-view__slider"><div class="plx-comparison-view__slider-head"><span class="plx-comparison-view__side"><span class="plx-comparison-view__title">Version 2</span><span class="plx-comparison-view__meta">Oct 2, 2026</span></span><span class="plx-comparison-view__side plx-comparison-view__side--end"><span class="plx-comparison-view__title">Version 3</span><span class="plx-comparison-view__meta">Oct 9, 2026</span></span></div>'
            + '<svg class="plx-comparison-view__stage" viewBox="0 0 1600 900" role="img" aria-label="Easter banner, version 2 · Easter banner, version 3"><defs><clipPath id="ds-w12a-clip"><rect x="0" y="0" width="720" height="900"></rect></clipPath></defs>'
            + '<image href="../../dam/assets/thumb-14.svg" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"></image><image href="../../dam/assets/thumb-12.svg" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice" clip-path="url(#ds-w12a-clip)"></image>'
            + '<line class="plx-comparison-view__divider" x1="720" x2="720" y1="0" y2="900" vector-effect="non-scaling-stroke"></line></svg></figure>' : panes;
        return '<div class="ds-w12a-lab ds-w12a-lab--wide"><section aria-label="Version comparison" class="plx-version-compare plx-version-compare--' + variant + ex(extraCls) + '">' + pickers(variant) + body + '</section></div>';
      },
      labelSelector: '.plx-field__label',
      parts: { g: 'A', pg: 'B', pw: 'B', dg: 'C', sc: 'C', ss: 'C', sl: 'C', sg: 'D', lb: 'E', lc: 'E', lw: 'E', lr: 'E', lh: 'E', oc: 'E', ow: 'E', oo: 'E', ig: 'F', ip: 'F', it: 'F', if: 'F', is: 'F', il: 'F', nw: 'G', nc: 'G', gw: 'G', ab: 'H', as: 'H', rb: 'I', rs: 'I', fb: 'J' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-version-compare__pickers', side: 'top' }, C: { part: '.plx-version-compare__summary', side: 'top' }, D: { part: '.plx-version-compare__steps', side: 'right' },
        E: { part: '.plx-version-compare__lines', side: 'right' }, F: { part: '.plx-version-compare__line', side: 'left' }, G: { part: '.plx-version-compare__number', side: 'left' }, H: { part: '.plx-version-compare__line--added', side: 'right' },
        I: { part: '.plx-version-compare__line--removed', side: 'right' }, J: { part: '.plx-version-compare__fold', side: 'bottom' } },
      sections: [['Pickers', ['g', 'pg', 'pw']], ['Diff bar', ['dg', 'sc', 'ss', 'sl', 'sg']], ['Lines', ['lb', 'lc', 'lw', 'lr', 'lh', 'oc', 'ow', 'oo']], ['A line', ['ig', 'ip', 'it', 'if', 'is', 'il', 'nw', 'nc', 'gw']], ['Changes', ['ab', 'as', 'rb', 'rs', 'fb']]],
      matrixLabel: 'Version comparison values by view and state', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Views and states · ' + HEAD
    });
  })();
}
