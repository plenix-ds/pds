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

## Tasks (each its own PR, each proven byte-identical on all 4 sheets + the index)

1. **One Style Dictionary config** (`style-dictionary/build.config.mjs`) replacing the 10 `tokens:sd` configs: one platform per output sheet, with sources taken from `build.json`.
2. **Hooks in `packages/tokens/sd/`** (ADR 0003: only Style Dictionary hooks, no standalone script):
   - a `plenix/css-sets` format: sets in `build.json` order, each under its selector and opener, with `before` / `after` comments and the prologue;
   - a `plenix/ctx-layers` step inside that format: the `--plx-ctx-<layer>-` declarations and pick rules;
   - condition blocks (`@media (forced-colors: active)` …), paired as today;
   - theme sheets from `themes.json` (light, dark, `:root` for the default theme).
   Each hook is a port of the matching `build-tokens.js` function, kept in the same order, so the diff can be reviewed side by side.
3. **Proof gate:** `npm run tokens:sd:check` becomes a byte comparison of Style Dictionary's sheets with `build-tokens.js`'s, for all 4 sheets. It must be identical before task 4.
4. **Switch:** `build-app.js` calls Style Dictionary; `check-system` `generated` compares against it; `token-index.js` reads `written` from Style Dictionary's sheets (ends step 8's temporary path).
5. **Retire:** delete `build-tokens.js` and `tools/agent/sd-reference-compare.js`; rewrite `tests/theme.test.js`'s reader (edited, not run); add `planned:no-build-tokens` (CI fails if the file returns).
6. **Then the token rename** (ADR 0002) runs on Style Dictionary: `renames.json` -> deprecated aliases.

## Risks

- **Byte identity of comments and spacing:** port function by function and diff after each.
- **The layering logic is the hard part:** port it unchanged first; simplify only after identity holds.
- **Readers that copy `build-tokens.js`** (`tests/theme.test.js`): find them all with `git grep build-tokens` before task 5.
