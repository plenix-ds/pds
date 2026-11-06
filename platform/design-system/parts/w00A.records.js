/* Plenix design system · library part w00A (wave 0): the leaves Plenix already answers with an existing item ("covered
   elsewhere" in the library plan). Each gets its own thin record, home = its leaf: the existing item's code (plenix, src,
   css), its level and interaction, one of its live examples (or its guide), its written sections (docsFrom), when to use
   it for this leaf, and a link to the main record. No code changes: the main records keep their covers. */
DSParts.records.push(function (H) {
  var INTERACTIVE = ['Action', 'Input', 'Selection', 'Navigation', 'Search', 'Filter', 'Disclosure', 'Editing', 'Drag and drop'];
  // a thin record: the main record's source and a live example of it, with this leaf's own words
  var thin = function (main, r) {
    var M = H.record(main);
    if (!M) throw new Error(main + ' is not a record');
    var plain = (M.examples || []).filter(function (e) { return !Array.isArray(e[1]); });
    var ex = (plain.length ? plain : M.examples || []).slice(0, 1);
    var states = M.states || M.statesFrom || M.stateNote ? { states: M.states, statesFrom: M.statesFrom, stateNote: M.stateNote }
      : INTERACTIVE.indexOf(M.interaction) >= 0 ? { statesFrom: [main] } : {};
    return Object.assign({ id: r.sec + '-' + r.leaf.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), title: r.leaf,
      plenix: M.plenix, src: M.src, also: M.also, css: M.css, blocks: M.blocks, level: M.level, interaction: M.interaction, icon: H.iconOf(main),
      variantClasses: [], examples: ex.length ? ex : undefined, guide: ex.length ? undefined : M.guide,
      related: [main].concat((M.related || []).slice(0, 2)), docsFrom: main }, states, r);
  };
  return [
    /* ── 01 Foundations ── */
    thin('heading', { sec: 'foundations', sub: 'Typography', leaf: 'Heading hierarchy', docsFrom: undefined, purpose: 'Headings give a page an outline: one page title, then sections and subsections in order, never skipping a level, so people and screen readers can scan the page.',
      text: 'Headings follow the outline of the page: one level 1 title, then sections and subsections in order. The level comes from the structure, not the size wanted. SectionHeading gives each level its own size from the type scale (--plx-comp-section-heading-level-2/3/4-font-size): level 2 is 13px, level 3 (the default) 11px and level 4 10px, so a higher level is always larger.',
      use: ['One level 1 heading per page (the page title); sections at level 2, their parts at level 3', 'SectionHeading with level for every heading, so the size follows the level'], avoid: ['Skipping a level to get a smaller heading', 'Bold body text in place of a heading'] }),

    /* ── 02 Layout & Composition ── */
    thin('application-shell', { sec: 'content', sub: 'Links', leaf: 'Skip link',
      text: 'Skip navigation lets keyboard users pass the header and navigation pane. It is the shell’s first focusable element: a link that moves focus to the main region, shown only while it has keyboard focus.',
      use: ['Every page: AppShell draws it, pointing at the main region'], avoid: ['A page that removes the skip link', 'Hiding it from keyboard focus'], content: { labels: 'Name the main region\'s page with one h1. Keep landmark labels short nouns ("Settings sections", "Details").', actions: 'Not applicable: the shell holds no actions; the AppHeader action and the page\'s own buttons do.', errors: 'Not applicable: the shell has no error text.', localization: 'The skip link text (“Skip to main content”) comes from strings. The layout uses logical properties; in right-to-left pages the splitters mirror, so the arrow key toward the outside widens the area.' }, behavior: { pointer: 'Dragging the splitter on the navigation\'s edge resizes it between its min and max width tokens; the width is remembered. The pane\'s Collapse and Expand buttons fold it to a rail and back; at Medium (600–839px) Expand opens it over the main region and a click on the scrim closes it; at Narrow it is a screen of its own, opened from the bottom bar or the parent row.', keyboard: 'Ctrl+[ (Cmd+[) collapses and expands the navigation from anywhere. The splitter is a separator: Arrow Left / Right move it by --plx-sys-shell-splitter-step, Home and End jump to the limits, Enter collapses. Escape closes the overlay navigation.', focus: 'The skip link moves focus to the main region (tabIndex -1, no outline of its own). The shell does not trap focus; the overlay navigation is a non-modal layer.', responsive: 'Below --plx-sys-shell-rail-below (840px, Medium) the navigation is a rail that opens as an overlay; below --plx-sys-shell-phone-below (600px, Narrow) a bottom navigation bar with the pane as its own screen; below --plx-sys-shell-inspector-overlay-below (1024px) the inspector collapses and opens over the main region. Overlays stay between the header and the footer; the main region and PageContent scroll on their own.', motion: 'The splitter\'s line fades in on hover and focus with --plx-sys-motion-duration-fast; the shell has no other motion.', loading: 'Not applicable: the shell has no loading state; the page shows Loading in the main region.', error: 'Not applicable: the shell has no error state; pages show their own Notice or EmptyState.' }, purpose: 'Lets keyboard users jump past the header and navigation straight to the main content.', covers: ['navigation/Skip navigation'], aliases: ['Skip navigation'], examples: [], also: [] }),

    /* ── 04 Actions & Commands ── */
    thin('interactive-list', { sec: 'actions', sub: 'Action collections', leaf: 'Action list',
      text: 'A list of row buttons (RowButton), one action per row, each with its icon, label and optional description.',
      use: ['A short list of actions with descriptions, such as the choices of an empty state'], avoid: ['Many actions in a toolbar: use a menu'] }),
    thin('tooltip', { sec: 'actions', sub: 'Triggers', leaf: 'Tooltip trigger',
      text: 'A tooltip trigger is any focusable element wrapped in Tooltip: the label shows on hover and on keyboard focus.',
      use: ['Icon buttons, to name what they do'], avoid: ['A tooltip on an element that cannot take focus'] }),

    /* ── 06 Navigation & Discovery ── */
    thin('navigation-menu', { sec: 'data-display', sub: 'Lists and collections', leaf: 'Grouped list',
      text: 'Rows under group headings: a NavList with groups and subgroups, each group folding its rows.',
      use: ['Navigation and short lists in groups (categories, collections)'], avoid: ['Large data sets: use the DataGrid with grouping'] }),

    /* ── 08 Feedback & System State ── */
    thin('badge', { sec: 'feedback', sub: 'Status', leaf: 'Status badge',
      text: 'A status badge is Badge with a tone: a short status word on a soft fill, with its status icon inside.',
      use: ['The status of an item in a row or a header (Active, Draft, Failed)'], avoid: ['Long text or actions inside a badge'] }),
    thin('counter', { sec: 'feedback', sub: 'Status', leaf: 'Count badge',
      text: 'A count badge is Count: a number in a pill beside a label or on an icon, such as unread items.',
      use: ['How many items wait in a place (unread, selected)'], avoid: ['Counts that do not change and need no attention: write them as text'] }),

    /* ── 09 Overlays & Disclosure ── */
    thin('inspector-region', { sec: 'overlays', sub: 'Drawers and sheets', leaf: 'Inspector drawer',
      text: 'Below 1024px the inspector (SidePanel) opens over the main region; on Narrow windows (under 600px) it opens as a bottom sheet.',
      use: ['Details of the selected item on Narrow and Medium windows'], avoid: ['A separate drawer component for the same details'] }),
    thin('inspector-region', { sec: 'overlays', sub: 'Drawers and sheets', leaf: 'Properties panel',
      text: 'The properties panel is the inspector (SidePanel) showing the selected item’s properties as a property list, with Save and Cancel when they can be edited.',
      use: ['Editing the fields of one selected item beside the list'], avoid: ['Editing several items at once: use bulk actions'] }),
    thin('action-menu', { sec: 'overlays', sub: 'Overlay surfaces', leaf: 'Dropdown surface',
      text: 'The dropdown surface is the menu’s surface (Menu): a panel anchored to its trigger, with the menu radius and a border, no shadow.',
      use: ['Every list of choices or actions opened from a button'], avoid: ['A custom panel that looks like a menu'] }),
    thin('overlay-manager', { sec: 'overlays', sub: 'Layer behavior', leaf: 'Focus trap',
      text: 'A modal layer keeps focus inside itself: Tab and Shift+Tab cycle through its controls until it closes (useLayer).',
      use: ['Every modal dialog, drawer and sheet, through useLayer'], avoid: ['Trapping focus in a non-modal popover'] }),
    thin('overlay-manager', { sec: 'overlays', sub: 'Layer behavior', leaf: 'Focus restoration',
      text: 'When a layer closes, focus returns to the element that opened it (useLayer), so keyboard users continue where they were.',
      use: ['Every overlay that takes focus'], avoid: ['Moving focus to the top of the page after an overlay closes'] }),
    thin('overlay-manager', { sec: 'overlays', sub: 'Layer behavior', leaf: 'Overlay accessibility',
      text: 'Every overlay shares one layer behavior: a role and a name, Escape closes the top layer, modal layers trap focus and restore it (useLayer).',
      use: ['An overlay built on the Platform’s layers'], avoid: ['An overlay that handles Escape and focus on its own'] }),

    /* ── 11 Page Structures & Templates ── */
    thin('tree-view', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Folder browser',
      text: 'Folders are browsed in Tree: nested folders that open and close, with counts, beside the files of the current folder.',
      use: ['Hierarchies of folders or categories'], avoid: ['A flat list of folders that hides their nesting'] }),
    thin('dam-template', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Asset browser', purpose: 'Lets people find, preview and act on stored files and pictures in one place: folders, search, a grid or list, and details.',
      text: 'The asset browser is the Asset Manager: categories in the navigation pane, the assets in a grid or table, their details in the inspector.',
      use: ['Browsing, finding and managing a library of assets'], avoid: ['A second asset browser built from other parts'] }),
    thin('dam-template', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Asset grid', docsFrom: 'responsive-grid',
      purpose: 'Shows many assets as a grid of picture cards, so people can scan by sight and pick what they need.',
      text: 'The asset grid is the Asset Manager’s content grid (ContentGrid of MediaCards), switching to the table for details.',
      use: ['Visual assets people recognize by their picture'], avoid: ['Assets people compare by their fields: use the table view'] }),
    thin('media-card', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Asset card',
      text: 'An asset card is MediaCard: the asset’s picture, its name and type, and its selection check.',
      use: ['One asset in a grid'], avoid: ['Text-only items: use a card or a row'] }),
    thin('media-card', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Thumbnail', docsFrom: 'thumbnail',
      purpose: 'A small picture of a file or item beside its name, in a table cell or list row; an icon when there is no picture.',
      text: 'An asset’s thumbnail is the picture of its MediaCard (and Thumbnail in rows), cropped to the card’s aspect ratio.',
      use: ['A small picture that identifies an asset'], avoid: ['A thumbnail without a name for the asset'] }),
    thin('media-lightbox', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Media viewer',
      text: 'Media opens full size in MediaViewer: one item at a time over the page, with next and previous and its name.',
      use: ['Looking at an image or a video at full size'], avoid: ['Editing in the viewer: open the editor'] }),
    thin('media-lightbox', { sec: 'specialized', sub: 'Files, assets, and DAM', leaf: 'Image viewer',
      text: 'Images open in MediaViewer: the image at full size over the page, moving to the next and previous image.',
      use: ['Viewing images from a grid or a list'], avoid: ['Small previews: show the thumbnail'] }),
    thin('activity-stream', { sec: 'specialized', sub: 'Collaboration and communication', leaf: 'Inbox',
      text: 'An inbox is ActivityList: messages and events newest first, each with who, what and when, unread ones marked.',
      use: ['Messages and events a person works through'], avoid: ['Notifications about the system: use the notification center'] }),
    thin('notification-center', { sec: 'specialized', sub: 'Collaboration and communication', leaf: 'Notification center',
      text: 'The notification center is NotificationList, a section of the page: notifications newest first, unread ones marked.',
      use: ['Telling people what changed while they were away'], avoid: ['Urgent messages that need an answer now: use a dialog'] }),
    thin('activity-stream', { sec: 'specialized', sub: 'Collaboration and communication', leaf: 'Activity feed',
      text: 'An activity feed is ActivityList: who did what and when, newest first, in a page or a panel.',
      use: ['The history of a record or a project'], avoid: ['An audit log that people filter and export: use the DataGrid'] }),

    /* ── 13 Interaction, Accessibility & Utilities ── */
    thin('keyboard-hint', { sec: 'interaction', sub: 'Interaction foundations', leaf: 'Shortcut hints',
      text: 'Keyboard shortcuts are shown with Kbd: the keys beside the action in a menu, a tooltip or the search field.',
      use: ['A shortcut next to the action it runs'], avoid: ['Shortcuts shown without the action they run'] }),
    thin('device-behavior', { sec: 'interaction', sub: 'Interaction foundations', leaf: 'Pointer interaction',
      text: 'With a mouse or trackpad the Platform uses the pointer sizes: hover states, compact targets and tooltips (useInteraction).',
      use: ['The interaction tokens, which follow the input environment'], avoid: ['Information that only hover shows'] }),
    thin('device-behavior', { sec: 'interaction', sub: 'Interaction foundations', leaf: 'Touch interaction',
      text: 'On touch screens the Platform switches to the touch sizes: larger targets and spacing, no hover-only actions (useInteraction).',
      use: ['The interaction tokens, so touch takes effect without page code'], avoid: ['Actions that appear only on hover'] }),
    thin('device-behavior', { sec: 'interaction', sub: 'Accessibility', leaf: 'Touch-target sizing',
      text: 'Every control meets the target size of its environment: the control heights grow to the touch target on touch and mobile.',
      use: ['Control roles and heights from tokens'], avoid: ['A control smaller than its role’s target'] }),
    thin('motion', { sec: 'interaction', sub: 'Accessibility', leaf: 'Reduced motion',
      text: 'When the person asks for reduced motion, every animation and transition is instant: the motion tokens drop to zero.',
      use: ['Durations from the motion tokens, which honor prefers-reduced-motion'], avoid: ['An animation with its own duration that ignores the setting'] }),

    /* ── 14 Implementation & Governance ── */
    thin('themes', { sec: 'implementation', sub: 'Engineering guidance', leaf: 'Theming',
      text: 'Theming is the theme stylesheets and theme-boot.js: every color and elevation role switches with the theme and the mode on <html>. ThemeProvider (optional) gives React the theme, density and interaction context.',
      use: ['Colors from the theme’s roles, never from the palette'], avoid: ['A component that writes its own dark-mode colors'] })
  ];
});
