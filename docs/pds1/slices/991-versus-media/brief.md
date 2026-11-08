# 991: EntityHeader "versus" media: two people instead of the entity icon

Source: plenix-ds/pds#991, the CTM owner (2026-11-07), relayed by ctm3-product-lead. Decision: D-0119.

## Goal

- A case between two parties shows both people's photos, with "vs." between them, where the entity icon sits today. Initials are shown when a person has no photo.

## Already implemented

- `platform/patterns/EntityHeader/EntityHeader.tsx` `Media()`: `media` takes `{ person, src, color, gender }` (one Avatar), `{ icon, hue, box }`, or an element. Sizes come from the layout (`top-small` 44px, `top-large` 72px, the column and edge layouts) and the size tokens `entity-header-media-size-*`.
- `Avatar` (`platform/components/Avatar/`) draws the photo, or initials in the avatar colors when there is no `src`.
- `AvatarGroup` overlaps avatars with a surface ring.

## P0

- `media: { versus: [{ name, src, color }, { name, src, color }] }` (D-0119): two Avatars, side by side, with a "vs." mark between, inside the same media box as today. The box is the same height as the single media in each layout.
- Initials when `src` is missing; never the generic person icon when a name is known.
- The "vs." word comes from `strings.versus` (default "vs."). Accessible name of the media: "<name> versus <name>" from `strings.versusLabel`. The media is `aria-hidden` when the title already names both parties, through `media.decorative: true`.
- RTL: the order follows the reading direction (logical layout; the first party sits at the inline start).
- The Arabic word goes through the i18n Engineer and the owner (D-0012). Until he approves, `ar` falls back to English.

## P1

- The streamlined style and the `kind="section"` size (32px avatars).
- A docs example: "Michael Bennett vs. Charlotte Bennett" (fictional).

## P2

- A compact size for lists, if a list pattern asks for it.

## Non-goals

- No change to the title. The app writes "A vs. B".
- No more than two parties.
- No new colors. The avatar colors and the existing radius tokens only.
- The `edge` and `column-large` stretched layouts show the pair at the small size, centered at the top. No stretched pair.

## Affected packages

- `@plenix-ds/react` (EntityHeader), `@plenix-ds/styles` (entity-header.css), `@plenix-ds/tokens` (comp `entity-header-versus-*` gap and mark tokens over existing sys tokens; G3).

## Acceptance

- **AC-1:** Given `media: { versus: [{ name: "Michael Bennett", src }, { name: "Charlotte Bennett" }] }`, when the header renders, then it shows the first photo, "vs.", then the initials "CB", and no entity icon.
- **AC-2:** Given the `top-small` layout, when it renders, then the versus media is the same height as a single 44px media.
- **AC-3:** Given no `decorative`, then the media has the accessible name "Michael Bennett versus Charlotte Bennett". Given `decorative: true`, then it is `aria-hidden`.
- **AC-4:** Given `dir="rtl"`, then the first party sits at the inline start (the right) and the mark stays between.
- **AC-5:** Given `strings: { versus: "x" }`, then the mark reads "x".
- **AC-6:** Given `media.versus` with one entry or more than two, then the header renders the first entry as a single Avatar (no crash) and warns in development.

## Anything unclear

| Question | Answer |
|---|---|
| The prop's shape | Answered: D-0119 (`media.versus`). |
| The Arabic word for "vs." | Proposed by the i18n Engineer to the owner (D-0012). English is the fallback until then. It does not block G1. |
