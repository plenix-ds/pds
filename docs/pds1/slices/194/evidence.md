# Evidence: #194 (P0-12), publish dry-run

| Item | Status | Path / output |
|---|---|---|
| Immutability refuses a published version | Ran (local, live CDN) | `preflight.mjs 0.86.0 --expect-published`: listed in `/cdn/index.json` (239 versions) and `/cdn/0.86.0/` answered 403 → "refused as already published" |
| Immutability passes an unpublished version | Ran (local) | `/cdn/9.9.9/` and `/cdn/0.86.1-dryrun.1/` answer 404; `preflight.mjs 9.9.9 --expect-published` → FAIL (not published), as expected |
| `latest.json` keeps its shape and pins | Ran (local) | live `{"latest":"0.86.0","pins":{}}` → `{"latest":"0.86.1","pins":{}}` (diff: only `latest`); fixture with `pins.ctm` and an extra field: both kept |
| `latest.json` refuses a non-newer version | Ran (local) | `latest.mjs 0.86.0` → "LATEST_FAIL: 0.86.0 is not newer than the current latest 0.86.0" |
| zizmor on `release.yml` | Ran | No findings |
| Full dry run: build, one version, budgets, SHA256SUMS + version.json (verified with `sha256sum -c`), npm `--dry-run`, live CDN check | Planned (CI) | This PR's "Release (dry run)" run |
| Real publish (tag → npm + CDN + API), live smoke test, automatic rollback | Planned | Later PR on #194, after the owner lifts the publishing hold (2026-10-29) |
| Deploy key for VM 130 | Manual (owner) | Needed for the real publish; no agent holds it |
