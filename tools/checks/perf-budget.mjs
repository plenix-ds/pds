// Performance budgets for the built CDN files (#1188). Read-only.
//   node tools/checks/perf-budget.mjs [--dir release/cdn/<version>]   (default: release/cdn/<package.json version>)
// Fails (PERF_BUDGET_FAIL, exit 1) when:
//   - one CSS scope that reaches elements other than :root declares more custom properties than scopeTokens.limit. Every
//     element such a selector matches recomputes them for its whole subtree, so a big scope on [data-plx-density] makes
//     style recalculation slow on every grid (#1188);
//   - plenix.js compressed with brotli quality 5 (what the web host sends) is over jsBrotli.limit.
// It prints, never limits: the size of plenix.css raw, gzip and brotli (owner, plenix-platform#460), and the total count
// of custom-property declarations. Limits live in tools/checks/perf-budget.json.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// A selector reaches only the root element when it starts with :root or html (":root[data-plx-mode=dark]" too).
export function reachesElements(selector) {
  return selector.split(',').map((s) => s.trim()).some((s) => s && !/^(:root|html)(?![\w-])/.test(s));
}

// Custom-property declarations per scope: the selector, plus the at-rules around it (a media or layer copy is the same
// scope, so it adds up). Returns { total, scopes: [{ scope, selector, count }] } sorted by count, largest first.
export function scopeTokens(css) {
  const postcss = require('postcss');
  const by = new Map();
  let total = 0;
  postcss.parse(css).walkRules((rule) => {
    let n = 0;
    rule.each((d) => { if (d.type === 'decl' && d.prop.startsWith('--')) n++; });
    if (!n) return;
    total += n;
    const selector = rule.selector.replace(/\s+/g, ' ').trim();
    const ctx = [];
    for (let p = rule.parent; p && p.type === 'atrule'; p = p.parent) ctx.unshift('@' + p.name + ' ' + p.params);
    const scope = (ctx.length ? ctx.join(' ') + ' ' : '') + selector;
    const e = by.get(scope) || { scope, selector, count: 0 };
    e.count += n;
    by.set(scope, e);
  });
  return { total, scopes: [...by.values()].sort((a, b) => b.count - a.count) };
}

export function brotli5(buf) {
  return zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }).length;
}

export function check({ css, js, budget }) {
  const fails = [], notes = [];
  const { total, scopes } = scopeTokens(css);
  const top = scopes.find((s) => reachesElements(s.selector));
  const topCount = top ? top.count : 0;
  notes.push(`custom properties: ${total} declarations; largest scope reaching elements: ${topCount}` + (top ? ` (${top.scope.slice(0, 120)})` : ''));
  if (topCount > budget.scopeTokens.limit) fails.push(`one scope declares ${topCount} custom properties (limit ${budget.scopeTokens.limit}): ${top.scope.slice(0, 120)}`);
  else if (topCount < budget.scopeTokens.limit * 0.9) notes.push(`scope tokens ${topCount} are well under the limit ${budget.scopeTokens.limit}: lower it in tools/checks/perf-budget.json`);
  const jsBr = brotli5(js);
  notes.push(`${budget.jsBrotli.file}: ${js.length} B raw, ${jsBr} B brotli 5 (limit ${budget.jsBrotli.limit})`);
  if (jsBr > budget.jsBrotli.limit) fails.push(`${budget.jsBrotli.file} is ${jsBr} B with brotli 5 (limit ${budget.jsBrotli.limit})`);
  const cssBuf = Buffer.from(css);
  notes.push(`plenix.css: ${cssBuf.length} B raw, ${zlib.gzipSync(cssBuf, { level: 6 }).length} B gzip 6, ${brotli5(cssBuf)} B brotli 5 (printed, not limited: owner, plenix-platform#460)`);
  return { fails, notes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const i = process.argv.indexOf('--dir');
  const version = require(path.join(ROOT, 'package.json')).version;
  const dir = i > 0 ? path.resolve(process.argv[i + 1]) : path.join(ROOT, 'release', 'cdn', version);
  const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/checks/perf-budget.json'), 'utf8'));
  const read = (f) => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) { console.log(`PERF_BUDGET_FAIL: ${path.relative(ROOT, p)} is missing: run node build-app.js, then node build-packages.js`); process.exit(1); }
    return fs.readFileSync(p);
  };
  const { fails, notes } = check({ css: read('plenix.css').toString('utf8'), js: read(budget.jsBrotli.file), budget });
  notes.forEach((n) => console.log('  ' + n));
  if (fails.length) { fails.forEach((f) => console.log('PERF_BUDGET_FAIL: ' + f)); process.exit(1); }
  console.log('PERF_BUDGET_OK');
}
