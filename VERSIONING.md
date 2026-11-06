# Plenix versioning

Plenix is released as one version for everything: the four packages (`@plenix-ds/tokens`, `icons`, `styles`, `react`), the
CDN folder `/cdn/<version>/` and the API. The version is `version` in `package.json`. It follows semantic versioning
(MAJOR.MINOR.PATCH), read the way a design system needs it: what is public is not only the JavaScript API, but also
the CSS classes, the tokens and how things look.

## What is public

- **React:** every export of `@plenix-ds/react` (platform/index.js), its props, their allowed values and defaults.
- **CSS:** every `plx-` class in `@plenix-ds/styles` (blocks, elements, modifiers, `is-` states) and the `data-plx-*`
  attributes on `<html>` (mode, density, interaction).
- **Tokens:** every `--plx-sys-*` and `--plx-comp-*` token: its name, tier and role. The `--plx-ref-*` palette is public
  for reading, but products should not use it directly.
- **Icons:** every icon name.
- **API:** the `/api/v1/` endpoints and their fields.
- **Not public: the catalog's key list.** `useStrings`, `createTranslator` and every part's `strings` prop are public. The keys
  in `en.json` / `ar.js` are the words of Plenix's own parts.
  - A key that no Platform part reads may be removed in a MINOR release, under *Removed*, once a search of the apps
    (CTM, the St. John site) finds no reader (D-0085).
  - A key a part still reads keeps its name; renaming it is a change to that part's `strings` prop.

## What each part of the version means

| Change | Example | Version |
|---|---|---|
| Remove or rename an export, prop, prop value, class, token or icon | `variant="quiet"` removed; `--plx-sys-surface-raised` renamed | **MAJOR** |
| Change a default or a token's role so existing screens change layout or meaning | Button's default size becomes `sm` | **MAJOR** |
| Remove or change an API field | `components[].map` changes shape | **MAJOR** (a new `/api/v2/`) |
| Add an export, prop, prop value, variant, class, token or icon | `@plenix-ds/react` gains `Rating`; 115 Button tokens | **MINOR** |
| Change how something looks, within its role | a token value moves to a nearer palette color; a new focus style | **MINOR** (listed under *Changed (visual)*) |
| Fix behavior so it matches its documentation; an accessibility fix that keeps the API | a missing focus-visible style; an announcement that never fired | **PATCH** |
| Documentation, design system pages, guidance | the written sections of an item | **PATCH** |

Before 1.0.0, Plenix is still settling: a 0.MINOR release may include a breaking change. Every breaking change is listed
under **Breaking** in the changelog, with what to do instead.

## Deprecation

1. The item, prop, class or token is marked **Deprecated** on its design system page (status) and in the changelog, with
   its replacement. It keeps working.
2. It is removed no earlier than the next MINOR release (before 1.0) or the next MAJOR release (from 1.0).
3. Legacy looks are never mixed into the Platform: a valued legacy look is rebuilt as a Platform variant.

## Releasing

1. Write the release's entries under **Unreleased** in `CHANGELOG.md` as the work is done: *Added*, *Changed*,
   *Changed (visual)*, *Fixed*, *Deprecated*, *Removed*, *Breaking*.
2. Pick the version from the table above, rename **Unreleased** to `[x.y.z] - YYYY-MM-DD`, set `version` in
   `package.json`, start a new empty **Unreleased**. Set the same version as `VERSION` in
   `platform/design-system/plenix-source.js`: the design spec runs on that release from the CDN (`check-spec.js` and
   `deploy.sh` stop when the two differ).
3. `bash deploy.sh` publishes `/cdn/x.y.z/` (it never overwrites a published version) and refreshes the API; the apps
   move to the new version.
   After the live check passes, `node tools/publish/notify-apps.mjs x.y.z` sends each app that auto-upgrades (CTM) the
   `plenix-release` event, so it upgrades at once instead of on its own schedule (D-0083, #750).
4. Commit, then `git tag vx.y.z && git push origin main vx.y.z`. The Release workflow checks that the tag matches
   `package.json`, builds, runs the checks, publishes the packages and creates the GitHub release with that version's
   changelog section as its notes.
