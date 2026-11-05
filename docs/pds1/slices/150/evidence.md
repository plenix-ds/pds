# Evidence: #150 (RedSave P-38), no remote addresses in the bundle

| Item | Status | Path / output |
|---|---|---|
| Live 0.86.0 bundles | Ran | `plenix.esm.js` (2.66 MB), `plenix.js` (2.52 MB), `plenix-engines.js` from `/cdn/0.86.0/`: the only http(s) strings are the SVG namespace and `https://plenix.invalid/` (a parse base in `hrefOf`) |
| How runtime files are found in 0.86.0 | Ran (read) | icon library: relative to the bundle's own URL (`icons/library/`, or `../material/<commit>/` only when the bundle itself is under `/cdn/<v>/`); engines: `./vendor/` beside `plenix-engines.js`; PDF: `import(pdfModuleUrl)`, a prop the app passes (off by default) |
| Guard, RED | Ran | `no-remote-code.mjs` on a fixture with `"https://design-system.lighthouseway.org/cdn/" + v + "/vendor/"` → REMOTE_FAIL, exit 1 |
| Guard, GREEN | Ran | `no-remote-code.mjs` on the live 0.86.0 bundles → REMOTE_OK (3 scripts) |
| Guard, empty input | Ran | no script found → REMOTE_FAIL (never a silent pass) |
| Guard in the release dry run | Planned (CI) | This PR's "Release (dry run)" run: `release/cdn/<v>/*.js` and `release/packages/react/*.{js,mjs,cjs}` |
