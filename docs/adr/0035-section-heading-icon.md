# ADR 0035: SectionHeading gets an icon, like Panel's heading

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's rule D-0110 ("the same style as the card heading … with icon"). Decision D-0114 (owner may switch).
- **Issue:** #946 (S1)

## Context

- D-0110: the page section heading uses the card heading's style, with its icon.
- `Panel` shows its icon through `icon?: IconValue | React.ReactNode`. The icon is drawn before the title in `.plx-panel__icon`, sized `--plx-sys-control-icon-standard`, `aria-hidden`, with the gap `panel-title-icon-gap` (`space-inline-sm`).
- `SectionHeading` has no icon. PR #982 gives it the card heading's type.

## Options

| Option | For | Against |
|---|---|---|
| **A. `icon` on SectionHeading, the same type and drawing as `Panel.icon`** | One way to put an icon on a heading. Additive. | One more prop. |
| B. Apps put an `<Icon>` in `children` | No API change | Each app spaces and sizes it its own way, so the two drift (D-0110 forbids that). The icon would be read inside the label. |

## Decision

**Option A** (D-0114; reply B on #946 to switch).

- **Prop:** `icon?: IconValue | React.ReactNode`, the same type as `Panel.icon`. It is drawn by `iconElement`. With none, the markup is unchanged.
- **Markup:** `<span class="plx-section-heading__icon" aria-hidden="true">` before `.plx-section-heading__label`. When the heading is collapsible, the icon sits inside the toggle button, before the label. It is decorative: the heading's text is its name.
- **Classes:** `plx-section-heading--icon` (on the heading) and `plx-section-heading__icon`.
- **Comp tokens** (comp -> sys only):
  - `section-heading-icon-size` -> `{plx-sys.control-icon-standard}`, Panel's icon size.
  - `section-heading-icon-gap` -> `{plx-sys.space-inline-sm}`, Panel's gap.
- **Color:** `currentColor`, the heading's ink, as in Panel. It is not mirrored in RTL unless the icon is directional (the icon set's rule).

## Consequences

- **Semver: MINOR** (*Added*: the `icon` prop, two classes, two comp tokens).

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7 on the two tokens.
- `tests/section-heading-matches-card-946.test.js` (extended on the build PR):
  - with `icon`, the computed icon size and gap equal the Panel title icon's;
  - the icon is `aria-hidden`;
  - in RTL it sits at the inline start.
