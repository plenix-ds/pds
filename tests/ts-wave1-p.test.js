/* Plenix tests · TypeScript wave 1, batch P (issue 292, ADR 0011): TimePicker converted to TSX still behaves the same: typed text ("2pm") is read on blur
   (onChange gets "14:00"), the list opens on click and a click on a time chooses it, ArrowDown and Enter choose from the list, the
   segments variant takes typed digits and ArrowUp, and a read-only picker opens nothing. parseTime is exported.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-p.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9670, server = await serve(PORT); let browser;
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
      const List = () => { const [v, setV] = React.useState(''); return h(Plenix.TimePicker, { label: 'Start', hourCycle: 12, value: v, onChange: (x) => { window.calls.push('list:' + x); setV(x); } }); };
      const Seg = () => { const [v, setV] = React.useState('09:00'); return h(Plenix.TimePicker, { label: 'Seg', variant: 'segments', hourCycle: 24, value: v, onChange: (x) => { window.calls.push('seg:' + x); setV(x); } }); };
      ReactDOM.createRoot(document.getElementById('a')).render(h(List)); ReactDOM.createRoot(document.getElementById('b')).render(h(Seg));
      ReactDOM.createRoot(document.getElementById('c')).render(h(Plenix.TimePicker, { label: 'Locked', hourCycle: 12, value: '10:30', readOnly: true }));
    });
    await sleep(700);
    await page.type('#a input', '2pm'); await page.keyboard.press('Tab'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['list:14:00'], 'typed text is read on blur');
    await page.click('#a input'); await sleep(300);
    assert.ok(await page.$('[role=listbox]'), 'the list opens on click');
    await page.evaluate(() => [...document.querySelectorAll('[role=option]')].find((e) => /^3:00\s*(PM|pm)/i.test(e.textContent.trim())).click()); await sleep(200);
    assert.equal((await page.evaluate(() => window.calls)).pop(), 'list:15:00', 'a click on a time chooses it');
    await page.click('#a input'); await sleep(200); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await sleep(200);
    assert.equal((await page.evaluate(() => window.calls)).pop(), 'list:15:15', 'ArrowDown and Enter choose the next time');
    await page.focus('#b [role=spinbutton]'); await page.keyboard.press('ArrowUp'); await sleep(150);
    assert.equal((await page.evaluate(() => window.calls)).pop(), 'seg:10:00', 'ArrowUp on the hour segment');
    await page.keyboard.press('ArrowRight'); await page.keyboard.type('45'); await sleep(200);
    assert.ok((await page.evaluate(() => window.calls)).includes('seg:10:45'), 'typed digits set the minutes');
    await page.click('#c input'); await sleep(300);
    assert.equal(await page.$$eval('[role=listbox]', (e) => e.length), 0, 'a read-only picker opens nothing');
    assert.equal(await page.evaluate(() => Plenix.parseTime && Plenix.parseTime('230p', '12')), 870);
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-p: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
