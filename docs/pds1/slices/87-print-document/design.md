# #87: printable A4 documents: design (G2)

- **Brief:** `brief.md` (G1, D-0043: Plenix parts).
- **Extends:**
  - `platform/system/print.css`: chrome off paper, keep-together, print tokens set only under `@media print`.
  - `hooks/usePrint.ts`: the light theme on paper.
  - The Card surface (6px corners, card shadow) for the sheet on screen.
- **Decisions:** D-0052 (paper sizes in mm, on a named page) and D-0053 (the footer at the end of the document, not repeated).

## 1. PrintDocument (pattern)

- **Screen:** one sheet, centered on `sys.surface-sunken`. The sheet is `sys.surface-default`:
  - border 1px `sys.border-default`, corners `sys.shape-sm` (6px), shadow `sys.shadow-card`;
  - inline size `print-sheet-inline-size` (210mm), **minimum** block size `print-sheet-block-size` (297mm), so it grows with its content;
  - padding `print-document-margin` (20mm) on all sides (logical `padding-block`/`padding-inline`).
- **Paper:**
  - the sheet uses the named page `plx-document` (`page: plx-document`), and `@page plx-document` sets `size: A4` and `margin: 20mm`;
  - border, shadow, corners and padding go to none or 0 (through the print tokens, no print-only rules in the component);
  - other pages keep `print-page-margin` (24px), unchanged.
- **Content order:** `header` slot → `children` → `footer` slot, in normal flow. Stack gap is `sys.space-layout-md` (24px).
  - **header:** letterhead or seal. It sits on the first sheet, at the top. Images get `max-inline-size: 100%`, and their height is the app's. The header keeps together (`print-keep`).
  - **footer:** at the end of the document, on the last sheet, in flow (D-0053). Type: `caption` role, `sys.content-muted`.
- **Type:** the existing roles only. The title is `title` (20px, 600), the body is `body` (13px). IDs, dates and numbers in fields use `sys.font-data` with `tabular-nums` (D-0006). Prose never uses the data font.
- **Direction:** `dir` and `lang` go on the sheet's root. Any child may set its own `dir` (AC-4). Logical properties only.
- **Density:** the sheet sets `data-plx-density="standard"` on itself, so paper looks the same whatever the page density is.
- **Theme:** on screen, the sheet follows the theme (dark mode shows a dark sheet). On paper it's always light (`usePrint`).

## 2. AnswerLines (component)

- **Row:** each line is one row `answer-lines-row-height` = 32px (`ref size-8u`, about 8.5mm, a handwriting line), with only a block-end border, 1px `sys.border-strong` (gray-500, so it shows on paper; `border-default` prints too faint).
- **label (optional):** above the lines, `label` role (13px, 600), `sys.content-default`, gap `sys.space-stack-xs`. It names the group (`role="group"` + `aria-labelledby`); without a label, the lines are `aria-hidden`.
- **lines:** a whole number, clamped 1 to 40; a missing or invalid value gives 3.
- **Paper:** the whole block keeps together (`print-keep`) and its label stays with its lines.
- The lines run the full inline size; direction has no effect, and the label follows `dir`.

## 3. PageBreak (component)

- **Paper:** `break-before: page` through a new system token `print-break` (`page` on paper, `auto` on screen), the same way as the other print tokens.
- **Screen:** nothing is drawn (block size 0, `aria-hidden`).
- **preview:** draws a 1px dashed `sys.border-default` line across the sheet, with `sys.space-layout-md` above and below it, so a reviewer sees where the sheet breaks. It never prints.

## 4. State matrix

| State | PrintDocument | AnswerLines | PageBreak |
|---|---|---|---|
| default | sheet as in §1 | rows as in §2 | screen: nothing; paper: new sheet |
| hover / focus / active / selected | n/a (not interactive; focus stays on fields inside) | n/a (not interactive) | n/a |
| disabled | n/a | n/a | n/a |
| loading | n/a (the app shows its own Skeleton inside `children`) | n/a | n/a |
| error | n/a (fields inside show their own errors under the field, §11) | n/a | n/a |
| empty | no header: content starts at the top margin; no children: an empty sheet at its minimum size | `lines` missing → 3 | n/a |
| long text | 3x text wraps (`overflow-wrap: anywhere`) and flows to more sheets; the sheet grows on screen | a long label wraps above the lines | n/a |
| preview | n/a | n/a | dashed line (§3) |

- **10,000 rows:** a table inside flows over as many sheets as it needs. Its header row repeats on each sheet (`thead` stays `table-header-group`), and no row is split (`print-keep` on rows).
- **Light and dark:** both on screen, at standard density only (§1).
- **Arabic:** the worked example (P1) is shown in EN and AR. The AR strings need owner approval (D-0012), through the i18n Engineer.

## 5. Messages

- None of the three parts shows a message.
- The P1 docs example uses catalog strings only (Technical Writer for wording, i18n Engineer for AR).

## 6. Choices the engineer must not invent

- **Tokens for ds-architect (G3):**
  - `sys.print-sheet-inline-size` 210mm and `sys.print-sheet-block-size` 297mm;
  - `sys.print-document-margin` 20mm;
  - `sys.print-break` (`auto` on screen / `page` on paper);
  - `comp.answer-lines-row-height` → 32px (size-8u);
  - `comp.answer-lines-border-color` → `sys.border-strong`.
- **`@page plx-document`:** must reach A4 and 20mm in Chromium and Firefox. If `var()` doesn't work inside `@page`, the token build writes the literal value (brief, Unknown). Never write a hand-typed number.
- **mm units:** used only in these print tokens (D-0052). They're exempt from the 4px-grid check by name (`print-*`). The ds-architect adds the exemption to `design.rules.json`.
- **Not in scope:**
  - no running header or footer and no page numbers (D-0053);
  - no Letter size (P2);
  - no new colors.

## Evidence

- **Planned:** a CI visual of the PrintDocument example on screen, light and dark at standard density, plus RTL (text and direction change).
- **Planned:** a Chromium print-to-PDF check for AC-1 to AC-5, by the QA Engineer.
