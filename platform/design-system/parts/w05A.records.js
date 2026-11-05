/* Plenix design system · library part w05A (wave 5, lane A): the contextual overlays. Popover (and its duplicate leaves
   Popup and Inline dialog, and Hover card, its hover trigger), ContextualHelp (Contextual help, and the inline tip that
   answers Contextual education), TeachingBubble (Teaching bubble, and its duplicate Coach mark), the Popconfirm pattern
   and MegaMenu (Mega menu). Every surface is the popover's: the overlay surface with the menu's border, radius and
   shadow; nothing here adds a color. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var para = function (t) { return h(P.Text, { as: 'p' }, t); };
  var FILTER = function () {
    return h(P.Stack, { gap: 'sm' }, h(P.Checkbox, { label: 'Images', defaultChecked: true }), h(P.Checkbox, { label: 'Documents' }), h(P.Checkbox, { label: 'Videos' }));
  };
  // a popover on a button: the trigger, and its props
  var pop = function (label, props, body) { return h(P.Popover, Object.assign({ trigger: h(P.Button, { caret: true }, label) }, props), body || para('Shows the assets that match every choice.')); };

  /* ── 09 Overlays › Contextual overlays › Popover ── */
  var popover = { id: 'popover', lab: true, icon: 'text-card', sec: 'overlays', sub: 'Contextual overlays', leaf: 'Popover', title: 'Popover',
    plenix: 'Popover', src: 'components/Popover/Popover.tsx', level: 'Component', interaction: 'Overlay', aliases: ['Toggletip', 'Flyout', 'Callout', 'Anchored dialog'],
    text: 'A small non-modal surface anchored to its trigger, for a short form, a filter, details or an explanation. A click opens it in the browser’s top layer, placed beside the trigger by CSS anchor positioning; it flips and shifts to stay in the window and takes focus. Escape, a click outside or Tab away closes it and returns focus to the trigger. It uses the menu’s surface (the overlay surface with its border, radius and shadow): a header with an optional Close, the body and an end-aligned footer, and an optional arrow that points at the trigger. At the Narrow window class it opens as a bottom sheet.',
    use: ['A short form, a filter or a set of options tied to one trigger', 'Content too rich for a tooltip: links, controls, more than a line', 'size="sm" for a short explanation, "lg" for a short form; arrow when the trigger is small or far from the popover’s corner'],
    avoid: ['A hint of a few words: use a Tooltip', 'A decision that blocks the task, or a long form: use a Dialog or a Sheet', 'A popover inside a popover', 'Opening on hover: only a hover card does, and it never holds the only way to an action'],
    related: ['tooltip', 'dialog', 'sheet', 'floating', 'contextual-help', 'popconfirm'],
    covers: [],
    map: [[CAR, 'Popover', 'Direct'], [ATL, 'Popup', 'Direct'], [FLU, 'Popover', 'Direct'], [POL, 'Popover', 'Direct'], [SPE, 'Popover', 'Direct'], [MAT, 'Rich tooltip', 'Partial'], ['Frappe', 'Popover (Frappe UI)', 'Direct']],
    variantPages: [
      vp('Click popover', 'Trigger', 'Click (default)', { variant: 'plain' }, 'Opens and closes with a click, Enter or Space on its trigger; focus moves into it.', 'Filters, options and short forms', 'Content that must show without a click: put it on the page'),
      vp('Popover with header and footer', 'Parts', 'With header and footer', { variant: 'header' }, 'A title that names it and a Close button above the body, and its actions in a footer at the end edge.', 'A short form with its own Apply or Save', 'A one-line explanation: the body alone is enough'),
      vp('Popover with arrow', 'Parts', 'With arrow', { variant: 'arrow' }, 'A caret on the edge facing the trigger, in the border and surface colors. The popover keeps its side, so the caret always points at the trigger.', 'A small trigger, or a popover whose corner is far from it', 'A popover next to a large trigger: the edge already shows where it came from'),
      vp('Small popover', 'Size', 'Sm (240px)', { size: 'sm' }, 'A 240px popover.', 'A short explanation or a hover card', 'A form: its fields get too narrow'),
      vp('Medium popover', 'Size', 'Md (320px, default)', { size: 'md' }, 'A 320px popover, the default.', 'Filters and option sets', 'A few words: use Sm'),
      vp('Large popover', 'Size', 'Lg (400px)', { size: 'lg' }, 'A 400px popover.', 'A short form or a picture', 'Long content: use a Sheet or a Dialog'),
      vp('Content-width popover', 'Size', 'Auto (content width)', { size: 'auto' }, 'As wide as its content, never wider than the window less its margins.', 'Columns of links (MegaMenu) and other content that sets its own width', 'Text: it runs to the window’s width'),
      vp('Popover as a sheet on Narrow', 'Narrow', 'Sheet on Narrow (default)', null, 'At the Narrow window class a click popover opens as a bottom Sheet with the same title, content and footer.', 'Every click popover on a phone-sized window', 'A hover card: it never becomes a sheet')
    ],
    examples: [
      ['Trigger', [['Click (default)', function () { return pop('Filter', { title: 'Filter', size: 'sm' }, FILTER()); }, null, 'triggerOn="click"']]],
      ['Parts', [['With header and footer', function () { return pop('Share', { title: 'Share', closeButton: true, footer: [h(P.Button, { key: 'c' }, 'Cancel'), h(P.Button, { key: 's', variant: 'primary' }, 'Send')] },
          h(P.Field, { label: 'Email' }, h(P.Input, { type: 'email', placeholder: 'name@example.com' }))); }, null, 'title, footer, closeButton'],
        ['With arrow', function () { return pop('Details', { arrow: true, placement: 'bottom', size: 'sm', label: 'Details' }); }, 'plx-popover--arrow', 'arrow']]],
      ['Size', [['Sm (240px)', function () { return pop('Small', { size: 'sm', label: 'Small popover' }); }, 'plx-popover--sm', 'size="sm"'],
        ['Md (320px, default)', function () { return pop('Medium', { size: 'md', label: 'Medium popover' }); }, 'plx-popover--md', 'size="md"'],
        ['Lg (400px)', function () { return pop('Large', { size: 'lg', label: 'Large popover' }); }, 'plx-popover--lg', 'size="lg"'],
        ['Auto (content width)', function () { return pop('Auto', { size: 'auto', label: 'Content-width popover' }, para('As wide as this line.')); }, 'plx-popover--auto', 'size="auto"']], { prop: 'size' }],
      ['Narrow', [['Sheet on Narrow (default)', function () { return pop('Filter', { title: 'Filter', size: 'sm' }, FILTER()); }, null, 'sheetOnNarrow']]]] };

  // the duplicate leaves of Popover: thin records with their own words
  var thinPop = function (id, leaf, text, use1, avoid1, aliases) {
    return { id: id, icon: 'text-card', sec: 'overlays', sub: 'Contextual overlays', leaf: leaf, title: leaf, plenix: 'Popover', src: 'components/Popover/Popover.tsx', level: 'Component', interaction: 'Overlay',
      variantClasses: [], docsFrom: 'popover', aliases: aliases, text: text, use: use1, avoid: avoid1, related: ['popover', 'tooltip', 'dialog'],
      examples: [['A popover', function () { return pop('Filter', { title: 'Filter', size: 'sm' }, FILTER()); }]] };
  };
  var popup = thinPop('overlays-popup', 'Popup', 'Popup is another name for the Popover: the one anchored, dismissible surface for all custom anchored content, so no component builds its own. Menus, selects and tooltips are separate components on the same floating foundation.',
    ['Custom anchored content that is not a menu, a list of options or a tooltip: Popover'], ['A Popup of your own: Popover is the base', 'Content people must act on before they go on: use a Dialog'], ['Pop-up', 'Anchored container']);
  Object.assign(popup, { purpose: 'Shows custom content or a few controls next to what it belongs to, without leaving the page. Popup is another name for the Popover.', anatomy: ['As Popover: the trigger, the surface, an optional header and footer, the body and an optional arrow'], behavior: { pointer: 'As Popover.', keyboard: 'As Popover.', focus: 'As Popover.', responsive: 'As Popover.', motion: 'As Popover.', loading: 'As Popover.', error: 'As Popover.' }, a11y: { name: 'As Popover.', announce: 'As Popover.', focus: 'As Popover.', contrast: 'As Popover.', motion: 'As Popover.' }, content: { labels: 'As Popover.', actions: 'As Popover.', errors: 'As Popover.', localization: 'As Popover.' } });
  var inlineDialog = thinPop('overlays-inline-dialog', 'Inline dialog', 'An inline dialog is a Popover: a small non-modal dialog next to what it explains, with a title that names it and room for a link or a button. It opens on click and leaves the page usable.',
    ['A short paragraph with a link or a button about one element: Popover with a title'], ['One plain line: use a Tooltip', 'A long form: use a Dialog or a Sheet'], ['Toggletip', 'Anchored dialog']);
  Object.assign(inlineDialog, { purpose: 'Shows a short explanation, with a link or a button, next to the element it is about, while the page stays usable.', anatomy: ['As Popover, with a title that names it (required)'], behavior: { pointer: 'As Popover.', keyboard: 'As Popover.', focus: 'As Popover.', responsive: 'As Popover.', motion: 'As Popover.', loading: 'As Popover.', error: 'As Popover.' }, a11y: { name: 'role="dialog", named by its title, which an inline dialog always has; the trigger has aria-haspopup="dialog", aria-expanded and aria-controls.', announce: 'As Popover.', focus: 'As Popover.', contrast: 'As Popover.', motion: 'As Popover.' }, content: { labels: 'A title of a few words that names what it explains.', actions: 'As Popover.', errors: 'As Popover.', localization: 'As Popover.' } });

  /* ── 09 Overlays › Contextual overlays › Hover card: Popover triggerOn="hover" ── */
  var person = function () {
    return h(P.Popover, { trigger: h(P.Link, { href: '#maya' }, 'Maya Chen'), triggerOn: 'hover', label: 'Maya Chen', size: 'sm' },
      h(P.Persona, { name: 'Maya Chen', secondary: 'Designer · Lisbon' }));
  };
  var hoverCard = { id: 'hover-card', icon: 'person', sec: 'overlays', sub: 'Contextual overlays', leaf: 'Hover card', title: 'Hover card',
    plenix: 'Popover', src: 'components/Popover/Popover.tsx', level: 'Component', interaction: 'Overlay', variantClasses: [], docsFrom: 'popover',
    aliases: ['Profile card', 'Preview card', 'Hovercard'],
    purpose: 'Lets people preview a person, a file or a page from its name or link, without visiting it.',
    anatomy: ['Trigger — the name, avatar or link it previews (required)', 'Surface — as Popover, small (size="sm") (required)', 'Body — a compact summary, such as a Persona, and at most one or two quick actions (required)'],
    behavior: { pointer: 'It opens when the pointer rests on the trigger (--plx-comp-popover-hover-open-delay), stays while the pointer is in it, and closes a moment after the pointer leaves both (--plx-comp-popover-hover-close-delay). Touch has no hover: a tap follows the link.', keyboard: 'Keyboard focus on the trigger opens it at once; Escape closes it, and so does moving focus away.', focus: 'Focus stays on the trigger: a hover card never takes it.', responsive: 'As Popover, but it never becomes a bottom sheet at the Narrow window class.', motion: 'As Popover.', loading: 'As Popover.', error: 'Not applicable: a hover card holds no form.' },
    a11y: { name: 'The trigger keeps its own name and gets no aria-haspopup or aria-expanded; the card is named by its label.', announce: 'Focus stays on the trigger, so the card’s content is not read on its own: everything in it must also be on the object’s page.', focus: 'Focus stays on the trigger.', contrast: 'As Popover.', motion: 'As Popover.' },
    content: { labels: 'As Popover.', actions: 'At most one or two quick actions, each also on the object’s page.', errors: 'Not applicable: there is no error text.', localization: 'As Popover.' },
    text: 'A Popover that previews an object when the pointer rests on its name, avatar or link (triggerOn="hover"). It opens after a short delay (--plx-comp-popover-hover-open-delay), stays open while the pointer moves into it, and closes a moment after the pointer leaves both. Keyboard focus on the trigger opens it at once; Escape closes it without moving focus. Touch has no hover: a tap follows the link.',
    use: ['A preview of a person, a file or a page on its name or link, to save a visit', 'size="sm", a compact summary (Persona), and at most one or two quick actions that are also on the object’s page'],
    avoid: ['The only way to an action or a fact: touch and many keyboard users never see it', 'Opening a hover card on a button: buttons act on click'],
    related: ['popover', 'profile-summary', 'link'],
    map: [[FLU, 'HoverCard', 'Direct'], [ATL, 'Profile card', 'Partial'], [MAT, 'Rich tooltip', 'Partial'], ['Frappe', 'Link preview popover', 'Direct']],
    examples: [['Hover or focus the name', function () { return row(person()); }, null, 'triggerOn="hover"']] };

  /* ── 09 Overlays › Contextual overlays › Contextual help ── */
  var contextualHelp = { id: 'contextual-help', lab: true, icon: 'info-circle', sec: 'overlays', sub: 'Contextual overlays', leaf: 'Contextual help', title: 'Contextual help',
    plenix: 'ContextualHelp', src: 'components/ContextualHelp/ContextualHelp.tsx', level: 'Component', interaction: 'Overlay', aliases: ['Info button', 'Toggletip', 'Help icon', 'Info label'],
    text: 'An info button beside a label, heading or setting; a click opens a short explanation in a Popover: a title, one to three sentences and an optional link to more help. The button is ghost, in the inline-action role (a 24px target), so it sits on the label’s line; its name says what it explains (“More about Retention”). The inline tip shows the same explanation in place, after the info icon.',
    use: ['Labels, headings and settings that raise a question: what a term means, why it matters', 'link to the full help page when one or two sentences are not enough', 'variant="inline" where the tip should be read without a click (Contextual education)'],
    avoid: ['Help everyone needs to fill the field: use helper text', 'Errors and warnings: they belong on the field or in a notice', 'Hover-only help: the button opens on click'],
    related: ['popover', 'field', 'tooltip', 'patterns-contextual-education'],
    map: [[SPE, 'Contextual help', 'Direct'], [CAR, 'Toggletip', 'Direct'], [FLU, 'InfoLabel', 'Direct'], [ATL, 'Inline dialog', 'Partial'], ['Frappe', 'DocField description', 'Partial']],
    variantPages: [
      vp('Info contextual help', 'Variant', 'Info (default)', { variant: 'info' }, 'The info button, ghost and 24px, opening the explanation in a small popover.', 'A term or setting that needs a sentence of explanation', 'Text everyone needs: use helper text'),
      vp('Contextual help with a link', 'Variant', 'With a link', { variant: 'link' }, 'The explanation followed by a standalone link to the full help page.', 'Topics with a help page of their own', 'A link that repeats the explanation'),
      vp('Inline tip', 'Variant', 'Inline tip', { variant: 'inline' }, 'The explanation in place: the info icon, a bold title and the text in the muted color, on 20px lines.', 'A tip people should read without a click', 'Errors and warnings: use a notice')
    ],
    examples: [['Variant', [['Info (default)', function () { return row(h(P.Text, null, 'Retention'), h(P.ContextualHelp, { title: 'Retention' }, 'Deleted files stay in the trash for 30 days, then they are gone.')); }, 'plx-contextual-help--info', 'variant="info"'],
      ['With a link', function () { return row(h(P.Text, null, 'Storage'), h(P.ContextualHelp, { title: 'Storage', link: { href: '#storage', label: 'About storage' } }, 'Originals count toward your quota; previews do not.')); }, null, 'link'],
      ['Inline tip', function () { return H.box(320, h(P.ContextualHelp, { variant: 'inline', title: 'Tip' }, 'Drop files anywhere on the page to upload them.')); }, 'plx-contextual-help--inline', 'variant="inline"']], { prop: 'variant' }]] };

  /* ── 10 Patterns › Onboarding and education › Contextual education: the inline tip and the info button ── */
  var contextualEducation = { id: 'patterns-contextual-education', icon: 'info-circle', sec: 'patterns', sub: 'Onboarding and education', leaf: 'Contextual education', title: 'Contextual education',
    plenix: 'ContextualHelp', src: 'components/ContextualHelp/ContextualHelp.tsx', level: 'Pattern', interaction: 'Static', variantClasses: [], docsFrom: 'contextual-help',
    aliases: ['In-context help', 'Inline help', 'Just-in-time help'],
    text: 'Help beside what it explains, when it is needed: a short inline tip that is always shown (ContextualHelp variant="inline"), or an info button whose popover answers one question (ContextualHelp). Each answers one question in one to three sentences, and links to more detail instead of growing.',
    use: ['An inline tip for guidance people should read in passing', 'The info button for a term or setting a few people will ask about', 'A Learn more link to the full help page'],
    avoid: ['Essential instructions in a hidden popover: show them as text', 'Hover-only tooltips for content people must read', 'Several tips competing on one screen'],
    related: ['contextual-help', 'popover', 'teaching-bubble'],
    map: [[SPE, 'Contextual help', 'Partial'], [CAR, 'Toggletip', 'Partial'], [FLU, 'InfoLabel', 'Partial']],
    examples: [['An inline tip, and an info button', function () {
      return H.box(360, h(P.Stack, { gap: 'md' }, h(P.ContextualHelp, { variant: 'inline', title: 'Tip', link: { href: '#upload', label: 'Upload guide' } }, 'Drop files anywhere on the page to upload them.'),
        row(h(P.Text, null, 'Retention'), h(P.ContextualHelp, { title: 'Retention' }, 'Deleted files stay in the trash for 30 days.'))));
    }]] };

  /* ── 09 Overlays › Contextual overlays › Teaching bubble ── */
  var bubble = function (props, body) {
    var o = use(false);
    return h(P.TeachingBubble, Object.assign({ target: h(P.Button, { icon: 'filter', onClick: function () { o[1](!o[0]); } }, 'Filters'), open: o[0], onDismiss: function () { o[1](false); },
      title: 'Saved filters', primaryAction: { label: 'Got it', onClick: function () { o[1](false); } } }, props), body || 'Save a set of filters and open it from here next time.');
  };
  var teachingBubble = { id: 'teaching-bubble', lab: true, icon: 'sparkle', sec: 'overlays', sub: 'Contextual overlays', leaf: 'Teaching bubble', title: 'Teaching bubble',
    plenix: 'TeachingBubble', src: 'components/TeachingBubble/TeachingBubble.tsx', level: 'Component', interaction: 'Overlay', aliases: ['Coach mark', 'Teaching popover', 'Onboarding callout', 'Spotlight callout'],
    text: 'A callout with an arrow pointing at a feature: it introduces the feature once, or leads a tour of two to five steps. It holds a title, one or two sentences, an optional picture, the step count (“2 of 3”, the numbers in the data font) and its actions. It is a Popover the caller opens, and the caller remembers that it was dismissed. It stays until an action, Close or Escape, and never closes on a click elsewhere. Its surface is the brand blue, with the color on the brand for its text, icons and actions (owner, 2026-10-13): the primary action is filled with that color; the secondary action and Close are drawn in it. While it is open, a Spotlight dims the rest of the window and leaves the feature bright and usable (spotlight, on by default).',
    use: ['A new or easily missed feature, once, beside where it lives', 'A short tour: step with Next and Back, and Close to leave it', 'wide with a picture or a longer step'],
    avoid: ['Errors, warnings or anything people need to finish the task', 'More than one at a time, or one that interrupts work in progress', 'Showing it again after it was dismissed'],
    related: ['popover', 'patterns-coach-mark', 'contextual-help', 'spotlight'],
    map: [[FLU, 'TeachingPopover', 'Direct'], [SPE, 'Coach mark', 'Direct'], [ATL, 'Spotlight', 'Partial'], [MAT, 'Rich tooltip', 'Partial']],
    variantPages: [
      vp('Teaching bubble', 'Content', 'Title and text (default)', { variant: 'default' }, 'The title, a sentence and one action, with the arrow at the feature.', 'Introducing one feature once', 'Required information'),
      vp('Teaching bubble with a picture', 'Content', 'With picture', { variant: 'media' }, 'A picture above the title, in a wide bubble.', 'A feature that is easier shown than told', 'A decorative picture with no meaning: leave it out'),
      vp('Teaching bubble with steps', 'Content', 'With steps (2 of 3)', { variant: 'steps' }, 'The step count at the start of the footer, the numbers in the data font, and Back and Next at the end.', 'A tour of two to five steps', 'A tour longer than five steps: link to a guide'),
      vp('Teaching bubble with two actions', 'Content', 'Primary and secondary actions', { variant: 'actions' }, 'A primary action and a secondary one (Try it, Not now).', 'Inviting people to try the feature now', 'More than two actions'),
      vp('Wide teaching bubble', 'Width', 'Wide (400px)', { size: 'wide' }, 'The 400px bubble.', 'A picture or a longer step', 'One short sentence: the default is enough'),
      vp('Teaching bubble with a spotlight', 'Spotlight', 'With spotlight (default)', null, 'While it is open, a Spotlight dims the rest of the window; the feature stays bright and usable.', 'Introducing a feature people should look at now', 'A quiet hint beside work in progress: turn the spotlight off'),
      vp('Teaching bubble without a spotlight', 'Spotlight', 'Without spotlight', null, 'The bubble alone, the page left as it is (spotlight={false}).', 'A hint that should not interrupt work in progress', 'The first introduction of a key feature: keep the spotlight')
    ],
    examples: [
      ['Content', [['Title and text (default)', function () { return row(bubble({})); }, null, 'title, children, primaryAction'],
        ['With picture', function () { return row(bubble({ wide: true, media: h(P.Image, { src: '../../dam/assets/thumb-21.svg', alt: '', ratio: '16-9' }) })); }, null, 'media'],
        ['With steps (2 of 3)', function () { return row(bubble({ title: 'Share a board', step: { current: 2, total: 3 }, primaryAction: { label: 'Next', onClick: noop }, secondaryAction: { label: 'Back', onClick: noop } }, 'Invite people by email; they see the board at once.')); }, null, 'step'],
        ['Primary and secondary actions', function () { return row(bubble({ title: 'Boards', primaryAction: { label: 'Try it', onClick: noop }, secondaryAction: { label: 'Not now', onClick: noop } }, 'Group assets on a board to review them together.')); }, null, 'primaryAction, secondaryAction']]],
      ['Width', [['Wide (400px)', function () { return row(bubble({ wide: true })); }, null, 'wide']]],
      ['Spotlight', [['With spotlight (default)', function () { return row(bubble({})); }, null, 'spotlight'], ['Without spotlight', function () { return row(bubble({ spotlight: false })); }, null, 'spotlight={false}']]]] };

  /* ── 10 Patterns › Onboarding and education › Coach mark: TeachingBubble ── */
  var coachMark = { id: 'patterns-coach-mark', icon: 'sparkle', sec: 'patterns', sub: 'Onboarding and education', leaf: 'Coach mark', title: 'Coach mark',
    plenix: 'TeachingBubble', src: 'components/TeachingBubble/TeachingBubble.tsx', level: 'Component', interaction: 'Overlay', variantClasses: [], docsFrom: 'teaching-bubble',
    aliases: ['Teaching bubble', 'Teaching popover'],
    text: 'A coach mark is a TeachingBubble: an anchored callout on the brand blue, with an arrow, that teaches what one element does. It has Close, plus Next and Back in a tour. Its Spotlight dims the rest of the window while the element stays usable; focus is not trapped.',
    use: ['Pointing out a new or easily missed control, once', 'One step of a short product tour'], avoid: ['Several coach marks at once', 'Instructions people need to finish the task: put them in the interface'],
    related: ['teaching-bubble', 'popover'],
    examples: [['A coach mark', function () { return row(bubble({})); }]] };

  /* ── 09 Overlays › Overlay surfaces › Popconfirm ── */
  var confirm = function (tone) {
    return tone === 'danger'
      ? h(P.Popconfirm, { trigger: h(P.Button, { variant: 'danger-secondary', icon: 'trash' }, 'Remove tag'), title: 'Remove this tag?', description: 'The 12 assets keep their other tags.', confirmLabel: 'Remove', tone: 'danger', onConfirm: noop })
      : h(P.Popconfirm, { trigger: h(P.Button, null, 'Publish'), title: 'Publish 3 changes?', confirmLabel: 'Publish', onConfirm: noop });
  };
  var popconfirm = { id: 'popconfirm', lab: true, icon: 'circle-check', sec: 'overlays', sub: 'Overlay surfaces', leaf: 'Popconfirm', title: 'Popconfirm',
    plenix: 'Popconfirm', src: 'patterns/Popconfirm/Popconfirm.tsx', level: 'Pattern', interaction: 'Overlay', aliases: ['Popover confirmation', 'Confirm popover', 'Inline confirmation'],
    text: 'A one-sentence question in a small Popover beside the action it guards, with Cancel and the action’s verb. Focus starts on Cancel; Escape, Cancel or a click outside closes it without running the action. The question names the action and the object; the confirm button says the verb, in the danger style when it removes something.',
    use: ['A moderately risky action on one item: removing a tag, leaving a group', 'A question that fits in one sentence, with at most one more for the consequence'],
    avoid: ['Irreversible or high-impact actions: use a confirmation Dialog', 'Actions that can be undone: run them and offer Undo', '“Yes” and “No” as the answers'],
    related: ['popover', 'confirmation-dialog', 'button'],
    map: [[ANT, 'Popconfirm', 'Direct'], [CAR, 'Popover', 'Composite'], [ATL, 'Popup', 'Composite']],
    variantPages: [
      vp('Popconfirm', 'Tone', 'Default', { variant: 'default' }, 'The question with Cancel and the verb in the primary style.', 'Publishing, sending or moving one item', 'Removing something: use Destructive'),
      vp('Destructive popconfirm', 'Tone', 'Destructive', { variant: 'danger' }, 'The verb in the danger style, and a sentence on what stays.', 'Removing a tag, a member or a link', 'Deleting for good: use a confirmation Dialog')
    ],
    examples: [['Tone', [['Default', function () { return row(confirm('default')); }, null, 'tone="default"'], ['Destructive', function () { return row(confirm('danger')); }, null, 'tone="danger"']], { prop: 'tone' }]] };

  /* ── 06 Navigation › Hierarchical navigation › Mega menu ── */
  var GROUPS = [
    { title: 'Start', links: [{ label: 'Upload files', href: '#upload', description: 'Add files to a project' }, { label: 'Organize', href: '#organize', description: 'Folders, tags and boards' }] },
    { title: 'Share', links: [{ label: 'Links', href: '#links', description: 'Send a view-only link' }, { label: 'People', href: '#people', description: 'Invite members' }] },
    { title: 'Manage', links: [{ label: 'Storage', href: '#storage' }, { label: 'Permissions', href: '#permissions' }, { label: 'Billing', href: '#billing' }] }];
  var feature = function () { return h(P.Stack, { gap: 'xs' }, h(P.Text, { as: 'p', variant: 'label' }, 'New: boards'), h(P.Text, { as: 'p' }, 'Review assets together.'), h(P.Link, { href: '#boards', variant: 'standalone' }, 'Open boards')); };
  var mega = function (props) { return h('nav', { 'aria-label': 'Guides' }, h(P.MegaMenu, Object.assign({ label: 'Guides', groups: GROUPS }, props))); };
  // MegaMenu is drawn on the Navigation menu page (inventory.js), with this part's menu groups
  H.addExamples('navigation-menu', [['Layout', [['Columns (default)', function () { return mega({ layout: 'columns' }); }, null, 'layout="columns"'],
      ['With featured', function () { return mega({ layout: 'columns', featured: feature() }); }, null, 'featured'],
      ['Mobile accordion', function () { return H.box(280, mega({ layout: 'accordion' })); }, 'plx-mega-menu--accordion', 'layout="accordion"']], { prop: 'layout' }]]);

  return [popover, popup, inlineDialog, hoverCard, contextualHelp, contextualEducation, teachingBubble, coachMark, popconfirm];
});
