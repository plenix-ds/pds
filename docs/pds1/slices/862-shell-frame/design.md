# #862: the AppShell frame, full or 1366 (owner, D-0093): design (G2)

- **Owner, 2026-11-07:** "options, full window size (what we have now)… option for 1366 × 768… user can expand the view to full screen size… the frame… centered with a wide shadow on the page, think mid grey border on the left and right… for ctm it needs to be 1366 as default."
- **Extends:** AppShell (its header, nav pane and `minSize`), the screen sizes in DESIGN.md §5 (D-0092), the shadow scale, the surfaces.

## 1. The two frames

| `frame` | What the person sees |
|---|---|
| `"full"` (default, today) | the app fills the window, unchanged |
| `"1366"` | the whole app (header, nav pane, content) sits in a **frame 1366px wide**, centred, the full height of the window; **outside it, mid-grey sides**; the frame has a **wide shadow** |

- **With `"1366"` and a window 1366px wide or less,** the frame fills the window, with no sides, shadow or toggle. It's the same as full.
- **Height:** the frame is always the window's full height (no top or bottom margin). Only the sides show.

## 2. The look (existing tokens only)

| Part | Light | Dark | Token (new sys alias → existing ref; @pds1-ds-architect names it, G3) |
|---|---|---|---|
| The sides (the page backdrop) | `gray-300`, mid grey | `gray-950` | `shell-backdrop` |
| The frame's surface | as today (`surface-canvas`) | as today | unchanged |
| The frame's shadow | `shadow-lg` (32px and 8px blur, the wide one) | `shadow-lg` (dark) | `shell-frame-shadow` → `shadow-lg` |
| The frame's width | 1366px | | `shell-frame-width` (the brief's name) → a new `size` step for 1366px |

- **No corners and no border on the frame.** The shadow is the edge. It runs the full height, so rounded corners would only show at the top and bottom of the window.
- **Contrast:** the sides are decorative. The frame's own contents keep their contrast; nothing changes inside.

## 3. The person's toggle: expand to full window / restore to 1366

- **Where:** in the AppHeader's **end** area (inline-end, beside the other header actions), only when `frame="1366"` and the window is wider than 1366px.
- **What:** an icon-only ghost Button. The icon is `open_in_full`, named "Expand to full window", when framed, and `close_fullscreen`, named "Restore to 1366 width", when full (the brief, #863; Microsoft wording first, D-0078). It **keeps its Tooltip** (it's not in the known set, DESIGN.md §6) and has `aria-pressed` for full width. The words are the Technical Writer's, and the Arabic waits for the owner (D-0012).
- **Remembered** per person and per app (local storage, with the other view settings). Reloading keeps the choice.
- **The change:** the frame's width animates with the motion `base` duration; with reduced motion there's no animation. The content reflows as it would on a window resize.

## 4. States and modes

- **Toggle:** the Button's own states (rest, hover, pressed, focus, the #109 layers).
- **Densities:** no change; the frame is a width, not a density.
- **RTL:** symmetric; the toggle sits at the header's inline-end (the left in RTL).
- **Print:** the frame, sides and shadow aren't printed (print.css); the page prints at full width.
- **Dialogs and drawers:** they open **over the whole window** (the backdrop covers the sides too). A Drawer slides in from the **frame's** edge, not the window's.
- **Toasts and menus:** they position inside the frame's content area.
- **Minimum 1024×640:** unchanged. At 1024–1366px the frame is the window.

## 5. Choosing the default

- **An app picks it:** `<AppShell frame="full" | "1366">`. CTM sets `"1366"`.
- **New projects:** the starter asks which frame (Full window or 1366). That's the docs and starter's job, not the component's.

## 6. The engineer must not invent

- No new colour: the sides alias `gray-300` / `gray-950`, and the shadow aliases `shadow-lg`. No corners, no border.
- Only 1366 and full. No other widths unless the owner asks.
- The toggle shows only when it changes something (framed, and the window is wider than 1366px).

## Evidence

- **Planned:** CI visuals at 1920×1080 with `frame="1366"`, in light and dark (sides, shadow, centred frame), the same with the toggle set to full width, and 1366×768 (no sides); plus RTL for the toggle's place. A picture goes to the owner's QA item.
