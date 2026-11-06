# Brief: repository cleanup (#706)

Owner: pds1-product-lead. Build: pds1-ds-architect. Review: pds1-release-architect (build, CI, CDN), pds1-code-reviewer.

## Goal

The root of plenix-ds/pds shows only what PDS 1.0 builds, tests and publishes. Folders nothing needs any more live in a new top-level `archive/`. Files that are unused or outdated are deleted (git history keeps them).

## Known, inferred, unknown

| | What |
|---|---|
| Known | The root has 31 folders and about 55 files (2026-11-06). 0.x leftovers include the suite apps (`bookmarks`, `calendar`, `contacts`, `dam`, `files`, `messages`, `notes`, `projects`, `settings`, `tasks`, `suite`), the old status page in `dashboard/` (outside `dashboard/pds1/`), `capabilities/` (last change 2026-10-09), `vote-kit/`, `deploy.sh` (replaced by the CI release job), and many root `build-*.js` / `check-*.js` files. Many are still referenced: `build-app.js` builds the apps, and the CDN serves 14 app pages through the loader. |
| Inferred | Some of these are live (CDN demo apps, the St. John site's sources, the vote kit that VoteTally documents). Others are only history. |
| Unknown | Which apps the owner still uses. Default: an app that's published on the CDN or tested is **kept**. An app with no build, test, CDN page or reference is archived. |

## P0

- **Inventory first:** `docs/pds1/slices/706-repo-cleanup/inventory.md` has one row per root folder and file: what it is, who reads it (build, CI workflow, test, CDN page, package, doc link, Knip), and the verdict (**keep**, **archive** or **delete**) with the reason.
- **Archive:** `git mv` each **archive** item to `archive/<name>/`, keeping its history. Remove it from builds, CI, Knip, lint and the CDN publish. `archive/README.md` lists each item, why, and the date.
- **Delete:** files with no reader (Knip unused files, no reference in code, CI or docs) and outdated duplicates (for example `deploy.sh`, if the release job fully replaces it). Each deletion is listed in the PR body with its reason.
- **Nothing breaks:** every required CI check is green. The release dry run gives the same CDN file list as before, except for removed items, and each removed CDN item is named in the PR. `cdn/latest.json` and published versions are untouched.
- Small PRs: one for the inventory, then one PR per group (apps, tools, docs, root scripts), so each can be reverted alone.

## P1

- Move root `build-*.js` / `check-*.js` into `tools/build/` and `tools/check/` where that doesn't break imports or npm scripts, and update `package.json` scripts and the docs.
- `docs/`: archive study and brief folders that no page links to into `archive/docs/`.

## P2

- The same cleanup for the agent host's own folders (`~/work`, `~/handoff`), as a separate issue, only if the owner asks.

## Non-goals

- No change to what apps see: published CDN versions, `latest.json`, npm packages and the API stay as they are.
- Nothing protected moves: `docs/pds1/plan.md`, `docs/i18n/arabic.md`, `decisions.yaml`, `DESIGN.md` and `CLAUDE.md`/`AGENTS.md` (Rulesync) stay where they are.
- No rewriting of git history.
- No app removed from the CDN without being named in the PR, and the owner sees it there.

## Affected packages

None of the four published packages change their content. Build scripts, CI, Knip config and `.gitignore` change.

## Acceptance

- **AC-1** Given the inventory, when the archive PRs merge, then the repo root lists only **keep** items plus `archive/`, and every moved item is in `archive/README.md`.
- **AC-2** Given an archived folder, when CI runs, then no build, lint, Knip or test step reads `archive/`, and every required check passes.
- **AC-3** Given the release dry run before and after, when their CDN file lists are compared, then they differ only by the items named in the PR.
- **AC-4** Given a deleted file, when the PR is reviewed, then its row in the inventory shows no reader, with the evidence (the grep or Knip output).
- **AC-5** Given `git log --follow` on an archived file, when it is run, then the history before the move is shown.

## Already implemented

`docs/legacy/` already holds the 0.x team files. `knip.jsonc` reports unused files (the CI `New problems (knip)` job).

## Anything unclear

None open. The Unknown above has a stated default: keep what's published or tested.
