/* Plenix tests · text roles, batch B (issue 122): Popover and SessionTimeout's time draw the same text before and after they take their whole text
   role, and both leave the text-role backlog. The probe reads the computed text (family, size, weight, letter spacing, line height, word spacing) of an open
   popover (opened from a bold, wide-spaced container to catch what it used to inherit), and of the warning's countdown and the signed-out time, in left to
   right and right to left, and compares it with the values measured on main before the change (tests/fixtures/text-contract-122-b.base.json).
   Usage: node tests/text-contract-122-b.test.js [--print] (--print writes the measured values) */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE_FILE = path.join(__dirname, 'fixtures', 'text-contract-122-b.base.json');
const PARTS = ['plx-popover', 'plx-session-timeout__time'];
(async () => {
  const backlog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'check-system.text-contract.json'), 'utf8')).parts;
  const PORT = +process.env.TEST_PORT || 9850, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 600 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const measured = {};
    for (const dir of ['ltr', 'rtl']) for (const ctx of ['plain', 'bold']) {
      measured[dir + ' ' + ctx] = await page.evaluate(async (dir, ctx) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root && window.__root.unmount(); window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.LocaleProvider ? React.Fragment : React.Fragment, null, h('div', { style: ctx === 'bold' ? { width: 700, fontWeight: 700, letterSpacing: '2px', fontSize: '20px' } : { width: 700 } },
          h(Plenix.Popover, { defaultOpen: true, title: 'Heading', label: 'More', trigger: h(Plenix.Button, null, 'Open') }, h('p', null, 'Body text')),
          h(Plenix.SessionTimeout, { state: 'warning', inline: true, remaining: 95 }),
          h(Plenix.SessionTimeout, { state: 'signed-out', inline: true, idleMinutes: 30 }))));
        await new Promise((r) => setTimeout(r, 800));
        const read = (el) => { if (!el) return null; const s = getComputedStyle(el); return { family: s.fontFamily.split(',')[0].replace(/['"]/g, ''), size: s.fontSize, weight: s.fontWeight, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight, wordSpacing: s.wordSpacing }; };
        return { popover: read(document.querySelector('.plx-popover')), popoverBody: read(document.querySelector('.plx-popover p')), time: read(document.querySelector('.plx-session-timeout__time')), inlineTime: read(document.querySelector('.plx-session-timeout__inline-time')) };
      }, dir, ctx);
    }
    if (process.argv.includes('--print')) { fs.mkdirSync(path.dirname(BASE_FILE), { recursive: true }); fs.writeFileSync(BASE_FILE, JSON.stringify(measured, null, 1) + '\n'); console.log('written', BASE_FILE); }
    else {
      const base = JSON.parse(fs.readFileSync(BASE_FILE, 'utf8'));
      for (const dir of ['ltr', 'rtl']) {
        assert.deepEqual(measured[dir + ' plain'], base[dir + ' plain'], dir + ': in ordinary text the parts compute what they did');
        // inside bold, letter-spaced text they used to inherit it; now each part has its own whole role (body weight and spacing): the one visible change
        const want = JSON.parse(JSON.stringify(base[dir + ' bold']));
        for (const k of ['popover', 'popoverBody']) { want[k].weight = '400'; want[k].letterSpacing = 'normal'; }
        want.time.letterSpacing = 'normal';
        want.inlineTime.weight = '400'; want.inlineTime.letterSpacing = 'normal';
        assert.deepEqual(measured[dir + ' bold'], want, dir + ': inside bold, letter-spaced text the parts no longer inherit the weight and spacing');
      }
    }
    for (const part of PARTS) assert.equal(backlog[part], undefined, part + ' is off the text-role backlog');
    const now = require('../check-system.rules/text-contract.js').measure();
    for (const part of PARTS) assert.equal(now.incomplete[part], undefined, part + ' has a whole text contract: ' + now.incomplete[part]);
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('text-contract-122-b: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
