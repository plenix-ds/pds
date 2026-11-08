### Changed

- Read-only look (owner's preset, D-0106; #946, ADR 0032): a `PropertyList` value sits on the porcelain tile with a same-tint 1px border, its label is 11px regular navy, its value 13px semibold. A `Field` label inside a read-only region takes the same label role. Label and value are at least 4.5:1 on the tile in light and dark.

### Added

- `PropertyGroup` (`@plenix-ds/react`): a `<section>` named by its heading, over one `PropertyList`. The heading is 13px medium gold sentence case, and a group that follows another sits 40px below it (#946, ADR 0033, D-0111).

### Deprecated

- `--plx-comp-property-list-label-font-size`: the PropertyList label takes the field-label role (`--plx-sys-text-field-label-*`) directly. The token keeps working and is removed in 2.0.0. `--plx-comp-property-list-value-font-size` and `--plx-comp-property-list-value-data-font-size` stay, now 13px (`--plx-sys-text-field-value-font-size`) (#946, D-0106).
