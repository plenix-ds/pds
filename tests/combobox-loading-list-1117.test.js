/* Plenix tests · the open list of a Combobox while it loads (issue 1117, the story axe run's aria-required-children on CountrySelect's list).
   Summary: a Combobox whose options load (loadOptions that has not answered) shows its list with a loading row; the listbox must still hold an option (a disabled one, like the empty and error rows) so it has the children
     its role requires, and axe finds no aria-required-children violation; the row still says it is loading. Left to right and right to left.
   Proof first: before the change the loading row is role="presentation", so the listbox has no option.
   Usage: node tests/combobox-loading-list-1117.test.js   → COMBOBOX_LOADING_LIST_1117_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9985, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' });
      const r = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h(P.Combobox, { label: 'Owner', loadOptions: () => new Promise(() => {}), minChars: 0, onChange: () => {} }));
        await new Promise((r) => setTimeout(r, 300));
        const input = c.querySelector('input'); input.focus(); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await new Promise((r) => setTimeout(r, 900));
        const list = document.querySelector('[role=listbox]');
        const res = await axe.run(c, { runOnly: ['aria-required-children'] });
        return { list: !!list, options: list ? list.querySelectorAll('[role=option]').length : 0, disabled: list ? list.querySelectorAll('[role=option][aria-disabled=true]').length : 0, text: list ? list.textContent.trim() : '', busy: list ? list.getAttribute('aria-busy') : null, violations: res.violations.length };
      }, dir);
      assert.ok(r.list, dir + ': the list is open'); assert.equal(r.violations, 0, dir + ': no aria-required-children violation (' + JSON.stringify(r) + ')');
      assert.ok(r.options >= 1 && r.options === r.disabled, dir + ': the loading row is a disabled option'); assert.ok(r.text.length > 0, dir + ': it still says it is loading');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('COMBOBOX_LOADING_LIST_1117_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
