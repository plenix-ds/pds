/* Plenix design system · library part w02A (wave 2, lane A): reading content and two foundations. Link (the Inline link
   page, which also answers Standalone, External and Back link as its variant pages), inline Code, Blockquote, the List's
   ordered lists (the Ordered list page, on the List's own code), RichText (prose from HTML or JSX), the Focus order
   foundation (the dev overlay platform/dev/focus-order.js) and the writing direction (DirectionProvider, utils/
   direction.js and the logical-properties rule). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, eachV = H.eachV, q = H.q, use = H.use, noop = H.noop, onAccent = H.onAccent;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var para = function () { return h.apply(null, [P.Text, { as: 'p' }].concat([].slice.call(arguments))); };

  /* ── links ── */
  var LINKS = [
    ['inline', 'Inline (default)', function () { return para('Read the ', h(P.Link, { href: '#upload-guide' }, 'upload guide'), ' before the first import.'); }, 'plx-link--inline', 'variant="inline"'],
    ['standalone', 'Standalone', function () { return h(P.Link, { href: '#projects', variant: 'standalone' }, 'View all projects'); }, 'plx-link--standalone', 'variant="standalone"'],
    ['subtle', 'Subtle', function () { return para('Plenix · ', h(P.Link, { href: '#terms', variant: 'subtle' }, 'Terms'), ' · ', h(P.Link, { href: '#privacy', variant: 'subtle' }, 'Privacy')); }, 'plx-link--subtle', 'variant="subtle"'],
    ['on-accent', 'On accent', function () { return onAccent(h(P.Link, { href: '#help', onAccent: true }, 'Help center')); }, 'plx-link--on-accent', 'onAccent']
  ];
  var KINDS = [
    ['external', 'External', function () { return para('See the ', h(P.Link, { href: 'https://m3.material.io/', external: true }, 'Material guidelines'), ' for the native look.'); }, null, 'external'],
    ['back', 'Back', function () { return h(P.Link, { href: '#projects', back: true }, 'Projects'); }, null, 'back']
  ];

  /* ── ordered lists ── */
  var STEPS = [{ children: 'Create the project and name it' }, { children: 'Upload the photos and drawings' }, { children: 'Share the project with the client' }];
  var NESTED = [{ children: 'Create the project' }, { children: 'Upload the files', ordered: 'alpha', items: [{ children: 'Photos' }, { children: 'Drawings' }] }, { children: 'Share it' }];
  var ORDERED = [
    ['decimal', 'Ordered (decimal, default)', function () { return box(300, h(P.List, { ordered: true, label: 'Steps', items: STEPS })); }, 'plx-list--ordered', 'ordered'],
    ['alpha', 'Ordered (alpha)', function () { return box(300, h(P.List, { ordered: 'alpha', label: 'Options', items: [{ children: 'Keep both files' }, { children: 'Replace the old file' }, { children: 'Skip this file' }] })); }, 'plx-list--alpha', 'ordered="alpha"'],
    ['nested', 'Nested', function () { return box(300, h(P.List, { ordered: true, label: 'Steps', items: NESTED })); }, null, 'items[i].items'],
    ['steps', 'Steps', function () { return box(300, h(P.List, { ordered: true, variant: 'steps', label: 'Steps', items: STEPS })); }, 'plx-list--steps', 'variant="steps"']
  ];

  /* ── rich text ── */
  var PROSE = function () {
    return [h('h2', { key: 'h' }, 'Before you upload'),
      h('p', { key: 'p1' }, 'Name each file the way the ', h('a', { href: '#naming' }, 'naming guide'), ' says, and keep the originals: Plenix makes the previews. A file such as ', h('code', null, 'kitchen-014.jpg'), ' keeps its name.'),
      h('ol', { key: 'ol' }, h('li', null, 'Create the project'), h('li', null, 'Upload the photos', h('ul', null, h('li', null, 'Before'), h('li', null, 'After'))), h('li', null, 'Share it with the client')),
      h('blockquote', { key: 'q' }, h('p', null, 'Every room gets its own folder before the first upload.')),
      h('h3', { key: 'h3' }, 'Large files'),
      h('p', { key: 'p2' }, 'Files over 2 GB upload in parts. ', h('strong', null, 'Keep the window open'), ' until the last part is in.')];
  };
  var rich = function (variant) { return h(P.RichText, { variant: variant }, PROSE()); };

  /* ── the focus order: a live region numbered by the overlay script ── */
  var loadOverlay = function (then) {
    if (window.PlenixFocusOrder) return then();
    var s = document.createElement('script');
    s.src = PlenixSource.at('dev/focus-order.js');
    s.onload = then;
    document.head.appendChild(s);
  };
  var OrderDemo = function (p) {
    var ref = React.useRef(null), list = use([]);
    var read = function () { loadOverlay(function () { if (ref.current) list[1](window.PlenixFocusOrder.check(ref.current).stops); }); };
    React.useEffect(read, []);
    return h(P.Stack, { gap: 'sm' },
      h('div', { ref: ref, className: 'ds-w02a-order' + (p.reverse ? ' ds-w02a-order--reverse' : '') },
        h(P.Input, { 'aria-label': 'Project name', width: 'md', defaultValue: 'Kitchen remodel' }),
        h(P.Input, { 'aria-label': 'Client', width: 'md', defaultValue: 'Ruiz family' }),
        h(P.Button, { variant: 'primary' }, 'Save')),
      h(P.Text, { variant: 'secondary' }, p.reverse
        ? 'Drawn in the other order by CSS (row-reverse): Tab still goes ' + list[0].map(function (s) { return s.name; }).join(', then ') + ', against the reading order.'
        : 'Tab goes ' + list[0].map(function (s) { return s.name; }).join(', then ') + ': the reading order.'));
  };
  var DialogDemo = function () {
    var open = use(false), trigger = React.useRef(null);
    return h(React.Fragment, null,
      h(P.Button, { ref: trigger, onClick: function () { open[1](true); } }, 'Rename project'),
      h(P.Dialog, { open: open[0], onClose: function () { open[1](false); }, title: 'Rename project', size: 'sm',
        footer: h(React.Fragment, null, h(P.Button, { onClick: function () { open[1](false); } }, 'Cancel'), h(P.Button, { variant: 'primary', onClick: function () { open[1](false); } }, 'Rename')) },
        h(P.Field, { label: 'Name' }, h(P.Input, { defaultValue: 'Kitchen remodel' }))));
  };
  var OverlayToggle = function () {
    return h(P.Button, { onClick: function () { loadOverlay(function () { window.PlenixFocusOrder.toggle(); }); } }, 'Number this page’s Tab stops');
  };

  /* ── the writing direction ── */
  var DirSample = function (p) {
    return h(P.DirectionProvider, { dir: p.dir, lang: p.dir === 'rtl' ? 'ar' : 'en' },
      h('div', { className: 'ds-w02a-dir' },
        h(P.Link, { href: '#projects', back: true }, p.dir === 'rtl' ? 'المشاريع' : 'Projects'),
        h(P.List, { ordered: true, label: p.dir === 'rtl' ? 'الخطوات' : 'Steps', items: p.dir === 'rtl' ? [{ children: 'أنشئ المشروع' }, { children: 'ارفع الملفات' }] : [{ children: 'Create the project' }, { children: 'Upload the files' }] }),
        h(P.Blockquote, { citation: p.dir === 'rtl' ? 'آنا رويث' : 'Ana Ruiz' }, p.dir === 'rtl' ? 'لكل غرفة مجلد خاص بها.' : 'Every room gets its own folder.'),
        h('div', { className: 'ds-w02a-dir__row' }, h(P.Button, { icon: 'chevron-left' }, p.dir === 'rtl' ? 'السابق' : 'Previous'), h(P.Button, { iconEnd: 'chevron-right' }, p.dir === 'rtl' ? 'التالي' : 'Next'))));
  };
  var MirrorSample = function () {
    return h(P.DirectionProvider, { dir: 'rtl', lang: 'ar' },
      h('div', { className: 'ds-w02a-dir__row' },
        ['chevron-left', 'chevron-right', 'arrow-left', 'ed-undo', 'ed-redo'].map(function (n) { return h(P.Icon, { key: n, name: n, size: 'md', label: n + ' (mirrored)' }); }),
        ['search', 'clock', 'check'].map(function (n) { return h(P.Icon, { key: n, name: n, size: 'md', label: n + ' (kept)' }); })));
  };

  // a variant leaf of Link that answers its own taxonomy leaf
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };

  return [
    /* ── 03 Content & Identity › Links ── */
    { id: 'link', lab: true, sec: 'content', sub: 'Links', leaf: 'Inline link', title: 'Link', plenix: 'Link', src: 'components/Link/Link.tsx', level: 'Component', interaction: 'Navigation', icon: 'forward',
      covers: ['Standalone link', 'External link', 'Back link'],
      aliases: ['Hyperlink', 'Anchor', 'Text link', 'Standalone link', 'External link', 'Back link'],
      text: 'A link that goes to another page or place: underlined inside a sentence (inline), on its own line at medium weight (standalone), to another site in a new tab (external) or back to the page above (back).',
      use: ['Going somewhere: another page, a section, a file or another site', 'Inline inside running text, where the underline tells it from the words around it', 'Standalone for a link that stands on its own line (View all, a card’s footer)', 'external for another site: it opens in a new tab and says so', 'back for the page above a detail page, when there are no breadcrumbs'],
      avoid: ['Doing something that changes data (Save, Delete, Send): use a Button', '“Click here” or “Read more” as the words: say where it goes', 'A link styled as a button, or a button styled as a link', 'Opening a new tab for a page of the same application'],
      related: ['button', 'breadcrumbs', 'application-shell', 'text'],
      map: [[CAR, 'Link', 'Direct'], [ATL, 'Link', 'Direct'], [MAT, 'Text button (link)', 'Partial'], [FLU, 'Link', 'Direct'], [POL, 'Link', 'Direct'], [SPE, 'Link', 'Direct']],
      variantPages: [
        vp('Default inline link', 'Variant', 'Inline (default)', { variant: 'inline' }, 'A link inside a sentence, in the link color and always underlined.', 'Links inside paragraphs, descriptions and messages', 'A link on its own line: use Standalone'),
        vp('Standalone link', 'Variant', 'Standalone', { variant: 'standalone' }, 'A link on its own line at medium weight, underlined on hover, as tall as the minimum target.', 'View all, Learn more about a named thing, a card footer link', 'A link inside a sentence: use Inline'),
        vp('Subtle link', 'Variant', 'Subtle', { variant: 'subtle' }, 'A link in the text color, still underlined, that steps back from the content.', 'Footers, legal links and fine print', 'The main links of a page, which must stand out'),
        vp('Link on accent', 'Variant', 'On accent', { variant: 'on-accent' }, 'A link in the accent content color on the blue header and other accent surfaces.', 'Links on the accent header or an accent banner', 'Links on the page surface'),
        vp('External link', 'Kind', 'External', { variant: 'external' }, 'A link to another site: it opens in a new tab, shows the open icon after its text and tells assistive technology.', 'Links to other sites, documentation and files hosted elsewhere', 'Pages of the same application, which open in place'),
        vp('Back link', 'Kind', 'Back', { variant: 'back' }, 'A standalone link with a leading chevron to the page above; the chevron mirrors in right-to-left pages.', 'The top of a detail page without breadcrumbs', 'Undoing a step in a form: use the form’s Back button'),
        vp('Visited link', 'State', 'Visited', { variant: 'visited' }, 'An inline link to a page the person has opened, in the visited color.', 'Lists of documents and search results people work through', 'Navigation and actions, which keep one color')
      ],
      examples: [['Variant', eachV(LINKS, function (v) { return v[1]; }, function (v) { return v[2](); }, function (v) { return v[3]; }, function (v) { return v[4]; }), { prop: 'variant' }],
        ['Kind', eachV(KINDS, function (v) { return v[1]; }, function (v) { return v[2](); }, function (v) { return v[3]; }, function (v) { return v[4]; })],
        ['State', [['Visited', function () { return para('You opened the ', h(P.Link, { href: '#guide', visited: true }, 'upload guide'), ' yesterday.'); }, null, ':visited (visited in documentation)']]]] },

    /* ── 03 Content & Identity › Text and reading ── */
    { id: 'inline-code', lab: true, sec: 'content', sub: 'Text and reading', leaf: 'Inline code', title: 'Inline code', plenix: 'Code', src: 'components/Code/Code.tsx', level: 'Primitive', interaction: 'Static', icon: 'fields',
      aliases: ['Code', 'Code span', 'Monospace text', 'Token name'],
      text: 'A short piece of code inside a sentence: a class, a file name, a command or a token name, in the code font (Reddit Mono) on a neutral fill, at the size of the text around it.',
      use: ['Class names, file names, commands, keys of a configuration and token names inside running text', 'truncate for a long path in a narrow cell, with the whole value as its title'],
      avoid: ['Code people copy or read in more than a line: use a Code block', 'Technical values that are not code (sizes, dates, IDs): use Text variant="data"', 'Keys and shortcuts: use the Keyboard hint'],
      related: ['code-block', 'keyboard-hint', 'text'],
      map: [[CAR, 'Code snippet (inline)', 'Direct'], [ATL, 'Code', 'Direct'], [FLU, 'Text (monospace)', 'Partial'], [POL, 'Text (code)', 'Partial'], [SPE, 'Code', 'Partial']],
      variantPages: [
        vp('Default inline code', 'Variant', 'Default', { variant: 'default' }, 'Inline code on the neutral fill inside a sentence on the page.', 'A class, file or command inside a paragraph', 'A whole line of code: use a Code block'),
        vp('Inline code on accent', 'Variant', 'On accent', { variant: 'on-accent' }, 'Inline code on the raised accent fill, for the blue header and accent banners.', 'Code inside text on an accent surface', 'Code on the page surface'),
        vp('Truncated inline code', 'Variant', 'Truncated', { variant: 'truncate' }, 'Inline code kept to one line and cut with an ellipsis; the whole value is its title.', 'Long paths in a narrow column or cell', 'Code people must read in full without a way to see it')
      ],
      examples: [['Variant', [['Default', function () { return para('Add ', h(P.Code, null, 'plx-link--standalone'), ' to the anchor.'); }, null, 'Code'],
        ['On accent', function () { return onAccent(h(P.Text, { variant: 'body' }, 'Press ', h(P.Code, { onAccent: true }, 'npm run build'), ' to publish')); }, 'plx-code--on-accent', 'onAccent'],
        ['Truncated', function () { return box(200, h(P.Code, { truncate: true }, 'platform/components/RichText/rich-text.css')); }, 'plx-code--truncate', 'truncate']]]] },
    { id: 'blockquote', lab: true, sec: 'content', sub: 'Text and reading', leaf: 'Blockquote', plenix: 'Blockquote', src: 'components/Blockquote/Blockquote.tsx', level: 'Component', interaction: 'Static', icon: 'message',
      aliases: ['Quote', 'Quotation', 'Pull quote', 'Citation'],
      text: 'Words quoted from someone else, set apart from the text around them by a rule at the start side, with the source under them. A pull quote lifts a short line out of the page, larger.',
      use: ['Quoting a person, a document or an earlier message inside reading content', 'A citation that names the source', 'A pull quote for one short line an article wants people to notice'],
      avoid: ['Making a point stand out that nobody said: use a Notice', 'Indenting text that is not a quote', 'A pull quote in a working screen: it belongs to articles'],
      related: ['rich-text', 'notice', 'text'],
      map: [[ATL, 'Renderer (blockquote)', 'Partial'], [CAR, 'Type (quotation)', 'Partial'], [SPE, 'Typography (quote)', 'Partial']],
      variantPages: [
        vp('Plain blockquote', 'Variant', 'Default', { variant: 'default' }, 'A quote in reading text at the body size with a rule at its start side.', 'A quote inside an article, a note or a comment', 'Text that only needs an indent'),
        vp('Blockquote with citation', 'Variant', 'With citation', { variant: 'citation' }, 'The quote with its source under it in the secondary style.', 'Any quote whose source people should know', 'A citation inside the quote itself'),
        vp('Pull quote', 'Variant', 'Pull quote', { variant: 'pull' }, 'A short line lifted out of an article, larger and at medium weight, with a stronger rule.', 'One line per article people should notice', 'Long passages, which are hard to read large')
      ],
      examples: [['Variant', [['Default', function () { return box(420, h(P.Blockquote, null, 'Every room gets its own folder before the first upload.')); }, null, 'variant="default"'],
        ['With citation', function () { return box(420, h(P.Blockquote, { citation: 'Ana Ruiz, project lead' }, 'Every room gets its own folder before the first upload.')); }, null, 'citation'],
        ['Pull quote', function () { return box(420, h(P.Blockquote, { variant: 'pull', citation: 'Ana Ruiz' }, 'The archive is the product.')); }, 'plx-blockquote--pull', 'variant="pull"']], { prop: 'variant' }]] },
    { id: 'ordered-list', lab: true, sec: 'content', sub: 'Text and reading', leaf: 'Ordered list', title: 'Ordered list', plenix: 'List', src: 'components/List/List.tsx', blocks: ['plx-list'], level: 'Component', interaction: 'Static', icon: 'list-lines',
      aliases: ['Numbered list', 'Steps', 'Nested list', 'Lettered list'],
      text: 'The List as an ordered list: statements numbered (1, 2, 3) or lettered (a, b, c) in the order they happen or rank. Steps can sit in circles, and a statement can hold one nested level.',
      use: ['Steps that must be done in order', 'Ranked items, or items the text refers to by number', 'Steps for a short task in a panel or an empty state', 'One nested level for the parts of a step'],
      avoid: ['Items whose order does not matter: use the icon list (Unordered list)', 'A task across several screens: use a Stepper', 'Nesting deeper than one level: split the step'],
      related: ['list', 'rich-text'],
      map: [[CAR, 'Ordered list', 'Direct'], [ATL, 'List (ordered)', 'Partial'], [POL, 'List (number)', 'Direct'], [SPE, 'List (ordered)', 'Partial']],
      variantPages: [
        vp('Numbered list', 'Variant', 'Ordered (decimal, default)', { variant: 'decimal' }, 'Statements numbered 1, 2, 3 in a muted number column that keeps them aligned.', 'Steps in order and ranked items', 'Items in no particular order'),
        vp('Lettered list', 'Variant', 'Ordered (alpha)', { variant: 'alpha' }, 'Statements lettered a, b, c, for choices or the parts of one step.', 'Options a text refers to by letter, and nested parts', 'Long lists past the letter z'),
        vp('Nested ordered list', 'Variant', 'Nested', { variant: 'nested' }, 'A list under one statement, starting on its text line, numbered or lettered on its own.', 'The parts of one step', 'More than one level of nesting'),
        vp('Steps list', 'Variant', 'Steps', { variant: 'steps' }, 'An ordered list whose numbers sit in circles the size of the line, for steps to follow.', 'A short how-to in a panel, a dialog or an empty state', 'Progress through a task: use a Stepper')
      ],
      examples: [['Variant', eachV(ORDERED, function (v) { return v[1]; }, function (v) { return v[2](); }, function (v) { return v[3]; }, function (v) { return v[4]; })],
        // the bulleted list (owner, 2026-10-15): a 4px gray-400 square before each point, the text justified; the spec draws long texts this way
        ['Bullets', [['Bulleted (square bullets)', function () { return box(360, h(P.List, { variant: 'bullets', label: 'Points', items: [{ children: 'Presence: online (green), away (yellow), busy (red), offline (gray).' }, { children: 'Workflow: done (green), in progress (blue), blocked (red), not started (gray).' }, { children: 'Each status keeps a 3:1 contrast on its surface in light and dark mode.' }] })); }, 'plx-list--bullets', 'variant="bullets"']]]] },
    { id: 'rich-text', lab: true, sec: 'content', sub: 'Text and reading', leaf: 'Rich text', title: 'Rich text', plenix: 'RichText', src: 'components/RichText/RichText.jsx', level: 'Component', interaction: 'Static', icon: 'doc-text',
      aliases: ['Prose', 'Formatted text', 'Markdown output', 'Renderer', 'Article body'],
      text: 'A prose container: headings, paragraphs, lists, links, inline code, code blocks and quotes from an editor’s or a Markdown renderer’s HTML (or JSX), in the Platform’s type styles. It sanitizes nothing: the application cleans the HTML first.',
      use: ['Descriptions, notes, comments and help that need more than one paragraph or inline formatting', 'Content from an editor or Markdown that must look like the rest of the Platform', 'article for a page of reading, compact for notes and comments in a panel'],
      avoid: ['Short labels and single values: use Text', 'Building a layout: use the layout components', 'HTML from people that has not been sanitized', 'Tables of data: use the DataGrid'],
      related: ['link', 'inline-code', 'blockquote', 'ordered-list', 'code-block'],
      map: [[ATL, 'Renderer', 'Partial'], [MAT, 'Typography', 'Partial'], [SPE, 'Typography', 'Partial'], [CAR, 'Type sets (expressive)', 'Partial']],
      variantPages: [
        vp('Article rich text', 'Variant', 'Article (default)', { variant: 'article' }, 'A page of reading at 14px with 24px lines, kept to a reading width of about 80 characters.', 'Help articles, guides and long descriptions', 'Notes in a narrow panel: use Compact'),
        vp('Compact rich text', 'Variant', 'Compact', { variant: 'compact' }, 'Prose at the body size with 20px lines and a tighter rhythm, at its container’s width.', 'Notes, comments and help inside a panel or a card', 'A page of reading, which needs the article size'),
        vp('Rich text in a panel', 'Placement', 'In a panel', { variant: 'compact', content: 'panel' }, 'Compact prose inside a panel, where its blocks keep the panel’s inset.', 'A note or a description in the inspector', 'A second frame around the prose inside the panel')
      ],
      examples: [['Variant', [['Article (default)', function () { return box(560, rich('article')); }, 'plx-rich-text--article', 'variant="article"'],
        ['Compact', function () { return box(360, rich('compact')); }, 'plx-rich-text--compact', 'variant="compact"']], { prop: 'variant' }],
        ['Placement', [['In a panel', function () { return box(360, h(P.Panel, { title: 'Notes' }, h(P.RichText, { variant: 'compact' }, h('p', null, 'The client wants the ', h('strong', null, 'oak'), ' finish.'), h('ul', null, h('li', null, 'Samples by Friday'), h('li', null, 'Quote in ', h('code', null, 'EUR')))))); }, null, 'variant="compact"']]]] },

    /* ── 13 Interaction, Accessibility & Utilities › Interaction foundations ── */
    { id: 'focus-order', sec: 'interaction', sub: 'Interaction foundations', leaf: 'Focus order', plenix: 'PlenixFocusOrder', src: 'dev/focus-order.js', css: ['system/focus-order.css'], level: 'Foundation', interaction: 'Utility', icon: 'select',
      aliases: ['Tab order', 'Tab sequence', 'Keyboard order', 'Reading order'],
      text: 'The Tab key reaches a page’s controls in reading order: the order of the markup, which is the order they are drawn in. A skip link is the first stop; focus moves into an overlay when it opens and back to its trigger when it closes. platform/dev/focus-order.js (?focus-order) numbers the stops on any page; tests/focus-order.test.js checks the pages.',
      use: ['Markup in reading order (start to end, top to bottom): the layout follows it', 'tabindex="0" only to make a custom control or a scroll area focusable; tabindex="-1" for an element that takes focus from script', 'A skip link as the first stop of an application (AppShell draws it)', 'useLayer for an overlay: focus moves in and returns to the trigger'],
      avoid: ['A positive tabindex: it moves the stop before everything else', 'CSS that draws controls in another order than the markup (order, row-reverse, absolute positions)', 'Moving focus when nothing was asked for, such as on hover or as content loads', 'Removing a hidden control from view but not from the Tab order'],
      related: ['focus-ring', 'keyboard-navigation', 'overlay-manager', 'application-shell'],
      map: [[CAR, 'Accessibility: keyboard', 'Partial'], [ATL, 'Focus order (guidance)', 'Partial'], [MAT, 'Accessibility: focus order', 'Direct'], [FLU, 'Keyboard navigation', 'Partial']],
      examples: [['Rule', [['DOM order = visual order', function () { return h(OrderDemo); }, null, 'markup in reading order'],
        ['Drawn out of order (avoid)', function () { return h(OrderDemo, { reverse: true }); }, null, 'flex-direction: row-reverse'],
        ['Focus moves into overlays and back', function () { return h(DialogDemo); }, null, 'Dialog (useLayer)'],
        ['Skip link first', function () { return h(P.CodeBlock, { title: 'AppShell', copy: false }, '<AppShell …>\n  <a class="plx-app-shell__skip" href="#main">Skip to main content</a>   // the first Tab stop\n  …\n</AppShell>'); }, null, 'AppShell']]],
        ['The overlay', [['On this page', function () { return h(OverlayToggle); }, null, '?focus-order · Ctrl+Shift+F']]]] },

    /* ── 13 Interaction, Accessibility & Utilities › Accessibility ── */
    { id: 'direction', sec: 'interaction', sub: 'Accessibility', leaf: 'RTL / bidirectional UI', title: 'Writing direction', plenix: 'DirectionProvider, useDirection, directionOf, arrowStep', src: 'providers/DirectionProvider.tsx',
      also: ['utils/direction.ts'], css: ['system/direction.css'], level: 'Foundation', interaction: 'Utility', icon: 'merge',
      aliases: ['RTL', 'Right to left', 'Bidirectional', 'Bidi', 'Mirroring', 'Logical properties'],
      text: 'Every Platform layout works right to left: stylesheets say start and end (inline-start, inline-end), never left and right, so a page or a region mirrors when dir="rtl" is set on it (DirectionProvider). The icon set mirrors its directional icons; text, numbers and media keep their shape. The Stylelint rule plenix/logical-properties rejects a physical side in a component stylesheet.',
      use: ['DirectionProvider (root for the page, or a region) with the locale or dir', 'Logical properties in every stylesheet: margin-inline-start, padding-inline-end, inset-inline-start, text-align: start', 'arrowStep for arrow keys and physicalSide where a measurement only speaks left and right', 'The icon set’s directional icons (chevrons, arrows, undo, redo), which mirror by themselves; .plx-mirror-rtl for a directional picture'],
      avoid: ['left, right, margin-left, padding-right, float: left or text-align: left in a component', 'Mirroring what has no direction: logos, numbers, clocks, media controls, check marks', 'A layout written twice, once per direction', 'Concatenated strings that put words in English order'],
      related: ['floating', 'keyboard-navigation', 'icon'],
      map: [[MAT, 'Bidirectionality', 'Direct'], [CAR, 'Globalization (bidi)', 'Partial'], [FLU, 'Right-to-left', 'Direct'], [POL, 'Internationalization (RTL)', 'Partial'], [SPE, 'Bidirectionality', 'Partial']],
      examples: [['Direction', [['Left to right', function () { return box(360, h(DirSample, { dir: 'ltr' })); }, null, 'dir="ltr"'],
        ['Right to left', function () { return box(360, h(DirSample, { dir: 'rtl' })); }, null, 'dir="rtl"']], { prop: 'dir' }],
        ['Rule', [['Mirrored icons', function () { return h(MirrorSample); }, null, 'icon set (bidirectional icons)'],
          ['Logical properties only', function () { return box(480, h(P.CodeBlock, { title: 'card.css', copy: false }, '/* yes */\n.plx-card { padding-inline-start: var(--plx-comp-card-padding-inline); text-align: start; }\n/* no: Stylelint rule plenix/logical-properties */\n.plx-card { padding-left: var(--plx-comp-card-padding-inline); text-align: left; }')); }, null, 'inline-start / inline-end']]]] }
  ];
});
