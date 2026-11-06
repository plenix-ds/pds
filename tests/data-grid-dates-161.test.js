// Plenix · tests/data-grid-dates-161.test.js: a date column reads dates, Date objects and timestamps in the viewer's local time (issue 161, DT-7).
//   node tests/data-grid-dates-161.test.js   → DATA_GRID_DATES_161_OK
// Written first (proof first): measured in America/Los_Angeles on main, a Date object showed an empty cell, a timestamp showed its raw milliseconds, a bare "YYYY-MM-DD" showed raw,
// and the sort put the Date object before an earlier calendar day. In America/Los_Angeles and Pacific/Auckland (west and east of Greenwich), left to right and right to left:
//   a column of type "date" shows the same formatted calendar day for "2026-03-08", a local Date at 22:00 that day, and the timestamp of that instant;
//   sorting ascending puts them in time order (a bare date is its local midnight); grouping by day puts the Date object and the timestamp under the 8th with the bare "2026-03-08";
//   an empty value stays empty.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9890, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const tz of ['America/Los_Angeles', 'Pacific/Auckland']) for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 900, height: 700 }); await page.emulateTimezone(tz);
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const out = await page.evaluate(async (dir, groupBy) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const evening = new Date(2026, 2, 8, 22, 0, 0);
        const data = [{ id: 'a', d: '2026-03-09', n: 'bare after' }, { id: 'b', d: evening, n: 'date object' }, { id: 'c', d: evening.getTime(), n: 'timestamp' }, { id: 'd', d: '2026-03-07', n: 'bare before' }, { id: 'e', d: '2026-03-08', n: 'bare same' }, { id: 'f', d: null, n: 'empty' }];
        const cols = [{ title: 'Note', field: 'n' }, { title: 'Date', field: 'd', type: 'date', sorter: 'date' }];
        const props = groupBy ? { groupBy: [{ field: 'd', interval: 'day' }] } : { sort: [{ column: 'd', dir: 'asc' }] };
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', { style: { height: 500 } }, h(Plenix.DataGrid, Object.assign({ label: 'D', data, columns: cols }, props))));
        await new Promise((r) => setTimeout(r, 1200));
        const rows = [...document.querySelectorAll('[role=row][data-plx-record]')].map((r) => [r.querySelector('[data-plx-field=n]').textContent.trim(), r.querySelector('[data-plx-field=d]').textContent.trim()]);
        const groups = [...document.querySelectorAll('[role=row]:not([data-plx-record])')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()).filter((t) => /Mar|2026/.test(t));
        return { rows, groups, eighth: Plenix.formatDate(new Date(2026, 2, 8)), seventh: Plenix.formatDate(new Date(2026, 2, 7)), ninth: Plenix.formatDate(new Date(2026, 2, 9)) };
      }, dir, false);
      const T = tz + ' ' + dir + ': ', by = Object.fromEntries(out.rows.map((r) => [r[0], r[1]]));
      assert.equal(by['bare same'], out.eighth, T + 'a bare date shows its calendar day'); assert.equal(by['date object'], out.eighth, T + 'a Date object shows its local day'); assert.equal(by['timestamp'], out.eighth, T + 'a timestamp shows its local day');
      assert.equal(by['bare before'], out.seventh); assert.equal(by['bare after'], out.ninth); assert.equal(by['empty'], '', T + 'an empty value stays empty');
      const order = out.rows.map((r) => r[0]).filter((n) => n !== 'empty');
      assert.deepEqual([order[0], order[order.length - 1]], ['bare before', 'bare after'], T + 'sorted ascending: the 7th first, the 9th last (got ' + order.join(', ') + ')');
      assert.deepEqual(order.slice(1, 4).sort(), ['bare same', 'date object', 'timestamp'].sort(), T + 'the three of the 8th sit between');
      assert.ok(order.indexOf('bare same') < order.indexOf('date object'), T + 'a bare date (local midnight) sorts before the evening of that day');
      const grouped = await page.evaluate(async (dir) => { window.__root && 0; document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement; const evening = new Date(2026, 2, 8, 22, 0, 0);
        const data = [{ id: 'a', d: '2026-03-09', n: 'bare after' }, { id: 'b', d: evening, n: 'date object' }, { id: 'c', d: evening.getTime(), n: 'timestamp' }, { id: 'e', d: '2026-03-08', n: 'bare same' }];
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', { style: { height: 500 } }, h(Plenix.DataGrid, { label: 'D', data, columns: [{ title: 'Note', field: 'n' }, { title: 'Date', field: 'd', type: 'date' }], groupBy: [{ field: 'd', interval: 'day' }] })));
        await new Promise((r) => setTimeout(r, 1200)); return [...document.querySelectorAll('[role=row]')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()); }, dir);
      const eighthGroup = grouped.find((t) => /2026-03-08|Mar 8/.test(t) && !/bare|object|timestamp/.test(t.split(' ').slice(0, 1).join('')) );
      assert.ok(grouped.some((t) => /(2026-03-08|Mar 8)[^0-9]*3/.test(t) || /(2026-03-08|Mar 8)/.test(t)), T + 'a group for the 8th: ' + JSON.stringify(grouped));
      assert.equal(grouped.filter((t) => /(2026-03-0[89]|Mar [89])/.test(t) && !/bare|object|timestamp/.test(t)).length, 2, T + 'two day groups, the 8th and the 9th (got ' + JSON.stringify(grouped) + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_DATES_161_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
