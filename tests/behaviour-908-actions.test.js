/* Plenix tests · plan §7e baseline behaviour tests, buttons and actions family (issue 908): CopyButton, DownloadButton, FloatingActionButton.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: CopyButton (one press copies the value once, the copied state is announced; disabled copies nothing), DownloadButton (a link with the download attribute and a name that tells file, format
     and size; progress makes it busy and a click does nothing), FloatingActionButton (a native button named by its label, extended shows the label, disabled fires nothing, the corner one stays put).
   Usage: node tests/behaviour-908-actions.test.js   → BEHAVIOUR_908_ACTIONS_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9909, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    await browser.defaultBrowserContext().overridePermissions('http://localhost:' + PORT, ['clipboard-read', 'clipboard-write']);
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

      // ---- CopyButton
      await mount("h(P.CopyButton, { value: 'ASSET-0142', label: 'Copy ID', onCopy: (ok) => window.__log.push(ok) })");
      let r = await page.evaluate(() => { const b = document.querySelector('#c button'); return { name: b.getAttribute('aria-label') || b.textContent.trim(), disabled: b.disabled }; });
      assert.equal(r.name, 'Copy ID', T + 'CopyButton: the icon button is named by its label');
      await tab(); assert.ok(await focusRing(), T + 'CopyButton: Tab reaches it and focus is visible');
      await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 300));
      assert.deepEqual(await log(), [true], T + 'CopyButton: Enter copies once');
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'ASSET-0142', T + 'CopyButton: the clipboard holds the value as it is');
      assert.ok(/Copied/.test(await page.evaluate(() => document.body.textContent)), T + 'CopyButton: "Copied" is announced');
      await page.keyboard.press('Space'); await new Promise((res) => setTimeout(res, 300)); assert.deepEqual(await log(), [true, true], T + 'CopyButton: Space copies again');
      await mount("h(P.CopyButton, { value: 'x', label: 'Copy link', showLabel: true, disabled: true, onCopy: (ok) => window.__log.push(ok) })");
      await page.click('#c button').catch(() => {}); assert.deepEqual(await log(), [], T + 'CopyButton: disabled copies nothing');
      assert.ok(await page.$eval('#c button', (b) => b.disabled || b.getAttribute('aria-disabled') === 'true'), T + 'CopyButton: disabled is told to assistive technology');
      await mount("h(P.CopyButton, { value: 'https://example.org/a/very/long/link/that/keeps/going/and/going/and/going/on/and/on', field: true, fieldLabel: 'Share link', label: 'Copy link' })", 320);
      assert.ok((await overflow()) <= 1, T + 'CopyButton: a long value in a field does not overflow (' + (await overflow()) + 'px)');
      await mount("h(P.CopyButton, { value: '', label: 'Copy ID' })"); assert.ok(await page.$('#c button'), T + 'CopyButton: an empty value does not break it');
      await mount("h(P.CopyButton, { value: 'ASSET-0142', label: 'Copy ID' })");
      assert.deepEqual(await axeViolations(), [], T + 'CopyButton: no axe violations');

      // ---- DownloadButton
      await mount("h(P.DownloadButton, { href: '#file', fileName: 'cross-014.png', format: 'PNG', size: 4200000 })");
      r = await page.evaluate(() => { const a = document.querySelector('#c a, #c button'); return { tag: a.tagName, download: a.getAttribute('download'), name: a.getAttribute('aria-label') || a.textContent.trim(), text: a.textContent }; });
      assert.ok(r.tag === 'A' && r.download === 'cross-014.png', T + 'DownloadButton: a link with the download attribute ' + JSON.stringify(r));
      assert.ok(/cross-014\.png/.test(r.name) && /PNG/.test(r.name), T + 'DownloadButton: the name tells the file and its format (' + r.name + ')');
      assert.ok(/PNG/.test(r.text) && /MB|4\.2/.test(r.text), T + 'DownloadButton: the format and size show before it starts');
      await tab(); assert.ok(await focusRing(), T + 'DownloadButton: Tab reaches it and focus is visible');
      await mount("h(P.DownloadButton, { onDownload: () => window.__log.push('go'), fileName: 'export.csv', progress: 40 })");
      r = await page.evaluate(() => { const b = document.querySelector('#c button, #c a'); return { busy: b.getAttribute('aria-busy'), text: b.textContent }; });
      assert.equal(r.busy, 'true', T + 'DownloadButton: while downloading it is aria-busy'); assert.ok(/Downloading/.test(r.text) && /40/.test(r.text), T + 'DownloadButton: it says Downloading with the percent (' + r.text + ')');
      await page.click('#c button, #c a'); assert.deepEqual(await log(), [], T + 'DownloadButton: a click while downloading does nothing');
      await mount("h(P.DownloadButton, { onDownload: () => window.__log.push('go'), fileName: 'export.csv' })");
      await tab(); await page.keyboard.press('Enter'); assert.deepEqual(await log(), ['go'], T + 'DownloadButton: Enter runs onDownload once');
      await mount("h(P.DownloadButton, { iconOnly: true, href: '#f', fileName: 'report-with-a-very-long-name-that-goes-on-and-on-and-on-and-on.pdf', format: 'PDF', size: 1200 })", 200);
      assert.ok((await overflow()) <= 1, T + 'DownloadButton: icon only with a long file name does not overflow'); assert.ok(/report-with/.test(await page.$eval('#c a, #c button', (b) => b.getAttribute('aria-label') || b.textContent)), T + 'DownloadButton: the icon-only name says the file');
      await mount("h(P.DownloadButton, { href: '#file', fileName: 'cross-014.png', format: 'PNG', size: 4200000 })");
      assert.deepEqual(await axeViolations(), [], T + 'DownloadButton: no axe violations');

      // ---- FloatingActionButton
      await mount("h(P.FloatingActionButton, { icon: 'plus', label: 'New asset', placement: 'inline', onClick: () => window.__log.push('new') })");
      assert.equal(await page.$eval('#c button', (b) => b.getAttribute('aria-label') || b.textContent.trim()), 'New asset', T + 'FloatingActionButton: the icon-only button is named by its label');
      await tab(); assert.ok(await focusRing(), T + 'FloatingActionButton: focus is visible'); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
      assert.deepEqual(await log(), ['new', 'new'], T + 'FloatingActionButton: Enter and Space each run the action once');
      await mount("h(P.FloatingActionButton, { icon: 'upload', label: 'Upload', extended: true, placement: 'inline', disabled: true, onClick: () => window.__log.push('up') })");
      assert.ok(/Upload/.test(await page.$eval('#c button', (b) => b.textContent)), T + 'FloatingActionButton: extended shows the label');
      await page.click('#c button').catch(() => {}); assert.deepEqual(await log(), [], T + 'FloatingActionButton: disabled fires nothing');
      await mount("h(P.FloatingActionButton, { icon: 'plus', label: 'Create a brand new asset from a template with a very long name', extended: true, placement: 'inline' })", 240);
      assert.ok((await overflow()) <= 1, T + 'FloatingActionButton: a long label does not overflow (' + (await overflow()) + 'px)');
      await mount("h(P.FloatingActionButton, { icon: 'plus', label: 'New asset', placement: 'corner' })");
      const before = await page.$eval('#c button', (b) => Math.round(b.getBoundingClientRect().bottom));
      await page.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo(0, 800); }); await new Promise((res) => setTimeout(res, 200));
      assert.equal(await page.$eval('#c button', (b) => Math.round(b.getBoundingClientRect().bottom)), before, T + 'FloatingActionButton: in the corner it stays put while the page scrolls');
      await page.evaluate(() => { document.body.style.minHeight = ''; window.scrollTo(0, 0); });
      await mount("h(P.FloatingActionButton, { icon: 'plus', label: 'New asset', placement: 'inline' })");
      assert.deepEqual(await axeViolations(), [], T + 'FloatingActionButton: no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_ACTIONS_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
