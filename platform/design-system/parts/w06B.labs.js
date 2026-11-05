/* Plenix design system · library part w06B: the labs of wave 6, lane B. The Form pattern's spacing, the Field's character
   counter, the input family's appearances, the read-only field, the autogrowing text area, OtpInput and SearchField's list
   of suggestions and recent searches, each drawn with the markup the component renders, so every value shows with the
   one --plx-comp-* token behind it. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var attr = function (on, a) { return on ? ' ' + a : ''; };
    var icon = function (name) { return DS.icon(name); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var stCls = function (state) { return state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : ''; };
    var stAttrs = function (state) { return attr(state === 'readonly', 'readonly') + attr(state === 'disabled', 'disabled') + attr(state === 'invalid', 'aria-invalid="true"') + attr(state === 'warning', 'data-plx-warning="true"'); };
    var IN = function (n) { return 'plx-comp-input-' + n; };
    var inputBorder = function (state) { return IN({ hover: 'hover-border-color', focus: 'focus-border-color', invalid: 'invalid-border-color' }[state] || 'border-color'); };
    var FIELD_STATES = [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['warning', 'Warning'], ['readonly', 'Read-only'], ['disabled', 'Disabled']];

    // ---- Form (<Form>, <FormSection>, <FormActions>): the space between sections, inside a section, under its title
    var FO = function (n) { return 'plx-comp-form-' + n; };
    var field = function (label, value, inline) {
      return '<div class="plx-field plx-field--' + (inline ? 'inline' : 'stacked') + '"><div class="plx-field__head"><label class="plx-field__label">' + label + '</label></div>'
        + '<div class="plx-field__control"><input type="text" class="plx-input" value="' + value + '" aria-label="' + label + '" tabindex="-1"></div></div>';
    };
    var section = function (title, desc, fields, inline) {
      return '<section class="plx-form-section"><div class="plx-form-section__header"><h2 class="plx-text plx-text--heading plx-form-section__title">' + title + '</h2>'
        + (desc ? '<p class="plx-text plx-text--secondary plx-form-section__description">' + desc + '</p>' : '') + '</div>'
        + '<div class="plx-stack plx-stack--gap-md plx-form-section__body">' + fields.map(function (f) { return field(f[0], f[1], inline); }).join('') + '</div></section>';
    };
    DS.registerLab('form-section', {
      name: 'Form', title: 'Plenix form', file: 'platform/patterns/Form/form.css', compPrefix: /^plx-comp-form-/,
      store: 'plenix-form-lab-tokens', sizes: [['default', 'Default', '.plx-form']],
      variants: [['one-column', 'One column (default)'], ['two-column', 'Two columns (labels beside)']],
      states: [['default', 'Default']],
      content: [['section', 'Titled section'], ['actions', 'Actions at the end (sticky)']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Parts' },
      defaults: { size: 'default', variant: 'one-column', state: 'default', content: 'section' },
      props: [
        { id: 'fg', label: 'Gap between sections', css: ['row-gap'], cat: 'space' },
        { id: 'sg', label: 'Gap (header to fields)', css: ['row-gap'], part: '.plx-form-section', cat: 'space' },
        { id: 'hg', label: 'Gap (title to description)', css: ['row-gap'], part: '.plx-form-section__header', cat: 'space' },
        { id: 'gtc', label: 'Columns (labels, controls)', css: ['grid-template-columns'], part: '.plx-form-section__body', cat: 'columns' }
      ],
      token: function (id, size, variant) {
        if (id === 'gtc') return variant === 'two-column' ? FO('two-column-grid-template-columns') : null;
        return { fg: FO('gap'), sg: FO('section-gap'), hg: FO('section-header-gap') }[id] || null;
      },
      reach: function (full) { return /two-column/.test(full) ? 'every two-column form' : /section/.test(full) ? 'every form section' : 'every form'; },
      every: 'every form',
      html: function (variant, size, state, extraCls, ui) {
        var inline = variant === 'two-column', actions = ui && ui.content === 'actions';
        return '<form class="plx-form plx-form--' + variant + ex(extraCls) + '" aria-label="Asset details">'
          + section('General', 'Shown on the asset card.', [['Name', 'Cross 014'], ['Category', 'Crosses']], inline)
          + section('Usage rights', '', [['License', 'Internal use'], ['Credit', 'Parish archive']], inline)
          + (actions ? '<div role="group" aria-label="Form actions" class="plx-action-bar plx-form-actions"><button type="button" tabindex="-1" class="plx-button plx-button--secondary"><span class="plx-button__label">Cancel</span></button>'
            + '<button type="button" tabindex="-1" class="plx-button plx-button--primary"><span class="plx-button__label">Save changes</span></button></div>' : '') + '</form>';
      },
      labelSelector: '.plx-form-section__title',
      parts: { fg: 'A', sg: 'B', hg: 'C', gtc: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-form-section', side: 'right' }, C: { part: '.plx-form-section__header', side: 'right' }, D: { part: '.plx-form-section__body', side: 'top' } },
      sections: [['Spacing', ['fg', 'sg', 'hg']], ['Two columns', ['gtc']]],
      matrixLabel: 'Form layouts', matrixColumnWidth: '--plx-ref-size-560px',
      statesHead: 'Layouts · ' + HEAD
    });

    // ---- Character counter (<Field counter>): the count at the end of the help line, in the data font; danger past the limit
    var FD = function (n) { return 'plx-comp-field-' + n; };
    DS.registerLab('character-counter', {
      name: 'Character counter', title: 'Plenix character counter', file: 'platform/components/Field/field.css', compPrefix: /^plx-comp-field-(foot|counter)-/,
      store: 'plenix-character-counter-lab-tokens', sizes: [['default', 'Default', '.plx-field__counter']],
      variants: [['stacked', 'Stacked'], ['inline', 'Inline']], states: [['default', 'Default']],
      content: [['counter', 'Character counter'], ['over', 'Over the limit']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Count' },
      defaults: { size: 'default', variant: 'stacked', state: 'default', content: 'counter' },
      props: [
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-field__counter', cat: 'color' },
        { id: 'cff', label: 'Count font family', css: ['font-family'], part: '.plx-field__count', cat: 'font' },
        { id: 'cfs', label: 'Count font size', css: ['font-size'], part: '.plx-field__counter', cat: 'font-size' },
        { id: 'fg', label: 'Gap (description to count)', css: ['column-gap'], part: '.plx-field__foot', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        switch (id) {
          case 'cc': return FD(content === 'over' ? 'counter-over-text' : 'counter-text');
          case 'cff': return FD('counter-font-family');
          case 'cfs': return FD('counter-font-size');
          case 'fg': return FD('foot-gap');
          default: return null;
        }
      },
      reach: function (full) { return /-over-/.test(full) ? 'every count past its limit' : 'every character counter'; },
      every: 'every character counter',
      html: function (variant, size, state, extraCls, ui) {
        var over = ui && ui.content === 'over', n = over ? '112' : '88';
        return '<div class="plx-field plx-field--' + variant + ex(extraCls) + '"><div class="plx-field__head"><label class="plx-field__label">Summary</label></div>'
          + '<div class="plx-field__control"><input type="text" class="plx-input" value="Gold leaf border for the feast-day banners" aria-label="Summary" tabindex="-1"' + attr(over, 'aria-invalid="true"') + '>'
          + '<div class="plx-field__foot"><div class="plx-field__description">Shown in search results</div>'
          + '<div class="plx-field__counter' + (over ? ' is-over' : '') + '"><span class="plx-field__count" aria-hidden="true">' + n + '/100</span>'
          + '<span class="plx-visually-hidden">' + (over ? '12 characters too many' : '12 characters left') + '</span></div></div></div></div>';
      },
      labelSelector: '.plx-field__count',
      parts: { cc: 'A', cff: 'A', cfs: 'A', fg: 'B' },
      anchors: { A: { part: '.plx-field__counter', side: 'right' }, B: { part: '.plx-field__foot', side: 'bottom' } },
      sections: [['Count', ['cc', 'cff', 'cfs']], ['Layout', ['fg']]],
      matrixLabel: 'Character counter by layout', matrixColumnWidth: '--plx-ref-size-320px',
      statesHead: 'Layouts · ' + HEAD
    });

    // ---- Field style variants (Input, Textarea, Select appearance): outline and filled, in every field state
    var APPEARANCE_PROPS = [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'lc', label: 'Line color (the bottom border)', css: ['border-bottom-color'], cat: 'color' },
      { id: 'lw', label: 'Line width (the bottom border)', css: ['border-bottom-width'], cat: 'border-width' },
      { id: 'tw', label: 'Top border width', css: ['border-top-width'], cat: 'border-width' },
      { id: 'tr', label: 'Top corners', css: ['border-top-left-radius', 'border-top-right-radius'], show: 'border-top-left-radius', cat: 'radius' },
      { id: 'br', label: 'Bottom corners', css: ['border-bottom-left-radius', 'border-bottom-right-radius'], show: 'border-bottom-left-radius', cat: 'radius' },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' }
    ];
    var appearanceToken = function (id, variant, state) {
      var fixed = state === 'readonly' || state === 'disabled';
      switch (id) {
        case 'bg': return state === 'disabled' ? IN('disabled-background') : state === 'readonly' ? IN('readonly-background') : state === 'invalid' ? IN('invalid-background') : variant === 'filled' ? IN('filled-background') : IN('background');
        case 'lc': return fixed ? IN('border-color') : inputBorder(state);
        case 'lw': return IN('border-width');
        case 'tw': return variant === 'outline' ? IN('border-width') : null;
        case 'tr': return IN('radius');
        case 'br': return IN('radius');
        case 'fg': return state === 'disabled' ? IN('disabled-text') : variant === 'filled' ? IN('filled-text') : IN('text');
        default: return null;
      }
    };
    var appearanceReach = function (full) { return /-filled-/.test(full) ? 'every filled field' : 'every text field, text area and native select'; };
    var look = function (variant) { return variant === 'outline' ? '' : ' plx-input--' + variant; };
    DS.registerLab('field-style-variants', {
      name: 'Field style variants', title: 'Plenix field style variants', file: 'platform/components/Input/input.css', compPrefix: /^plx-comp-input-/,
      store: 'plenix-field-style-variants-lab-tokens', sizes: [['full', 'Full width', '.plx-input']],
      variants: [['outline', 'Outline (default)'], ['filled', 'Filled']],
      states: FIELD_STATES, content: [['value', 'Filled in']],
      labels: { size: 'Width', variant: 'Appearance', state: 'State', content: 'Content' },
      defaults: { size: 'full', variant: 'filled', state: 'default', content: 'value' },
      props: APPEARANCE_PROPS,
      token: function (id, size, variant, state) { return appearanceToken(id, variant, state); },
      reach: appearanceReach, every: 'every field of this appearance',
      html: function (variant, size, state, extraCls) {
        return '<input type="text" class="plx-input' + look(variant) + stCls(state) + ex(extraCls) + '" value="Cross 014" placeholder="Asset name" aria-label="Asset name" tabindex="-1"' + stAttrs(state) + '>';
      },
      labelSelector: null,
      parts: { bg: 'A', fg: 'A', lc: 'B', lw: 'B', tw: 'C', tr: 'C', br: 'B' },
      anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'bottom' }, C: { part: null, side: 'top' } },
      sections: [['Surface', ['bg', 'fg']], ['Line and border', ['lc', 'lw', 'tw']], ['Corners', ['tr', 'br']]],
      matrixLabel: 'Field appearances by state', statesHead: 'Appearances and states · ' + HEAD
    });

    // ---- Read-only field (readOnly on Input, Textarea): the sunken surface, the value at full contrast, the border kept
    DS.registerLab('read-only-field', {
      name: 'Read-only field', title: 'Plenix read-only field', file: 'platform/components/Input/input.css', compPrefix: /^plx-comp-(input|textarea)-/,
      store: 'plenix-read-only-field-lab-tokens', sizes: [['full', 'Full width', '.plx-input']],
      variants: [['input', 'Text field'], ['textarea', 'Text area']], states: [['readonly', 'Read-only']], content: [['value', 'A value']],
      labels: { size: 'Width', variant: 'Control', state: 'State', content: 'Content' },
      defaults: { size: 'full', variant: 'input', state: 'readonly', content: 'value' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' }
      ],
      token: function (id) { return { bg: IN('readonly-background'), fg: IN('text'), bc: IN('border-color'), bw: IN('border-width') }[id] || null; },
      reach: function (full) { return /readonly/.test(full) ? 'every read-only field' : 'every text field, text area and native select'; },
      every: 'every read-only field',
      html: function (variant, size, state, extraCls) {
        return variant === 'textarea'
          ? '<textarea class="plx-input plx-input--textarea' + ex(extraCls) + '" rows="3" aria-label="Notes" tabindex="-1" readonly>Imported from the parish archive, 2019.</textarea>'
          : '<input type="text" class="plx-input plx-input--data' + ex(extraCls) + '" value="AST-1042" aria-label="Asset ID" tabindex="-1" readonly>';
      },
      labelSelector: null,
      parts: { bg: 'A', fg: 'A', bc: 'B', bw: 'B' },
      anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'top' } },
      sections: [['Read-only', ['bg', 'fg', 'bc', 'bw']]],
      matrixLabel: 'Read-only fields', statesHead: 'Controls · ' + HEAD
    });

    // ---- Autogrowing text area (<Textarea autoGrow>): its minimum, its maximum, its padding and line height
    var TA = function (n) { return 'plx-comp-textarea-' + n; };
    var LONG = 'Gold leaf on the border.\nRed ochre for the cross.\nThe banner hangs in the north aisle.\nIt is used at Easter and Pentecost.\nThe archive keeps the original sketch.\nScan it at 600 dpi.\nCredit the parish.\nKeep the colors as printed.\nAsk before cropping.\nThe file is the master copy.\nNew versions go in the same folder.\nName them by date.';
    DS.registerLab('autogrowing-text-area', {
      name: 'Autogrowing text area', title: 'Plenix autogrowing text area', file: 'platform/components/Input/input.css', compPrefix: /^plx-comp-textarea-/,
      store: 'plenix-autogrowing-text-area-lab-tokens', sizes: [['full', 'Full width', '.plx-input--auto-grow']],
      variants: [['auto-grow', 'Grows with its text']], states: [['default', 'Default'], ['focus', 'Focus']],
      content: [['short', 'A short note'], ['long', 'Past the maximum (scrolls)']],
      labels: { size: 'Width', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'full', variant: 'auto-grow', state: 'default', content: 'long' },
      props: [
        { id: 'mx', label: 'Maximum height', css: ['max-block-size'], show: 'max-height', cat: 'size' },
        { id: 'mn', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'size' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
        { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' },
        { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' }
      ],
      token: function (id) { return { mx: TA('auto-grow-max-height'), mn: TA('min-height'), py: TA('padding-block'), lh: TA('line-height'), fs: TA('font-size') }[id] || null; },
      reach: function (full) { return /auto-grow/.test(full) ? 'every autogrowing text area' : 'every text area'; },
      every: 'every autogrowing text area',
      html: function (variant, size, state, extraCls, ui) {
        var text = ui && ui.content === 'short' ? 'Gold leaf on the border.' : LONG;
        return '<textarea class="plx-input plx-input--textarea plx-input--auto-grow' + stCls(state) + ex(extraCls) + '" rows="3" aria-label="Notes" tabindex="-1">' + text + '</textarea>';
      },
      labelSelector: null,
      parts: { mx: 'A', mn: 'A', py: 'B', lh: 'C', fs: 'C' },
      anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'top' }, C: { part: null, side: 'left' } },
      sections: [['Height', ['mn', 'mx']], ['Text', ['fs', 'lh']], ['Spacing', ['py']]],
      matrixLabel: 'Autogrowing text area by state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'States · ' + HEAD
    });

    // ---- OtpInput (<OtpInput>): a row of square boxes in the input roles, the code in the data font
    var OT = function (n) { return 'plx-comp-otp-input-' + n; };
    var CELL = '.plx-otp-input__cell';
    DS.registerLab('otp-input', {
      name: 'PIN / OTP input', title: 'Plenix OTP input', file: 'platform/components/OtpInput/otp-input.css', compPrefix: /^plx-comp-otp-input-/,
      store: 'plenix-otp-input-lab-tokens', sizes: [['4', '4 characters (a PIN)'], ['6', '6 characters (default)']],
      variants: [['numeric', 'Numeric (default)'], ['alphanumeric', 'Alphanumeric'], ['masked', 'Masked']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['partial', 'Partly typed']],
      labels: { size: 'Length', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: '6', variant: 'numeric', state: 'default', content: 'partial' },
      props: [
        { id: 'gap', label: 'Gap between boxes', css: ['column-gap'], cat: 'space' },
        { id: 'w', label: 'Box width', css: ['inline-size'], show: 'width', part: CELL, cat: 'control-height' },
        { id: 'h', label: 'Box height', css: ['block-size'], show: 'height', part: CELL, cat: 'control-height' },
        { id: 'bg', label: 'Box background', css: ['background-color'], part: CELL, cat: 'color' },
        { id: 'bc', label: 'Box border color', css: BORDERS, show: 'border-top-color', part: CELL, cat: 'color' },
        { id: 'bw', label: 'Box border width', css: WIDTHS, show: 'border-top-width', part: CELL, cat: 'border-width' },
        { id: 'rad', label: 'Box corners', css: CORNERS, show: 'border-top-left-radius', part: CELL, cat: 'radius' },
        { id: 'fg', label: 'Character color', css: ['color'], part: CELL, cat: 'color' },
        { id: 'ff', label: 'Character font', css: ['font-family'], part: CELL, cat: 'font' },
        { id: 'fs', label: 'Character size', css: ['font-size'], part: CELL, cat: 'font-size' }
      ],
      token: function (id, size, variant, state) {
        var off = state === 'disabled';
        switch (id) {
          case 'gap': return OT('gap');
          case 'w': return OT('cell-width');
          case 'h': return OT('cell-height');
          case 'bg': return OT(off ? 'cell-disabled-background' : 'cell-background');
          case 'bc': return OT({ hover: 'cell-hover-border-color', focus: 'cell-focus-border-color', invalid: 'cell-invalid-border-color' }[state] || 'cell-border-color');
          case 'bw': return OT('cell-border-width');
          case 'rad': return OT('cell-radius');
          case 'fg': return OT(off ? 'cell-disabled-text' : 'cell-text');
          case 'ff': return OT('cell-font-family');
          case 'fs': return OT('cell-font-size');
          default: return null;
        }
      },
      reach: function (full) { return /-(hover|focus|invalid|disabled)-/.test(full) ? 'every OTP box when ' + /-(hover|focus|invalid|disabled)-/.exec(full)[1] : 'every OTP box'; },
      every: 'every OTP input',
      html: function (variant, size, state, extraCls) {
        var n = +size, code = variant === 'alphanumeric' ? 'K7Q' : '482', cells = '';
        for (var i = 0; i < n; i++) {
          cells += '<input class="plx-otp-input__cell' + (i === 0 ? stCls(state) : '') + '" type="' + (variant === 'masked' ? 'password' : 'text') + '" value="' + (code[i] || '') + '" tabindex="-1"'
            + ' aria-label="Verification code, character ' + (i + 1) + ' of ' + n + '"' + attr(state === 'invalid', 'aria-invalid="true"') + attr(state === 'disabled', 'disabled') + '>';
        }
        return '<div role="group" dir="ltr" aria-label="Verification code" class="plx-otp-input' + (state === 'invalid' ? ' is-invalid' : '') + (state === 'disabled' ? ' is-disabled' : '') + ex(extraCls) + '">' + cells + '</div>';
      },
      labelSelector: CELL,
      parts: { gap: 'A', w: 'B', h: 'B', rad: 'B', bg: 'C', bc: 'C', bw: 'C', fg: 'D', ff: 'D', fs: 'D' },
      anchors: { A: { part: null, side: 'bottom' }, B: { part: CELL, side: 'top' }, C: { part: CELL, side: 'left' }, D: { part: CELL, side: 'right' } },
      sections: [['Box', ['w', 'h', 'rad', 'bg', 'bc', 'bw']], ['Character', ['fg', 'ff', 'fs']], ['Layout', ['gap']]],
      matrixLabel: 'OTP input by kind and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Kinds and states · ' + HEAD
    });

    // ---- Search suggestions and recent searches (<SearchField suggestions recent>): the list under the field
    var SR = function (n) { return 'plx-comp-search-' + n; };
    var OPT = '.plx-search__option';
    var option = function (kind, label, i, active, desc) {
      return '<li role="option" aria-selected="' + active + '" class="plx-search__option' + (kind === 'recent' ? ' plx-search__option--recent' : '') + (active ? ' is-active' : '') + '">'
        + '<span class="plx-search__option-icon" aria-hidden="true">' + icon(kind === 'recent' ? 'clock' : 'search') + '</span>'
        + '<span class="plx-search__option-text"><span class="plx-search__option-label">' + label + '</span>' + (desc ? '<span class="plx-search__option-description">' + desc + '</span>' : '') + '</span></li>';
    };
    // a recent search as the component draws it with onRemoveRecent (owner, 2026-10-14): a grid row, the term's cell and
    // the remove cell (an icon-only ghost button named "Remove <term>")
    var recentRow = function (label, i, active) {
      return '<div role="row" class="plx-search__option plx-search__option--recent plx-search__row' + (active ? ' is-active' : '') + '">'
        + '<span role="gridcell" aria-selected="' + active + '" class="plx-search__cell"><span class="plx-search__option-icon" aria-hidden="true">' + icon('clock') + '</span>'
        + '<span class="plx-search__option-text"><span class="plx-search__option-label">' + label + '</span></span></span>'
        + '<span role="gridcell" aria-selected="false" class="plx-search__remove-cell"><button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only plx-search__remove" aria-label="Remove ' + label + '">'
        + '<span class="plx-button__icon">' + icon('close') + '</span></button></span></div>';
    };
    var searchLab = function (id, name, defaultVariant) {
      DS.registerLab(id, {
        name: name, title: 'Plenix ' + name.toLowerCase(), file: 'platform/components/SearchField/search-field.css', compPrefix: /^plx-comp-search-(popup|list|option|match)-/,
        store: 'plenix-' + id + '-lab-tokens', sizes: [['default', 'Default', '.plx-search__popup']],
        variants: [['suggestions', 'Suggestions'], ['recent', 'Recent searches'], ['history', 'Recent searches with Clear']],
        states: [['default', 'Default'], ['active', 'An active option']], content: [['open', 'The list open']],
        labels: { size: 'Size', variant: 'List', state: 'State', content: 'Content' },
        defaults: { size: 'default', variant: defaultVariant, state: 'active', content: 'open' },
        props: [
          { id: 'bg', label: 'List background', css: ['background-color'], cat: 'color' },
          { id: 'bc', label: 'List border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
          { id: 'bw', label: 'List border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
          { id: 'rad', label: 'List corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
          { id: 'mt', label: 'Gap under the field', css: ['margin-block-start'], show: 'margin-top', cat: 'space' },
          { id: 'py', label: 'List padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
          { id: 'px', label: 'List padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
          { id: 'mh', label: 'Options: maximum height', css: ['max-block-size'], show: 'max-height', part: '.plx-search__list', cat: 'size' },
          { id: 'oc', label: 'Option text color', css: ['color'], part: OPT, cat: 'color' },
          { id: 'ob', label: 'Active option background', css: ['background-color'], part: OPT, cat: 'color' },
          { id: 'oh', label: 'Option height', css: ['min-block-size'], show: 'min-height', part: OPT, cat: 'control-height' },
          { id: 'ofs', label: 'Option font size', css: ['font-size'], part: OPT, cat: 'font-size' },
          { id: 'opx', label: 'Option padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: OPT, cat: 'space' },
          { id: 'og', label: 'Gap (icon to text)', css: ['column-gap'], part: OPT, cat: 'space' },
          { id: 'orad', label: 'Option corners', css: CORNERS, show: 'border-top-left-radius', part: OPT, cat: 'radius' },
          { id: 'ic', label: 'Option icon color', css: ['color'], part: '.plx-search__option-icon', cat: 'color' },
          { id: 'mw', label: 'Matching text weight', css: ['font-weight'], part: '.plx-match:not(.plx-match--joined)', cat: 'font-weight' },
          { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-search__option-description', cat: 'color' },
          { id: 'dfs', label: 'Description size', css: ['font-size'], part: '.plx-search__option-description', cat: 'font-size' },
          { id: 'tc', label: 'Heading color', css: ['color'], part: '.plx-search__popup-title', cat: 'color' },
          { id: 'tff', label: 'Heading font', css: ['font-family'], part: '.plx-search__popup-title', cat: 'font' },
          { id: 'tfs', label: 'Heading size', css: ['font-size'], part: '.plx-search__popup-title', cat: 'font-size' },
          { id: 'tfw', label: 'Heading weight', css: ['font-weight'], part: '.plx-search__popup-title', cat: 'font-weight' },
          { id: 'hg', label: 'Heading gap (title to Clear)', css: ['column-gap'], part: '.plx-search__popup-head', cat: 'space' },
          { id: 'hpt', label: 'Heading padding top', css: ['padding-block-start'], show: 'padding-top', part: '.plx-search__popup-head', cat: 'space' },
          { id: 'hpb', label: 'Heading padding bottom', css: ['padding-block-end'], show: 'padding-bottom', part: '.plx-search__popup-head', cat: 'space' },
          { id: 'hpx', label: 'Heading padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-search__popup-head', cat: 'space' }
        ],
        token: function (pid, size, variant, state) {
          var sug = variant === 'suggestions', head = !sug;
          switch (pid) {
            case 'bg': return SR('popup-background');
            case 'bc': return SR('popup-border-color');
            case 'bw': return SR('popup-border-width');
            case 'rad': return SR('popup-radius');
            case 'mt': return SR('popup-margin-block-start');
            case 'py': return SR('popup-padding-block');
            case 'px': return SR('popup-padding-inline');
            case 'mh': return SR('list-max-height');
            case 'oc': return SR('option-text');
            case 'ob': return state === 'active' ? SR('option-active-background') : null;
            case 'oh': return SR('option-min-height');
            case 'ofs': return SR('option-font-size');
            case 'opx': return SR('option-padding-inline');
            case 'og': return SR('option-gap');
            case 'orad': return SR('option-radius');
            case 'ic': return SR('option-icon-text');
            case 'mw': return sug ? SR('match-font-weight') : null;
            case 'dc': return sug ? SR('option-description-text') : null;
            case 'dfs': return sug ? SR('option-description-font-size') : null;
            case 'tc': return head ? SR('popup-title-text') : null;
            case 'tff': return head ? SR('popup-title-font-family') : null;
            case 'tfs': return head ? SR('popup-title-font-size') : null;
            case 'tfw': return head ? SR('popup-title-font-weight') : null;
            case 'hg': return head ? SR('popup-head-gap') : null;
            case 'hpt': return head ? SR('popup-head-padding-block-start') : null;
            case 'hpb': return head ? SR('popup-head-padding-block-end') : null;
            case 'hpx': return head ? SR('popup-head-padding-inline') : null;
            default: return null;
          }
        },
        reach: function (full) { return /-popup-(head|title)-/.test(full) ? 'the heading of every recent searches list' : /-match-/.test(full) ? 'the matching text of every suggestion' : 'every search list'; },
        every: 'every search list',
        html: function (variant, size, state, extraCls) {
          var sug = variant === 'suggestions', act = state === 'active';
          var opts = sug
            ? option('suggestion', 'Cross <span class="plx-match">gol</span>d', 0, act, 'Crosses') + option('suggestion', '<span class="plx-match">Gol</span>d leaf border', 1, false, 'Borders') + option('suggestion', 'Banner <span class="plx-match">gol</span>d', 2, false)
            : recentRow('sunset banner', 0, act) + recentRow('easter cross', 1, false) + recentRow('parish logo', 2, false);
          var headHtml = sug ? '' : '<div class="plx-search__popup-head"><span class="plx-search__popup-title" id="ds-w06b-recent-' + variant + '">Recent searches</span>'
            + (variant === 'history' ? '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-2xs plx-search__popup-action"><span class="plx-button__label">Clear recent searches</span></button>' : '') + '</div>';
          return '<div class="ds-w06b-search"><div class="plx-search is-open" role="search"><span class="plx-search__icon" aria-hidden="true">' + icon('search') + '</span>'
            + '<input type="search" tabindex="-1" class="plx-search__input is-focused" role="combobox" aria-expanded="true"' + (sug ? '' : ' aria-haspopup="grid"') + ' aria-label="Search assets" placeholder="Search assets" value="' + (sug ? 'gol' : '') + '">'
            + '<div class="plx-search__popup' + ex(extraCls) + '">' + headHtml + (sug ? '<ul role="listbox" class="plx-search__list" aria-label="Suggestions">' + opts + '</ul>'
              : '<div role="grid" class="plx-search__list plx-search__grid" aria-labelledby="ds-w06b-recent-' + variant + '">' + opts + '</div>') + '</div></div></div>';
        },
        labelSelector: '.plx-search__option-label',
        parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', mt: 'A', py: 'A', px: 'A', mh: 'A', oc: 'B', ob: 'B', oh: 'B', ofs: 'B', opx: 'B', og: 'B', orad: 'B', ic: 'C', mw: 'D', dc: 'D', dfs: 'D', tc: 'E', tff: 'E', tfs: 'E', tfw: 'E', hg: 'E', hpt: 'E', hpb: 'E', hpx: 'E' },
        anchors: { A: { part: null, side: 'right' }, B: { part: OPT, side: 'right' }, C: { part: '.plx-search__option-icon', side: 'left' }, D: { part: '.plx-search__option-label', side: 'bottom' }, E: { part: '.plx-search__popup-head', side: 'top' } },
        sections: [['List', ['bg', 'bc', 'bw', 'rad', 'mt', 'py', 'px', 'mh']], ['Options', ['oc', 'ob', 'oh', 'ofs', 'opx', 'og', 'orad', 'ic']], ['Suggestion text', ['mw', 'dc', 'dfs']], ['Recent searches heading', ['tc', 'tff', 'tfs', 'tfw', 'hg', 'hpt', 'hpb', 'hpx']]],
        matrixLabel: name + ' by list and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Lists and states · ' + HEAD
      });
    };
    searchLab('search-suggestions', 'Search suggestions', 'suggestions');
    searchLab('recent-searches', 'Recent searches', 'recent');
  })();
}
