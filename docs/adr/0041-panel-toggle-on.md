# ADR 0041: Panel "toggleOn" (a collapsible panel toggles from its whole header)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's "canonical, not patches" rule (2026-11-08) and G2 (PR #1015, D-0128). Decision D-0129 (owner may switch).
- **Issue:** #999 (S2). Brief: `docs/pds1/slices/999-panel-header-toggle/brief.md`.

## Context

- `Panel collapsible` toggles only from its Collapse/Expand button.
- CTM adds its own click handler on Plenix's internal `.plx-panel__header` and `.plx-panel__toggle` classes, so the whole header toggles.
- Fluent 2's Accordion toggles from the header.
- G2 (D-0128 A): a header press shows the chevron button's own hover and pressed state, with no header fill. That needs a pressed token for the toggle.

## Options

| Option | For | Against |
|---|---|---|
| **A. `toggleOn?: "button" \| "header"`, default `"button"`** | Explicit, and open to a later value. The default keeps today's behavior. | One prop. |
| B. `headerToggles?: boolean` | Short | A boolean can't grow, and it reads as a state, not a choice. |

## Decision

**Option A** (D-0129; reply B on #999 to switch).

- **Prop:** `Panel.toggleOn?: "button" | "header"`, default `"button"`. It only applies with `collapsible`. Without it, `devWarn` says it is ignored.
- **`"header"`:**
  - A pointer click anywhere on the header row toggles the panel, the same as pressing the button (`onToggle(next)`, controlled or not). These don't toggle:
    - the header's `actions`;
    - any interactive descendant (`button`, `a`, `input`, `select`, `textarea`, `[role=button]`, `[tabindex]`, the media's own controls);
    - a click that ends a text selection.
  - The **button stays the one focusable control and the one accessible target**, with `aria-expanded` and `aria-controls`. The header gets no role, `tabindex` or key handler, so keyboard and screen-reader users have one control.
  - The look is G2's: the header's hover and press drive the button's own hover and pressed state, the pointer cursor shows on the header, and the glow and divider stay.
- **New comp token:** `panel-toggle-pressed-background` -> `{plx-sys.state-pressed}` (comp -> sys).
- **New class:** `plx-panel--toggle-header` on the panel, for the cursor and the state hand-off.
- **Fixed with it:** a closed Panel's chevron now mirrors in RTL, as Card's does.

## Consequences

- **Semver: MINOR** (*Added*: `toggleOn`, one token, one class; *Fixed*: the RTL chevron).
- CTM drops its click handler and names no `plx-panel__*` class.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7 on the new token.
- The build PR's tests (G2 §6):
  - a header click toggles;
  - clicks on actions and interactive children don't;
  - a text selection doesn't;
  - only the button is in the tab order, with `aria-expanded`;
  - the default `"button"` is unchanged;
  - the chevron mirrors in RTL.
