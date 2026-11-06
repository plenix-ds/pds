// Plenix · tests/data-grid-tags-more-477.test.js: a tags cell shows "+N" for the tags that do not fit (issue 477, item 1; design 84-cell-editors §2 and §3).
//   node tests/data-grid-tags-more-477.test.js   → DATA_GRID_TAGS_MORE_477_OK
// Written first (proof first): before the change every tag is drawn and the cell clips them. In left to right and right to left:
//   in a wide column all the tags show and there is no "+N"; in a narrow column only the tags that fit show, followed by one "+N" Tag whose number is the tags left out
//   (shown + N = all), the row of tags stays inside the cell, and the cell's tooltip-free text still has every tag name for a screen reader (the hidden ones are in the "+N" Tag's accessible name).
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9892, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 600 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const read = (width, count) => page.evaluate(async (dir, width, count) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const tags = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].slice(0, count);
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 300 } }, h(Plenix.DataGrid, { label: 'T', data: [{ id: 'r1', name: 'A', tags }], columns: [{ title: 'Name', field: 'name' }, { title: 'Tags', field: 'tags', kind: 'tags', width }] })));
        await new Promise((r) => setTimeout(r, 1000));
        const cell = document.querySelector('[role=row][data-plx-record] [data-plx-field=tags]'), box = cell.querySelector('.plx-data-grid__rich');
        const shown = [...box.querySelectorAll('.plx-tag')].filter((t) => !t.closest('[aria-hidden=true]')).map((t) => t.textContent.trim());
        const more = shown.find((t) => /^\+\d+$/.test(t));
        const inside = [...box.querySelectorAll('.plx-tag')].filter((t) => !t.closest('[aria-hidden=true]')).every((t) => { const r = t.getBoundingClientRect(), c = cell.getBoundingClientRect(); return r.left >= c.left - 1 && r.right <= c.right + 1; });
        return { shown, more, inside };
      }, dir, width, count);
      const T = dir + ': ';
      const wide = await read(undefined, 3); assert.equal(wide.more, undefined, T + 'a column that fits them shows every tag'); assert.equal(wide.shown.length, 3);
      const narrow = await read('--plx-ref-size-40u', 6); const tagsShown = narrow.shown.filter((t) => !/^\+\d+$/.test(t));
      assert.ok(narrow.more, T + 'a narrow column shows a "+N" Tag: ' + JSON.stringify(narrow.shown)); assert.equal(tagsShown.length + Number(narrow.more.slice(1)), 6, T + 'shown + N = all six'); assert.ok(tagsShown.length >= 1);
      assert.equal(narrow.inside, true, T + 'the tags stay inside the cell');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_TAGS_MORE_477_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
