/* Plenix tests · DataGrid narrow columns fit their content (issue 966, D-0087, D-0108): a "#" column of 1-digit pills is as wide as its content, not 125px.
   Summary: a grid with a "#" column (1-digit pills), a Name and a Status column at 1366 and 1920: the "#" column is no wider than its widest pill plus the cell padding (+- a grid step), at least 32px,
     and it takes no spare room (the same width at both sizes); sorting it does not change its width; the options button reserves no room, shows on hover and on the keyboard focus of the header (hidden at
     rest) and opens its menu from the keyboard; right to left puts the button at the inline end (the left). Left to right and right to left.
   Proof first: before the change the column is about 80px or more (the floor), grows with the room, and the button's reserve sets its width.
   Usage: node tests/data-grid-narrow-column-966.test.js   → DATA_GRID_NARROW_COLUMN_966_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9966, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      const widths = [];
      for (const vw of [1366, 1920]) {
        await page.setViewport({ width: vw, height: 900 });
        await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
        await page.evaluate(async (dir) => {
          document.documentElement.setAttribute('dir', dir);
          const host = document.createElement('div'); host.id = 'c'; document.querySelector('main').replaceChildren(host);
          const h = React.createElement, P = window.Plenix;
          const rows = Array.from({ length: 7 }, (_, i) => ({ id: 'r' + i, n: i + 1, name: 'Ibrahim Mansour Youssef ' + i, status: ['Open', 'Closed'][i % 2] }));
          ReactDOM.createRoot(host).render(h(P.DataGrid, { label: 'Cases', data: rows, index: 'id', cells: 'pill', columns: [{ title: '#', field: 'n' }, { title: 'Name', field: 'name' }, { title: 'Status', field: 'status' }] }));
          await new Promise((res) => setTimeout(res, 1400));
        }, dir);
        const read = () => page.evaluate(() => {
          const heads = [...document.querySelectorAll('#c [role=columnheader]')], head = heads.find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === '#');
          const btn = head.querySelector('.plx-data-grid__grid-header-popup-button'), pill = document.querySelector('#c [role=gridcell] .plx-data-pill'), cell = document.querySelector('#c [role=gridcell]');
          const hr = head.getBoundingClientRect(), pad = parseFloat(getComputedStyle(cell).paddingInlineStart) || 0;
          const b = btn && btn.getBoundingClientRect();
          return { w: Math.round(hr.width), pill: Math.round(pill.getBoundingClientRect().width), pad, opacity: btn ? +getComputedStyle(btn).opacity : null, atEnd: b ? (document.documentElement.dir === 'rtl' ? Math.abs(b.left - hr.left) < 4 : Math.abs(b.right - hr.right) < 4) : null };
        });
        let r = await read();
        const T2 = T + vw + 'px: ';
        assert.ok(r.w >= 32 && r.w <= r.pill + 2 * r.pad + 8, T2 + 'the "#" column is as wide as its pill plus the cell padding (' + r.w + 'px for a ' + r.pill + 'px pill)');
        assert.equal(r.opacity, 0, T2 + 'the options button is hidden at rest');
        widths.push(r.w);
        await page.hover('#c [role=columnheader]'); await new Promise((res) => setTimeout(res, 400));
        // hovering the first header ("#")
        r = await read(); assert.equal(r.opacity, 1, T2 + 'the options button shows on hover'); assert.ok(r.atEnd, T2 + 'at the header\'s inline end');
        assert.ok(r.w <= r.pill + 2 * r.pad + 8, T2 + 'showing the button does not widen the column');
        await page.mouse.move(2, 2); await new Promise((res) => setTimeout(res, 300));
        // keyboard: focus in the header shows the button, Enter on it opens the menu
        await page.keyboard.press('Shift');
        await page.evaluate(() => { const head = [...document.querySelectorAll('#c [role=columnheader]')].find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === '#'); head.focus(); });
        await new Promise((res) => setTimeout(res, 400)); r = await read(); assert.equal(r.opacity, 1, T2 + 'the options button shows on the keyboard focus of the header');
        await page.evaluate(() => { const head = [...document.querySelectorAll('#c [role=columnheader]')].find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === '#'); head.querySelector('.plx-data-grid__menu-chevron').focus(); });
        await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 500));
        assert.ok(await page.$('[role=menu]'), T2 + 'Enter on the button opens the menu'); await page.keyboard.press('Escape'); await new Promise((res) => setTimeout(res, 300));
        // sorting does not change the width
        await page.evaluate(() => { const head = [...document.querySelectorAll('#c [role=columnheader]')].find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === '#'); head.querySelector('.plx-data-grid__title-text').click(); });
        await new Promise((res) => setTimeout(res, 500)); await page.mouse.move(2, 2); r = await read(); assert.equal(r.w, widths[widths.length - 1], T2 + 'sorting the column does not change its width');
      }
      // touch has no hover to reveal the button: a narrow column keeps its reserve
      await page.setViewport({ width: 1366, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const touchW = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-interaction', 'touch');
        const host = document.createElement('div'); host.id = 'c'; document.querySelector('main').replaceChildren(host);
        const h = React.createElement, P = window.Plenix, rows = Array.from({ length: 7 }, (_, i) => ({ id: 'r' + i, n: i + 1, name: 'Ibrahim Mansour Youssef ' + i }));
        ReactDOM.createRoot(host).render(h(P.DataGrid, { label: 'Cases', data: rows, index: 'id', cells: 'pill', columns: [{ title: '#', field: 'n' }, { title: 'Name', field: 'name' }] }));
        await new Promise((res) => setTimeout(res, 1400));
        return Math.round([...document.querySelectorAll('#c [role=columnheader]')][0].getBoundingClientRect().width);
      }, dir);
      assert.ok(touchW > widths[0] + 8, T + 'on touch the narrow column keeps the button\'s reserve (' + touchW + 'px against ' + widths[0] + 'px)');
      assert.ok(Math.abs(widths[0] - widths[1]) <= 2, T + 'the "#" column takes no spare room: ' + widths.join(' and ') + 'px at 1366 and 1920');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('DATA_GRID_NARROW_COLUMN_966_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
