# Evidence: #60, generated files out of git

| Item | Status | Path / output |
|---|---|---|
| The audit's files are no longer tracked | Ran | `git ls-files` on `origin/main`: `platform/dist`, `platform/system/tokens`, `platform/system/steps.css`, `platform/tokens/tokens.index.json`, `dam/app/assets.js`, the page scripts `*/app.js`: 0 tracked (0.x #692; npm ci builds them) |
| Tracked files that `.gitignore` excludes | Ran | `git ls-files -ci --exclude-standard`: 0 |
| Library block current on main | Ran | `node build-exports.js`: "… unchanged" |
| Guard 1, RED | Ran (local) | `git add -f platform/dist/platform.js` → flagged; removed again |
| Guard 2, RED | Ran (local, temporary commit) | a planted export inside the library block → `build-exports.js` rewrites it → `git diff` not empty |
| Both guards in CI | Planned | This PR's run: "Generated files" job, part of `CI result` |
| Still tracked: `docs/plenix-data.js` (2.4 MB), `docs/plenix-docs.html` (2.6 MB) | Manual (Technical Writer) | Unchanged since 2026-10-08, so they cause no conflicts; `build-docs.js` (run by hand) updates them in place; whether to keep, build or retire the 0.x docs viewer is the docs owner's call |
