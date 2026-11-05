#!/usr/bin/env node
// Plenix · the baseline scan (issue 273, owner: apps follow the newest Plenix once they match the baseline).
//   node tools/baseline/scan.js <app folder> --app <name> [--pin <version>] (--out <folder> | --json)
// One of --out or --json is required. --out must be a folder outside the app folder: the scan refuses (exit 2) to write
// its report into the app it reads.
// Reads one application's own source, never edits it, and lists every place that does not match Plenix's baseline:
//   changelog    each item of CHANGELOG.md's "Upgrading from …", "Removed", "Breaking" and "Changed (breaking)" sections
//                newer than the app's pinned version, with the places in the app that name what the item changed
//                (a part such as `Diagram`, a prop such as `accent`, a token, a class, a file such as `icons-all.css`)
//   icons        retired icon use: a bare `plx-icon plx-icon--<name>` class (no Icon component), `icons-all.css`,
//                the icon drawing settings `--plx-comp-icon-glyph-*` / `--plx-comp-icon-auto-*` (#557)
//   tokens       a `--plx-…` name the app uses that Plenix no longer has (platform/tokens/tokens.index.json)
//   own-css      styling of the app's own: the inline-style and use-of-color rules of @plenix-ds/lint (style attributes,
//                <style> blocks, written design values, a tone with no words), an app stylesheet, a raw color in it
//   patches      the app's CSS that targets a Plenix class (`.plx-…`): a patch over the Platform
//   pins         every CDN address with a version in it (the app's pin; the oldest one sets the changelog range)
// Output: the findings as JSON (stdout with --json, or <out>/baseline-<app>.json) and a plain-words page
// (<out>/baseline-<app>.md). Exit 0 always: it reports, it never blocks (a release never fails because of an app).
// The style rules come from @plenix-ds/lint when it is installed beside the app or here, else from the same rules in this
// repository (check-system.rules), so the scan and the published lint package never disagree. When the app has
// @plenix-ds/lint in its own node_modules, the scan runs that copy's code (the team's own package).
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'vendor', '.venv', 'venv', '__pycache__', 'coverage', '.next', 'release']);
const CODE = /\.(jsx?|mjs|cjs|tsx?|html?)$/i, CSS = /\.css$/i, PIN_ONLY = /\.(py|json|toml|ya?ml|md)$/i;
// a copy of Plenix inside an app is Plenix's, not the app's: never scanned
const PLENIX_COPY = /(^|[\\/])(plenix(\.min|\.esm|\.global)?\.(js|css)|platform\.(js|css)|plenix-icons-[\w-]+\.js|plenix-engines\.js|fonts\.css|theme-boot\.js)$/i;
const SECTIONS = /^###\s+(Upgrading from [\d.]+|Removed|Breaking|Changed \(breaking\))\s*$/i;

// ---------- reading ----------
function args(argv) {
  const o = { folder: null, app: null, pin: null, out: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--app') o.app = argv[++i]; else if (a === '--pin') o.pin = argv[++i]; else if (a === '--out') o.out = argv[++i];
    else if (a === '--json') o.json = true; else if (!o.folder) o.folder = a;
  }
  const usage = 'usage: node tools/baseline/scan.js <app folder> --app <name> [--pin <version>] (--out <folder outside the app> | --json)';
  if (!o.folder) { console.error(usage); process.exit(2); }
  if (!o.out && !o.json) { console.error('baseline scan: say where the report goes: --out <folder outside the app>, or --json for stdout\n' + usage); process.exit(2); }
  o.folder = path.resolve(o.folder); o.app = o.app || path.basename(o.folder);
  if (o.out) {
    o.out = path.resolve(o.out);
    const inside = path.relative(o.folder, o.out);
    if (!inside || (inside !== '..' && !inside.startsWith('..' + path.sep) && !path.isAbsolute(inside))) { console.error('baseline scan: --out ' + o.out + ' is inside the app folder ' + o.folder + '; the scan never writes into the app it reads. Choose a folder outside it.'); process.exit(2); }
  }
  return o;
}
function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) files(p, out); continue; }
    if ((CODE.test(e.name) || CSS.test(e.name) || PIN_ONLY.test(e.name)) && !PLENIX_COPY.test(p) && fs.statSync(p).size < 2e6) out.push(p);
  }
  return out;
}
const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); return 0; };

// the style rules: the published package when it is installed, else this repository's copy of the same rules
function lintRules(appFolder) {
  for (const from of [appFolder, ROOT]) {
    try { const lint = require(require.resolve('@plenix-ds/lint', { paths: [from] })); return { source: '@plenix-ds/lint', scan: (rule, text, file) => lint.scan(rule, text, file) }; } catch (e) { /* not installed there */ }
  }
  const rules = { 'inline-style': require(path.join(ROOT, 'check-system.rules', 'inline-style.js')), 'use-of-color': require(path.join(ROOT, 'check-system.rules', 'use-of-color.js')) };
  return { source: 'check-system.rules (the rules @plenix-ds/lint publishes)',
    scan: (rule, text, file) => rules[rule].scan(text, rule === 'inline-style' ? { html: /\.html?$/i.test(file) } : file).map((f) => ({ ...f, message: f.message || f.text })) };
}

// the changelog items an app on <pin> still has to go through: newest first, each with the terms it names
function changelogItems(pin) {
  const text = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8').split('\n');
  const items = []; let version = null, section = null, cur = null;
  const close = () => { if (cur) { items.push(cur); cur = null; } };
  for (const line of text) {
    const v = /^## \[([^\]]+)\]/.exec(line);
    if (v) { close(); version = v[1]; section = null; continue; }
    if (/^###\s/.test(line)) { close(); const s = SECTIONS.exec(line); section = s ? s[1] : null; continue; }
    if (!section || !version || version === 'Unreleased' || (pin && cmp(version, pin) <= 0)) continue;
    if (/^- /.test(line)) { close(); cur = { version, section, text: line.slice(2).trim() }; continue; }
    if (cur && /^\s+\S/.test(line)) { cur.text += ' ' + line.trim(); continue; }
    if (/^\S/.test(line) && !cur && line.trim()) items.push({ version, section, text: line.trim() });   // a sentence ("Nothing to change.")
  }
  close();
  // only an item that takes something away (removes, retires, renames, stops) points at code to change; an item that adds or
  // recommends something ("load plenix-engines.js") is listed to check by hand, never matched (a match there is compliance)
  return items.map((it) => Object.assign(it, { terms: takenAway(it) }));
}
// the names an item takes away, sentence by sentence: a sentence that removes, retires, renames or stops something (or any
// sentence of a Removed section); in a rename "`old` → `new`" only the old name counts
function takenAway(it) {
  const removed = /^Removed$/i.test(it.section), renames = /renam/i.test(it.text), out = [];
  for (const piece of it.text.split(/(?<=\.)\s+(?=[A-Z`])|\s+-\s+(?=`)/)) {
    const arrow = piece.indexOf('→');
    if (arrow >= 0 && renames) { out.push(...termsOf(piece.slice(0, arrow))); continue; }
    if (removed || TAKES_AWAY.test(piece)) out.push(...termsOf(arrow >= 0 ? piece.slice(0, arrow) : piece));
  }
  // a bare lowercase name (a prop: `accent`, `uniformPillWidths`) counts only where an upgrade step names it (Upgrading,
  // Breaking, Changed (breaking)): in a Removed note it is as often a word (`data`) as a prop
  const seen = new Set(); return out.filter((t) => !(removed && t.prop) && !seen.has(t.term) && seen.add(t.term));
}
const TAKES_AWAY = /\b(remov\w*|retir\w*|renam\w*|stop\w*|no longer|is gone|are gone|drop\w*|deprecat\w*|replace\w*|ignored)\b/i;
// the backticked names an item changed, as patterns to look for in an app's own code
function termsOf(text) {
  const out = [];
  for (const m of text.matchAll(/`([^`]+)`/g)) {
    const t = m[1].trim();
    if (/^(--plx-[a-z0-9-]+)(\*|-\*)?$/.test(t) || /^--plx-[a-z0-9-]+-\*$/.test(t)) out.push({ term: t, re: new RegExp(t.replace(/\*$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (/\*$/.test(t) ? '[a-z0-9-]*' : '\\b'), 'g') });
    else if (/^plx-[a-z0-9_-]+(--<name>)?$/.test(t)) out.push({ term: t, re: new RegExp('\\b' + t.replace('<name>', '').replace(/[-]/g, '\\-') + (/<name>/.test(t) ? '[a-z0-9-]+' : '\\b'), 'g') });
    else if (/^[\w.-]+\.(css|js|mjs)$/.test(t)) out.push({ term: t, re: new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') });
    else if (/^[A-Z][A-Za-z0-9]+(\.[A-Z][A-Za-z0-9]+)?$/.test(t)) out.push({ term: t, re: new RegExp('(<|\\bP\\.|\\{\\s*|,\\s*|import\\s*\\{[^}]*)\\b' + t.replace('.', '\\.') + '\\b', 'g') });   // a part, used as JSX, P.X, or imported
    else if (/^[a-z][A-Za-z0-9]+$/.test(t)) out.push({ term: t, prop: true, owner: (/([A-Z][A-Za-z0-9]+)\s*$/.exec(text.slice(0, m.index)) || [])[1], re: new RegExp('(?<![\\w-])' + t + '\\s*(=\\s*[{"\']|:\\s*[^:])', 'g') });   // a prop, written as a prop (not text-align: …)
  }
  return out;
}

// ---------- the checks ----------
function scan(o) {
  const lint = lintRules(o.folder);
  const all = files(o.folder), rel = (f) => path.relative(o.folder, f).split(path.sep).join('/');
  const tokens = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'platform', 'tokens', 'tokens.index.json'), 'utf8')).tokens.map((t) => t.name));
  const findings = [], pins = {};
  const add = (kind, file, line, what, fix) => findings.push({ kind, file: rel(file), line, what, fix });
  // a file the app's build writes (a bundle of its own sources) is skipped: its sources are scanned
  const texts = new Map(all.map((f) => [f, fs.readFileSync(f, 'utf8')]).filter(([, t]) => !/GENERATED|DO NOT EDIT/i.test(t.slice(0, 300)) && !/sourceMappingURL=/.test(t.slice(-500))));
  // pins
  for (const [f, t] of texts) for (const m of t.matchAll(/\/cdn\/(\d+\.\d+\.\d+)\//g)) { (pins[m[1]] = pins[m[1]] || []).push(rel(f) + ':' + lineOf(t, m.index)); }
  const pinList = Object.keys(pins).sort(cmp), pin = o.pin || pinList[0] || null;
  for (const v of pinList) add('pins', path.join(o.folder, pins[v][0].split(':')[0]), +pins[v][0].split(':')[1], 'loads Plenix ' + v + ' (' + pins[v].length + ' place' + (pins[v].length === 1 ? '' : 's') + ')', 'one version for the whole app; then the newest release, once this report is empty');
  for (const [f, t] of texts) {
    if (PIN_ONLY.test(f)) continue;
    const isCss = CSS.test(f);
    // icons
    for (const m of t.matchAll(/class(?:Name)?\s*=\s*["'`][^"'`]*\bplx-icon--[a-z0-9-]+/g)) add('icons', f, lineOf(t, m.index), 'a bare icon class (plx-icon--<name> without the Icon component): it draws nothing since 0.74.0', 'use <Icon name="…"> or Plenix.iconMarkup(icon)');
    for (const m of t.matchAll(/icons-all\.css/g)) add('icons', f, lineOf(t, m.index), 'links icons-all.css, no longer published', 'remove the link; icons draw through the Icon component');
    for (const m of t.matchAll(/--plx-comp-icon-(glyph|auto)-[a-z0-9-]*/g)) add('icons', f, lineOf(t, m.index), 'uses the retired icon setting ' + m[0], 'remove it; the Icon component draws the icon');
    // tokens
    const seen = new Set();
    for (const m of t.matchAll(/--plx-[a-z0-9-]+/g)) {
      const n = m[0]; if (tokens.has(n) || seen.has(n) || /^--plx-comp-icon-(glyph|auto)-/.test(n) || /^--plx-(ctx|state)-/.test(n)) continue;
      seen.add(n); add('tokens', f, lineOf(t, m.index), 'uses ' + n + ', which Plenix does not have (renamed or removed)', 'use the token the CHANGELOG names for it, or a role from the token list');
    }
    // own CSS and patches
    if (isCss) {
      add('own-css', f, 1, 'an app stylesheet (Plenix apps add no stylesheet of their own)', 'move each rule to a Plenix part, prop or utility; ask Plenix for what is missing');
      const css = t.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
      for (const m of css.matchAll(/([^{}]*\.plx-[a-z0-9_-]+[^{}]*)\{/g)) add('patches', f, lineOf(css, m.index + m[1].search(/\S/)), 'restyles a Plenix part: ' + m[1].trim().replace(/\s+/g, ' ').slice(0, 120), 'remove the patch; use the part’s own options (for a block in the other direction: dir and lang, docs/integration/mixed-direction.md)');
      for (const m of css.matchAll(/#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/gi)) add('own-css', f, lineOf(css, m.index), 'a raw color ' + m[0], 'a Plenix color role (--plx-sys-…)');
    } else {
      for (const rule of ['inline-style', 'use-of-color']) for (const x of lint.scan(rule, t, f)) add('own-css', f, x.line || 1, rule + ': ' + String(x.message || '').slice(0, 160), rule === 'inline-style' ? 'no style attribute or <style> block; a token reference only where code must adjust' : 'give the status its words (a Badge with an icon and a label)');
    }
  }
  // the changelog since the pin
  const items = changelogItems(pin), named = new Set();   // one finding per name and place, however many notes name it
  const checklist = items.map((it) => {
    const hits = [];
    // a note that names a prop with its part ("SplitView `maxSize`") counts it only in a file that uses that part
    for (const { term, re, owner } of it.terms) for (const [f, t] of texts) { if (PIN_ONLY.test(f)) continue; if (owner && !new RegExp('\\b' + owner + '\\b').test(t)) continue; re.lastIndex = 0; for (const m of t.matchAll(re)) hits.push({ term, file: rel(f), line: lineOf(t, m.index) }); }
    for (const h of hits.filter((x) => !named.has(x.term + '@' + x.file + ':' + x.line) && named.add(x.term + '@' + x.file + ':' + x.line)).slice(0, 20)) findings.push({ kind: 'changelog', file: h.file, line: h.line, what: 'names `' + h.term + '`, changed in ' + it.version + ' (' + it.section + ')', fix: it.text.slice(0, 300) });
    return { version: it.version, section: it.section, text: it.text, hits: hits.length };
  });
  return { app: o.app, folder: o.folder, plenix: require(path.join(ROOT, 'package.json')).version, pin, pins: pinList, lintSource: lint.source, findings, checklist };
}

// ---------- the plain-words page ----------
const KIND = { changelog: 'Changes since its version', icons: 'Retired icons', tokens: 'Names Plenix no longer has', 'own-css': 'Its own styling', patches: 'Patches over Plenix parts', pins: 'Which Plenix it loads' };
function page(r) {
  const n = r.findings.filter((f) => f.kind !== 'pins').length, by = {};
  for (const f of r.findings) (by[f.kind] = by[f.kind] || []).push(f);
  const out = ['# ' + r.app + ': ' + (n ? n + ' thing' + (n === 1 ? '' : 's') + ' to change before it follows the newest Plenix' : 'at the baseline: it can follow the newest Plenix'), '',
    'Plenix ' + r.plenix + '. The app loads ' + (r.pins.length ? r.pins.join(', ') : 'no pinned version') + (r.pin ? '; the list starts after ' + r.pin + '.' : '.'),
    'This report only reads the app; it changes nothing. Style rules from ' + r.lintSource + '.', ''];
  for (const k of Object.keys(KIND)) {
    if (!by[k]) continue;
    out.push('## ' + KIND[k] + ' (' + by[k].length + ')', '');
    for (const f of by[k].slice(0, 60)) out.push('- `' + f.file + ':' + f.line + '` ' + f.what + '. **What to do:** ' + f.fix);
    if (by[k].length > 60) out.push('- … and ' + (by[k].length - 60) + ' more in the JSON file');
    out.push('');
  }
  const todo = r.checklist.filter((c) => !c.hits);
  if (todo.length) { out.push('## To check by hand (' + todo.length + ')', '', 'Changes since its version that the scan found no trace of. Most need nothing; read each once.', ''); for (const c of todo) out.push('- ' + c.version + ', ' + c.section + ': ' + c.text.slice(0, 240)); out.push(''); }
  return out.join('\n');
}

module.exports = { scan, page, changelogItems, termsOf };
if (require.main === module) {
  const o = args(process.argv.slice(2)), r = scan(o);
  if (o.json && !o.out) { process.stdout.write(JSON.stringify(r, null, 1) + '\n'); process.exit(0); }
  const out = o.out;
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'baseline-' + r.app + '.json'), JSON.stringify(r, null, 1) + '\n');
  fs.writeFileSync(path.join(out, 'baseline-' + r.app + '.md'), page(r) + '\n');
  const n = r.findings.filter((f) => f.kind !== 'pins').length;
  console.log('BASELINE ' + r.app + ': ' + n + ' finding(s), pin ' + (r.pin || 'none') + ' → ' + path.join(out, 'baseline-' + r.app + '.md'));
}
