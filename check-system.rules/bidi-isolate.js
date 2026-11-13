// Plenix · check-system rule "bidi-isolate" (#1283, G2 rule after #1281): a one-line truncated element (white-space: nowrap and
// text-overflow: ellipsis) that holds user or app text isolates its own direction with unicode-bidi: plaintext, so in a right-to-left
// page a long Latin label (a case title, a name, an email) is cut at its end, not its start; an Arabic one in a left-to-right page too.
// What it rejects: a rule (in platform/**/*.css) with both declarations and no unicode-bidi: plaintext, unless bidi-isolate.json names it.
//   allowed   a part where plaintext would be wrong, each with its reason: its box stretches wider than its text (flex-grow,
//             inline-size: 100%, a grid cell: plaintext would move a short Latin label to the left in RTL; the text goes in an inner span
//             that has the rule instead), or it holds only icons or numbers (direction-neutral)
//   backlog   the rules that broke it when it began (#1283's audit); it only shrinks: a listed rule that now passes, or is gone, fails until
//             it is removed (node check-system.rules/bidi-isolate.js --shrink)
//   stretch   the opposite mistake (G2, #1285): plaintext on a box that stretches in the same rule (flex-grow above 0, or inline-size:
//             100%) moves a short Latin label to the far side in RTL; it fails: put the text in an inner span that does not stretch
// A value that comes through var() counts when the custom property is set to it anywhere (or it is the var()'s fallback) (#1337).
// A rule is named by its file and its first class: "platform/components/Tag/tag.css .plx-tag__label".
// Alone: node check-system.rules/bidi-isolate.js [--shrink | --baseline]   -> BIDI_ISOLATE_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'bidi-isolate';
const ROOT = path.join(__dirname, '..');
const LIST = path.join(__dirname, 'bidi-isolate.json');

function sheets(dir, out = []) {
  for (const n of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) { if (!/^(dist|tokens|vendor|node_modules)$/.test(n)) sheets(p, out); }
    else if (/\.css$/.test(n)) out.push(p);
  }
  return out;
}
// a declaration's value in a rule body ('' when it has none)
const decl = (body, prop) => { const m = body.match(new RegExp('(?:^|[;{\\s])' + prop + ':\\s*([^;]+)')); return m ? m[1].trim() : ''; };
// true when the value is `word`, or reaches it through var(): a custom property some rule sets to it, or a var() fallback (#1337: the
// Field label's ellipsis comes from --plx-comp-field-grid-label-text-overflow, set by the Stack of inline fields)
function reaches(value, word, vars, seen = new Set()) {
  if (new RegExp('(?:^|[\\s,(])' + word + '(?:$|[\\s,)])').test(value)) return true;
  for (const m of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (seen.has(m[1])) continue; seen.add(m[1]);
    if ((vars.get(m[1]) || []).some((v) => reaches(v, word, vars, seen))) return true;
  }
  return false;
}
// every one-line ellipsis rule: { id, file, isolated }
function rules() {
  const out = [], seen = new Set(), files = sheets(path.join(ROOT, 'platform')).map((f) => [f, fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')]);
  // every value each custom property is set to, in any sheet
  const vars = new Map();
  for (const [, text] of files) for (const m of text.matchAll(/(?:^|[;{\s])(--[\w-]+):\s*([^;{}]+)/g)) { if (!vars.has(m[1])) vars.set(m[1], []); vars.get(m[1]).push(m[2].trim()); }
  for (const [f, text] of files) {
    for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const body = m[2];
      if (!reaches(decl(body, 'white-space'), 'nowrap', vars) || !reaches(decl(body, 'text-overflow'), 'ellipsis', vars)) continue;
      const sel = m[1].trim().split(',')[0].trim();
      const cls = (sel.match(/\.(plx-[a-z0-9_-]+)/) || [])[1] || sel;
      const id = path.relative(ROOT, f).split(path.sep).join('/') + ' .' + cls;
      const isolated = /unicode-bidi:\s*plaintext/.test(body);
      const stretched = /flex-grow:\s*(?!0(?:\.0+)?\s*[;}]|0$)[0-9.]+/.test(body) || /(?:^|;)\s*inline-size:\s*100%/.test(body);
      // a part with several such rules (a state, a size) counts once: isolated when any of them isolates
      const prev = out.find((r) => r.id === id);
      if (prev) { prev.isolated = prev.isolated || isolated; prev.stretchedIsolated = prev.stretchedIsolated || (isolated && stretched); continue; }
      if (!seen.has(id)) { seen.add(id); out.push({ id, file: f, isolated, stretchedIsolated: isolated && stretched }); }
    }
  }
  return out;
}
const read = () => (fs.existsSync(LIST) ? JSON.parse(fs.readFileSync(LIST, 'utf8')) : { allowed: {}, backlog: {} });
function check({ add }) {
  const list = read(), allowed = list.allowed || {}, backlog = list.backlog || {};
  const all = rules(), ids = new Set(all.map((r) => r.id));
  for (const r of all) {
    if (r.stretchedIsolated) add(NAME, r.file, 0, r.id + ': unicode-bidi: plaintext on a box that stretches (flex-grow or inline-size: 100%): a short Latin label moves to the far side in RTL; isolate an inner span that does not stretch instead (#1283)');
    if (r.isolated || allowed[r.id]) continue;
    if (!(r.id in backlog)) add(NAME, r.file, 0, r.id + ': a one-line ellipsis without unicode-bidi: plaintext (a long Latin label is cut at its start in RTL); add it, or name the part in bidi-isolate.json "allowed" with the reason (#1283)');
  }
  for (const id of Object.keys(backlog)) {
    const r = all.find((x) => x.id === id);
    if (!r || r.isolated || allowed[id]) add(NAME, LIST, 0, id + ' is fixed or gone: remove it from the backlog (--shrink)');
  }
  for (const id of Object.keys(allowed)) if (!ids.has(id)) add(NAME, LIST, 0, id + ' is in "allowed" but no such rule: remove it');
}
module.exports = { name: NAME, check, rules };
if (require.main === module) {
  if (process.argv.includes('--shrink') || process.argv.includes('--baseline')) {
    const list = read(), all = rules(), allowed = list.allowed || {};
    const open = all.filter((r) => !r.isolated && !allowed[r.id]).map((r) => r.id);
    const keep = process.argv.includes('--baseline') ? open : open.filter((id) => id in (list.backlog || {}));
    const backlog = {}; keep.sort().forEach((id) => { backlog[id] = 'audit #1283'; });
    fs.writeFileSync(LIST, JSON.stringify({ $description: 'bidi-isolate (check-system.rules/bidi-isolate.js, #1283): "allowed" names a one-line ellipsis part that must not take unicode-bidi: plaintext, with the reason (its box stretches wider than its text, so the text goes in an inner span; or it holds only icons or numbers). "backlog" is the rules that broke the rule when it began; it only shrinks.', allowed, backlog }, null, 1) + '\n');
    console.log('bidi-isolate: ' + Object.keys(allowed).length + ' allowed, ' + Object.keys(backlog).length + ' in the backlog');
  } else {
    let n = 0; check({ add: (r, f, l, m) => { n++; console.log('  ' + m); } });
    console.log(n ? 'BIDI_ISOLATE_FAIL (' + n + ')' : 'BIDI_ISOLATE_OK'); process.exitCode = n ? 1 : 0;
  }
}
