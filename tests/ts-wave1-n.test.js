/* Plenix tests · TypeScript wave 1, batch N (issue 292, ADR 0011): DatePicker converted to TSX still behaves the same: typed text is read on blur
   (onChange gets "YYYY-MM-DD"), a text that is no date marks the field invalid, the calendar button opens a calendar and a click on a day
   chooses it, a range typed with a dash gives { start, end }, a date-time keeps the date and takes the time, and DatePicker.formatHint is there.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-n.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9668, server = await serve(PORT); let browser;
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
      const Single = () => { const [v, setV] = React.useState(null); return h(Plenix.DatePicker, { 'aria-label': 'Date', locale: 'en-US', today: '2026-03-10', value: v, onChange: (x) => { window.calls.push('one:' + x); setV(x); } }); };
      const Range = () => { const [v, setV] = React.useState(null); return h(Plenix.DatePicker, { 'aria-label': 'Range', mode: 'range', locale: 'en-US', value: v, onChange: (x) => { window.calls.push('range:' + (x && x.start) + '>' + (x && x.end)); setV(x); } }); };
      const Dt = () => { const [v, setV] = React.useState('2026-03-10T09:00'); return h(Plenix.DatePicker, { 'aria-label': 'Moment', mode: 'date-time', locale: 'en-US', value: v, onChange: (x) => { window.calls.push('dt:' + x); setV(x); } }); };
      ReactDOM.createRoot(document.getElementById('a')).render(h(Single)); ReactDOM.createRoot(document.getElementById('b')).render(h(Range)); ReactDOM.createRoot(document.getElementById('c')).render(h(Dt));
    });
    await sleep(700);
    await page.type('#a input[type=text]', '03/15/2026'); await page.keyboard.press('Tab'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['one:2026-03-15'], 'typed text is read on blur');
    await page.click('#a input[type=text]', { clickCount: 3 }); await page.keyboard.type('99/99/2026'); await page.keyboard.press('Tab'); await sleep(200);
    assert.equal(await page.$eval('#a .plx-date-picker__date', (e) => e.getAttribute('aria-invalid')), 'true', 'a text that is no date marks the field invalid');
    await page.click('#a .plx-date-picker__button'); await sleep(400);
    assert.ok(await page.$('[data-plx-date="2026-03-20"]'), 'the calendar opens');
    await page.click('[data-plx-date="2026-03-20"]'); await sleep(300);
    assert.equal((await page.evaluate(() => window.calls)).pop(), 'one:2026-03-20', 'a click on a day chooses it');
    assert.equal(await page.$eval('#a input[type=text]', (e) => e.value), '03/20/2026');
    await page.type('#b input[type=text]', '03/01/2026 - 03/05/2026'); await page.keyboard.press('Enter'); await sleep(250);
    assert.ok((await page.evaluate(() => window.calls)).includes('range:2026-03-01>2026-03-05'), 'a typed range gives start and end');
    await page.evaluate(() => { const i = document.querySelector('#c input[type=time]'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, '14:30'); i.dispatchEvent(new Event('input', { bubbles: true })); }); await sleep(250);
    assert.ok((await page.evaluate(() => window.calls)).includes('dt:2026-03-10T14:30'), 'a date-time keeps the date and takes the time');
    assert.equal(await page.evaluate(() => Plenix.DatePicker.formatHint('en-US')), 'MM/DD/YYYY');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-n: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
