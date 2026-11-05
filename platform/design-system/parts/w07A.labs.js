/* Plenix design system · library part w07A: the labs of wave 7, lane A. Calendar, DatePicker, CountrySelect,
   ProgressSteps, the vertical tabs and the mobile app bar, each drawn in place with the markup the component renders, so
   every variant and state shows with the one --plx-comp-* token behind each value. Tabs and the application header (their
   labs live in navigation-labs.js) are registered again here with their new variants. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var icon = function (name, cls) { return DS.icon(name, cls); };
    var attr = function (on, a) { return on ? ' ' + a : ''; };
    var SIDES = function (prop) { return ['top', 'right', 'bottom', 'left'].map(function (s) { return prop.replace('%', s); }); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var iconButton = function (name, label, cls, disabled) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-button--icon-only ' + cls + '" aria-label="' + label + '"' + attr(disabled, 'disabled')
        + '><span class="plx-button__icon">' + icon(name) + '</span></button>';
    };

    // ---- Calendar (<Calendar>): October 2026 (it starts on a Thursday), weeks from Sunday; today the 15th
    var CA = function (n) { return 'plx-comp-calendar-' + n; };
    var MONTHS = { '2026-10': ['October 2026', 4, 31, 30], '2026-11': ['November 2026', 0, 30, 31] };   // [name, weekday of the 1st, days, days of the month before]
    var WEEKDAYS = [['Sun', 'Sunday'], ['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday']];
    // o: { outside, weeks, selected (day of October), range [from, to], off (day -> true), hover, focus }
    var month = function (ym, o, first, last) {
      var m = MONTHS[ym], own = ym === '2026-10';
      var cells = [], i;
      for (i = 0; i < m[1]; i++) cells.push({ day: m[3] - m[1] + 1 + i, outside: true });
      for (i = 1; i <= m[2]; i++) cells.push({ day: i });
      for (i = 1; cells.length % 7; i++) cells.push({ day: i, outside: true });
      var head = '<div class="plx-calendar__header">' + (first ? iconButton('chevron-left', 'Previous month', 'plx-calendar__nav plx-calendar__nav--previous') : '<span class="plx-calendar__nav-space" aria-hidden="true"></span>')
        + '<div class="plx-calendar__title">' + m[0] + '</div>'
        + (last ? iconButton('chevron-right', 'Next month', 'plx-calendar__nav plx-calendar__nav--next') : '<span class="plx-calendar__nav-space" aria-hidden="true"></span>') + '</div>';
      var rows = '<div role="row" class="plx-calendar__row plx-calendar__row--weekdays">' + (o.weeks ? '<span role="columnheader" class="plx-calendar__weekday plx-calendar__weekday--week" aria-label="Week">Wk</span>' : '')
        + WEEKDAYS.map(function (w) { return '<span role="columnheader" class="plx-calendar__weekday" aria-label="' + w[1] + '">' + w[0] + '</span>'; }).join('') + '</div>';
      for (var r = 0; r < cells.length / 7; r++) {
        rows += '<div role="row" class="plx-calendar__row">' + (o.weeks ? '<span role="rowheader" class="plx-calendar__week-number">' + (own ? 40 : 44) + r + '</span>' : '');
        for (var c = 0; c < 7; c++) {
          var x = cells[r * 7 + c];
          if (x.outside && !o.outside) { rows += '<span role="gridcell" class="plx-calendar__cell plx-calendar__cell--empty"></span>'; continue; }
          var mine = own && !x.outside, d = x.day;
          var rg = o.range && mine ? o.range : null;
          var start = rg && d === rg[0], end = rg && d === rg[1], between = rg && d > rg[0] && d < rg[1];
          var sel = mine && (start || end || d === o.selected), off = mine && o.off && o.off(d, c), today = mine && d === 15;
          var cls = 'plx-calendar__day' + (x.outside ? ' is-outside' : '') + (today ? ' is-today' : '') + (sel ? ' is-selected' : '') + (off ? ' is-disabled' : '')
            + (mine && d === o.hover ? ' is-hover' : '') + (mine && d === o.focus ? ' is-focus-visible' : '');
          rows += '<span role="gridcell" class="plx-calendar__cell' + (between ? ' is-in-range' : '') + (start ? ' is-range-start' : '') + (end ? ' is-range-end' : '') + '"' + attr(sel || between, 'aria-selected="true"') + '>'
            + '<button type="button" tabindex="-1" class="' + cls + '"' + attr(off, 'aria-disabled="true"') + attr(today, 'aria-current="date"') + '>' + d + '</button></span>';
        }
        rows += '</div>';
      }
      return '<div class="plx-calendar__month">' + head + '<div role="grid" aria-label="' + m[0] + '" class="plx-calendar__grid">' + rows + '</div></div>';
    };
    var calOpts = function (variant, state) {
      var o = { outside: true, selected: 20, hover: state === 'hover' ? 22 : null, focus: state === 'focus' ? 20 : null };
      if (variant === 'two') { o.outside = false; o.range = [26, 31]; o.selected = null; }
      if (variant === 'range') { o.range = [12, 21]; o.selected = null; }
      if (variant === 'weeks') o.weeks = true;
      if (variant === 'disabled') { o.off = function (d, c) { return c === 0 || c === 6; }; o.selected = 21; }
      if (variant === 'minmax') o.off = function (d) { return d < 8 || d > 28; };
      return o;
    };
    var calendarHtml = function (variant, state, extraCls) {
      var o = calOpts(variant, state), two = variant === 'two';
      return '<div role="group" aria-label="Due date" class="plx-calendar' + (two ? ' plx-calendar--two-months' : '') + (o.weeks ? ' plx-calendar--week-numbers' : '') + ex(extraCls) + '"><div class="plx-calendar__months">'
        + month('2026-10', o, true, !two) + (two ? month('2026-11', o, false, true) : '') + '</div></div>';
    };
    DS.registerLab('calendar', {
      name: 'Calendar', title: 'Plenix calendar', file: 'platform/components/Calendar/calendar.css', compPrefix: /^plx-comp-calendar-/,
      store: 'plenix-calendar-lab-tokens', sizes: [['default', 'Default', '.plx-calendar']],
      variants: [['month', 'Month (default)'], ['two', 'Two months'], ['range', 'Range highlight'], ['weeks', 'Week numbers'], ['disabled', 'Disabled dates'], ['minmax', 'Min and max']],
      states: [['default', 'Default'], ['hover', 'Hover (a day)'], ['focus', 'Focus (the chosen day)']], content: [['dates', 'October 2026']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'month', state: 'default', content: 'dates' },
      props: [
        { id: 'mg', label: 'Space between the months', css: ['column-gap'], part: '.plx-calendar__months', cat: 'space' },
        { id: 'hh', label: 'Header height', css: ['min-block-size'], show: 'min-height', part: '.plx-calendar__header', cat: 'control-height' },
        { id: 'ns', label: 'Room for a missing arrow', css: ['inline-size'], show: 'width', part: '.plx-calendar__nav-space', cat: 'size' },
        { id: 'tc', label: 'Month name color', css: ['color'], part: '.plx-calendar__title', cat: 'color' },
        { id: 'tfs', label: 'Month name size', css: ['font-size'], part: '.plx-calendar__title', cat: 'font-size' },
        { id: 'tfw', label: 'Month name weight', css: ['font-weight'], part: '.plx-calendar__title', cat: 'font-weight' },
        { id: 'wc', label: 'Weekday color', css: ['color'], part: '.plx-calendar__weekday', cat: 'color' },
        { id: 'wfs', label: 'Weekday size', css: ['font-size'], part: '.plx-calendar__weekday', cat: 'font-size' },
        { id: 'cs', label: 'Day size', css: ['inline-size'], show: 'width', part: '.plx-calendar__cell', cat: 'size' },
        { id: 'dc', label: 'Day color', css: ['color'], part: '.plx-calendar__cell:not(.is-in-range)>.plx-calendar__day:not(.is-today):not(.is-selected):not(.is-outside):not(.is-disabled):not(.is-hover)', cat: 'color' },
        { id: 'dfs', label: 'Day size of type', css: ['font-size'], part: '.plx-calendar__day', cat: 'font-size' },
        { id: 'dr', label: 'Day corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-calendar__day', cat: 'radius' },
        { id: 'hb', label: 'Hover fill', css: ['background-color'], part: '.plx-calendar__day.is-hover', cat: 'color' },
        { id: 'fo', label: 'Focus outline', css: ['outline-color'], part: '.plx-calendar__day.is-focus-visible', cat: 'color' },
        { id: 'tb', label: 'Today fill', css: ['background-color'], part: '.plx-calendar__day.is-today', cat: 'color' },
        { id: 'tt', label: 'Today number', css: ['color'], part: '.plx-calendar__day.is-today', cat: 'color' },
        { id: 'sb', label: 'Chosen day fill', css: ['background-color'], part: '.plx-calendar__day.is-selected', cat: 'color' },
        { id: 'sbc', label: 'Chosen day edge', css: SIDES('border-%-color'), show: 'border-top-color', part: '.plx-calendar__day.is-selected', cat: 'color' },
        { id: 'st', label: 'Chosen day number', css: ['color'], part: '.plx-calendar__day.is-selected', cat: 'color' },
        { id: 'rb', label: 'Range fill', css: ['background-color'], part: '.plx-calendar__cell.is-in-range', cat: 'color' },
        { id: 'rh', label: 'Range fill at the start', css: ['inset-inline-start'], show: 'left', part: '.plx-calendar__cell.is-range-start', pseudo: '::before', cat: 'space' },
        { id: 'oc', label: 'Days around the month', css: ['color'], part: '.plx-calendar__day.is-outside', cat: 'color' },
        { id: 'xc', label: 'Day that cannot be chosen', css: ['color'], part: '.plx-calendar__day.is-disabled', cat: 'color' },
        { id: 'wn', label: 'Week number color', css: ['color'], part: '.plx-calendar__week-number', cat: 'color' },
        { id: 'wnf', label: 'Week number font', css: ['font-family'], part: '.plx-calendar__week-number', cat: 'font' }
      ],
      token: function (id, size, variant, state) {
        var o = calOpts(variant, state), two = variant === 'two';
        switch (id) {
          case 'mg': return CA('months-gap');
          case 'hh': return CA('header-min-height');
          case 'ns': return two ? CA('nav-space-size') : null;
          case 'tc': return CA('title-text');
          case 'tfs': return CA('title-font-size');
          case 'tfw': return CA('title-font-weight');
          case 'wc': return CA('weekday-text');
          case 'wfs': return CA('weekday-font-size');
          case 'cs': return CA('cell-size');
          case 'dc': return CA('day-text');
          case 'dfs': return CA('day-font-size');
          case 'dr': return CA('day-radius');
          case 'hb': return state === 'hover' ? CA('day-hover-background') : null;
          case 'fo': return state === 'focus' ? CA('day-focus-outline-color') : null;
          case 'tb': return CA('day-today-background');
          case 'tt': return CA('day-today-text');
          case 'sb': return CA('day-selected-background');
          case 'sbc': return CA('day-selected-border-color');
          case 'st': return CA('day-selected-text');
          case 'rb': return o.range && o.range[1] - o.range[0] > 1 ? CA('range-background') : null;
          case 'rh': return o.range ? CA('range-half') : null;
          case 'oc': return o.outside ? CA('day-outside-text') : null;
          case 'xc': return o.off ? CA('day-disabled-text') : null;
          case 'wn': return o.weeks ? CA('week-number-text') : null;
          case 'wnf': return o.weeks ? CA('week-number-font-family') : null;
          default: return null;
        }
      },
      reach: function (full) { return /range/.test(full) ? 'every range in a calendar' : /today/.test(full) ? 'today in every calendar' : 'every calendar'; },
      every: 'every calendar',
      html: function (variant, size, state, extraCls) { return calendarHtml(variant, state, extraCls); },
      labelSelector: '.plx-calendar__title',
      parts: { mg: 'A', hh: 'A', ns: 'A', tc: 'A', tfs: 'A', tfw: 'A', wc: 'B', wfs: 'B', cs: 'C', dc: 'C', dfs: 'C', dr: 'C', hb: 'C', fo: 'C', tb: 'D', tt: 'D', sb: 'E', sbc: 'E', st: 'E', rb: 'F', rh: 'F', oc: 'G', xc: 'G', wn: 'H', wnf: 'H' },
      anchors: { A: { part: '.plx-calendar__title', side: 'top' }, B: { part: '.plx-calendar__weekday', side: 'top' }, C: { part: '.plx-calendar__cell', side: 'left' }, D: { part: '.plx-calendar__day.is-today', side: 'bottom' },
        E: { part: '.plx-calendar__day.is-selected', side: 'bottom' }, F: { part: '.plx-calendar__cell.is-in-range', side: 'top' }, G: { part: '.plx-calendar__day.is-outside', side: 'left' }, H: { part: '.plx-calendar__week-number', side: 'left' } },
      sections: [['Header', ['mg', 'hh', 'ns', 'tc', 'tfs', 'tfw']], ['Weekdays', ['wc', 'wfs']], ['Days', ['cs', 'dc', 'dfs', 'dr', 'hb', 'fo', 'oc', 'xc']], ['Today', ['tb', 'tt']], ['Chosen', ['sb', 'sbc', 'st']], ['Range', ['rb', 'rh']], ['Week numbers', ['wn', 'wnf']]],
      matrixLabel: 'Calendar values by variant and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Date picker (<DatePicker>): the field with its calendar button, and the popover's panel under it
    var DP = function (n) { return 'plx-comp-date-picker-' + n; };
    var boxState = function (state) { return { hover: ' is-hover', focus: ' is-focused', invalid: ' is-invalid', disabled: ' is-disabled' }[state] || ''; };
    var group = function (value, label, state, width, suffix, cls, endButton) {
      var d = state === 'disabled';
      return '<div class="plx-input-group plx-input-group--data ' + cls + '"><div class="plx-input-group__box' + (endButton ? ' plx-input-group__box--joined-end' : '') + boxState(state) + '">'
        + '<input type="text" tabindex="-1" class="plx-input plx-input--data plx-input-group__input' + (suffix ? ' plx-input-group__input--before-affix' : '') + '" aria-label="' + label + '" value="' + value + '"' + attr(d, 'disabled') + attr(state === 'invalid', 'aria-invalid="true"') + '>'
        + (suffix ? '<span class="plx-input-group__affix plx-input-group__affix--suffix">' + suffix + '</span>' : '') + '</div>'
        + (endButton ? '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--icon-only plx-input-group__attached plx-input-group__attached--end" aria-label="Choose date"' + attr(d, 'disabled') + '><span class="plx-button__icon">' + icon('calendar') + '</span></button>' : '') + '</div>';
    };
    var PRESETS = { single: ['Today', 'Tomorrow', 'In a week'], range: ['Last 7 days', 'Last 30 days', 'This month', 'Last month'] };
    DS.registerLab('date-picker', {
      name: 'Date picker', title: 'Plenix date picker', file: 'platform/components/DatePicker/date-picker.css', compPrefix: /^plx-comp-(date-picker|calendar)-/,
      store: 'plenix-date-picker-lab-tokens', sizes: [['default', 'Default', '.plx-date-picker']],
      variants: [['single', 'Single (default)'], ['range', 'Range'], ['date-time', 'Date and time'], ['presets', 'With presets']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['open', 'Calendar open'], ['closed', 'Closed']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'single', state: 'default', content: 'open' },
      props: [
        { id: 'w', label: 'Date field width', css: ['inline-size'], show: 'width', part: '.plx-date-picker__date', cat: 'size' },
        { id: 'tw', label: 'Time field width', css: ['inline-size'], show: 'width', part: '.plx-date-picker__time', cat: 'size' },
        { id: 'fg', label: 'Space between date and time', css: ['column-gap'], part: '.plx-date-picker__field', cat: 'space' },
        { id: 'pp', label: 'Panel padding', css: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'], show: 'padding-top', part: '.plx-date-picker__panel', cat: 'space' },
        { id: 'pg', label: 'Space between presets and calendar', css: ['column-gap'], part: '.plx-date-picker__panel', cat: 'space' },
        { id: 'sg', label: 'Space between presets', css: ['row-gap'], part: '.plx-date-picker__presets', cat: 'space' },
        { id: 'sp', label: 'Space before the divider', css: ['padding-inline-end'], show: 'padding-right', part: '.plx-date-picker__presets', cat: 'space' },
        { id: 'sbc', label: 'Divider color', css: ['border-inline-end-color'], show: 'border-right-color', part: '.plx-date-picker__presets', cat: 'color' },
        { id: 'sbw', label: 'Divider width', css: ['border-inline-end-width'], show: 'border-right-width', part: '.plx-date-picker__presets', cat: 'border-width' },
        { id: 'cs', label: 'Calendar day size', css: ['inline-size'], show: 'width', part: '.plx-calendar__cell', cat: 'size' }
      ],
      token: function (id, size, variant, state, content) {
        var open = content !== 'closed', pre = variant === 'presets' || variant === 'range';
        switch (id) {
          case 'w': return DP(variant === 'range' ? 'range-width' : 'width');
          case 'tw': return variant === 'date-time' ? DP('time-width') : null;
          case 'fg': return variant === 'date-time' ? DP('field-gap') : null;
          case 'pp': return open ? DP('panel-padding') : null;
          case 'pg': return open && pre ? DP('panel-gap') : null;
          case 'sg': case 'sp': case 'sbc': case 'sbw': return open && pre ? DP({ sg: 'presets-gap', sp: 'presets-padding-inline-end', sbc: 'presets-border-color', sbw: 'presets-border-width' }[id]) : null;
          case 'cs': return open ? 'plx-comp-calendar-cell-size' : null;
          default: return null;
        }
      },
      reach: function (full) { return /calendar/.test(full) ? 'every calendar' : /presets/.test(full) ? 'every date picker with presets' : 'every date picker'; },
      every: 'every date picker',
      html: function (variant, size, state, extraCls, ui) {
        var range = variant === 'range', dt = variant === 'date-time', pre = variant === 'presets' || range;
        var field = '<div class="plx-date-picker__field">' + group(range ? '10/01/2026 – 10/14/2026' : '10/20/2026', range ? 'Reporting period' : 'Due date', state, null, null, 'plx-date-picker__date', true)
          + (dt ? group('14:30', 'Time', state === 'invalid' ? 'default' : state, null, 'EDT', 'plx-date-picker__time', false) : '') + '</div>';
        var panel = ui.content === 'closed' ? '' : '<div class="plx-date-picker__panel' + (pre ? ' plx-date-picker__panel--presets' : '') + '">'
          + (pre ? '<div role="group" aria-label="Presets" class="plx-date-picker__presets">' + PRESETS[range ? 'range' : 'single'].map(function (p) { return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm plx-date-picker__preset"><span class="plx-button__label">' + p + '</span></button>'; }).join('') + '</div>' : '')
          + calendarHtml(range ? 'range' : 'month', 'default') + '</div>';
        return '<div class="plx-date-picker plx-date-picker--' + (range ? 'range' : dt ? 'date-time' : 'single') + ex(extraCls) + '"><div class="ds-w07a-picker">' + field + panel + '</div></div>';
      },
      labelSelector: '.plx-input-group__input',
      parts: { w: 'A', tw: 'A', fg: 'A', pp: 'B', pg: 'B', sg: 'C', sp: 'C', sbc: 'C', sbw: 'C', cs: 'D' },
      anchors: { A: { part: '.plx-date-picker__field', side: 'top' }, B: { part: '.plx-date-picker__panel', side: 'bottom' }, C: { part: '.plx-date-picker__presets', side: 'left' }, D: { part: '.plx-calendar__cell', side: 'right' } },
      sections: [['Field', ['w', 'tw', 'fg']], ['Popover', ['pp', 'pg']], ['Presets', ['sg', 'sp', 'sbc', 'sbw']], ['Calendar', ['cs']]],
      matrixLabel: 'Date picker values by variant and state', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Country / locale select (<CountrySelect>): the Combobox open on its list
    var LISTS = {
      country: [['Canada'], ['Germany', true], ['Mexico'], ['United States']],
      locale: [['Deutsch (Deutschland) · German (Germany)'], ['English (United Kingdom)', true], ['English (United States)'], ['español (España) · Spanish (Spain)']],
      language: [['Deutsch · German'], ['English'], ['español · Spanish', true], ['français · French']],
      flags: [['🇺🇸 United States', false, 'Suggested'], ['🇨🇦 Canada', true, 'Suggested'], ['🇩🇪 Germany', false, 'All'], ['🇫🇷 France', false, 'All']]
    };
    DS.registerLab('country-select', {
      name: 'Country / locale select', title: 'Plenix country and locale select', file: 'platform/components/CountrySelect/country-select.css', compPrefix: /^plx-comp-(country-select|combobox)-/,
      store: 'plenix-country-select-lab-tokens', sizes: [['default', 'Default', '.plx-country-select']],
      variants: [['country', 'Country (default)'], ['locale', 'Locale'], ['language', 'Language'], ['flags', 'With flag emoji']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['disabled', 'Disabled']], content: [['open', 'List open'], ['closed', 'Closed']],
      labels: { size: 'Size', variant: 'Type', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'country', state: 'default', content: 'open' },
      props: [
        { id: 'mw', label: 'Greatest width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'lmh', label: 'List height', css: ['max-block-size'], show: 'max-height', part: '.plx-combobox__list', cat: 'size' },
        { id: 'oc', label: 'Option color', css: ['color'], part: '.plx-combobox__option:not(.is-selected)', cat: 'color' },
        { id: 'ofs', label: 'Option size', css: ['font-size'], part: '.plx-combobox__option', cat: 'font-size' },
        { id: 'ab', label: 'Active option fill', css: ['background-color'], part: '.plx-combobox__option.is-active', cat: 'color' },
        { id: 'sc', label: 'Chosen option color', css: ['color'], part: '.plx-combobox__option.is-selected', cat: 'color' },
        { id: 'gc', label: 'Group heading color', css: ['color'], part: '.plx-combobox__group', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var open = content !== 'closed' && state !== 'disabled';
        switch (id) {
          case 'mw': return 'plx-comp-country-select-max-width';
          case 'lmh': return open ? 'plx-comp-combobox-list-max-height' : null;
          case 'oc': return open ? 'plx-comp-combobox-option-text' : null;
          case 'ofs': return open ? 'plx-comp-combobox-option-font-size' : null;
          case 'ab': return open ? 'plx-comp-combobox-option-active-background' : null;
          case 'sc': return open ? 'plx-comp-combobox-option-selected-text' : null;
          case 'gc': return open && variant === 'flags' ? 'plx-comp-combobox-group-text' : null;
          default: return null;
        }
      },
      reach: function (full) { return /country-select/.test(full) ? 'every country and locale select' : 'every combobox (and every country and locale select)'; },
      every: 'every country and locale select',
      html: function (variant, size, state, extraCls, ui) {
        var list = LISTS[variant] || LISTS.country, open = ui.content !== 'closed' && state !== 'disabled';
        var chosen = list.filter(function (x) { return x[1]; })[0];
        var items = '', last = null;
        list.forEach(function (x, i) {
          if (x[2] && x[2] !== last) { items += '<li class="plx-combobox__group" role="presentation">' + x[2] + '</li>'; last = x[2]; }
          items += '<li role="option" aria-selected="' + !!x[1] + '" class="plx-combobox__option' + (i === 0 ? ' is-active' : '') + (x[1] ? ' is-selected' : '') + '">' + x[0] + '</li>';
        });
        return '<div class="ds-w07a-select"><div class="plx-combobox plx-country-select' + (open ? ' is-open' : '') + (state === 'disabled' ? ' is-disabled' : '') + ex(extraCls) + '">'
          + '<div class="plx-combobox__field plx-input' + (state === 'focus' ? ' is-focused' : '') + '"><input tabindex="-1" class="plx-combobox__input" role="combobox" aria-expanded="' + open + '" aria-label="Country or region" value="' + (open ? '' : chosen[0]) + '" placeholder="' + chosen[0] + '"' + attr(state === 'disabled', 'disabled') + '><span class="plx-combobox__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></div>'
          + (open ? '<ul class="plx-combobox__list" role="listbox">' + items + '</ul>' : '') + '</div></div>';
      },
      labelSelector: '.plx-combobox__input',
      parts: { mw: 'A', lmh: 'B', oc: 'B', ofs: 'B', ab: 'B', sc: 'B', gc: 'C' },
      anchors: { A: { part: '.plx-combobox__field', side: 'top' }, B: { part: '.plx-combobox__option', side: 'right' }, C: { part: '.plx-combobox__group', side: 'left' } },
      sections: [['Field', ['mw']], ['List', ['lmh', 'oc', 'ofs', 'ab', 'sc', 'gc']]],
      matrixLabel: 'Country and locale select values by type and state', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Types and states · ' + HEAD
    });

    // ---- Stepper (<ProgressSteps>): four steps of an import
    var PS = function (n) { return 'plx-comp-progress-steps-' + n; };
    var STEP_LIST = [['Upload', '12 files'], ['Map columns', 'Name, owner, date'], ['Review'], ['Import']];
    var statusOf = function (variant, i) { return variant === 'status' ? ['complete', 'error', 'upcoming', 'upcoming'][i] : i < 2 ? 'complete' : i === 2 ? 'current' : 'upcoming'; };
    var WORDS = { complete: 'Complete', current: 'Current step', upcoming: 'Not started', error: 'Needs attention' };
    var stepsHtml = function (variant, state, extraCls) {
      if (variant === 'compact') {
        return '<div role="group" aria-label="Import steps" class="plx-progress-steps plx-progress-steps--compact' + ex(extraCls) + '"><p class="plx-progress-steps__count">Step 3 of 4<span class="plx-progress-steps__count-label">: Review</span></p>'
          + '<div class="plx-progress-steps__segments" aria-hidden="true">' + [0, 1, 2, 3].map(function (i) { return '<span class="plx-progress-steps__segment is-' + statusOf(variant, i) + '"></span>'; }).join('') + '</div></div>';
      }
      var vertical = variant === 'vertical', click = variant === 'clickable';
      return '<ol aria-label="Import steps" class="plx-progress-steps plx-progress-steps--' + (vertical ? 'vertical' : 'horizontal') + (click ? ' plx-progress-steps--clickable' : '') + ex(extraCls) + '">'
        + STEP_LIST.map(function (s, i) {
          var st = statusOf(variant, i), go = click && st !== 'upcoming';
          var marker = '<span class="plx-progress-steps__marker" aria-hidden="true">' + (st === 'complete' ? icon('check') : st === 'error' ? icon('alert') : '<span class="plx-progress-steps__number">' + (i + 1) + '</span>') + '</span>';
          var text = '<span class="plx-progress-steps__text"><span class="plx-progress-steps__label">' + s[0] + '</span><span class="plx-visually-hidden">, ' + WORDS[st] + '</span></span>';
          var flag = go && i === 0 ? (state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '') : '';
          var head = go ? '<button type="button" tabindex="-1" class="plx-progress-steps__head plx-progress-steps__button' + flag + '">' + marker + text + '</button>' : '<span class="plx-progress-steps__head">' + marker + text + '</span>';
          var desc = (vertical || variant === 'status') && (s[1] || (variant === 'status' && i === 1)) ? '<span class="plx-progress-steps__description">' + (variant === 'status' && i === 1 ? '2 columns not mapped' : s[1]) + '</span>' : '';
          return '<li class="plx-progress-steps__step is-' + st + '"' + attr(st === 'current', 'aria-current="step"') + '>' + head + desc + (i < 3 ? '<span class="plx-progress-steps__connector" aria-hidden="true"></span>' : '') + '</li>';
        }).join('') + '</ol>';
    };
    DS.registerLab('progress-steps', {
      name: 'Stepper', title: 'Plenix stepper', file: 'platform/components/ProgressSteps/progress-steps.css', compPrefix: /^plx-comp-progress-steps-/,
      store: 'plenix-progress-steps-lab-tokens', sizes: [['default', 'Default', '.plx-progress-steps']],
      variants: [['horizontal', 'Horizontal (default)'], ['vertical', 'Vertical'], ['clickable', 'Clickable'], ['status', 'With status (complete, current, error)'], ['compact', 'Compact']],
      states: [['default', 'Default'], ['hover', 'Hover (a done step)'], ['focus', 'Focus (a done step)']], content: [['steps', 'Four steps']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'horizontal', state: 'default', content: 'steps' },
      props: [
        { id: 'ms', label: 'Marker size', css: ['inline-size'], show: 'width', part: '.plx-progress-steps__marker', cat: 'size' },
        { id: 'mr', label: 'Marker corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-progress-steps__marker', cat: 'radius' },
        { id: 'mbw', label: 'Marker edge width', css: SIDES('border-%-width'), show: 'border-top-width', part: '.plx-progress-steps__marker', cat: 'border-width' },
        { id: 'ub', label: 'Upcoming marker fill', css: ['background-color'], part: '.is-upcoming .plx-progress-steps__marker', cat: 'color' },
        { id: 'uc', label: 'Upcoming marker edge', css: SIDES('border-%-color'), show: 'border-top-color', part: '.is-upcoming .plx-progress-steps__marker', cat: 'color' },
        { id: 'cb', label: 'Current marker fill', css: ['background-color'], part: '.is-current .plx-progress-steps__marker', cat: 'color' },
        { id: 'ct', label: 'Current marker number', css: ['color'], part: '.is-current .plx-progress-steps__marker', cat: 'color' },
        { id: 'db', label: 'Done marker fill', css: ['background-color'], part: '.is-complete .plx-progress-steps__marker', cat: 'color' },
        { id: 'dt', label: 'Done marker check', css: ['color'], part: '.is-complete .plx-progress-steps__marker', cat: 'color' },
        { id: 'eb', label: 'Attention marker fill', css: ['background-color'], part: '.is-error .plx-progress-steps__marker', cat: 'color' },
        { id: 'et', label: 'Attention marker icon', css: ['color'], part: '.is-error .plx-progress-steps__marker', cat: 'color' },
        { id: 'ic', label: 'Marker icon size', css: ['width'], part: '.plx-progress-steps__marker .plx-icon', cat: 'icon' },
        { id: 'lc', label: 'Step name color', css: ['color'], part: '.is-complete .plx-progress-steps__label', cat: 'color' },
        { id: 'lfs', label: 'Step name size', css: ['font-size'], part: '.plx-progress-steps__label', cat: 'font-size' },
        { id: 'clw', label: 'Current step name weight', css: ['font-weight'], part: '.is-current .plx-progress-steps__label', cat: 'font-weight' },
        { id: 'ulc', label: 'Upcoming step name color', css: ['color'], part: '.is-upcoming .plx-progress-steps__label', cat: 'color' },
        { id: 'elc', label: 'Attention step name color', css: ['color'], part: '.is-error .plx-progress-steps__label', cat: 'color' },
        { id: 'dc', label: 'Second line color', css: ['color'], part: '.plx-progress-steps__description', cat: 'color' },
        { id: 'kc', label: 'Connector color', css: ['background-color'], part: '.plx-progress-steps__step:not(.is-complete)>.plx-progress-steps__connector', cat: 'color' },
        { id: 'kd', label: 'Connector after a done step', css: ['background-color'], part: '.is-complete>.plx-progress-steps__connector', cat: 'color' },
        { id: 'km', label: 'Connector margin', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-progress-steps__connector', cat: 'space' },
        { id: 'bh', label: 'Clickable step hover fill', css: ['background-color'], part: '.plx-progress-steps__button.is-hover', cat: 'color' },
        { id: 'bf', label: 'Clickable step focus outline', css: ['outline-color'], part: '.plx-progress-steps__button.is-focus-visible', cat: 'color' },
        { id: 'cc', label: 'Step count color', css: ['color'], part: '.plx-progress-steps__count', cat: 'color' },
        { id: 'cfs', label: 'Step count size', css: ['font-size'], part: '.plx-progress-steps__count', cat: 'font-size' },
        { id: 'sh', label: 'Segment height', css: ['block-size'], show: 'height', part: '.plx-progress-steps__segment', cat: 'size' },
        { id: 'sb', label: 'Upcoming segment', css: ['background-color'], part: '.plx-progress-steps__segment.is-upcoming', cat: 'color' },
        { id: 'sd', label: 'Done segment', css: ['background-color'], part: '.plx-progress-steps__segment.is-complete', cat: 'color' }
      ],
      token: function (id, size, variant, state) {
        var compact = variant === 'compact', status = variant === 'status', click = variant === 'clickable', vertical = variant === 'vertical';
        if (compact) return { cc: PS('count-text'), cfs: PS('count-font-size'), sh: PS('segment-height'), sb: PS('segment-background'), sd: PS('segment-done-background') }[id] || null;
        switch (id) {
          case 'ms': return PS('marker-size');
          case 'mr': return PS('marker-radius');
          case 'mbw': return PS('marker-border-width');
          case 'ub': return PS('marker-background');
          case 'uc': return PS('marker-border-color');
          case 'cb': return status ? null : PS('current-marker-background');
          case 'ct': return status ? null : PS('current-marker-text');
          case 'db': return PS('complete-marker-background');
          case 'dt': return PS('complete-marker-text');
          case 'eb': return status ? PS('error-marker-background') : null;
          case 'et': return status ? PS('error-marker-text') : null;
          case 'ic': return PS('marker-icon-size');
          case 'lc': return PS('label-text');
          case 'lfs': return PS('label-font-size');
          case 'clw': return status ? null : PS('current-label-font-weight');
          case 'ulc': return PS('upcoming-label-text');
          case 'elc': return status ? PS('error-label-text') : null;
          case 'dc': return vertical || status ? PS('description-text') : null;
          case 'kc': return PS('connector-color');
          case 'kd': return PS('complete-connector-color');
          case 'km': return vertical ? null : PS('connector-margin');
          case 'bh': return click && state === 'hover' ? PS('button-hover-background') : null;
          case 'bf': return click && state === 'focus' ? PS('button-focus-outline-color') : null;
          default: return null;
        }
      },
      reach: function (full) { return /segment|count/.test(full) ? 'every compact stepper' : /button/.test(full) ? 'every clickable stepper' : 'every stepper, progress tracker and step progress'; },
      every: 'every stepper',
      html: function (variant, size, state, extraCls) { return stepsHtml(variant, state, extraCls); },
      labelSelector: '.plx-progress-steps__label',
      parts: { ms: 'A', mr: 'A', mbw: 'A', ub: 'A', uc: 'A', cb: 'A', ct: 'A', db: 'A', dt: 'A', eb: 'A', et: 'A', ic: 'A', lc: 'B', lfs: 'B', clw: 'B', ulc: 'B', elc: 'B', dc: 'B', kc: 'C', kd: 'C', km: 'C', bh: 'D', bf: 'D', cc: 'E', cfs: 'E', sh: 'F', sb: 'F', sd: 'F' },
      anchors: { A: { part: '.plx-progress-steps__marker', side: 'top' }, B: { part: '.plx-progress-steps__label', side: 'bottom' }, C: { part: '.plx-progress-steps__connector', side: 'top' }, D: { part: '.plx-progress-steps__button', side: 'left' },
        E: { part: '.plx-progress-steps__count', side: 'top' }, F: { part: '.plx-progress-steps__segments', side: 'bottom' } },
      sections: [['Marker', ['ms', 'mr', 'mbw', 'ub', 'uc', 'cb', 'ct', 'db', 'dt', 'eb', 'et', 'ic']], ['Name', ['lc', 'lfs', 'clw', 'ulc', 'elc', 'dc']], ['Connector', ['kc', 'kd', 'km']], ['Clickable', ['bh', 'bf']], ['Compact', ['cc', 'cfs', 'sh', 'sb', 'sd']]],
      matrixLabel: 'Stepper values by variant and state', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Vertical tabs (<Tabs orientation="vertical">), and Tabs registered again with the vertical variant
    var TV = function (n) { return 'plx-comp-tabs-vertical-' + n; };
    var VPROPS = [
      { id: 'vg', label: 'Space beside the tab list', css: ['column-gap'], cat: 'space' },
      { id: 'vw', label: 'Tab list width', css: ['inline-size'], show: 'width', part: '.plx-tabs__list', cat: 'size' },
      { id: 'vrg', label: 'Space between tabs', css: ['row-gap'], part: '.plx-tabs__tablist', cat: 'space' },
      { id: 'vh', label: 'Tab height', css: ['min-block-size'], show: 'min-height', part: '.plx-tabs__tab', cat: 'control-height' },
      { id: 'vpx', label: 'Tab padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-tabs__tab', cat: 'space' },
      { id: 'vr', label: 'Tab corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-tabs__tab', cat: 'radius' },
      { id: 'vfs', label: 'Tab font size', css: ['font-size'], part: '.plx-tabs__tab', cat: 'font-size' },
      { id: 'vt', label: 'Other tab text color', css: ['color'], part: '.plx-tabs__tab:not(.is-selected)', cat: 'color' },
      { id: 'vhb', label: 'Hover fill', css: ['background-color'], part: '.plx-tabs__tab.is-hover', cat: 'color' },
      { id: 'vsb', label: 'Open tab fill', css: ['background-color'], part: '.plx-tabs__tab.is-selected', cat: 'color' },
      { id: 'vss', label: 'Open tab edge', css: ['box-shadow'], part: '.plx-tabs__tab.is-selected', cat: 'shadow' },
      { id: 'vst', label: 'Open tab text color', css: ['color'], part: '.plx-tabs__tab.is-selected', cat: 'color' },
      { id: 'vsw', label: 'Open tab font weight', css: ['font-weight'], part: '.plx-tabs__tab.is-selected', cat: 'font-weight' }
    ];
    var vToken = function (id, state) {
      switch (id) {
        case 'vg': return TV('gap');
        case 'vw': return TV('list-width');
        case 'vrg': return TV('list-row-gap');
        case 'vh': return TV('tab-min-height');
        case 'vpx': return TV('tab-padding-inline');
        case 'vr': return TV('tab-radius');
        case 'vfs': return TV('tab-font-size');
        case 'vt': return state === 'hover' ? TV('tab-hover-text') : TV('tab-text');
        case 'vhb': return state === 'hover' ? TV('tab-hover-background') : null;
        case 'vsb': return TV('tab-selected-background');
        case 'vss': return TV('tab-selected-shadow');
        case 'vst': return TV('tab-selected-text');
        case 'vsw': return TV('tab-selected-font-weight');
        default: return null;
      }
    };
    var TABS = DS.labs && DS.labs.tabs;
    if (TABS) {
      DS.registerLab('vertical-tabs', Object.assign({}, TABS, {
        name: 'Vertical tabs', title: 'Plenix vertical tabs', store: 'plenix-vertical-tabs-lab-tokens', compPrefix: /^plx-comp-tabs-vertical-/,
        variants: [['vertical', 'Vertical']], defaults: { size: 'default', variant: 'vertical', state: 'default', content: 'text' },
        labels: { size: 'Size', variant: 'Orientation', state: 'State', content: 'Content' },
        props: VPROPS, token: function (id, size, variant, state) { return vToken(id, state); },
        reach: function () { return 'every vertical tab list'; }, every: 'every vertical tab list',
        parts: { vg: 'A', vw: 'A', vrg: 'A', vh: 'B', vpx: 'B', vr: 'B', vfs: 'B', vsb: 'B', vss: 'B', vst: 'B', vsw: 'B', vt: 'C', vhb: 'C' },
        anchors: { A: { part: '.plx-tabs__list', side: 'left' }, B: { part: '.plx-tabs__tab.is-selected', side: 'top' }, C: { part: '.plx-tabs__tab:not(.is-selected)', side: 'bottom' } },
        sections: [['Tab list', ['vg', 'vw', 'vrg']], ['Tabs', ['vh', 'vpx', 'vr', 'vfs', 'vt', 'vhb']], ['Open tab', ['vsb', 'vss', 'vst', 'vsw']]],
        matrixLabel: 'Vertical tab values by state', matrixColumnWidth: '--plx-ref-size-400px'
      }));
      DS.registerLab('tabs', Object.assign({}, TABS, {
        variants: TABS.variants.concat([['vertical', 'Vertical']]),
        props: TABS.props.concat(VPROPS.filter(function (p) { return /^(vg|vw|vrg|vr|vhb|vss)$/.test(p.id); })),
        token: function (id, size, variant, state, content) {
          if (variant !== 'vertical') return /^v/.test(id) ? null : TABS.token(id, size, variant, state, content);
          var map = { th: 'vh', tpx: 'vpx', tfs: 'vfs', sbg: 'vsb', sfg: 'vst', sfw: 'vsw', ofg: 'vt' };
          if (/^v/.test(id)) return vToken(id, state);
          return map[id] ? vToken(map[id], state) : null;
        },
        reach: function (full) { return /tabs-vertical-/.test(full) ? 'every vertical tab list' : TABS.reach(full); },
        parts: Object.assign({ vg: 'A', vw: 'A', vrg: 'A', vr: 'B', vhb: 'C', vss: 'B' }, TABS.parts),
        sections: TABS.sections.concat([['Vertical', ['vg', 'vw', 'vrg', 'vr', 'vhb', 'vss']]])
      }));
    }

    // ---- Mobile app bar (<AppHeader> at Narrow, back, title), and the application header registered again with them
    var AH = function (n) { return 'plx-comp-app-header-' + n; };
    var HEADER = DS.labs && DS.labs['application-header'];
    var item = function (name, label, cls, state) { return '<button type="button" tabindex="-1" class="plx-app-header__item' + (cls ? ' ' + cls : '') + (state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '') + '" aria-label="' + label + '">' + icon(name, 'plx-icon--size-lg') + '</button>'; };
    var barHtml = function (variant, state, extraCls) {
      if (variant === 'back') {
        return '<header data-plx-surface="accent" class="plx-app-header plx-app-header--accent' + ex(extraCls) + '"><div class="plx-app-header__start">' + item('arrow-left', 'Back', 'plx-app-header__back', state)
          + '<span class="plx-app-header__brand plx-app-header__title">Q3 launch plan</span></div><div class="plx-app-header__end"><div class="plx-app-header__utilities">' + item('more', 'More actions') + '</div></div></header>';
      }
      return '<header data-plx-surface="accent" class="plx-app-header plx-app-header--accent' + ex(extraCls) + '"><div class="plx-app-header__start"><span class="plx-app-header__brand"><span aria-hidden="true" class="plx-brand-mark"></span>'
        + '<span class="plx-app-header__name"><span class="plx-app-header__product">Plenix</span><span class="plx-app-header__app">Notes</span></span></span></div>'
        + '<div class="plx-app-header__end"><div class="plx-app-header__utilities">' + item('search', 'Search', null, state) + item('pencil', 'New note') + '</div></div></header>';
    };
    var barToken = function (id, variant, state) {
      if (variant === 'back' && (id === 'mark' || id === 'afs')) return null;
      return HEADER.token(id, 'default', 'accent', state);
    };
    if (HEADER) {
      DS.registerLab('mobile-app-bar', Object.assign({}, HEADER, {
        name: 'Mobile app bar', title: 'Plenix mobile app bar', store: 'plenix-mobile-app-bar-lab-tokens',
        variants: [['narrow', 'Narrow (mobile app bar)'], ['back', 'With back']], labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
        defaults: { size: 'default', variant: 'narrow', state: 'default', content: 'default' },
        token: function (id, size, variant, state) { return barToken(id, variant, state); },
        html: function (variant, size, state, extraCls) { return '<div class="ds-w07a-phone">' + barHtml(variant, state, extraCls) + '</div>'; },
        labelSelector: '.plx-app-header__brand', reach: function () { return 'every application header (the mobile app bar is the header at Narrow)'; },
        matrixLabel: 'Mobile app bar values by variant and state', matrixColumnWidth: '--plx-ref-size-400px'
      }));
      DS.registerLab('application-header', Object.assign({}, HEADER, {
        variants: HEADER.variants.concat([['narrow', 'Narrow (mobile app bar)'], ['back', 'With back']]),
        token: function (id, size, variant, state) { return variant === 'narrow' || variant === 'back' ? barToken(id, variant, state) : HEADER.token(id, size, variant, state); },
        html: function (variant, size, state, extraCls, ui) { return variant === 'narrow' || variant === 'back' ? '<div class="ds-w07a-phone">' + barHtml(variant, state, extraCls) + '</div>' : HEADER.html(variant, size, state, extraCls, ui); }
      }));
    }
  })();
}
