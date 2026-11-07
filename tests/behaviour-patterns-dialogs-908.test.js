/* Plenix tests · baseline behaviour (plan 7e) of CommandPalette and ExportDialog (issue 908).
   Summary (the browser, left to right and right to left, dev React, no console warnings):
     CommandPalette: the hotkey (Ctrl K) opens a dialog and again closes it; the field has focus; typing filters; Enter runs the command once, closes the palette and returns
       focus to where it was; Escape closes without running; each opening starts empty; the trigger carries aria-haspopup="dialog"; hotkey null opens nothing; controlled open
       reports onOpenChange; a 3x longer command label does not overflow the dialog
     ExportDialog: closed draws nothing; open it names its dialog and lists the formats; Export calls onExport once with { format, scope, background }; a second press while it works
       does nothing and Escape cannot close it; success shows a status badge and the supplied download link; Background says queued; Selection is unavailable with no selected
       records; no formats or an unavailable scope give the invalid message and call nothing; a failure keeps every option and says so; Cancel closes
   Usage: node tests/behaviour-patterns-dialogs-908.test.js   -> BEHAVIOUR_PATTERNS_DIALOGS_908_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9913, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((dir) => { document.documentElement.setAttribute('dir', dir); window.__log = [];
        window.__mount = async (node) => { window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c"></div>';
          window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(node); await new Promise((r) => setTimeout(r, 500)); }; }, dir);
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const ctrlK = async () => { await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control'); await wait(400); };
      const dialog = () => page.$('[role="dialog"]');

      // CommandPalette
      const items = [{ id: 'new', label: 'New file', onSelect: () => window.__log.push('new') }, { id: 'open', label: 'Open recent project with an extremely long name that goes on for three times the usual English length', onSelect: () => window.__log.push('open') }, { id: 'theme', label: 'Change theme', onSelect: () => window.__log.push('theme') }];
      await page.evaluate(async (items) => { const h = React.createElement, P = Plenix; window.__log = []; const run = (it) => ({ id: it.id, label: it.label, onSelect: () => window.__log.push(it.id) });
        await window.__mount(h('div', null, h(P.Button, { id: 'before' }, 'Before'), h(P.CommandPalette, { items: items.map(run), trigger: h(P.Button, { id: 'trig' }, 'Commands'), onSelect: (it) => window.__log.push('selected:' + it.id), onOpenChange: (o) => window.__log.push(o ? 'open' : 'close') }))); }, items);
      assert.equal(await page.$eval('#trig', (b) => b.getAttribute('aria-haspopup')), 'dialog', T + 'the trigger announces a dialog');
      await page.focus('#before'); await ctrlK(); assert.ok(await dialog(), T + 'Ctrl K opens the palette');
      assert.equal(await page.evaluate(() => document.activeElement.tagName), 'INPUT', T + 'the field has focus');
      assert.equal(await page.$eval('[role="dialog"]', (d) => d.scrollWidth > d.clientWidth + 1), false, T + 'a long command label does not overflow the dialog');
      await page.keyboard.type('theme'); await wait(250); const shown = await page.$$eval('[role="dialog"] [role="option"]', (o) => o.map((x) => x.textContent.trim()));
      assert.ok(shown.length >= 1 && shown.every((t) => /theme/i.test(t)), T + 'typing filters the commands, got ' + JSON.stringify(shown));
      await page.keyboard.press('Enter'); await wait(400);
      let log = await page.evaluate(() => window.__log); assert.deepEqual(log.filter((x) => !/^(open|close)$/.test(x)), ['theme', 'selected:theme'], T + 'Enter runs the command once and onSelect follows, got ' + JSON.stringify(log));
      assert.equal(await dialog(), null, T + 'the palette closes after a command'); assert.equal(await page.evaluate(() => document.activeElement.id), 'before', T + 'focus returns to where it was');
      await page.evaluate(() => { window.__log = []; }); await ctrlK(); assert.equal(await page.$eval('[role="dialog"] input', (i) => i.value), '', T + 'it opens empty each time');
      await page.keyboard.press('Escape'); await wait(300); assert.equal(await dialog(), null, T + 'Escape closes it');
      assert.deepEqual((await page.evaluate(() => window.__log)).filter((x) => !/^(open|close)$/.test(x)), [], T + 'Escape runs nothing');
      await ctrlK(); await ctrlK(); assert.equal(await dialog(), null, T + 'the hotkey again closes it');
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; window.__log = []; await window.__mount(h(P.CommandPalette, { items: [{ id: 'a', label: 'Alpha' }], hotkey: null })); });
      await ctrlK(); assert.equal(await dialog(), null, T + 'hotkey null opens nothing');
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; window.__log = []; await window.__mount(h(P.CommandPalette, { items: [{ id: 'a', label: 'Alpha' }], open: true, onOpenChange: (o) => window.__log.push(o) })); });
      assert.ok(await dialog(), T + 'controlled open draws it'); await page.keyboard.press('Escape'); await wait(300);
      assert.deepEqual(await page.evaluate(() => window.__log), [false], T + 'controlled: Escape asks to close');

      // ExportDialog
      const ex = (props, run) => page.evaluate(async (props, run) => { const h = React.createElement, P = Plenix; window.__log = []; window.__resolve = null;
        const onExport = run === 'ok' ? (r) => { window.__log.push(JSON.stringify(r)); return Promise.resolve({ href: '/files/export.csv', label: 'Download export.csv' }); }
          : run === 'slow' ? (r) => { window.__log.push(JSON.stringify(r)); return new Promise((res) => { window.__resolve = res; }); }
          : run === 'fail' ? (r) => { window.__log.push(JSON.stringify(r)); return Promise.reject(new Error('no')); } : (r) => { window.__log.push(JSON.stringify(r)); };
        await window.__mount(h(P.ExportDialog, Object.assign({ open: true, onClose: () => window.__log.push('close'), onExport }, props))); return true; }, props, run);
      const press = (name) => page.evaluate((name) => { const b = [...document.querySelectorAll('[role="dialog"] button')].find((x) => x.textContent.trim() === name); b.click(); return !!b; }, name);
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; await window.__mount(h(P.ExportDialog, { open: false, formats: [{ value: 'csv', label: 'CSV' }] })); });
      assert.equal(await dialog(), null, T + 'closed, ExportDialog draws nothing');
      await ex({ formats: [{ value: 'csv', label: 'CSV' }, { value: 'xlsx', label: 'Excel' }], selectedCount: 0 }, 'ok');
      assert.ok(await dialog(), T + 'open, it is a dialog'); assert.ok(await page.$eval('[role="dialog"]', (d) => !!d.getAttribute('aria-label') || !!d.getAttribute('aria-labelledby')), T + 'the dialog has a name');
      assert.deepEqual(await page.$$eval('[role="dialog"] select', (s) => [...s[0].options].map((o) => o.value)), ['csv', 'xlsx'], T + 'the formats are listed');
      assert.equal(await page.$$eval('[role="dialog"] select', (s) => [...s[1].options].find((o) => o.value === 'selection').disabled), true, T + 'Selection is unavailable with no selected records');
      await press('Export'); await wait(400); let l = await page.evaluate(() => window.__log);
      assert.deepEqual(l, [JSON.stringify({ format: 'csv', scope: 'all', background: false })], T + 'Export calls onExport once with the options, got ' + JSON.stringify(l));
      assert.ok(await page.$('[role="dialog"] [role="status"]'), T + 'success shows a status badge'); assert.equal(await page.$eval('[role="dialog"] a', (a) => a.getAttribute('href')), '/files/export.csv', T + 'the supplied download link is shown');
      await ex({ formats: [{ value: 'csv', label: 'CSV' }], selectedCount: 2 }, 'slow'); await press('Export'); await wait(200); await press('Export'); await wait(100);
      assert.equal(await page.evaluate(() => window.__log.length), 1, T + 'a second press while it works does nothing'); await page.keyboard.press('Escape'); await wait(200);
      assert.ok(await dialog(), T + 'a working export cannot be dismissed'); assert.equal(await page.evaluate(() => window.__log.includes('close')), false, T + 'onClose did not run');
      await page.evaluate(() => window.__resolve && window.__resolve({})); await wait(300);
      await ex({ formats: [{ value: 'csv', label: 'CSV' }], selectedCount: 2 }, 'ok'); await page.click('[role="dialog"] input[type="checkbox"]'); await press('Export'); await wait(400);
      assert.ok((await page.evaluate(() => window.__log))[0].includes('"background":true'), T + 'Background is sent'); assert.ok(/queued/i.test(await page.$eval('[role="dialog"] [role="status"]', (b) => b.textContent)), T + 'a background export says queued');
      await ex({ formats: [], selectedCount: 0 }, 'ok'); await press('Export'); await wait(250);
      assert.equal(await page.evaluate(() => window.__log.length), 0, T + 'no formats: onExport is not called'); assert.ok(await page.$('[role="dialog"] [class*="notice"], [role="dialog"] [role="alert"]'), T + 'the invalid message shows');
      await ex({ formats: [{ value: 'csv', label: 'CSV' }, { value: 'xlsx', label: 'Excel' }], selectedCount: 2 }, 'fail'); await page.select('[role="dialog"] select', 'xlsx'); await press('Export'); await wait(400);
      assert.equal(await page.$eval('[role="dialog"] select', (s) => s.value), 'xlsx', T + 'a failure keeps every option'); assert.ok(await page.$('[role="dialog"] [class*="notice"], [role="dialog"] [role="alert"]'), T + 'a failure is told');
      await press('Cancel'); assert.ok((await page.evaluate(() => window.__log)).includes('close'), T + 'Cancel closes');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | ').slice(0, 400));
    console.log('BEHAVIOUR_PATTERNS_DIALOGS_908_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
