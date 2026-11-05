# ADR 0014: `plx-sys.control-raised-shadow`, one light elevation for raised buttons

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), on the CTM owner's report (CTM#115: "Reduce glow and shadow and make buttons look consistent") and #6 (a very subtle glow, a light shadow)
- **Issue:** #269 (S1). PR #324.

## Context

- Every raised Button (secondary, tertiary, primary, danger) used `plx-comp.card-elevation-halo-shadow`, Card's own token. That's a cross-component reference, two `token-tiers` baseline findings (ADR 0002).
- `danger-secondary` (Delete) had no elevation, so it looked flat beside the others.
- The owner asked for less shadow and the same look on every button.

## Options

| Option | For | Against |
|---|---|---|
| **A. A new system role `control-raised-shadow` (the Halo without its darkest layer, a 2px blur), read by every raised Button** | One elevation for every raised control; a step lighter than Card; no cross-component token; existing palette alphas only | One more shadow role |
| B. Keep pointing Button at Card's Halo | No new token | Heavier than asked; Button depends on Card |
| C. No resting shadow (the shadow on hover only) | Lightest | Not what the owner's words ask (consistent, reduced, not removed); see #320 / #318 |

## Decision

**Option A.**

| Token | Light | Dark |
|---|---|---|
| `plx-sys.control-raised-shadow` | `0 0 1px {plx-ref.color-black-alpha-14}, 0 0 2px {plx-ref.color-black-alpha-12}` | `0 0 1px {plx-ref.color-black}, 0 0 2px {plx-ref.color-black}` (as every dark shadow) |

- It lives in both theme files, `webOnly` (a shadow list).
- `plx-comp.button-raised-rest-shadow` and `-hover-shadow` point to it. The two baseline findings are fixed.
- The glows go 75% -> 90% (value edits).

## Consequences

- **Semver: MINOR.** One token added; *Changed (visual)*: buttons are lighter and consistent, and Delete is raised like the others.
- No new colors.

## Enforced by

- Check 6 `token-tiers` (comp -> sys only; the two baseline lines removed), check 7, `token-sets` (light and dark define it).
