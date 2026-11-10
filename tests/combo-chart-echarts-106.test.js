// Plenix · tests/combo-chart-echarts-106.test.js: ComboChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/combo-chart-echarts-106.test.js   → COMBO_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, shared axis and dual axes:
//   "Show the data" has a row per category; one column per value, standing on the baseline, each as tall as its value (heights in proportion to the values);
//   one point per line value (showPoints) and none without it; one line path through them; the legends name the columns and the lines;
//   the pointer over a category shows one tooltip with the category and every series' value; the dual chart's end axis carries the line's own labels (percent);
//   no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9885, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const BARS = [10, 20, 40, 30, 15], RATE = [0.5, 0.6, 0.9, 0.7, 0.55], SAME = [12, 18, 35, 28, 22];   // the line on its own axis (rates), or on the columns' axis (same unit)
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (props) => page.evaluate(async (dir, props, BARS, RATE, SAME) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.ComboChart, Object.assign({ title: 'Uploads and approval', description: 'Uploads rose, approval held', categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], bars: [{ id: 'up', label: 'Uploads', values: BARS }],
          lines: [{ id: 'rate', label: 'Approval rate', values: props.axis === 'dual' ? RATE : SAME }], barLabel: 'Uploads', lineLabel: 'Approval rate', categoryLabel: 'Month' }, props.axis === 'dual' ? { formatLine: (v) => Math.round(v * 100) + '%' } : {}, props)));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, props, BARS, RATE, SAME);
      // the shapes of the plot, by what they are: a column stands on the baseline, a point is small, the line is long
      const shapes = () => page.evaluate(() => {
        const root = document.querySelector('.plx-combo-chart'), out = [];
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect, .plx-chart__plot svg circle, .plx-chart__plot svg path, .plx-chart__engine svg path, .plx-chart__engine svg rect, .plx-chart__engine svg circle')) {
          if (e.closest('[class*=tooltip]') || e.classList.contains('plx-combo-chart__hit') || e.classList.contains('plx-chart-keys__ring')) continue;
          const b = e.getBoundingClientRect(); if (b.width < 1 && b.height < 1) continue; out.push({ w: b.width, h: b.height, bottom: b.bottom, cx: b.left + b.width / 2, cy: b.top + b.height / 2, tag: e.tagName });
        }
        const plot = root.querySelector('.plx-chart__plot svg, .plx-chart__engine svg').getBoundingClientRect();
        return { out, plot: { left: plot.left, top: plot.top, right: plot.right, bottom: plot.bottom } };
      });
      const analyse = async () => {
        const { out } = await shapes();
        // columns: filled shapes wider than 6px and taller than 3, no taller than the plot, sharing one bottom edge
        const cand = out.filter((s) => s.w > 8 && s.w < 140 && s.h > 3 && s.h < 400);
        const bottoms = {}; cand.forEach((s) => { const k = Math.round(s.bottom); bottoms[k] = (bottoms[k] || 0) + 1; });
        const base = Number(Object.keys(bottoms).sort((a, b) => bottoms[b] - bottoms[a])[0]);
        const cols = cand.filter((s) => Math.abs(s.bottom - base) <= 1.5).sort((a, b) => a.cx - b.cx);
        const dots = out.filter((s) => s.w >= 4 && s.w <= 14 && s.h >= 4 && s.h <= 14);
        const lines = out.filter((s) => s.w > 120 && s.h > 8 && s.h < 400 && !cols.includes(s));
        return { cols, dots, lines };
      };
      const hoverTip = async (i) => { const a = await analyse(); const x = a.cols[i].cx; const y = a.cols[i].cy; await page.mouse.move(5, 5); await page.mouse.move(x, y, { steps: 3 }); await wait(400); return page.evaluate(() => [...document.querySelectorAll('.plx-combo-chart .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | ')); };

      for (const [name, props] of [['shared axis', {}], ['dual axes', { axis: 'dual' }], ['no points', { showPoints: false }]]) {
        await mount(props);
        await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-combo-chart summary, .plx-combo-chart button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(500);
        const rows = await page.evaluate(() => document.querySelectorAll('.plx-combo-chart [role=row][data-plx-record], .plx-combo-chart table tbody tr, .plx-dialog [role=row][data-plx-record]').length);
        assert.equal(rows, 5, T + name + ': "Show the data" has a row per category (' + rows + ')');
        await page.keyboard.press('Escape'); await wait(300);
        // the Dialog is closed above (Escape)
        const a = await analyse();
        assert.equal(a.cols.length, 5, T + name + ': one column per value on the baseline (' + a.cols.length + ')');
        const ratios = a.cols.map((c, i) => c.h / BARS[i]); assert.ok(Math.max(...ratios) / Math.min(...ratios) < 1.06, T + name + ': column heights are in proportion to the values: ' + ratios.map((r) => r.toFixed(2)));
        assert.equal(a.dots.length, props.showPoints === false ? 0 : 5, T + name + ': a point per line value (' + a.dots.length + ')');
        assert.ok(a.lines.length >= 1, T + name + ': the line is drawn');
        const legends = await page.evaluate(() => document.querySelector('.plx-combo-chart').textContent);
        assert.ok(/Uploads/.test(legends) && /Approval rate/.test(legends), T + name + ': the legends name both series');
        const tip = await hoverTip(2);
        assert.ok(/Mar/.test(tip) && /Uploads/.test(tip) && /40/.test(tip) && /Approval rate/.test(tip) && (props.axis === 'dual' ? /90%/ : /35/).test(tip), T + name + ': the tooltip at March has both values: ' + tip);
        if (props.axis === 'dual') { const pct = await page.evaluate(() => [...document.querySelectorAll('.plx-combo-chart text, .plx-combo-chart .plx-chart__tick-label')].filter((e) => /%/.test(e.textContent) && !e.closest('[class*=tooltip]')).length); assert.ok(pct >= 3, T + name + ': the end axis carries percent labels (' + pct + ')'); }
        await page.mouse.move(5, 5);
      }
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('COMBO_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
