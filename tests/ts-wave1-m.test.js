/* Plenix tests · TypeScript wave 1, batch M (issue 292, ADR 0011): Calendar converted to TSX still behaves the same: a click chooses a day
   (onChange gets "YYYY-MM-DD"), the arrow keys move the focus, PageDown shows the next month, a day past max is refused, range mode takes a start
   and an end, week numbers show, and in a right-to-left page ArrowLeft moves to the next day.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-m.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9667, server = await serve(PORT); let browser;
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
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div>';
      ReactDOM.createRoot(document.getElementById('a')).render(h(Plenix.Calendar, { label: 'Pick', defaultMonth: '2026-03', today: '2026-03-10', max: '2026-04-20', weekNumbers: true, onChange: (v) => window.calls.push('one:' + v) }));
      ReactDOM.createRoot(document.getElementById('b')).render(h(Plenix.Calendar, { label: 'Range', mode: 'range', defaultMonth: '2026-03', today: '2026-03-10', onChange: (v) => window.calls.push('range:' + v.start + '>' + v.end) }));
    });
    await sleep(600);
    const day = (root, iso) => root + ' [data-plx-date="' + iso + '"]';
    assert.ok(await page.$('#a .plx-calendar__week-number'), 'week numbers show');
    await page.click(day('#a', '2026-03-15')); await sleep(150);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-plx-date')), '2026-03-15');
    await page.keyboard.press('ArrowRight'); await sleep(100); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-plx-date')), '2026-03-16');
    await page.keyboard.press('ArrowDown'); await sleep(100); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-plx-date')), '2026-03-23');
    await page.keyboard.press('PageDown'); await sleep(200); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-plx-date')), '2026-04-20', 'PageDown clamps to max');
    assert.match(await page.$eval('#a .plx-calendar__title', (e) => e.textContent), /April/);
    await page.click(day('#a', '2026-04-25')).catch(() => {}); await sleep(100);
    await page.click(day('#a', '2026-04-15')); await sleep(100);
    await page.click(day('#b', '2026-03-05')); await sleep(100); await page.click(day('#b', '2026-03-12')); await sleep(100);
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls, ['one:2026-03-15', 'one:2026-04-15', 'range:2026-03-05>null', 'range:2026-03-05>2026-03-12'], 'calls: ' + calls + ' (a day past max is refused)');
    assert.ok(await page.$eval(day('#b', '2026-03-08'), (e) => e.parentElement.classList.contains('is-in-range')), 'the days between are in the range');
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await sleep(200);
    await page.focus(day('#b', '2026-03-12')); await page.keyboard.press('ArrowLeft'); await sleep(150);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('data-plx-date')), '2026-03-13', 'right to left: ArrowLeft is the next day');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-m: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
