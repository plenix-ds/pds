// Builds Plenix: the icon stylesheet, the Platform bundle and every application's page script. One command:
//   node build-app.js        (or: npm run build:app)
//
//   Icons          platform/icons/                 → platform/components/Icon/icon.css   (build-icons.js)
//                                                  → platform/dist/icons/plenix/<name>.svg|.js, index.json (the asset layout, #279)
//                                                  → platform/dist/plenix-icons-plenix.js (the compatibility file: every Plenix icon, #553)
//                                                  → platform/dist/plenix-icons-plenix.esm.js (the same set as an ES module, #1209)
//                                                  → <app>/plenix-icons-<app>.js, dam/plenix-icons-dam.js (each page's icons, #557)
//   Platform       platform/index.ts               → platform/dist/platform.js       publishes its exports on window.Plenix
//                                                    (Vite, vite.platform.config.mjs; its hidden source map → build/vite/platform.js.map)
//   Applications   <folder>/main.jsx               → <folder>/app.js                  one per suite application (dashboard,
//                  projects, messages, contacts, calendar, tasks, notes, bookmarks, files, settings); they share suite/
//   Asset Manager  dam/app/assets.jsx              → dam/app/assets.js
//                    (Vite, vite.apps.config.mjs: one iife per application, run once per target)
//   Library parts  platform/exports/*, design-system/parts/* → index.js / platform.css blocks, spec-parts.js (build-exports.js, build-spec-parts.js)
//
// Order: the pre-steps below (library block, tokens, icons, brand, standards, steps, ...), then Vite for the Platform
// (#709, step 2), then Vite for the applications and the Asset Manager (steps 3 and 4).
// Source files use import/export. Each bundle is one plain script (an iife), so pages need no in-browser compiler and
// the dashboard still opens straight from disk (file://); browser-native modules would not.
// Imports resolve to: relative files (.js, .jsx), "react" and "react-dom"/"react-dom/client" (the React already
// loaded from platform/vendor/), and "plenix-platform" (window.Plenix, for the applications only).
// Nothing needs the network. The build fails, and writes nothing, if a file does not compile, an import does not
// resolve, a public export is missing or undefined, or an output would land outside the list below.
const fs = require('fs');
const path = require('path');
const buildIcons = require('./build-icons.js');
// the token build: Style Dictionary writes the values, packages/tokens/sd/assemble.cjs the stylesheets (slice 101, #372 step 10)
const tokenBuild = () => JSON.parse(require('child_process').execFileSync(process.execPath, [path.join(ROOT, 'style-dictionary', 'build.mjs'), '--no-index', '--json'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim().split('\n').pop());
const assemble = require('./packages/tokens/sd/assemble.cjs');

const ROOT = __dirname;
const DAM = path.join(ROOT, 'dam');
// the suite's applications: one folder each, beside platform/ (batch 149)
const SUITE = ['dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings'];
// the library parts first (library plan, wave 0): the lanes' exports and stylesheets into the generated block of index.js and
// platform.css (build-exports.js), and their records, labs and docs into the design system's spec-parts.js (build-spec-parts.js)
const EXPORTS = require('./build-exports.js')(ROOT);
console.log('Built the library block of platform/index.ts and platform.css (' + EXPORTS.exports + ' exports, ' + EXPORTS.stylesheets + ' stylesheets' + (EXPORTS.stale.length ? '' : ', unchanged') + ')');
const PARTS = require('./build-spec-parts.js')(ROOT);
if (!PARTS.skipped) console.log('Built platform/design-system/spec-parts.js and ds-sample-parts.css (' + PARTS.parts + ' part files' + (PARTS.changed ? '' : ', unchanged') + ')');
// the token stylesheets first (platform/tokens/*.tokens.json -> system/tokens/*.css, themes/plenix.css; batch 158)
// the stylesheets only: the token index reads every Platform stylesheet, so it comes after the steps that write the others
const TOKENS = tokenBuild();
console.log('Built ' + TOKENS.files.length + ' token stylesheets from platform/tokens (' + TOKENS.count + ' tokens' + (TOKENS.stale.length ? ', ' + TOKENS.stale.length + ' changed' : '') + ')');
// then the icon stylesheet (platform/icons/ -> components/Icon/icon.css): the bundles below do not read it, the pages do
const ICONS = buildIcons(ROOT);
// then the brand (platform/brand/ -> components/Brand/brand.css and brand/favicon.svg; batch 278)
const BRAND = require('./build-brand.js')(ROOT);
console.log('Built platform/components/Brand/brand.css and platform/brand/favicon.svg' + (BRAND.changed ? '' : ' (unchanged)'));
// then the design system's standards (platform/standards/*.json) -> the code the apps run (build-standards.js)
const STANDARDS = require('./build-standards.js')(ROOT);
console.log('Built ' + STANDARDS.files.join(', ') + ' from platform/standards (' + STANDARDS.pages + ' kinds of page' + (STANDARDS.stale.length ? ', ' + STANDARDS.stale.length + ' changed' : '') + ')');
console.log('Built platform/components/Icon/icon.css (' + ICONS.names + ' icon names, ' + ICONS.symbols + ' symbols, ' + Math.round(ICONS.bytes / 1024) + ' KB)');
// the compatibility file (#553): every Plenix icon registered with registerIcons, for a site that loads plenix.js and no icon file of its own
const COMPAT = require('./tools/icons/site-icons.js').buildCompat(ROOT);
console.log('Built ' + COMPAT.file + ' (' + COMPAT.icons + ' icons, ' + Math.round(COMPAT.bytes / 1024) + ' KB' + (COMPAT.changed ? '' : ', unchanged') + ')');
// its ES module form (ADR 0052, #1209): the same set, imported where the icons are drawn; the release copies it to esm/icons/plenix.js
const COMPAT_ESM = require('./tools/icons/site-icons.js').buildCompatModule(ROOT);
console.log('Built ' + COMPAT_ESM.file + ' (' + COMPAT_ESM.icons + ' icons, ' + Math.round(COMPAT_ESM.bytes / 1024) + ' KB' + (COMPAT_ESM.changed ? '' : ', unchanged') + ')');
// each page's own icon file (#557): <app>/plenix-icons-<app>.js and dam/plenix-icons-dam.js, exactly the icons its source names
const PAGE_ICONS = require('./tools/icons/site-icons.js').buildPages(ROOT);
console.log('Built ' + PAGE_ICONS.pages + ' page icon files (' + PAGE_ICONS.icons + ' icons' + (PAGE_ICONS.changed ? ', ' + PAGE_ICONS.stale.length + ' changed' : ', unchanged') + '; ' + PAGE_ICONS.unknown.length + ' names that are not icons, such as the suite\'s capability keys)');
// then the step rules (build-steps.js -> system/steps.css): values from the data arrive as attributes (batch 267)
const STEPS = require('./build-steps.js')(ROOT);
// then the token index (tools/token-index.js), now that every stylesheet exists, and the native files from it; the steps
// below read the index (build-native-guidance.js). A fresh checkout gets the same index as a rebuilt one (#692)
const MOB = assemble.indexAndMobile(ROOT);
// the Platforms Standard (platform/standards/platforms.md) as the design system's data (batch 297)
const PLAT = require('./build-platforms.js')(ROOT);
// Plenix's own guidance for the Apple HIG pages, mapped to Web and Android (platform/standards/native-guidance.json, batch 330)
const NG = require('./build-native-guidance.js')(ROOT);
console.log('Built platform/design-system/native-guidance.js (' + NG.pages + ' pages, ' + NG.rules + ' rules' + (NG.changed ? '' : ', unchanged') + ')');
// each Web item's Last reviewed date, from the design system's history (STANDARD.md §7)
const RV = require('./build-reviewed.js')(ROOT);
console.log('Built platform/design-system/reviewed.js (' + RV.count + ' items dated' + (RV.changed ? '' : ', unchanged') + ')');
// the native token outputs (Swift, Kotlin, Dart; Platforms Standard 7.2), written above with the token index
console.log('Built platform/mobile (' + MOB.files.length + ' files, ' + MOB.colors + ' colors' + (MOB.changed ? '' : ', unchanged') + ')');
console.log('Built platform/design-system/platforms-standard.js (' + PLAT.sections + ' sections, ' + PLAT.tables + ' tables' + (PLAT.changed ? '' : ', unchanged') + ')');
console.log('Built platform/system/steps.css (' + STEPS.rules + ' rules' + (STEPS.changed ? '' : ', unchanged') + ')');
// the only files this build may write (the Platform's source map goes to the ignored build/vite/, never beside a committed file)
const PLATFORM_OUT = path.join(ROOT, 'platform', 'dist', 'platform.js');
const PLATFORM_MAP = path.join(ROOT, 'build', 'vite', 'platform.js.map');
const ALLOWED_OUTPUTS = [
  PLATFORM_OUT,
  PLATFORM_MAP,
  path.join(DAM, 'app', 'assets.js'),
].concat(SUITE.map((f) => path.join(ROOT, f, 'app.js')));

class BuildError extends Error {}
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

// the Platform (#709, step 2): Vite with vite.platform.config.mjs, in memory (write: false). The config adds the banner and
// the frozen window.Plenix and checks the public API (a missing, duplicate or extra name fails the build).
async function buildPlatform() {
  const { build } = await import('vite');
  let out;
  try { out = await build({ configFile: path.join(ROOT, 'vite.platform.config.mjs'), build: { write: false } }); }
  catch (e) { throw new BuildError('Platform (Vite): ' + e.message); }
  const output = (Array.isArray(out) ? out[0] : out).output;
  const chunk = output.find((o) => o.type === 'chunk' && o.fileName === 'platform.js');
  const map = output.find((o) => o.type === 'asset' && o.fileName === 'platform.js.map');
  if (!chunk || !map || !chunk.publicApi) throw new BuildError('Platform (Vite): no platform.js, source map or public-API check in the output');
  return [
    { t: { out: PLATFORM_OUT }, b: { text: chunk.code, count: chunk.moduleIds.length, api: chunk.publicApi } },
    { t: { out: PLATFORM_MAP }, b: { text: String(map.source), quiet: true } },
  ];
}

// the applications and the Asset Manager (#709, steps 3 and 4): Vite with vite.apps.config.mjs, one iife per run, in memory
async function buildApps() {
  const { build } = await import('vite');
  const { TARGETS, SUITE: APPS, appConfig } = await import('./vite.apps.config.mjs');
  if (APPS.join() !== SUITE.join()) throw new BuildError('vite.apps.config.mjs and build-app.js list different applications');
  const results = [];
  for (const t of TARGETS) {
    const outFile = path.join(ROOT, t.out);
    if (ALLOWED_OUTPUTS.indexOf(outFile) < 0) throw new BuildError(`${t.name}: output ${t.out} is not an allowed build output`);
    let out;
    try { out = await build({ configFile: false, ...appConfig(t.id, { write: false }) }); }
    catch (e) { throw new BuildError(t.name + ' (Vite): ' + e.message); }
    const output = (Array.isArray(out) ? out[0] : out).output;
    const chunks = output.filter((o) => o.type === 'chunk');
    if (chunks.length !== 1 || output.length !== 1) throw new BuildError(t.name + ' (Vite): expected one script, got ' + output.map((o) => o.fileName).join(', '));
    results.push({ t: { out: outFile }, b: { text: chunks[0].code, count: chunks[0].moduleIds.length } });
  }
  return results;
}

(async () => {
  const results = (await buildPlatform()).concat(await buildApps());
  // everything compiled and checked: only now write, each through a temporary file
  for (const { t, b } of results) {
    fs.mkdirSync(path.dirname(t.out), { recursive: true });
    const tmp = t.out + '.tmp';
    fs.writeFileSync(tmp, b.text);
    fs.renameSync(tmp, t.out);
    if (!b.quiet) console.log(`Built ${rel(t.out)} (${(b.text.length / 1024).toFixed(0)} KB, ${b.count} module${b.count === 1 ? '' : 's'})${b.api ? ' · window.Plenix: ' + b.api.join(', ') : ''}`);
  }
})().catch((e) => {
  console.error('BUILD FAILED — nothing was written.\n' + (e instanceof BuildError ? e.message : e.stack));
  process.exit(1);
});
