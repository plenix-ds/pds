/* Plenix tests · #783 (owner P1): a wide DataGrid in a split view shows the table, not the narrow card.
   Summary: a people list of 16 columns (a name with an avatar, tags, dates, counts, and columns with long titles) in a SplitView's first panel about 1,500px wide stays a
     table (a header per column, no card rows), and the table does not scroll sideways: the columns whose room runs out give up width down to a floor, and a title that
     no longer fits ends in an ellipsis. In a first panel of 400px, where even the floors cannot fit, the cards stay. Left to right and right to left.
   Root cause: the card switch weighed every column at the width of its whole title (plus the type icon and the options button), so 16 columns with ordinary titles
     "needed" over 1,500px and the grid drew cards (#929's rule, #679's switch) even though a table of readable columns fits.
   Usage: node tests/data-grid-wide-table-783.test.js   → DATA_GRID_WIDE_TABLE_783_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9783, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 2000, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const probe = (size) => page.evaluate(async (dir, size) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:1960px;block-size:600px;display:grid"></div>';
        const rows = Array.from({ length: 30 }, (_, i) => ({ id: 'u' + i, name: { name: 'u/ListenFabulous' + i }, flair: ['F'], tags: ['eg'], seen: '2026-11-04T08:47:00Z', chat: 574, images: 0, account: '', added: '2026-10-16', karma: '', posts: '', replies: '', comments: 3, average: 4, awards: 5, a: 1 }));
        const cols = [['Name', 'name', { kind: ['avatar-name', 'name'] }], ['Flair', 'flair', { kind: 'tags' }], ['Tags', 'tags', { kind: 'tags' }], ['Last seen', 'seen', { type: 'date' }], ['Chat size', 'chat', { type: 'number' }], ['Images', 'images', { type: 'number' }],
          ['Account', 'account', {}], ['Added', 'added', { type: 'date' }], ['Karma', 'karma', {}], ['Recent posts', 'posts', {}], ['Recent replies', 'replies', {}], ['Recent comments', 'comments', { type: 'number' }], ['Average score', 'average', { type: 'number' }],
          ['Total awards', 'awards', { type: 'number' }], ['Joined', 'added', {}], ['A', 'a', { type: 'number' }]].map(([title, field, more], i) => Object.assign({ title, field: i === 14 ? 'added' : field, id: undefined }, more));
        cols[14].field = 'joined'; rows.forEach((r) => { r.joined = r.added; });
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.SplitView, { label: 'People', firstLabel: 'People', defaultSize: size, first: h(P.DataGrid, { label: 'People', data: rows, columns: cols, index: 'id', selectable: true, rowMenu: [{ label: 'Open', onSelect: () => {} }] }),
          second: h(P.ReadingPane, { label: 'Person', empty: h(P.EmptyState, { title: 'Choose a person' }) }) }));
        await new Promise((r) => setTimeout(r, 1500));
        const grid = document.querySelector('#c [role=grid]'), holder = document.querySelector('#c .plx-data-grid__tableholder, #c [class*=tableholder]');
        return { width: Math.round(grid ? grid.getBoundingClientRect().width : 0), cards: document.querySelectorAll('#c .plx-data-grid__grid-row--narrow').length, headers: document.querySelectorAll('#c [role=columnheader]').length,
          sideways: holder ? holder.scrollWidth - holder.clientWidth : -1 };
      }, dir, size);
      const wide = await probe(1500), T = dir + ': ';
      assert.ok(wide.width > 1400, T + 'the first panel is wide (' + wide.width + 'px)');
      assert.equal(wide.cards, 0, T + 'a wide grid draws no card rows (' + wide.cards + ' cards at ' + wide.width + 'px)');
      assert.ok(wide.headers >= 16, T + 'it draws the table: a header per column (' + wide.headers + ')');
      assert.ok(wide.sideways <= 1, T + 'the table does not scroll sideways (' + wide.sideways + 'px over)');
      const narrow = await probe(400);
      assert.ok(narrow.cards > 0 && narrow.headers <= 1, T + 'where even the floors cannot fit (400px) the cards stay (' + narrow.cards + ' cards, ' + narrow.headers + ' headers)');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_WIDE_TABLE_783_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
