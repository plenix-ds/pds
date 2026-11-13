// Plenix tests · the test site uses the whole Platform (owner, 2026-10-25: "a dummy site that utilizes all the defined pages,
// controls, components"). Every public export of platform/index.ts that draws something (a component, pattern, page
// template or provider: a name that starts with a capital letter) and every hook an application calls itself (APP_HOOKS)
// must be imported by the St. John the Beloved test site (its repository's site/**/*.jsx, tests/site.js) and used there. Not required: data, plain
// functions and constants (formatDate, DATA_COLORS), and the building hooks the components are made of.
// Also: every screen named in the site's pages.js exists, and every screen file is a route.
//   node tests/site-coverage.test.js          SITE_COVERAGE_OK, or the names the site does not use and exit 1
//   node tests/site-coverage.test.js --list   every required name and the screens that use it (the component -> page map)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(require('./site.js').DIR, 'site');
if (!fs.existsSync(SITE)) { console.log('SITE_COVERAGE_FAIL the St. John test site is not at ' + SITE + ' (clone github.com/LighthouseCollection/st-john-test-site beside this repository, or set SITE_DIR)'); process.exit(1); }
const read = (f) => fs.readFileSync(f, 'utf8');
const site = require('./site.js');

// the public names: export { A, B as C } from '…' in platform/index.ts (with the generated library block)
const names = [];
for (const m of read(path.join(ROOT, 'platform', 'index.ts')).matchAll(/export\s*\{([^}]*)\}\s*from\s*'([^']+)'/g)) {
  m[1].split(',').map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => names.push({ name: n, from: m[2] }));
}
// not drawn by an application: an old name kept for one release, the providers the site gets from the page, data
// and the building blocks the components draw with, which their own documentation keeps out of application code:
// DataGridEngine ("Applications use the public DataGrid entry point"; it draws every DataGrid and Table on the site) and
// Portal (every dialog, menu, popover and toast on the site draws through it), and BranchStatus (#814: what Tree and
// TreeSelect draw inside a branch that loads; the site's trees draw it through them)
const NOT_REQUIRED = new Set(['DataTable', 'SurfaceContext', 'FieldLayoutContext', 'DirectionContext', 'ReadOnlyContext', 'ChartPatterns', 'VirtualProbe', 'VirtualGap', 'ChartFocusMark',
  'DataGridEngine', 'Portal', 'BranchStatus']);
// the hooks an application calls itself; the building hooks (useFloating, usePressable…) run inside the components
const APP_HOOKS = new Set(['useToast', 'useUndo', 'useHotkey', 'useSession', 'useTheme', 'useDensity', 'useScreenLocation', 'useViewState', 'useUnsavedGuard',
  'useClipboard', 'useSearchHistory', 'useCollectionView', 'useCommandBar', 'useAutosave', 'useUploadQueue', 'useAnalytics', 'useLocale', 'useRetry', 'usePrint',
  'useAppLayout', 'useSessionTimeout', 'useCommercePage', 'useHotkeyList']);
const required = names.filter((n) => !NOT_REQUIRED.has(n.name) && ((/^[A-Z]/.test(n.name) && !/^[A-Z0-9_]+$/.test(n.name)) || APP_HOOKS.has(n.name)));

// the site's sources: each screen file and the shared files
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.jsx?$/.test(e.name) && e.name !== 'app.js') files.push(p); } })(SITE);
const used = {};   // name -> [screen file]
for (const f of files) {
  const text = read(f);
  for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*'plenix-platform'/g)) {
    m[1].split(',').map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean).forEach((n) => {
      // imported and used: as an element (<Name), a member (Name.), a call (Name(), or passed on ({Name}, Name,)
      const body = text.replace(m[0], '');
      if (new RegExp('(<' + n + '[\\s/>.]|\\b' + n + '\\s*[.(]|[{,(\\[]\\s*' + n + '\\s*[,})\\]])').test(body)) (used[n] = used[n] || []).push(path.relative(SITE, f).replace(/\\/g, '/'));
    });
  }
}
const missing = required.filter((n) => !used[n.name]);

// the routes and the screens
const pages = site.pages();
const screens = fs.readdirSync(path.join(SITE, 'screens')).filter((f) => /\.jsx$/.test(f)).map((f) => f.replace(/\.jsx$/, ''));
const noFile = pages.filter((p) => screens.indexOf(p.screen) < 0).map((p) => p.screen);
const noRoute = screens.filter((s) => !pages.some((p) => p.screen === s));
const stubs = files.filter((f) => /^\/\* stub/.test(read(f))).map((f) => path.relative(SITE, f));

if (process.argv.includes('--list')) {
  required.forEach((n) => console.log(n.name.padEnd(28) + (used[n.name] ? used[n.name].join(', ') : '-- not used --')));
}
const bad = missing.length || noFile.length || noRoute.length || stubs.length;
// one result per Platform name and per site rule in the results file (TEST_RESULTS), so CI can quarantine one name (#1327)
const shared = require('./check.js');
required.forEach((n) => shared.record(n.name + ': used by the test site', !!used[n.name], 'not used by any test-site screen'));
shared.record('Routes: every route has a screen file', !noFile.length, noFile.join(', '));
shared.record('Screens: every screen file has a route', !noRoute.length, noRoute.join(', '));
shared.record('Screens: no unfinished screen', !stubs.length, stubs.join(', '));
if (missing.length) console.log('Not used by the test site (' + missing.length + ' of ' + required.length + '): ' + missing.map((n) => n.name).join(', '));
if (noFile.length) console.log('Routes without a screen file: ' + noFile.join(', '));
if (noRoute.length) console.log('Screen files without a route: ' + noRoute.join(', '));
if (stubs.length) console.log('Unfinished screens: ' + stubs.join(', '));
console.log((bad ? 'SITE_COVERAGE_FAIL ' : 'SITE_COVERAGE_OK ') + (required.length - missing.length) + '/' + required.length + ' Platform names used on ' + pages.length + ' pages');
process.exit(bad ? 1 : 0);
