/* Plenix design system · library part w03C (wave 3, lane C): theme zones (ThemeZone, providers/ThemeProvider.tsx),
   ContentGrid’s masonry and justified rows (the Masonry layout page), Columns’ collapse below a window class and
   sidebar ratios (the Collapse page), Image (which also answers Responsive image as its variant page) and Figure. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, eachV = H.eachV, q = H.q, row = H.row;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };

  /* ── theme zones: one small composition drawn in a mode ── */
  var Sample = function () {
    return h(P.Stack, { gap: 'sm' },
      h(P.Text, { variant: 'heading' }, 'Kitchen remodel'),
      h(P.Text, { variant: 'secondary' }, 'Shared with the Ruiz family'),
      h(P.Field, { label: 'Client' }, h(P.Input, { defaultValue: 'Ruiz family' })),
      h(P.Inline, { gap: 'sm' }, h(P.Badge, { tone: 'success' }, 'Active'), h(P.Badge, { tone: 'warning' }, 'Due soon')),
      h(P.Inline, { gap: 'sm' }, h(P.Button, { variant: 'primary' }, 'Share'), h(P.Button, null, 'Cancel')));
  };
  var zone = function (props, child) { return h(P.ThemeZone, Object.assign({ className: 'ds-w03c-zone' }, props), child || h(Sample)); };

  /* ── pictures of mixed ratios for the masonry and justified rows ── */
  var MIXED = [['10', '3-4'], ['21', '1-1'], ['12', '4-3'], ['14', '16-9'], ['23', '3-4'], ['16', '4-3'], ['25', '1-1'], ['18', '3-2']];
  var pics = function () { return MIXED.map(function (x) { return h(P.Image, { key: x[0], src: ART(x[0]), alt: 'Asset ' + x[0], ratio: x[1] }); }); };

  /* ── Columns in a window of a class: a frame that answers the main region's container queries ── */
  var cells = function (n, sidebar) { return (sidebar ? ['Filters', 'Results'] : ['Files', 'Categories', 'Metadata'].slice(0, n)).map(function (x) { return h(P.Stack, { key: x, gap: 'xs', className: 'ds-w03c-cell' }, h(P.Text, { variant: 'label' }, x), h(P.Text, { variant: 'secondary' }, 'Column content')); }); };
  var windowOf = function (cls, child) { return h('div', { 'data-ds-wrap': true, className: 'ds-w03c-window ds-w03c-window--' + cls }, child); };
  var COLLAPSE = [['medium', 'Below Medium', 'narrow', 'collapseBelow="medium"'], ['wide', 'Below Wide', 'medium', 'collapseBelow="wide"']];
  var RATIO = [['sidebar-start', 'Sidebar at the start'], ['sidebar-end', 'Sidebar at the end']];

  /* ── Image: the markup of a state the live component reaches only while loading or failing ── */
  var still = function (cls, extra) { return h('span', { className: 'plx-image plx-image--cover plx-ratio-4-3 ' + cls }, extra || null); };
  var FALLBACK = function () { return h('span', { className: 'plx-image__fallback', role: 'img', 'aria-label': 'The finished kitchen' }, h(P.Icon, { name: 'image-a-2', className: 'plx-image__fallback-icon' }), h('span', { className: 'plx-image__fallback-text' }, 'Image not available')); };

  return [
    /* ── 01 Foundations › Themes ── */
    { id: 'theme-zones', sec: 'foundations', sub: 'Themes', leaf: 'Theme zones', title: 'Theme zones', plenix: 'ThemeZone', src: 'providers/ThemeProvider.tsx',
      css: ['system/theme-zone.css'], level: 'Foundation', interaction: 'Static', icon: 'panel-right-open',
      aliases: ['Inline theming', 'Nested theme', 'Layered themes', 'Theme scope'],
      text: 'A region of a page shown in the page’s other mode: a dark media viewer on a light page, a code panel, a light card inside a dark one. ThemeZone writes data-plx-theme and data-plx-mode on its element, so every color role inside resolves to that theme and mode; it also writes the density around it, so component tokens resolve again inside it. Menus and dialogs opened from a zone keep its mode (Portal). Its fill is its own canvas (surface="canvas"), the default surface or none.',
      use: ['A region with a reason for its own look: a media viewer, an image editor’s canvas, a code panel', '<ThemeZone mode="dark"> around the region, so every component inside follows it', 'A heading or a landmark name for the zone (label with as="section")'],
      avoid: ['Many small zones on one page', 'Colors set by hand on components inside a zone: set the zone', 'A zone to make one element stand out: use the component’s own emphasis'],
      related: ['themes', 'media-lightbox'],
      map: [[CAR, 'Inline theming (layered themes)', 'Direct'], [SPE, 'Theme provider (nested)', 'Partial'], [ATL, 'Nested themes', 'Partial'], [FLU, 'Nested FluentProvider', 'Partial']],
      examples: [['Mode', [['Dark zone on a light page', function () { return box(320, zone({ mode: 'dark' })); }, null, 'mode="dark"'],
        ['Light zone on a dark page', function () { return box(400, zone({ mode: 'dark', surface: 'canvas' }, zone({ mode: 'light', surface: 'default' }))); }, null, 'mode="light" inside mode="dark"']]],
        ['Surface', [['Canvas (default)', function () { return box(320, zone({ mode: 'dark', surface: 'canvas' }, h(P.Text, null, 'The zone’s canvas fill'))); }, null, 'surface="canvas"'],
          ['Default surface', function () { return box(320, zone({ mode: 'dark', surface: 'default' }, h(P.Text, null, 'The zone’s default surface'))); }, null, 'surface="default"'],
          ['None', function () { return box(320, zone({ mode: 'dark', surface: 'none' }, h(P.Text, null, 'No fill of its own'))); }, null, 'surface="none"']]]] },

    /* ── 02 Layout & Composition ── */
    { id: 'masonry-layout', lab: true, sec: 'layout', sub: 'Layout arrangements', leaf: 'Masonry layout', title: 'Masonry layout', plenix: 'ContentGrid layout="masonry" | "justified"', src: 'patterns/ContentGrid/ContentGrid.jsx',
      blocks: ['plx-content-grid'], variantClasses: ['plx-content-grid--masonry', 'plx-content-grid--justified'], level: 'Composite', interaction: 'Display', icon: 'grid-3x2',
      aliases: ['Masonry grid', 'Pinterest layout', 'Justified gallery', 'Image list (masonry)', 'Grid lanes'],
      text: 'The content grid for pictures of mixed shapes, in two forms. Masonry: columns of the card width, each picture at its own height, filled from the top of each column; nothing is cropped. Justified rows: rows of one height that fill the width, each picture as wide as its ratio; a few pixels are cropped to fill a row. Both keep the markup order.',
      use: ['Browsing pictures of mixed ratios, where seeing them matters more than their order', 'Masonry for portraits and landscapes together; justified rows for photo galleries read row by row', 'The ratio of each Image (ratio="3-4"…) so its space is kept before it loads'],
      avoid: ['Sorted results or anything compared across a row: use the grid (layout="grid")', 'Cards of text: they read best in rows of equal cells', 'Captions longer than one line under each picture'],
      related: ['responsive-grid', 'image', 'aspect-ratio-scale'],
      map: [[MAT, 'Image list (masonry)', 'Direct'], [SPE, 'Masonry (gallery layouts)', 'Partial']],
      variantPages: [
        vp('Masonry content grid', 'Layout', 'Masonry', { variant: 'masonry' }, 'Columns of the card width; each picture keeps its own height and the columns fill from the top.', 'Pictures of mixed shapes, portraits beside landscapes', 'Results whose order people read across a row'),
        vp('Justified rows', 'Layout', 'Justified rows', { variant: 'justified' }, 'Rows of the size’s height that fill the width; each picture is as wide as its ratio, the last row at its own width.', 'Photo galleries read row by row', 'Pictures that must never be cropped: use masonry')
      ],
      examples: [['Layout', [['Masonry', function () { return box(560, h(P.ContentGrid, { layout: 'masonry', size: 'sm', label: 'Photos' }, pics())); }, 'plx-content-grid--masonry', 'layout="masonry"'],
        ['Justified rows', function () { return box(560, h(P.ContentGrid, { layout: 'justified', size: 'xs', label: 'Photos' }, pics())); }, 'plx-content-grid--justified', 'layout="justified"']], { prop: 'layout' }]] },
    { id: 'collapse', lab: true, sec: 'layout', sub: 'Responsive composition', leaf: 'Collapse', title: 'Collapse', plenix: 'Columns collapseBelow, ratio', src: 'components/Columns/Columns.tsx',
      blocks: ['plx-columns'], variantClasses: ['plx-columns--collapse-below-medium', 'plx-columns--collapse-below-wide', 'plx-columns--sidebar-start', 'plx-columns--sidebar-end'], level: 'Primitive', interaction: 'Static', icon: 'panel-left-close',
      aliases: ['Stack on mobile', 'Responsive columns', 'Collapse to one column', 'Sidebar layout ratio'],
      text: 'Columns side by side that collapse into one column below a window class, measured on the main region’s width (Platforms Standard 3.3): collapseBelow="medium" stacks them in a Narrow window (under 600px), "wide" in a Narrow or Medium one (under 840px). Stacked, they keep the markup order with the layout gap between them, and divided columns swap their vertical lines for a line above each column. ratio="sidebar-start" or "sidebar-end" makes the first or last of two columns the narrow one. The navigation pane and the inspector collapse by their own rules (NavPane, SidePanel).',
      use: ['Two or three peer columns that need the width: collapseBelow="wide"; short ones that fit a Medium window: collapseBelow="medium"', 'A sidebar of filters or facts beside the main column: ratio="sidebar-start" or "sidebar-end"', 'The markup in reading order: the order the columns stack in'],
      avoid: ['Collapsing the main content of the page', 'Reordering the columns when they stack (it breaks the reading and focus order)', 'Columns inside a narrow dialog: stack them from the start (Stack)'],
      related: ['columns', 'breakpoints', 'side-navigation', 'inspector-region'],
      map: [[MAT, 'Canonical layouts (supporting pane)', 'Partial'], [CAR, 'Grid (responsive columns)', 'Partial'], [ATL, 'Page layout (collapsible sidebar)', 'Partial'], [FLU, 'Grid (stacking)', 'Partial']],
      variantPages: [
        vp('Collapse below Medium', 'Collapse', 'Below Medium', { variant: 'collapse-below-medium' }, 'Side by side in Medium and Wide windows; one column in a Narrow window (under 600px).', 'Short columns that still fit a Medium window', 'Columns of forms or tables, which need more width: use Below Wide'),
        vp('Collapse below Wide', 'Collapse', 'Below Wide', { variant: 'collapse-below-wide' }, 'Side by side only in a Wide window; one column in Narrow and Medium windows (under 840px).', 'Two or three columns that each need room', 'Short facts that fit side by side at Medium'),
        vp('Sidebar at the start', 'Ratio', 'Sidebar at the start', { variant: 'sidebar-start' }, 'Two columns: a narrow first column (one third) beside the main one.', 'Filters or a summary before the main column', 'Two peers of equal weight: keep equal columns'),
        vp('Sidebar at the end', 'Ratio', 'Sidebar at the end', { variant: 'sidebar-end' }, 'Two columns: the main column, then a narrow last one (one third).', 'Facts or related items after the main column', 'Details of a selection: use the inspector region')
      ],
      examples: [['Collapse', eachV(COLLAPSE, function (c) { return c[1]; }, function (c) { return h(P.Stack, { gap: 'xs' }, windowOf(c[2], h(P.Columns, { count: 3, collapseBelow: c[0] }, cells(3))), h(P.Text, { variant: 'secondary' }, c[0] === 'medium' ? 'In a Narrow window (under 600px)' : 'In a Medium window (600 to 839px)')); }, function (c) { return 'plx-columns--collapse-below-' + c[0]; }, function (c) { return c[3]; }), { prop: 'collapseBelow' }],
        ['Ratio', eachV(RATIO, function (r) { return r[1]; }, function (r) { return box(560, h(P.Columns, { ratio: r[0] }, r[0] === 'sidebar-end' ? cells(2, true).reverse() : cells(2, true))); }, function (r) { return 'plx-columns--' + r[0]; }, function (r) { return 'ratio=' + q(r[0]); }), { prop: 'ratio' }]] },

    /* ── 03 Content & Identity › Images and media ── */
    { id: 'image', lab: true, sec: 'content', sub: 'Images and media', leaf: 'Image', title: 'Image', plenix: 'Image', src: 'components/Image/Image.tsx', css: ['components/Image/image.css', 'system/ratio.css'], level: 'Component', interaction: 'Static', icon: 'image-a-2',
      covers: ['Responsive image'], aliases: ['Picture', 'Img', 'Responsive image', 'Photo', 'Media frame'],
      text: 'A picture in a frame of a fixed ratio (the aspect-ratio scale): cover crops it to the frame, contain shows it whole. The frame keeps its space while the picture loads and when it fails, so the page never moves.',
      use: ['Asset previews, photos and screenshots people need to see', 'A ratio from the scale in grids, cards and detail panes, so rows line up and nothing moves while loading', 'srcSet and sizes for large pictures; sources for another crop on narrow screens', 'alt that says what the picture shows or is for; alt="" for a decorative picture'],
      avoid: ['Text drawn as a picture: use real text', 'Icons and the Plenix illustrations: use Icon and Illustration', 'priority on more than the one or two pictures people see first', 'A different picture per source: every crop is the same picture with the same alt'],
      related: ['figure', 'aspect-ratio-scale', 'media-card', 'masonry-layout', 'thumbnail'],
      map: [[ATL, 'Image', 'Direct'], [FLU, 'Image', 'Direct'], [SPE, 'Image', 'Direct'], [POL, 'Thumbnail', 'Partial']],
      variantPages: [
        vp('Image fit cover', 'Fit', 'Cover (default)', { variant: 'cover' }, 'The picture fills its frame and its edges are cropped.', 'Thumbnails and previews in a grid of one ratio', 'Pictures that must show whole: use Contain'),
        vp('Image fit contain', 'Fit', 'Contain', { variant: 'contain' }, 'The whole picture inside its frame, on the frame’s fill.', 'Logos, documents and drawings that must not be cropped', 'Photos in a grid: the empty bands look uneven'),
        vp('Image color placeholder', 'Placeholder', 'Color (default)', { variant: 'placeholder-color' }, 'The neutral fill holds the frame until the picture fades in.', 'Most pictures', 'A large hero people wait for: use Blur'),
        vp('Image blur placeholder', 'Placeholder', 'Blur', { variant: 'placeholder-blur' }, 'A tiny copy of the picture, blurred, until the full picture fades in over it.', 'Large pictures and heroes on slow connections', 'Small thumbnails: the fill is enough'),
        vp('Image without placeholder', 'Placeholder', 'None', { variant: 'placeholder-none' }, 'No fill while loading: the frame stays empty until the picture arrives.', 'Pictures on a surface of their own color (a media viewer)', 'Pictures in a grid, where an empty frame looks broken'),
        vp('Rounded image', 'Shape', 'Rounded', { variant: 'rounded' }, 'The media corners on the frame.', 'A picture standing alone in content', 'A picture inside a card or preview that already clips it'),
        vp('Responsive image', 'Responsive', 'Responsive (srcSet, sizes)', { variant: 'responsive' }, 'Several files of the same picture by width; the browser picks the one for the drawn width and the screen density.', 'Large pictures, heroes, previews and gallery items', 'Small fixed thumbnails: one file with a 2x copy is enough'),
        vp('Lazy image', 'Loading', 'Lazy (default)', { variant: 'lazy' }, 'The picture loads when it nears the screen; priority loads the first one at once.', 'Every picture below the first screen', 'The picture people see first: give it priority'),
        vp('Image error fallback', 'Error', 'Fallback', { variant: 'error' }, 'The frame keeps its size and shows the image icon with “Image not available”.', 'Every picture that can fail to load', 'Hiding a failed picture, which moves the layout')
      ],
      examples: [['Fit', [['Cover (default)', function () { return box(240, h(P.Image, { src: ART('21'), alt: 'Asset 21', ratio: '16-9' })); }, 'plx-image--cover', 'fit="cover"'],
        ['Contain', function () { return box(240, h(P.Image, { src: ART('21'), alt: 'Asset 21', ratio: '16-9', fit: 'contain' })); }, 'plx-image--contain', 'fit="contain"']], { prop: 'fit' }],
        ['Placeholder', [['Color (default)', function () { return box(240, still('plx-image--placeholder-color is-loading')); }, 'plx-image--placeholder-color', 'placeholder="color" (while loading)'],
          ['Blur', function () { return box(240, still('plx-image--placeholder-blur is-loading', h('img', { className: 'plx-image__placeholder', src: ART('12'), alt: '', 'aria-hidden': 'true' }))); }, 'plx-image--placeholder-blur', 'placeholder="blur" placeholderSrc (while loading)'],
          ['None', function () { return box(240, still('plx-image--placeholder-none is-loading')); }, 'plx-image--placeholder-none', 'placeholder="none" (while loading)']], { prop: 'placeholder' }],
        ['Shape', [['Rounded', function () { return box(240, h(P.Image, { src: ART('12'), alt: 'Asset 12', ratio: '4-3', rounded: true })); }, 'plx-image--rounded', 'rounded']], { prop: 'rounded' }],
        ['Responsive', [['Responsive (srcSet, sizes)', function () { return box(320, h(P.Image, { src: ART('14'), srcSet: ART('14') + ' 200w, ' + ART('16') + ' 400w', sizes: '(max-width: 600px) 100vw, 320px', alt: 'Asset 14', ratio: '4-3' })); }, null, 'srcSet sizes'],
          ['Art direction (sources)', function () { return box(320, h(P.Image, { src: ART('14'), sources: [{ media: '(max-width: 599px)', srcSet: ART('25') }], alt: 'Asset 14', ratio: '4-3' })); }, null, 'sources']]],
        ['Loading', [['Lazy (default)', function () { return box(240, h(P.Image, { src: ART('16'), alt: 'Asset 16', ratio: '4-3' })); }, null, 'loading="lazy"'],
          ['Priority', function () { return box(240, h(P.Image, { src: ART('18'), alt: 'Asset 18', ratio: '4-3', priority: true })); }, null, 'priority']]],
        ['Error', [['Fallback', function () { return box(240, still('plx-image--placeholder-color is-error', FALLBACK())); }, null, 'onError (the frame keeps its size)']]]] },
    { id: 'figure', lab: true, sec: 'content', sub: 'Images and media', leaf: 'Figure', title: 'Figure', plenix: 'Figure', src: 'components/Figure/Figure.tsx', level: 'Component', interaction: 'Static', icon: 'image-b',
      aliases: ['Captioned image', 'Figure caption', 'Figcaption', 'Image with caption'],
      text: 'A picture, chart or diagram with one sentence that says what it shows and why it is there, and the credit or data source after it. The caption sits under the media in the secondary style, or on a solid media band over a picture’s bottom edge. It is a <figure> with a <figcaption>, so assistive technology ties the caption to the media.',
      use: ['Charts, diagrams and screenshots in documentation and reports', 'A picture that needs a source, a date or a note', 'The credit for a photo or the data source of a chart'],
      avoid: ['A decorative picture: use the Image with alt=""', 'A caption that repeats the alt text', 'An overlay caption longer than a short line, or on a chart: put it below'],
      related: ['image', 'rich-text', 'thumbnail'],
      map: [[CAR, 'Image (with caption)', 'Partial'], [SPE, 'Typography (caption)', 'Partial']],
      variantPages: [
        vp('Figure with caption below', 'Caption', 'Below (default)', { variant: 'below' }, 'The caption under the media in the secondary style, at a readable line length.', 'Charts, diagrams and most pictures', 'A one-word label on a photo grid: use the card title'),
        vp('Figure with overlay caption', 'Caption', 'Overlay', { variant: 'overlay' }, 'A short caption on a solid media band over the picture’s bottom edge.', 'A short line on a large photo', 'Charts and diagrams, whose bottom carries an axis'),
        vp('Figure with credit', 'Credit', 'With credit', { variant: 'credited' }, 'The caption with the credit or the data source after it, in the caption size.', 'Photos by a named person and charts from a named source', 'Pictures made in-house that need no credit')
      ],
      examples: [['Caption', [['Below (default)', function () { return box(320, h(P.Figure, { caption: 'The kitchen after the remodel, with the oak finish the client chose.' }, h(P.Image, { src: ART('12'), alt: 'The finished kitchen', ratio: '4-3' }))); }, 'plx-figure--below', 'captionPosition="below"'],
        ['Overlay', function () { return box(320, h(P.Figure, { captionPosition: 'overlay', caption: 'Lisbon office, east wing' }, h(P.Image, { src: ART('16'), alt: 'The east wing of the Lisbon office', ratio: '4-3' }))); }, 'plx-figure--overlay', 'captionPosition="overlay"']], { prop: 'captionPosition' }],
        ['Credit', [['With credit', function () { return box(320, h(P.Figure, { caption: 'The kitchen after the remodel.', credit: 'Photo: Ana Ruiz' }, h(P.Image, { src: ART('12'), alt: 'The finished kitchen', ratio: '4-3' }))); }, 'plx-figure--credited', 'credit']], { prop: 'credit' }]] }
  ];
});
