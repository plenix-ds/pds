/* Plenix tests · TypeScript wave 1, batch F (issue 292, ADR 0011): EventChip, Checklist and ProductOptions converted to TSX still draw and
   behave the same. EventChip: a button with onClick (data-plx-color on it), plain text without; Checklist: a task toggles, onChange gets
   the new ids and the changed id, the progress reads "1 / 2"; ProductOptions: a size tile and a swatch choose, an unavailable swatch does
   nothing, the quantity stepper reports a new count.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-f.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9660, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement, P = Plenix; window.calls = [];
      const App = () => {
        const [done, setDone] = React.useState(['a']);
        const [choice, setChoice] = React.useState({ size: 'M', color: 'navy' });
        const [qty, setQty] = React.useState(2);
        return h('div', null,
          h('div', { id: 'ec1' }, h(P.EventChip, { title: 'Site visit', time: '10:00', color: 'blue', onClick: () => window.calls.push('chip') })),
          h('div', { id: 'ec2' }, h(P.EventChip, { title: 'Plain', time: '11:00' })),
          h('div', { id: 'cl' }, h(P.Checklist, { title: 'Get started', items: [{ id: 'a', label: 'First' }, { id: 'b', label: 'Second' }], completed: done, onChange: (ids, id) => { window.calls.push('cl:' + ids.join(',') + ':' + id); setDone(ids); } })),
          h('div', { id: 'po' }, h(P.ProductOptions, { product: 'Choir robe', value: choice, onChange: (v, name) => { window.calls.push('po:' + name + ':' + v[name]); setChoice(v); },
            options: [{ name: 'size', label: 'Size', kind: 'buttons', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }] },
              { name: 'color', label: 'Color', kind: 'swatches', values: [{ value: 'navy', label: 'Navy', category: 'navy' }, { value: 'maroon', label: 'Maroon', category: 'maroon', available: false }] }],
            quantity: qty, onQuantityChange: (n) => { window.calls.push('qty:' + n); setQty(n); }, max: 10 })));
      };
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      ReactDOM.createRoot(document.getElementById('v')).render(h(App));
    });
    await sleep(800);
    assert.equal(await page.$eval('#ec1 .plx-event-chip', (e) => e.tagName), 'BUTTON'); assert.equal(await page.$eval('#ec1 .plx-event-chip', (e) => e.getAttribute('data-plx-color')), 'blue');
    assert.equal(await page.$eval('#ec2 .plx-event-chip', (e) => e.tagName), 'SPAN', 'without onClick it is plain text');
    await page.click('#ec1 .plx-event-chip'); await sleep(100);
    assert.match(await page.$eval('#cl [role=status]', (e) => e.textContent), /1 \/ 2/, 'progress reads 1 / 2');
    await page.evaluate(() => [...document.querySelectorAll('#cl input[type=checkbox]')][1].click()); await sleep(200);
    assert.match(await page.$eval('#cl [role=status]', (e) => e.textContent), /2 \/ 2/);
    await page.evaluate(() => [...document.querySelectorAll('#po label, #po [role=radio]')].find((e) => /^L\b/.test(e.textContent.trim())).click()); await sleep(200);
    await page.evaluate(() => document.querySelector('#po [aria-label="Navy"]').click()); await sleep(100);
    await page.evaluate(() => document.querySelector('#po [aria-label="Maroon, out of stock"]').click()); await sleep(100);
    await page.evaluate(() => [...document.querySelectorAll('#po button')].find((b) => /increase|plus|\+/i.test(b.getAttribute('aria-label') || b.textContent)).click()); await sleep(200);
    const calls = await page.evaluate(() => window.calls);
    assert.deepEqual(calls.filter((c) => /^chip|^cl:/.test(c)), ['chip', 'cl:a,b:b'], 'the chip click and the checklist change are reported once');
    assert.ok(calls.includes('po:size:L'), 'a size tile chooses: ' + calls);
    assert.ok(!calls.includes('po:color:maroon'), 'an unavailable swatch does nothing');
    assert.ok(calls.includes('qty:3'), 'the quantity stepper reports 3: ' + calls);
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-f: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
