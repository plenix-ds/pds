// Plenix tests · reflow (WCAG 2.2 SC 1.4.10, AA; Platforms Standard 3.5): every app page and every page of the St. John
// the Beloved test site (test-site/), in a window 320 CSS px wide (1280px at 400% zoom), scroll in one direction only. Three findings:
//   page-scroll   the page itself scrolls sideways (the document is wider than the window)
//   scroller      an area inside the page scrolls sideways (overflow-x auto or scroll, and wider content)
//   cut-off       visible text or a control reaches past the window's edge where nothing scrolls to it (lost content)
// Content that needs two dimensions is exempt, as WCAG allows: data grids (the DataGrid and Table), the
// calendar's time grid, maps and diagrams (svg, canvas), images and the image editor's canvas, preformatted code (the
// CodeBlock), a carousel's strip (its Previous and Next buttons and page dots move it, so nothing is lost), and the design system's specimen stages. Each exempt sideways scroller is listed under "exempt" so it stays visible in the report.
// Known findings are kept in tests/baselines/reflow.json (page -> finding -> number of elements); the test fails only on a
// finding that is new on a page or affects more elements than recorded, so they can only go down.
//   node tests/reflow.test.js            compare
//   node tests/reflow.test.js --update   record the current findings as the baseline (after fixing some, to lower it; TEST_SCOPE=full only)
//   TEST_SCOPE=full node tests/reflow.test.js   every page (default: the pages of what changed, tests/changed.js)
//   REFLOW_PORT=8851 (or TEST_PORT) node tests/reflow.test.js   another port (several runs side by side)
const fs = require('fs');
const path = require('path');
const { serve, launch, sleep, at } = require('./lib.js');
const shared = require('./check.js');   // one result per page and kind in the results file (TEST_RESULTS), so CI can quarantine one (#1327)
const changed = require('./changed.js');
const PORT = +process.env.REFLOW_PORT || +process.env.TEST_PORT || 8841, BASE = 'http://127.0.0.1:' + PORT + '/Plenix/';
const BASELINE = path.join(__dirname, 'baselines', 'reflow.json');
const WIDTH = 320, HEIGHT = 640;
const APP_PAGES = changed.pages(['dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings'].map((a) => a + '/index.html')
  .concat(['dam/index.html', 'dam/settings-system.html', 'dam/settings-myaccount.html', 'dam/image-editor.html'])
  // the settings screens beyond each page's first (owner, 2026-10-13: every settings page is cards of rows; the settings-cards rule)
  .concat(['settings/index.html#/account', 'settings/index.html#/appearance', 'settings/index.html#/categories', 'settings/index.html#/docs/data-model',
    'dam/settings-system.html#/users', 'dam/settings-system.html#/permissions', 'dam/settings-myaccount.html#/preferences']));
const site = require('./site.js');
const SITE_PAGES = changed.pages(site.urls());
changed.noPartialUpdate();
// the controls that fold when their room is narrow (each the only check of its fix), when they changed or the regression
// itself did (#382 F1): the command bar's find side folds into "Find and view" (#274; the CommandBar is a pattern, #382
// F5), a SegmentedControl folds into a Select (#276)
{
  for (const [regression, unit] of [['commandbar-find-fold-274.test.js', 'patterns/CommandBar'], ['segmented-fold-276.test.js', 'components/SegmentedControl']]) {
    if (!changed.wants({ units: [unit] }) && !changed.child(regression)) continue;
    const result = require('child_process').spawnSync(process.execPath, [path.join(__dirname, regression)], { stdio: 'inherit', env: process.env });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
if (!APP_PAGES.length && !SITE_PAGES.length) changed.none('REFLOW_OK 0 known findings on 0 pages at 320px (0 exempt two-dimensional scrollers)');
// the two-dimensional content WCAG exempts (Understanding 1.4.10: data grids, maps, diagrams, images, editors' canvases),
// and preformatted code (the CodeBlock's pre: code keeps its lines, Understanding 1.4.10 "Content exceptions")
const EXEMPT = '.plx-data-grid, .plx-data-grid__grid, .plx-time-grid, .plx-image-editor__canvas, .plx-media-viewer, svg, canvas, img, video, .ds-sample-stage, .ds-wire__frame, .plx-code-block__pre, .plx-carousel__track';

// runs in the page: the findings at the current width
function measure(EXEMPT) {
  const W = document.documentElement.clientWidth;
  const name = (el) => { const c = typeof el.className === 'string' ? el.className.split(' ').filter((x) => /^(plx|ds)-/.test(x) && !/^plx-u-/.test(x)).slice(0, 2).join('.') : ''; return el.tagName.toLowerCase() + (c ? '.' + c : ''); };
  const shown = (el) => { const c = getComputedStyle(el); return c.display !== 'none' && c.visibility !== 'hidden' && c.opacity !== '0' && !el.closest('[hidden], [aria-hidden="true"], .plx-visually-hidden, .plx-u-visually-hidden'); };
  const out = { 'page-scroll': [], scroller: [], 'cut-off': [], exempt: [] };
  const sc = document.scrollingElement || document.documentElement;
  if (sc.scrollWidth > sc.clientWidth + 1) out['page-scroll'].push('document ' + sc.scrollWidth + 'px wide');
  const sideways = [];
  for (const el of document.querySelectorAll('body *')) {
    const c = getComputedStyle(el);
    if (!/auto|scroll/.test(c.overflowX) || el.scrollWidth <= el.clientWidth + 1 || el.clientWidth === 0 || !shown(el)) continue;
    sideways.push(el);
    // exempt: the scroller is inside two-dimensional content, or such content is what makes it wide
    const wide = (x) => x.getBoundingClientRect().width > el.clientWidth + 1 || x.scrollWidth > el.clientWidth + 1;
    (el.closest(EXEMPT) || [...el.querySelectorAll(EXEMPT)].some(wide) ? out.exempt : out.scroller).push(name(el) + ' ' + el.scrollWidth + '/' + el.clientWidth + 'px');
  }
  // text and controls past the window's edge, with no sideways scroller around them that could bring them in
  const LEAF = 'a, button, input, select, textarea, label, [role="button"], [role="tab"], h1, h2, h3, h4, p, li, dt, dd, span, td, th';
  for (const el of document.querySelectorAll(LEAF)) {
    if (el.closest(EXEMPT) || sideways.some((s) => s.contains(el)) || !shown(el)) continue;
    if (el.matches('span, li, p, dt, dd, td, th, h1, h2, h3, h4') && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    // the nearest ancestor that clips sideways (inside the window, else the window itself): past its edge is lost, unless
    // the text ends in an ellipsis (truncation with a way to read it: a tooltip or the full text elsewhere is the rule)
    let left = 0, right = W, ellipsis = getComputedStyle(el).textOverflow === 'ellipsis';
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const c = getComputedStyle(p); if (c.textOverflow === 'ellipsis') ellipsis = true;
      if (/hidden|clip/.test(c.overflowX)) { const pr = p.getBoundingClientRect(); left = Math.max(left, pr.left); right = Math.min(right, pr.right); break; }
    }
    if (ellipsis) continue;
    if (r.right > right + 1 || r.left < left - 1) out['cut-off'].push(name(el) + ' ' + Math.round(r.left) + '..' + Math.round(r.right) + 'px "' + (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 24) + '"');
  }
  return out;
}

(async () => {
  const server = await serve(PORT);
  const browser = await launch();
  const page = await browser.newPage(); await page.setViewport({ width: WIDTH, height: HEIGHT });
  const found = {};
  const take = async (key) => { found[key] = await page.evaluate(measure, EXEMPT); };
  for (const a of APP_PAGES) { at(a); await page.goto(BASE + a, { waitUntil: 'networkidle0' }); await sleep(800); await take(a); }
  changed.report(APP_PAGES.length + ' app pages, ' + SITE_PAGES.length + ' of ' + site.pages().length + ' test-site pages');
  for (const r of SITE_PAGES) { at(r); await page.goto(BASE + r, { waitUntil: 'networkidle0' }); await sleep(800); await take(r); }
  await browser.close(); server.close();

  const KINDS = ['page-scroll', 'scroller', 'cut-off'];
  const counts = (p) => Object.fromEntries(KINDS.filter((k) => found[p][k].length).map((k) => [k, found[p][k].length]));
  const exempt = Object.keys(found).reduce((n, p) => n + found[p].exempt.length, 0);
  Object.keys(found).forEach((p) => { if (found[p].exempt.length && process.env.REFLOW_VERBOSE) console.log('  exempt ' + p + ': ' + found[p].exempt.slice(0, 3).join(' | ')); });
  const total = Object.keys(found).reduce((n, p) => n + KINDS.reduce((m, k) => m + found[p][k].length, 0), 0);
  if (process.argv.includes('--update')) {
    const base = {}; Object.keys(found).forEach((p) => { const c = counts(p); if (Object.keys(c).length) base[p] = c; });
    changed.shrinkOnly(BASELINE, base);
    fs.mkdirSync(path.dirname(BASELINE), { recursive: true }); fs.writeFileSync(BASELINE, JSON.stringify(base, null, 1) + '\n');
    Object.keys(found).forEach((p) => KINDS.forEach((k) => { if (found[p][k].length) console.log('  ' + p + ' · ' + k + ': ' + found[p][k].length + ' · e.g. ' + found[p][k].slice(0, 2).join(' | ')); }));
    console.log('REFLOW_BASELINE written: ' + total + ' findings on ' + Object.keys(base).length + ' of ' + Object.keys(found).length + ' pages (' + exempt + ' exempt two-dimensional scrollers)');
    return;
  }
  const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  const worse = []; let better = 0;
  Object.keys(found).forEach((p) => KINDS.forEach((k) => {
    const was = (base[p] || {})[k] || 0, now = found[p][k].length, detail = k + ' ' + was + ' -> ' + now + ' · e.g. ' + found[p][k].slice(0, 3).join(' | ');
    shared.record(p + ': no new ' + k + ' at ' + WIDTH + 'px', now <= was, detail);
    if (now > was) worse.push(p + ': ' + detail);
  }));
  Object.keys(base).filter((p) => found[p]).forEach((p) => Object.entries(base[p]).forEach(([k, n]) => { if (found[p][k].length < n) better++; }));
  worse.forEach((w) => console.log('  NEW ' + w));
  if (better) console.log('  ' + better + ' known findings went down: run with --update to lower the baseline');
  console.log((worse.length ? 'REFLOW_FAIL ' + worse.length + ' new findings; ' : 'REFLOW_OK ') + total + ' known findings on ' + Object.keys(found).length + ' pages at ' + WIDTH + 'px (' + exempt + ' exempt two-dimensional scrollers)');
  shared.ended();   // every failure above is a recorded check (G5a I1)
  process.exit(worse.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
