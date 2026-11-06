// Checks that both Plenix applications keep to the one Platform system: structure, markup, files and generated code.
//   node check-system.js        (or: npm run lint:system)
// Exits with 1 and lists every finding when a rule is broken, so it can run in CI next to the build.
// The style rules are not here (owner, style-plan-30: every style rule in exactly one place): Stylelint checks each
// stylesheet (.stylelintrc.json, tools/stylelint/plenix.mjs) and check-style.js holds the Plenix style rules Stylelint
// cannot check (tokens, hex, font sizes and other values in code, inline styles, defined tokens, cascade layers, selector
// kinds, text contracts, the token-source rules: no new colors, the 4px grid, corners 2 to 6px). Both checks read the same
// files (check-common.js).
//
//   built       (#692) the build outputs exist: they are not in git, npm ci builds them; without them the check stops
//               at once with "run npm ci first"
//   imports     every component and pattern stylesheet is imported by platform.css
//   lanes       (#692) a lane carries sources only: no design-system generated file (spec-parts.js, reviewed.js, …) under
//               lanes/<task>/design-system/; lanes/<task>/BASE (the spec commit the lane was built on) is accepted, and a
//               lane without it is warned about (not a finding)
//   legacy      the retired files stay gone (suite/, tokens/legacy.css, the asset app's plenix.css and demo.css, system/nesting.css)
//   embedded    the asset app has no embedded SVG and no data: URIs (icons are files)
//   generated   the token stylesheets and the standards' code (build-standards.js: providers/pageLayouts.js, system/layout-modes.css)
//               are exactly what is generated from their JSON (platform/tokens/*.tokens.json, platform/standards/*.json);
//               the token stylesheets are exactly what the token build (style-dictionary/build.mjs) writes from the token source (platform/tokens/*.tokens.json):
//               tokens are edited in the JSON, never in the CSS (batch 158); the library parts' bundles (spec-parts.js,
//               ds-sample-parts.css) and the library block of index.js and platform.css match their part files; the
//               compatibility icon file (platform/dist/plenix-icons-plenix.js, #553) matches the icon set; each page's
//               icon file (<app>/plenix-icons-<app>.js, dam/plenix-icons-dam.js, #557) matches its page's source
//   audit       every page loads platform/dev/style-audit.js, which rejects inline styles and style blocks at run time (an
//               application page through the page loader, platform/loader/loader.js, which loads it from the source copy)
//   page-layout an application never sets a page's layout mode (AppShell layout=, data-plx-layout): it says what the page is
//               (<AppShell page="settings">) and the design system's layout standard (providers/pageLayouts.js) decides
//   tables      every table is a DataGrid (the React renderer in the Plenix table style): no <table>, no table element made in code, no
//               PropertyList table variant: every table is a Table (static) or a DataGrid, both on the React renderer (batches
//               226, 229, 234). In stylesheets (no rule for the retired variant's class): Stylelint, selector-disallowed-list
//   icon-names  (check-system.rules/icon-names.js) every icon named in source (<Icon name=…>, icon=…, icon: …, plx-icon--…)
//               is in the Plenix set (platform/icons/map.json); an unknown name draws nothing
//   icon-imports (check-system.rules/icon-imports.js) a Platform component draws its icons from imported modules, never from a
//               name written as text (#280; three named exceptions, each with its reason)
//   token-sets  (check-system.rules/token-sets.js) the checks the token build made (#372 step 2): themes write no color literal
//               and define the same roles and foundations, a token is defined in one file only, glob sets and their file
//               names, print values without contrast values, no typography composite
//   token-tiers (check-system.rules/token-tiers.js, plan §7 check 6, docs/adr/0002) ref -> sys -> comp with no skipping: comp
//               refers to sys or its own component, sys to ref or sys, only ref holds literals; shrink-only baseline
//   token-names (check-system.rules/token-names.js, plan §7 check 7, docs/adr/0002) no unit, value or breakpoint number in a
//               token name; shrink-only baseline
//   token-types (check-system.rules/token-types.js, docs/adr/0002) every token has a $type (its own or its group's) or is
//               marked web only ($extensions["com.plenix"].webOnly, for a CSS value DTCG has no type for)
//   style-dictionary (#372 steps 5 to 10, slice 101) Style Dictionary writes every token's own value, and the stylesheets
//               written with its values equal the ones with the JSON's own, byte for byte: npm run tokens:sd:check
//               (style-dictionary/build.mjs --sets, --bytes)
//   site-styles (check-system.rules/site-styles.js) sites have no stylesheet, style block or style attribute of their own (#381): a tracked
//               .css file outside the exempt list fails, and so does a <style> block or style attribute in services/ or the St. John site
//   and the other modules of check-system.rules/ that are not style rules (check-common.js, STYLE_MODULES): composition,
//   links-not-buttons, semantic-html, settings-cards, table-geometry, use-of-color, copy
const fs = require('fs');
const path = require('path');
const { ROOT, DAM, SPEC_PAGE, STYLE_MODULES, collect, reporter } = require('./check-common.js');

// built: the build outputs are not in git (#692); a checkout gets them from npm ci (package.json's prepare script). Without
// them nothing else can be checked, so the check stops here and says so
{
  const need = ['platform/dist/platform.js', 'platform/system/tokens/semantic.css', 'platform/system/themes/default.css', 'platform/components/Icon/icon.css', 'dashboard/app.js', 'dam/app/assets.js'];
  const missing = need.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  if (missing.length) {
    console.log('The build outputs are missing (' + missing.join(', ') + '): run npm ci first (it builds them; or node build-app.js), then check again.');
    console.log('SYSTEM_FAIL (the build outputs are missing)');
    process.exit(1);
  }
}
const files = collect();
const { add, runModules, finish } = reporter();

for (const { file } of files) {
  if (!/\.(jsx|js|tsx|ts|html)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  const lineOf = (i) => text.slice(0, i).split('\n').length;
  // page-layout: an application says what a page is (<AppShell page="settings">); the layout standard picks the mode
  if (!/[\\/]platform[\\/]/.test(file) && !/(^|[\\/])(app|assets)\.js$/.test(file)) {
    for (const m of text.matchAll(/<AppShell\b[^>]*?\blayout\s*=|\bdata-plx-layout\s*=|['"]data-plx-layout['"]/g)) add('page-layout', file, lineOf(m.index), text.slice(m.index, m.index + 80).split('\n')[0]);
  }
  // tables: every table is a DataGrid (the React renderer in the Plenix table style, batch 226): no <table>, no table element made
  // in code, no retired Table component or its classes. The design system's builders draw a table and hand it to DS.table
  // at once (tests/pages.test.js fails any table left on a page); generated bundles are checked through their sources.
  // a name/value table is a DataGrid too: no PropertyList table variant anywhere, the design system included (batch 229)
  if (!/[\\/]dist[\\/]|(^|[\\/])(app|assets)\.js$/.test(file)) {
    for (const m of text.matchAll(/<PropertyList\b[^>]*\bvariant=["'{]+table|PropertyList,\s*\{\s*variant:\s*["']table|\bplx-property-list--table\b/g)) add('tables', file, lineOf(m.index), 'not a DataGrid: ' + text.slice(m.index, m.index + 60).split('\n')[0]);
  }
  if (!SPEC_PAGE.test(file) && !/[\\/]dist[\\/]|(^|[\\/])(app|assets)\.js$/.test(file)) {
    for (const m of text.matchAll(/<table[\s>]|createElement\(\s*['"]table['"]|\bel\(\s*['"]table['"]|\bh\(\s*['"]table['"]/g)) {
      add('tables', file, lineOf(m.index), 'not a DataGrid: ' + text.slice(m.index, m.index + 60).split('\n')[0]);
    }
  }
}

// the asset app: no embedded pictures
for (const { file } of files) {
  if (/[\\/]Plenix[\\/]dam[\\/]/.test(file)) {
    fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
      if (/data:(image|font|application)\//.test(line)) add('embedded', file, i + 1, 'data: URI in: ' + line);
      if (/<svg[\s>]/.test(line)) add('embedded', file, i + 1, 'embedded SVG in: ' + line);
    });
  }
}
// audit: every page loads the style audit (platform/dev/style-audit.js), which rejects at run time any style that does
// not come from the design system
for (const { file } of files) {
  if (!/\.html$/.test(file) || /[\/]platform[\/]dev[\/]/.test(file)) continue;
  if (!/platform\/dev\/style-audit\.js|\.\.\/dev\/style-audit\.js|platform\/loader\/loader\.js/.test(fs.readFileSync(file, 'utf8'))) add('audit', file, 0, 'the page does not load platform/dev/style-audit.js');
}
// imports: every component and pattern stylesheet is in platform.css
const platformCss = fs.readFileSync(path.join(ROOT, 'platform', 'platform.css'), 'utf8');
for (const kind of ['components', 'patterns']) {
  const dir = path.join(ROOT, 'platform', kind);
  for (const c of fs.readdirSync(dir)) for (const f of fs.readdirSync(path.join(dir, c))) {
    if (!/\.css$/.test(f)) continue;
    const want = kind + '/' + c + '/' + f;
    if (platformCss.indexOf('"' + want + '"') < 0) add('imports', path.join(dir, c, f), 0, want + ' is not imported by platform.css');
  }
}
// generated: the code made from the design system's standards matches its JSON source (platform/standards/*.json)
for (const f of require('./build-standards.js')(ROOT, { check: true }).stale) add('generated', path.join(ROOT, f), 0, f + ' differs from platform/standards: edit the standard (JSON) and run node build-app.js, never the generated file');
// generated: the token stylesheets match their JSON source. When the token source breaks a rule of the token sets, the
// build stops; the rule token-sets (check-system.rules/token-sets.js, #372 step 2) lists every finding, with the build's messages
let tokenBuild = { stale: [] };
{
  // the token build (style-dictionary/build.mjs, slice 101): --stale writes nothing and lists the stylesheets that differ
  const r = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'style-dictionary', 'build.mjs'), '--stale'], { cwd: ROOT, encoding: 'utf8' });
  const line = String(r.stdout || '').trim().split('\n').pop();
  try { tokenBuild = JSON.parse(line); } catch (e) { add('generated', path.join(ROOT, 'style-dictionary', 'build.mjs'), 0, 'the token build stopped (see the rule token-sets): ' + String(r.stderr || r.stdout || (r.error && r.error.message) || '').trim().split('\n').slice(-1)[0]); }
}
for (const f of tokenBuild.stale) add('generated', path.join(ROOT, f), 0, f + ' differs from platform/tokens: edit the .tokens.json, then build');
// style-dictionary: Style Dictionary writes every token's own value (--sets) and the stylesheets with its values are the
// ones with the JSON's own, byte for byte (--bytes): npm run tokens:sd:check
{
  const sd = require('child_process').spawnSync('npm', ['run', '--silent', 'tokens:sd:check'], { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });
  const where = path.join(ROOT, 'style-dictionary', 'build.mjs');
  if (sd.error || sd.status !== 0) {
    const found = String(sd.stdout || '').split('\n').filter((l) => /^ {4}\S/.test(l)).map((l) => l.trim());
    if (found.length) found.forEach((l) => add('style-dictionary', where, 0, 'Style Dictionary and the token JSON differ: ' + l));
    else add('style-dictionary', where, 0, 'npm run tokens:sd:check failed: ' + String((sd.error && sd.error.message) || sd.stderr || sd.stdout || '').trim().split('\n').slice(-3).join(' '));
  }
}
// generated: the compatibility icon file (every Plenix icon, #553) matches the icon set (platform/icons/map.json)
for (const f of require('./tools/icons/site-icons.js').buildCompat(ROOT, { check: true }).stale) add('generated', path.join(ROOT, f), 0, f + ' differs from platform/icons: run node build-app.js, never edit the generated file');
// generated: each page's icon file (#557) holds exactly the icons its source names
for (const f of require('./tools/icons/site-icons.js').buildPages(ROOT, { check: true }).stale) add('generated', path.join(ROOT, f), 0, f + ' differs from the icons its page\'s source names: run node build-app.js, never edit the generated file');
// generated: the library parts' bundles (build-spec-parts.js: spec-parts.js, ds-sample-parts.css) and the library block of
// index.js and platform.css (build-exports.js) match their parts (platform/design-system/parts/, platform/exports/)
for (const f of require('./build-spec-parts.js')(ROOT, { check: true }).stale) add('generated', path.join(ROOT, f), 0, f + ' differs from platform/design-system/parts: run node build-app.js');
for (const f of require('./build-exports.js')(ROOT, { check: true }).stale) add('generated', path.join(ROOT, f), 0, f + ': its library block differs from platform/exports: run node build-app.js');
// lanes: a lane carries sources only (#692). The design system's generated files (the parts' bundle, index and chunks among them) are built here and ignored in its
// repository, so a copy under lanes/<task>/design-system/ would overlay a stale build onto the submodule
const SPEC_GENERATED = ['spec-parts.js', 'spec-index.js', 'spec-chunks', 'ds-sample-parts.css', 'native-guidance.js', 'native-guidance-full.js', 'platforms-standard.js', 'styling-standard.js', 'reviewed.js', 'usage.js'];
// A lane's one-line lanes/<task>/BASE names the design-system commit it was built on (the carry merges with it): it is
// accepted, and a lane without one gets a warning (printed, not a finding)
if (fs.existsSync(path.join(ROOT, 'lanes'))) for (const lane of fs.readdirSync(path.join(ROOT, 'lanes'))) {
  if (!fs.statSync(path.join(ROOT, 'lanes', lane)).isDirectory()) continue;
  for (const f of SPEC_GENERATED) {
    const p = path.join(ROOT, 'lanes', lane, 'design-system', f);
    if (fs.existsSync(p)) add('lanes', p, 0, 'lanes carry sources only: ' + f + ' is generated by the build (delete it from the lane)');
  }
  if (!fs.existsSync(path.join(ROOT, 'lanes', lane, 'BASE'))) console.log('warning (lanes): lanes/' + lane + '/BASE is missing: add it with the design-system commit the lane was built on');
}
// legacy files stay gone
for (const f of [path.join(ROOT, 'build-tokens.js'), path.join(ROOT, 'tools', 'agent', 'sd-reference-compare.js'), path.join(ROOT, 'shared'), path.join(ROOT, 'platform', 'system', 'tokens', 'legacy.css'), path.join(DAM, 'plenix.css'), path.join(DAM, 'demo.css'), path.join(ROOT, 'platform', 'system', 'nesting.css')]) {
  if (fs.existsSync(f)) add('legacy', f, 0, 'retired file or folder is back');
}

// rules kept as their own modules (check-system.rules/<name>.js: { check({ files, add }) }; the library waves, batch 347),
// except the style rules (check-common.js, STYLE_MODULES), which check-style.js runs
runModules(files, (name) => !STYLE_MODULES.includes(name));

finish('SYSTEM_OK', 'SYSTEM_FAIL', files.length);
