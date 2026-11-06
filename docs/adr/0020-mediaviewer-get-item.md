# ADR 0020: MediaViewer builds only the shown item (`count` and `getItem`)

- **Status:** accepted
- **Date:** 2026-11-06
- **Deciders:** pds1-ds-architect (G3), on the Component Engineer's proposal (#142)
- **Issue:** #142 (S3, RedSave P-50: "MediaViewer needs every item built up front")

## Context

- MediaViewer takes `items: MediaViewerItem[]` and draws one at a time. For 1,500 images an app builds 1,500 objects on every step (RedSave: about 180 ms per Next, formatting dates for each item's `meta`).
- The viewer needs only the shown item, its neighbors (preload), and the total (the counter "{index} of {total}", wrap-around, keys).

## Options

| Option | For | Against |
|---|---|---|
| **A. `count?: number` and `getItem?: (index) => MediaViewerItem`; when both are set they replace `items`** | Builds only what's drawn; `items` unchanged; same item shape | Two props that go together |
| B. `renderItem(index)` returning the element | The app draws freely | The viewer loses the item shape it needs (kind, poster, alt, tracks); a second drawing path |
| C. Keep `items`, document "make items cheap" | No API | Doesn't fix the cost |

## Decision

**Option A.**

- **Props (additions):**
  - `MediaViewer.count?: number`: how many items there are.
  - `MediaViewer.getItem?: (index: number) => MediaViewerItem`: the item at `index` (0-based), the same shape as an entry of `items`.
- **When both are set**, they replace `items`. The viewer calls `getItem` only for the shown index and its previous and next (to preload). It never calls it for every item, and calls each index at most once per open, keeping the result until `count` or `getItem` changes identity. The counter, wrap-around, keys and `onIndexChange` use `count`.
- **Mixed or partial use:**
  - `count` without `getItem` (or the reverse) is ignored, with one development warning, and `items` is used.
  - Both pairs given (`items` plus `count` / `getItem`): `count` / `getItem` win, with one development warning.
- **Docs:** `getItem` must be cheap and pure (it may run on the render path); build heavy fields such as formatted `meta` inside it, for that one item.
- `items` stays exactly as today. No change for existing callers.

## Consequences

- **Semver: MINOR** (two optional props). `MediaViewerProps` gains them in `MediaViewer.tsx`; `MediaViewerItem` is unchanged.
- ContentGrid and AssetGallery's lightbox (#146) can pass `count` / `getItem` over a virtualized set later. That's their own change.

## Enforced by

- G3 review of the build PR: the two props as above, `items` unchanged, the warnings.
- The behavior tests: `getItem` is called only for the shown index and its two neighbors (counted with a spy over 1,500 items); the counter and wrap-around use `count`; a partial pair warns and falls back to `items`; RTL.
