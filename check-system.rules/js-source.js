// Plenix · check-system rule "js-source" (docs/adr/0011, closing addendum; #61): Plenix's source under platform/ is TypeScript.
// A .js or .jsx file tracked under platform/ is a finding unless platform/standards/js-source.json lists it: `allowed` (a file
// or a folder ending in "/", permanent, with its reason) or `pending` (still to convert). platform/design-system (the spec
// site), vendor, dist and mobile are outside the rule. A pending entry whose file is now TypeScript is not a finding: the
// list is pruned by hand, so parallel conversions never conflict on it.
// Alone: node check-system.rules/js-source.js   -> JS_SOURCE_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const NAME = 'js-source';
const ROOT = path.join(__dirname, '..');
const LIST = path.join(ROOT, 'platform', 'standards', 'js-source.json');
const OUTSIDE = /^platform\/(design-system|vendor|dist|mobile)\//;

function tracked() {
  try {
    return execFileSync('git', ['ls-files', '--', 'platform/*.js', 'platform/*.jsx', 'platform/**/*.js', 'platform/**/*.jsx'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean).filter((f) => fs.existsSync(path.join(ROOT, f)));
  } catch { return []; }
}

function findings(files = tracked()) {
  const list = JSON.parse(fs.readFileSync(LIST, 'utf8'));
  const allowed = Object.keys(list.allowed || {}), pending = new Set(list.pending || []);
  const ok = (f) => pending.has(f) || allowed.some((k) => (k.endsWith('/') ? f.startsWith(k) : f === k));
  return [...new Set(files)].filter((f) => !OUTSIDE.test(f) && !ok(f)).sort()
    .map((f) => ({ file: path.join(ROOT, f), text: 'is JavaScript: write it as .ts/.tsx (docs/adr/0011), or, when a reader needs JavaScript, add it to `allowed` in platform/standards/js-source.json with the reason (G3)' }));
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'JS_SOURCE_FAIL (' + list.length + ')' : 'JS_SOURCE_OK');
  process.exit(list.length ? 1 : 0);
}
