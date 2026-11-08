# ADR 0038: SecondaryPane "back" (a back-to-parent item at the top of a side pane)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the CTM owner's report (2026-11-07). Decision D-0124 (owner may switch).
- **Issue:** #995 (S2)

## Context

- CTM's case pane has the title "Case Overview" and a centred grey "Back to cases" button under it. The owner wants a quiet, start-aligned back item with an icon, and a pane title that is the strongest text.
- `SecondaryPane` already has:
  - `onBack()`, a Back control at Narrow only (list -> detail);
  - `strings.back` ("Back to {name}");
  - `collapsible` and `rail` (the folded rail).
- `NavList` renders the items inside a pane. It doesn't know about the pane's header or rail.
- The Product Lead asked for one Back in Plenix: reuse the string and the control's look.

## Options

| Option | For | Against |
|---|---|---|
| **A. `back` on `SecondaryPane`** | The pane owns its header and rail, so the item sits above the title and folds into the rail with a tooltip. Reuses `strings.back`. | It doesn't work for a NavList outside a SecondaryPane. |
| B. `NavList.Back`, or `back` on `NavList` | Works wherever a NavList is | It can't reach the pane header (the order: back, then title) or the folded rail. Two places would draw a back. |

## Decision

**Option A** (D-0124; reply B on #995 to switch).

- **Prop:** `back?: { parent: string; href?: string; onClick?(event): void }`.
  - It is a link with `href`, otherwise a button. `parent` is the parent's name, e.g. "cases".
  - **Text:** `strings.back` with `{name}` = `parent` ("Back to cases"). This is the existing key; there are no new words.
- **Placement:**
  - It is the first row of the pane, above the header row (title, icon and actions), at the inline start.
  - Its arrow icon (`arrow_back`, mirrored in RTL) sits on the same start column as the nav items' icons.
  - It is quiet: no fill, no border, small secondary text. Hover and focus use the nav item states.
- **Hierarchy (documented in the part and DESIGN.md):** the back item is the smallest and quietest. Then the pane title, which is the strongest text in the pane. Then section headings. Then items. G2 sets the type roles; the title role is above the item role.
- **Folded rail:** with `collapsible` and folded, the back item is the rail's first control, above Expand: an icon-only button or link named and tooltipped by the same text.
- **At Narrow:** `onBack` (list -> detail) is unchanged. When both are given, the Narrow Back control leads the detail, and `back` stays in the pane.
- **Classes:** `plx-secondary-pane__back` (and `plx-secondary-pane__rail-back`).
- **Comp tokens** (comp -> sys only; G2 sets them): `secondary-pane-back-{text,text-hover,font-size,font-weight,line-height,icon-size,gap,padding-block,padding-inline}`, and the header title's type role if G2 raises it (the title gets stronger).

## Consequences

- **Semver: MINOR** (*Added*: `back`, two classes, the comp tokens). A change to the title's type role is *Changed (visual)*.
- CTM replaces its button with `back={{ parent: 'cases', href: '/cases' }}`.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7 on `secondary-pane-back-*`.
- The build PR's behavior tests:
  - the back item comes first in DOM and tab order, before the title;
  - it is named "Back to <parent>";
  - it is a link with `href`, otherwise a button;
  - the arrow mirrors in RTL;
  - the folded rail shows it with a tooltip;
  - the title's computed font size and weight are above the back item's and the nav items'.
