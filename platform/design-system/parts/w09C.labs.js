/* Plenix design system · library part w09C: the labs of wave 9, lane C. Chart accessibility (the active ring and ChartPatterns),
   Sparkline, Metric card (and Metric's trend, re-registered on the data lab), LollipopChart, ScatterChart and its Bubble
   chart, FunnelChart, Treemap, GanttChart, GeoMap and its Choropleth map, each drawn in place with the markup the
   component renders (in a fixed SVG plot: ChartFrame measures its container and draws the same markup), so every
   variant shows with the one --plx-comp-* token behind each value. Marks are drawn without data-plx-dataviz, so the
   default color token is the one shown. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var T = function (p) { return function (n) { return 'plx-comp-' + p + '-' + n; }; };
    var STATIC = [['default', 'Default']];
    // a fixed plot: W × HH, the inner area moved by the start and top margins
    var W = 360, HH = 200;
    var svg = function (inner, l, t) { return '<svg class="plx-chart__svg" width="' + W + '" height="' + HH + '" viewBox="0 0 ' + W + ' ' + HH + '" role="img" aria-label="Sample chart"><g transform="translate(' + l + ',' + t + ')">' + inner + '</g></svg>'; };
    var figure = function (cls, extraCls, inner) { return '<div class="ds-w09c-lab"><figure class="plx-chart ' + cls + ex(extraCls) + '">' + inner + '</figure></div>'; };
    var line = function (cls, x1, y1, x2, y2) { return '<line class="' + cls + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"></line>'; };
    var rect = function (cls, x, y, w, h, more) { return '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + Math.max(0, w) + '" height="' + Math.max(0, h) + '"' + (more || '') + '></rect>'; };
    var text = function (cls, x, y, s) { return '<text class="' + cls + '" x="' + x + '" y="' + y + '">' + s + '</text>'; };
    var defs = function (id) {
      return '<defs class="plx-chart-patterns"><pattern id="' + id + '-diagonal" width="8" height="8" patternUnits="userSpaceOnUse"><path class="plx-chart-pattern__stroke" d="M-2,2 L2,-2 M0,8 L8,0 M6,10 L10,6"></path></pattern>'
        + '<pattern id="' + id + '-dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle class="plx-chart-pattern__dot" cx="4" cy="4" r="1.5"></circle></pattern></defs>';
    };

    // ---- Chart accessibility: the active ring (the plot's focus is ChartFrame's, the chart interaction) and ChartPatterns over columns
    var KY = T('chart-keys'), PT = T('chart-pattern');
    DS.registerLab('chart-accessibility', {
      name: 'Chart accessibility', title: 'Plenix chart accessibility', file: 'platform/charts/chart-a11y.css', compPrefix: /^plx-comp-chart-(keys|pattern)-/,
      store: 'plenix-chart-accessibility-lab-tokens', sizes: [['default', 'Default', '.plx-chart']],
      variants: [['table', 'Data grid fallback'], ['summary', 'Summary text'], ['patterns', 'Patterns'], ['keyboard', 'Keyboard point navigation']],
      states: [['default', 'Default']], content: [['chart', 'A chart']],
      labels: { size: 'Size', variant: 'Rule', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'keyboard', state: 'default', content: 'chart' },
      props: [
        { id: 'rc', label: 'Active ring color', css: ['stroke'], part: '.plx-chart-keys__ring', cat: 'color' },
        { id: 'rw', label: 'Active ring width', css: ['stroke-width'], part: '.plx-chart-keys__ring', cat: 'border-width' },
        { id: 'pc', label: 'Texture color', css: ['stroke'], part: '.plx-chart-pattern__stroke', cat: 'color' },
        { id: 'pd', label: 'Texture dot color', css: ['fill'], part: '.plx-chart-pattern__dot', cat: 'color' },
        { id: 'pw', label: 'Texture stroke width', css: ['stroke-width'], part: '.plx-chart-pattern__stroke', cat: 'border-width' }
      ],
      token: function (id, size, variant, state) {
        if (id === 'rc' || id === 'rw') return variant === 'keyboard' ? KY(id === 'rc' ? 'ring-color' : 'ring-width') : null;
        if (id === 'pc' || id === 'pd' || id === 'pw') return variant === 'patterns' ? PT(id === 'pw' ? 'width' : 'color') : null;
        return null;
      },
      reach: function () { return 'every chart read with the keyboard'; }, every: 'every chart read with the keyboard',
      html: function (variant, size, state, extraCls) {
        var IW = 312, IH = 152, Q = [120, 180, 150, 240], step = IW / 4;
        var cols = Q.map(function (v, i) { var hh = Math.round(v / 240 * IH); return rect('plx-chart__mark', Math.round(step * i + 12), IH - hh, Math.round(step - 24), hh); }).join('');
        var tex = variant === 'patterns' ? defs('ds-w09c-a11y') + Q.map(function (v, i) { var hh = Math.round(v / 240 * IH); return rect('plx-chart-pattern', Math.round(step * i + 12), IH - hh, Math.round(step - 24), hh, ' fill="url(#ds-w09c-a11y-' + (i % 2 ? 'dots' : 'diagonal') + ')"'); }).join('') : '';
        var ring = variant === 'keyboard' ? rect('plx-chart-keys__ring', Math.round(step * 3 + 8), IH - IH - 4, Math.round(step - 16), IH + 4) : '';
        var desc = variant === 'summary' ? 'Up 100% from 120 to 240; lowest 120 (Q1), highest 240 (Q4).' : 'Sign-ups doubled over the year.';
        return '<div class="ds-w09c-lab' + ex(extraCls) + '">'
          + '<figure class="plx-chart plx-chart--sm"><figcaption class="plx-chart__caption"><span class="plx-chart__title">Sign-ups per quarter</span><span class="plx-chart__description">' + desc + '</span></figcaption>'
          + svg(line('plx-chart__axis-line', 0, IH, IW, IH) + cols + tex + ring, 40, 8) + (variant === 'table' ? '<span class="plx-chart__description">Show the data</span>' : '') + '</figure></div>';
      },
      labelSelector: '.plx-chart__title',
      parts: { rc: 'B', rw: 'B', pc: 'C', pd: 'C', pw: 'C' },
      anchors: { B: { part: '.plx-chart-keys__ring', side: 'top' }, C: { part: '.plx-chart-pattern', side: 'right' } },
      sections: [['Active mark', ['rc', 'rw']], ['Textures', ['pc', 'pd', 'pw']]],
      matrixLabel: 'Chart accessibility values by rule', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Rules · ' + HEAD
    });

    // ---- Sparkline (<Sparkline>): inline (96 × 24) or fill (the container's width, 32 tall); line, area, bar, last point
    var SP = T('sparkline');
    var VALUES = [40, 42, 39, 47, 51, 49, 56, 58, 54, 61, 66, 64];
    var sparkSvg = function (variant, w, hh) {
      var lo = 39, hi = 66, n = VALUES.length, pad = 4;
      var x = function (i) { return Math.round(pad + (w - 2 * pad) * i / (n - 1)); }, y = function (v) { return Math.round(hh - pad - (hh - 2 * pad) * (v - lo) / (hi - lo)); };
      var d = VALUES.map(function (v, i) { return (i ? 'L' : 'M') + x(i) + ',' + y(v); }).join('');
      var inner;
      if (variant === 'bar') { var bw = w / n; inner = VALUES.map(function (v, i) { var bh = Math.round(hh * v / hi); return rect('plx-sparkline__bar', Math.round(bw * i + bw * 0.1), hh - bh, Math.round(bw * 0.8), bh); }).join(''); }
      else inner = (variant === 'area' ? '<path class="plx-sparkline__area" d="' + d + 'L' + x(n - 1) + ',' + (hh - pad) + 'L' + x(0) + ',' + (hh - pad) + 'Z"></path>' : '') + '<path class="plx-sparkline__line" d="' + d + '"></path>'
        + (variant === 'last' ? '<circle class="plx-sparkline__last" cx="' + x(n - 1) + '" cy="' + y(VALUES[n - 1]) + '" r="4"></circle>' : '');
      return '<svg class="plx-sparkline__svg" width="' + w + '" height="' + hh + '" viewBox="0 0 ' + w + ' ' + hh + '" aria-hidden="true">' + inner + '</svg>';
    };
    var sparkHtml = function (variant, size, extraCls, wrap) {
      var fill = size === 'fill', mod = variant === 'last' ? 'line' : variant;
      var el = '<span class="plx-sparkline plx-sparkline--' + mod + ' plx-sparkline--' + size + ex(extraCls) + '" role="img" aria-label="Downloads per week: up 60% from 40 to 64">' + sparkSvg(variant, fill ? 240 : 96, fill ? 32 : 24) + '</span>';
      return wrap === false ? el : '<div class="ds-w09c-lab' + (fill ? ' ds-w09c-lab--fill' : '') + '">' + el + '</div>';
    };
    DS.registerLab('sparkline', {
      name: 'Sparkline', title: 'Plenix sparkline', file: 'platform/charts/sparkline.css', compPrefix: /^plx-comp-sparkline-/,
      store: 'plenix-sparkline-lab-tokens', sizes: [['inline', 'Inline (default)', '.plx-sparkline--inline'], ['fill', 'Fill', '.plx-sparkline--fill']],
      variants: [['line', 'Line (default)'], ['area', 'Area'], ['bar', 'Bar'], ['last', 'With last point']],
      states: STATIC, content: [['trend', 'Twelve weeks']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'inline', variant: 'line', state: 'default', content: 'trend' },
      props: [
        { id: 'w', label: 'Width (inline)', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'ih', label: 'Height (inline)', css: ['block-size'], show: 'height', cat: 'icon' },
        { id: 'fh', label: 'Height (fill)', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'c', label: 'Line color (default)', css: ['stroke'], part: '.plx-sparkline__line', cat: 'color' },
        { id: 'bc', label: 'Bar color (default)', css: ['fill'], part: '.plx-sparkline__bar', cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['stroke-width'], part: '.plx-sparkline__line', cat: 'border-width' },
        { id: 'ao', label: 'Area opacity', css: ['fill-opacity'], part: '.plx-sparkline__area', cat: 'opacity' },
        { id: 'pr', label: 'Last point radius', css: ['r'], part: '.plx-sparkline__last', cat: 'icon' },
        { id: 'po', label: 'Last point ring', css: ['stroke'], part: '.plx-sparkline__last', cat: 'color' },
        { id: 'pw', label: 'Last point ring width', css: ['stroke-width'], part: '.plx-sparkline__last', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var bar = variant === 'bar';
        if (id === 'w') return size === 'inline' ? SP('inline-width') : null;
        if (id === 'ih') return size === 'inline' ? SP('inline-height') : null;
        if (id === 'fh') return size === 'fill' ? SP('fill-height') : null;
        if (id === 'c' || id === 'lw') return bar ? null : SP(id === 'c' ? 'default-color' : 'line-width');
        if (id === 'bc') return bar ? SP('default-color') : null;
        if (id === 'ao') return variant === 'area' ? SP('area-opacity') : null;
        if (id === 'pr' || id === 'po' || id === 'pw') return variant === 'last' ? SP(id === 'pr' ? 'point-radius' : id === 'po' ? 'point-outline' : 'point-outline-width') : null;
        return null;
      },
      reach: function () { return 'every sparkline'; }, every: 'every sparkline',
      html: function (variant, size, state, extraCls) { return sparkHtml(variant, size, extraCls); },
      labelSelector: '.plx-sparkline__svg',
      parts: { w: 'A', ih: 'A', fh: 'A', c: 'B', bc: 'B', lw: 'B', ao: 'C', pr: 'D', po: 'D', pw: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-sparkline__svg', side: 'top' }, C: { part: '.plx-sparkline__svg', side: 'bottom' }, D: { part: '.plx-sparkline__svg', side: 'right' } },
      sections: [['Box', ['w', 'ih', 'fh']], ['Line and bars', ['c', 'bc', 'lw', 'ao']], ['Last point', ['pr', 'po', 'pw']]],
      matrixLabel: 'Sparkline values by variant', matrixColumnWidth: '--plx-ref-size-300px', statesHead: 'Variants · ' + HEAD
    });

    var MT = T('metric');   // Metric's trend tokens (Metric's own lab, below)
    // Metric's own lab (data-labs.js) gains the trend as a content choice
    var ML = DS.labs.metric;
    if (ML) {
      DS.registerLab('metric', Object.assign({}, ML, {
        content: ML.content.concat([['trend', 'With a trend']]),
        props: ML.props.concat([{ id: 'tm', label: 'Trend narrowest', css: ['min-inline-size'], show: 'min-width', part: '.plx-metric__trend', cat: 'size' }]),
        token: function (id, size, variant, state, content) { if (id === 'tm') return content === 'trend' ? MT('trend-min-width') : null; return ML.token(id, size, variant, state, content === 'trend' ? 'figure' : content); },
        html: function (variant, size, state, extraCls, ui) {
          var base = ML.html(variant, size, state, extraCls, ui && ui.content === 'trend' ? Object.assign({}, ui, { content: 'figure' }) : ui);
          return ui && ui.content === 'trend' ? base.replace(/<\/div>$/, '<div class="plx-metric__trend">' + sparkHtml('line', 'fill', '', false) + '</div></div>') : base;
        },
        parts: Object.assign({}, ML.parts, { tm: 'H' }), anchors: Object.assign({}, ML.anchors, { H: { part: '.plx-metric__trend', side: 'bottom' } }),
        sections: (ML.sections || []).concat([['Trend', ['tm']]])
      }));
    }

    // ---- LollipopChart: stems from zero ending in dots; horizontal (names down the side) or vertical
    var LP = T('lollipop');
    var TEAM = [['Design', 412], ['Marketing', 356], ['Product', 298], ['Sales', 251], ['Support', 204], ['Legal', 96]];
    DS.registerLab('lollipop-chart', {
      name: 'Lollipop chart', title: 'Plenix lollipop chart', file: 'platform/charts/lollipop-chart.css', compPrefix: /^plx-comp-lollipop-/,
      store: 'plenix-lollipop-chart-lab-tokens', sizes: [['default', 'Default', '.plx-lollipop']],
      variants: [['horizontal', 'Horizontal (default)'], ['vertical', 'Vertical']],
      states: STATIC, content: [['teams', 'Six teams']],
      labels: { size: 'Size', variant: 'Orientation', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'horizontal', state: 'default', content: 'teams' },
      props: [
        { id: 'cw', label: 'Room for the names (horizontal)', css: ['--plx-comp-chart-margin-inline-start'], cat: 'size' },
        { id: 'vr', label: 'Room above (vertical)', css: ['--plx-comp-chart-margin-block-start'], cat: 'icon' },
        { id: 'sc', label: 'Stem color (default)', css: ['stroke'], part: '.plx-lollipop__stem', cat: 'color' },
        { id: 'sw', label: 'Stem width', css: ['stroke-width'], part: '.plx-lollipop__stem', cat: 'border-width' },
        { id: 'dc', label: 'Dot color (default)', css: ['fill'], part: '.plx-lollipop__dot', cat: 'color' },
        { id: 'dr', label: 'Dot radius', css: ['r'], part: '.plx-lollipop__dot', cat: 'icon' },
        { id: 'do', label: 'Dot ring', css: ['stroke'], part: '.plx-lollipop__dot', cat: 'color' },
        { id: 'dw', label: 'Dot ring width', css: ['stroke-width'], part: '.plx-lollipop__dot', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        if (id === 'cw') return variant === 'horizontal' ? LP('category-width') : null;
        if (id === 'vr') return variant === 'vertical' ? LP('value-room') : null;
        return { sc: LP('default-color'), sw: LP('stem-width'), dc: LP('default-color'), dr: LP('dot-radius'), do: LP('dot-outline'), dw: LP('dot-outline-width') }[id] || null;
      },
      reach: function () { return 'every lollipop chart'; }, every: 'every lollipop chart',
      html: function (variant, size, state, extraCls) {
        var hor = variant === 'horizontal', l = hor ? 96 : 40, IW = W - l - 8, IH = 168, n = TEAM.length, step = (hor ? IH : IW) / n;
        var v = function (x) { return Math.round(x / 450 * (hor ? IW : IH)); };
        var g = TEAM.map(function (t, i) {
          var c = Math.round(step * i + step / 2);
          var x1 = hor ? 0 : c, y1 = hor ? c : IH, x2 = hor ? v(t[1]) : c, y2 = hor ? c : IH - v(t[1]);
          return line('plx-lollipop__stem', x1, y1, x2, y2) + '<circle class="plx-lollipop__dot" cx="' + x2 + '" cy="' + y2 + '" r="4"></circle>'
            + text('plx-chart__tick-label plx-chart-axis__tick', hor ? 0 : c, hor ? c : IH, hor ? t[0] : t[0].slice(0, 3));
        }).join('');
        var axis = hor ? '<g class="plx-chart-axis plx-chart-axis--left">' : '<g class="plx-chart-axis plx-chart-axis--bottom">';
        return figure('plx-lollipop plx-lollipop--' + variant, extraCls, svg((hor ? line('plx-chart__axis-line', 0, 0, 0, IH) : line('plx-chart__axis-line', 0, IH, IW, IH)) + axis + g + '</g>', l, 8));
      },
      labelSelector: '.plx-chart-axis__tick',
      parts: { cw: 'A', vr: 'A', sc: 'B', sw: 'B', dc: 'C', dr: 'C', do: 'C', dw: 'C' },
      anchors: { A: { part: '.plx-chart__svg', side: 'left' }, B: { part: '.plx-lollipop__stem', side: 'top' }, C: { part: '.plx-lollipop__dot', side: 'right' } },
      sections: [['Frame', ['cw', 'vr']], ['Stem', ['sc', 'sw']], ['Dot', ['dc', 'dr', 'do', 'dw']]],
      matrixLabel: 'Lollipop chart values by orientation', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Orientations · ' + HEAD
    });

    // ---- ScatterChart and its Bubble chart: points (one size), a trend line, bubbles (area by a third measure)
    var SC = T('scatter');
    var PTS = [[1.1, 420], [2.4, 310], [3.3, 290], [4.8, 260], [5.4, 210], [6.2, 180], [8.1, 150], [0.6, 460]];
    var BUB = [[412, 7.4, 22], [356, 5.1, 14], [298, 6.2, 18], [251, 3.8, 10], [204, 2.9, 8], [96, 1.6, 4]];
    var scatterSpec = {
      name: 'Scatter plot', title: 'Plenix scatter plot', file: 'platform/charts/scatter-chart.css', compPrefix: /^plx-comp-scatter-/,
      store: 'plenix-scatter-chart-lab-tokens', sizes: [['default', 'Default', '.plx-scatter']],
      variants: [['points', 'Points (default)'], ['trend', 'With trend line'], ['bubble', 'Bubble (size)']],
      states: STATIC, content: [['assets', 'Assets']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'points', state: 'default', content: 'assets' },
      props: [
        { id: 'mb', label: 'Room under the plot', css: ['--plx-comp-chart-margin-block-end'], cat: 'size' },
        { id: 'ms', label: 'Room before the plot', css: ['--plx-comp-chart-margin-inline-start'], cat: 'size' },
        { id: 'c', label: 'Point color (default)', css: ['fill'], part: '.plx-scatter__point', cat: 'color' },
        { id: 'pr', label: 'Point radius', css: ['r'], part: '.plx-scatter__point', cat: 'icon' },
        { id: 'po', label: 'Point opacity', css: ['fill-opacity'], part: '.plx-scatter__point', cat: 'opacity' },
        { id: 'bo', label: 'Bubble opacity', css: ['fill-opacity'], part: '.plx-scatter__point', cat: 'opacity' },
        { id: 'ow', label: 'Point outline width', css: ['stroke-width'], part: '.plx-scatter__point', cat: 'border-width' },
        { id: 'tw', label: 'Trend line width', css: ['stroke-width'], part: '.plx-scatter__trend', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var bub = variant === 'bubble' || variant === 'groups';
        if (id === 'mb') return SC('margin-block-end'); if (id === 'ms') return SC('margin-inline-start');
        if (id === 'c') return variant === 'groups' ? null : SC('default-color');
        if (id === 'pr' || id === 'po') return bub ? null : SC(id === 'pr' ? 'point-radius' : 'point-opacity');
        if (id === 'bo') return bub ? SC('bubble-opacity') : null;
        if (id === 'ow') return SC('point-outline-width');
        if (id === 'tw') return variant === 'trend' ? SC('trend-width') : null;
        return null;
      },
      reach: function () { return 'every scatter chart'; }, every: 'every scatter chart',
      html: function (variant, size, state, extraCls) {
        var IW = W - 64 - 16, IH = HH - 8 - 44, bub = variant === 'bubble' || variant === 'groups';
        var inner = line('plx-chart__axis-line', 0, IH, IW, IH);
        if (bub) inner += BUB.slice().sort(function (a, b) { return b[2] - a[2]; }).map(function (p, i) { return '<circle class="plx-scatter__point"' + (variant === 'groups' ? ' data-plx-dataviz="categorical-' + (i % 2 + 1) + '"' : '') + ' cx="' + Math.round(p[0] / 450 * IW) + '" cy="' + Math.round(IH - p[1] / 8 * IH) + '" r="' + p[2] + '"></circle>'; }).join('');
        else {
          if (variant === 'trend') inner += line('plx-scatter__trend', Math.round(0.6 / 9 * IW), Math.round(IH - 430 / 500 * IH), Math.round(8.1 / 9 * IW), Math.round(IH - 140 / 500 * IH));
          inner += PTS.map(function (p) { return '<circle class="plx-scatter__point" cx="' + Math.round(p[0] / 9 * IW) + '" cy="' + Math.round(IH - p[1] / 500 * IH) + '" r="4"></circle>'; }).join('');
        }
        return figure('plx-scatter plx-scatter--' + (bub ? 'bubble' : 'points'), extraCls, svg(inner, 64, 8));
      },
      labelSelector: '.plx-scatter__point',
      parts: { mb: 'A', ms: 'A', c: 'B', pr: 'B', po: 'B', bo: 'B', ow: 'B', tw: 'C' },
      anchors: { A: { part: '.plx-chart__svg', side: 'left' }, B: { part: '.plx-scatter__point', side: 'top' }, C: { part: '.plx-scatter__trend', side: 'right' } },
      sections: [['Frame', ['mb', 'ms']], ['Points', ['c', 'pr', 'po', 'bo', 'ow']], ['Trend line', ['tw']]],
      matrixLabel: 'Scatter plot values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    };
    DS.registerLab('scatter-chart', scatterSpec);
    DS.registerLab('bubble-chart', Object.assign({}, scatterSpec, { name: 'Bubble chart', title: 'Plenix bubble chart', store: 'plenix-bubble-chart-lab-tokens',
      variants: [['bubble', 'Bubble (default)'], ['groups', 'In groups']], defaults: { size: 'default', variant: 'bubble', state: 'default', content: 'assets' },
      reach: function () { return 'every bubble chart'; }, every: 'every bubble chart', matrixLabel: 'Bubble chart values by variant' }));

    // ---- FunnelChart: bars on a zero baseline, the stage before's length behind each
    var FN = T('funnel');
    var STAGES = [['Visited', 12400], ['Started', 5200], ['Signed up', 3900], ['Uploaded', 2100], ['Shared', 1260]];
    DS.registerLab('funnel-chart', {
      name: 'Funnel', title: 'Plenix funnel chart', file: 'platform/charts/funnel-chart.css', compPrefix: /^plx-comp-funnel-/,
      store: 'plenix-funnel-chart-lab-tokens', sizes: [['default', 'Default', '.plx-funnel']],
      variants: [['vertical', 'Vertical (default)'], ['horizontal', 'Horizontal']],
      states: STATIC, content: [['stages', 'Five stages']],
      labels: { size: 'Size', variant: 'Orientation', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'vertical', state: 'default', content: 'stages' },
      props: [
        { id: 'sw', label: 'Room for the stage names', css: ['--plx-comp-chart-margin-inline-start'], cat: 'size' },
        { id: 'lr', label: 'Room for the labels (after)', css: ['--plx-comp-chart-margin-inline-end'], cat: 'size' },
        { id: 'lb', label: 'Room for the labels (above)', css: ['--plx-comp-chart-margin-block-start'], cat: 'icon' },
        { id: 'nb', label: 'Room for the names (under)', css: ['--plx-comp-chart-margin-block-end'], cat: 'size' },
        { id: 'ed', label: 'Room at the bare edge', css: ['--plx-comp-chart-margin-block-end'], cat: 'icon' },
        { id: 'db', label: 'Drop background', css: ['fill'], part: '.plx-funnel__drop', cat: 'color' }
      ],
      token: function (id, size, variant) {
        var v = variant === 'vertical';
        if (id === 'sw' || id === 'lr') return v ? FN(id === 'sw' ? 'stage-width' : 'label-room') : null;
        if (id === 'lb' || id === 'nb') return v ? null : FN(id === 'lb' ? 'label-room-block' : 'name-room-block');
        if (id === 'ed') return v ? FN('edge') : null;
        if (id === 'db') return FN('drop-background');
        return null;
      },
      reach: function () { return 'every funnel chart'; }, every: 'every funnel chart',
      html: function (variant, size, state, extraCls) {
        var v = variant === 'vertical', l = v ? 120 : 40, IW = W - l - (v ? 96 : 8), IH = v ? 168 : 144, n = STAGES.length, step = (v ? IH : IW) / n, band = step * 0.76;
        var len = function (x) { return Math.round(x / 12400 * (v ? IW : IH)); };
        var g = STAGES.map(function (s, i) {
          var a = Math.round(step * i + (step - band) / 2), b = Math.round(band);
          var bar = function (cls, x) { return v ? rect(cls, 0, a, len(x), b) : rect(cls, a, IH - len(x), b, len(x)); };
          return (i ? bar('plx-funnel__drop', STAGES[i - 1][1]) : '') + bar('plx-chart__mark plx-funnel__bar', s[1])
            + text('plx-chart__tick-label plx-chart-axis__tick', v ? 0 : a + b / 2, v ? a + b / 2 : IH, s[0]);
        }).join('');
        return figure('plx-funnel plx-funnel--' + variant, extraCls, svg('<g class="plx-chart-axis plx-chart-axis--' + (v ? 'left' : 'bottom') + '">' + g + '</g>', l, v ? 8 : 24));
      },
      labelSelector: '.plx-chart-axis__tick',
      parts: { sw: 'A', lr: 'A', lb: 'A', nb: 'A', ed: 'A', db: 'B' },
      anchors: { A: { part: '.plx-chart__svg', side: 'left' }, B: { part: '.plx-funnel__drop', side: 'right' } },
      sections: [['Frame', ['sw', 'lr', 'lb', 'nb', 'ed']], ['Bars', ['db']]],
      matrixLabel: 'Funnel values by orientation', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Orientations · ' + HEAD
    });

    // ---- Treemap: tiles with gaps, names and values on a halo; nested groups framed and named
    var TM = T('treemap');
    DS.registerLab('treemap', {
      name: 'Treemap', title: 'Plenix treemap', file: 'platform/charts/treemap.css', compPrefix: /^plx-comp-treemap-/,
      store: 'plenix-treemap-lab-tokens', sizes: [['default', 'Default', '.plx-treemap']],
      variants: [['flat', 'Flat'], ['nested', 'Nested']],
      states: STATIC, content: [['folders', 'Folders']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'flat', state: 'default', content: 'folders' },
      props: [
        { id: 'gc', label: 'Gap color', css: ['stroke'], part: '.plx-treemap__tile', cat: 'color' },
        { id: 'gw', label: 'Gap width', css: ['stroke-width'], part: '.plx-treemap__tile', cat: 'border-width' },
        { id: 'lt', label: 'Name and value color', css: ['fill'], part: '.plx-treemap__label', cat: 'color' },
        { id: 'lf', label: 'Name font', css: ['font-family'], part: '.plx-treemap__label', cat: 'font' },
        { id: 'lw', label: 'Name weight', css: ['font-weight'], part: '.plx-treemap__label', cat: 'font-weight' },
        { id: 'ls', label: 'Name and value size', css: ['font-size'], part: '.plx-treemap__label', cat: 'font-size' },
        { id: 'vf', label: 'Value font (data)', css: ['font-family'], part: '.plx-treemap__value', cat: 'font' },
        { id: 'hc', label: 'Halo color', css: ['stroke'], part: '.plx-treemap__label', cat: 'color' },
        { id: 'hw', label: 'Halo width', css: ['stroke-width'], part: '.plx-treemap__label', cat: 'border-width' },
        { id: 'bc', label: 'Group frame color', css: ['stroke'], part: '.plx-treemap__group-frame', cat: 'color' },
        { id: 'bw', label: 'Group frame width', css: ['stroke-width'], part: '.plx-treemap__group-frame', cat: 'border-width' },
        { id: 'nt', label: 'Group name color', css: ['fill'], part: '.plx-treemap__group-label', cat: 'color' },
        { id: 'nf', label: 'Group name font', css: ['font-family'], part: '.plx-treemap__group-label', cat: 'font' },
        { id: 'ns', label: 'Group name size', css: ['font-size'], part: '.plx-treemap__group-label', cat: 'font-size' },
        { id: 'nw', label: 'Group name weight', css: ['font-weight'], part: '.plx-treemap__group-label', cat: 'font-weight' }
      ],
      token: function (id, size, variant) {
        var M = { gc: 'gap-color', gw: 'gap-width', lt: 'label-text', lf: 'label-font-family', lw: 'label-font-weight', ls: 'label-font-size', vf: 'value-font-family', hc: 'label-halo-color', hw: 'label-halo-width' };
        if (M[id]) return TM(M[id]);
        var N = { bc: 'group-border-color', bw: 'group-border-width', nt: 'group-label-text', nf: 'group-label-font-family', ns: 'group-label-font-size', nw: 'group-label-font-weight' };
        return N[id] && variant === 'nested' ? TM(N[id]) : null;
      },
      reach: function () { return 'every treemap'; }, every: 'every treemap',
      html: function (variant, size, state, extraCls) {
        var tile = function (x, y, w, hh, name, value) { return rect('plx-chart__mark plx-treemap__tile', x, y, w, hh) + text('plx-treemap__label', x + 4, y + 4, name) + text('plx-treemap__value', x + 4, y + 20, value); };
        var g = variant === 'nested'
          ? '<g class="plx-treemap__group">' + rect('plx-treemap__group-frame', 0, 0, 220, 200) + text('plx-treemap__group-label', 4, 10, 'Design') + '</g>' + tile(4, 20, 212, 100, 'Video', '120') + tile(4, 120, 120, 76, 'Design files', '48') + tile(124, 120, 92, 76, 'Photos', '40')
            + '<g class="plx-treemap__group">' + rect('plx-treemap__group-frame', 220, 0, 140, 200) + text('plx-treemap__group-label', 224, 10, 'Marketing') + '</g>' + tile(224, 20, 132, 120, 'Video', '80') + tile(224, 140, 132, 56, 'Photos', '44')
          : tile(0, 0, 200, 200, 'Video', '220') + tile(200, 0, 160, 110, 'Photos', '96') + tile(200, 110, 96, 90, 'Design files', '48') + tile(296, 110, 64, 90, 'Docs', '22');
        return figure('plx-treemap plx-treemap--' + variant, extraCls, svg(g, 0, 0));
      },
      labelSelector: '.plx-treemap__label',
      parts: { gc: 'A', gw: 'A', lt: 'B', lf: 'B', lw: 'B', ls: 'B', hc: 'B', hw: 'B', vf: 'C', bc: 'D', bw: 'D', nt: 'E', nf: 'E', ns: 'E', nw: 'E' },
      anchors: { A: { part: '.plx-treemap__tile', side: 'top' }, B: { part: '.plx-treemap__label', side: 'right' }, C: { part: '.plx-treemap__value', side: 'bottom' }, D: { part: '.plx-treemap__group-frame', side: 'left' }, E: { part: '.plx-treemap__group-label', side: 'top' } },
      sections: [['Tiles', ['gc', 'gw']], ['Names and values', ['lt', 'lf', 'lw', 'ls', 'vf', 'hc', 'hw']], ['Groups', ['bc', 'bw', 'nt', 'nf', 'ns', 'nw']]],
      matrixLabel: 'Treemap values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- GanttChart: task names, bars (the rest textured), dependency arrows, milestones, the today line
    var GT = T('gantt');
    DS.registerLab('gantt-chart', {
      name: 'Gantt chart', title: 'Plenix Gantt chart', file: 'platform/charts/gantt-chart.css', compPrefix: /^plx-comp-gantt-/,
      store: 'plenix-gantt-chart-lab-tokens', sizes: [['default', 'Default', '.plx-gantt']],
      variants: [['tasks', 'Tasks'], ['dependencies', 'Dependencies'], ['milestones', 'Milestones'], ['today', 'Today line']],
      states: STATIC, content: [['plan', 'A plan']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'dependencies', state: 'default', content: 'plan' },
      props: [
        { id: 'tw', label: 'Room for the task names', css: ['--plx-comp-chart-margin-inline-start'], cat: 'size' },
        { id: 'lr', label: 'Room after the plot', css: ['--plx-comp-chart-margin-inline-end'], cat: 'size' },
        { id: 'mt', label: 'Room above the plot', css: ['--plx-comp-chart-margin-block-start'], cat: 'icon' },
        { id: 'tt', label: 'Task name color', css: ['fill'], part: '.plx-gantt__task', cat: 'color' },
        { id: 'tf', label: 'Task name font', css: ['font-family'], part: '.plx-gantt__task', cat: 'font' },
        { id: 'ts', label: 'Task name size', css: ['font-size'], part: '.plx-gantt__task', cat: 'font-size' },
        { id: 'lc', label: 'Arrow color', css: ['stroke'], part: '.plx-gantt__link', cat: 'color' },
        { id: 'lw', label: 'Arrow width', css: ['stroke-width'], part: '.plx-gantt__link', cat: 'border-width' },
        { id: 'ah', label: 'Arrowhead color', css: ['fill'], part: '.plx-gantt__arrow', cat: 'color' },
        { id: 'mc', label: 'Milestone color (default)', css: ['fill'], part: '.plx-gantt__milestone', cat: 'color' },
        { id: 'mo', label: 'Milestone ring', css: ['stroke'], part: '.plx-gantt__milestone', cat: 'color' },
        { id: 'mw', label: 'Milestone ring width', css: ['stroke-width'], part: '.plx-gantt__milestone', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var A = { tw: 'task-width', lr: 'label-room', mt: 'margin-block-start', tt: 'task-text', tf: 'task-font-family', ts: 'task-font-size' };
        if (A[id]) return GT(A[id]);
        if (id === 'lc' || id === 'ah') return variant === 'dependencies' ? GT('link-color') : null;
        if (id === 'lw') return variant === 'dependencies' ? GT('link-width') : null;
        var M = { mc: 'default-color', mo: 'milestone-outline', mw: 'milestone-outline-width' };
        return M[id] && variant === 'milestones' ? GT(M[id]) : null;
      },
      reach: function () { return 'every Gantt chart'; }, every: 'every Gantt chart',
      html: function (variant, size, state, extraCls) {
        var l = 120, rowH = 32, ROWS = [['Brief', 0, 40], ['Design', 40, 160], ['Review', 160, 200]];
        var g = ROWS.map(function (r, i) { var y = i * rowH + 8; return text('plx-gantt__task', -8, y + 8, r[0]) + rect('plx-chart__mark plx-gantt__bar', r[1], y, r[2] - r[1], 16); }).join('');
        if (variant === 'dependencies') g += '<g class="plx-gantt__dependency"><path class="plx-gantt__link" d="M40,16H48V48H36"></path><path class="plx-gantt__arrow" d="M40,48L36,44L36,52Z"></path></g>';
        if (variant === 'milestones') g += text('plx-gantt__task', -8, 3 * rowH + 16, 'Launch') + '<path class="plx-gantt__milestone" d="M220,' + (3 * rowH + 8) + 'L228,' + (3 * rowH + 16) + 'L220,' + (3 * rowH + 24) + 'L212,' + (3 * rowH + 16) + 'Z"></path>';
        if (variant === 'today') g += '<g class="plx-chart-reference plx-chart-reference--reference plx-chart-reference--x">' + line('plx-chart-reference__line', 120, 0, 120, 128) + text('plx-chart-reference__label', 120, 0, '<tspan class="plx-chart-reference__name">Today</tspan>') + '</g>';
        return figure('plx-gantt', extraCls, '<svg class="plx-chart__svg" width="' + W + '" height="160" viewBox="0 0 ' + W + ' 160" role="img" aria-label="Sample schedule"><g transform="translate(' + l + ',24)">' + g + '</g></svg>');
      },
      labelSelector: '.plx-gantt__task',
      parts: { tw: 'A', lr: 'A', mt: 'A', tt: 'B', tf: 'B', ts: 'B', lc: 'C', lw: 'C', ah: 'C', mc: 'D', mo: 'D', mw: 'D' },
      anchors: { A: { part: '.plx-chart__svg', side: 'left' }, B: { part: '.plx-gantt__task', side: 'top' }, C: { part: '.plx-gantt__link', side: 'right' }, D: { part: '.plx-gantt__milestone', side: 'bottom' } },
      sections: [['Frame', ['tw', 'lr', 'mt']], ['Task names', ['tt', 'tf', 'ts']], ['Dependencies', ['lc', 'lw', 'ah']], ['Milestones', ['mc', 'mo', 'mw']]],
      matrixLabel: 'Gantt chart values by variant', matrixColumnWidth: '--plx-ref-size-500px', statesHead: 'Variants · ' + HEAD
    });

    // ---- GeoMap and its Choropleth map: land and outlines, markers, the zoom buttons' row; shaded regions, no data
    var GM = T('geo-map');
    var CELLS = [[0, 0], [120, 0], [240, 0], [0, 64], [120, 64], [240, 64], [0, 128], [120, 128], [240, 128]];
    var region = function (c, i, attrs) { return '<path class="plx-geo-map__region' + (attrs.empty ? ' plx-geo-map__region--empty' : '') + '"' + (attrs.step ? ' data-plx-dataviz="' + attrs.step + '"' : '') + ' d="M' + c[0] + ',' + c[1] + 'h120v64h-120Z"></path>'; };
    var mapHtml = function (variant, extraCls) {
      var choro = variant === 'sequential' || variant === 'diverging';
      var g = CELLS.map(function (c, i) {
        if (!choro) return region(c, i, {});
        if (i === 8) return region(c, i, { empty: true }) + '<path class="plx-chart-pattern" fill="url(#ds-w09c-map-diagonal)" d="M' + c[0] + ',' + c[1] + 'h120v64h-120Z"></path>';
        return region(c, i, { step: variant + '-' + (i % 7 + 1) });
      }).join('');
      if (variant === 'markers') g += [[60, 40], [200, 90], [300, 150]].map(function (p) { return '<circle class="plx-geo-map__marker" cx="' + p[0] + '" cy="' + p[1] + '" r="4"></circle>'; }).join('');
      return '<div class="ds-w09c-lab' + ex(extraCls) + '"><div role="group" aria-label="Sample map"><div class="plx-geo-map__controls"><span class="plx-chart__description">Zoom</span></div>'
        + '<figure class="plx-chart plx-geo-map"><svg class="plx-chart__svg" width="' + W + '" height="' + HH + '" viewBox="0 0 ' + W + ' ' + HH + '" role="img" aria-label="Sample map">' + (choro ? defs('ds-w09c-map') : '') + '<g transform="translate(0,4)">' + g + '</g></svg></figure></div></div>';
    };
    var geoSpec = {
      name: 'Map', title: 'Plenix map', file: 'platform/charts/geo-map.css', compPrefix: /^plx-comp-geo-map-/,
      store: 'plenix-geo-map-lab-tokens', sizes: [['default', 'Default', '.plx-geo-map']],
      variants: [['outline', 'Regions'], ['markers', 'Markers']],
      states: STATIC, content: [['regions', 'Nine regions']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'markers', state: 'default', content: 'regions' },
      props: [
        { id: 'cg', label: 'Space under the zoom buttons', css: ['margin-block-end'], show: 'margin-bottom', part: '.plx-geo-map__controls', cat: 'space' },
        { id: 'ld', label: 'Land (no value)', css: ['fill'], part: '.plx-geo-map__region', cat: 'color' },
        { id: 'bc', label: 'Outline color', css: ['stroke'], part: '.plx-geo-map__region', cat: 'color' },
        { id: 'gc', label: 'Gap color (shaded regions)', css: ['stroke'], part: '.plx-geo-map__region[data-plx-dataviz]', cat: 'color' },
        { id: 'el', label: 'No-data land', css: ['fill'], part: '.plx-geo-map__region--empty', cat: 'color' },
        { id: 'bw', label: 'Outline width', css: ['stroke-width'], part: '.plx-geo-map__region', cat: 'border-width' },
        { id: 'mc', label: 'Marker color (default)', css: ['fill'], part: '.plx-geo-map__marker', cat: 'color' },
        { id: 'mr', label: 'Marker radius', css: ['r'], part: '.plx-geo-map__marker', cat: 'icon' },
        { id: 'mo', label: 'Marker ring', css: ['stroke'], part: '.plx-geo-map__marker', cat: 'color' },
        { id: 'mw', label: 'Marker ring width', css: ['stroke-width'], part: '.plx-geo-map__marker', cat: 'border-width' }
      ],
      token: function (id, size, variant) {
        var choro = variant === 'sequential' || variant === 'diverging';
        if (id === 'cg') return GM('controls-gap');
        if (id === 'bw') return GM('border-width');
        if (id === 'ld' || id === 'bc') return choro ? null : GM(id === 'ld' ? 'land' : 'border-color');
        if (id === 'gc' || id === 'el') return choro ? GM(id === 'gc' ? 'gap-color' : 'land') : null;
        var M = { mc: 'default-color', mr: 'marker-radius', mo: 'marker-outline', mw: 'marker-outline-width' };
        return M[id] && variant === 'markers' ? GM(M[id]) : null;
      },
      reach: function () { return 'every map'; }, every: 'every map',
      html: function (variant, size, state, extraCls) { return mapHtml(variant, extraCls); },
      labelSelector: '.plx-chart__description',
      parts: { cg: 'A', ld: 'B', bc: 'B', gc: 'B', el: 'B', bw: 'B', mc: 'C', mr: 'C', mo: 'C', mw: 'C' },
      anchors: { A: { part: '.plx-geo-map__controls', side: 'top' }, B: { part: '.plx-geo-map__region', side: 'left' }, C: { part: '.plx-geo-map__marker', side: 'right' } },
      sections: [['Controls', ['cg']], ['Regions', ['ld', 'bc', 'gc', 'el', 'bw']], ['Markers', ['mc', 'mr', 'mo', 'mw']]],
      matrixLabel: 'Map values by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    };
    DS.registerLab('geo-map', geoSpec);
    DS.registerLab('choropleth-map', Object.assign({}, geoSpec, { name: 'Choropleth map', title: 'Plenix choropleth map', store: 'plenix-choropleth-map-lab-tokens',
      variants: [['sequential', 'Sequential (default)'], ['diverging', 'Diverging']], defaults: { size: 'default', variant: 'sequential', state: 'default', content: 'regions' },
      reach: function () { return 'every choropleth map'; }, every: 'every choropleth map', matrixLabel: 'Choropleth map values by scale', statesHead: 'Scales · ' + HEAD }));
  })();
}
