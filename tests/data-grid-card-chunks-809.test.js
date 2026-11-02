/* Plenix tests · the DataGrid's card list draws in chunks (issue 809, first step; the reflow job's /gifts timeout): a narrow grid
   of thousands of rows draws its first 100 cards, the next 100 as the end nears, every card on End. Written before the change:
   on the old engine all 10,000 cards are drawn at once.
   Summary (the browser, 320 x 640):
     10,000 rows at 320px: the cards, 100 drawn, an evaluate answers at once (well under 2 s), aria-rowcount 10,001
     scrolling the grid's own scroll area to the end draws the next 100 (one chunk per approach, not all)
     Arrow Down on the last drawn card's cell draws the next chunk and focuses the next card
     End on a card's cell draws every card and focuses the last (aria-rowindex 10,001)
     select-all selects all 10,000 rows (the data, not the drawn cards)
     a grid of 100 rows or fewer (100, 30) draws every card and no sentinel (as before); the wide table is unchanged (virtualized)
     right to left the same
     no script errors
   Usage: node tests/data-grid-card-chunks-809.test.js   → DATA_GRID_CARD_CHUNKS_809_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9688, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const pause = (ms = 300) => new Promise((r) => setTimeout(r, ms));
    const open = async (width) => {
      await page.setViewport({ width, height: 640 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    };
    const draw = (n, opts = {}) => page.evaluate(async (n, opts) => {
      const h = React.createElement, P = window.Plenix, ar = opts.dir === 'rtl';
      document.documentElement.setAttribute('dir', opts.dir || 'ltr');
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      const sheet = document.getElementById('t809') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't809' });
      sheet.textContent = '#c{block-size:600px;display:grid;}';
      window.__selected = 0;
      const data = Array.from({ length: n }, (_, i) => ({ id: 'g' + i, donor: (ar ? 'متبرع ' : 'Donor ') + (i + 1), fund: i % 3 ? 'General' : 'Building', amount: (i % 9 + 1) * 25 }));
      const columns = [{ field: 'donor', title: 'Donor', width: 180 }, { field: 'fund', title: 'Fund', width: 140 }, { field: 'amount', title: 'Amount', width: 120, type: 'currency' }];
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      // narrow: 'list' (issue 929): the cards under 600px whatever the columns need (three columns now fit 320px at their minimums)
      window.__root.render(h(P.LocaleProvider, { locale: ar ? 'ar-EG' : 'en-US', dir: opts.dir || 'ltr' },
        h(P.DataGrid, Object.assign({ label: 'Gifts', data, columns, index: 'id', selectable: true, narrow: 'list',
          onSelectionChange: (s) => { window.__selected = (Array.isArray(s) ? s : Object.keys(s || {})).length; } }, opts.grid || {}))));
      await new Promise((r) => setTimeout(r, 900));
    }, n, opts);
    const state = () => page.evaluate(() => {
      const g = document.querySelector('[role="grid"], [role="treegrid"]'), a = document.activeElement, row = a && a.closest && a.closest('[role="row"]');
      return { narrow: !!document.querySelector('.plx-data-grid--narrow'), rows: document.querySelectorAll('.plx-data-grid__grid-row').length,
        sentinel: !!document.querySelector('.plx-data-grid__card-more'), rowcount: g && +g.getAttribute('aria-rowcount'), active: row ? +row.getAttribute('aria-rowindex') : null };
    });
    const answers = () => page.evaluate(() => performance.now()).then(() => true);

    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      await open(320);
      const t0 = Date.now();
      await draw(10000, { dir });
      await Promise.race([answers(), new Promise((_, no) => setTimeout(() => no(new Error(d + 'the page did not answer within 5 s (all 10,000 cards drawn at once?)')), 5000))]);
      let s = await state();
      assert.equal(s.narrow, true, d + '10,000 rows at 320px are cards');
      assert.equal(s.rows, 100, d + 'only the first 100 cards are drawn; got ' + s.rows);
      assert.equal(s.sentinel, true, d + 'a sentinel follows the drawn cards');
      assert.equal(s.rowcount, 10001, d + 'aria-rowcount is the full count (10,000 rows and the header)');
      assert.ok(Date.now() - t0 < 6000, d + 'drawing took ' + (Date.now() - t0) + 'ms');

      // scrolling to the end draws one more chunk
      await page.evaluate(() => { const h = document.querySelector('.plx-data-grid__grid-tableholder'); h.scrollTop = h.scrollHeight; });
      await pause(600);
      s = await state();
      assert.equal(s.rows, 200, d + 'scrolling to the end draws the next 100 (one chunk, not all); got ' + s.rows);

      // Arrow Down past the drawn end
      await page.evaluate(() => { const rows = [...document.querySelectorAll('.plx-data-grid__grid-row')]; rows[rows.length - 1].querySelector('[role="gridcell"][tabindex]').focus(); });
      await page.keyboard.press('ArrowDown'); await pause();
      s = await state();
      assert.ok(s.rows > 200, d + 'Arrow Down past the drawn cards draws the next chunk; got ' + s.rows);
      assert.equal(s.active, 202, d + 'and focuses the next card (row 201, aria-rowindex 202)');

      // End: every card, the last focused
      await page.keyboard.press('End'); await pause(1500);
      s = await state();
      assert.equal(s.rows, 10000, d + 'End draws every card');
      assert.equal(s.active, 10001, d + 'and focuses the last card');
      assert.equal(s.sentinel, false, d + 'no sentinel once every card is drawn');

      // select-all is the data's
      await draw(10000, { dir });
      await page.evaluate(() => { const c = document.querySelector('[role="columnheader"] input[type="checkbox"], .plx-data-grid__grid-header input[type="checkbox"]'); c.click(); });
      await pause();
      assert.equal(await page.evaluate(() => window.__selected), 10000, d + 'select-all selects every row, not only the drawn cards');

      // small grids are as before
      await draw(100, { dir });
      s = await state();
      assert.deepEqual([s.rows, s.sentinel], [100, false], d + '100 rows: every card and no sentinel');
      await draw(30, { dir });
      s = await state();
      assert.deepEqual([s.rows, s.sentinel], [30, false], d + '30 rows: every card and no sentinel');

      // the wide table is unchanged: virtualized, no sentinel
      await open(1280);
      await draw(10000, { dir });
      s = await state();
      assert.equal(s.narrow, false, d + 'at 1280px the grid is a table');
      assert.ok(s.rows < 100 && !s.sentinel, d + 'the table stays virtualized, with no sentinel; got ' + s.rows + ' rows');
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_CARD_CHUNKS_809_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
