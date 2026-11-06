### Added

- ContentGrid and AssetGallery take `virtualized` (default false; ADR 0019, #146): only the card rows in view are drawn, in a scroll area at the container's height, for galleries of thousands of cards. Each card keeps its place in the set (`aria-posinset` of `aria-setsize`), a focused card stays drawn when it scrolls out of view, and masonry and justified ignore it with one development warning.
- `useVirtualizer` in a grid with `mode: "measured"` now measures each row (its tallest card) instead of assuming equal rows.
