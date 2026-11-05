/* Plenix tests · EntityHeader media without a box: the icon fills its area (issue 418; D-0036, D-0059, design 418-icon-fill).
   Summary: with no box (the default for media={{ icon, hue }}) the drawn icon is as big as the media area in every layout and kind:
     page: top-small and column-small 44px, top-large 72px, streamlined 48px; column-large the full square (at least 112px) and edge (at least 128px);
     section: top-small and column-small 32px, top-large 48px, column-large at least 64px, edge at least 80px; with box: true the small tile icon stays.
     Left to right and right to left.
   Proof first: before 418 the stretched layouts (column-large, edge) draw a 40-48px icon in a 112-128px area: those lines fail.
   Usage: node tests/entity-header-icon-fill-418.test.js   → ENTITY_HEADER_ICON_FILL_418_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9854, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const sizes = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); document.querySelector('main').innerHTML = '<div id="c" style="width:900px"></div>'; const h = React.createElement, P = window.Plenix;
        const media = { icon: 'folder', hue: 'blue' }, base = { title: 'Case 14', subtitle: 'Hearing on Thursday', facts: [{ label: 'Owner', value: 'Fr. John' }, { label: 'Due', value: 'Friday' }], status: { tone: 'success', label: 'Open' } };
        const cases = [];
        for (const layout of ['top-small', 'top-large', 'column-small', 'column-large', 'edge']) { cases.push({ id: 'page-' + layout, props: { ...base, layout, media } }); cases.push({ id: 'section-' + layout, props: { ...base, kind: 'section', summary: '3 open', layout, media } }); }
        cases.push({ id: 'streamlined', props: { ...base, headerStyle: 'streamlined', media } });
        cases.push({ id: 'page-box', props: { ...base, layout: 'column-large', media: { ...media, box: true } } });
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null, cases.map((c) => h('div', { key: c.id, id: c.id, style: { marginBlockEnd: 16 } }, h(P.EntityHeader, c.props)))));
        await new Promise((r) => setTimeout(r, 1500));
        const out = {};
        for (const c of cases) { const root = document.getElementById(c.id), tile = root.querySelector('.plx-entity-header__tile'); if (!tile) { out[c.id] = null; continue; } const svg = tile.querySelector('svg, .plx-icon'); const ib = svg.getBoundingClientRect(), tb = tile.getBoundingClientRect(); out[c.id] = { icon: Math.round(ib.width), tile: Math.round(tb.width), area: Math.round(tile.closest('.plx-entity-header__media').getBoundingClientRect().width) }; }
        return out;
      }, dir);
      const T = dir + ' ';
      const is = (id, px) => assert.ok(sizes[id] && Math.abs(sizes[id].icon - px) <= 1, T + id + ': the icon is ' + px + 'px, got ' + JSON.stringify(sizes[id]));
      const atLeast = (id, px) => assert.ok(sizes[id] && sizes[id].icon >= px, T + id + ': the icon is at least ' + px + 'px, got ' + JSON.stringify(sizes[id]));
      const fills = (id) => assert.ok(sizes[id] && Math.abs(sizes[id].icon - sizes[id].tile) <= 1, T + id + ': the icon fills its square, got ' + JSON.stringify(sizes[id]));
      is('page-top-small', 44); is('page-top-large', 72); is('page-column-small', 44); is('streamlined', 48);
      atLeast('page-column-large', 112); fills('page-column-large'); atLeast('page-edge', 128); fills('page-edge');
      is('section-top-small', 32); is('section-top-large', 48); is('section-column-small', 32); atLeast('section-column-large', 64); fills('section-column-large'); atLeast('section-edge', 80); fills('section-edge');
      assert.ok(sizes['page-box'] && sizes['page-box'].icon < 80, T + 'with box: true the small tile icon stays, got ' + JSON.stringify(sizes['page-box']));
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('ENTITY_HEADER_ICON_FILL_418_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
