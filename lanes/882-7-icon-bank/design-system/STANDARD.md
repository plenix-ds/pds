# Unified UI Inventory\
## Information Architecture, Taxonomy, and Documentation Standard

> The reference for the Plenix design system specification (platform/design-system/). Saved 2026-10-06 from the owner's
> document, unchanged. `node check-spec.js` (in Plenix/) checks the specification against it: the taxonomy (§2–§3) and
> the item page template (§7). Plenix decisions that refine it are listed at the end, under "Plenix decisions".

This document defines the canonical hierarchy for a complete UI design inventory. It consolidates components, primitives, patterns, layouts, workflows, templates, accessibility guidance, and implementation utilities from multiple design systems into one non-duplicative structure.

The inventory is organized by **user purpose** and **UI role**, not by the way a source design system documents its catalog. Atlassian, Material, Carbon, Fluent, Spectrum, Ant Design, Primer, PatternFly, Bootstrap, and others are treated as source libraries and mappings—not as the primary organizing structure. Design systems generally combine reusable components, visual styles/tokens, guidelines, and patterns, but their navigation models differ substantially; this taxonomy provides the shared layer above them. [atlassian](https://atlassian.design/design-system)

***

## 1. Purpose

### Objective

Create one comprehensive, navigable inventory that allows a designer, product manager, developer, or design-system owner to answer questions such as:

- What UI component should I use for this need?
- Does the system already support this interaction?
- What is the canonical name for this component?
- Which source systems contain an equivalent?
- Is this a primitive, component, pattern, page structure, or template?
- What are its accessibility and responsive requirements?
- Is this item active, experimental, legacy, or deprecated?
- What related components and patterns should be considered?

### Core principles

1. **One canonical home**\
   Every UI concept has one primary location in the hierarchy.

2. **Organize by purpose**\
   Components belong where users and teams expect to find them based on what they accomplish.

3. **Do not duplicate by vendor terminology**\
   Different names become aliases and source mappings, not separate inventory records.

4. **Separate composition levels**\
   Foundations, primitives, components, patterns, pages, and templates must remain distinguishable.

5. **Use relationships and metadata instead of duplication**\
   A component can be relevant to search, data grids, accessibility, and workflows without appearing in each branch.

6. **Keep the sidebar shallow and stable**\
   Use 14 primary sections for each platform. Above them, level 0 is the platform: Web, iOS or Android, a dropdown at
   the very top of the navigation pane that switches the pane to that platform's sections. iOS and Android use the
   same purposes as Web (11 is Page Structures & Templates) with the names each platform gives its controls; iOS follows
   the Apple Human Interface Guidelines' navigation instead (Getting started, Foundations, Patterns, Components, Inputs,
   Technologies). Detailed categorization belongs below those sections and in metadata.

7. **Treat accessibility and responsive behavior as requirements**\
   They are not optional variants; they are properties of every component and pattern.

8. **Preserve source-system provenance**\
   Each canonical item can map to one or more implementations from Atlassian, Material, Carbon, Fluent, Spectrum, Ant, Primer, PatternFly, and other systems.

***

## 2. Primary navigation

Use this exact top-level menu in the documentation sidebar.

```text
UI Inventory
│
├── 01. Foundations
├── 02. Layout & Composition
├── 03. Content & Identity
├── 04. Actions & Commands
├── 05. Forms & Data Entry
├── 06. Navigation & Discovery
├── 07. Data Display & Visualization
├── 08. Feedback & System State
├── 09. Overlays & Disclosure
├── 10. Patterns & Workflows
├── 11. Page Structures & Templates
├── 12. Specialized Experiences
├── 13. Interaction, Accessibility & Utilities
└── 14. Implementation & Governance

Android (level 0):
    01. Foundations
    02. Layout & Composition
    03. Content & Identity
    04. Actions & Commands
    05. Forms & Data Entry
    06. Navigation & Discovery
    07. Data Display & Visualization
    08. Feedback & System State
    09. Overlays & Disclosure
    10. Patterns & Workflows
    11. Page Structures & Templates
    12. Specialized Experiences
    13. Interaction, Accessibility & Utilities
    14. Implementation & Governance

iOS (level 0), the Web sections:
    01. Foundations
    02. Layout & Composition
    03. Content & Identity
    04. Actions & Commands
    05. Forms & Data Entry
    06. Navigation & Discovery
    07. Data Display & Visualization
    08. Feedback & System State
    09. Overlays & Disclosure
    10. Patterns & Workflows
    11. Page Structures & Templates
    12. Specialized Experiences
    13. Interaction, Accessibility & Utilities
    14. Implementation & Governance
```

### Primary-section intent

| Section | Question it answers | Includes | Excludes |
|---|---|---|---|
| Foundations | What visual and behavioral rules govern the system? | Tokens, color, typography, spacing, motion, themes | Finished UI components |
| Layout & Composition | How do I arrange interface regions and elements? | Grid, Stack, Flex, containers, split panes, responsive composition | Page templates, cards as content objects |
| Content & Identity | How do I present readable content, media, people, and metadata? | Text, images, avatars, profiles, timestamps, descriptions | Tables, charts, form controls |
| Actions & Commands | How does a person make something happen? | Buttons, menus, toolbars, command palettes | Form value selection and navigation |
| Forms & Data Entry | How does a person enter or edit structured information? | Inputs, selects, dates, uploads, form validation | Search results, filter workspaces |
| Navigation & Discovery | How does a person find information or move through the product? | Navigation, tabs, breadcrumbs, search, filters, sort | Action menus and form select controls |
| Data Display & Visualization | How is structured information shown and interpreted? | Tables, lists, cards, metrics, charts, maps | System messages and transient feedback |
| Feedback & System State | What does the system need to communicate? | Alerts, toasts, statuses, progress, loading, empty states | Dialogs and popovers |
| Overlays & Disclosure | How is contextual or temporarily layered information revealed? | Dialogs, drawers, tooltips, popovers, accordions | Persistent navigation and page structure |
| Patterns & Workflows | How do components work together to complete a user task? | Create, edit, approve, onboarding, authentication | Individual components |
| Page Structures & Templates | What screen-level layouts are reusable? | App shells, dashboards, list pages, detail pages, templates | Low-level layout primitives |
| Specialized Experiences | What domain-specific UI families exist? | DAM, collaboration, communication, commerce, AI | General-purpose components |
| Interaction, Accessibility & Utilities | What cross-cutting mechanics and requirements govern behavior? | Focus, keyboard behavior, portals, positioning, virtualization | General visual components |
| Implementation & Governance | How is the system built, maintained, and adopted? | Platforms, frameworks, testing, migration, contribution | UI patterns and visual guidance |

***

## 3. Canonical hierarchy

## 01. Foundations

Foundations are reusable design decisions and rules. They are not standalone application components.

```text
01. Foundations
│
├── Design tokens
│   ├── Primitive / global tokens
│   ├── Semantic tokens
│   ├── Component tokens
│   ├── State tokens
│   ├── Theme tokens
│   └── Responsive tokens
│
├── Brand
│   ├── Logos
│   ├── Wordmarks
│   ├── Brand marks
│   ├── Product marks
│   ├── Brand application
│   └── Illustrations
│
├── Color
│   ├── Color palette
│   ├── Neutral colors
│   ├── Brand colors
│   ├── Accent colors
│   ├── Semantic colors
│   ├── Surface colors
│   ├── Text colors
│   ├── Border colors
│   ├── Interactive colors
│   ├── Status colors
│   ├── Data visualization colors
│   ├── Dark mode
│   └── Contrast rules
│
├── Typography
│   ├── Typefaces
│   ├── Type scale
│   ├── Font size
│   ├── Font weight
│   ├── Line height
│   ├── Letter spacing
│   ├── Heading hierarchy
│   ├── Body styles
│   ├── Label styles
│   ├── Caption styles
│   ├── Code typography
│   ├── Text truncation
│   ├── Display type
│   └── Tabular figures
│
├── Spacing and sizing
│   ├── Spacing scale
│   ├── Component spacing
│   ├── Content spacing
│   ├── Section spacing
│   ├── Sizing scale
│   ├── Control heights
│   ├── Icon sizes
│   ├── Content widths
│   ├── Touch targets
│   ├── Density
│   └── Responsive sizing
│
├── Shape and surfaces
│   ├── Border width
│   ├── Border style
│   ├── Border color
│   ├── Radius scale
│   ├── Nested radius
│   ├── Shape treatment
│   ├── Elevation
│   ├── Shadows
│   ├── Surface fills
│   ├── Opacity
│   └── Materials
│
├── Iconography
│   ├── Icon system
│   ├── Icon inventory
│   ├── How to add an icon
│   ├── Icon sizes
│   ├── Icon alignment
│   ├── Product icons
│   ├── Status icons
│   ├── Icon accessibility
│   ├── Icon modules and delivery
│   ├── Pictograms
│   └── Icon tile
│
├── Motion
│   ├── Duration
│   ├── Easing
│   ├── Transitions
│   ├── Entrance motion
│   ├── Exit motion
│   ├── Expansion motion
│   ├── Loading motion
│   ├── Gesture motion
│   └── Reduced motion
│
├── Layers
│   ├── Z-index scale
│   ├── Stacking contexts
│   ├── Overlay hierarchy
│   └── Backdrop treatment
│
├── Responsive system
│   ├── Breakpoints
│   ├── Container behavior
│   ├── Fluid sizing
│   ├── Density modes
│   ├── Device behavior
│   ├── Adaptive patterns
│   └── Fit and overflow
│
├── Themes
│   ├── Light theme
│   ├── Dark theme
│   ├── High-contrast theme
│   ├── Brand themes
│   ├── Product themes
│   ├── Theme switching
│   ├── Theme zones
│   └── AI visual language
│
├── Principles
│   ├── Design principles
│   └── Visual hierarchy
│
├── Grid
│   ├── Layout grid
│   ├── Keylines
│   └── Aspect-ratio scale
│
├── Interaction states
│   ├── Hover treatment
│   ├── Focus treatment
│   ├── Pressed treatment
│   ├── Selected treatment
│   ├── Dragged treatment
│   └── Disabled treatment
│
├── Content design
│   ├── Voice and tone
│   ├── Style and grammar
│   ├── Capitalization
│   ├── Inclusive language
│   ├── Terminology
│   ├── Action labels
│   ├── Writing messages
│   ├── Empty-state and onboarding copy
│   └── Text alternatives
│
└── Data formatting
    ├── Numbers and units
    ├── Date and time formats
    ├── Currency and percentages
    └── Names, addresses and phone numbers
```

A scalable token model separates primitive values, semantic roles, and component-level assignments. For example, a primitive blue token can support a semantic “interactive primary” token, which in turn supports a button-specific token. [design.va](https://design.va.gov/foundation/design-tokens/)

***

## 02. Layout & Composition

This section is retained deliberately. It is the home for **how UI is arranged**, not for pages, cards, or finished workflow layouts.

**Composition rule (owner, 2026-10-16, GitHub #55): a screen is built from patterns, never from loose components.** The
source is `platform/standards/layout.json`; `docs/composition/` draws it, with a reference screen.

- **Decide what each region is, then build it from its pattern.** Collecting input: Form, in one or two columns.
  Narrowing a list: the CommandBar's find side. Acting on a list or its selection: the CommandBar. A list beside the
  chosen item: SplitView. Commands with no list: a Menu. One record: RecordPage (EntityHeader, then its sections).
  Settings: SettingsLayout with SettingsSection cards. An overview: WidgetGrid.
- **Every kind of page has its regions, in order.** Workspace: page header › command bar › collection. Dashboard:
  page header › widgets. Settings: settings cards. Form: page header › form. Detail: entity header › record sections.
  Master-detail: command bar › split. Editor: canvas.
- **Fields are layout-neutral.** An input, select, combobox, search field or picker takes its natural width; the pattern
  around it sizes it. In Form, Field, a fieldset, a settings row, a dialog, a drawer, a sheet, a side panel, a popover,
  an inline edit, a find panel or a wizard it fills its column. In the CommandBar, a toolbar, the data toolbar, the
  filter bar, an action bar or the app header it keeps its natural width. An Input's own `width` wins in both.
- **A field outside those patterns is an error** (`check-system.rules/composition.js`). Field's `hideLabel` keeps a
  label for screen readers where the purpose is plain from the place (a title field, a search box).

**Nesting rule (owner, batch 250): containers nest two deep, never three.** A container is any box that draws a frame around content (Panel, Card, a contained Tabs panel, CodeBlock, Notice, Fieldset, DropZone, Table, DataGrid, or anything else framed on three or more sides or by a shadow). One container inside another is fine; a third is never drawn: the pattern chooses the unframed presentation. `tests/pages.test.js` fails any page with three framed boxes nested; specimens on show in the design system (sample stages, split samples, wireframes) are exempt.

```text
02. Layout & Composition
│
├── Layout primitives
│   ├── Box / container
│   ├── Stack
│   ├── Inline / row
│   ├── Flex
│   ├── Grid
│   ├── Spacer
│   ├── Divider
│   ├── Separator
│   ├── Aspect ratio
│   ├── Bleed
│   ├── Inset
│   ├── Wrap
│   ├── Center
│   └── Scroll area
│
├── Regions
│   ├── Section
│   ├── Surface
│   ├── Panel
│   ├── Content container
│   ├── Sidebar
│   ├── Rail
│   ├── Main content region
│   ├── Secondary region
│   ├── Sticky region
│   ├── Fixed region
│   └── Footer region
│
├── Layout arrangements
│   ├── One-column layout
│   ├── Two-column layout
│   ├── Three-column layout
│   ├── Split pane
│   ├── Resizable panes
│   ├── Master-detail layout
│   ├── Sidebar layout
│   ├── Dashboard grid
│   ├── Masonry layout
│   ├── Holy Grail layout
│   └── Full-screen workspace
│
└── Responsive composition
    ├── Breakpoints
    ├── Reflow
    ├── Responsive grid
    ├── Hide / show
    ├── Reorder
    ├── Collapse
    ├── Adaptive navigation
    ├── Adaptive density
    └── Container queries
```

Atlassian’s inventory explicitly includes Box, Inline, Stack, Flex, Grid, and Bleed as primitives, while other systems document grids, spacers, panels, flex layouts, and responsive arrangements as compositional mechanisms. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/2168595006/298ab934-3c95-4137-bafb-367948b13f61/image.jpg)

***

## 03. Content & Identity

This section contains things primarily intended to be **read, viewed, recognized, or referenced**.

```text
03. Content & Identity
│
├── Text and reading
│   ├── Heading
│   ├── Body text
│   ├── Paragraph
│   ├── Label
│   ├── Caption
│   ├── Helper text
│   ├── Secondary text
│   ├── Truncated text
│   ├── Rich text
│   ├── Blockquote
│   ├── Ordered list
│   ├── Unordered list
│   ├── Description list
│   ├── Inline code
│   ├── Code block
│   └── Keyboard hint
│
├── Links
│   ├── Inline link
│   ├── Standalone link
│   ├── External link
│   ├── Back link
│   └── Skip link
│
├── Images and media
│   ├── Image
│   ├── Responsive image
│   ├── Thumbnail
│   ├── Figure
│   ├── Image gallery
│   ├── Illustration
│   ├── Video
│   ├── Audio
│   ├── QR code
│   ├── Barcode
│   └── Color swatch
│
├── Identity
│   ├── Avatar
│   ├── Avatar group
│   ├── User identity
│   ├── Profile summary
│   ├── Entity title
│   ├── User card
│   ├── Team
│   ├── Group
│   ├── Role
│   ├── Permission summary
│   ├── Presence
│   └── Online status
│
└── Metadata
    ├── Key-value pair
    ├── Property list
    ├── Description list
    ├── Attribute list
    ├── Timestamp
    ├── Relative time
    ├── Date label
    └── Version label
```

***

## 04. Actions & Commands

An item belongs here when its primary purpose is to **cause an action**.

```text
04. Actions & Commands
│
├── Buttons
│   ├── Primary button
│   ├── Secondary button
│   ├── Tertiary button
│   ├── Ghost button
│   ├── Destructive button
│   ├── Icon button
│   ├── Loading button
│   ├── Split button
│   ├── Floating action button
│   └── Button group
│
├── Action collections
│   ├── Action group
│   ├── Action list
│   ├── Action bar
│   ├── Toolbar
│   ├── Formatting toolbar
│   ├── Selection toolbar
│   ├── Bulk action bar
│   ├── Overflow action
│   └── Action panel
│
├── Menus and commands
│   ├── Action menu
│   ├── Dropdown menu
│   ├── Context menu
│   ├── Overflow menu
│   ├── Command menu
│   ├── Command palette
│   ├── Menu item
│   ├── Checkbox menu item
│   ├── Radio menu item
│   ├── Menu group
│   ├── Menu bar
│   └── Menu, menu bar and command bar: which one
│
├── Triggers
│   ├── Dialog trigger
│   ├── Modal trigger
│   ├── Drawer trigger
│   ├── Popover trigger
│   ├── Tooltip trigger
│   └── Disclosure trigger
│
└── Common actions
    ├── Copy
    ├── Download
    ├── Export
    ├── Import
    ├── Print
    ├── Share
    ├── Duplicate
    ├── Rename
    ├── Delete
    └── Back to top
```

A menu is classified according to its purpose. An action menu belongs here; a navigation menu belongs under Navigation; a value-selection menu belongs under Forms.

***

## 05. Forms & Data Entry

All controls used to capture, edit, validate, or submit user-supplied data belong here.

```text
05. Forms & Data Entry
│
├── Form foundations
│   ├── Form
│   ├── Form section
│   ├── Field
│   ├── Field group
│   ├── Fieldset
│   ├── Legend
│   ├── Label
│   ├── Help text
│   ├── Required indicator
│   ├── Validation message
│   ├── Error summary
│   ├── Input group
│   ├── Form actions
│   ├── Character counter
│   ├── Read-only field
│   └── Field style variants
│
├── Text input
│   ├── Text field
│   ├── Password field
│   ├── Email field
│   ├── URL field
│   ├── Telephone field
│   ├── Search input
│   ├── Text area
│   ├── Autogrowing text area
│   ├── Rich-text editor
│   ├── Code editor
│   ├── Inline editable text
│   └── PIN / OTP input
│
├── Choice input
│   ├── Checkbox
│   ├── Checkbox group
│   ├── Radio
│   ├── Radio group
│   ├── Switch
│   ├── Toggle
│   ├── Toggle button
│   ├── Toggle button group
│   ├── Segmented control
│   ├── Choice card
│   └── Rating
│
├── Select and lookup
│   ├── Select
│   ├── Native select
│   ├── Multi-select
│   ├── Combobox
│   ├── Autocomplete
│   ├── Suggest
│   ├── Searchable select
│   ├── Async select
│   ├── Creatable select
│   ├── Checkbox select
│   ├── Radio select
│   ├── Cascader
│   ├── Tree select
│   ├── People picker
│   ├── Entity picker
│   └── Country / locale select
│
├── Date, time, and color
│   ├── Calendar
│   ├── Date picker
│   ├── Date range picker
│   ├── Time picker
│   ├── Date-time picker
│   ├── Relative date input
│   ├── Time-zone selector
│   ├── Color picker
│   └── Swatch picker
│
├── Numeric and range input
│   ├── Number input
│   ├── Stepper
│   ├── Currency input
│   ├── Percentage input
│   ├── Quantity selector
│   ├── Slider
│   └── Range slider
│
└── File and media input
    ├── File input
    ├── File upload
    ├── Drop zone
    ├── Drag-and-drop upload
    ├── Image upload
    ├── Avatar upload
    ├── Attachment picker
    └── Media picker
```

Ant Design’s catalog illustrates the usefulness of this grouping: it places controls such as AutoComplete, Cascader, Checkbox, DatePicker, Form, Input, Radio, Rate, Select, Slider, Switch, TreeSelect, and Upload in its data-entry family. [ant](https://ant.design/)

***

## 06. Navigation & Discovery

This section answers: **Where am I, where can I go, and how do I find information?**

```text
06. Navigation & Discovery
│
├── Global navigation
│   ├── Application header
│   ├── App bar
│   ├── Top navigation
│   ├── Navigation bar
│   ├── Global menu
│   ├── Product switcher
│   ├── Workspace switcher
│   ├── Account menu
│   └── Global search
│
├── Local navigation
│   ├── Side navigation
│   ├── Sidebar navigation
│   ├── Navigation rail
│   ├── Section navigation
│   ├── Subnavigation
│   ├── Settings navigation
│   ├── Product navigation
│   └── Table of contents
│
├── Hierarchical navigation
│   ├── Breadcrumbs
│   ├── Navigation menu
│   ├── Nested menu
│   ├── Mega menu
│   ├── Tree view
│   ├── Drilldown navigation
│   ├── Miller columns
│   ├── Stepper
│   └── Previous / next navigation
│
├── Content navigation
│   ├── Tabs
│   ├── Vertical tabs
│   ├── Pagination
│   ├── Anchor links
│   ├── In-page navigation
│   ├── Scroll spy
│   ├── Skip navigation
│   └── Load more / infinite scroll
│
├── Mobile navigation
│   ├── Bottom navigation
│   ├── Mobile app bar
│   ├── Mobile navigation drawer
│   ├── Mobile menu
│   ├── Bottom-sheet navigation
│   └── Mobile tab bar
│
└── Search, filter, and discovery
    ├── Search bar
    ├── Search suggestions
    ├── Autocomplete search
    ├── Search results
    ├── Search result item
    ├── Search result groups
    ├── Recent searches
    ├── Search history
    ├── Saved searches
    ├── Advanced search
    ├── Search workspace
    ├── Filter bar
    ├── Filter panel
    ├── Filter menu
    ├── Faceted filters
    ├── Quick filters
    ├── Advanced filters
    ├── Filter chip
    ├── Saved filters
    ├── Sort control
    └── Query builder
```

***

## 07. Data Display & Visualization

Use this area for structured information, collections, analytical data, and data-driven displays.

```text
07. Data Display & Visualization
│
├── Labels and indicators
│   ├── Badge
│   ├── Tag
│   ├── Chip
│   ├── Data pill
│   ├── Lozenge
│   ├── Counter
│   ├── Status label
│   ├── Statistic
│   ├── Metric
│   └── KPI
│
├── Lists and collections
│   ├── List
│   ├── List item
│   ├── Grouped list
│   ├── Resource list
│   ├── Object list
│   ├── Interactive list
│   ├── Selectable list
│   ├── Virtualized list
│   ├── Feed
│   ├── Activity stream
│   └── Timeline
│
├── Cards and objects
│   ├── Card
│   ├── Content card
│   ├── Object card
│   ├── Media card
│   ├── Product card
│   ├── Profile card
│   ├── Metric card
│   ├── Feature card
│   ├── Selectable card
│   ├── Expandable card
│   └── Navigation card
│
├── Tables
│   ├── Table
│   ├── Data grid
│   ├── Compact table
│   ├── Responsive table
│   ├── Sortable table
│   ├── Filterable table
│   ├── Selectable table
│   ├── Expandable table
│   ├── Editable table
│   ├── Grouped table
│   ├── Tree table
│   ├── Virtualized table
│   ├── Property table
│   ├── Comparison table
│   └── Table editing (planned)
│
├── Charts
│   ├── Chart foundations
│   ├── Chart legend
│   ├── Chart tooltip
│   ├── Data label
│   ├── Axis
│   ├── Grid line
│   ├── Threshold
│   ├── Reference line
│   ├── Annotation
│   ├── Line chart
│   ├── Area chart
│   ├── Bar chart
│   ├── Column chart
│   ├── Stacked bar chart
│   ├── Pie chart
│   ├── Donut chart
│   ├── Scatter plot
│   ├── Bubble chart
│   ├── Heat map
│   ├── Histogram
│   ├── Box plot
│   ├── Bullet chart
│   ├── Gauge
│   ├── Funnel
│   ├── Waterfall
│   ├── Sankey diagram
│   ├── Radar chart
│   ├── Sparkline
│   ├── Chart accessibility
│   ├── Treemap
│   ├── Combo chart
│   ├── Lollipop chart
│   ├── Step chart
│   ├── Word cloud
│   ├── Gantt chart
│   ├── Choropleth map
│   └── Chart interaction
│
└── Specialized displays
    ├── Calendar view
    ├── Carousel
    ├── Map
    ├── Graph / network
    ├── Diagram
    ├── Timeline visualization
    └── Comparison view
```

Visualization should remain a major second-level family because systems such as PatternFly provide an extensive chart catalog, including area, bar, box plot, bullet, donut, line, pie, Sankey, scatter, sparkline, stacked charts, and thresholds. [patternfly](https://www.patternfly.org/)

***

## 08. Feedback & System State

This section holds UI that communicates state, progress, outcomes, errors, warnings, and recovery options.

```text
08. Feedback & System State
│
├── Messages
│   ├── Alert
│   ├── Banner
│   ├── Callout
│   ├── Inline message
│   ├── Section message
│   ├── Notification
│   ├── Toast
│   ├── Snackbar
│   ├── Flag
│   └── Notification center
│
├── Status
│   ├── Status icon
│   ├── Status dot
│   ├── Status badge
│   ├── Severity indicator
│   ├── Presence indicator
│   ├── Availability indicator
│   ├── Health indicator
│   └── Count badge
│
├── Loading and progress
│   ├── Spinner
│   ├── Skeleton
│   ├── Shimmer
│   ├── Loading bar
│   ├── Progress bar
│   ├── Circular progress
│   ├── Meter
│   ├── Progress tracker
│   ├── Step progress
│   ├── Indeterminate loading
│   └── Loading overlay
│
└── Empty, failure, and recovery
    ├── Empty state
    ├── Zero state
    ├── No-results state
    ├── Error state
    ├── Warning state
    ├── Success state
    ├── Offline state
    ├── Degraded state
    ├── Permission-denied state
    ├── Not-found state
    ├── Maintenance state
    ├── Retry pattern
    ├── Undo pattern
    ├── Completion state
    ├── Disabled state
    ├── Read-only state
    └── Unsaved changes
```

Normalize `Blankslate`, `Zero state`, `No data`, and `Empty state` beneath the canonical family **Empty state**. Normalize `Toast`, `Snackbar`, and temporary notification variants beneath **Toast** unless the system distinguishes them by behavior in a meaningful way.

***

## 09. Overlays & Disclosure

This category covers layered, contextual, temporary, or progressively revealed UI.

```text
09. Overlays & Disclosure
│
├── Dialogs
│   ├── Dialog
│   ├── Modal dialog
│   ├── Non-modal dialog
│   ├── Alert dialog
│   ├── Confirmation dialog
│   ├── Destructive confirmation
│   ├── Prompt dialog
│   ├── Form dialog
│   ├── Full-screen dialog
│   └── Wizard dialog
│
├── Drawers and sheets
│   ├── Side drawer
│   ├── Navigation drawer
│   ├── Inspector drawer
│   ├── Properties panel
│   ├── Bottom sheet
│   ├── Full-height sheet
│   ├── Responsive sheet
│   └── Help panel
│
├── Contextual overlays
│   ├── Popover
│   ├── Popup
│   ├── Inline dialog
│   ├── Hover card
│   ├── Preview overlay
│   ├── Tooltip
│   ├── Rich tooltip
│   ├── Keyboard shortcut tooltip
│   ├── Teaching bubble
│   └── Contextual help
│
├── Overlay surfaces
│   ├── Context menu
│   ├── Dropdown surface
│   ├── Lightbox
│   ├── Media lightbox
│   ├── Anchored overlay
│   └── Popconfirm
│
├── Disclosure
│   ├── Disclosure
│   ├── Accordion
│   ├── Collapsible
│   ├── Expand / collapse
│   ├── Details
│   ├── Show more / less
│   ├── Truncate / expand
│   ├── Progressive disclosure
│   └── Expandable section
│
└── Layer behavior
    ├── Backdrop / scrim
    ├── Focus trap
    ├── Focus restoration
    ├── Scroll lock
    ├── Portal
    ├── Floating positioning
    └── Overlay accessibility
```

Normalize equivalent vendor terminology as follows:

| Source term | Canonical term |
|---|---|
| Modal, modal window | Dialog or Modal dialog |
| Confirmation modal | Confirmation dialog |
| Offcanvas, side panel, side sheet | Drawer / sheet |
| Flyout | Drawer, popover, or anchored overlay depending on behavior |
| Popup, popout | Popover when contextually anchored |
| Popconfirm | Confirmation popover |
| Scrim, blanket | Backdrop |
| Expansion panel | Accordion or disclosure |

***

## 10. Patterns & Workflows

Patterns are intentional combinations of components that help someone complete a task. They are not individual UI components.

```text
10. Patterns & Workflows
│
├── Selection and organization
│   ├── Single selection
│   ├── Multi-selection
│   ├── Bulk selection
│   ├── Select all
│   ├── Transfer list
│   ├── Dual listbox
│   ├── Grouping
│   ├── Reordering
│   ├── Drag and drop
│   ├── Sortable list
│   ├── Drop target
│   ├── Resize
│   └── Reposition
│
├── Creation and editing
│   ├── Create flow
│   ├── Edit flow
│   ├── Multi-step form
│   ├── Wizard
│   ├── Inline editing
│   ├── Autosave
│   ├── Draft state
│   ├── Save as
│   ├── Duplicate
│   ├── Import
│   ├── Export
│   └── Delete flow
│
├── Review and approval
│   ├── Review flow
│   ├── Compare
│   ├── Approve
│   ├── Reject
│   ├── Assign
│   ├── Delegate
│   ├── Publish
│   ├── Unpublish
│   ├── Archive
│   └── Restore
│
├── Onboarding and education
│   ├── Onboarding
│   ├── Product tour
│   ├── Spotlight
│   ├── Coach mark
│   ├── Walkthrough
│   ├── Checklist
│   ├── Contextual education
│   └── Feature introduction
│
├── Authentication and permissions
│   ├── Sign in
│   ├── Sign up
│   ├── Password reset
│   ├── Multi-factor authentication
│   ├── Single sign-on
│   ├── Account recovery
│   ├── Permissions
│   ├── Roles
│   ├── Access request
│   ├── Account connection
│   └── Session timeout
│
├── Data-management workflows
│   ├── Data-table workflow
│   ├── Filter and sort workflow
│   ├── Saved view
│   ├── Bulk edit
│   ├── Import workflow
│   ├── Export workflow
│   ├── Search workflow
│   └── Data review workflow
│
└── Product lifecycle
    ├── Lifecycle journeys
    ├── Trial and upgrade
    └── Offboarding
```

***

## 11. Page Structures & Templates

This section captures reusable screen-level architecture. It is not a replacement for layout primitives.

```text
11. Page Structures & Templates
│
├── Application shell
│   ├── Header
│   ├── Global navigation
│   ├── Sidebar
│   ├── Main workspace
│   ├── Secondary panel
│   ├── Inspector region
│   ├── Footer
│   └── Status region
│
├── Workspace structures
│   ├── Single-pane workspace
│   ├── Two-pane workspace
│   ├── Three-pane workspace
│   ├── Master-detail workspace
│   ├── Inspector layout
│   ├── Data workspace
│   ├── Full-screen workspace
│   └── Split workspace
│
├── Page structures
│   ├── Dashboard
│   ├── Landing page
│   ├── Home page
│   ├── Listing page
│   ├── Search results page
│   ├── Detail page
│   ├── Object / record page
│   ├── Create page
│   ├── Edit page
│   ├── Settings page
│   ├── Profile page
│   ├── Account page
│   ├── Authentication page
│   ├── Error page
│   ├── Empty application state
│   ├── Full-screen experience
│   └── Page actions bar
│
└── Templates and reference experiences
    ├── Admin template
    ├── Dashboard template
    ├── Data-management template
    ├── Content-management template
    ├── DAM / asset-management template
    ├── Settings template
    ├── Form template
    ├── Search template
    ├── Authentication template
    └── Reference screen
```

***

## 12. Specialized Experiences

Use this area for domain-specific systems that depend on many shared components but should not dominate the generic component taxonomy.

```text
12. Specialized Experiences
│
├── Files, assets, and DAM
│   ├── File
│   ├── Folder
│   ├── Asset
│   ├── Collection
│   ├── File browser
│   ├── Folder browser
│   ├── Asset browser
│   ├── File list
│   ├── Asset grid
│   ├── Asset gallery
│   ├── Asset card
│   ├── File row
│   ├── Thumbnail
│   ├── Preview
│   ├── Media viewer
│   ├── Document viewer
│   ├── Image viewer
│   ├── Video player
│   ├── Audio player
│   ├── Upload manager
│   ├── Download manager
│   ├── File picker
│   ├── Asset picker
│   ├── Metadata editor
│   ├── Version history
│   ├── Version comparison
│   ├── Related assets
│   └── Renditions and derivatives
│
├── Collaboration and communication
│   ├── Comment
│   ├── Comment thread
│   ├── Reply
│   ├── Mention
│   ├── Annotation
│   ├── Conversation
│   ├── Chat
│   ├── Message
│   ├── Inbox
│   ├── Notification center
│   ├── Announcement
│   ├── Activity feed
│   ├── Audit history
│   ├── Sharing
│   ├── Presence
│   └── Approval workflow
│
├── Commerce
│   ├── Product discovery
│   ├── Product listing
│   ├── Product detail
│   ├── Product options
│   ├── Cart
│   ├── Checkout
│   ├── Payment
│   ├── Order confirmation
│   ├── Order management
│   ├── Subscription management
│   └── Returns
│
└── AI and intelligent UI
    ├── AI trigger
    ├── AI action
    ├── AI assistant
    ├── AI chat
    ├── Prompt input
    ├── Prompt suggestions
    ├── Prompt history
    ├── Streaming response
    ├── Thinking / processing state
    ├── AI citation
    ├── Source reference
    ├── Generated content
    ├── Suggested edit
    ├── Suggested action
    ├── Accept / reject suggestion
    ├── Regenerate
    ├── Refine
    ├── AI search
    ├── Semantic search
    ├── Recommendation
    ├── Confidence / uncertainty
    ├── Human review
    ├── AI label
    ├── AI explainability
    └── AI disclaimer
```

***

## 13. Interaction, Accessibility & Utilities

This area contains behavior that is cross-cutting, implementation-oriented, or essential for inclusive interaction.

```text
13. Interaction, Accessibility & Utilities
│
├── Interaction foundations
│   ├── Focus ring
│   ├── Focus order
│   ├── Focus trap
│   ├── Focus restoration
│   ├── Keyboard navigation
│   ├── Keyboard shortcuts
│   ├── Shortcut hints
│   ├── Pointer interaction
│   ├── Touch interaction
│   ├── Gesture interaction
│   ├── Pressable
│   ├── Focusable
│   ├── Selectable
│   └── Drag handle
│
├── Accessibility
│   ├── Accessible names
│   ├── Accessible descriptions
│   ├── Screen-reader behavior
│   ├── Live regions
│   ├── Visually hidden content
│   ├── Semantic HTML
│   ├── Keyboard support
│   ├── Focus visibility
│   ├── Color contrast
│   ├── Touch-target sizing
│   ├── Reduced motion
│   ├── High contrast
│   ├── RTL / bidirectional UI
│   ├── Accessible drag and drop
│   ├── WCAG guidance
│   ├── Use of color
│   ├── Captions and transcripts
│   ├── Accessibility testing
│   └── Internationalization
│
└── Behavioral utilities
    ├── Portal
    ├── Overlay manager
    ├── Focus lock
    ├── Click outside
    ├── Floating positioner
    ├── Scroll lock
    ├── Scroll restoration
    ├── Resize observer
    ├── Intersection observer
    ├── Responsive visibility
    ├── Breakpoint utility
    ├── Visually hidden
    ├── Truncate
    ├── Clamp
    ├── Clipboard
    ├── Hotkey
    ├── Virtualization
    ├── Drag-and-drop engine
    └── Collection view state
```

Accessibility guidance should be captured in this section and attached to every relevant component record. Modern systems such as Chakra and EUI position accessibility as a core framework quality, while Fluent publishes focus-order and contrast-related design resources. [eui.elastic](https://eui.elastic.co/)

***

## 14. Implementation & Governance

```text
14. Implementation & Governance
│
├── Platforms
│   ├── Platforms standard
│   ├── Web
│   ├── Mobile web
│   └── Desktop
│
├── Frameworks
│   ├── React
│   ├── Vue
│   ├── Angular
│   ├── Web components
│   ├── HTML / CSS
│   └── Native implementation
│
├── Engineering guidance
│   ├── CSS architecture
│   ├── CSS reset
│   ├── Styling API
│   ├── Component API
│   ├── Theming
│   ├── State management
│   ├── Composition patterns
│   ├── Performance
│   ├── Virtualization
│   ├── Testing
│   ├── Analytics instrumentation
│   ├── Migration
│   ├── Deprecation
│   ├── Lint tooling
│   ├── Design-system MCP tooling
│   └── Browser support policy
│
└── Governance
    ├── Contribution model
    ├── Design review
    ├── Code review
    ├── Component lifecycle
    ├── Versioning
    ├── Changelog
    ├── Adoption guidance
    ├── Figma libraries
    ├── Code libraries
    ├── Release process
    └── Design-system roadmap
```

***

## iOS (level 0)

iOS has the same 14 sections as the Web. Each holds the Apple Human Interface Guidelines pages
(https://developer.apple.com/design/human-interface-guidelines/) that belong to it, under the Web's subcategory names, or
Apple's group name where the Web has none. Every page keeps its HIG name and link. 14 Implementation & Governance holds
Plenix's own iOS pages.

```text
01. Foundations
│
├── Principles
│   ├── Design principles
│   ├── Designing for iOS
│   ├── Designing for iPadOS
│   └── Designing for iPhone Duo
│
├── Brand
│   └── Branding
│
├── Color
│   ├── Color
│   └── Dark Mode
│
├── Typography
│   └── Typography
│
├── Shape and surfaces
│   └── Materials
│
├── Iconography
│   ├── Icons
│   └── SF Symbols
│
├── Motion
│   └── Motion
│
└── Content design
    ├── Writing
    ├── Inclusion
    └── Right to left
```

```text
02. Layout & Composition
│
├── Layout primitives
│   ├── Layout
│   └── Spatial layout
│
└── Regions
    ├── Split views
    ├── Scroll views
    ├── Boxes
    └── Ornaments
```

```text
03. Content & Identity
│
├── Text and reading
│   ├── Labels
│   └── Text views
│
├── Images and media
│   ├── Images
│   ├── Image views
│   └── Web views
│
└── Identity
    └── App icons
```

```text
04. Actions & Commands
│
├── Buttons
│   ├── Buttons
│   ├── Pop-up buttons
│   └── Pull-down buttons
│
├── Action collections
│   ├── Toolbars
│   └── Activity views
│
├── Menus and commands
│   ├── Menus
│   ├── Context menus
│   ├── Edit menus
│   ├── Dock menus
│   ├── The menu bar
│   └── Home Screen quick actions
│
└── Common actions
    ├── Undo and redo
    └── Printing
```

```text
05. Forms & Data Entry
│
├── Form foundations
│   └── Entering data
│
├── Text input
│   ├── Text fields
│   ├── Token fields
│   ├── Digit entry views
│   └── Virtual keyboards
│
├── Choice input
│   ├── Toggles
│   └── Segmented controls
│
├── Select and lookup
│   ├── Pickers
│   └── Combo boxes
│
├── Date, time, and color
│   └── Color wells
│
├── Numeric and range input
│   ├── Sliders
│   └── Steppers
│
└── File and media input
    └── Image wells
```

```text
06. Navigation & Discovery
│
├── Global navigation
│   ├── Tab bars
│   └── Sidebars
│
├── Local navigation
│   └── Tab views
│
├── Hierarchical navigation
│   ├── Column views
│   └── Path controls
│
├── Content navigation
│   └── Page controls
│
└── Search, filter, and discovery
    ├── Search fields
    └── Searching
```

```text
07. Data Display & Visualization
│
├── Labels and indicators
│   ├── Gauges
│   ├── Rating indicators
│   └── Activity rings
│
├── Lists and collections
│   ├── Lists and tables
│   └── Collections
│
├── Cards and objects
│   └── Lockups
│
├── Tables
│   └── Outline views
│
└── Charts
    ├── Charts
    └── Charting data
```

```text
08. Feedback & System State
│
├── Messages
│   ├── Notifications
│   ├── Managing notifications
│   └── Feedback
│
├── Status
│   └── Status bars
│
└── Loading and progress
    ├── Progress indicators
    └── Loading
```

```text
09. Overlays & Disclosure
│
├── Dialogs
│   ├── Alerts
│   └── Action sheets
│
├── Drawers and sheets
│   ├── Sheets
│   └── Panels
│
├── Contextual overlays
│   └── Popovers
│
├── Disclosure
│   └── Disclosure controls
│
└── Layer behavior
    └── Modality
```

```text
10. Patterns & Workflows
│
├── Selection and organization
│   └── Drag and drop
│
├── Review and approval
│   └── Ratings and reviews
│
├── Onboarding and education
│   ├── Launching
│   ├── Onboarding
│   └── Offering help
│
├── Authentication and permissions
│   ├── Managing accounts
│   └── Privacy
│
└── Media
    ├── Playing audio
    ├── Playing video
    ├── Live-viewing apps
    └── Workouts
```

```text
11. Page Structures & Templates
│
├── Application shell
│   ├── Windows
│   ├── Multitasking
│   └── Going full screen
│
└── Page structures
    └── Settings
```

```text
12. Specialized Experiences
│
├── Files, assets, and DAM
│   ├── File management
│   ├── Photo editing
│   └── Live Photos
│
├── Collaboration and communication
│   ├── Collaboration and sharing
│   ├── SharePlay
│   └── iMessage apps and stickers
│
├── Commerce
│   ├── Apple Pay
│   ├── Apple In-App Purchase
│   ├── Tap to Pay on iPhone
│   └── Wallet
│
├── AI and intelligent UI
│   ├── Generative AI
│   ├── Machine learning
│   └── Siri
│
├── System experiences
│   ├── App Shortcuts
│   ├── Complications
│   ├── Controls
│   ├── Live Activities
│   ├── Snippets
│   ├── Top Shelf
│   ├── Watch faces
│   └── Widgets
│
└── Technologies
    ├── AirPlay
    ├── Always On
    ├── App Clips
    ├── Augmented reality
    ├── Immersive experiences
    ├── CareKit
    ├── CarPlay
    ├── Game Center
    ├── HealthKit
    ├── HomeKit
    ├── iCloud
    ├── ID Verifier
    ├── Mac Catalyst
    ├── Maps
    ├── NFC
    ├── ResearchKit
    ├── ShazamKit
    └── Sign in with Apple
```

```text
13. Interaction, Accessibility & Utilities
│
├── Interaction foundations
│   ├── Gestures
│   ├── Pointing devices
│   ├── Focus and selection
│   ├── Keyboards
│   └── Playing haptics
│
├── Inputs
│   ├── Action button
│   ├── Apple Pencil and Scribble
│   ├── Camera Control
│   ├── Digital Crown
│   ├── Eyes
│   ├── Game controls
│   ├── Gyroscope and accelerometer
│   ├── Nearby interactions
│   └── Remotes
│
└── Accessibility
    ├── Accessibility
    └── VoiceOver
```

```text
14. Implementation & Governance
│
├── Engineering guidance
│   ├── How to build
│   ├── Token mapping
│   └── Generated files
│
└── Governance
    ├── Sources and levels
    └── Conformance
```

***

## Android (level 0)

```text
01. Foundations
│
├── Overview & principles
│   ├── Overview
│   ├── Five layers
│   ├── Precedence
│   ├── Who owns each property
│   └── Requirements on every layer
│
├── Color & semantic roles
│   ├── Themes and color roles
│   ├── Contrast
│   ├── Color alone
│   └── Appearance
│
├── Typography
│   ├── Text roles
│   └── Font scale
│
├── Spacing & sizing
│   ├── Touch targets
│   └── Spacing between targets
│
├── Layout grids & alignment
│   └── Window classes
│
├── Icons & imagery
│   ├── Material Symbols
│   └── Images
│
├── Shape, borders & elevation
│   ├── Shape and radius
│   ├── Borders
│   └── Elevation
│
├── Motion & transitions
│   ├── Reduced motion
│   └── Transitions
│
└── Design tokens & platform mapping
    ├── Token mapping
    └── Tokens
```

```text
02. Layout & Composition
│
├── Layout containers
│   ├── Column, Row and Box
│   └── Lazy grids
│
├── Safe areas & system insets
│   └── Edge to edge and insets
│
├── Scrolling & content regions
│   ├── Scrolling containers
│   └── Reflow
│
├── Adaptive & responsive layouts
│   ├── Window classes
│   └── Orientation
│
└── Keyboard-aware layouts
    └── Keyboard
```

```text
03. Content & Identity
│
├── Text & headings
│   ├── Text roles
│   └── Headers
│
├── Images & media
│   ├── Images
│   └── Image loading
│
├── Avatars & identity
│   └── Avatar
│
├── Badges, labels & tags
│   ├── Badge
│   └── Label
│
└── Content & localization
    ├── Right to left
    └── Text expansion
```

```text
04. Actions & Commands
│
├── Buttons & icon buttons
│   ├── Button
│   └── Icon button
│
├── Floating & prominent actions
│   └── Floating action button
│
├── Toolbars & action groups
│   └── Top app bar actions
│
├── Menus & contextual actions
│   ├── Menu
│   └── Long-press menu
│
├── Swipe actions
│   └── Swipe to dismiss
│
└── Selection & bulk actions
    └── Multiple selection
```

```text
05. Forms & Data Entry
│
├── Text fields & text areas
│   ├── OutlinedTextField
│   └── Multi-line text field
│
├── Search fields
│   └── Search bar
│
├── Checkboxes, switches & selection controls
│   ├── Switch
│   ├── Checkbox
│   └── Radio group
│
├── Pickers & selection lists
│   └── Exposed dropdown menu
│
├── Date & time input
│   └── DatePicker and TimePicker
│
├── Sliders & steppers
│   └── Slider
│
├── Validation & input assistance
│   ├── Validation
│   └── Forms checks
│
└── Form layouts & keyboard behavior
    ├── Form screen
    └── Keyboard types
```

```text
06. Navigation & Discovery
│
├── Navigation bars & top app bars
│   └── Top app bar
│
├── Tab bars & navigation bars
│   └── NavigationBar
│
├── Navigation drawers & sidebars
│   └── Expanded navigation rail
│
├── Navigation rails
│   └── NavigationRail
│
├── Segmented navigation & tabs
│   └── Tabs and segmented buttons
│
├── Search & filtering
│   ├── Search and filters
│   └── Search screen
│
├── Back navigation & screen hierarchy
│   ├── Back stack
│   └── The eight structures
│
└── Deep links & entry points
    ├── Deep links
    └── State restoration
```

```text
07. Data Display & Visualization
│
├── Lists & list rows
│   ├── List
│   └── Tree
│
├── Cards
│   └── Card
│
├── Collections & grids
│   ├── Collection
│   ├── Feed
│   └── Carousel
│
├── Tables & structured data
│   └── Data grid
│
├── Key-value details & metrics
│   ├── Details
│   └── Metric
│
├── Charts & visualizations
│   └── Charts
│
└── Timelines & activity feeds
    └── Activity feed
```

```text
08. Feedback & System State
│
├── Loading & progress
│   └── Progress indicators
│
├── Empty states
│   └── Empty state
│
├── Error & success states
│   └── Error state
│
├── Banners & inline messages
│   └── Inline message
│
├── Toasts & snackbars
│   └── Snackbar
│
├── Refresh & synchronization
│   └── Pull to refresh
│
├── Offline & connectivity states
│   └── App state
│
└── Haptic & sound feedback
    └── Haptics
```

```text
09. Overlays & Disclosure
│
├── Alerts & dialogs
│   └── AlertDialog
│
├── Sheets & bottom sheets
│   └── ModalBottomSheet
│
├── Full-screen modals
│   └── Full-screen dialog
│
├── Tooltips & contextual help
│   ├── Tooltip
│   └── Consistent help
│
└── Expandable & collapsible content
    └── Expandable list
```

```text
10. Patterns & Workflows
│
├── Onboarding
│   ├── Onboarding
│   └── Launch screen
│
├── Sign-in & account access
│   └── Sign-in and account
│
├── Search, filter & sort
│   └── Search
│
├── Create, edit & submit
│   ├── Form
│   └── Unsaved changes
│
├── Selection & confirmation
│   └── Confirmation
│
├── Permissions & consent
│   └── Permissions
│
├── Multi-step flows
│   └── Step flow
│
└── Recovery & retry
    └── Error recovery
```

```text
11. Page Structures & Templates
│
├── App shell & root navigation
│   ├── App frames
│   └── Top-level navigation
│
├── Home & dashboard screens
│   └── Dashboard
│
├── List & detail screens
│   ├── List-detail
│   ├── Detail
│   └── Supporting pane
│
├── Search & results screens
│   └── Search screen
│
├── Form & editing screens
│   ├── Form screen
│   ├── Sheet task
│   └── Full-screen task
│
├── Profile & settings screens
│   └── Settings
│
└── Split-view & adaptive templates
    ├── List-detail scaffold
    ├── Paged
    ├── Full-screen viewer
    ├── Content with a persistent sheet
    └── Plenix page structures
```

```text
12. Specialized Experiences
│
├── Camera & media capture
│   └── Camera
│
├── Media playback
│   └── Media player
│
├── Maps & location
│   └── Maps
│
├── File selection & sharing
│   ├── File and photo pickers
│   └── Share
│
└── Notifications & external entry points
    ├── Notifications
    └── Deep links
```

```text
13. Interaction, Accessibility & Utilities
│
├── Touch targets & gestures
│   ├── Touch targets
│   └── Gestures
│
├── Focus & keyboard interaction
│   ├── Keyboard
│   └── Focus
│
├── Screen readers & semantics
│   └── TalkBack
│
├── Text scaling
│   └── Font scale
│
├── Contrast & reduced motion
│   ├── Contrast
│   └── Reduced motion
│
├── Interaction states
│   └── States
│
└── Accessibility testing & conformance
    └── Conformance
```

```text
14. Implementation & Governance
│
├── Getting started & how to build
│   └── How to build
│
├── Platform architecture & integration
│   ├── Implementations and controls
│   └── Behavior
│
├── Token mapping & generated files
│   ├── Token mapping
│   ├── Generated files
│   └── Build outputs
│
├── Sources, provenance & levels
│   ├── Source types
│   └── Levels
│
├── Releases & versioning
│   └── Versions
│
├── Contribution & maintenance
│   └── Contribution
│
└── Reference sources
    └── Sources
```

***

## 4. Classification standard

Every inventory item must be assigned one primary taxonomy path and a fixed set of metadata.

### Required fields

```text
Canonical name
Canonical ID
Primary category
Primary taxonomy path
Definition
Purpose
Component level
Interaction type
Scope
Aliases
Variants
States
Anatomy
When to use
When not to use
Accessibility requirements
Responsive behavior
Content guidance
Related items
Source-system mappings
Design assets
Code implementations
Lifecycle status
Owner
Last reviewed
```

### Component-level values

| Level | Definition | Examples |
|---|---|---|
| Foundation | A global visual or behavioral rule | Color, typography, spacing, motion |
| Token | A named design value | `color.text.default`, `space.200` |
| Primitive | A low-level compositional or behavioral building block | Box, Stack, Grid, Portal |
| Component | A reusable interface unit with a specific function | Button, Checkbox, Tooltip |
| Composite | A reusable arrangement of components | Toolbar, Page header, Filter bar |
| Pattern | A documented solution to a recurring user problem | Bulk selection, empty state, onboarding |
| Page structure | A reusable screen-level architecture | Dashboard, record page, settings page |
| Template | A reusable implementation or reference experience | Admin template, DAM template |
| Utility | An implementation behavior or helper | Scroll lock, focus trap, virtualization |

### Interaction-type values

```text
Static
Display
Action
Input
Selection
Navigation
Search
Filter
Feedback
Overlay
Disclosure
Drag and drop
Editing
Collaboration
AI
Utility
```

### Scope values

```text
Global
Shared
Product
Feature
Domain-specific
Experimental
Legacy
Deprecated
```

***

## 5. Canonical naming rules

### Naming principles

1. Use the most widely understood, behavior-based name.
2. Prefer singular nouns for components: `Button`, `Tooltip`, `Dialog`, `Avatar`.
3. Use families only when variants share anatomy and behavior: `Date picker`, `Data grid`, `Progress`.
4. Use an adjective only when it changes the component’s behavior or semantic role.
5. Do not create a new canonical item for visual-only differences.
6. Do not make a vendor-specific name canonical unless no broadly understandable equivalent exists.
7. Preserve vendor names as aliases and source mappings.

### Normalization dictionary

| Encountered term | Canonical inventory name | Notes |
|---|---|---|
| Modal, modal window | Dialog / Modal dialog | Use Modal dialog when blocking interaction with the page |
| Confirmation modal | Confirmation dialog | A dialog purpose variant |
| Offcanvas, side sheet, side panel | Drawer / sheet | Choose `Drawer` for side-sliding contextual panels |
| Flyout | Drawer or popover | Determined by placement and behavior |
| Popup, popout | Popover | Use Popup only when the product has distinct semantics |
| Popconfirm | Confirmation popover | Anchored confirmation interaction |
| Scrim, blanket | Backdrop | Overlay background layer |
| Alert message, inline alert | Alert / Inline message | Choose based on placement and persistence |
| Toast notification, snackbar | Toast | Keep Snackbar as an alias unless behavior differs |
| Flag | Toast / notification | Preserve as source-specific alias |
| Blankslate, zero state, no data | Empty state | Use child terms for scenarios |
| Loader, loading indicator | Loading family | Then classify as Spinner, Skeleton, Shimmer, or Progress |
| Spinner | Spinner | Indeterminate loading |
| Skeleton loader | Skeleton | Content-placeholder loading |
| Progress indicator | Progress | Then specify bar, circular, tracker, or meter |
| Chip, tag, label | Tag or Chip | `Chip` is often interactive/removable; `Tag` is typically categorical |
| Lozenge, pill | Tag / status label | Usually a visual variant, not a unique family |
| Icon-only button | Icon button | A button variant |
| Action button | Button | Preserve as an alias unless functionality differs |
| Navbar | Navigation bar | A global navigation pattern |
| Sidenav, vertical nav | Side navigation | A local navigation pattern |
| Navigation rail | Navigation rail | Keep as a distinct compact navigation pattern |
| Dropdown | Classify by intent | Menu, Select, or Popover; never use as a universal component family |
| Select menu | Select | Input control |
| Searchable select | Combobox | Input plus filtering/lookup |
| Typeahead | Autocomplete | Suggests completions while typing |
| Disclosure, collapse | Disclosure | Parent behavior family |
| Expansion panel | Accordion / disclosure | Depends on independent vs grouped expansion |
| Panel, box, surface | Surface / panel | Classify by visual containment role |
| Tile | Card / tile | Preserve Tile where it is visually/semantically distinct |
| Data list | List | Add subtype as needed |
| Resource list | Resource list | A list family used for meaningful objects |
| Data grid | Data grid | A table optimized for data interaction |
| Grid table | Data grid | More advanced interactions than standard tables |
| Command menu | Command palette | When used for app-wide command execution |
| Quick search palette | Command palette | Often combines command and search behavior |
| Advanced search page | Search workspace | A composite/page pattern |
| Properties sidebar | Inspector / properties panel | Usually a contextual side panel |

***

## 6. Placement rules

### Rule 1: Classify by primary purpose

Place an item where a user would most naturally look for it.

| Item | Primary home | Why |
|---|---|---|
| Button | Actions & Commands | Its purpose is to trigger an action |
| Text field | Forms & Data Entry | Its purpose is to accept typed input |
| Tabs | Navigation & Discovery | Their purpose is to move between peer content views |
| Table | Data Display & Visualization | Its purpose is to present structured data |
| Toast | Feedback & System State | Its purpose is to communicate a temporary outcome |
| Dialog | Overlays & Disclosure | Its purpose is to create a temporary layered interaction |
| Accordion | Overlays & Disclosure | Its purpose is progressive disclosure |
| Avatar | Content & Identity | Its purpose is to identify a person or entity |
| Stack | Layout & Composition | Its purpose is to arrange UI |
| Focus ring | Interaction, Accessibility & Utilities | Its purpose is focus affordance and accessible interaction |
| Page header | Page Structures & Templates | It is a composite screen-level pattern |
| Dashboard | Page Structures & Templates | It is a reusable page structure |
| Bulk selection | Patterns & Workflows | It spans checkboxes, toolbars, tables, and actions |

### Rule 2: Do not classify by implementation

A `React component`, `Vue component`, CSS utility, Figma asset, or web component is an implementation attribute—not its taxonomy location.

```text
Wrong:
React Components
└── Button

Correct:
Actions & Commands
└── Button
    └── Implementations
        ├── React
        ├── Vue
        ├── Angular
        └── Web Components
```

### Rule 3: Do not classify by source-system wording

```text
Wrong:
Atlassian
└── Flag

Carbon
└── Inline notification

Material
└── Snackbar
```

```text
Correct:
Feedback & System State
└── Messages
    └── Toast
        ├── Atlassian alias: Flag
        ├── Carbon alias: Inline notification
        ├── Material alias: Snackbar
        └── Source mappings
```

### Rule 4: Do not classify by visual styling alone

A rounded square avatar, circular avatar, color avatar, initials avatar, or photo avatar is a **variant** of Avatar—not a separate top-level item.

### Rule 5: Use patterns for multi-component solutions

`Search workspace`, `bulk edit`, `approval flow`, `onboarding`, and `checkout` are not single components. They belong in Patterns & Workflows or Specialized Experiences.

***

## 7. Documentation page template

Every Web item page follows this template: the sections in this order, with the fixed rows, columns and parts inside each. The template's data is `platform/design-system/page-template.js`; the spec orders and titles its sections from it, and `check-spec.js` checks this section and the spec against it. iOS and Android pages keep their own list until they get one shared template (issue #221).

- **Always** sections appear on every item page. When nothing is written, they show "Not written yet".
- **When it applies** sections appear only on the pages they apply to.

### Sections

| # | Section | Shown | What it holds |
|---|---|---|---|
| 1 | Overview and Purpose | Always | Rows: Overview · Purpose. Optional rows: Common ground · Sources · Used by |
| 2 | Usage | Always | When to use (list) · When not to use (list) |
| 3 | Variants | Always | Base, then each variant, each in the variant block below. Base holds what every variant shares; a variant shows only what it changes |
| 4 | Lab | When the item has a lab | Rows: Every variant in every state · The drawing and Edit |
| 5 | States | Interactive items | Table: State · Looks · Set by · Changes. States: Default · Hover · Focus · Active · Selected · Disabled · Read-only · Loading · Error · Success |
| 6 | Anatomy | Always | Rows: Parts (required, optional, slots) · Block · Elements · Variants (modifiers) · States (classes) · States (pseudo-classes, attributes). The class rows are read from the stylesheet |
| 7 | Behavior | Always | Rows: Mouse and touch · Keyboard · Focus · Responsive · Density · Motion · Loading · Error |
| 8 | Accessibility | Always | Rows: Semantic role · ARIA attributes · Accessible name · Screen-reader announcements · Focus management · Contrast · Reduced motion · Every control |
| 9 | Content guidance | Always | Rows: Labels · Action copy · Error messages · Localization |
| 10 | Specification | Foundations and items with rules of their own | The item's own rules, tables and values. Its own parts sit inside this section |
| 11 | Development and API | Components with a source file | From the header comment: Code usage · Props (Prop · Type · Default · Description) · Code behavior · Notes |
| 12 | Implementation | Always | Rows: React · HTML / CSS · Vue, Angular, Web components, native. Tabs: Use in code · JSX · CSS · Classes · Tokens |
| 13 | Platforms | Items with counterparts on iOS or Android | Parts: Counterparts on the other platforms · Functional equivalent · Platform specification · Apple iOS kit in Figma |
| 14 | Design assets | Always | Rows: Token references · Icon references · Template references |
| 15 | Related items | Always | The related items |
| 16 | Source-system mappings | Always | Table: Source system · Source component · Match type · Notes |
| 17 | Details and Lifecycle | Always | Rows: Canonical name · Canonical ID · Category · Aliases · Plenix · Component level · Interaction · Scope · Status · Owner · Last reviewed · Version. Optional row: Also answers |

### The variant block

A variant is a design of its own: each has its own Figma design, styles, attributes and behavior. Base and every variant use the same fields, in this order. Base lists what all variants share, and a variant lists only what it changes. Each variant page shows its block in full: Base plus its own changes.

| # | Field | What it holds |
|---|---|---|
| 1 | Figma design | The variant's own Figma node and its link; "Not in Figma yet" until it exists |
| 2 | Styles | Its modifier class and the tokens it sets (component tokens, by role) |
| 3 | Attributes | The props and values that select it, and the props it adds |
| 4 | States | The states it adds or changes (State · Looks · Set by · Changes) |
| 5 | Behavior | What it does differently: mouse and touch, keyboard, focus, responsive, density, motion |
| 6 | Accessibility | What changes for assistive technology, if anything |
| 7 | Example | The live drawing |

### Rules

- Section titles are exactly the titles above, on every page.
- A Name/Value table shows its rows in the order above; a table shows its columns in the order above.
- Themes in Figma is part of the Themes foundation page's Specification, not of every item.
- Last reviewed is the date the item's content last changed, from the repository history.

***

## 8. Source-mapping standard

Every source system is a reference library, not a parent category.

### Source systems to map

```text
Atlassian Design System
Nord Design System
Liferay Lexicon
PatternFly
Vercel Geist
Workday Canvas
Elastic EUI
HeroUI
JetBrains Ring UI
Bootstrap
Shopify Polaris
Once UI
Park UI
Frappe UI
Chakra UI
Ant Design
Material Design 3
NewsKit
Carbon Design System
Adobe Spectrum
GitHub Primer
Microsoft Fluent 2
Salesforce Lightning Design System
```

These systems position themselves differently: for example, Geist presents colors, typography, materials, layout, and React components; Canvas combines reusable UI elements with guidelines and resources; Carbon operates across foundations, components, patterns, and data visualization; Spectrum describes a shared language of foundations, tokens, components, and guidance. [carbondesignsystem](https://www.carbondesignsystem.com/)

### Mapping record format

```text
Canonical item: Combobox
Canonical path: 05. Forms & Data Entry → Select and lookup → Combobox

Source mapping:
- Atlassian
  - Source names: Async select, Creatable select, Popup select
  - Match type: Partial
  - Notes: Separate component variants map to one canonical family

- Nord
  - Source names: Combobox, Autocomplete
  - Match type: Direct
  - Notes: Direct conceptual match

- Ant Design
  - Source names: Select, AutoComplete
  - Match type: Partial
  - Notes: Use Select and AutoComplete mappings based on behavior

- EUI
  - Source names: Combo box
  - Match type: Direct
  - Notes: Direct conceptual match
```

### Match types

| Match type | Meaning |
|---|---|
| Direct | Same core purpose, anatomy, and behavior |
| Partial | Similar but missing or adding meaningful behavior |
| Variant | A specific variant of the canonical item |
| Composite | Maps to a multi-component pattern rather than a component |
| Primitive | Maps to a foundational/layout primitive |
| Legacy | Older implementation retained for reference |
| No equivalent | Source system has no meaningful counterpart |

***

## 9. Metadata and filtering

The hierarchy tells users **what kind of UI item it is**. Metadata tells them everything else.

### Required filters

```text
Component level
Purpose / interaction
Platform
Framework
Source system
Accessibility support
Responsive support
Theme support
Density support
Status
Lifecycle
Domain
Design availability
Code availability
```

### Recommended filter values

| Filter | Example values |
|---|---|
| Component level | Foundation, token, primitive, component, composite, pattern, page, template, utility |
| Purpose | Action, input, navigation, display, feedback, overlay, disclosure, search, selection |
| Platform | Web, mobile web, iOS, Android, desktop |
| Framework | React, Vue, Angular, Web Components, HTML/CSS |
| Accessibility | Keyboard-ready, screen-reader-ready, high-contrast-ready, reduced-motion-ready |
| Status | Proposed, experimental, active, legacy, deprecated |
| Domain | General, enterprise, commerce, DAM, collaboration, AI, editorial |
| Responsive support | Mobile-first, adaptive, desktop-only, responsive, container-query-ready |
| Density | Compact, standard, comfortable |

### Example record

```text
Name: Data grid
Canonical ID: data-display.tables.data-grid

Primary category:
07. Data Display & Visualization
→ Tables
→ Data grid

Component level:
Component

Purpose:
Data display, selection, sorting, filtering, bulk action

Scope:
Shared product

Aliases:
- Collection table
- Resource table
- Dynamic table

Related:
- Table
- Filter bar
- Pagination
- Bulk action bar
- Empty state
- Inline edit

Capabilities:
- Sortable
- Filterable
- Selectable
- Expandable
- Editable
- Virtualized
- Responsive
```

***

## 10. Governance rules

### Adding an item

Before adding a new inventory item:

1. Search existing canonical items and aliases.
2. Determine whether it is a new component, a variant, a composite, a pattern, or an implementation detail.
3. Confirm its primary user purpose.
4. Assign one canonical home.
5. Add aliases and source mappings.
6. Define accessibility and responsive requirements.
7. Link related items.
8. Assign lifecycle status and ownership.

### Avoid creating a new item when

- It only differs by color, radius, shadow, density, or branding.
- It is a familiar variant of an existing component.
- It is an implementation wrapper without distinct user-facing behavior.
- It is a source-system rename.
- It is an example layout that is not repeatable or reusable.
- It can be represented as a state, capability, or metadata tag.

### Create a new item when

- It solves a distinct user problem.
- It has unique anatomy or interaction behavior.
- It carries unique accessibility requirements.
- It appears repeatedly across products or source systems.
- It cannot be clearly represented as a variant of an existing item.
- It requires distinct usage guidance and alternatives.

### Lifecycle statuses

| Status | Meaning |
|---|---|
| Proposed | Under consideration; no production commitment |
| Experimental | Available for testing; API or guidance may change |
| Active | Recommended for production use |
| Mature | Stable, broadly adopted, and strongly supported |
| Legacy | Existing but not recommended for new work |
| Deprecated | Scheduled for removal or replacement |
| Archived | Retained only for historical reference |

***

## 11. Final navigation rule set

Use these rules to resolve ambiguous placement decisions.

```text
If it defines visual rules, place it in Foundations.
If it arranges elements, place it in Layout & Composition.
If it is primarily read or viewed, place it in Content & Identity.
If it triggers an operation, place it in Actions & Commands.
If it collects or edits data, place it in Forms & Data Entry.
If it helps someone move or find information, place it in Navigation & Discovery.
If it displays records, values, metrics, or charts, place it in Data Display & Visualization.
If it communicates outcomes, progress, or system state, place it in Feedback & System State.
If it layers, temporarily reveals, or contextualizes information, place it in Overlays & Disclosure.
If it combines components to complete a recurring task, place it in Patterns & Workflows.
If it defines a repeatable screen-level structure, place it in Page Structures & Templates.
If it is domain-specific, place it in Specialized Experiences.
If it governs cross-cutting mechanics, access, or implementation behavior, place it in Interaction, Accessibility & Utilities.
If it governs platform delivery, code integration, adoption, or maintenance, place it in Implementation & Governance.
```

***

## 12. Final result

The final sidebar should remain concise:

```text
UI Inventory

01 Foundations
02 Layout & Composition
03 Content & Identity
04 Actions & Commands
05 Forms & Data Entry
06 Navigation & Discovery
07 Data Display & Visualization
08 Feedback & System State
09 Overlays & Disclosure
10 Patterns & Workflows
11 Page Structures & Templates
12 Specialized Experiences
13 Interaction, Accessibility & Utilities
14 Implementation & Governance
```

Under this model:

- `Button` appears once under **Actions & Commands**.
- `Combobox` appears once under **Forms & Data Entry**.
- `Search workspace` appears once under **Navigation & Discovery**.
- `Data grid` appears once under **Data Display & Visualization**.
- `Modal` normalizes to **Dialog** under **Overlays & Disclosure**.
- `Toast`, `Snackbar`, `Flag`, and related vendor-specific terms normalize under **Feedback & System State**.
- `Grid`, `Stack`, `Flex`, and `Box` remain together under **Layout & Composition**.
- `Dashboard` and `Master-detail workspace` remain screen-level structures under **Page Structures & Templates**.
- DAM, collaboration, commerce, and AI remain comprehensive but do not clutter the generic UI component inventory.
- Atlassian, Material, Carbon, Fluent, Spectrum, Ant, Primer, and all other systems become **source mappings**, preserving provenance without creating duplicate navigation.

This gives you a complete UI inventory that is broad enough to absorb all referenced design systems while staying stable, searchable, non-repetitive, and useful for practical design layout work.

***

## Plenix decisions (2026-10-06, the owner)

These refine the standard for Plenix. `check-spec.js` checks the ones marked (checked).

1. **Sidebar:** flat (section › items) and complete: every leaf of §3 is listed, in §3 order (checked). A leaf with no Plenix
   item yet is shown greyed and opens its own page with the full template, every section "Not written yet".
2. **Item page order** (checked; owner, 2026-10-21): the 17 sections of §7, in §7's order, with §7's titles, rows and
   columns (page-template.js).
3. **Implementation:** one panel with tabs (Use in code, the JSX files, the CSS files, Classes, Tokens), named
   "Implementation". It covers §7's "Implementations".
4. **Placeholders:** a template section with no content yet is shown with "Not written yet". The specification is a living
   document: everything has its place even before it is defined.
5. **Variants:** a Base card (what every variant shares, each attribute with its token, and the shared API properties),
   then one card per variant with the live sample, only what that variant changes, and the prop that selects it. Read
   from the CSS (the base rule, then each modifier rule). Grouped by kind (Hierarchy, Size, Tone, Shape…); kinds are
   never mixed.
6. **States:** every interactive component has state cards and a States table from §7's list; a state that does not
   apply is left out.
7. **Filters:** the specification documents how each kind of filter looks, interacts and behaves (a date range, a
   choice, a number range…); it adds no filter controls of its own.
8. **Page templates (§11):** each page template has its own record (for example a shell with a secondary navigation
   pane on the left, which is not a filter pane); the list is approved by the owner first.
9. **Everything tokenized:** nothing is built ad hoc or with inline styling; the specification documents every token,
   class and component that the applications are drawn from.
   **Inline styles** (owner, 2026-10-13): "sometimes we have situations in which JavaScript is needed to make
   adjustments on the spot. And these adjustments make inline styles. However these adjustments are based on tokens and
   defined styles to make inline adjustments for that moment. This is very different from an inline style that is not
   defined or part of token. So in this case inline styling is permitted." React's style prop counts as such an
   adjustment: "it should be token based so that we have a standard and consistency".
   - Forbidden: styling hard-coded in HTML or markup (a `style="…"` attribute in an HTML file, in an HTML string or as a
     JSX string attribute; a `<style>` block), and any value that is not defined or not from a token: a color, a length
     with a unit, a font or a bare number written as a literal in style-writing code.
   - Permitted, anywhere (components, patterns, applications): JavaScript that writes an inline style at run time
     (`el.style.x =`, `style.setProperty(…)`, `style={{…}}`, `style: {…}`) with a `var(--plx-…)` reference or a value
     computed in code from tokens, defined styles or measured layout (for example the table's column widths and their
     resizing, a popover's position).
   - The output is on the grid too: a JavaScript or React offset "has to conform to fit into the grid system!!!
     important" (owner, 2026-10-13). The concern: a look "fixed" with hard-coded inline values that have no basis cannot
     be tracked, adjusted or kept consistent. Every length JavaScript writes goes through the grid helper
     (`platform/utils/grid.ts`: `snapToGrid`, `gridPx`, its step read from the base spacing token `--plx-ref-space-4px`)
     or, where a size scale applies, the size steps (`utils/sizeSteps.js`: `snapSize`, `stepSize`). A measured anchor
     (where a trigger is) is layout; the offsets and gaps added to it are tokens; the result is snapped. DataGrid column
     widths are rounded up to the grid when measured, fitted or dragged.
   - Owner decisions that stay: a DataGrid's row height and cell padding are the density's (Compact, Standard,
     Comfortable: tokens and classes, never measured, never written); its column widths come from the React renderer (it measures the
     content, the columns without a width share the room left, the person resizes them).
   - Checks: `check-system.js` (rule inline-style, with fixtures for both cases) rejects style in markup and literal
     values in style-writing code, and a length written neither as a token nor through the grid helper or the size
     steps; the run-time style audit and the pages test reject a `<style>` block, an inline length off the grid, a custom
     property that is not a Platform one, a font family that is not a token, and an inline height, line height or
     padding on a DataGrid row or cell; the rule table-geometry rejects forcing a legacy redraw that measures every row.
10. **Table lines** (batch 172): every table (the Platform Table, data grids, PropertyList table, the spec's own
    tables) draws its row and column lines as regular full borders, one shade darker than before (--plx-sys-table-line,
    --plx-sys-table-header-line); there are no column lines that stop short of the row lines.
11. **Platforms** (batch 273, 2026-10-09): Plenix runs on the web, iOS and Android. The theme owns the look on every
    platform (color, DM Sans, radius, motion, the focus rule); each platform owns sizes, targets and behavior from its
    published standard (Apple HIG, Material 3, WCAG 2.2); platform minimums beat theme and density. Every component page
    has a Platforms section, and every value names its source type (rule, token, system, reference,
    Plenix) and its source (platforms.js). The Platforms section's place and parts are §7's (#13). Window classes are Narrow (under 600), Medium (600–839) and Wide (840 and
    up); Compact stays a density name. On a narrow web window, top-level navigation is a bottom bar for up to 5
    destinations, never a drawer (Material 3 no longer recommends it); a navigation rail on Medium windows; other apps
    through the header's app switcher. iOS type takes the Dynamic Type sizes in DM Sans.
- **Gap placeholders (2026-10-06, the owner):** 64 items that enterprise systems (IBM Carbon, Atlassian; checked against Material 3, Fluent 2, Polaris, Spectrum) define and this hierarchy lacked were added as leaves, five of them as new Foundations subcategories (Principles, Grid, Interaction states, Content design, Data formatting) and one in Patterns (Product lifecycle). They show greyed until Plenix defines them. "Page header" was not re-added (the owner removed it; the record page structure covers it).
