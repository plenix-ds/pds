// Plenix tests · typography (owner, 2026-10-04, restored 2026-10-11; Platforms Standard 3.4): DM Sans for all interface
// text; Reddit Mono only for code (--plx-sys-font-code) and technical values (--plx-sys-font-data: IDs, file names and paths,
// versions, dates and times, sizes, counts, durations, measured percentages, coordinates), chosen by the value's kind, and
// always at its neighbors' size and line height so Mono and Sans share a baseline. On every app page and every page of the
// St. John the Beloved test site (test-site/), in light mode (reset, owner 2026-10-26: dark mode comes last), with the
// fonts loaded:
//   role      an element marked as code or data (code, kbd, pre, samp, Text "data", a data field (Input/Textarea data), a DataGrid or
//             Table column of kind "data", a PropertyList value marked data) computes to Reddit Mono
//   prose     text in Reddit Mono is a code or data value, never a sentence (four or more plain words, no code characters)
//   pattern   visible text that is wholly a technical value (2026-10-11, Oct 11, 2026, 10:42 AM, 12 MB, 1.2 GB, 640×480,
//             v1.2.3, report.pdf, #1234, a UUID) is in Reddit Mono (badges, tags, chips, buttons, inputs, menus and navigation
//             keep their component's typography; a title or heading keeps the heading typography)
//   baseline  Reddit Mono and DM Sans text on the same line of the same row (a table row, a PropertyList item, a flex row,
//             a line of running text) sit on one baseline, within 0.5px
//   table     in every DataGrid and Table (put back from the grid test, #382 F2; owner: one size in tables, batch 247;
//             typefaces by kind, 2026-10-11; header weights, batch 248): the grid's text size is its token
//             (--plx-comp-data-grid-font-size); every text in the body rows is at that size, in Reddit Mono in a column
//             of kind "data" and for code and the data role, in DM Sans elsewhere; every header title is weight 600 and
//             every row-label cell's text 500. Badges, tags, chips, buttons, keys, counts, avatars, tooltips, the placeholder,
//             a group header's eyebrow and a summary's name, and the design system's specimens keep their own type.
//   phrase    (issue 260; owner 2026-10-24) a count inside a phrase is in Reddit Mono, its words in DM Sans: no DM Sans text
//             holds a number followed by words ("7 files", "4,546 assets"; Latin or Arabic-Indic digits). The same places
//             as pattern are left out. A new check: its first run records the page's findings with --update (TEST_SCOPE=full).
// Known findings are kept in tests/baselines/typography.json (page -> mode -> check -> number); the test fails only when
// a page and mode has more findings than recorded, so they can only go down (aim: none).
//   node tests/typography.test.js            compare
//   node tests/typography.test.js --update   record the current findings as the baseline (TEST_SCOPE=full only)
//   TEST_SCOPE=full node tests/typography.test.js   every page (default: the pages of what changed, tests/changed.js)
//   TYPO_VERBOSE=1 node tests/typography.test.js   list every finding
//   TYPO_ONLY=<pattern> node tests/typography.test.js   only the pages whose name matches
//   TYPO_PORT=8863 (or TEST_PORT) node tests/typography.test.js   another port
const fs = require('fs');
const path = require('path');
const { serve, launch, ready, at } = require('./lib.js');
const changed = require('./changed.js');
const PORT = +process.env.TYPO_PORT || +process.env.TEST_PORT || 8861, BASE = 'http://127.0.0.1:' + PORT + '/Plenix/';
const BASELINE = path.join(__dirname, 'baselines', 'typography.json');
const ONLY = process.env.TYPO_ONLY ? new RegExp(process.env.TYPO_ONLY) : null;
const APP_PAGES = changed.pages(['dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings'].map((a) => a + '/index.html')
  .concat(['dam/index.html', 'dam/settings-system.html', 'dam/settings-myaccount.html', 'dam/image-editor.html'])
  // the settings screens beyond each page's first (owner, 2026-10-13: every settings page is cards of rows; the settings-cards rule)
  .concat(['settings/index.html#/account', 'settings/index.html#/appearance', 'settings/index.html#/categories', 'settings/index.html#/docs/data-model',
    'dam/settings-system.html#/users', 'dam/settings-system.html#/permissions', 'dam/settings-myaccount.html#/preferences']));
const site = require('./site.js');
// every page of the St. John the Beloved test site (owner, 2026-10-25: the tests run there, not on the design spec)
const SITE_PAGES = changed.pages(site.urls());
changed.noPartialUpdate();
if (!APP_PAGES.length && !SITE_PAGES.length) changed.none('TYPOGRAPHY_OK role 0, prose 0, pattern 0, baseline 0, table 0, phrase 0 on 0 pages');
const CHECKS = ['role', 'prose', 'pattern', 'baseline', 'table', 'phrase'];

// runs in the page: the findings of each check
async function inspect() {
  await document.fonts.ready;
  const MONO = /^"?Reddit Mono/i;
  const fam = (el) => getComputedStyle(el).fontFamily;
  const isMono = (el) => MONO.test(fam(el));
  // marked as code or data: the elements and classes of the code and data roles
  const ROLE = 'code, kbd, pre, samp, .plx-text--data, .plx-input--data, .plx-data-grid__group-count, .plx-data-grid__group-summary-value, [data-plx-kind="data"], [class*="__cell--data"], .plx-property-list__value--data';
  // components that keep their own typography (a label inside a control or a pill), and specimens
  const OWN = '.plx-badge, .plx-tag, .plx-tag--chip, .plx-button, .plx-count, .plx-avatar, .plx-status-dot, input, textarea, select, option, button, [role="menuitem"], [role="option"], [role="tab"], .plx-data-grid__grid-header, .ds-vis, .ds-specimens, .ds-type, svg';
  // titles and headings
  const TITLE = 'h1, h2, h3, h4, h5, h6, [class*="__title"], .plx-text--title, .plx-text--heading, .plx-text--eyebrow';
  const shown = (el) => { if (!el.getClientRects().length) return false; const c = getComputedStyle(el); return c.visibility !== 'hidden' && !el.closest('[hidden], [aria-hidden="true"], .plx-visually-hidden, .plx-u-sr-only'); };
  const say = (el, t) => { const c = typeof el.className === 'string' ? el.className.split(' ').filter((x) => /^(plx|ds)-/.test(x)).slice(0, 2).join('.') : ''; return '"' + t.slice(0, 28) + '" (' + el.tagName.toLowerCase() + (c ? '.' + c : '') + ', ' + fam(el).split(',')[0] + ' ' + getComputedStyle(el).fontSize + ')'; };
  const MONTH = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\\.?';
  const ONE = [
    '\\d{4}-\\d{2}-\\d{2}(?:[ T]\\d{1,2}:\\d{2}(?::\\d{2})?)?',               // 2026-10-11, 2026-10-11 10:42
    MONTH + ' \\d{1,2}(?:, \\d{4})?(?:,? \\d{1,2}:\\d{2}(?:\\s?[AP]M)?)?',     // Oct 11, Oct 11, 2026
    '\\d{1,2} ' + MONTH + '(?: \\d{4})?',                                      // 11 Oct 2026
    '\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s?[AP]M)?',                                // 10:42, 10:42 AM
    '\\d+(?:[.,]\\d+)?\\s?(?:B|KB|MB|GB|TB|kB)',                               // 12 MB, 1.2 GB
    '\\d+\\s?[×x]\\s?\\d+(?:\\s?px)?',                                         // 640×480
    'v\\d+(?:\\.\\d+){1,3}(?:-[\\w.]+)?|\\d+\\.\\d+\\.\\d+(?:-[\\w.]+)?',      // v1.2.3, 0.31.39
    '[\\w-][\\w .()-]*\\.(?:pdf|png|jpe?g|gif|svg|webp|avif|heic|tiff?|psd|ai|eps|indd|mp4|mov|webm|mp3|wav|docx?|xlsx?|pptx?|csv|txt|md|json|jsx?|css|html|zip)', // report.pdf
    '#\\d{2,}',                                                                 // #1234
    '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',            // a UUID
  ];
  const TECH = new RegExp('^(?:' + ONE.join('|') + ')(?:\\s*[·,–-]\\s*(?:' + ONE.join('|') + '))*$', 'i');
  // a sentence: four or more words of letters (with ordinary punctuation), none of the characters of code or values
  const prose = (t) => { const w = t.split(/\s+/).filter(Boolean); return w.length >= 4 && !/[=<>{}()[\]\/\\_#@$`|*+~^"]|--|\d/.test(t) && w.every((x) => /^[A-Za-z][a-z'’]*[,.!?:;]?$/.test(x)); };
  // a count followed by words in one text: "7 files", "4,546 assets", "٧ ملفات" (Latin or Arabic-Indic digits)
  const PHRASE = /(?:^|[\s(])[$€£]?[0-9٠-٩][0-9٠-٩,.]*\s+\p{L}{2,}/u;
  const out = { role: [], prose: [], pattern: [], baseline: [], table: [], phrase: [] };
  const texts = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const el = n.parentElement; if (!el || el.closest('script, style, noscript, template, title') || !shown(el)) continue;
    texts.push({ n, t, el, mono: isMono(el) });
  }
  for (const x of texts) {
    const own = x.el.closest(OWN);
    const role = x.el.closest(ROLE);
    // role: marked as code or data, set in Reddit Mono
    if (role && !own && !x.mono) out.role.push(say(x.el, x.t));
    // prose: Reddit Mono is never used for a sentence (a code block is code, comments and all)
    if (x.mono && !x.el.closest('pre, .ds-type, .ds-vis, .ds-specimens') && prose(x.t)) out.prose.push(say(x.el, x.t));
    // pattern: a technical value on its own is in Reddit Mono (a title or heading that names a thing by its date
    // or file name is a title: it keeps the heading typography)
    if (!x.mono && !own && !x.el.closest('[role="menu"], [role="listbox"], nav, .plx-tooltip, [role="tooltip"], ' + TITLE) && TECH.test(x.t)) out.pattern.push(say(x.el, x.t));
    // phrase (issue 260; owner 2026-10-24): a count inside a phrase is in Reddit Mono and its words in DM Sans, so a DM Sans
    // text never holds a number followed by words ("7 files"): dataPhrase puts the number in its own data span
    if (!x.mono && !own && !x.el.closest('[role="menu"], [role="listbox"], nav, .plx-tooltip, [role="tooltip"], ' + TITLE) && PHRASE.test(x.t)) out.phrase.push(say(x.el, x.t));
  }
  // baseline: each Mono text against the Sans texts on its line in the same row
  const ROW = '.plx-data-grid__grid-row, .plx-property-list__item, tr, li, [role="row"], p, dd, dt, label';
  // a text's baseline: the top of its first line box plus its font's ascent (canvas metrics, fonts loaded), centered in the
  // box as the browser lays the content area out; nothing is added to the page
  const ctx = document.createElement('canvas').getContext('2d');
  const base = (x) => {
    const c = getComputedStyle(x.el); ctx.font = c.fontStyle + ' ' + c.fontWeight + ' ' + c.fontSize + ' ' + c.fontFamily;
    const m = ctx.measureText('Hg'), r = line(x);
    return r.top + (r.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
  };
  const line = (x) => { const r = document.createRange(); r.selectNodeContents(x.n); const rs = r.getClientRects(); return rs.length ? rs[0] : null; };
  const rowOf = (x) => x.el.closest(ROW) || (() => { let p = x.el.parentElement; for (let i = 0; p && i < 3; i++, p = p.parentElement) { const d = getComputedStyle(p).display; if (/flex|grid/.test(d) && getComputedStyle(p).flexDirection !== 'column') return p; } return null; })();
  const monos = texts.filter((x) => x.mono && !x.el.closest('pre, ' + OWN));
  const seen = new Set();
  for (const m of monos) {
    const row = rowOf(m); if (!row || seen.has(row)) continue;
    // a DataGrid row taller than one line (a wrapped cell): every cell has vertical alignment: middle (owner,
    // 2026-10-13), so a one-line cell sits in the middle of the row, not on the first line of the wrapped one
    if (row.classList.contains('plx-data-grid__grid-row')) { const c = row.querySelector('.plx-data-grid__grid-cell'); if (c && row.getBoundingClientRect().height > (parseFloat(getComputedStyle(c).minHeight) || 0) + (parseFloat(getComputedStyle(row).borderBottomWidth) || 0) + 1) continue; }
    const lm = line(m); if (!lm) continue;
    const sans = texts.filter((s) => !s.mono && row.contains(s.n) && !s.el.closest(OWN));
    for (const s of sans) {
      const ls = line(s); if (!ls) continue;
      // the same line: the two first line boxes overlap by more than half the shorter
      if (Math.min(lm.bottom, ls.bottom) - Math.max(lm.top, ls.top) < Math.min(lm.height, ls.height) / 2) continue;
      // a value under a label in its own line box (a stacked layout) is not beside it
      const d = Math.abs(base(m) - base(s));
      if (d > 0.5) { out.baseline.push(say(m.el, m.t) + ' vs ' + say(s.el, s.t) + ': ' + d.toFixed(2) + 'px'); seen.add(row); break; }
    }
  }
  // table: the grids' own size, typefaces by kind and header weights (both the DataGrid and the static Table, whose classes
  // are the grid's under plx-table)
  const px = (v) => { v = String(v).trim(); return /rem$/.test(v) ? parseFloat(v) * parseFloat(getComputedStyle(document.documentElement).fontSize) : parseFloat(v); };
  // (an avatar's initials are the avatar's own type, as in the other checks' OWN)
  const KEEP = '.plx-badge, .plx-tag, .plx-tag--chip, .plx-button, .plx-kbd, .plx-count, .plx-avatar, .plx-tooltip, [role="tooltip"], .ds-vis';
  for (const B of ['plx-data-grid', 'plx-table']) {
    const MARKED = 'code, samp, .plx-text--data, .' + B + '__group-count, .' + B + '__group-summary-value, [data-plx-kind="data"], .ds-code-link, .ds-mono, .ds-value, .ds-name';
    document.querySelectorAll('.' + B).forEach((g) => {
      if (!shown(g)) return;
      const grid = g.querySelector('.' + B + '__grid'); if (!grid || !g.querySelector('.' + B + '__grid-row .' + B + '__grid-cell')) return;
      const size = getComputedStyle(grid).fontSize, want = px(getComputedStyle(g).getPropertyValue('--plx-comp-data-grid-font-size'));
      if (want && Math.abs(parseFloat(size) - want) > 0.01) out.table.push(B + ' text is ' + size + ', its token is ' + want + 'px');
      const w = document.createTreeWalker(g.querySelector('.' + B + '__grid-tableholder') || g, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        const el = n.parentElement;
        if (!el || !n.textContent.trim() || !shown(el) || el.closest('.' + B + '__grid-header') || el.closest(KEEP + ', .' + B + '__grid-placeholder, .' + B + '__group-eyebrow, .' + B + '__group-summary-name')) continue;
        const c = getComputedStyle(el), family = c.fontFamily.split(',')[0].replace(/"/g, '').trim();
        const mono = !!el.closest('[class*="__cell--data"]') || !!el.closest(MARKED), wantFamily = mono ? 'Reddit Mono' : 'DM Sans';
        if (family !== wantFamily || c.fontSize !== size) out.table.push(say(el, n.textContent.trim()) + ': want ' + wantFamily + ' ' + size + (mono ? ' (a data value)' : ''));
      }
      g.querySelectorAll('.' + B + '__grid-header .' + B + '__grid-col-title').forEach((t) => { const fw = getComputedStyle(t).fontWeight; if (t.textContent.trim() && shown(t) && fw !== '600') out.table.push('header ' + say(t, t.textContent.trim()) + ' is weight ' + fw + ', not 600'); });
      g.querySelectorAll('.' + B + '__grid-row [class*="__cell--row-label"]').forEach((cell) => {
        const tw = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT); let m;
        while ((m = tw.nextNode())) { const el = m.parentElement; if (!el || !m.textContent.trim() || el.closest(KEEP)) continue; const fw = getComputedStyle(el).fontWeight; if (fw !== '500') out.table.push('row label ' + say(el, m.textContent.trim()) + ' is weight ' + fw + ', not 500'); }
      });
    });
  }
  return out;
}

(async () => {
  const server = await serve(PORT);
  const browser = await launch();
  const found = {};
  const MODES = ['light'];
  for (const mode of MODES) {
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: mode }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
    const take = async (key) => {
      if (ONLY && !ONLY.test(key)) return;
      const got = await page.evaluate(() => document.documentElement.getAttribute('data-plx-mode'));
      if (got && got !== mode) await page.evaluate((m) => document.documentElement.setAttribute('data-plx-mode', m), mode);
      (found[key] = found[key] || {})[mode] = await page.evaluate(inspect);
    };
    for (const a of APP_PAGES) {
      if (ONLY && !ONLY.test(a)) continue;
      at(mode + ' ' + a); await page.goto(BASE + a, { waitUntil: 'networkidle0' });
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* storage blocked */ } });
      await page.goto(BASE + a, { waitUntil: 'networkidle0' }); await ready(page); await take(a);
    }
    if (mode === 'light') changed.report(APP_PAGES.length + ' app pages, ' + SITE_PAGES.length + ' of ' + site.pages().length + ' test-site pages');
    for (const r of SITE_PAGES) {
      if (ONLY && !ONLY.test(r)) continue;
      at(mode + ' ' + r); await page.goto(BASE + r, { waitUntil: 'networkidle0' }); await ready(page); await take(r);
    }
    await page.close();
  }
  await browser.close(); server.close();

  const total = (c) => Object.keys(found).reduce((s, p) => s + MODES.reduce((t, m) => t + ((found[p][m] || {})[c] || []).length, 0), 0);
  const summary = CHECKS.map((c) => c + ' ' + total(c)).join(', ');
  const list = (p, m, c) => ((found[p][m] || {})[c] || []);
  if (process.env.TYPO_VERBOSE || process.argv.includes('--update')) Object.keys(found).forEach((p) => MODES.forEach((m) => CHECKS.forEach((c) => { const l = list(p, m, c); if (l.length) console.log('  ' + p + ' · ' + m + ' · ' + c + ': ' + l.length + ' · ' + l.slice(0, process.env.TYPO_VERBOSE ? 99 : 3).join(' | ')); })));
  if (process.argv.includes('--update')) {
    const base = {}; Object.keys(found).forEach((p) => MODES.forEach((m) => CHECKS.forEach((c) => { const k = list(p, m, c).length; if (k) ((base[p] = base[p] || {})[m] = base[p][m] || {})[c] = k; })));
    changed.shrinkOnly(BASELINE, base);
    fs.mkdirSync(path.dirname(BASELINE), { recursive: true }); fs.writeFileSync(BASELINE, JSON.stringify(base, null, 1) + '\n');
    console.log('TYPOGRAPHY_BASELINE written: ' + summary + ' on ' + Object.keys(found).length + ' pages');
    return;
  }
  const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  // one result per page, mode and check in the results file (TEST_RESULTS), so CI can quarantine one page check and still
  // block on any other (#1327, G5a M1 on PR #1328)
  const shared = require('./check.js');
  const worse = []; let better = 0;
  Object.keys(found).forEach((p) => MODES.forEach((m) => CHECKS.forEach((c) => {
    const was = ((base[p] || {})[m] || {})[c] || 0, now = list(p, m, c).length, detail = was + ' -> ' + now + ' · e.g. ' + list(p, m, c).slice(0, 3).join(' | ');
    shared.record(p + ' · ' + m + ' · ' + c + ': no new findings', now <= was, detail);
    if (now > was) worse.push(p + ' · ' + m + ' · ' + c + ': ' + detail); else if (now < was) better++;
  })));
  worse.forEach((w) => console.log('  NEW ' + w));
  if (better) console.log('  ' + better + ' page checks have fewer findings: run with --update to lower the baseline');
  console.log((worse.length ? 'TYPOGRAPHY_FAIL ' + worse.length + ' page checks got worse; ' : 'TYPOGRAPHY_OK ') + summary + ' on ' + Object.keys(found).length + ' pages');
  shared.ended();   // every failure above is a recorded check (G5a I1)
  process.exit(worse.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
