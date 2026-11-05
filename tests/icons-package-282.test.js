/* Plenix tests · the @plenix-ds/icons package carries the Plenix icon modules (issue 282).
   Summary: after node build-app.js and node build-packages.js, release/packages/icons:
     package.json exports "./plenix/*" and is "type": "module" (the modules are ES modules)
     release/packages/icons/plenix/ holds every module of platform/dist/icons/plenix (the same names: the icons and their aliases)
       and plenix/index.json
     each icon in index.json "icons" has its four SVG files beside its module (<name>.svg, -fill.svg, -24.svg, -24-fill.svg)
     each alias in index.json "aliases" (for example arrow_back) has a module that imports its icon's module, and no SVG files
     icons.json lists the modules (plenix.count, plenix.modules) and they match the folder
     a module imports and is the Icon module shape: { name, set: "plenix", drawings: { 20, 24 } }
   Proof first: before #282 the package held only svg/, icons.json and icon.css, so the export, folder and list lines fail.
   Usage: node build-app.js && node build-packages.js && node tests/icons-package-282.test.js   → ICONS_PACKAGE_282_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), PKG = path.join(ROOT, 'release', 'packages', 'icons'), SRC = path.join(ROOT, 'platform', 'dist', 'icons', 'plenix');
(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8'));
  assert.equal(manifest.exports['./plenix/*'], './plenix/*', 'the package exports ./plenix/*');
  assert.equal(manifest.type, 'module', 'the package is an ES module package');
  assert.ok(fs.existsSync(path.join(PKG, 'plenix', 'index.json')), 'plenix/index.json is in the package');
  const names = (dir) => fs.readdirSync(dir).filter((n) => n.endsWith('.js')).map((n) => n.slice(0, -3)).sort();
  const want = names(SRC), have = names(path.join(PKG, 'plenix'));
  assert.ok(want.length > 200, 'the Plenix set has its modules (' + want.length + ')');
  assert.deepEqual(have, want, 'the package holds every module of platform/dist/icons/plenix');
  const index = JSON.parse(fs.readFileSync(path.join(PKG, 'plenix', 'index.json'), 'utf8'));
  const icons = index.icons.map((e) => e.name), aliases = index.aliases || {};
  assert.deepEqual(icons.concat(Object.keys(aliases)).sort(), have, 'the modules are the icons of index.json and their aliases');
  for (const n of icons) for (const f of [n + '.svg', n + '-fill.svg', n + '-24.svg', n + '-24-fill.svg'])
    assert.ok(fs.existsSync(path.join(PKG, 'plenix', f)), n + ': ' + f + ' is beside its module');
  for (const [a, n] of Object.entries(aliases)) {
    assert.ok(icons.includes(n), a + ': its icon ' + n + ' is in index.json');
    assert.ok(fs.readFileSync(path.join(PKG, 'plenix', a + '.js'), 'utf8').includes("from './" + n + ".js'"), a + ': its module imports ' + n + '.js');
  }
  const list = JSON.parse(fs.readFileSync(path.join(PKG, 'icons.json'), 'utf8')).plenix;
  assert.ok(list, 'icons.json lists the Plenix modules');
  assert.equal(list.count, have.length, 'icons.json counts them');
  assert.deepEqual(list.modules, have.map((n) => './plenix/' + n + '.js'), 'icons.json lists each module');
  const mod = (await import(path.join(PKG, 'plenix', 'add.js'))).default;
  assert.equal(mod.name, 'add'); assert.equal(mod.set, 'plenix');
  assert.deepEqual(Object.keys(mod.drawings).sort(), ['20', '24'], 'a module has both optical sizes');
  console.log('ICONS_PACKAGE_282_OK');
})().catch((e) => { console.error(e); process.exit(1); });
