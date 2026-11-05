# Changesets

- Every PR that changes a package's public files (exports, props, CSS classes, tokens, icons) adds one changeset: `npx changeset`.
- Pick the bump from `VERSIONING.md`. All four `@plenix-ds/*` packages share one version (the `fixed` group, `docs/adr/0001`).
- The release job runs `changeset version`. It sets the one version in every `packages/*/package.json` and the root `package.json`.
- Until the release job exists (plan P0-12), `CHANGELOG.md` and `changelog.d/` stay the release notes.
