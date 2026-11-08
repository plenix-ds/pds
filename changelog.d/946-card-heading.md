### Changed (visual)

- `Panel` header (D-0106, #946): the title is the card heading, 14px bold UPPERCASE in the default ink with its icon; the header paints a soft glow from the top of the card down to the heading line, and the divider under it is inset to the header's padding instead of running edge to edge (a collapsed panel keeps the glow and shows no divider).
- `SectionHeading` (D-0110, #946): draws with the same card-heading tokens, so a page section heading and a card heading can never drift apart. Its size no longer follows its level.

### Added

- `SectionHeading` takes `icon`, like `Panel`'s: an icon name or element before the label, decorative (hidden from assistive technology), with the Panel title icon's size and gap, and the class `plx-section-heading--icon` (and `plx-section-heading__toggle--icon` on a collapsible heading's button) (ADR 0035, D-0114, #946).

### Deprecated

- `--plx-comp-panel-header-border-bottom-color`: the Panel header's divider is inset now and reads `--plx-comp-panel-header-divider-color`; the old token is kept and removed in 2.0.0.
- The classes `plx-section-heading--level-2`, `-3` and `-4` no longer set a size (the heading draws with the card heading's type at every level). `SectionHeading` still emits them; they are removed in 2.0.0.
