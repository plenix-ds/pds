# #995 NavPane: a "back to parent" item, and the pane's type order (G2)

- **Request:** the CTM owner (2026-11-07), on CTM's case pane: "back to cases looks like crap! should be left aligned with icons … case overview is more important than back to cases but it's smaller font". CTM drew a filled, full-width, centred grey button under the pane title.
- **Extends:** `NavPane` (`platform/patterns/NavPane`), its title row and its Narrow parent row ("the pane's title after a back arrow"), and the `NavList` item geometry (icon column, inline padding). There are no new colours.
- **Readings applied (D-0123, the owner may switch):**
  - **The back item is a row above the title row**, shown only when the pane has a parent. This is the Fluent order (back at the top of the pane) that CTM asked for. Every pane's title row is unchanged.
  - **It is a link** (it navigates up to the parent list), not a button. It is never filled and never centred.
  - **The pane title keeps its size** (13px, 700, `content-default`). The hierarchy is made by the back item being the quietest text in the pane (12px, 400, `content-muted`). Making the title larger changes every pane's look and needs an owner decision (option B).
  - **The settings footer is unchanged.** A settings screen's way back stays in the footer (NavPane's existing rule). The top back item is for a pane that belongs to one record under a list ("Back to cases").

## 1. Look

```
← Back to cases                 ← back row: 12px, content-muted, arrow on the nav icon column
Case Overview          [⋯] [«]  ← title row (unchanged): 13px bold
  ▢ Summary                     ← NavList items: 13px regular
  ▢ Hearings
SECTION                         ← NavList section labels: 12px bold caps, muted
```

| Part | Value |
|---|---|
| Row height | `control-height-inline` (24 / 28 / 32px by density) |
| Inline padding | `nav-list-item-padding-inline` (8px), the same as a NavList item, so the arrow sits on the nav icon column |
| Icon | `arrow-left` (`arrow_back`), Material Symbols Sharp, **sm** (16px), `currentColor`, centred in the items' icon column. It mirrors in RTL (it is in the MIRROR list) |
| Icon to text | `nav-list-item-gap` (8px) |
| Text | **secondary** role (12px, 400), `content-muted`, sentence case: "Back to {parent}". One line, start-aligned |
| Above the title row | the pane's `header-padding-block-start` (8px) above the back row; 0 between the back row and the title row |
| Shape | `shape-xs` (4px) for its hover fill and focus ring, as a NavList item |

- **Type order in the pane** (DESIGN.md §3, recorded): title (13/700, `content-default`) › NavList section label (12/700, caps, `content-muted`) › item (13/400, `content-default`) › back item (12/400, `content-muted`).
- **Contrast:** `content-muted` on the pane: 7.11 light, 6.31 dark (gray-300 on gray-800); on `state-hover`: ≥ 4.5.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default | §1 |
| hover | `state-hover` fill over the row's inline padding box, text and icon `content-default`, pointer cursor |
| focus | `focus-ring-color`, 2px, 2px offset, `shape-xs`. In the tab order before the title row's actions |
| active | `state-pressed`, `motion-press-scale` |
| disabled | n/a (a parent is always reachable; with no parent, the row isn't rendered) |
| loading | n/a (a link; the route's own loading applies) |
| error | n/a (navigation) |
| selected | n/a (it is never the current page) |
| empty | no parent: the row isn't rendered, and the pane looks as it does today |
| long text | one line, ending in an ellipsis, with the full text in a Tooltip (the NavList item ladder in `fit-and-overflow.md`). The arrow never shrinks |

- **Motion:** `background-color` and `color`, `motion-duration-quick`, with a reduced-motion guard.
- **Name:** the visible text is the name ("Back to cases"), so no `aria-label` is needed. It is an `<a href>` inside the navigation landmark, before the title.

## 3. Densities, themes, Arabic, sizes

- **Densities:** the row height follows `control-height-inline`. Text and icon sizes don't change.
- **Light and dark:** the tokens above. Forced colours: the text is `LinkText`, the hover is `Highlight`, and the focus ring is the system ring.
- **RTL:** the row is right-aligned (logical), and the arrow flips to point right. "Back to {parent}" is one catalog string with a placeholder. The i18n Engineer proposes the Arabic (D-0012). CI adds the RTL shot.
- **Collapsed (rail):** the back item is the second rail item, right after Expand and before the divider. It is an icon button (the arrow, ToolRail item size) with a Tooltip and the name "Back to {parent}".
- **Medium (600–839px):** the rail as above. The expanded overlay shows the back row as in §1.
- **Narrow (< 600px):** the pane is its own screen. The back row is its first row, as in §1. When a list-detail's detail shows, the existing parent row ("Back to {list}") stays the page's single back control, and the pane's back row is not repeated in it.

## 4. Edge cases

- **3× English:** an ellipsis and a Tooltip (§2). The pane's resize limits (140–320px) never hide the arrow.
- **A long parent name:** the same.
- **A pane with both a back row and a settings footer:** both show. One goes up (top), and one leaves settings (bottom).
- **10,000 rows:** n/a.

## 5. Messages

- One new string, `navPane.back` = "Back to {parent}" (one string with a placeholder, so Arabic can order the words). Wording: the Technical Writer's. Arabic: the i18n Engineer, then the owner (D-0012).

## 6. Choices the engineer must not invent

- The row above the title row, rendered only with a parent; a link, never a filled or centred button.
- The arrow on the NavList icon column; the secondary role in `content-muted`; the title unchanged.
- In the rail, the back item comes after Expand and before the divider. At Narrow, there is no duplicate back control while a detail shows.
- **Tests:**
  - the row renders only with a parent, as an `<a>` before the title;
  - the arrow's inline-start lines up with a NavList item's icon;
  - the computed title font-weight is greater than the back row's, and its size is not smaller;
  - RTL flips the arrow;
  - the collapsed rail's second item is the back item, with a Tooltip;
  - at Narrow, there is one back control while a detail shows.
