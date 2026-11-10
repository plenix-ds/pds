/* Plenix tests · dashboard chart cards (issue 1229, ADR 0054, design 1229 §7, D-0163): equal heights in a WidgetGrid row, and "Show the data" in a Dialog.
   Summary: in a 3-column WidgetGrid three Panels with charts of different heights end at the same height, with the Panel footers and the "Show the data" buttons on one bottom edge; the plot keeps its size height;
     a collapsed Panel keeps its own height; a nested Panel and fill={false} do not fill; "Show the data" is a button that opens a Dialog named for the chart title with the table, Escape closes it and focus returns;
     dataView="inline" keeps the Details. Left to right and right to left, light and dark.
   Proof first: before the change the cards end at different heights and the data opens inline in the card.
   Usage: node tests/chart-cards-1229.test.js   → CHART_CARDS_1229_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9992, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const [dir, theme] of [['ltr', 'light'], ['rtl', 'light'], ['ltr', 'dark']]) {
      const T = dir + '/' + theme + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 1200, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (opts) => page.evaluate(async (dir, theme, opts) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-theme', theme);
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        const cats = ['Jan', 'Feb', 'Mar'], series = [{ id: 'a', label: 'Uploads', values: [4, 8, 6] }];
        const chart = (title, size, extra) => h(P.BarChart, Object.assign({ title, size, categories: cats, series, orientation: 'vertical' }, opts.chart || {}, extra || {}));
        const items = [{ id: 1, title: 'Small' }, { id: 2, title: 'Tall' }, { id: 3, title: 'Medium' }];
        const body = { 1: chart('Small chart', 'sm'), 2: chart('Tall chart', 'lg'), 3: h(P.PieChart, Object.assign({ title: 'Medium chart', size: 'md', data: [{ id: 1, label: 'A', value: 3 }, { id: 2, label: 'B', value: 5 }] }, opts.chart || {})) };
        const panelProps = (it) => Object.assign({ title: it.title, footer: h('span', null, 'Footer ' + it.id) }, opts.panel || {}, it.id === 3 && opts.collapse ? { collapsible: true, defaultExpanded: false } : {});
        window.__root = ReactDOM.createRoot(c);
        window.__root.render(h(P.WidgetGrid, { label: 'Dash', columns: 3, items, renderItem: (it) => h(P.Panel, panelProps(it), opts.nested && it.id === 1 ? h(P.Panel, { title: 'Inner', footer: 'Inner footer' }, body[it.id]) : body[it.id]) }));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, theme, opts);
      const geom = () => page.evaluate(() => [...document.querySelectorAll('#c > .plx-widget-grid > .plx-widget-grid__item')].map((it) => {
        const p = it.querySelector('.plx-panel'), f = p.querySelector(':scope > .plx-panel__footer'), b = p.querySelector('.plx-chart__data-button, .plx-chart__data summary, .plx-chart__data'), plot = p.querySelector('.plx-chart__plot');
        const r = (e) => e ? e.getBoundingClientRect() : null;
        return { panel: r(p).height, footerBottom: f ? Math.round(r(f).bottom) : null, buttonBottom: b ? Math.round(r(b).bottom) : null, plot: plot ? Math.round(r(plot).height) : null };
      }));
      // equal heights, footers and buttons on one edge
      await mount({}); let g = await geom();
      assert.ok(g.every((x) => Math.abs(x.panel - g[0].panel) < 1), T + 'the three cards are one height: ' + g.map((x) => x.panel).join(', '));
      assert.equal(new Set(g.map((x) => x.footerBottom)).size, 1, T + 'the Panel footers share a bottom edge');
      assert.equal(new Set(g.map((x) => x.buttonBottom)).size, 1, T + 'the "Show the data" buttons share a bottom edge: ' + g.map((x) => x.buttonBottom).join(','));
      assert.deepEqual(g.map((x) => x.plot), [160, 320, 240], T + 'the plot keeps its size height');
      // opt out
      await mount({ panel: { fill: false } }); g = await geom();
      assert.ok(new Set(g.map((x) => Math.round(x.panel))).size > 1, T + 'fill={false} keeps natural heights');
      // collapsed keeps its own height
      await mount({ collapse: true }); g = await geom();
      assert.ok(g[2].panel < g[0].panel - 40, T + 'a collapsed Panel keeps its own height: ' + g.map((x) => x.panel).join(', '));
      // nested Panel does not fill
      await mount({ nested: true });
      assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-panel .plx-panel .plx-panel--fill').length), 0, T + 'a nested Panel does not fill');
      // the button opens a Dialog
      await mount({});
      const btn = await page.evaluate(() => { const b = document.querySelector('#c button.plx-chart__data-button'); return b ? { tag: b.tagName, popup: b.getAttribute('aria-haspopup'), text: b.textContent.trim() } : null; });
      assert.ok(btn && btn.popup === 'dialog' && /Show the data/.test(btn.text), T + 'Show the data is a button with aria-haspopup=dialog');
      assert.equal(await page.evaluate(() => document.querySelectorAll('#c .plx-chart table, #c .plx-chart [role=table], #c .plx-chart [role=grid]').length), 0, T + 'no table inside the card');
      await page.evaluate(() => document.querySelector('#c button.plx-chart__data-button').focus());
      await page.keyboard.press('Enter'); await wait(500);
      const dlg = await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d ? { name: (document.getElementById(d.getAttribute('aria-labelledby')) || {}).textContent, table: !!d.querySelector('table, [role=table], [role=grid], [role=treegrid]'), label: (() => { const g = d.querySelector('table, [role=table], [role=grid], [role=treegrid]'); if (!g) return null; const by = g.getAttribute('aria-labelledby'); return g.getAttribute('aria-label') || (by && (document.getElementById(by) || {}).textContent) || null; })() } : null; });
      assert.ok(dlg && dlg.name === 'Small chart', T + 'the Dialog is named for the chart title (' + JSON.stringify(dlg) + ')');
      assert.ok(dlg.table && /: data$/.test(dlg.label || ''), T + 'it holds the table named "{title}: data" ' + JSON.stringify(dlg));
      await page.keyboard.press('Escape'); await wait(500);
      assert.equal(await page.evaluate(() => !!document.querySelector('[role=dialog]')), false, T + 'Escape closes it');
      assert.equal(await page.evaluate(() => document.activeElement.classList.contains('plx-chart__data-button')), true, T + 'focus returns to the button');
      // inline opt-in
      await mount({ chart: { dataView: 'inline' } });
      assert.equal(await page.evaluate(() => [document.querySelectorAll('#c .plx-chart__data').length, document.querySelectorAll('#c button.plx-chart__data-button').length].join()), '3,0', T + 'dataView="inline" keeps the Details');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('CHART_CARDS_1229_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
