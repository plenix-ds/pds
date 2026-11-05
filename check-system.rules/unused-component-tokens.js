// Plenix · check-system rule "unused-component-tokens" (#254): a component token (--plx-comp-*) that is defined in the token
// source (platform/tokens/**/*.tokens.json) and that nothing reads fails. A component token exists to be read by its
// component's stylesheet, so a token nothing reads is dead weight that still ships to the CDN and the API.
// A token counts as read when:
//   - its full name appears in the source: a stylesheet, script, page, the standards (platform/standards), the native
//     mappings (platform/tokens/platform-*.tokens.json, platform/mobile) of the Platform, the suite, the asset manager,
//     the services or an application folder (the token files themselves, the generated stylesheets, the bundles,
//     the design-system spec, tests, docs and tools/agent do not count);
//   - another component token's value refers to it ("{plx-comp.name}") and that token is read;
//   - it belongs to a family JavaScript builds the name of at run time (DYNAMIC below).
// A token read by some other means is listed in ALLOWED with the reason. A $deprecated token (a rename's old name, kept
// as an alias for readers outside Plenix until 2.0.0, docs/adr/0012) is not checked.
// The rule is a module check-style.js runs (a style rule: check-common.js, STYLE_MODULES): require('./check-system.rules/unused-component-tokens.js').check({ add })
// Alone: node check-system.rules/unused-component-tokens.js   -> UNUSED_COMPONENT_TOKENS_OK, or the tokens and exit 1
const fs = require('fs');
const path = require('path');
const { CONDITION_FILE } = require('./token-sets.js');

const NAME = 'unused-component-tokens';
const ROOT = path.join(__dirname, '..');
const TOKENS = path.join(ROOT, 'platform', 'tokens');
// name prefixes (after --plx-comp-) whose full names JavaScript builds: Resizable's limits, Icon's glyphs, SecondaryPane's widths
const DYNAMIC = [/^resizable-/, /^icon-glyph-/, /^secondary-pane-width-/];
// token name (after --plx-comp-) -> why it counts as read
const ALLOWED = {
  'button-height-4xl': 'named with -3xl in platform/system/interaction.css ("--plx-comp-button-height-3xl / -4xl")',
};
const SKIP_DIRS = /^(node_modules|\.git|Archived|dist|vendor|release|\.claude|tests|docs|design-system|agent)$/;
const SKIP_FILES = /(^|[\\/])(tokens[\\/](components|semantic|reference)\.css|tokens\.index\.json|app\.js|assets\.js|CHANGELOG\.md)$/;
const SOURCE = /\.(css|js|jsx|ts|tsx|mjs|cjs|html|json|md|swift|kt|dart)$/;

const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const walk = (d, out) => { if (!fs.existsSync(d)) return out; for (const e of fs.readdirSync(d, { withFileTypes: true })) {
  const p = path.join(d, e.name);
  if (e.isDirectory()) { if (!SKIP_DIRS.test(e.name)) walk(p, out); } else if (SOURCE.test(e.name)) out.push(p);
} return out; };

// the component tokens the source defines: name -> { file, refs: component tokens its value refers to }
function defined() {
  const out = {};
  for (const f of walk(TOKENS, [])) {
    // a condition set (#372 step 4) defines no token: its tokens are defined in the base set beside it
    if (!/\.tokens\.json$/.test(f) || /platform-(ios|android)\.tokens\.json$/.test(f) || CONDITION_FILE.test(f)) continue;
    let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { continue; }
    const g = j['plx-comp']; if (!g) continue;
    for (const k of Object.keys(g)) {
      if (g[k] && g[k].$deprecated) continue;   // a renamed token's old name, kept for readers outside Plenix until 2.0.0 (docs/adr/0012)
      if (k.charAt(0) === '$') continue;
      const refs = [...String(JSON.stringify(g[k].$value)).matchAll(/\{plx-comp\.([a-z0-9-]+)\}/g)].map((m) => m[1]);
      (out[k] = out[k] || { file: rel(f), refs: [] }).refs.push(...refs);
    }
  }
  return out;
}

function check({ add }) {
  const defs = defined(); const names = Object.keys(defs);
  const read = new Set();
  const files = [];
  for (const d of ['platform', 'suite', 'dam', 'services', 'dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings']) walk(path.join(ROOT, d), files);
  for (const f of files) {
    const r = rel(f);
    if (SKIP_FILES.test(r) || /^platform\/tokens\/.*\.tokens\.json$/.test(r) && !/platform-(ios|android)\.tokens\.json$/.test(r)) continue;
    let text; try { text = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    if (text.indexOf('plx-comp-') < 0) continue;
    if (/^\/\*\s*GENERATED/.test(text.slice(0, 200)) || /GENERATED FILE/.test(text.slice(0, 200))) continue;
    for (const m of text.matchAll(/plx-comp-([a-z0-9-]*[a-z0-9])/g)) read.add(m[1]);
  }
  for (const n of Object.keys(ALLOWED)) read.add(n);
  for (const n of names) if (DYNAMIC.some((re) => re.test(n))) read.add(n);
  // a token another read token refers to is read
  let grew = true;
  while (grew) { grew = false; for (const n of names) if (read.has(n)) for (const r of defs[n].refs) if (!read.has(r)) { read.add(r); grew = true; } }
  for (const n of names.sort()) if (!read.has(n)) add(NAME, path.join(ROOT, defs[n].file), 0, '--plx-comp-' + n + ' is defined and nothing reads it: remove it from the token JSON (or read it where it was meant)');
}

module.exports = { check };

if (require.main === module) {
  const out = [];
  check({ add: (rule, file, line, text) => out.push(rel(file) + '  ' + text) });
  out.forEach((l) => console.log('  ' + l));
  console.log(out.length ? 'UNUSED_COMPONENT_TOKENS_FAIL (' + out.length + ')' : 'UNUSED_COMPONENT_TOKENS_OK');
  process.exit(out.length ? 1 : 0);
}
