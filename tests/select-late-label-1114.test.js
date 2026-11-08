/* Plenix tests · a Select named by a <label for> that appears after the Select mounts (issue 1114, the story axe run's aria-input-field-name on a Select in ColumnsMenu).
   Summary: the Select names itself from a <label for> in a layout effect (before the first paint; a passive effect left a moment with no name that the story axe run caught as aria-input-field-name on #plx-fr1), and waits up to a second for a label drawn later. Here: a label added after mount names the Select (aria-labelledby) and clicking it focuses the Select; no violation.
   Proof first: before the change a label added after mount does not name the Select.
   Usage: node tests/select-late-label-1114.test.js   → SELECT_LATE_LABEL_1114_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9984, server = await serve(PORT); let browser;
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
        ReactDOM.createRoot(c).render(h(P.Select, { id: 'late-select', value: 'a', onChange: () => {}, options: [{ value: 'a', label: 'Name' }, { value: 'b', label: 'Size' }] }));
        await new Promise((r) => setTimeout(r, 400));
        const label = document.createElement('label'); label.setAttribute('for', 'late-select'); label.textContent = 'Show first'; c.prepend(label);
        await new Promise((r) => setTimeout(r, 400));
        const box = c.querySelector('[role=combobox]'), violations = (await axe.run(c, { runOnly: ['aria-input-field-name'] })).violations.length;
        label.click(); await new Promise((r) => setTimeout(r, 100));
        return { by: box.getAttribute('aria-labelledby'), violations, focused: document.activeElement === box };
      }, dir);
      assert.ok(r.by, dir + ': the Select is named by the late label (aria-labelledby ' + r.by + ')'); assert.equal(r.violations, 0, dir + ': no aria-input-field-name violation'); assert.ok(r.focused, dir + ': clicking the label focuses the Select');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('SELECT_LATE_LABEL_1114_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
