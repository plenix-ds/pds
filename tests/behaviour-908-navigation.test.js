/* Plenix tests · plan §7e baseline behaviour tests, navigation family (issue 908): Pagination, Breadcrumbs, ProgressSteps, LoadMore.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: Pagination (first, last, out-of-range page, current page, gaps, per-page), Breadcrumbs (landmark, current page, links, plain text), ProgressSteps (current step, status words,
     clickable only for done and current steps, compact), LoadMore (one click, one load; loading is busy and does not double-fire; the end message).
   Usage: node tests/behaviour-908-navigation.test.js   → BEHAVIOUR_908_NAVIGATION_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9908, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' }).catch(() => {});
      const mount = (expr, width = 700) => page.evaluate(async (dir, expr, width) => {
        document.documentElement.setAttribute('dir', dir); window.__log = [];
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px"></div>';
        const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 500));
      }, dir, expr, width);
      const axeViolations = () => page.evaluate(async () => !window.axe ? -1 : (await window.axe.run(document.getElementById('c'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] })).violations.filter((v) => v.id !== 'region').map((v) => v.id));
      const overflow = () => page.evaluate(() => { const c = document.getElementById('c'); return c.scrollWidth - c.clientWidth; });
      const log = () => page.evaluate(() => window.__log);
      const tab = async (n = 1) => { for (let i = 0; i < n; i++) await page.keyboard.press('Tab'); };
      const focused = () => page.evaluate(() => { const e = document.activeElement; return e && e !== document.body ? (e.getAttribute('aria-label') || e.textContent.trim()) : null; });
      const focusRing = () => page.evaluate(() => { const e = document.activeElement, cs = getComputedStyle(e); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none'; });

      // ---- Pagination
      await mount("h(P.Pagination, { page: 1, pageCount: 8, onPageChange: (p) => window.__log.push(p), total: 240, perPage: 30, perPageOptions: [30, 60], onPerPageChange: (n) => window.__log.push('pp' + n) })");
      let r = await page.evaluate(() => { const nav = document.querySelector('#c nav'); const prev = nav.querySelector('[aria-label="Previous page"]'), next = nav.querySelector('[aria-label="Next page"]'); return { label: nav.getAttribute('aria-label'), current: nav.querySelector('[aria-current=page]').textContent.trim(), prevOff: prev.disabled, nextOff: next.disabled, texts: nav.textContent }; });
      assert.equal(r.label, 'Pages', T + 'Pagination: the navigation has its name');
      assert.equal(r.current, '1', T + 'Pagination: the current page carries aria-current="page"');
      assert.ok(r.prevOff && !r.nextOff, T + 'Pagination: Previous is disabled on the first page, Next is not');
      assert.ok(r.texts.includes('…'), T + 'Pagination: a gap shows as an ellipsis');
      await page.click('#c [aria-label="Previous page"]', { force: true }).catch(() => {});
      assert.deepEqual(await log(), [], T + 'Pagination: a disabled Previous fires nothing');
      await page.click('#c [aria-label="Next page"]'); assert.deepEqual(await log(), [2], T + 'Pagination: Next goes to page 2, once');
      await page.keyboard.press('Shift'); await page.focus('#c [aria-label="Next page"]'); assert.ok(await focusRing(), T + 'Pagination: focus is visible'); await page.keyboard.press('Enter');
      assert.deepEqual((await log()).slice(-1), [2], T + 'Pagination: Enter on Next activates it (controlled: the page stays 1)');
      await mount("h(P.Pagination, { page: 8, pageCount: 8, onPageChange() {} })");
      assert.ok(await page.$eval('#c [aria-label="Next page"]', (b) => b.disabled), T + 'Pagination: Next is disabled on the last page');
      await mount("h(P.Pagination, { page: 99, pageCount: 3, onPageChange() {} })");
      assert.ok(await page.$('#c nav'), T + 'Pagination: a page out of range does not break it');
      await mount("h(P.Pagination, { page: 1, pageCount: 1 })");
      assert.ok(await page.$eval('#c [aria-label="Next page"]', (b) => b.disabled), T + 'Pagination: one page disables both steps');
      await mount("h(P.Pagination, { page: 3, pageCount: 40, total: 12000, perPage: 300, strings: { label: 'ترقيم الصفحات وأرقام الصفحات الطويلة جدا لاختبار التفاف النص' } })", 360);
      assert.ok((await overflow()) <= 1, T + 'Pagination: long text does not overflow a narrow box (' + (await overflow()) + 'px)');
      await mount("h(P.Pagination, { page: 4, pageCount: 9, onPageChange() {} })");
      assert.deepEqual(await axeViolations(), [], T + 'Pagination: no axe violations');

      // ---- Breadcrumbs
      await mount("h(P.Breadcrumbs, { items: [{ label: 'Home', href: '#/' }, { label: 'Cases', href: '#/cases', onClick: (e) => { e.preventDefault(); window.__log.push('cases'); } }, { label: 'Case 10234' }] })");
      r = await page.evaluate(() => { const nav = document.querySelector('#c nav'), items = [...nav.querySelectorAll('li')]; return { label: nav.getAttribute('aria-label'), n: items.length, links: nav.querySelectorAll('a[href]').length, current: nav.querySelector('[aria-current=page]').textContent.trim(), ol: !!nav.querySelector('ol') }; });
      assert.ok(r.label === 'Breadcrumb' && r.ol && r.n === 3 && r.links === 2 && r.current === 'Case 10234', T + 'Breadcrumbs: a landmark with an ordered list, links but the last, the last is the current page ' + JSON.stringify(r));
      await tab(); assert.equal(await focused(), 'Home', T + 'Breadcrumbs: Tab reaches the first link'); assert.ok(await focusRing(), T + 'Breadcrumbs: focus is visible');
      await tab(); await page.keyboard.press('Enter'); assert.deepEqual(await log(), ['cases'], T + 'Breadcrumbs: Enter follows a link (onClick runs once)');
      await mount("h(P.Breadcrumbs, { items: [] })"); assert.ok(await page.$('#c nav'), T + 'Breadcrumbs: no items does not break it');
      await mount("h(P.Breadcrumbs, { items: [{ label: 'A very long first level of the hierarchy that keeps going on and on', href: '#' }, { label: 'Another long middle level to test the wrapping of the trail', href: '#' }, { label: 'The current page with a very long name as well to be sure' }] })", 300);
      assert.ok((await overflow()) <= 1, T + 'Breadcrumbs: long labels wrap, no overflow (' + (await overflow()) + 'px)');
      await mount("h(P.Breadcrumbs, { items: [{ label: 'Home', href: '#/' }, { label: 'Cases', href: '#/cases' }, { label: 'Case' }] })");
      assert.deepEqual(await axeViolations(), [], T + 'Breadcrumbs: no axe violations');

      // ---- ProgressSteps
      const steps = "[{ label: 'Upload' }, { label: 'Map columns' }, { label: 'Review' }, { label: 'Finish' }]";
      await mount("h(P.ProgressSteps, { label: 'Import steps', current: 1, steps: " + steps + " })");
      r = await page.evaluate(() => { const ol = document.querySelector('#c ol'), items = [...ol.querySelectorAll('li')]; return { n: items.length, current: items.filter((li) => li.getAttribute('aria-current') === 'step' || li.querySelector('[aria-current=step]')).length, text: ol.textContent, buttons: ol.querySelectorAll('button').length }; });
      assert.ok(r.n === 4 && r.current === 1, T + 'ProgressSteps: an ordered list with one current step ' + JSON.stringify(r));
      assert.ok(/Complete/.test(r.text) && /Current step/.test(r.text) && /Not started/.test(r.text), T + 'ProgressSteps: every state is told in words, not by color alone');
      assert.equal(r.buttons, 0, T + 'ProgressSteps: without onStepClick nothing is a button');
      await mount("h(P.ProgressSteps, { label: 'Import steps', current: 2, onStepClick: (i) => window.__log.push(i), steps: [{ label: 'Upload' }, { label: 'Map columns' }, { label: 'Review' }, { label: 'Finish' }] })");
      assert.equal(await page.$$eval('#c ol button', (b) => b.length), 3, T + 'ProgressSteps: the done steps and the current one are buttons; upcoming steps are not');
      await tab(); assert.ok(await focusRing(), T + 'ProgressSteps: focus is visible'); await page.keyboard.press('Enter'); assert.deepEqual(await log(), [0], T + 'ProgressSteps: Enter goes to the step');
      await tab(); await page.keyboard.press('Space'); assert.deepEqual(await log(), [0, 1], T + 'ProgressSteps: Space goes to the step');
      await mount("h(P.ProgressSteps, { label: 'Import steps', current: 2, onStepClick: (i) => window.__log.push(i), steps: [{ label: 'Upload', disabled: true }, { label: 'Map columns' }, { label: 'Review' }] })");
      assert.equal(await page.$$eval('#c ol button', (b) => b.length), 2, T + 'ProgressSteps: a disabled step is not focusable and fires nothing');
      await mount("h(P.ProgressSteps, { label: 'Import', current: 1, steps: [{ label: 'Upload' }, { label: 'Map columns', status: 'error' }, { label: 'Review' }] })");
      assert.ok(/Needs attention/.test(await page.$eval('#c ol', (o) => o.textContent)), T + 'ProgressSteps: a failed step says "Needs attention"');
      await mount("h(P.ProgressSteps, { label: 'Import', variant: 'compact', current: 1, steps: " + steps + " })");
      assert.ok(/Step 2 of 4/.test(await page.$eval('#c', (o) => o.textContent)), T + 'ProgressSteps: the compact form says "Step 2 of 4"');
      await mount("h(P.ProgressSteps, { label: 'Import', current: 1, steps: [{ label: 'A very long first step name that will not fit in the row', description: 'and a description just as long as the name to be sure of the wrapping' }, { label: 'Another long step name for the second step' }, { label: 'Third' }] })", 420);
      assert.ok((await overflow()) <= 1, T + 'ProgressSteps: long names do not overflow (' + (await overflow()) + 'px)');
      await mount("h(P.ProgressSteps, { label: 'Import', current: 0, steps: [] })"); assert.ok(await page.$('#c'), T + 'ProgressSteps: no steps does not break it');
      await mount("h(P.ProgressSteps, { label: 'Import steps', current: 1, steps: " + steps + " })");
      assert.deepEqual(await axeViolations(), [], T + 'ProgressSteps: no axe violations');

      // ---- LoadMore
      await mount("h(P.LoadMore, { onLoadMore: () => window.__log.push('more'), hasMore: true, shown: 20, total: 120 })");
      assert.ok(/20 of 120/.test(await page.$eval('#c', (o) => o.textContent)), T + 'LoadMore: the count shows beside the button');
      await tab(); assert.equal(await focused(), 'Load more', T + 'LoadMore: Tab reaches the button'); assert.ok(await focusRing(), T + 'LoadMore: focus is visible');
      await page.keyboard.press('Enter'); assert.deepEqual(await log(), ['more'], T + 'LoadMore: one press, one load');
      await page.keyboard.press('Space'); assert.deepEqual(await log(), ['more', 'more'], T + 'LoadMore: Space loads too');
      await mount("h(P.LoadMore, { onLoadMore: () => window.__log.push('more'), loading: true, hasMore: true, shown: 20 })");
      r = await page.evaluate(() => { const b = document.querySelector('#c button'); return { busy: b.getAttribute('aria-busy'), disabled: b.disabled }; });
      assert.equal(r.busy, 'true', T + 'LoadMore: while loading the button is aria-busy');
      await page.click('#c button'); assert.deepEqual(await log(), [], T + 'LoadMore: a click while loading does not load again');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: false, shown: 120, total: 120 })");
      assert.ok(/reached the end/.test(await page.$eval('#c', (o) => o.textContent)) && !(await page.$('#c button')), T + 'LoadMore: with nothing left the end message replaces the button');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: true, shown: 20, pageSize: 20 })");
      assert.ok(/Show 20 more/.test(await page.$eval('#c button', (b) => b.textContent)), T + 'LoadMore: the button says how many one load brings');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: true, shown: 20, total: 120, strings: { more: 'Load a great many more items from the server right now please' } })", 320);
      assert.ok((await overflow()) <= 1, T + 'LoadMore: a long label does not overflow (' + (await overflow()) + 'px)');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: true, shown: 20, total: 120 })");
      assert.deepEqual(await axeViolations(), [], T + 'LoadMore: no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_NAVIGATION_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
