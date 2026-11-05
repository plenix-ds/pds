/* Plenix tests · actions[].confirm on CommandBar and BarActions (issue 109; ADR 0004, design 109-state-layers §2).
   Summary: a command with `confirm` opens the destructive Dialog before it runs; the words come from the action (confirm.name, confirm.consequence,
     confirm.permanent) through the catalog's confirmAction strings, and a confirm.title / body / confirmLabel the application gives wins.
     Focus starts on Cancel, Escape cancels and the command does not run, focus returns to the command; Confirm runs it once; a command folded into More
     confirms the same way; a command without confirm runs at once. Left to right and right to left.
   Proof first: before 109 a command with confirm runs at once and no Dialog opens: those lines fail.
   Usage: node tests/command-confirm-109.test.js   → COMMAND_CONFIRM_109_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9852, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 500 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (width) => page.evaluate(async (dir, width) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__ran = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const run = (n) => () => window.__ran.push(n);
        const actions = [
          { id: 'plain', label: 'Rename', icon: 'edit', onSelect: run('plain') },
          { id: 'archive', label: 'Archive', icon: 'archive', onSelect: run('archive'), confirm: { name: 'case 14', consequence: 'It leaves the active list.' } },
          { id: 'custom', label: 'Merge', icon: 'merge', onSelect: run('custom'), confirm: { title: 'Merge these cases?', body: 'The second case is closed.', confirmLabel: 'Merge now' } },
          { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: run('delete'), confirm: { name: '3 files', consequence: 'The files go to the trash.', permanent: true } }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { width, padding: 8 } }, h(Plenix.CommandBar, { label: 'Cases', actions })));
        await new Promise((r) => setTimeout(r, 1000)); window.dispatchEvent(new Event('resize')); await new Promise((r) => setTimeout(r, 600));
      }, dir, width);
      const dlg = () => page.evaluate(() => { const d = document.querySelector('[role=alertdialog], [role=dialog]'); if (!d) return null; return { text: d.textContent.replace(/\s+/g, ' ').trim(), buttons: [...d.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean), focus: document.activeElement && document.activeElement.textContent.trim() }; });
      const ran = () => page.evaluate(() => window.__ran.slice());
      const press = async (label) => { await page.evaluate((label) => { const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || x.textContent.trim()) === label && !x.closest('[role=dialog],[role=alertdialog]')); b.focus(); b.click(); }, label); await wait(400); };
      const T = dir + ': ';

      await mount(900);
      await press('Rename'); assert.deepEqual(await ran(), ['plain'], T + 'a command without confirm runs at once'); assert.equal(await dlg(), null);
      await press('Archive'); let d = await dlg(); assert.ok(d, T + 'a command with confirm opens a Dialog'); assert.deepEqual(await ran(), ['plain'], T + 'it has not run yet');
      assert.match(d.text, /Archive case 14\?/, T + 'the title from the catalog: verb and name'); assert.match(d.text, /It leaves the active list\./, T + 'the consequence'); assert.deepEqual(d.buttons, ['Cancel', 'Archive'], T + 'Cancel, then the verb');
      assert.equal(d.focus, 'Cancel', T + 'focus starts on Cancel');
      await page.keyboard.press('Escape'); await wait(400); assert.equal(await dlg(), null); assert.deepEqual(await ran(), ['plain'], T + 'Escape cancels: it did not run');
      assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.textContent.trim()), 'Archive', T + 'focus returns to the command');
      await press('Archive'); await page.evaluate(() => [...document.querySelectorAll('[role=alertdialog] button, [role=dialog] button')].find((b) => b.textContent.trim() === 'Archive').click()); await wait(400);
      assert.deepEqual(await ran(), ['plain', 'archive'], T + 'Confirm runs it once'); assert.equal(await dlg(), null);
      await press('Merge'); d = await dlg(); assert.match(d.text, /Merge these cases\?/, T + 'the application title wins'); assert.match(d.text, /The second case is closed\./); assert.deepEqual(d.buttons, ['Cancel', 'Merge now'], T + 'the application confirm label wins');
      await page.keyboard.press('Escape'); await wait(300);
      await press('Delete'); d = await dlg(); assert.match(d.text, /Delete 3 files\?/); assert.match(d.text, /This cannot be undone\./, T + 'permanent adds its line');
      await page.keyboard.press('Escape'); await wait(300);
      // folded into More: the bar is narrow
      await mount(90);
      await press('More actions'); await wait(300);
      const item = await page.evaluate(() => { const i = [...document.querySelectorAll('[role=menuitem]')].find((x) => x.textContent.trim() === 'Delete'); if (!i) return false; i.click(); return true; }); await wait(400);
      assert.ok(item, T + 'Delete is in More'); d = await dlg(); assert.ok(d && /Delete 3 files\?/.test(d.text), T + 'a folded command confirms the same way'); assert.deepEqual(await ran(), [], T + 'and has not run');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COMMAND_CONFIRM_109_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
