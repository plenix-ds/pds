// Plenix · variant records (docs/adr/0013, #117): every variation of the design spec as a record of its own, derived from
// the variantPages its item writes (vp(leaf, group, name, lab, text, use, avoid)): no content moves.
//   id      `${item.id}--${slug(group)}-${slug(name)}`, e.g. "brand-logo--tone-one-color"; unique, or the build stops
//   fields  item, group, name, leaf, props (the lab props), text, use, avoid, labId, then each side table's field
// Side tables (platform/standards/variants/<field>.json, { "<variant id>": value }) add a field per variation (styles #116,
// figma #251, platforms, mappings); a key that is no variant id is a problem. variant-redirects.json maps a renamed
// variation's old id to its new one, so links keep working.
//   derive(records, root) -> { variants: [record], byItem: { itemId: [id] }, redirects, problems: [text] }
//   loadInventory(root)  -> the spec's records (as build-packages.js reads them: the parts, the inventory, the docs)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const slug = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function sideTables(root) {
  const dir = path.join(root, 'platform', 'standards', 'variants'), out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => /\.json$/.test(x) && x !== 'variant-redirects.json').sort()) {
    out[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  }
  return out;
}

function derive(records, root) {
  const variants = [], byItem = {}, seen = new Map(), problems = [];
  for (const r of records || []) {
    for (const v of (r && r.variantPages) || []) {
      const id = r.id + '--' + slug(v.group) + '-' + slug(v.name);
      if (seen.has(id)) { problems.push('two variations have the id ' + id + ' (' + seen.get(id) + ' and ' + v.leaf + '): give one another name in its group'); continue; }
      seen.set(id, v.leaf);
      const rec = { id, item: r.id, group: v.group, name: v.name, leaf: v.leaf };
      if (v.lab && typeof v.lab === 'object') rec.props = v.lab;
      if (v.text) rec.text = v.text;
      if (v.use) rec.use = v.use;
      if (v.avoid) rec.avoid = v.avoid;
      if (v.labId) rec.labId = v.labId;
      variants.push(rec);
      (byItem[r.id] = byItem[r.id] || []).push(id);
    }
  }
  const tables = root ? sideTables(root) : {};
  for (const [field, table] of Object.entries(tables)) {
    for (const [id, value] of Object.entries(table)) {
      if (id.startsWith('$')) continue;
      const rec = variants.find((x) => x.id === id);
      if (!rec) problems.push('platform/standards/variants/' + field + '.json: ' + id + ' is no variant id'); else rec[field] = value;
    }
  }
  let redirects = {};
  const rf = root && path.join(root, 'platform', 'standards', 'variants', 'variant-redirects.json');
  if (rf && fs.existsSync(rf)) {
    redirects = JSON.parse(fs.readFileSync(rf, 'utf8'));
    for (const [from, to] of Object.entries(redirects)) {
      if (from.startsWith('$')) continue;
      if (seen.has(from)) problems.push('variant-redirects.json: ' + from + ' is still a variant id (a redirect is for a renamed one)');
      if (!seen.has(to)) problems.push('variant-redirects.json: ' + from + ' -> ' + to + ', which is no variant id');
    }
  }
  return { variants, byItem, redirects, problems };
}

function loadInventory(root) {
  const DS = path.join(root, 'platform', 'design-system');
  if (!fs.existsSync(path.join(DS, 'inventory.js'))) return null;
  const stub = new Proxy(function () { return null; }, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : stub), apply: () => null });
  const win = { Plenix: stub };
  const ctx = vm.createContext({ window: win, React: stub, ReactDOM: stub, document: stub, console: { log() {}, warn() {}, error() {} } });
  for (const f of ['inventory-taxonomy.js', 'spec-parts.js', 'inventory.js', 'inventory-guidance.js', 'inventory-docs.js'].filter((x) => fs.existsSync(path.join(DS, x)))) vm.runInContext(fs.readFileSync(path.join(DS, f), 'utf8'), ctx, { filename: f });
  return Array.isArray(win.DSInventory) ? win.DSInventory : Object.values(win.DSInventory || {});
}

module.exports = { derive, loadInventory, slug };
