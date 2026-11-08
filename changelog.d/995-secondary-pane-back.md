### Added

- `SecondaryPane` takes `back={{ parent, href | onClick }}`: a quiet "Back to {parent}" row above the title (a link with `href`, otherwise a button), the arrow on the title's start edge and mirrored in right to left. Folded to a rail, it is the rail's first control with a tooltip. It reuses `strings.back`, so there are no new words. New tokens `secondary-pane-back-item-*` (ADR 0038, D-0124, #995).

### Changed (visual)

- The `SecondaryPane` title is now 15px bold on every pane (was 12px, 600), so it is the strongest text in the pane: `secondary-pane-header-font-size` and `-font-weight` point to the lead size and the bold weight (D-0123, #995).
