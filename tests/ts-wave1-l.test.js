/* Plenix tests · TypeScript wave 1, batch L (issue 292, ADR 0011): MillerColumns converted to TSX still behaves the same: choosing an item opens its
   children in the next column (onPathChange), ArrowRight goes into it and ArrowLeft back, Enter on a leaf opens it (onOpen with the path), the
   preview column draws the chosen leaf, a lazy parent loads its children, and in a right-to-left page ArrowLeft goes in.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-l.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9666, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1100, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      const items = [{ id: 'docs', label: 'Documents', children: [{ id: 'letter', label: 'Letter' }, { id: 'report', label: 'Report' }] }, { id: 'remote', label: 'Remote', hasChildren: true }, { id: 'readme', label: 'Readme' }];
      const App = () => h(Plenix.MillerColumns, { label: 'Files', items, loadChildren: (n) => (n.id === 'remote' ? Promise.resolve([{ id: 'r1', label: 'Remote one' }]) : null),
        onPathChange: (p) => window.calls.push('path:' + p.join('/')), onOpen: (it, p) => window.calls.push('open:' + p.join('/')), renderPreview: (it) => h('div', { id: 'pv' }, 'Preview of ' + it.label) });
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(600);
    const cols = () => page.$$eval('.plx-miller-columns__column', (c) => c.length);
    await page.evaluate(() => [...document.querySelectorAll('.plx-miller-columns__item')].find((e) => /Documents/.test(e.textContent)).click()); await sleep(200);
    assert.equal(await cols(), 2, 'choosing a parent opens its column');
    await page.keyboard.press('ArrowRight'); await sleep(200);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Documents', 'ArrowRight goes into the next column');
    await page.keyboard.press('ArrowDown'); await sleep(150);
    assert.ok(await page.$('#pv'), 'the preview column draws the chosen leaf'); assert.match(await page.$eval('#pv', (e) => e.textContent), /Report/);
    await page.keyboard.press('Enter'); await sleep(150);
    await page.keyboard.press('ArrowLeft'); await sleep(200);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Files', 'ArrowLeft goes back');
    await page.evaluate(() => [...document.querySelectorAll('.plx-miller-columns__item')].find((e) => /Remote/.test(e.textContent)).click()); await sleep(600);
    assert.ok(await page.evaluate(() => [...document.querySelectorAll('.plx-miller-columns__label')].some((e) => e.textContent === 'Remote one')), 'a lazy parent loads its children');
    const calls = await page.evaluate(() => window.calls);
    assert.ok(calls.includes('path:docs') && calls.includes('path:docs/report') && calls.includes('open:docs/report'), 'callbacks: ' + calls);
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await sleep(200);
    await page.evaluate(() => [...document.querySelectorAll('.plx-miller-columns__item')].find((e) => /Documents/.test(e.textContent)).click()); await sleep(200);
    await page.keyboard.press('ArrowLeft'); await sleep(200);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Documents', 'right to left: ArrowLeft goes in');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-l: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
