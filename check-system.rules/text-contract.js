// Plenix · check-system rule "text-contract" (the Plenix Styling Standard, section 6; Phase 4, 2026-10-20). Replaces
// "mono-spacing". Every part that declares typography has a declared text contract, and every role change is a whole role.
//
//   the boundary   a rule that sets a font family sets its word spacing too: Reddit Mono is fitted to DM Sans and its
//                  spaces are not (a monospace space is a full character wide), so the data and code fonts carry
//                  word-spacing:var(--plx-sys-font-data-word-spacing) and DM Sans carries word-spacing:normal, or a DM
//                  Sans part inside a monospace one (a tag in a data cell) inherits the monospace spacing. Hard rule, over
//                  platform/** and docs/** (not the token sheets, docs/font-study).
//   the contracts  platform/standards/text-contracts.json declares, per part (its class without the modifier: plx-tabs__tab),
//                  the contract its rules have (a part with no typography of its own follows its context and is not listed):
//                    { "contract": "establishes", "role": "data" }       all six properties, from one text role
//                                                                         (semantic/typography.tokens.json, through the part's
//                                                                         own tokens or directly)
//                    { "contract": "adjusts", "props": ["font-size"] }   only these properties; the rest it inherits
//                  A part whose rules declare other properties than its contract says fails, so a change of contract is a
//                  change of the declaration, made on purpose. Over platform/** (components, patterns, system, charts),
//                  not the design-system site, the token sheets or the vendor files.
//   the backlog    a part that changes the font family (a role change) but not the whole role (the boundary of section 6:
//                  "it must set every property that would otherwise carry across incompatibly") is the Phase 4 migration
//                  list: check-system.text-contract.json, which only shrinks (--shrink removes what is done).
//
// Alone: node check-system.rules/text-contract.js [--record | --shrink]
//   --record   (re)writes the declarations from the stylesheets as they are and the backlog from the findings: run it
//              only to declare a contract on purpose, and say so in the commit
const fs = require('fs');
const path = require('path');

const NAME = 'text-contract';
const ROOT = path.join(__dirname, '..');
const REGISTRY = path.join(ROOT, 'platform', 'standards', 'text-contracts.json');
const BACKLOG = path.join(ROOT, 'check-system.text-contract.json');
const PROPS = ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'line-height', 'word-spacing'];
const MONO_DECL = 'word-spacing:var(--plx-sys-font-data-word-spacing)', SANS_DECL = 'word-spacing:normal';
const SKIP_ALL = /[\\/](font-study|system[\\/]tokens|system[\\/]themes|node_modules|dist|vendor|release)[\\/]/;
const SKIP_CONTRACT = /[\\/](design-system|icons)[\\/]|[\\/]docs[\\/]/;

function cssFiles() {
  const out = [];
  const walk = (d) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!SKIP_ALL.test(p + path.sep)) walk(p); } else if (e.name.endsWith('.css') && !SKIP_ALL.test(p) && !/[\\/]platform\.css$|[\\/]plenix-system\.css$/.test(p)) out.push(p);
  } };
  walk(path.join(ROOT, 'platform')); walk(path.join(ROOT, 'docs'));
  return out;
}
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const index = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'platform/tokens/tokens.index.json'), 'utf8')).tokens;
// font tokens by the family they resolve to first: { name: "mono" | "sans" }
function fontTokens(idx) {
  const out = {};
  for (const t of idx) {
    if (!/font|typeface/.test(t.name)) continue;
    const first = String(Object.values(t.resolved)[0] || '').split(',')[0];
    if (/Reddit Mono/.test(first)) out[t.name] = 'mono'; else if (/DM Sans/.test(first)) out[t.name] = 'sans';
  }
  return out;
}
// the text role a token reaches through its references (--plx-sys-text-<role>-<prop>), or null
function roleOf(idx) {
  const by = Object.fromEntries(idx.map((t) => [t.name, t])), memo = {};
  const find = (name, seen) => {
    if (memo[name] !== undefined) return memo[name];
    const m = name.match(/^--plx-sys-text-([a-z]+(?:-[a-z]+)*)-(font-family|font-size|font-weight|letter-spacing|line-height|word-spacing)$/);
    if (m) return (memo[name] = m[1]);
    const t = by[name]; if (!t || seen.has(name)) return (memo[name] = null);
    seen.add(name); const r = (t.refs || []).map((x) => find(x, seen)).find(Boolean) || null;
    return (memo[name] = r);
  };
  // a keyword (normal) is no token: it matches every role whose value for that property is the same keyword
  const roles = {}; for (const t of idx) { const m = t.name.match(/^--plx-sys-text-([a-z]+(?:-[a-z]+)*)-(letter-spacing|word-spacing)$/); if (m) (roles[m[2]] = roles[m[2]] || {})[m[1]] = String(Object.values(t.resolved)[0]); }
  return (value, prop) => {
    const m = /var\((--plx-[a-z0-9-]+)/.exec(value || ''); if (m) return find(m[1], new Set());
    const same = Object.entries(roles[prop] || {}).filter(([, v]) => v === String(value).trim()).map(([r]) => r);
    return same.length ? same : null;
  };
}
// the part a selector alternative styles: the first Plenix class of its last compound, without its modifier
function partOf(sel) {
  const last = sel.replace(/:(?:not|is|where|has)\((?:[^()]|\([^()]*\))*\)/g, '').trim().split(/\s+|>|\+|~/).filter(Boolean).pop() || '';
  const m = last.match(/\.(plx-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?)/);
  if (m) { const mod = last.match(new RegExp('\\.(' + m[1].replace(/--[a-z0-9-]+$/, '') + '--[a-z0-9]+(?:-[a-z0-9]+)*)')); return mod ? mod[1] : m[1]; }
  const el = last.match(/^([a-z][a-z0-9]*)/); return el ? '<' + el[1] + '>' : null;
}
const splitList = (list) => { const out = []; let depth = 0, from = 0; for (let i = 0; i < list.length; i++) { const c = list[i]; if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && !depth) { out.push(list.slice(from, i)); from = i + 1; } } out.push(list.slice(from)); return out.map((s) => s.trim()).filter(Boolean); };
// every rule: { file, line, parts, decl: { prop: value } }
function rules(text, file) {
  const out = [], clean = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(clean))) {
    const sel = m[1].trim(); if (!sel || sel.startsWith('@')) continue;
    const decl = {}; for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i < 0) continue; const p = d.slice(0, i).trim(); if (PROPS.includes(p)) decl[p] = d.slice(i + 1).trim(); }
    out.push({ file, line: clean.slice(0, m.index + m[0].indexOf('{')).split('\n').length, sel, parts: [...new Set(splitList(sel).map(partOf).filter(Boolean))], decl });
  }
  return out;
}
// the declarations and findings as the stylesheets are
function measure() {
  const idx = index(), FONTS = fontTokens(idx), ROLE = roleOf(idx);
  // the font switch a family or word spacing belongs to: sans (DM Sans, normal spacing) or mono (Reddit Mono, the fitted spacing)
  const MONO_WS = String(Object.values((idx.find((t) => t.name === '--plx-sys-font-data-word-spacing') || { resolved: {} }).resolved)[0]);
  const resolvedOf = (name) => String(Object.values((idx.find((t) => t.name === name) || { resolved: {} }).resolved)[0] || '');
  const FONT = (v, k) => {
    const m = /var\((--plx-[a-z0-9-]+)/.exec(v || '');
    if (k === 'font-family') return m ? (FONTS[m[1]] || 'other') : 'other';
    if (/^normal$/.test(String(v).trim())) return 'sans';
    if (!m) return 'other'; const r = resolvedOf(m[1]); return r === MONO_WS ? 'mono' : r === 'normal' ? 'sans' : 'other';
  };
  const boundary = [], parts = {};
  for (const f of cssFiles()) {
    const file = rel(f), contract = !SKIP_CONTRACT.test(f);
    for (const r of rules(fs.readFileSync(f, 'utf8'), file)) {
      const ff = /var\((--plx-[a-z0-9-]+)\)/.exec(r.decl['font-family'] || '');
      if (ff && FONTS[ff[1]] && r.decl['word-spacing'] === undefined) boundary.push({ file, line: r.line, text: 'sets a font without its word spacing: add ' + (FONTS[ff[1]] === 'mono' ? MONO_DECL : SANS_DECL) + ' (Reddit Mono fitted to DM Sans, docs/font-study/playground)' });
      if (!contract || !Object.values(r.decl).some((v) => !/^inherit$/.test(v))) continue;
      for (const p of r.parts) {
        const x = parts[p] = parts[p] || { props: new Set(), byProp: {}, family: false, where: file + ':' + r.line };
        // inherit is following the context for that property, not a value of the part's own
        for (const [k, v] of Object.entries(r.decl)) {
          if (/^inherit$/.test(v)) continue; x.props.add(k);
          // the font and its word spacing are the font switch (DM Sans, or Mono fitted to it), not the role's
          if (k === 'font-family' || k === 'word-spacing') { (x.font = x.font || new Set()).add(FONT(v, k)); continue; }
          const s = x.byProp[k] = x.byProp[k] || new Set(); const role = ROLE(v, k); if (Array.isArray(role)) s.add('any:' + role.join(',')); else s.add(role || 'none');
        }
        if (r.decl['font-family'] !== undefined && !/^inherit$/.test(r.decl['font-family'])) x.family = true;
      }
    }
  }
  // establishes: all six declared, from one role apart from the properties the part sets to its own values (its adjusts:
  // a data value at 11px is the data role at its own size). Otherwise it adjusts what it declares.
  // a variant (plx-tabs__tab--segmented) is judged with its part's own rules (plx-tabs__tab): together they are what its
  // element computes
  const declared = {}, incomplete = {};
  for (const [p, x] of Object.entries(parts).sort()) {
    const base = p.includes('--') ? parts[p.replace(/--[a-z0-9-]+$/, '')] : null;
    const eff = { props: new Set([...x.props, ...(base ? base.props : [])]), byProp: {}, font: new Set(x.font && x.font.size ? x.font : ((base && base.font) || [])) }; // a variant's own font replaces its part's
    for (const src of [base, x]) if (src) for (const [k, set] of Object.entries(src.byProp)) { eff.byProp[k] = eff.byProp[k] || new Set(); for (const r of set) eff.byProp[k].add(r); }
    // a part whose every variant sets what the part leaves out (a heading's size, from its size variant) is complete through them
    if (!base) {
      const vs = Object.keys(parts).filter((k) => k.startsWith(p + '--')).map((k) => parts[k]);
      for (const k of PROPS) if (!eff.props.has(k) && vs.length && vs.every((v) => v.props.has(k))) { eff.props.add(k); eff.byProp[k] = new Set(vs.flatMap((v) => [...(v.byProp[k] || [])])); }
    }
    const font = eff.font.size === 1 && !eff.font.has('other') ? [...eff.font][0] : null;
    const own = PROPS.filter((k) => x.props.has(k)), all = PROPS.filter((k) => eff.props.has(k));
    const fromRole = {}; for (const [k, set] of Object.entries(eff.byProp)) for (const r of set) if (r !== 'none' && !r.startsWith('any:')) (fromRole[r] = fromRole[r] || new Set()).add(k);
    const role = Object.keys(fromRole).sort((a, b) => fromRole[b].size - fromRole[a].size)[0];
    // a property is the role's when every value it is given comes from that role (a keyword matching the role counts)
    const isRole = (k) => [...(eff.byProp[k] || [])].every((r) => r === role || (r.startsWith('any:') && r.slice(4).split(',').includes(role)));
    const METRICS = ['font-size', 'font-weight', 'letter-spacing', 'line-height'];
    const adj = role ? METRICS.filter((k) => x.props.has(k) && !isRole(k)) : own;
    // follows: only the font switch, every metric from the text around it (inline code or a data value in a sentence: the
    // true match of Mono fitted to DM Sans, Standard 6)
    const followsIn = font && eff.props.has('font-family') && eff.props.has('word-spacing') && !['font-weight', 'letter-spacing', 'line-height'].some((k) => eff.props.has(k));
    declared[p] = all.length === PROPS.length && role && font ? Object.assign({ contract: 'establishes', role, font }, adj.length ? { adjusts: adj } : {})
      : followsIn ? Object.assign({ contract: 'follows', font }, eff.props.has('font-size') ? { size: true } : {}) : { contract: 'adjusts', props: own };
    if ((x.family || (base && base.family)) && declared[p].contract === 'adjusts') incomplete[p] = 'changes the font family without the whole role (' + (all.length < PROPS.length ? 'missing ' + PROPS.filter((k) => !eff.props.has(k)).join(', ') : !role ? 'no metric from a text role' : 'its font and word spacing are not one switch') + ')';
  }
  return { boundary, declared, incomplete, where: Object.fromEntries(Object.entries(parts).map(([p, x]) => [p, x.where])) };
}
const read = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
function check({ add }) {
  const now = measure();
  for (const b of now.boundary) add(NAME, b.file, b.line, b.text);
  const reg = read(REGISTRY, { parts: {} }).parts || {}, log = read(BACKLOG, { parts: {} }).parts || {};
  for (const [p, d] of Object.entries(now.declared)) {
    const r = reg[p], where = now.where[p].split(':');
    if (!r) { add(NAME, where[0], +where[1], p + ' declares typography but has no text contract (' + JSON.stringify(d) + ') in platform/standards/text-contracts.json'); continue; }
    if (JSON.stringify(r) !== JSON.stringify(d)) add(NAME, where[0], +where[1], p + ': its rules ' + (d.contract === 'establishes' ? 'establish the ' + d.role + ' role in ' + d.font : d.contract === 'follows' ? 'follow the text around them in ' + d.font : 'adjust ' + d.props.join(', ')) + ', its declared contract says ' + JSON.stringify(r) + ' (declare the change on purpose)');
  }
  for (const p of Object.keys(reg)) if (!now.declared[p]) add(NAME, 'platform/standards/text-contracts.json', 0, p + ': declared, but no rule gives it typography any more (remove the declaration)');
  for (const [p, t] of Object.entries(now.incomplete)) if (!log[p]) { const w = now.where[p].split(':'); add(NAME, w[0], +w[1], p + ' ' + t + ' (Styling Standard 6, the boundary rule)'); }
  for (const p of Object.keys(log)) if (!now.incomplete[p]) add(NAME, 'check-system.text-contract.json', 0, p + ': repaired, still listed (run node check-system.rules/text-contract.js --shrink)');
}
module.exports = { check, measure, NAME };

if (require.main === module) {
  if (process.argv.includes('--record') || process.argv.includes('--shrink')) {
    const now = measure();
    if (process.argv.includes('--record')) fs.writeFileSync(REGISTRY, JSON.stringify({ $description: 'The text contract of every part that declares typography (the Plenix Styling Standard, section 6; checked by check-system.rules/text-contract.js). establishes: the part applies one whole text role (platform/tokens/semantic/typography.tokens.json). adjusts: the part sets only these properties and inherits the rest. A part that is not listed declares no typography: it follows its context.', parts: now.declared }, null, 1) + '\n');
    const log = process.argv.includes('--record') ? now.incomplete : Object.fromEntries(Object.entries(read(BACKLOG, { parts: {} }).parts || {}).filter(([p]) => now.incomplete[p]));
    fs.writeFileSync(BACKLOG, JSON.stringify({ $description: 'The Phase 4 migration list (Plenix Styling Standard, section 6): parts that change the font family without the whole text role. It only shrinks: node check-system.rules/text-contract.js --shrink.', parts: log }, null, 1) + '\n');
    console.log('declared ' + Object.keys(now.declared).length + ' parts; backlog ' + Object.keys(log).length);
  }
  const found = [];
  check({ add: (rule, file, line, text) => found.push(file + ':' + line + '  ' + text) });
  if (!found.length) { console.log('TEXT_CONTRACT_OK'); process.exit(0); }
  console.log(found.slice(0, 30).join('\n') + '\n' + found.length + ' finding(s)');
  process.exit(1);
}
