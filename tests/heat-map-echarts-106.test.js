// Plenix · tests/heat-map-echarts-106.test.js: HeatMap behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027).
//   node tests/heat-map-echarts-106.test.js   → HEAT_MAP_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, the matrix and the calendar:
//   a cell for each value, laid out in the rows and columns' order; each cell the color of its data-viz step (the same as the legend's swatch for that step); a missing value an empty cell with a dashed edge;
//   the calendar's cells square, in weeks; the row and column names written; the keyboard goes cell to cell (arrows, Home, End), each said with its value, with the tooltip;
//   "Show the data" lists the cells; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9894, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const ROWS = ['Mon', 'Tue', 'Wed'], COLS = ['8:00', '9:00', '10:00', '11:00'], VALUES = [[1, 5, 9, null], [3, 7, 2, 10], [4, 6, 8, 0]];
    const DAYS = []; for (let d = 0; d < 21; d++) { const dt = new Date(2026, 0, 4 + d); DAYS.push({ date: dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'), value: d % 5 === 4 ? null : d % 7 + 1 }); }
    for (const dir of ['ltr', 'rtl']) for (const variant of ['matrix', 'calendar']) {
      const T = dir + ' ' + variant + ': ', cal = variant === 'calendar';
      await page.evaluate(async (dir, variant, rows, columns, values, days) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:640px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.HeatMap, variant === 'calendar' ? { title: 'Daily edits', description: 'Edits per day', variant, data: days.map((d) => ({ date: d.date, value: d.value })), valueLabel: 'Edits' } : { title: 'Uploads by hour', description: 'Uploads', rows, columns, values, valueLabel: 'Uploads' }));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, variant, ROWS, COLS, VALUES, DAYS);
      const info = await page.evaluate(() => {
        const root = document.querySelector('.plx-heat-map'), plot = root.querySelector('.plx-chart__plot svg').getBoundingClientRect(), cells = [];
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect.plx-heat-map__cell, .plx-chart__engine svg path')) {
          if (e.closest('[class*=tooltip]') || e.closest('.plx-heat-map-scale')) continue;
          const b = e.getBoundingClientRect(), cs = getComputedStyle(e); if (b.width < 6 || b.height < 6 || (b.width >= plot.width - 2 && b.height >= plot.height - 2)) continue;
          cells.push({ l: b.left, t: b.top, w: b.width, h: b.height, cx: b.left + b.width / 2, cy: b.top + b.height / 2, fill: cs.fill, dash: cs.strokeDasharray });
        }
        const swatches = [...root.querySelectorAll('.plx-heat-map-scale__swatch[data-plx-dataviz]')].map((s) => [s.getAttribute('data-plx-dataviz'), getComputedStyle(s).backgroundColor]);
        return { cells, swatches };
      });
      const expectedValues = cal ? DAYS.map((d) => d.value) : [].concat(...VALUES);
      // a cell per value (a missing value is an empty, dashed cell too)
      const cells = info.cells.filter((c, i, a) => !a.slice(0, i).some((o) => Math.abs(o.l - c.l) < 1 && Math.abs(o.t - c.t) < 1 && Math.abs(o.w - c.w) < 1));
      assert.equal(cells.length, expectedValues.length, T + 'a cell for each value (' + cells.length + ')');
      const missing = cells.filter((c) => c.dash && c.dash !== 'none' && c.dash !== '0px' && !/^0/.test(c.dash));
      assert.equal(missing.length, expectedValues.filter((v) => v === null).length, T + 'a missing value is an empty cell with a dashed edge (' + missing.length + ')');
      // colors: each filled cell is the color of its step: the lowest value the first swatch, the highest the last (the scale runs from the data's lowest to its highest)
      const sw = info.swatches.map((s) => s[1]); assert.equal(sw.length, 7, T + 'the legend shows seven steps');
      const filled = cells.filter((c) => !missing.includes(c)); const colors = new Set(filled.map((c) => c.fill)); assert.ok(colors.size >= 3, T + 'cells take several steps (' + colors.size + ')');
      filled.forEach((c) => assert.ok(sw.includes(c.fill), T + 'a cell color is one of the legend\'s steps: ' + c.fill));
      // layout: columns left to right in reading order and rows top to bottom
      const xs = [...new Set(cells.map((c) => Math.round(c.cx)))].sort((a, b) => a - b), ys = [...new Set(cells.map((c) => Math.round(c.cy)))].sort((a, b) => a - b);
      assert.equal(xs.length, cal ? 3 : 4, T + 'the columns (' + xs.length + ')'); assert.equal(ys.length, cal ? 7 : 3, T + 'the rows (' + ys.length + ')');
      // the gap between neighbours is a tenth of a step (as the band scale left it), and the cells keep their rounded corners (G2: the look must not change with the engine)
      const row0 = cells.filter((c) => Math.abs(c.cy - cells[0].cy) < 2).sort((a, b) => a.l - b.l);
      if (row0.length > 1) { const step = row0[1].l - row0[0].l, gap = step - row0[0].w; assert.ok(Math.abs(gap - step * 0.1) <= 1.5, T + 'the gap is a tenth of a step (' + gap.toFixed(1) + ' of ' + step.toFixed(1) + ')'); }
      const rounded = await page.evaluate(() => [...document.querySelectorAll('.plx-heat-map .plx-chart__engine svg path')].some((e) => /[AaCcQq]/.test(e.getAttribute('d') || '')));
      assert.ok(rounded, T + 'the cells have rounded corners');
      if (cal) cells.forEach((c) => assert.ok(Math.abs(c.w - c.h) <= 2, T + 'the calendar\'s cells are square'));
      const text = await page.evaluate(() => document.querySelector('.plx-heat-map').textContent);
      if (!cal) { for (const w of ROWS.concat(COLS)) assert.ok(text.includes(w), T + 'the name ' + w + ' is written'); } else { assert.ok(/Mon/.test(text) && /Jan/.test(text), T + 'weekday and month names are written'); }
      // keyboard: the first cell, then right and down: each said with its value; the tooltip shows it
      await page.focus('.plx-heat-map [role=group][tabindex="0"]'); await page.keyboard.press('Home'); await wait(300);
      const say = () => page.evaluate(() => (document.querySelector('[aria-live]') || {}).textContent || '');
      const tip = () => page.evaluate(() => [...document.querySelectorAll('.plx-heat-map .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
      const first = await say(); await page.keyboard.press('ArrowRight'); await wait(250); const second = await say(); await page.keyboard.press('ArrowDown'); await wait(250); const third = await say();
      assert.ok(first && second && third && new Set([first, second, third]).size === 3, T + 'each move says a different cell: ' + JSON.stringify([first, second, third]));
      assert.ok(/\d|No data/.test(third) && (await tip()).length > 0, T + 'the cell\'s value is said and shown: ' + third + ' | ' + (await tip()));
      await page.keyboard.press('End'); await wait(250); assert.notEqual(await say(), third, T + 'End moves to the end of the row');
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-heat-map summary, .plx-heat-map button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-heat-map [role=row][data-plx-record], .plx-heat-map table tbody tr').length);
      assert.equal(rows, cal ? DAYS.length : 12, T + '"Show the data" lists the cells (' + rows + ')');
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('HEAT_MAP_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
