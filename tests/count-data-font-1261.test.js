/* Plenix tests · #1261 (audit item 6 of #1232, D-0164): a Count is a number, so it draws in the data font (Reddit Mono) in every variant.
   Summary: Count as a pill in every tone and as plain text, light and dark, LTR and RTL: the number computes to Reddit Mono, and a long count ("1,284", "99+") still fits its pill on one line.
   Checks: AC-1 the pill and plain Count are in the data font; AC-2 the number does not wrap or cut; AC-3 a Count in a NavList item (the usual place) is in the data font too.
   Proof first: before the change a Count takes the text font of the place it sits in (DM Sans).
   Usage: node tests/count-data-font-1261.test.js   → COUNT_DATA_FONT_1261_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9823, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 900, height: 600 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode);
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h('div', null,
          ...['neutral', 'info', 'success', 'warning', 'danger'].map((tone) => h(P.Count, { key: tone, variant: 'pill', tone, value: 12 })),
          h(P.Count, { variant: 'pill', tone: 'neutral', value: '1,284' }), h(P.Count, { variant: 'pill', tone: 'neutral', value: '99+' }), h(P.Count, { variant: 'plain', value: 7 }),
          h('div', { style: { inlineSize: 240 } }, h(P.NavList, { label: 'Cases', value: 'a', onSelect() {}, items: [{ id: 'a', label: 'Assigned cases', count: 14 }] }))));
        await new Promise((r) => setTimeout(r, 700));
        const first = (v) => v.split(',')[0].trim().replace(/['"]/g, ''), rs = getComputedStyle(document.documentElement);
        const counts = [...document.querySelectorAll('#c .plx-count')].map((e) => ({ text: e.textContent.trim(), font: first(getComputedStyle(e).fontFamily), oneLine: e.getBoundingClientRect().height < 30 && e.scrollWidth <= e.clientWidth + 1, nav: !!e.closest('.plx-nav-list') }));
        return { data: first(rs.getPropertyValue('--plx-sys-font-data')), counts };
      }, dir, mode);
      assert.ok(got.counts.length >= 8, T + 'the counts are drawn: ' + got.counts.length);
      for (const c of got.counts) { assert.equal(c.font, got.data, T + (c.nav ? 'AC-3: ' : 'AC-1: ') + 'the count "' + c.text + '" is in the data font (' + c.font + ')'); assert.ok(c.oneLine, T + 'AC-2: the count "' + c.text + '" is on one line and not cut'); }
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COUNT_DATA_FONT_1261_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
