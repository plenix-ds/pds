/* Plenix design system · library part w02A: the labs of Link, inline Code, Blockquote, RichText and the ordered List. The
   List's lab (content-labs.js) is registered again with the ordered variants added (numbered, lettered, nested, steps),
   and the Ordered list page has a lab of its own with only those. Each value with the one token behind it: the
   components' own token files (platform/tokens/components/link, code, blockquote, list, rich-text). */
if (window.DS && DS.registerLab) {
  (function () {
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var STATIC = [['default', 'Default']];
    var ex = function (c) { return c ? ' ' + c : ''; };

    // ---- Link (<Link>, a.plx-link): seven looks, at rest, hovered and focused
    var LK = function (n) { return 'plx-comp-link-' + n; };
    var ICON = function (name) { return DS.icon(name, 'plx-link__icon'); };
    var STANDALONE = { standalone: 1, back: 1 };
    DS.registerLab('link', {
      name: 'Link', title: 'Plenix link', file: 'platform/components/Link/link.css', compPrefix: /^plx-comp-link-/,
      store: 'plenix-link-lab-tokens', sizes: [['default', 'Default', '.plx-link']],
      variants: [['inline', 'Inline (default)'], ['standalone', 'Standalone'], ['subtle', 'Subtle'], ['on-accent', 'On accent'], ['external', 'External'], ['back', 'Back'], ['visited', 'Visited']],
      states: [['default', 'Rest'], ['hover', 'Hover'], ['focus', 'Focus (keyboard)']],
      content: [['text', 'Link text']],
      labels: { size: 'Size', variant: 'Look', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'inline', state: 'default', content: 'text' },
      props: [
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
        { id: 'uw', label: 'Underline thickness', css: ['text-decoration-thickness'], cat: 'border-width' },
        { id: 'rad', label: 'Focus ring corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
        { id: 'oc', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
        { id: 'ow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
        { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space', extra: ['0'] },
        { id: 'mh', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
        { id: 'gap', label: 'Gap (text to icon)', css: ['column-gap'], cat: 'space', extra: ['0'] },
        { id: 'ig', label: 'Space before the icon', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-link__icon', cat: 'space', extra: ['0'] },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-link__icon', cat: 'icon' }
      ],
      token: function (id, size, variant, state) {
        var alone = STANDALONE[variant], focus = state === 'focus';
        switch (id) {
          case 'fg': return LK(variant === 'subtle' ? 'subtle-text' : variant === 'on-accent' ? 'on-accent-text' : variant === 'visited' ? 'visited-text' : 'text');
          case 'fw': return LK(alone ? 'standalone-font-weight' : 'font-weight');
          case 'uw': return LK(state === 'hover' ? 'hover-underline-width' : 'underline-width');
          case 'rad': return LK('radius');
          case 'oc': return focus ? LK(variant === 'on-accent' ? 'on-accent-focus-outline-color' : 'focus-outline-color') : null;
          case 'ow': return focus ? LK('focus-outline-width') : null;
          case 'oo': return focus ? LK('focus-outline-offset') : null;
          case 'mh': return alone ? LK('standalone-min-height') : null;
          case 'gap': return alone ? LK('standalone-gap') : null;
          case 'ig': return variant === 'external' ? LK('icon-gap') : null;
          case 'is': return variant === 'external' || variant === 'back' ? LK('icon-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /standalone/.test(full) ? 'every standalone and back link' : /on-accent/.test(full) ? 'every link on the accent' : /visited/.test(full) ? 'every visited inline link' : /subtle/.test(full) ? 'every subtle link' : 'every link'; },
      every: 'every link',
      html: function (variant, size, state, extraCls) {
        var kind = STANDALONE[variant] ? 'standalone' : variant === 'subtle' ? 'subtle' : 'inline';
        var cls = 'plx-link plx-link--' + kind + (variant === 'back' ? ' plx-link--back' : '') + (variant === 'external' ? ' plx-link--external' : '') + (variant === 'on-accent' ? ' plx-link--on-accent' : '')
          + (variant === 'visited' ? ' is-visited' : '') + (state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '') + ex(extraCls);
        var text = variant === 'back' ? 'Projects' : variant === 'standalone' ? 'View all projects' : variant === 'external' ? 'Material guidelines' : variant === 'on-accent' ? 'Help center' : variant === 'subtle' ? 'Terms' : 'upload guide';
        var a = '<a href="#lab-link" class="' + cls + '">' + (variant === 'back' ? ICON('chevron-left') : '') + text + (variant === 'external' ? ICON('open') + '<span class="plx-visually-hidden"> (opens in a new tab)</span>' : '') + '</a>';
        if (variant === 'on-accent') return '<span class="ds-sample-on-accent">' + a + '</span>';
        return STANDALONE[variant] ? a : '<span class="ds-w02a-line">Read the ' + a + ' first.</span>';
      },
      labelSelector: null,
      parts: { fg: 'A', fw: 'A', uw: 'A', rad: 'B', oc: 'B', ow: 'B', oo: 'B', mh: 'C', gap: 'C', ig: 'D', is: 'D' },
      anchors: { A: { part: null, side: 'bottom' }, B: { part: null, side: 'top' }, C: { part: null, side: 'right' }, D: { part: '.plx-link__icon', side: 'top' } },
      sections: [['Text', ['fg', 'fw', 'uw']], ['Focus ring', ['rad', 'oc', 'ow', 'oo']], ['Standalone', ['mh', 'gap']], ['Icon', ['ig', 'is']]],
      matrixLabel: 'Link values by look and state',
      statesHead: 'Looks and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- Inline code (<Code>, code.plx-code): on the page, on the accent, truncated
    var CD = function (n) { return 'plx-comp-code-' + n; };
    DS.registerLab('inline-code', {
      name: 'Inline code', title: 'Plenix inline code', file: 'platform/components/Code/code.css', compPrefix: /^plx-comp-code-/,
      store: 'plenix-inline-code-lab-tokens', sizes: [['default', 'Default (the text around it)', '.plx-code']],
      variants: [['default', 'Default'], ['on-accent', 'On accent'], ['truncate', 'Truncated']], states: STATIC,
      content: [['class', 'A class name']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Code' },
      defaults: { size: 'default', variant: 'default', state: 'default', content: 'class' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'ff', label: 'Font family', css: ['font-family'], cat: 'font' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
        { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] }
      ],
      token: function (id, size, variant) {
        var on = variant === 'on-accent' ? 'on-accent-' : '';
        switch (id) {
          case 'bg': return CD(on + 'background');
          case 'fg': return CD(on + 'text');
          case 'ff': return CD('font-family');
          case 'rad': return CD('radius');
          case 'px': return CD('padding-inline');
          default: return null;
        }
      },
      reach: function (full) { return /on-accent/.test(full) ? 'every inline code on the accent' : 'every inline code (and the inline code of rich text)'; },
      every: 'every inline code',
      html: function (variant, size, state, extraCls) {
        if (variant === 'truncate') return '<span class="ds-sample-list-frame ds-w02a-line"><code class="plx-code plx-code--truncate' + ex(extraCls) + '" title="platform/components/RichText/rich-text.css">platform/components/RichText/rich-text.css</code></span>';
        var code = '<code class="plx-code' + (variant === 'on-accent' ? ' plx-code--on-accent' : '') + ex(extraCls) + '">plx-link--standalone</code>';
        return variant === 'on-accent' ? '<span class="ds-sample-on-accent"><span class="ds-w02a-line">Add ' + code + '</span></span>' : '<span class="ds-w02a-line">Add ' + code + ' to the anchor.</span>';
      },
      labelSelector: null,
      parts: { bg: 'A', rad: 'A', px: 'B', fg: 'C', ff: 'C' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
      sections: [['Fill', ['bg', 'rad', 'px']], ['Text', ['fg', 'ff']]],
      matrixLabel: 'Inline code values by variant',
      statesHead: 'Variants · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- Blockquote (<Blockquote>, figure.plx-blockquote: the rule, the quote, the citation)
    var BQ = function (n) { return 'plx-comp-blockquote-' + n; };
    var QUOTE = '.plx-blockquote__quote', CITE = '.plx-blockquote__citation';
    DS.registerLab('blockquote', {
      name: 'Blockquote', title: 'Plenix blockquote', file: 'platform/components/Blockquote/blockquote.css', compPrefix: /^plx-comp-blockquote-/,
      store: 'plenix-blockquote-lab-tokens', sizes: [['default', 'Default', '.plx-blockquote']],
      variants: [['default', 'Default'], ['citation', 'With citation'], ['pull', 'Pull quote']], states: STATIC,
      content: [['short', 'A short quote']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Quote' },
      defaults: { size: 'default', variant: 'citation', state: 'default', content: 'short' },
      props: [
        { id: 'rc', label: 'Rule color', css: ['border-inline-start-color'], show: 'border-left-color', cat: 'color' },
        { id: 'rw', label: 'Rule width', css: ['border-inline-start-width'], show: 'border-left-width', cat: 'border-width' },
        { id: 'pad', label: 'Space after the rule', css: ['padding-inline-start'], show: 'padding-left', cat: 'space', extra: ['0'] },
        { id: 'gap', label: 'Gap (quote to citation)', css: ['row-gap'], cat: 'space', extra: ['0'] },
        { id: 'qfg', label: 'Quote color', css: ['color'], part: QUOTE, cat: 'color' },
        { id: 'qff', label: 'Quote font', css: ['font-family'], part: QUOTE, cat: 'font' },
        { id: 'qfs', label: 'Quote size', css: ['font-size'], part: QUOTE, cat: 'font-size' },
        { id: 'qfw', label: 'Quote weight', css: ['font-weight'], part: QUOTE, cat: 'font-weight' },
        { id: 'qlh', label: 'Quote line height', css: ['line-height'], part: QUOTE, cat: 'line-height' },
        { id: 'cfg', label: 'Citation color', css: ['color'], part: CITE, cat: 'color' },
        { id: 'cff', label: 'Citation font', css: ['font-family'], part: CITE, cat: 'font' },
        { id: 'cfs', label: 'Citation size', css: ['font-size'], part: CITE, cat: 'font-size' },
        { id: 'clh', label: 'Citation line height', css: ['line-height'], part: CITE, cat: 'line-height' }
      ],
      token: function (id, size, variant) {
        var pull = variant === 'pull', cited = variant !== 'default';
        switch (id) {
          case 'rc': return BQ(pull ? 'pull-rule-color' : 'rule-color');
          case 'rw': return BQ(pull ? 'pull-rule-width' : 'rule-width');
          case 'pad': return BQ('padding-inline-start');
          case 'gap': return BQ('gap');
          case 'qfg': return BQ('quote-text');
          case 'qff': return BQ(pull ? 'pull-quote-font-family' : 'quote-font-family');
          case 'qfs': return BQ(pull ? 'pull-quote-font-size' : 'quote-font-size');
          case 'qfw': return BQ(pull ? 'pull-quote-font-weight' : 'quote-font-weight');
          case 'qlh': return BQ(pull ? 'pull-quote-line-height' : 'quote-line-height');
          case 'cfg': return cited ? BQ('citation-text') : null;
          case 'cff': return cited ? BQ('citation-font-family') : null;
          case 'cfs': return cited ? BQ('citation-font-size') : null;
          case 'clh': return cited ? BQ('citation-line-height') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-pull-/.test(full) ? 'every pull quote' : 'every quote (and the quotes of rich text)'; },
      every: 'every quote',
      html: function (variant, size, state, extraCls) {
        var pull = variant === 'pull';
        return '<div class="ds-w02a-column"><figure class="plx-blockquote' + (pull ? ' plx-blockquote--pull' : '') + ex(extraCls) + '"><blockquote class="plx-blockquote__quote">'
          + (pull ? 'The archive is the product.' : 'Every room gets its own folder before the first upload.') + '</blockquote>'
          + (variant === 'default' ? '' : '<figcaption class="plx-blockquote__citation">Ana Ruiz, project lead</figcaption>') + '</figure></div>';
      },
      labelSelector: QUOTE,
      parts: { rc: 'A', rw: 'A', pad: 'B', gap: 'C', qfg: 'B', qff: 'B', qfs: 'B', qfw: 'B', qlh: 'B', cfg: 'C', cff: 'C', cfs: 'C', clh: 'C' },
      anchors: { A: { part: null, side: 'left' }, B: { part: QUOTE, side: 'top' }, C: { part: CITE, side: 'bottom' } },
      sections: [['Rule', ['rc', 'rw', 'pad', 'gap']], ['Quote', ['qfg', 'qff', 'qfs', 'qfw', 'qlh']], ['Citation', ['cfg', 'cff', 'cfs', 'clh']]],
      matrixLabel: 'Blockquote values by variant',
      statesHead: 'Variants · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- RichText (<RichText>, div.plx-rich-text: prose): article and compact, on the page or in a panel
    var RT = function (n) { return 'plx-comp-rich-text-' + n; };
    var PROSE = '<h2>Before you upload</h2><p>Name each file the way the <a href="#lab-naming">naming guide</a> says. A file such as <code>kitchen-014.jpg</code> keeps its name.</p>'
      + '<ul><li>Photos</li><li>Drawings</li></ul><blockquote><p>Every room gets its own folder.</p></blockquote><h3>Large files</h3><p>Files over 2 GB upload in parts.</p>'
      + '<pre>npm run upload -- --parts</pre><hr>';
    DS.registerLab('rich-text', {
      name: 'Rich text', title: 'Plenix rich text', file: 'platform/components/RichText/rich-text.css', compPrefix: /^plx-comp-rich-text-/,
      store: 'plenix-rich-text-lab-tokens', sizes: [['default', 'Default', '.plx-rich-text']],
      variants: [['article', 'Article (default)'], ['compact', 'Compact']], states: STATIC,
      content: [['page', 'On the page'], ['panel', 'In a panel']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Placement' },
      defaults: { size: 'default', variant: 'article', state: 'default', content: 'page' },
      props: [
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'ff', label: 'Font', css: ['font-family'], cat: 'font' },
        { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
        { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' },
        { id: 'mw', label: 'Reading width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'gap', label: 'Space between blocks', css: ['margin-block-start'], show: 'margin-top', part: 'p', cat: 'space', extra: ['0'] },
        { id: 'hgap', label: 'Space above a heading', css: ['margin-block-start'], show: 'margin-top', part: 'h3', cat: 'space', extra: ['0'] },
        { id: 'hfg', label: 'Heading color', css: ['color'], part: 'h2', cat: 'color' },
        { id: 'hff', label: 'Heading font', css: ['font-family'], part: 'h2', cat: 'font' },
        { id: 'hfw', label: 'Heading weight', css: ['font-weight'], part: 'h2', cat: 'font-weight' },
        { id: 'h2fs', label: 'Heading 2 size', css: ['font-size'], part: 'h2', cat: 'font-size' },
        { id: 'h2lh', label: 'Heading 2 line height', css: ['line-height'], part: 'h2', cat: 'line-height' },
        { id: 'h3fs', label: 'Heading 3 size', css: ['font-size'], part: 'h3', cat: 'font-size' },
        { id: 'h3lh', label: 'Heading 3 line height', css: ['line-height'], part: 'h3', cat: 'line-height' },
        { id: 'li', label: 'List indent', css: ['padding-inline-start'], show: 'padding-left', part: 'ul', cat: 'space', extra: ['0'] },
        { id: 'lig', label: 'Space between items', css: ['margin-block-start'], show: 'margin-top', part: 'li + li', cat: 'space', extra: ['0'] },
        { id: 'pbg', label: 'Code block fill', css: ['background-color'], part: 'pre', cat: 'color' },
        { id: 'pfg', label: 'Code block text', css: ['color'], part: 'pre', cat: 'color' },
        { id: 'pff', label: 'Code block font', css: ['font-family'], part: 'pre', cat: 'font' },
        { id: 'pfs', label: 'Code block size', css: ['font-size'], part: 'pre', cat: 'font-size' },
        { id: 'plh', label: 'Code block line height', css: ['line-height'], part: 'pre', cat: 'line-height' },
        { id: 'pp', label: 'Code block padding', css: ['padding-block-start', 'padding-block-end', 'padding-inline-start', 'padding-inline-end'], show: 'padding-top', part: 'pre', cat: 'space', extra: ['0'] },
        { id: 'prad', label: 'Code block corners', css: CORNERS, show: 'border-top-left-radius', part: 'pre', cat: 'radius', extra: ['0'] },
        { id: 'rc', label: 'Rule color', css: ['border-block-start-color'], show: 'border-top-color', part: 'hr', cat: 'color' },
        { id: 'rw', label: 'Rule width', css: ['border-block-start-width'], show: 'border-top-width', part: 'hr', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var v = variant === 'compact' ? 'compact-' : 'article-';
        switch (id) {
          case 'fg': return RT('text');
          case 'ff': return RT('font-family');
          case 'fs': return RT(v + 'font-size');
          case 'lh': return RT(v + 'line-height');
          case 'mw': return variant === 'compact' ? null : RT('article-measure');
          case 'gap': return RT(v + 'gap');
          case 'hgap': return RT(v + 'heading-gap');
          case 'hfg': return RT('heading-text');
          case 'hff': return RT('heading-font-family');
          case 'hfw': return RT('heading-font-weight');
          case 'h2fs': return RT('h2-font-size');
          case 'h2lh': return RT('h2-line-height');
          case 'h3fs': return RT('h3-font-size');
          case 'h3lh': return RT('h3-line-height');
          case 'li': return RT('list-indent');
          case 'lig': return RT('list-item-gap');
          case 'pbg': return RT('pre-background');
          case 'pfg': return RT('pre-text');
          case 'pff': return RT('pre-font-family');
          case 'pfs': return RT('pre-font-size');
          case 'plh': return RT('pre-line-height');
          case 'pp': return RT('pre-padding');
          case 'prad': return RT('pre-radius');
          case 'rc': return RT('rule-color');
          case 'rw': return RT('rule-width');
          default: return null;
        }
      },
      reach: function (full) { return /-compact-/.test(full) ? 'all compact prose' : /-article-/.test(full) ? 'every article' : 'all prose'; },
      every: 'all prose',
      html: function (variant, size, state, extraCls, ui) {
        var div = '<div class="plx-rich-text plx-rich-text--' + variant + ex(extraCls) + '">' + PROSE + '</div>';
        return ui && ui.content === 'panel' ? '<div class="ds-w02a-panel">' + div + '</div>' : '<div class="ds-w02a-wide">' + div + '</div>';
      },
      labelSelector: 'p',
      parts: { fg: 'A', ff: 'A', fs: 'A', lh: 'A', mw: 'A', gap: 'B', hgap: 'C', hfg: 'B', hff: 'B', hfw: 'B', h2fs: 'B', h2lh: 'B', h3fs: 'C', h3lh: 'C', li: 'D', lig: 'D', pbg: 'E', pfg: 'E', pff: 'E', pfs: 'E', plh: 'E', pp: 'E', prad: 'E', rc: 'F', rw: 'F' },
      anchors: { A: { part: 'p', side: 'right' }, B: { part: 'h2', side: 'top' }, C: { part: 'h3', side: 'top' }, D: { part: 'ul', side: 'left' }, E: { part: 'pre', side: 'right' }, F: { part: 'hr', side: 'bottom' } },
      sections: [['Text', ['fg', 'ff', 'fs', 'lh', 'mw', 'gap']], ['Headings', ['hgap', 'hfg', 'hff', 'hfw', 'h2fs', 'h2lh', 'h3fs', 'h3lh']], ['Lists', ['li', 'lig']], ['Code block', ['pbg', 'pfg', 'pff', 'pfs', 'plh', 'pp', 'prad']], ['Rule', ['rc', 'rw']]],
      matrixLabel: 'Rich text values by variant',
      statesHead: 'Variants · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- the List's ordered lists: numbered, lettered, nested and steps, added to the List's lab and as their own lab
    var LS = function (n) { return 'plx-comp-list-' + n; };
    var MINE = { decimal: 1, alpha: 1, nested: 1, steps: 1 };
    var ITEM = '.plx-list__item';
    var MORE_PROPS = [
      { id: 'mc', label: 'Number color', css: ['color'], part: ITEM, pseudo: '::before', cat: 'color' },
      { id: 'mw', label: 'Number width', css: ['min-inline-size'], show: 'min-width', part: ITEM, pseudo: '::before', cat: 'icon' },
      { id: 'sbg', label: 'Step fill', css: ['background-color'], part: ITEM, pseudo: '::before', cat: 'color' },
      { id: 'sbc', label: 'Step border color', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-top-color', part: ITEM, pseudo: '::before', cat: 'color' },
      { id: 'sbw', label: 'Step border width', css: ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'], show: 'border-top-width', part: ITEM, pseudo: '::before', cat: 'border-width' },
      { id: 'ss', label: 'Step size', css: ['inline-size', 'block-size'], show: 'width', part: ITEM, pseudo: '::before', cat: 'icon' },
      { id: 'sfs', label: 'Step number size', css: ['font-size'], part: ITEM, pseudo: '::before', cat: 'font-size' },
      { id: 'sfw', label: 'Step number weight', css: ['font-weight'], part: ITEM, pseudo: '::before', cat: 'font-weight' },
      { id: 'srad', label: 'Step corners', css: CORNERS, show: 'border-top-left-radius', part: ITEM, pseudo: '::before', cat: 'radius', extra: ['0'] },
      { id: 'ng', label: 'Gap (statement to nested list)', css: ['row-gap'], part: '.plx-list__body', cat: 'space', extra: ['0'] }
    ];
    var orderedToken = function (id, variant) {
      var steps = variant === 'steps';
      switch (id) {
        case 'rg': return LS('row-gap');
        case 'fg': return LS('item-text');
        case 'fs': return LS('item-font-size');
        case 'lh': return LS('item-line-height');
        case 'gap': return LS('item-gap');
        case 'mc': return LS(steps ? 'step-text' : 'marker-text');
        case 'mw': return steps ? null : LS('marker-min-width');
        case 'sbg': return steps ? LS('step-background') : null;
        case 'sbc': return steps ? LS('step-border-color') : null;
        case 'sbw': return steps ? LS('step-border-width') : null;
        case 'ss': return steps ? LS('step-size') : null;
        case 'sfs': return steps ? LS('step-font-size') : null;
        case 'sfw': return steps ? LS('step-font-weight') : null;
        case 'srad': return steps ? LS('step-radius') : null;
        case 'ng': return variant === 'nested' ? LS('nested-gap') : null;
        default: return null;
      }
    };
    var li = function (t, body) { return '<li class="plx-list__item plx-list__item--neutral">' + (body || '<span class="plx-list__text">' + t + '</span>') + '</li>'; };
    var orderedHtml = function (variant, extraCls) {
      var cls = 'plx-list plx-list--ordered' + (variant === 'alpha' ? ' plx-list--alpha' : '') + (variant === 'steps' ? ' plx-list--steps' : '') + ex(extraCls);
      var items = variant === 'alpha' ? [li('Keep both files'), li('Replace the old file'), li('Skip this file')]
        : variant === 'nested' ? [li('Create the project'), li(null, '<div class="plx-list__body"><span class="plx-list__text">Upload the files</span><ol class="plx-list plx-list--ordered plx-list--alpha plx-list--nested">' + li('Photos') + li('Drawings') + '</ol></div>'), li('Share it')]
          : [li('Create the project and name it'), li('Upload the photos and drawings'), li('Share the project with the client')];
      return '<div class="ds-sample-list-frame"><ol class="' + cls + '" aria-label="Steps">' + items.join('') + '</ol></div>';
    };
    var ORDERED_VARIANTS = [['decimal', 'Ordered (decimal, default)'], ['alpha', 'Ordered (alpha)'], ['nested', 'Nested'], ['steps', 'Steps']];
    var base = DS.labs.list;
    if (base) {
      var props = base.props.concat(MORE_PROPS);
      var parts = Object.assign({}, base.parts, { mc: 'E', mw: 'E', sbg: 'E', sbc: 'E', sbw: 'E', ss: 'E', sfs: 'E', sfw: 'E', srad: 'E', ng: 'F' });
      var anchors = Object.assign({}, base.anchors, { E: { part: ITEM, side: 'left' }, F: { part: '.plx-list__body', side: 'bottom' } });
      var sections = base.sections.concat([['Number', ['mc', 'mw']], ['Step', ['sbg', 'sbc', 'sbw', 'ss', 'sfs', 'sfw', 'srad']], ['Nested', ['ng']]]);
      var token = function (id, size, variant, state, content) { return MINE[variant] ? orderedToken(id, variant) : MORE_PROPS.some(function (p) { return p.id === id; }) ? null : base.token(id, size, variant, state, content); };
      var html = function (variant, size, state, extraCls, ui) { return MINE[variant] ? orderedHtml(variant, extraCls) : base.html(variant, size, state, extraCls, ui); };
      DS.registerLab('list', Object.assign({}, base, { variants: base.variants.concat(ORDERED_VARIANTS), props: props, parts: parts, anchors: anchors, sections: sections, token: token, html: html,
        reach: function (full) { return /-(marker|step|nested)-/.test(full) ? 'every ordered list' : base.reach(full); } }));
      DS.registerLab('ordered-list', Object.assign({}, DS.labs.list, { name: 'Ordered list', title: 'Plenix ordered list', store: 'plenix-ordered-list-lab-tokens',
        variants: ORDERED_VARIANTS, content: [['default', 'Three statements']], labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Statements' },
        defaults: { size: 'default', variant: 'decimal', state: 'default', content: 'default' }, every: 'every ordered list',
        matrixLabel: 'Ordered list values by kind', statesHead: 'Kinds · every value (click one to inspect it; the dashed outline marks the one shown below)' }));
    }
  })();
}
