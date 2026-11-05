// Plenix · tests/data-grid-save-84.test.js: onCellEdit may answer later (issue 84, DT-41 phase 1; ADR 0016, design 84-cell-editors §3 and §5).
//   node tests/data-grid-save-84.test.js   → DATA_GRID_SAVE_84_OK
// Written first (proof first): before the change a promise from onCellEdit is ignored (no spinner, a refusal does not bring the old value back) and nothing is announced. In left to right and right to left:
//   while the promise waits, the new value is shown, the cell is aria-busy with a status spinner, and it takes no new edit; when it resolves the busy state goes and "Saved" is announced;
//   when it rejects the old value comes back and the message (the error's text, else the default) shows under the cell until the next key or click; opening an editor announces "Editing <column>";
//   a plain (not promised) onCellEdit behaves as before.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9826, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (mode) => page.evaluate(async (dir, mode) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__calls = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 3 }, (_, i) => ({ id: 'r' + (i + 1), name: 'Person ' + (i + 1) }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }];
        const onCellEdit = (r, e) => { window.__calls.push(r.id + '=' + e.value);
          if (mode === 'ok') return new Promise((res) => { window.__settle = res; });
          if (mode === 'refuse') return new Promise((res, rej) => { window.__settle = () => rej(new Error('Name already used')); });
          if (mode === 'refuse-plain') return new Promise((res, rej) => { window.__settle = () => rej(new Error('')); });
          return undefined; };
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, onCellEdit })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, mode);
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="name"]').focus(); }, r);
      const key = async (k) => { await page.keyboard.press(k); await wait(250); };
      const cell = (r) => page.evaluate((r) => { const c = [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="name"]'); return { text: c.textContent.replace(/\s+/g, ' ').trim(), busy: c.getAttribute('aria-busy'), spinner: !!c.querySelector('[role=status]') }; }, r);
      const msg = () => page.evaluate(() => { const m = document.querySelector('.plx-data-grid__editor-message'); return m ? m.textContent : null; });
      const spoken = () => page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent).join('|'));
      const settle = async () => { await page.evaluate(() => window.__settle()); await wait(500); };
      const edit = async (r, text) => { await focus(r); await key('F2'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type(text); await key('Enter'); };

      await check(T + 'opening an editor announces Editing and the column', async () => {
        await mount('ok'); await focus(0); await key('F2'); await wait(500); assert.match(await spoken(), /Editing Name/);
      });
      await check(T + 'while the answer waits the new value shows, the cell is busy with a spinner and takes no new edit', async () => {
        await mount('ok'); await edit(0, 'Ann'); const c = await cell(0);
        assert.deepEqual([c.busy, c.spinner, c.text.includes('Ann')], ['true', true, true]);
        await focus(0); await key('F2'); assert.equal(await page.evaluate(() => !!document.querySelector('.plx-data-grid__editor')), false, 'no editor while busy');
      });
      await check(T + 'when it resolves the busy state goes and Saved is announced', async () => {
        await mount('ok'); await edit(0, 'Ann'); await settle(); const c = await cell(0);
        assert.deepEqual([c.busy, c.spinner, c.text.includes('Ann')], [null, false, true]); assert.match(await spoken(), /Saved/);
      });
      await check(T + 'when it rejects the old value comes back with the error message under the cell until the next key', async () => {
        await mount('refuse'); await edit(0, 'Ann'); await settle(); const c = await cell(0);
        assert.deepEqual([c.busy, c.spinner, c.text.includes('Person'), c.text.includes('Ann')], [null, false, true, false]); assert.equal(await msg(), 'Name already used');
        await key('ArrowDown'); assert.equal(await msg(), null);
      });
      await check(T + 'a refusal with no text shows the default message', async () => {
        await mount('refuse-plain'); await edit(0, 'Ann'); await settle(); assert.equal(await msg(), 'Couldn’t save. The previous value is back.');
      });
      await check(T + 'a plain onCellEdit saves at once as before', async () => {
        await mount('plain'); await edit(0, 'Ann'); const c = await cell(0); assert.deepEqual([c.busy, c.spinner, c.text.includes('Ann')], [null, false, true]);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_SAVE_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
