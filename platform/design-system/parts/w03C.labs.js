/* Plenix design system · library part w03C: the labs of Image, Figure, the Masonry layout (ContentGrid's masonry and
   justified rows) and Collapse (Columns' collapse below a window class and sidebar ratios). The content grid's lab and
   Columns' lab (layout-labs.js) are registered again with the new layouts and variants added. Each value with the one
   token behind it: the components' own token files (platform/tokens/components/image, figure, content-grid, columns). */
if (window.DS && DS.registerLab) {
  (function () {
    var CORNERS = ['border-start-start-radius', 'border-start-end-radius', 'border-end-start-radius', 'border-end-end-radius'];
    var STATIC = [['default', 'Default']];
    var ONE = [['default', 'Default']];
    var ex = function (c) { return c ? ' ' + c : ''; };
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
    var IMG = function (n, alt, attrs) { return '<img class="plx-image__img" src="' + ART(n) + '" alt="' + alt + '"' + (attrs || '') + '>'; };

    // ---- Image (<Image>, span.plx-image): fit, placeholder, shape, responsive sources, lazy loading and the fallback
    var IM = function (n) { return 'plx-comp-image-' + n; };
    var FALLBACK = '<span class="plx-image__fallback" role="img" aria-label="The finished kitchen">' + DS.icon('image-a-2', 'plx-image__fallback-icon') + '<span class="plx-image__fallback-text">Image not available</span></span>';
    var imageHtml = function (variant, extraCls) {
      var fit = variant === 'contain' ? 'contain' : 'cover';
      var ph = /^placeholder-/.test(variant) ? variant : 'placeholder-color';
      var status = /^placeholder-/.test(variant) ? 'is-loading' : variant === 'error' ? 'is-error' : 'is-loaded';
      var inner = variant === 'error' ? FALLBACK
        : (variant === 'placeholder-blur' ? '<img class="plx-image__placeholder" src="' + ART('12') + '" alt="" aria-hidden="true">' : '')
          + IMG(variant === 'contain' ? '21' : '12', 'Asset 12', variant === 'responsive' ? ' srcset="' + ART('12') + ' 200w, ' + ART('16') + ' 400w" sizes="240px"' : ' loading="lazy" decoding="async"');
      return '<div class="ds-w03c-frame"><span class="plx-image plx-image--' + fit + ' plx-image--' + ph + (variant === 'rounded' ? ' plx-image--rounded' : '') + ' plx-ratio-4-3 ' + status + ex(extraCls) + '">' + inner + '</span></div>';
    };
    DS.registerLab('image', {
      name: 'Image', title: 'Plenix image', file: 'platform/components/Image/image.css', compPrefix: /^plx-comp-image-/,
      store: 'plenix-image-lab-tokens', sizes: [['default', 'Default (4:3 frame)', '.plx-image']],
      variants: [['cover', 'Cover (default)'], ['contain', 'Contain'], ['placeholder-color', 'Placeholder: color (default)'], ['placeholder-blur', 'Placeholder: blur'], ['placeholder-none', 'Placeholder: none'],
        ['rounded', 'Rounded'], ['responsive', 'Responsive (srcSet, sizes)'], ['lazy', 'Lazy (default)'], ['error', 'Error fallback']],
      states: STATIC, content: [['picture', 'A picture']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'cover', state: 'default', content: 'picture' },
      props: [
        { id: 'bg', label: 'Frame fill (loading, contain)', css: ['background-color'], cat: 'color' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
        { id: 'mh', label: 'Minimum height (failed, no ratio)', css: ['min-block-size'], show: 'min-height', cat: 'size' },
        { id: 'fbg', label: 'Fallback fill', css: ['background-color'], part: '.plx-image__fallback', cat: 'color' },
        { id: 'ffg', label: 'Fallback icon and text color', css: ['color'], part: '.plx-image__fallback', cat: 'color' },
        { id: 'fff', label: 'Fallback font family', css: ['font-family'], part: '.plx-image__fallback', cat: 'font' },
        { id: 'ffs', label: 'Fallback font size', css: ['font-size'], part: '.plx-image__fallback', cat: 'font-size' },
        { id: 'flh', label: 'Fallback line height', css: ['line-height'], part: '.plx-image__fallback', cat: 'line-height' },
        { id: 'fgap', label: 'Gap (icon to text)', css: ['row-gap'], part: '.plx-image__fallback', cat: 'space' },
        { id: 'fpad', label: 'Fallback padding', css: ['padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end'], show: 'padding-left', part: '.plx-image__fallback', cat: 'space' },
        { id: 'fis', label: 'Fallback icon size', css: ['inline-size'], show: 'width', part: '.plx-image__fallback-icon', cat: 'icon' }
      ],
      token: function (id, size, variant) {
        var err = variant === 'error';
        switch (id) {
          case 'bg': return variant === 'contain' ? IM('contain-background') : variant === 'placeholder-color' || variant === 'placeholder-blur' ? IM('placeholder-background') : null;
          case 'rad': return variant === 'rounded' ? IM('radius') : null;
          case 'mh': return err ? IM('fallback-min-height') : null;
          case 'fbg': return err ? IM('fallback-background') : null;
          case 'ffg': return err ? IM('fallback-text') : null;
          case 'fff': return err ? IM('fallback-font-family') : null;
          case 'ffs': return err ? IM('fallback-font-size') : null;
          case 'flh': return err ? IM('fallback-line-height') : null;
          case 'fgap': return err ? IM('fallback-gap') : null;
          case 'fpad': return err ? IM('fallback-padding') : null;
          case 'fis': return err ? IM('fallback-icon-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /fallback/.test(full) ? 'every image that fails to load' : /placeholder/.test(full) ? 'every image while it loads' : /contain/.test(full) ? 'every contained image' : /radius/.test(full) ? 'every rounded image' : 'every image'; },
      every: 'every image',
      html: function (variant, size, state, extraCls) { return imageHtml(variant, extraCls); },
      labelSelector: null,
      parts: { bg: 'A', rad: 'A', mh: 'A', fbg: 'B', ffg: 'B', fff: 'B', ffs: 'B', flh: 'B', fgap: 'B', fpad: 'B', fis: 'C' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-image__fallback', side: 'bottom' }, C: { part: '.plx-image__fallback-icon', side: 'right' } },
      sections: [['Frame', ['bg', 'rad', 'mh']], ['Fallback', ['fbg', 'ffg', 'fff', 'ffs', 'flh', 'fgap', 'fpad', 'fis']]],
      matrixLabel: 'Image values by variant',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Figure (<Figure>, figure.plx-figure): the caption below or on the media band, and the credit
    var FG = function (n) { return 'plx-comp-figure-' + n; };
    DS.registerLab('figure', {
      name: 'Figure', title: 'Plenix figure', file: 'platform/components/Figure/figure.css', compPrefix: /^plx-comp-figure-/,
      store: 'plenix-figure-lab-tokens', sizes: [['default', 'Default', '.plx-figure']],
      variants: [['below', 'Below (default)'], ['overlay', 'Overlay'], ['credited', 'With credit']],
      states: STATIC, content: [['photo', 'A photo with a caption']],
      labels: { size: 'Size', variant: 'Caption', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'below', state: 'default', content: 'photo' },
      props: [
        { id: 'gap', label: 'Gap (media to caption)', css: ['row-gap'], cat: 'space' },
        { id: 'cfg', label: 'Caption color', css: ['color'], part: '.plx-figure__caption', cat: 'color' },
        { id: 'cff', label: 'Caption font family', css: ['font-family'], part: '.plx-figure__caption', cat: 'font' },
        { id: 'cfs', label: 'Caption font size', css: ['font-size'], part: '.plx-figure__caption', cat: 'font-size' },
        { id: 'clh', label: 'Caption line height', css: ['line-height'], part: '.plx-figure__caption', cat: 'line-height' },
        { id: 'cmw', label: 'Caption maximum width', css: ['max-inline-size'], show: 'max-width', part: '.plx-figure__caption', cat: 'size' },
        { id: 'cgap', label: 'Gap (caption to credit)', css: ['row-gap'], part: '.plx-figure__caption', cat: 'space' },
        { id: 'obg', label: 'Band fill (overlay)', css: ['background-color'], part: '.plx-figure__caption--overlay', cat: 'color' },
        { id: 'opy', label: 'Band padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-figure__caption--overlay', cat: 'space' },
        { id: 'opx', label: 'Band padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-figure__caption--overlay', cat: 'space' },
        { id: 'crfg', label: 'Credit color', css: ['color'], part: '.plx-figure__credit', cat: 'color' },
        { id: 'crfs', label: 'Credit font size', css: ['font-size'], part: '.plx-figure__credit', cat: 'font-size' }
      ],
      token: function (id, size, variant) {
        var over = variant === 'overlay', cred = variant === 'credited';
        switch (id) {
          case 'gap': return FG('gap');
          case 'cfg': return FG(over ? 'overlay-text' : 'caption-text');
          case 'cff': return FG('caption-font-family');
          case 'cfs': return FG('caption-font-size');
          case 'clh': return FG('caption-line-height');
          case 'cmw': return over ? null : FG('caption-max-width');
          case 'cgap': return FG('caption-gap');
          case 'obg': return over ? FG('overlay-background') : null;
          case 'opy': return over ? FG('overlay-padding-block') : null;
          case 'opx': return over ? FG('overlay-padding-inline') : null;
          case 'crfg': return cred ? FG('credit-text') : null;
          case 'crfs': return cred ? FG('credit-font-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /overlay/.test(full) ? 'every overlay caption' : /credit/.test(full) ? 'every credit line' : 'every figure'; },
      every: 'every figure',
      html: function (variant, size, state, extraCls) {
        var media = '<span class="plx-image plx-image--cover plx-image--placeholder-color plx-ratio-4-3 is-loaded">' + IMG('12', 'The finished kitchen') + '</span>';
        if (variant === 'overlay') return '<div class="ds-w03c-frame ds-w03c-frame--wide"><figure class="plx-figure plx-figure--overlay' + ex(extraCls) + '"><div class="plx-figure__media">' + media + '<figcaption class="plx-figure__caption plx-figure__caption--overlay">Lisbon office, east wing</figcaption></div></figure></div>';
        return '<div class="ds-w03c-frame ds-w03c-frame--wide"><figure class="plx-figure plx-figure--below' + (variant === 'credited' ? ' plx-figure--credited' : '') + ex(extraCls) + '"><div class="plx-figure__media">' + media + '</div>'
          + '<figcaption class="plx-figure__caption"><span class="plx-figure__text">The kitchen after the remodel, with the oak finish the client chose.</span>' + (variant === 'credited' ? '<span class="plx-figure__credit">Photo: Ana Ruiz</span>' : '') + '</figcaption></figure></div>';
      },
      labelSelector: null,
      parts: { gap: 'A', cfg: 'B', cff: 'B', cfs: 'B', clh: 'B', cmw: 'B', cgap: 'B', obg: 'C', opy: 'C', opx: 'C', crfg: 'D', crfs: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-figure__caption', side: 'bottom' }, C: { part: '.plx-figure__caption--overlay', side: 'top' }, D: { part: '.plx-figure__credit', side: 'right' } },
      sections: [['Layout', ['gap']], ['Caption', ['cfg', 'cff', 'cfs', 'clh', 'cmw', 'cgap']], ['Overlay band', ['obg', 'opy', 'opx']], ['Credit', ['crfg', 'crfs']]],
      matrixLabel: 'Figure values by caption',
      statesHead: 'Captions · ' + HEAD
    });

    // ---- Masonry layout (<ContentGrid layout="masonry" | "justified">): pictures of mixed ratios
    var CG = function (n) { return 'plx-comp-content-grid-' + n; };
    var MIXED = [['10', '3-4'], ['21', '1-1'], ['12', '4-3'], ['14', '16-9'], ['23', '3-4'], ['16', '4-3']];
    var gridHtml = function (layout, size, extraCls) {
      return '<ul aria-label="Photos" class="plx-content-grid plx-content-grid--' + size + ' plx-content-grid--' + layout + ' ds-layout-frame--lg' + ex(extraCls) + '">'
        + MIXED.map(function (x) {
          return '<li class="plx-content-grid__item"' + (layout === 'justified' ? ' data-plx-ratio="' + x[1] + '"' : '') + '><span class="plx-image plx-image--cover plx-image--placeholder-color plx-ratio-' + x[1] + ' is-loaded">' + IMG(x[0], 'Asset ' + x[0]) + '</span></li>';
        }).join('') + '</ul>';
    };
    var GRID_PROPS = [
      { id: 'gap', label: 'Gap between columns', css: ['column-gap'], cat: 'space' },
      { id: 'mgap', label: 'Gap under each item (masonry)', css: ['margin-block-end'], show: 'margin-bottom', part: ':scope > :first-child', cat: 'space' },
      { id: 'jgap', label: 'Gap between rows (justified)', css: ['row-gap'], cat: 'space' }
    ];
    var gridToken = function (id, layout) {
      if (id === 'gap') return CG('gap');
      if (id === 'mgap') return layout === 'masonry' ? CG('masonry-row-gap') : null;
      if (id === 'jgap') return layout === 'justified' ? CG('row-gap') : null;
      return null;
    };
    DS.registerLab('masonry-layout', {
      name: 'Masonry layout', title: 'Plenix masonry layout', file: 'platform/patterns/ContentGrid/content-grid.css', compPrefix: /^plx-comp-content-grid-/,
      store: 'plenix-masonry-layout-lab-tokens', sizes: [['sm', 'SM (140px)', '.plx-content-grid--sm'], ['md', 'MD (default, 180px)', '.plx-content-grid--md']],
      variants: [['masonry', 'Masonry'], ['justified', 'Justified rows']],
      states: STATIC, content: [['pictures', 'Six pictures of mixed ratios']],
      labels: { size: 'Card size', variant: 'Layout', state: 'State', content: 'Content' },
      defaults: { size: 'sm', variant: 'masonry', state: 'default', content: 'pictures' },
      props: GRID_PROPS,
      token: function (id, size, variant) { return gridToken(id, variant); },
      reach: function (full) { return /masonry/.test(full) ? 'every masonry grid' : 'every content grid'; },
      every: 'every content grid',
      html: function (variant, size, state, extraCls) { return gridHtml(variant, size, extraCls); },
      labelSelector: null,
      parts: { gap: 'A', mgap: 'B', jgap: 'A' },
      anchors: { A: { part: null, side: 'bottom' }, B: { part: ':scope > :first-child', side: 'left' } },
      sections: [['Spacing', ['gap', 'mgap', 'jgap']]],
      matrixLabel: 'Masonry values by layout', matrixColumnWidth: '--plx-ref-size-600px',
      statesHead: 'Layouts · ' + HEAD
    });

    // the content grid's lab (layout-labs.js) again, with the two layouts as content
    if (DS.labs['responsive-grid']) {
      var RG = DS.labs['responsive-grid'];
      DS.registerLab('responsive-grid', Object.assign({}, RG, {
        content: RG.content.concat([['masonry', 'Masonry'], ['justified', 'Justified rows']]),
        props: RG.props.concat(GRID_PROPS.filter(function (p) { return p.id !== 'gap'; })),
        token: function (id, size, variant, state, content) {
          if (content === 'masonry' || content === 'justified') return id === 'rgap' ? null : gridToken(id, content);
          return id === 'mgap' || id === 'jgap' ? null : RG.token(id, size, variant, state, content);
        },
        html: function (variant, size, state, extraCls, ui) {
          var c = ui && ui.content;
          return c === 'masonry' || c === 'justified' ? gridHtml(c, variant, extraCls) : RG.html(variant, size, state, extraCls, ui);
        },
        parts: Object.assign({}, RG.parts, { mgap: 'B', jgap: 'A' }),
        anchors: Object.assign({}, RG.anchors, { B: { part: ':scope > :first-child', side: 'left' } }),
        sections: [['Spacing', ['gap', 'rgap', 'mgap', 'jgap']]]
      }));
    }

    // ---- Collapse (<Columns collapseBelow ratio>): one column below a window class, and the sidebar ratios
    var CO = function (n) { return 'plx-comp-columns-' + n; };
    var NEW_COLUMNS = [['collapse-below-medium', 'Below Medium'], ['collapse-below-wide', 'Below Wide'], ['sidebar-start', 'Sidebar at the start'], ['sidebar-end', 'Sidebar at the end']];
    var BOX = function (text) { return '<div class="ds-layout-fill ds-layout-box">' + text + '</div>'; };
    var columnsHtml = function (variant, size, extraCls, divided) {
      var sidebar = /^sidebar-/.test(variant), n = sidebar ? 2 : +size || 2;
      var names = sidebar ? (variant === 'sidebar-end' ? ['Results', 'Filters'] : ['Filters', 'Results']) : ['First', 'Second', 'Third'].slice(0, n);
      var cols = '<div class="plx-columns plx-columns--' + n + ' ' + (divided ? 'plx-columns--divided' : 'plx-columns--gap-md') + ' plx-columns--' + variant + ex(extraCls) + '">'
        + names.map(function (t) { return divided ? '<div class="ds-layout-cell">' + t + '</div>' : BOX(t); }).join('') + '</div>';
      // a collapse is drawn in a Narrow window: a frame that answers the main region's container queries
      return sidebar ? '<div class="ds-layout-frame--lg">' + cols + '</div>' : '<div class="ds-w03c-window ds-w03c-window--narrow">' + cols + '</div>';
    };
    var COLUMN_PROPS = [
      { id: 'crg', label: 'Gap between stacked columns', css: ['row-gap'], cat: 'space' },
      { id: 'cdc', label: 'Line above a stacked column (color)', css: ['border-block-start-color'], show: 'border-top-color', part: ':scope > :nth-child(2)', cat: 'color' },
      { id: 'cdw', label: 'Line above a stacked column (width)', css: ['border-block-start-width'], show: 'border-top-width', part: ':scope > :nth-child(2)', cat: 'border-width' },
      { id: 'cols', label: 'Column widths (sidebar)', css: ['grid-template-columns'], cat: 'columns' }
    ];
    var columnToken = function (id, variant, divided) {
      var collapse = /^collapse-/.test(variant);
      if (id === 'crg') return collapse && !divided ? CO('collapse-row-gap') : null;
      if (id === 'cdc') return collapse && divided ? CO('collapse-divider-color') : null;
      if (id === 'cdw') return collapse && divided ? CO('collapse-divider-width') : null;
      if (id === 'cols') return /^sidebar-/.test(variant) ? CO(variant + '-columns') : null;
      return null;
    };
    DS.registerLab('collapse', {
      name: 'Collapse', title: 'Plenix columns collapse', file: 'platform/components/Columns/columns.css', compPrefix: /^plx-comp-columns-/,
      store: 'plenix-collapse-lab-tokens', sizes: [['2', '2 columns', '.plx-columns--2'], ['3', '3 columns', '.plx-columns--3']],
      variants: NEW_COLUMNS, states: STATIC, content: [['blocks', 'A block in each column'], ['divided', 'Divided columns']],
      labels: { size: 'Count', variant: 'Collapse and ratio', state: 'State', content: 'Content' },
      defaults: { size: '3', variant: 'collapse-below-wide', state: 'default', content: 'blocks' },
      props: COLUMN_PROPS,
      token: function (id, size, variant, state, content) { return columnToken(id, variant, content === 'divided'); },
      reach: function (full) { return /sidebar/.test(full) ? 'every pair of columns with a sidebar' : 'every row of columns that collapses'; },
      every: 'every row of columns that collapses',
      html: function (variant, size, state, extraCls, ui) { return columnsHtml(variant, size, extraCls, ui && ui.content === 'divided'); },
      labelSelector: null,
      parts: { crg: 'A', cdc: 'B', cdw: 'B', cols: 'A' },
      anchors: { A: { part: null, side: 'left' }, B: { part: ':scope > :nth-child(2)', side: 'top' } },
      sections: [['Collapsed', ['crg', 'cdc', 'cdw']], ['Ratio', ['cols']]],
      matrixLabel: 'Collapse values by variant',
      statesHead: 'Collapse and ratio · ' + HEAD
    });

    // Columns' lab (layout-labs.js) again, with the collapse and sidebar variants
    if (DS.labs.columns) {
      var CL = DS.labs.columns;
      var mine = function (v) { return NEW_COLUMNS.some(function (x) { return x[0] === v; }); };
      DS.registerLab('columns', Object.assign({}, CL, {
        variants: CL.variants.concat(NEW_COLUMNS.map(function (x) { return [x[0], /^collapse/.test(x[0]) ? 'Collapse ' + x[1].toLowerCase() : x[1]]; })),
        props: CL.props.concat(COLUMN_PROPS),
        token: function (id, size, variant, state, content) { return mine(variant) ? columnToken(id, variant, false) : CL.token(id, size, variant, state, content); },
        html: function (variant, size, state, extraCls, ui) { return mine(variant) ? columnsHtml(variant, size, extraCls, false) : CL.html(variant, size, state, extraCls, ui); },
        parts: Object.assign({}, CL.parts, { crg: 'D', cdc: 'C', cdw: 'C', cols: 'D' }),
        anchors: Object.assign({}, CL.anchors, { D: { part: null, side: 'left' } }),
        sections: CL.sections.concat([['Collapsed and ratio', ['crg', 'cdc', 'cdw', 'cols']]])
      }));
    }
  })();
}
