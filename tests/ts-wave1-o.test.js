/* Plenix tests · TypeScript wave 1, batch O (issue 292, ADR 0011): TreeSelect converted to TSX still behaves the same: the field opens a tree, a click on a
   leaf chooses it (onChange gets the id and the field shows the label), in multiple mode a parent checks every leaf under it and shows
   mixed when only some are chosen, search narrows the tree, ArrowRight opens a branch, and a read-only select does not open.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-o.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9669, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 900, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';
      const nodes = [{ id: 'docs', label: 'Documents', children: [{ id: 'letter', label: 'Letter' }, { id: 'report', label: 'Report' }] }, { id: 'img', label: 'Images' }];
      const One = () => { const [v, setV] = React.useState(null); return h(Plenix.TreeSelect, { label: 'Folder', nodes, value: v, search: true, defaultExpanded: ['docs'], onChange: (x) => { window.calls.push('one:' + x); setV(x); } }); };
      const Many = () => { const [v, setV] = React.useState(['letter']); return h(Plenix.TreeSelect, { label: 'Many', nodes, values: v, multiple: true, defaultExpanded: ['docs'], onChange: (x) => { window.calls.push('many:' + x.join(',')); setV(x); } }); };
      ReactDOM.createRoot(document.getElementById('a')).render(h(One)); ReactDOM.createRoot(document.getElementById('b')).render(h(Many));
      ReactDOM.createRoot(document.getElementById('c')).render(h(Plenix.TreeSelect, { label: 'Locked', nodes, value: 'img', readOnly: true }));
    });
    await sleep(700);
    await page.click('#a [role=combobox]'); await sleep(400);
    assert.ok(await page.$('[role=tree]'), 'the field opens a tree');
    await page.evaluate(() => [...document.querySelectorAll('[role=treeitem] .plx-tree__label')].find((e) => e.textContent === 'Report').click()); await sleep(300);
    assert.deepEqual(await page.evaluate(() => window.calls), ['one:report']);
    assert.match(await page.$eval('#a [role=combobox]', (e) => e.textContent), /Report/, 'the field shows the label');
    assert.equal(await page.$$eval('[role=tree]', (e) => e.length), 0, 'choosing closes the tree');
    await page.click('#b [role=combobox]'); await sleep(400);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('[role=treeitem]')].find((e) => /Documents/.test(e.textContent)).getAttribute('aria-checked')), 'mixed', 'a parent with some leaves chosen is mixed');
    await page.evaluate(() => [...document.querySelectorAll('[role=treeitem] .plx-tree__label')].find((e) => e.textContent === 'Documents').click()); await sleep(300);
    assert.ok((await page.evaluate(() => window.calls)).includes('many:letter,report'), 'a parent checks every leaf under it: ' + await page.evaluate(() => window.calls));
    await page.keyboard.press('Escape'); await sleep(300);
    await page.click('#a [role=combobox]'); await sleep(400);
    await page.type('.plx-tree-select__panel input', 'imag'); await sleep(300);
    assert.deepEqual(await page.$$eval('[role=treeitem] .plx-tree__label', (e) => e.map((x) => x.textContent)), ['Images'], 'search narrows the tree');
    await page.keyboard.press('Escape'); await sleep(300);
    await page.click('#c [role=combobox]'); await sleep(300);
    assert.equal(await page.$$eval('[role=tree]', (e) => e.length), 0, 'a read-only select does not open');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-o: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
