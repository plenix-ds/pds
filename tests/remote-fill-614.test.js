/* Plenix tests · a DataGrid with rows from a server stops on an empty or short page, resets the page with search, and
   drops a late page after a sort (issue 614, QA follow-ups on #612).
   Summary: DataGrids with fetchRows and fake servers, 50 rows per page:
       fill, the total says 1,000 but the server has 100 rows (page 3 comes back empty): it stops after page 3; the 100
       rows stay, aria-rowcount becomes 101 and no loading row is left
       fill, the total says 1,000 but the server has 120 rows (page 3 brings 20): it stops after page 3, the last row is
       Record 120 and aria-rowcount is 121
       fill and load-more, a search change after page 2: the next request is page 1 with the new search; no request
       for an old page number with the new search goes out
       fill, a sort while page 2 is still on its way (the fake server ignores the abort and answers late): the late
       page is not appended; the list is the sorted page 1 only
   Proof first: before issue 614 the first two grids kept asking for page 4, 5, … without end (the stop test was rows >=
   total), and a search change past page 1 first asked for the old page number with the new search. The sort case
   guards the existing design (the fetch effect drops an answer whose request was replaced); it fails if that guard goes.
   Usage: node tests/remote-fill-614.test.js   → REMOTE_FILL_614_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9661, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });

    // mount(options): a fresh grid; the fake server has `have` rows (`sortedHave` once sorted), says `total`, answers in
    // 100ms (with `slow`, the unsorted page 2 in 1,500ms and the rest in 200ms) and ignores the abort signal, so a
    // replaced request still answers late
    const mount = (options) => page.evaluate((o) => {
      const h = React.createElement, P = window.Plenix;
      if (window.root) window.root.unmount();
      document.body.innerHTML = '<div id="c"></div>';
      window.calls = [];
      const delay = (page, sort) => !o.slow ? 100 : page === 2 && sort === '[]' ? 1500 : 200;
      const fetchRows = ({ page, size, sort, search }) => { const s = JSON.stringify(sort || []); window.calls.push({ page, size, sort: s, search: search || '' });
        return new Promise((ok) => setTimeout(() => {
          const sorted = s !== '[]', have = sorted ? o.sortedHave : o.have, from = (page - 1) * size, word = sorted ? 'Sorted ' : 'Record ';
          ok({ rows: Array.from({ length: Math.max(0, Math.min(size, have - from)) }, (_, i) => ({ id: from + i + 1, name: word + (from + i + 1) })), total: sorted ? o.sortedHave : o.total });
        }, delay(page, s))); };
      function Host() { const [search, setSearch] = React.useState(''); window.setSearch = setSearch;
        return h(P.DataGrid, { label: 'Records', index: 'id', data: [], fetchRows, search, mode: o.mode,
          columns: [{ field: 'name', title: 'Name', kind: 'name' }, { field: 'id', title: 'Number', kind: 'data' }] }); }
      window.root = ReactDOM.createRoot(document.getElementById('c')); window.root.render(h(Host));
    }, options);
    const look = () => page.evaluate(() => ({
      calls: window.calls, pages: window.calls.map((c) => c.page),
      rowcount: document.querySelector('.plx-data-grid [role="grid"]')?.getAttribute('aria-rowcount'),
      status: [...document.querySelectorAll('.plx-data-grid__grid-placeholder')].map((e) => e.textContent.trim()),
      rows: [...document.querySelectorAll('.plx-data-grid [role="row"]:not(.plx-data-grid__grid-placeholder)')].map((e) => [...e.querySelectorAll('[role="gridcell"], [role="rowheader"]')].map((c) => c.textContent.trim()).find((t) => /^(Record|Sorted) \d+$/.test(t))).filter(Boolean),
    }));
    const scrollTo = (where) => page.evaluate((w) => { const el = document.querySelector('.plx-data-grid__grid-tableholder'); el.scrollTop = w === 'end' ? el.scrollHeight : 0; }, where);
    const lastName = (r) => r.rows[r.rows.length - 1] || '';

    // 1. an empty page ends the list, even when the total says more
    await mount({ mode: undefined, have: 100, total: 1000, sortedHave: 0 });
    for (let i = 0; i < 8; i++) { await sleep(300); await scrollTo('end'); }
    await sleep(1500); let r = await look();
    assert.equal(Math.max(...r.pages), 3, 'an empty page 3 ends the list: ' + JSON.stringify(r.pages));
    assert.equal(r.pages.length, 3, 'each page is asked once: ' + JSON.stringify(r.pages));
    assert.equal(r.rowcount, '101', 'the list ends at the rows shown (+ the header row)');
    assert.deepEqual(r.status, [], 'no loading row is left');
    assert.equal(lastName(r), 'Record 100', 'the rows shown stay: ' + lastName(r));

    // 2. a short page ends the list, even when the total says more
    await mount({ mode: undefined, have: 120, total: 1000, sortedHave: 0 });
    for (let i = 0; i < 8; i++) { await sleep(300); await scrollTo('end'); }
    await sleep(1500); r = await look();
    assert.equal(Math.max(...r.pages), 3, 'a short page 3 ends the list: ' + JSON.stringify(r.pages));
    assert.equal(r.rowcount, '121', 'the list ends at the rows shown (+ the header row)');
    assert.deepEqual(r.status, [], 'no loading row is left');
    assert.equal(lastName(r), 'Record 120', 'the last row is Record 120: ' + lastName(r));

    // 3. fill: a search change after page 2 asks for page 1 with the new search, and nothing else first
    await mount({ mode: undefined, have: 1000, total: 1000, sortedHave: 0 });
    for (let i = 0; i < 20 && Math.max(...(await look()).pages) < 2; i++) { await sleep(300); await scrollTo('end'); }
    await sleep(400); await scrollTo('top'); await sleep(200);
    let before = (await look()).calls.length;
    assert.ok(Math.max(...(await look()).pages) >= 2, 'fill reached page 2');
    await page.evaluate(() => window.setSearch('ab')); await sleep(600);
    let after = (await look()).calls.slice(before).filter((c) => c.search === 'ab');
    assert.ok(after.length >= 1, 'the new search is asked for');
    assert.equal(after[0].page, 1, 'fill: the first request with the new search is page 1: ' + JSON.stringify(after));
    assert.ok(after.every((c) => c.page === 1), 'fill: no request for an old page number with the new search: ' + JSON.stringify(after));

    // 4. load-more: the same
    await mount({ mode: 'load-more', have: 1000, total: 1000, sortedHave: 0 });
    await sleep(500); await page.click('.plx-data-grid__more'); await sleep(500);
    assert.deepEqual((await look()).pages, [1, 2], 'load-more reached page 2');
    await scrollTo('top'); await sleep(200);
    before = (await look()).calls.length;
    await page.evaluate(() => window.setSearch('ab')); await sleep(600);
    after = (await look()).calls.slice(before);
    assert.ok(after.length >= 1, 'the new search is asked for');
    assert.deepEqual(after.map((c) => [c.page, c.search]), [[1, 'ab']], 'load-more: one request, page 1 with the new search: ' + JSON.stringify(after));

    // 5. a sort while page 2 is still on its way: the late page 2 (unsorted) is not appended to the sorted page 1
    await mount({ mode: undefined, have: 1000, total: 1000, sortedHave: 50, slow: true });
    await sleep(600); await scrollTo('end'); await sleep(1150);   // the more-rows spinner waits 1 s (#1032)
    r = await look();
    assert.deepEqual(r.pages, [1, 2], 'page 2 is on its way: ' + JSON.stringify(r.pages));
    assert.deepEqual(r.status, ['Loading records'], 'the loading row shows');
    await scrollTo('top');
    await page.click('.plx-data-grid [role="columnheader"]');
    await sleep(2200);   // the sorted page 1 arrives, then the late unsorted page 2
    r = await look();
    assert.equal(r.calls[2].page, 1, 'the sort asks for page 1: ' + JSON.stringify(r.calls));
    assert.notEqual(r.calls[2].sort, '[]', 'with the sort');
    assert.equal(r.rowcount, '51', 'the list is the sorted page 1 only (+ the header row)');
    await scrollTo('end'); await sleep(300); r = await look();
    assert.ok(r.rows.length > 0 && r.rows.every((t) => t.startsWith('Sorted ')), 'no row from the late unsorted page: ' + JSON.stringify(r.rows.slice(-3)));
    assert.equal(lastName(r), 'Sorted 50', 'the last row is Sorted 50: ' + lastName(r));
    assert.deepEqual(r.status, [], 'no loading row is left');

    assert.deepEqual(errors, [], 'no script errors');
    console.log('REMOTE_FILL_614_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
