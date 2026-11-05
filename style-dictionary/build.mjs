// Plenix · Style Dictionary, every token set (slice 101, #101, #372 steps 5 to 7; docs/adr/0003).
// One Style Dictionary run per context group, because one run keeps only one value per token name and the sets of a
// stylesheet reuse names: the base sets, each density, each interaction mode, and each theme's light and dark. The group of a
// file is its context, the part between its name and ".tokens.json" (semantic.density-compact.tokens.json -> density-compact;
// theme-default.dark.tokens.json -> dark; none -> base). Condition sets (forced colors, more contrast, print, reduced
// motion) and the native sets (platform-*.tokens.json) are other configs. Each run writes the group's own tokens with
// Style Dictionary's built-in css/variables format (outputReferences on), into the ignored build/sd/sets/<group>.css.
//   node style-dictionary/build.mjs           write build/sd/sets/*.css
//   node style-dictionary/build.mjs --check   also compare: every token of every set (build-tokens.js's model, until step 10
//                                             retires it) must be written by Style Dictionary with the same value, from
//                                             the same file. Exits with 1 and lists each difference.
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
function groups() {
  const out = {};
  const walk = (dir) => {
    for (const n of fs.readdirSync(path.join(ROOT, dir)).sort()) {
      const rel = dir + '/' + n;
      if (fs.statSync(path.join(ROOT, rel)).isDirectory()) { walk(rel); continue; }
      if (!/\.tokens\.json$/.test(n) || CONDITION.test(n) || /^platform-/.test(n)) continue;
      const m = n.match(/^[^.]+\.(.+)\.tokens\.json$/);
      const g = !m ? 'base' : m[1].replace(/^theme-default\./, '');
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
  const include = (group === 'base' ? [] : base).concat(group === 'light' || group === 'dark' ? [] : all.light, /^(density|interaction)-/.test(group) ? [] : defaults).filter((f) => !files.includes(f));
  const sd = new StyleDictionary({
    source: files, include,
    log: { verbosity: 'silent', warnings: 'disabled', errors: { brokenReferences: 'console' } },
    platforms: { css: { transforms: TRANSFORMS, buildPath: OUT, files: [{ destination: group + '.css', format: 'css/variables', filter: (t) => t.isSource, options: { selector: ':root', outputReferences: true } }] } },
  });
  await sd.buildPlatform('css');
  const text = fs.readFileSync(path.join(ROOT, OUT, group + '.css'), 'utf8');
  const tokens = await sd.getPlatformTokens('css');
  const fileOf = new Map(tokens.allTokens.filter((t) => t.isSource).map((t) => ['--' + t.name, t.filePath]));
  const out = new Map();
  for (const m of text.matchAll(/^\s*(--[a-z0-9-]+):\s*(.*?);(?:\s*\/\*[\s\S]*?\*\/)?\s*$/gm)) out.set(m[1], { value: m[2], file: fileOf.get(m[1]) });
  return out;
}

async function main() {
  process.chdir(ROOT);
  const all = groups(), written = {};
  for (const [g, files] of Object.entries(all)) written[g] = await run(g, files, all.base);
  console.log('Style Dictionary sets: ' + Object.entries(written).map(([g, m]) => g + ' ' + m.size).join(', '));
  if (!process.argv.includes('--check')) return;
  const sets = createRequire(import.meta.url)('../build-tokens.js').sets(ROOT);
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
  problems.forEach((p) => console.log('  ' + p));
  console.log(problems.length ? 'SD_SETS_DIFFER (' + problems.length + ' of ' + count + ' tokens)' : 'SD_SETS_SAME (' + count + ' tokens in ' + sets.length + ' sets)');
  process.exitCode = problems.length ? 1 : 0;
}
main();
