#!/usr/bin/env node
// Self-test of deploy/agents/asks.mjs (#1130): a mention of a stopped role is held for it, not dropped; the role counts
// as owed (started, and never idled out) until it answers on that item or 24 hours pass.
//   node tools/ci/asks.test.mjs        (CI: the Process checks job)
import { hold, take, answer, prune, owed, MAX_AGE_S } from '../../deploy/agents/asks.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`}`);
};
const now = 1_000_000;
const line = 'you are named in a comment on PR #1126 "Long text" https://github.com/plenix-ds/pds/pull/1126';

// the #1130 fixture: the Design Director's session was stopped, then a comment named it on PR #1126
const asks = {};
hold(asks, 'design-director', { number: 1126, line, mention: true, delivered: false }, now);
check('a mention of a stopped role is held, not dropped', take(asks, 'design-director'), [line]);
check('held lines are handed over once', take(asks, 'design-director'), []);
check('the role stays owed until it answers', [...owed(asks, now + 60)], ['design-director']);
answer(asks, 'design-director', 1126);
check('a signed comment by the role on that item answers it', [...owed(asks, now + 120)], []);

const b = {};
hold(b, 'qa-engineer', { number: 7, line: 'issue labeled agent:pds1-qa-engineer #7', mention: false, delivered: false }, now);
check('a held event that is not a mention is delivered, then not owed', [take(b, 'qa-engineer').length, [...owed(b, now)].length], [1, 0]);
hold(b, 'i18n-engineer', { number: 9, line: 'named on #9', mention: true, delivered: true }, now);
hold(b, 'i18n-engineer', { number: 9, line: 'named on #9', mention: true, delivered: true }, now + 5);
check('the same line on the same item is held once', b['i18n-engineer'].length, 1);
check('an answer on another item leaves the ask open', (answer(b, 'i18n-engineer', 10), [...owed(b, now)]), ['i18n-engineer']);
prune(b, now + MAX_AGE_S + 1);
check('asks older than 24 hours lapse (the nudge covers the rest)', [...owed(b, now + MAX_AGE_S + 1)], []);
check('a role with nothing held takes nothing', take({}, 'ds-architect'), []);

if (failed) { console.log(`${failed} failed`); process.exit(1); }
console.log('asks: all passed');
