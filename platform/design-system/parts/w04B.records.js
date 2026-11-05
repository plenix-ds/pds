/* Plenix design system · library part w04B (wave 4, lane B): people, progress and identity. StatusDot's availability
   tones (Availability indicator), Avatar's presence (Presence, and its duplicate leaf Online status), AvatarGroup (Avatar
   group), Persona (Profile summary), ProgressCircle (Circular progress), QRCode (QR code) and VersionLabel (Version label).
   The availability colors are the presence roles of the Status colors; nothing here adds a color. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, q = H.q, onAccent = H.onAccent;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var PRESENCE = [['online', 'Online'], ['away', 'Away'], ['busy', 'Busy'], ['dnd', 'Do not disturb'], ['offline', 'Offline']];
  var WORD = { online: 'Online', away: 'Away', busy: 'Busy', dnd: 'Do not disturb', offline: 'Offline' };
  var PEOPLE = [{ id: 1, name: 'Maya Chen', presence: 'online' }, { id: 2, name: 'Alex Kim', color: 'green', presence: 'away' }, { id: 3, name: 'Sam Ortiz', presence: 'busy' },
    { id: 4, name: 'Ana Silva', color: 'purple', presence: 'offline' }, { id: 5, name: 'Luis Romero' }, { id: 6, name: 'Jordan Avery', color: 'brown' }, { id: 7, name: 'Nina Patel' }];
  var plain = PEOPLE.map(function (p) { return { id: p.id, name: p.name, color: p.color }; });
  // a dot named by its label, then the same words shown (hidden from assistive technology, which reads the label)
  var line = function (dot, text) { return h(P.Inline, { gap: 'xs', align: 'center' }, dot, h(P.Text, { 'aria-hidden': true }, text)); };

  /* ── 08 Feedback › Status › Availability indicator: StatusDot's presence tones ── */
  var availability = { id: 'availability-indicator', lab: true, icon: 'person', sec: 'feedback', sub: 'Status', leaf: 'Availability indicator', title: 'Availability indicator',
    plenix: 'StatusDot', src: 'components/StatusDot/StatusDot.tsx', blocks: ['plx-status-dot'],
    variantClasses: ['plx-status-dot--online', 'plx-status-dot--away', 'plx-status-dot--busy', 'plx-status-dot--dnd', 'plx-status-dot--offline', 'plx-status-dot--md', 'plx-status-dot--lg', 'plx-status-dot--glyph'],
    level: 'Component', interaction: 'Feedback', aliases: ['Presence badge', 'Availability', 'Presence dot', 'Status light', 'Presence indicator'],
    text: 'Whether a person is available, as a StatusDot in the presence roles of the Status colors: online, away, busy, do not disturb and offline. The larger dots carry the availability’s shape cut out in the surface color (a check, a clock, a minus for do not disturb, a cross; busy is the solid dot), so it never rests on color alone: busy and do not disturb share a color and differ by shape. Avatar’s presence prop puts one at the avatar’s corner.',
    use: ['tone="online" | "away" | "busy" | "dnd" | "offline" wherever a person’s availability is shown: member lists, chat, the account menu', 'size="md" or "lg" with icon where the dot stands alone or sits on an avatar of 40px and more', 'The state in words too: the dot’s label, or the text next to it'],
    avoid: ['The feedback tones (success, warning) for presence: the Status colors are its roles', 'Telling busy from do not disturb by color: they share it; the shape and the words tell them apart', 'A state with a borrowed color: the five states are the presence roles', 'A dot alone without the person’s name nearby'],
    related: ['status-dot', 'presence', 'content-online-status', 'color-status'],
    map: [[FLU, 'PresenceBadge', 'Direct'], [ATL, 'Presence', 'Direct'], [CAR, 'Status indicator', 'Partial'], [SPE, 'Status light', 'Partial']],
    variantPages: [
      vp('Online availability dot', 'Tone', 'Online', { variant: 'online' }, 'The green dot of the presence roles: the person is online and available.', 'People who can answer now', 'A healthy service: that is a feedback tone'),
      vp('Away availability dot', 'Tone', 'Away', { variant: 'away' }, 'The amber dot: the person is away or idle.', 'People who have stepped away', 'A warning about the work'),
      vp('Busy availability dot', 'Tone', 'Busy', { variant: 'busy' }, 'The red solid dot, nothing cut out: the person is busy, in a meeting or a call.', 'People in a meeting or a call who can still be reached', 'An error or a failure'),
      vp('Do not disturb availability dot', 'Tone', 'Do not disturb', { variant: 'dnd' }, 'The busy color with a minus cut out: the person asks not to be disturbed, and notifications wait.', 'People focusing with notifications held', 'Busy people who can still be reached: use Busy'),
      vp('Offline availability dot', 'Tone', 'Offline', { variant: 'offline' }, 'The gray dot: the person is offline, or their state is not known.', 'People who are signed out', 'A disabled control'),
      vp('Medium availability dot', 'Size', 'Md (12px)', { size: 'md' }, 'A 12px dot with room for its glyph: on 40px and 48px avatars.', 'An avatar in a header or a card', 'Beside a line of text: use the 6px dot'),
      vp('Large availability dot', 'Size', 'Lg (16px)', { size: 'lg' }, 'A 16px dot with its glyph: on the largest avatars.', 'A profile page avatar', 'Lists of people: it crowds the names'),
      vp('Availability dot with glyph', 'Glyph', 'With its glyph (not color only)', { size: 'md', content: 'glyph' }, 'Each availability with its own shape, cut out in the surface color.', 'Every dot that stands without its words nearby', 'The 6px dot: there is no room for a shape')
    ],
    examples: [
      ['Tone', PRESENCE.map(function (t) { return [t[1], function () { return line(h(P.StatusDot, { tone: t[0], label: WORD[t[0]] }), WORD[t[0]]); }, 'plx-status-dot--' + t[0], 'tone=' + q(t[0])]; }), { prop: 'tone' }],
      ['Size', [['Sm (6px, default)', function () { return line(h(P.StatusDot, { tone: 'online', label: 'Online' }), 'Online'); }, null, 'size="sm"'],
        ['Md (12px)', function () { return line(h(P.StatusDot, { tone: 'online', size: 'md', label: 'Online' }), 'Online'); }, 'plx-status-dot--md', 'size="md"'],
        ['Lg (16px)', function () { return line(h(P.StatusDot, { tone: 'online', size: 'lg', label: 'Online' }), 'Online'); }, 'plx-status-dot--lg', 'size="lg"']], { prop: 'size' }],
      ['Glyph', [['With its glyph (not color only)', function () { return row.apply(null, PRESENCE.map(function (t) { return h(P.StatusDot, { key: t[0], tone: t[0], size: 'lg', icon: true, label: WORD[t[0]] }); })); }, 'plx-status-dot--glyph', 'icon']], { prop: 'icon' }],
      ['Online, away, busy, do not disturb and offline', function () { return row([['online', 'Online', 'Maya Chen'], ['away', 'Away', 'Alex Kim'], ['busy', 'Busy', 'Sam Ortiz'], ['dnd', 'Do not disturb', 'Ana Silva'], ['offline', 'Offline', 'Luis Romero']].map(function (x) { return h(P.Inline, { key: x[2], gap: 'xs' }, h(P.Avatar, { name: x[2], size: 'xs' }), h(P.Text, null, x[2]), h(P.StatusDot, { tone: x[0], label: x[1] })); })); }]], covers: ['Presence indicator'] };

  /* ── 03 Content › Identity › Presence: Avatar's presence prop ── */
  var presence = { id: 'presence', lab: true, icon: 'person', sec: 'content', sub: 'Identity', leaf: 'Presence', title: 'Presence',
    plenix: 'Avatar, StatusDot', src: 'components/Avatar/Avatar.tsx', also: ['components/StatusDot/StatusDot.tsx'], blocks: ['plx-avatar'], variantClasses: ['plx-avatar--presence'],
    level: 'Component', interaction: 'Static', aliases: ['Presence badge', 'Online indicator', 'Avatar status'],
    text: 'A person’s availability on their avatar: Avatar’s presence prop puts an availability dot at the bottom end corner, ringed in the surface color. The dot grows with the avatar and from 40px carries the availability’s shape.',
    use: ['presence on the avatars of people who can be contacted now: chat, members, assignees', 'label on the avatar when no name is next to it, so the state is read with the name', 'The same five states everywhere: online, away, busy, do not disturb, offline'],
    avoid: ['Presence on avatars of people who cannot be reached in the product (contacts without an account)', 'Presence that is not kept up to date: fall back to offline when unknown', 'A second dot or badge on the same avatar'],
    related: ['avatar', 'availability-indicator', 'content-online-status', 'avatar-group', 'profile-summary'],
    map: [[FLU, 'Avatar (badge)', 'Direct'], [ATL, 'Avatar (presence)', 'Direct'], [SPE, 'Avatar', 'Partial']],
    variantPages: [
      vp('Online presence', 'Presence', 'Online', { variant: 'online' }, 'The online dot at the avatar’s corner.', 'People who can answer now', 'Avatars of people without an account'),
      vp('Away presence', 'Presence', 'Away', { variant: 'away' }, 'The away dot at the avatar’s corner.', 'People who have stepped away', 'A state that is not known: use offline'),
      vp('Busy presence', 'Presence', 'Busy', { variant: 'busy' }, 'The busy dot at the avatar’s corner: solid, nothing cut out.', 'People in a meeting or a call', 'A warning about the person’s work'),
      vp('Do not disturb presence', 'Presence', 'Do not disturb', { variant: 'dnd' }, 'The do not disturb dot at the avatar’s corner: the busy color with a minus cut out from 40px.', 'People focusing with notifications held', 'People who can still be reached: use Busy'),
      vp('Offline presence', 'Presence', 'Offline', { variant: 'offline' }, 'The offline dot at the avatar’s corner, also when the state is not known.', 'People who are signed out', 'Hiding the dot for offline people in a list that shows it for others'),
      vp('Presence on a large avatar', 'Every size', 'XL (48px)', { size: 'xl', variant: 'dnd' }, 'From 40px the dot is 12px or 16px and carries the availability’s shape.', 'Headers and cards that show one person', 'Dense lists: the 6px dot is enough there')
    ],
    examples: [
      ['Presence', PRESENCE.map(function (t) { return [t[1], function () { return h(P.Avatar, { name: 'Maya Chen', size: 'lg', presence: t[0], label: 'Maya Chen' }); }, 'plx-avatar--presence', 'presence=' + q(t[0])]; }), { prop: 'presence' }],
      ['Every size', [['2xs', 20], ['xs', 24], ['sm', 28], ['md', 32], ['lg', 40], ['xl', 48], ['2xl', 64]].map(function (x) {
        return [x[0].toUpperCase() + ' (' + x[1] + 'px)', function () { return h(P.Avatar, { name: 'Alex Kim', size: x[0], presence: 'dnd', label: 'Alex Kim' }); }, 'plx-avatar--presence', 'size=' + q(x[0]) + ' presence="dnd"'];
      }), { prop: 'size' }]] };

  /* ── 03 Content › Identity › Online status: the duplicate of Presence, as words ── */
  var onlineStatus = { id: 'content-online-status', icon: 'person', sec: 'content', sub: 'Identity', leaf: 'Online status', title: 'Online status',
    plenix: 'StatusDot', src: 'components/StatusDot/StatusDot.tsx', level: 'Component', interaction: 'Static', variantClasses: [], docsFrom: 'presence',
    aliases: ['Availability text', 'Last seen'],
    text: 'A person’s availability in words, with the matching dot before it: the same five states as presence (Online, Away, Busy, Do not disturb, Offline), in the same order. The words carry the state, so the dot is decorative; a short note may follow (“In a meeting until 3:00 PM”).',
    use: ['Where an avatar dot is too small or there is no avatar: a profile header, a member row', 'The state names of presence, in sentence case'],
    avoid: ['New state names for the same states', 'A “Last seen” time the person has not agreed to share'],
    related: ['presence', 'availability-indicator', 'status-dot'],
    examples: [['The five states in words', function () { return h(P.Stack, { gap: 'xs' }, PRESENCE.map(function (t) { return h('div', { key: t[0] }, line(h(P.StatusDot, { tone: t[0], label: WORD[t[0]] }), WORD[t[0]] + (t[0] === 'busy' ? ' · In a meeting until 3:00 PM' : ''))); })); }]] };

  /* ── 03 Content › Identity › Avatar group ── */
  var avatarGroup = { id: 'avatar-group', lab: true, icon: 'settings-users', sec: 'content', sub: 'Identity', leaf: 'Avatar group', title: 'Avatar group',
    plenix: 'AvatarGroup', src: 'components/AvatarGroup/AvatarGroup.tsx', level: 'Component', interaction: 'Display', aliases: ['Facepile', 'Avatar stack', 'People stack'],
    text: 'Shows the people of one item as a row of avatars of one size: a stack (overlapped, each ringed in the surface color) or a wrapping grid. Past the maximum, the rest collapse into a +N tile; with onMore, the tile opens the full list.',
    use: ['Owners, collaborators and assignees of a file, a project or a task', 'A label that names the role (“Collaborators”)', 'Set max to fit the room; use onMore to open the full list'],
    avoid: ['Mixing sizes in one group', 'More than one group per row', 'A group as the only way to see who is involved: offer the full list'],
    related: ['avatar', 'presence', 'profile-summary'],
    map: [[FLU, 'AvatarGroup', 'Direct'], [ATL, 'Avatar group', 'Direct'], [SPE, 'Avatar group', 'Partial'], [MAT, 'Avatar (lists)', 'Partial']],
    variantPages: [
      vp('Stacked avatar group', 'Layout', 'Stack (default)', { variant: 'stack' }, 'Avatars overlapped, each ringed in the surface color.', 'A row, a card or a header with little room', 'More than about six people visible: raise max sparingly'),
      vp('Avatar grid', 'Layout', 'Grid', { variant: 'grid' }, 'Avatars spaced and wrapping to more rows.', 'A members panel where every face should show', 'One line in a table row'),
      vp('Avatar group overflow', 'Overflow', 'Max and +N', { content: 'overflow' }, 'Past max, the rest collapse into a +N tile in the data font.', 'Groups whose size varies', 'Hiding people without a way to see them all'),
      vp('Extra-small avatar group', 'Size', 'XS (24px)', { size: 'xs' }, 'A group of 24px avatars that overlap by 4px.', 'Table rows and dense lists', 'A header'),
      vp('Large avatar group', 'Size', 'LG (40px)', { size: 'lg' }, 'A group of 40px avatars that overlap by 8px.', 'A project header', 'Rows of a list'),
      vp('Avatar group with presence', 'Presence', 'With presence', { variant: 'stack', content: 'presence' }, 'Each avatar with its presence dot.', 'People who can be contacted now', 'Groups of contacts without accounts')
    ],
    examples: [
      ['Layout', [['Stack (default)', function () { return h(P.AvatarGroup, { label: 'Collaborators', people: plain, max: 4 }); }, 'plx-avatar-group--stack', 'layout="stack"'],
        ['Grid', function () { return box(240, h(P.AvatarGroup, { label: 'Members', people: plain, layout: 'grid', max: 12, size: 'md' })); }, 'plx-avatar-group--grid', 'layout="grid"']], { prop: 'layout' }],
      ['Overflow', [['Max and +N', function () { return h(P.AvatarGroup, { label: 'Assignees', people: plain, max: 3, onMore: H.noop }); }, null, 'max={3} onMore']], { prop: 'max' }],
      ['Size', [['xs', 24], ['sm', 28], ['md', 32], ['lg', 40]].map(function (x) {
        return [x[0].toUpperCase() + ' (' + x[1] + 'px)' + (x[0] === 'sm' ? ', default' : ''), function () { return h(P.AvatarGroup, { label: 'Collaborators', people: plain, max: 4, size: x[0] }); }, 'plx-avatar-group--' + x[0], 'size=' + q(x[0])];
      }), { prop: 'size' }],
      ['Presence', [['With presence', function () { return h(P.AvatarGroup, { label: 'Team', people: PEOPLE.slice(0, 4), size: 'lg' }); }, null, 'people[].presence']]]] };

  /* ── 03 Content › Identity › Profile summary: Persona ── */
  var profileSummary = { id: 'profile-summary', lab: true, icon: 'settings-profile', sec: 'content', sub: 'Identity', leaf: 'Profile summary', title: 'Profile summary',
    plenix: 'Persona', src: 'components/Persona/Persona.tsx', level: 'Component', interaction: 'Display', aliases: ['Persona', 'User line', 'Avatar item', 'Person'],
    text: 'Shows a person in one compact line (Persona): avatar, name and one detail (a role, a team or an email), plus presence and a role badge when they help. The avatar and text sizes step together from xs to xl; long text is cut with an ellipsis.',
    use: ['The owner of an asset, the author of a comment, a member in a list', 'The name the person chose, then one useful detail', 'href to the person’s profile when there is one'],
    avoid: ['A login ID in place of the name', 'More than one detail line: use a card', 'The avatar’s color as the way to tell people apart'],
    related: ['avatar', 'presence', 'avatar-group', 'badge'],
    map: [[FLU, 'Persona', 'Direct'], [ATL, 'Avatar item', 'Direct'], [SPE, 'Avatar', 'Partial'], [POL, 'Avatar (with text)', 'Partial']],
    variantPages: [
      vp('Profile summary with name only', 'Content', 'Name only', { variant: 'name' }, 'The avatar and the name.', 'Authors and owners in dense rows', 'People who share a name: add a detail'),
      vp('Profile summary with detail', 'Content', 'Name and detail', { variant: 'secondary' }, 'The name over one detail in the muted color.', 'Members, assignees and contacts', 'Two or more details'),
      vp('Profile summary with presence', 'Content', 'With presence', { variant: 'presence' }, 'The presence dot on the avatar; the state is read after the name.', 'People who can be contacted now', 'People without an account'),
      vp('Profile summary with role', 'Content', 'With role', { variant: 'role' }, 'A short role on a neutral badge after the name.', 'The owner or an admin among members', 'A long job title: put it in the detail'),
      vp('Extra-small profile summary', 'Size', 'XS', { size: 'xs' }, 'A 24px avatar with 12px and 11px text.', 'Table cells and dense lists', 'A page header'),
      vp('Extra-large profile summary', 'Size', 'XL', { size: 'xl' }, 'A 48px avatar with 15px and 13px text.', 'A person card or a page header', 'Lists of many people')
    ],
    examples: [
      ['Content', [['Name only', function () { return h(P.Persona, { name: 'Maya Chen' }); }, null, 'name'],
        ['Name and detail', function () { return h(P.Persona, { name: 'Maya Chen', secondary: 'Designer · Brand team' }); }, null, 'secondary'],
        ['With presence', function () { return h(P.Persona, { name: 'Alex Kim', secondary: 'alex.kim@example.org', presence: 'away', color: 'green' }); }, null, 'presence="away"'],
        ['With role', function () { return h(P.Persona, { name: 'Jordan Avery', secondary: 'Parish office', role: 'Owner', color: 'brown' }); }, null, 'role="Owner"']]],
      ['Size', [['xs', 24], ['sm', 28], ['md', 32], ['lg', 40], ['xl', 48]].map(function (x) {
        return [x[0].toUpperCase() + (x[0] === 'md' ? ' (default)' : ''), function () { return h(P.Persona, { name: 'Maya Chen', secondary: 'Designer', presence: 'online', size: x[0] }); }, 'plx-persona--' + x[0], 'size=' + q(x[0])];
      }), { prop: 'size' }]] };

  /* ── 08 Feedback › Loading and progress › Circular progress: ProgressCircle ── */
  /* ── 03 Content › Identity › Entity title: EntityTitle (issue 803) ── */
  var ROW = function (child) { return box(320, h(P.RowButton, { onClick: function () {} }, child)); };   // a list row that opens the item
  var CARD = function (child) { return box(280, h(P.Card, null, child)); };
  var entityTitle = { id: 'entity-title', icon: 'document', sec: 'content', sub: 'Identity', leaf: 'Entity title', title: 'Entity title',
    plenix: 'EntityTitle', src: 'components/EntityTitle/EntityTitle.tsx', level: 'Component', interaction: 'Display', aliases: ['Item title', 'Title line', 'Object title', 'Resource name'],
    text: 'Names an item in one compact line (EntityTitle): an icon, the title on one line cut with “…”, a subtitle under it and a tag after it, or a placeholder while it loads. It sets no height or padding of its own, so it sits in a list row or a card without changing their height rules. EntityHeader is the full page header.',
    use: ['The name of a file, a folder, a record or a page in a list row or on a card', 'One useful detail as the subtitle: a type, a date, a place', 'A status tag as a Badge with its icon; a category as a Tag'],
    avoid: ['A page header: use EntityHeader', 'Actions inside it: put them on the row or the card', 'An icon in a box: the icon is plain'],
    related: ['profile-summary', 'badge', 'tag', 'skeleton', 'card'],
    map: [[POL, 'Resource item (name)', 'Partial'], [ATL, 'Object tile (title)', 'Partial'], [FLU, 'Persona (non-person)', 'Partial']],
    examples: [
      ['Content', [['Title only', function () { return ROW(h(P.EntityTitle, { icon: 'folder', title: 'Parish photos' })); }, null, 'title'],
        ['With subtitle', function () { return ROW(h(P.EntityTitle, { icon: 'document', title: 'Easter flyer.pdf', subtitle: 'Edited 2 hours ago' })); }, 'plx-entity-title--subtitle', 'subtitle'],
        ['With a category tag', function () { return ROW(h(P.EntityTitle, { icon: 'folder', title: 'Parish photos', subtitle: '128 items', tag: 'Archive' })); }, null, 'tag="Archive"'],
        ['With a status badge', function () { return ROW(h(P.EntityTitle, { icon: 'document', title: 'Budget 2027', subtitle: 'Finance', tag: { label: 'Approved', tone: 'success', icon: 'check' } })); }, null, 'tag={{ label, tone, icon }}']]],
      ['Fit', [['A long title, cut with “…”', function () { return ROW(h(P.EntityTitle, { icon: 'document', title: 'The annual report of the parish council for the year two thousand and twenty-six.pdf', subtitle: 'Council · PDF · 4.2 MB' })); }, null, 'title'],
        ['In a card, as a heading', function () { return CARD(h(P.EntityTitle, { icon: 'folder', title: 'Feast day icons', subtitle: '42 images', tag: { label: 'In review', tone: 'waiting', icon: 'clock' }, level: 3 })); }, null, 'level={3}']]],
      ['State', [['Loading', function () { return ROW(h(P.EntityTitle, { icon: 'document', subtitle: true, loading: true })); }, 'is-loading', 'loading']]]] };

  var TONES = [['info', 'Info (default)'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger'], ['neutral', 'Neutral']];
  var circularProgress = { id: 'circular-progress', lab: true, icon: 'refresh', sec: 'feedback', sub: 'Loading and progress', leaf: 'Circular progress', title: 'Circular progress',
    plenix: 'ProgressCircle', src: 'components/ProgressCircle/ProgressCircle.tsx', level: 'Component', interaction: 'Feedback', aliases: ['Progress ring', 'Circular progress indicator', 'Progress circle', 'Donut progress'],
    text: 'How far a task has come, as a ring: a faint track and an arc in a tone that fills clockwise from the top, or turns while the amount is unknown. Three sizes (16, 24 and 48px); the largest can show the percent in its center, in the data font.',
    use: ['Short waits in tight places: inside a card, beside a file name, in a tile', 'value as soon as the amount is known; label that says what loads', 'size="lg" with showValue where the percent matters'],
    avoid: ['A long task with room for a bar: use Progress bar', 'An unknown wait inside a button: use Spinner', 'Several rings for one task'],
    related: ['progress-bar', 'spinner'],
    map: [[MAT, 'Progress indicators (circular)', 'Direct'], [SPE, 'Progress circle', 'Direct'], [FLU, 'Spinner', 'Partial'], [CAR, 'Loading', 'Partial'], [ATL, 'Spinner', 'Partial'], [POL, 'Spinner', 'Partial']],
    variantPages: [
      vp('Determinate circular progress', 'Amount', 'Known (determinate)', { content: 'known' }, 'The arc fills clockwise from the top to the amount done.', 'Uploads and exports of a known size', 'Work whose amount is unknown'),
      vp('Indeterminate circular progress', 'Amount', 'Unknown (indeterminate)', { content: 'unknown' }, 'A quarter arc turns until the amount is known; it stands still for people who ask for less motion.', 'Preparing, connecting, waiting for a server', 'Work whose amount is known: give value'),
      vp('Circular progress with value', 'Amount', 'With the value (lg)', { size: 'lg', content: 'value' }, 'The whole percent in the ring’s center, in the data font.', 'A panel or a tile where the number matters', 'Sm and Md: there is no room'),
      vp('Small circular progress', 'Size', 'SM (16px)', { size: 'sm' }, 'A 16px ring beside a line of text.', 'A file row or a list item', 'A whole panel loading'),
      vp('Large circular progress', 'Size', 'LG (48px)', { size: 'lg' }, 'A 48px ring with a heavier stroke.', 'A panel, a tile or an empty region', 'Inside controls'),
      vp('Success circular progress', 'Tone', 'Success', { variant: 'success' }, 'The arc in the success color: a good amount.', 'Goals met, a healthy quota', 'Work under way: use Info'),
      vp('Danger circular progress', 'Tone', 'Danger', { variant: 'danger' }, 'The arc in the danger color: an amount over a limit.', 'A quota exceeded', 'A failure of the work itself: say so with a Notice')
    ],
    examples: [
      ['Amount', [['Known (determinate)', function () { return h(P.ProgressCircle, { value: 62, label: 'Uploading 3 files' }); }, null, 'value={62}'],
        ['Unknown (indeterminate)', function () { return h(P.ProgressCircle, { label: 'Loading assets' }); }, null, '(no value)'],
        ['With the value (lg)', function () { return h(P.ProgressCircle, { value: 62, size: 'lg', showValue: true, label: 'Uploading 3 files' }); }, null, 'showValue']]],
      ['Size', [['sm', 16], ['md', 24], ['lg', 48]].map(function (x) {
        return [x[0].toUpperCase() + ' (' + x[1] + 'px)' + (x[0] === 'md' ? ', default' : ''), function () { return h(P.ProgressCircle, { value: 62, size: x[0], label: 'Uploading' }); }, 'plx-progress-circle--' + x[0], 'size=' + q(x[0])];
      }), { prop: 'size' }],
      ['Tone', TONES.map(function (t) { return [t[1], function () { return h(P.ProgressCircle, { value: 62, size: 'lg', tone: t[0], label: 'Quota used' }); }, 'plx-progress-circle--' + t[0], 'tone=' + q(t[0])]; }), { prop: 'tone' }]] };

  /* ── 03 Content › Images and media › QR code: QRCode ── */
  var URL = 'https://plenix.lighthouseway.org/notes/';
  var qrCode = { id: 'qr-code', lab: true, icon: 'grid-3x2', sec: 'content', sub: 'Images and media', leaf: 'QR code', title: 'QR code',
    plenix: 'QRCode, qrEncode', src: 'components/QRCode/QRCode.tsx', also: ['utils/qr.ts'], blocks: ['plx-qr-code'], level: 'Component', interaction: 'Static', aliases: ['QR', 'Matrix code', 'Scan code'],
    text: 'A QR code that moves a link or a short value from the screen to a phone. Plenix’s own encoder (qrEncode, no dependency) makes the matrix, drawn as one SVG path on a light plate with a quiet zone of four modules. The plate and the modules keep their colors in dark mode, because scanners read dark on light. A caption says what scanning does, and the value is shown as text.',
    use: ['Opening a page on a phone, pairing a device, sharing a link in person', 'A caption that says what happens (“Scan to open on your phone”) and showValue, or a copy action, for people who cannot scan', 'level="H" when the code may be damaged or printed small; a logo needs level H, which is set for you'],
    avoid: ['A QR code as the only way to reach the value', 'Inverting the colors in dark mode: many scanners fail', 'Long values: the code grows dense and hard to scan; shorten the link'],
    related: ['image', 'link'],
    map: [[MAT, 'Images (guidance)', 'Partial'], [SPE, 'Image', 'Partial']],
    variantPages: [
      vp('Small QR code', 'Size', 'SM (96px)', { size: 'sm' }, 'A 96px code with its quiet zone.', 'A side panel or a dialog with little room', 'Codes people scan from across a room'),
      vp('Large QR code', 'Size', 'LG (240px)', { size: 'lg' }, 'A 240px code with its quiet zone.', 'A pairing screen or a page made to be scanned', 'A list or a card'),
      vp('QR code at level L', 'Error correction', 'L (7%)', { content: 'l' }, 'The least error correction: the sparsest code for a value.', 'Codes on a clean screen', 'Print or small codes: use M or higher'),
      vp('QR code at level Q', 'Error correction', 'Q (25%)', { content: 'q' }, 'A quarter of the code can be lost and it still scans.', 'Codes that may be printed', 'Long values: the code grows dense'),
      vp('QR code at level H', 'Error correction', 'H (30%)', { content: 'h' }, 'The most error correction, also what a logo needs.', 'Print, signs and codes with a logo', 'Long values on a small code'),
      vp('QR code with logo space', 'Logo space', 'With logo space', { content: 'logo' }, 'The center modules left out for a mark, encoded at level H so it still scans.', 'A code that should show the product mark', 'A logo larger than the cleared center'),
      vp('QR code on accent', 'Surface', 'On accent', { variant: 'on-accent' }, 'The code keeps its light plate on the accent; the caption and value take the accent colors.', 'A welcome or pairing panel on the accent', 'Recoloring the code to match the accent'),
      vp('QR code with caption', 'Caption', 'With caption and value', { content: 'caption' }, 'What scanning does, then the value in the data font.', 'Every code people meet without other context', 'A caption that only says “Scan me”')
    ],
    examples: [
      ['Size', [['sm', 96], ['md', 160], ['lg', 240]].map(function (x) {
        return [x[0].toUpperCase() + ' (' + x[1] + 'px)' + (x[0] === 'md' ? ', default' : ''), function () { return h(P.QRCode, { value: URL, size: x[0], label: 'QR code: open Notes on your phone' }); }, 'plx-qr-code--' + x[0], 'size=' + q(x[0])];
      }), { prop: 'size' }],
      ['Error correction', [['L', '7%'], ['M', '15%, default'], ['Q', '25%'], ['H', '30%']].map(function (x) {
        return [x[0] + ' (' + x[1] + ')', function () { return h(P.QRCode, { value: URL, size: 'sm', level: x[0], label: 'QR code at level ' + x[0] }); }, null, 'level=' + q(x[0])];
      }), { prop: 'level' }],
      ['Logo space', [['With logo space', function () { return h(P.QRCode, { value: URL, label: 'QR code: open Notes on your phone', logo: h(P.BrandMark, { size: 'md', label: 'Plenix' }) }); }, null, 'logo']], { prop: 'logo' }],
      ['Caption', [['With caption and value', function () { return h(P.QRCode, { value: URL, label: 'QR code: open Notes on your phone', caption: 'Scan to open Notes on your phone', showValue: true }); }, null, 'caption showValue']]],
      ['Surface', [['On accent', function () { return onAccent(h(P.QRCode, { value: URL, size: 'sm', onAccent: true, label: 'QR code: open Notes on your phone', caption: 'Scan to continue on your phone' })); }, 'plx-qr-code--on-accent', 'onAccent']], { prop: 'onAccent' }]] };

  /* ── 03 Content › Metadata › Version label: VersionLabel ── */
  var versionLabel = { id: 'version-label', lab: true, icon: 'tags', sec: 'content', sub: 'Metadata', leaf: 'Version label', title: 'Version label',
    plenix: 'VersionLabel', src: 'components/VersionLabel/VersionLabel.tsx', level: 'Component', interaction: 'Static', aliases: ['Version number', 'Revision', 'Release label'],
    text: 'Shows which version of an item this is, in the data font: a number (v12) for an item’s saved versions or a semantic version (2.1.0) for releases, with a qualifier (Latest, Draft) on a neutral badge when it helps.',
    use: ['Saved versions of an asset or a document; release numbers', 'status="latest" on one version at a time; "draft" for one not yet published', 'size="sm" in table rows and dense lists; href to the version history'],
    avoid: ['Mixing v3 and 3.0.0 for the same kind of item', 'More than one Latest', 'A version written in the body font'],
    related: ['badge', 'property-list', 'activity-stream'],
    map: [[ATL, 'Lozenge (version)', 'Partial'], [CAR, 'Tag', 'Partial']],
    variantPages: [
      vp('Numbered version label', 'Format', 'Number (v12)', { variant: 'number' }, 'A whole number with the v prefix, read as “Version 12”.', 'An item’s saved versions', 'Releases: use the semantic version'),
      vp('Semantic version label', 'Format', 'Semantic version (2.1.0)', { variant: 'semver' }, 'Major, minor and patch, as written.', 'Releases, packages and APIs', 'Saved versions of a document'),
      vp('Latest version label', 'Qualifier', 'Latest', { variant: 'latest' }, 'The newest version, marked Latest on a neutral badge.', 'The one current version in a history', 'More than one version at a time'),
      vp('Draft version label', 'Qualifier', 'Draft', { variant: 'draft' }, 'A version not yet published, marked Draft.', 'Work in progress people may not see yet', 'A published version'),
      vp('Compact version label', 'Size', 'Sm (compact)', { size: 'sm' }, 'Smaller text and a 16px badge.', 'Table rows and dense lists', 'A page header')
    ],
    examples: [
      ['Format', [['Number (v12)', function () { return h(P.VersionLabel, { version: 12 }); }, null, 'version={12}'],
        ['Semantic version (2.1.0)', function () { return h(P.VersionLabel, { version: '2.1.0' }); }, null, 'version="2.1.0"']]],
      ['Qualifier', [['Latest', function () { return h(P.VersionLabel, { version: 12, status: 'latest' }); }, null, 'status="latest"'],
        ['Draft', function () { return h(P.VersionLabel, { version: 13, status: 'draft' }); }, null, 'status="draft"']], { prop: 'status' }],
      ['Size', [['Md (default)', function () { return h(P.VersionLabel, { version: 12, status: 'latest' }); }, 'plx-version-label--md', 'size="md"'],
        ['Sm (compact)', function () { return h(P.VersionLabel, { version: 12, status: 'latest', size: 'sm' }); }, 'plx-version-label--sm', 'size="sm"']], { prop: 'size' }],
      ['Linked', [['To the version history', function () { return h(P.VersionLabel, { version: 12, status: 'latest', href: '#history' }); }, null, 'href']]]] };

  return [availability, presence, onlineStatus, avatarGroup, profileSummary, entityTitle, circularProgress, qrCode, versionLabel];
});
