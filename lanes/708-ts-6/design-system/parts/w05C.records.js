/* Plenix design system · library part w05C (wave 5, lane C): the commands and their overlays. CommandMenu (Command
   menu), the CommandPalette pattern (Command palette), DownloadButton (Download), BackToTop (Back to top), the three new
   dialog leaves on Dialog (Non-modal dialog: modal={false}; Prompt dialog: PromptDialog; Full-screen dialog: size="full")
   and the rich tooltip on Tooltip (Rich tooltip, and the four placements). Nothing here adds a color: the rich tooltip
   and the floating back-to-top button use the popover's existing roles. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, use = H.use, noop = H.noop, box = H.box;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var para = function (t) { return h(P.Text, { as: 'p' }, t); };

  // ---- the commands the examples share
  var COMMANDS = [
    { id: 'new', label: 'Create collection', icon: 'folder-add', group: 'Create', shortcut: 'Mod+Shift+N', onSelect: noop },
    { id: 'upload', label: 'Upload files', icon: 'upload', group: 'Create', description: 'Add files to this project', shortcut: 'Mod+U', onSelect: noop },
    { id: 'settings', label: 'Open settings', icon: 'gear', group: 'Go to', shortcut: 'Mod+,', onSelect: noop },
    { id: 'trash', label: 'Open trash', icon: 'trash', group: 'Go to', keywords: ['deleted', 'bin'], onSelect: noop },
    { id: 'theme', label: 'Change theme', icon: 'settings-preferences', group: 'Settings', placeholder: 'Choose a theme', items: [
      { id: 'light', label: 'Light', onSelect: noop }, { id: 'dark', label: 'Dark', onSelect: noop }, { id: 'system', label: 'Match the system', onSelect: noop }] },
    { id: 'density', label: 'Change density', icon: 'density-standard', group: 'Settings', items: [
      { id: 'compact', label: 'Compact', onSelect: noop }, { id: 'standard', label: 'Standard', onSelect: noop }, { id: 'comfortable', label: 'Comfortable', onSelect: noop }] },
    { id: 'archive', label: 'Archive project', icon: 'archive', group: 'Settings', disabled: true, description: 'Only owners can archive' }
  ];
  var EDIT = [
    { id: 'rename', label: 'Rename', icon: 'rename', group: 'Edit', shortcut: 'F2', onSelect: noop },
    { id: 'duplicate', label: 'Duplicate', icon: 'ed-copy', group: 'Edit', shortcut: 'Mod+D', onSelect: noop },
    { id: 'delete', label: 'Delete', icon: 'trash', group: 'Edit', shortcut: 'Delete', onSelect: noop }
  ];
  var cmd = function (props) { return box(400, h(P.CommandMenu, Object.assign({ label: 'Commands', items: COMMANDS }, props))); };
  var NESTED = function () { return cmd({ items: COMMANDS.filter(function (c) { return c.items; }) }); };

  /* ── 04 Actions & Commands › Menus and commands › Command menu ── */
  var commandMenu = { id: 'command-menu', lab: true, icon: 'search', sec: 'actions', sub: 'Menus and commands', leaf: 'Command menu', title: 'Command menu',
    plenix: 'CommandMenu', src: 'components/CommandMenu/CommandMenu.jsx', level: 'Component', interaction: 'Search',
    aliases: ['Command list', 'Command search', 'Quick actions', 'cmdk'],
    text: 'A search field over the commands that match what is typed, ranked and kept in their groups, each with its icon, an optional description and its keyboard shortcut. A command can open a page of further commands. It is drawn in place (a pane, a popover); the Command palette opens it in a dialog with Ctrl K.',
    use: ['Many commands of similar weight that people find faster by typing than by scanning', 'Groups of a word or two; the shortcut on every command that has one, so people learn it', 'A page (items) for a choice that has its own options: a theme, a density, a project'],
    avoid: ['Two or three actions: use buttons or an action menu', 'Choosing a value in a form: use a Combobox', 'Searching records: use the search field and its results'],
    related: ['command-palette', 'action-menu', 'combobox', 'search-input', 'keyboard-hint'],
    map: [[ATL, 'Command palette (internal)', 'Partial'], [FLU, 'Menu with search', 'Partial'], [SPE, 'Search with a list', 'Partial']],
    variantPages: [
      vp('Grouped command menu', 'Variant', 'Grouped', { variant: 'grouped' }, 'The matching commands under their group headings, the best match first in each group.', 'Commands of several kinds: create, go to, settings', 'One group: leave out the heading'),
      vp('Command menu with shortcuts', 'Variant', 'With shortcuts', { variant: 'shortcuts' }, 'Each command with its keyboard shortcut at the end of the row, in the data font, as people read it on their system.', 'Commands that have shortcuts, so people learn them', 'Shortcuts the app does not bind: show only working keys'),
      vp('Command menu with pages', 'Variant', 'Nested pages', { variant: 'nested' }, 'A command that opens a page of its own choices, with Back and the page name above the field.', 'A choice with its own options: a theme, a density', 'More than two levels: people lose their place'),
      vp('Loading command menu', 'Variant', 'Loading', { variant: 'loading' }, 'A spinner in the field and a Loading row while the commands are fetched.', 'Commands the app searches on a server as people type', 'A local list: it filters at once'),
      vp('Empty command menu', 'Variant', 'Empty', { variant: 'empty' }, 'No results for the typed text, said in the list and announced.', 'Every command menu: it shows by itself', 'An empty list with no words')
    ],
    examples: [['Variant', [
      ['Grouped', function () { return cmd({}); }, null, 'items[].group'],
      ['With shortcuts', function () { return cmd({ items: EDIT }); }, null, 'items[].shortcut'],
      ['Nested pages', function () { return NESTED(); }, null, 'items[].items'],
      ['Loading', function () { return cmd({ items: [], loading: true, filter: false, query: 'inv', onQueryChange: noop }); }, null, 'loading'],
      ['Empty', function () { var q = use('zebra'); return cmd({ query: q[0], onQueryChange: q[1] }); }, null, 'strings.empty']], { prop: 'items' }]] };

  /* ── 04 Actions & Commands › Menus and commands › Command palette ── */
  var palette = function (props) {
    var o = use(false);
    return row(h(P.CommandPalette, Object.assign({ items: COMMANDS, open: o[0], onOpenChange: o[1], trigger: h(P.Button, { icon: 'search' }, 'Commands') }, props)));
  };
  // a region with its own palette (a component of its own, so the code shown names it and not the ref inside it)
  var EditorRegion = function EditorRegion() {
    var ref = React.useRef(null), o = use(false);
    return h('div', { ref: ref, className: 'ds-w05c-menu', tabIndex: 0, role: 'region', 'aria-label': 'Editor (press Ctrl Shift P here)' },
      h(P.CommandPalette, { items: EDIT, scope: ref, hotkey: 'Mod+Shift+P', title: 'Editor commands', open: o[0], onOpenChange: o[1], trigger: h(P.Button, { icon: 'pencil' }, 'Editor commands') }));
  };
  var commandPalette = { id: 'command-palette', lab: true, icon: 'search', sec: 'actions', sub: 'Menus and commands', leaf: 'Command palette', title: 'Command palette',
    plenix: 'CommandPalette', src: 'patterns/CommandPalette/CommandPalette.jsx', level: 'Pattern', interaction: 'Search', statesFrom: ['command-menu'],
    aliases: ['Quick open', 'Go to anything', 'Spotlight search', 'Ctrl K menu'],
    text: 'The command menu in a dialog at the top of the window, opened with Ctrl K (⌘ K on a Mac) or from a visible control. Type a few letters of a command or a place and press Enter: the palette closes, runs it and returns focus to where it was. Scoped, it opens only while focus is in one region (an editor), with that region’s commands and its own shortcut.',
    use: ['Apps with many commands and people who work from the keyboard', 'A faster way to commands that are also in the menus and toolbars, with the same names', 'scope for a region with its own commands (an editor), with a shortcut of its own'],
    avoid: ['The only way to reach a command', 'Searching records and content: use search', 'A second palette on the same shortcut'],
    related: ['command-menu', 'dialog', 'hotkey', 'search-input'],
    map: [[ATL, 'Command palette (internal)', 'Partial'], [FLU, 'Command bar search', 'Partial']],
    variantPages: [
      vp('Global command palette', 'Scope', 'Global (Ctrl K)', { variant: 'global' }, 'Opens with Ctrl K anywhere in the app, even from a text field, or from its button.', 'One palette for the whole app', 'A page that already uses Ctrl K for its own search'),
      vp('Scoped command palette', 'Scope', 'Scoped', { variant: 'scoped' }, 'Opens only while focus is inside its region, with that region’s commands and shortcut.', 'An editor or a tool with commands of its own', 'Commands that belong to the whole app: use the global palette')
    ],
    examples: [['Scope (press the button, or the shortcut)', [
      ['Global (Ctrl K)', function () { return palette({}); }, null, 'hotkey="Mod+K"'],
      ['Scoped', function () { return h(EditorRegion); }, null, 'scope']], { prop: 'scope' }]] };

  /* ── 04 Actions & Commands › Common actions › Download ── */
  var progressing = function () {
    var p = use(45);
    return row(h(P.DownloadButton, { fileName: 'brand-kit.zip', format: 'ZIP', size: 48200000, progress: p[0], onDownload: noop }),
      h(P.Button, { size: 'sm', variant: 'ghost', onClick: function () { p[1](p[0] >= 100 ? 0 : p[0] + 25); } }, 'Advance'));
  };
  var download = { id: 'download-button', lab: true, icon: 'download-arrow', sec: 'actions', sub: 'Common actions', leaf: 'Download', title: 'Download',
    plenix: 'DownloadButton', src: 'components/DownloadButton/DownloadButton.tsx', level: 'Component', interaction: 'Action', statesFrom: ['button'],
    aliases: ['Download button', 'Save file', 'Get file'],
    text: 'A button that saves one file, in its stored format, to the device. It shows the download icon and its label, with the format and size after them in the data font before the download starts; while a large or prepared file comes down, it shows a progress ring and the percent. Its name says the file, its format and its size (“Download cross-014.png (PNG, 4.2 MB)”). While it is busy, a press does nothing; the finished download is announced.',
    use: ['One file in its stored format: an original, an attachment, a report', 'format and size when the file is large, so people know what they get', 'progress for large or bundled files the app prepares'],
    avoid: ['A changed or filtered copy: use Export', 'Opening a file in the browser: use a link', 'Several formats or sizes: a menu of downloads'],
    related: ['button', 'circular-progress', 'action-menu'],
    map: [[CAR, 'Button with download icon', 'Partial'], [SPE, 'Action button (download)', 'Partial'], [ANT, 'Upload list download', 'Partial']],
    variantPages: [
      vp('Icon download button', 'Variant', 'Icon', { variant: 'icon' }, 'The download icon alone; its name says the file, its format and size.', 'Rows and cards with little room', 'The only action of a page: give it a label'),
      vp('Labeled download button', 'Variant', 'With label', { variant: 'label' }, 'The icon and the label Download (or the caller’s: Download original).', 'Most downloads', 'A label without the object when several files are near'),
      vp('Download button with file facts', 'Variant', 'With size and format', { variant: 'meta' }, 'The format and size after the label, in the data font, muted.', 'Large files, or files people choose between by size', 'Small files where the size does not matter'),
      vp('Download in progress', 'Variant', 'In progress', { variant: 'progress' }, 'A progress ring replaces the icon, and Downloading shows with the percent; the button is busy.', 'Large or prepared files', 'Downloads the browser shows itself: a plain link is enough')
    ],
    examples: [['Variant', [
      ['Icon', function () { return row(h(P.DownloadButton, { iconOnly: true, href: '#cross-014.png', fileName: 'cross-014.png', format: 'PNG', size: 4400000 })); }, null, 'iconOnly'],
      ['With label', function () { return row(h(P.DownloadButton, { href: '#cross-014.png', fileName: 'cross-014.png' })); }, null, 'href, fileName'],
      ['With size and format', function () { return row(h(P.DownloadButton, { href: '#brand-kit.zip', fileName: 'brand-kit.zip', format: 'ZIP', size: 48200000 }, 'Download original')); }, null, 'format, size'],
      ['In progress', function () { return progressing(); }, null, 'progress']], { prop: 'variant' }]] };

  /* ── 04 Actions & Commands › Common actions › Back to top ── */
  var LONG = function (n) { var out = []; for (var i = 1; i <= n; i++) out.push(h(P.Text, { as: 'p', key: i }, 'Section ' + i + ': the guide goes on, one paragraph after another, until the page is several screens long.')); return out; };
  // a long page in a contained window (a component of its own, so the code shown names it and not the ref inside it)
  var LongPage = function LongPage() {
    var area = React.useRef(null);
    return h('div', { className: 'ds-w05c-window' }, h('div', { ref: area, className: 'ds-w05c-scroll', tabIndex: 0, role: 'region', 'aria-label': 'A long page (scroll it)' },
      h(P.BackToTop, { scrollRef: area }), h(P.Text, { as: 'h1', variant: 'label' }, 'A long guide'), LONG(40)));
  };
  var backToTop = { id: 'back-to-top', lab: true, icon: 'arrow-up', sec: 'actions', sub: 'Common actions', leaf: 'Back to top', title: 'Back to top',
    plenix: 'BackToTop', src: 'components/BackToTop/BackToTop.tsx', level: 'Component', interaction: 'Navigation', statesFrom: ['button'],
    aliases: ['Scroll to top', 'Return to top', 'Go to top'],
    text: 'A button that takes a long page back to its top. The floating form waits at the end of the window’s bottom edge and appears only after the page has scrolled about a screen (an intersection observer on a sentinel, no scroll handlers); the inline form is a labeled ghost button at the end of the content. A press scrolls up (instantly for people who ask for less motion) and moves focus to the top, so keyboard and screen reader users continue from there.',
    use: ['Long pages: documentation, long lists, a long settings page', 'Floating where the header and navigation scroll away; inline at the end of an article'],
    avoid: ['Short pages, or panes with their own short scroll', 'Where a fixed header already holds the way up', 'Any words or icons beyond the arrow and Back to top'],
    related: ['button', 'intersection-observer', 'sticky'],
    map: [[CAR, 'Back to top (pattern)', 'Partial'], [ANT, 'FloatButton.BackTop', 'Direct']],
    variantPages: [
      vp('Floating back to top', 'Variant', 'Floating (default)', { variant: 'floating' }, 'An icon button at the end of the bottom edge, shown after a screen of scrolling.', 'Long pages where the header scrolls away', 'Pages with a floating action button in the same corner'),
      vp('Inline back to top', 'Variant', 'Inline', { variant: 'inline' }, 'A ghost button, Back to top, in the flow at the end of the content.', 'The end of a long article or guide', 'Short content that fits a screen')
    ],
    examples: [['Variant', [
      ['Floating (default)', function () { return h(LongPage); }, 'plx-back-to-top--floating', 'variant="floating"'],
      ['Inline', function () { return row(h(P.BackToTop, { variant: 'inline' })); }, 'plx-back-to-top--inline', 'variant="inline"']], { prop: 'variant' }]] };

  /* ── 09 Overlays › Dialogs › Non-modal dialog, Prompt dialog, Full-screen dialog (Dialog) ── */
  var opener = function (label, make) { var o = use(false), close = function () { o[1](false); }; return row(h(P.Button, { onClick: function () { o[1](true); } }, label), make(o[0], close)); };
  var findReplace = function (open, close) {
    return h(P.Dialog, { open: open, onClose: close, modal: false, size: 'sm', title: 'Find and replace', footer: [h(P.Button, { key: 1, onClick: noop }, 'Replace'), h(P.Button, { key: 2, variant: 'primary', onClick: noop }, 'Find next')] },
      h(P.Stack, { gap: 'sm' }, h(P.Field, { label: 'Find' }, h(P.Input, { defaultValue: 'cross' })), h(P.Field, { label: 'Replace with' }, h(P.Input, { defaultValue: 'Cross' }))));
  };
  var nonModal = { id: 'non-modal-dialog', lab: true, icon: 'text-card', sec: 'overlays', sub: 'Dialogs', leaf: 'Non-modal dialog', title: 'Non-modal dialog',
    plenix: 'Dialog', src: 'components/Dialog/Dialog.tsx', level: 'Component', interaction: 'Overlay',
    aliases: ['Modeless dialog', 'Tool window', 'Floating panel'],
    text: 'A Dialog with modal={false}: the same window in the same place, with no veil, so the page behind stays usable and scrolls. Focus moves in when it opens but is not trapped. F6 moves focus between the dialog and its opener; Escape closes the dialog while focus is inside it. When it closes from inside, focus returns to the opener. aria-modal is not set.',
    use: ['A tool people use together with the page: find and replace, a properties palette', 'A short window that stays open while people keep working'],
    avoid: ['A decision people must make before going on: use a modal Dialog', 'Content about one element: use a Popover', 'Several non-modal dialogs at once'],
    related: ['dialog', 'popover', 'side-drawer'],
    map: [[FLU, 'Dialog (non-modal)', 'Direct'], [MAT, 'Dialogs', 'Partial'], [SPE, 'Dialog', 'Partial']],
    variantPages: [vp('Modeless window', 'Mode', 'Non-modal (show)', { variant: 'non-modal' }, 'The dialog window with no veil: the page behind stays usable.', 'Tools used together with the page', 'Questions that block the task: use a modal dialog')],
    examples: [['Mode (press to open)', [['Non-modal (show)', function () { return opener('Find and replace', findReplace); }, 'plx-modal-layer--non-modal', 'modal={false}']], { prop: 'modal' }]] };

  var promptOf = function (validate) {
    return function () {
      return opener('Rename', function (open, close) {
        return h(P.PromptDialog, { open: open, onCancel: close, onSubmit: close, title: 'Rename asset', message: 'The new name shows on the asset card.', label: 'Name', defaultValue: 'Cross 014', confirmLabel: 'Rename',
          validate: validate });
      });
    };
  };
  var promptDialog = { id: 'prompt-dialog', lab: true, icon: 'rename', sec: 'overlays', sub: 'Dialogs', leaf: 'Prompt dialog', title: 'Prompt dialog',
    plenix: 'PromptDialog', src: 'components/Dialog/Dialog.tsx', level: 'Component', interaction: 'Input', statesFrom: ['field', 'dialog'],
    aliases: ['Input dialog', 'Rename dialog', 'Prompt'],
    text: 'A small dialog that asks for one short value to finish an action. It holds the action as its title, an optional sentence, one labeled field (prefilled when editing, with its text selected) and the action’s verb with Cancel. Enter submits; validate runs on submit, and an error keeps the dialog open with the message under the field. Nothing is disabled, and it never uses the browser’s prompt().',
    use: ['Naming, renaming or labeling something as part of an action', 'A confirm button that repeats the title’s verb (Rename asset · Rename)'],
    avoid: ['More than one or two fields: use a form Dialog, a panel or a page', 'A placeholder in place of the label', 'Disabling the confirm button until the field is valid: show the error on submit'],
    related: ['dialog', 'field', 'confirmation-dialog'],
    map: [[CAR, 'Modal (input)', 'Variant'], [MAT, 'Dialog (with text field)', 'Partial'], [SPE, 'Dialog (form)', 'Partial']],
    variantPages: [
      vp('One-field prompt', 'Content', 'Prompt (one field)', { variant: 'prompt' }, 'The title, a sentence, one labeled field and the verb with Cancel.', 'Rename, name a new item, add a label', 'Several fields: use a form dialog'),
      vp('Prompt with an error', 'Content', 'With an error', { variant: 'prompt-error' }, 'After a submit that failed validation: the message under the field, announced; the dialog stays open.', 'Every prompt that can be wrong (empty, taken, too long)', 'Errors before people have submitted')
    ],
    examples: [['Content (press to open)', [
      ['Prompt (one field)', promptOf(null), null, 'PromptDialog'],
      ['With an error', promptOf(function (v) { return v.trim() && v.trim() !== 'Cross 014' ? '' : 'Enter a new name.'; }), null, 'validate']], { prop: 'validate' }]] };

  var fullScreen = { id: 'full-screen-dialog', lab: true, icon: 'expand', sec: 'overlays', sub: 'Dialogs', leaf: 'Full-screen dialog', title: 'Full-screen dialog',
    plenix: 'Dialog', src: 'components/Dialog/Dialog.tsx', level: 'Component', interaction: 'Overlay',
    aliases: ['Fullscreen modal', 'Takeover', 'Full dialog'],
    text: 'Dialog size="full": the window fills the modal layer, inside the layout inset, for one self-contained task such as editing a large object, while the page stays behind it. It traps focus, locks the page’s scroll and keeps its close button in the header; the task’s actions sit in the footer.',
    use: ['A complex task opened from a list: edit metadata, compose a long text', 'Work that needs the room but should return to the same place in the page'],
    avoid: ['A short question: use a standard size', 'A place people return to often: give it a page', 'Hiding the close button'],
    related: ['dialog', 'layout-full-screen-workspace', 'sheet'],
    map: [[MAT, 'Full-screen dialog', 'Direct'], [SPE, 'Dialog (fullscreen)', 'Variant'], [CAR, 'Modal (large)', 'Partial']],
    variantPages: [vp('Full-screen window', 'Size', 'Full screen', { size: 'full' }, 'The whole modal layer inside the layout inset, with its header and footer bands.', 'A long or complex task', 'Short tasks: a smaller size keeps the page in view')],
    examples: [['Size (press to open)', [['Full screen', function () {
      return opener('Edit metadata', function (open, close) {
        return h(P.Dialog, { open: open, onClose: close, size: 'full', title: 'Edit metadata', footer: [h(P.Button, { key: 1, onClick: close }, 'Cancel'), h(P.Button, { key: 2, variant: 'primary', onClick: close }, 'Save')] },
          h(P.Stack, { gap: 'sm' }, h(P.Field, { label: 'Title' }, h(P.Input, { defaultValue: 'Cross 014' })), h(P.Field, { label: 'Description' }, h(P.Textarea, { defaultValue: 'A processional cross, photographed for the catalog.' }))));
      });
    }, 'plx-dialog--full', 'size="full"']], { prop: 'size' }]] };

  /* ── 09 Overlays › Contextual overlays › Rich tooltip (Tooltip title, action, placement) ── */
  var tipBtn = function (icon, label) { return h(P.Button, { iconOnly: true, icon: icon, label: label }); };
  var richTooltip = { id: 'rich-tooltip', lab: true, icon: 'info-circle', sec: 'overlays', sub: 'Contextual overlays', leaf: 'Rich tooltip', title: 'Rich tooltip',
    plenix: 'Tooltip', src: 'components/Tooltip/Tooltip.tsx', level: 'Component', interaction: 'Overlay',
    aliases: ['Toggletip', 'Info tip', 'Rich hint'],
    text: 'A Tooltip with a title, a few sentences and, as a toggletip, one action. It uses the popover’s surface (the overlay surface with its border, radius and shadow) and no arrow, and wraps at 320px. Without an action, it opens on hover and focus and stays while the pointer is over it; with an action it opens on click (Enter or Space), Tab reaches the action, and Escape or a click outside closes it. It is placed against its trigger and flips to stay in the window.',
    use: ['A term or a setting that needs two or three sentences', 'action for a link to more help (a standalone link, named for where it goes)'],
    avoid: ['A one-word label: use the plain tooltip', 'Steps people need to finish the task', 'An action on hover: with an action it opens on click'],
    related: ['tooltip', 'contextual-help', 'popover'],
    map: [[MAT, 'Rich tooltip', 'Direct'], [CAR, 'Toggletip', 'Partial'], [SPE, 'Contextual help', 'Partial']],
    variantPages: [
      vp('Text-only rich tooltip', 'Content', 'Text only', { variant: 'text' }, 'A few sentences on the popover surface, shown on hover and focus.', 'A short explanation of a control', 'One word: use the plain tooltip'),
      vp('Rich tooltip with a title', 'Content', 'Title and text', { variant: 'title' }, 'A short title over the sentences.', 'A term that needs its name repeated', 'A title that repeats the trigger label word for word'),
      vp('Rich tooltip with an action', 'Content', 'With an action', { variant: 'action' }, 'A toggletip: opened by a click, with one link or button under the text.', 'A link to the help page', 'More than one action: use a Popover'),
      vp('Tooltip below', 'Placement', 'Bottom (default)', { size: 'bottom' }, 'Under the trigger, the arrow pointing up.', 'Most controls', 'Controls at the bottom of the window'),
      vp('Tooltip above', 'Placement', 'Top', { size: 'top' }, 'Over the trigger, the arrow pointing down.', 'Controls near the bottom edge', 'Controls under a header that would cover it'),
      vp('Tooltip at the start', 'Placement', 'Start', { size: 'start' }, 'Before the trigger in the reading direction, the arrow pointing at it.', 'Controls at the end edge', 'Controls at the start edge'),
      vp('Tooltip at the end', 'Placement', 'End', { size: 'end' }, 'After the trigger in the reading direction (a tool rail).', 'Vertical rails of icon buttons', 'Controls at the end edge')
    ],
    examples: [
      ['Content (hover, focus or press the button)', [
        ['Text only', function () { return row(h(P.Tooltip, { rich: true, content: 'Deleted files stay in the trash for 30 days, then they are gone for good.' }, tipBtn('trash', 'Trash'))); }, 'plx-tooltip__bubble--rich', 'rich'],
        ['Title and text', function () { return row(h(P.Tooltip, { title: 'Retention', content: 'Deleted files stay in the trash for 30 days, then they are gone for good.' }, tipBtn('schedule', 'Retention'))); }, null, 'title'],
        ['With an action', function () { return row(h(P.Tooltip, { title: 'Smart crop', content: 'Plenix keeps the subject in frame when it crops for each size.', action: h(P.Link, { href: '#crop', variant: 'standalone' }, 'About smart crop') }, tipBtn('ed-crop', 'Smart crop'))); }, null, 'action']], { prop: 'title' }],
      ['Placement (hover or focus)', [
        ['Bottom (default)', function () { return row(h(P.Tooltip, { content: 'Upload files', placement: 'bottom' }, tipBtn('upload', 'Upload'))); }, 'plx-tooltip__bubble--bottom', 'placement="bottom"'],
        ['Top', function () { return row(h(P.Tooltip, { content: 'Upload files', placement: 'top' }, tipBtn('upload', 'Upload'))); }, 'plx-tooltip__bubble--top', 'placement="top"'],
        ['Start', function () { return row(h(P.Tooltip, { content: 'Upload files', placement: 'start' }, tipBtn('upload', 'Upload'))); }, 'plx-tooltip__bubble--start', 'placement="start"'],
        ['End', function () { return row(h(P.Tooltip, { content: 'Upload files', placement: 'end' }, tipBtn('upload', 'Upload'))); }, 'plx-tooltip__bubble--end', 'placement="end"']], { prop: 'placement' }]] };

  return [commandMenu, commandPalette, download, backToTop, nonModal, promptDialog, fullScreen, richTooltip];
});
