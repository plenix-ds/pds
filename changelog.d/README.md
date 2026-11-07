# changelog.d

One file per pull request, `<pr-number>.md`, holding that PR's CHANGELOG lines under their section heading (`### Added`, `### Changed`, `### Fixed`, `### Deprecated`, `### Breaking`). A PR never edits CHANGELOG.md itself; the Lead folds these fragments into `CHANGELOG.md` at the release and deletes them.

A release PR (one that changes `version` in `package.json`) fails CI while any fragment is left here, including in its merge-queue group. A fragment merged ahead of it in the queue must be folded on the release branch before the PR is queued again (`tools/ci/check-release-notes.mjs`, #884).
