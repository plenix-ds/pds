/* Plenix design system · library part w01A (wave 1, lane A): the formatting foundation (numbers and units, dates and
   times, currency and percentages, names, addresses and phone numbers: utils/format.ts and the Formats standard) and four
   behavioral utilities (live regions, clipboard, hotkeys, virtualization). Each is a rules page with live examples. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, m = H.m;
  var SP = ['Spectrum'], PO = ['Polaris'], GOV = ['GOV.UK'];
  // a table of formatted values: what was called, and what it gives in two locales (the formatter's own words); o.one: one
  // result column for what does not depend on the locale. Results are technical values (the data role, Reddit Mono at the
  // table's size); o.text: people's own words (names, addresses) stay in DM Sans
  var formats = function (label, list, o) {
    o = o || {};
    var one = o.one, out = o.text ? 'wrap' : ['data', 'wrap'];
    var call = { title: 'Call', field: 'call', kind: ['data', 'wrap'] };
    return box(720, h(P.Table, { label: label, data: list.map(function (x, i) { return one ? { id: i + 1, call: x[0], out: x[1]() } : { id: i + 1, call: x[0], us: x[1]('en-US'), de: x[1]('de-DE') }; }),
      columns: one ? [call, { title: 'Result', field: 'out', kind: out }] : [call, { title: 'en-US', field: 'us', kind: out }, { title: 'de-DE', field: 'de', kind: out }] }));
  };
  var WHEN = new Date(2026, 2, 4, 14, 5), NOW = new Date(2026, 2, 6, 9, 30);
  var ago = function (min) { return new Date(NOW.getTime() - min * 60000); };
  var lines = function (list) { return h(P.Stack, { gap: 'none' }, list.map(function (l, i) { return h(P.Text, { key: i }, l); })); };

  // live examples of the utilities: each is a small component (the spec renders an example as one)
  var Announcer = function (p) {
    var n = use(0);
    return row(h(P.Button, { onClick: function () { n[1](n[0] + 1); P.announce(p.text + ' (' + (n[0] + 1) + ')', { politeness: p.politeness }); } }, p.button),
      h(P.Text, { variant: 'secondary' }, n[0] ? 'Announced ' + n[0] + (n[0] === 1 ? ' time' : ' times') : 'Nothing announced yet'));
  };
  var StatusDemo = function () {
    var n = use(0);
    return h(P.Stack, { gap: 'sm' }, row(h(P.Button, { icon: 'add', onClick: function () { n[1](n[0] + 1); } }, 'Add a file'), h(P.Button, { variant: 'ghost', onClick: function () { n[1](0); } }, 'Clear')),
      h(P.LiveRegion, { kind: 'status', visible: true }, h(P.Text, { variant: 'secondary' }, P.formatNumber(n[0]) + (n[0] === 1 ? ' file selected' : ' files selected'))));
  };
  var LogDemo = function () {
    var l = use([]);
    return h(P.Stack, { gap: 'sm' }, row(h(P.Button, { onClick: function () { l[1](l[0].concat(['Uploaded Cross ' + String(l[0].length + 1).padStart(3, '0') + '.png'])); } }, 'Upload a file')),
      h(P.LiveRegion, { kind: 'log', visible: true }, l[0].length ? lines(l[0]) : h(P.Text, { variant: 'secondary' }, 'The log is empty')));
  };
  var CopyDemo = function (p) {
    var clip = P.useClipboard();
    return h(P.Stack, { gap: 'sm' }, row(h(P.Text, { variant: 'data' }, p.show),
      h(P.Button, { size: 'sm', icon: clip.copied ? 'check' : 'ed-copy', onClick: function () { clip.copy(p.value()); } }, clip.copied ? 'Copied' : p.button)),
      clip.error ? h(P.Notice, { tone: 'danger' }, clip.error) : null);
  };
  var picture = function () {
    // the Plenix mark, drawn on a canvas and taken as a PNG (browsers copy PNG pictures)
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { var c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); c.toBlob(function (b) { return b ? resolve(b) : reject(new Error('no picture')); }, 'image/png'); };
      img.onerror = reject;
      img.src = PlenixSource.at('brand/plenix-icon.svg');
    });
  };
  var HotkeyDemo = function (p) {
    var ref = React.useRef(null), log = use([]);
    var say = function (t) { log[1](function (l) { return l.concat([t]).slice(-3); }); };
    (p.bindings || []).forEach(function (b) { P.useHotkey(b[0], function () { say(b[1]); }, { scope: ref, label: b[1], group: 'Examples' }); });
    return h('div', { ref: ref, tabIndex: 0, className: 'ds-hotkey-demo', 'aria-label': 'Shortcut example: click here, then press the keys' },
      h(P.Stack, { gap: 'sm' }, h(P.Inline, { wrap: true }, (p.bindings || []).map(function (b) { return h(P.Inline, { key: b[0], gap: 'xs' }, h(P.Kbd, null, P.hotkeyLabel(b[0])), h(P.Text, { variant: 'secondary' }, b[1])); })),
        p.field ? h(P.Field, { label: 'A text field in the region' }, h(P.Input, { placeholder: 'Typing N here does not run the shortcut' })) : null,
        h(P.LiveRegion, { kind: 'log', visible: true }, log[0].length ? lines(log[0]) : h(P.Text, { variant: 'secondary' }, 'Click in this box, then press a shortcut'))));
  };
  var ShortcutList = function () {
    var list = P.useHotkeyList();
    // the table is drawn once the examples above have bound their keys (a new table when the list changes)
    if (!list.length) return h(P.Text, { variant: 'secondary' }, 'No shortcuts are bound on this page');
    return box(560, h(P.Table, { key: list.length, label: 'Keyboard shortcuts', data: list.map(function (x, i) { return { id: i + 1, label: x.label, keys: x.keys, group: x.group }; }),
      columns: [{ title: 'Command', field: 'label', kind: 'name', rowLabel: true }, { title: 'Keys', field: 'keys', kind: 'data' }, { title: 'Group', field: 'group' }] }));
  };
  var VList = function (p) {
    var count = p.count, v = P.useVirtualizer({ count: count, mode: p.mode, axis: p.axis, grid: p.grid, sticky: p.sticky });
    var label = p.label || function (i) { return 'Item ' + P.formatNumber(i + 1); };
    return h(P.Stack, { gap: 'sm' },
      h('div', { ref: v.viewportRef, role: 'list', 'aria-label': p.name, className: 'ds-virtual-demo' + (p.variant ? ' ds-virtual-demo--' + p.variant : '') },
        h(P.VirtualProbe, { axis: p.axis }),
        v.segments.map(function (s) {
          if (s.gap) return h(P.VirtualGap, { key: s.key, count: s.count, axis: p.axis });
          var head = p.sticky && p.sticky.indexOf(s.index) >= 0;
          return h('div', Object.assign({ key: s.key, role: 'listitem', tabIndex: -1, className: (p.grid ? 'ds-virtual-demo__tile' : 'ds-virtual-demo__item') + (head ? ' ds-virtual-demo__header ' + P.VIRTUAL_STICKY_CLASS : '') }, v.itemProps(s.index)), label(s.index));
        })),
      h(P.Text, { variant: 'secondary' }, P.formatNumber(count) + ' items; ' + P.formatNumber(v.range.end - v.range.start) + ' rendered (' + P.formatNumber(v.range.start + 1) + '–' + P.formatNumber(v.range.end) + ')'));
  };
  var WORDS = 'Cross Border Banner Shelf Certificate Icon Seal Frame Ornament Initial'.split(' ');
  var measuredLabel = function (i) { var n = 1 + (i * 7) % 9, t = []; for (var k = 0; k < n; k++) t.push(WORDS[(i + k) % WORDS.length].toLowerCase()); return 'Note ' + (i + 1) + ': ' + t.join(' '); };
  var GROUP = 25, groupsOf = function (n) { var s = []; for (var i = 0; i < n; i += GROUP + 1) s.push(i); return s; };
  var STICKY = groupsOf(2000);
  var stickyLabel = function (i) { var g = STICKY.indexOf(i); return g >= 0 ? 'Group ' + (g + 1) : 'Item ' + P.formatNumber(i + 1); };

  return [
    /* ── 01 Foundations › Data formatting ── */
    { id: 'numbers-and-units', icon: 'fields', sec: 'foundations', sub: 'Data formatting', leaf: 'Numbers and units', title: 'Numbers and units',
      plenix: 'formatNumber, formatUnit, formatBytes, formatDuration, formatCompact, formatLocale, FORMATS',src: 'utils/format.ts', css: [], level: 'Foundation', interaction: 'Static',
      text: 'utils/format.ts writes counts, measurements, file sizes and durations in the reader’s locale (Intl.NumberFormat). The precision comes from the Formats standard (platform/standards/formats.json).',
      aliases: ['Number formatting', 'Units', 'File sizes', 'Durations', 'Compact numbers'],
      use: ['formatNumber for every count and measured value shown to people; one precision (decimals) for a whole column', 'formatBytes for file sizes (B, kB, MB, GB: powers of 1000), formatDuration for lengths of time, formatUnit for any other measurement',
        'formatCompact ("1.2K") only where space is tight, with the full value beside it (a tooltip or the title)', 'Numerals, not words, and the data role (Text variant="data") for technical values'],
      avoid: ['Separators, decimal marks or unit names written by hand (toFixed, string concatenation)', 'Mixing unit systems or precisions in one view', 'A compact number as the only way to read the value'],
      related: ['date-and-time-formats', 'currency-and-percentages', 'typography'],
      map: [m(PO, 'Numbers / Formatting'), m(['Carbon'], 'Numbers and units (writing style)'), m(SP, 'Grammar and mechanics: numbers', 'Partial'), m(['Atlassian'], 'Numbers', 'Partial'), m(['Material 3'], 'Numbers in content', 'Partial')],
      examples: [
        ['Number', function () { return formats('Numbers', [
          ['formatNumber(1234567.891)', function (l) { return P.formatNumber(1234567.891, { locale: l }); }],
          ['formatNumber(0.5, { decimals: 2 })', function (l) { return P.formatNumber(0.5, { locale: l, decimals: 2 }); }],
          ['formatNumber(12, { signed: true })', function (l) { return P.formatNumber(12, { locale: l, signed: true }); }]]); }],
        ['Unit (bytes, duration, length)', function () { return formats('Units', [
          ['formatBytes(1234567)', function (l) { return P.formatBytes(1234567, { locale: l }); }],
          ['formatBytes(24000)', function (l) { return P.formatBytes(24000, { locale: l }); }],
          ['formatDuration(3900)', function (l) { return P.formatDuration(3900, { locale: l }); }],
          ['formatDuration(3900, { display: "clock" })', function (l) { return P.formatDuration(3900, { locale: l, display: 'clock' }); }],
          ['formatUnit(12.5, "kilometer")', function (l) { return P.formatUnit(12.5, 'kilometer', { locale: l }); }],
          ['formatUnit(210, "millimeter", { display: "long" })', function (l) { return P.formatUnit(210, 'millimeter', { locale: l, display: 'long' }); }]]); }],
        ['Compact (1.2K)', function () { return formats('Compact numbers', [
          ['formatCompact(1234)', function (l) { return P.formatCompact(1234, { locale: l }); }],
          ['formatCompact(3456789)', function (l) { return P.formatCompact(3456789, { locale: l }); }],
          ['formatCompact(980)', function (l) { return P.formatCompact(980, { locale: l }); }]]); }]] },
    { id: 'date-and-time-formats', icon: 'calendar', sec: 'foundations', sub: 'Data formatting', leaf: 'Date and time formats', title: 'Date and time formats',
      plenix: 'formatDate, formatTime, formatDateTime, formatRelative, formatRange, dateTimeAttr', src: 'utils/format.ts', css: [], level: 'Foundation', interaction: 'Static',
      text: 'utils/format.ts writes dates and times in the reader’s locale and time zone (Intl.DateTimeFormat, RelativeTimeFormat). The month is always a word. Recent events read as relative time until the Formats standard’s cut-off (7 days). Dates sit in a time element with a machine-readable value.',
      aliases: ['Date formatting', 'Time formatting', 'Relative time', 'Date ranges', 'Timestamps'],
      use: ['formatDate with a dateStyle: "short" in dense rows, "medium" (the default) for records, "long" or "full" in sentences and headers', 'formatRelative for recent activity ("5 minutes ago"), with the full date and time on hover; it turns into the date after 7 days',
        'formatRange for a span of dates ("Mar 4 – 6, 2026"), so the shared month and year are written once', 'The time zone (timeZoneName: "short") for scheduled events and audit logs', '<time dateTime={dateTimeAttr(d)}> around every date shown', 'A date-only value ("2026-10-18") is that calendar day where the reader is: it shows its own day in every time zone (never the day before west of Greenwich). Every format helper, Time and the parts that show dates read values through one shared parser (parseDate); a timestamp with a time keeps its moment'],
      avoid: ['All-numeric dates (03/04/2026) that read differently by region', 'Formats written by hand (getMonth() + 1, padStart)', 'new Date(value) on a date-only value: it reads it as midnight UTC; pass the value to the format helpers', '"Today" or "Yesterday" without a time'],
      related: ['numbers-and-units', 'currency-and-percentages'],
      map: [m(['Carbon'], 'Dates and times (writing style)'), m(PO, 'Date and time formatting'), m(['Atlassian'], 'Dates and times', 'Partial'), m(SP, 'Grammar and mechanics: dates', 'Partial'), m(['Material 3'], 'Date formatting', 'Partial')],
      examples: [
        ['Date (short, medium, long)', function () { return formats('Dates', [
          ['formatDate(d, { dateStyle: "short" })', function (l) { return P.formatDate(WHEN, { locale: l, dateStyle: 'short' }); }],
          ['formatDate(d)', function (l) { return P.formatDate(WHEN, { locale: l }); }],
          ['formatDate(d, { dateStyle: "long" })', function (l) { return P.formatDate(WHEN, { locale: l, dateStyle: 'long' }); }],
          ['formatDate(d, { dateStyle: "full" })', function (l) { return P.formatDate(WHEN, { locale: l, dateStyle: 'full' }); }]]); }],
        ['Time', function () { return formats('Times', [
          ['formatTime(d)', function (l) { return P.formatTime(WHEN, { locale: l }); }],
          ['formatTime(d, { seconds: true })', function (l) { return P.formatTime(WHEN, { locale: l, seconds: true }); }],
          ['formatTime(d, { timeZone: "UTC", timeZoneName: "short" })', function (l) { return P.formatTime(WHEN, { locale: l, timeZone: 'UTC', timeZoneName: 'short' }); }]]); }],
        ['Date-time', function () { return formats('Dates with times', [
          ['formatDateTime(d)', function (l) { return P.formatDateTime(WHEN, { locale: l }); }],
          ['formatDateTime(d, { dateStyle: "long" })', function (l) { return P.formatDateTime(WHEN, { locale: l, dateStyle: 'long' }); }]]); }],
        ['Relative', function () { return formats('Relative times', [
          ['formatRelative(5 minutes ago)', function (l) { return P.formatRelative(ago(5), { locale: l, now: NOW }); }],
          ['formatRelative(3 hours ago)', function (l) { return P.formatRelative(ago(180), { locale: l, now: NOW }); }],
          ['formatRelative(yesterday)', function (l) { return P.formatRelative(ago(1440), { locale: l, now: NOW }); }],
          ['formatRelative(10 days ago)', function (l) { return P.formatRelative(ago(14400), { locale: l, now: NOW }); }]]); }],
        ['Range', function () { return formats('Ranges', [
          ['formatRange(Mar 4, Mar 6)', function (l) { return P.formatRange(WHEN, new Date(2026, 2, 6), { locale: l }); }],
          ['formatRange(Mar 4, Apr 2)', function (l) { return P.formatRange(WHEN, new Date(2026, 3, 2), { locale: l }); }],
          ['formatRange(3, 5, { kind: "number" })', function (l) { return P.formatRange(3, 5, { locale: l, kind: 'number' }); }]]); }],
        ['In a time element', function () { return h('time', { dateTime: P.dateTimeAttr(WHEN), title: P.formatDateTime(WHEN, { dateStyle: 'long' }) }, P.formatRelative(WHEN, { now: NOW })); }]] },
    { id: 'currency-and-percentages', icon: 'chart', sec: 'foundations', sub: 'Data formatting', leaf: 'Currency and percentages', title: 'Currency and percentages',
      plenix: 'formatCurrency, formatPercent', src: 'utils/format.ts', css: [], level: 'Foundation', interaction: 'Static',
      text: 'utils/format.ts writes money and ratios in the reader’s locale (Intl.NumberFormat, currency and percent). A page that mixes currencies writes ISO codes.',
      aliases: ['Money', 'Prices', 'Percentages', 'Ratios', 'Changes'],
      use: ['formatCurrency(amount, "USD") with the currency’s ISO 4217 code; display "code" where several currencies appear together', 'formatPercent with the ratio (0.25 → "25%"); signed: true for a change ("+3%")',
        'Amounts right-aligned with tabular figures; a gain or loss marked by its sign and a word or icon as well as its color'],
      avoid: ['A symbol, its position or the separators written by hand', 'Rounding money that people reconcile', 'Color as the only sign of a gain or a loss'],
      related: ['numbers-and-units', 'metric', 'date-and-time-formats'],
      map: [m(PO, 'Formatting localized currency'), m(['Carbon'], 'Currency and percentages (writing style)', 'Partial'), m(SP, 'Grammar and mechanics: currency', 'Partial'), m(['Atlassian'], 'Numbers and currency', 'Partial')],
      examples: [
        ['Currency', function () { return formats('Currency', [
          ['formatCurrency(1234.5, "USD")', function (l) { return P.formatCurrency(1234.5, 'USD', { locale: l }); }],
          ['formatCurrency(1234.5, "EUR")', function (l) { return P.formatCurrency(1234.5, 'EUR', { locale: l }); }],
          ['formatCurrency(1500, "JPY")', function (l) { return P.formatCurrency(1500, 'JPY', { locale: l }); }],
          ['formatCurrency(1234.5, "EUR", { display: "code" })', function (l) { return P.formatCurrency(1234.5, 'EUR', { locale: l, display: 'code' }); }],
          ['formatCurrency(-20, "USD", { signed: true })', function (l) { return P.formatCurrency(-20, 'USD', { locale: l, signed: true }); }]]); }],
        ['Percent', function () { return formats('Percentages', [
          ['formatPercent(0.256)', function (l) { return P.formatPercent(0.256, { locale: l }); }],
          ['formatPercent(0.256, { decimals: 1 })', function (l) { return P.formatPercent(0.256, { locale: l, decimals: 1 }); }],
          ['formatPercent(0.03, { signed: true })', function (l) { return P.formatPercent(0.03, { locale: l, signed: true }); }]]); }]] },
    { id: 'names-addresses-and-phone-numbers', icon: 'person', sec: 'foundations', sub: 'Data formatting', leaf: 'Names, addresses and phone numbers', title: 'Names, addresses and phone numbers',
      plenix: 'formatPersonName, formatList, formatAddress, regionName, formatPhone', src: 'utils/format.ts', css: [], level: 'Foundation', interaction: 'Static',
      text: 'Shows personal details as people entered them. A name is one field. An address takes its country’s line order from the Formats standard, with the country named in the reader’s language. A phone number stored as E.164 is grouped for reading.',
      aliases: ['Personal names', 'Postal addresses', 'Phone numbers', 'Contact details'],
      use: ['One full-name field (with an optional preferred name); formatPersonName shows it as entered, "preferred" or "initials"', 'formatAddress with the address’s country: the lines come in that country’s order, and the country line only when it is not the reader’s',
        'Phone numbers stored as E.164 (+14155550123) and shown with formatPhone', 'autocomplete on every field that collects them (name, street-address, postal-code, tel)'],
      avoid: ['First and last name fields, or a name order assumed from one country', 'A fixed postal-code or phone pattern in a form: accept spaces and symbols', 'Placeholders as labels'],
      related: ['avatar', 'field', 'numbers-and-units'],
      map: [m(GOV, 'Names, Addresses, Telephone numbers'), m(PO, 'Names / Addresses (international)', 'Partial'), m(['Carbon'], 'Forms (international fields)', 'Partial'), m(['Atlassian'], 'Personal names', 'Partial')],
      examples: [
        ['Person name', function () { return formats('Names', [
          ['formatPersonName("María José García Pérez")', function () { return P.formatPersonName('María José García Pérez'); }],
          ['formatPersonName({ full, preferred: "Majo" }, { display: "preferred" })', function () { return P.formatPersonName({ full: 'María José García Pérez', preferred: 'Majo' }, { display: 'preferred' }); }],
          ['formatPersonName("Maya Chen", { display: "initials" })', function () { return P.formatPersonName('Maya Chen', { display: 'initials' }); }],
          ['formatList(["Maya", "Ana", "Li"])', function (l) { return P.formatList(['Maya', 'Ana', 'Li'], { locale: l }); }]], { text: true }); }],
        ['Postal address', function () { return formats('Addresses', [
          ['formatAddress({ …, country: "US" })', function (l) { return P.formatAddress({ name: 'Maya Chen', street: '500 Market Street', locality: 'San Francisco', region: 'CA', postalCode: '94105', country: 'US' }, { locale: l }).join(' · '); }],
          ['formatAddress({ …, country: "DE" })', function (l) { return P.formatAddress({ name: 'Ana Weber', street: 'Torstraße 12', locality: 'Berlin', postalCode: '10119', country: 'DE' }, { locale: l }).join(' · '); }],
          ['formatAddress({ …, country: "GB" })', function (l) { return P.formatAddress({ name: 'Li Wong', street: ['Flat 4', '10 Downing Road'], locality: 'London', postalCode: 'SW1A 2AA', country: 'GB' }, { locale: l }).join(' · '); }]], { text: true }); }],
        ['Phone', function () { return formats('Phone numbers', [
          ['formatPhone("+14155550123")', function () { return P.formatPhone('+14155550123'); }],
          ['formatPhone("+14155550123", { display: "national" })', function () { return P.formatPhone('+14155550123', { display: 'national' }); }],
          ['formatPhone("+4930123456")', function () { return P.formatPhone('+4930123456'); }],
          ['formatPhone("+33612345678")', function () { return P.formatPhone('+33612345678'); }]], { one: true }); }]] },

    /* ── 13 Interaction, Accessibility & Utilities ── */
    { id: 'live-regions', icon: 'hdr-bell', sec: 'interaction', sub: 'Accessibility', leaf: 'Live regions', title: 'Live regions',
      plenix: 'announce, LiveRegion', src: 'utils/announce.tsx', css: [], level: 'Foundation', interaction: 'Utility',
      text: 'A change people can see but a screen reader would miss (a save, a count, an upload, an error) is announced through a live region, without moving focus. Use announce(text) for a message of the moment, and LiveRegion for a status or a log that also stays on screen.',
      aliases: ['Announcements', 'aria-live', 'Status messages', 'Screen-reader announcements'],
      use: ['announce("12 results") after a search, a filter or a bulk action', 'announce(text, { politeness: "assertive" }) only for an urgent error', 'LiveRegion kind="status" for a count or a state shown on screen; kind="log" for a list of events that grows', 'Short, complete messages that make sense when heard alone'],
      avoid: ['Announcing every small change: a burst is read once, in its final state', 'A live region where focus already moves to the new content (a dialog, an error summary)', 'Controls, markup or icon names inside a live region'],
      related: ['visually-hidden', 'toast', 'clipboard'],
      map: [m(SP, 'LiveAnnouncer (React Aria)', 'Partial'), m(['Carbon'], 'Notification (role=status)', 'Partial'), m(['Atlassian'], 'Flag announcements', 'Partial'), m(['Fluent 2'], 'Announcements (useAnnounce)', 'Partial')],
      examples: [
        ['Polite', function () { return h(Announcer, { text: 'Saved', politeness: 'polite', button: 'Save' }); }],
        ['Assertive', function () { return h(Announcer, { text: 'Couldn’t save. Check your connection and try again.', politeness: 'assertive', button: 'Fail to save' }); }],
        ['Status', function () { return h(StatusDemo); }],
        ['Log', function () { return h(LogDemo); }]] },
    { id: 'clipboard', icon: 'ed-copy', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Clipboard', title: 'Clipboard',
      plenix: 'useClipboard, copyText, copyRich, copyImage', src: 'utils/clipboard.ts', css: [], level: 'Foundation', interaction: 'Utility',
      text: 'A value people paste elsewhere (an ID, a path, a link, a code sample, a picture) gets a copy button beside it. useClipboard copies the value, shows Copied for two seconds (--plx-sys-clipboard-feedback-duration) and announces the result; a failure says what to do instead.',
      aliases: ['Copy to clipboard', 'Copy button', 'Copied state'],
      use: ['A copy button next to IDs, URLs, file paths, keys shown once and code samples', 'A button named for what it copies ("Copy file path"), Copied while copied is true', 'copyRich for content pasted into editors (formatting and plain text together)'],
      avoid: ['Copying without a person’s action, or without confirming it', 'Reading the clipboard', 'A failure without a way forward: say how to copy by hand'],
      related: ['live-regions', 'button', 'code-block'],
      map: [m(['Carbon'], 'Copy button'), m(SP, 'Clipboard (React Aria)', 'Partial'), m(PO, 'Clipboard / copy', 'Partial'), m(['Atlassian'], 'Code block copy', 'Partial')],
      examples: [
        ['Text', function () { return h(CopyDemo, { show: 'ASSET-0142', button: 'Copy asset ID', value: function () { return 'ASSET-0142'; } }); }],
        ['Rich (html + text)', function () { return h(CopyDemo, { show: 'Cross 014 (PNG, 1.2 MB)', button: 'Copy with formatting', value: function () { return { html: '<b>Cross 014</b> (PNG, 1.2 MB)', text: 'Cross 014 (PNG, 1.2 MB)' }; } }); }],
        ['Image', function () { return h(CopyDemo, { show: 'The Plenix mark', button: 'Copy picture', value: picture }); }],
        ['Copied state with timeout', function () { return h(CopyDemo, { show: '/Liturgical/Crosses/cross-014.png', button: 'Copy file path', value: function () { return '/Liturgical/Crosses/cross-014.png'; } }); }]] },
    { id: 'hotkey', icon: 'settings-general', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Hotkey', title: 'Hotkey',
      plenix: 'useHotkey, registerHotkey, hotkeyLabel, hotkeyKeys, parseHotkey, hotkeyList, useHotkeyList, subscribeHotkeys, setSingleKeyHotkeys, singleKeyHotkeys, isMac',src: 'utils/hotkey.ts', css: [], level: 'Foundation', interaction: 'Utility',
      text: 'Every keyboard shortcut is bound with useHotkey: a key, a chord or a sequence, for the page or for one region, with a label. The bindings form one registry: the shortcuts dialog lists it and the menus read their hints from it. Kbd draws the keys in the words of the reader’s platform (Ctrl on Windows and Linux, ⌘ on a Mac).',
      aliases: ['Keyboard shortcuts', 'Key bindings', 'Accelerators'],
      use: ['useHotkey("Mod+K", run, { label }) for a page command; Mod is Cmd on a Mac and Ctrl elsewhere', 'scope: a region’s ref for a command that belongs to it (the innermost region wins)', 'The same label as the command’s menu item, and hotkeyLabel for the hint beside it', 'A setting that turns single-key shortcuts off (setSingleKeyHotkeys(false)), as WCAG 2.2 SC 2.1.4 asks'],
      avoid: ['A keydown listener of a component’s own for a shortcut', 'Shortcuts that fire while typing in a field (unless allowInFields)', 'Keys that the browser or assistive technology needs (Tab, F6, Ctrl L)'],
      related: ['keyboard-hint', 'action-menu', 'focus-ring'],
      map: [m(SP, 'useKeyboard (React Aria)', 'Partial'), m(['Fluent 2'], 'Keyboard shortcuts', 'Partial')],
      examples: [
        ['Single key', function () { return h(HotkeyDemo, { bindings: [['N', 'New note']] }); }],
        ['Chord (Ctrl K)', function () { return h(HotkeyDemo, { bindings: [['Mod+Shift+L', 'Lock the note']] }); }],
        ['Sequence (g then i)', function () { return h(HotkeyDemo, { bindings: [['G I', 'Go to inbox'], ['G S', 'Go to sent']] }); }],
        ['Scoped to a region', function () { return h(HotkeyDemo, { bindings: [['Delete', 'Delete the selected note']] }); }],
        ['Platform-aware Mod key', function () { return formats('The Mod key', [
          ['hotkeyLabel("Mod+K", { mac: false })', function () { return P.hotkeyLabel('Mod+K', { mac: false }); }],
          ['hotkeyLabel("Mod+K", { mac: true })', function () { return P.hotkeyLabel('Mod+K', { mac: true }); }],
          ['hotkeyLabel("Mod+Shift+P", { mac: true })', function () { return P.hotkeyLabel('Mod+Shift+P', { mac: true }); }],
          ['hotkeyLabel("G I")', function () { return P.hotkeyLabel('G I'); }]], { one: true }); }],
        ['Ignored in fields', function () { return h(HotkeyDemo, { bindings: [['N', 'New note']], field: true }); }],
        ['The registry', function () { return h(ShortcutList); }]] },
    { id: 'virtualization', icon: 'list-lines', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Virtualization', title: 'Virtualization',
      plenix: 'useVirtualizer, VirtualGap, VirtualProbe, VIRTUAL_STICKY_CLASS, gapPieces',src: 'hooks/useVirtualizer.ts', css: ['system/virtual.css'], level: 'Foundation', interaction: 'Utility',
      text: 'A collection of thousands of items renders only what is in view. useVirtualizer gives the items to render and the gaps between them; system/virtual.css sizes each gap from the item size token, so no style is written and the scroll bar keeps its true length. Items keep their place in the whole (aria-posinset of aria-setsize), and the focused item stays rendered.',
      aliases: ['Windowing', 'Virtual list', 'Virtual scrolling', 'Long lists'],
      use: ['Lists, file grids and logs that can grow past a few hundred items', 'Fixed rows (the default) wherever items have one size: set --plx-sys-virtual-item-size (and -gap) to it in the container’s stylesheet', 'mode: "measured" only for items whose size depends on their content', 'The total count shown in the header or status bar'],
      avoid: ['Virtualizing short lists', 'Collections people search with the browser’s find, without a search of the page’s own', 'DataGrid: it keeps its own rendering'],
      related: ['implementation-virtualization', 'data-grid', 'interactive-list'],
      map: [m(SP, 'Virtualizer (React Aria)'), m(['Fluent 2'], 'Virtualizer'), m(['Atlassian'], 'Dynamic table (large data)', 'Partial')],
      examples: [
        ['Fixed row height', function () { return h(VList, { count: 10000, name: 'Ten thousand items' }); }],
        ['Measured rows', function () { return h(VList, { count: 5000, mode: 'measured', variant: 'measured', name: 'Notes of different lengths', label: measuredLabel }); }],
        ['Grid (rows × columns)', function () { return h(VList, { count: 2000, grid: true, variant: 'grid', name: 'Two thousand tiles', label: function (i) { return P.formatNumber(i + 1); } }); }],
        ['Horizontal', function () { return h(VList, { count: 1000, axis: 'x', variant: 'x', name: 'A strip of a thousand items' }); }],
        ['Sticky headers', function () { return h(VList, { count: 2000, sticky: STICKY, name: 'Items in groups', label: stickyLabel }); }]] },

    /* ── 14 Implementation & Governance ── */
    { id: 'implementation-virtualization', icon: 'list-lines', sec: 'implementation', sub: 'Engineering guidance', leaf: 'Virtualization', title: 'Virtualization policy',
      plenix: 'useVirtualizer', src: 'hooks/useVirtualizer.ts', css: ['system/virtual.css'], level: 'Foundation', interaction: 'Utility', docsFrom: 'virtualization', variantClasses: [],
      text: 'Past a few hundred items (500 as the rule of thumb), a Plenix list, grid or log renders through useVirtualizer. It then owes fixed item sizes from density tokens, its total count shown, accessible positions on every item and focus kept. Very large sets also page from the server.',
      aliases: ['Large data', 'Performance of long lists'],
      use: ['useVirtualizer for every collection that can pass 500 items; never a virtualizer of a component’s own', 'Server paging under the virtualizer for sets too large to load at once', 'A test of scrolling on slow hardware and with a screen reader in browse and focus modes'],
      avoid: ['Virtualizing a collection that stays small', 'Virtualizing where printing or the browser’s find is essential, without a fallback'],
      related: ['virtualization', 'data-grid'], map: [m(SP, 'Virtualizer'), m(['Fluent 2'], 'Virtualizer')],
      examples: [['A list of ten thousand items', function () { return h(VList, { count: 10000, name: 'Ten thousand items' }); }]] }
  ];
});
