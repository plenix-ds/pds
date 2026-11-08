# #995 SecondaryPane: a "back to parent" item, and the pane's type order (G2)

- **Request:** the CTM owner (2026-11-07), on CTM's case pane: "back to cases looks like crap! should be left aligned with icons … case overview is more important than back to cases but it's smaller font". CTM drew a filled, full-width, centred grey button under the pane title. The ask (#995 item 2) is that the pane title be the strongest text in the pane, with its size and weight above the nav items' and the back item's.
- **Extends:** `SecondaryPane` (`platform/patterns/SecondaryPane`), per G3 (ADR 0038, D-0124): `back={{ parent, href | onClick }}`. It reuses its existing `strings.back` ("Back to {name}") and the Narrow Back control. It also uses the `NavList` item geometry (icon column, inline padding). There are no new colours or words.
- **The cause:** the SecondaryPane title is 12px, 600 (`secondary-pane-header-font-*`), and the NavList items under it are 13px. So the title is smaller than the items. Making the back item quieter alone does not fix that.
- **Readings applied (D-0123, the owner may switch):**
  - **The back item is the first row, above the title row**, shown only with `back` (G3). It is a link with `href`, otherwise a button. It is never filled and never centred.
  - **The SecondaryPane title rises to the surface-title role** (15px, 700, `content-default`), the size dialog and sheet titles already use. It applies to every SecondaryPane, so all panes keep one title style. This is the owner's ask (#995: the title's size is above the items'). It is *Changed (visual)* in the changelog. Option B keeps 12px and changes only CTM's case pane, which would give two title styles.
  - **The folded rail:** the back item is the first control, above Expand (G3), as an icon with a Tooltip. This matches the expanded order (back above the title).

## 1. Look

```
← Back to cases                 ← back row: 12px, 400, content-muted; the arrow on the nav icon column
Case Overview          [⋯] [«]  ← title row: 15px, 700, content-default (was 12px, 600)
  ▢ Summary                     ← NavList items: 13px, 400
SECTION                         ← NavList section labels: 12px, 700, caps, content-muted
```

| Part | Value (comp `secondary-pane-back-*` → sys, for G3) |
|---|---|
| Row height | `control-height-inline` (24 / 28 / 32px by density) |
| Inline padding | start: `secondary-pane-header-padding-inline-start` (12px), so the arrow's start edge lines up with the title's start edge and the NavList icon column under it; end: `space-inset-sm` (8px) |
| Icon | `arrow-left` (`arrow_back`), Material Symbols Sharp, **sm** (16px), `currentColor`. It mirrors in RTL (MIRROR list) |
| Icon to text | `space-inline-sm` (8px) |
| Text | **secondary** role: `text-secondary-font-size` (12px), `text-secondary-font-weight` (400), `content-muted`, one line, start-aligned |
| Spacing | the header's `padding-block-start` (8px) moves above the back row. There are 0px between the back row and the title row |
| Hover and focus shape | `shape-xs` (4px), as a NavList item |
| Title (changed) | `secondary-pane-header-font-size` → `text-lead-font-size` (15px); `-font-weight` → `font-weight-bold` (700). The header min-height stays `control-height-toolbar` (28px); a 15px line at 1.5 is 22.5px and fits |

- **Type order in the pane:** title (15/700, `content-default`) › NavList item (13/400, `content-default`) › section label (12/700, caps, `content-muted`) › back item (12/400, `content-muted`). The title is the largest text in the pane, and the back item is the quietest.
- **Contrast:** `content-muted` on the pane surface: 7.11 light, 6.31 dark; on `state-hover`: ≥ 4.5:1.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default | §1 |
| hover | `state-hover` fill, text and icon `content-default`, pointer cursor (the NavList item states) |
| focus | `focus-ring-color`, 2px, 2px offset, `shape-xs`. It is the first Tab stop in the pane |
| active | `state-pressed`, `motion-press-scale` |
| disabled | n/a (with no parent, the row isn't rendered) |
| loading | n/a (navigation; the route's own loading applies) |
| error | n/a (navigation) |
| selected | n/a (it is never the current page) |
| empty | no `back`: the row isn't rendered, and the pane is as today (with the new title size) |
| long text | one line, ending in an ellipsis, with the full text in a Tooltip (the NavList item ladder, `fit-and-overflow.md`). The arrow never shrinks. A long title wraps as it does today |

- **Motion:** `background-color` and `color`, `motion-duration-quick`, with a reduced-motion guard.
- **Name:** the visible text ("Back to cases") is the name.

## 3. Densities, themes, Arabic, sizes

- **Densities:** only the row height changes, through `control-height-inline`.
- **Light and dark:** the tokens above. Forced colours: link text `LinkText` (a button: `ButtonText`), hover `Highlight`, and the system focus ring.
- **RTL:** the row is right-aligned, and the arrow points right. The string exists (`strings.back`), so there are no new Arabic words. CI adds the RTL shot.
- **Folded rail:** the first control, above Expand: the arrow at the ToolRail item size, with a Tooltip "Back to {name}".
- **Narrow (< 600px):** while the list fills the width, the back row is its first row. While a detail shows, the existing detail Back bar (or the shell's parent row) is the only back control, and the pane's row isn't repeated (it has stepped aside).

## 4. Edge cases

- **3× English:** an ellipsis and a Tooltip (§2). The title wraps at 15px, and the header grows.
- **Panes with an icon in the title row:** the icon keeps its size. The back arrow sits on the same start edge as that icon.
- **Narrow panes (`width="sm"`, 180px):** "Back to cases" fits. Longer names truncate.
- **10,000 rows:** n/a.

## 5. Messages

- None new. It uses `strings.back` ("Back to {name}"). The wording is the Technical Writer's.

## 6. Choices the engineer must not invent

- The row above the title, only with `back`; never filled or centred; the arrow on the title's start edge; the secondary role in `content-muted`.
- The title at 15px, 700, on every SecondaryPane (Changed (visual)).
- In the rail, back comes first, above Expand. At Narrow, there is one back control.
- **Tests:**
  - the row renders only with `back`, as an `<a>` with `href` or a `<button>`, before the title;
  - the arrow's inline-start equals the title's inline-start;
  - the title's computed font-size is greater than every NavList item's, and the back row's is the smallest;
  - RTL flips the arrow;
  - the folded rail's first control is back;
  - at Narrow, there is one back control while a detail shows.
