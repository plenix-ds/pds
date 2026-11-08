# ADR 0033: PropertyGroup carries the read-only group heading

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on the owner's preset (D-0106) and the section-heading rule (D-0110). Decision D-0111 (owner may switch).
- **Issue:** #946 (S1)
- **Builds on:** ADR 0032 (the tokens). ADR 0032 named `PropertyGroup` and left its API to this entry.

## Context

- D-0106 asks for a group heading over each group of read-only fields: 13px medium, gold, sentence case, 40px above each group.
- The tokens exist (ADR 0032): `text-group-heading-*`, `read-only-group-heading` and `space-stack-group`.
- `SectionHeading` is now the page section heading. It takes the card heading's style: 14px bold, UPPERCASE, `content-default` (D-0110). It also sets no outer margin by contract.
- A heading is not valid content inside a `<dl>`, so `PropertyList` can't hold one.

## Options

| Option | For | Against |
|---|---|---|
| **A. A new export `PropertyGroup`: a `<section>` with its heading, wrapping one `PropertyList`** | Valid HTML. The 40px gap lives where the groups are. The heading and its list are one landmark (`aria-labelledby`). Purely additive. | One more export. |
| B. A `heading` prop on `PropertyList` | No new export | It renders outside the `<dl>`, so the list's root element and its `...rest` target change. Also, no part owns the gap between groups. |
| C. A `SectionHeading` variant | Reuses a heading | Contradicts D-0110: one component, two opposite styles (UPPERCASE bold ink vs sentence-case medium gold). It also breaks the no-outer-margin contract. |

## Decision

**Option A** (D-0111; reply B or C on #946 to switch).

- **Export:** `PropertyGroup` from `@plenix-ds/react` (`platform/patterns/PropertyGroup/PropertyGroup.tsx`), with the public type `PropertyGroupProps`.
- **Props:**
  - `heading: React.ReactNode` (required): the group's name, in sentence case.
  - `level?: 2 | 3 | 4 | 5 | 6`: the heading level, default `3`. Choose it from the outline. It never changes the size.
  - `className?: string`, and `...rest` on the `<section>`.
  - `children`: one `PropertyList`.
- **Markup:** `<section class="plx-property-group" aria-labelledby={id}>`, then `<hN id={id} class="plx-property-group__heading">` (id from `useId`), then the children.
- **CSS classes:** `plx-property-group` and `plx-property-group__heading`.
- **Comp tokens** (comp -> sys only):
  - `property-group-heading-text` -> `{plx-sys.read-only-group-heading}`.
  - `property-group-heading-font-family`, `-font-size`, `-font-weight`, `-line-height` and `-letter-spacing` -> `{plx-sys.text-group-heading-*}`.
  - `property-group-gap` -> `{plx-sys.space-stack-group}`: `margin-block-start` on `.plx-property-group + .plx-property-group`. The first group sets no outer margin.
  - `property-group-heading-gap` -> `{plx-sys.space-stack-field}`: between the heading and its list.
- **Text:** sentence case. No `text-transform`, and Arabic keeps tracking 0.
- **Not in scope:** `SectionHeading` keeps its API. Its D-0110 restyle is CE1's half of #946.

## Consequences

- **Semver: MINOR** (*Added*: the `PropertyGroup` export, its two classes and its eight comp tokens). Nothing is removed or renamed.
- CTM wraps each read-only group in `PropertyGroup` and drops its own group heading.

## Enforced by

- G3 on the build PR: the API diff (the export, the props and the classes) matches this ADR.
- Check 6 (`token-tiers`): no `property-group-*` token reads `plx-ref`. Check 7 (`token-names`): no values in the names.
- Check 8 (`contrast-matrix`): `read-only-group-heading` on `surface-raised` and `surface-default`, at 4.5:1 or more, light and dark (the `surface-raised` pair landed in #972).
- The build PR's behavior test: the heading's computed type equals `text-group-heading-*`, the color is `read-only-group-heading`, the gap between two groups is 40px, and the section is named by its heading.
