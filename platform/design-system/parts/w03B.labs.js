/* Plenix design system · library part w03B: the labs of wave 3, lane B. The brand (the logo lab, and the wordmark, brand
   mark and product mark labs drawn from it), Illustration, Sticky (and the fixed region), and Stack's Center, Bleed and
   reorder. Each value with the one --plx-comp-* token behind it; the markup is what the components render. */
if (window.DS && DS.registerLab) {
  (function () {
    var ONE = [['default', 'Default']];
    var STATIC = [['default', 'Default']];
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var CORNER = 'border-top-left-radius';
    var BOX = function (text) { return '<div class="ds-layout-fill ds-layout-box">' + text + '</div>'; };
    var apps = function () { var list = ((window.Plenix && window.Plenix.PLENIX_APPS) || []).map(function (a) { return [a.id, a.label]; }); return list.length ? list : [['notes', 'Notes']]; };
    var appOf = function (id) { return ((window.Plenix && window.Plenix.PLENIX_APPS) || []).filter(function (a) { return a.id === id; })[0]; };

    // ---- the brand (<BrandMark kind tone size>): span.plx-brand-mark alone, or span.plx-brand-lockup with its parts
    var B = function (n) { return 'plx-comp-brand-' + n; };
    var KINDS = ['logo', 'clear', 'wordmark', 'mark'];
    var kindOf = function (content) { return KINDS.indexOf(content) >= 0 ? content : 'product'; };
    var brandHtml = function (tone, size, state, extraCls, ui) {
      var content = (ui && ui.content) || 'logo', kind = kindOf(content), out;
      if (kind === 'mark') {
        out = '<span aria-hidden="true" class="plx-brand-mark' + (tone !== 'mono' ? ' plx-brand-mark--tone-' + tone : '') + ' plx-brand-mark--size-' + size + ex(extraCls) + '"></span>';
      } else {
        var cls = 'plx-brand-lockup plx-brand-lockup--' + (kind === 'clear' ? 'logo' : kind) + ' plx-brand-lockup--tone-' + tone + ' plx-brand-lockup--size-' + size + (kind === 'clear' ? ' plx-brand-lockup--clear' : '');
        var inner;
        if (kind === 'product') {
          var a = appOf(content) || { label: 'Notes', icon: 'doc-text' };
          inner = '<span class="plx-brand-lockup__tile" aria-hidden="true">' + DS.icon(a.icon, 'plx-brand-lockup__icon') + '</span><span class="plx-brand-lockup__app">' + a.label + '</span>';
        } else {
          inner = (kind === 'wordmark' ? '' : '<span aria-hidden="true" class="plx-brand-mark plx-brand-lockup__mark"></span>') + '<span class="plx-brand-lockup__name">Plenix</span>';
        }
        out = '<span class="' + cls + ex(extraCls) + '">' + inner + '</span>';
        if (kind === 'clear') out = '<span class="ds-w03b-clear">' + out + '</span>';
      }
      return tone === 'on-accent' ? '<div class="ds-w03b-accent">' + out + '</div>' : out;
    };
    var brandToken = function (id, size, tone, state, content) {
      var kind = kindOf(content), lock = kind !== 'mark', logo = kind === 'logo' || kind === 'clear', prod = kind === 'product';
      var color = tone === 'brand' ? 'brand' : tone === 'on-accent' ? 'on-accent' : null;
      switch (id) {
        case 'mcolor': return kind === 'mark' && color ? B(color === 'brand' ? 'mark-color' : 'on-accent-color') : null;
        case 'msize': return kind === 'mark' ? B(size + '-mark-size') : null;
        case 'lmcolor': return logo && color ? B(color === 'brand' ? 'mark-color' : 'on-accent-color') : null;
        case 'lmsize': return logo ? B(size + '-mark-size') : null;
        case 'text': return lock && color ? B(color === 'brand' ? 'name-color' : 'on-accent-color') : null;
        case 'fs': return lock ? B(size + '-font-size') : null;
        case 'gap': return logo || prod ? B(size + '-gap') : null;
        case 'pad': return kind === 'clear' ? B(size + '-clear-space') : null;
        case 'nff': return lock && !prod ? B('name-font-family') : null;
        case 'nfw': return lock && !prod ? B('name-font-weight') : null;
        case 'nlh': return lock && !prod ? B('name-line-height') : null;
        case 'aff': return prod ? B('app-font-family') : null;
        case 'afw': return prod ? B('app-font-weight') : null;
        case 'alh': return prod ? B('name-line-height') : null;
        case 'tbg': return prod && color ? B(color === 'brand' ? 'tile-background' : 'on-accent-tile-background') : null;
        case 'tfg': return prod && color ? B(color === 'brand' ? 'tile-icon' : 'on-accent-tile-icon') : null;
        case 'tbw': return prod && tone === 'mono' ? B('mono-tile-border-width') : null;
        case 'tsize': return prod ? B(size + '-tile-size') : null;
        case 'trad': return prod ? B(size + '-tile-radius') : null;
        case 'isize': return prod ? B(size + '-icon-size') : null;
      }
      return null;
    };
    var BRAND = {
      name: 'Logo', title: 'Plenix logo', file: 'platform/components/Brand/brand-lockup.css', compPrefix: /^plx-comp-brand-/,
      store: 'plenix-logo-lab-tokens',
      sizes: [['sm', 'Sm (minimum)'], ['md', 'Md (default)'], ['lg', 'Lg'], ['xl', 'Xl']],
      variants: [['brand', 'Brand (default)'], ['mono', 'One color'], ['on-accent', 'On accent']],
      states: STATIC,
      content: [['logo', 'Logo'], ['clear', 'Logo with clear space'], ['wordmark', 'Wordmark'], ['mark', 'Mark'], ['notes', 'Product mark (Notes)']],
      labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Kind' },
      defaults: { size: 'md', variant: 'brand', state: 'default', content: 'logo' },
      props: [
        { id: 'mcolor', label: 'Mark color (mark alone)', css: ['color'], cat: 'color' },
        { id: 'msize', label: 'Mark size (mark alone)', css: ['inline-size'], cat: 'size' },
        { id: 'lmcolor', label: 'Mark color', css: ['color'], cat: 'color', part: '.plx-brand-lockup__mark' },
        { id: 'lmsize', label: 'Mark size', css: ['inline-size'], cat: 'size', part: '.plx-brand-lockup__mark' },
        { id: 'text', label: 'Name color', css: ['color'], cat: 'color' },
        { id: 'fs', label: 'Name size (type scale)', css: ['font-size'], cat: 'font-size' },
        { id: 'gap', label: 'Gap after the mark', css: ['column-gap'], cat: 'space' },
        { id: 'pad', label: 'Clear space', css: ['padding-top'], cat: 'space' },
        { id: 'nff', label: 'Wordmark face', css: ['font-family'], cat: 'font', part: '.plx-brand-lockup__name' },
        { id: 'nfw', label: 'Wordmark weight', css: ['font-weight'], cat: 'font-weight', part: '.plx-brand-lockup__name' },
        { id: 'nlh', label: 'Wordmark line height', css: ['line-height'], cat: 'line-height', part: '.plx-brand-lockup__name' },
        { id: 'aff', label: 'Application name face', css: ['font-family'], cat: 'font', part: '.plx-brand-lockup__app' },
        { id: 'afw', label: 'Application name weight', css: ['font-weight'], cat: 'font-weight', part: '.plx-brand-lockup__app' },
        { id: 'alh', label: 'Application name line height', css: ['line-height'], cat: 'line-height', part: '.plx-brand-lockup__app' },
        { id: 'tbg', label: 'Tile fill', css: ['background-color'], cat: 'color', part: '.plx-brand-lockup__tile' },
        { id: 'tfg', label: 'Tile icon color', css: ['color'], cat: 'color', part: '.plx-brand-lockup__tile' },
        { id: 'tbw', label: 'Tile outline (one color)', css: ['border-top-width'], cat: 'border-width', part: '.plx-brand-lockup__tile' },
        { id: 'tsize', label: 'Tile size', css: ['inline-size'], cat: 'size', part: '.plx-brand-lockup__tile' },
        { id: 'trad', label: 'Tile corners', css: [CORNER], cat: 'radius', part: '.plx-brand-lockup__tile' },
        { id: 'isize', label: 'Application icon size', css: ['inline-size'], cat: 'icon', part: '.plx-brand-lockup__icon' }
      ],
      token: brandToken,
      reach: function (full) { var m = /brand-(sm|md|lg|xl)-/.exec(full); return m ? 'every brand lockup at ' + m[1].toUpperCase() : 'every brand lockup'; },
      every: 'every brand lockup',
      html: brandHtml,
      labelSelector: '.plx-brand-lockup__name',
      parts: { mcolor: 'A', msize: 'A', lmcolor: 'A', lmsize: 'A', text: 'B', fs: 'B', nff: 'B', nfw: 'B', nlh: 'B', gap: 'C', pad: 'C', tbg: 'D', tfg: 'D', tbw: 'D', tsize: 'D', trad: 'D', isize: 'D', aff: 'E', afw: 'E', alh: 'E' },
      anchors: { A: { part: '.plx-brand-lockup__mark', side: 'left' }, B: { part: '.plx-brand-lockup__name', side: 'right' }, C: { part: null, side: 'bottom' }, D: { part: '.plx-brand-lockup__tile', side: 'left' }, E: { part: '.plx-brand-lockup__app', side: 'right' } },
      sections: [['Mark', ['mcolor', 'msize', 'lmcolor', 'lmsize']], ['Name', ['text', 'fs', 'nff', 'nfw', 'nlh', 'aff', 'afw', 'alh']], ['Spacing', ['gap', 'pad']], ['Product tile', ['tbg', 'tfg', 'tbw', 'tsize', 'trad', 'isize']]],
      matrixLabel: 'Brand values by tone',
      statesHead: 'Tones · ' + HEAD
    };
    DS.registerLab('logo', BRAND);
    DS.registerLab('wordmark', Object.assign({}, BRAND, { name: 'Wordmark', title: 'Plenix wordmark', store: 'plenix-wordmark-lab-tokens', content: [['wordmark', 'Wordmark']], defaults: { size: 'md', variant: 'brand', state: 'default', content: 'wordmark' } }));
    DS.registerLab('brand-symbol', Object.assign({}, BRAND, { name: 'Brand mark', title: 'Plenix brand mark', store: 'plenix-brand-symbol-lab-tokens', content: [['mark', 'Mark']], labelSelector: null, defaults: { size: 'md', variant: 'brand', state: 'default', content: 'mark' } }));
    DS.registerLab('product-mark', Object.assign({}, BRAND, { name: 'Product mark', title: 'Plenix product marks', store: 'plenix-product-mark-lab-tokens', content: apps(), labelSelector: '.plx-brand-lockup__app', labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Application' }, defaults: { size: 'md', variant: 'brand', state: 'default', content: 'notes' } }));

    // ---- Illustration (<Illustration name size tone>): svg.plx-illustration, every part a role class
    var IL = function (n) { return 'plx-comp-illustration-' + n; };
    var arts = function () { return (window.Plenix && window.Plenix.ILLUSTRATIONS) || []; };
    var artOf = function (name) { return arts().filter(function (a) { return a.name === name; })[0]; };
    var has = function (name, role) { var a = artOf(name); return !!a && a.parts.some(function (p) { return p[0] === role; }); };
    var svgOf = function (name, size, tone, extraCls) {
      var a = artOf(name); if (!a) return '';
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" class="plx-illustration plx-illustration--' + size + (tone === 'on-accent' ? ' plx-illustration--on-accent' : '') + ex(extraCls) + '">'
        + a.parts.map(function (p) { return '<' + p[1] + ' class="plx-illustration__' + p[0] + '" ' + Object.keys(p[2]).map(function (k) { return k + '="' + p[2][k] + '"'; }).join(' ') + '></' + p[1] + '>'; }).join('') + '</svg>';
    };
    // [prop id, role part, css, cat, token suffix (default), token suffix (on accent)]
    var ROLES = [['back', 'back', 'fill', 'back', 'on-accent-back'], ['shape', 'shape', 'fill', 'shape', 'on-accent-shape'], ['line', 'shape', 'stroke', 'line', 'on-accent-line'],
      ['stroke', 'stroke', 'stroke', 'line', 'on-accent-line'], ['ghost', 'ghost', 'fill', 'ghost', 'on-accent-ghost'], ['accent', 'accent', 'fill', 'accent', 'on-accent-accent'],
      ['accent-stroke', 'accent-stroke', 'stroke', 'accent', 'on-accent-accent'], ['knock', 'knock', 'stroke', 'knock', 'on-accent-knock'], ['danger', 'danger', 'fill', 'danger', 'on-accent-accent'],
      ['danger-stroke', 'danger-stroke', 'stroke', 'danger', 'on-accent-accent'], ['danger-knock', 'danger-knock', 'stroke', 'danger-knock', 'on-accent-knock']];
    DS.registerLab('illustration', {
      name: 'Illustration', title: 'Plenix illustrations', file: 'platform/components/Illustration/illustration.css', compPrefix: /^plx-comp-illustration-/,
      store: 'plenix-illustration-lab-tokens',
      sizes: [['sm', 'Sm (spot)'], ['md', 'Md (scene, default)'], ['lg', 'Lg (large scene)']],
      variants: [['default', 'Default'], ['on-accent', 'On accent']],
      states: STATIC,
      content: [['empty-folder', 'Empty folder'], ['no-results', 'No results'], ['inbox-zero', 'All done'], ['no-data', 'No data'], ['get-started', 'Get started'],
        ['error', 'Error'], ['offline', 'Offline'], ['not-found', 'Not found'], ['no-access', 'No access']],
      labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Drawing' },
      defaults: { size: 'md', variant: 'default', state: 'default', content: 'no-results' },
      props: [{ id: 'size', label: 'Size', css: ['inline-size'], cat: 'size' },
        { id: 'sw', label: 'Line width', css: ['stroke-width'], cat: 'border-width', part: '.plx-illustration__shape' }].concat(ROLES.map(function (r) {
        return { id: r[0], label: r[0].replace(/-/g, ' ').replace(/^./, function (c) { return c.toUpperCase(); }) + (r[2] === 'fill' ? ' fill' : ' line'), css: [r[2]], cat: 'color', part: '.plx-illustration__' + r[1] };
      })),
      token: function (id, size, tone, state, content) {
        if (id === 'size') return IL(size + '-size');
        if (id === 'sw') return has(content, 'shape') ? IL(size === 'sm' ? 'sm-stroke-width' : 'stroke-width') : null;
        var r = ROLES.filter(function (x) { return x[0] === id; })[0];
        if (!r || !has(content, r[1])) return null;
        return IL(tone === 'on-accent' ? r[4] : r[3]);
      },
      reach: function (full) { return /on-accent/.test(full) ? 'every illustration on the accent' : 'every illustration'; },
      every: 'every illustration',
      html: function (tone, size, state, extraCls, ui) {
        var svg = svgOf((ui && ui.content) || 'no-results', size, tone, extraCls);
        return tone === 'on-accent' ? '<div class="ds-w03b-accent">' + svg + '</div>' : svg;
      },
      labelSelector: null,
      parts: { size: 'A', sw: 'B', back: 'A', shape: 'B', line: 'B', stroke: 'B', ghost: 'C', accent: 'C', 'accent-stroke': 'C', knock: 'C', danger: 'C', 'danger-stroke': 'C', 'danger-knock': 'C' },
      anchors: { A: { part: '.plx-illustration__back', side: 'left' }, B: { part: '.plx-illustration__shape', side: 'right' }, C: { part: null, side: 'bottom' } },
      sections: [['Size', ['size', 'sw']], ['Roles', ROLES.map(function (r) { return r[0]; })]],
      matrixLabel: 'Illustration values by tone',
      statesHead: 'Tones · ' + HEAD
    });

    // ---- Sticky (<Sticky edge fixed shadow safeArea>): div.plx-sticky > div.plx-sticky__body, in a scroll area of rows
    var SK = function (n) { return 'plx-comp-sticky-' + n; };
    var ROWS = function (n) { var s = ''; for (var i = 1; i <= n; i++) s += '<div class="ds-w03b-row">Row ' + i + '</div>'; return s; };
    var STICKY = {
      name: 'Sticky region', title: 'Plenix sticky region', file: 'platform/components/Sticky/sticky.css', compPrefix: /^plx-comp-sticky-/,
      store: 'plenix-sticky-lab-tokens', sizes: ONE,
      variants: [['top', 'Top (default)'], ['bottom', 'Bottom'], ['always', 'Always a shadow'], ['safe-area', 'Safe-area insets'], ['fixed', 'Fixed (window)']],
      states: [['default', 'At rest'], ['stuck', 'Stuck']],
      content: [['bar', 'A bar over rows']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'top', state: 'stuck', content: 'bar' },
      props: [
        { id: 'bg', label: 'Surface', css: ['background-color'], cat: 'color', part: '.plx-sticky__body' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color', part: '.plx-sticky__body' },
        { id: 'sh', label: 'Shadow while stuck', css: ['box-shadow'], cat: 'shadow', part: '.plx-sticky__body' },
        { id: 'top', label: 'Safe area (top)', css: ['padding-top'], cat: 'space', part: '.plx-sticky__body' },
        { id: 'bottom', label: 'Safe area (bottom)', css: ['padding-bottom'], cat: 'space', part: '.plx-sticky__body' },
        { id: 'start', label: 'Safe area (start)', css: ['padding-inline-start'], show: 'padding-left', cat: 'space', part: '.plx-sticky__body' },
        { id: 'end', label: 'Safe area (end)', css: ['padding-inline-end'], show: 'padding-right', cat: 'space', part: '.plx-sticky__body' }
      ],
      token: function (id, size, variant, state) {
        var bottom = variant === 'bottom' || variant === 'fixed', safe = variant === 'safe-area' || variant === 'fixed';
        switch (id) {
          case 'bg': return SK('background');
          case 'fg': return SK('text');
          case 'sh': return state === 'stuck' || variant === 'always' || variant === 'fixed' ? SK('stuck-shadow') : null;
          case 'top': return safe && !bottom ? SK('safe-area-top') : null;
          case 'bottom': return safe && bottom ? SK('safe-area-bottom') : null;
          case 'start': return safe ? SK('safe-area-start') : null;
          case 'end': return safe ? SK('safe-area-end') : null;
        }
        return null;
      },
      reach: function () { return 'every sticky and fixed region'; },
      every: 'every sticky and fixed region',
      html: function (variant, size, state, extraCls) {
        var bottom = variant === 'bottom' || variant === 'fixed';
        var cls = 'plx-sticky plx-sticky--' + (bottom ? 'bottom' : 'top') + (variant === 'fixed' ? ' plx-sticky--fixed' : '') + ' plx-sticky--shadow-' + (variant === 'always' || variant === 'fixed' ? 'always' : 'stuck')
          + (variant === 'safe-area' || variant === 'fixed' ? ' plx-sticky--safe-area' : '') + (state === 'stuck' ? ' is-stuck' : '');
        var bar = '<div class="' + cls + ex(extraCls) + '"><div class="plx-sticky__body ds-w03b-bar">' + (bottom ? 'Cancel · Save' : 'Project header') + '</div></div>';
        if (variant === 'fixed') return '<div class="ds-w03b-window" role="region" aria-label="A window" tabindex="0">' + ROWS(6) + bar + '</div>';
        return '<div class="ds-w03b-scroll" role="region" aria-label="A scroll area" tabindex="0">' + (bottom ? ROWS(8) + bar : bar + ROWS(8)) + '</div>';
      },
      labelSelector: '.plx-sticky__body',
      parts: { bg: 'A', fg: 'A', sh: 'A', top: 'B', bottom: 'B', start: 'B', end: 'B' },
      anchors: { A: { part: '.plx-sticky__body', side: 'right' }, B: { part: '.plx-sticky__body', side: 'left' } },
      sections: [['Surface', ['bg', 'fg', 'sh']], ['Safe area', ['top', 'bottom', 'start', 'end']]],
      matrixLabel: 'Sticky values by variant',
      statesHead: 'Variants · ' + HEAD
    };
    DS.registerLab('sticky', STICKY);
    DS.registerLab('fixed', Object.assign({}, STICKY, { name: 'Fixed region', title: 'Plenix fixed region', store: 'plenix-fixed-region-lab-tokens', variants: [['fixed', 'Fixed (window)']], states: [['default', 'Fixed']], defaults: { size: 'default', variant: 'fixed', state: 'default', content: 'bar' } }));

    // ---- Center (<Center maxWidth intrinsic vertical text>): div.plx-center in a frame
    DS.registerLab('center', {
      name: 'Center', title: 'Plenix center', file: 'platform/components/Stack/stack.css', compPrefix: /^plx-comp-center-/,
      store: 'plenix-center-lab-tokens', sizes: ONE,
      variants: [['sm', 'Sm (400px)'], ['md', 'Md (default, 600px)'], ['lg', 'Lg (900px)'], ['page', 'Page'], ['intrinsic', 'Intrinsic'], ['vertical', 'Vertical'], ['text', 'Text']],
      states: STATIC, content: [['block', 'A block']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'md', state: 'default', content: 'block' },
      props: [{ id: 'max', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' }],
      token: function (id, size, variant) { return id === 'max' ? 'plx-comp-center-' + (['sm', 'lg', 'page'].indexOf(variant) >= 0 ? variant : 'md') + '-max-width' : null; },
      reach: function (full) { var m = /center-([a-z]+)-/.exec(full); return m ? 'every Center at ' + m[1] : 'every Center'; },
      every: 'every Center',
      html: function (variant, size, state, extraCls) {
        var max = ['sm', 'lg', 'page'].indexOf(variant) >= 0 ? variant : 'md';
        var mods = variant === 'intrinsic' ? ' plx-center--intrinsic' : variant === 'vertical' ? ' plx-center--vertical' : variant === 'text' ? ' plx-center--text plx-center--intrinsic' : '';
        return '<div class="ds-w03b-stage"><div class="plx-center plx-center--max-' + max + mods + ex(extraCls) + '">' + BOX(variant === 'text' ? 'No projects yet' : 'Centered content') + '</div></div>';
      },
      labelSelector: null,
      parts: { max: 'A' }, anchors: { A: { part: null, side: 'right' } },
      sections: [['Width', ['max']]],
      matrixLabel: 'Center values by variant',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Bleed (<Bleed space sides>): div.plx-bleed inside a Stack with the same inset
    var SP = [['xs', 'Xs'], ['sm', 'Sm'], ['md', 'Md (default)'], ['lg', 'Lg'], ['xl', 'Xl']];
    DS.registerLab('bleed', {
      name: 'Bleed', title: 'Plenix bleed', file: 'platform/components/Stack/stack.css', compPrefix: /^plx-comp-bleed-/,
      store: 'plenix-bleed-lab-tokens', sizes: ONE, variants: SP, states: STATIC,
      content: [['inline', 'To the sides (default)'], ['block', 'To the top and bottom'], ['all', 'To every edge']],
      labels: { size: 'Size', variant: 'Inset canceled', state: 'State', content: 'Sides' },
      defaults: { size: 'default', variant: 'md', state: 'default', content: 'inline' },
      props: [{ id: 'mi', label: 'Start and end margin', css: ['margin-inline-start'], show: 'margin-left', cat: 'space' },
        { id: 'mb', label: 'Top and bottom margin', css: ['margin-block-start'], show: 'margin-top', cat: 'space' }],
      token: function (id, size, space, state, sides) {
        if (id === 'mi') return sides !== 'block' ? 'plx-comp-bleed-' + space + '-margin-inline' : null;
        if (id === 'mb') return sides !== 'inline' ? 'plx-comp-bleed-' + space + '-margin-block' : null;
        return null;
      },
      reach: function (full) { var m = /bleed-([a-z]+)-/.exec(full); return m ? 'every Bleed inside a ' + m[1] + ' inset' : 'every Bleed'; },
      every: 'every Bleed',
      html: function (space, size, state, extraCls, ui) {
        var sides = (ui && ui.content) || 'inline';
        var media = '<div class="plx-bleed plx-bleed--' + space + ' plx-bleed--' + sides + ex(extraCls) + '"><div class="ds-w03b-media">Full-width media</div></div>';
        return '<div class="plx-stack plx-stack--gap-sm plx-layout--inset-' + space + ' ds-w03b-frame">' + (sides === 'inline' ? BOX('Title') + media + BOX('Caption') : media) + '</div>';
      },
      labelSelector: null,
      parts: { mi: 'A', mb: 'A' }, anchors: { A: { part: null, side: 'right' } },
      sections: [['Margins', ['mi', 'mb']]],
      matrixLabel: 'Bleed values by inset',
      statesHead: 'Insets · ' + HEAD
    });

    // ---- Reorder (Stack and Inline reverse, reverseBelow, order): the children drawn in another order than the markup's
    DS.registerLab('reorder', {
      name: 'Reorder', title: 'Plenix reorder', file: 'platform/components/Stack/stack.css', compPrefix: /^plx-comp-(stack|inline)-gap-/,
      store: 'plenix-reorder-lab-tokens', sizes: ONE,
      variants: [['reverse-stack', 'Reversed column'], ['reverse-inline', 'Reversed row'], ['order-first', 'Moved to the start'], ['order-last', 'Moved to the end'], ['reverse-below', 'Reversed below Narrow']],
      states: STATIC, content: [['blocks', 'Three blocks']],
      labels: { size: 'Size', variant: 'Order', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'reverse-inline', state: 'default', content: 'blocks' },
      props: [{ id: 'rgap', label: 'Gap (column)', css: ['row-gap'], cat: 'space' }, { id: 'cgap', label: 'Gap (row)', css: ['column-gap'], cat: 'space' }],
      token: function (id, size, variant) {
        var column = variant === 'reverse-stack';
        if (id === 'rgap') return column ? 'plx-comp-stack-gap-md-row-gap' : null;
        if (id === 'cgap') return column ? null : 'plx-comp-inline-gap-sm-gap';
        return null;
      },
      reach: function () { return 'every Stack or Inline with that gap'; },
      every: 'every Stack and Inline',
      html: function (variant, size, state, extraCls) {
        var one = BOX('1 · Summary'), two = BOX('2 · Content'), three = BOX('3 · Related');
        if (variant === 'reverse-stack') return '<div class="plx-stack plx-stack--gap-md plx-layout--reverse ds-layout-frame--sm' + ex(extraCls) + '">' + one + two + three + '</div>';
        if (variant === 'order-first') return '<div class="plx-inline plx-inline--gap-sm plx-layout--align-center' + ex(extraCls) + '">' + one + two + '<div class="ds-layout-fill ds-layout-box plx-layout--order-first">3 · Related</div></div>';
        if (variant === 'order-last') return '<div class="plx-inline plx-inline--gap-sm plx-layout--align-center' + ex(extraCls) + '"><div class="ds-layout-fill ds-layout-box plx-layout--order-last">1 · Summary</div>' + two + three + '</div>';
        if (variant === 'reverse-below') return '<div class="plx-inline plx-inline--gap-sm plx-layout--align-center plx-layout--reverse-below-narrow' + ex(extraCls) + '">' + one + two + three + '</div>';
        return '<div class="plx-inline plx-inline--gap-sm plx-layout--align-center plx-layout--reverse' + ex(extraCls) + '">' + one + two + three + '</div>';
      },
      labelSelector: null,
      parts: { rgap: 'A', cgap: 'A' }, anchors: { A: { part: null, side: 'right' } },
      sections: [['Spacing', ['rgap', 'cgap']]],
      matrixLabel: 'Reorder values by order',
      statesHead: 'Orders · ' + HEAD
    });
  })();
}
