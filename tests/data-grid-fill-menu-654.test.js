/* Plenix tests · DataGrid fill from the context menu (issue 654, WCAG 2.5.7): with editing.fill and a selected block, the right-click menu has
   "Fill down" and "Fill right", a single-pointer alternative to dragging the fill handle; right (toward the inline end) follows the reading
   direction. Without a block, or with fill off, the browser's own menu is left alone (no menu opens). With a rowMenu the fill items come first.
   In left to right and right to left. Usage: node tests/data-grid-fill-menu-654.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9847, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing, rowMenu) => page.evaluate(async (dir, editing, rowMenu) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 4 }, (_, i) => ({ id: 'r' + (i + 1), name: ['Alma', 'Boris', 'Cara', 'Dev'][i], role: ['Cook', 'Pilot', 'Nurse', 'Judge'][i], city: ['Oslo', 'Rome', 'Lima', 'Kyiv'][i] }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Role', field: 'role', editor: 'input' }, { title: 'City', field: 'city', editor: 'input' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 420 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing, cellSelection: true,
          rowMenu: rowMenu ? [{ label: 'Archive', onSelect() {} }] : undefined,
          onCellEdit: (r, e) => { window.__edits.push(r.id + '.' + e.field + '=' + e.value + ':' + e.source); } })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing, rowMenu);
      const focus = (r, f) => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const text = (r, f) => page.evaluate((r, f) => [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').textContent.trim(), r, f);
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(250); };
      const FWD = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const select = async (rows, cols) => { await focus(0, 'name'); for (let i = 0; i < rows - 1; i++) await key('ArrowDown', ['Shift']); for (let j = 0; j < cols - 1; j++) await key(FWD, ['Shift']); };
      const rightClick = async (r, f) => { const c = await page.evaluate((r, f) => { const b = [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, r, f); await page.mouse.click(c.x, c.y, { button: 'right' }); await wait(400); };
      const items = () => page.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map((i) => i.textContent.trim()));
      const pick = async (label) => { await page.evaluate((label) => [...document.querySelectorAll('[role=menuitem]')].find((i) => i.textContent.trim() === label).click(), label); await wait(500); };

      await mount({ fill: true });
      await rightClick(1, 'name');
      assert.deepEqual(await items(), [], T + 'no block: no menu (the browser\'s own is left alone)');
      await select(3, 2); await rightClick(1, 'name');
      assert.deepEqual(await items(), ['Fill down', 'Fill right'], T + 'a selected block: the fill items');
      await pick('Fill down');
      assert.equal(await text(1, 'name'), 'Alma'); assert.equal(await text(2, 'role'), 'Cook', T + 'Fill down copies the top row down');
      assert.equal(await text(0, 'city'), 'Oslo'); assert.equal(await text(3, 'name'), 'Dev', T + 'outside the block nothing changes');
      assert.ok((await page.evaluate(() => window.__edits)).every((e) => e.endsWith(':fill')), T + 'source fill');

      await mount({ fill: true });
      await select(2, 2); await rightClick(0, 'name'); await pick('Fill right');
      assert.equal(await text(0, 'role'), 'Alma'); assert.equal(await text(1, 'role'), 'Boris', T + 'Fill right copies the first column across (toward the inline end)');
      assert.equal(await text(0, 'city'), 'Oslo');

      await mount({ fill: true }, true);
      await select(2, 2); await rightClick(0, 'role');
      assert.deepEqual((await items()).slice(0, 3), ['Fill down', 'Fill right', 'Archive'], T + 'with a row menu the fill items come first');

      await mount({});
      await select(2, 2); await rightClick(0, 'name');
      assert.deepEqual(await items(), [], T + 'fill off: no menu');
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('data-grid-fill-menu-654: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
