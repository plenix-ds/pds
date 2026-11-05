/* Plenix design system · library part w07B: the labs of wave 7, lane B. MillerColumns, Cascader, EntityPicker, TimePicker,
   RelativeDateInput, LoadMore, ImageUpload (with ImageCrop) and AvatarUpload, each drawn with the markup the component
   renders, so every value shows with the one --plx-comp-* token behind it. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name) { return DS.icon(name); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var PAD_INLINE = ['padding-inline-start', 'padding-inline-end'], PAD_BLOCK = ['padding-block-start', 'padding-block-end'];
    var popupWrap = function (inner) { return '<div class="ds-w07b-popup--lab">' + inner + '</div>'; };
    var fieldCls = function (state) { return state === 'focus' ? ' is-focus-within' : ''; };

    // ---- MillerColumns (<MillerColumns>): the frame, its columns and rows
    var MC = function (n) { return 'plx-comp-miller-columns-' + n; };
    var MITEM = '.plx-miller-columns__item';
    var mRow = function (label, o) {
      o = o || {};
      return '<li role="option" aria-selected="' + !!o.sel + '"' + (o.check !== undefined ? ' aria-checked="' + !!o.check + '"' : '') + ' class="plx-miller-columns__item' + (o.sel ? ' is-selected' : '') + (o.hover ? ' is-hover' : '') + (o.focus ? ' is-focus-visible' : '') + '">'
        + (o.check !== undefined ? '<input type="checkbox" class="plx-check__input plx-miller-columns__mark" tabindex="-1" aria-hidden="true" inert' + (o.check ? ' checked' : '') + '>' : '')
        + (o.icon ? '<span class="plx-miller-columns__icon" aria-hidden="true">' + icon(o.icon) + '</span>' : '')
        + '<span class="plx-miller-columns__text"><span class="plx-miller-columns__label">' + label + '</span>' + (o.desc ? '<span class="plx-miller-columns__description">' + o.desc + '</span>' : '') + '</span>'
        + (o.kids ? '<span class="plx-miller-columns__chevron" aria-hidden="true">' + DS.icon('chevron-right') + '</span>' : '') + '</li>';
    };
    var mCol = function (name, rows, resizable, w) {
      return '<div class="plx-miller-columns__column" data-plx-width="' + (w || 3) + '"><ul class="plx-miller-columns__list" role="listbox" tabindex="-1" aria-label="' + name + '">' + rows + '</ul></div>'
        + (resizable ? '<div class="plx-miller-columns__resizer" role="separator" aria-orientation="vertical" tabindex="-1" aria-label="Resize the ' + name + ' column" aria-valuemin="1" aria-valuemax="6" aria-valuenow="3"></div>' : '');
    };
    DS.registerLab('miller-columns', {
      name: 'Miller columns', title: 'Plenix Miller columns', file: 'platform/components/MillerColumns/miller-columns.css', compPrefix: /^plx-comp-miller-columns-/,
      store: 'plenix-miller-columns-lab-tokens', sizes: [['default', 'Default', '.plx-miller-columns']],
      variants: [['plain', 'Columns (default)'], ['preview', 'With preview column'], ['resizable', 'Resizable'], ['checks', 'With checkboxes']],
      states: [['default', 'Default'], ['hover', 'Hover']],
      content: [['path', 'A chosen path'], ['keyboard', 'Keyboard']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Behavior' },
      defaults: { size: 'default', variant: 'plain', state: 'default', content: 'path' },
      props: [
        { id: 'bg', label: 'Frame background', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Frame border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Frame border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Frame corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
        { id: 'cw', label: 'Column width (step 3)', css: ['inline-size'], show: 'width', part: '.plx-miller-columns__column', cat: 'size' },
        { id: 'cb', label: 'Column line color', css: ['border-inline-end-color'], show: 'border-right-color', part: '.plx-miller-columns__column', cat: 'color' },
        { id: 'lp', label: 'Column padding', css: PAD_BLOCK, show: 'padding-top', part: '.plx-miller-columns__list', cat: 'space' },
        { id: 'lg', label: 'Gap between rows', css: ['row-gap'], part: '.plx-miller-columns__list', cat: 'space' },
        { id: 'ih', label: 'Row height', css: ['min-block-size'], show: 'min-height', part: MITEM, cat: 'control-height' },
        { id: 'ipx', label: 'Row padding start', css: ['padding-inline-start'], show: 'padding-left', part: MITEM, cat: 'space' },
        { id: 'ig', label: 'Row gap (icon to text)', css: ['column-gap'], part: MITEM, cat: 'space' },
        { id: 'irad', label: 'Row corners', css: CORNERS, show: 'border-top-left-radius', part: MITEM, cat: 'radius' },
        { id: 'hb', label: 'Hovered row background', css: ['background-color'], part: MITEM + '.is-hover', cat: 'color' },
        { id: 'sb', label: 'Chosen row background', css: ['background-color'], part: MITEM + '.is-selected', cat: 'color' },
        { id: 'st', label: 'Chosen row text', css: ['color'], part: MITEM + '.is-selected', cat: 'color' },
        { id: 'sw', label: 'Chosen row weight', css: ['font-weight'], part: MITEM + '.is-selected', cat: 'font-weight' },
        { id: 'fo', label: 'Focus outline color', css: ['outline-color'], part: MITEM + '.is-focus-visible', cat: 'color' },
        { id: 'fw', label: 'Focus outline width', css: ['outline-width'], part: MITEM + '.is-focus-visible', cat: 'border-width' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: MITEM + ':not(.is-selected) .plx-miller-columns__icon', cat: 'color' },
        { id: 'chb', label: 'Chevron color', css: ['color'], part: '.plx-miller-columns__chevron', cat: 'color' },
        { id: 'chw', label: 'Chevron size', css: ['inline-size'], show: 'width', part: '.plx-miller-columns__chevron', cat: 'icon' },
        { id: 'dc', label: 'Detail color', css: ['color'], part: '.plx-miller-columns__description', cat: 'color' },
        { id: 'dfs', label: 'Detail size', css: ['font-size'], part: '.plx-miller-columns__description', cat: 'font-size' },
        { id: 'pp', label: 'Preview padding', css: PAD_BLOCK, show: 'padding-top', part: '.plx-miller-columns__preview', cat: 'space' },
        { id: 'rw', label: 'Edge width', css: ['inline-size'], show: 'width', part: '.plx-miller-columns__resizer', cat: 'size' },
        { id: 'rb', label: 'Edge color', css: ['background-color'], part: '.plx-miller-columns__resizer', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var res = variant === 'resizable';
        switch (id) {
          case 'bg': return MC('background');
          case 'bc': return MC('border-color');
          case 'bw': return MC('border-width');
          case 'rad': return MC('radius');
          case 'h': return MC('height');
          case 'fs': return MC('font-size');
          case 'cw': return MC('column-width-step-3');
          case 'cb': return res ? null : MC('column-border-inline-end-color');
          case 'lp': return MC('list-padding-block');
          case 'lg': return MC('list-row-gap');
          case 'ih': return MC('item-min-height');
          case 'ipx': return MC('item-padding-inline-start');
          case 'ig': return MC('item-gap');
          case 'irad': return MC('item-radius');
          case 'hb': return state === 'hover' ? MC('item-hover-background') : null;
          case 'sb': return MC('item-selected-background');
          case 'st': return MC('item-selected-text');
          case 'sw': return MC('item-selected-font-weight');
          case 'fo': return content === 'keyboard' ? MC('list-focus-item-selected-outline-color') : null;
          case 'fw': return content === 'keyboard' ? MC('list-focus-item-selected-outline-width') : null;
          case 'ic': return variant === 'checks' ? null : MC('icon-text');
          case 'chb': return MC('chevron-background');
          case 'chw': return MC('chevron-width');
          case 'dc': return variant === 'checks' ? null : MC('description-text');
          case 'dfs': return variant === 'checks' ? null : MC('description-font-size');
          case 'pp': return variant === 'preview' ? MC('preview-padding-block') : null;
          case 'rw': return res ? MC('resizer-width') : null;
          case 'rb': return res ? MC('resizer-background') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-item-/.test(full) ? 'every row of every Miller columns view' : /-resize/.test(full) ? 'every column edge' : 'every Miller columns view'; },
      every: 'every Miller columns view',
      html: function (variant, size, state, extraCls, ui) {
        var kb = ui && ui.content === 'keyboard', hov = state === 'hover', res = variant === 'resizable';
        if (variant === 'checks') {
          return '<div role="group" aria-label="Offices" class="plx-miller-columns plx-miller-columns--checks' + ex(extraCls) + '">'
            + mCol('Offices', mRow('Europe', { sel: true, kids: true }) + mRow('Americas', { kids: true, hover: hov }))
            + mCol('Europe', mRow('France', { sel: true, kids: true }) + mRow('Germany', { kids: true }))
            + mCol('France', mRow('Paris', { check: true, sel: true, focus: kb }) + mRow('Lyon', { check: true }) + mRow('Lille', { check: false })) + '</div>';
        }
        var last = variant === 'preview'
          ? mCol('Easter 2026', mRow('Banner, north aisle', { sel: true, icon: 'ed-image', desc: 'Vector art', focus: kb }) + mRow('Poster A3', { icon: 'ed-image', desc: 'Vector art' }), res)
            + '<div class="plx-miller-columns__preview" role="region" tabindex="-1" aria-label="Preview of Banner, north aisle"><p class="plx-text plx-text--heading">Banner, north aisle</p><p class="plx-text plx-text--secondary">Vector art</p></div>'
          : mCol('Easter 2026', mRow('Banner, north aisle', { sel: true, icon: 'ed-image', desc: 'Vector art', focus: kb }) + mRow('Poster A3', { icon: 'ed-image', desc: 'Vector art' }), res);
        return '<div role="group" aria-label="Assets" class="plx-miller-columns' + (res ? ' plx-miller-columns--resizable' : '') + ex(extraCls) + '">'
          + mCol('Assets', mRow('Brand', { icon: 'folder', kids: true, hover: hov }) + mRow('Campaigns', { icon: 'folder', kids: true, sel: true }) + mRow('Read me', { icon: 'document', desc: 'Plain text' }), res)
          + mCol('Campaigns', mRow('Easter 2026', { icon: 'folder', kids: true, sel: true }) + mRow('Advent 2025', { icon: 'folder', kids: true }), res)
          + last + '</div>';
      },
      labelSelector: '.plx-miller-columns__label',
      parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', h: 'A', fs: 'A', cw: 'B', cb: 'B', lp: 'B', lg: 'B', ih: 'C', ipx: 'C', ig: 'C', irad: 'C', hb: 'C', sb: 'D', st: 'D', sw: 'D', fo: 'D', fw: 'D', ic: 'E', chb: 'F', chw: 'F', dc: 'G', dfs: 'G', pp: 'H', rw: 'I', rb: 'I' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-miller-columns__column', side: 'bottom' }, C: { part: MITEM, side: 'left' }, D: { part: MITEM + '.is-selected', side: 'right' },
        E: { part: '.plx-miller-columns__icon', side: 'left' }, F: { part: '.plx-miller-columns__chevron', side: 'right' }, G: { part: '.plx-miller-columns__description', side: 'bottom' },
        H: { part: '.plx-miller-columns__preview', side: 'right' }, I: { part: '.plx-miller-columns__resizer', side: 'top' } },
      sections: [['Frame', ['bg', 'bc', 'bw', 'rad', 'h', 'fs']], ['Columns', ['cw', 'cb', 'lp', 'lg']], ['Rows', ['ih', 'ipx', 'ig', 'irad', 'hb', 'sb', 'st', 'sw', 'fo', 'fw', 'ic', 'chb', 'chw', 'dc', 'dfs']], ['Preview and edges', ['pp', 'rw', 'rb']]],
      matrixLabel: 'Miller columns by layout and state', matrixColumnWidth: '--plx-ref-size-900px', statesHead: 'Layouts and states · ' + HEAD
    });

    // ---- Cascader (<Cascader>): the field, the list (a menu surface) with its columns or its search matches
    var CS = function (n) { return 'plx-comp-cascader-' + n; };
    var POP = '.plx-cascader__popup', MATCH = '.plx-cascader__match';
    var tag = function (t) { return '<span class="plx-tag"><span class="plx-tag__label">' + t + '</span><button type="button" class="plx-tag__remove" tabindex="-1" aria-label="Remove ' + t + '"></button></span>'; };
    DS.registerLab('cascader', {
      name: 'Cascader', title: 'Plenix cascader', file: 'platform/components/Cascader/cascader.css', compPrefix: /^plx-comp-cascader-/,
      store: 'plenix-cascader-lab-tokens', sizes: [['default', 'Default', '.plx-cascader']],
      variants: [['click', 'Click (default)'], ['hover', 'Hover'], ['search', 'Search'], ['multiple', 'Multiple'], ['parent', 'Choose a parent'], ['tags', 'Many choices (+N, maxTags 3)'], ['limit', 'Limit reached'], ['server', 'Server search']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['open', 'The list open'], ['loading', 'Server search: loading'], ['failed', 'Server search: failed']],
      labels: { size: 'Size', variant: 'Trigger', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'click', state: 'focus', content: 'open' },
      props: [
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'fg', label: 'Field gap', css: ['column-gap'], part: '.plx-cascader__field', cat: 'space' },
        { id: 'ffc', label: 'Focused field border', css: BORDERS, show: 'border-top-color', part: '.plx-cascader__field', cat: 'color' },
        { id: 'fic', label: 'Invalid field border', css: BORDERS, show: 'border-top-color', part: '.plx-cascader__field', cat: 'color' },
        { id: 'fdb', label: 'Disabled field background', css: ['background-color'], part: '.plx-cascader__field', cat: 'color' },
        { id: 'tg', label: 'Gap (path to chevron)', css: ['column-gap'], part: '.plx-cascader__trigger', cat: 'space' },
        { id: 'th', label: 'Path line height', css: ['min-block-size'], show: 'min-height', part: '.plx-cascader__trigger', cat: 'control-height' },
        { id: 'chb', label: 'Chevron color', css: ['color'], part: '.plx-cascader__chevron', cat: 'color' },
        { id: 'chw', label: 'Chevron size', css: ['inline-size'], show: 'width', part: '.plx-cascader__chevron', cat: 'icon' },
        { id: 'pb', label: 'List background', css: ['background-color'], part: POP, cat: 'color' },
        { id: 'pc', label: 'List border color', css: BORDERS, show: 'border-top-color', part: POP, cat: 'color' },
        { id: 'pw', label: 'List border width', css: WIDTHS, show: 'border-top-width', part: POP, cat: 'border-width' },
        { id: 'pr', label: 'List corners', css: CORNERS, show: 'border-top-left-radius', part: POP, cat: 'radius' },
        { id: 'ps', label: 'List shadow', css: ['box-shadow'], part: POP, cat: 'shadow' },
        { id: 'pm', label: 'Gap under the field', css: ['margin-block-start'], show: 'margin-top', part: POP, cat: 'space' },
        { id: 'ch', label: 'Columns height', css: ['block-size'], show: 'height', part: '.plx-cascader__columns', cat: 'size' },
        { id: 'sp', label: 'Search padding', css: PAD_BLOCK, show: 'padding-top', part: '.plx-cascader__search', cat: 'space' },
        { id: 'sl', label: 'Search line color', css: ['border-block-end-color'], show: 'border-bottom-color', part: '.plx-cascader__search', cat: 'color' },
        { id: 'mh', label: 'Match height', css: ['min-block-size'], show: 'min-height', part: MATCH, cat: 'control-height' },
        { id: 'mpx', label: 'Match padding left & right', css: PAD_INLINE, show: 'padding-left', part: MATCH, cat: 'space' },
        { id: 'mab', label: 'Active match background', css: ['background-color'], part: MATCH + '.is-active', cat: 'color' },
        { id: 'mpc', label: 'Match path color', css: ['color'], part: '.plx-cascader__match-path', cat: 'color' },
        { id: 'mpf', label: 'Match path size', css: ['font-size'], part: '.plx-cascader__match-path', cat: 'font-size' },
        { id: 'lt', label: 'Limit message color', css: ['color'], part: '.plx-cascader__limit', cat: 'color' },
        { id: 'lf', label: 'Limit message size', css: ['font-size'], part: '.plx-cascader__limit', cat: 'font-size' },
        { id: 'lp', label: 'Limit message padding top & bottom', css: PAD_BLOCK, show: 'padding-top', part: '.plx-cascader__limit', cat: 'space' },
        { id: 'lg', label: 'Gap (spinner to text)', css: ['column-gap'], part: '.plx-cascader__loading', cat: 'space' },
        { id: 'er', label: 'Failed search text color', css: ['color'], part: '.plx-cascader__error', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var srch = variant === 'search' || variant === 'server', off = state === 'disabled';
        switch (id) {
          case 'mw': return CS('max-width');
          case 'fg': return CS('field-gap');
          case 'ffc': return state === 'focus' ? CS('field-focus-within-border-color') : null;
          case 'fic': return state === 'invalid' ? CS('field-invalid-border-color') : null;
          case 'fdb': return off ? CS('disabled-field-background') : null;
          case 'tg': return CS('trigger-gap');
          case 'th': return CS('trigger-min-height');
          case 'chb': return CS('chevron-background');
          case 'chw': return CS('chevron-width');
          case 'pb': return off ? null : CS('popup-background');
          case 'pc': return off ? null : CS('popup-border-color');
          case 'pw': return off ? null : CS('popup-border-width');
          case 'pr': return off ? null : CS('popup-radius');
          case 'ps': return off ? null : CS('popup-shadow');
          case 'pm': return off ? null : CS('popup-margin-block-start');
          case 'ch': return off || srch ? null : CS('columns-height');
          case 'sp': return srch && !off ? CS('search-padding-block') : null;
          case 'sl': return srch && !off ? CS('search-border-block-end-color') : null;
          case 'mh': return srch && !off ? CS('match-min-height') : null;
          case 'mpx': return srch && !off ? CS('match-padding-inline') : null;
          case 'mab': return srch && !off ? CS('match-active-background') : null;
          case 'mpc': return srch && !off ? CS('match-path-text') : null;
          case 'mpf': return srch && !off ? CS('match-path-font-size') : null;
          case 'lt': return variant === 'limit' && !off ? CS('limit-text') : null;
          case 'lf': return variant === 'limit' && !off ? CS('limit-font-size') : null;
          case 'lp': return variant === 'limit' && !off ? CS('limit-padding-block') : null;
          case 'lg': return variant === 'server' && content === 'loading' && !off ? CS('loading-gap') : null;
          case 'er': return variant === 'server' && content === 'failed' && !off ? CS('error-text') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-(popup|columns|search|match)/.test(full) ? 'the list of every cascader' : 'every cascader field'; },
      every: 'every cascader',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'open', server = variant === 'server', parent = variant === 'parent', tags = variant === 'tags', limit = variant === 'limit';
        var multi = variant === 'multiple' || tags || limit, srch = variant === 'search' || server, off = state === 'disabled', open = !off;
        var field = '<div class="plx-cascader__field plx-input' + fieldCls(state) + '"' + (state === 'invalid' ? ' aria-invalid="true"' : '') + '>'
          + (tags ? tag('Paris') + tag('Berlin') + tag('Rome') + '<span class="plx-tag plx-cascader__more" tabindex="-1" role="button" aria-label="2 more"><span class="plx-tag__label">+2</span></span>' : limit ? tag('Paris') + tag('Berlin') : multi ? tag('Paris') + tag('Berlin') : '')
          + '<button type="button" tabindex="-1" class="plx-cascader__trigger" aria-haspopup="dialog" aria-expanded="' + open + '" aria-label="Office"' + (off ? ' disabled' : '') + '>'
          + '<span class="plx-cascader__value">' + (multi ? '' : parent ? 'Europe' : 'Europe / France / Lyon') + '</span><span class="plx-cascader__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></button></div>';
        var cols = '<div role="group" aria-label="Office" class="plx-miller-columns plx-cascader__columns' + (multi ? ' plx-miller-columns--checks' : '') + '">'
          + mCol('Office', mRow('Europe', { sel: true, kids: true }) + mRow('Americas', { kids: true }) + mRow('Asia Pacific', { kids: true }), false, 1)
          + mCol('Europe', (parent ? mRow('All of Europe', { sel: true }) : '') + mRow('France', { sel: !parent, kids: true }) + mRow('Germany', { kids: true }) + mRow('Italy', { kids: true }), false, 1)
          + mCol('France', multi ? mRow('Paris', { check: true, sel: true }) + mRow('Lyon', { check: false }) + mRow('Lille', { check: false }) : mRow('Paris') + mRow('Lyon', { sel: true }) + mRow('Lille'), false, 1) + '</div>';
        var hl = '<span class="plx-match">Ro</span>';
        var serverRows = content === 'loading' ? '<li class="plx-cascader__empty plx-cascader__loading" role="presentation"><span class="plx-spinner plx-spinner--sm" role="status"><span class="plx-visually-hidden">Loading…</span></span><span aria-hidden="true">Loading…</span></li>'
          : content === 'failed' ? '<li class="plx-cascader__empty plx-cascader__error" role="presentation">The matches could not be loaded</li>'
          : '<li role="option" aria-selected="false" class="plx-cascader__match is-active"><span class="plx-cascader__match-label">' + hl + 'me</span><span class="plx-cascader__match-path">Europe / Italy</span></li><li role="option" aria-selected="false" class="plx-cascader__match"><span class="plx-cascader__match-label">' + hl + 'uen</span><span class="plx-cascader__match-path">Europe / France</span></li>';
        var matches = '<div class="plx-cascader__search"><input type="search" tabindex="-1" class="plx-input plx-cascader__search-input" role="combobox" aria-expanded="true" aria-label="Search" value="' + (server ? 'ro' : 'li') + '"></div>'
          + '<ul class="plx-cascader__matches" role="listbox" aria-label="Search">' + (server ? serverRows : '<li role="option" aria-selected="false" class="plx-cascader__match is-active"><span class="plx-cascader__match-label"><span class="plx-match">Li</span>lle</span><span class="plx-cascader__match-path">Europe / France</span></li><li role="option" aria-selected="false" class="plx-cascader__match"><span class="plx-cascader__match-label"><span class="plx-match">Li</span>vorno</span><span class="plx-cascader__match-path">Europe / Italy</span></li>') + '</ul>';
        return popupWrap('<div class="plx-cascader' + (multi ? ' plx-cascader--multiple' : '') + (open ? ' is-open' : '') + (off ? ' is-disabled' : '') + ex(extraCls) + '">' + field
          + (open ? '<div class="plx-cascader__popup" role="dialog" aria-label="Office">' + (srch ? matches : cols) + (limit ? '<div class="plx-cascader__limit" aria-hidden="true">You can choose up to 2.</div>' : '') + '</div>' : '') + '</div>');
      },
      labelSelector: '.plx-cascader__value',
      parts: { mw: 'A', fg: 'A', ffc: 'A', fic: 'A', fdb: 'A', tg: 'B', th: 'B', chb: 'B', chw: 'B', pb: 'C', pc: 'C', pw: 'C', pr: 'C', ps: 'C', pm: 'C', ch: 'D', sp: 'E', sl: 'E', mh: 'F', mpx: 'F', mab: 'F', mpc: 'G', mpf: 'G', lt: 'H', lf: 'H', lp: 'H', lg: 'I', er: 'J' },
      anchors: { A: { part: '.plx-cascader__field', side: 'left' }, B: { part: '.plx-cascader__chevron', side: 'right' }, C: { part: POP, side: 'right' }, D: { part: '.plx-cascader__columns', side: 'bottom' },
        E: { part: '.plx-cascader__search', side: 'right' }, F: { part: MATCH, side: 'left' }, G: { part: '.plx-cascader__match-path', side: 'bottom' }, H: { part: '.plx-cascader__limit', side: 'right' }, I: { part: '.plx-cascader__loading', side: 'right' }, J: { part: '.plx-cascader__error', side: 'right' } },
      sections: [['Field', ['mw', 'fg', 'ffc', 'fic', 'fdb', 'tg', 'th', 'chb', 'chw']], ['List', ['pb', 'pc', 'pw', 'pr', 'ps', 'pm', 'ch']], ['Search', ['sp', 'sl', 'mh', 'mpx', 'mab', 'mpc', 'mpf']], ['Limit and server search', ['lt', 'lf', 'lp', 'lg', 'er']]],
      matrixLabel: 'Cascader by trigger and state', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Triggers and states · ' + HEAD
    });

    // ---- EntityPicker (<EntityPicker>): the field and its list of two-line options
    var EP = function (n) { return 'plx-comp-entity-picker-' + n; };
    var EOPT = '.plx-entity-picker__option', ELIST = '.plx-entity-picker__list';
    var DATA = {
      people: [['Maya Chen', 'maya.chen@example.org', null, 'MC'], ['Maya Chen', 'maya.chen@parish.example', null, 'MC'], ['Priya Nair', 'priya.nair@example.org', null, 'PN']],
      teams: [['Brand team', 'Design and print', '8 people', 'settings-users'], ['Web team', 'Site and newsletter', '5 people', 'settings-users'], ['Parish office', 'Bookings and records', '4 people', 'settings-users']],
      records: [['Easter campaign', 'Campaigns · Brand team', 'PRJ-1042', 'briefcase'], ['Easter campaign, print', 'Print · Parish office', 'PRJ-1060', 'briefcase'], ['Archive scanning', 'Archive · ongoing', 'PRJ-0998', 'briefcase']]
    };
    var visual = function (kind, d) {
      return kind === 'people' ? '<span class="plx-avatar plx-avatar--28" data-plx-avatar="" aria-hidden="true"><span class="plx-avatar__initials">' + d[3] + '</span></span>'
        : '<span class="plx-icon-tile plx-icon-tile--sm plx-icon-tile--gray" aria-hidden="true">' + icon(d[3]) + '</span>';
    };
    DS.registerLab('entity-picker', {
      name: 'Entity picker', title: 'Plenix entity picker', file: 'platform/components/EntityPicker/entity-picker.css', compPrefix: /^plx-comp-entity-picker-/,
      store: 'plenix-entity-picker-lab-tokens', sizes: [['default', 'Default', '.plx-entity-picker']],
      variants: [['people', 'People'], ['teams', 'Teams'], ['records', 'Records (default)']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['single', 'Single'], ['multiple', 'Multiple']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Choice' },
      defaults: { size: 'default', variant: 'people', state: 'focus', content: 'single' },
      props: [
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'fg', label: 'Field gap', css: ['column-gap'], part: '.plx-entity-picker__field', cat: 'space' },
        { id: 'ffc', label: 'Focused field border', css: BORDERS, show: 'border-top-color', part: '.plx-entity-picker__field', cat: 'color' },
        { id: 'fic', label: 'Invalid field border', css: BORDERS, show: 'border-top-color', part: '.plx-entity-picker__field', cat: 'color' },
        { id: 'fdb', label: 'Disabled field background', css: ['background-color'], part: '.plx-entity-picker__field', cat: 'color' },
        { id: 'sc', label: 'Search icon color', css: ['color'], part: '.plx-entity-picker__search', cat: 'color' },
        { id: 'lb', label: 'List background', css: ['background-color'], part: ELIST, cat: 'color' },
        { id: 'lc', label: 'List border color', css: BORDERS, show: 'border-top-color', part: ELIST, cat: 'color' },
        { id: 'lr', label: 'List corners', css: CORNERS, show: 'border-top-left-radius', part: ELIST, cat: 'radius' },
        { id: 'ls', label: 'List shadow', css: ['box-shadow'], part: ELIST, cat: 'shadow' },
        { id: 'lmh', label: 'List maximum height', css: ['max-block-size'], show: 'max-height', part: ELIST, cat: 'size' },
        { id: 'oh', label: 'Option height', css: ['min-block-size'], show: 'min-height', part: EOPT, cat: 'control-height' },
        { id: 'opx', label: 'Option padding left & right', css: PAD_INLINE, show: 'padding-left', part: EOPT, cat: 'space' },
        { id: 'og', label: 'Option gap', css: ['column-gap'], part: EOPT, cat: 'space' },
        { id: 'orad', label: 'Option corners', css: CORNERS, show: 'border-top-left-radius', part: EOPT, cat: 'radius' },
        { id: 'oab', label: 'Active option background', css: ['background-color'], part: EOPT + '.is-active', cat: 'color' },
        { id: 'ost', label: 'Chosen option text', css: ['color'], part: EOPT + '.is-selected', cat: 'color' },
        { id: 'nw', label: 'Name weight', css: ['font-weight'], part: '.plx-entity-picker__name', cat: 'font-weight' },
        { id: 'dc', label: 'Detail color', css: ['color'], part: '.plx-entity-picker__description', cat: 'color' },
        { id: 'dfs', label: 'Detail size', css: ['font-size'], part: '.plx-entity-picker__description', cat: 'font-size' },
        { id: 'mc', label: 'Technical value color', css: ['color'], part: '.plx-entity-picker__meta', cat: 'color' },
        { id: 'mf', label: 'Technical value font', css: ['font-family'], part: '.plx-entity-picker__meta', cat: 'font' },
        { id: 'mfs', label: 'Technical value size', css: ['font-size'], part: '.plx-entity-picker__meta', cat: 'font-size' },
        { id: 'ck', label: 'Check color', css: ['color'], part: '.plx-entity-picker__check', cat: 'color' }
      ],
      token: function (id, size, variant, state) {
        var off = state === 'disabled', meta = variant !== 'people';
        switch (id) {
          case 'mw': return EP('max-width');
          case 'fg': return EP('field-gap');
          case 'ffc': return state === 'focus' ? EP('field-focus-within-border-color') : null;
          case 'fic': return state === 'invalid' ? EP('field-invalid-border-color') : null;
          case 'fdb': return off ? EP('disabled-field-background') : null;
          case 'sc': return EP('search-text');
          case 'lb': return off ? null : EP('list-background');
          case 'lc': return off ? null : EP('list-border-color');
          case 'lr': return off ? null : EP('list-radius');
          case 'ls': return off ? null : EP('list-shadow');
          case 'lmh': return off ? null : EP('list-max-height');
          case 'oh': return off ? null : EP('option-min-height');
          case 'opx': return off ? null : EP('option-padding-inline');
          case 'og': return off ? null : EP('option-gap');
          case 'orad': return off ? null : EP('option-radius');
          case 'oab': return off ? null : EP('option-active-background');
          case 'ost': return off ? null : EP('option-selected-text');
          case 'nw': return off ? null : EP('name-font-weight');
          case 'dc': return off ? null : EP('description-text');
          case 'dfs': return off ? null : EP('description-font-size');
          case 'mc': return off || !meta ? null : EP('meta-text');
          case 'mf': return off || !meta ? null : EP('meta-font-family');
          case 'mfs': return off || !meta ? null : EP('meta-font-size');
          case 'ck': return off ? null : EP('check-text');
          default: return null;
        }
      },
      reach: function (full) { return /-(list|option|name|description|meta|check)-/.test(full) ? 'the list of every entity picker' : 'every entity picker field'; },
      every: 'every entity picker',
      html: function (variant, size, state, extraCls, ui) {
        var multi = ui && ui.content === 'multiple', off = state === 'disabled', open = !off, rows = DATA[variant] || DATA.records;
        var field = '<div class="plx-entity-picker__field plx-input' + fieldCls(state) + '"' + (state === 'invalid' ? ' aria-invalid="true"' : '') + '>' + (multi ? tag(rows[2][0]) : '')
          + '<input tabindex="-1" class="plx-entity-picker__input" role="combobox" aria-expanded="' + open + '" aria-label="Owner" value="' + (variant === 'people' ? 'maya' : 'easter') + '"' + (off ? ' disabled' : '') + '>'
          + '<span class="plx-entity-picker__search" aria-hidden="true">' + icon('search') + '</span></div>';
        var opts = rows.map(function (d, i) {
          var chosen = multi ? i === 2 : i === 1;
          return '<li role="option" aria-selected="' + chosen + '" class="plx-entity-picker__option' + (i === 0 ? ' is-active' : '') + (chosen ? ' is-selected' : '') + '">'
            + '<span class="plx-entity-picker__visual" aria-hidden="true">' + visual(variant, d) + '</span><span class="plx-entity-picker__text"><span class="plx-entity-picker__name">' + d[0] + '</span>'
            + '<span class="plx-entity-picker__description">' + d[1] + '</span></span>' + (d[2] ? '<span class="plx-entity-picker__meta">' + d[2] + '</span>' : '')
            + (chosen ? '<span class="plx-entity-picker__check" aria-hidden="true">' + icon('check') + '</span>' : '') + '</li>';
        }).join('');
        return popupWrap('<div class="plx-entity-picker plx-entity-picker--' + variant + (multi ? ' plx-entity-picker--multiple' : '') + (open ? ' is-open' : '') + (off ? ' is-disabled' : '') + ex(extraCls) + '">' + field
          + (open ? '<ul class="plx-entity-picker__list" role="listbox" aria-label="Owner">' + opts + '</ul>' : '') + '</div>');
      },
      labelSelector: '.plx-entity-picker__name',
      parts: { mw: 'A', fg: 'A', ffc: 'A', fic: 'A', fdb: 'A', sc: 'A', lb: 'B', lc: 'B', lr: 'B', ls: 'B', lmh: 'B', oh: 'C', opx: 'C', og: 'C', orad: 'C', oab: 'C', ost: 'C', nw: 'D', dc: 'E', dfs: 'E', mc: 'F', mf: 'F', mfs: 'F', ck: 'G' },
      anchors: { A: { part: '.plx-entity-picker__field', side: 'left' }, B: { part: ELIST, side: 'right' }, C: { part: EOPT, side: 'left' }, D: { part: '.plx-entity-picker__name', side: 'top' },
        E: { part: '.plx-entity-picker__description', side: 'bottom' }, F: { part: '.plx-entity-picker__meta', side: 'right' }, G: { part: '.plx-entity-picker__check', side: 'right' } },
      sections: [['Field', ['mw', 'fg', 'ffc', 'fic', 'fdb', 'sc']], ['List', ['lb', 'lc', 'lr', 'ls', 'lmh']], ['Options', ['oh', 'opx', 'og', 'orad', 'oab', 'ost', 'nw', 'dc', 'dfs', 'mc', 'mf', 'mfs', 'ck']]],
      matrixLabel: 'Entity picker by kind and state', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Kinds and states · ' + HEAD
    });

    // ---- TimePicker (<TimePicker>): the field with the time in the data font, its list or its segments
    var TP = function (n) { return 'plx-comp-time-picker-' + n; };
    var TOPT = '.plx-time-picker__option', SEG = '.plx-time-picker__segment';
    DS.registerLab('time-picker', {
      name: 'Time picker', title: 'Plenix time picker', file: 'platform/components/TimePicker/time-picker.css', compPrefix: /^plx-comp-time-picker-/,
      store: 'plenix-time-picker-lab-tokens', sizes: [['default', 'Default', '.plx-time-picker']],
      variants: [['list', 'List (default)'], ['segments', 'Segments']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['h12', '12-hour clock'], ['h24', '24-hour clock'], ['step', 'Every 30 minutes']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Clock and step' },
      defaults: { size: 'default', variant: 'list', state: 'focus', content: 'h12' },
      props: [
        { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'ff', label: 'Time font', css: ['font-family'], part: '.plx-time-picker__field', cat: 'font' },
        { id: 'fg', label: 'Field gap', css: ['column-gap'], part: '.plx-time-picker__field', cat: 'space' },
        { id: 'ffc', label: 'Focused field border', css: BORDERS, show: 'border-top-color', part: '.plx-time-picker__field', cat: 'color' },
        { id: 'fic', label: 'Invalid field border', css: BORDERS, show: 'border-top-color', part: '.plx-time-picker__field', cat: 'color' },
        { id: 'fdb', label: 'Disabled field background', css: ['background-color'], part: '.plx-time-picker__field', cat: 'color' },
        { id: 'icb', label: 'Clock icon color', css: ['color'], part: '.plx-time-picker__icon', cat: 'color' },
        { id: 'icw', label: 'Clock icon size', css: ['inline-size'], show: 'width', part: '.plx-time-picker__icon', cat: 'icon' },
        { id: 'lb', label: 'List background', css: ['background-color'], part: '.plx-time-picker__list', cat: 'color' },
        { id: 'lc', label: 'List border color', css: BORDERS, show: 'border-top-color', part: '.plx-time-picker__list', cat: 'color' },
        { id: 'lr', label: 'List corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-time-picker__list', cat: 'radius' },
        { id: 'lmh', label: 'List maximum height', css: ['max-block-size'], show: 'max-height', part: '.plx-time-picker__list', cat: 'size' },
        { id: 'oh', label: 'Time row height', css: ['min-block-size'], show: 'min-height', part: TOPT, cat: 'control-height' },
        { id: 'ofs', label: 'Time row size', css: ['font-size'], part: TOPT, cat: 'font-size' },
        { id: 'oab', label: 'Active time background', css: ['background-color'], part: TOPT + '.is-active', cat: 'color' },
        { id: 'ost', label: 'Chosen time text', css: ['color'], part: TOPT + '.is-selected', cat: 'color' },
        { id: 'smw', label: 'Segment minimum width', css: ['min-inline-size'], show: 'min-width', part: SEG, cat: 'icon' },
        { id: 'spx', label: 'Segment padding', css: PAD_INLINE, show: 'padding-left', part: SEG, cat: 'space' },
        { id: 'sfb', label: 'Focused segment fill', css: ['background-color'], part: SEG + '.is-focus-visible', cat: 'color' },
        { id: 'sft', label: 'Focused segment text', css: ['color'], part: SEG + '.is-focus-visible', cat: 'color' },
        { id: 'sep', label: 'Separator color', css: ['color'], part: '.plx-time-picker__separator', cat: 'color' }
      ],
      token: function (id, size, variant, state) {
        var seg = variant === 'segments', off = state === 'disabled', list = !seg && !off;
        switch (id) {
          case 'w': return seg ? null : TP('width');
          case 'ff': return TP('field-font-family');
          case 'fg': return seg ? null : TP('field-gap');
          case 'ffc': return state === 'focus' ? TP('field-focus-within-border-color') : null;
          case 'fic': return state === 'invalid' ? TP('field-invalid-border-color') : null;
          case 'fdb': return off ? TP('disabled-field-background') : null;
          case 'icb': return TP('icon-background');
          case 'icw': return TP('icon-width');
          case 'lb': return list ? TP('list-background') : null;
          case 'lc': return list ? TP('list-border-color') : null;
          case 'lr': return list ? TP('list-radius') : null;
          case 'lmh': return list ? TP('list-max-height') : null;
          case 'oh': return list ? TP('option-min-height') : null;
          case 'ofs': return list ? TP('option-font-size') : null;
          case 'oab': return list ? TP('option-active-background') : null;
          case 'ost': return list ? TP('option-selected-text') : null;
          case 'smw': return seg ? TP('segment-min-width') : null;
          case 'spx': return seg ? TP('segment-padding-inline') : null;
          case 'sfb': return seg && state === 'focus' ? TP('segment-focus-background') : null;
          case 'sft': return seg && state === 'focus' ? TP('segment-focus-text') : null;
          case 'sep': return seg ? TP('separator-text') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-(list|option)-/.test(full) ? 'the list of every time picker' : /-(segment|separator)/.test(full) ? 'every time picker in segments' : 'every time picker'; },
      every: 'every time picker',
      html: function (variant, size, state, extraCls, ui) {
        var c = ui && ui.content, h24 = c === 'h24', off = state === 'disabled', inv = state === 'invalid';
        var show = function (m) { var hh = Math.floor(m / 60), mm = m % 60, p = function (n) { return (n < 10 ? '0' : '') + n; }; return h24 ? p(hh) + ':' + p(mm) : ((hh % 12) || 12) + ':' + p(mm) + ' ' + (hh < 12 ? 'AM' : 'PM'); };
        var icn = '<span class="plx-time-picker__icon" aria-hidden="true">' + DS.icon('schedule') + '</span>';
        if (variant === 'segments') {
          var seg = function (label, text, focus, period) { return '<span role="spinbutton" tabindex="-1" aria-label="' + label + '" aria-valuetext="' + text + '" class="plx-time-picker__segment' + (period ? ' plx-time-picker__segment--period' : '') + (focus ? ' is-focus-visible' : '') + '">' + text + '</span>'; };
          return '<div class="plx-time-picker plx-time-picker--segments' + (off ? ' is-disabled' : '') + ex(extraCls) + '"><div role="group" aria-label="Start time" class="plx-time-picker__field plx-time-picker__segments plx-input' + fieldCls(state) + '"' + (inv ? ' aria-invalid="true"' : '') + '>'
            + seg('Hour', h24 ? '14' : '2', state === 'focus') + '<span class="plx-time-picker__separator" aria-hidden="true">:</span>' + seg('Minute', '30') + (h24 ? '' : seg('AM or PM', 'PM', false, true)) + icn + '</div></div>';
        }
        var step = c === 'step' ? 30 : 15, from = c === 'step' ? 13 * 60 + 30 : 14 * 60, times = '';
        for (var i = 0; i < 6; i++) { var m = from + i * step, chosen = i === 2; times += '<li role="option" aria-selected="' + chosen + '" class="plx-time-picker__option' + (i === 1 ? ' is-active' : '') + (chosen ? ' is-selected' : '') + '">' + show(m) + '</li>'; }
        return popupWrap('<div class="plx-time-picker plx-time-picker--list' + (off ? ' is-disabled' : '') + ex(extraCls) + '"><div class="plx-time-picker__field plx-input' + fieldCls(state) + '"' + (inv ? ' aria-invalid="true"' : '') + '>'
          + '<input tabindex="-1" class="plx-time-picker__input" role="combobox" aria-expanded="' + !off + '" aria-label="Start time" value="' + show(14 * 60 + 30) + '"' + (off ? ' disabled' : '') + '>' + icn + '</div>'
          + (off ? '' : '<ul class="plx-time-picker__list" role="listbox" aria-label="Start time, Times">' + times + '</ul>') + '</div>');
      },
      labelSelector: '.plx-time-picker__field',
      parts: { w: 'A', ff: 'A', fg: 'A', ffc: 'A', fic: 'A', fdb: 'A', icb: 'B', icw: 'B', lb: 'C', lc: 'C', lr: 'C', lmh: 'C', oh: 'D', ofs: 'D', oab: 'D', ost: 'D', smw: 'E', spx: 'E', sfb: 'E', sft: 'E', sep: 'F' },
      anchors: { A: { part: '.plx-time-picker__field', side: 'left' }, B: { part: '.plx-time-picker__icon', side: 'right' }, C: { part: '.plx-time-picker__list', side: 'right' }, D: { part: TOPT, side: 'left' },
        E: { part: SEG, side: 'top' }, F: { part: '.plx-time-picker__separator', side: 'bottom' } },
      sections: [['Field', ['w', 'ff', 'fg', 'ffc', 'fic', 'fdb', 'icb', 'icw']], ['List', ['lb', 'lc', 'lr', 'lmh', 'oh', 'ofs', 'oab', 'ost']], ['Segments', ['smw', 'spx', 'sfb', 'sft', 'sep']]],
      matrixLabel: 'Time picker by form and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Forms and states · ' + HEAD
    });

    // ---- RelativeDateInput (<RelativeDateInput>): the row of fields and the resolved dates
    var RD = function (n) { return 'plx-comp-relative-date-input-' + n; };
    var sel = function (cls, label, opts, val) { return '<span class="plx-select ' + cls + '"><select tabindex="-1" class="plx-input plx-select__control" aria-label="' + label + '">' + opts.map(function (o) { return '<option' + (o === val ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select><span class="plx-select__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></span>'; };
    DS.registerLab('relative-date-input', {
      name: 'Relative date input', title: 'Plenix relative date input', file: 'platform/components/RelativeDateInput/relative-date-input.css', compPrefix: /^plx-comp-relative-date-input-/,
      store: 'plenix-relative-date-input-lab-tokens', sizes: [['default', 'Default', '.plx-relative-date-input']],
      variants: [['past', 'Past presets (default)'], ['future', 'Future presets'], ['custom', 'Custom n units']],
      states: [['default', 'Default']], content: [['range', 'With the resolved dates']],
      labels: { size: 'Size', variant: 'Direction', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'past', state: 'default', content: 'range' },
      props: [
        { id: 'g', label: 'Gap (fields to dates)', css: ['row-gap'], cat: 'space' },
        { id: 'rg', label: 'Gap between fields', css: ['column-gap'], part: '.plx-relative-date-input__row', cat: 'space' },
        { id: 'pw', label: 'Preset width', css: ['inline-size'], show: 'width', part: '.plx-relative-date-input__preset', cat: 'size' },
        { id: 'uw', label: 'Unit width', css: ['inline-size'], show: 'width', part: '.plx-relative-date-input__unit', cat: 'size' },
        { id: 'dc', label: 'Dates color', css: ['color'], part: '.plx-relative-date-input__range', cat: 'color' },
        { id: 'df', label: 'Dates font', css: ['font-family'], part: '.plx-relative-date-input__range', cat: 'font' },
        { id: 'dfs', label: 'Dates size', css: ['font-size'], part: '.plx-relative-date-input__range', cat: 'font-size' }
      ],
      token: function (id, size, variant) {
        var cu = variant === 'custom';
        switch (id) {
          case 'g': return RD('row-gap');
          case 'rg': return RD('row-column-gap');
          case 'pw': return RD(cu ? 'custom-preset-width' : 'preset-width');
          case 'uw': return cu ? RD('unit-width') : null;
          case 'dc': return RD('range-text');
          case 'df': return RD('range-font-family');
          case 'dfs': return RD('range-font-size');
          default: return null;
        }
      },
      reach: function (full) { return /-range-/.test(full) ? 'the resolved dates of every relative date input' : 'every relative date input'; },
      every: 'every relative date input',
      html: function (variant, size, state, extraCls) {
        var cu = variant === 'custom', fut = variant === 'future';
        var presets = fut ? ['Any time', 'Today', 'Tomorrow', 'Next 7 days', 'Next 30 days', 'Custom'] : ['Any time', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Custom'];
        var row = sel('plx-relative-date-input__preset', 'Modified', presets, cu ? 'Custom' : fut ? 'Next 30 days' : 'Last 7 days')
          + (cu ? '<span class="plx-number-input plx-number-input--width-xs plx-relative-date-input__amount"><input tabindex="-1" class="plx-input plx-input--data" aria-label="Amount" value="3"></span>'
            + sel('plx-relative-date-input__unit', 'Unit', ['days', 'weeks', 'months', 'years'], 'weeks') : '');
        var range = cu ? 'Feb 15 – Mar 7, 2026' : fut ? 'Mar 7 – Apr 5, 2026' : 'Mar 1 – 7, 2026';
        return '<div class="plx-relative-date-input' + (cu ? ' plx-relative-date-input--custom' : '') + ex(extraCls) + '"><div class="plx-relative-date-input__row" role="group" aria-label="Modified">' + row + '</div>'
          + '<p class="plx-relative-date-input__range">' + range + '</p></div>';
      },
      labelSelector: '.plx-relative-date-input__range',
      parts: { g: 'A', rg: 'B', pw: 'C', uw: 'D', dc: 'E', df: 'E', dfs: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-relative-date-input__row', side: 'top' }, C: { part: '.plx-relative-date-input__preset', side: 'bottom' }, D: { part: '.plx-relative-date-input__unit', side: 'top' }, E: { part: '.plx-relative-date-input__range', side: 'right' } },
      sections: [['Fields', ['g', 'rg', 'pw', 'uw']], ['Resolved dates', ['dc', 'df', 'dfs']]],
      matrixLabel: 'Relative date input by direction', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Directions · ' + HEAD
    });

    // ---- LoadMore (<LoadMore>): the row at the end of a list
    var LM = function (n) { return 'plx-comp-load-more-' + n; };
    DS.registerLab('pagination', {
      name: 'Load more', title: 'Plenix load more', file: 'platform/components/LoadMore/load-more.css', compPrefix: /^plx-comp-load-more-/,
      store: 'plenix-load-more-lab-tokens', sizes: [['default', 'Default', '.plx-load-more']],
      variants: [['button', 'Button (default)'], ['infinite', 'Infinite (sentinel)']],
      states: [['default', 'Default']],
      content: [['more', 'More to load'], ['loading', 'Loading'], ['end', 'End of list']],
      labels: { size: 'Size', variant: 'Mode', state: 'State', content: 'State' },
      defaults: { size: 'default', variant: 'button', state: 'default', content: 'more' },
      props: [
        { id: 'g', label: 'Gap (button to count)', css: ['column-gap'], cat: 'space' },
        { id: 'mh', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
        { id: 'py', label: 'Padding top & bottom', css: PAD_BLOCK, show: 'padding-top', cat: 'space' },
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-load-more__count', cat: 'color' },
        { id: 'cf', label: 'Count font', css: ['font-family'], part: '.plx-load-more__count', cat: 'font' },
        { id: 'cfs', label: 'Count size', css: ['font-size'], part: '.plx-load-more__count', cat: 'font-size' },
        { id: 'lc', label: 'Loading text color', css: ['color'], part: '.plx-load-more__loading', cat: 'color' },
        { id: 'lg', label: 'Gap (spinner to text)', css: ['column-gap'], part: '.plx-load-more__loading', cat: 'space' },
        { id: 'ec', label: 'End message color', css: ['color'], part: '.plx-load-more__end', cat: 'color' },
        { id: 'efs', label: 'End message size', css: ['font-size'], part: '.plx-load-more__end', cat: 'font-size' },
        { id: 'bw', label: 'Button minimum width (infinite)', css: ['min-inline-size'], show: 'min-width', part: '.plx-load-more__button', cat: 'size' }
      ],
      token: function (id, size, variant, state, content) {
        var inf = variant === 'infinite', end = content === 'end', loading = content === 'loading';
        switch (id) {
          case 'g': return LM('gap');
          case 'mh': return LM('min-height');
          case 'py': return LM('padding-block');
          case 'cc': return end ? null : LM('count-text');
          case 'cf': return end ? null : LM('count-font-family');
          case 'cfs': return end ? null : LM('count-font-size');
          case 'lc': return inf && loading ? LM('loading-text') : null;
          case 'lg': return inf && loading ? LM('loading-gap') : null;
          case 'ec': return end ? LM('end-text') : null;
          case 'efs': return end ? LM('end-font-size') : null;
          case 'bw': return inf && content === 'more' ? LM('infinite-button-min-width') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-count-/.test(full) ? 'the count of every load more' : /-end-/.test(full) ? 'the end message of every list' : 'every load more'; },
      every: 'every load more',
      html: function (variant, size, state, extraCls, ui) {
        var c = ui && ui.content, inf = variant === 'infinite';
        var body = c === 'end' ? '<p class="plx-load-more__end">You’ve reached the end</p>'
          : inf && c === 'loading' ? '<div class="plx-load-more__loading"><span class="plx-spinner plx-spinner--sm" role="status" aria-label="Loading…"></span><span aria-hidden="true">Loading…</span></div>'
          : '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-load-more__button"' + (c === 'loading' ? ' aria-busy="true" aria-disabled="true"' : '') + '><span class="plx-button__label">Show 4 more</span></button>';
        return '<div class="plx-load-more' + (inf ? ' plx-load-more--infinite' : '') + (c === 'end' ? ' is-end' : '') + ex(extraCls) + '">' + (inf && c !== 'end' ? '<div class="plx-load-more__sentinel" aria-hidden="true"></div>' : '')
          + body + (c === 'end' ? '' : '<span class="plx-load-more__count">8 of 12</span>') + '</div>';
      },
      labelSelector: '.plx-load-more__count',
      parts: { g: 'A', mh: 'A', py: 'A', cc: 'B', cf: 'B', cfs: 'B', lc: 'C', lg: 'C', ec: 'D', efs: 'D', bw: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-load-more__count', side: 'right' }, C: { part: '.plx-load-more__loading', side: 'top' }, D: { part: '.plx-load-more__end', side: 'bottom' }, E: { part: '.plx-load-more__button', side: 'top' } },
      sections: [['Row', ['g', 'mh', 'py', 'bw']], ['Count', ['cc', 'cf', 'cfs']], ['Loading and end', ['lc', 'lg', 'ec', 'efs']]],
      matrixLabel: 'Load more by mode and state', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Modes · ' + HEAD
    });

    // ---- ImageUpload (<ImageUpload>, <ImageCrop>): the drop zone, the previews, the crop step
    var IU = function (n) { return 'plx-comp-image-upload-' + n; }, IC = function (n) { return 'plx-comp-image-crop-' + n; };
    var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
    var img = function (n, ratio) { return '<div class="plx-image plx-image--cover plx-ratio is-loaded" data-plx-ratio="' + ratio + '"><img class="plx-image__img" src="' + ART(n) + '" alt=""></div>'; };
    var fileBtn = function (word) { return '<div class="plx-file-input"><div class="plx-file-input__row"><label class="plx-file-input__trigger"><input type="file" tabindex="-1" class="plx-file-input__native plx-visually-hidden" aria-label="' + word + '">'
      + '<span class="plx-button plx-button--secondary plx-file-input__button" aria-hidden="true"><span class="plx-button__icon">' + icon('attachment') + '</span><span class="plx-button__label">' + word + '</span></span></label></div></div>'; };
    var zone = function (many) { return '<div class="plx-drop-zone plx-image-upload__zone"><span class="plx-image-upload__zone-icon" aria-hidden="true">' + icon('upload') + '</span><span class="plx-image-upload__zone-text">' + (many ? 'Drop images here, or' : 'Drop an image here, or') + '</span>'
      + fileBtn(many ? 'Choose images' : 'Choose image') + '<span class="plx-image-upload__limits">PNG or JPG, up to 5 MB</span></div>'; };
    var item = function (n, name, ratio, many) {
      return '<li class="plx-image-upload__item"><div class="plx-image-upload__preview">' + img(n, ratio) + '</div><div class="plx-image-upload__meta"><span class="plx-image-upload__name">' + name + '</span><span class="plx-image-upload__size">48 kB</span></div>'
        + '<div class="plx-image-upload__actions">' + (many ? '' : fileBtn('Replace')) + '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs' + (many ? ' plx-button--icon-only' : '') + '" aria-label="Remove ' + name + '"><span class="plx-button__icon">' + icon('trash') + '</span>' + (many ? '' : '<span class="plx-button__label">Remove</span>') + '</button></div></li>';
    };
    DS.registerLab('image-upload', {
      name: 'Image upload', title: 'Plenix image upload', file: 'platform/patterns/ImageUpload/image-upload.css', compPrefix: /^plx-comp-image-(upload|crop)-/,
      store: 'plenix-image-upload-lab-tokens', sizes: [['default', 'Default', '.plx-image-upload']],
      variants: [['single', 'Single (default)'], ['multiple', 'Multiple'], ['crop', 'With crop'], ['locked', 'Aspect locked']],
      states: [['default', 'Default']],
      content: [['empty', 'Nothing chosen'], ['chosen', 'Chosen']],
      labels: { size: 'Size', variant: 'Images and shape', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'single', state: 'default', content: 'chosen' },
      props: [
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'g', label: 'Gap between parts', css: ['row-gap'], cat: 'space' },
        { id: 'zg', label: 'Drop zone gap', css: ['row-gap'], part: '.plx-image-upload__zone', cat: 'space' },
        { id: 'zic', label: 'Drop zone icon color', css: ['color'], part: '.plx-image-upload__zone-icon', cat: 'color' },
        { id: 'ztf', label: 'Drop zone text size', css: ['font-size'], part: '.plx-image-upload__zone-text', cat: 'font-size' },
        { id: 'lmc', label: 'Limits color', css: ['color'], part: '.plx-image-upload__limits', cat: 'color' },
        { id: 'pbc', label: 'Preview border color', css: BORDERS, show: 'border-top-color', part: '.plx-image-upload__preview', cat: 'color' },
        { id: 'prad', label: 'Preview corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-image-upload__preview', cat: 'radius' },
        { id: 'pbg', label: 'Preview fill (locked)', css: ['background-color'], part: '.plx-image-upload__preview', cat: 'color' },
        { id: 'nf', label: 'File name font', css: ['font-family'], part: '.plx-image-upload__name', cat: 'font' },
        { id: 'nfs', label: 'File name size', css: ['font-size'], part: '.plx-image-upload__name', cat: 'font-size' },
        { id: 'sc', label: 'File size color', css: ['color'], part: '.plx-image-upload__size', cat: 'color' },
        { id: 'ag', label: 'Actions gap', css: ['column-gap'], part: '.plx-image-upload__actions', cat: 'space' },
        { id: 'gc', label: 'Grid columns (multiple)', css: ['grid-template-columns'], part: '.plx-image-upload__list', cat: 'columns' },
        { id: 'gg', label: 'Grid gap (multiple)', css: ['column-gap'], part: '.plx-image-upload__list', cat: 'space' },
        { id: 'cmw', label: 'Crop: maximum width', css: ['max-inline-size'], show: 'max-width', part: '.plx-image-crop', cat: 'size' },
        { id: 'cbc', label: 'Crop frame border', css: BORDERS, show: 'border-top-color', part: '.plx-image-crop__frame', cat: 'color' },
        { id: 'crad', label: 'Crop frame corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-image-crop__frame', cat: 'radius' },
        { id: 'cag', label: 'Crop actions gap', css: ['column-gap'], part: '.plx-image-crop__actions', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var chosen = content === 'chosen', many = variant === 'multiple', crop = variant === 'crop' && chosen, zoneOn = !crop && (!chosen || many);
        switch (id) {
          case 'mw': return IU('max-width');
          case 'g': return IU('row-gap');
          case 'zg': return zoneOn ? IU('zone-row-gap') : null;
          case 'zic': return zoneOn ? IU('zone-icon-text') : null;
          case 'ztf': return zoneOn ? IU('zone-text-font-size') : null;
          case 'lmc': return zoneOn ? IU('limits-text') : null;
          case 'pbc': return chosen && !crop ? IU('preview-border-color') : null;
          case 'prad': return chosen && !crop ? IU('preview-radius') : null;
          case 'pbg': return chosen && variant === 'locked' ? IU('locked-preview-background') : null;
          case 'nf': return chosen && !crop ? IU('name-font-family') : null;
          case 'nfs': return chosen && !crop ? IU('name-font-size') : null;
          case 'sc': return chosen && !crop ? IU('size-text') : null;
          case 'ag': return chosen && !crop ? IU('actions-gap') : null;
          case 'gc': return chosen && many ? IU('multiple-list-grid-template-columns') : null;
          case 'gg': return chosen && many ? IU('multiple-list-gap') : null;
          case 'cmw': return crop ? IC('max-width') : null;
          case 'cbc': return crop ? IC('frame-border-color') : null;
          case 'crad': return crop ? IC('frame-radius') : null;
          case 'cag': return crop ? IC('actions-gap') : null;
          default: return null;
        }
      },
      reach: function (full) { return /image-crop/.test(full) ? 'every crop step' : /-zone-|-limits-/.test(full) ? 'the drop zone of every image upload' : 'every image upload'; },
      every: 'every image upload',
      html: function (variant, size, state, extraCls, ui) {
        var chosen = ui && ui.content === 'chosen', many = variant === 'multiple', locked = variant === 'locked';
        var cls = 'plx-image-upload' + (many ? ' plx-image-upload--multiple' : '') + (locked || variant === 'crop' ? ' plx-image-upload--locked' : '') + ex(extraCls);
        if (variant === 'crop' && chosen) {
          return '<div class="' + cls + '" role="group" aria-label="Cover image"><div class="plx-image-crop" role="group" aria-label="Crop image"><div class="plx-image-crop__frame" tabindex="-1" role="img" aria-label="Crop area">' + img('14', '16-9') + '</div>'
            + '<div class="plx-image-crop__actions"><button type="button" tabindex="-1" class="plx-button plx-button--secondary"><span class="plx-button__label">Cancel</span></button>'
            + '<button type="button" tabindex="-1" class="plx-button plx-button--primary"><span class="plx-button__icon">' + icon('ed-crop') + '</span><span class="plx-button__label">Apply</span></button></div></div></div>';
        }
        var list = !chosen ? '' : '<ul class="plx-image-upload__list">' + (many ? item('12', 'chair-front.svg', '1-1', true) + item('14', 'chair-side.svg', '1-1', true) + item('16', 'chair-back.svg', '1-1', true)
          : item(locked ? '16' : '12', locked ? 'easter-banner.svg' : 'north-aisle.svg', locked ? '16-9' : '4-3', false)) + '</ul>';
        return '<div class="' + cls + '" role="group" aria-label="Cover image">' + list + (!chosen || many ? zone(many) : '') + '</div>';
      },
      labelSelector: '.plx-image-upload__zone-text, .plx-image-upload__name',
      parts: { mw: 'A', g: 'A', zg: 'B', zic: 'B', ztf: 'B', lmc: 'B', pbc: 'C', prad: 'C', pbg: 'C', nf: 'D', nfs: 'D', sc: 'D', ag: 'E', gc: 'F', gg: 'F', cmw: 'G', cbc: 'G', crad: 'G', cag: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-image-upload__zone', side: 'right' }, C: { part: '.plx-image-upload__preview', side: 'right' }, D: { part: '.plx-image-upload__name', side: 'bottom' },
        E: { part: '.plx-image-upload__actions', side: 'right' }, F: { part: '.plx-image-upload__list', side: 'top' }, G: { part: '.plx-image-crop__frame', side: 'right' }, H: { part: '.plx-image-crop__actions', side: 'bottom' } },
      sections: [['Area', ['mw', 'g']], ['Drop zone', ['zg', 'zic', 'ztf', 'lmc']], ['Previews', ['pbc', 'prad', 'pbg', 'nf', 'nfs', 'sc', 'ag', 'gc', 'gg']], ['Crop', ['cmw', 'cbc', 'crad', 'cag']]],
      matrixLabel: 'Image upload by images and shape', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Images and shapes · ' + HEAD
    });

    // ---- AvatarUpload (<AvatarUpload>): the Avatar, its actions and the hint
    var AU = function (n) { return 'plx-comp-avatar-upload-' + n; };
    DS.registerLab('avatar-upload', {
      name: 'Avatar upload', title: 'Plenix avatar upload', file: 'platform/patterns/AvatarUpload/avatar-upload.css', compPrefix: /^plx-comp-avatar-upload-/,
      store: 'plenix-avatar-upload-lab-tokens', sizes: [['default', 'Default', '.plx-avatar-upload']],
      variants: [['square', 'Square (default)'], ['remove', 'With remove'], ['crop', 'Crop step']],
      states: [['default', 'Default']], content: [['initials', 'Initials'], ['picture', 'A picture']],
      labels: { size: 'Size', variant: 'Picture', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'remove', state: 'default', content: 'picture' },
      props: [
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'g', label: 'Gap (row to crop)', css: ['row-gap'], cat: 'space' },
        { id: 'rg', label: 'Gap (avatar to actions)', css: ['column-gap'], part: '.plx-avatar-upload__row', cat: 'space' },
        { id: 'bg', label: 'Gap (actions to hint)', css: ['row-gap'], part: '.plx-avatar-upload__body', cat: 'space' },
        { id: 'ag', label: 'Actions gap', css: ['column-gap'], part: '.plx-avatar-upload__actions', cat: 'space' },
        { id: 'hc', label: 'Hint color', css: ['color'], part: '.plx-avatar-upload__hint', cat: 'color' },
        { id: 'hfs', label: 'Hint size', css: ['font-size'], part: '.plx-avatar-upload__hint', cat: 'font-size' }
      ],
      token: function (id) {
        return { mw: AU('max-width'), g: AU('row-gap'), rg: AU('row-column-gap'), bg: AU('body-row-gap'), ag: AU('actions-gap'), hc: AU('hint-text'), hfs: AU('hint-font-size') }[id] || null;
      },
      reach: function () { return 'every avatar upload'; },
      every: 'every avatar upload',
      html: function (variant, size, state, extraCls, ui) {
        var picOn = ui && ui.content === 'picture' && variant !== 'crop';
        var avatar = '<span class="plx-avatar plx-avatar--64" data-plx-avatar="" role="img" aria-label="Maya Chen’s photo">' + (picOn ? '<img class="plx-avatar__img" src="' + ART('12') + '" alt="">' : '<span class="plx-avatar__initials">MC</span>') + '</span>';
        var actions = fileBtn(picOn ? 'Change photo' : 'Add photo') + (variant === 'remove' && picOn ? '<button type="button" tabindex="-1" class="plx-button plx-button--ghost"><span class="plx-button__icon">' + icon('trash') + '</span><span class="plx-button__label">Remove photo</span></button>' : '');
        var crop = variant === 'crop' ? '<div class="plx-image-crop" role="group" aria-label="Crop image"><div class="plx-image-crop__frame" tabindex="-1" role="img" aria-label="Crop area">' + img('16', '1-1') + '</div></div>' : '';
        return '<div class="plx-avatar-upload' + ex(extraCls) + '"><div class="plx-avatar-upload__row">' + avatar + '<div class="plx-avatar-upload__body"><div class="plx-avatar-upload__actions">' + actions + '</div>'
          + '<span class="plx-avatar-upload__hint">At least 200 × 200 pixels</span></div></div>' + crop + '</div>';
      },
      labelSelector: '.plx-avatar-upload__hint',
      parts: { mw: 'A', g: 'A', rg: 'B', bg: 'C', ag: 'D', hc: 'E', hfs: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-avatar-upload__row', side: 'top' }, C: { part: '.plx-avatar-upload__body', side: 'right' }, D: { part: '.plx-avatar-upload__actions', side: 'top' }, E: { part: '.plx-avatar-upload__hint', side: 'bottom' } },
      sections: [['Layout', ['mw', 'g', 'rg', 'bg', 'ag']], ['Hint', ['hc', 'hfs']]],
      matrixLabel: 'Avatar upload by picture', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Pictures · ' + HEAD
    });
  })();
}
