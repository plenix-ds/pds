# DataGrid and Table in an application: what the CDN does, what the app does

Written for CTM's grid report (2026-10-22), checked on Plenix 0.63.1 and fixed in 0.64.0.

## What the CDN does (0.64.0)

| Behavior | How it works |
|---|---|
| Column widths | A column without `width` fits its header and its values, up to 360px (`--plx-comp-data-grid-auto-max-width`); longer text ends in "…" with the full text on hover. The last such column takes the room left, so the grid fills its width. |
| Headers | A content-sized column leaves room for its type icon and, in a DataGrid, for the column menu button, so a hovered title is never cut. The menu button and the sort arrow have a gap between them. |
| Pills (`cells="pill"`) | A column measures each pill with its padding, border and icon, so names are not cut. |
| Type icons ("Tt") | On in a DataGrid (they show what the column sorts and filters as); off in the static Table. `typeIcons={false}` hides them in a DataGrid. |
| One line per cell | Values stay on one line; a long one ends in "…". Only `kind: 'wrap'` or taller rows wrap. |
| Scrolling | When the columns need more room than the grid has, the grid scrolls inside itself; it never makes the page scroll. |

## What the application does

| Situation | Do this |
|---|---|
| A grid in a flex row | Give the grid's flex item `min-width: 0`, or use Plenix's `<Inline>` with a `grow` child (it sets that). A flex item keeps its content's width by default, so a grid that can become a narrow list (it asks for 720px) pushes the row wider and the page scrolls. |
| A date or a time that should stay short | Format it in the data ("10:00 AM"); a cell shows the text it gets on one line. Do not use `kind: 'wrap'` for it. |
| The same look in every view | Use one column definition per kind of value (case number `kind: 'data'`, people `type: 'person'` with `cells="pill"`, dates `type: 'date'`), so every grid sizes and draws them alike. |
| No type icons | `typeIcons={false}` on a DataGrid; a static `Table` has none. |
| Avoid local styles | Do not override `.plx-data-grid` or `.plx-table` rules: widths, wrapping and hover come from the component. |

## The page shape: a grid that fills its room and scrolls inside (issue 522, the canonical pattern)

The owner's rule: every DataGrid fills the room left below the page's headers and toolbars and shows its rows by scrolling inside itself, with no page controls. Pagination is used only when it is explicitly asked for.

### What the CDN does

| Behavior | How it works |
|---|---|
| Fill (the default) | `mode` is `"fill"` unless the app says otherwise. The grid measures the room from its top to the bottom of the window, or of its pane inside a SplitView, and scrolls inside that room. Only the rows in view are drawn (virtual rows), so 10 rows and 100,000 rows cost the same. |
| Headers | The header row stays in place while the rows scroll. Horizontal scrolling moves the headers with the columns; frozen columns stay. |
| Density and selection | Grids start compact (36px rows). Selection is kept by record key while rows scroll out of view and back. |
| A bounded container | `height="100%"` fills a container whose height is set (a Panel, a Card, a flex region), instead of measuring to the window. |
| Pagination (opt-in) | `mode="pages"` (with `pageSize`, `pageSizes`) draws a Pagination footer; `mode="load-more"` adds a Load more button. Use them only when the owner or the product asks for pages. |
| Printing | A fill grid prints every row (the scroll room is released for print). |

### What the application does

| Need | Do this |
|---|---|
| A full-page list | **Start from `ListingPage`** (a template: a title, a toolbar, a grid that fills the rest and scrolls inside, and the chosen record's detail in a SidePanel beside it; no page controls). By hand: the page's content is `<PageContent>` inside `<div className="plx-page-panes">`. Inside it, a `<Stack gap="md">` holds, in order, the header (EntityHeader), the CommandBar, and the DataGrid with **no** `height` and no `mode`. The grid measures the room left below the bar. The Files application (`files/files.jsx`) is the reference. |
| A list and its detail side by side | Put the detail in a `<SidePanel>` beside `<PageContent>`, inside the same `PagePanes` (Files), or put the grid in `SplitView`'s `first` and the detail in `second` (SplitView tells the grid it is in a pane, so it fills the pane). The grid and the detail scroll on their own. Keep the open record in the address (`screen.open([...])`) and pass it as `selected`, so selection stays when the detail opens or the list re-sorts. |
| A grid inside a bounded box | Give the box a height (a size token, or the rest of a flex column: `PagePanes`, or a `<Stack grow>` inside a `<Stack>`, which fill the rest of their parent and may shrink below their content) and the grid `height="100%"`. Every parent between the page and the grid must be a flex column with `min-block-size: 0`, or the grid grows with its rows and the page scrolls instead. |
| Several grids on one page | Each fill grid measures to the window, so the first one takes the room. Give each a height token (`height="--plx-ref-size-80u"`), or put each in its own section or tab. |
| Content under the grid | Keep the area below a fill grid empty (a footer belongs to the shell). If something must sit under it, use a bounded box and `height="100%"`. |
| Page controls | Only when asked: `mode="pages"`. Do not slice the data into pages in the app and feed the grid 20 rows at a time; give it all the rows (or `fetchRows`, below) and let it scroll. |
| Data from a server | `fetchRows({ page, size, sort, filters, search })` returns `{ rows, total }`. In the default fill mode (owner, #522) the grid asks for page 1, then for the next page by itself when the scroll comes within 8 rows of the end. While a page is on its way, a "Loading records" row sits at the end. A failed page shows a row with Retry, and the rows already shown stay. It stops at `total`. A sort, filter or search starts again from page 1. Give the rows a stable `index` so selection holds while pages arrive. `mode="pages"` and `mode="load-more"` (a Load more button) remain for when they are asked for. |

No application CSS is needed for any of these; the layout comes from `PagePanes`, `PageContent`, `Stack`, SplitView and SidePanel.

### Migrating a grid that paginates (CTM)

A grid that sets `mode: "pages"` with `pageSize` only because pages were the habit becomes one scrolling list: drop `mode: "pages", pageSize: 25` (CTM's council grid, `static/ctm/council.js`, is the one case), give the grid's container the bounded chain (a flex column with `min-block-size: 0` down to the grid's parent, the grid region `flex: 1 1 auto`) and `height="100%"`, or start from `ListingPage`, and pass all the rows, or `fetchRows` for a server (it loads the next rows as the person scrolls, with a loading row, an error row with Retry, and a stop at `total`). Keep `mode="pages"` only where the owner or the product asks for page controls.
