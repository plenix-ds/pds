// Plenix · the published type names never go (#894, VERSIONING.md): every name @plenix-ds/react exported in a past release
// (tests/fixtures/published-names-<version>.txt) is still exported by the built release/packages/react/index.d.ts.
// A removal is a MAJOR change; before 1.0 it needs a deprecation first, so a name missing here fails.
//   node tools/checks/published-names.mjs   -> PUBLISHED_NAMES_OK, or the missing names and exit 1 (build the types first)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ts = createRequire(import.meta.url)('typescript');

export function exportedNames(file) {
  const program = ts.createProgram([file], { noEmit: true, skipLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React, types: [] });
  const checker = program.getTypeChecker(), source = program.getSourceFile(file), symbol = source && checker.getSymbolAtLocation(source);
  return new Set(symbol ? checker.getExportsOfModule(symbol).map((s) => s.name) : []);
}

export function missingNames(index = path.join(ROOT, 'release/packages/react/index.d.ts')) {
  const now = exportedNames(index), out = [];
  const dir = path.join(ROOT, 'tests/fixtures');
  for (const f of fs.readdirSync(dir).filter((n) => /^published-names-.+\.txt$/.test(n)).sort()) {
    for (const name of fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter((l) => l && !l.startsWith('#'))) if (!now.has(name)) out.push(name + ' (' + f + ')');
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const index = path.join(ROOT, 'release/packages/react/index.d.ts');
  if (!fs.existsSync(index)) { console.log('PUBLISHED_NAMES_FAIL build the types first (node tools/publish/react-types.js)'); process.exit(2); }
  const missing = missingNames(index);
  missing.forEach((m) => console.log('  missing: ' + m));
  console.log(missing.length ? 'PUBLISHED_NAMES_FAIL (' + missing.length + ')' : 'PUBLISHED_NAMES_OK');
  process.exit(missing.length ? 1 : 0);
}
