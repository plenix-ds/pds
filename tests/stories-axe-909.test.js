/* Plenix tests · axe on every story, in light and dark (issue 909, plan §7e item 7; the stories come from #1034).
   Summary: serves build/storybook (npm run build-storybook), lists its stories from index.json, opens each story's iframe and runs axe-core (WCAG 2.2 A and AA)
     in light and then in dark (data-plx-mode). Known findings live in tests/baselines/stories-axe.json (story id · mode → rule → number of elements); the test fails only on a
     rule that is new for a story or hits more elements than recorded, so findings can only go down. A story that cannot be opened fails the run.
   Usage:
     npm run build-storybook && node tests/stories-axe-909.test.js            compare
     node tests/stories-axe-909.test.js --update                              record the current findings (lowers the baseline; never raises it, see changed.shrinkOnly)
     node tests/stories-axe-909.test.js --init                                write the baseline as it is now, raising it: only for adopting the gate (#909) or an owner-listed exception (D-0025)
     STORIES_ONLY=badge,button node tests/stories-axe-909.test.js             only story ids that start with these prefixes
     STORIES_CHANGED=<file> node tests/stories-axe-909.test.js                <file> lists changed paths, one per line (a pull request): when every path is inside one part
       (platform/components/<Part>/, platform/patterns/<Part>/ or docs/site/stories/<Part>.stories.tsx) only that part's stories open; any other path (tokens, styles, setup, this test) opens all of them.
       The full run stays nightly and on tag (ci.yml), so a regression in an untouched dependent part is found there.
   -> STORIES_AXE_909_OK */
const fs = require('fs'), path = require('path'), http = require('http');
const { launch } = require('./lib.js');
const changed = require('./changed.js');
const ROOT = path.join(__dirname, '..', 'build', 'storybook'), BASELINE = path.join(__dirname, 'baselines', 'stories-axe.json');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
if (!fs.existsSync(path.join(ROOT, 'index.json'))) { console.error('no build/storybook: run npm run build-storybook first'); process.exit(1); }
const only = process.env.STORIES_ONLY ? process.env.STORIES_ONLY.split(',') : null;
let parts = null;   // part names touched by the pull request, or null for "all stories"
if (process.env.STORIES_CHANGED) {
  const paths = fs.readFileSync(process.env.STORIES_CHANGED, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean).filter((f) => f !== 'tests/baselines/stories-axe.json');
  const names = paths.map((f) => { const m = /^platform\/(?:components|patterns)\/([^/]+)\//.exec(f) || /^docs\/site\/stories\/([^/.]+)\.stories\.tsx$/.exec(f); return m && m[1]; });
  if (paths.length && names.every(Boolean)) parts = new Set(names);
}
const partOf = (e) => [path.basename(e.importPath || '').replace(/\.stories\.\w+$/, ''), path.basename(path.dirname(e.componentPath || ''))];
const stories = Object.values(JSON.parse(fs.readFileSync(path.join(ROOT, 'index.json'), 'utf8')).entries).filter((e) => e.type === 'story' && (!only || only.some((p) => e.id.startsWith(p))) && (!parts || partOf(e).some((n) => parts.has(n))));
if (parts) console.log('pull request touches only ' + [...parts].join(', ') + ': ' + stories.length + ' stories');
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise((r) => server.listen(0, r)); const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await launch({ args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });   // pages open side by side: a page behind another would otherwise have its timers and frames paused, and its story never finish rendering
  const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const found = {}, broken = [], queue = stories.slice();
  // several pages at once: a thousand stories in two modes would otherwise outlast the test's time limit (TEST_TIMEOUT_MS)
  const worker = async () => {
    const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    for (let s = queue.shift(); s; s = queue.shift()) {
      for (let attempt = 1; attempt <= 2; attempt++) try {   // a second try: on a busy runner a page can be slow to load, which is not an accessibility result
        await page.bringToFront();
        await page.goto(base + '/iframe.html?id=' + s.id + '&viewMode=story', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForFunction(() => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay') || !!document.querySelector('#storybook-root > *'), { timeout: 30000 });   // a closed dialog renders nothing in the root, so wait for Storybook's own "shown" flag
        if (await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay') && !document.querySelector('#storybook-root > *'))) throw new Error('the story threw while rendering');
        await new Promise((r) => setTimeout(r, 200));
        if (!(await page.evaluate(() => !!window.axe))) await page.evaluate(axeSrc);
        for (const mode of ['light', 'dark']) {
          await page.evaluate((m) => { document.documentElement.setAttribute('data-plx-mode', m); }, mode);
          const out = await page.evaluate(async (tags) => {
            const r = await window.axe.run(document.querySelector('#storybook-root'), { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] });
            const o = {}; r.violations.forEach((v) => { o[v.id] = { n: v.nodes.length, help: v.help, target: String(v.nodes[0] && v.nodes[0].target) }; }); return o;
          }, TAGS);
          if (Object.keys(out).length) found[s.id + ' · ' + mode] = out;
        }
        break;
      } catch (e) { if (attempt === 2) broken.push(s.id + ': ' + e.message.split('\n')[0]); }
    }
  };
  await Promise.all(Array.from({ length: +process.env.STORIES_WORKERS || 3 }, worker));
  await browser.close(); server.close();
  const sorted = Object.fromEntries(Object.keys(found).sort().map((k) => [k, found[k]]));
  const counts = Object.fromEntries(Object.entries(sorted).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([r, x]) => [r, x.n]))]));
  if (process.argv.includes('--update') || process.argv.includes('--init')) {
    if (only || parts) { console.error('--update records the whole set; run it without STORIES_ONLY'); process.exit(1); }
    if (!process.argv.includes('--init')) changed.shrinkOnly(BASELINE, counts);
    fs.mkdirSync(path.dirname(BASELINE), { recursive: true }); fs.writeFileSync(BASELINE, JSON.stringify(counts, null, 1) + '\n');
    console.log('STORIES_AXE_BASELINE written: ' + Object.keys(counts).length + ' story/mode pairs with findings of ' + stories.length * 2 + '; ' + broken.length + ' could not be opened');
    broken.forEach((b) => console.log('  BROKEN ' + b)); return;
  }
  const base0 = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  const worse = [];
  Object.entries(sorted).forEach(([k, v]) => Object.entries(v).forEach(([rule, x]) => { const was = ((base0[k] || {})[rule]) || 0; if (x.n > was) worse.push(k + ': ' + rule + ' ' + was + ' -> ' + x.n + ' · ' + x.help + ' · e.g. ' + x.target); }));
  broken.forEach((b) => console.log('  BROKEN ' + b)); worse.forEach((w) => console.log('  NEW ' + w));
  if (broken.length || worse.length) { console.log('STORIES_AXE_FAIL ' + worse.length + ' new findings, ' + broken.length + ' stories that did not open, of ' + stories.length + ' stories'); process.exit(1); }
  console.log('STORIES_AXE_909_OK ' + stories.length + ' stories, light and dark, ' + Object.keys(counts).length + ' pairs with known findings');
})().catch((e) => { server.close(); console.error(e); process.exit(1); });
