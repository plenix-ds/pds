/* Plenix tests · a truncated one-line label isolates its own direction (issue 1281): in an RTL page a long Latin label is cut at its end, and a long Arabic one at its end too.
   Summary: SecondaryPane's back row (the title wraps, it is not cut), a NavList item name and a Tag label, each with a long English text and a long Arabic text in a narrow box, in LTR and RTL pages:
     the first character of the text is inside its box (the cut is at the end), and the box isolates its direction (unicode-bidi: plaintext).
   Proof first: before the change a long English label in an RTL page has its first characters outside its box.
   Usage: node tests/rtl-truncate-1281.test.js   → RTL_TRUNCATE_1281_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9999, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const EN = 'Back to all of the cases assigned to the tribunal this year and still open', AR = 'العودة إلى جميع القضايا المسندة إلى المحكمة هذا العام والتي لا تزال مفتوحة';
    for (const dir of ['ltr', 'rtl']) for (const [name, text] of [['en', EN], ['ar', AR]]) {
      const T = dir + ' ' + name + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 900, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir, text) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.style.inlineSize = '240px'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h('div', null,
          h(P.SecondaryPane, { title: text, back: { parent: text, href: '#' } }, h('div', null, 'body')),
          h(P.NavList, { label: 'Nav', groups: [{ items: [{ id: 'a', label: text }] }], value: 'a', onSelect() {} }),
          h('div', { style: { inlineSize: 160, display: 'flex' } }, h(P.Tag, null, text))));
        await new Promise((r) => setTimeout(r, 700));
        const out = {};
        const probe = (key, sel) => { const el = document.querySelector(sel); if (!el) { out[key] = null; return; }
          const box = el.getBoundingClientRect(), tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()) || el.firstChild;
          const rg = document.createRange(); rg.setStart(tn, 0); rg.setEnd(tn, 1); const f = rg.getBoundingClientRect();
          out[key] = { inside: f.left >= box.left - 1 && f.right <= box.right + 1, bidi: getComputedStyle(el).unicodeBidi, clipped: el.scrollWidth > el.clientWidth }; };
        probe('back', '.plx-secondary-pane__back-text'); probe('nav', '.plx-nav-list__name'); probe('tag', '.plx-tag__label');
        return out;
      }, dir, text);
      assert.equal(r.tag && r.tag.bidi, 'plaintext', T + 'a Tag label isolates its direction (it is cut only where its container is narrower)');
      for (const k of ['back', 'nav']) {
        assert.ok(r[k], T + k + ' drawn');
        assert.ok(r[k].clipped, T + k + ' is truncated in this test (' + JSON.stringify(r[k]) + ')');
        assert.ok(r[k].inside, T + k + ' the first character is inside the box, the cut is at the end ' + JSON.stringify(r[k]));
        assert.equal(r[k].bidi, 'plaintext', T + k + ' isolates its direction');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('RTL_TRUNCATE_1281_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
