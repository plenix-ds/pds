# ADR 0014: Print parts: PrintDocument, AnswerLines, PageBreak

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), on the G2 design `docs/pds1/slices/87-print-document/design.md` (PR #319; D-0043, D-0052, D-0053)
- **Issue:** #87 (S2, CTM: delete its own print `<style>`)

## Context

- CTM prints A4 documents (letterhead or seal, answer lines, page breaks, EN/AR) with its own CSS. D-0043 chose Plenix parts over print utility classes.
- The design's §6 lists the tokens. Three points need a G3 ruling:
  - mm values in `plx-sys` would put literals outside the palette (check 6);
  - `comp.answer-lines-row-height -> plx-ref.size-8u` skips the system tier (check 6);
  - `var()` inside `@page` isn't reliable in every browser.

## Options

| Option | For | Against |
|---|---|---|
| **A. The mm values in `plx-ref.paper-*`, system roles `print-*` pointing to them, a `print-writing-line` role for the answer lines, and `@page plx-document` from the token (generated if `var()` fails)** | Tiers hold (literals only in ref; comp -> sys); one source for every mm; no hand-typed number | Two more tiers of names for three values |
| B. The tokens exactly as listed in the design | Fewer names | Literals in sys; a comp -> ref skip; checks 6 and 7 fail |

## Decision

**Option A.**

**Tokens (added in this PR):**

| Token | Value |
|---|---|
| `plx-ref.paper-a4-inline-size` / `-block-size` | `210mm` / `297mm` (`webOnly`) |
| `plx-ref.paper-margin-md` | `20mm` (`webOnly`) |
| `plx-sys.print-sheet-inline-size` / `-block-size` | the two A4 refs |
| `plx-sys.print-document-margin` | `{plx-ref.paper-margin-md}` |
| `plx-sys.print-writing-line` | `{plx-ref.size-8u}` (32px, about 8.5mm) |
| `plx-sys.print-break` | `auto`; `page` in the print set (`semantic.print.tokens.json`) |

**Tokens (added with the build, with the CSS that reads them):** `plx-comp.answer-lines-row-height -> {plx-sys.print-writing-line}`, `plx-comp.answer-lines-border-color -> {plx-sys.border-strong}`.

- **Grid:** `paper-*`, `print-sheet-*` and `print-document-margin` are in `GRID_EXEMPT` (check-system `token-definitions`, mm by D-0052). The design names `design.rules.json`; that file doesn't exist, and `GRID_EXEMPT` is where exemptions live.
- **`@page plx-document { size: A4; margin: … }`:** the margin reads `var(--plx-sys-print-document-margin)`, as `print.css`'s `@page` already does. If the QA print-to-PDF check (Chromium and Firefox) shows `var()` isn't applied inside `@page`, `build-steps.js` writes the rule with the token's resolved value. That's generated, never typed.

**Components (public API, all additions):**

```ts
// patterns/PrintDocument
type PrintDocumentProps = {
  header?: React.ReactNode;   // letterhead or seal: first sheet, top, kept together
  footer?: React.ReactNode;   // once, at the end of the document (D-0053)
  children: React.ReactNode;
  dir?: 'ltr' | 'rtl'; lang?: string;   // on the sheet's root
  className?: string;
};
// components/AnswerLines
type AnswerLinesProps = {
  lines?: number;             // whole number 1–40; missing or invalid -> 3 (a dev warning names the range)
  label?: React.ReactNode;    // names the group (role="group", aria-labelledby); without it the lines are aria-hidden
  className?: string;
};
// components/PageBreak
type PageBreakProps = {
  preview?: boolean;          // draws a dashed line on screen; never prints
  className?: string;
};
```

- None of the three shows its own words, so no catalog keys. The P1 example's strings go through the catalog (EN), and the Arabic through the owner (D-0012).
- PrintDocument sets `data-plx-density="standard"` on the sheet. On paper it's light (`usePrint`).

## Consequences

- **Semver: MINOR.** 3 exports, 8 tokens (6 now, 2 with the build). Other pages print as before.
- CTM can delete its print CSS once these ship in a pinned CDN version.

## Enforced by

- Checks 6 and 7 and `token-definitions` (the exemptions by name).
- G3 review of the build PR: the props as above, and the two comp tokens.
- QA: the print-to-PDF check for AC-1 to AC-5 (the `@page` margin included).
