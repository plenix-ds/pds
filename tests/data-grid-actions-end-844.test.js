/* Plenix tests · #844 (owner, D-0087 step 6): an actions column sits at the grid's inline end, its content end-aligned, with no empty column after it.
   Summary: CTM's table as its shell builds it (narrow "table", mode "fill", header menu, no row-menu button, compact density) with its Actions column (field open_action, minWidth 9rem,
     two small buttons in a render, kind "actions") at 1,800px: the last button's far edge is within one cell padding of the grid's inline-end edge, the Actions header is the last header,
     and the columns before it share the spare room (the Actions column keeps its natural width). Left to right and right to left.
   Proof first: before the change the Actions column grew like the others and its buttons sat at the column's start, with a gap before the edge.
   Usage: node tests/data-grid-actions-end-844.test.js   → DATA_GRID_ACTIONS_END_844_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9804, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 2000, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const r = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:1800px;display:grid"></div>';
        const names = ['Adam Fisher', 'Eric Henderson', 'Jessica Powell'];
        const rows = Array.from({ length: 8 }, (_, i) => ({ id: 'C-' + i, applicant: names[i % 3], reason: ['Abandonment', 'Infidelity'][i % 2], married_years: 3 + i, open_action: i }));
        const cols = [
          { title: 'Applicant', field: 'applicant', minWidth: '10.5rem', pill: false },
          { title: 'Reason', field: 'reason', minWidth: '6.5rem' },
          { title: 'Years married', field: 'married_years', minWidth: '7.5rem', pill: false, render: (x) => x.married_years + ' years' },
          { title: 'Actions', field: 'open_action', minWidth: '9rem', kind: 'actions', pill: false, headerSort: false, maxWidth: '--plx-ref-size-240px', render: () => h('span', { className: 'probe-actions', style: { display: 'inline-flex', gap: 4 } }, h(P.Button, { size: 'xs' }, 'Open'), h(P.Button, { size: 'xs' }, 'Move')) },
        ];
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'To assign', data: rows, columns: cols, index: 'id', cells: 'pill', density: 'compact', narrow: 'table', mode: 'fill', headerMenu: true, rowMenuButton: false, isStatic: true }));
        await new Promise((res) => setTimeout(res, 1500));
        const grid = document.querySelector('#c [role=grid]') || document.querySelector('#c'), gr = grid.getBoundingClientRect();
        const heads = [...document.querySelectorAll('#c [role=columnheader]')].map((x) => ({ t: x.textContent.trim(), w: Math.round(x.getBoundingClientRect().width) }));
        const row = document.querySelector('#c [role=row][data-plx-record]'), btns = [...row.querySelectorAll('.probe-actions button')], last = btns[btns.length - 1].getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(btns[0].closest('.plx-data-grid__grid-cell')).paddingInlineEnd) || 0;
        const rtl = dir === 'rtl';
        return { heads, gap: rtl ? last.left - gr.left : gr.right - last.right, pad };
      }, dir);
      assert.equal(r.heads[r.heads.length - 1].t, 'Actions', T + 'Actions is the last column, no empty column after it ' + JSON.stringify(r.heads));
      assert.ok(r.gap <= r.pad + 4, T + 'the last button ends within one cell padding of the grid\'s inline-end edge (gap ' + Math.round(r.gap) + 'px, padding ' + r.pad + 'px) ' + JSON.stringify(r.heads));
      const actions = r.heads.find((x) => x.t === 'Actions').w, others = r.heads.filter((x) => x.t !== 'Actions' && x.t).map((x) => x.w);
      assert.ok(actions <= Math.min(...others), T + 'the Actions column keeps its natural width; the room goes to the others (' + actions + ' vs ' + others.join(', ') + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_ACTIONS_END_844_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
