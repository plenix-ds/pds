/* Plenix tests · TypeScript wave 3, batch B (issue 753): ten patterns draw the same after the rename. A smoke probe mounts each (Offboarding, Onboarding, PeopleGroup, PermissionSummary,
   PermissionsEditor, PresenceBar, ProductCard, PromptHistory, PropertyList, Publish), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-b.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-b.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-b.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9853, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      offboarding: "h(Plenix.Offboarding, { open: true, accountName: 'Acme', onConfirm() {}, onClose() {} })",
      onboarding: "h(Plenix.Onboarding, { title: 'Welcome', tasks: [{ id: 't1', label: 'Invite your team' }, { id: 't2', label: 'Add a project' }], completed: ['t1'], onChange() {}, children: h('p', null, 'Hello') })",
      peopleTeam: "h(Plenix.PeopleGroup, { name: 'Design', kind: 'team', description: 'Design and print', count: 3, members: [{ id: 1, name: 'Ann' }, { id: 2, name: 'Bo' }, { id: 3, name: 'Cy' }], onShowMembers() {} })",
      peopleGroup: "h(Plenix.PeopleGroup, { name: 'Editors', kind: 'group', source: 'Synced from directory', members: [{ id: 1, name: 'Ann' }], onShowMembers() {} })",
      permissionList: "h(Plenix.PermissionSummary, { access: 'Anyone with the link can view', detail: 'From the Marketing folder', can: ['View', 'Comment'], cannot: ['Share', 'Delete'], onManage() {} })",
      permissionCompact: "h(Plenix.PermissionSummary, { variant: 'compact', access: 'Only you', can: ['View'], cannot: ['Share'], manageHref: '#access' })",
      permissionsEditor: "h(Plenix.PermissionsEditor, { subjects: [{ id: 'r1', label: 'Editors' }, { id: 'r2', label: 'Viewers', locked: true }], capabilities: [{ id: 'c1', label: 'Edit' }, { id: 'c2', label: 'Comment' }], value: { r1: ['c1', 'c2'], r2: ['c2'] }, onChange() {}, onSave() {} })",
      presenceBar: "h(Plenix.PresenceBar, { mode: 'editors', people: [{ id: 1, name: 'Ann', role: 'editor' }, { id: 2, name: 'Bo', role: 'viewer' }], max: 3, onPerson() {} })",
      productGrid: "h(Plenix.ProductCard, { title: 'Desk lamp', href: '#lamp', price: 40, compareAtPrice: 60, currency: 'USD', rating: 4.5, reviewCount: 12, meta: 'Lights', onAddToCart() {} })",
      productListOut: "h(Plenix.ProductCard, { title: 'Chair', layout: 'list', price: 120, outOfStock: true, onOpen() {} })",
      promptHistory: "h(Plenix.PromptHistory, { items: [{ id: 1, prompt: 'Summarize the report', createdAt: '2026-11-01T10:00:00Z' }, { id: 2, prompt: 'Translate to Arabic' }], onSelect() {} })",
      propertyList: "h(Plenix.PropertyList, { layout: 'stacked' }, h(Plenix.PropertyList.Item, { label: 'Size', data: true }, '2.4 MB'), h(Plenix.PropertyList.Item, { label: 'Owner', description: 'Who made it' }, 'Ann'))",
      publishDraft: "h(Plenix.Publish, { name: 'Report', status: 'draft', audience: 'everyone in the library', onPublish() {}, onSchedule() {} })",
      publishScheduled: "h(Plenix.Publish, { name: 'Report', status: 'scheduled', scheduledFor: '2026-12-01T09:00', by: 'Ann', onCancelSchedule() {} })",
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
    console.log('patterns-ts-753-b: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
