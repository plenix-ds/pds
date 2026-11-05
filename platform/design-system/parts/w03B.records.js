/* Plenix design system · library part w03B (wave 3, lane B): the brand and the layout regions. The Logos page (BrandMark's
   kinds, tones and sizes) with the Wordmarks, Brand marks and Product marks pages drawn from it, the Brand application rules
   (platform/brand/brand-rules.json), Illustration (and its duplicate leaf in Images and media), Sticky (and the Fixed region
   page), and Stack's Center, Bleed and reorder (reverse, reverseBelow, order). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, q = H.q, cap = H.cap;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var accent = function (child) { return h('div', { className: 'ds-w03b-accent' }, child); };
  var mono = function (v) { return h(P.Text, { variant: 'data' }, v); };
  var brand = function (p) { return h(P.BrandMark, p); };
  var SIZES = [['sm', 'Sm (minimum)', '16px mark · 13px name'], ['md', 'Md (default)', '20px mark · 15px name'], ['lg', 'Lg', '24px mark · 18px name'], ['xl', 'Xl', '32px mark · 20px name']];
  var sizeCards = function (kind, extra) {
    return SIZES.map(function (s) {
      return [s[1], function () { return h('span', { className: 'ds-w03b-spec' }, brand(Object.assign({ kind: kind, size: s[0] }, extra || {})), mono(s[2])); },
        kind === 'mark' ? 'plx-brand-mark--size-' + s[0] : ['plx-brand-lockup--size-' + s[0], 'plx-brand-mark--size-' + s[0]], 'size=' + q(s[0])];
    });
  };
  var BRAND_MAP = [[MAT, 'Brand (logo usage)', 'Partial'], [CAR, 'IBM logo', 'Partial'], [ATL, 'Logo', 'Direct'], [SPE, 'Logo (brand)', 'Partial'], [POL, 'App icon and logo (guidance)', 'Partial']];

  /* ── 01 Foundations › Brand ── */
  var logo = { id: 'logo', lab: true, icon: 'grid-2x2', sec: 'foundations', sub: 'Brand', leaf: 'Logos', title: 'Logo', plenix: 'BrandMark', src: 'components/Brand/Brand.tsx',
    css: ['components/Brand/brand.css', 'components/Brand/brand-lockup.css'], blocks: ['plx-brand-lockup', 'plx-brand-mark'], level: 'Component', interaction: 'Static',
    aliases: ['Logo', 'Lockup', 'Logotype', 'Brand logo', 'Signature'],
    text: 'The Plenix logo: the mark from the brand kit and the wordmark in one lockup, in the brand colors (the blue mark and the name in the text color), in one color, or on the accent. Its sizes follow the type scale and stop at the minimum size; BrandMark draws the wordmark, the mark alone and the product marks too.',
    use: ['The logo where Plenix introduces itself: the sign-in page, an about box, the first page of an exported document', 'tone="on-accent" on the blue header and accent surfaces; tone="mono" for one ink (print, an embossing)', 'clearSpace when the logo stands on its own, so nothing crowds it', 'The kit’s files, unedited (platform/brand/): replace them and build to change the brand'],
    avoid: ['The logo inside running text: write the name Plenix in the text', 'A photograph, a pattern or a status color behind it (Brand application lists the approved backgrounds)', 'Stretching, recoloring or redrawing it, or adding a tagline or another name to make a new lockup', 'A size below Sm: the mark loses its central cross'],
    related: ['brand-mark', 'wordmark', 'brand-symbol', 'product-mark', 'brand-application', 'application-header'],
    map: BRAND_MAP,
    variantPages: [
      vp('Brand-color logo', 'Tone', 'Brand (default)', { variant: 'brand' }, 'The blue mark and the name in the text color: the kit’s primary lockup; in dark mode the mark turns light blue.', 'The sign-in page, an about box, a document cover', 'The blue header: use On accent'),
      vp('One-color logo', 'Tone', 'One color', { variant: 'mono' }, 'The mark and the name in the current text color, for one ink.', 'Print, an embossing, a footer in the text color', 'Where color is available: use the brand colors'),
      vp('Logo on accent', 'Tone', 'On accent', { variant: 'on-accent' }, 'The mark and the name in the accent content color, the kit’s white mark on blue.', 'The blue header, an accent banner or a welcome panel', 'The page surface, where it would vanish'),
      vp('Minimum-size logo', 'Size', 'Sm (minimum)', { size: 'sm' }, 'The smallest logo: a 16px mark and a 13px name.', 'A compact header or a footer', 'Anything smaller: the mark loses its shape'),
      vp('Large logo', 'Size', 'Xl', { size: 'xl' }, 'The largest logo: a 32px mark and a 20px name, the top step of the type scale.', 'A welcome page or an about box', 'A header bar: use Md'),
      vp('Logo with clear space', 'Clear space', 'With clear space', { content: 'clear' }, 'The logo padded by the brand’s clear space, so nothing enters it.', 'A logo that stands on its own on a page', 'A logo inside a header that already spaces it')
    ],
    examples: [
      ['Kind', [['Logo', function () { return brand({ kind: 'logo' }); }, 'plx-brand-lockup--logo', 'kind="logo"'],
        ['Wordmark', function () { return brand({ kind: 'wordmark' }); }, 'plx-brand-lockup--wordmark', 'kind="wordmark"'],
        ['Mark', function () { return brand({ kind: 'mark', tone: 'brand', size: 'lg', label: 'Plenix' }); }, null, 'kind="mark"'],
        ['Product mark', function () { return brand({ kind: 'product', app: 'notes' }); }, 'plx-brand-lockup--product', 'kind="product" app="notes"']], { prop: 'kind' }],
      ['Tone', [['Brand (default)', function () { return row(brand({ kind: 'logo' }), brand({ kind: 'mark', tone: 'brand', size: 'md' })); }, ['plx-brand-lockup--tone-brand', 'plx-brand-mark--tone-brand'], 'tone="brand"'],
        ['One color', function () { return brand({ kind: 'logo', tone: 'mono' }); }, 'plx-brand-lockup--tone-mono', 'tone="mono"'],
        ['On accent', function () { return accent(row(brand({ kind: 'logo', tone: 'on-accent' }), brand({ kind: 'mark', tone: 'on-accent', size: 'md' }))); }, ['plx-brand-lockup--tone-on-accent', 'plx-brand-mark--tone-on-accent'], 'tone="on-accent"']], { prop: 'tone' }],
      ['Size', sizeCards('logo'), { prop: 'size' }],
      ['Clear space', [['With clear space', function () { return h('span', { className: 'ds-w03b-clear' }, brand({ kind: 'logo', size: 'lg', clearSpace: true })); }, 'plx-brand-lockup--clear', 'clearSpace']]]] };

  var wordmark = { id: 'wordmark', lab: true, icon: 'ed-text', sec: 'foundations', sub: 'Brand', leaf: 'Wordmarks', title: 'Wordmark', plenix: 'BrandMark', src: 'components/Brand/Brand.tsx',
    css: ['components/Brand/brand-lockup.css'], blocks: ['plx-brand-lockup', 'plx-brand-mark'], variantClasses: ['plx-brand-lockup--wordmark', 'plx-brand-lockup--tone-mono', 'plx-brand-lockup--tone-on-accent'], docsFrom: 'logo',
    level: 'Component', interaction: 'Static', aliases: ['Logotype', 'Name mark', 'Brand name'],
    text: 'The Plenix name set as the wordmark, without the mark (BrandMark kind="wordmark"): live text in the heading face at semibold with tight letter spacing, at a size of the type scale, so it is read and translated as the name.',
    use: ['Narrow places where the whole logo does not fit and the name must be read: a footer, a co-branded line', 'Places where people may not know the mark yet', 'tone="mono" in one ink; tone="on-accent" on the blue header'],
    avoid: ['Typing the name in another face, weight or spacing to imitate the wordmark', 'A square space such as an application icon: use the brand mark', 'Joining other words to the wordmark to make a new name'],
    related: ['logo', 'brand-symbol', 'brand-application'], map: BRAND_MAP,
    variantPages: [
      vp('One-color wordmark', 'Tone', 'One color', { variant: 'mono' }, 'The wordmark in the current text color.', 'Footers and print in one ink', 'The sign-in page, which shows the brand colors'),
      vp('Wordmark on accent', 'Tone', 'On accent', { variant: 'on-accent' }, 'The wordmark in the accent content color.', 'The blue header when the mark is shown elsewhere', 'The page surface')
    ],
    examples: [['Wordmark', [['Brand (default)', function () { return brand({ kind: 'wordmark' }); }, 'plx-brand-lockup--wordmark', 'kind="wordmark"']]],
      ['Tone', [['One color', function () { return brand({ kind: 'wordmark', tone: 'mono' }); }, 'plx-brand-lockup--tone-mono', 'tone="mono"'],
        ['On accent', function () { return accent(brand({ kind: 'wordmark', tone: 'on-accent' })); }, 'plx-brand-lockup--tone-on-accent', 'tone="on-accent"']], { prop: 'tone' }],
      ['Size', sizeCards('wordmark').map(function (c) { return [c[0], c[1], null, c[3]]; })]] };

  var brandSymbol = { id: 'brand-symbol', lab: true, icon: 'grid-2x2', sec: 'foundations', sub: 'Brand', leaf: 'Brand marks', title: 'Brand mark', plenix: 'BrandMark', src: 'components/Brand/Brand.tsx',
    css: ['components/Brand/brand.css', 'components/Brand/brand-lockup.css'], blocks: ['plx-brand-lockup', 'plx-brand-mark'],
    variantClasses: ['plx-brand-mark--tone-brand', 'plx-brand-mark--tone-on-accent', 'plx-brand-mark--size-sm', 'plx-brand-mark--size-md', 'plx-brand-mark--size-lg', 'plx-brand-mark--size-xl'], docsFrom: 'logo',
    level: 'Component', interaction: 'Static', aliases: ['Symbol', 'Logomark', 'Brand symbol', 'Monogram'],
    text: 'The Plenix mark alone (BrandMark, kind="mark"): four square corner brackets around a central cross, from the kit’s file, in the brand blue, one color or on the accent. Without a tone it takes the current text color, as in the header.',
    use: ['Square and small places where the brand is already named nearby: the header (beside the product name), the browser icon, the system account’s picture', 'label when the mark stands alone and must be named', 'The size scale: Sm (16px) is the smallest'],
    avoid: ['The mark as an action icon or a bullet: use an icon of the set', 'The mark alone where people meet Plenix for the first time: use the logo', 'Text or shapes inside or around the mark'],
    related: ['logo', 'brand-mark', 'icon'], map: BRAND_MAP,
    variantPages: [
      vp('Brand-color mark', 'Tone', 'Brand', { variant: 'brand' }, 'The mark in the brand blue (light blue in dark mode).', 'The mark alone on the page surface', 'Beside the product name in the header: leave the tone out'),
      vp('Mark on accent', 'Tone', 'On accent', { variant: 'on-accent' }, 'The mark in the accent content color, the kit’s white mark on blue.', 'The blue header and accent surfaces', 'The page surface'),
      vp('Smallest mark', 'Size', 'Sm (minimum)', { size: 'sm' }, 'The mark at 16px, its minimum size.', 'Dense places such as a menu row', 'Anything smaller')
    ],
    examples: [['Tone', [['Brand', function () { return brand({ tone: 'brand', size: 'lg', label: 'Plenix' }); }, 'plx-brand-mark--tone-brand', 'tone="brand"'],
        ['Current text color (default)', function () { return brand({ size: 'lg', label: 'Plenix' }); }, null, '(no tone)'],
        ['On accent', function () { return accent(brand({ tone: 'on-accent', size: 'lg', label: 'Plenix' })); }, 'plx-brand-mark--tone-on-accent', 'tone="on-accent"']], { prop: 'tone' }],
      ['Size', SIZES.map(function (s) {
        return [s[1], function () { return h('span', { className: 'ds-w03b-spec' }, brand({ tone: 'brand', size: s[0] }), mono(s[2].split(' · ')[0])); }, 'plx-brand-mark--size-' + s[0], 'size=' + q(s[0])];
      }), { prop: 'size' }]] };

  var productMark = { id: 'product-mark', lab: true, icon: 'app-switcher', sec: 'foundations', sub: 'Brand', leaf: 'Product marks', title: 'Product mark', plenix: 'BrandMark', src: 'components/Brand/Brand.tsx',
    css: ['components/Brand/brand-lockup.css'], blocks: ['plx-brand-lockup', 'plx-brand-mark'], variantClasses: ['plx-brand-lockup--product'], docsFrom: 'logo',
    level: 'Component', interaction: 'Static', aliases: ['App mark', 'Application icon', 'Product icon', 'App tile'],
    text: 'The mark of one Plenix application (BrandMark kind="product"): the application’s icon from PLENIX_APPS on the brand tile, then its name. Every application shares the tile, its sizes and its colors, so the suite reads as one family.',
    use: ['The application switcher, launch tiles and the header of one application', 'showName={false} for the tile alone where the name is next to it already (its name becomes the tile’s accessible name)', 'The exact application name of PLENIX_APPS'],
    avoid: ['A product mark for a feature inside an application: use an icon', 'A tile in another color or shape for one application', 'Shortening or nicknaming an application next to its mark'],
    related: ['logo', 'brand-symbol', 'application-header', 'product-switcher'], map: BRAND_MAP,
    variantPages: [
      vp('Product tile alone', 'Name', 'Tile only', { content: 'notes' }, 'The tile without the name; the application’s name is its accessible name.', 'A switcher grid that prints the names under the tiles', 'Alone without the name nearby'),
      vp('Product mark on accent', 'Tone', 'On accent', { variant: 'on-accent' }, 'The tile in the accent content color with the icon cut out of it, and the name, on the accent.', 'The blue header', 'The page surface')
    ],
    examples: [['Every application', function () { return h('div', { className: 'ds-w03b-row-of' }, (P.PLENIX_APPS || []).map(function (a) { return brand({ key: a.id, kind: 'product', app: a.id }); })); }],
      ['Name', [['With name (default)', function () { return brand({ kind: 'product', app: 'notes' }); }, 'plx-brand-lockup--product', 'kind="product" app="notes"'],
        ['Tile only', function () { return brand({ kind: 'product', app: 'notes', showName: false }); }, 'plx-brand-lockup--product', 'showName={false}']]],
      ['Tone', [['Brand (default)', function () { return brand({ kind: 'product', app: 'files' }); }, null, 'tone="brand"'],
        ['One color', function () { return brand({ kind: 'product', app: 'files', tone: 'mono' }); }, null, 'tone="mono"'],
        ['On accent', function () { return accent(brand({ kind: 'product', app: 'files', tone: 'on-accent' })); }, null, 'tone="on-accent"']], { prop: 'tone' }],
      ['Size', SIZES.map(function (s) { return [s[1], function () { return brand({ kind: 'product', app: 'calendar', size: s[0] }); }, null, 'size=' + q(s[0])]; }), { prop: 'size' }]] };

  var MISUSE = ['Stretching, rotating, skewing or cropping the mark or the logo', 'Recoloring the mark outside its tones, or adding a gradient, a shadow or an outline', 'Redrawing the mark or changing its modules or the channel between them', 'Retyping the wordmark in another face, weight or letter spacing', 'The mark smaller than 16px, or something inside its clear space', 'The mark as an action icon, a bullet or a pattern', 'A new lockup: a tagline, another name or another symbol next to the mark'];
  var brandApplication = { id: 'brand-application', icon: 'settings-customize', sec: 'foundations', sub: 'Brand', leaf: 'Brand application', title: 'Brand application', plenix: 'BrandMark, brand-rules.json', src: 'components/Brand/Brand.tsx',
    also: ['brand/brand-rules.json'], css: ['components/Brand/brand-lockup.css'], blocks: ['plx-brand-lockup'], variantClasses: [], level: 'Foundation', interaction: 'Static',
    aliases: ['Brand usage', 'Logo rules', 'Clear space', 'Minimum size', 'Brand guidelines'],
    text: 'How the brand kit is applied in the product: the clear space around a mark or a lockup, the minimum sizes, the backgrounds each tone is approved on, and the misuse to avoid. The rules are platform/brand/brand-rules.json (from the owner’s brand spec); the brand tokens hold its sizes and clear space, and tests/brand-rules.test.js keeps the two in step.',
    use: ['Clear space: at least 10% of the mark’s width on every side. The mark’s square includes it; a lockup that stands alone takes clearSpace (one inset step, on the 4px grid)', 'Minimum size: 16px for the mark, the logo and the product tile, 13px for the wordmark (Sm, the smallest size BrandMark draws)', 'Backgrounds: the brand colors on the page surface (light and dark), On accent on the blue header, One color for one ink', 'Brand expression at the entry points (sign-in, welcome, about, empty states) and quiet in dense work areas', 'Brand color through the brand tokens only, so themes and modes stay consistent'],
    avoid: MISUSE.concat(['The brand on a photograph, a pattern or a status color', 'Brand color for status, data or interactive states: they have their own roles']),
    related: ['logo', 'wordmark', 'brand-symbol', 'product-mark', 'illustration', 'themes'],
    map: [[MAT, 'Brand expression', 'Partial'], [ATL, 'Brand (logo usage)', 'Partial'], [CAR, 'Brand guidelines', 'Partial'], [SPE, 'Brand (logo)', 'Partial']],
    examples: [
      ['Clear space', [['Around a lockup', function () { return h('span', { className: 'ds-w03b-clear' }, brand({ kind: 'logo', size: 'xl', clearSpace: true })); }, null, 'clearSpace'],
        ['Inside the mark’s square', function () { return h('span', { className: 'ds-w03b-clear' }, brand({ tone: 'brand', size: 'xl', label: 'Plenix' })); }, null, 'the kit’s 56 of 512 units']]],
      ['Minimum size', [['Mark', function () { return h('span', { className: 'ds-w03b-spec' }, brand({ tone: 'brand', size: 'sm', label: 'Plenix' }), mono('16px')); }, null, 'size="sm"'],
        ['Logo', function () { return h('span', { className: 'ds-w03b-spec' }, brand({ kind: 'logo', size: 'sm' }), mono('16px · 13px')); }, null, 'kind="logo" size="sm"'],
        ['Product mark', function () { return h('span', { className: 'ds-w03b-spec' }, brand({ kind: 'product', app: 'tasks', size: 'sm' }), mono('16px')); }, null, 'kind="product" size="sm"']]],
      ['Backgrounds', [['Page surface (approved)', function () { return brand({ kind: 'logo', size: 'lg' }); }, null, 'tone="brand"'],
        ['Accent (approved)', function () { return accent(brand({ kind: 'logo', size: 'lg', tone: 'on-accent' })); }, null, 'tone="on-accent"'],
        ['Inverse surface, one color (approved)', function () { return h('div', { className: 'ds-w03b-dark' }, brand({ kind: 'logo', size: 'lg', tone: 'mono' })); }, null, 'tone="mono"'],
        ['Photograph or media (avoid)', function () { return h('div', { className: 'ds-w03b-busy' }, brand({ kind: 'logo', size: 'lg', tone: 'mono' })); }, null, 'not approved'],
        ['Status color (avoid)', function () { return h('div', { className: 'ds-w03b-status' }, brand({ kind: 'logo', size: 'lg', tone: 'mono' })); }, null, 'not approved']]],
      ['Misuse', function () { return box(560, h(P.List, { label: 'Brand misuse', items: MISUSE.map(function (t) { return { icon: 'close', tone: 'danger', children: t }; }) })); }]] };

  var ILL_MAP = [[ATL, 'Illustrations (brand)', 'Partial'], [CAR, 'Pictograms and illustrations', 'Partial'], [MAT, 'Imagery (illustration)', 'Partial'], [FLU, 'Illustrations', 'Partial'], [POL, 'Empty state illustration', 'Partial'], [SPE, 'Illustrated message', 'Direct']];
  var ill = function (p) { return h(P.Illustration, p); };
  var ART = (P.ILLUSTRATIONS || []);
  var illustration = { id: 'illustration', lab: true, icon: 'image-b', sec: 'foundations', sub: 'Brand', leaf: 'Illustrations', title: 'Illustration', plenix: 'Illustration, ILLUSTRATIONS', src: 'components/Illustration/Illustration.tsx',
    also: ['components/Illustration/illustrations.ts'], level: 'Component', interaction: 'Static',
    aliases: ['Illustration', 'Spot illustration', 'Empty state art', 'Illustrated message', 'Artwork'],
    text: 'The Plenix illustration set: nine drawings, for empty states (an empty folder, no results, all done, no data, get started) and errors (an error, offline, not found, no access). They are drawn from the theme’s roles (a backdrop, the shapes, the lines, one accent), so they follow light and dark mode and sit on the accent. Square corners and ends, like the brand mark. Three sizes: a spot beside a short message, a scene, and a large scene for a full page.',
    use: ['One illustration per view, in an empty state, a first run or an error page, above its heading and text', 'Sm beside a short message in a panel; Md in an empty main region; Lg on a full-page state', 'The error set for something that went wrong, the empty set for nothing yet', 'Decorative only: an illustration has no label, and anything it shows is also said in the text'],
    avoid: ['Illustrations in tables, forms, menus or dense work areas', 'A drawing that carries information the text does not', 'Words inside a drawing: the heading and text say them', 'Colors of its own: a new drawing uses the roles of the set'],
    related: ['empty-state', 'brand-application', 'icon'], map: ILL_MAP,
    variantPages: [
      vp('Spot illustration', 'Size', 'Sm (spot)', { size: 'sm' }, 'A 64px drawing with thin lines, beside a short message.', 'An empty panel, a card, a side region', 'A whole empty page: use Md or Lg'),
      vp('Scene illustration', 'Size', 'Md (scene, default)', { size: 'md' }, 'A 120px drawing above an empty state’s heading.', 'An empty main region or list', 'A small panel: use Sm'),
      vp('Large scene illustration', 'Size', 'Lg (large scene)', { size: 'lg' }, 'A 200px drawing for a page that is all one state.', 'Not found, offline or welcome pages', 'Any page with other content'),
      vp('Illustration on accent', 'Tone', 'On accent', { variant: 'on-accent' }, 'The same drawing in the accent’s colors.', 'A welcome panel or an accent banner', 'The page surface'),
      vp('Empty-state illustrations', 'Set', 'Empty states', { content: 'empty-folder' }, 'The five drawings for nothing yet: an empty folder, no results, all done, no data and get started.', 'Empty lists, searches without results, a first run', 'Something that went wrong: use the error set'),
      vp('Error illustrations', 'Set', 'Errors', { content: 'error' }, 'The four drawings for something wrong: an error, offline, not found and no access, with the danger accent.', 'Error pages and failed regions', 'An empty list that is fine: use the empty-state set')
    ],
    examples: [
      ['Size', [['Sm (spot)', function () { return ill({ name: 'no-results', size: 'sm' }); }, 'plx-illustration--sm', 'size="sm"'],
        ['Md (scene, default)', function () { return ill({ name: 'no-results' }); }, 'plx-illustration--md', 'size="md"'],
        ['Lg (large scene)', function () { return ill({ name: 'no-results', size: 'lg' }); }, 'plx-illustration--lg', 'size="lg"']], { prop: 'size' }],
      ['Tone', [['Default', function () { return ill({ name: 'get-started' }); }, null, 'tone="default"'],
        ['On accent', function () { return accent(ill({ name: 'get-started', tone: 'on-accent' })); }, 'plx-illustration--on-accent', 'tone="on-accent"']], { prop: 'tone' }],
      ['Set', [['Empty states', function () { return h('div', { className: 'ds-w03b-row-of' }, ART.filter(function (a) { return a.set === 'empty'; }).map(function (a) { return h(P.Stack, { key: a.name, gap: 'xs', align: 'center' }, ill({ name: a.name, size: 'sm', label: true }), mono(a.name)); })); }, null, 'name="empty-folder" …'],
        ['Errors', function () { return h('div', { className: 'ds-w03b-row-of' }, ART.filter(function (a) { return a.set === 'error'; }).map(function (a) { return h(P.Stack, { key: a.name, gap: 'xs', align: 'center' }, ill({ name: a.name, size: 'sm', label: true }), mono(a.name)); })); }, null, 'name="error" …']]],
      ['With its message', function () { return box(420, h(P.Center, { maxWidth: 'sm', intrinsic: true }, ill({ name: 'no-results' }), h(P.EmptyState, { title: 'No assets match' }, 'Try another word or clear the filters.'))); }]] };

  var contentIllustration = { id: 'content-illustration', icon: 'image-b', sec: 'content', sub: 'Images and media', leaf: 'Illustration', title: 'Illustration', plenix: 'Illustration', src: 'components/Illustration/Illustration.tsx',
    css: ['components/Illustration/illustration.css'], level: 'Component', interaction: 'Static', docsFrom: 'illustration', variantClasses: [],
    aliases: ['Drawing', 'Spot illustration'],
    text: 'A drawing from the illustration set placed in content: above an empty state’s heading or on a first-run page. The set, its sizes and tones are on the Illustrations page.',
    use: ['One drawing of the set above the heading and text it supports', 'The size that fits the region: Sm in a panel, Md in a main region'],
    avoid: ['Pictures of real things (photographs, thumbnails): use Image or Thumbnail', 'Two illustrations in one view'],
    related: ['illustration', 'empty-state'], map: ILL_MAP,
    examples: [['In an empty region', function () { return box(360, h(P.Center, { maxWidth: 'sm', intrinsic: true }, ill({ name: 'empty-folder', size: 'sm' }), h(P.EmptyState, { title: 'This folder is empty' }, 'Upload files or drag them here.'))); }]] };

  /* ── 02 Layout & Composition › Regions ── */
  var ROWS = function (n) { var out = []; for (var i = 1; i <= n; i++) out.push(h('div', { key: i, className: 'ds-w03b-row' }, 'Asset ' + i)); return out; };
  var scrollArea = function (label, kids) { return h('div', { className: 'ds-w03b-scroll', tabIndex: 0, role: 'region', 'aria-label': label }, kids); };
  var bar = function (text) { return h('div', { className: 'ds-w03b-bar' }, text); };
  var STICKY_MAP = [[MAT, 'Top app bar (scroll behavior)', 'Partial'], [ATL, 'Page header (sticky)', 'Partial'], [CAR, 'UI shell (fixed)', 'Partial'], [FLU, 'Sticky (DataGrid header)', 'Partial'], [POL, 'Sticky', 'Direct'], [SPE, 'Sticky (guidance)', 'Partial']];
  var sticky = { id: 'sticky', lab: true, icon: 'pin', sec: 'layout', sub: 'Regions', leaf: 'Sticky region', title: 'Sticky region', plenix: 'Sticky', src: 'components/Sticky/Sticky.tsx', level: 'Component', interaction: 'Static',
    aliases: ['Sticky', 'Sticky header', 'Sticky footer', 'Affix', 'Pinned bar', 'Fixed', 'Fixed bar', 'Fixed header', 'Bottom bar', 'Fixed region'],
    text: 'A region that scrolls with its content until it reaches the top or bottom of its scroll area, then stays there: a header with the page’s actions, a form’s action bar. It lies on the sticky layer on the surface and by default shows a shadow only while it is stuck (the browser reports it); it can show the shadow always, or never. fixed pins it to an edge of the window instead; safeArea keeps it clear of a notch or the home indicator.',
    use: ['A header with actions over a long page, a form’s action bar, the header of a long list', 'The edge where it is needed: top for what names the content, bottom for what acts on it', 'Inside the region that scrolls (a Stack with scroll, the main region), so it sticks to that region', 'label when it is a landmark people jump to', 'fixed for what people need at all times on that screen: a selection bar, a player', 'safeArea at the screen’s edge on phones', 'AppShell’s regions for the header, the navigation and the status bar'],
    avoid: ['More than two sticky regions in one scroll area: they eat the space', 'A tall region sticky on a narrow window', 'Several large fixed regions on a narrow window', 'Fixing a banner or content that can scroll away: fixed is for what is needed at all times', 'A fixed region that covers content without the page leaving room for it', 'A sticky region inside a table: the DataGrid’s header sticks by itself'],
    related: ['application-shell', 'scroll-area', 'action-bar'], map: STICKY_MAP,
    variantPages: [
      vp('Sticky header', 'Edge', 'Top (default)', { variant: 'top' }, 'Sticks to the top of its scroll area: the header of the content under it.', 'A record header, a list’s header, a page toolbar', 'Actions that finish a task: put them at the bottom'),
      vp('Sticky footer', 'Edge', 'Bottom', { variant: 'bottom' }, 'Sticks to the bottom of its scroll area until its place in the content scrolls into view.', 'A form’s Save and Cancel, a selection bar', 'Navigation: it belongs at the top or the side'),
      vp('Stuck shadow', 'Shadow', 'While stuck (default)', { variant: 'top' }, 'The shadow and its hairline show only while the region is stuck over content.', 'Most sticky regions', 'A region that is always over content: use Always'),
      vp('Always-shadowed sticky region', 'Shadow', 'Always', { variant: 'always' }, 'The shadow shows at all times.', 'A bar that always lies over content', 'A header at the top of its content, where the shadow would float'),
      vp('Safe-area sticky region', 'Safe area', 'Safe-area insets', { variant: 'safe-area' }, 'Pads its stuck edge and both sides by the device’s safe-area insets.', 'Regions at the edge of the screen on phones', 'Regions inside a pane, away from the screen’s edges'),
      Object.assign(vp('Fixed bottom bar', 'Fixed region · Fixed', 'Fixed (window)', { variant: 'fixed' }, 'Fixed to the window’s bottom edge with the safe-area insets and a shadow.', 'A selection bar on a phone', 'A desktop page, where an action bar in the content is closer'), { labId: 'fixed' })
    ],
    examples: [
      ['Edge', [['Top (default)', function () { return scrollArea('Assets', [h(P.Sticky, { key: 's', label: 'Assets header', stuck: true }, bar('Kitchen remodel · 24 assets'))].concat(ROWS(8))); }, 'plx-sticky--top', 'edge="top"'],
        ['Bottom', function () { return scrollArea('Edit project', ROWS(8).concat([h(P.Sticky, { key: 's', edge: 'bottom', label: 'Actions', stuck: true }, h(P.Inline, { justify: 'end', inset: 'sm' }, h(P.Button, null, 'Cancel'), h(P.Button, { variant: 'primary' }, 'Save')))])); }, 'plx-sticky--bottom', 'edge="bottom"']], { prop: 'edge' }],
      ['Shadow', [['While stuck (default)', function () { return scrollArea('Scroll to stick', [h('div', { key: 'i', className: 'ds-w03b-row' }, 'Scroll this area')].concat([h(P.Sticky, { key: 's' }, bar('Sticks, then shows its shadow'))], ROWS(8))); }, 'plx-sticky--shadow-stuck', 'shadow="stuck"'],
        ['Always', function () { return scrollArea('Always shadowed', [h(P.Sticky, { key: 's', shadow: 'always' }, bar('Always shadowed'))].concat(ROWS(6))); }, 'plx-sticky--shadow-always', 'shadow="always"']], { prop: 'shadow' }],
      ['Safe area', [['Safe-area insets', function () { return scrollArea('Safe area', [h(P.Sticky, { key: 's', safeArea: true, stuck: true }, bar('Clear of the notch'))].concat(ROWS(6))); }, 'plx-sticky--safe-area', 'safeArea']]],
      ['Fixed', [['Fixed (window)', function () { return h('div', { className: 'ds-w03b-window', tabIndex: 0, role: 'region', 'aria-label': 'A window' }, ROWS(6), h(P.Sticky, { fixed: true, edge: 'bottom', safeArea: true, label: 'Selection' }, h(P.Inline, { justify: 'between', inset: 'sm' }, h(P.Text, null, '3 selected'), h(P.Button, null, 'Download')))); }, 'plx-sticky--fixed', 'fixed']]],
      ['Fixed region · Fixed', [['Fixed (window)', function () { return h('div', { className: 'ds-w03b-window', tabIndex: 0, role: 'region', 'aria-label': 'A window' }, ROWS(6), h(P.Sticky, { fixed: true, edge: 'bottom', label: 'Selection' }, h(P.Inline, { justify: 'between', inset: 'sm' }, h(P.Text, null, '3 selected'), h(P.Button, null, 'Download')))); }, 'plx-sticky--fixed', 'fixed'],
      ['With safe-area insets', function () { return h('div', { className: 'ds-w03b-window', tabIndex: 0, role: 'region', 'aria-label': 'A phone window' }, ROWS(6), h(P.Sticky, { fixed: true, edge: 'bottom', safeArea: true, label: 'Player' }, bar('Now playing · site walkthrough'))); }, 'plx-sticky--safe-area', 'fixed safeArea']]]], extraLabs: [{ id: 'fixed', title: 'Fixed region' }], also: [], covers: ['Fixed region'] };

  /* ── 02 Layout & Composition › Layout primitives (Center, Bleed) and Responsive composition (Reorder) ── */
  var BOXD = function (t) { return h('div', { className: 'ds-layout-fill ds-layout-box' }, t); };
  var stage = function (child, narrow) { return h('div', { className: 'ds-w03b-stage' + (narrow ? ' ds-w03b-stage--narrow' : '') }, child); };
  var LAYOUT_MAP = function (name) { return [[POL, name, 'Direct'], [ATL, name + ' (primitives)', 'Partial'], [SPE, name + ' (layout)', 'Partial'], [CAR, 'Grid and spacing', 'Partial']]; };
  var center = { id: 'center', lab: true, icon: 'ed-align-center', sec: 'layout', sub: 'Layout primitives', leaf: 'Center', title: 'Center', plenix: 'Center', src: 'components/Stack/Stack.tsx', blocks: ['plx-center'], level: 'Primitive', interaction: 'Static',
    aliases: ['Centered layout', 'Container', 'Max-width container', 'Content width'],
    text: 'A block centered in its parent at a readable maximum width (400, 600 or 900px, or the contained layout’s maximum): a sign-in form, an empty state, a page of one message. intrinsic centers each child at its own width; vertical centers in the parent’s height too (content taller than the parent starts at the top, so nothing is cut off); text centers the lines.',
    use: ['Sign-in and setup pages, empty states, single-message pages', 'A maximum width so lines stay readable', 'text for a short heading and one or two lines under it'],
    avoid: ['Centering long text or a form of many fields: start them at the start edge', 'Centering items in tables and lists', 'Vertical centering for content that may grow taller than its region: it then starts at the top, by design'],
    related: ['stack', 'empty-state', 'grid'], map: LAYOUT_MAP('Center'),
    variantPages: [
      vp('Narrow center', 'Maximum width', 'Sm (400px)', { variant: 'sm' }, 'Centered at most 400px wide.', 'A sign-in form, an empty state', 'A page of reading'),
      vp('Reading-width center', 'Maximum width', 'Lg (900px)', { variant: 'lg' }, 'Centered at most 900px wide.', 'A page of text or a settings page on its own', 'A form of a few fields: use Sm or Md'),
      vp('Intrinsic center', 'Children', 'Intrinsic', { variant: 'intrinsic' }, 'Each child centered at its own width.', 'An illustration over a message and a button', 'Fields that should share one width'),
      vp('Vertical center', 'Children', 'Vertical', { variant: 'vertical' }, 'Centered in the parent’s height too; taller content starts at the top.', 'A sign-in page, a not-found page', 'A list or anything that grows')
    ],
    examples: [
      ['Maximum width', [['Sm (400px)', function () { return stage(h(P.Center, { maxWidth: 'sm' }, BOXD('At most 400px'))); }, 'plx-center--max-sm', 'maxWidth="sm"'],
        ['Md (default, 600px)', function () { return stage(h(P.Center, null, BOXD('At most 600px'))); }, 'plx-center--max-md', 'maxWidth="md"'],
        ['Lg (900px)', function () { return stage(h(P.Center, { maxWidth: 'lg' }, BOXD('At most 900px'))); }, 'plx-center--max-lg', 'maxWidth="lg"'],
        ['Page', function () { return stage(h(P.Center, { maxWidth: 'page' }, BOXD('The contained layout’s maximum'))); }, 'plx-center--max-page', 'maxWidth="page"'],
        ['None', function () { return stage(h(P.Center, { maxWidth: 'none' }, BOXD('As wide as its parent'))); }, 'plx-center--max-none', 'maxWidth="none"']], { prop: 'maxWidth' }],
      ['Children', [['Intrinsic', function () { return stage(h(P.Center, { maxWidth: 'sm', intrinsic: true }, BOXD('Own width'), h(P.Button, { variant: 'primary' }, 'Upload files'))); }, 'plx-center--intrinsic', 'intrinsic'],
        ['Vertical', function () { return stage(h(P.Center, { maxWidth: 'sm', vertical: true }, BOXD('In the middle of the height'))); }, 'plx-center--vertical', 'vertical'],
        ['Text', function () { return stage(h(P.Center, { maxWidth: 'sm', vertical: true, text: true }, h(P.Text, { variant: 'label' }, 'No projects yet'), h(P.Text, { variant: 'secondary' }, 'Create one to start uploading.'))); }, 'plx-center--text', 'text']]]] };

  var SPACES = ['xs', 'sm', 'md', 'lg', 'xl'];
  var bleedSample = function (space, sides) {
    return h(P.Stack, { gap: 'sm', inset: space, className: 'ds-w03b-frame' }, sides === 'inline' ? BOXD('Kitchen remodel') : null,
      h(P.Bleed, { space: space, sides: sides }, h('div', { className: 'ds-w03b-media' }, 'Full-width photo')), sides === 'inline' ? BOXD('Before the demolition') : null);
  };
  var bleed = { id: 'bleed', lab: true, icon: 'expand', sec: 'layout', sub: 'Layout primitives', leaf: 'Bleed', title: 'Bleed', plenix: 'Bleed', src: 'components/Stack/Stack.tsx', blocks: ['plx-bleed'], level: 'Primitive', interaction: 'Static',
    aliases: ['Full bleed', 'Negative margin', 'Edge to edge'],
    text: 'A child that reaches past its parent’s inset to the parent’s edges: a full-width photo, a divider or a table inside a padded card or panel. It cancels exactly its parent’s inset tokens (Stack inset) on the sides, the top and bottom, or every edge, so its edges meet the parent’s and the parent’s corners clip it.',
    use: ['Media, dividers and tables that should run edge to edge inside a padded region', 'The same space as the parent’s inset (space="md" inside inset="md")', 'sides="all" for media that fills a card to its edges'],
    avoid: ['Text in a Bleed: text keeps the inset', 'A margin written by hand to do the same', 'A different space than the parent’s inset: the edges would not meet'],
    related: ['stack', 'card', 'divider'], map: LAYOUT_MAP('Bleed'),
    variantPages: [
      vp('Small bleed', 'Inset', 'Sm', { variant: 'sm' }, 'Cancels a small (8px) inset.', 'Compact panels and cards', 'A parent with another inset'),
      vp('Medium bleed', 'Inset', 'Md (default)', { variant: 'md' }, 'Cancels the default (12px) inset.', 'Most panels and cards', 'A parent with another inset'),
      vp('Large bleed', 'Inset', 'Lg', { variant: 'lg' }, 'Cancels a large (16px) inset.', 'Spacious cards and pages', 'A parent with another inset'),
      vp('Bleed to every edge', 'Sides', 'All', { content: 'all' }, 'Reaches the parent’s top, bottom and side edges.', 'A cover photo that fills a card', 'A child between other children: bleed to the sides only'),
      vp('Bleed to top and bottom', 'Sides', 'Block', { content: 'block' }, 'Reaches the parent’s top and bottom edges.', 'A vertical strip in a row', 'Media between text above and below')
    ],
    examples: [
      ['Inset', SPACES.map(function (s) { return [cap(s) + (s === 'md' ? ' (default)' : ''), function () { return bleedSample(s, 'inline'); }, 'plx-bleed--' + s, 'space=' + q(s)]; }), { prop: 'space' }],
      ['Sides', [['Inline (default)', function () { return bleedSample('md', 'inline'); }, 'plx-bleed--inline', 'sides="inline"'],
        ['Block', function () { return bleedSample('md', 'block'); }, 'plx-bleed--block', 'sides="block"'],
        ['All', function () { return bleedSample('md', 'all'); }, 'plx-bleed--all', 'sides="all"']], { prop: 'sides' }]] };

  var three = function () { return [BOXD('1 · Summary'), BOXD('2 · Content'), BOXD('3 · Related')].map(function (e, i) { return React.cloneElement(e, { key: i }); }); };
  var reorder = { id: 'reorder', lab: true, icon: 'sort', sec: 'layout', sub: 'Responsive composition', leaf: 'Reorder', title: 'Reorder', plenix: 'Stack, Inline (reverse, reverseBelow, order, orderBelow)', src: 'components/Stack/Stack.tsx',
    variantClasses: [], level: 'Primitive', interaction: 'Static',
    aliases: ['Reverse', 'Order', 'Source order', 'Responsive order'],
    text: 'Regions drawn in a different order from the markup, always or below a window class (Narrow under 600px, Medium under 840px): Stack and Inline take reverse and reverseBelow; a child takes order ("first", "last") and orderBelow. Only the drawing moves: screen readers and the Tab key follow the markup. Reorder only regions with no reading order between them, and change the markup when the meaning changes.',
    use: ['Putting a summary above the content it sums up on a narrow window', 'Moving a secondary region to the end of a row', 'Large regions only (a summary, a sidebar, related content)'],
    avoid: ['Reordering form fields, steps or anything read in sequence', 'Order that makes Tab jump against what people see (focus order)', 'Words such as “above” or “on the left” for a region that moves'],
    related: ['stack', 'focus-order', 'breakpoints'], map: [[POL, 'InlineStack, BlockStack (reverse)', 'Partial'], [ATL, 'Flex (direction)', 'Partial'], [MAT, 'Canonical layouts (reflow)', 'Partial'], [CAR, 'Grid (responsive)', 'Partial']],
    variantPages: [
      vp('Reversed column', 'Order', 'Reversed column', { variant: 'reverse-stack' }, 'A Stack drawn from the last child to the first.', 'Newest-first regions whose markup is oldest first', 'Steps and form fields'),
      vp('Reversed row', 'Order', 'Reversed row', { variant: 'reverse-inline' }, 'An Inline drawn from the end to the start.', 'Two regions that swap sides', 'Controls people Tab through'),
      vp('Moved to the start', 'Order', 'Moved to the start', { variant: 'order-first' }, 'One child drawn first in its row or column.', 'A summary moved before the content', 'A field moved out of its form order'),
      vp('Reversed below Narrow', 'Order', 'Reversed below Narrow', { variant: 'reverse-below' }, 'Reversed only on a narrow window (under 600px).', 'A summary that comes first on a phone', 'Desktop-only rearrangements of controls')
    ],
    examples: [['Order', [['Reversed column', function () { return box(240, h(P.Stack, { reverse: true }, three())); }, 'plx-layout--reverse', 'Stack reverse'],
      ['Reversed row', function () { return h(P.Inline, { reverse: true }, three()); }, 'plx-layout--reverse', 'Inline reverse'],
      ['Moved to the start', function () { return h(P.Inline, null, BOXD('1 · Summary'), BOXD('2 · Content'), h(P.Stack, { order: 'first' }, BOXD('3 · Related'))); }, 'plx-layout--order-first', 'order="first"'],
      ['Moved to the end', function () { return h(P.Inline, null, h(P.Stack, { order: 'last' }, BOXD('1 · Summary')), BOXD('2 · Content'), BOXD('3 · Related')); }, 'plx-layout--order-last', 'order="last"'],
      ['Reversed below Narrow', function () { return h(P.Inline, { reverseBelow: 'narrow' }, three()); }, 'plx-layout--reverse-below-narrow', 'reverseBelow="narrow"']]]] };

  return [logo, wordmark, brandSymbol, productMark, brandApplication, illustration, contentIllustration, sticky, center, bleed, reorder];
});
