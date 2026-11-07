// Plenix · a site's icon file (#553, stage 5 of #280). Build-time only (Node); no page loads this file.
// A site that loads Plenix from the CDN (plenix.js, window.Plenix) registers the icons its pages draw by name, so they
// draw from their own modules and never from the stylesheet. Two choices (platform/icons/README.md):
//   plenix-icons-<site>.js    exactly the icons the site uses, written by this tool from the site's source (recommended
//                             for production)
//   plenix-icons-plenix.js    every Plenix icon (the compatibility file): written by node build-app.js into
//                             platform/dist/, and by build-packages.js beside plenix.js on the CDN
// Both are classic scripts loaded after plenix.js. They call Plenix.registerIcons(...modules) once: each drawing is data
// (a path, a viewBox), checked by the Icon component's allow-list (#285) and drawn as React props, never inserted as HTML.
// They load nothing else, so they work offline and from file://. <Icon name> keeps working without them (until 5c).
//
//   node tools/icons/site-icons.js <site> <folder or file> [<folder or file> …] [--out <folder>] [--allow-unknown]
//   npx plenix-site-icons <site> <folder or file> […]   the same tool from @plenix-ds/icons (no Plenix checkout), or
//     node tools/site-icons.cjs <site> … from the CDN folder or its archive (one file, no install; #941): every
//     Plenix icon and the Material symbols the package ships in svg/; another Material Symbols name is reported unknown
//     <site>: the file's name (plenix-icons-<site>.js): lowercase letters, digits and dashes
//     reads .js, .jsx, .mjs, .cjs, .ts, .tsx, .mts, .cts, .html and .htm (folders recursively; node_modules, dist, vendor and dot folders skipped)
//     --out: where to write it (default: the current folder)
//     --allow-unknown: write the file even when a name is unknown or built at run time (reported either way)
//   Exit codes: 0 written, 1 unknown or run-time names (nothing written), 2 usage or a file that cannot be read.
//
// What counts as a use (one per name):
//   - an icon slot, read with Babel by platform/icons/uses.js (the Platform's own rule): <Icon name="…">, icon="…",
//     { icon: '…' }, h(Plenix.Icon, { name: '…' }), a constant whose name ends in Icon or Icons, a parameter's default;
//     a page's inline <script> is read the same way
//   - an imported module: plenix-platform/icons/<set>/<name> or /cdn/<version>/icons/<set>/<name>.js
//   - a bare class name: plx-icon--<name> (drawn by the stylesheet today; registered so the file is complete for 5c)
// A name built at run time ('size-' + s) cannot be read: list the names it can take in a comment on its line, as the
// Platform does:   /* plx-icons: density-large density-medium density-small */
// A name resolves as <Icon name> does: a Plenix name (dashes, or its symbol's underscore spelling), else a Material
// Symbols name from the library (platform/icons/library); anything else is unknown.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
// packaged (P-64, #931): @plenix-ds/icons ships this file as bin/site-icons.cjs (npx plenix-site-icons), with uses.cjs and
// site-icons.json beside it (build-packages.js); it then resolves from site-icons.json, not from a Plenix checkout
const DATA = path.join(__dirname, 'site-icons.json');
const PACKAGED = fs.existsSync(DATA);
const layout = PACKAGED ? null : require(path.join(ROOT, 'platform/icons/layout.js'));
const uses = PACKAGED ? require('./uses.cjs') : require(path.join(ROOT, 'platform/icons/uses.js'));
// the CDN archive ships the same tool as one file, tools/site-icons.cjs, with @babel/parser bundled in (#941)
const COMMAND = !PACKAGED ? 'node tools/icons/site-icons.js' : /[\\/]node_modules[\\/]/.test(__dirname) ? 'npx plenix-site-icons' : 'node tools/site-icons.cjs';

const HEADER = 'GENERATED FILE — DO NOT EDIT';
const COMPAT = 'platform/dist/plenix-icons-plenix.js';
const SCRIPT = /\.([jt]sx?|[mc][jt]s)$/i, PAGE = /\.html?$/i;
const SKIP = /^(node_modules|dist|vendor|\..*)$/;
const IMPORT = /(?:plenix-platform|\/cdn\/[^/'"\s]+)\/icons\/(plenix|material)\/([a-z0-9_-]+)(?:\.js)?['"]/g;
const CLASS = /\bplx-icon--([a-z0-9][a-z0-9_-]*)/g;
// not icon names: the Icon component's modifiers (sizes, fill, layout)
const MODIFIERS = /^(size-(xs|sm|md|lg|xl)|filled|outline|inline|mirrored)$/;

// a generated file (a bundle, an icon file: "GENERATED FILE" in its first lines) is not source: its source is read instead
const generated = (p) => { const fd = fs.openSync(p, 'r'), b = Buffer.alloc(400); const n = fs.readSync(fd, b, 0, 400, 0); fs.closeSync(fd); return /GENERATED FILE/.test(b.toString('utf8', 0, n)); };
// every source file under the inputs, in name order
function sourceFiles(inputs) {
  const out = [];
  const walk = (p) => {
    const st = fs.statSync(p);
    if (st.isDirectory()) { for (const e of fs.readdirSync(p).sort()) if (!SKIP.test(e)) walk(path.join(p, e)); return; }
    if ((SCRIPT.test(p) || PAGE.test(p)) && !generated(p)) out.push(p);
  };
  for (const i of inputs) walk(path.resolve(i));
  return out;
}

// a page's inline scripts (no src, a JavaScript type), each padded to its line in the page so file:line stays true
function inlineScripts(html) {
  const out = [], re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\bsrc\s*=/i.test(attrs)) continue;
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
    if (type && !/^(module|text\/javascript|application\/javascript|text\/babel|text\/jsx)$/i.test(type)) continue;
    const before = html.slice(0, m.index + m[0].indexOf('>') + 1).split('\n').length - 1;
    out.push('\n'.repeat(before) + m[2]);
  }
  return out;
}

// a quoted word that may be an icon name (opts.literals): a Plenix name that reaches an Icon only at run time (from
// data, a prop built in code) is still registered; a word that is not a Plenix name is dropped, never reported
const LITERAL = /['"]([a-z][a-z0-9]*(?:[-_][a-z0-9]+)*)['"]/g;
// the names a site uses: { names: Map<name, Set<file:line>>, unresolved: [file:line …], unreadable: [file: reason …] }
// opts.literals: also every quoted word that is a Plenix icon name (see LITERAL), as "literal:<name>"
function collect(inputs, base, opts = {}) {
  const names = new Map(), unresolved = [], unreadable = [];
  const add = (nm, at) => { if (!names.has(nm)) names.set(nm, new Set()); names.get(nm).add(at); };
  const report = { name(nm, at) { add(nm, at); }, unresolved(at) { unresolved.push(at); } };
  const lineAt = (text, i) => text.slice(0, i).split('\n').length;
  for (const f of sourceFiles(inputs)) {
    const rel = path.relative(base, f).split(path.sep).join('/'), text = fs.readFileSync(f, 'utf8');
    const bodies = PAGE.test(f) ? inlineScripts(text) : [text];
    for (const body of bodies) {
      try { uses.scanText(body, rel, report); } catch (e) { unreadable.push(rel + ': ' + String(e.message || e).split('\n')[0]); }
    }
    let m;
    IMPORT.lastIndex = 0; while ((m = IMPORT.exec(text))) add((m[1] === 'material' ? 'material:' : '') + m[2], rel + ':' + lineAt(text, m.index));
    CLASS.lastIndex = 0; while ((m = CLASS.exec(text))) if (!MODIFIERS.test(m[1])) add(m[1], rel + ':' + lineAt(text, m.index));
    if (opts.literals) { LITERAL.lastIndex = 0; while ((m = LITERAL.exec(text))) add('literal:' + m[1], rel + ':' + lineAt(text, m.index)); }
  }
  return { names, unresolved, unreadable };
}

// where the icons come from: a Plenix checkout (root: its folder; every Material symbol of platform/icons/library), or the
// package's site-icons.json (packageData: the Plenix set and the Material symbols the package ships in svg/)
// { plenix(): entries, material(): entries, module(set, entry): the module object }
function catalogOf(root) {
  if (typeof root !== 'string') return root;
  return { plenix: () => layout.plenixEntries(root), material: () => layout.materialEntries(root), module: (set, e) => layout.moduleObject(set, e) };
}
// the package's catalog: each entry is its module object with its aliases (catalogData writes it)
function packageCatalog(file = DATA) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { plenix: () => data.plenix, material: () => data.material, module: (set, e) => { const m = Object.assign({}, e); delete m.aliases; return m; } };
}
// what the package's site-icons.json holds: every Plenix icon, and each Material symbol of the working set (platform/icons,
// the package's svg/) with its four files, as module objects (each drawing already through the allow-list) with their aliases
function catalogData(root) {
  const dir = path.join(root, 'platform', 'icons');
  const shipped = (e) => ['', '-fill', '-24', '-24-fill'].every((x) => fs.existsSync(path.join(dir, e.symbol + x + '.svg')));
  const entry = (set) => (e) => Object.assign(layout.moduleObject(set, e), { aliases: e.aliases });
  return { plenix: layout.plenixEntries(root).map(entry('plenix')), material: layout.materialEntries(root).filter(shipped).map(entry('material')) };
}

// a name -> the icon it draws, as <Icon name> resolves it: { set, entry } or null
function resolver(root) {
  const catalog = catalogOf(root), plenix = new Map();
  for (const e of catalog.plenix()) { plenix.set(e.name, e); plenix.set(e.symbol, plenix.get(e.symbol) || e); for (const a of e.aliases) plenix.set(a, e); }
  let lib = null;
  const materialOf = (n) => {
    if (!lib) { lib = new Map(); for (const e of catalog.material()) { lib.set(e.name, e); lib.set(e.symbol, e); } }
    return lib.get(n) || lib.get(n.replace(/_/g, '-')) || lib.get(n.replace(/-/g, '_')) || null;
  };
  return (raw) => {
    if (raw.startsWith('literal:')) { const p = plenix.get(raw.slice(8)); return p ? { set: 'plenix', entry: p } : null; }   // a quoted word: Plenix names only
    const forced = raw.startsWith('material:'), n = (forced ? raw.slice(9) : raw).trim();
    if (!forced) {
      const p = plenix.get(n) || plenix.get(n.toLowerCase().replace(/_/g, '-')) || plenix.get(n.toLowerCase().replace(/-/g, '_'));
      if (p) return { set: 'plenix', entry: p };
    }
    const m = materialOf(n.toLowerCase());
    if (m) return { set: 'material', entry: m };
    return null;
  };
}

// the classic script that registers the modules: a path used more than once is written once, as a shared constant
function fileText(site, modules, source, build) {
  const count = new Map();
  for (const m of modules) for (const size of [20, 24]) for (const k of ['outline', 'fill']) { const d = m.drawings[size][k].d; count.set(d, (count.get(d) || 0) + 1); }
  const shared = [...count.keys()].filter((d) => count.get(d) > 1), index = new Map(shared.map((d, i) => [d, i]));
  const mark = (i) => '@@plx-path-' + i + '@@';
  const lines = modules.map((m) => {
    const copy = JSON.parse(JSON.stringify(m));
    for (const size of [20, 24]) for (const k of ['outline', 'fill']) { const i = index.get(copy.drawings[size][k].d); if (i !== undefined) copy.drawings[size][k].d = mark(i); }
    let body = JSON.stringify(copy);
    body = body.replace(/"@@plx-path-(\d+)@@"/g, (x, i) => 'p[' + i + ']');
    return '    ' + body;
  });
  const sets = [...new Set(modules.map((m) => m.set))].sort();
  return '/*\n * ' + HEADER + '\n * Plenix icons for ' + site + ': ' + modules.length + ' icon' + (modules.length === 1 ? '' : 's') + ' (' + sets.join(', ') + '), registered with Plenix.registerIcons.\n' +
    ' * Source: ' + source + '\n * Build: ' + (build || (site === 'plenix' ? 'node build-app.js (tools/icons/site-icons.js)' : COMMAND + ' ' + site + ' <the site\'s source>')) + '\n' +
    ' * Load it after plenix.js. The drawings are data (paths), checked by the Icon component before they are drawn.\n */\n' +
    '(function () {\n  \'use strict\';\n' +
    '  var P = typeof window !== \'undefined\' ? window.Plenix : undefined;\n' +
    '  if (!P || typeof P.registerIcons !== \'function\') { if (typeof console !== \'undefined\') console.warn(\'[Plenix] plenix-icons-' + site + '.js: load it after plenix.js (window.Plenix.registerIcons is missing); no icon was registered\'); return; }\n' +
    '  var p = ' + JSON.stringify(shared) + ';\n' +
    '  P.registerIcons([\n' + lines.join(',\n') + '\n  ]);\n})();\n';
}

// a site's file from its source: { text, icons, unknown: [at "name"], unresolved, unreadable, found }
// opts: { source, build } for the header (default: the generator's own command); literals: also every quoted word that is
// a Plenix name (collect)
function siteFile(root, site, inputs, base, opts = {}) {
  const { names, unresolved, unreadable } = collect(inputs, base || process.cwd(), { literals: !!opts.literals });
  const catalog = catalogOf(root), resolve = resolver(catalog), chosen = new Map(), unknown = [];
  for (const [raw, at] of [...names.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const r = resolve(raw);
    if (!r) { if (!raw.startsWith('literal:')) unknown.push([...at][0] + ' ' + JSON.stringify(raw.replace(/^material:/, ''))); continue; }
    chosen.set(r.set + ':' + r.entry.name, r);
  }
  const modules = [...chosen.values()].sort((a, b) => (a.set + a.entry.name < b.set + b.entry.name ? -1 : 1)).map((r) => catalog.module(r.set, r.entry));
  const source = opts.source || 'the source of ' + site + ' (' + inputs.length + ' input' + (inputs.length === 1 ? '' : 's') + ')';
  return { text: fileText(site, modules, source, opts.build), icons: modules.length, unknown, unresolved, unreadable, found: names.size };
}

// this repository's pages (#557): each suite application and the Asset Manager loads its own icon file after platform.js,
// written by build-app.js from its source (the suite's shared source with each application); the design spec, which shows
// every icon, loads the compatibility file
const APPS = ['dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings'];
const PAGES = APPS.map((app) => ({ site: app, inputs: [app, 'suite'], out: app + '/plenix-icons-' + app + '.js' }))
  .concat([{ site: 'dam', inputs: ['dam/app', 'dam/index.html', 'dam/settings-system.html', 'dam/settings-myaccount.html', 'dam/image-editor.html'], out: 'dam/plenix-icons-dam.js' }]);
// writes (or with check, compares) every page's icon file; a name that is not a Plenix or Material icon (the suite's
// capability keys in plenix-app-data.js, which no Icon draws) is counted, not fatal; a name built at run time stops the build.
// Every quoted word in a page's source that is a Plenix name is registered too (literals): a name that reaches an Icon
// only at run time (from the suite's data, a prop built in code) then draws from file:// as well, not only online
function buildPages(root, opts = {}) {
  const stale = [], unknown = [], unresolved = [];
  let icons = 0;
  for (const p of PAGES) {
    const r = siteFile(root, p.site, p.inputs.map((i) => path.join(root, i)), root, { source: p.inputs.join(', '), build: 'node build-app.js (tools/icons/site-icons.js)', literals: true });
    if (r.unreadable.length) throw new Error('icon file for ' + p.site + ': cannot read ' + r.unreadable.join('; '));
    unresolved.push(...r.unresolved);
    for (const u of r.unknown) if (!unknown.includes(u)) unknown.push(u);
    icons += r.icons;
    const file = path.join(root, p.out), now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (now !== r.text) { stale.push(p.out); if (!opts.check) fs.writeFileSync(file, r.text); }
  }
  if (unresolved.length) throw new Error('icon names built at run time (list them in a /* plx-icons: … */ comment): ' + [...new Set(unresolved)].join(', '));
  // the login service renders its page on the server, without the Platform's script: its icons as markup (#557)
  const login = serviceMarkup(root, LOGIN.names, LOGIN.out);
  const file = path.join(root, LOGIN.out), now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (now !== login) { stale.push(LOGIN.out); if (!opts.check) fs.writeFileSync(file, login); }
  return { pages: PAGES.length + 1, icons: icons + LOGIN.names.length, unknown, stale, changed: !!stale.length };
}

// an icon module as the markup the Icon component renders with no size and no fill (iconMarkup in Icon.tsx writes the
// same in the browser): the span, then one svg holding the 20 and 24 outlines when they share a box
const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPE[c]);
function markupOf(m) {
  const k = m.fillOutline ? 'fill' : 'outline', glyphs = [[m.drawings[20][k], 20], [m.drawings[24][k], 24]];
  const attrs = (g) => ' d="' + esc(g.d) + '"' + (g.transform ? ' transform="' + esc(g.transform) + '"' : '') + (g.fillRule ? ' fill-rule="' + esc(g.fillRule) + '"' : '') + (g.clipRule ? ' clip-rule="' + esc(g.clipRule) + '"' : '');
  const svg = glyphs[0][0].viewBox === glyphs[1][0].viewBox
    ? '<svg class="plx-icon__svg plx-icon__svg--shared" viewBox="' + esc(glyphs[0][0].viewBox) + '" aria-hidden="true" focusable="false">' + glyphs.map(([g, o]) => '<path class="plx-icon__glyph--' + o + '"' + attrs(g) + '></path>').join('') + '</svg>'
    : glyphs.map(([g, o]) => '<svg class="plx-icon__svg plx-icon__glyph--' + o + '" viewBox="' + esc(g.viewBox) + '" aria-hidden="true" focusable="false"><path' + attrs(g) + '></path></svg>').join('');
  return '<span class="plx-icon plx-icon--' + m.name + ' plx-icon--inline' + (m.mirrored ? ' plx-icon--mirrored' : '') + '" aria-hidden="true">' + svg + '</span>';
}
const LOGIN = { names: ['alert', 'info-circle'], out: 'services/login/icons.js' };
function serviceMarkup(root, names, out) {
  const byName = new Map(layout.plenixEntries(root).map((e) => [e.name, e]));
  const table = {};
  for (const n of names) { if (!byName.has(n)) throw new Error(out + ': no Plenix icon is named ' + n); table[n] = markupOf(layout.moduleObject('plenix', byName.get(n))); }
  return '/*\n * ' + HEADER + '\n * The login service\'s icons, as the markup the Icon component renders (server.js writes them into its page).\n' +
    ' * Source: platform/icons (map.json): ' + names.join(', ') + '\n * Build: node build-app.js (tools/icons/site-icons.js)\n */\n' +
    "'use strict';\nmodule.exports = " + JSON.stringify(table, null, 1) + ';\n';
}

// the compatibility file: every Plenix icon (map.json), written into platform/dist/ by build-app.js; check: compare only
function buildCompat(root, opts = {}) {
  const modules = layout.plenixEntries(root).map((e) => layout.moduleObject('plenix', e));
  const text = fileText('plenix', modules, layout.SOURCE.plenix + ': every Plenix icon');
  const file = path.join(root, COMPAT), now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  const stale = now === text ? [] : [COMPAT];
  if (!opts.check && stale.length) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); }
  return { file: COMPAT, icons: modules.length, bytes: Buffer.byteLength(text), stale, changed: !!stale.length };
}

module.exports = { collect, siteFile, catalogData, packageCatalog, buildCompat, buildPages, markupOf, PAGES, LOGIN, fileText, inlineScripts, COMPAT, HEADER };

if (require.main === module) {
  const args = process.argv.slice(2), flags = new Set(args.filter((a) => a === '--allow-unknown'));
  const outAt = args.indexOf('--out'), out = outAt >= 0 ? args[outAt + 1] : '.';
  const rest = args.filter((a, i) => a !== '--allow-unknown' && i !== outAt && i !== outAt + 1);
  const [site, ...inputs] = rest;
  if (!site || !/^[a-z0-9][a-z0-9-]*$/.test(site) || !inputs.length) {
    console.error('usage: ' + COMMAND + ' <site> <folder or file> […] [--out <folder>] [--allow-unknown]\n  <site>: lowercase letters, digits and dashes');
    process.exit(2);
  }
  if (site === 'plenix') { console.error('"plenix" is the compatibility file\'s name (every Plenix icon; node build-app.js writes it): choose your site\'s own name'); process.exit(2); }
  for (const i of inputs) if (!fs.existsSync(i)) { console.error('not found: ' + i); process.exit(2); }
  const r = siteFile(PACKAGED ? packageCatalog() : ROOT, site, inputs, process.cwd());
  for (const u of r.unreadable) console.error('cannot read ' + u);
  for (const u of r.unknown) console.error('unknown icon name: ' + u);
  if (PACKAGED && r.unknown.length) console.error('The package knows every Plenix icon and the Material symbols in its svg/ folder; another Material Symbols name needs a Plenix checkout (node tools/icons/site-icons.js)');
  for (const u of r.unresolved) console.error('name built at run time: ' + u + ' (list its names in a /* plx-icons: … */ comment on its line)');
  if (r.unreadable.length) process.exit(2);
  if ((r.unknown.length || r.unresolved.length) && !flags.has('--allow-unknown')) {
    console.error('Nothing written: ' + r.unknown.length + ' unknown and ' + r.unresolved.length + ' run-time name' + (r.unresolved.length === 1 ? '' : 's') + ' (fix them, or pass --allow-unknown to write the file without them)');
    process.exit(1);
  }
  const file = path.join(out, 'plenix-icons-' + site + '.js');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(file, r.text);
  console.log('Wrote ' + file + ': ' + r.icons + ' icon' + (r.icons === 1 ? '' : 's') + ' (' + Math.round(Buffer.byteLength(r.text) / 1024) + ' KB)' +
    (r.unknown.length || r.unresolved.length ? '; left out ' + r.unknown.length + ' unknown and ' + r.unresolved.length + ' run-time' : ''));
}
