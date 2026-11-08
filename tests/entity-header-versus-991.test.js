/* Plenix tests · #991 (ADR 0037, D-0119, D-0121, D-0122): EntityHeader media={{ versus: [a, b], decorative }}.
   Summary: two Avatars side by side with a "vs." mark between them, in the media box at the single media's height (page top-small 44, top-large 72, section 32);
     the pair is one image named "A versus B" (or hidden with decorative); initials without src, never a person icon; the mark has no box; the first party sits at the
     inline start (the right in RTL); stretched layouts show the pair at the small size; one party or three warn and show one Avatar.
   Proof first: before the change a versus media is not drawn (no avatars, no mark).
   Usage: node tests/entity-header-versus-991.test.js   → ENTITY_HEADER_VERSUS_991_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9810, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 700 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (/warn/.test(m.type())) warns.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const mount = (props) => page.evaluate(async (dir, props) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        document.querySelector('main').textContent = ''; const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').appendChild(c);
        window.__root = ReactDOM.createRoot(c); window.__root.render(h(P.EntityHeader, Object.assign({ title: 'Michael Bennett vs. Charlotte Bennett' }, props))); await new Promise((r) => setTimeout(r, 700));
      }, dir, props);
      const read = () => page.evaluate(() => { const m = document.querySelector('#c .plx-entity-header__media'), r = m.getBoundingClientRect(), mark = m.querySelector('.plx-entity-header__versus-mark'), ps = [...m.querySelectorAll('.plx-entity-header__party')];
        const cs = mark && getComputedStyle(mark);
        return { role: m.getAttribute('role'), label: m.getAttribute('aria-label'), hidden: m.getAttribute('aria-hidden'), h: Math.round(r.height), parties: ps.length, mark: mark && mark.textContent, markBg: cs && cs.backgroundColor, markBw: cs && cs.borderTopWidth,
          texts: ps.map((p) => p.textContent.trim()), xs: ps.map((p) => Math.round(p.getBoundingClientRect().left)), markX: mark && Math.round(mark.getBoundingClientRect().left), icons: m.querySelectorAll('.plx-avatar svg, .plx-icon--person').length,
          pw: ps[0] && Math.round(ps[0].getBoundingClientRect().height) }; });
      const a = { name: 'Michael Bennett' }, b = { name: 'Charlotte Bennett', color: 'purple' };
      await mount({ media: { versus: [a, b] } });
      let s = await read();
      assert.equal(s.parties, 2, T + 'two parties'); assert.equal(s.role, 'img', T + 'one image'); assert.equal(s.label, 'Michael Bennett versus Charlotte Bennett', T + 'named "A versus B"');
      assert.deepEqual(s.texts, ['MB', 'CB'], T + 'initials without a picture'); assert.equal(s.icons, 0, T + 'never a person icon'); assert.equal(s.mark, 'vs.', T + 'the mark');
      assert.equal(s.markBg, 'rgba(0, 0, 0, 0)', T + 'the mark has no fill'); assert.equal(s.markBw, '0px', T + 'and no border');
      assert.ok(dir === 'rtl' ? s.xs[0] > s.xs[1] : s.xs[0] < s.xs[1], T + 'the first party is at the inline start'); assert.ok(s.markX > Math.min(...s.xs) && s.markX < Math.max(...s.xs), T + 'the mark is between them');
      // the height equals the single media's in each layout
      for (const [layout, kind] of [['top-small', 'page'], ['top-large', 'page'], ['top-small', 'section']]) {
        const base = { layout, kind }; await mount(Object.assign({ media: { person: 'Maya Chen' } }, base)); const one = (await read()).h;
        await mount(Object.assign({ media: { versus: [a, b] } }, base)); const two = await read();
        assert.equal(two.h, one, T + kind + ' ' + layout + ': the pair is as tall as the single media (' + two.h + ' vs ' + one + ')');
      }
      await mount({ media: { versus: [a, b] }, layout: 'column-large' }); s = await read(); assert.equal(s.parties, 2, T + 'a stretched layout takes the pair'); assert.ok(s.h >= 44, T + 'stretched media');
      // decorative
      await mount({ media: { versus: [a, b], decorative: true } }); s = await read(); assert.equal(s.hidden, 'true', T + 'decorative hides the pair'); assert.equal(s.role, null, T + 'and it is not an image');
      // a picture
      await mount({ media: { versus: [{ name: 'Michael Bennett', src: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>') }, b] } });
      assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-entity-header__party img').length), 1, T + 'a picture when src is given');
      // one party warns and shows one Avatar
      warns.length = 0; await mount({ media: { versus: [a] } });
      assert.equal((await read()).parties, 1, T + 'one party: one Avatar'); assert.ok(warns.some((w) => /versus/.test(w)), T + 'a development warning');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('ENTITY_HEADER_VERSUS_991_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
