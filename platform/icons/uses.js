// Plenix · which icon names a body of source draws (#280, stage 5a). Build-time only (Node); no page loads this file.
// Reads the JSX (and TypeScript) source with Babel's parser (no regular expressions over code) and collects every icon name written in an
// icon slot:
//   - a JSX attribute icon, iconEnd or <anything>Icon (stateIcon, typeIcon), and name on <Icon> or <StatusIcon>
//   - an object property with one of those keys (a toolbar's { icon: 'format_bold' }), and name in h(Icon, { name })
//   - a constant whose name ends in Icon or Icons (const typeIcons = { text: 'ed-text' }) and its values
//   - a default in a parameter (({ icon = 'info' }) => …)
// A value is followed through a ternary, || and ??, a constant declared in the same file, and a lookup into a constant
// object or array of the same file (KIND[ext]). A value that comes from outside (a prop, item.icon) is the caller's
// and is not collected. A name built at run time ('density-' + d.value, a template with ${…}, a function's result)
// cannot be read: in strict mode the scan fails, naming the file and line, unless the line (or the line before) lists the
// names it can take in a comment:   /* plx-icons: density-large density-medium density-small */
//   scan(root, folders, { names, strict }) -> { found: Map<name, Set<file:line>>, unresolved: [file:line …], unknown: [...] }
//   scanText(text, rel, report, opts): one body of source text, reported through report.name(name, at, node, file) and
//     report.unresolved(at) (a site's pages: tools/icons/site-icons.js)
const fs = require('fs');
const path = require('path');

const SLOT = /^(icon|iconEnd|iconStart|glyph|[a-z][A-Za-z]*Icons?)$/;   // iconOnly is a flag; leading takes an element; mark is a drag-and-drop insertion mark or a mark-as-read function
const ICON_ELEMENT = /(^|\.)(Icon|StatusIcon)$/;
const MARK = /plx-icons:\s*([a-z0-9_\- ]+)/;

let parser = null;
function parse(code, rel = '') {
  // @babel/parser (the parser alone): the one dependency of the packaged site-icon tool (@plenix-ds/icons, plenix-site-icons)
  if (!parser) parser = require('@babel/parser');
  return parser.parse(code, { sourceType: 'module', plugins: /\.[mc]?ts$/.test(rel) ? ['typescript'] : /\.tsx$/.test(rel) ? ['jsx', 'typescript'] : ['jsx'] });
}
const jsxName = (n) => (!n ? '' : n.type === 'JSXIdentifier' ? n.name : n.type === 'JSXMemberExpression' ? jsxName(n.object) + '.' + n.property.name : '');
const exprName = (n) => (!n ? '' : n.type === 'Identifier' ? n.name : n.type === 'MemberExpression' && !n.computed ? exprName(n.object) + '.' + n.property.name : '');
const keyOf = (p) => (p.key && (p.key.type === 'Identifier' ? p.key.name : p.key.type === 'StringLiteral' ? p.key.value : null));

function children(n) {
  const out = [];
  for (const k of Object.keys(n)) {
    if (k === 'parent' || k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments' || k === 'innerComments') continue;
    const c = n[k];
    if (Array.isArray(c)) { for (const x of c) if (x && typeof x.type === 'string') out.push(x); } else if (c && typeof c.type === 'string') out.push(c);
  }
  return out;
}

const FN = /^(FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod|ObjectMethod)$/;
// the names a pattern binds (a parameter, a destructuring)
function bound(p, out) {
  if (!p) return out;
  if (p.type === 'Identifier') out.add(p.name);
  else if (p.type === 'AssignmentPattern') bound(p.left, out);
  else if (p.type === 'RestElement') bound(p.argument, out);
  else if (p.type === 'ArrayPattern') p.elements.forEach((e) => bound(e, out));
  else if (p.type === 'ObjectPattern') p.properties.forEach((q) => bound(q.type === 'RestElement' ? q.argument : q.value, out));
  return out;
}

function scanFile(file, rel, report, opts = {}) { scanText(fs.readFileSync(file, 'utf8'), rel, report, opts); }
// the same scan over source text (a page's inline script: tools/icons/site-icons.js); rel names it in file:line
function scanText(text, rel, report, opts = {}) {
  const lines = text.split('\n');
  const ast = parse(text, rel);
  // a scope per function (and the program): what its parameters bind, and its own declarations by name (not those of a
  // nested function); a name declared twice in one scope resolves to all its values
  const scopes = new Map();
  const scopeOf = (n) => { if (!scopes.has(n)) scopes.set(n, { params: new Set(), decls: new Map(), imports: new Map() }); return scopes.get(n); };
  const decl = (sc, name, init) => { if (!sc.decls.has(name)) sc.decls.set(name, []); sc.decls.get(name).push(init); };
  (function link(n, parent, scope) {
    n.parent = parent;
    let here = scope;
    if (n.type === 'Program' || FN.test(n.type)) { here = scopeOf(n); if (n.params) n.params.forEach((q) => bound(q, here.params)); }
    if (n.type === 'VariableDeclarator' && n.init) { const names = bound(n.id, new Set()); if (n.id.type === 'Identifier') decl(scope, n.id.name, n.init); else names.forEach((nm) => scope.params.add(nm)); }
    if (n.type === 'FunctionDeclaration' && n.id) decl(scope, n.id.name, n);
    if (n.type === 'ImportDeclaration') n.specifiers.forEach((sp) => scope.imports.set(sp.local.name, sp.imported ? sp.imported.name : 'default'));
    if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && FN.test(n.right.type)) { /* Name.Part = function …: not a binding */ }
    for (const c of children(n)) link(c, n, here);
  })(ast.program, null, null);
  // what a name means where it is used: its values (a declaration), 'outside' (a parameter, an import, a global)
  function lookup(id) {
    for (let n = id.parent; n; n = n.parent) {
      if (!scopes.has(n)) continue;
      const sc = scopes.get(n);
      if (sc.decls.has(id.name)) return { values: sc.decls.get(id.name) };
      if (sc.params.has(id.name)) return { outside: 'param' };
      if (sc.imports.has(id.name)) return { outside: 'import', imported: sc.imports.get(id.name) };
    }
    return { outside: 'global' };
  }
  const where = (n) => rel + ':' + n.loc.start.line;
  const marked = (n) => { for (const l of [n.loc.start.line, n.loc.start.line - 1]) { const m = (lines[l - 1] || '').match(MARK); if (m) return m[1].trim().split(/\s+/); } return null; };
  // the expressions an expression can stand for, through constants and literal lookups (STATES[key][1], ICONS.table);
  // null when it cannot be read
  const keyName = (m) => (!m.computed ? m.property.name : m.property.type === 'StringLiteral' ? m.property.value : m.property.type === 'NumericLiteral' ? m.property.value : undefined);
  function pick(t, key) {
    if (t.type === 'ObjectExpression') { const ps = t.properties.filter((p) => p.type === 'ObjectProperty'); return key === undefined ? ps.map((p) => p.value) : ps.filter((p) => keyOf(p) === String(key)).map((p) => p.value); }
    if (t.type === 'ArrayExpression') { const es = t.elements.filter(Boolean); return key === undefined ? es : typeof key === 'number' && t.elements[key] ? [t.elements[key]] : []; }
    return null;
  }
  function tables(e, depth) {
    if (depth > 20) return null;
    if (e.type === 'Identifier') { const r = lookup(e); return r.values ? r.values.flatMap((v) => tables(v, depth + 1) || []) : null; }
    if (e.type === 'MemberExpression') { const objs = tables(e.object, depth + 1); if (!objs) return null; const out = []; for (const o of objs) { const got = pick(o, keyName(e)); if (got) for (const g of got) out.push(...(tables(g, depth + 1) || [g])); } return out; }
    if (e.type === 'ConditionalExpression') return [...(tables(e.consequent, depth + 1) || []), ...(tables(e.alternate, depth + 1) || [])];
    if (e.type === 'LogicalExpression') return [...(tables(e.left, depth + 1) || []), ...(tables(e.right, depth + 1) || [])];   // (SUB_TONES[k] || [])[1]
    return [e];
  }
  const seen = new Set();
  // the names a value can take; an expression that cannot be read is reported
  function value(v, at, depth = 0) {
    if (!v || depth > 30) return;
    switch (v.type) {
      // TypeScript's wrappers around a value change its type, not its value: 'folder' as const, x!, <T>x, x satisfies T (issue 682)
      case 'TSAsExpression': case 'TSSatisfiesExpression': case 'TSNonNullExpression': case 'TSTypeAssertion': case 'TSInstantiationExpression': value(v.expression, at, depth + 1); return;
      case 'StringLiteral': report.name(v.value, where(at), v, rel); return;
      case 'TemplateLiteral': if (!v.expressions.length) { report.name(v.quasis[0].value.cooked, where(at), v, rel); return; } break;
      case 'ConditionalExpression': value(v.consequent, at, depth + 1); value(v.alternate, at, depth + 1); return;
      case 'LogicalExpression': if (v.operator !== '&&') value(v.left, at, depth + 1); value(v.right, at, depth + 1); return;
      case 'BinaryExpression': if (v.operator !== '+') return; break;   // a comparison is a flag, not a name
      case 'Identifier': {
        if (v.name === 'undefined') return;
        const r = lookup(v);
        if (r.values) { if (seen.has(v)) return; seen.add(v); r.values.forEach((init) => value(init, at, depth + 1)); return; }
        return;   // a parameter, a prop, an import: the caller's icon (an imported table is scanned where it is declared)
      }
      case 'MemberExpression': {
        const root = (function base(e) { return e.type === 'MemberExpression' ? base(e.object) : e; })(v);
        if (root.type === 'Identifier' && lookup(root).values) { const got = tables(v, 0); if (got) { got.forEach((g) => value(g, at, depth + 1)); return; } break; }
        if (/^(LogicalExpression|ConditionalExpression)$/.test(root.type)) { const got = tables(v, 0); if (got && got.length) { got.forEach((g) => value(g, at, depth + 1)); return; } break; }   // (TABLE[k] || [])[1]
        if (root.type === 'Identifier' && lookup(root).outside === 'import' && /icons?$/i.test(root.name)) return;   // a *Icons table of another file, scanned there
        if (!v.computed) return;   // item.icon: the item's own field (collected where it is written)
        if (v.property.type === 'NumericLiteral' && root.type === 'Identifier' && lookup(root).outside === 'param') return;   // m[3]: a tuple's own field, the same
        break;
      }
      case 'CallExpression': {
        const c = v.callee;
        if (c.type === 'MemberExpression' && /^(React\.)?(cloneElement|createElement)$/.test(exprName(c))) return;   // an element, not a name
        if (c.type === 'Identifier') {
          const r = lookup(c);
          if (r.values) { for (const f of r.values) if (FN.test(f.type)) returns(f).forEach((x) => value(x, at, depth + 1)); return; }
          if (r.imported === 'asIcon') { value(v.arguments[0], at, depth + 1); return; }   // Icon's asIcon: its value is its argument
          if (/icons?$/i.test(c.name)) return;   // an imported *Icon function: its returns are scanned where it is declared
        }
        break;
      }
      case 'ObjectExpression': case 'ArrayExpression': table(v, at); return;
      case 'NullLiteral': case 'BooleanLiteral': case 'NumericLiteral': case 'JSXElement': case 'JSXFragment':
      case 'ArrowFunctionExpression': case 'FunctionExpression': case 'UnaryExpression': case 'AssignmentPattern': return;
      default: break;
    }
    const listed = marked(at);
    if (listed) { listed.forEach((nm) => report.name(nm, where(at))); return; }
    report.unresolved(where(at) + ' (' + v.type + ')');
  }
  // what a function can return (its return statements, not those of nested functions; an arrow's expression body)
  function returns(f) {
    if (f.body && f.body.type !== 'BlockStatement') return [f.body];
    const out = [];
    (function walk(n) { if (n !== f && FN.test(n.type)) return; if (n.type === 'ReturnStatement' && n.argument) out.push(n.argument); children(n).forEach(walk); })(f);
    return out;
  }
  // every value of a constant table (an object's values, an array's items)
  function table(t, at) {
    if (t.type === 'ObjectExpression') { for (const p of t.properties) if (p.type === 'ObjectProperty') value(p.value, p); return; }
    if (t.type === 'ArrayExpression') { for (const e of t.elements) if (e) value(e, e); return; }
    value(t, at);
  }
  (function visit(n) {
    const parent = n.parent;
    if (n.type === 'JSXAttribute' && n.name.type === 'JSXIdentifier') {
      const k = n.name.name, el = jsxName(parent && parent.name);
      if (SLOT.test(k) || (k === 'name' && ICON_ELEMENT.test(el))) {
        const v = !n.value ? null : n.value.type === 'JSXExpressionContainer' ? n.value.expression : n.value;
        if (v && v.type !== 'JSXEmptyExpression') value(v, n);
      }
    }
    if (n.type === 'ObjectProperty' && parent.type === 'ObjectExpression' && SLOT.test(keyOf(n) || '')) value(n.value, n);
    if (n.type === 'ObjectProperty' && parent.type === 'ObjectPattern' && SLOT.test(keyOf(n) || '') && n.value.type === 'AssignmentPattern') value(n.value.right, n);
    if (n.type === 'CallExpression' && ICON_ELEMENT.test(exprName(n.arguments[0])) && n.arguments[1] && n.arguments[1].type === 'ObjectExpression')
      for (const p of n.arguments[1].properties) if (p.type === 'ObjectProperty' && keyOf(p) === 'name') value(p.value, p);
    if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && /icons?$/i.test(n.id.name) && n.init) {
      if (n.init.type === 'ObjectExpression' || n.init.type === 'ArrayExpression') table(n.init, n);
      else if (FN.test(n.init.type) && opts.fnReturns !== false) returns(n.init).forEach((x) => value(x, x));
    }
    if (n.type === 'FunctionDeclaration' && n.id && /icons?$/i.test(n.id.name) && opts.fnReturns !== false) returns(n).forEach((x) => value(x, x));
    if (n.type === 'AssignmentPattern' && n.left.type === 'Identifier' && SLOT.test(n.left.name) && parent.type !== 'ObjectProperty') value(n.right, n);
    for (const c of children(n)) visit(c);
  })(ast.program);
}

function files(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|dist|vendor|design-system|icons)$/.test(e.name)) files(p, out); } else if (/\.[jt]sx?$/.test(e.name) && !/\.d\.ts$/.test(e.name)) out.push(p);
  }
  return out;
}

// names: the known Plenix names (glyphs.js NAMES: name -> [symbol, …]); a string in an icon slot that is not one is listed
// in unknown (a Material name, a typo)
function scan(root, folders, { names, withIcon = false }) {
  const found = new Map(), unresolved = [], unknown = [], literals = new Map();
  const report = {
    // node: the string written in the source (absent for a name listed in a plx-icons comment), for a tool that rewrites it
    name(nm, at, node, file) {
      if (!names[nm]) { unknown.push(at + ' ' + JSON.stringify(nm)); return; }
      if (!found.has(nm)) found.set(nm, new Set()); found.get(nm).add(at);
      if (node) { const k = file + ':' + node.start; if (!literals.has(k)) literals.set(k, { file, start: node.start, end: node.end, name: nm, jsx: !!(node.parent && node.parent.type === 'JSXAttribute'), param: !!(node.parent && node.parent.type === 'AssignmentPattern'), line: node.loc.start.line }); }
    },
    unresolved(at) { unresolved.push(at); },
  };
  for (const folder of folders) for (const f of files(path.join(root, folder))) if (!/[\\/]components[\\/]Icon[\\/]/.test(f)) scanFile(f, path.relative(root, f).split(path.sep).join('/'), report);
  // the Icon component itself: its icon slots and tables (StatusIcon's tone icons), not the returns of its resolver
  // functions (resolveIcon, asIcon, stateIcon: they pass on what they are given)
  if (withIcon && folders.includes('platform/components')) { const f = path.join(root, 'platform', 'components', 'Icon', 'Icon.tsx'); if (fs.existsSync(f)) scanFile(f, 'platform/components/Icon/Icon.tsx', report, { fnReturns: false }); }
  return { found, unresolved, unknown, literals: [...literals.values()] };
}

// the Platform's own source: platform/components, patterns, hooks, providers, templates, charts and utils (.js, .jsx, .ts and .tsx) (the Icon component itself excluded: it
// draws what it is given)
const PLATFORM = ['platform/components', 'platform/patterns', 'platform/hooks', 'platform/providers', 'platform/templates', 'platform/charts', 'platform/utils'];

module.exports = { scan, scanText, PLATFORM };
