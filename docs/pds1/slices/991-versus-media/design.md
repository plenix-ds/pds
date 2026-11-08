# #991 EntityHeader "versus" media: two people instead of the entity icon (G2)

- **Request:** the CTM owner (2026-11-07): "instead of the entity icon, we put image of person vs. person (actual image of the user)". Spec: `brief.md` (G1), D-0119 (`media: { versus: [a, b], decorative }`).
- **Extends:** EntityHeader `Media()` and its media box (`.plx-entity-header__media--<kind>-<layout>`, `entity-header-[section-]media-size-*`), and `Avatar` for each party (the photo, or initials in the avatar colours). `AvatarGroup` is not used: the parties don't overlap.
- **Readings applied (D-0122, the owner may switch):**
  - **Side by side, never overlapping.** Each avatar is the full height of the media box, with the "vs." mark between them. So no ring is needed. CTM allowed overlap with a ring; side by side keeps both faces whole and the mark readable.
  - **The mark is plain text,** with no circle or tile around it (D-0024, no icon in a box).
  - **The stretched layouts** (`column-large`, `edge`) show the pair at the top-small size, at the top of the media column, centred in it (brief). The edge layout keeps its fill and its edge line.

## 1. Look

```
┌────┐       ┌────┐
│ MB │  vs.  │ CB │    ← same height as the single media (44 / 72 / 32 / 48px)
└────┘       └────┘
```

| Part | Value |
|---|---|
| Height | The layout's media size: page `top-small` and `column-small` 44px, `top-large` 72px; section 32px and 48px. Stretched layouts: 44px (page) or 32px (section) |
| Width | 2 × the height + 2 × the gap + the mark (content width). Examples: 44px → about 120px; 72px → about 176px |
| Each avatar | `Avatar` at the media size (`--plx-comp-avatar-context-size`), radius `entity-header-media-radius` (4px), the same as the single media. A photo when `src` is set; otherwise initials in the avatar colour from `color` (or the name hash) |
| Gap (avatar to mark) | `space-inline-sm` (8px) at 44px and above; `space-inline-xs` (4px) at 32px |
| Mark "vs." | **label** role (12px, 600), `content-muted`, one line, centred on the avatars' middle. At 72px: **heading** role (13px, 600). DM Sans |
| Comp tokens (G3) | `entity-header-versus-gap`, `-gap-section`, `-mark-text` (`content-muted`), `-mark-font-size`, `-mark-font-size-large`, `-mark-font-weight`. All comp → sys |

- **Contrast:** the mark is `content-muted` on the header surface: 7.11 light (gray-700 on white), 6.31 dark (gray-300 on gray-800). The initials use the existing Avatar colours, as defined.
- **Never a generic person icon when a name is known.** Avatar shows initials. The person icon appears only when `name` is empty.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default | §1 |
| hover | n/a (the media isn't interactive, as today) |
| focus | n/a (not focusable; with a name it is `role="img"`) |
| active | n/a (static) |
| disabled | n/a (nothing to disable) |
| loading (photo loading) | Avatar's existing behaviour: initials until the image loads. The box size never changes |
| error (photo fails) | Avatar's existing fallback: initials. No message |
| selected | n/a (static) |
| empty | One entry, or more than two: a single Avatar plus a dev warning (AC-6). An entry with no name and no `src`: Avatar's person icon for that party only |
| long text | Names never show (initials only). A long translated mark (3×, for example "gegen") stays on one line and widens the box. The heading beside it wraps as it does today |

- **Motion:** none.
- **Names:** with a name on both parties, the box is `role="img"` with the label `strings.versus` ("{a} versus {b}", ADR 0037), and its children are `aria-hidden`. With `decorative: true`, the whole box is `aria-hidden` (the title already says "A vs. B").

## 3. Densities, themes, Arabic

- **Densities:** none. The media size comes from the layout, not the density, as today.
- **Light and dark:** §1. The Avatar colours are as defined. Forced colours: the initials tile takes Avatar's existing forced-colours border, and the mark is `CanvasText`.
- **RTL:** the DOM order is first, mark, second, in a flex row, so in RTL the first party sits at the right. Nothing is reordered in code. The mark's Arabic word waits on the owner (#991, D-0012); English shows until then. CI adds the RTL shot (direction changes).

## 4. Edge cases

- **3× English mark:** §2 long text.
- **Narrow screens (< 600px, D-0092):** the `top-small` pair is about 120px wide, and the heading wraps beside it. In the column layouts the media column grows to the pair's width.
- **The same person twice, or the same initials:** shown as given. The app owns the data.
- **A list of 10,000 rows:** not offered (P2 compact size only if a list asks for it).

## 5. Messages

- No messages. The two new strings (ADR 0037) are `entityHeader.vs` ("vs.") and `entityHeader.versus` ("{a} versus {b}"), one string each, with placeholders (i18n note on #991). Wording: the Technical Writer's. Arabic: the owner's choice (D-0012).

## 6. Choices the engineer must not invent

- The heights per layout, the gaps, the mark's role and colour, side by side with no overlap and no ring, and no box around the mark.
- Stretched layouts use the small size at the top, centred.
- **Tests:** AC-1 to AC-6 in `brief.md`, plus:
  - the pair's height equals the single media's height in each layout;
  - the mark has no background or border;
  - with `decorative`, nothing is announced twice;
  - RTL puts the first party at the right.
