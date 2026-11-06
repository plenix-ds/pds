### Deprecated

Marked going away in `platform/standards/deprecated-classes.json` (nothing in the repository uses them; they keep working until the next minor release, VERSIONING.md), with the replacement for each family (#125):

- `plx-shadow-sm`, `-md`, `-lg`, `-raised`, `-menu`, `-modal`, `-ring`, `-ring-subtle`, `-underline-focus`: `box-shadow: var(--plx-sys-shadow-<name>)` on your own class.
- `plx-span-2`, `-3`, `-5` to `-11`, `-13` to `-15`: the span classes that remain in use, or the part's own placement (ContentGrid, Columns).
- `plx-ratio-3-2`, `-3-4`, `-9-16`: `aspect-ratio: var(--plx-ref-ratio-<w>-<h>)`, or the part's own `ratio` prop.
- `plx-control-toolbar`, `-standard`, `-dialog`: `min-block-size: var(--plx-sys-control-height-<role>)`, or the component's own `size`.
- `plx-u-fs-*`, `plx-u-fw-*`, `plx-u-leading-*`, `plx-u-tracking-*`: the Text component's variants (the text roles), not a one-off size, weight or spacing.
- `plx-u-absolute`, `plx-u-top-0`, `plx-u-block`, `plx-u-justify-center`, `plx-u-text-center`, `plx-u-bg-transparent`, `plx-u-p-16px`, `plx-u-w-36px`, `-72px`, `-100px`, `plx-u-icon-box`: the matching layout part (Stack, Inline, Layout) or a token on your own class.
- `plx-ai__mark`: none; no markup used it.

### Added

- check-system rule `unused-classes`: a class defined in a Platform stylesheet that nothing produces (no component, page, test or spec, built names included) and that is not on the deprecated list is a finding (#125).
