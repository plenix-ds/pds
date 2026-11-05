# Brief: VoteTally custom choice sets (#265, split from #88)

Owner: pds1-product-lead. API: pds1-ds-architect (G3). Build: pds1-component-engineer. Decision: D-0042.

## Goal

An app can use the same member list as the vote for other per-member choices, starting with hearing attendance (Present / Absent). The totals stay live, and the app writes no CSS of its own.

## Known, inferred, unknown

| | What |
|---|---|
| Known | `VoteTally` has been in Plenix since 0.74.0 and is in 0.86.0 (`platform/components/VoteTally/VoteTally.jsx`). Its choices are fixed: approve, deny, abstain (labels can change through `settings.labels`). CTM 3.0 (PLX-009) needs Present / Absent per member, with totals, for hearings. Until then it uses `Table` + `ButtonGroup` + `Badge`. |
| Inferred | Attendance needs no quorum or result, just the counts per choice and "not recorded". |
| Unknown | None that blocks the build. |

## P0

- A new optional `options` prop: 2 to 5 choices, each `{ key, label, icon, tone }`, where `tone` is one of the Button tones. Without it, VoteTally keeps today's Approve / Deny / Abstain, so there's no change for current users.
- `members[].vote` takes any key from `options`. The totals row shows one count per option, plus "Not recorded".
- Every label comes from the catalog or the app. English and Arabic for any new default words, which need the owner's approval (D-0012).

## P1

- An attendance example in the docs and Storybook: Present (success, check icon) and Absent (danger, close icon).

## P2

- Per-option counts in `outcome`, so the vote kit can count custom sets.

## Non-goals

- No change to the vote kit's counting rules, quorum or majority.
- No new component (option B of D-0042).
- No new colors. Tones are the existing Button tones only.

## Affected packages

`@plenix-ds/react` (VoteTally props: a minor version). `@plenix-ds/styles` only if the totals row needs a token for more than 3 counts.

## Acceptance

- **AC-1** Given VoteTally with no `options`, when it renders, then it matches today's Approve / Deny / Abstain output (the visual check shows no change).
- **AC-2** Given `options` Present and Absent and 5 members, when 3 are Present and 1 is Absent, then each row shows two toggle buttons, and the totals read Present 3, Absent 1, Not recorded 1.
- **AC-3** Given a row with Present chosen, when Present is pressed again, then `onVote(memberId, null)` fires (unless `changeVote` is "final").
- **AC-4** Given `dir="rtl"`, when attendance renders, then the rows and totals mirror, with no physical left or right in the CSS.
- **AC-5** Given `options` with 1 or 6 entries, when it renders, then a development warning names the 2-to-5 limit, and the default set is used.

## Already implemented

`platform/components/VoteTally/VoteTally.jsx` (the list, toggle groups, the totals live region, turned-off members) and `vote-kit/` (schema, counting, contract).

## Anything unclear

None open.
