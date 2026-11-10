/* Plenix tests · the person tile is a column, not the plain tile's row (issue 1240, 1.7.0 regression found by CTM#326).
   Summary: MetricCard type="person" layout="tile" in a 320px column at 1366px, English and a long name: the card is a column (flex-direction: column), the value (count and unit) sits below the divider, not beside the name,
     the name is not cut to a few letters and nothing overlaps; the plain tile (no person) stays a row. Left to right and right to left.
   Proof first: before the fix .plx-metric-card--tile (row) comes after .plx-metric-card--person-tile (column) at the same specificity, so the person tile is a row.
   Usage: node tests/metric-card-person-tile-order-1240.test.js   → METRIC_CARD_PERSON_TILE_ORDER_1240_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9983, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message)); await page.setViewport({ width: 1366, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.style.inlineSize = '320px'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h('div', null,
          h(P.MetricCard, { type: 'person', layout: 'tile', person: { name: 'Fr. Youhanna Abdelmessih Ghobrial Hanna-Boutros', role: 'Council member' }, value: '12', unit: 'active cases' }),
          h(P.MetricCard, { layout: 'tile', title: 'Cases to assign', value: '12' })));
        await new Promise((r) => setTimeout(r, 800));
        const cards = [...document.querySelectorAll('.plx-metric-card')], person = cards[0], plain = cards[1];
        const rc = (e) => e.getBoundingClientRect(), div = person.querySelector('.plx-metric-card__person-divider'), val = person.querySelector('.plx-metric-card__person-value'), name = person.querySelector('.plx-metric-card__person-name');
        return { personDir: getComputedStyle(person).flexDirection, plainDir: getComputedStyle(plain).flexDirection, valueBelow: rc(val).top >= rc(div).bottom - 1, nameW: Math.round(rc(name).width), cardW: Math.round(rc(person).width),
          overlap: (() => { const a = rc(name), b = rc(val); return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; })() };
      }, dir);
      assert.equal(r.personDir, 'column', T + 'the person tile is a column ' + JSON.stringify(r));
      assert.equal(r.plainDir, 'row', T + 'the plain tile stays a row');
      assert.ok(r.valueBelow, T + 'the value sits below the divider ' + JSON.stringify(r)); assert.ok(!r.overlap, T + 'the name and the value do not overlap');
      assert.ok(r.nameW > r.cardW * 0.5, T + 'the name has room (' + r.nameW + ' of ' + r.cardW + ')');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('METRIC_CARD_PERSON_TILE_ORDER_1240_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
