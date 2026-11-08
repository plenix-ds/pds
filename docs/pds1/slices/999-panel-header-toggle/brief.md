# 999: a collapsible Panel toggles from its whole header

Source: plenix-ds/pds#999, found checking CTM (owner, 2026-11-08, D-0121), linked to CTM#240. Part of 1.2.0 (#1001).

## Goal

- On a collapsible card, a click anywhere on the header row opens or closes it (Fluent 2 Accordion), so apps don't add click handlers on Plenix's internal classes.

## Already implemented

- `platform/components/Card/Card.tsx` `Panel`: `collapsible`, `defaultExpanded`, `expanded`, `onToggle`, a Collapse/Expand button at the header's end (`plx-panel__header`, `plx-panel__toggle`).
- CTM's workaround: `static/ctm/council-case.js` ~3591.

## P0

- An opt-in (G3 names it; for example `toggleOn="header"`). A pointer click on the header row toggles, except on the actions, on the icon or media slot's interactive children, and on any button, link or input inside the header.
- The Collapse/Expand button stays the only keyboard and screen-reader target (`aria-expanded`, `aria-controls`). The header gets no extra tab stop or role.
- The header shows the pointer cursor and the hover state while the opt-in is on.

## P1

- A docs example with an action button in the header (the click on it does not toggle).

## P2

- Make it the default in 2.0.0, if the owner wants that.

## Non-goals

- No change to Panels that aren't collapsible, or that don't opt in.

## Affected packages

- `@plenix-ds/react` (Panel), `@plenix-ds/styles` (cursor and hover on the header).

## Acceptance

- **AC-1:** Given a collapsible Panel with the opt-in, when the user clicks the title, then it toggles and `onToggle` gets the new state.
- **AC-2:** Given a click on a header action button or on a button inside the icon slot, then the panel does not toggle and the action runs.
- **AC-3:** Given keyboard use, then the tab order is unchanged, and Enter or Space on the Collapse/Expand button toggles it.
- **AC-4:** Given no opt-in, then a click on the title does nothing (today's behaviour).

## Anything unclear

| Question | Answer |
|---|---|
| — | None. |
