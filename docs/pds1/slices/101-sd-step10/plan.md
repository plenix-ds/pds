# Slice 101: Style Dictionary step 10, retire `build-tokens.js`

- **Issues:** #101, #184 (P0-2). **ADR:** 0003 (D-0033). **Owner:** pds1-ds-architect.
- **Starts after:** step 9 part 2 (#258) merges.
- **Done when:** Style Dictionary writes every token stylesheet byte-identical to `build-tokens.js`, and `build-tokens.js` is deleted.

## What `build-tokens.js` does today (measured on `tokens/184-w3c-values`)

- **Outputs:** `platform/system/tokens/{reference,semantic,components}.css` and one sheet per theme (`platform/system/themes/default.css`): 549,887 bytes. The sets and their order come from `platform/tokens/build.json`; each set's `$extensions.com.plenix` gives its selector and opener.
- **Context layering:** a token declared by several sets (density, interaction) is written as `--plx-ctx-<layer>-<token>`, plus one pick rule per context (345 `plx-ctx-` lines: 177 in semantic.css, 168 in components.css).
- **Condition sets** (forced colors, more contrast, print, reduced motion) are read back onto their base tokens and written as paired blocks.
- **Comments:** `before` / `after` / `$description` are kept exactly (74 comment lines in the three tier sheets), plus the per-output prologue from `build.json`.
- **Also runs:** `tools/token-index.js` (the index) and `build-mobile.js` (native files, kept, #872).

## Readers of `build-tokens.js` to repoint

`build-app.js` (calls it), `check-system.js` (`generated` rule: `--check`), `check-style.js`, `check-system.rules/token-sets.js` and `color-groups.js`, `tools/token-index.js` (`writtenForIndex`, temporary since step 8), `tools/agent/sd-reference-compare.js`, `tokenize-component.js`, `services/save/server.js`, `build-standards.js`, `tests/theme.test.js` (copies `build-tokens.js` alone: it must be rewritten, not run), and the comments in `platform/tokens/build.json`, `themes.json`, `theme-default.tokens.json` and `semantic/typography.tokens.json`.

## Tasks (each its own PR, each proven on all 4 sheets + the index)

**Correction (2026-11-05, after reading `tools/agent/sd-reference-compare.js`):** Style Dictionary today covers the reference tier (step 1), the text roles (step 3) and the condition blocks (step 4). The **base sets** of `semantic.css`, `components.css` and the themes (#372 steps 5 to 7) were never done, and step 10 depends on them. Also, one Style Dictionary run keeps only one value per name, so sets that share names (each density, each interaction mode, light and dark) need a run each, as `style-dictionary/index/` already does (11 configs). "One config" isn't possible as written.

1. **Step 5, semantic base sets:** a CSS output per set group (base, each density, each interaction mode), from the same groups as `style-dictionary/index/`. Extend `sd-reference-compare.js` to match `semantic.css`'s base values, `--plx-ctx-<layer>-` variables included, by name, context and value.
2. **Step 6, component base sets:** the same for `components.css` (the glob sets `components/*.tokens.json`).
3. **Step 7, themes:** light and dark per theme from `themes.json`, matched against `themes/<name>.css`.
4. **Runner:** `style-dictionary/build.mjs` runs every config through Style Dictionary's API in one process, replacing the 10 CLI calls of `npm run tokens:sd`. It's config as code; the logic stays in hooks.
5. **Hooks in `packages/tokens/sd/`** (ADR 0003): a format per set that writes the block (selector, opener, `before` / `after` comments), and an assembly hook that joins the sets in `build.json` order and writes the cross-set pick block (`--plx-ctx-*`, which spans sets, so it can't live in a single set's format) and the paired condition blocks. Each is a port of the matching `build-tokens.js` function.
6. **Byte gate:** `npm run tokens:sd:check` compares bytes for all 4 sheets. It must be identical before task 7.
7. **Switch and retire:** `build-app.js` calls Style Dictionary; `check-system` `generated` compares against it; `token-index.js` reads `written` from it; delete `build-tokens.js` and `sd-reference-compare.js`; rewrite `tests/theme.test.js`'s reader (edited, not run); add `planned:no-build-tokens`.
8. **Then the token rename** (ADR 0002) on Style Dictionary: `renames.json` -> deprecated aliases.

## Risks

- **Byte identity of comments and spacing:** port function by function and diff after each.
- **The layering logic is the hard part:** port it unchanged first; simplify only after identity holds.
- **Readers that copy `build-tokens.js`** (`tests/theme.test.js`): find them all with `git grep build-tokens` before task 5.
