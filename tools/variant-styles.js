// Plenix · variant styles (docs/adr/0015, #116): each variation's "This variation sets" table, the declarations in rules of its
// own selector, read from the Platform's stylesheets; a hand-written side table (platform/standards/variants/styles.json,
// ADR 0013) wins for a variation the stylesheets can't show.
//   rows    [{ property, part, value, tokens: ['--plx-comp-…', '--plx-sys-…', …, '<palette value>'], condition? }]
//   apply(variants, records, root) sets variant.sets and variant.setsSource ('css' | 'table'); returns { css, table, neither }
// A variation's selector (ADR 0015): for each lab prop k: v, the modifier .plx-<block>--<v> or .plx-<block>--<k>-<v> on the block or one of its parts,
// or [data-plx-<k>="<v>"]; a State variation: its pseudo-class or state class. The item's block is the first .plx-<name>
// class of the stylesheet beside its source (record.src).
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const STATES = {
  hover: [':hover'], focus: [':focus-visible', ':focus'], pressed: [':active', '[aria-pressed="true"]'], active: [':active'],
  disabled: [':disabled', '[aria-disabled="true"]', '.is-disabled'], selected: ['[aria-selected="true"]', '.is-selected'],
  checked: [':checked', '[aria-checked="true"]'], invalid: ['[aria-invalid="true"]', '.is-invalid'], loading: ['.is-loading', '[aria-busy="true"]'],
};
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function sheetsOf(root, rel) {
  const dir = path.join(root, 'platform', path.dirname(rel));
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => path.join(dir, f));
}

// the rules of a stylesheet: [{ selector, decls: [{ prop, value }], condition }]
const parsed = new Map();
function rulesOf(file) {
  if (parsed.has(file)) return parsed.get(file);
  const out = [];
  try {
    postcss.parse(fs.readFileSync(file, 'utf8')).walkRules((r) => {
      let p = r.parent, cond = [];
      while (p && p.type !== 'root') { if (p.type === 'atrule' && p.name === 'media') cond.unshift(p.params); p = p.parent; }
      out.push({ selector: r.selector, decls: (r.nodes || []).filter((n) => n.type === 'decl').map((d) => ({ prop: d.prop, value: d.value })), condition: cond.join(' and ') });
    });
  } catch (e) { /* a stylesheet the parser can't read shows no rows */ }
  parsed.set(file, out);
  return out;
}

function blockOf(files) {
  for (const f of files) for (const r of rulesOf(f)) { const m = /\.plx-([a-z0-9]+(?:-[a-z0-9]+)*)(?![a-z0-9_-])/.exec(r.selector); if (m && !/__|--/.test(m[0])) return 'plx-' + m[1]; }
  return null;
}

// the token chain of a value: each var(--plx-…) followed through the index's refs, ending at the resolved value
function chainsOf(value, index) {
  const out = [];
  for (const m of String(value).matchAll(/var\((--plx-[a-z0-9-]+)/g)) {
    const chain = [m[1]]; let t = index.get(m[1]), n = 0;
    while (t && t.refs && t.refs.length === 1 && n++ < 12) { chain.push(t.refs[0]); t = index.get(t.refs[0]); }
    if (t && t.resolved && t.resolved.all) chain.push(t.resolved.all);
    out.push(chain);
  }
  return out;
}

function selectorsFor(v, block) {
  const pats = [];
  for (const [k, val] of Object.entries(v.props || {})) {
    if (typeof val !== 'string' && typeof val !== 'number') continue;
    const s = String(val).toLowerCase();
    pats.push(new RegExp('\\.' + esc(block) + '(?:__[a-z0-9-]+)?--' + esc(s) + '(?![a-z0-9-])'));
    // a prop-prefixed modifier, .plx-<block>--<prop>-<value> (.plx-avatar--size-sm; #353)
    pats.push(new RegExp('\\.' + esc(block) + '(?:__[a-z0-9-]+)?--' + esc(k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())) + '-' + esc(s) + '(?![a-z0-9-])'));
    pats.push(new RegExp('\\[data-plx-' + esc(k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())) + '="' + esc(s) + '"\\]'));
  }
  if (/^state/i.test(v.group || '')) {
    const key = Object.keys(STATES).find((s) => new RegExp('\\b' + s, 'i').test(v.name || ''));
    for (const st of (key ? STATES[key] : [])) pats.push(new RegExp('\\.' + esc(block) + '[^,{]*' + esc(st)));
  }
  return pats;
}

// split a selector list on its top-level commas (a comma inside :not(a, b) or :where(…) isn't a boundary)
function splitList(sel) {
  const out = []; let depth = 0, cur = '';
  for (const ch of sel) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// a selector without its :not(…) groups: a class named inside a negation is what the rule does NOT style
function withoutNot(sel) {
  let out = '', i = 0;
  while (i < sel.length) {
    if (sel.startsWith(':not(', i)) { let depth = 0, j = i + 4; for (; j < sel.length; j++) { if (sel[j] === '(') depth++; else if (sel[j] === ')') { depth--; if (depth === 0) break; } } i = j + 1; continue; }
    out += sel[i++];
  }
  return out;
}

function rowsFor(v, block, files, index) {
  const pats = selectorsFor(v, block), rows = [];
  if (!pats.length) return rows;
  for (const f of files) for (const r of rulesOf(f)) {
    const sels = splitList(r.selector).map(withoutNot).filter((s) => pats.some((p) => p.test(s)));
    if (!sels.length) continue;
    const part = (/__([a-z0-9-]+)(?![a-z0-9-])[^ >+~]*$/.exec(sels[0]) || [])[1] || 'block';
    for (const d of r.decls) {
      const row = { property: d.prop, part, value: d.value, tokens: chainsOf(d.value, index) };
      if (r.condition) row.condition = r.condition;
      rows.push(row);
    }
  }
  return rows;
}

function apply(variants, records, root) {
  const idx = new Map();
  try { for (const t of JSON.parse(fs.readFileSync(path.join(root, 'platform', 'tokens', 'tokens.index.json'), 'utf8')).tokens) idx.set(t.name, t); } catch (e) { /* no index: rows without chains */ }
  const byId = new Map(records.map((r) => [r.id, r]));
  const counts = { css: 0, table: 0, neither: [] };
  for (const v of variants) {
    if (v.styles && Array.isArray(v.styles.sets)) { v.sets = v.styles.sets; v.setsSource = 'table'; if (v.styles.why) v.setsWhy = v.styles.why; counts.table++; continue; }
    const r = byId.get(v.item), files = r && r.src ? sheetsOf(root, r.src) : [];
    const block = files.length ? blockOf(files) : null;
    const rows = block ? rowsFor(v, block, files, idx) : [];
    if (rows.length) { v.sets = rows; v.setsSource = 'css'; counts.css++; } else counts.neither.push(v.id);
  }
  return counts;
}

module.exports = { apply, rowsFor, selectorsFor, chainsOf, splitList, withoutNot };
