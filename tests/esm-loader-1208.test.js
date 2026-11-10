/* Plenix tests · #1208 (B2 of #1201, ADR 0052): a page without a bundler loads one screen's parts through plenix-loader.js, and only those.
   Summary: a page loads the vendored React, plenix.css and plenix-loader.js from a built /cdn/<v>/ folder, calls Plenix.load(['DataGrid', 'Dialog', 'Button', 'ThemeProvider']),
     then renders a DataGrid with 50 rows from window.Plenix. The JavaScript it fetched is measured against the all-in-one plenix.js.
   Checks (headless Chrome): AC-1 the grid renders its rows with no page error; AC-2 plenix.js is never fetched and every Plenix module comes from esm/; AC-3 the JavaScript fetched
     (React apart, brotli 5 as the web host sends it) is less than plenix.js; AC-4 Plenix.load of a loaded name resolves at once with no new request, and an unknown name rejects
     with its name; AC-5 the import map resolves React to the vendor ES modules over the page's one React.
   Proof first: before #1208 there is no plenix-loader.js and no esm/ folder, so the page has no Plenix.load and AC-1 fails.
   Usage: node build-packages.js, then node tests/esm-loader-1208.test.js   → ESM_LOADER_1208_OK (with the bytes) */
const fs = require('fs'), path = require('path'), http = require('http'), zlib = require('zlib'), assert = require('assert');
require('./limit.js');
const { launch } = require('./lib.js');
const ROOT = path.join(__dirname, '..'), VERSION = require('../package.json').version, CDN = path.join(ROOT, 'release', 'cdn', VERSION);
const br = (buf) => zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }).length;
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.html': 'text/html; charset=utf-8' };
const PARTS = ['DataGrid', 'Dialog', 'Button', 'ThemeProvider'];
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
    p.on('requestfinished', (r) => fetched.push(new URL(r.url()).pathname));
    await p.goto(origin + '/page.html', { waitUntil: 'load', timeout: 90000 });
    const ready = await p.evaluate(() => window.__ready.then((x) => x, (e) => 'rejected: ' + e.message));
    await check('AC-1 the grid renders', async () => {
      assert.strictEqual(ready, 'ok');
      await p.waitForSelector('.plx-data-grid__grid-row', { timeout: 30000 });
      const rows = await p.$$eval('.plx-data-grid__grid-row', (r) => r.length);
      assert.ok(rows >= 10, 'rows drawn: ' + rows);
      assert.deepStrictEqual(errors, []);
    });
    const js = fetched.filter((f) => f.endsWith('.js'));
    await check('AC-2 no plenix.js; modules from esm/', async () => {
      assert.ok(!js.some((f) => /\/plenix(\.esm)?\.js$/.test(f)), 'plenix.js was fetched');
      assert.ok(js.some((f) => f.endsWith('/esm/DataGrid.js')), 'esm/DataGrid.js was not fetched');
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
  } finally { await browser.close(); server.close(); }
  if (failed) { console.log('ESM_LOADER_1208_FAIL (' + failed + ')'); process.exit(1); }
  console.log('ESM_LOADER_1208_OK');
})().catch((e) => { console.log('ESM_LOADER_1208_FAIL: ' + e.message); process.exit(1); });
