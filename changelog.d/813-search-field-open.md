### Fixed

- SearchField: the wide field no longer passes `open` and `onOpenChange` (meant for the collapsed button) to its `<input>`, which made React warn "Unknown event handler property" in CommandBar (#813).
