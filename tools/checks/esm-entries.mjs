// Code per screen (ADR 0052, #1208): the entries equal the public exports. Read-only, on a built release.
//   node tools/checks/esm-entries.mjs [--release <folder>]   (default: release/, version from package.json)
// Fails (ESM_ENTRIES_FAIL, exit 1) when:
//   - a name in api/v1/exports.json lacks dist/parts/<name>.js or parts/<name>.d.ts (npm), esm/<name>.js or its
//     esm/manifest.json entry (CDN), or one of those holds a name that is no export;
//   - a relative import in esm/ (static or a literal import()) names a file that is not there;
//   - plenix-loader.js or a vendor/*.esm.js React module is missing;
//   - a module in esm/, or the whole-file plenix.esm.js, reads process.env (a bundler's name: a page without one has no
//     process; #1274).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const REACT_SHIMS = ['react.esm.js', 'react-dom.esm.js', 'react-dom-client.esm.js', 'react-jsx-runtime.esm.js'];

// names: the public exports; sets: the names each place holds. Returns the differences as findings.
export function compare(names, sets) {
  const want = new Set(names), out = [];
  for (const [where, have] of Object.entries(sets)) {
    for (const n of want) if (!have.has(n)) out.push(`${where}: ${n} is missing`);
    for (const n of have) if (!want.has(n)) out.push(`${where}: ${n} is no export`);
  }
  return out;
}

// every relative specifier in a module: import/export … from, bare import '…', and import('…') with a literal
export function specifiers(code) {
  const out = [];
  for (const m of code.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}\/[^"']+)["']/g)) out.push(m[1]);
  return out;
}

// the bundler-only names a module reads (process.env.<NAME>)
export function bundlerOnly(code) {
  return [...new Set([...code.matchAll(/\bprocess\.env\.\w+/g)].map((m) => m[0]))];
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
const base = (dir, ext) => new Set(fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)) : []);

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const i = process.argv.indexOf('--release');
  const REL = i > 0 ? path.resolve(process.argv[i + 1]) : path.join(ROOT, 'release');
  const version = require(path.join(ROOT, 'package.json')).version;
  const CDN = path.join(REL, 'cdn', version), R = path.join(REL, 'packages', 'react'), ESM = path.join(CDN, 'esm');
  const api = path.join(REL, 'api', 'v1', 'exports.json');
  const need = [api, path.join(ESM, 'manifest.json'), path.join(CDN, 'plenix-loader.js'), ...REACT_SHIMS.map((f) => path.join(CDN, 'vendor', f))];
  const missing = need.filter((f) => !fs.existsSync(f));
  if (missing.length) { missing.forEach((f) => console.log('ESM_ENTRIES_FAIL: ' + path.relative(ROOT, f) + ' is missing: run node build-packages.js')); process.exit(1); }
  const names = JSON.parse(fs.readFileSync(api, 'utf8')).exports.map((e) => e.name);
  // esm/ top level: the entries, the barrel, and the modules at the top of platform/ (version.js is both)
  const top = base(ESM, '.js');
  top.delete('index');
  const findings = compare(names, {
    'npm dist/parts': base(path.join(R, 'dist', 'parts'), '.js'),
    'npm parts (types)': base(path.join(R, 'parts'), '.d.ts'),
    'CDN esm/': top,
    'CDN esm/manifest.json': new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(ESM, 'manifest.json'), 'utf8')).entries)),
  });
  let files = 0;
  for (const f of walk(ESM).filter((x) => x.endsWith('.js'))) {
    files++;
    const code = fs.readFileSync(f, 'utf8');
    for (const b of bundlerOnly(code)) findings.push(`${path.relative(CDN, f)} reads ${b}, which a page without a bundler does not have`);
    for (const s of specifiers(code)) {
      const to = path.resolve(path.dirname(f), s);
      if (!fs.existsSync(to)) findings.push(`${path.relative(CDN, f)} imports ${s}, which is not there`);
    }
  }
  // the whole-file module is imported without a bundler too (1.x, deprecated by ADR 0052; #1274)
  const whole = path.join(CDN, 'plenix.esm.js');
  if (!fs.existsSync(whole)) findings.push('plenix.esm.js is missing');
  else for (const b of bundlerOnly(fs.readFileSync(whole, 'utf8'))) findings.push(`plenix.esm.js reads ${b}, which a page without a bundler does not have`);
  if (findings.length) { findings.slice(0, 40).forEach((x) => console.log('ESM_ENTRIES_FAIL: ' + x)); if (findings.length > 40) console.log(`… and ${findings.length - 40} more`); process.exit(1); }
  console.log(`ESM_ENTRIES_OK (${names.length} exports: npm parts and types, CDN esm/ and its manifest; ${files} modules, every relative import there)`);
}
