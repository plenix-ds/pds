/* Plenix tests · the Messages app on the Chat parts, and the Chat spec page (issue 637, slice 6).
   Summary: the suite's Messages app draws a conversation with Chat.Divider, Chat.Group (one photo and one name per run of messages from one side), the status of the person's own messages and
     the avatar of each sender, and still sends a reply; the spec page of Chat lists every part as built, with the owner's do and don't rules and a marked place for slice 4.
   The probe is proved able to see the old failure first: the old Messages app had no avatar, no run, no date line and no status (0 of each), so every count below fails on it; the old spec page had
     no examples of Group, Divider, Status, Attachments, Voice or Composer files, and no slice 4 place.
   Cases: Messages app (#/thread/1): one date line; one avatar per run (5 messages, 5 runs here: each side alternates), the avatar sits on the bubble; the person's messages carry a status; a reply typed
     and sent is added with the status "sent" and the composer clears (behavior kept); in an Arabic page the layout mirrors and the app still works. Spec page: the Chat record's examples draw the
     groups, dividers, attachments and voice; the use and avoid lists hold the owner's rules; the slice 4 placeholder is there and says so.
   Usage: node tests/messages-chat-s6.test.js   (run by layout.test.js when the Messages app, the Chat or the spec's Chat entry changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9643, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1400, height: 860 });
    await page.goto('http://localhost:' + PORT + '/Plenix/messages/index.html#/thread/1', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.plx-chat__thread', { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    const count = (sel) => page.evaluate((s) => document.querySelectorAll(s).length, sel);
    assert.equal(await count('.plx-chat__divider'), 1, 'one date line above the messages (the old app: 0)');
    assert.equal(await count('.plx-chat__message'), 5, 'five messages');
    assert.equal(await count('.plx-chat__group'), 5, 'each side alternates here, so five runs');
    assert.equal(await count('.plx-chat__avatar'), 5, 'one avatar per run, on the bubble (the old app: 0)');
    assert.equal(await count('.plx-chat__message--mine .plx-chat__status'), 2, 'the person\'s own messages show their status (the old app: 0)');
    // a run of two from the same side shares one photo and one name
    const run = await page.evaluate(() => { const g = document.querySelector('.plx-chat__group'); return !!g && g.querySelectorAll('.plx-chat__message').length >= 1; });
    assert.ok(run, 'the messages are inside a Chat.Group');
    // behavior kept: a reply is sent, shows "sent", and the composer clears
    await page.type('.plx-chat__field', 'On my way');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 500));
    assert.equal(await count('.plx-chat__message'), 6, 'the reply is added');
    assert.equal(await page.evaluate(() => document.querySelector('.plx-chat__field').value), '', 'the composer clears');
    const last = await page.evaluate(() => { const m = [...document.querySelectorAll('.plx-chat__message')].pop(); return { text: m.textContent, mine: m.classList.contains('plx-chat__message--mine'), status: m.querySelectorAll('.plx-chat__status').length }; });
    assert.ok(last.mine && /On my way/.test(last.text), 'the reply is the last message, yours');
    assert.equal(last.status, 1, 'the new reply has its status (sent)');
    // an Arabic page: the avatar crosses the bubble on the other side and the app still works
    await page.evaluate(() => { document.documentElement.setAttribute('dir', 'rtl'); document.documentElement.setAttribute('lang', 'ar'); });
    await new Promise((r) => setTimeout(r, 300));
    const side = await page.evaluate(() => { const m = document.querySelector('.plx-chat__message:not(.plx-chat__message--mine)'), a = m.querySelector('.plx-chat__avatar').getBoundingClientRect(), b = m.querySelector('.plx-chat__bubble').getBoundingClientRect(); return (a.left + a.width / 2) > (b.left + b.width / 2); });
    assert.ok(side, 'in right to left, their avatar is on the end (right) half of the bubble');
    // the spec page: every part, the rules, the slice 4 place. Only where the design system is checked out: the CI browser
    // jobs never check it out (and the automatic runs keep off the spec, owner 2026-10-25), so there it is a visible skip,
    // never a failure (issue 777, as #762 did for the release tests)
    // the automatic runs never open the spec (owner, 2026-10-25): it loads Plenix from the live CDN, so CI timed out on it
    // (#1327); an on-demand run sets PLENIX_SPEC=1
    const specOff = process.env.PLENIX_SPEC !== '1' ? 'the automatic runs never open the spec (set PLENIX_SPEC=1 to run it)'
      : !require('fs').existsSync(require('path').join(__dirname, '..', 'platform', 'design-system', 'index.html'))
        ? 'design system not available (platform/design-system is not checked out)' : '';
    if (specOff) {
      const why = 'the spec page part skipped: ' + specOff;
      console.log('MESSAGES_CHAT_S6_SPEC_SKIPPED ' + why);
      if (process.env.GITHUB_ACTIONS) console.log('::warning title=messages-chat-s6 spec part skipped::' + why);
    } else {
    await page.goto('http://localhost:' + PORT + '/Plenix/platform/design-system/index.html#/specialized/typing-indicator', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 3000));
    const spec = await page.evaluate(() => ({ groups: document.querySelectorAll('.plx-chat__group').length, voice: document.querySelectorAll('.plx-chat__voice').length, media: document.querySelectorAll('.plx-chat__media').length,
      dividers: document.querySelectorAll('.plx-chat__divider').length, text: document.body.textContent }));
    assert.ok(spec.groups >= 1 && spec.voice >= 1 && spec.media >= 1 && spec.dividers >= 1, 'the spec page draws a run, a date line, attachments and a voice message (the old page: none)');
    assert.ok(/Ratings, review stars/.test(spec.text), 'the owner\'s "no ratings" rule is in the avoid list');
    assert.ok(/crossing the border/.test(spec.text), 'the avatar rule is in the avoid list');
    assert.ok(/Slice 4: not on this page yet/.test(spec.text), 'the slice 4 place is marked');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('messages-chat-s6: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
