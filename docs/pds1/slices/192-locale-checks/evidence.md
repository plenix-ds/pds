# #192 (P0-10): locale checks, evidence

- **Check:** `node tools/checks/locale/locale.mjs [baseRef]` (six rules; diff-aware with a base ref). Pseudo-locales: `node tools/checks/locale/pseudo.mjs en-XA|ar-XB [out.json]`. Unit tests: `tools/checks/locale/locale.test.mjs`.
- **Approval record:** `tools/checks/locale/approved-ar.json` (D-0012, D-0075).

## Evidence (2026-11-06, main at a5876c52)

- **Ran:** `node tools/checks/locale/locale.mjs`: 60 findings (missing-ar 28, plural-forms 1, unused-key 27, jsx-literal 4); G6 release state FAIL (28 missing Arabic, all on the owner's open proposals #476 and #629).
- **Ran:** `node tools/checks/locale/locale.mjs origin/main`: 0 new, exit 0.
- **Ran:** the same with a planted `{x}` and changed Arabic in `ar.js` and a literal `title` in Combobox (reverted): 3 new (placeholder, unapproved-ar, jsx-literal), exit 1.
- **Ran:** `node tools/ci/check-decisions.mjs origin/main`: DECISIONS_OK.
- **Skipped:** `npx vitest run tools/checks/locale`: tests run only when the owner starts them. CI's existing step "The checks' own unit tests (Vitest)" runs them.
- **Planned:** the CI step running the check diff-aware (`.github/workflows/ci.yml`, release-architect's file; requested on #192).
- **Planned:** loading `ar-XB` in the RTL visual snapshots; a mixed-direction isolation rule (`dir="auto"`, `<bdi>`) for user data in JSX.

## Today's findings (old debt; not blocking)

- plural-forms: platform/i18n/ar.js collection.selected: Arabic lacks zero
- missing-ar: platform/i18n/ar.js appShell.minSize.title: no Arabic (English: "Screen size not supported")
- missing-ar: platform/i18n/ar.js appShell.minSize.text: no Arabic (English: "This app shows a lot of detailed information and isn't designed for small scree)
- missing-ar: platform/i18n/ar.js appShell.minSize.continue: no Arabic (English: "Continue anyway")
- missing-ar: platform/i18n/ar.js combobox.moreChips: no Arabic (English: "{count} more")
- missing-ar: platform/i18n/ar.js dataGrid.cellsPasted: no Arabic (English: {"one":"{n} cell pasted","other":"{n} cells pasted"})
- missing-ar: platform/i18n/ar.js dataGrid.cellsSkipped: no Arabic (English: {"one":"{n} cell skipped","other":"{n} cells skipped"})
- missing-ar: platform/i18n/ar.js dataGrid.cellsRefused: no Arabic (English: {"one":"{n} cell not saved","other":"{n} cells not saved"})
- missing-ar: platform/i18n/ar.js dataGrid.editing: no Arabic (English: "Editing {column}")
- missing-ar: platform/i18n/ar.js dataGrid.editMode: no Arabic (English: "Editing")
- missing-ar: platform/i18n/ar.js dataGrid.editModeInline: no Arabic (English: "Inline Edit")
- missing-ar: platform/i18n/ar.js dataGrid.editModeForm: no Arabic (English: "Form Edit")
- missing-ar: platform/i18n/ar.js dataGrid.formTitle: no Arabic (English: "Edit {name}")
- missing-ar: platform/i18n/ar.js dataGrid.emptyValue: no Arabic (English: "—")
- missing-ar: platform/i18n/ar.js dataGrid.formSaved: no Arabic (English: "Saved {name}")
- missing-ar: platform/i18n/ar.js dataGrid.formSaveRefused: no Arabic (English: "Couldn’t save {name}. Check the values and try again.")
- missing-ar: platform/i18n/ar.js dataGrid.saved: no Arabic (English: "Saved")
- missing-ar: platform/i18n/ar.js dataGrid.saveRefused: no Arabic (English: "Couldn’t save. The previous value is back.")
- missing-ar: platform/i18n/ar.js dataGrid.undone: no Arabic (English: "Edit undone")
- missing-ar: platform/i18n/ar.js dataGrid.redone: no Arabic (English: "Edit redone")
- missing-ar: platform/i18n/ar.js confirmAction.title: no Arabic (English: "{verb} {name}?")
- missing-ar: platform/i18n/ar.js confirmAction.titleMany: no Arabic (English: "{verb} {count} {plural}?")
- missing-ar: platform/i18n/ar.js confirmAction.permanent: no Arabic (English: "This cannot be undone.")
- missing-ar: platform/i18n/ar.js confirmAction.confirm: no Arabic (English: "{verb}")
- missing-ar: platform/i18n/ar.js confirmAction.cancel: no Arabic (English: "Cancel")
- missing-ar: platform/i18n/ar.js viewMenu.editMode: no Arabic (English: "Editing")
- missing-ar: platform/i18n/ar.js viewMenu.editModeInline: no Arabic (English: "Inline Edit")
- missing-ar: platform/i18n/ar.js viewMenu.editModeForm: no Arabic (English: "Form Edit")
- missing-ar: platform/i18n/ar.js voteTally.notRecorded: no Arabic (English: "Not recorded")
- unused-key: platform/i18n/en.json dataGrid.showAll: no Platform source reads it
- unused-key: platform/i18n/en.json dataGrid.narrower: no Platform source reads it
- unused-key: platform/i18n/en.json dataGrid.moveLeft: no Platform source reads it
- unused-key: platform/i18n/en.json dataGrid.moveRight: no Platform source reads it
- unused-key: platform/i18n/en.json dataGrid.ungroup: no Platform source reads it
- unused-key: platform/i18n/en.json providers.UnsavedGuard.title: no Platform source reads it
- unused-key: platform/i18n/en.json providers.UnsavedGuard.message: no Platform source reads it
- unused-key: platform/i18n/en.json providers.UnsavedGuard.leave: no Platform source reads it
- unused-key: platform/i18n/en.json providers.UnsavedGuard.stay: no Platform source reads it
- unused-key: platform/i18n/en.json providers.theme-boot.compact: no Platform source reads it
- unused-key: platform/i18n/en.json providers.theme-boot.standard: no Platform source reads it
- unused-key: platform/i18n/en.json providers.theme-boot.comfortable: no Platform source reads it
- unused-key: platform/i18n/en.json templates.Commerce.Storefront.layout: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.empty: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.emptyDescription: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.pane: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.sections: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.retry: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.home: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.search: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.tools: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.inspector: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.detail: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.noSelection: no Platform source reads it
- unused-key: platform/i18n/en.json templates.templates.Templates.noSelectionDescription: no Platform source reads it
- unused-key: platform/i18n/en.json utils.clipboard.failed: no Platform source reads it
- unused-key: platform/i18n/en.json commerce.orders.notRefundable: no Platform source reads it
- jsx-literal: platform/components/Combobox/Combobox.tsx:268 text "Create “"
- jsx-literal: platform/patterns/AppHeader/AppHeader.jsx:202 text "Plenix"
- jsx-literal: platform/patterns/AppHeader/AppHeader.jsx:202 text "Plenix"
- jsx-literal: platform/patterns/ImageUpload/ImageUpload.jsx:126 placeholder="none"
