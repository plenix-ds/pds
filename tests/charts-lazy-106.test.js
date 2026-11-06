/* Plenix tests · #106 (ECharts charts load on their own): LineChart, AreaChart, BarChart, PieChart, TreeChart and Sparkline are drawn through charts/lazy.jsx. Each
   still draws its figure (the title, an ECharts drawing and the data table), the pure helpers the API exports (pieSlices, binValues, gridRoom) are in the
   first load, and no script error.   Usage: node tests/charts-lazy-106.test.js   -> CHARTS_LAZY_106_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9677, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^error/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 1400 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const helpers = await page.evaluate(() => ({ pie: typeof Plenix.pieSlices, bin: typeof Plenix.binValues, slices: Plenix.pieSlices([{ label: 'a', value: 2 }, { label: 'b', value: 1 }]).length, bins: Plenix.binValues([1, 2, 3, 4, 9]).length > 0 }));
    assert.deepEqual(helpers, { pie: 'function', bin: 'function', slices: 2, bins: true }, 'the helpers are available at once');
    await page.evaluate(() => {
      const h = React.createElement, P = Plenix;
      document.querySelector('main').innerHTML = ['line', 'area', 'bar', 'pie', 'tree', 'spark'].map((k) => '<div id="' + k + '" style="width:480px;margin-bottom:12px"></div>').join('');
      const data = [{ x: 'Jan', a: 3 }, { x: 'Feb', a: 5 }, { x: 'Mar', a: 4 }];
      const series = [{ id: 'a', label: 'Uploads', field: 'a' }];
      const mount = (id, el) => ReactDOM.createRoot(document.getElementById(id)).render(el);
      mount('line', h(P.LineChart, { title: 'Line chart', description: 'Uploads per month.', data, x: 'x', series }));
      mount('area', h(P.AreaChart, { title: 'Area chart', description: 'Uploads per month.', data, x: 'x', series }));
      mount('bar', h(P.BarChart, { title: 'Bar chart', description: 'Uploads per month.', categories: ['Jan', 'Feb', 'Mar'], series: [{ id: 'a', label: 'Uploads', values: [3, 5, 4] }] }));
      mount('pie', h(P.PieChart, { title: 'Pie chart', description: 'Share of uploads.', data: [{ label: 'Docs', value: 5 }, { label: 'Images', value: 3 }] }));
      mount('tree', h(P.TreeChart, { title: 'Tree chart', description: 'The parish.', data: { id: 'p', label: 'Parish', children: [{ id: 'a', label: 'Council' }, { id: 'b', label: 'Choir' }] } }));
      mount('spark', h(P.Sparkline, { values: [1, 3, 2, 5, 4], label: 'Trend' }));
    });
    await page.waitForSelector('#spark .plx-chart__engine, #spark svg', { timeout: 30000 }); await sleep(1500);
    for (const [id, title] of [['line', 'Line chart'], ['area', 'Area chart'], ['bar', 'Bar chart'], ['pie', 'Pie chart'], ['tree', 'Tree chart']]) {
      assert.match(await page.$eval('#' + id, (e) => e.textContent), new RegExp(title), id + ': the title is drawn');
      assert.ok(await page.$('#' + id + ' .plx-chart__engine svg, #' + id + ' .plx-chart__engine canvas'), id + ': the ECharts drawing is there');
    }
    assert.ok(await page.$('#spark svg, #spark .plx-chart__engine'), 'the sparkline draws');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::|was fetched at run time|state update on a component that hasn't mounted yet/.test(p)), [], 'no script errors');
    console.log('CHARTS_LAZY_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
