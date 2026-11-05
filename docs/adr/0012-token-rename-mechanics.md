# ADR 0012: Token rename mechanics and the names of the palette scales

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (#184)
- **Supersedes:** ADR 0002's "Rename mechanics" (the `renames.json` file). Its tiers, naming rules and deprecation period stand.

## Context

- ADR 0002 planned a `packages/tokens/renames.json` (old -> new), from which the token build would write each old name as an alias.
- Since then, Style Dictionary is the token build (#287). A token that points to another is already written as `--old: var(--new)`, and `$deprecated` already shows on the token page and in the index (#214, #243, #244 used it).
- Check 7 (`token-names`) baselined 200 names that contain values. 62 are `plx-ref.size-*`, 13 `space-*`, 12 `font-size-*`, and the rest are smaller families.

## Options

| Option | For | Against |
|---|---|---|
| **A. The alias lives in the token JSON: the token gets its new name, and the old name stays beside it as `{"$value": "{new}", "$deprecated": "…"}`** | No new file or build step; Style Dictionary writes it like any token; one place to read | Old and new sit side by side in the source until 2.0.0 |
| B. `renames.json` and a build step that writes the aliases (ADR 0002) | Sources stay clean | A second source of truth, and custom build code (#712) |

## Decision

**Option A.**

- **Every rename:**
  - The token's key changes. The old key stays right after it, as `{plx-ref|sys|comp.<new>}` with `$deprecated: "Renamed: use --<new> … removed in 2.0.0."`.
  - Every reader moves to the new name: tokens, CSS, JS, the spec, the published study pages and the tests.
  - The `token-tiers` baseline keys are renamed too: the same debt under its new name.
- **Check 7** skips `$deprecated` tokens, since they are on their way out. A renamed entry leaves the `token-names` baseline (shrink-only).
- **Names for the palette scales** (`plx-ref`): a T-shirt step when a scale has a few named sizes, an ordinal step when it is long.

| Scale | Old | New |
|---|---|---|
| Corner radius | `radius-0px`, `-2px`, `-4px`, `-6px` | `radius-none`, `-xs`, `-sm`, `-md` |
| Border width | `border-width-1px` … `-4px` | `border-width-100` … `-400` |
| Opacity | `opacity-30`, `-45`, `-50`, `-70` | `opacity-300`, `-450`, `-500`, `-700` |
| Size (D-0047) | `size-4px` … `size-1600px` | **grid units, 1u = 4px**: `size-1u` … `size-400u` (`size-92px` -> `size-23u`). `size-18px` (off the 4px grid) is not renamed: it's a grid defect, filed on its own |
| Space, control size (part 3) | `space-4px` … `-64px`, `control-size-24px` … `-52px` | grid units: `space-1u` … `space-16u`, `control-size-6u` … `-13u`. `space-6px` and `space-10px` (off the grid) are not renamed (#301) |
| Font size (part 3) | `font-size-12` … `-36` (09/10/11 already deprecated) | ordinal by size: `font-size-100` (12px) … `font-size-900` (36px) |
| Font weight (part 3) | `font-weight-regular-400` … `-bold-700` | `font-weight-regular`, `-medium`, `-semibold`, `-bold` |
| Breakpoint, content max, grid columns / margin / gutter (part 3) | `breakpoint-600px` …, `content-max-760px` …, `grid-columns-4` … | T-shirt by size: `sm`, `md`, `lg`, `xl` |
| Glyph size, motion scale (part 3) | `glyph-size-6px` … `-18px`, `motion-scale-98` / `-96` | `glyph-size-xs` … `-lg`; `motion-scale-sm` (0.98), `-md` (0.96) |
| System and component names (part 4) | `radius-card-4px` …, `…-from-1440` | chosen in part 4 |

- An ordinal step is never the value. `opacity-300` is 0.3, and check 7 reads 0.3 as 0.3 or 30, never 300.
- A grid unit counts 4px steps, so `size-23u` is 92px. The number is the step on the grid, not the value, and nothing reads the value from the name: code that needs the px (`build-steps.js`, `size-scale`, `pane-defaults`) resolves the token's value.

## Consequences

- **Semver: MINOR per rename PR.** New names are added and old names deprecated; none is removed before 2.0.0.
- `--plx-ref-*` readers outside Plenix (CTM) keep working through the aliases. The changelog lists each old -> new pair under *Deprecated*.
- 2.0.0 removes every `$deprecated` alias in one change.

## Enforced by

- Check 7 `token-names` (shrink-only baseline; deprecated names skipped) and check 6 `token-tiers`.
- `npm run tokens:sd:check` (`--sets`, `--bytes`): every alias resolves to the same value.
