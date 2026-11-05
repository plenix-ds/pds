/* Plenix design system · library part w12A (wave 12, lane A): files and assets in 12 Specialized › Files, assets, and DAM.
   Asset (MediaCard's asset parts: the format Badge and the status Badge, with its Collection leaf: the stack), File list
   (FileList: list, table, sortable), File browser (FileBrowser: breadcrumbs, the bar, the tree, a list or a grid), Upload
   manager (UploadManager and useUploadQueue: a panel or a dialog, per file progress, retry) and Version comparison
   (VersionCompare: side by side, slider, text diff). Asset browser, Asset card, Thumbnail and Image viewer are answered
   in w00A. Every color is an existing role; statuses are Badges with their icon. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var FILES = 'Files, assets, and DAM';
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
  var APPROVED = { tone: 'success', icon: 'circle-check', label: 'Approved' }, REVIEW = { tone: 'active', icon: 'doc-search', label: 'In review' },
    EXPIRED = { tone: 'negative', icon: 'alert', label: 'Rights expired' }, DRAFT = { tone: 'neutral', icon: 'pencil', label: 'Draft' };

  /* ── the sample library ── */
  var ITEMS = [
    { id: 'brand', name: 'Brand kit', kind: 'folder', modified: '2026-09-28' },
    { id: 'logos', name: 'Logos', kind: 'folder', parent: 'brand', modified: '2026-09-20' },
    { id: 'easter', name: 'Easter 2026', kind: 'folder', modified: '2026-10-11' },
    { id: 'archive', name: 'Archive', kind: 'folder', modified: '2026-08-02' },
    { id: 'f1', name: 'Letterhead 2026.pdf', parent: 'brand', size: 1240000, modified: '2026-10-14', owner: 'Maya Chen', status: APPROVED },
    { id: 'f2', name: 'Cross 014.png', parent: 'brand', size: 482000, modified: '2026-10-12', owner: 'Alex Kim', status: REVIEW, src: ART(14) },
    { id: 'f3', name: 'Brand guide.pdf', parent: 'brand', size: 8200000, modified: '2026-09-30', owner: 'Maya Chen', status: APPROVED },
    { id: 'f4', name: 'Logo mark.svg', parent: 'logos', size: 24000, modified: '2026-09-20', owner: 'Priya Nair', status: APPROVED, src: ART(12) },
    { id: 'f5', name: 'Window 03.jpg', parent: 'easter', size: 3400000, modified: '2026-10-15', owner: 'Alex Kim', status: DRAFT, src: ART(16) },
    { id: 'f6', name: 'Easter banner.png', parent: 'easter', size: 2100000, modified: '2026-10-09', owner: 'Maya Chen', status: REVIEW, src: ART(18) },
    { id: 'f7', name: 'Vestry minutes, October.docx', size: 88000, modified: '2026-10-09', owner: 'Jordan Avery' },
    { id: 'f8', name: 'Archive 1919.zip', parent: 'archive', size: 52000000, modified: '2026-08-02', owner: 'Jordan Avery', status: EXPIRED }
  ];
  var IN_BRAND = ITEMS.filter(function (x) { return x.parent === 'brand'; });
  var nextId = 100;

  /* ── live examples (each a small component: the spec renders an example as one) ── */
  var Asset = function (p) {
    var s = use(!!p.selected);
    return box(p.width || 200, h(P.MediaCard, Object.assign({ src: p.src, icon: p.icon || 'image-b', title: p.title || 'Window 03.jpg', meta: p.meta || '3.4 MB · Oct 15', type: p.type === undefined ? 'JPG' : p.type, typeIcon: p.typeIcon || 'file-jpg',
      status: p.status === undefined ? APPROVED : p.status, selected: s[0], onSelectChange: s[1], onOpen: noop }, p.more || {})));
  };
  var Collection = function (p) {
    var s = use(false);
    return box(p.width || 200, h(P.MediaCard, Object.assign({ stack: true, src: p.src, icon: 'briefcase', title: p.title || 'Easter 2026', count: p.count === undefined ? 24 : p.count, selected: s[0], onSelectChange: s[1], onOpen: noop }, p.more || {})));
  };
  var List = function (p) {
    var files = use(p.files || IN_BRAND), sel = use([]);
    return box(p.width || 720, h(P.FileList, Object.assign({ label: 'Files in Brand kit', files: files[0], selectable: p.selectable !== false, selected: sel[0], onSelectionChange: sel[1], onOpen: noop, onDownload: noop,
      onRename: function (f, n) { files[1](files[0].map(function (x) { return x.id === f.id ? Object.assign({}, x, { name: n }) : x; })); },
      onDelete: function (f) { files[1](files[0].filter(function (x) { return x.id !== f.id; })); } }, p.props || {})));
  };
  var Browser = function (p) {
    var items = use(ITEMS);
    var set = function (fn) { items[1](fn(items[0])); };
    return box(p.width || 900, h('div', { className: 'ds-w12a-frame' }, h(P.FileBrowser, Object.assign({ label: 'Files', root: { name: 'Library' }, items: items[0], defaultFolder: p.folder === undefined ? 'brand' : p.folder,
      onOpenFile: noop, onDownload: noop,
      onCreateFolder: function (name, parent) { set(function (l) { return l.concat({ id: 'n' + (++nextId), name: name, kind: 'folder', parent: parent, modified: '2026-10-15' }); }); },
      onUpload: function (files, parent) { set(function (l) { return l.concat(files.map(function (f) { return { id: 'n' + (++nextId), name: f.name, size: f.size, type: f.type, parent: parent, modified: '2026-10-15', owner: 'You' }; })); }); },
      onRename: function (it, name) { set(function (l) { return l.map(function (x) { return x.id === it.id ? Object.assign({}, x, { name: name }) : x; }); }); },
      onDelete: function (list) { var gone = list.map(function (x) { return x.id; }); set(function (l) { return l.filter(function (x) { return gone.indexOf(x.id) < 0 && gone.indexOf(x.parent) < 0; }); }); },
      onMove: function (list, to) { var ids = list.map(function (x) { return x.id; }); set(function (l) { return l.map(function (x) { return ids.indexOf(x.id) >= 0 ? Object.assign({}, x, { parent: to === null ? undefined : to }) : x; }); }); } }, p.props || {}))));
  };
  // a pretend upload: the percent grows every 300ms; a file whose name has "fail" fails half way
  var fakeUpload = function (file, o) {
    return new Promise(function (resolve, reject) {
      var pct = 0;
      var id = setInterval(function () {
        if (o.signal.aborted) { clearInterval(id); return; }
        pct = Math.min(100, pct + 9 + Math.round(Math.random() * 9));
        o.onProgress(pct);
        if (/fail/i.test(file.name) && pct >= 50) { clearInterval(id); reject(new Error('The connection was lost.')); return; }
        if (pct >= 100) { clearInterval(id); resolve(); }
      }, 300);
    });
  };
  var SAMPLE = [['Window 03.jpg', 3400000, 'image/jpeg'], ['Archive 1919.zip', 5200000, 'application/zip'], ['Border 007 (fail).svg', 96000, 'image/svg+xml'], ['Letterhead.pdf', 1240000, 'application/pdf']];
  var sampleFiles = function (n) {
    return SAMPLE.slice(0, n || SAMPLE.length).map(function (s) { var f = new window.File(['x'], s[0], { type: s[2] }); try { Object.defineProperty(f, 'size', { value: s[1] }); } catch (e) { /* keep its size */ } return f; });
  };
  var Uploads = function (p) {
    var queue = P.useUploadQueue({ upload: fakeUpload, accept: p.accept, maxSize: p.maxSize, concurrency: 2 });
    var open = use(false), docked = use(false);
    var started = React.useRef(false);
    React.useEffect(function () { if (p.start && !started.current) { started.current = true; queue.add(sampleFiles(p.start)); } }, []);
    var add = h(P.Button, { icon: 'plus', onClick: function () { queue.add(sampleFiles()); } }, 'Add sample files');
    if (p.variant === 'dialog') {
      return h(P.Stack, { gap: 'sm' }, row(h(P.Button, { variant: 'primary', icon: 'upload', onClick: function () { open[1](true); } }, 'Upload files'), add),
        h(P.UploadManager, { queue: queue, variant: 'dialog', open: open[0], onClose: function () { open[1](false); }, hint: 'PNG, JPG, SVG, ZIP or PDF, up to 500 MB each.' }),
        queue.items.length && !open[0] ? box(440, h(P.UploadManager, { queue: queue })) : null);
    }
    if (p.docked) {
      return h(P.Stack, { gap: 'sm' }, row(h(P.Button, { onClick: function () { docked[1](!docked[0]); if (!queue.items.length) queue.add(sampleFiles()); } }, docked[0] ? 'Hide the docked panel' : 'Show the docked panel'),
        h(P.Text, { variant: 'secondary' }, 'It sits at the window’s bottom end, over the page.')),
        docked[0] ? h(P.UploadManager, { queue: queue, docked: true, onClose: function () { docked[1](false); queue.clear(); } }) : null);
    }
    return h(P.Stack, { gap: 'sm' }, row(add), box(p.width || 480, h(P.UploadManager, { queue: queue, dropZone: p.dropZone, hint: p.dropZone ? 'Up to 500 MB each.' : undefined, onClose: function () { queue.clear(); } })));
  };
  var STATIC_ROWS = {
    progress: [{ id: 'a', name: 'Window 03.jpg', size: 3400000, status: 'uploading', progress: 64 }, { id: 'b', name: 'Archive 1919.zip', size: 52000000, status: 'uploading', progress: 18 },
      { id: 'c', name: 'Letterhead.pdf', size: 1240000, status: 'queued' }, { id: 'd', name: 'Cross 014.png', size: 482000, status: 'done', progress: 100 }],
    retry: [{ id: 'a', name: 'Border 007.svg', size: 96000, status: 'error', error: 'The connection was lost.' }, { id: 'b', name: 'Poster.psd', size: 2400000000, status: 'error', error: 'This file is larger than 500 MB.', retry: false },
      { id: 'c', name: 'Window 03.jpg', size: 3400000, status: 'done', progress: 100 }, { id: 'd', name: 'Minutes.docx', size: 88000, status: 'canceled' }]
  };
  var Rows = function (p) {
    var list = use(STATIC_ROWS[p.kind]);
    var patch = function (id, o) { list[1](list[0].map(function (x) { return x.id === id ? Object.assign({}, x, o) : x; })); };
    return box(480, h(P.UploadManager, { items: list[0], onCancel: function (id) { patch(id, { status: 'canceled' }); }, onRetry: function (id) { patch(id, { status: 'uploading', progress: 10, error: undefined }); },
      onRemove: function (id) { list[1](list[0].filter(function (x) { return x.id !== id; })); }, onCancelAll: function () { list[1](list[0].map(function (x) { return x.status === 'uploading' || x.status === 'queued' ? Object.assign({}, x, { status: 'canceled' }) : x; })); },
      onClear: function () { list[1](list[0].filter(function (x) { return x.status === 'uploading' || x.status === 'queued'; })); } }));
  };
  var TEXT2 = 'Easter vigil\nSaturday, April 4, at 8 pm\nBlessing of the fire in the courtyard\nThe Exsultet\nReadings and psalms\nBaptisms\nFirst Eucharist of Easter\nReception in the hall';
  var TEXT3 = 'Easter vigil\nSaturday, April 4, at 9 pm\nBlessing of the fire in the courtyard\nBring a candle; we will hand out more at the door\nThe Exsultet\nReadings and psalms\nBaptisms\nFirst Eucharist of Easter\nReception in the parish garden';
  var VERSIONS = [
    { id: 'v1', label: 'Version 1', date: '2026-09-21', author: 'Maya Chen', image: { src: ART(10), alt: 'Easter banner, version 1' }, values: { format: 'JPEG', size: '1.9 MB', width: '1600 px', profile: 'sRGB' }, text: 'Easter vigil\nSaturday, April 4\nReception in the hall' },
    { id: 'v2', label: 'Version 2', date: '2026-10-02', author: 'Maya Chen', image: { src: ART(14), alt: 'Easter banner, version 2' }, values: { format: 'JPEG', size: '2.4 MB', width: '1920 px', profile: 'sRGB' }, text: TEXT2 },
    { id: 'v3', label: 'Version 3', date: '2026-10-09', author: 'Alex Kim', image: { src: ART(12), alt: 'Easter banner, version 3' }, values: { format: 'PNG', size: '3.1 MB', width: '1920 px', profile: 'Display P3' }, text: TEXT3 }
  ];
  var ATTRS = [{ key: 'format', label: 'Format' }, { key: 'size', label: 'Size', kind: 'data' }, { key: 'width', label: 'Width', kind: 'data' }, { key: 'profile', label: 'Color profile' }];
  var Compare = function (p) { return box(p.width || 720, h(P.VersionCompare, Object.assign({ label: 'Compare versions of Easter banner', versions: VERSIONS, attributes: ATTRS, defaultMode: p.mode || 'columns' }, p.props || {}))); };

  return [
    /* ── 12 Specialized › Files, assets, and DAM › Asset (and Collection): MediaCard type, status and stack ── */
    { id: 'asset', lab: true, icon: 'image-b', sec: 'specialized', sub: FILES, leaf: 'Asset', title: 'Asset',
      plenix: 'MediaCard (type, status, stack, count)', src: 'components/Card/Card.tsx', css: ['components/Card/card.css'], blocks: ['plx-media-card'], level: 'Component', interaction: 'Selection', variantClasses: [],
      aliases: ['Asset card', 'Managed asset', 'Media item', 'Asset tile'], covers: ['Collection'],
      text: 'A managed media item, more than its file: its picture, its title, its format as a neutral Badge over the picture (type), and its workflow status as a Badge with its icon under the facts (status): Approved, In review, Rights expired. The card selects for bulk actions, and its title opens the asset’s page. A collection is the same card drawn as a pile (stack): two sheets behind the cover, its name and how many assets it holds (count).',
      use: ['Images, video, audio, documents and design files managed in the library', 'status when approval, rights or expiry must travel with the asset', 'type for the format when the picture alone does not say it', 'stack and count for a curated set of assets from many folders (Collection)'],
      avoid: ['Temporary attachments: the File chip or a file row', 'A status on every card when it decides nothing', 'A status told by color alone: the Badge has its icon and its word', 'A collection for the storage hierarchy: a folder'],
      related: ['media-card', 'file', 'file-browser', 'thumbnail'],
      states: [['Default', 'The card at rest', 'The default'], ['Hover', 'The selection box shows', ':hover'], ['Selected', 'The box checked and the border in the action color', '.is-selected'], ['Focus', 'The ring around the card while its title has focus', ':focus-visible']],
      map: [[SPE, 'Asset card', 'Direct'], [POL, 'Thumbnail', 'Partial'], [SPE, 'Card view (collection)', 'Partial'], [CAR, 'Tile', 'Partial']],
      variantPages: [
        vp('Asset', 'Kind', 'Asset', { variant: 'asset' }, 'The picture with its format Badge at the top end, the title and the facts in the data font, and the status Badge with its icon under them.', 'Managed assets whose status or rights matter', 'Plain files without a workflow: a file row'),
        vp('Collection', 'Kind', 'Collection', { variant: 'collection' }, 'The cover card with two sheets behind it, its name and its count (“24 assets”, the data font).', 'Curated sets of assets that live in many folders', 'Folders: the storage place, not a selection')
      ],
      examples: [
        ['Kind', [
          ['Asset', function () { return h(Asset, { src: ART(16) }); }, null, 'type="JPG" status={{ tone, icon, label }}'],
          ['Collection', function () { return h(Collection, { src: ART(18) }); }, null, 'stack count={24}']], { prop: 'kind' }],
        ['Statuses: each a Badge with its icon', function () { return row(h(Asset, { src: ART(14), title: 'Cross 014.png', type: 'PNG', typeIcon: 'file-png', meta: '482 kB · Oct 12', status: REVIEW }), h(Asset, { icon: 'file-pdf', title: 'Archive 1919.pdf', type: 'PDF', typeIcon: 'file-pdf', meta: '52 MB · Aug 2', status: EXPIRED }), h(Asset, { src: ART(12), title: 'Logo mark.svg', type: 'SVG', typeIcon: 'file-svg', meta: '24 kB · Sep 20', status: DRAFT })); }],
        ['Selected, for a bulk action', function () { return h(Asset, { src: ART(16), selected: true }); }],
        ['A collection without a cover, and one with one asset', function () { return row(h(Collection, { title: 'Spring launch social', count: 12 }), h(Collection, { title: 'Print run', count: 1, src: ART(20) })); }]] },

    /* ── 12 Specialized › Files, assets, and DAM › File list: FileList ── */
    { id: 'file-list', lab: true, icon: 'list-lines', sec: 'specialized', sub: FILES, leaf: 'File list', title: 'File list',
      plenix: 'FileList, sortFiles', src: 'patterns/FileList/FileList.jsx', level: 'Pattern', interaction: 'Selection',
      aliases: ['Files list', 'Document list', 'File table', 'Folder contents'],
      text: 'Many files and folders at once, each in the same row, in one of three forms: the list of FileRows (list) for files people open one at a time; the DataGrid (table) where they compare, sort and filter by column, with the size and the date in the data font and the status as a Badge; or the list with its own Sort menu above the rows, by name, size, date or owner, folders first (sortable). Every row selects, opens, downloads, renames and deletes the same way. Files drag onto folders; Move to does the same without dragging.',
      use: ['A folder’s content, uploads, attachments and search results that are files', 'table where people compare files by size, date, owner or status', 'sortable for a list people order without a table', 'dragType and onMove where files move between folders'],
      avoid: ['Pictures people recognize by sight: a grid of asset cards (FileBrowser grid)', 'Columns people never sort or scan', 'A single file in a form: the file input', 'Actions shown only on hover'],
      related: ['file-row', 'file', 'file-browser', 'data-grid', 'rename-action', 'delete-flow'],
      states: [['Default', 'The rows at rest', 'The default'], ['Hover', 'The row under the pointer takes the hover fill', ':hover'], ['Selected', 'Checked rows take the selected fill (the table’s are the DataGrid’s)', '.is-selected'],
        ['Dragging', 'A file follows the pointer; a folder that takes it shows the drop outline', '[data-plx-dnd-state]'], ['Empty', 'The empty state in place of the rows', 'files=[]']],
      map: [[CAR, 'Data table', 'Partial'], [ATL, 'Dynamic table', 'Partial'], [POL, 'Index table', 'Partial'], [FLU, 'DataGrid (files)', 'Partial'], [HIG, 'Lists and tables', 'Partial'], ['Frappe', 'List view', 'Partial']],
      variantPages: [
        vp('File list rows', 'Look', 'List (default)', { variant: 'list' }, 'A FileRow per file: the checkbox, the name that opens it, the size and the date, the owner and the status, Download and More actions.', 'Files people open one at a time', 'Comparing by column: the table'),
        vp('File table', 'Look', 'Table', { variant: 'table' }, 'The DataGrid: the name, the size and the date in the data font, the owner and the status Badge; the headers sort, a right-click opens the row’s menu.', 'Comparing, sorting and filtering many files', 'A handful of attachments: the list'),
        vp('Sortable file list', 'Look', 'Sortable', { variant: 'sortable' }, 'The count in the data font and the Sort menu above the rows: the field and the direction; folders stay first.', 'A list people order by name, size, date or owner', 'Many columns to sort: the table')
      ],
      examples: [
        ['Look', [
          ['List (default)', function () { return h(List, null); }, 'plx-file-list--list', 'view=' + q('list')],
          ['Table', function () { return h(List, { props: { view: 'table' } }); }, 'plx-file-list--table', 'view=' + q('table')],
          ['Sortable', function () { return h(List, { props: { sortable: true, defaultSort: { field: 'modified', dir: 'desc' } } }); }, 'plx-file-list--sortable', 'sortable']], { prop: 'view' }],
        ['Drag a file onto a folder (or More actions › Move to)', function () {
          var files = use(IN_BRAND);
          return box(720, h(P.FileList, { label: 'Files in Brand kit', files: files[0], dragType: 'file', moveTargets: [ITEMS[1], ITEMS[2], ITEMS[3]], onOpen: noop,
            onMove: function (f, to) { files[1](files[0].filter(function (x) { return x.id !== f.id; })); P.announce(f.name + ' moved to ' + to.name); } }));
        }],
        ['An empty folder', function () { return box(560, h(P.FileList, { label: 'Files in Archive', files: [] })); }]] },

    /* ── 12 Specialized › Files, assets, and DAM › File browser: FileBrowser ── */
    { id: 'file-browser', lab: true, icon: 'folder-open', sec: 'specialized', sub: FILES, leaf: 'File browser', title: 'File browser',
      plenix: 'FileBrowser', src: 'patterns/FileBrowser/FileBrowser.jsx', level: 'Pattern', interaction: 'Navigation',
      aliases: ['File manager', 'File explorer', 'Folder view', 'Document library'],
      text: 'Finding and organizing files by place: the location as breadcrumbs, the command bar over the open folder (New folder and Upload; the search; Sort and View; the count; with items selected, Download, Move to and Delete), the folder tree at the start (tree), and the folder’s content as a file list (list) or a grid of asset cards (grid). Files drag onto folders in the list, the grid and the tree; files dropped from the computer upload into the open folder.',
      use: ['The main workspace for a library people explore by folder', 'tree for deep hierarchies on wide windows', 'grid where pictures matter; list where names, sizes and dates do', 'Every change through the handlers; the page keeps the items'],
      avoid: ['Choosing one file for a form: the file picker', 'Libraries people search rather than browse: lead with search results', 'Moving only by dragging: Move to is always there', 'A third level of frames inside the content'],
      related: ['file-list', 'asset', 'command-bar', 'tree-view', 'breadcrumbs', 'upload-manager'],
      states: [['Default', 'The open folder’s content', 'The default'], ['Selecting', 'The bar swaps to Download, Move to and Delete with “× N selected”', 'selection'],
        ['Dragging', 'Folders that take the dragged file show the drop outline', '[data-plx-drop-state]'], ['Dropping files', 'The drop overlay covers the content', '.plx-drop-zone--overlay'], ['Empty', 'The empty state with Upload', 'An empty folder']],
      map: [[CAR, 'Data table with a toolbar', 'Partial'], [POL, 'Resource index layout', 'Partial'], [SPE, 'Card view', 'Partial'], [FLU, 'File list (OneDrive)', 'Partial'], [HIG, 'File management', 'Partial']],
      variantPages: [
        vp('File browser list', 'Variant', 'List (default)', { variant: 'list' }, 'The open folder as a file list: folders first, a row per item with its facts and actions.', 'Folders of documents where names and dates matter', 'Pictures people recognize by sight: the grid'),
        vp('File browser grid', 'Variant', 'Grid', { variant: 'grid' }, 'The open folder as asset cards in a content grid; View sets the card size.', 'Images and design files', 'Documents compared by date or size'),
        vp('File browser tree', 'Variant', 'With the tree', { variant: 'tree' }, 'The folder tree at the start in a resizable pane, the open folder selected and its parents open; on a narrow browser it steps out.', 'Deep hierarchies on wide windows', 'One or two levels: the breadcrumbs are enough'),
        vp('File browser breadcrumbs', 'Variant', 'With breadcrumbs', { variant: 'breadcrumbs' }, 'The location from the library to the open folder; each level is a link back.', 'Every browser deeper than one level', 'A flat folder: leave them out (breadcrumbs={false})')
      ],
      examples: [
        ['Variant', [
          ['List (default)', function () { return h(Browser, { props: { breadcrumbs: false } }); }, 'plx-file-browser--list', 'view=' + q('list')],
          ['Grid', function () { return h(Browser, { props: { defaultView: 'grid', breadcrumbs: false } }); }, 'plx-file-browser--grid', 'defaultView=' + q('grid')],
          ['With the tree', function () { return h(Browser, { props: { tree: true } }); }, 'plx-file-browser--tree', 'tree'],
          ['With breadcrumbs', function () { return h(Browser, null); }, 'plx-file-browser--breadcrumbs', 'breadcrumbs']], { prop: 'variant' }],
        ['The table look of the list, with the tree', function () { return h(Browser, { props: { tree: true, listView: 'table' } }); }],
        ['Open at the library’s top', function () { return h(Browser, { folder: null, props: { tree: true, defaultView: 'grid' } }); }]] },

    /* ── 12 Specialized › Files, assets, and DAM › Upload manager: UploadManager, useUploadQueue ── */
    { id: 'upload-manager', lab: true, icon: 'upload', sec: 'specialized', sub: FILES, leaf: 'Upload manager', title: 'Upload manager',
      plenix: 'UploadManager, useUploadQueue', src: 'patterns/UploadManager/UploadManager.jsx', level: 'Pattern', interaction: 'Input',
      aliases: ['Upload queue', 'Uploads panel', 'File uploader', 'Upload progress'],
      text: 'Files on their way up. A drop zone also opens the system’s file and folder pickers. Then comes a queue: a file row per file with its own progress (per file progress), Cancel while it moves, and the reason and Try again when it fails (retry), with the overall progress and counts at the top. It is a panel people keep working beside, in place or docked at the window’s bottom end (panel), or a dialog that starts the upload (dialog). useUploadQueue checks each file’s type and size first and uploads a few at a time.',
      use: ['Many files or large ones, and uploads that outlast the moment', 'The limits in hint, shown before people choose', 'useUploadQueue in the page, so uploads go on while the dialog is closed', 'docked for uploads that follow people from page to page'],
      avoid: ['One small file in a form: the file input', 'Blocking the page while files upload', 'A failure without its reason, or a retry that cannot help (a file too large)', 'Removing finished rows by themselves: people clear them'],
      related: ['file-row', 'drop-zone', 'progress-bar', 'file-browser', 'file-input'],
      states: [['Waiting', 'A bar at 0% named Waiting, with Cancel', 'queued'], ['Uploading', 'The bar and its percent in the data font, with Cancel', 'uploading'], ['Uploaded', 'A success Badge with its icon', 'done'],
        ['Failed', 'The danger icon, the reason and Try again (not for a refused type or size)', 'error'], ['Canceled', 'A neutral Badge; More actions › Upload again', 'canceled'], ['Collapsed', 'The panel shows its head and the overall bar only', '.is-collapsed']],
      map: [[CAR, 'File uploader', 'Partial'], [POL, 'Drop zone', 'Partial'], [SPE, 'Drop zone', 'Partial'], [FLU, 'Progress bar (files)', 'Partial'], [MAT, 'Progress indicators', 'Partial'], ['Frappe', 'File uploader dialog', 'Direct']],
      variantPages: [
        vp('Upload panel', 'Variant', 'Panel (default)', { variant: 'panel' }, 'A framed panel: what is happening, Cancel all or Clear finished, the toggle that hides the list, the overall bar and counts, then the queue.', 'Uploads people keep working beside', 'Starting an upload: the dialog'),
        vp('Upload dialog', 'Variant', 'Dialog', { variant: 'dialog' }, 'The drop zone with Choose files and Choose a folder and the limits, then the summary and the queue; Done closes it and the uploads go on.', 'Starting an upload from a command', 'Following uploads across pages: the panel'),
        vp('Upload progress per file', 'Rows', 'Per file progress', { variant: 'progress' }, 'Each moving file’s own bar named by its file, its percent in the data font and Cancel; waiting files show 0%.', 'Several files at once', 'One overall bar only: people cannot cancel one file'),
        vp('Upload retry', 'Rows', 'Retry', { variant: 'retry' }, 'A failed file says why in words with Try again; a refused type or size says why without it.', 'Connections that fail and recover', 'Retrying what cannot work: a file too large'),
        vp('Docked upload panel', 'Placement', 'Docked', { variant: 'docked' }, 'The panel over the page at the window’s bottom end, raised; across the bottom on a narrow window.', 'Uploads that go on while people move between pages', 'A page with one upload area: in place')
      ],
      examples: [
        ['Variant', [
          ['Panel (default)', function () { return h(Uploads, { start: 4 }); }, 'plx-upload-manager--panel', 'variant=' + q('panel')],
          ['Dialog', function () { return h(Uploads, { variant: 'dialog' }); }, 'plx-upload-manager--dialog', 'variant=' + q('dialog')]], { prop: 'variant' }],
        ['Placement', [
          ['Docked', function () { return h(Uploads, { docked: true }); }, 'plx-upload-manager--docked', 'docked']], { prop: 'docked' }],
        ['Rows', [
          ['Per file progress', function () { return h(Rows, { kind: 'progress' }); }, null, 'items={…} (uploading, queued)'],
          ['Retry', function () { return h(Rows, { kind: 'retry' }); }, null, 'error onRetry']]],
        ['A panel with its drop zone: drop real files, or add the samples (the one named “fail” fails half way)', function () { return h(Uploads, { dropZone: true }); }],
        ['Type and size checked first: only images up to 4 MB', function () { return h(Uploads, { start: 4, accept: 'image/*', maxSize: 4000000 }); }]] },

    /* ── 12 Specialized › Files, assets, and DAM › Version comparison: VersionCompare ── */
    { id: 'version-comparison', lab: true, icon: 'doc-search', sec: 'specialized', sub: FILES, leaf: 'Version comparison', title: 'Version comparison',
      plenix: 'VersionCompare, diffLines', src: 'patterns/VersionCompare/VersionCompare.jsx', level: 'Pattern', interaction: 'Selection',
      aliases: ['Compare versions', 'Version diff', 'Before and after', 'Text diff', 'Revision comparison'],
      text: 'What changed between two versions of one item. The two version pickers (Compare … with …, and Swap) sit above the comparison, in one of three views: side by side, with the changed attributes marked (side by side); the two pictures over each other, with the line people move (slider); or the text’s lines, with the added and removed ones marked and Previous and Next change to step through them (text diff).',
      use: ['Reviewing changes before approving', 'Choosing a version to restore', 'The text diff for documents, captions and descriptions', 'The slider for pictures of the same size'],
      avoid: ['Only metadata changed: side by side with Show only differences', 'Different items: Related assets', 'Changes told by color alone: each line has its sign and its word', 'Sides without their version and date'],
      related: ['comparison-view', 'version-history', 'version-label'],
      states: [['Default', 'The two versions compared', 'The default'], ['A change in focus', 'Previous or Next change puts the focus on the change’s first line', ':focus-visible'], ['Folded', 'A long unchanged run shows as one button', 'Show N unchanged lines'], ['No changes', 'The text is the same: a success empty state', 'same text']],
      map: [[SPE, 'Compare (general practice)', 'Partial'], [CAR, 'Comparison (pattern)', 'Partial'], [ATL, 'Page history diff', 'Partial']],
      variantPages: [
        vp('Version comparison side by side', 'View', 'Side by side (default)', { variant: 'columns' }, 'A pane per version with its name, date and author, its picture and its attributes in aligned rows; the second’s changed values carry the Changed badge.', 'Pictures and attributes together', 'Long text: the text diff'),
        vp('Version comparison slider', 'View', 'Slider', { variant: 'slider' }, 'The first version’s picture before the line, the second’s after it; the Platform Slider moves the line.', 'Small visual changes in pictures of the same size', 'Pictures of different sizes'),
        vp('Version comparison text diff', 'View', 'Text diff', { variant: 'text' }, 'The lines in the data font with both line numbers. An added line has a plus and Added on the success soft surface; a removed line a minus and Removed on the danger soft surface. Long unchanged runs fold; Previous and Next change step through the changes.', 'Documents, captions and descriptions', 'Pictures: the slider')
      ],
      examples: [
        ['View', [
          ['Side by side (default)', function () { return h(Compare, null); }, 'plx-version-compare--columns', 'mode=' + q('columns')],
          ['Slider', function () { return h(Compare, { mode: 'slider' }); }, 'plx-version-compare--slider', 'mode=' + q('slider')],
          ['Text diff', function () { return h(Compare, { mode: 'text' }); }, 'plx-version-compare--text', 'mode=' + q('text')]], { prop: 'mode' }],
        ['Versions 1 and 3: pick any two, Swap reverses them', function () { return h(Compare, { mode: 'text', props: { defaultBase: 'v1', defaultTarget: 'v3' } }); }],
        ['Only the text diff (modes)', function () { return h(Compare, { props: { modes: ['text'], context: 1 } }); }]] }
  ];
});
