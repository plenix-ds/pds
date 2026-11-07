/* Plenix tests · DataGrid column `description` (issue 924, ADR 0025): the header's tooltip and its accessible description.
   Summary: a column with `description` shows it in the Tooltip when the pointer is over its header title and when the header has the keyboard focus (even when the title is not cut), the header cell gets
     `aria-describedby` pointing at text that is the description, a column without one has neither, the tooltip sits correctly in a right-to-left grid, and axe finds no violations.
   Proof first: before the change `description` is not a prop: no tooltip appears and the header has no aria-describedby.
   Usage: node tests/data-grid-column-description-924.test.js   → DATA_GRID_COLUMN_DESCRIPTION_924_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9924, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' });
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:900px"></div>';
        const rows = Array.from({ length: 4 }, (_, i) => ({ id: 'r' + i, name: 'Person ' + i, age: 30 + i, dos: 'D-' + i }));
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'People', data: rows, index: 'id', columns: [
          { title: 'Name', field: 'name', description: 'The full legal name, as on the passport.' },
          { title: 'Age', field: 'age' },
          { title: 'DOS', field: 'dos', description: 'Date of service: the day the case was first heard.' }] }));
        await new Promise((r) => setTimeout(r, 1200));
      }, dir);
      const header = (title) => page.evaluateHandle((title) => [...document.querySelectorAll('#c [role=columnheader]')].find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === title), title);
      const tips = () => page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => t.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).map((t) => t.textContent.trim()).filter(Boolean));
      // the accessible description
      const desc = (title) => page.evaluate((title) => { const hd = [...document.querySelectorAll('#c [role=columnheader]')].find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === title); const id = hd.getAttribute('aria-describedby'); return { id, text: id ? (document.getElementById(id) || { textContent: null }).textContent.trim() : null }; }, title);
      let d = await desc('Name'); assert.equal(d.text, 'The full legal name, as on the passport.', T + 'the Name header is described by the description');
      d = await desc('DOS'); assert.equal(d.text, 'Date of service: the day the case was first heard.', T + 'the DOS header is described by its description');
      d = await desc('Age'); assert.equal(d.id, null, T + 'a column without a description has no aria-describedby');
      // the description is the header's description, not part of its name
      const heads = await page.evaluate(() => null).then(() => page.accessibility.snapshot()).then((root) => { const out = []; const walk = (n) => { if (n.role === 'columnheader') out.push(n); (n.children || []).forEach(walk); }; walk(root); return out; });
      const nameHead = heads.find((n) => /^Name/.test(n.name || ''));
      assert.ok(nameHead && nameHead.description === 'The full legal name, as on the passport.' && !/legal name/.test(nameHead.name), T + 'the header\'s accessible description is the description and its name is not changed by it (' + JSON.stringify(nameHead && [nameHead.name, nameHead.description]) + ')');
      // hover shows it, even though the title is not cut
      const name = await header('Name'); const title = await name.asElement().$('.plx-data-grid__title-text'); await title.hover(); await new Promise((r) => setTimeout(r, 900));
      assert.ok((await tips()).includes('The full legal name, as on the passport.'), T + 'hovering the title shows the description in the Tooltip (' + JSON.stringify(await tips()) + ')');
      await page.mouse.move(2, 2); await new Promise((r) => setTimeout(r, 500));
      const age = await header('Age'); await (await age.asElement().$('.plx-data-grid__title-text')).hover(); await new Promise((r) => setTimeout(r, 900));
      assert.deepEqual(await tips(), [], T + 'a column without a description shows no tooltip');
      await page.mouse.move(2, 2); await new Promise((r) => setTimeout(r, 500));
      // keyboard focus on the header cell shows it
      await page.keyboard.press('Shift'); await page.evaluate(() => [...document.querySelectorAll('#c [role=columnheader]')].find((x) => (x.querySelector('.plx-data-grid__title-text') || x).textContent.trim() === 'DOS').focus()); await new Promise((r) => setTimeout(r, 900));
      assert.ok((await tips()).includes('Date of service: the day the case was first heard.'), T + 'keyboard focus on the header shows the description (' + JSON.stringify(await tips()) + ')');
      await page.keyboard.press('Escape'); await new Promise((r) => setTimeout(r, 400));
      // right to left: the tooltip lies inside the window
      await (await name.asElement().$('.plx-data-grid__title-text')).hover(); await new Promise((r) => setTimeout(r, 900));
      const box = await page.evaluate(() => { const t = [...document.querySelectorAll('[role=tooltip]')].find((x) => x.textContent.trim() && x.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })); if (!t) return null; const b = t.getBoundingClientRect(); return { l: b.left, r: b.right }; });
      assert.ok(box && box.l >= 0 && box.r <= 1200, T + 'the tooltip lies inside the window');
      const v = await page.evaluate(async () => (await window.axe.run(document.getElementById('c'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }, resultTypes: ['violations'] })).violations.filter((x) => x.id !== 'region').map((x) => x.id));
      assert.deepEqual(v, [], T + 'no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('DATA_GRID_COLUMN_DESCRIPTION_924_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
