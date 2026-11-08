/* Check 12 specimen generator (issue 1021). Renders each part below with this checkout's Platform and writes its markup as static HTML to
   tests/visual/specimens-parts.json, which specimens.mjs merges in. The visual run itself stays static (stylesheet + markup, no script).
   Usage: node build-app.js && node tests/visual/make-parts-specimens.cjs   (re-run when a part's markup changes; commit the JSON)
   Dates are fixed ISO strings and the locale is en-US, so the markup does not depend on the day it is generated. */
const fs = require('fs'), path = require('path');
const { serve, launch } = require('../lib');

// each entry: a function returning React.createElement(...) source run in the page (h = createElement, P = Plenix)
const parts = {
  'timeline-grouped': `h(P.Timeline, { variant: 'grouped', label: 'Case history', legend: true, hiddenCategories: ['c3'], onHiddenCategoriesChange: function () {}, items: [
    { id: 5, dateTime: '2027-02-01T09:00:00Z', title: 'Decision due', description: 'A ruling is expected.', upcoming: true, category: { id: 'c5', label: 'Review', color: '5' } },
    { id: 6, title: 'Appeal window', description: 'Opens after the decision.', upcoming: true, category: { id: 'c1', label: 'Filing', color: '1' } },
    { id: 1, dateTime: '2026-03-02T09:00:00Z', title: 'Filed', description: 'The claim was filed.', category: { id: 'c1', label: 'Filing', color: '1' } },
    { id: 2, dateTime: '2026-01-12T09:00:00Z', title: 'Reviewed', description: 'A reviewer was assigned.', category: { id: 'c5', label: 'Review', color: '5' } },
    { id: 7, dateTime: '2026-02-03T09:00:00Z', title: 'Note added', description: 'Hidden by the legend.', category: { id: 'c3', label: 'Notes', color: '3' } },
    { id: 3, dateTime: '2025-11-20T09:00:00Z', title: 'Hearing held', description: 'Both sides were heard.', category: { id: 'c6', label: 'Hearing', color: '6' } },
    { id: 4, dateTime: '2025-06-05T09:00:00Z', title: 'Opened', description: 'The case was opened.', category: { id: 'c1', label: 'Filing', color: '1' } } ] })`,
};

(async () => {
  const PORT = +process.env.TEST_PORT || 9921, server = await serve(PORT); let browser; const out = {};
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    for (const [name, src] of Object.entries(parts)) {
      out[name] = await page.evaluate(async (src) => {
        const h = React.createElement, P = Plenix;
        document.querySelector('main').innerHTML = '<div id="c"></div>';
        const root = ReactDOM.createRoot(document.getElementById('c'));
        root.render(new Function('h', 'P', 'return ' + src)(h, P)); await new Promise((r) => setTimeout(r, 500));
        const html = document.getElementById('c').innerHTML; root.unmount(); return html;
      }, src);
    }
  } finally { if (browser) await browser.close(); server.close(); }
  fs.writeFileSync(path.join(__dirname, 'specimens-parts.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('wrote ' + Object.keys(out).length + ' specimens');
})().catch((e) => { console.error(e); process.exit(1); });
