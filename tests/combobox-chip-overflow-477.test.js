/* Plenix tests · #477 item 1 (ADR 0016 addendum, G3 A): Combobox chipOverflow="count" keeps the chosen chips on one line and folds the ones that don't
   fit into one "+N" Tag named "{count} more"; the default ("wrap") is unchanged; it refits when the box widens, and in right-to-left.
   Usage: node tests/combobox-chip-overflow-477.test.js   -> COMBOBOX_CHIP_OVERFLOW_477_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9671, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 900, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement;
      const options = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((x) => ({ value: x, label: x }));
      document.querySelector('main').innerHTML = '<div id="w" style="width:260px"><div id="a"></div></div><div id="x" style="width:260px"><div id="b"></div></div>';
      ReactDOM.createRoot(document.getElementById('a')).render(h(Plenix.Combobox, { label: 'Tags', multiple: true, options, values: options.map((o) => o.value), onChange() {}, chipOverflow: 'count', width: 'fill' }));
      ReactDOM.createRoot(document.getElementById('b')).render(h(Plenix.Combobox, { label: 'Wrap', multiple: true, options, values: options.map((o) => o.value), onChange() {}, width: 'fill' }));
    });
    await sleep(900);
    const rows = (sel) => page.$$eval(sel + ' .plx-combobox__field > .plx-tag, ' + sel + ' .plx-combobox__field > span.plx-tag', (t) => new Set(t.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    const info = (sel) => page.evaluate((s) => { const f = document.querySelector(s + ' .plx-combobox__field'); const tags = [...f.querySelectorAll('.plx-tag')]; const fr = f.getBoundingClientRect();
      return { n: tags.length, last: tags[tags.length - 1] && tags[tags.length - 1].textContent.trim(), inside: tags.every((t) => t.getBoundingClientRect().right <= fr.right + 1 && t.getBoundingClientRect().left >= fr.left - 1), tops: new Set(tags.map((t) => Math.round(t.getBoundingClientRect().top))).size, height: Math.round(fr.height) }; }, sel);
    const a = await info('#a'), b = await info('#b');
    assert.equal(a.tops, 1, 'count: every chip and the +N are on one row');
    assert.ok(a.inside, 'count: nothing past the field');
    assert.match(a.last, /^\+\d+/, 'count: the last Tag is "+N": ' + a.last);
    assert.ok(a.n < 7, 'count: some chips folded (' + a.n + ' tags)');
    assert.ok(await page.$eval('#a .plx-combobox__field', (f) => /\d+ more/i.test(f.textContent + [...f.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).join(' '))), 'the +N is named "N more"');
    assert.equal(b.n, 6, 'wrap (default): all six chips, no +N'); assert.ok(b.tops > 1, 'wrap: the chips wrap onto rows');
    await page.evaluate(() => { document.getElementById('w').style.width = '700px'; }); await sleep(600);
    const wide = await info('#a');
    assert.equal(wide.n, 6, 'count: in a wide box every chip shows and there is no +N'); assert.ok(!/^\+\d/.test(wide.last));
    await page.evaluate(() => { document.documentElement.setAttribute('dir', 'rtl'); document.getElementById('w').style.width = '260px'; }); await sleep(700);
    const r = await info('#a'); assert.equal(r.tops, 1, 'rtl: one row'); assert.ok(r.inside, 'rtl: nothing past the field'); assert.match(r.last, /^\+\d+/, 'rtl: +N at the end');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('COMBOBOX_CHIP_OVERFLOW_477_OK');
  } catch (e) { console.log('COMBOBOX_CHIP_OVERFLOW_477_FAIL ' + e.message); await browser.close(); server.close(); process.exit(1); }
  await browser.close(); server.close(); process.exit(0);
})();
