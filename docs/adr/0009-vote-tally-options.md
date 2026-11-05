# ADR 0009: VoteTally custom choice sets (`options`)

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), on D-0042 (pds1-product-lead) and the brief `docs/pds1/slices/265-vote-choices/brief.md`
- **Issue:** #265 (CTM 3.0 PLX-009: hearing attendance)

## Context

- `VoteTally` (since 0.74.0) has three fixed choices: approve, deny, abstain. `settings.labels` renames them, but nothing changes the set.
- CTM needs Present / Absent per member with live totals. D-0042 chose an optional prop on VoteTally over a new component.
- The totals row draws Badges, and Badge tones aren't Button tones (`danger` in Button is `negative` in Badge).
- The kit's `outcome` has top-level fields `approve`, `deny`, `abstain`, `notVoted`, `turnedOff`, `present`, `quorum`, `result`. A custom key such as `present` would collide with them.

## Options

| Option | For | Against |
|---|---|---|
| **A. `options` prop; custom counts in `outcome.counts`; Button tone mapped to Badge tone** | One part; no key collisions; today's output unchanged without the prop | Two count shapes (top-level for the default set, `counts` for custom) |
| B. Custom counts at the top level of `outcome` | One shape | `present`, `result`, `quorum` … can't be option keys; silent clashes |
| C. A free Badge tone per option | More colors | Two tone vocabularies per option; against the "Button tones only" non-goal |

## Decision

**Option A.**

**Props (all additions, all optional):**

```ts
type VoteTallyOption = {
  key: string;                          // unique, non-empty; the value of members[].vote
  label: string;                        // the button's name and tooltip, and the totals word (from the catalog or the app)
  icon: IconValue;                      // an imported icon module (recommended) or a Plenix icon name, as Badge
  tone: 'success' | 'danger' | 'neutral'; // a Button tone
};
options?: VoteTallyOption[];            // 2 to 5; default: approve (check, success), deny (close, danger), abstain (remove, neutral)
members[].vote: string | null;          // a key of options (was "approve" | "deny" | "abstain" | null)
outcome?.counts?: Record<string, number>; // P2: a count per option key, from the kit or the app
```

- **Tone in the totals:** Button `success` -> Badge `success`, `danger` -> `negative`, `neutral` -> `neutral`. This is the mapping the default set already uses.
- **Totals with `options`:** one Badge per option (`label count`, its icon and mapped tone), in `options` order, then **Not recorded** (`waiting`, schedule icon) and the turned-off count as today. With no `outcome`, the part counts the keys itself. Quorum and result appear only when `outcome` has them.
- **Without `options`:** byte-for-byte today's behavior and output (AC-1). `settings.labels` still renames the three default choices. It doesn't apply to custom options, whose `label` is already the word.
- **Validation (development warning, then the default set):** fewer than 2 or more than 5 entries, a duplicate or empty `key`, or a missing `label`, `icon` or `tone` (AC-5). A `members[].vote` that isn't a key counts as not recorded, with a warning.
- **Words:**
  - New catalog key `voteTally.notRecorded` (EN "Not recorded"). It's used only when `options` is set; the default set keeps "Not voted".
  - The Arabic is proposed by pds1-i18n-engineer on an issue and approved by the owner (D-0012). Until then the catalog has no `ar` entry, and the English shows.
  - The group name stays `voteOf` ("Vote of {name}"). An attendance app passes `strings={{ voteOf: 'Attendance of {name}' }}`.
- **Behavior is unchanged:** toggle groups, `onVote(memberId, key | null)`, `changeVote: "final"`, read-only states, the live region, the row flash, RTL (logical properties only).
- **Types:** VoteTally is still `.jsx`, so its header's `Props:` block (read by `build-types.js`) gains `options`, `VoteTallyOption` and `outcome.counts`. The TypeScript conversion happens when the component is next rebuilt.

## Consequences

- **Semver: MINOR.** One optional prop, one widened prop type, one optional `outcome` field, one catalog key. Nothing is removed or renamed.
- No new tokens: the totals row already wraps, so 5 counts fit (the brief's styles note isn't needed). If the visual check shows otherwise, a token follows with its own ADR.
- The vote kit's counting rules don't change. Counting custom sets in the kit (P2) is the kit's own change.

## Enforced by

- G3 review of the build PR: the props match this ADR (the `build-types.js` output diff).
- Behavior tests for AC-1 to AC-5 (plan §7e) in the build PR.
- Locale checks: `voteTally.notRecorded` in `en.js`; no unapproved Arabic (`planned:locale-unapproved-ar`).
