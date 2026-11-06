// Locale checks (plan §7, P0-10; issue #192; G6). English and Arabic, from the catalogs and the components' JSX.
//   node tools/checks/locale/locale.mjs [baseRef] [--json]
// The six checks, each a rule name in the findings:
//   missing-ar     an English key (a plural counts once) has no Arabic entry
//   unapproved-ar  Arabic text in ar.js that the owner has not approved (approved-ar.json; D-0012, D-0075)
//   placeholder    the Arabic names a {placeholder} the English does not, or leaves one out (a plural's zero, one and
//                  two forms may leave out the count, {n} or {count}: Arabic writes the number as a word there)
//   plural-forms   an English plural whose Arabic lacks one of zero, one, two, few, many, other
//   jsx-literal    visible text written in a component's JSX (text children, or a string aria-label, title,
//                  placeholder, alt or label) instead of coming from the catalog
//   duplicate-key  a key written twice in one object of en.json, en.js or ar.js: only the later one is read (#720)
//   unused-key     an English key no Platform source reads (its section and its leaf name both appear in one file),
//                  or an Arabic key English does not have
// Diff-aware (plan §7 "Only new problems block"): with a base ref, the same checks run on the base (the catalogs and the
// changed files as they were there) and only findings the head adds fail. Old ones are counted and never block.
// A finding is "<rule> | <file> | <message>", without a line number, so moving code does not make it new.
// missing-ar is reported but never blocks a PR (a new word waits for the owner); G6 passes when the release has no
// missing-ar or unapproved-ar finding and this check reports no new problem.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '../../..');
export const EN_FILE = 'platform/i18n/en.json';
export const AR_FILE = 'platform/i18n/ar.js';
export const APPROVED_FILE = 'tools/checks/locale/approved-ar.json';
export const AR_FORMS = ['zero', 'one', 'two', 'few', 'many', 'other'];
const PLURAL_KEY = /^(zero|one|two|few|many|other|=\d+)$/;
const COUNT_NAMES = new Set(['n', 'count']);
const EXACT_FOR = { zero: '=0', one: '=1', two: '=2' };
const OPTIONAL_COUNT_FORMS = new Set(['zero', 'one', 'two', '=0', '=1', '=2']);
export const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const VISIBLE_ATTRS = new Set(['aria-label', 'aria-description', 'title', 'placeholder', 'alt', 'label']);
// components and patterns: the parts an app shows; tests, stories and fixtures may hold sample text
const JSX_DIRS = ['platform/components', 'platform/patterns'];
const JSX_FILE = /\.(jsx|tsx)$/;
const JSX_SKIP = /(\.test\.|\.stories\.|\.spec\.|\/fixtures?\/|\/__tests__\/|\/vendor\/|\/dist\/)/;
const SOURCE_FILE = /^platform\/.*\.(js|jsx|ts|tsx|mjs)$/;
const SOURCE_SKIP = /^platform\/(i18n|dist|vendor|design-system|mobile)\/|\.d\.ts$/;

// ---------- catalog helpers ----------

export const isPlural = (v) => !!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0
  && 'other' in v && Object.keys(v).every((k) => PLURAL_KEY.test(k)) && Object.values(v).every((x) => typeof x === 'string');

// { 'a.b': 'text' | {one, other} }: a plural stays one entry
export function entries(o, pre = '', out = {}) {
  for (const [k, v] of Object.entries(o || {})) {
    const n = pre ? pre + '.' + k : k;
    if (typeof v === 'string' || isPlural(v)) out[n] = v;
    else if (v && typeof v === 'object' && !Array.isArray(v)) entries(v, n, out);
  }
  return out;
}

export const placeholders = (s) => new Set([...String(s).matchAll(/\{([A-Za-z_][\w-]*)\}/g)].map((m) => m[1]));
const union = (sets) => sets.reduce((u, s) => { for (const x of s) u.add(x); return u; }, new Set());
const forms = (v) => (typeof v === 'string' ? { '': v } : v);

// ar.js and en.js are `export default { … };` with plain JSON data; read them as data, never run them
export function parseCatalogModule(text) {
  const body = String(text).replace(/^[\s\S]*?export default\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(body);
}

// a key written twice in one object (#720): JSON.parse and a JS object literal keep only the last one, silently, so the
// catalog's text is scanned: [{ path, line }] for every repeat. Strings are skipped, so a key inside a value never counts.
export function duplicateKeys(text) {
  const t = String(text), out = [];
  let i = t.search(/export default\s*\{/);
  i = i < 0 ? t.indexOf('{') : t.indexOf('{', i);
  if (i < 0) return out;
  const stack = [];      // { keys: Set, path: string[] } per open object
  let line = t.slice(0, i).split('\n').length, last = null;
  for (; i < t.length; i++) {
    const c = t[i];
    if (c === '\n') { line++; continue; }
    if (c === '{') { stack.push({ keys: new Set(), path: last && stack.length ? [...stack.at(-1).path, last] : [] }); last = null; continue; }
    if (c === '}') { stack.pop(); if (!stack.length) break; continue; }
    if (c === '"') {
      let j = i + 1, v = '';
      while (j < t.length && t[j] !== '"') { if (t[j] === '\\') { v += t[j + 1]; j += 2; } else { if (t[j] === '\n') line++; v += t[j++]; } }
      const at = line;
      i = j;
      let k = j + 1; while (k < t.length && /\s/.test(t[k])) k++;
      if (t[k] === ':' && stack.length) {
        const top = stack.at(-1);
        if (top.keys.has(v)) out.push({ path: [...top.path, v].join('.'), line: at });
        top.keys.add(v);
        last = v;
      }
    }
  }
  return out;
}

// approved-ar.json: { batches: [{ source, date, strings: { key: arabic | {form: arabic} } }] }; later batches win
export function approvedMap(record) {
  const out = {};
  for (const b of (record && record.batches) || []) Object.assign(out, entries(b.strings || {}));
  return out;
}

// ---------- checks 1 to 4 and the Arabic side of 6 ----------

export function checkCatalogs(en, ar, approved = {}) {
  const E = entries(en), A = entries(ar), out = [];
  const f = (rule, file, message) => out.push({ rule, file, message });
  for (const [k, ev] of Object.entries(E)) {
    const av = A[k];
    if (av === undefined) { f('missing-ar', AR_FILE, `${k}: no Arabic (English: ${JSON.stringify(ev).slice(0, 80)})`); continue; }
    // 4. plural forms
    if (isPlural(ev)) {
      if (typeof av === 'string') f('plural-forms', AR_FILE, `${k}: English is a plural; Arabic needs ${AR_FORMS.join(', ')}`);
      // an exact count wins over its category (LocaleProvider), so "=0" stands for zero, "=1" for one and "=2" for two
      else { const miss = AR_FORMS.filter((x) => !(x in av) && !(EXACT_FOR[x] && EXACT_FOR[x] in av)); if (miss.length) f('plural-forms', AR_FILE, `${k}: Arabic lacks ${miss.join(', ')}`); }
    }
    // 3. placeholders
    const enNames = union(Object.values(forms(ev)).map(placeholders));
    for (const [form, text] of Object.entries(forms(av))) {
      const names = placeholders(text), label = form ? `${k}.${form}` : k;
      for (const x of names) if (!enNames.has(x)) f('placeholder', AR_FILE, `${label}: {${x}} is not in the English`);
      for (const x of enNames) {
        if (names.has(x)) continue;
        if (isPlural(ev) && COUNT_NAMES.has(x) && OPTIONAL_COUNT_FORMS.has(form)) continue;
        f('placeholder', AR_FILE, `${label}: {${x}} from the English is missing`);
      }
    }
  }
  for (const [k, av] of Object.entries(A)) {
    // 6, the Arabic side: a key English does not have
    if (E[k] === undefined) f('unused-key', AR_FILE, `${k}: Arabic key with no English`);
    // 2. Arabic without the owner's approval: the text must equal the approved text for that key and form
    const ok = approved[k];
    for (const [form, text] of Object.entries(forms(av))) {
      if (!ARABIC.test(text)) continue;
      const want = ok === undefined ? undefined : typeof ok === 'string' ? (form ? undefined : ok) : ok[form];
      if (want !== text) f('unapproved-ar', AR_FILE, `${form ? k + '.' + form : k}: ${want === undefined ? 'no owner approval recorded' : 'differs from the approved text'} (${APPROVED_FILE})`);
    }
  }
  return out;
}

// ---------- check 5: literal JSX text ----------

let babel;
async function parser() { return (babel ||= (await import('@babel/parser')).default || (await import('@babel/parser'))); }

const hasWords = (s) => /[A-Za-z\u0600-\u06FF]{2,}/.test(s);
// product names stay as written in every language (docs/i18n/arabic.md: names and identifiers stay Latin)
const BRANDS = new Set(['Plenix']);
// a component's prop value that is one lowercase word ("none", "eager") is a setting, not text a person reads
const isSetting = (element, value) => /^[A-Z]/.test(element || '') && /^[a-z][a-z0-9-]*$/.test(value);
const jsxName = (n) => (n && n.type === 'JSXIdentifier' ? n.name : n && n.type === 'JSXMemberExpression' ? jsxName(n.object) + '.' + n.property.name : '');
function walkAst(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'leadingComments' || key === 'trailingComments') continue;
    const v = node[key];
    if (Array.isArray(v)) for (const c of v) { if (c && typeof c.type === 'string') walkAst(c, visit); }
    else if (v && typeof v.type === 'string') walkAst(v, visit);
  }
}

export async function checkJsx(text, file) {
  const { parse } = await parser();
  let ast;
  try {
    ast = parse(text, { sourceType: 'module', plugins: ['jsx', ...(file.endsWith('.tsx') ? ['typescript'] : [])], errorRecovery: true });
  } catch (e) {
    return [{ rule: 'jsx-literal', file, message: `could not parse: ${String(e.message).replace(/\s*\(\d+:\d+\)/, '')}`, line: 0 }];
  }
  const out = [];
  let element = '';
  walkAst(ast.program, (n) => {
    if (n.type === 'JSXOpeningElement') element = jsxName(n.name);
    if (n.type === 'JSXText') {
      const t = n.value.replace(/\s+/g, ' ').trim();
      if (hasWords(t) && !BRANDS.has(t)) out.push({ rule: 'jsx-literal', file, message: `text "${t.slice(0, 60)}"`, line: n.loc.start.line });
    } else if (n.type === 'JSXAttribute' && n.name && VISIBLE_ATTRS.has(n.name.name)) {
      const v = n.value && (n.value.type === 'StringLiteral' ? n.value
        : n.value.type === 'JSXExpressionContainer' && n.value.expression.type === 'StringLiteral' ? n.value.expression : null);
      if (v && hasWords(v.value) && !BRANDS.has(v.value) && !isSetting(element, v.value)) out.push({ rule: 'jsx-literal', file, message: `${n.name.name}="${v.value.slice(0, 60)}"`, line: n.loc.start.line });
    }
  });
  return out;
}

// ---------- the English side of check 6: unused keys ----------

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// a key is read when one source file names its section (as a string, or the start of a dotted key) and its leaf name
export function checkUnused(en, sources) {
  const E = entries(en), out = [];
  const names = Object.keys(sources), texts = Object.values(sources);
  // a part reads its strings in one file (useStrings('dataGrid')) and passes them to the files beside it: the section's
  // files are every source in the folder of a file that names the section
  const folder = (f) => f.split('/').slice(0, 3).join('/');
  const sectionFiles = new Map();
  const filesFor = (section) => {
    if (!sectionFiles.has(section)) {
      const re = new RegExp(`['"\`]${esc(section)}(?:['"\`]|\\.)`);
      const dirs = new Set(names.filter((f) => re.test(sources[f])).map(folder));
      sectionFiles.set(section, names.filter((f) => dirs.has(folder(f))).map((f) => sources[f]));
    }
    return sectionFiles.get(section);
  };
  const word = (w) => new RegExp(`(?<![\\w-])${esc(w)}(?![\\w-])`);
  // a group read by a computed name (S.colors[name], S.result?.[state]) uses all of its keys
  const indexed = (w) => new RegExp(`(?<![\\w-])${esc(w)}(?:\\?\\.)?\\[`);
  for (const k of Object.keys(E)) {
    const parts = k.split('.');
    if (texts.some((t) => t.includes(`'${k}'`) || t.includes(`"${k}"`) || t.includes('`' + k))) continue;
    const leafRe = word(parts.at(-1));
    // the section is the first part, or any longer prefix (useStrings('chart.barChart'))
    let used = false;
    for (let i = 1; i < parts.length && !used; i++) {
      const files = filesFor(parts.slice(0, i).join('.'));
      used = files.some((t) => leafRe.test(t)) || parts.slice(i, -1).some((g) => files.some((t) => indexed(g).test(t)));
    }
    if (!used) out.push({ rule: 'unused-key', file: EN_FILE, message: `${k}: no Platform source reads it` });
  }
  return out;
}

// ---------- reading a tree: the working tree, or a base ref (unchanged files are read from disk) ----------

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });
function treeReader(ref) {
  if (!ref) {
    const list = git(['ls-files', '--cached', '--others', '--exclude-standard']).split('\n').filter(Boolean).filter((f) => fs.existsSync(path.join(ROOT, f)));
    return { list, read: (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return null; } } };
  }
  const changed = new Set(git(['diff', '--name-only', '--no-renames', ref]).split('\n').filter(Boolean));
  const list = git(['ls-tree', '-r', '--name-only', ref]).split('\n').filter(Boolean);
  return {
    list, changed,
    read: (f) => {
      if (!changed.has(f)) { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { /* fall through */ } }
      try { return git(['show', `${ref}:${f}`]); } catch { return null; }
    },
  };
}

export async function runAll(ref, { jsxFiles } = {}) {
  const tree = treeReader(ref);
  const findings = [];
  const json = (f, parse) => { const t = tree.read(f); if (t == null) return {}; try { return parse(t); } catch (e) { findings.push({ rule: 'catalog', file: f, message: `not plain data: ${e.message}` }); return {}; } };
  const en = json(EN_FILE, JSON.parse), ar = json(AR_FILE, parseCatalogModule), approved = approvedMap(json(APPROVED_FILE, JSON.parse));
  // 7. a key written twice: the catalogs and en.js, the browser mirror that LocaleProvider loads
  for (const f of [EN_FILE, 'platform/i18n/en.js', AR_FILE]) {
    const t = tree.read(f);
    if (t != null) for (const d of duplicateKeys(t)) findings.push({ rule: 'duplicate-key', file: f, message: `${d.path}: written twice (the later one wins)`, line: d.line });
  }
  findings.push(...checkCatalogs(en, ar, approved));
  const sources = {};
  for (const f of tree.list) if (SOURCE_FILE.test(f) && !SOURCE_SKIP.test(f)) { const t = tree.read(f); if (t != null) sources[f] = t; }
  findings.push(...checkUnused(en, sources));
  const jsx = (jsxFiles || tree.list).filter((f) => JSX_FILE.test(f) && JSX_DIRS.some((d) => f.startsWith(d + '/')) && !JSX_SKIP.test(f));
  for (const f of jsx) { const t = tree.read(f); if (t != null) findings.push(...await checkJsx(t, f)); }
  return findings;
}

// ---------- compare head with base ----------

export const findingKey = (x) => `${x.rule} | ${x.file} | ${x.message}`;
// missing Arabic never fails a PR: a new English word waits for the owner's answer and shows in English until then
// (D-0012, "waiting never blocks other work"); it is reported, and G6 counts it at a release
export const NON_BLOCKING = new Set(['missing-ar']);
export function newFindings(base, head) {
  const left = new Map();
  for (const x of base) left.set(findingKey(x), (left.get(findingKey(x)) || 0) + 1);
  const added = [];
  for (const x of head) { const k = findingKey(x), n = left.get(k) || 0; if (n) left.set(k, n - 1); else if (!NON_BLOCKING.has(x.rule)) added.push(x); }
  return added;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), asJson = args.includes('--json'), base = args.find((a) => !a.startsWith('--'));
  const head = await runAll(null);
  const byRule = (list) => Object.entries(list.reduce((m, x) => ((m[x.rule] = (m[x.rule] || 0) + 1), m), {})).map(([r, n]) => `${r} ${n}`).join(', ') || 'none';
  let added = head;
  if (base) {
    // the base's JSX findings are only needed for the files the diff changed: the rest are the head's own
    const baseFindings = await runAll(base);
    added = newFindings(baseFindings, head);
  }
  if (asJson) { console.log(JSON.stringify({ head, new: added }, null, 1)); process.exit(base && added.length ? 1 : 0); }
  const where = (x) => (x.line ? `${x.file}:${x.line}` : x.file);
  for (const x of added.slice(0, 300)) {
    if (process.env.GITHUB_ACTIONS) console.log(`::error file=${x.file}${x.line ? `,line=${x.line}` : ''},title=locale: ${x.rule}::${x.message}`);
    else console.error(`locale: ${x.rule}: ${where(x)} ${x.message}`);
  }
  if (added.length > 300) console.error(`locale: … and ${added.length - 300} more`);
  const g6 = head.filter((x) => x.rule === 'missing-ar' || x.rule === 'unapproved-ar').length;
  console.log(`locale: ${head.length} findings (${byRule(head)})` + (base ? `; ${added.length} new (${byRule(added)})` : '')
    + `; G6 release state: ${g6 ? `FAIL (${g6} missing or unapproved Arabic)` : 'PASS'}`);
  process.exit(base ? (added.length ? 1 : 0) : head.length ? 1 : 0);
}
