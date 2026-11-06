/* Plenix tests · TypeScript wave 3, batch D (issue 753): eleven patterns draw the same after the rename. A smoke probe mounts each (SecondaryPane, SessionTimeout, SettingsLayout, ShareDialog, ShortcutsDialog, SidePanel, SortPanel, SortableList, SplitView, StatusBar, TimeGrid), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-d.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-d.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-d.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9855, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      secondaryPane: "h(Plenix.SecondaryPane, { title: 'Folders', label: 'Folders', collapsible: true, actions: h(Plenix.Button, null, 'New') }, h('p', null, 'List body'))",
      secondaryPaneFolded: "h(Plenix.SecondaryPane, { title: 'Folders', label: 'Folders', collapsible: true, defaultCollapsed: true }, h('p', null, 'List body'))",
      sessionActive: "h(Plenix.SessionTimeout, { state: 'active', inline: true })",
      sessionWarning: "h(Plenix.SessionTimeout, { state: 'warning', remaining: 90, inline: true, onStay() {}, onSignOut() {} })",
      sessionSignedOut: "h(Plenix.SessionTimeout, { state: 'signed-out', idleMinutes: 30, inline: true, onSignIn() {} })",
      settings: "h(Plenix.SettingsLayout, { nav: h('nav', { 'aria-label': 'Settings' }, h('a', { href: '#a' }, 'General')) }, h(Plenix.SettingsSection, { title: 'Profile', description: 'Your details', collapsible: true }, h(Plenix.SettingsRow, { label: 'Name', description: 'Shown to others', htmlFor: 'n' }, h('input', { id: 'n' }))))",
      shareDialog: "h(Plenix.ShareDialog, { open: true, title: 'Share Report', people: [{ value: 'a', label: 'Ann' }], grants: [], url: 'https://example.com/r', onSave() {}, onClose() {} })",
      shortcuts: "h(Plenix.ShortcutsDialog, { open: true, onClose() {} })",
      sidePanel: "h(Plenix.SidePanel, { title: 'Details', label: 'Details', onOpenChange() {}, footer: h('span', null, 'Foot') }, h('p', null, 'Panel body'))",
      sidePanelClosed: "h(Plenix.SidePanel, { title: 'Details', label: 'Details', open: false, onOpenChange() {} }, h('p', null, 'Panel body'))",
      sortPanel: "h(Plenix.SortPanel, { inline: true, fields: [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'age', label: 'Age', kind: 'number' }], value: [{ field: 'name', dir: 'asc' }], onChange() {} })",
      sortableList: "h(Plenix.SortableList, { label: 'Order', moveButtons: true, items: [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }, { id: 3, name: 'Three' }], renderItem: (i) => i.name, onReorder() {} })",
      sortableGrid: "h(Plenix.SortableList, { label: 'Tiles', layout: 'grid', items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }], renderItem: (i) => i.name, onReorder() {} })",
      splitSide: "h(Plenix.SplitView, { label: 'Split', first: h('p', null, 'First'), second: h('p', null, 'Second'), defaultSize: 300 })",
      splitStacked: "h(Plenix.SplitView, { orientation: 'stacked', label: 'Split', first: h('p', null, 'First'), second: h(Plenix.ReadingPane, { label: 'Reading', empty: 'Nothing selected' }) })",
      statusBar: "h(Plenix.StatusBar, { start: h('span', null, 'Ready'), end: h('span', null, '3 items') })",
      timeGrid: "h(Plenix.TimeGrid, { label: 'Week', days: [{ key: 'mon', weekday: 'Mon', day: '3' }, { key: 'tue', weekday: 'Tue', day: '4', today: true }], startHour: 8, endHour: 12, events: [{ id: 1, day: 'mon', start: 9, end: 10.5, title: 'Standup', time: '9:00' }] })",
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
    console.log('patterns-ts-753-d: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
