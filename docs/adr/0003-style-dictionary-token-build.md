# ADR 0003: Style Dictionary is the token build

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (decision D-0024; carries forward owner decision plenix-platform#872)
- **Issue:** plenix-ds/pds#178 (Phase 0, Style Dictionary)

## Context

- plenix-platform#372 moves the token build to Style Dictionary in 10 steps. About 4–5 are done: Style Dictionary 5.7.0 runs beside `build-tokens.js` as a comparison (`npm run tokens:sd:check`), and the token index already comes from it (step 8). The CDN CSS still comes from `build-tokens.js` (296 lines).
- Step 9 part 1 (W3C/DTCG format readers) is plenix-platform#928, closed unmerged, branch `task/872-w3c-readers`.
- The owner decided in plenix-platform#872 to keep `build-mobile.js` for the iPhone and Android token files.
- The owner's rule from plenix-platform#712: no custom tooling unless absolutely necessary.

## Options

| Option | For | Against |
|---|---|---|
| **A. Finish #372 on Style Dictionary 5; reuse #928; retire `build-tokens.js`** | Standard tool; half done; the comparison check already proves byte-identical output | The custom `com.plenix` extensions (selectors, `before` comments) need small format hooks |
| B. Keep `build-tokens.js` | Works today | Custom tooling against #712; every rename in ADR 0002 has to be written twice |
| C. Switch to Terrazzo (Cobalt) | DTCG-native | A new tool; drops the done work |

## Decision

**Option A.**

- Reuse the #928 branch `task/872-w3c-readers` for step 9 part 1: cherry-pick onto `main`, then rebase onto the `packages/tokens` move (ADR 0001).
- Steps 9 and 10 finish in Phase 0, in the same PRs as the token rename (ADR 0002). The rename and the aliases are written by Style Dictionary, not by `build-tokens.js`.
- `build-tokens.js` is deleted when `tokens:sd:check` shows Style Dictionary writes every CSS file byte-identically. The comparison check then becomes the alias check (each old name resolves to the same value).
- `build-mobile.js` stays for native tokens (#872). It reads the same DTCG source. Mobile work stays parked (D-0013): no new native outputs.
- Custom code is limited to Style Dictionary hooks (formats, transforms, filters) in `packages/tokens/sd/`. No new standalone script.

## Consequences

- One token build instead of two. The `generated` rule in `check-system.js` compares against Style Dictionary's output.
- `npm run tokens:sd` (10 config runs) becomes one `style-dictionary build` with a multi-platform config.
- No public change: the token names and values in the CSS stay the same until the ADR 0002 rename lands. No semver impact on its own.

## Enforced by

- `check-system` rule `style-dictionary` (exists, #372 step 4): Style Dictionary's output equals the committed token CSS.
- `check-system` rule `token-sets` (exists, #372 step 2): no color literal in themes, one file per token, condition sets.
- `planned:no-build-tokens`: after step 10, CI fails if `build-tokens.js` comes back.
