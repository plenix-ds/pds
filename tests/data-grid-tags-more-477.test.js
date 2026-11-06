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
        const moreEl = [...box.querySelectorAll('.plx-tag')].find((t) => /^\+\d+$/.test(t.textContent.trim()));
        const tipId = moreEl && (moreEl.getAttribute('aria-describedby') || (moreEl.parentElement && moreEl.parentElement.getAttribute('aria-describedby')));
        const detail = moreEl ? { title: moreEl.hasAttribute('title') || (moreEl.parentElement && moreEl.parentElement.hasAttribute('title')), name: moreEl.getAttribute('aria-label') || (moreEl.parentElement && moreEl.parentElement.getAttribute('aria-label')), tip: tipId ? (document.getElementById(tipId) || {}).textContent : null, focusable: moreEl.tabIndex >= 0 || (moreEl.parentElement && moreEl.parentElement.tabIndex >= 0) || !!moreEl.querySelector('[tabindex]') } : null;
        const descIds = (cell.getAttribute('aria-describedby') || '').split(' ').filter(Boolean); const cellDesc = descIds.map((i) => (document.getElementById(i) || {}).textContent || '').join(' ').trim();
        let tooltip = null; if (moreEl) { cell.focus(); await new Promise((r) => setTimeout(r, 300)); const tt = document.querySelector('[role=tooltip]'); tooltip = tt ? tt.textContent.trim() : null; cell.blur(); await new Promise((r) => setTimeout(r, 300)); }
        const inside = [...box.querySelectorAll('.plx-tag')].filter((t) => !t.closest('[aria-hidden=true]')).every((t) => { const r = t.getBoundingClientRect(), c = cell.getBoundingClientRect(); return r.left >= c.left - 1 && r.right <= c.right + 1; });
        return { shown, more, inside, detail, cellDesc, tooltip, stops: [...cell.querySelectorAll('[tabindex]')].filter((e) => e.tabIndex >= 0).length, moreTab: moreEl ? moreEl.getAttribute('tabindex') : null };
      }, dir, width, count);
      const T = dir + ': ';
      const wide = await read(undefined, 3); assert.equal(wide.more, undefined, T + 'a column that fits them shows every tag'); assert.equal(wide.shown.length, 3);
      const narrow = await read('--plx-ref-size-40u', 6); const tagsShown = narrow.shown.filter((t) => !/^\+\d+$/.test(t));
      assert.ok(narrow.more, T + 'a narrow column shows a "+N" Tag: ' + JSON.stringify(narrow.shown)); assert.equal(tagsShown.length + Number(narrow.more.slice(1)), 6, T + 'shown + N = all six'); assert.ok(tagsShown.length >= 1);
      assert.equal(narrow.inside, true, T + 'the tags stay inside the cell');
      const left = Number(narrow.more.slice(1)), d = narrow.detail;
      assert.equal(d.title, false, T + 'the "+N" has no bare title'); assert.equal(d.name, left + ' more', T + 'it is named "{count} more"'); assert.equal(narrow.moreTab, '-1', T + 'the "+N" Tag is not a Tab stop');
      const hiddenNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].slice(6 - left); assert.equal(narrow.cellDesc, hiddenNames.join(', '), T + 'the hidden names are the cell description'); assert.equal(narrow.tooltip, hiddenNames.join(', '), T + 'the Tooltip shows when the cell is the active cell');
      assert.equal(narrow.stops, 0, T + 'the table keeps one Tab stop: nothing inside the cell is a stop');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_TAGS_MORE_477_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
