### Fixed

- The self-hosting archive (`plenix-<version>.tgz`) carries the `types/` folder again. Since 0.91.0, its `plenix.d.ts` imported 317 declaration files from `./types/` that the archive did not hold, so an app that copies the archive failed its typecheck. The CDN folder and `@plenix-ds/react` were not affected. The build now fails when any declaration import in the archive, the CDN folder or the npm package resolves to no file inside it (#894).
