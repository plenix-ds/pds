/* Plenix tests · #1266 (perf on-demand 2/4, ADR 0052): the 15 page templates are one module per page, and nothing a person sees changed.
   Summary: every page template still works from the one public entry and draws what it drew: its title (or its own content), the rows of its grid, its form, its panes, its error words,
     in left to right and right to left, without a script error or a console warning.
   Checks: AC-1 each page draws its title or content; AC-2 the grid pages draw their rows; AC-3 no error or warning. The loaded bytes per entry are the budget in tools/checks/perf-budget.json (node tools/checks/perf-budget.mjs).
   Proof first: the 15 entries load 299 KB each on main (limit 250,000 B); this test is the behaviour guard for the split.
   Usage: node tests/templates-modules-1266.test.js   → TEMPLATES_MODULES_1266_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9827, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix, noop = () => {}, out = {};
        const rows = [{ id: 1, name: 'Alpha record' }, { id: 2, name: 'Beta record' }], columns = [{ field: 'name', title: 'Name' }];
        const items = [{ id: 'a', title: 'Card one', description: 'First' }, { id: 'b', title: 'Card two', description: 'Second' }];
        const cases = {
          ListingPage: [h(P.ListingPage, { title: 'T-Listing', rows, columns }), ['T-Listing', 'Alpha record']],
          ContentManagementPage: [h(P.ContentManagementPage, { title: 'T-Content', items }), ['T-Content', 'Card one']],
          LandingPage: [h(P.LandingPage, { title: 'T-Landing', items }), ['T-Landing', 'Card two']],
          HomePage: [h(P.HomePage, { title: 'T-Home', items }), ['T-Home', 'Card one']],
          CreatePage: [h(P.CreatePage, { title: 'T-Create', onSubmit: noop, fields: () => h('p', null, 'F-create') }), ['T-Create', 'F-create']],
          EditPage: [h(P.EditPage, { title: 'T-Edit', onSubmit: noop, fields: () => h('p', null, 'F-edit') }), ['T-Edit', 'F-edit']],
          MasterDetailPage: [h(P.MasterDetailPage, { pane: h('p', null, 'P-master'), paneTitle: 'T-Master' }, h('p', null, 'C-master')), ['T-Master', 'C-master']],
          SplitWorkspace: [h(P.SplitWorkspace, { rows, columns, paneTitle: 'T-Split', title: 'T-Detail' }, h('p', null, 'C-split')), ['Alpha record', 'C-split']],
          SinglePaneWorkspace: [h(P.SinglePaneWorkspace, { title: 'T-Single', toolbar: h('p', null, 'B-single') }, h('p', null, 'C-single')), ['T-Single', 'B-single', 'C-single']],
          FullScreenWorkspace: [h(P.FullScreenWorkspace, { tools: h('p', null, 'Tools-x'), inspector: h('p', null, 'Insp-x') }, h('p', null, 'C-full')), ['Tools-x', 'Insp-x', 'C-full']],
          FullScreenExperience: [h(P.FullScreenExperience, { title: 'T-Exp' }, h('p', null, 'C-exp')), ['T-Exp', 'C-exp']],
          DetailPage: [h(P.DetailPage, { title: 'T-Detail', sections: [{ id: 's1', title: 'Section one', content: 'Body one' }] }), ['T-Detail', 'Section one', 'Body one']],
          SearchResultsPage: [h(P.SearchResultsPage, { title: 'T-Search', query: 'a', onQueryChange: noop, rows, columns }), ['T-Search', 'Alpha record']],
          AuthenticationPage: [h(P.AuthenticationPage, { auth: { title: 'T-Auth' }, form: h('p', null, 'F-auth') }), ['F-auth']],
          ErrorPage: [h(P.ErrorPage, { error: 403, homeHref: '#' }), ['Access denied']],
        };
        for (const [name, [el, words]] of Object.entries(cases)) {
          const c = document.createElement('div'); c.id = 'c-' + name; document.body.appendChild(c);
          try { const root = ReactDOM.createRoot(c); root.render(h(P.ToastProvider || React.Fragment, null, el)); await new Promise((r) => setTimeout(r, 600)); const text = c.textContent; out[name] = words.filter((w) => !text.includes(w)); } catch (e) { out[name] = ['threw: ' + e.message]; }
        }
        return out;
      }, dir);
      for (const [name, missing] of Object.entries(r)) assert.deepEqual(missing, [], T + 'AC-1/2: ' + name + ' draws what it drew; missing ' + JSON.stringify(missing));
      assert.equal(Object.keys(r).length, 15, T + 'all 15 templates');
      await page.close();
    }
    assert.deepEqual(errors, [], 'AC-3: no script error or console warning: ' + JSON.stringify(errors.slice(0, 5)));
    console.log('TEMPLATES_MODULES_1266_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
