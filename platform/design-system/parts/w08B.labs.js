/* Plenix design system · library part w08B: the labs of wave 8, lane B. VirtualList, Carousel, PeopleGroup,
   PermissionSummary and QueryBuilder, each drawn with the markup the component renders, so every value shows with the one
   --plx-comp-* token behind it. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name) { return DS.icon(name); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var PAD_INLINE = ['padding-inline-start', 'padding-inline-end'], PAD_BLOCK = ['padding-block-start', 'padding-block-end'];
    var btn = function (o) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--' + (o.variant || 'secondary') + (o.size ? ' plx-button--size-' + o.size : '') + (o.only ? ' plx-button--icon-only' : '') + ex(o.cls) + '"'
        + (o.label ? ' aria-label="' + o.label + '"' : '') + (o.disabled ? ' disabled' : '') + '>' + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + (o.text ? '<span class="plx-button__label">' + o.text + '</span>' : '') + '</button>';
    };

    // ---- VirtualList (<VirtualList>): the count, the scroll area and its rows
    var VL = function (n) { return 'plx-comp-virtual-list-' + n; };
    var vRow = function (i, o) {
      o = o || {};
      return '<div role="listitem" aria-posinset="' + (i + 1) + '" aria-setsize="4000" class="plx-virtual-list__item">' + '<span class="plx-virtual-list__icon" aria-hidden="true">' + icon(o.icon || 'ed-image') + '</span>'
        + '<span class="plx-virtual-list__text"><span class="plx-virtual-list__label">' + (o.label || 'Banner ' + (i + 1)) + '</span><span class="plx-virtual-list__description">' + (o.desc || 'PNG · Campaigns') + '</span></span>'
        + '<span class="plx-virtual-list__meta">' + (o.meta || (12 + i * 7) + ' kB') + '</span></div>';
    };
    var vHead = function (label, n) { return '<div role="listitem" class="plx-virtual-list__item plx-virtual-list__header plx-virtual-sticky"><span class="plx-virtual-list__header-label">' + label + '</span><span class="plx-virtual-list__header-count">' + n + ' items</span></div>'; };
    var LONG = 'The north aisle banner needs a second proof before it goes to print, and the archive scans are waiting for their captions.';
    DS.registerLab('virtual-list', {
      name: 'Virtualized list', title: 'Plenix virtualized list', file: 'platform/components/VirtualList/virtual-list.css', compPrefix: /^plx-comp-virtual-list-/,
      store: 'plenix-virtual-list-lab-tokens', sizes: [['default', 'Default', '.plx-virtual-list']],
      variants: [['fixed', 'Fixed rows (default)'], ['variable', 'Variable rows'], ['groups', 'With groups']],
      states: [['default', 'Default'], ['focus', 'Focus']],
      content: [['rows', 'Rows'], ['loading', 'Loading more'], ['empty', 'Empty']],
      labels: { size: 'Size', variant: 'Rows', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'fixed', state: 'default', content: 'rows' },
      props: [
        { id: 'g', label: 'Gap (count to list)', css: ['row-gap'], cat: 'space' },
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-virtual-list__count', cat: 'color' },
        { id: 'cf', label: 'Count font', css: ['font-family'], part: '.plx-virtual-list__count', cat: 'font' },
        { id: 'cfs', label: 'Count size', css: ['font-size'], part: '.plx-virtual-list__count', cat: 'font-size' },
        { id: 'bg', label: 'Background', css: ['background-color'], part: '.plx-virtual-list__viewport', cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', part: '.plx-virtual-list__viewport', cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', part: '.plx-virtual-list__viewport', cat: 'border-width' },
        { id: 'r', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-virtual-list__viewport', cat: 'radius' },
        { id: 'fb', label: 'Border color in focus', css: BORDERS, show: 'border-top-color', part: '.plx-virtual-list__viewport', cat: 'color' },
        { id: 'h', label: 'Height', css: ['block-size'], show: 'height', part: '.plx-virtual-list__viewport', cat: 'size' },
        { id: 'tx', label: 'Text color', css: ['color'], part: '.plx-virtual-list__viewport', cat: 'color' },
        { id: 'fs', label: 'Text size', css: ['font-size'], part: '.plx-virtual-list__viewport', cat: 'font-size' },
        { id: 'ih', label: 'Row height', css: ['block-size'], show: 'height', part: '.plx-virtual-list__item:not(.plx-virtual-list__header)', cat: 'control-height' },
        { id: 'imh', label: 'Row minimum height (variable)', css: ['min-block-size'], show: 'min-height', part: '.plx-virtual-list__item:not(.plx-virtual-list__header)', cat: 'control-height' },
        { id: 'ig', label: 'Gap (row parts)', css: ['column-gap'], part: '.plx-virtual-list__item:not(.plx-virtual-list__header)', cat: 'space' },
        { id: 'ip', label: 'Row padding start & end', css: PAD_INLINE, show: 'padding-left', part: '.plx-virtual-list__item:not(.plx-virtual-list__header)', cat: 'space' },
        { id: 'vp', label: 'Row padding top & bottom (variable)', css: PAD_BLOCK, show: 'padding-top', part: '.plx-virtual-list__item:not(.plx-virtual-list__header)', cat: 'space' },
        { id: 'dc', label: 'Divider color', css: ['border-bottom-color'], part: '.plx-virtual-list__item', cat: 'color' },
        { id: 'dw', label: 'Divider width', css: ['border-bottom-width'], part: '.plx-virtual-list__item', cat: 'border-width' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-virtual-list__icon', cat: 'color' },
        { id: 'dt', label: 'Description color', css: ['color'], part: '.plx-virtual-list__description', cat: 'color' },
        { id: 'dfs', label: 'Description size', css: ['font-size'], part: '.plx-virtual-list__description', cat: 'font-size' },
        { id: 'mt', label: 'Technical value color', css: ['color'], part: '.plx-virtual-list__meta', cat: 'color' },
        { id: 'mf', label: 'Technical value font', css: ['font-family'], part: '.plx-virtual-list__meta', cat: 'font' },
        { id: 'mfs', label: 'Technical value size', css: ['font-size'], part: '.plx-virtual-list__meta', cat: 'font-size' },
        { id: 'hb', label: 'Header background', css: ['background-color'], part: '.plx-virtual-list__header', cat: 'color' },
        { id: 'ht', label: 'Header text color', css: ['color'], part: '.plx-virtual-list__header-label', cat: 'color' },
        { id: 'hfs', label: 'Header text size', css: ['font-size'], part: '.plx-virtual-list__header-label', cat: 'font-size' },
        { id: 'hfw', label: 'Header weight', css: ['font-weight'], part: '.plx-virtual-list__header-label', cat: 'font-weight' },
        { id: 'hc', label: 'Header count color', css: ['color'], part: '.plx-virtual-list__header-count', cat: 'color' },
        { id: 'lc', label: 'Loading text color', css: ['color'], part: '.plx-virtual-list__loading', cat: 'color' },
        { id: 'lg', label: 'Gap (spinner to text)', css: ['column-gap'], part: '.plx-virtual-list__loading', cat: 'space' },
        { id: 'ec', label: 'Empty text color', css: ['color'], part: '.plx-virtual-list__empty', cat: 'color' },
        { id: 'ep', label: 'Empty padding', css: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'], show: 'padding-top', part: '.plx-virtual-list__empty', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var rows = content !== 'empty', vari = variant === 'variable', groups = variant === 'groups';
        switch (id) {
          case 'g': return VL('gap');
          case 'cc': return VL('count-text');
          case 'cf': return VL('count-font-family');
          case 'cfs': return VL('count-font-size');
          case 'bg': return VL('background');
          case 'bc': return state === 'focus' ? null : VL('border-color');
          case 'bw': return VL('border-width');
          case 'r': return VL('radius');
          case 'fb': return state === 'focus' ? VL('focus-border-color') : null;
          case 'h': return VL(groups ? 'height-lg' : 'height-md');
          case 'tx': return VL('text');
          case 'fs': return VL('font-size');
          case 'ih': return rows && !vari ? VL('item-height') : null;
          case 'imh': return rows && vari ? VL('item-height') : null;
          case 'ig': return rows ? VL('item-gap') : null;
          case 'ip': return rows ? VL('item-padding-inline') : null;
          case 'vp': return rows && vari ? VL('variable-padding-block') : null;
          case 'dc': return rows ? VL('item-divider-color') : null;
          case 'dw': return rows ? VL('item-divider-width') : null;
          case 'ic': return rows ? VL('icon-text') : null;
          case 'dt': return rows ? VL('description-text') : null;
          case 'dfs': return rows ? VL('description-font-size') : null;
          case 'mt': return rows ? VL('meta-text') : null;
          case 'mf': return rows ? VL('meta-font-family') : null;
          case 'mfs': return rows ? VL('meta-font-size') : null;
          case 'hb': return rows && groups ? VL('header-background') : null;
          case 'ht': return rows && groups ? VL('header-text') : null;
          case 'hfs': return rows && groups ? VL('header-font-size') : null;
          case 'hfw': return rows && groups ? VL('header-font-weight') : null;
          case 'hc': return rows && groups ? VL('header-count-text') : null;
          case 'lc': return content === 'loading' ? VL('loading-text') : null;
          case 'lg': return content === 'loading' ? VL('loading-gap') : null;
          case 'ec': return content === 'empty' ? VL('empty-text') : null;
          case 'ep': return content === 'empty' ? VL('empty-padding') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-header-/.test(full) ? 'the group headers of every virtualized list' : /-(item|icon|description|meta|variable)-/.test(full) ? 'the rows of every virtualized list' : 'every virtualized list'; },
      every: 'every virtualized list',
      html: function (variant, size, state, extraCls, ui) {
        var c = ui && ui.content, groups = variant === 'groups', vari = variant === 'variable';
        var rows = '';
        if (c !== 'empty') {
          if (groups) rows = vHead('B', 46) + vRow(0, { icon: 'person', label: 'Brandt, Ada', desc: 'Brand team', meta: 'ext. 2001' }) + vRow(1, { icon: 'person', label: 'Brandt, Omar', desc: 'Web team', meta: 'ext. 2014' }) + vHead('C', 80) + vRow(2, { icon: 'person', label: 'Chen, Maya', desc: 'Brand team', meta: 'ext. 2032' });
          else if (vari) rows = vRow(0, { icon: 'pencil', label: 'Note 1', desc: LONG, meta: 'v2' }) + vRow(1, { icon: 'pencil', label: 'Note 2', desc: 'Proof approved.', meta: 'v3' }) + vRow(2, { icon: 'pencil', label: 'Note 3', desc: LONG, meta: 'v1' });
          else rows = vRow(0) + vRow(1, { icon: 'document', label: 'Poster 2', desc: 'PDF · Brand', meta: '640 kB' }) + vRow(2) + vRow(3, { icon: 'doc-text', label: 'Register 4', desc: 'TXT · Archive', meta: '2 kB' });
        }
        var tail = c === 'loading' ? '<div role="listitem" class="plx-virtual-list__loading"><span class="plx-spinner plx-spinner--sm" role="status" aria-label="Loading…"></span><span aria-hidden="true">Loading…</span></div>'
          : c === 'empty' ? '<p class="plx-virtual-list__empty">No items</p>' : '';
        return '<div class="plx-virtual-list plx-virtual-list--' + (vari ? 'variable' : 'fixed') + (groups ? ' plx-virtual-list--groups' : '') + ex(extraCls) + '">'
          + '<div class="plx-virtual-list__count">' + (c === 'empty' ? '0 items' : '4,000 items') + '</div>'
          + '<div class="plx-virtual-list__viewport' + (state === 'focus' ? ' is-focus-visible' : '') + '" role="list" tabindex="-1" aria-label="Assets" data-plx-height="' + (groups ? 'lg' : 'md') + '">' + rows + tail + '</div></div>';
      },
      labelSelector: '.plx-virtual-list__label',
      parts: { g: 'A', cc: 'A', cf: 'A', cfs: 'A', bg: 'B', bc: 'B', bw: 'B', r: 'B', fb: 'B', h: 'B', tx: 'B', fs: 'B', ih: 'C', imh: 'C', ig: 'C', ip: 'C', vp: 'C', dc: 'C', dw: 'C', ic: 'D', dt: 'D', dfs: 'D', mt: 'D', mf: 'D', mfs: 'D', hb: 'E', ht: 'E', hfs: 'E', hfw: 'E', hc: 'E', lc: 'F', lg: 'F', ec: 'F', ep: 'F' },
      anchors: { A: { part: '.plx-virtual-list__count', side: 'top' }, B: { part: '.plx-virtual-list__viewport', side: 'left' }, C: { part: '.plx-virtual-list__item', side: 'right' }, D: { part: '.plx-virtual-list__meta', side: 'right' }, E: { part: '.plx-virtual-list__header', side: 'top' }, F: { part: '.plx-virtual-list__viewport', side: 'bottom' } },
      sections: [['Count and scroll area', ['g', 'cc', 'cf', 'cfs', 'bg', 'bc', 'bw', 'r', 'fb', 'h', 'tx', 'fs']], ['Rows', ['ih', 'imh', 'ig', 'ip', 'vp', 'dc', 'dw', 'ic', 'dt', 'dfs', 'mt', 'mf', 'mfs']], ['Group headers', ['hb', 'ht', 'hfs', 'hfw', 'hc']], ['Loading and empty', ['lc', 'lg', 'ec', 'ep']]],
      matrixLabel: 'Virtualized list by rows', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Rows · ' + HEAD
    });

    // ---- Carousel (<Carousel>): the strip, its slides and the controls
    var CA = function (n) { return 'plx-comp-carousel-' + n; };
    var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
    var cSlide = function (i, n, title) {
      return '<div role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of 5" class="plx-carousel__slide"><article class="plx-media-card plx-media-card--interactive"><div class="plx-media-card__media" data-plx-aspect="16/9"><img class="plx-media-card__image" src="' + ART(n) + '" alt=""></div>'
        + '<div class="plx-media-card__info"><div class="plx-media-card__text"><span class="plx-media-card__title">' + title + '</span><span class="plx-media-card__meta">PNG · 2.4 MB</span></div></div></article></div>';
    };
    DS.registerLab('carousel', {
      name: 'Carousel', title: 'Plenix carousel', file: 'platform/components/Carousel/carousel.css', compPrefix: /^plx-comp-carousel-/,
      store: 'plenix-carousel-lab-tokens', sizes: [['default', 'Default', '.plx-carousel']],
      variants: [['one', 'One per view (default)'], ['several', 'Several per view']],
      states: [['default', 'Default'], ['hover', 'Hover (a dot)'], ['focus', 'Focus (a dot)'], ['strip', 'Focus (the strip)']],
      content: [['both', 'Arrows and dots (default)'], ['dots', 'Dots'], ['arrows', 'Arrows'], ['autoplay', 'Autoplay with Pause']],
      labels: { size: 'Size', variant: 'Per view', state: 'State', content: 'Controls' },
      defaults: { size: 'default', variant: 'one', state: 'default', content: 'both' },
      props: [
        { id: 'cg', label: 'Gap (strip to controls)', css: ['row-gap'], cat: 'space' },
        { id: 'g', label: 'Gap between slides', css: ['column-gap'], part: '.plx-carousel__track', cat: 'space' },
        { id: 'tfc', label: 'Strip focus outline color', css: ['outline-color'], part: '.plx-carousel__track', cat: 'color' },
        { id: 'tfw', label: 'Strip focus outline width', css: ['outline-width'], part: '.plx-carousel__track', cat: 'border-width' },
        { id: 'tfo', label: 'Strip focus outline offset', css: ['outline-offset'], part: '.plx-carousel__track', cat: 'space' },
        { id: 'ccg', label: 'Gap between controls', css: ['column-gap'], part: '.plx-carousel__controls', cat: 'space' },
        { id: 'dt', label: 'Dot target size', css: ['inline-size', 'block-size'], show: 'width', part: '.plx-carousel__dot', cat: 'size' },
        { id: 'dtr', label: 'Dot target radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-carousel__dot', cat: 'radius' },
        { id: 'ds', label: 'Dot size', css: ['inline-size', 'block-size'], show: 'width', part: '.plx-carousel__dot', pseudo: '::before', cat: 'size' },
        { id: 'dr', label: 'Dot radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-carousel__dot', pseudo: '::before', cat: 'radius' },
        { id: 'db', label: 'Dot color', css: ['background-color'], part: '.plx-carousel__dot:not(.is-current)', pseudo: '::before', cat: 'color' },
        { id: 'dcb', label: 'Current dot color', css: ['background-color'], part: '.plx-carousel__dot.is-current', pseudo: '::before', cat: 'color' },
        { id: 'dfc', label: 'Dot focus outline color', css: ['outline-color'], part: '.plx-carousel__dot.is-focus-visible', cat: 'color' },
        { id: 'dfw', label: 'Dot focus outline width', css: ['outline-width'], part: '.plx-carousel__dot.is-focus-visible', cat: 'border-width' },
        { id: 'dfo', label: 'Dot focus outline offset', css: ['outline-offset'], part: '.plx-carousel__dot.is-focus-visible', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var dots = content !== 'arrows';
        switch (id) {
          case 'cg': return CA('controls-gap');
          case 'g': return CA('gap');
          case 'tfc': return state === 'strip' ? CA('track-focus-outline-color') : null;
          case 'tfw': return state === 'strip' ? CA('track-focus-outline-width') : null;
          case 'tfo': return state === 'strip' ? CA('track-focus-outline-offset') : null;
          case 'ccg': return CA('controls-column-gap');
          case 'dt': return dots ? CA('dot-target') : null;
          case 'dtr': return dots ? CA('dot-target-radius') : null;
          case 'ds': return dots ? CA('dot-size') : null;
          case 'dr': return dots ? CA('dot-radius') : null;
          case 'db': return dots ? CA(state === 'hover' ? 'dot-hover-background' : 'dot-background') : null;
          case 'dcb': return dots ? CA('dot-current-background') : null;
          case 'dfc': return dots && state === 'focus' ? CA('dot-focus-outline-color') : null;
          case 'dfw': return dots && state === 'focus' ? CA('dot-focus-outline-width') : null;
          case 'dfo': return dots && state === 'focus' ? CA('dot-focus-outline-offset') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-dot-/.test(full) ? 'the page dots of every carousel' : 'every carousel'; },
      every: 'every carousel',
      html: function (variant, size, state, extraCls, ui) {
        var c = ui && ui.content, per = variant === 'several' ? 3 : 1;
        var slides = cSlide(0, 10, 'Easter banner') + cSlide(1, 12, 'Advent wreath') + cSlide(2, 14, 'Choir poster') + cSlide(3, 16, 'Archive register') + cSlide(4, 18, 'Garden open day');
        var pages = per > 1 ? 2 : 5, dots = '';
        for (var i = 0; i < pages; i++) dots += '<button type="button" tabindex="-1" class="plx-carousel__dot' + (i === 0 ? ' is-current' : '') + (i === 1 && state === 'hover' ? ' is-hover' : '') + (i === 1 && state === 'focus' ? ' is-focus-visible' : '') + '"'
          + (i === 0 ? ' aria-current="true"' : '') + ' aria-label="Go to ' + (per > 1 ? 'page ' : 'slide ') + (i + 1) + '"></button>';
        var controls = (c === 'autoplay' ? btn({ variant: 'ghost', size: 'sm', cls: 'plx-carousel__play', label: 'Pause the slides', text: 'Pause' }) : '')
          + (c !== 'dots' ? btn({ size: 'sm', only: true, icon: 'chevron-left', label: 'Previous slide', cls: 'plx-carousel__previous', disabled: true }) : '')
          + (c !== 'arrows' ? '<div class="plx-carousel__dots" role="group" aria-label="Slides">' + dots + '</div>' : '')
          + (c !== 'dots' ? btn({ size: 'sm', only: true, icon: 'chevron-right', label: 'Next slide', cls: 'plx-carousel__next' }) : '');
        return '<section aria-roledescription="carousel" aria-label="Featured assets" class="plx-carousel' + (per > 1 ? ' plx-carousel--multiple' : '') + ex(extraCls) + '" data-plx-per-view="' + per + '">'
          + '<div class="plx-carousel__track' + (state === 'strip' ? ' is-focus-visible' : '') + '" tabindex="-1" aria-label="Slides" aria-live="' + (c === 'autoplay' ? 'off' : 'polite') + '">' + slides + '</div>'
          + '<div class="plx-carousel__controls">' + controls + '</div></section>';
      },
      labelSelector: '.plx-media-card__title',
      parts: { cg: 'A', g: 'B', tfc: 'B', tfw: 'B', tfo: 'B', ccg: 'C', dt: 'D', dtr: 'D', ds: 'D', dr: 'D', db: 'D', dcb: 'D', dfc: 'D', dfw: 'D', dfo: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-carousel__track', side: 'top' }, C: { part: '.plx-carousel__controls', side: 'bottom' }, D: { part: '.plx-carousel__dots', side: 'right' } },
      sections: [['Strip', ['cg', 'g', 'tfc', 'tfw', 'tfo']], ['Controls', ['ccg']], ['Page dots', ['dt', 'dtr', 'ds', 'dr', 'db', 'dcb', 'dfc', 'dfw', 'dfo']]],
      matrixLabel: 'Carousel by slides per view', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Per view · ' + HEAD
    });

    // ---- PeopleGroup (<PeopleGroup>): a team or a group in one row
    var PG = function (n) { return 'plx-comp-people-group-' + n; };
    var av = function (ini, size, cls) { return '<span class="plx-avatar plx-avatar--' + (size || '28') + ex(cls) + '" data-plx-avatar="" aria-hidden="true">' + ini + '</span>'; };
    DS.registerLab('people-group', {
      name: 'Team', title: 'Plenix team and group', file: 'platform/patterns/PeopleGroup/people-group.css', compPrefix: /^plx-comp-people-group-/,
      store: 'plenix-people-group-lab-tokens', sizes: [['default', 'Default', '.plx-people-group']],
      variants: [['team', 'Team'], ['group', 'Group']],
      states: [['default', 'Default']],
      content: [['count', 'With member count'], ['plain', 'Without a count']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Count' },
      defaults: { size: 'default', variant: 'team', state: 'default', content: 'count' },
      props: [
        { id: 'g', label: 'Gap (picture, text, members)', css: ['column-gap'], cat: 'space' },
        { id: 'bg', label: 'Gap between the lines', css: ['row-gap'], part: '.plx-people-group__body', cat: 'space' },
        { id: 'nt', label: 'Name color', css: ['color'], part: '.plx-people-group__name', cat: 'color' },
        { id: 'nfs', label: 'Name size', css: ['font-size'], part: '.plx-people-group__name', cat: 'font-size' },
        { id: 'nfw', label: 'Name weight', css: ['font-weight'], part: '.plx-people-group__name', cat: 'font-weight' },
        { id: 'mt', label: 'Kind and count color', css: ['color'], part: '.plx-people-group__meta', cat: 'color' },
        { id: 'mfs', label: 'Kind and count size', css: ['font-size'], part: '.plx-people-group__meta', cat: 'font-size' },
        { id: 'mg', label: 'Gap (kind, count, source)', css: ['column-gap'], part: '.plx-people-group__meta', cat: 'space' },
        { id: 'nf', label: 'Count number font', css: ['font-family'], part: '.plx-people-group__number', cat: 'font' },
        { id: 'dt', label: 'Description color', css: ['color'], part: '.plx-people-group__description', cat: 'color' },
        { id: 'dfs', label: 'Description size', css: ['font-size'], part: '.plx-people-group__description', cat: 'font-size' }
      ],
      token: function (id, size, variant, state, content) {
        var count = content === 'count';
        switch (id) {
          case 'g': return PG('gap');
          case 'bg': return PG('body-gap');
          case 'nt': return PG('name-text');
          case 'nfs': return PG('name-font-size');
          case 'nfw': return PG('name-font-weight');
          case 'mt': return PG('meta-text');
          case 'mfs': return PG('meta-font-size');
          case 'mg': return PG('meta-gap');
          case 'nf': return count ? PG('number-font-family') : null;
          case 'dt': return PG('description-text');
          case 'dfs': return PG('description-font-size');
          default: return null;
        }
      },
      reach: function () { return 'every team and group'; },
      every: 'every team and group',
      html: function (variant, size, state, extraCls, ui) {
        var group = variant === 'group', count = ui && ui.content === 'count';
        var sep = '<span class="plx-people-group__separator" aria-hidden="true">·</span>';
        var media = group ? '<span class="plx-icon-tile plx-icon-tile--md plx-icon-tile--gray" aria-hidden="true">' + DS.icon('settings-users', 'plx-icon--size-md plx-icon-tile__icon') + '</span>' : av('BT', '40');
        var members = group ? btn({ variant: 'ghost', size: 'sm', cls: 'plx-people-group__show', text: 'Show members' })
          : '<div role="group" aria-label="Members of Brand team" class="plx-avatar-group plx-avatar-group--stack plx-avatar-group--sm plx-people-group__members">' + av('MC', '28', 'plx-avatar-group__avatar') + av('AK', '28', 'plx-avatar-group__avatar') + av('RM', '28', 'plx-avatar-group__avatar') + av('PN', '28', 'plx-avatar-group__avatar') + av('+4', '28', 'plx-avatar-group__more') + '</div>';
        return '<div class="plx-people-group plx-people-group--' + (group ? 'group' : 'team') + ex(extraCls) + '"><span class="plx-people-group__media" aria-hidden="true">' + media + '</span>'
          + '<span class="plx-people-group__body"><span class="plx-people-group__name">' + (group ? 'Archive editors' : 'Brand team') + '</span>'
          + '<span class="plx-people-group__meta"><span class="plx-people-group__kind">' + (group ? 'Group' : 'Team') + '</span>'
          + (count ? sep + '<span class="plx-people-group__count"><span class="plx-people-group__number">' + (group ? '48' : '8') + '</span> members</span>' : '')
          + (group ? sep + '<span class="plx-people-group__source">Synced from directory</span>' : '') + '</span>'
          + '<span class="plx-people-group__description">' + (group ? 'Everyone who edits the archive' : 'Design, print and the parish style guide') + '</span></span>' + members + '</div>';
      },
      labelSelector: '.plx-people-group__name',
      parts: { g: 'A', bg: 'B', nt: 'C', nfs: 'C', nfw: 'C', mt: 'D', mfs: 'D', mg: 'D', nf: 'D', dt: 'E', dfs: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-people-group__body', side: 'top' }, C: { part: '.plx-people-group__name', side: 'top' }, D: { part: '.plx-people-group__meta', side: 'right' }, E: { part: '.plx-people-group__description', side: 'bottom' } },
      sections: [['Row', ['g', 'bg']], ['Name', ['nt', 'nfs', 'nfw']], ['Kind, count and source', ['mt', 'mfs', 'mg', 'nf']], ['Description', ['dt', 'dfs']]],
      matrixLabel: 'Team and group by kind', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Kinds · ' + HEAD
    });

    // ---- PermissionSummary (<PermissionSummary>): the access line and the Can and Cannot lists
    var PS = function (n) { return 'plx-comp-permission-summary-' + n; };
    var li = function (yes, text) { return '<li class="plx-list__item plx-list__item--' + (yes ? 'success' : 'danger') + '"><span class="plx-list__icon" aria-hidden="true">' + icon(yes ? 'check' : 'close') + '</span><span class="plx-list__text">' + text + '</span></li>'; };
    DS.registerLab('permission-summary', {
      name: 'Permission summary', title: 'Plenix permission summary', file: 'platform/patterns/PermissionSummary/permission-summary.css', compPrefix: /^plx-comp-permission-summary-/,
      store: 'plenix-permission-summary-lab-tokens', sizes: [['default', 'Default', '.plx-permission-summary']],
      variants: [['list', 'Can and cannot lists (default)'], ['compact', 'Compact']],
      states: [['default', 'Default']],
      content: [['manage', 'With Manage access'], ['plain', 'Without an action']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Action' },
      defaults: { size: 'default', variant: 'list', state: 'default', content: 'manage' },
      props: [
        { id: 'g', label: 'Gap (access line to lists)', css: ['row-gap'], cat: 'space' },
        { id: 'hg', label: 'Gap (icon, access, action)', css: ['column-gap'], part: '.plx-permission-summary__head', cat: 'space' },
        { id: 'ib', label: 'Icon box height', css: ['block-size'], show: 'height', part: '.plx-permission-summary__icon', cat: 'size' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-permission-summary__icon', cat: 'color' },
        { id: 'lt', label: 'Access color', css: ['color'], part: '.plx-permission-summary__level', cat: 'color' },
        { id: 'lfs', label: 'Access size', css: ['font-size'], part: '.plx-permission-summary__level', cat: 'font-size' },
        { id: 'lfw', label: 'Access weight', css: ['font-weight'], part: '.plx-permission-summary__level', cat: 'font-weight' },
        { id: 'llh', label: 'Access line height', css: ['line-height'], part: '.plx-permission-summary__level', cat: 'line-height' },
        { id: 'dt', label: 'Detail color', css: ['color'], part: '.plx-permission-summary__detail', cat: 'color' },
        { id: 'dfs', label: 'Detail size', css: ['font-size'], part: '.plx-permission-summary__detail', cat: 'font-size' },
        { id: 'lg', label: 'Gap (Can to Cannot)', css: ['column-gap'], part: '.plx-permission-summary__lists', cat: 'space' },
        { id: 'sg', label: 'Gap (heading to list)', css: ['row-gap'], part: '.plx-permission-summary__section', cat: 'space' },
        { id: 'ht', label: 'Heading color', css: ['color'], part: '.plx-permission-summary__heading', cat: 'color' },
        { id: 'hfs', label: 'Heading size', css: ['font-size'], part: '.plx-permission-summary__heading', cat: 'font-size' },
        { id: 'hfw', label: 'Heading weight', css: ['font-weight'], part: '.plx-permission-summary__heading', cat: 'font-weight' }
      ],
      token: function (id, size, variant) {
        var list = variant !== 'compact';
        switch (id) {
          case 'g': return PS(list ? 'gap' : 'compact-gap');
          case 'hg': return PS('head-gap');
          case 'ib': return PS('icon-box');
          case 'ic': return PS('icon-text');
          case 'lt': return PS('level-text');
          case 'lfs': return PS('level-font-size');
          case 'lfw': return PS('level-font-weight');
          case 'llh': return PS('level-line-height');
          case 'dt': return PS('detail-text');
          case 'dfs': return PS('detail-font-size');
          case 'lg': return list ? PS('lists-gap') : null;
          case 'sg': return list ? PS('section-gap') : null;
          case 'ht': return list ? PS('heading-text') : null;
          case 'hfs': return list ? PS('heading-font-size') : null;
          case 'hfw': return list ? PS('heading-font-weight') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-(heading|section|lists)-/.test(full) ? 'the Can and Cannot lists of every permission summary' : 'every permission summary'; },
      every: 'every permission summary',
      html: function (variant, size, state, extraCls, ui) {
        var compact = variant === 'compact', manage = ui && ui.content === 'manage';
        var head = '<div class="plx-permission-summary__head"><span class="plx-permission-summary__icon" aria-hidden="true">' + icon('settings-users') + '</span>'
          + '<span class="plx-permission-summary__access"><span class="plx-permission-summary__level">Your team can edit</span><span class="plx-permission-summary__detail">From the Marketing folder · 12 people</span></span>'
          + (manage ? btn({ variant: 'ghost', size: 'sm', cls: 'plx-permission-summary__manage', text: 'Manage access' }) : '') + '</div>';
        var body = compact ? '<ul class="plx-list plx-permission-summary__list">' + li(true, 'Can view, comment, and edit details') + li(false, 'Cannot share or delete') + '</ul>'
          : '<div class="plx-permission-summary__lists"><div class="plx-permission-summary__section"><p class="plx-permission-summary__heading">Can</p><ul class="plx-list plx-permission-summary__list">' + li(true, 'View') + li(true, 'Comment') + li(true, 'Edit details') + '</ul></div>'
            + '<div class="plx-permission-summary__section"><p class="plx-permission-summary__heading">Cannot</p><ul class="plx-list plx-permission-summary__list">' + li(false, 'Share') + li(false, 'Delete') + '</ul></div></div>';
        return '<div class="plx-permission-summary' + (compact ? ' plx-permission-summary--compact' : '') + ex(extraCls) + '">' + head + body + '</div>';
      },
      labelSelector: '.plx-permission-summary__level',
      parts: { g: 'A', hg: 'B', ib: 'B', ic: 'B', lt: 'C', lfs: 'C', lfw: 'C', llh: 'C', dt: 'D', dfs: 'D', lg: 'E', sg: 'E', ht: 'F', hfs: 'F', hfw: 'F' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-permission-summary__icon', side: 'left' }, C: { part: '.plx-permission-summary__level', side: 'top' }, D: { part: '.plx-permission-summary__detail', side: 'right' }, E: { part: '.plx-permission-summary__lists', side: 'bottom' }, F: { part: '.plx-permission-summary__heading', side: 'right' } },
      sections: [['Access line', ['g', 'hg', 'ib', 'ic', 'lt', 'lfs', 'lfw', 'llh', 'dt', 'dfs']], ['Can and Cannot', ['lg', 'sg', 'ht', 'hfs', 'hfw']]],
      matrixLabel: 'Permission summary by form', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Forms · ' + HEAD
    });

    // ---- QueryBuilder (<QueryBuilder>): the switch bar, a group, its rules, a nested group and the text view
    var QB = function (n) { return 'plx-comp-query-builder-' + n; };
    var sel = function (cls, label, text) { return '<span class="plx-select ' + cls + '"><select class="plx-input plx-select__control" tabindex="-1" aria-label="' + label + '"><option>' + text + '</option></select><span class="plx-select__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></span>'; };
    var seg = function (label, opts, on) {
      return '<div role="radiogroup" aria-label="' + label + '" class="plx-segmented plx-segmented--sm">' + opts.map(function (o) { return '<button type="button" role="radio" tabindex="-1" aria-checked="' + (o === on) + '" class="plx-segmented__item' + (o === on ? ' is-selected' : '') + '"><span>' + o + '</span></button>'; }).join('') + '</div>';
    };
    var rule = function (n, join, field, op, value) {
      return '<li class="plx-query-builder__item"><span class="plx-query-builder__join" aria-hidden="true">' + join + '</span><div class="plx-query-builder__rule" role="group" aria-label="Rule ' + n + '">'
        + sel('plx-query-builder__field', 'Rule ' + n + ', Field', field) + sel('plx-query-builder__operator', 'Rule ' + n + ', Operator', op)
        + '<input class="plx-input plx-query-builder__value" tabindex="-1" aria-label="Rule ' + n + ', Value" value="' + value + '">'
        + btn({ variant: 'ghost', size: 'sm', only: true, icon: 'trash', label: 'Rule ' + n + ': Remove rule', cls: 'plx-query-builder__remove' }) + '</div></li>';
    };
    var adds = function (key, group) { return '<div class="plx-query-builder__add" data-plx-add="' + key + '">' + btn({ variant: 'ghost', size: 'sm', icon: 'plus', text: 'Add rule' }) + (group ? btn({ variant: 'ghost', size: 'sm', icon: 'plus', text: 'Add group' }) : '') + '</div>'; };
    var groupHtml = function (depth, join, items, n) {
      return '<div class="plx-query-builder__group" data-plx-depth="' + depth + '"' + (depth ? ' role="group" aria-label="Group ' + n + '"' : '') + '><div class="plx-query-builder__group-head">' + seg('Match', ['And', 'Or'], join)
        + '<span class="plx-query-builder__hint">' + (join === 'Or' ? 'Any rule' : 'All rules') + '</span>' + (depth ? btn({ variant: 'ghost', size: 'sm', only: true, icon: 'trash', label: 'Group ' + n + ': Remove group', cls: 'plx-query-builder__remove' }) : '') + '</div>'
        + (items ? '<ul class="plx-query-builder__items">' + items + '</ul>' : '<p class="plx-query-builder__empty">No rules: every record matches.</p>') + adds(depth ? 'g' + n : 'root', depth < 2) + '</div>';
    };
    DS.registerLab('query-builder', {
      name: 'Query builder', title: 'Plenix query builder', file: 'platform/patterns/QueryBuilder/query-builder.css', compPrefix: /^plx-comp-query-builder-/,
      store: 'plenix-query-builder-lab-tokens', sizes: [['default', 'Default', '.plx-query-builder']],
      variants: [['rule', 'Rule'], ['group', 'Group (and / or)'], ['nested', 'Nested groups'], ['text', 'Text view']],
      states: [['default', 'Default']],
      content: [['rules', 'With rules'], ['empty', 'No rules']],
      labels: { size: 'Size', variant: 'Structure', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'group', state: 'default', content: 'rules' },
      props: [
        { id: 'g', label: 'Gap (switch bar to query)', css: ['row-gap'], cat: 'space' },
        { id: 'bg', label: 'Gap (switch to count)', css: ['column-gap'], part: '.plx-query-builder__bar', cat: 'space' },
        { id: 'mt', label: 'Match count color', css: ['color'], part: '.plx-query-builder__matches', cat: 'color' },
        { id: 'mfs', label: 'Match count size', css: ['font-size'], part: '.plx-query-builder__matches', cat: 'font-size' },
        { id: 'nf', label: 'Match count number font', css: ['font-family'], part: '.plx-query-builder__number', cat: 'font' },
        { id: 'gg', label: 'Gap (group parts)', css: ['row-gap'], part: '.plx-query-builder__group', cat: 'space' },
        { id: 'rc', label: 'Nested group rail color', css: ['border-left-color'], part: '.plx-query-builder__group[data-plx-depth="1"]', cat: 'color' },
        { id: 'rw', label: 'Nested group rail width', css: ['border-left-width'], part: '.plx-query-builder__group[data-plx-depth="1"]', cat: 'border-width' },
        { id: 'rp', label: 'Nested group rail padding', css: ['padding-left'], part: '.plx-query-builder__group[data-plx-depth="1"]', cat: 'space' },
        { id: 'hg', label: 'Gap (group head)', css: ['column-gap'], part: '.plx-query-builder__group-head', cat: 'space' },
        { id: 'ht', label: 'Join words color', css: ['color'], part: '.plx-query-builder__hint', cat: 'color' },
        { id: 'hfs', label: 'Join words size', css: ['font-size'], part: '.plx-query-builder__hint', cat: 'font-size' },
        { id: 'ig', label: 'Gap between rules', css: ['row-gap'], part: '.plx-query-builder__items', cat: 'space' },
        { id: 'itg', label: 'Gap (join word to rule)', css: ['column-gap'], part: '.plx-query-builder__item', cat: 'space' },
        { id: 'jt', label: 'Join word color', css: ['color'], part: '.plx-query-builder__join', cat: 'color' },
        { id: 'jfs', label: 'Join word size', css: ['font-size'], part: '.plx-query-builder__join', cat: 'font-size' },
        { id: 'jw', label: 'Join column width', css: ['inline-size'], show: 'width', part: '.plx-query-builder__join', cat: 'size' },
        { id: 'jh', label: 'Join word height', css: ['min-block-size'], show: 'min-height', part: '.plx-query-builder__join', cat: 'control-height' },
        { id: 'rg', label: 'Gap (rule controls)', css: ['column-gap'], part: '.plx-query-builder__rule', cat: 'space' },
        { id: 'fw', label: 'Field width', css: ['inline-size'], show: 'width', part: '.plx-query-builder__field', cat: 'size' },
        { id: 'ow', label: 'Operator width', css: ['inline-size'], show: 'width', part: '.plx-query-builder__operator', cat: 'size' },
        { id: 'vw', label: 'Value minimum width', css: ['min-inline-size'], show: 'min-width', part: '.plx-query-builder__value', cat: 'size' },
        { id: 'et', label: 'Empty text color', css: ['color'], part: '.plx-query-builder__empty', cat: 'color' },
        { id: 'efs', label: 'Empty text size', css: ['font-size'], part: '.plx-query-builder__empty', cat: 'font-size' },
        { id: 'ag', label: 'Gap (add buttons)', css: ['column-gap'], part: '.plx-query-builder__add', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var text = variant === 'text', rules = content !== 'empty', nested = variant === 'nested' && rules;
        if (text && !/^(g|bg|mt|mfs|nf)$/.test(id)) return null;
        switch (id) {
          case 'g': return QB('gap');
          case 'bg': return QB('bar-gap');
          case 'mt': return QB('matches-text');
          case 'mfs': return QB('matches-font-size');
          case 'nf': return QB('number-font-family');
          case 'gg': return QB('group-gap');
          case 'rc': return nested ? QB('rail-color') : null;
          case 'rw': return nested ? QB('rail-width') : null;
          case 'rp': return nested ? QB('rail-padding') : null;
          case 'hg': return QB('head-gap');
          case 'ht': return QB('hint-text');
          case 'hfs': return QB('hint-font-size');
          case 'ig': return rules ? QB('items-gap') : null;
          case 'itg': return rules ? QB('item-gap') : null;
          case 'jt': return rules ? QB('join-text') : null;
          case 'jfs': return rules ? QB('join-font-size') : null;
          case 'jw': return rules ? QB('join-width') : null;
          case 'jh': return rules ? QB('join-height') : null;
          case 'rg': return rules ? QB('rule-gap') : null;
          case 'fw': return rules ? QB('field-width') : null;
          case 'ow': return rules ? QB('operator-width') : null;
          case 'vw': return rules ? QB('value-min-width') : null;
          case 'et': return rules ? null : QB('empty-text');
          case 'efs': return rules ? null : QB('empty-font-size');
          case 'ag': return QB('add-gap');
          default: return null;
        }
      },
      reach: function (full) { return /-(rail)-/.test(full) ? 'the nested groups of every query builder' : /-(join|rule|field|operator|value|item)-/.test(full) ? 'the rules of every query builder' : 'every query builder'; },
      every: 'every query builder',
      html: function (variant, size, state, extraCls, ui) {
        var rules = !(ui && ui.content === 'empty');
        var bar = '<div class="plx-query-builder__bar">' + seg('View', ['Builder', 'Text'], variant === 'text' ? 'Text' : 'Builder') + '<span class="plx-query-builder__matches" aria-live="polite"><span class="plx-query-builder__number">' + (rules ? '42' : '240') + '</span> matches</span></div>';
        var body;
        if (variant === 'text') {
          body = '<div class="plx-code-block plx-code-block--none plx-query-builder__text"><div class="plx-code-block__head"><span class="plx-code-block__title">Query</span></div><pre class="plx-code-block__pre" tabindex="-1" aria-label="Query"><code data-plx-language="text">' + (rules ? 'Type is any of “Image” and (Size (MB) &gt; 40 or Modified is within the past month)' : 'Every record') + '</code></pre></div>';
        } else if (!rules) body = groupHtml(0, 'And', '', 0);
        else if (variant === 'rule') body = groupHtml(0, 'And', rule(1, 'Where', 'Type', 'contains', 'Image'), 0);
        else if (variant === 'group') body = groupHtml(0, 'Or', rule(1, 'Where', 'Tags', 'contains', 'Easter') + rule(2, 'or', 'Name', 'contains', 'banner'), 0);
        else body = groupHtml(0, 'And', rule(1, 'Where', 'Type', 'is', 'Image') + '<li class="plx-query-builder__item plx-query-builder__item--group"><span class="plx-query-builder__join" aria-hidden="true">and</span>'
          + groupHtml(1, 'Or', rule(1, 'Where', 'Size (MB)', '>', '40') + rule(2, 'or', 'Modified', 'is within', 'the past month'), 1) + '</li>', 0);
        return '<div class="plx-query-builder' + ex(extraCls) + '" role="group" aria-label="Asset search">' + bar + body + '</div>';
      },
      labelSelector: '.plx-query-builder__join',
      parts: { g: 'A', bg: 'A', mt: 'A', mfs: 'A', nf: 'A', gg: 'B', hg: 'B', ht: 'B', hfs: 'B', ag: 'B', et: 'B', efs: 'B', rc: 'C', rw: 'C', rp: 'C', ig: 'D', itg: 'D', jt: 'D', jfs: 'D', jw: 'D', jh: 'D', rg: 'E', fw: 'E', ow: 'E', vw: 'E' },
      anchors: { A: { part: '.plx-query-builder__bar', side: 'top' }, B: { part: '.plx-query-builder__group-head', side: 'left' }, C: { part: '.plx-query-builder__group[data-plx-depth="1"]', side: 'left' }, D: { part: '.plx-query-builder__join', side: 'left' }, E: { part: '.plx-query-builder__rule', side: 'right' } },
      sections: [['Switch bar', ['g', 'bg', 'mt', 'mfs', 'nf']], ['Group', ['gg', 'hg', 'ht', 'hfs', 'ag', 'et', 'efs']], ['Nested group', ['rc', 'rw', 'rp']], ['Rules', ['ig', 'itg', 'jt', 'jfs', 'jw', 'jh', 'rg', 'fw', 'ow', 'vw']]],
      matrixLabel: 'Query builder by structure', matrixColumnWidth: '--plx-ref-size-720px', statesHead: 'Structures · ' + HEAD
    });
  })();
}
