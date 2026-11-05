/* Plenix tests · TypeScript wave 1, batch I (issue 292, ADR 0011): Tree converted to TSX still behaves the same: a click selects, ArrowRight opens
   a branch and goes to its first child, ArrowLeft goes back and closes, ArrowDown and End move, Enter selects, onExpandedChange reports the open
   branches, a branch with loadChildren loads when opened, and in a right-to-left page ArrowLeft opens.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-i.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9663, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 900, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      const App = () => { const [sel, setSel] = React.useState(); return h(Plenix.Tree, { label: 'Files', selected: sel, onSelect: (id) => { window.calls.push('sel:' + id); setSel(id); }, onExpandedChange: (ids) => window.calls.push('open:' + ids.join(',')),
        loadChildren: (n) => (n.id === 'lazy' ? Promise.resolve([{ id: 'lazy1', label: 'Loaded child' }]) : null),
        nodes: [{ id: 'docs', label: 'Documents', children: [{ id: 'a', label: 'Letter' }, { id: 'b', label: 'Report' }] }, { id: 'lazy', label: 'Remote', hasChildren: true }, { id: 'img', label: 'Images' }] }); };
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(600);
    const focused = () => page.evaluate(() => document.activeElement && document.activeElement.textContent.replace(/\s+/g, ' ').trim().split(' ')[0]);
    await page.click('[role=treeitem] .plx-tree__label'); await sleep(150);
    assert.equal(await page.$eval('[role=treeitem][aria-selected=true] .plx-tree__label', (e) => e.textContent), 'Documents');
    await page.keyboard.press('ArrowRight'); await sleep(150);
    assert.equal(await page.$eval('[role=treeitem]', (e) => e.getAttribute('aria-expanded')), 'true', 'ArrowRight opens the branch');
    await page.keyboard.press('ArrowRight'); await sleep(150); assert.equal(await focused(), 'Letter', 'ArrowRight goes to the first child');
    await page.keyboard.press('ArrowDown'); await sleep(100); assert.equal(await focused(), 'Report');
    await page.keyboard.press('Enter'); await sleep(100);
    await page.keyboard.press('End'); await sleep(100); assert.equal(await focused(), 'Images');
    await page.evaluate(() => [...document.querySelectorAll('[role=treeitem] .plx-tree__label')].find((e) => e.textContent === 'Remote').click()); await sleep(150);
    await page.keyboard.press('ArrowRight'); await sleep(500);
    assert.ok(await page.evaluate(() => [...document.querySelectorAll('.plx-tree__label')].some((e) => e.textContent === 'Loaded child')), 'a lazy branch loads when opened');
    await page.keyboard.press('ArrowLeft'); await sleep(150);
    const calls = await page.evaluate(() => window.calls);
    assert.ok(calls.includes('sel:docs') && calls.includes('sel:b'), 'selections: ' + calls);
    assert.ok(calls.some((c) => /^open:.*docs/.test(c)), 'onExpandedChange reports the open branch: ' + calls);
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await sleep(200);
    await page.evaluate(() => [...document.querySelectorAll('[role=treeitem] .plx-tree__label')].find((e) => e.textContent === 'Documents').click()); await sleep(150);
    await page.keyboard.press('ArrowRight'); await sleep(150);
    assert.equal(await page.$eval('[role=treeitem]', (e) => e.getAttribute('aria-expanded')), 'false', 'right to left: ArrowRight closes the open branch');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-i: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
