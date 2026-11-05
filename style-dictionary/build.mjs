// Plenix · the token build (slice 101, #372 steps 5 to 10; docs/adr/0003): Style Dictionary writes every token value, and
// packages/tokens/sd/assemble.cjs puts them into the four stylesheets (the sets in build.json order, the themes, the
// comments, the cross-set --plx-ctx-* block, the condition blocks). It replaced build-tokens.js.
// One Style Dictionary run per context group, because one run keeps only one value per token name and the sets of a
// stylesheet reuse names: the base sets, each density, each interaction mode, each theme's light and dark, and each
// condition (forced colors, more contrast, print, reduced motion) per base context. The group of a file is its context, the
// part between its name and ".tokens.json". The native sets (platform-*.tokens.json) are build-mobile.js's (#872). Each run
// uses Style Dictionary's built-in css/variables format (outputReferences on), into the ignored build/sd/sets/.
//   node style-dictionary/build.mjs              write the stylesheets, then the token index and the native files
//   node style-dictionary/build.mjs --no-index   the stylesheets only (build-app.js writes the index after its other steps)
//   node style-dictionary/build.mjs --stale      write nothing; print the stylesheets that differ as JSON ({ stale: […] })
//                                                and exit 1 when any does (check-system, rule generated)
//   node style-dictionary/build.mjs --sets       every token of every set: Style Dictionary's value is the JSON's own (as CSS)
//   node style-dictionary/build.mjs --bytes      the stylesheets with Style Dictionary's values equal the ones with the JSON's
//                                                own values, byte for byte (npm run tokens:sd:check runs --sets and --bytes)
// With --json the write modes print { files, count, stale } as one JSON line (build-app.js reads it).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import StyleDictionary from 'style-dictionary';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TOK = 'platform/tokens';
const OUT = 'build/sd/sets/';
const TRANSFORMS = ['name/kebab', 'size/rem', 'time/seconds', 'color/css', 'fontFamily/css', 'cubicBezier/css'];
const CONDITION = /\.(forced-colors|more-contrast|print|reduced-motion)\.tokens\.json$/;

// every token file of the web, by group
// the group of a token file: its context, the part between its name and ".tokens.json"
const groupOfFile = (f) => { const m = path.basename(f).match(/^[^.]+\.(.+)\.tokens\.json$/); return !m ? 'base' : m[1].replace(/^theme-default\./, ''); };
function groups(withConditions = false) {
  const out = {};
  const walk = (dir) => {
    for (const n of fs.readdirSync(path.join(ROOT, dir)).sort()) {
      const rel = dir + '/' + n;
      if (fs.statSync(path.join(ROOT, rel)).isDirectory()) { walk(rel); continue; }
      if (!/\.tokens\.json$/.test(n) || /^platform-/.test(n)) continue;
      const c = n.match(CONDITION);
      if (c) { if (withConditions) { const base = rel.replace(CONDITION, '.tokens.json'); const g = c[1] + ':' + groupOfFile(base); (out[g] = out[g] || []).push(rel); } continue; }
      const g = groupOfFile(rel);
      (out[g] = out[g] || []).push(rel);
    }
  };
  walk(TOK);
  return out;
}

// one group's tokens as Style Dictionary writes them: Map(name -> { value, file })
async function run(group, files, base) {
  // references resolve against the base sets, the default context (standard density, default interaction) and the
  // default light theme: a component token may point to a density, interaction or theme role
  const all = groups(), defaults = [].concat(all['density-standard'] || [], all['interaction-default'] || []);
  const ctx = group.includes(':') ? group.split(':')[1] : group;
  const include = (ctx === 'base' ? [] : base).concat(ctx === 'base' && group !== ctx ? base : [], ctx === 'light' || ctx === 'dark' ? all[ctx] : all.light, /^(density|interaction)-/.test(ctx) ? all[ctx] : defaults).filter((f) => !files.includes(f));
  const sd = new StyleDictionary({
    source: files, include,
    log: { verbosity: 'silent', warnings: 'disabled', errors: { brokenReferences: 'console' } },
    platforms: { css: { transforms: TRANSFORMS, buildPath: OUT, files: [{ destination: group.replace(':', '.') + '.css', format: 'css/variables', filter: (t) => t.isSource, options: { selector: ':root', outputReferences: true } }] } },
  });
  await sd.buildPlatform('css');
  const text = fs.readFileSync(path.join(ROOT, OUT, group.replace(':', '.') + '.css'), 'utf8');
  const tokens = await sd.getPlatformTokens('css');
  const fileOf = new Map(tokens.allTokens.filter((t) => t.isSource).map((t) => ['--' + t.name, t.filePath]));
  const out = new Map();
  for (const m of text.matchAll(/^\s*(--[a-z0-9-]+):\s*(.*?);(?:\s*\/\*[\s\S]*?\*\/)?\s*$/gm)) out.set(m[1], { value: m[2], file: fileOf.get(m[1]) });
  return out;
}

async function main() {
  process.chdir(ROOT);
  const bytes = process.argv.includes('--bytes');
  const all = groups(!process.argv.includes('--sets')), written = {};
  for (const [g, files] of Object.entries(all)) written[g] = await run(g, files, all.base);
  if (bytes) return byteGate(written);
  if (process.argv.includes('--sets') || bytes) console.log('Style Dictionary sets: ' + Object.entries(written).map(([g, m]) => g + ' ' + m.size).join(', '));
  if (!process.argv.includes('--sets')) return writeSheets(written);
  const sets = createRequire(import.meta.url)('../packages/tokens/sd/assemble.cjs').sets(ROOT);
  const groupOf = (set) => { const m = path.basename(set).match(/^[^.]+\.(.+)\.tokens\.json$/); return !m ? 'base' : m[1].replace(/^theme-default\./, ''); };
  const problems = [];
  let count = 0;
  for (const s of sets) {
    const sd = written[groupOf(s.set)], file = TOK + '/' + s.set;
    for (const t of s.tokens) {
      count++;
      const w = sd && sd.get(t.name);
      if (!w) problems.push(s.set + ': ' + t.name + ' is not written by Style Dictionary');
      else if (w.value !== t.value) problems.push(s.set + ': ' + t.name + ' is ' + t.value + ' today, Style Dictionary writes ' + w.value);
      else if (w.file !== file) problems.push(s.set + ': ' + t.name + ' comes from ' + w.file + ' in Style Dictionary');
    }
  }
  problems.forEach((p) => console.log('    ' + p));
  console.log(problems.length ? 'SD_SETS_DIFFER (' + problems.length + ' of ' + count + ' tokens)' : 'SD_SETS_SAME (' + count + ' tokens in ' + sets.length + ' sets)');
  process.exitCode = problems.length ? 1 : 0;
}
// the byte gate (slice 101, task 6): the stylesheets written with Style Dictionary's values (base and
// conditions); every byte must be the one it writes with its own values
const KEY = { forcedColors: 'forced-colors', contrastMore: 'more-contrast', print: 'print', reducedMotion: 'reduced-motion' };
// Style Dictionary's value of a declaration: the set's own token, or its value under a condition (from the condition set)
function sdValue(written, missing) {
  return (set, name, raw, key) => {
    const file = TOK + '/' + set, g = (key ? KEY[key] + ':' : '') + groupOfFile(file), w = written[g] && written[g].get(name);
    const want = key ? file.replace(/\.tokens\.json$/, '.' + KEY[key] + '.tokens.json') : file;
    if (!w || w.file !== want) { missing.push(set + ' ' + name + (key ? ' (' + KEY[key] + ')' : '')); return 'MISSING'; }
    return w.value;
  };
}
// write (or, with --stale, only compare) the stylesheets with Style Dictionary's values
function writeSheets(written) {
  const asm = createRequire(import.meta.url)('../packages/tokens/sd/assemble.cjs'), missing = [];
  const stale = process.argv.includes('--stale');
  const r = asm(ROOT, { check: stale, index: !process.argv.includes('--no-index'), value: sdValue(written, missing) });
  if (missing.length) { missing.slice(0, 20).forEach((m) => console.error('  missing from Style Dictionary: ' + m)); throw new Error(missing.length + ' token values are missing from Style Dictionary'); }
  if (stale) { console.log(JSON.stringify({ stale: r.stale })); process.exitCode = r.stale.length ? 1 : 0; return; }
  if (process.argv.includes('--json')) console.log(JSON.stringify({ files: r.files, count: r.count, stale: r.stale }));
  else console.log('Built ' + r.files.length + ' token stylesheets with Style Dictionary (' + r.count + ' tokens' + (r.stale.length ? ', ' + r.stale.length + ' changed' : ', unchanged') + ')');
}
// the regression gate: the stylesheets with Style Dictionary's values equal the ones with the JSON's own, byte for byte
function byteGate(written) {
  const asm = createRequire(import.meta.url)('../packages/tokens/sd/assemble.cjs');
  const missing = [];
  const sd = asm.generateWith(sdValue(written, missing), ROOT), own = asm.generateWith(asm.JSON_VALUE, ROOT), diffs = [];
  for (const [file, text] of Object.entries(own)) {
    if (sd[file] === text) { console.log('  same  ' + file + ' (' + text.length + ' bytes)'); continue; }
    const a = text.split('\n'), b = sd[file].split('\n');
    const lines = []; for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) lines.push((i + 1) + ': ' + a[i] + '  |  ' + b[i]);
    diffs.push(file); console.log('    DIFF ' + file + ' (' + lines.length + ' lines)'); lines.slice(0, 8).forEach((l) => console.log('        ' + l));
  }
  missing.slice(0, 10).forEach((m) => console.log('    missing from Style Dictionary: ' + m));
  console.log(diffs.length || missing.length ? 'SD_BYTES_DIFFER (' + diffs.length + ' sheets, ' + missing.length + ' values missing)' : 'SD_BYTES_SAME (' + Object.keys(own).length + ' sheets)');
  process.exitCode = diffs.length || missing.length ? 1 : 0;
}
main().catch((e) => { console.error(e.message || e); process.exitCode = 1; });
