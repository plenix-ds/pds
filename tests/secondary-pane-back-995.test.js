// Plenix tests · #995 (ADR 0038, D-0123, D-0124): SecondaryPane back={{ parent, href | onClick }}: a quiet row above the title,
// the title is the strongest text, the folded rail has Back first.
//   node tests/secondary-pane-back-995.test.js   → SECONDARY_PANE_BACK_995_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9995;
  await serve(PORT); const browser = await launch();
  try {
    const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const r = await page.evaluate(() => new Promise((resolve) => {
      const P = window.Plenix, h = React.createElement;
      const nav = h(P.NavList, { label: 'Case', value: 'a', groups: [{ heading: 'Section', items: [{ id: 'a', label: 'Summary' }, { id: 'b', label: 'Notes' }] }] });
      const cases = [
        { id: 'link', dir: 'ltr', props: { back: { parent: 'cases', href: '/cases' } } },
        { id: 'button', dir: 'ltr', props: { back: { parent: 'cases', onClick: () => { window.__clicked = true; } } } },
        { id: 'none', dir: 'ltr', props: {} },
        { id: 'rtl', dir: 'rtl', props: { back: { parent: 'cases', href: '/cases' } } },
        { id: 'long', dir: 'ltr', props: { width: 'sm', back: { parent: 'a very long list of the parish council cases of the year', href: '/cases' } } },
        { id: 'folded', dir: 'ltr', props: { back: { parent: 'cases', href: '/cases' }, collapsible: true, defaultCollapsed: true } },
      ];
      document.querySelector('main').innerHTML = cases.map((c) => '<div id="' + c.id + '" dir="' + c.dir + '" style="height:400px"></div>').join('');
      cases.forEach((c) => ReactDOM.createRoot(document.getElementById(c.id)).render(h(P.SecondaryPane, Object.assign({ title: 'Case Overview', collapsible: false }, c.props), nav)));
      setTimeout(() => {
        const out = {}, fs = (el) => parseFloat(getComputedStyle(el).fontSize);
        for (const c of cases) {
          const root = document.getElementById(c.id), row = root.querySelector('.plx-secondary-pane__back'), title = root.querySelector('.plx-secondary-pane__title');
          const item = root.querySelector('.plx-nav-list__item, [role=link], a, button');
          const o = { rows: root.querySelectorAll('.plx-secondary-pane__back').length };
          if (row) {
            o.tag = row.tagName; o.href = row.getAttribute('href'); o.text = row.textContent.trim();
            o.before = !!(row.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING);
            const svg = row.querySelector('svg, .plx-icon'), rr = row.getBoundingClientRect(), tr = title.getBoundingClientRect(), ir = svg && svg.getBoundingClientRect();
            o.above = rr.bottom <= tr.top + 1;
            o.fsBack = fs(row); o.fsTitle = fs(title);
            o.fsItem = fs(root.querySelector('.plx-nav-list__item'));
            o.mirrored = svg ? (parseFloat(getComputedStyle(svg).scale) || 1) : null;
            o.iconStart = ir ? (c.dir === 'rtl' ? Math.round(rr.right - ir.right) : Math.round(ir.left - rr.left)) : null;
            o.titleStart = c.dir === 'rtl' ? Math.round(rr.right - tr.right) : Math.round(tr.left - rr.left);
          }
          const rail = root.querySelector('.plx-tool-rail');
          if (rail) { const first = rail.querySelector('.plx-tool-rail__item'); o.railFirst = first && first.getAttribute('aria-label'); }
          out[c.id] = o;
        }
        const b = document.querySelector('#button .plx-secondary-pane__back'); if (b) b.click(); out.clicked = !!window.__clicked;
        resolve(out);
      }, 1500);
    }));
    console.log(JSON.stringify(r));
    // G2: a cut "Back to …" shows the Plenix Tooltip on focus (not a native title); an uncut one has none
    const tip = async (id) => { await page.keyboard.press('Shift'); await page.focus('#' + id + ' .plx-secondary-pane__back'); await new Promise((x) => setTimeout(x, 700)); return page.evaluate((i) => !!document.querySelector('#' + i + ' [role=tooltip], body > [role=tooltip]') && !!document.querySelector('[role=tooltip]'), id); };
    assert.equal(await page.$eval('#long .plx-secondary-pane__back', (e) => e.hasAttribute('title') || !!e.querySelector('[title]')), false, 'no native title');
    assert.equal(await tip('long'), true, 'a cut Back shows the Tooltip on focus');
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await new Promise((x) => setTimeout(x, 400));
    assert.equal(await tip('link'), false, 'an uncut Back has no Tooltip');
    assert.equal(r.none.rows, 0, 'no back, no row');
    assert.equal(r.link.rows, 1);
    assert.equal(r.link.tag, 'A'); assert.equal(r.link.href, '/cases'); assert.match(r.link.text, /Back to cases/);
    assert.equal(r.button.tag, 'BUTTON'); assert.equal(r.clicked, true, 'onClick runs');
    assert.ok(r.link.before && r.link.above, 'the row is first, above the title');
    assert.ok(r.link.fsTitle > r.link.fsItem && r.link.fsItem > r.link.fsBack, 'title > items > back: ' + [r.link.fsTitle, r.link.fsItem, r.link.fsBack]);
    assert.equal(r.link.iconStart, r.link.titleStart, 'the arrow starts where the title starts (LTR)');
    assert.equal(r.rtl.iconStart, r.rtl.titleStart, 'the arrow starts where the title starts (RTL)');
    assert.ok(r.rtl.mirrored < 0 && r.link.mirrored > 0, 'the arrow mirrors in RTL');
    assert.match(r.folded.railFirst || '', /Back to cases/, 'the folded rail leads with Back');
    console.log('SECONDARY_PANE_BACK_995_OK');
  } finally { await Promise.race([browser.close(), new Promise((x) => setTimeout(x, 5000))]); }
})().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
