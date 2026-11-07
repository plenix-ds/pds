# ADR 0031: Trusted Types: two private policies, `iconNode` and `cleanRichTextNodes`

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on RedSave P-47 (#940, S2 security) and PR #945. Decision D-0104 (owner may switch). Security review: G5e.
- **Issue:** #940

## Context

- RedSave runs with `Content-Security-Policy: require-trusted-types-for 'script'`. Plenix wrote HTML through plain strings (`dangerouslySetInnerHTML`, `innerHTML`), which that page rejects.
- **PR #945** replaces every sink under `platform/` with nodes. It adds:
  - **Two exports:** `iconNode(icon, options): HTMLElement` and `cleanRichTextNodes(html): DocumentFragment`.
  - **A Trusted Types policy named `plenix`.** A page that lists allowed policy names must allow it, so the name is a contract with apps.
  - **A global, `window.PlenixTrustedTypes`, holding that policy**, so `plenix-engines.js` and the main bundle share it (a name can be created only once).
- **The policy's `createHTML` is a pass-through.** It's safe while only Plenix's parser calls it: the parse goes into an inert document, and only allow-listed copies reach the page. On a global, any script could call it, which turns any string into trusted HTML and defeats the page's Trusted Types.
- **Its `createScriptURL` checks only the path** (`/vendor/…js`), so another origin's `/vendor/x.js` passes.

## Options

| Option | For | Against |
|---|---|---|
| **A. Two policies, each private to its bundle: `plenix` (HTML parsing, main bundle) and `plenix-engines` (script URL, `plenix-engines.js`). No global.** | No pass-through policy reachable from page code. Each bundle owns the one capability it needs. | Apps that list names allow two: `trusted-types plenix plenix-engines`. |
| B. One policy, kept on the global (PR #945 as is) | One name | A pass-through `createHTML` on `window`: a Trusted Types bypass for any script. The global becomes public API. |
| C. One policy, global, but only `createScriptURL` exposed | One global, no HTML bypass | The main bundle can't create `plenix` when the engines script made it first, so HTML parsing fails on such pages. |

## Decision

**Option A** (D-0104; reply B or C on #940 to switch).

- **Exports** (MINOR, *Added*):
  - `iconNode(icon: IconValue, options?: IconMarkupOptions | null): HTMLElement`: the icon as an element, for code that builds DOM nodes.
  - `cleanRichTextNodes(html: unknown): DocumentFragment`: the same allow-list as `cleanRichText`, returned as nodes.
- **Policies** (a contract with apps; renaming one is MAJOR):
  - `plenix`: created once by the main bundle and kept in a module variable, never on `window`. `createHTML` is used only by `parseHtmlFragment` (`utils/trustedHtml.ts`), which parses into an inert document.
  - `plenix-engines`: created by `plenix-engines.js` and kept in its closure. `createScriptURL` accepts only a URL on **the origin of `plenix-engines.js` itself**, under its `vendor/` folder, ending in `.js`.
  - If a name can't be created (the page doesn't allow it, or it already exists), that capability is off. Parsing returns an empty fragment and the engine doesn't load, and development warns once. Nothing falls back to a plain string on an enforcing page.
- **No global.** `window.PlenixTrustedTypes` isn't added. If it ships, it's removed without a deprecation, because it was never documented API.
- **Docs:** the CSP note for apps reads `trusted-types plenix plenix-engines` (plus the app's own names).
- **Out of scope:** the vendored editing engine (Tiptap/ProseMirror) still parses HTML with plain strings. On an enforcing page, `RichTextEditor` shows the cleaned content read-only (PR #945). Making it safe is a follow-up for Security (a vendor patch, or an app-owned default policy).

## Consequences

- **Semver: MINOR.** *Added*: the two exports and the two policy names. Pages that enforce Trusted Types now work, which is a *Fixed* entry.
- An app that restricts policy names adds two names. The release note says so.

## Check

- `tests/trusted-types-940.test.js` (PR #945), on a page with `require-trusted-types-for 'script'; trusted-types plenix plenix-engines`:
  - no violation from Plenix's code;
  - rich text is still cleaned;
  - LTR and RTL.
  - Added for this ADR: `window.PlenixTrustedTypes` is undefined, and `plenix-engines` refuses a script URL on another origin.
- A static scan (same test) holds the rule that no file under `platform/` writes HTML.
- The Ownership check: the two export names are listed in this ADR.
