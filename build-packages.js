// Builds a Plenix release from the Platform sources: the four packages, the versioned CDN files and the JSON API.
//   node build-packages.js            (run node build-app.js first; npm run release:build does both)
//
//   packages/tokens   @plenix-ds/tokens   the token JSON (source), the token CSS, a JS module with every token
//   packages/icons    @plenix-ds/icons    the SVG icons, their list (icons.json) and the icon stylesheet
//   packages/styles   @plenix-ds/styles   plenix.css: the whole Platform stylesheet in one file, plus fonts.css and theme-boot.js
//   packages/react    @plenix-ds/react    the components and patterns: ES module, CommonJS, and the browser global (window.Plenix)
//   release/cdn/<v>/  the same files at a fixed address per version (design-system.lighthouseway.org/cdn/<v>/)
//   release/api/v1/   read-only JSON: tokens, components, taxonomy, guidance, icons (design-system.lighthouseway.org/api/v1/)
//   build-packages.d/ one step per further package (<name>.js, run in name order; the library's package lanes add files here)
//
// The version is "version" in package.json; every package gets the same one. Everything here is generated: edit the
// Platform (platform/), never packages/ or release/. The API needs the design system (platform/design-system, a
// submodule); without it the packages and the CDN still build and the API is skipped.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const esbuild = require('esbuild');

const ROOT = __dirname;
const P = path.join(ROOT, 'platform');
const VERSION = require('./package.json').version;
const SCOPE = '@plenix-ds';
const SITE = 'https://design-system.lighthouseway.org';
const REPO = 'https://github.com/plenix-ds/plenix-platform';
const PKG = path.join(ROOT, 'packages');
const REL = path.join(ROOT, 'release');
const CDN = path.join(REL, 'cdn', VERSION);
const API = path.join(REL, 'api', 'v1');

if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(VERSION || '')) throw new Error('package.json needs a version like 0.1.0');
for (const f of ['dist/platform.js', 'system/tokens/reference.css', 'components/Icon/icon.css', 'tokens/tokens.index.json']) {
  if (!fs.existsSync(path.join(P, f))) throw new Error('platform/' + f + ' is missing: run node build-app.js first');
}

const rm = (d) => fs.rmSync(d, { recursive: true, force: true });
const mk = (d) => fs.mkdirSync(d, { recursive: true });
const write = (f, s) => { mk(path.dirname(f)); fs.writeFileSync(f, s); };
const json = (f, o) => write(f, JSON.stringify(o, null, 2) + '\n');
const copy = (from, to) => { mk(path.dirname(to)); fs.copyFileSync(from, to); };
// folders are copied whole (the Android outputs hold res/values, batch 341)
const copyDir = (from, to, keep = () => true) => { for (const n of fs.readdirSync(from)) if (keep(n)) { const p = path.join(from, n); if (fs.statSync(p).isDirectory()) copyDir(p, path.join(to, n)); else copy(p, path.join(to, n)); } };

rm(PKG); rm(REL);

// package.json shared by all four: GitHub Packages (private), linked to the Platform repository
const manifest = (name, description, extra) => Object.assign({
  name: SCOPE + '/' + name, version: VERSION, description,
  license: 'UNLICENSED', homepage: SITE + '/',
  repository: { type: 'git', url: 'git+' + REPO + '.git', directory: 'packages/' + name },
  publishConfig: { registry: 'https://npm.pkg.github.com', access: 'restricted' },
  sideEffects: ['*.css'],
}, extra);
const readme = (name, body) => write(path.join(PKG, name, 'README.md'),
  '# ' + SCOPE + '/' + name + '\n\n' + body.trim() + '\n\nPart of the Plenix design system, version ' + VERSION + '. Documentation: ' + SITE + '/\n');

// CDN documentation helpers: pure header/changelog parsing is also exercised by tests/cdn-devx.test.js.
function cdnChangelog(text) {
  const versions = []; let release = null, section = '', current = '';
  const flush = () => { if (release && current) release.breaking.push(current.trim()); current = ''; };
  for (const line of text.replace(/\r\n?/g, '\n').split('\n')) {
    const heading = /^##\s+\[?(\d+\.\d+\.\d+(?:-[\w.]+)?)\]?(?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/.exec(line);
    if (/^##\s/.test(line)) { flush(); section = ''; release = heading ? { version: heading[1], date: heading[2] || null, breaking: [] } : null; if (release) versions.push(release); continue; }
    if (/^###\s/.test(line)) { flush(); section = /^###\s+(Changed|Removed)\s*$/i.test(line) ? 'breaking' : ''; continue; }
    if (!release || !section) continue;
    const bullet = /^\s*[-*]\s+(.*)/.exec(line);
    if (bullet) { flush(); current = bullet[1]; }
    else if (line.trim()) current += (current ? ' ' : '') + line.trim();
    else flush();
  }
  flush(); return versions;
}
function cdnHeader(source) {
  const comment = (/^\s*\/\*([\s\S]*?)\*\//.exec(source.replace(/\r\n?/g, '\n')) || [])[1] || '';
  const out = { summary: '', usage: '', props: [] }; let section = '';
  for (const line of comment.split('\n')) {
    const heading = /^\s{3}(Summary|Usage|Props|Behavior|Notes):\s?(.*)$/.exec(line);
    const indent = heading ? 5 : (/^\s*/.exec(line) || [''])[0].length;
    if (heading) section = heading[1].toLowerCase();
    const text = heading ? heading[2] : line.replace(/^\s{5}/, '');
    if (section === 'summary' && text.trim()) out.summary += (out.summary ? ' ' : '') + text.trim();
    if (section === 'usage') out.usage += (out.usage ? '\n' : '') + text;
    if (section === 'props' && text.trim()) {
      const prop = indent <= 5 && /^(\S+?(?:\([^)]*\))?):\s(.*)$/.exec(text.trim());
      if (prop) out.props.push([prop[1], prop[2]]); else if (out.props.length) out.props[out.props.length - 1][1] += ' ' + text.trim();
    }
  }
  out.usage = out.usage.trim(); return out;
}
function cdnCode(value, language = '') {
  const fence = '`'.repeat(Math.max(3, ...[...String(value).matchAll(/`+/g)].map((m) => m[0].length + 1)));
  return fence + language + '\n' + value + '\n' + fence;
}
function cdnRecordDoc(record, written, source) {
  const head = cdnHeader(source), lines = ['# ' + (record.title || record.leaf || record.id), '', 'Version: ' + VERSION, '', '## Purpose', '', record.purpose || written.purpose || record.text || head.summary || record.leaf, '', '## Usage', ''];
  if (head.usage) lines.push(cdnCode(head.usage, 'jsx'));
  else if (record.use && record.use.length) lines.push(...record.use.map((s) => '- ' + s));
  else lines.push('This record describes a design-system standard; use its source guidance and examples below.');
  lines.push('', '## Props', '');
  if (head.props.length) for (const [name, description] of head.props) lines.push('- **' + name.replace(/\*/g, '\\*') + '**: ' + description);
  else lines.push('No structured props are declared in this source header.');
  lines.push('', '## Examples', '');
  if (head.usage) lines.push(cdnCode(head.usage, 'jsx'), '');
  for (const group of record.examples || []) {
    if (!Array.isArray(group)) continue;
    lines.push('### ' + group[0], '');
    if (Array.isArray(group[1])) for (const example of group[1]) {
      if (!Array.isArray(example)) continue;
      lines.push('- ' + example[0]);
      if (typeof example[3] === 'string' && example[3]) lines.push('', cdnCode(example[3], 'jsx'), '');
    }
  }
  lines.push('[Live examples](' + SITE + '/#/' + record.sec + '/' + record.id + ')');
  if (record.src) lines.push('', 'Source: platform/' + record.src);
  return lines.join('\n').trim() + '\n';
}
// End CDN documentation helpers.


// ---------- tokens ----------
const T = path.join(PKG, 'tokens');
const index = JSON.parse(fs.readFileSync(path.join(P, 'tokens', 'tokens.index.json'), 'utf8'));
copyDir(path.join(P, 'tokens'), path.join(T, 'json'), (n) => n.endsWith('.tokens.json') || ['components', 'semantic', 'reference'].includes(n));   // with the per-component sets (components/<name>.tokens.json)
copyDir(path.join(P, 'system', 'tokens'), path.join(T, 'css'));
copy(path.join(P, 'system', 'themes', 'default.css'), path.join(T, 'css', 'theme-default.css'));   // the default theme (renamed in batch 219)
// the module: every token with its tier, type and value per selector (theme, density, interaction)
const tokens = index.tokens.map((t) => ({ name: t.name, tier: t.tier, type: t.type, description: t.description || '',
  values: t.sets.map((s) => ({ selector: s.selector, value: s.value, file: s.file })), refs: t.refs || [],
  ...(t.platforms ? { platforms: t.platforms } : {}) }));   // its iOS and Android values (Platforms Standard 7.1)
const platformOnly = index.platformOnly || [];
json(path.join(T, 'tokens.json'), { version: VERSION, count: tokens.length, tokens, platformOnly });
write(path.join(T, 'index.js'), '/* ' + SCOPE + '/tokens ' + VERSION + ' (generated) */\nexport const version = ' + JSON.stringify(VERSION) + ';\nexport const tokens = ' + JSON.stringify(tokens) + ';\n' +
  'const byName = new Map(tokens.map((t) => [t.name, t]));\n/** The token record by its CSS name, e.g. "--plx-sys-surface-canvas". */\nexport function token(name) { return byName.get(name); }\n' +
  '/** Its value for one selector (":root" when left out). */\nexport function value(name, selector = ":root") { const t = byName.get(name); const s = t && (t.values.find((v) => v.selector === selector) || t.values[0]); return s ? s.value : undefined; }\n' +
  '/** The CSS reference for use in styles: var(--plx-…). */\nexport function cssVar(name) { return "var(" + name + ")"; }\n');
write(path.join(T, 'index.d.ts'), 'export interface TokenValue { selector: string; value: string; file: string }\nexport interface Token { name: string; tier: "plx-ref" | "plx-sys" | "plx-comp"; type: string; description: string; values: TokenValue[]; refs: string[] }\nexport declare const version: string;\nexport declare const tokens: Token[];\nexport declare function token(name: string): Token | undefined;\nexport declare function value(name: string, selector?: string): string | undefined;\nexport declare function cssVar(name: string): string;\n');
write(path.join(T, 'css', 'all.css'), ['reference.css', 'semantic.css', 'components.css', 'theme-default.css'].map((f) => '@import url("' + f + '");').join('\n') + '\n');
// tokens.css (RedSave P-49, #158): the four token files in one, without @import, every :root rule also on :host, so a
// shadow root or a page Plenix does not own can adopt it (plenixTokens() in the Platform loads it)
{
  const hostOf = (sel) => {   // ':root…' -> ':host(…)' when the rest is one compound selector, else nothing
    const s = sel.trim(); if (!s.startsWith(':root')) return null;
    const rest = s.slice(5); if (!rest) return ':host';
    let depth = 0; for (const ch of rest) { if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--; else if (depth === 0 && /[\s>+~]/.test(ch)) return null; }
    return ':host(' + rest + ')';
  };
  const split = (list) => { const out = []; let depth = 0, cur = ''; for (const ch of list) { if (ch === '(' || ch === '[') depth++; if (ch === ')' || ch === ']') depth--; if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
  const css = ['reference.css', 'semantic.css', 'components.css', 'theme-default.css'].map((f) => fs.readFileSync(path.join(T, 'css', f), 'utf8')).join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[{};])(\s*)([^{};@][^{};]*?)\{/g, (m, lead, space, prelude) => {
      const sels = split(prelude), hosts = sels.map(hostOf).filter(Boolean);
      return lead + space + (hosts.length ? sels.map((x) => x.trim()).concat(hosts).join(',') : prelude.trim()) + '{';
    })
    .replace(/\n\s*\n+/g, '\n');
  write(path.join(T, 'css', 'tokens.css'), '/* Plenix ' + VERSION + ' · tokens.css: every --plx-* token, light and dark, on :root and :host; no @import (adoptable: plenixTokens()). In layer plx.tokens, with the order declared as plenix.css does (#249), so loaded with plenix.css its values do not beat the layered themes and density. Generated. */\n'
    + '@layer ' + JSON.parse(fs.readFileSync(path.join(P, 'system', 'layers.json'), 'utf8')).order.map((n) => 'plx.' + n).join(', ') + ';\n@layer plx.tokens {\n' + css.trim() + '\n}\n');
}
json(path.join(T, 'package.json'), manifest('tokens', 'Plenix design tokens: the source JSON, CSS custom properties (--plx-…) and a JS module.', {
  type: 'module', main: 'index.js', types: 'index.d.ts',
  exports: { '.': { types: './index.d.ts', default: './index.js' }, './tokens.json': './tokens.json', './css/*': './css/*', './json/*': './json/*', './package.json': './package.json' },
}));
readme('tokens', `
The ${tokens.length} Plenix tokens in three tiers: \`plx-ref\` (reference palette and scales), \`plx-sys\` (semantic roles) and \`plx-comp\` (component values).

- \`json/*.tokens.json\`: the source, the files the Platform is edited in.
- \`css/all.css\`: every token as a CSS custom property, with the default theme. \`css/reference.css\`, \`semantic.css\`, \`components.css\` and \`theme-default.css\` load each tier on its own.
- \`index.js\` exports \`tokens\`, \`token(name)\`, \`value(name, selector)\` and \`cssVar(name)\`.

Use the semantic (\`--plx-sys-…\`) and component (\`--plx-comp-…\`) tokens in products, never the reference palette directly.`);

// ---------- icons ----------
const I = path.join(PKG, 'icons');
const svgs = fs.readdirSync(path.join(P, 'icons')).filter((n) => n.endsWith('.svg'));
copyDir(path.join(P, 'icons'), path.join(I, 'svg'), (n) => n.endsWith('.svg'));
copy(path.join(P, 'components', 'Icon', 'icon.css'), path.join(I, 'icon.css'));
const iconNames = [...new Set(svgs.map((n) => n.replace(/\.svg$/, '').replace(/-24$|-fill$|-24-fill$/, '').replace(/-24$/, '')))].sort();
const icons = iconNames.map((n) => ({ name: n, files: svgs.filter((f) => f === n + '.svg' || f.startsWith(n + '-')) }));
// the Plenix set as importable modules (#282): the stage 1 layout build-app.js writes (platform/dist/icons/plenix: per name
// <name>.js and its four SVG files, and index.json), so an app installed from npm imports exactly the icons it uses
const PLENIX_ICONS = path.join(P, 'dist', 'icons', 'plenix');
if (!fs.existsSync(path.join(PLENIX_ICONS, 'index.json'))) throw new Error('platform/dist/icons/plenix is missing: run node build-app.js first');
copyDir(PLENIX_ICONS, path.join(I, 'plenix'));
const plenixModules = fs.readdirSync(PLENIX_ICONS).filter((n) => n.endsWith('.js')).map((n) => n.replace(/\.js$/, '')).sort();
// the icons with their own drawings (four SVG files each); the rest are aliases, modules that import their icon
const plenixIcons = plenixModules.filter((n) => fs.existsSync(path.join(PLENIX_ICONS, n + '.svg')));
json(path.join(I, 'icons.json'), { version: VERSION, set: 'Material Symbols Sharp, weight 300, optical size 20 (unedited)', count: icons.length, icons,
  plenix: { count: plenixModules.length, modules: plenixModules.map((n) => './plenix/' + n + '.js'), index: './plenix/index.json' } });
json(path.join(I, 'package.json'), manifest('icons', 'Plenix icons: Material Symbols Sharp (weight 300), outline and filled, as SVG files, importable icon modules and an icon stylesheet.', {
  // the modules are ES modules (export default): the package's only JavaScript
  type: 'module',
  exports: { './icons.json': './icons.json', './icon.css': './icon.css', './svg/*': './svg/*', './plenix/*': './plenix/*', './package.json': './package.json' },
}));
readme('icons', `
${icons.length} icons, outline and filled, 20px and 24px: Material Symbols Sharp at weight 300, unedited.

- \`svg/<name>.svg\`, \`<name>-fill.svg\`, \`<name>-24.svg\`, \`<name>-24-fill.svg\`
- \`icons.json\`: every name and its files, and the list of Plenix modules.
- \`plenix/<name>.js\`: ${plenixModules.length} modules. Each of the ${plenixIcons.length} Plenix icons is its own module with its four SVG files beside it. Each of the ${plenixModules.length - plenixIcons.length} aliases (a symbol's underscore spelling, \`add_row_below\`) is a module that imports its icon (\`add-row-below.js\`) and has no SVG files of its own. \`plenix/index.json\` lists the names and aliases. Import only what you use: \`import Add from '${SCOPE}/icons/plenix/add.js'\`, then \`<Icon icon={Add} />\` or \`registerIcons(Add)\`.
- \`icon.css\`: the stylesheet the Icon component uses (already part of ${SCOPE}/styles).`);

// ---------- styles ----------
const S = path.join(PKG, 'styles');
// esbuild bundles the stylesheet and writes its minified copy: the owner kept esbuild as the CSS minifier (#711). Every
// JavaScript bundle here is Vite's (below).
const cssOpts = { entryPoints: [path.join(P, 'platform.css')], bundle: true, logLevel: 'silent', loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' } };
esbuild.buildSync(Object.assign({}, cssOpts, { outfile: path.join(S, 'plenix.css') }));
esbuild.buildSync(Object.assign({}, cssOpts, { outfile: path.join(S, 'plenix.min.css'), minify: true }));
// the hosted typefaces (batch 227): fonts.css beside the font files, as the Platform has them (platform/system/fonts.css,
// platform/fonts); no page calls Google
copyDir(path.join(P, 'fonts'), path.join(S, 'fonts'));
write(path.join(S, 'fonts.css'), fs.readFileSync(path.join(P, 'system', 'fonts.css'), 'utf8').split('url("../fonts/').join('url("fonts/'));
copy(path.join(P, 'providers', 'theme-boot.js'), path.join(S, 'theme-boot.js'));
// the same rules per part (#710, option S1), cut from plenix.css by tools/style-parts.js: foundations.css once, then
// parts/<part>.css for each part an app uses (each imports the parts it needs). plenix.css and the CDN stay as they are;
// tools/agent/style-parts-check.js proves the files add up to plenix.css (check-bundle.js runs it)
fs.rmSync(path.join(S, 'parts'), { recursive: true, force: true });
for (const [file, text] of Object.entries(require('./tools/style-parts.js').files(fs.readFileSync(path.join(S, 'plenix.css'), 'utf8'), VERSION).out)) write(path.join(S, file), text);
json(path.join(S, 'package.json'), manifest('styles', 'Plenix styles: the whole Platform stylesheet (tokens, theme, foundations, every component and pattern) in one file, or per part.', {
  style: 'plenix.css',
  exports: { '.': './plenix.css', './plenix.css': './plenix.css', './plenix.min.css': './plenix.min.css', './foundations.css': './foundations.css', './parts/*': './parts/*',
    './fonts.css': './fonts.css', './fonts/*': './fonts/*', './theme-boot.js': './theme-boot.js', './package.json': './package.json' },
}));
readme('styles', `
- \`plenix.css\` (and \`plenix.min.css\`): tokens, the Plenix theme, the foundations and every component and pattern.
- \`fonts.css\` and \`fonts/\`: DM Sans and Reddit Mono, and for Arabic Readex Pro and IBM Plex Sans Arabic (all SIL Open Font License), hosted with the styles: nothing is fetched from Google.
- \`theme-boot.js\`: load it in \`<head>\` before the page draws; it sets the light or dark mode, the display density and the interaction environment (\`data-plx-mode\`, \`data-plx-density-policy\` on \`<html>\`).

\`\`\`html
<html lang="en" data-plx-density-policy="compact">
<head>
  <script src="node_modules/${SCOPE}/styles/theme-boot.js"></script>
  <link rel="stylesheet" href="node_modules/${SCOPE}/styles/fonts.css">
  <link rel="stylesheet" href="node_modules/${SCOPE}/styles/plenix.css">
\`\`\`

## Per part (optional)

The same rules, cut by part, for an app that uses a few parts: \`foundations.css\` once (the layer order, tokens, theme and base), then \`parts/<part>.css\` for each part it uses. Each part file imports the parts it needs. Together they are exactly \`plenix.css\`, in its order.

\`\`\`js
import '${SCOPE}/styles/foundations.css';
import '${SCOPE}/styles/parts/button.css';
import '${SCOPE}/styles/parts/badge.css';
\`\`\`

- Load either \`plenix.css\` or the per-part files, never both: the rules would load twice.
- Import them in one place, at the app's start, through your bundler. It loads each part once.
- A part is named after its component in kebab case: \`data-grid\`, \`nav-pane\`, \`side-panel\`. \`parts/utilities.css\` holds the one-purpose classes (\`plx-u-*\`).`);

// ---------- react ----------
const R = path.join(PKG, 'react');
// @plenix-ds/react's JavaScript, built by Vite in library mode (#709, step 5; vite.packages.config.mjs), one run per build:
//   cdn  release/cdn/<v>/plenix.esm.js: the ES module as one file (unchanged): it knows its own address (#284), so Icon finds
//        the icon files beside it, whatever the file is called
//   esm  the npm package's ES modules, one per part (#685, the audit #684): an entry for each module platform/index.js
//        exports from, at its own path, and the barrel dist/index.js; the code two parts share sits once in dist/chunks/, so
//        an application that imports one part bundles that part and what it uses. What loads only when asked (#702) is in
//        these ES modules only: Arabic (import '@plenix-ds/react/i18n/ar', dist/i18n/ar.js) and the icon names (a chunk of
//        their own). No address banner: the npm package carries no icon folder (an app registers or imports its icons)
//   cjs  dist/index.cjs, the CommonJS build, one file
// The bundles hold no engine address and inject no script (#456, #457): the engines (rich text, charts, PDF) load through the
// page's plenix-engines.js, shipped beside plenix.js and in the npm package's dist/ (its vendor/ folder is beside it).
const VITE = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
for (const build of ['cdn', 'esm', 'cjs', 'ar']) {
  require('child_process').execFileSync(process.execPath, [VITE, 'build', '--config', path.join(ROOT, 'vite.packages.config.mjs')],
    { cwd: ROOT, stdio: 'inherit', env: Object.assign({}, process.env, { PLENIX_PACKAGE: build }) });
}
copy(path.join(P, 'dist', 'platform.js'), path.join(R, 'dist', 'plenix.global.js'));
copy(path.join(P, 'engines', 'plenix-engines.js'), path.join(R, 'dist', 'plenix-engines.js'));
// the TypeScript definitions, from the components' header comments (build-types.js)
require('./build-types.js')(path.join(R, 'index.d.ts'), VERSION);
// the Arabic opt-in is imported for what it does, and exports nothing (#702)
write(path.join(R, 'i18n', 'ar.d.ts'), '/* @plenix-ds/react ' + VERSION + ' · import \'@plenix-ds/react/i18n/ar\': Plenix\'s own words in Arabic on an Arabic page (generated). */\nexport {};\n');
const exportsList = [];
for (const m of fs.readFileSync(path.join(P, 'index.js'), 'utf8').matchAll(/export \{([^}]+)\} from '([^']+)'/g)) {
  // a renamed export ("PLACEMENTS as FLOATING_PLACEMENTS") is listed by its public name
  for (const n of m[1].split(',').map((x) => x.trim()).filter(Boolean)) exportsList.push({ name: n.replace(/^\w+\s+as\s+/, ''), file: 'platform/' + m[2].replace(/^\.\//, '') });
}
json(path.join(R, 'package.json'), manifest('react', 'Plenix React components and patterns, drawn only from Plenix tokens.', {
  main: 'dist/index.cjs', module: 'dist/index.js', types: 'index.d.ts',
  // only the CSS and the two scripts that act when loaded (the browser global sets window.Plenix; the engines script loads
  // the engines) have side effects: every ES module part is pure, so a bundler drops the parts an app does not import (#685);
  // a language's opt-in (dist/i18n/ar.js, #702) acts when imported too
  sideEffects: ['*.css', './dist/plenix.global.js', './dist/plenix-engines.js', './dist/i18n/*.js'],
  exports: { '.': { types: './index.d.ts', import: './dist/index.js', require: './dist/index.cjs' }, './i18n/ar': { types: './i18n/ar.d.ts', import: './dist/i18n/ar.js' },
    './plenix.global.js': './dist/plenix.global.js', './plenix-engines.js': './dist/plenix-engines.js', './package.json': './package.json' },
  // React 18 and 19 (#686, the audit #684): the source was checked for what React 19 removes (defaultProps on function parts,
  // propTypes, string refs, findDOMNode, legacy context, ReactDOM.render, element.ref); the script-tag build keeps React 18
  peerDependencies: { react: '>=18.2.0 <20', 'react-dom': '>=18.2.0 <20' },
  dependencies: { [SCOPE + '/styles']: VERSION, [SCOPE + '/tokens']: VERSION, [SCOPE + '/icons']: VERSION },
}));
readme('react', `
${exportsList.length} exports: every Platform component, pattern, provider and hook (\`Button\`, \`DataGrid\`, \`Dialog\`, \`AppShell\`, \`NavPane\`, \`ThemeProvider\`, …).

\`\`\`js
import '${SCOPE}/styles/plenix.css';
import { AppShell, Button, DataGrid } from '${SCOPE}/react';
\`\`\`

Pages without a build tool load \`dist/plenix.global.js\` after React 18 and use \`window.Plenix\`.
A page that shows a rich-text editor, a chart or a PDF also loads \`dist/plenix-engines.js\` (its \`vendor/\` folder sits beside it); without it those parts say the engines script is missing. A page that loads it as a module, injects it or bundles it (\`document.currentScript\` is null then) must set \`window.PlenixVendorBase\` to the vendor folder first.
React 18 or 19 is a peer dependency (\`>=18.2.0 <20\`) for the ES module and CommonJS builds. \`dist/plenix.global.js\` (the CDN's \`plenix.js\`) needs React 18 on the page: React 19 publishes no UMD script, so the script-tag way stays on React 18.2.0. Rules: compose from these components and the tokens only; no inline styles or hard-coded values.`);

// ---------- CDN: the same files at a fixed address per version ----------
// the version stamp (#842): the CDN's stylesheet names its release as --plx-version (one rule at the end, outside the layers),
// so plenix.js, the loader and a check can tell a page that mixes releases. Only the CDN copies carry it: the npm stylesheet
// and its per-part files stay exactly as cut (tools/agent/style-parts-check.js)
const STAMP = '/* Plenix ' + VERSION + ': the release of this stylesheet (#842) */\n:root{--plx-version:"' + VERSION + '"}\n';
write(path.join(CDN, 'plenix.css'), fs.readFileSync(path.join(S, 'plenix.css'), 'utf8') + STAMP);
write(path.join(CDN, 'plenix.min.css'), fs.readFileSync(path.join(S, 'plenix.min.css'), 'utf8').replace(/\n?$/, '\n') + ':root{--plx-version:"' + VERSION + '"}\n');
copy(path.join(S, 'fonts.css'), path.join(CDN, 'fonts.css'));
copyDir(path.join(S, 'fonts'), path.join(CDN, 'fonts'));   // the hosted typefaces beside fonts.css (batch 227)
copy(path.join(S, 'theme-boot.js'), path.join(CDN, 'theme-boot.js'));
// the CDN's plenix.js (issue 882): the browser global without the built-in Arabic words, which plenix-ar.js (the "ar" build
// above) adds on an Arabic page; vite.platform.config.mjs with PLENIX_GLOBAL=cdn. The npm package's plenix.global.js and
// this checkout's platform/dist/platform.js keep Arabic built in
require('child_process').execFileSync(process.execPath, [VITE, 'build', '--config', path.join(ROOT, 'vite.platform.config.mjs')],
  { cwd: ROOT, stdio: 'inherit', env: Object.assign({}, process.env, { PLENIX_GLOBAL: 'cdn' }) });
copy(path.join(ROOT, 'build', 'vite', 'cdn', 'plenix.js'), path.join(CDN, 'plenix.js'));
copy(path.join(R, 'dist', 'plenix-engines.js'), path.join(CDN, 'plenix-engines.js'));
// the applications' own files (issue 842): a release holds every file an application page loads, so the page loader
// (platform/loader/loader.js) takes all of them from one release, and an application pinned to a release runs that
// release's own script. apps/<app>/app.js and plenix-icons-<app>.js for each suite application (a folder with main.jsx and
// index.html), apps/suite/plenix-app-data.js and apps/suite/settings-data.js (the Settings page only), and the Asset Manager's apps/dam/assets.js and plenix-icons-dam.js
{
  const APPS = path.join(CDN, 'apps');
  const suite = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, 'main.jsx')) && fs.existsSync(path.join(ROOT, d.name, 'index.html'))).map((d) => d.name).sort();
  for (const app of suite) for (const f of ['app.js', 'plenix-icons-' + app + '.js']) copy(path.join(ROOT, app, f), path.join(APPS, app, f));
  copy(path.join(ROOT, 'suite', 'plenix-app-data.js'), path.join(APPS, 'suite', 'plenix-app-data.js'));
  copy(path.join(ROOT, 'suite', 'settings-data.js'), path.join(APPS, 'suite', 'settings-data.js'));
  copy(path.join(ROOT, 'dam', 'app', 'assets.js'), path.join(APPS, 'dam', 'assets.js'));
  copy(path.join(ROOT, 'dam', 'plenix-icons-dam.js'), path.join(APPS, 'dam', 'plenix-icons-dam.js'));
}
// the compatibility icon file (#553): every Plenix icon registered with registerIcons, loaded after plenix.js by a site
// without its own icon file (tools/icons/site-icons.js writes a site's own); brought up to date first, then copied
require('./tools/icons/site-icons.js').buildCompat(ROOT);
copy(path.join(ROOT, 'platform', 'dist', 'plenix-icons-plenix.js'), path.join(CDN, 'plenix-icons-plenix.js'));
// The CDN and npm declarations share the same generated source, including its export-coverage gate.
copy(path.join(R, 'index.d.ts'), path.join(CDN, 'plenix.d.ts'));
write(path.join(CDN, 'README.md'), '# Plenix ' + VERSION + '\n\nLoad plenix.esm.js with plenix.css. An Arabic page that loads plenix.js adds plenix-ar.js right after it (Plenix\'s built-in Arabic words, issue 882; plenix.js no longer carries them; the page loader adds it by itself on an Arabic page). For a full-page list, start from ListingPage (a toolbar, a grid that fills the rest and scrolls inside, a detail beside it; no page controls). A page that shows a rich-text editor, a chart or a PDF also loads plenix-engines.js (the engines sit in ./vendor/ beside it); a page that loads it as a module, injects it or bundles it (document.currentScript is null then) must set window.PlenixVendorBase to the vendor folder. Icon draws every Material Symbols icon by its own name (<Icon name="rocket_launch">): a name draws from its module when one is imported or registered (an icon file, below); otherwise a Plenix icon loads its file once from ./icons/plenix/ and any other symbol from /cdn/material/ (setIconLibrary(url) points elsewhere; plenix.esm.js finds the icon folders beside itself, under any file name, when it is imported as a module; a bundler that rewrites import.meta.url sends the icon requests to the app\'s own folder, so there set window.PlenixIconLibrary or call setIconLibrary), with a warning in development; an unknown name draws nothing and warns in the console. Icons never come from the stylesheet any more.\n\n## Retired: bare icon classes, the glyph settings and icons-all.css (#557)\n\nAn icon written as a bare class name (plx-icon plx-icon--<name>, without the component), the icon drawing settings (--plx-comp-icon-glyph-*) and icons-all.css are removed in this version: a bare class draws nothing, the settings are gone, and icons-all.css is no longer published. Use <Icon name="…"> (or an imported module), and where a page writes HTML, Plenix.iconMarkup(icon), which writes the component\'s markup.\n\n## Icon files\n\nA page that loads plenix.js can register its icons after it, so each one draws from its own module: plenix-icons-<site>.js, written by tools/icons/site-icons.js from the site\'s source with exactly its icons (recommended for production), or plenix-icons-plenix.js, every Plenix icon (the compatibility file). Both are data checked by the Icon component, and work offline and from file://. Without either, <Icon name> keeps working as before.\n\n## Self-hosting (an extension, an offline app)\n\nThe archive (plenix-' + VERSION + '.tgz) carries everything the documented APIs need, the icon library included (icons/library/) and the files of the Plenix icons (icons/plenix/). Serve its files together: Icon finds icons/library/ beside plenix.js or plenix.css. When your bundler renames those files, name the folder before Plenix draws: window.PlenixIconLibrary = chrome.runtime.getURL(\'plenix/icons/library/\') (or setIconLibrary(url)). The icon files are SVG data, parsed into paths and never run as code.\n\nTypeScript declarations: [plenix.d.ts](plenix.d.ts), generated from the same source as @plenix-ds/react/index.d.ts. React types must be installed in your TypeScript project.\n\nOnline changes: [CHANGELOG.md](' + SITE + '/cdn/' + VERSION + '/CHANGELOG.md). Component documentation: [docs/index.json](' + SITE + '/cdn/' + VERSION + '/docs/index.json).\n');
copy(path.join(P, 'vendor', 'react.production.min.js'), path.join(CDN, 'vendor', 'react.production.min.js'));
copy(path.join(P, 'vendor', 'react-dom.production.min.js'), path.join(CDN, 'vendor', 'react-dom.production.min.js'));
// the RichTextEditor's engine (Tiptap, MIT): loaded by the editor from ./vendor/tiptap/ the same way, shipped in both places too
copyDir(path.join(P, 'vendor', 'tiptap'), path.join(CDN, 'vendor', 'tiptap'));
copyDir(path.join(P, 'vendor', 'tiptap'), path.join(R, 'dist', 'vendor', 'tiptap'));
// the charts' engine (Apache ECharts 6.1.0, Apache-2.0: line, bar, pie, grid; #353): loaded by the first chart on a page
// from ./vendor/echarts/ the same way (vendorBase), shipped in both places too
copyDir(path.join(P, 'vendor', 'echarts'), path.join(CDN, 'vendor', 'echarts'));
copyDir(path.join(P, 'vendor', 'echarts'), path.join(R, 'dist', 'vendor', 'echarts'));
// the DocumentViewer's PDF engine (PDF.js 4.10.38, Apache-2.0: module, worker, LICENSE): loaded from ./vendor/pdfjs/ the
// same way (vendorBase), shipped in both places too; the manifest hashes it with the rest of vendor/ (issue #238)
copyDir(path.join(P, 'vendor', 'pdfjs'), path.join(CDN, 'vendor', 'pdfjs'));
copyDir(path.join(P, 'vendor', 'pdfjs'), path.join(R, 'dist', 'vendor', 'pdfjs'));
// a standalone acceptance page on this release's own files (CTM, 2026-10-22): /cdn/<version>/examples/acceptance.html
copy(path.join(ROOT, 'docs', 'integration', 'acceptance.html'), path.join(CDN, 'examples', 'acceptance.html'));
// icons-all.css is retired (owner, #557): it gave bare class names (plx-icon--<material name>) a drawing, and bare classes
// draw nothing since icon stage 5c-2. <Icon name="person_cancel"> draws any Material symbol from /cdn/material/<commit>/
// (deploy.sh copies platform/icons/library there once), or from an imported or registered module. Releases up to the last
// one that shipped it keep their own copy.
copyDir(path.join(T, 'css'), path.join(CDN, 'tokens'));
copy(path.join(T, 'css', 'tokens.css'), path.join(CDN, 'tokens.css'));
// the icon asset layout (#279, stage 1 of #277): /cdn/<version>/icons/<set>/<name>.svg|.js and index.json for Plenix's
// own set and the whole Material library (generated as modules at each release: #277 answer 8); a path never changes
// once published. No consumer reads them yet: plenix.css and the Icon component draw every icon as before.
for (const set of ['plenix', 'material']) { const t = Date.now(), r = require('./platform/icons/layout.js').writeSet(ROOT, set, path.join(CDN, 'icons', set)); console.log('  icons/' + set + ': ' + r.icons + ' icons, ' + r.files + ' files, ' + (r.bytes / 1048576).toFixed(1) + ' MB, ' + ((Date.now() - t) / 1000).toFixed(1) + ' s'); }   // /cdn/<version>/tokens.css, beside plenix.js (plenixTokens' default)
copy(path.join(T, 'tokens.json'), path.join(CDN, 'tokens', 'tokens.json'));
// the native outputs (build-mobile.js) and the platform sets they come from (Platforms Standard 7.1 and 7.2, batch 297)
for (const d of ['ios', 'android', 'flutter']) copyDir(path.join(P, 'mobile', d), path.join(CDN, 'mobile', d));
for (const f of ['platform-ios.tokens.json', 'platform-android.tokens.json']) copy(path.join(P, 'tokens', f), path.join(CDN, 'tokens', f));
copyDir(path.join(I, 'svg'), path.join(CDN, 'icons'));
copy(path.join(I, 'icons.json'), path.join(CDN, 'icons', 'icons.json'));
// the release's source as written, for the design spec, a consumer of this CDN (owner, 2026-10-25): its pages read each
// component's JSX and CSS, the token files and the standards as text (platform/design-system/plenix-source.js). Laid out
// like the repository: source/platform/… (every source folder; the runtime files dist, vendor, fonts, mobile and the icon
// library are already in the release) plus the few repository files a spec page documents (src: '../…' in a record).
{
  const SRC = path.join(CDN, 'source');
  for (const f of ['platform.css', 'plenix-system.css', 'index.js', path.join('tokens', 'tokens.index.json')]) copy(path.join(P, f), path.join(SRC, 'platform', f));
  for (const d of ['components', 'patterns', 'hooks', 'providers', 'templates', 'utils', 'charts', 'i18n', 'exports', 'system', 'standards', 'brand', 'dev', path.join('icons', 'inventory')]) copyDir(path.join(P, d), path.join(SRC, 'platform', d), (n) => n !== 'node_modules');
  const DSD = path.join(P, 'design-system'), outside = new Set();
  for (const f of ['spec-parts.js', 'inventory.js'].map((x) => path.join(DSD, x)).filter((x) => fs.existsSync(x))) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/["']?(?:src|also)["']?\s*:\s*\[?\s*["']\.\.\/([\w./-]+)["']/g)) outside.add(m[1]);
  }
  for (const rel of [...outside, 'check-system.rules']) {
    const from = path.join(ROOT, rel);
    if (!fs.existsSync(from)) continue;   // a record that names a file no longer in the repository shows no source
    if (fs.statSync(from).isDirectory()) copyDir(from, path.join(SRC, rel)); else copy(from, path.join(SRC, rel));
  }
}

// Developer-facing CDN metadata, always available even when the private design system is absent.
copy(path.join(ROOT, 'CHANGELOG.md'), path.join(CDN, 'CHANGELOG.md'));
copy(path.join(P, 'dev', 'token-check.js'), path.join(CDN, 'token-check.js'));
const cdnVersions = cdnChangelog(fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8'));
if (!cdnVersions.some((entry) => entry.version === VERSION)) cdnVersions.unshift({ version: VERSION, date: null, breaking: [] });
json(path.join(REL, 'cdn', 'index.json'), { latest: VERSION, versions: cdnVersions });
json(path.join(CDN, 'index.json'), { version: VERSION, breaking: cdnVersions.find((entry) => entry.version === VERSION).breaking,
  files: { types: 'plenix.d.ts', readme: 'README.md', changelog: 'CHANGELOG.md', docs: fs.existsSync(path.join(P, 'design-system', 'inventory.js')) ? 'docs/index.json' : null, tokens: 'tokens.json', tokenCheck: 'token-check.js' } });
json(path.join(CDN, 'tokens.json'), { version: VERSION, count: index.tokens.length, tokens: index.tokens.map((token) => ({
  name: token.name, tier: token.tier, purpose: token.description || '', type: token.type,
  value: token.resolved || Object.fromEntries(token.sets.map((set) => [set.selector, set.value])),
  values: token.sets.map((set) => ({ selector: set.selector, value: set.value, file: set.file }))
})) });


// ---------- API: read-only JSON for tools, agents and other systems ----------
let apiNote = 'skipped (platform/design-system is not checked out)';
const DS = path.join(P, 'design-system');
if (fs.existsSync(path.join(DS, 'inventory.js'))) {
  // the records only: React and window.Plenix are stand-ins (their live examples are functions and are never drawn here)
  const stub = new Proxy(function () { return null; }, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : stub), apply: () => null });
  const win = { Plenix: stub };
  const ctx = vm.createContext({ window: win, React: stub, ReactDOM: stub, document: stub, console });
  for (const f of ['inventory-taxonomy.js', 'spec-parts.js', 'inventory.js', 'inventory-guidance.js', 'inventory-docs.js'].filter((x) => fs.existsSync(path.join(DS, x)))) vm.runInContext(fs.readFileSync(path.join(DS, f), 'utf8'), ctx, { filename: f });
  const recs = Array.isArray(win.DSInventory) ? win.DSInventory : Object.values(win.DSInventory || {});
  const pick = (o, ks) => Object.fromEntries(ks.filter((k) => o[k] !== undefined && o[k] !== '').map((k) => [k, o[k]]));
  // each record with its written sections (inventory-docs.js, batch 208); a record's own fields win
  const docs = win.DSDocs || {};
  // Static Markdown uses the same records and source headers as the API. Never execute a live example to document it.
  const cdnDocs = require('./build-docs-components')(recs, docs, P, path.join(CDN, 'docs'), cdnRecordDoc, write);
  json(path.join(CDN, 'docs', 'index.json'), { version: VERSION, types: '../plenix.d.ts', count: cdnDocs.length, records: cdnDocs });

  const components = recs.map((r) => Object.assign(pick(docs[r.id] || {}, ['purpose', 'anatomy', 'behavior', 'a11y', 'content']), pick(r, ['id', 'title', 'sec', 'sub', 'leaf', 'level', 'status', 'icon', 'text', 'purpose', 'use', 'avoid', 'related', 'aliases', 'covers', 'map', 'plenix', 'src'])));
  const sections = (win.DSTaxonomy || []).map((s) => pick(s, ['id', 'n', 'title', 'question', 'icon', 'subs', 'leaves', 'groups']));
  const meta = { version: VERSION, generated: new Date().toISOString().slice(0, 10), docs: SITE + '/' };
  json(path.join(API, 'index.json'), Object.assign({}, meta, {
    description: 'The Plenix design system as read-only JSON. Every file is also published at ' + SITE + '/api/v1/<name>.',
    endpoints: {
      tokens: SITE + '/api/v1/tokens', components: SITE + '/api/v1/components', exports: SITE + '/api/v1/exports',
      taxonomy: SITE + '/api/v1/taxonomy', guidance: SITE + '/api/v1/guidance', platforms: SITE + '/api/v1/platforms', nativeGuidance: SITE + '/api/v1/native-guidance', figmaMap: SITE + '/api/v1/figma-map', nativeDesign: SITE + '/api/v1/native-design', icons: SITE + '/api/v1/icons', cdn: SITE + '/cdn/' + VERSION + '/',
    },
    packages: ['tokens', 'icons', 'styles', 'react'].map((n) => SCOPE + '/' + n + '@' + VERSION),
  }));
  json(path.join(API, 'tokens.json'), Object.assign({}, meta, { count: tokens.length, tokens, platformOnly }));
  // the Platforms Standard (platform/standards/platforms.md) and its token mapping: every native value by name, with the web
  // token it maps to and its source on each platform
  {
    const sctx = vm.createContext({ window: {} });
    const std = path.join(DS, 'platforms-standard.js');
    if (fs.existsSync(std)) vm.runInContext(fs.readFileSync(std, 'utf8'), sctx, { filename: 'platforms-standard.js' });
    const S = sctx.window.DSStandard || {};
    // Plenix's guidance for the Apple HIG pages, mapped to Web and Android (platform/standards/native-guidance.json, batch 330)
    const ngf = path.join(P, 'standards', 'native-guidance.json');
    if (fs.existsSync(ngf)) { const ng = JSON.parse(fs.readFileSync(ngf, 'utf8')); json(path.join(API, 'native-guidance.json'), Object.assign({}, meta, { source: ng.source, read: ng.read, count: Object.keys(ng.pages).length, pages: ng.pages }));
    // the Plenix design of each native component (platform/standards/native-design.json, batch 336)
    const ndf = path.join(P, 'standards', 'native-design.json');
    if (fs.existsSync(ndf)) json(path.join(API, 'native-design.json'), Object.assign({}, meta, JSON.parse(fs.readFileSync(ndf, 'utf8'))));
    // the Figma kit mapped to the iOS pages (platform/standards/figma-map.json, batch 334)
    const fmf = path.join(P, 'standards', 'figma-map.json');
    if (fs.existsSync(fmf)) json(path.join(API, 'figma-map.json'), Object.assign({}, meta, JSON.parse(fs.readFileSync(fmf, 'utf8')))); }
    json(path.join(API, 'platforms.json'), Object.assign({}, meta, { title: S.title || '', source: 'platform/standards/platforms.md',
      platforms: ['web', 'ios', 'android'], count: (S.tokenMap || []).length, tokenMap: S.tokenMap || [], sections: S.sections || [] }));
  }
  json(path.join(API, 'components.json'), Object.assign({}, meta, { count: components.length, components }));
  json(path.join(API, 'exports.json'), Object.assign({}, meta, { package: SCOPE + '/react', count: exportsList.length, exports: exportsList }));
  json(path.join(API, 'taxonomy.json'), Object.assign({}, meta, { count: sections.length, sections, placementRules: win.DSPlacementRules || [] }));
  const g = win.DSGuidance || {};
  json(path.join(API, 'guidance.json'), Object.assign({}, meta, { count: Object.keys(g).length,
    items: Object.keys(g).map((k) => Object.assign({ section: k.split('|')[0], item: k.split('|').slice(1).join('|') }, g[k])) }));
  json(path.join(API, 'icons.json'), Object.assign({}, meta, { count: icons.length, base: SITE + '/cdn/' + VERSION + '/icons/', icons }));
  apiNote = components.length + ' components, ' + Object.keys(g).length + ' guidance items, ' + tokens.length + ' tokens';
}

// the library's further packages (library plan, wave 0): every build-packages.d/<name>.js is a step of its own, run in name
// order with the release's context; it builds packages/<name>/ and may add its files to the CDN or the API
const STEPS = path.join(ROOT, 'build-packages.d');
const stepNotes = [];
if (fs.existsSync(STEPS)) for (const f of fs.readdirSync(STEPS).filter((x) => x.endsWith('.js')).sort()) {
  const note = require(path.join(STEPS, f))({ ROOT, P, VERSION, SCOPE, SITE, REPO, PKG, REL, CDN, API, write, json, copy, copyDir });
  stepNotes.push(f.replace(/\.js$/, '') + (note ? ' (' + note + ')' : ''));
}

// ---------- offline CDN bundle (runtime files only; no network needed after extraction) ----------
function cdnOfflineBundle() {
  const crypto = require('crypto'), zlib = require('zlib');
  const assets = new Map();
  const add = (relative) => {
    const file = path.join(CDN, relative);
    if (fs.statSync(file).isDirectory()) for (const name of fs.readdirSync(file).sort()) add(relative + '/' + name);
    else assets.set(relative, fs.readFileSync(file));
  };
  // icons/plenix: the Plenix set's files, where Icon loads a Plenix name that no module or icon file registers (#557)
  for (const name of ['plenix.esm.js', 'plenix.d.ts', 'README.md', 'plenix.js', 'plenix-ar.js', 'plenix-icons-plenix.js', 'plenix-engines.js', 'plenix.css', 'plenix.min.css', 'fonts.css', 'theme-boot.js', 'fonts', 'vendor', 'icons/plenix']) add(name);
  // the icon library inside the bundle (#59; packaging fix for the 0.69.2 regression, the full icon architecture is #277):
  // every Material Symbols file under icons/library/, where <Icon> looks by default when Plenix is served from these files
  // (icons-all.css is retired, #557)
  const LIB = path.join(P, 'icons', 'library');
  for (const name of fs.readdirSync(LIB).filter((f) => /\.(svg|json)$/.test(f)).sort()) assets.set('icons/library/' + name, fs.readFileSync(path.join(LIB, name)));
  // every icon the Icon API documents has its files in the package (#284): a missing one fails the build
  const lacking = require('./platform/icons/layout.js').missingPackageIcons(ROOT, (f) => assets.has(f));
  if (lacking.length) throw new Error('The offline bundle lacks ' + lacking.length + ' icon file(s) the Icon API documents, for example ' + lacking.slice(0, 5).join(', '));
  const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
  const manifest = { version: VERSION, algorithm: 'sha256', description: 'Hashes cover every runtime file, TypeScript declarations and the README. This manifest is excluded from its own list; the CDN index hashes the complete archive.', files: [...assets].map(([name, data]) => ({ path: name, bytes: data.length, sha256: hash(data) })) };
  const manifestName = 'bundle-manifest.json';
  const manifestData = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  assets.set(manifestName, manifestData);
  // USTAR is read by both Windows bsdtar and Unix tar; fixed metadata keeps identical inputs reproducible.
  const blocks = [];
  for (const [relative, data] of assets) {
    const header = Buffer.alloc(512), octal = (offset, length, value) => {
      const text = value.toString(8); if (text.length > length - 1) throw new Error('Offline bundle entry is too large: ' + relative);
      header.write(text.padStart(length - 1, '0') + '\0', offset, length, 'ascii');
    };
    let name = relative, prefix = '';
    if (Buffer.byteLength(name) > 100) { const split = relative.lastIndexOf('/'); name = relative.slice(split + 1); prefix = relative.slice(0, split); }
    if (Buffer.byteLength(name) > 100 || Buffer.byteLength(prefix) > 155 || relative.startsWith('/') || relative.split('/').includes('..')) throw new Error('Unsafe or unsupported offline bundle path: ' + relative);
    header.write(name, 0, 100, 'utf8'); octal(100, 8, 420); octal(108, 8, 0); octal(116, 8, 0); octal(124, 12, data.length); octal(136, 12, 0);
    header.fill(32, 148, 156); header[156] = 48; header.write('ustar\0', 257, 6, 'ascii'); header.write('00', 263, 2, 'ascii'); header.write(prefix, 345, 155, 'utf8');
    const checksum = header.reduce((sum, byte) => sum + byte, 0); header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');
    blocks.push(header, data); if (data.length % 512) blocks.push(Buffer.alloc(512 - data.length % 512));
  }
  blocks.push(Buffer.alloc(1024));
  const archive = zlib.gzipSync(Buffer.concat(blocks), { level: 9 }), archiveName = 'plenix-' + VERSION + '.tgz';
  write(path.join(CDN, archiveName), archive); write(path.join(CDN, manifestName), manifestData);
  const cdnIndexFile = path.join(CDN, 'index.json'), cdnIndex = JSON.parse(fs.readFileSync(cdnIndexFile, 'utf8'));
  cdnIndex.files.bundle = archiveName; cdnIndex.files.bundleManifest = manifestName;
  cdnIndex.bundle = { href: archiveName, bytes: archive.length, sha256: hash(archive), manifest: manifestName, files: manifest.files.length };
  json(cdnIndexFile, cdnIndex);
  const versionsFile = path.join(REL, 'cdn', 'index.json'), versions = JSON.parse(fs.readFileSync(versionsFile, 'utf8'));
  const current = versions.versions.find((entry) => entry.version === VERSION); if (current) current.bundle = VERSION + '/' + archiveName;
  json(versionsFile, versions);
}
cdnOfflineBundle();

const kb = (f) => Math.round(fs.statSync(f).size / 1024) + ' KB';
console.log('Plenix ' + VERSION + ': packages ' + ['tokens', 'icons', 'styles', 'react'].map((n) => SCOPE + '/' + n).join(', '));
console.log('  styles/plenix.css ' + kb(path.join(S, 'plenix.css')) + ' (min ' + kb(path.join(S, 'plenix.min.css')) + '), react ' + kb(path.join(R, 'dist', 'index.js')) + ' ESM, ' + exportsList.length + ' exports, ' + icons.length + ' icons, ' + tokens.length + ' tokens');
console.log('  cdn: release/cdn/' + VERSION + '/   api: ' + apiNote);
if (stepNotes.length) console.log('  steps (build-packages.d): ' + stepNotes.join(', '));
