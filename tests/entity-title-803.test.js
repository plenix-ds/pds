/* Plenix tests · EntityTitle, a short title line for list rows and cards (issue 803; idea 3 of #767, owner yes in #769).
   Summary (the browser):
     the parts: the icon (decorative), the title, the subtitle and the tag; each but the title optional; a string tag is a
       Tag, { label, tone, icon } a status Badge with its icon, { label, category } a category Tag
     a long title stays on one line, ends in "…", and shows its whole text in a tooltip only while it is cut
     loading: a placeholder in place of the text (a small spinner after 1 s), aria-busy, as tall as the loaded item
     in a list row (RowButton): one line is 20px (as plain row text), two lines 36px (the 4px grid); in a card the title
       is a heading with level
     right to left: the icon at the inline start, the tag after the title
     no script errors
   Usage: node tests/entity-title-803.test.js   → ENTITY_TITLE_803_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9684, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 900, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });

    const draw = (dir) => page.evaluate(async (dir) => {
      const h = React.createElement, P = window.Plenix;
      document.documentElement.setAttribute('dir', dir);
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      const sheet = document.getElementById('t803') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't803' });
      sheet.textContent = '[data-test-row]{inline-size:320px;}';
      const row = (id, child) => h('div', { id, 'data-test-row': '' }, h(P.RowButton, { onClick: () => {} }, child));
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h('div', { dir },
        row('plain', h('span', null, 'Parish photos')),
        row('one', h(P.EntityTitle, { icon: 'folder', title: 'Parish photos' })),
        row('two', h(P.EntityTitle, { icon: 'document', title: 'Easter flyer.pdf', subtitle: 'Edited 2 hours ago' })),
        row('tagged', h(P.EntityTitle, { icon: 'folder', title: 'Parish photos', subtitle: '128 items', tag: 'Archive' })),
        row('status', h(P.EntityTitle, { title: 'Budget 2027', tag: { label: 'Approved', tone: 'success', icon: 'check' } })),
        row('category', h(P.EntityTitle, { title: 'Budget 2027', tag: { label: 'Finance', category: 'green' } })),
        row('long', h(P.EntityTitle, { icon: 'document', title: 'The annual report of the parish council for the year two thousand and twenty-six.pdf', subtitle: 'Council · PDF' })),
        row('loadTwo', h(P.EntityTitle, { icon: 'document', subtitle: true, loading: true })),
        row('loadOne', h(P.EntityTitle, { icon: 'document', loading: true })),
        h('div', { id: 'card', 'data-test-row': '' }, h(P.Card, null, h(P.EntityTitle, { icon: 'folder', title: 'Feast day icons', subtitle: '42 images', level: 3 })))));
      await new Promise((r) => setTimeout(r, 500));
    }, dir);
    const read = () => page.evaluate(() => {
      const q = (id, sel) => document.querySelector('#' + id + ' ' + sel);
      const height = (id) => Math.round(q(id, 'button').getBoundingClientRect().height);
      const long = q('long', '.plx-entity-title__title');
      return {
        heights: { plain: height('plain'), one: height('one'), two: height('two'), tagged: height('tagged'), loadTwo: height('loadTwo'), loadOne: height('loadOne') },
        iconHidden: q('one', '.plx-entity-title__icon').getAttribute('aria-hidden'),
        noSubtitle: !q('one', '.plx-entity-title__subtitle'), noTag: !q('one', '.plx-entity-title__tag'),
        stringTag: !!q('tagged', '.plx-entity-title__tag .plx-tag'),
        statusBadge: !!q('status', '.plx-entity-title__tag .plx-badge') && !!q('status', '.plx-entity-title__tag .plx-badge .plx-icon'),
        categoryTag: !!q('category', '.plx-entity-title__tag .plx-tag'),
        cut: long.scrollWidth > long.clientWidth, oneLine: Math.round(long.getBoundingClientRect().height), ellipsis: getComputedStyle(long).textOverflow,
        busy: q('loadTwo', '.plx-entity-title').getAttribute('aria-busy'), bars: document.querySelectorAll('#loadTwo .plx-skeleton').length, barsOne: document.querySelectorAll('#loadOne .plx-skeleton').length,
        loadText: q('loadTwo', '.plx-entity-title').textContent,
        heading: q('card', '.plx-entity-title__title').tagName, rowHeading: q('one', '.plx-entity-title__title').tagName,
        iconSide: (() => { const i = q('tagged', '.plx-entity-title__icon').getBoundingClientRect(), t = q('tagged', '.plx-entity-title__title').getBoundingClientRect(), g = q('tagged', '.plx-entity-title__tag').getBoundingClientRect(); return { icon: i.left, title: t.left, tag: g.left }; })(),
      };
    });

    for (const dir of ['ltr', 'rtl']) {
      await draw(dir);
      const r = await read();
      assert.equal(r.iconHidden, 'true', dir + ': the icon is decorative');
      assert.ok(r.noSubtitle && r.noTag, dir + ': the subtitle and the tag are optional');
      assert.ok(r.stringTag, dir + ': a string tag is a Tag');
      assert.ok(r.statusBadge, dir + ': { label, tone, icon } is a status Badge with its icon');
      assert.ok(r.categoryTag, dir + ': { label, category } is a category Tag');
      assert.ok(r.cut && r.ellipsis === 'ellipsis' && r.oneLine === 20, dir + ': a long title stays on one 20px line and ends in "…"; got ' + JSON.stringify([r.cut, r.ellipsis, r.oneLine]));
      assert.deepEqual(r.heights, { plain: 20, one: 20, two: 36, tagged: 36, loadTwo: 36, loadOne: 20 }, dir + ': one line as tall as plain row text, two lines 36px, loading as tall as loaded');
      assert.equal(r.busy, 'true', dir + ': loading is aria-busy');
      assert.deepEqual([r.bars, r.barsOne, r.loadText], [0, 0, ''], dir + ': loading draws no Skeleton bars, and no text before the 1 s region delay (#1032)');
      assert.deepEqual([r.heading, r.rowHeading], ['H3', 'SPAN'], dir + ': level makes the card title a heading; a row title is a span');
      if (dir === 'ltr') assert.ok(r.iconSide.icon < r.iconSide.title && r.iconSide.title < r.iconSide.tag, 'left to right: icon, title, tag');
      else assert.ok(r.iconSide.icon > r.iconSide.title && r.iconSide.title > r.iconSide.tag, 'right to left: icon, title, tag from the right');
      // the tooltip: only on the cut title, with its whole text
      await page.hover('#long .plx-entity-title__title'); await new Promise((res) => setTimeout(res, 900));
      const tip = await page.evaluate(() => { const b = [...document.querySelectorAll('[role="tooltip"], .plx-tooltip__bubble')].find((x) => getComputedStyle(x).visibility !== 'hidden' && x.getBoundingClientRect().width > 0); return b ? b.textContent : ''; });
      assert.ok(/two thousand and twenty-six\.pdf/.test(tip), dir + ': the cut title shows its whole text in a tooltip; got ' + tip);
      await page.hover('#one .plx-entity-title__title'); await new Promise((res) => setTimeout(res, 900));
      const none = await page.evaluate(() => [...document.querySelectorAll('[role="tooltip"], .plx-tooltip__bubble')].some((x) => getComputedStyle(x).visibility !== 'hidden' && x.getBoundingClientRect().width > 0 && /Parish photos/.test(x.textContent)));
      assert.equal(none, false, dir + ': a title that fits has no tooltip');
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('ENTITY_TITLE_803_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
