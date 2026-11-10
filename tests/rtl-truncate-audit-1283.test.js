/* Plenix tests · every one-line truncated text isolates its direction (issue 1283, follow-up of 1281): unicode-bidi: plaintext with text-align: match-parent on each ellipsis rule that holds text.
   Summary: (1) static: every stylesheet rule with text-overflow: ellipsis has unicode-bidi: plaintext, unless it is in the allowlist below with its reason or on the pending list (tests/fixtures/rtl-truncate-pending-1283.json: the parts still to audit; it only shrinks);
     (2) browser, in a right-to-left page: in EntityTitle, Persona and a Menu item, a long English label has its first character inside its box (the cut is at its end), a long Arabic one too,
     and a short English label in a box wider than its text stays at the inline start (right), not moved to the left.
   Proof first: before the change the static list has dozens of rules without plaintext and the long English labels start outside their boxes in RTL.
   Usage: node tests/rtl-truncate-audit-1283.test.js   → RTL_TRUNCATE_AUDIT_1283_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
// the rules that are not a one-line label of user or app text, with the reason (G2, issue 1283)
const ALLOW = {
  'plx-combobox__input': 'a form control: the person types, the control is its own paragraph', 'plx-date-picker__input': 'a form control', 'plx-time-picker__input': 'a form control', 'plx-search__input': 'a form control',
  'plx-stack:has': 'a custom property for a field label (not a text rule)', 'plx-data-pill__value': 'a value (a number is direction-neutral)',
  'plx-data-grid__': 'DataGrid cells align per column (end for numbers); a bidi change there needs its own pass (follow-up)',
};
const ROOT = path.resolve(__dirname, '..', 'platform'); const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/^(node_modules|dist|design-system|tokens)$/.test(e.name) && p !== path.join(ROOT, 'system')) walk(p); } else if (e.name.endsWith('.css')) files.push(p); } })(ROOT);
const PENDING_FILE = path.join(__dirname, 'fixtures', 'rtl-truncate-pending-1283.json');   // the rules not yet audited (issue 1283); it only shrinks
const pending = new Set(JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8')).rules);
const missing = [], seen = new Set();
for (const f of files) {
  const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{};]+)\{([^{}]*text-overflow:\s*ellipsis[^{}]*)\}/g)) {
    const sel = m[1].trim(); if (sel.startsWith('@') || /unicode-bidi:\s*plaintext/.test(m[2])) continue;
    if (Object.keys(ALLOW).some((k) => sel.includes(k))) continue;
    const key = path.relative(ROOT, f) + ': ' + sel.slice(0, 80); seen.add(key);
    if (!pending.has(key)) missing.push(key);
  }
}
assert.deepEqual(missing, [], 'an ellipsis rule without unicode-bidi: plaintext, an allowlist reason or a place on the pending list:\n  ' + missing.join('\n  '));
const fixed = [...pending].filter((k) => !seen.has(k));
assert.deepEqual(fixed, [], 'these rules are fixed: remove them from tests/fixtures/rtl-truncate-pending-1283.json:\n  ' + fixed.join('\n  '));
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
      ReactDOM.createRoot(c).render(h(P.Menu, { label: 'm', open: true, trigger: h(P.Button, null, 'T') }, h(P.MenuItem, null, 'Short'), h(P.MenuItem, null, 'A noticeably longer menu item label here'))); await new Promise((r) => setTimeout(r, 600));
      return ['.plx-menu__label-text'].map((sel) => { const el = document.querySelector(sel), box = el.closest('.plx-menu__item').getBoundingClientRect(), tn = el.firstChild, rg = document.createRange(); rg.selectNodeContents(tn); const t = rg.getBoundingClientRect(); return [Math.round(box.right - t.right), Math.round(t.left - box.left), Math.round(box.width)]; });
    });
    for (const [fromRight, fromLeft] of s) assert.ok(fromRight <= 40 && fromLeft > 100, 'a short English label stays at the right in RTL ' + JSON.stringify(s));
    await page.close();
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('RTL_TRUNCATE_AUDIT_1283_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
