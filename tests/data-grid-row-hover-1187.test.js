/* Plenix tests · every hovered row of a grid tints, read-only ones too (issue 1187, owner via CTM#310: "in the data grids, I need the hover as I go over any of the rows").
   Summary: a read-only DataGrid (no selectable, no onRowClick) and a static Table tint the hovered row with the grid's hover fill (--plx-comp-data-grid-row-hover-background) and leave the other rows as they are;
     a clickable DataGrid keeps its hover; the pointer cursor is not added to a row with no action (it stays the default); a selected row keeps its selected fill when hovered. Light and dark, left to right and right to left.
   Proof first: before the change a read-only row's background does not change on hover.
   Usage: node tests/data-grid-row-hover-1187.test.js   → DATA_GRID_ROW_HOVER_1187_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9990, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 }); page.on('pageerror', (e) => problems.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (kind) => page.evaluate(async (dir, mode, kind) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '800px'; document.querySelector('main').replaceChildren(c);
        const data = [1, 2, 3].map((i) => ({ id: i, name: 'Case ' + i, status: 'Open' })), columns = [{ title: 'Name', field: 'name' }, { title: 'Status', field: 'status' }];
        const props = kind === 'table' ? { label: 'Cases', data, columns } : { label: 'Cases', data, columns, index: 'id' };
        const extra = kind === 'clickable' ? { onRowClick: () => {} } : kind === 'selected' ? { selectable: true, selected: [2] } : {};
        window.__root = ReactDOM.createRoot(c); window.__root.render(h(kind === 'table' ? P.Table : P.DataGrid, Object.assign(props, extra))); await new Promise((r) => setTimeout(r, 900));
      }, dir, mode, kind);
      const rowAt = (n) => '#c [role=row]:not(:has([role=columnheader])):nth-of-type(' + n + ')';
      const looks = () => page.evaluate(() => { const rows = [...document.querySelectorAll('#c [role=row]')].filter((r) => r.querySelector('[role=gridcell],[role=cell]')); const s = (r) => getComputedStyle(r);
        const probe = document.createElement('i'); probe.style.backgroundColor = 'var(--plx-comp-data-grid-row-hover-background)'; document.body.appendChild(probe); const hover = getComputedStyle(probe).backgroundColor; probe.remove();
        return { hover, rows: rows.map((r) => ({ bg: s(r).backgroundColor, cursor: s(r).cursor })) }; });
      for (const kind of ['grid', 'table', 'clickable', 'selected']) {
        await mount(kind); await page.mouse.move(2, 2); await wait(200);
        const before = await looks(); assert.equal(before.rows.length, 3, T + kind + ': three rows');
        const target = await page.evaluate(() => { const rows = [...document.querySelectorAll('#c [role=row]')].filter((r) => r.querySelector('[role=gridcell],[role=cell]')); const b = rows[0].getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
        await page.mouse.move(target.x, target.y); await wait(300);
        const after = await looks();
        if (kind === 'selected') { assert.equal(after.rows[1].bg, before.rows[1].bg, T + kind + ': the selected row keeps its fill'); }
        assert.equal(after.rows[0].bg, after.hover, T + kind + ': the hovered row has the hover fill (' + after.rows[0].bg + ' vs ' + after.hover + ')');
        assert.equal(after.rows[2].bg, before.rows[2].bg, T + kind + ': a row that is not hovered does not change');
        if (kind === 'grid' || kind === 'table') assert.notEqual(after.rows[0].cursor, 'pointer', T + kind + ': no pointer cursor on a row with no action');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('DATA_GRID_ROW_HOVER_1187_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
