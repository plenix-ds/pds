// Check 10 (plan §7): a numeric column has `tabular-nums`. Alignment is not checked: since D-0087 (#800, owner) grid
// content is start-aligned, numbers included, so `text-align:end` is no longer required (tabular-nums keeps digits lined up).
//   node tools/checks/numeric/numeric.mjs [file.css ...]   (default: every stylesheet under platform/)
// A rule is a numeric column when its selector names `numeric` as a class part (`--numeric`, `__numeric`) or the
// DataGrid's right-aligned cell (`--align-right`, which holds numbers; its text rule only). It must declare
// `font-variant-numeric` with tabular-nums. Physical left/right is check 4's job.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NUMERIC_SELECTOR = /\.[\w-]*(?:--|__|-)(?:numeric|align-right)(?![\w])/;

export function checkNumericCss(css, file) {
  const out = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, sel, body] = m;
    if (!NUMERIC_SELECTOR.test(sel)) continue;
    // an alignment class also has layout-only rules (justify-content); only its text rules are the numeric rule
    if (/--align-right/.test(sel) && !/text-align|font-variant-numeric/.test(body)) continue;
    const line = text.slice(0, m.index).split('\n').length + (sel.match(/^\s*\n/g) ? 1 : 0);
    const decl = body.replace(/\s+/g, '');
    const where = `${file}:${line} ${sel.trim().slice(0, 60)}`;
    if (!/font-variant-numeric:[^;]*tabular-nums/.test(decl)) out.push(`${where}: numeric column needs font-variant-numeric: tabular-nums`);
  }
  return out;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.css')) acc.push(p);
  }
  return acc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const files = process.argv.length > 2 ? process.argv.slice(2) : walk(path.join(root, 'platform'));
  const errors = files.flatMap((f) => checkNumericCss(fs.readFileSync(f, 'utf8'), path.relative(root, f)));
  for (const e of errors) console.error('numeric: ' + e);
  console.log(`numeric: ${files.length} stylesheets, ${errors.length} findings`);
  process.exit(errors.length ? 1 : 0);
}
