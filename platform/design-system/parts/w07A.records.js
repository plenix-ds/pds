/* Plenix design system · library part w07A (wave 7, lane A): Calendar (Calendar), DatePicker (Date picker, and its Date
   range picker and Date-time picker modes), CountrySelect (Country / locale select), ProgressSteps (the navigation
   Stepper, and its duplicates Progress tracker and Step progress), Tabs orientation="vertical" (Vertical tabs) and
   AppHeader's mobile app bar (Mobile app bar: Back and a title) and product navigation (Product navigation: the header's
   links with the navigation pane). page-structures/Header and Global navigation are answered in w00A. Every color is an
   existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, use = H.use, noop = H.noop;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  // the examples' today: a fixed date, so every drawing of a page is the same (the components default to the real today)
  var TODAY = '2026-10-15';

  /* ── 05 Forms › Date, time, and color › Calendar ── */
  var Cal = function (props) {
    var range = props.mode === 'range';
    var s = use(props.start !== undefined ? props.start : (range ? { start: '2026-10-12', end: '2026-10-21' } : '2026-10-20'));
    var p = Object.assign({ today: TODAY, defaultMonth: '2026-10', label: 'Due date' }, props); delete p.start;
    return box(props.months === 2 ? 600 : 320, h(P.Calendar, Object.assign(p, { value: s[0], onChange: s[1] })));
  };
  var cal = function (props) { return function () { return h(Cal, props); }; };
  var WEEKEND = function (iso) { var d = new Date(iso + 'T12:00:00').getDay(); return d === 0 || d === 6; };
  var calendar = { id: 'calendar', lab: true, icon: 'calendar', sec: 'forms', sub: 'Date, time, and color', leaf: 'Calendar', title: 'Calendar',
    plenix: 'Calendar', src: 'components/Calendar/Calendar.jsx', level: 'Component', interaction: 'Selection',
    aliases: ['Month view', 'Date grid', 'Mini calendar', 'Calendar picker'],
    text: 'A month of days to choose a date or a range from, laid out as the reader’s locale writes a week: its first day of the week, its month and weekday names. Today is marked as DateBadge marks it (the number on the action color), the chosen day in the selected state, and a range in the selected fill between its two ends. The days are one grid with one Tab stop. Days that cannot be chosen stay reachable and are announced as unavailable. A second month can sit beside the first, and the ISO week numbers can sit before each week.',
    use: ['Inside DatePicker, where people choose a date near today', 'On its own where the date is chosen while its week is in view: a booking, a schedule', 'min and max (or isDateDisabled) whenever some dates cannot be chosen; say why in help text', 'Two months for a range that crosses a month’s end'],
    avoid: ['Dates far from today that people know (a birth date): type them in a field', 'Showing events: use the time grid (TimeGrid)', 'Color alone to mark a day that cannot be chosen: it is also announced as unavailable'],
    related: ['date-picker', 'date-range-picker', 'time-grid', 'date-and-time-formats'],
    map: [[CAR, 'Date picker (calendar)', 'Partial'], [ATL, 'Calendar', 'Direct'], [MAT, 'Date pickers (calendar)', 'Partial'], [FLU, 'Calendar', 'Direct'], [POL, 'Date picker', 'Partial'], [SPE, 'Calendar, Range calendar', 'Direct'], [ANT, 'Calendar', 'Direct']],
    variantPages: [
      vp('Month calendar', 'Variant', 'Month (default)', { variant: 'month' }, 'One month: its header with the arrows and the month’s name, the weekday row, and the days of the weeks around it in the muted color.', 'A single date near today', 'A range over a month’s end: show two months'),
      vp('Two-month calendar', 'Variant', 'Two months', { variant: 'two' }, 'Two months side by side, the arrows at the outer ends; each shows only its own days. They stack on a narrow window.', 'Ranges, and dates people compare across a month’s end', 'A small popover on a phone: one month is enough'),
      vp('Calendar with a range', 'Variant', 'Range highlight', { variant: 'range' }, 'The start and the end in the selected state, the days between in the selected fill, which also covers the inner half of each end.', 'Reporting periods, bookings, filters by date', 'Two unrelated dates: use two calendars'),
      vp('Calendar with week numbers', 'Variant', 'Week numbers', { variant: 'weeks' }, 'The ISO week number before each week, in the data font and the subtle color.', 'Teams that plan by week number', 'Everyday dates: the numbers add noise'),
      vp('Calendar with disabled dates', 'Variant', 'Disabled dates', { variant: 'disabled' }, 'Days that cannot be chosen in the disabled color, without hover; keys still reach them and they are announced as unavailable.', 'Weekends, holidays, booked days', 'Hiding the reason: say it in help text'),
      vp('Calendar with min and max', 'Variant', 'Min and max', { variant: 'minmax' }, 'Days before min and after max are off, and the arrows stop at their months.', 'A window of dates people may choose: the next 30 days', 'A limit people cannot see: state it in help text')
    ],
    examples: [['Variant', [['Month (default)', cal({}), null, 'Calendar'],
      ['Two months', cal({ months: 2, mode: 'range' }), 'plx-calendar--two-months', 'months={2}'],
      ['Range highlight', cal({ mode: 'range' }), null, 'mode="range"'],
      ['Week numbers', cal({ weekNumbers: true }), 'plx-calendar--week-numbers', 'weekNumbers'],
      ['Disabled dates', cal({ isDateDisabled: WEEKEND, start: '2026-10-21' }), null, 'isDateDisabled'],
      ['Min and max', cal({ min: '2026-10-08', max: '2026-10-28', start: '2026-10-20' }), null, 'min max']]]] };

  /* ── 05 Forms › Date, time, and color › Date picker, Date range picker, Date-time picker ── */
  var Picker = function (props) {
    var s = use(props.start !== undefined ? props.start : null);
    var p = Object.assign({}, props); delete p.start; delete p.label; delete p.description; delete p.error;
    return box(props.mode === 'date-time' ? 400 : 360, h(P.Field, { label: props.label || 'Due date', description: props.description || 'MM/DD/YYYY', error: props.error },
      h(P.DatePicker, Object.assign({ value: s[0], onChange: s[1] }, p))));
  };
  var picker = function (props) { return function () { return h(Picker, props); }; };
  var SINGLE = { start: '2026-10-20' };
  var RANGE = { mode: 'range', label: 'Reporting period', description: 'MM/DD/YYYY – MM/DD/YYYY', start: { start: '2026-10-01', end: '2026-10-14' } };
  var DATETIME = { mode: 'date-time', label: 'Starts', description: 'MM/DD/YYYY and a time', start: '2026-10-20T14:30' };
  var PRESETS = { presets: true, start: '2026-10-20' };
  var datePicker = { id: 'date-picker', lab: true, icon: 'calendar', sec: 'forms', sub: 'Date, time, and color', leaf: 'Date picker', title: 'Date picker',
    plenix: 'DatePicker', src: 'components/DatePicker/DatePicker.jsx', level: 'Component', interaction: 'Input', statesFrom: ['text-field'],
    aliases: ['Date input', 'Date field', 'Calendar input'],
    text: 'A field for a date that people type or choose. It takes the reader’s numeric date (10/15/2026 in the United States, 15.10.2026 in Germany) and YYYY-MM-DD, and reads it when the field is left or Enter is pressed; its placeholder shows the form. The calendar button joined at its end (or Alt+Arrow Down) opens the Calendar in a popover with focus on the chosen day; choosing a day closes it and returns focus to the field. Presets choose a common date in one press. The date is in the data font.',
    use: ['Dates near today: due dates, deadlines, appointments', 'The form in the Field’s description as well as in the placeholder (MM/DD/YYYY)', 'min, max or isDateDisabled when some dates cannot be chosen, with the reason in the description'],
    avoid: ['Dates people know by heart (a birth date): a plain field is faster', 'A start and an end: use the range mode', 'Reformatting the text while people type'],
    related: ['calendar', 'date-range-picker', 'date-time-picker', 'input-group', 'popover', 'field'],
    map: [[CAR, 'Date picker', 'Direct'], [ATL, 'Date picker', 'Direct'], [MAT, 'Date pickers', 'Direct'], [FLU, 'DatePicker', 'Direct'], [POL, 'Date picker', 'Partial'], [SPE, 'Date picker', 'Direct'], [ANT, 'DatePicker', 'Direct']],
    variantPages: [
      vp('Single date picker', 'Variant', 'Single (default)', { variant: 'single' }, 'One date in the field, the calendar button joined at its end; the calendar opens under the field.', 'A due date, a deadline', 'A period: use the range mode'),
      vp('Date picker for a range', 'Variant', 'Range', { variant: 'range' }, 'Two dates with a dash between them in one field; the calendar shows two months and the range between the ends.', 'Reporting periods and bookings', 'Two dates that do not belong together'),
      vp('Date picker with a time', 'Variant', 'Date and time', { variant: 'date-time' }, 'The date field and the browser’s time field side by side, the time zone after the time.', 'Scheduling a moment', 'A date whose time does not matter'),
      vp('Date picker with presets', 'Variant', 'With presets', { variant: 'presets' }, 'Common dates as a column of buttons beside the calendar, divided from it.', 'Dates people often pick relative to today', 'More than about six presets')
    ],
    examples: [['Width (a field used alone is never wider than its container; P-52)', [['XS (48px)', function () { return box(360, h(P.DatePicker, { width: 'xs', label: 'Due date' })); }, 'plx-date-picker--width-xs', 'width="xs"'], ['SM (80px)', function () { return box(360, h(P.DatePicker, { width: 'sm', label: 'Due date' })); }, 'plx-date-picker--width-sm', 'width="sm"'], ['MD (100px)', function () { return box(360, h(P.DatePicker, { width: 'md', label: 'Due date' })); }, 'plx-date-picker--width-md', 'width="md"'], ['LG (220px)', function () { return box(360, h(P.DatePicker, { width: 'lg', label: 'Due date' })); }, 'plx-date-picker--width-lg', 'width="lg"'], ['Fill: the whole width', function () { return box(360, h(P.DatePicker, { width: 'fill', label: 'Due date' })); }, 'plx-date-picker--width-fill', 'width="fill"']], { prop: 'width' }],
      ['Variant', [['Single (default)', picker(SINGLE), 'plx-date-picker--single', 'DatePicker'], ['Range', picker(RANGE), 'plx-date-picker--range', 'mode="range"'],
      ['Date and time', picker(DATETIME), 'plx-date-picker--date-time', 'mode="date-time"'], ['With presets', picker(PRESETS), null, 'presets']]],
      ['State', [['Invalid', picker({ start: '2026-10-20', invalid: true, error: 'Enter a date after October 15, 2026' }), null, 'invalid'], ['Disabled', picker({ start: '2026-10-20', disabled: true }), null, 'disabled']]]] };
  var dateRange = { id: 'date-range-picker', icon: 'calendar', sec: 'forms', sub: 'Date, time, and color', leaf: 'Date range picker', title: 'Date range picker', purpose: 'Takes a period, a start date and an end date, typed in people’s own form or chosen from a calendar next to the field.',
    plenix: 'DatePicker mode="range"', src: 'components/DatePicker/DatePicker.jsx', level: 'Component', interaction: 'Input', variantClasses: [], statesFrom: ['date-picker'],
    aliases: ['Range picker', 'Period picker', 'Date range input'],
    text: 'DatePicker with mode="range": the start and the end in one field with a dash between them (typed, or chosen in a two-month Calendar). The first day chosen is the start, the second the end; until the end is chosen, the days between are shown as the range as the pointer or the keys move. An end before the start becomes the start. Presets (Last 7 days, Last 30 days, This month, Last month) set both ends in one press.',
    use: ['Reporting periods, filters by date, bookings', 'Presets for the periods people pick most', 'The whole range in the field (10/01/2026 – 10/14/2026)'],
    avoid: ['A single date: use the single mode', 'A start and an end that are not one period: use two date pickers', 'A range longer than a few months picked by clicking: offer presets or let people type it'],
    related: ['date-picker', 'calendar'], docsFrom: 'date-picker',
    map: [[CAR, 'Date picker (range)', 'Direct'], [MAT, 'Date range picker', 'Direct'], [SPE, 'Date range picker', 'Direct'], [ANT, 'RangePicker', 'Direct'], [POL, 'Date picker (allowRange)', 'Partial']],
    examples: [['A reporting period with presets', picker(Object.assign({}, RANGE, { presets: true }))], ['A range in one month', picker(RANGE)]] };
  var dateTime = { id: 'date-time-picker', icon: 'clock', sec: 'forms', sub: 'Date, time, and color', leaf: 'Date-time picker', title: 'Date-time picker', purpose: 'Takes a moment, a date and a time, typed in people’s own form or chosen from a calendar and a time list next to the field.',
    plenix: 'DatePicker mode="date-time"', src: 'components/DatePicker/DatePicker.jsx', level: 'Component', interaction: 'Input', variantClasses: [], statesFrom: ['date-picker'],
    aliases: ['Date and time picker', 'Timestamp picker', 'Moment picker'],
    text: 'DatePicker with mode="date-time": the date field with its calendar and the browser’s own time field beside it, the time zone after the time (EDT). The value is one moment, YYYY-MM-DDTHH:MM in local wall-clock time; with a time zone (LocaleProvider timeZone or its own timeZone), an ISO moment in UTC (2026-10-20T05:30:00.000Z) shown and saved in that zone, so people in several countries see the same. Choosing a date keeps the time, or takes defaultTime (09:00) when there is none; one error covers the pair (Choose a time in the future).',
    use: ['Scheduling: meetings, publishing, reminders', 'The time zone shown whenever people may be in different zones', 'A timeZone on LocaleProvider when a team works across countries: every picker shows and saves the moment in it', 'min with today when the moment must be in the future'],
    avoid: ['A date whose time does not matter: use the single mode', 'Two separate errors for the date and the time'],
    related: ['date-picker', 'calendar'], docsFrom: 'date-picker',
    map: [[ANT, 'DatePicker (showTime)', 'Direct'], [MAT, 'Date pickers with time pickers', 'Partial'], [SPE, 'Date picker (granularity)', 'Direct']],
    examples: [['A start time with its zone', picker(DATETIME)],
      // issue 813: the app's time zone, never the reader's computer's (Tokyo, or New York on a computer in Tokyo)
      ['In the app’s time zone (LocaleProvider timeZone), not the computer’s', function () {
        var local = Intl.DateTimeFormat().resolvedOptions().timeZone, zone = local === 'Asia/Tokyo' ? 'America/New_York' : 'Asia/Tokyo';
        var city = zone === 'Asia/Tokyo' ? 'Tokyo' : 'New York';
        return h(P.LocaleProvider, { timeZone: zone }, h(Picker, { mode: 'date-time', label: 'Starts, ' + city + ' time', description: 'Shown and saved in ' + city + ', whatever this computer’s zone (' + local + ')', start: '2026-10-20T05:30:00.000Z' }));
      }]] };

  /* ── 05 Forms › Select and lookup › Country / locale select ── */
  var Country = function (props) {
    var s = use(props.start);
    var p = Object.assign({}, props); delete p.start; delete p.label;
    return box(320, h(P.Field, { label: props.label || 'Country or region' }, h(P.CountrySelect, Object.assign({ value: s[0], onChange: s[1] }, p))));
  };
  var country = function (props) { return function () { return h(Country, props); }; };
  var countrySelect = { id: 'country-select', lab: true, icon: 'flag', sec: 'forms', sub: 'Select and lookup', leaf: 'Country / locale select', title: 'Country / locale select',
    plenix: 'CountrySelect', src: 'components/CountrySelect/CountrySelect.tsx', level: 'Component', interaction: 'Selection', statesFrom: ['combobox'],
    aliases: ['Country picker', 'Region select', 'Language select', 'Locale picker'],
    text: 'A searchable select of countries and regions, of languages, or of locales (a language with its region), built on Combobox. The names come from the browser in the reader’s language, so there is no list of names to keep; a language and a locale are named in themselves (Deutsch) with the reader’s name after them. The list is sorted by name; typing matches the name, the English name and the code, so Germany, Deutschland and DE all find it. The value is the code: DE, de, de-DE.',
    use: ['Address, phone, tax and shipping countries; the language and the regional format of an account', 'priority for the few codes most people choose (their own country)', 'codes for technical settings where people know the codes'],
    avoid: ['A flag alone for a language: a language is not a country', 'A free-text field for a country: names vary, codes do not', 'Guessing the country from the language'],
    related: ['combobox', 'date-and-time-formats'],
    map: [[POL, 'Select (country)', 'Partial'], [SPE, 'Picker / Combo box', 'Partial'], [ATL, 'Select', 'Partial'], [CAR, 'Combo box', 'Partial'], [ANT, 'Select (showSearch)', 'Partial']],
    variantPages: [
      vp('Country select', 'Type', 'Country (default)', { variant: 'country' }, 'Every country and region by its name in the reader’s language; the value is its ISO 3166 code.', 'Addresses, phone numbers, tax and shipping', 'A language: use the language type'),
      vp('Locale select', 'Type', 'Locale', { variant: 'locale' }, 'A language with its region, named in itself with the reader’s name after it; the value is a locale tag such as de-DE.', 'Regional formats: dates, numbers and money', 'The language of the interface alone: use the language type'),
      vp('Language select', 'Type', 'Language', { variant: 'language' }, 'Languages named in themselves (Deutsch, Español), the reader’s name after them; the value is the language code.', 'The language of the interface or of content', 'Countries: a language is spoken in many'),
      vp('Country select with flags', 'Flags', 'With flag emoji', { variant: 'flags' }, 'The country’s flag emoji before its name; where the system draws no flags (Windows) its two letters show instead.', 'A long list of countries people scan by sight', 'Languages, and flags without the name')
    ],
    examples: [['Type', [['Country (default)', country({ start: 'DE' }), null, 'type="country"'], ['Locale', country({ type: 'locale', label: 'Regional format', start: 'en-GB' }), null, 'type="locale"'],
      ['Language', country({ type: 'language', label: 'Language', start: 'es' }), null, 'type="language"']], { prop: 'type' }],
      ['Flags', [['With flag emoji', country({ flags: true, start: 'CA', priority: ['US', 'CA', 'MX'] }), null, 'flags']]]] };

  /* ── 06 Navigation › Stepper (ProgressSteps); 08 Feedback › Progress tracker, Step progress ── */
  var STEPS = [{ label: 'Upload', description: '12 files' }, { label: 'Map columns', description: 'Name, owner, date' }, { label: 'Review' }, { label: 'Import' }];
  var Steps = function (props) {
    var s = use(props.current !== undefined ? props.current : 2);
    var p = Object.assign({ label: 'Import steps', steps: STEPS }, props, { current: s[0] });
    if (props.clickable) { p.onStepClick = s[1]; delete p.clickable; }
    return box(props.orientation === 'vertical' ? 320 : 600, h(P.ProgressSteps, p));
  };
  var steps = function (props) { return function () { return h(Steps, props); }; };
  var ERRORS = [{ label: 'Upload', status: 'complete' }, { label: 'Map columns', status: 'error', description: '2 columns not mapped' }, { label: 'Review', status: 'upcoming' }, { label: 'Import', status: 'upcoming' }];
  var progressSteps = { id: 'progress-steps', lab: true, icon: 'checklist', sec: 'navigation', sub: 'Hierarchical navigation', leaf: 'Stepper', title: 'Stepper',
    plenix: 'ProgressSteps (Step progress: variant="compact")', src: 'components/ProgressSteps/ProgressSteps.tsx', level: 'Component', interaction: 'Navigation',
    aliases: ['Progress steps', 'Step indicator', 'Wizard steps', 'Steps', 'Step progress'],
    text: 'The steps of a task done in order, and where the person is: each step’s marker and name, joined by connectors. A done step shows a check in the selected state, the current step its number on the action color, an upcoming step its number in an outline, and a step that needs attention an alert in the soft danger colors; each also gives screen readers its state in words, never by color alone. The list is an ordered list; the current step has aria-current="step". With onStepClick the done and current steps are buttons that go back to them; upcoming steps cannot be skipped to. The compact form, Step progress (variant="compact"), is for short sequences where only the current step matters: “Step 2 of 5: Review” in words, over a bar of one segment per step (the small ProgressBar’s track and fill). The text carries the meaning; the segments are decoration. Pair it with Back and Next.',
    use: ['Three to seven steps done in order: setup, an import, a checkout', 'Short noun names (Details, Review), parallel and one or two words', 'Vertical when the steps have descriptions or the window is narrow', 'onStepClick so people can go back and change a done step'],
    avoid: ['One or two steps: a heading is enough', 'Steps that can be done in any order: use tabs or sections', 'Letting people skip ahead past steps that are not done', 'A record’s status: use a Badge', 'The compact form for long or complex flows where people need the step names: use the full stepper', 'More than about seven steps'],
    related: ['progress-tracker', 'progress-bar', 'tabs', 'forms-form'],
    covers: ['feedback/Step progress'],
    map: [[CAR, 'Progress indicator', 'Direct'], [ATL, 'Progress tracker', 'Direct'], [MAT, 'Steppers (M2)', 'Partial'], [FLU, 'Wizard steps', 'Partial'], [SPE, 'Steplist', 'Partial'], [ANT, 'Steps', 'Direct']],
    variantPages: [
      vp('Horizontal stepper', 'Orientation', 'Horizontal (default)', { variant: 'horizontal' }, 'The steps in one row, the connectors growing to share it; steps that do not fit wrap.', 'Four or five short steps across a page or a dialog', 'Long names or descriptions: go vertical'),
      vp('Vertical stepper', 'Orientation', 'Vertical', { variant: 'vertical' }, 'One step under another, the connector down the marker column, room for a second line.', 'Steps with descriptions, side panels, narrow windows', 'Two or three short steps in a wide dialog'),
      vp('Clickable stepper', 'Interaction', 'Clickable', { variant: 'clickable' }, 'The done and current steps are buttons with a hover fill and a focus outline; upcoming steps stay text.', 'Flows where people go back to change a step', 'Steps that cannot be revisited'),
      vp('Stepper with status', 'Status', 'With status (complete, current, error)', { variant: 'status' }, 'A step that needs attention shows an alert in the soft danger colors and its name in the danger color, with the reason in its second line.', 'A step whose data failed a check', 'Showing errors without saying what to fix'),
      vp('Compact stepper', 'Form', 'Compact', { variant: 'compact' }, '“Step 2 of 5: Review” over a bar of one segment per step.', 'Short sequences where only the current step matters: onboarding, a tour', 'Long flows where people need to see every step’s name')
    ],
    examples: [['Orientation', [['Horizontal (default)', steps({}), 'plx-progress-steps--horizontal', 'orientation="horizontal"'], ['Vertical', steps({ orientation: 'vertical' }), 'plx-progress-steps--vertical', 'orientation="vertical"']], { prop: 'orientation' }],
      ['Interaction', [['Clickable', steps({ clickable: true }), 'plx-progress-steps--clickable', 'onStepClick']]],
      ['Status', [['With status (complete, current, error)', steps({ steps: ERRORS, current: 1 }), null, 'steps[].status']]],
      ['Form', [['Compact', steps({ variant: 'compact', current: 1 }), 'plx-progress-steps--compact', 'variant="compact"']], { prop: 'variant' }],
      ['Step 2 of 4', steps({ variant: 'compact', current: 1 })]], also: [] };
  var progressTracker = { id: 'progress-tracker', icon: 'checklist', sec: 'feedback', sub: 'Loading and progress', leaf: 'Progress tracker', title: 'Progress tracker',
    plenix: 'ProgressSteps', src: 'components/ProgressSteps/ProgressSteps.tsx', level: 'Component', interaction: 'Navigation', variantClasses: [], statesFrom: ['progress-steps'], docsFrom: 'progress-steps',
    aliases: ['Step tracker', 'Progress steps'],
    text: 'Shows the named steps of a task in order, each with its state (done, current, upcoming, needs attention) shown by its marker and said in words. It is ProgressSteps (the navigation Stepper). Horizontal for a few short steps; vertical when the steps have descriptions or the window is narrow.',
    use: ['Linear flows of three to about seven named steps: setup, checkout, an import', 'A second line under a step to say what it holds or what failed'],
    avoid: ['Two-step flows: a heading such as Step 1 of 2 is enough', 'Navigation between unrelated pages: use tabs or the navigation pane'],
    related: ['progress-steps', 'progress-bar'],
    examples: [['A vertical tracker with descriptions', steps({ orientation: 'vertical', current: 1 })]] };
  /* ── 06 Navigation › Content navigation › Vertical tabs ── */
  var SETTINGS_TABS = [['general', 'General'], ['profile', 'Profile'], ['notifications', 'Notifications'], ['security', 'Security and sign-in'], ['storage', 'Storage', 3], ['integrations', 'Integrations']];
  var VTabs = function (props) {
    var s = use('profile');
    return box(560, h(P.Tabs, { orientation: 'vertical', label: 'Settings sections', value: s[0], onChange: s[1],
      items: SETTINGS_TABS.map(function (t) { return { value: t[0], label: t[1], count: t[2], icon: props.icons ? { general: 'gear', profile: 'person', notifications: 'hdr-bell', security: 'settings-permissions', storage: 'folder', integrations: 'merge' }[t[0]] : undefined,
        content: h(P.Text, { as: 'p' }, 'The ' + t[1].toLowerCase() + ' settings.') }; }) }));
  };
  var verticalTabs = { id: 'vertical-tabs', lab: true, icon: 'panel-left-open', sec: 'navigation', sub: 'Content navigation', leaf: 'Vertical tabs', title: 'Vertical tabs',
    plenix: 'Tabs orientation="vertical"', src: 'components/Tabs/Tabs.jsx', blocks: ['plx-tabs'], variantClasses: ['plx-tabs--vertical'], level: 'Component', interaction: 'Navigation',
    aliases: ['Side tabs', 'Tab list (vertical)', 'Section tabs'],
    text: 'Tabs with orientation="vertical": the tabs in a column at the start, the panel beside them taking the rest of the width. Each tab is a navigation list row with the hover fill; the open tab is in the selected state (the navigation pane’s current row), and long names wrap. The tab list says it is vertical (aria-orientation); arrow keys move and select, and only the open tab is in the Tab order. Tabs never move into More. Tabs show no focus ring: focus is always on the open tab, which its look marks.',
    use: ['More than about six sections of one thing, or long section names: settings, a record’s many views', 'Short nouns in sentence case, one line where possible'],
    avoid: ['Page-level navigation between places: use the navigation pane', 'Two or three sections: use horizontal tabs', 'Narrow windows: the column takes too much room (use horizontal tabs or a list)'],
    related: ['tabs', 'side-navigation', 'navigation-menu', 'settings-page'],
    map: [[CAR, 'Tabs (vertical)', 'Direct'], [FLU, 'TabList (vertical)', 'Direct'], [SPE, 'Tabs (vertical orientation)', 'Direct'], [ANT, 'Tabs (tabPosition left)', 'Direct'], [ATL, 'Side navigation', 'Partial']],
    variantPages: [
      vp('Vertical tab list', 'Orientation', 'Vertical', { variant: 'vertical' }, 'The tabs in a column at the start as navigation list rows, the open one in the selected state, the panel beside them.', 'Settings and other long lists of sections', 'Navigation between pages')
    ],
    examples: [['Orientation', [['Vertical', function () { return h(VTabs, {}); }, 'plx-tabs--vertical', 'orientation="vertical"']], { prop: 'orientation' }],
      ['With icons and a count', function () { return h(VTabs, { icons: true }); }]] };

  /* ── 06 Navigation › Global navigation › Mobile app bar; Product navigation ── */
  var Phone = function (props) {
    var page = use(props.child ? 'child' : 'top');
    var bar = page[0] === 'child'
      ? h(P.AppHeader, { tone: 'accent', back: { onClick: function () { page[1]('top'); } }, title: 'Q3 launch plan', nav: [],
        actions: h(P.AppHeader.Item, { icon: h(P.Icon, { name: 'more' }), label: 'More actions' }) })
      : h(P.AppHeader, { tone: 'accent', appName: 'Notes', nav: [], search: h(P.SearchField, { placeholder: 'Search notes', label: 'Search notes', onAccent: true }),
        actions: h(P.AppHeader.Item, { icon: h(P.Icon, { name: 'pencil' }), label: 'New note', onClick: function () { page[1]('child'); } }) });
    return box(360, bar);
  };
  var mobileAppBar = { id: 'mobile-app-bar', lab: true, icon: 'app-switcher', sec: 'navigation', sub: 'Mobile navigation', leaf: 'Mobile app bar', title: 'Mobile app bar',
    plenix: 'AppHeader (Narrow), back, title', src: 'patterns/AppHeader/AppHeader.jsx', variantClasses: [], level: 'Composite', interaction: 'Navigation', statesFrom: ['application-header'],
    aliases: ['Top app bar', 'Navigation bar', 'Mobile header'],
    text: 'On a phone (the Narrow window class) AppHeader is the mobile app bar: the header name and switcher at the start, search and the utilities at the end. The header links leave it (they stay in the switcher), and search opens a full-screen search view. On a screen inside the application, back puts Back first and title puts the screen’s title after it, in place of the header name (cut short with an ellipsis); the actions stay at the end. With a touch pointer every item has a 44 × 44px target.',
    use: ['Every screen of an application on a phone, through AppShell', 'back and title on a child screen (a note, a record); the title the same as the page’s heading', 'Two or three actions at most; the rest in a More menu'],
    avoid: ['A Back item on a top-level screen: its header name opens the switcher', 'A long title: it is cut short', 'Destinations of the application in the bar: they go in the bottom navigation (NavPane)'],
    related: ['application-header', 'product-switcher', 'side-navigation', 'screen-location'],
    map: [[MAT, 'Top app bar', 'Direct'], [CAR, 'UI shell header (small screens)', 'Partial'], [ATL, 'Top navigation (mobile)', 'Partial'], [FLU, 'Toolbar (mobile)', 'Partial']],
    variantPages: [
      vp('Mobile app bar on a top-level screen', 'Variant', 'Narrow (mobile app bar)', { variant: 'narrow' }, 'The header name and switcher at the start, search and the utilities at the end; no header links.', 'Top-level screens of an application on a phone', 'Wide windows: the header links show there'),
      vp('Mobile app bar with Back', 'Variant', 'With back', { variant: 'back' }, 'Back first, then the screen’s title in the header name’s type, the actions at the end.', 'A screen inside the application: a note, a record', 'A top-level screen')
    ],
    examples: [['Variant', [['Narrow (mobile app bar)', function () { return h(Phone, {}); }, null, 'AppHeader'], ['With back', function () { return h(Phone, { child: true }); }, null, 'back title']]]] };
  var productNavigation = { id: 'product-navigation', icon: 'panel-left-open', sec: 'navigation', sub: 'Local navigation', leaf: 'Product navigation', title: 'Product navigation',
    plenix: 'AppHeader, NavPane', src: 'patterns/AppHeader/AppHeader.jsx', also: ['patterns/NavPane/NavPane.jsx'], variantClasses: [], level: 'Composite', interaction: 'Navigation', statesFrom: ['application-header', 'side-navigation'],
    aliases: ['Product nav', 'App navigation', 'Main navigation'],
    text: 'A Plenix product is navigated at two levels. Across applications: the header (AppHeader), whose header name opens the switcher and whose links are the applications the person pinned. Inside an application: the navigation pane (NavPane) beside the content, with the application’s sections, collections and saved views, the current one marked; it collapses to a rail, opens over the content at Medium and becomes the bottom navigation bar on a phone.',
    use: ['Every application: AppHeader across the top and NavPane at the start, through AppShell', 'Short nouns for the pane’s rows; groups for more than about seven'],
    avoid: ['Links to other applications in the pane: they are in the header and the switcher', 'More than two levels in the pane: use a tree or drill down'],
    related: ['application-header', 'side-navigation', 'product-switcher', 'mobile-app-bar'],
    map: [[CAR, 'UI shell (header and side nav)', 'Direct'], [ATL, 'Navigation system', 'Direct'], [MAT, 'Navigation drawer and top app bar', 'Partial'], [FLU, 'Nav', 'Partial']],
    examples: [['The header and the pane of an application', function () {
      var s = use('notes'), sec = use('all');
      return box(640, h('div', { className: 'ds-w07a-product' },
        h(P.AppHeader, { tone: 'accent', currentApp: s[0], appsRoot: '../../../', onOpenApp: function (app) { s[1](app.id); return true; } }),
        h('div', { className: 'ds-w07a-product__pane' }, h(P.NavPane, { as: 'div', label: 'Notes', title: 'Notes' },
          h(P.NavList, { label: 'Notes', value: sec[0], onSelect: sec[1], items: [{ id: 'all', label: 'All notes', icon: 'doc-text', count: 24 }, { id: 'work', label: 'Work', icon: 'folder', count: 9 }, { id: 'shared', label: 'Shared with me', icon: 'person', count: 3 }] })))));
    }]] };

  return [calendar, datePicker, dateRange, dateTime, countrySelect, progressSteps, progressTracker, verticalTabs, mobileAppBar, productNavigation];
});
