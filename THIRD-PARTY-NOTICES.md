# Third-party notices

Plenix ships the third-party software below, either copied into `platform/vendor/` and `platform/fonts/` or bundled into its built files (`platform/dist/platform.js`, the CDN's `plenix.js` and `plenix.esm.js`, and `@plenix-ds/react`). Each one keeps its own license. This file gathers them (issue 724).

- The versions copied into `platform/vendor/` are recorded in `platform/vendor/package.json`. CI compares them with the latest releases as information only (`npm outdated --prefix platform/vendor`).
- Each folder's README holds the files, checksums and update steps.

## Summary

| Software | Version | License | Where | Full license text |
|---|---|---|---|---|
| React | 18.2.0 | MIT | `platform/vendor/react.*.js` | below, and the header of each file |
| ReactDOM | 18.2.0 | MIT | `platform/vendor/react-dom.*.js` | below, and the header of each file |
| TanStack Table (`@tanstack/react-table`, `@tanstack/table-core`) | 8.21.3 | MIT | bundled into the Platform builds (DataGrid) | below |
| TanStack Virtual (`@tanstack/react-virtual`, `@tanstack/virtual-core`) | 3.14.21, 3.19.6 | MIT | bundled into the Platform builds (DataGrid) | below |
| Apache ECharts | 6.1.0 | Apache-2.0 | `platform/vendor/echarts/echarts.min.js` | `platform/vendor/echarts/LICENSE`, `NOTICE` below |
| ZRender (inside ECharts) | 6.1.0 | BSD-3-Clause | `platform/vendor/echarts/echarts.min.js` | below, and `platform/vendor/echarts/LICENSE-zrender` |
| tslib (inside ECharts) | 2.3.0 | 0BSD | `platform/vendor/echarts/echarts.min.js` | below, and `platform/vendor/echarts/LICENSE-tslib` |
| PDF.js | 6.5.438 | Apache-2.0 | `platform/vendor/pdfjs/` | `platform/vendor/pdfjs/LICENSE` |
| OpenJPEG (inside PDF.js's `wasm/openjpeg.wasm`, JPEG 2000) | as built by PDF.js 6.5.438 | BSD-2-Clause | `platform/vendor/pdfjs/wasm/` | `platform/vendor/pdfjs/wasm/LICENSE_OPENJPEG`, `LICENSE_PDFJS_OPENJPEG` |
| JBIG2 decoder (PDFium, inside `wasm/jbig2.wasm`) | as built by PDF.js 6.5.438 | BSD-3-Clause | `platform/vendor/pdfjs/wasm/` | `LICENSE_JBIG2`, `LICENSE_PDFJS_JBIG2` |
| qcms (Mozilla, inside `wasm/qcms_bg.wasm`, ICC colors) | as built by PDF.js 6.5.438 | MIT | `platform/vendor/pdfjs/wasm/` | `LICENSE_QCMS`, `LICENSE_PDFJS_QCMS` |
| Tiptap, ProseMirror and their dependencies (46 packages) | Tiptap 3.31.3 | MIT | `platform/vendor/tiptap/tiptap.min.js` | `platform/vendor/tiptap/LICENSES.txt` (each package's own text) |
| DM Sans | variable | SIL Open Font License 1.1 | `platform/fonts/dm-sans-*.woff2` | `platform/fonts/OFL-DMSans.txt` |
| Reddit Mono | variable | SIL Open Font License 1.1 | `platform/fonts/reddit-mono-*.woff2` | `platform/fonts/OFL-RedditMono.txt` |
| Readex Pro | variable | SIL Open Font License 1.1 | `platform/fonts/readex-pro-*.woff2` | `platform/fonts/OFL-ReadexPro.txt` |
| IBM Plex Sans Arabic | 300 to 700 | SIL Open Font License 1.1 | `platform/fonts/ibm-plex-sans-arabic-*.woff2` | `platform/fonts/OFL-IBMPlexSansArabic.txt` |
| Material Symbols (Sharp, weight 300) | the commit in `platform/components/Icon/glyphs.js` | Apache-2.0 | `platform/icons/` | `platform/icons/README.md` |

### The packages inside `tiptap.min.js`

All MIT: @floating-ui/core 1.8.0, @floating-ui/dom 1.8.0, @floating-ui/utils 0.2.12, @tiptap/core and 27 @tiptap extensions and kits 3.31.3, linkifyjs 4.3.3, orderedmap 2.1.1, prosemirror-commands 1.7.2, prosemirror-dropcursor 1.8.4, prosemirror-gapcursor 1.4.1, prosemirror-history 1.5.1, prosemirror-keymap 1.2.3, prosemirror-model 1.25.12, prosemirror-schema-list 1.5.1, prosemirror-state 1.4.4, prosemirror-tables 1.8.5, prosemirror-transform 1.12.2, prosemirror-view 1.42.6, rope-sequence 1.3.4, w3c-keyname 2.2.8. `platform/vendor/tiptap/LICENSES.txt` lists each one with its copyright line and license text.

## Notices

### Apache ECharts (NOTICE)

```
Apache ECharts
Copyright 2017-2026 The Apache Software Foundation

This product includes software developed at
The Apache Software Foundation (https://www.apache.org/).
```

## License texts

### MIT: React and ReactDOM

```
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The 18.2.0 files carry their original header, "Copyright (c) Facebook, Inc. and its affiliates."

### MIT: TanStack Table and TanStack Virtual

```
MIT License

Copyright (c) 2016 Tanner Linsley (TanStack Table)
Copyright (c) 2021-present Tanner Linsley (TanStack Virtual)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### BSD-3-Clause: ZRender

```
BSD 3-Clause License

Copyright (c) 2017, Baidu Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### 0BSD: tslib

```
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

### Apache-2.0: Apache ECharts, PDF.js and Material Symbols

The full text is in `platform/vendor/echarts/LICENSE` and `platform/vendor/pdfjs/LICENSE` (the same Apache License, Version 2.0), and at https://www.apache.org/licenses/LICENSE-2.0.

### SIL Open Font License 1.1: the four typefaces

Each typeface's text, with its copyright and Reserved Font Names, is beside it in `platform/fonts/OFL-*.txt`.
