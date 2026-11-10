// Performance budgets for the built CDN files (#1188). Read-only.
//   node tools/checks/perf-budget.mjs [--dir release/cdn/<version>]   (default: release/cdn/<package.json version>)
//   node tools/checks/perf-budget.mjs --traces <file>   checks a trace written by node tests/perf/run.mjs --json <file>
//                                                        against traces in perf-budget.json (#1213); reads no build
// Fails (PERF_BUDGET_FAIL, exit 1) when:
//   - one CSS scope that reaches elements other than :root declares more custom properties than scopeTokens.limit. Every
//     element such a selector matches recomputes them for its whole subtree, so a big scope on [data-plx-density] makes
//     style recalculation slow on every grid (#1188);
//   - the density scope (a selector listing [data-plx-density] or [data-plx-interaction] alone, which every DataGrid
//     matches) declares more than densityTokens.limit (#1205);
//   - plenix.js compressed with brotli quality 5 (what the web host sends) is over jsBrotli.limit;
//   - with --traces: a reference page's LCP or INP is over traces.lcpMs or traces.inpMs, or a page is missing (#1213);
//   - a shared layer chunk (core, grid, shell, forms, charts) is over its bundles.layers limit; what an entry esm/<Export>.js
//     adds on top of the layers (esm/manifest.json), brotli 5, is over its limit (D-0171); a screen's parts together are
//     over their bytes or files limit; plenix-loader.js is over bundles.loaderLimit; or esm/manifest.json is missing
//     (#1208, #1293).
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

// A selector that lists the bare density or interaction attribute: every DataGrid and density zone matches it.
export function isDensityScope(selector) {
  return selector.split(',').map((s) => s.trim()).some((s) => /^\[data-plx-(density|interaction)\]$/.test(s));
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
  if (budget.densityTokens) {
    const d = scopes.find((x) => isDensityScope(x.selector));
    const dCount = d ? d.count : 0;
    notes.push(`density scope: ${dCount} (limit ${budget.densityTokens.limit})` + (d ? ` (${d.scope.slice(0, 120)})` : ''));
    if (dCount > budget.densityTokens.limit) fails.push(`the density scope declares ${dCount} custom properties (limit ${budget.densityTokens.limit}): ${d.scope.slice(0, 120)}`);
    else if (dCount < budget.densityTokens.limit * 0.7) notes.push(`density tokens ${dCount} are well under the limit ${budget.densityTokens.limit}: lower it in tools/checks/perf-budget.json`);
  }
  const jsBr = brotli5(js);
  notes.push(`${budget.jsBrotli.file}: ${js.length} B raw, ${jsBr} B brotli 5 (limit ${budget.jsBrotli.limit})`);
  if (jsBr > budget.jsBrotli.limit) fails.push(`${budget.jsBrotli.file} is ${jsBr} B with brotli 5 (limit ${budget.jsBrotli.limit})`);
  const cssBuf = Buffer.from(css);
  notes.push(`plenix.css: ${cssBuf.length} B raw, ${zlib.gzipSync(cssBuf, { level: 6 }).length} B gzip 6, ${brotli5(cssBuf)} B brotli 5 (printed, not limited: owner, plenix-platform#460)`);
  return { fails, notes };
}

// Code per screen (ADR 0052, #1208, #1293). The shared chunks are layers (core, grid, shell, forms, charts) that a page
// loads once, each limited on its own (layers). sizes[name] is what an entry adds on top of the layers, brotli 5 (D-0171).
// screens[name] is { bytes, files } for a screen's parts together, layers included. Prints the largest additions: the
// on-demand candidates.
export function checkBundles({ sizes, layers, screens, loader }, bundles) {
  const fails = [], notes = [];
  for (const [name, limit] of Object.entries(bundles.layers || {})) {
    const size = layers[name];
    if (size === undefined) { fails.push(`layer ${name}: no chunks/${name}-*.js in esm/`); continue; }
    notes.push(`layer ${name}: ${size} B brotli 5 (limit ${limit})`);
    if (size > limit) fails.push(`layer ${name} is ${size} B with brotli 5 (limit ${limit})`);
  }
  for (const [name, size] of Object.entries(sizes)) {
    const limit = bundles.limits[name] ?? bundles.entryLimit;
    if (size > limit) fails.push(`esm/${name}.js adds ${size} B with brotli 5 to the layers (limit ${limit})`);
    else if (bundles.limits[name] !== undefined && size < Math.min(limit * 0.9, bundles.entryLimit)) notes.push(`esm/${name}.js adds ${size} B, under the default ${bundles.entryLimit}: drop its own limit`);
  }
  for (const name of Object.keys(bundles.limits)) if (!(name in sizes)) fails.push(`bundles.limits names ${name}, which is no entry`);
  for (const [name, s] of Object.entries(bundles.screens || {})) {
    const m = screens[name];
    if (m === undefined) { fails.push(`screen ${name}: a part is no entry (${s.parts.join(', ')})`); continue; }
    notes.push(`screen ${name} (${s.parts.length} parts): ${m.bytes} B brotli 5 (limit ${s.limit}), ${m.files} files` + (s.maxFiles ? ` (limit ${s.maxFiles})` : ''));
    if (m.bytes > s.limit) fails.push(`screen ${name} loads ${m.bytes} B with brotli 5 (limit ${s.limit})`);
    if (s.maxFiles && m.files > s.maxFiles) fails.push(`screen ${name} loads ${m.files} files (limit ${s.maxFiles})`);
  }
  if (loader > bundles.loaderLimit) fails.push(`plenix-loader.js is ${loader} B (limit ${bundles.loaderLimit})`);
  const top = Object.entries(sizes).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, b]) => `${n} ${b}`).join(', ');
  notes.push(`${Object.keys(sizes).length} entries; largest additions to the layers (on-demand candidates): ${top}; plenix-loader.js ${loader} B`);
  return { fails, notes };
}

// the sizes checkBundles reads, from a CDN folder; null when it has no esm/manifest.json. A screen's files are those its
// parts load (the chunk an entry re-exports from, else the entry, and their imports), as Plenix.load fetches them
export function measureBundles(dir, bundles) {
  const m = path.join(dir, 'esm', 'manifest.json');
  if (!fs.existsSync(m)) return null;
  const entries = JSON.parse(fs.readFileSync(m, 'utf8')).entries;
  const cache = new Map();
  const br = (f) => { if (!cache.has(f)) cache.set(f, brotli5(fs.readFileSync(path.join(dir, 'esm', f)))); return cache.get(f); };
  const layerOf = (f) => { const x = /^chunks\/([a-z]+)-[\w-]+\.js$/.exec(f); return x && bundles.layers && x[1] in bundles.layers ? x[1] : null; };
  const files = (n) => [...new Set([entries[n].chunk || entries[n].file, ...entries[n].imports])];
  const layers = {};
  for (const n of Object.keys(entries)) for (const f of files(n)) { const l = layerOf(f); if (l) layers[l] = br(f); }
  const sizes = {};
  for (const n of Object.keys(entries)) sizes[n] = files(n).filter((f) => !layerOf(f)).reduce((a, f) => a + br(f), 0);
  const screens = {};
  for (const [name, s] of Object.entries(bundles.screens || {})) {
    if (!s.parts.every((n) => entries[n])) continue;
    const all = [...new Set(s.parts.flatMap(files))];
    screens[name] = { bytes: all.reduce((a, f) => a + br(f), 0), files: all.length };
  }
  const lf = path.join(dir, 'plenix-loader.js');
  return { sizes, layers, screens, loader: fs.existsSync(lf) ? fs.statSync(lf).size : Infinity };
}

// Speed on the reference pages (owner rule 7, D-0160): the harness's JSON (tests/perf/run.mjs --json) against the
// traces budget. A page with no numbers fails: a trace that measured nothing never passes.
export function checkTraces(result, traces) {
  const fails = [], notes = [];
  for (const page of traces.pages) {
    const r = result && result.pages && result.pages[page];
    if (!r || !Number.isFinite(r.lcp) || !Number.isFinite(r.inp)) { fails.push(`${page}: no LCP or INP in the trace`); continue; }
    notes.push(`${page}: LCP ${Math.round(r.lcp)} ms (limit ${traces.lcpMs}), INP ${Math.round(r.inp)} ms (limit ${traces.inpMs})`);
    if (r.lcp > traces.lcpMs) fails.push(`${page}: LCP ${Math.round(r.lcp)} ms is over ${traces.lcpMs} ms`);
    if (r.inp > traces.inpMs) fails.push(`${page}: INP ${Math.round(r.inp)} ms is over ${traces.inpMs} ms`);
  }
  return { fails, notes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const t = process.argv.indexOf('--traces');
  if (t > 0) {
    const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/checks/perf-budget.json'), 'utf8'));
    const file = process.argv[t + 1];
    if (!file || !fs.existsSync(file)) { console.log(`PERF_BUDGET_FAIL: no trace file ${file || ''}: run node tests/perf/run.mjs --json <file>`); process.exit(1); }
    const { fails, notes } = checkTraces(JSON.parse(fs.readFileSync(file, 'utf8')), budget.traces);
    notes.forEach((n) => console.log('  ' + n));
    if (fails.length) { fails.forEach((f) => console.log('PERF_BUDGET_FAIL: ' + f)); process.exit(1); }
    console.log('PERF_BUDGET_OK (traces)');
    process.exit(0);
  }
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
  if (budget.bundles) {
    const measured = measureBundles(dir, budget.bundles);
    if (!measured) fails.push(`${path.relative(ROOT, path.join(dir, 'esm', 'manifest.json'))} is missing: the entries per export (ADR 0052) are built by node build-packages.js`);
    else { const b = checkBundles(measured, budget.bundles); fails.push(...b.fails); notes.push(...b.notes); }
  }
  notes.forEach((n) => console.log('  ' + n));
  if (fails.length) { fails.forEach((f) => console.log('PERF_BUDGET_FAIL: ' + f)); process.exit(1); }
  console.log('PERF_BUDGET_OK');
}
