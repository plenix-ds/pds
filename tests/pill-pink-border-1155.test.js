/* Plenix tests · the soft pink pill's border (issue 1155, D-0147, ADR 0049, design 1155): a softer rose, from the existing pinks, with no new colour.
   Summary: a soft DataPill with gender="female" (pink) draws a border that is pink-700 mixed 35% into its pink-100 fill (#ccafba), light and dark; a blue soft pill keeps #a2c0e3 and every other hue keeps its border
     (the amount defaults to 100%); the text colour and the fill do not change; the amount is published as --plx-comp-category-soft-border-amount on [data-plx-category]. Left to right and right to left.
   Proof first: before the change the female pill's border is pink-700, the same as its text (#6c3b4f).
   Usage: node tests/pill-pink-border-1155.test.js   → PILL_PINK_BORDER_1155_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9988, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      for (const mode of ['light', 'dark']) {
        const r = await page.evaluate(async (dir, mode) => {
          document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); const h = React.createElement, P = Plenix;
          const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
          ReactDOM.createRoot(c).render(h('div', null, h(P.DataPill, { gender: 'female', variant: 'soft' }, 'Gemma Ellison'), h(P.DataPill, { gender: 'male', variant: 'soft' }, 'Patrick'), h(P.DataPill, { tone: 'green', variant: 'soft' }, 'Mona'), h(P.DataPill, { tone: 'pink', variant: 'soft' }, 'Rose')));
          await new Promise((r) => setTimeout(r, 600));
          const rgb = (c) => { const m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/); return m ? 'rgb(' + [1, 2, 3].map((i) => Math.round(parseFloat(m[i]) * 255)).join(', ') + ')' : c; };   // color-mix reads back as color(srgb …)
          const look = (el) => { const s = getComputedStyle(el); return { border: rgb(s.borderTopColor), text: rgb(s.color), fill: rgb(s.backgroundColor), amount: s.getPropertyValue('--plx-comp-category-soft-border-amount').trim() }; };
          const pills = [...c.querySelectorAll('.plx-data-pill')];
          return pills.map(look);
        }, dir, mode);
        const [female, male, green, pink] = r, T = dir + ' ' + mode + ': ';
        assert.equal(female.border, 'rgb(204, 175, 186)', T + 'the female soft pill border is the softer rose #ccafba (' + female.border + ')');
        assert.notEqual(female.border, female.text, T + 'the border is no longer the text colour');
        assert.equal(female.text, 'rgb(108, 59, 79)', T + 'the text stays pink-700'); assert.equal(female.fill, pink.fill, T + 'the fill is the pink category fill, unchanged');
        assert.equal(pink.border, female.border, T + 'a pink-toned pill reads the same role');
        assert.equal(male.border, 'rgb(162, 192, 227)', T + 'the blue soft pill keeps #a2c0e3 (' + male.border + ')');
        assert.equal(green.amount, '100%', T + 'every other hue keeps the full border: the amount defaults to 100%'); assert.equal(female.amount, '35%', T + 'the pink amount is 35%');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('PILL_PINK_BORDER_1155_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
