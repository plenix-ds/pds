/* Plenix tests · TypeScript wave 3, batch A (issue 753): ten patterns draw the same after the rename. A smoke probe mounts each (FormFlow in a dialog, GroupPanel,
   HelpPanel and a selected article, ImageAnnotation, ImageUpload, ImportDialog, ImportWizard, MetadataEditor, NavPane, NotificationList), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-a.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-a.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-a.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9852, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      formFlowDialog: "h(Plenix.FormFlow, { surface: 'dialog', open: true, title: 'New case', initialValue: { name: '' }, onSubmit() {}, children: ({ value, setValue }) => h(Plenix.Input, { 'aria-label': 'Name', value: value.name, onChange: (e) => setValue({ name: e.target.value }) }) })",
      formFlowPage: "h(Plenix.FormFlow, { mode: 'edit', title: 'Edit case', initialValue: { name: 'A' }, onSubmit() {}, children: ({ value }) => h(Plenix.Input, { 'aria-label': 'Name', value: value.name, onChange() {} }) })",
      groupPanel: "h(Plenix.GroupPanel, { inline: true, fields: [{ value: 'status', label: 'Status', kind: 'select', options: ['open', 'closed'] }, { value: 'due', label: 'Due', kind: 'date' }], value: [{ field: 'status', dir: 'asc' }], onChange() {} })",
      helpPanel: "h(Plenix.HelpPanel, { open: true, title: 'Help', articles: [{ id: 'a', title: 'Getting started', summary: 'First steps', content: h('p', null, 'Body') }, { id: 'b', title: 'Billing', summary: 'Invoices', href: '#b' }] })",
      imageAnnotation: "h(Plenix.ImageAnnotation, { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'Floor plan', annotations: [{ id: 1, label: 'Crack', kind: 'pin', location: 'Left wall', x: 10, y: 20, comments: [{ id: 'c', text: 'Check this' }] }], selectedId: 1, onAdd() {}, onReply() {} })",
      imageUpload: "h(Plenix.ImageUpload, { multiple: true, max: 3, altText: true, description: 'PNG or JPG', label: 'Photos', value: [{ id: 'i1', url: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', name: 'a.gif', size: 1000, alt: 'A' }], onChange() {} })",
      importDialog: "h(Plenix.ImportDialog, { open: true, title: 'Import', accept: '.csv', onImport() {}, onClose() {} })",
      importWizard: "h(Plenix.ImportWizard, { open: true, title: 'Import people', fields: [{ id: 'name', label: 'Name', required: true }], onRead() { return { columns: [{ id: 'n', label: 'N' }], rows: [{ n: 'A' }] }; }, onImport() {}, onClose() {} })",
      metadataInline: "h(Plenix.MetadataEditor, { fields: [{ id: 'title', label: 'Title', type: 'text' }, { id: 'kind', label: 'Kind', type: 'select', options: [{ value: 'a', label: 'Alpha' }] }], values: { title: 'Doc', kind: 'a' }, onSave() {} })",
      metadataForm: "h(Plenix.MetadataEditor, { variant: 'form', fields: [{ id: 'title', label: 'Title', type: 'text', required: true }, { id: 'note', label: 'Note', type: 'textarea' }], values: { title: 'Doc', note: '' }, onSave() {} })",
      navPane: "h(Plenix.NavPane, { label: 'Main', title: 'Messages', actions: h(Plenix.Button, null, 'New'), children: h('p', null, 'Inbox') })",
      notificationList: "h(Plenix.NotificationList, { items: [{ id: 1, text: 'Ann replied', time: '2m', unread: true }, { id: 2, text: 'Bo shared', time: '1h' }], onViewAll() {}, onChange() {} })",
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
    console.log('patterns-ts-753-a: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
