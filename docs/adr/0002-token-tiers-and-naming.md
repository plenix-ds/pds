# ADR 0002: Token tiers and naming

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (decision D-0023)
- **Issue:** plenix-ds/pds#178 (Phase 0, lint checks 6 and 7; Style Dictionary)

## Context

Measured on `main` at f54de1e4 (`platform/tokens/**/*.tokens.json`):

| Tier | Tokens | Names with a value in them | Points straight at `ref` |
|---|---|---|---|
| `plx-ref` | 273 | 232 (as `font-size-13`, `control-size-24px`, `color-black-alpha-50`) | n/a |
| `plx-sys` | 1,207 | 40 (as `radius-control-4px`, `radius-pill-4px`) | allowed |
| `plx-comp` | 5,577 | 99 (as `secondary-pane-width-sm-from-1440`) | **1,115** |

- Plan §3 lists names that contain values, and palette names that lie (`yellow-600 -> green-500`). In 0.85, five radius names all equal 6px.
- Plan §7 checks 6 and 7: no comp -> ref references; token names may not contain values.
- CTM auto-upgrades from `cdn/latest.json`. A token rename without an alias breaks CTM on the next upgrade.

## Options

| Option | For | Against |
|---|---|---|
| **A. Rename in 1.0.0, keep every old name as a deprecated alias until 2.0.0** | CTM keeps working; follows the deprecation rule (warning, docs note, minor release, removal in the next major) | About 1,500 extra alias lines in the CSS until 2.0.0 |
| B. Rename in 1.0.0 with no aliases (1.0.0 is a major) | Smallest CSS | Breaks CTM and any page pinned to old names on the first upgrade |
| C. Don't rename; only block new defects | No churn | The defects stay in the public API through all of 1.x |

## Decision

**Option A.**

**Tiers (DTCG, three only):**

- `plx-ref`: the raw palette and scales. The only tier that holds literal values (hex, px, ms). Products read it but never use it directly.
- `plx-sys`: roles (surface, content, border, accent, radius-control, space-inline-md, type roles, motion). It refers only to `plx-ref`.
- `plx-comp`: one component's decisions. It refers only to `plx-sys`, or to another `plx-comp` token of the same component.
- No other tier. The native outputs (`plx-platform-android`, `plx-platform-ios`) are outputs of `build-mobile.js`, not a tier, and follow the same rules.

**Naming:**

- A name says the role or the step, never the value. A step is an ordinal (`100`–`900`) or a T-shirt size (`2xs`–`4xl`).
- Not allowed in any name: a unit (`px`, `rem`, `em`, `ms`, `s`, `%`), or a number that equals the token's value or a breakpoint in px (`radius-card-12px`, `size-4px`, `font-size-13`, `from-1440`).
- `ref` palette steps (`color-blue-500`) are allowed; the step must keep its order (a higher step is never lighter in light mode). An alpha step is an ordinal too: `color-black-alpha-50` becomes `color-black-alpha-200`, with the step table in `DESIGN.md`.
- Breakpoints are named by role (`from-wide`, `from-ultrawide`), with the px values in `plx-ref`.

**Rename mechanics:**

- The rename table lives in `packages/tokens/renames.json` (`old -> new`). The token build writes each old name as `--old: var(--new);` with a `/* deprecated: use --new, removed in 2.0.0 */` comment.
- Every alias is listed under **Deprecated** in the 1.0.0 changelog and shown as Deprecated on the token page.
- The 1,115 comp -> ref references get a `plx-sys` role each. Where several share a value and a meaning, they share one role. A comp token never gets a new ref value: it gets a new sys role or reuses one.
- Visual output stays identical: every renamed or re-pointed token resolves to the same computed value (`check-system` `style-dictionary` comparison plus visual regression).

## Consequences

- **Semver:** the new names are additions (MINOR content inside 1.0.0); the old names become deprecated, not removed. Removal is a 2.0.0 change.
- The CSS grows by the alias lines until 2.0.0. The bundle budget (plan §7c) counts them, and the 2.0.0 removal recovers them.
- New tokens that break either rule block the PR from today, even while the old debt is still there (diff-aware, plan §7).
- The `yellow-600 -> green-500` kind of lie is fixed by renaming the alias, not by changing the color (D-0004: the design stays as-is).

## Enforced by

- **Check 6** `token-tiers` (`check-system.rules/token-tiers.js`, planned): every `plx-comp` value refers only to `plx-sys` or the same component's `plx-comp`; every `plx-sys` value refers only to `plx-ref` or `plx-sys`; only `plx-ref` holds literals. Diff-aware against `tools/baseline` (1,115 known findings, shrink-only).
- **Check 7** `token-names` (`check-system.rules/token-names.js`, planned): the naming rules above, on every tier. Diff-aware, shrink-only baseline (371 known findings).
- `planned:ownership`: only `pds1-ds-architect` edits token-tier files and `renames.json`.
