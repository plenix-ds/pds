### Fixed

- DocumentViewer: scanned PDFs that use JPEG 2000 or JBIG2 images no longer show blank images. PDF.js 6.x decodes them with WebAssembly, so the viewer now vendors its `wasm/` folder (`platform/vendor/pdfjs/wasm/`, shipped on the CDN and in the npm package) and passes `wasmUrl` beside the worker. An app that serves the PDF.js files itself serves `wasm/` next to the worker (#384).

### Changed

- An app that hosts the PDF.js files itself must now also serve `wasm/` beside the worker (`pdf.worker.js`), with `application/wasm` for the `.wasm` files; the folder is in `platform/vendor/pdfjs/wasm/`. QuickJS (PDF scripting) is not included: DocumentViewer never enables scripting (#384).
