/* Plenix tests · plan §7e baseline behaviour tests, overlays and drop family (issue 908): ContextualHelp.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: ContextualHelp (the button opens by click, Enter or Space and never by hover, focus moves in and returns on Escape, outside click closes, inline is plain text with one Tab stop). Scrim, Spotlight and DropZone are tested in #912 (ruling on #908).
   Usage: node tests/behaviour-908-overlays.test.js   → BEHAVIOUR_908_OVERLAYS_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9910, server = await serve(PORT); let browser;
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

      // ---- ContextualHelp
      await mount("h('div', null, 'Retention ', h(P.ContextualHelp, { title: 'Retention', link: { href: '#help', label: 'About retention' } }, 'Deleted files stay in the trash for 30 days.'))");
      assert.equal(await page.$eval('#c button', (b) => b.getAttribute('aria-label')), 'More about Retention', T + 'ContextualHelp: the info button is named by its title');
      await tab(); assert.ok(await focusRing(), T + 'ContextualHelp: Tab reaches it and focus is visible');
      await page.hover('#c button'); await new Promise((res) => setTimeout(res, 500));
      assert.ok(!(await page.$('[role=dialog]')), T + 'ContextualHelp: it never opens on hover');
      await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 500));
      assert.ok(/30 days/.test(await page.evaluate(() => document.body.textContent)) && await page.$('[role=dialog]'), T + 'ContextualHelp: Enter opens the explanation in a popover');
      assert.ok(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]')), T + 'ContextualHelp: focus moves into the popover');
      assert.ok(await page.$('[role=dialog] a[href="#help"]'), T + 'ContextualHelp: the link to more help is in the popover');
      assert.deepEqual(await axeViolations(), [], T + 'ContextualHelp: no axe violations while open');
      await page.keyboard.press('Escape'); await new Promise((res) => setTimeout(res, 400));
      assert.ok(!(await page.$('[role=dialog]')) && (await page.evaluate(() => document.activeElement.getAttribute('aria-label'))) === 'More about Retention', T + 'ContextualHelp: Escape closes it and returns focus to the button');
      await page.keyboard.press('Space'); await new Promise((res) => setTimeout(res, 400)); assert.ok(await page.$('[role=dialog]'), T + 'ContextualHelp: Space opens it');
      await page.mouse.click(5, 5); await new Promise((res) => setTimeout(res, 400)); assert.ok(!(await page.$('[role=dialog]')), T + 'ContextualHelp: a click outside closes it');
      await mount("h(P.ContextualHelp, { variant: 'inline', title: 'Tip', link: { href: '#more', label: 'Learn more' } }, 'Drop files anywhere on the page to upload them.')");
      assert.ok(/Drop files/.test(await page.$eval('#c', (o) => o.textContent)) && !(await page.$('#c button')), T + 'ContextualHelp: inline shows the tip in place, with no button');
      await tab(); assert.equal(await focused(), 'Learn more', T + 'ContextualHelp: inline, the link is the one Tab stop');
      await mount("h(P.ContextualHelp, { variant: 'inline', title: 'A very long tip title that goes on' }, 'An explanation that is three times as long as the English one and keeps going and going and going so that the wrapping of the tip is tested properly.')", 300);
      assert.ok((await overflow()) <= 1, T + 'ContextualHelp: a long tip wraps, no overflow (' + (await overflow()) + 'px)');
      await mount("h(P.ContextualHelp, { variant: 'inline', title: 'Tip' }, 'Short tip.')");
      assert.deepEqual(await axeViolations(), [], T + 'ContextualHelp: inline, no axe violations');

      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_OVERLAYS_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
