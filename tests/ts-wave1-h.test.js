/* Plenix tests · TypeScript wave 1, batch H (issue 292, ADR 0011): Tabs converted to TSX still behaves the same: a click and the arrow keys
   choose a tab (onChange once each), Home and End jump, a disabled tab is skipped, the panel of the chosen tab shows, and in a right-to-left
   page ArrowLeft moves to the next tab.   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-h.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9662, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      const App = () => { const [v, setV] = React.useState('a'); return h(Plenix.Tabs, { label: 'Sections', value: v, onChange: (x) => { window.calls.push(x); setV(x); }, items: [
        { value: 'a', label: 'Overview', content: 'panel a' }, { value: 'b', label: 'People', count: 3, content: 'panel b' }, { value: 'c', label: 'Hidden', disabled: true, content: 'panel c' }, { value: 'd', label: 'Notes', content: 'panel d' }] }); };
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(600);
    const sel = () => page.$eval('[role=tab][aria-selected=true]', (e) => e.textContent.replace(/\s+/g, ' ').trim());
    const panel = () => page.$eval('[role=tabpanel]:not([hidden])', (e) => e.textContent);
    assert.equal(await sel(), 'Overview'); assert.equal(await panel(), 'panel a');
    await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].find((b) => /People/.test(b.textContent)).click()); await sleep(150);
    assert.match(await sel(), /People/); assert.equal(await panel(), 'panel b');
    await page.focus('[role=tab][aria-selected=true]'); await page.keyboard.press('ArrowRight'); await sleep(150);
    assert.equal(await sel(), 'Notes', 'ArrowRight skips the disabled tab'); assert.equal(await panel(), 'panel d');
    await page.keyboard.press('Home'); await sleep(150); assert.equal(await sel(), 'Overview');
    await page.keyboard.press('End'); await sleep(150); assert.equal(await sel(), 'Notes');
    assert.deepEqual(await page.evaluate(() => window.calls), ['b', 'd', 'a', 'd'], 'onChange once per change');
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await sleep(200);
    await page.keyboard.press('Home'); await sleep(150);
    await page.keyboard.press('ArrowLeft'); await sleep(150);
    assert.match(await sel(), /People/, 'right to left: ArrowLeft moves to the next tab');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-h: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
