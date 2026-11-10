// Plenix · check-system rule "bidi-isolate" (#1283, G2 rule after #1281): a one-line truncated element (white-space: nowrap and
// text-overflow: ellipsis) that holds user or app text isolates its own direction with unicode-bidi: plaintext, so in a right-to-left
// page a long Latin label (a case title, a name, an email) is cut at its end, not its start; an Arabic one in a left-to-right page too.
// What it rejects: a rule (in platform/**/*.css) with both declarations and no unicode-bidi: plaintext, unless bidi-isolate.json names it.
//   allowed   a part where plaintext would be wrong, each with its reason: its box stretches wider than its text (flex-grow,
//             inline-size: 100%, a grid cell: plaintext would move a short Latin label to the left in RTL; the text goes in an inner span
//             that has the rule instead), or it holds only icons or numbers (direction-neutral)
//   backlog   the rules that broke it when it began (#1283's audit); it only shrinks: a listed rule that now passes, or is gone, fails until
//             it is removed (node check-system.rules/bidi-isolate.js --shrink)
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
// every one-line ellipsis rule: { id, file, isolated }
function rules() {
  const out = [], seen = new Set();
  for (const f of sheets(path.join(ROOT, 'platform'))) {
    const text = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const body = m[2];
      if (!/white-space:\s*nowrap/.test(body) || !/text-overflow:\s*ellipsis/.test(body)) continue;
      const sel = m[1].trim().split(',')[0].trim();
      const cls = (sel.match(/\.(plx-[a-z0-9_-]+)/) || [])[1] || sel;
      const id = path.relative(ROOT, f).split(path.sep).join('/') + ' .' + cls;
      const isolated = /unicode-bidi:\s*plaintext/.test(body);
      // a part with several such rules (a state, a size) counts once: isolated when any of them isolates
      const prev = out.find((r) => r.id === id);
      if (prev) { prev.isolated = prev.isolated || isolated; continue; }
      if (!seen.has(id)) { seen.add(id); out.push({ id, file: f, isolated }); }
    }
  }
  return out;
}
const read = () => (fs.existsSync(LIST) ? JSON.parse(fs.readFileSync(LIST, 'utf8')) : { allowed: {}, backlog: {} });
function check({ add }) {
  const list = read(), allowed = list.allowed || {}, backlog = list.backlog || {};
  const all = rules(), ids = new Set(all.map((r) => r.id));
  for (const r of all) {
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
