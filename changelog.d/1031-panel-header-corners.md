### Fixed

- `Panel`: the header's glow no longer paints over the panel's rounded top corners, which hid the border along both curves. The header's top corners take the panel's inner radius (its radius minus its border width), and a collapsed panel rounds the header's bottom corners too (#1031).
