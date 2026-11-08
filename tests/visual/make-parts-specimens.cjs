/* Check 12 specimen generator (issue 1021). Renders each part below with this checkout's Platform and writes its markup as static HTML to
   tests/visual/specimens-parts.json, which specimens.mjs merges in. The visual run itself stays static (stylesheet + markup, no script).
   Usage: node build-app.js && node tests/visual/make-parts-specimens.cjs   (re-run when a part's markup changes; commit the JSON)
   Dates are fixed ISO strings and the locale is en-US, so the markup does not depend on the day it is generated. */
const fs = require('fs'), path = require('path');
const { serve, launch } = require('../lib');

// each entry: a function returning React.createElement(...) source run in the page (h = createElement, P = Plenix)
// a flat grey logo as a data URI, so the specimen needs no file or network
const logo = (w, h) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="' + w + '" height="' + h + '" fill="gray"/></svg>');
const brand = (src, org) => `h(P.AppHeader, { appName: 'Cases', brand: { logo: { src: '${src}', alt: 'Logo' }, organization: '${org}', application: 'Clerical Tribunal Management' } })`;
const nav = `h(P.NavList, { label: 'Case', items: [{ id: 'a', label: 'Summary', current: true }, { id: 'b', label: 'Parties' }, { id: 'c', label: 'Documents' }] })`;
const parts = {
  'entity-header-fact-tone': `h(P.EntityHeader, { title: 'Case 2026-114', subtitle: 'Council review', status: { tone: 'waiting', icon: 'clock', label: 'Open' },
    facts: [ { label: 'Council member', icon: 'alert', tone: 'negative', value: h(P.Combobox, { 'aria-label': 'Council member', invalid: true, options: [{ value: 'a', label: 'Maya Chen' }, { value: 'b', label: 'Noor Haddad' }], value: null, onChange: function () {} }) },
      { label: 'Filed', value: 'Mar 2, 2026' } ] })`,
  'entity-header-versus': `h('div', null, ${['top-small','top-large','edge'].map((l) => "h(P.EntityHeader, { layout: '" + l + "', title: 'Michael Bennett vs. Charlotte Bennett', subtitle: 'Case 2026-114', media: { versus: [{ name: 'Michael Bennett' }, { name: 'Charlotte Bennett' }] } })").join(', ')})`,
  'property-list-tiles': `h('div', null, h(P.Panel, { title: 'Case summary', icon: 'user' },
      h(P.PropertyGroup, { heading: 'Case', variant: 'tiles' }, h(P.PropertyList, null,
        h(P.PropertyList.Item, { label: 'Number', data: true }, '2026-114'), h(P.PropertyList.Item, { label: 'Owner' }, 'Maya Chen'),
        h(P.PropertyList.Item, { label: 'Status', status: { label: 'Approved', tone: 'success', icon: 'check' } }),
        h(P.PropertyList.Item, { label: 'Filed' }, 'Mar 2, 2026'),
        h(P.PropertyList.Item, { label: 'Notes', span: 'full' }, 'A long note that sits among short fields and takes the whole row so that it can wrap over several lines without squeezing its neighbors.'))),
      h(P.PropertyGroup, { heading: 'Parties', variant: 'tiles' }, h(P.PropertyList, null, h(P.PropertyList.Item, { label: 'Petitioner' }, 'Michael Bennett'), h(P.PropertyList.Item, { label: 'Respondent' }, 'Charlotte Bennett'), h(P.PropertyList.Item, { label: 'Witness' }, 'Noor Haddad')))))`,
  'secondary-pane-back': `h('div', null,
    h(P.SecondaryPane, { title: 'Case overview', back: { parent: 'cases', href: '#cases' } }, ${nav}),
    h(P.SecondaryPane, { title: 'Case overview', back: { parent: 'all of the cases assigned to the tribunal this year', href: '#cases' } }, ${nav}))`,
  'app-header-brand': `h('div', null, ${brand(logo(64, 64), 'Diocese of Los Angeles')}, ${brand(logo(256, 64), 'Diocese of Los Angeles')}, ${brand(logo(64, 64), 'The Very Long Name of an Organization That Does Not Fit')})`,
  'panel-toggle-header': `h('div', null, h(P.Panel, { title: 'Spouse', collapsible: true, toggleOn: 'header', defaultExpanded: true }, 'Details of the party.'), h(P.Panel, { title: 'Witness', collapsible: true, toggleOn: 'header', defaultExpanded: false }, 'Details of the witness.'))`,
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
