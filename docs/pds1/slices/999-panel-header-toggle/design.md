# #999 Panel: a collapsible panel toggles from its whole header (G2)

- **Request:** CTM#240 ("the expand/collapse arrow not consistent to card"). CTM's spouse cards add their own click handler on Plenix's internal header classes. Spec: `brief.md` (G1, PR #1005). It is an opt-in, with the name set by G3.
- **Extends:** `Panel collapsible` (`platform/components/Card/Card.tsx`, `card.css`): the header row (`plx-panel__header`, with the D-0106 glow and inset divider) and its Collapse/Expand button (`plx-panel__toggle`, `panel-toggle-*` tokens). There are no new colours.
- **Readings applied (D-0128, the owner may switch):**
  - **Hovering the header shows the toggle's hover,** not a fill over the header. The pointer anywhere on the header gives the chevron button its existing hover (`state-hover` fill, `content-default` icon), and the cursor is a pointer. The header keeps its glow and divider (D-0106), so a hovered header still looks like a card heading. Option B is a `state-hover` wash over the whole header (Fluent Accordion), which covers the glow.
  - **Pressing the header** shows the toggle's pressed state (`state-pressed`).
  - **There is one chevron, at the header's end,** as today: down when open, and pointing along the reading direction when closed.
- **Defect fixed (DESIGN.md §12 rule, no owner question):** a closed Panel's chevron is `rotate(-90deg)` in both directions, so in RTL it points against the reading direction. Card already flips (`.plx-card.is-collapsed .plx-card__toggle:dir(rtl)` → 90deg). Panel gets the same rule (D-0011: direction icons flip in RTL). Test: in RTL, a closed Panel's chevron turns +90deg.

## 1. Look

| Part | Value |
|---|---|
| Header with the opt-in | `cursor: pointer` on the header row, except over the actions and interactive children (they keep their own cursor) |
| Header hover | the toggle takes `panel-toggle-hover-background` (`state-hover`) and `panel-toggle-hover-text` (`content-default`). The header's own background is unchanged |
| Header pressed | the toggle takes `state-pressed` (a new comp `panel-toggle-pressed-background` → `plx-sys.state-pressed`), plus `motion-press-scale` on the button only |
| Chevron | `chevron-down`, the existing turn (`--plx-comp-icon-turn`, `panel-toggle-icon-duration`): open 0deg; closed −90deg in LTR and **+90deg in RTL** (defect fix) |
| Title, icon, description | unchanged. The title doesn't turn into a link colour, and gets no underline |

- Hovering an action or an interactive child **does not** show the toggle hover (the header hover is `:hover` on the header and not on an interactive descendant). Only that control shows its own hover.

## 2. State matrix (the header with the opt-in)

| State | Tokens / behaviour |
|---|---|
| default | as today: the glow, the divider, the muted chevron |
| hover (header) | pointer cursor; toggle `state-hover` and `content-default` |
| hover (an action inside) | the action's own hover only; no toggle hover; its own cursor |
| focus | only the toggle button is focusable (unchanged): `panel-toggle-focus-*` ring. The header gets no tab stop or role (AC-3) |
| active (header pressed) | toggle `state-pressed`. On release it toggles, and the chevron turns |
| disabled | n/a (Panel has no disabled state; an app that can't let it collapse doesn't set `collapsible`) |
| loading | n/a (the body's content owns its loading) |
| error | n/a |
| selected | n/a (expanded and collapsed are `aria-expanded`, not selection) |
| empty | a header with no title (actions only): the opt-in still works on the empty part of the row |
| long text | the title wraps as today. Every line of the wrapped title is part of the click area |

- **Motion:** the existing chevron turn and the toggle's `background-color` (`motion-duration-quick`), with reduced-motion guards (the turn is 0 under reduced motion). The body's open and close are unchanged.
- **Text selection:** a drag across the title selects text and does not toggle (a click is a press and release with no movement and no selection).

## 3. Densities, themes, Arabic

- **Densities:** none (the toggle's size follows `control-height-inline` already).
- **Light and dark:** the toggle tokens as defined. In dark, the hover is gray-700 behind a gray-200 icon. Forced colours: the toggle's hover is `Highlight` and its icon `HighlightText`, and the header itself shows no change.
- **RTL:** the chevron is at the inline end (the left), and a closed chevron points left (the defect fix). There are no new words.

## 4. Edge cases

- **3× English title:** it wraps, and the whole header is still the target.
- **A header with a Select or a search field in the actions:** it doesn't toggle on click or on typing.
- **Nested collapsible panels:** a click on the inner header toggles only the inner panel (the event stops at the inner header).
- **10,000 rows in the body:** n/a. Collapsing hides the body as today.

## 5. Messages

- None. The toggle's existing `collapse` and `expand` strings name it.

## 6. Choices the engineer must not invent

- The hover and press show on the toggle, never as a header fill. The cursor is a pointer only on the non-interactive parts.
- Only the button is focusable. There is no click on drag-select, and no toggle from an interactive child.
- The RTL chevron rule (defect).
- **Tests:** AC-1 to AC-4 in `brief.md`, plus:
  - hovering the header gives the toggle the hover background;
  - hovering an action doesn't;
  - in RTL, a closed chevron is +90deg;
  - a text selection inside the title doesn't toggle.
