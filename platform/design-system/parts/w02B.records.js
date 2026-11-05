/* Plenix design system · library part w02B (wave 2, lane B): the type styles of the Text component (display, lead,
   body, label and caption; truncation, the line clamp, the expandable text and tabular figures: components/Text), the
   loading motion (system/motion.css and the loading tokens) and high contrast (system/forced-colors.css). The type
   styles' duplicate leaves in other sections (Truncate / expand, Truncate, Clamp) are thin records that show the main
   page's written sections. Text's own record (inventory.js) gets the cards of its new variants here, as its lab gets
   them in w02B.labs.js. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, use = H.use, box = H.box, eachV = H.eachV, q = H.q, cap = H.cap;
  var MAT = 'Material 3', CAR = 'Carbon', FLU = 'Fluent 2', SPE = 'Spectrum', ATL = 'Atlassian', POL = 'Polaris';
  var LONG = 'The quarterly brand review collects every logo, color and typeface decision made this quarter, with the files the press kit needs and the people who approved them.';
  var NAME = 'Quarterly brand review, final version for the press kit.pdf';

  /* ── the type styles ── */
  var STYLES = [['display', 'Display', '1,284 assets'], ['lead', 'Lead', 'Everything the brand team has approved, in one place.'], ['body', 'Body (default)', 'Cross – Traditional, gold border'],
    ['label', 'Label', 'File type'], ['caption', 'Caption', 'Uploaded 2 days ago']];
  var styleOf = function (s) { return h(P.Text, { variant: s[0], as: 'div' }, s[2]); };
  var clamp = function (n, more) { return box(240, h(P.Text, { as: 'p', lines: n, expandable: !!more }, LONG)); };
  var FIGURES = ['1,111.11', '9,876.54', '100.00'];
  var figures = function (tabular) { return h('div', { className: 'ds-type-figures' }, FIGURES.map(function (f) { return h(P.Text, { key: f, as: 'div', tabular: tabular }, f); })); };
  var OVERFLOW = [['Truncate', function () { return box(160, h(P.Text, { truncate: true, as: 'div' }, NAME)); }, 'plx-text--truncate', 'truncate'],
    ['2 lines', function () { return clamp(2); }, 'plx-text--lines-2', 'lines={2}'],
    ['3 lines', function () { return clamp(3); }, 'plx-text--lines-3', 'lines={3}'],
    ['4 lines', function () { return clamp(4); }, 'plx-text--lines-4', 'lines={4}'],
    ['Expandable', function () { return clamp(3, true); }, 'plx-text-expand', 'lines={3} expandable']];

  /* ── the loading motion ── */
  var SPIN = function () { return h('span', { className: 'ds-motion-ring plx-motion-spin', role: 'img', 'aria-label': 'Loading' }); };
  var SHIMMER = function () { return h('span', { className: 'ds-motion-block plx-motion-shimmer', role: 'img', 'aria-label': 'Loading' }); };
  var RUN = function () { return h('span', { className: 'ds-motion-track', role: 'img', 'aria-label': 'Loading' }, h('span', { className: 'ds-motion-fill plx-motion-progress' })); };
  var still = function (draw) { return function () { return h('div', { className: 'ds-motion-still' }, draw()); }; };
  // a request that answers fast or slowly: the indicator shows only after the loading delay
  var DelayDemo = function () {
    var busy = use(0), timer = React.useRef(null);
    React.useEffect(function () { return function () { clearTimeout(timer.current); }; }, []);
    var run = function (ms) { clearTimeout(timer.current); busy[1](ms); timer.current = setTimeout(function () { busy[1](0); }, ms); };
    return h(P.Stack, { gap: 'sm' },
      h(P.ButtonGroup, { label: 'Answer time' }, h(P.Button, { size: 'sm', onClick: function () { run(300); } }, 'Fast answer'), h(P.Button, { size: 'sm', onClick: function () { run(2500); } }, 'Slow answer')),
      h('div', { className: 'ds-motion-stage', 'aria-live': 'polite' }, busy[0] ? h('span', { className: 'plx-motion-delayed' }, SPIN()) : h(P.Text, { variant: 'secondary' }, 'Ready')));
  };

  /* ── high contrast ── */
  var specimen = function () {
    return h(P.Stack, { gap: 'sm' },
      h('div', { className: 'ds-demo-row' }, h(P.Button, { variant: 'primary', size: 'sm' }, 'Upload'), h(P.Button, { size: 'sm', selected: true }, 'Grid'), h(P.Button, { size: 'sm', disabled: true }, 'Delete')),
      box(240, h(P.Input, { 'aria-label': 'Asset name', defaultValue: 'Cross – Traditional' })),
      box(240, h(P.NavList, { label: 'Collections', items: [{ id: 'all', label: 'All assets', icon: 'grid-2x2' }, { id: 'web', label: 'Website assets', icon: 'briefcase' }], value: 'all', onSelect: H.noop })));
  };
  var RULES = [['Focus', 'The focus ring takes Highlight; a focused field, whose border is its only sign, a Highlight border'], ['Selection', 'A selected, current or pressed item takes Highlight with HighlightText'],
    ['Disabled', 'GrayText for the text and the border'], ['Boundaries', 'Menus, dialogs, sheets, tooltips, toasts and cards get a CanvasText outline (their shadow is gone)'],
    ['Icons', 'An icon follows the text color it sits in'], ['On and off', 'A checked switch and a progress fill take Highlight; the spinner keeps its gap'], ['Data color', 'Color swatches keep their real colors']];
  var ROLES = [['--plx-sys-border-subtle', '--plx-sys-border-strong'], ['--plx-sys-border-default', '--plx-sys-border-strong'], ['--plx-sys-border-divider', '--plx-sys-border-strong'], ['--plx-sys-control-border', '--plx-sys-border-strong'],
    ['--plx-sys-content-muted', '--plx-sys-content-default'], ['--plx-sys-content-subtle', '--plx-sys-content-default']];
  var roles = function () { return box(560, h(P.Table, { label: 'More contrast', data: ROLES.map(function (r, i) { return { id: i + 1, role: r[0], takes: r[1] }; }), columns: [{ title: 'Role', field: 'role', kind: 'data', rowLabel: true }, { title: 'In more contrast it takes', field: 'takes', kind: 'data' }] })); };
  var rules = function () { return box(560, h(P.Table, { label: 'Forced colors', data: RULES.map(function (r, i) { return { id: i + 1, what: r[0], how: r[1] }; }), columns: [{ title: 'What', field: 'what', kind: 'name', rowLabel: true, width: '--plx-ref-size-160px' }, { title: 'In forced colors', field: 'how', kind: 'wrap' }] })); };

  // a duplicate leaf: its own page (home = the leaf) showing the main page's written sections and one live example
  var thin = function (r) { return Object.assign({ plenix: 'Text', src: 'components/Text/Text.tsx', level: 'Primitive', interaction: 'Static', icon: 'ed-text', variantClasses: [], aliases: [], map: [], docsFrom: 'type-styles', related: ['type-styles', 'text'] }, r); };

  // Text's own record shows its new variants too (its lab draws them: w02B.labs.js)
  var text = H.record('text');
  if (text && text.examples) {
    text.examples.forEach(function (e) {
      if (e[0] === 'Variant' && Array.isArray(e[1])) e[1].push(['Display', function () { return styleOf(STYLES[0]); }, 'plx-text--display', 'variant=' + q('display')], ['Lead', function () { return styleOf(STYLES[1]); }, 'plx-text--lead', 'variant=' + q('lead')]);
      if (e[0] === 'Overflow' && Array.isArray(e[1])) e[1].push(OVERFLOW[1], OVERFLOW[2], OVERFLOW[3], OVERFLOW[4]);
    });
    text.examples.push(['Figures', [['Tabular', function () { return figures(true); }, 'plx-text--tabular', 'tabular']], { prop: 'tabular' }]);
  }

  return [
    /* ── 01 Foundations › Typography: the type styles ── */
    { id: 'type-styles', lab: true, sec: 'foundations', sub: 'Typography', leaf: 'Body styles', title: 'Type style', plenix: 'Text', src: 'components/Text/Text.tsx', css: ['components/Text/text.css'],
      level: 'Foundation', interaction: 'Static', icon: 'ed-text', aliases: ['Text styles', 'Type sets', 'Body text', 'Body large', 'Lead paragraph', 'Line clamp', 'Show more text'],
      covers: ['Label styles', 'Caption styles', 'Text truncation', 'Display type', 'Tabular figures'],
      variantClasses: ['plx-text--display', 'plx-text--lead', 'plx-text--body', 'plx-text--label', 'plx-text--caption', 'plx-text--truncate', 'plx-text--lines-2', 'plx-text--lines-3', 'plx-text--lines-4', 'plx-text--tabular'],
      text: 'The styles a run of text takes, from the largest to the smallest: display (one key figure), lead (an opening paragraph), body, secondary (12px), label and caption, each a variant of Text; how text that does not fit is cut (one line, or two to four lines with Show more); and tabular figures for numbers that line up.',
      use: ['Body for running text, descriptions and messages; lead once, for the opening paragraph of a page or an empty state', 'Label for the names of fields and small groups; caption for a short note under an image or a chart',
        'Display at most once per screen, for a key figure or a sign-in or welcome heading, with the heading level of its place (as="h1")', 'lines={2|3|4} for descriptions in cards and previews, expandable when people may need the rest; truncate for one-line names in rows and cells',
        'tabular for numbers that are compared down a column or change in place (totals, timers, counters)'],
      avoid: ['A font, size, weight or color set by an application: pick the style', 'Display in dense work areas, dialogs and panels: use Title or Heading', 'Cutting headings, errors and instructions: let them wrap',
        'Clamping text people must read in full without expandable', 'Tabular figures in running text, or the data font only to line numbers up'],
      related: ['text', 'typography', 'heading', 'numbers-and-units'],
      map: [[MAT, 'Type scale (display, body, label)', 'Direct'], [CAR, 'Type sets', 'Direct'], [FLU, 'Type ramp', 'Direct'], [SPE, 'Typography', 'Partial'], [POL, 'Text (variant, truncate, numeric)', 'Direct'], [ATL, 'Text (maxLines)', 'Partial']],
      variantPages: [
        { leaf: 'Display type', group: 'Style', name: 'Display', lab: { variant: 'display' }, text: 'The largest style: the heading font at the top step of the type scale, semibold, with a tight line height and letter spacing.', use: ['A dashboard’s key figure', 'The heading of a sign-in or welcome page'], avoid: ['More than one per screen', 'Text that wraps over several lines'] },
        { leaf: 'Lead text', group: 'Style', name: 'Lead', lab: { variant: 'lead' }, text: 'Body text one step up (15px) with a relaxed line height (body-lg).', use: ['The opening paragraph of a page', 'The explanation in an empty state'], avoid: ['Every paragraph: one lead per page'] },
        { leaf: 'Body style', group: 'Style', name: 'Body (default)', lab: { variant: 'body' }, text: 'The everyday interface text: the body font at 13px in the default content color.', use: ['Descriptions, messages and running text'], avoid: ['Headings and control labels'] },
        { leaf: 'Label styles', group: 'Style', name: 'Label', lab: { variant: 'label' }, text: 'Semibold 12px in the label font: short interface text in tight spaces.', use: ['Names of fields, small groups of controls and short group headings'], avoid: ['Sentences and paragraphs', 'Capitals for anything longer than a word'] },
        { leaf: 'Caption styles', group: 'Style', name: 'Caption', lab: { variant: 'caption' }, text: 'The smallest style, 11px in the subtle color, for a detail next to what it describes.', use: ['A caption under an image, a note under a chart, a timestamp'], avoid: ['Instructions or errors people must read', 'Interactive labels'] },
        { leaf: 'Text truncation', group: 'Overflow', name: 'Truncate', lab: { content: 'truncate' }, text: 'One line, cut with an ellipsis where its box ends; the whole text stays in the page.', use: ['File and asset names in rows, cells, tabs and breadcrumbs'], avoid: ['Headings, errors and instructions', 'Numbers, dates and amounts: give them room'] },
        { leaf: 'Two-line clamp', group: 'Overflow', name: '2 lines', lab: { content: 'lines-2' }, text: 'At most two lines, the second cut with an ellipsis (lines={2}).', use: ['Titles in cards and grid tiles'], avoid: ['One line: use truncate'] },
        { leaf: 'Three-line clamp', group: 'Overflow', name: '3 lines', lab: { content: 'lines-3' }, text: 'At most three lines (lines={3}).', use: ['Descriptions in cards and previews'], avoid: ['Text people must read in full without expandable'] },
        { leaf: 'Four-line clamp', group: 'Overflow', name: '4 lines', lab: { content: 'lines-4' }, text: 'At most four lines (lines={4}).', use: ['Summaries in list rows with room to spare'], avoid: ['Longer previews: show the text and its page instead'] },
        { leaf: 'Expandable text', group: 'Overflow', name: 'Expandable', lab: { content: 'expandable' }, text: 'A clamped text with a Show more button under it while it is cut; Show less folds it again.', use: ['Descriptions people sometimes need in full: an asset’s notes, a comment'], avoid: ['Text that always fits: the button shows only when the text is cut, so there is nothing to add'] },
        { leaf: 'Tabular figures', group: 'Figures', name: 'Tabular', lab: { content: 'tabular' }, text: 'Digits of equal width (font-variant-numeric: tabular-nums), so numbers line up and do not shift as they change.', use: ['Totals, timers, counters and numbers compared down a column, right-aligned'], avoid: ['Running text', 'The data font only to line numbers up'] }
      ],
      examples: [['Style', eachV(STYLES, function (s) { return s[1]; }, styleOf, function (s) { return 'plx-text--' + s[0]; }, function (s) { return 'variant=' + q(s[0]); }), { prop: 'variant' }],
        ['Overflow', OVERFLOW, { prop: 'lines' }],
        ['Figures', [['Tabular', function () { return figures(true); }, 'plx-text--tabular', 'tabular'], ['Proportional (default)', function () { return figures(false); }, null, 'tabular={false}']], { prop: 'tabular' }]] },

    /* ── 01 Foundations › Motion: loading motion ── */
    { id: 'loading-motion', sec: 'foundations', sub: 'Motion', leaf: 'Loading motion', level: 'Foundation', interaction: 'Static', icon: 'progress',
      css: ['system/motion.css', 'system/tokens/semantic.css'], aliases: ['Loading animation', 'Spinner rotation', 'Shimmer', 'Indeterminate progress'],
      text: 'The three animations that say the system is working, and their timing: the spinner’s even turn, the skeleton’s shimmer and the indeterminate progress run, as the classes plx-motion-spin, plx-motion-shimmer and plx-motion-progress on the --plx-sys-motion-loading-* tokens. With reduced motion each one stands still.',
      use: ['A progress bar with a value when the amount is known; the indeterminate run when it is not', 'A spinner for a short wait in a control or a small region; a skeleton where the layout of what is coming is known',
        'plx-motion-delayed on the indicator’s wrapper, so an answer faster than half a second shows nothing', 'A label that names the task (“Uploading 3 files”), for screen readers and for reduced motion'],
      avoid: ['Timing written in a stylesheet: the loading tokens', 'Several spinners in one view: one per region', 'Loading motion for a wait people never notice', 'Flashing more than three times a second'],
      related: ['motion', 'spinner', 'skeleton', 'progress-bar'],
      states: [['Running', 'The loop plays: the ring turns, the shimmer sweeps, the fill runs', 'plx-motion-spin, plx-motion-shimmer, plx-motion-progress'],
        ['Waiting', 'Nothing shows for the loading delay, then the indicator fades in', 'plx-motion-delayed on the wrapper'],
        ['Still', 'No animation: the ring, the flat skeleton, the fill at the start of its track', '@media (prefers-reduced-motion: reduce)']],
      map: [[CAR, 'Loading', 'Direct'], [MAT, 'Progress indicators', 'Direct'], [FLU, 'Spinner and Skeleton', 'Direct'], [ATL, 'Spinner and Skeleton', 'Direct'], [SPE, 'Progress circle', 'Partial']],
      examples: [['Animation', [['Spin', SPIN, 'plx-motion-spin', 'className="plx-motion-spin"'], ['Shimmer', SHIMMER, 'plx-motion-shimmer', 'className="plx-motion-shimmer"'], ['Indeterminate progress', RUN, 'plx-motion-progress', 'className="plx-motion-progress"']], { prop: 'className' }],
        ['Reduced motion', [['Spin, still', still(SPIN), null, '@media (prefers-reduced-motion: reduce)'], ['Shimmer, still', still(SHIMMER), null, '@media (prefers-reduced-motion: reduce)'], ['Progress, still', still(RUN), null, '@media (prefers-reduced-motion: reduce)']]],
        ['Delay', function () { return h(DelayDemo); }]] },

    /* ── 09 Overlays › Disclosure; 13 Interaction › Behavioral utilities: the type styles' overflow ── */
    thin({ id: 'overlays-truncate-expand', sec: 'overlays', sub: 'Disclosure', leaf: 'Truncate / expand', interaction: 'Disclosure', statesFrom: ['button'], icon: 'expand',
      purpose: 'Cuts long text to a set number of lines with an ellipsis, and lets the person show the whole text in place, so a layout stays steady without hiding what people need.',
      aliases: ['Show more text', 'Read more', 'Expandable text'], related: ['type-styles', 'text', 'expandable-section'],
      text: 'Text cut to two, three or four lines with a Show more button under it while it is cut (Text lines and expandable); Show less folds it again. One line cut with an ellipsis is truncate.',
      use: ['Long descriptions and notes in cards, lists and inspectors that people sometimes need in full'], avoid: ['Labels on buttons and critical values: rewrite or wrap them', 'A whole section: use a collapsible section'],
      examples: [['Expandable', function () { return clamp(3, true); }]] }),
    thin({ id: 'interaction-truncate', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Truncate', purpose: 'Keeps long text from breaking the layout: it cuts text to one line (Truncate) or a few lines (Clamp) with an ellipsis, while the whole text stays in the page.',
      aliases: ['Ellipsis', 'Text overflow'],
      text: 'The truncate prop of Text keeps a text to one line and cuts it with an ellipsis where its box ends; the whole text stays in the page for search, copy and screen readers.',
      use: ['Names in table cells, list rows, tabs and breadcrumbs of a fixed width'], avoid: ['Headings, errors and instructions', 'Text that could wrap at no cost'],
      examples: [['One line', OVERFLOW[0][1]]] }),
    thin({ id: 'interaction-clamp', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Clamp', purpose: 'Keeps long text from breaking the layout: it cuts text to one line (Truncate) or a few lines (Clamp) with an ellipsis, while the whole text stays in the page.',
      aliases: ['Line clamp', 'Multi-line truncation'],
      text: 'The lines prop of Text (2, 3 or 4) shows at most that many lines and cuts the last one with an ellipsis, with the CSS line clamp and a token per count; expandable adds Show more.',
      use: ['Descriptions in cards, previews and list summaries, so tiles keep an even height'], avoid: ['One line: use truncate', 'Text people must read in full without expandable'],
      examples: [['Three lines', function () { return clamp(3); }]] }),

    /* ── 13 Interaction › Accessibility: high contrast ── */
    { id: 'forced-colors', sec: 'interaction', sub: 'Accessibility', leaf: 'High contrast', title: 'High contrast', level: 'Foundation', interaction: 'Static', icon: 'visibility',
      css: ['system/forced-colors.css'], aliases: ['Forced colors', 'Windows High Contrast', 'Contrast themes', 'prefers-contrast', 'Increased contrast'],
      text: 'Every Platform page honors two requests a person makes of their system: forced colors (Windows contrast themes), where system/forced-colors.css draws focus, selection, disabled controls, boundaries and icons again with the system colors; and more contrast (prefers-contrast: more), where every border role takes the strong border, and muted and subtle text take the default text color.',
      use: ['Real borders and outlines for every boundary, so they survive forced colors', 'State shown with an outline, a border or a mark as well as a fill: forced colors remove fills and shadows', 'Icons as masks in the text color (Icon), so they follow the system colors',
        'Testing each new component with forced colors on (Chrome DevTools › Rendering › Emulate forced-colors) and with prefers-contrast: more'],
      avoid: ['State shown only by a background color or a shadow', 'forced-color-adjust: none, except where the color is the content (color swatches)', 'Instructions that name a color', 'A palette color in forced-colors rules: only system colors'],
      related: ['contrast-rules', 'interaction-states', 'focus-ring', 'use-of-color'],
      states: [['Focus', 'A Highlight focus ring; a focused field a Highlight border', ':focus-visible, :focus (fields)'], ['Selected, current, pressed', 'Highlight fill with HighlightText', 'aria-selected, aria-current, aria-pressed, aria-checked, is-selected, is-current'],
        ['Disabled', 'GrayText text and border', ':disabled, aria-disabled="true", is-disabled'], ['Checked (switch), progress', 'A Highlight track or fill', ':checked, the progress fill']],
      map: [[FLU, 'High contrast', 'Direct'], [MAT, 'Contrast levels', 'Partial'], [SPE, 'Windows high contrast', 'Partial'], [CAR, 'High contrast mode', 'Partial']],
      examples: [['Mode', [['Forced colors', function () { return h(P.Stack, { gap: 'md' }, specimen(), rules()); }, null, '@media (forced-colors: active)'],
          ['More contrast', function () { return h(P.Stack, { gap: 'md' }, specimen(), roles()); }, null, '@media (prefers-contrast: more)'],
          ['Standard (default)', specimen, null, '']], { prop: 'media' }]] }
  ];
});
