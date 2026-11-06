/* Plenix tests · TypeScript wave 3, batch E (issue 753): ten patterns draw the same after the rename. A smoke probe mounts each (Tour, TrialUpgrade, UploadManager, UserCard, VersionCompare, VersionHistory, ViewMenu, WidgetGrid, Wizard, WizardDialog), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-e.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-e.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-e.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9856, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      tour: "h(Plenix.Tour, { open: true, steps: [{ id: 's1', target: h(Plenix.Button, null, 'First'), title: 'Step one', content: 'Start here' }, { id: 's2', target: h(Plenix.Button, null, 'Second'), title: 'Step two', content: 'Then here' }] })",
      trialUpgrade: "h(Plenix.TrialUpgrade, { message: '14 days left', defaultOpen: true, plans: [{ id: 'pro', title: 'Pro', meta: '$10', values: { seats: '5' } }, { id: 'team', title: 'Team', meta: '$30', values: { seats: '20' } }], attributes: [{ key: 'seats', label: 'Seats' }], onUpgrade() {} })",
      trialClosed: "h(Plenix.TrialUpgrade, { message: '3 days left', plans: [{ id: 'pro', title: 'Pro' }], attributes: [], onUpgrade() {} })",
      uploadItems: "h(Plenix.UploadManager, { variant: 'panel', hint: 'PNG up to 5 MB', items: [{ id: 'a', name: 'a.png', size: 1000, status: 'done', progress: 100 }, { id: 'b', name: 'b.png', size: 2000, status: 'uploading', progress: 40 }, { id: 'c', name: 'c.png', size: 3000, status: 'error', error: 'Too big', retry: true }], onAdd() {}, onCancel() {}, onRetry() {}, onRemove() {}, onClose() {} })",
      uploadDialog: "h(Plenix.UploadManager, { variant: 'dialog', open: true, items: [], onAdd() {}, onClose() {} })",
      userCard: "h(Plenix.UserCard, { name: 'Ann Lee', secondary: 'Designer', role: 'Admin', presence: 'online', details: [{ icon: 'mail', label: 'ann@example.com' }, { label: '555-0100', data: true }], actions: h(Plenix.Button, null, 'Message'), href: '#ann' })",
      userCardCompact: "h(Plenix.UserCard, { variant: 'compact', name: 'Bo Chen', secondary: 'Engineer', presence: 'away', actions: h(Plenix.Button, null, 'Call') })",
      versionCompare: "h(Plenix.VersionCompare, { versions: [{ id: 'v1', label: 'Version 1', date: '2026-10-01', author: 'Ann', values: { title: 'Old' }, text: 'a\\nb\\nc' }, { id: 'v2', label: 'Version 2', date: '2026-10-02', author: 'Bo', values: { title: 'New' }, text: 'a\\nB\\nc' }], attributes: [{ key: 'title', label: 'Title' }] })",
      versionText: "h(Plenix.VersionCompare, { mode: 'text', versions: [{ id: 'v1', label: 'Version 1', text: 'one\\ntwo\\nthree' }, { id: 'v2', label: 'Version 2', text: 'one\\n2\\nthree' }] })",
      versionHistory: "h(Plenix.VersionHistory, { currentId: 'v2', variant: 'restore', versions: [{ id: 'v1', version: 'Version 1', date: 'Oct 1', author: 'Ann', description: 'First draft' }, { id: 'v2', version: 'Version 2', date: 'Oct 2', author: 'Bo', description: 'Edits' }], onPreview() {}, onRestore() {} })",
      viewMenu: "h(Plenix.ViewMenu, { value: { layout: 'list', size: 'm', height: 'medium' }, onChange() {}, editModes: ['inline', 'form'], onReset() {} })",
      widgetGrid: "h(Plenix.WidgetGrid, { label: 'Dashboard', columns: 2, items: [{ id: 1, title: 'Sales' }, { id: 2, title: 'Visits', span: '2' }], renderItem: (it) => h('div', null, it.title), onReorder() {} })",
      wizard: "h(Plenix.Wizard, { label: 'Setup', steps: [{ id: 'a', label: 'Account', content: h('p', null, 'Account step') }, { id: 'b', label: 'Plan', content: h('p', null, 'Plan step') }], summary: h('p', null, 'Review'), onComplete() {}, onCancel() {} })",
      wizardFree: "h(Plenix.Wizard, { label: 'Setup', navigation: 'free', steps: [{ id: 'a', label: 'Account', content: h('p', null, 'Account step') }, { id: 'b', label: 'Plan', content: h('p', null, 'Plan step') }], onComplete() {} })",
      wizardDialog: "h(Plenix.WizardDialog, { open: true, title: 'Set up', steps: [{ id: 'a', label: 'Account', content: h('p', null, 'Account step') }, { id: 'b', label: 'Plan', content: h('p', null, 'Plan step') }], onComplete() {}, onClose() {} })",
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
    console.log('patterns-ts-753-e: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
