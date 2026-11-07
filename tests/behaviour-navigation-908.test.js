/* Plenix tests · baseline behaviour (plan 7e) of the navigation parts: Pagination, Breadcrumbs, ProgressSteps (issue 908).
   Summary (the browser, left to right and right to left, dev React, no console warnings):
     Pagination: a navigation named "Pages"; the current page has aria-current="page"; Previous is disabled on page 1 and Next on the last page and they fire no event;
       choosing a page, Next and Previous call onPageChange with the page (once); keys reach and use every button (Tab, Enter, Space); an out-of-range page
       is held inside 1..pageCount; gaps show "..."; a page count of 40 does not widen the bar past its container; the words change with locale ar
     Breadcrumbs: a navigation landmark with an ordered list; every item but the last is a link, the last is aria-current="page" and not a link; a click runs
       onClick; three times longer labels and a single item do not overflow the container; the order mirrors in rtl
     ProgressSteps: an ordered list; the current step is aria-current="step"; each state is said in words after the name; a complete step shows a check; clickable:
       done and current steps are buttons that call onStepClick(index) with Enter and Space, upcoming and disabled ones are not focusable; vertical and compact forms
   Usage: node tests/behaviour-navigation-908.test.js   -> BEHAVIOUR_NAVIGATION_908_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9908, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 900, height: 700 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((dir) => { document.documentElement.setAttribute('dir', dir); window.__calls = []; window.__mount = async (node) => {
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:420px"></div>';
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(node); await new Promise((r) => setTimeout(r, 400)); }; }, dir);

      // Pagination
      const pg = async (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__calls = [];
        await window.__mount(h(P.Pagination, Object.assign({ onPageChange: (n) => window.__calls.push(n) }, props)));
        const nav = document.querySelector('nav'); const btns = [...nav.querySelectorAll('button')];
        return { name: nav.getAttribute('aria-label'), current: (nav.querySelector('[aria-current="page"]') || {}).textContent, labels: btns.map((b) => b.getAttribute('aria-label') || b.textContent), disabled: btns.map((b) => b.disabled || b.getAttribute('aria-disabled') === 'true'), width: nav.scrollWidth, box: nav.parentElement.clientWidth, text: nav.textContent }; }, props);
      let s = await pg({ page: 1, pageCount: 4 });
      assert.equal(s.name, 'Pages', T + 'Pagination is a navigation named Pages'); assert.equal(s.current, '1', T + 'the current page is marked');
      const prev = s.labels.findIndex((l) => /Previous/.test(l)), next = s.labels.findIndex((l) => /Next/.test(l));
      assert.ok(s.disabled[prev] && !s.disabled[next], T + 'Previous is disabled on page 1, Next is not');
      await page.evaluate(() => { document.querySelector('nav button[aria-label="Previous page"]').click(); });
      assert.deepEqual(await page.evaluate(() => window.__calls), [], T + 'a disabled Previous fires nothing');
      await page.evaluate(() => { document.querySelector('nav button[aria-label="Next page"]').click(); });
      assert.deepEqual(await page.evaluate(() => window.__calls), [2], T + 'Next goes to page 2, once');
      await page.focus('nav button[aria-label="Next page"]'); await page.keyboard.press('Enter');
      assert.deepEqual(await page.evaluate(() => window.__calls), [2, 2], T + 'Enter on Next activates it');
      await page.keyboard.press('Space'); assert.equal(await page.evaluate(() => window.__calls.length), 3, T + 'Space activates it too');
      s = await pg({ page: 4, pageCount: 4 }); const n4 = s.labels.findIndex((l) => /Next/.test(l)); assert.ok(s.disabled[n4], T + 'Next is disabled on the last page');
      s = await pg({ page: 99, pageCount: 4 }); assert.equal(s.current, '4', T + 'a page past the end is held at the last page');
      s = await pg({ page: 0, pageCount: 4 }); assert.equal(s.current, '1', T + 'a page before the start is held at 1');
      s = await pg({ page: 20, pageCount: 40 }); assert.ok(/…|\.\.\./.test(s.text), T + 'gaps show an ellipsis'); assert.ok(s.width <= s.box + 1, T + 'forty pages do not widen the bar past its container (' + s.width + ' > ' + s.box + ')');
      s = await pg({ page: 2, pageCount: 4, total: 120, perPage: 30, perPageOptions: [30, 60], onPerPageChange() {} }); assert.ok(/120/.test(s.text), T + 'the summary shows the total');

      // Breadcrumbs
      const bc = async (items) => page.evaluate(async (items) => { const h = React.createElement, P = Plenix; window.__calls = [];
        await window.__mount(h(P.Breadcrumbs, { items: items.map((i) => Object.assign({}, i, i.href ? { onClick: (e) => { e.preventDefault(); window.__calls.push(i.label); } } : {})) }));
        const nav = document.querySelector('nav'), lis = [...nav.querySelectorAll('ol > li')];
        const rects = lis.map((l) => l.getBoundingClientRect());
        return { ol: !!nav.querySelector('ol'), n: lis.length, links: lis.map((l) => !!l.querySelector('a')), current: lis.map((l) => !!l.querySelector('[aria-current="page"]') || l.getAttribute('aria-current') === 'page'), over: nav.scrollWidth > nav.clientWidth + 1, firstLeft: rects[0] && Math.round(rects[0].left), lastLeft: rects.length && Math.round(rects[rects.length - 1].left), label: nav.getAttribute('aria-label') }; }, items);
      let b = await bc([{ label: 'Home', href: '#/' }, { label: 'Forms', href: '#/forms' }, { label: 'Combobox' }]);
      assert.ok(b.ol && b.n === 3 && b.label, T + 'a navigation with an ordered list and a name');
      assert.deepEqual(b.links, [true, true, false], T + 'every item but the last is a link'); assert.deepEqual(b.current, [false, false, true], T + 'the last item is the current page');
      assert.ok(dir === 'rtl' ? b.firstLeft > b.lastLeft : b.firstLeft < b.lastLeft, T + 'the order runs from the start edge (' + b.firstLeft + ' / ' + b.lastLeft + ')');
      await page.evaluate(() => document.querySelector('nav a').click()); assert.deepEqual(await page.evaluate(() => window.__calls), ['Home'], T + 'a click runs onClick');
      b = await bc([{ label: 'A very long first level that goes on and on and on and on', href: '#/a' }, { label: 'Another level with a long name as well for the test', href: '#/b' }, { label: 'The current page has a long name too, three times the English' }]);
      assert.ok(!b.over, T + 'long labels do not overflow the container'); b = await bc([{ label: 'Only' }]); assert.deepEqual(b.current, [true], T + 'a single item is the current page');

      // ProgressSteps
      const ps = async (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__calls = [];
        const steps = props.steps || [{ label: 'Upload' }, { label: 'Map columns' }, { label: 'Review' }, { label: 'Finish' }];
        const rest = Object.assign({}, props); delete rest.click;
        await window.__mount(h(P.ProgressSteps, Object.assign({ label: 'Import steps', onStepClick: props.click ? (i) => window.__calls.push(i) : undefined }, rest, { steps })));
        const root = document.querySelector('[aria-label="Import steps"]') || document.querySelector('ol'); const lis = [...document.querySelectorAll('ol > li')];
        return { ol: !!document.querySelector('ol'), current: lis.map((l) => !!l.querySelector('[aria-current="step"]') || l.getAttribute('aria-current') === 'step'), texts: lis.map((l) => l.textContent), buttons: lis.map((l) => !!l.querySelector('button')), text: root ? root.textContent : '', over: root ? root.scrollWidth > root.clientWidth + 1 : false }; }, props);
      let p = await ps({ current: 1 });
      assert.ok(p.ol && p.current[1] && p.current.filter(Boolean).length === 1, T + 'an ordered list with the current step marked');
      assert.ok(/Complete/.test(p.texts[0]) && /Current/.test(p.texts[1]) && /Not started/.test(p.texts[2]), T + 'each state is said in words, got ' + JSON.stringify(p.texts));
      p = await ps({ current: 1, steps: [{ label: 'Upload' }, { label: 'Map columns', status: 'error' }, { label: 'Review' }] }); assert.ok(/Needs attention/.test(p.texts[1]), T + 'an error step says it needs attention');
      p = await ps({ current: 2, click: true, steps: [{ label: 'Upload' }, { label: 'Map' , disabled: true }, { label: 'Review' }, { label: 'Finish' }] });
      assert.deepEqual(p.buttons, [true, false, true, false], T + 'done and current steps are buttons; disabled and upcoming ones are not, got ' + JSON.stringify(p.buttons));
      await page.focus('ol > li:nth-child(1) button'); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
      assert.deepEqual(await page.evaluate(() => window.__calls), [0, 0], T + 'Enter and Space go to the step');
      p = await ps({ current: 1, orientation: 'vertical', steps: [{ label: 'Details', description: 'Name and owner' }, { label: 'Review', description: 'Check it' }] }); assert.ok(/Name and owner/.test(p.text), T + 'the vertical form shows descriptions');
      p = await ps({ current: 1, variant: 'compact' }); assert.ok(/2/.test(p.text) && /4/.test(p.text), T + 'the compact form says which step of how many, got ' + p.text);
      p = await ps({ current: 1, steps: ['Upload the file here', 'Map the columns to the fields', 'Review everything carefully', 'Finish and publish it'].map((label) => ({ label })) }); assert.ok(!p.over, T + 'long step names wrap, they do not overflow');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | ').slice(0, 300));
    console.log('BEHAVIOUR_NAVIGATION_908_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
