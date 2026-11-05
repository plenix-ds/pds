# Leaves without a record: recount and classification (#166)

Recounted 2026-11-05 on main with the same loader as `node check-spec.js` (taxonomy leaves minus the leaves a record claims). The older figure of 486 in `tools/agent/library/plan.json` is out of date.

## Count

| | Leaves | Records | Leaves without a record |
|---|---|---|---|
| All platforms | 1,181 | 698 | 483 |
| Web | | | 174 |
| iOS | | | 158 |
| Android | | | 145 |

- Mobile is parked (D-0013): the 303 iOS and Android leaves are not classified here.
- Method: a record claims one leaf (`sec`, `sub`, `leaf`). Every other taxonomy leaf has no record.

## Rule used to classify

- **Component:** a single part with its own variants and states.
- **Pattern:** a flow or arrangement of several parts.
- **Extension:** a domain feature outside the core library.
- **Foundation:** a rule, token set or guideline, not a part.
- **Template:** a whole page structure.
- **Variant of:** the leaf is a variant or name for a part that already has a record. It gets a `covers` entry on that page, not a record.

## Web leaves, by section

| Section | Leaf | Class | Note |
|---|---|---|---|
| Foundations | Dark mode, High-contrast theme, Brand themes, Product themes, Density modes, Materials | Foundation | Theme and density rules; most exist as tokens. |
| Foundations | Label styles, Caption styles, Display type, Tabular figures, Text truncation, Icon sizes | Foundation | Type and icon scales. |
| Foundations | Focus, Pressed, Selected, Dragged, Disabled treatment | Foundation | State treatments; `interaction-states` covers them today. |
| Foundations | Visual hierarchy, Layout grid, Container behavior | Foundation | |
| Foundations | Voice and tone, Capitalization, Inclusive language, Terminology, Action labels, Writing messages, Empty-state and onboarding copy | Foundation | Content standard: `docs/content/messaging.md` (planned). |
| Foundations | Text alternatives | Foundation | Accessibility rule. |
| Layout | Box / container, Inline / row, Flex, Wrap, Section, Surface, Content container | Component | Layout primitives; Stack, Panel and Columns cover most. |
| Layout | Separator | Variant of | Divider. |
| Layout | Sidebar, Rail, Main content region, Secondary region, Fixed region, Footer region | Pattern | Regions of the application shell. |
| Layout | Three-column layout, Sidebar layout, Master-detail layout, Holy Grail layout, Resizable panes | Pattern | |
| Layout | Breakpoints, Reflow, Container queries, Adaptive density | Foundation | |
| Layout | Adaptive navigation | Pattern | |
| Content | Description list | Variant of | Property list. |
| Content | Standalone link, External link, Back link | Variant of | Link. |
| Content | Responsive image | Variant of | Image. |
| Content | Relative time, Date label | Variant of | Timestamp. |
| Actions | Secondary, Tertiary, Ghost, Destructive button | Variant of | Button variants. |
| Actions | Icon button, Loading button | Variant of | Button (icon-only, busy state). |
| Actions | Modal trigger | Variant of | Button opening a Dialog. |
| Actions | Share | Component | Share control. |
| Forms | Checkbox select, Radio select | Variant of | Checkbox and Radio group. |
| Forms | Media picker | Component | |
| Navigation | App bar, Top navigation, Navigation bar, Global menu | Variant of | Application header. |
| Navigation | Workspace switcher | Variant of | Product switcher. |
| Navigation | Sidebar navigation, Subnavigation, Settings navigation, Nested menu, Mega menu | Variant of | Side navigation and Navigation menu. |
| Navigation | Table of contents, Anchor links, In-page navigation, Scroll spy | Component | |
| Navigation | Previous / next navigation, Skip navigation, Load more / infinite scroll | Component | |
| Navigation | Mobile navigation drawer, Mobile menu, Mobile tab bar | Variant of | Side drawer and Tabs; mobile is parked. |
| Navigation | Global search, Search bar, Autocomplete search, Search results, Search history, Advanced search | Variant of | Search input, Search suggestions, Recent searches, Search result. |
| Navigation | Filter menu, Faceted filters, Advanced filters, Filter chip, Saved filters | Variant of | Filter panel, Chip, Quick filter. |
| Data display | Grouped table, Virtualized table | Variant of | Data grid. |
| Data display | Column chart, Stacked bar chart, Donut chart | Variant of | Bar chart, Pie chart. |
| Data display | Histogram | Component | |
| Feedback | Presence indicator | Variant of | Presence. |
| Feedback | Meter | Variant of | Gauge. |
| Feedback | Step progress | Variant of | Progress steps. |
| Feedback | Warning, Success, Offline, Degraded, Permission-denied, Not-found, Maintenance, Completion state | Pattern | Whole-region states built from Empty state and Banner. |
| Overlays | Destructive confirmation | Variant of | Confirmation dialog. |
| Overlays | Navigation drawer | Variant of | Side drawer. |
| Patterns | Edit flow, Multi-step form, Restore, Export workflow | Pattern | |
| Page structures | Header, Global navigation, Sidebar, Secondary panel, Page actions bar | Template | Parts of the shell page. |
| Page structures | Single-pane, Two-pane, Split, Full-screen workspace; Inspector layout; Data workspace | Template | |
| Page structures | Home, Search results, Detail, Create, Edit, Profile, Account, Authentication, Error page; Empty application state; Full-screen experience | Template | |
| Page structures | Admin, Dashboard, Data-management, Settings, Form, Search, Authentication template; Reference screen | Template | |
| Specialized | Collection, Audio player, Asset picker, Regenerate, Semantic search, Source reference | Extension | |
| Specialized | Product listing, Product detail, Cart, Checkout, Payment, Order confirmation, Order management, Subscription management, Returns | Extension | Commerce. |
| Interaction | Resize observer, Breakpoint utility | Foundation | Script utilities. |
| Implementation | Mobile web, Desktop, Native implementation | Foundation | Implementation guidance. |

## Totals for the web leaves (approximate, by row groups)

- **Variant of an existing part (no new record, add `covers`):** about 70 leaves.
- **Foundation:** about 45.
- **Pattern:** about 25.
- **Template:** 30.
- **Component:** about 15.
- **Extension:** about 15.

## Next waves

1. **Covers entries (variants):** one small PR per section; no new pages. Owner: Technical Writer.
2. **Foundations:** write them as short pages from tokens that exist (themes, density, type scale, state treatments). Owner: Design Director (DESIGN.md) with the Technical Writer.
3. **Templates (30):** one record each, after the shell pages are stable.
4. **Patterns, components, extensions:** schedule by owner request. Commerce stays an extension.
5. **Mobile:** unclassified until D-0013 is lifted.
