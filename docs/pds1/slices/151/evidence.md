# Evidence: #151 (RedSave P-36), only the styles a page uses

| Item | Status | Path / output |
|---|---|---|
| Per-part styles in `@plenix-ds/styles` | Ran (read) | Already built since the owner's #55 direction (tree-shake the stylesheet): `foundations.css` 162.7 kB + 272 `parts/*.css` (data-grid 118.9 kB, image-editor 55.0 kB, time-grid 24.2 kB); `check-bundle.js` proves they add up to `plenix.css` (STYLE_PARTS_OK) |
| Gap | Ran | The packages are restricted (#50, deferred), so self-hosting apps such as RedSave get files from the CDN or its archive; `/cdn/0.86.0/parts/button.css` and `/cdn/0.86.0/foundations.css` answer 404 |
| RED | Ran (CI) | Release dry run 42028261128 (before the fix): `PARTS_FAIL: release/cdn/0.86.1-dryrun.4/foundations.css is missing` |
| GREEN | Planned (CI) | This PR's dry run: PARTS_OK (CDN parts equal the package's, byte for byte, and the archive lists every one) |
| `plenix.css` unchanged | Ran (review) | The one-file stylesheet is still written as before (#55: the CDN files stay as they are for apps that use the one file); the parts are additive and only in new versions (published versions are immutable) |
