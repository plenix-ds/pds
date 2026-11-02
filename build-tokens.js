// Builds the token stylesheets from the token source in platform/tokens/ (batch 158). Run by build-app.js; also
//   node build-tokens.js            writes the stylesheets and the index
//   node build-tokens.js --check    exits with 1 if a stylesheet differs from what the source generates (check-system runs this)
//
// The source is JSON in the W3C Design Tokens format (Design Tokens Community Group): one file per token set
// (platform/tokens/*.tokens.json). A token is { "$value", "$type", "$description" }; a value that names another token is
// a reference, "{plx-ref.color-gray-800}" (group = the tier, key = the rest of the name), also inside a longer value
// ("calc({plx-ref.space-8px} * -1)"). Each set's "$extensions"."com.plenix" says which stylesheet and selector it is
// written into (light or dark, a density, an interaction mode); platform/tokens/build.json lists the stylesheets, their
// header comments and the order of their sets. A set may be a glob, "components/*.tokens.json" (also semantic/ and reference/): every file
// of that folder in name order, so each library component owns its own token file (expandGlob below). A token's value under
// forced colors, more contrast, print or reduced motion sits in a condition set beside its set (withConditions below, #372 step 4). Comments that sit between tokens in the stylesheet are kept on the token
// they precede ("before"), a comment after a token on its line is its "$description" ("after" keeps its spacing), so the
// stylesheet is written exactly as it always was: same names, same values, same comments.
//
// The stylesheets (platform/system/tokens/reference.css, semantic.css, components.css, and one per theme in
// platform/system/themes/ — the themes are listed in platform/standards/themes.json)
// are generated: edit the JSON, never the CSS. After the stylesheets it has tools/token-index.js write
// platform/tokens/tokens.index.json (plain Style Dictionary reads the tokens; issue 372 step 8), then build-mobile.js the
// native files.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'platform', 'tokens');
const EXT = 'com.plenix';
const TIERS = ['plx-ref', 'plx-sys', 'plx-comp'];

// "{plx-ref.color-gray-800}" <-> "var(--plx-ref-color-gray-800)"
const { css: cssText, transparent } = require('./tools/token-value.js');   // a $value as CSS text: the W3C typed values too (#872)
const toCss = (v) => cssText(v).replace(/\{(plx-(?:ref|sys|comp))\.([a-z0-9-]+)\}/g, 'var(--$1-$2)');
const toJson = (v) => String(v).replace(/var\(--(plx-(?:ref|sys|comp))-([a-z0-9-]+)\)/g, '{$1.$2}');

// a set's tokens in order: [{ name: '--plx-…', token }]
// a text role (Styling Standard 6) is six separate tokens in semantic/typography.tokens.json, --plx-sys-text-<role>-font-family
// … -word-spacing, written by hand (#372 step 3), so plain Style Dictionary writes the same properties. A W3C "typography"
// composite is not built: check-system.rules/token-sets.js says so, and so does this build until #372 step 10 retires it
// the condition sets (#372 step 4): a token's value under a condition sits in a set of its own, beside the token's set,
// <set>.<condition>.tokens.json (theme-default.light.forced-colors.tokens.json, components/calendar.forced-colors.tokens.json),
// so plain Style Dictionary writes each under its condition (the selector option: an @media, then the set's selector).
// This build reads them back onto their tokens ($extensions.com.plenix.<key>, below) and writes today's paired blocks
// until #372 step 10 retires it. A condition set defines no token of its own: each of its tokens is in the base set.
const CONDITIONS = { 'forced-colors': 'forcedColors', 'more-contrast': 'contrastMore', print: 'print', 'reduced-motion': 'reducedMotion' };
const CONDITION_FILE = new RegExp('\\.(' + Object.keys(CONDITIONS).join('|') + ')\\.tokens\\.json$');
function withConditions(rel, data) {
  for (const [cond, key] of Object.entries(CONDITIONS)) {
    const file = rel.replace(/\.tokens\.json$/, '.' + cond + '.tokens.json'), p = path.join(SRC, file);
    if (!fs.existsSync(p)) continue;
    const set = JSON.parse(fs.readFileSync(p, 'utf8'));
    for (const tier of TIERS) for (const [k, token] of Object.entries(set[tier] || {})) {
      const base = data[tier] && data[tier][k];
      if (!base) throw new Error('platform/tokens/' + file + ': --' + tier + '-' + k + ' is not defined in ' + rel + ' (a condition set holds only values of its base set\'s tokens)');
      base.$extensions = base.$extensions || {};
      base.$extensions[EXT] = Object.assign({}, base.$extensions[EXT], { [key]: token.$value });
    }
  }
  return data;
}

const TYPOGRAPHY_COMPOSITE = 'a typography composite is not built: write the role as six tokens, -font-family, -font-size, -font-weight, -letter-spacing, -line-height and -word-spacing';
function tokensOf(set) {
  const out = [];
  for (const tier of TIERS) for (const [key, token] of Object.entries(set[tier] || {})) {
    const order = (token.$extensions && token.$extensions[EXT] && token.$extensions[EXT].order) || 0;
    if (token.$type === 'typography') throw new Error('--' + tier + '-' + key + ': ' + TYPOGRAPHY_COMPOSITE);
    out.push({ name: '--' + tier + '-' + key, token, order });
  }
  return out.sort((a, b) => a.order - b.order);
}

// the themes (platform/standards/themes.json, batch 219): one stylesheet each, platform/system/themes/<name>.css, from its
// light and dark token sets. The selectors come from the theme's name: the default theme also answers :root (a page with
// no data-plx-theme); another theme answers only its own name. Every theme defines the same roles as the default theme,
// and a theme value never writes a color literal (colors come from the palette, by reference).
const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i;
function themeSelectors(name, isDefault) {
  const t = '[data-plx-theme="' + name + '"]', other = '[data-plx-theme]:not(' + t + ')';
  // light and dark are what the index reads; css* are what the stylesheet writes: exclusive, so an element takes one
  // theme's light or dark set, never two (zero overlap, Styling Standard 3.5)
  return isDefault
    ? { light: ':root,' + t + '[data-plx-mode="light"]', dark: ':root[data-plx-mode="dark"],' + t + '[data-plx-mode="dark"]',
      cssLight: ':root:not([data-plx-mode="dark"], ' + other + '),' + t + '[data-plx-mode="light"]', cssDark: ':root[data-plx-mode="dark"]:not(' + other + '),' + t + '[data-plx-mode="dark"]',
      cssFoundations: ':root:not(' + other + '),' + t }
    : { light: t + ',' + t + '[data-plx-mode="light"]', dark: t + '[data-plx-mode="dark"]',
      cssLight: t + ':not([data-plx-mode="dark"])', cssDark: t + '[data-plx-mode="dark"]', cssFoundations: t };
}
// the selector a token set is written under (zero overlap, Styling Standard 3.5): an element matches one density set
// and one interaction set at most. A density set: the element's own density, else its root's policy, else standard. An
// interaction set: the root alone (its values inherit, so a density context under it needs no rule of its own).
function cssSelectorOf(sel) {
  const items = sel.split(',').map((s) => s.trim());
  if (/data-plx-interaction="/.test(sel)) return items.filter((i) => !/\s/.test(i)).join(',');
  const dens = [...new Set(items.flatMap((i) => [...i.matchAll(/data-plx-density(?:-policy)?="([a-z]+)"/g)].map((m) => m[1])))];
  if (!dens.length) return sel;
  const parts = dens.map((d) => '[data-plx-density="' + d + '"]').concat(dens.map((d) => ':root[data-plx-density-policy="' + d + '"]:not([data-plx-density])'));
  if (dens.includes('standard')) parts.push(':root:not([data-plx-density], [data-plx-density-policy])');
  return parts.join(',');
}
// the layer a set writes for a token that several sets declare (it then writes --plx-ctx-<layer>-<token>, and one rule
// per context picks: interaction, then density, then the base value)
const layerOf = (sel) => (/:root(\[data-plx-interaction="|:not\(\[data-plx-interaction\]\))/.test(sel) ? 'interaction' : /data-plx-density(-policy)?="/.test(sel) ? 'density' : 'base');
const ctxName = (layer, name) => '--plx-ctx-' + layer + '-' + name.slice(2);
const NL = String.fromCharCode(10);
function themeOutputs(root) {
  const std = JSON.parse(fs.readFileSync(path.join(root, 'platform', 'standards', 'themes.json'), 'utf8'));
  const names = Object.keys(std.themes || {});
  if (!std.themes || !std.themes[std.default]) throw new Error('platform/standards/themes.json: the default theme "' + std.default + '" is not defined');
  // the default theme first, so a theme's rules come after the ones it overrides
  names.sort((a, b) => (a === std.default ? -1 : b === std.default ? 1 : 0));
  const outs = [], errors = [];
  let roles = null, scales = null;
  for (const name of names) {
    const th = std.themes[name], sel = themeSelectors(name, name === std.default), sets = [];
    // the theme's foundations (typefaces, weights, shape, lines, motion, opacity, the focus ring): the same in light and
    // dark, so they sit on the theme alone (batch 220); every theme defines the same scales as the default theme
    if (!th.foundations) errors.push(name + ': no foundations token file');
    else {
      const fsel = name === std.default ? ':root,[data-plx-theme="' + name + '"]' : '[data-plx-theme="' + name + '"]', fcss = sel.cssFoundations;
      const data = withConditions(th.foundations, JSON.parse(fs.readFileSync(path.join(SRC, th.foundations), 'utf8')));
      data.$extensions = data.$extensions || {}; data.$extensions[EXT] = Object.assign({}, data.$extensions[EXT], { output: 'platform/system/themes/' + name + '.css', selector: fsel, opener: fcss + '{' });
      const toks = tokensOf(data), list = toks.map((x) => x.name).sort().join(',');
      toks.forEach((x) => { if (COLOR_LITERAL.test(cssText(x.token.$value)) && !transparent(x.token.$value)) errors.push(th.foundations + ': ' + x.name + ' writes a color (' + cssText(x.token.$value) + ')'); });
      if (scales === null) scales = list; else if (list !== scales) errors.push(th.foundations + ': does not define the same foundations as the default theme');
      sets.push({ tokens: th.foundations, before: '', data });
    }
    for (const mode of ['light', 'dark']) {
      if (!th[mode]) { errors.push(name + ': no ' + mode + ' token file'); continue; }
      const data = withConditions(th[mode], JSON.parse(fs.readFileSync(path.join(SRC, th[mode]), 'utf8')));
      data.$extensions = data.$extensions || {}; data.$extensions[EXT] = Object.assign({}, data.$extensions[EXT], { output: 'platform/system/themes/' + name + '.css', selector: sel[mode], opener: sel[mode === 'light' ? 'cssLight' : 'cssDark'] + '{' });
      const toks = tokensOf(data);
      toks.forEach((x) => { if (COLOR_LITERAL.test(cssText(x.token.$value)) && !transparent(x.token.$value)) errors.push(th[mode] + ': ' + x.name + ' writes a color (' + cssText(x.token.$value) + '): point to a palette color, e.g. {plx-ref.color-blue-400}'); });
      const names2 = toks.map((x) => x.name).sort().join(',');
      if (roles === null && mode === 'light') roles = names2;
      else if (names2 !== roles) errors.push(th[mode] + ': does not define the same roles as the default theme');
      sets.push({ tokens: th[mode], before: NL, data });
    }
    outs.push({ file: 'platform/system/themes/' + name + '.css',
      prologue: '/* GENERATED by build-tokens.js from platform/tokens/ (' + th.light + ', ' + th.dark + ') and platform/standards/themes.json. Edit the JSON, never this file. */' + NL
        + '/* Plenix · Theme "' + name + '" (platform/system/themes/' + name + '.css): ' + (th.description || '') + NL
        + '   Every semantic color and elevation role, light and dark. <html data-plx-theme="' + name + '" data-plx-mode="light | dark">'
        + (name === std.default ? '; the default theme also applies without the attributes.' : '.') + ' */' + NL,
      sets, epilogue: NL });
  }
  if (errors.length) throw new Error('Themes (platform/standards/themes.json):' + NL + '  ' + errors.join(NL + '  '));
  return outs;
}

// a glob set of build.json ({ "glob": "components/*.tokens.json", "before": NL }): one set per file of that folder (library
// plan, wave 0: each new component owns platform/tokens/components/<name>.tokens.json, each foundation semantic/<topic>…),
// in name order, a file's contexts after its base file in the order of the output's own sets: <name>.tokens.json, then
// <name>.density-standard.tokens.json, <name>.density-compact…, as components.density-standard.tokens.json… are ordered.
// A file without "$extensions"."com.plenix" is written where the output's set of the same context is (components.<context>
// .tokens.json, or the output's first set for a base file), so a lane's file holds only its tokens.
function expandGlob(o, g) {
  const dir = path.dirname(g.glob), pat = path.basename(g.glob);
  if (pat !== '*.tokens.json') throw new Error('platform/tokens/build.json: a glob set must be <folder>/*.tokens.json (' + g.glob + ')');
  const full = path.join(SRC, dir);
  if (!fs.existsSync(full)) return [];
  const own = o.sets.filter((s) => s.tokens);
  const ctxOf = (f) => { const m = f.match(/^([^.]+)(?:\.(.+))?\.tokens\.json$/); return m ? { base: m[1], ctx: m[2] || '' } : null; };
  const rank = (ctx) => { if (!ctx) return -1; const i = own.findIndex((s) => s.tokens.endsWith('.' + ctx + '.tokens.json')); if (i < 0) throw new Error('platform/tokens/' + dir + ': no shared set for the context "' + ctx + '" in ' + o.file); return i; };
  return fs.readdirSync(full).filter((f) => f.endsWith('.tokens.json') && !CONDITION_FILE.test(f)).map((f) => {
    const c = ctxOf(f); if (!c) throw new Error('platform/tokens/' + dir + '/' + f + ': not <name>.tokens.json or <name>.<context>.tokens.json');
    return { f, c, r: rank(c.ctx) };
  }).sort((a, b) => (a.c.base < b.c.base ? -1 : a.c.base > b.c.base ? 1 : a.r - b.r)).map(({ f, r }) => {
    const data = withConditions(dir + '/' + f, JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')));
    if (!data.$extensions || !data.$extensions[EXT]) {
      const like = r < 0 ? own[0] : own[r];
      data.$extensions = Object.assign({}, data.$extensions, { [EXT]: Object.assign({}, like.data.$extensions[EXT], { tail: [] }) });
    }
    return { tokens: dir + '/' + f, before: g.before == null ? NL : g.before, data };
  });
}

function load(root = ROOT) {
  const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'build.json'), 'utf8'));
  for (const o of manifest.outputs) {
    for (const s of o.sets) if (s.tokens) s.data = withConditions(s.tokens, JSON.parse(fs.readFileSync(path.join(SRC, s.tokens), 'utf8')));
    o.sets = o.sets.reduce((all, s) => all.concat(s.glob ? expandGlob(o, s) : [s]), []);
  }
  // a token is defined in one file only: a lane's file never redefines a token of a shared set (or of another lane)
  const where = {};
  for (const o of manifest.outputs) for (const s of o.sets) {
    const ctx = s.data.$extensions[EXT].selector;
    for (const { name } of tokensOf(s.data)) { const k = name + ' @ ' + ctx; if (where[k] && (/\//.test(s.tokens) || /\//.test(where[k]))) throw new Error('platform/tokens: ' + name + ' is defined in ' + where[k] + ' and ' + s.tokens); where[k] = s.tokens; }
  }
  manifest.outputs = manifest.outputs.concat(themeOutputs(root));
  return manifest;
}

// the stylesheets as text: { 'platform/system/tokens/reference.css': text, … }, and where each token is written
function generate(manifest) {
  const files = {}, written = [];
  for (const o of manifest.outputs) {
    let text = o.prologue;
    // the tokens several of this stylesheet's sets declare: each set writes its layer's variable instead
    // (a theme's light and dark sets are alternatives, never layers: an element takes one of them)
    const count = {}; if (!o.file.includes('/themes/')) for (const s of o.sets) for (const { name } of tokensOf(s.data)) count[name] = (count[name] || 0) + 1;
    const layered = {};
    for (const s of o.sets) {
      const ext = s.data.$extensions[EXT];
      // a token only this set declares keeps the set's own selector (on :root it is every density's default); a layered
      // token's variable goes under the exclusive selector, after the set's block
      const css = cssSelectorOf(ext.selector), layer = layerOf(ext.selector), ctxLines = [], cond = [];
      const lines = [], still = [];
      for (const { name, token } of tokensOf(s.data)) {
        const x = (token.$extensions && token.$extensions[EXT]) || {};
        // a token with a motion-off value ("reducedMotion": "0s") is written under exclusive conditions instead (below)
        if (x.reducedMotion !== undefined) { (x.before || []).forEach((l) => lines.push(l)); still.push({ name, token, x }); continue; }
        // a token with a value for forced colors or more contrast is written under exclusive conditions instead (below)
        if (x.forcedColors !== undefined || x.contrastMore !== undefined || x.print !== undefined) { (x.before || []).forEach((l) => lines.push(l)); cond.push({ name, token, x }); continue; }
        (x.before || []).forEach((l) => lines.push(l));
        written.push({ name, file: o.file, set: s.tokens, selector: ext.selector, line: text.split('\n').length + lines.length + 1 });
        if (count[name] > 1) { (layered[name] = layered[name] || new Set()).add(layer); ctxLines.push('  ' + ctxName(layer, name) + ': ' + toCss(token.$value) + ';' + (x.after || '')); continue; }
        lines.push('  ' + name + ': ' + toCss(token.$value) + ';' + (x.after || ''));
      }
      (ext.tail || []).forEach((l) => lines.push(l));
      const own = lines.some((l) => /^\s*--/.test(l));
      if (own) text += s.before + ext.opener + '\n' + lines.join('\n') + '\n}';
      if (ctxLines.length) text += (own ? '\n' : s.before) + css + '{\n' + ctxLines.join('\n') + '\n}';
      // Motion off (Styling Standard 3.6, condition): the motion values apply only while the person has not asked for
      // reduced motion and no density change is in progress; otherwise the same tokens are 0s. The three blocks are
      // mutually exclusive, so each token has one declaration in every condition, and every component reads the tokens.
      // Forced colors and more contrast (Styling Standard 3.6, condition): the person's contrast settings change token
      // values only. Forced colors wins over more contrast; each token has one declaration in every case.
      if (cond.length) {
        const sel = ext.opener.replace(/\s*\{\s*$/, '');
        const FORCED = '(forced-colors: active)', MORE = '(prefers-contrast: more)';
        const block = (media, pick, list) => (list.length ? '\n@media ' + media + ' {\n  ' + sel + ' {\n' + list.map((t) => '    ' + t.name + ': ' + toCss(pick(t)) + ';').join('\n') + '\n  }\n}' : '');
        const both = cond.filter((t) => t.x.forcedColors !== undefined && t.x.contrastMore !== undefined);
        const forcedOnly = cond.filter((t) => t.x.forcedColors !== undefined && t.x.contrastMore === undefined);
        const moreOnly = cond.filter((t) => t.x.forcedColors === undefined && t.x.contrastMore !== undefined);
        // paper (print): its own tokens, never also a contrast token
        const paper = cond.filter((t) => t.x.print !== undefined);
        if (paper.some((t) => t.x.forcedColors !== undefined || t.x.contrastMore !== undefined)) throw new Error('a token with a print value has no contrast values: ' + paper.map((t) => t.name).join(', '));
        text += '\n/* the person\'s contrast settings: forced colors, then more contrast, else the values above */'
          + block('not (' + FORCED + ' or ' + MORE + ')', (t) => t.token.$value, both) + block(FORCED, (t) => t.x.forcedColors, both) + block(MORE + ' and (not ' + FORCED + ')', (t) => t.x.contrastMore, both)
          + block('not ' + FORCED, (t) => t.token.$value, forcedOnly) + block(FORCED, (t) => t.x.forcedColors, forcedOnly)
          + block('not ' + MORE, (t) => t.token.$value, moreOnly) + block(MORE, (t) => t.x.contrastMore, moreOnly)
          + block('not print', (t) => t.token.$value, paper) + block('print', (t) => t.x.print, paper);
        cond.forEach((t) => written.push({ name: t.name, file: o.file, set: s.tokens, selector: ext.selector, line: text.split('\n').length }));
      }
      if (still.length) {
        const decl = (pick) => still.map((t) => '    ' + t.name + ': ' + pick(t) + ';').join('\n');
        text += '\n/* motion: the values while motion is wanted; 0s for reduced motion and while the density changes (a frame) */'
          + '\n@media (prefers-reduced-motion: no-preference) {\n  :root:not([data-plx-density-changing]) {\n' + decl((t) => toCss(t.token.$value)) + '\n  }\n'
          + '  :root[data-plx-density-changing] {\n' + decl((t) => toCss(t.x.reducedMotion)) + '\n  }\n}'
          + '\n@media (prefers-reduced-motion: reduce) {\n  :root {\n' + decl((t) => toCss(t.x.reducedMotion)) + '\n  }\n}';
        still.forEach((t) => written.push({ name: t.name, file: o.file, set: s.tokens, selector: ':root', line: text.split('\n').length }));
      }
    }
    // each layered token, declared once per context: the interaction value, else the density value, else the base value
    const names = Object.keys(layered);
    if (names.length) {
      const pick = (n) => ['interaction', 'density', 'base'].filter((l) => layered[n].has(l)).reduceRight((acc, l) => (acc ? 'var(' + ctxName(l, n) + ', ' + acc + ')' : 'var(' + ctxName(l, n) + ')'), '');
      text += '\n/* the tokens several sets declare (zero overlap: each set writes its layer; interaction, then density, then base) */\n'
        + ':root,[data-plx-density],[data-plx-interaction]{\n' + names.map((n) => '  ' + n + ': ' + pick(n) + ';').join('\n') + '\n}';
    }
    files[o.file] = text + o.epilogue;
  }
  return { files, written };
}

function build(root = ROOT, { check = false, index = true } = {}) {
  const manifest = load(root);
  const { files, written } = generate(manifest);
  const stale = [];
  for (const [rel, text] of Object.entries(files)) {
    const p = path.join(root, rel);
    const now = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    if (now !== text) { stale.push(rel); if (!check) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); } }
  }
  // the token index (tools/token-index.js: plain Style Dictionary reads the tokens, issue 372 step 8) and the native outputs
  // from the same tokens (Platforms Standard 7.2): Swift, Kotlin and Dart in platform/mobile (build-mobile.js). They need the
  // whole token set, the component tokens kept beside their components included (a partial copy, such as the theme test's,
  // builds only the stylesheets)
  const whole = fs.existsSync(path.join(root, 'platform', 'components')) && fs.existsSync(path.join(root, 'build-mobile.js'));
  // index: false leaves both to indexAndMobile, which build-app.js calls once the other stylesheets are built (#692: the index
  // reads every Platform stylesheet, and a fresh checkout has the generated ones only after their own steps)
  if (!check && whole && index) require('./tools/token-index.js').writeIndex(root, written);
  const mobile = check || !whole || !index ? null : require('./build-mobile.js')(root);
  return { files: Object.keys(files), stale, count: written.length, mobile };
}

module.exports = build;
module.exports.toCss = toCss; module.exports.toJson = toJson;
// TEMPORARY until issue 372 step 10 (Style Dictionary writes the stylesheets, and tools/token-index.js reads where each token
// is written from them): where this build writes each token, [{ name, file, line, selector }], for the token index
module.exports.writtenForIndex = (root = ROOT) => generate(load(root)).written;
// the token index, then the native files from it (build-app.js, after every stylesheet step)
module.exports.indexAndMobile = (root = ROOT) => { require('./tools/token-index.js').writeIndex(root, module.exports.writtenForIndex(root)); return require('./build-mobile.js')(root); };
if (require.main === module) {
  const check = process.argv.includes('--check');
  const r = build(ROOT, { check });
  if (check) { if (r.stale.length) { console.log('Token stylesheets differ from platform/tokens (edit the JSON, then build): ' + r.stale.join(', ')); process.exit(1); } console.log('tokens ok (' + r.count + ')'); }
  else console.log('Built ' + r.files.length + ' token stylesheets (' + r.count + ' tokens' + (r.stale.length ? ', ' + r.stale.length + ' changed' : ', unchanged') + ') and tokens.index.json');
}
