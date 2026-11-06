/* Plenix tests · text roles, batch A (issue 122): InlineEdit's read view and InputGroup's affixes draw the same text before and after their data
   variant became a modifier of the part (plx-inline-edit__read--data, plx-input-group__affix--data), and both leave the text-role backlog.
   The probe reads what the parts compute (family, size, weight, letter spacing, line height, word spacing) in the plain and the data variants, in left to
   right and right to left, and compares it with the values measured on main before the change (BASE). The contract half: neither part is on the backlog
   (check-system.text-contract.json) and the text-contract rule has no finding.
   Usage: node tests/text-contract-122-a.test.js [--print] (--print writes the measured values instead of comparing) */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE_FILE = path.join(__dirname, 'fixtures', 'text-contract-122-a.base.json');
(async () => {
  const backlog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'check-system.text-contract.json'), 'utf8')).parts;
  const PORT = +process.env.TEST_PORT || 9849, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 600 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const measured = {};
    for (const dir of ['ltr', 'rtl']) {
      const got = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root && window.__root.unmount(); window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { width: 600 } },
          h(Plenix.InlineEdit, { label: 'Plain', value: 'Some text', onChange() {} }),
          h(Plenix.InlineEdit, { label: 'Data', value: 'abc-123', data: true, onChange() {} }),
          h(Plenix.InputGroup, { suffix: 'kg', prefix: '#', width: 'sm' }, h(Plenix.Input, { 'aria-label': 'Weight' })),
          h(Plenix.InputGroup, { suffix: 'kg', prefix: '#', width: 'sm', data: true }, h(Plenix.Input, { 'aria-label': 'Weight data', data: true }))));
        await new Promise((r) => setTimeout(r, 600));
        const read = (el) => { const s = getComputedStyle(el); return { family: s.fontFamily.split(',')[0].replace(/['"]/g, ''), size: s.fontSize, weight: s.fontWeight, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight, wordSpacing: s.wordSpacing }; };
        const reads = [...document.querySelectorAll('.plx-inline-edit__read')].map(read);
        const affixes = [...document.querySelectorAll('.plx-input-group__affix')].map(read);
        return { reads, affixes };
      }, dir);
      measured[dir] = got;
    }
    if (process.argv.includes('--print')) { fs.mkdirSync(path.dirname(BASE_FILE), { recursive: true }); fs.writeFileSync(BASE_FILE, JSON.stringify(measured, null, 1) + '\n'); console.log('written', BASE_FILE); }
    else assert.deepEqual(measured, JSON.parse(fs.readFileSync(BASE_FILE, 'utf8')), 'what the parts compute is unchanged');
    for (const part of ['plx-inline-edit__read', 'plx-input-group__affix']) assert.equal(backlog[part], undefined, part + ' is off the text-role backlog');
    const { measure } = require('../check-system.rules/text-contract.js'), now = measure();
    for (const part of ['plx-inline-edit__read', 'plx-input-group__affix']) assert.equal(now.incomplete[part], undefined, part + ' has a whole text contract: ' + now.incomplete[part]);
    assert.deepEqual(problems, [], 'no script errors');
    console.log('text-contract-122-a: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
