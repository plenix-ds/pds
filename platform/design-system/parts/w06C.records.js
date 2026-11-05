/* Plenix design system · library part w06C (wave 6, lane C): the toggle button (Button pressed), the async select and its
   checkbox and radio marks (Combobox loadOptions and marks), the range slider and marks (Slider range and marks),
   InlineEdit (Inline editable text, and the duplicate leaf Inline editing) and RichTextEditor (Rich-text editor). Every
   color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var frame = function (child) { return h('div', { 'data-ds-wrap': true, className: 'ds-w06c-open' }, child); };

  /* ── 05 Forms › Choice input › Toggle button: Button pressed ── */
  var Toggle = function (props) {
    var s = use(!!props.on);
    return h(P.Button, Object.assign({ pressed: s[0], onClick: function () { s[1](!s[0]); } }, props.button), props.children);
  };
  var TOGGLE_VARIANTS = [['secondary', 'Secondary (default)'], ['ghost', 'Ghost'], ['tertiary', 'Tertiary'], ['primary', 'Primary']];
  var toggleCards = TOGGLE_VARIANTS.map(function (v) {
    return [v[1], function () { return row(h(Toggle, { button: { variant: v[0] } }, 'Show grid'), h(Toggle, { on: true, button: { variant: v[0] } }, 'Show grid')); },
      v[0] === 'secondary' ? 'is-selected' : 'plx-button--' + v[0], 'variant=' + q(v[0]) + ' pressed'];
  });
  var toggleButton = { id: 'toggle-button', lab: true, icon: 'button', sec: 'forms', sub: 'Choice input', leaf: 'Toggle button', title: 'Toggle button',
    plenix: 'Button (pressed)', src: 'components/Button/Button.tsx', level: 'Component', interaction: 'Selection', statesFrom: ['button'], variantClasses: [],
    aliases: ['Toggle', 'Pressed button', 'Stateful button', 'On/off button'],
    text: 'A button that stays on or off: Button with pressed (true or false). Its label and icon never change: they name the option (Bold, Show grid), and aria-pressed says whether it is on. On is drawn with the selected state in every variant, so the state shows by fill and border as well as color.',
    use: ['Options that stay on, in toolbars: a format (bold), a view setting (show grid, show hidden files)', 'Several toggles side by side when any number of them can be on', 'Ghost toggles in dense toolbars; secondary elsewhere'],
    avoid: ['A setting in a form that applies right away: use a switch', 'One choice among a few views of the same content: use a segmented control', 'A label that changes with the state (Show / Hide): keep the option’s name'],
    related: ['button', 'segmented-control', 'toolbar', 'switch'],
    map: [[FLU, 'ToggleButton', 'Direct'], [MAT, 'Icon buttons (toggle)', 'Variant'], [SPE, 'Action button (selected)', 'Variant'], [POL, 'Button (pressed)', 'Variant'], [CAR, 'Icon button (selected)', 'Partial']],
    variantPages: [
      vp('Secondary toggle button', 'Variant', 'Secondary (default)', { variant: 'secondary' }, 'The default button that stays on: on, it takes the selected fill and border.', 'Toggles among other secondary buttons and on forms', 'Dense toolbars: use ghost'),
      vp('Ghost toggle button', 'Variant', 'Ghost', { variant: 'ghost' }, 'No fill or border while off; on, the selected fill and border.', 'Formatting and view toggles in toolbars and panel headers', 'A toggle that must be found at a glance'),
      vp('Tertiary toggle button', 'Variant', 'Tertiary', { variant: 'tertiary' }, 'Outlined in the action color while off; on, the selected fill and border.', 'A toggle that should stand out from the buttons around it', 'Several tertiary toggles in a row'),
      vp('Primary toggle button', 'Variant', 'Primary', { variant: 'primary' }, 'The filled action color while off; on, the selected fill and border.', 'Rarely: a main option that is on or off, such as Follow', 'Toolbars: a filled toggle competes with the primary action'),
      vp('Icon-only toggle button', 'Content', 'Icon only', { variant: 'ghost', content: 'icon-only' }, 'A square toggle with only its icon; its label names the option.', 'Well-known options in toolbars, with a tooltip', 'An option whose icon is not obvious: add the label')
    ],
    examples: [
      ['Variant', toggleCards, { prop: 'variant' }],
      ['Content', [['Icon only', function () { return row(h(Toggle, { button: { variant: 'ghost', icon: 'grid-2x2', iconOnly: true, label: 'Show grid' } }), h(Toggle, { on: true, button: { variant: 'ghost', icon: 'grid-2x2', iconOnly: true, label: 'Show grid' } })); }, 'plx-button--icon-only', 'iconOnly label pressed']]],
      ['In a toolbar', [['Several toggles', function () { return h(P.Toolbar, { label: 'View' }, h(P.Toolbar.Group, null, h(Toggle, { on: true, button: { variant: 'ghost', size: 'sm' } }, 'Show grid'), h(Toggle, { button: { variant: 'ghost', size: 'sm' } }, 'Show hidden files'), h(Toggle, { button: { variant: 'ghost', size: 'sm' } }, 'Show file names'))); }, null, 'pressed']]]] };

  /* ── 05 Forms › Select and lookup › Async select (and its variants Checkbox select, Radio select): Combobox loadOptions, marks ── */
  var PEOPLE = [{ value: 'rm', label: 'Jordan Avery' }, { value: 'rn', label: 'Rachel Ng' }, { value: 'ra', label: 'Ravi Anand' }, { value: 'jo', label: 'Joan Ortiz' },
    { value: 'mk', label: 'Mia Kowalski' }, { value: 'tb', label: 'Tom Brennan' }, { value: 'sl', label: 'Sara Lind' }];
  var CATS = [{ value: 'crosses', label: 'Crosses' }, { value: 'borders', label: 'Borders' }, { value: 'banners', label: 'Banners' }, { value: 'icons', label: 'Icons' },
    { value: 'logos', label: 'Logos' }, { value: 'photos', label: 'Photos' }, { value: 'textures', label: 'Textures' }];
  // a server that answers after a moment, matching the start of each word
  var searchPeople = function (text) {
    var t = text.toLowerCase();
    return new Promise(function (done) { setTimeout(function () { done(PEOPLE.filter(function (p) { return !t || p.label.toLowerCase().split(' ').some(function (w) { return w.indexOf(t) === 0; }); })); }, 600); });
  };
  var Async = function () { var s = use('rn'); return box(280, h(P.Combobox, { label: 'Owner', placeholder: 'Search people', loadOptions: searchPeople, value: s[0], onChange: s[1], options: [PEOPLE[1]] })); };
  var Marked = function (props) {
    var one = use('borders'), many = use(['crosses', 'banners']);
    return box(280, props.marks === 'radio'
      ? h(P.Combobox, { label: 'Category', marks: 'radio', options: CATS, value: one[0], onChange: one[1], placeholder: 'Choose a category' })
      : h(P.Combobox, { label: 'Categories', marks: 'checkbox', multiple: true, options: CATS, values: many[0], onChange: many[1], placeholder: 'Choose categories' }));
  };
  var asyncSelect = { id: 'async-select', lab: true, icon: 'select-chevron', sec: 'forms', sub: 'Select and lookup', leaf: 'Async select', title: 'Async select',
    plenix: 'Combobox (loadOptions, marks)', src: 'components/Combobox/Combobox.tsx', level: 'Component', interaction: 'Selection', statesFrom: ['combobox'], variantClasses: [],
    covers: ['Checkbox select', 'Radio select'],
    aliases: ['Remote select', 'Server-side select', 'Lazy select', 'Checkbox select', 'Radio select', 'Multiselect with checkboxes'],
    text: 'A Combobox that loads its options from the server as people type: after a short pause in typing, loadOptions(text) returns them (or a Promise of them). While they load, the list is busy and shows a spinner and “Loading…”; then the number of options is announced. A failed load says so in the list, and an answer that arrives after a newer request is dropped. With marks, each option shows the Checkbox (several, with multiple) or the Radio (one choice) before its label, so the chosen ones stay visible while people browse.',
    use: ['Lists too large to load at once, or that change: people, projects, assets', 'Checkbox marks for several values from about six to fifty options, such as filters', 'Radio marks for one choice from about six to fifteen options, when the current choice must stay marked in the list'],
    avoid: ['A short fixed list: use a select', 'Browsing everything: use a list with search', 'Checkbox marks on a single choice, radio marks on several'],
    related: ['combobox', 'multi-select', 'searchable-select', 'checkbox', 'radio'],
    map: [[ATL, 'Select (async, checkbox, radio)', 'Direct'], [SPE, 'Combo box (async loading)', 'Variant'], [CAR, 'Multiselect', 'Partial'], [FLU, 'Combobox (multiselect)', 'Partial'], [POL, 'Autocomplete (loading)', 'Partial'], [ANT, 'Select (remote search)', 'Partial']],
    variantPages: [
      vp('Async select loading', 'Options', 'Loaded as you type (async)', { variant: 'async' }, 'The options come from loadOptions; while they load, a spinner and “Loading…”.', 'People, projects and other large or live lists', 'A short fixed list: use a select'),
      vp('Checkbox select', 'Options', 'Checkbox marks (several)', { variant: 'checkbox' }, 'Each option with a checkbox; choosing toggles it and the list stays open.', 'Several values from a list, such as filters', 'Fewer than six options: use a checkbox group'),
      vp('Radio select', 'Options', 'Radio marks (one choice)', { variant: 'radio' }, 'Each option with a radio; choosing one closes the list.', 'One choice where the current one must stay marked in the list', 'Five or fewer options: use a radio group')
    ],
    examples: [['Options', [['Loaded as you type (async)', function () { return frame(h(Async)); }, 'plx-combobox__loading', 'loadOptions'],
      ['Checkbox marks (several)', function () { return frame(h(Marked, { marks: 'checkbox' })); }, 'plx-combobox--marks', 'marks=' + q('checkbox') + ' multiple'],
      ['Radio marks (one choice)', function () { return frame(h(Marked, { marks: 'radio' })); }, 'plx-combobox__mark', 'marks=' + q('radio')]], { prop: 'marks' }]] };

  /* ── 05 Forms › Numeric and range input › Range slider: Slider range, marks ── */
  var Range = function (props) { var s = use(props.start); return box(320, h(P.Slider, Object.assign({ value: s[0], onChange: s[1], onCommit: noop }, props.slider))); };
  var rangeSlider = { id: 'range-slider', lab: true, icon: 'filter', sec: 'forms', sub: 'Numeric and range input', leaf: 'Range slider', title: 'Range slider',
    plenix: 'Slider (range, marks)', src: 'components/Slider/Slider.tsx', level: 'Component', interaction: 'Input', statesFrom: ['slider'], variantClasses: [],
    aliases: ['Dual slider', 'Two-thumb slider', 'Min-max slider', 'Slider with marks'],
    text: 'Slider with range: two thumbs set a minimum and a maximum (value and onChange take [low, high]), the part between them filled. The thumbs never cross, and each is its own slider for the keyboard and for screen readers (“Price, minimum”). With marks, labeled values sit under the track in the data font. A range or marked slider draws its own track with the plain slider’s colors: the track, the filled part and the round thumbs.',
    use: ['Filters on a span of values: a price, a size, a date range', 'Number fields beside it when the exact values matter', 'Marks for a few meaningful values (0, 25, 50, 75, 100)'],
    avoid: ['A single value: use the slider', 'Exact entry as the main task: use two number fields', 'More marks than there is room for their labels'],
    related: ['slider', 'number-input'],
    map: [[SPE, 'Range slider', 'Direct'], [POL, 'Range slider (dual)', 'Direct'], [CAR, 'Slider (range)', 'Variant'], [MAT, 'Sliders (range)', 'Variant'], [ANT, 'Slider (range, marks)', 'Direct']],
    variantPages: [
      vp('Two-thumb range slider', 'Kind', 'Range (two thumbs)', { variant: 'range' }, 'A minimum and a maximum, the part between them filled.', 'Filters on a span of values', 'A single value: use the slider'),
      vp('Slider with marks', 'Kind', 'With marks', { variant: 'marks' }, 'Labeled values under the track, in the data font, centered on their place.', 'A few meaningful values people aim for', 'Many steps: the labels crowd')
    ],
    examples: [['Kind', [['Range (two thumbs)', function () { return h(Range, { start: [40, 160], slider: { range: true, label: 'Price', min: 0, max: 200, step: 5, unit: ' €' } }); }, 'plx-slider--range', 'range'],
      ['With marks', function () { return h(Range, { start: 50, slider: { label: 'Quality', min: 0, max: 100, step: 25, unit: '%', marks: [0, 25, 50, 75, 100] } }); }, 'plx-slider--marks', 'marks'],
      ['Range with marks', function () { return h(Range, { start: [2, 6], slider: { range: true, label: 'Rooms', min: 1, max: 8, step: 1, marks: true } }); }, 'plx-slider__mark', 'range marks']], { prop: 'range' }]] };

  /* ── 05 Forms › Text input › Inline editable text: InlineEdit ── */
  var STATUS = [{ value: 'draft', label: 'Draft' }, { value: 'review', label: 'In review' }, { value: 'approved', label: 'Approved' }];
  var Edit = function (props) {
    var s = use(props.start === undefined ? 'Cross 014' : props.start);
    return box(props.width || 320, h(P.InlineEdit, Object.assign({ label: 'Name', value: s[0], onConfirm: s[1] }, props.edit)));
  };
  var editCards = [
    ['Text (default)', function () { return h(Edit); }, null, 'type=' + q('text')],
    ['Text area', function () { return h(Edit, { start: 'Gold leaf on the border.\nRed ochre for the cross.', edit: { label: 'Description', type: 'textarea', placeholder: 'Add a description' } }); }, 'plx-inline-edit--textarea', 'type=' + q('textarea')],
    ['Select', function () { return h(Edit, { start: 'review', edit: { label: 'Status', type: 'select', options: STATUS } }); }, 'plx-inline-edit--select', 'type=' + q('select')],
    ['With confirm buttons', function () { return h(Edit, { edit: { confirmButtons: true, validate: function (v) { return v.trim() ? null : 'Enter a name.'; } } }); }, 'plx-inline-edit__actions', 'confirmButtons']
  ];
  var inlineEdit = { id: 'inline-edit', lab: true, icon: 'pencil', sec: 'forms', sub: 'Text input', leaf: 'Inline editable text', title: 'Inline edit',
    plenix: 'InlineEdit', src: 'components/InlineEdit/InlineEdit.tsx', level: 'Component', interaction: 'Input',
    aliases: ['Inline edit', 'Edit in place', 'Click to edit', 'Editable text'],
    text: 'A value people change where it is shown. The read view is a button with the value, the size of the field it becomes; hover tints it and a pencil shows. Activating it swaps in a text field, a text area or a select with the value: Enter saves (Ctrl+Enter in a text area), Escape puts it back, leaving the field saves. An invalid value stays open with its message under the field; a save that takes time shows the busy state; afterwards focus returns to the value and “Saved” is announced.',
    use: ['One value that people change often, in its context: a title, a status, a description on a record page or in a panel', 'Low-risk changes that are easy to change back', 'Confirm buttons where people may not know that leaving the field saves'],
    avoid: ['Several fields that change together: use a form', 'Changes that need review or approval', 'Values in a data grid: edit the table’s cells'],
    related: ['text-field', 'text-area', 'native-select', 'property-list', 'inline-editing'],
    map: [[ATL, 'Inline edit', 'Direct'], [CAR, 'Edit in place (IBM Products)', 'Partial'], [ANT, 'Typography (editable)', 'Partial']],
    states: [['Read', 'The value as text, the field’s size and padding, no border', 'The default'], ['Hover', 'The read view tinted, the pencil shown', ':hover'],
      ['Focused', 'The read view’s border in the focus color, the pencil shown; no ring outside it', ':focus-visible'], ['Empty', 'The prompt (“Add a description”) in the placeholder color', 'value=""'],
      ['Editing', 'The text field, text area or select with the value, the text selected', 'after a click, Enter or Space'], ['Invalid', 'The field’s border in the danger color, the message under it', 'validate returns a message'],
      ['Saving', 'The field read-only, the check button busy', 'onConfirm returns a Promise'], ['Disabled', 'The value without the hover tint or the pencil', 'disabled']],
    variantPages: [
      vp('Inline edit text', 'Field', 'Text (default)', { variant: 'text' }, 'A one-line value that becomes a text field.', 'Names and titles', 'Long text: use the text area'),
      vp('Inline edit text area', 'Field', 'Text area', { variant: 'textarea' }, 'Several lines that become a text area growing with its text; Ctrl+Enter saves.', 'Descriptions and notes', 'One-line values'),
      vp('Inline edit select', 'Field', 'Select', { variant: 'select' }, 'A value from a short list that becomes a select.', 'A status, a category', 'Long lists: use a combobox in a form'),
      vp('Inline edit with confirm buttons', 'Field', 'With confirm buttons', { variant: 'confirm' }, 'A check and a close button beside the field: save and cancel.', 'Places where people may not expect leaving the field to save', 'Dense lists where the buttons crowd'),
      vp('Inline edit read view', 'View', 'Read view', { variant: 'text', content: 'read' }, 'The value as a button the field’s size; hover tints it and shows the pencil.', 'Every inline edit: the value at rest', 'Styling it as a link: it opens an editor, it goes nowhere')
    ],
    examples: [['Field', editCards, { prop: 'type' }],
      ['View', [['Read view', function () { return h(Edit); }, 'plx-inline-edit__read', null], ['Empty', function () { return h(Edit, { start: '', edit: { label: 'Description', type: 'textarea', placeholder: 'Add a description' } }); }, 'is-empty', 'placeholder'],
        ['Technical value (data)', function () { return h(Edit, { start: 'IMG_4891.png', edit: { label: 'File name', data: true } }); }, 'plx-inline-edit--data', 'data']]]] };

  /* ── 10 Patterns › Creation and editing › Inline editing: the duplicate leaf (InlineEdit) ── */
  var inlineEditing = { id: 'inline-editing', icon: 'pencil', sec: 'patterns', sub: 'Creation and editing', leaf: 'Inline editing', title: 'Inline editing',
    plenix: 'InlineEdit', src: 'components/InlineEdit/InlineEdit.tsx', level: 'Pattern', interaction: 'Input', statesFrom: ['inline-edit'], variantClasses: [], docsFrom: 'inline-edit',
    aliases: ['Edit in place'], related: ['inline-edit', 'edit-flow'],
    text: 'Inline editing is InlineEdit on each value people change in place: the value turns into its field; Enter or leaving saves, Escape puts it back, and an error stays with the field.',
    use: ['Quick, frequent, low-risk changes to single values in a record page or a panel'], avoid: ['Several values that must change together: use an edit form'],
    map: [[ATL, 'Inline edit', 'Direct']],
    examples: [['Values on a record', function () {
      return box(360, h(P.Stack, { gap: 'sm' }, h(Edit, { start: 'Cross 014' }), h(Edit, { start: 'review', edit: { label: 'Status', type: 'select', options: STATUS } }),
        h(Edit, { start: '', edit: { label: 'Description', type: 'textarea', placeholder: 'Add a description' } })));
    }]] };

  /* ── 05 Forms › Text input › Rich-text editor: RichTextEditor ── */
  var START = '<p>The banner hangs in the <strong>north aisle</strong> from Easter to Pentecost.</p><ul><li>Gold leaf on the border</li><li>Red ochre for the cross</li></ul><p>See the <a href="#">naming guide</a> before you upload.</p>';
  var EVERY = '<h2>Every format</h2><p><strong>Bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <code>code</code>, H<sub>2</sub>O, x<sup>2</sup>, <mark>highlight</mark> and <a href="#">a link</a>.</p>'
    + '<ul data-type="taskList"><li data-type="taskItem" data-checked="true"><div><p>Gild the border</p></div></li><li data-type="taskItem" data-checked="false"><div><p>Hang the banner</p></div></li></ul>'
    + '<table><tbody><tr><th><p>Part</p></th><th><p>Color</p></th></tr><tr><td><p>Border</p></td><td><p>Gold leaf</p></td></tr></tbody></table><blockquote><p>A quote.</p></blockquote><pre><code>name: cross-014</code></pre><hr>';
  var editor = function (props) { return box(480, h(P.RichTextEditor, Object.assign({ label: 'Description', defaultValue: START }, props))); };
  var MENTION = { search: function (text) { var t = text.toLowerCase(); return PEOPLE.filter(function (p) { return p.label.toLowerCase().indexOf(t) === 0; }).slice(0, 6); } };
  var richTextEditor = { id: 'rich-text-editor', lab: true, icon: 'doc-text', sec: 'forms', sub: 'Text input', leaf: 'Rich-text editor', title: 'Rich-text editor',
    plenix: 'RichTextEditor', src: 'components/RichTextEditor/RichTextEditor.jsx', level: 'Component', interaction: 'Input', statesFrom: ['text-area', 'toolbar'],
    aliases: ['WYSIWYG editor', 'Formatted text editor', 'Rich text field', 'Text editor'],
    text: 'A field for formatted text on Tiptap, with all of Tiptap’s free formatting and its own keyboard behavior. The basic toolbar holds bold, italic, link and the two lists; the full toolbar holds every format, in groups, and the groups that do not fit move into a More formatting menu. The interface follows the design system; the content is the person’s own, so the colors, fonts, sizes and alignment they choose stay with their text. Tiptap’s shortcuts and Markdown rules work as people type; Tab nests list items and moves between table cells, and Escape then Tab leaves the editor. Paste brings plain text, and a mentions list can open under the caret.',
    use: ['Long-form content shown with its formatting: descriptions, notes, articles, comments', 'Documents people format themselves: headings, colors, fonts, alignment, task lists, tables and pictures', 'The basic toolbar for comments and short notes; the full toolbar for documents'],
    avoid: ['Plain notes: use a text area', 'Code: use a code editor', 'Tables of data people sort and filter: use the DataGrid', 'Editing together or embeds: RichTextEditor does not offer them yet, though its engine (Tiptap) carries them'],
    related: ['rich-text', 'text-area', 'toolbar', 'code-editor'],
    map: [[ATL, 'Editor (Atlassian Editor)', 'Partial'], [CAR, 'Rich text editor (IBM Products)', 'Partial'], [POL, 'Rich text editor (Shopify admin)', 'Partial'], ['Tiptap', 'Tiptap 3.31.3 (StarterKit, TaskList, Table, TextStyle, Color, FontFamily, FontSize, Highlight, TextAlign, Subscript, Superscript, Image, Typography, Mention)', 'Direct']],
    states: [['Enabled', 'The field’s border and surface; the toolbar over the area, a divider between them', 'The default'], ['Hover', 'The frame’s border in the strong border color', ':hover'],
      ['Focused', 'The frame’s border in the focus color while the area or the toolbar has focus; no ring outside it', ':focus-within'], ['Format on', 'The button of each format at the caret pressed (the selected state)', 'aria-pressed'], ['Overflow', 'The groups that do not fit in a More formatting menu at the end of the row', 'a narrow frame'],
      ['Invalid', 'The frame’s border in the danger color, the message under it', 'invalid, or error on its Field'], ['Read-only', 'No toolbar, the sunken fill; the text can be selected and copied', 'readOnly'],
      ['Disabled', 'The disabled fill and text; nothing takes focus', 'disabled']],
    variantPages: [
      vp('Basic rich-text editor', 'Toolbar', 'Basic (default)', { variant: 'basic' }, 'Icon buttons for bold, italic, link, bulleted and numbered list, each with a tooltip of its name and shortcut.', 'Descriptions, comments and notes', 'Documents that need headings: use the full toolbar'),
      vp('Rich-text editor with the full toolbar', 'Toolbar', 'Full toolbar', { variant: 'full' }, 'Every format in groups: text style (paragraph, heading 1–6); font and size; bold, italic, underline, strikethrough, inline code, subscript, superscript; text color and highlight; alignment; bulleted, numbered and task list; link, image, table, code block, quote, horizontal rule; undo, redo, clear formatting. Groups that do not fit move into More formatting.', 'Articles and documents people format themselves', 'Short comments: the basic toolbar is enough'),
      vp('Rich-text editor formats', 'Formats', 'Every format', { variant: 'full', content: 'formats' }, 'Every element the editor writes, as it is shown: headings, marks, a highlight, a link, a task list, a table in the Plenix table’s look, a quote, a code block in Reddit Mono and a rule. The person’s colors, fonts, sizes and alignment stay with their text.', 'Checking how saved content looks', 'Styling content from the interface: the content is the person’s'),
      vp('Rich-text editor keyboard', 'Formats', 'Keyboard', { variant: 'full', content: 'text' }, 'Tiptap’s own shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Shift+S, Ctrl+E, Ctrl+, and Ctrl+., Ctrl+Shift+H, Ctrl+Alt+0 to 6, Ctrl+Shift+L, E, R and J, Ctrl+Shift+7, 8 and 9, Ctrl+Shift+B, Ctrl+Alt+C, Shift+Enter, Ctrl+Z, Ctrl+Y) and Plenix’s Ctrl+K, each in its button’s tooltip. Tab and Shift+Tab nest and lift list items and move between table cells; Escape, then Tab, leaves the editor.', 'Everyone who writes with the keyboard', 'Overriding Tab: Escape then Tab is the way out'),
      vp('Rich-text editor Markdown shortcuts', 'Behavior', 'Markdown shortcuts', { variant: 'basic', content: 'markdown' }, 'Tiptap’s rules as people type: “- ”, “1. ”, “[ ] ”, “# ” to “###### ”, “> ”, “```” and “---” at the start of a line; **bold**, *italic*, ~~strike~~, ==highlight== and `code` around words; smart quotes, -- an em dash, ... an ellipsis. One Backspace right after one turns it back into the typed characters.', 'People who write Markdown already', 'Turning them off without a reason: they never get in the way'),
      vp('Rich-text editor with mentions', 'Behavior', 'Mentions slot', { variant: 'basic', content: 'mentions' }, 'Typing @ opens the list of people under the caret; a mention is one unit in the text.', 'Comments that notify people', 'Mentions where nobody is notified'),
      vp('Read-only rich-text editor', 'Toolbar', 'Read-only', { variant: 'read-only' }, 'The content without the toolbar, on the sunken fill; it can be selected and copied.', 'Showing what someone wrote where it is edited at other times', 'Pages that only show content: use RichText')
    ],
    examples: [
      ['Toolbar', [['Basic (default)', function () { return editor({}); }, null, 'toolbar=' + q('basic')], ['Full toolbar', function () { return editor({ toolbar: 'full' }); }, null, 'toolbar=' + q('full')],
        ['Read-only', function () { return editor({ readOnly: true }); }, 'is-read-only', 'readOnly']], { prop: 'toolbar' }],
      ['Formats', [['Every format', function () { return editor({ toolbar: 'full', defaultValue: EVERY }); }, 'plx-user-content', 'toolbar=' + q('full')],
        ['Keyboard', function () { return editor({ toolbar: 'full', placeholder: 'Ctrl+B bold, Ctrl+Alt+2 heading 2, Tab nests a list item; Escape then Tab leaves' }); }, null, 'toolbar=' + q('full')]]],
      ['Behavior', [['Markdown shortcuts', function () { return editor({ defaultValue: '', placeholder: 'Type “- ” for a list or **bold**' }); }, null, 'markdownShortcuts'],
        ['Mentions slot', function () { return editor({ label: 'Comment', defaultValue: '<p>Thanks, <span data-mention="rn">@Rachel Ng</span>. Type @ to mention someone.</p>', mentions: MENTION }); }, 'plx-rich-text-editor__mention', 'mentions']]]] };

  // the combobox and slider pages show their new variants too (their stylesheets' new classes)
  var combobox = H.record('combobox');
  if (combobox && combobox.examples) combobox.examples.push(['Marks', [['Checkbox marks (several)', function () { return frame(h(Marked, { marks: 'checkbox' })); }, 'plx-combobox--marks', 'marks=' + q('checkbox')],
    ['Radio marks (one choice)', function () { return frame(h(Marked, { marks: 'radio' })); }, 'plx-combobox__mark', 'marks=' + q('radio')]], { prop: 'marks' }]);
  var slider = H.record('slider');
  if (slider && slider.examples) slider.examples.push(['Kind', [['Range (two thumbs)', function () { return h(Range, { start: [40, 160], slider: { range: true, label: 'Price', min: 0, max: 200, step: 5, unit: ' €' } }); }, 'plx-slider--custom', 'range'],
    ['With marks', function () { return h(Range, { start: 50, slider: { label: 'Quality', min: 0, max: 100, step: 25, unit: '%', marks: [0, 25, 50, 75, 100] } }); }, 'plx-slider--marks', 'marks']], { prop: 'range' }]);

  return [toggleButton, asyncSelect, rangeSlider, inlineEdit, inlineEditing, richTextEditor];
});
