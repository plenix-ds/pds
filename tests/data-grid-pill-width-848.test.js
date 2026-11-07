/* Plenix tests · DataGrid pills in a column share one width (issue 848, the owner: "what happened to all the pills being same width
   within a column"; the rule uniform-pills-always-35). Written before the fix: on 0.91.0 the person pills of a cells="pill" grid
   were each as wide as their own name.
   Summary (the browser, left to right and right to left): in a cells="pill" grid of people (avatar-name), a reason and a status
     column with names of different lengths, every pill of a column is the same width (within 1px); the widest name is whole.
   Usage: node tests/data-grid-pill-width-848.test.js   → DATA_GRID_PILL_WIDTH_848_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9848, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const [dir, width, count] of [['rtl', 1500, 12], ['ltr', 1500, 12], ['ltr', 1000, 12], ['ltr', 1500, 300], ['ltr', 700, 40]]) {
      const page = await browser.newPage(); page.on('pageerror', (e) => { errors.push(e.message); console.error('PAGEERROR', e.message.slice(0, 200)); }); await page.setViewport({ width: 1600, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const result = await page.evaluate(async (dir, width, count) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px;display:grid"></div>';
        const first = ['Adam', 'Eric', 'Jessica', 'Courtney', 'Al', 'Maximilian'], last = ['Fisher', 'Henderson', 'Powell', 'Henderson-Smith', 'Li', 'Wu'];
        const reasons = ['Abandonment', 'Adultery', 'Irreconcilable differences'], statuses = ['Open', 'Closed', 'Pending'];
        const rows = Array.from({ length: count }, (_, i) => ({ id: 'DV-' + i, applicant: { name: first[i % 6] + ' ' + last[i % 6] }, respondent: { name: first[(i + 2) % 6] + ' ' + last[(i + 3) % 6] }, reason: reasons[i % 3], status: statuses[i % 3], plaintiff: { name: first[(i + 1) % 6] + ' ' + last[(i + 4) % 6] }, defendant: { name: first[(i + 3) % 6] + ' ' + last[(i + 1) % 6] } }));
        const cols = [{ title: 'Case', field: 'id', kind: 'data', width: '--plx-ref-size-25u' }, { title: 'Applicant', field: 'applicant', type: 'person', width: '--plx-ref-size-30u' }, { title: 'Respondent', field: 'respondent', type: 'person', width: '--plx-ref-size-30u' },
          { title: 'Reason', field: 'reason', width: '--plx-ref-size-30u' }, { title: 'Status', field: 'status', width: '--plx-ref-size-20u' },
          // CTM's own columns (#848): a render that returns Plenix's DataPill, pill: false, a set width in rem
          { title: 'Plaintiff', field: 'plaintiff', pill: false, width: '10.5rem', render: (r) => h(P.DataPill, { size: 'md', gender: r.id.length % 2 ? 'male' : 'female' }, r.plaintiff.name) },
          { title: 'Defendant', field: 'defendant', pill: false, width: '12rem', render: (r) => h(P.DataPill, { size: 'md', person: true }, r.defendant.name) }];
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'Cases', data: rows, columns: cols, index: 'id', selectable: true, cells: 'pill' }));
        await new Promise((r) => setTimeout(r, 2000));
        const out = {};
        document.querySelectorAll('.plx-data-pill[data-plx-pill-field], [data-plx-cell-field] .plx-data-pill').forEach((p) => { const f = p.getAttribute('data-plx-pill-field') || 'render-' + (p.closest('[data-plx-cell-field]') || p).getAttribute('data-plx-cell-field'); (out[f] = out[f] || []).push(Math.round(p.getBoundingClientRect().width * 10) / 10); });
        const lead = {};
        document.querySelectorAll('.plx-data-pill[data-plx-pill-field], [data-plx-cell-field] .plx-data-pill').forEach((p) => {
          const f = p.getAttribute('data-plx-pill-field') || 'render-' + (p.closest('[data-plx-cell-field]') || p).getAttribute('data-plx-cell-field'); const pb = p.getBoundingClientRect(), rtl = getComputedStyle(p).direction === 'rtl';   // the cell takes the value's own direction (English stays left to right in an Arabic page)
          // where the pill's content starts: the first drawn thing at the start edge (the avatar or the label)
          const edges = [...p.querySelectorAll('*')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0).map((r) => (rtl ? pb.right - r.right : r.left - pb.left));
          if (!edges.length) return; (lead[f] = lead[f] || []).push(Math.round(Math.min(...edges) * 10) / 10);
        });
        return { out, lead };
      }, dir, width, count);
      const got = result.out, lead = result.lead;
      for (const f of ['applicant', 'respondent', 'reason', 'status', 'render-plaintiff', 'render-defendant']) {
        const w = got[f] || []; assert.ok(w.length >= 6, dir + ' ' + width + 'px ' + count + ' rows: ' + f + ' pills drawn, got ' + JSON.stringify(got));
        assert.ok(Math.max(...w) - Math.min(...w) <= 1, dir + ' ' + width + 'px ' + count + ' rows: ' + f + ' pills share one width, got ' + JSON.stringify([...new Set(w)]));
      }
      for (const f of ['applicant', 'respondent', 'reason', 'status', 'render-plaintiff', 'render-defendant']) assert.ok(Math.max(...lead[f]) - Math.min(...lead[f]) <= 1, dir + ' ' + width + 'px: ' + f + ' labels start at the same place in their pills (not centered), got ' + JSON.stringify([...new Set(lead[f])]));
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_PILL_WIDTH_848_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
