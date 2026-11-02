/* Plenix tests · effects that ran after every render now run when their inputs change (issue 882, item 5).
   Written before the change: Carousel added its scroll listener again after every render, and Tabs measured every tab
   after every render.
   Summary (the browser, 1000 x 700, left to right and right to left):
     Carousel: ten re-renders with the same slides add no scroll listener (one at mount); scrolling the strip by hand to the
       third page still reports page 2 (onPageChange) after those re-renders
     Tabs: twenty tabs in a 400px box fold into More; ten re-renders with the same tabs read no tab's position; a count that
       grows on a shown tab (a wider tab) folds one more tab, so every shown tab still ends inside the list
     no script errors
   Usage: node tests/effect-deps-882.test.js   → EFFECT_DEPS_882_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9691, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1000, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const pause = (ms = 300) => new Promise((r) => setTimeout(r, ms));

    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      // Carousel
      const c = await page.evaluate(async (dir) => {
        const h = React.createElement, P = window.Plenix;
        document.documentElement.setAttribute('dir', dir);
        window.__root && window.__root.unmount();
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const sheet = document.getElementById('t882') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't882' });
        sheet.textContent = '#c{inline-size:600px;} .t882-slide{block-size:120px;}';
        // count scroll listeners added to the strip (its class: plx-carousel__track)
        let added = 0; const orig = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, ...rest) { if (type === 'scroll' && this.classList && this.classList.contains('plx-carousel__track')) added++; return orig.call(this, type, ...rest); };
        window.__pages = [];
        const slides = Array.from({ length: 6 }, (_, i) => h('div', { key: i, className: 't882-slide' }, 'Slide ' + (i + 1)));
        const App = ({ tick }) => h(P.Carousel, { label: 'Photos ' + tick, onPageChange: (p) => window.__pages.push(p) }, slides);
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(App, { tick: 0 }));
        await new Promise((r) => setTimeout(r, 400));
        const atMount = added;
        for (let i = 1; i <= 10; i++) { window.__root.render(h(App, { tick: i })); await new Promise((r) => setTimeout(r, 30)); }
        const afterRenders = added;
        const track = document.querySelector('.plx-carousel__track'), slide = track.children[0].getBoundingClientRect().width;
        track.scrollLeft = (dir === 'rtl' ? -1 : 1) * slide * 2;
        await new Promise((r) => setTimeout(r, 400));
        EventTarget.prototype.addEventListener = orig;
        return { atMount, afterRenders, pages: window.__pages };
      }, dir);
      assert.equal(c.atMount, 1, d + 'the Carousel adds one scroll listener at mount; got ' + c.atMount);
      assert.equal(c.afterRenders, 1, d + 'ten re-renders add no scroll listener; got ' + (c.afterRenders - c.atMount) + ' more');
      assert.equal(c.pages[c.pages.length - 1], 2, d + 'scrolling to the third slide still reports page 2; got ' + JSON.stringify(c.pages));

      // Tabs
      const t = await page.evaluate(async (dir) => {
        const h = React.createElement, P = window.Plenix;
        window.__root && window.__root.unmount();
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        document.getElementById('t882').textContent = '#c{inline-size:400px;}';
        const App = ({ tick, count }) => h(P.Tabs, { label: 'Sections', items: Array.from({ length: 20 }, (_, i) => ({ value: 'v' + i, label: 'Section ' + (i + 1), count: i === 0 ? count : undefined })), onChange() {}, idBase: 'tabs-' + 0 }, null);
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(App, { tick: 0, count: 1 }));
        await new Promise((r) => setTimeout(r, 400));
        const list = () => document.querySelector('[role="tablist"]');
        const shown = () => [...list().querySelectorAll('[role="tab"]')].filter((e) => !e.hidden);
        const inside = () => { const b = list().getBoundingClientRect(); return shown().every((e) => { const r = e.getBoundingClientRect(); return r.right <= b.right + 0.5 && r.left >= b.left - 0.5; }); };
        const before = shown().length;
        // count tab position reads during re-renders with the same tabs
        let reads = 0; const orig = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function () { if (this.getAttribute && this.getAttribute('role') === 'tab') reads++; return orig.call(this); };
        for (let i = 1; i <= 10; i++) { window.__root.render(h(App, { tick: i, count: 1 })); await new Promise((r) => setTimeout(r, 30)); }
        Element.prototype.getBoundingClientRect = orig;
        // a wider shown tab: its count grows
        window.__root.render(h(App, { tick: 11, count: 123456789 }));
        await new Promise((r) => setTimeout(r, 400));
        return { before, reads, after: shown().length, inside: inside() };
      }, dir);
      assert.ok(t.before > 1 && t.before < 20, d + 'twenty tabs in 400px fold into More; shown ' + t.before);
      assert.equal(t.reads, 0, d + 'ten re-renders with the same tabs read no tab position; got ' + t.reads);
      assert.ok(t.inside, d + 'after a count grows, every shown tab ends inside the list');
      assert.ok(t.after <= t.before, d + 'a wider tab never shows more tabs (' + t.before + ' -> ' + t.after + ')');
      await pause(100);
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('EFFECT_DEPS_882_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
