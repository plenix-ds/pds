/* Plenix design system · library part w09B: the labs of wave 9, lane B. Each chart (BarChart, ComboChart, PieChart,
   BulletChart, BoxPlot, RadarChart, SankeyDiagram, TimelineChart) is drawn in place in its ChartFrame figure with the
   markup the component renders, in a fixed 360 × 240 plot (ChartFrame measures its container and draws the same
   markup), so every orientation, layout, variant and content shows with the one --plx-comp-* token behind each value:
   the chart's own tokens and the frame's (grid lines, axes, tick labels, marks) it draws with. ComparisonView is drawn
   with its panes, rows, badges and slider stage. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var CH = function (n) { return 'plx-comp-chart-' + n; };
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    // the ChartFrame figure: caption, the plot's SVG with its margins, the legend under it
    var fig = function (cls, extraCls, title, desc, inner, L, T, legend) {
      return '<div class="ds-w09b-lab"><figure class="plx-chart plx-chart--md ' + cls + ex(extraCls) + '"><figcaption class="plx-chart__caption"><span class="plx-chart__title">' + title + '</span><span class="plx-chart__description">' + desc + '</span></figcaption>'
        + '<div class="plx-chart__plot"><svg class="plx-chart__svg" width="360" height="240" viewBox="0 0 360 240" role="img" aria-label="' + title + '"><g transform="translate(' + L + ',' + T + ')" aria-hidden="true">' + inner + '</g></svg></div>'
        + (legend || '') + '</figure></div>';
    };
    var legendList = function (items, shape) {
      return '<div class="plx-chart-legend plx-chart-legend--horizontal"><ul class="plx-chart-legend__list" aria-label="Legend">' + items.map(function (it) {
        return '<li class="plx-chart-legend__item"><span class="plx-chart-legend__entry"><span class="plx-chart-legend__swatch plx-chart-legend__swatch--' + (shape || 'square') + '" data-plx-dataviz="' + it[1] + '" aria-hidden="true"></span><span class="plx-chart-legend__label">' + it[0] + '</span>'
          + (it[2] ? '<span class="plx-chart-legend__value">' + it[2] + '</span>' : '') + '</span></li>';
      }).join('') + '</ul></div>';
    };
    var legend = function (items, shape) { return '<div class="plx-chart__legend plx-chart__legend--bottom">' + legendList(items, shape) + '</div>'; };
    var gridH = function (ys, w) { return '<g class="plx-chart-grid plx-chart-grid--horizontal">' + ys.map(function (y) { return '<line class="plx-chart__grid-line" x1="0" x2="' + w + '" y1="' + y + '" y2="' + y + '"></line>'; }).join('') + '</g>'; };
    var gridV = function (xs, hh) { return '<g class="plx-chart-grid plx-chart-grid--vertical">' + xs.map(function (x) { return '<line class="plx-chart__grid-line" x1="' + x + '" x2="' + x + '" y1="0" y2="' + hh + '"></line>'; }).join('') + '</g>'; };
    var axisLeft = function (pairs, edge) { return '<g class="plx-chart-axis plx-chart-axis--left">' + pairs.map(function (p) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="' + (edge || 0) + '" y="' + p[0] + '">' + esc(p[1]) + '</text>'; }).join('') + '</g>'; };
    var axisRight = function (pairs, edge) { return '<g class="plx-chart-axis plx-chart-axis--right">' + pairs.map(function (p) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="' + edge + '" y="' + p[0] + '">' + esc(p[1]) + '</text>'; }).join('') + '</g>'; };
    var axisBottom = function (pairs, hh, w, line) {
      return '<g class="plx-chart-axis plx-chart-axis--bottom">' + (line ? '<line class="plx-chart__axis-line" x1="0" x2="' + w + '" y1="' + hh + '" y2="' + hh + '"></line>' : '')
        + pairs.map(function (p) { return '<text class="plx-chart__tick-label plx-chart-axis__tick" x="' + p[0] + '" y="' + hh + '">' + esc(p[1]) + '</text>'; }).join('') + '</g>';
    };
    var dataLabel = function (x, y, v, pos) { return '<text class="plx-chart-data-label plx-chart-data-label--' + pos + '" x="' + r1(x) + '" y="' + r1(y) + '">' + v + '</text>'; };
    // a band scale over n categories (paddingInner 0.2, paddingOuter 0.1): [start, thickness] of category i
    var band = function (n, len, i, pi, po) { pi = pi === undefined ? 0.2 : pi; po = po === undefined ? 0.1 : po; var step = len / (n - pi + po * 2); return [step * po + step * i, step * (1 - pi)]; };

    // ---- Bar chart (<BarChart>): bars or columns; grouped, stacked, percent, histogram
    var BC = function (n) { return 'plx-comp-bar-chart-' + n; };
    var TEAMS = ['Design', 'Marketing', 'Sales', 'Support'];
    var SA = [420, 310, 260, 120], SB = [180, 220, 90, 140];
    var BINS = [3, 8, 12, 9, 5, 2];
    DS.registerLab('bar-chart', {
      name: 'Bar chart', title: 'Plenix bar chart', file: 'platform/charts/bar-chart.css', compPrefix: /^plx-comp-(bar-chart|chart)-/,
      store: 'plenix-bar-chart-lab-tokens', sizes: [['horizontal', 'Bar (horizontal)', '.plx-bar-chart'], ['vertical', 'Column (vertical)', '.plx-bar-chart']],
      variants: [['grouped', 'Grouped'], ['stacked', 'Stacked'], ['percent', 'Percent'], ['histogram', 'Histogram (binned)']],
      states: [['default', 'Default']], content: [['bars', 'Bars'], ['values', 'With values']],
      labels: { size: 'Orientation', variant: 'Layout', state: 'State', content: 'Content' },
      defaults: { size: 'horizontal', variant: 'grouped', state: 'default', content: 'bars' },
      props: [
        { id: 'sc', label: 'Line between segments', css: ['stroke'], part: '.plx-bar-chart__bar--joined', cat: 'color' },
        { id: 'sw', label: 'Line between segments: width', css: ['stroke-width'], part: '.plx-bar-chart__bar--joined', cat: 'border-width' },
        { id: 'gc', label: 'Grid line color', css: ['stroke'], part: '.plx-chart__grid-line', cat: 'color' },
        { id: 'gw', label: 'Grid line width', css: ['stroke-width'], part: '.plx-chart__grid-line', cat: 'border-width' },
        { id: 'ac', label: 'Zero line color', css: ['stroke'], part: '.plx-chart__axis-line', cat: 'color' },
        { id: 'aw', label: 'Zero line width', css: ['stroke-width'], part: '.plx-chart__axis-line', cat: 'border-width' },
        { id: 'kc', label: 'Tick label color', css: ['fill'], part: '.plx-chart__tick-label', cat: 'color' },
        { id: 'kf', label: 'Tick label font (data)', css: ['font-family'], part: '.plx-chart__tick-label', cat: 'font' },
        { id: 'ks', label: 'Tick label size', css: ['font-size'], part: '.plx-chart__tick-label', cat: 'font-size' },
        { id: 'lc', label: 'Value label color', css: ['fill'], part: '.plx-chart-data-label', cat: 'color' },
        { id: 'lf', label: 'Value label font (data)', css: ['font-family'], part: '.plx-chart-data-label', cat: 'font' },
        { id: 'ls', label: 'Value label size', css: ['font-size'], part: '.plx-chart-data-label', cat: 'font-size' }
      ],
      token: function (id, size, variant, state, content) {
        if (id === 'sc' || id === 'sw') return variant === 'grouped' ? null : BC(id === 'sc' ? 'separator-color' : 'separator-width');
        var T = { gc: 'grid-line-color', gw: 'grid-line-width', ac: 'axis-line-color', aw: 'axis-line-width', kc: 'tick-label-text', kf: 'tick-label-font-family', ks: 'tick-label-font-size' };
        if (T[id]) return CH(T[id]);
        var D = { lc: 'data-label-text', lf: 'data-label-font-family', ls: 'data-label-font-size' };
        if (D[id]) return content === 'values' ? CH(D[id]) : null;
        return null;
      },
      reach: function () { return 'every bar chart'; }, every: 'every bar chart',
      html: function (variant, size, state, extraCls, ui) {
        var across = size === 'horizontal', vals = ui && ui.content === 'values', hist = variant === 'histogram';
        var L = across ? 80 : 40, T = vals && !across ? 24 : 8, IW = 360 - L - (vals && across ? 40 : 8), IH = 208 - (T - 8);
        var top = hist ? 12 : variant === 'stacked' ? 600 : variant === 'percent' ? 1 : 500;
        var ticks = hist ? [0, 4, 8, 12] : variant === 'stacked' ? [0, 200, 400, 600] : variant === 'percent' ? [0, 0.25, 0.5, 0.75, 1] : [0, 100, 200, 300, 400, 500];
        var tick = function (v) { return variant === 'percent' ? Math.round(v * 100) + '%' : String(v); };
        var V = across ? IW : IH, C = across ? IH : IW;
        var at = function (v) { return across ? r1(v / top * IW) : r1(IH - v / top * IH); };
        var rect = function (start, thick, a, b, color, joined) {
          var p0 = at(a), p1 = at(b), lo = Math.min(p0, p1), len = r1(Math.abs(p1 - p0));
          var g = across ? 'x="' + lo + '" y="' + r1(start) + '" width="' + len + '" height="' + r1(thick) + '"' : 'x="' + r1(start) + '" y="' + lo + '" width="' + r1(thick) + '" height="' + len + '"';
          return '<rect class="plx-chart__mark plx-bar-chart__bar' + (joined ? ' plx-bar-chart__bar--joined' : '') + '" data-plx-dataviz="' + color + '" ' + g + '></rect>';
        };
        var marks = '', labels = '', cats;
        if (hist) {
          var step = C / BINS.length;
          BINS.forEach(function (n, i) { marks += rect(step * i, step, 0, n, 'categorical-1', true); if (vals) labels += dataLabel(across ? at(n) : step * i + step / 2, across ? step * i + step / 2 : at(n), n, across ? 'end' : 'top'); });
          cats = [0, 10, 20, 30, 40, 50, 60].map(function (e, i) { return [r1(step * i), String(e)]; });
        } else {
          TEAMS.forEach(function (t, i) {
            var b = band(TEAMS.length, C, i);
            if (variant === 'grouped') {
              var half = b[1] * 0.45;
              marks += rect(b[0], half, 0, SA[i], 'categorical-1') + rect(b[0] + b[1] * 0.55, half, 0, SB[i], 'categorical-2');
              if (vals) { labels += dataLabel(across ? at(SA[i]) : b[0] + half / 2, across ? b[0] + half / 2 : at(SA[i]), SA[i], across ? 'end' : 'top') + dataLabel(across ? at(SB[i]) : b[0] + b[1] * 0.55 + half / 2, across ? b[0] + b[1] * 0.55 + half / 2 : at(SB[i]), SB[i], across ? 'end' : 'top'); }
            } else {
              var tot = SA[i] + SB[i], a = variant === 'percent' ? SA[i] / tot : SA[i], bb = variant === 'percent' ? 1 : tot;
              marks += rect(b[0], b[1], 0, a, 'categorical-1', true) + rect(b[0], b[1], a, bb, 'categorical-2', true);
              if (vals) labels += variant === 'percent' ? dataLabel(across ? at(a / 2) : b[0] + b[1] / 2, across ? b[0] + b[1] / 2 : at(a / 2), Math.round(a * 100) + '%', 'center')
                : dataLabel(across ? at(tot) : b[0] + b[1] / 2, across ? b[0] + b[1] / 2 : at(tot), tot, across ? 'end' : 'top');
            }
          });
          cats = TEAMS.map(function (t, i) { var b = band(TEAMS.length, C, i); return [r1(b[0] + b[1] / 2), t]; });
        }
        var grid = across ? gridV(ticks.map(at), IH) : gridH(ticks.map(at), IW);
        var zero = across ? '<line class="plx-chart__axis-line" x1="0" x2="0" y1="0" y2="' + IH + '"></line>' : '<line class="plx-chart__axis-line" x1="0" x2="' + IW + '" y1="' + IH + '" y2="' + IH + '"></line>';
        var valueAxis = across ? axisBottom(ticks.map(function (v) { return [at(v), tick(v)]; }), IH, IW) : axisLeft(ticks.map(function (v) { return [at(v), tick(v)]; }));
        var catAxis = across ? axisLeft(cats) : axisBottom(cats, IH, IW);
        var key = hist ? '' : legend([['Images', 'categorical-1'], ['Videos', 'categorical-2']]);
        return fig('plx-bar-chart plx-bar-chart--' + size + ' plx-bar-chart--' + variant, extraCls, hist ? 'File sizes' : 'Storage by team', hist ? 'Most files are under 30 MB.' : 'Design uses the most storage.', grid + marks + zero + labels + valueAxis + catAxis, L, T, key);
      },
      labelSelector: '.plx-chart__title',
      parts: { sc: 'A', sw: 'A', gc: 'B', gw: 'B', ac: 'C', aw: 'C', kc: 'D', kf: 'D', ks: 'D', lc: 'E', lf: 'E', ls: 'E' },
      anchors: { A: { part: '.plx-bar-chart__bar', side: 'top' }, B: { part: '.plx-chart__grid-line', side: 'top' }, C: { part: '.plx-chart__axis-line', side: 'left' }, D: { part: '.plx-chart__tick-label', side: 'left' }, E: { part: '.plx-chart-data-label', side: 'right' } },
      sections: [['Bars', ['sc', 'sw']], ['Grid and axes', ['gc', 'gw', 'ac', 'aw', 'kc', 'kf', 'ks']], ['Value labels', ['lc', 'lf', 'ls']]],
      matrixLabel: 'Bar chart values by orientation and layout', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Layouts · ' + HEAD
    });

    // ---- Combo chart (<ComboChart>): columns and a line, on one axis or two
    var CC = function (n) { return 'plx-comp-combo-chart-' + n; };
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    var UP = [320, 360, 410, 380, 450, 520], TARGET = [340, 350, 360, 380, 400, 420], RATE = [0.86, 0.88, 0.91, 0.89, 0.92, 0.9];
    DS.registerLab('combo-chart', {
      name: 'Combo chart', title: 'Plenix combo chart', file: 'platform/charts/combo-chart.css', compPrefix: /^plx-comp-(combo-chart|chart)-/,
      store: 'plenix-combo-chart-lab-tokens', sizes: [['default', 'Default', '.plx-combo-chart']],
      variants: [['shared', 'Bar + line'], ['dual', 'Two axes']],
      states: [['default', 'Default']], content: [['points', 'With points']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'dual', state: 'default', content: 'points' },
      props: [
        { id: 'lg', label: 'Space between the legends', css: ['column-gap'], part: '.plx-combo-chart__legend', cat: 'space' },
        { id: 'lr', label: 'Space between legend lines', css: ['row-gap'], part: '.plx-combo-chart__legend', cat: 'space' },
        { id: 'pr', label: 'Point radius', css: ['r'], part: '.plx-combo-chart__point', cat: 'icon' },
        { id: 'pc', label: 'Point ring color', css: ['stroke'], part: '.plx-combo-chart__point', cat: 'color' },
        { id: 'pw', label: 'Point ring width', css: ['stroke-width'], part: '.plx-combo-chart__point', cat: 'border-width' },
        { id: 'lw', label: 'Line width', css: ['stroke-width'], part: '.plx-combo-chart__line', cat: 'border-width' },
        { id: 'gc', label: 'Grid line color', css: ['stroke'], part: '.plx-chart__grid-line', cat: 'color' },
        { id: 'kc', label: 'Tick label color', css: ['fill'], part: '.plx-chart__tick-label', cat: 'color' },
        { id: 'kf', label: 'Tick label font (data)', css: ['font-family'], part: '.plx-chart__tick-label', cat: 'font' }
      ],
      token: function (id) {
        var T = { lg: CC('legend-gap'), lr: CC('legend-row-gap'), pr: CC('point-radius'), pc: CH('point-outline'), pw: CH('point-outline-width'), lw: CH('line-width'), gc: CH('grid-line-color'), kc: CH('tick-label-text'), kf: CH('tick-label-font-family') };
        return T[id] || null;
      },
      reach: function () { return 'every combo chart'; }, every: 'every combo chart',
      html: function (variant, size, state, extraCls) {
        var dual = variant === 'dual', L = 40, R = dual ? 48 : 8, T = 8, IW = 360 - L - R, IH = 208;
        var yb = function (v) { return r1(IH - v / 600 * IH); };
        var yl = dual ? function (v) { return r1(IH - (v - 0.8) / 0.15 * IH); } : yb;
        var line = dual ? RATE : TARGET;
        var mid = function (i) { var b = band(6, IW, i); return b[0] + b[1] / 2; };
        var cols = UP.map(function (v, i) { var b = band(6, IW, i); return '<rect class="plx-chart__mark plx-combo-chart__bar" data-plx-dataviz="categorical-1" x="' + r1(b[0]) + '" y="' + yb(v) + '" width="' + r1(b[1]) + '" height="' + r1(IH - yb(v)) + '"></rect>'; }).join('');
        var path = '<path class="plx-chart__line plx-combo-chart__line" data-plx-dataviz="categorical-2" d="' + line.map(function (v, i) { return (i ? 'L' : 'M') + r1(mid(i)) + ',' + yl(v); }).join('') + '"></path>';
        var pts = line.map(function (v, i) { return '<circle class="plx-chart__point plx-combo-chart__point" data-plx-dataviz="categorical-2" cx="' + r1(mid(i)) + '" cy="' + yl(v) + '"></circle>'; }).join('');
        var ticks = [0, 200, 400, 600];
        var axes = axisLeft(ticks.map(function (v) { return [yb(v), String(v)]; })) + (dual ? axisRight([0.8, 0.85, 0.9, 0.95].map(function (v) { return [yl(v), Math.round(v * 100) + '%']; }), IW) : '')
          + axisBottom(MONTHS.map(function (m, i) { return [r1(mid(i)), m]; }), IH, IW);
        var key = '<div class="plx-chart__legend plx-chart__legend--bottom"><div class="plx-combo-chart__legend">' + legendList([['Uploads', 'categorical-1']]) + legendList([[dual ? 'Approval rate' : 'Target', 'categorical-2']], 'line') + '</div></div>';
        return fig('plx-combo-chart' + (dual ? ' plx-combo-chart--dual' : ''), extraCls, dual ? 'Uploads and approval rate' : 'Uploads against target', dual ? 'The approval rate held near 90%.' : 'Uploads beat the target from April.',
          gridH(ticks.map(yb), IW) + cols + '<line class="plx-chart__axis-line" x1="0" x2="' + IW + '" y1="' + IH + '" y2="' + IH + '"></line>' + path + pts + axes, L, T, key);
      },
      labelSelector: '.plx-chart__title',
      parts: { lg: 'A', lr: 'A', pr: 'B', pc: 'B', pw: 'B', lw: 'C', gc: 'D', kc: 'E', kf: 'E' },
      anchors: { A: { part: '.plx-combo-chart__legend', side: 'left' }, B: { part: '.plx-combo-chart__point', side: 'top' }, C: { part: '.plx-combo-chart__line', side: 'top' }, D: { part: '.plx-chart__grid-line', side: 'top' }, E: { part: '.plx-chart__tick-label', side: 'left' } },
      sections: [['Legends', ['lg', 'lr']], ['Line and points', ['pr', 'pc', 'pw', 'lw']], ['Grid and axes', ['gc', 'kc', 'kf']]],
      matrixLabel: 'Combo chart values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Pie chart (<PieChart>): pie, donut, with a center value, half
    var PC = function (n) { return 'plx-comp-pie-chart-' + n; };
    var SHARES = [['Videos', 0.56, 'categorical-1'], ['Images', 0.27, 'categorical-2'], ['Documents', 0.12, 'categorical-3'], ['Audio', 0.05, 'categorical-4']];
    var pt = function (cx, cy, r, a) { return r1(cx + r * Math.sin(a)) + ',' + r1(cy - r * Math.cos(a)); };
    var arc = function (cx, cy, ri, ro, a0, a1) {
      var large = a1 - a0 > Math.PI ? 1 : 0;
      if (!ri) return 'M' + cx + ',' + cy + 'L' + pt(cx, cy, ro, a0) + 'A' + ro + ',' + ro + ' 0 ' + large + ' 1 ' + pt(cx, cy, ro, a1) + 'Z';
      return 'M' + pt(cx, cy, ro, a0) + 'A' + ro + ',' + ro + ' 0 ' + large + ' 1 ' + pt(cx, cy, ro, a1) + 'L' + pt(cx, cy, ri, a1) + 'A' + ri + ',' + ri + ' 0 ' + large + ' 0 ' + pt(cx, cy, ri, a0) + 'Z';
    };
    DS.registerLab('pie-chart', {
      name: 'Pie chart', title: 'Plenix pie chart', file: 'platform/charts/pie-chart.css', compPrefix: /^plx-comp-pie-chart-/,
      store: 'plenix-pie-chart-lab-tokens', sizes: [['md', 'Medium (default)', '.plx-pie-chart']],
      variants: [['pie', 'Pie'], ['donut', 'Donut'], ['center', 'With center value'], ['half', 'Half']],
      states: [['default', 'Default']], content: [['legend', 'With its legend']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'donut', state: 'default', content: 'legend' },
      props: [
        { id: 'oc', label: 'Line between slices', css: ['stroke'], part: '.plx-pie-chart__slice', cat: 'color' },
        { id: 'ow', label: 'Line between slices: width', css: ['stroke-width'], part: '.plx-pie-chart__slice', cat: 'border-width' },
        { id: 'vc', label: 'Center value color', css: ['fill'], part: '.plx-pie-chart__center-value', cat: 'color' },
        { id: 'vf', label: 'Center value font (data)', css: ['font-family'], part: '.plx-pie-chart__center-value', cat: 'font' },
        { id: 'vs', label: 'Center value size', css: ['font-size'], part: '.plx-pie-chart__center-value', cat: 'font-size' },
        { id: 'vw', label: 'Center value weight', css: ['font-weight'], part: '.plx-pie-chart__center-value', cat: 'font-weight' },
        { id: 'lc', label: 'Center label color', css: ['fill'], part: '.plx-pie-chart__center-label', cat: 'color' },
        { id: 'lf', label: 'Center label font', css: ['font-family'], part: '.plx-pie-chart__center-label', cat: 'font' },
        { id: 'ls', label: 'Center label size', css: ['font-size'], part: '.plx-pie-chart__center-label', cat: 'font-size' }
      ],
      token: function (id, size, variant) {
        if (id === 'oc') return PC('slice-outline-color'); if (id === 'ow') return PC('slice-outline-width');
        if (variant === 'pie') return null;
        var T = { vc: 'center-value-text', vf: 'center-value-font-family', vs: 'center-value-font-size', vw: 'center-value-font-weight', lc: 'center-label-text', lf: 'center-label-font-family', ls: 'center-label-font-size' };
        return T[id] ? PC(T[id]) : null;
      },
      reach: function () { return 'every pie and donut chart'; }, every: 'every pie and donut chart',
      html: function (variant, size, state, extraCls) {
        var half = variant === 'half', IW = 344, IH = 224;
        var ro = half ? Math.min(IW / 2, IH) : Math.min(IW, IH) / 2, ri = variant === 'pie' ? 0 : r1(ro * 0.6);
        var cx = IW / 2, cy = half ? IH : IH / 2, from = half ? -Math.PI / 2 : 0, sweep = half ? Math.PI : Math.PI * 2;
        var parts = half ? [['Used', 0.72, 'categorical-1'], ['Free', 0.28, 'categorical-6']] : SHARES;
        var a = from, slices = parts.map(function (p) { var a0 = a; a += p[1] * sweep; return '<path class="plx-chart__mark plx-pie-chart__slice" data-plx-dataviz="' + p[2] + '" d="' + arc(cx, cy, ri, r1(ro), a0, a) + '"></path>'; }).join('');
        var center = variant === 'pie' ? '' : '<g class="plx-pie-chart__center"><text class="plx-pie-chart__center-value" x="' + cx + '" y="' + cy + '">' + (half ? '72%' : variant === 'center' ? '56%' : '985 GB') + '</text><text class="plx-pie-chart__center-label" x="' + cx + '" y="' + cy + '">' + (half ? 'of 1 TB' : variant === 'center' ? 'Videos' : 'Total') + '</text></g>';
        var key = legend(parts.map(function (p) { return [p[0], p[2], Math.round(p[1] * 100) + '%']; }));
        return fig('plx-pie-chart plx-pie-chart--' + (variant === 'center' ? 'donut' : variant), extraCls, half ? 'Quota used' : 'Storage by file type', half ? '72% of the 1 TB quota is used.' : 'Videos take more than half of the storage.', slices + center, 8, 8, key);
      },
      labelSelector: '.plx-chart__title',
      parts: { oc: 'A', ow: 'A', vc: 'B', vf: 'B', vs: 'B', vw: 'B', lc: 'C', lf: 'C', ls: 'C' },
      anchors: { A: { part: '.plx-pie-chart__slice', side: 'top' }, B: { part: '.plx-pie-chart__center-value', side: 'right' }, C: { part: '.plx-pie-chart__center-label', side: 'bottom' } },
      sections: [['Slices', ['oc', 'ow']], ['Center', ['vc', 'vf', 'vs', 'vw', 'lc', 'lf', 'ls']]],
      matrixLabel: 'Pie chart values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Bullet chart (<BulletChart>): ranges, value bar and target, horizontal or vertical
    var BU = function (n) { return 'plx-comp-bullet-chart-' + n; };
    var KPIS = [['Uploads', 820, 750, [400, 700, 1000]], ['Reviews', 610, 600, [300, 550, 1000]], ['Approvals', 420, 560, [350, 600, 1000]]];
    DS.registerLab('bullet-chart', {
      name: 'Bullet chart', title: 'Plenix bullet chart', file: 'platform/charts/bullet-chart.css', compPrefix: /^plx-comp-(bullet-chart|chart)-/,
      store: 'plenix-bullet-chart-lab-tokens', sizes: [['horizontal', 'Horizontal', '.plx-bullet-chart'], ['vertical', 'Vertical', '.plx-bullet-chart']],
      variants: [['default', 'Three measures']],
      states: [['default', 'Default']], content: [['ranges', 'Three ranges and a target']],
      labels: { size: 'Orientation', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'horizontal', variant: 'default', state: 'default', content: 'ranges' },
      props: [
        { id: 'rp', label: 'Range: poor', css: ['fill'], part: '.plx-bullet-chart__range--1', cat: 'color' },
        { id: 'rf', label: 'Range: fair', css: ['fill'], part: '.plx-bullet-chart__range--2', cat: 'color' },
        { id: 'rg', label: 'Range: good', css: ['fill'], part: '.plx-bullet-chart__range--3', cat: 'color' },
        { id: 'tc', label: 'Target line color', css: ['stroke'], part: '.plx-bullet-chart__target', cat: 'color' },
        { id: 'tw', label: 'Target line width', css: ['stroke-width'], part: '.plx-bullet-chart__target', cat: 'border-width' },
        { id: 'mc', label: 'Value bar color', css: ['fill'], part: '.plx-bullet-chart__value', cat: 'color' },
        { id: 'kc', label: 'Tick label color', css: ['fill'], part: '.plx-chart__tick-label', cat: 'color' },
        { id: 'kf', label: 'Tick label font (data)', css: ['font-family'], part: '.plx-chart__tick-label', cat: 'font' }
      ],
      token: function (id) {
        var T = { rp: BU('range-poor-background'), rf: BU('range-fair-background'), rg: BU('range-good-background'), tc: BU('target-color'), tw: BU('target-width'), mc: CH('mark-default-color'), kc: CH('tick-label-text'), kf: CH('tick-label-font-family') };
        return T[id] || null;
      },
      reach: function () { return 'every bullet chart'; }, every: 'every bullet chart',
      html: function (variant, size, state, extraCls) {
        var across = size === 'horizontal', L = across ? 72 : 40, IW = 360 - L - 8, IH = 208;
        var C = across ? IH : IW, at = function (v) { return across ? r1(v / 1000 * IW) : r1(IH - v / 1000 * IH); };
        var span = function (s, th, a, b) { var p0 = at(a), p1 = at(b), lo = Math.min(p0, p1), len = r1(Math.abs(p1 - p0)); return across ? 'x="' + lo + '" y="' + r1(s) + '" width="' + len + '" height="' + r1(th) + '"' : 'x="' + r1(s) + '" y="' + lo + '" width="' + r1(th) + '" height="' + len + '"'; };
        var rows = KPIS.map(function (k, i) {
          var b = band(KPIS.length, C, i, 0.4, 0.2), s = b[0], th = b[1], bar = th / 3, tl = th * 2 / 3, tp = at(k[2]);
          return '<g class="plx-bullet-chart__item">' + [2, 1, 0].map(function (j) { return '<rect class="plx-bullet-chart__range plx-bullet-chart__range--' + (j + 1) + '" ' + span(s, th, 0, k[3][j]) + '></rect>'; }).join('')
            + '<rect class="plx-chart__mark plx-bullet-chart__value" ' + span(s + (th - bar) / 2, bar, 0, k[1]) + '></rect>'
            + (across ? '<line class="plx-bullet-chart__target" x1="' + tp + '" x2="' + tp + '" y1="' + r1(s + (th - tl) / 2) + '" y2="' + r1(s + (th + tl) / 2) + '"></line>'
              : '<line class="plx-bullet-chart__target" x1="' + r1(s + (th - tl) / 2) + '" x2="' + r1(s + (th + tl) / 2) + '" y1="' + tp + '" y2="' + tp + '"></line>') + '</g>';
        }).join('');
        var ticks = [0, 200, 400, 600, 800, 1000].map(function (v) { return [at(v), String(v)]; });
        var names = KPIS.map(function (k, i) { var b = band(KPIS.length, C, i, 0.4, 0.2); return [r1(b[0] + b[1] / 2), k[0]]; });
        var axes = across ? axisBottom(ticks, IH, IW, true) + axisLeft(names) : axisLeft(ticks) + axisBottom(names, IH, IW);
        return fig('plx-bullet-chart plx-bullet-chart--' + size, extraCls, 'Quarter against targets', 'Uploads and reviews beat their targets; approvals are behind.', rows + axes, L, 8);
      },
      labelSelector: '.plx-chart__title',
      parts: { rp: 'A', rf: 'A', rg: 'A', tc: 'B', tw: 'B', mc: 'C', kc: 'D', kf: 'D' },
      anchors: { A: { part: '.plx-bullet-chart__range--3', side: 'top' }, B: { part: '.plx-bullet-chart__target', side: 'top' }, C: { part: '.plx-bullet-chart__value', side: 'bottom' }, D: { part: '.plx-chart__tick-label', side: 'left' } },
      sections: [['Ranges', ['rp', 'rf', 'rg']], ['Value and target', ['mc', 'tc', 'tw']], ['Axes', ['kc', 'kf']]],
      matrixLabel: 'Bullet chart values by orientation', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Orientations · ' + HEAD
    });

    // ---- Box plot (<BoxPlot>): boxes, medians, whiskers, outliers
    var BP = function (n) { return 'plx-comp-box-plot-' + n; };
    var STATS = [['Design', 4, 7.5, 9.5, 14.5, 18, [30, 34]], ['Legal', 8, 10.3, 12.5, 14.8, 16, []], ['Brand', 2, 3.5, 5, 7.5, 9, [21]], ['Web', 5, 6.3, 8.5, 9.8, 12, []]];
    DS.registerLab('box-plot', {
      name: 'Box plot', title: 'Plenix box plot', file: 'platform/charts/box-plot.css', compPrefix: /^plx-comp-(box-plot|chart)-/,
      store: 'plenix-box-plot-lab-tokens', sizes: [['vertical', 'Vertical', '.plx-box-plot'], ['horizontal', 'Horizontal', '.plx-box-plot']],
      variants: [['plain', 'Without outliers'], ['outliers', 'With outliers']],
      states: [['default', 'Default']], content: [['groups', 'Four groups']],
      labels: { size: 'Orientation', variant: 'Outliers', state: 'State', content: 'Content' },
      defaults: { size: 'vertical', variant: 'outliers', state: 'default', content: 'groups' },
      props: [
        { id: 'mc', label: 'Box color', css: ['fill'], part: '.plx-box-plot__box', cat: 'color' },
        { id: 'wc', label: 'Whisker color', css: ['stroke'], part: '.plx-box-plot__whisker', cat: 'color' },
        { id: 'ww', label: 'Whisker width', css: ['stroke-width'], part: '.plx-box-plot__whisker', cat: 'border-width' },
        { id: 'dc', label: 'Median line color', css: ['stroke'], part: '.plx-box-plot__median', cat: 'color' },
        { id: 'dw', label: 'Median line width', css: ['stroke-width'], part: '.plx-box-plot__median', cat: 'border-width' },
        { id: 'or', label: 'Outlier radius', css: ['r'], part: '.plx-box-plot__outlier', cat: 'icon' },
        { id: 'oc', label: 'Outlier ring color', css: ['stroke'], part: '.plx-box-plot__outlier', cat: 'color' },
        { id: 'gc', label: 'Grid line color', css: ['stroke'], part: '.plx-chart__grid-line', cat: 'color' },
        { id: 'kc', label: 'Tick label color', css: ['fill'], part: '.plx-chart__tick-label', cat: 'color' }
      ],
      token: function (id, size, variant) {
        var T = { mc: CH('mark-default-color'), wc: BP('whisker-color'), ww: BP('whisker-width'), dc: BP('median-color'), dw: BP('median-width'), gc: CH('grid-line-color'), kc: CH('tick-label-text') };
        if (T[id]) return T[id];
        if (id === 'or') return variant === 'outliers' ? BP('outlier-radius') : null;
        if (id === 'oc') return variant === 'outliers' ? CH('point-outline') : null;
        return null;
      },
      reach: function () { return 'every box plot'; }, every: 'every box plot',
      html: function (variant, size, state, extraCls) {
        var across = size === 'horizontal', L = across ? 56 : 40, IW = 360 - L - 8, IH = 208;
        var C = across ? IH : IW, at = function (v) { return across ? r1(v / 40 * IW) : r1(IH - v / 40 * IH); };
        var seg = function (p0, p1, a, b) { return across ? 'x1="' + at(a) + '" x2="' + at(b) + '" y1="' + r1(p0) + '" y2="' + r1(p1) + '"' : 'x1="' + r1(p0) + '" x2="' + r1(p1) + '" y1="' + at(a) + '" y2="' + at(b) + '"'; };
        var groups = STATS.map(function (g, i) {
          var b = band(STATS.length, C, i, 0.4, 0.2), s = b[0], th = b[1], mid = s + th / 2, cap = th / 2;
          var q1 = at(g[2]), q3 = at(g[4]);
          var boxA = across ? 'x="' + Math.min(q1, q3) + '" y="' + r1(s) + '" width="' + r1(Math.abs(q3 - q1)) + '" height="' + r1(th) + '"' : 'x="' + r1(s) + '" y="' + Math.min(q1, q3) + '" width="' + r1(th) + '" height="' + r1(Math.abs(q3 - q1)) + '"';
          return '<g class="plx-box-plot__group"><line class="plx-box-plot__whisker" ' + seg(mid, mid, g[1], g[2]) + '></line><line class="plx-box-plot__whisker" ' + seg(mid, mid, g[4], g[5]) + '></line>'
            + '<line class="plx-box-plot__whisker plx-box-plot__cap" ' + seg(mid - cap / 2, mid + cap / 2, g[1], g[1]) + '></line><line class="plx-box-plot__whisker plx-box-plot__cap" ' + seg(mid - cap / 2, mid + cap / 2, g[5], g[5]) + '></line>'
            + '<rect class="plx-chart__mark plx-box-plot__box" ' + boxA + '></rect><line class="plx-box-plot__median" ' + seg(s, s + th, g[3], g[3]) + '></line>'
            + (variant === 'outliers' ? g[6].map(function (v) { return '<circle class="plx-chart__point plx-box-plot__outlier" cx="' + (across ? at(v) : r1(mid)) + '" cy="' + (across ? r1(mid) : at(v)) + '"></circle>'; }).join('') : '') + '</g>';
        }).join('');
        var ticks = [0, 10, 20, 30, 40];
        var names = STATS.map(function (g, i) { var b = band(STATS.length, C, i, 0.4, 0.2); return [r1(b[0] + b[1] / 2), g[0]]; });
        var grid = across ? gridV(ticks.map(at), IH) : gridH(ticks.map(at), IW);
        var axes = across ? axisBottom(ticks.map(function (v) { return [at(v), String(v)]; }), IH, IW, true) + axisLeft(names) : axisLeft(ticks.map(function (v) { return [at(v), String(v)]; })) + axisBottom(names, IH, IW, true);
        return fig('plx-box-plot plx-box-plot--' + size, extraCls, 'Review time by team', 'Legal reviews are steady; Design varies most.', grid + groups + axes, L, 8);
      },
      labelSelector: '.plx-chart__title',
      parts: { mc: 'A', wc: 'B', ww: 'B', dc: 'C', dw: 'C', or: 'D', oc: 'D', gc: 'E', kc: 'F' },
      anchors: { A: { part: '.plx-box-plot__box', side: 'right' }, B: { part: '.plx-box-plot__cap', side: 'top' }, C: { part: '.plx-box-plot__median', side: 'left' }, D: { part: '.plx-box-plot__outlier', side: 'right' }, E: { part: '.plx-chart__grid-line', side: 'top' }, F: { part: '.plx-chart__tick-label', side: 'left' } },
      sections: [['Box and whiskers', ['mc', 'wc', 'ww', 'dc', 'dw']], ['Outliers', ['or', 'oc']], ['Grid and axes', ['gc', 'kc']]],
      matrixLabel: 'Box plot values by orientation', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Outliers · ' + HEAD
    });

    // ---- Radar chart (<RadarChart>): one item or two compared
    var RC = function (n) { return 'plx-comp-radar-chart-' + n; };
    var AX = ['Resolution', 'Color', 'Metadata', 'File size', 'Rights', 'Alt text'];
    var HERO = [9, 8, 7, 4, 9, 6], BANNER = [6, 7, 9, 8, 5, 9];
    DS.registerLab('radar-chart', {
      name: 'Radar chart', title: 'Plenix radar chart', file: 'platform/charts/radar-chart.css', compPrefix: /^plx-comp-(radar-chart|chart)-/,
      store: 'plenix-radar-chart-lab-tokens', sizes: [['md', 'Medium', '.plx-radar-chart']],
      variants: [['single', 'Single'], ['compare', 'Compare']],
      states: [['default', 'Default']], content: [['scores', 'Scores out of 10']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'compare', state: 'default', content: 'scores' },
      props: [
        { id: 'ao', label: 'Area opacity', css: ['fill-opacity'], part: '.plx-radar-chart__area', cat: 'opacity' },
        { id: 'lw', label: 'Outline width', css: ['stroke-width'], part: '.plx-radar-chart__area', cat: 'border-width' },
        { id: 'pr', label: 'Point radius', css: ['r'], part: '.plx-radar-chart__point', cat: 'icon' },
        { id: 'gc', label: 'Spoke and ring color', css: ['stroke'], part: '.plx-chart__grid-line', cat: 'color' },
        { id: 'nc', label: 'Measure name color', css: ['fill'], part: '.plx-radar-chart__axis-label', cat: 'color' },
        { id: 'nf', label: 'Measure name font', css: ['font-family'], part: '.plx-radar-chart__axis-label', cat: 'font' },
        { id: 'ns', label: 'Measure name size', css: ['font-size'], part: '.plx-radar-chart__axis-label', cat: 'font-size' },
        { id: 'nw', label: 'Measure name weight', css: ['font-weight'], part: '.plx-radar-chart__axis-label', cat: 'font-weight' },
        { id: 'kc', label: 'Ring value color', css: ['fill'], part: '.plx-chart__tick-label', cat: 'color' }
      ],
      token: function (id) {
        var T = { ao: RC('area-opacity'), lw: CH('line-width'), pr: RC('point-radius'), gc: CH('grid-line-color'), nc: RC('axis-label-text'), nf: RC('axis-label-font-family'), ns: RC('axis-label-font-size'), nw: RC('axis-label-font-weight'), kc: CH('tick-label-text') };
        return T[id] || null;
      },
      reach: function () { return 'every radar chart'; }, every: 'every radar chart',
      html: function (variant, size, state, extraCls) {
        var L = 80, IW = 200, IH = 176, cx = IW / 2, cy = IH / 2, R = 88, n = AX.length;
        var at = function (i, v) { var a = Math.PI * 2 * i / n; return [r1(cx + R * v / 10 * Math.sin(a)), r1(cy - R * v / 10 * Math.cos(a))]; };
        var poly = function (vals) { return vals.map(function (v, i) { return at(i, v).join(','); }).join(' '); };
        var web = [2.5, 5, 7.5, 10].map(function (v) { return '<polygon class="plx-chart__grid-line plx-radar-chart__ring" points="' + poly(AX.map(function () { return v; })) + '"></polygon>'; }).join('')
          + AX.map(function (a, i) { var p = at(i, 10); return '<line class="plx-chart__grid-line plx-radar-chart__spoke" x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '"></line>'; }).join('');
        var items = variant === 'compare' ? [[HERO, 'categorical-1'], [BANNER, 'categorical-2']] : [[HERO, 'categorical-1']];
        var shapes = items.map(function (it) { return '<polygon class="plx-chart__line plx-radar-chart__area" data-plx-dataviz="' + it[1] + '" points="' + poly(it[0]) + '"></polygon>'; }).join('')
          + items.map(function (it) { return it[0].map(function (v, i) { var p = at(i, v); return '<circle class="plx-chart__point plx-radar-chart__point" data-plx-dataviz="' + it[1] + '" cx="' + p[0] + '" cy="' + p[1] + '"></circle>'; }).join(''); }).join('');
        var rings = [2.5, 5, 7.5, 10].map(function (v) { return '<text class="plx-chart__tick-label plx-radar-chart__ring-label" x="' + cx + '" y="' + r1(cy - R * v / 10) + '">' + v + '</text>'; }).join('');
        var names = AX.map(function (a, i) {
          var ang = Math.PI * 2 * i / n, s = Math.sin(ang), c = Math.cos(ang), p = at(i, 10);
          var hz = Math.abs(s) < 0.2 ? 'middle' : s > 0 ? 'start' : 'end', vt = c > 0.8 ? 'above' : c < -0.8 ? 'below' : 'beside';
          return '<text class="plx-radar-chart__axis-label plx-radar-chart__axis-label--' + hz + ' plx-radar-chart__axis-label--' + vt + '" x="' + p[0] + '" y="' + p[1] + '">' + a + '</text>';
        }).join('');
        var key = variant === 'compare' ? legend([['Hero image', 'categorical-1'], ['Banner', 'categorical-2']]) : '';
        return fig('plx-radar-chart' + (variant === 'compare' ? ' plx-radar-chart--compare' : ''), extraCls, 'Asset quality', 'Scores out of 10 on six measures.', web + shapes + rings + names, L, 32, key);
      },
      labelSelector: '.plx-chart__title',
      parts: { ao: 'A', lw: 'A', pr: 'B', gc: 'C', nc: 'D', nf: 'D', ns: 'D', nw: 'D', kc: 'E' },
      anchors: { A: { part: '.plx-radar-chart__area', side: 'right' }, B: { part: '.plx-radar-chart__point', side: 'top' }, C: { part: '.plx-radar-chart__spoke', side: 'left' }, D: { part: '.plx-radar-chart__axis-label', side: 'top' }, E: { part: '.plx-radar-chart__ring-label', side: 'right' } },
      sections: [['Shapes', ['ao', 'lw', 'pr']], ['Web', ['gc', 'kc']], ['Measure names', ['nc', 'nf', 'ns', 'nw']]],
      matrixLabel: 'Radar chart values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Sankey diagram (<SankeyDiagram>): nodes in columns, bands between them; a band highlighted
    var SK = function (n) { return 'plx-comp-sankey-diagram-' + n; };
    DS.registerLab('sankey-diagram', {
      name: 'Sankey diagram', title: 'Plenix Sankey diagram', file: 'platform/charts/sankey-diagram.css', compPrefix: /^plx-comp-(sankey-diagram|chart)-/,
      store: 'plenix-sankey-diagram-lab-tokens', sizes: [['md', 'Medium', '.plx-sankey-diagram']],
      variants: [['horizontal', 'Horizontal']],
      states: [['default', 'Default']], content: [['flows', 'Flows'], ['active', 'A flow highlighted']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'horizontal', state: 'default', content: 'active' },
      props: [
        { id: 'lo', label: 'Band opacity', css: ['fill-opacity'], part: '.plx-sankey-diagram__link', cat: 'opacity' },
        { id: 'la', label: 'Highlighted band opacity', css: ['fill-opacity'], part: '.plx-sankey-diagram__link.is-active', cat: 'opacity' },
        { id: 'nc', label: 'Name color', css: ['fill'], part: '.plx-sankey-diagram__label', cat: 'color' },
        { id: 'nf', label: 'Name font', css: ['font-family'], part: '.plx-sankey-diagram__label', cat: 'font' },
        { id: 'ns', label: 'Name size', css: ['font-size'], part: '.plx-sankey-diagram__label', cat: 'font-size' },
        { id: 'nw', label: 'Name weight', css: ['font-weight'], part: '.plx-sankey-diagram__name', cat: 'font-weight' },
        { id: 'hc', label: 'Halo color', css: ['stroke'], part: '.plx-sankey-diagram__label', cat: 'color' },
        { id: 'hw', label: 'Halo width', css: ['stroke-width'], part: '.plx-sankey-diagram__label', cat: 'border-width' },
        { id: 'vc', label: 'Total color', css: ['fill'], part: '.plx-sankey-diagram__value', cat: 'color' },
        { id: 'vf', label: 'Total font (data)', css: ['font-family'], part: '.plx-sankey-diagram__value', cat: 'font' },
        { id: 'vw', label: 'Total weight', css: ['font-weight'], part: '.plx-sankey-diagram__value', cat: 'font-weight' }
      ],
      token: function (id, size, variant, state, content) {
        if (id === 'la') return content === 'active' ? SK('link-active-opacity') : null;
        var T = { lo: SK('link-opacity'), nc: SK('label-text'), nf: SK('label-font-family'), ns: SK('label-font-size'), nw: SK('label-font-weight'), hc: SK('label-halo-color'), hw: SK('label-halo-width'), vc: SK('value-text'), vf: SK('value-font-family'), vw: SK('value-font-weight') };
        return T[id] || null;
      },
      reach: function () { return 'every Sankey diagram'; }, every: 'every Sankey diagram',
      html: function (variant, size, state, extraCls, ui) {
        var active = ui && ui.content === 'active', IW = 344, IH = 224, NW = 12, ky = (IH - 12) / 1000;
        // columns: Web 620 and App 380; Review 1000; Approved 740 and Rejected 260
        var N = { web: [0, 0, 620], app: [0, 620 * ky + 12, 380], review: [(IW - NW) / 2, (IH - 1000 * ky) / 2, 1000], ok: [IW - NW, 0, 740], no: [IW - NW, 740 * ky + 12, 260] };
        var NAMES = { web: 'Web', app: 'App', review: 'Review', ok: 'Approved', no: 'Rejected' }, COLORS = { web: 'categorical-1', app: 'categorical-2', review: 'categorical-3', ok: 'categorical-4', no: 'categorical-5' };
        var LINKS = [['web', 'review', 620, 0, 0], ['app', 'review', 380, 0, 620], ['review', 'ok', 740, 0, 0], ['review', 'no', 260, 740, 0]];
        var bandPath = function (l) {
          var s = N[l[0]], t = N[l[1]], w = l[2] * ky, x0 = s[0] + NW, x1 = t[0], xm = (x0 + x1) / 2;
          var y0 = s[1] + l[3] * ky, y1 = t[1] + l[4] * ky;
          return 'M' + r1(x0) + ',' + r1(y0) + 'C' + r1(xm) + ',' + r1(y0) + ' ' + r1(xm) + ',' + r1(y1) + ' ' + r1(x1) + ',' + r1(y1) + 'L' + r1(x1) + ',' + r1(y1 + w) + 'C' + r1(xm) + ',' + r1(y1 + w) + ' ' + r1(xm) + ',' + r1(y0 + w) + ' ' + r1(x0) + ',' + r1(y0 + w) + 'Z';
        };
        var links = LINKS.map(function (l, i) { return '<path class="plx-sankey-diagram__link' + (active && i === 2 ? ' is-active' : '') + '" data-plx-dataviz="' + COLORS[l[0]] + '" d="' + bandPath(l) + '"></path>'; }).join('');
        var nodes = Object.keys(N).map(function (k) { var n = N[k]; return '<rect class="plx-chart__mark plx-sankey-diagram__node" data-plx-dataviz="' + COLORS[k] + '" x="' + r1(n[0]) + '" y="' + r1(n[1]) + '" width="' + NW + '" height="' + r1(n[2] * ky) + '"></rect>'; }).join('');
        var labels = Object.keys(N).map(function (k) {
          var n = N[k], last = k === 'ok' || k === 'no';
          return '<text class="plx-sankey-diagram__label plx-sankey-diagram__label--' + (last ? 'before' : 'after') + '" x="' + r1(last ? n[0] : n[0] + NW) + '" y="' + r1(n[1] + n[2] * ky / 2) + '"><tspan class="plx-sankey-diagram__name">' + NAMES[k] + '</tspan> <tspan class="plx-sankey-diagram__value">' + n[2] + '</tspan></text>';
        }).join('');
        return fig('plx-sankey-diagram', extraCls, 'Where uploads end up', 'Three in four uploads are approved.', '<g class="plx-sankey-diagram__links">' + links + '</g>' + nodes + labels, 8, 8);
      },
      labelSelector: '.plx-chart__title',
      parts: { lo: 'A', la: 'A', nc: 'B', nf: 'B', ns: 'B', nw: 'B', hc: 'B', hw: 'B', vc: 'C', vf: 'C', vw: 'C' },
      anchors: { A: { part: '.plx-sankey-diagram__link', side: 'top' }, B: { part: '.plx-sankey-diagram__name', side: 'top' }, C: { part: '.plx-sankey-diagram__value', side: 'right' } },
      sections: [['Bands', ['lo', 'la']], ['Names', ['nc', 'nf', 'ns', 'nw', 'hc', 'hw']], ['Totals', ['vc', 'vf', 'vw']]],
      matrixLabel: 'Sankey diagram values', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Content · ' + HEAD
    });

    // ---- Timeline visualization (<TimelineChart>): events, ranges, lanes
    var TL = function (n) { return 'plx-comp-timeline-chart-' + n; };
    DS.registerLab('timeline-chart', {
      name: 'Timeline visualization', title: 'Plenix timeline visualization', file: 'platform/charts/timeline-chart.css', compPrefix: /^plx-comp-(timeline-chart|chart)-/,
      store: 'plenix-timeline-chart-lab-tokens', sizes: [['md', 'Medium', '.plx-timeline-chart']],
      variants: [['events', 'Events'], ['ranges', 'Ranges'], ['lanes', 'Lanes']],
      states: [['default', 'Default']], content: [['named', 'Named items']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'lanes', state: 'default', content: 'named' },
      props: [
        { id: 'er', label: 'Event radius', css: ['r'], part: '.plx-timeline-chart__event', cat: 'icon' },
        { id: 'mc', label: 'Range color (no lane color)', css: ['fill'], part: '.plx-timeline-chart__range', cat: 'color' },
        { id: 'nc', label: 'Name color', css: ['fill'], part: '.plx-timeline-chart__label', cat: 'color' },
        { id: 'nf', label: 'Name font', css: ['font-family'], part: '.plx-timeline-chart__label', cat: 'font' },
        { id: 'ns', label: 'Name size', css: ['font-size'], part: '.plx-timeline-chart__label', cat: 'font-size' },
        { id: 'hc', label: 'Halo color', css: ['stroke'], part: '.plx-timeline-chart__label', cat: 'color' },
        { id: 'hw', label: 'Halo width', css: ['stroke-width'], part: '.plx-timeline-chart__label', cat: 'border-width' },
        { id: 'gc', label: 'Grid line color', css: ['stroke'], part: '.plx-chart__grid-line', cat: 'color' },
        { id: 'kc', label: 'Date label color', css: ['fill'], part: '.plx-chart__tick-label', cat: 'color' }
      ],
      token: function (id, size, variant) {
        if (id === 'er') return variant === 'ranges' ? null : TL('event-radius');
        if (id === 'mc') return variant === 'ranges' ? CH('mark-default-color') : null;
        var T = { nc: TL('label-text'), nf: TL('label-font-family'), ns: TL('label-font-size'), hc: TL('label-halo-color'), hw: TL('label-halo-width'), gc: CH('grid-line-color'), kc: CH('tick-label-text') };
        return T[id] || null;
      },
      reach: function () { return 'every timeline visualization'; }, every: 'every timeline visualization',
      html: function (variant, size, state, extraCls) {
        var lanes = variant === 'lanes', L = lanes ? 96 : 8, IW = 360 - L - 8, IH = 208;
        var day = function (d) { return r1((d - 1) / 42 * IW); };   // Sep 1 to Oct 13
        var ticks = [[1, 'Sep 1'], [15, 'Sep 15'], [29, 'Sep 29'], [43, 'Oct 13']];
        var LN = lanes ? [['Launch video', 'categorical-1'], ['Banners', 'categorical-2'], ['Product photos', 'categorical-3']] : [['', 'categorical-1']];
        var th = IH / LN.length, top = function (li) { return r1(th * li + th * 0.45); }, bar = r1(th * 0.4 > 24 ? 24 : th * 0.4);
        var items = variant === 'events' ? [[0, 'Brief', 1], [0, 'First cut', 14], [0, 'Review', 21], [0, 'Approved', 32]]
          : variant === 'ranges' ? [[0, 'Studio', 10, 24], [0, 'Retouch', 28, 39]]
            : [[0, 'Shoot', 7, 16], [0, 'Approved', 32], [1, 'Design', 1, 18], [1, 'Shipped', 22], [2, 'Studio', 10, 24], [2, 'Retouch', 28, 39]];
        var marks = items.map(function (it) {
          var color = variant === 'ranges' ? '' : ' data-plx-dataviz="' + LN[it[0]][1] + '"';
          return it.length === 3 ? '<circle class="plx-chart__point plx-timeline-chart__event"' + color + ' cx="' + day(it[2]) + '" cy="' + r1(top(it[0]) + bar / 2) + '"></circle>'
            : '<rect class="plx-chart__mark plx-timeline-chart__range"' + color + ' x="' + day(it[2]) + '" y="' + top(it[0]) + '" width="' + r1(day(it[3]) - day(it[2])) + '" height="' + bar + '"></rect>';
        }).join('');
        var names = items.map(function (it) { return '<text class="plx-timeline-chart__label' + (it.length === 3 ? ' plx-timeline-chart__label--event' : '') + '" x="' + day(it[2]) + '" y="' + top(it[0]) + '">' + it[1] + '</text>'; }).join('');
        var laneLines = lanes ? [1, 2].map(function (i) { return '<line class="plx-chart__grid-line plx-timeline-chart__lane-line" x1="0" x2="' + IW + '" y1="' + r1(th * i) + '" y2="' + r1(th * i) + '"></line>'; }).join('') : '';
        var axes = axisBottom(ticks.map(function (t) { return [day(t[0]), t[1]]; }), IH, IW, true) + (lanes ? axisLeft(LN.map(function (l, i) { return [r1(th * i + th / 2), l[0]]; })) : '');
        return fig('plx-timeline-chart' + (lanes ? '' : ' plx-timeline-chart--single'), extraCls, 'Campaign assets', 'The banners shipped first; the video was approved last.', gridV(ticks.map(function (t) { return day(t[0]); }), IH) + laneLines + marks + names + axes, L, 8);
      },
      labelSelector: '.plx-chart__title',
      parts: { er: 'A', mc: 'B', nc: 'C', nf: 'C', ns: 'C', hc: 'C', hw: 'C', gc: 'D', kc: 'E' },
      anchors: { A: { part: '.plx-timeline-chart__event', side: 'top' }, B: { part: '.plx-timeline-chart__range', side: 'bottom' }, C: { part: '.plx-timeline-chart__label', side: 'top' }, D: { part: '.plx-chart__grid-line', side: 'top' }, E: { part: '.plx-chart__tick-label', side: 'bottom' } },
      sections: [['Marks', ['er', 'mc']], ['Names', ['nc', 'nf', 'ns', 'hc', 'hw']], ['Grid and axis', ['gc', 'kc']]],
      matrixLabel: 'Timeline values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Comparison view (<ComparisonView>): panes side by side, the matrix's cells, the slider's stage
    var CV = function (n) { return 'plx-comp-comparison-view-' + n; };
    var ATTRS = [['Format', 'JPEG', 'PNG', false], ['Size', '2.4 MB', '3.1 MB', true], ['Width', '1920 px', '1920 px', true], ['Color profile', 'sRGB', 'Display P3', false]];
    var badge = '<span class="plx-badge plx-badge--active plx-badge--sm">' + DS.icon('pencil', 'plx-badge__icon') + 'Changed</span>';
    var value = function (v, data) { return data ? '<span class="plx-comparison-view__data">' + v + '</span>' : v; };
    DS.registerLab('comparison-view', {
      name: 'Comparison view', title: 'Plenix comparison view', file: 'platform/patterns/ComparisonView/comparison-view.css', compPrefix: /^plx-comp-comparison-view-/,
      store: 'plenix-comparison-view-lab-tokens', sizes: [['default', 'Default', '.plx-comparison-view']],
      variants: [['columns', 'Side by side columns'], ['matrix', 'Feature matrix'], ['slider', 'Image slider (before/after)'], ['differences', 'Highlight differences']],
      states: [['default', 'Default'], ['focus', 'Focus (a scrolling pane)']], content: [['plain', 'Two versions'], ['scroll', 'Linked scrolling']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'columns', state: 'default', content: 'plain' },
      props: [
        { id: 'g', label: 'Space under the bar', css: ['row-gap'], cat: 'space' },
        { id: 'bg', label: 'Space between controls', css: ['column-gap'], part: '.plx-comparison-view__bar', cat: 'space' },
        { id: 'br', label: 'Space between bar lines', css: ['row-gap'], part: '.plx-comparison-view__bar', cat: 'space' },
        { id: 'sc', label: 'Count color', css: ['color'], part: '.plx-comparison-view__summary', cat: 'color' },
        { id: 'ss', label: 'Count size', css: ['font-size'], part: '.plx-comparison-view__summary', cat: 'font-size' },
        { id: 'sl', label: 'Count line height', css: ['line-height'], part: '.plx-comparison-view__summary', cat: 'line-height' },
        { id: 'pg', label: 'Space between panes', css: ['column-gap'], part: '.plx-comparison-view__panes', cat: 'space' },
        { id: 'pb', label: 'Pane surface', css: ['background-color'], part: '.plx-comparison-view__pane', cat: 'color' },
        { id: 'pc', label: 'Pane border color', css: ['border-top-color'], part: '.plx-comparison-view__pane', cat: 'color' },
        { id: 'pw', label: 'Pane border width', css: ['border-top-width'], part: '.plx-comparison-view__pane', cat: 'border-width' },
        { id: 'pr', label: 'Pane corners', css: ['border-top-left-radius'], part: '.plx-comparison-view__pane', cat: 'radius' },
        { id: 'hp', label: 'Head padding (top, bottom)', css: ['padding-block-start'], show: 'padding-top', part: '.plx-comparison-view__head', cat: 'space' },
        { id: 'pi', label: 'Pane padding (start, end)', css: ['padding-inline-start'], show: 'padding-left', part: '.plx-comparison-view__head', cat: 'space' },
        { id: 'hg', label: 'Space under the name', css: ['row-gap'], part: '.plx-comparison-view__head', cat: 'space' },
        { id: 'tc', label: 'Name color', css: ['color'], part: '.plx-comparison-view__title', cat: 'color' },
        { id: 'tf', label: 'Name font', css: ['font-family'], part: '.plx-comparison-view__title', cat: 'font' },
        { id: 'ts', label: 'Name size', css: ['font-size'], part: '.plx-comparison-view__title', cat: 'font-size' },
        { id: 'tw', label: 'Name weight', css: ['font-weight'], part: '.plx-comparison-view__title', cat: 'font-weight' },
        { id: 'tl', label: 'Name line height', css: ['line-height'], part: '.plx-comparison-view__title', cat: 'line-height' },
        { id: 'mc', label: 'Version color', css: ['color'], part: '.plx-comparison-view__meta', cat: 'color' },
        { id: 'mf', label: 'Version font (data)', css: ['font-family'], part: '.plx-comparison-view__meta', cat: 'font' },
        { id: 'ms', label: 'Version size', css: ['font-size'], part: '.plx-comparison-view__meta', cat: 'font-size' },
        { id: 'ml', label: 'Version line height', css: ['line-height'], part: '.plx-comparison-view__meta', cat: 'line-height' },
        { id: 'bp', label: 'Body padding (top, bottom)', css: ['padding-block-start'], show: 'padding-top', part: '.plx-comparison-view__body', cat: 'space' },
        { id: 'bd', label: 'Space in the body', css: ['row-gap'], part: '.plx-comparison-view__body', cat: 'space' },
        { id: 'sh', label: 'Scrolling body height', css: ['max-block-size'], show: 'max-height', part: '.plx-comparison-view__body--scroll', cat: 'size' },
        { id: 'fc', label: 'Focused pane border', css: ['border-top-color'], part: '.plx-comparison-view__pane', cat: 'color' },
        { id: 'rg', label: 'Space between attributes', css: ['row-gap'], part: '.plx-comparison-view__list', cat: 'space' },
        { id: 'ri', label: 'Space under a label', css: ['row-gap'], part: '.plx-comparison-view__row', cat: 'space' },
        { id: 'lc', label: 'Label color', css: ['color'], part: '.plx-comparison-view__label', cat: 'color' },
        { id: 'ls', label: 'Label size', css: ['font-size'], part: '.plx-comparison-view__label', cat: 'font-size' },
        { id: 'll', label: 'Label line height', css: ['line-height'], part: '.plx-comparison-view__label', cat: 'line-height' },
        { id: 'vc', label: 'Value color', css: ['color'], part: '.plx-comparison-view__value', cat: 'color' },
        { id: 'vs', label: 'Value size', css: ['font-size'], part: '.plx-comparison-view__value', cat: 'font-size' },
        { id: 'vl', label: 'Value line height', css: ['line-height'], part: '.plx-comparison-view__value', cat: 'line-height' },
        { id: 'vg', label: 'Space before the badge', css: ['column-gap'], part: '.plx-comparison-view__value', cat: 'space' },
        { id: 'df', label: 'Data value font', css: ['font-family'], part: '.plx-comparison-view__data', cat: 'font' },
        { id: 'cg', label: 'Space before the badge (table)', css: ['column-gap'], part: '.plx-comparison-view__cell', cat: 'space' },
        { id: 'sb', label: 'Stage fill', css: ['background-color'], part: '.plx-comparison-view__stage', cat: 'color' },
        { id: 'sr', label: 'Stage corners', css: ['border-top-left-radius'], part: '.plx-comparison-view__stage', cat: 'radius' },
        { id: 'dc', label: 'Divider color', css: ['stroke'], part: '.plx-comparison-view__divider', cat: 'color' },
        { id: 'dw', label: 'Divider width', css: ['stroke-width'], part: '.plx-comparison-view__divider', cat: 'border-width' }
      ],
      token: function (id, size, variant, state, content) {
        var panes = variant === 'columns' || variant === 'differences', scroll = panes && content === 'scroll';
        var ALL = { g: 'gap', bg: 'bar-gap', br: 'bar-row-gap', sc: 'summary-text', ss: 'summary-font-size', sl: 'summary-line-height' };
        if (ALL[id]) return id.charAt(0) === 's' && variant === 'slider' ? null : CV(ALL[id]);
        var PANE = { pg: 'pane-gap', pb: 'pane-background', pw: 'pane-border-width', pr: 'pane-radius', hp: 'head-padding-block', pi: 'pane-padding-inline', hg: 'head-gap', tc: 'title-text', tf: 'title-font-family', ts: 'title-font-size', tw: 'title-font-weight', tl: 'title-line-height',
          mc: 'meta-text', mf: 'meta-font-family', ms: 'meta-font-size', ml: 'meta-line-height', bp: 'pane-padding-block', bd: 'body-gap', rg: 'row-gap', ri: 'row-inner-gap', lc: 'label-text', ls: 'label-font-size', ll: 'label-line-height', vc: 'value-text', vs: 'value-font-size', vl: 'value-line-height', vg: 'value-gap', df: 'data-font-family' };
        if (PANE[id]) return panes ? CV(PANE[id]) : null;
        if (id === 'pc') return panes && !(scroll && state === 'focus') ? CV('pane-border-color') : null;
        if (id === 'fc') return scroll && state === 'focus' ? CV('focus-border-color') : null;
        if (id === 'sh') return scroll ? CV('scroll-height') : null;
        if (id === 'cg') return variant === 'matrix' ? CV('value-gap') : null;
        var SL = { sb: 'stage-background', sr: 'pane-radius', dc: 'divider-color', dw: 'divider-width' };
        if (SL[id]) return variant === 'slider' ? CV(SL[id]) : null;
        return null;
      },
      reach: function () { return 'every comparison view'; }, every: 'every comparison view',
      html: function (variant, size, state, extraCls, ui) {
        var scroll = ui && ui.content === 'scroll', only = variant === 'differences';
        var rows = only ? ATTRS.filter(function (a) { return a[1] !== a[2]; }) : ATTRS;
        var count = ATTRS.filter(function (a) { return a[1] !== a[2]; }).length;
        var bar = '<div class="plx-comparison-view__bar"><p class="plx-comparison-view__summary">' + (variant === 'slider' ? '' : count + ' differences') + '</p><div class="plx-comparison-view__controls">'
          + (variant === 'slider' ? '' : '<label class="plx-switch"><input type="checkbox" role="switch" class="plx-switch__input" tabindex="-1"' + (only ? ' checked' : '') + '><span class="plx-switch__track" aria-hidden="true"></span><span class="plx-switch__label">Show only differences</span></label>')
          + '<div role="radiogroup" aria-label="View" class="plx-segmented plx-segmented--sm"><button type="button" role="radio" tabindex="-1" aria-checked="' + (variant !== 'matrix' && variant !== 'slider') + '" class="plx-segmented__item' + (variant !== 'matrix' && variant !== 'slider' ? ' is-selected' : '') + '"><span>Side by side</span></button>'
          + '<button type="button" role="radio" tabindex="-1" aria-checked="' + (variant === 'matrix') + '" class="plx-segmented__item' + (variant === 'matrix' ? ' is-selected' : '') + '"><span>Table</span></button>'
          + '<button type="button" role="radio" tabindex="-1" aria-checked="' + (variant === 'slider') + '" class="plx-segmented__item' + (variant === 'slider' ? ' is-selected' : '') + '"><span>Slider</span></button></div></div></div>';
        var body;
        if (variant === 'matrix') {
          body = '<div class="ds-w09b-cells">' + rows.map(function (a) { return '<div class="ds-w09b-cell-row"><span>' + a[0] + '</span><span class="plx-comparison-view__cell">' + value(a[1], a[3]) + '</span><span class="plx-comparison-view__cell">' + value(a[2], a[3]) + (a[1] !== a[2] ? badge : '') + '</span></div>'; }).join('') + '</div>';
        } else if (variant === 'slider') {
          body = '<figure class="plx-comparison-view__slider"><div class="plx-comparison-view__slider-head"><span class="plx-comparison-view__side"><span class="plx-comparison-view__title">Version 2</span><span class="plx-comparison-view__meta">2 Oct 2026</span></span>'
            + '<span class="plx-comparison-view__side plx-comparison-view__side--end"><span class="plx-comparison-view__title">Version 3</span><span class="plx-comparison-view__meta">9 Oct 2026</span></span></div>'
            + '<svg class="plx-comparison-view__stage" viewBox="0 0 1600 900" role="img" aria-label="Hero banner, version 2 · Hero banner, version 3"><defs><clipPath id="ds-w09b-clip"><rect x="0" y="0" width="640" height="900"></rect></clipPath></defs>'
            + '<image href="../../dam/assets/thumb-14.svg" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"></image><image href="../../dam/assets/thumb-12.svg" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice" clip-path="url(#ds-w09b-clip)"></image>'
            + '<line class="plx-comparison-view__divider" x1="640" x2="640" y1="0" y2="900" vector-effect="non-scaling-stroke"></line></svg></figure>';
        } else {
          body = '<div class="plx-comparison-view__panes plx-comparison-view__panes--2">' + [['Version 2', '2 Oct 2026', 1], ['Version 3', '9 Oct 2026', 2]].map(function (p, i) {
            return '<article class="plx-comparison-view__pane"><header class="plx-comparison-view__head"><h3 class="plx-comparison-view__title">' + p[0] + '</h3><span class="plx-comparison-view__meta">' + p[1] + '</span></header>'
              + '<div class="plx-comparison-view__body' + (scroll ? ' plx-comparison-view__body--scroll' + (i === 0 && state === 'focus' ? ' ds-focus' : '') : '') + '"' + (scroll ? ' role="region" aria-label="' + p[0] + '"' : '') + '><dl class="plx-comparison-view__list">'
              + rows.map(function (a) { return '<div class="plx-comparison-view__row"><dt class="plx-comparison-view__label">' + a[0] + '</dt><dd class="plx-comparison-view__value">' + value(a[p[2]], a[3]) + (i > 0 && a[1] !== a[2] ? badge : '') + '</dd></div>'; }).join('')
              + '</dl></div></article>';
          }).join('') + '</div>';
        }
        return '<div class="ds-w09b-lab ds-w09b-lab--wide"><section class="plx-comparison-view plx-comparison-view--' + (variant === 'differences' ? 'columns' : variant) + ex(extraCls) + '" aria-label="Compare versions">' + bar + body + '</section></div>';
      },
      labelSelector: '.plx-comparison-view__title',
      parts: { g: 'A', bg: 'B', br: 'B', sc: 'B', ss: 'B', sl: 'B', pg: 'C', pb: 'D', pc: 'D', pw: 'D', pr: 'D', fc: 'D', hp: 'E', pi: 'E', hg: 'E', tc: 'F', tf: 'F', ts: 'F', tw: 'F', tl: 'F', mc: 'G', mf: 'G', ms: 'G', ml: 'G',
        bp: 'H', bd: 'H', sh: 'H', rg: 'I', ri: 'I', lc: 'J', ls: 'J', ll: 'J', vc: 'K', vs: 'K', vl: 'K', vg: 'K', df: 'K', cg: 'K', sb: 'L', sr: 'L', dc: 'M', dw: 'M' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-comparison-view__bar', side: 'top' }, C: { part: '.plx-comparison-view__panes', side: 'bottom' }, D: { part: '.plx-comparison-view__pane', side: 'right' }, E: { part: '.plx-comparison-view__head', side: 'left' },
        F: { part: '.plx-comparison-view__title', side: 'top' }, G: { part: '.plx-comparison-view__meta', side: 'right' }, H: { part: '.plx-comparison-view__body', side: 'left' }, I: { part: '.plx-comparison-view__list', side: 'left' }, J: { part: '.plx-comparison-view__label', side: 'right' },
        K: { part: '.plx-comparison-view__value', side: 'right' }, L: { part: '.plx-comparison-view__stage', side: 'right' }, M: { part: '.plx-comparison-view__divider', side: 'top' } },
      sections: [['Layout', ['g', 'bg', 'br', 'pg']], ['Count', ['sc', 'ss', 'sl']], ['Pane', ['pb', 'pc', 'pw', 'pr', 'fc', 'hp', 'pi', 'hg', 'bp', 'bd', 'sh']], ['Name and version', ['tc', 'tf', 'ts', 'tw', 'tl', 'mc', 'mf', 'ms', 'ml']],
        ['Attributes', ['rg', 'ri', 'lc', 'ls', 'll', 'vc', 'vs', 'vl', 'vg', 'df', 'cg']], ['Slider', ['sb', 'sr', 'dc', 'dw']]],
      matrixLabel: 'Comparison view values by variant', matrixColumnWidth: '--plx-ref-size-720px', statesHead: 'Variants · ' + HEAD
    });
  })();
}
