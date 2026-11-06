# Spec wording: what to clean up, and how (revised after review)

A proposal for the hand-written parts of the design spec: overview, purpose, usage, behavior, accessibility and content
guidance. Nothing in the spec has been changed. The goal is **less reading with complete guidance**: every requirement
survives or is retired on purpose; word counts are a side effect, not the target.

Revision 2 (2026-10-21) follows an outside review: the Button sample had dropped the 2xs size and the tertiary variant
(fixed below), the rules were too rigid (sentence length, "filler"), API names must stay one link away, and the
Table / DataGrid rule had to be settled first (settled by the owner the same day).

## What I found

The hand-written text across the built components is about **142,000 words**. Most of it is accurate; the problems are
repetition and padding. Counts come from `count-spec-text.js` in this folder.

- **The same fact, said several times on one page.** Badge states its pill rule four times (Overview, Purpose, the first
  Usage point, its own section). Button says "a link goes somewhere, a button does something" twice.
- **Rows that say nothing.** 729 entries read "Not applicable", "None" or "Not focusable" (about 6,700 words). Some are
  empty ("Error: Not applicable"); some carry a real constraint ("not interactive or focusable") and stay.
- **Sentences copied across pages.** 252 sentences appear three or more times (1,656 extra copies), for example "Keep the
  user in context and preserve their work." on 29 pages. Shared does not mean useless: a shared rule moves to one place
  and pages link to it; only sentences that say nothing about the item are cut.
- **Accessibility rows applied by page, not by behavior.** "Every control: an accessible name, a visible focus indicator,
  44px targets on touch" appears on every page, Badge included.
- **History inside rules.** 8 rules carry "(owner, date)" mid-sentence.
- **Long sentences.** 99 entries are over 45 words.
- **Two rules that disagree.** See "Decide first" below.

## The Table and DataGrid rule (settled by the owner, 2026-10-21)

> **DataGrid** is the dynamic table: sort, filter, group, search and the rest. **Table** is the static table. A base
> Table looks the same as a DataGrid. Applications never hand-build a table (a `<table>` element or another grid
> library).

`AGENTS.md`, `tools/agent/library/PROMPT-lane.md` and `tools/agent/web/BRIEF-web.md` said "Every table is the DataGrid";
they now say the rule above. DataGrid's Usage text, which sent documentation tables to DataGrid, is corrected in the
sample below. "Never a `<table>` element" is about applications building their own tables, not about the engine's markup
(which uses ARIA grid and table roles).

## Proposed rules (revised)

1. **Say each fact once per page**, while keeping a critical constraint visible where someone needs it (a one-line
   reminder that links to the full rule is fine).
2. **Hide empty rows; keep meaningful absence.** "Error: Not applicable" goes. "Not interactive or focusable" stays: it
   is a constraint.
3. **Centralize shared guidance and link to it.** A rule true of many components lives once (a foundation page) and each
   page links to it. Only sentences that say nothing specific are cut.
4. **Short sentences as guidance, not a limit.** Lead with the point. One sentence may hold a condition and its
   exception. Two or more sentences become bullets (existing spec rule).
5. **Move owner/date notes to Details**, keeping them as the rule's source.
6. **Plain language in Usage, with the API one link away.** Usage names the behavior in words and links the exact prop
   and its example in Development ("an icon-only button (`iconOnly`)").
7. **Apply accessibility guidance by behavior**: interactive rows where something is interactive, including interactive
   parts inside an otherwise static component.

## Samples (revised)

Each sample ends with a requirement check: every requirement in the original text, and where it is in the new text.

### Button

**Overview and Purpose**

| Now | Proposed |
| --- | --- |
| A control that causes an action, in six variants (secondary, primary, tertiary, ghost, danger, danger secondary) and five sizes. It never looks like a link: a link goes somewhere, a button does something. | Runs an action: six variants (secondary, primary, tertiary, ghost, danger, danger secondary) and five sizes. It never looks like a link. |
| Lets people cause an action, with the emphasis that matches its importance: one primary per area, secondary by default, danger for destructive actions. | Shows how important an action is: one primary per area, secondary by default, danger for destructive actions. |

**Usage**

| Now | Proposed |
| --- | --- |
| Causing an action: secondary by default, primary once per area, quiet in dense rows, danger for destructive | Run an action: secondary by default, primary once per area, a quiet variant (tertiary or ghost) in dense rows, danger for destructive actions ([`variant`](#development)). |
| Size by role: 2xs, xs (inline), sm (toolbar), md (standard), lg (prominent) | Size by role: 2xs and xs inline, sm in toolbars, md standard, lg prominent ([`size`](#development)). |
| Going somewhere: use a Link (a link goes somewhere, a button does something); a quiet action is a ghost or tertiary button, never link-styled | Going somewhere: use a Link; a button does something, a link goes somewhere. A quiet action is a tertiary or ghost button, never styled as a link. |
| Choosing one value among a few: use Segmented control | Picking one of a few values: use Segmented control. |

**Behavior**: "Error: Not applicable: a button has no error state; report a failed action with a message." becomes
"Errors: a button has none; report a failed action with a message." (it carries guidance, so it stays, shorter).
"The label stays on one line and truncates with an ellipsis. Use iconOnly with a label in tight toolbars." becomes
"Keeps its label on one line; a long label ends in an ellipsis. In a tight toolbar, use an icon-only button
([`iconOnly`](#development)) with a label."

**Content guidance**: "Error messages: Not applicable: buttons carry no error text." goes (empty).

**Requirement check**

| Requirement in the original | In the proposal |
| --- | --- |
| Six variants, named | Overview |
| Five sizes, each with its role, including 2xs | Usage, sizes |
| Never looks like a link; link goes somewhere, button does something | Overview (constraint), Usage (reason, once) |
| One primary per area, secondary default, danger destructive | Purpose; Usage |
| Quiet in dense rows: tertiary or ghost | Usage |
| Quiet action never link-styled | Usage |
| One of a few values: Segmented control | Usage |
| No error state; report failures with a message | Behavior |
| Label on one line, ellipsis; icon-only with a label in tight toolbars | Behavior, with the prop linked |

### Badge

**Overview and Purpose**

| Now | Proposed |
| --- | --- |
| A status pill: the workflow state of a record in one of six soft variants. Pills in filter values, tables, tags and statuses use a soft background … (owner, 2026-10-14). Status pills and category pills use separate color systems: a status is a Badge, a tag or category is a Tag in its category color. | A soft pill that shows a record's workflow status, in six variants. A status is a Badge; a tag or category is a Tag in its category color. |
| Shows a workflow status, such as Approved or Failed, as a soft pill so people can scan state at a glance. Pills in filter values … (repeated) | Lets people scan status at a glance (Approved, Failed). Every pill follows the pill rule (below). |

The pill rule stays once, in its own section; its source (owner, 2026-10-14) moves to Details.

**Usage**

| Now | Proposed |
| --- | --- |
| Every pill soft: shade 100 background, 1px shade-300 border, 700 text (800 for red), 4px corners | (in the pill rule section; Usage links to it) |
| A workflow status in its variant: neutral, success, active, waiting, action-required, negative | A workflow status in its variant: neutral, success, active, waiting, action required, negative ([`tone`](#development)). |
| Yellow for waiting or paused, orange for action or correction required, red for blocked or unsuccessful | Yellow for waiting or paused, orange for action or correction required, red for blocked or unsuccessful. |
| Draft as a workflow status is neutral (gray), not waiting | Draft is neutral (gray), not waiting. |
| Something clickable: use Chip | Something clickable: use Chip. |
| A tag or category in a status variant: use Tag with its category color | A tag or category: use Tag in its category color. |
| Brown for a status: brown is only a category and reference color | Brown is never a status: it is a category and reference color only. |
| variant="solid": every pill is soft (the prop is accepted and ignored) | Every pill is soft: `variant="solid"` is accepted and ignored ([Development](#development)). |

**Behavior**: Mouse, Keyboard and Focus ("None", "None", "Not focusable") become one row: "Not interactive or
focusable: it is text." Loading ("Not applicable") and Motion ("None of its own") go. Error stays as guidance: "Show a
failed status with the negative variant."

**Accessibility**: the "Every control" row goes (nothing in a badge is interactive). The rest stays, including the
contrast figures and "the text must carry the meaning".

**Content guidance**: "Action copy: Not applicable: use Chip for something clickable" is already in Usage, so it goes.
"Error messages: say what failed ("Failed") and explain it nearby" stays (it is guidance).

**Requirement check**

| Requirement in the original | In the proposal |
| --- | --- |
| Pill rule (100 / 300 / 700, 800 for red, 4px), source owner 2026-10-14 | Pill rule section; source in Details |
| Status vs category systems | Overview |
| Six variants, named | Usage |
| Color meanings (yellow, orange, red) and Draft is neutral | Usage |
| Clickable: Chip; category: Tag; brown never a status | Usage |
| `variant="solid"` ignored | Usage (one line), Development |
| Not interactive, not focusable | Behavior |
| Failed status: negative variant; explain failures nearby | Behavior, Content guidance |
| No wrapping; keep text short; translations need room | Behavior (unchanged), Content guidance (unchanged) |

### DataGrid

**Overview and Purpose**

| Now | Proposed |
| --- | --- |
| Records people work with, by column: sort, filter, select, open, edit, group or nest them. A React grid on TanStack Table in the Plenix table style. | The dynamic table: people sort, filter, group, search, select, open, edit or nest the records in it. |
| Shows records as rows to compare by column: to sort, filter, select, open, edit, group or nest them. An interactive table in Plenix is a DataGrid: a React grid on TanStack Table and TanStack Virtual (bundled) in the Plenix table style, drawn only with tokens; a static table (facts, props, documentation) is a Table, the same look with nothing to operate. Never a `<table>` element or another grid library. | Lets people compare records by column and work with them. A static table is a Table, which looks the same with nothing to operate. |

"A React grid on TanStack Table and TanStack Virtual (bundled), drawn only with tokens" moves to Development.

**Usage**

| Now | Proposed |
| --- | --- |
| Any set of records shown as rows and columns: lists to compare, sort, filter, select, open, edit, group or nest | Records people work with: compare, sort, filter, group, search, select, open, edit or nest them. |
| Reference tables in documentation and settings (the first column names each row) | (moves to When not to use, corrected: "Static facts, in documentation or settings: use Table.") |
| A few facts about one record: use Property list | A few facts about one record: use Property list. |
| A layout of cards or pictures: use Content grid | Cards or pictures: use Content grid. |
| Never a `<table>` element or another grid library: an interactive table is a DataGrid, a static one a Table | Never hand-build a table (a `<table>` element or another grid library): a dynamic table is a DataGrid, a static one a Table. |

**Behavior** (sample row): "Right-click a header for the column menu too (the application's field actions, sort,
filter, group, width and position, hide and show); right-click a row for its row menu." becomes "Right-click a header
for its column menu (field actions, sort, filter, group, width and position, hide and show), or a row for its row menu."
The list stays: it tells people what the menu offers.

**Requirement check**

| Requirement in the original | In the proposal |
| --- | --- |
| What people do with it: sort, filter, select, open, edit, group, nest | Overview, Usage (search added, per the owner's rule) |
| Interactive table = DataGrid; static = Table, same look | Purpose; Usage |
| React grid on TanStack Table and Virtual, bundled, tokens only | Development (moved) |
| Never a `<table>` element or another grid library | Usage, qualified as hand-built tables in applications |
| Property list for a few facts; Content grid for cards | Usage |
| Reference tables in documentation and settings | Corrected: Table (it contradicted the rule) |
| Column menu contents on right-click; row menu | Behavior |

## What I need from you

1. Approve the revised rules and the three samples as the model.
2. Then: Actions first, one section at a time, each page with its requirement check.

## Not part of this

- The tables the spec builds from the code (classes, tokens, states): after the styling work is finished.
- Guidance for components not built yet (about 84,000 words): same rules, later.
- **CDN documentation** (raised in the review): a working installation example, pinned version URLs, the CSS, fonts and
  icons to load, script order and a minimal component example, linked from each component page. A separate piece of
  work; it does not depend on this cleanup.
