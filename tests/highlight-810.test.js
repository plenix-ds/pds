// Plenix · tests/highlight-810.test.js: the typed text marked inside a result (platform/utils/highlight.tsx, issue 810). Node, then one browser page.
//   node tests/highlight-810.test.js   → HIGHLIGHT_810_OK
// Cases: an empty or absent text gives the label as a string; every match is marked, not only the first; upper and lower case match; the marked
//   pieces joined are the label (never a lost or doubled letter, also with a letter that lower-cases to two); the pieces are plain spans (no
//   <mark> or <strong>, which a screen reader announces); Arabic matches without its vowel marks and without the stretching line, the marks
//   of the last matched letter are inside the mark, and a match of Arabic letters is plx-match--joined (underlined, not heavier);
//   matchesText decides the same way; text with regular-expression characters is taken as written; then the source: the four controls
//   use the helper and none keeps its own indexOf match.
// Browser cases (QA on #819): a Combobox without marks draws a match that comes right after a space with the space, left to right ("Dan Anders"
//   with "an") and right to left ("أحمد محمد" with "محمد"). The option is a flex container: a bare label made of pieces became anonymous flex
//   items and the text before the mark lost its trailing space ("DanAnders", "أحمدمحمد"), so the label is drawn in its own span. Checked by the
//   drawn gap between the text before the mark and the mark (at least half a space; the old build drew 0) and by the label span being the option's child.
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Babel = require('@babel/standalone');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'platform', 'utils', 'highlight.tsx'), 'utf8');
const mod = { exports: {} };
new Function('exports', 'module', 'require', Babel.transform(src, { presets: ['env', 'react', 'typescript'], filename: 'highlight.tsx', sourceType: 'module' }).code)(mod.exports, mod, (n) => (n === 'react' ? React : require(n)));
const { highlightMatch, matchesText } = mod.exports;

const html = (label, text) => renderToStaticMarkup(React.createElement('span', { id: 'x' }, highlightMatch(label, text))).replace(/^<span id="x">|<\/span>$/g, '');
const plain = (h) => h.replace(/<[^>]+>/g, '');
const spans = (h) => (h.match(/<span class="plx-match[^"]*">[^<]*<\/span>/g) || []);

let passed = 0, failed = 0;
const check = (name, fn) => { if (!shared.wanted(name)) return; try { fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

check('an empty or absent text gives the label as a string', () => { assert.strictEqual(highlightMatch('Maya Chen', ''), 'Maya Chen'); assert.strictEqual(highlightMatch('Maya Chen', '   '), 'Maya Chen'); assert.strictEqual(highlightMatch('Maya Chen', undefined), 'Maya Chen'); });
check('text that is not found gives the label as a string', () => assert.strictEqual(highlightMatch('Maya Chen', 'zz'), 'Maya Chen'));
check('a match is marked', () => assert.strictEqual(html('Maya Chen', 'ch'), 'Maya <span class="plx-match">Ch</span>en'));
check('every match is marked, not only the first', () => { const h = html('Banana', 'an'); assert.strictEqual(spans(h).length, 2); assert.strictEqual(h, 'B<span class="plx-match">an</span><span class="plx-match">an</span>a'); });
check('upper and lower case are the same, the label keeps its case', () => { assert.strictEqual(html('GOLD leaf', 'gol'), '<span class="plx-match">GOL</span>D leaf'); assert.strictEqual(html('gold', 'GOL'), '<span class="plx-match">gol</span>d'); });
check('the pieces joined are the label', () => ['Maya Chen', 'Banana', 'İstanbul', 'ǅ', 'a b  c', 'مُحَمَّد', 'كـتاب'].forEach((l) => assert.strictEqual(plain(html(l, l.slice(0, 2).trim() || 'a')), l)));
check('a letter that lower-cases to two is marked whole', () => { const h = html('İstanbul', 'i'); assert.strictEqual(plain(h), 'İstanbul'); assert.ok(h.startsWith('<span class="plx-match">İ</span>'), h); });
check('plain spans, never mark or strong', () => { const h = html('Maya Chen', 'a'); assert.ok(!/<mark|<strong|<em|<b>/.test(h), h); });
check('text with regular-expression characters is taken as written', () => { assert.strictEqual(html('a(b)*c', '(b)*'), 'a<span class="plx-match">(b)*</span>c'); assert.strictEqual(html('abc', '.'), 'abc'); });
check('Arabic: the text without vowel marks finds the label with them', () => { const h = html('مُحَمَّد علي', 'محمد'); assert.strictEqual(plain(h), 'مُحَمَّد علي'); assert.strictEqual(spans(h).length, 1); assert.ok(h.startsWith('<span class="plx-match plx-match--joined">مُحَمَّد</span>'), h); });
check('Arabic: the label without marks finds the text with them', () => assert.strictEqual(spans(html('محمد', 'مُحَمَّد')).length, 1));
check('Arabic: the stretching line is ignored', () => { const h = html('كـتاب', 'كتاب'); assert.strictEqual(spans(h).length, 1); assert.strictEqual(plain(h), 'كـتاب'); });
check('Arabic: a part of a word is marked joined, and the word reads whole', () => { const h = html('مكتبة', 'كت'); assert.strictEqual(plain(h), 'مكتبة'); assert.strictEqual(h, 'م<span class="plx-match plx-match--joined">كت</span>بة'); });
check('Arabic: the vowel mark of the last matched letter is inside the mark', () => { const h = html('كَتَبَ', 'كت'); assert.ok(/<span class="plx-match plx-match--joined">كَتَ<\/span>/.test(h), h); });
check('Latin is not joined', () => assert.ok(!/joined/.test(html('Maya Chen', 'ch'))));
check('mixed text marks each part by its own letters', () => { const h = html('Ali علي', 'ali علي'); assert.strictEqual(plain(h), 'Ali علي'); assert.strictEqual(spans(h).length, 1); });
check('matchesText: empty text matches', () => { assert.strictEqual(matchesText('Maya', ''), true); assert.strictEqual(matchesText('Maya', undefined), true); });
check('matchesText: found and absent', () => { assert.strictEqual(matchesText('Maya Chen', 'CH'), true); assert.strictEqual(matchesText('Maya Chen', 'zz'), false); });
check('matchesText agrees with the marks', () => ['Maya', 'مُحَمَّد', 'كـتاب'].forEach((l) => [l.slice(1, 3), 'zz', 'محمد'].forEach((t) => assert.strictEqual(matchesText(l, t), spans(html(l, t)).length > 0, l + ' / ' + t))));

const read = (f) => fs.readFileSync(path.join(ROOT, 'platform', 'components', f), 'utf8');
check('SearchField, Combobox, Cascader and TreeSelect use highlightMatch', () => ['SearchField/SearchField.tsx', 'Combobox/Combobox.tsx', 'Cascader/Cascader.jsx', 'TreeSelect/TreeSelect.jsx'].forEach((f) => assert.ok(/highlightMatch\(/.test(read(f)), f)));
check('Combobox, Cascader and TreeSelect decide what is listed with matchesText', () => ['Combobox/Combobox.tsx', 'Cascader/Cascader.jsx', 'TreeSelect/TreeSelect.jsx'].forEach((f) => { const s = read(f); assert.ok(/matchesText\(/.test(s), f); assert.ok(!/label\)\.toLowerCase\(\)\.indexOf/.test(s), f + ' keeps its own match'); }));
check('SearchField keeps no match function of its own', () => assert.ok(!/function marked\(/.test(read('SearchField/SearchField.tsx'))));
// ───────── in the browser: a match right after a space keeps the space (Combobox without marks) ─────────
const CASES = [
  { dir: 'ltr', name: 'Combobox ltr: a match right after a space keeps the space', options: ['Banana split', 'Maya Chen', 'Dan Anders'], label: 'Dan Anders', text: 'an' },
  { dir: 'rtl', name: 'Combobox rtl: a match right after a space keeps the space', options: ['علي حسن', 'أحمد محمد', 'محمود'], label: 'أحمد محمد', text: 'محمد' },
];
(async () => {
  if (!CASES.some((c) => shared.wanted(c.name))) return;
  const { serve, launch } = require('./lib');
  const PORT = +process.env.TEST_PORT || 9682, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const c of CASES) {
      if (!shared.wanted(c.name)) continue;
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (c) => {
        document.documentElement.setAttribute('dir', c.dir);
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement, P = Plenix;
        const App = () => { const v = React.useState(''); return h(P.Combobox, { label: 'Owner', value: v[0], onChange: v[1], options: c.options.map((l, i) => ({ value: 'o' + i, label: l })) }); };
        ReactDOM.createRoot(document.getElementById('c')).render(h(App));
        await new Promise((r) => setTimeout(r, 700));
        document.querySelector('[role=combobox]').focus();
      }, c);
      await page.keyboard.type(c.text); await new Promise((r) => setTimeout(r, 400));
      const got = await page.evaluate((c) => {
        const li = [...document.querySelectorAll('[role=option]')].find((o) => o.textContent === c.label);
        if (!li) return { found: false };
        // the mark that comes right after a space ("Dan Anders" with "an" marks "an" twice; the second follows the space)
        const mark = [...li.querySelectorAll('.plx-match')].find((x) => x.previousSibling && x.previousSibling.nodeType === 3 && / $/.test(x.previousSibling.data));
        const label = li.querySelector('.plx-combobox__option-label'), before = mark && mark.previousSibling;
        if (!mark || !before || before.nodeType !== 3 || !/ $/.test(before.data)) return { found: true, mark: !!mark, before: before ? before.nodeName + ':' + (before.data || '') : null };
        // the drawn letters before the mark, without the space itself, against the mark's box
        const r = document.createRange(); r.setStart(before, 0); r.setEnd(before, before.data.length - 1);
        const b = r.getBoundingClientRect(), m = mark.getBoundingClientRect();
        const gap = c.dir === 'rtl' ? b.left - m.right : m.left - b.right;
        const ctx = document.createElement('canvas').getContext('2d'); ctx.font = getComputedStyle(before.parentNode).font;
        const space = ctx.measureText('a a').width - ctx.measureText('aa').width;
        return { found: true, mark: true, gap, space, labelIsChild: !!label && label.parentNode === li && label.contains(mark) };
      }, c);
      const ok = got.found && got.mark && got.space > 0 && got.gap >= got.space / 2 && got.labelIsChild;
      shared.record(c.name, ok, got); if (ok) passed++; else { failed++; console.log('FAIL ' + c.name + ': ' + JSON.stringify(got) + ' (the gap before the mark must be at least half a space, and the label a span of the option)'); }
      await page.close();
    }
    const name = 'Combobox: no script errors';
    if (shared.wanted(name)) { const ok = !errors.length; shared.record(name, ok, errors); if (ok) passed++; else { failed++; console.log('FAIL ' + name + ': ' + errors.join(' | ')); } }
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { failed++; console.error(e); }).then(() => {
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'HIGHLIGHT_810_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
});
