### Changed (visual)

- Button (#109, D-0037, docs/adr/0004): the neutral, subtle and outline variants (secondary, tertiary, ghost, danger-secondary) show Fluent 2's state layer. Their fill no longer changes on hover or press (tertiary and danger-secondary no longer fill solid); a see-through layer of the text colour sits over it, 8% on hover, 10% pressed and 10% on keyboard focus (`--plx-comp-button-state-layer-*`, from `--plx-sys-state-layer-*`). Primary and danger keep their stepped fills. Disabled buttons show no layer.
