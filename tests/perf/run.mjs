/* Plenix perf harness · headless trace runner (rule 7, D-0160, #1212).
   Summary: opens each reference page (DataGrid with 50 rows, record, form) in headless Chrome against one Plenix build and prints, per page, LCP (largest contentful paint), INP (the slowest event-to-paint of one click),
     style-recalc time, and a verdict against the budgets (LCP 2.5 s, INP 0.2 s). The numbers are the median of --runs loads. Exit code 1 only with --enforce and a budget missed.
   Usage:  node tests/perf/run.mjs [--base <url>] [--dir <folder>] [--runs 3] [--mode light|dark] [--json <file>] [--enforce]
     --base  a Plenix build folder URL, default https://design-system.lighthouseway.org/cdn/1.6.1 (the files load over the network: Plenix itself, nothing else)
     --dir   a local build folder (e.g. release/cdn/<version>) served at /cdn/local; replaces --base
   Memory: one browser, one page at a time (QA's memory_limit_gb). */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { PAGES, TARGETS, html } from './pages.mjs';
const require = createRequire(import.meta.url);
const { launch } = require('../lib.js');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const BUDGET = { lcp: 2500, inp: 200 }, RUNS = +arg('runs', 3), MODE = arg('mode', 'light'), DIR = arg('dir', null);
let BASE = arg('base', 'https://design-system.lighthouseway.org/cdn/1.6.1');
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
function serve() {   // pages at /page/<name>; with --dir, the build at /cdn/local/
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const u = new URL(req.url, 'http://x');
      const m = u.pathname.match(/^\/page\/(\w+)$/);
      if (m && PAGES.includes(m[1])) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html(m[1], BASE, MODE)); return; }
      if (DIR && u.pathname.startsWith('/cdn/local/')) {
        const f = path.join(path.resolve(DIR), path.normalize(u.pathname.slice('/cdn/local/'.length)));
        if (f.startsWith(path.resolve(DIR)) && fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); return; }
      }
      res.writeHead(404); res.end();
    }).listen(0, () => resolve(s));
  });
}

async function measure(browser, url, page) {
  const p = await browser.newPage(); const errors = []; p.on('pageerror', (e) => errors.push(e.message));
  await p.evaluateOnNewDocument(() => {   // LCP and event timing, recorded from the first byte
    window.__perf = { lcp: 0, inp: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__perf.inp = Math.max(window.__perf.inp, e.duration); }).observe({ type: 'event', durationThreshold: 16, buffered: true });
  });
  await p.goto(url, { waitUntil: 'load', timeout: 90000 });
  await p.waitForSelector(TARGETS[page].ready, { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));   // let paints settle
  const m0 = await p.metrics();
  const el = await p.$(TARGETS[page].click); await el.click(); await new Promise((r) => setTimeout(r, 800));
  const m1 = await p.metrics();
  const out = await p.evaluate(() => window.__perf);
  await p.close();
  if (errors.length) throw new Error(page + ': script errors: ' + errors.join(' | '));
  return { lcp: out.lcp, inp: out.inp, recalcMs: m1.RecalcStyleDuration * 1000, recalcCount: m1.RecalcStyleCount, clickRecalcMs: (m1.RecalcStyleDuration - m0.RecalcStyleDuration) * 1000 };
}

const server = await serve(); const port = server.address().port;
if (DIR) BASE = 'http://localhost:' + port + '/cdn/local';
const browser = await launch(); const result = { base: BASE, mode: MODE, runs: RUNS, budget: BUDGET, pages: {} }; let missed = false;
try {
  for (const page of PAGES) {
    const samples = []; for (let i = 0; i < RUNS; i++) samples.push(await measure(browser, 'http://localhost:' + port + '/page/' + page, page));
    const r = { lcp: median(samples.map((s) => s.lcp)), inp: median(samples.map((s) => s.inp)), recalcMs: median(samples.map((s) => s.recalcMs)), recalcCount: median(samples.map((s) => s.recalcCount)), clickRecalcMs: median(samples.map((s) => s.clickRecalcMs)) };
    r.pass = r.lcp <= BUDGET.lcp && r.inp <= BUDGET.inp; if (!r.pass) missed = true; result.pages[page] = r;
  }
} finally { await browser.close(); server.close(); }
console.log('Plenix perf · ' + BASE + ' · ' + MODE + ' · median of ' + RUNS + ' loads · budgets: LCP ' + BUDGET.lcp + ' ms, INP ' + BUDGET.inp + ' ms');
console.log('page    LCP ms  INP ms  recalc ms (count)  click recalc ms  verdict');
for (const [n, r] of Object.entries(result.pages)) console.log(n.padEnd(7), r.lcp.toFixed(0).padStart(6), r.inp.toFixed(0).padStart(7), r.recalcMs.toFixed(1).padStart(9), ('(' + r.recalcCount + ')').padStart(8), r.clickRecalcMs.toFixed(1).padStart(15), ' ', r.pass ? 'within budget' : 'OVER BUDGET');
const j = arg('json', null); if (j && j !== true) { fs.mkdirSync(path.dirname(j), { recursive: true }); fs.writeFileSync(j, JSON.stringify(result, null, 2) + '\n'); }
process.exit(arg('enforce', false) && missed ? 1 : 0);
