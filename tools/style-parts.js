// require('./tools/style-parts.js').split(plenixCss) -> { foundations, parts, report }   (issue 710, option S1)
// The styles package's per-part files, cut from the built plenix.css (release/packages/styles/plenix.css, esbuild's bundle of
// platform/platform.css), so every rule keeps its layer, its conditions and its text, and the CDN files stay exactly as they are.
//   foundations.css     the layer-order line and every foundation file (tokens, theme, reset, layout, utilities), loaded once
//   parts/<part>.css    one part's rules: its own stylesheets (platform/<group>/<Part>/*.css, platform/charts/<name>.css),
//                       its component settings from system/tokens/components.css (--plx-comp-<part>-*), its rules from
//                       system/steps.css (.plx-<part>…), and an @import of each part it needs: the parts its React source
//                       imports (the per-module graph of #685) and the parts that define a custom property it reads
// A rule is never cut or rewritten: a component-settings block is split by declaration, each part keeping its own
// declarations under the same selector, layer and conditions. tools/agent/style-parts-check.js proves the union.
'use strict';
const fs = require('fs'), path = require('path');
const postcss = require('postcss');

const ROOT = path.resolve(__dirname, '..');
const P = path.join(ROOT, 'platform');
const FOUNDATIONS = '';   // the owner name of the foundations
// files cut by declaration or by rule, instead of owned whole
const TOKENS = 'platform/system/tokens/components.css', STEPS = 'platform/system/steps.css';
// parts whose source is not one folder: the chart files in platform/charts (one part per stylesheet), and three shared ones
const SOURCES = { 'chart-parts': ['platform/charts/parts'], 'chart-a11y': ['platform/charts/a11y.js'], 'chart-interaction': ['platform/charts/interaction.js', 'platform/charts/useChartInteraction.js'],
  floating: ['platform/utils/floating.ts'], virtual: ['platform/hooks/useVirtualizer.ts'], dnd: ['platform/utils/dnd.ts'],
  'chart-base': ['platform/charts/ChartFrame.jsx', 'platform/utils/dataviz.ts'] };
// foundation files that only some parts use: their own part, needed by the parts whose source imports the module that
// writes their attributes (SOURCES above). The source files stay where they are, so platform.css and the CDN do not change
const SYSTEM_PARTS = { 'platform/system/floating.css': 'floating', 'platform/system/virtual.css': 'virtual', 'platform/system/dnd.css': 'dnd',
  'platform/system/charts.css': 'chart-base', 'platform/system/dataviz.css': 'chart-base', 'platform/system/keylines.css': 'keylines',
  // the one-purpose classes (plx-u-*) are for an application's own layout; no part draws with them. Their layer
  // (plx.utilities, last) makes them win wherever the file loads
  'platform/system/utilities.css': 'utilities' };
// steps rules keyed by a page attribute instead of a plx- class: the panel widths are SidePanel's
const STEP_ATTRIBUTES = [[/^:root\[data-plx-panel-/, 'side-panel']];

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
// a stylesheet's owner: a part's name, or FOUNDATIONS
function ownerOf(rel) {
  if (SYSTEM_PARTS[rel]) return SYSTEM_PARTS[rel];
  let m = /^platform\/[a-z]+\/([A-Z][A-Za-z0-9]*)\/[^/]+\.css$/.exec(rel);
  if (m) return kebab(m[1]);
  m = /^platform\/charts\/(?:parts\/)?([a-z0-9-]+)\.css$/.exec(rel);
  if (m) return m[1];
  return FOUNDATIONS;
}
// the source files (JSX, JS) of a part, from the files that brought its stylesheets
function sourcesOf(part, cssFiles) {
  const out = new Set();
  const add = (abs) => {
    if (!fs.existsSync(abs)) return;
    if (fs.statSync(abs).isDirectory()) fs.readdirSync(abs).filter((f) => /\.[jt]sx?$/.test(f) && !/\.d\.ts$/.test(f)).forEach((f) => out.add(path.join(abs, f)));
    else out.add(abs);
  };
  if (SOURCES[part]) SOURCES[part].forEach((s) => add(path.join(ROOT, s)));
  for (const rel of cssFiles) {
    const dir = path.join(ROOT, path.dirname(rel));
    if (/^platform\/charts\/[^/]+\.css$/.test(rel)) fs.readdirSync(dir).filter((f) => /\.[jt]sx?$/.test(f) && kebab(f.replace(/\.[jt]sx?$/, '')) === part).forEach((f) => add(path.join(dir, f)));
    else if (!/^platform\/(charts|system)\//.test(rel)) add(dir);
  }
  return [...out];
}
const importsOf = (file) => [...fs.readFileSync(file, 'utf8').matchAll(/(?:from|import)\s*['"](\.{1,2}\/[^'"]+)['"]/g)].map((m) => path.resolve(path.dirname(file), m[1]));

// the part a custom property belongs to by its name: --plx-comp-<key>-…, the longest key that matches (keys: Map of a part's
// name and the blocks it draws -> the part)
function tokenOwner(prop, keys) {
  if (!prop.startsWith('--plx-comp-')) return FOUNDATIONS;
  const rest = prop.slice(11);
  let best = '';
  for (const k of keys.keys()) if ((rest === k || rest.startsWith(k + '-')) && k.length > best.length) best = k;
  return best ? keys.get(best) : FOUNDATIONS;
}
// the part a steps rule belongs to: the block of its first plx- class, else a page attribute it is keyed by
function stepOwner(selector, keys) {
  const m = /\.plx-([a-z0-9]+(?:-[a-z0-9]+)*?)(?=__|--|[^a-z0-9-]|$)/.exec(selector);
  if (m) return keys.get(m[1]) || FOUNDATIONS;
  const a = STEP_ATTRIBUTES.find(([re]) => re.test(selector));
  return a && keys.has(a[1]) ? a[1] : FOUNDATIONS;
}
// the blocks each part draws: a block (.plx-<block>, before __ or --) belongs to the part whose own stylesheets start the most
// rules with it (a part also styles its neighbors in context, with fewer rules)
function blockKeys(names, frags) {
  const counts = new Map();   // block -> Map(part -> rules)
  for (const n of names) for (const text of frags.get(n)) postcss.parse(text).walkRules((r) => {
    for (const sel of r.selectors || []) {
      const m = /^\.plx-([a-z0-9]+(?:-[a-z0-9]+)*?)(?=__|--|[^a-z0-9-]|$)/.exec(sel.trim());
      if (!m) continue;
      if (!counts.has(m[1])) counts.set(m[1], new Map());
      const c = counts.get(m[1]); c.set(n, (c.get(n) || 0) + 1);
    }
  });
  const keys = new Map([...names].map((n) => [n, n]));
  for (const [block, c] of counts) if (!keys.has(block)) keys.set(block, [...c].sort((a, b) => b[1] - a[1])[0][0]);
  return keys;
}
// a copy of node with only the declarations keepDecl accepts, or only the rules keepRule accepts; its comments (the other
// parts' section notes) and the rules and at-rules left empty are dropped
function filtered(node, keepDecl, keepRule) {
  const copy = node.clone();
  copy.walkComments((c) => c.remove());
  if (keepDecl) copy.walkDecls((d) => { if (!keepDecl(d)) d.remove(); });
  if (keepRule) copy.walkRules((r) => { if (!keepRule(r)) r.remove(); });
  for (let changed = true; changed;) {
    changed = false;
    copy.walk((n) => { if ((n.type === 'rule' || n.type === 'atrule') && n.nodes && !n.nodes.length) { n.remove(); changed = true; } });
  }
  return copy.nodes && copy.nodes.length ? copy : null;
}

function split(css) {
  const root = postcss.parse(css);
  // pass 1: which file each top-level node came from (esbuild writes /* platform/<file>.css */ before each file)
  let file = null;
  const items = [];
  for (const node of root.nodes) {
    if (node.type === 'comment' && /^platform\/\S+\.css$/.test(node.text.trim())) { file = node.text.trim(); continue; }
    items.push({ file, node });
  }
  const filesOf = new Map();   // part -> its stylesheets
  for (const { file: f } of items) { const o = f ? ownerOf(f) : FOUNDATIONS; if (o) { if (!filesOf.has(o)) filesOf.set(o, new Set()); filesOf.get(o).add(f); } }
  const names = new Set(filesOf.keys());
  // pass 2: each owner's fragments, in plenix.css order
  // first the files owned whole (they tell which blocks each part draws), then the two cut files, each piece at its place
  const placed = new Map([[FOUNDATIONS, []], ...[...names].map((n) => [n, []])]);   // owner -> [[index, text]]
  // a statement at-rule (the layer-order line) keeps its semicolon, which belongs to its parent in the parsed tree
  const text = (node) => node.toString() + (node.type === 'atrule' && !node.nodes ? ';' : '');
  items.forEach(({ file: f, node }, i) => { if (f !== TOKENS && f !== STEPS) placed.get(f ? ownerOf(f) : FOUNDATIONS).push([i, text(node)]); });
  const keys = blockKeys(names, new Map([...placed].map(([o, list]) => [o, list.map((x) => x[1])])));
  items.forEach(({ file: f, node }, i) => {
    if (f !== TOKENS && f !== STEPS) return;
    const owners = new Set();
    if (f === TOKENS) node.walkDecls((d) => owners.add(tokenOwner(d.prop, keys)));
    else node.walkRules((r) => owners.add(stepOwner(r.selector, keys)));
    for (const o of owners) {
      const kept = f === TOKENS ? filtered(node, (d) => tokenOwner(d.prop, keys) === o, null) : filtered(node, null, (r) => stepOwner(r.selector, keys) === o);
      if (kept) placed.get(o).push([i, kept.toString()]);
    }
  });
  const frags = new Map([...placed].map(([o, list]) => [o, list.sort((a, b) => a[0] - b[0]).map((x) => x[1])]));
  // pass 3: what each part needs. The React source's imports (through modules that draw nothing), then the custom properties
  // it reads that another part defines
  const partOfSource = new Map();
  const sources = new Map([...names].map((n) => [n, sourcesOf(n, filesOf.get(n))]));
  for (const [n, list] of sources) for (const s of list) if (!partOfSource.has(s)) partOfSource.set(s, n);
  const deps = new Map([...names].map((n) => [n, new Set()]));
  for (const [n, list] of sources) {
    const seen = new Set(list), queue = [...list];
    while (queue.length) {
      const s = queue.shift();
      for (const imp of importsOf(s)) {
        const abs = [imp, imp + '.jsx', imp + '.js', imp + '.tsx', imp + '.ts'].find((x) => fs.existsSync(x) && fs.statSync(x).isFile());
        if (!abs || seen.has(abs)) continue;
        seen.add(abs);
        const owner = partOfSource.get(abs);
        if (owner && owner !== n) deps.get(n).add(owner);
        else if (!owner) queue.push(abs);   // a hook or a helper: what it imports counts for the part
      }
    }
  }
  const defined = new Map();   // custom property -> the owners that define it
  const define = (prop, o) => { if (!defined.has(prop)) defined.set(prop, new Set()); defined.get(prop).add(o); };
  const used = new Map([...frags.keys()].map((o) => [o, new Set()]));
  const frames = new Map(), animates = new Map([...frags.keys()].map((o) => [o, new Set()]));   // @keyframes name -> owner; names a part animates with
  for (const [o, list] of frags) for (const text of list) {
    const r = postcss.parse(text);
    r.walkDecls((d) => {
      if (d.prop.startsWith('--')) define(d.prop, o);
      for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) used.get(o).add(m[1]);
      if (/^(-webkit-)?animation(-name)?$/.test(d.prop)) d.value.split(/[\s,]+/).forEach((w) => animates.get(o).add(w));
    });
    r.walkAtRules('property', (a) => define(a.params.trim(), o));
    r.walkAtRules(/^(-webkit-)?keyframes$/, (a) => { if (!frames.has(a.params.trim())) frames.set(a.params.trim(), o); });
  }
  // an animation drawn from another part's @keyframes needs that part
  for (const n of names) for (const w of animates.get(n)) {
    const owner = frames.get(w);
    if (owner && owner !== FOUNDATIONS && owner !== n) deps.get(n).add(owner);
  }
  // a property belongs to the part its name says (--plx-comp-<part>-…), and counts when that part defines it: a container
  // that sets another part's context hook (--plx-comp-avatar-context-size on a Chat message) does not make the hook its own
  const tokenDeps = [];
  for (const n of names) for (const v of used.get(n)) {
    const owner = tokenOwner(v, keys), at = defined.get(v);
    if (owner === FOUNDATIONS || owner === n || !at || !at.has(owner)) continue;
    if (!deps.get(n).has(owner)) { deps.get(n).add(owner); tokenDeps.push(n + ' -> ' + owner + ' (' + v + ')'); }
  }
  return { frags, deps, names, filesOf, tokenDeps, keys };
}

// the files: { 'foundations.css': text, 'parts/<n>.css': text }
function files(css, version) {
  const { frags, deps, names, tokenDeps } = split(css);
  const head = (what) => '/* @plenix-ds/styles ' + version + ' · ' + what + ' (generated from plenix.css by tools/style-parts.js; issue 710) */\n';
  const render = () => {
    const out = { 'foundations.css': head('foundations.css: the layer order and the base every page needs. Load it once, before any part') + frags.get(FOUNDATIONS).join('\n') + '\n' };
    for (const n of [...names].sort()) {
      const imports = [...deps.get(n)].sort().map((d) => '@import "./' + d + '.css";\n').join('');
      out['parts/' + n + '.css'] = head('parts/' + n + '.css: load foundations.css first') + imports + frags.get(n).join('\n') + '\n';
    }
    return out;
  };
  // ties keep plenix.css's order: where two parts' rules can meet on one element with the same weight, the later part
  // imports the earlier one, so it always loads after it (never when that would make a cycle: the check reports those)
  const { analyze } = require('./agent/style-parts-check.js');
  const reach = (from, to, seen = new Set()) => from === to || (!seen.has(from) && (seen.add(from), [...deps.get(from)].some((d) => reach(d, to, seen))));
  const orderDeps = [];
  for (let round = 0; round < 5; round++) {
    const out = render();
    const texts = new Map(Object.entries(out).map(([f, t]) => [f === 'foundations.css' ? 'foundations' : f.slice(6, -4), t]));
    const { pairs } = analyze(css, texts, new Map([...deps].map(([n, s]) => [n, [...s]])));
    let added = 0;
    for (const [a, b] of pairs) {
      if (a === 'foundations' || b === 'foundations' || reach(a, b)) continue;
      deps.get(b).add(a); orderDeps.push(b + ' -> ' + a); added++;
    }
    if (!added) return { out, deps, tokenDeps, orderDeps };
  }
  return { out: render(), deps, tokenDeps, orderDeps };
}

module.exports = { split, files, ownerOf, kebab, FOUNDATIONS };
