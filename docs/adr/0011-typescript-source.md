# ADR 0011: Plenix's source is TypeScript; declarations come from `tsc`

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect, on the owner's direction (2026-10-31, #57: "Fix this"); decision D-0045 (owner may switch)
- **Issues:** #57, #61. Plan: `docs/pds1/slices/57-typescript/plan.md`.

## Context

Measured on main, 2026-11-05:

| Folder | Still JS | TypeScript |
|---|---|---|
| `platform/components` | 50 of 146 folders (94 files, DataGrid among them) | 96 folders (102 files) |
| `platform/patterns` | 96 of 99 folders (100 files) | 3 |
| `platform/charts` | 39 files | 0 |
| `platform/templates` | 6 | 0 |
| `providers`, `utils`, `engines` | 3, 1, 1 | 10, 38, 0 |
| `hooks` | 0 | 12 |

- About 244 JS files (37,700 lines) are left. `tsconfig.json` is `strict` with `allowJs` on and `checkJs` off, so the JS is not type-checked.
- `@plenix-ds/react`'s `index.d.ts` is still written by `build-types.js` (277 lines) from header comments. **383 of 2,736 published props (14%) are `any`**, by `tools/agent/types-any.js`. #61's "two thirds" was measured before the 0.x conversions. The header reader also mistypes nested props (VoteTally `settings`, #61).
- Plan §7b inherits "finish each folder during its rebuild". At that pace the JS stays for months.

## Options

| Option | For | Against |
|---|---|---|
| **A. Conversion waves now, folder by folder, then `tsc` writes the declarations and `build-types.js` retires** | The owner's ask, done; real types for apps; one source of truth (the code) | About 244 files of mechanical work; review load on QA |
| B. Convert only during each component's rebuild (plan §7b as written) | No extra work | JS and `any` stay for months; two declaration paths meanwhile |
| C. JSDoc types and `checkJs`, no rename | Smaller diffs | Still JS (not what the owner asked); `build-types.js` stays |

## Decision

**Option A** (D-0045; reply B or C on #57 to switch).

- **Rules for every converted file:**
  - `.jsx` -> `.tsx` (`.js` -> `.ts`), with an exported `<Name>Props` type. No `any` in a public prop: use a union, a named type, or `unknown` with a narrowing.
  - The header comment stays as documentation; `Props:` stays in words.
  - No behavior change. The visual check is unchanged (light and dark, standard density), and the existing behavior tests stay green.
- **Waves** (each wave is PRs of about 10 folders, each PR typechecked; CI's tsc "new problems" job blocks new errors):
  1. `components` (50 folders; DataGrid as its own PRs).
  2. `charts` (39).
  3. `patterns` (96).
  4. `templates`, `providers`, `utils`, `engines`.
- **Switch:**
  - When no `.js`/`.jsx` is left under `platform/` (vendor and dist apart), `tsconfig` sets `allowJs: false`.
  - `@plenix-ds/react` declarations come from `tsc --emitDeclarationOnly`.
  - `build-types.js` is deleted, and check-system's `legacy` rule keeps it gone.
  - `tests/types.test.js` (the RedSave fixture) must still compile against the new `index.d.ts`.
  - `platform/index.js` becomes `index.ts` and re-exports every converted part's props type (`export type { CodeBlockProps } from …`). That isn't possible while it's JS (#369), and a hand-written `.d.ts` would be a second source of types, so there's none in the meantime.
- **Public API:**
  - Export names and runtime behavior don't change.
  - Prop types become stricter (`any` -> real types). That's a compile-time change for apps that passed wrong values, so it's listed under *Changed* in each wave's changelog.
  - It's MINOR, because the runtime API is the same (VERSIONING.md: *Changed* within its role). A prop whose documented values were wrong in the header is fixed to the documented behavior, so it's a PATCH.

## Addendum (2026-11-06, #292): types for a vendored engine (RichTextEditor and Tiptap, D-0067)

RichTextEditor drives Tiptap, which ships only as the vendored bundle (`platform/vendor/tiptap/tiptap.min.js`, Tiptap 3.31.3), so the repository has no types for `Editor`, `Extension` or the Mention API.

- **Decision (b):** the Tiptap packages the editor touches (`@tiptap/core`, `@tiptap/extension-mention`, and any other it needs) are **type-only devDependencies**, at **exactly** the vendored version (`--save-exact`, no range).
  - They're imported only with `import type`. The engine at run time is still the vendored bundle (`loadTiptap()`), so nothing from npm is bundled.
- **The public API stays Plenix's:** `RichTextEditorProps` names no Tiptap type. Tiptap types appear only inside the component.
- **Upgrading Tiptap** means rebuilding the vendored bundle and bumping these devDependencies to the same version, in one PR.
- **Rejected:**
  - (a) hand-written local interfaces: about 60 members, a second source that drifts.
  - (c) leaving RichTextEditor in JavaScript until wave 5: it blocks wave 1 for no gain.
- Enforced by: the check-system rule `vendor-types` (`check-system.rules/vendor-types.js`). Every `@tiptap/*` devDependency equals the version in `platform/vendor/tiptap/README.md`; none is a runtime dependency; and nothing in `platform/` imports `@tiptap/*` except with `import type`. Plus G3 review of the RichTextEditor PR (no Tiptap type in its public props).

## Addendum (2026-11-06, #61): wave 5a, the published types come from the TypeScript sources (D-0081)

The waves typed 193 sources, with every public props type reviewed at G3, but `index.d.ts` still came only from the header comments (`build-types.js`), so consumers never saw those types (334 of 2,437 published props were `any`).

- **`build-types.js` now runs `tsc --emitDeclarationOnly`** into `types/` beside the index (the same `tsconfig.json`; `allowJs` gives the JavaScript files declarations too, so imports resolve).
  - The emitted import paths keep their `.ts` / `.tsx` / `.jsx` endings, which a consumer's TypeScript can't resolve. TS 5.6 has no rewrite, so they become `.js`, which TypeScript maps to the `.d.ts`.
- **For every `platform/index.js` export whose source is `.ts` / `.tsx`, `index.d.ts` re-exports it from `./types/…`** (`export { A, B as C } from "./types/…js"`), plus `export type * from` that file (its props, items and values types, once per file).
  - The JavaScript sources keep the header reading until they convert.
  - The coverage gate accepts both forms, so an unpublished export still fails the build.
- **Shipping:** npm's `@plenix-ds/react` has no `files` list, so `types/` ships beside `index.d.ts`. The CDN copies `types/` beside `plenix.d.ts` (`build-packages.js`).
- **Result:** 248 exports and 214 source files' types come from TypeScript. The published `any` props fall from 334 to 131, all of them in JavaScript sources.
- **Semver: PATCH.** The types get closer to the documented API. A consumer that passed a value the docs never allowed may now see a type error, which is the point of #61.
- **Wave 5 proper** (index.ts, retiring `build-types.js`) follows when the last JavaScript source converts.
- Enforced by: `build-types.js`'s coverage gate. A consumer compile of `index.d.ts`: `Button`, `DataGrid<Row>` with `DataGridColumn<Row>`, and a wrong `variant` caught. G3 on every converted source's props (no `any` in public props). `PLENIX_TYPES_STRICT=1` makes any tsc error fail the build (for CI, where every dependency is installed).

## Consequences

- Owners: the Component Engineers convert (each wave is long work, within `agents.config.yaml` limits). pds1-ds-architect reviews each wave's `index.d.ts` diff (G3). QA reviews behavior.
- The `any` count is tracked on every wave PR (`node tools/agent/types-any.js`). It reaches 0 for converted files.
- #61 closes when `build-types.js` retires.

## Enforced by

- CI "New problems (tsc)": no new type errors.
- `planned:no-js-source`: after wave 4, check-system fails on a `.js`/`.jsx` under `platform/` outside vendor and dist.
- `planned:no-build-types`: check-system `legacy` fails if `build-types.js` returns.
- G3 review of each wave's declaration diff.
