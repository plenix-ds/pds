/* Plenix perf harness · Chrome trace split (#1226, D-0160).
   Summary: records a Chrome performance trace of the three reference pages on one Plenix build and splits the main-thread time into Parse CSS, Recalculate Style (count, duration, elements touched), Layout, Paint and JavaScript, for three phases:
     load, hover (over rows; for the other pages over the page's main control), and sort (the DataGrid's Name column; the record and form pages click their button). It also tries Chrome's selector statistics.
   Usage:  node tests/perf/trace.mjs [--base <url>] [--dir <folder>] [--runs 3] [--mode light|dark] [--json <file>] [--keep <folder>] [--debug-categories]   (--keep writes the raw .json traces, openable in DevTools)
   Same page set and server as run.mjs (pages.mjs). Memory: one browser, one page at a time. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { PAGES, TARGETS, html } from './pages.mjs';
const require = createRequire(import.meta.url);
const { launch } = require('../lib.js');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const RUNS = +arg('runs', 3), MODE = arg('mode', 'light'), DIR = arg('dir', null), KEEP = arg('keep', null);
let BASE = arg('base', 'https://design-system.lighthouseway.org/cdn/1.6.1');
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const CATS = ['-*', 'devtools.timeline'];   // only this category: extra categories (blink, v8, blink.debug) slow the page while tracing and inflate every number about 1.8x (#1226)
const DEBUG_CATS = ['disabled-by-default-devtools.timeline', 'blink', 'v8', 'disabled-by-default-blink.debug'];   // --debug-categories adds these (selector statistics)

function serve() {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const u = new URL(req.url, 'http://x'), m = u.pathname.match(/^\/page\/(\w+)$/);
      if (m && PAGES.includes(m[1])) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html(m[1], BASE, MODE)); return; }
      if (DIR && u.pathname.startsWith('/cdn/local/')) {
        const f = path.join(path.resolve(DIR), path.normalize(u.pathname.slice('/cdn/local/'.length)));
        if (f.startsWith(path.resolve(DIR)) && fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); return; }
      }
      res.writeHead(404); res.end();
    }).listen(0, () => resolve(s));
  });
}

// the split: event names -> a bucket; durations in ms. JavaScript is counted once (top-level script events only, so a call inside a call is not added twice).
const BUCKETS = { css: ['ParseAuthorStyleSheet'], recalc: ['UpdateLayoutTree', 'RecalculateStyles'], layout: ['Layout'], paint: ['Paint', 'PrePaint', 'Layerize', 'Commit', 'CompositeLayers'], script: ['FunctionCall', 'EvaluateScript', 'v8.run', 'v8.compile', 'RunMicrotasks'] };
function split(events) {
  const names = new Set(events.filter((e) => e.name === 'thread_name' && e.args && e.args.name === 'CrRendererMain').map((e) => e.pid + ':' + e.tid)), count = new Map();   // the renderer main thread with the most timed events (a page's own tab)
  for (const e of events) { const k = e.pid + ':' + e.tid; if (e.ph === 'X' && names.has(k)) count.set(k, (count.get(k) || 0) + 1); }
  const top = [...count.entries()].sort((a, b) => b[1] - a[1])[0];
  const [pid, tid] = top ? top[0].split(':').map(Number) : [0, 0], mine = events.filter((e) => e.pid === pid && e.tid === tid && e.ph === 'X');
  const out = { cssMs: 0, recalcMs: 0, recalcCount: 0, recalcElements: 0, layoutMs: 0, paintMs: 0, scriptMs: 0, taskMs: 0, selectorStatsEvents: events.filter((e) => /SelectorStats/.test(e.name)).length };
  const key = { css: 'cssMs', recalc: 'recalcMs', layout: 'layoutMs', paint: 'paintMs', script: 'scriptMs' };
  mine.sort((a, b) => a.ts - b.ts || b.dur - a.dur); let scriptEnd = 0;
  for (const e of mine) {
    if (e.name === 'RunTask') out.taskMs += e.dur / 1000;   // only in the debug categories
    for (const [b, names] of Object.entries(BUCKETS)) if (names.includes(e.name)) {
      if (b === 'script') { if (e.ts < scriptEnd) continue; scriptEnd = e.ts + e.dur; }
      out[key[b]] += e.dur / 1000;
      if (b === 'recalc' && e.name === 'UpdateLayoutTree') { out.recalcCount++; out.recalcElements += (e.args && e.args.elementCount) || 0; }
    }
  }
  return out;
}

const server = await serve(), port = server.address().port; if (DIR) BASE = 'http://localhost:' + port + '/cdn/local';
const browser = await launch(), result = { base: BASE, mode: MODE, runs: RUNS, pages: {} };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function phase(p, name, tag, fn) {
  const file = KEEP ? path.join(KEEP, tag + '-' + name + '.json') : undefined; if (KEEP) fs.mkdirSync(KEEP, { recursive: true });
  await p.tracing.start({ categories: arg('debug-categories', false) ? CATS.concat(DEBUG_CATS) : CATS, path: file }); await fn(); await wait(600);
  const t = JSON.parse(Buffer.from(await p.tracing.stop()).toString()); return split(t.traceEvents || t);
}
try {
  for (const page of PAGES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const p = await browser.newPage(), tag = page + '-' + i, r = {};
      r.load = await phase(p, 'load', tag, async () => { await p.goto('http://localhost:' + port + '/page/' + page, { waitUntil: 'load', timeout: 90000 }); await p.waitForSelector(TARGETS[page].ready, { timeout: 30000 }); await wait(1500); });
      r.hover = await phase(p, 'hover', tag, async () => {
        const els = await p.$$(page === 'grid' ? '.plx-data-grid__grid-row' : TARGETS[page].click);
        for (const el of els.slice(2, 10)) { const b = await el.boundingBox(); if (b) { await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await wait(60); } }
      });
      r.sort = await phase(p, 'sort', tag, async () => {
        if (page === 'grid') { const h = await p.evaluateHandle(() => [...document.querySelectorAll('.plx-data-grid [role="columnheader"]')].find((e) => /Name/.test(e.textContent))); const el = h.asElement(); if (el) await el.click(); }
        else await (await p.$(TARGETS[page].click)).click();
      });
      await p.close(); runs.push(r);
    }
    result.pages[page] = {};
    for (const ph of ['load', 'hover', 'sort']) { const o = {}; for (const k of Object.keys(runs[0][ph] || {})) o[k] = median(runs.map((r) => r[ph] ? r[ph][k] : 0)); result.pages[page][ph] = o; }
  }
} finally { await browser.close(); server.close(); }
console.log('Plenix trace · ' + BASE + ' · ' + MODE + ' · median of ' + RUNS + ' · main thread, ms');
console.log('page   phase  task   css   recalc (n, elements)   layout  paint  script');
for (const [n, ph] of Object.entries(result.pages)) for (const [k, o] of Object.entries(ph)) console.log(n.padEnd(6), k.padEnd(6), o.taskMs.toFixed(0).padStart(5), o.cssMs.toFixed(1).padStart(6), o.recalcMs.toFixed(1).padStart(7), ('(' + o.recalcCount + ', ' + o.recalcElements + ')').padStart(14), o.layoutMs.toFixed(1).padStart(9), o.paintMs.toFixed(1).padStart(6), o.scriptMs.toFixed(1).padStart(7), o.selectorStatsEvents ? ' selector-stats:' + o.selectorStatsEvents : '');
const j = arg('json', null); if (j && j !== true) { fs.mkdirSync(path.dirname(j), { recursive: true }); fs.writeFileSync(j, JSON.stringify(result, null, 2) + '\n'); }
