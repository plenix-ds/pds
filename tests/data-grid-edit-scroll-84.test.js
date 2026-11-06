// Plenix · tests/data-grid-edit-scroll-84.test.js: scrolling never loses an edit in 10,000 rows (issue 84; design 84-cell-editors §6).
//   node tests/data-grid-edit-scroll-84.test.js   → DATA_GRID_EDIT_SCROLL_84_OK
// Written first (proof first): before the change the typed text is lost when the editing row scrolls out of the window and back. In left to right and right to left:
//   start editing the first row of 10,000, type, scroll far away (the row and its editor leave the window; nothing is saved or cancelled), scroll back: the editor is open with the typed text;
//   Enter then saves that text; after Escape (a cancelled edit) scrolling away and back shows no editor and no old draft.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9886, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = () => page.evaluate(async (dir) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__e = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 10000 }, (_, i) => ({ id: 'r' + i, name: 'Person ' + i }));
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns: [{ title: 'Name', field: 'name', editor: 'input' }], onCellEdit: (r, e) => window.__e.push(r.id + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1200));
        document.querySelector('[role=row][data-plx-record] [data-plx-field=name]').focus();
      }, dir);
      const scrollTo = async (top) => { await page.evaluate((top) => { const h = document.querySelector('[class*=tableholder]'); h.scrollTop = top; h.dispatchEvent(new Event('scroll')); }, top); await wait(900); };
      const state = () => page.evaluate(() => ({ editor: (document.querySelector('.plx-data-grid__editor') || {}).value ?? null, edits: window.__e.slice() }));
      const key = async (k) => { await page.keyboard.press(k); await wait(300); };

      await check(T + 'the typed text survives scrolling the row out of the window and back, and Enter saves it', async () => {
        await mount(); await key('F2'); await page.keyboard.type('XYZ'); await wait(200);
        await scrollTo(200000); let s = await state(); assert.equal(s.editor, null, 'the editor left with its row'); assert.deepEqual(s.edits, [], 'nothing saved or cancelled');
        await scrollTo(0); s = await state(); assert.equal(s.editor, 'Person 0XYZ', 'the draft is back');
        await key('Enter'); assert.deepEqual((await state()).edits, ['r0=Person 0XYZ']);
      });
      await check(T + 'after Escape the old draft does not come back', async () => {
        await mount(); await key('F2'); await page.keyboard.type('XYZ'); await wait(200); await key('Escape'); await scrollTo(200000); await scrollTo(0);
        const s = await state(); assert.equal(s.editor, null); assert.deepEqual(s.edits, []);
        await page.evaluate(() => document.querySelector('[role=row][data-plx-record] [data-plx-field=name]').focus()); await key('F2'); assert.equal((await state()).editor, 'Person 0', 'a new edit starts from the saved value');
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDIT_SCROLL_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
