/* global DS */
/* Plenix master spec · the content labs (Every Variant, batch 333): text, heading, list, code block, keyboard hint, avatar,
   property list, thumbnail and icon. Each description for the shared component lab (component-lab.js) names the component's
   sizes, its variants (the matrix columns), its states (the rows), its content, every property the lab reads with the one
   token that sets it, and the markup the component renders. Where a rule sets a token locally on the element (the icon's
   size classes, the avatar's own colors) the property maps to the token that rule reads. */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var BORDER_COLORS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
  var BORDER_WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
  var STATIC = [['default', 'Default']];   // a content component has no interactive states
  var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };

  // ---- Text (<Text>, span.plx-text): a text role from the type tokens; truncate cuts it to one line
  var TX = function (variant, n) { return 'plx-comp-text-' + variant + '-' + n; };
  var TEXT_ROLES = [['body', 'Body (default)'], ['title', 'Title'], ['heading', 'Heading'], ['strong', 'Strong'], ['label', 'Label'], ['secondary', 'Secondary'],
    ['caption', 'Caption'], ['eyebrow', 'Eyebrow'], ['data', 'Data'], ['danger', 'Danger'], ['success', 'Success'], ['accent', 'Accent'], ['link', 'Link']];
  // which properties each role sets (the rest it inherits)
  var TEXT_SETS = {
    body: 'fg ff fs', secondary: 'fg ff fs', caption: 'fg ff fs', data: 'ff fs', label: 'fg ff fs fw', strong: 'fw',
    title: 'fg ff fs fw', heading: 'fg ff fs fw', eyebrow: 'fg ff fs fw', danger: 'fg', success: 'fg', accent: 'fg fw', link: 'fg fw'
  };
  var TEXT_SUFFIX = { fg: 'text', ff: 'font-family', fs: 'font-size', fw: 'font-weight' };
  DS.registerLab('text', {
    name: 'Text', title: 'Plenix text', file: 'platform/components/Text/text.css', compPrefix: /^plx-comp-text-/,
    store: 'plenix-text-lab-tokens', sizes: [['default', 'Default', '.plx-text']],
    variants: TEXT_ROLES, states: STATIC,
    content: [['line', 'One line'], ['truncate', 'Truncated (one line, cut with an ellipsis)']],
    labels: { size: 'Size', variant: 'Role', state: 'State', content: 'Overflow' },
    defaults: { size: 'default', variant: 'body', state: 'default', content: 'line' },
    props: [
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'ff', label: 'Font family', css: ['font-family'], cat: 'font' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' }
    ],
    token: function (id, size, variant) { return TEXT_SETS[variant].split(' ').indexOf(id) >= 0 ? TX(variant, TEXT_SUFFIX[id]) : null; },
    reach: function (full) { var m = /^plx-comp-text-([a-z]+)-/.exec(full); return m ? 'every ' + m[1] + ' text' : 'every text'; },
    every: 'every text',
    html: function (variant, size, state, extraCls, ui) {
      var cut = ui && ui.content === 'truncate';
      var span = '<span class="plx-text plx-text--' + variant + (cut ? ' plx-text--truncate' : '') + ex(extraCls) + '">' + (cut ? 'Quarterly brand review, final version for the press kit' : 'Brand review') + '</span>';
      return cut ? '<div class="ds-sample-text-frame">' + span + '</div>' : span;
    },
    labelSelector: null,
    parts: { fg: 'A', ff: 'A', fs: 'A', fw: 'A' },
    anchors: { A: { part: null, side: 'bottom' } },
    sections: [['Text', ['fg', 'ff', 'fs', 'fw']]],
    matrixLabel: 'Text values by role',
    statesHead: 'Roles · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Heading (<SectionHeading>, h3.plx-section-heading): a small uppercase label; collapsible makes it a toggle; each level
  // (2, 3, 4) takes its own size from the type scale
  var SH = function (n) { return 'plx-comp-section-heading-' + n; };
  var TOGGLE = '.plx-section-heading__toggle', CHEVRON = '.plx-section-heading__chevron', SH_LABEL = '.plx-section-heading__label';
  DS.registerLab('heading', {
    name: 'Heading', title: 'Plenix section heading', file: 'platform/components/SectionHeading/section-heading.css', compPrefix: /^plx-comp-section-heading-/,
    store: 'plenix-heading-lab-tokens', sizes: [['2', 'Level 2', '.plx-section-heading--level-2'], ['3', 'Level 3 (default)', '.plx-section-heading--level-3'], ['4', 'Level 4', '.plx-section-heading--level-4']],
    variants: [['plain', 'Plain'], ['collapsible', 'Collapsible']],
    states: [['default', 'Default'], ['hover', 'Hover (its toggle)'], ['focus', 'Focus (its toggle)']],
    content: [['open', 'Open'], ['closed', 'Closed']],
    labels: { size: 'Level', variant: 'Kind', state: 'State', content: 'Section' },
    defaults: { size: '3', variant: 'collapsible', state: 'default', content: 'open' },
    props: [
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'ff', label: 'Font family', css: ['font-family'], cat: 'font' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
      { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' },
      { id: 'gap', label: 'Gap (label to actions)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'tg', label: 'Toggle gap (label to chevron)', css: ['column-gap'], part: TOGGLE, cat: 'space', extra: ['0'] },
      { id: 'th', label: 'Toggle minimum height', css: ['min-block-size'], show: 'min-height', part: TOGGLE, cat: 'control-height' },
      { id: 'hfg', label: 'Toggle hover text color', css: ['color'], part: TOGGLE, cat: 'color' },
      { id: 'cw', label: 'Chevron width', css: ['inline-size'], show: 'width', part: CHEVRON, cat: 'icon' },
      { id: 'ch', label: 'Chevron height', css: ['block-size'], show: 'height', part: CHEVRON, cat: 'icon' },
      { id: 'cbb', label: 'Chevron stroke (bottom)', css: ['border-block-end-width'], show: 'border-bottom-width', part: CHEVRON, cat: 'border-width' },
      { id: 'cbi', label: 'Chevron stroke (side)', css: ['border-inline-end-width'], show: 'border-right-width', part: CHEVRON, cat: 'border-width' },
      { id: 'foc', label: 'Focus ring color', css: ['outline-color'], part: TOGGLE, cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], part: TOGGLE, cat: 'border-width' },
      { id: 'foo', label: 'Focus ring offset', css: ['outline-offset'], part: TOGGLE, cat: 'space', extra: ['0'] }
    ],
    token: function (id, size, variant, state) {
      var coll = variant === 'collapsible';
      switch (id) {
        case 'fg': return SH('text');
        case 'ff': return SH('font-family');
        case 'fs': return SH('level-' + size + '-font-size');
        case 'fw': return SH('font-weight');
        case 'lh': return SH('line-height');
        case 'gap': return SH('gap');
        case 'tg': return coll ? SH('toggle-gap') : null;
        case 'th': return coll ? SH('toggle-min-height') : null;
        case 'hfg': return coll && state === 'hover' ? SH('toggle-hover-text') : null;
        case 'cw': return coll ? SH('chevron-width') : null;
        case 'ch': return coll ? SH('chevron-height') : null;
        case 'cbb': return coll ? SH('chevron-border-block-end-width') : null;
        case 'cbi': return coll ? SH('chevron-border-inline-end-width') : null;
        case 'foc': return coll && state === 'focus' ? SH('toggle-focus-outline-color') : null;
        case 'fow': return coll && state === 'focus' ? SH('toggle-focus-outline-width') : null;
        case 'foo': return coll && state === 'focus' ? SH('toggle-focus-outline-offset') : null;
        default: return null;
      }
    },
    reach: function (full) { return /-(toggle|chevron)-/.test(full) ? 'every collapsible heading' : 'every section heading'; },
    every: 'every section heading',
    html: function (variant, size, state, extraCls, ui) {
      var label = '<span class="plx-section-heading__label">Recent</span>';
      var lv = size || '3', tag = 'h' + lv, cls = 'plx-section-heading plx-section-heading--level-' + lv;
      if (variant !== 'collapsible') return '<' + tag + ' class="' + cls + ex(extraCls) + '">' + label + '</' + tag + '>';
      var st = state === 'hover' ? ' is-hover' : state === 'focus' ? ' ds-focus' : '', open = !(ui && ui.content === 'closed');
      return '<' + tag + ' class="' + cls + ' plx-section-heading--collapsible' + ex(extraCls) + '"><button type="button" tabindex="-1" class="plx-section-heading__toggle' + st + '" aria-expanded="' + open + '">'
        + label + '<span class="plx-section-heading__chevron" aria-hidden="true"></span></button></' + tag + '>';
    },
    labelSelector: SH_LABEL,
    parts: { fg: 'A', ff: 'A', fs: 'A', fw: 'A', lh: 'A', gap: 'B', tg: 'B', th: 'B', hfg: 'B', foc: 'B', fow: 'B', foo: 'B', cw: 'C', ch: 'C', cbb: 'C', cbi: 'C' },
    anchors: { A: { part: SH_LABEL, side: 'bottom' }, B: { part: null, side: 'top' }, C: { part: CHEVRON, side: 'right' } },
    sections: [['Text', ['fg', 'ff', 'fs', 'fw', 'lh']], ['Spacing', ['gap', 'tg', 'th']], ['Chevron', ['cw', 'ch', 'cbb', 'cbi']], ['Toggle states', ['hfg', 'foc', 'fow', 'foo']]],
    matrixLabel: 'Heading values by kind and state',
    statesHead: 'Kinds and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- List (<List>, ul.plx-list: rows of a toned icon and a statement): do (success marks) and do not (danger marks)
  var LI = function (n) { return 'plx-comp-list-' + n; };
  var LIST_KIND = { do: { tone: 'success', icon: 'circle-check', items: ['Name the action the button takes', 'Keep labels to one or two words, so they fit in a narrow pane without wrapping'] },
    dont: { tone: 'danger', icon: 'close', items: ['Use OK or Yes as a label', 'End a label with a period or write it in capitals, which reads as shouting in a busy toolbar'] } };
  var LIST_ITEM = '.plx-list__item', LIST_ICON = '.plx-list__icon';
  DS.registerLab('list', {
    name: 'List', title: 'Plenix list', file: 'platform/components/List/list.css', compPrefix: /^plx-comp-list-/,
    store: 'plenix-list-lab-tokens', sizes: [['default', 'Default', '.plx-list']],
    variants: [['do', 'Do (success marks)'], ['dont', 'Do not (danger marks)']], states: STATIC,
    content: [['short', 'Short statements'], ['long', 'A statement that wraps']],
    labels: { size: 'Size', variant: 'Marks', state: 'State', content: 'Statements' },
    defaults: { size: 'default', variant: 'do', state: 'default', content: 'short' },
    props: [
      { id: 'rg', label: 'Row gap', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'fg', label: 'Text color', css: ['color'], part: LIST_ITEM, cat: 'color' },
      { id: 'fs', label: 'Font size', css: ['font-size'], part: LIST_ITEM, cat: 'font-size' },
      { id: 'lh', label: 'Line height', css: ['line-height'], part: LIST_ITEM, cat: 'line-height' },
      { id: 'gap', label: 'Gap (icon to text)', css: ['column-gap'], part: LIST_ITEM, cat: 'space', extra: ['0'] },
      { id: 'ic', label: 'Icon color', css: ['color'], part: LIST_ICON, cat: 'color' },
      { id: 'ih', label: 'Icon box height', css: ['block-size'], show: 'height', part: LIST_ICON, cat: 'icon' },
      { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: LIST_ICON + ' .plx-icon', cat: 'icon' }
    ],
    token: function (id, size, variant) {
      switch (id) {
        case 'rg': return LI('row-gap');
        case 'fg': return LI('item-text');
        case 'fs': return LI('item-font-size');
        case 'lh': return LI('item-line-height');
        case 'gap': return LI('item-gap');
        case 'ic': return LI('item-' + LIST_KIND[variant].tone + '-icon-text');
        case 'ih': return LI('icon-height');
        case 'is': return LI('icon-size');   // .plx-list__icon sets the icon's size from this token
        default: return null;
      }
    },
    reach: function (full) { var m = /list-item--([a-z]+)-icon/.exec(full); return m ? 'every ' + m[1] + ' list mark' : /icon-size/.test(full) ? 'every small icon' : 'every list'; },
    every: 'every list',
    html: function (variant, size, state, extraCls, ui) {
      var k = LIST_KIND[variant], items = ui && ui.content === 'long' ? k.items.slice(1) : k.items.slice(0, 1);
      var ul = '<ul class="plx-list' + ex(extraCls) + '" aria-label="' + (variant === 'do' ? 'Do' : 'Do not') + '">' + items.map(function (t) {
        return '<li class="plx-list__item plx-list__item--' + k.tone + '"><span class="plx-list__icon" aria-hidden="true">' + DS.icon(k.icon) + '</span><span class="plx-list__text">' + t + '</span></li>';
      }).join('') + '</ul>';
      return '<div class="ds-sample-list-frame">' + ul + '</div>';
    },
    labelSelector: '.plx-list__text',
    parts: { rg: 'A', fg: 'B', fs: 'B', lh: 'B', gap: 'C', ic: 'D', ih: 'D', is: 'D' },
    anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-list__text', side: 'bottom' }, C: { part: LIST_ITEM, side: 'top' }, D: { part: LIST_ICON, side: 'left' } },
    sections: [['List', ['rg']], ['Statement', ['fg', 'fs', 'lh', 'gap']], ['Mark', ['ic', 'ih', 'is']]],
    matrixLabel: 'List values by marks',
    statesHead: 'Marks · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Code block (<CodeBlock>, div.plx-code-block: a head with the title and Copy, and the colored code)
  var CB = function (n) { return 'plx-comp-code-block-' + n; };
  var HEAD = '.plx-code-block__head', TITLE = '.plx-code-block__title', PRE = '.plx-code-block__pre';
  var tok = function (kind, text) { return '<span class="plx-code-block__tok--' + kind + '">' + text + '</span>'; };
  var CODE = {
    css: { title: 'card.css', lines: [
      tok('comment', '/* the card */'),
      tok('selector', '.plx-card ') + '{',
      '  ' + tok('attribute', 'padding-block-start') + ': ' + tok('function', 'var') + '(' + tok('variable', '--plx-sys-space-inset-md') + ');',
      '  ' + tok('attribute', 'inline-size') + ': ' + tok('number', '320px') + ' ' + tok('keyword', '!important') + ';',
      '  ' + tok('attribute', 'quotes') + ': ' + tok('string', '"«" "»"') + ';',
      '}'] },
    jsx: { title: 'Save.jsx', lines: [
      tok('keyword', 'import') + ' { Button } ' + tok('keyword', 'from') + ' ' + tok('string', '"@plenix/react"') + ';',
      tok('comment', '// the save action'),
      tok('keyword', 'export') + ' ' + tok('keyword', 'function') + ' ' + tok('function', 'Save') + '() {',
      '  ' + tok('keyword', 'return') + ' &lt;' + tok('tag', 'Button') + ' ' + tok('attribute', 'size') + '=' + tok('string', '"sm"') + ' ' + tok('attribute', 'delay') + '={' + tok('number', '300') + '}&gt;Save&lt;/' + tok('tag', 'Button') + '&gt;;',
      '}'] }
  };
  // the syntax colors: [prop id, kind, label, the content it appears in (none: both)]
  var KINDS = [['k', 'keyword', 'Keyword color'], ['s', 'string', 'String color'], ['c', 'comment', 'Comment color'], ['n', 'number', 'Number color'],
    ['f', 'function', 'Function color'], ['a', 'attribute', 'Attribute and property color'], ['v', 'variable', 'Custom property color', 'css'],
    ['sel', 'selector', 'Selector color', 'css'], ['tag', 'tag', 'Tag color', 'jsx']];
  DS.registerLab('code-block', {
    name: 'Code block', title: 'Plenix code block', file: 'platform/components/CodeBlock/code-block.css', compPrefix: /^plx-comp-code-block-/,
    store: 'plenix-code-block-lab-tokens', sizes: [['default', 'Default', '.plx-code-block']],
    variants: [['none', 'None (as tall as its code)'], ['tall', 'Tall (scrolls inside a box)']],
    states: [['default', 'Default'], ['focus', 'Focus (the code)']],
    content: [['css', 'CSS'], ['jsx', 'JSX']],
    labels: { size: 'Size', variant: 'Height', state: 'State', content: 'Language' },
    defaults: { size: 'default', variant: 'none', state: 'default', content: 'css' },
    props: [
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'bc', label: 'Border color', css: BORDER_COLORS, show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTHS, show: 'border-top-width', cat: 'border-width' },
      { id: 'hb', label: 'Head background color', css: ['background-color'], part: HEAD, cat: 'color' },
      { id: 'hs', label: 'Head divider (shadow)', css: ['box-shadow'], part: HEAD, cat: 'shadow' },
      { id: 'hh', label: 'Head minimum height', css: ['min-block-size'], show: 'min-height', part: HEAD, cat: 'control-height' },
      { id: 'hg', label: 'Head gap (title to Copy)', css: ['column-gap'], part: HEAD, cat: 'space', extra: ['0'] },
      { id: 'hpy', label: 'Head padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: HEAD, cat: 'space', extra: ['0'] },
      { id: 'hps', label: 'Head padding left', css: ['padding-inline-start'], show: 'padding-left', part: HEAD, cat: 'space', extra: ['0'] },
      { id: 'hpe', label: 'Head padding right', css: ['padding-inline-end'], show: 'padding-right', part: HEAD, cat: 'space', extra: ['0'] },
      { id: 'tc', label: 'Title color', css: ['color'], part: TITLE, cat: 'color' },
      { id: 'tf', label: 'Title font family', css: ['font-family'], part: TITLE, cat: 'font' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: TITLE, cat: 'font-size' },
      { id: 'pb', label: 'Code background color', css: ['background-color'], part: PRE, cat: 'color' },
      { id: 'pt', label: 'Code text color', css: ['color'], part: PRE, cat: 'color' },
      { id: 'pf', label: 'Code font family', css: ['font-family'], part: PRE, cat: 'font' },
      { id: 'pfs', label: 'Code font size', css: ['font-size'], part: PRE, cat: 'font-size' },
      { id: 'plh', label: 'Code line height', css: ['line-height'], part: PRE, cat: 'line-height' },
      { id: 'ppy', label: 'Code padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: PRE, cat: 'space', extra: ['0'] },
      { id: 'ppx', label: 'Code padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: PRE, cat: 'space', extra: ['0'] },
      { id: 'pmh', label: 'Code maximum height', css: ['max-block-size'], show: 'max-height', part: PRE, cat: 'size' },
      { id: 'foc', label: 'Focus ring color', css: ['outline-color'], part: PRE, cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], part: PRE, cat: 'border-width' },
      { id: 'foo', label: 'Focus ring offset', css: ['outline-offset'], part: PRE, cat: 'space', extra: ['0'] }
    ].concat(KINDS.map(function (k) { return { id: k[0], label: k[2], css: ['color'], part: '.plx-code-block__tok--' + k[1], cat: 'color' }; })),
    token: function (id, size, variant, state, content) {
      var kind = KINDS.filter(function (k) { return k[0] === id; })[0];
      if (kind) return !kind[3] || kind[3] === content ? CB('tok-' + kind[1] + '-text') : null;
      var focus = state === 'focus';
      var map = { rad: 'radius', bc: 'border-color', bw: 'border-width', hb: 'head-background', hs: 'head-shadow', hh: 'head-min-height', hg: 'head-gap',
        hpy: 'head-padding-block', hps: 'head-padding-inline-start', hpe: 'head-padding-inline-end', tc: 'title-text', tf: 'title-font-family', tfs: 'title-font-size',
        pb: 'pre-background', pt: 'pre-text', pf: 'pre-font-family', pfs: 'pre-font-size', plh: 'pre-line-height', ppy: 'pre-padding-block', ppx: 'pre-padding-inline',
        pmh: variant === 'tall' ? 'tall-pre-max-height' : null,
        foc: focus ? 'pre-focus-outline-color' : null, fow: focus ? 'pre-focus-outline-width' : null, foo: focus ? 'pre-focus-outline-offset' : null };
      return map[id] ? CB(map[id]) : null;
    },
    reach: function (full) { return /code-block-(keyword|string|comment|number|function|tag|attribute|variable|selector)-text/.test(full) ? 'that kind of token in every code block' : /-tall-/.test(full) ? 'every tall code block' : 'every code block'; },
    every: 'every code block',
    html: function (variant, size, state, extraCls, ui) {
      var c = CODE[(ui && ui.content) || 'css'];
      return '<div class="ds-sample-code-frame"><div class="plx-code-block plx-code-block--' + variant + ex(extraCls) + '"><div class="plx-code-block__head"><span class="plx-code-block__title">' + c.title + '</span>'
        + '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs"><span class="plx-button__label">Copy</span></button></div>'
        + '<pre class="plx-code-block__pre' + (state === 'focus' ? ' is-focus-visible' : '') + '" tabindex="0" aria-label="' + c.title + '"><code>' + c.lines.join('\n') + '</code></pre></div></div>';
    },
    labelSelector: TITLE,
    parts: { rad: 'A', bc: 'A', bw: 'A', hb: 'B', hs: 'B', hh: 'B', hg: 'B', hpy: 'B', hps: 'B', hpe: 'B', tc: 'C', tf: 'C', tfs: 'C',
      pb: 'D', pt: 'D', pf: 'D', pfs: 'D', plh: 'D', ppy: 'D', ppx: 'D', pmh: 'D', foc: 'D', fow: 'D', foo: 'D',
      k: 'E', s: 'E', c: 'E', n: 'E', f: 'E', a: 'E', v: 'E', sel: 'E', tag: 'E' },
    anchors: { A: { part: null, side: 'left' }, B: { part: HEAD, side: 'right' }, C: { part: TITLE, side: 'top' }, D: { part: PRE, side: 'right' }, E: { part: '.plx-code-block__tok--function', side: 'bottom' } },
    sections: [['Frame', ['rad', 'bc', 'bw']], ['Head', ['hb', 'hs', 'hh', 'hg', 'hpy', 'hps', 'hpe']], ['Title', ['tc', 'tf', 'tfs']],
      ['Code', ['pb', 'pt', 'pf', 'pfs', 'plh', 'ppy', 'ppx', 'pmh']], ['Focus', ['foc', 'fow', 'foo']], ['Syntax colors', KINDS.map(function (k) { return k[0]; })]],
    matrixLabel: 'Code block values by height and state',
    statesHead: 'Heights and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Keyboard hint (<Kbd>, kbd.plx-kbd): a key or shortcut, on the page or on the accent header
  var KB = function (n) { return 'plx-comp-kbd-' + n; };
  DS.registerLab('keyboard-hint', {
    name: 'Keyboard hint', title: 'Plenix keyboard hint', file: 'platform/components/Kbd/kbd.css', compPrefix: /^plx-comp-kbd-/,
    store: 'plenix-keyboard-hint-lab-tokens', sizes: [['default', 'Default (16px)', '.plx-kbd']],
    variants: [['page', 'On the page'], ['accent', 'On the accent header']], states: STATIC,
    content: [['shortcut', 'A shortcut (Ctrl K)'], ['key', 'One key (/)']],
    labels: { size: 'Size', variant: 'Surface', state: 'State', content: 'Keys' },
    defaults: { size: 'default', variant: 'page', state: 'default', content: 'shortcut' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: BORDER_COLORS, show: 'border-top-color', cat: 'color' },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTHS, show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'ff', label: 'Font family', css: ['font-family'], cat: 'font' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' }
    ],
    token: function (id, size, variant) {
      var on = variant === 'accent' ? 'on-accent-' : '';
      switch (id) {
        case 'bg': return KB(on + 'background');
        case 'bc': return KB(on + 'border-color');
        case 'fg': return KB(on + 'text');
        case 'bw': return KB('border-width');
        case 'rad': return KB('radius');
        case 'h': return KB('min-height');
        case 'px': return KB('padding-inline');
        case 'ff': return KB('font-family');
        case 'fs': return KB('font-size');
        case 'lh': return KB('line-height');
        default: return null;
      }
    },
    reach: function (full) { return /kbd-on-accent-/.test(full) ? 'every keyboard hint on the accent header' : 'every keyboard hint'; },
    every: 'every keyboard hint',
    html: function (variant, size, state, extraCls, ui) {
      var kbd = '<kbd class="plx-kbd' + (variant === 'accent' ? ' plx-kbd--on-accent' : '') + ex(extraCls) + '">' + (ui && ui.content === 'key' ? '/' : 'Ctrl K') + '</kbd>';
      return variant === 'accent' ? '<span class="ds-sample-on-accent">' + kbd + '</span>' : kbd;
    },
    labelSelector: null,
    parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', h: 'B', px: 'B', fg: 'C', ff: 'C', fs: 'C', lh: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
    sections: [['Key', ['bg', 'bc', 'bw', 'rad']], ['Size', ['h', 'px']], ['Text', ['fg', 'ff', 'fs', 'lh']]],
    matrixLabel: 'Keyboard hint values by surface',
    statesHead: 'Surfaces · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Avatar (<Avatar>, span.plx-avatar: initials or a picture in a rounded square) in seven sizes; the theme's colors
  // or a person's own data color (data-plx-color sets the avatar's own colors from that hue's soft roles)
  var AV = function (n) { return 'plx-comp-avatar-' + n; };
  var AV_PX = { '2xs': 20, xs: 24, sm: 28, md: 32, lg: 40, xl: 48, '2xl': 64 };
  var OWN_HUE = 'purple';
  DS.registerLab('avatar', {
    name: 'Avatar', title: 'Plenix avatar', file: 'platform/components/Avatar/avatar.css', compPrefix: /^plx-comp-avatar-/,
    store: 'plenix-avatar-lab-tokens',
    sizes: [['2xs', '2XS (20px)', '.plx-avatar--20'], ['xs', 'XS (24px)', '.plx-avatar--24'], ['sm', 'SM (28px)', '.plx-avatar--28'], ['md', 'MD (32px)', '.plx-avatar--32'],
      ['lg', 'LG (40px)', '.plx-avatar--40'], ['xl', 'XL (48px)', '.plx-avatar--48'], ['2xl', '2XL (64px)', '.plx-avatar--64']],
    variants: [['theme', 'The theme colors'], ['own', 'A person’s own colors']], states: STATIC,
    content: [['initials', 'Initials (RM)'], ['one', 'One word (R)']],
    labels: { size: 'Size', variant: 'Colors', state: 'State', content: 'Initials' },
    defaults: { size: 'sm', variant: 'theme', state: 'default', content: 'initials' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
      { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' }
    ],
    token: function (id, size, variant) {
      var px = AV_PX[size], own = variant === 'own';
      switch (id) {
        // the avatar reads its own colors first, then the theme's avatar roles; a data color sets its own from the hue's soft roles
        case 'bg': return own ? null : 'plx-comp-avatar-background';   // a person's own color comes from the data palette
        case 'fg': return own ? null : 'plx-comp-avatar-content';
        case 'w': return AV(px + '-width');
        case 'h': return AV(px + '-height');
        case 'rad': return AV(px + '-radius');
        case 'fs': return AV(px + '-font-size');
        case 'fw': return AV('font-weight');
        case 'lh': return AV('line-height');
        default: return null;
      }
    },
    reach: function (full) {
      var m = /avatar-(\d+)-/.exec(full); if (m) return 'every ' + m[1] + 'px avatar';
      if (/data-color-/.test(full)) return 'everything in that data color';
      if (/sys-avatar-/.test(full)) return 'every avatar in the theme colors';
      return 'every avatar';
    },
    every: 'every avatar',
    html: function (variant, size, state, extraCls, ui) {
      return '<span class="plx-avatar plx-avatar--' + AV_PX[size] + ex(extraCls) + '" data-plx-avatar=""' + (variant === 'own' ? ' data-plx-color="' + OWN_HUE + '"' : '') + ' aria-hidden="true">'
        + (ui && ui.content === 'one' ? 'R' : 'RM') + '</span>';
    },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', w: 'B', h: 'B', fg: 'C', fs: 'C', fw: 'C', lh: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
    sections: [['Fill', ['bg', 'rad']], ['Size', ['w', 'h']], ['Initials', ['fg', 'fs', 'fw', 'lh']]],
    matrixLabel: 'Avatar values by colors',
    statesHead: 'Colors · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Property list (<PropertyList>, dl.plx-property-list: label and value pairs) in columns or stacked
  var PL = function (n) { return 'plx-comp-property-list-' + n; };
  var PL_ITEM = '.plx-property-list__item', PL_LABEL = '.plx-property-list__label', PL_VALUE = '.plx-property-list__value';
  var PL_DESC = '.plx-property-list__description', PL_DATA = '.plx-property-list__value--data', PL_TIP = '.plx-property-list__label-tip';
  var plItem = function (label, value, desc, data) {
    return '<div class="plx-property-list__item"><dt class="plx-property-list__label"><span class="plx-tooltip plx-property-list__label-tip"><span class="plx-property-list__label-text">' + label + '</span></span>'
      + (desc ? '<span class="plx-property-list__description">' + desc + '</span>' : '') + '</dt><dd class="plx-property-list__value' + (data ? ' plx-property-list__value--data' : '') + '">' + value + '</dd></div>';
  };
  DS.registerLab('property-list', {
    name: 'Property list', title: 'Plenix property list', file: 'platform/patterns/PropertyList/property-list.css', compPrefix: /^plx-comp-property-list-/,
    store: 'plenix-property-list-lab-tokens', sizes: [['default', 'Default', '.plx-property-list']],
    variants: [['columns', 'Columns'], ['stacked', 'Stacked']], states: STATIC,
    content: [['text', 'Text values'], ['data', 'A technical value and a description']],
    labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Values' },
    defaults: { size: 'default', variant: 'columns', state: 'default', content: 'data' },
    props: [
      { id: 'rg', label: 'Row gap (between pairs)', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'cg', label: 'Column gap (label to value)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'ig', label: 'Pair gap (label to value)', css: ['column-gap'], part: PL_ITEM, cat: 'space', extra: ['0'] },
      { id: 'srg', label: 'Stacked gap (label over value)', css: ['row-gap'], part: PL_ITEM, cat: 'space', extra: ['0'] },
      { id: 'tw', label: 'Label column maximum width', css: ['max-inline-size'], show: 'max-width', part: PL_TIP, cat: 'size' },
      { id: 'lc', label: 'Label color', css: ['color'], part: PL_LABEL, cat: 'color' },
      { id: 'lfs', label: 'Label font size', css: ['font-size'], part: PL_LABEL, cat: 'font-size' },
      { id: 'lrg', label: 'Label gap (label to description)', css: ['row-gap'], part: PL_LABEL, cat: 'space', extra: ['0'] },
      { id: 'dc', label: 'Description color', css: ['color'], part: PL_DESC, cat: 'color' },
      { id: 'dfs', label: 'Description font size', css: ['font-size'], part: PL_DESC, cat: 'font-size' },
      { id: 'vc', label: 'Value color', css: ['color'], part: PL_VALUE, cat: 'color' },
      { id: 'vfs', label: 'Value font size', css: ['font-size'], part: PL_VALUE, cat: 'font-size' },
      { id: 'vdf', label: 'Technical value font family', css: ['font-family'], part: PL_DATA, cat: 'font' },
      { id: 'vdfs', label: 'Technical value font size', css: ['font-size'], part: PL_DATA, cat: 'font-size' }
    ],
    token: function (id, size, variant, state, content) {
      var cols = variant === 'columns', data = content === 'data';
      switch (id) {
        case 'rg': return PL('row-gap');
        case 'cg': return cols ? PL('columns-gap') : null;
        case 'ig': return PL('item-gap');
        case 'srg': return cols ? null : PL('stacked-item-row-gap');
        case 'tw': return cols ? PL('columns-label-tip-max-width') : null;
        case 'lc': return PL('label-text');
        case 'lfs': return PL('label-font-size');
        case 'lrg': return PL('label-row-gap');
        case 'dc': return data ? PL('description-text') : null;
        case 'dfs': return data ? PL('description-font-size') : null;
        case 'vc': return PL('value-text');
        case 'vfs': return PL('value-font-size');
        case 'vdf': return data ? PL('value-data-font-family') : null;
        case 'vdfs': return data ? PL('value-data-font-size') : null;
        default: return null;
      }
    },
    reach: function (full) { return /-columns-/.test(full) ? 'every property list in columns' : /-stacked-/.test(full) ? 'every stacked property list' : 'every property list'; },
    every: 'every property list',
    html: function (variant, size, state, extraCls, ui) {
      var data = ui && ui.content === 'data';
      var items = data ? plItem('Owner', 'Jordan Avery') + plItem('Size', '2.4 MB', null, true) + plItem('Modified', 'Yesterday at 14:20', 'In this folder')
        : plItem('Owner', 'Jordan Avery') + plItem('Folder', 'Brand assets');
      return '<div class="ds-sample-property-frame"><dl class="plx-property-list plx-property-list--' + variant + ex(extraCls) + '">' + items + '</dl></div>';
    },
    labelSelector: '.plx-property-list__label-text',
    parts: { rg: 'A', cg: 'B', ig: 'B', srg: 'B', tw: 'C', lc: 'C', lfs: 'C', lrg: 'C', dc: 'D', dfs: 'D', vc: 'E', vfs: 'E', vdf: 'E', vdfs: 'E' },
    anchors: { A: { part: null, side: 'left' }, B: { part: PL_ITEM, side: 'top' }, C: { part: PL_LABEL, side: 'left' }, D: { part: PL_DESC, side: 'bottom' }, E: { part: PL_VALUE, side: 'right' } },
    sections: [['Layout', ['rg', 'cg', 'ig', 'srg', 'tw']], ['Label', ['lc', 'lfs', 'lrg']], ['Description', ['dc', 'dfs']], ['Value', ['vc', 'vfs', 'vdf', 'vdfs']]],
    matrixLabel: 'Property list values by layout',
    statesHead: 'Layouts · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Thumbnail (<Thumbnail>, img.plx-thumbnail, or span.plx-thumbnail--icon when there is no picture)
  var TH = function (n) { return 'plx-comp-thumbnail-' + n; };
  DS.registerLab('thumbnail', {
    name: 'Thumbnail', title: 'Plenix thumbnail', file: 'platform/components/Thumbnail/thumbnail.css', compPrefix: /^plx-comp-thumbnail-/,
    store: 'plenix-thumbnail-lab-tokens', sizes: [['default', 'Default (28px)', '.plx-thumbnail']],
    variants: [['image', 'An image'], ['icon', 'An icon (no image yet)']], states: STATIC,
    content: [['file', 'A file']],
    labels: { size: 'Size', variant: 'Content', state: 'State', content: 'Item' },
    defaults: { size: 'default', variant: 'image', state: 'default', content: 'file' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'ic', label: 'Icon color', css: ['color'], cat: 'color' },
      { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-icon', cat: 'icon' }
    ],
    token: function (id, size, variant) {
      var icon = variant === 'icon';
      switch (id) {
        case 'bg': return TH('background');
        case 'w': return TH('width');
        case 'h': return TH('height');
        case 'rad': return TH('radius');
        case 'ic': return icon ? TH('icon-text') : null;
        case 'is': return icon ? 'plx-comp-icon-size-sm' : null;   // the small icon size (Icon size="sm")
        default: return null;
      }
    },
    reach: function (full) { return /thumbnail-icon-/.test(full) ? 'every thumbnail without a picture' : /icon-size/.test(full) ? 'every small icon' : 'every thumbnail'; },
    every: 'every thumbnail',
    html: function (variant, size, state, extraCls) {
      if (variant === 'icon') return '<span class="plx-thumbnail plx-thumbnail--icon' + ex(extraCls) + '" aria-hidden="true">' + DS.icon('document', 'plx-icon--size-sm') + '</span>';
      return '<img class="plx-thumbnail' + ex(extraCls) + '" src="' + PlenixSource.base + 'icons/image.svg" alt="">';
    },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', w: 'B', h: 'B', ic: 'C', is: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
    sections: [['Box', ['bg', 'rad', 'w', 'h']], ['Icon', ['ic', 'is']]],
    matrixLabel: 'Thumbnail values by content',
    statesHead: 'Content · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Icon (<Icon>, span.plx-icon: a mask of the set in the current text color) in five named sizes, outline or filled.
  // A size class sets the icon's size from the system's icon size role, so each size maps to that role.
  DS.registerLab('icon', {
    name: 'Icon', title: 'Plenix icon', file: 'platform/components/Icon/icon.css', compPrefix: /^plx-comp-icon-/,
    store: 'plenix-icon-lab-tokens',
    sizes: [['xs', 'XS (12px)', '.plx-icon--size-xs'], ['sm', 'SM (16px)', '.plx-icon--size-sm'], ['md', 'MD (20px)', '.plx-icon--size-md'],
      ['lg', 'LG (24px)', '.plx-icon--size-lg'], ['xl', 'XL (48px)', '.plx-icon--size-xl']],
    variants: [['outline', 'Outline'], ['filled', 'Filled']], states: STATIC,
    content: [['folder', 'Folder'], ['star', 'Star']],
    labels: { size: 'Size', variant: 'Fill', state: 'State', content: 'Icon' },
    defaults: { size: 'md', variant: 'outline', state: 'default', content: 'folder' },
    props: [
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'icon' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'icon' }
    ],
    token: function (id, size) { return id === 'w' || id === 'h' ? 'plx-comp-icon-size-' + size : null; },
    reach: function (full) { var m = /icon-size-([a-z]+)$/.exec(full); return m ? 'every ' + m[1].toUpperCase() + ' icon' : 'every icon'; },
    every: 'every icon',
    html: function (variant, size, state, extraCls, ui) {
      return DS.icon((ui && ui.content) || 'folder', 'plx-icon--size-' + size + (variant === 'filled' ? ' plx-icon--filled' : '') + ex(extraCls));
    },
    labelSelector: null,
    parts: { w: 'A', h: 'A' },
    anchors: { A: { part: null, side: 'right' } },
    sections: [['Size', ['w', 'h']]],
    matrixLabel: 'Icon values by fill',
    statesHead: 'Fills · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
})();
