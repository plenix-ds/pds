# #87 evidence: PrintDocument, AnswerLines, PageBreak

Build PR: #340. RED: parts not exported (all three `false`). GREEN: `PRINT_DOCUMENT_87_OK`.

| AC | What | Status | Path |
|---|---|---|---|
| AC-1 | The named page `plx-document`, the sheet's frame and padding gone on paper, A4 sheet and 20mm padding on screen | **Ran** (computed styles, print media emulated) | `tests/print-document-87.test.js` |
| AC-1 | The PDF itself: A4, 20mm margins, chrome off the paper | **Planned** (QA's print-to-PDF check, Chromium and Firefox; whether `var()` applies inside `@page`) | – |
| AC-2 | AnswerLines: 5 rows at equal 32px spacing, kept on one sheet | **Ran** (count, clamp, row height) for the rows; **Planned** for the one-sheet print | `tests/print-document-87.test.js` |
| AC-3 | PageBreak starts a new sheet | **Ran** (`break-before: page` on paper, `auto` on screen) | `tests/print-document-87.test.js` |
| AC-4 | `dir="rtl" lang="ar"` on the sheet; a child keeps its own `dir` | **Ran** for the attributes on the sheet; **Planned** for the printed reading order | `tests/print-document-87.test.js` |
| AC-5 | The header (seal) first, at the top of the first sheet | **Ran** (slot order); **Planned** (the seal image on the PDF) | `tests/print-document-87.test.js` |
| AC-6 | The CTM form has no `<style>` and no inline style | **Skipped** here (CTM rebuilds the form on its side); the three parts use no inline style or `<style>` (`node check-system.js`: SYSTEM_OK) | – |
