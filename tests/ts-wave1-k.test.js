/* Plenix tests · TypeScript wave 1, batch K (issue 292, ADR 0011): TimeZoneSelect converted to TSX still behaves the same: focus opens the list,
   typing a city narrows it, Enter chooses (onChange gets the IANA name, the field shows the city), an offset typed as "+5:30" finds a zone,
   Escape closes, a read-only select opens nothing, and timeZoneOptions lists zones with their offset.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-k.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9665, server = await serve(PORT); let browser;
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
      const zones = ['Africa/Cairo', 'Asia/Kolkata', 'Europe/Paris', 'America/New_York', 'UTC'];
      const App = () => { const [v, setV] = React.useState(); return h('div', null,
        h('div', { id: 'a' }, h(Plenix.TimeZoneSelect, { label: 'Time zone', zones, value: v, date: new Date('2026-01-15T12:00:00Z'), onChange: (z) => { window.calls.push(z); setV(z); } })),
        h('div', { id: 'b' }, h(Plenix.TimeZoneSelect, { label: 'Locked', zones, value: 'Europe/Paris', readOnly: true, onChange: (z) => window.calls.push('locked:' + z) }))); };
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(600);
    await page.focus('#a input'); await sleep(200);
    assert.equal(await page.$$eval('#a [role=option]', (e) => e.length), 5, 'focus opens the list with every zone');
    await page.keyboard.type('cairo'); await sleep(200);
    assert.deepEqual(await page.$$eval('#a [role=option]', (e) => e.map((x) => x.textContent.replace(/\s+/g, ' ').trim().replace(/UTC.*$/, ''))), ['Cairo'], 'typing narrows the list');
    await page.keyboard.press('Enter'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['Africa/Cairo']); assert.equal(await page.$eval('#a input', (e) => e.value), 'Cairo', 'the field shows the city');
    await page.focus('#a input'); await sleep(150);
    await page.evaluate(() => { document.querySelector('#a input').select(); }); await page.keyboard.type('+5:30'); await sleep(200);
    assert.deepEqual(await page.$$eval('#a [role=option]', (e) => e.map((x) => x.textContent.replace(/\s+/g, ' ').trim().replace(/UTC.*$/, ''))), ['Kolkata'], 'an offset finds a zone');
    await page.keyboard.press('Escape'); await sleep(150);
    assert.equal(await page.$$eval('#a [role=option]', (e) => e.length), 0, 'Escape closes');
    await page.focus('#b input'); await sleep(200);
    assert.equal(await page.$$eval('#b [role=option]', (e) => e.length), 0, 'a read-only select opens nothing');
    const opts = await page.evaluate(() => Plenix.timeZoneOptions({ zones: ['Asia/Kolkata'], date: new Date('2026-01-15T12:00:00Z') }));
    assert.equal(opts[0].offset, 'UTC+05:30'); assert.equal(opts[0].minutes, 330);
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-k: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
