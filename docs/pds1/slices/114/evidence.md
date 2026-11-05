# Evidence: #114, connected apps (registry + drift report at every release)

Owner decisions on #114 (2026-10-29): option A, always the newest, once an app's scan is at zero; GO on the plan `~/handoff/decisions/273-plan.md` (scan, registry, drift at each release, reports). PR 1 (the scan, `tools/baseline/scan.js`) was merged in 0.x.

| Item | Status | Path / output |
|---|---|---|
| Registry of connected apps (item 5) | Ran (review) | `tools/baseline/apps.json`: CTM and St. John (public, scanned), the suite (this repository), AITEAM and RedSave (not reachable: their maintainers run the scan) |
| Reachability | Ran | `LighthouseCollection/CTM` and `LighthouseCollection/st-john-test-site` are public; AITEAM and RedSave repositories not found |
| Drift tool, unreachable app | Ran (scratch registry) | a missing repository → "unreachable", DRIFT_OK, exit 0 (a release never fails because of an app) |
| Drift tool, broken registry | Ran (scratch registry) | DRIFT_FAIL, exit 1 (the report is never skipped silently) |
| Real scans of CTM and St. John | Planned (CI) | This PR's "Release (dry run)": drift.md in the job summary and the records |
| `/cdn/latest/` alias, app switches | Planned | Web-server change; goes live with a release on the owner's go (publishing hold) |
