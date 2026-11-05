/* Plenix design system · library part w05B: the labs of wave 5, lane B. SplitButton, FloatingActionButton, the context
   menu and submenu, CopyButton, Details and Spotlight, each drawn in place with the markup the component renders, so
   every size, variant and state shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var icon = function (name) { return DS.icon(name); };
    var st = function (state) { return state === 'hover' ? ' is-hover ds-hover' : state === 'pressed' ? ' is-pointer-down ds-pressed' : ''; };
    // a Button as Button renders it: variant, size, an icon, a caret, icon only
    var btn = function (o) {
      var cls = 'plx-button plx-button--' + (o.variant || 'secondary') + (o.size && o.size !== 'md' ? ' plx-button--size-' + o.size : '') + (o.iconOnly ? ' plx-button--icon-only' : '') + (o.caret ? ' plx-button--caret' : '') + (o.cls ? ' ' + o.cls : '');
      return '<button type="button" tabindex="-1" class="' + cls + '"' + (o.disabled ? ' disabled' : '') + (o.iconOnly ? ' aria-label="' + (o.name || o.label) + '"' : '') + '>'
        + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + (o.iconOnly ? '' : '<span class="plx-button__label">' + o.label + '</span>')
        + (o.caret ? '<span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span>' : '') + '</button>';
    };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color'];
    var WIDTHS = ['border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width'];

    // ---- Split button (<SplitButton>): secondary and primary, three sizes, disabled
    var SB = function (n) { return 'plx-comp-split-button-' + n; };
    DS.registerLab('split-button', {
      name: 'Split button', title: 'Plenix split button', file: 'platform/components/SplitButton/split-button.css', compPrefix: /^plx-comp-split-button-/,
      store: 'plenix-split-button-lab-tokens', sizes: [['sm', 'Sm', '.plx-button--size-sm'], ['md', 'Md (default)', '.plx-split-button'], ['lg', 'Lg', '.plx-button--size-lg']],
      variants: [['secondary', 'Secondary (default)'], ['primary', 'Primary']], states: [['default', 'Default'], ['disabled', 'Disabled']],
      content: [['save', 'Save']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'primary', state: 'default', content: 'save' },
      props: [
        { id: 'mr', label: 'Main button: joined corner', css: ['border-top-right-radius', 'border-bottom-right-radius'], show: 'border-top-right-radius', part: '.plx-split-button__main', cat: 'radius' },
        { id: 'tr', label: 'Menu button: joined corner', css: ['border-top-left-radius', 'border-bottom-left-radius'], show: 'border-top-left-radius', part: '.plx-split-button__toggle', cat: 'radius' },
        { id: 'dc', label: 'Divider color', css: ['border-left-color'], part: '.plx-split-button__toggle', cat: 'color' },
        { id: 'dw', label: 'Divider width', css: ['border-left-width'], part: '.plx-split-button__toggle', cat: 'border-width' }
      ],
      token: function (id, size, variant, state) {
        var p = variant === 'primary';
        switch (id) {
          case 'mr': case 'tr': return SB('joined-radius');
          case 'dc': return p ? (state === 'disabled' ? SB('disabled-divider-color') : SB('primary-divider-color')) : null;
          case 'dw': return p ? SB('divider-width') : null;
          default: return null;
        }
      },
      reach: function (full) { return /primary|disabled/.test(full) ? 'every primary split button' : 'every split button'; },
      every: 'every split button',
      html: function (variant, size, state, extraCls) {
        var d = state === 'disabled';
        return '<div role="group" aria-label="Save" class="plx-split-button plx-split-button--' + variant + ex(extraCls) + '">'
          + btn({ variant: variant, size: size, label: 'Save', disabled: d, cls: 'plx-split-button__main' })
          + '<span class="plx-menu-anchor plx-split-button__menu">' + btn({ variant: variant, size: size, iconOnly: true, caret: true, name: 'More save options', disabled: d, cls: 'plx-split-button__toggle' }) + '</span></div>';
      },
      labelSelector: '.plx-split-button__main .plx-button__label',
      parts: { mr: 'A', tr: 'B', dc: 'B', dw: 'B' },
      anchors: { A: { part: '.plx-split-button__main', side: 'top' }, B: { part: '.plx-split-button__toggle', side: 'right' } },
      sections: [['Join', ['mr', 'tr']], ['Divider', ['dc', 'dw']]],
      matrixLabel: 'Split button values by variant and state', matrixColumnWidth: '--plx-ref-size-200px',
      statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Floating action button (<FloatingActionButton>): three sizes; primary, secondary, extended; rest, hover, pressed, disabled
    var FA = function (n) { return 'plx-comp-floating-action-button-' + n; };
    DS.registerLab('floating-action-button', {
      name: 'Floating action button', title: 'Plenix floating action button', file: 'platform/components/FloatingActionButton/floating-action-button.css', compPrefix: /^plx-comp-floating-action-button-/,
      store: 'plenix-floating-action-button-lab-tokens',
      sizes: [['sm', 'Small (40px)', '.plx-floating-action-button--sm'], ['md', 'Standard (56px, default)', '.plx-floating-action-button--md'], ['lg', 'Large (96px)', '.plx-floating-action-button--lg']],
      variants: [['primary', 'Primary (default)'], ['secondary', 'Secondary'], ['extended', 'Extended (icon and label)']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['pressed', 'Pressed'], ['disabled', 'Disabled']],
      content: [['new', 'New asset']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'extended', state: 'default', content: 'new' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Icon and label color', css: ['color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
        { id: 'h', label: 'Size (height)', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'w', label: 'Size (minimum width)', css: ['min-inline-size'], show: 'min-width', cat: 'size' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'ic', label: 'Icon size', css: ['width'], part: '.plx-floating-action-button__icon .plx-icon', cat: 'icon' },
        { id: 'ps', label: 'Padding before the icon', css: ['padding-left'], cat: 'space' },
        { id: 'pe', label: 'Padding after the label', css: ['padding-right'], cat: 'space' },
        { id: 'gap', label: 'Gap between icon and label', css: ['column-gap'], cat: 'space' },
        { id: 'fs', label: 'Label size', css: ['font-size'], cat: 'font-size' },
        { id: 'fw', label: 'Label weight', css: ['font-weight'], cat: 'font-weight' }
      ],
      token: function (id, size, variant, state) {
        var sec = variant === 'secondary', ext = variant === 'extended', off = state === 'disabled';
        var tone = sec ? 'secondary' : 'primary';
        switch (id) {
          case 'bg': return off ? FA('disabled-background') : state === 'hover' ? FA(tone + '-hover-background') : state === 'pressed' ? FA(tone + '-pressed-background') : FA(tone + '-background');
          case 'fg': return off ? FA('disabled-text') : FA(tone + '-text');
          case 'bc': return sec && !off ? FA('secondary-border') : null;
          case 'bw': return FA('border-width');
          case 'sh': return off ? null : FA('shadow');
          case 'h': return FA(size + '-size');
          case 'w': return FA(size + '-size');
          case 'rad': return FA(size + '-radius');
          case 'ic': return FA(size + '-icon-size');
          case 'ps': return ext ? FA('extended-padding-inline-start') : null;
          case 'pe': return ext ? FA('extended-padding-inline-end') : null;
          case 'gap': return ext ? FA('gap') : null;
          case 'fs': return ext ? FA('font-size') : null;
          case 'fw': return ext ? FA('font-weight') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /-(sm|md|lg)-/.exec(full); return m ? 'every ' + { sm: 'small', md: 'standard', lg: 'large' }[m[1]] + ' floating action button' : /extended|font|gap/.test(full) ? 'every extended floating action button' : 'every floating action button'; },
      every: 'every floating action button',
      html: function (variant, size, state, extraCls) {
        var ext = variant === 'extended', tone = variant === 'secondary' ? 'secondary' : 'primary';
        return '<button type="button" tabindex="-1" class="plx-floating-action-button plx-floating-action-button--' + size + ' plx-floating-action-button--' + tone + (ext ? ' plx-floating-action-button--extended' : '')
          + ' plx-floating-action-button--inline' + st(state) + ex(extraCls) + '"' + (state === 'disabled' ? ' disabled' : '') + (ext ? '' : ' aria-label="New asset"') + '>'
          + '<span class="plx-floating-action-button__icon" aria-hidden="true">' + icon(ext ? 'upload' : 'plus') + '</span>' + (ext ? '<span class="plx-floating-action-button__label">Upload</span>' : '') + '</button>';
      },
      labelSelector: '.plx-floating-action-button__icon',
      parts: { bg: 'A', fg: 'A', bc: 'A', bw: 'A', sh: 'A', h: 'B', w: 'B', rad: 'B', ic: 'C', ps: 'D', pe: 'D', gap: 'D', fs: 'D', fw: 'D' },
      anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'top' }, C: { part: '.plx-floating-action-button__icon', side: 'left' }, D: { part: '.plx-floating-action-button__label', side: 'bottom' } },
      sections: [['Surface', ['bg', 'fg', 'bc', 'bw', 'sh']], ['Size', ['h', 'w', 'rad', 'ic']], ['Extended', ['ps', 'pe', 'gap', 'fs', 'fw']]],
      matrixLabel: 'Floating action button values by variant and state', matrixColumnWidth: '--plx-ref-size-200px',
      statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Context menu (<ContextMenu>, <MenuSub>): at the pointer, at the target, with an open submenu
    var MN = function (n) { return 'plx-comp-menu-' + n; };
    var item = function (label, ic, cls) { return '<button type="button" role="menuitem" tabindex="-1" class="plx-menu__item' + (cls || '') + '">' + (ic ? '<span class="plx-menu__icon">' + icon(ic) + '</span>' : '') + '<span class="plx-menu__label">' + label + '</span></button>'; };
    DS.registerLab('context-menu', {
      name: 'Context menu', title: 'Plenix context menu', file: 'platform/components/Menu/menu.css', compPrefix: /^plx-comp-menu-/,
      store: 'plenix-context-menu-lab-tokens', sizes: [['default', 'Default', '.plx-menu']],
      variants: [['context', 'At the pointer (right-click, long press)'], ['keyboard', 'At the target (Shift+F10, Menu key)'], ['sub', 'Submenu (MenuSub)']],
      states: [['default', 'Default'], ['hover', 'Hover (the first item)']], content: [['asset', 'Asset actions']],
      labels: { size: 'Size', variant: 'Opening', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'sub', state: 'default', content: 'asset' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'ifg', label: 'Item text color', css: ['color'], part: '.plx-menu__item', cat: 'color' },
        { id: 'ihv', label: 'Item hover background', css: ['background-color'], part: '.plx-menu__item', cat: 'color' },
        { id: 'sob', label: 'Open submenu item', css: ['background-color'], part: '.plx-menu-sub__item', cat: 'color' },
        { id: 'sac', label: 'Submenu chevron color', css: ['color'], part: '.plx-menu-sub__arrow', cat: 'color' },
        { id: 'sas', label: 'Submenu chevron size', css: ['width'], part: '.plx-menu-sub__arrow .plx-icon', cat: 'icon' }
      ],
      token: function (id, size, variant, state) {
        var sub = variant === 'sub';
        switch (id) {
          case 'bg': return MN('background');
          case 'bc': return MN('border-color');
          case 'ifg': return MN('item-text');
          case 'ihv': return state === 'hover' ? MN('item-hover-background') : null;
          case 'sob': return sub ? MN('sub-open-background') : null;
          case 'sac': return sub ? MN('sub-arrow-color') : null;
          case 'sas': return sub ? MN('sub-arrow-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-sub-/.test(full) ? 'every submenu item' : 'every menu and context menu'; },
      every: 'every context menu',
      html: function (variant, size, state, extraCls) {
        var target = '<div class="ds-w05b-target' + (variant === 'keyboard' ? ' ds-w05b-target--focused' : '') + '">Cross 014</div>';
        var first = item('Rename', 'pencil', st(state));
        if (variant === 'sub') {
          var sub = '<div class="plx-menu-sub"><button type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="true" class="plx-menu__item plx-menu-sub__item is-open">'
            + '<span class="plx-menu__icon">' + icon('move') + '</span><span class="plx-menu__label">Move to</span><span class="plx-menu-sub__arrow" aria-hidden="true">' + icon('chevron-right') + '</span></button>'
            + '<div role="menu" aria-label="Move to" class="plx-menu plx-menu-sub__list">' + item('Brand kit') + item('Campaigns') + item('Archive') + '</div></div>';
          return '<div class="ds-w05b-menu"><div role="menu" aria-label="Asset actions" class="plx-menu plx-context-menu' + ex(extraCls) + '">' + first + sub + item('Delete', 'trash', ' plx-menu__item--danger') + '</div></div>';
        }
        return '<div class="ds-w05b-menu">' + target + '<div role="menu" aria-label="Asset actions" class="plx-menu plx-context-menu' + ex(extraCls) + '">' + first + item('Download', 'download-tray') + item('Delete', 'trash', ' plx-menu__item--danger') + '</div></div>';
      },
      labelSelector: '.plx-menu__label',
      parts: { bg: 'A', bc: 'A', ifg: 'B', ihv: 'B', sob: 'C', sac: 'C', sas: 'C' },
      anchors: { A: { part: null, side: 'right' }, B: { part: '.plx-menu__item', side: 'left' }, C: { part: '.plx-menu-sub__item', side: 'left' } },
      sections: [['Surface', ['bg', 'bc']], ['Items', ['ifg', 'ihv']], ['Submenu', ['sob', 'sac', 'sas']]],
      matrixLabel: 'Context menu values by opening and state', matrixColumnWidth: '--plx-ref-size-400px',
      statesHead: 'Openings and states · ' + HEAD
    });

    // ---- Copy (<CopyButton>): icon, with label, in a field; at rest and copied
    var CB = function (n) { return 'plx-comp-copy-button-' + n; };
    DS.registerLab('copy-button', {
      name: 'Copy', title: 'Plenix copy button', file: 'platform/components/CopyButton/copy-button.css', compPrefix: /^plx-comp-copy-button-/,
      store: 'plenix-copy-button-lab-tokens', sizes: [['default', 'Default', '.plx-copy-button']],
      variants: [['icon', 'Icon (default)'], ['label', 'With label'], ['field', 'In a field']], states: [['default', 'Default'], ['copied', 'Copied']],
      content: [['link', 'A share link']], labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'field', state: 'default', content: 'link' },
      props: [
        { id: 'mw', label: 'Field: widest', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'vr', label: 'Field: joined corner', css: ['border-top-right-radius', 'border-bottom-right-radius'], show: 'border-top-right-radius', part: '.plx-copy-button-field__value', cat: 'radius' },
        { id: 'br', label: 'Button: joined corner', css: ['border-top-left-radius', 'border-bottom-left-radius'], show: 'border-top-left-radius', part: '.plx-copy-button-field__button', cat: 'radius' }
      ],
      token: function (id, size, variant) {
        if (variant !== 'field') return null;
        switch (id) {
          case 'mw': return CB('field-max-width');
          case 'vr': return CB('field-joined-radius');
          case 'br': return 'plx-comp-button-joined-radius'; // the button joins the field (CopyButton passes joined start seam)
          default: return null;
        }
      },
      reach: function () { return 'every copy field'; },
      every: 'every copy button',
      html: function (variant, size, state, extraCls) {
        var done = state === 'copied';
        if (variant === 'field') {
          return '<span class="plx-copy-button-field' + ex(extraCls) + '"><input type="text" readonly tabindex="-1" value="https://plenix.lighthouseway.org/s/8f2c" aria-label="Share link" class="plx-input plx-input--data plx-copy-button-field__value">'
            + btn({ variant: 'secondary', icon: done ? 'check' : 'ed-copy', label: done ? 'Copied' : 'Copy', cls: 'plx-copy-button plx-copy-button-field__button plx-button--joined-start-seam plx-button--joined' + (done ? ' is-copied' : '') }) + '</span>';
        }
        if (variant === 'label') return btn({ variant: 'secondary', icon: done ? 'check' : 'ed-copy', label: done ? 'Copied' : 'Copy link', cls: 'plx-copy-button' + (done ? ' is-copied' : '') + ex(extraCls) });
        return '<span class="ds-w05b-inline"><span class="plx-text plx-text--data">ASSET-0142</span>' + btn({ variant: 'ghost', size: 'xs', iconOnly: true, icon: done ? 'check' : 'ed-copy', name: 'Copy ID', cls: 'plx-copy-button' + (done ? ' is-copied' : '') + ex(extraCls) }) + '</span>';
      },
      labelSelector: '.plx-button__label',
      parts: { mw: 'A', vr: 'B', br: 'C' },
      anchors: { A: { part: null, side: 'bottom' }, B: { part: '.plx-copy-button-field__value', side: 'top' }, C: { part: '.plx-copy-button-field__button', side: 'right' } },
      sections: [['Field', ['mw', 'vr', 'br']]],
      matrixLabel: 'Copy values by form and state', matrixColumnWidth: '--plx-ref-size-400px',
      statesHead: 'Forms and states · ' + HEAD
    });

    // ---- Details (<Details>): default, bordered, inline; closed, open, the summary under the pointer
    var DT = function (n) { return 'plx-comp-details-' + n; };
    DS.registerLab('details', {
      name: 'Details', title: 'Plenix details', file: 'platform/components/Details/details.css', compPrefix: /^plx-comp-details-/,
      store: 'plenix-details-lab-tokens', sizes: [['default', 'Default', '.plx-details']],
      variants: [['default', 'Default'], ['bordered', 'Bordered'], ['inline', 'Inline']], states: [['default', 'Closed (default)'], ['open', 'Open'], ['hover', 'Hover (the summary)']],
      content: [['phone', 'Why do we need your phone number?']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'bordered', state: 'open', content: 'phone' },
      props: [
        { id: 'fg', label: 'Content color', css: ['color'], cat: 'color' },
        { id: 'ff', label: 'Face', css: ['font-family'], cat: 'font' },
        { id: 'fs', label: 'Text size', css: ['font-size'], cat: 'font-size' },
        { id: 'sfg', label: 'Summary color', css: ['color'], part: '.plx-details__summary', cat: 'color' },
        { id: 'sfw', label: 'Summary weight', css: ['font-weight'], part: '.plx-details__summary', cat: 'font-weight' },
        { id: 'sgap', label: 'Gap after the chevron', css: ['column-gap'], part: '.plx-details__summary', cat: 'space' },
        { id: 'sh', label: 'Summary minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-details__summary', cat: 'control-height' },
        { id: 'shv', label: 'Summary hover background', css: ['background-color'], part: '.plx-details__summary', cat: 'color' },
        { id: 'srad', label: 'Summary corner', css: ['border-top-left-radius'], part: '.plx-details__summary', cat: 'radius' },
        { id: 'mk', label: 'Chevron size', css: ['width'], part: '.plx-details__marker .plx-icon', cat: 'icon' },
        { id: 'cmt', label: 'Space above the content', css: ['margin-top'], part: '.plx-details__content', cat: 'space' },
        { id: 'cin', label: 'Content indent', css: ['padding-left'], part: '.plx-details__content', cat: 'space' },
        { id: 'bbg', label: 'Box background', css: ['background-color'], cat: 'color' },
        { id: 'bbc', label: 'Box border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bbw', label: 'Box border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'brad', label: 'Box corner', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'bpx', label: 'Box side padding', css: ['padding-left'], part: '.plx-details__summary', cat: 'space' },
        { id: 'bpb', label: 'Space under the content', css: ['padding-bottom'], part: '.plx-details__content', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var b = variant === 'bordered', i = variant === 'inline', open = state === 'open';
        switch (id) {
          case 'fg': return DT('text');
          case 'ff': return DT('font-family');
          case 'fs': return i ? DT('inline-font-size') : DT('font-size');
          case 'sfg': return i ? (state === 'hover' ? DT('inline-summary-hover-text') : DT('inline-summary-text')) : DT('summary-text');
          case 'sfw': return i ? DT('inline-summary-font-weight') : DT('summary-font-weight');
          case 'sgap': return i ? DT('inline-summary-gap') : DT('summary-gap');
          case 'sh': return b ? DT('bordered-summary-min-height') : i ? null : DT('summary-min-height');
          case 'shv': return state === 'hover' && !i ? DT('summary-hover-background') : null;
          case 'srad': return b ? DT('bordered-summary-radius') : i ? null : DT('summary-radius');
          case 'mk': return i ? DT('inline-marker-size') : DT('marker-size');
          case 'cmt': return open && !b ? (i ? DT('inline-content-margin-block-start') : DT('content-margin-block-start')) : null;
          case 'cin': return open && !i ? (b ? DT('bordered-content-indent') : DT('content-indent')) : null;
          case 'bbg': return b ? DT('bordered-background') : null;
          case 'bbc': return b ? DT('bordered-border-color') : null;
          case 'bbw': return b ? DT('bordered-border-width') : null;
          case 'brad': return b ? DT('bordered-radius') : null;
          case 'bpx': return b ? DT('bordered-padding-inline') : null;
          case 'bpb': return b && open ? DT('bordered-padding-block') : null;
          default: return null;
        }
      },
      reach: function (full) { return /bordered/.test(full) ? 'every bordered details' : /inline/.test(full) ? 'every inline details' : 'every details'; },
      every: 'every details',
      html: function (variant, size, state, extraCls) {
        var open = state === 'open';
        return '<details class="plx-details plx-details--' + variant + ex(extraCls) + '"' + (open ? ' open' : '') + '><summary class="plx-details__summary' + (state === 'hover' ? ' ds-hover' : '') + '" tabindex="-1">'
          + '<span class="plx-details__marker" aria-hidden="true">' + DS.icon('chevron-right', 'plx-details__chevron plx-details__chevron--closed') + DS.icon('chevron-down', 'plx-details__chevron plx-details__chevron--open') + '</span>'
          + '<span class="plx-details__label">' + (variant === 'inline' ? 'Show the error' : 'Why do we need your phone number?') + '</span></summary>'
          + '<div class="plx-details__content"><p class="plx-text plx-text--body">' + (variant === 'inline' ? 'The server did not answer in 30 seconds.' : 'We text you a code when you sign in from a new device.') + '</p></div></details>';
      },
      labelSelector: '.plx-details__label',
      parts: { fg: 'A', ff: 'A', fs: 'A', sfg: 'B', sfw: 'B', sgap: 'B', sh: 'B', shv: 'B', srad: 'B', mk: 'C', cmt: 'D', cin: 'D', bbg: 'E', bbc: 'E', bbw: 'E', brad: 'E', bpx: 'B', bpb: 'D' },
      anchors: { A: { part: null, side: 'right' }, B: { part: '.plx-details__summary', side: 'top' }, C: { part: '.plx-details__marker', side: 'left' }, D: { part: '.plx-details__content', side: 'bottom' }, E: { part: null, side: 'left' } },
      sections: [['Text', ['fg', 'ff', 'fs']], ['Summary', ['sfg', 'sfw', 'sgap', 'sh', 'shv', 'srad', 'mk']], ['Content', ['cmt', 'cin']], ['Box', ['bbg', 'bbc', 'bbw', 'brad', 'bpx', 'bpb']]],
      matrixLabel: 'Details values by variant and state', matrixColumnWidth: '--plx-ref-size-400px',
      statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Spotlight (<Spotlight contained>): the cut-out, with a teaching bubble, the beacon, in a frame of its own
    var SP = function (n) { return 'plx-comp-spotlight-' + n; };
    DS.registerLab('spotlight', {
      name: 'Spotlight', title: 'Plenix spotlight', file: 'platform/components/Spotlight/spotlight.css', compPrefix: /^plx-comp-spotlight-/,
      store: 'plenix-spotlight-lab-tokens', sizes: [['default', 'Default', '.plx-spotlight']],
      variants: [['cutout', 'Element cut-out (default)'], ['bubble', 'With TeachingBubble'], ['beacon', 'Pulse beacon']], states: [['default', 'Default']],
      content: [['filters', 'The Filters button']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'cutout', state: 'default', content: 'filters' },
      props: [
        { id: 'dbg', label: 'Dim color', css: ['background-color'], part: '.plx-spotlight__dim--top', cat: 'color' },
        { id: 'dop', label: 'Dim opacity', css: ['opacity'], part: '.plx-spotlight__dim--top', cat: 'opacity' },
        { id: 'bcol', label: 'Beacon color', css: ['background-color'], part: '.plx-spotlight__beacon', cat: 'color' },
        { id: 'bsz', label: 'Beacon size', css: ['width'], part: '.plx-spotlight__beacon', cat: 'size' },
        { id: 'brc', label: 'Beacon ring color', css: BORDERS, show: 'border-top-color', part: '.plx-spotlight__beacon', cat: 'color' },
        { id: 'brw', label: 'Beacon ring width', css: WIDTHS, show: 'border-top-width', part: '.plx-spotlight__beacon', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var beacon = variant === 'beacon';
        switch (id) {
          case 'dbg': return beacon ? null : SP('dim-background');
          case 'dop': return beacon ? null : SP('dim-opacity');
          case 'bcol': return beacon ? SP('beacon-color') : null;
          case 'bsz': return beacon ? SP('beacon-size') : null;
          case 'brc': return beacon ? SP('beacon-ring-color') : null;
          case 'brw': return beacon ? SP('beacon-ring-width') : null;
          default: return null;
        }
      },
      reach: function (full) { return /beacon/.test(full) ? 'every spotlight beacon' : 'every spotlight (and every teaching bubble with its spotlight)'; },
      every: 'every spotlight',
      html: function (variant, size, state, extraCls) {
        var beacon = variant === 'beacon';
        var target = '<button type="button" tabindex="-1" data-plx-spotlight-target="" class="plx-button plx-button--secondary"><span class="plx-button__icon">' + icon('filter') + '</span><span class="plx-button__label">Filters</span></button>';
        var bubble = variant === 'bubble' ? '<div class="ds-w05b-bubble"><div class="plx-popover plx-popover--md plx-popover--arrow plx-teaching-bubble" data-plx-popover-side="bottom" data-plx-popover-align="start"><span class="plx-popover__arrow plx-popover__arrow--bottom plx-popover__arrow--inline-start" aria-hidden="true"></span>'
          + '<div class="plx-popover__body"><div class="plx-teaching-bubble__header"><h2 class="plx-teaching-bubble__title">Saved filters</h2></div><p class="plx-teaching-bubble__text">Save a set of filters and open it from here next time.</p></div></div></div>' : '';
        var layer = beacon ? '<span class="plx-spotlight__beacon"></span>' : ['top', 'bottom', 'start', 'end'].map(function (s) { return '<div class="plx-spotlight__dim plx-spotlight__dim--' + s + '"></div>'; }).join('');
        return '<div class="ds-w05b-stage" data-plx-spotlight-scope=""><p class="plx-text plx-text--body">Everything around the button is dimmed.</p>' + target + bubble
          + '<div aria-hidden="true" class="plx-spotlight plx-spotlight--' + (beacon ? 'beacon' : 'cutout') + ' plx-spotlight--contained' + ex(extraCls) + '">' + layer + '</div></div>';
      },
      labelSelector: '.plx-button__label',
      parts: { dbg: 'A', dop: 'A', bcol: 'B', bsz: 'B', brc: 'B', brw: 'B' },
      anchors: { A: { part: '.plx-spotlight__dim--top', side: 'top' }, B: { part: '.plx-spotlight__beacon', side: 'right' } },
      sections: [['Dim', ['dbg', 'dop']], ['Beacon', ['bcol', 'bsz', 'brc', 'brw']]],
      matrixLabel: 'Spotlight values by variant', matrixColumnWidth: '--plx-ref-size-400px',
      statesHead: 'Variants · ' + HEAD
    });
  })();
}
