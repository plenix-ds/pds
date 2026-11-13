/* Plenix tests · two narrow-width findings of the reflow job (issue 880): a DataToolbar whose end group holds a summary ran past
   its row (the test site's Directory, 390px at 320), and the bottom navigation bar's fifth item was pushed out of a 310px bar
   (the Document page's "Browse"). Written before the fix: the toolbar's end group did not shrink and the bar's items kept 64px.
   Updated for issue 1331: change 373 (issues 11, 13, 5 Nov) later made a narrow row wrap, so the end group moves under the start
   group and its summary shows whole; it no longer ends in an ellipsis. The rule that still holds is that nothing runs past the row.
   Summary (the browser, 320 x 640, left to right and right to left):
     a DataToolbar with two Chips at the start and a Text truncate summary at the end stays within its 320px row; the summary
       wraps under the start group and shows whole (it is not cut)
     a bottom bar of five items in a 310px box: every item inside the box, each at least the 44px touch target
     no script errors
   Usage: node tests/narrow-fit-880.test.js   → NARROW_FIT_880_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9689, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 320, height: 640 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });

    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      const r = await page.evaluate(async (dir) => {
        const h = React.createElement, P = window.Plenix;
        document.documentElement.setAttribute('dir', dir);
        window.__root && window.__root.unmount();
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const sheet = document.getElementById('t880') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't880' });
        sheet.textContent = '#tb{inline-size:320px;} #bar{inline-size:310px;}';
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { dir },
          h('div', { id: 'tb' }, h(P.DataToolbar, { label: 'Directory view',
            start: h(P.TagList, { label: 'Show' }, h(P.Chip, { selected: false }, 'Servants only'), h(P.Chip, { selected: true }, 'Phone numbers')),
            end: h(P.Text, { variant: 'secondary', truncate: true }, '120 households · 342 people') })),
          // the bottom bar's own markup (NavPane draws it at the Narrow window class): five destinations
          h('nav', { id: 'bar', className: 'plx-nav-bar', 'aria-label': 'Destinations' },
            ['Parish', 'People', 'Serving', 'Worship', 'Browse'].map((n) => h('button', { key: n, type: 'button', className: 'plx-nav-bar__item' }, h('span', { className: 'plx-nav-bar__label' }, n))))));
        await new Promise((res) => setTimeout(res, 500));
        const tb = document.querySelector('#tb'), box = tb.getBoundingClientRect(), toolbar = tb.querySelector('.plx-data-toolbar');
        const past = [...toolbar.querySelectorAll('*')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > box.right + 1 || b.left < box.left - 1); }).map((e) => e.className);
        const text = tb.querySelector('.plx-text--truncate');
        const bar = document.querySelector('#bar'), bb = bar.getBoundingClientRect();
        const items = [...bar.querySelectorAll('.plx-nav-bar__item')].map((e) => { const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, w: b.width }; });
        const start = tb.querySelector('.plx-data-toolbar__group:not(.plx-data-toolbar__group--end)').getBoundingClientRect();
        return { past, cut: text.scrollWidth > text.clientWidth, below: text.getBoundingClientRect().top >= start.bottom - 1,
          inside: items.every((i) => i.l >= bb.left - 1 && i.r <= bb.right + 1), narrowest: Math.min(...items.map((i) => i.w)),
          target: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-control-target-min')) * (getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-control-target-min').includes('rem') ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1) };
      }, dir);
      assert.deepEqual(r.past, [], d + 'nothing in the DataToolbar runs past its 320px row; got ' + r.past.join(', '));
      assert.ok(!r.cut, d + 'the summary at the end shows whole (it is not cut)');
      assert.ok(r.below, d + 'the summary at the end wraps under the start group in a narrow row');
      assert.ok(r.inside, d + 'all five items of the bottom bar are inside its 310px box (Browse is not pushed out)');
      assert.ok(r.narrowest >= r.target - 0.5, d + 'each item is at least the touch target (' + r.target + 'px); the narrowest is ' + r.narrowest);
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('NARROW_FIT_880_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
