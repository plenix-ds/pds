# #108: no icon inside a box, the inventory (G2)

- **Rule:** D-0024 (owner, 2026-10-24 and 2026-11-01). By default no icon sits on a decorative tile; a box stays only where a specific usage needs it. Icon buttons are controls, not covered.
- **Done already:** #882 (commits a19691f5, a1683336, PR #901) removed the box in six parts: EntityPicker, FeatureCard, MetricCard, RoleManager, PeopleGroup, ConnectedAccounts.
- **Method:** every `platform/**/*.css` rule on an icon, tile, thumb, placeholder or media selector that has a filled background and a border or radius (origin/main, 2026-11-05). App screens use only Platform parts, so the list covers them.

## What is left

| # | Part | What it draws | Used by | Recommendation (A, applied unless the owner says otherwise) |
|---|---|---|---|---|
| 1 | `IconTile` | icon on a tinted 32/40/48px square, hue or tone | EntityHeader `media: { icon, hue }`; no app screen calls it directly | **Remove the tint and frame from EntityHeader's `{ icon, hue }` media**: the icon fills the 44px (32px) square, in the hue's on-soft colour. Keep `IconTile` itself for one release as deprecated (public API, CTM may use it) |
| 2 | EntityHeader fact icon | icon on a small bordered tile beside a fact | EntityHeader facts | **Remove** the tile: icon at the tile size, `content-muted` |
| 3 | MediaCard placeholder | the media area's fill when there is no picture | MediaCard, AssetGallery | **Keep.** It is the picture's frame, not an icon tile: the card keeps its shape when the image loads. The placeholder icon inside it already has no box |
| 4 | Timeline icon marker | event icon in a circle the size of the marker | Timeline `icon` events | **Keep.** The circle is the timeline's marker on the line (a structural mark, like a dot), not decoration. Changing it is an owner call |

## State matrix (rows 1 and 2, after the change)

| State | Tokens |
|---|---|
| default | icon in `category-on-soft` of its hue (1) / `content-muted` (2); no background, no border |
| hover, focus, active, selected | n/a (not interactive; the row or card around it carries the state) |
| disabled | n/a (follows its container's `state-disabled-opacity`) |
| loading | n/a (EntityHeader's own skeleton) |
| error | n/a (no error state) |
| empty | no icon given: EntityHeader shows its default kind icon, unchanged |
| long text | n/a (no text) |

- Densities: the icon size follows the existing tile size tokens (`entity-header-media-size`, `entity-header-fact-icon-tile-size`) in every density.
- Light and dark: hue on-soft colours are the data colours (the same in both). `content-muted` passes AA in both (DESIGN.md §2).
- RTL: none of these icons shows direction; no flip.
- Check: D-0024 is review-only (pds1-design-critic). There is no reliable static check.

## Before the build

- The issue asks for a before and after of each kind for the owner. The pictures for rows 1 and 2 come next, then the build after his look (a pixel change).
