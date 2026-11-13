/* Plenix tests · #1305 (audit item 18 of #1232, D-0164, ADR 0055): a Chat reaction's count and a voice message's time draw in the data font (Reddit Mono).
   The emoji and the reaction button stay in the text font; the size does not change.
   Summary: a message with reactions (a count of 12 and 3, yours and not) and a voice message: the count span (plx-chat__reaction-count) computes to Reddit Mono, the emoji to the text font,
     the voice time ("0:23") to Reddit Mono; the reaction pill keeps its height and the time stays on one line.
   Checks: AC-1 reaction count in the data font, emoji in the text font; AC-2 voice time in the data font; AC-3 the pill keeps its height; the two lines leave type-roles.baseline.json.
   Proof first: before the change the count and the time are drawn in DM Sans, and the baseline holds both lines.
   Usage: node tests/chat-data-font-1305.test.js   → CHAT_DATA_FONT_1305_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'check-system.rules', 'type-roles.baseline.json'), 'utf8')).backlog;
  for (const k of ['css plx-chat__reaction', 'css plx-chat__voice-time']) assert.ok(!(k in base), 'AC-4: "' + k + '" is out of the type-roles backlog');
  const PORT = +process.env.TEST_PORT || 9825, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        const h = React.createElement, C = Plenix.Chat; const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '640px'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h(C.Thread, { label: 'Conversation' },
          h(C.Message, { author: 'Maya', time: '10:24', onReact: () => {}, reactions: [{ emoji: '👍', count: 12, mine: true }, { emoji: '❤️', count: 3 }] }, 'Agreed.'),
          h(C.Message, { author: 'Maya', time: '10:28' }, h(C.Voice, { src: 'data:audio/wav;base64,', duration: 23, id: 'v1' }))));
        await new Promise((r) => setTimeout(r, 900));
        const first = (v) => v.split(',')[0].trim().replace(/['"]/g, ''), rs = getComputedStyle(document.documentElement), q = (s) => [...document.querySelectorAll(s)];
        const f = (e) => first(getComputedStyle(e).fontFamily);
        return { data: first(rs.getPropertyValue('--plx-sys-font-data')),
          counts: q('.plx-chat__reaction .plx-chat__reaction-count').map((e) => ({ t: e.textContent.trim(), f: f(e) })), emoji: q('.plx-chat__reaction .plx-chat__emoji').map(f),
          pills: q('.plx-chat__reaction').map((e) => Math.round(e.getBoundingClientRect().height)),
          voice: q('.plx-chat__voice-time').map((e) => ({ t: e.textContent.trim(), f: f(e), one: e.getBoundingClientRect().height < 24 })) };
      }, dir, mode);
      assert.deepEqual(got.counts.map((x) => x.t), ['12', '3'], T + 'AC-1: the count spans are there');
      for (const d of got.counts) assert.equal(d.f, got.data, T + 'AC-1: the count ' + d.t + ' is in the data font (' + d.f + ')');
      assert.ok(got.emoji.length === 2 && got.emoji.every((x) => x !== got.data), T + 'AC-1: the emoji stays in the text font');
      assert.equal(got.voice.length, 1, T + 'the voice time is drawn');
      for (const d of got.voice) { assert.equal(d.f, got.data, T + 'AC-2: the voice time ' + d.t + ' is in the data font (' + d.f + ')'); assert.ok(d.one, T + 'AC-2: the time stays on one line'); }
      assert.ok(got.pills.every((x) => x === got.pills[0]) && got.pills[0] > 0, T + 'AC-3: both pills have the same height: ' + got.pills);
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('CHAT_DATA_FONT_1305_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
