### Deprecated

- 63 utility classes that nothing in the repository uses (`plx-span-*`, `plx-shadow-*`, `plx-ratio-*`, `plx-control-*`, a few `plx-u-*` and more) are marked going away in `platform/standards/deprecated-classes.json`; they keep working until the next minor release (#125, VERSIONING.md). `plx-ai__mark`, which no markup produced, is removed.

### Added

- check-system rule `unused-classes`: a class defined in a Platform stylesheet that nothing produces (no component, page, test or spec, built names included) and that is not on the deprecated list is a finding (#125).
