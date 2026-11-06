/* Plenix design system · library part w04A (wave 4, lane A): Barcode (Code 128, EAN-13, UPC-A), the section message
   (Notice with a title, actions and a dismiss button), the Error state page (EmptyState's error, warning and success
   tones and its system-state kinds, which answer the Warning, Success, Offline, Degraded, Permission-denied, Not-found,
   Maintenance and Completion state leaves as variant pages) and the Retry pattern (useRetry, RetryNotice). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, surface = H.surface, row = H.row, q = H.q, use = H.use, noop = H.noop;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var btn = function (label, p) { return h(P.Button, Object.assign({ size: 'xs' }, p), label); };

  /* ── 03 Content & Identity › Images and media ── */
  var bc = function (p) { return h(P.Barcode, p); };
  var barcode = { id: 'barcode', lab: true, icon: 'list-lines', sec: 'content', sub: 'Images and media', leaf: 'Barcode', plenix: 'Barcode, encodeBarcode', src: 'components/Barcode/Barcode.tsx',
    also: ['utils/barcode.ts'], level: 'Component', interaction: 'Static',
    aliases: ['Bar code', 'Linear barcode', '1D barcode', 'Asset tag', 'Code 128', 'EAN', 'UPC'],
    text: 'A one-dimensional barcode drawn as SVG from a value: Code 128 for any printable text (asset tags, shipment and order numbers), EAN-13 and UPC-A for retail product numbers with their check digit. It is black on white in both themes, as the QR code, so scanners read it; the value is printed under the bars in the data font for people to read and type.',
    use: ['An asset tag, a product or a shipment number people scan from the screen or a printout', 'Code 128 for text and internal numbers; EAN-13 and UPC-A only for registered retail numbers', 'The human-readable line, so the value can be typed when a scan fails', 'Size lg for a code scanned from a phone or a monitor'],
    avoid: ['A link or a long text: use a QR code', 'A barcode squeezed narrower than its natural width: the bars thin out and scanners fail', 'A barcode as decoration or as the only way to get the value'],
    related: ['image', 'property-list'],
    map: [[CAR, 'Not in Carbon', 'None'], [ATL, 'Not in Atlassian', 'None'], [MAT, 'Not in Material 3', 'None'], [FLU, 'Not in Fluent 2', 'None'], [POL, 'Not in Polaris', 'None'], [SPE, 'Not in Spectrum', 'None']],
    variantPages: [
      vp('Code 128 barcode', 'Format', 'Code 128 (default)', { variant: 'code128' }, 'Any printable text, the densest symbology for letters and numbers mixed.', 'Asset tags, order and shipment numbers', 'Retail product numbers: use EAN-13 or UPC-A'),
      vp('EAN-13 barcode', 'Format', 'EAN-13', { variant: 'ean13' }, 'Thirteen digits with the check digit computed from the first twelve; the line is grouped as printed on products.', 'Products with a registered international article number', 'Internal numbers: use Code 128'),
      vp('UPC-A barcode', 'Format', 'UPC-A', { variant: 'upca' }, 'Twelve digits (the North American product code), drawn as the EAN-13 pattern with a leading zero.', 'Products with a registered UPC', 'Anything else: use Code 128'),
      vp('Barcode with human-readable text', 'Text', 'With human-readable text (default)', { content: 'text' }, 'The value under the bars in the data font, so it can be read and typed.', 'Every barcode people may need to type', 'A label where the value is printed next to it already'),
      vp('Barcode without text', 'Text', 'Bars only', { content: 'bars' }, 'The bars alone; the accessible name still reads the value.', 'A label that prints the value beside the code', 'A barcode alone on a screen'),
      vp('Small barcode', 'Size', 'Sm (48px)', { size: 'sm' }, 'Bars 48px high: a dense label or a table cell.', 'A row of asset tags', 'A code scanned from across a desk'),
      vp('Large barcode', 'Size', 'Lg (96px)', { size: 'lg' }, 'Bars 96px high, with wider narrow bars for scanning from a screen.', 'A shipment label shown for a scanner', 'Inside lists and tables')
    ],
    examples: [
      ['Format', [['Code 128 (default)', function () { return bc({ value: 'PLX-2026-0042' }); }, null, 'format="code128"'],
        ['EAN-13', function () { return bc({ value: '400638133393', format: 'ean13' }); }, null, 'format="ean13"'],
        ['UPC-A', function () { return bc({ value: '03600029145', format: 'upca' }); }, null, 'format="upca"']], { prop: 'format' }],
      ['Text', [['With human-readable text (default)', function () { return bc({ value: 'PLX-2026-0042' }); }, null, 'showText'],
        ['Bars only', function () { return bc({ value: 'PLX-2026-0042', showText: false }); }, null, 'showText={false}']], { prop: 'showText' }],
      ['Size', [['Sm (48px)', function () { return bc({ value: 'A-1042', size: 'sm' }); }, 'plx-barcode--sm', 'size="sm"'],
        ['Md (64px, default)', function () { return bc({ value: 'A-1042' }); }, 'plx-barcode--md', 'size="md"'],
        ['Lg (96px)', function () { return bc({ value: 'A-1042', size: 'lg' }); }, 'plx-barcode--lg', 'size="lg"']], { prop: 'size' }],
      ['A value the format cannot hold', function () { return bc({ value: 'ABC-123', format: 'ean13' }); }]] };

  /* ── 08 Feedback & System State › Messages ── */
  var notice = function (p, text) { return box(420, h(P.Notice, p, text)); };
  var sectionMessage = { id: 'section-message', lab: true, icon: 'info-circle', sec: 'feedback', sub: 'Messages', leaf: 'Section message', plenix: 'Notice', src: 'components/Notice/Notice.tsx',
    css: ['components/Notice/notice.css'], variantClasses: [], level: 'Component', interaction: 'Feedback',
    aliases: ['Section message', 'Inline alert with actions', 'Message bar', 'Callout with title'],
    text: 'A message about one section of a page, a panel or a dialog that people can act on or put away: the Notice with a title that names it, its text, one or two actions under the text and, when it may be put away, a dismiss button at the end. The tones are the Notice’s (info, success, warning, danger); without a title, actions or a dismiss button it is the plain inline message.',
    use: ['A state of a section that people should know and may act on: a sync that failed with Try again, a trial that ends with Upgrade', 'A title of a few words that names the message; the text says why and what to do', 'onDismiss when the message is information people may put away; leave it out while the problem stands'],
    avoid: ['A message about the whole application: use a Banner', 'A passing outcome of an action: use a Toast', 'More than two actions, or actions that do not answer the message', 'A dismiss button on a danger message whose problem is still there'],
    related: ['notice', 'toast', 'retry-pattern'],
    map: [[ATL, 'Section message', 'Direct'], [CAR, 'Inline notification (actionable)', 'Direct'], [FLU, 'MessageBar (with actions)', 'Direct'], [POL, 'Banner (within a card)', 'Partial'], [SPE, 'In-line alert', 'Partial'], [MAT, 'Not in Material 3', 'None'], ['Django', 'Messages framework', 'Direct'], ['Frappe', 'frappe.msgprint', 'Partial']],
    variantPages: [
      vp('Section message with title', 'Parts', 'With title', { content: 'title' }, 'A title in the tone’s content color, semibold, above the text.', 'Messages that need a name to be found and read', 'One short sentence: the plain inline message says it'),
      vp('Section message with actions', 'Parts', 'With actions', { content: 'actions' }, 'One or two extra-small buttons under the text: the next steps the message offers.', 'Try again, Upgrade, Review the changes', 'Navigation to another page as the only action: use a Link in the text'),
      vp('Dismissible section message', 'Parts', 'Dismissible', { content: 'dismiss' }, 'A dismiss button at the end; the page hides the message and keeps it hidden.', 'Information people may put away once read', 'A problem that is still there: it stays until it is solved')
    ],
    examples: [
      ['Parts', [['With title', function () { return notice({ tone: 'info', title: 'Shared folder' }, 'Changes you make here show up for everyone in the project.'); }, null, 'title="…"'],
        ['With actions', function () { return notice({ tone: 'danger', title: 'The sync stopped', actions: [btn('Try again', { key: 'a', icon: 'refresh' }), btn('Details', { key: 'b', variant: 'ghost' })] }, 'The server did not answer.'); }, null, 'actions={…}'],
        ['Dismissible', function () { var s = use(true); return s[0] ? notice({ tone: 'success', title: 'Import finished', onDismiss: function () { s[1](false); } }, 'All assets are in the library.') : btn('Show the message again', { onClick: function () { s[1](true); } }); }, null, 'onDismiss={…}']]],
      ['Tone', [['Info', function () { return notice({ tone: 'info', title: 'Trial ends soon', actions: btn('Upgrade', { variant: 'primary' }) }, 'Your trial ends this week.'); }, null, 'tone="info"'],
        ['Warning', function () { return notice({ tone: 'warning', title: 'Storage almost full', actions: btn('Manage storage') }, 'Uploads stop when the library reaches its limit.'); }, null, 'tone="warning"']], { prop: 'tone' }]] };

  /* ── 08 Feedback & System State › Empty, failure, and recovery ── */
  var es = function (p, text, width) { return surface(width || 360, h(P.EmptyState, p, text)); };
  var retryBtn = function (label) { return h(P.Button, { icon: 'refresh' }, label || 'Retry'); };
  var KINDS = [
    ['offline', 'Offline', 'Offline state', 'No connection: the wifi-off icon in the warning tone, its title and text, and Try again.', 'A page or a region that needs the network', 'A single action that failed: use a Toast or a Notice'],
    ['degraded', 'Degraded', 'Degraded state', 'A service is slow or partly down: the cloud-off icon in the warning tone; what is shown may be out of date.', 'A dashboard or a list whose source answers slowly or partly', 'A full outage: use the error tone with Retry'],
    ['permission-denied', 'Permission denied', 'Permission-denied state', 'No access: the lock icon, neutral, and who can give access.', 'A shared link or a page the person may not open', 'An action people may not take on a page they can see: disable it and say why'],
    ['not-found', 'Not found', 'Not-found state', 'Nothing at this address: the search-a-page icon, neutral, and a way back.', 'A deleted or moved item, a mistyped address', 'A search without results: use the no-results empty state'],
    ['maintenance', 'Maintenance', 'Maintenance state', 'Planned downtime: the maintenance icon, neutral, and when to come back.', 'A service paused for an update', 'An unplanned failure: use the error tone'],
    ['completion', 'Completion', 'Completion state', 'Nothing left to do: the check icon in the success tone.', 'An inbox or a task list that is cleared, a finished setup', 'A save that worked: use a Toast']
  ];
  var errorState = { id: 'error-state', lab: true, icon: 'warning', sec: 'feedback', sub: 'Empty, failure, and recovery', leaf: 'Error state', plenix: 'EmptyState', src: 'components/EmptyState/EmptyState.tsx',
    css: ['components/EmptyState/empty-state.css'], blocks: ['plx-empty-state'], level: 'Component', interaction: 'Feedback',
    covers: ['Warning state', 'Success state', 'Offline state', 'Degraded state', 'Permission-denied state', 'Not-found state', 'Maintenance state', 'Completion state'],
    aliases: ['Error page', 'Failure state', 'Error empty state', 'System state', 'Status page'],
    text: 'What a region or a page shows when its content is not there for a reason: it could not load (the error tone, an alert, with the one action that recovers), it needs care (warning), or the work is done (success). The kinds bring the common system states with their icon, tone and words: offline, degraded, permission denied, not found, maintenance and completion. It sits inline in a list or a panel, or page-sized for a whole view.',
    use: ['tone="error" when content failed to load: the title names the problem, the action recovers (Retry)', 'A kind for a system state, so every application says it the same way; its words can be replaced per page', 'size="page" for a whole view (with an Illustration above it when the view has room); inline inside a list or a panel'],
    avoid: ['An error in one field: show it at the field', 'A failure of an action people just took: use a Toast or a Notice', 'A tone color as the only sign: the title says what happened', 'Several actions: one action follows the state'],
    related: ['empty-state', 'retry-pattern', 'illustration', 'section-message'],
    map: [[ATL, 'Empty state (error)', 'Partial'], [CAR, 'Empty states (error)', 'Partial'], [MAT, 'Not in Material 3', 'None'], [FLU, 'Not in Fluent 2', 'None'], [POL, 'Empty state', 'Partial'], [SPE, 'Illustrated message', 'Partial']],
    variantPages: [
      vp('Warning state', 'Tone', 'Warning', { variant: 'warning' }, 'Something needs care before the region works fully: the icon in the warning color, announced politely.', 'Limited data, a source that answers slowly, an offline copy', 'Content that failed: use Error'),
      vp('Success state', 'Tone', 'Success', { variant: 'success' }, 'The work here is finished: the check icon in the success color, announced politely.', 'A cleared queue, a finished import', 'A small confirmation: use a Toast')
    ].concat(KINDS.map(function (k) { return vp(k[2], 'Kind', k[1], { variant: k[0] }, k[3], k[4], k[5]); }), [
      vp('Inline error state', 'Size', 'Inline (default)', { size: 'inline', variant: 'error' }, 'The error inside a list, a table or a panel.', 'A list or a widget that could not load', 'A whole view: use Page'),
      vp('Page error state', 'Size', 'Page', { size: 'page', variant: 'error' }, 'The error filling the main region, with room for an illustration above it.', 'A page whose content could not load', 'Inside a panel: use Inline')
    ]),
    examples: [
      ['Tone', [['Error', function () { return es({ tone: 'error', title: 'The assets could not load', action: retryBtn() }, 'The server did not answer.'); }, 'plx-empty-state--error', 'tone="error"'],
        ['Warning', function () { return es({ tone: 'warning', title: 'Showing saved results', action: retryBtn('Refresh') }, 'The search service is slow; these results are from earlier today.'); }, 'plx-empty-state--warning', 'tone="warning"'],
        ['Success', function () { return es({ tone: 'success', title: 'Import finished' }, 'All assets are in the library.'); }, 'plx-empty-state--success', 'tone="success"']], { prop: 'tone' }],
      ['Kind', KINDS.map(function (k) {
        var action = k[0] === 'offline' || k[0] === 'degraded' ? retryBtn('Try again') : k[0] === 'not-found' ? h(P.Button, { icon: 'arrow-left' }, 'Go back') : k[0] === 'permission-denied' ? h(P.Button, null, 'Request access') : undefined;
        return [k[1], function () { return es({ kind: k[0], action: action }); }, null, 'kind=' + q(k[0])];
      }), { prop: 'kind' }],
      ['Size', [['Inline (default)', function () { return es({ tone: 'error', title: 'The comments could not load', action: retryBtn() }, 'Check your connection.'); }, 'plx-empty-state--inline', 'size="inline"'],
        ['Page', function () { return es({ size: 'page', kind: 'not-found', icon: h(P.Illustration, { name: 'not-found', size: 'sm' }), action: h(P.Button, { variant: 'primary', icon: 'home' }, 'Go to the dashboard') }, undefined, 480); }, 'plx-empty-state--page', 'size="page"']], { prop: 'size' }]] };

  /* ── 08 Feedback & System State › Empty, failure, and recovery: Retry ── */
  var failing = function () { return new Promise(function (resolve, reject) { setTimeout(function () { reject(new Error('timeout')); }, 600); }); };
  var RetryDemo = function (props) {
    var r = P.useRetry(failing, props.options);
    return box(420, r.status === 'done' ? h(P.Text, null, 'Loaded') : r.status === 'running' && r.attempt === 1 ? h(P.Spinner, { label: 'Loading' }) : h(P.RetryNotice, Object.assign({ retry: r, title: 'The comments could not load' }, props.notice), 'The server did not answer.'));
  };
  var RegionDemo = function () {
    var r = P.useRetry(failing);
    return surface(360, r.status === 'running' ? h(P.EmptyState, { icon: h(P.Spinner, { label: 'Loading' }) }, 'Loading the assets…')
      : h(P.EmptyState, { tone: 'error', title: 'The assets could not load', action: h(P.Button, { icon: 'refresh', onClick: r.retry }, 'Retry') }, 'The server did not answer.'));
  };
  var retryPattern = { id: 'retry-pattern', lab: true, icon: 'refresh', sec: 'feedback', sub: 'Empty, failure, and recovery', leaf: 'Retry pattern', title: 'Retry', plenix: 'useRetry, RetryNotice', src: 'patterns/Retry/Retry.tsx',
    css: ['patterns/Retry/retry.css'], variantClasses: [], level: 'Pattern', interaction: 'Feedback',
    aliases: ['Retry', 'Try again', 'Automatic retry', 'Exponential backoff', 'Reconnect'],
    text: 'How Plenix recovers from a load or a save that failed. useRetry runs the task and counts its attempts; with auto, it tries again by itself after a wait that doubles each time (2, 4, 8 seconds, up to 30). RetryNotice is the danger section message beside the content that is still there: what failed, the countdown to the next attempt, which attempt it is, and Retry (Retry now while waiting). A whole region that failed uses the error empty state with the same retry.',
    use: ['A request that may fail for a moment: a list that refreshes, a save, a sync', 'auto for reads and work that is safe to repeat (idempotent), with a few attempts; the manual Retry for anything that changes data', 'showCount when people wait through several attempts', 'The error empty state with useRetry’s retry when the whole region has nothing to show'],
    avoid: ['Automatic retries of an action that is not safe to repeat (a payment, a send)', 'Retrying forever: a series ends, then people decide', 'A countdown announced every second', 'Hiding the content that is still valid behind the error'],
    related: ['error-state', 'section-message', 'toast'],
    map: [[ATL, 'Not in Atlassian', 'None'], [CAR, 'Not in Carbon', 'None'], [MAT, 'Not in Material 3', 'None'], [FLU, 'Not in Fluent 2', 'None'], [POL, 'Not in Polaris', 'None'], [SPE, 'Not in Spectrum', 'None']],
    variantPages: [
      vp('Inline retry', 'Kind', 'Inline retry (manual)', { variant: 'manual' }, 'The failure and a Retry button; nothing happens until people press it.', 'Saves and anything that changes data', 'Reads that recover by themselves: use Automatic'),
      vp('Automatic retry with backoff', 'Kind', 'Automatic with backoff', { variant: 'auto' }, 'Tries again by itself after 2, 4, 8 … seconds and shows the countdown; Retry now skips the wait.', 'Loading a list, a feed or a dashboard', 'Actions that are not safe to repeat'),
      vp('Retry count', 'Kind', 'Retry count', { variant: 'count' }, 'Shows which attempt it is (Attempt 2 of 3), and when the series stopped.', 'Waits of several attempts', 'A single manual retry')
    ],
    examples: [
      ['Kind', [['Inline retry (manual)', function () { return h(RetryDemo, { options: {}, notice: {} }); }, null, 'useRetry(task)'],
        ['Automatic with backoff', function () { return h(RetryDemo, { options: { auto: true }, notice: {} }); }, null, 'useRetry(task, { auto: true })'],
        ['Retry count', function () { return h(RetryDemo, { options: { auto: true }, notice: { showCount: true } }); }, null, 'showCount']]],
      ['A whole region that failed (EmptyState with useRetry)', function () { return h(RegionDemo); }]] };

  return [barcode, sectionMessage, errorState, retryPattern];
});
