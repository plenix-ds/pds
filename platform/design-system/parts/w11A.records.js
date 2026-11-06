/* Plenix design system · library part w11A (wave 11, lane A): files and the account. File (File, and its Folder leaf) and
   FileRow (File row) in 12 Specialized; in 10 Patterns › Authentication and permissions, Auth (Sign in, and its leaves
   Sign up, Password reset, Multi-factor authentication, Single sign-on and Account recovery: one frame, six forms),
   SessionTimeout (Session timeout), RoleManager (Roles) and ConnectedAccounts (Account connection). Shortcut hints is
   answered in w00A (keyboard-hint). Every color is an existing role; statuses are Badges with their icon. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var AUTH = 'Authentication and permissions', FILES = 'Files, assets, and DAM';

  /* ── the sample data ── */
  var FILES_DATA = [
    { id: 'f1', name: 'Letterhead 2026.pdf', size: 1240000, modified: '2026-10-14' },
    { id: 'f2', name: 'Cross 014.png', size: 482000, modified: '2026-10-12' },
    { id: 'f3', name: 'Vestry minutes, October.docx', size: 88000, modified: '2026-10-09' },
    { id: 'f4', name: 'Choir rota.xlsx', size: 31000, modified: '2026-10-02' },
    { id: 'f5', name: 'Brand kit', kind: 'folder', count: 24, modified: '2026-09-28' }
  ];
  var TYPES = ['Letterhead.pdf', 'Cross 014.png', 'Window 03.jpg', 'Border 007.svg', 'Poster.psd', 'Logo.ai', 'Archive 1919.zip', 'Minutes.docx', 'Rota.xlsx', 'theme.css', 'Notes'];
  var PEOPLE = [
    { value: 'mc', label: 'Maya Chen', description: 'maya@example.org' },
    { value: 'ak', label: 'Alex Kim', description: 'alex@example.org' },
    { value: 'rm', label: 'Jordan Avery', description: 'office@example.com' },
    { value: 'pn', label: 'Priya Nair', description: 'priya@example.org' },
    { value: 'jw', label: 'Jonas Weber', description: 'jonas@print.example' }
  ];
  var PERMISSIONS = [
    { id: 'view', label: 'View assets', group: 'Assets' }, { id: 'download', label: 'Download originals', group: 'Assets' },
    { id: 'upload', label: 'Upload and edit', group: 'Assets' }, { id: 'delete', label: 'Delete assets', group: 'Assets' },
    { id: 'comment', label: 'Comment', group: 'Collaboration' }, { id: 'share', label: 'Share with people outside', group: 'Collaboration' },
    { id: 'members', label: 'Manage members and roles', group: 'Workspace' }, { id: 'billing', label: 'See billing', group: 'Workspace' }
  ];
  var ROLES = [
    { id: 'owner', builtIn: 'owner', name: 'Owner', description: 'Can do everything, including managing members and billing.', required: true, members: ['rm'],
      permissions: ['view', 'download', 'upload', 'delete', 'comment', 'share', 'members', 'billing'] },
    { id: 'editor', builtIn: 'editor', name: 'Editor', description: 'Can upload, edit and share assets.', members: ['mc', 'ak'], permissions: ['view', 'download', 'upload', 'comment', 'share'] },
    { id: 'viewer', builtIn: 'viewer', name: 'Viewer', description: 'Can view, download and comment.', members: ['pn'], permissions: ['view', 'download', 'comment'] },
    { id: 'print', name: 'Print vendor', category: 'teal', description: 'Can download originals for print, nothing else.', members: ['jw'], permissions: ['view', 'download'] }
  ];
  var ACCOUNTS = [
    { id: 'drive', service: 'Google Drive', icon: 'folder', description: 'Open and save files from your Drive.', status: 'connected', account: 'maya@example.org',
      connectedAt: '2026-10-02', scopes: ['See and open the files you choose', 'Save new files to a Plenix folder'], loses: 'Files linked from Drive stop opening in Plenix.' },
    { id: 'mail', service: 'Mailchimp', icon: 'mail', description: 'Send newsletters with assets from the library.', status: 'error', account: 'parish-office', connectedAt: '2026-08-21',
      error: 'Access expired on Oct 12. Reconnect to keep sending.', scopes: ['Create campaigns', 'Upload images to your content studio'] },
    { id: 'print', service: 'Print shop', icon: 'download-tray', description: 'Send print-ready files straight to the printer.', status: 'disconnected',
      scopes: ['Receive the files you send for print', 'See your order history'] }
  ];
  var METHODS = [{ id: 'app', kind: 'app', label: 'Authenticator app', detail: 'A code from the app on your phone' },
    { id: 'sms', kind: 'sms', label: 'Text message', detail: 'to the phone ending 42' }, { id: 'key', kind: 'key', label: 'Security key', detail: 'A key you plug in or hold near' }];

  /* ── live examples (each a small component: the spec renders an example as one) ── */
  var Files = function (p) {
    var list = use(p.files || FILES_DATA), sel = use(p.selected || []);
    var others = function (f) { return list[0].filter(function (x) { return x.id !== f.id; }).map(function (x) { return x.name; }); };
    return box(p.width || 720, h(P.FileRowList, { label: 'Files in Parish office' }, list[0].map(function (f) {
      var on = sel[0].indexOf(f.id) >= 0;
      return h(P.FileRow, Object.assign({ key: f.id, as: 'li', file: f, owner: p.owner ? 'Maya Chen' : undefined, onOpen: noop,
        selectable: p.selectable !== false, selected: on, onSelectChange: function (c) { sel[1](c ? sel[0].concat(f.id) : sel[0].filter(function (x) { return x !== f.id; })); } },
        p.actions === false ? {} : { onDownload: noop, names: others(f), onRename: function (n) { list[1](list[0].map(function (x) { return x.id === f.id ? Object.assign({}, x, { name: n }) : x; })); },
          onDelete: function () { list[1](list[0].filter(function (x) { return x.id !== f.id; })); } }));
    })));
  };
  var Uploads = function (p) {
    var pct = use(p.start || 18), failed = use(false);
    React.useEffect(function () {
      if (pct[0] >= 100) return undefined;
      var id = setTimeout(function () { pct[1](Math.min(100, pct[0] + 7)); }, 600);
      return function () { clearTimeout(id); };
    }, [pct[0]]);
    return box(p.width || 720, h(P.FileRowList, { label: 'Uploads' },
      h(P.FileRow, { as: 'li', file: { name: 'Window 03.jpg', size: 3400000 }, progress: pct[0] >= 100 ? undefined : pct[0], progressLabel: 'Uploading', onCancel: noop, onDownload: pct[0] >= 100 ? noop : undefined }),
      h(P.FileRow, { as: 'li', file: { name: 'Archive 1919.zip', size: 52000000 }, progress: 64, progressLabel: 'Uploading', onCancel: noop }),
      failed[0] ? null : h(P.FileRow, { as: 'li', file: { name: 'Border 007.svg', size: 96000 }, error: 'The connection was lost.', onRetry: function () { failed[1](true); } })));
  };
  var Card = function (p) { return box(p.width || 400, h(P.Auth, { title: p.title, description: p.description, footer: p.footer }, p.children)); };
  var SignIn = function (p) {
    var err = use(p.error || ''), busy = use(false);
    return h(Card, { title: 'Sign in to Plenix', description: 'Use your Plenix user name or email.', width: p.width },
      h(P.SignInForm, Object.assign({ error: err[0], busy: busy[0], defaultIdentifier: p.identifier, forgot: { onClick: noop }, signUp: { onClick: noop },
        onSubmit: function () { busy[1](true); setTimeout(function () { busy[1](false); err[1]('Email or password is incorrect. Check both and try again.'); }, 700); } }, p.props || {})));
  };
  var SignUp = function (p) {
    var done = use(false);
    return h(Card, { title: 'Create your Plenix account', description: 'For the library of Lighthouse Way.' },
      done[0] ? h(P.Notice, { tone: 'success' }, 'We sent a link to confirm your email. Open it to finish.')
        : h(P.SignUpForm, Object.assign({ signIn: { onClick: noop }, terms: ['I agree to the ', h(P.Link, { key: 'l', href: 'https://lighthouseway.org/terms', external: true }, 'terms of use')],
          onSubmit: function () { done[1](true); } }, p.props || {})));
  };
  var Reset = function (p) {
    return h(Card, { title: p.step === 'new' || p.step === 'done' ? 'Choose a new password' : 'Reset your password', description: p.step === 'new' ? 'For maya@example.org.' : 'We’ll email you a link to choose a new one.' },
      h(P.PasswordResetForm, Object.assign({ defaultStep: p.step, signIn: { onClick: noop }, onResend: noop }, p.props || {})));
  };
  var Mfa = function (p) {
    var err = use('');
    return h(Card, { title: 'Two-step verification', description: 'One more step to keep your account safe.' },
      h(P.MfaChallenge, Object.assign({ methods: p.methods || METHODS, error: err[0], recovery: { onClick: noop }, onResend: noop, resendAfter: 30,
        onVerify: function (code) { err[1](code === '123456' ? '' : 'That code didn’t work. Check the newest code in your app; codes change every 30 seconds.'); } }, p.props || {})));
  };
  var Sso = function (p) {
    var going = use(null);
    return h(Card, { title: 'Sign in to Plenix' },
      h(P.SsoButtons, Object.assign({ providers: [{ id: 'google', label: 'Google' }, { id: 'microsoft', label: 'Microsoft' }], organization: true, redirecting: going[0],
        onProvider: function (pr) { going[1](pr.label); setTimeout(function () { going[1](null); }, 2400); }, onOrganization: function () { going[1]('Okta'); setTimeout(function () { going[1](null); }, 2400); } }, p.props || {})));
  };
  var Recovery = function (p) {
    return h(Card, { title: 'Recover your account', description: 'For maya@example.org.' },
      h(P.AccountRecovery, Object.assign({ defaultStep: p.step, admin: 'Jordan Avery (office@example.com)', onFactor: noop, onSetUp: noop, back: { onClick: noop } }, p.props || {})));
  };
  var Timeout = function (p) {
    var st = use('active'), at = use(0);
    var warn = function () { at[1](Date.now() + (p.seconds || 90) * 1000); st[1](p.state || 'warning'); };
    return h(P.Stack, { gap: 'sm' },
      row(h(P.Button, { onClick: warn }, p.state === 'signed-out' ? 'Show the signed-out message' : 'Show the warning'), h(P.Text, { variant: 'secondary' }, p.hint || 'The warning counts down from 1:30; at zero the signed-out message follows.')),
      h(P.SessionTimeout, { state: st[0], expiresAt: at[0], idleMinutes: 30, onStay: function () { st[1]('active'); }, onSignOut: function () { st[1]('signed-out'); },
        onExpire: function () { st[1]('signed-out'); }, onSignIn: function () { st[1]('active'); } }));
  };
  var TimeoutInline = function (p) { return box(400, h(P.SessionTimeout, { state: p.state, inline: true, remaining: 105, idleMinutes: 30, onStay: noop, onSignOut: noop, onSignIn: noop })); };
  var Idle = function () {
    var s = P.useSessionTimeout({ timeout: 40, warnBefore: 30 });
    return h(P.Stack, { gap: 'sm' }, h(P.Text, { variant: 'secondary' }, 'A 40-second session: stop moving the pointer and typing, and the warning opens 30 seconds before the end.'),
      h(P.Text, null, 'State: ', h(P.Text, { variant: 'data' }, s.state)),
      h(P.SessionTimeout, { state: s.state, expiresAt: s.expiresAt, idleMinutes: 1, onStay: s.stay, onSignOut: s.signOut, onExpire: s.signOut, onSignIn: s.stay }));
  };
  var Roles = function (p) {
    var r = use(ROLES);
    return box(p.width || 720, h(P.RoleManager, { label: 'Roles in Lighthouse Way', roles: r[0], permissions: PERMISSIONS, people: PEOPLE, onChange: r[1], defaultView: p.view || 'list', defaultRoleId: p.role || 'editor', readOnly: p.readOnly }));
  };
  var Accounts = function (p) {
    var a = use(p.accounts || ACCOUNTS);
    var set = function (id, patch) { a[1](a[0].map(function (x) { return x.id === id ? Object.assign({}, x, patch) : x; })); };
    var later = function (id, patch) { set(id, { busy: true }); setTimeout(function () { set(id, Object.assign({ busy: false }, patch)); }, 900); };
    return box(p.width || 600, h(P.ConnectedAccounts, { accounts: a[0],
      onConnect: function (x) { later(x.id, { status: 'connected', account: 'maya@example.org', connectedAt: '2026-10-15' }); },
      onReconnect: function (x) { later(x.id, { status: 'connected', error: undefined, connectedAt: '2026-10-15' }); },
      onDisconnect: function (x) { set(x.id, { status: 'disconnected', account: undefined, connectedAt: undefined }); } }));
  };

  return [
    /* ── 12 Specialized › Files, assets, and DAM › File: File ── */
    { id: 'file', lab: true, icon: 'document', sec: 'specialized', sub: FILES, leaf: 'File', title: 'File',
      plenix: 'File, fileIcon, fileExtension', src: 'components/File/File.tsx', level: 'Component', interaction: 'Navigation',
      aliases: ['File item', 'File chip', 'Attachment', 'Document', 'File object'],
      text: 'A file or a folder as one object, the same everywhere it appears: its type’s icon (or a small picture), its name as stored, and its facts in the data font (the size and the date for a file, the number of items for a folder). When a long name is cut, the extension stays in view. It is a line inside rows, lists and pickers, and a chip for attachments and a field’s value. With href the name is a link to the file’s page; with onOpen it is a button that opens it.',
      use: ['Every place a stored file shows as an object: rows, attachments, pickers, search results', 'The real name with its extension; the size from bytes (formatBytes) and the date from the data', 'A chip for attachments in a message or a form’s value', 'fileIcon(name, type) for the type icon anywhere else'],
      avoid: ['Managed assets with rights and renditions: the asset card', 'A link to a web page: Link', 'Rewriting or shortening the name: the base is cut, the extension stays', 'Color as the only sign of the type: the icon and the extension say it'],
      related: ['folder', 'file-row', 'file-input', 'thumbnail'],
      map: [[CAR, 'File uploader item', 'Partial'], [ATL, 'Object (file)', 'Partial'], [POL, 'Thumbnail', 'Partial'], [SPE, 'Asset', 'Partial'], [FLU, 'Attachment', 'Partial']],
      variantPages: [
        vp('File', 'Kind', 'File (default)', { variant: 'file' }, 'The type’s icon, the name in the data font (its extension always in view) and the size and date.', 'A stored file in a row, a list or a picker', 'A folder: kind="folder"'),
        vp('Folder kind', 'Kind', 'Folder', { variant: 'folder' }, 'The folder icon, the name in the UI font, “folder” for screen readers, and how many items it holds.', 'Folders in lists, pickers and paths', 'A collection that is not a place: a tag or a collection card'),
        vp('File line', 'Appearance', 'Line (default)', { variant: 'file' }, 'No frame: the file sits in its row or list.', 'Rows, lists, tables’ name cells', 'A file standing alone as a value: the chip'),
        vp('File chip', 'Appearance', 'Chip', { variant: 'chip' }, 'A framed chip at the standard control height: the field’s border and the default surface.', 'Attachments in a message, a form’s chosen file', 'Rows of a list: the line'),
        vp('File type icons', 'Details', 'By type icon', { variant: 'types' }, 'The icon shows the type: PDF, PNG, JPG, SVG, PSD, AI and ZIP have their own icons; documents, tables, code and pictures get one per kind; any other file gets the plain document icon.', 'Lists of mixed files', 'Telling types apart by color'),
        vp('File with size', 'Details', 'With size', { variant: 'size' }, 'The size from bytes (1.2 MB) and the date (Oct 14) after the name, muted, in the data font.', 'Uploads, attachments, pickers where size matters', 'Rows that show the size in their own cell: FileRow')
      ],
      examples: [
        ['Kind', [
          ['File (default)', function () { return h(P.File, { name: 'Letterhead 2026.pdf', size: 1240000, modified: '2026-10-14' }); }, 'plx-file--file', 'kind=' + q('file')],
          ['Folder', function () { return h(P.File, { kind: 'folder', name: 'Brand kit', count: 24, onOpen: noop }); }, 'plx-file--folder', 'kind=' + q('folder')]], { prop: 'kind' }],
        ['Appearance', [
          ['Line (default)', function () { return h(P.File, { name: 'Cross 014.png', size: 482000 }); }, 'plx-file--line', 'appearance=' + q('line')],
          ['Chip', function () { return row(h(P.File, { appearance: 'chip', name: 'Vestry minutes, October.docx', size: 88000 }), h(P.File, { appearance: 'chip', name: 'Choir rota.xlsx', size: 31000 })); }, 'plx-file--chip', 'appearance=' + q('chip')]], { prop: 'appearance' }],
        ['Details', [
          ['By type icon', function () { return h(P.Stack, { gap: 'xs' }, TYPES.map(function (n) { return h(P.File, { key: n, name: n }); })); }, null, 'fileIcon(name, type)'],
          ['With size', function () { return h(P.Stack, { gap: 'xs' }, h(P.File, { name: 'Archive 1919.zip', size: 52000000, modified: '2026-10-01' }), h(P.File, { name: 'Window 03.jpg', size: 3400000, modified: '2026-10-15' })); }, null, 'size modified']]],
        ['A long name: the base name is cut, the extension stays', function () { return box(240, h(P.File, { name: 'Easter_banner_north-aisle_final-print_v3.pdf', size: 8200000, onOpen: noop })); }],
        ['Opening it: a link to its page (href) or a button that opens it (onOpen)', function () { return h(P.Stack, { gap: 'xs' }, h(P.File, { name: 'Letterhead 2026.pdf', href: '#/specialized/file' }), h(P.File, { name: 'Cross 014.png', onOpen: noop })); }]] },

    /* ── 12 Specialized › Files, assets, and DAM › Folder: File kind="folder" ── */
    { id: 'folder', icon: 'folder', sec: 'specialized', sub: FILES, leaf: 'Folder', title: 'Folder',
      plenix: 'File (kind="folder")', src: 'components/File/File.tsx', level: 'Component', interaction: 'Navigation', variantClasses: [], statesFrom: ['file'],
      aliases: ['Directory', 'Container', 'Location'],
      text: 'A folder is one place that holds files and other folders. It shows the folder icon (the open folder while it is open in a tree), its name in the UI font, and how many items it holds in the data font; screen readers also hear “folder”. Opening it moves into it; in a tree it expands.',
      use: ['Content with one owning place in a hierarchy', 'File browsers, trees and pickers: where an item lives', 'count for what it holds; open in a tree while it is expanded'],
      avoid: ['An item in many groups: tags or collections', 'Folders deeper than people can follow: flatten, or add search', 'Repeating the parent’s name in the child’s'],
      related: ['file', 'file-row', 'tree-view'],
      map: [[CAR, 'Tree view (folders)', 'Partial'], [SPE, 'Tree view', 'Partial'], [FLU, 'Tree (folders)', 'Partial'], [HIG, 'File management', 'Partial']],
      examples: [
        ['A folder: its icon, its name and its count', function () { return h(P.Stack, { gap: 'xs' }, h(P.File, { kind: 'folder', name: 'Brand kit', count: 24, onOpen: noop }), h(P.File, { kind: 'folder', name: 'Archive', count: 1, onOpen: noop }), h(P.File, { kind: 'folder', name: 'Easter 2026', count: 0, open: true })); }],
        ['Folders and files in one list', function () { return h(Files, { files: [FILES_DATA[4], { id: 'f6', name: 'Weddings', kind: 'folder', count: 112, modified: '2026-10-11' }, FILES_DATA[0], FILES_DATA[1]], actions: false, selectable: false }); }],
        ['In a tree: the open folder icon while it is expanded', function () { return box(320, h(P.Tree, { label: 'Folders', defaultExpanded: ['lib'], nodes: [{ id: 'lib', label: 'Library', icon: 'folder', children: [{ id: 'bk', label: 'Brand kit', icon: 'folder' }, { id: 'ar', label: 'Archive', icon: 'folder' }] }] })); }]] },

    /* ── 12 Specialized › Files, assets, and DAM › File row: FileRow ── */
    { id: 'file-row', lab: true, icon: 'list-lines', sec: 'specialized', sub: FILES, leaf: 'File row', title: 'File row',
      plenix: 'FileRow, FileRowList', src: 'components/FileRow/FileRow.tsx', level: 'Component', interaction: 'Selection',
      aliases: ['File list item', 'Upload row', 'Attachment row', 'File line'],
      text: 'One file as a line in a list: a checkbox that selects it; the File (its icon and its name, which opens it); its facts in their own cells (the size and the date in the data font, the owner, a status Badge); then its actions: Download, and More actions with Rename… (the rename dialog) and Delete (the delete flow). While a file moves, the row shows its progress with Cancel; a failed file says why, with Try again.',
      use: ['Uploads, downloads, attachments and pickers: a FileRowList of rows', 'selectable for actions on several files at once', 'onRename and onDelete: they bring the rename dialog and the delete flow', 'progress and error for each file of a transfer'],
      avoid: ['Files people compare by column, sort and filter: the DataGrid', 'A card standing alone: the File chip or a card', 'More than one primary action per row', 'Actions shown only on hover: they are always there'],
      related: ['file', 'folder', 'resource-list', 'rename-action', 'delete-flow'],
      states: [['Default', 'The default surface, the line under the row', 'The default'], ['Hover', 'The hover fill under the pointer', ':hover'], ['Selected', 'The checkbox checked and the selected fill', '.is-selected'],
        ['In progress', 'A small bar and its percent in place of the facts; Cancel', 'progress'], ['Failed', 'The danger icon and the reason in words; Try again', '.is-error']],
      map: [[CAR, 'Data table row / File uploader item', 'Partial'], [POL, 'Resource item', 'Partial'], [MAT, 'List item', 'Partial'], [FLU, 'List (file)', 'Partial']],
      variantPages: [
        vp('File row', 'State', 'Default', { variant: 'default' }, 'The checkbox, the file, its size and date, and its actions.', 'Lists of files people open one at a time', 'Columns people sort: the DataGrid'),
        vp('Selected file row', 'State', 'Selected', { variant: 'selected' }, 'The checkbox checked and the row in the selected fill.', 'Choosing files for an action on several', 'Showing the open file: that is the viewer’s'),
        vp('File row with progress', 'State', 'With progress', { variant: 'progress' }, 'An upload or a download under way: a small bar named by the transfer and the file, its percent in the data font, and Cancel.', 'Each file of an upload or a download', 'The overall progress of many files: one ProgressBar above the list'),
        vp('File row with actions', 'State', 'With actions', { variant: 'actions' }, 'Download, and More actions with Rename… and Delete, each its own button at the end.', 'Files people may rename, download or delete', 'Read-only lists: leave the actions out')
      ],
      examples: [
        ['State', [
          ['Default', function () { return h(Files, { files: FILES_DATA.slice(0, 2), actions: false }); }, null, 'file'],
          ['Selected', function () { return h(Files, { files: FILES_DATA.slice(0, 2), selected: ['f1'], actions: false }); }, null, 'selected'],
          ['With progress', function () { return h(Uploads); }, 'plx-file-row--progress', 'progress={42}'],
          ['With actions', function () { return h(Files, { files: FILES_DATA.slice(0, 3) }); }, 'plx-file-row--actions', 'onDownload onRename onDelete']], { prop: 'state' }],
        ['A folder with files, an owner cell, Rename… and Delete in More actions', function () { return h(Files, { owner: true }); }],
        ['A failed upload: the reason in words and Try again', function () { return h(Uploads, { start: 100 }); }]] },

    /* ── 10 Patterns › Authentication and permissions › Sign in: Auth and SignInForm ── */
    { id: 'sign-in', lab: true, icon: 'lock', sec: 'patterns', sub: AUTH, leaf: 'Sign in', title: 'Sign in',
      plenix: 'Auth, SignInForm', src: 'patterns/Auth/Auth.tsx', level: 'Pattern', interaction: 'Input', statesFrom: ['text-field', 'checkbox', 'button'],
      aliases: ['Log in', 'Login', 'Sign-in page', 'Authentication', 'Credentials'],
      text: 'Gets people into their account in the fewest steps. The sign-in form sits in the Auth frame: a centered card as wide as a small dialog, or one column from the top without the frame on narrow windows (the Plenix login’s layout). The form has an email or user name, a password with Show, Keep me signed in, and Sign in as wide as the card. Single sign-on comes first where the organization uses it. A failed sign-in keeps what was typed and shows one general error, never which part was wrong.',
      use: ['The entry to every signed-in area: a page of its own (page) under the application header', 'forgot and signUp as links to their pages, or as buttons to the next step of the same card', 'sso above the form, then “or”', 'One general error after a failure: Email or password is incorrect.'],
      avoid: ['Blocking paste or the password manager', 'More than the identifier and the password on one screen', '“Log in” in some places and “Sign in” in others', 'A cognitive test (remembering, transcribing) without another way'],
      related: ['sign-up', 'password-reset', 'multi-factor-authentication', 'single-sign-on', 'account-recovery', 'session-timeout'],
      map: [[CAR, 'Login pattern', 'Direct'], [ATL, 'Login (product pattern)', 'Partial'], [MAT, 'Sign-in (account)', 'Partial'], [HIG, 'Managing accounts', 'Partial'], [POL, 'Account connection', 'Partial'], ['Django', 'LoginView and AuthenticationForm', 'Direct'], ['Frappe', 'Login page', 'Direct']],
      variantPages: [
        vp('Sign-in card', 'Layout', 'Card (default)', { variant: 'card' }, 'The form in its card where the page puts it: a panel, a demo, a dialog-like place.', 'A sign-in inside a page that has other content', 'A page of its own: page'),
        vp('Sign-in page', 'Layout', 'Page', { variant: 'page' }, 'The card centered on the canvas under the header, filling the window; one column without a frame on narrow windows.', 'The sign-in service’s own page', 'Sign-in inside another page’s content'),
        vp('Sign in with single sign-on', 'Form', 'With single sign-on', { variant: 'sso' }, 'A button per identity provider above the form, then “or”.', 'Organizations that use Google, Microsoft or their own provider', 'Organizations that require SSO: leave the password form out'),
        vp('Failed sign-in', 'Form', 'With an error', { variant: 'error' }, 'One general error at the top of the form; the identifier is kept and both fields are marked.', 'After a wrong email or password', 'Saying which of the two was wrong')
      ],
      examples: [
        ['Layout', [
          ['Card (default)', function () { return h(SignIn, null); }, null, '<Auth title=…>'],
          ['Page', function () { return box(720, h('div', { className: 'ds-w11a-page' }, h(P.Auth, { page: true, title: 'Sign in to Plenix', description: 'Use your Plenix user name or email.' }, h(P.SignInForm, { forgot: { onClick: noop }, onSubmit: noop })))); }, 'plx-auth--page', 'page']], { prop: 'page' }],
        ['Form', [
          ['With single sign-on', function () { return h(SignIn, { props: { sso: h(P.SsoButtons, { providers: [{ id: 'google', label: 'Google' }, { id: 'microsoft', label: 'Microsoft' }], onProvider: noop }) } }); }, null, 'sso'],
          ['With an error', function () { return h(SignIn, { identifier: 'maya@example.org', error: 'Email or password is incorrect. Check both and try again.' }); }, null, 'error']]],
        ['Try it: submit empty, then with anything (it fails with the general error)', function () { return h(SignIn, null); }]] },

    /* ── Sign up: SignUpForm ── */
    { id: 'sign-up', icon: 'person', sec: 'patterns', sub: AUTH, leaf: 'Sign up', title: 'Sign up',
      plenix: 'Auth, SignUpForm', src: 'patterns/Auth/Auth.tsx', level: 'Pattern', interaction: 'Input', variantClasses: [], statesFrom: ['text-field', 'checkbox', 'button'],
      aliases: ['Create account', 'Register', 'Registration', 'Join'],
      text: 'Creates an account with only what is needed now: the name, the email, a password whose rule shows before people type, and the terms when the law asks for them. Pressing Create account shows each problem under its field; nothing is asked twice. Afterward, the email is confirmed with a link.',
      use: ['Self-service products and invited people setting up their access', 'The password rule in the field’s description, before typing', 'terms with a link to the text; it must be checked', 'Single sign-on above the form where the organization manages identity'],
      avoid: ['Asking for what can be collected later', 'Confirm password or confirm email fields', 'Rules said only after an error'],
      related: ['sign-in', 'single-sign-on', 'form-section'],
      map: [[CAR, 'Login pattern (create account)', 'Partial'], [ATL, 'Sign up', 'Partial'], [HIG, 'Managing accounts', 'Partial'], ['Frappe', 'Login page (sign up)', 'Direct']],
      examples: [
        ['Create account: the rule shown first, the terms; press it empty to see each problem', function () { return h(SignUp, null); }],
        ['With single sign-on first', function () { return h(SignUp, { props: { sso: h(P.SsoButtons, { providers: [{ id: 'google', label: 'Google' }], organization: true, onProvider: noop }) } }); }],
        ['An email already in use (errors from the server)', function () { return h(SignUp, { props: { errors: { email: 'An account already uses this email. Sign in instead, or reset its password.' } } }); }]] },

    /* ── Password reset: PasswordResetForm ── */
    { id: 'password-reset', icon: 'refresh', sec: 'patterns', sub: AUTH, leaf: 'Password reset', title: 'Password reset',
      plenix: 'Auth, PasswordResetForm', src: 'patterns/Auth/Auth.tsx', level: 'Pattern', interaction: 'Input', variantClasses: [], statesFrom: ['text-field', 'button'],
      aliases: ['Forgot password', 'Reset password', 'Change password', 'Password recovery'],
      text: 'Sets a new password without help, in four steps on one card: request (the email); sent (the same neutral message whether or not the email has an account; the link works once, for a short time); new (the new password with its rule, reached from the link); and done (Sign in). A reset signs out other sessions.',
      use: ['From Forgot your password? on the sign-in card', 'When an administrator makes someone change their password (start at new)', 'The link’s lifetime in the sent message (expires)'],
      avoid: ['Saying whether an email has an account', 'Sending a password by email', 'Asking for the new password twice'],
      related: ['sign-in', 'account-recovery'],
      map: [[CAR, 'Login pattern (forgot password)', 'Partial'], [ATL, 'Reset password', 'Partial'], [HIG, 'Managing accounts', 'Partial'], ['Django', 'PasswordResetView', 'Direct'], ['Frappe', 'Login page (forgot password)', 'Direct']],
      examples: [
        ['Request: the email, then the neutral message', function () { return h(Reset, { step: 'request' }); }],
        ['From the link: the new password with its rule', function () { return h(Reset, { step: 'new' }); }],
        ['Done', function () { return h(Reset, { step: 'done' }); }]] },

    /* ── Multi-factor authentication: MfaChallenge ── */
    { id: 'multi-factor-authentication', icon: 'settings-permissions', sec: 'patterns', sub: AUTH, leaf: 'Multi-factor authentication', title: 'Multi-factor authentication',
      plenix: 'Auth, MfaChallenge', src: 'patterns/Auth/Auth.tsx', level: 'Pattern', interaction: 'Input', variantClasses: [], statesFrom: ['otp-input', 'checkbox', 'button'],
      aliases: ['MFA', 'Two-step verification', '2FA', 'Two-factor authentication', 'One-time code', 'Verification code'],
      text: 'The second proof after the password. People enter the code from their chosen method in the code boxes (OtpInput): a pasted or autofilled code fills every box, and filling the last box verifies at once. The step says in words where the code was sent, and offers Remember this device, a new code after a short wait (text and email), a security key instead of a code, Use another method and Use a recovery code.',
      use: ['Accounts that reach sensitive data or administration', 'Passkeys and security keys first where people have them', 'Saying where the code went: “to the phone ending 42”', 'A recovery code as the way out'],
      avoid: ['Text messages as the only method for high-risk access', 'Asking at every action: at sign-in and for risky changes', 'Codes that expire before people can type them'],
      related: ['sign-in', 'account-recovery', 'otp-input'],
      map: [[ATL, 'Two-step verification', 'Partial'], [MAT, 'Verification code', 'Partial'], [HIG, 'Managing accounts', 'Partial'], ['Frappe', 'Two Factor Authentication', 'Direct']],
      examples: [
        ['An authenticator app (try 123456; any other code shows the error)', function () { return h(Mfa, null); }],
        ['A text message: the new code after 30 seconds', function () { return h(Mfa, { props: { defaultMethod: 'sms' } }); }],
        ['A security key', function () { return h(Mfa, { props: { defaultMethod: 'key' } }); }]] },

    /* ── Single sign-on: SsoButtons ── */
    { id: 'single-sign-on', icon: 'link', sec: 'patterns', sub: AUTH, leaf: 'Single sign-on', title: 'Single sign-on',
      plenix: 'SsoButtons', src: 'patterns/Auth/Auth.tsx', level: 'Pattern', interaction: 'Action', variantClasses: [], statesFrom: ['button'],
      aliases: ['SSO', 'Continue with Google', 'Identity provider', 'SAML', 'OpenID Connect', 'Social sign-in'],
      text: 'Signs people in through the organization’s identity provider instead of another password. Each provider has one button, named in words (Continue with Google); Continue with single sign-on asks for the work email and finds the organization’s provider. While the provider opens, a status line with a spinner says where people are going. A refusal says why and who to ask.',
      use: ['Above the sign-in or sign-up form, then “or”', 'Provider buttons named in words', 'The work-email step for organizations with their own provider', 'redirecting while handing over; error when the provider refuses'],
      avoid: ['A password field for people whose organization requires SSO', 'Hiding where people will be sent', 'Logos alone without the provider’s name'],
      related: ['sign-in', 'sign-up'],
      map: [[CAR, 'Login pattern (SSO)', 'Partial'], [ATL, 'Single sign-on', 'Partial'], [HIG, 'Sign in with Apple', 'Partial'], ['Frappe', 'Social Login Key', 'Direct']],
      examples: [
        ['Providers and the work-email step (each hands over for a moment)', function () { return h(Sso, null); }],
        ['Handing over', function () { return h(Card, { title: 'Sign in to Plenix' }, h(P.SsoButtons, { redirecting: 'Microsoft' })); }],
        ['Refused by the provider', function () { return h(Card, { title: 'Sign in to Plenix' }, h(P.SsoButtons, { providers: [{ id: 'microsoft', label: 'Microsoft' }], onProvider: noop, error: 'Microsoft didn’t let you in: your account isn’t part of Lighthouse Way. Ask your administrator to add it.' })); }]] },

    /* ── Account recovery: AccountRecovery ── */
    { id: 'account-recovery', icon: 'refresh', sec: 'patterns', sub: AUTH, leaf: 'Account recovery', title: 'Account recovery',
      plenix: 'Auth, AccountRecovery', src: 'patterns/Auth/Auth.tsx', level: 'Pattern', interaction: 'Input', variantClasses: [], statesFrom: ['text-field', 'radio-group', 'button'],
      aliases: ['Lost device', 'Backup codes', 'Recovery codes', 'Locked out'],
      text: 'Gets people back in when their second step is lost. First a choice: a saved backup code (listed first), another sign-in method, or the administrator’s help. Then the code (pasted, in the data font) or the words for the administrator. Last, a notice that every address on the account was told, with Set up a new sign-in method.',
      use: ['From Use a recovery code on the two-step card', 'Backup codes first, then other methods, then a person', 'Telling the owner on every recovery', 'Setting up a new method right after'],
      avoid: ['Security questions', 'A recovery easier than signing in', 'One method only'],
      related: ['multi-factor-authentication', 'password-reset', 'sign-in'],
      map: [[ATL, 'Account recovery', 'Partial'], [HIG, 'Managing accounts', 'Partial']],
      examples: [
        ['Choose how to get back in', function () { return h(Recovery, { step: 'choose' }); }],
        ['A backup code', function () { return h(Recovery, { step: 'code' }); }],
        ['The administrator’s help', function () { return h(Recovery, { step: 'help' }); }],
        ['Back in', function () { return h(Recovery, { step: 'done' }); }]] },

    /* ── Session timeout: SessionTimeout ── */
    { id: 'session-timeout', lab: true, icon: 'clock', sec: 'patterns', sub: AUTH, leaf: 'Session timeout', title: 'Session timeout',
      plenix: 'SessionTimeout, useSessionTimeout', src: 'patterns/SessionTimeout/SessionTimeout.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['dialog', 'button'],
      aliases: ['Idle timeout', 'Inactivity warning', 'Session expiry', 'Auto sign-out'],
      text: 'Ends a session nobody is using without losing anyone’s work. Before the end, an alert dialog shows how long is left (counting down in the data font), with Stay signed in (focused) and Sign out. After the end, the signed-out message says what happened and that the work was kept, and offers Sign in again. useSessionTimeout keeps the time: activity restarts it, the warning opens before the end, and the end signs out.',
      use: ['Where policy ends sessions without activity', 'A warning at least 20 seconds before the end (two minutes is better), extended with one action', 'Saying the work is saved', 'inline for the signed-out page'],
      avoid: ['Ending a session without warning', 'Announcing the countdown every second', 'Timeouts shorter than the task needs'],
      related: ['sign-in', 'dialog', 'non-modal-dialog'],
      map: [[ATL, 'Session timeout', 'Partial'], [CAR, 'Modal (session)', 'Partial'], [MAT, 'Dialogs', 'Partial'], [HIG, 'Alerts', 'Partial']],
      variantPages: [
        vp('Session timeout warning', 'Variant', 'Warning with countdown', { variant: 'warning' }, 'An alert dialog: how long is left, counting down; Stay signed in (focused) and Sign out.', 'The minutes before an idle session ends', 'Sessions the person is still using'),
        vp('Signed out', 'Variant', 'Signed out', { variant: 'signed-out' }, 'What happened and that the work was kept; Sign in again. It cannot be dismissed.', 'Right after the end, and on the signed-out page', 'Signing out on purpose: that page says so plainly'),
        vp('Session timeout in a dialog', 'Placement', 'Dialog (default)', { variant: 'warning' }, 'Over the page, which waits behind the veil.', 'Inside the application', 'The signed-out page itself'),
        vp('Session timeout on the page', 'Placement', 'On the page', { variant: 'inline' }, 'Drawn in the page: the title, the words and the actions, without a frame of its own.', 'The signed-out page, a pane that ends its own session', 'Over a page people are using: the dialog')
      ],
      examples: [
        ['Variant', [
          ['Warning with countdown', function () { return h(Timeout, null); }, 'plx-session-timeout--warning', 'state=' + q('warning')],
          ['Signed out', function () { return h(Timeout, { state: 'signed-out', hint: 'What people see when the time ran out.' }); }, 'plx-session-timeout--signed-out', 'state=' + q('signed-out')]], { prop: 'state' }],
        ['Placement', [
          ['Dialog (default)', function () { return h(Timeout, { seconds: 25, hint: 'From 0:25: the time is announced at 10 seconds.' }); }, null, 'inline={false}'],
          ['On the page', function () { return h(P.Stack, { gap: 'lg' }, h(TimeoutInline, { state: 'warning' }), h(TimeoutInline, { state: 'signed-out' })); }, 'plx-session-timeout--inline', 'inline']], { prop: 'inline' }],
        ['useSessionTimeout: a real idle timer', function () { return h(Idle); }]] },

    /* ── Roles: RoleManager ── */
    { id: 'role-manager', lab: true, icon: 'settings-users', sec: 'patterns', sub: AUTH, leaf: 'Roles', title: 'Roles',
      plenix: 'RoleManager', src: 'patterns/RoleManager/RoleManager.tsx', level: 'Pattern', interaction: 'Editing', statesFrom: ['resource-list', 'checkbox', 'button'],
      aliases: ['Role management', 'Access roles', 'User roles', 'RBAC', 'Custom roles'],
      text: 'Shows a workspace’s roles and what each allows, in two views. The list shows each role’s name, a sentence of what it can do, how many people hold it and whether it is built in, with Create role. The detail shows the role with its RoleLabel and description; its permissions (for a built-in role, what it can and cannot do; for a custom role, checkboxes by group that save at once); and its members, with Add a member, Remove, Duplicate and, for a custom role, Delete. The owner role cannot lose its last member.',
      use: ['A few roles that match real jobs: Viewer, Editor, Owner', 'Custom roles only when an organization needs them, started from a built-in one', 'One sentence per role of what it can do', 'onChange’s change for the audit log'],
      avoid: ['Many overlapping roles', 'Making people guess what a role allows', 'Removing the last owner'],
      related: ['role-label', 'permission-summary', 'assign-control', 'resource-list'],
      map: [[ATL, 'Admin roles', 'Partial'], [POL, 'Staff permissions', 'Partial'], [FLU, 'People picker and roles', 'Partial'], [CAR, 'Data table (roles)', 'Partial'], ['Django', 'Groups and permissions (admin)', 'Direct'], ['Frappe', 'Role Permission Manager', 'Direct']],
      variantPages: [
        vp('Roles list', 'View', 'Roles list', { variant: 'list' }, 'Each role with its sentence, its member count in the data font and Built-in or Custom; Create role above.', 'The roles page of a workspace’s settings', 'Choosing a role for one person: a radio group with descriptions'),
        vp('Role detail', 'View', 'Role detail', { variant: 'detail' }, 'The role, its permissions and its members, with the actions that fit it.', 'Seeing and changing what one role allows and who holds it', 'Changing one person’s role: the people list’s own control')
      ],
      examples: [
        ['View', [
          ['Roles list', function () { return h(Roles, null); }, 'plx-role-manager--list', 'view=' + q('list')],
          ['Role detail', function () { return h(Roles, { view: 'detail', role: 'print' }); }, 'plx-role-manager--detail', 'view=' + q('detail')]], { prop: 'view' }],
        ['A built-in role: what it can and cannot do; Duplicate to make your own', function () { return h(Roles, { view: 'detail', role: 'editor' }); }],
        ['The owner: its last member cannot be removed', function () { return h(Roles, { view: 'detail', role: 'owner' }); }],
        ['Read only', function () { return h(Roles, { readOnly: true }); }]] },

    /* ── Account connection: ConnectedAccounts ── */
    { id: 'connected-accounts', lab: true, icon: 'link', sec: 'patterns', sub: AUTH, leaf: 'Account connection', title: 'Account connection',
      plenix: 'ConnectedAccounts, ConnectedAccount', src: 'patterns/ConnectedAccounts/ConnectedAccounts.tsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'confirmation-dialog'],
      aliases: ['Connected accounts', 'Integrations', 'Linked accounts', 'Connect an app', 'OAuth connection'],
      text: 'Lists the accounts on other services that Plenix is linked to, one row each: the service’s icon and name, what it is for, its status as a Badge with its icon (Not connected, Connected, Connection error), the linked account and date in the data font, and its action. Connect first lists what Plenix will be able to do there, then hands over to the service’s own sign-in. Disconnect asks first and says what stops working. A failed connection says why and offers Reconnect.',
      use: ['Storage, publishing and mailing services, one row each', 'scopes in plain words before the hand-over', 'loses: what stops working, in the Disconnect question', 'Reconnect without a question: the person already agreed'],
      avoid: ['Asking for more access than the connection needs', 'Connecting without the question', 'Services named by a logo alone'],
      related: ['permission-summary', 'confirmation-dialog', 'badge'],
      map: [[POL, 'Account connection', 'Direct'], [ATL, 'Connected apps', 'Partial'], [HIG, 'Managing accounts', 'Partial'], ['Frappe', 'Connected App', 'Direct']],
      variantPages: [
        vp('Connect an account', 'Status', 'Connect', { variant: 'connect' }, 'Not connected: the neutral badge and Connect, which lists the scopes before the hand-over.', 'Services people may link', 'Services the workspace links for everyone: an admin setting'),
        vp('Connected account', 'Status', 'Connected', { variant: 'connected' }, 'The success badge with its check, the account and date in the data font, and Disconnect.', 'A linked service', 'A service that failed: Connection error'),
        vp('Account connection error', 'Status', 'Error', { variant: 'error' }, 'The negative badge with its alert icon, why it failed in the danger color, Reconnect and Disconnect.', 'Expired or revoked access', 'A service that is only slow: say it is working')
      ],
      examples: [
        ['Status', [
          ['Connect', function () { return h(Accounts, { accounts: [ACCOUNTS[2]] }); }, null, 'status=' + q('disconnected')],
          ['Connected', function () { return h(Accounts, { accounts: [ACCOUNTS[0]] }); }, null, 'status=' + q('connected')],
          ['Error', function () { return h(Accounts, { accounts: [ACCOUNTS[1]] }); }, null, 'status=' + q('error')]], { prop: 'status' }],
        ['Three services: connect, disconnect and reconnect them', function () { return h(Accounts, null); }]] }
  ];
});
