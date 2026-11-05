/* Plenix design system · library part w03A (wave 3, lane A): iconography and the shell's arrangements. IconTile (the
   Icon tile page), Pictogram (Pictograms), Preview's ratios and fits (the Aspect ratio page, on Preview's own code), the
   one-column and full-screen arrangements the shell already draws (AppShell page kinds) and responsive visibility (Show /
   Hide, beside the breakpoint utility in AppShell.tsx: the Hide / show page). The shell's other arrangements and regions
   are answered in part w00A. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, eachV = H.eachV, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { var o = { leaf: leaf, group: group, name: name, text: text, use: [use1], avoid: [avoid1] }; if (lab) o.lab = lab; return o; };
  var row = function (kids) { return h('div', { className: 'ds-w03a-row' }, kids); };

  /* ── icon tiles ── */
  var HUES = [['gray', 'Gray (default)', 'folder', 'Folders and items with no kind of their own'], ['blue', 'Blue', 'briefcase', 'Projects'], ['green', 'Green', 'circle-check', 'Tasks'],
    ['purple', 'Purple', 'sparkle', 'Ideas and suggestions'], ['red', 'Red', 'flag', 'Issues'], ['brown', 'Brown', 'archive', 'Archives'], ['surface', 'Surface', 'doc-text', 'Pages on a tinted header']];
  var TONES = [['neutral', 'Neutral', 'info-circle'], ['info', 'Info', 'circle-info'], ['success', 'Success', 'circle-check'], ['warning', 'Warning', 'warning'], ['danger', 'Danger', 'alert']];
  var TSIZES = [['sm', 'SM (32px)', 'sm'], ['md', 'MD (40px, default)', 'md'], ['lg', 'LG (48px)', 'lg']];
  var tile = function (p) { return h(P.IconTile, p); };
  var listRow = function (icon, hue, name, meta) {
    return h('div', { className: 'ds-w03a-list-row' }, tile({ icon: icon, hue: hue, size: 'md' }),
      h('div', { className: 'ds-w03a-list-row__text' }, h(P.Text, { variant: 'label' }, name), h(P.Text, { variant: 'secondary' }, meta)));
  };

  /* ── pictograms ── */
  var PSIZES = [['48', '48', 'upload'], ['64', '64 (default)', 'folder-open'], ['96', '96', 'search']];

  /* ── the aspect-ratio scale on Preview ── */
  var RATIOS = [['4-3', '4:3 (default)'], ['1-1', '1:1'], ['3-2', '3:2'], ['16-9', '16:9'], ['21-9', '21:9'], ['3-4', '3:4 (portrait)'], ['9-16', '9:16 (portrait)']];
  var ratioBox = function (r) { return h(P.Preview, { ratio: r[0] }, h(P.Icon, { name: 'image-b', size: 'lg' }), h(P.Text, { variant: 'data' }, r[1].replace(/ \(.*\)/, ''))); };
  var PICTURE = function () { return PlenixSource.at('brand/plenix-logo-horizontal.svg'); };   // read when drawn (plenix-source.js)
  var fitted = function (fit) { return h(P.Preview, { ratio: '1-1', fit: fit }, h('img', { className: 'plx-preview__media', src: PICTURE(), alt: 'The Plenix logo' })); };

  /* ── the shell's arrangements: a small page drawn with the Platform's parts ── */
  var MiniPage = function (p) {
    return h('div', { className: 'ds-w03a-page' + (p.focus ? ' ds-w03a-page--focus' : '') },
      h('div', { className: 'ds-w03a-page__header' }, h(P.Text, { variant: 'label' }, p.focus ? 'Image editor' : 'Notes')),
      h('div', { className: 'ds-w03a-page__body' },
        p.focus ? null : h('div', { className: 'ds-w03a-page__nav' }, h(P.Icon, { name: 'home', size: 'sm' }), h(P.Icon, { name: 'folder', size: 'sm' }), h(P.Icon, { name: 'settings-general', size: 'sm' })),
        h('div', { className: 'ds-w03a-page__main' + (p.focus ? ' ds-w03a-page__main--canvas' : '') }, p.focus
          ? h(P.Icon, { name: 'ed-image', size: 'xl' })
          : h('div', { className: 'ds-w03a-page__column' }, h(P.Text, { variant: 'label' }, 'New note'),
            h(P.Field, { label: 'Title' }, h(P.Input, { defaultValue: 'Site visit, 14 October' })),
            h(P.Field, { label: 'Folder' }, h(P.Input, { defaultValue: 'Kitchen remodel' }))))),
      h('div', { className: 'ds-w03a-page__footer' }, h(P.Text, { variant: 'data' }, p.focus ? '1920 × 1080' : 'Saved 10:24 AM')));
  };
  var code = function (title, text) { return box(480, h(P.CodeBlock, { title: title, copy: false }, text)); };

  /* ── responsive visibility: what each rule draws in this window, and its fallback where it draws nothing ── */
  var shown = function (text) { return h(P.Badge, { tone: 'success' }, text); };
  var gone = function (text) { return h(P.Text, { variant: 'secondary' }, text); };
  var VIS = [
    ['Show above', 'Show above="medium"', function () { return h(P.Show, { above: 'medium', fallback: gone('Not drawn: this window is Narrow') }, shown('Drawn at Medium and Wide')); }],
    ['Show below', 'Show below="wide"', function () { return h(P.Show, { below: 'wide', fallback: gone('Not drawn: this window is Wide') }, shown('Drawn at Narrow and Medium')); }],
    ['Hide above', 'Hide above="wide"', function () { return h(P.Hide, { above: 'wide', fallback: gone('Not drawn: this window is Wide (the fallback stands in)') }, shown('Drawn at Narrow and Medium')); }],
    ['Hide below', 'Hide below="medium"', function () { return h(P.Hide, { below: 'medium', fallback: gone('Not drawn: this window is Narrow') }, shown('Drawn at Medium and Wide')); }]
  ];

  return [
    /* ── 01 Foundations › Iconography ── */
    { id: 'icon-tile', lab: true, sec: 'foundations', sub: 'Iconography', leaf: 'Icon tile', plenix: 'IconTile', src: 'components/IconTile/IconTile.tsx', level: 'Component', interaction: 'Static', icon: 'cards-small',
      aliases: ['Icon tile', 'Object icon', 'Type icon', 'App tile', 'Category marker'],
      text: 'An icon centered on a tinted, rounded square with a thin border: the marker of an object type, a category or an integration beside its name. The size sets the tile and the icon together (32, 40 or 48px); a hue (a data color) or a status tone sets its colors.',
      use: ['The kind of each item in a list, a card or a header, next to its name', 'hue for kinds and categories (blue projects, green tasks); tone for a status the item is in', 'One size per list: sm in dense rows, md (default) in lists and cards, lg in a page header', 'filled for the selected or the current kind, as the icon set does'],
      avoid: ['An action: use an icon Button', 'Letters, initials or numbers in the tile: use an Avatar for people', 'A color outside the hues and tones', 'A tile without a visible name next to it, unless label names it'],
      related: ['icon', 'avatar', 'record-page', 'pictogram'],
      map: [[ATL, 'Icon tile', 'Direct'], [FLU, 'Avatar (icon)', 'Partial'], [MAT, 'Icons (contained)', 'Partial'], [POL, 'Icon (with background)', 'Partial']],
      variantPages: HUES.map(function (x) { return vp('Icon tile in ' + x[1].replace(' (default)', '').toLowerCase(), 'Hue', x[1], { variant: x[0] },
        x[0] === 'surface' ? 'A tile on the page surface with the icon in the link blue, for a tinted header where a colored tile would clash.' : 'A tile in the soft ' + x[0] + ' data color with its icon in the on-soft ' + x[0] + '.',
        x[3], 'A status: use a tone'); })
        .concat(TONES.map(function (x) { return vp(x[1] + ' icon tile', 'Tone', x[1], { variant: x[0] }, 'A tile in the soft ' + x[0] + ' feedback color, its border and its icon in the ' + x[0] + ' content color; it follows the theme.', 'An item whose status is ' + x[0], 'The kind of an item: use a hue'); }))
        .concat(TSIZES.map(function (x) { return vp(x[1].replace(/ \(.*$/, '') + ' icon tile', 'Size', x[1], { size: x[0] }, x[0] === 'sm' ? 'A 32px tile with a 16px icon and 6px corners.' : x[0] === 'md' ? 'A 40px tile with a 20px icon and 8px corners: the default.' : 'A 48px tile with a 24px icon and 8px corners, as in EntityHeader.',
          x[0] === 'sm' ? 'Dense rows and table cells' : x[0] === 'md' ? 'Lists and cards' : 'Page and entity headers', x[0] === 'lg' ? 'Rows of a list: use md' : 'A page header: use lg'); }))
        .concat([vp('Icon tile with a filled icon', 'Icon', 'Filled', { content: 'filled' }, 'The filled version of the icon on the tile.', 'The selected or current kind in a list of kinds', 'Every tile of a list: keep them outline')]),
      examples: [['Hue', eachV(HUES, function (x) { return x[1]; }, function (x) { return tile({ icon: x[2], hue: x[0] }); }, function (x) { return 'plx-icon-tile--' + x[0]; }, function (x) { return 'hue=' + q(x[0]); }), { prop: 'hue' }],
        ['Tone', eachV(TONES, function (x) { return x[1]; }, function (x) { return tile({ icon: x[2], tone: x[0] }); }, function (x) { return 'plx-icon-tile--' + x[0]; }, function (x) { return 'tone=' + q(x[0]); }), { prop: 'tone' }],
        ['Size', eachV(TSIZES, function (x) { return x[1]; }, function (x) { return tile({ icon: 'briefcase', hue: 'blue', size: x[0] }); }, function (x) { return 'plx-icon-tile--' + x[0]; }, function (x) { return 'size=' + q(x[0]); }), { prop: 'size' }],
        ['Icon', [['Filled', function () { return tile({ icon: 'folder', hue: 'brown', filled: true }); }, null, 'filled']]],
        ['In a list', function () { return box(320, h('div', { className: 'ds-w03a-list' }, listRow('briefcase', 'blue', 'Kitchen remodel', 'Project'), listRow('circle-check', 'green', 'Order the samples', 'Task'), listRow('archive', 'brown', '2025 photos', 'Archive'))); }]] },
    { id: 'pictogram', lab: true, sec: 'foundations', sub: 'Iconography', leaf: 'Pictograms', title: 'Pictogram', plenix: 'Pictogram', src: 'components/Pictogram/Pictogram.tsx', level: 'Component', interaction: 'Static', icon: 'image-b',
      aliases: ['Pictograms', 'Spot icon', 'Spot illustration', 'Large icon', 'Concept icon'],
      text: 'A large symbol for a concept in a round frame: the picture of an empty state, a feature card or an onboarding step. The symbols are the icon set’s own (Material Symbols, drawn for 24px and up, never edited) at 48, 64 or 96px: the outline on the sunken surface, or two-tone (the filled symbol on a blue tint).',
      use: ['Empty states, feature cards and onboarding steps that need a picture but not an illustration', 'One size and one tone per view, always next to a heading that names the concept', '64 (default) in an empty state, 48 in a card, 96 for a page with nothing else on it', 'twoTone where the pictogram should draw the eye (the first step, a feature to try)'],
      avoid: ['A button or an inline action icon: use an icon Button or an Icon', 'Mixing pictograms and illustrations in one view', 'Text or numbers inside the frame', 'A symbol drawn for this use: pictograms come from the icon set'],
      related: ['icon', 'empty-state', 'icon-tile'],
      map: [[CAR, 'Pictograms', 'Direct'], [SPE, 'Illustrations (spot)', 'Partial'], [ATL, 'Spot illustrations', 'Partial'], [MAT, 'Icons (large)', 'Partial']],
      variantPages: PSIZES.map(function (x) { return vp(x[0] + 'px pictogram', 'Size', x[1], { size: x[0] }, 'A ' + x[0] + 'px round frame with a ' + ({ 48: '32', 64: '40', 96: '64' })[x[0]] + 'px symbol.',
        x[0] === '48' ? 'Feature cards and small empty states in a panel' : x[0] === '64' ? 'Empty states and onboarding steps' : 'A page with nothing else on it (a first run)', x[0] === '96' ? 'A panel or a card: it crowds them' : 'A whole empty page: use 96'); })
        .concat([vp('Outline pictogram', 'Tone', 'Outline (default)', { variant: 'outline' }, 'The outline symbol in the muted color on the sunken surface.', 'Most empty states and cards', 'The one place the eye should go first: use two-tone'),
          vp('Two-tone pictogram', 'Tone', 'Two-tone (filled + tint)', { variant: 'two-tone' }, 'The filled symbol in the blue on-soft color on the soft blue tint.', 'The first step of an onboarding, a feature to try', 'Every pictogram of a view: one stands out, the rest stay outline')]),
      examples: [['Size', eachV(PSIZES, function (x) { return x[1]; }, function (x) { return h(P.Pictogram, { icon: x[2], size: x[0] }); }, function (x) { return 'plx-pictogram--' + x[0]; }, function (x) { return 'size=' + q(x[0]); }), { prop: 'size' }],
        ['Tone', [['Outline (default)', function () { return h(P.Pictogram, { icon: 'folder-open' }); }, null, 'twoTone={false}'],
          ['Two-tone (filled + tint)', function () { return h(P.Pictogram, { icon: 'folder-open', twoTone: true }); }, 'plx-pictogram--two-tone', 'twoTone']], { prop: 'twoTone' }],
        ['In an empty state', function () { return box(320, h('div', { className: 'ds-w03a-empty' }, h(P.Pictogram, { icon: 'upload', twoTone: true }), h(P.Text, { variant: 'label' }, 'No files yet'), h(P.Text, { variant: 'secondary' }, 'Drop photos and drawings here, or upload them from your computer.'))); }]] },

    /* ── 02 Layout & Composition › Layout primitives ── */
    { id: 'aspect-ratio', lab: true, sec: 'layout', sub: 'Layout primitives', leaf: 'Aspect ratio', plenix: 'Preview', src: 'components/Preview/Preview.tsx', level: 'Component', interaction: 'Static', icon: 'ed-crop',
      blocks: ['plx-preview'], variantClasses: ['plx-preview--cover', 'plx-preview--contain'],
      aliases: ['Ratio box', 'Media frame', 'Fixed ratio', 'Object fit'],
      text: 'A frame that keeps a ratio from the aspect-ratio scale as its width changes (Preview ratio: 1:1, 4:3, 3:2, 16:9, 21:9 and the portrait 3:4 and 9:16). It keeps the space before the picture loads, and the picture fills it cropped (cover) or whole (contain), never stretched.',
      use: ['Previews, thumbnails and media cards: Preview with ratio', 'One ratio per grid, so the rows line up', 'fit="cover" for photos where cropping the edge loses nothing', 'fit="contain" for logos, drawings and documents that must show whole'],
      avoid: ['Text containers that must grow with their content', 'A ratio outside the scale: add it to the scale (a token) first', 'Stretching a picture to fill a frame', 'Cover for a picture whose edge carries the meaning'],
      related: ['aspect-ratio-scale', 'preview', 'media-card', 'thumbnail'],
      map: [[CAR, 'AspectRatio', 'Partial'], [POL, 'Aspect ratio (MediaCard / Thumbnail)', 'Partial'], [MAT, 'Image aspect ratios', 'Partial'], [SPE, 'Image (objectFit)', 'Partial']],
      variantPages: RATIOS.map(function (x) { return vp(x[1].replace(/ \(.*\)/, '') + ' preview', 'Ratio', x[1], { size: x[0] }, 'A Preview frame at ' + x[1].replace(/ \(.*\)/, '') + ' (--plx-ref-ratio-' + x[0] + ').',
        { '4-3': 'Previews and asset cards (the default)', '1-1': 'Avatars, icon tiles and square grids', '3-2': 'Photographs as cameras take them', '16-9': 'Video and screen captures', '21-9': 'Wide banners and panoramas', '3-4': 'Portrait photos and documents', '9-16': 'Phone screens and stories' }[x[0]],
        'Mixing it with other ratios in one grid'); })
        .concat([vp('Cover fit', 'Fit', 'Cover', { content: 'cover' }, 'The picture fills the frame and is cropped to it.', 'Photos, where the edges carry nothing essential', 'Logos and documents: use contain'),
          vp('Contain fit', 'Fit', 'Contain', { content: 'contain' }, 'The whole picture shows inside the frame, with the sunken surface around it.', 'Logos, drawings, documents and anything that must show whole', 'A grid of photos that should look full: use cover')]),
      examples: [['Ratio', eachV(RATIOS, function (x) { return x[1]; }, function (x) { return box(x[0] === '9-16' || x[0] === '3-4' ? 120 : 200, ratioBox(x)); }, function () { return null; }, function (x) { return 'ratio=' + q(x[0]); }), { prop: 'ratio' }],
        ['Fit', [['Cover', function () { return box(160, fitted('cover')); }, 'plx-preview--cover', 'fit="cover"'], ['Contain', function () { return box(160, fitted('contain')); }, 'plx-preview--contain', 'fit="contain"']], { prop: 'fit' }],
        ['One ratio per grid', function () { return h('div', { className: 'ds-w03a-ratio-grid' }, [1, 2, 3, 4].map(function (n) { return h(P.Preview, { key: n, ratio: '3-2' }, h(P.Text, { variant: 'data' }, 'IMG_00' + n + '.jpg')); })); }]] },

    /* ── 02 Layout & Composition › Layout arrangements ── */
    { id: 'one-column-layout', sec: 'layout', sub: 'Layout arrangements', leaf: 'One-column layout', plenix: 'AppShell page="form" | "settings"', src: 'patterns/AppShell/AppShell.tsx', css: ['patterns/AppShell/app-shell.css', 'system/layout-modes.css'], variantClasses: [],
      level: 'Page structure', interaction: 'Static', icon: 'view-table',
      aliases: ['Single column', 'Contained layout', 'Centered column', 'Form page', 'Single-pane workspace'],
      text: 'The contained layout mode: one column of content at the form width (960px), centered in the main region, with the header and footer across the full width. An application names the kind of page (page="form" or "settings", or SettingsLayout claims it), and the layout standard (providers/pageLayouts.js) gives it this mode. At Narrow every layout is one column.',
      use: ['Forms that create or edit one thing, settings and single-task pages: AppShell page="form" or "settings"', 'Sections stacked down the column, each opening with a heading', 'The navigation pane beside it as on any page: the column centers in what is left'],
      avoid: ['Lists, grids and tables people compare side by side: use the fluid workspace (the default)', 'A column stretched across a wide window, or a max width set by hand', 'Setting the layout mode in the application: name the kind of page'],
      related: ['application-shell', 'layout-full-screen-workspace', 'breakpoints'],
      map: [[POL, 'Page (narrowWidth)', 'Partial'], [CAR, 'Grid (narrow)', 'Partial'], [MAT, 'Layout: single pane', 'Partial'], [ATL, 'Page layout (fixed width)', 'Partial']],
      wire: { areas: ['a a a', '. b .', 'c c c'], cols: '1fr 3fr 1fr', rows: [36, 180, 28], regions: [['A', 'App header', 'AppHeader', 'Across the full width'], ['B', 'The column', 'PageContent', 'At most 960px wide, centered; sections stack down it'], ['C', 'Status footer', 'StatusBar', 'Across the full width']] },
      examples: [['Arrangement', [['Contained (one column)', function () { return box(560, h(MiniPage)); }, null, 'page="form"']]],
        ['Code', [['The kind of page', function () { return code('NotePage.jsx', '<AppShell page="form" header={<AppHeader … />} sideNav={<NavPane … />} footer={<StatusBar … />}>\n  <PageContent>…</PageContent>   // one column, 960px, centered\n</AppShell>'); }, null, 'page="form" | "settings"']]]], also: [], covers: ['page-structures/Single-pane workspace'] },
    { id: 'layout-full-screen-workspace', sec: 'layout', sub: 'Layout arrangements', leaf: 'Full-screen workspace', plenix: 'AppShell page="editor", FullScreenWorkspace, FullScreenExperience', src: 'patterns/AppShell/AppShell.tsx', css: ['patterns/AppShell/app-shell.css', 'system/layout-modes.css'], variantClasses: [],
      level: 'Page structure', interaction: 'Static', icon: 'expand',
      aliases: ['Focus layout', 'Full screen', 'Editor layout', 'Immersive workspace'],
      text: 'The focus layout mode gives one task the whole main region: it hides the navigation pane and the inspector, and keeps the header (with the way back) and the footer. An application names the page an editor (AppShell page="editor"), and the layout standard gives it this mode. The page structure of the same name lays out its tools and canvas.',
      use: ['Editors and viewers people enter on purpose to work on one item (the image editor)', 'A visible way back in the header, and Escape where nothing else uses it', 'Tools and options inside the main region (ToolRail, a Panel), not in the shell’s panes'],
      avoid: ['A task that fits in a dialog or a panel', 'Removing the header: the way out must stay', 'Leaving with unsaved changes without asking'],
      related: ['application-shell', 'one-column-layout'],
      map: [[MAT, 'Full-screen dialogs / immersive', 'Partial'], [SPE, 'Fullscreen', 'Partial'], [FLU, 'Full screen', 'Partial']],
      wire: { areas: ['a', 'b', 'c'], cols: '1fr', rows: [36, 200, 28], regions: [['A', 'App header', 'AppHeader', 'The title and the way back'], ['B', 'The workspace', '', 'All the room: no navigation pane, no inspector'], ['C', 'Status footer', 'StatusBar', 'Facts about the item']] },
      examples: [['Arrangement', [['Focus (full screen)', function () { return box(560, h(MiniPage, { focus: true })); }, null, 'page="editor"']]],
        ['Code', [['The kind of page', function () { return code('ImageEditorPage.jsx', '<AppShell page="editor" header={<AppHeader … />} footer={<StatusBar … />}>\n  <ImageEditor … />   // the navigation pane and the inspector are hidden\n</AppShell>'); }, null, 'page="editor"']]]], variantPages: [{ leaf: 'Full-screen experience', group: 'Page', name: 'Full screen', text: 'The task takes the whole window: the header and panes step aside, and Close returns.', use: ['Focused work that needs all the space, such as editing an image or reading a document'], avoid: ['Ordinary pages and forms'] }], cssAlso: true, also: ['templates/templates/Templates.jsx'], content: { labels: 'The item’s name as the title; the way out says “Close” or names the page it returns to.', actions: 'Save and Close in the header; the tools in the workspace.', errors: 'Not applicable.', localization: 'The arrangement mirrors in right-to-left pages. Pass strings and localized application content.' }, a11y: { name: 'The header title names the item being worked on; give every landmark, control and field a meaningful name.', announce: 'The page title when it opens.', focus: 'A way back is always reachable by keyboard.', contrast: 'Not applicable.', motion: 'Nothing to reduce.' }, behavior: { pointer: 'Not applicable: the workspace’s own tools carry the interaction.', keyboard: 'Escape leaves where the workspace does not use it; the header’s way back is always a Tab stop.', focus: 'Controls retain existing focus behavior; route changes are owned by the application.', responsive: 'The navigation pane and the inspector are hidden at every width; the workspace arranges its own tools.', motion: 'None of its own.', loading: 'The workspace shows its item’s loading.', error: 'Leaving with unsaved changes asks first.' }, anatomy: ['App header — the item’s title and the way back (required)', 'Workspace — the main region with all the room: the canvas, its tools and options (required)', 'Status footer — facts about the item (optional)', 'Application handlers — data, navigation and persistence stay with the application'], covers: ['page-structures/Full-screen workspace', 'Full-screen experience'] },

    /* ── 02 Layout & Composition › Responsive composition ── */
    { id: 'hide-show', sec: 'layout', sub: 'Responsive composition', leaf: 'Hide / show', title: 'Hide / show', plenix: 'Show, Hide', src: 'patterns/AppShell/AppShell.tsx', css: ['patterns/AppShell/app-shell.css'], blocks: ['plx-visibility'],
      level: 'Utility', interaction: 'Static', icon: 'visibility',
      aliases: ['Responsive visibility', 'Show', 'Hide', 'Visible from', 'Hidden below', 'Print only'],
      text: 'Show and Hide draw their children only in some window classes (from the breakpoint tokens: medium 600px, wide 840px, inspector 1024px) or only on paper. Hidden by width means not rendered: it leaves the page, the Tab order and the accessibility tree. fallback draws in its place instead.',
      use: ['Secondary details (sizes, dates, a second line) that Narrow windows cannot fit: Show above="medium"', 'A control that moves elsewhere at a width: Hide below="medium" with fallback (the same action in a menu)', 'Show print for what only paper needs (the date printed, the source); Hide print for actions and navigation'],
      avoid: ['Hiding what people need to finish a task: move it (a menu, the detail view) instead', 'Hiding with CSS so it stays focusable', 'A breakpoint written as a number: name it, or pass a breakpoint token', 'Shortening labels at small widths so their meaning changes'],
      related: ['breakpoints', 'application-shell'],
      map: [[MAT, 'Adaptive design (show / hide)', 'Partial'], [CAR, 'Hide at breakpoints', 'Partial'], [POL, 'Hide (Box visibility)', 'Partial'], [ATL, 'Show / Hide (primitives)', 'Direct']],
      variantPages: VIS.map(function (v) { return vp(v[0], 'Breakpoint', v[0], null,
        { 'Show above': 'Drawn from the breakpoint up: at Medium and Wide for above="medium".', 'Show below': 'Drawn only under the breakpoint: at Narrow and Medium for below="wide".', 'Hide above': 'Not drawn from the breakpoint up; its fallback stands in there.', 'Hide below': 'Not drawn under the breakpoint: at Narrow for below="medium".' }[v[0]],
        { 'Show above': 'Secondary details wide windows have room for', 'Show below': 'A compact control that replaces a wide one', 'Hide above': 'A menu button that a wide toolbar makes unnecessary', 'Hide below': 'A toolbar that Narrow windows move into a menu' }[v[0]],
        'Content that is needed at every width'); })
        .concat([vp('Print only', 'Print', 'Print only', null, 'Drawn only on paper: hidden on the screen, there when the page is printed.', 'The print date, the source address, a signature line', 'Anything people need on the screen'),
          vp('Not printed', 'Print', 'Not printed', null, 'Drawn on the screen, left off the paper.', 'Actions, navigation and controls that mean nothing on paper', 'Content the printed page needs')]),
      examples: [['Breakpoint', VIS.map(function (v) { return [v[0], function () { return v[2](); }, null, v[1]]; }), { prop: 'above, below' }],
        ['Print', [['Print only', function () { return h('div', null, h(P.Show, { print: true }, h(P.Text, { variant: 'data' }, 'Printed 12 October 2026')), gone('Shows only on paper (print this page to see it)')); }, 'plx-visibility--print-only', 'print (Show)'],
          ['Not printed', function () { return h(P.Hide, { print: true }, h(P.Button, null, 'Share')); }, 'plx-visibility--no-print', 'print (Hide)']], { prop: 'print' }]] }
  ];
});
