/* Plenix tests · a DataGrid fits its columns to the window before it turns into cards (issue 929, the owner: "The multiple lines
   view is only when the datagrid does not fit on a UI. By default, columns should autosize and autofit to the window").
   Written before the fix: the switch compared the width with the columns' set widths, so AITEAM's Issues (a 760px split pane,
   columns 300/130/88/145/150/64/150) turned into cards although its columns fit at their minimum widths.
   Summary (the browser, left to right and right to left):
     AITEAM's Issues shape in a 760px pane, and full width at 1024 and 768: a table, nothing scrolls sideways, no header is cut,
       and the table fills its width (its end within one grid step of the grid's end)
     a St. John directory (6 columns) at 600: a table; at 390: cards
     a plain 6-column grid at 600: a table; at 390: cards
     narrow="list" at 1440 stays cards; narrow="table" at 390 stays a table
     no script errors
   Usage: node tests/data-grid-autofit-929.test.js   → DATA_GRID_AUTOFIT_929_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

const SHAPES = {
  aiteam: { label: 'Issues', selectable: true, cols: [['title', 'Title', 300], ['state', 'State', 130], ['num', 'Number', 88], ['assignee', 'Assignee', 145], ['labels', 'Labels', 150], ['pri', 'Priority', 64], ['updated', 'Updated', 150]] },
  stjohn: { label: 'Directory', selectable: true, cols: [['name', 'Name'], ['role', 'Role'], ['email', 'Email'], ['phone', 'Phone'], ['ministry', 'Ministry'], ['joined', 'Joined', null, 'date']] },
  plain: { label: 'Plain', selectable: false, cols: [['a', 'Alpha'], ['b', 'Bravo'], ['c', 'Charlie'], ['d', 'Delta'], ['e', 'Echo'], ['f', 'Foxtrot']] },
};

(async () => {
  const PORT = +process.env.TEST_PORT || 9698, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    // draws one grid; box: the pane's width (null: the window's); returns table or cards and the table's fit
    const draw = async (name, dir, windowWidth, box, extra) => {
      await page.setViewport({ width: windowWidth, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      return page.evaluate(async (shape, dir, box, extra) => {
        const h = React.createElement, P = window.Plenix, ar = dir === 'rtl';
        document.documentElement.setAttribute('dir', dir);
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const sheet = document.head.appendChild(document.createElement('style'));
        sheet.textContent = 'body{margin:0} #c{block-size:700px;display:grid;' + (box ? 'inline-size:' + box + 'px;' : '') + '}';
        const data = Array.from({ length: 30 }, (_, i) => Object.fromEntries([['id', 'r' + i]].concat(shape.cols.map(([field, title, , type]) => [field, type === 'date' ? '2024-0' + (1 + i % 9) + '-15' : (ar ? 'قيمة ' : title + ' value ') + i]))));
        const columns = shape.cols.map(([field, title, width, type]) => Object.assign({ field, title }, width ? { width } : {}, type ? { type } : {}));
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.LocaleProvider, { locale: ar ? 'ar-EG' : 'en-US', dir },
          h(P.DataGrid, Object.assign({ label: shape.label, data, columns, index: 'id', selectable: shape.selectable }, extra || {}))));
        await new Promise((res) => setTimeout(res, 1500));
        const grid = document.querySelector('.plx-data-grid'), hh = document.querySelector('.plx-data-grid__grid-tableholder');
        const heads = [...document.querySelectorAll('.plx-data-grid__grid-col-title, .plx-data-grid__title')];
        const cells = [...document.querySelectorAll('.plx-data-grid__grid-header [role="columnheader"]')];
        const g = grid.getBoundingClientRect(), edges = cells.map((c) => c.getBoundingClientRect());
        const end = edges.length ? (ar ? g.right - Math.min(...edges.map((e) => e.left)) : Math.max(...edges.map((e) => e.right)) - g.left) : 0;
        return { cards: !!document.querySelector('.plx-data-grid--narrow'), sideways: hh.scrollWidth > hh.clientWidth + 1,
          cut: heads.filter((t) => t.scrollWidth > t.clientWidth + 1).map((t) => t.textContent), gap: Math.round(g.width - end) };
      }, SHAPES[name], dir, box, extra);
    };

    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      for (const [windowWidth, box] of [[1440, 760], [1024, null], [768, null]]) {
        const r = await draw('aiteam', dir, windowWidth, box);
        const at = box ? 'a ' + box + 'px pane' : windowWidth + 'px';
        assert.equal(r.cards, false, d + 'AITEAM\'s Issues in ' + at + ' is a table (its columns fit at their minimum widths)');
        assert.equal(r.sideways, false, d + 'AITEAM\'s Issues in ' + at + ': nothing scrolls sideways');
        assert.deepEqual(r.cut, [], d + 'AITEAM\'s Issues in ' + at + ': no header is cut');
        assert.ok(r.gap <= 8, d + 'AITEAM\'s Issues in ' + at + ': the table fills its width (gap ' + r.gap + 'px)');
      }
      assert.equal((await draw('stjohn', dir, 600)).cards, false, d + 'the directory at 600 is a table');
      assert.equal((await draw('stjohn', dir, 390)).cards, true, d + 'the directory at 390 is cards');
      assert.equal((await draw('plain', dir, 600)).cards, false, d + 'the plain grid at 600 is a table');
      assert.equal((await draw('plain', dir, 390)).cards, true, d + 'the plain grid at 390 is cards');
      assert.equal((await draw('plain', dir, 1440, null, { narrow: 'list' })).cards, true, d + 'narrow="list" stays cards at 1440');
      assert.equal((await draw('plain', dir, 390, null, { narrow: 'table' })).cards, false, d + 'narrow="table" stays a table at 390');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_AUTOFIT_929_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
