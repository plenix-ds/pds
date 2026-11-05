# Plenix Design System

The point of truth for everything built on the Plenix Platform: the 14-section UI Inventory, every component's page (JSX, CSS, classes and tokens read live from the platform files), the token labs, the Button editor, and the common-ground guidance for every item Plenix has not built yet.

Live: https://design-system.lighthouseway.org/

## How it runs

The design system runs on a published Plenix release, like any other application: `plenix-source.js` loads the stylesheet, the bundle, React, the fonts and the theme script from `https://design-system.lighthouseway.org/cdn/<VERSION>/`, and reads the files its pages document (each component's JSX and CSS, the token files, the standards) from that release's `source/` folder. `VERSION` in `plenix-source.js` is the one setting; it moves at each release with `package.json` (VERSIONING.md).

To preview Platform work that is not released yet, add `?plenix=local` to the address (http://localhost:8767/Plenix/platform/design-system/?plenix=local): the spec then loads this checkout's own files (`../platform.css`, `../dist/platform.js` …), so run `node build-app.js` first. `?plenix=0.70.1` loads another published release. `localStorage.setItem('plenix.source', 'local')` keeps the choice without the flag; remove it to go back.

It is edited inside the Plenix Platform repository, where it is included as a git submodule at `platform/design-system/` (check-spec.js and the build scripts read it there):

```
git clone --recurse-submodules https://github.com/plenix-ds/plenix-platform.git Plenix
```

Edit it here (inside `Plenix/platform/design-system/`), commit and push in this repository, then record the new version in the Platform repository (`git add platform/design-system` there).

## Files

- `index.html`: the app. `spec.js` is the router and item pages, and `ds.js` holds the shared helpers.
- `inventory-taxonomy.js` is the 16 sections and 864 entries. `inventory.js` has one record per built item.
- `inventory-guidance.js` is the common-ground guidance from the enterprise design systems for unbuilt items (batch 205).
- `*-lab.js` / `*-lab.css`: the button, layout, motion and radius labs.
- `STANDARD.md`: the standard and the Plenix decisions.

## Rules

Nothing hard-coded: no style in markup, and an inline style only as a JavaScript adjustment from tokens, defined styles or measured layout (STANDARD.md, item 9). Every value is a Platform token, and `check-spec.js` and `check-system.js` (in the Platform repository) must pass before publishing.
