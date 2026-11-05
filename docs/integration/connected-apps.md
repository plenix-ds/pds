# Connected apps: reporting to Plenix and following its releases

This guide is for app sessions (Claude or Codex) that build an app on Plenix: CTM, the St. John site, AITEAM, RedSave and any new app (#114). The apps are listed in `tools/baseline/apps.json`.

## Report a Plenix problem (one step)

- Search first, and add to an open issue instead of opening a duplicate:

  ```bash
  gh issue list -R plenix-ds/pds --state open --search "<component> in:title,body"
  ```

- Then file it, with your app's label:

  ```bash
  gh issue create -R plenix-ds/pds --label "type:bug,agent:pds1-product-lead,app:<ctm|st-john|aiteam|redsave>" \
    --title "<App>: Plenix <version>: <what is wrong>" --body-file report.md
  ```

  `report.md` holds the component, the page, the steps, what you expected and what happened. A screenshot helps. In a browser, use the **App report** form instead.
- The Product Lead triages it like an owner bug and assigns the owning role.
- CTM reports breakages through the PDS GitHub App (D-0019) as "CTM: Plenix <version> breaks CTM".

## Send a fix

- An app never keeps a private copy or patch of Plenix code (the baseline rule, #114).
- When you fix a Plenix component locally, send the fix to `plenix-ds/pds` as a pull request from a fork, or paste the patch into the issue. Name the issue in the PR.
- The fix goes through Plenix's CI and review, then ships in the next release. Drop your local patch once that release is out.

## Follow the releases

- **Always the newest** (owner decision on #114, option A): an app follows the newest Plenix once its baseline scan shows zero items.
- **Scan your app** (read-only; it never edits the app):

  ```bash
  node tools/baseline/scan.js <your app folder> --app <name> --out <a folder outside the app>
  ```

  It writes `baseline-<name>.md`, a plain-words list of what to change: old names and values, retired icons, the app's own styling, patches over `.plx-` parts, and the changes since your version.
- **At every release**, Plenix scans each app it can reach and lists "at baseline" or "N items to fix" in the release records (`tools/baseline/drift.mjs`). A release never fails because of an app.
- **CTM** reads `cdn/latest.json` every 30 minutes. `pins.ctm` holds it on one version when needed.
- **Pinned apps** keep their pin until their scan is at zero, then switch to the newest release.

## Styles: load only what a page uses

From the next release, `/cdn/<version>/foundations.css` and `/cdn/<version>/parts/<part>.css` sit beside `plenix.css`, and the archive carries them too (#151).
