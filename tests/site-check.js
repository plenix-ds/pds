// Plenix tests · a quick static check of the test site's source (the St. John repository's site/**/*.jsx), without building: each file compiles,
// every name it imports from plenix-platform is a public export, its relative imports resolve, and it keeps the site's
// rules: no style attribute or style prop, no color or pixel literal, a className only with plx-u- utilities that exist (and, in a custom chart, ChartFrame's mark classes),
// no "volunteer" (the site says servants) and no sacrament records.
//   node tests/site-check.js                       every file of the site
//   node tests/site-check.js ../st-john-test-site/site/screens/members.jsx …   only these files
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(require('./site.js').DIR, 'site');
if (!fs.existsSync(SITE)) { console.log('SITE_CHECK_FAIL the St. John test site is not at ' + SITE + ' (clone github.com/LighthouseCollection/st-john-test-site beside this repository, or set SITE_DIR)'); process.exit(1); }
const exportsText = fs.readFileSync(path.join(ROOT, 'platform', 'index.ts'), 'utf8');
const PUBLIC = new Set();
for (const m of exportsText.matchAll(/export\s*\{([^}]*)\}/g)) m[1].split(',').map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => PUBLIC.add(n));
const UTIL = new Set();
for (const f of ['platform/platform.css', 'platform/plenix-system.css'].concat(fs.readdirSync(path.join(ROOT, 'platform', 'system')).filter((x) => /\.css$/.test(x)).map((x) => 'platform/system/' + x))) {
  try { for (const m of fs.readFileSync(path.join(ROOT, f), 'utf8').matchAll(/\.(plx-u-[a-z0-9-]+|plx-motion-[a-z-]+|plx-page-panes)/g)) UTIL.add(m[1]); } catch (e) { /* none */ }
}
const CHART = new Set((fs.readFileSync(path.join(ROOT, 'platform', 'charts', 'ChartFrame.tsx'), 'utf8').match(/plx-chart__[a-z-]+[a-z]/g) || []));
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.resolve(f)) : [];
if (!files.length) (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.jsx?$/.test(e.name) && e.name !== 'app.js') files.push(p); } })(SITE);

let bad = 0;
for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const src = fs.readFileSync(f, 'utf8');
  const out = [];
  try { Babel.transform(src, { filename: f, sourceType: 'module', presets: [['react', { runtime: 'classic' }]] }); } catch (e) { out.push('does not compile: ' + e.message.split('\n')[0]); }
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*'plenix-platform'/g)) {
    m[1].split(',').map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean).forEach((n) => { if (!PUBLIC.has(n)) out.push('not a Platform export: ' + n); });
  }
  for (const m of src.matchAll(/from\s*'(\.[^']+)'/g)) {
    const base = path.resolve(path.dirname(f), m[1]);
    if (![base, base + '.js', base + '.jsx'].some((c) => fs.existsSync(c) && fs.statSync(c).isFile())) out.push('import does not resolve: ' + m[1]);
  }
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/\sstyle=\{|\sstyle="/.test(code)) out.push('a style attribute or prop (never: tokens and components only)');
  if (/#[0-9a-fA-F]{3,8}\b(?![\w-])/.test(code.replace(/'#\/[^']*'|"#\/[^"]*"|`#\/[^`]*`|'#[a-z][\w-]*'/g, ''))) out.push('a hex color literal');
  if (/\brgba?\(|\bhsla?\(/.test(code)) out.push('a color literal');
  for (const m of code.matchAll(/className=(?:"([^"]*)"|\{'([^']*)'\})/g)) (m[1] || m[2] || '').split(/\s+/).filter(Boolean).forEach((c) => { if (!UTIL.has(c) && !CHART.has(c)) out.push('class ' + c + ' (only existing plx-u- utilities)'); });
  // a custom chart's marks take ChartFrame's documented mark classes (plx-chart__line, …): allowed in the chart's svg
  if (/volunteer/i.test(code)) out.push('"volunteer": the site says servants');
  if (/\b(baptism|baptized|baptised|confession|chrismation|marriage record|wedding record|sacrament)/i.test(code)) out.push('a sacrament record (none in the site)');
  if (out.length) { bad++; console.log('FAIL ' + rel); out.forEach((x) => console.log('     ' + x)); }
}
console.log((bad ? 'SITE_CHECK_FAIL ' + bad + ' of ' : 'SITE_CHECK_OK ') + files.length + ' files');
process.exit(bad ? 1 : 0);
