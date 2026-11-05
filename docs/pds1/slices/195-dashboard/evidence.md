# Evidence: #195 dashboard, against the brief's acceptance criteria

The page is live at https://plenix-ds.github.io/pds/ (built in #218, published automatically since #231). The owner answered D-0034 "A" and "I believe this is complete" (2026-11-05). Checked by reading `dashboard/pds1/app.js` and `collect.py` on `main`, and by running the collector; no browser test was run (the owner starts tests).

| AC | Status | Where / output |
|---|---|---|
| AC-1 "To decide" shows an applied decision, counted in the navigation | Ran (read) | `app.js` section `owner` ("To decide", rows `toDecide`), status `applied: ['waiting', 'Applied for now']`, banner "Applied for now: …"; collector: "2 owner decisions" |
| AC-2 An answer posts a comment under the owner's name, nothing else | Ran (read) | `app.js` line 126: `POST /issues/<n>/comments` with the owner's key only; no other write call in the file; live: the D-0034 answers on #195 ("Sent from the PDS 1.0 dashboard") |
| AC-3 Without a key: read-only, "Connect GitHub once to answer here", key scope | Ran (read) | Banner "Connect GitHub once to answer here"; key text "this repository only, Issues: read and write"; a 403/404 explains the missing permission |
| AC-4 Every `decisions.yaml` entry with its check and latest result, or review-only | Ran (collector) | "45 decisions"; each row shows "Check (<kind>)" with its state badge, or "No check yet" for review-only |
| AC-5 An issue closed in the last 30 days shows with its PR link | Ran (collector), fixed in this PR | Was 3 days and no PR link. Now: 115 issues closed in 30 days, 21 with their closing PR (e.g. #281 → PR #285); the Done detail shows "Closed by: Pull request #…", or "No pull request (closed by hand)" |
| AC-6 No own colours, inline styles or `!important` | Ran (grep) | `app.js`: 0 `style=`, 0 hex colours, 0 `!important`; everything from Plenix components (`P.*`) and `plenix.css` 0.86.0 from the CDN |
| Screenshots tab (P1) | Planned | Waits on visual regression (#191) |
