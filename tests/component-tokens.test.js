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

// runs in the page: copies the state rules onto the test attribute (once per document)
function prepare() {
  if (window.__plxTokenStates) return;
  window.__plxTokenStates = true;
  const STATE = { ':hover': 'hover', ':focus-visible': 'focus', ':focus-within': 'within', ':focus': 'focus', ':active': 'active' };
  const swap = (sel) => sel.replace(/:(hover|focus-visible|focus-within|focus|active)\b/g, (m) => '[data-plx-test-state~="' + STATE[m] + '"]');
  const walk = (list, owner) => {
    for (let i = list.length - 1; i >= 0; i--) {
      const r = list[i];
      if (r.styleSheet) { try { walk(r.styleSheet.cssRules, r.styleSheet); } catch (e) { /* unreadable */ } continue; }
      if (r.cssRules && !r.selectorText) { try { walk(r.cssRules, r); } catch (e) { /* unreadable */ } continue; }
      if (r.selectorText && /:(hover|focus-visible|focus-within|focus|active)\b/.test(r.selectorText) && /--plx-comp-/.test(r.style.cssText)) {
        try { owner.insertRule(swap(r.selectorText) + '{' + r.style.cssText + '}', i + 1); } catch (e) { /* the browser rejects it */ }
      }
    }
  };
  Array.from(document.styleSheets).forEach((s) => { try { walk(s.cssRules, s); } catch (e) { /* unreadable */ } });
}

// runs in the page: checks each rule × property × token on up to three matching elements; skips the keys already wired
function check(done) {
  const DONE = new Set(done);
  const COLOR = /(^|-)(color|fill|stroke|shadow)$|^background$|^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?$|^outline$|^text-decoration$|^caret-color$/;
  const MARKS = ['37px', '0.37', '9', '"Courier New"', '900', 'none', 'hidden', 'solid', 'dashed', 'translateX(7px)', '123px 45px', 'linear-gradient(rgb(1, 2, 3), rgb(1, 2, 3))'];
  const STATE = { hover: 'hover', 'focus-visible': 'focus', 'focus-within': 'within', focus: 'focus', active: 'active' };
  const out = { wired: [], dead: {} };
  const rules = [];
  const walk = (list, media) => {
    for (const r of list) {
      if (r.styleSheet) { try { walk(r.styleSheet.cssRules, media); } catch (e) { /* unreadable */ } continue; }
      if (r instanceof CSSMediaRule) { if (window.matchMedia(r.conditionText).matches) try { walk(r.cssRules); } catch (e) { /* unreadable */ } continue; }
      if (r.cssRules && !r.selectorText) { try { walk(r.cssRules); } catch (e) { /* unreadable */ } continue; }
      if (!r.selectorText || !/--plx-comp-/.test(r.style.cssText) || /data-plx-test-state/.test(r.selectorText)) continue;
      for (let i = 0; i < r.style.length; i++) {
        const prop = r.style[i]; if (/^--|^(transition|animation)/.test(prop)) continue;   // motion is reduced on every test page
        const v = r.style.getPropertyValue(prop);
        const tokens = [...new Set((v.match(/--plx-comp-[\w-]+/g) || []))];
        tokens.forEach((t) => rules.push({ sel: r.selectorText, prop, token: t.slice(2) }));
      }
    }
  };
  Array.from(document.styleSheets).forEach((s) => { try { walk(s.cssRules); } catch (e) { /* unreadable */ } });
  const read = (el, pseudo, prop) => getComputedStyle(el, pseudo || null).getPropertyValue(prop).trim();
  for (const x of rules) {
    const key = x.sel + ' | ' + x.prop + ' | ' + x.token;
    if (DONE.has(key)) continue;
    // each selector of a list on its own: the part, its pseudo-element and its states
    const parts = x.sel.split(/,(?![^(]*\))/).map((p) => p.trim());
    let matched = false, moved = false, why = '';
    for (const part of parts) {
      // a state inside :has() (a row that holds a focused button) is the state of another element: not forced here
      if (/:has\([^)]*:(hover|focus-visible|focus-within|focus|active)/.test(part)) continue;
      const pe = /::?(before|after|placeholder|marker|selection|backdrop|-webkit-[\w-]+)\s*$/.exec(part);
      const base = pe ? part.slice(0, pe.index) : part;
      const states = [...new Set((base.match(/:(hover|focus-visible|focus-within|focus|active)\b/g) || []).map((m) => STATE[m.slice(1)]))];
      const plain = base.replace(/:(hover|focus-visible|focus-within|focus|active)\b/g, '');
      let els = [];
      try { els = Array.from(document.querySelectorAll(plain || '*')).filter((e) => e.getClientRects().length || pe).slice(0, 3); } catch (e) { continue; }
      for (const el of els) {
        matched = true;
        const had = el.getAttribute('data-plx-test-state');
        if (states.length) el.setAttribute('data-plx-test-state', states.join(' '));
        const pseudo = pe ? '::' + pe[1] : null;
        const before = read(el, pseudo, x.prop);
        const marks = COLOR.test(x.prop) ? ['rgb(1, 2, 3)', '3px solid rgb(1, 2, 3)', 'rgb(1, 2, 3) 0px 0px 0px 3px'] : MARKS;
        for (const m of marks) {
          el.style.setProperty('--' + x.token, m);
          const after = read(el, pseudo, x.prop);
          el.style.removeProperty('--' + x.token);
          if (after !== before) { moved = true; break; }
        }
        if (had === null) el.removeAttribute('data-plx-test-state'); else el.setAttribute('data-plx-test-state', had);
        if (moved) break;
        why = 'reads ' + before.slice(0, 40) + ' on ' + el.tagName.toLowerCase() + '.' + String(el.className).split(' ').slice(0, 2).join('.');
      }
      if (moved) break;
    }
    if (moved) out.wired.push(key); else if (matched) out.dead[key] = why;
  }
  return out;
}

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
  // one result per rule token in the results file (TEST_RESULTS), so CI can quarantine one (#1327): a dead one outside the
  // baseline fails, a wired one passes (so a quarantined token reads as stale once it moves something)
  const shared = require('./check.js');
  fresh.forEach((k) => shared.record(k + ': moves something on the site', false, dead[k]));
  [...wired].forEach((k) => shared.record(k + ': moves something on the site', true, ''));
  const fixed = Object.keys(base).filter((k) => wired.has(k)).length;
  fresh.slice(0, 40).forEach((k) => console.log('  FAIL ' + k + '  (' + dead[k] + ')'));
  if (fresh.length > 40) console.log('  … and ' + (fresh.length - 40) + ' more');
  if (fixed) console.log('  ' + fixed + ' known rules are wired now: run with --update to lower the baseline');
  console.log((fresh.length ? 'COMPONENT_TOKENS_FAIL ' + fresh.length + ' rule tokens move nothing; ' : 'COMPONENT_TOKENS_OK ') + wired.size + ' wired on ' + PAGES.length + ' pages');
  process.exit(fresh.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
