// node tools/agent/types-any.js [--check] [--update] [--top N] [file]
// How many props of @plenix-ds/react's TypeScript declarations are still `any` (#687, from the audit #684). Reads the built
// declarations (release/packages/react/index.d.ts, written by build-types.js through node build-packages.js, or node build-types.js
// alone) and counts the prop lines typed `?: any;`. The index signature every Props interface keeps ([prop: string]: any)
// is not a prop and is not counted.
//   --check   fails (TYPES_ANY_FAIL) when the count is above the recorded one (types-any.baseline.json): it only goes down
// CI does not run this script. Its gate is tools/ci/new-problems.mjs types (#61), which reads index.d.ts and the types/ files it
// re-exports, and also counts a component whose whole props object is `any`.
//   --update  records today's count (a deliberate step, in the pull request that lowers it)
//   --top N   also prints the N prop names most often left `any`
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const BASELINE = path.join(ROOT, 'types-any.baseline.json');
const args = process.argv.slice(2);
const file = path.resolve(args.find((a) => /\.d\.ts$/.test(a)) || path.join(ROOT, 'release', 'packages', 'react', 'index.d.ts'));

function count(text) {
  const props = text.match(/^\s+[\w$]+\?: .+;$/gm) || [];
  const any = props.filter((l) => /\?: any;$/.test(l));
  const names = {};
  for (const l of any) { const n = /^\s+([\w$]+)\?/.exec(l)[1]; names[n] = (names[n] || 0) + 1; }
  return { props: props.length, any: any.length, names };
}
module.exports = { count, BASELINE };

if (require.main === module) {
  if (!fs.existsSync(file)) { console.log('TYPES_ANY_FAIL ' + path.relative(ROOT, file) + ' is missing: run node build-types.js (or node build-packages.js)'); process.exit(2); }
  const r = count(fs.readFileSync(file, 'utf8'));
  console.log('TypeScript props in ' + path.relative(ROOT, file) + ': ' + r.props + ', of them `any`: ' + r.any);
  const top = args.indexOf('--top');
  if (top >= 0) Object.entries(r.names).sort((a, b) => b[1] - a[1]).slice(0, +args[top + 1] || 30).forEach(([n, c]) => console.log('  ' + String(c).padStart(4) + '  ' + n));
  if (args.includes('--update')) { fs.writeFileSync(BASELINE, JSON.stringify({ about: 'The count of `any` props in @plenix-ds/react\'s index.d.ts (tools/agent/types-any.js, #687). It only goes down: lower it with --update in the pull request that types more props.', any: r.any }, null, 2) + '\n'); console.log('recorded ' + r.any); }
  if (args.includes('--check')) {
    const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')).any : null;
    if (base == null) { console.log('TYPES_ANY_FAIL types-any.baseline.json is missing: node tools/agent/types-any.js --update writes it'); process.exit(1); }
    if (r.any > base) { console.log('TYPES_ANY_FAIL ' + r.any + ' `any` props, up from ' + base); process.exit(1); }
    console.log(r.any < base ? 'TYPES_ANY_OK (' + r.any + ', down from ' + base + ': lower the baseline with --update)' : 'TYPES_ANY_OK (' + r.any + ')');
  }
}
