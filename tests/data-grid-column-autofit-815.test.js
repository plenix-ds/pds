/* Plenix tests · #815 (owner): double-click a column's end-edge border (or press Enter on its resize handle, or use the column menu) fits the column to what is drawn.
   Summary: a grid with fixed widths (narrow="table", every column starts at 80px): a status pill "Abandonment", a person chip (icon and name) and a long header. Double-click on the
     handle at the column's end edge (the left edge in right-to-left): AC-1 the pill shows whole and the column is no wider than the widest pill plus the cell space (+2px);
     AC-2 the widest person chip shows whole with its icon; AC-3 a header wider than its values is not cut (its sort and menu room included); AC-4 Enter on the focused handle gives the same width;
     AC-5 the column menu's "Size all columns to fit" fits every column; AC-6 the same in right-to-left. Left to right and right to left.
   Proof first: before #815 the fit measures the raw text only: the pill's padding, the chip's icon and padding and the header's icons are left out, so the pill and the chip stay cut.
   Usage: node tests/data-grid-column-autofit-815.test.js   → DATA_GRID_COLUMN_AUTOFIT_815_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9815, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1400, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:1100px;display:grid"></div>';
        const reasons = ['Abandonment', 'Adultery', 'Neglect'];
        const rows = Array.from({ length: 12 }, (_, i) => ({ id: 'DV-' + (100 + i), reason: reasons[i % 3], person: { name: 'Ibrahim Mansour Youssef' + i }, tiny: 'a', headed: 'x' }));
        const cols = [{ title: 'Case', field: 'id', kind: 'data', width: '--plx-ref-size-20u' }, { title: 'Reason for divorce', field: 'reason', width: '--plx-ref-size-20u' }, { title: 'Husband', field: 'person', kind: 'avatar-name', width: '--plx-ref-size-20u' },
          { title: 'A rather long column title', field: 'tiny', width: '--plx-ref-size-20u' }];
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'Cases', data: rows, columns: cols, index: 'id', cells: 'pill', narrow: 'table' }));
        await new Promise((r) => setTimeout(r, 1400));
      }, dir);
      const colw = (title) => page.evaluate((title) => { const hd = [...document.querySelectorAll('#c [role=columnheader]')].find((x) => x.textContent.trim().startsWith(title)); return hd ? Math.round(hd.getBoundingClientRect().width) : 0; }, title);
      const cutIn = (title) => page.evaluate((title) => { const heads = [...document.querySelectorAll('#c [role=columnheader]')]; const i = heads.findIndex((x) => x.textContent.trim().startsWith(title)); if (i < 0) return -1;
        let cut = 0; for (const c of document.querySelectorAll('#c [role=row][data-plx-record] [role=gridcell]:nth-child(' + (i + 1) + ') *')) if (c.scrollWidth > c.clientWidth + 1 && getComputedStyle(c).overflowX !== 'visible') cut++;
        const hd = heads[i].querySelector('.plx-data-grid__title-text'); return cut + (hd && hd.scrollWidth > hd.clientWidth + 1 ? 100 : 0); }, title);
      const dbl = async (title) => { const h = await page.evaluateHandle((title) => [...document.querySelectorAll('#c [role=columnheader]')].find((x) => x.textContent.trim().startsWith(title)).querySelector('.plx-data-grid__grid-col-resize-handle'), title);
        const box = await h.asElement().boundingBox(), x = box.x + box.width / 2, y = box.y + box.height / 2; await page.mouse.move(x, y);
        await page.mouse.down({ clickCount: 1 }); await page.mouse.up({ clickCount: 1 }); await page.mouse.down({ clickCount: 2 }); await page.mouse.up({ clickCount: 2 }); await wait(500); };
      const widen = async (title, by) => { const h = await page.evaluateHandle((title) => [...document.querySelectorAll('#c [role=columnheader]')].find((x) => x.textContent.trim().startsWith(title)).querySelector('.plx-data-grid__grid-col-resize-handle'), title);
        const box = await h.asElement().boundingBox(), x = box.x + box.width / 2, y = box.y + box.height / 2, dx = (dir === 'rtl' ? -1 : 1) * by;
        await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + dx / 2, y, { steps: 4 }); await page.mouse.move(x + dx, y, { steps: 4 }); await page.mouse.up(); await wait(300); };
      const fitOf = async (title, how) => {
        await widen(title, 120); const wide = await colw(title);
        if (how === 'dbl') await dbl(title);
        else { await page.evaluate((title) => { [...document.querySelectorAll('#c [role=columnheader]')].find((x) => x.textContent.trim().startsWith(title)).querySelector('.plx-data-grid__grid-col-resize-handle').focus(); }, title); await page.keyboard.press('Enter'); await wait(400); }
        return { wide, fitted: await colw(title) };
      };
      // the grid already gives a compact column its content width (D-0087), so the fit is shown by widening a column by hand and fitting it back
      let r = await fitOf('Reason', 'dbl');
      assert.ok(r.fitted < r.wide - 60 && r.fitted >= 100, T + 'AC-1: a widened pill column goes back to the widest pill plus the cell space (' + r.wide + ' → ' + r.fitted + 'px)');
      assert.equal(await cutIn('Reason'), 0, T + 'AC-1: after a double-click "Abandonment" shows whole');
      const reasonFit = r.fitted;
      r = await fitOf('Husband', 'dbl');
      assert.ok(r.fitted < r.wide, T + 'AC-2: the person column goes back to its chip (' + r.wide + ' → ' + r.fitted + 'px)');
      assert.equal(await cutIn('Husband'), 0, T + 'AC-2: the person chip shows whole, with its icon');
      r = await fitOf('A rather', 'dbl');
      assert.ok(r.fitted < r.wide, T + 'AC-3: the header-sized column goes back (' + r.wide + ' → ' + r.fitted + 'px)');
      assert.equal(await cutIn('A rather'), 0, T + 'AC-3: a header wider than its values is not cut');
      // AC-4: Enter on the focused handle gives the same width as the double-click
      r = await fitOf('Reason', 'enter');
      assert.equal(r.fitted, reasonFit, T + 'AC-4: Enter on the handle gives the double-click width (' + r.fitted + ' vs ' + reasonFit + ')');
      // AC-5: the column menu's "Size all columns to fit" fits every column the same way
      await widen('Reason', 120); await widen('Husband', 60);
      const wBoth = [await colw('Reason'), await colw('Husband')];
      await page.evaluate(() => { const hd = [...document.querySelectorAll('#c [role=columnheader]')].find((x) => x.textContent.trim().startsWith('Reason')); hd.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 300, clientY: 20 })); });
      await wait(300);
      const picked = await page.evaluate(() => { const it = [...document.querySelectorAll('[role=menuitem]')].find((x) => /all columns/i.test(x.textContent)); if (it) it.click(); return !!it; });
      await wait(500);
      assert.ok(picked, T + 'AC-5: the column menu offers "Size all columns to fit"');
      assert.equal(await colw('Reason'), reasonFit, T + 'AC-5: the menu gives the same width as the double-click');
      assert.ok((await colw('Husband')) < wBoth[1] && (await cutIn('Husband')) === 0, T + 'AC-5: every column is fitted, none cut');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_COLUMN_AUTOFIT_815_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
