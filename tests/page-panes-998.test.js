// Plenix tests · #998 (ADR 0040): PagePanes renders exactly <div class="plx-page-panes">, and no template or doc writes the class by hand.
//   node tests/page-panes-998.test.js   → PAGE_PANES_998_OK
const assert = require('assert/strict');
const fs = require('fs'), path = require('path');
const { serve, launch } = require('./lib.js');
require('./limit.js');
const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
// AC-3: the templates and the SecondaryPane usage example use PagePanes, not the raw class
for (const f of ['platform/templates/templates/Templates.tsx', 'platform/patterns/SecondaryPane/SecondaryPane.tsx'])
  assert.ok(!/className="plx-page-panes"/.test(read(f)), f + ' writes plx-page-panes by hand');
assert.ok(/export \{[^}]*\bPagePanes\b[^}]*\}/.test(read('platform/index.ts')), 'PagePanes is exported from platform/index.ts');
(async () => {
  const PORT = +process.env.TEST_PORT || 9998;
  await serve(PORT); const browser = await launch();
  try {
    const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const r = await page.evaluate(() => new Promise((resolve) => {
      const P = window.Plenix; if (!P.PagePanes) return resolve({ missing: true });
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div>';
      const kids = () => [React.createElement(P.SecondaryPane, { key: 'p', title: 'Files' }, 'x'), React.createElement('p', { key: 'c' }, 'content')];
      ReactDOM.createRoot(document.getElementById('a')).render(React.createElement('div', { className: 'plx-page-panes' }, kids()));
      ReactDOM.createRoot(document.getElementById('b')).render(React.createElement(P.PagePanes, { 'data-x': '1', className: 'mine' }, kids()));
      setTimeout(() => resolve({ raw: document.getElementById('a').firstElementChild.outerHTML.replace(/ id="[^"]*"/g, '').replace(/ aria-[a-z]+="[^"]*"/g, ''), mine: document.getElementById('b').firstElementChild.outerHTML.replace(/ id="[^"]*"/g, '').replace(/ aria-[a-z]+="[^"]*"/g, ''), cls: document.getElementById('b').firstElementChild.className }), 800);
    }));
    assert.ok(!r.missing, 'Plenix.PagePanes exists');
    assert.equal(r.cls, 'plx-page-panes mine');
    assert.equal(r.mine.replace(' class="plx-page-panes mine" data-x="1"', ' class="plx-page-panes"').replace(' data-x="1" class="plx-page-panes mine"', ' class="plx-page-panes"'), r.raw, 'same DOM as the raw div');
    console.log('PAGE_PANES_998_OK');
  } finally { await Promise.race([browser.close(), new Promise((x) => setTimeout(x, 5000))]); process.exit(process.exitCode || 0); }
})().catch((e) => { console.error(e); process.exit(1); });
