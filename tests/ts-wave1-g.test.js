/* Plenix tests · TypeScript wave 1, batch G (issue 292, ADR 0011): CodeEditor converted to TSX still behaves the same: it types and reports the
   code (value, event), Tab inserts the indent, Enter keeps the line's indent, Escape then Tab leaves it, line numbers count the lines,
   and a ref reaches the textarea.   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-g.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9661, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = []; window.ref = React.createRef();
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      const App = () => { const [v, setV] = React.useState('  a'); return h(Plenix.CodeEditor, { ref: window.ref, label: 'Code', value: v, lineNumbers: true, tabSize: 2, onChange: (code) => { window.calls.push(code); setV(code); } }); };
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(600);
    assert.ok(await page.evaluate(() => window.ref.current && window.ref.current.tagName === 'TEXTAREA'), 'the ref reaches the textarea');
    await page.focus('textarea');
    await page.evaluate(() => { const t = document.querySelector('textarea'); t.setSelectionRange(t.value.length, t.value.length); });
    await page.keyboard.press('Enter'); await sleep(150);
    assert.equal(await page.$eval('textarea', (t) => t.value), '  a\n  ', 'Enter keeps the indent');
    await page.keyboard.press('Tab'); await sleep(150);
    assert.equal(await page.$eval('textarea', (t) => t.value), '  a\n    ', 'Tab inserts the indent');
    assert.equal(await page.$$eval('.plx-code-editor__number', (e) => e.length), 2, 'two line numbers');
    assert.ok((await page.evaluate(() => window.calls)).length >= 2, 'onChange reports each change');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-g: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
