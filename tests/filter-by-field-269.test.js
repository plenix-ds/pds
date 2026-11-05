/* Plenix tests · "Filter by this field" with and without a command bar (#269)
   Summary: In a grid driven by useCollectionView (a CommandBar with a FilterPanel), the header menu's "Filter by this
     field" opens the command bar's Filter panel with a condition on that field, and no header filter box. A grid
     without a command bar keeps the header filter box.
   Usage: node tests/filter-by-field-269.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9269, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.Plenix.useCollectionView && window.ReactDOM, { timeout: 60000 });
    const mount = (withBar) => page.evaluate(async (withBar) => {
      document.body.innerHTML = '<div id="t"></div>';
      const h = React.createElement, P = window.Plenix;
      const rows = [{ id: 1, name: 'Maya', city: 'Austin' }, { id: 2, name: 'Jeff', city: 'Boston' }, { id: 3, name: 'Luis', city: 'Austin' }];
      const fields = [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'city', label: 'City', kind: 'select', options: ['Austin', 'Boston'] }];
      const columns = [{ title: 'Name', field: 'name', kind: 'name' }, { title: 'City', field: 'city' }];
      function WithBar() {
        const v = P.useCollectionView(fields, { data: rows, text: (r) => r.name });
        return h('div', null, h(P.CommandBar, { label: 'People', find: h(P.FilterPanel, v.filterProps) }),
          h(P.DataGrid, Object.assign({ label: 'People', data: rows, columns, height: '--plx-ref-size-80u' }, v.tableProps)));
      }
      function Alone() { return h(P.DataGrid, { label: 'People', data: rows, columns, height: '--plx-ref-size-80u' }); }
      ReactDOM.createRoot(document.getElementById('t')).render(h(withBar ? WithBar : Alone));
      await new Promise((r) => setTimeout(r, 900));
    }, withBar);
    const filterByCity = async () => {
      await page.evaluate(() => { const b = [...document.querySelectorAll('[aria-label="City column actions"]')][0]; (b.closest('button') || b).click(); });
      await new Promise((r) => setTimeout(r, 400));
      const clicked = await page.evaluate(() => { const item = [...document.querySelectorAll('[role="menuitem"]')].find((x) => x.textContent.trim() === 'Filter by this field'); if (item) item.click(); return !!item; });
      assert.ok(clicked, 'the column menu has "Filter by this field"');
      await new Promise((r) => setTimeout(r, 600));
      return page.evaluate(() => ({
        panel: !!document.querySelector('.plx-find-panel--filter'),
        conditionField: [...document.querySelectorAll('.plx-find-panel--filter .plx-find-panel__rows button, .plx-find-panel--filter .plx-find-panel__rows [role="combobox"]')].map((x) => x.textContent.trim()).filter(Boolean)[0] || '',
        headerBox: !!document.querySelector('.plx-data-grid__title-filter select, .plx-data-grid__title-filter input, .plx-data-grid [aria-label="Filter City"]'),
        filterCount: (document.querySelector('.plx-command-bar [aria-label^="Filter"]') || {}).textContent || '',
      }));
    };
    await mount(true);
    const bar = await filterByCity();
    assert.ok(bar.panel, 'with a command bar: its Filter panel opens');
    assert.ok(/City/.test(bar.conditionField), 'the panel has a condition on City (' + bar.conditionField + ')');
    assert.ok(!bar.headerBox, 'with a command bar: no header filter box');
    await mount(false);
    const alone = await filterByCity();
    assert.ok(alone.headerBox, 'without a command bar: the header filter box opens');
    assert.ok(!alone.panel, 'without a command bar: no Filter panel');
    assert.deepEqual(errors, []);
    console.log('FILTER_BY_FIELD_269_OK command bar panel on the field; header box without a bar');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
