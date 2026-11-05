# #275: the EntityHeader media icon and its box

- **Owner's words:** "the icon does not have the box around it as we decided" (CTM review deck, 2026-11-05, on the case header `media={{ icon: "folder", hue: "purple" }}`; CTM#109).
- **How it reads (D-0055, D-0035: the sensible reading, no new question):**
  - The owner's own screenshot (0.86.0, case 20261020-04) already **shows** the box: a gray 1px border and the light slate fill.
  - So the sentence reads as "the icon does not have [to have] the box around it, as we decided". That's D-0024 ("do not put an icon inside a box", 2026-10-24 and 2026-11-01) and D-0036 row 1, whose before-and-after pictures he saw on #108.
  - The other reading (a missing box) can't be right, because the box is there.
- **Extends:** `EntityHeader` (`platform/patterns/EntityHeader/`) media, `.plx-entity-header__tile`; D-0026 (Structured header), D-0036 row 1, D-0038 (dark shades).
- **Build:** PR #325 (Component Engineer 1). PR #323 (logical properties) still applies to the opt-in box.

## The design

- **Default `{ icon, hue }`:** no border and no fill. The icon fills the media square (44px top-small; the other layouts use their existing media sizes) in the hue's on-surface colour:
  - the ADR 0005 tokens;
  - in dark mode, one lighter existing shade per hue (D-0038).
- **`media.box: true`:** keeps today's bordered tile, the per-usage box D-0024 allows. Border 1px `entity-header-tile-border-color`, 4px corners, hue soft fill, on-soft icon.
- **Edge layout:** unchanged (no border, one line at the inner side).
- **Fact icons:** no box (D-0036 row 2, as pictured on #108).
- **No new colour.** The tokens are the DS Architect's (approved on #325).

## State matrix (media; decorative, `aria-hidden`)

| State | Tokens |
|---|---|
| default | icon only, hue on-surface colour, media size |
| default + `box` | tile border + hue soft fill + on-soft icon |
| hover / focus / active / selected / disabled | n/a (not interactive) |
| loading | n/a (the header's skeleton covers it) |
| error | n/a (an unknown hue falls back to `gray`) |
| empty | no `media` → the `DocText` icon in gray; `media={null}` (Streamlined) → nothing |
| long text | the media keeps its size; the title wraps beside it |

- **Densities:** existing media sizes; no change.
- **Light and dark:** dark uses the D-0038 shades. Check 8 holds the icon at 3:1 on the card surface.
- **RTL:** symmetric; logical properties.
- **Edge cases:** 3x title wraps, and the media stays top-aligned; 10,000 rows doesn't apply.
- **Messages:** none.

## The engineer must not invent

- No new token or colour; no box on fact icons or Avatar media; `box` is opt-in only.

## Evidence

- **Planned:** a CI visual of the record-page example (no box, and `box: true`), light and dark at standard density. The screenshots go on #275 and CTM#109; the owner QA item follows.
