/* Plenix tests · #1209 (B3 of #1201, ADR 0052): an icon set is a file of its own in both forms, the classic script and the ES module.
   Summary: the compatibility set (every Plenix icon) and a site's own set are each written as plenix-icons-<set>.js (a classic script, loaded after plenix.js; unchanged)
     and as an ES module twin (plenix-icons-<set>.esm.js: it imports registerIcons from the Plenix entry and registers the same modules). A page that draws one set loads that
     set only: a site's set is far smaller than the compatibility set, and neither loads anything else (no import(), fetch or URL).
   Checks (Node only, no browser): AC-1 the compatibility module is generated and current; AC-2 it registers the same modules as the classic file, once each, with the same drawings;
     AC-3 every drawing passes the allow-list (#285); AC-4 a site's module registers just its icons and is smaller than the compatibility set, bytes printed; AC-5 the classic files
     are unchanged (the existing site-icons test stays green); AC-6 the tool's --esm writes the module, with the import path given or the npm entry.
   Proof first: before the change fileText has no module form and the tool has no --esm, so there is no .esm.js file at all.
   Usage: node tests/icon-set-esm-1209.test.js   → ICON_SET_ESM_1209_OK */
const fs = require('fs'), os = require('os'), path = require('path'), url = require('url'), assert = require('assert'), vm = require('vm');
const { execFileSync } = require('child_process');
require('./limit.js');
const ROOT = path.join(__dirname, '..'), TOOL = path.join(ROOT, 'tools', 'icons', 'site-icons.js');
const sites = require(TOOL), layout = require(path.join(ROOT, 'platform', 'icons', 'layout.js'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'plenix-icon-esm-'));
let failed = 0, passed = 0;
const check = async (name, fn) => { try { await fn(); passed++; } catch (e) { failed++; console.log('FAIL ' + name + ': ' + e.message); } };
// run a classic file as a page does: what it registers
const classic = (text) => { const registered = []; new Function('window', 'console', text)({ Plenix: { registerIcons: (a) => { for (const m of [].concat(a)) registered.push(m); } } }, { warn() {} }); return registered; };
// run a module: its registerIcons import is a stub that records; the file is imported from a folder of its own
let n = 0;
const esm = async (text) => {
  const dir = path.join(tmp, 'm' + (++n), 'icons'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '..', 'registerIcons.js'), 'export const registered = [];\nexport function registerIcons(a) { for (const m of [].concat(a)) registered.push(m); }\n');
  fs.writeFileSync(path.join(dir, '..', 'package.json'), '{"type":"module"}');
  const file = path.join(dir, 'set.js'); fs.writeFileSync(file, text);
  await import(url.pathToFileURL(file).href);
  return (await import(url.pathToFileURL(path.join(dir, '..', 'registerIcons.js')).href)).registered;
};
const SPEC = '../registerIcons.js';
(async () => {
  const compatText = fs.readFileSync(path.join(ROOT, sites.COMPAT), 'utf8');
  // the module is a build output (platform/dist is not committed): the test builds it itself, into its own temporary folder
  const built = typeof sites.buildCompatModule === 'function' ? sites.buildCompatModule(ROOT, { file: path.join(tmp, 'plenix-icons-plenix.esm.js') }) : null;
  check('AC-1 the compatibility module is built by the tool, and building it again changes nothing', () => {
    assert.ok(built, 'tools/icons/site-icons.js has no buildCompatModule');
    assert.ok(built.bytes > 100000 && built.icons > 200, 'the compatibility module is too small: ' + built.bytes + ' bytes, ' + built.icons + ' icons');
    assert.deepStrictEqual(sites.buildCompatModule(ROOT, { file: path.join(tmp, 'plenix-icons-plenix.esm.js'), check: true }).stale, [], 'a second build differs');
  });
  const compatEsm = built ? built.text : '';
  await check('AC-2 it registers the same modules as the classic file, once each', async () => {
    assert.ok(compatEsm, 'no plenix-icons-plenix.esm.js');
    assert.ok(compatEsm.includes(sites.HEADER), 'no generated header'); assert.ok(/^import \{ registerIcons \} from '[^']+';$/m.test(compatEsm), 'no registerIcons import');
    const a = classic(compatText), b = await esm(compatEsm);
    assert.deepStrictEqual(b.map((m) => m.name).sort(), a.map((m) => m.name).sort()); assert.strictEqual(new Set(b.map((m) => m.name)).size, b.length);
    const byName = new Map(a.map((m) => [m.name, m])); for (const m of b) assert.deepStrictEqual(m, byName.get(m.name), m.name + ' differs from the classic file');
  });
  await check('AC-3 every drawing passes the allow-list', async () => {
    const S = (() => { const code = require('@babel/standalone').transform(fs.readFileSync(path.join(ROOT, 'platform', 'utils', 'iconSafety.ts'), 'utf8'), { sourceType: 'module', filename: 'iconSafety.ts', presets: ['typescript'], plugins: ['transform-modules-commonjs'] }).code; const m = { exports: {} }; new Function('module', 'exports', 'require', code)(m, m.exports, require); return m.exports; })();
    for (const m of await esm(compatEsm)) for (const size of [20, 24]) for (const k of ['outline', 'fill']) { const r = S.checkDrawing(m.drawings[size][k]); assert.ok(r.ok, m.name + ' ' + size + ' ' + k + ': ' + r.reason); }
  });
  await check('neither form loads anything else', () => {
    for (const [what, text] of [['module', compatEsm], ['classic', compatText]]) {
      const code = what === 'module' ? text.replace(/^import \{ registerIcons \} from '[^']+';$/m, '') : text;
      for (const [label, re] of [['an import() call', /(^|[^\w$."'])import\s*\(/m], ['a fetch() call', /\bfetch\s*\(/], ['a URL', /https?:/], ['an eval() call', /\beval\s*\(/], ['innerHTML', /\.innerHTML\b/], ['another import', /^import\s/m]]) assert.ok(!re.test(code), what + ' file has ' + label);
    }
  });
  await check('AC-4 a site\'s set is its own file and far smaller than the compatibility set', async () => {
    const site = path.join(tmp, 'src'); fs.mkdirSync(site, { recursive: true });
    fs.writeFileSync(path.join(site, 'a.jsx'), "export const A = () => <><Icon name=\"add\" /><Icon name=\"close\" /><Button icon=\"search\" /></>;\n");
    const r = sites.siteFile(ROOT, 'one', [site], tmp, {}), mod = sites.fileText('one', [], '', '', SPEC);
    assert.strictEqual(typeof r.text, 'string'); assert.ok(mod.includes("from '" + SPEC + "'"), 'fileText has no module form');
    const text = sites.siteFile(ROOT, 'one', [site], tmp, { esm: SPEC }).text;
    assert.ok(/^import \{ registerIcons \} from /m.test(text), 'siteFile ignores the esm option');
    const got = await esm(text);
    assert.deepStrictEqual(got.map((m) => m.name).sort(), ['add', 'close', 'search']);
    assert.ok(Buffer.byteLength(text) * 20 < Buffer.byteLength(compatEsm), 'a three-icon set is not far smaller: ' + Buffer.byteLength(text) + ' vs ' + Buffer.byteLength(compatEsm));
    console.log('bytes: compatibility set ' + Buffer.byteLength(compatEsm) + ' (module), ' + Buffer.byteLength(compatText) + ' (classic); a three-icon site set ' + Buffer.byteLength(text) + ' (module)');
  });
  await check('AC-6 the tool\'s --esm writes the module, with the given import path or the npm entry', async () => {
    const site = path.join(tmp, 'src2'); fs.mkdirSync(site, { recursive: true }); fs.writeFileSync(path.join(site, 'a.jsx'), "export const A = () => <Icon name=\"add\" />;\n");
    const run = (args) => execFileSync(process.execPath, [TOOL, 'two', site, '--out', tmp, ...args], { cwd: tmp, encoding: 'utf8' });
    run(['--esm']); const a = fs.readFileSync(path.join(tmp, 'plenix-icons-two.esm.js'), 'utf8');
    assert.ok(a.includes("from '@plenix-ds/react/registerIcons'"), 'the npm entry is the default import path'); assert.ok(fs.existsSync(path.join(tmp, 'plenix-icons-two.esm.js')));
    run(['--esm', '--import', '../registerIcons.js']); assert.ok(fs.readFileSync(path.join(tmp, 'plenix-icons-two.esm.js'), 'utf8').includes("from '../registerIcons.js'"), 'a given path is used');
    run([]); assert.ok(/^\(function \(\) \{/m.test(fs.readFileSync(path.join(tmp, 'plenix-icons-two.js'), 'utf8')), 'without --esm the classic file is written as before'); assert.ok(!fs.existsSync(path.join(tmp, 'plenix-icons-three.esm.js')));
  });
  await check('without --out the file goes in the current folder (the first argument is the site, not a flag value)', () => {
    const site = path.join(tmp, 'src3'), cwd = path.join(tmp, 'cwd'); fs.mkdirSync(site, { recursive: true }); fs.mkdirSync(cwd, { recursive: true }); fs.writeFileSync(path.join(site, 'a.jsx'), "export const A = () => <Icon name=\"add\" />;\n");
    execFileSync(process.execPath, [TOOL, 'four', site], { cwd, encoding: 'utf8' }); assert.ok(fs.existsSync(path.join(cwd, 'plenix-icons-four.js')), 'plenix-icons-four.js is not in the current folder');
    execFileSync(process.execPath, [TOOL, 'four', site, '--esm'], { cwd, encoding: 'utf8' }); assert.ok(fs.existsSync(path.join(cwd, 'plenix-icons-four.esm.js')));
  });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'ICON_SET_ESM_1209_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})();
