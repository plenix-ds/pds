// Plenix · check-system rule "color-groups" (owner, 2026-10-13: the color groups): every color role (a plx-sys token of
// $type "color" in the token source: each theme's light and dark sets and the semantic sets) belongs to exactly one group,
// written on the role as $extensions.plenix.group:
//   brand, accent, semantic, surface, text, border, interactive, status   the eight color groups
//   neutral, dataviz, component                                           Neutral, Data visualization, Component-specific
// So:
//   "status-online": { "$value": …, "$type": "color", "$extensions": { "plenix": { "group": "status", "purpose": "…" } } }   ok
//   a color role with no group, an unknown group, or more than one ("group": ["text", "border"], "text, border")           finding
//   a role whose group differs between a theme's light and dark sets (one role, one group)                                finding
// Roles are never renamed or merged to fit a group (semantic tokens stay, even when same-valued). packages/tokens/sd/assemble.cjs copies the
// group and purpose into tokens.index.json; the Color pages of the design system list each group's roles from there.
// The rule is a module check-style.js runs (a style rule: check-common.js, STYLE_MODULES) (it loads every file in check-system.rules/):
//   require('./check-system.rules/color-groups.js').check({ files, add })   add(rule, file, line, text)
// Alone: node check-system.rules/color-groups.js     -> COLOR_GROUPS_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { CONDITION_FILE } = require('./token-sets.js');

const NAME = 'color-groups';
const GROUPS = ['brand', 'accent', 'semantic', 'surface', 'text', 'border', 'interactive', 'status', 'neutral', 'dataviz', 'component'];
const ROOT = path.join(__dirname, '..');
const TOK = path.join(ROOT, 'platform', 'tokens');

// the sets that hold color roles: every theme's light and dark sets, the semantic sets (semantic*.tokens.json, semantic/)
function sets(root) {
  const tok = path.join(root, 'platform', 'tokens'), out = [];
  if (!fs.existsSync(tok)) return out;
  let themes = {};
  try { themes = JSON.parse(fs.readFileSync(path.join(root, 'platform', 'standards', 'themes.json'), 'utf8')).themes || {}; } catch (e) { themes = {}; }
  for (const t of Object.values(themes)) for (const mode of ['light', 'dark']) if (t[mode]) out.push({ file: path.join(tok, t[mode]), theme: t[mode].replace(/\.(light|dark)\.tokens\.json$/, ''), mode });
  // a condition set (#372 step 4: semantic.forced-colors.tokens.json…) holds values only: its tokens' groups are in the base set
  for (const f of fs.readdirSync(tok).filter((x) => /^semantic.*\.tokens\.json$/.test(x) && !CONDITION_FILE.test(x)).sort()) out.push({ file: path.join(tok, f) });
  const sem = path.join(tok, 'semantic');
  if (fs.existsSync(sem)) for (const f of fs.readdirSync(sem).filter((x) => x.endsWith('.tokens.json') && !CONDITION_FILE.test(x)).sort()) out.push({ file: path.join(sem, f) });
  return out.filter((s) => fs.existsSync(s.file));
}

// the findings of one set of tokens: [{ role, text }]
function scan(sys) {
  const out = [];
  for (const [role, v] of Object.entries(sys || {})) {
    if (!v || v.$type !== 'color') continue;
    const g = v.$extensions && v.$extensions.plenix && v.$extensions.plenix.group;
    if (g === undefined || g === null || g === '') out.push({ role, text: 'color role --plx-sys-' + role + ' has no group ($extensions.plenix.group: ' + GROUPS.join(', ') + ')' });
    else if (Array.isArray(g) || typeof g !== 'string' || /[,\s]/.test(g.trim())) out.push({ role, text: 'color role --plx-sys-' + role + ' is in more than one group (' + JSON.stringify(g) + '): exactly one' });
    else if (!GROUPS.includes(g)) out.push({ role, text: 'color role --plx-sys-' + role + ' has an unknown group "' + g + '" (' + GROUPS.join(', ') + ')' });
  }
  return out;
}

function check({ add }, root = ROOT) {
  const byTheme = {};
  for (const s of sets(root)) {
    let sys;
    try { sys = (JSON.parse(fs.readFileSync(s.file, 'utf8')) || {})['plx-sys']; } catch (e) { add(NAME, s.file, 0, 'does not parse: ' + e.message); continue; }
    scan(sys).forEach((x) => add(NAME, s.file, 0, x.text));
    if (s.theme) {
      const seen = byTheme[s.theme] = byTheme[s.theme] || {};
      for (const [role, v] of Object.entries(sys || {})) {
        if (!v || v.$type !== 'color') continue;
        const g = v.$extensions && v.$extensions.plenix && v.$extensions.plenix.group;
        if (seen[role] !== undefined && seen[role] !== g) add(NAME, s.file, 0, 'color role --plx-sys-' + role + ' is in group "' + g + '" here and "' + seen[role] + '" in the other mode: one role, one group');
        seen[role] = g;
      }
    }
  }
}

module.exports = { name: NAME, check, scan, GROUPS };

if (require.main === module) {
  const found = [];
  check({ add: (rule, file, line, text) => found.push(path.relative(ROOT, file).split(path.sep).join('/') + '  ' + text) });
  // the rule's own fixtures
  const g = (x) => ({ $value: '{plx-ref.color-white}', $type: 'color', $extensions: x === undefined ? undefined : { plenix: { group: x } } });
  const fx = [[{ a: g('surface') }, 0], [{ a: g(undefined) }, 1], [{ a: g('') }, 1], [{ a: g(['text', 'border']) }, 1], [{ a: g('text, border') }, 1], [{ a: g('Surface') }, 1],
    [{ a: { $value: '4px', $type: 'dimension' } }, 0], [{ a: g('status'), b: g('dataviz'), c: g('component') }, 0]];
  fx.forEach(([sys, n]) => { if (scan(sys).length !== n) found.push('fixture: ' + JSON.stringify(sys) + ' gives ' + scan(sys).length + ' finding(s), expected ' + n); });
  found.forEach((x) => console.log('FAIL ' + x));
  let roles = 0; const per = {};
  for (const s of sets(ROOT)) { if (s.mode === 'dark') continue; const sys = JSON.parse(fs.readFileSync(s.file, 'utf8'))['plx-sys'] || {}; for (const v of Object.values(sys)) if (v.$type === 'color') { roles++; const k = (v.$extensions && v.$extensions.plenix && v.$extensions.plenix.group) || '(none)'; per[k] = (per[k] || 0) + 1; } }
  console.log(found.length ? '\n' + found.length + ' finding(s)' : 'COLOR_GROUPS_OK (' + roles + ' color roles: ' + GROUPS.map((k) => k + ' ' + (per[k] || 0)).join(', ') + '; ' + fx.length + ' fixtures)');
  process.exit(found.length ? 1 : 0);
}
