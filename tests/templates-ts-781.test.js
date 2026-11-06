/* Plenix tests · TypeScript wave 4, templates (issue 781): the templates draw the same after the rename. A smoke probe mounts a sample of the page templates (ListingPage, LandingPage, ErrorPage, DetailPage, SearchResultsPage, ContentManagementPage, SplitWorkspace) and the commerce ones (ProductListing, Cart, OrderConfirmation, OrderManagement, OrderSummary), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/templates-ts-781.base.txt). No script errors or dev warnings. Usage: node tests/templates-ts-781.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
// a known warning of main, not of this change (SearchInput leaks onOpenChange to its input): filtered, see the follow-up issue
const BASE = path.join(__dirname, 'fixtures', 'templates-ts-781.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9857, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time|Unknown event handler property .*onOpenChange/s.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      listing: "h(Plenix.ListingPage, { title: 'Projects', label: 'Projects', rows: [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }], columns: [{ field: 'name', title: 'Name' }] })",
      landing: "h(Plenix.LandingPage, { title: 'Welcome', items: [{ id: 1, title: 'Docs', description: 'Read', href: '#d' }] })",
      error404: "h(Plenix.ErrorPage, { error: 404, homeHref: '#home' })",
      error500: "h(Plenix.ErrorPage, { error: 500, onRetry() {} })",
      detail: "h(Plenix.DetailPage, { title: 'Case 12', sections: [{ id: 's', title: 'Facts', content: 'Open' }] })",
      search: "h(Plenix.SearchResultsPage, { title: 'Search', query: 'cat', rows: [{ id: 'a', name: 'Cat' }], columns: [{ field: 'name', title: 'Name' }], onQueryChange() {} })",
      content: "h(Plenix.ContentManagementPage, { title: 'Library', items: [{ id: 1, title: 'Guide', href: '#g' }] })",
      split: "h(Plenix.SplitWorkspace, { title: 'Inbox', pane: h('p', null, 'Pane'), rows: [{ id: 'a', name: 'A' }], columns: [{ field: 'name', title: 'Name' }] })",
      productListing: "h(Plenix.ProductListing, { title: 'Shop', products: [{ id: 1, title: 'Lamp', price: 20, currency: 'USD' }, { id: 2, title: 'Desk', price: 120, currency: 'USD' }] })",
      cart: "h(Plenix.Cart, { items: [{ id: 1, name: 'Lamp', price: 20, quantity: 2 }], currency: 'USD' })",
      confirmation: "h(Plenix.OrderConfirmation, { order: { id: 'A100', items: [{ id: 1, name: 'Lamp', price: 20, quantity: 1 }], currency: 'USD' } })",
      orders: "h(Plenix.OrderManagement, { orders: [{ id: 'A100', date: '2026-10-01', status: 'shipped', total: 20, currency: 'USD' }] })",
      summary: "h(Plenix.OrderSummary, { items: [{ id: 1, name: 'Lamp', price: 20, quantity: 2 }], currency: 'USD', shipping: 5 })",
    };
    const lines = [];
    for (const [name, expr] of Object.entries(cases)) {
      await page.evaluate(async (expr) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', 'ltr'); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(Plenix.ToastProvider || React.Fragment, null, h('div', { style: { width: 800 } }, eval(expr))));
        await new Promise((r) => setTimeout(r, 900));
      }, expr);
      const sig = await page.evaluate(() => {
        const q = (s) => document.querySelectorAll(s).length;
        const text = document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 300);
        const names = [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).filter(Boolean).slice(0, 12).join('|');
        return { text, buttons: q('button'), inputs: q('input,textarea,select'), links: q('a[href]'), roles: [...new Set([...document.querySelectorAll('[role]')].map((e) => e.getAttribute('role')))].sort().join(','), names };
      });
      lines.push(name + ' ' + JSON.stringify(sig));
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    const out = lines.join('\n') + '\n';
    if (process.argv.includes('--print')) { fs.writeFileSync(BASE, out); console.log('written', BASE); }
    else assert.equal(out, fs.readFileSync(BASE, 'utf8'), 'what the patterns draw is unchanged');
    console.log('templates-ts-781: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
