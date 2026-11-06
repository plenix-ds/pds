/* Plenix tests · FormFlow defaultValue (issue 465; G3 ruling on #465, ADR 0016 addendum).
   Summary: FormFlow starts from `defaultValue` (the draft) when given, while `initialValue` stays the baseline:
     the fields show the draft; the form is dirty (Cancel asks "Your changes will be lost." first) because the draft differs from the baseline;
     without defaultValue nothing changes (the fields show initialValue and Cancel closes at once).
     Left to right and right to left.
   Proof first: before 465 defaultValue is ignored: the fields show the baseline and Cancel does not ask.
   Usage: node tests/form-flow-default-value-465.test.js   → FORM_FLOW_DEFAULT_VALUE_465_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9884, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 900, height: 600 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (defaultValue) => page.evaluate(async (dir, defaultValue) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__cancelled = 0;
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.ToastProvider, null, h(Plenix.FormFlow, Object.assign({ mode: 'edit', surface: 'drawer', title: 'Edit case', initialValue: { name: 'Baseline' }, sessionKey: 'k', onSubmit: async () => {}, onCancel: () => { window.__cancelled++; } }, defaultValue ? { defaultValue } : {}),
          ({ value, setValue }) => h('input', { id: 'f', 'aria-label': 'Name', value: value.name, onChange: (e) => setValue({ ...value, name: e.target.value }) }))));
        await new Promise((r) => setTimeout(r, 700));
      }, dir, defaultValue);
      const shown = () => page.evaluate(() => document.getElementById('f').value);
      const cancel = async () => { await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button')].find((b) => b.textContent.trim() === 'Cancel').click()); await wait(600); };
      const asked = () => page.evaluate(() => /Your changes will be lost/.test(document.body.textContent));
      const cancelled = () => page.evaluate(() => window.__cancelled);
      const T = dir + ': ';
      await mount({ name: 'Draft' }); assert.equal(await shown(), 'Draft', T + 'the fields show the draft');
      await cancel(); assert.equal(await asked(), true, T + 'a draft that differs from the baseline is dirty: Cancel asks'); assert.equal(await cancelled(), 0, T + 'and has not closed yet');
      await mount(undefined); assert.equal(await shown(), 'Baseline', T + 'without defaultValue the fields show initialValue'); await cancel(); assert.equal(await cancelled(), 1, T + 'and Cancel closes at once');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('FORM_FLOW_DEFAULT_VALUE_465_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
