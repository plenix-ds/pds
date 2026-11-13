/* Plenix tests · #1337 (G5c on #1362): a cut inline Field label shows its full text from the keyboard, and its ellipsis isolates its direction.
   Summary:
     AC-6 (keyboard) in a Stack of inline Fields a long label is cut; pressing Tab to its control opens the label tip (no new tab stop: focus is
          on the control), Escape closes it and focus stays on the control, and Tab out of the Field leaves it closed. A short label (not cut)
          gets no tip when its control is focused.
     AC-7 (bidi) the label's text sits in an inner span (.plx-field__label-text) that is cut with an ellipsis and isolates its direction:
          a long English label in a right-to-left page and a long Arabic label in a left-to-right page (and each in its own direction) have
          their first character inside the box (the cut is at the end), and a short English label in RTL stays at the inline start.
     AC-8 (style rule) bidi-isolate sees the Field label's ellipsis although text-overflow and white-space come through var(), and finds it isolated.
   Proof first: before the change AC-6 fails (focus on the control opens nothing), AC-7 fails (no inner span; a long English label starts
     outside its box in RTL) and AC-8 fails (the rule is not seen).
   Usage: node tests/field-label-tip-1337.test.js   → FIELD_LABEL_TIP_1337_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const EN = 'Annual review of all of the cases assigned to the tribunal this year and still open';
const AR = 'المراجعة السنوية لجميع القضايا المسندة إلى المحكمة هذا العام والتي لا تزال مفتوحة';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9637, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const open = async (dir) => {
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 900, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((dir) => document.documentElement.setAttribute('dir', dir), dir);
      return page;
    };
    // a Stack of inline Fields: the long label first, a short one second, a button before and after
    const render = (page, long, short) => page.evaluate(async (long, short) => {
      const h = React.createElement, P = Plenix, c = document.createElement('div'); c.style.inlineSize = '600px'; document.querySelector('main').replaceChildren(c);
      ReactDOM.createRoot(c).render(h('div', null, h('button', { id: 'before' }, 'Before'),
        h(P.Stack, null, h(P.Field, { label: long, layout: 'inline', id: 'long' }, h(P.Input, { id: 'long-input' })),
          h(P.Field, { label: short, layout: 'inline', id: 'short' }, h(P.Input, { id: 'short-input' }))),
        h('button', { id: 'after' }, 'After')));
      await new Promise((r) => setTimeout(r, 700));
    }, long, short);
    const tipOpen = (page, id) => page.evaluate((id) => { const b = document.querySelector('#' + id + ' .plx-field__label-tip .plx-tooltip__bubble'); return !!b && b.classList.contains('is-open'); }, id);
    const active = (page) => page.evaluate(() => document.activeElement && document.activeElement.id);

    // AC-6: the keyboard reaches a cut label's full text
    for (const dir of ['ltr', 'rtl']) {
      const T = 'AC-6 ' + dir + ': ', page = await open(dir);
      await render(page, EN, 'Name');
      const cut = await page.evaluate(() => { const el = document.querySelector('#long .plx-field__label-text') || document.querySelector('#long .plx-field__label'); return el.scrollWidth > el.clientWidth + 1; });
      assert.ok(cut, T + 'the long label is cut');
      await page.focus('#before'); await page.keyboard.press('Tab'); await wait(150);
      assert.equal(await active(page), 'long-input', T + 'Tab goes straight to the control (no new tab stop)');
      assert.ok(await tipOpen(page, 'long'), T + 'the label tip is open while its control has focus');
      await page.keyboard.press('Escape'); await wait(100);
      assert.ok(!(await tipOpen(page, 'long')), T + 'Escape closes the tip');
      assert.equal(await active(page), 'long-input', T + 'focus stays on the control after Escape');
      await page.keyboard.press('Tab'); await wait(150);
      assert.equal(await active(page), 'short-input', T + 'Tab goes on to the next control');
      assert.ok(!(await tipOpen(page, 'long')), T + 'the long label\'s tip is closed once focus leaves its Field');
      assert.ok(!(await tipOpen(page, 'short')), T + 'a short label (not cut) shows no tip');
      await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift'); await wait(150);
      assert.ok(await tipOpen(page, 'long'), T + 'the tip opens again when focus comes back');
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await wait(150);
      assert.ok(!(await tipOpen(page, 'long')), T + 'closed after leaving the Stack');
      await page.close();
    }

    // AC-7: cut at the end in both directions, for Latin and Arabic text
    for (const dir of ['rtl', 'ltr']) for (const [name, text] of [['en', EN], ['ar', AR]]) {
      const T = 'AC-7 ' + dir + ' ' + name + ': ', page = await open(dir);
      await render(page, text, 'Ann');
      const r = await page.evaluate(() => {
        const el = document.querySelector('#long .plx-field__label-text'); if (!el) return null;
        const box = el.getBoundingClientRect(), tn = el.firstChild, rg = document.createRange(); rg.setStart(tn, 0); rg.setEnd(tn, 1); const f = rg.getBoundingClientRect();
        const s = document.querySelector('#short .plx-field__label-text'), col = s.closest('.plx-field__head').getBoundingClientRect(), sr = document.createRange(); sr.selectNodeContents(s.firstChild); const t = sr.getBoundingClientRect();
        return { inside: f.left >= box.left - 1 && f.right <= box.right + 1, clipped: el.scrollWidth > el.clientWidth + 1, bidi: getComputedStyle(el).unicodeBidi,
          short: [Math.round(col.right - t.right), Math.round(t.left - col.left)] };
      });
      assert.ok(r, T + 'the label text is in an inner span (.plx-field__label-text)');
      assert.ok(r.clipped, T + 'the long label is cut ' + JSON.stringify(r));
      assert.equal(r.bidi, 'plaintext', T + 'the label text isolates its direction');
      assert.ok(r.inside, T + 'the first character is inside the box (cut at the end) ' + JSON.stringify(r));
      const [near, far] = dir === 'rtl' ? r.short : [r.short[1], r.short[0]];
      assert.ok(near <= 8 && far > 20, T + 'a short English label stays at the inline start ' + JSON.stringify(r.short));
      await page.close();
    }
    // AC-8: the style rule sees and accepts the Field label's ellipsis
    const { rules } = require('../check-system.rules/bidi-isolate.js');
    const field = rules().find((r) => r.id === 'platform/components/Field/field.css .plx-field__label-text');
    assert.ok(field, 'AC-8: bidi-isolate sees the Field label text\'s ellipsis (text-overflow through var())');
    assert.ok(field.isolated && !field.stretchedIsolated, 'AC-8: the Field label text isolates its direction and does not stretch ' + JSON.stringify(field));
    assert.deepEqual(problems, [], 'no page errors');
    console.log('FIELD_LABEL_TIP_1337_OK');
  } catch (e) { console.error(e.message); process.exitCode = 1; }
  finally { if (browser) await browser.close(); server.close(); }
})();
