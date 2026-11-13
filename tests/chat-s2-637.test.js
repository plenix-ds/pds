/* Plenix tests · Chat slice 2: runs, date and "New messages" lines, the Sent/Read footer and the status marks (issue 637).
   Summary: Chat.Thread with a run from each person, two date lines and the "New messages" line, light and dark:
     Chat.Group: the photo and the name on the first message of a run only; only Chat.Message children take them (a
       Divider inside the run stays as given)
     Chat.Divider: a date line; unread: "New messages" by default (Arabic: "رسائل جديدة")
     no time on the message line; a footer at the bottom of the bubble, never above the caption and never under the 12px type
       floor (#206, check 3; it was 10px before the floor), in the secondary gray: "Sent <time>", and "| Read <time>" once read
     the status after the times: sending a clock, sent one gray check, delivered two gray checks (named "Delivered"), read two
       GREEN checks (green-500 light, green-200 dark); green is never the only sign ("Read" is written)
     dark: theirs gray-900 with a gray-700 outline, yours gray-700 with a gray-500 outline (no blue)
     the footer gray and the read checks pass their contrast on every message fill (4.5:1 text, 3:1 marks)
   Proof first: before slice 2 there is no Chat.Group or Chat.Divider, the time sits on the message line, there is no
     status, and your dark message is blue-900: those lines fail there.
   Usage: node tests/chat-s2-637.test.js   → CHAT_S2_637_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const rgb = (h) => 'rgb(' + [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ') + ')';
const lum = (s) => { const c = s.match(/\d+/g).slice(0, 3).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
(async () => {
  const PORT = +process.env.TEST_PORT || 9663, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 640, height: 900 });
    const look = async (mode, lang) => {
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      return page.evaluate(async (mode, lang) => {
        document.documentElement.setAttribute('data-plx-mode', mode);
        const h = React.createElement, P = window.Plenix;
        if (!P.Chat.Group || !P.Chat.Divider) return { missing: true };
        const av = (n) => h(P.Avatar, { name: n, size: 'sm' });
        const thread = h(P.Chat.Thread, { label: 'Conversation', follow: false },
          h(P.Chat.Divider, { id: 'date' }, 'Today'),
          h(P.Chat.Group, { author: 'Maya Chen', avatar: av('Maya Chen') },
            h(P.Chat.Message, { id: 't1', time: '9:00 AM' }, 'Can you send the plan?'),
            h(P.Chat.Message, { id: 't2', time: '9:01 AM' }, 'The PDF is fine.')),
          h(P.Chat.Group, { mine: true, avatar: av('John Doe') },
            h(P.Chat.Divider, { id: 'inrun' }, '9 AM'),
            h(P.Chat.Message, { id: 'read', time: '9:02 AM', status: 'read', readTime: '9:04 AM' }, 'Here it is.'),
            h(P.Chat.Message, { id: 'delivered', time: '9:03 AM', status: 'delivered' }, 'Did it open?'),
            h(P.Chat.Message, { id: 'sent', time: '9:05 AM', status: 'sent' }, 'I can resend it.'),
            h(P.Chat.Message, { id: 'sending', status: 'sending' }, 'Sending now')),
          h(P.Chat.Divider, { id: 'unread', unread: true }));
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        ReactDOM.createRoot(document.getElementById('c')).render(lang === 'ar' ? h(P.LocaleProvider, { locale: 'ar' }, thread) : thread);
        await new Promise((r) => setTimeout(r, 800));
        const cs = (e) => getComputedStyle(e), q = (id) => document.getElementById(id);
        const msg = (id) => { const m = q(id), b = m.querySelector('.plx-chat__bubble'), f = m.querySelector('.plx-chat__footer'), s = m.querySelector('.plx-chat__status'), meta = m.querySelector('.plx-chat__meta');
          const body = m.querySelector('.plx-chat__body');
          return { avatar: !!m.querySelector('.plx-chat__avatar'), author: !!m.querySelector('.plx-chat__author'), metaTime: !!(meta && meta.querySelector('time')),
            bg: cs(b).backgroundColor, line: cs(b).borderTopColor,
            foot: f ? { text: f.textContent, size: cs(f).fontSize, color: cs(f).color, last: b.lastElementChild === f, below: f.getBoundingClientRect().top >= body.getBoundingClientRect().bottom,
              mono: !f.querySelector('time') || cs(f.querySelector('time')).fontFamily.split(',')[0].replace(/["']/g, '').trim() === cs(document.documentElement).getPropertyValue('--plx-sys-font-data').split(',')[0].replace(/["']/g, '').trim() } : null,
            status: s ? { color: cs(s).color, svgs: s.querySelectorAll('svg').length, name: (s.querySelector('[role=img]') || {}).ariaLabel || '' } : null }; };
        const caption = parseFloat(cs(document.documentElement).getPropertyValue('--plx-sys-text-caption-font-size')) * parseFloat(cs(document.documentElement).fontSize);
        return { t1: msg('t1'), t2: msg('t2'), read: msg('read'), delivered: msg('delivered'), sent: msg('sent'), sending: msg('sending'), caption,
          inrun: { avatar: !!q('inrun').querySelector('.plx-avatar'), attrs: [...q('inrun').attributes].map((a) => a.name).filter((n) => /mine|author|avatar/.test(n)) },
          date: q('date').textContent, unread: q('unread').textContent, unreadWeight: cs(q('unread')).fontWeight, dateWeight: cs(q('date')).fontWeight };
      }, mode, lang);
    };
    let r = await look('light', 'en');
    assert.ok(!r.missing, 'Chat.Group and Chat.Divider exist');
    // runs: one photo and one name per run
    assert.deepEqual([r.t1.avatar, r.t1.author, r.t2.avatar, r.t2.author], [true, true, false, false], 'their run: the photo and the name on the first message only');
    assert.deepEqual([r.read.avatar, r.delivered.avatar, r.sent.avatar], [true, false, false], 'your run: the photo on the first message only');
    assert.deepEqual([r.inrun.avatar, r.inrun.attrs], [false, []], 'a Divider inside a run takes none of the run\'s props, and the first message still gets the photo');
    // lines across the thread
    assert.equal(r.date, 'Today', 'a date line');
    assert.equal(r.unread, 'New messages', 'the unread line says New messages by default');
    assert.ok(+r.unreadWeight > +r.dateWeight, 'the unread line is bolder than a date line');
    // the footer: no time on the message line, Sent and Read at the bottom, smaller than the caption
    for (const m of [r.t1, r.read, r.delivered, r.sent]) {
      assert.ok(!m.metaTime, 'no time on the message line');
      assert.ok(m.foot && m.foot.last && m.foot.below, 'the footer is the last line, under the text');
      // the 12px type floor (#206, #214, check 3) lifted the caption role, and so the footer, from 10px/11px to 12px; no
      // decision names an exact footer size, so the test holds the two recorded rules: not under the floor, not above the caption
      assert.ok(parseFloat(m.foot.size) >= 12, 'the footer is not under the 12px type floor');
      assert.ok(parseFloat(m.foot.size) <= r.caption, 'the footer is not larger than the caption');
      assert.ok(contrast(m.foot.color, m.bg) >= 4.5, 'the footer gray passes 4.5:1 on its message');
      assert.ok(m.foot.mono, 'the times are in the data font (the owner\'s #260: numbers in Mono; typography pattern check)');
    }
    assert.match(r.t1.foot.text, /^Sent 9:00 AM$/, 'theirs: Sent <time>');
    assert.match(r.read.foot.text, /^Sent 9:02 AM\s*\|\s*Read 9:04 AM$/, 'read: Sent <time> | Read <time>');
    assert.match(r.delivered.foot.text, /^Sent 9:03 AM$/, 'delivered: no Read part');
    assert.match(r.sending.foot.text, /^Sending$/, 'sending: the word');
    // the status marks
    assert.equal(r.t1.status, null, 'theirs has no status mark');
    assert.deepEqual([r.read.status.color, r.read.status.svgs > 0], [rgb('#107C10'), true], 'read: green checks (green-500)');
    assert.ok(contrast(r.read.status.color, r.read.bg) >= 3, 'the green checks pass 3:1');
    for (const m of [r.delivered, r.sent, r.sending]) assert.equal(m.status.color, m.foot.color, 'sent, delivered and sending marks are the footer gray');
    assert.equal(r.delivered.status.name, 'Delivered', 'delivered is named (no visible word says it)');
    assert.deepEqual([r.read.status.name, r.sent.status.name, r.sending.status.name], ['', '', ''], 'a mark beside its visible word is decorative');
    // dark: two grays, no blue; the read checks still green and visible
    r = await look('dark', 'en');
    assert.deepEqual([r.t1.bg, r.t1.line], [rgb('#34363B'), rgb('#56585E')], 'dark theirs: gray-900, gray-700 outline');
    assert.deepEqual([r.read.bg, r.read.line], [rgb('#56585E'), rgb('#8E9094')], 'dark yours: gray-700, gray-500 outline (no blue)');
    assert.equal(r.read.status.color, rgb('#9BD39B'), 'dark read: green-200');
    assert.ok(contrast(r.read.status.color, r.read.bg) >= 3, 'dark: the green checks pass 3:1');
    for (const m of [r.t1, r.read, r.sent]) assert.ok(contrast(m.foot.color, m.bg) >= 4.5, 'dark: the footer gray passes 4.5:1');
    // Arabic: the words come from the catalog
    r = await look('light', 'ar');
    assert.equal(r.unread, 'رسائل جديدة', 'Arabic: New messages');
    assert.match(r.read.foot.text, /^تم الإرسال 9:02 AM\s*\|\s*تمت القراءة 9:04 AM$/, 'Arabic: Sent and Read');
    assert.equal(r.delivered.status.name, 'تم التسليم', 'Arabic: Delivered');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('CHAT_S2_637_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
