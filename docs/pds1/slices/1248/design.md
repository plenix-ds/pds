# #1248 Menus open toward the start: end-aligned with their trigger (G2)

- **Request:** the owner (via CTM3 - PM, 2026-11-10): "drop menus are always popping to the right... I am accustomed to seeing them pop up to the left." Brief: issue #1248 (PM).
- **Extends:** `Menu` placement (`platform/components/Menu/Menu.tsx`, `floating.ts`). G3's ruling (#1248, 18:32): `Menu.placement` defaults to `"bottom-end"` for every trigger. MenuBar's top-level menus pass `"bottom-start"`. Popover and the field pickers keep `"bottom-start"`.
- **Fluent:** an overflow or command menu aligns to its trigger's end edge (D-0078).

## 1. The rule

- **A menu opened from a trigger** (a ⋮ or More button, a row menu, a column menu, a Button with a caret, a CommandBar More, a SplitButton) sits **below the trigger, with its end edge on the trigger's end edge**, and extends toward the start: left in LTR, right in RTL.
- **The gap** between the trigger and the menu is unchanged (the menu's offset token).
- **Flip:** if there is no room toward the start (the menu would cross the window or its scroll container's start edge), it aligns its start edge with the trigger's start edge instead. If there is no room below, it opens above with the same inline alignment. This is `floating.ts`, unchanged.
- **Width:** unchanged (the menu's min and max). A menu wider than its trigger extends past the trigger's start edge, never past its end edge.

## 2. Unchanged

- **MenuBar top-level menus** (File, Edit, …) open start-aligned under their item, like a desktop menu bar.
- **Submenus** open beside their item toward the inline end, and flip to the start when there is no room (Menu's submenu rule).
- **ContextMenu** opens at the pointer.
- **Field pickers** (Combobox, DatePicker, Cascader, TimeZoneSelect, EntityPicker) and **Popover** stay start-aligned, as wide as the field.

## 3. State matrix

- n/a(placement only): the menu's and the trigger's hover, focus, active, disabled, selected, loading and error tokens are unchanged.
- **Focus:** on open, focus moves to the first item, and on close it returns to the trigger (Menu's rule, unchanged).
- **Motion:** the open animation keeps its tokens. Its origin follows the alignment: the transform origin is the trigger's end corner.
- **Long text:** item labels follow Menu's rule. A wider menu grows toward the start.
- **Empty:** n/a. A menu always has items.

## 4. Densities, themes, Arabic

- **Densities:** placement only, the same in every density.
- **Light and dark:** no colour change.
- **RTL:** `end` is logical, so the menu's left edge sits on the trigger's left edge and the menu extends to the right. No new code.
- **Visual check:** light at standard density, plus RTL (direction). A ⋮ row menu at a DataGrid row end, and a More menu at a CommandBar end.

## 5. Edge cases

- **A trigger at the start of a bar** (a "New ▾" button at the toolbar's start): an end-aligned menu wider than the button would cross the start edge, so it flips to start-aligned (§1).
- **A narrow window:** the flip covers it. At Narrow, Menu's own sheet behaviour (if any) is unchanged.
- **A trigger inside a scrolled container:** the flip checks the scroll container's edge, as today.

## 6. Choices the engineer must not invent

- `bottom-end` is the default for Menu. MenuBar's top level is `bottom-start`. Pickers and Popover are unchanged. The submenu and ContextMenu rules are unchanged.
- The transform origin is the trigger's end corner.
- **Tests (test first):**
  - in LTR, a ⋮ Menu's right edge equals its trigger's right edge;
  - in RTL, the left edges are equal;
  - with the trigger at the window's start edge, the menu flips to start-aligned;
  - a MenuBar top-level menu stays start-aligned;
  - a DataGrid `rowMenu` and the CommandBar More menu follow the default.
