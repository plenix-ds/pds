# #800: DataGrid column sizing (owner P1, D-0087): design (G2)

- **Owner, 2026-11-06:** "the UI has lots of space... yet in some columns its truncating." His rule is D-0087 (steps 1 to 7 on #800). This file makes it buildable without inventing anything.
- **Spec:** the Product Lead's brief, `brief.md` (#802), with its acceptance AC-1 to AC-8. Where this file once differed, it now follows the brief.
- **Extends:** DataGrid's fit (`narrow: "auto"`, #272, #679, #783/#793), the existing column `kind`s, the pill width equalizing (D-0010), the row menu and `kind: "actions"`, fit-and-overflow §2 (table-header ladder) and §5 (Tooltip while cut).

## 1. Column classes, from what exists (no new prop)

| Class | Columns | May truncate? |
|---|---|---|
| **Fixed** | the selection checkbox; the row menu (⋮) | never; their own fixed width tokens |
| **Compact** | `name`, `avatar-name`, `data`, `id`, `code`, `phone`, `email`, `badge`, `tags`, `icon`, `center`, `deleted`; every number, currency, percent, duration and date column (by type); status and pill columns | only at step 4 below, the last before cards |
| **Long text** | `kind: "wrap"`; `url`; and a text column whose widest value is longer than `long_text_threshold` characters (the brief; named at G3) | first, at step 4.1 |

- A text column whose widest value is within `long_text_threshold` is **compact**. So a short "Reason for divorce" or "Status" text never cuts.
- A person-resized column keeps its width (as today).

## 2. Widths

1. **Room:** the grid's measured inline size, minus the fixed columns.
2. **Natural width of each column:** the wider of its **whole header** (title, type icon, options button, padding) and its **widest value** (pills already equalize to the widest pill). The app's set `width` is a **minimum** for compact columns, not a cap.
3. **Fits:** when the natural widths add up to the room or less, every column takes its natural width, and the **spare room is shared evenly** across all non-fixed columns (the same amount added to each).
4. **Doesn't fit,** in this order, one step at a time:
   1. **long text** columns give up width first, down to the grid's minimum readable width (80px), with their text ending in an ellipsis and the full value in the Tooltip;
   2. then **compact headers** cut (the table-header ladder, #793), never a value: each compact column keeps at least its widest value;
   3. only when even that doesn't fit does the grid switch to the **row cards** (#783's corrected rule).
- **Measuring "widest value":** over the **current view** (the visible window plus the current page, AC-8). It's recomputed on resize, a column shown or hidden, and a data, page or filter change, **never by scrolling alone**, so columns don't jump.

## 3. Alignment (D-0087)

- **All cell content is start-aligned** (left in LTR), **numbers included**, so a value sits under its start-aligned header however wide the column gets. A column may still say `align`.
- Numbers, currency, percent and duration keep **`tabular-nums`** (digits line up), and the data font where they used it.
- This replaces DESIGN.md §8's "numbers end-aligned" rule and check 10's alignment part (the owner's newer rule wins). @pds1-ds-architect updates check 10: tabular-nums is kept, end alignment is dropped.

## 4. The first and last columns

- **First, the selection checkbox:** always its fixed width, and never takes spare room.
- **Last, the row actions:**
  - **Wide, with room:** the actions show as **icon-only buttons** at the row's **inline-end** (right in LTR, left in RTL), visible on row **hover, keyboard focus or selection**. Each keeps its name in the Tooltip, and the column is wide enough for its icons only.
  - **No room:** one **⋮ row menu** at a fixed width, **pinned to the inline-end edge** (sticky), holding all the actions with their words.
  - The switch between the two is part of step 4: the icon actions fold into ⋮ before any long text cuts.

## 5. States, modes, edge cases

- **States:** hover, focus, selected and disabled are the rows' and cells' existing states. Loading is the grid's skeleton at the last widths; an empty grid keeps the header at natural widths.
- **Densities:** widths come from content, so compact density's smaller font gives narrower natural widths, with the same rule.
- **Light and dark:** no change.
- **RTL:** inline-start and inline-end throughout. The pinned ⋮ is at the left in RTL.
- **3x English:** long text truncates first, then compact headers, and values never cut.
- **Resize:** recomputed on the grid's width change, debounced to the frame.

## 6. The engineer must not invent

- No new column prop and no new token beyond what the brief names: the checkbox and ⋮ widths, and `long_text_threshold`, as tokens or constants per G3. If a `kind` for long text is needed beyond `wrap`, @pds1-ds-architect names it (G3).
- Spare room is shared **evenly**, not to the title.
- Values in compact columns are never cut before the cards. Cut text always shows in the Plenix Tooltip (#794).

## Evidence

- **Planned:** the owner's case (6 columns at 1,600px: "Reason for divorce" and "Status" whole, spare shared evenly), 16 columns at 1,500px (#783), 400px (cards), with and without actions (icons vs ⋮), in LTR and RTL. A before/after picture goes to the owner's QA item.
