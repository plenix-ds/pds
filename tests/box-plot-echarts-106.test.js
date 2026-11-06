// Plenix · tests/box-plot-echarts-106.test.js: BoxPlot behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/box-plot-echarts-106.test.js   → BOX_PLOT_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, vertical and horizontal, groups given as summaries:
//   a box from the first to the third quartile, as long as that range on one scale; a line across the box at the median; a whisker from the box to each end (as long as the range it spans);
//   an outlier point at each value beyond the whiskers (and none with showOutliers off); the pointer over a group shows the five numbers; "Show the data" has a row per group;
//   boxStats computes the summary from values (Tukey's whiskers); no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9891, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const GROUPS = [{ id: 'd', label: 'Design', stats: { min: 2, q1: 6, median: 9, q3: 14, max: 22, outliers: [38] } }, { id: 'l', label: 'Legal', stats: { min: 4, q1: 7, median: 8, q3: 10, max: 15, outliers: [] } }, { id: 'o', label: 'Ops', stats: { min: 1, q1: 3, median: 5, q3: 8, max: 12, outliers: [20, 26] } }];
    // boxStats: the summary from values
    const bs = await page.evaluate(() => window.Plenix.boxStats([1, 2, 3, 4, 5, 6, 7, 8, 9, 50]));
    assert.deepEqual([bs.min, bs.q1, bs.median, bs.q3, bs.max, bs.outliers, bs.n], [1, 3.25, 5.5, 7.75, 9, [50], 10], 'boxStats: quartiles and Tukey whiskers');
    for (const dir of ['ltr', 'rtl']) for (const orientation of ['vertical', 'horizontal']) {
      const T = dir + ' ' + orientation + ': ', horizontal = orientation === 'horizontal';
      const mount = (props) => page.evaluate(async (dir, orientation, groups, props) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.BoxPlot, Object.assign({ title: 'Review time', description: 'Hours by team', groups, orientation, valueLabel: 'Hours' }, props)));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, orientation, GROUPS, props);
      const shapes = () => page.evaluate(() => {
        const root = document.querySelector('.plx-box-plot'), out = [], box = root.querySelector('.plx-chart__plot svg').getBoundingClientRect();
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect, .plx-chart__plot svg line, .plx-chart__plot svg circle, .plx-chart__engine svg path, .plx-chart__engine svg rect, .plx-chart__engine svg circle, .plx-chart__engine svg line')) {
          if (e.closest('[class*=tooltip]') || e.classList.contains('plx-chart-keys__hit') || (e.tagName === 'rect' && e.classList.contains('plx-box-plot__group'))) continue;   // the pointer's hit areas are not marks
          const b = e.getBoundingClientRect(); if (b.width < 0.5 && b.height < 0.5) continue; if (b.width >= box.width - 4 && b.height >= box.height - 40) continue;
          out.push({ l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height, cx: b.left + b.width / 2, cy: b.top + b.height / 2 });
        }
        return out;
      });
      for (const [name, props] of [['with outliers', {}], ['without outliers', { showOutliers: false }]]) {
        await mount(props);
        const all = await shapes();
        const along = (s) => (horizontal ? s.w : s.h), across = (s) => (horizontal ? s.h : s.w), pos = (s) => (horizontal ? s.cx : s.cy), lo = (s) => (horizontal ? s.l : s.t), hi = (s) => (horizontal ? s.r : s.b), centre = (s) => (horizontal ? s.cy : s.cx);
        // the median lines (thin along the value axis, as wide across as a box) give each group's place and the scale: groups 0 and 2 have medians 9 and 5
        const ext = Math.max(...all.map(across)), thick = all.filter((s) => across(s) >= 20 && across(s) < ext * 0.6);   // not the grid lines, which run the plot's whole way across
        const wide = Math.max(...thick.map(across)), medianLines = thick.filter((s) => along(s) <= 3 && across(s) >= wide - 3).sort((a, b) => centre(a) - centre(b));   // the medians run the box's whole thickness (a whisker's cap is half of it)
        assert.equal(medianLines.length, 3, T + name + ': a median line per group (' + medianLines.length + ')');
        const kk = (pos(medianLines[2]) - pos(medianLines[0])) / (GROUPS[2].stats.median - GROUPS[0].stats.median);   // pixels per unit, signed (up is negative)
        const at = (v) => pos(medianLines[0]) + (v - GROUPS[0].stats.median) * kk;
        GROUPS.forEach((g, i) => {
          const s = g.stats, m = medianLines[i], c = centre(m);
          assert.ok(Math.abs(pos(m) - at(s.median)) <= 3, T + name + ': the median line of ' + g.label + ' is at ' + s.median);
          // the box and whiskers: the shapes on this group's line (the old drawing's pieces, or ECharts' one glyph): together from the minimum to the maximum; a thick one is the box (q1 to q3) or the whole glyph
          const mine = all.filter((x) => Math.abs(centre(x) - c) <= 4 && x !== m && across(x) <= across(m) + 4 && !(along(x) >= 3 && along(x) <= 14 && across(x) >= 3 && across(x) <= 14));
          const from = Math.min(...mine.map(lo)), to = Math.max(...mine.map(hi));
          assert.ok(Math.abs(from - Math.min(at(s.min), at(s.max))) <= 3 && Math.abs(to - Math.max(at(s.min), at(s.max))) <= 3, T + name + ': the whiskers run from the minimum to the maximum of ' + g.label + ' (' + from.toFixed(1) + '..' + to.toFixed(1) + ' vs ' + at(s.max).toFixed(1) + '..' + at(s.min).toFixed(1) + ')');
          const boxLen = Math.abs(at(s.q3) - at(s.q1)), glyphLen = Math.abs(at(s.max) - at(s.min));
          assert.ok(mine.some((x) => across(x) >= 20 && (Math.abs(along(x) - boxLen) <= 3 || Math.abs(along(x) - glyphLen) <= 3)), T + name + ': a box for ' + g.label + ' (the quartile range ' + boxLen.toFixed(0) + 'px, or the whole glyph)');
          const dots = all.filter((x) => Math.abs(centre(x) - c) <= 4 && along(x) >= 3 && along(x) <= 14 && across(x) >= 3 && across(x) <= 14 && (pos(x) < Math.min(at(s.min), at(s.max)) - 1 || pos(x) > Math.max(at(s.min), at(s.max)) + 1));
          if (name === 'with outliers') s.outliers.forEach((v) => assert.ok(dots.some((x) => Math.abs(pos(x) - at(v)) <= 3), T + name + ': an outlier point at ' + v + ' for ' + g.label)); else assert.equal(dots.length, 0, T + name + ': no outlier points (' + dots.length + ')');
        });
      }
      // the tooltip under the pointer
      await mount({}); const all2 = await shapes(); const bx = all2.filter((s) => (horizontal ? s.h : s.w) >= 20 && (horizontal ? s.h : s.w) < 200 && (horizontal ? s.w : s.h) >= 6).sort((a, b) => (horizontal ? a.cy - b.cy : a.cx - b.cx))[1];
      await page.mouse.move(5, 5); await page.mouse.move(bx.cx, bx.cy, { steps: 3 }); await wait(400);
      const tip = await page.evaluate(() => [...document.querySelectorAll('.plx-box-plot .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
      assert.ok(/Legal/.test(tip) && /15/.test(tip) && /10/.test(tip) && /8/.test(tip) && /7/.test(tip) && /4/.test(tip), T + 'the tooltip lists the five numbers of Legal: ' + tip); await page.mouse.move(5, 5);
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-box-plot summary, .plx-box-plot button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-box-plot [role=row][data-plx-record], .plx-box-plot table tbody tr').length);
      assert.equal(rows, 3, T + '"Show the data" has a row per group (' + rows + ')');
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('BOX_PLOT_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
