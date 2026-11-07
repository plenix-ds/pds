/* Plenix tests · issue 800, AC-3 in CTM's real "To assign" grid (owner, 0.91.0: "why such a huge column here for little text?").
   Summary: CTM's columns as the app gives them (static/ctm/council.js): Applicant and Respondent (minWidth 10.5rem, pill:false, render a person pill), Reason (minWidth 6.5rem, text),
     Years married (a number drawn through render as "13 years", minWidth 7.5rem and no width), Assigned to (minWidth 12rem, render a person pill), Actions (minWidth 7rem, render two
     small buttons). At about 2,000px: no column takes the spare room alone (Years married stays near its text, not 900px), the room is shared evenly across the columns that
     size themselves (the same added width within a few grid steps when the room grows by 300px), and nothing is cut. Left to right and right to left.
   Proof first: on 0.91.0 "Years married" took the leftover room.
   Usage: node tests/data-grid-static-share-848.test.js   → DATA_GRID_STATIC_SHARE_848_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9802, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 2400, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const probe = (width) => page.evaluate(async (dir, width) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px;display:grid"></div>';
        const names = ['Adam Fisher', 'Eric Henderson', 'Jessica Powell', 'Courtney Henderson'], reasons = ['Abandonment', 'Infidelity', 'Addiction', 'Abuse'];
        const rows = Array.from({ length: 12 }, (_, i) => ({ id: 'C-' + (100 + i), applicant: names[i % 4], respondent: names[(i + 1) % 4], reason: reasons[i % 4], married_years: i % 5 === 4 ? null : 3 + i, assigned: names[(i + 2) % 4], open_action: i }));
        const person = (name) => h('span', { className: 'plx-data-pill plx-data-pill--md plx-data-pill--soft' }, h('span', { className: 'plx-data-pill__value' }, name));
        const cols = [
          { title: 'Applicant', field: 'applicant', kind: 'name', minWidth: '10.5rem', pill: false, render: (r) => person(r.applicant) },
          { title: 'Respondent', field: 'respondent', minWidth: '10.5rem', pill: false, render: (r) => person(r.respondent) },
          { title: 'Reason', field: 'reason', minWidth: '6.5rem' },
          { title: 'Years married', field: 'married_years', minWidth: '7.5rem', pill: false, render: (r) => (r.married_years == null ? 'Not recorded' : r.married_years + ' years') },
          { title: 'Assigned to', field: 'assigned', minWidth: '12rem', pill: false, render: (r) => person(r.assigned) },
          { title: 'Actions', field: 'open_action', minWidth: '7rem', pill: false, render: () => h('span', { style: { display: 'inline-flex', gap: 4 } }, h(P.Button, { size: 'xs', icon: 'open' }, 'Open'), h(P.Button, { size: 'xs' }, 'Move')) },
        ];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.DataGrid, { label: 'To assign', data: rows, columns: cols, index: 'id', cells: 'pill', isStatic: true }));
        await new Promise((r) => setTimeout(r, 1500));
        const heads = [...document.querySelectorAll('#c [role=columnheader]')];
        return { cards: document.querySelectorAll('#c .plx-data-grid__grid-row--narrow').length, widths: heads.map((x) => ({ t: x.textContent.trim(), w: Math.round(x.getBoundingClientRect().width) })) };
      }, dir, width);
      const named = (r, n) => r.widths.find((x) => x.t.startsWith(n));
      const a = await probe(2000), b = await probe(2300);
      assert.equal(a.cards, 0, T + 'a table at 2,000px (isStatic, as CTM passes)');
      assert.ok(named(a, 'Years married').w <= 400, T + 'AC-3: "Years married" gets its even share, not the leftover room (' + named(a, 'Years married').w + 'px) ' + JSON.stringify(a.widths));
      const grow = ['Applicant', 'Respondent', 'Reason', 'Years married', 'Assigned', 'Actions'].map((n) => named(b, n).w - named(a, n).w);
      assert.ok(Math.max(...grow) - Math.min(...grow) <= 12, T + 'AC-3: the room is shared evenly: each column grows by the same (within a few grid steps) when the room grows by 300px (' + grow.join(', ') + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_STATIC_SHARE_848_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
