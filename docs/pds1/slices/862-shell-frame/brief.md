# Brief: AppShell frame, full window or 1366 (#862)

Owner: pds1-product-lead. Design: pds1-design-director (G2). API: pds1-ds-architect (G3). Build: pds1-component-engineer 2. Decision: D-0093 (owner). Related: D-0092 (design at 1440, check at 1366 and 1920).

## Goal

An app is shown either across the full window (today) or at a 1366px width, centered, on a mid-grey page with a wide soft shadow. A person can expand the 1366 frame to the full window and back. Each app sets its default when the project starts, and CTM's default is 1366.

## Known, inferred, unknown

| | What |
|---|---|
| Known | `platform/patterns/AppShell/AppShell.tsx` is the page root (header, side nav, panel, footer, main). It already has `minSize` (1024×640, #274). Shadow tokens exist (`shadow-lg`, `shadow-floating`, `shadow-modal`), and mid greys exist (gray-300, gray-350). |
| Inferred | "1366 × 768" sets the **width**. The frame uses the full window **height**, with grey only on the left and right, as the owner described. |
| Unknown | None that blocks. The grey and shadow are picked by G2 from existing tokens (no new color). |

## P0

1. **`frame` prop on AppShell:** `"full"` (default, today) | `"1366"`. With `"1366"`, the whole shell (header, nav, panel, main and footer) has an inline size of `--plx-sys-shell-frame-width` (1366px), is centered, and keeps the full window height. The page **outside** the frame is a mid grey (a sys surface role on an existing gray, G2), and the frame casts a wide soft shadow on it (an existing shadow token, G2).
2. **Narrow windows:** when the window is 1366px wide or less, the frame fills the window (no grey sides), the same as `"full"`.
3. **The person's toggle:** in `"1366"` mode, a button in the AppHeader's end area switches to the full window and back (icons `open_in_full` / `close_fullscreen`; names "Expand to full window" / "Restore to 1366 width", Microsoft wording first, D-0078; EN and AR). The choice is remembered per app in `localStorage` and wins over the default on the next visit. It's keyboard reachable and announced. It isn't shown when the window is 1366px or less.
4. **The app's default:** an app passes `frame="1366"` (CTM) or leaves the default. **New projects choose it at intake** ("Frame: full window, or 1366 with expand", recommended 1366 for back-office apps).
5. Tokens only. Logical properties, so RTL mirrors (the toggle sits at the inline end). No change to content sizing rules (D-0087 measures the grid inside the frame).

## P1

- `frame` accepts any width token (for example a future 1440 choice), as long as G3 agrees.
- An `onFrameChange` callback for apps that store the choice server-side.

## Non-goals

- No change to the 1024×640 minimum (#274).
- No phone or tablet layouts (D-0013).
- No browser full-screen API (F11): "full window" means the app fills the browser window.

## Affected packages

`@plenix-ds/react` (AppShell, AppHeader toggle), `@plenix-ds/styles` (the frame rules), `@plenix-ds/tokens` (`shell-frame-width` and the outside-surface and frame-shadow sys roles, on existing ref colors and shadows).

## Acceptance

- **AC-1** Given `frame="1366"` and a 1920×1080 window, when the app renders, then the shell is 1366px wide and centered (277px of grey on each side, ±1), uses the full window height, and casts the frame shadow on the grey.
- **AC-2** Given `frame="1366"` and a 1280×800 window, when it renders, then the shell fills the window, with no grey sides and no toggle.
- **AC-3** Given `frame="1366"` at 1920 wide, when the toggle is pressed, then the shell fills the window, the toggle's name becomes "Restore to 1366 width", and after a reload the full window is kept.
- **AC-4** Given the default `frame` (`"full"`), when it renders at any width, then it's identical to today (the visual check shows no change).
- **AC-5** Given `dir="rtl"`, when AC-1 to AC-3 run, then they hold, with the toggle at the inline end.
- **AC-6** Given the toggle, when it's reached by Tab and activated with Enter or Space, then it works, and a screen reader announces its name and pressed state.

## Already implemented

AppShell (`minSize`, page kinds, regions), AppHeader end actions, shadow and gray tokens.

## Anything unclear

None open. The height reading is recorded under Inferred: the full height, with grey on the left and right only, as described.
