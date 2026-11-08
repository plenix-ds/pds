// Plenix · check-system rule "no-default-skeleton" (#1032, ADR 0042, D-0130): Skeleton is opt-in only. No Plenix component, pattern or template draws
// skeleton bars as a default loading state; a region's loading state is LoadingState (a ring and a label, after a delay).
// What it rejects: a file under platform/components, platform/patterns or platform/templates, other than components/Loading/, that imports Skeleton
// or writes the plx-skeleton class.
// Alone: node check-system.rules/no-default-skeleton.js     -> NO_DEFAULT_SKELETON_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const NAME = 'no-default-skeleton';
const ROOT = path.join(__dirname, '..');
function files() {
  try { return execFileSync('git', ['ls-files', 'platform/components', 'platform/patterns', 'platform/templates'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter((f) => /\.(tsx?|jsx?|css)$/.test(f) && !/^platform\/components\/Loading\//.test(f)); }
  catch (e) { return []; }
}
function check({ add }) {
  for (const f of files()) {
    const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
    lines.forEach((l, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;   // a comment may say what the file no longer uses
      if (/import\s*\{[^}]*\bSkeleton\b[^}]*\}\s*from/.test(l) || /plx-skeleton/.test(l) || /<Skeleton\b/.test(l)) add(NAME, path.join(ROOT, f), i + 1, 'Skeleton is opt-in only (D-0130): draw a region\'s loading state with LoadingState');
    });
  }
}
module.exports = { name: NAME, check };
if (require.main === module) {
  const found = []; check({ add: (n, f, line, msg) => found.push(path.relative(ROOT, f) + ':' + line + '  ' + msg) });
  if (found.length) { console.log(found.join('\n')); process.exit(1); }
  console.log('NO_DEFAULT_SKELETON_OK');
}
