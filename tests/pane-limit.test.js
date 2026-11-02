/* Plenix tests · pane limits follow the window (issue 463, option C, step 1): a pane of the shell or a table column is never dragged wider than
   --plx-sys-shell-pane-window-share (90%) of the window (a pane down to the 8px drag grid, issue 882), of the table for a column (down to the 4px grid). A smaller limit still applies.
   Summary: a PanelSplitter whose limit is 2000 goes no further than 90% of the window (900 at 1000px, 1152 at 1280px) and reports it as
     aria-valuemax; at 2000px the pane cap (1600) is the smaller; a DataGrid column in a table about 600px wide ends at 90% of the table
     (not 1600); a column with a maxWidth of 120 stays at 120.
   Usage: node tests/pane-limit.test.js   (run by layout.test.js when Resizable, a pane or the DataGrid changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9616, server = await serve(PORT); let browser;
  try {
    browser = await launch();
    const run = async (width) => {
      const page = await browser.newPage(); const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewport({ width, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async () => {
        document.querySelector('main').innerHTML = '<div id="c"></div>';
        const h = React.createElement, P = window.Plenix, steps = [];
        const rows = [{ id: 1, a: 'x', b: 'y' }];
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
          h('div', { id: 'pane' }, h(P.PanelSplitter, { label: 'Pane', value: 400, min: 140, max: () => 2000, onChange: (w) => steps.push(w) })),
          h('div', { id: 'table', style: { width: '600px' } }, h(P.DataGrid, { label: 'T', data: rows, index: 'id', columns: [{ title: 'A', field: 'a' }, { title: 'B', field: 'b', maxWidth: '--plx-ref-size-120px' }] }))));
        await new Promise((r) => setTimeout(r, 400));
        const edge = document.querySelector('#pane .plx-panel-splitter');
        edge.focus(); edge.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
        const seps = [...document.querySelectorAll('#table [role=separator]')];
        return { paneMax: +edge.getAttribute('aria-valuemax'), end: steps[steps.length - 1], tableWidth: (document.querySelector('#table .plx-data-grid') || document.querySelector('#table')).clientWidth, colMax: seps.map((s) => +s.getAttribute('aria-valuemax')) };
      });
      assert.deepEqual(errors, [], 'no script errors');
      await page.close(); return got;
    };
    const share = (w) => Math.floor(w * 0.9 / 4) * 4;
    // a pane on the 8px drag grid (issue 882): 90% of 1000 is 900, the 8px line below it 896
    for (const [width, expectPane] of [[1000, 896], [1280, 1152], [2000, 1600]]) {
      const got = await run(width);
      assert.equal(got.paneMax, expectPane, 'the pane limit at ' + width + 'px is the smaller of 90% of the window and 1600');
      assert.equal(got.end, expectPane, 'End goes to that limit at ' + width + 'px');
      assert.equal(got.colMax[0], share(got.tableWidth), 'a column without maxWidth ends at 90% of the table at ' + width + 'px');
      assert.equal(got.colMax[1], 120, 'a column with a maxWidth of 120 stays at 120');
    }
    console.log('pane-limit: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
