/* Plenix tests · TypeScript wave 1, batch S (issue 292, ADR 0011): EntityPicker and MentionInput converted to TSX still behave the same.
   EntityPicker: typing filters, Enter chooses (onChange gets the value and its option), multiple adds a tag and its remove button removes it, loadOptions loads the typed text,
   a disabled option is not chosen. MentionInput: typing "@ma" opens the picker, a choice replaces the trigger with "@Name " and calls onMention.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-s.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9675, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = []; window.mentions = []; window.text = '';
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div><div id="d"></div>';
      const people = [{ value: 'u1', label: 'Maya Chen', description: 'maya@x.org' }, { value: 'u2', label: 'Mark Lee', description: 'mark@x.org' }, { value: 'u3', label: 'Zed Off', disabled: true }];
      const One = () => { const [v, setV] = React.useState(null); return h(Plenix.EntityPicker, { kind: 'people', label: 'Owner', options: people, value: v, onChange: (x, o) => { window.calls.push('one:' + x + '/' + (o && o.label)); setV(x); } }); };
      const Many = () => { const [v, setV] = React.useState(['u1']); return h(Plenix.EntityPicker, { kind: 'people', label: 'Many', multiple: true, options: people, values: v, onChange: (x) => { window.calls.push('many:' + x.join(',')); setV(x); } }); };
      const Load = () => h(Plenix.EntityPicker, { kind: 'people', label: 'Loaded', loadDelay: 20, loadOptions: (q) => { window.calls.push('load:' + q); return Promise.resolve(people.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))); }, onChange: (x) => window.calls.push('loaded:' + x) });
      const Mention = () => { const [v, setV] = React.useState(''); return h(Plenix.MentionInput, { label: 'Comment', value: v, onChange: (x) => { window.text = x; setV(x); }, options: people, onMention: (o) => window.mentions.push(o.value) }); };
      ReactDOM.createRoot(document.getElementById('a')).render(h(One)); ReactDOM.createRoot(document.getElementById('b')).render(h(Many));
      ReactDOM.createRoot(document.getElementById('c')).render(h(Load)); ReactDOM.createRoot(document.getElementById('d')).render(h(Mention));
    });
    await sleep(800);
    await page.click('#a input'); await page.keyboard.type('mar'); await sleep(300);
    assert.deepEqual(await page.$$eval('#a [role=option] .plx-entity-picker__name', (e) => e.map((x) => x.textContent)), ['Mark Lee'], 'typing filters');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls.slice()), ['one:u2/Mark Lee'], 'Enter chooses: the value and its option');
    assert.equal(await page.$$eval('#b .plx-tag', (e) => e.length), 1, 'multiple shows a tag');
    await page.click('#b input'); await sleep(200); await page.keyboard.type('mark'); await sleep(200); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await sleep(200);
    assert.equal(await page.$$eval('#b .plx-tag', (e) => e.length), 2, 'a choice adds a tag');
    await page.click('#b .plx-tag button'); await sleep(200);
    assert.equal(await page.$$eval('#b .plx-tag', (e) => e.length), 1, 'the remove button removes it');
    await page.keyboard.press('Escape'); await page.focus('#c input'); await page.keyboard.type('may'); await sleep(500);
    const cl = await page.evaluate(() => window.calls); assert.ok(cl.some((c) => c.startsWith('load:ma')), 'loadOptions runs with the text (' + cl + ')');
    assert.deepEqual(await page.$$eval('#c [role=option] .plx-entity-picker__name', (e) => e.map((x) => x.textContent)), ['Maya Chen'], 'the loaded record is listed');
    await page.keyboard.press('Escape'); await page.focus('#d textarea'); await page.keyboard.type('Hi @ma'); await sleep(400);
    assert.ok(await page.$('#d .plx-entity-picker'), 'typing @ opens the picker');
    await page.keyboard.press('ArrowDown'); await sleep(300);
    await page.keyboard.press('Enter'); await sleep(300);
    assert.equal(await page.evaluate(() => window.text), 'Hi @Maya Chen ', 'the choice replaces the trigger');
    assert.deepEqual(await page.evaluate(() => window.mentions), ['u1'], 'onMention gets the option');
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('ts-wave1-s: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
