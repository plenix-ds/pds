// The Platform bundle (#709, Vite step 2): platform/index.js -> platform/dist/platform.js, one classic script that
// publishes the exports of platform/index.js on window.Plenix. node build-app.js runs it (write: false) after the
// pre-steps (tokens, icons, the library block of index.js) and writes the file only when every bundle compiled and
// passed its checks. Run alone (npx vite build --config vite.platform.config.mjs), it writes into the ignored build/vite/.
//
// What it keeps from the old bundler of build-app.js (Babel and a module table; retired in #709 step 6):
//   - react, react-dom and react-dom/client are the React and ReactDOM globals the page loads from platform/vendor/
//   - the classic JSX runtime (React.createElement): the vendored UMD React has no jsx-runtime
//   - process.env.NODE_ENV is 'production' in the bundled packages (@tanstack)
//   - icon modules (plenix-platform/icons/<set>/<name>) resolve to platform/dist/icons/<set>/<name>.js, written by
//     build-icons.js (a pre-step of build-app.js); a Material one is written on demand
//   - the GENERATED FILE banner, no minifying
//   - the friendly error when React or ReactDOM is missing: the guard after the banner throws the old bundle's
//     words (Plenix: "react" is not loaded before this script) before the bundle reads either global
//   - window.Plenix is a plain frozen object: Object.freeze(Object.assign({}, the exports))
//   - the public-API check: every name exported by platform/index.js is defined on window.Plenix, once, and nothing else is
// The source map is hidden (no sourceMappingURL in the bundle): build-app.js writes it to the ignored build/vite/, and
// check-bundle.js traces each finding back to its source file through it.
import path from 'node:path';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ENTRY = path.join(ROOT, 'platform', 'index.js');
// PLENIX_GLOBAL=cdn (build-packages.js, issue 882): the CDN's plenix.js, without the built-in Arabic words. LocaleProvider's
// import of ../i18n/ar.js resolves to the empty catalog plenix-ar.js fills (tools/npm-esm/ar.js, as the npm ES modules do);
// it writes build/vite/cdn/plenix.js. Without it: platform/dist/platform.js, Arabic built in
const CDN = process.env.PLENIX_GLOBAL === 'cdn';
const GLOBALS = { 'react': 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM' };
const BANNER = '/*\n * GENERATED FILE — DO NOT EDIT\n * Source: platform/index.js and the modules it imports\n * Build: node build-app.js (Vite, vite.platform.config.mjs)\n */\n';
// the old bundle's error for a missing global, in its words; it runs before the bundle passes React and ReactDOM in
const GUARD = Object.entries({ 'react': 'React', 'react-dom': 'ReactDOM' })
  .map(([spec, name]) => 'if (!window.' + name + ') throw new Error(\'Plenix: "' + spec + '" is not loaded before this script\');\n').join('');
// the frozen global, then the version check (#842): the released plenix.css carries its release as --plx-version; when it
// names another release than this script, the page mixes two releases, and the console says so once (after the page loads,
// so the stylesheet has applied). The source stylesheet has no stamp: no check
const FOOTER = 'window.Plenix = Object.freeze(Object.assign({}, Plenix));\n'
  + '(function () {\n'
  + '  function check() {\n'
  + '    var css = getComputedStyle(document.documentElement).getPropertyValue(\'--plx-version\').trim().replace(/^["\']|["\']$/g, \'\');\n'
  + '    if (css && css !== window.Plenix.version) console.warn(\'Plenix: the script and the stylesheet come from different releases (script \' + window.Plenix.version + \', styles \' + css + \'). Load every Plenix file from the same release folder.\');\n'
  + '  }\n'
  + '  if (typeof window.addEventListener !== \'function\') return;\n'
  + '  if (document.readyState === \'complete\') check(); else window.addEventListener(\'load\', check, { once: true });\n'
  + '})();\n';
const ICON = /^plenix-platform\/icons\/(plenix|material)\/([a-z0-9-]+|[a-z0-9]+(?:_[a-z0-9]+)+)$/;

// plenix-platform/icons/<set>/<name>: the asset layout's icon modules, bundled like a source file (#282); the applications'
// config (vite.apps.config.mjs) uses the same plugin
export const plenixIcons = {
  name: 'plenix-icons',
  enforce: 'pre',
  resolveId(spec, importer) {
    const icon = ICON.exec(spec);
    if (!icon) return null;
    if (icon[1] === 'material' && icon[2].includes('_')) this.error('Material icons are imported by their dashed name: ' + spec.replace(/_/g, '-') + ' (' + importer + ')');
    const dir = path.join(ROOT, 'platform', 'dist', 'icons', icon[1]);
    const file = icon[1] === 'material' ? require('./platform/icons/layout.js').writeMaterialModule(ROOT, icon[2], dir) : path.join(dir, icon[2] + '.js');
    if (!fs.existsSync(file)) this.error('No icon named ' + icon[2] + ' in the ' + icon[1] + ' set (' + importer + '); run node build-app.js');
    return file;
  },
};

// the Platform's public API: names exported by index.js, each defined once and defined for real, and no other name
function checkPublicApi(text) {
  const names = [];
  for (const m of fs.readFileSync(ENTRY, 'utf8').matchAll(/export\s*\{([^}]*)\}/g)) m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => names.push(n));
  const dup = names.filter((n, i) => names.indexOf(n) !== i);
  if (dup.length) throw new Error('Platform: duplicate public export ' + dup.join(', '));
  const sandbox = { console, document: { documentElement: { getAttribute: () => null } } };
  sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const f of ['react.development.js', 'react-dom.development.js']) {
    const p = path.join(ROOT, 'platform', 'vendor', f);
    if (!fs.existsSync(p)) throw new Error('Missing vendored runtime platform/vendor/' + f);
    vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f });
  }
  vm.runInContext(text, sandbox, { filename: 'platform.js' });
  const api = sandbox.Plenix || {};
  if (!Object.isFrozen(api)) throw new Error('Platform: window.Plenix is not frozen');
  const missing = names.filter((n) => typeof api[n] === 'undefined');
  if (missing.length) throw new Error('Platform: public export(s) missing or undefined: ' + missing.join(', '));
  const extra = Object.keys(api).filter((k) => names.indexOf(k) < 0);
  if (extra.length) throw new Error('Platform: unexpected public names: ' + extra.join(', '));
  return names;
}

// last: the banner and the guard (Vite's own final pass drops rollup's output.banner from an iife library), the frozen global, the
// source map shifted by the banner's lines, then the public-API check. A failure stops the build before anything is written.
const finish = {
  name: 'plenix-finish',
  enforce: 'post',
  generateBundle(options, bundle) {
    const head = BANNER + GUARD;
    const shift = ';'.repeat(head.split('\n').length - 1);
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== 'chunk') continue;
      chunk.code = head + chunk.code + (chunk.code.endsWith('\n') ? '' : '\n') + FOOTER;
      if (chunk.map) {
        chunk.map.mappings = shift + chunk.map.mappings;
        const asset = bundle[chunk.fileName + '.map'];
        if (asset) asset.source = chunk.map.toString();
      }
      try { chunk.publicApi = checkPublicApi(chunk.code); } catch (e) { this.error(e.message); }
    }
  },
};

export default defineConfig({
  root: ROOT,
  publicDir: false,
  logLevel: 'warn',
  plugins: [plenixIcons, finish],
  resolve: CDN ? { alias: [{ find: /^\.\.\/i18n\/ar\.js$/, replacement: path.join(ROOT, 'tools', 'npm-esm', 'ar.js') }] } : {},
  define: { 'process.env.NODE_ENV': JSON.stringify('production'), __PLENIX_VERSION__: JSON.stringify(require('./package.json').version) },
  esbuild: { include: /\.[cm]?[jt]sx?$/, exclude: [], charset: 'ascii', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },   // charset ascii: no non-ASCII byte in the output (a page loaded without a charset still runs)
  build: {
    outDir: path.join(ROOT, 'build', 'vite', CDN ? 'cdn' : ''),
    emptyOutDir: false,
    minify: false,
    sourcemap: 'hidden',
    target: 'es2020',
    reportCompressedSize: false,
    lib: { entry: ENTRY, formats: ['iife'], name: 'Plenix', fileName: () => (CDN ? 'plenix.js' : 'platform.js') },
    rollupOptions: {
      external: Object.keys(GLOBALS),
      output: { globals: GLOBALS },
    },
  },
});
