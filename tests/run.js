// Plenix tests · runs the tests one after another and times each (owner, 2026-10-13): by default in changed mode, only
// the checks for what changed (tests/changed.js); --full runs every page, the final gate when everything is marked complete.
// Every test runs even after one fails; the exit code is 1 when any failed.
//   node tests/run.js                      every automatic test, changed mode (npm test)
//   node tests/run.js --full               every automatic test, every page (npm run test:full)
//   node tests/run.js pages typography     only these tests (the CI matrix groups)
//   node tests/run.js keyboard:Toolbar,Tabs pages   only some parts of a test: the checks whose name starts with "Toolbar:" or
//                                          "Tabs:" (tests/check.js, TEST_ONLY); the test still runs once. tests/parts.json lists each
//                                          test's parts. TEST_RESULTS=<file> collects every counted check (tools/file-failures.js)
//   node tests/run.js --on-demand          the on-demand tests only (npm run test:on-demand; add --full for every page)
//   node tests/run.js --release            the tests of the release build only (after node build-packages.js)
//   node tests/run.js "zero-overlap --record"   a test with its own flags (issue 764): the flags follow the name, in the same
//                                          argument or in the ones right after it; only the flags in FLAGS pass, any other stops
// Where (owner, 2026-10-25: "make the test site ... no longer using the design spec for testing"): the browser tests open the
// St. John the Beloved test site (test-site/, tests/site.js) and the suite applications, never the design spec.
// On demand (owner, 2026-10-25: "Reserve only for as on demand test by owner and take out from the tests"):
// accessibility, high contrast, color contrast, themes and density run only when the owner asks for them, never in
// the automatic runs (npm test, the per-push CI, the full suite). Each still runs by name: node tests/run.js a11y
const path = require('path');
const { spawnSync } = require('child_process');

const AUTOMATIC = ['site-coverage', 'site-parts', 'visual', 'layout', 'pages', 'keyboard', 'data-grid', 'typography', 'component-tokens', 'reflow',
  'formats', 'icon-safety', 'utilities', 'focus-order', 'semantic-html', 'navigation', 'one-primary', 'brand-rules', 'login', 'selector-kinds', 'zero-overlap', 'types', 'fill-693', 'rtl-truncate-audit-1283', 'rtl-truncate-1281', 'data-font-b-1262', 'root-has-1226', 'action-bar-root-1235', 'nav-panes-1243', 'has-custom-props-1226', 'stack-inline-fields-1250', 'metric-card-person-tile-order-1240',
  // the ECharts charts and sparklines (owner, codex-q3-27: they join the automatic check; #382 F9)
  'charts-echarts-353', 'sparkline-echarts-353', 'treechart-echarts',
  // tests without a browser that were started by hand only (issue 756): the Arabic catalog, the baseline scanner, the site icon files
  'arabic-catalog-427', 'baseline-scan-273', 'site-icons'];
const ON_DEMAND = ['a11y', 'high-contrast', 'contrast', 'theme', 'density'];
// the tests of the release build (release/packages/ and release/cdn/, written by node build-packages.js), by name or with --release:
// the CI build job runs them after its release build (issue 756). They are not in the default run, which needs no release build
const RELEASE = ['perf', 'w15c-packages', 'icons-package-282', 'cdn-devx'];
// the design spec's own checks, by name only: the spec's component labs (its Edit dialog's tokens) belong to the spec
// (platform/design-system), which loads Plenix from the CDN; the automatic runs never open the spec (owner, 2026-10-25)
const SPEC_ONLY = ['labs'];
const ALL = AUTOMATIC.concat(ON_DEMAND, SPEC_ONLY, RELEASE);
// the flags a test reads itself (owner, issue 764: his test runs refresh a baseline). Only these pass to the test; any other
// flag after a name stops the run, so a typo never records a baseline silently
const FLAGS = {
  'visual': ['--update'], 'typography': ['--update'], 'component-tokens': ['--update'], 'reflow': ['--update'],
  'focus-order': ['--update'], 'a11y': ['--update'], 'zero-overlap': ['--record'],
};
// site-coverage reads --list too, but it only prints a table and writes nothing, so it is left out of FLAGS on purpose
const RUN_FLAGS = ['--full', '--on-demand', '--release'];
// reads the arguments; returns { full, onDemand, release, parts, flags, names } or { error }. One argument may hold a name
// and its flags ("zero-overlap --record", as the owner's runner passes a whole line): only the "--" words after the name are
// split off, so a name with its parts keeps its spaces ("keyboard:Toolbar, Tabs"). A flag with no name before it stops the run
function readArgs(argv) {
  const words = [];
  for (const x of argv) {
    String(x).trim().split(/\s+(?=--)/).filter(Boolean).forEach((piece) => {
      if (/^--/.test(piece)) words.push(...piece.split(/\s+/)); else words.push(piece);
    });
  }
  const out = { full: words.includes('--full'), onDemand: words.includes('--on-demand'), release: words.includes('--release'),
    parts: {}, flags: {}, names: [] };
  let last = null;
  for (const a of words) {
    if (RUN_FLAGS.includes(a)) continue;
    if (/^--/.test(a)) {
      if (!last) return { error: 'Flag ' + a + ' has no test name before it (for example: zero-overlap --record)' };
      if (ALL.indexOf(last) < 0) continue; // the unknown name stops the run below, as "No such test"
      const ok = FLAGS[last] || [];
      if (!ok.includes(a)) return { error: 'Flag ' + a + ' is not allowed for ' + last + (ok.length ? ' (allowed: ' + ok.join(', ') + ')' : ' (it takes no flags)') };
      if (!out.flags[last].includes(a)) out.flags[last].push(a);
      continue;
    }
    // a name may carry its parts: keyboard:Toolbar,Tabs (the parts are passed to that test only, as TEST_ONLY)
    const i = a.indexOf(':');
    const n = (i < 0 ? a : a.slice(0, i)).trim();
    if (i >= 0) out.parts[n] = a.slice(i + 1).split(',').map((x) => x.trim()).filter(Boolean);
    if (ALL.indexOf(n) >= 0) out.flags[n] = out.flags[n] || [];
    out.names.push(n); last = n;
  }
  return out;
}
// the lists, for the CI job that groups the automatic tests (tools/ci/behavior-tests.mjs, #1327); requiring this file runs nothing
module.exports = { AUTOMATIC, ON_DEMAND, RELEASE, SPEC_ONLY, ALL, readArgs };
if (require.main === module) main();

function main() {
  const read = readArgs(process.argv.slice(2));
  if (read.error) { console.error(read.error); process.exit(2); }
  const { full, onDemand, release, parts, flags, names } = read;
  const bad = names.filter((n) => ALL.indexOf(n) < 0);
  if (bad.length) { console.error('No such test: ' + bad.join(', ') + ' (tests: ' + ALL.join(', ') + ')'); process.exit(2); }
  const env = Object.assign({}, process.env, full ? { TEST_SCOPE: 'full' } : {});
  const list = names.length ? names : onDemand ? ON_DEMAND : release ? RELEASE : AUTOMATIC;
  const failed = [], times = [];
  const t0 = Date.now();
  for (const n of list) {
    const t = Date.now();
    console.log('\n── ' + n + (full ? ' (full)' : ''));
    const only = parts[n] && parts[n].length ? parts[n].join(',') : '';
    if (only) console.log('   parts: ' + only);
    const own = flags[n] || [];
    if (own.length) console.log('   flags: ' + own.join(' '));
    const r = spawnSync(process.execPath, [path.join(__dirname, n + '.test.js')].concat(own), { stdio: 'inherit', env: Object.assign({}, env, { TEST_ONLY: only }) });
    const s = ((Date.now() - t) / 1000).toFixed(1);
    times.push(n + ' ' + s + 's');
    if (r.status !== 0) failed.push(n);
  }
  console.log('\nTIMES ' + times.join(' · ') + ' · total ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
  console.log(failed.length ? 'TESTS_FAIL ' + failed.join(', ') : 'TESTS_OK ' + list.length + ' tests');
  process.exit(failed.length ? 1 : 0);
}
