// node tools/agent/style-parts-check.js [--list]   (issue 710; check-bundle.js runs it after node build-packages.js)
// Proves the styles package's per-part files (release/packages/styles/foundations.css and parts/*.css, cut by tools/style-parts.js)
// against release/packages/styles/plenix.css. Read-only; it runs no page.
//   1. The union: every declaration of plenix.css (with its layer, its conditions and its selector) is in exactly one file,
//      and the files hold nothing else (beside their @import lines): no lost and no doubled rule.
//   2. The order inside each file is plenix.css's order.
//   3. Ties resolve the same: two declarations from different files that can meet on one element (the same layer and
//      property, the same specificity, a class in common in the last compound of their selectors) must load in
//      plenix.css's order whatever order an app imports its parts in. That holds when the earlier one is in foundations.css,
//      or its part is imported (directly or not) by the later one's part, and not the other way round.
// Prints STYLE_PARTS_OK, or STYLE_PARTS_FAIL with the counts (--list: every finding).
'use strict';
const fs = require('fs'), path = require('path');
const postcss = require('postcss');
const parser = require('postcss-selector-parser');

const ROOT = path.resolve(__dirname, '../..');
const S = path.join(ROOT, 'release', 'packages', 'styles');
const SAMPLES = ['badge', 'button', 'data-grid'];   // the parts whose page size is printed (issue 710's measures)

// every declaration (and every bodiless at-rule) of a stylesheet, in order: { key, layer, prop, selector }
function flatten(css) {
  const out = [];
  postcss.parse(css).walk((n) => {
    if (n.type === 'atrule' && n.name === 'import') return;
    if (n.type === 'atrule' && !n.nodes) { out.push({ key: '@' + n.name + ' ' + n.params, layer: '', prop: '', selector: '' }); return; }
    if (n.type !== 'decl') return;
    const chain = [], layers = [];
    let p = n.parent, selector = '';
    for (; p && p.type !== 'root'; p = p.parent) {
      if (p.type === 'rule') selector = selector || p.selector.replace(/\s+/g, ' ').trim();
      else if (p.type === 'atrule' && p.name === 'layer') layers.unshift(p.params.trim());
      else if (p.type === 'atrule') { chain.unshift('@' + p.name + ' ' + p.params.replace(/\s+/g, ' ').trim()); if (!selector) selector = '@' + p.name + ' ' + p.params; }
    }
    const layer = layers.join('.');
    // a keyframe's declarations are not in the cascade: they never tie
    out.push({ key: [layer, chain.join(' '), selector, n.prop, n.value.replace(/\s+/g, ' ').trim(), n.important ? '!' : ''].join('\u0001'), layer, prop: n.prop,
      selector: chain.some((c) => /^@(-webkit-)?keyframes\b/.test(c)) ? '' : selector });
  });
  return out;
}

// [ids, classes, elements] of one selector (:where counts nothing; :is, :not and :has count their most specific argument)
function specificity(sel) {
  const walk = (container) => {
    const s = [0, 0, 0];
    container.each((n) => {
      if (n.type === 'id') s[0]++;
      else if (n.type === 'class' || n.type === 'attribute') s[1]++;
      else if (n.type === 'tag') s[2]++;
      else if (n.type === 'pseudo') {
        if (n.value.startsWith('::') || /^:(before|after|first-line|first-letter)$/.test(n.value)) s[2]++;
        else if (n.value === ':where') { /* nothing */ } else if (/^:(is|not|has|matches)$/.test(n.value)) {
          const best = n.nodes.map((x) => walk(x)).sort((a, b) => b[0] - a[0] || b[1] - a[1] || b[2] - a[2])[0] || [0, 0, 0];
          s[0] += best[0]; s[1] += best[1]; s[2] += best[2];
        } else s[1]++;
      }
    });
    return s;
  };
  return walk(sel);
}
// what the last compound of a selector targets: its classes, else its element or attributes; and its pseudo-element
// A part's own classes (plx-…) name the element, also inside :where() and :is(); a state class (is-hover) is shared by
// every part and counts only where no plx- class is there. A compound with neither ("> *") is named by its parent's keys,
// since two such children are one element only under one parent; under a descendant combinator it can be anything (*).
function subject(sel) {
  const nodes = sel.nodes;
  const compounds = [[]], combinators = [];
  for (const n of nodes) { if (n.type === 'combinator') { combinators.push(n.value.trim() || ' '); compounds.push([]); } else compounds[compounds.length - 1].push(n); }
  const keysOf = (compound) => {
    const classes = [];
    for (const n of compound) {
      if (n.type === 'class') classes.push('.' + n.value);
      else if (n.type === 'pseudo' && /^:(where|is|matches)$/.test(n.value)) n.walkClasses((c) => { classes.push('.' + c.value); });
    }
    const own = classes.filter((c) => c.startsWith('.plx-'));
    if (own.length || classes.length) return own.length ? own : classes;
    const other = compound.filter((n) => n.type === 'tag' || n.type === 'attribute').map((n) => String(n).trim());
    return other.length ? other : null;
  };
  let keys = null, prefix = '';
  for (let i = compounds.length - 1; i >= 0; i--) {
    keys = keysOf(compounds[i]);
    if (keys) break;
    if (i === 0 || combinators[i - 1] !== '>') { keys = ['*']; break; }
    prefix += '>';
  }
  const last = compounds[compounds.length - 1];
  const pseudoEl = last.filter((n) => n.type === 'pseudo' && n.value.startsWith('::')).map((n) => n.value).join('');
  return { keys: (keys || ['*']).map((k) => prefix + k), pseudoEl };
}

// plenix: plenix.css's text; texts: Map(name -> file text; 'foundations' for foundations.css); deps: Map(name -> [names it
// imports]). Returns the findings, and pairs: [[earlier, later]] for each tie whose order can change
function analyze(plenix, texts, deps) {
  const findings = { lost: [], extra: [], order: [], ties: [] }, pairs = [];
  // 1 and 2: match each file's declarations to plenix.css's, in order
  const all = flatten(plenix);
  const where = new Map();   // key -> [indices] in plenix.css
  all.forEach((e, i) => { if (!where.has(e.key)) where.set(e.key, []); where.get(e.key).push(i); });
  const owner = new Array(all.length).fill(null);
  for (const [name, text] of texts) {
    let last = -1;
    for (const e of flatten(text)) {
      const at = where.get(e.key);
      const i = at && (at.find((x) => owner[x] === null && x > last) ?? at.find((x) => owner[x] === null));
      if (i === undefined || i === null) { findings.extra.push(name + ': ' + e.key.split('\u0001').join(' | ')); continue; }
      if (i < last) findings.order.push(name + ': ' + e.key.split('\u0001').join(' | '));
      owner[i] = name; last = i;
    }
  }
  owner.forEach((o, i) => { if (o === null) findings.lost.push(all[i].key.split('\u0001').join(' | ')); });
  // 3: ties between files
  const closure = new Map();
  const reach = (n) => { if (closure.has(n)) return closure.get(n); const s = new Set(); closure.set(n, s); for (const d of deps.get(n) || []) { s.add(d); for (const x of reach(d)) s.add(x); } return s; };
  const before = (a, b) => a === b || a === 'foundations' || (reach(b).has(a) && !reach(a).has(b));   // a always loads before b
  const buckets = new Map();
  all.forEach((e, i) => {
    if (!e.prop || !e.selector || e.selector.startsWith('@') || owner[i] === null) return;
    let parsed;
    try { parsed = parser().astSync(e.selector); } catch (err) { return; }
    parsed.each((sel) => {
      const spec = specificity(sel).join(','), sub = subject(sel);
      for (const k of sub.keys) {
        const b = [e.layer, e.prop, spec, k, sub.pseudoEl].join('\u0001');
        if (!buckets.has(b)) buckets.set(b, []);
        buckets.get(b).push(i);
      }
    });
  });
  const seen = new Set();
  for (const [b, idx] of buckets) {
    const owners = new Map();   // owner -> first index in this bucket
    for (const i of idx) if (!owners.has(owner[i])) owners.set(owner[i], i);
    if (owners.size < 2) continue;
    for (const i of idx) for (const j of idx) {
      if (i >= j || owner[i] === owner[j] || before(owner[i], owner[j])) continue;
      const pair = owner[i] + ' before ' + owner[j];
      if (seen.has(pair)) continue;
      seen.add(pair);
      pairs.push([owner[i], owner[j]]);
      const [layer, prop, spec, key] = b.split('\u0001');
      findings.ties.push(pair + ' (' + layer + ' ' + prop + ' on ' + key + ', specificity ' + spec + ': ' + all[i].selector + ' / ' + all[j].selector + ')');
    }
  }
  return { findings, pairs, declarations: all.length };
}

function check(list) {
  const plenix = fs.readFileSync(path.join(S, 'plenix.css'), 'utf8');
  const parts = fs.readdirSync(path.join(S, 'parts')).filter((f) => f.endsWith('.css')).sort();
  const texts = new Map([['foundations', fs.readFileSync(path.join(S, 'foundations.css'), 'utf8')], ...parts.map((f) => [f.slice(0, -4), fs.readFileSync(path.join(S, 'parts', f), 'utf8')])]);
  const deps = new Map([...texts].map(([n, t]) => [n, [...t.matchAll(/^@import "\.\/([\w-]+)\.css";$/gm)].map((m) => m[1])]));
  const { findings, declarations } = analyze(plenix, texts, deps);
  const all = { length: declarations };
  // every @import names a part file. Two parts that import each other (their React parts use each other) load in either
  // order: a browser and a bundler skip the import that comes back round. That is safe because 3. finds no tie between
  // them (each reaches the other, so neither counts as loading first); the cycles are printed for information
  findings.imports = [];
  for (const [n, list] of deps) for (const d of list) if (!texts.has(d)) findings.imports.push(n + ' imports a missing part: ' + d);
  const cycles = [], state = new Map();
  const visit = (n, trail) => {
    if (state.get(n) === 2) return;
    if (state.get(n) === 1) { cycles.push(trail.slice(trail.indexOf(n)).concat(n).join(' -> ')); return; }
    state.set(n, 1); (deps.get(n) || []).filter((d) => texts.has(d)).forEach((d) => visit(d, trail.concat(n))); state.set(n, 2);
  };
  for (const n of texts.keys()) visit(n, []);
  if (cycles.length) console.log('  (information) parts that import each other, with no tie between them: ' + cycles.join('; '));
  // what a page that uses one part loads: foundations.css, the part and every part it imports (each once)
  const zlib = require('zlib');
  const closure = (n, s = new Set()) => { if (!s.has(n)) { s.add(n); (deps.get(n) || []).forEach((d) => closure(d, s)); } return s; };
  const size = (txt) => (Buffer.byteLength(txt) / 1024).toFixed(1) + ' KB (' + (zlib.gzipSync(txt).length / 1024).toFixed(1) + ' KB gzipped)';
  console.log('A page loads: plenix.css ' + size(plenix) + '; foundations.css alone ' + size(texts.get('foundations')));
  for (const n of SAMPLES) if (texts.has(n)) {
    const c = closure(n);
    console.log('  ' + n.padEnd(10) + ' ' + String(c.size).padStart(3) + ' parts  ' + size(texts.get('foundations') + [...c].map((x) => texts.get(x)).join('')));
  }
  const bad = findings.lost.length + findings.extra.length + findings.order.length + findings.ties.length + findings.imports.length;
  console.log('Style parts: ' + texts.size + ' files, ' + all.length + ' declarations in plenix.css; lost ' + findings.lost.length + ', extra ' + findings.extra.length
    + ', out of order ' + findings.order.length + ', ties whose order can change ' + findings.ties.length + ', import problems ' + findings.imports.length);
  if (list || bad) for (const k of Object.keys(findings)) findings[k].slice(0, list ? Infinity : 10).forEach((x) => console.log('  ' + k + ': ' + x));
  console.log(bad ? 'STYLE_PARTS_FAIL' : 'STYLE_PARTS_OK');
  return { bad, findings };
}
module.exports = { check, analyze, flatten };
if (require.main === module) process.exit(check(process.argv.includes('--list')).bad ? 1 : 0);
