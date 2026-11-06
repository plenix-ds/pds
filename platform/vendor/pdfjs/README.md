# PDF.js (the DocumentViewer's PDF engine)

PDF.js 6.5.438 (#86), from the official pdfjs-dist npm package. Apache-2.0; license in LICENSE. `build/pdf.mjs` and
`build/pdf.worker.mjs` renamed to `.js` for JavaScript MIME serving. The only source addition is a Plenix provenance
header; the upstream code is unchanged.

| File | SHA-256 |
|---|---|
| `pdf.js` | see `sha256sum` (replaced with the 6.5.438 build in #86) |
| `pdf.worker.js` | see `sha256sum` (replaced with the 6.5.438 build in #86) |
| `wasm/openjpeg.wasm` (JPEG 2000) | `7ea4b2b04613370ad4e9c1162da750cc88b4b176eac0d0c164b3caff23fc0a46` |
| `wasm/jbig2.wasm` (JBIG2) | `466f45c2a61a698152fb5400c27e56ff2ceb73dcb71fde3fc366a502308eaab0` |
| `wasm/qcms_bg.wasm` (ICC color profiles) | `663d86126d5f5fcb1c61490f94353e2a8375660b8c5498ab3ebab5a34b08800e` |

`wasm/` is `pdfjs-dist@6.5.438`'s `wasm/` folder, copied, less the QuickJS files (the `*_nowasm_fallback.js` files, which serve pages whose CSP blocks WebAssembly, and the six LICENSE files; 0.9 MB). QuickJS, PDF.js's sandbox for scripts embedded in PDFs, is left out on purpose: DocumentViewer never enables scripting, and a JavaScript eval engine should not ship in the self-hosting archive (#150). PDF.js 6.x decodes JPEG 2000,
JBIG2 and ICC color profiles with WebAssembly; without the folder a scanned PDF using those codecs draws blank images (#384). DocumentViewer passes
`wasmUrl` as the folder beside the worker (`<worker folder>/wasm/`), so it follows `pdfWorkerUrl` / `pdfModuleUrl` when an app serves the vendor files itself: serve `wasm/`
next to the worker, with `application/wasm` for the `.wasm` files.

DocumentViewer loads it lazily from the shared vendor folder through `vendorBase()` (platform/utils/vendorBase.js): beside
the repository's `platform/dist/platform.js` it is `platform/vendor/pdfjs/`; beside the CDN's `plenix.js` it is
`/cdn/<version>/vendor/pdfjs/`; in the npm package `dist/vendor/pdfjs/` (build-packages.js copies it to both, and the CDN
manifest hashes it). `window.PlenixVendorBase` overrides the folder; `pdfModuleUrl` and `pdfWorkerUrl` override the files.

Serving it: `pdf.js` is an ES module (`text/javascript`); allow its origin in `script-src` and the worker in `worker-src`
(Content Security Policy); on another origin than the page it needs CORS headers (`Access-Control-Allow-Origin`).
Moved here from platform/components/DocumentViewer/vendor/ on 2026-10-22 (issue #238).
