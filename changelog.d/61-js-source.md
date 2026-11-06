### Changed

- check-system has a `js-source` rule. A `.js` or `.jsx` file under `platform/` must be listed in `platform/standards/js-source.json`, either as allowed (with its reason) or as pending conversion; every other source is TypeScript (ADR 0011, closing addendum, D-0089).
