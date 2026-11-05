/* global DS */
/* Plenix master spec · the display components' labs (batch 263 on; owner: "every variant for every component to have
   navigation and design specs just like we did for the buttons"). Each description for the shared component lab
   (component-lab.js) names the component's sizes, its styles (the matrix columns), its states (the rows), its content,
   every property the lab reads with the one --plx-comp-* token that sets it, and the markup the component renders. The
   tokens come from tokenize-component.js (the Button treatment as a tool). */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var TONES = [['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger']];
  var STATIC = [['default', 'Default']];   // a display component has no interactive states

  // ---- Badge (<Badge>, span.plx-badge): a status pill in one of the six soft variants, in two sizes (owner, 2026-10-14,
  // docs/pills-and-colors.md: every pill is soft; the solid style is gone)
  var BG = function (n) { return 'plx-comp-badge-' + n; };
  var BADGE_VARIANTS = [['neutral', 'Neutral (default)'], ['success', 'Success'], ['active', 'Active'], ['waiting', 'Waiting'], ['action-required', 'Action required'], ['negative', 'Negative']];
  DS.registerLab('badge', {
    name: 'Badge', title: 'Plenix badge', file: 'platform/components/Badge/badge.css', compPrefix: /^plx-comp-badge-/,
    store: 'plenix-badge-lab-tokens',
    sizes: [['md', 'Default (20px)', '.plx-badge'], ['sm', 'Small (16px)', '.plx-badge--sm']],
    variants: BADGE_VARIANTS,
    states: STATIC,
    content: [['text', 'A word'], ['count', 'A count']],
    labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'success', state: 'default', content: 'text' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bd', label: 'Border color', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-top-color', cat: 'color' },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'h', label: 'Minimum height', css: ['min-height'], show: 'min-height', cat: 'control-height' },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
      { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' }
    ],
    token: function (id, size, variant) {
      var sm = size === 'sm';
      switch (id) {
        case 'bg': return BG(variant + '-background');
        case 'bd': return BG(variant + '-border');
        case 'fg': return BG(variant + '-text');
        case 'h': return BG(sm ? 'sm-min-height' : 'min-height');
        case 'px': return BG(sm ? 'sm-padding-inline' : 'padding-inline');
        case 'rad': return BG('radius');
        case 'fs': return BG(sm ? 'sm-font-size' : 'font-size');
        case 'fw': return BG('font-weight');
        case 'lh': return BG('line-height');
        default: return null;
      }
    },
    reach: function (full) {
      var m = /badge-(neutral|success|active|waiting|action-required|negative)-/.exec(full);
      if (m) return 'every ' + m[1].replace('-', ' ') + ' badge';
      return /badge-sm-/.test(full) ? 'every small badge' : 'every badge';
    },
    every: 'every badge',
    html: function (variant, size, state, extraCls, ui) {
      var content = (ui && ui.content) || 'text';
      return '<span class="plx-badge plx-badge--' + variant + (size === 'sm' ? ' plx-badge--sm' : '') + (extraCls ? ' ' + extraCls : '') + '">'
        + (content === 'count' ? '12' : 'Published') + '</span>';
    },
    labelSelector: null,
    parts: { bg: 'A', bd: 'A', rad: 'A', h: 'B', px: 'B', fg: 'C', fs: 'C', fw: 'C', lh: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
    sections: [['Fill', ['bg', 'bd', 'rad']], ['Size', ['h', 'px']], ['Text', ['fg', 'fs', 'fw', 'lh']]],
    matrixLabel: 'Badge values by variant',
    statesHead: 'Variants · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Counter (<Count>, span.plx-count): a plain number, or a pill in a tone (batch 264)
  var CT = function (n) { return 'plx-comp-count-' + n; };
  var PILL_TONES = [['danger', 'Danger'], ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'], ['warning', 'Warning']];
  DS.registerLab('counter', {
    name: 'Counter', title: 'Plenix counter', file: 'platform/components/Count/count.css', compPrefix: /^plx-comp-count-/,
    store: 'plenix-counter-lab-tokens', sizes: [['default', 'Default', '.plx-count']],
    variants: [['plain', 'Plain']].concat(PILL_TONES.map(function (t) { return ['pill-' + t[0], 'Pill · ' + t[1]]; })),
    states: STATIC, content: [['small', 'A small number (3)'], ['capped', 'Over its maximum (99+)']],
    labels: { size: 'Size', variant: 'Shape and tone', state: 'State', content: 'Value' },
    defaults: { size: 'default', variant: 'pill-danger', state: 'default', content: 'small' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color', extra: ['transparent'] },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
      { id: 'w', label: 'Minimum width', css: ['min-inline-size'], show: 'min-width', cat: 'size' },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
      { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' }
    ],
    token: function (id, size, variant) {
      if (variant === 'plain') return { fg: CT('plain-text'), fs: CT('plain-font-size') }[id] || null;
      var tone = variant.replace(/^pill-/, '');
      switch (id) {
        case 'bg': return CT('pill-' + tone + '-background');
        case 'fg': return CT('pill-' + tone + '-text');
        case 'h': return CT('pill-min-height');
        case 'w': return CT('pill-min-width');
        case 'px': return CT('pill-padding-inline');
        case 'rad': return CT('pill-radius');
        case 'fs': return CT('pill-font-size');
        case 'fw': return CT('pill-font-weight');
        case 'lh': return CT('pill-line-height');
        default: return null;
      }
    },
    reach: function (full) { var m = /count-pill-(neutral|info|success|warning|danger)-/.exec(full); return m ? 'every ' + m[1] + ' pill count' : /count-pill-/.test(full) ? 'every pill count' : 'every plain count'; },
    every: 'every count',
    html: function (variant, size, state, extraCls, ui) {
      var pill = variant !== 'plain', tone = variant.replace(/^pill-/, ''), capped = ui && ui.content === 'capped';
      return '<span class="plx-count plx-count--' + (pill ? 'pill plx-count--' + tone : 'plain') + (extraCls ? ' ' + extraCls : '') + '">' + (capped ? '99+' : '3') + '</span>';
    },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', h: 'B', w: 'B', px: 'B', fg: 'C', fs: 'C', fw: 'C', lh: 'C' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
    sections: [['Fill', ['bg', 'rad']], ['Size', ['h', 'w', 'px']], ['Number', ['fg', 'fs', 'fw', 'lh']]],
    matrixLabel: 'Counter values by shape and tone',
    statesHead: 'Shapes and tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Status dot (<StatusDot>, span.plx-status-dot): a small dot in a tone (batch 264)
  var SD = function (n) { return 'plx-comp-status-dot-' + n; };
  DS.registerLab('status-dot', {
    name: 'Status dot', title: 'Plenix status dot', file: 'platform/components/StatusDot/status-dot.css', compPrefix: /^plx-comp-status-dot-/,
    store: 'plenix-status-dot-lab-tokens', sizes: [['default', 'Default', '.plx-status-dot']],
    variants: TONES, states: STATIC, content: [['dot', 'The dot']],
    labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'success', state: 'default', content: 'dot' },
    props: [
      { id: 'bg', label: 'Color', css: ['background-color'], cat: 'color' },
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'icon' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'icon' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' }
    ],
    token: function (id, size, variant) { return { bg: SD(variant + '-background'), w: SD('width'), h: SD('height'), rad: SD('radius') }[id] || null; },
    reach: function (full) { var m = /status-dot-(neutral|info|success|warning|danger)-/.exec(full); return m ? 'every ' + m[1] + ' status dot' : 'every status dot'; },
    every: 'every status dot',
    html: function (variant, size, state, extraCls) { return '<span class="plx-status-dot plx-status-dot--' + variant + (extraCls ? ' ' + extraCls : '') + '" aria-hidden="true"></span>'; },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', w: 'B', h: 'B' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' } },
    sections: [['Dot', ['bg', 'w', 'h', 'rad']]],
    matrixLabel: 'Status dot values by tone',
    statesHead: 'Tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Notice (<Notice>, div.plx-notice: the tone's icon and the text on its soft surface) (batch 264)
  var NT = function (n) { return 'plx-comp-notice-' + n; };
  var NOTICE_ICON = { info: 'info-circle', success: 'circle-check', warning: 'warning', danger: 'alert' };
  DS.registerLab('notice', {
    name: 'Notice', title: 'Plenix notice', file: 'platform/components/Notice/notice.css', compPrefix: /^plx-comp-notice-/,
    store: 'plenix-notice-lab-tokens', sizes: [['default', 'Default', '.plx-notice']],
    variants: [['info', 'Info'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger']], states: STATIC,
    content: [['short', 'One line'], ['long', 'Two lines']],
    labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Text' },
    defaults: { size: 'default', variant: 'warning', state: 'default', content: 'short' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'fg', label: 'Text and icon color', css: ['color'], cat: 'color' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'gap', label: 'Gap (icon to text)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' }
    ],
    token: function (id, size, variant) { return { bg: NT(variant + '-background'), fg: NT(variant + '-text'), rad: NT('radius'), py: NT('padding-block'), px: NT('padding-inline'), gap: NT('gap'), fs: NT('font-size') }[id] || null; },
    reach: function (full) { var m = /notice-(info|success|warning|danger)-/.exec(full); return m ? 'every ' + m[1] + ' notice' : 'every notice'; },
    every: 'every notice',
    html: function (variant, size, state, extraCls, ui) {
      var text = ui && ui.content === 'long' ? 'This folder is shared with 3 people, so changes you make here show up for them right away.' : 'This folder is shared with 3 people.';
      return '<div class="plx-notice plx-notice--' + variant + (extraCls ? ' ' + extraCls : '') + '">' + DS.icon(NOTICE_ICON[variant]) + '<div class="plx-notice__text">' + text + '</div></div>';
    },
    labelSelector: '.plx-notice__text',
    parts: { bg: 'A', rad: 'A', py: 'B', px: 'B', gap: 'C', fg: 'D', fs: 'D' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: '.plx-icon', side: 'left' }, D: { part: '.plx-notice__text', side: 'bottom' } },
    sections: [['Surface', ['bg', 'rad']], ['Spacing', ['py', 'px', 'gap']], ['Text', ['fg', 'fs']]],
    matrixLabel: 'Notice values by tone',
    statesHead: 'Tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Spinner (<Spinner>, span.plx-spinner: a ring in the action color, turning) in three sizes (batch 264)
  var SP = function (n) { return 'plx-comp-spinner-' + n; };
  DS.registerLab('spinner', {
    name: 'Spinner', title: 'Plenix spinner', file: 'platform/components/Loading/loading.css', compPrefix: /^plx-comp-spinner-/,
    store: 'plenix-spinner-lab-tokens',
    sizes: [['sm', 'Small (12px)', '.plx-spinner--sm'], ['md', 'Medium (16px)', '.plx-spinner--md'], ['lg', 'Large (24px)', '.plx-spinner--lg']],
    variants: [['ring', 'Ring']], states: STATIC, content: [['ring', 'The ring']],
    labels: { size: 'Size', variant: 'Style', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'ring', state: 'default', content: 'ring' },
    props: [
      { id: 'c', label: 'Ring color', css: ['border-bottom-color', 'border-left-color', 'border-right-color'], show: 'border-left-color', cat: 'color' },
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'icon' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'icon' },
      { id: 'bw', label: 'Ring thickness', css: ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'], show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' }
    ],
    token: function (id, size) {
      switch (id) {
        case 'c': return SP('border-left-color');
        case 'w': return SP(size + '-width');
        case 'h': return SP(size + '-height');
        case 'bw': return SP(size + '-border-width');
        case 'rad': return SP('radius');
        default: return null;
      }
    },
    reach: function (full) { var m = /spinner-(sm|md|lg)-/.exec(full); return m ? 'every ' + { sm: 'small', md: 'medium', lg: 'large' }[m[1]] + ' spinner' : 'every spinner'; },
    every: 'every spinner',
    html: function (variant, size, state, extraCls) { return '<span class="plx-spinner plx-spinner--' + size + (extraCls ? ' ' + extraCls : '') + '" role="status"><span class="plx-visually-hidden">Loading</span></span>'; },
    labelSelector: null,
    parts: { c: 'A', bw: 'A', w: 'B', h: 'B', rad: 'B' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' } },
    sections: [['Ring', ['c', 'bw', 'rad']], ['Size', ['w', 'h']]],
    matrixLabel: 'Spinner values by size',
    statesHead: 'Sizes · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Progress bar (<ProgressBar>, div.plx-progress-bar: a head with the label and the value, a track and its fill in a
  // tone) in two sizes (batch 264). The fill's amount in the frames comes from the sample class .ds-sample--progress.
  var PB = function (n) { return 'plx-comp-progress-bar-' + n; };
  var FILL = '.plx-progress-bar__fill', TRACK_PB = '.plx-progress-bar__track', LABEL_PB = '.plx-progress-bar__label', VALUE_PB = '.plx-progress-bar__value';
  DS.registerLab('progress-bar', {
    name: 'Progress bar', title: 'Plenix progress bar', file: 'platform/components/ProgressBar/progress-bar.css', compPrefix: /^plx-comp-progress-bar-/,
    store: 'plenix-progress-bar-lab-tokens', sizes: [['md', 'Medium (8px)', '.plx-progress-bar--md'], ['sm', 'Small (4px)', '.plx-progress-bar--sm']],
    variants: [['info', 'Info'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger'], ['neutral', 'Neutral']], states: STATIC,
    content: [['known', 'A known amount (62%)'], ['unknown', 'Unknown (indeterminate)']],
    labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Amount' },
    defaults: { size: 'md', variant: 'info', state: 'default', content: 'known' },
    props: [
      { id: 'fill', label: 'Fill color', css: ['background-color'], part: FILL, cat: 'color' },
      { id: 'fr', label: 'Fill corner radius', css: CORNERS, show: 'border-top-left-radius', part: FILL, cat: 'radius' },
      { id: 'tb', label: 'Track color', css: ['background-color'], part: TRACK_PB, cat: 'color' },
      { id: 'th', label: 'Track height', css: ['block-size'], show: 'height', part: TRACK_PB, cat: 'size' },
      { id: 'tr', label: 'Track corner radius', css: CORNERS, show: 'border-top-left-radius', part: TRACK_PB, cat: 'radius' },
      { id: 'lc', label: 'Label color', css: ['color'], part: LABEL_PB, cat: 'color' },
      { id: 'lfs', label: 'Label font size', css: ['font-size'], part: LABEL_PB, cat: 'font-size' },
      { id: 'vc', label: 'Value color', css: ['color'], part: VALUE_PB, cat: 'color' },
      { id: 'vfs', label: 'Value font size', css: ['font-size'], part: VALUE_PB, cat: 'font-size' },
      { id: 'vff', label: 'Value font family', css: ['font-family'], part: VALUE_PB, cat: 'font' },
      { id: 'gap', label: 'Gap (head to track)', css: ['row-gap'], cat: 'space', extra: ['0'] }
    ],
    token: function (id, size, variant, state, content) {
      if (content === 'unknown' && /^v/.test(id)) return null;   // an unknown amount has no value text
      switch (id) {
        case 'fill': return PB(variant + '-fill');
        case 'fr': return PB('fill-radius');
        case 'tb': return PB('track-background');
        case 'th': return PB(size === 'sm' ? 'sm-track-height' : 'track-height');
        case 'tr': return PB('track-radius');
        case 'lc': return PB('label-text');
        case 'lfs': return PB('label-font-size');
        case 'vc': return PB('value-text');
        case 'vfs': return PB('value-font-size');
        case 'vff': return PB('value-font-family');
        case 'gap': return PB('row-gap');
        default: return null;
      }
    },
    reach: function (full) { var m = /progress-bar-(info|success|warning|danger|neutral)-fill/.exec(full); return m ? 'every ' + m[1] + ' progress bar' : /progress-bar-sm-/.test(full) ? 'every small progress bar' : 'every progress bar'; },
    every: 'every progress bar',
    html: function (variant, size, state, extraCls, ui) {
      var unknown = ui && ui.content === 'unknown';
      return '<div class="plx-progress-bar plx-progress-bar--' + size + ' plx-progress-bar--' + variant + (unknown ? ' is-indeterminate' : ' ds-sample--progress') + (extraCls ? ' ' + extraCls : '') + '">'
        + '<div class="plx-progress-bar__head"><span class="plx-progress-bar__label">Uploading 3 files</span>' + (unknown ? '' : '<span class="plx-progress-bar__value">62%</span>') + '</div>'
        + '<div class="plx-progress-bar__track" role="progressbar" aria-label="Uploading 3 files"' + (unknown ? '' : ' aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"') + '><span class="plx-progress-bar__fill"></span></div></div>';
    },
    labelSelector: LABEL_PB,
    parts: { fill: 'A', fr: 'A', tb: 'B', th: 'B', tr: 'B', lc: 'C', lfs: 'C', vc: 'D', vfs: 'D', vff: 'D', gap: 'E' },
    anchors: { A: { part: FILL, side: 'bottom' }, B: { part: TRACK_PB, side: 'right' }, C: { part: LABEL_PB, side: 'top' }, D: { part: VALUE_PB, side: 'top' }, E: { part: null, side: 'left' } },
    sections: [['Fill', ['fill', 'fr']], ['Track', ['tb', 'th', 'tr']], ['Label', ['lc', 'lfs']], ['Value', ['vc', 'vfs', 'vff']], ['Spacing', ['gap']]],
    matrixLabel: 'Progress bar values by tone',
    statesHead: 'Tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Tag (<Tag>, span.plx-tag) and Chip (<Chip>, the tag's look as a toggle) (batch 288)
  var TG = function (n) { return 'plx-comp-tag-' + n; }, CH = function (n) { return 'plx-comp-chip-' + n; };
  var tagProps = function (extra) { return [
    { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
    { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
    { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
    { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
    { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
    { id: 'gap', label: 'Gap (text to the remove button)', css: ['column-gap'], cat: 'space', extra: ['0'] },
    { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
    { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
    { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' }
  ].concat(extra || []); };
  var tagToken = function (id) {
    switch (id) {
      case 'bg': return TG('background'); case 'fg': return TG('text'); case 'h': return TG('min-height');
      case 'px': return TG('padding-inline'); case 'rad': return TG('radius'); case 'gap': return TG('gap');
      case 'fs': return TG('font-size'); case 'fw': return TG('font-weight'); case 'lh': return TG('line-height');
      case 'rmc': return TG('remove-text'); case 'rms': return TG('remove-font-size'); default: return null;
    }
  };
  var REMOVE = { id: 'rmc', label: 'Remove button color', css: ['color'], part: '.plx-tag__remove', cat: 'color' };
  var REMOVE_SIZE = { id: 'rms', label: 'Remove button text size', css: ['font-size'], part: '.plx-tag__remove', cat: 'font-size' };
  DS.registerLab('tag', {
    name: 'Tag', title: 'Plenix tag', file: 'platform/components/Tag/tag.css', compPrefix: /^plx-comp-tag-/,
    store: 'plenix-tag-lab-tokens', sizes: [['md', 'Default (20px)', '.plx-tag']],
    variants: [['plain', 'Plain'], ['removable', 'Removable'], ['renamable', 'Renamable']],
    states: [['default', 'Default'], ['hover', 'Hover (its button)'], ['focus', 'Focus (its button)']],
    content: [['word', 'A word']],
    labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'removable', state: 'default', content: 'word' },
    props: tagProps([REMOVE, REMOVE_SIZE]),
    token: function (id, size, variant, state) {
      if (id === 'rmc') return variant === 'removable' ? TG(state === 'hover' ? 'remove-hover-text' : 'remove-text') : null;
      if (id === 'rms') return variant === 'removable' ? TG('remove-font-size') : null;
      return tagToken(id);
    },
    reach: function (full) { return /-remove-/.test(full) ? 'the remove button of every tag' : /-rename-/.test(full) ? 'every renamable tag' : 'every tag (and chip)'; },
    every: 'every tag (and chip)',
    html: function (variant, size, state, extraCls) {
      var st = state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '';
      if (variant === 'renamable') return '<span class="plx-tag plx-tag--renamable' + (extraCls ? ' ' + extraCls : '') + '"><button type="button" tabindex="-1" class="plx-tag__label plx-tag__rename' + st + '" aria-label="Rename Gold">Gold</button></span>';
      return '<span class="plx-tag' + (extraCls ? ' ' + extraCls : '') + '"><span class="plx-tag__label">Gold</span>'
        + (variant === 'removable' ? '<button type="button" tabindex="-1" class="plx-tag__remove' + st + '" aria-label="Remove Gold"><span aria-hidden="true">×</span></button>' : '') + '</span>';
    },
    labelSelector: '.plx-tag__label',
    parts: { bg: 'A', rad: 'A', h: 'B', px: 'B', gap: 'B', fg: 'C', fs: 'C', fw: 'C', lh: 'C', rmc: 'D', rms: 'D' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: '.plx-tag__label', side: 'bottom' }, D: { part: '.plx-tag__remove', side: 'right' } },
    sections: [['Fill', ['bg', 'rad']], ['Size', ['h', 'px', 'gap']], ['Text', ['fg', 'fs', 'fw', 'lh']], ['Remove button', ['rmc', 'rms']]],
    matrixLabel: 'Tag values by kind and state',
    statesHead: 'Kinds and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
  DS.registerLab('chip', {
    name: 'Chip', title: 'Plenix chip', file: 'platform/components/Tag/tag.css', compPrefix: /^plx-comp-(chip|tag)-/,
    store: 'plenix-chip-lab-tokens', sizes: [['md', 'Default (20px)', '.plx-tag--chip']],
    variants: [['off', 'Not selected'], ['on', 'Selected']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus']],
    content: [['text', 'Text'], ['removable', 'Removable']],
    labels: { size: 'Size', variant: 'Selection', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'on', state: 'default', content: 'text' },
    props: tagProps([REMOVE]),
    token: function (id, size, variant, state, content) {
      if (id === 'bg') return variant === 'on' ? CH('selected-background') : state === 'hover' ? CH('hover-background') : TG('background');
      if (id === 'fg') return variant === 'on' ? CH('selected-text') : TG('text');
      if (id === 'rmc') return content === 'removable' ? (variant === 'on' ? null : TG('remove-text')) : null;
      return tagToken(id);
    },
    reach: function (full) { return /chip-selected-/.test(full) ? 'every selected chip' : /chip-hover-/.test(full) ? 'every chip while hovered' : 'every tag and chip'; },
    every: 'every tag and chip',
    html: function (variant, size, state, extraCls, ui) {
      var st = state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '', on = variant === 'on', rem = ui && ui.content === 'removable';
      var cls = 'plx-tag plx-tag--chip' + (on ? ' plx-tag--selected' : '') + (extraCls ? ' ' + extraCls : '');
      if (rem) return '<span class="' + cls + st + '"><button type="button" tabindex="-1" class="plx-tag__toggle' + st + '" aria-pressed="' + on + '">Favorites</button><button type="button" tabindex="-1" class="plx-tag__remove" aria-label="Remove Favorites"><span aria-hidden="true">×</span></button></span>';
      return '<button type="button" tabindex="-1" class="' + cls + st + '" aria-pressed="' + on + '">Favorites</button>';
    },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', h: 'B', px: 'B', gap: 'B', fg: 'C', fs: 'C', fw: 'C', lh: 'C', rmc: 'D' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' }, D: { part: '.plx-tag__remove', side: 'right' } },
    sections: [['Fill', ['bg', 'rad']], ['Size', ['h', 'px', 'gap']], ['Text', ['fg', 'fs', 'fw', 'lh']], ['Remove button', ['rmc']]],
    matrixLabel: 'Chip values by selection and state',
    statesHead: 'Selection and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
})();
