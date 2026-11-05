/* global DS */
/* Plenix master spec · the form controls' labs (batch 253 on): each control's description for the shared component lab
   (component-lab.js). A description names the control's widths or sizes, its styles (the matrix columns), its states (the
   rows), its content, every property the lab reads with the one --plx-comp-* token that sets it at a style and state, and
   the markup the control renders. The tokens are the form controls' component tokens (batch 223). */
(function () {
  var SIDES = function (prop) { return ['top', 'right', 'bottom', 'left'].map(function (s) { return prop.replace('%', s); }); };
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var attr = function (on, a) { return on ? ' ' + a : ''; };
  var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
  var IN = function (n) { return 'plx-comp-input-' + n; };

  // ---- the input family: Text field, Text area and Native select's control are all .plx-input, drawn by the input tokens
  // (input.css); each adds its own properties and tokens on top (opts.props, opts.token)
  var FIELD_STATES = [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['readonly', 'Read-only'], ['disabled', 'Disabled']];
  var INPUT_PROPS = [
    { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color', extra: ['transparent'] },
    { id: 'bc', label: 'Border color', css: SIDES('border-%-color'), show: 'border-top-color', cat: 'color' },
    { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
    { id: 'ph', label: 'Placeholder color', css: ['color'], pseudo: '::placeholder', cat: 'color' },
    { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
    { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
    { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size', extra: ['none'] },
    { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
    { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
    { id: 'bw', label: 'Border width', css: SIDES('border-%-width'), show: 'border-top-width', cat: 'border-width', extra: ['0'] },
    { id: 'ff', label: 'Font family', css: ['font-family'], cat: 'font' },
    { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
    { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
    { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' },
    { id: 'm', label: 'Margin', css: ['margin-block-end', 'margin-block-start', 'margin-inline-end', 'margin-inline-start'], show: 'margin-top', cat: 'space', extra: ['0'] },
    { id: 'sh', label: 'Box shadow', css: ['box-shadow'], cat: 'shadow', extra: ['none'] }
  ];
  // the input token behind a property at a state (shared by the family)
  var inputToken = function (id, state) {
    switch (id) {
      case 'bg': return IN(state === 'disabled' ? 'disabled-background' : state === 'readonly' ? 'readonly-background' : state === 'invalid' ? 'invalid-background' : 'background');
      case 'bc': return IN({ hover: 'hover-border-color', focus: 'focus-border-color', invalid: 'invalid-border-color' }[state] || 'border-color');
      case 'fg': return IN(state === 'disabled' ? 'disabled-text' : 'text');
      case 'ph': return IN('placeholder-text');
      case 'h': return IN('min-height');
      case 'mw': return IN('max-width');
      case 'px': return IN('padding-inline');
      case 'rad': return IN('radius');
      case 'bw': return IN('border-width');
      case 'ff': return IN('font-family');
      case 'fs': return IN('font-size');
      case 'lh': return IN('line-height');
      default: return null;
    }
  };
  var WHEN = { hover: 'hovered', focus: 'focused', invalid: 'invalid', disabled: 'disabled', readonly: 'read-only' };
  var inputReach = function (full) {
    var st = /-(hover|focus|invalid|disabled|readonly)-/.exec(full), who = 'every text field, text area and native select';
    return st ? who + ' when ' + WHEN[st[1]] : who;
  };
  // the documentation classes for the pointer and focus states, the attributes for the others
  var stateCls = function (state) { return state === 'hover' ? 'is-hover' : state === 'focus' ? 'is-focus-visible' : ''; };
  var stateAttrs = function (state) { return attr(state === 'readonly', 'readonly') + attr(state === 'disabled', 'disabled') + attr(state === 'invalid', 'aria-invalid="true"'); };
  var inputLab = function (id, o) {
    DS.registerLab(id, {
      name: o.name, title: 'Plenix ' + o.name.toLowerCase(), file: 'platform/components/Input/input.css', compPrefix: o.prefix,
      store: 'plenix-' + id + '-lab-tokens', sizes: o.sizes, variants: o.variants, states: FIELD_STATES, content: [['value', 'Filled'], ['placeholder', 'Empty (placeholder)']],
      labels: { size: 'Width', variant: 'Style', state: 'State', content: 'Content' },
      defaults: { size: o.sizes[0][0] === 'xs' ? 'md' : o.sizes[0][0], variant: o.variants[0][0], state: 'default', content: 'value' },
      props: o.props, token: o.token, reach: o.reach, every: 'every ' + o.name.toLowerCase(), html: o.html, labelSelector: null,
      parts: Object.assign({ bg: 'A', px: 'B', pe: 'B', py: 'B', h: 'C', w: 'C', mw: 'C', m: 'D', rad: 'E', bc: 'E', bw: 'E', fg: 'F', ph: 'F', fs: 'F', fw: 'F', ff: 'F', lh: 'F', sh: 'G' }, o.parts || {}),
      sections: o.sections,
      matrixLabel: o.name + ' styles by state',
      statesHead: 'States · every style (click a field to inspect it; the dashed outline marks the one shown below)'
    });
  };

  // ---- Text field (<Input>, .plx-input): widths and the data and emphasis styles have their own tokens
  inputLab('text-field', {
    name: 'Text field', prefix: /^plx-comp-input-/,
    sizes: [['xs', 'XS', '.plx-input--width-xs'], ['sm', 'SM', '.plx-input--width-sm'], ['md', 'MD', '.plx-input--width-md'], ['lg', 'LG', '.plx-input--width-lg'], ['full', 'Full (default)', '.plx-input']],
    variants: [['default', 'Text'], ['data', 'Data'], ['emphasis', 'Emphasis']],
    props: INPUT_PROPS,
    token: function (id, size, variant, state) {
      if (id === 'w') return size === 'full' ? null : IN('width-' + size + '-width');
      if (id === 'ff') return IN(variant === 'data' ? 'data-font-family' : 'font-family');
      if (id === 'fw') return variant === 'emphasis' ? IN('emphasis-font-weight') : null;
      return inputToken(id, state);
    },
    reach: function (full) {
      var m = /^plx-comp-input-width-([a-z]+)-/.exec(full); if (m) return 'every ' + m[1].toUpperCase() + ' text field';
      if (/-data-/.test(full)) return 'every data text field';
      if (/-emphasis-/.test(full)) return 'every emphasis text field';
      return inputReach(full);
    },
    // <input class="plx-input [plx-input--width-*] [plx-input--data|--emphasis]">
    html: function (variant, size, state, extraCls, ui) {
      var cls = ['plx-input', size !== 'full' ? 'plx-input--width-' + size : '', variant === 'data' ? 'plx-input--data' : '', variant === 'emphasis' ? 'plx-input--emphasis' : '', stateCls(state), extraCls || ''].filter(Boolean).join(' ');
      var value = ui.content === 'placeholder' ? '' : variant === 'data' ? 'AST-1042' : 'Cross 014';
      return '<input type="text" class="' + cls + '" value="' + esc(value) + '" placeholder="Asset name" aria-label="Asset name" tabindex="-1"' + stateAttrs(state) + '>';
    },
    sections: [['Color', ['bg', 'bc', 'fg', 'ph']], ['Size and shape', ['h', 'w', 'mw', 'rad']], ['Typography', ['ff', 'fs', 'fw', 'lh']], ['Border', ['bw']], ['Spacing', ['px']]]
  });

  // ---- Text area (<Textarea>, .plx-input.plx-input--textarea): the input tokens, with its own type, height and block padding
  var TA = function (n) { return 'plx-comp-textarea-' + n; };
  inputLab('text-area', {
    name: 'Text area', prefix: /^plx-comp-(input|textarea)-/,
    sizes: [['full', 'Full width', '.plx-input--textarea']],
    variants: [['default', 'Text area']],
    props: INPUT_PROPS.filter(function (p) { return p.id !== 'w'; }).concat([
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] }]),
    token: function (id, size, variant, state) {
      if (id === 'fs') return TA('font-size');
      if (id === 'lh') return TA('line-height');
      if (id === 'h') return TA('min-height');
      if (id === 'py') return TA('padding-block');
      return inputToken(id, state);
    },
    reach: function (full) { return /^plx-comp-textarea-/.test(full) ? 'every text area' : inputReach(full); },
    // <textarea class="plx-input plx-input--textarea" rows="3">
    html: function (variant, size, state, extraCls, ui) {
      var cls = ['plx-input', 'plx-input--textarea', stateCls(state), extraCls || ''].filter(Boolean).join(' ');
      return '<textarea class="' + cls + '" rows="3" placeholder="Write a note" aria-label="Notes" tabindex="-1"' + stateAttrs(state) + '>' + (ui.content === 'placeholder' ? '' : 'Gold leaf on the border') + '</textarea>';
    },
    sections: [['Color', ['bg', 'bc', 'fg', 'ph']], ['Size and shape', ['h', 'mw', 'rad']], ['Typography', ['ff', 'fs', 'lh']], ['Border', ['bw']], ['Spacing', ['px', 'py']]]
  });

  // ---- Native select (<Select>, .plx-select > select.plx-input.plx-select__control): the input tokens on the control, its
  // own end padding, and the wrapper's width and chevron (.plx-select__chevron, an icon child)
  var SE = function (n) { return 'plx-comp-select-' + n; };
  inputLab('native-select', {
    name: 'Native select', prefix: /^plx-comp-(input|select)-/,
    sizes: [['full', 'Full width', '.plx-select']],
    variants: [['default', 'Native select']],
    props: INPUT_PROPS.filter(function (p) { return p.id !== 'w' && p.id !== 'ph' && p.id !== 'mw'; }).concat([
      { id: 'pe', label: 'Padding right (the chevron\'s room)', css: ['padding-inline-end'], show: 'padding-right', cat: 'space', extra: ['0'] },
      { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', host: 'parent', cat: 'size', extra: ['none'] },
      { id: 'cc', label: 'Chevron color', css: ['color'], host: 'parent', part: '.plx-select__chevron', cat: 'color' },
      { id: 'cw', label: 'Chevron width', css: ['inline-size'], show: 'width', host: 'parent', part: '.plx-select__chevron', cat: 'icon' },
      { id: 'chh', label: 'Chevron height', css: ['block-size'], show: 'height', host: 'parent', part: '.plx-select__chevron', cat: 'icon' },
      { id: 'ci', label: 'Chevron inset from the end', css: ['inset-inline-end'], show: 'right', host: 'parent', part: '.plx-select__chevron', cat: 'space' }]),
    token: function (id, size, variant, state) {
      if (id === 'pe') return SE('control-padding-inline-end');
      if (id === 'mw') return SE('max-width');
      if (id === 'cc') return SE('after-background');
      if (id === 'cw') return SE('after-width');
      if (id === 'chh') return SE('after-height');
      if (id === 'ci') return SE('after-inset-inline-end');
      return inputToken(id, state);
    },
    reach: function (full) { return /^plx-comp-select-/.test(full) ? 'every native select' : inputReach(full); },
    parts: { pe: 'B', cc: 'G', cw: 'G', chh: 'G', ci: 'G' },
    // <span class="plx-select"><select class="plx-input plx-select__control">…</select><span class="plx-select__chevron">…</span></span>
    html: function (variant, size, state, extraCls, ui) {
      var cls = ['plx-input', 'plx-select__control', stateCls(state), extraCls || ''].filter(Boolean).join(' ');
      var pick = ui.content === 'placeholder' ? '' : 'a';
      var opt = function (v, l) { return '<option value="' + v + '"' + (v === pick ? ' selected' : '') + '>' + l + '</option>'; };
      return '<span class="plx-select"><select class="' + cls + '" aria-label="Category" tabindex="-1"' + stateAttrs(state) + '>' + opt('', 'Choose…') + opt('a', 'Crosses') + opt('b', 'Borders') + '</select><span class="plx-select__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></span>';
    },
    sections: [['Color', ['bg', 'bc', 'fg', 'cc']], ['Size and shape', ['h', 'mw', 'rad', 'cw', 'chh']], ['Typography', ['ff', 'fs', 'lh']], ['Border', ['bw']], ['Spacing', ['pe', 'ci']]]
  });

  // ---- the choice controls (batch 255): a label around a native control and its text (checkbox.css). They are measured
  // part by part (p.part), and their anatomy letters point at their parts (spec.anchors).
  var CK = function (n) { return 'plx-comp-check-' + n; };
  var BOX = '.plx-check__input';
  // the row and the box every check (checkbox, radio) shares; focus and disabled draw only in those states
  var CHECK_PROPS = [
    { id: 'ac', label: 'Box color (checked)', css: ['accent-color'], part: BOX, cat: 'color' },
    { id: 'iw', label: 'Box width', css: ['inline-size'], show: 'width', part: BOX, cat: 'icon' },
    { id: 'ih', label: 'Box height', css: ['block-size'], show: 'height', part: BOX, cat: 'icon' },
    { id: 'im', label: 'Box offset from the top', css: ['margin-block-start'], show: 'margin-top', part: BOX, cat: 'space', extra: ['0'] },
    { id: 'fo', label: 'Focus outline color', css: ['outline-color'], part: BOX, cat: 'color' },
    { id: 'fof', label: 'Focus outline offset', css: ['outline-offset'], part: BOX, cat: 'space' },
    { id: 'fow', label: 'Focus outline width', css: ['outline-width'], part: BOX, cat: 'border-width' },
    { id: 'lc', label: 'Label color', css: ['color'], part: '.plx-check__label', cat: 'color' },
    { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
    { id: 'gap', label: 'Gap (box to text)', css: ['column-gap'], cat: 'space', extra: ['0'] },
    { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
    { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
    { id: 'op', label: 'Opacity (disabled)', css: ['opacity'], cat: 'opacity' }
  ];
  var checkToken = function (id, state) {
    switch (id) {
      case 'ac': return CK('input-accent-color');
      case 'iw': return CK('input-width');
      case 'ih': return CK('input-height');
      case 'im': return CK('input-margin-block-start');
      case 'fo': return state === 'focus' ? CK('input-focus-outline-color') : null;
      case 'fof': return state === 'focus' ? CK('input-focus-outline-offset') : null;
      case 'fow': return state === 'focus' ? CK('input-focus-outline-width') : null;
      case 'lc': return CK('label-text');
      case 'fs': return CK('font-size');
      case 'gap': return CK('gap');
      case 'h': return CK('min-height');
      case 'py': return CK('padding-block');
      case 'op': return state === 'disabled' ? CK('input-disabled-opacity') : null;
      default: return null;
    }
  };
  var CHECK_PARTS = { ac: 'A', iw: 'A', ih: 'A', im: 'A', fo: 'B', fof: 'B', fow: 'B', lc: 'C', fs: 'C', gap: 'E', h: 'E', py: 'E', op: 'F' };
  var CHECK_ANCHORS = { A: { part: BOX, side: 'top' }, B: { part: BOX, side: 'left' }, C: { part: '.plx-check__label', side: 'top' }, D: { part: '.plx-check__description', side: 'bottom' }, E: { part: null, side: 'right' }, F: { part: null, side: 'left' } };
  var CHECK_STATES = [['default', 'Default'], ['focus', 'Focus'], ['disabled', 'Disabled']];
  var checkReach = function (full) { return /-(focus)-/.test(full) ? 'every checkbox and radio when focused' : /-disabled-/.test(full) ? 'every disabled checkbox and radio' : 'every checkbox and radio'; };
  var uid = 0;

  // ---- Checkbox (<Checkbox>, label.plx-check > input[type=checkbox].plx-check__input + text): unchecked, checked and partly
  // checked (the indeterminate property, set after drawing)
  DS.registerLab('checkbox', {
    name: 'Checkbox', title: 'Plenix checkbox', file: 'platform/components/Checkbox/checkbox.css', compPrefix: /^plx-comp-check-/,
    store: 'plenix-checkbox-lab-tokens', sizes: [['md', 'Default', '.plx-check']], variants: [['unchecked', 'Unchecked'], ['checked', 'Checked'], ['mixed', 'Partly checked']],
    states: CHECK_STATES, content: [['desc', 'Label and description']],
    labels: { size: 'Size', variant: 'Value', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'checked', state: 'default', content: 'desc' },
    props: CHECK_PROPS.concat([
      { id: 'trg', label: 'Gap (label to description)', css: ['row-gap'], part: '.plx-check__text', cat: 'space', extra: ['0'] },
      { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-check__description', cat: 'color' },
      { id: 'dfs', label: 'Description font size', css: ['font-size'], part: '.plx-check__description', cat: 'font-size' }]),
    token: function (id, size, variant, state) {
      if (id === 'trg') return CK('text-row-gap');
      if (id === 'dc') return CK('description-text');
      if (id === 'dfs') return CK('description-font-size');
      return checkToken(id, state);
    },
    reach: checkReach, every: 'every checkbox',
    html: function (variant, size, state, extraCls) {
      return '<label class="plx-check' + (extraCls ? ' ' + extraCls : '') + '"><input type="checkbox" class="plx-check__input' + (state === 'focus' ? ' is-focus-visible' : '') + '"'
        + attr(variant === 'checked', 'checked') + attr(variant === 'mixed', 'data-lab-mixed') + attr(state === 'disabled', 'disabled') + ' tabindex="-1" aria-label="Notify me">'
        + '<span class="plx-check__text"><span class="plx-check__label">Notify me</span><span class="plx-check__description">Email me when an asset changes</span></span></label>';
    },
    after: function (doc) { doc.querySelectorAll('[data-lab-mixed]').forEach(function (i) { i.indeterminate = true; }); },
    labelSelector: '.plx-check__label',
    parts: Object.assign({ trg: 'D', dc: 'D', dfs: 'D' }, CHECK_PARTS), anchors: CHECK_ANCHORS,
    sections: [['Box', ['ac', 'iw', 'ih', 'im']], ['Focus', ['fo', 'fof', 'fow']], ['Text', ['lc', 'fs', 'dc', 'dfs']], ['Spacing', ['gap', 'trg', 'h', 'py']], ['Disabled', ['op']]],
    matrixLabel: 'Checkbox values by state',
    statesHead: 'States · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Radio group (<RadioGroup>, fieldset.plx-radio-group > legend + label.plx-check radios): column or row; the check
  // tokens draw each radio, the radio-group tokens the legend and the row gap
  var RG = function (n) { return 'plx-comp-radio-group-' + n; };
  DS.registerLab('radio-group', {
    name: 'Radio group', title: 'Plenix radio group', file: 'platform/components/Checkbox/checkbox.css', compPrefix: /^plx-comp-(check|radio-group|field-label-control-gap)/,
    store: 'plenix-radio-group-lab-tokens', sizes: [['md', 'Default', '.plx-radio-group']], variants: [['column', 'Column'], ['row', 'Row']],
    states: CHECK_STATES, content: [['two', 'Two options']],
    labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'column', state: 'default', content: 'two' },
    // the first radio stands for every radio (part '.plx-check' and inside it)
    props: CHECK_PROPS.map(function (p) { return Object.assign({}, p, { part: p.part ? '.plx-check ' + p.part : '.plx-check' }); }).concat([
      { id: 'lgc', label: 'Legend color', css: ['color'], part: '.plx-radio-group__legend', cat: 'color' },
      { id: 'lgfs', label: 'Legend font size', css: ['font-size'], part: '.plx-radio-group__legend', cat: 'font-size' },
      { id: 'lgfw', label: 'Legend font weight', css: ['font-weight'], part: '.plx-radio-group__legend', cat: 'font-weight' },
      { id: 'lgm', label: 'Gap (legend to options)', css: ['margin-block-end'], show: 'margin-bottom', part: '.plx-radio-group__legend', cat: 'space', extra: ['0'] },
      { id: 'rg', label: 'Gap between options (row)', css: ['column-gap'], cat: 'space', extra: ['0'] }]),
    token: function (id, size, variant, state) {
      if (id === 'lgc') return RG('legend-text');
      if (id === 'lgfs') return RG('legend-font-size');
      if (id === 'lgfw') return RG('legend-font-weight');
      if (id === 'lgm') return 'plx-comp-field-label-control-gap';
      if (id === 'rg') return variant === 'row' ? RG('row-gap') : null;
      return checkToken(id, state);
    },
    reach: function (full) { return /radio-group/.test(full) ? 'every radio group' : /field-label-control-gap/.test(full) ? 'every field label and legend' : checkReach(full); },
    every: 'every radio group',
    html: function (variant, size, state, extraCls) {
      var n = 'lab-radio-' + (++uid);
      var radio = function (label, on, focus) { return '<label class="plx-check"><input type="radio" class="plx-check__input' + (focus ? ' is-focus-visible' : '') + '" name="' + n + '"' + attr(on, 'checked') + ' tabindex="-1"><span class="plx-check__text"><span class="plx-check__label">' + label + '</span></span></label>'; };
      return '<fieldset class="plx-radio-group plx-radio-group--' + variant + (extraCls ? ' ' + extraCls : '') + '"' + attr(state === 'disabled', 'disabled') + '><legend class="plx-radio-group__legend">Sort by</legend>'
        + radio('Name', true, state === 'focus') + radio('Date', false, false) + '</fieldset>';
    },
    labelSelector: '.plx-check__label',
    parts: Object.assign({ lgc: 'D', lgfs: 'D', lgfw: 'D', lgm: 'D', rg: 'G' }, CHECK_PARTS),
    anchors: { A: { part: '.plx-check ' + BOX, side: 'left' }, B: { part: '.plx-check ' + BOX, side: 'bottom' }, C: { part: '.plx-check .plx-check__label', side: 'right' }, D: { part: '.plx-radio-group__legend', side: 'top' }, E: { part: '.plx-check', side: 'right' }, F: { part: '.plx-check', side: 'bottom' }, G: { part: '.plx-check:last-of-type', side: 'bottom' } },
    sections: [['Legend', ['lgc', 'lgfs', 'lgfw', 'lgm']], ['Box', ['ac', 'iw', 'ih', 'im']], ['Focus', ['fo', 'fof', 'fow']], ['Text', ['lc', 'fs']], ['Spacing', ['gap', 'h', 'py', 'rg']], ['Disabled', ['op']]],
    matrixLabel: 'Radio group layouts by state',
    statesHead: 'States · every layout (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Switch (<Switch>, label.plx-switch > input[role=switch] (transparent, over the control) + track + label): off and on;
  // the track and its knob (.plx-switch__track::after) are measured as parts
  var SW = function (n) { return 'plx-comp-switch-' + n; };
  var TRACK = '.plx-switch__track';
  var knob = function (p) { return Object.assign({ part: TRACK, pseudo: '::after' }, p); };
  DS.registerLab('switch', {
    name: 'Switch', title: 'Plenix switch', file: 'platform/components/Checkbox/checkbox.css', compPrefix: /^plx-comp-switch-/,
    store: 'plenix-switch-lab-tokens', sizes: [['md', 'Default', '.plx-switch']], variants: [['off', 'Off'], ['on', 'On']],
    states: CHECK_STATES, content: [['label', 'With its label']],
    labels: { size: 'Size', variant: 'Value', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'on', state: 'default', content: 'label' },
    props: [
      { id: 'tb', label: 'Track color', css: ['background-color'], part: TRACK, cat: 'color' },
      { id: 'tw', label: 'Track width', css: ['inline-size'], show: 'width', part: TRACK, cat: 'size' },
      { id: 'th', label: 'Track height', css: ['block-size'], show: 'height', part: TRACK, cat: 'icon' },
      { id: 'tr', label: 'Track corner radius', css: CORNERS, show: 'border-top-left-radius', part: TRACK, cat: 'radius' },
      knob({ id: 'kb', label: 'Knob color', css: ['background-color'], cat: 'color' }),
      knob({ id: 'kw', label: 'Knob width', css: ['inline-size'], show: 'width', cat: 'icon' }),
      knob({ id: 'kh', label: 'Knob height', css: ['block-size'], show: 'height', cat: 'icon' }),
      knob({ id: 'kr', label: 'Knob corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' }),
      knob({ id: 'ks', label: 'Knob shadow', css: ['box-shadow'], cat: 'shadow', extra: ['none'] }),
      knob({ id: 'kt', label: 'Knob offset from the top', css: ['inset-block-start'], show: 'top', cat: 'space', extra: ['0'] }),
      knob({ id: 'kl', label: 'Knob offset from the start', css: ['inset-inline-start'], show: 'left', cat: 'space', extra: ['0'] }),
      knob({ id: 'kx', label: 'Knob travel (on)', css: ['transform'], cat: 'transform' }),
      { id: 'fo', label: 'Focus outline color', css: ['outline-color'], part: TRACK, cat: 'color' },
      { id: 'fof', label: 'Focus outline offset', css: ['outline-offset'], part: TRACK, cat: 'space' },
      { id: 'fow', label: 'Focus outline width', css: ['outline-width'], part: TRACK, cat: 'border-width' },
      { id: 'op', label: 'Track opacity (disabled)', css: ['opacity'], part: TRACK, cat: 'opacity' },
      { id: 'lc', label: 'Label color', css: ['color'], part: '.plx-switch__label', cat: 'color' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'gap', label: 'Gap (track to label)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' }
    ],
    token: function (id, size, variant, state) {
      switch (id) {
        case 'tb': return SW(variant === 'on' ? 'input-checked-track-background' : 'track-background');
        case 'tw': return SW('track-width');
        case 'th': return SW('track-height');
        case 'tr': return SW('track-radius');
        case 'kb': return SW('track-after-background');
        case 'kw': return SW('track-after-width');
        case 'kh': return SW('track-after-height');
        case 'kr': return SW('track-after-radius');
        case 'ks': return SW('track-after-shadow');
        case 'kt': return SW('track-after-inset-block-start');
        case 'kl': return SW('track-after-inset-inline-start');
        case 'kx': return variant === 'on' ? SW('input-checked-track-after-transform') : null;
        case 'fo': return state === 'focus' ? SW('input-focus-track-outline-color') : null;
        case 'fof': return state === 'focus' ? SW('input-focus-track-outline-offset') : null;
        case 'fow': return state === 'focus' ? SW('input-focus-track-outline-width') : null;
        case 'op': return state === 'disabled' ? SW('input-disabled-track-opacity') : null;
        case 'lc': return SW('label-text');
        case 'fs': return SW('font-size');
        case 'gap': return SW('gap');
        case 'h': return SW('min-height');
        default: return null;
      }
    },
    reach: function (full) { return /-checked-/.test(full) ? 'every switch that is on' : /-focus-/.test(full) ? 'every switch when focused' : /-disabled-/.test(full) ? 'every disabled switch' : 'every switch'; },
    every: 'every switch',
    html: function (variant, size, state, extraCls) {
      return '<label class="plx-switch' + (extraCls ? ' ' + extraCls : '') + '"><input type="checkbox" role="switch" class="plx-switch__input' + (state === 'focus' ? ' is-focus-visible' : '') + '"'
        + attr(variant === 'on', 'checked') + attr(state === 'disabled', 'disabled') + ' tabindex="-1" aria-label="Notify me"><span class="plx-switch__track" aria-hidden="true"></span><span class="plx-switch__label">Notify me</span></label>';
    },
    labelSelector: '.plx-switch__label',
    parts: { tb: 'A', tw: 'A', th: 'A', tr: 'A', kb: 'B', kw: 'B', kh: 'B', kr: 'B', ks: 'B', kt: 'B', kl: 'B', kx: 'B', fo: 'C', fof: 'C', fow: 'C', op: 'C', lc: 'D', fs: 'D', gap: 'E', h: 'E' },
    anchors: { A: { part: TRACK, side: 'top' }, B: { part: TRACK, side: 'bottom' }, C: { part: TRACK, side: 'left' }, D: { part: '.plx-switch__label', side: 'top' }, E: { part: null, side: 'right' } },
    sections: [['Track', ['tb', 'tw', 'th', 'tr']], ['Knob', ['kb', 'kw', 'kh', 'kr', 'ks', 'kt', 'kl', 'kx']], ['Focus', ['fo', 'fof', 'fow']], ['Label', ['lc', 'fs']], ['Spacing', ['gap', 'h']], ['Disabled', ['op']]],
    matrixLabel: 'Switch values by state',
    statesHead: 'States · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Field (<Field>, div.plx-field: the head (label, required mark, the (i) button), the control, its description, error
  // and info text) in its three layouts (batch 256); the field tokens (field.css) and the form spacing tokens (density)
  var FD = function (n) { return 'plx-comp-field-' + n; };
  var LBL = '.plx-field__label', INFO = '.plx-field__info', DESC = '.plx-field__description', ERR = '.plx-field__error', TIP = '.plx-field__info-text';
  var tipProp = function (p) { return Object.assign({ part: TIP }, p); };
  var infoProp = function (p) { return Object.assign({ part: INFO }, p); };
  DS.registerLab('field', {
    name: 'Field', title: 'Plenix field', file: 'platform/components/Field/field.css', compPrefix: /^plx-comp-field-/,
    store: 'plenix-field-lab-tokens', sizes: [['default', 'Default'], ['sm', 'Small label column', '.plx-field--label-sm']],
    variants: [['stacked', 'Stacked'], ['inline', 'Inline'], ['row', 'Row']],
    states: [['default', 'Default'], ['hover', 'Info hover'], ['focus', 'Info focus'], ['open', 'Info open'], ['invalid', 'Invalid'], ['required', 'Required']],
    content: [['full', 'Label, description and info']],
    labels: { size: 'Label column', variant: 'Layout', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'stacked', state: 'default', content: 'full' },
    props: [
      { id: 'lcg', label: 'Gap (label to control)', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'ig', label: 'Gap (label column to control)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'gtc', label: 'Label column', css: ['grid-template-columns'], cat: 'columns' },
      { id: 'hg', label: 'Gap (label to info button)', css: ['column-gap'], part: '.plx-field__head', cat: 'space', extra: ['0'] },
      { id: 'rhg', label: 'Gap (label to description, row)', css: ['row-gap'], part: '.plx-field__head', cat: 'space', extra: ['0'] },
      { id: 'chg', label: 'Gap (control to help and error)', css: ['row-gap'], part: '.plx-field__control', cat: 'space', extra: ['0'] },
      { id: 'lbc', label: 'Label color', css: ['color'], part: LBL, cat: 'color' },
      { id: 'lbff', label: 'Label font family', css: ['font-family'], part: LBL, cat: 'font' },
      { id: 'lbfs', label: 'Label font size', css: ['font-size'], part: LBL, cat: 'font-size' },
      { id: 'lbfw', label: 'Label font weight', css: ['font-weight'], part: LBL, cat: 'font-weight' },
      { id: 'lblh', label: 'Label line height', css: ['line-height'], part: LBL, cat: 'line-height' },
      { id: 'rqc', label: 'Required mark color', css: ['color'], part: '.plx-field__required', cat: 'color' },
      { id: 'dc', label: 'Description color', css: ['color'], part: DESC, cat: 'color' },
      { id: 'dfs', label: 'Description font size', css: ['font-size'], part: DESC, cat: 'font-size' },
      { id: 'ec', label: 'Error color', css: ['color'], part: ERR, cat: 'color' },
      { id: 'efs', label: 'Error font size', css: ['font-size'], part: ERR, cat: 'font-size' },
      infoProp({ id: 'ib', label: 'Info button color', css: ['background-color'], cat: 'color', extra: ['transparent'] }),
      infoProp({ id: 'iw', label: 'Info button width', css: ['inline-size'], show: 'width', cat: 'icon' }),
      infoProp({ id: 'ih', label: 'Info button height', css: ['block-size'], show: 'height', cat: 'icon' }),
      infoProp({ id: 'ir', label: 'Info button corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] }),
      infoProp({ id: 'it', label: 'Info button text color', css: ['color'], cat: 'color' }),
      infoProp({ id: 'iff', label: 'Info button font family', css: ['font-family'], cat: 'font' }),
      infoProp({ id: 'ifs', label: 'Info button font size', css: ['font-size'], cat: 'font-size' }),
      infoProp({ id: 'ifw', label: 'Info button font weight', css: ['font-weight'], cat: 'font-weight' }),
      infoProp({ id: 'ihb', label: 'Hit area, top', css: ['inset-block-start'], show: 'top', pseudo: '::before', cat: 'space' }),
      infoProp({ id: 'ihe', label: 'Hit area, bottom', css: ['inset-block-end'], show: 'bottom', pseudo: '::before', cat: 'space' }),
      infoProp({ id: 'ihs', label: 'Hit area, start', css: ['inset-inline-start'], show: 'left', pseudo: '::before', cat: 'space' }),
      infoProp({ id: 'ihn', label: 'Hit area, end', css: ['inset-inline-end'], show: 'right', pseudo: '::before', cat: 'space' }),
      infoProp({ id: 'ifo', label: 'Info focus outline color', css: ['outline-color'], cat: 'color' }),
      infoProp({ id: 'ifof', label: 'Info focus outline offset', css: ['outline-offset'], cat: 'space' }),
      infoProp({ id: 'ifow', label: 'Info focus outline width', css: ['outline-width'], cat: 'border-width' }),
      tipProp({ id: 'itb', label: 'Info text background', css: ['background-color'], cat: 'color' }),
      tipProp({ id: 'itr', label: 'Info text corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] }),
      tipProp({ id: 'itc', label: 'Info text color', css: ['color'], cat: 'color' }),
      tipProp({ id: 'itfs', label: 'Info text font size', css: ['font-size'], cat: 'font-size' }),
      tipProp({ id: 'itpy', label: 'Info text padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] }),
      tipProp({ id: 'itpx', label: 'Info text padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] })
    ],
    token: function (id, size, variant, state) {
      var row = variant === 'row';
      switch (id) {
        case 'lcg': return variant === 'stacked' ? FD('label-control-gap') : null;
        case 'ig': return variant === 'inline' ? FD('inline-gap') : row ? FD('row-gap') : null;
        case 'gtc': return variant === 'inline' ? FD(size === 'sm' ? 'inline-label-sm-grid-template-columns' : 'inline-grid-template-columns') : null;
        case 'hg': return FD('head-gap');
        case 'rhg': return row ? FD('row-head-row-gap') : null;
        case 'chg': return FD('control-helper-gap');
        case 'lbc': return FD('label-text');
        case 'lbff': return FD('label-font-family');
        case 'lbfs': return FD(row ? 'row-label-font-size' : 'label-font-size');
        case 'lbfw': return FD('label-font-weight');
        case 'lblh': return FD(row ? 'row-label-line-height' : 'label-line-height');
        case 'rqc': return state === 'required' ? FD('required-text') : null;
        case 'dc': return FD('description-text');
        case 'dfs': return FD(row ? 'row-description-font-size' : 'description-font-size');
        case 'ec': return state === 'invalid' ? FD('error-text') : null;
        case 'efs': return state === 'invalid' ? FD('error-font-size') : null;
        case 'ib': return FD(state === 'hover' || state === 'open' ? 'info-hover-background' : 'info-background');
        case 'iw': return FD('info-width');
        case 'ih': return FD('info-height');
        case 'ir': return FD('info-radius');
        case 'it': return FD('info-text');
        case 'iff': return FD('info-font-family');
        case 'ifs': return FD('info-font-size');
        case 'ifw': return FD('info-font-weight');
        case 'ihb': return FD('info-before-inset-block-start');
        case 'ihe': return FD('info-before-inset-block-end');
        case 'ihs': return FD('info-before-inset-inline-start');
        case 'ihn': return FD('info-before-inset-inline-end');
        case 'ifo': return state === 'focus' ? FD('info-focus-outline-color') : null;
        case 'ifof': return state === 'focus' ? FD('info-focus-outline-offset') : null;
        case 'ifow': return state === 'focus' ? FD('info-focus-outline-width') : null;
        case 'itb': return state === 'open' ? FD('info-text-background') : null;
        case 'itr': return state === 'open' ? FD('info-text-radius') : null;
        case 'itc': return state === 'open' ? FD('info-text-text') : null;
        case 'itfs': return state === 'open' ? FD('info-text-font-size') : null;
        case 'itpy': return state === 'open' ? FD('info-text-padding-block') : null;
        case 'itpx': return state === 'open' ? FD('info-text-padding-inline') : null;
        default: return null;
      }
    },
    reach: function (full) {
      if (/-row-/.test(full)) return 'every row field';
      if (/-inline-label-sm-/.test(full)) return 'every inline field with a small label column';
      if (/-inline-/.test(full)) return 'every inline field';
      if (/-(label-control-gap|control-helper-gap)$/.test(full)) return 'every field (and legend)';
      if (/-info-text-/.test(full)) return 'every open info text';
      if (/-info-/.test(full)) return 'every info button' + (/-hover-/.test(full) ? ', hovered or open' : /-focus-/.test(full) ? ', focused' : '');
      if (/-error-/.test(full)) return 'every error message';
      if (/-required-/.test(full)) return 'every required mark';
      return 'every field';
    },
    every: 'every field',
    // Field.tsx's markup around a text field (the control comes from Input)
    html: function (variant, size, state, extraCls) {
      var row = variant === 'row', invalid = state === 'invalid', open = state === 'open';
      var desc = '<div class="plx-field__description">Shown on the asset page</div>';
      return '<div class="plx-field plx-field--' + variant + (size === 'sm' ? ' plx-field--label-sm' : '') + (invalid ? ' is-invalid' : '') + (extraCls ? ' ' + extraCls : '') + '">'
        + '<div class="plx-field__head"><label class="plx-field__label">Asset name' + (state === 'required' ? '<span class="plx-field__required" aria-hidden="true"> *</span>' : '') + '</label>'
        + '<button type="button" class="plx-field__info' + (state === 'hover' ? ' is-hover' : '') + (state === 'focus' ? ' is-focus-visible' : '') + '" aria-label="About asset name" aria-expanded="' + open + '" tabindex="-1">i</button>'
        + (row ? desc : '') + '</div>'
        + '<div class="plx-field__control"><input type="text" class="plx-input plx-input--width-md" value="Cross 014" aria-label="Asset name" tabindex="-1"' + attr(invalid, 'aria-invalid="true"') + '>'
        + (row ? '' : desc) + (invalid ? '<div class="plx-field__error">Use letters and numbers only</div>' : '') + (open ? '<div class="plx-field__info-text">The name people see in search results.</div>' : '') + '</div></div>';
    },
    labelSelector: LBL,
    parts: { lbc: 'A', lbff: 'A', lbfs: 'A', lbfw: 'A', lblh: 'A', rqc: 'A', ib: 'B', iw: 'B', ih: 'B', ir: 'B', it: 'B', iff: 'B', ifs: 'B', ifw: 'B', ihb: 'B', ihe: 'B', ihs: 'B', ihn: 'B', ifo: 'C', ifof: 'C', ifow: 'C',
      dc: 'D', dfs: 'D', ec: 'E', efs: 'E', itb: 'F', itr: 'F', itc: 'F', itfs: 'F', itpy: 'F', itpx: 'F', lcg: 'G', ig: 'G', gtc: 'G', hg: 'G', rhg: 'G', chg: 'G' },
    anchors: { A: { part: LBL, side: 'top' }, B: { part: INFO, side: 'top' }, C: { part: INFO, side: 'right' }, D: { part: DESC, side: 'right' }, E: { part: ERR, side: 'right' }, F: { part: TIP, side: 'bottom' }, G: { part: null, side: 'left' } },
    sections: [['Label', ['lbc', 'lbff', 'lbfs', 'lbfw', 'lblh', 'rqc']], ['Help and error', ['dc', 'dfs', 'ec', 'efs']], ['Info button', ['ib', 'iw', 'ih', 'ir', 'it', 'iff', 'ifs', 'ifw', 'ihb', 'ihe', 'ihs', 'ihn']],
      ['Info focus', ['ifo', 'ifof', 'ifow']], ['Info text', ['itb', 'itr', 'itc', 'itfs', 'itpy', 'itpx']], ['Layout', ['lcg', 'ig', 'gtc', 'hg', 'rhg', 'chg']]],
    matrixLabel: 'Field layouts by state', matrixColumnWidth: '--plx-ref-size-320px',
    statesHead: 'States · every layout (click one to inspect it; the dashed outline marks the one shown below)'
  });
  // ---- SegmentedControl (<SegmentedControl>, div.plx-segmented): look A (owner, 2026-10-14): a bordered group of joined
  // segments at the button height; the chosen segment takes the selected-state blue tint with blue text and icon. The
  // first segment is the one measured: chosen (variant "selected") or not ("unselected", the second is chosen).
  var SG = function (n) { return 'plx-comp-segmented-' + n; };
  var SEG = '.plx-segmented__item';
  var seg = function (p) { return Object.assign({ part: SEG }, p); };
  DS.registerLab('segmented-control', {
    name: 'Segmented control', title: 'Plenix segmented control', file: 'platform/components/SegmentedControl/segmented-control.css', compPrefix: /^plx-comp-segmented-/,
    store: 'plenix-segmented-control-lab-tokens', sizes: [['md', 'MD (default): the button height', '.plx-segmented'], ['sm', 'SM: the small button height', '.plx-segmented--sm']],
    variants: [['selected', 'Chosen segment'], ['unselected', 'Unchosen segment']],
    states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus']], content: [['text', 'Text'], ['icon', 'Icon and text']],
    labels: { size: 'Size', variant: 'Segment', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'selected', state: 'default', content: 'text' },
    props: [
      seg({ id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' }),
      seg({ id: 'fg', label: 'Text and icon color', css: ['color'], cat: 'color' }),
      seg({ id: 'bd', label: 'Edge color', css: ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], show: 'border-top-color', cat: 'color' }),
      seg({ id: 'bw', label: 'Edge width', css: ['border-top-width', 'border-bottom-width'], show: 'border-top-width', cat: 'border-width' }),
      seg({ id: 'rad', label: 'Outer corner radius', css: ['border-start-start-radius', 'border-end-start-radius'], show: 'border-top-left-radius', cat: 'radius', extra: ['0'] }),
      seg({ id: 'h', label: 'Height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' }),
      seg({ id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' }),
      seg({ id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' }),
      seg({ id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' }),
      seg({ id: 'fo', label: 'Focus outline color', css: ['outline-color'], cat: 'color' }),
      seg({ id: 'fow', label: 'Focus outline width', css: ['outline-width'], cat: 'border-width' })
    ],
    token: function (id, size, variant, state) {
      var on = variant === 'selected', sm = size === 'sm';
      switch (id) {
        case 'bg': return SG(on ? 'item-selected-background' : state === 'hover' ? 'item-hover-background' : 'item-background');
        case 'fg': return SG(on ? 'item-selected-text' : state === 'hover' ? 'item-hover-text' : 'item-text');
        case 'bd': return SG('border-color');
        case 'bw': return SG('border-width');
        case 'rad': return SG('radius');
        case 'h': return SG(sm ? 'sm-item-min-height' : 'item-min-height');
        case 'px': return SG(sm ? 'sm-item-padding-inline' : 'item-padding-inline');
        case 'fs': return SG(sm ? 'sm-item-font-size' : 'item-font-size');
        case 'fw': return SG('item-font-weight');
        case 'fo': return state === 'focus' ? SG('item-focus-outline-color') : null;
        case 'fow': return state === 'focus' ? SG('item-focus-outline-width') : null;
        default: return null;
      }
    },
    reach: function (full) { return /-selected-/.test(full) ? 'every chosen segment' : /-hover-/.test(full) ? 'every segment under the pointer' : /-focus-/.test(full) ? 'every focused segment' : /-sm-/.test(full) ? 'every small segmented control' : 'every segmented control'; },
    every: 'every segmented control',
    html: function (variant, size, state, extraCls, ui) {
      var icon = ui && ui.content === 'icon', on = variant === 'selected';
      var st = (state === 'hover' ? ' is-hover' : '') + (state === 'focus' ? ' is-focus-visible' : '');
      var item = function (label, chosen, first, ic) {
        return '<button type="button" role="radio" tabindex="-1" aria-checked="' + chosen + '" class="plx-segmented__item' + (size === 'sm' ? ' plx-segmented__item--sm' : '') + (chosen ? ' is-selected' : '') + (first ? st : '') + '">'
          + (icon ? DS.icon(ic) : '') + '<span>' + label + '</span></button>';
      };
      return '<div role="radiogroup" aria-label="View" class="plx-segmented' + (size === 'sm' ? ' plx-segmented--sm' : '') + (extraCls ? ' ' + extraCls : '') + '">'
        + item('Grid', on, true, 'grid-2x2') + item('List', !on, false, 'list-bullets') + item('Table', false, false, 'table') + '</div>';
    },
    labelSelector: null,
    parts: { bg: 'A', bd: 'A', bw: 'A', rad: 'A', h: 'B', px: 'B', fg: 'C', fs: 'C', fw: 'C', fo: 'D', fow: 'D' },
    anchors: { A: { part: SEG, side: 'top' }, B: { part: SEG, side: 'left' }, C: { part: SEG, side: 'bottom' }, D: { part: null, side: 'right' } },
    sections: [['Segment', ['bg', 'bd', 'bw', 'rad']], ['Size', ['h', 'px']], ['Text', ['fg', 'fs', 'fw']], ['Focus', ['fo', 'fow']]],
    matrixLabel: 'Segmented control values by segment and state',
    statesHead: 'Segments and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
})();
