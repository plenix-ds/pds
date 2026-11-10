/* Plenix tests · the data-font rule, part b (issue 1262, audit #10-#16, D-0165, ADR 0055): words stay in the text font, values in the data font.
   Summary: a Pagination range, a Tree / MediaCard / MediaViewer / EntityPicker meta, a CodeBlock title and a VersionCompare text line: words in the text font (DM Sans), numbers, dates and sizes in the data font (Reddit Mono);
     a CodeBlock title is the data font only for a path or file name; VersionCompare textKind="code" is the data font.
   Proof first: before the change the whole meta slots, the CodeBlock title and the VersionCompare lines are in the data font, and the Pagination range has tabular-nums without it.
   Usage: node tests/data-font-b-1262.test.js   → DATA_FONT_B_1262_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9998, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 1100, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (what) => page.evaluate(async (dir, what) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c); window.__root = ReactDOM.createRoot(c);
        const v = (id, text) => ({ id, label: id, text });
        const nodes = {
          pagination: h(P.Pagination, { page: 1, pageSize: 20, total: 312, onChange() {} }),
          tree: h(P.Tree, { label: 'T', nodes: [{ id: 'a', label: 'Folder', meta: 'Shared' }, { id: 'b', label: 'Other', meta: '12 files' }], selected: 'a', onSelect() {} }),
          media: h('div', { style: { width: 240 } }, h(P.MediaCard, { title: 'Photo', meta: 'JPG' }), h(P.MediaCard, { title: 'Photo 2', meta: '2.4 MB' })),
          code: h('div', null, h(P.CodeBlock, { title: 'src/app/main.ts' }, 'let a = 1;'), h(P.CodeBlock, { title: 'Example output' }, 'let b = 2;'), h(P.CodeBlock, { title: 'notes.txt' }, 'x')),
          prose: h(P.VersionCompare, { mode: 'text', versions: [v('v1', 'one\ntwo'), v('v2', 'one\n2')] }),
          codeKind: h(P.VersionCompare, { mode: 'text', textKind: 'code', versions: [v('v1', 'one\ntwo'), v('v2', 'one\n2')] }),
        };
        window.__root.render(nodes[what]); await new Promise((r) => setTimeout(r, 700));
      }, dir, what);
      // the font of the first text node of an element (or the element), as mono / sans
      const fam = (sel, nth) => page.evaluate((sel, nth) => { const e = document.querySelectorAll(sel)[nth || 0]; if (!e) return null; const f = getComputedStyle(e).fontFamily; return /reddit mono/i.test(f) ? 'mono' : 'sans'; }, sel, nth);
      const kinds = (sel, nth) => page.evaluate((sel, nth) => { const e = document.querySelectorAll(sel)[nth || 0]; if (!e) return null;
        const out = []; const walk = (n) => { for (const k of n.childNodes) { if (k.nodeType === 3 && k.textContent.trim()) out.push([k.textContent.trim(), /reddit mono/i.test(getComputedStyle(k.parentElement).fontFamily) ? 'mono' : 'sans']); else if (k.nodeType === 1) walk(k); } }; walk(e); return out; }, sel, nth);
      await mount('pagination');
      let k = await kinds('.plx-pagination__info'); assert.ok(k.some(([t, f]) => /312/.test(t) && f === 'mono') && k.some(([t, f]) => /of/.test(t) && f === 'sans'), T + 'the range: numbers mono, "of" sans ' + JSON.stringify(k));
      assert.notEqual(await page.evaluate(() => getComputedStyle(document.querySelector('.plx-pagination__info')).fontVariantNumeric), 'tabular-nums', T + 'the range block no longer lays out as a value');
      await mount('tree');
      assert.equal(await fam('.plx-tree__meta', 0), 'sans', T + 'Tree meta "Shared" is a word: sans');
      k = await kinds('.plx-tree__meta', 1); assert.ok(k.some(([t, f]) => t === '12' && f === 'mono') && k.some(([t, f]) => /files/.test(t) && f === 'sans'), T + 'Tree meta "12 files": number mono, word sans ' + JSON.stringify(k));
      await mount('media');
      assert.equal(await fam('.plx-media-card__meta', 0), 'sans', T + 'MediaCard meta "JPG" is a word: sans');
      k = await kinds('.plx-media-card__meta', 1); assert.ok(k.some(([t, f]) => /2\.4/.test(t) && f === 'mono'), T + 'MediaCard meta "2.4 MB": the size is mono ' + JSON.stringify(k));
      await mount('code');
      assert.equal(await fam('.plx-code-block__title', 0), 'mono', T + 'a path title is mono'); assert.equal(await fam('.plx-code-block__title', 1), 'sans', T + 'a caption title is sans');
      assert.equal(await fam('.plx-code-block__title', 2), 'mono', T + 'a file name title is mono');
      await mount('prose'); await wait(300);
      assert.equal(await fam('.plx-version-compare__text', 0), 'sans', T + 'VersionCompare prose lines are sans');
      await mount('codeKind'); assert.equal(await fam('.plx-version-compare__text', 0), 'mono', T + 'textKind="code" lines are mono');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('DATA_FONT_B_1262_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
