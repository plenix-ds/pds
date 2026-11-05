# #418: the no-box icon fills its whole area (G2)

- **Owner, 2026-11-05 about 21:25 UTC:** "no box around the icon.. make the icon take full space of that area (the formerly box area)".
- **Decisions:** D-0055, D-0058 (no box, confirmed by the owner); D-0038 A (the fact icons at the full tile size).
- **Rule:** with no box, the icon's size (`--plx-comp-icon-size`, the Icon's square) equals the media area in every kind and layout.
  - The glyph's own optical margin inside that square (Material Symbols' live area) is part of the glyph, not a box. It isn't scaled away, so the glyph is never clipped.
  - `box: true` is unchanged: today's tile with the smaller icon inside.

## The sizes (icon = area)

| Kind | Layout | Area token | Icon size, no box |
|---|---|---|---|
| page | top, small (default) | `entity-header-media-size` (`size-11u`) | **44px** |
| page | top, large | `entity-header-media-size-large` (`size-18u`) | **72px** |
| page | column, small | `entity-header-media-size` | **44px** |
| page | column, large | measured row (`entity-header-media-measured`), at least `media-size-column-large` (`size-28u`) | **the measured square, at least 112px** |
| page | edge | measured row, at least `media-size-edge` (`size-32u`) | **the measured square, at least 128px** |
| page | streamlined | `entity-header-streamlined-media-size` (`size-12u`) | **48px** |
| section | top, small; column, small | `entity-header-section-media-size` (`size-8u`) | **32px** |
| section | top, large | `section-media-size-large` (`size-12u`) | **48px** |
| section | column, large | measured, at least `section-media-size-column-large` (`size-16u`) | **at least 64px** |
| section | edge | measured, at least `section-media-size-edge` (`size-20u`) | **at least 80px** |
| fact icon (Owner, Due) | — | `entity-header-fact-icon-tile-size` (`size-10u`) | **40px** (already on main, #364) |

## What changes (from reading main)

- The no-box tile reads `--plx-comp-entity-header-context-tile-icon-fill` first. `.plx-entity-header__media--stretch` sets that to the layout's old **icon** size (40/48px; section 24/28px), so in column-large and edge the icon stays small in a 112–128px area. **The fix:** with no box, the icon size is the media square itself (`--plx-state-entity-header-media-size`, or the measured size when stretched), never the old icon tokens.
- The top-row layouts already read the media size. The red test confirms the rendered size there too: no part is changed on a guess.
- **Tokens (@pds1-ds-architect, G3):** the old `entity-header-*media-icon-size*` tokens stay only for `box: true`. If a no-box size token helps, it points to the area token (`media-icon-fill-size` → `media-size`), never a new value.

## States, modes, edge cases

- **Not interactive** (`aria-hidden`): hover, focus, active, selected and disabled are n/a. Loading: the header's skeleton. Error: an unknown hue falls back to gray.
- **Empty:** no media → the default DocText icon, also filling the area.
- **Long text:** the media keeps its size; the title wraps beside it.
- **Light and dark:** the hue's on-surface colour (D-0038 shades in dark). At these sizes the icon is a large graphic, so 3:1 holds.
- **RTL:** symmetric; no direction icons in the media.
- **Densities:** the area tokens don't change with density, so neither does the icon.

## The engineer must not invent

- No new colour or value. The icon equals the area; don't scale past it, and don't add padding.
- `box: true` and Avatar media are unchanged.

## Evidence

- **Planned:**
  - the red test: the rendered icon square equals the area, per kind and layout above, LTR and RTL, light and dark; it fails today at least for column-large and edge;
  - then CI visuals light, dark and RTL on #418.
