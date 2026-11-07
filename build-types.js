// Builds the TypeScript definitions of @plenix-ds/react (release/packages/react/index.d.ts). An export whose source is TypeScript is
// re-exported from tsc's own declarations in types/ (#61, docs/adr/0011 wave 5a); every other export is typed from its source file's structured header
// comments (Summary / Usage / Props) and the defaults in their code: the same reading the design system's API tables use.
//   Prop types: a chain of quoted choices at the prop's own level ("md" (default) | "sm", "h1"–"h4") becomes a union (an
//   open chain ending "| …" also takes any string); choices inside a shape ([{ kind: "a" | "b" }]) are a field's, so a
//   prop written as an array or object shape is typed as one ("[{ … }] or (record) => that list" also takes that function); true/false a boolean, a number default a number, on… a
//   handler, children/label/title/icon/… a React node; anything the header does not pin down stays `any`.
//   A component with "...rest" also takes the attributes of its element.
// Called by build-packages.js; can run alone: node build-types.js
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const P = path.join(ROOT, 'platform');

// the structured header comment: { summary, props: [[name, text]] } (spec-catalog.js structured(), batch 162)
function structured(c) {
  const out = { summary: '', props: [] }; let cur = null, seen = false;
  const add = (t, indent) => {
    if (!t.trim()) return;
    if (cur === 'summary') out.summary += (out.summary ? ' ' : '') + t.trim();
    else if (cur === 'props') {
      const m = indent <= 5 && /^(\S+?(?:\([^)]*\))?):\s(.*)$/.exec(t.trim());
      if (m) out.props.push([m[1], m[2]]); else if (out.props.length) out.props[out.props.length - 1][1] += ' ' + t.trim();
    }
  };
  c.split('\n').forEach((l) => {
    const s = /^\s{3}(Summary|Usage|Props|Behavior|Notes):\s?(.*)$/.exec(l);
    if (s) { cur = s[1].toLowerCase(); seen = true; if (s[2]) add(s[2], 5); return; }
    if (cur) add(l.replace(/^\s{5}/, ''), (/^\s*/.exec(l) || [''])[0].length);
  });
  return seen ? out : null;
}
// the defaults a component's function gives its props: { name: 'value as written' } (spec-catalog.js defaultsOf()); a TypeScript
// component's props type after the braces ({ … }: ButtonProps) is read past
function defaultsOf(jsx, name) {
  const re = new RegExp('export\\s+(?:const\\s+' + name + '\\s*=\\s*(?:React\\.forwardRef\\()?function\\s*\\w*|function\\s+' + name + ')\\s*\\(\\{([\\s\\S]*?)\\}\\s*(?::\\s*[\\w$.<>\\[\\]|&, ]+?)?\\s*[,)]');
  const m = re.exec(jsx || ''); if (!m) return {};
  const out = {}; let depth = 0, cur = '', q = null;
  for (const ch of m[1] + ',') {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; cur += ch; continue; }
    if ('([{'.includes(ch)) depth++; if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { const d = /^\s*(\w+)\s*=\s*([\s\S]+?)\s*$/.exec(cur); if (d) out[d[1]] = d[2]; cur = ''; continue; }
    cur += ch;
  }
  return out;
}
const NODE = /^(children|label|title|description|icon|iconEnd|media|actions|footer|header|meta|prefix|suffix|start|end|empty|aside|topStart|bottomEnd|caption|eyebrow|help|error|hint|badge|avatar|trailing|leading|legend|message|trigger|tooltip|content|author|[a-z]\w*Label)$/;
// props whose type their name settles, when the header text does not give one of its own (#687): the same meaning in every
// part (an HTML attribute, Plenix's words, a ref)
const BY_NAME = { className: 'string', id: 'string', href: 'string', src: 'string', alt: 'string', name: 'string', placeholder: 'string', locale: 'string',
  target: 'string', lang: 'string', timeZone: 'string | null', ref: 'React.Ref<any>', as: 'React.ElementType', strings: '{ [key: string]: any }', shortcut: 'string',
  // the corners a group squares where a control meets its neighbor (ButtonGroup, InputGroup): the same shape on every control
  joined: '{ start?: "square" | "seam"; end?: "square" | "seam" }',
  // the one action under a Combobox's "No matches" (issue 811)
  emptyAction: '{ label: string; onSelect: (text: string) => void; icon?: string }',
  // EntityTitle's tag (issue 803): a Tag's text, an element, or a status Badge ({ label, tone, icon }) or a category Tag ({ label, category })
  entityTag: 'React.ReactNode | { label: React.ReactNode; tone?: string; icon?: string; category?: string }',
  // the DataGrid row template's slots, each a column's field (issue 839)
  rowTemplate: '{ title?: string; subtitle?: string; date?: string; primary?: string; secondary?: string; tertiary?: string }' };
const BOOLEAN = /^(disabled|readOnly|required|invalid|expanded|open|checked|pressed|selected|loading|hidden|multiple|defaultOpen|defaultChecked|block|tree|selectable|focusOnOpen|uniformPillWidths)$/;
// the text outside bracketed shapes ([{ … }], { … }): quoted choices inside a shape belong to its fields, not to the prop
function topLevel(t) {
  let out = '', depth = 0;
  let paren = 0;   // a parenthesis that is not a choice's own note ("(default "value")", "(span: "1" | "2")") is left out too
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if ('[{'.includes(ch)) { depth++; continue; }
    if (']}'.includes(ch)) { depth = Math.max(0, depth - 1); continue; }
    if (depth) continue;
    if (ch === '(' && (paren || !/"\s*$/.test(out))) { paren++; continue; }
    if (ch === ')' && paren) { paren--; continue; }
    if (!paren) out += ch;
  }
  return out;
}
// chains of quoted choices: "a" (default; a note) | "b" a description | "h1"–"h4" | …  ->  { opts, open }. A chain right
// after another name's label ("week: "bars" | "marks"") is that name's, not the prop's.
const ITEM = String.raw`"[^"]+"(?:\s*[–-]\s*"[^"]+")?(?:\s*\([^)]*\))?(?:\s+default\b)?[^|;"]*`;
const CHAIN = new RegExp(ITEM + String.raw`(?:\s*\|\s*` + ITEM + String.raw`)+(\s*\|\s*…)?`, 'g');
function choicesOf(t) {
  const opts = []; let open = false, found = false;
  for (const m of t.matchAll(CHAIN)) {
    if (found && /[A-Za-z]\w*:\s*$/.test(t.slice(0, m.index))) continue;
    found = true; open = open || !!m[1];
    const chain = m[0].replace(/\([^)]*\)/g, '');   // a choice's note may quote an example ("symbol" (default; "$"))
    for (const q of chain.matchAll(/"([^"]+)"(?:\s*[–-]\s*"([^"]+)")?/g)) {
      const a = q[2] && /^(\D*)(\d+)$/.exec(q[1]), b = q[2] && /^(\D*)(\d+)$/.exec(q[2]);
      if (a && b && a[1] === b[1]) for (let i = +a[2]; i <= +b[2]; i++) opts.push(a[1] + i);
      else opts.push(q[1], ...(q[2] ? [q[2]] : []));
    }
  }
  return found ? { opts: [...new Set(opts)], open } : null;
}
const AS = '@@as@@';   // marks a type taken from another part's prop ("as Input.size"), resolved when the file is written
function typeOf(name, text, def, called) {
  if (/^on[A-Z]/.test(name)) return '(...args: any[]) => void';
  // a prop documented as a call ("validate(value): …", "format(n)") is a function (#687)
  if (called && !NODE.test(name)) return '(...args: any[]) => any';
  // a part's words for other languages, written as their object shape ({ online: "Online", … }): an object of words
  if (name === 'strings') return BY_NAME.strings;
  // "as Input.size": the same type as that part's prop, filled in once every part is read (see AS below)
  const same = /^as (\w+)\.(\w+)\b/.exec(text.trim());
  if (same) return AS + same[1] + '.' + same[2] + AS;
  if (name === 'joined' || name === 'emptyAction') return BY_NAME[name];
  if (name === 'tag' && /\{ label, tone, icon, category \}/.test(text)) return BY_NAME.entityTag;
  if (name === 'template' && /^\{\s*title,\s*subtitle/.test(text.trim())) return BY_NAME.rowTemplate;
  // the text starts with what it is (a pinned header): "a string: …", "a ref to …"
  // a key that may also be null ("a string, a number or null: …"; DataGrid's openKey, RedSave P-63)
  if (/^(a )?(string, a number or null|number, a string or null)\b/i.test(text.trim())) return 'number | string | null';
  if (/^(a )?(string or a number|number or a string)\b/i.test(text.trim())) return 'number | string';
  if (/^true or a number\b/i.test(text.trim())) return 'boolean | number';
  if (/^(a )?string or null\b/i.test(text.trim())) return 'string | null';
  if (/^(a |the )?string\b/i.test(text.trim())) return 'string';
  if (/^a ref\b/i.test(text.trim())) return 'React.Ref<any>';
  if (/^an (element|node)\b/i.test(text.trim())) return 'React.ReactNode';
  if (/^an array of strings\b/i.test(text.trim())) return 'string[]';
  if (/^an array\b/i.test(text.trim())) return 'any[]';
  // an array shape that a function can also give: "[{ label, onSelect(record) }] or (record) => that list" (rowMenu, #455)
  if (/^\s*\[/.test(text) && /\]\s+or\s+\([^)]*\)\s*=>/.test(text)) return 'any[] | ((...args: any[]) => any[])';
  if (/^\s*\[/.test(text)) return 'any[]';   // the prop is written as an array shape: [{ title, field, … }]
  if (/^\s*\{/.test(text)) return 'any';     // an object shape
  if (def && /^\[/.test(def)) return 'any[]';   // an array by its default: a chain in its description is a field's
  const head = text.split(/[;(:]/)[0];
  const chain = choicesOf(topLevel(text)) || choicesOf(text.replace(/\[[^\]]*\]|\{[^}]*\}/g, ''));
  if (chain && chain.opts.length > 1) return chain.opts.map((o) => JSON.stringify(o)).join(' | ') + (chain.open ? ' | (string & {})' : '')
    + (/\|\s*(a |any )?number\b/.test(topLevel(text)) ? ' | number' : '') + (/\btrue\b/.test(text) || def === 'true' || def === 'false' ? ' | boolean' : '') + (NODE.test(name) ? ' | React.ReactNode' : '');
  if (def === 'true' || def === 'false' || /^(true|false)\b/.test(text) || /;\s*default (true|false)\s*$/.test(text) || /\btrue\b.*\bfalse\b|\bfalse\b.*\btrue\b/.test(head)) return 'boolean';
  if (def && /^-?\d+(\.\d+)?$/.test(def)) return 'number';
  if (NODE.test(name)) return 'React.ReactNode';
  if (def && /^['"`]/.test(def)) return 'string';
  if (def && /^\[/.test(def)) return 'any[]';
  // the name settles it (#687): an attribute (className, id, href …), Plenix's words (strings), a ref, a state (disabled …)
  if (BY_NAME[name] || /ClassName$/.test(name)) return BY_NAME[name] || 'string';
  if (BOOLEAN.test(name)) return 'boolean';
  // the text says what it is: "the number …", "how many …", "a number or a string" (#687)
  if (/\ba number or a string\b|\ba string or a number\b/i.test(text)) return 'number | string';
  if (/^(the |a )?(number|count|how many|how much|amount)\b/i.test(text.trim()) && !/\bstring\b|\[|\{/.test(text)) return 'number';
  const shape = /:\s*([[{])/.exec(text);     // described, then shown: "the levels: [{ … }]", "the filter: { … }"
  if (shape) return shape[1] === '[' ? 'any[]' : 'any';
  return 'any';
}
// a component: a capitalized (not ALL-CAPS) export defined as a function (plain, arrow, forwardRef or memo) in a file that
// draws JSX; what it returns does not matter (a portal, null, a fragment)
function isComponentIn(src, name) {
  if (!/^[A-Z][a-z]/.test(name) || !/<[A-Za-z][\w.]*[\s/>]/.test(src)) return false;
  return new RegExp(String.raw`export\s+(?:function\s+` + name + String.raw`\s*\(|const\s+` + name
    + String.raw`\s*=\s*(?:React\.)?(?:(?:forwardRef|memo)\s*\(\s*)*(?:function\b|\([^)]*\)\s*=>|\w+\s*=>))`).test(src);
}
const doc = (t) => '  /** ' + t.replace(/\*\//g, '* /').replace(/\s+/g, ' ').trim() + ' */\n';

// tsc's declarations for every platform source into dir (allowJs gives the JavaScript files theirs too, so a TypeScript file's
// imports resolve). Import paths keep their .ts/.tsx/.jsx endings in the emitted files, which a consumer's TypeScript cannot
// resolve, so they become .js (TypeScript maps a .js path to its .d.ts). Returns dir, or null when tsc is not available.
function emitDeclarations(dir) {
  const { spawnSync } = require('child_process');
  fs.rmSync(dir, { recursive: true, force: true });
  const tsc = path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
  if (!fs.existsSync(tsc)) return null;
  const r = spawnSync(process.execPath, [tsc, '-p', path.join(ROOT, 'tsconfig.json'), '--noEmit', 'false', '--declaration', '--emitDeclarationOnly', '--outDir', dir], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0 && process.env.PLENIX_TYPES_STRICT) throw new Error('build-types: tsc reported errors:\n' + (r.stdout || '').split('\n').filter((l) => /error TS/.test(l)).slice(0, 20).join('\n'));
  const walk = (d) => { for (const n of fs.existsSync(d) ? fs.readdirSync(d) : []) { const f = path.join(d, n); if (fs.statSync(f).isDirectory()) walk(f); else if (n.endsWith('.d.ts')) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/(from\s+|import\()(['"])(\.{1,2}\/[^'"]+?)\.(?:tsx|ts|jsx|js)\2/g, '$1$2$3.js$2')); } };
  walk(dir);
  return dir;
}

module.exports = function buildTypes(outFile, version) {
  const index = fs.readFileSync(path.join(P, 'index.ts'), 'utf8');
  // the TypeScript sources' own declarations (#61, docs/adr/0011 addendum wave 5a): tsc writes them into types/ beside the
  // index, and index.d.ts re-exports every name whose source is .ts/.tsx from there; the JavaScript sources keep the header reading
  const typesDir = emitDeclarations(path.join(path.dirname(outFile), 'types'));
  const blocks = [], names = [], typed = {}, typeFiles = new Set();
  const published = [...index.matchAll(/export \{([^}]+)\}/g)].map((x) => x[1]).join(',');
  for (const m of index.matchAll(/export \{([^}]+)\} from '([^']+)'/g)) {
    const file = path.join(P, m[2]);
    const src = fs.readFileSync(file, 'utf8');
    const hc = (/^\s*\/\*([\s\S]*?)\*\//.exec(src) || [])[1] || '';
    const head = structured(hc);
    const dts = typesDir && /\.tsx?$/.test(m[2]) ? path.join(typesDir, m[2].replace(/^\.\//, '').replace(/\.tsx?$/, '.d.ts')) : null;
    if (dts && fs.existsSync(dts)) {
      const rel = './types/' + m[2].replace(/^\.\//, '').replace(/\.tsx?$/, '.js');
      const specs = m[1].split(',').map((x) => x.trim()).filter(Boolean);
      specs.forEach((sp) => { const as = /^(\w+)\s+as\s+(\w+)$/.exec(sp); names.push(as ? as[2] : sp); });
      blocks.push('export { ' + specs.join(', ') + ' } from ' + JSON.stringify(rel) + ';');
      // every type the source exports (its props, items, values), once per file: `export type *` re-exports types only, so the
      // runtime names stay exactly the ones index.js publishes
      if (!typeFiles.has(rel)) { typeFiles.add(rel); blocks.push('export type * from ' + JSON.stringify(rel) + ';'); }
      continue;
    }
    for (const raw of m[1].split(',').map((x) => x.trim()).filter(Boolean)) {
      // an export renamed in index.js ("PLACEMENTS as FLOATING_PLACEMENTS") is published, and typed, under its public name
      const as = /^(\w+)\s+as\s+(\w+)$/.exec(raw);
      // the alias of a published component ("DataGrid as DataTable") has that component's type
      if (as && isComponentIn(src, as[1]) && new RegExp('(^|[\\s,])' + as[1] + '([\\s,]|$)').test(published)) { names.push(as[2]); blocks.push('export declare const ' + as[2] + ': typeof ' + as[1] + ';'); continue; }
      if (as) { names.push(as[2]); blocks.push(/^use[A-Z]|^[a-z]/.test(as[2]) ? 'export declare function ' + as[2] + '(...args: any[]): any;' : 'export declare const ' + as[2] + ': any;'); continue; }
      const name = raw; names.push(name);
      // a signature the header cannot give (a hook's result) is written beside the source as <name>.types.d.ts
      const adjacent = path.join(path.dirname(file), name + '.types.d.ts');
      if (fs.existsSync(adjacent)) { blocks.push(fs.readFileSync(adjacent, 'utf8').trim()); continue; }
      const isComponent = isComponentIn(src, name);
      // a set of parts ("export const Chat = { Header, Thread }"): each part a component
      const parts = /^[A-Z][a-z]/.test(name) && new RegExp(String.raw`export\s+const\s+` + name + String.raw`\s*=\s*\{([\w\s,:]+)\}`).exec(src);
      if (parts) {
        const keys = parts[1].split(',').map((x) => x.trim()).filter(Boolean).map((x) => x.split(':').map((y) => y.trim()));
        // each part defined in the file, or imported into it (Chat's media parts come from ChatMedia.jsx)
        if (keys.every(([k, v]) => new RegExp(String.raw`function\s+` + (v || k) + String.raw`\b|const\s+` + (v || k) + String.raw`\s*=|import\s*\{[^}]*\b` + (v || k) + String.raw`\b[^}]*\}\s*from`).test(src))) {
          // a part documented in the header ("Chat.Message.mine: …") gets its own Props interface, typed as a component's
          const partTypes = keys.map(([k]) => {
            const own = [], lines = [];
            if (head) head.props.forEach(([p, text]) => {
              const d = new RegExp('^' + name + '\\.' + k + '\\.([\\w$]+)(\\(|$)').exec(p);
              if (!d || own.includes(d[1])) return;
              own.push(d[1]);
              lines.push(doc(text) + '  ' + d[1] + '?: ' + typeOf(d[1], text, undefined, d[2] === '(') + ';');
            });
            if (!own.length) return '{ [prop: string]: any }';
            blocks.push('export interface ' + name + k + 'Props extends Omit<React.HTMLAttributes<HTMLElement>, ' + own.map((n) => JSON.stringify(n)).join(' | ') + '> {\n'
              + lines.join('\n') + '\n  [prop: string]: any;\n}');
            return name + k + 'Props';
          });
          blocks.push('export declare const ' + name + ': {\n' + keys.map(([k], i) => '  ' + k + ': React.ComponentType<' + partTypes[i] + '>;').join('\n') + '\n};');
          continue;
        }
      }
      if (!isComponent) {
        // hooks, helpers and data: typed loosely (their headers describe behavior, not a signature)
        blocks.push(/^use[A-Z]|^[a-z]/.test(name) ? 'export declare function ' + name + '(...args: any[]): any;' : 'export declare const ' + name + ': any;');
        continue;
      }
      const defs = defaultsOf(src, name);
      // plain header props belong to the file's main component: the first name of the header's title line ("Plenix ·
      // Panel, Card, MediaCard"), else the file's first exported component (a helper exported first, as Tabs'
      // tabsPanelId, is not it)
      const titled = (/Plenix\s*·\s*([A-Za-z_$][\w$]*)/.exec(hc) || [])[1];
      const firstComponent = [...src.matchAll(/export\s+(?:const|function)\s+([A-Z]\w*)/g)].map((x) => x[1]).find((x) => isComponentIn(src, x));
      const first = name === (titled && isComponentIn(src, titled) ? titled : firstComponent);
      // the header's props that are this export's: a plain name on the file's first component, "Name.prop" on the export
      // Name (StatusIcon.tone); a part's ("AppHeader.Item.href") or a field's ("items[].children") stay out (parts are
      // typed loosely below), and a name documented twice is typed once
      const props = [], seen = new Set();
      if (head) head.props.forEach(([p, text]) => {
        const k = p.replace(/\(.*$/, '');
        const dotted = /^(\w+)\.(\w+)$/.exec(k);
        const n = /^\.\.\./.test(k) ? (first ? '...' : '') : dotted ? (dotted[1] === name ? dotted[2] : '') : first && /^[\w$]+$/.test(k) ? k : '';
        if (n && !seen.has(n)) { seen.add(n); props.push([n, text, /\(/.test(p)]); }
      });
      let rest = false; const lines = [], own = [];
      props.forEach(([n, text, called]) => {
        if (n === '...') { rest = true; return; }
        const d = defs[n];
        own.push(n);
        const type = typeOf(n, text, d, called);
        typed[name + '.' + n] = type;
        lines.push(doc(text + (d ? ' Default: ' + d + '.' : '')) + '  ' + n + '?: ' + type + ';');
      });
      // a component whose function spreads the rest of its props (…, ...rest }) also takes its element's attributes
      const params = new RegExp(String.raw`export\s+(?:function\s+` + name + String.raw`|const\s+` + name + String.raw`\s*=[^{(]*\(?\s*(?:function\s*\w*)?)\s*\(\s*\{([\s\S]*?)\}\s*(?::\s*[\w$.<>\[\]|&, ]+?)?\s*[,)=]`).exec(src);
      if (params && /\.\.\.\s*\w+\s*$/.test(params[1])) rest = true;
      if (!props.length) rest = true;   // a part or an undocumented component: its element's attributes and anything else
      const summary = first && head ? head.summary : '';
      // the element's attributes, less those the component gives its own meaning (a title that is a node, not a string)
      const attrs = own.length ? 'Omit<React.HTMLAttributes<HTMLElement>, ' + own.map((n) => JSON.stringify(n)).join(' | ') + '>' : 'React.HTMLAttributes<HTMLElement>';
      blocks.push((summary ? '/** ' + summary.replace(/\*\//g, '* /') + ' */\n' : '') + 'export interface ' + name + 'Props' + (rest ? ' extends ' + attrs : '') + ' {\n'
        + (lines.length ? lines.join('\n') + '\n' : '') + '  [prop: string]: any;\n}\n'
        + 'export declare const ' + name + ': React.ComponentType<' + name + 'Props & React.RefAttributes<any>> & { [part: string]: any };');
    }
  }
  // every public name is a plain identifier, once (a form of export the reading above does not know would otherwise
  // write a definition TypeScript cannot parse)
  names.forEach((n, i) => { if (!/^[A-Za-z_$][\w$]*$/.test(n) || names.indexOf(n) !== i) throw new Error('build-types: cannot type the export "' + n + '" of platform/index.ts'); });
  const text = '/* @plenix-ds/react ' + version + ' · TypeScript definitions, generated by build-types.js from the components\' header comments (do not edit). */\n'
    + 'import * as React from \'react\';\n\n' + blocks.join('\n\n').replace(new RegExp(AS + '([\\w.]+?)' + AS, 'g'), (x, k) => (typed[k] && !typed[k].includes(AS) ? typed[k] : 'any')) + '\n';
  checkCoverage(index, text);
  fs.writeFileSync(outFile, text);
  return { exports: names.length, file: outFile };
};

// Parse the public API independently of the header generator: an unfamiliar export must fail, never disappear silently.
function checkCoverage(index, declarations) {
  const ast = require('@babel/standalone').transform(index, { ast: true, code: false, sourceType: 'module' }).ast;
  const names = [];
  for (const node of ast.program.body) {
    if (node.type === 'ExportAllDeclaration' || node.type === 'ExportDefaultDeclaration') throw new Error('build-types: unsupported public export; use named re-exports in platform/index.ts');
    if (node.type !== 'ExportNamedDeclaration') continue;
    if (node.declaration) {
      const declaration = node.declaration;
      if (declaration.id) names.push(declaration.id.name);
      else for (const item of declaration.declarations || []) {
        if (item.id.type !== 'Identifier') throw new Error('build-types: unsupported destructured public export');
        names.push(item.id.name);
      }
    }
    for (const item of node.specifiers) names.push(item.exported.name || item.exported.value);
  }
  const declared = new Set([...declarations.matchAll(/export declare (?:const|function|class) ([A-Za-z_$][\w$]*)/g)].map(match => match[1]));
  // and the names re-exported from the TypeScript sources' own declarations (export { A, B as C } from './types/…')
  for (const m of declarations.matchAll(/^export \{([^}]+)\} from (['"])[^'"]+\2;$/gm)) m[1].split(',').map((x) => x.trim()).filter(Boolean).forEach((sp) => declared.add((/\bas\s+(\w+)$/.exec(sp) || [, sp])[1]));
  const missing = names.filter(name => !declared.has(name));
  if (missing.length) throw new Error('build-types: missing declarations for ' + missing.join(', '));
  return names;
}
module.exports.checkCoverage = checkCoverage;

if (require.main === module) {
  const out = path.join(ROOT, 'release', 'packages', 'react', 'index.d.ts');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const r = module.exports(out, require('./package.json').version);
  console.log('Built ' + path.relative(ROOT, r.file) + ' (' + r.exports + ' exports)');
}
