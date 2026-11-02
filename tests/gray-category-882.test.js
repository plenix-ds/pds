/* Plenix tests · the gray category is named "gray"; "grey" still works, Deprecated (issue 882, item 14).
   Written before the change: the category was "grey" and there was no "gray" category.
   Summary (the browser, 800 x 600):
     CATEGORY_COLORS ends with "gray" and holds no "grey"
     a Tag with category="gray" and one with category="grey" draw the same soft background, border and text color, and
       the same as the --plx-sys-category-gray-soft, -soft-border and -on-soft tokens
     a DataPill writes exactly the tone given (gray, grey), and with no tone still writes the Deprecated default "grey"
       this release (CTM's stylesheet selects it); both draw the same
     the --plx-sys-category-grey* tokens resolve to the gray ones
     no script errors
   Usage: node tests/gray-category-882.test.js   → GRAY_CATEGORY_882_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9692, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 800, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const r = await page.evaluate(async () => {
      const h = React.createElement, P = window.Plenix;
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
        h(P.Tag, { category: 'gray', id: 'gray' }, 'Archive'), h(P.Tag, { category: 'grey', id: 'grey' }, 'Archive'),
        h(P.DataPill, { id: 'pill' }, 'Draft'), h(P.DataPill, { id: 'pill-gray', tone: 'gray' }, 'Draft'), h(P.DataPill, { id: 'pill-grey', tone: 'grey' }, 'Draft'),
        h('span', { id: 'probe' })));
      await new Promise((res) => setTimeout(res, 400));
      const look = (id) => { const cs = getComputedStyle(document.getElementById(id)); return [cs.backgroundColor, cs.borderTopColor, cs.color]; };
      // a token's color as the browser computes it
      const token = (name) => { const p = document.getElementById('probe'); p.style.color = 'var(' + name + ')'; const c = getComputedStyle(p).color; p.style.color = ''; return c; };
      const names = ['', '-on', '-soft', '-soft-border', '-on-soft'];
      return {
        colors: P.CATEGORY_COLORS, gray: look('gray'), grey: look('grey'),
        tokens: [token('--plx-sys-category-gray-soft'), token('--plx-sys-category-gray-soft-border'), token('--plx-sys-category-gray-on-soft')],
        aliases: names.map((n) => [token('--plx-sys-category-grey' + n), token('--plx-sys-category-gray' + n)]),
        pill: document.getElementById('pill').getAttribute('data-plx-category'), pills: ['pill-gray', 'pill-grey'].map((id) => document.getElementById(id).getAttribute('data-plx-category')),
        pillLook: [look('pill'), look('pill-gray'), look('pill-grey')],
      };
    });
    assert.equal(r.colors[r.colors.length - 1], 'gray', 'CATEGORY_COLORS ends with gray');
    assert.ok(!r.colors.includes('grey'), 'CATEGORY_COLORS holds no grey');
    assert.deepEqual(r.gray, r.tokens, 'a gray Tag draws the gray category pill tokens');
    assert.deepEqual(r.grey, r.gray, 'a grey Tag (Deprecated) draws the same as a gray one');
    assert.equal(r.pill, 'grey', 'a DataPill with no tone still writes the Deprecated default grey this release (CTM selects it)');
    assert.deepEqual(r.pills, ['gray', 'grey'], 'a DataPill writes exactly the tone given');
    assert.deepEqual(r.pillLook[1], r.pillLook[0], 'a gray DataPill draws the same as the default');
    assert.deepEqual(r.pillLook[2], r.pillLook[0], 'a grey DataPill draws the same as the default');
    for (const [grey, gray] of r.aliases) assert.equal(grey, gray, 'each --plx-sys-category-grey* token resolves to its gray one');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('GRAY_CATEGORY_882_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
