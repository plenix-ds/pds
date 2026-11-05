# Brief: printable A4 documents (#87)

Owner: pds1-product-lead. Design: pds1-design-director (G2). API: pds1-ds-architect (G3). Build: pds1-component-engineer. Decision: D-0043.

## Goal

An app prints a form or certificate on A4 with the right margins, a letterhead or seal, ruled lines to write on, and page breaks where it wants them. It uses only Plenix parts, with no `<style>` of its own.

## Known, inferred, unknown

| | What |
|---|---|
| Known | CTM 3.0 (PLX-010) prints the priest-request form and decree certificates from its own `<style>` and wants to delete it. It needs: A4 size, 20mm margins, headings, a letterhead/seal slot, ruled answer lines, page breaks, and per-field direction (EN/AR). Plenix already has `usePrint` (light theme on paper), `platform/system/print.css` (chrome off paper, keep-together, `@page` margin from `--plx-sys-print-page-margin`) and Show/Hide for print. |
| Inferred | Decree certificates are HTML that CTM prints or saves as PDF. A server-side PDF engine is CTM's own business. |
| Unknown | Whether browsers apply a `var()` inside `@page` (support is uneven). The build must check this in Chromium and Firefox, and fall back to a fixed token value written by the token build if needed. |

## P0

- `PrintDocument` (pattern): an A4 sheet (210 × 297mm) on screen and on paper, with 20mm margins from a print token. It has a `header` slot (letterhead or seal) and a `footer` slot (page reference), and takes `dir` and `lang` for the whole document.
- `AnswerLines` (component): `lines` (count), plus an optional `label`. Ruled lines on the type rhythm for handwriting, with a border token for the color. They print, and they're never split across sheets.
- `PageBreak` (component): forces the next content onto a new sheet. It's invisible on screen apart from an optional dashed marker in a preview mode.
- Per-field direction: any field or line inside the document takes `dir`, using logical properties only.

## P1

- A docs page and Storybook story: the priest-request form as the worked example, in EN and AR.
- `usePrint` sets the document title from `PrintDocument`'s `title` prop.

## P2

- A Letter page-size option.

## Non-goals

- No PDF generation in Plenix.
- No new colors or fonts; tokens only.
- No print preview app or editor.

## Affected packages

`@plenix-ds/styles` (print tokens, `print.css`), `@plenix-ds/react` (PrintDocument, AnswerLines, PageBreak), `@plenix-ds/tokens` (print page size and margin).

## Acceptance

- **AC-1** Given a page with `PrintDocument`, when it is printed or saved as PDF in Chromium, then the sheet is A4 with 20mm margins, and the app header and navigation aren't on the paper.
- **AC-2** Given `AnswerLines lines={5}`, when it prints, then 5 ruled lines show at equal spacing, all on one sheet.
- **AC-3** Given content then `PageBreak` then more content, when it prints, then the second part starts on a new sheet.
- **AC-4** Given `PrintDocument dir="rtl" lang="ar"` with one field `dir="ltr"` (an ID number), when it prints, then the document reads right to left, and that field stays left to right.
- **AC-5** Given a `header` with a seal image, when it prints, then the seal shows on the first sheet at the top.
- **AC-6** Given the CTM priest-request form rebuilt with these parts, when the style checks run, then the form has no `<style>` and no inline style.

## Already implemented

`platform/hooks/usePrint.ts`, `platform/system/print.css` and the Show/Hide-for-print visibility (`plx-visibility--no-print`).

## Anything unclear

None open. The `@page` + `var()` question is a build check with a defined fallback (Unknown above), not an open product question.
