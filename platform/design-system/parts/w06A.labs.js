/* Plenix design system · library part w06A: the labs of wave 6, lane A. The field group and the legend (Fieldset),
   ErrorSummary, InputGroup, NumberInput, FileInput and CodeEditor, each drawn in place with the markup the component
   renders, so every size, variant and state shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var icon = function (name) { return DS.icon(name); };
    var attr = function (on, a) { return on ? ' ' + a : ''; };
    var SIDES = function (prop) { return ['top', 'right', 'bottom', 'left'].map(function (s) { return prop.replace('%', s); }); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var FIELD_STATES = [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['warning', 'Warning'], ['readonly', 'Read-only'], ['disabled', 'Disabled']];

    // ---- Field group and Legend (<Fieldset layout="row" hideLegend>): a fieldset with two short fields
    var FS = function (n) { return 'plx-comp-fieldset-' + n; };
    var fieldset = function (row, hidden, extraCls) {
      var input = function (name, value) { return '<input type="text" tabindex="-1" class="plx-input plx-input--width-xs plx-input--data" aria-label="' + name + '" value="' + value + '">'; };
      return '<fieldset class="plx-fieldset ' + (row ? 'plx-fieldset--row' : 'plx-stack plx-stack--gap-xs') + ex(extraCls) + '"><legend class="plx-fieldset__legend' + (hidden ? ' plx-visually-hidden' : '') + '">Size</legend>'
        + input('Width', '1920') + input('Height', '1080') + '</fieldset>';
    };
    var LEGEND_PROPS = [
      { id: 'lc', label: 'Legend color', css: ['color'], part: '.plx-fieldset__legend', cat: 'color' },
      { id: 'lfs', label: 'Legend size', css: ['font-size'], part: '.plx-fieldset__legend', cat: 'font-size' },
      { id: 'lm', label: 'Space under the legend', css: ['margin-block-end'], show: 'margin-bottom', part: '.plx-fieldset__legend', cat: 'space' }
    ];
    var legendToken = function (id) { return { lc: FS('legend-text'), lfs: FS('legend-font-size'), lm: FS('legend-margin-block-end') }[id] || null; };
    DS.registerLab('field-group', {
      name: 'Field group', title: 'Plenix field group', file: 'platform/components/Fieldset/fieldset.css', compPrefix: /^plx-comp-(fieldset|stack)-/,
      store: 'plenix-field-group-lab-tokens', sizes: [['default', 'Default', '.plx-fieldset']],
      variants: [['row', 'In a row'], ['stack', 'Stacked (default)']], states: [['default', 'Default']],
      content: [['visible', 'Legend visible'], ['hidden', 'Legend hidden']], labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Legend' },
      defaults: { size: 'default', variant: 'row', state: 'default', content: 'visible' },
      props: LEGEND_PROPS.concat([
        { id: 'cg', label: 'Space between the fields', css: ['column-gap'], cat: 'space' },
        { id: 'rg', label: 'Space between the lines', css: ['row-gap'], cat: 'space' }
      ]),
      token: function (id, size, variant) {
        if (id === 'cg') return variant === 'row' ? FS('row-column-gap') : null;
        if (id === 'rg') return variant === 'row' ? FS('row-row-gap') : 'plx-comp-stack-gap-xs-row-gap';
        return legendToken(id);
      },
      reach: function (full) { return /-row-/.test(full) ? 'every field group (a fieldset in a row)' : /stack/.test(full) ? 'every stack with the xs gap' : 'every fieldset'; },
      every: 'every fieldset',
      html: function (variant, size, state, extraCls, ui) { return fieldset(variant === 'row', ui.content === 'hidden', extraCls); },
      labelSelector: '.plx-fieldset__legend',
      parts: { lc: 'A', lfs: 'A', lm: 'A', cg: 'B', rg: 'B' },
      anchors: { A: { part: '.plx-fieldset__legend', side: 'top' }, B: { part: '.plx-input', side: 'bottom' } },
      sections: [['Legend', ['lc', 'lfs', 'lm']], ['Layout', ['cg', 'rg']]],
      matrixLabel: 'Field group values by layout', matrixColumnWidth: '--plx-ref-size-320px',
      statesHead: 'Layouts · ' + HEAD
    });
    DS.registerLab('legend', {
      name: 'Legend', title: 'Plenix legend', file: 'platform/components/Fieldset/fieldset.css', compPrefix: /^plx-comp-fieldset-/,
      store: 'plenix-legend-lab-tokens', sizes: [['default', 'Default', '.plx-fieldset__legend']],
      variants: [['visible', 'Visible (default)'], ['hidden', 'Hidden (read by screen readers)']], states: [['default', 'Default']],
      content: [['size', 'Size']], labels: { size: 'Size', variant: 'Legend', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'visible', state: 'default', content: 'size' },
      props: LEGEND_PROPS, token: legendToken,
      reach: function () { return 'every fieldset legend'; }, every: 'every fieldset legend',
      html: function (variant, size, state, extraCls) { return fieldset(false, variant === 'hidden', extraCls); },
      labelSelector: '.plx-fieldset__legend', parts: { lc: 'A', lfs: 'A', lm: 'A' },
      anchors: { A: { part: '.plx-fieldset__legend', side: 'top' } }, sections: [['Legend', ['lc', 'lfs', 'lm']]],
      matrixLabel: 'Legend values', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Legends · ' + HEAD
    });

    // ---- Error summary (<ErrorSummary>): a danger notice with its heading and the links to the fields
    var ES = function (n) { return 'plx-comp-error-summary-' + n; };
    DS.registerLab('error-summary', {
      name: 'Error summary', title: 'Plenix error summary', file: 'platform/components/ErrorSummary/error-summary.css', compPrefix: /^plx-comp-error-summary-/,
      store: 'plenix-error-summary-lab-tokens', sizes: [['default', 'Default', '.plx-error-summary']],
      variants: [['links', 'List of errors with links'], ['focused', 'Focused on submit']], states: [['default', 'Default']],
      content: [['two', 'Two problems'], ['one', 'One problem']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'focused', state: 'default', content: 'two' },
      props: [
        { id: 'gap', label: 'Space between the problems', css: ['row-gap'], part: '.plx-error-summary__list', cat: 'space' },
        { id: 'fc', label: 'Edge color with focus', css: ['box-shadow'], part: '.plx-notice', cat: 'color' }
      ],
      token: function (id, size, variant) { return id === 'gap' ? ES('list-gap') : id === 'fc' && variant === 'focused' ? ES('focus-border-color') : null; },
      reach: function () { return 'every error summary'; }, every: 'every error summary',
      html: function (variant, size, state, extraCls, ui) {
        var errs = ui.content === 'one' ? ['Enter a name'] : ['Enter a name', 'Choose an owner'];
        return '<div class="plx-error-summary' + (variant === 'focused' ? ' is-focused' : '') + ex(extraCls) + '" tabindex="-1" role="group" aria-label="' + (errs.length === 1 ? 'There is a problem' : 'There are 2 problems') + '">'
          + '<div class="plx-notice plx-notice--danger">' + icon('alert') + '<div class="plx-notice__body"><div class="plx-notice__title"><h2 class="plx-error-summary__title">' + (errs.length === 1 ? 'There is a problem' : 'There are 2 problems') + '</h2></div>'
          + '<div class="plx-notice__text"><ul class="plx-error-summary__list">' + errs.map(function (m) { return '<li class="plx-error-summary__item"><a class="plx-link plx-link--inline" tabindex="-1" href="#">' + m + '</a></li>'; }).join('') + '</ul></div></div></div></div>';
      },
      labelSelector: '.plx-error-summary__title', parts: { gap: 'A', fc: 'B' },
      anchors: { A: { part: '.plx-error-summary__list', side: 'left' }, B: { part: '.plx-notice', side: 'right' } },
      sections: [['List', ['gap']], ['Focus', ['fc']]],
      matrixLabel: 'Error summary values by variant', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Input group (<InputGroup>): the box around the field and its affixes, attached buttons and selects
    var IG = function (n) { return 'plx-comp-input-group-' + n; };
    var boxState = function (state) { return { hover: ' is-hover', focus: ' is-focused', invalid: ' is-invalid', readonly: ' is-readonly', disabled: ' is-disabled' }[state] || ''; };
    var fieldAttrs = function (state) { return attr(state === 'readonly', 'readonly') + attr(state === 'disabled', 'disabled') + attr(state === 'invalid', 'aria-invalid="true"') + attr(state === 'warning', 'data-plx-warning="true"'); };
    // o: { cls, prefix, suffix, icon, start, end, value, label, inputCls }
    var group = function (o, state, extraCls) {
      var pre = o.prefix != null, suf = o.suffix != null;
      var inputCls = 'plx-input plx-input--data plx-input-group__input' + (o.icon || pre ? ' plx-input-group__input--after-affix' : '') + (suf ? ' plx-input-group__input--before-affix' : '');
      return '<div class="plx-input-group' + (o.cls ? ' ' + o.cls : '') + ex(extraCls) + '">' + (o.start || '')
        + '<div class="plx-input-group__box' + (o.start ? ' plx-input-group__box--joined-start' : '') + (o.end ? ' plx-input-group__box--joined-end' : '') + boxState(state) + '"' + attr(state === 'warning', 'data-plx-warning="true"') + '>'
        + (o.icon ? '<span class="plx-input-group__icon" aria-hidden="true">' + icon(o.icon) + '</span>' : '')
        + (pre ? '<span class="plx-input-group__affix plx-input-group__affix--prefix">' + o.prefix + '</span>' : '')
        + '<input type="text" tabindex="-1" class="' + inputCls + '" aria-label="' + (o.label || 'Value') + '" value="' + (o.value || '') + '"' + fieldAttrs(state) + (o.attrs || '') + '>'
        + (suf ? '<span class="plx-input-group__affix plx-input-group__affix--suffix">' + o.suffix + '</span>' : '')
        + '</div>' + (o.end || '') + '</div>';
    };
    var btn = function (o) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--secondary' + (o.iconOnly ? ' plx-button--icon-only' : '') + ' plx-input-group__attached plx-input-group__attached--' + o.side + (o.side === 'end' ? ' plx-button--joined-start-seam' : ' plx-button--joined-end-seam') + ' plx-button--joined' + (o.inner ? ' plx-input-group__attached--inner' : '') + '"'
        + attr(o.disabled, 'disabled') + (o.iconOnly ? ' aria-label="' + o.label + '"' : '') + '>' + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + (o.iconOnly ? '' : '<span class="plx-button__label">' + o.label + '</span>') + '</button>';
    };
    var IG_PROPS = [
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
      { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
      { id: 'bg', label: 'Field fill', css: ['background-color'], part: '.plx-input-group__box', cat: 'color' },
      { id: 'bc', label: 'Field border color', css: SIDES('border-%-color'), show: 'border-top-color', part: '.plx-input-group__box', cat: 'color' },
      { id: 'bw', label: 'Field border width', css: SIDES('border-%-width'), show: 'border-top-width', part: '.plx-input-group__box', cat: 'border-width' },
      { id: 'rs', label: 'Field corner (start)', css: ['border-top-left-radius'], part: '.plx-input-group__box', cat: 'radius' },
      { id: 're', label: 'Field corner (end)', css: ['border-top-right-radius'], part: '.plx-input-group__box', cat: 'radius' },
      { id: 'h', label: 'Field height', css: ['min-block-size'], show: 'min-height', part: '.plx-input-group__box', cat: 'control-height' },
      { id: 'af', label: 'Affix color', css: ['color'], part: '.plx-input-group__affix', cat: 'color' },
      { id: 'aff', label: 'Affix font', css: ['font-family'], part: '.plx-input-group__affix', cat: 'font' },
      { id: 'afs', label: 'Affix size', css: ['font-size'], part: '.plx-input-group__affix', cat: 'font-size' },
      { id: 'pp', label: 'Space before the prefix', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-input-group__affix--prefix', cat: 'space' },
      { id: 'sp', label: 'Space after the suffix', css: ['padding-inline-end'], show: 'padding-right', part: '.plx-input-group__affix--suffix', cat: 'space' },
      { id: 'ga', label: 'Space between affix and value', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-input-group__input--after-affix', cat: 'space' },
      { id: 'gb', label: 'Space between value and suffix', css: ['padding-inline-end'], show: 'padding-right', part: '.plx-input-group__input--before-affix', cat: 'space' },
      { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-input-group__icon', cat: 'color' },
      { id: 'is', label: 'Icon size', css: ['width'], part: '.plx-input-group__icon .plx-icon', cat: 'icon' },
      { id: 'ip', label: 'Space before the icon', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-input-group__icon', cat: 'space' },
      { id: 'js', label: 'Attached corner (start control)', css: ['border-top-right-radius'], part: '.plx-input-group__attached--start .plx-select__control', cat: 'radius' },
      { id: 'je', label: 'Attached corner (end control)', css: ['border-top-left-radius'], part: '.plx-input-group__attached--end', cat: 'radius' }
    ];
    // the group tokens behind a property: o says which parts the variant draws
    var igToken = function (id, state, o) {
      var off = state === 'disabled';
      switch (id) {
        case 'mw': return IG('max-width');
        case 'bg': return IG(off ? 'disabled-background' : state === 'readonly' ? 'readonly-background' : 'background');
        case 'bc': return IG({ hover: 'hover-border-color', focus: 'focus-border-color', invalid: 'invalid-border-color' }[state] || 'border-color');
        case 'bw': return IG('border-width');
        case 'rs': return IG(o.start ? 'joined-radius' : 'radius');
        case 're': return IG(o.end ? 'joined-radius' : 'radius');
        case 'h': return IG('min-height');
        case 'af': return o.prefix != null || o.suffix != null ? IG(off ? 'disabled-text' : 'affix-text') : null;
        case 'aff': return o.prefix != null || o.suffix != null ? IG(/plx-input-group--data/.test(o.cls || '') ? 'data-font-family' : 'affix-font-family') : null;
        case 'afs': return o.prefix != null || o.suffix != null ? IG('affix-font-size') : null;
        case 'pp': return o.prefix != null && !o.icon ? IG('padding-inline') : null;
        case 'sp': return o.suffix != null ? IG('padding-inline') : null;
        case 'ga': return o.prefix != null || o.icon ? IG('affix-gap') : null;
        case 'gb': return o.suffix != null ? IG('affix-gap') : null;
        case 'ic': return o.icon ? IG(off ? 'disabled-text' : 'icon-color') : null;
        case 'is': return o.icon ? IG('icon-size') : null;
        case 'ip': return o.icon ? IG('padding-inline') : null;
        case 'js': return o.select ? 'plx-comp-select-joined-radius' : null; // the attached control's own joined corner (InputGroup joins it: Select and Button take joined)
        case 'je': return o.end ? 'plx-comp-button-joined-radius' : null;
        default: return null;
      }
    };
    var IG_PARTS = { w: 'A', mw: 'A', bg: 'B', bc: 'B', bw: 'B', rs: 'B', re: 'B', h: 'B', af: 'C', aff: 'C', afs: 'C', pp: 'C', sp: 'C', ga: 'D', gb: 'D', ic: 'E', is: 'E', ip: 'E', js: 'F', je: 'F' };
    var igVariant = function (variant, state) {
      var d = state === 'disabled';
      switch (variant) {
        case 'prefix': return { prefix: 'https://', value: 'plenix.lighthouseway.org', label: 'Website' };
        case 'suffix': return { suffix: 'kg', value: '12.5', label: 'Weight' };
        case 'data': return { cls: 'plx-input-group--data', suffix: 'GB', value: '250', label: 'Storage' };
        case 'icon': return { icon: 'search', value: 'Cross 014', label: 'Search assets' };
        case 'button': return { value: 'Cross 014', label: 'Search assets', end: btn({ side: 'end', label: 'Search', disabled: d }) };
        case 'select': return { select: true, value: '1,200.00', label: 'Amount', start: '<span class="plx-select plx-select--joined-end-seam plx-input-group__attached plx-input-group__attached--start"><select tabindex="-1" class="plx-input plx-select__control" aria-label="Currency"' + attr(d, 'disabled') + '><option>USD</option><option>EUR</option></select><span class="plx-select__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></span>' };
        default: return {};
      }
    };
    DS.registerLab('input-group', {
      name: 'Input group', title: 'Plenix input group', file: 'platform/components/InputGroup/input-group.css', compPrefix: /^plx-comp-input-group-/,
      store: 'plenix-input-group-lab-tokens',
      // the widths are variants too: one axis fewer keeps the lab test quick (it draws every size, variant, state and content)
      sizes: [['full', 'Full (default)', '.plx-input-group']],
      variants: [['prefix', 'Prefix text'], ['suffix', 'Suffix text'], ['data', 'Data font'], ['icon', 'Icon'], ['button', 'Button attached'], ['select', 'Select attached'], ['xs', 'XS'], ['sm', 'SM'], ['md', 'MD'], ['lg', 'LG']],
      states: FIELD_STATES.filter(function (s) { return s[0] !== 'readonly' && s[0] !== 'hover'; }), content: [['value', 'Filled']], labels: { size: 'Width', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'full', variant: 'prefix', state: 'default', content: 'value' },
      props: IG_PROPS,
      token: function (id, size, variant, state) { var w = /^(xs|sm|md|lg)$/.test(variant); if (id === 'w') return w ? IG('width-' + variant + '-width') : null; return igToken(id, state, igVariant(w ? 'suffix' : variant, state)); },
      reach: function (full) { var m = /-width-(xs|sm|md|lg)-/.exec(full); return m ? 'every ' + m[1].toUpperCase() + ' input group' : 'every input group (and every number input)'; },
      every: 'every input group',
      html: function (variant, size, state, extraCls) {
        var w = /^(xs|sm|md|lg)$/.test(variant), o = igVariant(w ? 'suffix' : variant, state);
        if (w) { o.value = '5'; o.suffix = '%'; o.label = 'Discount'; }
        o.cls = [o.cls, w ? 'plx-input-group--width-' + variant : ''].filter(Boolean).join(' ');
        return group(o, state, extraCls);
      },
      labelSelector: '.plx-input-group__input', parts: IG_PARTS,
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-input-group__box', side: 'bottom' }, C: { part: '.plx-input-group__affix', side: 'top' }, D: { part: '.plx-input-group__input', side: 'bottom' }, E: { part: '.plx-input-group__icon', side: 'left' }, F: { part: '.plx-input-group__attached', side: 'top' } },
      sections: [['Size', ['w', 'mw', 'h']], ['Field', ['bg', 'bc', 'bw', 'rs', 're']], ['Affixes', ['af', 'aff', 'afs', 'pp', 'sp', 'ga', 'gb']], ['Icon', ['ic', 'is', 'ip']], ['Attached', ['js', 'je']]],
      matrixLabel: 'Input group values by variant and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Number input (<NumberInput>): the group with its formats and stepper forms
    var NI = function (n) { return 'plx-comp-number-input-' + n; };
    var niVariant = function (variant, state) {
      var d = state === 'disabled';
      var minus = function (side, inner, off) { return btn({ side: side, inner: inner, iconOnly: true, icon: 'remove', label: 'Decrease', disabled: d || off }); };
      var plus = function (side, off) { return btn({ side: side, iconOnly: true, icon: 'plus', label: 'Increase', disabled: d || off }); };
      var spin = function (now, text, extra) { return ' role="spinbutton" aria-valuenow="' + now + '"' + (text ? ' aria-valuetext="' + text + '"' : '') + (extra || ''); };
      switch (variant) {
        case 'plain': return { value: '1,920', label: 'Width', attrs: spin(1920) };
        case 'buttons': return { cls: 'plx-number-input--buttons', value: '3', label: 'Copies', attrs: spin(3), end: minus('end', true) + plus('end') };
        case 'quantity': return { cls: 'plx-number-input--quantity plx-input-group--compact', value: '2', label: 'Quantity, Blue chair', attrs: spin(2), start: minus('start'), end: plus('end') };
        case 'currency': return { prefix: '$', value: '1,200.00', label: 'Price', attrs: spin(1200, '$1,200.00') };
        case 'percent': return { suffix: '%', value: '15', label: 'Discount', attrs: spin(15, '15%') };
        case 'unit': return { suffix: 'kg', value: '12.5', label: 'Weight', attrs: spin(12.5, '12.5 kg') };
        case 'minmax': return { cls: 'plx-number-input--buttons', value: '1', label: 'Seats', attrs: spin(1, null, ' aria-valuemin="1" aria-valuemax="10"'), end: minus('end', true, true) + plus('end') };
        default: return {};
      }
    };
    DS.registerLab('number-input', {
      name: 'Number input', title: 'Plenix number input', file: 'platform/components/NumberInput/number-input.css', compPrefix: /^plx-comp-(number-input|input-group|input)-/,
      store: 'plenix-number-input-lab-tokens', sizes: [['full', 'Full (default)', '.plx-number-input']],
      variants: [['plain', 'Plain'], ['buttons', 'Stepper buttons'], ['quantity', 'Quantity (− 1 +)'], ['currency', 'Currency'], ['percent', 'Percentage'], ['unit', 'With unit'], ['minmax', 'Min and max'], ['invalid', 'Invalid']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['disabled', 'Disabled']], content: [['value', 'Filled']],
      labels: { size: 'Width', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'full', variant: 'buttons', state: 'default', content: 'value' },
      props: [
        { id: 'ff', label: 'Value font', css: ['font-family'], part: '.plx-input-group__input', cat: 'font' },
        { id: 'qw', label: 'Quantity width', css: ['inline-size'], show: 'width', part: '.plx-input-group__box', cat: 'size' },
        { id: 'qp', label: 'Space around the count', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-input-group__input', cat: 'space' }
      ].concat(IG_PROPS.filter(function (p) { return /^(bc|bg|rs|re|af|aff|sp|pp|je|js|w)$/.test(p.id); })),
      token: function (id, size, variant, state) {
        var st = variant === 'invalid' ? 'invalid' : state, o = niVariant(variant === 'invalid' ? 'plain' : variant, state);
        if (id === 'ff') return 'plx-comp-input-data-font-family';
        if (id === 'qw' || id === 'qp') return variant === 'quantity' ? IG(id === 'qw' ? 'compact-box-width' : 'compact-padding-inline') : null; // the quantity form is the group's compact form
        if (id === 'w') return size === 'sm' && variant !== 'quantity' ? IG('width-sm-width') : null;
        if (id === 'aff') return o.prefix != null || o.suffix != null ? IG('data-font-family') : null;
        return igToken(id, st, o);
      },
      reach: function (full) { return /quantity/.test(full) ? 'every quantity selector' : /input-group/.test(full) ? 'every number input and input group' : 'every number input'; },
      every: 'every number input',
      html: function (variant, size, state, extraCls) {
        var o = niVariant(variant === 'invalid' ? 'plain' : variant, state);
        o.cls = ['plx-number-input', o.cls, size === 'sm' && variant !== 'quantity' ? 'plx-input-group--width-sm' : '', 'plx-input-group--data'].filter(Boolean).join(' ');
        return group(o, variant === 'invalid' ? 'invalid' : state, extraCls);
      },
      labelSelector: '.plx-input-group__input', parts: Object.assign({ ff: 'D', qw: 'B', qp: 'D' }, IG_PARTS),
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-input-group__box', side: 'bottom' }, C: { part: '.plx-input-group__affix', side: 'top' }, D: { part: '.plx-input-group__input', side: 'bottom' }, F: { part: '.plx-input-group__attached', side: 'top' } },
      sections: [['Value', ['ff', 'qw', 'qp', 'w']], ['Field', ['bg', 'bc', 'rs', 're']], ['Affixes', ['af', 'aff', 'pp', 'sp']], ['Stepper buttons', ['js', 'je']]],
      matrixLabel: 'Number input values by variant and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- File input (<FileInput>): the button over the native input, the summary line and the file list
    var FI = function (n) { return 'plx-comp-file-input-' + n; };
    var FILES = [['brief.pdf', '1.2 MB'], ['cover.png', '840 kB'], ['notes.docx', '36 kB']];
    DS.registerLab('file-input', {
      name: 'File input', title: 'Plenix file input', file: 'platform/components/FileInput/file-input.css', compPrefix: /^plx-comp-file-input-/,
      store: 'plenix-file-input-lab-tokens', sizes: [['default', 'Default', '.plx-file-input']],
      variants: [['button', 'Button (default)'], ['list', 'With file list'], ['multiple', 'Multiple'], ['accept', 'Accept types']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['disabled', 'Disabled']], content: [['chosen', 'Files chosen'], ['none', 'No file chosen']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'list', state: 'default', content: 'chosen' },
      props: [
        { id: 'rg', label: 'Space above the list', css: ['row-gap'], cat: 'space' },
        { id: 'gap', label: 'Space beside the button', css: ['column-gap'], part: '.plx-file-input__row', cat: 'space' },
        { id: 'sc', label: 'Summary color', css: ['color'], part: '.plx-file-input__summary', cat: 'color' },
        { id: 'sf', label: 'Summary font', css: ['font-family'], part: '.plx-file-input__summary--file', cat: 'font' },
        { id: 'ss', label: 'Summary size', css: ['font-size'], part: '.plx-file-input__summary', cat: 'font-size' },
        { id: 'lg', label: 'Space between files', css: ['row-gap'], part: '.plx-file-input__list', cat: 'space' },
        { id: 'ig', label: 'Space inside a file row', css: ['column-gap'], part: '.plx-file-input__item', cat: 'space' },
        { id: 'ih', label: 'File row height', css: ['min-block-size'], show: 'min-height', part: '.plx-file-input__item', cat: 'control-height' },
        { id: 'icz', label: 'File icon size', css: ['width'], part: '.plx-file-input__icon>.plx-icon', cat: 'icon' },
        { id: 'icc', label: 'File icon color', css: ['color'], part: '.plx-file-input__icon>.plx-icon', cat: 'color' },
        { id: 'nc', label: 'File name color', css: ['color'], part: '.plx-file-input__name', cat: 'color' },
        { id: 'nf', label: 'File name font', css: ['font-family'], part: '.plx-file-input__name', cat: 'font' },
        { id: 'ns', label: 'File name size', css: ['font-size'], part: '.plx-file-input__name', cat: 'font-size' },
        { id: 'zc', label: 'File size color', css: ['color'], part: '.plx-file-input__size', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var chosen = content !== 'none', list = variant === 'list' && chosen, one = chosen && (variant === 'button' || variant === 'accept');
        switch (id) {
          case 'rg': return FI('row-gap');
          case 'gap': return FI('gap');
          case 'sc': return one ? FI('name-text') : FI('summary-text');
          case 'sf': return one ? FI('data-font-family') : null;
          case 'ss': return FI('summary-font-size');
          case 'lg': return list ? FI('list-gap') : null;
          case 'ig': return list ? FI('item-gap') : null;
          case 'ih': return list ? FI('item-min-height') : null;
          case 'icz': return list ? FI('icon-size') : null;
          case 'icc': return list ? FI('icon-color') : null;
          case 'nc': return list ? FI('name-text') : null;
          case 'nf': return list ? FI('data-font-family') : null;
          case 'ns': return list ? FI('name-font-size') : null;
          case 'zc': return list ? FI('summary-text') : null;
          default: return null;
        }
      },
      reach: function () { return 'every file input'; }, every: 'every file input',
      html: function (variant, size, state, extraCls, ui) {
        var chosen = ui.content !== 'none', many = variant === 'multiple' || variant === 'list', d = state === 'disabled';
        var choose = many ? 'Choose files' : 'Choose file';
        var summary = !chosen ? 'No file chosen' : many ? '3 files' : variant === 'accept' ? 'contract.pdf' : 'brief.pdf';
        var list = variant === 'list' && chosen ? '<ul class="plx-file-input__list">' + FILES.map(function (f) {
          return '<li class="plx-file-input__item"><span class="plx-file-input__icon">' + icon('doc-text') + '</span>' + '<span class="plx-file-input__name">' + f[0] + '</span><span class="plx-file-input__size">' + f[1] + '</span>'
            + '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only plx-file-input__remove" aria-label="Remove ' + f[0] + '"><span class="plx-button__icon">' + icon('close') + '</span></button></li>';
        }).join('') + '</ul>' : '';
        return '<div class="plx-file-input' + (d ? ' is-disabled' : '') + ex(extraCls) + '"><div class="plx-file-input__row"><label class="plx-file-input__trigger">'
          + '<input type="file" tabindex="-1" class="plx-file-input__native plx-visually-hidden" aria-label="' + choose + '"' + attr(many, 'multiple') + attr(variant === 'accept', 'accept=".pdf,.docx"') + attr(d, 'disabled') + '>'
          + '<span class="plx-button plx-button--secondary plx-file-input__button' + (state === 'focus' ? ' is-focus-visible' : '') + '" aria-hidden="true"' + attr(d, 'aria-disabled="true"') + '><span class="plx-button__icon">' + icon('attachment') + '</span><span class="plx-button__label">' + choose + '</span></span></label>'
          + '<span class="plx-file-input__summary' + (chosen && !many ? ' plx-file-input__summary--file' : '') + '">' + summary + '</span></div>' + list + '</div>';
      },
      labelSelector: '.plx-file-input__summary', parts: { rg: 'A', gap: 'B', sc: 'B', sf: 'B', ss: 'B', lg: 'C', ig: 'C', ih: 'C', icz: 'C', icc: 'C', nc: 'D', nf: 'D', ns: 'D', zc: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-file-input__summary', side: 'top' }, C: { part: '.plx-file-input__item', side: 'left' }, D: { part: '.plx-file-input__name', side: 'bottom' } },
      sections: [['Layout', ['rg', 'gap']], ['Summary', ['sc', 'sf', 'ss']], ['File list', ['lg', 'ig', 'ih', 'icz', 'icc', 'nc', 'nf', 'ns', 'zc']]],
      matrixLabel: 'File input values by variant and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Code editor (<CodeEditor>): the field, the gutter, and the textarea under its colored copy
    var CE = function (n) { return 'plx-comp-code-editor-' + n; };
    var tok = function (kind, text) { return '<span class="plx-code-block__tok--' + kind + '">' + text + '</span>'; };
    var CODE = {
      jsx: { lines: 3, raw: 'export function Badge({ count }) {\n  return &lt;Count value={count} /&gt;;\n}', html: tok('keyword', 'export') + ' ' + tok('keyword', 'function') + ' ' + tok('function', 'Badge') + '({ count }) {\n  ' + tok('keyword', 'return') + ' &lt;' + tok('tag', 'Count') + ' ' + tok('attribute', 'value') + '={count} /&gt;;\n}' },
      css: { lines: 3, raw: '.plx-badge {\n  color: var(--plx-sys-content-default);\n}', html: tok('selector', '.plx-badge ') + '{\n  ' + tok('attribute', 'color') + ': ' + tok('function', 'var') + '(' + tok('variable', '--plx-sys-content-default') + ');\n}' },
      html: { lines: 2, raw: '&lt;section class="cards"&gt;\n&lt;/section&gt;', html: '&lt;' + tok('tag', 'section') + ' ' + tok('attribute', 'class') + '=' + tok('string', '"cards"') + '&gt;\n&lt;/' + tok('tag', 'section') + '&gt;' },
      text: { lines: 2, raw: 'Plain notes, not colored.\nA second line.', html: 'Plain notes, not colored.\nA second line.' }
    };
    DS.registerLab('code-editor', {
      name: 'Code editor', title: 'Plenix code editor', file: 'platform/components/CodeEditor/code-editor.css', compPrefix: /^plx-comp-code-editor-/,
      store: 'plenix-code-editor-lab-tokens', sizes: [['default', 'Default', '.plx-code-editor']],
      // the languages are variants too: one axis fewer keeps the lab test quick (it draws every size, variant, state and content)
      variants: [['plain', 'Plain'], ['numbers', 'With line numbers'], ['readonly', 'Read-only'], ['tall', 'Tall (scrolls)'], ['jsx', 'JSX'], ['css', 'CSS'], ['html', 'HTML'], ['text', 'Text'],
        ['h-sm', 'Height sm'], ['h-md', 'Height md (default)'], ['h-lg', 'Height lg']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['code', 'Code']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'numbers', state: 'default', content: 'code' },
      props: [
        { id: 'bg', label: 'Fill', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: SIDES('border-%-color'), show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: SIDES('border-%-width'), show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'h', label: 'Least height', css: ['min-block-size'], show: 'min-height', part: '.plx-code-editor__scroller', cat: 'size' },
        { id: 'mh', label: 'Most height (tall)', css: ['max-block-size'], show: 'max-height', part: '.plx-code-editor__scroller', cat: 'size' },
        { id: 'fg', label: 'Code color', css: ['color'], part: '.plx-code-editor__pre', cat: 'color' },
        { id: 'cc', label: 'Caret color', css: ['caret-color'], part: '.plx-code-editor__input', cat: 'color' },
        { id: 'ff', label: 'Code font', css: ['font-family'], part: '.plx-code-editor__pre', cat: 'font' },
        { id: 'fs', label: 'Code size', css: ['font-size'], part: '.plx-code-editor__pre', cat: 'font-size' },
        { id: 'lh', label: 'Line height', css: ['line-height'], part: '.plx-code-editor__pre', cat: 'line-height' },
        { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-code-editor__pre', cat: 'space' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-code-editor__pre', cat: 'space' },
        { id: 'gc', label: 'Line number color', css: ['color'], part: '.plx-code-editor__gutter', cat: 'color' },
        { id: 'gb', label: 'Gutter divider', css: ['border-inline-end-color'], show: 'border-right-color', part: '.plx-code-editor__gutter', cat: 'color' },
        { id: 'gp', label: 'Gutter padding', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-code-editor__gutter', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var ro = variant === 'readonly', off = state === 'disabled', nums = variant === 'numbers';
        switch (id) {
          case 'bg': return CE(off ? 'disabled-background' : ro ? 'readonly-background' : 'background');
          case 'bc': return CE({ hover: 'hover-border-color', focus: 'focus-border-color', invalid: 'invalid-border-color' }[state] || 'border-color');
          case 'bw': return CE('border-width');
          case 'rad': return CE('radius');
          case 'h': return CE('height-' + (/^h-/.test(variant) ? variant.slice(2) : 'md') + '-min-height');
          case 'mh': return variant === 'tall' ? CE('tall-max-height') : null;
          case 'fg': return CE(off ? 'disabled-text' : 'text');
          case 'cc': return CE('caret-color');
          case 'ff': return CE('font-family');
          case 'fs': return CE('font-size');
          case 'lh': return CE('line-height');
          case 'px': return CE('padding-inline');
          case 'py': return CE('padding-block');
          case 'gc': return nums ? CE('gutter-text') : null;
          case 'gb': return nums ? CE('gutter-border-color') : null;
          case 'gp': return nums ? CE('gutter-padding-inline') : null;
          default: return null;
        }
      },
      reach: function (full) { return /gutter/.test(full) ? 'every code editor with line numbers' : /readonly/.test(full) ? 'every read-only code editor' : 'every code editor'; },
      every: 'every code editor',
      html: function (variant, size, state, extraCls, ui) {
        var lang = CODE[variant] ? variant : 'jsx', c = CODE[lang], ro = variant === 'readonly', off = state === 'disabled';
        var cls = 'plx-code-editor plx-code-editor--height-' + (/^h-/.test(variant) ? variant.slice(2) : 'md') + (variant === 'numbers' ? ' plx-code-editor--line-numbers' : '') + (ro ? ' plx-code-editor--readonly' : '') + (variant === 'tall' ? ' plx-code-editor--tall' : '')
          + ({ hover: ' is-hover', focus: ' is-focused', invalid: ' is-invalid', disabled: ' is-disabled' }[state] || '') + ex(extraCls);
        var gutter = variant === 'numbers' ? '<div class="plx-code-editor__gutter" aria-hidden="true">' + Array.from({ length: c.lines }, function (_, i) { return '<span class="plx-code-editor__number">' + (i + 1) + '</span>'; }).join('') + '</div>' : '';
        return '<div class="' + cls + '"><div class="plx-code-editor__scroller">' + gutter + '<div class="plx-code-editor__code">'
          + '<textarea tabindex="-1" class="plx-code-editor__input" rows="1" wrap="off" spellcheck="false" aria-label="Code"' + attr(ro, 'readonly') + attr(off, 'disabled') + attr(state === 'invalid', 'aria-invalid="true"') + '>' + c.raw + '</textarea>'
          + '<pre class="plx-code-editor__pre" aria-hidden="true"><code data-plx-language="' + lang + '">' + c.html + '</code></pre></div></div></div>';
      },
      labelSelector: '.plx-code-editor__pre', parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', h: 'B', mh: 'B', fg: 'C', cc: 'C', ff: 'C', fs: 'C', lh: 'C', px: 'C', py: 'C', gc: 'D', gb: 'D', gp: 'D' },
      anchors: { A: { part: null, side: 'right' }, B: { part: '.plx-code-editor__scroller', side: 'bottom' }, C: { part: '.plx-code-editor__pre', side: 'top' }, D: { part: '.plx-code-editor__gutter', side: 'left' } },
      sections: [['Field', ['bg', 'bc', 'bw', 'rad']], ['Size', ['h', 'mh']], ['Code', ['fg', 'cc', 'ff', 'fs', 'lh', 'px', 'py']], ['Line numbers', ['gc', 'gb', 'gp']]],
      matrixLabel: 'Code editor values by variant and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Variants and states · ' + HEAD
    });
  })();
}
