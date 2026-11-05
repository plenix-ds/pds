# ADR 0008: `shape-pill` is renamed `shape-mark`

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect, on pds1-design-director's call (#240, option B)

## Context

- `plx-sys.shape-pill` is 6px. D-0005 says pills are 4px, which made it look like a defect.
- No pill reads it. Every reader is a round mark: status dot, progress-bar track and fill, timeline marker, list step, sheet grabber, typing dots, round swatch, date badge, unread mark, spotlight beacon, metric-card bar, diagram terminal, pictogram, data-grid scroll thumb, field info, and the `plx-u-radius-pill` / `plx-u-border-radius-pill` utilities.
- 6px for round marks is the owner's choice (2026-10-27, `platform/system/radius.css`). Real pills are already 4px (`radius-pill-4px`).
- So the defect is the name (it says pill, it shapes marks), not the value.

## Options

| Option | For | Against |
|---|---|---|
| **A. Rename to `shape-mark`; keep `shape-pill` as a deprecated alias until 2.0.0** | The name matches its use; nothing looks different; nothing breaks | One alias until 2.0.0 |
| B. Set `shape-pill` to 4px | Matches the word "pill" | Changes every dot and track against the owner's 2026-10-27 choice |

## Decision

**Option A.**

- `plx-sys.shape-mark` = `{plx-ref.radius-6px}`, beside `shape-none` … `shape-xl`.
- `plx-sys.shape-pill` = `{plx-sys.shape-mark}` with `$deprecated`.
- Every reader moves to `shape-mark`: 16 files (component token files, `utilities.css`, `keylines.css`, `radius.css` notes, and the design spec's labs).
- The utility class names `plx-u-radius-pill` and `plx-u-border-radius-pill` stay: they're public, and renaming them is a separate decision.

## Consequences

- **Semver: MINOR.** 1 token added, 1 deprecated. Every value resolves the same (6px), so nothing looks different.
- 2.0.0 removes `shape-pill`.

## Enforced by

- Check 7 `token-names` and `token-definitions` (corners on the scale).
- `$deprecated` on `shape-pill`; the check-style `defined` rule keeps readers on a defined token.
