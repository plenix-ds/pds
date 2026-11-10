/* Plenix tests · #1219 (performance rule 4, #1201; D-0160): DataGrid `cachedRows` shows the app's cached rows at once and refreshes quietly.
   Summary: a DataGrid with fetchRows (1.5 s, a slow server) and cachedRows(request) → { rows, total } | undefined:
     with a cache: its rows draw at once (no empty grid, no spinner even after the 1 s region delay); fetchRows runs once with the same request; its answer
       replaces the rows in place (a focused row keeps the focus, no scroll jump) with no spinner; a failure keeps the cached rows and shows Retry (Retry asks again);
     without a cache (cachedRows missing, or undefined): as before: empty, the spinner after 1 s, then the rows;
     in the fill mode (default) and the pages mode; left to right.
   Checks: AC-1 cached rows at once, no LoadingState; AC-2 fetchRows once, same request, rows replaced in place, focus kept; AC-3 failure keeps the rows and shows Retry;
     AC-4 no cache: unchanged; AC-5 the cache is asked for with the request fetchRows gets.
   Proof first: before the change cachedRows is ignored: the grid starts empty and shows the spinner.
   Usage: node tests/data-grid-cached-rows-1219.test.js   → DATA_GRID_CACHED_ROWS_1219_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9815, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const mode of ['fill', 'pages']) {
      const T = mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (opts) => page.evaluate((mode, opts) => {
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        document.querySelector('main').replaceChildren(Object.assign(document.createElement('div'), { id: 'c' }));
        window.__fetches = []; window.__cacheCalls = []; let failFirst = !!opts.fail;
        const fresh = [{ id: 1, name: 'Fresh one' }, { id: 2, name: 'Fresh two' }, { id: 3, name: 'Fresh three' }];
        const cached = [{ id: 1, name: 'Cached one' }, { id: 2, name: 'Cached two' }];
        const fetchRows = (req) => { window.__fetches.push({ page: req.page, size: req.size, sort: req.sort, search: req.search || null }); return new Promise((ok, bad) => setTimeout(() => { if (failFirst) { failFirst = false; bad(new Error('Server busy')); } else ok({ rows: fresh, total: 3 }); }, 1500)); };
        const props = { label: 'Cases', index: 'id', data: [], fetchRows, mode, columns: [{ field: 'name', title: 'Name', kind: 'name' }] };
        if (opts.cache === 'rows') props.cachedRows = (req) => { window.__cacheCalls.push({ page: req.page, size: req.size, sort: req.sort, search: req.search || null }); return { rows: cached, total: 2 }; };
        if (opts.cache === 'undefined') props.cachedRows = () => undefined;
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(P.DataGrid, props));
      }, mode, opts);
      const look = () => page.evaluate(() => ({ names: [...document.querySelectorAll('#c [role=row][data-plx-record] [data-plx-field=name]')].map((e) => e.textContent.trim()), spinner: document.querySelectorAll('#c .plx-spinner').length,
        retry: [...document.querySelectorAll('#c button')].some((b) => /retry/i.test(b.textContent)), cover: document.querySelectorAll('#c .plx-data-grid__error').length, fetches: window.__fetches.length }));
      // no cache: as before (empty, the spinner after 1 s, then the rows)
      await mount({}); await wait(150); let s = await look();
      assert.deepEqual(s.names, [], T + 'AC-4: without a cache the grid starts empty'); await wait(1100); s = await look();
      assert.ok(s.spinner > 0 && s.names.length === 0, T + 'AC-4: the spinner shows after 1 s: ' + JSON.stringify(s)); await wait(600); s = await look();
      assert.deepEqual(s.names, ['Fresh one', 'Fresh two', 'Fresh three'], T + 'AC-4: then the rows');
      await mount({ cache: 'undefined' }); await wait(150); s = await look();
      assert.deepEqual(s.names, [], T + 'AC-4: a cache that has nothing for this request (undefined): as before');
      // with a cache: the cached rows at once, no spinner, replaced in place
      await mount({ cache: 'rows' }); await wait(120); s = await look();
      assert.deepEqual(s.names, ['Cached one', 'Cached two'], T + 'AC-1: the cached rows draw at once: ' + JSON.stringify(s));
      await page.evaluate(() => { const c = document.querySelector('#c [role=row][data-plx-record="number:2"] [data-plx-field=name]') || document.querySelectorAll('#c [role=row][data-plx-record] [data-plx-field=name]')[1]; c.setAttribute('data-probe', ''); c.focus(); });
      await wait(1100); s = await look();
      assert.equal(s.spinner, 0, T + 'AC-1: no spinner at 1.2 s, the rows stay: ' + JSON.stringify(s)); assert.deepEqual(s.names, ['Cached one', 'Cached two'], T + 'AC-1: the cached rows are still there until the answer');
      await wait(600); s = await look();
      assert.deepEqual(s.names, ['Fresh one', 'Fresh two', 'Fresh three'], T + 'AC-2: the answer replaces the rows: ' + JSON.stringify(s));
      const kept = await page.evaluate(() => { const p = document.querySelector('[data-probe]'); return { sameNode: !!p && p.isConnected && /Fresh two/.test(p.textContent), focus: document.activeElement === p }; });
      assert.ok(kept.sameNode, T + 'AC-2: the row is the same element, updated in place'); assert.ok(kept.focus, T + 'AC-2: the focus stays on it');
      assert.equal(s.fetches, 1, T + 'AC-2: fetchRows ran once');
      // AC-5: the cache is asked with the request fetchRows gets
      const calls = await page.evaluate(() => ({ cache: window.__cacheCalls, fetch: window.__fetches }));
      assert.ok(calls.cache.length >= 1 && JSON.stringify(calls.cache[0]) === JSON.stringify(calls.fetch[0]), T + 'AC-5: cachedRows gets the same request as fetchRows: ' + JSON.stringify(calls));
      // AC-3: a failure keeps the cached rows and shows Retry
      await mount({ cache: 'rows', fail: true }); await wait(1900); s = await look();
      assert.deepEqual(s.names, ['Cached one', 'Cached two'], T + 'AC-3: a failed refresh keeps the cached rows: ' + JSON.stringify(s)); assert.ok(s.retry, T + 'AC-3: a Retry shows'); assert.equal(s.cover, 0, T + 'AC-3: nothing covers the table');
      await page.evaluate(() => [...document.querySelectorAll('#c button')].find((b) => /retry/i.test(b.textContent)).click()); await wait(1900); s = await look();
      assert.deepEqual(s.names, ['Fresh one', 'Fresh two', 'Fresh three'], T + 'AC-3: Retry asks again and the rows are replaced'); assert.equal(s.fetches, 2);
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_CACHED_ROWS_1219_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
