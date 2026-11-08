/* Plenix tests · #990 (D-0118, D-0120): the structured EntityHeader draws facts[].tone like the Status tile.
   Summary: a fact with tone "danger" (alias of negative) or "action-required" gets data-plx-tone and the status-tile look (fill, border, text in the tone),
     with or without an icon; the icon takes the tone text colour; a toned and an untoned tile are the same size; an untoned fact is unchanged;
     an invalid EntityPicker inside a toned tile keeps its danger border while focused. Left to right and right to left.
   Proof first: before the change the structured header ignores facts[].tone: no data-plx-tone on the fact.
   Usage: node tests/entity-header-fact-tone-990.test.js   → ENTITY_HEADER_FACT_TONE_990_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9808, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1200, height: 600 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = window.Plenix; document.querySelector('main').textContent = ''; const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').appendChild(c);
        const picker = h(P.EntityPicker, { kind: 'people', label: 'Assigned council member', placeholder: 'Choose a council member', options: [{ value: 'a', label: 'Ann Lee' }], value: null, onChange() {}, invalid: true, 'aria-describedby': 'hint' });
        ReactDOM.createRoot(c).render(h(P.EntityHeader, { title: 'Case 14', detail: undefined, facts: [
          { icon: 'person', label: 'Assigned', value: picker, tone: 'danger' },
          { icon: 'person', label: 'Filed by', value: 'Maya Chen' },
          { label: 'Hearing', value: 'Nov 14', tone: 'action-required' },
          { label: 'Court', value: 'Council' }] }));
        await new Promise((r) => setTimeout(r, 900));
      }, dir);
      const facts = () => page.evaluate(() => [...document.querySelectorAll('.plx-entity-header__details .plx-entity-header__fact')].map((f) => { const cs = getComputedStyle(f), i = f.querySelector('.plx-entity-header__fact-icon'), r = f.getBoundingClientRect();
        return { tone: f.getAttribute('data-plx-tone'), bg: cs.backgroundColor, border: cs.borderTopColor, color: cs.color, icon: i && getComputedStyle(i).color, h: Math.round(r.height) }; }));
      const f = await facts(); assert.equal(f.length, 4, T + 'four facts');
      assert.equal(f[0].tone, 'negative', T + 'danger is drawn as negative'); assert.equal(f[2].tone, 'action-required', T + 'action-required is drawn');
      assert.equal(f[1].tone, null, T + 'an untoned fact has no tone'); assert.equal(f[3].tone, null);
      assert.notEqual(f[0].bg, f[1].bg, T + 'the toned tile has its own fill'); assert.notEqual(f[0].border, f[1].border, T + 'and its own border');
      assert.equal(f[0].icon, f[0].color, T + 'the icon is in the tone text colour (' + f[0].icon + ' vs ' + f[0].color + ')');
      assert.notEqual(f[0].icon, f[1].icon, T + 'the untoned icon keeps its own colour');
      assert.equal(f[0].h, f[1].h, T + 'a toned and an untoned tile are the same height');
      // the invalid picker keeps the danger border while focused
      const bw = () => page.evaluate(() => { const w = document.querySelector('.plx-entity-header__details .plx-entity-picker__field'); const cs = getComputedStyle(w); return [cs.borderTopColor, cs.borderTopWidth, w.getAttribute('aria-invalid')]; });
      const before = await bw(); assert.equal(before[2], 'true', T + 'the picker is aria-invalid');
      await page.focus('.plx-entity-header__details input'); await new Promise((r) => setTimeout(r, 300));
      const after = await bw(); assert.equal(after[0], before[0], T + 'the focused invalid picker keeps the danger border');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('ENTITY_HEADER_FACT_TONE_990_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
