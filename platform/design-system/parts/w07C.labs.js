/* Plenix design system · library part w07C: the labs of wave 7, lane C. The chart frame and its marks (ChartFrame,
   system/charts.css), TimeZoneSelect, TreeSelect, TransferList, BottomSheetNav and the bottom navigation (NavPane's bar,
   overlay and screen), each drawn in place with the markup the component renders, so every size, variant and state shows
   with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var attr = function (on, a) { return on ? ' ' + a : ''; };
    var icon = function (name, filled) { return DS.icon(name, filled ? 'plx-icon--filled' : ''); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];

    // ---- Chart foundations (<ChartFrame> and the mark classes, system/charts.css): the figure, its caption and plot, and
    // one chart per scale drawn at a fixed size (ChartFrame measures its container and draws the same markup)
    var CH = function (n) { return 'plx-comp-chart-' + n; };
    var PLOT_H = { sm: 160, md: 240, lg: 320 };
    var chartSvg = function (variant, size) {
      var W = 360, Hh = PLOT_H[size] || 240, L = 40, T = 8, B = 24, w = W - L - 8, hh = Hh - T - B;
      var g = '<g transform="translate(' + L + ',' + T + ')">';
      var ticks = [0, 0.25, 0.5, 0.75, 1].map(function (t, i) { var y = Math.round(hh - t * hh); return '<line class="plx-chart__grid-line" x1="0" x2="' + w + '" y1="' + y + '" y2="' + y + '"></line><text class="plx-chart__tick-label plx-chart__tick-label--y" x="-8" y="' + y + '">' + (variant === 'log' ? ['1 kB', '', '1 MB', '', '1 GB'][i] : String(i * 80)) + '</text>'; }).join('');
      var axis = '<line class="plx-chart__axis-line" x1="0" x2="' + w + '" y1="' + hh + '" y2="' + hh + '"></line>';
      var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      var step = w / 6, band = step * 0.8;
      var xl = labels.map(function (l, i) { return '<text class="plx-chart__tick-label plx-chart__tick-label--x" x="' + Math.round(step * i + step / 2) + '" y="' + (hh + 8) + '">' + (variant === 'time' ? (i * 2 + 1) + ' Sep' : l) + '</text>'; }).join('');
      var vals = [0.38, 0.56, 0.47, 0.75, 0.97, 0.88];
      var marks;
      if (variant === 'band' || variant === 'log') {
        marks = vals.map(function (v, i) { var y = Math.round(hh - v * hh); return '<rect class="plx-chart__mark"' + (variant === 'log' ? ' data-plx-dataviz="categorical-3"' : '') + ' x="' + Math.round(step * i + (step - band) / 2) + '" y="' + y + '" width="' + Math.round(band) + '" height="' + (hh - y) + '"></rect>'; }).join('');
      } else {
        var pts = vals.map(function (v, i) { return [Math.round(step * i + step / 2), Math.round(hh - v * hh)]; });
        marks = '<path class="plx-chart__line" data-plx-dataviz="categorical-2" d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ',' + p[1]; }).join('') + '"></path>'
          + (variant === 'time' ? pts.map(function (p) { return '<circle class="plx-chart__point" data-plx-dataviz="categorical-2" cx="' + p[0] + '" cy="' + p[1] + '" r="4"></circle>'; }).join('') : '');
      }
      return '<svg class="plx-chart__svg" width="' + W + '" height="' + Hh + '" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Uploads per month">' + g + ticks + marks + axis + xl + '</g></svg>';
    };
    var TITLE = '.plx-chart__title', DESC = '.plx-chart__description', PLOT = '.plx-chart__plot', MARK = '.plx-chart__mark', LINE = '.plx-chart__line', POINT = '.plx-chart__point',
      AXIS = '.plx-chart__axis-line', GRID = '.plx-chart__grid-line', TICK = '.plx-chart__tick-label';
    DS.registerLab('chart-foundations', {
      name: 'Chart frame', title: 'Plenix chart frame', file: 'platform/system/charts.css', compPrefix: /^plx-comp-chart-/,
      store: 'plenix-chart-foundations-lab-tokens', sizes: [['sm', 'Small', '.plx-chart'], ['md', 'Medium (default)', '.plx-chart'], ['lg', 'Large', '.plx-chart']],
      variants: [['band', 'Band (categories)'], ['linear', 'Linear (amounts)'], ['time', 'Time (dates)'], ['log', 'Log (orders of magnitude)']],
      states: [['default', 'Default']], content: [['chart', 'A chart with its caption']],
      labels: { size: 'Size', variant: 'Scale', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'band', state: 'default', content: 'chart' },
      props: [
        { id: 'gap', label: 'Space between caption and plot', css: ['row-gap'], cat: 'space' },
        { id: 'cgap', label: 'Space under the title', css: ['row-gap'], part: '.plx-chart__caption', cat: 'space' },
        { id: 'tc', label: 'Title color', css: ['color'], part: TITLE, cat: 'color' },
        { id: 'tf', label: 'Title font', css: ['font-family'], part: TITLE, cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: TITLE, cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: TITLE, cat: 'font-weight' },
        { id: 'tl', label: 'Title line height', css: ['line-height'], part: TITLE, cat: 'line-height' },
        { id: 'dc', label: 'Description color', css: ['color'], part: DESC, cat: 'color' },
        { id: 'ds', label: 'Description size', css: ['font-size'], part: DESC, cat: 'font-size' },
        { id: 'dl', label: 'Description line height', css: ['line-height'], part: DESC, cat: 'line-height' },
        { id: 'ph', label: 'Plot height', css: ['block-size'], show: 'height', part: PLOT, cat: 'size' },
        { id: 'mc', label: 'Mark color (no data-viz step)', css: ['fill'], part: MARK, cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['stroke-width'], part: LINE, cat: 'border-width' },
        { id: 'po', label: 'Point ring color', css: ['stroke'], part: POINT, cat: 'color' },
        { id: 'pw', label: 'Point ring width', css: ['stroke-width'], part: POINT, cat: 'border-width' },
        { id: 'ac', label: 'Axis line color', css: ['stroke'], part: AXIS, cat: 'color' },
        { id: 'aw', label: 'Axis line width', css: ['stroke-width'], part: AXIS, cat: 'border-width' },
        { id: 'gc', label: 'Grid line color', css: ['stroke'], part: GRID, cat: 'color' },
        { id: 'gw', label: 'Grid line width', css: ['stroke-width'], part: GRID, cat: 'border-width' },
        { id: 'kc', label: 'Tick label color', css: ['fill'], part: TICK, cat: 'color' },
        { id: 'kf', label: 'Tick label font (data)', css: ['font-family'], part: TICK, cat: 'font' },
        { id: 'ks', label: 'Tick label size', css: ['font-size'], part: TICK, cat: 'font-size' }
      ],
      token: function (id, size, variant) {
        var line = variant === 'linear' || variant === 'time';
        var T = { gap: 'gap', cgap: 'caption-gap', tc: 'title-text', tf: 'title-font-family', ts: 'title-font-size', tw: 'title-font-weight', tl: 'title-line-height', dc: 'description-text', ds: 'description-font-size', dl: 'description-line-height',
          ac: 'axis-line-color', aw: 'axis-line-width', gc: 'grid-line-color', gw: 'grid-line-width', kc: 'tick-label-text', kf: 'tick-label-font-family', ks: 'tick-label-font-size' };
        if (T[id]) return CH(T[id]);
        if (id === 'ph') return CH('plot-height-' + size);
        if (id === 'mc') return variant === 'band' ? CH('mark-default-color') : null;
        if (id === 'lw') return line ? CH('line-width') : null;
        if (id === 'po') return variant === 'time' ? CH('point-outline') : null;
        if (id === 'pw') return variant === 'time' ? CH('point-outline-width') : null;
        return null;
      },
      reach: function (full) { return /plot-height/.test(full) ? 'every chart of that size' : 'every chart'; }, every: 'every chart',
      html: function (variant, size, state, extraCls) {
        return '<div class="ds-w07c-lab"><figure class="plx-chart plx-chart--' + size + ex(extraCls) + '"><figcaption class="plx-chart__caption"><span class="plx-chart__title">Uploads per month</span>'
          + '<span class="plx-chart__description">Uploads rose from 120 in January to 310 in May.</span></figcaption><div class="plx-chart__plot">' + chartSvg(variant, size) + '</div></figure></div>';
      },
      labelSelector: TITLE,
      parts: { gap: 'A', cgap: 'B', tc: 'B', tf: 'B', ts: 'B', tw: 'B', tl: 'B', dc: 'C', ds: 'C', dl: 'C', ph: 'D', mc: 'E', lw: 'E', po: 'E', pw: 'E', ac: 'F', aw: 'F', gc: 'G', gw: 'G', kc: 'H', kf: 'H', ks: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: TITLE, side: 'top' }, C: { part: DESC, side: 'right' }, D: { part: PLOT, side: 'left' }, E: { part: '.plx-chart__svg', side: 'right' }, F: { part: AXIS, side: 'bottom' }, G: { part: GRID, side: 'right' }, H: { part: TICK, side: 'left' } },
      sections: [['Frame', ['gap', 'ph']], ['Caption', ['cgap', 'tc', 'tf', 'ts', 'tw', 'tl', 'dc', 'ds', 'dl']], ['Marks', ['mc', 'lw', 'po', 'pw']], ['Axes', ['ac', 'aw', 'gc', 'gw', 'kc', 'kf', 'ks']]],
      matrixLabel: 'Chart frame values by scale and size', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Scales · ' + HEAD
    });

    // ---- Time-zone selector (<TimeZoneSelect>): the Combobox's field and list with the city and offset in each option, drawn
    // open in place (the list is absolute under the field: .ds-w07c-open gives it room), or closed with the offset in the field
    var TZ = function (n) { return 'plx-comp-time-zone-select-' + n; };
    var ZONES = [['Africa', 'Cairo', 'UTC+03:00'], ['Africa', 'Lagos', 'UTC+01:00'], ['Americas', 'Los Angeles', 'UTC−07:00'], ['Americas', 'New York', 'UTC−04:00'], ['Asia', 'Kolkata', 'UTC+05:30'], ['Asia', 'Tokyo', 'UTC+09:00']];
    var BY_OFFSET = ZONES.slice().sort(function (a, b) { var n = function (o) { return (o[2].indexOf('−') > 0 ? -1 : 1) * parseFloat(o[2].slice(4).replace(':', '.')); }; return n(a) - n(b); });
    DS.registerLab('time-zone-select', {
      name: 'Time-zone selector', title: 'Plenix time-zone selector', file: 'platform/components/TimeZoneSelect/time-zone-select.css', compPrefix: /^plx-comp-time-zone-select-/,
      store: 'plenix-time-zone-select-lab-tokens', sizes: [['default', 'Default', '.plx-time-zone-select']],
      variants: [['grouped', 'Grouped by region (default)'], ['offset', 'Sorted by offset'], ['plain', 'Without offsets']],
      states: [['default', 'Default']], content: [['open', 'List open'], ['search', 'Search'], ['closed', 'Closed (the chosen zone)']],
      labels: { size: 'Size', variant: 'List', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'grouped', state: 'default', content: 'open' },
      props: [
        { id: 'gap', label: 'Space between city and offset', css: ['column-gap'], part: '.plx-time-zone-select__option', cat: 'space' },
        { id: 'oc', label: 'Offset color', css: ['color'], part: '.plx-time-zone-select__offset', cat: 'color' },
        { id: 'of', label: 'Offset font (data)', css: ['font-family'], part: '.plx-time-zone-select__offset', cat: 'font' },
        { id: 'os', label: 'Offset size', css: ['font-size'], part: '.plx-time-zone-select__offset', cat: 'font-size' },
        { id: 'ow', label: 'Offset weight', css: ['font-weight'], part: '.plx-time-zone-select__offset', cat: 'font-weight' },
        { id: 'fc', label: 'Field offset color', css: ['color'], part: '.plx-time-zone-select__field-offset', cat: 'color' },
        { id: 'fm', label: 'Space after the field offset', css: ['margin-inline-end'], show: 'margin-right', part: '.plx-time-zone-select__field-offset', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var off = variant !== 'plain', closed = content === 'closed';
        if (!off) return null;
        if (closed) return { fc: TZ('offset-text'), fm: TZ('field-offset-margin-inline-end') }[id] || null;
        return { gap: TZ('option-gap'), oc: TZ('offset-text'), of: TZ('offset-font-family'), os: TZ('offset-font-size'), ow: TZ('offset-font-weight') }[id] || null;
      },
      reach: function () { return 'every time-zone selector'; }, every: 'every time-zone selector',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'open', off = variant !== 'plain', closed = content === 'closed';
        var list = variant === 'offset' ? BY_OFFSET : ZONES;
        if (content === 'search') list = ZONES.filter(function (z) { return /\+0[59]/.test(z[2]); });
        var rows = list.map(function (z, i) {
          var head = variant !== 'offset' && (i === 0 || list[i - 1][0] !== z[0]) ? '<li class="plx-combobox__group" role="presentation">' + z[0] + '</li>' : '';
          var on = z[1] === 'Tokyo';
          return head + '<li role="option" aria-selected="' + on + '" class="plx-combobox__option plx-time-zone-select__option' + (i === 0 ? ' is-active' : '') + (on ? ' is-selected' : '') + '">'
            + '<span class="plx-time-zone-select__city">' + z[1] + '</span>' + (off ? '<span class="plx-time-zone-select__offset">' + z[2] + '</span>' : '') + '</li>';
        }).join('');
        return '<div class="ds-w07c-open"><div class="plx-combobox plx-time-zone-select' + (closed ? '' : ' is-open') + ex(extraCls) + '"><div class="plx-combobox__field plx-input">'
          + '<input class="plx-combobox__input" role="combobox" tabindex="-1" aria-label="Time zone" aria-expanded="' + !closed + '" aria-autocomplete="list" value="' + (closed ? 'Tokyo' : content === 'search' ? '+9' : '') + '" placeholder="Tokyo">'
          + (closed && off ? '<span class="plx-time-zone-select__field-offset" aria-hidden="true">UTC+09:00</span>' : '') + '<span class="plx-combobox__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></div>'
          + (closed ? '' : '<ul class="plx-combobox__list plx-time-zone-select__list" role="listbox" aria-label="Time zone">' + rows + '</ul>') + '</div></div>';
      },
      labelSelector: '.plx-time-zone-select__city',
      parts: { gap: 'A', oc: 'B', of: 'B', os: 'B', ow: 'B', fc: 'C', fm: 'C' },
      anchors: { A: { part: '.plx-time-zone-select__option', side: 'left' }, B: { part: '.plx-time-zone-select__offset', side: 'right' }, C: { part: '.plx-time-zone-select__field-offset', side: 'top' } },
      sections: [['Option', ['gap', 'oc', 'of', 'os', 'ow']], ['Field', ['fc', 'fm']]],
      matrixLabel: 'Time-zone selector values by list and content', matrixColumnWidth: '--plx-ref-size-320px', statesHead: 'Lists · ' + HEAD
    });

    // ---- Tree select (<TreeSelect>): the trigger (a text field's look) and the panel drawn in place under it: the search
    // field and the tree in its scroll area, with the Tree's rows (and the checkbox marks of the multiple form)
    var TS = function (n) { return 'plx-comp-tree-select-' + n; };
    var TRIG = '.plx-tree-select__trigger', CHEV = '.plx-tree-select__chevron';
    var treeRow = function (label, level, kids, open, state, multi, active) {
      return '<li role="treeitem" aria-level="' + level + '"' + (kids ? ' aria-expanded="' + open + '"' : '') + (multi ? ' aria-checked="' + state + '"' : ' aria-selected="' + (state === 'true') + '"') + ' tabindex="' + (active ? 0 : -1) + '" class="plx-tree__item' + (!multi && state === 'true' ? ' is-selected' : '') + '">'
        + '<div class="plx-tree__row' + (!multi && state === 'true' ? ' is-selected' : '') + '" data-plx-level="' + Math.min(level, 12) + '"><span class="plx-tree__toggle' + (open ? ' is-open' : '') + (kids ? '' : ' is-leaf') + '" aria-hidden="true">' + (kids ? DS.icon(open ? 'square-minus' : 'square-plus', 'plx-icon--outline') : '') + '</span>'
        + (multi ? '<input type="checkbox" class="plx-check__input plx-tree-select__mark" tabindex="-1" aria-hidden="true"' + attr(state === 'true', 'checked') + '>' : '')
        + '<span class="plx-tree__icon">' + icon(open ? 'folder-open' : 'folder') + '</span><span class="plx-tree__label">' + label + '</span></div>';
    };
    DS.registerLab('tree-select', {
      name: 'Tree select', title: 'Plenix tree select', file: 'platform/components/TreeSelect/tree-select.css', compPrefix: /^plx-comp-tree-select-/,
      store: 'plenix-tree-select-lab-tokens', sizes: [['default', 'Default', '.plx-tree-select']],
      variants: [['single', 'One choice (default)'], ['multiple', 'Several, with checkboxes'], ['search', 'With search']],
      states: [['default', 'Default'], ['focus', 'Focus'], ['invalid', 'Invalid'], ['disabled', 'Disabled']],
      content: [['open', 'Open (the panel)'], ['closed', 'Closed (the chosen item)'], ['empty', 'Nothing chosen']],
      labels: { size: 'Size', variant: 'Choice', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'single', state: 'default', content: 'open' },
      props: [
        { id: 'mw', label: 'Widest the field grows', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'pe', label: 'Room for the chevron', css: ['padding-inline-end'], show: 'padding-right', part: TRIG, cat: 'space' },
        { id: 'ph', label: 'Placeholder color', css: ['color'], part: '.plx-tree-select__placeholder', cat: 'color' },
        { id: 'cc', label: 'Chevron color', css: ['color'], part: CHEV, cat: 'color' },
        { id: 'cs', label: 'Chevron size', css: ['inline-size'], show: 'width', part: CHEV, cat: 'icon' },
        { id: 'ci', label: 'Chevron distance from the end', css: ['inset-inline-end'], show: 'right', part: CHEV, cat: 'space' },
        { id: 'pg', label: 'Space under the search field', css: ['row-gap'], part: '.plx-tree-select__panel', cat: 'space' },
        { id: 'sm', label: 'Tree height before it scrolls', css: ['max-block-size'], show: 'max-height', part: '.plx-tree-select__scroll', cat: 'size' }
      ],
      token: function (id, size, variant, state, content) {
        var open = content === 'open';
        switch (id) {
          case 'mw': return TS('max-width');
          case 'pe': return TS('trigger-padding-inline-end');
          case 'ph': return content === 'empty' ? TS('placeholder-text') : null;
          case 'cc': return TS('chevron-color');
          case 'cs': return TS('chevron-size');
          case 'ci': return TS('chevron-inset-inline-end');
          case 'pg': return open && variant === 'search' ? TS('panel-gap') : null;
          case 'sm': return open ? TS('scroll-max-height') : null;
          default: return null;
        }
      },
      reach: function () { return 'every tree select'; }, every: 'every tree select',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'open', multi = variant === 'multiple', open = content === 'open', empty = content === 'empty';
        var value = empty ? '<span class="plx-tree-select__placeholder">Choose a folder</span>' : '<span class="plx-tree-select__value">' + (multi ? 'Crosses, Gold and 1 more' : 'Gold') + '</span>';
        var trig = '<span class="plx-popover-anchor"><button type="button" tabindex="-1" role="combobox" aria-label="Folder" aria-haspopup="dialog" aria-expanded="' + open + '"' + attr(state === 'invalid', 'aria-invalid="true"') + attr(state === 'disabled', 'disabled')
          + ' class="plx-input plx-tree-select__trigger' + (state === 'focus' ? ' is-focus-visible' : '') + (empty ? ' is-empty' : '') + '">' + value + '<span class="plx-tree-select__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></button></span>';
        var tree = '<ul role="tree" aria-label="Folder"' + attr(multi, 'aria-multiselectable="true"') + ' class="plx-tree plx-tree-select__tree">'
          + treeRow('Liturgical', 1, true, true, multi ? 'mixed' : 'false', multi, false) + '<ul role="group" class="plx-tree__group">' + treeRow('Crosses', 2, false, false, multi ? 'true' : 'false', multi, false) + '</li>'
          + treeRow('Borders', 2, true, true, multi ? 'mixed' : 'false', multi, false) + '<ul role="group" class="plx-tree__group">' + treeRow(variant === 'search' ? '<span class="plx-match">Go</span>ld' : 'Gold', 3, false, false, 'true', multi, true) + '</li>' + treeRow('Silver', 3, false, false, 'false', multi, false) + '</li></ul></li></ul></li>'
          + treeRow('Branding', 1, true, false, 'false', multi, false) + '</li></ul>';
        var search = variant === 'search' ? '<div class="plx-search" role="search"><span class="plx-search__icon" aria-hidden="true">' + icon('search') + '</span><input class="plx-input plx-search__input" type="search" tabindex="-1" aria-label="Search: Folder" placeholder="Search" value="go"></div>' : '';
        var panel = open ? '<div class="plx-tree-select__panel">' + search + '<div class="plx-tree-select__scroll">' + tree + '</div></div>' : '';
        return '<div class="ds-w07c-lab"><div class="plx-tree-select' + attr(multi, 'plx-tree-select--multiple') + (open ? ' is-open' : '') + (state === 'disabled' ? ' is-disabled' : '') + ex(extraCls) + '">' + trig + panel + '</div></div>';
      },
      labelSelector: TRIG,
      parts: { mw: 'A', pe: 'B', ph: 'B', cc: 'C', cs: 'C', ci: 'C', pg: 'D', sm: 'E' },
      anchors: { A: { part: null, side: 'top' }, B: { part: TRIG, side: 'left' }, C: { part: CHEV, side: 'right' }, D: { part: '.plx-tree-select__panel', side: 'left' }, E: { part: '.plx-tree-select__scroll', side: 'right' } },
      sections: [['Field', ['mw', 'pe', 'ph']], ['Chevron', ['cc', 'cs', 'ci']], ['Panel', ['pg', 'sm']]],
      matrixLabel: 'Tree select values by choice and state', matrixColumnWidth: '--plx-ref-size-360px', statesHead: 'Choices and states · ' + HEAD
    });

    // ---- Transfer list (<TransferList>): the two framed lists, the move buttons, a header, rows with their marks
    var TL = function (n) { return 'plx-comp-transfer-list-' + n; };
    var PANEL = '.plx-transfer-list__panel', HEADER = '.plx-transfer-list__header', OPT = '.plx-transfer-list__option', LIST = '.plx-transfer-list__list';
    var tlButton = function (label, iconName, end, dis) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-sm"' + attr(dis, 'disabled') + '>' + (iconName && !end ? '<span class="plx-button__icon">' + icon(iconName) + '</span>' : '')
        + '<span class="plx-button__label">' + label + '</span>' + (iconName && end ? '<span class="plx-button__icon">' + icon(iconName) + '</span>' : '') + '</button>';
    };
    var tlSide = function (id, title, rows, opts) {
      var nChecked = rows.filter(function (r) { return r[1]; }).length;
      var list = rows.map(function (r, i) {
        return '<div role="option" id="' + id + i + '" aria-selected="' + r[1] + '" class="plx-transfer-list__option' + (i === 0 ? ' is-active' : '') + (r[1] ? ' is-selected' : '') + (opts.hover === i ? ' is-hover' : '') + '">'
          + '<input type="checkbox" class="plx-check__input plx-transfer-list__mark" tabindex="-1" aria-hidden="true"' + attr(r[1], 'checked') + attr(opts.disabled, 'disabled') + '><span class="plx-transfer-list__label">' + r[0] + '</span><span class="plx-transfer-list__meta">' + r[2] + '</span></div>';
      }).join('');
      var tools = opts.ordered ? '<span class="plx-transfer-list__tools">' + ['chevron-up', 'chevron-down'].map(function (n, i) { return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only" aria-label="' + (i ? 'Move down' : 'Move up') + '"><span class="plx-button__icon">' + icon(n) + '</span></button>'; }).join('') + '</span>' : '';
      var search = opts.search ? '<div class="plx-transfer-list__search"><div class="plx-search plx-search--fill" role="search"><span class="plx-search__icon" aria-hidden="true">' + icon('search') + '</span><input class="plx-input plx-search__input" type="search" tabindex="-1" aria-label="Search ' + title + '" placeholder="Search ' + title + '"></div></div>' : '';
      return '<section class="plx-transfer-list__panel" aria-labelledby="' + id + 't"><div class="plx-transfer-list__header"><input type="checkbox" class="plx-check__input plx-transfer-list__all" tabindex="-1" aria-label="Check every item in ' + title + '"' + attr(opts.disabled, 'disabled') + '>'
        + '<span id="' + id + 't" class="plx-transfer-list__title">' + title + '</span><span class="plx-transfer-list__count" aria-label="' + nChecked + ' of ' + rows.length + ' checked">' + nChecked + '/' + rows.length + '</span>' + tools + '</div>' + search
        + '<div role="listbox" aria-multiselectable="true" aria-labelledby="' + id + 't" tabindex="-1" class="plx-transfer-list__list' + (opts.virtual ? ' plx-transfer-list__list--virtual' : '') + (opts.focus ? ' ds-focus' : '') + '">' + list + '</div></section>';
    };
    DS.registerLab('transfer-list', {
      name: 'Transfer list', title: 'Plenix transfer list', file: 'platform/components/TransferList/transfer-list.css', compPrefix: /^plx-comp-transfer-list-/,
      store: 'plenix-transfer-list-lab-tokens', sizes: [['md', 'Medium (default)', '.plx-transfer-list'], ['sm', 'Small', '.plx-transfer-list'], ['lg', 'Large', '.plx-transfer-list']],
      variants: [['basic', 'Basic (default)'], ['search', 'With search'], ['ordered', 'Ordered target'], ['virtualized', 'Virtualized']],
      states: [['default', 'Default'], ['hover', 'Hover (a row)'], ['focus', 'Focus (the list)'], ['disabled', 'Disabled']],
      content: [['checked', 'Some rows checked']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'basic', state: 'default', content: 'checked' },
      props: [
        { id: 'gap', label: 'Space between lists and buttons', css: ['column-gap'], part: '.plx-transfer-list__body', cat: 'space' },
        { id: 'mgap', label: 'Space between move buttons', css: ['row-gap'], part: '.plx-transfer-list__moves', cat: 'space' },
        { id: 'pbg', label: 'List surface', css: ['background-color'], part: PANEL, cat: 'color' },
        { id: 'pbc', label: 'List frame color', css: BORDERS, show: 'border-top-color', part: PANEL, cat: 'color' },
        { id: 'pbw', label: 'List frame width', css: WIDTHS, show: 'border-top-width', part: PANEL, cat: 'border-width' },
        { id: 'prad', label: 'List corners', css: CORNERS, show: 'border-top-left-radius', part: PANEL, cat: 'radius' },
        { id: 'hsh', label: 'Divider under the header', css: ['box-shadow'], part: HEADER, cat: 'shadow' },
        { id: 'hgap', label: 'Space inside the header', css: ['column-gap'], part: HEADER, cat: 'space' },
        { id: 'hh', label: 'Header height', css: ['min-block-size'], show: 'min-height', part: HEADER, cat: 'size' },
        { id: 'hpx', label: 'Header padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: HEADER, cat: 'space' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-transfer-list__title', cat: 'color' },
        { id: 'tf', label: 'Title font', css: ['font-family'], part: '.plx-transfer-list__title', cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: '.plx-transfer-list__title', cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-transfer-list__title', cat: 'font-weight' },
        { id: 'kc', label: 'Count color', css: ['color'], part: '.plx-transfer-list__count', cat: 'color' },
        { id: 'kf', label: 'Count and meta font (data)', css: ['font-family'], part: '.plx-transfer-list__count', cat: 'font' },
        { id: 'ks', label: 'Count and meta size', css: ['font-size'], part: '.plx-transfer-list__meta', cat: 'font-size' },
        { id: 'tg', label: 'Space between the order buttons', css: ['column-gap'], part: '.plx-transfer-list__tools', cat: 'space' },
        { id: 'sp', label: 'Search field inset', css: ['padding-block-start'], show: 'padding-top', part: '.plx-transfer-list__search', cat: 'space' },
        { id: 'lh', label: 'List height', css: ['block-size'], show: 'height', part: LIST, cat: 'size' },
        { id: 'lpy', label: 'List padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: LIST, cat: 'space' },
        { id: 'oh', label: 'Row height', css: ['block-size'], show: 'height', part: OPT, cat: 'control-height' },
        { id: 'og', label: 'Space inside a row', css: ['column-gap'], part: OPT, cat: 'space' },
        { id: 'opx', label: 'Row padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: OPT, cat: 'space' },
        { id: 'oc', label: 'Row text color', css: ['color'], part: OPT, cat: 'color' },
        { id: 'os', label: 'Row text size', css: ['font-size'], part: OPT, cat: 'font-size' },
        { id: 'ohv', label: 'Row hover background', css: ['background-color'], part: OPT + '.is-hover', cat: 'color' },
        { id: 'osel', label: 'Checked row background', css: ['background-color'], part: OPT + '.is-selected', cat: 'color' },
        { id: 'ofb', label: 'List focus frame color', css: BORDERS, show: 'border-top-color', part: PANEL, cat: 'color' }
      ],
      token: function (id, size, variant, state) {
        var dis = state === 'disabled';
        var T = { gap: 'gap', mgap: 'moves-gap', pbg: 'panel-background', pbw: 'panel-border-width', prad: 'panel-radius', hsh: 'header-shadow', hgap: 'header-gap', hh: 'header-min-height', hpx: 'header-padding-inline',
          tc: 'title-text', tf: 'title-font-family', ts: 'title-font-size', tw: 'title-font-weight', kc: 'meta-text', kf: 'meta-font-family', ks: 'meta-font-size', lpy: 'list-padding-block', oh: 'option-height', og: 'option-gap', opx: 'option-padding-inline', os: 'option-font-size' };
        if (T[id]) return TL(T[id]);
        switch (id) {
          case 'pbc': return state === 'focus' ? null : TL('panel-border-color');
          case 'ofb': return state === 'focus' ? TL('panel-focus-border-color') : null;
          case 'tg': return variant === 'ordered' ? TL('tools-gap') : null;
          case 'sp': return variant === 'search' ? TL('search-padding') : null;
          case 'lh': return TL('list-height-' + size);
          case 'oc': return dis ? TL('option-disabled-text') : TL('option-text');
          case 'ohv': return state === 'hover' ? TL('option-hover-background') : null;
          case 'osel': return state === 'focus' ? null : TL('option-selected-background');
          default: return null;
        }
      },
      reach: function (full) { return /list-height/.test(full) ? 'every transfer list of that size' : 'every transfer list'; }, every: 'every transfer list',
      html: function (variant, size, state, extraCls) {
        var o = { ordered: variant === 'ordered', search: variant === 'search' || variant === 'virtualized', virtual: variant === 'virtualized', disabled: state === 'disabled', focus: state === 'focus', hover: state === 'hover' ? 1 : -1 };
        var left = variant === 'virtualized' ? [['Person 1', true, 'ID 10001'], ['Person 2', false, 'ID 10002'], ['Person 4', false, 'ID 10004']] : [['Created', true, 'c05'], ['Owner', false, 'c06'], ['Category', false, 'c07'], ['Tags', true, 'c08']];
        var right = variant === 'virtualized' ? [['Person 3', false, 'ID 10003']] : [['Name', false, 'c01'], ['Type', true, 'c02'], ['Size', false, 'c03']];
        var leftOpts = Object.assign({}, o, { ordered: false, focus: o.focus });
        var rightOpts = Object.assign({}, o, { focus: false, hover: -1 });
        return '<div class="ds-w07c-lab ds-w07c-lab--wide"><div role="group" aria-label="Columns" class="plx-transfer-list plx-transfer-list--' + size + (o.disabled ? ' is-disabled' : '') + ex(extraCls) + '"><div class="plx-transfer-list__body">'
          + tlSide('ds-tl-s', 'Hidden columns', left, leftOpts)
          + '<div class="plx-transfer-list__moves" role="group" aria-label="Move items">' + tlButton('Add', 'chevron-right', true, o.disabled) + tlButton('Add all', null, false, o.disabled) + tlButton('Remove', 'chevron-left', false, o.disabled) + tlButton('Remove all', null, false, o.disabled) + '</div>'
          + tlSide('ds-tl-t', 'Shown columns', right, rightOpts) + '</div></div></div>';
      },
      labelSelector: '.plx-transfer-list__title',
      parts: { gap: 'A', mgap: 'B', pbg: 'C', pbc: 'C', pbw: 'C', prad: 'C', ofb: 'C', hsh: 'D', hgap: 'D', hh: 'D', hpx: 'D', tc: 'E', tf: 'E', ts: 'E', tw: 'E', kc: 'F', kf: 'F', ks: 'F', tg: 'F', sp: 'G', lh: 'H', lpy: 'H', oh: 'I', og: 'I', opx: 'I', oc: 'I', os: 'I', ohv: 'I', osel: 'I' },
      anchors: { A: { part: '.plx-transfer-list__body', side: 'top' }, B: { part: '.plx-transfer-list__moves', side: 'bottom' }, C: { part: PANEL, side: 'left' }, D: { part: HEADER, side: 'top' }, E: { part: '.plx-transfer-list__title', side: 'top' },
        F: { part: '.plx-transfer-list__count', side: 'top' }, G: { part: '.plx-transfer-list__search', side: 'left' }, H: { part: LIST, side: 'left' }, I: { part: OPT, side: 'right' } },
      sections: [['Layout', ['gap', 'mgap']], ['List frame', ['pbg', 'pbc', 'pbw', 'prad', 'ofb']], ['Header', ['hsh', 'hgap', 'hh', 'hpx', 'tc', 'tf', 'ts', 'tw', 'kc', 'kf', 'ks', 'tg']], ['Search', ['sp']], ['List', ['lh', 'lpy']], ['Rows', ['oh', 'og', 'opx', 'oc', 'os', 'ohv', 'osel']]],
      matrixLabel: 'Transfer list values by variant and state', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Bottom-sheet navigation (<BottomSheetNav>): the sheet's body: NavList rows (list) or the grid of RowButton tiles
    var BS = function (n) { return 'plx-comp-bottom-sheet-nav-' + n; };
    var TILE = '.plx-bottom-sheet-nav__tile', TICON = '.plx-bottom-sheet-nav__tile-icon', TLABEL = '.plx-bottom-sheet-nav__tile-label';
    var APPS = [['home', 'Home'], ['folder', 'Files'], ['doc-text', 'Notes'], ['checklist', 'Tasks'], ['calendar', 'Calendar'], ['message', 'Messages']];
    DS.registerLab('bottom-sheet-navigation', {
      name: 'Bottom-sheet navigation', title: 'Plenix bottom-sheet navigation', file: 'platform/patterns/BottomSheetNav/bottom-sheet-nav.css', compPrefix: /^plx-comp-bottom-sheet-nav-/,
      store: 'plenix-bottom-sheet-nav-lab-tokens', sizes: [['default', 'Default', '.plx-bottom-sheet-nav']],
      variants: [['list', 'List (default)'], ['grid', 'Grid']],
      states: [['default', 'Default'], ['hover', 'Hover (a place)'], ['focus', 'Focus (a place)']],
      content: [['current', 'With the current place']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'grid', state: 'default', content: 'current' },
      props: [
        { id: 'gg', label: 'Space between tiles', css: ['row-gap'], part: '.plx-bottom-sheet-nav__grid', cat: 'space' },
        { id: 'th', label: 'Tile height', css: ['min-block-size'], show: 'min-height', part: TILE, cat: 'size' },
        { id: 'trad', label: 'Tile corners', css: CORNERS, show: 'border-top-left-radius', part: TILE, cat: 'radius' },
        { id: 'tpy', label: 'Tile padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: TILE, cat: 'space' },
        { id: 'tpx', label: 'Tile padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: TILE, cat: 'space' },
        { id: 'tg', label: 'Space between icon and label', css: ['row-gap'], part: TILE, cat: 'space' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: TICON + ' .plx-icon', cat: 'icon' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: TICON, cat: 'color' },
        { id: 'icc', label: 'Current icon color', css: ['color'], part: '.is-selected ' + TICON, cat: 'color' },
        { id: 'lc', label: 'Label color', css: ['color'], part: TLABEL, cat: 'color' },
        { id: 'lf', label: 'Label font', css: ['font-family'], part: TLABEL, cat: 'font' },
        { id: 'ls', label: 'Label size', css: ['font-size'], part: TLABEL, cat: 'font-size' },
        { id: 'll', label: 'Label line height', css: ['line-height'], part: TLABEL, cat: 'line-height' }
      ],
      token: function (id, size, variant) {
        if (variant !== 'grid') return null;
        return { gg: BS('grid-gap'), th: BS('tile-min-height'), trad: BS('tile-radius'), tpy: BS('tile-padding-block'), tpx: BS('tile-padding-inline'), tg: BS('tile-gap'), is: BS('tile-icon-size'), ic: BS('tile-icon-color'),
          icc: BS('tile-current-icon-color'), lc: BS('tile-label-text'), lf: BS('tile-label-font-family'), ls: BS('tile-label-font-size'), ll: BS('tile-label-line-height') }[id] || null;
      },
      reach: function () { return 'every bottom-sheet navigation grid'; }, every: 'every bottom-sheet navigation grid',
      html: function (variant, size, state, extraCls) {
        var st = state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '';
        var body = variant === 'grid'
          ? '<nav aria-label="Applications" class="plx-bottom-sheet-nav__grid">' + APPS.map(function (a, i) {
            var on = i === 2;
            return '<button type="button" tabindex="-1" class="plx-row-button plx-row-button--hover plx-bottom-sheet-nav__tile' + (on ? ' is-selected' : '') + (i === 1 ? st : '') + '"' + attr(on, 'aria-current="page"') + '>'
              + '<span class="plx-bottom-sheet-nav__tile-icon" aria-hidden="true">' + icon(a[0], on) + '</span><span class="plx-bottom-sheet-nav__tile-label">' + a[1] + '</span></button>';
          }).join('') + '</nav>'
          : '<div class="plx-bottom-sheet-nav__list"><nav aria-label="Go to" class="plx-nav-list"><div class="plx-nav-list__group"><ul class="plx-nav-list__items">' + [['doc-text', 'All notes', 24], ['pin', 'Pinned', 3], ['share', 'Shared with me', 7]].map(function (r, i) {
            var on = i === 0;
            return '<li class="plx-nav-list__entry"><button type="button" tabindex="-1" class="plx-nav-list__item' + (on ? ' is-current' : '') + (i === 1 ? st : '') + '"' + attr(on, 'aria-current="page"') + '><span class="plx-nav-list__icon">' + icon(r[0], on) + '</span>'
              + '<span class="plx-nav-list__label"><span class="plx-nav-list__name">' + r[1] + '</span><span class="plx-nav-list__count">(' + r[2] + ')</span></span></button></li>';
          }).join('') + '</ul></div></nav></div>';
        return '<div class="ds-w07c-lab"><div class="plx-bottom-sheet-nav plx-bottom-sheet-nav--' + variant + ex(extraCls) + '">' + body + '</div></div>';
      },
      labelSelector: '.plx-bottom-sheet-nav__tile-label, .plx-nav-list__name',
      parts: { gg: 'A', th: 'B', trad: 'B', tpy: 'B', tpx: 'B', tg: 'B', is: 'C', ic: 'C', icc: 'C', lc: 'D', lf: 'D', ls: 'D', ll: 'D' },
      anchors: { A: { part: '.plx-bottom-sheet-nav__grid', side: 'left' }, B: { part: TILE, side: 'top' }, C: { part: TICON, side: 'right' }, D: { part: TLABEL, side: 'bottom' } },
      sections: [['Grid', ['gg']], ['Tile', ['th', 'trad', 'tpy', 'tpx', 'tg']], ['Icon', ['is', 'ic', 'icc']], ['Label', ['lc', 'lf', 'ls', 'll']]],
      matrixLabel: 'Bottom-sheet navigation values by layout and state', matrixColumnWidth: '--plx-ref-size-360px', statesHead: 'Layouts and states · ' + HEAD
    });

    // ---- Bottom navigation (NavPane at Narrow and Medium): the bar of destinations and Browse, the pane over the main
    // region (overlay at Medium) and the pane as a screen (Narrow), in a phone-sized frame
    var NB = function (n) { return 'plx-comp-nav-bar-' + n; }, NP = function (n) { return 'plx-comp-nav-pane-' + n; };
    var BAR = '.plx-nav-bar', ITEM = '.plx-nav-bar__item', LABEL = '.plx-nav-bar__label';
    var DESTS = [['home', 'Home'], ['folder', 'Files'], ['chart', 'Reports'], ['person', 'People']];
    DS.registerLab('bottom-navigation', {
      name: 'Bottom navigation', title: 'Plenix bottom navigation', file: 'platform/patterns/NavPane/nav-pane.css', compPrefix: /^plx-comp-nav-(bar|pane)-/,
      store: 'plenix-bottom-navigation-lab-tokens', sizes: [['default', 'Default', '.ds-w07c-phone']],
      variants: [['bar', 'Bottom bar (default)'], ['overlay', 'Overlay drawer'], ['screen', 'Screen']],
      states: [['default', 'Default'], ['hover', 'Hover (a destination)'], ['focus', 'Focus (a destination)'], ['disabled', 'Disabled (a destination)']],
      content: [['four', 'Four destinations and Browse']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'bar', state: 'default', content: 'four' },
      props: [
        { id: 'bbg', label: 'Bar background', css: ['background-color'], part: BAR, cat: 'color' },
        { id: 'bsh', label: 'Bar top line', css: ['box-shadow'], part: BAR, cat: 'shadow' },
        { id: 'bh', label: 'Bar height', css: ['min-block-size'], show: 'min-height', part: BAR, cat: 'size' },
        { id: 'ifg', label: 'Destination color', css: ['color'], part: ITEM + ':nth-child(2)', cat: 'color' },
        { id: 'icur', label: 'Current destination color', css: ['color'], part: ITEM + '.is-current', cat: 'color' },
        { id: 'iff', label: 'Destination font', css: ['font-family'], part: ITEM, cat: 'font' },
        { id: 'imw', label: 'Destination least width', css: ['min-inline-size'], show: 'min-width', part: ITEM, cat: 'size' },
        { id: 'it', label: 'Destination target height', css: ['min-block-size'], show: 'min-height', part: ITEM, cat: 'control-height' },
        { id: 'ipy', label: 'Destination padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: ITEM, cat: 'space' },
        { id: 'igap', label: 'Space between icon and label', css: ['row-gap'], part: ITEM, cat: 'space' },
        { id: 'isz', label: 'Icon size', css: ['inline-size'], show: 'width', part: ITEM + ' .plx-icon', cat: 'icon' },
        { id: 'lfs', label: 'Label size', css: ['font-size'], part: LABEL, cat: 'font-size' },
        { id: 'llh', label: 'Label line height', css: ['line-height'], part: LABEL, cat: 'line-height' },
        { id: 'foc', label: 'Focus outline color', css: ['outline-color'], part: ITEM + '.is-focus-visible', cat: 'color' },
        { id: 'fow', label: 'Focus outline width', css: ['outline-width'], part: ITEM + '.is-focus-visible', cat: 'border-width' },
        { id: 'pbg', label: 'Pane background', css: ['background-color'], part: '.plx-nav-pane', cat: 'color' },
        { id: 'osh', label: 'Overlay shadow', css: ['box-shadow'], part: '.plx-nav-pane--overlay', cat: 'shadow' },
        { id: 'omw', label: 'Overlay widest', css: ['max-inline-size'], show: 'max-width', part: '.plx-nav-pane--overlay', cat: 'size' }
      ],
      token: function (id, size, variant, state) {
        var bar = variant !== 'overlay';
        switch (id) {
          case 'bbg': return bar ? NB('background') : null;
          case 'bsh': return bar ? NB('shadow') : null;
          case 'bh': return bar ? NB('height') : null;
          case 'ifg': return bar ? (state === 'hover' ? NB('item-hover-text') : state === 'disabled' ? NB('item-disabled-text') : NB('item-text')) : null;
          case 'icur': return bar ? NB('item-current-text') : null;
          case 'iff': return bar ? NB('item-font-family') : null;
          case 'imw': return bar ? NB('item-min-width') : null;
          case 'it': return bar ? NB('item-target') : null;
          case 'ipy': return bar ? NB('item-padding-block') : null;
          case 'igap': return bar ? NB('label-gap') : null;
          case 'isz': return bar ? NB('icon-size') : null;
          case 'lfs': return bar ? NB('label-font-size') : null;
          case 'llh': return bar ? NB('label-line-height') : null;
          case 'foc': return bar && state === 'focus' ? NB('item-focus-outline-color') : null;
          case 'fow': return bar && state === 'focus' ? NB('item-focus-outline-width') : null;
          case 'pbg': return variant === 'bar' ? null : NP('background');
          case 'osh': return variant === 'overlay' ? NP('overlay-shadow') : null;
          case 'omw': return variant === 'overlay' ? NP('overlay-max-width') : null;
          default: return null;
        }
      },
      reach: function (full) { return /nav-pane/.test(full) ? 'every navigation pane' : 'every bottom navigation bar'; }, every: 'every bottom navigation bar',
      html: function (variant, size, state, extraCls) {
        var st = state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '';
        var screen = variant === 'screen';
        var bar = '<nav aria-label="Asset Manager" class="plx-nav-bar">' + DESTS.map(function (d, i) {
          var on = i === 0 && !screen;
          return '<button type="button" tabindex="-1" class="plx-nav-bar__item' + (on ? ' is-current' : '') + (i === 1 ? st : '') + '"' + attr(on, 'aria-current="page"') + attr(i === 1 && state === 'disabled', 'disabled') + '>' + icon(d[0], on) + '<span class="plx-nav-bar__label">' + d[1] + '</span></button>';
        }).join('') + '<button type="button" tabindex="-1" class="plx-nav-bar__item' + (screen ? ' is-current' : '') + '"' + attr(screen, 'aria-current="page"') + '>' + icon('menu-lines', screen) + '<span class="plx-nav-bar__label">Browse</span></button></nav>';
        var pane = '<nav aria-label="Asset Manager" class="plx-nav-pane plx-nav-pane--' + variant + '"><div class="plx-nav-pane__header"><span class="plx-nav-pane__title">Asset Manager</span></div><div class="plx-nav-pane__body">'
          + '<nav aria-label="Categories" class="plx-nav-list"><div class="plx-nav-list__group"><ul class="plx-nav-list__items">' + [['All Categories', 4546], ['Branding', 326], ['Crosses', 1284]].map(function (r) {
            return '<li class="plx-nav-list__entry"><button type="button" tabindex="-1" class="plx-nav-list__item"><span class="plx-nav-list__icon">' + icon('folder') + '</span><span class="plx-nav-list__label"><span class="plx-nav-list__name">' + r[0] + '</span><span class="plx-nav-list__count">(' + r[1] + ')</span></span></button></li>';
          }).join('') + '</ul></div></nav></div></nav>';
        var rail = variant === 'overlay' ? '<div role="toolbar" aria-orientation="vertical" aria-label="Asset Manager" class="plx-tool-rail plx-nav-pane-rail">' + [['panel-left-open', 'Expand sidebar'], ['home', 'Home'], ['folder', 'Files']].map(function (r) { return '<button type="button" tabindex="-1" class="plx-tool-rail__item" aria-label="' + r[1] + '">' + icon(r[0]) + '</button>'; }).join('') + '</div>' : '';
        return '<div class="ds-w07c-lab"><div class="ds-w07c-phone' + ex(extraCls) + '"><div class="ds-w07c-phone__main">' + rail + '<div class="ds-w07c-phone__content"><span class="plx-text plx-text--sm">The page’s main region</span></div>'
          + (variant === 'overlay' ? '<div class="plx-app-shell__scrim" aria-hidden="true"></div>' : '') + (variant === 'bar' ? '' : pane) + '</div>' + (variant === 'overlay' ? '' : bar) + '</div></div>';
      },
      labelSelector: LABEL,
      parts: { bbg: 'A', bsh: 'A', bh: 'A', ifg: 'B', icur: 'B', iff: 'B', imw: 'B', it: 'B', ipy: 'B', igap: 'B', isz: 'C', lfs: 'D', llh: 'D', foc: 'B', fow: 'B', pbg: 'E', osh: 'E', omw: 'E' },
      anchors: { A: { part: BAR, side: 'left' }, B: { part: ITEM, side: 'top' }, C: { part: ITEM + ' .plx-icon', side: 'right' }, D: { part: LABEL, side: 'bottom' }, E: { part: '.plx-nav-pane', side: 'right' } },
      sections: [['Bar', ['bbg', 'bsh', 'bh']], ['Destination', ['ifg', 'icur', 'iff', 'imw', 'it', 'ipy', 'igap', 'isz', 'foc', 'fow']], ['Label', ['lfs', 'llh']], ['Pane', ['pbg', 'osh', 'omw']]],
      matrixLabel: 'Bottom navigation values by form and state', matrixColumnWidth: '--plx-ref-size-360px', statesHead: 'Forms and states · ' + HEAD
    });
  })();
}
