# ADR 0055: The data font has one rule everywhere: every font role is declared "data" or "text", and a check enforces it

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's rule (chat, 2026-11-10, #1233, D-0164), which builds on D-0006 (DM Sans for text, Reddit Mono for numbers; its check `planned:lint-type-roles` was never built).
- **Issue:** #1233 (S2). The design audit (G2, `docs/pds1/slices/1233/audit.md`) decides each role. This entry owns the token names and the check.

## Context

- The owner's rule: case numbers, IDs, dates, times, amounts and counts use the data font (Reddit Mono). Names and words never do. "If this is not going to work consistently, why have it?"
- **The bug he saw:** the chart engine (`platform/charts/echarts/engine.ts`, `plenixTheme`) gives every axis label `chart-tick-label-font-family` (the data font). A category axis, which shows member names on a BarChart, is therefore drawn in Mono.
- **188 tokens set a font family:** 80 end at `typeface-mono` and 108 at the sans typefaces.
- **A token's name can't say its role:**
  - `data-grid-font-family` is the grid's words (text);
  - `text-mono-font-family` is the data role;
  - `date-badge-weekday-font-family` is a word.
- **DataGrid's column kinds:** only `data` (and `type: "bytes"`) get the data cell class (`engine/bodyRows.tsx`). The `id` and `code` kinds don't.

## Options

| Option | For | Against |
|---|---|---|
| **A. A registry: `check-system.rules/type-roles.json` declares every font-family token "data" or "text"; the check follows each token to its typeface and fails on a mismatch or a missing declaration; a frozen backlog holds today's breaks** | Exact; a new font role is always decided (with G3); the audit edits one file. | 188 entries to keep. |
| B. Infer the role from the token's name | No list | Wrong for the three names above, and more like them; it would pass wrong roles. |
| C. Check only the type-role sys tokens | Small | Misses the 180 component roles where the bugs are. |

## Decision

**Option A.**

### Tokens

- **New:** `chart-category-label-font-family` -> `{plx-sys.font-label}`: the labels of a category axis and the legend's names. It is added with the engine fix (#1233 build), with its registry line.
- `chart-tick-label-font-family` stays the data font, for value-axis ticks (numbers, dates, times). Its description says so.
- The engine reads the category role from a probe class `plx-chart__category-label`, the same way it reads the tick role today. Category axes (and the radar axis names, the TreeChart and Treemap names, the PieChart labels and the legend) use it.

### The check, `type-roles` (a style rule, `check-common.js` `STYLE_MODULES`)

- **Every token whose key ends in `-font-family`,** in every tier and file, must appear in `type-roles.json` as `"data"` or `"text"`.
  - The check follows the token's references to a `typeface-*`: `typeface-mono` is the data font, and any other typeface is the text font.
  - A data role at the text font, or a text role at the data font, fails.
  - A token with no declared role fails, and so does a declared role whose token is gone.
- **DataGrid kinds:** `data`, `id` and `code` must get the data cell class, and `name` must not.
- **Backlog** (`type-roles.baseline.json`): the breaks when the rule began, decided by the audit. It only shrinks, and a fixed entry must be removed (`--shrink`).
  - The DataGrid kinds `id` and `code`;
  - `metric-value-font-family` and `metric-card-value-font-family`, which are amounts at the text font today.
- **The seed:** each token's current role, except the two metric values, which the owner's rule makes data. The audit corrects roles in `type-roles.json` by PR.

## Consequences

- **Semver: none for this PR** (a check and two JSON files). The fixes it drives are their own PRs: the chart category role is MINOR, and the audit's corrections are PATCH or MINOR depending on what they change.
- A new component with a font role adds its registry line in the same PR; G3 sees it.
- D-0006's `planned:lint-type-roles` is now built: this check is `type-roles`.

## Enforced by

- `node check-style.js` (rule `type-roles`), in CI with the other style rules.
- `node check-system.rules/type-roles.js` alone prints `TYPE_ROLES_OK`. A mutation run (one role flipped, one removed) fails with two findings.
