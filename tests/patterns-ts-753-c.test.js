/* Plenix tests · TypeScript wave 3, batch C (issue 753): ten patterns draw the same after the rename. A smoke probe mounts each (Offboarding, Onboarding, PeopleGroup, PermissionSummary,
   PermissionsEditor, PresenceBar, ProductCard, PromptHistory, PropertyList, Publish), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-c.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-c.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-c.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9854, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      queryBuilder: "h(Plenix.QueryBuilder, { fields: [{ value: 'status', label: 'Status', kind: 'select', options: ['open', 'closed'] }, { value: 'name', label: 'Name', kind: 'text' }], value: { join: 'and', items: [{ id: 'a', field: 'status', op: 'is', value: 'open' }, { group: true, id: 'g', join: 'or', items: [{ id: 'b', field: 'name', op: 'contains', value: 'x' }] }] }, matches: 12, onChange() {} })",
      quickList: "h(Plenix.QuickFilter, { kind: 'list', label: 'Category', noun: 'category', options: [{ value: 'a', label: 'Alpha', count: 3 }, 'Beta'], value: ['a'], onChange() {}, inline: true })",
      quickSingle: "h(Plenix.QuickFilter, { kind: 'single', label: 'Type', options: ['One', 'Two'], value: ['One'], onChange() {}, inline: true })",
      quickDate: "h(Plenix.QuickFilter, { kind: 'date', label: 'Date', value: { preset: '7' }, onChange() {}, inline: true })",
      recommendation: "h(Plenix.Recommendation, { items: [{ id: 1, title: 'Try Atlas', description: 'A map', reason: 'You use maps', href: '#a' }, { id: 2, title: 'Try Beam', description: 'A tool' }], variant: 'reason', onSelect() {} })",
      recordPage: "h(Plenix.RecordPage, { header: h(Plenix.RecordPage.Header, { title: 'Case 10234', description: 'Open', meta: 'Updated today', actions: h(Plenix.Button, null, 'Edit') }), aside: h('div', null, 'Facts'), children: h('p', null, 'Body') })",
      relatedAssets: "h(Plenix.RelatedAssets, { label: 'Related', items: [{ id: 1, src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'A', title: 'Asset A', href: '#a' }, { id: 2, src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'B', title: 'Asset B' }], onOpen() {} })",
      renditionTable: "h(Plenix.RenditionList, { variant: 'table', items: [{ id: 1, name: 'Web', format: 'JPG', size: 120000, href: '#w' }, { id: 2, name: 'Print', format: 'TIFF', size: 5000000, onDownload() {} }] })",
      renditionMenu: "h(Plenix.RenditionList, { variant: 'menu', items: [{ id: 1, name: 'Web', format: 'JPG', size: 120000, href: '#w' }] })",
      resourceList: "h(Plenix.ResourceList, { label: 'Projects', noun: 'project', selectable: true, showCount: true, items: [{ id: 1, name: 'Alpha', description: 'First', meta: '2d', href: '#a', group: 'Active' }, { id: 2, name: 'Beta', onOpen() {}, group: 'Done', disabled: true }] })",
      retryNotice: "h(function T() { const r = Plenix.useRetry(() => Promise.reject(new Error('no')), { attempts: 2 }); return h(Plenix.RetryNotice, { retry: r, title: 'Could not load', showCount: true }, 'The server did not answer.'); })",
      workflowStatus: "h('div', null, h(Plenix.WorkflowStatus, { status: 'approved' }), h(Plenix.WorkflowStatus, { status: 'changes-requested', size: 'sm' }))",
      reviewFlow: "h(Plenix.ReviewFlow, { title: 'Quarterly report', detail: 'Submitted by Maya', reviewers: [{ id: 1, name: 'Ann', decision: 'approved' }, { id: 2, name: 'Bo' }], history: [{ id: 'h1', name: 'Ann', decision: 'approved', comment: 'Looks fine', time: 'today' }], onDecision() {} })",
      reviewQueue: "h(Plenix.ReviewQueue, { label: 'Waiting for review', items: [{ id: 1, name: 'Doc A', type: 'Report', submittedBy: 'Ann', submitted: '2026-11-01', status: 'in-review' }], onDecision() {} })",
      roleManager: "h(Plenix.RoleManager, { roles: [{ id: 'r1', name: 'Owner', builtIn: 'owner', permissions: ['p1'], members: ['u1'], required: true }, { id: 'r2', name: 'Support', permissions: [], members: [] }], permissions: [{ id: 'p1', label: 'Edit', group: 'Content' }], people: [{ value: 'u1', label: 'Ann' }], onChange() {} })",
      saveAs: "h(Plenix.SaveAs, { initialName: 'Report', locations: [{ id: 'root', label: 'My files', children: [{ id: 'docs', label: 'Documents' }] }], formats: [{ value: 'pdf', label: 'PDF' }], initialFormat: 'pdf', onSave() {}, onCancel() {} })",
      searchWorkspace: "h(Plenix.SearchWorkspace, { query: 'cat', count: 3, noun: 'asset', filters: [{ id: 'type', label: 'Type', options: [{ value: 'a', label: 'Image' }], value: 'a' }], onSave() {}, children: h('p', null, 'Results') })",
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
    console.log('patterns-ts-753-c: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
