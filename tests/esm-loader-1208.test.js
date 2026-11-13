/* Plenix tests · #1208 (B2 of #1201, ADR 0052): a page without a bundler loads one screen's parts through plenix-loader.js, and only those.
   Summary: a page loads the vendored React, plenix.css and plenix-loader.js from a built /cdn/<v>/ folder, calls Plenix.load(['DataGrid', 'Dialog', 'Button', 'ThemeProvider']),
     then renders a DataGrid with 50 rows from window.Plenix. The JavaScript it fetched is measured against the all-in-one plenix.js.
   Checks (headless Chrome): AC-1 the grid renders its rows with no page error; AC-2 plenix.js is never fetched and DataGrid comes from esm/ (its chunk); AC-3 the JavaScript fetched
     (React apart, brotli 5 as the web host sends it) is less than plenix.js; AC-4 Plenix.load of a loaded name resolves at once with no new request, and an unknown name rejects
     with its name; AC-5 the import map resolves React to the vendor ES modules over the page's one React; AC-6 CTM's first page (#1293) loads at most 30 Plenix
     files and fewer bytes than plenix.js, and the ready times of both ways are printed.
   Proof first: before #1208 there is no plenix-loader.js and no esm/ folder, so the page has no Plenix.load and AC-1 fails.
   Usage: node build-packages.js, then node tests/esm-loader-1208.test.js   → ESM_LOADER_1208_OK (with the bytes) */
const fs = require('fs'), path = require('path'), http = require('http'), zlib = require('zlib'), assert = require('assert');
require('./limit.js');
const { launch } = require('./lib.js');
const ROOT = path.join(__dirname, '..'), VERSION = require('../package.json').version, CDN = path.join(ROOT, 'release', 'cdn', VERSION);
const br = (buf) => zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }).length;
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.html': 'text/html; charset=utf-8' };
const PARTS = ['DataGrid', 'Dialog', 'Button', 'ThemeProvider'];
// CTM's first page (#1292, #1293): the parts its shell reads, loaded two ways for the same render
const CTM = 'AppHeader AppShell Auth Button Card Center Checkbox CommandBar CommandBarSearch DataGrid Dialog DirectionProvider DocumentViewer EmptyState FilterPanel Icon Image Inline List LoadingState MediaPlayer NavList NavPane Notice PageContent Panel RadioGroup ReadingPane RecordPage ResourceList SecondaryPane Select SessionProvider SplitView SsoButtons Stack Tabs Text Textarea ThemeProvider ToastProvider ToolRail Toolbar'.split(' ');
const shellPage = (v, all) => `<!doctype html><html lang="en" data-plx-mode="light"><head><meta charset="utf-8"><title>ctm shell</title>
<link rel="stylesheet" href="/cdn/${v}/plenix.css">
<script src="/cdn/${v}/vendor/react.production.min.js"></script><script src="/cdn/${v}/vendor/react-dom.production.min.js"></script>
<script src="/cdn/${v}/${all ? 'plenix.js' : 'plenix-loader.js'}"></script></head><body><div id="root"></div><script>
(${all ? 'Promise.resolve()' : 'Plenix.load(' + JSON.stringify(CTM) + ')'}).then(function () {
  var h = React.createElement, P = window.Plenix;
  ReactDOM.createRoot(document.getElementById('root')).render(h(P.ThemeProvider, null, h(P.Panel, { title: 'Case' }, h(P.Button, { id: 'ready' }, 'Open'))));
  (function wait() { if (document.getElementById('ready')) window.__ready = performance.now(); else requestAnimationFrame(wait); })();
});
</script></body></html>`;
const page = (v) => `<!doctype html><html lang="en" data-plx-mode="light"><head><meta charset="utf-8"><title>esm loader</title>
<link rel="stylesheet" href="/cdn/${v}/plenix.css">
<script src="/cdn/${v}/vendor/react.production.min.js"></script><script src="/cdn/${v}/vendor/react-dom.production.min.js"></script>
<script src="/cdn/${v}/plenix-loader.js"></script></head><body><div id="root"></div><script>
window.__ready = Plenix.load(${JSON.stringify(PARTS)}).then(function () {
  var h = React.createElement, P = window.Plenix, rows = [];
  for (var i = 1; i <= 50; i++) rows.push({ id: i, case: 'C-' + (1000 + i), name: 'Name ' + i });
  ReactDOM.createRoot(document.getElementById('root')).render(h(P.ThemeProvider, null, h(P.DataGrid, { label: 'Cases', data: rows, index: 'id',
    columns: [{ field: 'case', title: 'Case' }, { field: 'name', title: 'Name' }] }), h(P.Button, null, 'Save')));
  return 'ok';
});
</script></body></html>`;

(async () => {
  assert.ok(fs.existsSync(path.join(CDN, 'plenix-loader.js')), 'release/cdn/' + VERSION + '/plenix-loader.js is missing: run node build-packages.js');
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    if (u === '/page.html') { res.writeHead(200, { 'content-type': TYPES['.html'] }); res.end(page(VERSION)); return; }
    if (u === '/shell-loader.html' || u === '/shell-all.html') { res.writeHead(200, { 'content-type': TYPES['.html'] }); res.end(shellPage(VERSION, u === '/shell-all.html')); return; }
    const prefix = '/cdn/' + VERSION + '/';
    const f = u.startsWith(prefix) ? path.join(CDN, path.normalize(u.slice(prefix.length))) : null;
    if (!f || !f.startsWith(CDN) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  }).listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await launch();
  let failed = 0;
  const check = async (name, fn) => { try { await fn(); } catch (e) { failed++; console.log('FAIL ' + name + ': ' + e.message); } };
  try {
    const p = await browser.newPage();
    const errors = [], fetched = [];
    p.on('pageerror', (e) => errors.push(e.message));
    const consoleErrors = [];
    p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(m.type() + ': ' + m.text().slice(0, 300)); });
    p.on('requestfinished', (r) => fetched.push(new URL(r.url()).pathname));
    await p.goto(origin + '/page.html', { waitUntil: 'load', timeout: 90000 });
    const ready = await p.evaluate(() => window.__ready.then((x) => x, (e) => 'rejected: ' + e.message));
    await check('AC-1 the grid renders', async () => {
      assert.strictEqual(ready, 'ok');
      try { await p.waitForSelector('.plx-data-grid__grid-row', { timeout: 30000 }); } catch (e) {
        // what the page holds instead, for the log: its console and the start of the rendered tree
        const dom = await p.evaluate(() => document.getElementById('root').innerHTML.slice(0, 1200));
        throw new Error(e.message + '\n  console: ' + JSON.stringify(consoleErrors.slice(0, 8)) + '\n  #root: ' + dom);
      }
      const rows = await p.$$eval('.plx-data-grid__grid-row', (r) => r.length);
      assert.ok(rows >= 10, 'rows drawn: ' + rows);
      assert.deepStrictEqual(errors, []);
    });
    const js = fetched.filter((f) => f.endsWith('.js'));
    await check('AC-2 no plenix.js; modules from esm/', async () => {
      assert.ok(!js.some((f) => /\/plenix(\.esm)?\.js$/.test(f)), 'plenix.js was fetched');
      // Plenix.load imports a part's chunk (the manifest's chunk), so DataGrid comes from esm/chunks/ (#1293)
      assert.ok(js.some((f) => /\/esm\/(DataGrid\.js|chunks\/grid-[\w-]+\.js)$/.test(f)), 'DataGrid did not come from esm/');
    });
    const plenixFiles = [...new Set(js.filter((f) => !/\/vendor\/react(-dom)?\.production\.min\.js$/.test(f)))];
    const bytes = plenixFiles.reduce((a, f) => a + br(fs.readFileSync(path.join(CDN, f.slice(('/cdn/' + VERSION + '/').length)))), 0);
    const all = br(fs.readFileSync(path.join(CDN, 'plenix.js')));
    await check('AC-3 fewer bytes than plenix.js', async () => assert.ok(bytes < all, bytes + ' >= ' + all));
    await check('AC-4 loaded names resolve at once; unknown names reject', async () => {
      const before = fetched.length;
      const again = await p.evaluate(() => Plenix.load(['DataGrid']).then(() => 'ok'));
      assert.strictEqual(again, 'ok');
      assert.strictEqual(fetched.length, before, 'a second load fetched again');
      const bad = await p.evaluate(() => Plenix.load(['NoSuchPart']).then(() => 'resolved', (e) => e.message));
      assert.match(bad, /NoSuchPart/);
    });
    await check('AC-5 one React, through the import map', async () => {
      const same = await p.evaluate(() => import('react').then((m) => m.default === window.React && m.createElement === window.React.createElement));
      assert.strictEqual(same, true);
    });
    console.log(`  screen ${PARTS.join(', ')}: ${plenixFiles.length} Plenix files, ${bytes} B brotli 5; plenix.js ${all} B (${Math.round((1 - bytes / all) * 100)}% less); React apart`);
    // CTM's first page: few files (the layers), fewer bytes than plenix.js; the ready times of both are printed (median of 3)
    const shell = async (all) => {
      const ctx = await browser.createBrowserContext(); const q = await ctx.newPage(); const got = []; const errs = [];   // a fresh context: no cache
      q.on('pageerror', (e) => errs.push(e.message));
      q.on('requestfinished', (r) => got.push(new URL(r.url()).pathname));
      await q.goto(origin + (all ? '/shell-all.html' : '/shell-loader.html'), { waitUntil: 'load', timeout: 90000 });
      await q.waitForFunction(() => window.__ready, { timeout: 30000 });
      const ready = await q.evaluate(() => window.__ready);
      await ctx.close();
      const plx = [...new Set(got.filter((f) => /\.(js|json)$/.test(f) && !/\/vendor\/react(-dom)?\.production\.min\.js$/.test(f)))];
      return { ready, files: plx.length, bytes: plx.reduce((a, f) => a + br(fs.readFileSync(path.join(CDN, f.slice(('/cdn/' + VERSION + '/').length)))), 0), errs };
    };
    const runs = { loader: [], all: [] };
    for (let i = 0; i < 3; i++) { runs.loader.push(await shell(false)); runs.all.push(await shell(true)); }
    const med = (a, k) => a.map((x) => x[k]).sort((x, y) => x - y)[1];
    await check('AC-6 CTM first page: at most 30 Plenix files (loader and manifest included), fewer bytes than plenix.js', async () => {
      assert.deepStrictEqual(runs.loader[0].errs.concat(runs.all[0].errs), []);
      assert.ok(runs.loader[0].files <= 30, runs.loader[0].files + ' files');
      assert.ok(runs.loader[0].bytes < runs.all[0].bytes, runs.loader[0].bytes + ' >= ' + runs.all[0].bytes);
    });
    console.log(`  CTM first page (${CTM.length} parts): Plenix.load ${runs.loader[0].files} files, ${runs.loader[0].bytes} B brotli 5, ready ${Math.round(med(runs.loader, 'ready'))} ms; plenix.js ${runs.all[0].files} files, ${runs.all[0].bytes} B, ready ${Math.round(med(runs.all, 'ready'))} ms (median of 3, local server, no cache)`);
  } finally { await browser.close(); server.close(); }
  if (failed) { console.log('ESM_LOADER_1208_FAIL (' + failed + ')'); process.exit(1); }
  console.log('ESM_LOADER_1208_OK');
})().catch((e) => { console.log('ESM_LOADER_1208_FAIL: ' + e.message); process.exit(1); });
