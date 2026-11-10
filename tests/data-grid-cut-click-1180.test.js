/* Plenix tests · #1180: a click on a cut cell's text right after the pointer arrives opens the row (the text is not remounted between mousedown and mouseup).
   Summary: a DataGrid with onRowClick and a name column whose text is wider than its cell. The pointer arrives on the text and clicks at once (the way a quick
     user or Playwright's click() does): onRowClick fires and the row is aria-current. A pause after arriving gives the same. The corner button that shows the
     full text still appears on hover and opens it. The text keeps its element through the hover (same node before and after the cut button appears).
   Checks: AC-1 the quick click opens the row; AC-2 the corner button shows on hover and opens the full text; AC-3 is no API change (G3).
   Proof first: before the change the cell draws its text as one node, then as a fragment with the button, so React remounts the text; the click's mousedown target is gone and no click fires.
   Usage: node tests/data-grid-cut-click-1180.test.js   → DATA_GRID_CUT_CLICK_1180_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9812, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '420px'; document.querySelector('main').replaceChildren(c);
        window.__opened = [];
        const data = [{ id: 'a', title: 'A decision whose title is longer than its cell can show on one line', n: 1 }, { id: 'b', title: 'Another decision with a title that is also much too long to fit', n: 2 }];
        ReactDOM.createRoot(c).render(h(P.DataGrid, { label: 'Decisions', data, index: 'id', onRowClick: (r) => window.__opened.push(r.id),
          columns: [{ title: 'Decision', field: 'title', kind: 'name' }, { title: 'N', field: 'n', width: 56 }] }));
        await new Promise((r) => setTimeout(r, 1200));
      }, dir);
      const text = (id) => '#c [role=row][data-plx-record="string:' + id + '"] [data-plx-field=title] .plx-data-grid__value';
      const state = () => page.evaluate(() => ({ opened: window.__opened.slice(), current: [...document.querySelectorAll('#c [role=row][aria-current=true]')].map((r) => r.getAttribute('data-plx-record').replace('string:', '')) }));
      // AC-1: the pointer arrives and clicks at once
      await page.click(text('a'));
      await wait(400);
      let s = await state();
      assert.deepEqual(s.opened, ['a'], T + 'AC-1: a quick click on the cut text opens the row: ' + JSON.stringify(s));
      assert.deepEqual(s.current, ['a'], T + 'AC-1: the row is the current one');
      // the same with a pause, on the other row (the control: it passed before the change)
      await page.mouse.move(2, 2); await wait(300);
      const box = await (await page.$(text('b'))).boundingBox();
      await page.mouse.move(box.x + 8, box.y + box.height / 2); await wait(500); await page.mouse.down(); await page.mouse.up(); await wait(400);
      s = await state();
      assert.deepEqual(s.opened, ['a', 'b'], T + 'AC-1: a click after a pause opens the row: ' + JSON.stringify(s));
      // the text is the same node before and after the cut button appears
      await page.mouse.move(2, 2); await wait(500);
      const cellA = '#c [role=row][data-plx-record="string:a"] [data-plx-field=title]';
      await page.evaluate((sel) => { window.__before = document.querySelector(sel).querySelector('.plx-data-grid__value'); }, cellA);
      const cb = await (await page.$(cellA)).boundingBox();
      await page.mouse.move(cb.x + 20, cb.y + cb.height / 2); await wait(700);
      const same = await page.evaluate((sel) => { const cell = document.querySelector(sel); return { sameNode: cell.querySelector('.plx-data-grid__value') === window.__before, button: !!cell.querySelector('button') }; }, cellA);
      assert.ok(same.button, T + 'AC-2: the corner button shows on a cut cell on hover');
      assert.ok(same.sameNode, T + 'AC-1: the text keeps its element when the button appears');
      // AC-2: the button opens the full text
      await page.mouse.move(2, 2); await wait(300);
      const cellBox = await (await page.$('#c [role=row][data-plx-record="string:a"] [data-plx-field=title]')).boundingBox();
      await page.mouse.move(cellBox.x + 20, cellBox.y + cellBox.height / 2); await wait(600);
      await page.click('#c [role=row][data-plx-record="string:a"] [data-plx-field=title] button'); await wait(500);
      const popover = await page.evaluate(() => [...document.querySelectorAll('.plx-data-grid__full-text')].map((e) => e.textContent.trim()));
      assert.ok(popover.length === 1 && /A decision whose title/.test(popover[0]), T + 'AC-2: the button opens the full text: ' + JSON.stringify(popover));
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_CUT_CLICK_1180_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
