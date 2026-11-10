# #1229 Dashboard chart cards: equal heights in a WidgetGrid row; "Show the data" opens a Dialog (G2)

- **Request:** the owner (via CTM3 - PM, 2026-11-10, LighthouseCollection/CTM#323). Brief: issue #1229 (PM).
- **Extends:**
  - `WidgetGrid` (`platform/patterns/WidgetGrid`), which places a dashboard's widgets.
  - `Panel` (`platform/components/Card`), the widget's card.
  - `ChartFrame` (`platform/charts/ChartFrame.tsx`), which every chart is drawn in, and its "Show the data" table.
  - `Dialog` and `Table`, used as they are.
- **Rules that apply:** no action links; an action is a Button (DESIGN §"Buttons", "No action links"). Fluent 2 buttons, ghost for low emphasis (D-0023).
- **Readings applied (D-0163, the owner may switch):**
  - **A. Both footers sit at the bottom.** In a stretched card, the Panel's own `footer` sits on the card's bottom edge, and so does the chart's "Show the data" button. So both line up across a row, whatever each chart's height. Reply **B** to pin only the Panel footer, with the button right under its chart.
  - **A. A collapsed Panel does not stretch.** It keeps its header height at the top of its cell, so a row of open cards is not padded by one closed card. Reply **B** to stretch collapsed panels too.

## 1. Equal heights in a WidgetGrid row

- **Every widget in a row is as tall as the tallest one in that row.** Rows size to their content (`grid-auto-rows: auto`, unchanged), and each row has its own height.
- **The card fills its cell:** a Panel (or Card) directly in a WidgetGrid cell is the cell's full height.
- **The Panel body grows:** it takes the extra height. The Panel's `footer` (its top border, padding and gap unchanged) therefore sits on the card's bottom edge.
- **A ChartFrame that is a widget's body grows with it.** The plot keeps its `size` height ("sm" 160, "md" 240, "lg" 320) and stays at the top, under the caption and the legend. The "Show the data" button sits at the bottom of the body (reading A).
- **The extra space goes between the chart and the button**, never inside the plot. A chart is never stretched or distorted.
- **Where the rule lives is G3's** (WidgetGrid, Panel, or a context custom property set by the grid cell; no descendant selector, styling standard 3.6). The look is the same in every case.
- **Unchanged:** the 4px grid gaps (`widget-grid-gap`, `-row-gap`), the corners, the drag handle, the drop ring and the reorder.
- **One column** (a narrow page, `columns="auto"` with room for one): each row holds one widget, so heights are natural.
- **A wide widget** (`span: "2"`) is in its row like any other and matches its height.

## 2. "Show the data": a button that opens a Dialog

- **The button:** `<Button variant="ghost" size="sm" icon="table_view">`, labeled with the existing `chartFrame.showData` ("Show the data", approved Arabic عرض البيانات).
  - It sits at the inline start, under the chart and its bottom legend.
  - It is a button, not a disclosure or a link. It has no chevron and no `aria-expanded`, and `aria-haspopup="dialog"`.
- **The Dialog:**
  - `<Dialog size="md" title={chart title}>`. The title is the chart's `title` as written (the brief).
  - The body is the existing `Table`, labeled by the existing `chartFrame.table` ("{title}: data"), with the same `columns`, `data` and `index` as today. It is mounted only while the Dialog is open.
  - No footer. It is read-only: the header's close button, Escape and the veil close it (Dialog's own `closeLabel`).
  - The body scrolls when the table is longer than the Dialog. Wide tables scroll inline inside the Table.
  - Focus moves into the Dialog (Dialog's rule: the first control in the body, else the close button) and returns to "Show the data" on close.
- **The inline table stays, as an opt-in.** The prop name and its values are G3's. The default is the Dialog; the opt-in keeps today's inline `Details` exactly as it is.
- **The caption stays:** the chart's own caption (title and description, or `hideCaption`) does not change.

## 3. State matrix

### The "Show the data" button (Button ghost, sm)

| State | Tokens |
|---|---|
| default | Button ghost: no fill, no border, `content-default` label, icon `currentColor` |
| hover | Button ghost hover: `state-hover` fill, the icon in the action colour |
| focus | `focus-ring-color`, 2px, 2px offset (Button) |
| active | `state-pressed`, `motion-press-scale` (Button) |
| disabled | n/a: it shows only when `table.data` is given, and then it always works |
| loading | n/a: the data is already in the chart's props |
| error | n/a: nothing to validate |
| selected | n/a: not a toggle; the Dialog shows that it is open |
| empty (`table.data` is `[]`) | the button shows. The Dialog shows the Table's own empty text |
| long text | the label is the catalog's, one line. The Dialog title wraps (Dialog's rule) |

### The card in a row (Panel in WidgetGrid)

| State | Tokens / behaviour |
|---|---|
| default | as today, at the row's height. The body grows; the footer is at the bottom |
| hover, focus, active, selected | n/a: the card is static (the drag handle and controls inside keep their own states) |
| dragging, drop target | unchanged (`widget-grid-item-dragging-opacity`, dashed drop ring) |
| collapsed | keeps its own height at the top of the cell (reading A) |
| disabled, loading, error | n/a in the card. A widget's own LoadingState or Notice fills its body, which grows like any body |
| empty | an empty body is still as tall as the row. The app's EmptyState sits at the body's top |
| long text | a wrapped title or description makes that card, and so the row, taller |

## 4. Densities, themes, Arabic

- **Densities:** the button and the Dialog follow the region density. The heights are layout only, with no new size.
- **Light and dark:** existing roles only (Button, Dialog, Table, Panel). No new pair.
- **Arabic:** no new string ("Show the data", "{title}: data" and Dialog's "Close" have approved Arabic). In RTL, the button is at the inline start (the right), and the Dialog mirrors as Dialog does.
- **Visual check:** light and dark at standard density. One specimen with a row of three cards of different chart heights (bar, pie, bar with a legend), each with a Panel footer, plus the Dialog open on a chart.

## 5. Edge cases

- **3x English:** a long chart title wraps in its card and makes the row taller. The other cards match it. The Dialog title wraps.
- **Empty values:** see the state matrix. A chart with no `table` shows no button, and its card still matches the row.
- **10,000 data rows** in a chart's table: the Table renders them only while the Dialog is open (mounted on open), and the Dialog body scrolls. A chart with that many points is out of scope for this request; DataGrid is the tool for it.
- **Rows of one widget** (narrow): natural heights, nothing stretched.
- **A widget being dragged:** its cell keeps the row height. The reorder does not change the rule.

## 6. Messages

- None new. The Dialog and the Table use their existing strings. The wording is unchanged (Technical Writer).

## 7. Choices the engineer must not invent

- The row stretch: the card fills its cell, the body grows, the footer and the chart's button sit at the bottom, and the plot keeps its size height. A collapsed Panel keeps its own height.
- Button `ghost`, `sm`, icon `table_view`, the existing `showData` label, inline start, `aria-haspopup="dialog"`.
- Dialog `md`, titled with the chart title, no footer, the Table mounted on open, and focus returning to the button.
- The Dialog is the default. The inline Details is the opt-in, unchanged.
- **Tests (test first):**
  - in a 3-column WidgetGrid with three Panels of different chart heights, the computed heights are equal, the Panel footers' bottom edges are equal, and the "Show the data" buttons' bottom edges are equal;
  - the plot's height is the `size` height (not stretched);
  - a collapsed Panel's height is its header's;
  - a click on "Show the data" opens a Dialog named the chart title, holding a Table named "{title}: data" with the chart's rows;
  - Escape closes it and focus returns to the button;
  - the opt-in still draws the inline Details;
  - LTR and RTL, light and dark.
