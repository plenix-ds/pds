### Added

- `iconNode(icon, options)`: the same icon as `iconMarkup`, as an element, for code that builds DOM nodes and must not write HTML (a browser extension's page, Firefox's add-on linter). `cleanRichTextNodes(html)`: the cleaned rich text as nodes, to append with `replaceChildren` (#940).

### Changed

- Trusted Types (#940, RedSave P-47): no code under `platform/` writes HTML any more. `RichText` and the `RichTextEditor`'s start content add the cleaned nodes instead of an HTML string, and the sanitizer parses its input in an inert document through one Trusted Types policy named `plenix`. A page that sets `require-trusted-types-for 'script'` must allow the name (`trusted-types plenix`). The policy also names the one vendor script Plenix adds (`plenix-engines.js`). The editing engine under `vendor/` (Tiptap) still parses HTML with plain strings: on such a page the editor shows its content read-only and a development warning says why.
