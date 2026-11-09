/* Plenix tests · the corner icon that shows the full text of cut text (issue 1122, D-0140, ADR 0047, design 1122): Text overflow="dialog", PropertyList.Item lines.
   Summary: a Text with lines and overflow="dialog" shows a "Show full text: {label}" button at the inline end only while the text is cut (none when it fits, gone after a widen that makes it fit);
     click, Enter and Space open a Dialog titled with the label that holds the whole text, and closing it returns focus to the button; the full text stays in the page; right to left puts the button on the
     left; a Text in a Panel body behaves the same; PropertyList.Item with lines gets the same (its label names the button), overflow="none" opts out, a status ignores it; overflow="dialog" with no lines or truncate
     warns, and with expandable warns. Left to right and right to left.
   Proof first: before the change Text has no overflow prop and PropertyList.Item no lines: no button appears.
   Usage: node tests/full-text-1122.test.js   → FULL_TEXT_1122_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9986, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [], warnings = [];
    const LONG = 'The council recommends that the hearing be adjourned until the president has reviewed the full submission, the supporting letters and the new evidence in the case file. '.repeat(2);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) (/Text|PropertyList|overflow/.test(m.text()) ? warnings : problems).push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (expr, width) => page.evaluate(async (dir, expr, width, LONG) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix, I = P.PropertyList.Item;
        window.__root && window.__root.unmount(); const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = width + 'px'; document.querySelector('main').replaceChildren(c);
        window.__root = ReactDOM.createRoot(c); window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 600));
      }, dir, expr, width, LONG);
      const state = () => page.evaluate(() => { const c = document.getElementById('c'), b = c.querySelector('.plx-text-full__action, [aria-label^="Show full text"]'), t = c.querySelector('.plx-text'), tb = t && t.getBoundingClientRect(), bb = b && b.getBoundingClientRect();
        return { button: !!b, name: b ? b.getAttribute('aria-label') : null, haspopup: b ? b.getAttribute('aria-haspopup') : null, text: c.textContent, bx: bb && bb.left + bb.width / 2, tx: tb && tb.left + tb.width / 2, ty: tb && tb.top, by: bb && bb.top + bb.height / 2, tbot: tb && tb.bottom }; });
      const dialog = () => page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d ? { title: (d.querySelector('h1,h2,h3,[class*=title]') || {}).textContent, text: d.textContent } : null; });
      const sel = '#c [aria-label^="Show full text"]';
      assert.equal(typeof (await page.evaluate(() => typeof Plenix.Text)), 'string');
      // a cut Text
      await mount(`h(P.Text, { as: 'p', lines: 2, overflow: 'dialog', overflowLabel: 'Notes' }, LONG)`, 320);
      let s = await state(); assert.ok(s.button, T + 'a cut text shows the button'); assert.equal(s.name, 'Show full text: Notes', T + 'its name'); assert.equal(s.haspopup, 'dialog', T + 'it opens a dialog');
      assert.ok(s.text.includes('supporting letters and the new evidence'), T + 'the full text stays in the page');
      assert.ok(dir === 'ltr' ? s.bx > s.tx : s.bx < s.tx, T + 'the button is at the inline end (' + s.bx + ' vs ' + s.tx + ')');
      await page.click(sel); await new Promise((r) => setTimeout(r, 300)); let d = await dialog(); assert.ok(d, T + 'click opens the dialog'); assert.equal((d.title || '').trim(), 'Notes', T + 'titled with the label'); assert.ok(d.text.includes('the new evidence in the case file'), T + 'it holds the whole text');
      await page.keyboard.press('Escape'); await new Promise((r) => setTimeout(r, 300)); assert.equal(await dialog(), null, T + 'Escape closes it'); assert.ok(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label') === 'Show full text: Notes'), T + 'focus returns to the button');
      await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 300)); assert.ok(await dialog(), T + 'Enter opens it'); await page.keyboard.press('Escape'); await new Promise((r) => setTimeout(r, 300));
      await page.keyboard.press('Space'); await new Promise((r) => setTimeout(r, 300)); assert.ok(await dialog(), T + 'Space opens it'); await page.keyboard.press('Escape'); await new Promise((r) => setTimeout(r, 300));
      // no label
      await mount(`h(P.Text, { as: 'p', lines: 2, overflow: 'dialog' }, LONG)`, 320); s = await state(); assert.equal(s.name, 'Show full text', T + 'without a label the generic words'); 
      // fits / widen
      await mount(`h(P.Text, { as: 'p', lines: 2, overflow: 'dialog', overflowLabel: 'Notes' }, 'Short note')`, 320); s = await state(); assert.ok(!s.button, T + 'text that fits shows no button');
      await mount(`h(P.Text, { as: 'p', lines: 2, overflow: 'dialog', overflowLabel: 'Notes' }, LONG)`, 2400); await page.setViewport({ width: 3000, height: 800 }); s = await state(); assert.ok(!s.button, T + 'a width that makes it fit removes the button'); await page.setViewport({ width: 1000, height: 800 });
      // default none
      await mount(`h(P.Text, { as: 'p', lines: 2 }, LONG)`, 320); s = await state(); assert.ok(!s.button, T + 'overflow defaults to none: no button');
      // in a Panel body
      await mount(`h(P.Panel, { title: 'Case' }, h(P.Text, { as: 'p', lines: 3, overflow: 'dialog', overflowLabel: 'Recommendation' }, LONG + LONG))`, 360); s = await state(); assert.equal(s.name, 'Show full text: Recommendation', T + 'in a Panel body the same');
      // PropertyList.Item
      await mount(`h(P.PropertyGroup, { heading: 'Case', variant: 'tiles' }, h(P.PropertyList, null, h(I, { label: 'Recommendation', lines: 3 }, LONG + LONG), h(I, { label: 'Short', lines: 3 }, 'Short'), h(I, { label: 'Quiet', lines: 3, overflow: 'none' }, LONG + LONG), h(I, { label: 'Status', lines: 3, status: { label: 'Open', tone: 'active', icon: 'check' } })))`, 420);
      const names = await page.evaluate(() => [...document.querySelectorAll('#c [aria-label^="Show full text"]')].map((b) => b.getAttribute('aria-label')));
      assert.deepEqual(names, ['Show full text: Recommendation'], T + 'only the cut item has the button, named by its label (' + JSON.stringify(names) + ')');
      // warnings
      warnings.length = 0; await mount(`h(P.Text, { overflow: 'dialog' }, 'x')`, 320); await mount(`h(P.Text, { lines: 2, expandable: true, overflow: 'dialog' }, 'x')`, 320);
      if (dir === 'ltr') assert.ok(warnings.length >= 2, T + 'overflow="dialog" with no lines, and with expandable, each warn (' + warnings.length + ')');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('FULL_TEXT_1122_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
