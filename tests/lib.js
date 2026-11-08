// Plenix tests · shared helpers: a static server for the repository (served at /Plenix/, as on the workspace server and
// the VM) and a headless Chrome. CHROME_PATH picks the browser; otherwise the usual Windows or Linux location.
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const limit = require('./limit.js');   // every test's hard time limit (TEST_TIMEOUT_MS)

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jsx': 'text/plain; charset=utf-8', '.ts': 'text/plain; charset=utf-8', '.tsx': 'text/plain; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };

// serves ROOT at /Plenix/ (directories answer with index.html); everything else is 404. Two more places (tests/site.js):
//   /Plenix/test-site/…   the St. John the Beloved test site, started on first use and passed on (its own server and database)
//   /cdn/local/…          this checkout's build of the CDN files (release/cdn/<version>/), the Plenix the site loads in tests
function serve(port) {
  let site = null;
  const toSite = (req, res) => {
    const site_ = require('./site.js');
    site = site || site_.start(port);
    site.then(({ origin }) => {
      const body = [];
      req.on('data', (d) => body.push(d));
      req.on('end', () => {
        const up = http.request(origin + req.url.slice('/Plenix/test-site'.length).replace(/^\/index\.html/, '/').replace(/^$/, '/'), { method: req.method, headers: Object.assign({}, req.headers, { host: new URL(origin).host }) }, (r) => {
          res.writeHead(r.statusCode, r.headers); r.pipe(res);
        });
        up.on('error', (e) => { res.writeHead(502); res.end('The test site did not answer: ' + e.message); });
        up.end(Buffer.concat(body));
      });
    }, (e) => { res.writeHead(502); res.end(e.message); });
  };
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel === '/Plenix/test-site' || rel.startsWith('/Plenix/test-site/')) { toSite(req, res); return; }
    if (rel.startsWith('/cdn/local/')) rel = '/Plenix/' + path.relative(ROOT, require('./site.js').CDN_LOCAL).split(path.sep).join('/') + '/' + rel.slice('/cdn/local/'.length);
    if (!rel.startsWith('/Plenix/')) { res.writeHead(404); res.end('Not found'); return; }
    let file = path.join(ROOT, rel.slice('/Plenix/'.length));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  // closing the test server stops its site too
  const close = server.close.bind(server);
  server.close = (...a) => { if (site) site.then((s) => s.stop(), () => {}); return close(...a); };
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const p of ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser']) if (fs.existsSync(p)) return p;
  throw new Error('No Chrome found: set CHROME_PATH');
}
// every test page asks for reduced motion, so a state is measured settled, never mid-fade (batch 236 added 80ms hover and
// color fades; a machine whose system already reduces motion passed while CI, without it, read the start of each fade)
// options.enableExtensions: folders of unpacked extensions to load (an extension fixture, #284); Chrome 137 and later ignores --load-extension
const launch = async (options = {}) => {
  // Chrome sometimes does not print its WebSocket address within the default 30 seconds on a busy CI runner (a flake, seen on 10-28 and 10-29): wait up to
  // 90 seconds, keep the shared-memory folder off /dev/shm (small on a runner), and try again twice
  let browser, last;
  for (let attempt = 0; attempt < 3 && !browser; attempt++) {
    try { browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, protocolTimeout: 180000, timeout: 90000, ...(options.enableExtensions ? { enableExtensions: options.enableExtensions } : {}), args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', ...(options.args || [])] }); }
    catch (e) { last = e; if (!/WS endpoint|Timed out/i.test(String(e && e.message))) throw e; console.log('Chrome did not start (attempt ' + (attempt + 1) + ' of 3): ' + String(e.message).split('\n')[0]); }
  }
  if (!browser) throw last;
  const newPage = browser.newPage.bind(browser);
  browser.newPage = async (...a) => { const p = await newPage(...a); await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); return loaderAware(p); };
  return browser;
};
// the page loader (platform/loader/loader.js, #842) adds the application's script only after the stylesheet has loaded, and
// hides the page until then: after page.goto or page.reload, a page that has the loader is awaited until it says it is ready
// (window.PlenixLoader.ready resolves once the application's script has run), so a test's own waits start from a running
// application, as before the loader. A page without the loader returns at once. It changes no test's checks, only the waiting.
const LOADER_TIMEOUT = 15000;
const loaderReady = async (page, url) => {
  let timer;
  const wait = page.evaluate(() => (window.PlenixLoader && window.PlenixLoader.ready ? window.PlenixLoader.ready.then(() => true) : false));
  const late = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('The page loader did not report ready within ' + LOADER_TIMEOUT / 1000 + ' seconds (window.PlenixLoader.ready): ' + url)), LOADER_TIMEOUT); });
  try { await Promise.race([wait, late]); }
  catch (e) {
    // the page navigated on during the wait (a test that moves on at once): nothing to wait for here
    if (/Execution context was destroyed|Cannot find context|Target closed|Session closed/i.test(String(e && e.message))) return;
    throw new Error(/did not report ready/.test(String(e && e.message)) ? e.message : 'The page loader failed on ' + url + ': ' + String(e && e.message).split('\n')[0]);
  } finally { clearTimeout(timer); }
};
function loaderAware(page) {
  const goto = page.goto.bind(page), reload = page.reload.bind(page);
  page.goto = async (url, ...rest) => { const res = await goto(url, ...rest); await loaderReady(page, url); return res; };
  page.reload = async (...rest) => { const res = await reload(...rest); await loaderReady(page, page.url()); return res; };
  return page;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// a page is ready when it has loaded, its fonts have loaded and its main region shows its content, then two frames for the
// last render (#382 F8: an observable condition, not a fixed wait); a page with no main region: its body's content
const ready = async (page, { timeout = 15000 } = {}) => {
  await page.waitForFunction(() => {
    const m = document.querySelector('main') || document.body;
    return document.readyState === 'complete' && document.fonts.status === 'loaded' && !!m && m.innerText.trim().length >= 20;
  }, { timeout, polling: 50 });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
};
const APPS = ['dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings', 'dam'];

// at(step): the step a timeout names
// check, wanted, record: the shared check helper (tests/check.js: parts with TEST_ONLY, results with TEST_RESULTS)
const { check, wanted, record } = require('./check.js');
module.exports = { ROOT, serve, launch, sleep, ready, APPS, at: limit.at, check, wanted, record };
