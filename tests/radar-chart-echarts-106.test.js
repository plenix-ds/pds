// Plenix · tests/radar-chart-echarts-106.test.js: RadarChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027).
//   node tests/radar-chart-echarts-106.test.js   → RADAR_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, one item and two compared:
//   a point per measure for each item, at its value's distance from the center (zero at the center, the scale's end on the outer ring) and at its measure's angle, clockwise from the top;
//   the measures' names around the web; the pointer over a point shows the item, the measure and the value; "Show the data" has a row per measure; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9892, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const AXES = [{ key: 'res', label: 'Resolution' }, { key: 'color', label: 'Color' }, { key: 'meta', label: 'Metadata' }, { key: 'size', label: 'File size' }, { key: 'rights', label: 'Rights' }];
    const SERIES = [{ id: 'hero', label: 'Hero image', values: { res: 9, color: 8, meta: 7, size: 4, rights: 9 } }, { id: 'thumb', label: 'Thumbnail', values: { res: 5, color: 6, meta: 3, size: 8, rights: 2 } }];
    for (const dir of ['ltr', 'rtl']) for (const count of [1, 2]) {
      const T = dir + ' ' + count + ' item' + (count > 1 ? 's' : '') + ': ';
      await page.evaluate(async (dir, axes, series) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:640px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.RadarChart, { title: 'Asset quality', description: 'Scores', axes, series, max: 10 }));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, AXES, SERIES.slice(0, count));
      const info = await page.evaluate(() => {
        const root = document.querySelector('.plx-radar-chart'), out = { dots: [], rings: [] };
        for (const e of root.querySelectorAll('.plx-chart__plot svg circle.plx-radar-chart__point, .plx-chart__plot svg polygon.plx-radar-chart__ring, .plx-chart__engine svg path, .plx-chart__engine svg circle')) {
          if (e.closest('[class*=tooltip]')) continue;
          const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
          if (e.matches('circle.plx-radar-chart__point') || (e.matches('.plx-chart__engine svg path, .plx-chart__engine svg circle') && b.width >= 4 && b.width <= 14 && Math.abs(b.width - b.height) < 2)) out.dots.push({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
          else if (e.matches('polygon.plx-radar-chart__ring') || (b.width > 60 && b.height > 60 && cs.fill === 'none' || b.width > 60 && b.height > 60)) out.rings.push({ l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height });
        }
        return out;
      });
      assert.equal(info.dots.length, 5 * count, T + 'a point per measure for each item (' + info.dots.length + ')');
      // the web: the outermost ring is the widest shape; for a regular pentagon with a vertex on top, the center is half a width across and R below the top, R = height / (1 + cos(36°))
      const ring = info.rings.slice().sort((a, b) => b.w - a.w)[0], n = AXES.length, R = ring.h / (1 + Math.cos(Math.PI / n)), cx = (ring.l + ring.r) / 2, cy = ring.t + R;
      assert.ok(R > 60, T + 'the web has a size (' + R.toFixed(0) + ')');
      // the points of each item, in the measures' order: by angle from the top, clockwise
      const polar = info.dots.map((d) => { const dx = d.x - cx, dy = d.y - cy; let a = Math.atan2(dx, -dy) * 180 / Math.PI; if (a < 0) a += 360; return { r: Math.hypot(dx, dy), a }; });
      SERIES.slice(0, count).forEach((s) => {
        AXES.forEach((ax, ai) => {
          const want = { r: (s.values[ax.key] / 10) * R, a: (360 * ai) / n };
          const hit = polar.find((p) => Math.abs(p.r - want.r) <= 0.05 * R + 3 && Math.min(Math.abs(p.a - want.a), 360 - Math.abs(p.a - want.a)) <= 4);
          assert.ok(hit, T + s.label + ' at ' + ax.label + ': a point at ' + (want.r / R).toFixed(2) + ' of the way out, ' + want.a.toFixed(0) + '° clockwise from the top');
        });
      });
      // the measures' names
      const text = await page.evaluate(() => document.querySelector('.plx-radar-chart').textContent);
      for (const a of AXES) assert.ok(text.includes(a.label), T + 'the measure ' + a.label + ' is named around the web');
      // the pointer over a point
      const target = polar.length ? info.dots[0] : null;
      await page.mouse.move(5, 5); await page.mouse.move(target.x, target.y, { steps: 3 }); await wait(400);
      const tip = await page.evaluate(() => [...document.querySelectorAll('.plx-radar-chart .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
      assert.ok(/Resolution|Color|Metadata|File size|Rights/.test(tip) && /\d/.test(tip), T + 'the tooltip names the measure and the value: ' + tip); await page.mouse.move(5, 5);
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-radar-chart summary, .plx-radar-chart button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-radar-chart [role=row][data-plx-record], .plx-radar-chart table tbody tr, .plx-dialog [role=row][data-plx-record]').length);
      assert.equal(rows, 5, T + '"Show the data" has a row per measure (' + rows + ')');
      await page.keyboard.press('Escape'); await wait(300);
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('RADAR_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
