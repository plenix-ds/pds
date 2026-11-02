// Plenix · build-spec-parts.js (library plan, wave 0): the design system's library parts, bundled. Every lane of the
// library waves owns its own part files in platform/design-system/parts/ (wNNL = wave NN, lane A/B/C), so no two writers
// edit inventory.js, inventory-docs.js, a *-labs.js file or a ds-sample-*.css at the same time:
//   wNNL.records.js   DSParts.records.push(function (H) { var h = H.h, P = H.P; return [ { id, sec, sub, leaf, … } ]; });
//                     H is inventory.js's HELPERS (h, P, S, W, noop, use, row, stack, box, surface, onAccent, TONES, cap,
//                     each, eachV, q, fieldStates, FIELD_STATES, OPTS, ROWS, TREE, FOPTS, header, A, C, M, F, D, m)
//   wNNL.labs.js      if (window.DS && DS.registerLab) { DS.registerLab('<record id>', spec); }
//   wNNL.docs.js      DSParts.docs.push({ '<record id>': { purpose, anatomy, behavior, a11y, content } });
//   wNNL.css          the lane's lab specimen frames (tokens only)
// This script writes, in name order:
//   platform/design-system/spec-parts.js      every records, labs and docs part, each wrapped so a broken part is
//                                             reported by name (console.error and DSParts.errors) and the others still load
//   platform/design-system/ds-sample-parts.css every parts/*.css
// index.html loads spec-parts.js after the labs and before the taxonomy; inventory.js pushes the records, inventory-docs.js
// merges the docs; check-spec.js, build-packages.js and build-native-guidance.js load it before inventory.js.
// Deterministic (no dates); run by build-app.js. Alone: node build-spec-parts.js; check-system.js checks the bundle is current.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const NAME = /^w(?:\d{2}[A-Z]|13[1-4]|DTN)\.(records|labs|docs)\.js$|^w(?:\d{2}[A-Z]|13[1-4]|DTN)\.css$/;


// ── lazy loading (issue 882, item 13): an index of what the tree, search, counts and tables read, and one chunk per part ──
// The records a part makes are computed here, once, exactly as the page does (inventory.js with the parts), so the index
// is what the eager page would hold. A page that needs a part's examples, labs or written sections loads its chunk
// (spec-chunks/<part>.js: the part's own code, wrapped like the bundle's); parts that touch each other's records
// (HELPERS.record / addExamples, statesFrom, docsFrom) form a group that loads together, in the bundle's order.
const META = ['id', 'sec', 'sub', 'leaf', 'title', 'level', 'interaction', 'scope', 'status', 'owner', 'reviewed', 'icon', 'aliases', 'covers', 'src', 'also',
  'css', 'cssAlso', 'plenix', 'blocks', 'guide', 'href', 'statesFrom', 'docsFrom', 'stateNote', 'extraLabs', 'studies', 'usedBy', 'variantClasses'];
function lazyIndex(DS, bundle, chunks) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} }, React: { createElement: (...a) => ({ type: a[0], props: a[1] || {}, children: a.slice(2) }), useState: (v) => [v, () => {}] } };
  ctx.window.React = ctx.React; ctx.window.Plenix = new Proxy({}, { get: (_, k) => k });
  vm.createContext(ctx);
  vm.runInContext(bundle, ctx, { filename: 'spec-parts.js' });
  const owner = {}, calls = [], order = [];
  const fns = ctx.window.DSParts.records;
  // a part may change a record it did not make (inventory.js's own): what it changed is found by comparing the record before
  // and after the part's function, so a part that only reads a record (a thin record copying its main one) is not tied to it
  const sig = (v) => JSON.stringify(v, (k, x) => (typeof x === 'function' ? 'fn:' + String(x) : x));
  const mutated = [];
  fns.forEach((fn, i) => {
    const part = fn.part; if (!part) return;
    if (!order.includes(part)) order.push(part);
    fns[i] = function (H) {
      const before = {};
      const view = new Proxy(H, { get: (t, k) => {
        if (k === 'record' || k === 'addExamples' || k === 'iconOf') return function (id) { calls.push([part, id]); if (!(id in before)) { const r = t.record(id); before[id] = r ? [r, sig(r)] : null; } return t[k].apply(t, arguments); };
        return t[k];
      } });
      const out = fn(view); out.forEach((r) => { owner[r.id] = part; });
      Object.keys(before).forEach((id) => { if (before[id] && sig(before[id][0]) !== before[id][1]) mutated.push([part, id]); });
      return out;
    };
  });
  for (const f of ['inventory.js']) vm.runInContext(fs.readFileSync(path.join(DS, f), 'utf8'), ctx, { filename: f });
  const records = ctx.window.DSInventory;
  // groups: parts joined by a record call, a statesFrom or a docsFrom into another part
  const up = {}; const find = (x) => (up[x] === undefined || up[x] === x ? (up[x] = x) : (up[x] = find(up[x])));
  const join = (a, b) => { if (a && b && a !== b) up[find(a)] = find(b); };
  // what each part's labs and written sections are about (run each chunk alone, with a stand-in for the lab registry)
  const about = {}, labsOf = {};
  Object.keys(chunks).forEach((name) => {
    // a stand-in for the spec's helpers: any property is another stand-in, so a lab part that builds on another lab's spec
    // (DS.labs['x'] with Object.assign) runs to its registerLab call
    const any = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'then' ? undefined : any()), apply: () => any(), construct: () => any() });
    const DSS = new Proxy({ registerLab: (id) => { (about[name] = about[name] || new Set()).add(id); (labsOf[id] = labsOf[id] || new Set()).add(name); } }, { get: (t, k) => (k in t ? t[k] : any()) });
    const c = { window: { DS: DSS, DSLabs: {} }, console: { log() {}, warn() {}, error() {} } };
    c.window.window = c.window; c.DS = c.window.DS; c.DSLabs = c.window.DSLabs; vm.createContext(c);
    try { vm.runInContext(chunks[name], c, { filename: name + '.js' }); } catch (e) { throw new Error('spec-chunks/' + name + '.js does not run: ' + e.message); }
    (c.window.DSParts.docs || []).forEach((d) => Object.keys(d).forEach((id) => (about[name] = about[name] || new Set()).add(id)));
  });
  // a record that no part owns (inventory.js's own) but a part adds examples, labs or docs to: its page loads those parts
  const touch = {};
  const addTouch = (id, part) => { (touch[id] = touch[id] || new Set()).add(part); };
  // a part that reads a record another part made needs that part; one that changes a record of inventory.js's own is loaded
  // with that page, and two that change the same one load together (their order is the bundle's)
  calls.forEach(([part, id]) => { if (owner[id] && owner[id] !== part) join(part, owner[id]); });
  // two parts that register the lab of one record: the later one wins, so they load together
  Object.keys(labsOf).forEach((id) => { const ps = [...labsOf[id]].sort(); ps.slice(1).forEach((x) => join(x, ps[0])); });
  // A part sees a record of inventory.js's own as the parts before it left it. Loaded again from the start, in the bundle's
  // order (spec-lazy.js), each part sees exactly that, whatever else is loaded; a part that comes after one that changes a
  // record it reads loads with it.
  mutated.forEach(([part, id]) => { if (!owner[id]) addTouch(id, part); });
  calls.forEach(([part, id]) => { if (!owner[id]) mutated.forEach(([m, mid]) => { if (mid === id && m !== part && m < part) join(part, m); }); });
  Object.keys(about).forEach((name) => about[name].forEach((id) => { if (owner[id] && owner[id] !== name) join(name, owner[id]); else if (!owner[id]) addTouch(id, name); }));
  records.forEach((r) => { const p = owner[r.id]; if (!p) return; (r.statesFrom || []).forEach((x) => join(p, owner[x])); if (r.docsFrom) join(p, owner[r.docsFrom]); });
  Object.keys(chunks).forEach((p) => { if (!order.includes(p)) order.push(p); });
  order.sort();
  const parts = {};
  order.forEach((p) => { parts[p] = order.filter((q) => find(q) === find(p)); });
  // a page draws its lab (labId, a variant page's labId, an extra lab): the parts that register that lab load with the page
  records.forEach((r) => {
    const ids = [r.labId || r.id].concat((r.variantPages || []).map((v) => v.labId), (r.extraLabs || []).map((x) => x.id)).filter(Boolean);
    ids.forEach((lab) => { if (labsOf[lab]) labsOf[lab].forEach((part) => { if (owner[r.id] !== part) addTouch(r.id, part); }); });
  });
  const isRecord = new Set(records.map((r) => r.id));
  const touched = {}; Object.keys(touch).sort().filter((id) => isRecord.has(id)).forEach((id) => { touched[id] = [...touch[id]].sort(); });
  const slim = (v) => { const o = {}; ['leaf', 'group', 'name', 'also', 'labId'].forEach((k) => { if (v[k] !== undefined) o[k] = v[k]; }); if (v.lab) o.lab = true; return o; };
  const metaOf = (r) => {
    const m = {};
    META.forEach((k) => { if (r[k] !== undefined && typeof r[k] !== 'function') m[k] = r[k]; });
    if (r.lab) m.lab = true;
    if (r.variantPages) m.variantPages = r.variantPages.map(slim);
    return m;
  };
  const index = [];
  records.forEach((r) => {
    const part = owner[r.id]; if (!part) return;
    index.push(Object.assign({ part }, metaOf(r)));
  });
  // what the parts change of inventory.js's own records, in what the lists read (the home's "Platform exports placed" reads
  // each record's plenix names): until those parts load, the page shows the records as the bundle leaves them
  const plain = { window: {}, console: { log() {}, warn() {}, error() {} }, React: ctx.React };
  plain.window.React = ctx.React; plain.window.Plenix = new Proxy({}, { get: (_, k) => k });
  vm.createContext(plain);
  vm.runInContext(fs.readFileSync(path.join(DS, 'inventory.js'), 'utf8'), plain, { filename: 'inventory.js' });
  const was = {}; plain.window.DSInventory.forEach((r) => { was[r.id] = metaOf(r); });
  const base = {};
  records.forEach((r) => {
    if (owner[r.id] || !touched[r.id] || !was[r.id]) return;
    const now = metaOf(r), diff = {};
    new Set([...Object.keys(now), ...Object.keys(was[r.id])]).forEach((k) => { if (JSON.stringify(now[k]) !== JSON.stringify(was[r.id][k])) diff[k] = now[k] === undefined ? null : now[k]; });
    if (Object.keys(diff).length) base[r.id] = diff;
  });
  return { parts, touch: touched, base, records: index, count: records.length };
}
function chunkText(name, files, read, q) {
  const body = files.map((f) => {
    const kind = f.split('.')[1];
    const view = kind === 'records'
      ? 'var DSParts = { records: { push: function () { [].slice.call(arguments).forEach(function (fn) { var w = function (H) { try { return fn(H); } catch (e) { fail(' + q('parts/' + f) + ', e); return []; } }; w.part = ' + q(name) + '; window.DSParts.records.push(w); }); } }, docs: window.DSParts.docs };'
      : kind === 'docs'
        ? 'var DSParts = { records: window.DSParts.records, docs: { push: function () { [].slice.call(arguments).forEach(function (d) { window.DSParts.docs.push(d); (window.DSParts.docsPart = window.DSParts.docsPart || [])[window.DSParts.docs.length - 1] = ' + q(name) + '; }); } } };'
        : 'var DSParts = window.DSParts;';
    return '/* ── parts/' + f + ' ── */\ntry { (function () { ' + view + '\n' + read(f) + '})(); } catch (e) { fail(' + q('parts/' + f) + ', e); }\n';
  }).join('');
  return '/* GENERATED by build-spec-parts.js from platform/design-system/parts/' + name + '.* (the part\'s records, labs and written sections). Edit the parts, never this file. */\n'
    + 'window.DSParts = window.DSParts || { records: [], docs: [], errors: [] };\n'
    + '(function () {\n'
    + 'var fail = function (name, e) { window.DSParts.errors.push(name + \': \' + (e && e.message || e)); if (typeof console !== \'undefined\') console.error(\'spec-parts: \' + name + \' failed: \' + (e && e.message || e)); };\n'
    + body + '})();\n'
    + 'if (window.DSChunkLoaded) window.DSChunkLoaded(' + q(name) + ');\n';
}

module.exports = function buildSpecParts(root, { check = false } = {}) {
  const DS = path.join(root, 'platform', 'design-system');
  const DIR = path.join(DS, 'parts');
  // without the design system checked out (CI: a private submodule) there is nothing to bundle
  if (!fs.existsSync(path.join(DS, 'spec.js'))) return { changed: false, parts: 0, skipped: true, stale: [] };
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => !f.startsWith('.')).sort() : [];
  const bad = files.filter((f) => !NAME.test(f) && f !== 'README.md');
  if (bad.length) throw new Error('platform/design-system/parts: not a part name (wNNL or w131–w134 with .records.js, .labs.js, .docs.js, .css): ' + bad.join(', '));
  const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
  const of = (kind) => files.filter((f) => f.endsWith('.' + kind + '.js'));
  const q = JSON.stringify;
  // a part runs inside its own function: DSParts there is the part's view of the shared lists, so a record function that
  // throws when inventory.js calls it is reported with the part's name and gives no records
  const wrap = (f, kind) => {
    const name = 'parts/' + f;
    const view = kind === 'records'
      ? 'var DSParts = { records: { push: function () { [].slice.call(arguments).forEach(function (fn) { var w = function (H) { try { return fn(H); } catch (e) { fail(' + q(name) + ', e); return []; } }; w.part = ' + q(f.split('.')[0]) + '; window.DSParts.records.push(w); }); } }, docs: window.DSParts.docs };'
      : 'var DSParts = window.DSParts;';
    return '/* ── ' + name + ' ── */\ntry { (function () { ' + view + '\n' + read(f) + '})(); } catch (e) { fail(' + q(name) + ', e); }\n';
  };
  const parts = [].concat(of('records').map((f) => wrap(f, 'records')), of('labs').map((f) => wrap(f, 'labs')), of('docs').map((f) => wrap(f, 'docs')));
  const js = '/* GENERATED by build-spec-parts.js from platform/design-system/parts/ (' + (files.filter((f) => f.endsWith('.js')).join(', ') || 'no parts yet') + ').\n'
    + '   Edit the parts, never this file. The library lanes\' records, labs and written sections: inventory.js pushes\n'
    + '   DSParts.records, inventory-docs.js merges DSParts.docs, the labs register themselves (DS.registerLab). */\n'
    + 'window.DSParts = window.DSParts || { records: [], docs: [], errors: [] };\n'
    + '(function () {\n'
    + 'var fail = function (name, e) { window.DSParts.errors.push(name + \': \' + (e && e.message || e)); if (typeof console !== \'undefined\') console.error(\'spec-parts: \' + name + \' failed: \' + (e && e.message || e)); };\n'
    + parts.join('') + '})();\n';
  const cssFiles = files.filter((f) => f.endsWith('.css'));
  const css = '/* GENERATED by build-spec-parts.js from platform/design-system/parts/*.css (' + (cssFiles.join(', ') || 'no parts yet') + ').\n'
    + '   Edit the parts, never this file: the library lanes\' lab specimen frames (tokens only). */\n'
    + cssFiles.map((f) => '/* ── parts/' + f + ' ── */\n' + read(f)).join('');
  // the whole bundle must parse (a part with a syntax error stops the build, named)
  for (const f of files.filter((x) => x.endsWith('.js'))) {
    try { new Function(read(f)); } catch (e) { throw new Error('platform/design-system/parts/' + f + ' does not parse: ' + e.message); }
  }
  const stale = [];
  const outputs = [[path.join(DS, 'spec-parts.js'), js], [path.join(DS, 'ds-sample-parts.css'), css]];
  // lazy loading: the index and one chunk per part (spec-chunks/), written beside the bundle
  const jsFiles = files.filter((x) => x.endsWith('.js')), partNames = [...new Set(jsFiles.map((x) => x.split('.')[0]))];
  const chunks = {};
  partNames.forEach((name) => { chunks[name] = chunkText(name, jsFiles.filter((x) => x.split('.')[0] === name).sort((a, b) => ['records', 'labs', 'docs'].indexOf(a.split('.')[1]) - ['records', 'labs', 'docs'].indexOf(b.split('.')[1])), read, q); });
  const idx = lazyIndex(DS, js, chunks);
  outputs.push([path.join(DS, 'spec-index.js'), '/* GENERATED by build-spec-parts.js: what the navigation, the counts and the tables read of every library record (' + idx.records.length + ' of ' + idx.count + ' records), and\n   the parts that load together. A page loads the part chunks it needs (spec-chunks/). Edit the parts, never this file. */\nwindow.DSIndex = ' + q(idx) + ';\n']);
  partNames.forEach((name) => outputs.push([path.join(DS, 'spec-chunks', name + '.js'), chunks[name]]));
  const chunkDir = path.join(DS, 'spec-chunks');
  if (!check) fs.mkdirSync(chunkDir, { recursive: true });
  // a chunk with no part (a part that was deleted) is stale
  if (fs.existsSync(chunkDir)) fs.readdirSync(chunkDir).filter((f) => f.endsWith('.js') && !partNames.includes(f.slice(0, -3))).forEach((f) => { stale.push('platform/design-system/spec-chunks/' + f); if (!check) fs.unlinkSync(path.join(chunkDir, f)); });
  for (const [out, text] of outputs) {
    if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== text) { stale.push(path.relative(root, out).split(path.sep).join('/')); if (!check) fs.writeFileSync(out, text); }
  }
  return { changed: stale.length > 0, stale, parts: files.length, chunks: partNames.length, indexed: idx.records.length };
};

if (require.main === module) { const r = module.exports(__dirname); console.log(r.skipped ? 'spec parts skipped (platform/design-system is not checked out)' : 'Built platform/design-system/spec-parts.js and ds-sample-parts.css (' + r.parts + ' part files' + (r.changed ? '' : ', unchanged') + ')'); }
