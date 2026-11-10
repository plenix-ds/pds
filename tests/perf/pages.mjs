/* Plenix perf harness · the three reference pages (rule 7, D-0160, #1212): a DataGrid with 50 rows, a record page, a form.
   Summary: each page is a function that returns an HTML document for a given Plenix base (a CDN version folder URL); the data is fixture data written here, so a page makes no request except the files of that Plenix build.
   Each page names the control the runner clicks to measure the interaction (INP), and the selector of the content that must exist before the trace is read. */
const FIRST = ['Mina', 'Peter', 'Mariam', 'Gamal', 'Sara', 'Youssef', 'Nadia', 'Samir', 'Hana', 'Karim'];
const LAST = ['Ghali', 'Boulos', 'Fahmy', 'Awad', 'Saad', 'Iskander', 'Morcos', 'Wassef', 'Zaki', 'Girgis'];
const rows = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: FIRST[i % 10] + ' ' + LAST[(i * 3) % 10], case: 'C-' + String(1000 + i), status: ['Open', 'Closed', 'Pending'][i % 3], amount: (i * 137) % 5000, date: '2026-0' + (1 + (i % 9)) + '-' + String(1 + (i % 27)).padStart(2, '0') }));

// the body of each page, as script text run after Plenix loads (h = React.createElement, P = Plenix)
const BODIES = {
  grid: `P.DataGrid, { label: 'Cases', data: ROWS, index: 'id', selectable: true, mode: 'fill', columns: [{ field: 'case', title: 'Case' }, { field: 'name', title: 'Name' }, { field: 'status', title: 'Status' }, { field: 'amount', title: 'Amount', type: 'number' }, { field: 'date', title: 'Opened' }] }`,
  record: `P.Stack, { gap: 16 }, h(P.Heading, { level: 1 }, 'Case C-1001'), h(P.PropertyList, null, h(P.PropertyList.Item, { label: 'Name' }, 'Mina Ghali'), h(P.PropertyList.Item, { label: 'Status' }, 'Open'), h(P.PropertyList.Item, { label: 'Opened' }, '2026-01-02'), h(P.PropertyList.Item, { label: 'Amount' }, '1,370')), h(P.Button, { id: 'perf-click' }, 'Edit')`,
  form: `P.Stack, { gap: 16 }, h(P.Heading, { level: 1 }, 'New case'), h(P.Field, { label: 'Name' }, h(P.Input, { id: 'perf-name' })), h(P.Field, { label: 'Amount' }, h(P.Input, { id: 'perf-amount' })), h(P.Button, { id: 'perf-click' }, 'Save')`,
};
// what the runner clicks, and what must be on the page when it is ready
export const TARGETS = { grid: { click: '.plx-data-grid__grid-row', ready: '.plx-data-grid__grid-row' }, record: { click: '#perf-click', ready: '#perf-click' }, form: { click: '#perf-click', ready: '#perf-click' } };
export const PAGES = Object.keys(BODIES);

export function html(page, base, mode = 'light') {
  return `<!doctype html><html lang="en" data-plx-mode="${mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${page} · Plenix perf</title>
<link rel="stylesheet" href="${base}/plenix.css"><script src="${base}/theme-boot.js"></script>
<script src="${base}/vendor/react.production.min.js"></script><script src="${base}/vendor/react-dom.production.min.js"></script>
<script src="${base}/plenix.js"></script><script src="${base}/plenix-engines.js"></script></head>
<body><div id="root"></div><script>
const h = React.createElement, P = Plenix, ROWS = ${JSON.stringify(rows)};
ReactDOM.createRoot(document.getElementById('root')).render(h(${BODIES[page]}));
${page === 'grid' ? "document.addEventListener('click', () => { const t = performance.now(); while (performance.now() - t < 300) {} });" : ''}
</script></body></html>`;
}
