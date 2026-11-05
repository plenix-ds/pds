/* global DS */
/* Plenix master spec · the overlays' labs (Every Variant, batch 316): Dialog, Confirmation dialog, Side drawer, Sheet and Toast,
   drawn in place (not opened over the page) so every size, intent, side and tone shows with the one --plx-comp-* token
   that sets each value. The tokens come from tokenize-component.js (dialog.css, toast.css). */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var STATIC = [['default', 'Default']];
  var DG = function (n) { return 'plx-comp-dialog-' + n; }, DR = function (n) { return 'plx-comp-drawer-' + n; }, TS = function (n) { return 'plx-comp-toast-' + n; };
  var CLOSE = '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--icon-only plx-dialog__close" aria-label="Close">' + DS.icon('close') + '</button>';
  var BTN = function (variant, label) { return '<button type="button" tabindex="-1" class="plx-button plx-button--' + variant + '">' + label + '</button>'; };
  // the parts every dialog, confirmation and drawer shares: surface, header band, body, footer band
  var shellProps = [
    { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
    { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
    { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
    { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
    { id: 'w', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
    { id: 'hbg', label: 'Header background', css: ['background-color'], part: '.plx-dialog__header', cat: 'color' },
    { id: 'hfg', label: 'Header text color', css: ['color'], part: '.plx-dialog__header', cat: 'color' },
    { id: 'hh', label: 'Header minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-dialog__header', cat: 'size' },
    { id: 'tfs', label: 'Title font size', css: ['font-size'], part: '.plx-dialog__title', cat: 'font-size' },
    { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-dialog__title', cat: 'font-weight' },
    { id: 'bpy', label: 'Body padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-dialog__body', cat: 'space', extra: ['0'] },
    { id: 'bpx', label: 'Body padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-dialog__body', cat: 'space', extra: ['0'] },
    { id: 'dfs', label: 'Description font size', css: ['font-size'], part: '.plx-dialog__description', cat: 'font-size' },
    { id: 'dfg', label: 'Description color', css: ['color'], part: '.plx-dialog__description', cat: 'color' },
    { id: 'fbg', label: 'Footer background', css: ['background-color'], part: '.plx-dialog__footer', cat: 'color' },
    { id: 'gap', label: 'Gap between actions', css: ['column-gap'], part: '.plx-dialog__footer', cat: 'space' },
    { id: 'fpx', label: 'Footer padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-dialog__footer', cat: 'space', extra: ['0'] },
    { id: 'ah', label: 'Action height', css: ['block-size'], show: 'height', part: '.plx-dialog__footer .plx-button', cat: 'control-height' }
  ];
  var shellToken = function (id, opts) {
    switch (id) {
      case 'bg': return DG('background');
      case 'fg': return DG('text');
      case 'rad': return opts.drawer ? DR('radius') : DG('radius');
      case 'sh': return DG('shadow');
      case 'w': return opts.width;
      case 'hbg': return DG('header-background');
      case 'hfg': return DG('header-text');
      case 'hh': return DG('header-min-height');
      case 'tfs': return DG('title-font-size');
      case 'tfw': return DG('title-font-weight');
      case 'bpy': return DG('body-padding-block');
      case 'bpx': return DG('body-padding-inline');
      case 'dfs': return DG('description-font-size');
      case 'dfg': return DG('description-text');
      case 'fbg': return DG('footer-background');
      case 'gap': return DG('action-gap');
      case 'fpx': return DG('footer-padding-inline');
      case 'ah': return opts.destructive ? DG('destructive-action-height') : DG('action-height');
      default: return null;
    }
  };
  var shellHtml = function (cls, title, text, actions, extraCls) {
    return '<div role="dialog" aria-label="' + title + '" class="plx-dialog ' + cls + (extraCls ? ' ' + extraCls : '') + '">'
      + '<div class="plx-dialog__header"><h2 class="plx-dialog__title">' + title + '</h2>' + CLOSE + '</div>'
      + '<div class="plx-dialog__body"><p class="plx-dialog__description">' + text + '</p></div>'
      + '<div class="plx-dialog__footer">' + actions + '</div></div>';
  };
  var shellParts = { bg: 'A', rad: 'A', sh: 'A', w: 'A', fg: 'A', hbg: 'B', hfg: 'B', hh: 'B', tfs: 'B', tfw: 'B', bpy: 'C', bpx: 'C', dfs: 'C', dfg: 'C', fbg: 'D', gap: 'D', fpx: 'D', ah: 'D' };
  var shellAnchors = { A: { part: null, side: 'left' }, B: { part: '.plx-dialog__header', side: 'top' }, C: { part: '.plx-dialog__body', side: 'right' }, D: { part: '.plx-dialog__footer', side: 'bottom' } };
  var shellSections = [['Surface', ['bg', 'fg', 'rad', 'sh', 'w']], ['Header', ['hbg', 'hfg', 'hh', 'tfs', 'tfw']], ['Body', ['bpy', 'bpx', 'dfs', 'dfg']], ['Footer', ['fbg', 'gap', 'fpx', 'ah']]];

  // ---- Dialog (<Dialog>): five widths
  var SIZES = [['sm', 'SM (400px)'], ['md', 'MD (560px)'], ['lg', 'LG (720px)'], ['xl', 'XL (900px)'], ['full', 'FULL (the whole layer)']];
  DS.registerLab('dialog', {
    name: 'Dialog', title: 'Plenix dialog', file: 'platform/components/Dialog/dialog.css', compPrefix: /^plx-comp-dialog-/,
    store: 'plenix-dialog-lab-tokens', sizes: SIZES.map(function (s) { return [s[0], s[1], '.plx-dialog--' + s[0]]; }),
    variants: [['default', 'Dialog']], states: STATIC, content: [['text', 'A message and two actions']],
    labels: { size: 'Size', variant: 'Style', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'default', state: 'default', content: 'text' },
    props: shellProps,
    token: function (id, size) { return shellToken(id, { width: size === 'full' ? null : DG(size + '-max-width') }); },
    reach: function (full) { var m = /dialog-(sm|md|lg|xl)-max-width/.exec(full); return m ? 'every ' + m[1].toUpperCase() + ' dialog' : /dialog-(action|destructive)/.test(full) ? 'every dialog footer' : 'every dialog, confirmation and drawer'; },
    every: 'every dialog, confirmation and drawer',
    html: function (variant, size, state, extraCls) {
      return shellHtml('plx-dialog--' + size, 'Rename collection', 'Give the collection a name people will recognize.', BTN('secondary', 'Cancel') + BTN('primary', 'Rename'), extraCls);
    },
    labelSelector: '.plx-dialog__title', parts: shellParts, anchors: shellAnchors, sections: shellSections,
    matrixLabel: 'Dialog values by size',
    statesHead: 'Sizes · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Confirmation dialog (<ConfirmDialog>): confirm or destructive
  DS.registerLab('confirmation-dialog', {
    name: 'Confirmation dialog', title: 'Plenix confirmation dialog', file: 'platform/components/Dialog/dialog.css', compPrefix: /^plx-comp-dialog-/,
    store: 'plenix-confirmation-dialog-lab-tokens', sizes: [['sm', 'Default (400px)', '.plx-dialog--sm']],
    variants: [['confirm', 'Confirm'], ['destructive', 'Destructive']], states: STATIC, content: [['text', 'A question and two actions']],
    labels: { size: 'Size', variant: 'Intent', state: 'State', content: 'Content' },
    defaults: { size: 'sm', variant: 'confirm', state: 'default', content: 'text' },
    props: shellProps,
    token: function (id, size, variant) { return shellToken(id, { width: DG('sm-max-width'), destructive: variant === 'destructive' }); },
    reach: function (full) { return /destructive/.test(full) ? 'every destructive confirmation' : /action-height/.test(full) ? 'every dialog footer' : 'every dialog, confirmation and drawer'; },
    every: 'every dialog, confirmation and drawer',
    html: function (variant, size, state, extraCls) {
      var d = variant === 'destructive';
      return shellHtml('plx-dialog--sm' + (d ? ' plx-dialog--destructive' : ''), d ? 'Delete 3 assets?' : 'Publish 3 assets?', d ? 'They move to the trash for 30 days, then they are gone.' : 'People with access to the collection will see them.',
        BTN('secondary', 'Cancel') + BTN(d ? 'danger' : 'primary', d ? 'Delete' : 'Publish'), extraCls);
    },
    labelSelector: '.plx-dialog__title', parts: shellParts, anchors: shellAnchors, sections: shellSections,
    matrixLabel: 'Confirmation dialog values by intent', matrixColumnWidth: '--plx-ref-size-400px',
    statesHead: 'Intents · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Side drawer (<Drawer>): three widths, at the end or the start
  DS.registerLab('side-drawer', {
    name: 'Side drawer', title: 'Plenix side drawer', file: 'platform/components/Dialog/dialog.css', compPrefix: /^plx-comp-(drawer|dialog)-/,
    store: 'plenix-side-drawer-lab-tokens',
    sizes: [['sm', 'SM (320px)', '.plx-drawer--sm'], ['md', 'MD (400px)', '.plx-drawer--md'], ['lg', 'LG (560px)', '.plx-drawer--lg']],
    variants: [['end', 'End'], ['start', 'Start']], states: STATIC, content: [['text', 'A form and two actions']],
    labels: { size: 'Size', variant: 'Side', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'end', state: 'default', content: 'text' },
    props: shellProps,
    token: function (id, size) { return shellToken(id, { width: DR(size + '-max-width'), drawer: true }); },
    reach: function (full) { var m = /drawer-(sm|md|lg)-max-width/.exec(full); return m ? 'every ' + m[1].toUpperCase() + ' drawer' : /drawer-/.test(full) ? 'every drawer' : 'every dialog, confirmation and drawer'; },
    every: 'every drawer',
    html: function (variant, size, state, extraCls) {
      // the side is the layer's (plx-modal-layer--start); drawn in place, the drawer sits at that side of its row
      return '<div class="ds-drawer-row' + (variant === 'start' ? ' plx-modal-layer--start ds-drawer-row--start' : '') + '">'
        + shellHtml('plx-drawer plx-drawer--' + size, 'Filters', 'Choose what the list shows.', BTN('secondary', 'Reset') + BTN('primary', 'Apply'), extraCls) + '</div>';
    },
    labelSelector: '.plx-dialog__title', parts: shellParts, anchors: shellAnchors, sections: shellSections,
    matrixLabel: 'Side drawer values by size and side', matrixColumnWidth: '--plx-ref-size-400px',
    statesHead: 'Sizes and sides · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Sheet (<Sheet>): the bottom sheet of a Narrow window, at its two heights, as a task (Cancel and Done) or with Close;
  // drawn in a frame the height of a phone's lower screen, so the large height shows taller than the medium one
  var SH = function (n) { return 'plx-comp-sheet-' + n; };
  DS.registerLab('sheet', {
    name: 'Sheet', title: 'Plenix sheet', file: 'platform/components/Sheet/sheet.css', compPrefix: /^plx-comp-sheet-/,
    store: 'plenix-sheet-lab-tokens',
    sizes: [['medium', 'Medium (about half the window)', '.plx-sheet--medium'], ['large', 'Large (the window less a strip)', '.plx-sheet--large']],
    variants: [['task', 'Task: Cancel and Done'], ['close', 'Close']], states: STATIC, content: [['form', 'A message and a footer']],
    labels: { size: 'Height', variant: 'Header', state: 'State', content: 'Content' },
    defaults: { size: 'medium', variant: 'task', state: 'default', content: 'form' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'rad', label: 'Top corner radius', css: ['border-top-left-radius', 'border-top-right-radius'], show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
      { id: 'band', label: 'Grabber band', css: ['padding-block-start'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'gth', label: 'Grabber target height', css: ['block-size'], show: 'height', part: '.plx-sheet__grabber', cat: 'size' },
      { id: 'gtw', label: 'Grabber target width', css: ['inline-size'], show: 'width', part: '.plx-sheet__grabber', cat: 'size' },
      { id: 'hh', label: 'Header minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-sheet__header', cat: 'size' },
      { id: 'hgap', label: 'Header gap', css: ['column-gap'], part: '.plx-sheet__header', cat: 'space' },
      { id: 'hpx', label: 'Header padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-sheet__header', cat: 'space', extra: ['0'] },
      { id: 'hbc', label: 'Header divider color', css: ['border-bottom-color'], part: '.plx-sheet__header', cat: 'color' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: '.plx-sheet__title', cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-sheet__title', cat: 'font-weight' },
      { id: 'bpy', label: 'Body padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-sheet__body', cat: 'space', extra: ['0'] },
      { id: 'bpx', label: 'Body padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-sheet__body', cat: 'space', extra: ['0'] },
      { id: 'fgap', label: 'Gap between footer actions', css: ['column-gap'], part: '.plx-sheet__footer', cat: 'space' },
      { id: 'fpx', label: 'Footer padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-sheet__footer', cat: 'space', extra: ['0'] },
      { id: 'fbc', label: 'Footer divider color', css: ['border-top-color'], part: '.plx-sheet__footer', cat: 'color' }
    ],
    token: function (id, size) {
      switch (id) {
        case 'bg': return SH('background');
        case 'fg': return SH('text');
        case 'rad': return SH('radius');
        case 'sh': return SH('shadow');
        case 'h': return SH(size + '-height');
        case 'band': return SH('band-height');
        case 'gth': return SH('grabber-target-height');
        case 'gtw': return SH('grabber-target-width');
        case 'hh': return SH('header-min-height');
        case 'hgap': return SH('header-gap');
        case 'hpx': return SH('header-padding-inline');
        case 'hbc': return SH('header-border-bottom-color');
        case 'tfs': return SH('title-font-size');
        case 'tfw': return SH('title-font-weight');
        case 'bpy': return SH('body-padding-block');
        case 'bpx': return SH('body-padding-inline');
        case 'fgap': return SH('footer-gap');
        case 'fpx': return SH('footer-padding-inline');
        case 'fbc': return SH('footer-border-top-color');
        default: return null;
      }
    },
    reach: function (full) { var m = /sheet-(medium|large)-height/.exec(full); return m ? 'every ' + m[1] + ' bottom sheet' : 'every bottom sheet'; },
    every: 'every bottom sheet',
    html: function (variant, size, state, extraCls) {
      var task = variant === 'task';
      var head = (task ? BTN('ghost plx-sheet__cancel', 'Cancel') : '') + '<h2 class="plx-sheet__title">Rename collection</h2>'
        + (task ? BTN('primary plx-sheet__done', 'Done') : '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--icon-only plx-sheet__close" aria-label="Close">' + DS.icon('close') + '</button>');
      return '<div class="ds-demo-frame ' + DS.sampleClass('block-size', 'var(--plx-ref-size-600px)') + '">'
        + '<div role="dialog" aria-label="Rename collection" class="plx-sheet plx-sheet--' + size + (task ? ' plx-sheet--task' : '') + (extraCls ? ' ' + extraCls : '') + '">'
        + '<button type="button" tabindex="-1" class="plx-sheet__grabber" aria-label="' + (size === 'medium' ? 'Expand sheet' : 'Shrink sheet') + '"></button>'
        + '<div class="plx-sheet__header">' + head + '</div>'
        + '<div class="plx-sheet__body"><p class="plx-dialog__description">Give the collection a name people will recognize.</p></div>'
        + '<div class="plx-sheet__footer">' + BTN('secondary', 'Reset') + '</div></div></div>';
    },
    labelSelector: '.plx-sheet__title',
    parts: { bg: 'A', fg: 'A', rad: 'A', sh: 'A', h: 'A', band: 'B', gth: 'B', gtw: 'B', hh: 'C', hgap: 'C', hpx: 'C', hbc: 'C', tfs: 'C', tfw: 'C', bpy: 'D', bpx: 'D', fgap: 'E', fpx: 'E', fbc: 'E' },
    anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-sheet__grabber', side: 'top' }, C: { part: '.plx-sheet__header', side: 'right' }, D: { part: '.plx-sheet__body', side: 'right' }, E: { part: '.plx-sheet__footer', side: 'bottom' } },
    sections: [['Surface', ['bg', 'fg', 'rad', 'sh', 'h']], ['Grabber', ['band', 'gth', 'gtw']], ['Header', ['hh', 'hgap', 'hpx', 'hbc', 'tfs', 'tfw']], ['Body', ['bpy', 'bpx']], ['Footer', ['fgap', 'fpx', 'fbc']]],
    matrixLabel: 'Sheet values by height and header', matrixColumnWidth: '--plx-ref-size-400px',
    statesHead: 'Heights and headers · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Toast (<ToastProvider>, toast()): four tones
  var TONE_ICON = { info: 'circle-info', success: 'circle-check', warning: 'warning', danger: 'alert' };
  DS.registerLab('toast', {
    name: 'Toast', title: 'Plenix toast', file: 'platform/components/Toast/toast.css', compPrefix: /^plx-comp-toast-/,
    store: 'plenix-toast-lab-tokens', sizes: [['default', 'Default', '.plx-toast']],
    variants: [['info', 'Info'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger']], states: STATIC,
    content: [['short', 'One line'], ['long', 'Two lines']],
    labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Message' },
    defaults: { size: 'default', variant: 'success', state: 'default', content: 'short' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'edge', label: 'Edge color (the tone)', css: ['border-inline-start-color'], show: 'border-left-color', cat: 'color' },
      { id: 'ew', label: 'Edge width', css: ['border-inline-start-width'], show: 'border-left-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'gap', label: 'Gap (icon, message, close)', css: ['column-gap'], cat: 'space' },
      { id: 'minw', label: 'Minimum width', css: ['min-inline-size'], show: 'min-width', cat: 'size' },
      { id: 'maxw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'lh', label: 'Line height', css: ['line-height'], part: '.plx-toast__message', cat: 'line-height' },
      { id: 'cw', label: 'Close button size', css: ['inline-size'], show: 'width', part: '.plx-toast__close', cat: 'size' },
      { id: 'co', label: 'Close button opacity', css: ['opacity'], part: '.plx-toast__close', cat: 'opacity' }
    ],
    token: function (id, size, variant) {
      switch (id) {
        case 'bg': return TS('background');
        case 'fg': return TS('text');
        case 'edge': return variant === 'info' ? TS('border-inline-start-color') : TS(variant + '-border-inline-start-color');
        case 'ew': return TS('border-inline-start-width');
        case 'rad': return TS('radius');
        case 'sh': return TS('shadow');
        case 'py': return TS('padding-block');
        case 'gap': return TS('gap');
        case 'minw': return TS('min-width');
        case 'maxw': return TS('max-width');
        case 'fs': return TS('font-size');
        case 'lh': return TS('message-line-height');
        case 'cw': return TS('close-width');
        case 'co': return TS('close-opacity');
        default: return null;
      }
    },
    reach: function (full) { var m = /toast-(success|warning|danger)-/.exec(full); return m ? 'every ' + m[1] + ' toast' : /toast-border-inline-start-color/.test(full) ? 'every info toast' : 'every toast'; },
    every: 'every toast',
    html: function (variant, size, state, extraCls, ui) {
      var text = ui && ui.content === 'long' ? 'Export finished: 48 assets in 3 folders, ready in your downloads.' : 'Export finished.';
      return '<div role="status" class="plx-toast plx-toast--' + variant + (extraCls ? ' ' + extraCls : '') + '"><span class="plx-toast__icon">' + DS.icon(TONE_ICON[variant]) + '</span>'
        + '<span class="plx-toast__message">' + text + '</span><button type="button" tabindex="-1" class="plx-toast__close" aria-label="Dismiss">' + DS.icon('close') + '</button></div>';
    },
    labelSelector: '.plx-toast__message',
    parts: { bg: 'A', rad: 'A', sh: 'A', minw: 'A', maxw: 'A', edge: 'B', ew: 'B', py: 'C', gap: 'C', fg: 'D', fs: 'D', lh: 'D', cw: 'E', co: 'E' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'left' }, C: { part: '.plx-toast__icon', side: 'bottom' }, D: { part: '.plx-toast__message', side: 'bottom' }, E: { part: '.plx-toast__close', side: 'right' } },
    sections: [['Surface', ['bg', 'rad', 'sh', 'minw', 'maxw']], ['Tone edge', ['edge', 'ew']], ['Spacing', ['py', 'gap']], ['Message', ['fg', 'fs', 'lh']], ['Close button', ['cw', 'co']]],
    matrixLabel: 'Toast values by tone', matrixColumnWidth: '--plx-ref-size-320px',
    statesHead: 'Tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
})();
