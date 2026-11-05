# ADR 0006: Logical utilities, and style checks 1, 4 and 5

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (#189, plan §7 checks 1, 4, 5)

## Context

Plan §7, measured on main (Stylelint over `platform/**/*.css` and `services/**/*.css`):

- **Check 1** (no hex, rgb or named colors): hex and color functions were already errors. Named colors weren't checked (0 in use).
- **Check 4** (no physical left/right anywhere, utilities included): `plenix/logical-properties` ran only on components, patterns and templates. Outside them, 80 findings, all in `platform/system/utilities.css` (69 classes), and 8 in the design spec's labs.
- **Check 5** (no `transition: all`; durations from motion tokens): raw durations were already errors. `transition: all` wasn't checked (1 in use: `plx-u-transition-all`, already deprecated). The reduced-motion guard is in the token set `reference.reduced-motion` (durations go to 0), so a duration from a token is guarded.
- Of the 69 physical utilities, 60 were already deprecated and unused (#882). 9 were in use: `mx-auto`, `p-12px`, `p-16px`, `px-32px` (symmetric) and `ml-auto`, `pl-12px`, `pl-16px` (one side), plus `left-0` and `right-0` (unused, not yet deprecated).

## Options

| Option | For | Against |
|---|---|---|
| **A. Symmetric classes switch to logical declarations; one-sided classes get logical twins and are deprecated** | No visual change in LTR; RTL becomes correct; no class removed before 2.0.0 | 3 new classes; 43 lines carry a disable comment until 2.0.0 |
| B. Rewrite the physical classes to logical in place | No new names | `ml-` would mean start, not left: a silent change of meaning for RTL pages (MAJOR by `VERSIONING.md`) |
| C. Leave utilities out of the check | No churn | Against plan §7 check 4 ("utilities included") |

## Decision

**Option A.**

- **Symmetric (27 classes, same names, same look in both directions):** `plx-u-p-*`, `plx-u-px-*`, `plx-u-mx-*` and the four-corner `plx-u-radius-*` now use `padding-inline-*`, `padding-block-*`, `margin-inline-*` and `border-{start,end}-{start,end}-radius`.
- **New logical classes (3):** `plx-u-ms-auto`, `plx-u-ps-12px`, `plx-u-ps-16px`. Their callers moved: `suite/search.jsx`, `platform/design-system/spec.js`.
- **Newly deprecated (5):** `plx-u-ml-auto`, `plx-u-pl-12px`, `plx-u-pl-16px`, `plx-u-left-0`, `plx-u-right-0`, in `platform/standards/deprecated-classes.json`. They keep working until 2.0.0.
- The 43 remaining physical declarations (all deprecated) each carry `stylelint-disable-next-line … -- deprecated physical utility (docs/adr/0006), removed in 2.0.0`. Removing them in 2.0.0 removes the comments.
- New utility names follow the existing scale suffixes (`-12px`). Renaming the utility scale (names with values) is a separate decision, together with the ADR 0002 token rename.

**Rules (`.stylelintrc.json`):**

- `plenix/logical-properties` on `^platform/(?!design-system/)`: all of the Platform. The spec's sheets are the #381 plan.
- `color-named: never`.
- `declaration-property-value-disallowed-list`: `transition` and `transition-property` may not name `all`.

## Consequences

- **Semver: MINOR.** 3 classes added, 5 deprecated, none removed. *Changed:* in RTL, the search bar's trailing item (`suite/search.jsx`) and two spec indents now sit at the start side, as RTL needs. LTR is unchanged.
- 2.0.0 removes the 65 deprecated physical utilities (60 + 5) and their disable comments.

## Enforced by

- Stylelint (CI "New problems (stylelint)"): `plenix/logical-properties`, `color-named`, `declaration-property-value-disallowed-list`.
- check-style `deprecated-classes`: no new use of a deprecated class.
