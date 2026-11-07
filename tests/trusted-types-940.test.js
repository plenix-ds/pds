/* Plenix tests · no raw HTML sinks (issue 940, RedSave P-47): rich text, highlights and icons render under Trusted Types.
   Summary: on a page with `Content-Security-Policy: require-trusted-types-for 'script'; trusted-types plenix`, RichText (its html prop), the highlight a SearchField draws, an Icon and
     `iconNode` render with no Trusted Types violation, the rich text is still cleaned (a script, an event attribute and a javascript: link are gone), and the RichTextEditor's start content shows at once.
     Plenix creates one policy, named "plenix", for the one place real HTML is parsed (the sanitizer); nothing else writes HTML. Left to right and right to left.
   Proof first: before the change RichText sets innerHTML with a plain string, so the page reports a violation, and `iconNode` does not exist.
   Usage: node tests/trusted-types-940.test.js   → TRUSTED_TYPES_940_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
// no code under platform/ writes HTML (outside vendor/, dist/ and the spec site): a string is parsed only in utils/trustedHtml.ts, through the "plenix" policy
const fs = require('fs'), path = require('path');
const walk = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (['vendor', 'dist', 'design-system', 'node_modules'].includes(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p, out); else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p); } return out; };
const sinks = [];
for (const f of walk(path.join(__dirname, '..', 'platform'))) {
  const code = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
  if (/\.(innerHTML|outerHTML)\s*=[^=]/.test(code) || /insertAdjacentHTML\s*\(/.test(code) || /dangerouslySetInnerHTML\s*[:=]/.test(code) || /document\.write\s*\(/.test(code)) sinks.push(path.relative(path.join(__dirname, '..'), f));
}
assert.deepEqual(sinks, [], 'no code under platform/ writes HTML: ' + sinks.join(', '));
(async () => {
  const PORT = +process.env.TEST_PORT || 9940, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir) => {
        window.__tt = []; document.addEventListener('securitypolicyviolation', (e) => window.__tt.push({ directive: e.effectiveDirective, sample: (e.sample || '').slice(0, 60), file: (e.sourceFile || '').split('/').slice(-2).join('/'), line: e.lineNumber }));
        const meta = document.createElement('meta'); meta.httpEquiv = 'Content-Security-Policy'; meta.content = "require-trusted-types-for 'script'; trusted-types plenix"; document.head.appendChild(meta);
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        const host = document.createElement('div'); host.id = 'c'; document.querySelector('main').replaceChildren(host);
        const dirty = '<p>Hello <strong>there</strong> <a href="javascript:alert(1)" onclick="x()">link</a><script>window.__pwn = 1<\/script><img src="x" onerror="window.__pwn = 2"></p>';
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
          h(P.RichText, { html: dirty, id: 'rt' }),
          h(P.SearchField, { label: 'Find', value: 'ali', onChange() {}, suggestions: ['Alice', 'Malik'], defaultOpen: true }),
          h(P.Icon, { name: 'add', id: 'ic' }),
          h('span', { id: 'node-host' }),
          h(P.RichTextEditor, { label: 'Notes', defaultValue: '<p>Start <em>here</em></p>' })));
        await new Promise((res) => setTimeout(res, 1500));
        const out = { has: typeof P.iconNode };
        if (typeof P.iconNode === 'function') { const n = P.iconNode('add'); document.getElementById('node-host').appendChild(n); out.node = n.nodeType === 1 && n.classList.contains('plx-icon'); }
        const rt = document.getElementById('rt');
        out.rt = !rt ? null : { strong: !!rt.querySelector('strong'), script: !!rt.querySelector('script'), onerror: /onerror|onclick/.test(rt.innerHTML), js: /javascript:/.test(rt.innerHTML), pwn: window.__pwn || 0, text: rt.textContent.trim().slice(0, 14) };
        out.icon = !!document.querySelector('#ic svg, #ic .plx-icon__svg');
        out.editor = /Start/.test(document.body.textContent) && !!document.querySelector('.plx-rich-text-editor em, [contenteditable] em');
        out.tt = window.__tt;
        return out;
      }, dir);
      assert.deepEqual(r.tt.filter((v) => !/tiptap|prosemirror|vendor/i.test(v.file)), [], T + 'no Trusted Types violation from Plenix\'s own code ' + JSON.stringify(r.tt));
      assert.equal(r.has, 'function', T + 'iconNode is exported'); assert.ok(r.node, T + 'iconNode builds the icon as an element');
      assert.ok(r.rt && r.rt.strong && !r.rt.script && !r.rt.onerror && !r.rt.js && !r.rt.pwn, T + 'rich text is still cleaned: ' + JSON.stringify(r.rt));
      assert.ok(r.icon, T + 'the Icon renders'); assert.ok(r.editor, T + 'the RichTextEditor\'s start content shows');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('TRUSTED_TYPES_940_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
