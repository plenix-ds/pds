/* Plenix tests · baseline behaviour (plan 7e) of ApprovalWorkflow, ArchiveRestore, AuditLog and CommentThread (issue 908).
   Summary (the browser, left to right and right to left, dev React, no console warnings):
     ApprovalWorkflow: only the assigned, undecided reviewer in the open stage can decide (a sequential later stage, another person and the read-only variant cannot); approve calls
       onDecision({ stepId, reviewerId, decision, comment }) once; reject and changes need a reason and call nothing without it; a failure keeps the comment and says so;
       the buttons are disabled while it saves
     ArchiveRestore: Archive calls onArchive once and a second press while it works does nothing; archived shows the banner with Restore; a failure says so and keeps the state;
       the content is always shown
     AuditLog: a table of the events with the actor, time, action and target; the diff variant opens the selected event's changes in a dialog, Close and Escape close it and focus
       returns to View changes; entries are text, never HTML; no entries draws an empty table
     CommentThread: the thread is named; Reply submits nonblank text once and clears only after success; blank text says so and sends nothing; a failed reply keeps the draft and says so;
       a resolved thread has no reply field; Resolve calls onResolve(true)
   Usage: node tests/behaviour-patterns-workflow-908.test.js   -> BEHAVIOUR_PATTERNS_WORKFLOW_908_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9915, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 900 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((dir) => { document.documentElement.setAttribute('dir', dir); window.__log = []; window.__fail = false; window.__hold = null;
        window.__mount = async (node) => { window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:700px"></div>';
          window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(node); await new Promise((r) => setTimeout(r, 500)); };
        window.__call = (name, arg) => { window.__log.push(name + ':' + JSON.stringify(arg)); if (window.__hold) return new Promise((res) => { window.__release = res; }); return window.__fail ? Promise.reject(new Error('no')) : Promise.resolve(); }; }, dir);
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const press = (name) => page.evaluate((name) => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === name); if (b) b.click(); return !!b; }, name);
      const has = (name) => page.evaluate((name) => [...document.querySelectorAll('button')].some((x) => x.textContent.trim() === name && !x.disabled), name);

      // ApprovalWorkflow
      const steps = [{ id: 's1', label: 'Design', reviewers: [{ id: 'ann', name: 'Ann' }] }, { id: 's2', label: 'Legal', reviewers: [{ id: 'bo', name: 'Bo' }] }];
      const aw = (props) => page.evaluate(async (steps, props) => { const h = React.createElement, P = Plenix; window.__log = []; window.__hold = null; window.__fail = false;
        await window.__mount(h(P.ApprovalWorkflow, Object.assign({ title: 'Artwork approval', steps, onDecision: (d) => window.__call('decision', d) }, props))); }, steps, props);
      await aw({ reviewerId: 'ann' });
      assert.ok(await has('Approve'), T + 'the assigned reviewer of the open stage can approve'); assert.equal(await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === 'Approve').length), 1, T + 'the later stage has no decision buttons');
      await press('Reject'); await wait(200); assert.deepEqual(await page.evaluate(() => window.__log), [], T + 'a rejection without a reason calls nothing'); assert.ok(/Explain why/.test(await page.evaluate(() => document.body.textContent)), T + 'it asks for the reason');
      await page.type('textarea', 'Not on brand'); await press('Reject'); await wait(300);
      assert.deepEqual(await page.evaluate(() => window.__log), ['decision:' + JSON.stringify({ stepId: 's1', reviewerId: 'ann', decision: 'rejected', comment: 'Not on brand' })], T + 'the decision carries the stage, reviewer, decision and comment');
      await aw({ reviewerId: 'ann' }); await page.evaluate(() => { window.__fail = true; }); await page.type('textarea', 'Please fix'); await press('Request changes'); await wait(300);
      assert.ok(/Could not save this decision/.test(await page.evaluate(() => document.body.textContent)), T + 'a failure is told'); assert.equal(await page.$eval('textarea', (t) => t.value), 'Please fix', T + 'a failure keeps the comment');
      await aw({ reviewerId: 'zed' }); assert.equal(await has('Approve'), false, T + 'another person cannot decide');
      await aw({ reviewerId: 'bo' }); assert.equal(await has('Approve'), false, T + 'a later stage is locked while an earlier one is open');
      await aw({ reviewerId: 'ann', variant: 'status' }); assert.equal(await has('Approve'), false, T + 'the status variant is read only');
      await aw({ reviewerId: 'ann', variant: 'parallel' }); await page.evaluate(() => { window.__hold = true; }); await press('Approve'); await wait(200);
      assert.equal(await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Approve').disabled), true, T + 'the buttons are disabled while it saves');
      await page.evaluate(() => { window.__release && window.__release(); }); await wait(200);

      // ArchiveRestore
      const ar = (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__log = []; window.__hold = null; window.__fail = false;
        await window.__mount(h(P.ArchiveRestore, Object.assign({ onArchive: () => window.__call('archive', 1), onRestore: () => window.__call('restore', 1) }, props), h('p', { id: 'rec' }, 'Record content'))); }, props);
      await ar({ archived: false }); assert.ok(await page.$('#rec'), T + 'the content is shown'); await page.evaluate(() => { window.__hold = true; }); await press('Archive'); await wait(150); await press('Archive'); await wait(100);
      assert.deepEqual(await page.evaluate(() => window.__log), ['archive:1'], T + 'a second press while it works does nothing'); await page.evaluate(() => window.__release()); await wait(200);
      await ar({ archived: true }); assert.ok(/Archived/.test(await page.evaluate(() => document.body.textContent)) && await has('Restore'), T + 'archived shows the banner and Restore');
      await page.evaluate(() => { window.__fail = true; }); await press('Restore'); await wait(300); assert.ok(/Could not update the record/.test(await page.evaluate(() => document.body.textContent)), T + 'a failure is told'); assert.ok(await has('Restore'), T + 'a failure keeps the archived state');

      // AuditLog
      const entries = [{ id: 'e1', actor: { name: 'Ann Lee' }, at: '2026-11-01T10:00:00Z', action: 'Updated', target: '<b>Invoice 12</b>', changes: [{ field: 'Status', before: 'Draft', after: 'Sent' }] }, { id: 'e2', actor: { name: 'Bo' }, at: '2026-11-02T10:00:00Z', action: 'Viewed', target: 'Invoice 12', changes: [] }];
      await page.evaluate(async (entries) => { const h = React.createElement, P = Plenix; await window.__mount(h(P.AuditLog, { entries, variant: 'diff', label: 'Workspace history' })); }, entries);
      const text = await page.evaluate(() => document.querySelector('#c').textContent); assert.ok(/Ann Lee/.test(text) && /Updated/.test(text) && /Invoice 12/.test(text), T + 'the events show');
      assert.equal(await page.evaluate(() => !!document.querySelector('#c b'), 0), false, T + 'a target is text, never HTML');
      await page.focus('#c button'); await page.keyboard.press('Enter'); await wait(500);
      assert.ok(await page.$('[role="dialog"]'), T + 'View changes opens the event'); assert.ok(/Draft/.test(await page.$eval('[role="dialog"]', (d) => d.textContent)) && /Sent/.test(await page.$eval('[role="dialog"]', (d) => d.textContent)), T + 'it shows before and after');
      await page.keyboard.press('Escape'); await wait(400); assert.equal(await page.$('[role="dialog"]'), null, T + 'Escape closes it');
      assert.ok(await page.evaluate(() => document.activeElement && document.activeElement.textContent.trim() === 'View changes'), T + 'focus returns to View changes');
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; await window.__mount(h(P.AuditLog, { entries: [], label: 'Empty history' })); }); assert.ok(await page.$('#c'), T + 'no entries draws without error');

      // CommentThread
      const ct = (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__log = []; window.__hold = null; window.__fail = false;
        await window.__mount(h(P.CommentThread, Object.assign({ comments: [{ id: 1, author: { name: 'Ann' }, body: 'Looks good', time: '2026-11-01T10:00:00Z' }], onReply: (t) => window.__call('reply', t), onResolve: (n) => window.__call('resolve', n) }, props))); }, props);
      await ct({}); assert.equal(await page.$eval('[aria-label="Comments"]', (e) => !!e), true, T + 'the thread is named');
      await press('Send reply'); await wait(200); assert.deepEqual(await page.evaluate(() => window.__log), [], T + 'blank text sends nothing'); assert.ok(/Enter a reply/.test(await page.evaluate(() => document.body.textContent)), T + 'blank text says so');
      await page.type('textarea', '  Thanks  '); await press('Send reply'); await wait(300);
      assert.deepEqual(await page.evaluate(() => window.__log), ['reply:"Thanks"'], T + 'a reply is trimmed and sent once'); assert.equal(await page.$eval('textarea', (t) => t.value), '', T + 'the draft clears after success');
      await ct({}); await page.evaluate(() => { window.__fail = true; }); await page.type('textarea', 'Draft that fails'); await press('Send reply'); await wait(300);
      assert.equal(await page.$eval('textarea', (t) => t.value), 'Draft that fails', T + 'a failed reply keeps the draft'); assert.ok(/Could not save/.test(await page.evaluate(() => document.body.textContent)), T + 'a failure is told');
      await ct({ resolved: true }); assert.equal(await page.$('textarea'), null, T + 'a resolved thread has no reply field');
      await ct({}); await press('Resolve thread'); await wait(200); assert.deepEqual(await page.evaluate(() => window.__log), ['resolve:true'], T + 'Resolve calls onResolve(true)');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | ').slice(0, 400));
    console.log('BEHAVIOUR_PATTERNS_WORKFLOW_908_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
