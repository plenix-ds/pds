/* Plenix tests · MediaViewer count + getItem (issue 142, ADR 0020): only the shown item and its neighbours are built.
   Usage: node tests/media-viewer-get-item-142.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9642, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [], warns = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if ((m.type() === 'warning' || m.type() === 'warn') && /MediaViewer/.test(m.text())) warns.push(m.text()); else if (/error|warn/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => {
      document.querySelector('main').innerHTML = '<div id="m"></div>';
      window.calls = [];
      window.getItem = (i) => { window.calls.push(i); return { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'Pic ' + i, title: 'Item ' + i }; };
      window.root = ReactDOM.createRoot(document.getElementById('m'));
      window.show = (props) => window.root.render(React.createElement(Plenix.MediaViewer, Object.assign({ open: true, onClose() {} }, props)));
      window.show({ count: 1500, getItem: window.getItem });
    });
    await page.waitForSelector('.plx-media-viewer');
    const settle = () => page.evaluate(() => new Promise((r) => setTimeout(r, 50)));
    const title = () => settle().then(() => page.evaluate(() => document.querySelector('.plx-media-viewer__title').textContent));
    const counter = () => settle().then(() => page.evaluate(() => document.querySelector('.plx-media-viewer__counter').textContent));
    const calls = () => settle().then(() => page.evaluate(() => [...new Set(window.calls)].sort((a, b) => a - b).concat(['n=' + window.calls.length])));
    assert.equal(await title(), 'Item 0'); assert.equal(await counter(), '1 of 1500');
    assert.deepEqual(await calls(), [0, 1, 1499, 'n=3'], 'shown, next and previous (wrapped) built once each');
    await page.keyboard.press('ArrowRight');
    assert.equal(await title(), 'Item 1');
    assert.deepEqual(await calls(), [0, 1, 2, 1499, 'n=4'], 'moving builds only the new neighbour; results are kept');
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft');
    assert.equal(await title(), 'Item 1499'); assert.equal(await counter(), '1500 of 1500', 'wrap-around uses count');
    assert.ok((await calls()).length <= 8, 'never all 1500');
    await page.keyboard.press('ArrowRight'); assert.equal(await title(), 'Item 0');
    // partial pair: ignored, items used, one warning
    await page.evaluate(() => window.show({ count: 5, items: [{ src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', title: 'From items' }] }));
    assert.equal(await title(), 'From items'); assert.equal(await counter(), '1 of 1');
    await page.evaluate(() => window.show({ count: 5, items: [{ src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', title: 'From items' }] }));
    assert.equal(warns.length, 1, 'one dev warning for a partial pair: ' + warns.join('|'));
    // both pairs: count/getItem win, one more warning
    await page.evaluate(() => window.show({ count: 3, getItem: window.getItem, items: [{ src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', title: 'From items' }] }));
    assert.equal(await counter(), '1 of 3'); assert.equal(warns.length, 2, 'one warning when both are given');
    // plain items still work
    await page.evaluate(() => window.show({ items: [{ src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', title: 'A' }, { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', title: 'B' }] }));
    assert.equal(await counter(), '1 of 2'); assert.equal(warns.length, 2);
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no script errors');
    console.log('media-viewer-get-item-142: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
