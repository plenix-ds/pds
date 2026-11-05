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

## Items 1 and 2: apps report problems and send fixes

| Item | Status | Path / output |
|---|---|---|
| Labels `app:ctm`, `app:st-john`, `app:aiteam`, `app:redsave` | Ran | `gh label list --search app:` lists all four |
| "App report" issue form | Ran (review) | `.github/ISSUE_TEMPLATE/app-report.yml`: app, version, component, page, steps, expected, fix made; goes to the Product Lead |
| One documented step for app sessions | Ran (review) | `docs/integration/connected-apps.md`: duplicate search, then one `gh issue create` with the app label; fixes as a PR from a fork or a patch on the issue |

## Item 4 and the `/cdn/latest/` alias (2026-11-05)

| Item | Status | Path / output |
|---|---|---|
| Spec link in every release's notes | Ran (review) | `release.yml` publish job footer: "Design spec (each component page): https://design-system.lighthouseway.org/" |
| Spec page field on the App report form | Ran (review) | `.github/ISSUE_TEMPLATE/app-report.yml` field `spec` (optional; the spec site needs sign-in) |
| `/cdn/latest/` alias | Not built (superseded) | The owner's later decision on #21 (2026-11-01): apps follow the latest through `latest.json` and the page loader, RedSave and npm apps through daily update requests. Also unsafe as a folder: `curl -I /cdn/0.87.0/plenix.js` → `cache-control: public, max-age=31536000, immutable`, so a moving `/cdn/latest/` would stay stale in browsers |
| Agents reading the spec behind sign-in | Later | Single sign-on plan #156 (labelled later) |
