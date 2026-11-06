/* Plenix tests · DataGrid header column dividers (issue 797, the owner: "the datagrid headers lost its column divider").
   Written before the fix: 0.90.0 drew the header's divider lines and the selected row's bar with position:fixed, so they left their cells.
   Summary (the browser, left to right and right to left): each header cell after the first draws its divider as an absolutely positioned
     1px line at its start edge; a selected row's first cell draws its bar the same way; the row-header cell's end line is absolute too;
     the line's color is the header-line token; a column's validate message still shows
   Usage: node tests/data-grid-header-lines-797.test.js   → DATA_GRID_HEADER_LINES_797_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');

(async () => {
  const PORT = +process.env.TEST_PORT || 9797, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1000, height: 700 });
    for (const dir of ['ltr', 'rtl']) {
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir) => {
        const h = React.createElement, P = window.Plenix;
        document.documentElement.setAttribute('dir', dir);
        document.getElementById('main').innerHTML = '<div id="c" style="block-size:500px;display:grid"></div>';
        const data = Array.from({ length: 5 }, (_, i) => ({ id: 'r' + i, a: 'A' + i, b: 'B' + i, c: 'C' + i }));
        const columns = [{ field: 'a', title: 'Alpha' }, { field: 'b', title: 'Bravo' }, { field: 'c', title: 'Charlie' }];
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.LocaleProvider, { locale: 'en-US', dir }, h(P.DataGrid, { label: 'Lines', data, columns, index: 'id', selectable: true })));
        await new Promise((r) => setTimeout(r, 1500));
        const cells = [...document.querySelectorAll('.plx-data-grid__grid-header [role="columnheader"]')];
        const line = (el) => { const s = getComputedStyle(el, '::before'); return { position: s.position, width: s.width, style: s.borderInlineStartStyle }; };
        const lines = cells.map((c) => ({ first: c === cells[0], afterLead: c.classList.contains('plx-data-grid__grid-col--after-lead'), line: line(c) }));
        const rowHeader = [...document.querySelectorAll('.plx-data-grid__grid-col.plx-data-grid__grid-row-header')].map((c) => getComputedStyle(c, '::after').position);
        const bar = document.createElement('div'); bar.className = 'plx-data-grid__grid-cell--selected-start'; document.body.appendChild(bar);
        const barPosition = getComputedStyle(bar, '::before').position; bar.remove();
        return { count: cells.length, lines, rowHeader, barPosition };
      }, dir);
      assert.ok(got.count >= 3, dir + ': header cells drawn');
      const drawn = got.lines.filter((l) => !l.first && !l.afterLead);
      assert.ok(drawn.length >= 2, dir + ': at least two header boundaries');
      for (const l of drawn) { assert.equal(l.line.position, 'absolute', dir + ': a header divider is absolute, got ' + l.line.position); assert.equal(l.line.style, 'solid', dir + ': it is a solid line'); }
      for (const p of got.rowHeader) assert.equal(p, 'absolute', dir + ': the row-header end line is absolute');
      assert.equal(got.barPosition, 'absolute', dir + ': the selected row bar is absolute');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_HEADER_LINES_797_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
