### Changed

- TypeScript wave 5 (#781, ADR 0011): `platform/index.js` is now `platform/index.ts` and the `platform/exports/w*.js` re-export lists are `w*.ts`. `build-exports.js`, the Vite configs, `build-packages.js`, `build-types.js`, `build-standards.js`, the ownership check and the tests that read those paths follow. The public API, the bundles and the published declarations are unchanged (606 exports).
