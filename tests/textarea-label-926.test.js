/* Plenix tests · Textarea takes a `label` (issue 926, RedSave P-72): the accessible name, like SearchField's label, so a Textarea outside a Field always has one.
   Summary: <Textarea label="Notes"> has the accessible name "Notes" (aria-label on the <textarea>), the label is not left as an unknown attribute on the element, an aria-label or
     aria-labelledby given by the app still wins, a Textarea inside a Field keeps the Field's label, and axe finds no unlabeled control. Left to right and right to left.
   Proof first: before the change `label` is not a prop: it is passed on as an attribute, the textarea has no accessible name, and axe reports "label".
   Usage: node tests/textarea-label-926.test.js   → TEXTAREA_LABEL_926_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9926, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' });
      const read = (expr) => page.evaluate(async (dir, expr) => {
        document.documentElement.setAttribute('dir', dir); window.__root && window.__root.unmount();
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement, P = window.Plenix;
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 400));
        const t = document.querySelector('#c textarea'), v = await window.axe.run(document.getElementById('c'), { runOnly: { type: 'rule', values: ['label'] }, resultTypes: ['violations'] });
        return { name: t.getAttribute('aria-label'), labelledby: t.getAttribute('aria-labelledby'), attr: t.hasAttribute('label'), axe: v.violations.length };
      }, dir, expr);
      let r = await read("h(P.Textarea, { label: 'Notes' })");
      assert.equal(r.name, 'Notes', T + 'the Textarea has the accessible name "Notes"'); assert.equal(r.attr, false, T + 'label is not left as an attribute on the element'); assert.equal(r.axe, 0, T + 'axe finds no unlabeled control');
      r = await read("h(P.Textarea, { label: 'Notes', 'aria-label': 'Case notes' })"); assert.equal(r.name, 'Case notes', T + 'an aria-label from the app wins');
      r = await read("h('div', null, h('span', { id: 'x' }, 'Reason'), h(P.Textarea, { label: 'Notes', 'aria-labelledby': 'x' }))"); assert.ok(r.labelledby === 'x' && r.name === null, T + 'an aria-labelledby from the app wins and no aria-label is added');
      r = await read("h(P.Field, { label: 'Description' }, h(P.Textarea, null))"); assert.equal(r.axe, 0, T + 'inside a Field the Field\'s label names it');
      r = await read("h(P.Textarea, { label: 'Un nom très long pour une zone de texte qui continue encore et encore pour tester les noms longs' })"); assert.equal(r.axe, 0, T + 'a long name is fine');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('TEXTAREA_LABEL_926_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
