/* Plenix tests · the placeholder of an invalid field (issue 1074, ADR 0046 amended, D-0137 B): on the invalid fill the placeholder is 4.5:1 or more; a resting field keeps its placeholder.
   Summary: an invalid Input and an invalid Cascader placeholder are 4.5:1 or more on their fill in light and dark (axe color-contrast finds nothing); a resting Input's placeholder is still gray-600 in light.
   Proof first: before the change the invalid Cascader placeholder in light measured below 4.5:1 on the red fill.
   Usage: node tests/placeholder-invalid-1074.test.js   → PLACEHOLDER_INVALID_1074_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9975, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' });
    for (const mode of ['light', 'dark']) {
      const r = await page.evaluate(async (mode) => {
        document.documentElement.setAttribute('data-plx-mode', mode); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        const opts = [{ id: 'eu', label: 'Europe', children: [{ id: 'p', label: 'Paris' }] }];
        ReactDOM.createRoot(c).render(h('div', null, h(P.Input, { 'aria-label': 'Resting', placeholder: 'Resting' }), h(P.Input, { 'aria-label': 'Invalid', placeholder: 'Invalid', invalid: true }), h(P.Cascader, { label: 'Office', options: opts, invalid: true }), h(P.Cascader, { label: 'Office 2', options: opts })));
        await new Promise((r) => setTimeout(r, 700));
        const resting = getComputedStyle(c.querySelector('input'), '::placeholder').color;
        const violations = (await axe.run(c, { runOnly: ['color-contrast'] })).violations.flatMap((v) => v.nodes.map((n) => n.any.map((a) => a.message).join(' ').slice(0, 100) + ' | ' + n.html.slice(0, 60)));
        return { resting, violations };
      }, mode);
      assert.deepEqual(r.violations, [], mode + ': no color-contrast violation on invalid fields');
      if (mode === 'light') assert.equal(r.resting, 'rgb(110, 110, 110)', 'a resting Input placeholder is still gray-600 in light (' + r.resting + ')');
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('PLACEHOLDER_INVALID_1074_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
