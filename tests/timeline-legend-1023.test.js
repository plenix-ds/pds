// Plenix tests · #1023 (G2 on #987): the grouped Timeline's legend swatches are 12 x 12px squares (on and off, light, dark, RTL),
// and the legend sits 24px (space-stack-xl) above the first year heading, not 24px plus the 80px group gap.
//   node tests/timeline-legend-1023.test.js   → TIMELINE_LEGEND_1023_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9023;
  await serve(PORT); const browser = await launch();
  try {
    const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const rows = [];
    for (const [dir, mode] of [['ltr', 'light'], ['ltr', 'dark'], ['rtl', 'light']]) {
      rows.push(Object.assign({ dir, mode }, await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode);
        const h = React.createElement, cat = (n) => ({ id: 'c' + n, label: 'Category ' + n, color: String(n) });
        document.querySelector('main').innerHTML = '<div id="c" style="width:900px"></div>';
        const items = [{ id: 1, dateTime: '2026-03-02', title: 'Filed', category: cat(3) }, { id: 2, dateTime: '2025-01-20', title: 'Married', category: cat(1) }];
        ReactDOM.createRoot(document.getElementById('c')).render(h(Plenix.Timeline, { variant: 'grouped', label: 'History', legend: true, items, defaultHiddenCategories: undefined }));
        await new Promise((r) => setTimeout(r, 700));
        const off = document.querySelector('.plx-timeline__legend-item:last-child'); off.click(); await new Promise((r) => setTimeout(r, 300));
        const sw = [...document.querySelectorAll('.plx-timeline__swatch')].map((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); });
        const lg = document.querySelector('.plx-timeline__legend').getBoundingClientRect(), hd = document.querySelector('.plx-timeline__year').getBoundingClientRect();
        return { sw, gap: Math.round(hd.top - lg.bottom) };
      }, dir, mode)));
    }
    console.log(JSON.stringify(rows));
    for (const r of rows) {
      assert.deepEqual(r.sw, ['12x12', '12x12'], r.dir + ' ' + r.mode + ': swatches (on and off) are 12x12: ' + r.sw);
      assert.equal(r.gap, 24, r.dir + ' ' + r.mode + ': legend to first year is 24px, got ' + r.gap);
    }
    console.log('TIMELINE_LEGEND_1023_OK');
  } finally { await Promise.race([browser.close(), new Promise((x) => setTimeout(x, 5000))]); }
})().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
