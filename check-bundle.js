// Checks the built CDN files against the bundle rules (owner, bundle-check-27; issues 456 to 461). Read-only:
//   node check-bundle.js              reads release/cdn/<version>/ (node build-packages.js writes it) and compares it with
//                                     check-bundle.baseline.json
//   node check-bundle.js --update     writes today's counts into check-bundle.baseline.json (a deliberate step)
//   node check-bundle.js --list       also prints where every finding is (the source file of plenix.js, or the CSS rule)
// It counts, per rule, what the bundle still does and fails (BUNDLE_FAIL, exit 1) when any count goes up from the baseline. A count that goes down prints "lower the baseline" (run --update in the same pull request).
//
//   P-38  runtime addresses (456)    plenix.js: string values with an absolute address (http:, https:, //host) or a /cdn/ or
//                                    vendor/ path, which the bundle fetches at runtime. XML namespaces and example
//                                    addresses (example.com/org/net, *.invalid, *.test) are not addresses
//   P-45  injected scripts (457)     plenix.js: createElement('script'), and strings that write a <script> tag
//   P-46  page prefetch (458)        plenix.js: the values prefetch, prerender, preload, modulepreload and speculationrules
//   P-47  raw HTML (461)             plenix.js: innerHTML or outerHTML set, insertAdjacentHTML, document.write,
//                                    createContextualFragment, dangerouslySetInnerHTML; the rich-text engine is exempt
//                                    (RICH_TEXT below: it cleans its HTML with cleanRichText)
//   P-48  unsupported CSS (459)      plenix.css: style rules that use a CSS feature outside the supported browsers
//                                    (.browserslistrc, platform/standards/browsers.json) with no @supports guard around them
//                                    (UNSUPPORTED below). Guarded rules have a fallback and are printed for information only
// The size of plenix.css is not a rule (owner, #460): it is printed as a plain number, in KB (1024 bytes, rounded up), with
// plenix.min.css, and the check never fails on it.
// One import from the npm package is (#685): { Button }, { Badge }, { DataGrid } and * as P, bundled against
// packages/react/dist/index.js the way the audit measured (tools/agent/one-part-sizes.js); one above its limit fails.
// The scan reads the code, not the comments: plenix.js is parsed (@babel/standalone) and each finding is traced to the
// source file it came from through the Platform bundle's hidden source map (build/vite/platform.js.map, written by
// node build-app.js into an ignored folder; plenix.js is a copy of platform/dist/platform.js, #709); plenix.css is parsed with PostCSS. plenix.esm.js holds the same modules and is not counted twice.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const VERSION = require('./package.json').version;
const CDN = path.join(ROOT, 'release', 'cdn', VERSION);
const BASELINE = path.join(ROOT, 'check-bundle.baseline.json');
const args = process.argv.slice(2);
const UPDATE = args.includes('--update'), LIST = args.includes('--list');

// the rich-text engine: its modules may write HTML (cleanRichText cleans it first)
const RICH_TEXT = /^platform\/(components\/RichText(Editor)?\/|utils\/richText|vendor\/tiptap\/)/;
// CSS features outside the supported browsers (the last 2 Chrome, Edge, Firefox, Safari and iOS versions): a property name
// or a value. Keep this list to features that one of those browsers still lacks; remove one when all of them ship it.
const UNSUPPORTED = [
  { name: 'anchor positioning', prop: /^(anchor-name|anchor-scope|position-anchor|position-area|inset-area|position-try(-fallbacks|-order)?|position-visibility)$/, value: /(^|[^\w-])anchor(-size)?\(/, atRule: /^position-try$/ },
  { name: 'field-sizing', prop: /^field-sizing$/ },
  { name: 'interpolate-size and calc-size()', prop: /^interpolate-size$/, value: /(^|[^\w-])calc-size\(/ },
  { name: 'scroll-driven animations', prop: /^(animation-timeline|animation-range(-start|-end)?|scroll-timeline(-name|-axis)?|view-timeline(-name|-axis|-inset)?|timeline-scope)$/ },
  { name: 'text-box trimming', prop: /^text-box(-trim|-edge)?$/ },
  { name: 'customizable select', value: /(^|[^\w-])base-select\b/, selector: /::picker\(|::picker-icon|::checkmark/ },
  { name: 'sibling-index() and sibling-count()', value: /(^|[^\w-])sibling-(index|count)\(/ },
  { name: 'CSS if()', value: /(^|[\s(,:])if\(/ },
  { name: 'corner-shape', prop: /^corner-shape$/ },
  { name: 'reading-flow', prop: /^reading-(flow|order)$/ },
];
const RULES = {
  'P-38': 'runtime addresses (#456)', 'P-45': 'injected scripts (#457)', 'P-46': 'page prefetch (#458)',
  'P-47': 'raw HTML outside the rich-text engine (#461)', 'P-48': 'unsupported CSS without a fallback (#459)'
};

function need(file) {
  const f = path.join(CDN, file);
  if (!fs.existsSync(f)) { console.log('BUNDLE_FAIL: ' + path.relative(ROOT, f) + ' is missing: run node build-app.js, then node build-packages.js'); process.exit(1); }
  return f;
}

// ---- plenix.js: the source file of a position, through the source map of the same build
function sourceMapOf(file) {
  // the CDN's plenix.js is the browser global without the built-in Arabic words (issue 882): build-packages.js builds it
  // into build/vite/cdn/plenix.js, with its hidden source map beside it
  const built = path.join(ROOT, 'build', 'vite', 'cdn', 'plenix.js'), mapFile = path.join(ROOT, 'build', 'vite', 'cdn', 'plenix.js.map');
  if (!fs.existsSync(mapFile) || !fs.existsSync(built) || !fs.readFileSync(file).equals(fs.readFileSync(built))) {
    console.log('BUNDLE_FAIL: ' + path.relative(ROOT, file) + ' has no source map of its own build (build/vite/cdn/plenix.js.map, for the same build/vite/cdn/plenix.js): run node build-app.js, then node build-packages.js'); process.exit(1);
  }
  const map = new (require('module').SourceMap)(JSON.parse(fs.readFileSync(mapFile, 'utf8')));
  const dir = path.dirname(mapFile);
  // loc: Babel's (line from 1, column from 0); a position with no mapping on its own line is the bundle's own code
  return (loc) => {
    const e = map.findEntry(loc.line - 1, loc.column);
    return e && e.originalSource && e.generatedLine === loc.line - 1 ? path.relative(ROOT, path.resolve(dir, e.originalSource)).split(path.sep).join('/') : undefined;
  };
}

// ---- plenix.js: one walk over the parsed bundle, with the source file each finding comes from
const NOT_ADDRESS = /^https?:\/\/(www\.w3\.org\/|[\w.-]*\b(example\.(com|org|net)|invalid|test|localhost)\b)/i;
const PREFETCH = new Set(['prefetch', 'prerender', 'preload', 'modulepreload', 'speculationrules']);
function scanScript(file) {
  const Babel = require('@babel/standalone');
  const code = fs.readFileSync(file, 'utf8');
  const ast = Babel.transform(code, { ast: true, code: false, sourceType: 'script', configFile: false, babelrc: false }).ast;
  const sourceOf = sourceMapOf(file);
  const found = { 'P-38': [], 'P-45': [], 'P-46': [], 'P-47': [] };
  const at = (node, module, what) => ({ where: (module || '(bundle)') + ' (plenix.js:' + node.loc.start.line + ')', what, module });
  const name = (n) => n && (n.type === 'Identifier' ? n.name : n.type === 'StringLiteral' ? n.value : null);
  const prop = (n) => n && (n.type === 'MemberExpression' || n.type === 'OptionalMemberExpression') && (n.computed ? name(n.property) : n.property.name);
  function strings(node, module, text) {
    const v = String(text);
    if ((/^(https?:)?\/\/[\w-]+(\.[\w-]+)+/i.test(v.trim()) || /\bhttps?:\/\/[\w-]+\.[\w.-]+/i.test(v)) && !NOT_ADDRESS.test(v.trim().replace(/^.*?(https?:\/\/)/i, '$1'))) found['P-38'].push(at(node, module, JSON.stringify(v.slice(0, 80))));
    else if (/(^|\/)cdn\/|(^|[/.])vendor\//.test(v) && v.length < 200) found['P-38'].push(at(node, module, JSON.stringify(v.slice(0, 80))));
    if (/<script[\s>]/i.test(v)) found['P-45'].push(at(node, module, 'a <script> tag in a string'));
    if (PREFETCH.has(v.trim().toLowerCase())) found['P-46'].push(at(node, module, JSON.stringify(v)));
  }
  function walk(node) {
    if (!node || typeof node.type !== 'string') return;
    const module = node.loc ? sourceOf(node.loc.start) : undefined;
    switch (node.type) {
      case 'StringLiteral': strings(node, module, node.value); break;
      case 'TemplateLiteral': strings(node, module, node.quasis.map((q) => q.value.cooked).join('${}')); break;
      case 'CallExpression': {
        const p = prop(node.callee), a = node.arguments[0];
        if (p === 'createElement' && a && a.type === 'StringLiteral' && a.value.toLowerCase() === 'script') found['P-45'].push(at(node, module, "createElement('script')"));
        if ((p === 'insertAdjacentHTML' || p === 'createContextualFragment' || ((p === 'write' || p === 'writeln') && name(node.callee.object) === 'document')) && !RICH_TEXT.test(module || '')) found['P-47'].push(at(node, module, p));
        if (p === 'supports' && a && a.type === 'StringLiteral' && PREFETCH.has(a.value.toLowerCase())) { /* counted as the string */ }
        break;
      }
      case 'AssignmentExpression': {
        const p = prop(node.left);
        if ((p === 'innerHTML' || p === 'outerHTML') && !RICH_TEXT.test(module || '')) found['P-47'].push(at(node, module, p + ' ='));
        break;
      }
      case 'ObjectProperty': case 'JSXAttribute': {
        const k = node.type === 'JSXAttribute' ? node.name.name : name(node.key);
        if (k === 'dangerouslySetInnerHTML' && !RICH_TEXT.test(module || '')) found['P-47'].push(at(node, module, 'dangerouslySetInnerHTML'));
        break;
      }
      default:
    }
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments' || key === 'extra') continue;
      const v = node[key];
      if (Array.isArray(v)) v.forEach((c) => walk(c)); else if (v && typeof v.type === 'string') walk(v);
    }
  }
  walk(ast.program);
  return found;
}

// ---- plenix.css: style rules with an unsupported feature, guarded by @supports or not
function scanStyles(file) {
  const postcss = require('postcss');
  const root = postcss.parse(fs.readFileSync(file, 'utf8'));
  const open = new Map(), guarded = new Set();
  const isGuarded = (n) => { for (let p = n.parent; p; p = p.parent) if (p.type === 'atrule' && p.name === 'supports') return true; return false; };
  const hit = (holder, feature) => {
    if (isGuarded(holder)) { guarded.add(holder); return; }
    const key = holder; if (!open.has(key)) open.set(key, { where: (holder.selector || '@' + holder.name + ' ' + holder.params).replace(/\s+/g, ' ').slice(0, 90) + ' (plenix.css:' + holder.source.start.line + ')', what: feature.name });
  };
  root.walkDecls((d) => UNSUPPORTED.forEach((f) => { if ((f.prop && f.prop.test(d.prop)) || (f.value && f.value.test(d.value))) hit(d.parent, f); }));
  root.walkRules((r) => UNSUPPORTED.forEach((f) => { if (f.selector && f.selector.test(r.selector)) hit(r, f); }));
  root.walkAtRules((a) => UNSUPPORTED.forEach((f) => { if (f.atRule && f.atRule.test(a.name)) hit(a, f); }));
  return { found: [...open.values()], guarded: guarded.size };
}

const kb = (f) => Math.ceil(fs.statSync(f).size / 1024);
const js = scanScript(need('plenix.js'));
const css = scanStyles(need('plenix.css'));
const now = { 'P-38': js['P-38'].length, 'P-45': js['P-45'].length, 'P-46': js['P-46'].length, 'P-47': js['P-47'].length, 'P-48': css.found.length };
const where = Object.assign({}, js, { 'P-48': css.found });

if (UPDATE) {
  fs.writeFileSync(BASELINE, JSON.stringify({ $description: 'The bundle rules baseline (check-bundle.js; owner, bundle-check-27). Counts per rule in the built CDN files. The check fails when a count goes up. Lower it with node check-bundle.js --update when one goes down; never raise it to pass.', version: VERSION, rules: now }, null, 2) + '\n');
  console.log('BUNDLE_BASELINE written for ' + VERSION + ': ' + Object.keys(now).map((k) => k + ' ' + now[k]).join(', '));
  process.exit(0);
}
const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')).rules : null;
if (!base) { console.log('BUNDLE_FAIL: check-bundle.baseline.json is missing: node check-bundle.js --update writes it'); process.exit(1); }

let up = 0, down = 0;
console.log('Bundle rules, release/cdn/' + VERSION + '/ (plenix.js, plenix.css)');
for (const k of Object.keys(RULES)) {
  const b = base[k] == null ? 0 : base[k], n = now[k], unit = '';
  const note = n > b ? '  UP from ' + b + unit + ': not allowed' : n < b ? '  down from ' + b + unit + ': lower the baseline (node check-bundle.js --update)' : '';
  if (n > b) up++; if (n < b) down++;
  console.log('  ' + k + '  ' + RULES[k] + ': ' + n + unit + note);
  if (LIST || n > b) (where[k] || []).forEach((f) => console.log('        ' + f.where + '  ' + f.what));
}
console.log('  (information, never a failure) plenix.css: ' + kb(need('plenix.css')) + ' KB; plenix.min.css: ' + kb(need('plenix.min.css')) + ' KB; unsupported CSS inside @supports (has a fallback): ' + css.guarded + ' rules');
// one import from the npm package (#685): what an app that imports one part bundles (tools/agent/one-part-sizes.js: the
// Vite, minified, React external, with esbuild's number beside it as a cross-check, against packages/react); a size above its limit fails, so tree-shaking
// cannot break again unseen
const parts = require('./tools/agent/one-part-sizes.js');
let over = 0;
if (fs.existsSync(parts.entryOf())) {
  console.log('  one import from @plenix-ds/react (Vite, minified, React external; esbuild beside it, cross-check only):');
  for (const r of parts.measure()) { if (r.over) over++; console.log('        ' + parts.line(r)); }
} else { console.log('BUNDLE_FAIL: packages/react is missing: run node build-packages.js'); process.exit(1); }
// the styles per part (#710): foundations.css and parts/*.css add up to plenix.css, in its order, and ties keep it
// (tools/agent/style-parts-check.js)
if (!fs.existsSync(path.join(ROOT, 'packages', 'styles', 'foundations.css'))) { console.log('BUNDLE_FAIL: packages/styles/foundations.css is missing: run node build-packages.js'); process.exit(1); }
const styleParts = require('./tools/agent/style-parts-check.js').check(LIST).bad ? 1 : 0;
// no non-ASCII character in the code of a shipped script (check-system.rules/ascii-bundles.js, the charset break of 2026-11-02): a page that loads
// plenix.js or plenix.esm.js without a charset must still run (comments may hold any character); never a baseline, always zero
let nonAscii = 0;
const ascii = require('./check-system.rules/ascii-bundles.js');
fs.readdirSync(CDN).filter((f) => /\.(c|m)?js$/.test(f)).forEach((f) => {
  const hit = ascii.nonAsciiOutsideComments(fs.readFileSync(path.join(CDN, f), 'utf8'));
  if (hit) { nonAscii++; console.log('BUNDLE_FAIL: ' + f + ':' + hit.line + ' a non-ASCII character in code (a page loaded without a charset breaks): ' + JSON.stringify(hit.text)); }
});
if (!nonAscii) console.log('  non-ASCII characters in the code of the CDN scripts: 0');
// React in scope (check-system.rules/react-in-scope.js, the npm DataGrid that did not draw): every shipped ES module binds the React it uses
let noReact = 0;
const inScope = require('./check-system.rules/react-in-scope.js');
for (const f of inScope.esModules()) {
  const hit = inScope.unboundReact(fs.readFileSync(f, 'utf8'));
  if (hit) { noReact++; console.log('BUNDLE_FAIL: ' + path.relative(ROOT, f) + ':' + hit.line + ' React is used but never imported (the first render throws "React is not defined"): ' + JSON.stringify(hit.text)); }
}
if (!noReact) console.log('  ES modules that use React without importing it: 0');
if (up || over || styleParts || nonAscii || noReact) { console.log('BUNDLE_FAIL (' + [up ? up + ' rule' + (up > 1 ? 's' : '') + ' went up' : '', over ? over + ' one-part import' + (over > 1 ? 's' : '') + ' over the limit' : '', styleParts ? 'the style parts do not add up to plenix.css' : '', nonAscii ? nonAscii + ' script' + (nonAscii > 1 ? 's' : '') + ' with non-ASCII code' : '', noReact ? noReact + ' module' + (noReact > 1 ? 's' : '') + ' using React without importing it' : ''].filter(Boolean).join(', ') + ')'); process.exit(1); }
console.log(down ? 'BUNDLE_OK (' + down + ' went down: lower the baseline)' : 'BUNDLE_OK');
