# Handoff 2026-10-15: command bar swap, floating scrollbar, NavPane padding

From the desktop session to the Windows VM session. The owner reviewed the command bar after 0.31.65–0.31.67 and changed the
standard. Read the whole file before building; save the decisions to memory (update `plenix-command-bar-study.md`).
Study pages (live, in `docs/command-bar-study/`, open `index.html` through a local server): **Swap** (the decided
one), Tidy bar, Fewer bars, Decided so far (now out of date).

## 1. Command bar: one bar that swaps on selection (Microsoft 365 style) — DECIDED

Owner: "after seeing the 3 bars, I don't like it" … "maybe the best solution is to do what other design systems such as
Carbon and Microsoft do, and do swap" … chose Microsoft 365 (OneDrive, SharePoint).

The rule:
- **One bar, one height, always.** No second bar, no second row, no selection bar under it. The table never moves when
  rows are selected.
- **Nothing selected:** the actions (New, Upload…), then search, Filter and the app's quick filters, then Sort, Group,
  View (Columns where the page has it) on the right.
- **Rows selected:** the actions, the search and the filters give way to the selection's commands (Download, Move,
  Share, Rename, Edit tags, …, Delete last). **Sort, Group and View stay where they are.**
- Clearing the selection brings the normal bar back.
- The fit rule is unchanged: icon and label; icons only with tooltips when it does not fit; then actions fold into More
  from the end, danger last; More only on real overflow. Sort, Filter, Group, Columns and View are never merged.
- Buttons stay ghost; the caret stays the thin chevron; the search stays 240px and collapses to its icon when narrow.

This **reverses** three earlier rules (record the reversal in memory, with the date):
- "The main bar never changes on a selection" (2A eliminated 2026-10-14) — now it swaps.
- "Selection actions always visible, grayed until they apply" (BulkActions 2B) — now they appear on selection. The
  "see all options, even grayed" rule still holds *within* a state (e.g. Rename grayed when 2 rows are selected).
- "Many actions get their own action bar" (the 1B shape) — gone; many actions fold into More in the one bar.

Reference drawing: `docs/command-bar-study/samples.jsx`, `Built` with `bars="ms"` (and `tidy="a"`: the search right
after the actions, a divider between).

**Open — ask the owner before building this part:**
- **The count.** Owner, 2026-10-15: "remove this from the menu bar; it can be on top of the data grid table, or on the
  bottom in small font outside the card." Which of the two? (The study's "The count" switch shows both; the text is
  "24 assets · 2 selected".)
- **How a selection is cleared, and where "N selected" shows while selecting.** Microsoft puts "× 2 selected" at the end
  of the bar (it is the way out of the selection). That conflicts with "the count out of the bar". Options: (a) keep
  "× N selected" in the bar during a selection only; (b) the count stays outside, and the bar ends with a "Clear
  selection" button (close icon). The owner quoted the swap and the "Sort, Group and View stay" lines but not the
  "× 2 selected" line, so do not assume (a).

Work:
- `platform/patterns/CommandBar/`: a selection state (`selection={{ count, actions, onClear }}` or similar) that swaps
  the action/find groups for the selection's commands; Sort/Group/Columns/View stay mounted (their open panel state
  must survive the swap). `barFit.js` re-measures on the swap.
- `BulkActions`: no longer a bar under the command bar. Keep the component for pages without a command bar only if the
  owner wants it; otherwise its record says "use CommandBar's selection state". Ask.
- Undo in the apps: 0.31.67 put the Asset Manager home and Files on the 3-bar layout with the count in the bar — move
  them to the swap bar, count out of the bar. **Pause any further adoption until this lands.**
- Design-system records and docs: `command-bar` (w07K) rules and examples, BulkActions record/docs, the inventory leaf
  "Data-table workflow"; keyboard: focus stays on the table when the bar swaps; announce the swap ("2 selected,
  selection actions available") through the live region.
- Tests: keyboard (the swap; Escape or Clear returns the normal bar), data-table, pages, labs, visual baselines.

## 2. DataTable scrollbar: floating — DECIDED

Cause: the legacy grid writes `margin-right: 10px` (the scrollbar's width) inline on `div.legacy-grid-headers` so the header
lines up with the body above a classic scrollbar. The style audit flags it ("10px is off the grid") on every table.
Owner: "for the scroll bar, solution is floating".

- Make the table body's scrollbar an overlay (floating) scrollbar that takes no layout width, matching the Platform's
  hover-only scrollbars (memory `plenix-consistent-chrome.md`). Then the header needs no compensation.
- Stop the legacy grid's header margin: no inline style may remain (check `data-table.css` and the engine options; if
  the legacy grid still writes `margin-right: 0px`, either is fine for the audit as 0 is on the grid, but prefer none).
- Check: the style audit shows no `legacy-grid-headers` errors on any page; column lines stay aligned between header and
  body with and without vertical overflow; Windows Chrome and macOS.

## 3. NavPane: padding smaller than it should be — ASK BEFORE FIXING

Owner: "the padding in the menu on the left is not consistent… it's smaller than it should be".
Measured on the study page (1440 wide, NavPane 320px):

| Where | Now |
|---|---|
| Pane edge → pane title / items (header and body `padding-inline`) | 8px; item text at 16px from the edge |
| AppHeader content inset | 12px |
| Page content (`plx-page-content`) | 24px inline, 16px block |
| Status bar | 24px inline |
| Static group heading (`plx-nav-list__heading`, "COMMAND BAR") | 25px tall: 4px block padding, 8px inline (25 is off the 4px grid) |
| Collapsible group heading ("KEPT VARIANTS", "REFERENCE") | 32px tall, 0 block padding |
| Space after a static heading | 0 (items start right under it) |
| Space after a collapsible heading | 8px (body padding-block-start), 12px at the end |
| Between groups | 12px |

So: the pane's edge inset (8px) is smaller than the header's (12px) and the page's (24px), and static and collapsible
group headings differ in height (25 vs 32) and in the space under them (0 vs 8).

Options to show the owner (do not build until chosen):
- A. Pane inset 12px (matches the AppHeader), item text then at 20px.
- B. Pane inset 16px, item text at 24px (matches the page content's 24px).
- And in both: one group-heading geometry — static headings 32px like the collapsible ones (or both 28px), the same
  space under every heading (8px), the same gap between groups.
Tokens: `nav-pane-header-padding-inline`, `nav-pane-body-padding-inline`, `nav-list-heading-padding-block`,
`nav-list-heading-padding-inline`, `collapsible-section-body-padding-block-*`, `nav-pane-body-row-gap`
(`platform/tokens/components/*.tokens.json`). This NavPane is shared by every app, so check all apps' panes after.

## Order

1. Ask the owner the open items (the count's place; how a selection is cleared; BulkActions; NavPane A or B).
2. Floating scrollbar (decided; ship alone).
3. Command bar swap + app moves (one release; full changed-mode tests for keyboard, data-table, pages, labs, visual).
4. NavPane padding once chosen.
