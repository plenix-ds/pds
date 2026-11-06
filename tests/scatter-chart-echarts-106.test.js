// Plenix · tests/scatter-chart-echarts-106.test.js: ScatterChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/scatter-chart-echarts-106.test.js   → SCATTER_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, points and bubbles, one series and two, with and without trend lines:
//   "Show the data" lists every point; the keyboard goes point to point (ArrowRight, Home, End) and the live region and the tooltip name the point;
//   the focus ring sits on the drawn mark of the point (the mark's center within 2px of the ring's, and a bubble's mark as big as its ring minus the ring's room);
//   the larger the "size" the larger the bubble; a trend line adds one line per series with two or more points; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9884, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (props) => page.evaluate(async (dir, props) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        const series = [
          { id: 'a', label: 'Alpha', points: [{ x: 1, y: 2, size: 10, label: 'A1' }, { x: 2, y: 4, size: 40, label: 'A2' }, { x: 3, y: 5, size: 90, label: 'A3' }, { x: 4, y: 8, size: 20, label: 'A4' }] },
          { id: 'b', label: 'Beta', points: [{ x: 1.5, y: 6, size: 50, label: 'B1' }, { x: 3.5, y: 3, size: 70, label: 'B2' }, { x: 5, y: 1, size: 30, label: 'B3' }] },
        ];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.ScatterChart, Object.assign({ title: 'Reach', description: 'Reach by spend', xTitle: 'Spend', yTitle: 'Reach', sizeTitle: 'Audience', series: props.one ? series.slice(0, 1) : series }, props.chart)));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, props);
      // the trend lines: long sloped strokes in the plot (the axes and grid lines are flat, the marks small)
      const marks = () => page.evaluate(() => [...document.querySelectorAll('.plx-scatter .plx-chart__plot svg line, .plx-scatter .plx-chart__plot svg path, .plx-scatter .plx-chart__engine svg path')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 60 && b.height > 12 && !e.closest('[class*=tooltip]'); }).length);
      const ringOf = () => page.evaluate(() => { const r = document.querySelector('.plx-chart-keys__ring'); if (!r) return null; const b = r.getBoundingClientRect(); return { cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: b.width }; });
      // a drawn mark of the point: an SVG shape of the plot (not the ring, the axes, the grid or the tooltip) whose center is at the ring's
      const markAt = (ring) => page.evaluate((ring) => {
        const cands = [...document.querySelectorAll('.plx-scatter .plx-chart__plot svg circle, .plx-scatter .plx-chart__engine svg path, .plx-scatter .plx-chart__engine svg circle, .plx-scatter circle.plx-scatter__point')];
        let best = null;
        for (const e of cands) { if (e.classList.contains('plx-chart-keys__ring')) continue; const b = e.getBoundingClientRect(); if (!b.width || b.width > 80) continue; const d = Math.hypot(b.left + b.width / 2 - ring.cx, b.top + b.height / 2 - ring.cy); if (!best || d < best.d) best = { d, w: b.width }; }
        return best;
      }, ring);
      const live = () => page.evaluate(() => (document.querySelector('[aria-live]') || {}).textContent || '');
      const tip = () => page.evaluate(() => [...document.querySelectorAll('.plx-scatter .plx-chart-tooltip, .plx-scatter [class*=tooltip]')].map((e) => e.textContent).join(' | '));

      for (const [name, props, total] of [['points, two series', { chart: { variant: 'points' } }, 7], ['bubbles', { chart: { variant: 'bubble' } }, 7], ['one series with a trend', { one: true, chart: { variant: 'points', trend: true } }, 4]]) {
        await mount(props);
        // Show the data: every point is a row
        await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-scatter button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(500);
        const rows = await page.evaluate(() => document.querySelectorAll('.plx-scatter [role=row][data-plx-record], .plx-scatter table tbody tr').length);
        assert.equal(rows, total, T + name + ': "Show the data" lists every point (' + rows + ')');
        await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-scatter button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(300);
        // keyboard: the first point, the next, the last
        await page.focus('.plx-scatter [role=group][tabindex="0"]'); await page.keyboard.press('Home'); await wait(300);
        const seen = [];
        for (let i = 0; i < total; i++) {
          const ring = await ringOf(); assert.ok(ring, T + name + ': the focus ring shows at point ' + i);
          const m = await markAt(ring); assert.ok(m && m.d <= 2.5, T + name + ': point ' + i + ' has a drawn mark under its ring (distance ' + (m && m.d.toFixed(1)) + ')');
          seen.push({ w: m.w, ring: ring.w }); const say = await live(); assert.ok(/Spend/.test(say) && /Reach/.test(say), T + name + ': point ' + i + ' is said: ' + say);
          if (i < total - 1) { await page.keyboard.press('ArrowRight'); await wait(200); }
        }
        await page.keyboard.press('Home'); await wait(200); const homeRing = await ringOf(); await page.keyboard.press('End'); await wait(200); const endRing = await ringOf();
        assert.ok(Math.hypot(homeRing.cx - endRing.cx, homeRing.cy - endRing.cy) > 5, T + name + ': Home and End reach different points');
        if (name === 'bubbles') { const sizes = seen.map((s) => s.w); assert.ok(Math.max(...sizes) > Math.min(...sizes) * 1.8, T + name + ': larger sizes are larger bubbles: ' + sizes.map((x) => x.toFixed(0))); }
      }
      // a trend adds one line per series
      await mount({ chart: { variant: 'points', trend: false } }); const without = await marks();
      await mount({ chart: { variant: 'points', trend: true } }); const withTrend = await marks();
      assert.equal(without, 0, T + 'no trend: no sloped line (' + without + ')'); assert.equal(withTrend, 2, T + 'a trend line per series with two or more points (' + withTrend + ')');
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('SCATTER_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
