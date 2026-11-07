"""Write dashboard/pds1/data.js: a snapshot of plenix-ds/pds taken from GitHub.

Same data shape as the CTM 3.0 dashboard (D-0034). Read-only: it only reads
GitHub and the decision log (decisions.d/, decisions.yaml). Run: python3 dashboard/pds1/collect.py [out_dir]
Needs an authenticated `gh` (GH_TOKEN in CI). Never writes a key anywhere.
"""
import datetime as dt
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
REPO = "plenix-ds/pds"
GH = f"https://github.com/{REPO}"
PAGES = "https://plenix-ds.github.io/pds/"
SEV_ORDER = {"S1": 1, "S2": 2, "S3": 3, "S4": 4}


def gh(*args, default=None):
    try:
        out = subprocess.run(["gh", *args], check=True, capture_output=True, text=True).stdout
        return json.loads(out) if out.strip()[:1] in "[{" else out
    except (subprocess.CalledProcessError, json.JSONDecodeError, FileNotFoundError):
        return default


def labels(issue, prefix):
    return [l["name"][len(prefix):] for l in issue.get("labels", []) if l["name"].startswith(prefix)]


def code(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="GET"), timeout=10) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


CARD = re.compile(r"^\*\*(D-\d{4}) · (.+?)\*\*\s*$", re.M)
OPTION = re.compile(r"^\*\*([A-E])( \(Recommended\))?\*\*\s*[:—-]\s*(.+)$", re.M)
APPLIED = re.compile(r"\*\*Applied: ([A-E])\.?\*\*")
ANSWER = re.compile(r"\*\*Answer to (D-\d{4}|#\d+): ([A-E]|Other)\*\*\s*(.*?)(?:\n\n_Sent from|\Z)", re.S)


def owner_decisions(issues):
    out = []
    for i in issues:
        if "decision" not in [l["name"] for l in i["labels"]]:
            continue
        full = gh("issue", "view", str(i["number"]), "-R", REPO, "--json", "comments,body", default={}) or {}
        texts = [full.get("body") or ""] + [c["body"] for c in full.get("comments", [])]
        times = [i["createdAt"]] + [c["createdAt"] for c in full.get("comments", [])]
        urls = [i["url"]] + [c["url"] for c in full.get("comments", [])]
        for n, t in enumerate(texts):
            m = CARD.search(t)
            if not m:
                continue
            ctx = re.search(r"^Context:\s*(.+)$", t, re.M)
            opts = [{"key": k, "recommended": bool(r),
                     "text": re.sub(r"\s*Risk:\s*", " — risk: ", txt.replace("**", "").strip(), count=1)}
                    for k, r, txt in OPTION.findall(t)]
            ap = APPLIED.search(t)
            d = {"id": m.group(1), "title": m.group(2), "context": ctx.group(1) if ctx else "",
                 "options": opts, "applied": ap.group(1) if ap else "", "issue": i["number"],
                 "url": urls[n], "replied": "", "at": times[n], "answer": None}
            for later_t, later_at, later_url in zip(texts[n + 1:], times[n + 1:], urls[n + 1:]):
                a = ANSWER.search(later_t)
                if a and a.group(1) == d["id"]:
                    d["answer"] = {"choice": a.group(2), "text": a.group(3).strip(), "at": later_at, "url": later_url}
            out.append(d)
    return out


def decision_log():
    """The decision log (#955): decisions.d/D-NNNN.yaml, one decision per file, plus decisions.yaml until it is folded in."""
    old = ROOT / "decisions.yaml"
    items = (yaml.safe_load(old.read_text(encoding="utf-8")) or []) if old.exists() else []
    folder = ROOT / "decisions.d"
    if folder.is_dir():
        items += [yaml.safe_load(f.read_text(encoding="utf-8")) for f in sorted(folder.glob("D-*.yaml"))]
    return sorted(items, key=lambda d: (str(d.get("date", "")), str(d.get("id", ""))))


def decisions(runs):
    items = decision_log()
    rows = []
    for d in items:
        chk = str(d.get("check") or d.get("review_only") or "")
        if chk.startswith("review-only") or chk.startswith("review only"):
            kind, state, url = "review only", "review", None
            chk = re.sub(r"^review-only\s*\(?|\)$", "", chk) or chk
        elif chk.startswith("planned:"):
            kind, state, url = "planned", "planned", None
        else:
            kind, state, url = "ci-job", None, None
            run = runs.get("ci.yml")
            if run:
                state, url = run["conclusion"], run["url"]
        rows.append({"id": d["id"], "date": str(d.get("date", "")), "area": d.get("area", ""),
                     "decision": d.get("decision", ""), "by": "owner" if str(d.get("decided_by", "")).startswith("owner") else str(d.get("decided_by", "")),
                     "status": d.get("status", ""), "superseded_by": d.get("superseded_by", "") or "",
                     "check": chk, "kind": kind, "state": state, "url": url})
    return rows


def main():
    out_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent
    now = dt.datetime.now(dt.timezone.utc)
    since = (now - dt.timedelta(days=3)).strftime("%Y-%m-%dT%H:%M:%SZ")
    # brief AC-5 (docs/pds1/slices/195-dashboard): issues closed in the last 30 days, each with the PR that closed it
    done_since = (now - dt.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
    issues = gh("issue", "list", "-R", REPO, "--state", "open", "-L", "500",
                "--json", "number,title,url,labels,updatedAt,createdAt", default=[]) or []
    tasks = []
    for i in issues:
        names = [l["name"] for l in i["labels"]]
        owners = labels(i, "agent:pds1-")
        if not owners or "later" in names or "decision" in names or i["number"] == 179:
            continue
        sev = (labels(i, "sev:") or ["S4"])[0]
        tasks.append({"number": i["number"], "title": i["title"], "url": i["url"], "sev": sev,
                      "type": (labels(i, "type:") or [""])[0], "areas": labels(i, "area:"), "owners": owners,
                      "decision": False, "next": "", "waiting": "", "updated": i["updatedAt"]})
    tasks.sort(key=lambda t: (SEV_ORDER.get(t["sev"], 5), t["number"]))
    for n, t in enumerate(tasks, 1):
        t["rank"] = n
    runs_raw = (gh("api", f"repos/{REPO}/actions/runs?branch=main&status=completed&per_page=50", default={}) or {}).get("workflow_runs", [])
    runs = {}
    for r in runs_raw:
        f = Path(r.get("path", "")).name
        if f and f not in runs:
            runs[f] = {"name": r["name"], "file": f, "conclusion": r["conclusion"], "url": r["html_url"], "at": r["updated_at"]}
    # Screenshots tab (#195, D-0016): the visual-regression baselines (check 12, tests/visual) at main's commit. A merge
    # passes check 12 only when the page matches them, so they are what CI verified; linked to the latest green queue run
    main_sha = (gh("api", f"repos/{REPO}/commits/main", "--jq", ".sha", default="") or "").strip()
    ci_ok = ((gh("api", f"repos/{REPO}/actions/workflows/ci.yml/runs?event=merge_group&status=success&per_page=1", default={}) or {}).get("workflow_runs") or [{}])[0]
    shots = [{"name": f.stem, "file": f"https://raw.githubusercontent.com/{REPO}/{main_sha}/tests/visual/baselines/{f.name}",
              "url": f"{GH}/blob/{main_sha}/tests/visual/baselines/{f.name}",
              "run": f"run {ci_ok.get('id', '?')}", "runUrl": ci_ok.get("html_url", "")}
             for f in sorted((ROOT / "tests" / "visual" / "baselines").glob("*.png"))] if main_sha else []
    data = {
        "generatedAt": now.strftime("%Y-%m-%dT%H:%M+00:00"),
        "mainSha": (gh("api", f"repos/{REPO}/commits/main", "--jq", ".sha", default="") or "").strip()[:7],
        "tasks": tasks,
        "ownerDecisions": owner_decisions(issues),
        "openPrs": gh("pr", "list", "-R", REPO, "--json", "number,title,url,headRefName,isDraft", default=[]) or [],
        "mergedPrs": gh("pr", "list", "-R", REPO, "--state", "merged", "--search", f"merged:>={since[:10]}", "-L", "100",
                        "--json", "number,title,url,mergedAt", default=[]) or [],
        "closedIssues": [
            {"number": i["number"], "title": i["title"], "url": i["url"], "closedAt": i["closedAt"],
             "prs": [{"number": p.get("number"), "url": p.get("url")} for p in (i.get("closedByPullRequestsReferences") or []) if p.get("url")]}
            for i in (gh("issue", "list", "-R", REPO, "--state", "closed", "--search", f"closed:>={done_since[:10]}", "-L", "500",
                         "--json", "number,title,url,closedAt,closedByPullRequestsReferences", default=[]) or [])],
        "decisions": decisions(runs),
        "workflows": list(runs.values()),
        "shots": shots,
        "sites": {
            "cdn": {"url": "https://design-system.lighthouseway.org/cdn/latest.json", "code": code("https://design-system.lighthouseway.org/cdn/latest.json")},
            "docs": {"url": "https://design-system.lighthouseway.org/", "code": code("https://design-system.lighthouseway.org/")},
            "pages": {"url": PAGES, "code": code(PAGES)},
        },
    }
    (out_dir / "data.js").write_text("window.PDS_DATA = " + json.dumps(data, indent=1, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"data.js: {len(tasks)} tasks, {len(data['ownerDecisions'])} owner decisions, {len(data['decisions'])} decisions")


if __name__ == "__main__":
    main()
