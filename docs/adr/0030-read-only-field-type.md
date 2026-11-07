# ADR 0030: Read-only field type roles and spacing (`text-field-label`, `text-field-value`, `space-stack-field`)

- **Status:** superseded by 0032 (values; names, the `layout` API and the 2.0.0 default flip stay)
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on G2's design (#946, PR #950, D-0101). Decision D-0103 (owner may switch).
- **Issue:** #946 (S2)

## Context

- **G2's design (D-0101):**
  - Label: 12px semibold, `content-muted`, 16px line.
  - Stacked value: 15px regular, `content-default`, 24px line.
  - 4px within a pair and 20px between pairs, at every density.
  - Columns value: the body role (13px).
- **Existing sys roles match the sizes and weights, not the lines.**
  - `text-label` gives 12px semibold, but its line is 1.5, which is 18px.
  - `text-lead` gives 15px regular, but its line is 1.7, which is 25.5px and off the 4px grid.
  - Changing those roles would change every label and lead in the system.
- **Spacing:** the sys stack scale is 4, 8, 12, 16, 24 and 32px. There is no 20px role, and a comp token can't use `plx-ref.space-5u` directly (check 6: no comp -> ref).
- **The default layout:** `PropertyList`'s `layout` defaults to `"columns"`. G2 makes stacked the default. VERSIONING.md: a changed default that changes existing screens' layout is **MAJOR**.
- **The variant's name:** G2 calls C "inline". The prop value is `"columns"` today, and renaming it is also MAJOR.

## Options

| Option | For | Against |
|---|---|---|
| **A. Two new sys type roles and one sys stack role, named by purpose; layout names and default unchanged in 1.x; stacked becomes the default in 2.0.0** | G2's values exactly, on the grid. No existing role changes. No breaking change in 1.x. | Three new public CSS custom property groups. Apps get B by setting `layout="stacked"` until 2.0.0. |
| B. Change `text-label` and `text-lead` line heights | No new tokens | Changes every label and lead in the system (MAJOR in effect). |
| C. Flip the default to stacked now | G2's default today | MAJOR under VERSIONING.md, right after 1.0.0. |

## Decision

**Option A** (D-0103; reply B or C on #946 to switch).

- **New sys tokens** (`platform/tokens/semantic/typography.tokens.json`, `semantic.tokens.json`). The names carry no values.
  - `plx-sys.text-field-label-*`: family `font-label`, size `font-size-100`, weight `font-weight-semibold`, line `size-4u`, and normal letter and word spacing.
  - `plx-sys.text-field-value-*`: family `font-body`, size `font-size-400`, weight `font-weight-regular`, line `size-6u`, and normal letter and word spacing.
  - `plx-sys.space-stack-field` = `plx-ref.space-5u`, with no density overrides ("at every density").
- **Comp tokens** (the build PR, comp -> sys only):
  - PropertyList and the read-only Field label take `text-field-label-*`, ink `content-muted`.
  - The stacked value takes `text-field-value-*`.
  - The columns value takes `text-body-*`.
  - The gap within a pair stays `space-stack-xs`. The gap between stacked pairs is `space-stack-field`.
  - Existing PropertyList comp tokens that point at `plx-ref` move to sys.
- **API:** `PropertyList layout` stays `"columns" | "stacked"`, default `"columns"`.
  - C is `"columns"` with hairlines. No `"inline"` value.
  - DESIGN.md calls stacked the **recommended** layout for read-only views now, and the default from 2.0.0.
  - The 2.0.0 flip is listed under *Planned breaking changes* with a deprecation note in 1.x: the docs and a changelog *Deprecated* entry ("the default layout becomes stacked in 2.0.0; set `layout` to keep columns").
- **Data values** (`data`) keep the Mono switch at the role's size and line.

## Consequences

- **Semver: MINOR.** New sys tokens, and a visual change of PropertyList and read-only Field type within their roles (*Changed*). One *Deprecated* entry for the coming default.
- CTM gets B now by setting `layout="stacked"` where it wants it. Its case summary does.

## Check

- Check 6 (no comp -> ref) and check 7 (no values in names) on the build PR.
- The visual check at 1366 and 1920 (D-0092), before and after, on #946.
- A behaviour or style test on the build PR: a stacked PropertyList's label computes to 12px/600/16px, its value to 15px/400/24px, and the pairs are 20px apart at compact, standard and comfortable density.

## Amendment, 2026-11-07 (D-0106, D-0107)

- The owner's preset (D-0106) replaces the values above. The role and token names stay.
  - `text-field-label-*`: 11px / 400 / 16px, in navy. It is D-0106's only type-floor exception.
  - `text-field-value-*`: 13px / 600 / 20px.
  - `space-stack-field`: 16px.
- New pieces: tiles on `stacked`, `PropertyGroup`, `columnCount` and the Panel header glow and inset divider.
- The default layout stays `columns` until 2.0.0 (D-0107).
- Design and values: `docs/pds1/slices/946/design.md`. Token names and the new porcelain refs are G3's.
- The test in "Check" reads the new values: 11px/400/16px and 13px/600/20px, with tiles 16px apart.
