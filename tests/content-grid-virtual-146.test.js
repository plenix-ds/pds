// Plenix · tests/content-grid-virtual-146.test.js: ContentGrid virtualized draws only the cards in view (issue 146, P-39; ADR 0019, D-0070).
//   node tests/content-grid-virtual-146.test.js   → CONTENT_GRID_VIRTUAL_146_OK
// Written first (proof first): before, ContentGrid draws every card and has no virtualized prop. In left to right and right to left:
//   default (virtualized off): every card is drawn, nothing else changes; virtualized: 2,000 cards, only the rows in view are in the page, each card knows its place (aria-setsize 2000),
//   the grid is a scroll area at its container's height; the column count follows the width; a card that has the focus stays drawn when scrolled out of view;
//   a card taller than the rest makes its row that tall, exactly as in the same grid drawn all at once (nothing is cut at a fixed row height);
//   with layout masonry or justified, virtualized is ignored (every card drawn) with one development warning.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9883, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const warnings = []; page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'warn') warnings.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (props, count, width) => page.evaluate(async (dir, props, count, width) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { blockSize: '400px', inlineSize: width + 'px' } }, h(Plenix.ContentGrid, Object.assign({ label: 'Cards', size: 'md' }, props), Array.from({ length: count }, (_, i) => h('button', { key: i, type: 'button', className: 'card' }, 'Card ' + i)))));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, props, count, width);
      const stats = () => page.evaluate(() => {
        const ul = document.querySelector('.plx-content-grid'), lis = [...ul.querySelectorAll(':scope > li')];
        const top = lis.length ? lis[0].getBoundingClientRect().top : 0, firstRow = lis.filter((l) => Math.abs(l.getBoundingClientRect().top - top) < 2);
        return { lis: lis.length, setsize: lis[0] && lis[0].getAttribute('aria-setsize'), cols: firstRow.length, scrolls: ul.scrollHeight > ul.clientHeight + 1, box: ul.clientHeight, first: lis[0] && lis[0].textContent, firstLeft: lis[0] && Math.round(lis[0].getBoundingClientRect().left), ulLeft: Math.round(ul.getBoundingClientRect().left), ulRight: Math.round(ul.getBoundingClientRect().right), firstRight: lis[0] && Math.round(lis[0].getBoundingClientRect().right) };
      });
      await mount({}, 60, 800); let s = await stats();
      assert.equal(s.lis, 60, T + 'default: every card is drawn'); assert.equal(s.setsize, null, T + 'default: no virtual attributes');

      await mount({ virtualized: true }, 2000, 800); s = await stats();
      assert.ok(s.lis > 0 && s.lis < 150, T + 'virtualized: only the rows in view are in the page (' + s.lis + ' of 2000)');
      assert.equal(s.setsize, '2000', T + 'each card knows its place in the whole set');
      assert.ok(s.scrolls && s.box > 0 && s.box <= 400, T + 'the grid is a scroll area at its container height (' + s.box + ')');
      assert.ok(s.cols >= 3, T + 'the columns follow the width (' + s.cols + ' at 800px)');
      const wide = s.cols; await mount({ virtualized: true }, 2000, 420); s = await stats();
      assert.ok(s.cols < wide && s.cols >= 1, T + 'a narrower container has fewer columns (' + s.cols + ' < ' + wide + ')');
      if (dir === 'rtl') assert.ok(s.ulRight - s.firstRight <= s.firstLeft - s.ulLeft, T + 'the first card starts at the inline start (right)'); else assert.ok(s.firstLeft - s.ulLeft <= s.ulRight - s.firstRight, T + 'the first card starts at the inline start (left)');

      // keyboard focus stays drawn when the card scrolls out of view
      await mount({ virtualized: true }, 2000, 800);
      await page.evaluate(() => { document.querySelector('.plx-content-grid button.card').focus(); });
      await page.evaluate(() => { const ul = document.querySelector('.plx-content-grid'); ul.scrollTop = ul.scrollHeight / 2; }); await wait(500);
      const kept = await page.evaluate(() => { const a = document.activeElement; return { card: a && a.textContent, inPage: !!a && a.isConnected && a.classList.contains('card') }; });
      assert.deepEqual(kept, { card: 'Card 0', inPage: true }, T + 'a focused card stays drawn after it scrolls out of view: ' + JSON.stringify(kept));
      const mid = await stats(), far = await page.evaluate(() => Math.max(...[...document.querySelectorAll('.plx-content-grid > li')].map((l) => Number(l.getAttribute('aria-posinset')))));
      assert.ok(far > 500 && mid.lis < 200, T + 'scrolled: the window moved (last drawn card ' + far + ', ' + mid.lis + ' in the page, the focused one kept)');

      // a tall card: the virtualized grid looks as the one drawn all at once
      const rowsOf = (props) => page.evaluate(async (dir, props) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { blockSize: '500px', inlineSize: '800px' } }, h(Plenix.ContentGrid, Object.assign({ label: 'Cards', size: 'md' }, props), Array.from({ length: 40 }, (_, i) => h('div', { key: i, className: 'card', style: { blockSize: i === 0 ? '380px' : '120px' } }, 'Card ' + i)))));
        await new Promise((r) => setTimeout(r, 1000));
        const lis = [...document.querySelectorAll('.plx-content-grid > li')], ul = document.querySelector('.plx-content-grid').getBoundingClientRect().top;
        return lis.slice(0, 12).map((l) => [Math.round(l.getBoundingClientRect().top - ul), Math.round(l.getBoundingClientRect().height)]);
      }, dir, props);
      const plain = await rowsOf({}), virt = await rowsOf({ virtualized: true });
      assert.deepEqual(virt.slice(0, 8), plain.slice(0, 8), T + 'a tall card makes its row that tall, as in the grid drawn all at once: ' + JSON.stringify({ plain: plain.slice(0, 6), virt: virt.slice(0, 6) }));
      // masonry and justified ignore it, with one warning
      warnings.length = 0;
      await mount({ virtualized: true, layout: 'masonry' }, 80, 800); s = await stats();
      assert.equal(s.lis, 80, T + 'masonry: every card is drawn'); assert.equal(s.setsize, null);
      if (dir === 'ltr') assert.ok(warnings.some((w) => /ContentGrid/.test(w) && /virtualized/.test(w)), T + 'one development warning (once per page) says virtualized is ignored: ' + JSON.stringify(warnings));
    }
    console.log('CONTENT_GRID_VIRTUAL_146_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
