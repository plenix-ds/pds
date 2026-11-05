# ADR 0013: Every variation as its own record (derived ids, side tables, API)

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect, on the owner's direction (2026-10-23 in plenix-platform#264: "each variation to have its own record"); decision D-0050 (owner may switch)
- **Issues:** #117 (this), #116 (styling per variation, which builds on it)

## Context

- The design spec has 1,186 variations, written as `vp(leaf, group, name, lab, text, use, avoid)` entries in the `variantPages` of 307 item records (`platform/design-system/inventory.js` and `parts/*.records.js`). `build-spec-parts.js` passes them through as-is.
- A variation has no id of its own, so it can't be linked to, mapped (Figma #251, other systems), given platforms, or given its own styling properties (#116).
- `/api/v1/components.json` doesn't expose variations at all.

## Options

| Option | For | Against |
|---|---|---|
| **A. Derive a record per variation at build time, with a stable id; new per-variation fields go in side tables keyed by that id** | No content moves (about 200 files untouched); ids are stable and checked; each new concern (styling, Figma, platforms) has its own table and owner | A variation's data lives in two places: its words in the item, its extras in side tables |
| B. Move the 1,186 entries into separate variant files (`variants/<item>.js`) | One place per variation | Churn on about 200 files and every open spec PR; no gain for readers of the spec or API; `vp()` would grow to a dozen arguments |

## Decision

**Option A** (D-0050; reply B on #117 to switch).

**The variant record** (built by `build-spec-parts.js`, one per `variantPages` entry):

```ts
type VariantRecord = {
  id: string;        // `${item.id}--${slug(group)}-${slug(name)}`, e.g. "brand-logo--tone-one-color"
  item: string;      // the item record's id
  group: string;     // "Size", "Tone", "Variant", "State" …
  name: string;      // as written
  leaf: string;      // the variation's page title
  props?: object;    // the lab props (`lab`), e.g. { size: "sm" }
  text: string; use: string[]; avoid: string[];
  labId?: string;
};
```

- `slug` is lower case, letters and digits, with runs of anything else becoming one `-`.
- The build **fails** on two variations with the same id, or on an id that changes for an unchanged entry. A rename changes the id on purpose; the old id goes to `variant-redirects.json` so links keep working.
- **Side tables**, each keyed by variant id, in `platform/standards/variants/`: `styles.json` (#116), `figma.json` (#251), `platforms.json`, `mappings.json`. The build checks that every key is a real variant id. Each table is added by the issue that needs it.
- **Spec:** each variation's page and card use the record's id as their anchor (`#/<item>/<id>`).
- **API (additions):** `/api/v1/variants.json` (every record, with its side-table fields merged), and `components[].variants` (the ids, in order).

## Consequences

- **Semver: MINOR** (new API file and field). Spec URLs gain stable anchors.
- The content stays where its authors write it. #116 then adds `styles.json` without touching `vp()`.
- Shapes agreed for `/api/v1` with pds1-release-architect on the implementation PR (API contract tests, plan §8).

## Enforced by

- `build-spec-parts.js`: duplicate ids, or side-table keys that aren't ids, fail the build (the check-system `generated` rule runs it).
- The API contract test for `variants.json` (P0-12, the release job).
