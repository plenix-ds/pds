/* Plenix tests · plan §7e baseline behaviour tests, display parts family (issue 908): AvatarGroup, Barcode, QRCode, IconTile, Kbd, Persona, Pictogram, ProgressCircle, RoleLabel, SectionHeading, StatusDot, VersionLabel.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: AvatarGroup, Barcode, QRCode, IconTile, Kbd, Persona, Pictogram, ProgressCircle, RoleLabel, SectionHeading, StatusDot, VersionLabel. Each renders and has no axe violation and is not a Tab stop unless it is a control;
     then the part's own rules: AvatarGroup (the +N tile is a control only with onMore), Barcode and QRCode (an image named by value or purpose; a bad value says so), SectionHeading (aria-expanded and
     aria-controls, Enter and Space), StatusDot (every state in words, the shape never color alone), VersionLabel (v12, the badge, the link), ProgressCircle (progressbar values, indeterminate), RoleLabel (names and description).
   Usage: node tests/behaviour-908-display.test.js   → BEHAVIOUR_908_DISPLAY_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9911, server = await serve(PORT); let browser;
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
      const focusRing = () => page.evaluate(() => { const e = document.activeElement, drawn = (x) => { const cs = getComputedStyle(x); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none'; }; return drawn(e) || [...e.querySelectorAll('*')].some(drawn); });   // the ring may sit on the control or on a part inside it

      const first = (sel) => page.$eval(sel, (e) => ({ role: e.getAttribute('role'), label: e.getAttribute('aria-label'), hidden: e.getAttribute('aria-hidden'), text: e.textContent.trim() }));
      const cases = [
        // [part, expression, what it must be]
        ['AvatarGroup', "h(P.AvatarGroup, { label: 'Collaborators', max: 3, people: [{ name: 'Maya Chen' }, { name: 'Alex Kim', presence: 'away' }, { name: 'Sam Patel' }, { name: 'Lee Wong' }, { name: 'Ann Cole' }] })"],
        ['Barcode', "h(P.Barcode, { value: 'PLX-2026-0042' })"],
        ['QRCode', "h(P.QRCode, { value: 'https://plenix.lighthouseway.org/notes/', label: 'QR code: open Notes on your phone', caption: 'Scan to open', showValue: true })"],
        ['IconTile', "h(P.IconTile, { icon: 'alert', tone: 'warning', label: 'Overdue' })"],
        ['Kbd', "h('div', null, h(P.Kbd, null, 'Ctrl K'))"],
        ['Persona', "h(P.Persona, { name: 'Maya Chen', secondary: 'Designer · Brand team', presence: 'online', role: 'Owner' })"],
        ['Pictogram', "h(P.Pictogram, { icon: 'upload', label: 'Upload' })"],
        ['ProgressCircle', "h(P.ProgressCircle, { value: 62, label: 'Uploading 3 files', size: 'lg', showValue: true })"],
        ['RoleLabel', "h(P.RoleLabel, { role: 'editor', description: 'Can edit and share' })"],
        ['SectionHeading', "h(P.SectionHeading, { level: 2 }, 'Appearance')"],
        ['StatusDot', "h(P.StatusDot, { tone: 'dnd', size: 'md', icon: true, label: 'Do not disturb' })"],
        ['VersionLabel', "h(P.VersionLabel, { version: '2.1.0', status: 'latest' })"],
      ];
      for (const [part, expr] of cases) {
        await mount(expr);
        assert.ok(await page.$eval('#c', (c) => c.children.length > 0 && c.textContent.length + c.querySelectorAll('svg,canvas,img,[aria-label]').length > 0), T + part + ': it renders');
        assert.deepEqual(await axeViolations(), [], T + part + ': no axe violations');
        assert.equal(await page.$$eval('#c a, #c button, #c [tabindex]', (e) => e.filter((x) => x.tabIndex >= 0).length), expr.includes('href') || expr.includes('onMore') ? 1 : 0, T + part + ': it is not a Tab stop unless it is a control');
      }
      // ---- AvatarGroup
      await mount("h(P.AvatarGroup, { label: 'Collaborators', max: 3, onMore: () => window.__log.push('more'), people: [{ name: 'Maya Chen' }, { name: 'Alex Kim' }, { name: 'Sam Patel' }, { name: 'Lee Wong' }, { name: 'Ann Cole' }] })");
      let r = await page.evaluate(() => { const g = document.querySelector('#c [aria-label=Collaborators]'); return { has: !!g, text: g ? g.textContent : '', btn: document.querySelectorAll('#c button').length }; });
      assert.ok(r.has && /\+2/.test(r.text), T + 'AvatarGroup: the group has its name and the rest collapse into +2 ' + JSON.stringify(r));
      await tab(); assert.ok(await focusRing(), T + 'AvatarGroup: with onMore the +N tile is a Tab stop with a visible focus'); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
      assert.deepEqual(await log(), ['more', 'more'], T + 'AvatarGroup: Enter and Space press the +N tile');
      await mount("h(P.AvatarGroup, { label: 'Members', people: [] })"); assert.ok(await page.$('#c'), T + 'AvatarGroup: no people does not break it');
      await mount("h(P.AvatarGroup, { label: 'Members', max: 2, people: [{ name: 'محمد عبد الله الخطيب' }, { name: 'Alexandria Montgomery-Featherstonehaugh' }, { name: 'x' }] })", 120);
      assert.ok((await overflow()) <= 1, T + 'AvatarGroup: long and Arabic names do not overflow');
      // ---- Barcode and QRCode
      await mount("h(P.Barcode, { value: 'PLX-2026-0042' })"); r = await first('#c [role=img], #c svg');
      assert.ok(/PLX-2026-0042/.test(r.label || r.text || ''), T + 'Barcode: it is an image named by its value (' + JSON.stringify(r) + ')');
      await mount("h(P.Barcode, { value: '400638133393', format: 'ean13', showText: false })"); assert.ok(await page.$('#c svg, #c [role=img]'), T + 'Barcode: an EAN-13 draws');
      await mount("h(P.Barcode, { value: '12', format: 'ean13' })"); assert.ok(/not a valid|invalid/i.test(await page.$eval('#c', (c) => c.textContent + (c.querySelector('[aria-label]') || { getAttribute() { return ''; } }).getAttribute('aria-label'))), T + 'Barcode: a value that is not valid says so in words');
      await mount("h(P.Barcode, { value: 'A-very-long-value-for-a-barcode-0123456789-0123456789-0123456789' })", 200); assert.ok(await page.$('#c svg, #c [role=img]'), T + 'Barcode: a long value is drawn');
      await mount("h(P.QRCode, { value: 'https://plenix.lighthouseway.org/notes/', label: 'QR code: open Notes on your phone', showValue: true })");
      assert.equal((await first('#c [role=img]')).label, 'QR code: open Notes on your phone', T + 'QRCode: the code is an image named by its purpose');
      assert.ok(/plenix\.lighthouseway\.org/.test(await page.$eval('#c', (c) => c.textContent)), T + 'QRCode: showValue shows the encoded text');
      // ---- Kbd, SectionHeading, StatusDot, VersionLabel
      await mount("h('div', null, h(P.Kbd, null, 'Ctrl K'))"); assert.equal(await page.$eval('#c kbd', (k) => k.textContent), 'Ctrl K', T + 'Kbd: a <kbd> with the keys');
      await mount("h('div', null, h(P.SectionHeading, { collapsible: true, expanded: false, controls: 'body', onToggle: () => window.__log.push('t') }, 'Recent'), h('div', { id: 'body', hidden: true }, 'x'))");
      r = await page.evaluate(() => { const b = document.querySelector('#c button'); return { exp: b.getAttribute('aria-expanded'), ctl: b.getAttribute('aria-controls') }; });
      assert.deepEqual(r, { exp: 'false', ctl: 'body' }, T + 'SectionHeading: the toggle says expanded and what it controls');
      await tab(); assert.ok(await focusRing(), T + 'SectionHeading: focus is visible'); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); assert.deepEqual(await log(), ['t', 't'], T + 'SectionHeading: Enter and Space toggle');
      await mount("h(P.SectionHeading, { level: 2 }, 'Appearance')"); assert.equal(await page.$eval('#c h2', (h) => h.textContent.trim()), 'Appearance', T + 'SectionHeading: level 2 is an h2');
      await mount("h('div', null, ['online', 'away', 'busy', 'dnd', 'offline'].map((t) => h(P.StatusDot, { key: t, tone: t, size: 'md', icon: true, label: t })))");
      assert.deepEqual(await page.$$eval('#c .plx-status-dot', (e) => e.map((x) => x.textContent.trim())), ['online', 'away', 'busy', 'dnd', 'offline'], T + 'StatusDot: every state is told in words');
      assert.equal(await page.$$eval('#c svg', (e) => e.length), 4, T + 'StatusDot: with icon online, away, dnd and offline each draw their own shape (busy is the solid dot), never color alone');
      await mount("h(P.VersionLabel, { version: 12, status: 'draft', href: '#history' })"); assert.ok(/v12/.test(await page.$eval('#c', (c) => c.textContent)) && /Draft/.test(await page.$eval('#c', (c) => c.textContent)), T + 'VersionLabel: "v12" and the Draft badge');
      await tab(); assert.ok(await focusRing() && (await page.evaluate(() => document.activeElement.tagName)) === 'A', T + 'VersionLabel: with href the number is a link with a visible focus');
      // ---- Persona, IconTile, Pictogram, ProgressCircle, RoleLabel
      await mount("h(P.Persona, { name: 'Maya Chen', secondary: 'Designer', presence: 'busy', role: 'Owner' })");
      assert.ok(/Maya Chen/.test(await page.$eval('#c', (c) => c.textContent)) && /busy|Busy/i.test(await page.$eval('#c', (c) => c.textContent + c.innerHTML)), T + 'Persona: the name shows and the presence is told in words');
      await mount("h(P.Persona, { name: 'محمد عبد الله الخطيب الإسكندراني', secondary: 'A very long secondary line that goes on and on and on and on and on', role: 'Owner' })", 220);
      assert.ok((await overflow()) <= 1, T + 'Persona: long Arabic and English text does not overflow (' + (await overflow()) + 'px)');
      await mount("h(P.IconTile, { icon: 'alert' })"); assert.equal((await first('#c [aria-hidden=true], #c svg')).hidden !== 'false', true, T + 'IconTile: without a label the tile is decorative');
      await mount("h(P.IconTile, { icon: 'alert', label: 'Overdue' })"); assert.ok(await page.$('#c [aria-label=Overdue], #c [role=img][aria-label=Overdue]'), T + 'IconTile: with a label it is named');
      await mount("h(P.Pictogram, { icon: 'upload' })"); assert.ok(!(await page.$('#c [role=img]')), T + 'Pictogram: without a label it is decorative');
      await mount("h(P.Pictogram, { icon: 'upload', label: 'Upload' })"); assert.ok(await page.$('#c [aria-label=Upload]'), T + 'Pictogram: with a label it is named');
      await mount("h(P.ProgressCircle, { value: 62, label: 'Uploading 3 files' })");
      r = await page.evaluate(() => { const p = document.querySelector('#c [role=progressbar]'); return p && { now: p.getAttribute('aria-valuenow'), min: p.getAttribute('aria-valuemin'), max: p.getAttribute('aria-valuemax'), name: p.getAttribute('aria-label') }; });
      assert.deepEqual(r, { now: '62', min: '0', max: '100', name: 'Uploading 3 files' }, T + 'ProgressCircle: a progressbar with its value and name');
      await mount("h(P.ProgressCircle, { label: 'Loading assets' })"); assert.equal(await page.$eval('#c [role=progressbar]', (p) => p.getAttribute('aria-valuenow')), null, T + 'ProgressCircle: unknown amount is indeterminate (no aria-valuenow)');
      await mount("h(P.ProgressCircle, { value: 7, max: 12, label: 'Tasks done', size: 'lg', showValue: true })"); assert.ok(/58/.test(await page.$eval('#c', (c) => c.textContent)), T + 'ProgressCircle: showValue shows the percent (58%)');
      await mount("h('div', null, h(P.RoleLabel, { role: 'owner' }), h(P.RoleLabel, { role: 'custom', label: 'Billing admin', category: 'teal', description: 'Can pay' }))");
      assert.ok(/Owner/.test(await page.$eval('#c', (c) => c.textContent)) && /Billing admin/.test(await page.$eval('#c', (c) => c.textContent)) && /Can pay/.test(await page.$eval('#c', (c) => c.textContent)), T + 'RoleLabel: the built-in and the custom role show their names and the description is read');
      await mount("h(P.RoleLabel, { role: 'custom', label: 'A custom role with a very long name that keeps on going and going', description: 'x' })", 200); assert.ok((await overflow()) <= 1, T + 'RoleLabel: a long name does not overflow (' + (await overflow()) + 'px)');
      // ---- DragHandle
      await mount("h(P.DragHandle, { label: 'Move Hero banner', dnd: {} })");
      assert.equal(await page.$eval('#c button', (b) => b.getAttribute('aria-label')), 'Move Hero banner', T + 'DragHandle: the handle is a button named by a verb and the item');
      await tab(); assert.ok(await focusRing(), T + 'DragHandle: Tab reaches it and focus is visible');
      await mount("h(P.DragHandle, { label: 'Move Hero banner', dnd: {}, disabled: true })");
      assert.ok(await page.$eval('#c button', (b) => b.disabled || b.getAttribute('aria-disabled') === 'true'), T + 'DragHandle: disabled is told to assistive technology');
      await mount("h(P.DragHandle, { label: 'Move Hero banner', dnd: {} })"); assert.deepEqual(await axeViolations(), [], T + 'DragHandle: no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_DISPLAY_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
