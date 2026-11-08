# ADR 0037: EntityHeader media "versus" (two people instead of the entity icon)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the CTM owner's request (2026-11-07). Decision D-0119, recorded by pds1-product-lead (option A; the owner may switch).
- **Issue:** #991 (S2)

## Context

- CTM's case headers read "A vs. B". The owner wants the two people's photos where the entity icon sits.
- `EntityHeaderMedia` today is one of:
  - `{ person, src, color, gender }` (one Avatar);
  - `{ icon, hue, box }` (an icon);
  - an element;
  - `null`.
- The structured and the streamlined header both read it.
- The page media is 44px square (32px in a section). The single person Avatar is `xl` (`md` in a section).

## Options

| Option | For | Against |
|---|---|---|
| **A. A new member of the `media` union: `{ versus: [Party, Party], decorative? }`** | One prop, same place, same box. Both header styles get it. Reuses Avatar. | One more union member. |
| B. A separate `parties` prop beside `media` | Explicit | Two props that can conflict (both set). |

## Decision

**Option A** (D-0119).

- **Type:** `EntityHeaderMedia` gains `{ versus: [EntityHeaderParty, EntityHeaderParty]; decorative?: boolean }`.
  - `EntityHeaderParty = { name: string; src?: string; color?: string }` is exported as a type.
  - `name` is required, so there's always initials, never a generic person icon.
  - `color` is the Avatar's data hue.
- **Drawing:** in the media's box and height, the first party's Avatar, then a "vs." mark, then the second party's Avatar.
  - The order follows the inline direction, so it mirrors in RTL.
  - If the two Avatars overlap, each is ringed with the presence dot's ring (`avatar-presence-ring-*`).
  - Picture first, initials when there is no `src` (Avatar's rule).
  - G2 sets the Avatar size per kind (page and section) and whether they overlap. The media's height doesn't change. Its width grows to fit the pair.
- **Layouts:** every `layout` takes it. Stretched layouts (`column-large`, `edge`) centre the pair in the media area at the same size.
- **Accessibility:**
  - Default: the pair is one image (`role="img"`), named by `strings.versus` ("{a} versus {b}"). The Avatars and the mark are hidden inside it.
  - `decorative: true` hides the whole pair (`aria-hidden`), for a title that already says it.
- **Strings (new, `entityHeader` namespace):**
  - `vs`: "vs.", the visible mark.
  - `versus`: "{a} versus {b}", the accessible name. It is one string with placeholders, because the word order differs in Arabic.
  - @pds1-i18n-engineer proposes the Arabic (the request suggests "ضد"). D-0012 applies.
- **Classes:** `plx-entity-header__media--versus`, `plx-entity-header__party` and `plx-entity-header__versus-mark`.
- **Comp tokens** (comp -> sys only; values from G2):
  - `entity-header-versus-gap`;
  - `entity-header-versus-mark-text` (a muted ink role);
  - `entity-header-versus-mark-font-*` (a type role);
  - `entity-header-versus-overlap` (a space role; 0 when they don't overlap).
  - The ring reads the Avatar presence ring tokens. There are no copies.

## Consequences

- **Semver: MINOR** (*Added*: the union member, the `EntityHeaderParty` type, the classes, the tokens and two strings). Other media are unchanged.
- CTM puts `media={{ versus: [a, b], decorative: true }}` on every case header. Its title already says "A vs. B".

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7 on `entity-header-versus-*`.
- G6: `entityHeader.vs` and `entityHeader.versus` are in `en.json`, and in `ar.js` after approval.
- The build PR's behavior tests:
  - the accessible name is "A versus B", or hidden with `decorative`;
  - initials show without `src`, and never a person icon;
  - the order mirrors in RTL;
  - the media height equals the single media's, per kind.
