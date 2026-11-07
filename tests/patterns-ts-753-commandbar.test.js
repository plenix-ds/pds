/* Plenix tests · TypeScript wave 3, CommandBar (issue 753): the command bar and its parts draw the same after the rename. A smoke probe mounts each (bar, menu, selection, quick filters, panels, bulk actions), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-commandbar.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-commandbar.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-commandbar.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9863, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      bar: "h(Plenix.CommandBar, { label: 'Assets', actions: [{ id: 'new', label: 'New', icon: 'add', primary: true, onSelect() {} }, { id: 'share', label: 'Share', icon: 'share', onSelect() {} }, { id: 'sort', label: 'Order', choices: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], value: 'a', onChange() {} }, { id: 'pin', label: 'Pin', toggle: true, pressed: true, onSelect() {} }, { id: 'del', label: 'Delete', danger: true, onSelect() {} }], find: h(Plenix.CommandBarSearch, { label: 'Search', value: '', onChange() {} }), count: 24, status: 'Synced 2 min ago' })",
      barMenu: "h(Plenix.CommandBar, { label: 'Files', actions: [{ id: 'm', label: 'More', items: [{ id: 'x', label: 'Export', icon: 'download', onSelect() {} }, { id: 'y', label: 'Remove', danger: true, onSelect() {} }] }, { id: 'p', label: 'Rename', panel: ({ close }) => h('button', { onClick: close }, 'Done') }, { id: 'l', label: 'Sync', loading: true }, { id: 'd', label: 'Archive', disabled: true, why: 'Nothing selected' }] })",
      barSelection: "h(Plenix.CommandBar, { label: 'Assets', actions: [{ id: 'new', label: 'New', onSelect() {} }], selection: { count: 3, hidden: 1, noun: 'asset', onClear() {}, actions: [{ id: 'mv', label: 'Move', single: true, onSelect() {} }, { id: 'rm', label: 'Delete', danger: true, onSelect() {} }] }, count: 10 })",
      barQuick: "h(Plenix.CommandBar, { label: 'Assets', actions: [{ id: 'new', label: 'New', onSelect() {} }], quickFilters: [{ id: 'type', label: 'Type', kind: 'list', options: ['Image', 'Doc'], value: ['Image'], onChange() {} }, { id: 'date', label: 'Date', kind: 'date', value: { preset: '7' }, onChange() {} }], narrow: true })",
      barView: "h(Plenix.CommandBar, { label: 'Assets', layout: 'view', find: h(Plenix.CommandBarSearch, { label: 'Search', value: '', onChange() {} }), view: h(Plenix.SortPanel, { fields: [{ value: 'name', label: 'Name', kind: 'text' }], value: [{ field: 'name', dir: 'asc' }], onChange() {} }), end: { content: h('span', null, 'Export'), fold: { label: 'Export', items: [{ id: 'csv', label: 'CSV', onSelect() {} }] } } })",
      barButton: "h(Plenix.CommandBar, { label: 'Assets', layout: 'view', find: h(Plenix.CommandBarButton, { icon: 'filter', label: 'Filter', count: 2, caret: true }) })",
      filterPanel: "h(Plenix.FilterPanel, { inline: true, fields: [{ value: 'status', label: 'Status', kind: 'select', options: ['open', 'closed'] }, { value: 'name', label: 'Name', kind: 'text' }], value: { join: 'and', items: [{ id: 1, field: 'status', op: 'is', value: 'open' }] }, onChange() {} })",
      groupPanel: "h(Plenix.GroupPanel, { inline: true, fields: [{ value: 'status', label: 'Status', kind: 'select', options: ['open', 'closed'] }], value: [{ field: 'status', dir: 'asc' }], onChange() {} })",
      columnsMenu: "h(Plenix.ColumnsMenu, { fields: [{ value: 'name', label: 'Name' }, { value: 'type', label: 'Type' }], value: { order: ['name', 'type'], hidden: [] }, onChange() {}, inline: true })",
      bulkActions: "h(Plenix.BulkActions, { count: 2, noun: 'file', actions: [{ id: 'dl', label: 'Download', icon: 'download', onSelect() {} }, { id: 'rm', label: 'Delete', danger: true, onSelect() {} }], onClear() {} })",
      quick: "h(Plenix.QuickFilter, { kind: 'list', label: 'Category', noun: 'category', options: [{ value: 'a', label: 'Alpha', count: 3 }, 'Beta'], value: ['a'], onChange() {}, inline: true })",
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
    console.log('patterns-ts-753-commandbar: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
