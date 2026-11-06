// Plenix · check-system rule "unused-classes" (Styling Standard, Phase 7 / issue 125): a class no markup produces is dead weight.
// A class `plx-…` defined in a Platform stylesheet is UNUSED when nothing else in the repository names it: no component, pattern, page,
// application, test, tool or design spec (JSX, TSX, JS, HTML) and no list that marks it going away. An unused class is a finding: delete it, or,
// when outside users (CTM, the St. John site) may still have it in their markup, list it in platform/standards/deprecated-classes.json so it
// keeps working until the next minor release (VERSIONING.md, Deprecation).
// What counts as naming a class (the edge cases):
//   the whole name                      'plx-card--soft', className="plx-card"
//   a dynamic name, built from a stem   'plx-layout--justify-' + value, `plx-card--${tone}`: the name's head, up to one of its "-" after the first
//                                       "--" or "__", appears in source; so does the tail from the "--" or "__" ($ {block}__rich--tags builds the head)
//   a spec specimen or a test           the files of platform/design-system and tests/ count: a class shown on a spec page is used
//   a stylesheet                        a class that only another stylesheet mentions is not used (CSS does not produce markup)
// Alone: node check-system.rules/unused-classes.js   -> UNUSED_CLASSES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { ROOT, collect } = require('../check-common.js');

const NAME = 'unused-classes';
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
const listed = () => {
  try { return new Set(JSON.parse(read(path.join(ROOT, 'platform', 'standards', 'deprecated-classes.json'))).classes || []); } catch (e) { return new Set(); }
};
function walkTests(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walkTests(f, out); } else if (/\.(js|mjs|cjs|html)$/.test(e.name)) out.push(f);
  }
  return out;
}

// a class named by a dynamic build: some head of it ending in "-" (after its first "--" or "__") appears in source, or the tail from the "--" or "__" does
function built(name, source) {
  const at = Math.min(...['--', '__'].map((s) => { const i = name.indexOf(s); return i < 0 ? Infinity : i; }));
  if (!isFinite(at)) return false;
  const last = name.lastIndexOf('--');
  for (let i = at + 1; i < name.length; i++) {
    if (name[i] !== '-' && name[i - 1] !== '_') continue;           // a head ends at a "-" or just after a "__"
    const head = name.slice(0, i + (name[i] === '-' ? 1 : 0)), from = name.slice(at, i + (name[i] === '-' ? 1 : 0));
    if (head.length < name.length && source.includes(head)) return true;
    if (from.length > 6 && source.includes(from)) return true;      // ${block}__tree-cell--level-${n}: the block is a variable
  }
  const tail = name.slice(at);
  return (tail.length > 6 && source.includes(tail)) || (last > at && name.slice(last).length > 6 && source.includes(name.slice(last)));
}

function findings(files = collect()) {
  const defined = new Map();
  const code = [];
  for (const { file } of files) {
    const text = read(file);
    if (/\.css$/.test(file)) {
      if (!/[\\/]platform[\\/]/.test(file)) continue;
      for (const m of text.matchAll(/\.(plx-[a-z0-9_-]+)/g)) if (!defined.has(m[1])) defined.set(m[1], file);
    } else code.push(text);
  }
  for (const f of walkTests(path.join(ROOT, 'tests'), [])) code.push(read(f));
  const source = code.join('\n');
  const going = listed();
  const out = [];
  for (const [name, file] of defined) {
    if (going.has(name) || source.includes(name) || built(name, source)) continue;
    out.push({ file, text: '.' + name + ' is defined here and nothing produces it: delete it, or list it in platform/standards/deprecated-classes.json if outside users may have it' });
  }
  return out;
}

function check({ files, add }) { for (const f of findings(files)) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, built, NAME };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'UNUSED_CLASSES_FAIL (' + list.length + ')' : 'UNUSED_CLASSES_OK');
  process.exit(list.length ? 1 : 0);
}
