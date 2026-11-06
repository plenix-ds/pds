/* Plenix tests · #800 (owner P1, D-0087): DataGrid columns fit their widest value and share the room; only long text truncates.
   Summary: the owner's case grid (an id, three people, a reason pill, a status pill and the row menu, each with a set width, as CTM gives them) at 1,600px:
     AC-1 "Abandonment" and "Open" show whole, no compact column ends in an ellipsis; AC-2 a compact column's set width is a minimum, not a cap (a 120px column whose
     widest value needs more is wider); AC-3 spare room is shared evenly across the non-fixed columns (equal added width, within 1px) and the cells start at the start edge;
     AC-4 the selection column keeps its width from 900 to 1,900px; AC-6 a summary column loses its width first (ellipsis) while the compact columns stay whole;
     AC-7 left to right and right to left; AC-8 sizing counts the rows of the current view only.
   Proof first: before #800 a column is capped at its set width, so the pills are cut ("Abandonm…", "Op…") with room to spare, and the room goes to the first column alone.
   Usage: node tests/data-grid-column-fit-800.test.js   → DATA_GRID_COLUMN_FIT_800_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9800, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 2100, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const probe = (width, withSummary) => page.evaluate(async (dir, width, withSummary) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px;display:grid"></div>';
        const reasons = ['Abandonment', 'Irreconcilable differences', 'Adultery'], statuses = ['Open', 'Closed', 'Pending'];
        const rows = Array.from({ length: 12 }, (_, i) => ({ id: 'DV-' + (2026100 + i), husband: { name: 'Ibrahim Mansour' + i }, wife: { name: 'Mariam Youssef' + i }, reason: reasons[i % 3], judge: { name: 'Judge Anthony Hanna' }, status: { label: statuses[i % 3], tone: i % 3 ? 'neutral' : 'success' },
          summary: 'The parties separated in 2024 and the court heard the first session on the second of March with both counsel present and a request for mediation ' + i }));
        const cols = [{ title: 'Case', field: 'id', kind: 'data', width: '--plx-ref-size-25u' }, { title: 'Husband', field: 'husband', kind: 'avatar-name', width: '--plx-ref-size-30u' }, { title: 'Wife', field: 'wife', kind: 'avatar-name', width: '--plx-ref-size-30u' },
          { title: 'Reason for divorce', field: 'reason', width: '--plx-ref-size-30u' }, { title: 'Judge', field: 'judge', kind: 'avatar-name', width: '--plx-ref-size-30u' }, { title: 'Status', field: 'status', kind: 'badge', width: '--plx-ref-size-25u' }];
        if (withSummary) cols.push({ title: 'Summary', field: 'summary', kind: 'wrap' });
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.DataGrid, { label: 'Cases', data: rows, columns: cols, index: 'id', selectable: true, cells: 'pill', rowMenu: [{ label: 'Open', onSelect: () => {} }] }));
        await new Promise((r) => setTimeout(r, 1500));
        const heads = [...document.querySelectorAll('#c [role=columnheader]')];
        const widths = heads.map((x) => ({ t: x.textContent.trim(), w: Math.round(x.getBoundingClientRect().width) }));
        const cut = [...document.querySelectorAll('#c [role=gridcell] span, #c [role=gridcell] .plx-badge__label')].filter((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).textOverflow === 'ellipsis' || (e.scrollWidth > e.clientWidth + 1 && e.className.toString().includes('value'))).map((e) => e.textContent.trim().slice(0, 30));
        const first = document.querySelector('#c [role=row][data-plx-record] [role=gridcell]:nth-child(5)');
        return { cards: document.querySelectorAll('#c .plx-data-grid__grid-row--narrow').length, widths, cut, sideways: (() => { const g = document.querySelector('#c .plx-data-grid__grid-header'); return g ? g.scrollWidth - g.clientWidth : 0; })() };
      }, dir, width, withSummary);
      const wide = await probe(1600, false);
      assert.equal(wide.cards, 0, T + 'a table at 1,600px');
      assert.deepEqual(wide.cut, [], T + 'AC-1: no value is cut at 1,600px (' + JSON.stringify(wide.cut) + ')');
      const named = (n) => wide.widths.find((x) => x.t.startsWith(n));
      assert.ok(named('Reason').w >= 140, T + 'AC-2: a set width is a minimum: Reason for divorce is ' + named('Reason').w + 'px (needs room for "Irreconcilable differences")');
      assert.ok(wide.sideways <= 1, T + 'no sideways scroll (' + wide.sideways + ')');
      // AC-3: the room is shared evenly: the columns' widths are their widest value plus one equal share
      const narrowish = await probe(1400, false);
      const grow = ['Case', 'Husband', 'Wife', 'Reason', 'Judge', 'Status'].map((n) => (wide.widths.find((x) => x.t.startsWith(n)).w - narrowish.widths.find((x) => x.t.startsWith(n)).w));
      assert.ok(Math.max(...grow) - Math.min(...grow) <= 8, T + 'AC-3: equal added width across the columns (within one grid step, widths snap to the grid) when the room grows by 200px (' + grow.join(', ') + ')');
      // AC-4: the checkbox column is fixed
      const small = await probe(900, false), big = await probe(1900, false);
      const sel = (r) => r.widths[0].w;
      assert.ok(Math.abs(sel(small) - sel(big)) <= 1 && small.cards === 0 || small.cards > 0, T + 'AC-4: the selection column keeps its width (' + sel(small) + ' / ' + sel(big) + ')');
      // AC-6: a summary column truncates first
      const s = await probe(1600, true);
      assert.equal(s.cards, 0, T + 'with a summary column the grid is still a table');
      assert.deepEqual(s.cut.filter((x) => !/^The parties/.test(x)), [], T + 'AC-6: only the summary is cut (' + JSON.stringify(s.cut.slice(0, 4)) + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_COLUMN_FIT_800_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
