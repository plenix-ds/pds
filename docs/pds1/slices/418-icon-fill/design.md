# #418: the no-box icon fills its whole area (G2)

- **Owner, 2026-11-05 about 21:25 UTC:** "no box around the icon.. make the icon take full space of that area (the formerly box area)".
- **Decisions:** D-0055, D-0058 (no box, confirmed by the owner); D-0038 A (the fact icons at the full tile size).
- **Rule (D-0059, B, the owner):** with no box, the drawn glyph spans the whole former box area.
  - The media square keeps the area's size (the table below).
  - The icon inside is drawn at **120% of the area** (24/20: the Material Symbols live area is 20 of 24, so the glyph's edges reach the area's edges), centred, with overflow visible. Nothing clips, because the glyph stays inside its live area.
  - The 120% is a comp token the DS Architect names (G3): `plx-comp.entity-header-media-icon-fill-scale` → `plx-sys.icon-fill-scale` → `plx-ref.icon-optical-scale` (1.2, #423), not a literal in CSS.
  - `box: true` is unchanged: today's tile with the smaller icon inside.
  - **Edge layout:** the same 120%. Its area runs edge to edge, so the glyph meets the card's top, bottom and start edges, uncut (the main column's clip keeps a margin for the pulled-out media, #422). The Product Lead accepted it on the 18e3ec0 pictures.

## The sizes (icon = area)

| Kind | Layout | Area token | Area (the glyph spans it; the icon square is 120%) |
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

- No new colour; the 120% only through its token. The glyph's drawn box equals the area (within 3px or 10% (glyphs fill their live area differently; one scale per D-0059)); don't add padding.
- `box: true` and Avatar media are unchanged.

## Evidence

- **Planned:**
  - the red test: the drawn glyph box equals the area (within 3px or 10% (glyphs fill their live area differently; one scale per D-0059)), per kind and layout above, LTR and RTL, light and dark; it fails today at least for column-large and edge;
  - then CI visuals light, dark and RTL on #418.
