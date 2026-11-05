# ADR 0005: Data colors on the surface (icons without a tile)

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect, on the G2 design of pds1-design-director (#108, D-0024)
- **Design:** `docs/pds1/slices/108-icon-box/design.md` (PR #233)

## Context

- D-0024 (owner): no icon inside a decorative box. EntityHeader's `{ icon, hue }` media loses its tinted tile, so the icon sits straight on the card.
- Today the icon color is `plx-sys.data-color-<hue>-on-soft`, made for the soft fill. In dark mode it is 1.0 to 1.5:1 on the card once the fill is gone.
- The design asks for new `plx-comp.entity-header-media-<hue>-icon` tokens "with dark values only", pointing to lighter palette shades. Two problems:
  - Component tokens have no dark files (their contexts are density, interaction and forced colors), so a dark-only comp value can't be written.
  - A comp token pointing to `plx-ref` fails check 6.

## Options

| Option | For | Against |
|---|---|---|
| **A. New sys role `data-color-<hue>-on-surface` in the light and dark theme files; comp tokens point to it** | Theme-aware in the right tier; any part that drops a tile reuses it; checks 6 and 7 pass | 6 more sys roles |
| B. Reuse `category-<hue>-soft-border` (same dark shades for 5 hues) | No new tokens | An icon tied to a border role: a border change would recolor icons |
| C. Comp tokens straight to `plx-ref` | As the design wrote it | Fails check 6; can't differ by mode |

## Decision

**Option A.**

| Token | Light | Dark | Dark contrast on `surface-default` / `state-hover` |
|---|---|---|---|
| `plx-sys.data-color-blue-on-surface` | `{plx-sys.data-color-blue-on-soft}` | `{plx-ref.color-blue-300}` | 5.19 / 3.79 |
| `plx-sys.data-color-green-on-surface` | `{plx-sys.data-color-green-on-soft}` | `{plx-ref.color-green-200}` | 5.65 / 4.13 |
| `plx-sys.data-color-purple-on-surface` | `{plx-sys.data-color-purple-on-soft}` | `{plx-ref.color-purple-300}` | 5.26 / 3.84 |
| `plx-sys.data-color-red-on-surface` | `{plx-sys.data-color-red-on-soft}` | `{plx-ref.color-red-200}` | 5.29 / 3.86 |
| `plx-sys.data-color-brown-on-surface` | `{plx-sys.data-color-brown-on-soft}` | `{plx-ref.color-orange-200}` | 6.78 / 4.95 |
| `plx-sys.data-color-gray-on-surface` | `{plx-sys.data-color-gray-on-soft}` | `{plx-ref.color-gray-300}` | 6.31 / 4.61 |

- Light keeps today's colors (each one points to its on-soft role). Only dark changes.
- The surface media icon needs no new role: `plx-sys.content-link` is already blue-200 in dark (7.12:1).
- **Component tokens (added by the Component Engineer, with the CSS that reads them):** `plx-comp.entity-header-media-<hue>-icon` -> `{plx-sys.data-color-<hue>-on-surface}` for the six hues, and `entity-header-media-surface-icon` -> `{plx-sys.content-link}`. They go beside `entity-header-tile-*` in `components.tokens.json`. Added alone, they would fail `unused-component-tokens`.
- **Ruling (purple):** `data-color-purple*` uses blue shades in light (blue-650, blue-900): a name that lies (plan §3). Dark follows the design's purple-300, so blue and purple stay distinct. The light value is filed as a bug, not changed here (D-0004).

## Consequences

- **Semver: MINOR.** 6 new sys tokens; nothing renamed or removed. The visual change ships with the EntityHeader PR (*Changed (visual)*).
- `IconTile` stays for one release as deprecated (design row 1), per `VERSIONING.md`. That deprecation is the EntityHeader PR's.

## Enforced by

- Check 6 `token-tiers`, check 7 `token-names`, `token-sets` (light and dark define the same roles).
- `unused-component-tokens`: the comp tokens can only land with the CSS that reads them.
- G3 review of the EntityHeader PR: token names and pointers as above.
