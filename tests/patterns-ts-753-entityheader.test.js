/* Plenix tests · TypeScript wave 3, EntityHeader (issue 753): the header draws the same after the rename. A smoke probe mounts each (structured, section, layouts, style 2, streamlined), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-entityheader.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-entityheader.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-entityheader.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9861, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      structured: "h(Plenix.EntityHeader, { media: { person: 'Maya Chen', color: 'blue' }, title: 'Maya Chen', subtitle: 'Creative Director · Apex Co', status: { tone: 'action-required', icon: 'alert', label: 'Reconnect due' }, facts: [{ label: 'Last message', value: '10:24 AM', data: true }, { label: 'Owner', value: 'Sam Patel' }], next: { title: 'Send the revised quote', detail: 'Due tomorrow' }, actions: [{ icon: 'phone', label: 'Call' }, { icon: 'message', label: 'Message', primary: true }, { icon: 'share', label: 'Share' }], moreActions: [{ label: 'Archive' }] })",
      section: "h(Plenix.EntityHeader, { kind: 'section', media: { icon: 'message', hue: 'blue' }, title: 'Comments', summary: '3 open · 5 resolved', actions: [{ icon: 'plus', label: 'Add comment' }] })",
      layouts: "h('div', null, ['top-large', 'column-small', 'column-large', 'edge'].map((l) => h(Plenix.EntityHeader, { key: l, layout: l, media: { icon: 'calendar', hue: 'green' }, title: 'Layout ' + l, subtitle: 'Sub', facts: [{ label: 'A', value: '1' }] })))",
      style2: "h(Plenix.EntityHeader, { media: { icon: 'calendar', hue: 'surface' }, title: 'Council Session 2026-10-22', subtitle: 'Thursday, October 22, 2026 at 10:00 AM', facts: [{ icon: 'person', label: 'Presiding', value: 'H.E. Serapion' }, { icon: 'person', label: 'Attendance', value: 12, data: true, action: { label: 'Attendance', icon: 'edit', name: 'Take attendance' } }], states: { value: 'in-progress', onChange() {}, options: [{ value: 'draft', label: 'Draft', icon: 'pencil', tone: 'waiting' }, { value: 'in-progress', label: 'In progress', icon: 'clock', tone: 'success' }] } })",
      streamlined: "h(Plenix.EntityHeader, { headerStyle: 'streamlined', media: { icon: 'folder', hue: 'blue' }, title: 'Project Atlas', subtitle: 'Owned by **Sam** since 2026-01-04', status: { tone: 'success', label: 'Active' }, badges: [{ label: 'Priority', tone: 'waiting' }], people: { label: 'Team', list: [{ name: 'Ann Lee' }, { name: 'Bo Chen' }] }, progress: { label: 'Done', value: 40, max: 100 }, actions: [{ icon: 'share', label: 'Share' }, { label: 'Edit', text: true }], detail: { facts: [{ label: 'Due', value: 'Nov 30', data: true }], tags: [{ label: 'Q4' }] } })",
      streamlinedCompact: "h(Plenix.EntityHeader, { headerStyle: 'streamlined', view: 'compact', title: 'Compact', status: { tone: 'neutral', label: 'Draft' } })",
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
    console.log('patterns-ts-753-entityheader: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
