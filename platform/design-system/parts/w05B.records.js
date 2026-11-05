/* Plenix design system · library part w05B (wave 5, lane B): SplitButton (Split button), FloatingActionButton (Floating
   action button), the Menu's context menu, radio items and submenus (Context menu, Radio menu item, and the duplicate
   overlay leaf Context menu), CopyButton (Copy), the print foundation (Print), Details (Details) and Spotlight
   (Spotlight). Every color is an existing role; the beacon and the teaching bubble use the brand blue (owner, 2026-10-13). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var para = function (t) { return h(P.Text, { as: 'p' }, t); };
  var frame = function (child) { return h('div', { 'data-ds-wrap': true, className: 'ds-w05b-frame' }, child); };

  /* ── 04 Actions › Buttons › Split button ── */
  var SAVE = function () { return [h(P.MenuItem, { key: 'd', onSelect: noop }, 'Save as draft'), h(P.MenuItem, { key: 'c', onSelect: noop }, 'Save a copy'), h(P.MenuItem, { key: 't', onSelect: noop }, 'Save as template')]; };
  var split = function (props) { return h(P.SplitButton, Object.assign({ label: 'Save', onClick: noop }, props), SAVE()); };
  var splitButton = { id: 'split-button', lab: true, icon: 'save', sec: 'actions', sub: 'Buttons', leaf: 'Split button', title: 'Split button',
    plenix: 'SplitButton', src: 'components/SplitButton/SplitButton.tsx', level: 'Component', interaction: 'Action', statesFrom: ['button', 'action-menu'],
    aliases: ['Menu button with default', 'Dropdown button', 'Combo button'],
    text: 'One control for the most common action and its close alternatives: a main Button runs the action, and a menu Button (a caret) joined to it opens the related actions in a Menu. Both parts share one variant and size and meet with square corners and a divider. Two Tab stops, each with its own name: the main action, and “More save options”.',
    use: ['One action is clearly the most common and two to five close variants exist (Save, Save as draft, Save a copy)', 'Little room for a row of buttons of the same kind'],
    avoid: ['All actions equally likely: use a menu button (Button with caret and Menu)', 'Unrelated actions behind the caret: they belong in their own buttons or a More menu', 'A main action that changes by itself to the last one chosen'],
    related: ['button', 'action-menu', 'button-group'],
    map: [[CAR, 'Combo button', 'Direct'], [FLU, 'SplitButton', 'Direct'], [ATL, 'Split button', 'Direct'], [ANT, 'Dropdown.Button', 'Direct'], [SPE, 'Action group (split)', 'Partial'], [MAT, 'Split button', 'Direct']],
    variantPages: [
      vp('Secondary split button', 'Variant', 'Secondary (default)', { variant: 'secondary' }, 'The white button joined to its caret; the main button’s end border is the divider.', 'Most split actions in a toolbar or a form', 'The page’s main action: use Primary'),
      vp('Primary split button', 'Variant', 'Primary', { variant: 'primary' }, 'Both parts in the action color; the divider is its pressed step.', 'The one main action of a view, with variants', 'More than one primary split button in a view'),
      vp('Small split button', 'Size', 'Sm', { size: 'sm' }, 'Both parts at the toolbar size.', 'A toolbar or a dense header', 'The page’s main action: keep the standard size'),
      vp('Large split button', 'Size', 'Lg', { size: 'lg' }, 'Both parts at the prominent size.', 'The main action of a page header', 'A toolbar: use Sm'),
      vp('Disabled split button', 'State', 'Disabled', { state: 'disabled' }, 'Both parts disabled together.', 'The action is not available yet: say why near it', 'Hiding an action people expect to find')
    ],
    examples: [
      ['Variant', [['Secondary (default)', function () { return row(split({})); }, 'plx-split-button--secondary', 'variant="secondary"'],
        ['Primary', function () { return row(split({ variant: 'primary', icon: 'upload', label: 'Upload' })); }, 'plx-split-button--primary', 'variant="primary"']], { prop: 'variant' }],
      ['Size', [['Sm', function () { return row(split({ size: 'sm' })); }, null, 'size="sm"'], ['Lg', function () { return row(split({ size: 'lg', variant: 'primary' })); }, null, 'size="lg"']], { prop: 'size' }],
      ['State', [['Disabled', function () { return row(split({ disabled: true })); }, null, 'disabled']]]] };

  /* ── 04 Actions › Buttons › Floating action button ── */
  var fab = function (props) { return h(P.FloatingActionButton, Object.assign({ icon: 'plus', label: 'New asset', placement: 'inline', onClick: noop }, props)); };
  var floatingActionButton = { id: 'floating-action-button', lab: true, icon: 'circle-plus', sec: 'actions', sub: 'Buttons', leaf: 'Floating action button', title: 'Floating action button',
    plenix: 'FloatingActionButton', src: 'components/FloatingActionButton/FloatingActionButton.tsx', level: 'Component', interaction: 'Action',
    aliases: ['FAB', 'Extended FAB', 'Primary floating action'],
    text: 'Holds a screen’s one most important action in a raised square that floats over the content at the window’s bottom end corner and stays in reach while the content scrolls. Sizes: standard (56px), small (40px) or large (96px). Extended adds its label when the icon alone is not clear. Primary uses the action color; secondary, the raised surface. A native button named by its label, it sits in the Tab order where it is written.',
    use: ['The main create or compose action of a mobile-sized or touch screen (New asset, Compose)', 'Extended when the icon alone is not clear', 'Give the scrolling content bottom space (the clearance token) so nothing hides under it'],
    avoid: ['More than one per screen', 'A desktop page with a toolbar: put the action there as a primary Button', 'Minor or destructive actions'],
    related: ['button', 'button-group'],
    map: [[MAT, 'FAB / Extended FAB', 'Direct'], [FLU, 'Floating action button (mobile)', 'Partial'], [CAR, 'Button (floating)', 'Partial']],
    variantPages: [
      vp('Standard floating action button', 'Size', 'Standard (56px, default)', { size: 'md' }, 'The 56px square with a 24px icon.', 'The main action of a screen', 'A dense desktop page: use a primary Button'),
      vp('Small floating action button', 'Size', 'Small (40px)', { size: 'sm' }, 'The 40px square, for a narrow screen or beside other content.', 'The one floating action in a pane’s own corner, where the standard size would cover too much', 'The only floating action: use Standard'),
      vp('Large floating action button', 'Size', 'Large (96px)', { size: 'lg' }, 'The 96px square with a 48px icon: the hero action of a large, empty screen.', 'An empty screen whose one action is to create', 'A screen full of content: it covers too much'),
      vp('Extended floating action button', 'Content', 'Extended (icon and label)', { variant: 'extended' }, 'The icon and its label in a wider button, the same height.', 'An action the icon alone does not explain', 'A phone-sized window where it would cover content: keep it icon-only'),
      vp('Secondary floating action button', 'Variant', 'Secondary', { variant: 'secondary' }, 'The raised surface with its border and the content color.', 'A floating action over a busy, colorful canvas', 'The main action of a plain screen: use Primary')
    ],
    examples: [
      ['Size', [['Standard (56px, default)', function () { return row(fab({})); }, 'plx-floating-action-button--md', 'size="md"'],
        ['Small (40px)', function () { return row(fab({ size: 'sm' })); }, 'plx-floating-action-button--sm', 'size="sm"'],
        ['Large (96px)', function () { return row(fab({ size: 'lg' })); }, 'plx-floating-action-button--lg', 'size="lg"']], { prop: 'size' }],
      ['Content', [['Extended (icon and label)', function () { return row(fab({ icon: 'upload', label: 'Upload', extended: true })); }, 'plx-floating-action-button--extended', 'extended']]],
      ['Variant', [['Primary (default)', function () { return row(fab({})); }, 'plx-floating-action-button--primary', 'variant="primary"'],
        ['Secondary', function () { return row(fab({ variant: 'secondary', icon: 'pencil', label: 'Compose' })); }, 'plx-floating-action-button--secondary', 'variant="secondary"']], { prop: 'variant' }],
      ['Placement', [['Corner (default)', function () { return para('Fixed at the window’s bottom end corner (placement="corner"); the cards above use placement="inline" to stay on this page.'); }, 'plx-floating-action-button--corner', 'placement="corner"'],
        ['Inline', function () { return row(fab({})); }, 'plx-floating-action-button--inline', 'placement="inline"']], { prop: 'placement' }]] };
  floatingActionButton.variantPages.push(
    vp('Primary floating action button', 'Variant', 'Primary (default)', { variant: 'primary' }, 'The action color, darker on hover and press.', 'The main action of a screen', 'A canvas in the action color: use Secondary'),
    vp('Floating action button in the corner', 'Placement', 'Corner (default)', null, 'Fixed over the content at the window’s bottom end corner, inset from its edges by the inset token.', 'A screen-wide action', 'A pane of its own: place it inline in the pane’s corner'),
    vp('Inline floating action button', 'Placement', 'Inline', null, 'In the flow, where its container puts it.', 'A pane or a canvas that has its own corner', 'The window’s corner: use Corner'));

  /* ── 04 Actions › Menus and commands › Context menu: ContextMenu, MenuSub ── */
  var tile = function (label) { return h('div', { tabIndex: 0, className: 'ds-w05b-target', 'aria-label': label + ': right-click, long press or Shift+F10 for its actions' }, label); };
  var ITEMS = function () {
    return [h(P.MenuItem, { key: 'r', icon: 'pencil', onSelect: noop }, 'Rename'), h(P.MenuItem, { key: 'd', icon: 'download-tray', onSelect: noop }, 'Download'),
      h(P.MenuSub, { key: 's', label: 'Move to', icon: 'move' }, h(P.MenuItem, { onSelect: noop }, 'Brand kit'), h(P.MenuItem, { onSelect: noop }, 'Campaigns'), h(P.MenuItem, { onSelect: noop }, 'Archive')),
      h(P.MenuDivider, { key: 'v' }), h(P.MenuItem, { key: 't', icon: 'trash', danger: true, onSelect: noop }, 'Delete')];
  };
  var context = function (label) { return h(P.ContextMenu, { target: tile(label || 'Cross 014'), label: 'Asset actions' }, ITEMS()); };
  var contextMenu = { id: 'context-menu', lab: true, icon: 'menu-lines', sec: 'actions', sub: 'Menus and commands', leaf: 'Context menu', title: 'Context menu',
    plenix: 'ContextMenu, MenuSub', src: 'components/Menu/Menu.tsx', blocks: ['plx-menu-sub', 'plx-context-menu'], level: 'Component', interaction: 'Action', statesFrom: ['action-menu'],
    aliases: ['Right-click menu', 'Long-press menu', 'Shortcut menu', 'Submenu'],
    text: 'The actions of one object, opened where the person is working. It is the same list as an action menu (items, groups, dividers, radio and checkbox items, submenus), in the top layer. A right-click or a long press opens the Menu at the pointer, kept inside the window; Shift+F10 or the Menu key opens it below the object, at its start edge. Focus moves to the first item and returns to the object when it closes. A submenu (MenuSub) opens beside its item with Arrow Right, Enter, a click or hover.',
    use: ['Rows, cards, files and canvases whose actions people reach for while working', 'Act on the selection when several items are selected', 'Submenus for one level of related choices (Move to › a folder)'],
    avoid: ['The only way to an action: every item is also in a toolbar or a More menu', 'Submenus inside submenus', 'Replacing the browser’s menu on text people may want to copy'],
    related: ['action-menu', 'radio-menu-item', 'floating'],
    map: [[CAR, 'Menu (context)', 'Direct'], [SPE, 'Menu (context)', 'Partial'], [FLU, 'Menu (context)', 'Direct'], [MAT, 'Menus (context)', 'Direct'], [ATL, 'Dropdown menu', 'Partial']],
    variantPages: [
      vp('Context menu at the pointer', 'Opening', 'At the pointer (right-click, long press)', { variant: 'context' }, 'The menu opens where the pointer pressed, flipped to stay in the window.', 'Rows, cards and canvases', 'Text people may want to copy: leave the browser’s menu'),
      vp('Context menu from the keyboard', 'Opening', 'At the target (Shift+F10, Menu key)', { variant: 'keyboard' }, 'The menu opens at the focused object’s start edge, below it.', 'Every context menu: the keyboard opens it too', 'An object that cannot take focus: make it focusable first'),
      vp('Submenu', 'Items', 'Submenu (MenuSub)', { variant: 'sub' }, 'An item with an end-pointing chevron opens a second list beside it.', 'One level of related choices: Move to a folder', 'A submenu inside a submenu')
    ],
    examples: [
      ['Opening', [['At the pointer (right-click, long press)', function () { return row(context('Cross 014')); }, null, 'onContextMenu'],
        ['At the target (Shift+F10, Menu key)', function () { return row(context('Border 22')); }, null, 'Shift+F10']]],
      ['Items', [['Submenu (MenuSub)', function () { return row(h(P.Menu, { trigger: h(P.Button, { caret: true }, 'Actions'), label: 'Asset actions' }, ITEMS())); }, ['plx-menu-sub', 'plx-menu-sub__list'], 'MenuSub']]]] };
  var overlaysContext = { id: 'overlays-context-menu', icon: 'menu-lines', sec: 'overlays', sub: 'Overlay surfaces', leaf: 'Context menu', title: 'Context menu',
    plenix: 'ContextMenu', src: 'components/Menu/Menu.tsx', level: 'Component', interaction: 'Overlay', variantClasses: [], docsFrom: 'context-menu',
    aliases: ['Right-click menu', 'Long-press menu'],
    text: 'As an overlay, the context menu is the ContextMenu: the menu’s border-only surface in the top layer, at the pointer or at the focused object. Escape, a choice or a click outside closes it and returns focus to the object.',
    use: ['An object’s actions where the person works (right-click, long press, Shift+F10)'], avoid: ['A surface of your own for a context menu: ContextMenu is the one'],
    related: ['context-menu', 'action-menu'],
    examples: [['A context menu', function () { return row(context('Cross 014')); }]] };

  /* ── 04 Actions › Menus and commands › Radio menu item ── */
  var sortMenu = function () {
    var s = use('date');
    return h(P.Menu, { trigger: h(P.Button, { size: 'sm', caret: true, icon: 'sort' }, 'Sort'), label: 'Sort' },
      h(P.MenuRadioGroup, { label: 'Sort by', value: s[0], onChange: s[1] }, h(P.MenuItem, { value: 'name' }, 'Name'), h(P.MenuItem, { value: 'date' }, 'Date modified'), h(P.MenuItem, { value: 'size' }, 'Size')));
  };
  var radioMenuItem = { id: 'radio-menu-item', icon: 'circle-check', sec: 'actions', sub: 'Menus and commands', leaf: 'Radio menu item', title: 'Radio menu item',
    plenix: 'MenuRadioGroup, MenuItem', src: 'components/Menu/Menu.tsx', level: 'Component', interaction: 'Selection', variantClasses: [], statesFrom: ['action-menu'],
    aliases: ['Menu item radio', 'Exclusive menu item', 'Menu radio group'],
    text: 'One of a set of menu choices where only one is on, such as a sort order or a view. MenuRadioGroup names the set (“Sort by”) and holds the value. Each MenuItem with a value is a menuitemradio; the checked one shows the check of a checkbox item. Choosing one checks it and closes the menu (keepOpen keeps it open).',
    use: ['A sort order, a view or a size chosen from a menu', 'Name the set with the group label', 'Show the current choice in the trigger when there is room (Sort: Date modified)'],
    avoid: ['Several choices that can be on together: use checkbox items (MenuItem checked)', 'A choice that is a form value: use a Select or Radio group'],
    related: ['context-menu', 'action-menu', 'radio-group'],
    map: [[CAR, 'Menu (radio items)', 'Direct'], [FLU, 'MenuItemRadio', 'Direct'], [SPE, 'Menu (single selection)', 'Direct'], [MAT, 'Menus (selection)', 'Partial']],
    examples: [['Sort by', function () { return row(sortMenu()); }, null, 'MenuRadioGroup']] };

  /* ── 04 Actions › Common actions › Copy ── */
  var copyButton = { id: 'copy-button', lab: true, icon: 'ed-copy', sec: 'actions', sub: 'Common actions', leaf: 'Copy', title: 'Copy',
    plenix: 'CopyButton', src: 'components/CopyButton/CopyButton.tsx', level: 'Component', interaction: 'Action', statesFrom: ['button'],
    aliases: ['Copy to clipboard', 'Copy button', 'Clipboard copy'],
    text: 'A Button that copies one value (an ID, a path, a link, a code sample) to the clipboard and confirms in place: for the clipboard feedback duration its icon turns to a check and a visible label to “Copied”, and “Copied” is announced. It is named for what it copies (“Copy ID”). The field form shows the value read-only in the data font, with the button joined at its end.',
    use: ['Right after a value people paste elsewhere: IDs, links, paths, keys, code', 'The field form for a share link or an endpoint people may also read or select', 'A label when the icon alone is not clear in its place'],
    avoid: ['A button named only “Copy”', 'Copying more than the value shown (extra spaces, a hidden prefix)', 'A toast for the confirmation: it shows in place'],
    related: ['clipboard', 'button', 'code-block'],
    map: [[CAR, 'Copy button', 'Direct'], [ATL, 'Copy button (code)', 'Partial'], [POL, 'Clipboard', 'Partial'], [SPE, 'Action button (copy)', 'Partial']],
    variantPages: [
      vp('Copy icon button', 'Form', 'Icon (default)', { variant: 'icon' }, 'A ghost icon button beside the value, named for what it copies.', 'An ID or a path in a row or a header', 'A value with no visible context: add a label'),
      vp('Copy button with label', 'Form', 'With label', { variant: 'label' }, 'The icon and its label (Copy link), the label turning to Copied.', 'A primary copy action: a share link, an invite', 'A dense row: use the icon form'),
      vp('Copy button in a field', 'Form', 'In a field', { variant: 'field' }, 'A read-only field in the data font with Copy joined at its end.', 'A share link or an endpoint people may read or select', 'A value too long to read in one field: use a code block'),
      vp('Copied state', 'State', 'Copied', { state: 'copied' }, 'The check and the word Copied, for the feedback duration, then back to rest.', 'Every copy: confirm it in place', 'A confirmation somewhere else on the page')
    ],
    examples: [
      ['Form', [['Icon (default)', function () { return row(h(P.Text, { variant: 'data' }, 'ASSET-0142'), h(P.CopyButton, { value: 'ASSET-0142', label: 'Copy ID', size: 'xs' })); }, null, 'label="Copy ID"'],
        ['With label', function () { return row(h(P.CopyButton, { value: 'https://plenix.lighthouseway.org/s/8f2c', label: 'Copy link', showLabel: true })); }, null, 'showLabel'],
        ['In a field', function () { return box(400, h(P.CopyButton, { value: 'https://plenix.lighthouseway.org/s/8f2c', label: 'Copy link', fieldLabel: 'Share link', field: true })); }, 'plx-copy-button-field', 'field']]],
      ['State', [['Copied', function () { return para('Press any copy button above: its icon turns to a check (and a label to Copied) for the clipboard feedback duration.'); }, null, 'is-copied']]]] };

  /* ── 04 Actions › Common actions › Print ── */
  var PrintDemo = function () {
    var p = P.usePrint();
    return row(h(P.Button, { onClick: function () { p.print({ title: 'Asset report' }); } }, 'Print'), h(P.Text, { variant: 'secondary' }, 'Prints this page in the light theme, without the header and navigation.'));
  };
  var print = { id: 'print', icon: 'document', sec: 'actions', sub: 'Common actions', leaf: 'Print', title: 'Print',
    plenix: 'usePrint, system/print.css', src: 'hooks/usePrint.ts', css: ['system/print.css'], level: 'Foundation', interaction: 'Static',
    aliases: ['Print stylesheet', 'Print view', 'Print button'],
    text: 'How a page prints. The print stylesheet, system/print.css, leaves the chrome off the paper (the app header, the navigation pane, the skip link, the floating action button, toasts), runs the page to its full length, keeps cards, figures and notices whole, keeps each heading with what follows, and prints external links’ addresses inside plx-print-urls. usePrint opens the print dialog from a person’s action; while the page prints (from the button or the browser’s own Print), it switches the page to the light theme, then restores the theme. Show print and Hide print (ResponsiveVisibility) mark what only the paper shows or leaves out.',
    use: ['A Print button (“Print”, “Print invoice”) that calls usePrint().print, with a title for the paper', 'Show print for the date and source address a printed page needs', 'plx-print-urls around content whose links must be read on paper'],
    avoid: ['A print-only copy of the page: print the page itself', 'Dark pages on paper: usePrint prints the light theme', 'Opening the print dialog without a person’s action'],
    related: ['responsive-visibility', 'button'],
    map: [[CAR, 'Print styles', 'Partial'], [ATL, 'Print', 'Partial'], ['Frappe', 'Print format', 'Direct']],
    variantPages: [
      vp('Print stylesheet', 'Print', 'Print stylesheet', null, 'system/print.css: the chrome off the paper, the full page length, cards kept whole, link addresses inside plx-print-urls.', 'Every page: it applies by itself', 'Styling the paper per page: mark what differs with Show and Hide print'),
      vp('Print only and screen only', 'Print', 'Print only / screen only', null, 'Show print draws content only on paper; Hide print leaves it off the paper.', 'The print date, the source address; actions and navigation off the paper', 'Content the person needs on the screen'),
      vp('Print button', 'Print', 'Print button', null, 'A Button that calls usePrint().print: it prints in the light theme and takes an optional title for the paper.', 'Reports, invoices, boards people print', 'A print action on a page that prints badly: fix the page first')
    ],
    examples: [['Print', [['Print stylesheet', function () { return para('Print this page (Ctrl+P): the header and navigation stay off the paper, and the page prints in the light theme.'); }],
      ['Print only / screen only', function () { return h('div', null, h(P.Show, { print: true }, h(P.Text, { variant: 'data' }, 'Printed 13 October 2026')), para('A date that shows only on paper sits above this line.')); }],
      ['Print button', function () { return h(PrintDemo); }]]]] };

  /* ── 09 Overlays › Disclosure › Details ── */
  var det = function (props, body) { return box(420, h(P.Details, Object.assign({ summary: 'Why do we need your phone number?' }, props), body || para('We text you a code when you sign in from a new device.'))); };
  var details = { id: 'details', lab: true, icon: 'chevron-right', sec: 'overlays', sub: 'Disclosure', leaf: 'Details', title: 'Details',
    plenix: 'Details', src: 'components/Details/Details.tsx', level: 'Component', interaction: 'Disclosure',
    aliases: ['Details and summary', 'Disclosure widget', 'Show details', 'Twisty'],
    text: 'One block of optional detail behind a short summary line, opened in place: the native details and summary elements, styled. The chevron points to the end when closed and down when open. A click, Enter or Space toggles it; assistive technology announces it as expanded or collapsed. Default reads as body text, the detail indented under the label; bordered puts it in a box; inline is small and muted, for a line of text or a message.',
    use: ['Optional detail a few people need: why a field is asked, the technical error, the full log', 'Bordered for detail that should read as one piece (logs, data)', 'Inline under a message: “Show the error”'],
    avoid: ['A section of the page with its own heading: use CollapsibleSection', 'Several that open together as a set: use an Accordion', 'Anything everyone needs to read: keep it on the page'],
    related: ['collapsible-section', 'accordion', 'expandable-section'],
    map: [[CAR, 'Accordion (single)', 'Partial'], [SPE, 'Disclosure', 'Direct'], [ATL, 'Expand', 'Partial'], [FLU, 'Accordion (single)', 'Partial'], [POL, 'Collapsible', 'Partial']],
    variantPages: [
      vp('Default details', 'Variant', 'Default', { variant: 'default' }, 'The chevron and the summary in the body text; the detail indented under the label.', 'Optional detail in a form or a page', 'A section with a heading: use CollapsibleSection'),
      vp('Bordered details', 'Variant', 'Bordered', { variant: 'bordered' }, 'In a box with the border color and the card corner; the summary is a row of the standard height.', 'Logs, technical data, a block that reads as one piece', 'Inside a card that already has a frame'),
      vp('Inline details', 'Variant', 'Inline', { variant: 'inline' }, 'Small and muted, the detail not indented.', 'Under a message or in a line of text: Show the error', 'Detail people often need: show it')
    ],
    examples: [['Variant', [['Default', function () { return det({}); }, 'plx-details--default', 'variant="default"'],
      ['Bordered', function () { return det({ variant: 'bordered', summary: 'Technical details', defaultOpen: true }, h(P.Text, { as: 'p', variant: 'data' }, 'HTTP 503 · upload-07 · 2026-10-13 14:02')); }, 'plx-details--bordered', 'variant="bordered"'],
      ['Inline', function () { return det({ variant: 'inline', summary: 'Show the error' }, h(P.Text, { as: 'p', variant: 'data' }, 'The server did not answer in 30 s.')); }, 'plx-details--inline', 'variant="inline"']], { prop: 'variant' }]] };

  /* ── 10 Patterns › Onboarding and education › Spotlight ── */
  var SpotDemo = function (props) {
    var ref = React.useRef(null), o = use(false);
    return frame([h(P.Button, { key: 'b', ref: ref, icon: 'filter', onClick: function () { o[1](!o[0]); } }, o[0] ? 'Turn the spotlight off' : 'Turn the spotlight on'),
      h(P.Text, { key: 't', as: 'p', variant: 'secondary' }, 'The rest of this frame is dimmed while the button stays bright and usable.'),
      h(P.Spotlight, Object.assign({ key: 's', target: ref, open: o[0], contained: true }, props))]);
  };
  var BubbleDemo = function () {
    var o = use(false);
    return row(h(P.TeachingBubble, { target: h(P.Button, { icon: 'filter', onClick: function () { o[1](!o[0]); } }, 'Filters'), open: o[0], onDismiss: function () { o[1](false); },
      title: 'Saved filters', primaryAction: { label: 'Got it', onClick: function () { o[1](false); } } }, 'Save a set of filters and open it from here next time.'));
  };
  var spotlight = { id: 'spotlight', lab: true, icon: 'sparkle', sec: 'patterns', sub: 'Onboarding and education', leaf: 'Spotlight', title: 'Spotlight',
    plenix: 'Spotlight', src: 'components/Spotlight/Spotlight.tsx', level: 'Component', interaction: 'Overlay',
    aliases: ['Spotlight tour', 'Focus highlight', 'Hotspot', 'Beacon', 'Coach mark overlay'],
    text: 'Draws the eye to one element. The cut-out dims the rest of the window in the scrim role while the element stays bright and usable; the beacon marks it with a pulsing dot in the brand blue and dims nothing. The dim is four panels around the target, placed by CSS anchor positioning, so they follow it on scroll and resize. The target is never covered, a press on the dim does nothing, and focus is not trapped. It is decoration, hidden from assistive technology: the explanation is the TeachingBubble or dialog above it. TeachingBubble turns it on for its target by default.',
    use: ['With a TeachingBubble (its default) to introduce one feature', 'One step of a product tour, the next step moving it to the next element', 'The beacon to invite a press on something new without interrupting'],
    avoid: ['Errors or anything people must do to finish a task', 'More than one at a time', 'A spotlight without an explanation above it'],
    related: ['teaching-bubble', 'patterns-coach-mark', 'scrim'],
    map: [[ATL, 'Spotlight', 'Direct'], [SPE, 'Coach mark (with spotlight)', 'Partial'], [FLU, 'TeachingPopover (with highlight)', 'Partial'], [ANT, 'Tour (mask)', 'Direct']],
    variantPages: [
      vp('Spotlight cut-out', 'Variant', 'Element cut-out (default)', { variant: 'cutout' }, 'Everything but the target dimmed in the scrim role; the target bright and usable.', 'Introducing one element with a bubble or a tour step', 'An element people must use to finish a task: never block around it'),
      vp('Spotlight with a teaching bubble', 'Variant', 'With TeachingBubble', { variant: 'bubble' }, 'A TeachingBubble on the brand blue at the target, the spotlight around it (the bubble’s default).', 'Introducing a new or easily missed feature once', 'Showing it again after it was dismissed'),
      vp('Pulse beacon', 'Variant', 'Pulse beacon', { variant: 'beacon' }, 'A pulsing dot in the brand blue on the target’s top end corner; nothing dimmed.', 'Inviting a press on something new without interrupting work', 'Several beacons on one screen')
    ],
    examples: [['Variant', [['Element cut-out (default)', function () { return h(SpotDemo, {}); }, 'plx-spotlight--cutout', 'variant="cutout"'],
      ['With TeachingBubble', function () { return h(BubbleDemo); }, null, 'TeachingBubble spotlight'],
      ['Pulse beacon', function () { return h(SpotDemo, { variant: 'beacon' }); }, 'plx-spotlight--beacon', 'variant="beacon"']], { prop: 'variant' }],
      ['Region', [['Contained', function () { return h(SpotDemo, {}); }, 'plx-spotlight--contained', 'contained']]]] };
  spotlight.variantPages.push(vp('Contained spotlight', 'Region', 'Contained', null, 'The cut-out over its nearest positioned parent instead of the window.', 'A demo, or one region of a page', 'A tour step: light the element in the whole window'));

  return [splitButton, floatingActionButton, contextMenu, overlaysContext, radioMenuItem, copyButton, print, details, spotlight];
});
