# Inventory: the repository root (#706)

One row per root item on `main` (2026-11-06, 88 items). **Readers** count the files that name the item: `package.json` scripts, CI workflows, build and check scripts, tests, Knip, and doc links. **Last** is its last change on `main`. Default (brief): keep what is built, tested, published or read.

| Item | What it is | pkg | CI | build | tests | knip | docs | Last | Verdict | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| `.browserslistrc` | Target browsers for the CSS and JS tooling (read by the tools, not by name) | 0 | 0 | 0 | 0 | 0 | 0 | 2026-10-24 | **keep** |  |
| `.changeset` | Changesets config (versioning) | 0 | 0 | 0 | 0 | 0 | 0 | 2026-11-05 | **keep** |  |
| `.claude` | Agent definitions and skills | 0 | 0 | 0 | 0 | 0 | 0 | 2026-11-04 | **keep** |  |
| `.gitattributes` | Git line-ending and diff rules | 0 | 0 | 0 | 0 | 0 | 0 | 2026-10-08 | **keep** |  |
| `.github` | CI workflows, issue and PR templates | 0 | 2 | 0 | 0 | 0 | 51 | 2026-11-06 | **keep** |  |
| `.gitignore` | Ignored files | 0 | 1 | 0 | 0 | 0 | 4 | 2026-11-05 | **keep** |  |
| `.opengrep` | Security rules (CI) | 0 | 1 | 0 | 0 | 2 | 0 | 2026-11-05 | **keep** |  |
| `.rulesync` | Rulesync sources for CLAUDE.md / AGENTS.md | 0 | 1 | 0 | 0 | 0 | 3 | 2026-11-05 | **keep** |  |
| `.storybook` | Storybook config | 0 | 0 | 0 | 0 | 0 | 1 | 2026-11-05 | **keep** |  |
| `.stylelintignore` | Stylelint ignores | 0 | 0 | 0 | 0 | 0 | 0 | 2026-10-27 | **keep** |  |
| `.stylelintrc.json` | Stylelint config | 0 | 0 | 0 | 0 | 0 | 3 | 2026-11-05 | **keep** |  |
| `AGENTS.md` | Rulesync output (protected) | 0 | 1 | 0 | 0 | 0 | 4 | 2026-11-05 | **keep** |  |
| `CHANGELOG.md` | The changelog | 0 | 1 | 2 | 1 | 0 | 6 | 2026-11-05 | **keep** |  |
| `CLAUDE.md` | Rulesync output (protected) | 0 | 0 | 0 | 0 | 0 | 5 | 2026-11-04 | **keep** |  |
| `CONTRIBUTING.md` | Contributor guide (convention) | 0 | 0 | 0 | 0 | 0 | 0 | 2026-10-29 | **keep** |  |
| `DESIGN.md` | Design contract (protected) | 0 | 0 | 0 | 0 | 0 | 6 | 2026-11-06 | **keep** |  |
| `README.md` | Repo readme | 0 | 0 | 4 | 1 | 2 | 0 | 2026-11-05 | **keep** |  |
| `THIRD-PARTY-NOTICES.md` | Licence notices (required) | 0 | 0 | 0 | 0 | 0 | 0 | 2026-11-05 | **keep** |  |
| `VERSIONING.md` | Versioning rules | 0 | 0 | 0 | 0 | 0 | 4 | 2026-10-25 | **keep** |  |
| `agents.config.yaml` | Agent concurrency (D-0018) | 0 | 0 | 0 | 0 | 0 | 4 | 2026-11-06 | **keep** |  |
| `bookmarks` | Suite app (built by build-app.js, tested, CDN app page) | 1 | 0 | 13 | 18 | 0 | 1 | 2026-11-01 | **keep** |  |
| `build-app.js` | Build or check script / config | 5 | 1 | 0 | 0 | 1 | 3 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-brand.js` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 1 | 2026-10-19 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-docs-components.js` | Build or check script / config | 0 | 0 | 0 | 0 | 0 | 1 | 2026-10-20 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-docs.js` | Build or check script / config | 1 | 0 | 0 | 0 | 0 | 2 | 2026-10-08 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-exports.js` | Build or check script / config | 0 | 1 | 3 | 0 | 1 | 2 | 2026-11-01 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-icons.js` | Build or check script / config | 0 | 0 | 1 | 0 | 1 | 2 | 2026-11-01 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-mobile.js` | Build or check script / config | 0 | 0 | 0 | 0 | 0 | 5 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-native-guidance.js` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 1 | 2026-10-21 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-packages.d` | Build or check script / config | 0 | 1 | 1 | 0 | 1 | 1 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-packages.js` | Build or check script / config | 2 | 1 | 0 | 1 | 3 | 8 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-platforms.js` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 1 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-reviewed.js` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 1 | 2026-10-29 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-spec-parts.js` | Build or check script / config | 0 | 0 | 2 | 0 | 0 | 2 | 2026-11-02 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-standards.js` | Build or check script / config | 0 | 0 | 2 | 1 | 1 | 3 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-steps.js` | Build or check script / config | 0 | 0 | 2 | 0 | 0 | 5 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-types.js` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 8 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `build-usage.js` | Build or check script / config | 2 | 1 | 0 | 0 | 0 | 2 | 2026-10-31 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `calendar` | Suite app (built, tested, CDN) | 1 | 0 | 13 | 24 | 0 | 5 | 2026-11-01 | **keep** |  |
| `capabilities` | Capability data read by build-docs.js, build-packages.d/mcp.js and check-common.js | 0 | 0 | 1 | 1 | 0 | 3 | 2026-10-09 | **keep** |  |
| `changelog.d` | Changelog fragments | 0 | 0 | 0 | 0 | 0 | 4 | 2026-11-06 | **keep** |  |
| `check-bundle.baseline.json` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 2 | 2026-10-29 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-bundle.js` | Build or check script / config | 1 | 1 | 0 | 0 | 0 | 3 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-common.js` | Build or check script / config | 0 | 0 | 8 | 0 | 0 | 1 | 2026-11-02 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-copy.js` | Build or check script / config | 0 | 0 | 1 | 0 | 1 | 3 | 2026-10-31 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-spec.js` | Build or check script / config | 1 | 0 | 0 | 0 | 0 | 13 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-style.js` | Build or check script / config | 2 | 1 | 0 | 0 | 0 | 5 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-system.built-in-words.json` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 0 | 2026-10-29 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-system.js` | Build or check script / config | 2 | 1 | 0 | 0 | 1 | 8 | 2026-11-06 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-system.rules` | check-system rule modules | 0 | 0 | 24 | 3 | 3 | 9 | 2026-11-06 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-system.selector-kinds.json` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 0 | 2026-11-02 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-system.text-contract.json` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 1 | 2026-11-06 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `check-system.token-definitions.json` | Build or check script / config | 0 | 0 | 1 | 0 | 0 | 0 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `contacts` | Suite app (built, tested, CDN) | 1 | 0 | 13 | 19 | 0 | 1 | 2026-11-01 | **keep** |  |
| `dam` | Suite app (built, tested, CDN) | 1 | 0 | 17 | 21 | 2 | 5 | 2026-11-01 | **keep** |  |
| `dashboard` | Status page and dashboard (CI dashboard.yml, build, tests) | 1 | 2 | 14 | 34 | 2 | 8 | 2026-11-05 | **keep** |  |
| `decisions.yaml` | Decisions (protected) | 0 | 2 | 0 | 0 | 0 | 9 | 2026-11-06 | **keep** |  |
| `deploy.sh` | Host-side deploy of the CDN, API and sites (release.yml publishes after it) | 0 | 0 | 0 | 0 | 0 | 7 | 2026-11-05 | **keep (ask)** | release.yml publishes after the host-side deploy; @pds1-release-architect to confirm whether this script still runs it before any delete. |
| `deploy` | Agent host units (deploy/agents) | 0 | 1 | 0 | 0 | 2 | 1 | 2026-11-06 | **keep** |  |
| `design.rules.json` | Design rules read by the design agents and DESIGN.md | 0 | 0 | 0 | 0 | 0 | 5 | 2026-11-05 | **keep** |  |
| `docs` | Documentation | 0 | 0 | 6 | 9 | 3 | 34 | 2026-11-06 | **keep** |  |
| `eslint.config.mjs` | ESLint config | 0 | 0 | 0 | 0 | 0 | 1 | 2026-11-02 | **keep** |  |
| `files` | Suite app (built, tested, CDN) | 1 | 3 | 13 | 22 | 0 | 4 | 2026-11-05 | **keep** |  |
| `knip.jsonc` | Knip config (CI) | 0 | 0 | 0 | 0 | 0 | 0 | 2026-11-06 | **keep** |  |
| `lefthook.yml` | Git hooks | 0 | 0 | 0 | 0 | 0 | 2 | 2026-11-05 | **keep** |  |
| `messages` | Suite app (built, tested, CDN) | 1 | 0 | 13 | 21 | 0 | 2 | 2026-11-01 | **keep** |  |
| `notes` | Suite app (built, tested, CDN) | 1 | 1 | 13 | 23 | 0 | 3 | 2026-11-01 | **keep** |  |
| `package-lock.json` | Lockfile | 0 | 0 | 0 | 0 | 0 | 2 | 2026-11-06 | **keep** |  |
| `package.json` | Workspace manifest | 0 | 1 | 13 | 12 | 2 | 8 | 2026-11-06 | **keep** |  |
| `packages` | The four published packages | 1 | 2 | 13 | 9 | 8 | 12 | 2026-11-05 | **keep** |  |
| `platform` | The design system source | 2 | 2 | 71 | 85 | 22 | 113 | 2026-11-06 | **keep** |  |
| `projects` | Suite app (built, tested, CDN) | 1 | 0 | 13 | 21 | 0 | 4 | 2026-11-05 | **keep** |  |
| `publish.config.example` | Example host config read by tools/publish-config.sh | 0 | 0 | 0 | 0 | 0 | 0 | 2026-10-28 | **keep** |  |
| `rulesync.jsonc` | Rulesync config | 0 | 0 | 0 | 0 | 0 | 1 | 2026-11-05 | **keep** |  |
| `services` | Back-end services (save server and others) | 1 | 0 | 11 | 2 | 3 | 6 | 2026-11-05 | **keep** |  |
| `settings` | Suite app (built, tested, CDN) | 1 | 0 | 15 | 27 | 1 | 3 | 2026-11-05 | **keep** |  |
| `style-dictionary` | The token build (ADR 0003) | 3 | 0 | 3 | 2 | 1 | 5 | 2026-11-05 | **keep** |  |
| `suite` | Suite shell (built, tested, CDN) | 1 | 0 | 13 | 2 | 2 | 3 | 2026-11-05 | **keep** |  |
| `tasks` | Suite app (built, tested, CDN) | 1 | 0 | 13 | 19 | 0 | 3 | 2026-11-01 | **keep** |  |
| `tests` | Tests | 27 | 1 | 6 | 196 | 9 | 159 | 2026-11-06 | **keep** |  |
| `tokenize-component.js` | Hand-run tool (Knip entry; the labs name it) | 0 | 0 | 0 | 0 | 1 | 2 | 2026-11-05 | **keep (P1 move)** | Read by package.json, CI or other build/check files; moving into tools/build or tools/check is P1, only where imports allow. |
| `tools` | Tooling | 1 | 4 | 21 | 7 | 11 | 25 | 2026-11-06 | **keep** |  |
| `tsconfig.json` | TypeScript config | 0 | 0 | 0 | 0 | 0 | 3 | 2026-10-31 | **keep** |  |
| `types-any.baseline.json` | Baseline read by tools/agent/types-any.js | 0 | 0 | 1 | 0 | 0 | 1 | 2026-11-01 | **keep** |  |
| `vite.apps.config.mjs` | Vite config (apps) | 0 | 0 | 1 | 0 | 0 | 2 | 2026-11-01 | **keep** |  |
| `vite.packages.config.mjs` | Vite config (packages) | 0 | 0 | 1 | 0 | 2 | 1 | 2026-11-05 | **keep** |  |
| `vite.platform.config.mjs` | Vite config (platform) | 0 | 0 | 2 | 0 | 0 | 2 | 2026-11-01 | **keep** |  |
| `vote-kit` | Open-source vote kit (package.json, contract, schema, reference server); Knip-ignored | 0 | 0 | 0 | 0 | 2 | 1 | 2026-10-27 | **archive** | No build, CI, test, CDN page or package reads it here (Knip ignores it; VoteTally only names it in a comment). It is a standalone kit: archive keeps it whole. |

## Summary

- **Archive (1):** `vote-kit/`. No build, CI, test, CDN page or package reads it in this repo.
- **Ask (1):** `deploy.sh`. Kept until the Release Architect confirms whether the host-side deploy still runs it.
- **Delete (0) at the root:** every other root item has a reader, so none is deleted. The low-reader items were checked one by one:
  - `capabilities/` is read by `build-docs.js`, `build-packages.d/mcp.js` and `check-common.js`;
  - `build-docs-components.js` is required by `build-packages.js` line 438, without its `.js`;
  - `publish.config.example` is read by `tools/publish-config.sh`;
  - `types-any.baseline.json` is read by `tools/agent/types-any.js`.
- **Keep, all suite apps (`bookmarks` … `tasks`, `suite`, `dam`, `dashboard`):** each is built by `build-app.js`, tested, and served on the CDN through the loader (14 app pages). The brief keeps published and tested apps.
- **P1 next:** move the root `build-*.js` / `check-*.js` scripts into `tools/build/` and `tools/check/` where imports allow (they `require` each other and `check-common.js`), and archive unlinked study and brief folders under `docs/` into `archive/docs/`. Separate PRs.

## Evidence

- The counts come from a grep of each item name over `package.json`, `.github/workflows`, the build and check scripts and `check-system.rules`, `tests/`, `knip.jsonc`, and `docs/` with the root docs. Each low-reader item was then checked by name with `git grep` across the whole repo, excluding `docs/legacy` and the changelog.
- `release.yml` line 3: "publish (a pushed tag vX.Y.Z, after the CDN and API went live from the host-side deploy; #312)".
