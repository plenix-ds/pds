// Plenix · check-system rule "token-sets" (#372, Style Dictionary step 2): the checks build-tokens.js made while it built,
// moved here so they hold whatever builds the token files (plain Style Dictionary, from #372 step 10). The messages are
// build-tokens.js's own, word for word; build-tokens.js keeps its throws until step 10 retires it (tests/theme.test.js
// copies build-tokens.js alone, so it cannot call this module).
//   themes     every theme of platform/standards/themes.json (the default theme first): the default theme is defined; each
//              theme has its foundations, light and dark token files; a theme value never writes a color literal (a hex
//              color or a color function: colors come from the palette, by reference); every theme's foundations define
//              the same tokens as the default theme's, and every light and dark set the same roles as the default light set
//   one file   a token is defined in one file only: a lane's file (a glob set of platform/tokens/build.json, as
//              components/*.tokens.json) never redefines a token of a shared set or of another lane, in the same context
//   globs      a glob set is <folder>/*.tokens.json; each of its files is <name>.tokens.json or <name>.<context>.tokens.json,
//              and its context is one the output's own sets have
//   print      a token with a print value has no contrast values (forced colors, more contrast)
//   conditions (#372 step 4) a condition set, <set>.<condition>.tokens.json (forced-colors, more-contrast, print,
//              reduced-motion), sits beside its base set and holds only values of the base set's tokens: a token it
//              names that the base set does not define is a finding (its value would be written nowhere). Only a
//              condition set may point to a token as var(--plx-…) (web-only values); every other set refers by
//              {plx-….…}, because the phone files and Figma read it: a var() there is a finding
//   text roles a token is never a W3C "typography" composite: a text role is six separate tokens (#372 step 3), because
//              plain Style Dictionary writes no composite
// A file that is not valid JSON is a finding too (the build stops on it).
// Alone: node check-system.rules/token-sets.js   -> TOKEN_SETS_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { css, transparent } = require('../tools/token-value.js');   // a $value as CSS text: the W3C typed values too (#872)

const NAME = 'token-sets';
const ROOT = path.join(__dirname, '..');
const EXT = 'com.plenix';
const TIERS = ['plx-ref', 'plx-sys', 'plx-comp'];
const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i;
// a condition set's file name (#372 step 4; build-tokens.js, CONDITIONS), and the extension key build-tokens.js reads it into
const CONDITIONS = { 'forced-colors': 'forcedColors', 'more-contrast': 'contrastMore', print: 'print', 'reduced-motion': 'reducedMotion' };
const CONDITION_FILE = new RegExp('\\.(' + Object.keys(CONDITIONS).join('|') + ')\\.tokens\\.json$');
const TYPOGRAPHY_COMPOSITE = 'a typography composite is not built: write the role as six tokens, -font-family, -font-size, -font-weight, -letter-spacing, -line-height and -word-spacing';

// [{ file, text }]: every finding, in the order build-tokens.js meets them
function findings(root = ROOT) {
  const SRC = path.join(root, 'platform', 'tokens'), out = [];
  const at = (rel) => path.join(SRC, rel);
  const say = (file, text) => { if (!out.some((f) => f.file === file && f.text === text)) out.push({ file, text }); };
  const read = (file) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { say(file, path.relative(root, file).split(path.sep).join('/') + ': ' + e.message); return null; } };
  // a set with its condition sets' values on its tokens, as build-tokens.js reads it (withConditions); a condition set's
  // token that the base set does not define is a finding
  const withConditions = (rel, data) => {
    if (!data) return data;
    for (const [cond, key] of Object.entries(CONDITIONS)) {
      const file = rel.replace(/\.tokens\.json$/, '.' + cond + '.tokens.json');
      if (!fs.existsSync(at(file))) continue;
      const set = read(at(file)); if (!set) continue;
      for (const tier of TIERS) for (const [k, token] of Object.entries(set[tier] || {})) {
        const base = data[tier] && data[tier][k];
        if (!base) { say(at(file), 'platform/tokens/' + file + ': --' + tier + '-' + k + ' is not defined in ' + rel + ' (a condition set holds only values of its base set\'s tokens)'); continue; }
        base.$extensions = Object.assign({}, base.$extensions, { [EXT]: Object.assign({}, base.$extensions && base.$extensions[EXT], { [key]: token && token.$value }) });
      }
    }
    return data;
  };
  // every condition set has its base set beside it
  const walk = (dir) => { if (!fs.existsSync(dir)) return; for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.tokens.json') || e.name === 'tokens.index.json') continue;
    const relp = path.relative(root, p).split(path.sep).join('/');
    if (CONDITION_FILE.test(e.name)) { if (!fs.existsSync(p.replace(CONDITION_FILE, '.tokens.json'))) say(p, relp + ': a condition set with no base set (' + e.name.replace(CONDITION_FILE, '.tokens.json') + ')'); continue; }
    // var() only in a condition set: every other set refers by {plx-….…}
    const data = read(p); if (!data) continue;
    const values = (o, at2) => { for (const [k, v] of Object.entries(o || {})) {
      if (!v || typeof v !== 'object' || (k.charAt(0) === '$' && k !== '$value')) continue;
      if (v.$value !== undefined) { if (/\bvar\(/.test(JSON.stringify(v.$value))) say(p, relp + ': ' + (at2 ? at2 + '.' : '') + k + ' writes var() (' + JSON.stringify(v.$value) + '): refer to a token as {tier.name}; only a condition set may use var()'); }
      else values(v, at2 ? at2 + '.' + k : k);
    } };
    values(data, '');
  } };
  walk(SRC);
  // a set's tokens in order (build-tokens.js, tokensOf); a typography composite is a finding
  const tokensOf = (set, file) => {
    const list = [];
    for (const tier of TIERS) for (const [key, token] of Object.entries(set[tier] || {})) {
      if (token && token.$type === 'typography') { say(file, '--' + tier + '-' + key + ': ' + TYPOGRAPHY_COMPOSITE); continue; }
      list.push({ name: '--' + tier + '-' + key, token, order: (token && token.$extensions && token.$extensions[EXT] && token.$extensions[EXT].order) || 0 });
    }
    return list.sort((a, b) => a.order - b.order);
  };
  // print: a token with a print value has no contrast values (build-tokens.js, generate)
  const print = (data, file) => {
    const cond = [];
    for (const t of tokensOf(data, file)) {
      const x = (t.token.$extensions && t.token.$extensions[EXT]) || {};
      if (x.reducedMotion !== undefined) continue;
      if (x.forcedColors !== undefined || x.contrastMore !== undefined || x.print !== undefined) cond.push({ name: t.name, x });
    }
    const paper = cond.filter((t) => t.x.print !== undefined);
    if (paper.some((t) => t.x.forcedColors !== undefined || t.x.contrastMore !== undefined)) say(file, 'a token with a print value has no contrast values: ' + paper.map((t) => t.name).join(', '));
  };

  // the manifest's sets, a glob set expanded (build-tokens.js, load and expandGlob)
  const manifest = read(at('build.json'));
  if (manifest) for (const o of manifest.outputs || []) {
    const own = [];
    for (const s of o.sets) if (s.tokens) { const data = withConditions(s.tokens, read(at(s.tokens))); if (data) own.push({ tokens: s.tokens, data }); }
    const sets = [];
    for (const s of o.sets) {
      if (s.tokens) { const x = own.find((y) => y.tokens === s.tokens); if (x) sets.push(x); continue; }
      if (!s.glob) continue;
      const dir = path.dirname(s.glob), pat = path.basename(s.glob);
      if (pat !== '*.tokens.json') { say(at('build.json'), 'platform/tokens/build.json: a glob set must be <folder>/*.tokens.json (' + s.glob + ')'); continue; }
      if (!fs.existsSync(at(dir))) continue;
      for (const f of fs.readdirSync(at(dir)).filter((n) => n.endsWith('.tokens.json') && !CONDITION_FILE.test(n)).sort()) {
        const m = f.match(/^([^.]+)(?:\.(.+))?\.tokens\.json$/);
        if (!m) { say(at(dir + '/' + f), 'platform/tokens/' + dir + '/' + f + ': not <name>.tokens.json or <name>.<context>.tokens.json'); continue; }
        const ctx = m[2] || '';
        const r = ctx ? own.findIndex((x) => x.tokens.endsWith('.' + ctx + '.tokens.json')) : -1;
        if (ctx && r < 0) { say(at(dir + '/' + f), 'platform/tokens/' + dir + ': no shared set for the context "' + ctx + '" in ' + o.file); continue; }
        const data = withConditions(dir + '/' + f, read(at(dir + '/' + f))); if (!data) continue;
        const like = r < 0 ? own[0] : own[r];
        const selector = data.$extensions && data.$extensions[EXT] ? data.$extensions[EXT].selector : like && like.data.$extensions && like.data.$extensions[EXT] && like.data.$extensions[EXT].selector;
        sets.push({ tokens: dir + '/' + f, data, selector, base: m[1], rank: r });
      }
    }
    o.checked = sets;
  }
  // one file per token, in build order (shared sets as listed, a glob's files by name, a file's contexts after its base file)
  if (manifest) {
    const where = {};
    for (const o of manifest.outputs || []) {
      const shared = (o.checked || []).filter((s) => s.base === undefined);
      const lanes = (o.checked || []).filter((s) => s.base !== undefined).sort((a, b) => (a.base < b.base ? -1 : a.base > b.base ? 1 : a.rank - b.rank));
      // the lanes stand where their glob stands in the output (build-tokens.js expands each glob in place)
      const order = [];
      for (const s of o.sets) {
        if (s.tokens) { const x = shared.find((y) => y.tokens === s.tokens); if (x) order.push(x); }
        else if (s.glob) for (const x of lanes) if (x.tokens.startsWith(path.dirname(s.glob) + '/')) order.push(x);
      }
      for (const s of order) {
        const ctx = s.selector !== undefined ? s.selector : s.data.$extensions && s.data.$extensions[EXT] && s.data.$extensions[EXT].selector;
        for (const { name } of tokensOf(s.data, at(s.tokens))) {
          const k = name + ' @ ' + ctx;
          if (where[k] && (/\//.test(s.tokens) || /\//.test(where[k]))) say(at(s.tokens), 'platform/tokens: ' + name + ' is defined in ' + where[k] + ' and ' + s.tokens);
          where[k] = s.tokens;
        }
        print(s.data, at(s.tokens));
      }
    }
  }

  // the themes (build-tokens.js, themeOutputs)
  const std = read(path.join(root, 'platform', 'standards', 'themes.json'));
  if (std) {
    if (!std.themes || !std.themes[std.default]) say(path.join(root, 'platform', 'standards', 'themes.json'), 'platform/standards/themes.json: the default theme "' + std.default + '" is not defined');
    else {
      const names = Object.keys(std.themes).sort((a, b) => (a === std.default ? -1 : b === std.default ? 1 : 0));
      let roles = null, scales = null;
      for (const name of names) {
        const th = std.themes[name];
        if (!th.foundations) say(path.join(root, 'platform', 'standards', 'themes.json'), name + ': no foundations token file');
        else {
          const data = withConditions(th.foundations, read(at(th.foundations)));
          if (data) {
            const toks = tokensOf(data, at(th.foundations)), list = toks.map((x) => x.name).sort().join(',');
            toks.forEach((x) => { if (COLOR_LITERAL.test(css(x.token.$value)) && !transparent(x.token.$value)) say(at(th.foundations), th.foundations + ': ' + x.name + ' writes a color (' + css(x.token.$value) + ')'); });
            if (scales === null) scales = list; else if (list !== scales) say(at(th.foundations), th.foundations + ': does not define the same foundations as the default theme');
            print(data, at(th.foundations));
          }
        }
        for (const mode of ['light', 'dark']) {
          if (!th[mode]) { say(path.join(root, 'platform', 'standards', 'themes.json'), name + ': no ' + mode + ' token file'); continue; }
          const data = withConditions(th[mode], read(at(th[mode]))); if (!data) continue;
          const toks = tokensOf(data, at(th[mode]));
          toks.forEach((x) => { if (COLOR_LITERAL.test(css(x.token.$value)) && !transparent(x.token.$value)) say(at(th[mode]), th[mode] + ': ' + x.name + ' writes a color (' + css(x.token.$value) + '): point to a palette color, e.g. {plx-ref.color-blue-400}'); });
          const list = toks.map((x) => x.name).sort().join(',');
          if (roles === null && mode === 'light') roles = list;
          else if (list !== roles) say(at(th[mode]), th[mode] + ': does not define the same roles as the default theme');
          print(data, at(th[mode]));
        }
      }
    }
  }
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME, CONDITION_FILE };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'TOKEN_SETS_FAIL (' + list.length + ')' : 'TOKEN_SETS_OK');
  process.exit(list.length ? 1 : 0);
}
