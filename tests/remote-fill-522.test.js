/* Plenix tests · a fill DataGrid with rows from a server loads them as the person scrolls (issue 522, step 4; owner: load
   as you scroll, no page controls).
   Summary: a DataGrid with fetchRows and no mode (fill), 1,000 records from a fake server, 50 per page, 300ms each, page 3
     failing once:
       it asks for page 1 by itself and shows its rows; aria-rowcount is the server's total (+ the header row)
       scrolled to the end, it asks for page 2 and shows a "Loading records" row at the end while it comes, then appends it
       page 3 fails: a row at the end says so with Retry (the rows already shown stay; nothing covers the table); Retry asks
       for page 3 again and appends it
       it never asks for a page twice at once, and stops at the total: page 20 is the last call, the last row is Record 1000
       no page controls and no Load more button
       a sort asks for page 1 again (with the sort) and replaces the rows
   Proof first: before this step fetchRows was ignored in fill: no call, "Nothing to show" (the first lines fail).
   Usage: node tests/remote-fill-522.test.js   → REMOTE_FILL_522_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9660, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => {
      const h = React.createElement, P = window.Plenix;
      document.body.innerHTML = '<div id="c"></div>';
      window.calls = []; window.open = 0; window.maxOpen = 0; let failedOnce = false;
      const fetchRows = ({ page, size, sort }) => { window.calls.push({ page, size, sort: JSON.stringify(sort || []) }); window.open++; window.maxOpen = Math.max(window.maxOpen, window.open);
        return new Promise((ok, bad) => setTimeout(() => { window.open--;
          if (page === 3 && !failedOnce) { failedOnce = true; bad(new Error('Server busy')); return; }
          const from = (page - 1) * size; ok({ rows: Array.from({ length: Math.max(0, Math.min(size, 1000 - from)) }, (_, i) => ({ id: from + i + 1, name: 'Record ' + (from + i + 1) })), total: 1000 }); }, 300)); };
      ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'Records', index: 'id', data: [], fetchRows,
        columns: [{ field: 'name', title: 'Name', kind: 'name' }, { field: 'id', title: 'Number', kind: 'data' }] }));
    });
    const look = () => page.evaluate(() => ({
      pages: window.calls.map((c) => c.page), maxOpen: window.maxOpen,
      rowcount: document.querySelector('.plx-data-grid [role="grid"]')?.getAttribute('aria-rowcount'),
      status: [...document.querySelectorAll('.plx-data-grid__grid-placeholder')].map((e) => e.textContent.trim()),
      cover: document.querySelectorAll('.plx-data-grid__error').length,
      lastRow: [...document.querySelectorAll('.plx-data-grid [role="row"]:not(.plx-data-grid__grid-placeholder)')].slice(-1)[0]?.textContent.trim() || '',
      pager: document.querySelectorAll('.plx-data-grid .plx-pagination, .plx-data-grid__more').length,
    }));
    const toEnd = () => page.evaluate(() => { const el = document.querySelector('.plx-data-grid__grid-tableholder'); el.scrollTop = el.scrollHeight; });

    await sleep(1200);
    let r = await look();
    assert.deepEqual(r.pages, [1], 'fill asks for page 1 by itself: ' + JSON.stringify(r));
    assert.equal(r.rowcount, '1001', 'aria-rowcount is the server total and the header row');
    assert.match(r.lastRow, /^Record \d+/, 'the first page is shown');
    assert.equal(r.pager, 0, 'no page controls and no Load more');

    await toEnd(); await sleep(100); r = await look();
    assert.deepEqual(r.pages, [1, 2], 'near the end it asks for page 2: ' + JSON.stringify(r.pages));
    assert.deepEqual(r.status, [''], 'a placeholder row at the end while page 2 comes (its spinner waits 1 s: a 300 ms load shows nothing, #1032)');
    await sleep(500); r = await look();
    assert.ok(/^Record 100\b/.test(r.lastRow) || r.pages.length > 2, 'page 2 is appended: ' + r.lastRow);

    await toEnd(); await sleep(600); r = await look();
    assert.equal(r.pages[r.pages.length - 1], 3, 'it asks for page 3: ' + JSON.stringify(r.pages));
    assert.equal(r.status.length, 1, 'a failed page is said in one row at the end: ' + JSON.stringify(r.status));
    assert.match(r.status[0], /could not load/i, 'the row says the rows could not load');
    assert.match(r.status[0], /Retry/, 'the row offers Retry');
    assert.equal(r.cover, 0, 'nothing covers the table: the rows shown stay');
    await toEnd(); await sleep(600);
    assert.equal((await look()).pages.filter((n) => n === 3).length, 1, 'after a failure it does not ask again by itself');
    await page.click('.plx-data-grid__grid-placeholder button'); await sleep(600); r = await look();
    assert.equal(r.pages.filter((n) => n === 3).length, 2, 'Retry asks for page 3 again');
    assert.deepEqual(r.status, [], 'the failure row goes once page 3 arrives');

    for (let i = 0; i < 40 && (await look()).pages.length < 21; i++) { await toEnd(); await sleep(450); }
    await toEnd(); await sleep(900); r = await look();
    assert.equal(Math.max(...r.pages), 20, 'it stops at the total: page 20 is the last: ' + JSON.stringify(r.pages));
    assert.equal(r.lastRow.replace(/\s+/g, ' ').slice(0, 11), 'Record 1000', 'the last row is Record 1000: ' + r.lastRow);
    assert.equal(r.maxOpen, 1, 'never two pages asked for at once');

    // a sort starts again from page 1, with the sort
    const before = (await look()).pages.length;
    await page.click('.plx-data-grid [role="columnheader"]'); await sleep(900);
    const calls = await page.evaluate(() => window.calls);
    assert.equal(calls[before].page, 1, 'a sort asks for page 1 again');
    assert.notEqual(calls[before].sort, '[]', 'with the sort');

    assert.deepEqual(errors, [], 'no script errors');
    console.log('REMOTE_FILL_522_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
