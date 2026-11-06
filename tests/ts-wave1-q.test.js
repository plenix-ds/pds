/* Plenix tests · TypeScript wave 1, batch Q (issue 292, ADR 0011): Cascader converted to TSX still behaves the same: the field opens columns, a click walks
   down and a click on a leaf chooses it (onChange gets the id and its path of ids, the field shows the path), multiple mode checks leaves and
   folds extra tags into "+N" with maxTags, search lists matching leaves with their path, and a read-only cascader does not open.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-q.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9673, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';
      const options = [{ id: 'eg', label: 'Egypt', children: [{ id: 'cairo', label: 'Cairo', children: [{ id: 'giza', label: 'Giza' }, { id: 'heliopolis', label: 'Heliopolis' }] }, { id: 'alex', label: 'Alexandria' }] }, { id: 'us', label: 'United States', children: [{ id: 'ny', label: 'New York' }] }];
      const One = () => { const [v, setV] = React.useState(null); return h(Plenix.Cascader, { label: 'Place', options, value: v, searchable: true, onChange: (x, path) => { window.calls.push('one:' + x + '@' + (path || []).join('/')); setV(x); } }); };
      const Many = () => { const [v, setV] = React.useState(['giza', 'alex', 'ny']); return h(Plenix.Cascader, { label: 'Many', options, values: v, multiple: true, maxTags: 1, onChange: (x) => { window.calls.push('many:' + x.join(',')); setV(x); } }); };
      ReactDOM.createRoot(document.getElementById('a')).render(h(One)); ReactDOM.createRoot(document.getElementById('b')).render(h(Many));
      ReactDOM.createRoot(document.getElementById('c')).render(h(Plenix.Cascader, { label: 'Locked', options, value: 'alex', readOnly: true }));
    });
    await sleep(800);
    await page.click('#a .plx-cascader__trigger'); await sleep(400);
    assert.ok(await page.$('.plx-miller-columns'), 'the field opens columns');
    const item = (txt) => page.evaluate((t) => { const e = [...document.querySelectorAll('.plx-miller-columns__item')].find((x) => x.textContent.trim().startsWith(t)); e.click(); return true; }, txt);
    await page.keyboard.press('Escape'); await sleep(200);
    await page.click('#a .plx-cascader__trigger'); await sleep(400);
    await item('Egypt'); await sleep(200); await item('Cairo'); await sleep(200); await item('Giza'); await sleep(300);
    assert.deepEqual(await page.evaluate(() => window.calls), ['one:giza@eg/cairo/giza']);
    assert.match(await page.$eval('#a .plx-cascader__value', (e) => e.textContent), /Egypt.*Cairo.*Giza/, 'the field shows the path');
    assert.match(await page.$eval('#b .plx-cascader__more', (e) => e.textContent), /\+2/, 'maxTags folds the extra tags into +2');
    await page.click('#a .plx-cascader__trigger'); await sleep(400);
    await page.type('.plx-cascader__search-input', 'new'); await sleep(300);
    assert.deepEqual(await page.$$eval('.plx-cascader__match-label', (e) => e.map((x) => x.textContent)), ['New York'], 'search lists the matching leaf');
    assert.match(await page.$eval('.plx-cascader__match-path', (e) => e.textContent), /United States/, 'with its path');
    await page.keyboard.press('Escape'); await sleep(300);
    await page.click('#c .plx-cascader__trigger'); await sleep(300);
    assert.equal(await page.$$eval('.plx-miller-columns', (e) => e.length), 0, 'a read-only cascader does not open');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-q: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
