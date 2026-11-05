/* global DS */
/* Plenix master spec · the data labs (Every Variant, batch 333). Each description for the shared component lab
   (component-lab.js) names the component's sizes, its variants (the matrix columns), its states (the rows), its content,
   every property the lab reads with the one --plx-comp-* token that sets it, and the markup the component renders. A token
   a variant class or attribute sets on the element itself (the radio tiles' minimum width, the media card's aspect, a data
   color) is not a property here: the class sets it, not a token change. The frames (a width, a box) are the ds-data-box
   classes of ds-sample-data.css. */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var BORDER_COLORS = ['border-bottom-color', 'border-left-color', 'border-right-color', 'border-top-color'];
  var BORDER_WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
  var STATIC = [['default', 'Default']];   // a display component has no interactive states
  var cls = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
  var st = function (state) { return state === 'hover' ? ' is-hover' : ''; };
  var focusCls = function (state) { return state === 'focus' ? ' is-focus-visible' : ''; };
  var statesHead = function (what) { return what + ' · every value (click one to inspect it; the dashed outline marks the one shown below)'; };

  // ---- Metric (<Metric>, div.plx-metric: the figure (value, unit, change), the label and a description) in two sizes;
  // the variants are the change's tones
  var MT = function (n) { return 'plx-comp-metric-' + n; };
  var VALUE = '.plx-metric__value', UNIT = '.plx-metric__unit', CHANGE = '.plx-metric__change', MLABEL = '.plx-metric__label', DESC = '.plx-metric__description';
  DS.registerLab('metric', {
    name: 'Metric', title: 'Plenix metric', file: 'platform/components/Metric/metric.css', compPrefix: /^plx-comp-metric-/,
    store: 'plenix-metric-lab-tokens',
    sizes: [['md', 'Medium (default)', '.plx-metric--md'], ['lg', 'Large', '.plx-metric--lg']],
    variants: [['neutral', 'Neutral change'], ['success', 'Success change'], ['danger', 'Danger change']],
    states: STATIC,
    content: [['figure', 'A figure and its label'], ['full', 'With a unit and a description']],
    labels: { size: 'Size', variant: 'Change', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'neutral', state: 'default', content: 'figure' },
    props: [
      { id: 'vc', label: 'Value color', css: ['color'], part: VALUE, cat: 'color' },
      { id: 'vff', label: 'Value font family', css: ['font-family'], part: VALUE, cat: 'font' },
      { id: 'vfs', label: 'Value font size', css: ['font-size'], part: VALUE, cat: 'font-size' },
      { id: 'vfw', label: 'Value font weight', css: ['font-weight'], part: VALUE, cat: 'font-weight' },
      { id: 'vlh', label: 'Value line height', css: ['line-height'], part: VALUE, cat: 'line-height' },
      { id: 'uc', label: 'Unit color', css: ['color'], part: UNIT, cat: 'color' },
      { id: 'ufs', label: 'Unit font size', css: ['font-size'], part: UNIT, cat: 'font-size' },
      { id: 'cc', label: 'Change color', css: ['color'], part: CHANGE, cat: 'color' },
      { id: 'cff', label: 'Change font family', css: ['font-family'], part: CHANGE, cat: 'font' },
      { id: 'cfs', label: 'Change font size', css: ['font-size'], part: CHANGE, cat: 'font-size' },
      { id: 'fg', label: 'Gap (value, unit and change)', css: ['column-gap'], part: '.plx-metric__figure', cat: 'space', extra: ['0'] },
      { id: 'lc', label: 'Label color', css: ['color'], part: MLABEL, cat: 'color' },
      { id: 'lfs', label: 'Label font size', css: ['font-size'], part: MLABEL, cat: 'font-size' },
      { id: 'dc', label: 'Description color', css: ['color'], part: DESC, cat: 'color' },
      { id: 'dfs', label: 'Description font size', css: ['font-size'], part: DESC, cat: 'font-size' },
      { id: 'rg', label: 'Gap (figure, label and description)', css: ['row-gap'], cat: 'space', extra: ['0'] }
    ],
    token: function (id, size, variant, state, content) {
      var full = content === 'full';
      switch (id) {
        case 'vc': return MT('value-text');
        case 'vff': return MT('value-font-family');
        case 'vfs': return MT(size === 'lg' ? 'lg-value-font-size' : 'value-font-size');
        case 'vfw': return MT('value-font-weight');
        case 'vlh': return MT('value-line-height');
        case 'uc': return full ? MT('unit-text') : null;
        case 'ufs': return full ? MT('unit-font-size') : null;
        case 'cc': return MT('change-' + variant + '-text');
        case 'cff': return MT('change-font-family');
        case 'cfs': return MT('change-font-size');
        case 'fg': return MT('figure-gap');
        case 'lc': return MT('label-text');
        case 'lfs': return MT('label-font-size');
        case 'dc': return full ? MT('description-text') : null;
        case 'dfs': return full ? MT('description-font-size') : null;
        case 'rg': return MT('row-gap');
        default: return null;
      }
    },
    reach: function (full) {
      var m = /metric-change--(neutral|success|danger)-/.exec(full);
      if (m) return 'every ' + m[1] + ' change of a metric';
      return /metric-lg-/.test(full) ? 'every large metric' : 'every metric';
    },
    every: 'every metric',
    html: function (variant, size, state, extraCls, ui) {
      var full = ui && ui.content === 'full';
      return '<div class="plx-metric plx-metric--' + size + cls(extraCls) + '"><div class="plx-metric__figure"><span class="plx-metric__value">' + (full ? '92' : '1,284') + '</span>'
        + (full ? '<span class="plx-metric__unit">%</span>' : '')
        + '<span class="plx-metric__change plx-metric__change--' + variant + '">' + (variant === 'danger' ? '−4%' : '+4%') + '</span></div>'
        + '<div class="plx-metric__label">' + (full ? 'Tagged' : 'Assets added') + '</div>'
        + (full ? '<div class="plx-metric__description">Since last week</div>' : '') + '</div>';
    },
    labelSelector: VALUE,
    parts: { vc: 'A', vff: 'A', vfs: 'A', vfw: 'A', vlh: 'A', uc: 'B', ufs: 'B', cc: 'C', cff: 'C', cfs: 'C', fg: 'D', lc: 'E', lfs: 'E', dc: 'F', dfs: 'F', rg: 'G' },
    anchors: { A: { part: VALUE, side: 'top' }, B: { part: UNIT, side: 'top' }, C: { part: CHANGE, side: 'right' }, D: { part: '.plx-metric__figure', side: 'left' }, E: { part: MLABEL, side: 'right' }, F: { part: DESC, side: 'bottom' }, G: { part: null, side: 'left' } },
    sections: [['Value', ['vc', 'vff', 'vfs', 'vfw', 'vlh']], ['Unit', ['uc', 'ufs']], ['Change', ['cc', 'cff', 'cfs']], ['Label', ['lc', 'lfs']], ['Description', ['dc', 'dfs']], ['Spacing', ['fg', 'rg']]],
    matrixLabel: 'Metric values by change',
    statesHead: statesHead('Changes')
  });

  // ---- Interactive list (<RowButton>, button.plx-row-button: a whole row that is one button): a selected row, or a row
  // with a hover fill, in every state
  var RB = function (n) { return 'plx-comp-row-button-' + n; };
  DS.registerLab('interactive-list', {
    name: 'Interactive list', title: 'Plenix interactive list', file: 'platform/components/RowButton/row-button.css', compPrefix: /^plx-comp-row-button-/,
    store: 'plenix-interactive-list-lab-tokens', sizes: [['default', 'Default', '.plx-row-button']],
    variants: [['selected', 'Selected row'], ['hover', 'A hover fill']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['disabled', 'Disabled']],
    content: [['two-lines', 'A name and a line']],
    labels: { size: 'Size', variant: 'Row', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'selected', state: 'default', content: 'two-lines' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color', extra: ['transparent'] },
      { id: 'fg', label: 'Text color (disabled)', css: ['color'], cat: 'color' },
      { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
      { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space' }
    ],
    token: function (id, size, variant, state) {
      switch (id) {
        case 'bg': return variant === 'selected' ? RB('selected-background') : state === 'hover' ? RB('hover-background') : null;
        case 'fg': return state === 'disabled' ? RB('disabled-text') : null;
        case 'fo': return state === 'focus' ? RB('focus-outline-color') : null;
        case 'fow': return state === 'focus' ? RB('focus-outline-width') : null;
        case 'fof': return state === 'focus' ? RB('focus-outline-offset') : null;
        default: return null;
      }
    },
    reach: function (full) { return /-selected-/.test(full) ? 'every selected row' : /-hover-/.test(full) ? 'every row with a hover fill, while hovered' : /-focus-/.test(full) ? 'every row while focused' : 'every row button'; },
    every: 'every row button',
    html: function (variant, size, state, extraCls) {
      var c = 'plx-row-button plx-u-p-12px' + (variant === 'hover' ? ' plx-row-button--hover' : ' is-selected') + st(state) + focusCls(state);
      return '<div class="ds-data-box ds-data-box--list"><button type="button" tabindex="-1" class="' + c + cls(extraCls) + '"' + (variant === 'selected' ? ' aria-current="true"' : '') + (state === 'disabled' ? ' disabled' : '') + '>'
        + '<span class="plx-text plx-text--strong">Maya Chen</span><br><span class="plx-text plx-text--secondary">Round 3 concepts</span></button></div>';
    },
    labelSelector: '.plx-text--strong',
    parts: { bg: 'A', fg: 'B', fo: 'C', fow: 'C', fof: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-text--strong', side: 'right' }, C: { part: null, side: 'bottom' } },
    sections: [['Fill', ['bg']], ['Text', ['fg']], ['Focus', ['fo', 'fow', 'fof']]],
    matrixLabel: 'Interactive list values by row and state',
    statesHead: statesHead('Rows and states')
  });

  // ---- Activity stream (<ActivityList>, ul.plx-activity-list > li.plx-activity-list__item): a row that opens, on one
  // line or stacked; the first of two rows is measured
  var AL = function (n) { return 'plx-comp-activity-list-' + n; };
  var ITEM_T = '.plx-activity-list__title', META = '.plx-activity-list__meta', TIME = '.plx-activity-list__time', DOT = '.plx-activity-list__unread';
  DS.registerLab('activity-stream', {
    name: 'Activity stream', title: 'Plenix activity stream', file: 'platform/patterns/ActivityList/activity-list.css', compPrefix: /^plx-comp-activity-list-/,
    store: 'plenix-activity-stream-lab-tokens', sizes: [['default', 'Default', '.plx-activity-list']],
    variants: [['inline', 'One line (default)'], ['stacked', 'Stacked']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['selected', 'Selected']],
    content: [['read', 'Read'], ['unread', 'Unread']],
    labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'stacked', state: 'default', content: 'read' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color', extra: ['transparent'] },
      { id: 'bc', label: 'Divider color', css: ['border-bottom-color'], cat: 'color' },
      { id: 'bw', label: 'Divider width', css: ['border-bottom-width'], cat: 'border-width' },
      { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Padding left & right (a row that opens)', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'gap', label: 'Gap (leading, text, time)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
      { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space' },
      { id: 'ub', label: 'Unread dot color', css: ['background-color'], part: DOT, cat: 'color' },
      { id: 'uw', label: 'Unread dot width', css: ['inline-size'], show: 'width', part: DOT, cat: 'icon' },
      { id: 'uh', label: 'Unread dot height', css: ['block-size'], show: 'height', part: DOT, cat: 'icon' },
      { id: 'ur', label: 'Unread dot corner radius', css: CORNERS, show: 'border-top-left-radius', part: DOT, cat: 'radius' },
      { id: 'tg', label: 'Gap (title to meta)', css: ['column-gap'], part: '.plx-activity-list__text', cat: 'space', extra: ['0'] },
      { id: 'tc', label: 'Title color', css: ['color'], part: ITEM_T, cat: 'color' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: ITEM_T, cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight (unread)', css: ['font-weight'], part: ITEM_T, cat: 'font-weight' },
      { id: 'mc', label: 'Meta color', css: ['color'], part: META, cat: 'color' },
      { id: 'mfs', label: 'Meta font size', css: ['font-size'], part: META, cat: 'font-size' },
      { id: 'tmc', label: 'Time color', css: ['color'], part: TIME, cat: 'color' },
      { id: 'tmff', label: 'Time font family', css: ['font-family'], part: TIME, cat: 'font' },
      { id: 'tmfs', label: 'Time font size', css: ['font-size'], part: TIME, cat: 'font-size' }
    ],
    token: function (id, size, variant, state, content) {
      var unread = content === 'unread';
      switch (id) {
        case 'bg': return state === 'selected' ? AL('item-selected-background') : state === 'hover' ? AL('item-interactive-hover-background') : null;
        case 'bc': return AL('item-border-bottom-color');
        case 'bw': return AL('item-border-bottom-width');
        case 'h': return AL('item-min-height');
        case 'py': return AL('item-padding-block');
        case 'px': return AL('item-interactive-padding-inline');
        case 'gap': return AL('item-gap');
        case 'fo': return state === 'focus' ? AL('item-interactive-opener-focus-outline-color') : null;
        case 'fow': return state === 'focus' ? AL('item-interactive-opener-focus-outline-width') : null;
        case 'fof': return state === 'focus' ? AL('item-interactive-opener-focus-outline-offset') : null;
        case 'ub': return unread ? AL('unread-background') : null;
        case 'uw': return unread ? AL('unread-width') : null;
        case 'uh': return unread ? AL('unread-height') : null;
        case 'ur': return unread ? AL('unread-radius') : null;
        case 'tg': return variant === 'inline' ? AL('text-gap') : null;
        case 'tc': return AL('title-text');
        case 'tfs': return AL('title-font-size');
        case 'tfw': return unread ? AL('item-unread-title-font-weight') : null;
        case 'mc': return AL('meta-text');
        case 'mfs': return AL(variant === 'stacked' ? 'stacked-meta-font-size' : 'meta-font-size');
        case 'tmc': return AL('time-text');
        case 'tmff': return AL('time-font-family');
        case 'tmfs': return AL('time-font-size');
        default: return null;
      }
    },
    reach: function (full) {
      if (/-stacked-/.test(full)) return 'every stacked activity list';
      if (/-unread-/.test(full)) return 'every unread row';
      if (/-selected-/.test(full)) return 'every selected row';
      return /-interactive-/.test(full) ? 'every row that opens' : 'every activity list row';
    },
    every: 'every activity list row',
    html: function (variant, size, state, extraCls, ui) {
      var unread = ui && ui.content === 'unread';
      var row = function (on, title, meta, time, icon) {
        return '<li class="plx-activity-list__item is-interactive' + (on && unread ? ' is-unread' : '') + (on && state === 'selected' ? ' is-selected' : '') + (on ? st(state) + cls(extraCls) : '') + '"' + (on && state === 'selected' ? ' aria-current="true"' : '') + '>'
          + (on && unread ? '<span class="plx-activity-list__unread"><span class="plx-visually-hidden">Unread</span></span>' : '')
          + '<span class="plx-activity-list__leading">' + DS.icon(icon) + '</span>'
          + '<span class="plx-activity-list__text"><span class="plx-activity-list__title"><button type="button" tabindex="-1" class="plx-activity-list__opener' + (on ? focusCls(state) : '') + '">' + title + '</button></span>'
          + '<span class="plx-activity-list__meta">' + meta + '</span></span><time class="plx-activity-list__time">' + time + '</time></li>';
      };
      return '<div class="ds-data-box ds-data-box--list"><ul class="plx-activity-list' + (variant === 'stacked' ? ' plx-activity-list--stacked' : '') + '" aria-label="Downloads">'
        + row(true, 'PNG Images', '78 files · ~340 MB', '10:24 AM', 'file-png') + row(false, 'PDF Print-Ready', '42 files · ~280 MB', 'Yesterday', 'file-pdf') + '</ul></div>';
    },
    labelSelector: ITEM_T,
    parts: { bg: 'A', bc: 'B', bw: 'B', h: 'C', py: 'C', px: 'C', gap: 'C', fo: 'D', fow: 'D', fof: 'D', ub: 'E', uw: 'E', uh: 'E', ur: 'E', tg: 'F', tc: 'F', tfs: 'F', tfw: 'F', mc: 'G', mfs: 'G', tmc: 'H', tmff: 'H', tmfs: 'H' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'bottom' }, C: { part: null, side: 'left' }, D: { part: null, side: 'right' }, E: { part: DOT, side: 'left' }, F: { part: ITEM_T, side: 'top' }, G: { part: META, side: 'bottom' }, H: { part: TIME, side: 'top' } },
    sections: [['Row', ['bg', 'bc', 'bw', 'h', 'py', 'px', 'gap']], ['Focus', ['fo', 'fow', 'fof']], ['Unread dot', ['ub', 'uw', 'uh', 'ur']], ['Title', ['tg', 'tc', 'tfs', 'tfw']], ['Meta', ['mc', 'mfs']], ['Time', ['tmc', 'tmff', 'tmfs']]],
    matrixLabel: 'Activity stream values by layout and state',
    statesHead: statesHead('Layouts and states')
  });

  // ---- Card (<Card>, article.plx-card: a header with the title, the meta and the body): static or opens (the accent edge was removed, issue 621)
  var CD = function (n) { return 'plx-comp-card-' + n; };
  var CTITLE = '.plx-card__title', CMETA = '.plx-card__meta', CBODY = '.plx-card__body';
  DS.registerLab('card', {
    name: 'Card', title: 'Plenix card', file: 'platform/components/Card/card.css', compPrefix: /^plx-comp-card-/,
    store: 'plenix-card-lab-tokens', sizes: [['default', 'Default', '.plx-card']],
    variants: [['static', 'Static'], ['interactive', 'Opens (interactive)']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['selected', 'Selected']],
    content: [['body', 'Title, meta and body']],
    labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'interactive', state: 'default', content: 'body' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: BORDER_COLORS, show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTHS, show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-right', cat: 'space', extra: ['0'] },
      { id: 'rg', label: 'Gap (header, meta, body)', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'sh', label: 'Shadow (hover)', css: ['box-shadow'], cat: 'shadow', extra: ['none'] },
      { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
      { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space' },
      { id: 'hg', label: 'Gap (title to actions)', css: ['column-gap'], part: '.plx-card__header', cat: 'space', extra: ['0'] },
      { id: 'tc', label: 'Title color', css: ['color'], part: CTITLE, cat: 'color' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: CTITLE, cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: CTITLE, cat: 'font-weight' },
      { id: 'mc', label: 'Meta color', css: ['color'], part: CMETA, cat: 'color' },
      { id: 'mfs', label: 'Meta font size', css: ['font-size'], part: CMETA, cat: 'font-size' },
      { id: 'bdc', label: 'Body color', css: ['color'], part: CBODY, cat: 'color' },
      { id: 'bdfs', label: 'Body font size', css: ['font-size'], part: CBODY, cat: 'font-size' }
    ],
    token: function (id, size, variant, state) {
      var opens = variant !== 'static';
      switch (id) {
        case 'bg': return CD('background');
        case 'bc': return state === 'selected' ? CD('selected-border-color') : CD('border-color');
        case 'bw': return CD('border-width');
        case 'rad': return CD('radius');
        case 'py': return CD('padding-block');
        case 'px': return CD('padding-inline');
        case 'rg': return CD('row-gap');
        case 'sh': return opens && state === 'hover' ? CD('interactive-hover-shadow') : null;
        case 'fo': return opens && state === 'focus' ? CD('interactive-opener-focus-outline-color') : null;
        case 'fow': return opens && state === 'focus' ? CD('interactive-opener-focus-outline-width') : null;
        case 'fof': return opens && state === 'focus' ? CD('interactive-opener-focus-outline-offset') : null;
        case 'hg': return CD('header-gap');
        case 'tc': return CD('title-text');
        case 'tfs': return CD('title-font-size');
        case 'tfw': return CD('title-font-weight');
        case 'mc': return CD('meta-text');
        case 'mfs': return CD('meta-font-size');
        case 'bdc': return CD('body-text');
        case 'bdfs': return CD('body-font-size');
        default: return null;
      }
    },
    reach: function (full) {
      if (/card-selected-/.test(full)) return 'every selected card and media card';
      return /card-interactive-/.test(full) ? 'every card that opens' : 'every card';
    },
    every: 'every card',
    html: function (variant, size, state, extraCls) {
      var opens = variant !== 'static', sel = state === 'selected';
      var c = 'plx-card' + (opens ? ' plx-card--interactive' : '') + (sel ? ' is-selected' : '') + (opens ? st(state) : '');
      var opener = opens ? '<button type="button" tabindex="-1" class="plx-card__opener' + focusCls(state) + '"' + (sel ? ' aria-current="true"' : '') + '>Kitchen Renovation</button>' : '<span class="plx-card__opener">Kitchen Renovation</span>';
      return '<div class="ds-data-box ds-data-box--card"><article class="' + c + cls(extraCls) + '"' + '>'
        + '<div class="plx-card__header"><h3 class="plx-card__title">' + opener + '</h3></div>'
        + '<div class="plx-card__meta">Personal · 12 files</div><div class="plx-card__body">Cabinet quotes and layouts</div></article></div>';
    },
    labelSelector: CTITLE,
    parts: { bg: 'A', rad: 'A', sh: 'A', bc: 'B', bw: 'B', aw: 'B', py: 'C', px: 'C', rg: 'C', fo: 'D', fow: 'D', fof: 'D', hg: 'E', tc: 'E', tfs: 'E', tfw: 'E', mc: 'F', mfs: 'F', bdc: 'G', bdfs: 'G' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'left' }, C: { part: null, side: 'bottom' }, D: { part: null, side: 'right' }, E: { part: CTITLE, side: 'top' }, F: { part: CMETA, side: 'right' }, G: { part: CBODY, side: 'bottom' } },
    sections: [['Surface', ['bg', 'rad', 'sh']], ['Border', ['bc', 'bw']], ['Spacing', ['py', 'px', 'rg', 'hg']], ['Focus', ['fo', 'fow', 'fof']], ['Title', ['tc', 'tfs', 'tfw']], ['Meta', ['mc', 'mfs']], ['Body', ['bdc', 'bdfs']]],
    matrixLabel: 'Card values by kind and state',
    statesHead: statesHead('Kinds and states')
  });

  // ---- Selectable card (<RadioTiles>, fieldset.plx-radio-tiles: the legend and a grid of label.plx-radio-tile) in three
  // sizes (each size sets the tiles' minimum width on the group itself); the first tile is the one in the chosen state
  var RT = function (n) { return 'plx-comp-radio-tile-' + n; }, RTS = function (n) { return 'plx-comp-radio-tiles-' + n; };
  var TILE = '.plx-radio-tile', TLABEL = '.plx-radio-tile__label', TDESC = '.plx-radio-tile__description', CHECK = '.plx-radio-tile__check', LEGEND = '.plx-radio-tiles__legend', GRID = '.plx-radio-tiles__grid';
  DS.registerLab('radio-tiles', {
    name: 'Selectable card', title: 'Plenix selectable card', file: 'platform/components/RadioTiles/radio-tiles.css', compPrefix: /^plx-comp-radio-tiles?-/,
    store: 'plenix-radio-tiles-lab-tokens',
    sizes: [['md', 'Medium (default)', '.plx-radio-tiles--md'], ['sm', 'Small', '.plx-radio-tiles--sm'], ['lg', 'Large', '.plx-radio-tiles--lg']],
    variants: [['unselected', 'Not chosen'], ['selected', 'Chosen']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['disabled', 'Disabled']],
    content: [['description', 'A label and a description']],
    labels: { size: 'Size', variant: 'Choice', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'selected', state: 'default', content: 'description' },
    props: [
      { id: 'lgc', label: 'Legend color', css: ['color'], part: LEGEND, cat: 'color' },
      { id: 'lgff', label: 'Legend font family', css: ['font-family'], part: LEGEND, cat: 'font' },
      { id: 'lgfs', label: 'Legend font size', css: ['font-size'], part: LEGEND, cat: 'font-size' },
      { id: 'lgfw', label: 'Legend font weight', css: ['font-weight'], part: LEGEND, cat: 'font-weight' },
      { id: 'lgm', label: 'Gap (legend to tiles)', css: ['margin-block-end'], show: 'margin-bottom', part: LEGEND, cat: 'space', extra: ['0'] },
      { id: 'gg', label: 'Gap between tiles (across)', css: ['column-gap'], part: GRID, cat: 'space', extra: ['0'] },
      { id: 'grg', label: 'Gap between tiles (down)', css: ['row-gap'], part: GRID, cat: 'space', extra: ['0'] },
      { id: 'bg', label: 'Tile background color', css: ['background-color'], part: TILE, cat: 'color' },
      { id: 'bc', label: 'Tile border color', css: BORDER_COLORS, show: 'border-top-color', part: TILE, cat: 'color' },
      { id: 'bw', label: 'Tile border width', css: BORDER_WIDTHS, show: 'border-top-width', part: TILE, cat: 'border-width' },
      { id: 'rad', label: 'Tile corner radius', css: CORNERS, show: 'border-top-left-radius', part: TILE, cat: 'radius', extra: ['0'] },
      { id: 'py', label: 'Tile padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: TILE, cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Tile padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: TILE, cat: 'space', extra: ['0'] },
      { id: 'rg', label: 'Tile gap (preview to text)', css: ['row-gap'], part: TILE, cat: 'space', extra: ['0'] },
      { id: 'fo', label: 'Focus ring color', css: ['outline-color'], part: TILE, cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], part: TILE, cat: 'border-width' },
      { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], part: TILE, cat: 'space' },
      { id: 'op', label: 'Opacity (disabled)', css: ['opacity'], part: TILE, cat: 'opacity' },
      { id: 'trg', label: 'Gap (label to description)', css: ['row-gap'], part: '.plx-radio-tile__text', cat: 'space', extra: ['0'] },
      { id: 'lc', label: 'Label color', css: ['color'], part: TLABEL, cat: 'color' },
      { id: 'lfs', label: 'Label font size', css: ['font-size'], part: TLABEL, cat: 'font-size' },
      { id: 'lfw', label: 'Label font weight', css: ['font-weight'], part: TLABEL, cat: 'font-weight' },
      { id: 'dc', label: 'Description color', css: ['color'], part: TDESC, cat: 'color' },
      { id: 'dfs', label: 'Description font size', css: ['font-size'], part: TDESC, cat: 'font-size' },
      { id: 'cc', label: 'Check color', css: ['color'], part: CHECK, cat: 'color' },
      { id: 'cw', label: 'Check width', css: ['inline-size'], show: 'width', part: CHECK, cat: 'icon' },
      { id: 'ch', label: 'Check height', css: ['block-size'], show: 'height', part: CHECK, cat: 'icon' }
    ],
    token: function (id, size, variant, state) {
      var on = variant === 'selected';
      switch (id) {
        case 'lgc': return RTS('legend-text');
        case 'lgff': return RTS('legend-font-family');
        case 'lgfs': return RTS('legend-font-size');
        case 'lgfw': return RTS('legend-font-weight');
        case 'lgm': return RTS('legend-margin-block-end');
        case 'gg': return RTS('grid-gap');
        case 'grg': return RTS('grid-row-gap');
        case 'bg': return on ? RT('selected-background') : RT('background');
        case 'bc': return on ? RT('selected-border-color') : state === 'hover' ? RT('hover-border-color') : RT('border-color');
        case 'bw': return RT('border-width');
        case 'rad': return RT('radius');
        case 'py': return RT('padding-block');
        case 'px': return RT('padding-inline');
        case 'rg': return RT('row-gap');
        case 'fo': return state === 'focus' ? RT('input-focus-outline-color') : null;
        case 'fow': return state === 'focus' ? RT('input-focus-outline-width') : null;
        case 'fof': return state === 'focus' ? RT('input-focus-outline-offset') : null;
        case 'op': return state === 'disabled' ? RT('disabled-opacity') : null;
        case 'trg': return RT('text-row-gap');
        case 'lc': return RT('label-text');
        case 'lfs': return RT('label-font-size');
        case 'lfw': return RT('label-font-weight');
        case 'dc': return RT('description-text');
        case 'dfs': return RT('description-font-size');
        case 'cc': return RT('check-text');
        case 'cw': return RT('check-width');
        case 'ch': return RT('check-height');
        default: return null;
      }
    },
    reach: function (full) {
      if (/radio-tiles-/.test(full)) return 'every group of selectable cards';
      if (/-selected-/.test(full)) return 'every chosen tile';
      if (/-hover-/.test(full)) return 'every tile while hovered';
      if (/-focus-/.test(full)) return 'every tile while focused';
      return /-disabled-/.test(full) ? 'every disabled tile' : 'every selectable card';
    },
    every: 'every selectable card',
    html: function (variant, size, state, extraCls) {
      var on = variant === 'selected';
      var tile = function (first, chosen, label, desc) {
        var c = 'plx-radio-tile' + (chosen ? ' is-selected' : '') + (first ? st(state) + focusCls(state) + (state === 'disabled' ? ' is-disabled' : '') : '');
        return '<label class="' + c + '"><input class="plx-radio-tile__input plx-visually-hidden" type="radio" tabindex="-1" name="lab-tiles"' + (chosen ? ' checked' : '') + (first && state === 'disabled' ? ' disabled' : '') + '>'
          + '<span class="plx-radio-tile__text"><span class="plx-radio-tile__label">' + label + '</span><span class="plx-radio-tile__description">' + desc + '</span></span>'
          + '<span class="plx-radio-tile__check" aria-hidden="true">' + (chosen ? DS.icon('check', 'plx-icon--size-sm') : '') + '</span></label>';
      };
      return '<div class="ds-data-box ds-data-box--tiles"><fieldset class="plx-radio-tiles plx-radio-tiles--' + size + cls(extraCls) + '"><legend class="plx-radio-tiles__legend">Header style</legend><div class="plx-radio-tiles__grid">'
        + tile(true, on, 'Solid', 'The accent color') + tile(false, !on, 'Light', 'The page surface') + '</div></fieldset></div>';
    },
    labelSelector: TLABEL,
    parts: { lgc: 'A', lgff: 'A', lgfs: 'A', lgfw: 'A', lgm: 'A', gg: 'B', grg: 'B', bg: 'C', bc: 'C', bw: 'C', rad: 'C', py: 'D', px: 'D', rg: 'D', fo: 'E', fow: 'E', fof: 'E', op: 'E', trg: 'F', lc: 'F', lfs: 'F', lfw: 'F', dc: 'G', dfs: 'G', cc: 'H', cw: 'H', ch: 'H' },
    anchors: { A: { part: LEGEND, side: 'top' }, B: { part: GRID, side: 'bottom' }, C: { part: TILE, side: 'left' }, D: { part: TILE, side: 'bottom' }, E: { part: TILE, side: 'top' }, F: { part: TLABEL, side: 'top' }, G: { part: TDESC, side: 'bottom' }, H: { part: CHECK, side: 'right' } },
    sections: [['Legend', ['lgc', 'lgff', 'lgfs', 'lgfw', 'lgm']], ['Grid', ['gg', 'grg']], ['Tile', ['bg', 'bc', 'bw', 'rad', 'py', 'px', 'rg']], ['Focus and disabled', ['fo', 'fow', 'fof', 'op']], ['Text', ['trg', 'lc', 'lfs', 'lfw', 'dc', 'dfs']], ['Check', ['cc', 'cw', 'ch']]],
    matrixLabel: 'Selectable card values by choice and state',
    statesHead: statesHead('Choices and states')
  });

  // ---- Calendar view (<TimeGrid> with <EventChip> and <DateBadge>): an event in a list, filling its box, or opening;
  // a day's date and today's; and a small week (two days, three hours)
  var EC = function (n) { return 'plx-comp-event-chip-' + n; }, DB = function (n) { return 'plx-comp-date-badge-' + n; }, TG = function (n) { return 'plx-comp-time-grid-' + n; };
  var ETIME = '.plx-event-chip__time', ETITLE = '.plx-event-chip__title', DAY = '.plx-date-badge__day', WEEKDAY = '.plx-date-badge__weekday';
  var GHEAD = '.plx-time-grid__head', GHOUR = '.plx-time-grid__hour', GTODAY = '.plx-time-grid__day.is-today', GSLOT = '.plx-time-grid__slot';
  var isEvent = function (v) { return /^event-/.test(v); }, isDate = function (v) { return /^date-/.test(v); };
  DS.registerLab('calendar-view', {
    name: 'Calendar view', title: 'Plenix calendar view', file: 'platform/patterns/TimeGrid/time-grid.css', compPrefix: /^plx-comp-(time-grid|event-chip|date-badge)-/,
    store: 'plenix-calendar-view-lab-tokens', sizes: [['default', 'Default', '.plx-time-grid']],
    variants: [['event-list', 'Event in a list'], ['event-fill', 'Event filling its box'], ['event-open', 'Event that opens'], ['date-day', 'A day'], ['date-today', 'Today'], ['week', 'A week']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus']],
    content: [['timed', 'A title and a time']],
    labels: { size: 'Size', variant: 'Part', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'event-list', state: 'default', content: 'timed' },
    props: [
      { id: 'ebg', label: 'Event background color', css: ['background-color'], cat: 'color' },
      { id: 'efg', label: 'Event text color', css: ['color'], cat: 'color' },
      { id: 'erad', label: 'Event corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'ebw', label: 'Event edge width', css: ['border-inline-start-width'], show: 'border-left-width', cat: 'border-width' },
      { id: 'egap', label: 'Event gap (time to title)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'efs', label: 'Event font size', css: ['font-size'], cat: 'font-size' },
      { id: 'epy', label: 'Event padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'epx', label: 'Event padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-right', cat: 'space', extra: ['0'] },
      { id: 'etc', label: 'Event time color', css: ['color'], part: ETIME, cat: 'color' },
      { id: 'etff', label: 'Event time font family', css: ['font-family'], part: ETIME, cat: 'font' },
      { id: 'etfw', label: 'Event title font weight', css: ['font-weight'], part: ETITLE, cat: 'font-weight' },
      { id: 'efo', label: 'Event focus ring color', css: ['outline-color'], cat: 'color' },
      { id: 'efow', label: 'Event focus ring width', css: ['outline-width'], cat: 'border-width' },
      { id: 'efof', label: 'Event focus ring offset', css: ['outline-offset'], cat: 'space' },
      { id: 'drg', label: 'Date gap (weekday to day)', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'wc', label: 'Weekday color', css: ['color'], part: WEEKDAY, cat: 'color' },
      { id: 'wff', label: 'Weekday font family', css: ['font-family'], part: WEEKDAY, cat: 'font' },
      { id: 'wfs', label: 'Weekday font size', css: ['font-size'], part: WEEKDAY, cat: 'font-size' },
      { id: 'wfw', label: 'Weekday font weight', css: ['font-weight'], part: WEEKDAY, cat: 'font-weight' },
      { id: 'dbg', label: 'Day background color (today)', css: ['background-color'], part: DAY, cat: 'color' },
      { id: 'dc', label: 'Day color', css: ['color'], part: DAY, cat: 'color' },
      { id: 'dh', label: 'Day height', css: ['block-size'], show: 'height', part: DAY, cat: 'size' },
      { id: 'dw', label: 'Day minimum width', css: ['min-inline-size'], show: 'min-width', part: DAY, cat: 'size' },
      { id: 'drad', label: 'Day corner radius', css: CORNERS, show: 'border-top-left-radius', part: DAY, cat: 'radius' },
      { id: 'dfs', label: 'Day font size', css: ['font-size'], part: DAY, cat: 'font-size' },
      { id: 'dfw', label: 'Day font weight (today)', css: ['font-weight'], part: DAY, cat: 'font-weight' },
      { id: 'gbg', label: 'Grid background color', css: ['background-color'], cat: 'color' },
      { id: 'cbg', label: 'Head background color', css: ['background-color'], part: GHEAD, cat: 'color' },
      { id: 'cbc', label: 'Head divider color', css: ['border-block-end-color'], show: 'border-bottom-color', part: GHEAD, cat: 'color' },
      { id: 'cbw', label: 'Head divider width', css: ['border-block-end-width'], show: 'border-bottom-width', part: GHEAD, cat: 'border-width' },
      { id: 'hpy', label: 'Head padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: GHEAD, cat: 'space', extra: ['0'] },
      { id: 'hc', label: 'Hour color', css: ['color'], part: GHOUR, cat: 'color' },
      { id: 'hff', label: 'Hour font family', css: ['font-family'], part: GHOUR, cat: 'font' },
      { id: 'hfs', label: 'Hour font size', css: ['font-size'], part: GHOUR, cat: 'font-size' },
      { id: 'dyc', label: 'Day line color', css: ['border-inline-start-color'], show: 'border-left-color', part: GTODAY, cat: 'color' },
      { id: 'tbg', label: 'Today background color', css: ['background-color'], part: GTODAY, cat: 'color' },
      { id: 'sc', label: 'Hour line color', css: ['border-block-end-color'], show: 'border-bottom-color', part: GSLOT, cat: 'color' },
      { id: 'sw', label: 'Hour line width', css: ['border-block-end-width'], show: 'border-bottom-width', part: GSLOT, cat: 'border-width' }
    ],
    token: function (id, size, variant, state) {
      var opens = variant === 'event-open', today = variant === 'date-today';
      if (isEvent(variant)) {
        switch (id) {
          case 'ebg': return opens && state === 'hover' ? EC('interactive-hover-background') : EC('background');
          case 'efg': return EC('text');
          case 'erad': return EC('radius');
          case 'ebw': return EC('border-inline-start-width');
          case 'egap': return EC('gap');
          case 'efs': return EC('font-size');
          case 'epy': return EC('padding-block');
          case 'epx': return EC('padding-inline');
          case 'etc': return EC('time-text');
          case 'etff': return EC('time-font-family');
          case 'etfw': return EC('title-font-weight');
          case 'efo': return opens && state === 'focus' ? EC('interactive-focus-outline-color') : null;
          case 'efow': return opens && state === 'focus' ? EC('interactive-focus-outline-width') : null;
          case 'efof': return opens && state === 'focus' ? EC('interactive-focus-outline-offset') : null;
          default: return null;
        }
      }
      if (isDate(variant)) {
        switch (id) {
          case 'drg': return DB('row-gap');
          case 'wc': return today ? DB('today-weekday-text') : DB('weekday-text');
          case 'wff': return DB('weekday-font-family');
          case 'wfs': return DB('weekday-font-size');
          case 'wfw': return DB('weekday-font-weight');
          case 'dbg': return today ? DB('today-day-background') : null;
          case 'dc': return today ? DB('today-day-text') : DB('day-text');
          case 'dh': return DB('day-height');
          case 'dw': return DB('day-min-width');
          case 'drad': return DB('day-radius');
          case 'dfs': return DB('day-font-size');
          case 'dfw': return today ? DB('today-day-font-weight') : null;
          default: return null;
        }
      }
      switch (id) {
        case 'gbg': return TG('background');
        case 'cbg': return TG('corner-background');
        case 'cbc': return TG('corner-border-block-end-color');
        case 'cbw': return TG('corner-border-block-end-width');
        case 'hpy': return TG('head-padding-block');
        case 'hc': return TG('hour-text');
        case 'hff': return TG('hour-font-family');
        case 'hfs': return TG('hour-font-size');
        case 'dyc': return TG('day-border-inline-start-color');
        case 'tbg': return TG('day-today-background');
        case 'sc': return TG('slot-border-block-end-color');
        case 'sw': return TG('slot-border-block-end-width');
        default: return null;
      }
    },
    reach: function (full) {
      if (/event-chip-interactive-/.test(full)) return 'every event that opens';
      if (/event-chip-/.test(full)) return 'every event';
      if (/date-badge-today-/.test(full)) return 'the date of today';
      if (/date-badge-/.test(full)) return 'every date';
      return 'every calendar grid';
    },
    every: 'every calendar view',
    html: function (variant, size, state, extraCls) {
      var badge = function (wd, n, today, extra) {
        return '<span class="plx-date-badge' + (today ? ' is-today' : '') + (extra || '') + '"><span class="plx-date-badge__weekday">' + wd + '</span><span class="plx-date-badge__day">' + n + '</span>'
          + (today ? '<span class="plx-visually-hidden">Today</span>' : '') + '</span>';
      };
      if (isDate(variant)) return variant === 'date-today' ? badge('Tue', 6, true, cls(extraCls)) : badge('Wed', 7, false, cls(extraCls));
      if (variant === 'week') {
        var slots = '<div class="plx-time-grid__slot" aria-hidden="true"></div><div class="plx-time-grid__slot" aria-hidden="true"></div><div class="plx-time-grid__slot" aria-hidden="true"></div>';
        var head = function (wd, n, today) { return '<div class="plx-time-grid__head' + (today ? ' is-today' : '') + '">' + badge(wd, n, today) + '</div>'; };
        return '<div class="ds-data-box ds-data-box--week"><div class="plx-time-grid' + cls(extraCls) + '" role="group" aria-label="Week of 5 October" data-plx-hours="3" data-plx-days="2">'
          + '<div class="plx-time-grid__corner" aria-hidden="true"></div>' + head('Mon', 5, false) + head('Tue', 6, true)
          + '<div class="plx-time-grid__hours" aria-hidden="true"><div class="plx-time-grid__hour">9:00</div><div class="plx-time-grid__hour">10:00</div><div class="plx-time-grid__hour">11:00</div></div>'
          + '<div class="plx-time-grid__day" role="group" aria-label="Mon 5">' + slots + '</div>'
          + '<div class="plx-time-grid__day is-today" role="group" aria-label="Tue 6">' + slots
          + '<div class="plx-time-grid__event" data-plx-start="4" data-plx-span="6"><span class="plx-event-chip plx-event-chip--fill"><span class="plx-event-chip__time">10:00</span><span class="plx-event-chip__title">Site visit</span></span></div></div></div></div>';
      }
      var opens = variant === 'event-open', fill = variant === 'event-fill', tag = opens ? 'button' : 'span';
      var chip = '<' + tag + (opens ? ' type="button" tabindex="-1"' : '') + ' class="plx-event-chip' + (fill ? ' plx-event-chip--fill' : '') + (opens ? ' plx-event-chip--interactive' + st(state) + focusCls(state) : '') + cls(extraCls) + '">'
        + '<span class="plx-event-chip__time">' + (opens ? '14:00' : '10:00') + '</span><span class="plx-event-chip__title">' + (opens ? 'Design review' : 'Site visit') + '</span></' + tag + '>';
      return '<div class="ds-data-box ' + (fill ? 'ds-data-box--event-fill' : 'ds-data-box--event') + '">' + chip + '</div>';
    },
    labelSelector: null,
    parts: { ebg: 'A', erad: 'A', ebw: 'A', efg: 'B', efs: 'B', egap: 'B', epy: 'B', epx: 'B', etc: 'C', etff: 'C', etfw: 'D', efo: 'E', efow: 'E', efof: 'E',
      drg: 'F', wc: 'F', wff: 'F', wfs: 'F', wfw: 'F', dbg: 'G', dc: 'G', dh: 'G', dw: 'G', drad: 'G', dfs: 'G', dfw: 'G',
      gbg: 'H', cbg: 'I', cbc: 'I', cbw: 'I', hpy: 'I', hc: 'J', hff: 'J', hfs: 'J', dyc: 'K', tbg: 'K', sc: 'L', sw: 'L' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'bottom' }, C: { part: ETIME, side: 'left' }, D: { part: ETITLE, side: 'right' }, E: { part: null, side: 'right' },
      F: { part: WEEKDAY, side: 'top' }, G: { part: DAY, side: 'right' }, H: { part: null, side: 'left' }, I: { part: GHEAD, side: 'top' }, J: { part: GHOUR, side: 'left' },
      K: { part: GTODAY, side: 'right' }, L: { part: GSLOT, side: 'bottom' } },
    sections: [['Event', ['ebg', 'efg', 'erad', 'ebw', 'egap', 'efs', 'epy', 'epx']], ['Event text', ['etc', 'etff', 'etfw']], ['Event focus', ['efo', 'efow', 'efof']],
      ['Weekday', ['drg', 'wc', 'wff', 'wfs', 'wfw']], ['Day', ['dbg', 'dc', 'dh', 'dw', 'drad', 'dfs', 'dfw']],
      ['Grid', ['gbg', 'cbg', 'cbc', 'cbw', 'hpy']], ['Hours and days', ['hc', 'hff', 'hfs', 'dyc', 'tbg', 'sc', 'sw']]],
    matrixLabel: 'Calendar view values by part and state',
    statesHead: statesHead('Parts and states')
  });

  // ---- Media card (<MediaCard>, article.plx-media-card: the media (an icon here), the selection box, the title and the
  // meta): selectable, chosen (4:3) or not (square), in every state. The aspect comes from data-plx-aspect.
  var MC = function (n) { return 'plx-comp-media-card-' + n; };
  var MEDIA = '.plx-media-card__media', SELECT = '.plx-media-card__select', INFO = '.plx-media-card__info', MTITLE = '.plx-media-card__title', MMETA = '.plx-media-card__meta';
  DS.registerLab('media-card', {
    name: 'Media card', title: 'Plenix media card', file: 'platform/components/Card/card.css', compPrefix: /^plx-comp-(media-card|card-selected)-/,
    store: 'plenix-media-card-lab-tokens', sizes: [['default', 'Default', '.plx-media-card']],
    variants: [['selected', 'Selected'], ['square', 'Square']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus']],
    content: [['icon', 'An icon (no image yet)']],
    labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'selected', state: 'default', content: 'icon' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: BORDER_COLORS, show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTHS, show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
      { id: 'fow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
      { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space' },
      { id: 'mbg', label: 'Media background color', css: ['background-color'], part: MEDIA, cat: 'color' },
      { id: 'pc', label: 'Placeholder icon color', css: ['color'], part: '.plx-media-card__placeholder', cat: 'color' },
      { id: 'sac', label: 'Selection box color', css: ['accent-color'], part: SELECT, cat: 'color' },
      { id: 'sw', label: 'Selection box width', css: ['inline-size'], show: 'width', part: SELECT, cat: 'icon' },
      { id: 'sh', label: 'Selection box height', css: ['block-size'], show: 'height', part: SELECT, cat: 'icon' },
      { id: 'sit', label: 'Selection box inset (top)', css: ['inset-block-start'], show: 'top', part: SELECT, cat: 'space' },
      { id: 'sil', label: 'Selection box inset (start)', css: ['inset-inline-start'], show: 'left', part: SELECT, cat: 'space' },
      { id: 'ig', label: 'Info gap (text to actions)', css: ['column-gap'], part: INFO, cat: 'space', extra: ['0'] },
      { id: 'ipy', label: 'Info padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: INFO, cat: 'space', extra: ['0'] },
      { id: 'ipx', label: 'Info padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: INFO, cat: 'space', extra: ['0'] },
      { id: 'trg', label: 'Gap (title to meta)', css: ['row-gap'], part: '.plx-media-card__text', cat: 'space', extra: ['0'] },
      { id: 'tc', label: 'Title color', css: ['color'], part: MTITLE, cat: 'color' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: MTITLE, cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: MTITLE, cat: 'font-weight' },
      { id: 'mc', label: 'Meta color', css: ['color'], part: MMETA, cat: 'color' },
      { id: 'mff', label: 'Meta font family', css: ['font-family'], part: MMETA, cat: 'font' },
      { id: 'mfs', label: 'Meta font size', css: ['font-size'], part: MMETA, cat: 'font-size' }
    ],
    token: function (id, size, variant, state) {
      switch (id) {
        case 'bg': return MC('background');
        case 'bc': return variant === 'selected' ? 'plx-comp-card-selected-border-color' : MC('border-color');
        case 'bw': return MC('border-width');
        case 'rad': return MC('radius');
        case 'fo': return state === 'focus' ? MC('card-opener-focus-outline-color') : null;
        case 'fow': return state === 'focus' ? MC('card-opener-focus-outline-width') : null;
        case 'fof': return state === 'focus' ? MC('card-opener-focus-outline-offset') : null;
        case 'mbg': return MC('media-background');
        case 'pc': return MC('placeholder-text');
        case 'sac': return MC('select-accent-color');
        case 'sw': return MC('select-width');
        case 'sh': return MC('select-height');
        case 'sit': return MC('select-inset-block-start');
        case 'sil': return MC('select-inset-inline-start');
        case 'ig': return MC('info-gap');
        case 'ipy': return MC('info-padding-block');
        case 'ipx': return MC('info-padding-inline');
        case 'trg': return MC('text-row-gap');
        case 'tc': return MC('title-text');
        case 'tfs': return MC('title-font-size');
        case 'tfw': return MC('title-font-weight');
        case 'mc': return MC('meta-text');
        case 'mff': return MC('meta-font-family');
        case 'mfs': return MC('meta-font-size');
        default: return null;
      }
    },
    reach: function (full) {
      if (/card-selected-/.test(full)) return 'every selected card and media card';
      if (/-select-/.test(full)) return 'the selection box of every selectable media card';
      return /-focus-/.test(full) ? 'every media card while focused' : 'every media card';
    },
    every: 'every media card',
    html: function (variant, size, state, extraCls) {
      var sel = variant === 'selected', sq = variant === 'square', name = sq ? 'Catalog.pdf' : 'Cross 014.png';
      var c = 'plx-media-card plx-media-card--interactive plx-media-card--selectable' + (sel ? ' is-selected' : '') + st(state);
      return '<div class="ds-data-box ds-data-box--media"><article class="' + c + cls(extraCls) + '">'
        + '<div class="plx-media-card__media" data-plx-aspect="' + (sq ? '1/1' : '4/3') + '"><span class="plx-media-card__placeholder">' + DS.icon(sq ? 'file-pdf' : 'image-b', 'plx-icon--size-lg') + '</span></div>'
        + '<input type="checkbox" tabindex="-1" class="plx-media-card__select"' + (sel ? ' checked' : '') + ' aria-label="Select ' + name + '">'
        + '<div class="plx-media-card__info"><div class="plx-media-card__text"><button type="button" tabindex="-1" class="plx-media-card__title' + focusCls(state) + '">' + name + '</button>'
        + '<span class="plx-media-card__meta">' + (sq ? 'PDF · 4.1 MB' : 'PNG · 1.2 MB') + '</span></div></div></article></div>';
    },
    labelSelector: MTITLE,
    parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', fo: 'B', fow: 'B', fof: 'B', mbg: 'C', pc: 'C', sac: 'D', sw: 'D', sh: 'D', sit: 'D', sil: 'D', ig: 'E', ipy: 'E', ipx: 'E', trg: 'E', tc: 'F', tfs: 'F', tfw: 'F', mc: 'G', mff: 'G', mfs: 'G' },
    anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'bottom' }, C: { part: MEDIA, side: 'top' }, D: { part: SELECT, side: 'left' }, E: { part: INFO, side: 'left' }, F: { part: MTITLE, side: 'right' }, G: { part: MMETA, side: 'bottom' } },
    sections: [['Surface', ['bg', 'bc', 'bw', 'rad']], ['Focus', ['fo', 'fow', 'fof']], ['Media', ['mbg', 'pc']], ['Selection box', ['sac', 'sw', 'sh', 'sit', 'sil']], ['Info', ['ig', 'ipy', 'ipx', 'trg']], ['Title', ['tc', 'tfs', 'tfw']], ['Meta', ['mc', 'mff', 'mfs']]],
    matrixLabel: 'Media card values by variant and state',
    statesHead: statesHead('Variants and states')
  });
})();
