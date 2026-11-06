# Handoff 2026-10-15: decisions waiting on the owner

Six open decisions, each with its background, the options and a recommendation (listed first). Nothing here is built
until the owner chooses. Tracked in the plan of record:
[plenix-ds/plenix-platform#3](https://github.com/plenix-ds/plenix-platform/issues/3) (label `needs-owner`).

| # | Decision | Recommendation |
|---|---|---|
| 1 | NavPane inset | A: 12px |
| 2 | BulkActions | Retire |
| 3 | Splitter menu with touch | B: into the pane header |
| 4 | AppHeader nav collapse | By the header's own width |
| 5 | "Needs the owner" looks, waves 7–10 | One review page |
| 6 | RedSave #27, semver | MINOR for new or rewritten components, PATCH for fixes |

## 1. NavPane inset: 12px or 16px

The owner reported that the left menu's padding "is not consistent… it's smaller than it should be". Measured on the
command bar study page (1440px wide, NavPane 320px; source: `docs/handoff/2026-10-15-command-bar-swap.md` §3):

| Where | Now |
|---|---|
| Pane edge → pane title and items | 8px (item text at 16px from the edge) |
| AppHeader content inset | 12px |
| Page content (`plx-page-content`) | 24px inline, 16px block |
| Static group heading ("COMMAND BAR") | 25px tall (off the 4px grid), nothing under it |
| Collapsible group heading | 32px tall, 8px under it, 12px at the end |
| Between groups | 12px |

Options:

- **A. Pane inset 12px (recommended).** The pane lines up with the AppHeader: the logo and the menu items share one left
  edge. Item text at 20px.
- **B. Pane inset 16px.** Item text at 24px, the page content's inset.

Both options also give every group heading one geometry: the same height (32px, or 28px for both), 8px under every
heading, and the same gap between groups.

- Tokens: `nav-pane-header-padding-inline`, `nav-pane-body-padding-inline`, `nav-list-heading-padding-block`,
  `nav-list-heading-padding-inline`, `collapsible-section-body-padding-block-*`, `nav-pane-body-row-gap`.
- The NavPane is shared by every application: check every app's pane after the change.

**Why A:** one straight left edge from the header down through the menu is what the eye checks first.

## 2. BulkActions: keep or retire

BulkActions was the bar of selection actions under the command bar. Since 0.31.69 the command bar swaps to the
selection's commands when rows are selected (the owner's Microsoft 365 decision), so no page needs a second bar. The
only remaining use would be a page with a selectable list and no command bar.

- **A. Retire it (recommended).** Its record says "use CommandBar's selection state". A page with a selection gets a
  command bar.
- **B. Keep it** for pages without a command bar only.

**Why A:** one way to act on a selection, everywhere.

## 3. Splitter menu with touch

A pane's width can be changed without dragging, through a small size menu (Narrower, Wider, Reset size) on the
splitter. With a mouse it shows on hover. With touch there is no hover, so it must always show, and then it covers the
pane's content. This is one of the touch-target findings left from batch 376 (0.31.71).

- **B. Into the pane's header as an icon button (recommended).**
- A. Reserve a strip of space for it beside the pane.
- C. Put the sizes in the pane's existing menu (no extra button).

**Why B:** always visible and reachable by touch, covering nothing. With C the feature is hidden, and hard to find on
a phone or tablet. A costs space on every pane.

Note: wave 10 moved the splitter into the Resizable component (`platform/components/Resizable/`), which has the same size
menu. The choice applies to both.

## 4. AppHeader nav collapse

The AppHeader folds its navigation into a menu based on the screen's width, not the header's own width. When the header
is narrower than the screen (a split view, an embedded page), its items crowd together and their touch targets shrink.
This is the other touch-target finding left from batch 376.

- **A. Collapse by the header's own width (a container query) (recommended).**
- B. Keep the screen width.

**Why A:** it is closer to a fix than a design choice. It needs the owner's OK only because the header's behavior
changes in every application.

## 5. The "needs the owner" looks from waves 7–10

Each library lane builds only from existing roles and lists every visible choice it had to make. All of these are live
now. Anything the owner does not reject stays as built.

**Wave 7** (date and time pickers, pickers, columns, uploads, chart foundations, mobile navigation)
- Calendar: the looks of today, the chosen day and a range
- Stepper markers are square
- Vertical tabs: the open tab drawn as a navigation list's current row
- Country flags off by default
- Avatar upload has no circle (Avatar is a rounded square)
- No rule-of-thirds guide in the crop frame

**Wave 8** (chart parts, cards, virtual list, carousel, query builder, search results, resource list, timeline)
- Charts: dashed reference and threshold lines; the range shade in dark mode; label halos; hollow swatches for hidden
  series; the tooltip on the popover surface; the legend under the plot
- Cards: the avatar over a user card's cover; expandable cards closed by default
- Carousel: Pause as text (there is no pause icon); dots differ by color only; autoplay every 6 seconds
- Query builder: nested groups drawn with a rail
- Role icons; the timeline's line and markers; search matches in bold

**Wave 9** (charts)
- Waterfall colors
- Gauge: track, fill and threshold badges
- Chart interaction: the focus ring on a point, the brush fill, dimmed series
- Area chart opacities; radar and Sankey opacities
- Word cloud: the largest word at 20px
- Heat map: dashes in empty cells
- Diagram and network surfaces
- Bullet chart: range shades; the bar at 1/3 of the height
- Separators in the surface color
- ComparisonView's look
- Donut hole 60%; Sankey nodes 12px

**Wave 10** (drag and drop; record flows)
- Sortable list items: default surface, subtle 1px border, control radius, a data row's height
- Drop states: the insertion line and the drop target's dashed outline in the focus-ring color; a refusing target in
  the danger color (like invalid fields) with the not-allowed pointer and its own words
- The horizontal drag handle is the drag icon rotated 90° (the icon set has no horizontal grip)
- A picked-up handle takes the selected fill
- Resizable's size menu in the box's top-end corner, on hover or focus (always with touch)
- Drag and drop values: auto-scroll edge 48px, speed 1px/ms, keyboard steps 8px and 32px (Shift)
- "Scheduled" in the waiting (yellow) tone with the schedule icon; it is not one of the six approved statuses
- Status icons: Draft pencil, In review doc-search, Approved circle-check, Changes requested alert, Rejected close,
  Published visibility, Scheduled schedule
- The human-review notice uses the sparkle icon on the info tone
- Copy naming: "Copy of {name}", then "Copy of {name} (2)", versus the older guidance "{name} copy"

**Recommendation:** one review page in the design system that shows each item with its built look and three answers
(approve, reject, change), instead of reading them as text. The answers become the next fixes.

## 6. RedSave #27: semver

RedSave (`Redsave-v1/docs/plenix-issues.md` #27) found that SearchField was rewritten inside 0.31.x: it became
`SearchInput` with a collapsed mode. Its props stayed compatible, but a patch version gives no warning that a component
an application relies on was replaced. The cause is `tools/agent/release.sh`, which always bumps the patch number, so
whole library waves have shipped as 0.31.x patches.

**Recommendation:**
- New components, new patterns or a rewrite → MINOR (0.32.0, 0.33.0, …): each wave becomes a minor version.
- Fixes only → PATCH.
- Every rewrite is listed in the changelog under "Changed", with what an application must check.
- Removals keep the existing rule: deprecated first, removed no earlier than the next minor.
- `release.sh` takes the level as an argument (`minor` or `patch`).

Alternative: keep patch numbers and rely on the changelog alone. Not recommended: applications pinned to `~0.31` would
take rewrites without notice.

## After the owner decides

1. Record each decision in memory and in the plan of record (#3); remove the `needs-owner` items it settles.
2. Build in this order: 4 and 3 (touch fixes, small), 1 (NavPane, check every app), 2 (BulkActions record and docs),
   6 (release.sh and the changelog policy), 5 (the review page, then the fixes it produces).
3. Quick gates after each change; the browser tests once for the batch.
