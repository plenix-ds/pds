# ADR 0019: ContentGrid draws only the cards in view (`virtualized`)

- **Status:** accepted
- **Date:** 2026-11-06
- **Deciders:** pds1-ds-architect (G3), on the Component Engineer's proposal (#146)
- **Issue:** #146 (S3, P-39: no virtual card grid for large galleries)

## Context

- ContentGrid and AssetGallery draw every card. A gallery of thousands of assets is slow to open and scroll.
- `useVirtualizer` already has a grid mode (`grid: true`: rows of as many columns as fit). Tree and VirtualList already virtualize, Tree automatically above `TREE_AUTO_VIRTUAL` (200).
- A virtualized grid is its own scroll area. It needs a height, which a page-flow ContentGrid doesn't have today.

## Options

| Option | For | Against |
|---|---|---|
| **A. `virtualized?: boolean`, default `false` (opt-in); when on, the grid is a scroll area at its container's height** | No existing page changes; one prop | The app turns it on and gives the container a height |
| B. Automatic above a card count (as Tree) | Large galleries get it for free | A page over the count suddenly scrolls inside the grid and needs a height: a silent layout change |
| C. A separate `VirtualContentGrid` | Clear | A second component for one behavior |

## Decision

**Option A.**

- **`ContentGrid.virtualized?: boolean`, default `false`.** When true, and only with `layout: 'grid'` (the default):
  - only the card rows in view (plus overscan) are drawn, through `useVirtualizer({ grid: true })`;
  - the column count comes from the measured width and `size`'s smallest card width, as today's grid draws them;
  - the grid is a scroll area at its **container's block size** (the container gives it a height; AssetGallery and ListingPage do);
  - keyboard focus and selection work across the whole set. A focused or selected card that scrolls out of view stays drawn, and `aria-setsize` / `aria-posinset` name its place.
- **With `layout: 'masonry'` or `'justified'`**, `virtualized` is ignored, with one development warning (those layouts need every item's own size).
- **AssetGallery** passes `virtualized` through (the same prop).
- **No token:** the scroll area uses the grid's existing gap and padding tokens.

## Consequences

- **Semver: MINOR** (one optional prop on ContentGrid and AssetGallery). Nothing changes without it.
- Children stay cards as today, but they must be a flat list (the grid draws them by index).

## Enforced by

- G3 review of the build PR: the prop as above, default `false`, grid layout only, the dev warning.
- The behavior tests: only the rows in view are in the DOM; the column count follows the width; keyboard and selection across the set; a focused card that scrolls out stays; the masonry and justified warning; RTL.
