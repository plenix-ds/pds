/* Plenix tests · #1268 (perf on-demand 4/4, ADR 0052): the review parts are one module per name, and nothing a person sees changed.
   Summary: WorkflowStatus, WORKFLOW_STATUSES, ReviewFlow, ReviewQueue, ApprovalWorkflow and MetricCard (guarded, unchanged: see the issue) still work from the one public entry, left to right and right to left.
   Checks: AC-1 each part draws its content (a MetricCard of the chart types too: trend, gauge, donut); AC-2 WorkflowStatus, ReviewFlow and ReviewQueue each have their own module, the
     public entries export from them, and the status module imports no review code (the source check, no browser); AC-4 the published type names stay public; AC-5 no script error or
     console warning.
   Proof first: the byte limits of these entries in tools/checks/perf-budget.json fail on main's build (WorkflowStatus loaded all of ReviewFlow and ReviewQueue).
   Usage: node tests/review-metric-modules-1268.test.js   → REVIEW_METRIC_MODULES_1268_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const { serve, launch } = require('./lib');
require('./limit.js');
const root = path.join(__dirname, '..'), read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const dir = 'platform/patterns/ReviewFlow/';
// AC-2: one module per name
for (const [name, mod] of [['WorkflowStatus', 'WorkflowStatus'], ['WORKFLOW_STATUSES', 'WorkflowStatus'], ['ReviewFlow', 'ReviewFlow'], ['ReviewQueue', 'ReviewQueue']]) {
  assert.ok(fs.existsSync(path.join(root, dir, mod + '.tsx')), 'AC-2: ' + mod + ' has its own module');
  for (const f of ['platform/index.ts', 'platform/exports/w10B.ts']) assert.ok(new RegExp('export \\{[^}]*\\b' + name + '\\b[^}]*\\} from \'[./]+/patterns/ReviewFlow/' + mod + '\\.tsx\'').test(read(f)), 'AC-2: ' + f + ' exports ' + name + ' from ' + mod + '.tsx');
}
assert.ok(!/ReviewFlow\.tsx|ReviewQueue\.tsx|DataGrid|CommandBar|PromptDialog/.test(read(dir + 'WorkflowStatus.tsx').replace(/\/\*[\s\S]*?\*\//g, '')), 'AC-2: WorkflowStatus.tsx imports no review or grid code');
assert.ok(!/export function ReviewQueue/.test(read(dir + 'ReviewFlow.tsx')) && !/export function WorkflowStatus/.test(read(dir + 'ReviewFlow.tsx')), 'AC-2: ReviewFlow.tsx holds only ReviewFlow');
assert.ok(!/DataGrid|CommandBar|PromptDialog/.test(read(dir + 'ReviewFlow.tsx').replace(/\/\*[\s\S]*?\*\//g, '')), 'AC-2: ReviewFlow.tsx draws no queue (grid, command bar, prompt dialog)');
for (const f of ['platform/patterns/ApprovalWorkflow/ApprovalWorkflow.tsx', 'platform/patterns/Publish/Publish.tsx'])
  assert.ok(!/from '\.\.\/ReviewFlow\/ReviewQueue\.tsx'/.test(read(f)), 'AC-2: ' + f + ' does not load the queue');
// AC-4: type names the part has published since before the split
const names = 'WorkflowStatusName ReviewDecision WorkflowStatusProps Reviewer ReviewEntry ReviewFlowProps ReviewQueueItem ReviewQueueProps ApprovalReviewer ApprovalStep ApprovalWorkflowProps MetricCardProps MetricStatus MetricChange MetricRow MetricPart MetricSide MetricItem MetricFigure MetricPerson MetricMonth MetricColor MetricGauge'.split(' ');
const fixture = read('tests/fixtures/published-names-1.8.0-review-metric.txt').split('\n').filter((l) => l && !l.startsWith('#'));
assert.deepEqual(fixture.slice().sort(), names.slice().sort(), 'AC-4: the fixture lists the public type names of these parts');
(async () => {
  const PORT = +process.env.TEST_PORT || 9828, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const d of ['ltr', 'rtl']) {
      const T = d + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type()) && !/Failed to load resource|net::/.test(m.text())) errors.push(m.type() + ': ' + m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (d) => {
        document.documentElement.setAttribute('dir', d);
        const h = React.createElement, P = Plenix, noop = () => {}, out = {};
        const reviewers = [{ id: 'a', name: 'Ann', decision: 'approved' }, { id: 'b', name: 'Bo' }];
        const steps = [{ id: 's1', label: 'Design', reviewers: [{ id: 'ann', name: 'Ann' }] }, { id: 's2', label: 'Legal', reviewers: [{ id: 'bo', name: 'Bo' }] }];
        const items = [{ id: 1, name: 'Easter banner', type: 'Image', submittedBy: 'Maya Chen', submitted: '2026-11-01', status: 'in-review' }];
        const cases = {
          WorkflowStatus: h(P.WorkflowStatus, { status: 'approved' }),
          ReviewFlow: h(P.ReviewFlow, { title: 'Easter banner', status: 'in-review', reviewers, onDecision: noop }),
          ReviewQueue: h(P.ReviewQueue, { label: 'Waiting for review', items, onDecision: noop }),
          ApprovalWorkflow: h(P.ApprovalWorkflow, { title: 'Artwork approval', steps, reviewerId: 'ann', onDecision: noop }),
          'MetricCard value': h(P.MetricCard, { title: 'Open tasks', value: '128', change: { amount: '12', direction: 'up', versus: 'since last week' } }),
          'MetricCard trend': h(P.MetricCard, { type: 'trend', title: 'Assets added', value: '1,284', trend: [38, 41, 40, 44, 47, 52], trendVariant: 'area' }),
          'MetricCard gauge': h(P.MetricCard, { type: 'gauge', title: 'Storage used', gauge: { value: 72, format: (v) => v + '%', label: 'of 100 GB' } }),
          'MetricCard donut': h(P.MetricCard, { type: 'breakdown', breakdown: 'donut', title: 'Files', value: '10', parts: [{ label: 'Images', value: 6 }, { label: 'Video', value: 4 }] }),
        };
        for (const [name, el] of Object.entries(cases)) {
          const c = document.createElement('div'); c.id = 'c-' + name.replace(/ /g, '-'); document.body.appendChild(c);
          try { const root = ReactDOM.createRoot(c); root.render(h(P.ToastProvider || React.Fragment, null, el)); await new Promise((x) => setTimeout(x, 1200)); out[name] = { text: c.textContent.trim().length, busy: c.querySelectorAll('[aria-busy="true"]').length }; } catch (e) { out[name] = 'threw: ' + e.message; }
        }
        return out;
      }, d);
      const empty = Object.entries(r).filter(([, v]) => !(v && typeof v === 'object' && v.text > 0));
      assert.deepEqual(empty, [], T + 'AC-1: every part draws its content: ' + JSON.stringify(r));
      await page.close();
    }
    assert.deepEqual(errors, [], 'AC-5: no script error or console warning: ' + JSON.stringify(errors.slice(0, 5)));
    console.log('REVIEW_METRIC_MODULES_1268_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
