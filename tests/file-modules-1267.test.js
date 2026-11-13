/* Plenix tests · #1267 (perf on-demand 3/4, ADR 0052): sortFiles is its own module, and nothing a person sees changed.
   Summary: sortFiles (a pure function) lives in platform/patterns/FileList/sortFiles.ts and imports nothing, so its entry (esm/sortFiles.js) no longer loads the list's UI; platform/index.ts
     and exports/w12A.ts export it from there. FileList, FileBrowser and Publish keep their modules and their names; each still draws, in left to right and right to left, without a script error or a console warning.
   Checks: AC-1 sortFiles has its own module and that module has no import; AC-2 the public entry still exports sortFiles, FileList, FileBrowser and Publish, and sortFiles puts folders first and sorts by name,
     size, date and owner both ways; AC-3 FileList (list, sortable list, table), FileBrowser (list, grid, with the tree) and Publish (draft, scheduled, published) draw their content; AC-4 no error or warning.
     The loaded bytes per entry are the budget in tools/checks/perf-budget.json (node tools/checks/perf-budget.mjs).
   Proof first: on main there is no sortFiles.ts (AC-1 fails) and esm/sortFiles.js adds 17,562 B against its new limit.
   Usage: node tests/file-modules-1267.test.js   → FILE_MODULES_1267_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const ROOT = path.resolve(__dirname, '..');

// AC-1: the module exists and stands alone (a pure function loads nothing but itself)
const own = path.join(ROOT, 'platform/patterns/FileList/sortFiles.ts');
assert.ok(fs.existsSync(own), 'AC-1: platform/patterns/FileList/sortFiles.ts exists');
const source = fs.readFileSync(own, 'utf8');
assert.deepEqual(source.match(/^\s*import\s[^;]*;|\bimport\s*\(/gm) || [], [], 'AC-1: sortFiles.ts imports nothing');
assert.ok(/export function sortFiles\b/.test(source), 'AC-1: sortFiles.ts exports sortFiles');
for (const f of ['platform/index.ts', 'platform/exports/w12A.ts']) {
  assert.ok(/export\s*\{\s*sortFiles\s*\}\s*from\s*'[^']*patterns\/FileList\/sortFiles\.ts'/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')), 'AC-1: ' + f + ' exports sortFiles from its own module');
}

(async () => {
  const PORT = +process.env.TEST_PORT || 9827, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type()) && !/was fetched at run time/.test(m.text())) errors.push(m.type() + ': ' + m.text()); });   // the host page has no icon file loaded: a file type's icon is fetched once, with a note
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix, noop = () => {}, out = { names: {}, order: {}, pages: {} };
        for (const n of ['sortFiles', 'FileList', 'FileBrowser', 'Publish']) out.names[n] = typeof P[n];
        const files = [
          { id: 'f1', name: 'zebra.pdf', kind: 'file', size: 300, modified: '2026-01-03', owner: 'Ann' },
          { id: 'd1', name: 'Docs', kind: 'folder', count: 5, modified: '2026-01-05', owner: 'Zed' },
          { id: 'f2', name: 'alpha.pdf', kind: 'file', size: 100, modified: '2026-01-09', owner: 'Bob' },
          { id: 'f3', name: 'file10.txt', kind: 'file', size: 200, modified: '2026-01-01', owner: 'Cy' },
          { id: 'f4', name: 'file2.txt', kind: 'file', size: 400, modified: '2026-01-02', owner: 'Ann' },
        ];
        const ids = (sort) => P.sortFiles(files, sort).map((f) => f.id).join(',');
        out.order = { byName: ids(), nameDesc: ids({ field: 'name', dir: 'desc' }), size: ids({ field: 'size', dir: 'asc' }), sizeDesc: ids({ field: 'size', dir: 'desc' }),
          modified: ids({ field: 'modified', dir: 'asc' }), owner: ids({ field: 'owner', dir: 'asc' }), untouched: files.map((f) => f.id).join(',') };
        const tree = [{ id: 'd1', name: 'Docs', kind: 'folder', parent: null }, { id: 'f1', name: 'a.pdf', kind: 'file', size: 10, parent: 'd1' }, { id: 'f2', name: 'b.txt', kind: 'file', size: 20, parent: null }];
        const cases = {
          FileList: h(P.FileList, { label: 'Files', files, onOpen: noop, selectable: true }),
          FileListSortable: h(P.FileList, { label: 'Files', files, sortable: true, defaultSort: { field: 'size', dir: 'desc' }, onRename: noop, onDelete: noop }),
          FileListTable: h(P.FileList, { label: 'Files', files, view: 'table', columns: ['size', 'modified', 'owner'], onOpen: noop }),
          FileBrowser: h(P.FileBrowser, { items: tree, onOpenFile: noop, onCreateFolder: noop, onUpload: noop }),
          FileBrowserGrid: h(P.FileBrowser, { items: tree, defaultView: 'grid', onOpenFile: noop }),
          FileBrowserTree: h(P.FileBrowser, { items: tree, tree: true, onMove: noop }),
          PublishDraft: h(P.Publish, { name: 'Report', status: 'draft', onPublish: noop, onSchedule: noop }),
          PublishScheduled: h(P.Publish, { name: 'Report', status: 'scheduled', scheduledFor: '2026-12-01T09:00', by: 'Ann', onCancelSchedule: noop, onPublish: noop }),
          PublishPublished: h(P.Publish, { name: 'Report', status: 'published', publishedAt: '2026-11-01T09:00', onUnpublish: noop }),
        };
        for (const [name, el] of Object.entries(cases)) {
          const c = document.createElement('div'); c.id = 'c-' + name; document.getElementById('main').appendChild(c);
          try { const root = ReactDOM.createRoot(c); root.render(h(P.ToastProvider || React.Fragment, null, el)); await new Promise((r) => setTimeout(r, 600)); out.pages[name] = c.textContent.trim().length; } catch (e) { out.pages[name] = 'threw: ' + e.message; }
        }
        return out;
      }, dir);
      for (const n of ['sortFiles', 'FileList', 'FileBrowser', 'Publish']) assert.ok(['function', 'object'].includes(r.names[n]), T + 'AC-2: the public entry exports ' + n + ' (' + r.names[n] + ')');
      assert.equal(r.order.untouched, 'f1,d1,f2,f3,f4', T + 'AC-2: sortFiles does not reorder the list it is given');
      assert.equal(r.order.byName, 'd1,f2,f4,f3,f1', T + 'AC-2: folders first, then by name, numbers in order (file2 before file10)');
      assert.equal(r.order.nameDesc, 'd1,f1,f3,f4,f2', T + 'AC-2: names descending, folders still first');
      assert.equal(r.order.size, 'd1,f2,f3,f1,f4', T + 'AC-2: by size, a folder by its count');
      assert.equal(r.order.sizeDesc, 'd1,f4,f1,f3,f2', T + 'AC-2: by size descending');
      assert.equal(r.order.modified, 'd1,f3,f4,f1,f2', T + 'AC-2: by date');
      assert.equal(r.order.owner, 'd1,f4,f1,f2,f3', T + 'AC-2: by owner, ties by name');
      for (const [name, n] of Object.entries(r.pages)) assert.ok(typeof n === 'number' && n > 0, T + 'AC-3: ' + name + ' draws its content (' + n + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'AC-4: no script error or console warning: ' + JSON.stringify(errors.slice(0, 5)));
    console.log('FILE_MODULES_1267_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
