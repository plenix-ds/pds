/* Plenix tests · #1261 (audit items 7 to 9 of #1232, D-0164): the day numbers of a DateBadge, a grouped Timeline's date tile and a Calendar draw in the data font (Reddit Mono);
   the weekday, the month and the year heading stay in the text font. A two-digit day still fits its box on one line.
   Summary: DateBadge (day 28, today and not), Timeline variant grouped in its standard and compact looks (the 56px and 40px tiles), and a Calendar: each day number computes to Reddit Mono,
     each weekday label and the month title to DM Sans, and the day number does not wrap, cut or widen its tile (56px and 40px stay).
   Checks: AC-1 DateBadge day; AC-2 Timeline tile day (both looks) and its month stays text; AC-3 Calendar days, weekday headers stay text; AC-4 the fixed boxes hold their size, with two digits.
   Proof first: before the change these day numbers are drawn in DM Sans.
   Usage: node tests/day-numbers-data-font-1261.test.js   → DAY_NUMBERS_DATA_FONT_1261_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9824, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '800px'; document.querySelector('main').replaceChildren(c);
        const cat = { id: 'a', label: 'Hearings', color: '3' }, items = [{ id: 1, dateTime: '2026-11-28', title: 'Hearing', description: 'In person.', category: cat }];
        ReactDOM.createRoot(c).render(h('div', null,
          h('div', { id: 'db' }, h(P.DateBadge, { day: 28, weekday: 'Tue' }), h(P.DateBadge, { day: 30, weekday: 'Wed', today: true })),
          h('div', { id: 'tl' }, h(P.Timeline, { label: 'Standard', variant: 'grouped', items })), h('div', { id: 'tc' }, h(P.Timeline, { label: 'Compact', variant: 'grouped', density: 'compact', items })),
          h('div', { id: 'cal' }, h(P.Calendar, { label: 'Pick a day', defaultValue: '2026-11-18' }))));
        await new Promise((r) => setTimeout(r, 900));
        const first = (v) => v.split(',')[0].trim().replace(/['"]/g, ''), rs = getComputedStyle(document.documentElement), q = (s) => [...document.querySelectorAll(s)];
        const f = (e) => first(getComputedStyle(e).fontFamily), ok = (e) => e.scrollWidth <= e.clientWidth + 1 && e.getBoundingClientRect().height < 40;
        const tile = (s) => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; };
        return { data: first(rs.getPropertyValue('--plx-sys-font-data')),
          badge: q('#db .plx-date-badge__day').map((e) => ({ t: e.textContent.trim(), f: f(e), ok: ok(e) })), badgeWeekday: q('#db .plx-date-badge__weekday').map(f),
          tlDay: q('#tl .plx-timeline__date-day').map((e) => ({ t: e.textContent.trim(), f: f(e), ok: ok(e) })), tlMonth: q('#tl .plx-timeline__date-month').map(f), tcDay: q('#tc .plx-timeline__date-day').map((e) => ({ t: e.textContent.trim(), f: f(e), ok: ok(e) })),
          tiles: { std: tile('#tl .plx-timeline__date'), compact: tile('#tc .plx-timeline__date') },
          calDays: q('#cal .plx-calendar__day').map((e) => ({ t: e.textContent.trim(), f: f(e) })), calHead: q('#cal .plx-calendar__weekday, #cal [role=columnheader]').map(f), calTitle: q('#cal .plx-calendar__title, #cal h2, #cal [aria-live]').slice(0, 1).map(f) };
      }, dir, mode);
      for (const d of got.badge) { assert.equal(d.f, got.data, T + 'AC-1: DateBadge day ' + d.t + ' is in the data font (' + d.f + ')'); assert.ok(d.ok, T + 'AC-4: DateBadge day ' + d.t + ' fits'); }
      assert.ok(got.badge.length === 2 && got.badgeWeekday.every((x) => x !== got.data), T + 'AC-1: the weekday stays in the text font');
      for (const d of got.tlDay.concat(got.tcDay)) { assert.equal(d.f, got.data, T + 'AC-2: the Timeline tile day ' + d.t + ' is in the data font (' + d.f + ')'); assert.ok(d.ok, T + 'AC-4: the tile day ' + d.t + ' fits'); }
      assert.ok(got.tlDay.length === 1 && got.tcDay.length === 1 && got.tlMonth.every((x) => x !== got.data), T + 'AC-2: the month stays in the text font');
      assert.deepEqual(got.tiles, { std: [56, 56], compact: [40, 40] }, T + 'AC-4: the tiles keep their size with two digits');
      assert.ok(got.calDays.length >= 28, T + 'the calendar days are drawn'); for (const d of got.calDays) assert.equal(d.f, got.data, T + 'AC-3: the Calendar day ' + d.t + ' is in the data font (' + d.f + ')');
      assert.ok(got.calHead.every((x) => x !== got.data) && got.calTitle.every((x) => x !== got.data), T + 'AC-3: the weekday headers and the month title stay in the text font: ' + JSON.stringify([got.calHead, got.calTitle]));
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DAY_NUMBERS_DATA_FONT_1261_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
