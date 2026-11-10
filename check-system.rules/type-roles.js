// Plenix · check-system rule "type-roles" (D-0006, D-0164, docs/adr/0055; owner 2026-11-10: "Reddit Mono for data only, never names or words"):
// one rule everywhere for the data font. A font-family role is a data role or a text role by its name; it must end at the matching typeface.
//   tokens   every token whose key ends in "-font-family" (all tiers, all files) has a declared role in type-roles.json: "data" (case
//            numbers, IDs, dates, times, amounts, counts, file names, code) or "text" (names and words). A token with no declared role
//            fails, so a new font role is always decided. The token is followed through its references to a typeface: typeface-mono
//            is the data font, any other typeface the text font. A data role at the text font, or a text role at the data font, fails.
//            (A name can't say the role: "data-grid-font-family" is the grid's words, "text-mono-font-family" is the data role.)
//   grid     DataGrid column kinds "data", "id" and "code" get the data cell class (engine/bodyRows.tsx); "name" never does.
// What breaks the rule when it began is the frozen backlog in type-roles.baseline.json (by token or kind, with the font it ends at). It only
// shrinks: a break not listed fails, and a listed one that now passes fails until it is removed (node check-system.rules/type-roles.js --shrink).
// The design audit (#1232, docs/pds1/slices/1232/audit.md, D-0165) decides each backlog entry; fixing one is a PR that removes it here.
// Alone: node check-system.rules/type-roles.js [--shrink]   -> TYPE_ROLES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'type-roles';
const ROOT = path.join(__dirname, '..');
const TOKENS = path.join(ROOT, 'platform', 'tokens');
const BASELINE = path.join(__dirname, 'type-roles.baseline.json');
const ROLES = path.join(__dirname, 'type-roles.json');
const GRID = 'platform/components/DataGrid/engine/bodyRows.tsx';

function walk(dir, out = []) {
  for (const n of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.tokens\.json$/.test(n) && !/^platform-/.test(n)) out.push(p);
  }
  return out;
}
// every token's value by "tier.key" (the first file that sets it is enough to follow a family: themes and densities don't change typefaces)
function load() {
  const all = {}, where = {};
  for (const f of walk(TOKENS)) {
    let d; try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { continue; }
    for (const tier of Object.keys(d)) {
      if (tier[0] === '$' || typeof d[tier] !== 'object') continue;
      for (const [k, t] of Object.entries(d[tier])) if (t && t.$value !== undefined && !all[tier + '.' + k]) { all[tier + '.' + k] = t.$value; where[tier + '.' + k] = f; }
    }
  }
  return { all, where };
}
// the typeface a value ends at: "mono", "text", or null (a literal, or a reference that ends nowhere)
function typeface(all, v, seen = new Set()) {
  const m = typeof v === 'string' && v.match(/^\{([a-z-]+)\.([a-z0-9-]+)\}$/);
  if (!m) return null;
  const key = m[1] + '.' + m[2];
  if (/^typeface-/.test(m[2])) return /mono/.test(m[2]) ? 'mono' : 'text';
  if (seen.has(key) || all[key] === undefined) return null;
  seen.add(key);
  return typeface(all, all[key], seen);
}
function findings() {
  const { all, where } = load(), out = [];
  const roles = fs.existsSync(ROLES) ? JSON.parse(fs.readFileSync(ROLES, 'utf8')).roles || {} : {};
  for (const [key, v] of Object.entries(all)) {
    if (!/-font-family$/.test(key)) continue;
    const role = roles[key];
    if (role !== 'data' && role !== 'text') { out.push({ id: key, file: where[key], why: 'no declared role in check-system.rules/type-roles.json ("data" or "text")', face: null, missing: true }); continue; }
    const face = typeface(all, v);
    if (!face) continue;
    if (role === 'data' && face !== 'mono') out.push({ id: key, file: where[key], why: 'a data role at the text font', face });
    if (role === 'text' && face === 'mono') out.push({ id: key, file: where[key], why: 'a text role at the data font', face });
  }
  for (const key of Object.keys(roles)) if (all[key] === undefined) out.push({ id: key, file: ROLES, why: 'declared in type-roles.json but no such token: remove it', face: null, missing: true });
  const src = (() => { try { return fs.readFileSync(path.join(ROOT, GRID), 'utf8'); } catch (e) { return ''; } })();
  // the line that gives a cell the data class: (k.includes('data') || …) && B + '__grid-cell--data'
  const cond = (src.split('\n').find((l) => /&&\s*B \+ '__grid-cell--data'/.test(l)) || '');
  for (const kind of ['data', 'id', 'code']) if (!new RegExp("k\\.includes\\('" + kind + "'\\)").test(cond)) out.push({ id: 'DataGrid kind ' + kind, file: path.join(ROOT, GRID), why: 'a data kind without the data cell class', face: 'text' });
  if (/k\.includes\('name'\)/.test(cond)) out.push({ id: 'DataGrid kind name', file: path.join(ROOT, GRID), why: 'the name kind with the data cell class', face: 'mono' });
  return out;
}
function check({ add }) {
  const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')).backlog || {} : {};
  const now = findings(), ids = new Set(now.map((f) => f.id));
  for (const f of now) if (f.missing || !(f.id in base)) add(NAME, f.file, 0, f.id + ': ' + f.why + ' (D-0164, ADR 0055)');
  for (const id of Object.keys(base)) if (!ids.has(id)) add(NAME, BASELINE, 0, id + ' now follows the rule: remove it from the backlog (--shrink)');
}
module.exports = { name: NAME, check, findings };
if (require.main === module) {
  if (process.argv.includes('--shrink') || process.argv.includes('--baseline')) {
    const now = findings(), old = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
    const keep = (process.argv.includes('--baseline') ? now : now.filter((f) => old.backlog && f.id in old.backlog)).filter((f) => !f.missing);
    const backlog = {}; keep.sort((a, b) => a.id.localeCompare(b.id)).forEach((f) => { backlog[f.id] = f.why; });
    fs.writeFileSync(BASELINE, JSON.stringify({ $description: 'The type-roles backlog (check-system.rules/type-roles.js, ADR 0055): breaks of the data-font rule when it began. It only shrinks; the design audit (#1233) decides each one.', backlog }, null, 1) + '\n');
    console.log('type-roles backlog: ' + Object.keys(backlog).length);
  } else {
    let n = 0; check({ add: (r, f, l, m) => { n++; console.log('  ' + path.relative(ROOT, f) + '  ' + m); } });
    console.log(n ? 'TYPE_ROLES_FAIL (' + n + ')' : 'TYPE_ROLES_OK'); process.exitCode = n ? 1 : 0;
  }
}
