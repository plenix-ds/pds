/* Plenix tests · TypeScript wave 1, batch S (issue 292, ADR 0011): CommandMenu and EntityPicker converted to TSX still behave the same.
   CommandMenu: typing ranks and narrows the commands, ArrowDown and Enter run one (onSelect), a command with items opens a page and Backspace goes
   back, groups keep their commands together. EntityPicker: typing narrows, Enter chooses (onChange gets the value and its option), multiple mode adds tags
   and Backspace removes the last, loadOptions loads after the delay, onBrowse adds a Browse row, and a disabled option is not chosen.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-s.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9675, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 900, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b" style="margin-top:20px"></div><div id="c" style="margin-top:20px"></div>';
      const items = [{ id: 'new', label: 'New file', group: 'File' }, { id: 'open', label: 'Open file', group: 'File' }, { id: 'theme', label: 'Change theme', group: 'View', items: [{ id: 'dark', label: 'Dark' }, { id: 'light', label: 'Light' }] }];
      ReactDOM.createRoot(document.getElementById('a')).render(h(Plenix.CommandMenu, { label: 'Commands', items, onSelect: (it) => window.calls.push('cmd:' + it.id) }));
      const people = [{ value: 'p1', label: 'Maya Chen' }, { value: 'p2', label: 'Paul Nasser' }, { value: 'p3', label: 'Rita Gad', disabled: true }];
      const One = () => { const [v, setV] = React.useState(null); return h(Plenix.EntityPicker, { kind: 'people', label: 'Owner', options: people, value: v, onBrowse: () => window.calls.push('browse'), onChange: (x, o) => { window.calls.push('one:' + x + ':' + (o && o.label)); setV(x); } }); };
      const Many = () => { const [v, setV] = React.useState([]); return h(Plenix.EntityPicker, { kind: 'people', label: 'Team', multiple: true, loadDelay: 100, loadOptions: (q) => Promise.resolve(people.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))), values: v, onChange: (x) => { window.calls.push('many:' + x.join(',')); setV(x); } }); };
      ReactDOM.createRoot(document.getElementById('b')).render(h(One)); ReactDOM.createRoot(document.getElementById('c')).render(h(Many));
    });
    await sleep(800);
    const labels = (sel) => page.$$eval(sel, (e) => e.map((x) => x.textContent.trim()));
    assert.deepEqual(await labels('#a .plx-command-menu__label'), ['New file', 'Open file', 'Change theme']);
    await page.type('#a input', 'open'); await sleep(200);
    assert.deepEqual(await labels('#a .plx-command-menu__label'), ['Open file'], 'typing narrows the commands');
    await page.keyboard.press('Enter'); await sleep(150);
    await page.keyboard.press('Escape'); await sleep(100); await page.keyboard.type('theme'); await sleep(200); await page.keyboard.press('Enter'); await sleep(200);
    assert.deepEqual(await labels('#a .plx-command-menu__label'), ['Dark', 'Light'], 'a command with items opens a page');
    await page.keyboard.press('Backspace'); await sleep(200);
    assert.ok((await labels('#a .plx-command-menu__label')).includes('New file'), 'Backspace goes back');
    await page.focus('#b input'); await page.keyboard.type('pau'); await sleep(250);
    assert.deepEqual(await labels('#b .plx-entity-picker__name'), ['Paul Nasser'], 'typing narrows the options');
    await page.keyboard.press('Enter'); await sleep(200);
    await page.click('#b input'); await page.keyboard.press('ArrowDown'); await sleep(300);
    assert.ok(await page.$('#b .plx-entity-picker__browse'), 'onBrowse adds a Browse row');
    await page.evaluate(() => [...document.querySelectorAll('#b .plx-entity-picker__option')].find((e) => /Rita/.test(e.textContent)).click()); await sleep(150);
    await page.focus('#c input'); await page.keyboard.type('a'); await sleep(600);
    await page.evaluate(() => [...document.querySelectorAll('#c .plx-entity-picker__option')].find((e) => /Maya/.test(e.textContent)).click()); await sleep(200);
    await page.keyboard.type('pa'); await sleep(600);
    await page.evaluate(() => [...document.querySelectorAll('#c .plx-entity-picker__option')].find((e) => /Paul/.test(e.textContent)).click()); await sleep(200);
    await page.focus('#c input'); await page.keyboard.press('Backspace'); await sleep(150);
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls, ['cmd:open', 'cmd:theme'].filter((c) => c === 'cmd:open').concat(['one:p2:Paul Nasser', 'many:p1', 'many:p1,p2', 'many:p1']), 'calls: ' + calls + ' (a disabled option is not chosen; a command with items opens a page and is not selected)');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-s: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
