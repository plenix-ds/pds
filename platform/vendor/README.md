# Vendored runtime files

These files are copied into the project so both Plenix applications load React without network access and the dashboard still opens from `file://`. They are runtime files, not a package installation: nothing here is managed by npm.

- `package.json` records the version of each library copied here. It is never installed. CI runs `npm outdated --prefix platform/vendor --long` as information only: "Wanted" is the copied version, "Latest" the newest release (issue 724).
- When you update a library, change its version in `package.json` too.
- The licenses of everything copied or bundled are gathered in `THIRD-PARTY-NOTICES.md` at the repository root.

`tiptap/` holds the engine every Plenix rich-text editor runs on (Tiptap 3.31.3 with ProseMirror, MIT, added 2026-10-14):
one bundled file, `tiptap.min.js` (481 KB, 153 KB gzipped; `window.PlenixTiptap`), built with esbuild from the npm packages
@tiptap/core, @tiptap/pm, @tiptap/starter-kit, @tiptap/extension-list, @tiptap/extension-mention, @tiptap/extension-table,
@tiptap/extension-text-style, @tiptap/extension-text-align, @tiptap/extension-highlight, @tiptap/extension-subscript,
@tiptap/extension-superscript, @tiptap/extension-image and @tiptap/extension-typography (all of Tiptap's free formatting,
rebuilt 2026-10-14), and `LICENSES.txt`
(the license of every bundled package). The RichTextEditor component loads it the first time an editor mounts. Its
packages, checksums, build and update steps are in `tiptap/README.md`.

`pdfjs/` holds the DocumentViewer's PDF engine (PDF.js 6.5.438, Apache-2.0: `pdf.js`, `pdf.worker.js`, `LICENSE`), loaded the
first time a PDF opens. Its checksums and serving requirements (MIME type, CSP, CORS) are in `pdfjs/README.md`.

| File | Package | Version | Build | License | Source | SHA-256 |
|---|---|---|---|---|---|---|
| `react.development.js` | react | 18.2.0 | UMD, development | MIT | https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.development.js | `857364e2b982318417025fb9b4b8355c09f75fa46ba0be93f520f769f6757a78` |
| `react-dom.development.js` | react-dom | 18.2.0 | UMD, development | MIT | https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js | `6d11da926dde155c0d8773ae0e05bb64683f1f40d4e1eb628717dd8499172282` |
| `react.production.min.js` | react | 18.2.0 | UMD, production | MIT | https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js | `4b4969fa4ef3594324da2c6d78ce8766fbbc2fd121fff395aedf997db0a99a06` |
| `react-dom.production.min.js` | react-dom | 18.2.0 | UMD, production | MIT | https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js | `21758ed084cd0e37e735722ee4f3957ea960628a29dfa6c3ce1a1d47a2d6e4f7` |

Copied on 2026-10-05. The license header is kept at the top of each file.

**The React version (#686).** These UMD files are React 18.2.0, and they stay on it: React 19 publishes no UMD script, so the script-tag way of using Plenix (the pages here, the CDN's `plenix.js`, the offline archive, an extension that loads `plenix.js`) runs on React 18. The npm package `@plenix-ds/react` supports React 18 and 19 (peer range `>=18.2.0 <20`); its source was checked for what React 19 removes. A React 19 script-tag build would need a Plenix-owned global build that bundles React, which is the owner's decision.

Pages load React through `react-loader.js` (batch 144): the production build by default; the development build (its warnings about props, keys and effects) with `?react=dev` in the address, or `localStorage.setItem('plenix.react', 'dev')` (remove it to go back). The production files were added on 2026-10-05.

## Updating

1. Pick the version, and confirm React and ReactDOM match.
2. Download both UMD files from the same cdnjs paths with the new version number.
3. Check the license header and the `ReactVersion` string inside each file.
4. Record the new SHA-256 values (`sha256sum *.js`) and the date in this table.
5. Run `node build-app.js`, then check both applications (snapshots, the dashboard from `file://`, the asset app through its preview server).

## Load order

1. `platform.css`
2. `react.development.js`
3. `react-dom.development.js`
4. `platform/dist/platform.js`
5. the application bundle
