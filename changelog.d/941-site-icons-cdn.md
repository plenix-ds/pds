### Added

- The site-icon tool ships on the CDN and in its archive (RedSave P-64, #941): `node tools/site-icons.cjs <site> <source folder> --out <folder>` writes `plenix-icons-<site>.js` from a site's source (JavaScript, TypeScript, JSX, TSX and HTML) with no install, because its scan and parser are bundled into the one file. It knows the same icons as `npx plenix-site-icons` from `@plenix-ds/icons`. Every release now proves both run in a fresh app (`tools/publish/site-icons-fixture.sh`).
