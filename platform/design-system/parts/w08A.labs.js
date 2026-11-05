/* Plenix design system · library part w08A: the labs of wave 8, lane A. The chart parts (ChartLegend, ChartTooltip,
   DataLabel, Axis, GridLines, ReferenceLine and its threshold kind, ChartAnnotation), FeatureCard and UserCard, each
   drawn in place with the markup the component renders, so every size, variant and state shows with the one --plx-comp-*
   token behind each value. Chart parts are drawn in a fixed SVG plot (ChartFrame measures its container and draws the
   same markup). */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name) { return DS.icon(name); };
    var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
    var CH = function (n) { return 'plx-comp-chart-' + n; };
    var COLORS = ['categorical-1', 'categorical-2', 'categorical-3'];
    var NAMES = ['Web', 'iOS', 'Android'];
    // a fixed plot: 360 × 200, margins 40 / 8 / 24 / 8 (start / top / bottom / end), the inner area 312 × 168
    var W = 360, HH = 200, L = 40, T = 8, IW = 312, IH = 168;
    var svg = function (inner, cls) { return '<div class="ds-w08a-lab' + ex(cls) + '"><svg class="plx-chart__svg" width="' + W + '" height="' + HH + '" viewBox="0 0 ' + W + ' ' + HH + '" role="img" aria-label="Sign-ups by platform"><g transform="translate(' + L + ',' + T + ')">' + inner + '</g></svg></div>'; };
    var Y = [0, 80, 160, 240, 320], yAt = function (v) { return Math.round(IH - v / 320 * IH); };
    var STEP = IW / 6, xAt = function (i) { return Math.round(STEP * i + STEP / 2); };
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    var VALUES = [[120, 180, 150, 240, 310, 280], [80, 95, 130, 160, 190, 230], [60, 70, 90, 110, 150, 170]];
    var grid = function () { return '<g class="plx-chart-grid plx-chart-grid--horizontal">' + Y.map(function (v) { return '<line class="plx-chart__grid-line" x1="0" x2="' + IW + '" y1="' + yAt(v) + '" y2="' + yAt(v) + '"></line>'; }).join('') + '</g>'; };
    var lines = function (n) { return VALUES.slice(0, n || 3).map(function (vals, s) { return '<path class="plx-chart__line" data-plx-dataviz="' + COLORS[s] + '" d="' + vals.map(function (v, i) { return (i ? 'L' : 'M') + xAt(i) + ',' + yAt(v); }).join('') + '"></path>'; }).join(''); };
    var axes = function () {
      return '<g class="plx-chart-axis plx-chart-axis--left">' + Y.map(function (v) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="0" y="' + yAt(v) + '">' + v + '</text>'; }).join('') + '</g>'
        + '<g class="plx-chart-axis plx-chart-axis--bottom"><line class="plx-chart__axis-line" x1="0" x2="' + IW + '" y1="' + IH + '" y2="' + IH + '"></line>' + MONTHS.map(function (m, i) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="' + xAt(i) + '" y="' + IH + '">' + m + '</text>'; }).join('') + '</g>';
    };
    var columns = function () { return VALUES[0].map(function (v, i) { return '<rect class="plx-chart__mark" data-plx-dataviz="categorical-1" x="' + Math.round(STEP * i + STEP * 0.1) + '" y="' + yAt(v) + '" width="' + Math.round(STEP * 0.8) + '" height="' + (IH - yAt(v)) + '"></rect>'; }).join(''); };

    // ---- Chart legend (<ChartLegend>): under the plot, beside it (in the frame's body row), or interactive toggles
    var LG = function (n) { return CH('legend-' + n); };
    DS.registerLab('chart-legend', {
      name: 'Chart legend', title: 'Plenix chart legend', file: 'platform/charts/parts/chart-parts.css', compPrefix: /^plx-comp-chart-(legend|body)-/,
      store: 'plenix-chart-legend-lab-tokens', sizes: [['square', 'Square swatch', '.plx-chart-legend'], ['line', 'Line swatch', '.plx-chart-legend']],
      variants: [['horizontal', 'Under the plot (default)'], ['vertical', 'Beside the plot'], ['interactive', 'Interactive']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus']], content: [['names', 'Names'], ['values', 'With values'], ['hidden', 'A hidden series']],
      labels: { size: 'Swatch', variant: 'Placement', state: 'State', content: 'Content' },
      defaults: { size: 'square', variant: 'horizontal', state: 'default', content: 'names' },
      props: [
        { id: 'cg', label: 'Space between series', css: ['column-gap'], part: '.plx-chart-legend__list', cat: 'space' },
        { id: 'rg', label: 'Space between lines', css: ['row-gap'], part: '.plx-chart-legend__list', cat: 'space' },
        { id: 'mw', label: 'Widest beside the plot', css: ['max-inline-size'], show: 'max-width', host: 'parent', cat: 'size' },
        { id: 'ig', label: 'Space after the swatch', css: ['column-gap'], part: '.plx-chart-legend__item > *', cat: 'space' },
        { id: 'lc', label: 'Name color', css: ['color'], part: '.plx-chart-legend__item > *', cat: 'color' },
        { id: 'lf', label: 'Name font', css: ['font-family'], part: '.plx-chart-legend__item > *', cat: 'font' },
        { id: 'ls', label: 'Name size', css: ['font-size'], part: '.plx-chart-legend__item > *', cat: 'font-size' },
        { id: 'll', label: 'Name line height', css: ['line-height'], part: '.plx-chart-legend__item > *', cat: 'line-height' },
        { id: 'vc', label: 'Value color', css: ['color'], part: '.plx-chart-legend__value', cat: 'color' },
        { id: 'vf', label: 'Value font (data)', css: ['font-family'], part: '.plx-chart-legend__value', cat: 'font' },
        { id: 'ss', label: 'Swatch size', css: ['block-size'], show: 'height', part: '.plx-chart-legend__swatch', cat: 'icon' },
        { id: 'sr', label: 'Swatch corners', css: ['border-top-left-radius'], part: '.plx-chart-legend__swatch', cat: 'radius' },
        { id: 'sb', label: 'Swatch outline width', css: ['border-top-width'], part: '.plx-chart-legend__swatch', cat: 'border-width' },
        { id: 'lw', label: 'Line swatch length', css: ['inline-size'], show: 'width', part: '.plx-chart-legend__swatch', cat: 'icon' },
        { id: 'lh', label: 'Line swatch thickness', css: ['block-size'], show: 'height', part: '.plx-chart-legend__swatch', cat: 'border-width' },
        { id: 'tm', label: 'Toggle height (target)', css: ['min-block-size'], show: 'min-height', part: '.plx-chart-legend__toggle', cat: 'size' },
        { id: 'tp', label: 'Toggle padding', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-chart-legend__toggle', cat: 'space' },
        { id: 'tr', label: 'Toggle corners', css: ['border-top-left-radius'], part: '.plx-chart-legend__toggle', cat: 'radius' },
        { id: 'tb', label: 'Toggle border width', css: ['border-top-width'], part: '.plx-chart-legend__toggle', cat: 'border-width' },
        { id: 'th', label: 'Toggle hover fill', css: ['background-color'], part: '.plx-chart-legend__toggle', cat: 'color' },
        { id: 'tf', label: 'Toggle focus border', css: ['border-top-color'], part: '.plx-chart-legend__toggle', cat: 'color' },
        { id: 'oc', label: 'Hidden series name', css: ['color'], part: '.plx-chart-legend__toggle[aria-pressed="false"]', cat: 'color' },
        { id: 'ol', label: 'Hidden line swatch', css: ['background-color'], part: '.plx-chart-legend__toggle[aria-pressed="false"] .plx-chart-legend__swatch', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        var toggle = variant === 'interactive', square = size === 'square';
        var T = { cg: LG('column-gap'), rg: LG('row-gap'), ig: LG('item-gap'), lc: LG('label-text'), lf: LG('label-font-family'), ls: LG('label-font-size'), ll: LG('label-line-height') };
        if (id === 'sb') return square ? LG('swatch-border-width') : null;
        if (id === 'ol') return toggle && !square && content === 'hidden' ? LG('off-line-color') : null;
        if (T[id]) return id === 'lc' && toggle && state !== 'default' ? null : T[id];
        if (id === 'mw') return variant === 'vertical' ? LG('end-max-width') : null;
        if (id === 'vc' || id === 'vf') return content === 'values' ? LG(id === 'vc' ? 'value-text' : 'value-font-family') : null;
        if (id === 'ss' || id === 'sr') return square ? LG(id === 'ss' ? 'swatch-size' : 'swatch-radius') : null;
        if (id === 'lw' || id === 'lh') return square ? null : LG(id === 'lw' ? 'line-swatch-width' : 'line-swatch-height');
        if (!toggle) return null;
        if (id === 'tm') return LG('toggle-min-height'); if (id === 'tp') return LG('toggle-padding-inline'); if (id === 'tr') return LG('toggle-radius'); if (id === 'tb') return LG('toggle-border-width');
        if (id === 'th') return state === 'hover' ? LG('toggle-hover-background') : null;
        if (id === 'tf') return state === 'focus' ? LG('toggle-focus-border-color') : null;
        if (id === 'oc') return content === 'hidden' ? LG('off-text') : null;
        return null;
      },
      reach: function () { return 'every chart legend'; }, every: 'every chart legend',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'names', toggle = variant === 'interactive';
        var items = NAMES.map(function (n, i) {
          var off = toggle && content === 'hidden' && i === 1;
          var inside = '<span class="plx-chart-legend__swatch plx-chart-legend__swatch--' + size + '" data-plx-dataviz="' + COLORS[i] + '" aria-hidden="true"></span><span class="plx-chart-legend__label">' + n + '</span>'
            + (content === 'values' ? '<span class="plx-chart-legend__value">' + ['1,280', '885', '650'][i] + '</span>' : '');
          var st = i === 0 && state === 'hover' ? ' ds-hover' : i === 0 && state === 'focus' ? ' ds-focus' : '';
          return '<li class="plx-chart-legend__item">' + (toggle ? '<button type="button" tabindex="-1" class="plx-chart-legend__toggle' + st + '" aria-pressed="' + !off + '">' + inside + '</button>' : '<span class="plx-chart-legend__entry">' + inside + '</span>') + '</li>';
        }).join('');
        var legend = '<div class="plx-chart-legend plx-chart-legend--' + (variant === 'vertical' ? 'vertical' : 'horizontal') + (toggle ? ' plx-chart-legend--interactive' : '') + ex(extraCls) + '"><ul class="plx-chart-legend__list" aria-label="Legend">' + items + '</ul></div>';
        return variant === 'vertical' ? '<div class="ds-w08a-lab"><div class="plx-chart__body"><div class="plx-chart__plot ds-w08a-plot"></div><div class="plx-chart__legend plx-chart__legend--end">' + legend + '</div></div></div>'
          : '<div class="ds-w08a-lab"><div class="plx-chart__legend plx-chart__legend--bottom">' + legend + '</div></div>';
      },
      labelSelector: '.plx-chart-legend__label',
      parts: { cg: 'A', rg: 'A', mw: 'A', ig: 'B', lc: 'C', lf: 'C', ls: 'C', ll: 'C', vc: 'D', vf: 'D', ss: 'B', sr: 'B', sb: 'B', lw: 'B', lh: 'B', tm: 'E', tp: 'E', tr: 'E', tb: 'E', th: 'E', tf: 'E', oc: 'E', ol: 'E' },
      anchors: { A: { part: '.plx-chart-legend__list', side: 'left' }, B: { part: '.plx-chart-legend__swatch', side: 'top' }, C: { part: '.plx-chart-legend__label', side: 'bottom' }, D: { part: '.plx-chart-legend__value', side: 'right' }, E: { part: '.plx-chart-legend__toggle', side: 'top' } },
      sections: [['Layout', ['cg', 'rg', 'mw', 'ig']], ['Name and value', ['lc', 'lf', 'ls', 'll', 'vc', 'vf']], ['Swatch', ['ss', 'sr', 'sb', 'lw', 'lh']], ['Toggle', ['tm', 'tp', 'tr', 'tb', 'th', 'tf', 'oc', 'ol']]],
      matrixLabel: 'Chart legend values by placement and swatch', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Placements · ' + HEAD
    });

    // ---- Chart tooltip (<ChartTooltip>): single above a column, or shared at March with the crosshair
    var TT = function (n) { return CH('tooltip-' + n); };
    DS.registerLab('chart-tooltip', {
      name: 'Chart tooltip', title: 'Plenix chart tooltip', file: 'platform/charts/parts/chart-parts.css', compPrefix: /^plx-comp-chart-tooltip-/,
      store: 'plenix-chart-tooltip-lab-tokens', sizes: [['default', 'Default', '.plx-chart-tooltip-layer']],
      variants: [['single', 'Single'], ['shared', 'Shared']],
      states: [['default', 'Default']], content: [['text', 'A name as the title'], ['data', 'A date as the title']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'shared', state: 'default', content: 'data' },
      props: [
        { id: 'off', label: 'Distance from the point', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-chart-tooltip__place', cat: 'space' },
        { id: 'bg', label: 'Surface', css: ['background-color'], part: '.plx-chart-tooltip', cat: 'color' },
        { id: 'bc', label: 'Border color', css: ['border-top-color'], part: '.plx-chart-tooltip', cat: 'color' },
        { id: 'bw', label: 'Border width', css: ['border-top-width'], part: '.plx-chart-tooltip', cat: 'border-width' },
        { id: 'r', label: 'Corners', css: ['border-top-left-radius'], part: '.plx-chart-tooltip', cat: 'radius' },
        { id: 'sh', label: 'Shadow', css: ['box-shadow'], part: '.plx-chart-tooltip', cat: 'shadow' },
        { id: 'pb', label: 'Padding (top, bottom)', css: ['padding-block-start'], show: 'padding-top', part: '.plx-chart-tooltip', cat: 'space' },
        { id: 'pi', label: 'Padding (start, end)', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-chart-tooltip', cat: 'space' },
        { id: 'g', label: 'Space under the title', css: ['row-gap'], part: '.plx-chart-tooltip', cat: 'space' },
        { id: 'tx', label: 'Text color', css: ['color'], part: '.plx-chart-tooltip', cat: 'color' },
        { id: 'ff', label: 'Font', css: ['font-family'], part: '.plx-chart-tooltip', cat: 'font' },
        { id: 'fs', label: 'Size', css: ['font-size'], part: '.plx-chart-tooltip', cat: 'font-size' },
        { id: 'lh', label: 'Line height', css: ['line-height'], part: '.plx-chart-tooltip', cat: 'line-height' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-chart-tooltip__title', cat: 'color' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-chart-tooltip__title', cat: 'font-weight' },
        { id: 'tf', label: 'Title font (a date)', css: ['font-family'], part: '.plx-chart-tooltip__title', cat: 'font' },
        { id: 'lg', label: 'Space between values', css: ['row-gap'], part: '.plx-chart-tooltip__list', cat: 'space' },
        { id: 'ig', label: 'Space after the swatch', css: ['column-gap'], part: '.plx-chart-tooltip__item', cat: 'space' },
        { id: 'sz', label: 'Swatch size', css: ['block-size'], show: 'height', part: '.plx-chart-tooltip__swatch', cat: 'icon' },
        { id: 'sr', label: 'Swatch corners', css: ['border-top-left-radius'], part: '.plx-chart-tooltip__swatch', cat: 'radius' },
        { id: 'lc', label: 'Series name color', css: ['color'], part: '.plx-chart-tooltip__label', cat: 'color' },
        { id: 'vc', label: 'Value color', css: ['color'], part: '.plx-chart-tooltip__value', cat: 'color' },
        { id: 'vf', label: 'Value font (data)', css: ['font-family'], part: '.plx-chart-tooltip__value', cat: 'font' },
        { id: 'vm', label: 'Space before a value', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-chart-tooltip__value', cat: 'space' },
        { id: 'cc', label: 'Crosshair color', css: ['stroke'], part: '.plx-chart-tooltip__crosshair', cat: 'color' },
        { id: 'cw', label: 'Crosshair width', css: ['stroke-width'], part: '.plx-chart-tooltip__crosshair', cat: 'border-width' }
      ],
      token: function (id, size, variant, state, content) {
        var T = { off: 'offset', bg: 'background', bc: 'border-color', bw: 'border-width', r: 'radius', sh: 'shadow', pb: 'padding-block', pi: 'padding-inline', g: 'gap', tx: 'text', ff: 'font-family', fs: 'font-size', lh: 'line-height',
          tc: 'title-text', tw: 'title-font-weight', lg: 'list-gap', ig: 'item-gap', sz: 'swatch-size', sr: 'swatch-radius', lc: 'label-text', vc: 'value-text', vf: 'value-font-family', vm: 'value-margin-inline-start' };
        if (T[id]) return TT(T[id]);
        if (id === 'tf') return content === 'data' ? TT('value-font-family') : null;
        if (id === 'cc' || id === 'cw') return variant === 'shared' ? TT(id === 'cc' ? 'crosshair-color' : 'crosshair-width') : null;
        return null;
      },
      reach: function () { return 'every chart tooltip'; }, every: 'every chart tooltip',
      html: function (variant, size, state, extraCls, ui) {
        var data = ui && ui.content === 'data', shared = variant === 'shared', i = shared ? 2 : 3;
        var x = xAt(i), y = shared ? 0 : yAt(VALUES[0][i]);
        var rows = (shared ? [0, 1, 2] : [0]).map(function (s) { return '<li class="plx-chart-tooltip__item"><span class="plx-chart-tooltip__swatch" data-plx-dataviz="' + COLORS[s] + '"></span><span class="plx-chart-tooltip__label">' + NAMES[s] + '</span><span class="plx-chart-tooltip__value">' + VALUES[s][i] + '</span></li>'; }).join('');
        var title = data ? '<div class="plx-chart-tooltip__title plx-chart-tooltip__title--data">' + (shared ? 'Mar 2026' : 'Apr 2026') + '</div>' : '<div class="plx-chart-tooltip__title">' + (shared ? 'March' : 'April') + '</div>';
        var tip = '<g class="plx-chart-tooltip-layer plx-chart-tooltip-layer--' + variant + ex(extraCls) + '">' + (shared ? '<line class="plx-chart-tooltip__crosshair" x1="' + x + '" x2="' + x + '" y1="0" y2="' + IH + '"></line>' : '')
          + '<foreignObject class="plx-chart-tooltip__room" x="' + x + '" y="' + (shared ? 0 : y - 200) + '" width="240" height="200"><div class="plx-chart-tooltip__place plx-chart-tooltip__place--end plx-chart-tooltip__place--' + (shared ? 'below' : 'above') + '">'
          + '<div class="plx-chart-tooltip plx-chart-tooltip--' + variant + '">' + title + '<ul class="plx-chart-tooltip__list">' + rows + '</ul></div></div></foreignObject></g>';
        return svg(grid() + (shared ? lines() : columns()) + axes() + tip, 'ds-w08a-lab--tall');
      },
      labelSelector: '.plx-chart-tooltip__title',
      parts: { off: 'A', bg: 'B', bc: 'B', bw: 'B', r: 'B', sh: 'B', pb: 'B', pi: 'B', g: 'B', tx: 'B', ff: 'B', fs: 'B', lh: 'B', tc: 'C', tw: 'C', tf: 'C', lg: 'D', ig: 'D', sz: 'E', sr: 'E', lc: 'F', vc: 'G', vf: 'G', vm: 'G', cc: 'H', cw: 'H' },
      anchors: { A: { part: '.plx-chart-tooltip__place', side: 'left' }, B: { part: '.plx-chart-tooltip', side: 'top' }, C: { part: '.plx-chart-tooltip__title', side: 'right' }, D: { part: '.plx-chart-tooltip__list', side: 'left' }, E: { part: '.plx-chart-tooltip__swatch', side: 'left' }, F: { part: '.plx-chart-tooltip__label', side: 'bottom' }, G: { part: '.plx-chart-tooltip__value', side: 'right' }, H: { part: '.plx-chart-tooltip__crosshair', side: 'bottom' } },
      sections: [['Surface', ['off', 'bg', 'bc', 'bw', 'r', 'sh', 'pb', 'pi', 'g']], ['Text', ['tx', 'ff', 'fs', 'lh', 'tc', 'tw', 'tf']], ['Values', ['lg', 'ig', 'sz', 'sr', 'lc', 'vc', 'vf', 'vm']], ['Crosshair', ['cc', 'cw']]],
      matrixLabel: 'Chart tooltip values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Data label (<DataLabel>): above columns, after bars, centered with a halo on points
    var DL = function (n) { return CH('data-label-' + n); };
    DS.registerLab('chart-data-label', {
      name: 'Data label', title: 'Plenix data label', file: 'platform/charts/parts/chart-parts.css', compPrefix: /^plx-comp-chart-data-label-/,
      store: 'plenix-chart-data-label-lab-tokens', sizes: [['default', 'Default', '.plx-chart-data-label']],
      variants: [['top', 'Top (columns)'], ['end', 'End (bars)'], ['center', 'Center (points)']],
      states: [['default', 'Default']], content: [['value', 'A value']],
      labels: { size: 'Size', variant: 'Position', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'top', state: 'default', content: 'value' },
      props: [
        { id: 'c', label: 'Text color', css: ['fill'], cat: 'color' },
        { id: 'f', label: 'Font (data)', css: ['font-family'], cat: 'font' },
        { id: 's', label: 'Size', css: ['font-size'], cat: 'font-size' },
        { id: 'hc', label: 'Halo color', css: ['stroke'], cat: 'color' },
        { id: 'hw', label: 'Halo width', css: ['stroke-width'], cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        if (id === 'c') return DL('text'); if (id === 'f') return DL('font-family'); if (id === 's') return DL('font-size');
        if (id === 'hc' || id === 'hw') return variant === 'center' ? DL(id === 'hc' ? 'halo-color' : 'halo-width') : null;
        return null;
      },
      reach: function () { return 'every data label'; }, every: 'every data label',
      html: function (variant, size, state, extraCls) {
        var label = function (x, y, v, first) { return '<text class="plx-chart-data-label plx-chart-data-label--' + variant + (first ? ex(extraCls) : '') + '" x="' + x + '" y="' + y + '">' + v + '</text>'; };
        if (variant === 'end') {
          var band = IH / 6, bars = VALUES[0].map(function (v, i) { var w = Math.round(v / 320 * (IW - 40)); return '<rect class="plx-chart__mark" data-plx-dataviz="categorical-1" x="0" y="' + Math.round(band * i + band * 0.1) + '" width="' + w + '" height="' + Math.round(band * 0.8) + '"></rect>' + label(w, Math.round(band * i + band / 2), v, i === 0); }).join('');
          return svg(bars);
        }
        if (variant === 'center') return svg(grid() + lines(1) + axes() + [4, 5].map(function (i, k) { return label(xAt(i), yAt(VALUES[0][i]), VALUES[0][i], k === 0); }).join(''));
        return svg(grid() + columns() + axes() + VALUES[0].map(function (v, i) { return label(xAt(i), yAt(v), v, i === 0); }).join(''));
      },
      parts: { c: 'A', f: 'A', s: 'A', hc: 'B', hw: 'B' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' } },
      sections: [['Text', ['c', 'f', 's']], ['Halo', ['hc', 'hw']]],
      matrixLabel: 'Data label values by position', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Positions · ' + HEAD
    });

    // ---- Axis (<Axis>): one side of the plot, with or without its title
    DS.registerLab('chart-axis', {
      name: 'Axis', title: 'Plenix chart axis', file: 'platform/charts/parts/chart-parts.css', compPrefix: /^plx-comp-chart-(axis|tick)-/,
      store: 'plenix-chart-axis-lab-tokens', sizes: [['default', 'Default', '.plx-chart-axis']],
      variants: [['bottom', 'Bottom (default)'], ['left', 'Left'], ['right', 'Right'], ['top', 'Top']],
      states: [['default', 'Default']], content: [['ticks', 'Tick labels'], ['title', 'With an axis title']],
      labels: { size: 'Size', variant: 'Side', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'bottom', state: 'default', content: 'title' },
      props: [
        { id: 'ac', label: 'Axis line color', css: ['stroke'], part: '.plx-chart__axis-line', cat: 'color' },
        { id: 'aw', label: 'Axis line width', css: ['stroke-width'], part: '.plx-chart__axis-line', cat: 'border-width' },
        { id: 'kc', label: 'Tick label color', css: ['fill'], part: '.plx-chart-axis__tick', cat: 'color' },
        { id: 'kf', label: 'Tick label font (data)', css: ['font-family'], part: '.plx-chart-axis__tick', cat: 'font' },
        { id: 'ks', label: 'Tick label size', css: ['font-size'], part: '.plx-chart-axis__tick', cat: 'font-size' },
        { id: 'tc', label: 'Title color', css: ['fill'], part: '.plx-chart-axis__label', cat: 'color' },
        { id: 'tf', label: 'Title font', css: ['font-family'], part: '.plx-chart-axis__label', cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: '.plx-chart-axis__label', cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-chart-axis__label', cat: 'font-weight' }
      ],
      token: function (id, size, variant, state, content) {
        var across = variant === 'bottom' || variant === 'top';
        if (id === 'ac' || id === 'aw') return across ? CH(id === 'ac' ? 'axis-line-color' : 'axis-line-width') : null;
        if (id === 'kc') return CH('tick-label-text'); if (id === 'kf') return CH('tick-label-font-family'); if (id === 'ks') return CH('tick-label-font-size');
        if (content !== 'title') return null;
        return { tc: CH('axis-label-text'), tf: CH('axis-label-font-family'), ts: CH('axis-label-font-size'), tw: CH('axis-label-font-weight') }[id] || null;
      },
      reach: function () { return 'every chart axis'; }, every: 'every chart axis',
      html: function (variant, size, state, extraCls, ui) {
        var title = ui && ui.content === 'title', across = variant === 'bottom' || variant === 'top';
        var edge = variant === 'bottom' ? IH : variant === 'right' ? IW : 0;
        var vals = across ? MONTHS : Y.map(String);
        var ticks = vals.map(function (v, i) { var p = across ? xAt(i) : yAt(+v); return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="' + (across ? p : edge) + '" y="' + (across ? edge : p) + '">' + v + '</text>'; }).join('');
        var line = across ? '<line class="plx-chart__axis-line" x1="0" x2="' + IW + '" y1="' + edge + '" y2="' + edge + '"></line>' : '';
        var t = !title ? '' : variant === 'bottom' ? '<text class="plx-chart-axis__label" x="' + IW / 2 + '" y="' + (IH + 24) + '">Month (2026)</text>'
          : variant === 'top' ? '<text class="plx-chart-axis__label" x="' + IW / 2 + '" y="-8">Month (2026)</text>'
            : variant === 'left' ? '<text class="plx-chart-axis__label" transform="translate(-40,' + IH / 2 + ') rotate(-90)">Sign-ups</text>'
              : '<text class="plx-chart-axis__label" transform="translate(' + (IW + 8) + ',' + IH / 2 + ') rotate(90)">Sign-ups</text>';
        return svg(grid() + '<g class="plx-chart-axis plx-chart-axis--' + variant + ex(extraCls) + '">' + line + ticks + t + '</g>', 'ds-w08a-lab--axis');
      },
      labelSelector: '.plx-chart-axis__tick',
      parts: { ac: 'A', aw: 'A', kc: 'B', kf: 'B', ks: 'B', tc: 'C', tf: 'C', ts: 'C', tw: 'C' },
      anchors: { A: { part: '.plx-chart__axis-line', side: 'right' }, B: { part: '.plx-chart-axis__tick', side: 'bottom' }, C: { part: '.plx-chart-axis__label', side: 'left' } },
      sections: [['Axis line', ['ac', 'aw']], ['Tick labels', ['kc', 'kf', 'ks']], ['Title', ['tc', 'tf', 'ts', 'tw']]],
      matrixLabel: 'Axis values by side', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Sides · ' + HEAD
    });

    // ---- Grid line (<GridLines>): horizontal or vertical
    DS.registerLab('chart-grid-line', {
      name: 'Grid line', title: 'Plenix chart grid lines', file: 'platform/system/charts.css', compPrefix: /^plx-comp-chart-grid-/,
      store: 'plenix-chart-grid-line-lab-tokens', sizes: [['default', 'Default', '.plx-chart-grid']],
      variants: [['horizontal', 'Horizontal (default)'], ['vertical', 'Vertical']],
      states: [['default', 'Default']], content: [['lines', 'Grid lines']],
      labels: { size: 'Size', variant: 'Direction', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'horizontal', state: 'default', content: 'lines' },
      props: [
        { id: 'c', label: 'Line color', css: ['stroke'], part: '.plx-chart__grid-line', cat: 'color' },
        { id: 'w', label: 'Line width', css: ['stroke-width'], part: '.plx-chart__grid-line', cat: 'border-width' }
      ],
      token: function (id) { return id === 'c' ? CH('grid-line-color') : id === 'w' ? CH('grid-line-width') : null; },
      reach: function () { return 'every chart'; }, every: 'every chart',
      html: function (variant, size, state, extraCls) {
        var g = variant === 'vertical'
          ? '<g class="plx-chart-grid plx-chart-grid--vertical' + ex(extraCls) + '">' + [0, 80, 160, 240, 320].map(function (v) { var x = Math.round(v / 320 * IW); return '<line class="plx-chart__grid-line" x1="' + x + '" x2="' + x + '" y1="0" y2="' + IH + '"></line>'; }).join('') + '</g>'
          : '<g class="plx-chart-grid plx-chart-grid--horizontal' + ex(extraCls) + '">' + Y.map(function (v) { return '<line class="plx-chart__grid-line" x1="0" x2="' + IW + '" y1="' + yAt(v) + '" y2="' + yAt(v) + '"></line>'; }).join('') + '</g>';
        return svg(g + (variant === 'vertical' ? '' : columns()) + axes());
      },
      parts: { c: 'A', w: 'A' }, anchors: { A: { part: '.plx-chart__grid-line', side: 'right' } }, sections: [['Lines', ['c', 'w']]],
      matrixLabel: 'Grid line values by direction', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Directions · ' + HEAD
    });

    // ---- Reference line and Threshold (<ReferenceLine>): a dashed rule with its name and value
    var RF = function (n) { return CH('reference-' + n); };
    var refProps = function (threshold) {
      return [
        { id: 'lc', label: 'Line color', css: ['stroke'], part: '.plx-chart-reference__line', cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['stroke-width'], part: '.plx-chart-reference__line', cat: 'border-width' },
        { id: 'nc', label: 'Name color', css: ['fill'], part: '.plx-chart-reference__label', cat: 'color' },
        { id: 'nf', label: 'Name font', css: ['font-family'], part: '.plx-chart-reference__label', cat: 'font' },
        { id: 'ns', label: 'Label size', css: ['font-size'], part: '.plx-chart-reference__label', cat: 'font-size' },
        { id: 'nw', label: 'Name weight', css: ['font-weight'], part: '.plx-chart-reference__label', cat: 'font-weight' },
        { id: 'vc', label: 'Value color', css: ['fill'], part: '.plx-chart-reference__value', cat: 'color' },
        { id: 'vf', label: 'Value font (data)', css: ['font-family'], part: '.plx-chart-reference__value', cat: 'font' },
        { id: 'vw', label: 'Value weight', css: ['font-weight'], part: '.plx-chart-reference__value', cat: 'font-weight' },
        { id: 'hc', label: 'Label halo color', css: ['stroke'], part: '.plx-chart-reference__label', cat: 'color' },
        { id: 'hw', label: 'Label halo width', css: ['stroke-width'], part: '.plx-chart-reference__label', cat: 'border-width' }
      ].filter(function (p) { return !threshold || p.id !== 'lc'; });
    };
    var refToken = function (threshold) {
      return function (id) {
        var T = { nc: 'label-text', nf: 'label-font-family', ns: 'label-font-size', nw: 'label-font-weight', vc: 'value-text', vf: 'value-font-family', vw: 'value-font-weight', hc: 'label-halo-color', hw: 'label-halo-width' };
        if (T[id]) return RF(T[id]);
        if (id === 'lw') return threshold ? CH('threshold-line-width') : RF('line-width');
        if (id === 'lc') return threshold ? null : RF('line-color');
        return null;
      };
    };
    var refHtml = function (kind, axis, level, extraCls) {
      var color = kind === 'threshold' ? ' data-plx-dataviz="alert-' + level + '"' : '';
      var g;
      if (axis === 'x') {
        var x = xAt(2);
        g = '<line class="plx-chart-reference__line"' + color + ' x1="' + x + '" x2="' + x + '" y1="0" y2="' + IH + '"></line><text class="plx-chart-reference__label" x="' + x + '" y="0"><tspan class="plx-chart-reference__name">Release 3.2</tspan> <tspan class="plx-chart-reference__value">15 Mar</tspan></text>';
      } else {
        var v = kind === 'threshold' ? (level === 'critical' ? 280 : 240) : 213, y = yAt(v);
        g = '<line class="plx-chart-reference__line"' + color + ' x1="0" x2="' + IW + '" y1="' + y + '" y2="' + y + '"></line><text class="plx-chart-reference__label" x="' + IW + '" y="' + y + '"><tspan class="plx-chart-reference__name">' + (kind === 'threshold' ? (level === 'critical' ? 'Limit' : 'Warning') : 'Average') + '</tspan> <tspan class="plx-chart-reference__value">' + v + '</tspan></text>';
      }
      return svg(grid() + '<g class="plx-chart-reference plx-chart-reference--' + kind + ' plx-chart-reference--' + axis + ex(extraCls) + '">' + g + '</g>' + (axis === 'x' ? lines(1) : columns()) + axes());
    };
    var refSpec = function (threshold) {
      return {
        file: 'platform/charts/parts/chart-parts.css', compPrefix: threshold ? /^plx-comp-chart-(threshold|reference-(label|value))-/ : /^plx-comp-chart-reference-/,
        sizes: [['default', 'Default', '.plx-chart-reference']], states: [['default', 'Default']], content: [['label', 'Name and value']],
        props: refProps(threshold), token: refToken(threshold), labelSelector: '.plx-chart-reference__name',
        parts: { lc: 'A', lw: 'A', nc: 'B', nf: 'B', ns: 'B', nw: 'B', hc: 'B', hw: 'B', vc: 'C', vf: 'C', vw: 'C' },
        anchors: { A: { part: '.plx-chart-reference__line', side: 'left' }, B: { part: '.plx-chart-reference__name', side: 'top' }, C: { part: '.plx-chart-reference__value', side: 'right' } },
        sections: [['Line', threshold ? ['lw'] : ['lc', 'lw']], ['Label', ['nc', 'nf', 'ns', 'nw', 'hc', 'hw', 'vc', 'vf', 'vw']]], matrixColumnWidth: '--plx-ref-size-400px'
      };
    };
    DS.registerLab('chart-reference-line', Object.assign(refSpec(false), {
      name: 'Reference line', title: 'Plenix reference line', store: 'plenix-chart-reference-line-lab-tokens',
      variants: [['y', 'Horizontal (a value)'], ['x', 'Vertical (a date)']],
      labels: { size: 'Size', variant: 'Axis', state: 'State', content: 'Content' }, defaults: { size: 'default', variant: 'y', state: 'default', content: 'label' },
      reach: function () { return 'every reference line and threshold'; }, every: 'every reference line',
      html: function (variant, size, state, extraCls) { return refHtml('reference', variant, null, extraCls); },
      matrixLabel: 'Reference line values by axis', statesHead: 'Axes · ' + HEAD
    }));
    DS.registerLab('chart-threshold', Object.assign(refSpec(true), {
      name: 'Threshold', title: 'Plenix threshold', store: 'plenix-chart-threshold-lab-tokens',
      variants: [['warning', 'Warning (default)'], ['critical', 'Critical']],
      labels: { size: 'Size', variant: 'Level', state: 'State', content: 'Content' }, defaults: { size: 'default', variant: 'warning', state: 'default', content: 'label' },
      reach: function (full) { return /threshold/.test(full) ? 'every threshold' : 'every reference line and threshold'; }, every: 'every threshold',
      html: function (variant, size, state, extraCls) { return refHtml('threshold', 'y', variant, extraCls); },
      matrixLabel: 'Threshold values by level', statesHead: 'Levels · ' + HEAD
    }));

    // ---- Annotation (<ChartAnnotation>): a ring and a leader to the note, or a shaded range
    var AN = function (n) { return CH('annotation-' + n); };
    DS.registerLab('chart-annotation', {
      name: 'Chart annotation', title: 'Plenix chart annotation', file: 'platform/charts/parts/chart-parts.css', compPrefix: /^plx-comp-chart-annotation-/,
      store: 'plenix-chart-annotation-lab-tokens', sizes: [['default', 'Default', '.plx-chart-annotation']],
      variants: [['top', 'Point (above)'], ['bottom', 'Point (below)'], ['range', 'Range']],
      states: [['default', 'Default']], content: [['note', 'A note']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'top', state: 'default', content: 'note' },
      props: [
        { id: 'rc', label: 'Ring color', css: ['stroke'], part: '.plx-chart-annotation__ring', cat: 'color' },
        { id: 'rw', label: 'Ring width', css: ['stroke-width'], part: '.plx-chart-annotation__ring', cat: 'border-width' },
        { id: 'lc', label: 'Leader color', css: ['stroke'], part: '.plx-chart-annotation__leader', cat: 'color' },
        { id: 'lw', label: 'Leader width', css: ['stroke-width'], part: '.plx-chart-annotation__leader', cat: 'border-width' },
        { id: 'bf', label: 'Range shade', css: ['fill'], part: '.plx-chart-annotation__band', cat: 'color' },
        { id: 'nc', label: 'Note color', css: ['fill'], part: '.plx-chart-annotation__label', cat: 'color' },
        { id: 'nf', label: 'Note font', css: ['font-family'], part: '.plx-chart-annotation__label', cat: 'font' },
        { id: 'ns', label: 'Note size', css: ['font-size'], part: '.plx-chart-annotation__label', cat: 'font-size' },
        { id: 'nw', label: 'Note weight', css: ['font-weight'], part: '.plx-chart-annotation__label', cat: 'font-weight' },
        { id: 'hc', label: 'Note halo color', css: ['stroke'], part: '.plx-chart-annotation__label', cat: 'color' },
        { id: 'hw', label: 'Note halo width', css: ['stroke-width'], part: '.plx-chart-annotation__label', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var range = variant === 'range';
        var T = { nc: 'label-text', nf: 'label-font-family', ns: 'label-font-size', nw: 'label-font-weight' };
        if (T[id]) return AN(T[id]);
        if (id === 'bf') return range ? AN('band-background') : null;
        if (id === 'hc' || id === 'hw') return range ? null : AN(id === 'hc' ? 'label-halo-color' : 'label-halo-width');
        if (range) return null;
        return { rc: AN('ring-color'), rw: AN('ring-width'), lc: AN('leader-color'), lw: AN('leader-width') }[id] || null;
      },
      reach: function () { return 'every chart annotation'; }, every: 'every chart annotation',
      html: function (variant, size, state, extraCls) {
        var g;
        if (variant === 'range') {
          g = '<g class="plx-chart-annotation plx-chart-annotation--range' + ex(extraCls) + '"><rect class="plx-chart-annotation__band" x="' + Math.round(STEP * 2) + '" y="0" width="' + Math.round(STEP * 2) + '" height="' + IH + '"></rect><text class="plx-chart-annotation__label" x="' + Math.round(STEP * 2) + '" y="0">Spring sale</text></g>';
          return svg(grid() + g + lines() + axes());
        }
        var down = variant === 'bottom', i = down ? 4 : 3, x = xAt(i), y = yAt(VALUES[0][i]), end = down ? y + 24 : y - 24;
        g = '<g class="plx-chart-annotation plx-chart-annotation--point plx-chart-annotation--' + variant + ex(extraCls) + '"><line class="plx-chart-annotation__leader" x1="' + x + '" x2="' + x + '" y1="' + (down ? y + 6 : y - 6) + '" y2="' + end + '"></line>'
          + '<circle class="plx-chart-annotation__ring" cx="' + x + '" cy="' + y + '" r="6"></circle><text class="plx-chart-annotation__label" x="' + x + '" y="' + end + '">' + (down ? 'Launch' : 'Campaign') + '</text></g>';
        return svg(grid() + lines(1) + axes() + g);
      },
      labelSelector: '.plx-chart-annotation__label',
      parts: { rc: 'A', rw: 'A', lc: 'B', lw: 'B', bf: 'C', nc: 'D', nf: 'D', ns: 'D', nw: 'D', hc: 'D', hw: 'D' },
      anchors: { A: { part: '.plx-chart-annotation__ring', side: 'right' }, B: { part: '.plx-chart-annotation__leader', side: 'left' }, C: { part: '.plx-chart-annotation__band', side: 'bottom' }, D: { part: '.plx-chart-annotation__label', side: 'top' } },
      sections: [['Marker', ['rc', 'rw', 'lc', 'lw', 'bf']], ['Note', ['nc', 'nf', 'ns', 'nw', 'hc', 'hw']]],
      matrixLabel: 'Annotation values by kind', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Kinds · ' + HEAD
    });

    // ---- Feature card (<FeatureCard>): a Card with its media first; icon, image or horizontal
    var FC = function (n) { return 'plx-comp-feature-card-' + n; };
    DS.registerLab('feature-card', {
      name: 'Feature card', title: 'Plenix feature card', file: 'platform/patterns/FeatureCard/feature-card.css', compPrefix: /^plx-comp-feature-card-/,
      store: 'plenix-feature-card-lab-tokens', sizes: [['default', 'Default', '.plx-feature-card']],
      variants: [['icon', 'Icon (default)'], ['image', 'Image'], ['horizontal', 'Horizontal']],
      states: [['default', 'Default']], content: [['tile', 'An icon tile'], ['picture', 'A picture']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'icon', state: 'default', content: 'tile' },
      props: [
        { id: 'bb', label: 'Picture to the top edge', css: ['margin-block-start'], show: 'margin-top', part: '.plx-feature-card__media--image', cat: 'space' },
        { id: 'bi', label: 'Picture to the side edges', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-feature-card__media--image', cat: 'space' },
        { id: 'mr', label: 'Picture corners', css: ['border-top-left-radius'], part: '.plx-feature-card__media--image', cat: 'radius' },
        { id: 'hg', label: 'Space after the media', css: ['column-gap'], cat: 'space' },
        { id: 'hs', label: 'Square picture size', css: ['inline-size'], show: 'width', part: '.plx-feature-card__image', cat: 'size' }
      ],
      token: function (id, size, variant, state, content) {
        var pic = variant === 'image' || (variant === 'horizontal' && content === 'picture');
        if (variant === 'image') return { bb: FC('media-bleed-block'), bi: FC('media-bleed-inline'), mr: FC('media-radius') }[id] || null;
        if (variant === 'horizontal') return id === 'hg' ? FC('horizontal-gap') : id === 'hs' && pic ? FC('horizontal-image-size') : null;
        return null;
      },
      reach: function () { return 'every feature card'; }, every: 'every feature card',
      html: function (variant, size, state, extraCls, ui) {
        var pic = variant === 'image' || (variant === 'horizontal' && ui && ui.content === 'picture');
        var media = pic ? '<span class="plx-feature-card__media plx-feature-card__media--image"><span class="plx-image plx-image--cover plx-image--placeholder-color' + (variant === 'horizontal' ? ' plx-image--rounded plx-ratio-1-1' : ' plx-ratio-16-9') + ' is-loaded plx-feature-card__image"><img class="plx-image__img" src="' + ART('14') + '" alt=""></span></span>'
          : '<span class="plx-feature-card__media"><span class="plx-icon-tile plx-icon-tile--md plx-icon-tile--purple plx-feature-card__tile" aria-hidden="true">' + DS.icon('sparkle', 'plx-icon--size-md plx-icon-tile__icon') + '</span></span>';
        return '<div class="ds-w08a-lab ds-w08a-lab--card"><article data-plx-title-wrap="true" data-plx-layout="' + (variant === 'horizontal' ? 'media-start' : 'media-first') + '" class="plx-card plx-card--interactive plx-feature-card plx-feature-card--' + variant + ex(extraCls) + '"><div class="plx-card__header"><h3 class="plx-card__title"><a href="#feature" tabindex="-1" class="plx-card__opener">Smart tags</a></h3></div>'
          + '<div class="plx-card__meta">Tags your pictures as they upload.</div><div class="plx-card__body">' + media + '</div></article></div>';
      },
      labelSelector: '.plx-card__title',
      parts: { bb: 'A', bi: 'A', mr: 'A', hg: 'B', hs: 'C' },
      anchors: { A: { part: '.plx-feature-card__media', side: 'top' }, B: { part: null, side: 'left' }, C: { part: '.plx-feature-card__media', side: 'bottom' } },
      sections: [['Media', ['bb', 'bi', 'mr']], ['Horizontal', ['hg', 'hs']]],
      matrixLabel: 'Feature card values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- User card (<UserCard>): a Card with the person; default, compact, with actions, with cover
    var UC = function (n) { return 'plx-comp-user-card-' + n; };
    DS.registerLab('user-card', {
      name: 'User card', title: 'Plenix user card', file: 'platform/patterns/UserCard/user-card.css', compPrefix: /^plx-comp-user-card-/,
      store: 'plenix-user-card-lab-tokens', sizes: [['default', 'Default', '.plx-user-card']],
      variants: [['default', 'Default'], ['compact', 'Compact'], ['actions', 'With actions'], ['cover', 'With cover']],
      states: [['default', 'Default']], content: [['person', 'A person']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'default', state: 'default', content: 'person' },
      props: [
        { id: 'g', label: 'Space between parts', css: ['row-gap'], part: '.plx-card__body', cat: 'space' },
        { id: 'ig', label: 'Space under the avatar', css: ['row-gap'], part: '.plx-user-card__identity', cat: 'space' },
        { id: 'tg', label: 'Space between lines', css: ['row-gap'], part: '.plx-user-card__text', cat: 'space' },
        { id: 'nc', label: 'Name color', css: ['color'], part: '.plx-user-card__name', cat: 'color' },
        { id: 'nf', label: 'Name font', css: ['font-family'], part: '.plx-user-card__name', cat: 'font' },
        { id: 'ns', label: 'Name size', css: ['font-size'], part: '.plx-user-card__name', cat: 'font-size' },
        { id: 'nw', label: 'Name weight', css: ['font-weight'], part: '.plx-user-card__name', cat: 'font-weight' },
        { id: 'nl', label: 'Name line height', css: ['line-height'], part: '.plx-user-card__name', cat: 'line-height' },
        { id: 'sc', label: 'Line color', css: ['color'], part: '.plx-user-card__secondary', cat: 'color' },
        { id: 'ss', label: 'Line size', css: ['font-size'], part: '.plx-user-card__secondary', cat: 'font-size' },
        { id: 'sl', label: 'Line height', css: ['line-height'], part: '.plx-user-card__secondary', cat: 'line-height' },
        { id: 'rm', label: 'Space above the role', css: ['margin-block-start'], show: 'margin-top', part: '.plx-user-card__role', cat: 'space' },
        { id: 'ag', label: 'Space between actions', css: ['column-gap'], part: '.plx-user-card__actions', cat: 'space' },
        { id: 'cb', label: 'Cover to the top edge', css: ['margin-block-start'], show: 'margin-top', part: '.plx-user-card__cover', cat: 'space' },
        { id: 'ci', label: 'Cover to the side edges', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-user-card__cover', cat: 'space' },
        { id: 'cr', label: 'Cover corners', css: ['border-top-left-radius'], part: '.plx-user-card__cover', cat: 'radius' },
        { id: 'co', label: 'Avatar over the cover', css: ['margin-block-start'], show: 'margin-top', part: '.plx-user-card__identity', cat: 'space' },
        { id: 'rc', label: 'Avatar ring color', css: ['outline-color'], part: '.plx-user-card__avatar', cat: 'color' },
        { id: 'rw', label: 'Avatar ring width', css: ['outline-width'], part: '.plx-user-card__avatar', cat: 'border-width' },
        { id: 'kg', label: 'Space in the row', css: ['column-gap'], part: '.plx-user-card__identity', cat: 'space' },
        { id: 'ks', label: 'Name size (compact)', css: ['font-size'], part: '.plx-user-card__name', cat: 'font-size' }
      ],
      token: function (id, size, variant) {
        var compact = variant === 'compact', cover = variant === 'cover', acts = variant === 'actions' || variant === 'cover' || compact;
        var T = { g: 'gap', tg: 'text-gap', nc: 'name-text', nf: 'name-font-family', nw: 'name-font-weight', nl: 'name-line-height', sc: 'secondary-text', ss: 'secondary-font-size', sl: 'secondary-line-height' };
        if (T[id]) return id === 'tg' && compact ? null : UC(T[id]);
        if (id === 'ig') return compact ? null : UC('identity-gap');
        if (id === 'ns') return compact ? null : UC('name-font-size');
        if (id === 'rm') return compact ? null : UC('role-margin-block-start');
        if (id === 'ag') return acts ? UC('actions-gap') : null;
        if (cover) return { cb: UC('cover-bleed-block'), ci: UC('cover-bleed-inline'), cr: UC('cover-radius'), co: UC('cover-avatar-overlap'), rc: UC('cover-avatar-ring-color'), rw: UC('cover-avatar-ring-width') }[id] || null;
        if (compact) return { kg: UC('compact-gap'), ks: UC('compact-name-font-size') }[id] || null;
        return null;
      },
      reach: function () { return 'every user card'; }, every: 'every user card',
      html: function (variant, size, state, extraCls) {
        var compact = variant === 'compact', cover = variant === 'cover', acts = variant === 'actions' || cover;
        var btn = function (label, ic, ghost) { return '<button type="button" tabindex="-1" class="plx-button plx-button--' + (ghost ? 'ghost' : 'secondary') + '"><span class="plx-button__icon">' + icon(ic) + '</span><span class="plx-button__label">' + label + '</span></button>'; };
        var actions = '<div class="plx-user-card__actions">' + (compact ? btn('Message', 'message', true) : btn('Message', 'message') + btn('Call', 'phone', true)) + '</div>';
        var avatar = '<span class="plx-avatar plx-avatar--' + (compact ? '40' : '64') + ' plx-user-card__avatar" data-plx-avatar="" aria-hidden="true">MC</span>';
        var text = '<div class="plx-user-card__text"><h3 class="plx-user-card__name">Maya Chen<span class="plx-visually-hidden">, Online</span></h3><p class="plx-user-card__secondary">Senior designer · Brand team</p>'
          + (compact ? '' : '<span class="plx-user-card__role"><span class="plx-badge plx-badge--neutral plx-badge--sm">Owner</span></span>') + '</div>';
        var details = compact ? '' : '<ul class="plx-list plx-user-card__details"><li class="plx-list__item plx-list__item--neutral"><span class="plx-list__icon" aria-hidden="true">' + icon('mail') + '</span><span class="plx-list__text">maya.chen@example.org</span></li>'
          + '<li class="plx-list__item plx-list__item--neutral"><span class="plx-list__icon" aria-hidden="true">' + icon('phone') + '</span><span class="plx-list__text"><span class="plx-text plx-text--data">+1 415 555 0134</span></span></li></ul>';
        var coverHtml = cover ? '<span class="plx-user-card__cover"><span class="plx-image plx-image--cover plx-image--placeholder-color plx-ratio-21-9 is-loaded plx-user-card__cover-image"><img class="plx-image__img" src="' + ART('16') + '" alt=""></span></span>' : '';
        return '<div class="ds-w08a-lab ds-w08a-lab--card"><article data-plx-body-layout="stack" class="plx-card plx-user-card plx-user-card--' + (compact ? 'compact' : 'default') + (cover ? ' plx-user-card--cover' : '') + (acts || compact ? ' plx-user-card--actions' : '') + ex(extraCls) + '"><div class="plx-card__body">'
          + coverHtml + '<div class="plx-user-card__identity">' + avatar + text + (compact ? actions : '') + '</div>' + details + (acts ? actions : '') + '</div></article></div>';
      },
      labelSelector: '.plx-user-card__name',
      parts: { g: 'A', ig: 'B', tg: 'C', nc: 'C', nf: 'C', ns: 'C', nw: 'C', nl: 'C', sc: 'D', ss: 'D', sl: 'D', rm: 'E', ag: 'F', cb: 'G', ci: 'G', cr: 'G', co: 'B', rc: 'B', rw: 'B', kg: 'B', ks: 'C' },
      anchors: { A: { part: '.plx-card__body', side: 'left' }, B: { part: '.plx-user-card__avatar', side: 'left' }, C: { part: '.plx-user-card__name', side: 'right' }, D: { part: '.plx-user-card__secondary', side: 'right' }, E: { part: '.plx-user-card__role', side: 'right' }, F: { part: '.plx-user-card__actions', side: 'bottom' }, G: { part: '.plx-user-card__cover', side: 'top' } },
      sections: [['Layout', ['g', 'ig', 'tg', 'ag', 'kg']], ['Name and line', ['nc', 'nf', 'ns', 'nw', 'nl', 'ks', 'sc', 'ss', 'sl', 'rm']], ['Cover', ['cb', 'ci', 'cr', 'co', 'rc', 'rw']]],
      matrixLabel: 'User card values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });
  })();
}
