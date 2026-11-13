# Plenix Fit and Overflow Standard: when content does not fit

How every Plenix part behaves when its content does not fit its space (owner, 2026-10-29; issues 502 and 276). It applies to the Platform, the suite's applications, the Asset Manager and the design-system site. "Must" and "never" are requirements. The overflow audit (`tools/check-overflow.js`, run by the owner) finds the places that break it.

## 1. Rules for every kind

- Find why content does not fit and what it is first. Then follow that kind's ladder in section 2, one step at a time.
- Never wrap or cut everything the same way.
- The order is always the same:
  - tighten first (drop what repeats, such as a label beside an icon);
  - then reflow (wrap or stack);
  - cut only last (fold into More, or end in an ellipsis).
- Every cut keeps a way to see the whole thing.
- Toolbars, menu bars and action bars skip the reflow step. They are always one row: a bar never wraps. The one exception is a DataToolbar: its end group (a count or a summary, text rather than actions) moves under its start group in a narrow row (D-0176).
- A step is set by the width of the space the content sits in (a container query), not by the window. A pane at 192px adapts the same way in any window.
- Where a step depends on how long the content is (four short labels or two long ones), it is measured, with the Platform's own tools: `useOverflow`, `useFold` and `useTruncated` (`platform/utils/overflow.ts`).
- Every step lands on the 4px grid. A heading on two lines uses a 16px line height; with 4px above and below, two lines are 40px and one line stays 32px.
- Every step uses tokens only: no new colors, no inline styles, no `!important`, corners 2 to 6px. New names live in the existing tiers (`--plx-ref-`, `--plx-sys-`, `--plx-comp-`).
- A container query writes its width in the query (CSS cannot read a token there). Each width is a 4px-grid value with a token of the same value beside it, as `field.css` (180px) and `entity-header.css` (640px) do.

## 2. The ladders

| Kind | Step 1 | Step 2 | Last step | What keeps it readable |
|---|---|---|---|---|
| Section and group headings, other text labels | Wrap to 2 balanced lines | Past 2 lines: an ellipsis at the end of line 2 | A single word longer than a line also ends in an ellipsis | The full text in a tooltip on hover and focus, only while it is cut |
| Menu bars and toolbars (icon and text) | Labels hide, icons stay (each keeps its accessible name and shows it in a tooltip) | The least-used actions move into one "More actions" button, which opens the Menu | Never a second row: one row at every width | CommandBar is the model; the generic Toolbar follows the same rule |
| Segmented and switch buttons | Options shrink to icons only (each with a name and a tooltip) | Still too wide: options stack, one per row, full width, with icon and label | Never cut | Options without icons skip step 1 |
| Combo boxes and selects (and the search, text and date fields in a bar) | In a bar or header the box sizes to its longest choice, between `--plx-sys-fit-field-min-width` (100px) and `--plx-sys-fit-field-max-width` (320px); with a `width` it is exactly that width | The bar folds its Buttons first; only when every Button is in More do its fields shrink, down to the minimum (a field with the large width too). The chosen text ends in an ellipsis | The open list is never cut; it may be wider than the box. Below the minimum the bar overflows: nothing shrinks a field past it | The full chosen text in a tooltip on hover and focus, only while it is cut (`useTruncated`): Select, TreeSelect, Combobox, DatePicker, TimePicker, and Input and SearchField in a bar |
| Label plus control (fields, settings rows) | The label beside the control while both fit | The label moves on top of its control | The label wraps; it is never cut | Section 4 |
| Badges and tags | One line, full text | A list of tags wraps to new rows, 8px apart | One tag wider than its space: its text ends in an ellipsis; the icon and the remove button stay | Status badges keep their icon and meaning; the full text in a tooltip |
| Table header cells | One line | Wrap to 2 lines (`wrapHeaders`, 16px lines) | An ellipsis on line 2 | The full header in a tooltip; the sort arrow and menu never hide; labels stay left-aligned |
| Breadcrumbs | The middle items collapse into one "…" button that opens a menu of them | The current page's name ends in an ellipsis | The first item and the current page always show | The full trail in the menu; the current page's full name in a tooltip |
| Buttons in a footer or an action bar | One row, aligned to the end | The secondary actions move into a "More actions" button, in priority order (`priority` low, normal, high; the last first within a priority; danger last of its priority); the primary action and Cancel (the button that folds last) stay | Under 400px windows only (the window, not the bar): the primary and Cancel stack full width, primary first, and every other action is in More, which sits on Cancel's row | Labels never hide (footer actions are words); a footer never wraps to a second row of mixed buttons; growing the window back shows every button again |

## 3. Toolbars and menu bars: which actions go into More

- The app gives each action a `priority`: `"high"`, `"normal"` or `"low"` (default `"normal"`).
- Actions move into More in this order:
  - low before normal, and normal before high;
  - within one priority, the last action first;
  - destructive actions (Delete) go last within their priority; in the menu they sit at the end, after a divider.
- An app that sets no priorities gets the default: the actions fold from the end of the bar (CommandBar's rule today).
- The page's primary action (`primary`) never folds and keeps its words longest.
- More is the existing Menu, opened by an icon-only ghost Button (`icon="more"`, label "More actions", with a tooltip).
- Inside the menu each action shows its icon and its full words, in the bar's order.
- The bar measures itself (`useOverflow`). It shows More only when something is folded, and starts again from step 1 whenever its width or its actions change.
- Keyboard: the bar stays one Tab stop. The arrow keys reach More, and the folded actions follow it in the focus order.

## 4. Stacking a label and its control

- Between a label and its own control: `--plx-sys-space-stack-xs` (4px).
- Before the next label: `--plx-sys-space-stack-lg` (16px).
- Between groups of fields: `--plx-sys-space-section` (24px).
- The stacked control fills the row up to its largest field width; the label wraps and is never cut.
- Stack when the container is too narrow for the label column plus the smallest field width, measured on the form's container (360px).

## 5. Accessibility

- When a label hides (an icon-only button), the button keeps it as its accessible name and shows it as a tooltip on hover and keyboard focus.
- Where an ellipsis remains, the full text shows in the Plenix Tooltip on hover and keyboard focus, never with a bare `title`, which keyboard and touch users cannot reach. On touch, a long press shows it.
- The tooltip shows only while the text is actually cut (`useTruncated`: one line cut across, or text cut after several lines).
- A tooltip that repeats the trigger's own name uses `describe={false}`, so a screen reader does not read it twice.
- A plain static heading is not focusable: a cut one shows its full text on hover only, and a screen reader reads the whole heading.

## 6. Right to left and zoom

- Every step uses logical sides (inline start and end, block start and end), never left and right.
- In right-to-left text the ellipsis sits at the start-side end of the cut line (the left end), wrapping starts from the right, and balanced wrapping works the same way.
- Icon-only buttons keep their reading order: the first action is at the start side in both directions.
- Tooltips use start and end placements, not left and right.
- A down chevron does not mirror; a breadcrumb separator does.
- At 200% zoom the page moves up the same ladders: a narrower container is a narrower container. Nothing is lost at any step.
- Focus order never changes when items fold: the folded actions follow More in the focus order, in the bar's order.

## 7. Shared values

- `--plx-sys-fit-lines` (2), `--plx-sys-fit-line-height` (16px) and `--plx-sys-fit-wrap-padding-block` (4px) are the values every wrapping heading or label shares (`platform/tokens/semantic/fit.tokens.json`). The CollapsibleSection and NavList heading tokens alias them.
- `--plx-sys-fit-footer-stack-width` (400px) is the footer stack width. A media query cannot read a token, so `action-bar.css` writes the value and the ActionBar reads the token (`useMedia`). The 360px label stack is written the same way when it is built.

## 8. What is built

- Built: section and navigation group headings (issue 502): `CollapsibleSection`, `NavList`, `useTruncated` for several lines, the Tooltip's `describe` option.
- Built: the Toolbar ladder, the ActionBar ladder and the footer row, with `Button.priority` (issue 477, stage 4): `Toolbar`, `ActionBar`, `foldOrder`, `useBarFit` with its own row (`:self`). Only a `Button` element with a text label folds; a Button inside another component (a wrapper like `<B/>`) does not.
- Built: field sizing in bars (issues 558 and 554): `--plx-sys-fit-field-min-width` and `--plx-sys-fit-field-max-width` (`fit.tokens.json`), the content-pattern field context in `layout-modes.css` (generated from `layout.json` by `build-standards.js`) and the `data-plx-fit-shrink` switch that Toolbar, ActionBar and CommandBar set once every Button has folded. The default sizing of Input, Select, SearchField, Combobox, TreeSelect, DatePicker and TimePicker reads the context; the large `width` of each shrinks in a bar too. A Toolbar also drops the words of a menu button with an icon (Delete ▾) at the icon-only step and folds an icon-only Button into More. Select, TreeSelect, Combobox, DatePicker and TimePicker (its list form), and Input and SearchField in a bar, end cut text in an ellipsis and show the full text in a tooltip on hover and focus while it is cut (`useTruncated`, which also measures an input's value; `useInBar` tells a field it sits in a bar). InputGroup, EntityPicker and FileInput are not changed: they are form fields, and in a bar's shrink state they would shrink without a minimum (none sits in a bar today).
- To build, in this order: CommandBar `priority`, segmented buttons (#276), label plus control, badges and tags, table header tooltips, breadcrumbs.
- The overflow audit (`tools/check-overflow.js`) lists what still breaks this standard on every spec page and in the 10 apps.
