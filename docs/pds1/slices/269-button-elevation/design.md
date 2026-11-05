# #269 (and #6): one lighter elevation for raised buttons

- **Owner's words:** "Buttons are not consistent. Delete has no glow or shadow. Reduce glow and shadow and make buttons look consistent." (CTM#115, 2026-11-05). Earlier (#6, 2026-11-02): the shadow is one of the light card shadows, no new shadow value.
- **Extends:** `Button` raised look (G-R4-H, #610) in `platform/components/Button/button.css`; D-0023 (Fluent 2).
- **Root cause of the mismatch:** the raised rule lists secondary, tertiary, primary and danger; `danger-secondary` has no raised rule, so it is flat while `secondary` beside it is raised.

## The design (D-0054)

- **All raised variants** (secondary, tertiary, danger-secondary, primary, danger) share one elevation:
  - **Rest:** no shadow. `plx-comp.button-raised-rest-shadow` becomes `none`.
  - **Hover:** the Halo card shadow, the lightest card shadow (`plx-comp.button-raised-hover-shadow` → `{plx-comp.card-elevation-halo-shadow}`, unchanged).
  - **Glow:** the rim narrows. In all four glow images, the stop moves from 75% to 90%. Colors are unchanged.
- **danger-secondary joins the raised family:** rest image `button-secondary-glow-image` (its rest fill is `button-secondary-background`, the same fill); hover elevation Halo; **no hover glow image**, so its red hover fill (`button-danger-secondary-hover-background`) shows.
- **Unchanged:** the 2xs size and ghost stay flat. Bars (Toolbar, FilterBar, AppHeader) keep flat buttons through `--plx-comp-button-context-elevation` / `-context-glow`, and danger-secondary now honors those hooks too.
- **No new token.** Token value edits only (one shadow alias, four gradient stops), so ds-architect is not needed.

## State matrix (secondary · tertiary · danger-secondary)

| State | Fill / border / text | Glow image | Shadow |
|---|---|---|---|
| default | existing rest tokens per variant | `button-secondary-glow-image` (90%) | none |
| hover | existing hover tokens | secondary, tertiary: `button-secondary-hover-glow-image` (90%); danger-secondary: none | `card-elevation-halo-shadow` |
| focus | rest or hover look + existing focus ring (`button-focus-ring-width`, outline) | as rest/hover | as rest/hover |
| active (pressed) | existing pressed tokens; press scale | none (flat) | none |
| disabled | existing disabled tokens | none | none |
| loading | rest look, `aria-disabled`, so it draws as disabled | none | none |
| error | n/a (a button has no error state; errors show in the form's message area) | — | — |
| selected | existing selected tokens | none | none |
| empty | n/a (a button always has a label, or an icon plus `aria-label`) | — | — |
| long text | unchanged: shrinks in a bar and ends in an ellipsis (`button-context-min-inline-size`) | as state | as state |

- **Densities:** no size change; compact, standard and comfortable look the same apart from height.
- **Dark:** `shadow-halo` (dark) and the glow's sys colors already have dark values; nothing new.
- **RTL:** no change; the glow is centered and the shadow has no offset.
- **Edge cases:** 3x text uses the existing ellipsis; 10,000 rows doesn't apply.
- **Messages:** none.

## The engineer must not invent

- No new shadow value, color or token. If `none` fails the token lint, use the existing `plx-sys.elevation-*` "none" if one exists, otherwise stop and ask ds-architect.
- Don't change ghost, 2xs, on-inverse or on-accent.
- Leave danger-secondary's pressed and selected colors as they are (separate review).

## Evidence

- **Planned:** the Button page shows secondary, tertiary and danger-secondary side by side at rest and on hover. CI visual check, light and dark at standard density. The screenshots go on #269, #6 and CTM#115.
