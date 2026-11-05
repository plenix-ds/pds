/* Plenix tests · TypeScript wave 1, batch J (issue 292, ADR 0011): TransferList converted to TSX still behaves the same: checking options and
   "Add" moves them (onChange gets the new values), "Add all" skips a disabled option, a double click moves one, search narrows a list, ordered
   "Up" and "Down" reorder the checked chosen items, "Remove all" empties the target, and the marks are inert.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-j.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9664, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      const App = () => { const [v, setV] = React.useState(['b']); return h(Plenix.TransferList, { label: 'Columns', search: true, ordered: true, value: v, onChange: (n) => { window.calls.push(n.join(',')); setV(n); },
        options: [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Gamma', disabled: true }, { value: 'd', label: 'Delta' }, { value: 'e', label: 'Epsilon' }] }); };
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(600);
    const names = (side) => page.$$eval('[role=listbox]:nth-of-type(1)', () => []).then(() => page.evaluate((i) => [...document.querySelectorAll('.plx-transfer-list__panel')[i].querySelectorAll('[role=option]')].map((e) => e.textContent.trim()), side));
    const btn = (re) => page.evaluate((src) => { const b = [...document.querySelectorAll('.plx-transfer-list__moves button, .plx-transfer-list__tools button')].find((x) => new RegExp(src, 'i').test((x.getAttribute('aria-label') || '') + x.textContent)); b.click(); return !!b; }, re.source);
    assert.deepEqual(await names(0), ['Alpha', 'Gamma', 'Delta', 'Epsilon']); assert.deepEqual(await names(1), ['Beta']);
    assert.ok(await page.$eval('.plx-transfer-list__mark', (e) => e.hasAttribute('inert')), 'the marks are inert');
    await page.evaluate(() => [...document.querySelectorAll('.plx-transfer-list__panel')[0].querySelectorAll('[role=option]')].find((e) => /Alpha/.test(e.textContent)).click()); await sleep(100);
    await btn(/^add$/); await sleep(150);
    assert.deepEqual(await names(1), ['Beta', 'Alpha'], 'Add moves the checked option to the end of the chosen list');
    await page.evaluate(() => [...document.querySelectorAll('.plx-transfer-list__panel')[0].querySelectorAll('[role=option]')].find((e) => /Delta/.test(e.textContent)).dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))); await sleep(150);
    assert.deepEqual(await names(1), ['Beta', 'Alpha', 'Delta'], 'a double click moves one');
    await btn(/move up|^up$/); await sleep(150);
    assert.deepEqual(await names(1), ['Alpha', 'Delta', 'Beta'], 'Up moves the checked chosen items (the moved ones stay checked) up');
    await btn(/add all/); await sleep(150);
    assert.deepEqual(await names(1), ['Alpha', 'Delta', 'Beta', 'Epsilon'], 'Add all skips the disabled option');
    await btn(/remove all/); await sleep(150);
    assert.deepEqual(await names(1), [], 'Remove all empties the chosen list'); assert.equal((await names(0)).length, 5);
    await page.type('.plx-transfer-list__panel input[type=search], .plx-transfer-list__panel input[type=text]', 'ep'); await sleep(200);
    assert.deepEqual(await names(0), ['Epsilon'], 'search narrows a list');
    assert.equal((await page.evaluate(() => window.calls)).slice(0, 3).join('|'), 'b,a|b,a,d|a,d,b', 'onChange got the new values each time');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-j: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
