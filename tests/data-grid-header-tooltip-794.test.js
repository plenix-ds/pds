/* Plenix tests · #794: a cut DataGrid header title shows in the Plenix Tooltip, not a bare title attribute.
   Summary: in a 16-column grid at 1,580px (#783: long titles end in an ellipsis), a cut title opens the Plenix Tooltip with its full text on hover and when its header cell has the keyboard focus; a title that fits opens nothing; no header
     carries a `title` attribute (a bare title is unreachable by keyboard and touch, fit-and-overflow §5). Left to right and right to left.
   Proof first: before #794 the full title is only a `title` attribute and no Tooltip opens: those lines fail.
   Usage: node tests/data-grid-header-tooltip-794.test.js   → DATA_GRID_HEADER_TOOLTIP_794_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9794, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 2200, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:2100px;block-size:600px;display:grid"></div>';
        const titles = ['Name', 'Flair', 'Tags', 'Last seen', 'Chat size', 'Images', 'Account', 'Added', 'Karma', 'Recent posts', 'Recent replies', 'Recent comments', 'Average weekly score', 'Total awards received', 'Joined the community', 'Account age in days', 'Longest streak of posting', 'Weekly average of replies'];
        const rows = Array.from({ length: 20 }, (_, i) => Object.assign({ id: 'u' + i }, ...titles.map((t, k) => ({ ['f' + k]: k === 0 ? { name: 'u/User' + i } : 'v' + i }))));
        const cols = titles.map((t, k) => Object.assign({ title: k < 3 ? t : t + ' over the last twelve months', field: 'f' + k }, k === 0 ? { kind: ['avatar-name', 'name'] } : {}));
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.SplitView, { label: 'People', firstLabel: 'People', defaultSize: 1640, first: h(P.DataGrid, { label: 'People', data: rows, columns: cols, index: 'id', selectable: true }), second: h(P.ReadingPane, { label: 'Person', empty: h(P.EmptyState, { title: 'Choose a person' }) }) }));
        await new Promise((r) => setTimeout(r, 1400));
      }, dir);
      const T = dir + ': ';
      const info = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('#c [role=columnheader]')].filter((c) => c.querySelector('.plx-data-grid__title-text'));
        const rec = (c) => { const t = c.querySelector('.plx-data-grid__title-text'); return { text: t.textContent, cut: t.scrollWidth > t.clientWidth + 1, idx: heads.indexOf(c) }; };
        return { n: heads.length, withTitleAttr: [...document.querySelectorAll('#c [role=columnheader] [title]')].filter((e) => e.classList.contains('plx-data-grid__grid-col-title')).length, list: heads.map(rec) };
      });
      assert.ok(info.n >= 18, T + 'the table draws a header per column (' + info.n + ')');
      assert.equal(info.withTitleAttr, 0, T + 'no header carries a bare title attribute (' + info.withTitleAttr + ')');
      const cutOne = info.list.find((x) => x.cut), fitOne = info.list.find((x) => !x.cut);
      assert.ok(cutOne && fitOne, T + 'some titles are cut and some fit (cut: ' + (cutOne && cutOne.text) + ')');
      const open = () => page.evaluate(() => [...document.querySelectorAll('.plx-tooltip__bubble.is-open')].map((b) => b.textContent.replace(/\s+/g, ' ').trim()));
      const head = (i) => page.evaluateHandle((i) => [...document.querySelectorAll('#c [role=columnheader]')].filter((c) => c.querySelector('.plx-data-grid__title-text'))[i], i);
      // hover on a cut title: the Plenix Tooltip shows the full title
      const h1 = await head(cutOne.idx); const t1 = await h1.asElement().$('.plx-data-grid__title-text'); await t1.hover(); await wait(700);
      assert.ok((await open()).includes(cutOne.text), T + 'hover on a cut title opens the Tooltip with "' + cutOne.text + '" (' + JSON.stringify(await open()) + ')');
      await page.mouse.move(5, 5); await wait(400);
      // keyboard focus on the header cell: the same Tooltip
      await h1.asElement().focus(); await wait(700);
      assert.ok((await open()).includes(cutOne.text), T + 'keyboard focus on the header cell opens the Tooltip with the full title (' + JSON.stringify(await open()) + ')');
      await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await wait(400);
      // a title that fits opens nothing
      const h2 = await head(fitOne.idx); const t2 = await h2.asElement().$('.plx-data-grid__title-text'); await t2.hover(); await wait(700);
      assert.deepEqual(await open(), [], T + 'a title that fits opens no Tooltip');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_HEADER_TOOLTIP_794_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
