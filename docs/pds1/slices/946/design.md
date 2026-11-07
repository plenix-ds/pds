# #946 Read-only fields: label and value typography (G2)

- **Request:** the owner, through CTM's case summary: in read mode, a label and its value look alike. Intake applied option B (Fluent 2 field) as the default and option C (inline property list) as a variant, under D-0078 (D-0101).
- **Extends:** `PropertyList` (`platform/patterns/PropertyList`) and the read-only region (`platform/system/read-only.css`, `<ReadOnly>`). No new component.
- **Cause:** PropertyList's label is 12px regular `content-muted` and its value 13px regular `content-default`. Same weight, one step apart in size: they read as one text.

## G2/G3 reconciliation (2026-11-07)

- **Value 15px** (intake, D-0101) instead of G3's 13px.
  - The owner's complaint is that label and value look alike. Fluent 2 separates them by size too (Caption 1 Strong 12px against Body 1 14px).
  - 15px is the existing `text-lead-font-size` role, so there is no new size or token.
- **The gap between pairs is 16px** (`space-stack-lg`, G3) instead of the intake's 20px. There is no 20px sys stack role, and a new one would need an ADR.
- **The default is `stacked`** (intake) instead of G3's "keep `columns`". G3 named this case a MINOR release with a changelog note.
- **C is `columns`, with no `inline` prop** (G3).

## 1. The two layouts

| | **B: stacked (the default)** | **C: columns (the inline variant)** |
|---|---|---|
| Use | Read-only details: a case summary, a record's details, a form in read mode | Dense detail panes: an inspector, a side panel |
| Shape | Label above value | Label column and value on one line, a hairline between pairs |
| Label | **field-label** role: 12px, semibold (600), line 16px, `content-muted` | the same **field-label** role |
| Value | **field-value** role: 15px (`text-lead-font-size`, an existing sys role), regular (400), line 24px, `content-default` | **body** role: 13px, regular, line 20px, `content-default` |
| Data value (`data`) | Reddit Mono at the value size (15px), line 24px | Reddit Mono at 13px, line 20px |
| Label → value | 4px (`space-stack-xs`) | the existing label column gap (`space-inline-md`) |
| Between pairs | 16px (`space-stack-lg`, G3), at every density | padding-block per density: 4 / 8 / 12px (`space-component-gap-sm`) |
| Divider | none | `border-subtle` 1px at the block-end of each pair except the last (decorative, exempt from contrast) |
| Description under label | `secondary` role, `content-subtle` (unchanged) | unchanged |

- **Line heights are px on the grid**: 16 + 4 + 24 = 44px per pair, plus a 16px gap = 60px rhythm. The field label already uses `plx-ref.size-4u` for its line height; the value uses `plx-ref.size-6u`, and C's value `plx-ref.size-5u`.
- **Sizes and colours are existing tokens only**: 12 (`font-size-100`), 13 (`font-size-200`), 15 (`font-size-400`), `font-weight-semibold`, `content-muted`, `content-default`, `border-subtle`. Nothing new.
- **The default changes from `columns` to `stacked`**. The intake accepted that every read-only view changes look. It is a MINOR release with a changelog *Changed* note (G3).
- **C is `layout="columns"`.** There is no `inline` prop (G3).
- **A status in a value is a Badge with its icon** (DESIGN §1). The value's line box grows to the badge height. The badge is start-aligned and never stretched.

## 2. Read-only Field (a control inside `<ReadOnly>`)

- The Field's label in a read-only region takes the **field-label** role (12px, 600, `content-muted`), through a context value on `[data-plx-readonly="true"]`, like the existing input context values. An editable Field keeps its label as today (12px, 500, `content-default`).
- The value stays in its control (the sunken read-only box, 13px). The control height follows the density as before. The value's size is not changed, so read-only and editable forms keep the same heights.
- A nested `data-plx-readonly="false"` clears the context value (`initial`), as for the other read-only context values.

## 3. State matrix (PropertyList, both layouts)

| State | Tokens |
|---|---|
| default | label: `text-label-font-size`, `font-weight-semibold`, `content-muted`; value: `font-size-400` (B) or `text-body-font-size` (C), `content-default`; C divider `border-subtle` |
| hover | n/a(static text; no hover fill. A link or control inside a value keeps its own hover) |
| focus | n/a(the list is not focusable. A link or control inside a value keeps its own `focus-ring-color` ring. A cut label's Tooltip opens on hover only, as today) |
| active | n/a(not pressable) |
| disabled | n/a(read-only is not disabled, DESIGN §9; the value keeps `content-default` at full contrast) |
| loading | n/a(the list has no loading state; the page shows its Skeleton in the value's place, one line at the value's line height) |
| error | n/a(no input. An invalid value is the app's Badge or Notice per `docs/content/messaging.md`) |
| selected | n/a(not selectable as a row; the text can be selected and copied) |
| empty | the pair stays; the value keeps its line height (`min-block-size` = the value line) so the rhythm holds. The value shows the app's empty text (none by default); its wording is the Technical Writer's |
| long text | label: B wraps between words; C keeps the label column ellipsis and Tooltip (unchanged), and below 180px moves the label above. Value: wraps between words in both (`overflow-wrap: break-word`), never truncated. A data value with no spaces breaks anywhere |

- Read-only Field: its existing manifest is unchanged except the label's colour and weight under `[data-plx-readonly="true"]`.

## 4. Densities, themes, Arabic

- **B:** the same at compact, standard and comfortable. A page that needs density uses C.
- **C:** padding-block 4 / 8 / 12px. Type does not change with density.
- **Light:** `content-muted` (gray-700) and `content-default` pass 4.5:1 on every surface (check 8).
- **Dark:** `content-muted` (gray-300) is 6.31:1 on #444. No dark defects added.
- **Arabic:** the sizes change, so the RTL check runs. IBM Plex Sans Arabic takes the same roles. The label column and the hairline use logical properties. `data` and `kind="id"` values keep their Isolate behaviour.

## 5. Edge cases

- **3× English:** labels wrap (B) or end in an ellipsis with a Tooltip (C). Values wrap. Nothing overlaps at 1024×640.
- **Empty values:** see `empty` above. A whole section with no values is the app's EmptyState.
- **10,000 rows:** n/a. A PropertyList holds one item's details. A list of facts is a Table or DataGrid (the existing PropertyList note).

## 6. Messages

- None added. Empty text and errors follow `docs/content/messaging.md`. The wording is the Technical Writer's.

## 7. Choices the engineer must not invent

- The role values above: 12/600/16px and 15/400/24px; C's 13/400/20px.
- The 16px gap stays fixed in B. C's 4/8/12 padding follows density.
- C's hairline: `border-subtle`, block-end, none after the last pair.
- The read-only Field's value stays 13px in its box. Only its label changes.
- Comp token names are G3's (see G3 on #946). Their values are not.

## 8. Visual checks (D-0092, D-0017)

- PropertyList in both layouts, plus a read-only Field form, before and after, at 1366×768 and 1920×1080, in light and dark at standard density. Add RTL and compact (the change touches text and density), and one shot at 1024×640.
- The shots go on #946 and its PR.
