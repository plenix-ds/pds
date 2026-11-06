/* Plenix tests · text roles, batch C (issue 122): the brand lockup's name and app name and the image editor's text overlay draw the same text before and
   after they declare their whole text role, and leave the text-role backlog. The probe reads the computed text (family, size, weight, letter spacing, line height,
   word spacing) of the lockups in every size and kind, in left to right and right to left, and of the image editor's text overlay inside the Asset Manager's
   editor page, and compares it with the values measured on main before the change (tests/fixtures/text-contract-122-c.base.json).
   Usage: node tests/text-contract-122-c.test.js [--print] (--print writes the measured values) */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE_FILE = path.join(__dirname, 'fixtures', 'text-contract-122-c.base.json');
const PARTS = ['plx-brand-lockup__name', 'plx-brand-lockup__app', 'plx-image-editor__text', 'plx-image-editor__text--bold'];
(async () => {
  const backlog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'check-system.text-contract.json'), 'utf8')).parts;
  const PORT = +process.env.TEST_PORT || 9851, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const measured = {};
    for (const dir of ['ltr', 'rtl']) {
      measured['brand ' + dir] = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root && window.__root.unmount(); window.__root = ReactDOM.createRoot(document.getElementById('c'));
        const kids = [];
        for (const kind of ['wordmark', 'logo', 'product']) for (const size of ['sm', 'md', 'lg', 'xl']) for (const tone of ['brand', 'mono', 'on-accent']) kids.push(h(Plenix.BrandMark, { key: kind + size + tone, kind, size, tone, app: kind === 'product' ? 'assets' : undefined }));
        window.__root.render(h('div', { style: { width: 800 } }, kids));
        await new Promise((r) => setTimeout(r, 600));
        const read = (el) => { const s = getComputedStyle(el); return [s.fontFamily.split(',')[0].replace(/['"]/g, ''), s.fontSize, s.fontWeight, s.letterSpacing, s.lineHeight, s.wordSpacing].join(' | '); };
        return { names: [...document.querySelectorAll('.plx-brand-lockup__name')].map(read), apps: [...document.querySelectorAll('.plx-brand-lockup__app')].map(read) };
      }, dir);
    }
    // the image editor's text overlay, in the Asset Manager's editor page (the overlay is drawn there; the probe adds one to its frame)
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/dam/image-editor.html', { waitUntil: 'load' });
    await new Promise((r) => setTimeout(r, 2500));
    measured.editor = await page.evaluate(() => {
      const f = document.querySelector('.plx-image-editor__frame'); if (!f) return 'no frame';
      return ['plx-image-editor__text', 'plx-image-editor__text plx-image-editor__text--bold'].map((cls) => { const el = document.createElement('span'); el.className = cls; el.textContent = 'Sample'; f.appendChild(el); const s = getComputedStyle(el); const r = [s.fontFamily.split(',')[0].replace(/['"]/g, ''), s.fontSize, s.fontWeight, s.letterSpacing, s.lineHeight, s.wordSpacing].join(' | '); el.remove(); return r; });
    });
    if (process.argv.includes('--print')) { fs.mkdirSync(path.dirname(BASE_FILE), { recursive: true }); fs.writeFileSync(BASE_FILE, JSON.stringify(measured, null, 1) + '\n'); console.log('written', BASE_FILE); }
    else assert.deepEqual(measured, JSON.parse(fs.readFileSync(BASE_FILE, 'utf8')), 'what the parts compute is unchanged');
    assert.ok(measured['brand ltr'].names.length >= 12 && Array.isArray(measured.editor), 'the probe found the lockups and the editor frame');
    for (const part of PARTS) assert.equal(backlog[part], undefined, part + ' is off the text-role backlog');
    const now = require('../check-system.rules/text-contract.js').measure();
    for (const part of PARTS) assert.equal(now.incomplete[part], undefined, part + ' has a whole text contract: ' + now.incomplete[part]);
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('text-contract-122-c: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
