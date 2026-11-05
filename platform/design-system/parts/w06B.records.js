/* Plenix design system · library part w06B (wave 6, lane B): the Form pattern (Form section, Form actions), Field's
   character counter, the input family's read-only field and appearances (Field style variants), the autogrowing text
   area, OtpInput (PIN / OTP input), and SearchField's suggestions and recent searches (Search suggestions, Recent
   searches, and the duplicate leaves Autocomplete search and Search history). Every color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var para = function (t) { return h(P.Text, { as: 'p' }, t); };
  var searchFrame = function (child) { return h('div', { 'data-ds-wrap': true, className: 'ds-w06b-search' }, child); };

  /* ── 05 Forms › Form foundations › Form section: Form, FormSection, FormActions ── */
  var CATS = [{ value: 'crosses', label: 'Crosses' }, { value: 'borders', label: 'Borders' }, { value: 'banners', label: 'Banners' }];
  var formDemo = function (layout, withActions, sticky) {
    return box(560, h(P.Form, { label: 'Asset details', layout: layout, onSubmit: function (e) { e.preventDefault(); } },
      h(P.FormSection, { title: 'General', description: 'Shown on the asset card and in search results.' },
        h(P.Field, { label: 'Name', required: true }, h(P.Input, { defaultValue: 'Cross 014' })),
        h(P.Field, { label: 'Category' }, h(P.Select, { options: CATS, defaultValue: 'crosses' }))),
      h(P.FormSection, { title: 'Usage rights' },
        h(P.Field, { label: 'License' }, h(P.Input, { defaultValue: 'Internal use' })),
        h(P.Field, { label: 'Credit', description: 'Printed under the image.' }, h(P.Input, { defaultValue: 'Parish archive' }))),
      withActions ? h(P.FormActions, { sticky: sticky !== false }, h(P.Button, { onClick: noop }, 'Cancel'), h(P.Button, { type: 'submit', variant: 'primary' }, 'Save changes')) : null));
  };
  var formSection = { id: 'form-section', lab: true, icon: 'fields', sec: 'forms', sub: 'Form foundations', leaf: 'Form section', title: 'Form',
    plenix: 'Form, FormSection, FormActions', src: 'patterns/Form/Form.jsx', level: 'Composite', interaction: 'Input', statesFrom: ['field', 'button'],
    aliases: ['Form layout', 'Form group', 'Form block', 'Fieldset section'],
    text: 'Lays out every form the same way: Form holds titled sections (FormSection: a heading, one sentence of why, and its fields in a Stack), then one bar of actions (FormActions). One column puts every label above its control. Two columns, for settings-like forms with many short fields, put the labels beside their controls in one shared label column. Sections are separated by space only, so a form in a card or a dialog stays two frames deep.',
    use: ['A form of more than about six fields that fall into clear topics: one section per topic, in the order people think about the task', 'Two columns for many short fields people scan (settings, properties); one column for everything else and every narrow window', 'One FormActions at the end of the form, the primary action last'],
    avoid: ['Sections for two or three fields: a plain form reads faster', 'Sections that are separate tasks: use steps or separate pages', 'Mixing one- and two-column sections in one form', 'Actions in every section'],
    related: ['field', 'fieldset', 'form-actions', 'page-actions', 'settings-page'],
    map: [[CAR, 'Form', 'Partial'], [ATL, 'Form (form section)', 'Direct'], [POL, 'Form layout', 'Partial'], [SPE, 'Form', 'Partial'], [ANT, 'Form', 'Partial']],
    variantPages: [
      vp('One-column form', 'Layout', 'One column (default)', { variant: 'one-column' }, 'Every label above its control, the sections stacked in one column.', 'Most forms, and every form on a narrow window', 'Long settings lists people scan: use two columns'),
      vp('Two-column form', 'Layout', 'Two columns (labels beside)', { variant: 'two-column' }, 'The labels beside their controls in one shared label column, as wide as the longest label.', 'Settings-like forms with many short fields', 'Fields that need room to type, such as descriptions'),
      vp('Titled form section', 'Parts', 'Titled section', { content: 'section' }, 'A section named by its heading, with one sentence of why under it and its fields below.', 'A long form split into topics people can scan and find again', 'A section for two or three fields'),
      vp('Form with sticky actions', 'Parts', 'Actions at the end (sticky)', { content: 'actions' }, 'One bar of actions after the last section, kept in view while a long form scrolls.', 'Every form that saves or submits', 'Actions repeated at the top and the bottom of a short form')
    ],
    examples: [
      ['Layout', [['One column (default)', function () { return formDemo('one-column', false); }, 'plx-form--one-column', 'layout=' + q('one-column')],
        ['Two columns (labels beside)', function () { return formDemo('two-column', false); }, 'plx-form--two-column', 'layout=' + q('two-column')]], { prop: 'layout' }],
      ['Parts', [['Titled section', function () { return box(560, h(P.FormSection, { title: 'General', description: 'Shown on the asset card.' }, h(P.Field, { label: 'Name' }, h(P.Input, { defaultValue: 'Cross 014' })))); }, 'plx-form-section', 'FormSection title'],
        ['Actions at the end (sticky)', function () { return formDemo('one-column', true); }, 'plx-form-actions', 'FormActions']]]] };

  /* ── 05 Forms › Form foundations › Form actions: FormActions ── */
  var actions = function (sticky) { return box(560, h(P.FormActions, { sticky: sticky }, h(P.Button, { variant: 'danger-secondary', onClick: noop }, 'Delete'), h(P.Button, { onClick: noop }, 'Cancel'), h(P.Button, { variant: 'primary', onClick: noop }, 'Save changes'))); };
  var formActions = { id: 'form-actions', icon: 'save', sec: 'forms', sub: 'Form foundations', leaf: 'Form actions', title: 'Form actions',
    plenix: 'FormActions', src: 'patterns/Form/Form.jsx', blocks: ['plx-form-actions'], level: 'Composite', interaction: 'Action', statesFrom: ['button'],
    aliases: ['Form footer', 'Form buttons', 'Submit bar', 'Save bar'],
    text: 'The one bar of buttons that finishes or leaves a form. FormActions is the form’s ActionBar: the buttons at the end in reading order, the primary last, a destructive action first and away from it. By default (sticky) it stays at the bottom of the scrolling page while the form is longer than the window; with sticky={false} it sits in place under the last section, in a short form or a card.',
    use: ['Every form that changes data: one primary action named by its verb (Save changes, Create asset), Cancel beside it', 'Sticky in long forms on a page or in a panel', 'In place in a short form or a form inside a card'],
    avoid: ['Disabling the primary action until the form is valid: check on submit and show the errors', 'Repeating the actions at the top and the bottom', 'A Reset button people rarely need'],
    related: ['form-section', 'page-actions', 'button'],
    map: [[ATL, 'Form footer', 'Direct'], [CAR, 'Form (buttons)', 'Partial'], [POL, 'Page actions', 'Partial'], [ANT, 'Form.Item (submit)', 'Partial']],
    examples: [['Placement', [['Sticky (default)', function () { return actions(true); }, 'plx-form-actions', 'sticky'],
      ['In place', function () { return actions(false); }, 'plx-form-actions--static', 'sticky={false}']], { prop: 'sticky' }]] };

  /* ── 05 Forms › Form foundations › Character counter: Field counter ── */
  var Counted = function (props) {
    var s = use(props.start);
    return box(400, h(P.Field, { label: 'Summary', description: 'Shown in search results', counter: true }, h(P.Input, { maxLength: 60, value: s[0], onChange: function (e) { s[1](e.target.value); } })));
  };
  var characterCounter = { id: 'character-counter', lab: true, icon: 'fields', sec: 'forms', sub: 'Form foundations', leaf: 'Character counter', title: 'Character counter',
    plenix: 'Field (counter)', src: 'components/Field/Field.tsx', level: 'Component', interaction: 'Input', statesFrom: ['field'], variantClasses: [],
    aliases: ['Character count', 'Length counter', 'Characters remaining'],
    text: 'Counts the characters used against the limit (“42/60”, in the data font) at the end of a field’s help line. Set it on the Field with counter; the limit is the control’s maxLength, or a number. People may type past the limit: nothing is cut off, and the count and the control turn invalid. Screen readers hear “18 characters left” as part of the field’s description and, near the limit and past it, the characters left or over once typing pauses.',
    use: ['A field with a hard maximum, such as a summary shown elsewhere or a message with a length limit', 'Say the limit in the description too when it matters before typing'],
    avoid: ['Fields with no limit', 'Cutting text off silently at the limit', 'A counter on every field of a form'],
    related: ['field', 'text-field', 'text-area'],
    map: [[MAT, 'Text fields (character counter)', 'Variant'], [CAR, 'Text area (character count)', 'Variant'], [POL, 'Text field (character count)', 'Variant'], [SPE, 'Text area (character count)', 'Variant']],
    variantPages: [
      vp('Field with a character counter', 'Count', 'Character counter', { content: 'counter' }, 'The count of characters used against the limit, at the end of the help line.', 'A field with a maximum length', 'A field with no limit'),
      vp('Character count over the limit', 'Count', 'Over the limit', { content: 'over' }, 'Past the limit the count and the field take the danger color; nothing is cut off.', 'Letting people edit text that is too long', 'Blocking typing at the limit')
    ],
    examples: [['Count', [['Character counter', function () { return h(Counted, { start: 'Gold leaf border for the feast-day banners' }); }, 'plx-field__counter', 'counter'],
      ['Over the limit', function () { return h(Counted, { start: 'Gold leaf border for the feast-day banners in the north aisle, 2019' }); }, 'is-over', 'counter']]]] };

  /* ── 05 Forms › Form foundations › Read-only field ── */
  var readOnlyField = { id: 'read-only-field', lab: true, icon: 'lock', sec: 'forms', sub: 'Form foundations', leaf: 'Read-only field', title: 'Read-only field',
    plenix: 'Input, Textarea (readOnly)', src: 'components/Input/Input.tsx', level: 'Component', interaction: 'Input', statesFrom: ['text-field'], variantClasses: [],
    aliases: ['Locked field', 'Non-editable field', 'View-only field'],
    text: 'readOnly on the field: a value people can read, select and copy in its form but not change. It keeps its border and full text contrast on the sunken surface, stays in the Tab order and is read as read-only. When the reason is not obvious, the Field’s description says why (“Set by your administrator”). An empty read-only value shows an em dash.',
    use: ['A value the person may see but not change (permissions), or one the system sets (an ID, a created date) inside an editable form', 'Say why it is locked in the description'],
    avoid: ['A value that does not apply now: use disabled', 'A whole page of read-only fields: show the values as a property list', 'A native select as read-only (browsers still open it): show the value in a read-only Input'],
    related: ['text-field', 'text-area', 'field', 'property-list'],
    map: [[CAR, 'Read-only states', 'Direct'], [SPE, 'Text field (read-only)', 'Variant'], [ATL, 'Text field (read-only)', 'Variant'], [POL, 'Text field (read-only)', 'Variant']],
    examples: [
      ['Read-only', [['Text field', function () { return box(320, h(P.Field, { label: 'Asset ID', description: 'Set when the asset is created.' }, h(P.Input, { data: true, readOnly: true, defaultValue: 'AST-1042' }))); }, null, 'readOnly'],
        ['Text area', function () { return box(320, h(P.Field, { label: 'Notes', description: 'Set by your administrator.' }, h(P.Textarea, { readOnly: true, defaultValue: 'Imported from the parish archive, 2019.' }))); }, null, 'readOnly'],
        ['Empty value', function () { return box(320, h(P.Field, { label: 'Approved by' }, h(P.Input, { readOnly: true, defaultValue: '—' }))); }, null, 'readOnly']]]] };

  /* ── 05 Forms › Form foundations › Field style variants: appearance ── */
  var looks = function (a) { return box(320, h(P.Stack, { gap: 'md' }, h(P.Field, { label: 'Name' }, h(P.Input, { appearance: a, defaultValue: 'Cross 014' })),
    h(P.Field, { label: 'Category' }, h(P.Select, { appearance: a, options: CATS, defaultValue: 'crosses' })), h(P.Field, { label: 'Notes' }, h(P.Textarea, { appearance: a, defaultValue: 'Gold leaf on the border' })))); };
  var APPEARANCES = [['outline', 'Outline (default)'], ['filled', 'Filled']];
  var appearanceCards = APPEARANCES.map(function (a) { return [a[1], function () { return looks(a[0]); }, a[0] === 'outline' ? null : 'plx-input--' + a[0], 'appearance=' + q(a[0])]; });
  var fieldStyleVariants = { id: 'field-style-variants', lab: true, icon: 'fields', sec: 'forms', sub: 'Form foundations', leaf: 'Field style variants', title: 'Field style variants',
    plenix: 'Input, Textarea, Select (appearance)', src: 'components/Input/Input.tsx', level: 'Component', interaction: 'Input', statesFrom: ['text-field'], variantClasses: [],
    aliases: ['Field appearance', 'Filled field', 'Gray field', 'Input variants'],
    text: 'The two looks of the text field family, chosen with appearance on Input, Textarea and Select: outline (the default, a border on every side) and filled (the same border and corners on a gray fill, the value in dark gray). Labels, help, errors and every state are the same in each. Hover and focus change only the color of the border, never a ring outside it. An invalid field has a 2px danger border on the lightest red fill.',
    use: ['Outline for forms, dialogs and settings', 'Filled where a quieter field fits better, such as a dense panel or a field inside a toolbar', 'One appearance for every field of a form'],
    avoid: ['Mixing appearances in one form', 'A new appearance for one screen'],
    related: ['text-field', 'text-area', 'native-select', 'field'],
    map: [[MAT, 'Text fields (filled, outlined)', 'Direct'], [FLU, 'Input (appearance)', 'Direct'], [SPE, 'Text field (quiet)', 'Variant'], [ATL, 'Text field (appearance)', 'Variant'], [CAR, 'Text input (fluid)', 'Variant']],
    variantPages: [
      vp('Outline field', 'Appearance', 'Outline (default)', { variant: 'outline' }, 'A border on every side: the field people expect in a form.', 'Forms, dialogs and settings', 'A dense panel where the borders crowd the content'),
      vp('Filled field', 'Appearance', 'Filled', { variant: 'filled' }, 'The outline field\'s border and corners on a gray fill, the value in dark gray.', 'A dense panel or a sheet where a lighter field fits', 'Fields on a gray surface, where the fill disappears'),
    ],
    examples: [['Appearance', appearanceCards, { prop: 'appearance' }]] };
  // the text field and text area pages show their new variants too (their stylesheet's new classes)
  var textField = H.record('text-field');
  if (textField && textField.examples) textField.examples.push(['Appearance', APPEARANCES.map(function (a) { return [a[1], function () { return box(240, h(P.Input, { 'aria-label': 'Name', appearance: a[0], defaultValue: 'Cross 014' })); }, a[0] === 'outline' ? null : 'plx-input--' + a[0], 'appearance=' + q(a[0])]; }), { prop: 'appearance' }]);
  var Grow = function (props) { var s = use(props.start); return box(400, h(P.Field, { label: 'Notes' }, h(P.Textarea, { autoGrow: true, value: s[0], onChange: function (e) { s[1](e.target.value); } }))); };
  var GROW_LONG = 'Gold leaf on the border.\nRed ochre for the cross.\nThe banner hangs in the north aisle.\nIt is used at Easter and Pentecost.\nThe archive keeps the original sketch.\nScan it at 600 dpi.\nCredit the parish.\nKeep the colors as printed.\nAsk before cropping.\nThe file is the master copy.\nName new versions by date.';
  var textArea = H.record('text-area');
  if (textArea && textArea.examples) textArea.examples.push(['Height', [['Grows with its text', function () { return h(Grow, { start: 'Gold leaf on the border.' }); }, 'plx-input--auto-grow', 'autoGrow']], { prop: 'autoGrow' }]);

  /* ── 05 Forms › Text input › Autogrowing text area: Textarea autoGrow ── */
  var autogrowingTextArea = { id: 'autogrowing-text-area', lab: true, icon: 'ed-text', sec: 'forms', sub: 'Text input', leaf: 'Autogrowing text area', title: 'Autogrowing text area',
    plenix: 'Textarea (autoGrow)', src: 'components/Input/Input.tsx', level: 'Component', interaction: 'Input', statesFrom: ['text-area'], variantClasses: [],
    aliases: ['Auto-resizing text area', 'Expanding text area', 'Growing text area'],
    text: 'Textarea autoGrow: a text area that grows a line at a time as people type, from its minimum height up to ten lines (--plx-comp-textarea-auto-grow-max-height), then scrolls inside. The browser sizes it to its content (field-sizing); where it cannot, the text area measures its content and sets its height on the 4px grid. It cannot be resized by hand, and Enter stays a new line.',
    use: ['Comments, descriptions and notes whose length varies', 'Reply and message boxes'],
    avoid: ['One-line values: use a text field', 'Formatted content: use a rich-text editor', 'Submitting on Enter, unless it is a chat box that says so'],
    related: ['text-area', 'character-counter', 'field'],
    map: [[POL, 'Text field (multiline)', 'Variant'], [MAT, 'Text fields (multi-line)', 'Variant'], [ATL, 'Text area', 'Partial'], [FLU, 'Textarea', 'Partial'], [SPE, 'Text area', 'Partial']],
    variantPages: [
      vp('Short autogrowing text area', 'Content', 'A short note', { content: 'short' }, 'With a little text it keeps its minimum height.', 'Notes that are usually one or two lines', 'A single value: use a text field'),
      vp('Autogrowing text area past its maximum', 'Content', 'Past the maximum (scrolls)', { content: 'long' }, 'At ten lines it stops growing and scrolls inside.', 'Long notes that must not push the page down without end', 'Text people read in full: show it as text')
    ],
    examples: [['Growth', [['Grows with its text', function () { return h(Grow, { start: 'Gold leaf on the border.' }); }, null, 'autoGrow']]],
      ['Content', [['A short note', function () { return h(Grow, { start: 'Gold leaf on the border.' }); }, null, 'autoGrow'],
        ['Past the maximum (scrolls)', function () { return h(Grow, { start: GROW_LONG }); }, null, 'autoGrow']]]] };

  /* ── 05 Forms › Text input › PIN / OTP input: OtpInput ── */
  var Otp = function (props) {
    var s = use(props.value || ''), done = use('');
    return box(400, h(P.Field, { label: props.label || 'Verification code', description: props.description, error: props.error },
      h(P.OtpInput, Object.assign({ value: s[0], onChange: s[1], onComplete: done[1] }, props.otp))));
  };
  var otpInput = { id: 'otp-input', lab: true, icon: 'lock', sec: 'forms', sub: 'Text input', leaf: 'PIN / OTP input', title: 'OTP input',
    plenix: 'OtpInput', src: 'components/OtpInput/OtpInput.tsx', level: 'Component', interaction: 'Input',
    aliases: ['One-time passcode', 'Verification code', 'PIN input', 'Code input', 'Segmented input'],
    text: 'A short code of a known length, one square box per character, in the data font. Typing moves to the next box and Backspace moves back; Arrow keys, Home and End move between boxes; a pasted or autofilled code (autocomplete one-time-code) fills them all. Numeric codes bring the number keypad, alphanumeric codes show in capitals, and a masked PIN shows dots. Focus and invalid change only the box borders.',
    use: ['One-time passcodes and short PINs of a known length (4 to 8) in sign-in and verification', 'Say where the code was sent and how long it lasts in the description, and offer to send a new one', 'onComplete to check the code as soon as the last box is filled'],
    avoid: ['Passwords or codes of any length: use one Input', 'Long codes such as license keys', 'Blocking paste'],
    related: ['text-field', 'field'],
    map: [[MAT, 'Text fields (OTP pattern)', 'Partial'], [ANT, 'Input.OTP', 'Direct'], ['GOV.UK', 'Text input (one-time code)', 'Partial']],
    states: [['Enabled', 'The field surface and border in every box', 'The default'], ['Hover', 'The box under the pointer: the strong border', ':hover'],
      ['Focused', 'The box in focus: the border turns the focus color; no ring outside it', ':focus'], ['Filled', 'The character in the data font, centered (a dot when masked)', 'value'],
      ['Invalid', 'Every box’s border in the danger color, also while focused; the message under the boxes', 'invalid, or error on its Field'], ['Disabled', 'The neutral fill and the disabled text color; no box takes focus', 'disabled']],
    variantPages: [
      vp('Four-character PIN input', 'Length', '4 characters (a PIN)', { size: '4' }, 'Four boxes, for a PIN.', 'A PIN or a short code', 'A code people paste from a message: use 6'),
      vp('Six-character code input', 'Length', '6 characters (default)', { size: '6' }, 'Six boxes: the usual length of a one-time code.', 'One-time codes sent by message or email', 'Codes of any other length'),
      vp('Alphanumeric code input', 'Kind', 'Alphanumeric', { variant: 'alphanumeric' }, 'Letters and digits, shown in capitals, with the text keyboard.', 'Recovery and invitation codes with letters', 'Numeric codes: keep the number keypad'),
      vp('Masked PIN input', 'Kind', 'Masked', { variant: 'masked' }, 'Each character shows as a dot once typed.', 'A PIN others could read over the shoulder', 'One-time codes people check against a message'),
      vp('Invalid code input', 'State', 'Invalid', { variant: 'numeric', state: 'invalid' }, 'Every box’s border in the danger color, the message under them.', 'A wrong or expired code, with what to do next', 'Marking boxes invalid while people are still typing')
    ],
    examples: [
      ['Length', [['4 characters (a PIN)', function () { return h(Otp, { label: 'PIN', otp: { length: 4 } }); }, null, 'length={4}'],
        ['6 characters (default)', function () { return h(Otp, { description: 'We sent a code to your phone. It expires in ten minutes.' }); }, null, 'length={6}']], { prop: 'length' }],
      ['Kind', [['Numeric (default)', function () { return h(Otp, { value: '482' }); }, null, 'kind=' + q('numeric')], ['Alphanumeric', function () { return h(Otp, { label: 'Recovery code', otp: { kind: 'alphanumeric', length: 8 } }); }, null, 'kind=' + q('alphanumeric')],
        ['Masked', function () { return h(Otp, { label: 'PIN', value: '48', otp: { length: 4, masked: true } }); }, null, 'masked']], { prop: 'kind' }],
      ['State', [['Invalid', function () { return h(Otp, { value: '482913', error: 'That code has expired. Request a new code.' }); }, null, 'invalid'],
        ['Disabled', function () { return h(Otp, { otp: { disabled: true } }); }, null, 'disabled']]]] };

  /* ── 06 Navigation › Search, filter, and discovery: SearchField suggestions and recent searches ── */
  var ASSETS = [{ value: 'Cross gold', description: 'Crosses' }, { value: 'Gold leaf border', description: 'Borders' }, { value: 'Banner gold', description: 'Banners' }, { value: 'Easter cross', description: 'Crosses' }, { value: 'Parish logo', description: 'Brand kit' }, { value: 'Sunset banner', description: 'Banners' }];
  var Suggest = function (props) {
    var s = use(props.start || ''), hist = P.useSearchHistory('ds-' + (props.store || 'demo'));
    var t = s[0].trim().toLowerCase();
    var matches = t ? ASSETS.filter(function (a) { return a.value.toLowerCase().indexOf(t) >= 0; }).slice(0, 8) : [];
    // the demo's history starts with a few searches (once per page); remove and clear then work on it
    React.useEffect(function () { if (props.recent && !hist.items.length) props.recent.slice().reverse().forEach(hist.add); }, []);
    var recent = props.recent ? hist.items : undefined;
    return searchFrame(h(P.SearchField, { label: 'Search assets', placeholder: 'Search assets', value: s[0], onChange: function (e) { s[1](e.target.value); }, onClear: function () { s[1](''); },
      suggestions: props.suggestions === false ? undefined : matches, recent: recent,
      onSelect: function (it) { s[1](it.value); hist.add(it.value); }, onSubmitSearch: function (x) { hist.add(x); },
      onRemoveRecent: props.recent ? hist.remove : undefined, onClearRecent: props.clear ? hist.clear : undefined }));
  };
  var searchSuggestions = { id: 'search-suggestions', lab: true, icon: 'search', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Search suggestions', title: 'Search suggestions',
    plenix: 'SearchField (suggestions)', src: 'components/SearchField/SearchField.tsx', level: 'Component', interaction: 'Search', statesFrom: ['search-input'], variantClasses: [],
    aliases: ['Search autocomplete', 'Typeahead', 'Query suggestions', 'Search as you type', 'Autocomplete search'],
    text: 'A list under the search field of what matches the text so far, as people type: SearchField suggestions, matched and ranked by the caller (about eight). The field is a combobox: Arrow Down and Up move through the list while the text stays the person’s own; Enter chooses (onSelect), or searches when nothing is active (onSubmitSearch); Escape closes the list. Each suggestion shows its matching part in bold and can have a description; the number of suggestions is announced once typing pauses.',
    use: ['Global search and large collections, to reach a known item or phrase a query faster', 'Suggestions in the person’s own terms, the typed part in bold', 'With recent searches while the field is empty'],
    avoid: ['Picking a form value: use Combobox', 'Browsing: use filters', 'Suggestions that replace the typed text before people choose one', 'More than about eight suggestions'],
    related: ['search-input', 'recent-searches', 'combobox', 'search-workspace'],
    map: [[MAT, 'Search', 'Direct'], [POL, 'Autocomplete', 'Partial'], [SPE, 'Search autocomplete', 'Direct'], [FLU, 'SearchBox with suggestions', 'Partial'], [ANT, 'AutoComplete', 'Partial']],
    variantPages: [
      vp('Search suggestions list', 'List', 'Suggestions', { variant: 'suggestions' }, 'Matches of the text so far, the matching part in bold, each with an optional description.', 'Global search and large collections', 'Choosing a form value: use Combobox')
    ],
    examples: [['List', [['Suggestions', function () { return h(Suggest, { start: 'gol', store: 'suggestions' }); }, 'plx-search__popup', 'suggestions']]],
      ['Autocomplete', function () { return h(Suggest, { start: 'cross', store: 'autocomplete' }); }]], also: [], covers: ['Autocomplete search'] };
  var recentSearches = { id: 'recent-searches', lab: true, icon: 'clock', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Recent searches', title: 'Recent searches',
    plenix: 'SearchField (recent), useSearchHistory', src: 'components/SearchField/SearchField.tsx', also: ['hooks/useSearchHistory.ts'], level: 'Component', interaction: 'Search', statesFrom: ['search-input'], variantClasses: [],
    aliases: ['Search history', 'Recent queries', 'Previous searches'],
    text: 'The person’s last searches, newest first, in the list under an empty search field: SearchField recent, kept by useSearchHistory (five by default, in this browser). Choosing one searches again. With onRemoveRecent each row has its own remove button (an icon-only ghost “×” named “Remove <term>”), and the list is the WAI-ARIA combobox with grid popup (its keys are under Behavior); focus stays in the field. The heading’s Clear recent searches removes them all (onClearRecent).',
    use: ['Global search, and searches people repeat', 'Always with a way to remove them: one by one (each row’s remove button) and all at once (Clear)', 'Up to about five'],
    avoid: ['Shared devices where searches may be private, unless each person has their own history', 'Keeping searches people cannot remove'],
    related: ['search-suggestions', 'search-input'],
    map: [[MAT, 'Search (history)', 'Partial']],
    variantPages: [
      vp('Recent searches list', 'List', 'Recent searches', { variant: 'recent' }, 'The last searches, newest first, under the empty field; each row has its own remove button (“Remove <term>”), reached with Arrow Right (a grid popup).', 'Searches people repeat, removed one by one', 'Private searches on shared devices'),
      vp('Recent searches with Clear', 'List', 'Recent searches with Clear', { variant: 'history' }, 'The list’s heading with Clear recent searches, which removes them all; each row keeps its own remove button.', 'Every recent searches list where people can clear their history', 'A history people cannot remove')
    ],
    examples: [['List', [['Recent searches', function () { return h(Suggest, { recent: ['sunset banner', 'easter cross', 'parish logo'], store: 'recent' }); }, 'plx-search__option--recent', 'recent'],
      ['Recent searches with Clear', function () { return h(Suggest, { recent: ['sunset banner', 'easter cross', 'parish logo'], clear: true, store: 'clear' }); }, 'plx-search__popup-head', 'onClearRecent']]],
      ['Recent searches with Clear', function () { return h(Suggest, { recent: ['sunset banner', 'easter cross'], clear: true, store: 'history' }); }]], cssAlso: true, covers: ['Search history'] };

  // the duplicate leaves: their own pages, showing the main page's written sections and a live example
  return [formSection, formActions, characterCounter, readOnlyField, fieldStyleVariants, autogrowingTextArea, otpInput, searchSuggestions, recentSearches, ];
});
