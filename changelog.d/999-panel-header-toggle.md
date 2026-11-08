### Added

- `Panel` takes `toggleOn="header"` (default `"button"`, today's behavior): with `collapsible`, a click anywhere on the header toggles the panel, as the Collapse/Expand button does. Actions, interactive children and a click that ends a text selection do not toggle; the button stays the only focusable control. Hovering or pressing the header lights the button's own hover or pressed look (no header fill), with a pointer cursor. New token `panel-toggle-pressed-background` (ADR 0041, D-0129, #999).

### Fixed

- A closed `Panel`'s chevron now points left in right to left (it pointed right), as the `Card`'s does.
