/* Plenix tests · #939 (ADR 0028): a date column with timestamp: "s" shows and sorts Unix seconds as the same local day as milliseconds and a Date.
   Usage: node tests/data-grid-timestamp-939.test.js   → DATA_GRID_TIMESTAMP_939_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9939, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 900, height: 700 }); await page.emulateTimezone('America/Los_Angeles');
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const out = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const day = new Date(2026, 2, 8, 22, 0, 0), later = new Date(2026, 2, 9, 9, 0, 0);
        const data = [{ id: 'a', n: 'later seconds', d: Math.floor(later.getTime() / 1000) }, { id: 'b', n: 'seconds', d: Math.floor(day.getTime() / 1000) }, { id: 'c', n: 'ms', e: day.getTime() }];
        const cols = [{ title: 'Note', field: 'n' }, { title: 'Date', field: 'd', type: 'date', timestamp: 's', sorter: 'date' }];
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'D', data: data.slice(0, 2), columns: cols, sort: [{ column: 'd', dir: 'asc' }] })));
        await new Promise((r) => setTimeout(r, 900));
        return [...document.querySelectorAll('#c [role=row]')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()).filter((t) => /seconds/.test(t));
      }, dir);
      assert.equal(out.length, 2, dir + ': two rows ' + JSON.stringify(out));
      assert.ok(/^seconds.*(Mar|3).*8/.test(out[0]) || /8/.test(out[0]), dir + ': earlier day first and read as March 8 (' + out[0] + ')');
      assert.ok(/9/.test(out[1]) && /later/.test(out[1]), dir + ': later day second, March 9 (' + out[1] + ')');
      assert.ok(!/1970|1,7|17\d{8}/.test(out.join(' ')), dir + ': never the raw seconds or 1970 (' + out.join(' | ') + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_TIMESTAMP_939_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
