/* Plenix tests · #1152 (ADR 0048, D-0150; design docs/pds1/slices/1152/design.md): Timeline variant="grouped" density="compact", the CTM Key Dates look.
   Summary: the compact look draws a year heading with no rule and no watermark, one tinted box per event, one line per event (title, description cut with an
     ellipsis, category tag at the inline end), a 40px date tile with no rings and a bold inverse month on its category band, and a 760px cap at the inline start.
     Both looks (compact and standard): equal padding on all four sides in every density, no heading rule, no tile rings, the month in content-inverse.
   Checks (brief AC-1..AC-7 and design section 6): AC-1 heading and watermark; AC-2 box, dashed upcoming, undated "Pending" in the tag; AC-3 equal padding;
     AC-4 one line, ellipsis, Tooltip only while cut, tag at the inline end; AC-5 tile (no rings, band, month colour, 40px / 56px); AC-6 max inline size and start alignment;
     AC-7 month-on-band contrast (eight slots, light and dark), RTL mirror; density on the default variant warns and changes nothing.
   Proof first: before the change `density` is ignored, so there is no compact class, the heading keeps its rule, the tile its rings and the padding is unequal.
   Usage: node tests/timeline-compact-1152.test.js   → TIMELINE_COMPACT_1152_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9808, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    const page = await browser.newPage(); await page.setViewport({ width: 1400, height: 900 });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); if (m.type() === 'warning' || m.type() === 'warn') warns.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const mount = (props, dir, mode, width) => page.evaluate(async (props, dir, mode, width) => {
      document.documentElement.setAttribute('dir', dir || 'ltr'); document.documentElement.setAttribute('data-plx-mode', mode || 'light');
      const h = React.createElement, P = window.Plenix; window.__root && window.__root.unmount();
      document.querySelector('main').textContent = ''; const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = (width || 1200) + 'px'; document.querySelector('main').appendChild(c);
      const p = Object.assign({ label: 'Key dates', variant: 'grouped', density: 'compact' }, props);
      if (p.density === null) delete p.density;
      window.__root = ReactDOM.createRoot(c); window.__root.render(h(P.Timeline, p)); await new Promise((r) => setTimeout(r, 600));
    }, props, dir, mode, width);
    const cat = (n) => ({ id: 'c' + n, label: 'Category ' + n, color: String(n) });
    const items = [
      { id: 1, dateTime: '2026-11-14', title: 'Hearing set', description: 'The council set a hearing.', category: cat(4) },
      { id: 2, dateTime: '2026-03-02', title: 'Filed', description: 'A long description of what was filed with the council, so that it does not fit on one line at a narrow width, ' + 'and keeps going. '.repeat(8), category: cat(3) },
      { id: 3, dateTime: '2025-12-01', title: 'Decree', category: cat(7) },
      { id: 4, title: 'Interview', upcoming: true, dateTime: '2027-02-01', description: 'With the applicant.', category: cat(5) },
      { id: 5, title: 'Appointment', upcoming: true, description: 'To be set.', category: cat(6) },
    ];
    // AC-1: year headings, no rule under them, no watermark year
    await mount({ items });
    let s = await page.evaluate(() => ({
      root: document.querySelector('#c section').className, headings: [...document.querySelectorAll('#c h3')].map((h) => h.textContent.trim()),
      rule: [...document.querySelectorAll('#c h3')].map((h) => getComputedStyle(h, '::after').content), marks: document.querySelectorAll('#c .plx-timeline__watermark').length }));
    assert.ok(/plx-timeline--compact/.test(s.root) && /plx-timeline--grouped/.test(s.root), 'AC-1: the root carries plx-timeline--compact next to plx-timeline--grouped: ' + s.root);
    assert.deepEqual(s.headings, ['2026', '2025', '2027'], 'AC-1: a heading per year');
    assert.ok(s.rule.every((c) => c === 'none' || c === 'normal'), 'AC-1: no line under a year heading: ' + JSON.stringify(s.rule));
    assert.equal(s.marks, 0, 'AC-1: no watermark year in the compact look');
    // AC-2: one tinted box with a 1px category border; upcoming dashed; undated shows Pending in the tag, none on the tile
    s = await page.evaluate(() => { const ev = [...document.querySelectorAll('#c .plx-timeline__event')], cs = ev.map((e) => getComputedStyle(e));
      return { bg: cs[0].backgroundColor, bw: cs[0].borderTopWidth, bs: cs.map((c) => c.borderTopStyle), plain: ev[0].querySelector('.plx-timeline__tag').textContent.trim(),
        dated: ev[3].querySelector('.plx-timeline__tag').textContent.trim(), undated: ev[4].querySelector('.plx-timeline__tag').textContent.trim(),
        tile: ev[4].querySelector('.plx-timeline__date').textContent.trim(), tileDashed: getComputedStyle(ev[4].querySelector('.plx-timeline__date')).borderTopStyle,
        time: ev[4].querySelector('time') }; });
    assert.notEqual(s.bg, 'rgba(0, 0, 0, 0)', 'AC-2: the event is tinted'); assert.equal(s.bw, '1px', 'AC-2: a 1px border');
    assert.deepEqual(s.bs, ['solid', 'solid', 'solid', 'dashed', 'dashed'], 'AC-2: upcoming events have a dashed border');
    assert.equal(s.plain, 'Category 4', 'AC-2: a past event\'s tag is its category'); assert.equal(s.dated, 'Category 5 · upcoming', 'AC-4: a dated upcoming event adds "· upcoming"');
    assert.equal(s.undated, 'Category 6 · Pending', 'AC-2: an undated upcoming event says Pending in its tag'); assert.equal(s.tile, '', 'AC-2: the compact tile has no word, month or day for it');
    assert.equal(s.tileDashed, 'dashed', 'AC-2: the undated tile is dashed'); assert.equal(s.time, null, 'AC-2: no <time> without a date');
    // the tag words are catalog patterns with a {category} slot (ADR 0048, D-0152): a language can order them as it needs,
    await mount({ items, strings: { tagUpcoming: 'soon: {category}', tagPending: '{category} (to be set)' } });
    s = await page.evaluate(() => [...document.querySelectorAll('#c .plx-timeline__event')].map((e) => e.querySelector('.plx-timeline__tag').textContent.trim()).slice(3));
    assert.deepEqual(s, ['soon: Category 5', 'Category 6 (to be set)'], 'AC-4: the pattern places the label: ' + JSON.stringify(s));
    // AC-3: the padding is equal on all four sides, in both looks and the three densities
    for (const look of ['compact', 'page']) for (const [density, px] of [['standard', look === 'compact' ? 8 : 12], ['compact', 8], ['comfortable', look === 'compact' ? 8 : 16]]) {
      await mount({ items, density: look }); await page.evaluate((d) => document.documentElement.setAttribute('data-plx-density', d), density);
      const p = await page.evaluate(() => { const c = getComputedStyle(document.querySelector('#c .plx-timeline__event')); return ['paddingBlockStart', 'paddingBlockEnd', 'paddingInlineStart', 'paddingInlineEnd'].map((k) => c[k]); });
      assert.deepEqual(p, Array(4).fill(px + 'px'), 'AC-3: ' + look + ' look, ' + density + ' density: equal padding of ' + px + 'px: ' + JSON.stringify(p));
    }
    await page.evaluate(() => document.documentElement.removeAttribute('data-plx-density'));
    // AC-4: one line (title, description, tag), the description cut with an ellipsis, the Tooltip only while cut, the tag at the inline end
    await mount({ items });
    s = await page.evaluate(() => { const e = document.querySelectorAll('#c .plx-timeline__event')[1], t = e.querySelector('.plx-timeline__event-title').getBoundingClientRect(), d = e.querySelector('.plx-timeline__event-description'),
      dr = d.getBoundingClientRect(), g = e.querySelector('.plx-timeline__tag').getBoundingClientRect(), r = e.getBoundingClientRect(), cs = getComputedStyle(d);
      return { sameLine: Math.abs((t.top + t.bottom) / 2 - (dr.top + dr.bottom) / 2) < 3, after: dr.left >= t.right - 1, oneLine: dr.height < 24, ellipsis: cs.textOverflow, nowrap: cs.whiteSpace, cut: d.scrollWidth > d.clientWidth,
        tagEnd: r.right - g.right, height: r.height, tagAfter: g.left >= dr.right - 1, title: e.querySelector('.plx-timeline__event-title').textContent.trim() }; });
    assert.ok(s.sameLine && s.after, 'AC-4: the title and the description are on one line'); assert.ok(s.oneLine, 'AC-4: the description is one line high');
    assert.equal(s.ellipsis, 'ellipsis', 'AC-4: the description ends in an ellipsis'); assert.equal(s.nowrap, 'nowrap'); assert.ok(s.cut, 'AC-4: the long description is cut');
    assert.ok(s.tagAfter && s.tagEnd < 12, 'AC-4: the tag is at the inline end (' + s.tagEnd + 'px from the edge)'); assert.equal(s.title, 'Filed', 'AC-4: the title keeps its full width');
    assert.equal(Math.round(s.height), 58, 'design 4: a compact event is 58px high');
    const shortBox = await page.evaluate(() => { const r = document.querySelectorAll('#c .plx-timeline__event')[0].querySelector('.plx-timeline__event-description').getBoundingClientRect(); return { x: r.left + 10, y: (r.top + r.bottom) / 2 }; });
    await page.mouse.move(shortBox.x, shortBox.y); await new Promise((r) => setTimeout(r, 1200));
    const tipsShort = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => t.textContent.trim() && getComputedStyle(t).display !== 'none' && getComputedStyle(t).visibility !== 'hidden').length);
    assert.equal(tipsShort, 0, 'AC-4: no Tooltip on text that is not cut');
    const cutBox = await page.evaluate(() => { const r = document.querySelectorAll('#c .plx-timeline__event')[1].querySelector('.plx-timeline__event-description').getBoundingClientRect(); return { x: r.left + 20, y: (r.top + r.bottom) / 2 }; });
    await page.mouse.move(2, 2); await new Promise((r) => setTimeout(r, 200)); await page.mouse.move(cutBox.x, cutBox.y); await new Promise((r) => setTimeout(r, 1200));
    const tipCut = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => getComputedStyle(t).display !== 'none' && getComputedStyle(t).visibility !== 'hidden').map((t) => t.textContent.trim()).filter(Boolean));
    assert.ok(tipCut.length === 1 && /A long description of what was filed/.test(tipCut[0]), 'AC-4: the full description shows in a Tooltip while it is cut: ' + JSON.stringify(tipCut));
    // AC-5: the tile has no rings, a category band, the month in white and bold, 40px (56px in the standard look); the day is under it
    for (const look of ['compact', 'page']) {
      await mount({ items, density: look });
      s = await page.evaluate(() => { const e = document.querySelectorAll('#c .plx-timeline__event')[0], d = e.querySelector('.plx-timeline__date'), b = e.querySelector('.plx-timeline__date-band'), m = e.querySelector('.plx-timeline__date-month'),
        y = e.querySelector('.plx-timeline__date-day'), cs = (el, p) => getComputedStyle(el, p), u = document.querySelectorAll('#c .plx-timeline__event')[3];
        return { size: [d.offsetWidth, d.offsetHeight], before: cs(d, '::before').content, after: cs(d, '::after').content, band: b.offsetHeight, bandBg: cs(b).backgroundColor, titleColor: cs(e.querySelector('.plx-timeline__event-title')).color,
          month: m.textContent.trim(), monthColor: cs(m).color, monthWeight: cs(m).fontWeight, monthSize: parseFloat(cs(m).fontSize), day: y.textContent.trim(), daySize: parseFloat(cs(y).fontSize),
          mTop: m.getBoundingClientRect().top - b.getBoundingClientRect().top, mBottom: m.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom, dayTop: y.getBoundingClientRect().top - b.getBoundingClientRect().bottom,
          inverse: cs(document.documentElement).getPropertyValue('--plx-sys-content-inverse').trim(), upBand: cs(u.querySelector('.plx-timeline__date-band')).backgroundColor, upMonth: cs(u.querySelector('.plx-timeline__date-month')).color,
          upDefault: cs(document.documentElement).getPropertyValue('--plx-sys-content-default').trim() }; }); const T = look + ': ';
      assert.ok(s.before === 'none' && s.after === 'none', 'AC-5: ' + T + 'no ring on the tile: ' + s.before + ' ' + s.after);
      assert.deepEqual(s.size, look === 'compact' ? [40, 40] : [56, 56], 'AC-5: ' + T + 'tile size'); assert.equal(s.band, look === 'compact' ? 16 : 20, 'AC-5: ' + T + 'band height');
      assert.equal(s.bandBg, s.titleColor, 'AC-5: ' + T + 'the band is the category title colour');
      assert.equal(s.monthColor, 'rgb(255, 255, 255)', 'AC-5: ' + T + 'the month is white on the band (light mode): ' + s.monthColor); assert.ok(+s.monthWeight >= 700, 'AC-5: ' + T + 'the month is bold');
      assert.equal(s.monthSize, look === 'compact' ? 13 : 14, 'AC-5: ' + T + 'month size'); assert.equal(s.daySize, look === 'compact' ? 15 : 18, 'AC-5: ' + T + 'day size');
      assert.ok(s.mTop >= 0 && s.mTop < 4 && s.mBottom <= 1, 'AC-5: ' + T + 'the month sits inside the band with little space above it (' + s.mTop.toFixed(1) + 'px)'); assert.ok(s.dayTop >= -1, 'AC-5: ' + T + 'the day is under the band');
      assert.notEqual(s.upBand, s.titleColor, 'AC-5: ' + T + 'an upcoming tile has the grey band'); assert.notEqual(s.upMonth, 'rgb(255, 255, 255)', 'AC-5: ' + T + 'an upcoming month is not white on the grey band');
    }
    // standard look: no rule under the heading, no rings, the watermark stays, no width cap
    await mount({ items, density: null });
    s = await page.evaluate(() => ({ rule: getComputedStyle(document.querySelector('#c h3'), '::after').content, marks: document.querySelectorAll('#c .plx-timeline__watermark').length, cls: document.querySelector('#c section').className,
      w: document.querySelector('#c section').getBoundingClientRect().width }));
    assert.ok(s.rule === 'none' || s.rule === 'normal', 'the standard look: no line under the heading'); assert.ok(s.marks > 0, 'the standard look keeps its watermark'); assert.ok(!/compact/.test(s.cls), 'no compact class by default');
    assert.equal(Math.round(s.w), 1200, 'the standard look has no width cap');
    // AC-6: a wide container: the width stops at 760px and sits at the inline start (LTR and RTL)
    for (const dir of ['ltr', 'rtl']) {
      await mount({ items }, dir, 'light', 1200);
      s = await page.evaluate(() => { const r = document.querySelector('#c section').getBoundingClientRect(), c = document.getElementById('c').getBoundingClientRect(); return { w: r.width, startGap: document.dir === 'rtl' ? c.right - r.right : r.left - c.left }; });
      assert.equal(Math.round(s.w), 760, 'AC-6: ' + dir + ': stops at 760px'); assert.ok(Math.abs(s.startGap) < 1, 'AC-6: ' + dir + ': at the inline start');
    }
    await mount({ items }, 'ltr', 'light', 500);
    assert.equal(Math.round(await page.evaluate(() => document.querySelector('#c section').getBoundingClientRect().width)), 500, 'AC-6: a narrower container makes it narrower');
    // AC-7: month on band contrast, eight slots, light and dark; the grey upcoming band
    const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    for (const mode of ['light', 'dark']) for (const look of ['compact', 'page']) {
      await mount({ items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: n, dateTime: '2026-0' + n + '-10', title: 'Event ' + n, category: cat(n) })).concat([{ id: 9, upcoming: true, dateTime: '2027-02-01', title: 'Up', category: cat(1) }]), density: look }, 'ltr', mode);
      const rgb = await page.evaluate(() => {
        const cv = document.createElement('canvas').getContext('2d'); cv.canvas.width = cv.canvas.height = 1;
        const px = (col) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#fff'; cv.fillRect(0, 0, 1, 1); cv.fillStyle = col; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3); };
        return [...document.querySelectorAll('#c .plx-timeline__event')].map((e) => ({ bg: px(getComputedStyle(e.querySelector('.plx-timeline__date-band')).backgroundColor), fg: px(getComputedStyle(e.querySelector('.plx-timeline__date-month')).color) }));
      });
      rgb.forEach((c, i) => { const a = lum(c.bg), b = lum(c.fg), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); assert.ok(r >= 4.5, 'AC-7: ' + mode + ' ' + look + ' ' + (i < 8 ? 'slot ' + (i + 1) : 'upcoming') + ': month on band is ' + r.toFixed(2) + ':1'); });
    }
    // AC-7: RTL mirrors: the tile at the right, the tag at the left
    for (const dir of ['ltr', 'rtl']) {
      await mount({ items: items.slice(0, 1) }, dir);
      const g = await page.evaluate(() => { const e = document.querySelector('#c .plx-timeline__event'), d = e.querySelector('.plx-timeline__date').getBoundingClientRect(), t = e.querySelector('.plx-timeline__tag').getBoundingClientRect(), r = e.getBoundingClientRect();
        return { dateStart: d.left - r.left, dateEnd: r.right - d.right, tagStart: t.left - r.left, tagEnd: r.right - t.right }; });
      if (dir === 'ltr') assert.ok(g.dateStart < g.dateEnd && g.tagEnd < g.tagStart, 'AC-7: LTR: the tile at the left, the tag at the right');
      else assert.ok(g.dateEnd < g.dateStart && g.tagStart < g.tagEnd, 'AC-7: RTL: the tile at the right, the tag at the left');
    }
    // empty values: a title alone; no category: the neutral set and no tag
    await mount({ items: [{ id: 1, dateTime: '2026-05-05', title: 'Only a title' }] });
    s = await page.evaluate(() => ({ tags: document.querySelectorAll('#c .plx-timeline__tag').length, desc: document.querySelectorAll('#c .plx-timeline__event-description').length }));
    assert.deepEqual(s, { tags: 0, desc: 0 }, 'an event with no category and no description: the title alone');
    // density on the default variant warns and changes nothing
    warns.length = 0; await mount({ variant: 'default', items: [{ id: 1, time: 'Oct 2', dateTime: '2026-10-02', title: 'Created' }] });
    assert.ok(warns.some((w) => /density/.test(w)), 'density with variant="default" warns in development');
    assert.equal(await page.evaluate(() => [document.querySelectorAll('#c section').length, document.querySelectorAll('#c .plx-timeline__item').length].join()), '0,1', 'the default variant is unchanged');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('TIMELINE_COMPACT_1152_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
