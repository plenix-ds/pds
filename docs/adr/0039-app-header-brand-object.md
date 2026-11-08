# ADR 0039: AppHeader "brand" as an object (logo, organization, application)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's "canonical, not patches" rule (2026-11-08). Decision D-0125 (owner may switch).
- **Issue:** #997 (S2). Brief: `docs/pds1/slices/997-app-header-brand/brief.md`.

## Context

- `AppHeader.brand?: React.ReactNode` replaces the whole header name. The default is `<BrandMark />`, then "Plenix" (`plx-app-header__product`) over the application name (`plx-app-header__app`), inside `plx-app-header__name`.
- CTM wants its own logo, organization and application in that layout. It hand-builds the markup with Plenix's internal classes.
- The brand mark's size is a context value, `--plx-comp-brand-mark-context-size`, set on `.plx-app-header__brand`.

## Options

| Option | For | Against |
|---|---|---|
| **A. `brand` also takes an object `{ logo?, organization, application? }`** | One prop, same slot. An element keeps working. The layout and tokens are the default's. | A union type. |
| B. New props `logo`, `organization` and `application` beside `brand` | Flat | Four props that interact (which wins when `brand` is also set?). |

## Decision

**Option A** (D-0125; reply B on #997 to switch).

- **Type:** `brand?: React.ReactNode | AppHeaderBrand`, with `AppHeaderBrand` exported as a type:
  - `logo?: { src: string; alt?: string; width?: number; height?: number } | React.ReactElement`;
  - `organization: string`;
  - `application?: string`.
  - It is told apart from an element by `React.isValidElement`, and from a string because it is an object.
- **Drawing:** the default's markup and classes, with the logo in the mark's slot.
  - The logo is `<img class="plx-app-header__logo" src alt>` or the element, at `block-size: var(--plx-comp-brand-mark-context-size)` with the inline size auto. `width` and `height` are only intrinsic hints, against layout shift.
  - `alt` defaults to `""`: the organization name is next to it.
  - With no `logo`, there is no mark.
  - `organization` goes in `plx-app-header__product`, and `application` in `plx-app-header__app`. `application` defaults to the computed name (`appName`, or the current app's label).
- **With `brandHref`:** the whole brand is one link, as today. **With the switcher:** the object is drawn as the trigger. The trigger's accessible name uses `strings.switchApp` with `{app}` = "<organization> <application>".
- **An element or string `brand`:** unchanged.
- **RTL:** normal flow: the logo at the inline start. The words are the app's own (EN and AR from its catalog).
- **New class:** `plx-app-header__logo`. **Tokens:** none. The size comes from the existing brand-mark context size, and the text from the default's tokens.

## Consequences

- **Semver: MINOR** (*Added*: the object form of `brand` and of `AppHeader.Switcher brand`, the `AppHeaderBrand` type and one class).
- **The internal classes stay internal:** `plx-app-header__name`, `__product` and `__app` are not public API for apps to write. CTM's two hand-built brands move to the object, and no CTM file names a `plx-app-header__*` class (the brief's done-when).

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- The build PR's tests (the brief's AC-1..4):
  - the object renders the default's markup and classes, with the logo in the mark's place;
  - the element form is unchanged;
  - with `brandHref`, it is one link;
  - in RTL, the logo is at the inline start.
