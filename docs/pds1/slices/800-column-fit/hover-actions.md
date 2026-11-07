# #800 AC-5: row actions as hover icons, else the ⋮ menu: design (G2)

- **Owner (D-0087, step 6):** "on a wide grid with room, the actions are icons only, right-aligned, shown on row hover. With no room, the last column is the ⋮ menu, a fixed width pinned to the right edge."
- **Extends:** the grid's one row-actions list, `rowMenu` (label, icon, danger, disabled, separator), its ⋮ button and right-click menu; the toolbar fold rules (fit-and-overflow §3); the column sizing of #800 (`design.md` §2 and §4).

## 1. Which actions show as icons

- **From `rowMenu`, in its order:** an item shows as an icon button when it **has an icon**, is **not `danger`**, and isn't a separator.
- **At most three.** The fourth and later eligible items stay in the menu.
- **Destructive actions** (`danger`) never show as an icon. They stay in ⋮, at the end after a divider, as fit-and-overflow §3 says (one click away from Delete is too easy to hit by accident).
- **Per item:** an item may say `inline: false` (never an icon) or `inline: true` (an icon even if it's fourth; it then takes a first-three place in menu order). The field name is for @pds1-ds-architect (G3); it's the only new API.
- **The ⋮ stays** after the icons **only when** some item isn't shown as an icon (a danger item, one without an icon, a fourth). With every item shown as an icon, there's no ⋮, though right-click still opens the full menu.

## 2. Look and place

- **The actions column:** the last column, at the row's **inline-end** (right in LTR, left in RTL). Its width is the icons plus their gaps, plus ⋮ if shown. It's a **fixed** column (it takes no spare room).
- **Each icon:** the existing icon-only **ghost Button** at the grid's small control size, with its `label` as the accessible name and in the Plenix **Tooltip**, the #109 state layers, and the existing control gap between buttons. No new token.
- **Disabled item:** the icon shows disabled (the Button's own disabled state). If the item gives a reason, it's in the Tooltip.

## 3. When the icons show

- **Pointer:** shown while the row is **hovered**; hidden otherwise (the column keeps its width, so nothing moves).
- **Keyboard:** shown while **focus is in the row**.
- **Selected rows:** shown (as `kind: "actions"` does today).
- **Touch** (no hover; `interaction-touch`): no hover icons. The ⋮ shows on every row, always.

## 4. Room: icons or ⋮ (with #800 §2, step 4)

- **Icons** when every compact column fits at its natural width **and** there's room for the icon column.
- **Otherwise all icons fold at once into the ⋮ menu**, a fixed `data-grid-row-menu-width` column pinned (sticky) to the inline-end edge, and the menu holds every action with its words. This happens before any long text cuts (design §4). The fold isn't one icon at a time: one column, two looks.
- `narrow="list"` and the cards keep the card's row menu, as today.

## 5. Keyboard and screen readers

- The grid stays **one Tab stop** (owner answer 7).
- The actions cell is a cell like any other. **Enter** (or F2) moves focus onto its first icon, **arrows** move between the icons and ⋮, and **Escape** returns to the cell. Activating an icon runs it and focus stays.
- Each icon is a button named by its label. The row's accessible description doesn't repeat them.

## 6. States, modes, edge cases

- **States:** hover, focus, pressed and disabled are the Button's states (#109). The row's selected state shows the icons.
- **Densities:** the button size follows the grid's control size per density.
- **Light and dark:** existing tokens.
- **RTL:** inline-end, and the icon order mirrors (the first action nearest the row's content).
- **3x English:** labels are only in the Tooltip and the menu, so the icons don't grow.
- **10,000 rows:** the icons render only for drawn rows (virtualised).
- **Messages:** none new. An action's own result goes in a Toast, as today.

## 7. The engineer must not invent

- No new token or colour. The only new API is the per-item `inline` field (G3).
- Danger is never an icon. There are at most three icons. All fold together.
- Touch always shows ⋮.

## Evidence

- **Planned:** a wide grid with 3 icon actions plus a danger item (icons + ⋮ on hover, none at rest), the same grid narrow (⋮ pinned), focus in a row showing the icons, keyboard Enter/arrows/Escape, touch showing ⋮, in LTR and RTL.
