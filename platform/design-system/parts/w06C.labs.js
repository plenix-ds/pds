/* Plenix design system · library part w06C: the labs of wave 6, lane C. The toggle button (Button pressed, on the Button's
   own tokens through DS.buttonToken), the async select's loading row and option marks (Combobox), the range slider's
   track, thumbs and marks (Slider), InlineEdit and RichTextEditor, each drawn with the markup the component renders, so
   every value shows with the one --plx-comp-* token behind it. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var attr = function (on, a) { return on ? ' ' + a : ''; };
    var icon = function (name) { return DS.icon(name); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var stCls = function (state) { return state === 'hover' ? ' ds-hover' : state === 'focus' ? ' ds-focus' : ''; };

    // ---- Toggle button (<Button pressed>): off and on in each variant; the Button's own tokens (DS.buttonToken, button-lab.js)
    // the state 'default' is off (a variant page opens the lab on 'default')
    var TOGGLE_STATE = { default: 'default', on: 'selected', focus: 'selected', disabled: 'disabled' };
    DS.registerLab('toggle-button', {
      name: 'Toggle button', title: 'Plenix toggle button', file: 'platform/components/Button/button.css', compPrefix: /^plx-comp-button-/,
      store: 'plenix-toggle-button-lab-tokens', sizes: [['sm', 'Small'], ['md', 'Medium']],
      variants: [['secondary', 'Secondary (default)'], ['ghost', 'Ghost'], ['tertiary', 'Tertiary'], ['primary', 'Primary']],
      states: [['default', 'Off (aria-pressed false)'], ['on', 'On (aria-pressed true)'], ['focus', 'On, focus'], ['disabled', 'Disabled']],
      content: [['text', 'Label'], ['icon-only', 'Icon only']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'ghost', state: 'on', content: 'text' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
        { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
        { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' }
      ],
      token: function (id, size, variant, state, content) {
        if (content === 'icon-only' && (id === 'fs' || id === 'fw')) return null;
        return DS.buttonToken ? DS.buttonToken(id, size, variant, TOGGLE_STATE[state] || 'default') : null;
      },
      reach: function (full) { return /-selected-/.test(full) ? 'every selected or pressed button' : /-size-/.test(full) ? 'every button of this size' : 'every button of this variant'; },
      every: 'every button',
      html: function (variant, size, state, extraCls, ui) {
        var on = state !== 'default', only = ui && ui.content === 'icon-only';
        var cls = ['plx-button', 'plx-button--' + variant, size !== 'md' ? 'plx-button--size-' + size : '', only ? 'plx-button--icon-only' : '', on ? 'is-selected' : '', state === 'focus' ? 'ds-focus' : '', extraCls || ''].filter(Boolean).join(' ');
        return '<button type="button" tabindex="-1" class="' + cls + '" aria-pressed="' + on + '"' + (only ? ' aria-label="Show grid"' : '') + attr(state === 'disabled', 'disabled') + '>'
          + (only ? '<span class="plx-button__icon">' + icon('grid-2x2') + '</span>' : '<span class="plx-button__label">Show grid</span>') + '</button>';
      },
      labelSelector: '.plx-button__label',
      parts: { bg: 'A', bc: 'B', bw: 'B', rad: 'B', fg: 'C', fs: 'C', fw: 'C', h: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: null, side: 'top' }, C: { part: '.plx-button__label', side: 'bottom' }, D: { part: null, side: 'right' } },
      sections: [['Color', ['bg', 'bc', 'fg']], ['Size and shape', ['h', 'rad', 'bw']], ['Typography', ['fs', 'fw']]],
      matrixLabel: 'Toggle buttons by variant and state', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Async select, Checkbox select, Radio select (<Combobox loadOptions | marks>): the loading row, the failed load,
    // the option marks. Drawn open in place (the list is absolute under the field): .ds-more-combobox gives it room.
    var CB = function (n) { return 'plx-comp-combobox-' + n; };
    var OPTION = '.plx-combobox__option', LOADING = '.plx-combobox__loading', ERROR = '.plx-combobox__error';
    DS.registerLab('async-select', {
      name: 'Async select', title: 'Plenix async select', file: 'platform/components/Combobox/combobox.css', compPrefix: /^plx-comp-combobox-(option-mark|option-icon|option-description|loading|error)-/,
      store: 'plenix-async-select-lab-tokens', sizes: [['default', 'Default', '.plx-combobox']],
      variants: [['async', 'Loaded as you type (async)'], ['checkbox', 'Checkbox marks (several)'], ['radio', 'Radio marks (one choice)'], ['rich', 'Icon and description'], ['clear', 'With a Clear button']],
      states: [['default', 'Open (the list showing)']],
      content: [['options', 'Options'], ['loading', 'Loading'], ['failed', 'Failed load'], ['none', 'No matches, with an action']],
      labels: { size: 'Size', variant: 'Options', state: 'State', content: 'List' },
      defaults: { size: 'default', variant: 'async', state: 'default', content: 'loading' },
      props: [
        { id: 'mg', label: 'Gap (mark to label)', css: ['column-gap'], part: OPTION, cat: 'space' },
        { id: 'lfg', label: 'Loading text color', css: ['color'], part: LOADING, cat: 'color' },
        { id: 'lgap', label: 'Gap (spinner to text)', css: ['column-gap'], part: LOADING, cat: 'space' },
        { id: 'lfs', label: 'Loading font size', css: ['font-size'], part: LOADING, cat: 'font-size' },
        { id: 'lpy', label: 'Loading padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: LOADING, cat: 'space' },
        { id: 'lpx', label: 'Loading padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: LOADING, cat: 'space' },
        { id: 'efg', label: 'Failed load text color', css: ['color'], part: ERROR, cat: 'color' },
        { id: 'ig', label: 'Gap (icon to label)', css: ['margin-inline-end'], show: 'margin-right', part: '.plx-combobox__option-icon', cat: 'space' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-combobox__option-icon', cat: 'color' },
        { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-combobox__option-description', cat: 'color' },
        { id: 'dfs', label: 'Description font size', css: ['font-size'], part: '.plx-combobox__option-description', cat: 'font-size' }
      ],
      token: function (id, size, variant, state, content) {
        if (id === 'mg') return content === 'options' && variant !== 'async' ? CB('option-mark-gap') : null;
        if (id === 'efg') return content === 'failed' ? CB('error-text') : null;
        var R = { ig: 'option-icon-gap', ic: 'option-icon-text', dc: 'option-description-text', dfs: 'option-description-font-size' };
        if (R[id]) return content === 'options' && variant === 'rich' ? CB(R[id]) : null;
        var L = { lfg: 'loading-text', lgap: 'loading-gap', lfs: 'loading-font-size', lpy: 'loading-padding-block', lpx: 'loading-padding-inline' };
        return L[id] && content === 'loading' ? CB(L[id]) : null;
      },
      reach: function (full) { return /icon|description/.test(full) ? 'every combobox option with an icon or a second line' : /mark/.test(full) ? 'every combobox with marks' : /error/.test(full) ? 'every failed load' : 'every combobox while it loads'; },
      every: 'every combobox',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'options', multi = variant === 'checkbox', marks = variant === 'checkbox' || variant === 'radio', rich = variant === 'rich', clear = variant === 'clear';
        var opt = function (label, on, active) {
          return '<li role="option" aria-selected="' + on + '" class="plx-combobox__option' + (active ? ' is-active' : '') + (on ? ' is-selected' : '') + '">'
            + (marks ? '<input type="' + (multi ? 'checkbox' : 'radio') + '" class="plx-check__input plx-combobox__mark" tabindex="-1" aria-hidden="true"' + attr(on, 'checked') + '><span class="plx-combobox__option-label">' + label + '</span>' : label) + '</li>';
        };
        var ric = function (label, desc, ico, active) { return '<li role="option" aria-selected="false" class="plx-combobox__option' + (active ? ' is-active' : '') + '"><span class="plx-combobox__option-icon" aria-hidden="true">' + DS.icon(ico) + '</span><span class="plx-combobox__option-text"><span class="plx-combobox__option-label">' + label + '</span><span class="plx-combobox__option-description">' + desc + '</span></span></li>'; };
        var items = content === 'loading' ? '<li class="plx-combobox__loading" role="presentation"><span class="plx-spinner plx-spinner--sm" role="status"><span class="plx-visually-hidden">Loading…</span></span><span aria-hidden="true">Loading…</span></li>'
          : content === 'failed' ? '<li class="plx-combobox__empty plx-combobox__error" role="presentation">The options could not be loaded</li>'
          : content === 'none' ? '<li class="plx-combobox__empty" role="presentation">No matches</li><li role="option" aria-selected="false" class="plx-combobox__option plx-combobox__action is-active"><span class="plx-combobox__option-icon" aria-hidden="true">' + DS.icon('add') + '</span>Add “Ra” as a new person</li>'
          : rich ? ric('Jordan Avery', 'Design lead · jordan@example.org', 'settings-users', true) + ric('Rachel Ng', 'Treasurer · rachel@example.org', 'settings-users', false) + ric('Ravi Anand', 'Volunteer · ravi@example.org', 'settings-users', false)
          : opt(multi ? 'Crosses' : 'Jordan Avery', !multi ? false : true, true) + opt(multi ? 'Borders' : 'Rachel Ng', !multi, false) + opt(multi ? 'Banners' : 'Ravi Anand', multi, false);
        return '<div class="ds-more-combobox ds-more-combobox--open"><div class="plx-combobox' + (multi ? ' plx-combobox--multiple' : '') + (marks ? ' plx-combobox--marks' : '') + ' is-open' + ex(extraCls) + '">'
          + '<div class="plx-combobox__field plx-input"><input class="plx-combobox__input" role="combobox" tabindex="-1" aria-label="' + (multi ? 'Categories' : 'Owner') + '" aria-expanded="true" aria-autocomplete="list" value="' + (variant === 'async' ? 'Ra' : '') + '" placeholder="' + (multi ? 'Choose categories' : 'Search people') + '">'
          + (clear ? '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only plx-combobox__clear" aria-label="Clear"><span class="plx-button__icon">' + DS.icon('close') + '</span></button>' : '')
          + '<span class="plx-combobox__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></div>'
          + '<ul class="plx-combobox__list" role="listbox" aria-label="Options"' + (multi ? ' aria-multiselectable="true"' : '') + (content === 'loading' ? ' aria-busy="true"' : '') + '>' + items + '</ul></div></div>';
      },
      labelSelector: '.plx-combobox__input',
      parts: { mg: 'A', lfg: 'B', lgap: 'B', lfs: 'B', lpy: 'B', lpx: 'B', efg: 'C', ig: 'D', ic: 'D', dc: 'E', dfs: 'E' },
      anchors: { A: { part: OPTION, side: 'right' }, B: { part: LOADING, side: 'right' }, C: { part: ERROR, side: 'right' }, D: { part: '.plx-combobox__option-icon', side: 'right' }, E: { part: '.plx-combobox__option-description', side: 'right' } },
      sections: [['Marks', ['mg']], ['Loading', ['lfg', 'lgap', 'lfs', 'lpy', 'lpx']], ['Failed load', ['efg']], ['Icon and description', ['ig', 'ic', 'dc', 'dfs']]],
      matrixLabel: 'Async select by list', matrixColumnWidth: '--plx-ref-size-80u', statesHead: 'Options and lists · ' + HEAD
    });

    // ---- Range slider (<Slider range | marks>): the track it draws, the filled part, the round thumbs, the marks
    var SL = function (n) { return 'plx-comp-slider-' + n; };
    var RAIL = '.plx-slider__rail', FILL = '.plx-slider__fill', MARK = '.plx-slider__mark', THUMB = '.plx-slider__input';
    DS.registerLab('range-slider', {
      name: 'Range slider', title: 'Plenix range slider', file: 'platform/components/Slider/slider.css', compPrefix: /^plx-comp-slider-(track|fill|thumb|mark)-/,
      store: 'plenix-range-slider-lab-tokens', sizes: [['default', 'Default', '.plx-slider--custom']],
      variants: [['range', 'Range (two thumbs)'], ['marks', 'With marks']],
      states: [['default', 'Default'], ['disabled', 'Disabled']],
      content: [['value', 'A value']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'range', state: 'default', content: 'value' },
      props: [
        { id: 'th', label: 'Track height', css: ['block-size'], show: 'height', part: RAIL, cat: 'size' },
        { id: 'tbg', label: 'Track color', css: ['background-color'], part: RAIL, cat: 'color' },
        { id: 'trad', label: 'Track corners', css: CORNERS, show: 'border-top-left-radius', part: RAIL, cat: 'radius' },
        { id: 'fbg', label: 'Filled part color', css: ['background-color'], part: FILL, cat: 'color' },
        // the thumb is a pseudo-element (::-webkit-slider-thumb, ::-moz-range-thumb) the browser does not report: its tokens are read on the input
        { id: 'ts', label: 'Thumb size', v: '--plx-comp-slider-thumb-size', part: THUMB, cat: 'icon' },
        { id: 'tbgc', label: 'Thumb color', v: '--plx-comp-slider-thumb-background', part: THUMB, cat: 'color' },
        { id: 'mfg', label: 'Mark color', css: ['color'], part: MARK, cat: 'color' },
        { id: 'mff', label: 'Mark font family', css: ['font-family'], part: MARK, cat: 'font' },
        { id: 'mfs', label: 'Mark font size', css: ['font-size'], part: MARK, cat: 'font-size' },
        { id: 'mlh', label: 'Mark line height', css: ['line-height'], part: MARK, cat: 'line-height' }
      ],
      token: function (id, size, variant) {
        var marks = variant === 'marks';
        var T = { th: 'track-height', tbg: 'track-background', trad: 'track-radius', fbg: 'fill-background', ts: 'thumb-size', tbgc: 'thumb-background' };
        if (T[id]) return SL(T[id]);
        var M = { mfg: 'mark-text', mff: 'mark-font-family', mfs: 'mark-font-size', mlh: 'mark-line-height' };
        return M[id] && marks ? SL(M[id]) : null;
      },
      reach: function (full) { return /-mark-/.test(full) ? 'every slider mark' : 'every range or marked slider'; },
      every: 'every range or marked slider',
      // the fill and the marks are placed by the component (inline, on the grid); the lab draws them at rest, unplaced
      html: function (variant, size, state, extraCls) {
        var range = variant === 'range', dis = attr(state === 'disabled', 'disabled');
        var input = function (v, name) { return '<input type="range" class="plx-slider__input" min="0" max="100" step="25" value="' + v + '" tabindex="-1" aria-label="' + name + '"' + dis + '>'; };
        return '<div class="ds-w06c-lab"><div class="plx-slider plx-slider--custom' + (range ? ' plx-slider--range' : ' plx-slider--marks') + (state === 'disabled' ? ' is-disabled' : '') + ex(extraCls) + '">'
          + '<div class="plx-slider__head"><span class="plx-slider__label">' + (range ? 'Price' : 'Quality') + '</span><output class="plx-slider__value">' + (range ? '25–75 €' : '50%') + '</output></div>'
          + '<div class="plx-slider__control"><div class="plx-slider__rail" aria-hidden="true"><div class="plx-slider__span"><div class="plx-slider__fill"></div></div></div>'
          + (range ? input(25, 'Price, minimum') + input(75, 'Price, maximum') : input(50, 'Quality')) + '</div>'
          + (range ? '' : '<div class="plx-slider__marks" aria-hidden="true"><div class="plx-slider__marks-span">' + [0, 25, 50, 75, 100].map(function (m) { return '<span class="plx-slider__mark">' + m + '</span>'; }).join('') + '</div></div>')
          + '</div></div>';
      },
      labelSelector: '.plx-slider__label',
      parts: { th: 'A', tbg: 'A', trad: 'A', fbg: 'B', ts: 'C', tbgc: 'C', mfg: 'D', mff: 'D', mfs: 'D', mlh: 'D' },
      anchors: { A: { part: RAIL, side: 'left' }, B: { part: FILL, side: 'top' }, C: { part: THUMB, side: 'right' }, D: { part: MARK, side: 'bottom' } },
      sections: [['Track', ['th', 'tbg', 'trad', 'fbg']], ['Thumbs', ['ts', 'tbgc']], ['Marks', ['mfg', 'mff', 'mfs', 'mlh']]],
      matrixLabel: 'Range and marked sliders', matrixColumnWidth: '--plx-ref-size-80u', statesHead: 'Kinds and states · ' + HEAD
    });

    // ---- InlineEdit (<InlineEdit>): the read view (the field's size, its hover tint and focus border, the pencil), the
    // edit view's buttons and the message under an invalid field
    var IE = function (n) { return 'plx-comp-inline-edit-' + n; };
    var READ = '.plx-inline-edit__read', HINT = '.plx-inline-edit__hint', ACTIONS = '.plx-inline-edit__actions', EDIT = '.plx-inline-edit__edit', ERR = '.plx-inline-edit__error';
    var VALUES = { text: 'Cross 014', textarea: 'Gold leaf on the border.\nRed ochre for the cross.', select: 'In review', confirm: 'Cross 014' };
    DS.registerLab('inline-edit', {
      name: 'Inline edit', title: 'Plenix inline edit', file: 'platform/components/InlineEdit/inline-edit.css', compPrefix: /^plx-comp-inline-edit-/,
      store: 'plenix-inline-edit-lab-tokens', sizes: [['default', 'Default', '.plx-inline-edit']],
      variants: [['text', 'Text (default)'], ['textarea', 'Text area'], ['select', 'Select'], ['confirm', 'With confirm buttons']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['empty', 'Empty']],
      content: [['read', 'Read view'], ['edit', 'Edit view'], ['invalid', 'Edit view, invalid']],
      labels: { size: 'Size', variant: 'Field', state: 'State', content: 'View' },
      defaults: { size: 'default', variant: 'text', state: 'hover', content: 'read' },
      props: [
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'bg', label: 'Background color', css: ['background-color'], part: READ, cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', part: READ, cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', part: READ, cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', part: READ, cat: 'radius' },
        { id: 'fg', label: 'Text color', css: ['color'], part: READ, cat: 'color' },
        { id: 'ff', label: 'Font family', css: ['font-family'], part: READ, cat: 'font' },
        { id: 'fs', label: 'Font size', css: ['font-size'], part: READ, cat: 'font-size' },
        { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', part: READ, cat: 'control-height' },
        { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: READ, cat: 'space' },
        { id: 'py', label: 'Padding top & bottom (text area)', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: READ, cat: 'space' },
        { id: 'gap', label: 'Gap (value to pencil)', css: ['column-gap'], part: READ, cat: 'space' },
        { id: 'hc', label: 'Pencil color', css: ['color'], part: HINT, cat: 'color' },
        { id: 'ag', label: 'Gap (field to buttons)', css: ['column-gap'], part: EDIT, cat: 'space' },
        { id: 'bg2', label: 'Gap (between the buttons)', css: ['column-gap'], part: ACTIONS, cat: 'space' },
        { id: 'efg', label: 'Message color', css: ['color'], part: ERR, cat: 'color' },
        { id: 'efs', label: 'Message font size', css: ['font-size'], part: ERR, cat: 'font-size' },
        { id: 'emt', label: 'Gap above the message', css: ['margin-block-start'], show: 'margin-top', part: ERR, cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        if (id === 'mw') return IE('max-width');
        if (content !== 'read') {
          if (id === 'ag') return IE('actions-gap');
          if (id === 'bg2') return variant === 'confirm' ? IE('actions-gap') : null;
          if (content === 'invalid') return { efg: IE('error-text'), efs: IE('error-font-size'), emt: IE('error-gap') }[id] || null;
          return null;
        }
        switch (id) {
          case 'bg': return state === 'hover' ? IE('read-hover-background') : IE('read-background');
          case 'bc': return state === 'focus' ? IE('read-focus-border-color') : IE('read-border-color');
          case 'bw': return IE('read-border-width');
          case 'rad': return IE('read-radius');
          case 'fg': return state === 'empty' ? IE('read-empty-text') : IE('read-text');
          case 'ff': return IE('read-font-family');
          case 'fs': return IE('read-font-size');
          case 'h': return IE('read-min-height');
          case 'px': return IE('read-padding-inline');
          case 'py': return variant === 'textarea' ? IE('read-textarea-padding-block') : null;
          case 'gap': return state === 'empty' ? null : IE('read-gap');
          case 'hc': return state === 'empty' ? null : IE('hint-text');
          default: return null;
        }
      },
      reach: function (full) { return /-error-/.test(full) ? 'every invalid inline edit' : /-actions-/.test(full) ? 'every inline edit while it is open' : 'every inline edit'; },
      every: 'every inline edit',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'read', type = variant === 'confirm' ? 'text' : variant, empty = state === 'empty';
        var value = empty ? '' : VALUES[variant];
        var root = '<div class="plx-inline-edit plx-inline-edit--' + type + (content !== 'read' ? ' is-editing' : '') + ex(extraCls) + '">';
        if (content === 'read') {
          return '<div class="ds-w06c-lab">' + root + '<button type="button" tabindex="-1" class="plx-inline-edit__read' + (empty ? ' is-empty' : '') + stCls(state) + '">'
            + '<span class="plx-visually-hidden">Name, </span><span class="plx-inline-edit__value">' + (empty ? 'Add a value' : value) + '</span><span class="plx-visually-hidden">, edit</span>'
            + (empty ? '' : '<span class="plx-inline-edit__hint" aria-hidden="true">' + icon('pencil') + '</span>') + '</button></div></div>';
        }
        var invalid = content === 'invalid', inv = attr(invalid, 'aria-invalid="true"');
        var field = type === 'textarea' ? '<textarea class="plx-input plx-input--textarea plx-input--auto-grow" rows="3" tabindex="-1" aria-label="Description"' + inv + '>' + value + '</textarea>'
          : type === 'select' ? '<span class="plx-select"><select class="plx-input plx-select__control" tabindex="-1" aria-label="Status"' + inv + '><option>Draft</option><option selected>In review</option></select><span class="plx-select__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></span>'
          : '<input type="text" class="plx-input" value="' + (invalid ? '' : value) + '" tabindex="-1" aria-label="Name"' + inv + '>';
        var btn = function (name, label) { return '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-xs plx-button--icon-only" aria-label="' + label + '"><span class="plx-button__icon">' + icon(name) + '</span></button>'; };
        return '<div class="ds-w06c-lab">' + root + '<div class="plx-inline-edit__edit"><div class="plx-inline-edit__control">' + field + '</div>'
          + (variant === 'confirm' ? '<div class="plx-inline-edit__actions">' + btn('check', 'Save name') + btn('close', 'Cancel') + '</div>' : '') + '</div>'
          + (invalid ? '<div class="plx-inline-edit__error" role="alert">Enter a name.</div>' : '') + '</div></div>';
      },
      labelSelector: '.plx-inline-edit__value',
      parts: { mw: 'A', bg: 'B', bc: 'B', bw: 'B', rad: 'B', h: 'B', fg: 'C', ff: 'C', fs: 'C', px: 'C', py: 'C', gap: 'D', hc: 'D', ag: 'E', bg2: 'E', efg: 'F', efs: 'F', emt: 'F' },
      anchors: { A: { part: null, side: 'top' }, B: { part: READ, side: 'left' }, C: { part: '.plx-inline-edit__value', side: 'bottom' }, D: { part: HINT, side: 'right' }, E: { part: ACTIONS, side: 'right' }, F: { part: ERR, side: 'bottom' } },
      sections: [['Read view', ['mw', 'bg', 'bc', 'bw', 'rad', 'h']], ['Text', ['fg', 'ff', 'fs', 'px', 'py']], ['Pencil', ['gap', 'hc']], ['Edit view', ['ag', 'bg2']], ['Message', ['efg', 'efs', 'emt']]],
      matrixLabel: 'Inline edit by field and state', matrixColumnWidth: '--plx-ref-size-80u', statesHead: 'Fields and states · ' + HEAD
    });

    // ---- RichTextEditor (<RichTextEditor>): the field frame, the toolbar's divider and padding, the editing area, the
    // placeholder, a mention and the mentions list (drawn in place under the area)
    var RT = function (n) { return 'plx-comp-rich-text-editor-' + n; };
    var TOOLBAR = '.plx-rich-text-editor__toolbar', AREA = '.plx-rich-text-editor__area', MEN = '.plx-rich-text-editor__mention', LIST = '.plx-rich-text-editor__mentions', MOPT = '.plx-rich-text-editor__mention-option';
    var tb = function (label, pressed, iconName) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm' + (iconName ? ' plx-button--icon-only' : '') + (pressed ? ' is-selected' : '') + '"'
        + (pressed !== null ? ' aria-pressed="' + !!pressed + '"' : '') + (iconName ? ' aria-label="' + label + '"><span class="plx-button__icon">' + icon(iconName) + '</span>' : '><span class="plx-button__label">' + label + '</span>') + '</button>';
    };
    DS.registerLab('rich-text-editor', {
      name: 'Rich-text editor', title: 'Plenix rich-text editor', file: 'platform/components/RichTextEditor/rich-text-editor.css', compPrefix: /^plx-comp-rich-text-editor-/,
      store: 'plenix-rich-text-editor-lab-tokens', sizes: [['default', 'Default', '.plx-rich-text-editor']],
      variants: [['basic', 'Basic (default)'], ['full', 'Full toolbar'], ['read-only', 'Read-only']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['text', 'Formatted text'], ['formats', 'Every format'], ['markdown', 'Markdown shortcuts'], ['mentions', 'Mentions slot'], ['empty', 'Empty (placeholder)']],
      labels: { size: 'Size', variant: 'Toolbar', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'basic', state: 'default', content: 'text' },
      props: [
        { id: 'mw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'tdc', label: 'Toolbar divider color', css: ['border-bottom-color'], part: TOOLBAR, cat: 'color' },
        { id: 'tpy', label: 'Toolbar padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: TOOLBAR, cat: 'space' },
        { id: 'tpx', label: 'Toolbar padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: TOOLBAR, cat: 'space' },
        { id: 'amin', label: 'Area minimum height', css: ['min-block-size'], show: 'min-height', part: AREA, cat: 'size' },
        { id: 'amax', label: 'Area maximum height', css: ['max-block-size'], show: 'max-height', part: AREA, cat: 'size' },
        { id: 'apy', label: 'Area padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: AREA, cat: 'space' },
        { id: 'apx', label: 'Area padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: AREA, cat: 'space' },
        { id: 'ph', label: 'Placeholder color', css: ['color'], part: AREA, pseudo: '::before', cat: 'color' },
        { id: 'mfg', label: 'Mention color', css: ['color'], part: MEN, cat: 'color' },
        { id: 'mfw', label: 'Mention font weight', css: ['font-weight'], part: MEN, cat: 'font-weight' },
        { id: 'lbg', label: 'Mentions list background', css: ['background-color'], part: LIST, cat: 'color' },
        { id: 'lbc', label: 'Mentions list border color', css: BORDERS, show: 'border-top-color', part: LIST, cat: 'color' },
        { id: 'lrad', label: 'Mentions list corners', css: CORNERS, show: 'border-top-left-radius', part: LIST, cat: 'radius' },
        { id: 'lmin', label: 'Mentions list minimum width', css: ['min-inline-size'], show: 'min-width', part: LIST, cat: 'size' },
        { id: 'oh', label: 'Option minimum height', css: ['min-block-size'], show: 'min-height', part: MOPT, cat: 'control-height' },
        { id: 'ofs', label: 'Option font size', css: ['font-size'], part: MOPT, cat: 'font-size' },
        { id: 'abg', label: 'Active option background', css: ['background-color'], part: MOPT + '.is-active', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var ro = variant === 'read-only', dis = state === 'disabled';
        switch (id) {
          case 'mw': return RT('max-width');
          case 'bg': return dis ? RT('disabled-background') : ro ? RT('read-only-background') : RT('background');
          case 'bc': return state === 'invalid' ? RT('invalid-border-color') : state === 'focus' ? RT('focus-border-color') : state === 'hover' ? RT('hover-border-color') : RT('border-color');
          case 'bw': return RT('border-width');
          case 'rad': return RT('radius');
          case 'tdc': return ro ? null : RT('toolbar-border-color');
          case 'tpy': return ro ? null : RT('toolbar-padding-block');
          case 'tpx': return ro ? null : RT('toolbar-padding-inline');
          case 'amin': return RT('area-min-height');
          case 'amax': return RT('area-max-height');
          case 'apy': return RT('area-padding-block');
          case 'apx': return RT('area-padding-inline');
          case 'ph': return content === 'empty' ? RT('placeholder-text') : null;
          case 'mfg': return content === 'mentions' ? RT('mention-text') : null;
          case 'mfw': return content === 'mentions' ? RT('mention-font-weight') : null;
          default: break;
        }
        if (content !== 'mentions' || ro || dis) return null;
        return { lbg: RT('mentions-background'), lbc: RT('mentions-border-color'), lrad: RT('mentions-radius'), lmin: RT('mentions-min-width'), oh: RT('mention-option-min-height'), ofs: RT('mention-option-font-size'), abg: RT('mention-option-active-background') }[id] || null;
      },
      reach: function (full) { return /mention/.test(full) ? 'every mention and mentions list' : /toolbar/.test(full) ? 'every rich-text editor toolbar' : 'every rich-text editor'; },
      every: 'every rich-text editor',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'text', ro = variant === 'read-only', dis = state === 'disabled', full = variant === 'full';
        // the groups as the component draws them: each in an overflow slot; the full toolbar's last groups in its More formatting menu
        var slot = function (inner) { return '<span data-plx-overflow-item="" class="plx-rich-text-editor__slot"><div class="plx-toolbar__group">' + inner + '</div></span>'; };
        var mb = function (label, text) { return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-button--caret" aria-haspopup="menu" aria-label="' + label + ': ' + text + '"><span class="plx-button__label">' + text + '</span><span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span></button>'; };
        var groups = full
          ? slot(mb('Text style', 'Paragraph')) + slot(mb('Font', 'Font') + mb('Size', 'Size'))
            + slot(tb('Bold', true, 'format-bold') + tb('Italic', false, 'format-italic') + tb('Underline', false, 'format-underlined') + tb('Strikethrough', false, 'format-strikethrough') + tb('Inline code', false, 'code') + tb('Subscript', false, 'subscript') + tb('Superscript', false, 'superscript'))
            + slot(tb('Text color', null, 'format-color-text') + tb('Highlight', false, 'ink-highlighter'))
            + '<span data-plx-overflow-more="" class="plx-rich-text-editor__slot"><button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-button--icon-only" aria-haspopup="menu" aria-label="More formatting"><span class="plx-button__icon">' + icon('more') + '</span></button></span>'
          : slot(tb('Bold', true, 'format-bold') + tb('Italic', false, 'format-italic') + tb('Link', false, 'link')) + slot(tb('Bulleted list', false, 'list-bullets') + tb('Numbered list', false, 'format-list-numbered'));
        var toolbar = ro ? '' : '<div role="toolbar" aria-label="Formatting" class="plx-toolbar plx-rich-text-editor__toolbar"><div class="plx-rich-text-editor__groups">' + groups + '</div></div>';
        var text = content === 'empty' ? '' : content === 'markdown' ? '<p>Type <code>- </code> for a list, <strong>bold</strong> with two stars.</p><ul><li>Started with “- ”</li></ul>'
          : content === 'mentions' ? '<p>Thanks, <span class="plx-rich-text-editor__mention" data-mention="rn" contenteditable="false">@Rachel Ng</span>. Ask @Ra</p>'
          : content === 'formats' ? '<h3>Every format</h3><p><strong>Bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <code>code</code>, H<sub>2</sub>O, x<sup>2</sup>, <mark>highlight</mark>, <a href="#">a link</a>.</p>'
            + '<ul data-type="taskList"><li data-type="taskItem" data-checked="true"><label contenteditable="false"><input type="checkbox" class="plx-check__input" tabindex="-1" checked aria-label="Gild the border"></label><div><p>Gild the border</p></div></li><li data-type="taskItem" data-checked="false"><label contenteditable="false"><input type="checkbox" class="plx-check__input" tabindex="-1" aria-label="Hang the banner"></label><div><p>Hang the banner</p></div></li></ul>'
            + '<table><tbody><tr><th><p>Part</p></th><th><p>Color</p></th></tr><tr><td><p>Border</p></td><td><p>Gold leaf</p></td></tr></tbody></table><blockquote><p>A quote.</p></blockquote><pre><code>name: cross-014</code></pre><hr>'
          : '<p>The banner hangs in the <strong>north aisle</strong> from Easter to Pentecost.</p><ul><li>Gold leaf on the border</li><li>Red ochre for the cross</li></ul>';
        var list = content === 'mentions' && !ro && !dis ? '<ul role="listbox" aria-label="Suggestions" class="plx-rich-text-editor__mentions"><li role="option" aria-selected="true" class="plx-rich-text-editor__mention-option is-active">Jordan Avery</li>'
          + '<li role="option" aria-selected="false" class="plx-rich-text-editor__mention-option">Ravi Anand</li></ul>' : '';
        return '<div class="ds-w06c-lab ds-w06c-lab--wide"><div class="plx-rich-text-editor' + (ro ? ' is-read-only' : '') + (dis ? ' is-disabled' : '') + stCls(state).replace('ds-focus', 'is-focus-visible') + ex(extraCls) + '">' + toolbar
          + '<div class="plx-rich-text plx-rich-text--compact plx-rich-text-editor__area plx-user-content' + (content === 'empty' ? ' is-empty' : '') + '" role="textbox" aria-multiline="true" aria-label="Description" tabindex="-1" data-placeholder="Describe the change"'
          + attr(state === 'invalid', 'aria-invalid="true"') + attr(ro, 'aria-readonly="true"') + attr(dis, 'aria-disabled="true"') + '>' + text + '</div>' + list + '</div></div>';
      },
      labelSelector: null,
      parts: { mw: 'A', bg: 'A', bc: 'B', bw: 'B', rad: 'B', tdc: 'C', tpy: 'C', tpx: 'C', amin: 'D', amax: 'D', apy: 'D', apx: 'D', ph: 'D', mfg: 'E', mfw: 'E', lbg: 'F', lbc: 'F', lrad: 'F', lmin: 'F', oh: 'G', ofs: 'G', abg: 'G' },
      anchors: { A: { part: null, side: 'left' }, B: { part: null, side: 'top' }, C: { part: TOOLBAR, side: 'right' }, D: { part: AREA, side: 'right' }, E: { part: MEN, side: 'bottom' }, F: { part: LIST, side: 'right' }, G: { part: MOPT, side: 'left' } },
      sections: [['Frame', ['mw', 'bg', 'bc', 'bw', 'rad']], ['Toolbar', ['tdc', 'tpy', 'tpx']], ['Editing area', ['amin', 'amax', 'apy', 'apx', 'ph']], ['Mentions', ['mfg', 'mfw', 'lbg', 'lbc', 'lrad', 'lmin', 'oh', 'ofs', 'abg']]],
      matrixLabel: 'Rich-text editor by toolbar and state', matrixColumnWidth: '--plx-ref-size-125u', statesHead: 'Toolbars and states · ' + HEAD
    });
  })();
}
