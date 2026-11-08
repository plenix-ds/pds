/* Plenix tests · #987 (ADR 0036, D-0116; design docs/pds1/slices/987/design.md): Timeline variant="grouped".
   Summary: events grouped by year (a section with a heading, an ordered list of events), each in a container tinted by its category slot 1 to 8,
     a calendar date tile, a watermark year, an optional legend that filters the categories, and upcoming events (dashed, "Pending").
   Checks: the grouping and the order given; headingLevel; the <time> carries the full date and the tile and the watermark are aria-hidden; upcoming shows
     Pending with a dashed outline; the legend toggles from the keyboard (aria-pressed), hides events and an empty year, controlled and not;
     the event title is at least 4.5:1 on its tint for all eight slots, light and dark; RTL puts the date tile and the watermark at the right;
     the default variant is unchanged; 1000 events render; a missing dateTime warns in development.
   Proof first: before the change `variant` is ignored, so there are no year sections.
   Usage: node tests/timeline-grouped-987.test.js   → TIMELINE_GROUPED_987_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9807, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 900 });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); if (m.type() === 'warning' || /dateTime/.test(m.text())) warns.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const mount = (props, dir, mode) => page.evaluate(async (props, dir, mode) => {
      document.documentElement.setAttribute('dir', dir || 'ltr'); document.documentElement.setAttribute('data-plx-mode', mode || 'light');
      const h = React.createElement, P = window.Plenix; window.__root && window.__root.unmount(); window.__changes = [];
      document.querySelector('main').textContent = ''; const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '900px'; document.querySelector('main').appendChild(c);
      const p = Object.assign({ label: 'Case history', variant: 'grouped' }, props);
      if (p.controlled) { p.onHiddenCategoriesChange = (ids) => window.__changes.push(ids); delete p.controlled; }
      window.__root = ReactDOM.createRoot(c); window.__root.render(h(P.Timeline, p)); await new Promise((r) => setTimeout(r, 600));
    }, props, dir, mode);
    const cat = (n) => ({ id: 'c' + n, label: 'Category ' + n, color: String(n) });
    const items = [
      { id: 1, dateTime: '2026-11-14', title: 'Hearing set', description: 'The council set a hearing.', category: cat(5) },
      { id: 2, dateTime: '2026-03-02', title: 'Filed', category: cat(3) },
      { id: 3, dateTime: '2026-01-20', title: 'Married', description: 'A marriage record.', category: cat(1) },
      { id: 4, dateTime: '2025-12-01', title: 'Decree', category: cat(7) },
      { id: 5, dateTime: '2025-05-09', title: 'Application', category: cat(3) },
      { id: 6, title: 'Interview', upcoming: true, dateTime: '2027-02-01', category: cat(5) },
    ];
    // grouping and order
    await mount({ items });
    let s = await page.evaluate(() => [...document.querySelectorAll('#c section.plx-timeline__group')].map((g) => ({
      heading: g.querySelector('h3') && g.querySelector('h3').textContent.trim(), labelled: g.getAttribute('aria-labelledby') === (g.querySelector('h3') || {}).id,
      list: g.querySelector('ol') ? g.querySelector('ol').children.length : 0, titles: [...g.querySelectorAll('.plx-timeline__event-title')].map((t) => t.textContent) })));
    assert.deepEqual(s.map((g) => g.heading), ['2026', '2025', '2027'], 'consecutive items with the same year form a group, in the order given: ' + JSON.stringify(s));
    assert.deepEqual(s.map((g) => g.list), [3, 2, 1], 'each group is an ordered list of its events');
    assert.ok(s.every((g) => g.labelled), 'each group is labelled by its year heading');
    assert.deepEqual(s[0].titles, ['Hearing set', 'Filed', 'Married'], 'the events keep the order given');
    await mount({ items: items.slice().reverse() });
    assert.equal(await page.evaluate(() => document.querySelector('#c section h3').textContent.trim()), '2027', 'reversing the array reverses the order');
    await mount({ items, headingLevel: 2 });
    assert.equal(await page.evaluate(() => document.querySelectorAll('#c section h2').length), 3, 'headingLevel sets the heading element');
    // the date: time carries the full date; the tile and the watermark are aria-hidden
    await mount({ items });
    const ev = await page.evaluate(() => { const e = document.querySelector('#c .plx-timeline__event'); const t = e.querySelector('time');
      return { time: t.textContent.trim(), dt: t.getAttribute('dateTime'), tileHidden: !!e.querySelector('.plx-timeline__date [aria-hidden=true], .plx-timeline__date[aria-hidden=true]'),
        mark: e.parentElement.querySelector('.plx-timeline__watermark') && e.parentElement.querySelector('.plx-timeline__watermark').getAttribute('aria-hidden'),
        tag: e.querySelector('.plx-tag, .plx-timeline__tag') && e.querySelector('.plx-timeline__tag, .plx-tag').textContent.trim() }; });
    assert.ok(/November 14, 2026/.test(ev.time), 'the <time> text names the full date: ' + ev.time); assert.equal(ev.dt, '2026-11-14');
    assert.ok(ev.tileHidden, 'the calendar tile is aria-hidden'); assert.equal(ev.mark, 'true', 'the watermark year is aria-hidden'); assert.equal(ev.tag, 'Category 5', 'the category label is the end tag');
    // upcoming
    const up = await page.evaluate(() => { const e = [...document.querySelectorAll('#c .plx-timeline__event')].find((x) => x.classList.contains('plx-timeline__event--upcoming'));
      return e && { text: e.textContent, style: getComputedStyle(e).borderTopStyle }; });
    assert.ok(up, 'an upcoming event has the --upcoming class'); assert.equal(up.style, 'dashed', 'its outline is dashed'); assert.ok(!/Pending/.test(up.text) && /FEB|Feb/.test(up.text), 'with a date it shows the month and day, not Pending');
    await mount({ items: [{ id: 1, title: 'Hearing', upcoming: true, category: cat(5) }] });
    assert.ok(await page.evaluate(() => /Pending/.test(document.querySelector('#c .plx-timeline__event').textContent)), 'without a date it shows Pending');
    // legend: keyboard, aria-pressed, hides events and an empty year
    await mount({ items, legend: true });
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('#c [role=group] button')).backgroundColor), 'rgba(0, 0, 0, 0)', 'a legend item that is on has no fill');
    const legend = await page.evaluate(() => { const g = document.querySelector('#c [role=group]'); return g && { name: g.getAttribute('aria-label') || (document.getElementById(g.getAttribute('aria-labelledby')) || {}).textContent,
      buttons: [...g.querySelectorAll('button')].map((b) => [b.textContent.trim(), b.getAttribute('aria-pressed')]) }; });
    assert.equal(legend.name, 'Filter by category', 'the legend is a group with a name'); assert.deepEqual(legend.buttons, [['Category 5', 'true'], ['Category 3', 'true'], ['Category 1', 'true'], ['Category 7', 'true']], 'one toggle per category, in item order');
    await page.focus('#c [role=group] button'); await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 200));
    s = await page.evaluate(() => ({ pressed: document.querySelector('#c [role=group] button').getAttribute('aria-pressed'), n: document.querySelectorAll('#c .plx-timeline__event').length, years: [...document.querySelectorAll('#c section h3')].map((x) => x.textContent.trim()) }));
    assert.equal(s.pressed, 'false', 'Enter turns the category off'); assert.equal(s.n, 4, 'its events are not rendered'); assert.deepEqual(s.years, ['2026', '2025'], 'a year with no visible event is dropped');
    await page.keyboard.press('Tab'); await page.keyboard.press('Space'); await new Promise((r) => setTimeout(r, 200));
    assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-timeline__event').length), 2, 'Space toggles the next category');
    // the swatch is 12 x 12px on and off, and the legend is 24px above the first year
    for (const [dir, mode] of [['ltr', 'light'], ['ltr', 'dark'], ['rtl', 'light']]) {
      await mount({ items, legend: true }, dir, mode); await page.focus('#c [role=group] button'); await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 200));
      const g = await page.evaluate(() => ({ sw: [...document.querySelectorAll('#c .plx-timeline__swatch')].map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)].join('x'); }),
        gap: Math.round(document.querySelector('#c section.plx-timeline__group h3').getBoundingClientRect().top - document.querySelector('#c [role=group]').getBoundingClientRect().bottom) }));
      assert.ok(g.sw.length === 4 && g.sw.every((x) => x === '12x12'), dir + ' ' + mode + ': swatches are 12x12 on and off: ' + g.sw);
      assert.equal(g.gap, 24, dir + ' ' + mode + ': the legend is 24px above the first year (' + g.gap + ')');
    }
    // controlled
    await mount({ items, legend: true, hiddenCategories: ['c3'], controlled: true });
    assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-timeline__event').length), 4, 'hiddenCategories hides those');
    await page.focus('#c [role=group] button'); await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 200));
    assert.deepEqual(await page.evaluate(() => window.__changes), [['c3', 'c5']], 'the change is reported');
    assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-timeline__event').length), 4, 'controlled: nothing changes until the app updates the prop');
    // contrast of the title on the tint, eight slots, light and dark
    const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    for (const mode of ['light', 'dark']) {
      await mount({ items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: n, dateTime: '2026-0' + n + '-10', title: 'Event ' + n, category: cat(n) })) }, 'ltr', mode);
      const rgb = await page.evaluate(() => {
        const cv = document.createElement('canvas').getContext('2d'); cv.canvas.width = cv.canvas.height = 1;
        const px = (col) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#fff'; cv.fillRect(0, 0, 1, 1); cv.fillStyle = col; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3); };
        return [...document.querySelectorAll('#c .plx-timeline__event')].map((e) => ({ bg: px(getComputedStyle(e).backgroundColor), fg: px(getComputedStyle(e.querySelector('.plx-timeline__event-title')).color) }));
      });
      rgb.forEach((c, i) => { const a = lum(c.bg), b = lum(c.fg), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); assert.ok(r >= 4.5, mode + ' slot ' + (i + 1) + ': title on tint is ' + r.toFixed(2) + ':1'); });
    }
    // RTL: the date tile and the watermark are at the right of the event; LTR at the left
    for (const dir of ['ltr', 'rtl']) {
      await mount({ items: items.slice(0, 1) }, dir);
      const g = await page.evaluate((dir) => { const e = document.querySelector('#c .plx-timeline__event'), d = e.querySelector('.plx-timeline__date').getBoundingClientRect(), w = e.parentElement.querySelector('.plx-timeline__watermark').getBoundingClientRect(), r = e.getBoundingClientRect(), t = e.querySelector('.plx-timeline__tag, .plx-tag').getBoundingClientRect();
        return { dateStart: d.left - r.left, dateEnd: r.right - d.right, wmOutside: w.right <= r.left + 1 || w.left >= r.right - 1, tagBeforeDate: dir === 'rtl' ? t.right < d.left : t.left > d.right }; }, dir);
      if (dir === 'ltr') assert.ok(g.dateStart < g.dateEnd, 'LTR: the date tile is at the left');
      else assert.ok(g.dateEnd < g.dateStart, 'RTL: the date tile is at the right');
      assert.ok(g.wmOutside, dir + ': the watermark sits beside the event, not over it');
    }
    // densities: the group gap is 80px, 64px compact; the event padding is 12/16, 8/12 compact, 16/16 comfortable
    for (const [density, gap, pad] of [['standard', 80, '12px 16px'], ['compact', 64, '8px 12px'], ['comfortable', 80, '16px 16px']]) {
      await mount({ items }); await page.evaluate((d) => document.documentElement.setAttribute('data-plx-density', d), density);
      const g = await page.evaluate(() => ({ gap: parseFloat(getComputedStyle(document.querySelector('#c .plx-timeline__groups')).rowGap), pad: ['paddingBlockStart', 'paddingInlineStart'].map((k) => getComputedStyle(document.querySelector('#c .plx-timeline__event'))[k]).join(' ') }));
      assert.equal(g.gap, gap, density + ': group gap'); assert.equal(g.pad, pad, density + ': event padding');
    }
    await page.evaluate(() => document.documentElement.removeAttribute('data-plx-density'));
    // the default variant is unchanged
    await mount({ variant: 'default', items: [{ id: 1, time: 'Oct 2', dateTime: '2026-10-02', title: 'Created' }] });
    assert.equal(await page.evaluate(() => [document.querySelectorAll('#c section').length, document.querySelectorAll('#c .plx-timeline__item').length]).then(String), '0,1', 'default: a plain list, no year sections');
    // 1000 events
    const many = Array.from({ length: 1000 }, (_, i) => ({ id: i, dateTime: (2000 + (i % 25)) + '-06-15', title: 'E' + i, category: cat(1 + (i % 8)) })).sort((a, b) => b.dateTime.localeCompare(a.dateTime));
    const t0 = Date.now(); await mount({ items: many, legend: true });
    assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-timeline__event').length), 1000, '1000 events render'); assert.ok(Date.now() - t0 < 15000, '1000 events render in time');
    // a missing dateTime warns
    warns.length = 0; await mount({ items: [{ id: 1, title: 'No date' }] });
    assert.ok(warns.some((w) => /dateTime/.test(w)), 'a missing dateTime warns in development');
    assert.deepEqual(errors.filter((e) => !/dateTime/.test(e)), [], 'no script errors');
    console.log('TIMELINE_GROUPED_987_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
