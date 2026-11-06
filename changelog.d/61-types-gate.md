### Changed

- CI checks the published TypeScript types (#61). The new `types` job of the "New problems" checks builds `@plenix-ds/react`'s declarations and fails a pull request that adds a prop typed `any`, or a component whose whole props object is `any`. It reads `index.d.ts` and every TypeScript declaration it re-exports. Before this, the `any` count in `types-any.baseline.json` was only checked by hand, and it missed the TypeScript parts.
