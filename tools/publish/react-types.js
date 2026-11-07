// The TypeScript definitions of @plenix-ds/react, straight from tsc (ADR 0011 wave 5, #889; it replaces build-types.js).
//   node tools/publish/react-types.js            writes release/packages/react/index.d.ts and types/
// Called by build-packages.js; tests/types.test.js and the "types" check of tools/ci/new-problems.mjs use it too.
//
// 1. `tsc --emitDeclarationOnly` (tsconfig.json, allowJs for the few allowed JavaScript data files) writes a declaration
//    for every source under platform/ into types/, platform/index.ts's own as types/index.d.ts. Import paths keep their
//    .ts/.tsx/.jsx endings in the emitted files, which a consumer's TypeScript cannot resolve, so they become .js
//    (TypeScript maps a .js path to its .d.ts). PLENIX_TYPES_STRICT=1 makes any tsc error fail.
// 2. index.d.ts is tsc's types/index.d.ts, its paths pointed at ./types/. For each TypeScript source it re-exports it adds
//    `export type * from` that file, so every props type (<Name>Props, item and value types) stays public, as before;
//    `export type *` re-exports types only, so the runtime names stay exactly platform/index.ts's.
// 3. Coverage gate: every name platform/index.ts exports must be in index.d.ts; an unfamiliar export form fails the build,
//    never disappears silently.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');

function emitDeclarations(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  const tsc = path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
  if (!fs.existsSync(tsc)) throw new Error('react-types: TypeScript is not installed (npm ci)');
  const r = spawnSync(process.execPath, [tsc, '-p', path.join(ROOT, 'tsconfig.json'), '--noEmit', 'false', '--declaration', '--emitDeclarationOnly', '--outDir', dir], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0 && process.env.PLENIX_TYPES_STRICT) throw new Error('react-types: tsc reported errors:\n' + (r.stdout || '').split('\n').filter((l) => /error TS/.test(l)).slice(0, 20).join('\n'));
  const walk = (d) => {
    for (const n of fs.existsSync(d) ? fs.readdirSync(d) : []) {
      const f = path.join(d, n);
      if (fs.statSync(f).isDirectory()) walk(f);
      else if (n.endsWith('.d.ts')) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/(from\s+|import\()(['"])(\.{1,2}\/[^'"]+?)\.(?:tsx|ts|jsx|js)\2/g, '$1$2$3.js$2'));
    }
  };
  walk(dir);
  if (!fs.existsSync(path.join(dir, 'index.d.ts'))) throw new Error('react-types: tsc wrote no types/index.d.ts (is platform/index.ts in tsconfig.json?)');
}

// tsc's index declarations -> the package's index.d.ts: each re-export on one line from "./types/…", plus its types
function indexFrom(tscIndex, version) {
  const lines = [], typeFiles = new Set();
  for (const m of tscIndex.matchAll(/export\s*\{([^}]*)\}\s*from\s*(['"])\.\/([^'"]+)\2;/g)) {
    const specs = m[1].split(',').map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const from = './types/' + m[3];
    lines.push('export { ' + specs.join(', ') + ' } from ' + JSON.stringify(from) + ';');
    // the props and item types of a TypeScript source; a JavaScript data file (allowed in js-source.json) publishes only
    // its named values, as before
    const ts = ['.ts', '.tsx'].some((x) => fs.existsSync(path.join(ROOT, 'platform', m[3].replace(/\.js$/, x))));
    if (ts && !typeFiles.has(from)) { typeFiles.add(from); lines.push('export type * from ' + JSON.stringify(from) + ';'); }
  }
  // anything else at the top level of tsc's index (a declaration written in index.ts itself) would be lost: refuse it
  const rest = tscIndex.replace(/export\s*\{[^}]*\}\s*from\s*(['"])[^'"]+\1;/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim();
  if (rest && rest !== 'export {};') throw new Error('react-types: platform/index.ts declares more than re-exports; only `export { … } from` is supported:\n' + rest.slice(0, 400));
  return '/* @plenix-ds/react ' + version + ' · TypeScript definitions from tsc (tools/publish/react-types.js; do not edit). */\n' + lines.join('\n') + '\n';
}

// the names platform/index.ts exports, read independently of tsc (Babel), and the names index.d.ts re-exports
function checkCoverage(indexTs, declarations) {
  const ast = require('@babel/standalone').transform(indexTs, { ast: true, code: false, sourceType: 'module', filename: 'index.ts', presets: ['typescript'] }).ast;
  const names = [];
  for (const node of ast.program.body) {
    if (node.type === 'ExportAllDeclaration' || node.type === 'ExportDefaultDeclaration') throw new Error('react-types: unsupported public export; use named re-exports in platform/index.ts');
    if (node.type !== 'ExportNamedDeclaration' || node.exportKind === 'type') continue;
    if (node.declaration) throw new Error('react-types: platform/index.ts declares an export itself; re-export it from its source file');
    for (const item of node.specifiers) if (item.exportKind !== 'type') names.push(item.exported.name || item.exported.value);
  }
  const declared = new Set();
  for (const m of declarations.matchAll(/^export \{([^}]+)\} from "[^"]+";$/gm)) m[1].split(',').map((x) => x.trim()).filter(Boolean).forEach((sp) => declared.add((/\bas\s+(\w+)$/.exec(sp) || [, sp])[1]));
  const missing = names.filter((n) => !declared.has(n));
  if (missing.length) throw new Error('react-types: missing declarations for ' + missing.join(', '));
  if (new Set(names).size !== names.length) throw new Error('react-types: platform/index.ts exports a name twice');
  return names;
}

module.exports = function buildReactTypes(outFile, version) {
  const dir = path.join(path.dirname(outFile), 'types');
  emitDeclarations(dir);
  const text = indexFrom(fs.readFileSync(path.join(dir, 'index.d.ts'), 'utf8'), version);
  const names = checkCoverage(fs.readFileSync(path.join(ROOT, 'platform', 'index.ts'), 'utf8'), text);
  fs.writeFileSync(outFile, text);
  return { exports: names.length, file: outFile };
};
module.exports.checkCoverage = checkCoverage;
module.exports.indexFrom = indexFrom;

if (require.main === module) {
  const out = path.join(ROOT, 'release', 'packages', 'react', 'index.d.ts');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const r = module.exports(out, require(path.join(ROOT, 'package.json')).version);
  console.log('Built ' + path.relative(ROOT, r.file) + ' (' + r.exports + ' exports)');
}
