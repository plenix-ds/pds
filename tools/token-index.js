// Plenix · the token index (tools/token-index.js; issue 372, Style Dictionary step 8): platform/tokens/tokens.index.json, for
// the design spec, the packages, the Figma map, the brand tools and the checks. One record per token: its tier, type,
// description, every set that gives it a value, its references and what refers to it, the values it resolves to in light
// and dark at each density, where it is written, what uses it, its color group and purpose, and its iOS and Android values.
//
// Plain Style Dictionary reads the tokens: style-dictionary/index/<group>.config.json, its built-in json format, into the
// ignored build/sd/index/ (npm run tokens:index runs both). One run per group of sets that share token names (the base
// sets, each density, each interaction mode, light, dark, the native sets), because one Style Dictionary dictionary keeps
// only the last value of a name. From each token this script takes what the file says (original: $value, $type,
// $description, $extensions) and the file it is in (filePath).
// What this script adds, because no Style Dictionary format does it: the order and selector of each set (platform/tokens/
// build.json, the sets' own $extensions, the themes of platform/standards/themes.json), the value of every token in each
// light or dark, density context (references followed in that context), what refers to each token, what uses it (the
// Platform's stylesheets), the tokens a component's own stylesheet declares, and the native values.
// `written` (file and line in the stylesheets) comes from build-tokens.js until issue 372 step 10, when Style Dictionary
// writes the stylesheets and this script reads it from them.
//   npm run tokens:index        Style Dictionary, then this script (build-tokens.js runs the same when it builds)
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const EXT = 'com.plenix';
const TIERS = ['plx-ref', 'plx-sys', 'plx-comp'];
const CONDITION_FILE = /\.(forced-colors|more-contrast|print|reduced-motion)\.tokens\.json$/;
const toCss = (v) => String(v).replace(/\{(plx-(?:ref|sys|comp))\.([a-z0-9-]+)\}/g, 'var(--$1-$2)');
const refsOf = (v) => [...String(v).matchAll(/\{(plx-(?:ref|sys|comp))\.([a-z0-9-]+)\}/g)].map((m) => '--' + m[1] + '-' + m[2]);

// Style Dictionary's json output for every group: build/sd/index/<group>.json
function styleDictionary(root) {
  const dir = path.join(root, 'style-dictionary', 'index'), bin = path.join(root, 'node_modules', '.bin', 'style-dictionary');
  const out = [];
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.config.json')).sort()) {
    const r = spawnSync(bin, ['build', '--config', path.join('style-dictionary', 'index', f)], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
    if (r.status !== 0) throw new Error('Style Dictionary failed on style-dictionary/index/' + f + ': ' + String(r.stderr || r.stdout || (r.error && r.error.message)).trim().split('\n').slice(-3).join(' '));
    out.push(JSON.parse(fs.readFileSync(path.join(root, 'build', 'sd', 'index', f.replace(/\.config\.json$/, '.json')), 'utf8')));
  }
  return out;
}

// each token file's tokens, in file order: { 'platform/tokens/<file>': [{ name, token }] }
function byFile(groups) {
  const files = {};
  for (const g of groups) for (const tier of TIERS) for (const [key, t] of Object.entries(g[tier] || {})) {
    if (!t || !t.filePath || !t.isSource) continue;
    const o = t.original || {};
    const token = {};
    for (const k of ['$value', '$type', '$description', '$extensions', '$deprecated']) if (o[k] !== undefined) token[k] = o[k];
    (files[t.filePath] = files[t.filePath] || []).push({ name: '--' + tier + '-' + key, token });
  }
  return files;
}

// the sets, in the order build-tokens.js writes them: [{ file, output, selector }]
function setsOf(root) {
  const SRC = path.join(root, 'platform', 'tokens');
  const ext = (file) => { const j = JSON.parse(fs.readFileSync(path.join(SRC, file), 'utf8')); return (j.$extensions && j.$extensions[EXT]) || null; };
  const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'build.json'), 'utf8'));
  const out = [];
  for (const o of manifest.outputs) {
    const own = o.sets.filter((s) => s.tokens).map((s) => ({ file: s.tokens, ext: ext(s.tokens) }));
    for (const s of o.sets) {
      if (s.tokens) { const x = own.find((y) => y.file === s.tokens); out.push({ file: x.file, output: o.file, selector: x.ext.selector }); continue; }
      // a glob: its files by name, a file's contexts after its base file; a file without its own extension takes the
      // selector of the output's set of the same context (build-tokens.js, expandGlob)
      const dir = path.dirname(s.glob), full = path.join(SRC, dir);
      if (!fs.existsSync(full)) continue;
      const rank = (ctx) => (ctx ? own.findIndex((y) => y.file.endsWith('.' + ctx + '.tokens.json')) : -1);
      fs.readdirSync(full).filter((f) => f.endsWith('.tokens.json') && !CONDITION_FILE.test(f)).map((f) => {
        const m = f.match(/^([^.]+)(?:\.(.+))?\.tokens\.json$/);
        return { f, base: m[1], r: rank(m[2] || '') };
      }).sort((a, b) => (a.base < b.base ? -1 : a.base > b.base ? 1 : a.r - b.r)).forEach(({ f, r }) => {
        const file = dir + '/' + f, x = ext(file) || (r < 0 ? own[0] : own[r]).ext;
        out.push({ file, output: o.file, selector: x.selector });
      });
    }
  }
  // the themes (platform/standards/themes.json), the default theme first: its foundations, then light and dark
  const std = JSON.parse(fs.readFileSync(path.join(root, 'platform', 'standards', 'themes.json'), 'utf8'));
  const names = Object.keys(std.themes).sort((a, b) => (a === std.default ? -1 : b === std.default ? 1 : 0));
  for (const name of names) {
    const th = std.themes[name], t = '[data-plx-theme="' + name + '"]', isDefault = name === std.default, output = 'platform/system/themes/' + name + '.css';
    out.push({ file: th.foundations, output, selector: isDefault ? ':root,' + t : t });
    out.push({ file: th.light, output, selector: isDefault ? ':root,' + t + '[data-plx-mode="light"]' : t + ',' + t + '[data-plx-mode="light"]' });
    out.push({ file: th.dark, output, selector: isDefault ? ':root[data-plx-mode="dark"],' + t + '[data-plx-mode="dark"]' : t + '[data-plx-mode="dark"]' });
  }
  return { sets: out, defaultTheme: std.default };
}

// the selector items a set is written under, as conditions: an item applies when every attribute it names has that value
function applies(selector, ctx, defaultTheme) {
  return selector.split(',').some((item) => {
    if (/data-plx-density-policy/.test(item)) return false;
    if (/:not\(\[data-plx-interaction\]\)/.test(item) && ctx.interaction) return false;
    for (const m of item.matchAll(/data-plx-([a-z-]+)="([^"]+)"/g)) {
      const k = m[1], v = m[2];
      if (k === 'theme') { if (v !== (ctx.theme || defaultTheme)) return false; continue; }
      if (ctx[k] !== v) return false;
    }
    return true;
  });
}

// the index: written is [{ name, file, line, selector }] from build-tokens.js (until issue 372 step 10)
function tokenIndex(root, written, groups = styleDictionary(root)) {
  const files = byFile(groups);
  const { sets: skeleton, defaultTheme } = setsOf(root);
  const sets = skeleton.map((s) => {
    // a file with no tokens (a lane that has none yet) gives Style Dictionary nothing; a file with tokens and no output
    // is missing from the configs
    const empty = () => { const j = JSON.parse(fs.readFileSync(path.join(root, 'platform', 'tokens', s.file), 'utf8')); return TIERS.every((t) => !Object.keys(j[t] || {}).length); };
    const tokens = files['platform/tokens/' + s.file] || (empty() ? [] : null);
    if (!tokens) throw new Error('No Style Dictionary output for platform/tokens/' + s.file + ': add it to a config of style-dictionary/index/');
    const order = (x) => (x.token.$extensions && x.token.$extensions[EXT] && x.token.$extensions[EXT].order) || 0;
    return Object.assign({}, s, { tokens: tokens.slice().sort((a, b) => order(a) - order(b)) });
  });
  const byName = {};
  for (const s of sets) for (const { name, token } of s.tokens) {
    const t = byName[name] = byName[name] || { name, tier: name.slice(2).split('-').slice(0, 2).join('-'), type: token.$type, description: token.$description || '', sets: [], refs: [], usedBy: [], referencedBy: [] };
    t.sets.push({ file: s.file, output: s.output, selector: s.selector, value: toCss(token.$value) });
    for (const r of refsOf(token.$value)) if (!t.refs.includes(r)) t.refs.push(r);
    if (!t.type && token.$type) t.type = token.$type;
    // a token going away (VERSIONING.md, Deprecation): its W3C $deprecated text, for the spec's token page (issue 882)
    if (token.$deprecated && !t.deprecated) t.deprecated = token.$deprecated === true ? 'Deprecated.' : String(token.$deprecated);
    // a color role's group and purpose ($extensions.plenix, the color groups of 2026-10-13; check-system rule color-groups)
    const px = token.$extensions && token.$extensions.plenix;
    if (px && px.group && !t.group) { t.group = px.group; t.purpose = px.purpose || ''; }
  }
  for (const w of written) { const t = byName[w.name]; (t.written = t.written || []).push({ file: w.file, line: w.line, selector: w.selector }); }
  for (const t of Object.values(byName)) for (const r of t.refs) if (byName[r] && !byName[r].referencedBy.includes(t.name)) byName[r].referencedBy.push(t.name);
  // the value in a context: the last set that applies wins; references resolve in the same context
  const CONTEXTS = [];
  for (const mode of ['light', 'dark']) for (const density of ['compact', 'standard', 'comfortable']) CONTEXTS.push({ mode, density, interaction: null });
  const raw = (name, ctx) => { let v = null; for (const s of sets) if (applies(s.selector, ctx, defaultTheme)) for (const x of s.tokens) if (x.name === name) v = toCss(x.token.$value); return v; };
  const resolve = (name, ctx, seen = new Set(), rawFn = raw) => {
    if (seen.has(name)) return null; seen.add(name);
    const v = rawFn(name, ctx); if (v == null) return null;
    return v.replace(/var\((--plx-[a-z0-9-]+)\)/g, (m, n) => { const r = resolve(n, ctx, new Set(seen), rawFn); return r == null ? m : r; });
  };
  // component settings a component's own stylesheet declares (.plx-button{--plx-comp-button-height:…}): indexed with the
  // stylesheet as their source (the icon glyphs, generated data URIs, are left out)
  const local = (dir) => { if (!fs.existsSync(dir)) return; for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { local(p); continue; }
    if (!f.name.endsWith('.css') || f.name === 'icon.css') continue;
    const rel = path.relative(root, p).replace(/\\/g, '/'), css = fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) for (const d of m[2].matchAll(/(--plx-[a-z0-9-]+)\s*:\s*([^;]+)/g)) {
      const name = d[1], value = d[2].trim(), selector = m[1].trim().replace(/\s+/g, ' ');
      if (byName[name] && !byName[name].local) continue;
      const t = byName[name] = byName[name] || { name, tier: name.slice(2).split('-').slice(0, 2).join('-'), type: null, description: 'Declared by its component’s stylesheet (' + rel + ').', local: true, sets: [], refs: [], usedBy: [], referencedBy: [], written: [] };
      t.sets.push({ file: rel, output: rel, selector, value });
      t.written.push({ file: rel, line: css.slice(0, m.index + m[0].indexOf(d[0])).split('\n').length, selector });
      for (const r of value.matchAll(/var\((--plx-[a-z0-9-]+)/g)) if (!t.refs.includes(r[1])) t.refs.push(r[1]);
    }
  } };
  for (const k of ['components', 'patterns', 'system']) local(path.join(root, 'platform', k));
  for (const t of Object.values(byName)) if (t.local) for (const r of t.refs) if (byName[r] && !byName[r].referencedBy.includes(t.name)) byName[r].referencedBy.push(t.name);
  const raw2 = (name, ctx) => { const v = raw(name, ctx); if (v != null) return v; const t = byName[name]; return t && t.local ? t.sets[0].value : null; };
  for (const t of Object.values(byName)) {
    const vals = {}; for (const c of CONTEXTS) vals[c.mode + '/' + c.density] = resolve(t.name, c, undefined, raw2);
    const uniq = [...new Set(Object.values(vals))];
    t.resolved = uniq.length === 1 ? { all: uniq[0] } : vals;
  }
  // what uses each token: the Platform's stylesheets other than the token files (var(--plx-…)), and its scripts (a token
  // name in the code, outside comments: getPropertyValue('--plx-…'), tokenValue('--plx-…'), var(--plx-…) in a string;
  // #882: a token only JavaScript reads was listed as unused)
  const CODE = /\.(js|jsx|ts|tsx|mjs)$/;
  const used = (dir) => { if (!fs.existsSync(dir)) return; for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { if (!/^(dist|vendor|tokens|design-system|icons|mobile)$/.test(f.name)) used(p); continue; }
    const css = f.name.endsWith('.css') && !/themes[\\/]plenix\.css$/.test(p), code = CODE.test(f.name) && !f.name.endsWith('.d.ts');
    if (!css && !code) continue;
    const rel = path.relative(root, p).replace(/\\/g, '/'), text = fs.readFileSync(p, 'utf8');
    const names = css ? [...text.matchAll(/var\((--plx-[a-z0-9-]+)/g)].map((x) => x[1])
      : [...text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1').matchAll(/--plx-[a-z0-9-]*[a-z0-9]/g)].map((x) => x[0]);
    for (const m of new Set(names)) if (byName[m]) byName[m].usedBy.push(rel);
  } };
  used(path.join(root, 'platform'));
  // the native values (Platforms Standard 7.1: one set of names, values per platform): each value of the iOS and Android
  // sets joins the web token it maps to as platforms.<platform>; a value with no web role is listed under platformOnly
  const platformOnly = [];
  const native = groups.find((g) => g['plx-platform-ios'] || g['plx-platform-android']) || {};
  for (const [plat, key] of [['ios', 'plx-platform-ios'], ['android', 'plx-platform-android']]) {
    if (!native[key]) continue;
    const walk = (obj, pre) => { for (const k of Object.keys(obj)) {
      if (k.charAt(0) === '$') continue;
      const v = obj[k], seg = /^plx-/.test(k) ? '' : k, name = !seg ? pre : pre ? pre + '.' + seg : seg;
      if (!v || typeof v !== 'object') continue;
      if (v.$value === undefined) { walk(v, name); continue; }
      const o = v.original || v;
      const x = (o.$extensions && o.$extensions.plenix) || {}, web = x.web && typeof x.web === 'object' ? x.web.token : x.web;
      const rec = { name, value: o.$value, type: o.$type, description: o.$description || '', source: x.source || null };
      if (x.web && typeof x.web === 'object') rec.role = x.web.class;
      if (web && byName[web]) { const t = byName[web]; t.platforms = t.platforms || {}; (t.platforms[plat] = t.platforms[plat] || []).push(rec); }
      else platformOnly.push(Object.assign({ platform: plat }, rec, web ? { web } : {}));
    } };
    walk(native[key], '');
  }
  return { $description: 'Generated by build-tokens.js from platform/tokens (do not edit). One record per token; platforms holds a token\'s iOS and Android values (platform-ios/android.tokens.json), platformOnly the native values with no web token.', count: Object.keys(byName).length, tokens: Object.values(byName), platformOnly };
}

// writes platform/tokens/tokens.index.json; returns its token count
function writeIndex(root, written) {
  const index = tokenIndex(root, written);
  fs.writeFileSync(path.join(root, 'platform', 'tokens', 'tokens.index.json'), JSON.stringify(index) + '\n');
  return index.count;
}

module.exports = { tokenIndex, writeIndex };
if (require.main === module) {
  const root = path.join(__dirname, '..');
  // TEMPORARY until issue 372 step 10: where build-tokens.js writes each token (build-tokens.js, writtenForIndex)
  const count = writeIndex(root, require(path.join(root, 'build-tokens.js')).writtenForIndex(root));
  console.log('tokens.index.json: ' + count + ' tokens');
}
