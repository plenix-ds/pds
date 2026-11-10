/* Plenix tests · every one-line truncated text isolates its direction (issue 1283, follow-up of 1281): unicode-bidi: plaintext with text-align: match-parent on each ellipsis rule that holds text.
   Summary: which rules carry the isolation is the style rule bidi-isolate's (check-system.rules/bidi-isolate.js, #1285); this test is the behavior, in a right-to-left page: in EntityTitle, Persona and a Menu item, a long English label has its first character inside its box (the cut is at its end), a long Arabic one too,
     and a short English label in a box wider than its text stays at the inline start (right), not moved to the left.
   Proof first: before the change a long English label starts outside its box in RTL, and a stretched Menu label with plaintext moved a short label to the left.
   Usage: node tests/rtl-truncate-audit-1283.test.js   → RTL_TRUNCATE_AUDIT_1283_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9990, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const EN = 'Annual review of all of the cases assigned to the tribunal this year and still open', AR = 'المراجعة السنوية لجميع القضايا المسندة إلى المحكمة هذا العام والتي لا تزال مفتوحة';
    for (const [name, text] of [['en', EN], ['ar', AR]]) {
      const T = 'rtl ' + name + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 900, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (text) => {
        document.documentElement.setAttribute('dir', 'rtl');
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.style.inlineSize = '300px'; document.querySelector('main').replaceChildren(c);
        const menu = h(P.Menu, { label: 'm', open: true, trigger: h(P.Button, null, 'T') }, h(P.MenuItem, null, text));
        ReactDOM.createRoot(c).render(h('div', null,
          h(P.EntityTitle, { title: text, subtitle: text }),
          h(P.Persona, { name: text, secondary: text }),
          menu));
        await new Promise((r) => setTimeout(r, 800));
        const out = {};
        for (const [k, sel] of [['entityTitle', '.plx-entity-title__title'], ['entitySub', '.plx-entity-title__subtitle'], ['persona', '.plx-persona__name'], ['personaSecondary', '.plx-persona__secondary'], ['menu', '.plx-menu__label-text']]) {
          const el = document.querySelector(sel); if (!el) { out[k] = null; continue; }
          const box = el.getBoundingClientRect(), tn = (function f(n) { for (const x of n.childNodes) { if (x.nodeType === 3 && x.textContent.trim()) return x; if (x.nodeType === 1) { const y = f(x); if (y) return y; } } return null; })(el);
          const rg = document.createRange(); rg.setStart(tn, 0); rg.setEnd(tn, 1); const f = rg.getBoundingClientRect();
          out[k] = { inside: f.left >= box.left - 1 && f.right <= box.right + 1, clipped: el.scrollWidth > el.clientWidth };
        }
        return out;
      }, text);
      for (const [k, v] of Object.entries(r)) { assert.ok(v, T + k + ' drawn'); assert.ok(v.clipped, T + k + ' is truncated (' + JSON.stringify(v) + ')'); assert.ok(v.inside, T + k + ' the first character is inside its box ' + JSON.stringify(v)); }
      await page.close();
    }
    // a short English label in a wider item stays at the inline start (the right in RTL)
    const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message)); await page.setViewport({ width: 900, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const s = await page.evaluate(async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.style.inlineSize = '400px'; document.querySelector('main').replaceChildren(c);
      const measure = (sel, within) => { const el = document.querySelector(sel), box = el.closest(within).getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(el.firstChild); const t = rg.getBoundingClientRect(); return [Math.round(box.right - t.right), Math.round(t.left - box.left)]; };
      const out = [];
      ReactDOM.createRoot(c).render(h(P.Menu, { label: 'm', open: true, trigger: h(P.Button, null, 'T') }, h(P.MenuItem, null, 'Short'), h(P.MenuItem, null, 'A noticeably longer menu item label here'))); await new Promise((r) => setTimeout(r, 600));
      out.push(measure('.plx-menu__label-text', '.plx-menu__item'));
      // a short English title over a longer subtitle (the same column): the short one stays at the right
      const c2 = document.createElement('div'); c2.style.inlineSize = '400px'; document.querySelector('main').replaceChildren(c2);
      ReactDOM.createRoot(c2).render(h('div', null, h(P.EntityTitle, { title: 'Ann', subtitle: 'المراجعة السنوية لجميع القضايا المسندة إلى المحكمة' }), h(P.Persona, { name: 'Ann', secondary: 'A much longer secondary line under the short name' }))); await new Promise((r) => setTimeout(r, 600));
      out.push(measure('.plx-entity-title__title', '.plx-entity-title'), measure('.plx-persona__name', '.plx-persona'));
      return out;
    });
    for (const [fromRight, fromLeft] of s) assert.ok(fromRight <= 40 && fromLeft > 20, 'a short English label stays at the right in RTL ' + JSON.stringify(s));
    await page.close();
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('RTL_TRUNCATE_AUDIT_1283_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
