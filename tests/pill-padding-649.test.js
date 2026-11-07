/* Plenix tests · a pill in a DataGrid or Table cell has equal padding at both sides (issue 649, owner 2026-10-29).
   Summary: the md pill had 6px before its content and 10px after it, and the shared-width step rounded the column's pill width up to the 4px grid and left the text at the start, so
     in a column of identical pills the text sat 7px from one edge and about 14px from the other (above and below it: about 4px). Now both side paddings are 4px, as the space above and
     below the text (the 24px pill minus 16px of text, over two), the width of a column's pills is the widest text plus two paddings and two borders rounded up to the grid, and the
     text is at the start of it (it was centered here; the owner changed that on 2026-11-07, #848), so what the rounding leaves is after it.
   The probe is proved able to see the old shape first: the unequal paddings are what the first check reads (the old build read 6px and 10px, and 7 and 13.8px from the edges).
   Cases (a column of "Needs decision" pills, and a column of mixed widths), in the compact and the standard density, left to right and right to left:
     padding-inline-start equals padding-inline-end (4px); the text starts at the start padding (within half a pixel); every pill of a column has one width, on the 4px grid,
     the widest text plus 10px (two paddings, two borders) at least and less than 4px more; a narrower pill's text starts at the start edge (#848).
   Usage: node tests/pill-padding-649.test.js   (run by layout.test.js when the DataPill, the DataGrid or the Table changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9634, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const density of ['compact', 'standard']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1100, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const rows = await page.evaluate(async (dir, density) => {
        const d = document.documentElement; d.setAttribute('dir', dir); d.setAttribute('data-plx-density', density);
        document.querySelector('main').innerHTML = '<div id="c" style="height:420px"></div>'; const h = React.createElement, P = Plenix;
        const status = ['Needs decision', 'Needs decision', 'Needs decision', 'Needs decision'], mixed = ['Done', 'Needs decision', 'In review', 'Open'];
        const data = status.map((s, i) => ({ id: i, title: 'Decision ' + (i + 1), status: s, mixed: mixed[i] }));
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'Decisions', cells: 'pill', data, density, columns: [{ field: 'title', title: 'Title', kind: 'plain', pill: false }, { field: 'status', title: 'Status' }, { field: 'mixed', title: 'Mixed widths' }] }));
        await new Promise((r) => setTimeout(r, 2200));
        return [...document.querySelectorAll('.plx-data-pill')].map((pill) => {
          const value = pill.querySelector('.plx-data-pill__value') || pill, s = getComputedStyle(pill), r = pill.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(value);
          const t = range.getBoundingClientRect();
          return { field: pill.getAttribute('data-plx-pill-field'), text: value.textContent, width: r.width, padStart: s.paddingInlineStart, padEnd: s.paddingInlineEnd, border: parseFloat(s.borderLeftWidth),
            near: s.direction === 'rtl' ? r.right - t.right : t.left - r.left, far: s.direction === 'rtl' ? t.left - r.left : r.right - t.right, textW: t.width };
        });
      }, dir, density);
      const at = dir + ' ' + density;
      const pills = rows.filter((r) => r.field === 'status' || r.field === 'mixed');
      assert.ok(pills.length >= 8, at + ': the pills are drawn (' + pills.length + ')');
      for (const r of pills) {
        assert.equal(r.padStart, '4px', at + ' ' + r.text + ': padding before is 4px (the old build: 6px)');
        assert.equal(r.padEnd, '4px', at + ' ' + r.text + ': padding after is 4px (the old build: 10px)');
        // #848 (owner, 2026-11-07: text is not centered): the label sits at the start edge, after the 4px padding and the border; what the rounding leaves is after it
        assert.ok(Math.abs(r.near - (4 + r.border)) <= 0.5, at + ' ' + r.text + ': the text starts at the start padding (' + r.near.toFixed(1) + ' from the start edge)');
      }
      for (const field of ['status', 'mixed']) {
        const col = pills.filter((r) => r.field === field), widest = Math.max.apply(null, col.map((r) => r.textW));
        assert.equal(new Set(col.map((r) => r.width)).size, 1, at + ' ' + field + ': every pill of the column has one width');
        const w = col[0].width, least = widest + 8 + 2 * col[0].border;
        assert.equal(w % 4, 0, at + ' ' + field + ': the width is on the 4px grid (' + w + ')');
        assert.ok(w >= least - 0.01 && w < least + 4, at + ' ' + field + ': the widest text plus two paddings and two borders, rounded up to the grid and no more (' + w + ' for ' + least.toFixed(1) + ')');
      }
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('pill-padding-649: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
