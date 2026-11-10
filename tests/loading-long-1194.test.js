/* Plenix tests · LoadingState's 10-second stage (issue 1194, D-0158, D-0159, ADR 0051, design 1194): a second line and an optional Cancel after the long wait.
   Summary: the long wait is a token (--plx-sys-motion-loading-long-delay, 10 s); the test shortens it on the page to read it. Nothing is drawn before the region delay; then the ring and label with no second line and no Cancel;
     after the long wait the label stays, a second line "This is taking longer than usual." is filled into its own polite status (announced once), and Cancel shows only with onCancel and calls it once; with progress there is
     no second line and Cancel still shows; focus never moves; a nested LoadingState shows no stage; reduced motion keeps the wait. Left to right and right to left.
   Proof first: before the change there is no long stage: the label stays alone for ever, and the token does not exist.
   Usage: node tests/loading-long-1194.test.js   → LOADING_LONG_1194_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9991, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const token = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-motion-loading-long-delay').trim());
      assert.ok(/^10s$|^10000ms$/.test(token), T + 'the long wait is a 10 s token (' + token + ')');
      // shorten the waits on the page: 1 s region (as is) and a 2.5 s long wait
      const mount = (props) => page.evaluate(async (dir, props) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.style.setProperty('--plx-sys-motion-loading-long-delay', '2500ms');
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount(); window.__cancels = 0;
        const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '420px'; document.querySelector('main').replaceChildren(c);
        const btn = document.createElement('button'); btn.id = 'other'; btn.textContent = 'Other'; document.body.prepend(btn); btn.focus();
        const extra = props.cancel ? { onCancel: () => { window.__cancels++; } } : {}, inner = props.nested ? h(P.LoadingState, Object.assign({ label: 'Inner' }, extra)) : null;
        window.__root = ReactDOM.createRoot(c); window.__root.render(h(P.LoadingState, Object.assign({ label: 'Loading cases…', children: inner }, props.progress ? { progress: 40 } : {}, extra)));
      }, dir, props);
      const look = () => page.evaluate(() => { const c = document.getElementById('c'), st = [...c.querySelectorAll('[role=status]')];
        const line = c.querySelector('.plx-loading-state__slow'), cancel = [...c.querySelectorAll('button')].find((b) => /cancel/i.test(b.textContent));
        return { statuses: st.length, label: (c.querySelector('.plx-spinner__label') || {}).textContent || null, line: line ? line.textContent.trim() : null, lineStatus: line ? line.getAttribute('role') : null, cancel: !!cancel,
          lineColor: line ? getComputedStyle(line).color : null, focus: document.activeElement && document.activeElement.id, bars: c.querySelectorAll('progress, [role=progressbar]').length, texts: c.textContent }; });
      // no progress, with Cancel
      await mount({ cancel: true }); await wait(400); let r = await look(); assert.equal(r.statuses + (r.label ? 1 : 0), 0, T + 'nothing before the region delay');
      await wait(1000); r = await look(); assert.equal(r.label, 'Loading cases…', T + 'the ring and label at 1 s'); assert.ok(!r.line && !r.cancel, T + 'no second line and no Cancel yet');
      await wait(1600); r = await look(); assert.equal(r.label, 'Loading cases…', T + 'the label stays after the long wait'); assert.equal(r.line, 'This is taking longer than usual.', T + 'the second line appears'); assert.equal(r.lineStatus, 'status', T + 'it is its own status');
      assert.ok(r.cancel, T + 'Cancel shows with onCancel'); assert.equal(r.focus, 'other', T + 'focus did not move'); assert.notEqual(r.lineColor, null);
      await page.evaluate(() => [...document.querySelectorAll('#c button')].find((b) => /cancel/i.test(b.textContent)).click()); await wait(100); assert.equal(await page.evaluate(() => window.__cancels), 1, T + 'Cancel calls onCancel once');
      // no onCancel: no button
      await mount({}); await wait(4200); r = await look(); assert.ok(r.line && !r.cancel, T + 'without onCancel there is the line and no button');
      // progress
      await mount({ progress: true, cancel: true }); await wait(4200); r = await look(); assert.equal(r.bars, 1, T + 'with progress the bar shows'); assert.ok(!r.line, T + 'no second line with progress'); assert.ok(r.cancel, T + 'Cancel still shows with progress');
      // nested: only the outer state shows the stage
      await mount({ nested: true, cancel: true }); await wait(4200); r = await look(); assert.equal((r.texts.match(/taking longer/g) || []).length, 1, T + 'a nested state shows one stage');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('LOADING_LONG_1194_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
