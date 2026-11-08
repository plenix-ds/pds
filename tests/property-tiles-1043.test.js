/* Plenix tests · the read-only look as a named variation (issue 1043 and 1052, D-0132, D-0135, D-0136, ADR 0044 and 0045): PropertyGroup/PropertyList variant="tiles", Item.status, Item.span="full".
   Summary: a tiles group gives its list the stacked and tiles classes, two tiles per row 16px apart, the whole field on the tile; a list's own variant wins; status draws a Badge with its icon; an explicit layout="columns"
     wins and warns; an odd last tile sits alone at the inline start at half width; span="full" takes the row; a narrow list shows one per row; without variant nothing changes; two groups 40px apart; RTL mirrors;
     dark label and value are 4.5:1 or more on the tile. Left to right and right to left.
   Proof first: before the change variant, status and span do not exist (no tiles class, no Badge, no full-row tile).
   Usage: node tests/property-tiles-1043.test.js   → PROPERTY_TILES_1043_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9943, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [], warnings = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) (/PropertyList/.test(m.text()) ? warnings : problems).push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (expr, width, mode, density) => page.evaluate(async (dir, expr, width, mode, density) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode || 'light'); document.documentElement.setAttribute('data-plx-density', density || 'standard');
        const host = document.createElement('div'); host.id = 'c'; host.style.inlineSize = width + 'px'; document.querySelector('main').replaceChildren(host);
        const h = React.createElement, P = window.Plenix, I = P.PropertyList.Item; ReactDOM.createRoot(host).render(eval(expr)); await new Promise((r) => setTimeout(r, 600));
        const items = [...host.querySelectorAll('.plx-property-list__item')].map((e) => { const b = e.getBoundingClientRect(), s = getComputedStyle(e), v = getComputedStyle(e.querySelector('.plx-property-list__value')), l = getComputedStyle(e.querySelector('.plx-property-list__label'));
          return { l: b.left, t: b.top, w: b.width, h: b.height, r: b.right, bw: parseFloat(s.borderTopWidth), pt: parseFloat(s.paddingTop), pb: parseFloat(s.paddingBottom), pis: parseFloat(s.paddingInlineStart), pie: parseFloat(s.paddingInlineEnd), vbw: parseFloat(v.borderTopWidth), bg: s.backgroundColor, vc: v.color, lc: l.color, full: e.classList.contains('plx-property-list__item--full'), badge: !!e.querySelector('.plx-property-list__status .plx-badge svg, .plx-property-list__status .plx-badge .plx-icon') }; });
        const list = host.querySelector('.plx-property-list'), lb = list && list.getBoundingClientRect(), gs = [...host.querySelectorAll('.plx-property-group')].map((g) => g.getBoundingClientRect()), hd = host.querySelector('.plx-property-group__heading');
        return { cls: list ? list.className : '', items, lw: lb && lb.width, ll: lb && lb.left, lr: lb && lb.right, gaps: gs.length > 1 ? gs[1].top - gs[0].bottom : null, hc: hd && getComputedStyle(hd).color, ink: getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-content-default') };
      }, dir, expr, width, mode, density);
      const four = `h(P.PropertyGroup, { heading: 'Case', variant: 'tiles' }, h(P.PropertyList, null, h(I, { label: 'Number', data: true }, '2026-01'), h(I, { label: 'Owner' }, 'Maya Chen'), h(I, { label: 'Opened' }, 'May 9'), h(I, { label: 'Status', status: { label: 'Open', tone: 'active', icon: 'check' } })))`;
      let r = await mount(four, 720);
      assert.ok(/plx-property-list--stacked/.test(r.cls) && /plx-property-list--tiles/.test(r.cls), T + 'a tiles group gives its list the stacked and tiles classes: ' + r.cls);
      const [a, b, c] = r.items; assert.ok(Math.abs(a.t - b.t) < 1 && c.t > a.t + 10, T + 'two tiles per row');
      assert.ok(Math.abs(Math.abs(b.l - a.l) - (a.w + 16)) < 1.5, T + 'tiles 16px apart (' + (b.l - a.l) + ')');
      assert.ok(dir === 'ltr' ? b.l > a.l : b.l < a.l, T + 'tiles fill from the inline start');
      assert.ok(a.bw >= 1 && a.vbw === 0, T + 'the whole field is on the tile, not the value alone (' + a.bw + '/' + a.vbw + ')');
      assert.ok(r.items[3].badge, T + 'status draws a Badge with its icon');
      assert.deepEqual([a.pt, a.pb, a.pis, a.pie], [8, 8, 12, 12], T + 'standard tile padding is 8px block and 12px inline');
      // compact: 4px block padding and an 8px gap
      r = await mount(four, 720, 'light', 'compact'); assert.deepEqual([r.items[0].pt, r.items[0].pb, r.items[0].pis], [4, 4, 12], T + 'compact tile padding is 4px block and 12px inline');
      assert.ok(Math.abs(Math.abs(r.items[1].l - r.items[0].l) - (r.items[0].w + 8)) < 1.5 && Math.abs(r.items[2].t - (r.items[0].t + r.items[0].h) - 8) < 1.5, T + 'compact gap between tiles is 8px');
      r = await mount(`h(P.PropertyList, { layout: 'stacked' }, h(I, { label: 'A' }, 'x'))`, 720); assert.equal(r.items[0].bw, 0, T + 'plain stacked keeps 1.2.0 (value boxed)');
      // odd tile
      r = await mount(four.replace(", h(I, { label: 'Status', status: { label: 'Open', tone: 'active', icon: 'check' } })", ''), 720);
      assert.ok(Math.abs(r.items[2].w - r.items[0].w) < 1 && Math.abs((dir === 'ltr' ? r.items[2].l - r.ll : r.lr - r.items[2].r)) < 1, T + 'an odd last tile sits alone at the inline start, at half width');
      // narrow
      r = await mount(four, 400); assert.ok(r.items.every((x, i, all) => !i || x.t > all[i - 1].t + 10), T + 'a narrow list shows one tile per row');
      // own variant wins
      r = await mount(four.replace("h(P.PropertyList, null", "h(P.PropertyList, { variant: 'default' }"), 720); assert.ok(!/tiles/.test(r.cls), T + "a list's own variant wins over its group's: " + r.cls);
      // explicit layout wins and warns
      warnings.length = 0; r = await mount(four.replace("h(P.PropertyList, null", "h(P.PropertyList, { layout: 'columns' }"), 720);
      assert.ok(/plx-property-list--columns/.test(r.cls) && !/tiles/.test(r.cls), T + 'an explicit layout="columns" wins: ' + r.cls); assert.ok(warnings.length >= 1 || dir === 'rtl', T + 'a dev warning says the layout and the variation disagree');
      // span full
      r = await mount(four.replace("h(I, { label: 'Opened' }", "h(I, { label: 'Opened', span: 'full' }"), 720);
      assert.ok(r.items[2].full && Math.abs(r.items[2].w - r.lw) < 1 && Math.abs(r.items[0].t - r.items[1].t) < 1 && r.items[1].w < r.lw * 0.6, T + 'span="full" takes the row; the others stay two per row');
      r = await mount(`h(P.PropertyList, null, h(I, { label: 'A', span: 'full' }, 'x'), h(I, { label: 'B' }, 'y'))`, 720);
      assert.ok(r.items[1].t > r.items[0].t, T + 'outside tiles span changes nothing (one per row)');
      // no variant: unchanged
      r = await mount(`h(P.PropertyList, null, h(I, { label: 'A' }, 'x'))`, 720); assert.ok(/--columns/.test(r.cls) && !/tiles/.test(r.cls), T + 'default is columns');
      r = await mount(`h(P.PropertyList, { layout: 'stacked' }, h(I, { label: 'A' }, 'x'))`, 720); assert.ok(!/tiles/.test(r.cls) && r.items[0].vbw >= 1 && r.items[0].bw === 0, T + '1.2.0 stacked still boxes only the value');
      // groups
      r = await mount(`h('div', null, h(P.PropertyGroup, { heading: 'One', variant: 'tiles' }, h(P.PropertyList, null, h(I, { label: 'A' }, 'x'))), h(P.PropertyGroup, { heading: 'Two', variant: 'tiles' }, h(P.PropertyList, null, h(I, { label: 'B' }, 'y'))))`, 720);
      assert.ok(Math.abs(r.gaps - 40) <= 1, T + 'two groups 40px apart (' + r.gaps + ')'); assert.notEqual(r.hc, r.ink, T + 'the group heading is not the plain ink');
      // dark contrast
      r = await mount(four, 720, 'dark');
      const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number).slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
      const cr = (x, y) => { const p = lum(x), q = lum(y); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05); };
      assert.ok(cr(r.items[0].lc, r.items[0].bg) >= 4.5 && cr(r.items[0].vc, r.items[0].bg) >= 4.5, T + 'dark: label and value are 4.5:1 or more on the tile');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('PROPERTY_TILES_1043_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
