/* Plenix tests · #1337: the component-tokens probe (tests/component-tokens-probe.js) on fixtures that copy the four rules the
   first full run reported as moving nothing, with the components' real stylesheets.
   Summary:
     AC-1 (probe) a rule inside @container counts only on an element whose container condition holds: a wide SplitView does
          not run its narrow rule (.plx-split-view--side-by-side .plx-split-view__second, min-block-size), a narrow one does and
          the token moves it.
     AC-2 (probe) a rule is tried on elements in different places, not only the first three: three folders come before a file,
          and the file icon's color token (.plx-file__icon | color) still counts as wired.
     AC-3 (Field) the label tip of an inline Field in a Stack takes --plx-comp-field-grid-label-tip-max-width: Tooltip's own
          rule (.plx-tooltip, max-inline-size none) no longer wins over it; Field hands it on through Tooltip's context tokens.
     AC-4 (FileBrowser) no rule reads --plx-comp-file-browser-body-gap (the body's gap shows only between the tree and the
          content, which is --plx-comp-file-browser-tree-gap), and the token is deprecated, not deleted (1.x).
     AC-5 none of the four rules of the issue is reported as moving nothing on the fixture.
     AC-6 (probe) the first matching elements are still tried, whatever their place: two metric items look the same (same classes,
          same parents), the first one's :first-child rule wins over the padding token, and the second one still wires it
          (CI on #1362: a probe that kept one element per place read only the first item on /giving).
   Proof first: before the change AC-1 to AC-5 fail (the probe reports the four rules as moving nothing); AC-6 fails with a probe
     that keeps only one element per place.
   Usage: node tests/component-tokens-probe-1337.test.js   → COMPONENT_TOKENS_PROBE_1337_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
const { prepare, check } = require('./component-tokens-probe.js');
require('./limit.js');
const ROOT = path.join(__dirname, '..');
const CSS = ['platform/components/Tooltip/tooltip.css', 'platform/components/Field/field.css', 'platform/components/Stack/stack.css',
  'platform/components/File/file.css', 'platform/patterns/FileBrowser/file-browser.css', 'platform/patterns/SplitView/split-view.css',
  'platform/components/Metric/metric.css'];
// the values the fixture needs (the token build is not part of this test): a few comp tokens at their sys values' sizes
const VARS = ':root{--plx-comp-stack-field-inline-label-tip-max-width:160px;--plx-comp-stack-field-inline-grid-template-columns:minmax(0,max-content) minmax(200px,320px);'
  + '--plx-comp-field-inline-gap:12px;--plx-comp-file-icon-color:rgb(86, 88, 94);--plx-comp-file-folder-icon-color:rgb(86, 88, 94);'
  + '--plx-comp-file-browser-body-gap:12px;--plx-comp-file-browser-tree-gap:12px;--plx-comp-split-view-gap:8px;--plx-comp-split-view-padding:0px;'
  + '--plx-comp-split-view-second-min-height:240px;--plx-comp-split-view-second-min-width:320px;--plx-comp-metric-group-item-padding-inline:16px;}';
const file = (folder, name) => '<span class="plx-file plx-file--' + (folder ? 'folder' : 'file') + ' plx-file--line"><span class="plx-file__icon" aria-hidden="true"><svg width="16" height="16"></svg></span><span class="plx-file__text"><span class="plx-file__name">' + name + '</span></span></span>';
// the stylesheets as platform.css loads them: its layer order, and their own order and layer
const PLATFORM = fs.readFileSync(path.join(ROOT, 'platform/platform.css'), 'utf8');
const LAYERS = PLATFORM.match(/@layer [^;{]+;/)[0];
const IMPORTS = (base) => CSS.map((c) => { const m = PLATFORM.match(new RegExp('@import url\\("' + c.slice('platform/'.length).replace(/[.]/g, '\\.') + '"\\) layer\\(([\\w.]+)\\);')); assert.ok(m, c + ' is in platform.css'); return { at: m.index, css: '@import url("' + base + c + '") layer(' + m[1] + ');' }; })
  .sort((a, b) => a.at - b.at).map((x) => x.css).join('');
const HTML = (base) => '<!doctype html><html><head><style>' + LAYERS + IMPORTS(base) + '</style><style>' + VARS + '</style></head><body>'
  // AC-3: an inline Field in a Stack, its label tip as Field draws it (a Tooltip span around the label)
  + '<div class="plx-stack" data-plx-inline-fields id="stack" style="inline-size:900px"><div class="plx-field plx-field--inline"><div class="plx-field__head">'
  + '<span class="plx-tooltip plx-field__label-tip" id="tip"><label class="plx-field__label"><span class="plx-field__label-text">A label much longer than the label column lets it be, so it is cut</span></label></span></div>'
  + '<div class="plx-field__control"><input></div></div></div>'
  // AC-2 and AC-4: a FileBrowser with its tree, three folders before a file (the /documents page of the test site)
  + '<section class="plx-file-browser plx-file-browser--list plx-file-browser--tree"><div class="plx-file-browser__body"><div class="plx-file-browser__tree">tree</div>'
  + '<div class="plx-file-browser__content"><ul><li>' + file(true, 'Bulletins') + '</li><li>' + file(true, 'Minutes') + '</li><li>' + file(true, 'Photos') + '</li><li>' + file(false, 'Schedule.pdf') + '</li></ul></div></div></section>'
  // AC-1: a wide SplitView side by side (its narrow rule is off) and a narrow one (on: it stacks)
  + '<div style="inline-size:1200px;block-size:300px;display:flex"><div class="plx-split-view plx-split-view--side-by-side" id="wide"><div class="plx-split-view__panels"><div class="plx-split-view__first plx-split-view__first--side-by-side">a</div><div class="plx-split-view__second plx-split-view__second--side-by-side">b</div></div></div></div>'
  + '<div style="inline-size:600px;block-size:600px;display:flex"><div class="plx-split-view plx-split-view--side-by-side" id="narrow"><div class="plx-split-view__panels"><div class="plx-split-view__first plx-split-view__first--side-by-side">a</div><div class="plx-split-view__second plx-split-view__second--side-by-side">b</div></div></div></div>'
  // AC-6: a metric group, two items alike (the /giving page of the test site)
  + '<div class="plx-metric-group"><div class="plx-metric-group__item">a</div><div class="plx-metric-group__item">b</div></div>'
  + '</body></html>';
const SPLIT = '.plx-split-view--side-by-side .plx-split-view__second | min-block-size | plx-comp-split-view-second-min-height';

(async () => {
  // AC-4: nothing reads the body gap; the token stays, deprecated
  const reads = CSS.concat(['platform/patterns/FileBrowser/FileBrowser.tsx']).filter((c) => /var\(--plx-comp-file-browser-body-gap\b/.test(fs.readFileSync(path.join(ROOT, c), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')));
  assert.deepEqual(reads, [], 'AC-4: no stylesheet reads --plx-comp-file-browser-body-gap');
  const tok = JSON.parse(fs.readFileSync(path.join(ROOT, 'platform/tokens/components/file-browser.tokens.json'), 'utf8'));
  const find = (o) => (o && typeof o === 'object' ? ('file-browser-body-gap' in o ? o['file-browser-body-gap'] : Object.values(o).map(find).find(Boolean)) : undefined);
  const entry = find(tok);
  assert.ok(entry && entry.$value && /2\.0\.0/.test(entry.$deprecated || ''), 'AC-4: file-browser-body-gap is kept and deprecated until 2.0.0');

  const PORT = +process.env.TEST_PORT || 9837, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 });
    page.on('pageerror', (e) => errors.push(e.message));
    const base = 'http://127.0.0.1:' + PORT + '/Plenix/';
    await page.goto(base + 'tests/component-tokens-probe-1337', { waitUntil: 'domcontentloaded' });   // a page of the test server, so the stylesheets are same-origin and readable
    await page.setContent(HTML(base), { waitUntil: 'networkidle0' });
    // AC-3: the label tip takes the Stack's width (160px), not Tooltip's none
    const tip = await page.evaluate(() => { const s = getComputedStyle(document.getElementById('tip')); return { max: s.maxInlineSize, min: s.minInlineSize }; });
    assert.equal(tip.max, '160px', 'AC-3: the inline field label tip is at most --plx-comp-field-grid-label-tip-max-width (reads ' + tip.max + ')');
    assert.equal(tip.min, '0px', 'AC-3: the label tip may shrink (min-inline-size 0, reads ' + tip.min + ')');
    await page.evaluate(prepare);
    const res = await page.evaluate(check, []);
    // AC-1: wired on the narrow SplitView, and not dead because of the wide one
    assert.ok(res.wired.includes(SPLIT), 'AC-1: the SplitView narrow rule moves min-block-size where its container condition holds');
    const wide = await page.evaluate((sel) => { const el = document.querySelector('#narrow .plx-split-view__second'); el.closest('.plx-split-view').parentElement.remove(); return !!document.querySelector(sel); }, '#wide .plx-split-view__second');
    assert.ok(wide);
    const onlyWide = await page.evaluate(check, []);
    assert.ok(!(SPLIT in onlyWide.dead) && !onlyWide.wired.includes(SPLIT), 'AC-1: on a wide SplitView only, the narrow rule is neither wired nor dead (its condition is off): ' + JSON.stringify(onlyWide.dead[SPLIT] || ''));
    // AC-2: the file icon's color is found on the file after three folders
    assert.ok(res.wired.includes('.plx-file__icon | color | plx-comp-file-icon-color'), 'AC-2: the file icon color token moves the file\'s icon (after three folders)');
    // AC-6: the second of two alike metric items wires the padding token that the first one's :first-child rule hides
    assert.ok(res.wired.includes('.plx-metric-group__item | padding-inline-start | plx-comp-metric-group-item-padding-inline'),
      'AC-6: the metric item padding token moves the second item: ' + JSON.stringify(res.dead['.plx-metric-group__item | padding-inline-start | plx-comp-metric-group-item-padding-inline'] || ''));
    // AC-5: none of the four rules of the issue moves nothing (the fixture draws one variant of each part, so other rules may)
    const ISSUE = ['.plx-field__label-tip | max-inline-size | plx-comp-field-grid-label-tip-max-width', '.plx-file-browser__body | column-gap | plx-comp-file-browser-body-gap',
      '.plx-file__icon | color | plx-comp-file-icon-color', SPLIT];
    assert.deepEqual(ISSUE.filter((k) => k in res.dead || k in onlyWide.dead), [], 'AC-5: the four rules of #1337 are not dead on the fixture');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COMPONENT_TOKENS_PROBE_1337_OK ' + res.wired.length + ' wired');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
