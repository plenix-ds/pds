/* Plenix tests · #1055 (brief #987 AC-3): an item without dateTime in Timeline variant="grouped" keeps its full width.
   Summary: an upcoming item with no dateTime shows its tile reading Pending, in a container as wide as the others (it was 34px, the title wrapping a letter per line), with the dashed outline,
     whether it is first (its group has no year, so no watermark) or in the middle (it joins the previous group, with that group's watermark); a past item with no date warns in development, joins the
     previous group and shows the band only. Left to right and right to left.
   Proof first: before the fix an undated first item's event is a few dozen pixels wide.
   Usage: node tests/timeline-grouped-undated-1055.test.js   → TIMELINE_GROUPED_UNDATED_1055_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9833, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 700 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (/warn/.test(m.type())) warns.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const mount = (items) => page.evaluate(async (dir, items) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.style.inlineSize = '900px'; c.id = 'c'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h(P.Timeline, { variant: 'grouped', label: 'Case', items })); await new Promise((r) => setTimeout(r, 700));
      }, dir, items);
      const read = () => page.evaluate(() => [...document.querySelectorAll('#c .plx-timeline__event')].map((e) => ({ w: Math.round(e.getBoundingClientRect().width), title: e.querySelector('.plx-timeline__event-title').textContent, h: Math.round(e.getBoundingClientRect().height),
        pending: /Pending/.test(e.querySelector('.plx-timeline__date').textContent), upcoming: e.classList.contains('plx-timeline__event--upcoming'), dashed: getComputedStyle(e).borderTopStyle === 'dashed', dateText: e.querySelector('.plx-timeline__date').textContent.trim() })));
      // first: its own group, no year, no watermark
      await mount([{ id: 1, title: "Awaiting the president's approval", upcoming: true }, { id: 2, title: 'Filed', dateTime: '2026-03-02' }]);
      let ev = await read();
      assert.ok(ev[0].w >= ev[1].w - 60, T + 'an undated first event is as wide as the others (' + ev[0].w + ' vs ' + ev[1].w + ')'); assert.ok(ev[0].h < 120, T + 'and its title does not wrap a letter per line (' + ev[0].h + 'px)');
      assert.equal(ev[0].pending, true, T + 'its tile reads Pending'); assert.equal(ev[0].dashed, true, T + 'with the dashed outline');
      // in the middle: it joins the previous group, with that group's watermark
      await mount([{ id: 2, title: 'Filed', dateTime: '2026-03-02' }, { id: 1, title: 'Awaiting approval', upcoming: true }]);
      ev = await read(); assert.ok(Math.abs(ev[0].w - ev[1].w) <= 2, T + 'an undated event after a dated one is as wide as it (' + ev[1].w + ' vs ' + ev[0].w + ')'); assert.equal(await page.evaluate(() => document.querySelectorAll('#c section.plx-timeline__group').length), 1, T + 'it joins the previous group');
      // past and undated: a warning, the previous group, the band only
      warns.length = 0; await mount([{ id: 2, title: 'Filed', dateTime: '2026-03-02' }, { id: 3, title: 'Lost date' }]);
      ev = await read(); assert.equal(ev[1].pending, false, T + 'a past undated item is not Pending'); assert.equal(ev[1].dateText, '', T + 'its tile shows the band only'); assert.equal(ev[1].upcoming, false);
      assert.ok(warns.some((w) => /dateTime/.test(w)), T + 'a development warning names the item');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('TIMELINE_GROUPED_UNDATED_1055_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
