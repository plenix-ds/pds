/* Plenix design system · library part w09A: the labs of wave 9, lane A. The chart interaction and the charts LineChart
   (with the Step chart), AreaChart, Gauge, HeatMap, WaterfallChart, WordCloud, NetworkGraph and Diagram, each drawn in
   place with the markup the component renders in a fixed plot (the components measure their container and draw the same
   markup), so every size, variant and state shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var C = function (prefix) { return function (n) { return 'plx-comp-' + prefix + '-' + n; }; };
    // a fixed plot: 400 × 200, margins 40 / 8 / 24 / 8 (start / top / bottom / end), the inner area 352 × 168
    var W = 400, HH = 200, L = 40, T = 8, IW = 352, IH = 168;
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    var VALUES = [[120, 180, 150, 240, 310, 280], [80, 95, 130, 160, 190, 230], [60, 70, 90, 110, 150, 170]];
    var COLORS = ['categorical-1', 'categorical-2', 'categorical-3'];
    var STEP = IW / 6, xAt = function (i) { return Math.round(STEP * i + STEP / 2); }, yAt = function (v) { return Math.round(IH - v / 320 * IH); };
    var Y = [0, 80, 160, 240, 320];
    var grid = function () { return '<g class="plx-chart-grid plx-chart-grid--horizontal">' + Y.map(function (v) { return '<line class="plx-chart__grid-line" x1="0" x2="' + IW + '" y1="' + yAt(v) + '" y2="' + yAt(v) + '"></line>'; }).join('') + '</g>'; };
    var axes = function () {
      return '<g class="plx-chart-axis plx-chart-axis--left">' + Y.map(function (v) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="0" y="' + yAt(v) + '">' + v + '</text>'; }).join('') + '</g>'
        + '<g class="plx-chart-axis plx-chart-axis--bottom"><line class="plx-chart__axis-line" x1="0" x2="' + IW + '" y1="' + IH + '" y2="' + IH + '"></line>' + MONTHS.map(function (m, i) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="' + xAt(i) + '" y="' + IH + '">' + m + '</text>'; }).join('') + '</g>';
    };
    var pts = function (vals) { return vals.map(function (v, i) { return [xAt(i), yAt(v)]; }); };
    var stepped = function (p, before) { var o = []; p.forEach(function (q, i) { if (i) o.push(before ? [p[i - 1][0], q[1]] : [q[0], p[i - 1][1]]); o.push(q); }); return o; };
    var d = function (p) { return p.map(function (q, i) { return (i ? 'L' : 'M') + q[0] + ',' + q[1]; }).join(''); };
    // a ChartFrame figure: the caption, an (interactive) plot with its SVG, and the inside drawn by the lab
    var frame = function (block, extraCls, inside, o) {
      o = o || {};
      return '<div class="ds-w09a-lab' + (o.wide ? ' ds-w09a-lab--wide' : '') + '"><figure class="plx-chart plx-chart--md ' + block + ex(extraCls) + '"><figcaption class="plx-chart__caption"><span class="plx-chart__title">' + (o.title || 'Sign-ups by platform') + '</span></figcaption>'
        + (o.actions ? '<div class="plx-chart__actions">' + o.actions + '</div>' : '')
        + '<div class="plx-chart__plot' + (o.interactive === false ? '' : ' plx-chart__plot--interactive') + (o.dimming ? ' plx-chart__plot--dimming' : '') + (o.plotState ? ' ' + o.plotState : '') + '" tabindex="-1">'
        + '<svg class="plx-chart__svg" width="' + (o.w || W) + '" height="' + (o.h || HH) + '" viewBox="0 0 ' + (o.w || W) + ' ' + (o.h || HH) + '" role="img" aria-label="' + (o.title || 'Sign-ups by platform') + '"><g transform="translate(' + (o.l === undefined ? L : o.l) + ',' + (o.t === undefined ? T : o.t) + ')">' + inside + '</g></svg></div>'
        + (o.after || '') + '</figure></div>';
    };
    var tooltip = function (x, title, rows, shared, y) {
      return '<g class="plx-chart-tooltip-layer plx-chart-tooltip-layer--' + (shared ? 'shared' : 'single') + '">' + (shared ? '<line class="plx-chart-tooltip__crosshair" x1="' + x + '" x2="' + x + '" y1="0" y2="' + IH + '"></line>' : '')
        + '<foreignObject class="plx-chart-tooltip__room" x="' + (x > IW / 2 ? x - 240 : x) + '" y="' + (shared ? 0 : (y || 0) - 200) + '" width="240" height="200"><div class="plx-chart-tooltip__place plx-chart-tooltip__place--' + (x > IW / 2 ? 'start' : 'end') + ' plx-chart-tooltip__place--' + (shared ? 'below' : 'above') + '">'
        + '<div class="plx-chart-tooltip plx-chart-tooltip--' + (shared ? 'shared' : 'single') + '"><div class="plx-chart-tooltip__title">' + title + '</div><ul class="plx-chart-tooltip__list">'
        + rows.map(function (r) { return '<li class="plx-chart-tooltip__item">' + (r[2] ? '<span class="plx-chart-tooltip__swatch" data-plx-dataviz="' + r[2] + '"></span>' : '') + '<span class="plx-chart-tooltip__label">' + r[0] + '</span><span class="plx-chart-tooltip__value">' + r[1] + '</span></li>'; }).join('')
        + '</ul></div></div></foreignObject></g>';
    };

    // ---- Chart interaction (useChartInteraction, ChartFrame interaction): the focus border, the dot, the brush, dimming,
    // the selected mark and the actions row
    var CI = C('chart-interaction');
    DS.registerLab('chart-interaction', {
      name: 'Chart interaction', title: 'Plenix chart interaction', file: 'platform/charts/chart-interaction.css', compPrefix: /^plx-comp-chart-interaction-/,
      store: 'plenix-chart-interaction-lab-tokens', sizes: [['default', 'Default', '.plx-chart']],
      variants: [['crosshair', 'Crosshair and tooltip'], ['brush', 'Brush and zoom'], ['legend', 'Legend toggles'], ['select', 'Select a value']],
      states: [['default', 'Default'], ['focus', 'Focus']], content: [['chart', 'A line chart']],
      labels: { size: 'Size', variant: 'Behavior', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'crosshair', state: 'focus', content: 'chart' },
      props: [
        { id: 'fw', label: 'Plot border width', css: ['border-top-width'], part: '.plx-chart__plot', cat: 'border-width' },
        { id: 'fr', label: 'Plot border corners', css: ['border-top-left-radius'], part: '.plx-chart__plot', cat: 'radius' },
        { id: 'fc', label: 'Plot focus border', css: ['border-top-color'], part: '.plx-chart__plot', cat: 'color' },
        { id: 'ag', label: 'Space between the buttons above the plot', css: ['column-gap'], part: '.plx-chart__actions', cat: 'space' },
        { id: 'mr', label: 'Dot radius', css: ['r'], part: '.plx-chart-focus', cat: 'size' },
        { id: 'mo', label: 'Dot ring color', css: ['stroke'], part: '.plx-chart-focus', cat: 'color' },
        { id: 'mw', label: 'Dot ring width', css: ['stroke-width'], part: '.plx-chart-focus', cat: 'border-width' },
        { id: 'bb', label: 'Brush shade', css: ['fill'], part: '.plx-chart-brush', cat: 'color' },
        { id: 'bc', label: 'Brush edge color', css: ['stroke'], part: '.plx-chart-brush', cat: 'color' },
        { id: 'bw', label: 'Brush edge width', css: ['stroke-width'], part: '.plx-chart-brush', cat: 'border-width' },
        { id: 'do', label: 'Dimmed series opacity', css: ['opacity'], part: '.plx-chart-dim--off', cat: 'opacity' },
        { id: 'sc', label: 'Selected outline color', css: ['stroke'], part: '.plx-chart-selected', cat: 'color' },
        { id: 'sw', label: 'Selected outline width', css: ['stroke-width'], part: '.plx-chart-selected', cat: 'border-width' }
      ],
      token: function (id, size, variant, state) {
        if (id === 'fw') return CI('focus-border-width'); if (id === 'fr') return CI('focus-radius');
        if (id === 'fc') return state === 'focus' ? CI('focus-border-color') : null;
        if (id === 'ag') return variant === 'brush' ? CI('actions-gap') : null;
        if (id === 'mr' || id === 'mo' || id === 'mw') return variant === 'select' || variant === 'brush' ? null : CI({ mr: 'focus-mark-radius', mo: 'focus-mark-outline', mw: 'focus-mark-outline-width' }[id]);
        if (id === 'bb' || id === 'bc' || id === 'bw') return variant === 'brush' ? CI({ bb: 'brush-background', bc: 'brush-border-color', bw: 'brush-border-width' }[id]) : null;
        if (id === 'do' || id === 'sc' || id === 'sw') return variant === 'select' ? CI({ do: 'dim-opacity', sc: 'selected-outline', sw: 'selected-outline-width' }[id]) : null;
        return null;
      },
      reach: function () { return 'every interactive chart'; }, every: 'every interactive chart',
      html: function (variant, size, state, extraCls) {
        var st = state === 'focus' ? 'ds-focus' : '';
        var lineSvg = function (n) { return VALUES.slice(0, n).map(function (vals, s) { return '<path class="plx-chart__line" data-plx-dataviz="' + COLORS[s] + '" d="' + d(pts(vals)) + '"></path>'; }).join(''); };
        if (variant === 'select') {
          var bars = VALUES[0].map(function (v, i) { return '<rect class="plx-chart__mark plx-chart-dim' + (i === 3 ? ' plx-chart-selected' : ' plx-chart-dim--off') + '" data-plx-dataviz="categorical-1" x="' + Math.round(STEP * i + STEP * 0.1) + '" y="' + yAt(v) + '" width="' + Math.round(STEP * 0.8) + '" height="' + (IH - yAt(v)) + '"></rect>'; }).join('');
          return frame('', extraCls, grid() + bars + axes() + tooltip(xAt(3), 'April', [['Web', '240', 'categorical-1']], false, yAt(240)), { dimming: true, plotState: st, title: 'Web sign-ups per month' });
        }
        var at = variant === 'brush' ? 4 : 2;
        var dots = VALUES.map(function (vals, s) { return '<circle class="plx-chart-focus" data-plx-dataviz="' + COLORS[s] + '" cx="' + xAt(at) + '" cy="' + yAt(vals[at]) + '"></circle>'; }).join('');
        var brush = variant === 'brush' ? '<rect class="plx-chart-brush" x="' + xAt(2) + '" y="0" width="' + (xAt(4) - xAt(2)) + '" height="' + IH + '"></rect>' : '';
        var legend = variant === 'legend' ? '<div class="plx-chart__legend plx-chart__legend--bottom"><div class="plx-chart-legend plx-chart-legend--horizontal plx-chart-legend--interactive"><ul class="plx-chart-legend__list" aria-label="Legend">'
          + ['Web', 'iOS', 'Android'].map(function (n, i) { return '<li class="plx-chart-legend__item"><button type="button" tabindex="-1" class="plx-chart-legend__toggle" aria-pressed="' + (i !== 2) + '"><span class="plx-chart-legend__swatch plx-chart-legend__swatch--line" data-plx-dataviz="' + COLORS[i] + '" aria-hidden="true"></span><span class="plx-chart-legend__label">' + n + '</span></button></li>'; }).join('') + '</ul></div></div>' : '';
        var n = variant === 'legend' ? 2 : 3;
        return frame('plx-line-chart', extraCls, grid() + brush + lineSvg(n) + axes() + (variant === 'brush' ? '' : dots.split('</circle>').slice(0, n).join('</circle>') + '</circle>' + tooltip(xAt(at), MONTHS[at], VALUES.slice(0, n).map(function (v, s) { return [['Web', 'iOS', 'Android'][s], v[at], COLORS[s]]; }), true)),
          { plotState: st, after: legend, actions: variant === 'brush' ? '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-sm"><span class="plx-button__label">Reset zoom</span></button><button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-sm"><span class="plx-button__label">Fit</span></button>' : '' });
      },
      labelSelector: '.plx-chart__title',
      parts: { fw: 'A', fr: 'A', fc: 'A', ag: 'B', mr: 'C', mo: 'C', mw: 'C', bb: 'D', bc: 'D', bw: 'D', do: 'E', sc: 'F', sw: 'F' },
      anchors: { A: { part: '.plx-chart__plot', side: 'left' }, B: { part: '.plx-chart__actions', side: 'top' }, C: { part: '.plx-chart-focus', side: 'right' }, D: { part: '.plx-chart-brush', side: 'bottom' }, E: { part: '.plx-chart-dim--off', side: 'top' }, F: { part: '.plx-chart-selected', side: 'right' } },
      sections: [['Focus', ['fw', 'fr', 'fc']], ['Value', ['mr', 'mo', 'mw', 'sc', 'sw', 'do']], ['Zoom', ['bb', 'bc', 'bw', 'ag']]],
      matrixLabel: 'Chart interaction values by behavior', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Behaviors · ' + HEAD
    });

    // ---- Line chart (<LineChart>) and Step chart (curve="step"): lines, points and the frame's line tokens
    var LC = C('line-chart');
    var lineSpec = {
      name: 'Line chart', title: 'Plenix line chart', file: 'platform/charts/line-chart.css', compPrefix: /^plx-comp-(line-chart-|chart-line-width|chart-point-)/,
      store: 'plenix-line-chart-lab-tokens', sizes: [['default', 'Default', '.plx-line-chart']],
      variants: [['line', 'Line'], ['multi', 'Multiple series'], ['points', 'With points'], ['step', 'Step after (default)'], ['step-before', 'Step before']],
      states: [['default', 'Default']], content: [['values', 'Values']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'multi', state: 'default', content: 'values' },
      props: [
        { id: 'lw', label: 'Line width', css: ['stroke-width'], part: '.plx-chart__line', cat: 'border-width' },
        { id: 'pr', label: 'Point radius', css: ['r'], part: '.plx-line-chart__point', cat: 'size' },
        { id: 'po', label: 'Point ring color', css: ['stroke'], part: '.plx-line-chart__point', cat: 'color' },
        { id: 'pw', label: 'Point ring width', css: ['stroke-width'], part: '.plx-line-chart__point', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        if (id === 'lw') return 'plx-comp-chart-line-width';
        var pointsShown = variant === 'points' || variant === 'step' || variant === 'step-before';
        if (id === 'pr') return pointsShown ? LC('point-radius') : null;
        if (id === 'po') return pointsShown ? 'plx-comp-chart-point-outline' : null;
        if (id === 'pw') return pointsShown ? 'plx-comp-chart-point-outline-width' : null;
        return null;
      },
      reach: function (full) { return /point-radius/.test(full) ? 'every line chart with points' : 'every line chart'; }, every: 'every line chart',
      html: function (variant, size, state, extraCls) {
        var n = variant === 'multi' ? 3 : 1, step = variant === 'step' || variant === 'step-before', before = variant === 'step-before';
        var shapes = VALUES.slice(0, n).map(function (vals, s) { var p = pts(vals); return '<path class="plx-chart__line" data-plx-dataviz="' + COLORS[s] + '" d="' + d(step ? stepped(p, before) : p) + '"></path>'; }).join('');
        var dots = variant === 'points' || step ? pts(VALUES[0]).map(function (q) { return '<circle class="plx-chart__point plx-line-chart__point" data-plx-dataviz="categorical-1" cx="' + q[0] + '" cy="' + q[1] + '"></circle>'; }).join('') : '';
        return frame('plx-line-chart', extraCls, grid() + '<g class="plx-line-chart__series">' + shapes + dots + '</g>' + axes(), { title: n > 1 ? 'Sign-ups by platform' : step ? 'Price per seat' : 'Web sign-ups per month' });
      },
      labelSelector: '.plx-chart__title',
      parts: { lw: 'A', pr: 'B', po: 'B', pw: 'B' },
      anchors: { A: { part: '.plx-chart__line', side: 'top' }, B: { part: '.plx-line-chart__point', side: 'right' } },
      sections: [['Line', ['lw']], ['Points', ['pr', 'po', 'pw']]],
      matrixLabel: 'Line chart values by variant', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Variants · ' + HEAD
    };
    DS.registerLab('line-chart', lineSpec);
    DS.registerLab('step-chart', Object.assign({}, lineSpec, { name: 'Step chart', title: 'Plenix step chart', store: 'plenix-step-chart-lab-tokens',
      variants: [['step', 'Step after (default)'], ['step-before', 'Step before']], defaults: { size: 'default', variant: 'step', state: 'default', content: 'values' },
      matrixLabel: 'Step chart values by variant' }));

    // ---- Area chart (<AreaChart>): the fill of an area, see-through or stacked
    var AC = C('area-chart');
    DS.registerLab('area-chart', {
      name: 'Area chart', title: 'Plenix area chart', file: 'platform/charts/line-chart.css', compPrefix: /^plx-comp-area-chart-/,
      store: 'plenix-area-chart-lab-tokens', sizes: [['default', 'Default', '.plx-area-chart']],
      variants: [['area', 'Area'], ['stacked', 'Stacked'], ['percent', 'Percent']],
      states: [['default', 'Default']], content: [['values', 'Values']],
      labels: { size: 'Size', variant: 'Stack', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'stacked', state: 'default', content: 'values' },
      props: [{ id: 'fo', label: 'Fill opacity', css: ['fill-opacity'], part: '.plx-area-chart__area', cat: 'opacity' }],
      token: function (id, size, variant) { return id === 'fo' ? AC(variant === 'area' ? 'fill-opacity' : 'stacked-fill-opacity') : null; },
      reach: function (full) { return /stacked/.test(full) ? 'every stacked or percent area chart' : 'every area chart that is not stacked'; }, every: 'every area chart',
      html: function (variant, size, state, extraCls) {
        var n = variant === 'area' ? 2 : 3, base = [0, 0, 0, 0, 0, 0];
        var shapes = VALUES.slice(0, n).map(function (vals, s) {
          var tops = vals.map(function (v, i) {
            if (variant === 'area') return v;
            var total = VALUES[0][i] + VALUES[1][i] + VALUES[2][i], t = base[i] + v;
            return variant === 'percent' ? t / total * 320 : t / 2;
          });
          var bottoms = variant === 'area' ? [0, 0, 0, 0, 0, 0] : base.map(function (b, i) { var total = VALUES[0][i] + VALUES[1][i] + VALUES[2][i]; return variant === 'percent' ? b / total * 320 : b / 2; });
          if (variant !== 'area') vals.forEach(function (v, i) { base[i] += v; });
          var top = pts(tops), bottom = pts(bottoms).reverse();
          return '<path class="plx-chart__mark plx-area-chart__area" data-plx-dataviz="' + COLORS[s] + '" d="' + d(top.concat(bottom)) + 'Z"></path><path class="plx-chart__line" data-plx-dataviz="' + COLORS[s] + '" d="' + d(top) + '"></path>';
        }).join('');
        return frame('plx-area-chart' + (variant === 'area' ? '' : ' plx-area-chart--stacked'), extraCls, grid() + '<g class="plx-line-chart__series">' + shapes + '</g>' + axes(), { title: 'Sign-ups by platform' });
      },
      labelSelector: '.plx-chart__title',
      parts: { fo: 'A' }, anchors: { A: { part: '.plx-area-chart__area', side: 'top' } },
      sections: [['Area', ['fo']]],
      matrixLabel: 'Area chart values by stack', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Stacks · ' + HEAD
    });

    // ---- Gauge (<Gauge>): the dial, the readout, the ends, the threshold bands
    var GA = C('gauge');
    var arc = function (r, t0, t1) { var at = function (t) { var a = Math.PI * (1 - t); return [80 + r * Math.cos(a), 80 - r * Math.sin(a)]; }; var p = at(t0), qq = at(t1); return 'M' + p[0].toFixed(2) + ',' + p[1].toFixed(2) + 'A' + r + ',' + r + ' 0 0 1 ' + qq[0].toFixed(2) + ',' + qq[1].toFixed(2); };
    DS.registerLab('gauge', {
      name: 'Gauge', title: 'Plenix gauge', file: 'platform/charts/gauge.css', compPrefix: /^plx-comp-gauge-/,
      store: 'plenix-gauge-lab-tokens', sizes: [['sm', 'Small', '.plx-gauge'], ['md', 'Medium (default)', '.plx-gauge'], ['lg', 'Large', '.plx-gauge']],
      variants: [['semicircle', 'Semicircle'], ['thresholds', 'With thresholds']],
      states: [['default', 'Default']], content: [['label', 'Value and label']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'thresholds', state: 'default', content: 'label' },
      props: [
        { id: 'w', label: 'Dial width', css: ['inline-size'], show: 'width', part: '.plx-gauge__meter', cat: 'size' },
        { id: 'g', label: 'Space under the dial', css: ['row-gap'], part: '.plx-gauge__meter', cat: 'space' },
        { id: 'tc', label: 'Track color', css: ['stroke'], part: '.plx-gauge__track', cat: 'color' },
        { id: 'tw', label: 'Track width', css: ['stroke-width'], part: '.plx-gauge__track', cat: 'border-width' },
        { id: 'bw', label: 'Threshold range width', css: ['stroke-width'], part: '.plx-gauge__band', cat: 'border-width' },
        { id: 'vc', label: 'Value color', css: ['color'], part: '.plx-gauge__value', cat: 'color' },
        { id: 'vf', label: 'Value font (data)', css: ['font-family'], part: '.plx-gauge__value', cat: 'font' },
        { id: 'vs', label: 'Value size', css: ['font-size'], part: '.plx-gauge__value', cat: 'font-size' },
        { id: 'vw', label: 'Value weight', css: ['font-weight'], part: '.plx-gauge__value', cat: 'font-weight' },
        { id: 'vl', label: 'Value line height', css: ['line-height'], part: '.plx-gauge__value', cat: 'line-height' },
        { id: 'lc', label: 'Label color', css: ['color'], part: '.plx-gauge__label', cat: 'color' },
        { id: 'lf', label: 'Label font', css: ['font-family'], part: '.plx-gauge__label', cat: 'font' },
        { id: 'ls', label: 'Label size', css: ['font-size'], part: '.plx-gauge__label', cat: 'font-size' },
        { id: 'll', label: 'Label line height', css: ['line-height'], part: '.plx-gauge__label', cat: 'line-height' },
        { id: 'ec', label: 'Ends color', css: ['color'], part: '.plx-gauge__range', cat: 'color' },
        { id: 'ef', label: 'Ends font (data)', css: ['font-family'], part: '.plx-gauge__range', cat: 'font' },
        { id: 'es', label: 'Ends size', css: ['font-size'], part: '.plx-gauge__range', cat: 'font-size' },
        { id: 'el', label: 'Ends line height', css: ['line-height'], part: '.plx-gauge__range', cat: 'line-height' },
        { id: 'ei', label: 'Ends inset', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-gauge__range', cat: 'space' }
      ],
      token: function (id, size, variant) {
        if (id === 'w') return GA('width-' + size);
        if (id === 'bw') return variant === 'thresholds' ? GA('band-width') : null;
        var T = { g: 'gap', tc: 'track-color', tw: 'track-width', vc: 'value-text', vf: 'value-font-family', vs: 'value-font-size', vw: 'value-font-weight', vl: 'value-line-height', lc: 'label-text', lf: 'label-font-family', ls: 'label-font-size', ll: 'label-line-height',
          ec: 'end-text', ef: 'end-font-family', es: 'end-font-size', el: 'end-line-height', ei: 'end-inset' };
        return T[id] ? GA(T[id]) : null;
      },
      reach: function (full) { return /width-(sm|md|lg)/.test(full) ? 'every gauge of that size' : 'every gauge'; }, every: 'every gauge',
      html: function (variant, size, state, extraCls) {
        var th = variant === 'thresholds', v = th ? 0.86 : 0.72;
        var bands = th ? '<path class="plx-gauge__band" data-plx-dataviz="alert-warning" d="' + arc(74, 0.8, 0.95) + '"></path><path class="plx-gauge__band" data-plx-dataviz="alert-critical" d="' + arc(74, 0.95, 1) + '"></path>' : '';
        return '<div class="ds-w09a-lab"><figure class="plx-chart plx-gauge plx-gauge--' + size + (th ? ' plx-gauge--thresholds' : '') + ex(extraCls) + '"><figcaption class="plx-chart__caption"><span class="plx-chart__title">Storage used</span></figcaption>'
          + '<div class="plx-gauge__meter" role="meter" aria-label="Storage used" aria-valuenow="' + Math.round(v * 100) + '" aria-valuemin="0" aria-valuemax="100"><div class="plx-gauge__dial"><svg class="plx-gauge__svg" viewBox="0 0 160 88" aria-hidden="true" focusable="false">'
          + bands + '<path class="plx-gauge__track" d="' + arc(60, 0, 1) + '"></path><path class="plx-gauge__fill" data-plx-dataviz="categorical-1" d="' + arc(60, 0, v) + '"></path></svg>'
          + '<div class="plx-gauge__readout" aria-hidden="true"><span class="plx-gauge__value">' + Math.round(v * 100) + '%</span><span class="plx-gauge__label">of 100 GB</span></div></div>'
          + '<div class="plx-gauge__range" aria-hidden="true"><span class="plx-gauge__end">0%</span><span class="plx-gauge__end">100%</span></div>'
          + (th ? '<span class="plx-badge plx-badge--waiting plx-gauge__status">Nearly full</span>' : '') + '</div></figure></div>';
      },
      labelSelector: '.plx-chart__title',
      parts: { w: 'A', g: 'A', tc: 'B', tw: 'B', bw: 'C', vc: 'D', vf: 'D', vs: 'D', vw: 'D', vl: 'D', lc: 'E', lf: 'E', ls: 'E', ll: 'E', ec: 'F', ef: 'F', es: 'F', el: 'F', ei: 'F' },
      anchors: { A: { part: '.plx-gauge__meter', side: 'left' }, B: { part: '.plx-gauge__track', side: 'top' }, C: { part: '.plx-gauge__band', side: 'right' }, D: { part: '.plx-gauge__value', side: 'right' }, E: { part: '.plx-gauge__label', side: 'right' }, F: { part: '.plx-gauge__range', side: 'bottom' } },
      sections: [['Dial', ['w', 'g', 'tc', 'tw', 'bw']], ['Value', ['vc', 'vf', 'vs', 'vw', 'vl']], ['Label', ['lc', 'lf', 'ls', 'll']], ['Ends', ['ec', 'ef', 'es', 'el', 'ei']]],
      matrixLabel: 'Gauge values by variant and size', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Variants · ' + HEAD
    });

    // ---- Heat map (<HeatMap>): cells, the empty cell, the active cell, the color scale
    var HM = C('heat-map');
    DS.registerLab('heat-map', {
      name: 'Heat map', title: 'Plenix heat map', file: 'platform/charts/heat-map.css', compPrefix: /^plx-comp-heat-map-/,
      store: 'plenix-heat-map-lab-tokens', sizes: [['default', 'Default', '.plx-heat-map']],
      variants: [['matrix', 'Matrix'], ['calendar', 'Calendar']],
      states: [['default', 'Default'], ['active', 'A cell in focus']], content: [['values', 'Values'], ['missing', 'With a missing value']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'matrix', state: 'active', content: 'missing' },
      props: [
        { id: 'cr', label: 'Cell corners', css: ['rx'], part: '.plx-heat-map__cell', cat: 'radius' },
        { id: 'cw', label: 'Cell edge width', css: ['stroke-width'], part: '.plx-heat-map__cell', cat: 'border-width' },
        { id: 'eb', label: 'Missing value fill', css: ['fill'], part: '.plx-heat-map__cell--empty', cat: 'color' },
        { id: 'ec', label: 'Missing value edge', css: ['stroke'], part: '.plx-heat-map__cell--empty', cat: 'color' },
        { id: 'ac', label: 'Active cell edge color', css: ['stroke'], part: '.plx-heat-map__cell--active', cat: 'color' },
        { id: 'aw', label: 'Active cell edge width', css: ['stroke-width'], part: '.plx-heat-map__cell--active', cat: 'border-width' },
        { id: 'sg', label: 'Scale spacing', css: ['column-gap'], part: '.plx-heat-map-scale', cat: 'space' },
        { id: 'st', label: 'Scale text color', css: ['color'], part: '.plx-heat-map-scale', cat: 'color' },
        { id: 'sf', label: 'Scale font', css: ['font-family'], part: '.plx-heat-map-scale', cat: 'font' },
        { id: 'ss', label: 'Scale size', css: ['font-size'], part: '.plx-heat-map-scale', cat: 'font-size' },
        { id: 'sl', label: 'Scale line height', css: ['line-height'], part: '.plx-heat-map-scale', cat: 'line-height' },
        { id: 'vf', label: 'Scale values font (data)', css: ['font-family'], part: '.plx-heat-map-scale__end', cat: 'font' },
        { id: 'mf', label: 'Missing value name font', css: ['font-family'], part: '.plx-heat-map-scale__missing', cat: 'font' },
        { id: 'sw', label: 'Scale step width', css: ['inline-size'], show: 'width', part: '.plx-heat-map-scale__swatch', cat: 'size' },
        { id: 'sh', label: 'Scale step height', css: ['block-size'], show: 'height', part: '.plx-heat-map-scale__swatch', cat: 'size' }
      ],
      token: function (id, size, variant, state, content) {
        var miss = content === 'missing';
        if (id === 'eb' || id === 'ec' || id === 'mf') return miss ? HM({ eb: 'empty-background', ec: 'empty-border-color', mf: 'scale-label-font-family' }[id]) : null;
        if (id === 'ac' || id === 'aw') return state === 'active' ? HM(id === 'ac' ? 'active-border-color' : 'active-border-width') : null;
        var T = { cr: 'cell-radius', cw: 'cell-border-width', sg: 'scale-gap', st: 'scale-text', sf: 'scale-font-family', ss: 'scale-font-size', sl: 'scale-line-height', vf: 'scale-value-font-family', sw: 'scale-swatch-width', sh: 'scale-swatch-height' };
        return T[id] ? HM(T[id]) : null;
      },
      reach: function () { return 'every heat map'; }, every: 'every heat map',
      html: function (variant, size, state, extraCls, ui) {
        var miss = ui && ui.content === 'missing', act = state === 'active', cal = variant === 'calendar';
        var rows = cal ? 7 : 5, cols = cal ? 16 : 8, cw = cal ? 20 : IW / cols, ch = cal ? 20 : IH / rows;
        var cells = '';
        for (var c = 0; c < cols; c++) for (var r = 0; r < rows; r++) {
          var empty = miss && r === 2 && c === 4, step = 1 + ((r * 3 + c * 5) % 7);
          cells += '<rect class="plx-heat-map__cell' + (empty ? ' plx-heat-map__cell--empty' : '') + (act && r === 1 && c === 2 ? ' plx-heat-map__cell--active' : '') + '"' + (empty ? '' : ' data-plx-dataviz="sequential-' + step + '"') + ' x="' + (c * cw + 1) + '" y="' + (r * ch + 1) + '" width="' + (cw - 2) + '" height="' + (ch - 2) + '"></rect>';
        }
        var scale = '<div class="plx-chart__legend plx-chart__legend--bottom"><div class="plx-heat-map-scale" role="group" aria-label="Color scale"><span class="plx-heat-map-scale__end">14</span><span class="plx-heat-map-scale__steps" aria-hidden="true">'
          + [1, 2, 3, 4, 5, 6, 7].map(function (k) { return '<span class="plx-heat-map-scale__swatch" data-plx-dataviz="sequential-' + k + '"></span>'; }).join('') + '</span><span class="plx-heat-map-scale__end">66</span>'
          + (miss ? '<span class="plx-heat-map-scale__missing"><span class="plx-heat-map-scale__swatch plx-heat-map-scale__swatch--missing" aria-hidden="true"></span>No data</span>' : '') + '</div></div>';
        return frame('plx-heat-map plx-heat-map--' + variant, extraCls, '<g class="plx-heat-map__plot">' + cells + '</g>', { title: cal ? 'Daily edits' : 'Uploads by hour', after: scale, plotState: '' });
      },
      labelSelector: '.plx-chart__title',
      parts: { cr: 'A', cw: 'A', eb: 'B', ec: 'B', ac: 'C', aw: 'C', sg: 'D', st: 'D', sf: 'D', ss: 'D', sl: 'D', vf: 'E', mf: 'F', sw: 'G', sh: 'G' },
      anchors: { A: { part: '.plx-heat-map__cell', side: 'top' }, B: { part: '.plx-heat-map__cell--empty', side: 'bottom' }, C: { part: '.plx-heat-map__cell--active', side: 'right' }, D: { part: '.plx-heat-map-scale', side: 'left' }, E: { part: '.plx-heat-map-scale__end', side: 'bottom' }, F: { part: '.plx-heat-map-scale__missing', side: 'right' }, G: { part: '.plx-heat-map-scale__swatch', side: 'top' } },
      sections: [['Cells', ['cr', 'cw', 'eb', 'ec', 'ac', 'aw']], ['Color scale', ['sg', 'st', 'sf', 'ss', 'sl', 'vf', 'mf', 'sw', 'sh']]],
      matrixLabel: 'Heat map values by variant', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Variants · ' + HEAD
    });

    // ---- Waterfall (<WaterfallChart>): the connectors between steps (the columns are the frame's marks)
    var WF = C('waterfall-chart');
    DS.registerLab('waterfall-chart', {
      name: 'Waterfall', title: 'Plenix waterfall chart', file: 'platform/charts/waterfall-chart.css', compPrefix: /^plx-comp-waterfall-chart-/,
      store: 'plenix-waterfall-chart-lab-tokens', sizes: [['default', 'Default', '.plx-waterfall-chart']],
      variants: [['default', 'Start to end'], ['totals', 'With totals']],
      states: [['default', 'Default']], content: [['values', 'Values']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'totals', state: 'default', content: 'values' },
      props: [
        { id: 'cc', label: 'Connector color', css: ['stroke'], part: '.plx-waterfall-chart__connector', cat: 'color' },
        { id: 'cw', label: 'Connector width', css: ['stroke-width'], part: '.plx-waterfall-chart__connector', cat: 'border-width' }
      ],
      token: function (id) { return id === 'cc' ? WF('connector-color') : id === 'cw' ? WF('connector-width') : null; },
      reach: function () { return 'every waterfall chart'; }, every: 'every waterfall chart',
      html: function (variant, size, state, extraCls) {
        var steps = variant === 'totals' ? [['Last year', 0, 160, 'total'], ['New', 160, 210, 'up'], ['Churn', 210, 188, 'down'], ['Half', 0, 188, 'total'], ['Price', 188, 176, 'down'], ['End', 0, 176, 'total']]
          : [['Last year', 0, 160, 'total'], ['New', 160, 210, 'up'], ['Churn', 210, 188, 'down'], ['Price', 188, 176, 'down'], ['Upsell', 176, 194, 'up'], ['End', 0, 194, 'total']];
        var color = { total: 'categorical-1', up: 'status-positive', down: 'status-negative' };
        var bw = Math.round(STEP * 0.8), x = function (i) { return Math.round(STEP * i + STEP * 0.1); }, y = function (v) { return Math.round(IH - v / 240 * IH); };
        var out = steps.map(function (s, i) {
          var conn = i ? '<line class="plx-waterfall-chart__connector" x1="' + (x(i - 1) + bw) + '" x2="' + x(i) + '" y1="' + y(steps[i - 1][2]) + '" y2="' + y(steps[i - 1][2]) + '"></line>' : '';
          return conn + '<rect class="plx-chart__mark plx-waterfall-chart__bar plx-waterfall-chart__bar--' + s[3] + '" data-plx-dataviz="' + color[s[3]] + '" x="' + x(i) + '" y="' + y(Math.max(s[1], s[2])) + '" width="' + bw + '" height="' + Math.abs(y(s[1]) - y(s[2])) + '"></rect>';
        }).join('');
        return frame('plx-waterfall-chart' + (variant === 'totals' ? ' plx-waterfall-chart--subtotals' : ''), extraCls, '<g class="plx-waterfall-chart__plot">' + out + '</g>', { title: 'Revenue, last year to this year' });
      },
      labelSelector: '.plx-chart__title',
      parts: { cc: 'A', cw: 'A' }, anchors: { A: { part: '.plx-waterfall-chart__connector', side: 'top' } },
      sections: [['Connector', ['cc', 'cw']]],
      matrixLabel: 'Waterfall values by variant', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Variants · ' + HEAD
    });

    // ---- Word cloud (<WordCloud>): the words in five sizes, grouped words, the active word
    var WC = C('word-cloud');
    var CLOUD = [['search', 5, 200, 84], ['sharing', 4, 104, 60], ['folders', 4, 292, 112], ['tags', 3, 120, 112], ['export', 3, 300, 56], ['speed', 2, 196, 136], ['upload', 2, 196, 36], ['preview', 1, 44, 84], ['offline', 1, 344, 84], ['sync', 2, 60, 136]];
    DS.registerLab('word-cloud', {
      name: 'Word cloud', title: 'Plenix word cloud', file: 'platform/charts/word-cloud.css', compPrefix: /^plx-comp-word-cloud-/,
      store: 'plenix-word-cloud-lab-tokens', sizes: [['default', 'Default', '.plx-word-cloud']],
      variants: [['spiral', 'Spiral'], ['rectangular', 'Rectangular']],
      states: [['default', 'Default'], ['active', 'A word in focus']], content: [['words', 'Words'], ['groups', 'Grouped words']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'spiral', state: 'active', content: 'words' },
      props: [
        { id: 'tc', label: 'Word color', css: ['fill'], part: '.plx-word-cloud__word--1', cat: 'color' },
        { id: 'ff', label: 'Font', css: ['font-family'], part: '.plx-word-cloud__word', cat: 'font' },
        { id: 'fw', label: 'Weight', css: ['font-weight'], part: '.plx-word-cloud__word--1', cat: 'font-weight' },
        { id: 'lw', label: 'Weight of the largest words', css: ['font-weight'], part: '.plx-word-cloud__word--5', cat: 'font-weight' },
        { id: 's1', label: 'Size step 1', css: ['font-size'], part: '.plx-word-cloud__word--1', cat: 'font-size' },
        { id: 's2', label: 'Size step 2', css: ['font-size'], part: '.plx-word-cloud__word--2', cat: 'font-size' },
        { id: 's3', label: 'Size step 3', css: ['font-size'], part: '.plx-word-cloud__word--3', cat: 'font-size' },
        { id: 's4', label: 'Size step 4', css: ['font-size'], part: '.plx-word-cloud__word--4', cat: 'font-size' },
        { id: 's5', label: 'Size step 5', css: ['font-size'], part: '.plx-word-cloud__word--5', cat: 'font-size' },
        { id: 'uw', label: 'Underline of the active word', css: ['text-decoration-thickness'], part: '.plx-word-cloud__word--active', cat: 'border-width' }
      ],
      token: function (id, size, variant, state, content) {
        if (id === 'tc') return content === 'groups' ? null : WC('text');
        if (id === 'uw') return state === 'active' ? WC('active-underline-width') : null;
        var T = { ff: 'font-family', fw: 'font-weight', lw: 'large-font-weight', s1: 'size-1', s2: 'size-2', s3: 'size-3', s4: 'size-4', s5: 'size-5' };
        return T[id] ? WC(T[id]) : null;
      },
      reach: function () { return 'every word cloud'; }, every: 'every word cloud',
      html: function (variant, size, state, extraCls, ui) {
        var groups = ui && ui.content === 'groups', rect = variant === 'rectangular';
        var words = CLOUD.map(function (w, i) {
          var x = rect ? 56 + (i % 4) * 96 : w[2], y = rect ? 40 + Math.floor(i / 4) * 48 : w[3];
          return '<text class="plx-word-cloud__word plx-word-cloud__word--' + w[1] + (state === 'active' && i === 1 ? ' plx-word-cloud__word--active' : '') + '"' + (groups ? ' data-plx-dataviz="categorical-' + (i % 3 ? 2 : 1) + '"' : '') + ' x="' + x + '" y="' + y + '">' + w[0] + '</text>';
        }).join('');
        return frame('plx-word-cloud plx-word-cloud--' + variant, extraCls, '<g class="plx-word-cloud__plot">' + words + '</g>', { title: 'What people asked for', l: 8, t: 8 });
      },
      labelSelector: '.plx-chart__title',
      parts: { tc: 'A', ff: 'A', fw: 'A', lw: 'B', s1: 'A', s2: 'C', s3: 'C', s4: 'C', s5: 'B', uw: 'D' },
      anchors: { A: { part: '.plx-word-cloud__word--1', side: 'bottom' }, B: { part: '.plx-word-cloud__word--5', side: 'top' }, C: { part: '.plx-word-cloud__word--3', side: 'right' }, D: { part: '.plx-word-cloud__word--active', side: 'bottom' } },
      sections: [['Words', ['tc', 'ff', 'fw', 'lw', 'uw']], ['Sizes', ['s1', 's2', 's3', 's4', 's5']]],
      matrixLabel: 'Word cloud values by layout', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Layouts · ' + HEAD
    });

    // ---- Graph / network (<NetworkGraph>): nodes, labels, edges, arrows, the active node
    var NG = C('network-graph');
    var NODES = [['Website', 72, 40, 3], ['Newsletter', 300, 40, 3], ['Spring campaign', 72, 104, 2], ['Summer sale', 300, 104, 2], ['Logo', 186, 156, 1]];
    var EDGES = [[0, 2], [1, 3], [2, 4], [3, 4], [0, 1, 'dashed']];
    DS.registerLab('network-graph', {
      name: 'Graph / network', title: 'Plenix network graph', file: 'platform/charts/network-graph.css', compPrefix: /^plx-comp-network-graph-/,
      store: 'plenix-network-graph-lab-tokens', sizes: [['default', 'Default', '.plx-network-graph']],
      variants: [['force', 'Force'], ['hierarchical', 'Hierarchical'], ['zoom', 'Zoom and pan']],
      states: [['default', 'Default'], ['active', 'A node in focus']], content: [['labels', 'Labeled edges']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'hierarchical', state: 'active', content: 'labels' },
      props: [
        { id: 'nr', label: 'Node radius', css: ['r'], part: '.plx-network-graph__dot', cat: 'size' },
        { id: 'no', label: 'Node ring color', css: ['stroke'], part: '.plx-network-graph__node:not(.plx-network-graph__node--active) .plx-network-graph__dot', cat: 'color' },
        { id: 'nw', label: 'Node ring width', css: ['stroke-width'], part: '.plx-network-graph__node:not(.plx-network-graph__node--active) .plx-network-graph__dot', cat: 'border-width' },
        { id: 'lc', label: 'Label color', css: ['fill'], part: '.plx-network-graph__label', cat: 'color' },
        { id: 'lf', label: 'Label font', css: ['font-family'], part: '.plx-network-graph__label', cat: 'font' },
        { id: 'ls', label: 'Label size', css: ['font-size'], part: '.plx-network-graph__label', cat: 'font-size' },
        { id: 'hc', label: 'Label halo color', css: ['stroke'], part: '.plx-network-graph__label', cat: 'color' },
        { id: 'hw', label: 'Label halo width', css: ['stroke-width'], part: '.plx-network-graph__label', cat: 'border-width' },
        { id: 'ec', label: 'Edge color', css: ['stroke'], part: '.plx-network-graph__edge:not(.plx-network-graph__edge--active)', cat: 'color' },
        { id: 'ew', label: 'Edge width', css: ['stroke-width'], part: '.plx-network-graph__edge:not(.plx-network-graph__edge--active)', cat: 'border-width' },
        { id: 'ar', label: 'Arrowhead color', css: ['fill'], part: '.plx-network-graph__arrow', cat: 'color' },
        { id: 'xc', label: 'Edge label color', css: ['fill'], part: '.plx-network-graph__edge-label', cat: 'color' },
        { id: 'xs', label: 'Edge label size', css: ['font-size'], part: '.plx-network-graph__edge-label', cat: 'font-size' },
        { id: 'ac', label: 'Active edge color', css: ['stroke'], part: '.plx-network-graph__edge--active', cat: 'color' },
        { id: 'aw', label: 'Active edge width', css: ['stroke-width'], part: '.plx-network-graph__edge--active', cat: 'border-width' },
        { id: 'ao', label: 'Active node ring', css: ['stroke'], part: '.plx-network-graph__node--active .plx-network-graph__dot', cat: 'color' },
        { id: 'an', label: 'Active node ring width', css: ['stroke-width'], part: '.plx-network-graph__node--active .plx-network-graph__dot', cat: 'border-width' },
        { id: 'al', label: 'Active label weight', css: ['font-weight'], part: '.plx-network-graph__node--active .plx-network-graph__label', cat: 'font-weight' }
      ],
      token: function (id, size, variant, state) {
        if (['ac', 'aw', 'ao', 'an', 'al'].indexOf(id) >= 0) return state === 'active' ? NG({ ac: 'active-edge-color', aw: 'active-edge-width', ao: 'active-outline', an: 'active-outline-width', al: 'active-label-font-weight' }[id]) : null;
        var T = { nr: 'node-radius', no: 'node-outline', nw: 'node-outline-width', lc: 'label-text', lf: 'label-font-family', ls: 'label-font-size', hc: 'label-halo-color', hw: 'label-halo-width', ec: 'edge-color', ew: 'edge-width', ar: 'edge-color', xc: 'edge-label-text', xs: 'edge-label-font-size' };
        return T[id] ? NG(T[id]) : null;
      },
      reach: function () { return 'every network graph'; }, every: 'every network graph',
      html: function (variant, size, state, extraCls) {
        var act = state === 'active', A = 2;
        var force = variant === 'force';
        var at = function (i) { var n = NODES[i]; return force ? [[120, 52], [300, 36], [80, 128], [288, 124], [196, 92]][i] : [n[1], n[2]]; };
        var arrow = '<defs><marker id="ds-w09a-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path class="plx-network-graph__arrow" d="M0,0L8,4L0,8Z"></path></marker></defs>';
        var edges = EDGES.map(function (e) {
          var s = at(e[0]), t = at(e[1]), on = act && (e[0] === A || e[1] === A), len = Math.hypot(t[0] - s[0], t[1] - s[1]), ux = (t[0] - s[0]) / len, uy = (t[1] - s[1]) / len;
          return '<g class="plx-network-graph__link"><line class="plx-network-graph__edge' + (e[2] ? ' plx-network-graph__edge--dashed' : '') + (on ? ' plx-network-graph__edge--active' : '') + '" x1="' + (s[0] + ux * 12).toFixed(1) + '" y1="' + (s[1] + uy * 12).toFixed(1) + '" x2="' + (t[0] - ux * 12).toFixed(1) + '" y2="' + (t[1] - uy * 12).toFixed(1) + '" marker-end="url(#ds-w09a-arrow)"></line>'
            + (e[2] ? '<text class="plx-network-graph__edge-label" x="' + (s[0] + t[0]) / 2 + '" y="' + (s[1] + t[1]) / 2 + '">reuses</text>' : '') + '</g>';
        }).join('');
        var nodes = NODES.map(function (n, i) { var p = at(i); return '<g class="plx-network-graph__node' + (act && i === A ? ' plx-network-graph__node--active' : '') + '"><circle class="plx-network-graph__dot" data-plx-dataviz="categorical-' + n[3] + '" cx="' + p[0] + '" cy="' + p[1] + '"></circle><text class="plx-network-graph__label" x="' + p[0] + '" y="' + p[1] + '">' + n[0] + '</text></g>'; }).join('');
        var zoom = variant === 'zoom' ? '<button type="button" tabindex="-1" class="plx-button plx-button--secondary plx-button--size-sm"><span class="plx-button__label">Fit</span></button>' : '';
        return frame('plx-network-graph plx-network-graph--' + (force ? 'force' : 'hierarchical'), extraCls, '<g class="plx-network-graph__plot">' + arrow + '<g' + (variant === 'zoom' ? ' transform="translate(-40,-20) scale(1.2)"' : '') + '>' + edges + nodes + '</g></g>', { title: 'Where the brand assets are used', l: 0, t: 0, actions: zoom });
      },
      labelSelector: '.plx-chart__title',
      parts: { nr: 'A', no: 'A', nw: 'A', lc: 'B', lf: 'B', ls: 'B', hc: 'B', hw: 'B', ec: 'C', ew: 'C', ar: 'C', xc: 'D', xs: 'D', ac: 'E', aw: 'E', ao: 'F', an: 'F', al: 'F' },
      anchors: { A: { part: '.plx-network-graph__dot', side: 'top' }, B: { part: '.plx-network-graph__label', side: 'bottom' }, C: { part: '.plx-network-graph__edge', side: 'left' }, D: { part: '.plx-network-graph__edge-label', side: 'top' }, E: { part: '.plx-network-graph__edge--active', side: 'right' }, F: { part: '.plx-network-graph__node--active', side: 'right' } },
      sections: [['Nodes', ['nr', 'no', 'nw', 'lc', 'lf', 'ls', 'hc', 'hw']], ['Edges', ['ec', 'ew', 'ar', 'xc', 'xs']], ['Active', ['ac', 'aw', 'ao', 'an', 'al']]],
      matrixLabel: 'Network graph values by layout', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Layouts · ' + HEAD
    });

    // ---- Diagram (<Diagram>): shapes, labels, connectors, groups, the active shape
    var DG = C('diagram');
    DS.registerLab('diagram', {
      name: 'Diagram', title: 'Plenix diagram', file: 'platform/charts/diagram.css', compPrefix: /^plx-comp-diagram-/,
      store: 'plenix-diagram-lab-tokens', sizes: [['default', 'Default', '.plx-diagram']],
      variants: [['flowchart', 'Flowchart'], ['boxes', 'Boxes and arrows'], ['read-only', 'Read-only']],
      states: [['default', 'Default'], ['active', 'A shape in focus']], content: [['steps', 'Steps']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'flowchart', state: 'default', content: 'steps' },
      props: [
        { id: 'sb', label: 'Shape fill', css: ['fill'], part: '.plx-diagram__shape', cat: 'color' },
        { id: 'sc', label: 'Shape outline', css: ['stroke'], part: '.plx-diagram__node:not(.plx-diagram__node--active) .plx-diagram__shape', cat: 'color' },
        { id: 'sw', label: 'Shape outline width', css: ['stroke-width'], part: '.plx-diagram__node:not(.plx-diagram__node--active) .plx-diagram__shape', cat: 'border-width' },
        { id: 'sr', label: 'Step corners', css: ['rx'], part: '.plx-diagram__node--process .plx-diagram__shape, .plx-diagram__node--box .plx-diagram__shape', cat: 'radius' },
        { id: 'tr', label: 'Start and end corners', css: ['rx'], part: '.plx-diagram__node--terminal .plx-diagram__shape', cat: 'radius' },
        { id: 'lc', label: 'Label color', css: ['color'], part: '.plx-diagram__text', cat: 'color' },
        { id: 'lf', label: 'Label font', css: ['font-family'], part: '.plx-diagram__text', cat: 'font' },
        { id: 'ls', label: 'Label size', css: ['font-size'], part: '.plx-diagram__text', cat: 'font-size' },
        { id: 'll', label: 'Label line height', css: ['line-height'], part: '.plx-diagram__text', cat: 'line-height' },
        { id: 'lw', label: 'Label weight', css: ['font-weight'], part: '.plx-diagram__label', cat: 'font-weight' },
        { id: 'lp', label: 'Label side room', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-diagram__node:not(.plx-diagram__node--decision) .plx-diagram__text', cat: 'space' },
        { id: 'dp', label: 'Decision side room', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-diagram__node--decision .plx-diagram__text', cat: 'space' },
        { id: 'tc', label: 'Second line color', css: ['color'], part: '.plx-diagram__detail', cat: 'color' },
        { id: 'ts', label: 'Second line size', css: ['font-size'], part: '.plx-diagram__detail', cat: 'font-size' },
        { id: 'cc', label: 'Connector color', css: ['stroke'], part: '.plx-diagram__connector:not(.plx-diagram__connector--active)', cat: 'color' },
        { id: 'cw', label: 'Connector width', css: ['stroke-width'], part: '.plx-diagram__connector:not(.plx-diagram__connector--active)', cat: 'border-width' },
        { id: 'xc', label: 'Branch label color', css: ['fill'], part: '.plx-diagram__connector-label', cat: 'color' },
        { id: 'xs', label: 'Branch label size', css: ['font-size'], part: '.plx-diagram__connector-label', cat: 'font-size' },
        { id: 'hc', label: 'Branch label halo', css: ['stroke'], part: '.plx-diagram__connector-label', cat: 'color' },
        { id: 'hw', label: 'Branch label halo width', css: ['stroke-width'], part: '.plx-diagram__connector-label', cat: 'border-width' },
        { id: 'gb', label: 'Group fill', css: ['fill'], part: '.plx-diagram__group-box', cat: 'color' },
        { id: 'gc', label: 'Group outline', css: ['stroke'], part: '.plx-diagram__group-box', cat: 'color' },
        { id: 'gr', label: 'Group corners', css: ['rx'], part: '.plx-diagram__group-box', cat: 'radius' },
        { id: 'gl', label: 'Group name color', css: ['fill'], part: '.plx-diagram__group-label', cat: 'color' },
        { id: 'ac', label: 'Active outline color', css: ['stroke'], part: '.plx-diagram__node--active .plx-diagram__shape', cat: 'color' },
        { id: 'aw', label: 'Active outline width', css: ['stroke-width'], part: '.plx-diagram__node--active .plx-diagram__shape', cat: 'border-width' }
      ],
      token: function (id, size, variant, state) {
        var boxes = variant === 'boxes';
        if (id === 'ac' || id === 'aw') return state === 'active' ? DG(id === 'ac' ? 'active-border-color' : 'active-border-width') : null;
        if (['tc', 'ts', 'gb', 'gc', 'gr', 'gl'].indexOf(id) >= 0) return boxes ? DG({ tc: 'detail-text', ts: 'detail-font-size', gb: 'group-background', gc: 'group-border-color', gr: 'group-radius', gl: 'group-label-text' }[id]) : null;
        if (['tr', 'dp', 'xc', 'xs', 'hc', 'hw'].indexOf(id) >= 0) return boxes ? null : DG({ tr: 'terminal-radius', dp: 'decision-padding-inline', xc: 'connector-label-text', xs: 'connector-label-font-size', hc: 'connector-label-halo-color', hw: 'connector-label-halo-width' }[id]);
        var T = { sb: 'shape-background', sc: 'shape-border-color', sw: 'shape-border-width', sr: 'shape-radius', lc: 'label-text', lf: 'label-font-family', ls: 'label-font-size', ll: 'label-line-height', lw: 'label-font-weight', lp: 'label-padding-inline', cc: 'connector-color', cw: 'connector-width' };
        return T[id] ? DG(T[id]) : null;
      },
      reach: function () { return 'every diagram'; }, every: 'every diagram',
      html: function (variant, size, state, extraCls) {
        var boxes = variant === 'boxes', act = state === 'active';
        var node = function (shape, x, y, w, h, label, detail, i) {
          var outline = shape === 'decision' ? '<path class="plx-diagram__shape" d="M0,' + -h / 2 + 'L' + w / 2 + ',0L0,' + h / 2 + 'L' + -w / 2 + ',0Z"></path>' : '<rect class="plx-diagram__shape" x="' + -w / 2 + '" y="' + -h / 2 + '" width="' + w + '" height="' + h + '"></rect>';
          return '<g transform="translate(' + x + ',' + y + ')" class="plx-diagram__node plx-diagram__node--' + shape + (act && i === 1 ? ' plx-diagram__node--active' : '') + '">' + outline + '<foreignObject x="' + -w / 2 + '" y="' + -h / 2 + '" width="' + w + '" height="' + h + '"><div class="plx-diagram__text"><span class="plx-diagram__label">' + label + '</span>' + (detail ? '<span class="plx-diagram__detail">' + detail + '</span>' : '') + '</div></foreignObject></g>';
        };
        var arrow = '<defs><marker id="ds-w09a-diagram-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path class="plx-diagram__arrow" d="M0,0L8,4L0,8Z"></path></marker></defs>';
        var conn = function (dd, on, label, lx, ly) { return '<g class="plx-diagram__link"><path class="plx-diagram__connector' + (on ? ' plx-diagram__connector--active' : '') + '" d="' + dd + '" marker-end="url(#ds-w09a-diagram-arrow)"></path>' + (label ? '<text class="plx-diagram__connector-label" x="' + lx + '" y="' + ly + '">' + label + '</text>' : '') + '</g>'; };
        var inside;
        if (boxes) {
          inside = '<g class="plx-diagram__group"><rect class="plx-diagram__group-box" x="8" y="8" width="160" height="176"></rect><text class="plx-diagram__group-label" x="24" y="28">Web</text></g>'
            + '<g class="plx-diagram__group"><rect class="plx-diagram__group-box" x="200" y="8" width="192" height="176"></rect><text class="plx-diagram__group-label" x="216" y="28">Server</text></g>'
            + conn('M152,104H176V80H224', act, null) + conn('M152,104H176V144H224', false, null)
            + node('box', 88, 104, 128, 56, 'Asset app', 'React', 0) + node('box', 296, 80, 128, 48, 'API', 'Node', 1) + node('box', 296, 144, 128, 48, 'Database', 'Postgres', 2);
        } else {
          inside = conn('M200,36V52', false, null) + conn('M200,92V108H112V124', act, 'Yes', 112, 108) + conn('M200,92V108H288V124', act, 'No', 288, 108)
            + node('terminal', 200, 20, 120, 32, 'Upload a file', null, 0) + node('decision', 200, 72, 144, 40, 'Meets the rules?', null, 1) + node('process', 112, 144, 128, 40, 'Publish it', null, 2) + node('data', 288, 144, 128, 40, 'Return to the owner', null, 3);
        }
        return frame('plx-diagram plx-diagram--' + (boxes ? 'boxes' : 'flowchart') + (variant === 'read-only' ? ' plx-diagram--read-only' : ''), extraCls, '<g class="plx-diagram__plot">' + arrow + inside + '</g>', { title: boxes ? 'How the asset app is built' : 'How an upload is approved', l: 0, t: 0, interactive: variant !== 'read-only' });
      },
      labelSelector: '.plx-chart__title',
      parts: { sb: 'A', sc: 'A', sw: 'A', sr: 'A', tr: 'A', lc: 'B', lf: 'B', ls: 'B', ll: 'B', lw: 'B', lp: 'B', dp: 'B', tc: 'C', ts: 'C', cc: 'D', cw: 'D', xc: 'E', xs: 'E', hc: 'E', hw: 'E', gb: 'F', gc: 'F', gr: 'F', gl: 'F', ac: 'G', aw: 'G' },
      anchors: { A: { part: '.plx-diagram__shape', side: 'top' }, B: { part: '.plx-diagram__text', side: 'right' }, C: { part: '.plx-diagram__detail', side: 'bottom' }, D: { part: '.plx-diagram__connector', side: 'left' }, E: { part: '.plx-diagram__connector-label', side: 'top' }, F: { part: '.plx-diagram__group-box', side: 'left' }, G: { part: '.plx-diagram__node--active', side: 'right' } },
      sections: [['Shapes', ['sb', 'sc', 'sw', 'sr', 'tr', 'ac', 'aw']], ['Labels', ['lc', 'lf', 'ls', 'll', 'lw', 'lp', 'dp', 'tc', 'ts']], ['Connectors', ['cc', 'cw', 'xc', 'xs', 'hc', 'hw']], ['Groups', ['gb', 'gc', 'gr', 'gl']]],
      matrixLabel: 'Diagram values by variant', matrixColumnWidth: '--plx-ref-size-100u', statesHead: 'Variants · ' + HEAD
    });
  })();
}
