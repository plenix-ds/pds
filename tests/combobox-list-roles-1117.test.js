/* Plenix tests · #1117 (story axe, #909): an open Combobox list never holds only non-option children.
   Summary: with options loading (loadOptions pending), failing, or matching nothing, the open list is a listbox whose children are options (a disabled option carries the
     loading text, the error or the empty text), so axe's aria-required-children passes; a list with options is unchanged. Left to right.
   Proof first: before the fix the loading list holds a presentation row only (a listbox without an option).
   Usage: node tests/combobox-list-roles-1117.test.js   → COMBOBOX_LIST_ROLES_1117_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9835, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const state = (src) => page.evaluate(async (src) => {
      const h = React.createElement, P = Plenix; window.__root && window.__root.unmount(); const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
      window.__root = ReactDOM.createRoot(c); window.__root.render(eval(src)); await new Promise((r) => setTimeout(r, 400));
      const input = c.querySelector('input'); input.focus(); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); await new Promise((r) => setTimeout(r, 600));
      const list = c.querySelector('[role=listbox]'); if (!list) return { list: false };
      return { list: true, kids: [...list.children].map((li) => li.getAttribute('role')), text: list.textContent.trim().slice(0, 40) };
    }, src);
    const cases = [
      ['loading', "h(P.Combobox, { label: 'Color', options: [], loadOptions: () => new Promise(() => {}), loadDelay: 0, onChange() {} })"],
      ['failed', "h(P.Combobox, { label: 'Color', options: [], loadOptions: () => Promise.reject(new Error('x')), loadDelay: 0, onChange() {} })"],
      ['empty', "h(P.Combobox, { label: 'Color', options: [], onChange() {} })"],
      ['with options', "h(P.Combobox, { label: 'Color', options: ['Red', 'Green'], onChange() {} })"],
    ];
    for (const [name, src] of cases) {
      const s = await state(src);
      assert.ok(s.list, name + ': the list opens'); assert.ok(s.kids.length > 0, name + ': the list has children');
      assert.ok(s.kids.some((k) => k === 'option'), name + ': the listbox holds an option (' + JSON.stringify(s.kids) + ')');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COMBOBOX_LIST_ROLES_1117_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
