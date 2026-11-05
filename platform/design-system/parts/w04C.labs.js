/* Plenix design system · library part w04C: the labs of the status icon, Banner, the color swatch (its own page, with the
   label) and the swatch picker, Scrim, LoadingOverlay, Time and the undo pattern. The color swatch's lab (more-labs.js)
   is registered again with the label, and the toast's lab (overlay-labs.js) with the action. Each value with the one token
   behind it: the components' own token files (platform/tokens/components/status-icon, banner, color-swatch, scrim,
   loading-overlay, time). */
if (window.DS && DS.registerLab) {
  (function () {
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var STATIC = [['default', 'Default']];
    var ex = function (c) { return c ? ' ' + c : ''; };
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var TONES = [['info', 'Info (default)'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger'], ['neutral', 'Neutral']];
    var TONE_ICON = { info: 'circle-info', success: 'circle-check', warning: 'warning', danger: 'alert', neutral: 'circle-info' };
    var TONE_WORD = { info: 'Information', success: 'Success', warning: 'Warning', danger: 'Error', neutral: 'Note' };
    var ring = function (part) { return [
      { id: 'oc', label: 'Focus ring color', css: ['outline-color'], part: part, cat: 'color' },
      { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], part: part, cat: 'space' },
      { id: 'ow', label: 'Focus ring width', css: ['outline-width'], part: part, cat: 'border-width' }
    ]; };
    var button = function (label, cls) { return '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-' + (cls || 'sm') + '"><span class="plx-button__label">' + label + '</span></button>'; };
    var REGION = '<div class="plx-stack plx-stack--gap-xs"><span class="plx-text">Cross 014.png</span><span class="plx-text">Border gold.svg</span><span class="plx-text">Banner icon 03.png</span></div>';

    // ---- Status icon (<StatusIcon>, span.plx-status-icon): a tone's icon in its color, three sizes, an optional label
    var SI = function (n) { return 'plx-comp-status-icon-' + n; };
    var statusHtml = function (tone, size, label, extraCls) {
      return '<span class="plx-status-icon plx-status-icon--' + tone + ' plx-status-icon--' + size + ex(extraCls) + '"><span class="plx-status-icon__glyph plx-status-icon__glyph--' + tone + '">' + DS.icon(TONE_ICON[tone], 'plx-icon--size-' + size, label ? undefined : TONE_WORD[tone]) + '</span>' + (label ? '<span class="plx-status-icon__label">' + label + '</span>' : '') + '</span>';
    };
    DS.registerLab('status-icon', {
      name: 'Status icon', title: 'Plenix status icon', file: 'platform/components/Icon/status-icon.css', compPrefix: /^plx-comp-status-icon-/,
      store: 'plenix-status-icon-lab-tokens',
      sizes: [['md', 'MD (default, 20px)', '.plx-status-icon--md'], ['sm', 'SM (16px)', '.plx-status-icon--sm'], ['lg', 'LG (24px)', '.plx-status-icon--lg']],
      variants: TONES, states: STATIC, content: [['icon', 'The icon alone'], ['label', 'With a label']],
      labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'info', state: 'default', content: 'icon' },
      props: [
        { id: 'fg', label: 'Icon color', css: ['background-color'], part: '.plx-status-icon__glyph>.plx-icon', cat: 'color' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-status-icon__glyph>.plx-icon', cat: 'icon' },
        { id: 'gap', label: 'Gap (icon to label)', css: ['column-gap'], cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        switch (id) {
          case 'fg': return SI(variant + '-color');
          case 'is': return 'plx-comp-icon-size-' + size; // StatusIcon draws Icon at its named size
          case 'gap': return content === 'label' ? SI('gap') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /status-icon-(info|success|warning|danger|neutral)-/.exec(full); return m ? 'every ' + m[1] + ' status icon' : /-(sm|md|lg)-/.test(full) ? 'every status icon of that size' : 'every status icon with a label'; },
      every: 'every status icon',
      html: function (variant, size, state, extraCls, ui) { return statusHtml(variant, size, ui && ui.content === 'label' ? { info: 'Shared', success: 'Synced', warning: '2 files skipped', danger: 'Upload failed', neutral: 'Draft' }[variant] : null, extraCls); },
      labelSelector: '.plx-status-icon__label',
      parts: { fg: 'A', is: 'A', gap: 'B' },
      anchors: { A: { part: '.plx-status-icon__glyph>.plx-icon', side: 'top' }, B: { part: null, side: 'bottom' } },
      sections: [['Icon', ['fg', 'is']], ['Label', ['gap']]],
      matrixLabel: 'Status icon values by tone',
      statesHead: 'Tones · ' + HEAD
    });

    // ---- Banner (<Banner>, div.plx-banner): five tones, at the top of a page or a pane, with a title, Dismiss or actions
    var BN = function (n) { return 'plx-comp-banner-' + n; };
    var MSG = { info: ['Shared folder.', 'Everyone in Design can see and edit Crosses.'], success: ['Back online.', 'Your changes are syncing again.'], warning: ['Your plan ends in 3 days.', 'Renew it to keep your sharing links active.'],
      danger: ['The library could not sync.', 'Changes are kept on this device until it can.'], neutral: ['Read-only.', 'You are viewing the version of Oct 8.'] };
    DS.registerLab('banner', {
      name: 'Banner', title: 'Plenix banner', file: 'platform/components/Banner/banner.css', compPrefix: /^plx-comp-banner-/,
      store: 'plenix-banner-lab-tokens', sizes: [['page', 'Page top (default)', '.plx-banner--page'], ['pane', 'Inside a pane', '.plx-banner--pane']],
      variants: TONES, states: STATIC,
      content: [['message', 'A message'], ['title', 'A title and a message'], ['dismissible', 'Dismissible'], ['actions', 'With actions']],
      labels: { size: 'Placement', variant: 'Tone', state: 'State', content: 'Content' },
      defaults: { size: 'page', variant: 'warning', state: 'default', content: 'title' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'edge', label: 'Edge color (under it)', css: ['border-block-end-color'], show: 'border-bottom-color', cat: 'color' },
        { id: 'ew', label: 'Edge width', css: ['border-block-end-width'], show: 'border-bottom-width', cat: 'border-width' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
        { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
        { id: 'gap', label: 'Gap (icon, message, actions)', css: ['column-gap'], cat: 'space' },
        { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
        { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' },
        { id: 'bgap', label: 'Gap (title to message)', css: ['column-gap'], part: '.plx-banner__body', cat: 'space' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-banner__title', cat: 'font-weight' },
        { id: 'agap', label: 'Gap between actions', css: ['column-gap'], part: '.plx-banner__actions', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        switch (id) {
          case 'bg': return BN(variant + '-background');
          case 'fg': return BN(variant + '-text');
          case 'edge': return BN(variant + '-border');
          case 'ew': return BN('border-width');
          case 'py': return BN('padding-block');
          case 'px': return BN(size + '-padding-inline');
          case 'gap': return BN('gap');
          case 'fs': return BN('font-size');
          case 'lh': return BN('line-height');
          case 'bgap': return BN('body-gap');
          case 'tw': return content === 'title' || content === 'actions' ? BN('title-font-weight') : null;
          case 'agap': return content === 'actions' ? BN('actions-gap') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /banner-(info|success|warning|danger|neutral)-/.exec(full); return m ? 'every ' + m[1] + ' banner' : /-(page|pane)-/.test(full) ? 'every banner placed that way' : 'every banner'; },
      every: 'every banner',
      html: function (variant, size, state, extraCls, ui) {
        var c = (ui && ui.content) || 'title', m = MSG[variant];
        var title = c === 'title' || c === 'actions';
        return '<div class="ds-w04c-frame ds-w04c-frame--wide"><div role="' + (variant === 'danger' ? 'alert' : 'status') + '" class="plx-banner plx-banner--' + variant + ' plx-banner--' + size + ex(extraCls) + '">'
          + '<span class="plx-banner__icon">' + statusHtml(variant, 'md', null) + '</span>'
          + '<div class="plx-banner__body">' + (title ? '<strong class="plx-banner__title">' + m[0] + '</strong>' : '') + '<span class="plx-banner__text">' + m[1] + '</span></div>'
          + (c === 'actions' ? '<div class="plx-banner__actions">' + button('Retry') + button('Details') + '</div>' : '')
          + (c === 'dismissible' ? '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-button--icon-only plx-banner__dismiss" aria-label="Dismiss"><span class="plx-button__icon">' + DS.icon('close') + '</span></button>' : '')
          + '</div></div>';
      },
      labelSelector: '.plx-banner__text',
      parts: { bg: 'A', edge: 'A', ew: 'A', fg: 'B', fs: 'B', lh: 'B', py: 'C', px: 'C', gap: 'C', bgap: 'D', tw: 'D', agap: 'E' },
      anchors: { A: { part: null, side: 'bottom' }, B: { part: '.plx-banner__text', side: 'bottom' }, C: { part: '.plx-banner__icon', side: 'left' }, D: { part: '.plx-banner__body', side: 'top' }, E: { part: '.plx-banner__actions', side: 'right' } },
      sections: [['Tone', ['bg', 'fg', 'edge', 'ew']], ['Spacing', ['py', 'px', 'gap']], ['Message', ['fs', 'lh', 'bgap', 'tw']], ['Actions', ['agap']]],
      matrixLabel: 'Banner values by tone', matrixColumnWidth: '--plx-ref-size-560px',
      statesHead: 'Tones · ' + HEAD
    });

    // ---- Color swatch (its own page): the swatch's lab (more-labs.js) with the label added; the color-swatch lab gets it too
    var CS = function (n) { return 'plx-comp-color-swatch-' + n; };
    var SWATCH = DS.labs && DS.labs['color-swatch'];
    if (SWATCH) {
      var LABEL_PROPS = [
        { id: 'lfg', label: 'Label color', css: ['color'], cat: 'color' },
        { id: 'lgap', label: 'Gap (swatch to label)', css: ['column-gap'], cat: 'space' },
        { id: 'lfs', label: 'Label font size', css: ['font-size'], cat: 'font-size' },
        { id: 'llh', label: 'Label line height', css: ['line-height'], cat: 'line-height' },
        { id: 'lmh', label: 'Minimum height (as a button)', css: ['min-block-size'], show: 'min-height', cat: 'size' }
      ];
      var withLabel = function (base) {
        return {
          variants: base.variants.concat([['labeled', 'With label']]),
          props: base.props.concat(LABEL_PROPS),
          token: function (id, size, variant, state, content) {
            var label = variant === 'labeled';
            switch (id) {
              case 'lfg': return label ? CS('label-text') : null;
              case 'lgap': return label ? CS('label-gap') : null;
              case 'lfs': return label ? CS('label-font-size') : null;
              case 'llh': return label ? CS('label-line-height') : null;
              case 'lmh': return label ? CS('label-min-height') : null;
              case 'w': case 'h': case 'bc': case 'bw': case 'rad': case 'sh': return label ? null : base.token(id, size, variant, state, content);
              default: return base.token(id, size, label ? 'square' : variant, state, content);
            }
          },
          html: function (variant, size, state, extraCls, ui) {
            if (variant !== 'labeled') return base.html(variant, size, state, extraCls, ui);
            return '<button type="button" tabindex="-1" class="plx-color-swatch-label' + (state === 'focus' ? ' is-focus-visible' : '') + ex(extraCls) + '" aria-pressed="' + (state === 'selected') + '">'
              + '<span class="plx-color-swatch plx-color-swatch--' + size + '" data-plx-color="blue" aria-hidden="true"></span><span class="plx-color-swatch-label__text">Blue</span></button>';
          },
          parts: Object.assign({}, base.parts, { lfg: 'D', lgap: 'D', lfs: 'D', llh: 'D', lmh: 'D' }),
          anchors: Object.assign({}, base.anchors, { D: { part: null, side: 'left' } }),
          sections: base.sections.concat([['Label', ['lfg', 'lgap', 'lfs', 'llh', 'lmh']]])
        };
      };
      DS.registerLab('color-swatch', Object.assign({}, SWATCH, withLabel(SWATCH)));
      DS.registerLab('swatch', Object.assign({}, SWATCH, withLabel(SWATCH), {
        variants: [['square', 'Square (default)'], ['round', 'Circle'], ['labeled', 'With label']],
        store: 'plenix-swatch-lab-tokens', matrixLabel: 'Color swatch values by shape and label', statesHead: 'Shapes, label and states · ' + HEAD
      }));
    }

    // ---- Swatch picker (<ColorPicker>, div.plx-color-picker): the data palette, the category palette or a custom set
    var CP = function (n) { return 'plx-comp-color-picker-' + n; };
    var SETS = { data: ['blue', 'green', 'purple', 'red', 'brown', 'gray'], category: ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'cyan', 'magenta'], custom: ['red', 'green', 'blue', 'orange', 'purple'] };
    DS.registerLab('swatch-picker', {
      name: 'Swatch picker', title: 'Plenix swatch picker', file: 'platform/components/ColorSwatch/color-swatch.css', compPrefix: /^plx-comp-color-picker-/,
      store: 'plenix-swatch-picker-lab-tokens', sizes: [['md', 'MD (default)', '.plx-color-picker']],
      variants: [['data', 'Data palette (default)'], ['category', 'Category palette'], ['custom', 'Custom swatches']], states: STATIC,
      content: [['one', 'One color chosen']],
      labels: { size: 'Size', variant: 'Palette', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'data', state: 'default', content: 'one' },
      props: [
        { id: 'gap', label: 'Gap between swatches', css: ['column-gap'], cat: 'space' },
        { id: 'rgap', label: 'Gap between rows (clipped into the More menu)', css: ['row-gap'], cat: 'space' },
        { id: 'slot', label: 'Slot minimum width (touch: the target)', css: ['min-inline-size'], show: 'min-width', part: '.plx-color-picker__slot', cat: 'size' }
      ],
      token: function (id) { return { gap: CP('gap'), rgap: CP('row-gap'), slot: CP('slot-min-width') }[id] || null; },
      reach: function () { return 'every swatch picker'; },
      every: 'every swatch picker',
      html: function (variant, size, state, extraCls) {
        var cat = variant !== 'data';
        return '<div role="group" aria-label="Color" class="plx-color-picker' + ex(extraCls) + '">' + SETS[variant].map(function (c, i) {
          return '<span class="plx-color-picker__slot"><button type="button" tabindex="-1" class="plx-color-swatch plx-color-swatch--md" ' + (cat ? 'data-plx-category' : 'data-plx-color') + '="' + c + '" aria-pressed="' + (i === 1) + '" aria-label="' + c.charAt(0).toUpperCase() + c.slice(1) + '"></button></span>';
        }).join('') + '</div>';
      },
      labelSelector: null,
      parts: { gap: 'A', rgap: 'A', slot: 'B' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-color-picker__slot', side: 'bottom' } },
      sections: [['Layout', ['gap', 'rgap', 'slot']]],
      matrixLabel: 'Swatch picker values by palette',
      statesHead: 'Palettes · ' + HEAD
    });

    // ---- Scrim (<Scrim>, div.plx-scrim): modal, light and inverse, over the window or contained; drawn in a frame whose
    // paint containment holds even the window scrim
    var SC = function (n) { return 'plx-comp-scrim-' + n; };
    DS.registerLab('scrim', {
      name: 'Scrim', title: 'Plenix scrim', file: 'platform/components/Scrim/scrim.css', compPrefix: /^plx-comp-scrim-/,
      store: 'plenix-scrim-lab-tokens', sizes: [['window', 'Over the window (default)', '.plx-scrim'], ['contained', 'Contained', '.plx-scrim--contained']],
      variants: [['modal', 'Modal (default)'], ['light', 'Light'], ['inverse', 'Inverse']], states: STATIC, content: [['region', 'Over a region']],
      labels: { size: 'Placement', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'contained', variant: 'modal', state: 'default', content: 'region' },
      props: [
        { id: 'bg', label: 'Color', css: ['background-color'], cat: 'color' },
        { id: 'op', label: 'Opacity', css: ['opacity'], cat: 'opacity' }
      ],
      token: function (id, size, variant) {
        switch (id) {
          case 'bg': return variant === 'inverse' ? SC('inverse-background') : SC('background');
          case 'op': return variant === 'inverse' ? SC('inverse-opacity') : variant === 'light' ? SC('light-opacity') : SC('opacity');
          default: return null;
        }
      },
      reach: function (full) { return /inverse/.test(full) ? 'every inverse scrim' : /light/.test(full) ? 'every light scrim' : 'every modal and light scrim'; },
      every: 'every scrim',
      html: function (variant, size, state, extraCls) {
        return '<div class="ds-w04c-frame">' + REGION + '<div class="plx-scrim ds-w04c-still plx-scrim--' + variant + (size === 'contained' ? ' plx-scrim--contained' : '') + ex(extraCls) + '" aria-hidden="true"></div></div>';
      },
      labelSelector: null,
      parts: { bg: 'A', op: 'A' },
      anchors: { A: { part: null, side: 'top' } },
      sections: [['Layer', ['bg', 'op']]],
      matrixLabel: 'Scrim values by variant',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Loading overlay (<LoadingOverlay>, div.plx-loading-overlay): its status over a region or the window, with the
    // message or a progress bar
    var LO = function (n) { return 'plx-comp-loading-overlay-' + n; };
    DS.registerLab('loading-overlay', {
      name: 'Loading overlay', title: 'Plenix loading overlay', file: 'platform/components/LoadingOverlay/loading-overlay.css', compPrefix: /^plx-comp-loading-overlay-/,
      store: 'plenix-loading-overlay-lab-tokens', sizes: [['default', 'Default', '.plx-loading-overlay']],
      variants: [['region', 'Region (default)'], ['page', 'Full page'], ['message', 'With message'], ['progress', 'With progress']], states: STATIC,
      content: [['saving', 'Saving changes']],
      labels: { size: 'Size', variant: 'Coverage and indicator', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'message', state: 'default', content: 'saving' },
      props: [
        { id: 'gap', label: 'Gap (indicator, message, Cancel)', css: ['row-gap'], part: '.plx-loading-overlay__status', cat: 'space' },
        { id: 'pad', label: 'Padding (from the region’s edges)', css: ['padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end'], show: 'padding-left', part: '.plx-loading-overlay__status', cat: 'space' },
        { id: 'mfg', label: 'Message color', css: ['color'], part: '.plx-loading-overlay__message', cat: 'color' },
        { id: 'mfs', label: 'Message font size', css: ['font-size'], part: '.plx-loading-overlay__message', cat: 'font-size' },
        { id: 'mfw', label: 'Message weight', css: ['font-weight'], part: '.plx-loading-overlay__message', cat: 'font-weight' },
        { id: 'mlh', label: 'Message line height', css: ['line-height'], part: '.plx-loading-overlay__message', cat: 'line-height' },
        { id: 'pw', label: 'Progress bar maximum width', css: ['max-inline-size'], show: 'max-width', part: '.plx-loading-overlay__progress', cat: 'size' }
      ],
      token: function (id, size, variant) {
        var msg = variant !== 'progress';
        switch (id) {
          case 'gap': return LO('gap');
          case 'pad': return LO('padding');
          case 'mfg': return msg ? LO('message-color') : null;
          case 'mfs': return msg ? LO('message-font-size') : null;
          case 'mfw': return msg ? LO('message-font-weight') : null;
          case 'mlh': return msg ? LO('message-line-height') : null;
          case 'pw': return msg ? null : LO('progress-max-width');
          default: return null;
        }
      },
      reach: function (full) { return /message/.test(full) ? 'every loading overlay message' : /progress/.test(full) ? 'every loading overlay with progress' : 'every loading overlay'; },
      every: 'every loading overlay',
      html: function (variant, size, state, extraCls) {
        var indicator = variant === 'progress'
          ? '<div class="plx-progress-bar plx-progress-bar--md plx-progress-bar--info plx-loading-overlay__progress"><div class="plx-progress-bar__head"><span class="plx-progress-bar__label">Importing 120 assets</span><span class="plx-progress-bar__value">42%</span></div><progress class="plx-progress-bar__track plx-progress-bar__meter" value="42" max="100" aria-label="Importing 120 assets"></progress></div>' + button('Cancel')
          : '<span class="plx-spinner plx-spinner--lg" role="status"><span class="plx-visually-hidden">Saving changes</span></span><span class="plx-loading-overlay__message" aria-hidden="true">Saving changes</span>';
        return '<div class="ds-w04c-frame"><div class="plx-loading-overlay' + (variant === 'page' ? ' plx-loading-overlay--page' : '') + ex(extraCls) + '" aria-busy="true"><div class="plx-loading-overlay__content" inert>' + REGION + '</div>'
          + '<div class="plx-scrim ds-w04c-still plx-scrim--inverse' + (variant === 'page' ? '' : ' plx-scrim--contained') + '" aria-hidden="true"></div><div class="plx-loading-overlay__status">' + indicator + '</div></div></div>';
      },
      labelSelector: '.plx-loading-overlay__message',
      parts: { gap: 'A', pad: 'A', mfg: 'B', mfs: 'B', mfw: 'B', mlh: 'B', pw: 'C' },
      anchors: { A: { part: '.plx-loading-overlay__status', side: 'left' }, B: { part: '.plx-loading-overlay__message', side: 'bottom' }, C: { part: '.plx-loading-overlay__progress', side: 'top' } },
      sections: [['Status', ['gap', 'pad']], ['Message', ['mfg', 'mfs', 'mfw', 'mlh']], ['Progress', ['pw']]],
      matrixLabel: 'Loading overlay values by coverage and indicator',
      statesHead: 'Coverage and indicators · ' + HEAD
    });

    // ---- Timestamp (<Time>, time.plx-time): the formats, all in the data font; with the tooltip a Tab stop with the ring
    var TM = function (n) { return 'plx-comp-time-' + n; };
    var TEXT = { datetime: 'Oct 8, 2026, 2:05 PM', relative: '5 minutes ago', label: 'Yesterday', date: 'October 8, 2026', time: '2:05 PM PST', tooltip: '5 minutes ago' };
    DS.registerLab('timestamp', {
      name: 'Timestamp', title: 'Plenix timestamp', file: 'platform/components/Time/time.css', compPrefix: /^plx-comp-time-/,
      store: 'plenix-timestamp-lab-tokens', sizes: [['default', 'Default (the size of the text around it)', '.plx-time']],
      variants: [['datetime', 'Timestamp (default)'], ['relative', 'Relative'], ['label', 'Date label'], ['date', 'Date only'], ['time', 'Time only'], ['tooltip', 'With absolute tooltip']],
      states: [['default', 'Default'], ['focus', 'Focus (with the tooltip)']], content: [['sentence', 'In a line of text']],
      labels: { size: 'Size', variant: 'Format', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'datetime', state: 'default', content: 'sentence' },
      props: [
        { id: 'ff', label: 'Font family (data)', css: ['font-family'], cat: 'font' },
        { id: 'rad', label: 'Focus ring corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' }
      ].concat(ring(null)),
      token: function (id, size, variant, state) {
        var tip = variant === 'relative' || variant === 'label' || variant === 'tooltip';
        var focus = state === 'focus' && tip;
        switch (id) {
          case 'ff': return TM('font-family');
          case 'rad': return focus ? TM('focus-radius') : null;
          case 'oc': return focus ? TM('focus-outline-color') : null;
          case 'oo': return focus ? TM('focus-outline-offset') : null;
          case 'ow': return focus ? TM('focus-outline-width') : null;
          default: return null;
        }
      },
      reach: function (full) { return /focus/.test(full) ? 'every time with a tooltip' : 'every time'; },
      every: 'every time',
      html: function (variant, size, state, extraCls) {
        var tip = variant === 'relative' || variant === 'label' || variant === 'tooltip';
        var attr = variant === 'label' || variant === 'date' ? '2026-10-08' : '2026-10-08T21:05:00.000Z';
        return '<span class="plx-text">Edited <time class="plx-time' + (state === 'focus' && tip ? ' is-focus-visible' : '') + ex(extraCls) + '" datetime="' + attr + '"' + (tip ? ' tabindex="-1"' : '') + '>' + TEXT[variant] + '</time> by Ana Ruiz</span>';
      },
      labelSelector: null,
      parts: { ff: 'A', rad: 'B', oc: 'B', oo: 'B', ow: 'B' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'bottom' } },
      sections: [['Type', ['ff']], ['Focus (with the tooltip)', ['rad', 'oc', 'oo', 'ow']]],
      matrixLabel: 'Timestamp values by format and state',
      statesHead: 'Formats and states · ' + HEAD
    });

    // ---- Undo pattern: the toast's lab (overlay-labs.js) with the action; the toast lab gets the two new variants too
    var TOAST = DS.labs && DS.labs.toast;
    if (TOAST) {
      var ACTION = [['action', 'With action (Undo)'], ['persistent', 'Persistent until action']];
      var isAction = function (v) { return v === 'action' || v === 'persistent'; };
      var actionSpec = {
        token: function (id, size, variant, state, content) { return TOAST.token(id, size, isAction(variant) ? 'info' : variant, state, content); },
        html: function (variant, size, state, extraCls, ui) {
          if (!isAction(variant)) return TOAST.html(variant, size, state, extraCls, ui);
          return TOAST.html('info', size, state, extraCls, ui).replace('Export finished.', '3 assets archived.').replace('<button type="button" tabindex="-1" class="plx-toast__close"', button('Undo', 'xs').replace('plx-button--size-xs"', 'plx-button--size-xs plx-toast__action"') + '<button type="button" tabindex="-1" class="plx-toast__close"');
        }
      };
      DS.registerLab('toast', Object.assign({}, TOAST, actionSpec, { variants: TOAST.variants.concat(ACTION) }));
      DS.registerLab('undo-pattern', Object.assign({}, TOAST, actionSpec, {
        name: 'Undo pattern', title: 'Plenix undo pattern', store: 'plenix-undo-pattern-lab-tokens', variants: ACTION,
        defaults: Object.assign({}, TOAST.defaults, { variant: 'action' }), matrixLabel: 'Undo toast values', statesHead: 'Undo toasts · ' + HEAD
      }));
    }
  })();
}
