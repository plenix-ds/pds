// Plenix tests · themes (platform/standards/themes.json): the ability to add a theme and switch to it.
// In a temporary copy of the token source it adds a sample theme (the default theme with two roles pointed at other
// palette colors), builds it, and checks: the theme's stylesheet and the theme list are generated; a theme that writes a
// color literal, or leaves out a role, is rejected; in a page, switching data-plx-theme changes the roles (light and dark)
// and PlenixWorkspace.setTheme is remembered for the next page. The repository itself is never changed.
//   node tests/theme.test.js            (TEST_PORT: another port)
//   TEST_SCOPE=full: always; by default (tests/changed.js) only when a global file (the tokens, the builders, the providers) or this test changed
const shared = require('./check.js');   // the shared check helper: parts (TEST_ONLY) and the results file (TEST_RESULTS)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { ROOT, serve, launch, sleep } = require('./lib.js');
const changed = require('./changed.js');
if (!changed.wants({ units: ['components/Button'] })) changed.none('THEME_OK 0/0');
changed.report('every check');
const PORT = +process.env.TEST_PORT || 8800;

const res = [], check = (n, ok, d) => { if (shared.check(n, ok, d)) res.push([n, ok, d]); };
const copyDir = (a, b) => { fs.mkdirSync(b, { recursive: true }); for (const e of fs.readdirSync(a, { withFileTypes: true })) { const s = path.join(a, e.name), t = path.join(b, e.name); if (e.isDirectory()) copyDir(s, t); else fs.copyFileSync(s, t); } };
// a temporary copy with the builders and the token source
function stage(name, edit) {
  const T = fs.mkdtempSync(path.join(os.tmpdir(), 'plx-theme-' + name + '-'));
  for (const d of ['platform/tokens', 'platform/standards', 'platform/system']) copyDir(path.join(ROOT, d), path.join(T, d));
  fs.mkdirSync(path.join(T, 'platform', 'providers'), { recursive: true });
  // the token build (slice 101): style-dictionary/build.mjs with its assembly and the value reader, and the packages it imports
  for (const f of ['build-standards.js', 'style-dictionary/build.mjs', 'packages/tokens/sd/assemble.cjs', 'tools/token-value.js']) { fs.mkdirSync(path.dirname(path.join(T, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(T, f)); }
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(T, 'node_modules'), 'dir');
  fs.copyFileSync(path.join(ROOT, 'platform', 'index.js'), path.join(T, 'platform', 'index.js'));
  edit(T);
  return T;
}
// the sample theme: the default theme's two token files, with the link role and the canvas pointed at other palette colors
function addSample(T, change, foundations) {
  const tok = path.join(T, 'platform', 'tokens');
  // its foundations: the default theme's, with the given changes (shape, weights…)
  const f = JSON.parse(fs.readFileSync(path.join(tok, 'theme-default.tokens.json'), 'utf8'));
  if (foundations) foundations(f);
  fs.writeFileSync(path.join(tok, 'theme-sample.tokens.json'), JSON.stringify(f, null, 2));
  for (const mode of ['light', 'dark']) {
    const j = JSON.parse(fs.readFileSync(path.join(tok, 'theme-default.' + mode + '.tokens.json'), 'utf8'));
    change(j, mode);
    fs.writeFileSync(path.join(tok, 'theme-sample.' + mode + '.tokens.json'), JSON.stringify(j, null, 2));
  }
  const std = JSON.parse(fs.readFileSync(path.join(T, 'platform', 'standards', 'themes.json'), 'utf8'));
  std.themes.sample = { label: 'Sample', description: 'A test theme.', foundations: 'theme-sample.tokens.json', light: 'theme-sample.light.tokens.json', dark: 'theme-sample.dark.tokens.json' };
  fs.writeFileSync(path.join(T, 'platform', 'standards', 'themes.json'), JSON.stringify(std, null, 2));
}
const tokens = (T) => require('child_process').execFileSync(process.execPath, [path.join(T, 'style-dictionary', 'build.mjs'), '--no-index'], { cwd: T, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const build = (T) => { tokens(T); require(path.join(T, 'build-standards.js'))(T); };
const fails = (T) => { try { tokens(T); return false; } catch (e) { return String(e.stderr || e.message); } };

(async () => {
  // 1. a good sample theme builds
  const good = stage('good', (T) => addSample(T, (j, mode) => {
    j['plx-sys']['content-link'].$value = mode === 'light' ? '{plx-ref.color-green-700}' : '{plx-ref.color-green-200}';
    j['plx-sys']['surface-canvas'].$value = mode === 'light' ? '{plx-ref.color-blue-50}' : '{plx-ref.color-gray-800}';
  }, (f) => {
    // its own foundations: a softer shape and a heavier semibold
    // (controls take shape-xs, 4px, since the buttons study: radius-control-4px; owner, 2026-10-24)
    f['plx-sys']['shape-xs'].$value = '{plx-ref.radius-xs}';
    f['plx-sys']['font-weight-semibold'].$value = '{plx-ref.font-weight-bold-700}';
  }));
  build(good);
  const css = fs.readFileSync(path.join(good, 'platform', 'system', 'themes', 'sample.css'), 'utf8');
  const index = fs.readFileSync(path.join(good, 'platform', 'system', 'themes', 'index.css'), 'utf8');
  const list = fs.readFileSync(path.join(good, 'platform', 'providers', 'themes.js'), 'utf8');
  check('a new theme gets its own stylesheet', /\[data-plx-theme="sample"\]/.test(css) && /--plx-sys-content-link: var\(--plx-ref-color-green-700\)/.test(css), css.slice(0, 200));
  check('the new theme is loaded after the default theme', /default\.css[\s\S]*sample\.css/.test(index), index);
  check('the apps are offered the new theme', /name: "sample"/.test(list) && /label: "Sample"/.test(list), '');

  // 2. the rules: no color literals; every role of the default theme
  const lit = stage('literal', (T) => addSample(T, (j) => { j['plx-sys']['content-link'].$value = '#ff0000'; }));
  const e1 = fails(lit);
  check('a theme that writes a color is rejected', !!e1 && /writes a color/.test(e1), e1);
  const miss = stage('missing', (T) => addSample(T, (j) => { delete j['plx-sys']['content-link']; }));
  const e2 = fails(miss);
  check('a theme that leaves out a role is rejected', !!e2 && /same roles/.test(e2), e2);
  const missF = stage('missingf', (T) => addSample(T, () => {}, (f) => { delete f['plx-sys']['shape-sm']; }));
  const e3 = fails(missF);
  check('a theme that leaves out a foundation is rejected', !!e3 && /same foundations/.test(e3), e3);

  // 3. in a page: switching changes the roles, in light and dark; the choice is remembered
  const shot = path.join(__dirname, '.theme-sample.css');
  fs.copyFileSync(path.join(good, 'platform', 'system', 'themes', 'sample.css'), shot);
  const page = path.join(__dirname, '.theme-test.html');
  fs.writeFileSync(page, '<!doctype html><html lang="en"><head><meta charset="utf-8"><script src="../platform/providers/theme-boot.js"></script>'
    + '<link rel="stylesheet" href="../platform/platform.css"><link rel="stylesheet" href=".theme-sample.css"></head><body><p>Theme</p><button class="plx-button plx-button--secondary" id="b"><span class="plx-button__label">Save</span></button></body></html>');
  const server = await serve(PORT);
  const browser = await launch();
  const p = await browser.newPage();
  const url = 'http://127.0.0.1:' + PORT + '/Plenix/tests/.theme-test.html';
  await p.goto(url, { waitUntil: 'networkidle0' }); await sleep(300);
  const read = () => p.evaluate(() => { const s = getComputedStyle(document.documentElement), b = getComputedStyle(document.getElementById('b')); return { theme: document.documentElement.getAttribute('data-plx-theme'), link: s.getPropertyValue('--plx-sys-content-link').trim(), canvas: s.getPropertyValue('--plx-sys-surface-canvas').trim(), radius: b.borderTopLeftRadius, weight: b.fontWeight }; });
  const d0 = await read();
  check('a page starts on the default theme', d0.theme === 'default', JSON.stringify(d0));
  await p.evaluate(() => window.PlenixWorkspace.setTheme('sample')); await sleep(100);
  const s1 = await read();
  check('switching to the new theme changes its roles', s1.theme === 'sample' && s1.link !== d0.link && s1.canvas !== d0.canvas, JSON.stringify([d0, s1]));
  check('and its foundations: a Button takes the theme shape and weight', d0.radius === '4px' && s1.radius === '2px' && d0.weight === '600' && s1.weight === '700', JSON.stringify([d0, s1]));
  await p.evaluate(() => document.documentElement.setAttribute('data-plx-mode', 'dark')); await sleep(100);
  const s2 = await read();
  check('the new theme has its own dark values', s2.link !== s1.link, JSON.stringify(s2));
  await p.goto(url, { waitUntil: 'networkidle0' }); await sleep(300);
  const s3 = await read();
  check('the chosen theme is remembered on the next page', s3.theme === 'sample', JSON.stringify(s3));
  await p.evaluate(() => window.PlenixWorkspace.clearTheme()); await sleep(100);
  const s4 = await read();
  check('clearing it goes back to the default theme', s4.theme === 'default' && s4.link === d0.link, JSON.stringify(s4));
  await browser.close(); server.close();
  for (const f of [shot, page]) fs.unlinkSync(f);
  for (const T of [good, lit, miss, missF]) fs.rmSync(T, { recursive: true, force: true });

  const bad = res.filter((r) => !r[1]);
  res.forEach(([n, ok, d]) => console.log((ok ? '  ok   ' : '  FAIL ') + n + (ok ? '' : ' · ' + String(d).slice(0, 200))));
  console.log((bad.length ? 'THEME_FAIL ' : 'THEME_OK ') + (res.length - bad.length) + '/' + res.length);
  process.exit(bad.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
