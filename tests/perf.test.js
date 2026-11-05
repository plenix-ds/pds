// Plenix · performance budgets over the actual package artifacts. A test: it runs only when the owner starts it
// (HANDOFF.md "No tests"); in CI, the build job's release-build tests (node tests/run.js --release, issue 756), after node
// build-packages.js; CLI: node tests/perf.test.js. Missing artifacts fail with a build instruction.
const fs = require('fs'), path = require('path'), zlib = require('zlib'), assert = require('assert');
const ROOT = path.resolve(__dirname, '..');
const BUDGETS = [
  { file: 'react/dist/index.js', raw: 2 * 1024 * 1024, gzip: 512 * 1024 },
  { file: 'styles/plenix.min.css', raw: 3 * 1024 * 1024, gzip: 384 * 1024 },
  { file: 'web-components/plenix-shadow.css', raw: 3 * 1024 * 1024, gzip: 384 * 1024 },
  { file: 'web-components/index.js', raw: 32 * 1024, gzip: 12 * 1024 },
  { file: 'mcp/server.cjs', raw: 32 * 1024, gzip: 12 * 1024 }
];
function checkBudgets(root = ROOT, budgets = BUDGETS) {
  return budgets.map((budget) => {
    const file = path.join(root, 'release', 'packages', budget.file);
    assert(fs.existsSync(file), 'Missing ' + budget.file + ': run node build-app.js and node build-packages.js first.');
    const bytes = fs.readFileSync(file), raw = bytes.length, gzip = zlib.gzipSync(bytes, { level: 9 }).length;
    assert(raw <= budget.raw && gzip <= budget.gzip, budget.file + ': ' + raw + '/' + budget.raw + ' raw, ' + gzip + '/' + budget.gzip + ' gzip bytes exceeds the performance budget.');
    return { file: budget.file, raw, gzip, rawBudget: budget.raw, gzipBudget: budget.gzip };
  });
}
module.exports = { BUDGETS, checkBudgets };
if (require.main === module) {
  try { const results = checkBudgets(); results.forEach((r) => console.log(r.file + ': ' + r.raw + ' raw, ' + r.gzip + ' gzip bytes')); console.log('PERF_OK ' + results.length + ' actual package artifacts'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
