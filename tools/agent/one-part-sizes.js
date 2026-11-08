// node tools/agent/one-part-sizes.js [--check] [--entry <file>]
// What one import from @plenix-ds/react costs an application (#685): tiny applications that import one part, bundled the
// way the audit measured (#684, #685): minified, React external, against the built package
// (release/packages/react, from node build-packages.js). Prints the minified and gzipped size of each; --check fails when an import
// goes above its limit, so tree-shaking cannot break again unseen. Not a test: it builds and measures, it runs no page.
// Two bundlers, one case list (#807, owner): Vite (Rollup with esbuild's minifier, tools/agent/one-part-vite.mjs) is the measure: it is what most
// consumers of the package use, and the limits are checked against it. esbuild (the audit's bundler, #684, #685) stays as a cross-check: it reports its
// number beside it and never fails. They can differ a lot for a part that loads another part on first use (a dynamic import()): Rollup keeps what only
// that part needs in its own chunk; esbuild's splitting puts the public components such a part shares with the package's index into a chunk the entry
// imports statically, so it counts them at the start.
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib'), cp = require('child_process');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '../..');
const PKG = path.join(ROOT, 'release', 'packages', 'react');
// the imports measured, with their limits in KB, minified (#685). Before #685 every one-part import cost the whole library,
// 913 KB; the whole library was 1,608.0 KB. A limit holds the size measured when it was set, with a little room. #702
// (Arabic opt-in, the icon names loaded when needed): Button 317.5 -> 101.4, Badge 79.0 -> 25.0, DataGrid 645.0 -> 428.9,
// * as P 1608.5 -> 1392.4 (Button's start is now mostly the English words, 53 KB, and Icon, 24 KB)
const CASES = [
  { name: '{ Button }', code: 'import { Button } from "plenix"; console.log(Button);', limit: 105 },
  { name: '{ Badge }', code: 'import { Badge } from "plenix"; console.log(Badge);', limit: 30 },
  { name: '{ DataGrid }', code: 'import { DataGrid } from "plenix"; console.log(DataGrid);', limit: 455 }, // 455 (D-0139, #1103): 1.3.0 measures 451.4 KB with columns[].lines, the cut-text Tooltip (ADR 0043) and the placeholder LoadingState (ADR 0042); 450: #714's module split (call objects, about 1.6 KB) and room for #465 cell selection (opt-in)
  { name: '* as P', code: 'import * as P from "plenix"; console.log(P);', limit: 1450 }, // 1,450 (the DataGrid cell editors, #84: the date editor on main measures 1,434.7); 1,430: the owner-approved #775 and #769 parts add about 1 to 2 KB each (1,420 for the branch loader #814, Anchor, Cascader extras; 1,430 for the visible rows #815, the pickers' time zone #813, EntityTitle #803 and the control cards #804, which measure about 1,424 together)
];
// the module the application imports: the package's ES module entry, as a bundler reads it (package.json "module")
const entryOf = () => path.join(PKG, JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).module);

// each case bundled against entry: [{ name, kb, gz, limit, over, esKb, esGz }]. kb and gz are Vite's (the limit applies to them), esKb and esGz esbuild's.
// Bundled with splitting, as an application's bundler does, and counted as what loads at the start: the entry and the chunks it imports statically. A chunk
// only a dynamic import() reaches (the icon name list, #702) loads later, when needed, and is not counted. With no dynamic import this is the same number
// as one flat file (#685's measure).
function measure(entry = entryOf()) {
  const run = cp.spawnSync(process.execPath, [path.join(__dirname, 'one-part-vite.mjs'), entry], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (run.status !== 0) throw new Error('one-part-vite.mjs failed: ' + (run.stderr || run.stdout).slice(0, 400));
  const vite = Object.fromEntries(JSON.parse(run.stdout).map((r) => [r.name, r]));
  return measureEsbuild(entry).map((e) => {
    const c = CASES.find((x) => x.name === e.name), v = vite[e.name], kb = v.bytes / 1024;
    return { name: e.name, kb, gz: v.gzip / 1024, limit: c.limit, over: kb > c.limit, esKb: e.kb, esGz: e.gz };
  });
}
function measureEsbuild(entry) {
  return CASES.map((c) => {
    const out = esbuild.buildSync({
      entryPoints: { app: caseFile(c) }, absWorkingDir: ROOT,
      bundle: true, minify: true, write: false, format: 'esm', target: 'es2019', logLevel: 'silent', splitting: true, outdir: path.join(ROOT, '.one-part-sizes'), metafile: true,
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'], alias: { plenix: entry },
    });
    const files = new Map(out.outputFiles.map((f) => [f.path, f.contents]));
    const outputs = out.metafile.outputs, start = Object.keys(outputs).find((k) => outputs[k].entryPoint), seen = new Set();
    const walk = (k) => { if (seen.has(k)) return; seen.add(k); outputs[k].imports.filter((i) => i.kind === 'import-statement' && outputs[i.path]).forEach((i) => walk(i.path)); };
    walk(start);
    const code = Buffer.concat([...seen].map((k) => Buffer.from(files.get(path.resolve(ROOT, k))))), kb = code.length / 1024;
    return { name: c.name, kb, gz: zlib.gzipSync(code).length / 1024 };
  });
}
// a case's code as a file in the scratch folder: splitting needs a real entry point (stdin cannot be split)
function caseFile(c) {
  const dir = path.join(require('os').tmpdir(), 'plenix-one-part-sizes');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, c.name.replace(/\W+/g, '_') + '.js');
  fs.writeFileSync(file, c.code);
  return file;
}
const line = (r) => r.name.padEnd(13) + (r.kb.toFixed(1) + ' KB').padStart(11) + (r.gz.toFixed(1) + ' KB gzipped').padStart(19) + '   limit ' + r.limit + ' KB' + (r.over ? '   OVER' : '') + '   (esbuild ' + r.esKb.toFixed(1) + ' KB, cross-check)';
module.exports = { measure, line, entryOf, CASES };

if (require.main === module) {
  const args = process.argv.slice(2), at = args.indexOf('--entry');
  const entry = at >= 0 ? path.resolve(args[at + 1]) : entryOf();
  if (!fs.existsSync(entry)) { console.error('ONE_PART_SIZES_FAIL ' + path.relative(ROOT, entry) + ' is missing: run node build-app.js and node build-packages.js first'); process.exit(2); }
  const results = measure(entry);
  console.log('One import from ' + path.relative(ROOT, entry) + ' (Vite, minified, React external; esbuild beside it as a cross-check):');
  results.forEach((r) => console.log('  ' + line(r)));
  if (args.includes('--check')) {
    const over = results.filter((r) => r.over);
    if (over.length) { console.log('ONE_PART_SIZES_FAIL ' + over.map((r) => r.name + ' ' + r.kb.toFixed(1) + ' KB > ' + r.limit + ' KB').join('; ')); process.exit(1); }
    console.log('ONE_PART_SIZES_OK');
  }
}
