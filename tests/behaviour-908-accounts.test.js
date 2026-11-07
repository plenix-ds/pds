/* Plenix tests · plan §7e baseline behaviour tests, authentication and permissions patterns (issue 908): ConnectedAccounts, ConnectedAccount.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: ConnectedAccounts (one heading per service and every status in words; Connect asks first, lists what Plenix may do, moves focus into the question, hands over only on Continue; Escape cancels and returns focus;
     Disconnect says what stops working; Reconnect runs at once; busy is aria-busy and fires nothing; empty and long text do not break it), ConnectedAccount (one row).
   Usage: node tests/behaviour-908-accounts.test.js   → BEHAVIOUR_908_ACCOUNTS_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9912, server = await serve(PORT); let browser;
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
      // ---- ConnectedAccounts
      const accounts = "[{ id: 'drive', service: 'Google Drive', icon: 'folder', description: 'Open and save files from your Drive.', status: 'connected', account: 'maya@example.com', connectedAt: '2026-10-02', scopes: ['See and open the files you choose', 'Save new files to a Plenix folder'], loses: 'Files linked from Drive stop opening in Plenix.' }, { id: 'mail', service: 'Mailchimp', icon: 'mail', status: 'error', account: 'parish-office', error: 'Access expired on Oct 12.' }, { id: 'cal', service: 'Calendar', status: 'disconnected', scopes: ['Read your events'] }]";
      const handlers = "onConnect: (a) => window.__log.push('connect ' + a.id), onDisconnect: (a) => window.__log.push('disconnect ' + a.id), onReconnect: (a) => window.__log.push('reconnect ' + a.id)";
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: " + accounts + ", " + handlers + " })");
      let r = await page.evaluate(() => { const list = document.querySelector('#c [aria-label="Connected accounts"]'); return { has: !!list, text: document.getElementById('c').textContent, headings: [...document.querySelectorAll('#c h3')].map((h) => h.textContent.trim()), buttons: [...document.querySelectorAll('#c button')].map((b) => b.textContent.trim()) }; });
      assert.ok(r.has, T + 'ConnectedAccounts: the list has its accessible name');
      assert.deepEqual(r.headings, ['Google Drive', 'Mailchimp', 'Calendar'], T + 'ConnectedAccounts: one heading per service');
      assert.ok(/Connected/.test(r.text) && /Connection error/.test(r.text) && /Not connected/.test(r.text), T + 'ConnectedAccounts: every status is told in words');
      assert.ok(/maya@example\.com/.test(r.text) && /Access expired/.test(r.text), T + 'ConnectedAccounts: the account and the error show');
      assert.deepEqual(r.buttons, ['Disconnect', 'Reconnect', 'Disconnect', 'Connect'], T + 'ConnectedAccounts: each row has its own actions (a failed connection offers Reconnect and Disconnect)');
      // Connect asks first, then hands over
      await tab(4); assert.equal(await focused(), 'Connect', T + 'ConnectedAccounts: Tab reaches Connect'); assert.ok(await focusRing(), T + 'ConnectedAccounts: focus is visible');
      await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 500));
      assert.ok(await page.$('[role=dialog],[role=alertdialog]') && /Connect Calendar\?/.test(await page.$eval('[role=dialog],[role=alertdialog]', (d) => d.textContent)) && /Read your events/.test(await page.$eval('[role=dialog],[role=alertdialog]', (d) => d.textContent)), T + 'ConnectedAccounts: Connect asks first and lists what Plenix may do');
      assert.ok(await page.evaluate(() => !!document.activeElement.closest('[role=dialog],[role=alertdialog]')), T + 'ConnectedAccounts: focus moves into the question');
      assert.deepEqual(await log(), [], T + 'ConnectedAccounts: nothing is handed over before the question is answered');
      assert.deepEqual(await axeViolations(), [], T + 'ConnectedAccounts: no axe violations with the question open');
      await page.keyboard.press('Escape'); await new Promise((res) => setTimeout(res, 400));
      assert.deepEqual(await log(), [], T + 'ConnectedAccounts: Escape cancels, nothing runs'); assert.equal(await focused(), 'Connect', T + 'ConnectedAccounts: focus returns to the button');
      await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 500));
      await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button, [role=alertdialog] button')].find((b) => /^Continue/.test(b.textContent.trim())).click()); await new Promise((res) => setTimeout(res, 300));
      assert.deepEqual(await log(), ['connect cal'], T + 'ConnectedAccounts: Continue runs onConnect once');
      // Disconnect says what stops working
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: " + accounts + ", " + handlers + " })");
      await tab(); await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 500));
      assert.ok(/Files linked from Drive stop opening/.test(await page.$eval('[role=dialog],[role=alertdialog]', (d) => d.textContent)), T + 'ConnectedAccounts: Disconnect says what stops working');
      await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button, [role=alertdialog] button')].find((b) => /^Disconnect/.test(b.textContent.trim())).click()); await new Promise((res) => setTimeout(res, 300));
      assert.deepEqual(await log(), ['disconnect drive'], T + 'ConnectedAccounts: confirming Disconnect runs onDisconnect once');
      // Reconnect needs no question
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: " + accounts + ", " + handlers + " })");
      await page.evaluate(() => [...document.querySelectorAll('#c button')].find((b) => b.textContent.trim() === 'Reconnect').click()); assert.deepEqual(await log(), ['reconnect mail'], T + 'ConnectedAccounts: Reconnect runs at once, without a question');
      // busy
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: [{ id: 'drive', service: 'Google Drive', status: 'connected', busy: true }], " + handlers + " })");
      assert.equal(await page.$eval('#c button', (b) => b.getAttribute('aria-busy')), 'true', T + 'ConnectedAccounts: while busy the button is aria-busy');
      await page.click('#c button'); assert.deepEqual(await log(), [], T + 'ConnectedAccounts: a click while busy does nothing');
      // empty and long
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: [] })"); assert.ok(await page.$('#c [aria-label="Connected accounts"]'), T + 'ConnectedAccounts: no accounts does not break it');
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: [{ id: 'x', service: 'A service with a very long name that goes on and on and on and on', description: 'A description three times as long as the English one, going on and on and on and on and on and on', status: 'connected', account: 'a-very-long-account-name-that-keeps-going@a-very-long-domain-name.example.org', connectedAt: '2026-10-02' }] })", 320);
      assert.ok((await overflow()) <= 1, T + 'ConnectedAccounts: long text wraps, no overflow (' + (await overflow()) + 'px)');
      await mount("h(P.ConnectedAccount, { account: { id: 'drive', service: 'Google Drive', status: 'connected', account: 'maya@example.com' }, onDisconnect() {} })");
      assert.ok(/Google Drive/.test(await page.$eval('#c', (c) => c.textContent)), T + 'ConnectedAccounts: one ConnectedAccount row renders alone');
      await mount("h(P.ConnectedAccounts, { label: 'Connected accounts', accounts: " + accounts + " })");
      assert.deepEqual(await axeViolations(), [], T + 'ConnectedAccounts: no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_ACCOUNTS_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
