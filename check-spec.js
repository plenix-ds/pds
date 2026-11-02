// Checks the design system specification (platform/design-system/) against its standard (platform/design-system/STANDARD.md):
//   node check-spec.js
// Exits with 1 and lists every finding when a rule is broken. Rules still being built are listed in PENDING with the
// batch that completes them: their findings are reported (as pending) but do not fail the check until that entry is
// removed, so the gaps stay visible and nothing drifts back once a rule is done.
//
//   taxonomy   inventory-taxonomy.js has exactly the sections, subcategories and leaves of STANDARD.md §2–§3, in order
//   records    every inventory record has one canonical home: a section, subcategory and leaf that exist in the taxonomy,
//              and no two records claim the same leaf; the library parts' records (spec-parts.js) included
//   parts      every library part (platform/design-system/parts/, bundled into spec-parts.js) loads and its records build
//   sidebar    the sidebar lists every leaf (Plenix decision 1)
//   order      the item page takes its sections' order, titles and "On this page" from page-template.js (§7, decision 2)
//   template   STANDARD.md §7 states page-template.js exactly: the 17 sections in order and the variant block's fields
//   variant-block  every variant has its Figma design (the variant block's first field; pending until the block is built)
//   variants   every variant class a record's stylesheet defines (block--modifier) has its own variant card (decision 5)
//   states     every interactive record has a States table (decision 6)
//   cdn        the spec loads Plenix only through plenix-source.js, whose pinned version is package.json's
//   api        every component, pattern, provider and hook file opens with the structured header comment (batch 162):
//              "/* Plenix · Name", then Summary:, Usage:, Props: (and Behavior:, Notes:) at a 3-space indent
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SPEC = path.join(__dirname, 'platform', 'design-system');
const PLATFORM = path.join(__dirname, 'platform');
// the variant block (§7) is approved (owner, 2026-10-21) but not built: each variant's Figma design and the block on the
// variant pages come with the variant work; until then its findings are listed, not failed
const PENDING = { 'variant-block': 'the variant block on the variant pages (owner, 2026-10-21)' };
// the Web item page template: page-template.js is the one source; §7 states it and spec.js draws it
const TEMPLATE = (() => { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(SPEC, 'page-template.js'), 'utf8'), c); return c.window.DSPageTemplate; })();
const INTERACTIVE = new Set(['Action', 'Input', 'Selection', 'Navigation', 'Search', 'Filter', 'Disclosure', 'Editing', 'Drag and drop']);

const findings = {};
const add = (rule, msg) => { (findings[rule] = findings[rule] || []).push(msg); };
const read = (f) => fs.readFileSync(f, 'utf8');

// ── the standard's taxonomy (§3): "## NN. Title" then a text tree; depth 1 = subcategory, depth 2 = leaf
function standardTaxonomy() {
  const md = read(path.join(SPEC, 'STANDARD.md')).replace(/\r\n/g, '\n');   // either line ending
  const part = md.slice(md.indexOf('## 3. Canonical hierarchy'), md.indexOf('## 4. Classification standard'));
  const out = [];
  for (const block of part.split(/\n```text\n/).slice(1)) {
    const lines = block.slice(0, block.indexOf('\n```')).split('\n');
    const head = lines[0].match(/^(\d\d)\. (.+)$/);
    if (!head) continue;
    const sec = { n: head[1], title: head[2], subs: [] };
    for (const l of lines.slice(1)) {
      const m = l.match(/^((?:[│ ] {3})*)[├└]── (.+)$/);
      if (!m) continue;
      if (m[1].length === 0) sec.subs.push([m[2], []]);
      else sec.subs[sec.subs.length - 1][1].push(m[2]);
    }
    // a section with no subcategories lists its leaves directly: one unnamed subcategory (batch 325)
    if (sec.subs.length && sec.subs.every((x) => !x[1].length)) sec.subs = [['', sec.subs.map((x) => x[0])]];
    out.push(sec);
  }
  return out;
}

// files: one file, or several run in order in one context (the library parts, spec-parts.js, before inventory.js)
function load(files, global) {
  const ctx = { window: {}, console, React: { createElement: (...a) => ({ type: a[0], props: a[1] || {}, children: a.slice(2) }), useState: (v) => [v, () => {}] } };
  ctx.window.React = ctx.React; ctx.window.Plenix = new Proxy({}, { get: (_, k) => k });
  vm.createContext(ctx);
  [].concat(files).filter((f) => fs.existsSync(f)).forEach((f) => vm.runInContext(read(f), ctx, { filename: path.basename(f) }));
  let v = ctx.window[global]; if (typeof v === 'function') v = v();
  if (ctx.window.DSParts) (ctx.window.DSParts.errors || []).forEach((e) => add('parts', e));
  return v;
}

const std = standardTaxonomy();
const tax = load(path.join(SPEC, 'inventory-taxonomy.js'), 'DSTaxonomy');
const recs = load([path.join(SPEC, 'spec-parts.js'), path.join(SPEC, 'inventory.js')], 'DSInventory');

// taxonomy
if (std.length !== tax.length) add('taxonomy', 'STANDARD.md §3 has ' + std.length + ' sections, inventory-taxonomy.js ' + tax.length);
std.forEach((s, i) => {
  const t = tax[i];
  if (!t) return add('taxonomy', s.n + ' ' + s.title + ': missing from inventory-taxonomy.js');
  if (t.n !== s.n || t.title !== s.title) add('taxonomy', 'section ' + (i + 1) + ': "' + t.n + ' ' + t.title + '" should be "' + s.n + ' ' + s.title + '"');
  s.subs.forEach((sub, j) => {
    const ts = t.subs[j];
    if (!ts) return add('taxonomy', s.n + ' › ' + sub[0] + ': missing');
    if (ts[0] !== sub[0]) add('taxonomy', s.n + ' subcategory ' + (j + 1) + ': "' + ts[0] + '" should be "' + sub[0] + '"');
    const leaves = ts[1].split('|');
    if (leaves.join('|') !== sub[1].join('|')) add('taxonomy', s.n + ' › ' + sub[0] + ': leaves differ (' + leaves.filter((x) => !sub[1].includes(x)).concat(sub[1].filter((x) => !leaves.includes(x)).map((x) => 'missing ' + x)).join(', ') + ')');
  });
  if (t.subs.length > s.subs.length) add('taxonomy', s.n + ': extra subcategories ' + t.subs.slice(s.subs.length).map((x) => x[0]).join(', '));
});
if (tax.length > std.length) add('taxonomy', 'extra sections in inventory-taxonomy.js');

// records: one canonical home each
const leafOf = {};
tax.forEach((t) => t.subs.forEach((s) => s[1].split('|').forEach((l) => { leafOf[t.id + '|' + s[0] + '|' + l] = true; })));
const claimed = {}, ids = {};
recs.forEach((r) => {
  if (ids[r.id]) add('records', r.id + ': two records have this id');
  ids[r.id] = true;
  const key = r.sec + '|' + r.sub + '|' + r.leaf;
  if (!leafOf[key]) add('records', r.id + ': "' + r.sec + ' › ' + r.sub + ' › ' + r.leaf + '" is not a leaf of the taxonomy');
  if (claimed[key]) add('records', r.id + ' and ' + claimed[key] + ' claim the same leaf (' + r.leaf + ')');
  claimed[key] = r.id;
});

// the item page: spec.js declares what the sidebar lists and the page's section order
const spec = read(path.join(SPEC, 'spec.js'));
if (!/SIDEBAR_LISTS_EVERY_LEAF\s*=\s*true/.test(spec)) add('sidebar', 'the sidebar lists only the items with a Plenix page, not every leaf of §3');
// order: the item page takes its sections' order, titles and "On this page" list from the template, never a list of its own
const fromItem = spec.slice(spec.indexOf('function ItemPage'));
const itemBody = fromItem.slice(0, fromItem.indexOf('body = body.map'));
if (!/body = templateBody\(body\)/.test(itemBody)) add('order', 'spec.js ItemPage does not put its sections in the template’s order (templateBody)');
if (!/var TOC = templateToc\(body\)/.test(itemBody)) add('order', 'spec.js ItemPage does not build "On this page" from the template (templateToc)');
if (/var TOC = \[\[/.test(itemBody)) add('order', 'spec.js ItemPage has a section list of its own (var TOC = [[…): the template is the one list');
// every template section is drawn by ItemPage (its key appears as a section key)
TEMPLATE.sections.forEach((s) => { if (!new RegExp("key: '" + s.key + "'").test(spec)) add('order', 'the item page never draws "' + s.title + '" (key ' + s.key + ')'); });
// titles: written once, in the template; the page may not hard-code another title for a template section
[['spec', /'Guidelines'/], ['exh', /'Variants and examples'/], ['lab', /'Button lab'/]].forEach(([k, re]) => { if (re.test(itemBody)) add('order', 'spec.js still writes an old title for "' + TEMPLATE.sections.find((s) => s.key === k).title + '"'); });

// template: STANDARD.md §7 states the template exactly: its sections in order (number, title) and the variant block's fields
{
  const md = read(path.join(SPEC, 'STANDARD.md')).replace(/\r\n/g, '\n');
  const s7 = md.slice(md.indexOf('## 7. Documentation page template'), md.indexOf('## 8. '));
  const tableAfter = (heading) => { const t = s7.slice(s7.indexOf(heading)); return [...t.slice(0, (t.indexOf('\n### ', 4) + 1 || t.length + 1) - 1).matchAll(/^\| (\d+) \| ([^|]+?) \|/gm)].map((m) => [+m[1], m[2].trim()]); };
  const sec = tableAfter('### Sections'), vb = tableAfter('### The variant block');
  if (!sec.length) add('template', 'STANDARD.md §7 has no "### Sections" table');
  TEMPLATE.sections.forEach((s, i) => { const row = sec[i]; if (!row || row[0] !== i + 1 || row[1] !== s.title) add('template', '§7 section ' + (i + 1) + ' should be "' + s.title + '", it is ' + (row ? '"' + row[1] + '"' : 'missing')); });
  if (sec.length > TEMPLATE.sections.length) add('template', '§7 lists ' + sec.length + ' sections, the template ' + TEMPLATE.sections.length);
  TEMPLATE.variant.forEach((f, i) => { const row = vb[i]; if (!row || row[1] !== f.title) add('template', '§7 variant block field ' + (i + 1) + ' should be "' + f.title + '", it is ' + (row ? '"' + row[1] + '"' : 'missing')); });
  if (vb.length > TEMPLATE.variant.length) add('template', '§7 lists ' + vb.length + ' variant block fields, the template ' + TEMPLATE.variant.length);
  const keysSeen = new Set(); TEMPLATE.sections.forEach((s) => { if (keysSeen.has(s.key)) add('template', 'page-template.js: the key ' + s.key + ' is used twice'); keysSeen.add(s.key); });
}

// variant-block: every variant a record draws has its Figma design (the block's first field); pending until it is built
recs.forEach((r) => {
  if (/^(ios|android)-/.test(r.sec)) return;
  (r.examples || []).forEach((e) => { if (!Array.isArray(e[1])) return; e[1].forEach((v) => { if (!v || !v[0]) return; if (!(r.figma && r.figma[v[0]])) add('variant-block', r.id + ' › ' + v[0] + ': no Figma design'); }); });
});

// variants: every block--modifier class has a card (a variant entry whose third item names it: [name, render, 'plx-…--…'])
const cssOf = (r) => {
  if (!r.src) return '';
  const dir = path.join(PLATFORM, path.dirname(r.src));
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => read(path.join(dir, f))).join('\n') : '';
};
const kebab = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const blocksOf = (r) => r.blocks || (r.src && /^(components|patterns)\//.test(r.src) ? ['plx-' + kebab(r.src.split('/').slice(-2)[0])] : null);
// classes that look like variants but are not chosen by whoever uses the component (each has its reason; they are
// documented under the component's Behavior or Names)
const NOT_VARIANTS = {
  'plx-icon--inline': 'how the Icon component draws (an inline SVG, every icon it renders), not a look: a bare class name (retired, #557) draws nothing',
  'plx-icon--mirrored': 'set by the Icon component on every icon whose symbol points along the reading direction (a module by its mirrored flag, a name by its symbol; #557), so it mirrors in right to left; not a look a person picks',
  'plx-data-grid--static': 'the renderer’s static mode (Table renders it with isStatic); in DataGrid it never applies, Table’s generated base carries it',
  'plx-table--static': 'Table’s own mode, always set: the static grid (it fits the page, wraps and grows), Table’s base look, not a variant',
  'plx-data-grid--fill': 'a sizing state the height prop sets (height="100%": the grid fills its container), not a look',
  'plx-button--joined': 'set by a group (ButtonGroup, InputGroup, CopyButton field); shown on its page',
  'plx-button--joined-start-square': 'set by a group',
  'plx-button--joined-start-seam': 'set by a group',
  'plx-button--joined-end-square': 'set by a group',
  'plx-button--joined-end-seam': 'set by a group',
  'plx-select--joined': 'set by InputGroup; shown on its page',
  'plx-select--joined-start-square': 'set by InputGroup',
  'plx-select--joined-start-seam': 'set by InputGroup',
  'plx-select--joined-end-square': 'set by InputGroup',
  'plx-select--joined-end-seam': 'set by InputGroup',
  'plx-button--secondary': 'the default variant: its variant page (Secondary (default)) and the base rule draw it; the class appears in the stylesheet only for buttons on a colored surface',
  'plx-nav-pane--inline': 'a responsive mode the shell sets (the pane opens over the main region on narrow windows)',
  'plx-nav-pane--overlay': 'a responsive mode the shell sets',
  'plx-nav-pane--screen': 'a responsive mode the shell sets (Narrow windows: the pane is a screen of its own; Platforms Standard 4.1)',
  'plx-side-panel--overlay': 'a responsive mode the shell sets (the inspector opens over the main region)',
  'plx-app-header__item--account': 'AppHeader.Account sets it on its own item (no fill around the picture)',
  'plx-metric--card': 'Metric’s deprecated card prop (use MetricCard, the Metric card page); kept one release',
  'plx-table--fill': 'the grid’s modes in Table’s generated base (table-base.css from data-grid.css); a static Table never sets them',
  'plx-table--pages': 'the grid’s modes in Table’s generated base; a static Table never sets them',
  'plx-table--load-more': 'the grid’s modes in Table’s generated base; a static Table never sets them',
  'plx-table--list': 'a responsive mode the renderer sets under narrowAt when narrow is list (Table’s default is table)',
  'plx-table--narrow': 'a responsive mode the renderer sets under narrowAt',
  'plx-side-panel--resized': 'a state the panel sets once someone drags its edge (the resizable card shows it)',
  'plx-button--on-inverse': 'set by SurfaceContext inside a colored surface (TeachingBubble); shown on its page',
  'plx-button--on-accent': 'set by SurfaceContext inside a colored surface (the accent AppHeader); shown on its page',
  'plx-icon--outline': 'filled={false}: the owner of a state keeps the outline (Tree, NavList); the default look',
};
const ICON_NAMES = new Set(Object.keys(JSON.parse(read(path.join(PLATFORM, 'icons', 'map.json'))).map).map((n) => 'plx-icon--' + n));
const claimedMods = new Set();
recs.forEach((r) => { (r.blocks || []).forEach((b) => claimedMods.add(b)); });
recs.forEach((r) => {
  const blocks = blocksOf(r);
  if (!blocks || (!r.blocks && claimedMods.has(blocks[0]))) return;
  const css = cssOf(r);
  const mods = new Set();
  // a class name runs to its end: an underscore keeps it whole (Icon's Material spellings, plx-icon--chevron_left), and
  // those aliases are names of the same icons, not variants of their own
  blocks.forEach((b) => { for (const m of css.matchAll(new RegExp('\\.(' + b + '--[a-z0-9_-]+)', 'g'))) if (!m[1].includes('_')) mods.add(m[1]); });
  const shown = new Set();
  (r.examples || []).forEach((e) => { if (Array.isArray(e[1])) e[1].forEach((v) => { if (v[2]) [].concat(v[2]).forEach((c) => shown.add(c)); }); });
  const own = r.variantClasses ? new Set(r.variantClasses) : null;
  // a modifier another record claims as its block (a block claimed by two records) is shown on that record's page
  const missing = [...mods].filter((m) => !shown.has(m) && !claimedMods.has(m) && !NOT_VARIANTS[m] && !ICON_NAMES.has(m) && (!own || own.has(m)));
  if (missing.length) add('variants', r.id + ': no card for ' + missing.join(', '));
});

// states
// a record's states come from its hand-written table (r.states) or from its stylesheet's state rules (the spec reads them)
const STATE_RE = /:hover|:focus-visible|:focus(?![\w-])|:disabled|:checked|\[aria-(selected|pressed|checked|current|disabled|invalid|busy|expanded|readonly)|\[readonly\]|\.is-(selected|current|loading|active|pressed|error|success|expanded)(?![\w-])/;
recs.forEach((r) => {
  if (![].concat(r.interaction || []).some((x) => INTERACTIVE.has(x)) || r.states || r.statesFrom || r.stateNote) return;
  const blocks = blocksOf(r) || [];
  const css = cssOf(r).replace(/\/\*[\s\S]*?\*\//g, '');
  const all = css.match(/[^{}]+\{[^{}]*\}/g) || [];
  const own = all.filter((rule) => blocks.some((b) => rule.split('{')[0].includes('.' + b)));
  const mine = r.blocks ? own : all;   // without its own blocks the spec reads the whole stylesheet of its folder
  if (!mine.some((rule) => STATE_RE.test(rule.split('{')[0]))) add('states', r.id + ' (' + [].concat(r.interaction).join(', ') + '): no States table and no state rules in its stylesheet' + (r.stateNote ? '' : ''));
});

// api: the structured header comment
for (const dir of ['components', 'patterns', 'providers', 'hooks']) {
  const base = path.join(PLATFORM, dir);
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => f.isDirectory() ? walk(path.join(d, f.name)) : [path.join(d, f.name)]);
  for (const f of walk(base).filter((x) => /\.(jsx|js|tsx|ts)$/.test(x) && !/\.d\.ts$/.test(x) && !/providers[\\/]apps\.ts$/.test(x))) {
    const c = (read(f).match(/^\s*\/\*([\s\S]*?)\*\//) || [])[1] || '';
    const rel = path.relative(PLATFORM, f).split(path.sep).join('/');
    if (!/^ Plenix · [^\n:]+\r?\n/.test(c)) add('api', rel + ': the first line is not "/* Plenix · Name"');
    for (const sec of ['Summary', 'Usage', 'Props']) if (!new RegExp('\\n {3}' + sec + ':').test(c)) add('api', rel + ': no ' + sec + ': section');
  }
}

// sizes: every size token the spec names must exist. A preview width (box(860, …), W(860)) becomes
// var(--plx-ref-size-860px); a missing token makes the width invalid, and the preview shrinks to its content
// (EntityHeader, a size container, collapsed to a 41px strip).
{
  const defined = new Set(Object.keys((JSON.parse(read(path.join(PLATFORM, 'tokens', 'reference.tokens.json'))).ref || {}).size || {}).map((k) => '--plx-ref-' + k));
  if (!defined.size) JSON.stringify(JSON.parse(read(path.join(PLATFORM, 'tokens', 'reference.tokens.json'))), (k, v) => { if (/^size-\d+px$/.test(k)) defined.add('--plx-ref-' + k); return v; });
  const dsDir = path.join(PLATFORM, 'design-system');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => f.isDirectory() ? (f.name === 'node_modules' ? [] : walk(path.join(d, f.name))) : [path.join(d, f.name)]);
  const seen = {};
  for (const f of walk(dsDir).filter((x) => /\.(js|css|html)$/.test(x) && !/(^|[\\/])(spec-parts|reviewed)\.js$/.test(x))) {
    const t = read(f), rel = path.relative(PLATFORM, f).split(path.sep).join('/');
    const names = [...(t.match(/--plx-ref-size-\d+px/g) || []), ...[...t.matchAll(/\b(?:box|W)\((\d+)[,)]/g)].map((m) => '--plx-ref-size-' + m[1] + 'px')];
    for (const n of names) if (!defined.has(n)) (seen[n] = seen[n] || new Set()).add(rel);
  }
  for (const [n, files] of Object.entries(seen)) add('sizes', n + ' is not a token (platform/tokens/reference.tokens.json), used in ' + [...files].slice(0, 4).join(', ') + (files.size > 4 ? ' and ' + (files.size - 4) + ' more' : ''));
}

// cdn: the spec is a consumer of the CDN (owner, 2026-10-25). plenix-source.js holds the one version setting, which is
// package.json's version (it moves at a release, VERSIONING.md); every other spec file loads Plenix through it
// (PlenixSource), never through a path into this checkout (../platform.css, ../dist/, ../system/, ../icons/ …)
// The rule applies from the spec version that has plenix-source.js (plenix-design-system#5); an older pointer is checked
// as before, so this check and the spec can land in either order.
const SPEC_ON_CDN = fs.existsSync(path.join(SPEC, 'plenix-source.js'));
if (SPEC_ON_CDN) {
  const src = path.join(SPEC, 'plenix-source.js');
  {
    const pinned = (/var VERSION = '([^']+)'/.exec(read(src)) || [])[1];
    const version = JSON.parse(read(path.join(__dirname, 'package.json'))).version;
    if (pinned !== version) add('cdn', 'plenix-source.js pins ' + pinned + ', package.json is ' + version + ': set VERSION to the release (VERSIONING.md, Releasing, step 2)');
  }
  const LOCAL = /['"(]\.\.\/(platform\.css|plenix-system\.css|dist|vendor|providers|system|components|patterns|hooks|icons|brand|fonts|dev|standards|tokens|mobile)\//;
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => f.isDirectory() ? (f.name === 'node_modules' ? [] : walk(path.join(d, f.name))) : [path.join(d, f.name)]);
  for (const f of walk(SPEC).filter((x) => /\.(js|html|css)$/.test(x) && !/[\\/](plenix-source|native-guidance-full)\.js$/.test(x))) {
    read(f).split('\n').forEach((line, i) => { const m = LOCAL.exec(line); if (m && !/^\s*(\/\/|\*|\/\*)/.test(line)) add('cdn', path.relative(PLATFORM, f).split(path.sep).join('/') + ':' + (i + 1) + ' loads ' + m[0].slice(1) + '… from this checkout: use PlenixSource (plenix-source.js)'); });
  }
}

// color-samples: every color sample in the spec is a bar 120px wide (owner, 2026-10-28, option A; #263). A sample is an empty block with no content of its own, so a
// width that is missing, smaller or left to shrink collapses it in a table cell to its 2px border and the colors seem to be gone. The samples are .ds-swatch (token
// tables and cards) and .ds-vis--color (role pages and variant token tables); each must say inline-size: var(--plx-ref-size-120px) and flex-shrink: 0, and no rule
// for it may say another inline-size, width or min-inline-size. The stylesheet read is the one the spec will have: a lane's (lanes/*/design-system/spec.css) when
// one carries it, else the pinned spec's. The rule proves itself on the two fixtures in tools/fixtures/spec-color-samples/: the good one passes, the shrunk one fails.
function colorSampleFindings(css, label) {
  const BAR = 'var(--plx-ref-size-120px)', SAMPLES = ['.ds-swatch', '.ds-vis--color'], out = [], got = {};
  SAMPLES.forEach((s) => { got[s] = { size: [], shrink: [] }; });
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const sel of m[1].split(',').map((x) => x.trim())) {
      const last = sel.split(/[\s>+~]+/).pop().replace(/::?[\w-]+(\([^)]*\))?/g, '');
      if (!SAMPLES.includes(last)) continue;
      for (const d of m[2].split(';')) {
        const [p, ...v] = d.split(':'), prop = (p || '').trim(), val = v.join(':').trim();
        if (/^(inline-size|width|min-inline-size|min-width)$/.test(prop)) got[last].size.push({ sel, prop, val });
        if (prop === 'flex-shrink') got[last].shrink.push({ sel, val });
      }
    }
  }
  for (const s of SAMPLES) {
    const g = got[s];
    if (!g.size.some((x) => x.prop === 'inline-size' && x.val === BAR)) out.push(label + ': ' + s + ' has no inline-size: ' + BAR);
    g.size.filter((x) => x.val !== BAR).forEach((x) => out.push(label + ': ' + x.sel + ' says ' + x.prop + ': ' + x.val + ' (a color sample is ' + BAR + ')'));
    if (!g.shrink.length || g.shrink.some((x) => x.val !== '0')) out.push(label + ': ' + s + ' must say flex-shrink: 0 (in a flex row a sample shrinks to its border)');
  }
  return out;
}
{
  const lanesDir = path.join(__dirname, 'lanes');
  const laneCss = fs.existsSync(lanesDir) ? fs.readdirSync(lanesDir).map((d) => path.join(lanesDir, d, 'design-system', 'spec.css')).filter((f) => fs.existsSync(f)) : [];
  const fromLane = laneCss.length > 0, file = process.env.COLOR_SAMPLES_CSS || (fromLane ? laneCss[laneCss.length - 1] : path.join(SPEC, 'spec.css'));   // COLOR_SAMPLES_CSS: try the rule on another stylesheet
  colorSampleFindings(read(file), path.relative(__dirname, file).split(path.sep).join('/')).forEach((m) => add('color-samples', m));
  const fx = path.join(__dirname, 'tools', 'fixtures', 'spec-color-samples');
  if (colorSampleFindings(read(path.join(fx, 'good.css')), 'fixture good.css').length) add('color-samples', 'the check fails on its good fixture (tools/fixtures/spec-color-samples/good.css): the rule is broken');
  if (!colorSampleFindings(read(path.join(fx, 'shrunk.css')), 'fixture shrunk.css').length) add('color-samples', 'the check does not fail on its shrunk fixture (tools/fixtures/spec-color-samples/shrunk.css): the rule is broken');
}


// lazy: the index and the chunks give the same records as the bundle (issue 882, item 13). Each record's group is loaded alone
// in a fresh page of its own (spec-lazy.js against the real inventory.js, a stand-in for script loading), and the loaded record
// must equal the bundle's: the same fields, the same values, the same example code. Then every chunk is loaded in one page
// and the written sections must equal the bundle's.
async function lazyCheck() {
  const idxFile = path.join(SPEC, 'spec-index.js');
  if (!fs.existsSync(idxFile)) return;
  const same = (a, b) => typeof a === 'function' ? typeof b === 'function' && String(a) === String(b)
    : Array.isArray(a) ? Array.isArray(b) && a.length === b.length && a.every((x, i) => same(x, b[i]))
    : a && typeof a === 'object' ? b && typeof b === 'object' && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((k) => same(a[k], b[k]))
    : a === b;
  const page = () => {
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} }, React: { createElement: (...a) => ({ type: a[0], props: a[1] || {}, children: a.slice(2) }), useState: (v) => [v, () => {}] } };
    ctx.window.React = ctx.React; ctx.window.Plenix = new Proxy({}, { get: (_, k) => k }); ctx.window.window = ctx.window; ctx.window.DSDocs = {};
    ctx.document = { currentScript: { src: 'file:///x/spec-lazy.js' }, createElement: () => ({}), head: { appendChild: (s) => { const f = path.join(SPEC, s.src.replace('file:///x/', '')); vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: path.basename(f) }); } } };
    vm.createContext(ctx);
    for (const f of ['spec-index.js', 'spec-lazy.js', 'inventory.js']) vm.runInContext(read(path.join(SPEC, f)), ctx, { filename: f });
    return ctx.window;
  };
  const eager = {}; recs.forEach((r) => { eager[r.id] = r; });
  const w0 = page(), I = w0.DSIndex, ids = I.records.map((r) => r.id);
  if (w0.DSInventory.length !== recs.length) add('lazy', 'the lazy page lists ' + w0.DSInventory.length + ' records, the bundle ' + recs.length);
  w0.DSInventory.forEach((r, i) => { if (r.id !== recs[i].id) add('lazy', 'record ' + i + ' is ' + r.id + ' lazy, ' + recs[i].id + ' in the bundle (the order differs)'); });
  // before any part loads, the records the parts change read in the lists as the bundle leaves them (the home's counts and lists)
  for (const id of Object.keys(I.base || {})) {
    const r = w0.DSInventory.find((x) => x.id === id), e = eager[id];
    const bad = Object.keys(I.base[id]).filter((k) => k !== 'variantPages' && k !== 'lab' && !same(e[k], r[k]));
    if (bad.length) add('lazy', id + ' (before its parts load) differs from the bundle in: ' + bad.join(', '));
  }
  const done = {};
  for (const id of ids) {
    const part = I.records.find((r) => r.id === id).part, key = [part].concat((w0.DSLazy.partsFor(id))).join('|');
    if (done[key]) continue; done[key] = true;
    const w = page(); await w.DSLazy.load(id);
    for (const n of w.DSLazy.partsFor(id)) {
      for (const r of w.DSInventory.filter((x) => x.part === n)) {
        const e = eager[r.id], keys = Object.keys(e).filter((k) => k !== 'part');
        const bad = keys.filter((k) => !same(e[k], r[k])).concat(Object.keys(r).filter((k) => k !== 'part' && !(k in e)));
        if (bad.length) add('lazy', r.id + ' (' + n + ', loaded by ' + id + ') differs from the bundle in: ' + bad.slice(0, 6).join(', '));
      }
    }
  }
  // the records that no part owns, with the parts that add to them
  for (const id of Object.keys(I.touch)) {
    if (I.records.some((r) => r.id === id)) continue;
    const w = page(); await w.DSLazy.load(id);
    const r = w.DSInventory.find((x) => x.id === id), e = eager[id];
    const bad = Object.keys(e).filter((k) => !same(e[k], r[k]));
    if (bad.length) add('lazy', id + ' (loaded with ' + I.touch[id].join(', ') + ') differs from the bundle in: ' + bad.slice(0, 6).join(', '));
  }
  // the labs: a page draws the lab its record names (labId, a variant page's, an extra lab); the lab it gets after its own parts
  // load must be the one the bundle ends with (the last part to register it wins)
  const labRun = (code) => {
    // a stand-in for the spec's helpers: any property is another stand-in (a lab part may build on another lab's spec)
    const any = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'then' ? undefined : any()), apply: () => any(), construct: () => any() });
    const reg = {}, DSS = new Proxy({ registerLab: (id, spec) => { reg[id] = JSON.stringify(spec, (k, v) => (typeof v === 'function' ? 'fn:' + String(v) : v)); } }, { get: (t, k) => (k in t ? t[k] : any()) });
    const c = { window: { DS: DSS, DSLabs: {} }, console: { log() {}, warn() {}, error() {} } };
    c.window.window = c.window; c.DS = c.window.DS; vm.createContext(c);
    for (const t of [].concat(code)) { try { vm.runInContext(t, c); } catch (e) { /* a part that reads helpers the stand-in lacks */ } }
    return reg;
  };
  const labsEager = labRun(read(path.join(SPEC, 'spec-parts.js')));
  const labIdsOf = (r) => [r.labId || r.id].concat((r.variantPages || []).map((v) => v.labId), (r.extraLabs || []).map((x) => x.id)).filter(Boolean);
  for (const r of recs) {
    const mine = labIdsOf(r).filter((l) => labsEager[l]);
    if (!mine.length) continue;
    const parts = w0.DSLazy.partsFor(r.id);
    const lazy = labRun(parts.map((n) => read(path.join(SPEC, 'spec-chunks', n + '.js'))));
    for (const l of mine) if (lazy[l] !== labsEager[l]) add('lazy', r.id + ': the lab ' + l + ' its page draws is not the bundle\'s after its parts (' + parts.join(', ') + ') load');
  }
  // all chunks in one page: every record equals the bundle's
  const wa = page(); for (const id of ids.concat(Object.keys(I.touch))) await wa.DSLazy.load(id);
  for (const r of wa.DSInventory) { const e = eager[r.id]; const bad = Object.keys(e).filter((k) => !same(e[k], r[k])); if (bad.length) add('lazy', r.id + ' (all chunks loaded) differs from the bundle in: ' + bad.slice(0, 6).join(', ')); }
  const bundleDocs = load([path.join(SPEC, 'spec-parts.js')], 'DSParts').docs.reduce((o, d) => Object.assign(o, d), {});
  for (const id of Object.keys(bundleDocs)) if (!same(bundleDocs[id], wa.DSDocs && wa.DSDocs[id])) add('lazy', 'the written sections of ' + id + ' differ after every chunk loads');
}

lazyCheck().then(() => {
// report
let failed = 0;
for (const rule of ['taxonomy', 'records', 'parts', 'sidebar', 'order', 'template', 'variant-block', 'variants', 'states', 'api', 'sizes', 'color-samples', 'cdn', 'lazy']) {
  const list = findings[rule] || [];
  const pending = PENDING[rule];
  if (!list.length) { console.log('ok       ' + rule); continue; }
  if (pending) { console.log('pending  ' + rule + ' (' + list.length + ', until ' + pending + ')'); list.slice(0, process.env.ALL ? 999 : 5).forEach((m) => console.log('           ' + m)); if (list.length > 5 && !process.env.ALL) console.log('           … and ' + (list.length - 5) + ' more'); continue; }
  failed += list.length;
  console.log('FAIL     ' + rule + ' (' + list.length + ')'); list.forEach((m) => console.log('           ' + m));
}
console.log(failed ? '\n' + failed + ' finding(s)' : '\nSPEC_OK (' + std.reduce((n, s) => n + s.subs.reduce((m, x) => m + x[1].length, 0), 0) + ' leaves, ' + recs.length + ' records)');
process.exit(failed ? 1 : 0);
}).catch((e) => { console.error(e); process.exit(1); });
