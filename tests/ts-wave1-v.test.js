/* Plenix tests · TypeScript wave 1, batch V (issue 292, ADR 0011): RichTextEditor converted to TSX still behaves the same: it loads the engine, typing reports
   the cleaned HTML through onChange, the Bold and bulleted list toolbar buttons format, a read-only editor has no toolbar and is not editable, and no script error.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-v.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9676, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1100, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.html = '';
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div>';
      ReactDOM.createRoot(document.getElementById('a')).render(h(Plenix.RichTextEditor, { label: 'Notes', onChange: (v) => { window.html = v; }, mentions: { search: (q) => [{ value: 'u1', label: 'Maya Chen' }, { value: 'u2', label: 'Paul Nasser' }].filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) } }));
      ReactDOM.createRoot(document.getElementById('b')).render(h(Plenix.RichTextEditor, { label: 'Locked', readOnly: true, defaultValue: '<p>Read me</p>' }));
    });
    await page.waitForSelector('#a [contenteditable=true]', { timeout: 30000 }); await sleep(500);
    await page.click('#a [contenteditable=true]'); await page.keyboard.type('Hello world'); await sleep(300);
    assert.match(await page.evaluate(() => window.html), /<p>Hello world<\/p>/, 'typing reports the cleaned HTML');
    await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await sleep(150);
    await page.evaluate(() => { const b = [...document.querySelectorAll('#a button')].find((x) => /^bold/i.test(x.getAttribute('aria-label') || '')); b.click(); }); await sleep(300);
    assert.match(await page.evaluate(() => window.html), /<strong>Hello world<\/strong>/, 'the Bold button makes bold text');
    await page.evaluate(() => { const b = [...document.querySelectorAll('#a button')].find((x) => /bullet/i.test(x.getAttribute('aria-label') || '')); b.click(); }); await sleep(300);
    assert.match(await page.evaluate(() => window.html), /<ul>/, 'the bulleted list button formats');
    assert.equal(await page.$eval('#b [role=textbox]', (e) => e.getAttribute('contenteditable')), 'false', 'a read-only editor is not editable');
    assert.equal(await page.$$eval('#b [role=toolbar], #b .plx-toolbar', (e) => e.length), 0, 'and has no toolbar');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)), [], 'no script errors');
    console.log('ts-wave1-v: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
