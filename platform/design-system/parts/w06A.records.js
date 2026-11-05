/* Plenix design system · library part w06A (wave 6, lane A): the field group and the legend (Fieldset layout="row",
   hideLegend), ErrorSummary (Error summary), InputGroup (Input group), NumberInput (Number input, and its Stepper,
   Currency input, Percentage input and Quantity selector forms), FileInput (File input) and CodeEditor (Code editor).
   Every color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var para = function (t) { return h(P.Text, { as: 'p', variant: 'secondary' }, t); };

  /* ── 05 Forms › Form foundations › Field group: Fieldset layout="row" ── */
  var size = function (props) {
    return box(400, h(P.Fieldset, Object.assign({ legend: 'Size' }, props),
      h(P.Field, { label: 'Width' }, h(P.NumberInput, { defaultValue: 1920, unit: 'px', width: 'md', min: 1 })),
      h(P.Field, { label: 'Height' }, h(P.NumberInput, { defaultValue: 1080, unit: 'px', width: 'md', min: 1 }))));
  };
  var fieldGroup = { id: 'field-group', lab: true, icon: 'fields', sec: 'forms', sub: 'Form foundations', leaf: 'Field group', title: 'Field group',
    plenix: 'Fieldset layout="row"', src: 'components/Fieldset/Fieldset.tsx', blocks: ['plx-fieldset'], level: 'Component', interaction: 'Static',
    aliases: ['Form group', 'Compound field', 'Inline fields', 'Field row'],
    text: 'Fields that answer one question together, side by side under one legend: a width and a height; a city, a state and a ZIP code; a start and an end. It is a Fieldset with layout="row": the native fieldset and legend, and the legend is read when focus enters the group. The fields align at their tops and wrap onto more lines when the row is narrow. Each field keeps its own label and error.',
    use: ['Parts of one value that read better side by side: dimensions, a date in parts, a range', 'Two to four short fields; give each its own short label (the legend gives the context)', 'One error for the whole group under it when the group as a whole is wrong'],
    avoid: ['Unrelated fields in one row: use a form section', 'A field group inside another field group', 'A long row that wraps on most windows: stack the fields'],
    related: ['fieldset', 'legend', 'field', 'number-input'],
    map: [[CAR, 'Form group', 'Direct'], [ATL, 'Fieldset', 'Direct'], [POL, 'Form layout group', 'Partial'], [FLU, 'Field', 'Partial'], [ANT, 'Space.Compact / Form.Item group', 'Partial']],
    variantPages: [
      vp('Field group in a row', 'Layout', 'In a row', { variant: 'row' }, 'The fields side by side, aligned at their tops, the large inline gap between them; they wrap when the row is narrow.', 'Parts of one value: width and height, city and ZIP code', 'Fields that do not belong together'),
      vp('Stacked field group', 'Layout', 'Stacked (default)', { variant: 'stack' }, 'The fields under each other with the stack gap, the default Fieldset.', 'Choices that answer one question: a set of checkboxes', 'Short parts of one value: put them in a row')
    ],
    examples: [
      ['Layout', [['In a row', function () { return size({ layout: 'row' }); }, 'plx-fieldset--row', 'layout="row"'],
        ['Stacked (default)', function () { return size({}); }, null, 'layout="stack"']], { prop: 'layout' }],
      ['Legend', [['Legend visible', function () { return size({ layout: 'row' }); }, null, 'legend'], ['Legend hidden', function () { return size({ layout: 'row', hideLegend: true }); }, null, 'hideLegend']]]] };
  fieldGroup.variantPages.push(
    vp('Field group with a visible legend', 'Legend', 'Legend visible', { content: 'visible' }, 'The legend above the fields in the secondary text style.', 'Most groups: the legend names the question', 'A legend that repeats a heading right above it'),
    vp('Field group with a hidden legend', 'Legend', 'Legend hidden', { content: 'hidden' }, 'The legend read by screen readers only, the fields directly under the heading.', 'A group whose title is already on screen as a heading', 'A group with no visible title: show the legend'));

  /* ── 05 Forms › Form foundations › Legend ── */
  var legend = { id: 'legend', lab: true, icon: 'rename', sec: 'forms', sub: 'Form foundations', leaf: 'Legend', title: 'Legend',
    plenix: 'Fieldset legend, hideLegend', src: 'components/Fieldset/Fieldset.tsx', variantClasses: [], level: 'Component', interaction: 'Static',
    aliases: ['Fieldset legend', 'Group label', 'Group title'],
    text: 'The title of a Fieldset: the native legend, the fieldset’s first child, in the secondary text at the label size with a small space under it. Screen readers read it when focus enters the group, before each control’s own label. When a heading above already says it, hideLegend keeps it for assistive technology only, off the screen.',
    use: ['Every Fieldset, field group, radio group and checkbox group', 'A short question or noun phrase: Size, Contact method, Which files?', 'hideLegend when a visible heading says the same words'],
    avoid: ['A legend for a single control: use the Field label', 'Instructions in the legend: put them in help text under it', 'An empty legend'],
    related: ['field-group', 'fieldset', 'field'],
    map: [[CAR, 'Form group (legend)', 'Partial'], [ATL, 'Fieldset (legend)', 'Partial'], [POL, 'Choice list (title)', 'Partial']],
    variantPages: [
      vp('Visible legend', 'Legend', 'Visible (default)', { variant: 'visible' }, 'Secondary text at the label size above the controls.', 'Every group whose title is not already on screen', 'Styling the legend as a page heading inside a form'),
      vp('Hidden legend', 'Legend', 'Hidden (read by screen readers)', { variant: 'hidden' }, 'Visually hidden, still read when focus enters the group.', 'A dialog or a section whose heading says the same', 'Hiding the only title of a group')
    ],
    examples: [['Legend', [['Visible (default)', function () { return size({ layout: 'row' }); }, null, 'legend="Size"'],
      ['Hidden (read by screen readers)', function () { return h('div', null, h(P.Text, { as: 'h3', variant: 'heading' }, 'Size'), size({ layout: 'row', hideLegend: true })); }, null, 'hideLegend']]]] };

  /* ── 05 Forms › Form foundations › Error summary ── */
  // ids from React.useId: the States table draws an example twice, and ids stay unique on the page
  var uid = function () { return 'w06a-' + React.useId().replace(/[^a-zA-Z0-9]/g, ''); };
  var SummaryForm = function () {
    var u = uid(), name = use(''), owner = use(''), shown = use(null);
    var check = function (e) {
      e.preventDefault();
      var errs = [];
      if (!name[0].trim()) errs.push({ target: u + 'name', message: 'Enter a name for the asset' });
      if (!owner[0].trim()) errs.push({ target: u + 'owner', message: 'Enter the owner’s name' });
      shown[1](errs);
    };
    var errOf = function (id) { var x = (shown[0] || []).filter(function (e) { return e.target === id; })[0]; return x ? x.message : undefined; };
    return box(400, h('form', { noValidate: true, onSubmit: check, className: 'ds-w06a-form' },
      shown[0] && shown[0].length ? h(P.ErrorSummary, { errors: shown[0] }) : null,
      h(P.Field, { label: 'Asset name', error: errOf(u + 'name') }, h(P.Input, { id: u + 'name', value: name[0], onChange: function (e) { name[1](e.target.value); } })),
      h(P.Field, { label: 'Owner', error: errOf(u + 'owner') }, h(P.Input, { id: u + 'owner', value: owner[0], onChange: function (e) { owner[1](e.target.value); } })),
      h(P.Inline, null, h(P.Button, { type: 'submit', variant: 'primary' }, 'Save'))));
  };
  var StaticSummary = function () {
    var u = uid();
    return box(400, h('div', { className: 'ds-w06a-form' }, h(P.ErrorSummary, { autoFocus: false, errors: [{ target: u + 'a', message: 'Enter a name for the asset' }, { target: u + 'b', message: 'Choose a license' }] }),
      h(P.Field, { label: 'Asset name', error: 'Enter a name for the asset' }, h(P.Input, { id: u + 'a' })),
      h(P.Field, { label: 'License', error: 'Choose a license' }, h(P.Select, { id: u + 'b', options: [{ value: '', label: 'Choose…' }, { value: 'cc', label: 'CC BY 4.0' }] }))));
  };
  var errorSummary = { id: 'error-summary', lab: true, icon: 'alert', sec: 'forms', sub: 'Form foundations', leaf: 'Error summary', title: 'Error summary',
    plenix: 'ErrorSummary', src: 'components/ErrorSummary/ErrorSummary.tsx', level: 'Component', interaction: 'Navigation',
    aliases: ['Validation summary', 'Form errors', 'Problem list'],
    text: 'After a failed submit, lists at the top of the form what stopped it from being sent: a danger Notice with a heading that counts the problems (There are 2 problems) and one link per problem, in the form’s order, in the same words as the field’s own error. It takes focus when it appears, so a screen reader reads it first. Each link moves focus into its field and scrolls the field into view with its label.',
    use: ['After a failed submit on a form with more than a few fields', 'When a problem may be out of view on a long form', 'With the same message beside each field (Field error)'],
    avoid: ['Checking as people type: show field errors on blur instead', 'A problem that is not about a field (the server did not answer): use a Notice or a Banner', 'Different words in the summary and beside the field'],
    related: ['field', 'notice', 'link', 'fieldset'],
    map: [[CAR, 'Form validation (inline notification)', 'Partial'], [ATL, 'Form (section message)', 'Partial'], [POL, 'Banner (form errors)', 'Partial'], [SPE, 'Inline alert (form)', 'Partial']],
    variantPages: [
      vp('Error summary with links', 'Variant', 'List of errors with links', { variant: 'links' }, 'The heading and one link per problem in the danger Notice.', 'Every failed submit of a longer form', 'A list of problems without links to the fields'),
      vp('Error summary focused on submit', 'Variant', 'Focused on submit', { variant: 'focused' }, 'After a failed submit the summary takes focus: the Notice’s edge turns the focus color.', 'Every summary shown after a submit', 'Moving focus to it while people are still typing')
    ],
    examples: [['Variant', [['List of errors with links', function () { return h(StaticSummary); }, null, 'errors'], ['Focused on submit', function () { return h(SummaryForm); }, null, 'autoFocus']]]] };

  /* ── 05 Forms › Form foundations › Input group ── */
  var CURRENCIES = [{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'GBP', label: 'GBP' }];
  var ig = function (props, input, label) { return box(320, h(P.Field, { label: label || 'Website' }, h(P.InputGroup, props, input || h(P.Input, { data: true, defaultValue: 'plenix.lighthouseway.org' })))); };
  var inputGroup = { id: 'input-group', lab: true, icon: 'fields', sec: 'forms', sub: 'Form foundations', leaf: 'Input group', title: 'Input group',
    plenix: 'InputGroup', src: 'components/InputGroup/InputGroup.tsx', level: 'Component', interaction: 'Input',
    aliases: ['Input adornment', 'Prefix and suffix', 'Addon', 'Connected field'],
    text: 'A text field with what belongs to its value attached: a prefix or a suffix inside its border (https://, $, kg), an icon at its start, and a Button or a Select joined to its outer edge. The field and its affixes are one control with one border: the focus color while the field has focus, the danger color when it is invalid. Affixes are muted text read with the field (aria-describedby); attached controls keep their own Tab stops and meet the field with square corners.',
    use: ['A unit, a symbol or a fixed part of the value: kg, %, https://', 'One action that belongs to the value: Search, Copy', 'A unit or currency choice joined to the amount'],
    avoid: ['More than one attached button: put other actions beside the field', 'An affix that says what belongs in the label', 'A number with a unit: use NumberInput, which builds on this group'],
    related: ['text-field', 'number-input', 'button', 'native-select', 'field'],
    map: [[POL, 'Text field (prefix, suffix, connected)', 'Partial'], [ATL, 'Text field (elements before and after)', 'Partial'], [FLU, 'Input (content before and after)', 'Partial'], [MAT, 'Text fields (leading and trailing)', 'Partial'], [ANT, 'Input (addonBefore, addonAfter)', 'Direct']],
    variantPages: [
      vp('Input group with prefix text', 'Content', 'Prefix text', { variant: 'prefix' }, 'Muted text before the value inside the border.', 'A fixed start of the value: https://, a currency symbol', 'Words that belong in the label'),
      vp('Input group with suffix text', 'Content', 'Suffix text', { variant: 'suffix' }, 'Muted text after the value inside the border.', 'A unit: kg, px, GB', 'A long phrase after the field'),
      vp('Input group with an icon', 'Content', 'Icon', { variant: 'icon' }, 'A muted icon at the start inside the border; a press on it focuses the field.', 'A search or filter field', 'An icon that is the only name of the field'),
      vp('Input group with an attached button', 'Attached', 'Button attached', { variant: 'button' }, 'A secondary Button joined at the end, square where it meets the field.', 'One action on the value: Search, Apply, Copy', 'Two or more buttons in one group'),
      vp('Input group with an attached select', 'Attached', 'Select attached', { variant: 'select' }, 'A Select joined at the start, square where it meets the field.', 'A unit or currency chosen with the amount', 'A choice that is a field of its own: give it a label')
    ],
    examples: [['Width (a field used alone is never wider than its container; P-52)', [['Fill: the whole width', function () { return box(360, h(P.NumberInput, { width: 'fill', label: 'Quantity', defaultValue: 2 })); }, 'plx-input-group--width-fill', 'width="fill"']], { prop: 'width' }],
      
      ['Content', [['Prefix text', function () { return ig({ prefix: 'https://', data: true }); }, null, 'prefix="https://"'],
        ['Suffix text', function () { return ig({ suffix: 'kg', data: true }, h(P.Input, { data: true, inputMode: 'decimal', defaultValue: '12.5' }), 'Weight'); }, null, 'suffix="kg"'],
        ['Icon', function () { return ig({ icon: 'search' }, h(P.Input, { placeholder: 'Search assets' }), 'Search'); }, null, 'icon="search"']]],
      ['Attached', [['Button attached', function () { return ig({ icon: 'search', end: h(P.Button, null, 'Search') }, h(P.Input, { placeholder: 'Search assets' }), 'Search'); }, null, 'end={<Button>}'],
        ['Select attached', function () { return ig({ start: h(P.Select, { 'aria-label': 'Currency', options: CURRENCIES }) }, h(P.Input, { data: true, inputMode: 'decimal', defaultValue: '1,200.00' }), 'Amount'); }, null, 'start={<Select>}']]],
      ['Width', [['XS', function () { return ig({ suffix: '%', width: 'xs', data: true }, h(P.Input, { data: true, defaultValue: '5' }), 'Discount'); }, 'plx-input-group--width-xs', 'width="xs"'],
        ['SM', function () { return ig({ suffix: 'kg', width: 'sm', data: true }, h(P.Input, { data: true, defaultValue: '12.5' }), 'Weight'); }, 'plx-input-group--width-sm', 'width="sm"'],
        ['MD', function () { return ig({ prefix: 'https://', data: true, width: 'md' }); }, 'plx-input-group--width-md', 'width="md"'],
        ['LG', function () { return ig({ prefix: 'https://', data: true, width: 'lg' }); }, 'plx-input-group--width-lg', 'width="lg"']], { prop: 'width' }],
      ['Font', [['Data font', function () { return ig({ suffix: 'GB', data: true, width: 'sm' }, h(P.Input, { data: true, defaultValue: '250' }), 'Storage'); }, 'plx-input-group--data', 'data']]],
      ['Compact', [['A short box, the value centered (NumberInput quantity)', function () { return h(P.NumberInput, { stepper: 'quantity', defaultValue: 2, min: 1, max: 9, 'aria-label': 'Quantity' }); }, 'plx-input-group--compact', 'compact']]],
      ['State', [['Invalid', function () { return box(320, h(P.Field, { label: 'Website', error: 'Enter an address without spaces' }, h(P.InputGroup, { prefix: 'https://', data: true }, h(P.Input, { data: true, defaultValue: 'plenix lighthouse' })))); }, null, 'invalid'],
        ['Disabled', function () { return ig({ prefix: 'https://', data: true, disabled: true }); }, null, 'disabled']]]] };
  inputGroup.variantPages.push(
    vp('Extra-small input group', 'Width', 'XS', { variant: 'xs' }, 'The extra-small field width.', 'A percentage or a short count with its unit', 'A value that needs room'),
    vp('Small input group', 'Width', 'SM', { variant: 'sm' }, 'The small field width.', 'A measure with its unit', 'An address'),
    vp('Medium input group', 'Width', 'MD', { variant: 'md' }, 'The medium field width.', 'A short address or name with an affix', 'A unit and a number: use SM'),
    vp('Large input group', 'Width', 'LG', { variant: 'lg' }, 'The large field width.', 'A web address with its prefix', 'A short number'),
    vp('Input group in the data font', 'Font', 'Data font', { variant: 'data' }, 'The prefix and suffix in Reddit Mono, as the value.', 'Technical values: units, codes, addresses', 'Words in a sentence'));

  /* ── 05 Forms › Numeric and range input › Number input, Stepper, Currency input, Percentage input, Quantity selector ── */
  var Num = function (props) {
    var s = use(props.start === undefined ? 3 : props.start);
    var p = Object.assign({}, props); delete p.start; delete p.label; delete p.description; delete p.error;
    return box(props.stepper === 'quantity' ? 200 : 320, h(P.Field, { label: props.label || 'Copies', description: props.description, error: props.error },
      h(P.NumberInput, Object.assign({ value: s[0], onChange: s[1] }, p))));
  };
  var num = function (props) { return function () { return h(Num, props); }; };
  var PLAIN = { label: 'Width (px)', start: 1920, min: 1, width: 'md' };
  var BUTTONS = { label: 'Copies', start: 3, min: 1, max: 99, stepper: 'buttons', width: 'lg' };
  var QUANTITY = { label: 'Quantity', start: 2, min: 1, max: 5, stepper: 'quantity', description: 'Only 5 left' };
  var CURRENCY = { label: 'Price', start: 1200, min: 0, format: 'currency', currency: 'USD', width: 'lg' };
  var PERCENT = { label: 'Discount', start: 15, min: 0, max: 100, format: 'percent', width: 'md' };
  var UNIT = { label: 'Weight', start: 12.5, step: 0.1, decimals: 1, unit: 'kg', width: 'md' };
  var MINMAX = { label: 'Seats', start: 1, min: 1, max: 10, stepper: 'buttons', width: 'lg', description: '1 to 10' };
  var INVALID = { label: 'Copies', start: 120, min: 1, max: 99, stepper: 'buttons', width: 'lg', invalid: true, error: 'Enter 99 or fewer' };
  var numberInput = { id: 'number-input', lab: true, icon: 'add', sec: 'forms', sub: 'Numeric and range input', leaf: 'Number input', title: 'Number input',
    plenix: 'NumberInput', src: 'components/NumberInput/NumberInput.tsx', level: 'Component', interaction: 'Input', statesFrom: ['text-field'],
    aliases: ['Numeric field', 'Spin button', 'Number field'],
    text: 'A field for a number, in the data font. People type freely in their locale’s format (its group and decimal marks). Leaving the field checks and formats the number: it is kept inside min and max, and the last valid number is put back when the text is not one. The arrow keys step it. Inside the field it shows what the number measures: a currency’s symbol or code where the locale puts it, a percent sign, or a unit. Stepper buttons (minus and plus at its end) or the quantity form (minus, the count, plus) change it one step at a time. It is a spinbutton: screen readers read the value with its currency, sign or unit.',
    use: ['Counts, sizes, measures, prices and rates', 'min, max and step whenever limits exist; say them in the description (1 to 10)', 'Stepper buttons when most changes are a step or two'],
    avoid: ['Numbers that are codes (ZIP codes, card and phone numbers): use Input', 'A wide range where precision does not matter: use a Slider', 'Blocking or reformatting keys while people type'],
    related: ['input-group', 'text-field', 'slider', 'stepper', 'currency-input', 'percentage-input', 'quantity-selector'],
    map: [[CAR, 'Number input', 'Direct'], [SPE, 'Number field', 'Direct'], [FLU, 'Spin button', 'Direct'], [POL, 'Text field (number)', 'Partial'], [ATL, 'Text field (number)', 'Partial'], [ANT, 'InputNumber', 'Direct'], [MAT, 'Text fields (number)', 'Partial']],
    variantPages: [
      vp('Plain number input', 'Variant', 'Plain', { variant: 'plain' }, 'The number alone in the data font, stepped with the arrow keys.', 'A measure typed more often than stepped', 'A count changed one at a time: add stepper buttons'),
      vp('Number input with stepper buttons', 'Variant', 'Stepper buttons', { variant: 'buttons' }, 'Minus and plus joined at the end; each turns off at its limit.', 'Small counts changed a step or two at a time', 'Wide ranges people type'),
      vp('Number input as a quantity', 'Variant', 'Quantity (− 1 +)', { variant: 'quantity' }, 'Minus before and plus after a short centered count.', 'Carts, copies, seats', 'Large or precise numbers'),
      vp('Number input for money', 'Variant', 'Currency', { variant: 'currency' }, 'The currency’s symbol or code inside the field where the locale puts it, the currency’s decimals.', 'Prices, budgets, payments', 'A symbol alone when currencies could be confused: use the code'),
      vp('Number input for a percentage', 'Variant', 'Percentage', { variant: 'percent' }, 'The percent sign after the value; the value is the percentage itself.', 'Rates, discounts, shares', 'Ratios shown as decimals'),
      vp('Number input with a unit', 'Variant', 'With unit', { variant: 'unit' }, 'A short unit after the value inside the field.', 'Weights, lengths, sizes', 'A unit people cannot read: say it in the label too'),
      vp('Number input with limits', 'Variant', 'Min and max', { variant: 'minmax' }, 'The minus button off at the minimum; a value outside the limits is brought back when the field is left.', 'Every number with a valid range', 'Limits people cannot see: state them in the description'),
      vp('Invalid number input', 'Variant', 'Invalid', { variant: 'invalid' }, 'The danger border and the Field error.', 'A value the form cannot accept after it is checked', 'Showing an error while people are still typing')
    ],
    examples: [['Variant', [['Plain', num(PLAIN), null, 'NumberInput'], ['Stepper buttons', num(BUTTONS), null, 'stepper="buttons"'],
      ['Quantity (− 1 +)', num(QUANTITY), 'plx-number-input--quantity', 'stepper="quantity"'], ['Currency', num(CURRENCY), null, 'format="currency"'],
      ['Percentage', num(PERCENT), null, 'format="percent"'], ['With unit', num(UNIT), null, 'unit="kg"'], ['Min and max', num(MINMAX), null, 'min max'], ['Invalid', num(INVALID), null, 'invalid']]]] };
  var numVariant = function (id, leaf, icon, aliases, text, use1, avoid1, props, card, map) {
    return { id: id, icon: icon, sec: 'forms', sub: 'Numeric and range input', leaf: leaf, title: leaf, plenix: 'NumberInput ' + card, src: 'components/NumberInput/NumberInput.tsx',
      level: 'Component', interaction: 'Input', variantClasses: [], statesFrom: ['text-field'], docsFrom: 'number-input', aliases: aliases, text: text, use: use1, avoid: avoid1,
      related: ['number-input', 'input-group'], map: map, examples: [[leaf, num(props), null, card]] };
  };
  var stepper = numVariant('stepper', 'Stepper', 'square-plus', ['Spin button', 'Increment buttons', 'Plus and minus'],
    'The NumberInput with stepper="buttons": minus and plus joined at the end of the field change it one step at a time and turn off at min and max. The buttons are not Tab stops: the arrow keys step the focused field, and a press on a button keeps focus where it was. The field stays typeable.',
    ['Small whole numbers changed a step or two at a time: guests, copies, columns', 'min and max always'], ['Large ranges: use a plain number input or a Slider', 'A stepper without a field to type in'], BUTTONS, 'stepper="buttons"',
    [[CAR, 'Number input', 'Partial'], [FLU, 'Spin button', 'Partial'], [SPE, 'Number field', 'Partial'], [MAT, 'Text fields (number)', 'Partial']]);
  var currency = numVariant('currency-input', 'Currency input', 'briefcase-plus', ['Money input', 'Amount field', 'Price field'],
    'The NumberInput with format="currency": the currency’s symbol (or its ISO code with currencyDisplay="code") inside the field where the reader’s locale writes it, and the currency’s decimals when the field is left. Screen readers read the full amount ($1,200.00).',
    ['Prices, budgets and payments', 'The code (USD) on pages that mix currencies', 'An attached Select when people choose the currency'], ['Whole-number counts', 'A symbol alone where currencies could be confused'], CURRENCY, 'format="currency"',
    [[POL, 'Text field (prefix)', 'Partial'], [SPE, 'Number field (currency)', 'Direct'], [CAR, 'Number input', 'Partial']]);
  var percent = numVariant('percentage-input', 'Percentage input', 'ed-filters', ['Percent field', 'Rate input'],
    'The NumberInput with format="percent": the percent sign after the value inside the field, where the locale puts it. The value is the percentage itself (25 means 25%), so what people type, see and store are the same.',
    ['Rates, discounts and shares', 'min 0 and max 100 unless more is valid'], ['Ratios shown as decimals (0.25)', 'A rough share where a Slider is enough'], PERCENT, 'format="percent"',
    [[SPE, 'Number field (percent)', 'Direct'], [POL, 'Text field (suffix)', 'Partial']]);
  var quantity = numVariant('quantity-selector', 'Quantity selector', 'circle-plus', ['Quantity stepper', 'Counter input', 'Plus minus control'],
    'The NumberInput with stepper="quantity": minus before and plus after a short centered count, for how many of an item. Each button turns off at its limit; the description says why (Only 5 left). Name it with the item (Quantity, Blue chair).',
    ['Carts, order lines, copies, seats', 'A limit message in the description when stock is low'], ['Large or precise numbers: use a number input', 'An item only one of which is allowed'], QUANTITY, 'stepper="quantity"',
    [[POL, 'Text field (number)', 'Partial'], [SPE, 'Number field', 'Partial'], [CAR, 'Number input', 'Partial'], [ANT, 'InputNumber (controls)', 'Partial']]);

  /* ── 05 Forms › File and media input › File input ── */
  var files = function (props, label, description) { return box(400, h(P.Field, { label: label || 'Contract', description: description }, h(P.FileInput, props))); };
  var fileInput = { id: 'file-input', lab: true, icon: 'attachment', sec: 'forms', sub: 'File and media input', leaf: 'File input', title: 'File input',
    plenix: 'FileInput', src: 'components/FileInput/FileInput.tsx', level: 'Component', interaction: 'Input', statesFrom: ['button'],
    aliases: ['File picker', 'File chooser', 'Attach file'],
    text: 'Chooses files from the device. The browser’s own file input stays the control: it is the Tab stop, opens on Enter, Space or a click, and is named by the Field’s label. It is drawn as a secondary Button with the attach icon, and the line beside it names the chosen file or how many. With showList, the files are listed one per row with their size and a Remove button; removing one also takes it out of the input’s own list, so the form sends what the list shows.',
    use: ['Attaching documents or importing a data file', 'The types and the size limit in the Field’s description (PDF, up to 10 MB)', 'showList with multiple, so people can check and remove files'],
    avoid: ['Images that need a preview or a crop: use an image upload', 'Files that come from inside the app: use a media picker', 'Dragging files in: use DropZone (it keeps a button too)'],
    related: ['drop-zone', 'button', 'field'],
    map: [[CAR, 'File uploader', 'Direct'], [POL, 'Drop zone', 'Partial'], [SPE, 'Drop zone', 'Partial'], [FLU, 'Input (file)', 'Partial'], [ANT, 'Upload', 'Direct']],
    variantPages: [
      vp('File input button', 'Variant', 'Button (default)', { variant: 'button' }, 'The secondary Button that opens the picker and the line that names the chosen file.', 'One file in a form', 'Several files people need to check: add the list'),
      vp('File input with a file list', 'Variant', 'With file list', { variant: 'list' }, 'The chosen files one per row, with their size and a Remove button.', 'Several files that people may want to remove', 'One file: the line beside the button says it'),
      vp('Multiple file input', 'Variant', 'Multiple', { variant: 'multiple' }, 'Choose files: the picker takes several, the line counts them.', 'Attachments', 'A field that takes one file'),
      vp('File input with accepted types', 'Variant', 'Accept types', { variant: 'accept' }, 'The picker offers only the accepted types; the description names them.', 'Every file input with a type limit', 'A limit that only the picker knows: say it in the description')
    ],
    examples: [['Variant', [['Button (default)', function () { return files({}); }, null, 'FileInput'],
      ['With file list', function () { return files({ multiple: true, showList: true }, 'Attachments'); }, null, 'showList'],
      ['Multiple', function () { return files({ multiple: true }, 'Attachments'); }, null, 'multiple'],
      ['Accept types', function () { return files({ accept: '.pdf,.docx' }, 'Contract', 'PDF or DOCX, up to 10 MB'); }, null, 'accept=".pdf,.docx"'],
      ['Summary hidden: the parent shows the file', function () { return files({ hideSummary: true }); }, 'plx-file-input--hide-summary', 'hideSummary']]],
      ['State', [['Disabled', function () { return files({ disabled: true }); }, null, 'disabled']]]] };

  /* ── 05 Forms › Text input › Code editor ── */
  var SAMPLES = {
    jsx: 'export function Badge({ count }) {\n  if (!count) return null;\n  return <Count value={count} max={99} />;\n}\n',
    css: '.plx-badge {\n  color: var(--plx-sys-content-default);\n  padding-inline: var(--plx-sys-space-inset-xs);\n}\n',
    html: '<section class="cards">\n  <h2>Recent assets</h2>\n</section>\n',
    text: 'Plain notes are not colored.\nTab still indents.\n'
  };
  var Editor = function (props) {
    var s = use(SAMPLES[props.language || 'jsx']);
    return box(560, h(P.Field, { label: props.fieldLabel || 'Component (JSX)', error: props.error }, h(P.CodeEditor, Object.assign({ value: s[0], onChange: s[1] }, props, { fieldLabel: undefined, error: undefined }))));
  };
  var ed = function (props) { return function () { return h(Editor, props); }; };
  var codeEditor = { id: 'code-editor', lab: true, icon: 'doc-text', sec: 'forms', sub: 'Text input', leaf: 'Code editor', title: 'Code editor',
    plenix: 'CodeEditor', src: 'components/CodeEditor/CodeEditor.jsx', level: 'Component', interaction: 'Input',
    aliases: ['Code input', 'Source editor', 'Script field'],
    text: 'A multi-line field for writing code: Reddit Mono, colored with the CodeBlock’s colors as people type, optional line numbers that stay in view, and a read-only form. It is the browser’s own textarea laid over a colored copy of its text, so typing, selection, undo and assistive technology are native and no editor engine is loaded. Tab indents and Shift+Tab outdents; Escape, then Tab, leaves the editor, and the hint says so. Enter keeps the indentation of the line above.',
    use: ['Configuration, snippets, queries and styles that people edit', 'The language in the label: Query (SQL), Styles (CSS)', 'Line numbers when people talk about lines (errors, reviews)'],
    avoid: ['Code people only read: use CodeBlock', 'Plain prose: use a text area', 'Completion, folding or error markers: they need an editor engine, not part of Plenix'],
    related: ['code-block', 'text-area', 'field'],
    map: [[CAR, 'Code snippet (editable)', 'Partial'], [ATL, 'Code block', 'Partial'], [SPE, 'Text area', 'Partial']],
    variantPages: [
      vp('Plain code editor', 'Variant', 'Plain', { variant: 'plain' }, 'The colored code in the field, no gutter.', 'Short snippets', 'Code people discuss by line: add line numbers'),
      vp('Code editor with line numbers', 'Variant', 'With line numbers', { variant: 'numbers' }, 'A gutter of line numbers on the start side, divided from the code, kept in view when the code scrolls sideways.', 'Files and longer snippets', 'Two or three lines'),
      vp('Read-only code editor', 'Variant', 'Read-only', { variant: 'readonly' }, 'The read-only fill; people can select and copy; Tab moves on.', 'Generated code people may copy beside editable fields', 'Code only shown on a page: use CodeBlock'),
      vp('Tall code editor', 'Variant', 'Tall (scrolls)', { variant: 'tall' }, 'Grows with the code up to the tall height, then scrolls.', 'Whole files', 'Snippets: let them grow'),
      vp('JSX code editor', 'Language', 'JSX', { variant: 'jsx' }, 'Keywords, strings, tags, attributes, numbers and functions colored.', 'React components and JavaScript', 'JSON: use Text until it has its own colors'),
      vp('CSS code editor', 'Language', 'CSS', { variant: 'css' }, 'Selectors, properties, custom properties, functions and numbers colored.', 'Styles and theme overrides', 'Tokens people should pick from a list'),
      vp('HTML code editor', 'Language', 'HTML', { variant: 'html' }, 'Tags, attributes and strings colored.', 'Markup snippets and templates', 'Rich text people format: use the rich-text editor'),
      vp('Text code editor', 'Language', 'Text', { variant: 'text' }, 'The code font without colors.', 'Logs, notes, formats with no colors yet', 'Prose: use a text area')
    ],
    examples: [
      ['Variant', [['Plain', ed({}), null, 'CodeEditor'], ['With line numbers', ed({ lineNumbers: true }), 'plx-code-editor--line-numbers', 'lineNumbers'],
        ['Read-only', ed({ readOnly: true, lineNumbers: true }), 'plx-code-editor--readonly', 'readOnly'], ['Tall (scrolls)', ed({ maxHeight: 'tall', lineNumbers: true, height: 'lg' }), 'plx-code-editor--tall', 'maxHeight="tall"']]],
      ['Language', [['JSX', ed({ language: 'jsx', lineNumbers: true }), null, 'language="jsx"'], ['CSS', ed({ language: 'css', fieldLabel: 'Styles (CSS)', lineNumbers: true }), null, 'language="css"'],
        ['HTML', ed({ language: 'html', fieldLabel: 'Template (HTML)' }), null, 'language="html"'], ['Text', ed({ language: 'text', fieldLabel: 'Notes' }), null, 'language="text"']], { prop: 'language' }],
      ['Height', [['Height sm', ed({ height: 'sm' }), 'plx-code-editor--height-sm', 'height="sm"'], ['Height md (default)', ed({ height: 'md' }), 'plx-code-editor--height-md', 'height="md"'],
        ['Height lg', ed({ height: 'lg' }), 'plx-code-editor--height-lg', 'height="lg"']], { prop: 'height' }],
      ['State', [['Invalid', ed({ invalid: true, error: 'Line 3: the tag is not closed' }), null, 'invalid']]]] };
  codeEditor.variantPages.push(
    vp('Short code editor', 'Height', 'Height sm', { variant: 'h-sm' }, 'About five lines before it grows.', 'A short snippet or a one-line query', 'A file'),
    vp('Standard code editor', 'Height', 'Height md (default)', { variant: 'h-md' }, 'About ten lines before it grows.', 'Most snippets', 'A one-line value: use Input with the data font'),
    vp('Large code editor', 'Height', 'Height lg', { variant: 'h-lg' }, 'About twenty lines before it grows.', 'A file people edit at length', 'A dialog with little room'));

  return [fieldGroup, legend, errorSummary, inputGroup, numberInput, stepper, currency, percent, quantity, fileInput, codeEditor];
});
