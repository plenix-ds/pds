/* Plenix tests · ColumnsMenu keyboard (issue 79): the column list is one Tab stop; Up and Down move between rows; Left and Right
   move across a row's controls (the row, its Move handle, its checkbox), mirrored in right to left; Home and End go to the first and
   last control of the row, Ctrl+Home and Ctrl+End to the first and last row; Alt+Arrow Up/Down still reorders; the first column's
   checkbox (disabled) is skipped. In left to right and right to left. Space still toggles the checkbox.
   Usage: node tests/columns-menu-keys-79.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9655, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const draw = async (dir) => {
      await page.evaluate((d) => {
        document.documentElement.setAttribute('dir', d);
        document.querySelector('main').innerHTML = '<button id="before">before</button><div id="v"></div><button id="after">after</button>';
        const h = React.createElement, fields = ['name', 'type', 'size'].map((v) => ({ value: v, label: v.toUpperCase() }));
        function App() { const [value, setValue] = React.useState({ order: ['name', 'type', 'size'], hidden: [] }); window.cols = value; return h(Plenix.ColumnsMenu, { fields, value, onChange: setValue, inline: true }); }
        ReactDOM.createRoot(document.getElementById('v')).render(h(App));
      }, dir);
      await sleep(500);
    };
    // where focus is: [row field, which control]
    const where = () => page.evaluate(() => { const a = document.activeElement, row = a && a.closest && a.closest('.plx-columns-list__row'); if (!row) return null; const kind = a === row ? 'row' : a.matches('.plx-columns-list__handle, .plx-columns-list__handle *') ? 'handle' : a.matches('input[type=checkbox]') ? 'check' : 'other'; return row.getAttribute('data-plx-field') + ':' + kind; });
    const press = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods.slice().reverse()) await page.keyboard.up(m); await sleep(80); };

    for (const dir of ['ltr', 'rtl']) {
      await draw(dir);
      const stops = await page.evaluate(() => [...document.querySelectorAll('#v .plx-columns-list__row, #v .plx-columns-list__row button, #v .plx-columns-list__row input')].filter((e) => e.tabIndex >= 0 && !e.disabled).length);
      assert.equal(stops, 1, dir + ': the list is one Tab stop, got ' + stops);
      await page.focus('#before'); await press('Tab'); await press('Tab');   // the First column select, then the list
      assert.equal(await where(), 'name:row', dir + ': Tab enters at the first row');
      await press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.id), 'after', dir + ': the next Tab leaves the list');
      await page.focus('#before'); await press('Tab'); await press('Tab');
      await press('ArrowDown'); assert.equal(await where(), 'type:row', dir + ': Down');
      await press('ArrowDown'); await press('ArrowDown'); assert.equal(await where(), 'size:row', dir + ': Down stops at the last row');
      await press('ArrowUp'); assert.equal(await where(), 'type:row', dir + ': Up');
      const fwd = dir === 'ltr' ? 'ArrowRight' : 'ArrowLeft', back = dir === 'ltr' ? 'ArrowLeft' : 'ArrowRight';
      await press(fwd); assert.equal(await where(), 'type:handle', dir + ': forward goes to the Move handle');
      await press(fwd); assert.equal(await where(), 'type:check', dir + ': forward goes to the checkbox');
      await press(fwd); assert.equal(await where(), 'type:check', dir + ': forward stops at the end of the row');
      await press('ArrowUp'); assert.equal(await where(), 'name:handle', dir + ': Up keeps the control, and skips the first row\'s disabled checkbox');
      await press(back); assert.equal(await where(), 'name:row', dir + ': back goes to the row');
      await press('End'); assert.equal(await where(), 'name:handle', dir + ': End goes to the last control of the row (the first row has no checkbox to use)');
      await press('Home'); assert.equal(await where(), 'name:row', dir + ': Home goes to the first control of the row');
      await press('End', ['Control']); assert.equal(await where(), 'size:row', dir + ': Ctrl+End goes to the last row');
      await press('Home', ['Control']); assert.equal(await where(), 'name:row', dir + ': Ctrl+Home goes to the first row');
      // Alt+Down still reorders; focus stays on the moved row
      await press('ArrowDown', ['Alt']); await sleep(100);
      assert.deepEqual(await page.evaluate(() => window.cols.order), ['type', 'name', 'size'], dir + ': Alt+Down reorders');
      // Space on the checkbox still toggles it
      await press('ArrowDown'); await press(fwd); await press(fwd);
      assert.equal(await where(), 'size:check'.replace('size', await page.evaluate(() => document.activeElement.closest('.plx-columns-list__row').getAttribute('data-plx-field'))), dir + ': on a checkbox');
      const field = await page.evaluate(() => document.activeElement.closest('.plx-columns-list__row').getAttribute('data-plx-field'));
      await press(' '); await sleep(100);
      assert.ok((await page.evaluate(() => window.cols.hidden)).includes(field), dir + ': Space toggles the checkbox');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('columns-menu-keys-79: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
