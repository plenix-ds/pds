# 997: AppHeader organization brand as props

Source: plenix-ds/pds#997, found checking CTM (owner, 2026-11-08, D-0121). Part of 1.2.0 (#1001).

## Goal

- An app shows its own logo, organization name and application name in the AppHeader, laid out exactly like the Plenix default, without touching Plenix's internal classes.

## Already implemented

- `platform/patterns/AppHeader/AppHeader.tsx`: `appName`, `brand` (any element, replaces the whole name), `brandHref`; the default is `<BrandMark />` plus `plx-app-header__name` / `__product` ("Plenix") / `__app`.
- CTM hand-builds that markup: CTM `static/ctm/app.js` ~1551, `static/ctm/external-report.js` ~230.

## P0

- `brand` also takes an object `{ logo: { src, alt, width, height } | element, organization, application }`, rendered with the default layout and tokens. The logo sits in the BrandMark slot, the organization in the `product` line and the application in the `app` line.
- `brand` as an element keeps working (no breaking change).
- It works with `brandHref` and with `AppHeader.Switcher brand`.

## P1

- A docs example with a fictional organization.

## P2

- None.

## Non-goals

- No new sizes or colors. No logo upload or resizing.

## Affected packages

- `@plenix-ds/react` (AppHeader), types.

## Acceptance

- **AC-1:** Given `brand={{ logo: { src, alt: "" }, organization: "Org", application: "App" }}`, when it renders, then the markup and classes equal the default's, with the logo in place of the Plenix mark and the two lines reading "Org" and "App".
- **AC-2:** Given `brand` as an element, then the output is unchanged from today.
- **AC-3:** Given `brandHref` and the object brand, then the whole brand is one link.
- **AC-4:** Given `dir="rtl"`, then the logo sits at the inline start and the text follows.

## Anything unclear

| Question | Answer |
|---|---|
| — | None. |
