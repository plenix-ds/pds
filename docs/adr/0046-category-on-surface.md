# ADR 0046: "category-<hue>-on-surface" (a category's text color on the page surface) and the Cascader placeholder

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on #1074 (the axe story run, #909; root cause by pds1-component-engineer CE2). Decision D-0137 (owner may switch).
- **Issue:** #1074 (S3).

## Context

- In dark mode, axe color contrast fails on two parts.
- **Cascader placeholder:**
  - `cascader-placeholder-text` -> `content-subtle` is 3.04:1 on the dark field.
  - Combobox and Input use `field-placeholder`, which passes in both themes.
- **DataPill plain** (`.plx-data-pill--plain` with a category):
  - The text is `--plx-comp-category-on-soft`. That is the text color for a category's soft fill: a 700 or 800 shade in both themes, because the soft fill stays light in dark mode.
  - A plain pill has no fill, so the text sits on the page surface. In dark mode that is 1.06 to 1.44:1 on `surface-default` (#444).
- No token says "a category's color as text on the surface". The plain pill is the only part that needs one today.
- Measured with ref hex values on the dark surfaces (#444 and #000), the lightest is the binding case.
  - Each named hue has an existing 200 or 300 shade from 5.10 to 6.78:1.
  - Mostly that shade is already its `soft-border` token. Cyan, pink and lavender instead have 300 shades of 5.26 to 6.18:1.
  - The numbered `category-1..8-on-soft` already map to those shades in dark mode, so they pass.

## Options

| Option | For | Against |
|---|---|---|
| **A. New sys `category-<hue>-on-surface` per category, and comp `category-on-surface` set per category** | Keeps the hue, which is what a plain pill means. It uses existing ref shades only, with no new colors. The name says its role. | 29 sys entries per theme, one per category. |
| B. In dark mode, plain pills use `inherit` for the text and keep the hue on the icon only | No new tokens | The name loses its category color, so the plain pill no longer means anything in dark mode. |
| C. Plain pills read `category-<hue>-soft-border` for the text | No new tokens | A border role used as text. Cyan, pink and lavender borders still fail (1.10 to 1.41:1). |

## Decision

**Option A** (D-0137; reply B or C on #1074 to switch).

### Cascader

- `plx-comp.cascader-placeholder-text` -> `{plx-sys.field-placeholder}`, as Combobox and Input do. It is a remap, not a new token.

### `plx-sys.category-<hue>-on-surface` (new, in both theme files)

- **Light:** `{plx-sys.category-<hue>-on-soft}` for every category, which is today's value, so light mode doesn't change.
- **Dark:**

| Category | Dark value | On #444 |
|---|---|---|
| red, maroon | `{plx-ref.color-red-200}` | 5.29 |
| green, lime, mint | `{plx-ref.color-green-200}` | 5.65 |
| yellow | `{plx-ref.color-yellow-300}` | 5.72 |
| blue, navy | `{plx-ref.color-blue-300}` | 5.19 |
| orange, apricot, brown | `{plx-ref.color-orange-300}` | 5.10 |
| purple, lavender | `{plx-ref.color-purple-300}` | 5.26 |
| cyan | `{plx-ref.color-cyan-300}` | 6.18 |
| magenta | `{plx-ref.color-magenta-300}` | 5.69 |
| pink | `{plx-ref.color-pink-300}` | 5.78 |
| teal | `{plx-ref.color-teal-300}` | 6.14 |
| beige, olive | `{plx-ref.color-orange-200}` | 6.78 |
| gray, grey | `{plx-ref.color-gray-300}` | 6.31 |
| 1 to 8 | `{plx-sys.category-<n>-on-soft}` (already the 300 shades in dark) | 5.10 to 6.31 |

- Aliases keep their alias form: `brown` -> `{plx-sys.category-orange-on-surface}` and `grey` -> `{plx-sys.category-gray-on-surface}`. In the forced-colors and more-contrast theme files, the entry follows that file's `on-soft` entry.

### `plx-comp.category-on-surface`

- `build-steps.js` adds `--plx-comp-category-on-surface: var(--plx-sys-category-<hue>-on-surface)` to each `[data-plx-category]` rule. `steps.css` is generated, so it is never edited by hand.
- **`.plx-data-pill--plain` reads `--plx-comp-category-on-surface`.** Every other part keeps `category-on-soft`, because they draw on the soft fill.

### Not in this change

- Timeline, Tag and Avatar keep `on-soft`, because they draw on a fill. A later part that puts a category color as text on the surface uses `category-on-surface`.

## Consequences

- **Semver: PATCH** (*Fixed*: dark-mode contrast for Cascader's placeholder and plain DataPills). The new tokens are internal roles with no new prop. They also go in the changelog as *Added* (tokens), so a consumer reading `--plx-sys-category-*` sees them.
- Light mode doesn't change.
- `tests/baselines/stories-axe.json` drops the two failures (`node tests/stories-axe-909.test.js --update`).

## Enforced by

- G3 on the build PR: the token diff matches this entry (29 sys entries per theme, one comp entry per category in `build-steps.js`, and the Cascader remap).
- Checks 6 and 7 on the new tokens.
- Check 8 (contrast) and the axe story run (#909): no color-contrast failure for Cascader or plain DataPill in light and dark.
- A build test: every `category-<hue>-on-surface` measures 4.5:1 or more on `surface-default` in both themes.
