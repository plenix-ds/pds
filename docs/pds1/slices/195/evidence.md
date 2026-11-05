# Evidence: #195 (P0-13), dashboard publishing

| Item | Status | Path / output |
|---|---|---|
| Collector runs | Ran (local, VM 131) | `python3 dashboard/pds1/collect.py <scratch>`: "data.js: 95 tasks, 1 owner decisions, 37 decisions" (73 KB) |
| zizmor on `dashboard.yml` | Ran | No findings (1 ignored with reason: `issue_comment` never reads the comment text and only checks out main) |
| Pages environment allows main | Ran | `github-pages` branch policies: gh-pages, main |
| Pages source switched to GitHub Actions | Planned | After merge, then a `workflow_dispatch` run |
| Live page shows a fresh snapshot | Planned | `curl https://plenix-ds.github.io/pds/data.js` after the first run |
| Screenshots tab fed by CI | Planned | After visual regression lands (P0-9) |
