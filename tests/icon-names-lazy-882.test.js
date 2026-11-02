/* Plenix tests · the npm package's ES modules load the icon name tables only when an Icon meets a name (issue 882, item 11).
   Summary: since #702 the Material library's names (54 KB) were a chunk loaded on demand, but the Plenix set's tables (NAMES,
     SYMBOLS, MIRRORED, about 10 KB) still sat in the Icon chunk, so every part that draws an icon carried them. Now all four
     tables are the chunk icon-names; the browser global, the CDN's plenix.esm.js and the CommonJS build keep them built in.
     Written before the change: the Icon chunk held the Plenix tables (the first check fails on the old build).
   Checks (this checkout's build: node build-packages.js):
     the Icon chunk (dist/chunks/Icon-*.js) holds no Plenix name table; the icon-names chunk holds all four tables
     the browser global (platform/dist/platform.js), plenix.esm.js and index.cjs still hold the tables built in
     in a browser, through an import map for React, left to right and right to left:
       an Icon drawn from an imported module (StatusIcon) asks for no icon-names chunk
       resolveIcon('add') answers null before the tables arrive and the Plenix icon after
       an Icon named "arrow-back" asks for the chunk once, then carries plx-icon--mirrored (a mirrored Plenix symbol)
       an unknown name warns once, after the tables arrive, never before
     no script errors
   Usage: node tests/icon-names-lazy-882.test.js   → ICON_NAMES_LAZY_882_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const { launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const ROOT = path.resolve(__dirname, '..'), VERSION = require(path.join(ROOT, 'package.json')).version;
const DIST = path.join(ROOT, 'packages', 'react', 'dist'), VENDOR = path.join(ROOT, 'platform', 'vendor');
const ORIGIN = 'http://names.test', NAME_ENTRY = '"add-column-left"';
if (!fs.existsSync(path.join(DIST, 'index.js'))) { console.log('icon-names-lazy-882: FAIL the package build is missing: run npm ci (or node build-packages.js) first'); process.exit(1); }

(async () => {
  const chunks = fs.readdirSync(path.join(DIST, 'chunks'));
  const iconChunk = chunks.find((f) => /^Icon-.*\.js$/.test(f)), namesChunk = chunks.find((f) => /^icon-names-.*\.js$/.test(f));
  assert.ok(iconChunk && namesChunk, 'the Icon and icon-names chunks are built');
  const iconCode = fs.readFileSync(path.join(DIST, 'chunks', iconChunk), 'utf8'), namesCode = fs.readFileSync(path.join(DIST, 'chunks', namesChunk), 'utf8');
  assert.ok(!iconCode.includes(NAME_ENTRY), 'the Icon chunk holds no Plenix name table');
  for (const t of ['SYMBOLS', 'NAMES', 'MIRRORED', 'LIBRARY']) assert.ok(new RegExp('\\b' + t + ' = ').test(namesCode), 'the icon-names chunk holds ' + t);
  for (const f of [path.join(ROOT, 'platform', 'dist', 'platform.js'), path.join(ROOT, 'release', 'cdn', VERSION, 'plenix.esm.js'), path.join(DIST, 'index.cjs')])
    assert.ok(fs.readFileSync(f, 'utf8').includes(NAME_ENTRY), path.relative(ROOT, f) + ' keeps the tables built in');

  let browser;
  try {
    browser = await launch();
    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      const page = await browser.newPage(); await page.setRequestInterception(true);
      const asked = [], errors = [], warnings = []; let shims = null;
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
      page.on('console', (m) => { if (/^warn(ing)?$/.test(m.type()) && /no icon is named/.test(m.text())) warnings.push(m.text()); });
      page.on('request', (r) => {
        const u = new URL(r.url()); if (u.origin !== ORIGIN) return r.continue();
        const f = u.pathname, ok = (type, text) => r.respond({ status: 200, contentType: type, body: text });
        if (f.startsWith('/dist/')) {
          asked.push(f);
          const file = path.join(DIST, f.slice('/dist/'.length));
          return file.startsWith(DIST) && fs.existsSync(file) ? ok('text/javascript', fs.readFileSync(file)) : r.respond({ status: 404, body: 'missing' });
        }
        if (f === '/keys.html') return ok('text/html', '<!doctype html><script src="/react.js"></script><script src="/react-dom.js"></script>');
        if (f === '/react.js') return ok('text/javascript', fs.readFileSync(path.join(VENDOR, 'react.production.min.js')));
        if (f === '/react-dom.js') return ok('text/javascript', fs.readFileSync(path.join(VENDOR, 'react-dom.production.min.js')));
        if (f === '/shim-react.js') return ok('text/javascript', shims.react);
        if (f === '/shim-dom.js') return ok('text/javascript', shims.dom);
        if (f === '/shim-client.js') return ok('text/javascript', shims.client);
        if (f === '/shim-jsx.js') return ok('text/javascript', 'const R = window.React; export const jsx = (t, p, k) => R.createElement(t, Object.assign({}, p, { key: k })); export const jsxs = jsx; export const Fragment = R.Fragment;');
        if (f === '/index.html') return ok('text/html', '<!doctype html><html dir="' + dir + '"><head><script src="/react.js"></script><script src="/react-dom.js"></script>'
          + '<script type="importmap">{"imports":{"react":"/shim-react.js","react-dom":"/shim-dom.js","react-dom/client":"/shim-client.js","react/jsx-runtime":"/shim-jsx.js"}}</script>'
          + '<script type="module">import * as I from "/dist/components/Icon/Icon.js"; window.__I = I;</script></head><body><div id="a"></div><div id="b"></div></body></html>');
        r.respond({ status: 404, body: 'missing' });
      });
      await page.goto(ORIGIN + '/keys.html');
      const keys = await page.evaluate(() => ({ react: Object.keys(window.React), dom: Object.keys(window.ReactDOM) }));
      const named = (obj, names) => 'const O = window.' + obj + '; export default O;\n' + names.filter((n) => /^[A-Za-z_$][\w$]*$/.test(n) && n !== 'default').map((n) => 'export const ' + n + ' = O.' + n + ';').join('\n');
      shims = { react: named('React', keys.react), dom: named('ReactDOM', keys.dom), client: 'const O = window.ReactDOM; export const createRoot = O.createRoot, hydrateRoot = O.hydrateRoot;' };
      await page.goto(ORIGIN + '/index.html'); await page.waitForFunction(() => window.__I, { timeout: 30000 });
      const namesAsked = () => asked.filter((f) => /\/icon-names-[^/]*\.js$/.test(f)).length;

      // a module-drawn icon: no tables
      await page.evaluate(() => { window.ReactDOM.createRoot(document.getElementById('a')).render(window.React.createElement(window.__I.StatusIcon, { tone: 'success' })); });
      await new Promise((r) => setTimeout(r, 800));
      assert.equal(await page.evaluate(() => !!document.querySelector('#a path')), true, d + 'the StatusIcon draws from its imported module');
      assert.equal(namesAsked(), 0, d + 'an icon drawn from a module asks for no icon-names chunk');

      // a name: null until the tables arrive, then the Plenix icon; the chunk once; the mirrored class after
      const before = await page.evaluate(() => window.__I.resolveIcon('add'));
      assert.equal(before, null, d + 'resolveIcon answers null before the tables arrive');
      await page.evaluate(() => { window.ReactDOM.createRoot(document.getElementById('b')).render(window.React.createElement('div', null,
        window.React.createElement(window.__I.Icon, { name: 'arrow-back' }), window.React.createElement(window.__I.Icon, { name: 'no-such-icon-882' }))); });
      await page.waitForFunction(() => window.__I.resolveIcon('add'), { timeout: 10000 });
      await new Promise((r) => setTimeout(r, 500));
      const after = await page.evaluate(() => window.__I.resolveIcon('add'));
      assert.equal(after && after.kind, 'plenix', d + 'after the tables arrive, add is the Plenix icon');
      assert.equal(namesAsked(), 1, d + 'the icon-names chunk is asked for once');
      assert.equal(await page.evaluate(() => document.querySelector('#b .plx-icon--arrow-back').classList.contains('plx-icon--mirrored')), true, d + 'arrow-back carries plx-icon--mirrored once the tables arrive');
      assert.equal(warnings.length, 1, d + 'the unknown name warns once, after the tables arrive; got ' + JSON.stringify(warnings));
      assert.deepEqual(errors, [], d + 'no script errors');
      await page.close();
    }
    console.log('ICON_NAMES_LAZY_882_OK');
  } finally { if (browser) await browser.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
