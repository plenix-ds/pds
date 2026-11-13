/* Plenix tests · #1240 (ADR 0056, D-0166; design docs/pds1/slices/1240/design.md): MetricCard type="person" layout="tile", the compact person card, and WidgetGrid itemSize="sm".
   Summary: the compact card shows a 48px Avatar beside the name (up to 2 lines, a Tooltip while cut) and the role (1 line), an inset divider, then the value at the inline end:
     the number in Reddit Mono at 20px, the unit a small uppercase DM Sans label. It is about 121px tall at 280px wide. An empty card shows "–"; a word value ("Hidden") takes the unit's
     style and no number; no photo gives initials. The default person card (no layout) is unchanged. A WidgetGrid with itemSize="sm" holds 5 columns where "md" holds 3, and at most 6.
   Checks (browser, LTR and RTL, light and dark): AC-1 the Avatar is 48px beside the name; AC-2 the card is at most 126px tall at 280px (125 by the design's numbers); AC-3 the number is Reddit Mono 20px and the unit DM Sans uppercase;
     AC-4 the value row's inline-end edge is the content's inline-end edge; AC-5 a long name clamps to 2 lines with a Tooltip while cut; AC-6 empty shows "–" with no unit;
     AC-7 a word value has no Reddit Mono; AC-8 no src shows initials; AC-9 name, role and unit contrast is at least 4.5:1; AC-10 the default person card is unchanged;
     AC-11 itemSize="sm" holds 5 columns at 1100px and 6 at 1600px, "md" 3 at 1100px, and columns={2} still wins.
   Proof first: before the change a person tile has no photo, no divider and ignores the person; itemSize is not a prop.
   Usage: node tests/metric-card-person-tile-1240.test.js   → METRIC_CARD_PERSON_TILE_1240_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9819, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (expr, width) => page.evaluate(async (dir, mode, expr, width) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        document.querySelector('main').replaceChildren(Object.assign(document.createElement('div'), { id: 'c', style: 'inline-size:' + (width || 280) + 'px' }));
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 900));
      }, dir, mode, expr, width);
      const person = { name: 'Fr. Youhanna Abdelmessih', role: 'Council member' };
      const card = (extra) => "h(P.MetricCard, Object.assign({ type: 'person', layout: 'tile', person: " + JSON.stringify(person) + ", value: '5', unit: 'active' }, " + JSON.stringify(extra || {}) + "))";
      const geo = () => page.evaluate(() => {
        const q = (s) => document.querySelector('#c ' + s), r = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height }; }, cs = (e) => getComputedStyle(e);
        const root = q('.plx-metric-card'), av = q('.plx-avatar'), title = q('.plx-metric-card__person-name'), role = q('.plx-metric-card__person-role'), val = q('.plx-metric-card__person-number'),
          unit = q('.plx-metric-card__person-unit'), row = q('.plx-metric-card__person-value'), first = q('.plx-metric-card__person-row'), div = q('.plx-metric-card__person-divider');
        const rs = root ? cs(root) : null;
        return { root: root && r(root), av: av && r(av), title: title && r(title), role: role && r(role), val: val && { f: cs(val).fontFamily.split(',')[0].replace(/["']/g, ''), s: cs(val).fontSize, w: cs(val).fontWeight, text: val.textContent.trim() },
          unit: unit && { f: cs(unit).fontFamily.split(',')[0].replace(/["']/g, ''), t: cs(unit).textTransform, text: unit.textContent.trim(), color: cs(unit).color }, row: row && r(row), first: first && r(first), divider: !!div,
          padEnd: rs && parseFloat(rs.paddingInlineEnd), border: rs && parseFloat(rs.borderInlineEndWidth), titleColor: title && cs(title).color, roleColor: role && cs(role).color, bg: root && cs(root).backgroundColor, header: !!q('.plx-metric-card__header'), initials: av && av.textContent.trim(), hasImg: av && !!av.querySelector('img'),
          titleLines: title && Math.round(r(title).h / parseFloat(cs(title).lineHeight)) };
      });
      // AC-1, AC-2, AC-3, AC-4
      await mount(card()); let g = await geo();
      assert.ok(g.root && g.av && g.val, T + 'the person tile draws a photo and a value: ' + JSON.stringify(g.root));
      assert.ok(Math.abs(g.av.w - 48) < 1 && Math.abs(g.av.h - 48) < 1, T + 'AC-1: the Avatar is 48px: ' + g.av.w);
      assert.ok(g.av.t <= g.title.t + 1 && g.title.t < g.av.b, T + 'AC-1: the name is in the Avatar\'s row'); assert.ok(dir === 'rtl' ? g.title.r < g.av.l + 1 : g.title.l > g.av.r - 1, T + 'AC-1: the name is beside the Avatar');
      // the design's own numbers add up to 125 (border 2, padding 12 + 12, row 48, divider 12 + 1 + 12, value row 26): its 'about 121' / 124 was an estimate, and the card was a row (not this column) until issue 1240's regression fix
      assert.ok(g.root.h <= 126, T + 'AC-2: the card is at most 126px tall at 280px wide (125 by the design numbers): ' + g.root.h); assert.ok(g.divider, T + 'an inset divider is drawn'); assert.equal(g.header, false, T + 'no separate header');
      assert.equal(g.val.f, 'Reddit Mono', T + 'AC-3: the number is Reddit Mono'); assert.equal(g.val.s, '20px', T + 'AC-3: 20px'); assert.ok(+g.val.w >= 700, T + 'AC-3: bold');
      assert.equal(g.unit.f, 'DM Sans', T + 'AC-3: the unit is DM Sans'); assert.equal(g.unit.t, 'uppercase', T + 'AC-3: the unit is uppercase'); assert.equal(g.unit.text, 'active');
      const content = dir === 'rtl' ? g.root.l + g.border + g.padEnd : g.root.r - g.border - g.padEnd;
      assert.ok(Math.abs((dir === 'rtl' ? g.row.l : g.row.r) - content) < 2, T + 'AC-4: the value row ends at the content\'s inline end (' + (dir === 'rtl' ? g.row.l : g.row.r) + ' vs ' + content + ')');
      // AC-9: contrast
      const rgb = (css) => css.match(/[\d.]+/g).slice(0, 3).map(Number), bg = rgb(g.bg);
      for (const [what, c] of [['name', g.titleColor], ['role', g.roleColor], ['unit', g.unit.color]]) assert.ok(ratio(rgb(c), bg) >= 4.5, T + 'AC-9: the ' + what + ' contrast is ' + ratio(rgb(c), bg).toFixed(2));
      // AC-5: a long name clamps to 2 lines and shows a Tooltip while cut
      await mount("h(P.MetricCard, { type: 'person', layout: 'tile', person: { name: 'Fr. Youhanna Abdelmessih Ghobrial Hanna-Boutros of the Diocese of Los Angeles and the Southwest', role: 'Council member' }, value: '5', unit: 'active' })"); g = await geo();
      assert.equal(g.titleLines, 2, T + 'AC-5: a long name clamps to 2 lines (' + g.titleLines + ')'); assert.ok(g.root.h <= 140, T + 'AC-5: the card height holds, two lines of name (138 by the design numbers) (' + g.root.h + ')');
      const tb = await page.evaluate(() => { const r = document.querySelector('#c .plx-metric-card__person-name').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await page.mouse.move(2, 2); await wait(200); await page.mouse.move(tb.x, tb.y); await wait(1200);
      const tip = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => getComputedStyle(t).display !== 'none' && getComputedStyle(t).visibility !== 'hidden').map((t) => t.textContent.trim()));
      assert.ok(tip.length === 1 && /Southwest/.test(tip[0]), T + 'AC-5: the full name shows in a Tooltip while cut: ' + JSON.stringify(tip));
      // AC-6, AC-7, AC-8
      await mount(card({ state: 'empty' })); g = await geo(); assert.equal(g.val.text, '–', T + 'AC-6: empty shows "–"'); assert.equal(g.unit, null, T + 'AC-6: and no unit');
      await mount(card({ value: 'Hidden', unit: undefined })); g = await geo();
      assert.ok(!g.val || g.val.f !== 'Reddit Mono', T + 'AC-7: a word value is not in Reddit Mono'); assert.ok(await page.evaluate(() => /Hidden/.test(document.querySelector('#c .plx-metric-card__person-value').textContent)), T + 'AC-7: the word shows');
      await mount(card()); g = await geo(); assert.ok(/^FY/.test(g.initials) || g.initials.length > 0, T + 'AC-8: no photo shows initials: ' + g.initials); assert.equal(g.hasImg, false);
      // AC-10: the default person card is unchanged
      await mount("h(P.MetricCard, { type: 'person', person: { name: 'Maya Chen', role: 'Designer' }, value: '12', unit: 'open tasks' })"); g = await geo();
      assert.ok(g.header && g.root.h > 140, T + 'AC-10: the default person card keeps its header and size (' + g.root.h + 'px)'); assert.ok(g.av && Math.abs(g.av.w - 64) < 1, T + 'AC-10: with its 64px Avatar');
      // AC-11: WidgetGrid itemSize
      const grid = (props, items) => "h(P.WidgetGrid, Object.assign({ label: 'People', items: Array.from({ length: " + items + " }, (_, i) => ({ id: i })), renderItem: (it) => h('div', { style: { minBlockSize: 40 } }, 'x') }, " + JSON.stringify(props) + "))";
      const cols = () => page.evaluate(() => getComputedStyle(document.querySelector('#c .plx-widget-grid')).gridTemplateColumns.split(' ').length);
      await mount(grid({}, 8), 1100); const md = await cols(); await mount(grid({ itemSize: 'md' }, 8), 1100); const md2 = await cols();
      await mount(grid({ itemSize: 'sm' }, 8), 1100); const sm1100 = await cols(); await mount(grid({ itemSize: 'sm' }, 8), 1600); const sm1600 = await cols(); await mount(grid({ itemSize: 'sm', columns: 2 }, 8), 1600); const two = await cols();
      assert.equal(md, 3, T + 'AC-11: the default holds 3 columns at 1100px (' + md + ')'); assert.equal(md2, md, T + 'AC-11: "md" is the default'); assert.equal(sm1100, 5, T + 'AC-11: "sm" holds 5 at 1100px (' + sm1100 + ')');
      assert.equal(sm1600, 6, T + 'AC-11: and at most 6 at 1600px (' + sm1600 + ')'); assert.equal(two, 2, T + 'AC-11: columns={2} still wins');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('METRIC_CARD_PERSON_TILE_1240_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
