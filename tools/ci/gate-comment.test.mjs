#!/usr/bin/env node
// Self-test of tools/ci/gate-comment.mjs (#1071, part of #1068): the first line of a gate role's signed PR comment sets
// or clears its changes-requested label. "G3: FAIL" adds g3-changes-requested, "G3: PASS" removes it; an unsigned or
// other-role comment does nothing.
//   node tools/ci/gate-comment.test.mjs        (CI: the G2 job, before the check itself)
import { decide } from './gate-comment.mjs';

const DSA = '\n\n— PDS1-DS-Architect';
const DD = '\n\n— PDS1-Design-Director';
const G3L = 'g3-changes-requested';
const G2L = 'g2-changes-requested';

// [name, body, labels on the PR, wanted action or null]
const cases = [
  ['G3 FAIL signed by the DS Architect adds the label', `G3: FAIL (REQUEST CHANGES)\n\nThe prop is named wrong.${DSA}`, [], { add: G3L }],
  ['G3 PASS signed by the DS Architect removes the label', `G3: PASS${DSA}`, [G3L], { remove: G3L }],
  ['unsigned G3 FAIL does nothing', 'G3: FAIL (REQUEST CHANGES)\n\nThe prop is named wrong.', [], null],
  ['G3 FAIL signed by another role does nothing', `G3: FAIL${DD}`, [], null],
  ['G3 FAIL signed by a Component Engineer does nothing', 'G3: FAIL\n\n— PDS1-Component-Engineer-1', [], null],
  ['G2 FAIL signed by the Design Director adds the G2 label', `G2: FAIL\n\nCorners are 8px.${DD}`, [], { add: G2L }],
  ['G2 PASS signed by the Design Director removes the G2 label', `G2: PASS, conforms to DESIGN.md.${DD}`, [G2L], { remove: G2L }],
  ['G2 FAIL signed by the DS Architect does nothing', `G2: FAIL${DSA}`, [], null],
  ['bold first line counts', `**G3: FAIL** (REQUEST CHANGES)${DSA}`, [], { add: G3L }],
  ['heading first line counts', `### G3: FAIL${DSA}`, [], { add: G3L }],
  ['REQUEST CHANGES counts as FAIL', `G3: REQUEST CHANGES${DSA}`, [], { add: G3L }],
  ['a quoted verdict does nothing', `> G3: FAIL${DSA}`, [], null],
  ['leading blank lines are skipped', `\n\nG3: FAIL${DSA}`, [], { add: G3L }],
  ['a verdict that is not on the first line does nothing', `Thanks for the update.\nG3: FAIL${DSA}`, [], null],
  ['a quoted signature followed by another role does nothing', `G3: FAIL\n> — PDS1-DS-Architect\n\n— PDS1-Component-Engineer-1`, [], null],
  ['FAIL with the label already on: nothing to do', `G3: FAIL${DSA}`, [G3L], null],
  ['PASS with no label on: nothing to do', `G3: PASS${DSA}`, [], null],
  ['PASS removes only its own gate label', `G3: PASS${DSA}`, [G2L, G3L], { remove: G3L }],
  ['lowercase verdict does nothing', `G3: fail${DSA}`, [], null],
  ['G4 is not a label gate', 'G4: FAIL\n\n— PDS1-Delivery-Lead', [], null],
  ['empty body does nothing', '', [], null],
];

let failed = 0;
for (const [name, body, labels, want] of cases) {
  const got = decide(body, labels);
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
}
console.log(failed ? `GATE_COMMENT_TEST_FAIL (${failed})` : `GATE_COMMENT_TEST_OK (${cases.length})`);
process.exit(failed ? 1 : 0);
