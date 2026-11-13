/* Plenix tests · #1266 (perf on-demand 2/4, ADR 0052): the 15 page templates are one module per page, and nothing a person sees changed.
   Summary: every page template still works from the one public entry: ListingPage, ContentManagementPage, LandingPage, HomePage, CreatePage, EditPage, MasterDetailPage, SplitWorkspace,
     SinglePaneWorkspace, FullScreenWorkspace, FullScreenExperience, DetailPage, SearchResultsPage, AuthenticationPage and ErrorPage render with their data, left to right and right to left.
   Checks: AC-1 each page draws its content; AC-2 each page has its own module and Templates.tsx only re-exports (the source check, no browser); AC-3 no script error or console warning.
   Proof first: the byte budgets of the 15 entries in tools/checks/perf-budget.json fail on main's build (each loads the whole template set); this test is the behaviour guard for the split.
   Usage: node tests/page-templates-modules-1266.test.js   → PAGE_TEMPLATES_MODULES_1266_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const { serve, launch } = require('./lib');
require('./limit.js');
const NAMES = ['ListingPage', 'ContentManagementPage', 'LandingPage', 'HomePage', 'CreatePage', 'EditPage', 'MasterDetailPage', 'SplitWorkspace', 'SinglePaneWorkspace', 'FullScreenWorkspace', 'FullScreenExperience', 'DetailPage', 'SearchResultsPage', 'AuthenticationPage', 'ErrorPage'];
const root = path.join(__dirname, '..'), dir = path.join(root, 'platform/templates/templates');
// AC-2: one module per page; the doc file re-exports the same names and declares nothing
const doc = fs.readFileSync(path.join(dir, 'Templates.tsx'), 'utf8');
for (const n of NAMES) {
  assert.ok(fs.existsSync(path.join(dir, n + '.tsx')), 'AC-2: ' + n + ' has its own module');
  assert.ok(new RegExp('export \\{ ' + n + ' \\} from \'\\./' + n + '\\.tsx\'').test(doc), 'AC-2: Templates.tsx re-exports ' + n);
  for (const f of ['platform/index.ts', 'platform/exports/w15A.ts'])
    assert.ok(fs.readFileSync(path.join(root, f), 'utf8').includes("export { " + n + " } from '" + (f.endsWith('index.ts') ? './' : '../') + "templates/templates/" + n + ".tsx'"), 'AC-2: ' + f + ' exports ' + n + ' from its own module');
}
// AC-4: FrameProps and FormPageProps are published type names (since 0.93.1). react-types.js publishes only what platform/index.ts re-exports, so each must stay exported from a page module it re-exports
for (const [type, mod, from] of [['FrameProps', 'ListingPage', 'shared'], ['FormPageProps', 'CreatePage', 'FormPage']])
  assert.ok(fs.readFileSync(path.join(dir, mod + '.tsx'), 'utf8').includes("export type { " + type + " } from './" + from + ".tsx'"), 'AC-4: ' + mod + '.tsx keeps ' + type + ' public');
assert.ok(!/^(export )?(function|const) /m.test(doc.replace(/\/\*[\s\S]*?\*\//, '')), 'AC-2: Templates.tsx declares nothing');
(async () => {
  const PORT = +process.env.TEST_PORT || 9827, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const d of ['ltr', 'rtl']) {
      const T = d + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (d, names) => {
        document.documentElement.setAttribute('dir', d);
        const h = React.createElement, P = Plenix, noop = () => {}, out = {};
        const rows = [{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }], columns = [{ field: 'name', title: 'Name', kind: 'name' }], grid = { index: 'id' };
        const items = [{ id: 'a', title: 'Reports', description: 'Monthly reports' }];
        const sections = [{ id: 's1', title: 'Overview', content: 'Overview text' }];
        const cases = {
          ListingPage: h(P.ListingPage, { title: 'Records', rows, columns, grid, mainId: 'm-listing' }),
          ContentManagementPage: h(P.ContentManagementPage, { title: 'Content', items, mainId: 'm-cm' }),
          LandingPage: h(P.LandingPage, { title: 'Welcome', items, mainId: 'm-landing' }),
          HomePage: h(P.HomePage, { title: 'Home', items, mainId: 'm-home' }),
          CreatePage: h(P.CreatePage, { title: 'New record', onSubmit: noop, onCancel: noop, fields: () => h('p', null, 'Create fields'), mainId: 'm-create' }),
          EditPage: h(P.EditPage, { title: 'Edit record', initialValue: {}, onSubmit: noop, onCancel: noop, fields: () => h('p', null, 'Edit fields'), mainId: 'm-edit' }),
          MasterDetailPage: h(P.MasterDetailPage, { paneTitle: 'Files', pane: 'List', detailOpen: true, mainId: 'm-md' }, h('p', null, 'Detail body')),
          SplitWorkspace: h(P.SplitWorkspace, { title: 'Item', paneTitle: 'Items', rows, columns, grid, mainId: 'm-split' }, h('p', null, 'Chosen item')),
          SinglePaneWorkspace: h(P.SinglePaneWorkspace, { title: 'Workspace', mainId: 'm-single' }, h('p', null, 'Single pane')),
          FullScreenWorkspace: h(P.FullScreenWorkspace, { tools: 'Tools', inspector: 'Inspector', mainId: 'm-fsw' }, h('p', null, 'Canvas')),
          FullScreenExperience: h(P.FullScreenExperience, { title: 'Experience', mainId: 'm-fse' }, h('p', null, 'Experience body')),
          DetailPage: h(P.DetailPage, { title: 'Record', sections, mainId: 'm-detail' }),
          SearchResultsPage: h(P.SearchResultsPage, { title: 'Search', query: 'a', onQueryChange: noop, rows, columns, mainId: 'm-search' }),
          AuthenticationPage: h(P.AuthenticationPage, { auth: { title: 'Sign in' }, mainId: 'm-auth' }, h('p', null, 'Sign in form')),
          ErrorPage: h(P.ErrorPage, { error: 404, homeHref: '#', mainId: 'm-error' }),
        };
        if (Object.keys(cases).join() !== names.join()) return { mismatch: Object.keys(cases) };
        for (const [name, el] of Object.entries(cases)) {
          const c = document.createElement('div'); c.id = 'c-' + name; document.body.appendChild(c);
          try { const root = ReactDOM.createRoot(c); root.render(h(P.ToastProvider || React.Fragment, null, el)); await new Promise((x) => setTimeout(x, 500)); out[name] = c.textContent.trim().length; } catch (e) { out[name] = 'threw: ' + e.message; }
        }
        return out;
      }, d, NAMES);
      assert.ok(!r.mismatch, T + 'the cases are the 15 pages');
      if (process.env.DEBUG_1266) console.log(JSON.stringify(errors.slice(0, 6)));
      const empty = Object.entries(r).filter(([, n]) => !(typeof n === 'number' && n > 0));
      assert.deepEqual(empty, [], T + 'AC-1: every page draws its content: ' + JSON.stringify(r));
      await page.close();
    }
    assert.deepEqual(errors, [], 'AC-3: no script error or console warning: ' + JSON.stringify(errors.slice(0, 5)));
    console.log('PAGE_TEMPLATES_MODULES_1266_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
