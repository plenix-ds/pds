/* Plenix design system · library part w04C (wave 4, lane C): the status icon (StatusIcon in components/Icon), Banner,
   the color swatch on its own page (ColorSwatch with its label) and the swatch picker (ColorPicker with a custom set),
   Scrim, LoadingOverlay, Time (the Timestamp page, which also answers Relative time and Date label as its variant pages)
   and the undo pattern (the toast's action and useUndo). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, row = H.row, eachV = H.eachV, q = H.q, use = H.use, noop = H.noop, cap = H.cap;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var TONES = ['info', 'success', 'warning', 'danger', 'neutral'];
  var toneName = function (t) { return cap(t) + (t === 'info' ? ' (default)' : ''); };
  var TONE_WORDS = { info: 'Information', success: 'Success', warning: 'Warning', danger: 'Error', neutral: 'Note' };

  /* ── a region with content, for the scrim and the loading overlay ── */
  var ROWS = [['Cross 014.png', '1.2 MB'], ['Border gold.svg', '84 KB'], ['Banner icon 03.png', '412 KB']];
  var region = function () {
    return h(P.Stack, { gap: 'xs' }, ROWS.map(function (r) {
      return h(P.Inline, { key: r[0], gap: 'sm', justify: 'between' }, h(P.Text, null, r[0]), h(P.Text, { variant: 'data' }, r[1]));
    }));
  };
  var frame = function () { return h.apply(null, ['div', { 'data-ds-wrap': true, className: 'ds-w04c-frame' }].concat([].slice.call(arguments))); };

  /* ── times relative to the page's own clock: the examples read the same any day ── */
  var ago = function (ms) { return new Date(Date.now() - ms); };
  var MIN = 60000, HOUR = 3600000, DAY = 86400000;

  /* ── a toast with an action, shown from a button ── */
  var undoDemo = function (label, opts) {
    return function () {
      var undoable = P.useUndo(), toast = P.useToast(), n = use(3);
      return row(h(P.Text, { variant: 'secondary' }, n[0] + ' assets in Crosses'),
        h(P.Button, { onClick: function () { n[1](function (x) { return Math.max(0, x - 1); }); undoable('Asset archived', Object.assign({ onUndo: function () { n[1](function (x) { return x + 1; }); toast.show('Archive undone', { tone: 'success' }); } }, opts || {})); } }, label));
    };
  };

  return [
    /* ── 08 Feedback › Status ── */
    { id: 'status-icon', lab: true, sec: 'feedback', sub: 'Status', leaf: 'Status icon', title: 'Status icon', plenix: 'StatusIcon', src: 'components/Icon/Icon.tsx',
      css: ['components/Icon/status-icon.css'], blocks: ['plx-status-icon'], variantClasses: TONES.map(function (t) { return 'plx-status-icon--' + t; }).concat(['plx-status-icon--sm', 'plx-status-icon--md', 'plx-status-icon--lg']),
      level: 'Component', interaction: 'Static', icon: 'warning',
      aliases: ['Status glyph', 'Severity icon', 'State icon', 'Tone icon'],
      text: 'A tone’s icon in the tone’s content color: info, success, warning, danger or neutral, at the small, default or large size. Alone it is an image named by its tone (“Warning”), so the state never rests on color only; with a short label after it the label says the state and the icon is decoration. Banner, Notice and Toast draw the same icons.',
      use: ['The state of a row, a file or a check in a table or a list: alone at the small size, or with a word', 'The icon of a banner or a message (Banner draws it)', 'A label that says the state (“Synced”, “2 errors”), so it reads without the color'],
      avoid: ['Decoration with no state behind it: use Icon', 'A count of unread items: use the count badge', 'Presence or a live state of a person or a service: use the status dot'],
      related: ['status-dot', 'banner', 'notice', 'icon'],
      map: [[CAR, 'Status indicators (icon)', 'Direct'], [ATL, 'Icon (status)', 'Partial'], [SPE, 'Status light', 'Partial'], [POL, 'Icon (tone)', 'Partial'], [FLU, 'Presence and status icons', 'Partial']],
      variantPages: TONES.map(function (t) {
        return vp(cap(t) + ' status icon', 'Tone', toneName(t), { variant: t }, {
          info: 'The info icon in the info color: news with no judgment.', success: 'The check in the success color: it worked or it is done.',
          warning: 'The warning triangle in the warning color: it worked with a catch, or needs a look.', danger: 'The error icon in the danger color: it failed or is blocked.',
          neutral: 'The info icon in the neutral color: a note with no tone.' }[t],
          { info: 'Notes, tips and “for your information” rows', success: 'Finished checks, synced files, passed steps', warning: 'Skipped files, near limits, expiring items', danger: 'Failed uploads, errors, blocked steps', neutral: 'Drafts and inactive items: a state with no judgment' }[t],
          t === 'neutral' ? 'Telling info and neutral apart by color only: give it a label' : 'The tone as the only sign: the icon’s name or label says it');
      }).concat([
        vp('Small status icon', 'Size', 'SM', { size: 'sm' }, 'A 16px icon for table cells, dense rows and beside small text.', 'Rows of a table or a list', 'A banner or a heading: use MD or LG'),
        vp('Medium status icon', 'Size', 'MD (default)', { size: 'md' }, 'The 20px icon, the size of the other interface icons.', 'Messages, forms and most rows', 'Tight table cells: use SM'),
        vp('Large status icon', 'Size', 'LG', { size: 'lg' }, 'A 24px icon on the 24px optical files, for a heading or a result.', 'The result of a long task, beside a heading', 'Rows and table cells')
      ]),
      examples: [['Tone', eachV(TONES, toneName, function (t) { return h(P.StatusIcon, { tone: t }); }, function (t) { return 'plx-status-icon--' + t; }, function (t) { return 'tone=' + q(t); }), { prop: 'tone' }],
        ['Size', eachV([['sm', 'SM'], ['md', 'MD (default)'], ['lg', 'LG']], function (s) { return s[1]; }, function (s) { return row(h(P.StatusIcon, { tone: 'success', size: s[0] }), h(P.StatusIcon, { tone: 'warning', size: s[0] }), h(P.StatusIcon, { tone: 'danger', size: s[0] })); }, function (s) { return 'plx-status-icon--' + s[0]; }, function (s) { return 'size=' + q(s[0]); }), { prop: 'size' }],
        ['With a label', function () { return h(P.Stack, { gap: 'xs' }, h(P.StatusIcon, { tone: 'success', size: 'sm' }, 'Synced'), h(P.StatusIcon, { tone: 'warning', size: 'sm' }, '2 files skipped'), h(P.StatusIcon, { tone: 'danger', size: 'sm' }, 'Upload failed')); }]] },

    /* ── 08 Feedback › Messages ── */
    { id: 'banner', lab: true, sec: 'feedback', sub: 'Messages', leaf: 'Banner', title: 'Banner', plenix: 'Banner', src: 'components/Banner/Banner.tsx', level: 'Component', interaction: 'Feedback', icon: 'info-circle',
      aliases: ['Page banner', 'System banner', 'Announcement bar', 'Global alert', 'Top banner'],
      text: 'A full-width message across the top of the page or a pane, about all of it: the library cannot sync, the plan ends in 3 days, this folder is read-only. It pushes the content down and never covers it. A message about one part of the content is a Notice, inside that content.',
      use: ['A state of the whole app, page or pane that stays until it changes: offline, read-only, a sync failure', 'A deadline or a change the person must know about before they work: a plan that ends, a maintenance window', 'One action that resolves it (“Retry”, “Renew”) and Dismiss when it can be put away'],
      avoid: ['A message about one field, one card or one section: use a Notice there', 'The result of an action that just happened: use a toast', 'More than one banner at a time: show the most important one', 'Marketing or tips: a banner is for the state of the work'],
      related: ['notice', 'toast', 'status-icon'],
      map: [[CAR, 'Notification (inline, full width)', 'Partial'], [ATL, 'Banner', 'Direct'], [MAT, 'Banner (Material 2)', 'Partial'], [POL, 'Banner', 'Direct'], [FLU, 'MessageBar', 'Partial'], [SPE, 'Alert banner', 'Direct']],
      variantPages: TONES.map(function (t) {
        return vp(cap(t) + ' banner', 'Tone', toneName(t), { variant: t }, {
          info: 'The info fill and icon: a fact about the page that helps people work.', success: 'The success fill and icon: a state that is now good, such as “Back online”.',
          warning: 'The warning fill and icon: something will stop working soon, or works with a catch.', danger: 'The danger fill and icon: something is broken now; it is announced at once (role="alert").',
          neutral: 'The neutral fill and icon: a state with no judgment, such as read-only or a preview.' }[t],
          { info: 'A new place for a feature, a shared folder', success: 'A fix that ended a warning or a failure', warning: 'A plan ending, storage nearly full', danger: 'Sync failed, offline, the service is down', neutral: 'Read-only mode, viewing an older version' }[t],
          { info: 'News people can ignore: leave it out', success: 'Confirming an action: use a toast', warning: 'A problem with one field or card: use a Notice', danger: 'An error in a form: show it at the field', neutral: 'A state that needs action: give it its tone' }[t]);
      }).concat([
        vp('Page banner', 'Placement', 'Page top (default)', { size: 'page' }, 'Across the page under the app header, with the page’s side spacing.', 'A state of the whole app or page', 'A state of one pane: place it in that pane'),
        vp('Pane banner', 'Placement', 'Inside a pane', { size: 'pane' }, 'Across the top of one pane or panel, with the tighter spacing of the pane.', 'A folder that is read-only, an inspector showing an older version', 'A state of the whole page: use the page banner'),
        vp('Dismissible banner', 'Options', 'Dismissible', { content: 'dismissible' }, 'A Dismiss button at the end removes the banner.', 'Information people can put away once they have read it', 'A state that is still true (offline): it stays until it changes'),
        vp('Banner with actions', 'Options', 'With actions', { content: 'actions' }, 'One or two small buttons after the message that resolve it.', '“Retry” after a failure, “Renew” before an end date', 'More than two actions, or actions unrelated to the message')
      ]),
      examples: [['Tone', eachV(TONES, toneName, function (t) {
          return box(560, h(P.Banner, { tone: t, title: { info: 'Shared folder.', success: 'Back online.', warning: 'Your plan ends in 3 days.', danger: 'The library could not sync.', neutral: 'Read-only.' }[t] },
            { info: 'Everyone in Design can see and edit Crosses.', success: 'Your changes are syncing again.', warning: 'Renew it to keep your sharing links active.', danger: 'Changes are kept on this device until it can.', neutral: 'You are viewing the version of Oct 8.' }[t]));
        }, function (t) { return 'plx-banner--' + t; }, function (t) { return 'tone=' + q(t); }), { prop: 'tone' }],
        ['Placement', [['Page top (default)', function () { return box(560, h(P.Banner, { tone: 'warning' }, 'Maintenance on Saturday from 10 PM: the library is read-only for an hour.')); }, 'plx-banner--page', 'placement="page"'],
          ['Inside a pane', function () { return box(320, h(P.Banner, { tone: 'neutral', placement: 'pane' }, 'This folder is read-only.')); }, 'plx-banner--pane', 'placement="pane"']], { prop: 'placement' }],
        ['Options', [['Dismissible', function () { var o = use(true); return box(560, o[0] ? h(P.Banner, { tone: 'info', onDismiss: function () { o[1](false); } }, 'Categories now live in the navigation pane.') : h(P.Button, { size: 'sm', onClick: function () { o[1](true); } }, 'Show the banner again')); }, null, 'onDismiss'],
          ['With actions', function () { return box(560, h(P.Banner, { tone: 'danger', title: 'The library could not sync.', actions: h(P.Button, { size: 'sm', onClick: noop }, 'Retry') }, 'Changes are kept on this device.')); }, null, 'actions']]]] },

    /* ── 03 Content & Identity › Images and media ── */
    { id: 'swatch', lab: true, sec: 'content', sub: 'Images and media', leaf: 'Color swatch', title: 'Color swatch', plenix: 'ColorSwatch', src: 'components/ColorSwatch/ColorSwatch.tsx', variantClasses: [],
      level: 'Component', interaction: 'Display', icon: H.iconOf('color-swatch'),
      aliases: ['Swatch', 'Color chip', 'Color sample', 'Color dot'],
      text: 'Shows a color from the data (a category’s, a project’s or a tag’s) as a small square or circle with a thin edge, so light colors stay visible. With showLabel, its name follows as text; as a button, it picks the color, and the chosen one shows a ring. The colors are the data hues and the category palette (data-plx-color, data-plx-category), never a value written into the page.',
      use: ['The color of a category, a project or a tag beside its name', 'A legend of a chart or a map', 'The color in a property list, with its name (showLabel)'],
      avoid: ['A state (done, failed): use the status icon or a badge', 'A swatch with nothing that names its color nearby: add the label', 'Picking a color from a set: use ColorPicker, which groups these swatch buttons and marks the chosen one'],
      related: ['swatch-picker', 'color-swatch', 'dataviz-colors'],
      map: [[SPE, 'Swatch', 'Direct'], [FLU, 'ColorSwatch', 'Direct'], [CAR, 'Color swatch (tag)', 'Partial']],
      variantPages: [
        vp('Square color swatch', 'Shape', 'Square (default)', { variant: 'square' }, 'A square with small corners, the standard shape.', 'Colors in pickers, legends and property lists', 'Mixing square and round swatches in one place'),
        vp('Circle color swatch', 'Shape', 'Circle', { variant: 'round' }, 'A circle that reads as a marker beside a name.', 'A category or project color beside its name', 'A grid of colors to pick from: use the square'),
        vp('Small color swatch', 'Size', 'SM', { size: 'sm' }, 'A 16px swatch for dense rows, menus and table cells.', 'A color beside a name in a table cell or a menu', 'A swatch people press often: use MD'),
        vp('Medium color swatch', 'Size', 'MD (default)', { size: 'md' }, 'The 20px swatch, the size of the picker.', 'Most places a color is shown', 'Tight table cells: use SM'),
        vp('Pressed color swatch', 'State', 'Pressed', { state: 'selected' }, 'The chosen swatch of a set: a ring around it, not a bigger size.', 'The current color of a category in a picker', 'Showing a color that cannot be changed: no ring'),
        vp('Color swatch with label', 'Label', 'With label', { variant: 'labeled' }, 'The swatch, then the color’s name as text in the body size.', 'A color in a property list or a legend', 'A dense picker of many colors: the names go in each swatch’s accessible name')
      ],
      examples: [['Shape', [['Square (default)', function () { return h(P.ColorSwatch, { color: 'blue' }); }, null, 'shape="square"'], ['Circle', function () { return h(P.ColorSwatch, { color: 'blue', shape: 'round' }); }, 'plx-color-swatch--round', 'shape="round"']], { prop: 'shape' }],
        ['Size', [['SM', function () { return h(P.ColorSwatch, { color: 'green', size: 'sm' }); }, 'plx-color-swatch--sm', 'size="sm"'], ['MD (default)', function () { return h(P.ColorSwatch, { color: 'green' }); }, 'plx-color-swatch--md', 'size="md"']], { prop: 'size' }],
        ['State', [['Pressed', function () { return row(h(P.ColorSwatch, { color: 'purple', label: 'Purple', pressed: true, onClick: noop }), h(P.ColorSwatch, { color: 'red', label: 'Red', pressed: false, onClick: noop })); }, null, 'pressed']], { prop: 'pressed' }],
        ['Label', [['With label', function () { return h(P.Stack, { gap: 'xs' }, h(P.ColorSwatch, { category: 'red', label: 'Red', showLabel: true }), h(P.ColorSwatch, { color: 'green', label: 'Green', showLabel: true, shape: 'round' })); }, null, 'showLabel']], { prop: 'showLabel' }]] },

    /* ── 05 Forms › Date, time, and color ── */
    { id: 'swatch-picker', lab: true, sec: 'forms', sub: 'Date, time, and color', leaf: 'Swatch picker', title: 'Swatch picker', plenix: 'ColorPicker', src: 'components/ColorSwatch/ColorSwatch.tsx', variantClasses: [],
      level: 'Component', interaction: 'Selection', icon: H.iconOf('color-swatch'),
      aliases: ['Swatch group', 'Color palette picker', 'Preset colors', 'SwatchPicker'],
      text: 'A row of color swatches from a fixed set, one of them chosen: the data hues, the category palette or a custom set from either. Each swatch is a button named by its color and the chosen one is pressed (a ring). It keeps to one row: the colors that do not fit go into a More menu at its end, which shows the chosen color when it is one of them.',
      use: ['The color of a category, a tag or a project, from the colors the system offers', 'A custom set (colors) when only some colors fit the place, in a stable order', 'With a Field label that says what the color is for'],
      avoid: ['Any color at all: use the color field (Input type="color") with a hex value', 'Color as the only way people later tell the items apart: keep their names', 'Reordering the colors between visits'],
      related: ['swatch', 'color-swatch', 'dataviz-colors'], statesFrom: ['color-swatch'],
      map: [[FLU, 'SwatchPicker', 'Direct'], [SPE, 'Swatch group', 'Direct'], [CAR, 'Color picker (presets)', 'Partial']],
      variantPages: [
        vp('Data palette picker', 'Palette', 'Data palette (default)', { variant: 'data' }, 'The data hues of the theme: blue, green, purple, red, brown (drawn in orange) and gray.', 'Projects, charts and anything drawn with data colors', 'Categories: use the category palette'),
        vp('Category palette picker', 'Palette', 'Category palette', { variant: 'category' }, 'The 20 category colors, the same in every theme; those that do not fit are in the More menu.', 'The color of a category', 'Projects and charts: use the data palette'),
        vp('Custom swatch picker', 'Palette', 'Custom swatches', { variant: 'custom' }, 'A set of the palette’s colors in the order given (colors).', 'A place where only some colors fit, such as the colors of one group', 'Colors outside the palettes: they are left out')
      ],
      examples: [['Palette', [['Data palette (default)', function () { var c = use('blue'); return box(360, h(P.ColorPicker, { label: 'Project color', value: c[0], onChange: c[1] })); }, null, 'palette="data"'],
        ['Category palette', function () { var c = use('red'); return box(360, h(P.ColorPicker, { palette: 'category', label: 'Category color', value: c[0], onChange: c[1] })); }, null, 'palette="category"'],
        ['Custom swatches', function () { var c = use('green'); return box(360, h(P.ColorPicker, { palette: 'category', colors: ['red', 'green', 'blue', 'orange', 'purple'], label: 'Tag color', value: c[0], onChange: c[1] })); }, null, "colors={['red', 'green', …]}"]], { prop: 'palette' }]] },

    /* ── 09 Overlays › Layer behavior ── */
    { id: 'scrim', lab: true, sec: 'overlays', sub: 'Layer behavior', leaf: 'Backdrop / scrim', title: 'Scrim', plenix: 'Scrim', src: 'components/Scrim/Scrim.tsx', level: 'Component', interaction: 'Overlay', icon: H.iconOf('layers'),
      aliases: ['Backdrop', 'Blanket', 'Overlay', 'Underlay', 'Modal mask'],
      text: 'The translucent layer behind a modal layer that dims the page and takes its clicks, or over one busy region. It comes as modal (the dialog’s backdrop), light (a softer dim) or inverse (a veil in the page color that keeps the content faintly readable behind a loading indicator). Over the window it stops the page scrolling; contained, it covers its positioned parent only. It is decoration: hidden from assistive technology, never a Tab stop.',
      use: ['Behind a modal dialog, drawer or sheet (modal)', 'Over a region that is busy and must not be edited (inverse, contained: LoadingOverlay draws it)', 'A click on it that closes the layer above, when closing loses nothing'],
      avoid: ['Behind a menu, a popover or a tooltip: they are not modal', 'Two scrims at once', 'Text or controls on the scrim: put them in the layer above'],
      related: ['dialog', 'loading-overlay', 'scroll-lock', 'layers'],
      map: [[MAT, 'Scrim', 'Direct'], [ATL, 'Blanket', 'Direct'], [CAR, 'Modal (overlay)', 'Partial'], [FLU, 'Dialog backdrop', 'Partial'], [SPE, 'Underlay', 'Direct']],
      variantPages: [
        vp('Modal scrim', 'Variant', 'Modal (default)', { variant: 'modal' }, 'The scrim role at the middle opacity: the page behind a modal layer is clearly unavailable.', 'Dialogs, drawers and sheets', 'A busy region whose content should stay readable: use Inverse'),
        vp('Light scrim', 'Variant', 'Light', { variant: 'light' }, 'The scrim role at the low opacity: a softer dim.', 'The expanded rail over the main region on a Medium window', 'A modal dialog: the page must look unavailable'),
        vp('Inverse scrim', 'Variant', 'Inverse', { variant: 'inverse' }, 'The canvas at the high opacity: a veil in the page color that keeps the content faintly visible.', 'A region that is saving or refreshing, under a spinner', 'A modal layer: use Modal'),
        vp('Contained scrim', 'Placement', 'Contained', { size: 'contained' }, 'Covers its nearest positioned parent instead of the window, and does not lock the page’s scrolling.', 'One table, panel or card that is busy', 'A modal layer: it covers the window')
      ],
      examples: [['Variant', eachV([['modal', 'Modal (default)'], ['light', 'Light'], ['inverse', 'Inverse']], function (v) { return v[1]; }, function (v) { return frame(region(), h(P.Scrim, { variant: v[0], contained: true })); }, function (v) { return 'plx-scrim--' + v[0]; }, function (v) { return 'variant=' + q(v[0]); }), { prop: 'variant' }],
        ['Placement', [['Contained', function () { return frame(region(), h(P.Scrim, { variant: 'modal', contained: true })); }, 'plx-scrim--contained', 'contained']], { prop: 'contained' }],
        ['Over the window, behind a dialog', function () { var o = use(false); return row(h(P.Button, { onClick: function () { o[1](true); } }, 'Open the dialog'), h(P.Dialog, { open: o[0], onClose: function () { o[1](false); }, title: 'Rename asset', size: 'sm', footer: h(P.Button, { variant: 'primary', onClick: function () { o[1](false); } }, 'Rename') }, h(P.Field, { label: 'Name' }, h(P.Input, { defaultValue: 'Cross 014.png' })))); }]] },

    /* ── 08 Feedback › Loading and progress ── */
    { id: 'loading-overlay', lab: true, sec: 'feedback', sub: 'Loading and progress', leaf: 'Loading overlay', title: 'Loading overlay', plenix: 'LoadingOverlay', src: 'components/LoadingOverlay/LoadingOverlay.tsx', level: 'Component', interaction: 'Feedback', icon: 'progress',
      aliases: ['Busy overlay', 'Blocking loader', 'Loading mask', 'Spinner overlay'],
      text: 'Covers a region while it saves or refreshes, with a large spinner in its middle (or a progress bar when the amount is known) and a few words that say what is happening. Only that region is blocked: it is aria-busy and its content inert while covered. fullPage covers the whole window and stops it scrolling.',
      use: ['A table or a panel that is saving or reloading and must not be edited meanwhile', 'Work of a few seconds, shown after a delay so a quick save does not flash', 'A progress bar and Cancel for longer work that can stop'],
      avoid: ['The first load of content with a known layout: use skeletons', 'Covering the whole window for work in one region', 'Work of minutes: run it in the background and report it with a toast'],
      related: ['scrim', 'spinner', 'progress-bar', 'skeleton'],
      map: [[CAR, 'Loading (with overlay)', 'Direct'], [MAT, 'Progress indicators (over content)', 'Partial'], [ATL, 'Spinner (with blanket)', 'Partial'], [SPE, 'ProgressCircle (overlay)', 'Partial']],
      variantPages: [
        vp('Region loading overlay', 'Coverage', 'Region (default)', { variant: 'region' }, 'Covers its own region: a table, a panel, a card. The rest of the page keeps working.', 'Saving or refreshing one part of the page', 'The whole app signing in: use Full page'),
        vp('Full page loading overlay', 'Coverage', 'Full page', { variant: 'page' }, 'Covers the window and stops it scrolling, for work that blocks the whole app.', 'Signing in, switching an account', 'Work in one region: cover that region'),
        vp('Loading overlay with message', 'Indicator', 'With message', { variant: 'message' }, 'The spinner and a few words under it that say what is happening; the words are its announced name.', 'Most overlays, saying what is happening (“Saving changes”, “Refreshing”); without one, “Loading” is announced', 'Long sentences or several lines'),
        vp('Loading overlay with progress', 'Indicator', 'With progress', { variant: 'progress' }, 'A progress bar with the percent in place of the spinner, and Cancel when the work can stop.', 'Imports and exports whose amount is known', 'Work whose amount is unknown: keep the spinner')
      ],
      examples: [['Coverage', [['Region (default)', function () { var b = use(true); return h(P.Stack, { gap: 'sm' }, frame(h(P.LoadingOverlay, { active: b[0], message: 'Saving changes' }, region())), h(P.Button, { size: 'sm', onClick: function () { b[1](!b[0]); } }, b[0] ? 'Finish' : 'Save again')); }, null, 'active'],
          ['Full page', function () { var b = use(false); return row(h(P.Button, { onClick: function () { b[1](true); setTimeout(function () { b[1](false); }, 2000); } }, 'Sign in again'), h(P.LoadingOverlay, { active: b[0], fullPage: true, message: 'Signing you in' })); }, 'plx-loading-overlay--page', 'fullPage']], { prop: 'fullPage' }],
        ['Indicator', [['With message', function () { return frame(h(P.LoadingOverlay, { message: 'Refreshing' }, region())); }, null, 'message'],
          ['With progress', function () { return frame(h(P.LoadingOverlay, { progress: 42, message: 'Importing 120 assets', onCancel: noop }, region())); }, null, 'progress']]]] },

    /* ── 03 Content & Identity › Metadata ── */
    { id: 'timestamp', lab: true, sec: 'content', sub: 'Metadata', leaf: 'Timestamp', title: 'Timestamp', plenix: 'Time', src: 'components/Time/Time.tsx', level: 'Component', interaction: 'Display', icon: 'clock',
      covers: ['Relative time', 'Date label'], aliases: ['Time', 'Date and time', 'Relative time', 'Time ago', 'Date label', 'Datetime'],
      text: 'Shows a moment as a technical value: the date and time (the default), a relative time (“5 minutes ago”; it rewrites itself and becomes the date after 7 days), a date label (“Today”, “Yesterday”, “Oct 8”), or the date or the time alone. It is a <time> with the machine-readable value, written by the formats in the reader’s locale, in the data font (Reddit Mono) at the size of the surrounding text. Relative times and date labels show the full date and time with its zone in a tooltip, and are a Tab stop for it.',
      use: ['The exact moment in logs, version history and details, where order matters (datetime)', 'Recent activity, comments and notifications (relative)', 'Due, published and expiry dates (label or date)'],
      avoid: ['Building a date by hand: the formats write every date', 'Seconds unless order within a minute matters', 'A relative time in an audit log: use the exact timestamp', 'A date range: use formatRange'],
      related: ['date-and-time-formats', 'tooltip', 'date'],
      map: [[SPE, 'Date (formatted)', 'Partial'], [POL, 'Date and time (content guidelines)', 'Partial'], [CAR, 'Timestamp (content guidelines)', 'Partial']],
      variantPages: [
        vp('Timestamp variant', 'Format', 'Timestamp (default)', { variant: 'datetime' }, 'The date and the time in the reader’s locale: “Oct 8, 2026, 2:05 PM”.', 'Logs, history and details where the moment matters', 'Recent activity people read at a glance: use relative'),
        vp('Relative time', 'Format', 'Relative', { variant: 'relative' }, '“Just now”, “5 minutes ago”, “in 2 days”: it rewrites itself every minute, without moving the layout and without being announced, and becomes the date after 7 days. The full moment is in its tooltip.', 'Comments, notifications and recent activity', 'Audit logs and anything compared across rows: use the timestamp'),
        vp('Date label', 'Format', 'Date label', { variant: 'label' }, '“Today”, “Yesterday”, “Tomorrow”, else the short date (the year only when it is not this year).', 'Due dates, publish dates and day headings in a list', 'A moment within the day: use the timestamp'),
        vp('Date only', 'Format', 'Date only', { variant: 'date' }, 'The date alone, at the length the place needs (dateStyle): “Oct 8, 2026”, “October 8, 2026”.', 'Invoices, birthdays, expiry dates', 'Ambiguous numeric dates: the formats spell the month'),
        vp('Time only', 'Format', 'Time only', { variant: 'time' }, 'The time alone, with seconds or the zone when they matter: “2:05 PM”, “2:05 PM PST”.', 'Times inside one day: a schedule, today’s log', 'A moment on another day: use the timestamp'),
        vp('Timestamp with tooltip', 'Format', 'With absolute tooltip', { variant: 'tooltip' }, 'The full date and time with its zone in a tooltip on hover and keyboard focus; the time is a Tab stop.', 'Relative times and date labels (on by default)', 'An exact timestamp already shown in full')
      ],
      examples: [['Format', [['Timestamp (default)', function () { return h(P.Time, { value: ago(2 * HOUR) }); }, null, 'format="datetime"'],
        ['Relative', function () { return h(P.Stack, { gap: 'xs' }, h(P.Time, { value: ago(20000), format: 'relative' }), h(P.Time, { value: ago(5 * MIN), format: 'relative' }), h(P.Time, { value: ago(3 * DAY), format: 'relative' })); }, null, 'format="relative"'],
        ['Date label', function () { return h(P.Stack, { gap: 'xs' }, h(P.Time, { value: new Date(), format: 'label' }), h(P.Time, { value: ago(DAY), format: 'label' }), h(P.Time, { value: ago(9 * DAY), format: 'label' })); }, null, 'format="label"'],
        ['Date only', function () { return h(P.Time, { value: ago(9 * DAY), format: 'date', dateStyle: 'long' }); }, null, 'format="date"'],
        ['Time only', function () { return h(P.Time, { value: ago(2 * HOUR), format: 'time', timeZoneName: 'short' }); }, null, 'format="time"'],
        ['With absolute tooltip', function () { return h(P.Text, null, 'Edited ', h(P.Time, { value: ago(5 * MIN), format: 'relative' }), ' by Ana Ruiz'); }, null, 'tooltip']], { prop: 'format' }]] },

    /* ── 08 Feedback › Empty, failure, and recovery ── */
    { id: 'undo-pattern', lab: true, sec: 'feedback', sub: 'Empty, failure, and recovery', leaf: 'Undo pattern', title: 'Undo pattern', plenix: 'useUndo, useToast (action)', src: 'components/Toast/Toast.tsx', variantClasses: [],
      level: 'Pattern', interaction: 'Feedback', icon: 'ed-undo',
      aliases: ['Undo toast', 'Snackbar with action', 'Undo snackbar', 'Reversible action'],
      text: 'Replaces a confirmation step for anything that can be reversed: the action happens at once and a toast says what happened, with an Undo button. Undo puts it back; when the toast leaves without Undo, the change is final (onCommit). The toast stays while the pointer is over it or focus is inside it; persistent (duration 0) keeps it until Undo or Dismiss.',
      use: ['Archive, move, delete to the trash, remove from a list: reversible actions done in one step', 'onCommit for the moment the change becomes final (a purge, a send)', 'A message that names what happened (“3 assets archived”) and the label “Undo”'],
      avoid: ['Actions that cannot be reversed: ask first with a confirmation dialog', 'A toast that leaves before people can reach it: keep the default time or make it persistent', 'More than one action in the toast'],
      related: ['toast', 'confirmation-dialog'],
      map: [[MAT, 'Snackbar (with action)', 'Partial'], [ATL, 'Flag (with actions)', 'Partial'], [CAR, 'Toast notification (actionable)', 'Partial'], [POL, 'Toast (with action)', 'Partial']],
      variantPages: [
        vp('Toast with an Undo action', 'Action', 'With action (Undo)', { variant: 'action' }, 'The toast with an Undo button between the message and Dismiss; it leaves after the toast’s time, which pauses while the pointer or focus is on it.', 'Archive, move or remove done in one step', 'An action that cannot be undone'),
        vp('Persistent undo toast', 'Action', 'Persistent until action', { variant: 'persistent' }, 'duration 0: the toast stays until Undo or Dismiss, for a change people may want to check first.', 'A large change (many items) people should review before it is final', 'Every small action: the screen fills with toasts')
      ],
      examples: [['Action', [['With action (Undo)', undoDemo('Archive one'), null, "undoable(message, { onUndo })"],
        ['Persistent until action', undoDemo('Archive one (stays)', { duration: 0 }), null, 'duration: 0']], { prop: 'action' }]] }
  ];
});
