// Code per screen (ADR 0052, #1208, owner rule 2, D-0160): one ES module entry per public export, on npm and on the CDN.
// build-packages.js calls it after the Vite builds, the TypeScript definitions and the CDN copies. Generated; never edit
// what it writes.
//   npm  release/packages/react/dist/parts/<Export>.js   export { <Export> } from '../<module>.js'
//        release/packages/react/parts/<Export>.d.ts      its declaration, from the same types module as index.d.ts
//        package.json "./*" maps @plenix-ds/react/<Export> to both (build-packages.js)
//   CDN  release/cdn/<v>/esm/                            the npm ES modules (index.js, the modules, chunks/), plus
//        esm/<Export>.js                                  one entry per export, the same re-export
//        esm/manifest.json                                { version, entries: { <Export>: { file, imports } } }: each
//                                                         entry's static import closure, for <link rel="modulepreload">
//        esm/icons/plenix.js                              the Plenix icon set as a module (#1209), beside esm/registerIcons.js
//        vendor/react.esm.js and the others               React as ES modules over the vendored React on the page
//                                                         (window.React, window.ReactDOM: one copy of React per page)
//        plenix-loader.js                                 Plenix.load(names) for pages without a bundler
// An entry whose name is also its module's path (version: platform/version.ts) is that module itself.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const mk = (d) => fs.mkdirSync(d, { recursive: true });
const write = (f, s) => { mk(path.dirname(f)); fs.writeFileSync(f, s); };

// the public exports of platform/index.ts: { name, local, mod } (mod: the module path under platform/, no extension)
function exportsOf(indexTs) {
  const out = [];
  for (const m of fs.readFileSync(indexTs, 'utf8').matchAll(/export \{([^}]+)\} from '\.\/([^']+)'/g)) {
    for (const part of m[1].split(',').map((x) => x.trim()).filter(Boolean)) {
      const r = /^(\w+)\s+as\s+(\w+)$/.exec(part);
      out.push({ name: r ? r[2] : part, local: r ? r[1] : part, mod: m[2].replace(/\.[jt]sx?$/, '') });
    }
  }
  return out;
}

const reexport = (e, rel) => 'export { ' + (e.local === e.name ? e.name : e.local + ' as ' + e.name) + ' } from \'' + rel + e.mod + '.js\';\n';

// each name's types module in index.d.ts ("./types/components/Badge/Badge.js")
function typesOf(indexDts) {
  const map = new Map();
  for (const m of fs.readFileSync(indexDts, 'utf8').matchAll(/export \{([^}]+)\} from "([^"]+)"/g)) {
    for (const part of m[1].split(',').map((x) => x.trim()).filter(Boolean)) map.set(part.replace(/^\w+\s+as\s+/, ''), { spec: part, from: m[2] });
  }
  return map;
}

// the relative static imports of an ES module (import … from, export … from, import '…'); dynamic import() is on demand
function staticImports(code) {
  const out = [];
  for (const m of code.matchAll(/(?:^|[;\n}])\s*(?:import|export)\s*(?:[\w$*{}\s,]+?\s*from\s*)?["']([^"']+)["']/g)) if (m[1].startsWith('.')) out.push(m[1]);
  return out;
}

// every file an entry loads before it runs, itself first (paths relative to esm/)
function closure(esmDir, file, cache) {
  const seen = new Set();
  const visit = (rel) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    let code = cache.get(rel);
    if (code === undefined) { code = fs.readFileSync(path.join(esmDir, rel), 'utf8'); cache.set(rel, code); }
    for (const spec of staticImports(code)) visit(path.posix.normalize(path.posix.join(path.posix.dirname(rel), spec)));
  };
  visit(file);
  return [...seen];
}

// the export names of a vendored UMD React file, read by running it as CommonJS (no page, no network)
function umdKeys(file, deps = {}) {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { module, exports: module.exports, require: (n) => deps[n], console, setTimeout, clearTimeout, MessageChannel: undefined, window: undefined, self: undefined });
  return module.exports;
}

function reactShims(vendorDir, outDir, version) {
  const react = umdKeys(path.join(vendorDir, 'react.production.min.js'));
  const dom = umdKeys(path.join(vendorDir, 'react-dom.production.min.js'), { react });
  const ok = (k) => /^[A-Za-z_$][\w$]*$/.test(k) && k !== 'default';
  const head = (what, global, file) => '/* Plenix ' + version + ' · ' + what + ' as an ES module over window.' + global + ' (the vendored ' + file + ' on the page; ADR 0052, generated) */\n'
    + 'const M = globalThis.' + global + ';\nif (!M) throw new Error(\'Plenix: load vendor/' + file + ' before plenix-loader.js\');\n';
  const named = (keys) => 'export default M;\nexport const { ' + keys.filter(ok).join(', ') + ' } = M;\n';
  write(path.join(outDir, 'react.esm.js'), head('react', 'React', 'react.production.min.js') + named(Object.keys(react)));
  write(path.join(outDir, 'react-dom.esm.js'), head('react-dom', 'ReactDOM', 'react-dom.production.min.js') + named(Object.keys(dom)));
  write(path.join(outDir, 'react-dom-client.esm.js'), head('react-dom/client', 'ReactDOM', 'react-dom.production.min.js')
    + 'export const { createRoot, hydrateRoot } = M;\nexport default { createRoot, hydrateRoot };\n');
  // the automatic JSX runtime through createElement: children stay in props, the key goes beside them
  write(path.join(outDir, 'react-jsx-runtime.esm.js'), head('react/jsx-runtime', 'React', 'react.production.min.js')
    + 'export const Fragment = M.Fragment;\n'
    + 'export function jsx(type, props, key) { return M.createElement(type, key === undefined ? props : Object.assign({}, props, { key: key })); }\n'
    + 'export const jsxs = jsx;\nexport default { Fragment, jsx, jsxs };\n');
}

module.exports = function esmParts({ ROOT, P, R, CDN, VERSION }) {
  const list = exportsOf(path.join(P, 'index.ts'));
  const dist = path.join(R, 'dist');
  const types = typesOf(path.join(R, 'index.d.ts'));
  for (const e of list) {
    if (!fs.existsSync(path.join(dist, e.mod + '.js'))) throw new Error('esm-parts: ' + e.name + ': dist/' + e.mod + '.js is missing (vite.packages.config.mjs, esm build)');
    write(path.join(dist, 'parts', e.name + '.js'), reexport(e, '../'));
    const t = types.get(e.name);
    if (!t) throw new Error('esm-parts: ' + e.name + ' is not in index.d.ts (tools/publish/react-types.js)');
    const from = t.from.replace(/^\.\//, '../');
    write(path.join(R, 'parts', e.name + '.d.ts'), 'export { ' + t.spec + ' } from "' + from + '";\nexport type * from "' + from + '";\n');
  }

  // the CDN: the npm ES modules under esm/ (not the CommonJS, the global, the engines or their vendor folder)
  const ESM = path.join(CDN, 'esm');
  const skip = new Set(['index.cjs', 'plenix.global.js', 'plenix-engines.js', 'vendor', 'parts']);
  for (const n of fs.readdirSync(dist)) if (!skip.has(n)) fs.cpSync(path.join(dist, n), path.join(ESM, n), { recursive: true });
  for (const e of list) if (e.mod !== e.name) write(path.join(ESM, e.name + '.js'), reexport(e, './'));
  const icons = path.join(P, 'dist', 'plenix-icons-plenix.esm.js');
  if (!fs.existsSync(icons)) throw new Error('esm-parts: platform/dist/plenix-icons-plenix.esm.js is missing: run node build-app.js (#1209)');
  write(path.join(ESM, 'icons', 'plenix.js'), fs.readFileSync(icons, 'utf8'));

  const cache = new Map();
  const entries = {};
  for (const e of list.slice().sort((a, b) => a.name.localeCompare(b.name))) {
    const file = e.name + '.js';
    entries[e.name] = { file, imports: closure(ESM, file, cache).slice(1) };
  }
  write(path.join(ESM, 'manifest.json'), JSON.stringify({ version: VERSION, entries }, null, 1) + '\n');

  reactShims(path.join(P, 'vendor'), path.join(CDN, 'vendor'), VERSION);
  write(path.join(CDN, 'plenix-loader.js'), fs.readFileSync(path.join(P, 'loader', 'plenix-loader.js'), 'utf8').replace(/__PLENIX_VERSION__/g, VERSION));
  return { count: list.length };
};
module.exports.exportsOf = exportsOf;
module.exports.staticImports = staticImports;
module.exports.closure = closure;
