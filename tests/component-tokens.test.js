// Plenix tests · component tokens, on the real components of the St. John the Beloved test site (LighthouseCollection/st-john-test-site, served at /Plenix/test-site/; owner,
// 2026-10-25: the tests run on the site, not on the design spec). It replaces the design spec's component labs in the
// automatic runs: the labs drew every size, variant and state of a component on a spec page and checked that each token
// moves the property it names; this test does the same on the components the site really draws.
// On each site page, every stylesheet rule that uses a component token (var(--plx-comp-…)) and matches an element on the
// page is checked: the token is set on that element to a marker value and the property the rule sets must take it. The
// :hover, :focus-visible, :focus and :active rules are copied onto a test attribute ([data-plx-test-state~="hover"]) so
// each state is checked without a pointer. A rule's token counts as wired once it moves its property on any element of
// any page (a variant's own rule can win over the base rule on one element and lose on another).
// Fails when a token that a matched rule uses never moves its property anywhere on the site (a token that edits nothing),
// except the known ones in tests/baselines/component-tokens.json (rule → reason), which can only go down. Which parts the
// site uses is Site coverage's (site-coverage.test.js; reset, owner 2026-10-26: each part is checked once).
//   node tests/component-tokens.test.js            the pages of what changed (tests/changed.js)
//   TEST_SCOPE=full node tests/component-tokens.test.js   every site page
//   node tests/component-tokens.test.js --update   record the current dead tokens as the baseline (TEST_SCOPE=full only)
const fs = require('fs');
const path = require('path');
const { serve, launch, sleep, at } = require('./lib.js');
const changed = require('./changed.js');
const site = require('./site.js');
const PORT = +process.env.TOKENS_PORT || +process.env.TEST_PORT || 8812, BASE = 'http://127.0.0.1:' + PORT + '/Plenix/';
const BASELINE = path.join(__dirname, 'baselines', 'component-tokens.json');
const UPDATE = process.argv.includes('--update');
changed.noPartialUpdate('component-tokens');
const PAGES = changed.pages(site.urls());
if (!PAGES.length) changed.none('COMPONENT_TOKENS_OK 0 pages');
changed.report(PAGES.length + ' of ' + site.pages().length + ' test-site pages');

const { prepare, check } = require('./component-tokens-probe.js');   // the in-page probe (#1337: its own file, so tests/component-tokens-probe-1337.test.js runs it on fixtures)

(async () => {
  const server = await serve(PORT);
  const browser = await launch();
  const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 });
  const wired = new Set(), dead = {};
  const visit = async (r) => {
    at(r);
    await page.goto(BASE + r, { waitUntil: 'networkidle0' }); await sleep(600);
    await page.evaluate(prepare);
    const res = await page.evaluate(check, [...wired]);
    res.wired.forEach((k) => { wired.add(k); delete dead[k]; });
    Object.entries(res.dead).forEach(([k, why]) => { if (!wired.has(k)) dead[k] = dead[k] || (r + ': ' + why); });
    if (process.env.TOKENS_TRACE) console.log(r + ': ' + res.wired.length + ' wired, ' + Object.keys(res.dead).length + ' not moving');
  };
  for (const r of PAGES) await visit(r);
  // a token counts as wired once it moves on any page: a partial run (the pages of what changed) that finds a token
  // moving nothing confirms it on the other site pages before it fails
  const known = !UPDATE && fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  const open = () => Object.keys(dead).some((k) => !wired.has(k) && !(k in known));
  if (!UPDATE && open()) {
    const rest = site.urls().filter((r) => PAGES.indexOf(r) < 0);
    if (rest.length) console.log('  confirming on the other ' + rest.length + ' site pages');
    for (const r of rest) { if (!open()) break; await visit(r); }
  }
  await browser.close(); server.close();
  const deadKeys = Object.keys(dead).filter((k) => !wired.has(k)).sort();
  if (UPDATE) {
    const next = Object.fromEntries(deadKeys.map((k) => [k, dead[k]]));
    changed.shrinkOnly(BASELINE, next, 'component-tokens');
    fs.writeFileSync(BASELINE, JSON.stringify(next, null, 1) + '\n');
    console.log('COMPONENT_TOKENS_BASELINE written: ' + deadKeys.length + ' rules whose token moves nothing on the site');
    return;
  }
  const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  const fresh = deadKeys.filter((k) => !(k in base));
  const fixed = Object.keys(base).filter((k) => wired.has(k)).length;
  fresh.slice(0, 40).forEach((k) => console.log('  FAIL ' + k + '  (' + dead[k] + ')'));
  if (fresh.length > 40) console.log('  … and ' + (fresh.length - 40) + ' more');
  if (fixed) console.log('  ' + fixed + ' known rules are wired now: run with --update to lower the baseline');
  console.log((fresh.length ? 'COMPONENT_TOKENS_FAIL ' + fresh.length + ' rule tokens move nothing; ' : 'COMPONENT_TOKENS_OK ') + wired.size + ' wired on ' + PAGES.length + ' pages');
  process.exit(fresh.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
