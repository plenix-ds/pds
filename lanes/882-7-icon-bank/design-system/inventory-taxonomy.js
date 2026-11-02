/* Plenix master spec · the UI Inventory taxonomy: 14 primary sections for each platform (Web, iOS, Android: level 0; batch 324), their subcategories and the canonical item names
   under each (the Unified UI Inventory standard). The hierarchy is organized by user purpose and UI role; source design
   systems (Atlassian, Carbon, Material, Fluent, Ant …) are mappings on each record, never categories.
   Plenix items (inventory.js) attach to a leaf here by its canonical name; a leaf with no Plenix item is shown as
   "Not in Plenix yet" on its section's page, so the inventory shows what exists and what does not.
   Each subcategory: [name, 'Leaf | Leaf | …'].
   Level 0 is the platform (platform: 'web', the default, 'ios' or 'android'): the dropdown at the top of the navigation pane
   lists the sections of one platform at a time (batch 314). */
window.DSTaxonomy = [
  { n: '01', id: 'foundations', icon: 'settings-customize', title: 'Foundations', question: 'What visual and behavioral rules govern the system?',
    includes: 'Tokens, color, typography, spacing, motion, themes', excludes: 'Finished UI components',
    intro: 'Foundations are reusable design decisions and rules. They are not standalone application components.',
    subs: [
      ['Design tokens', 'Primitive / global tokens|Semantic tokens|Component tokens|State tokens|Theme tokens|Responsive tokens'],
      ['Brand', 'Logos|Wordmarks|Brand marks|Product marks|Brand application|Illustrations'],
      ['Color', 'Color palette|Neutral colors|Brand colors|Accent colors|Semantic colors|Surface colors|Text colors|Border colors|Interactive colors|Status colors|Data visualization colors|Dark mode|Contrast rules'],
      ['Typography', 'Typefaces|Type scale|Font size|Font weight|Line height|Letter spacing|Heading hierarchy|Body styles|Label styles|Caption styles|Code typography|Text truncation|Display type|Tabular figures'],
      ['Spacing and sizing', 'Spacing scale|Component spacing|Content spacing|Section spacing|Sizing scale|Control heights|Icon sizes|Content widths|Touch targets|Density|Responsive sizing'],
      ['Shape and surfaces', 'Border width|Border style|Border color|Radius scale|Nested radius|Shape treatment|Elevation|Shadows|Surface fills|Opacity|Materials'],
      ['Iconography', 'Icon system|Icon inventory|How to add an icon|Icon sizes|Icon alignment|Product icons|Status icons|Icon accessibility|Icon modules and delivery|Pictograms|Icon tile'],
      ['Motion', 'Duration|Easing|Transitions|Entrance motion|Exit motion|Expansion motion|Loading motion|Gesture motion|Reduced motion'],
      ['Layers', 'Z-index scale|Stacking contexts|Overlay hierarchy|Backdrop treatment'],
      ['Responsive system', 'Breakpoints|Container behavior|Fluid sizing|Density modes|Device behavior|Adaptive patterns|Fit and overflow'],
      ['Themes', 'Light theme|Dark theme|High-contrast theme|Brand themes|Product themes|Theme switching|Theme zones|AI visual language'],
      ['Principles', 'Design principles|Visual hierarchy'],
      ['Grid', 'Layout grid|Keylines|Aspect-ratio scale'],
      ['Interaction states', 'Hover treatment|Focus treatment|Pressed treatment|Selected treatment|Dragged treatment|Disabled treatment'],
      ['Content design', 'Voice and tone|Style and grammar|Capitalization|Inclusive language|Terminology|Action labels|Writing messages|Empty-state and onboarding copy|Text alternatives'],
      ['Data formatting', 'Numbers and units|Date and time formats|Currency and percentages|Names, addresses and phone numbers']
    ] },
  { n: '02', id: 'layout', icon: 'grid-2x2', title: 'Layout & Composition', question: 'How do I arrange interface regions and elements?',
    includes: 'Grid, Stack, Flex, containers, split panes, responsive composition', excludes: 'Page templates, cards as content objects',
    intro: 'The home for how UI is arranged, not for pages, cards or finished workflow layouts. Plenix layout follows five independent layers: spatial, layout, density, interaction and tables.',
    subs: [
      ['Layout primitives', 'Box / container|Stack|Inline / row|Flex|Grid|Spacer|Divider|Separator|Aspect ratio|Bleed|Inset|Wrap|Center|Scroll area'],
      ['Regions', 'Section|Surface|Panel|Content container|Sidebar|Rail|Main content region|Secondary region|Sticky region|Fixed region|Footer region'],
      ['Layout arrangements', 'One-column layout|Two-column layout|Three-column layout|Split pane|Resizable panes|Master-detail layout|Sidebar layout|Dashboard grid|Masonry layout|Holy Grail layout|Full-screen workspace'],
      ['Responsive composition', 'Breakpoints|Reflow|Responsive grid|Hide / show|Reorder|Collapse|Adaptive navigation|Adaptive density|Container queries']
    ] },
  { n: '03', id: 'content', icon: 'doc-text', title: 'Content & Identity', question: 'How do I present readable content, media, people, and metadata?',
    includes: 'Text, images, avatars, profiles, timestamps, descriptions', excludes: 'Tables, charts, form controls',
    intro: 'Things primarily intended to be read, viewed, recognized or referenced.',
    subs: [
      ['Text and reading', 'Heading|Body text|Paragraph|Label|Caption|Helper text|Secondary text|Truncated text|Rich text|Blockquote|Ordered list|Unordered list|Description list|Inline code|Code block|Keyboard hint'],
      ['Links', 'Inline link|Standalone link|External link|Back link|Skip link'],
      ['Images and media', 'Image|Responsive image|Thumbnail|Figure|Image gallery|Illustration|Video|Audio|QR code|Barcode|Color swatch'],
      ['Identity', 'Avatar|Avatar group|User identity|Profile summary|Entity title|User card|Team|Group|Role|Permission summary|Presence|Online status'],
      ['Metadata', 'Key-value pair|Property list|Description list|Attribute list|Timestamp|Relative time|Date label|Version label']
    ] },
  { n: '04', id: 'actions', icon: 'circle-plus', title: 'Actions & Commands', question: 'How does a person make something happen?',
    includes: 'Buttons, menus, toolbars, command palettes', excludes: 'Form value selection and navigation',
    intro: 'An item belongs here when its primary purpose is to cause an action. A menu is classified by its purpose: an action menu belongs here, a navigation menu under Navigation, a value-selection menu under Forms.',
    subs: [
      ['Buttons', 'Primary button|Secondary button|Tertiary button|Ghost button|Destructive button|Icon button|Loading button|Split button|Floating action button|Button group'],
      ['Action collections', 'Action group|Action list|Action bar|Toolbar|Formatting toolbar|Selection toolbar|Bulk action bar|Overflow action|Action panel'],
      ['Menus and commands', 'Action menu|Dropdown menu|Context menu|Overflow menu|Command menu|Command palette|Menu item|Checkbox menu item|Radio menu item|Menu group|Menu bar|Menu, menu bar and command bar: which one'],
      ['Triggers', 'Dialog trigger|Modal trigger|Drawer trigger|Popover trigger|Tooltip trigger|Disclosure trigger'],
      ['Common actions', 'Copy|Download|Export|Import|Print|Share|Duplicate|Rename|Delete|Back to top']
    ] },
  { n: '05', id: 'forms', icon: 'fields', title: 'Forms & Data Entry', question: 'How does a person enter or edit structured information?',
    includes: 'Inputs, selects, dates, uploads, form validation', excludes: 'Search results, filter workspaces',
    intro: 'All controls used to capture, edit, validate or submit user-supplied data.',
    subs: [
      ['Form foundations', 'Form|Form section|Field|Field group|Fieldset|Legend|Label|Help text|Required indicator|Validation message|Error summary|Input group|Form actions|Character counter|Read-only field|Field style variants'],
      ['Text input', 'Text field|Password field|Email field|URL field|Telephone field|Search input|Text area|Autogrowing text area|Rich-text editor|Code editor|Inline editable text|PIN / OTP input'],
      ['Choice input', 'Checkbox|Checkbox group|Radio|Radio group|Switch|Toggle|Toggle button|Toggle button group|Segmented control|Choice card|Rating'],
      ['Select and lookup', 'Select|Native select|Multi-select|Combobox|Autocomplete|Suggest|Searchable select|Async select|Creatable select|Checkbox select|Radio select|Cascader|Tree select|People picker|Entity picker|Country / locale select'],
      ['Date, time, and color', 'Calendar|Date picker|Date range picker|Time picker|Date-time picker|Relative date input|Time-zone selector|Color picker|Swatch picker'],
      ['Numeric and range input', 'Number input|Stepper|Currency input|Percentage input|Quantity selector|Slider|Range slider'],
      ['File and media input', 'File input|File upload|Drop zone|Drag-and-drop upload|Image upload|Avatar upload|Attachment picker|Media picker']
    ] },
  { n: '06', id: 'navigation', icon: 'app-switcher', title: 'Navigation & Discovery', question: 'Where am I, where can I go, and how do I find information?',
    includes: 'Navigation, tabs, breadcrumbs, search, filters, sort', excludes: 'Action menus and form select controls',
    intro: 'Where am I, where can I go, and how do I find information?',
    subs: [
      ['Global navigation', 'Application header|App bar|Top navigation|Navigation bar|Global menu|Product switcher|Workspace switcher|Account menu|Global search'],
      ['Local navigation', 'Side navigation|Sidebar navigation|Navigation rail|Section navigation|Subnavigation|Settings navigation|Product navigation|Table of contents'],
      ['Hierarchical navigation', 'Breadcrumbs|Navigation menu|Nested menu|Mega menu|Tree view|Drilldown navigation|Miller columns|Stepper|Previous / next navigation'],
      ['Content navigation', 'Tabs|Vertical tabs|Pagination|Anchor links|In-page navigation|Scroll spy|Skip navigation|Load more / infinite scroll'],
      ['Mobile navigation', 'Bottom navigation|Mobile app bar|Mobile navigation drawer|Mobile menu|Bottom-sheet navigation|Mobile tab bar'],
      ['Search, filter, and discovery', 'Search bar|Search suggestions|Autocomplete search|Search results|Search result item|Search result groups|Recent searches|Search history|Saved searches|Advanced search|Search workspace|Filter bar|Filter panel|Filter menu|Faceted filters|Quick filters|Advanced filters|Filter chip|Saved filters|Sort control|Query builder']
    ] },
  { n: '07', id: 'data-display', icon: 'database', title: 'Data Display & Visualization', question: 'How is structured information shown and interpreted?',
    includes: 'Tables, lists, cards, metrics, charts, maps', excludes: 'System messages and transient feedback',
    intro: 'Structured information, collections, analytical data and data-driven displays.',
    subs: [
      ['Labels and indicators', 'Badge|Tag|Chip|Data pill|Lozenge|Counter|Status label|Statistic|Metric|KPI'],
      ['Lists and collections', 'List|List item|Grouped list|Resource list|Object list|Interactive list|Selectable list|Virtualized list|Feed|Activity stream|Timeline'],
      ['Cards and objects', 'Card|Content card|Object card|Media card|Product card|Profile card|Metric card|Feature card|Selectable card|Expandable card|Navigation card'],
      ['Tables', 'Table|Data grid|Compact table|Responsive table|Sortable table|Filterable table|Selectable table|Expandable table|Editable table|Grouped table|Tree table|Virtualized table|Property table|Comparison table|Table editing (planned)'],
      ['Charts', 'Chart foundations|Chart legend|Chart tooltip|Data label|Axis|Grid line|Threshold|Reference line|Annotation|Line chart|Area chart|Bar chart|Column chart|Stacked bar chart|Pie chart|Donut chart|Scatter plot|Bubble chart|Heat map|Histogram|Box plot|Bullet chart|Gauge|Funnel|Waterfall|Sankey diagram|Radar chart|Sparkline|Chart accessibility|Treemap|Combo chart|Lollipop chart|Step chart|Word cloud|Gantt chart|Choropleth map|Chart interaction'],
      ['Specialized displays', 'Calendar view|Carousel|Map|Graph / network|Diagram|Timeline visualization|Comparison view']
    ] },
  { n: '08', id: 'feedback', icon: 'hdr-bell', title: 'Feedback & System State', question: 'What does the system need to communicate?',
    includes: 'Alerts, toasts, statuses, progress, loading, empty states', excludes: 'Dialogs and popovers',
    intro: 'UI that communicates state, progress, outcomes, errors, warnings and recovery options. Blankslate, zero state and no data normalize under Empty state; snackbar and flag under Toast.',
    subs: [
      ['Messages', 'Alert|Banner|Callout|Inline message|Section message|Notification|Toast|Snackbar|Flag|Notification center'],
      ['Status', 'Status icon|Status dot|Status badge|Severity indicator|Presence indicator|Availability indicator|Health indicator|Count badge'],
      ['Loading and progress', 'Spinner|Skeleton|Shimmer|Loading bar|Progress bar|Circular progress|Meter|Progress tracker|Step progress|Indeterminate loading|Loading overlay'],
      ['Empty, failure, and recovery', 'Empty state|Zero state|No-results state|Error state|Warning state|Success state|Offline state|Degraded state|Permission-denied state|Not-found state|Maintenance state|Retry pattern|Undo pattern|Completion state|Disabled state|Read-only state|Unsaved changes']
    ] },
  { n: '09', id: 'overlays', icon: 'expand', title: 'Overlays & Disclosure', question: 'How is contextual or temporarily layered information revealed?',
    includes: 'Dialogs, drawers, tooltips, popovers, accordions', excludes: 'Persistent navigation and page structure',
    intro: 'Layered, contextual, temporary or progressively revealed UI. Modal normalizes to Dialog; offcanvas and side sheet to Drawer; scrim and blanket to Backdrop.',
    subs: [
      ['Dialogs', 'Dialog|Modal dialog|Non-modal dialog|Alert dialog|Confirmation dialog|Destructive confirmation|Prompt dialog|Form dialog|Full-screen dialog|Wizard dialog'],
      ['Drawers and sheets', 'Side drawer|Navigation drawer|Inspector drawer|Properties panel|Bottom sheet|Full-height sheet|Responsive sheet|Help panel'],
      ['Contextual overlays', 'Popover|Popup|Inline dialog|Hover card|Preview overlay|Tooltip|Rich tooltip|Keyboard shortcut tooltip|Teaching bubble|Contextual help'],
      ['Overlay surfaces', 'Context menu|Dropdown surface|Lightbox|Media lightbox|Anchored overlay|Popconfirm'],
      ['Disclosure', 'Disclosure|Accordion|Collapsible|Expand / collapse|Details|Show more / less|Truncate / expand|Progressive disclosure|Expandable section'],
      ['Layer behavior', 'Backdrop / scrim|Focus trap|Focus restoration|Scroll lock|Portal|Floating positioning|Overlay accessibility']
    ] },
  { n: '10', id: 'patterns', icon: 'merge', title: 'Patterns & Workflows', question: 'How do components work together to complete a user task?',
    includes: 'Create, edit, approve, onboarding, authentication', excludes: 'Individual components',
    intro: 'Patterns are intentional combinations of components that help someone complete a task. They are not individual UI components.',
    subs: [
      ['Selection and organization', 'Single selection|Multi-selection|Bulk selection|Select all|Transfer list|Dual listbox|Grouping|Reordering|Drag and drop|Sortable list|Drop target|Resize|Reposition'],
      ['Creation and editing', 'Create flow|Edit flow|Multi-step form|Wizard|Inline editing|Autosave|Draft state|Save as|Duplicate|Import|Export|Delete flow'],
      ['Review and approval', 'Review flow|Compare|Approve|Reject|Assign|Delegate|Publish|Unpublish|Archive|Restore'],
      ['Onboarding and education', 'Onboarding|Product tour|Spotlight|Coach mark|Walkthrough|Checklist|Contextual education|Feature introduction'],
      ['Authentication and permissions', 'Sign in|Sign up|Password reset|Multi-factor authentication|Single sign-on|Account recovery|Permissions|Roles|Access request|Account connection|Session timeout'],
      ['Data-management workflows', 'Data-table workflow|Filter and sort workflow|Saved view|Bulk edit|Import workflow|Export workflow|Search workflow|Data review workflow'],
      ['Product lifecycle', 'Lifecycle journeys|Trial and upgrade|Offboarding']
    ] },
  { n: '11', id: 'page-structures', icon: 'grid-3x2', title: 'Page Structures & Templates', question: 'What screen-level layouts are reusable?',
    includes: 'App shells, dashboards, list pages, detail pages, templates', excludes: 'Low-level layout primitives',
    intro: 'Reusable screen-level architecture. It is not a replacement for layout primitives.',
    subs: [
      ['Application shell', 'Header|Global navigation|Sidebar|Main workspace|Secondary panel|Inspector region|Footer|Status region'],
      ['Workspace structures', 'Single-pane workspace|Two-pane workspace|Three-pane workspace|Master-detail workspace|Inspector layout|Data workspace|Full-screen workspace|Split workspace'],
      ['Page structures', 'Dashboard|Landing page|Home page|Listing page|Search results page|Detail page|Object / record page|Create page|Edit page|Settings page|Profile page|Account page|Authentication page|Error page|Empty application state|Full-screen experience|Page actions bar'],
      ['Templates and reference experiences', 'Admin template|Dashboard template|Data-management template|Content-management template|DAM / asset-management template|Settings template|Form template|Search template|Authentication template|Reference screen']
    ] },
  { n: '12', id: 'specialized', icon: 'image-b', title: 'Specialized Experiences', question: 'What domain-specific UI families exist?',
    includes: 'DAM, collaboration, communication, commerce, AI', excludes: 'General-purpose components',
    intro: 'Domain-specific systems that depend on many shared components but should not dominate the generic component taxonomy.',
    subs: [
      ['Files, assets, and DAM', 'File|Folder|Asset|Collection|File browser|Folder browser|Asset browser|File list|Asset grid|Asset gallery|Asset card|File row|Thumbnail|Preview|Media viewer|Document viewer|Image viewer|Video player|Audio player|Upload manager|Download manager|File picker|Asset picker|Metadata editor|Version history|Version comparison|Related assets|Renditions and derivatives'],
      ['Collaboration and communication', 'Comment|Comment thread|Reply|Mention|Annotation|Conversation|Chat|Message|Inbox|Notification center|Announcement|Activity feed|Audit history|Sharing|Presence|Approval workflow'],
      ['Commerce', 'Product discovery|Product listing|Product detail|Product options|Cart|Checkout|Payment|Order confirmation|Order management|Subscription management|Returns'],
      ['AI and intelligent UI', 'AI trigger|AI action|AI assistant|AI chat|Prompt input|Prompt suggestions|Prompt history|Streaming response|Thinking / processing state|AI citation|Source reference|Generated content|Suggested edit|Suggested action|Accept / reject suggestion|Regenerate|Refine|AI search|Semantic search|Recommendation|Confidence / uncertainty|Human review|AI label|AI explainability|AI disclaimer']
    ] },
  { n: '13', id: 'interaction', icon: 'settings-permissions', title: 'Interaction, Accessibility & Utilities', question: 'What cross-cutting mechanics and requirements govern behavior?',
    includes: 'Focus, keyboard behavior, portals, positioning, virtualization', excludes: 'General visual components',
    intro: 'Behavior that is cross-cutting, implementation-oriented or essential for inclusive interaction. Accessibility guidance lives here and is attached to every component record.',
    subs: [
      ['Interaction foundations', 'Focus ring|Focus order|Focus trap|Focus restoration|Keyboard navigation|Keyboard shortcuts|Shortcut hints|Pointer interaction|Touch interaction|Gesture interaction|Pressable|Focusable|Selectable|Drag handle'],
      ['Accessibility', 'Accessible names|Accessible descriptions|Screen-reader behavior|Live regions|Visually hidden content|Semantic HTML|Keyboard support|Focus visibility|Color contrast|Touch-target sizing|Reduced motion|High contrast|RTL / bidirectional UI|Accessible drag and drop|WCAG guidance|Use of color|Captions and transcripts|Accessibility testing|Internationalization'],
      ['Behavioral utilities', 'Portal|Overlay manager|Focus lock|Click outside|Floating positioner|Scroll lock|Scroll restoration|Resize observer|Intersection observer|Responsive visibility|Breakpoint utility|Visually hidden|Truncate|Clamp|Clipboard|Hotkey|Virtualization|Drag-and-drop engine|Collection view state']
    ] },
  { n: '14', id: 'implementation', icon: 'settings-catalog', title: 'Implementation & Governance', question: 'How is the system built, maintained, and adopted?',
    includes: 'Platforms, frameworks, testing, migration, contribution', excludes: 'UI patterns and visual guidance',
    intro: 'How the Platform is built, checked, maintained and adopted by both Plenix applications.',
    subs: [
      ['Platforms', 'Platforms standard|Web|Mobile web|Desktop'],
      ['Frameworks', 'React|Vue|Angular|Web components|HTML / CSS|Native implementation'],
      ['Engineering guidance', 'CSS architecture|CSS reset|Styling API|Component API|Theming|State management|Composition patterns|Performance|Virtualization|Testing|Analytics instrumentation|Migration|Deprecation|Lint tooling|Design-system MCP tooling|Browser support policy'],
      ['Governance', 'Contribution model|Design review|Code review|Component lifecycle|Versioning|Changelog|Adoption guidance|Figma libraries|Code libraries|Release process|Design-system roadmap']
    ] },
  { n: '01', id: 'ios-foundations', platform: 'ios', icon: 'settings-customize', title: 'Foundations', question: 'What visual and behavioral rules govern the system?',
    includes: 'The Apple Human Interface Guidelines pages for foundations', excludes: 'Finished UI components',
    intro: 'Foundations on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Principles', 'Design principles|Designing for iOS|Designing for iPadOS|Designing for iPhone Duo'],
      ['Brand', 'Branding'],
      ['Color', 'Color|Dark Mode'],
      ['Typography', 'Typography'],
      ['Shape and surfaces', 'Materials'],
      ['Iconography', 'Icons|SF Symbols'],
      ['Motion', 'Motion'],
      ['Content design', 'Writing|Inclusion|Right to left']
    ] },
  { n: '02', id: 'ios-layout', platform: 'ios', icon: 'grid-2x2', title: 'Layout & Composition', question: 'How do I arrange interface regions and elements?',
    includes: 'The Apple Human Interface Guidelines pages for layout and composition', excludes: 'Page templates, cards as content objects',
    intro: 'Layout & Composition on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Layout primitives', 'Layout|Spatial layout'],
      ['Regions', 'Split views|Scroll views|Boxes|Ornaments']
    ] },
  { n: '03', id: 'ios-content', platform: 'ios', icon: 'doc-text', title: 'Content & Identity', question: 'How do I present readable content, media, people, and metadata?',
    includes: 'The Apple Human Interface Guidelines pages for content and identity', excludes: 'Tables, charts, form controls',
    intro: 'Content & Identity on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Text and reading', 'Labels|Text views'],
      ['Images and media', 'Images|Image views|Web views'],
      ['Identity', 'App icons']
    ] },
  { n: '04', id: 'ios-actions', platform: 'ios', icon: 'circle-plus', title: 'Actions & Commands', question: 'How does a person make something happen?',
    includes: 'The Apple Human Interface Guidelines pages for actions and commands', excludes: 'Form value selection and navigation',
    intro: 'Actions & Commands on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Buttons', 'Buttons|Pop-up buttons|Pull-down buttons'],
      ['Action collections', 'Toolbars|Activity views'],
      ['Menus and commands', 'Menus|Context menus|Edit menus|Dock menus|The menu bar|Home Screen quick actions'],
      ['Common actions', 'Undo and redo|Printing']
    ] },
  { n: '05', id: 'ios-forms', platform: 'ios', icon: 'fields', title: 'Forms & Data Entry', question: 'How does a person enter or edit structured information?',
    includes: 'The Apple Human Interface Guidelines pages for forms and data entry', excludes: 'Search results, filter workspaces',
    intro: 'Forms & Data Entry on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Form foundations', 'Entering data'],
      ['Text input', 'Text fields|Token fields|Digit entry views|Virtual keyboards'],
      ['Choice input', 'Toggles|Segmented controls'],
      ['Select and lookup', 'Pickers|Combo boxes'],
      ['Date, time, and color', 'Color wells'],
      ['Numeric and range input', 'Sliders|Steppers'],
      ['File and media input', 'Image wells']
    ] },
  { n: '06', id: 'ios-navigation', platform: 'ios', icon: 'app-switcher', title: 'Navigation & Discovery', question: 'Where am I, where can I go, and how do I find information?',
    includes: 'The Apple Human Interface Guidelines pages for navigation and discovery', excludes: 'Action menus and form select controls',
    intro: 'Navigation & Discovery on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Global navigation', 'Tab bars|Sidebars'],
      ['Local navigation', 'Tab views'],
      ['Hierarchical navigation', 'Column views|Path controls'],
      ['Content navigation', 'Page controls'],
      ['Search, filter, and discovery', 'Search fields|Searching']
    ] },
  { n: '07', id: 'ios-data-display', platform: 'ios', icon: 'database', title: 'Data Display & Visualization', question: 'How is structured information shown and interpreted?',
    includes: 'The Apple Human Interface Guidelines pages for data display and visualization', excludes: 'System messages and transient feedback',
    intro: 'Data Display & Visualization on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Labels and indicators', 'Gauges|Rating indicators|Activity rings'],
      ['Lists and collections', 'Lists and tables|Collections'],
      ['Cards and objects', 'Lockups'],
      ['Tables', 'Outline views'],
      ['Charts', 'Charts|Charting data']
    ] },
  { n: '08', id: 'ios-feedback', platform: 'ios', icon: 'hdr-bell', title: 'Feedback & System State', question: 'What does the system need to communicate?',
    includes: 'The Apple Human Interface Guidelines pages for feedback and system state', excludes: 'Dialogs and popovers',
    intro: 'Feedback & System State on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Messages', 'Notifications|Managing notifications|Feedback'],
      ['Status', 'Status bars'],
      ['Loading and progress', 'Progress indicators|Loading']
    ] },
  { n: '09', id: 'ios-overlays', platform: 'ios', icon: 'expand', title: 'Overlays & Disclosure', question: 'How is contextual or temporarily layered information revealed?',
    includes: 'The Apple Human Interface Guidelines pages for overlays and disclosure', excludes: 'Persistent navigation and page structure',
    intro: 'Overlays & Disclosure on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Dialogs', 'Alerts|Action sheets'],
      ['Drawers and sheets', 'Sheets|Panels'],
      ['Contextual overlays', 'Popovers'],
      ['Disclosure', 'Disclosure controls'],
      ['Layer behavior', 'Modality']
    ] },
  { n: '10', id: 'ios-patterns', platform: 'ios', icon: 'merge', title: 'Patterns & Workflows', question: 'How do components work together to complete a user task?',
    includes: 'The Apple Human Interface Guidelines pages for patterns and workflows', excludes: 'Individual components',
    intro: 'Patterns & Workflows on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Selection and organization', 'Drag and drop'],
      ['Review and approval', 'Ratings and reviews'],
      ['Onboarding and education', 'Launching|Onboarding|Offering help'],
      ['Authentication and permissions', 'Managing accounts|Privacy'],
      ['Media', 'Playing audio|Playing video|Live-viewing apps|Workouts']
    ] },
  { n: '11', id: 'ios-page-structures', platform: 'ios', icon: 'grid-3x2', title: 'Page Structures & Templates', question: 'What screen-level layouts are reusable?',
    includes: 'The Apple Human Interface Guidelines pages for page structures and templates', excludes: 'Low-level layout primitives',
    intro: 'Page Structures & Templates on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Application shell', 'Windows|Multitasking|Going full screen'],
      ['Page structures', 'Settings']
    ] },
  { n: '12', id: 'ios-specialized', platform: 'ios', icon: 'image-b', title: 'Specialized Experiences', question: 'What domain-specific UI families exist?',
    includes: 'The Apple Human Interface Guidelines pages for specialized experiences', excludes: 'General-purpose components',
    intro: 'Specialized Experiences on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Files, assets, and DAM', 'File management|Photo editing|Live Photos'],
      ['Collaboration and communication', 'Collaboration and sharing|SharePlay|iMessage apps and stickers'],
      ['Commerce', 'Apple Pay|Apple In-App Purchase|Tap to Pay on iPhone|Wallet'],
      ['AI and intelligent UI', 'Generative AI|Machine learning|Siri'],
      ['System experiences', 'App Shortcuts|Complications|Controls|Live Activities|Snippets|Top Shelf|Watch faces|Widgets'],
      ['Technologies', 'AirPlay|Always On|App Clips|Augmented reality|Immersive experiences|CareKit|CarPlay|Game Center|HealthKit|HomeKit|iCloud|ID Verifier|Mac Catalyst|Maps|NFC|ResearchKit|ShazamKit|Sign in with Apple']
    ] },
  { n: '13', id: 'ios-interaction', platform: 'ios', icon: 'settings-permissions', title: 'Interaction, Accessibility & Utilities', question: 'What cross-cutting mechanics and requirements govern behavior?',
    includes: 'The Apple Human Interface Guidelines pages for interaction, accessibility and utilities', excludes: 'General visual components',
    intro: 'Interaction, Accessibility & Utilities on iOS: the Apple Human Interface Guidelines pages that belong here, each with Plenix’s guidance, its HIG outline and resources, and the Plenix Platforms Standard for iOS where it has a part. Subcategories carry the Web names; where the Web has none, Apple’s group name.',
    subs: [
      ['Interaction foundations', 'Gestures|Pointing devices|Focus and selection|Keyboards|Playing haptics'],
      ['Inputs', 'Action button|Apple Pencil and Scribble|Camera Control|Digital Crown|Eyes|Game controls|Gyroscope and accelerometer|Nearby interactions|Remotes'],
      ['Accessibility', 'Accessibility|VoiceOver']
    ] },
  { n: '14', id: 'ios-implementation', platform: 'ios', icon: 'settings-catalog', title: 'Implementation & Governance', question: 'How is the system built, maintained, and adopted?',
    includes: 'How to build, token mapping, generated files, sources and levels, conformance', excludes: 'UI patterns and visual guidance',
    intro: 'Plenix’s own pages for iOS: how to build, the token mapping and generated files, the sources and levels, and conformance.',
    subs: [
      ['Engineering guidance', 'How to build|Token mapping|Generated files'],
      ['Governance', 'Sources and levels|Conformance']
    ] },
  { n: '01', id: 'android-foundations', platform: 'android', icon: 'settings-customize', title: 'Foundations', question: 'What visual and behavioral rules govern a Plenix Android app?',
    includes: 'Principles, color, type, spacing, icons, shape, motion, tokens', excludes: 'Finished controls',
    intro: 'Foundations for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Overview & principles', 'Overview|Five layers|Precedence|Who owns each property|Requirements on every layer'],
      ['Color & semantic roles', 'Themes and color roles|Contrast|Color alone|Appearance'],
      ['Typography', 'Text roles|Font scale'],
      ['Spacing & sizing', 'Touch targets|Spacing between targets'],
      ['Layout grids & alignment', 'Window classes'],
      ['Icons & imagery', 'Material Symbols|Images'],
      ['Shape, borders & elevation', 'Shape and radius|Borders|Elevation'],
      ['Motion & transitions', 'Reduced motion|Transitions'],
      ['Design tokens & platform mapping', 'Token mapping|Tokens']
    ] },
  { n: '02', id: 'android-layout', platform: 'android', icon: 'grid-2x2', title: 'Layout & Composition', question: 'How are a native screen’s regions and elements arranged?',
    includes: 'Containers, stacks, safe areas, scrolling, adaptive layout', excludes: 'Screen templates',
    intro: 'Layout & Composition for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Layout containers', 'Column, Row and Box|Lazy grids'],
      ['Safe areas & system insets', 'Edge to edge and insets'],
      ['Scrolling & content regions', 'Scrolling containers|Reflow'],
      ['Adaptive & responsive layouts', 'Window classes|Orientation'],
      ['Keyboard-aware layouts', 'Keyboard']
    ] },
  { n: '03', id: 'android-content', platform: 'android', icon: 'doc-text', title: 'Content & Identity', question: 'How are readable content, media, people and metadata presented?',
    includes: 'Text, headers, images, avatars, badges, localization', excludes: 'Lists, tables, form controls',
    intro: 'Content & Identity for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Text & headings', 'Text roles|Headers'],
      ['Images & media', 'Images|Image loading'],
      ['Avatars & identity', 'Avatar'],
      ['Badges, labels & tags', 'Badge|Label'],
      ['Content & localization', 'Right to left|Text expansion']
    ] },
  { n: '04', id: 'android-actions', platform: 'android', icon: 'circle-plus', title: 'Actions & Commands', question: 'How does a person make something happen?',
    includes: 'Buttons, prominent actions, toolbars, menus, swipe actions', excludes: 'Value selection and navigation',
    intro: 'Actions & Commands for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Buttons & icon buttons', 'Button|Icon button'],
      ['Floating & prominent actions', 'Floating action button'],
      ['Toolbars & action groups', 'Top app bar actions'],
      ['Menus & contextual actions', 'Menu|Long-press menu'],
      ['Swipe actions', 'Swipe to dismiss'],
      ['Selection & bulk actions', 'Multiple selection']
    ] },
  { n: '05', id: 'android-forms', platform: 'android', icon: 'fields', title: 'Forms & Data Entry', question: 'How does a person enter or edit structured information?',
    includes: 'Text fields, search, toggles, pickers, dates, sliders, validation', excludes: 'Search results, filter screens',
    intro: 'Forms & Data Entry for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Text fields & text areas', 'OutlinedTextField|Multi-line text field'],
      ['Search fields', 'Search bar'],
      ['Checkboxes, switches & selection controls', 'Switch|Checkbox|Radio group'],
      ['Pickers & selection lists', 'Exposed dropdown menu'],
      ['Date & time input', 'DatePicker and TimePicker'],
      ['Sliders & steppers', 'Slider'],
      ['Validation & input assistance', 'Validation|Forms checks'],
      ['Form layouts & keyboard behavior', 'Form screen|Keyboard types']
    ] },
  { n: '06', id: 'android-navigation', platform: 'android', icon: 'app-switcher', title: 'Navigation & Discovery', question: 'Where am I, where can I go, and how do I find information?',
    includes: 'Bars, tabs, sidebars, rails, back, search, deep links', excludes: 'Action menus and form pickers',
    intro: 'Navigation & Discovery for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Navigation bars & top app bars', 'Top app bar'],
      ['Tab bars & navigation bars', 'NavigationBar'],
      ['Navigation drawers & sidebars', 'Expanded navigation rail'],
      ['Navigation rails', 'NavigationRail'],
      ['Segmented navigation & tabs', 'Tabs and segmented buttons'],
      ['Search & filtering', 'Search and filters|Search screen'],
      ['Back navigation & screen hierarchy', 'Back stack|The eight structures'],
      ['Deep links & entry points', 'Deep links|State restoration']
    ] },
  { n: '07', id: 'android-data-display', platform: 'android', icon: 'database', title: 'Data Display & Visualization', question: 'How is structured information shown and interpreted?',
    includes: 'Lists, cards, collections, tables, details, charts, feeds', excludes: 'System messages',
    intro: 'Data Display & Visualization for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Lists & list rows', 'List|Tree'],
      ['Cards', 'Card'],
      ['Collections & grids', 'Collection|Feed|Carousel'],
      ['Tables & structured data', 'Data grid'],
      ['Key-value details & metrics', 'Details|Metric'],
      ['Charts & visualizations', 'Charts'],
      ['Timelines & activity feeds', 'Activity feed']
    ] },
  { n: '08', id: 'android-feedback', platform: 'android', icon: 'hdr-bell', title: 'Feedback & System State', question: 'What does the app need to communicate?',
    includes: 'Progress, empty and error states, banners, snackbars, refresh, haptics', excludes: 'Dialogs and sheets',
    intro: 'Feedback & System State for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Loading & progress', 'Progress indicators'],
      ['Empty states', 'Empty state'],
      ['Error & success states', 'Error state'],
      ['Banners & inline messages', 'Inline message'],
      ['Toasts & snackbars', 'Snackbar'],
      ['Refresh & synchronization', 'Pull to refresh'],
      ['Offline & connectivity states', 'App state'],
      ['Haptic & sound feedback', 'Haptics']
    ] },
  { n: '09', id: 'android-overlays', platform: 'android', icon: 'expand', title: 'Overlays & Disclosure', question: 'How is contextual or temporarily layered information revealed?',
    includes: 'Alerts, sheets, popovers, full-screen modals, help, disclosure', excludes: 'Persistent navigation',
    intro: 'Overlays & Disclosure for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Alerts & dialogs', 'AlertDialog'],
      ['Sheets & bottom sheets', 'ModalBottomSheet'],
      ['Full-screen modals', 'Full-screen dialog'],
      ['Tooltips & contextual help', 'Tooltip|Consistent help'],
      ['Expandable & collapsible content', 'Expandable list']
    ] },
  { n: '10', id: 'android-patterns', platform: 'android', icon: 'merge', title: 'Patterns & Workflows', question: 'How do controls work together to complete a task?',
    includes: 'Onboarding, sign-in, search, create and edit, multi-step, permissions, recovery', excludes: 'Individual controls',
    intro: 'Patterns & Workflows for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Onboarding', 'Onboarding|Launch screen'],
      ['Sign-in & account access', 'Sign-in and account'],
      ['Search, filter & sort', 'Search'],
      ['Create, edit & submit', 'Form|Unsaved changes'],
      ['Selection & confirmation', 'Confirmation'],
      ['Permissions & consent', 'Permissions'],
      ['Multi-step flows', 'Step flow'],
      ['Recovery & retry', 'Error recovery']
    ] },
  { n: '11', id: 'android-screen-structures', platform: 'android', icon: 'grid-3x2', title: 'Page Structures & Templates', question: 'What screen-level layouts are reusable?',
    includes: 'App frames, home, list and detail, search, forms, settings, adaptive templates', excludes: 'Layout containers',
    intro: 'Screen Structures & Templates for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['App shell & root navigation', 'App frames|Top-level navigation'],
      ['Home & dashboard screens', 'Dashboard'],
      ['List & detail screens', 'List-detail|Detail|Supporting pane'],
      ['Search & results screens', 'Search screen'],
      ['Form & editing screens', 'Form screen|Sheet task|Full-screen task'],
      ['Profile & settings screens', 'Settings'],
      ['Split-view & adaptive templates', 'List-detail scaffold|Paged|Full-screen viewer|Content with a persistent sheet|Plenix page structures']
    ] },
  { n: '12', id: 'android-specialized', platform: 'android', icon: 'image-b', title: 'Specialized Experiences', question: 'What platform-specific experiences exist?',
    includes: 'Camera, media, maps, files and sharing, notifications', excludes: 'General-purpose controls',
    intro: 'Specialized Experiences for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Camera & media capture', 'Camera'],
      ['Media playback', 'Media player'],
      ['Maps & location', 'Maps'],
      ['File selection & sharing', 'File and photo pickers|Share'],
      ['Notifications & external entry points', 'Notifications|Deep links']
    ] },
  { n: '13', id: 'android-interaction', platform: 'android', icon: 'settings-permissions', title: 'Interaction, Accessibility & Utilities', question: 'What cross-cutting mechanics and requirements govern behavior?',
    includes: 'Targets, gestures, focus, screen readers, text scaling, contrast, states, testing', excludes: 'Visual components',
    intro: 'Interaction & Accessibility for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Touch targets & gestures', 'Touch targets|Gestures'],
      ['Focus & keyboard interaction', 'Keyboard|Focus'],
      ['Screen readers & semantics', 'TalkBack'],
      ['Text scaling', 'Font scale'],
      ['Contrast & reduced motion', 'Contrast|Reduced motion'],
      ['Interaction states', 'States'],
      ['Accessibility testing & conformance', 'Conformance']
    ] },
  { n: '14', id: 'android-implementation', platform: 'android', icon: 'settings-catalog', title: 'Implementation & Governance', question: 'How is a Plenix Android app built, maintained and released?',
    includes: 'How to build, implementations, tokens and generated files, sources, versions', excludes: 'UI guidance',
    intro: 'Implementation & Governance for Android: each page is a part of the Plenix Platforms Standard for Android, with the columns and rows that apply.',
    subs: [
      ['Getting started & how to build', 'How to build'],
      ['Platform architecture & integration', 'Implementations and controls|Behavior'],
      ['Token mapping & generated files', 'Token mapping|Generated files|Build outputs'],
      ['Sources, provenance & levels', 'Source types|Levels'],
      ['Releases & versioning', 'Versions'],
      ['Contribution & maintenance', 'Contribution'],
      ['Reference sources', 'Sources']
    ] }
];

/* the rules for placing an item (Final navigation rule set), shown on the inventory's home page */
window.DSPlacementRules = [
  ['defines visual rules', 'Foundations'], ['arranges elements', 'Layout & Composition'], ['is primarily read or viewed', 'Content & Identity'],
  ['triggers an operation', 'Actions & Commands'], ['collects or edits data', 'Forms & Data Entry'], ['helps someone move or find information', 'Navigation & Discovery'],
  ['displays records, values, metrics, or charts', 'Data Display & Visualization'], ['communicates outcomes, progress, or system state', 'Feedback & System State'],
  ['layers, temporarily reveals, or contextualizes information', 'Overlays & Disclosure'], ['combines components to complete a recurring task', 'Patterns & Workflows'],
  ['defines a repeatable screen-level structure', 'Page Structures & Templates'], ['is domain-specific', 'Specialized Experiences'],
  ['governs cross-cutting mechanics, access, or implementation behavior', 'Interaction, Accessibility & Utilities'],
  ['governs platform delivery, code integration, adoption, or maintenance', 'Implementation & Governance'],
  ['the same purposes on iOS and Android', 'the same sections, under iOS or Android (level 0)']
];
