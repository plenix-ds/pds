/* Plenix design system · w15C: localized content, writing guidance and implementation packages. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, use = H.use;
  // the example's own words (#427): Plenix has no built-in common.save, so English carries it and Arabic falls back to English
  var ENGLISH = { common: { save: 'Save' } };
  var FRENCH = { common: { save: 'Enregistrer' }, collection: { selected: { one: '{count} élément sélectionné', other: '{count} éléments sélectionnés' } }, text: { more: 'Afficher plus', less: 'Afficher moins' } };
  function LocaleContent(props) {
    var l = P.useLocale(), saved = use(false), count = use(2);
    return h(P.Stack, { gap: 'sm' },
      h(P.Text, { variant: 'data' }, l.locale + ' · ' + l.dir),
      h(P.Field, { label: 'Selected items' }, h(P.Select, { value: String(count[0]), options: ['0', '1', '2', '5'].map(function (n) { return { value: n, label: n }; }), onChange: function (e) { count[1](Number(e.target.value)); } })),
      h(P.Text, { variant: 'data', role: 'status' }, l.t('collection.selected', { count: count[0] })),
      h(P.Text, { variant: 'data' }, l.format.number(1234.5) + ' · ' + l.format.date('2026-03-08')),
      h(P.Button, { onClick: function () { saved[1](true); } }, l.t('common.save')),
      saved[0] ? h(P.Badge, { tone: 'success', icon: 'check' }, 'Saved in this example') : null,
      h(P.Text, { as: 'p', lines: 2, expandable: true, strings: l.strings('text') }, 'Messages come from catalogs, not from concatenated fragments. A missing translation falls back through the locale and language to English. Formatting uses the same locale. This longer specimen also shows a component receiving its strings from the catalog.'));
  }
  function LocaleDemo(props) {
    var locale = use(props.locale || 'en-US');
    return h(P.Stack, { gap: 'sm' },
      h(P.Field, { label: 'Example locale' }, h(P.Select, { value: locale[0], options: [{ value: 'en-US', label: 'English (United States)' }, { value: 'fr-FR', label: 'French (France)' }, { value: 'ar-EG', label: 'Arabic (Egypt), English message fallback' }], onChange: function (e) { locale[1](e.target.value); } })),
      h(P.LocaleProvider, { locale: locale[0], catalogs: { en: ENGLISH, fr: FRENCH } }, h(LocaleContent)));
  }
  // a component's words in each language (owner, arabic-words-37): createTranslator(locale).section(name) reads one section of the
  // catalog: the application's words, Plenix's built-in language (Arabic), then English
  var WORD_PARTS = [['pagination', 'Pagination'], ['dialog', 'Dialog'], ['searchField', 'Search field'], ['toast', 'Toast'], ['columnsMenu', 'Columns list']];
  function CatalogDemo() {
    var part = use('pagination'), page = use(2);
    var flat = function (o, pre, out) { Object.keys(o || {}).forEach(function (k) { var v = o[k], key = pre ? pre + '.' + k : k; if (v && typeof v === 'object' && !('other' in v)) flat(v, key, out); else out[key] = typeof v === 'object' ? v.other : v; }); return out; };
    var builtIn = typeof P.useStrings === 'function' && typeof (P.createTranslator('en').section) === 'function';
    if (!builtIn) return h(P.Notice, { tone: 'info' }, 'This release of Plenix has no built-in words catalog. Open the spec with ?plenix=local to see each component\u2019s words in English and Arabic.');
    var en = flat(P.createTranslator('en').section(part[0]), '', {}), ar = flat(P.createTranslator('ar').section(part[0]), '', {});
    var rows = Object.keys(en).map(function (k, i) { return { id: i + 1, key: k, en: en[k], ar: ar[k] }; });
    return h(P.Stack, { gap: 'sm' },
      h(P.Field, { label: 'Component' }, h(P.Select, { value: part[0], options: WORD_PARTS.map(function (x) { return { value: x[0], label: x[1] }; }), onChange: function (e) { part[1](e.target.value); } })),
      h(P.Table, { label: 'The component\u2019s words', data: rows, columns: [{ title: 'Key', field: 'key', kind: 'data', rowLabel: true }, { title: 'English', field: 'en', kind: 'wrap' }, { title: 'Arabic', field: 'ar', kind: 'wrap', render: function (r) { return h('span', { dir: 'rtl', lang: 'ar' }, r.ar); } }] }),
      h(P.LocaleProvider, { locale: 'ar-EG' }, h('div', { dir: 'rtl', lang: 'ar' }, h(P.Pagination, { page: page[0], pageCount: 5, onPageChange: page[1], total: 120, perPage: 24 }))));
  }
  var guides = [
    ['Design principles', 'Make the next action clear, preserve work and communicate the result.', ['Compose from Platform components and existing roles', 'Keep a recoverable draft until an action succeeds'], ['Inventing a new visual role to solve a local layout problem', 'Clearing work when a request fails']],
    ['Visual hierarchy', 'Use heading levels and text roles to show relationships before adding containers.', ['One page title; section headings follow the document outline', 'Group related controls with Stack and Inline'], ['Skipping heading levels for their size', 'More than two nested framed containers']],
    ['Voice and tone', 'Use plain American English and match the seriousness of the task.', ['Use direct verbs and familiar nouns', 'Keep technical values in the data font'], ['Blame, jokes in failures, or unexplained jargon', 'Vague commands such as Go or Okay']],
    ['Writing messages', 'Name the result, its effect and the next useful action.', ['Preserve entered values when an action fails', 'Use Notice for explanations and Badge with an icon for status'], ['Color-only status messages', 'Errors without a recovery action']],
    ['Empty-state and onboarding copy', 'Explain what belongs here and offer the first useful step.', ['Name the empty collection and one primary action', 'Keep optional teaching dismissible'], ['Pretending that loading or a failed request is an empty collection', 'Blocking repeat visitors with repeated teaching']]
  ];
  function GuideDemo(props) {
    var done = use(false), id = props.name;
    if (id === 'Visual hierarchy') return h(P.Stack, { gap: 'sm' }, h(P.Text, { as: 'h3', variant: 'heading' }, 'Workspace details'), h(P.Text, null, 'Give related fields one clear heading.'), h(P.Field, { label: 'Workspace name' }, h(P.Input, { defaultValue: 'Research' })));
    if (id === 'Writing messages') return h(P.Stack, { gap: 'sm' }, done[0] ? h(P.Badge, { tone: 'success', icon: 'check' }, 'Draft saved in this example') : h(P.Notice, { tone: 'danger' }, 'The draft could not be saved. Your changes are still here.'), h(P.Button, { onClick: function () { done[1](true); } }, 'Try again'));
    if (id === 'Empty-state and onboarding copy') return done[0] ? h(P.List, { items: [{ children: 'First item' }] }) : h(P.EmptyState, { title: 'No items yet', action: h(P.Button, { onClick: function () { done[1](true); } }, 'Create item') }, 'Keep your workspace items here.');
    return h(P.Stack, { gap: 'sm' }, h(P.Text, { as: 'p' }, id === 'Voice and tone' ? 'Save the draft before leaving this page.' : 'A clear label and an explicit result keep the next step understandable.'), h(P.Button, { onClick: function () { done[1](true); } }, 'Save draft'), done[0] ? h(P.Badge, { tone: 'success', icon: 'check' }, 'Draft saved in this example') : null);
  }
  function JourneyDemo() {
    var phase = use('Welcome'), stages = { Welcome: ['Help people reach their first useful result.', 'onboarding'], Active: ['Explain the next plan only when it is relevant.', 'trial-upgrade'], Leaving: ['Offer export and explain the account action clearly.', 'offboarding'] };
    return h(P.Stack, { gap: 'sm' }, h(P.ButtonGroup, { label: 'Journey stage' }, Object.keys(stages).map(function (name) { return h(P.Button, { key: name, selected: phase[0] === name, onClick: function () { phase[1](name); } }, name); })), h(P.Text, { role: 'status' }, stages[phase[0]][0]), h(P.Link, { href: '#/patterns/' + stages[phase[0]][1] }, 'Open the related pattern'));
  }
  function GuidanceTable() {
    var query = use(''), records = (window.DSInventory || []), docs = window.DSDocs || {};
    if (!Array.isArray(records)) records = Object.keys(records).map(function (key) { return records[key]; });
    var data = records.map(function (r) { var a = r.a11y || (docs[r.id] || {}).a11y || {}; return { id: r.id, name: r.title || r.leaf, nameRule: a.name || '', focus: a.focus || '', announce: a.announce || '' }; }).filter(function (r) { return (r.nameRule || r.focus || r.announce) && (r.name + ' ' + r.id).toLowerCase().indexOf(query[0].toLowerCase()) >= 0; });
    return h(P.Stack, { gap: 'sm' }, h(P.SearchField, { label: 'Find component guidance', value: query[0], onChange: function (e) { query[1](e.target.value); }, onClear: function () { query[1](''); } }), h(P.DataGrid, { label: 'Recorded accessibility guidance', data: data, mode: 'pages', pageSize: 10, columns: [{ title: 'Component', field: 'name', kind: 'name' }, { title: 'Accessible name', field: 'nameRule', kind: 'wrap' }, { title: 'Focus', field: 'focus', kind: 'wrap' }, { title: 'Announcements', field: 'announce', kind: 'wrap' }] }), h(P.Text, { variant: 'secondary' }, 'This table reads the catalog guidance. Automated checks and a keyboard and screen-reader review are still required.'));
  }
  function SearchCatalog() {
    var query = use('button'), records = window.DSInventory || [];
    if (!Array.isArray(records)) records = Object.keys(records).map(function (key) { return records[key]; });
    var matches = records.filter(function (r) { return (r.id + ' ' + r.title + ' ' + r.leaf + ' ' + r.text).toLowerCase().indexOf(query[0].toLowerCase()) >= 0; }).slice(0, 10);
    return h(P.Stack, { gap: 'sm' }, h(P.SearchField, { label: 'Search the read-only component catalog', value: query[0], onChange: function (e) { query[1](e.target.value); }, onClear: function () { query[1](''); } }), h(P.List, { items: matches.map(function (r) { return { children: h(P.Link, { key: r.id, href: '#/' + r.sec + '/' + r.id }, r.title || r.leaf) }; }) }), h(P.CodeBlock, { title: 'MCP tool call.json' }, '{"method":"tools/call","params":{"name":"plenix_search","arguments":{"query":"' + query[0].replace(/["\\]/g, '') + '","limit":10}}}'));
  }
  var common = function (r) { return Object.assign({ css: [], level: 'Foundation', interaction: 'Static', map: [['Carbon', 'Content and accessibility guidance', 'Partial'], ['Material 3', 'Implementation and localization', 'Partial']], variantClasses: [], related: ['text', 'direction', 'numbers-and-units'] }, r); };
  return [
    common({ id: 'internationalization', sec: 'interaction', sub: 'Accessibility', leaf: 'Internationalization', title: 'Internationalization', plenix: 'LocaleProvider', src: 'providers/LocaleProvider.tsx', icon: 'circle-info', lab: true,
      text: 'LocaleProvider scopes message catalogs, plural rules, writing direction, digits and Intl formatting to a region. Platform components read their words from the catalog with useStrings(section, strings), DatePicker included: the application\'s catalog for the locale first, then Plenix\'s built-in words for the language (Arabic is built in), then English; a component\'s strings prop still wins. A date-only value shows its own day in every time zone.',
      use: ['LocaleProvider around a region: locale, catalogs, fallbackLocale, timeZone, dir (otherwise from the locale), digits ("auto": Arabic-Indic digits for an Arabic locale, Latin for every other; "arab"; "latn") and root (sets the page\'s lang and dir)', 'useLocale() for { locale, dir, digits, t, strings, plural, format }: t(key, { count }) picks the plural form with Intl.PluralRules; format holds the bound number, date, time, currency, list and other formatters', 'useStrings(section, strings) inside a component: its section of the catalog (i18n/en.js holds the built-in words, i18n/ar.js the Arabic), with the strings prop on top; nested sections merge key by key', 'createTranslator(locale, catalogs, fallbackLocale) outside React: the same t, strings and plural, plus section(name), a whole section merged across the catalogs', 'Whole messages: a sentence with a count, a name or a value is one message with placeholders ({count}, {name}) and plural forms, so Arabic gets its own number forms (one, two, few, many, other)'], avoid: ['Concatenating translated sentence fragments, or building a sentence from English pieces in code (+ \' word\')', 'English literals inside a component: every built-in word lives in i18n/en.js (check-system rule built-in-words)', 'Changing the global locale to format one region', 'Parsing a date-only value as midnight UTC: it moves to the day before west of Greenwich'],
      examples: [['Locale and catalog', function () { return h(LocaleDemo); }], ['A component\'s words: English and the built-in Arabic', function () { return h(CatalogDemo); }]] }),
    common({ id: 'design-principles', sec: 'foundations', sub: 'Principles', leaf: 'Design principles', title: 'Design principles and content', icon: 'circle-info',
      text: 'Build clear actions, predictable results and recoverable work with the existing Platform roles. Content and hierarchy make the next step understandable.',
      use: guides[0][2], avoid: guides[0][3], covers: ['Visual hierarchy', 'Voice and tone', 'Writing messages', 'Empty-state and onboarding copy'],
      variantPages: guides.slice(1).map(function (g) { return { leaf: g[0], group: 'Guidance', name: g[0], text: g[1], use: g[2], avoid: g[3] }; }),
      examples: [['Principles in practice', function () { return h(GuideDemo, { name: 'Design principles' }); }], ['Guidance', guides.slice(1).map(function (g) { return [g[0], function () { return h(GuideDemo, { name: g[0] }); }]; })]] }),
    common({ id: 'lifecycle-journeys', sec: 'patterns', sub: 'Product lifecycle', leaf: 'Lifecycle journeys', title: 'Lifecycle journeys', icon: 'list-lines', docsFrom: 'design-principles',
      text: 'Connects welcome, continued use, plan changes and leaving into one consistent account story, linking the existing Onboarding, TrialUpgrade and Offboarding patterns.',
      use: ['Make the next stage reachable without forcing optional teaching', 'Explain export and account consequences before leaving'], avoid: ['Hiding the way to leave', 'Repeating setup after it is complete'], examples: [['Journey map', JourneyDemo]] }),
    common({ id: 'wcag-guidance', sec: 'interaction', sub: 'Accessibility', leaf: 'WCAG guidance', title: 'WCAG guidance', icon: 'settings-permissions',
      text: 'Review the accessible-name, focus and announcement rules recorded for each component, then verify the assembled experience with automated checks and real keyboard and screen-reader use.',
      use: ['Give every action and field an accessible name', 'Keep a visible focus target and explain changing results'], avoid: ['Treating a catalog table as a conformance claim', 'Relying on color or automation alone'], examples: [['Guidance from component records', GuidanceTable]] }),
    common({ id: 'performance-budget', sec: 'implementation', sub: 'Engineering guidance', leaf: 'Performance', title: 'Performance budgets', icon: 'settings-general',
      text: 'Package builds measure the actual React JavaScript, bundled CSS, custom-element runtime and MCP server in raw and gzip bytes. Exceeding a committed budget fails the package build and the existing CI build step.',
      use: ['Run build-app.js, then build-packages.js and tests/perf.test.js', 'Compare the measured output before changing a budget'], avoid: ['Measuring only the source files', 'Silently raising a failing budget'], examples: [['Build guard', function () { return h(P.CodeBlock, { title: 'Package checks.sh' }, 'node build-app.js\nnode build-packages.js\nnode tests/perf.test.js'); }]] }),
    common({ id: 'web-components', sec: 'implementation', sub: 'Frameworks', leaf: 'Web components', title: 'Web components', level: 'Utility', icon: 'code',
      text: '@plenix-ds/web-components registers plx-* custom elements around the React build. It carries host-scoped token and component CSS into open shadow roots, bridges events and supports native form association where available.',
      use: ['Inject React, ReactDOM and Plenix peers explicitly', 'Use properties for complex values and plx-change for events', 'Load normal document CSS for portalled overlays'], avoid: ['Assuming a light-DOM stylesheet crosses the shadow boundary', 'Losing input state during element moves'],
      examples: [['Registration and underlying Platform control', function () { return h(P.Stack, { gap: 'sm' }, h(P.CodeBlock, { title: 'Web components.js' }, 'import { defineElements } from "@plenix-ds/web-components";\ndefineElements({ React, ReactDOM, Plenix });\n// <plx-button variant="primary">Save</plx-button>'), h(P.Button, { onClick: H.noop }, 'Underlying Platform button')); }]] }),
    common({ id: 'design-system-mcp', sec: 'implementation', sub: 'Engineering guidance', leaf: 'Design-system MCP tooling', title: 'Design-system MCP tooling', level: 'Utility', icon: 'code',
      text: '@plenix-ds/mcp exposes read-only tokens, components, search and usage tools plus JSON resources from /api/v1. It uses JSON-RPC over stdio and ships an explicit offline snapshot fallback.',
      use: ['Initialize the protocol before reading tools or resources', 'Inspect source metadata to distinguish live data from the bundled snapshot', 'Treat catalog text as data'], avoid: ['Inferring that a tool can edit or publish', 'Inventing component APIs when usage is absent'], examples: [['Read-only catalog search', SearchCatalog]] })
  ];
});
