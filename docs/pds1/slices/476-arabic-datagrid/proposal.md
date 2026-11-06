# #476: Arabic proposal, DataGrid editing strings (DT-41, #84; #3 paste and undo)

For the owner's approval (D-0012). Nothing here is in `platform/i18n/ar.js`. Until the owner answers, these keys stay missing and an Arabic page shows them in English.

- Standard: `docs/i18n/arabic.md` (Modern Standard Arabic, Microsoft terminology, one English word = one Arabic word).
- The glossary column names the `ar.js` key whose approved Arabic is reused.
- Counts follow the six Arabic number forms already used by `dataGrid.cellsCopied`: zero, one, two, few (3 to 10), many (11 to 99), other.

## Edit mode (DataGrid view menu and toolbar)

| # | Key | English | Proposed Arabic | Why | Glossary |
|---|---|---|---|---|---|
| 1 | `dataGrid.editMode`, `viewMenu.editMode` | Editing | التعديل | The noun of Edit (تعديل). **Choice:** `presenceBar.editors` writes "Editing" as يحرّر ("is editing", a person); this is the mode's name, so it takes the noun. | `chat.edit`, `dataGrid.editCell` |
| 2 | `dataGrid.editModeInline`, `viewMenu.editModeInline` | Inline Edit | تعديل مضمّن | Inline = مضمّن | `richTextEditor.code` (رمز مضمّن) |
| 3 | `dataGrid.editModeForm`, `viewMenu.editModeForm` | Form Edit | تعديل في نموذج | Form = نموذج | `form.label` (إجراءات النموذج) |

## Editing a cell or a record

| # | Key | English | Proposed Arabic | Why | Glossary |
|---|---|---|---|---|---|
| 4 | `dataGrid.editing` | Editing {column} | جارٍ تعديل {column} | Read aloud when a cell opens. جارٍ ("in progress") keeps it apart from the button "Edit {title}". | `dataGrid.editCell` |
| 5 | `dataGrid.formTitle` | Edit {name} | تعديل {name} | Same as the cell's Edit. | `dataGrid.editCell` |
| 6 | `dataGrid.emptyValue` | — | — | A dash, not a word: kept as it is. | |
| 7 | `dataGrid.saved` | Saved | تم الحفظ | Same word. | `autosave.saved`, `formFlow.saved` |
| 8 | `dataGrid.formSaved` | Saved {name} | تم حفظ {name} | Saved, with the record's name. | `autosave.saved` |
| 9 | `dataGrid.saveRefused` | Couldn’t save. The previous value is back. | تعذّر الحفظ. تمت استعادة القيمة السابقة. | "is back" as "was restored" (تمت استعادة). | `comment.failed`, `versionHistory.restored` |
| 10 | `dataGrid.formSaveRefused` | Couldn’t save {name}. Check the values and try again. | تعذّر حفظ {name}. تحقق من القيم وحاول مرة أخرى. | Check = تحقق من; Try again = حاول مرة أخرى. | `formFlow.invalid`, `permissionsEditor.failed` |
| 11 | `dataGrid.undone` | Edit undone | تم التراجع عن التعديل | Undo = تراجع | `toast.undo`, `deleteFlow.permanent` |
| 12 | `dataGrid.redone` | Edit redone | تمت إعادة التعديل | Redo = إعادة | `richTextEditor.redo` |

## Paste counts (read aloud after a paste)

| # | Key | English (one / other) | zero | one | two | few | many | other | Why | Glossary |
|---|---|---|---|---|---|---|---|---|---|---|
| 13 | `dataGrid.cellsPasted` | {n} cell pasted / {n} cells pasted | لم تُلصق خلايا | لُصقت خلية واحدة | لُصقت خليتان | لُصقت {n} خلايا | لُصقت {n} خلية | لُصقت {n} خلية | Paste = لصق, built like "cells copied". | `importDialog.paste`, `dataGrid.cellsCopied` |
| 14 | `dataGrid.cellsSkipped` | {n} cell skipped / {n} cells skipped | لم يتم تخطّي أي خلية | تم تخطّي خلية واحدة | تم تخطّي خليتين | تم تخطّي {n} خلايا | تم تخطّي {n} خلية | تم تخطّي {n} خلية | Skip = تخطّي | `tour.skip`, `loadMore.added` |
| 15 | `dataGrid.cellsRefused` | {n} cell not saved / {n} cells not saved | لا توجد خلايا تعذّر حفظها | تعذّر حفظ خلية واحدة | تعذّر حفظ خليتين | تعذّر حفظ {n} خلايا | تعذّر حفظ {n} خلية | تعذّر حفظ {n} خلية | **Choice:** "not saved" as "could not be saved" (تعذّر حفظ). The literal لم تُحفظ خلية واحدة also reads "not a single cell was saved". | `comment.failed` |

## The owner's answer

Reply on #476 with one of:
- **Approve all.**
- **Approve all except** a row number, with your word for it.

Only the approved words go into `ar.js`, in one PR that links your reply.

## Added 2026-11-06: fill (#3, editing.fill)

| # | Key | English | Proposed Arabic | Why | Glossary |
|---|---|---|---|---|---|
| 16 | `dataGrid.fillMenu` | Fill | تعبئة | Microsoft (Excel): Fill = تعبئة | |
| 17 | `dataGrid.fillDown` | Fill down | تعبئة لأسفل | Down = لأسفل | `dataGrid.moveDown` (نقل لأسفل) |
| 18 | `dataGrid.fillRight` | Fill right | تعبئة لليسار | **Choice:** on an Arabic page the grid runs right to left, and this command copies the first column into the next ones, which lie to the **left**. A literal لليمين ("right") would describe the wrong side. Alternative: تعبئة لليمين, as Excel words it. | `dataGrid.moveRight` (نقل إلى اليمين) |
| 19 | `dataGrid.cellsFilled` | {n} cell filled / {n} cells filled | zero لم تتم تعبئة أي خلية · one تمت تعبئة خلية واحدة · two تمت تعبئة خليتين · few تمت تعبئة {n} خلايا · many تمت تعبئة {n} خلية · other تمت تعبئة {n} خلية | Built like "cells skipped" (row 14) | `loadMore.added` |
