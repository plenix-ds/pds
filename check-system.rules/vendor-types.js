// Plenix · check-system rule "vendor-types" (docs/adr/0011 addendum, D-0067, #292): a type-only devDependency for a vendored
// engine is the vendored version exactly, so the types describe the code that runs.
// Today: Tiptap. Every "@tiptap/*" in package.json devDependencies must be the exact version the vendored bundle was built
// from (platform/vendor/tiptap/README.md, the "Version" column of tiptap.min.js), with no range (^, ~, >, *). Nothing in
// platform/ may import a "@tiptap/*" package except with `import type` (the engine comes from the vendored bundle only).
// Alone: node check-system.rules/vendor-types.js   -> VENDOR_TYPES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'vendor-types';
const ROOT = path.join(__dirname, '..');
const README = path.join(ROOT, 'platform', 'vendor', 'tiptap', 'README.md');

function vendoredVersion() {
  const text = fs.existsSync(README) ? fs.readFileSync(README, 'utf8') : '';
  const row = text.split('\n').find((l) => /^\|\s*`tiptap\.min\.js`/.test(l));
  const m = row && row.match(/\|\s*(\d+\.\d+\.\d+)\s*\(/);
  return m ? m[1] : null;
}

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (n === 'vendor' || n === 'dist' || n === 'node_modules') continue;
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(n)) out.push(p);
  }
  return out;
}

function findings() {
  const out = [];
  const pkgFile = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
  const dev = pkg.devDependencies || {};
  const want = vendoredVersion();
  for (const name of Object.keys(pkg.dependencies || {})) {
    if (/^@tiptap\//.test(name)) out.push({ file: pkgFile, text: name + ' is a dependency: Tiptap ships only as the vendored bundle; a types package belongs in devDependencies' });
  }
  for (const [name, range] of Object.entries(dev)) {
    if (!/^@tiptap\//.test(name)) continue;
    if (!want) { out.push({ file: README, text: 'the vendored Tiptap version is not readable from the README table, so ' + name + ' cannot be checked' }); continue; }
    if (range !== want) out.push({ file: pkgFile, text: name + ' is "' + range + '"; it must be exactly the vendored "' + want + '" (platform/vendor/tiptap/README.md)' });
  }
  for (const file of walk(path.join(ROOT, 'platform'), [])) {
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/^\s*import\s+(type\s+)?[^;]*?from\s+['"](@tiptap\/[^'"]+)['"]/gm)) {
      if (!m[1]) out.push({ file, text: 'imports ' + m[2] + ' as code: use `import type` (the engine comes from the vendored bundle, platform/vendor/tiptap)' });
    }
  }
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, vendoredVersion, NAME };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'VENDOR_TYPES_FAIL (' + list.length + ')' : 'VENDOR_TYPES_OK (Tiptap ' + vendoredVersion() + ')');
  process.exit(list.length ? 1 : 0);
}
