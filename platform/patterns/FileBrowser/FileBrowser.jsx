/* Plenix · FileBrowser
   Summary: Finding, organizing and acting on files by place (12 Specialized › Files, assets, and DAM › File browser): the
     location as Breadcrumbs (breadcrumbs), the command bar over the folder (New folder and Upload; the search; Sort and
     View; the count; with items selected: Download, Move to and Delete), an optional folder tree at the start (tree), and
     the folder's content as a FileList (list) or a grid of MediaCards (grid). Files drag onto folders, in the list, the
     grid and the tree, with Move to as the way without dragging; files dropped from the computer upload into the open
     folder. Built from Platform components only: CommandBar, SortPanel and ViewMenu as they are.
   Usage:
     <FileBrowser label="Files" root={{ name: 'Library' }} items={items} defaultFolder="brand"
       tree onOpenFile={open} onCreateFolder={(name, parent) => add(name, parent)} onUpload={(files, folder) => upload(files, folder)}
       onRename={(item, name) => rename(item, name)} onDelete={(list) => remove(list)} onMove={(list, folder) => move(list, folder)}
       onDownload={(list) => download(list)} />
   Props:
     items: every file and folder, flat: [{ id, name, kind: "file" | "folder", parent (the folder's id; null or missing at
       the root), size, count, modified, owner, status, type, src }] (FileList's file shape plus parent) (required)
     root: the top of the hierarchy: { id (default null), name (default strings.root) }
     folder: the open folder's id, kept by the page (null: the root)
     defaultFolder: the first open folder when the browser keeps it (default the root)
     onFolderChange(id): runs when people open another folder
     view: "list" (a FileList) | "grid" (MediaCards in a ContentGrid), kept by the page
     defaultView: the first view when the browser keeps it (default "list"; View in the bar changes it)
     onViewChange(view): runs when people choose another view
     listView: the list's look: "list" (default: FileRows) | "table" (the DataGrid)
     tree: the folder tree at the start, its width resizable (default false); hidden on a narrow browser (under 600px of
       its own width), where the breadcrumbs lead
     breadcrumbs: the location above the bar (default true)
     selectable: rows and cards select for the bar's selection commands (default true)
     selected: the selected items' ids, kept by the page
     onSelectionChange(ids): runs when people select or clear items
     onOpenFile(file): opening a file (a folder opens in place)
     hrefFor(item): an item's name is a link to its page instead
     onCreateFolder(name, parentId): New folder in the bar asks for a name and runs this
     onUpload(files, folderId): Upload in the bar opens the system's file picker; files dropped from the computer onto the
       content upload into the open folder
     onDownload(items): Download in a row and in the selection's commands
     onRename(item, name): Rename… in a row's More actions
     onDelete(items): Delete in a row and in the selection's commands (it asks first)
     onMove(items, folderId): dragging onto a folder, Move to in a row and in the selection's commands (null: the root)
     actions: more commands for the bar, after New folder and Upload (CommandBar's actions)
     strings: { label: "Files", root: "Library", newFolder: "New folder", folderName: "Folder name", create: "Create",
       upload: "Upload", search: "Search this folder", folders: "Folders", path: "Location", count: "{n} items", one:
       "1 item", empty: "This folder is empty", emptyText: "Upload files or create a folder.", noMatch: "Nothing matches
       “{q}”", download: "Download", moveTo: "Move to", delete: "Delete", noun: "item", plural: "items", drop: "Drop
       files to upload to {folder}", nameTaken: "A file or folder named “{name}” is already here.", nameEmpty: "Give the
       folder a name.", items: "{n} items", item: "{n} item" }
     className: more classes on the browser
   Behavior:
     Opening a folder (its name, a breadcrumb, the tree) moves into it: the search clears, the selection clears, the view,
       the sort and the tree stay. The open folder is the tree's selected item; its parents open in the tree.
     The bar is the CommandBar: with nothing selected, New folder, Upload, the search, Sort, View and the count; with items
       selected, Download, Move to (a menu of folders) and Delete (asks first), and "× N selected".
     The search finds names in the open folder and every folder inside it.
     Dragging: a file follows the pointer and every folder that takes it (a row, a card, a tree item) shows its drop
       outline; the keyboard picks a focused file up with Space and moves between folders with the arrow keys. Each move
       is announced. Files dragged in from the computer show the drop overlay over the content.
     The tree pane is a Resizable: its edge drags in size-token steps, the arrow keys step it, and its menu offers
     ; the tree itself is one Tab stop with the arrow keys (Tree).
   Notes:
     The browser never changes the items by itself: every change goes to the page through its handlers, which keep items.
     A picker that only chooses a file is the File picker, not this. Assets with rights and renditions show as asset
     cards (MediaCard type and status) in the grid.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatBytes, formatNumber } from '../../utils/format.ts';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import { Tree } from '../../components/Tree/Tree.jsx';
import { MediaCard } from '../../components/Card/Card.jsx';
import { fileIcon, fileExtension } from '../../components/File/File.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { DropZone } from '../../components/DropZone/DropZone.tsx';
import { Resizable } from '../../components/Resizable/Resizable.jsx';
import { PromptDialog } from '../../components/Dialog/Dialog.jsx';
import { CommandBar, CommandBarSearch } from '../CommandBar/CommandBar.jsx';
import { SortPanel } from '../SortPanel/SortPanel.jsx';
import { ViewMenu } from '../ViewMenu/ViewMenu.jsx';
import { ContentGrid } from '../ContentGrid/ContentGrid.jsx';
import { DeleteFlow } from '../DeleteFlow/DeleteFlow.jsx';
import { FileList, sortFiles } from '../FileList/FileList.jsx';
import { useDraggable, useDropTarget } from '../../utils/dnd.ts';
import { useSelection } from '../../hooks/useSelection.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import DownloadTrayIcon from 'plenix-platform/icons/plenix/download-tray';
import FolderIcon from 'plenix-platform/icons/plenix/folder';
import FolderAddIcon from 'plenix-platform/icons/plenix/folder-add';
import FolderOpenIcon from 'plenix-platform/icons/plenix/folder-open';
import MoveIcon from 'plenix-platform/icons/plenix/move';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import UploadIcon from 'plenix-platform/icons/plenix/upload';
import { fill } from '../../utils/fill.ts';

const ROOT = '__plx-root';
const DRAG = 'plx-file';
const keyOf = (id) => (id === null || id === undefined ? ROOT : id);
// the fields Sort offers (utils/fields.ts)
const SORT_FIELDS = [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'size', label: 'Size', kind: 'number' }, { value: 'modified', label: 'Modified', kind: 'date' }];
const CARD_SIZE = { s: 'sm', m: 'md', l: 'lg' };

// a folder's name in the tree: a drop target for dragged files
function TreeTarget({ id, name, onMove, children }) {
  const drop = useDropTarget({ name, accepts: (data, type) => type === DRAG && keyOf(data.parent) !== id, onDrop: (data) => onMove([data], id === ROOT ? null : id), disabled: !onMove });
  return <span {...drop.props} className={cx('plx-file-browser__target', drop.props.className)}>{children}</span>;
}

// one card of the grid: a file drags onto folders, a folder takes files
function GridItem({ item, onMove, children }) {
  const folder = item.kind === 'folder';
  const drag = useDraggable({ data: item, type: DRAG, name: item.name, handle: false, disabled: folder || !onMove });
  const drop = useDropTarget({ name: item.name, accepts: (data, type) => type === DRAG && data.id !== item.id, onDrop: (data) => onMove([data], item.id), disabled: !folder || !onMove });
  const props = !onMove ? {} : folder ? drop.props : drag.props;
  return <div {...props} className={cx('plx-file-browser__card', props.className)}>{children}</div>;
}

export function FileBrowser({ items = [], root, folder, defaultFolder, onFolderChange, view, defaultView = 'list', onViewChange, listView = 'list', tree = false,
  breadcrumbs = true, selectable = true, selected, onSelectionChange, onOpenFile, hrefFor, onCreateFolder, onUpload, onDownload, onRename, onDelete, onMove,
  actions = [], strings, className }) {
  const t = useStrings('fileBrowser', strings);
  const top = { id: root && root.id !== undefined ? root.id : null, name: (root && root.name) || t.root };
  const [ownFolder, setOwnFolder] = React.useState(defaultFolder === undefined ? top.id : defaultFolder);
  const current = keyOf(folder === undefined ? ownFolder : folder);
  const [ownView, setOwnView] = React.useState({ layout: defaultView === 'grid' ? 'gallery' : 'list', size: 'm', height: 'short' });
  const layout = view === undefined ? ownView.layout : view === 'grid' ? 'gallery' : 'list';
  const [ownSel, setOwnSel] = React.useState([]);
  const sel = selected === undefined ? ownSel : selected;
  const setSel = (next) => { if (selected === undefined) setOwnSel(next); if (onSelectionChange) onSelectionChange(next); };
  const [sort, setSort] = React.useState([]);
  const [q, setQ] = React.useState('');
  const [asking, setAsking] = React.useState(null);   // "folder" | "delete"
  const [over, setOver] = React.useState(false);
  const depth = React.useRef(0);
  const picker = React.useRef(null);

  // the hierarchy
  const folders = items.filter((x) => x.kind === 'folder');
  const byId = {}; items.forEach((x) => { byId[x.id] = x; });
  const kids = (id) => items.filter((x) => keyOf(x.parent) === id);
  const nameOf = (id) => (id === ROOT ? top.name : byId[id] ? byId[id].name : top.name);
  const pathTo = (id) => { const out = []; let at = id; const seen = {}; while (at !== ROOT && byId[at] && !seen[at]) { seen[at] = true; out.unshift(at); at = keyOf(byId[at].parent); } return [ROOT].concat(out); };
  const inside = (id) => { const out = []; const walk = (p) => kids(p).forEach((x) => { out.push(x); if (x.kind === 'folder') walk(x.id); }); walk(id); return out; };
  const path = pathTo(current);

  const go = (id) => {
    const k = keyOf(id);
    if (folder === undefined) setOwnFolder(k === ROOT ? top.id : k);
    if (onFolderChange) onFolderChange(k === ROOT ? top.id : k);
    setQ(''); setSel([]);
  };
  const setLayout = (v) => { if (view === undefined) setOwnView(v); if (onViewChange) onViewChange(v.layout === 'gallery' ? 'grid' : 'list'); };
  const viewValue = Object.assign({}, ownView, { layout });

  // what the open folder shows: its children (with a folder's count), or the search's matches inside it
  const withCount = (x) => (x.kind === 'folder' && typeof x.count !== 'number' ? Object.assign({}, x, { count: kids(x.id).length }) : x);
  const query = q.trim().toLowerCase();
  const shown = (query ? inside(current).filter((x) => String(x.name).toLowerCase().indexOf(query) >= 0) : kids(current)).map(withCount);
  const order = sort[0] ? { field: sort[0].field, dir: sort[0].dir } : { field: 'name', dir: 'asc' };
  // the grid's selection model: a click toggles a card, Shift extends from the last one picked, Ctrl or ⌘ toggles
  const pick = useSelection({ items: sortFiles(shown, order).map((x) => x.id), mode: 'multiple', selected: sel, onChange: setSel });
  const move = onMove ? (list, to) => onMove(list, to === ROOT ? null : to) : undefined;
  const chosen = sel.map((id) => byId[id]).filter(Boolean);
  // where the selection can go: every folder but the chosen folders, the ones inside them and the open one
  const blocked = {}; chosen.forEach((x) => { blocked[x.id] = true; if (x.kind === 'folder') inside(x.id).forEach((y) => { blocked[y.id] = true; }); });
  const targets = [{ id: ROOT, name: top.name }].concat(folders).filter((f) => !blocked[f.id] && keyOf(f.id) !== current);

  const countText = shown.length === 1 ? t.one : fill(t.count, { n: formatNumber(shown.length) });
  const bar = (
    <CommandBar label={nameOf(current)} count={countText}
      actions={[].concat(
        onCreateFolder ? [{ id: 'new-folder', label: t.newFolder, icon: FolderAddIcon, onSelect: () => setAsking('folder') }] : [],
        onUpload ? [{ id: 'upload', label: t.upload, icon: UploadIcon, onSelect: () => picker.current && picker.current.click() }] : [],
        actions)}
      find={<CommandBarSearch value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder={t.search} aria-label={t.search} />}
      view={<><SortPanel fields={SORT_FIELDS} value={sort} onChange={(v) => setSort(v.slice(0, 1))} /><ViewMenu value={viewValue} onChange={setLayout} /></>}
      selection={selectable ? { count: sel.length, noun: t.noun, plural: t.plural, onClear: () => setSel([]), actions: [].concat(
        onDownload ? [{ id: 'download', label: t.download, icon: DownloadTrayIcon, onSelect: () => onDownload(chosen) }] : [],
        move ? [{ id: 'move', label: t.moveTo, icon: MoveIcon, items: targets.map((f) => ({ id: String(f.id), label: f.name, icon: FolderIcon, onSelect: () => { move(chosen, keyOf(f.id)); setSel([]); } })) }] : [],
        onDelete ? [{ id: 'delete', label: t.delete, icon: TrashIcon, danger: true, onSelect: () => setAsking('delete') }] : []) } : undefined} />
  );

  const empty = (
    <EmptyState icon={FolderOpenIcon} title={query ? fill(t.noMatch, { q: q.trim() }) : t.empty}
      action={!query && onUpload ? <Button icon={UploadIcon} onClick={() => picker.current && picker.current.click()}>{t.upload}</Button> : undefined}>
      {query ? null : t.emptyText}
    </EmptyState>
  );

  let content;
  if (layout === 'gallery') {
    const cards = sortFiles(shown, order);
    content = cards.length ? (
      <ContentGrid label={nameOf(current)} size={CARD_SIZE[viewValue.size] || 'md'} className="plx-file-browser__grid">
        {cards.map((x) => {
          const isFolder = x.kind === 'folder';
          const ext = fileExtension(x.name);
          const facts = isFolder ? fill(x.count === 1 ? t.item : t.items, { n: formatNumber(x.count || 0) })
            : [ext ? ext.toUpperCase() : null, typeof x.size === 'number' ? formatBytes(x.size) : null].filter(Boolean).join(' · ');
          return (
            <GridItem key={x.id} item={x} onMove={move}>
              <MediaCard src={x.src} alt="" icon={isFolder ? FolderIcon : fileIcon(x.name, x.type)} title={x.name} meta={facts} aspect="4/3"
                status={x.status} selected={sel.indexOf(x.id) >= 0} selecting={sel.length > 0}
                onSelectChange={selectable ? (on, e) => pick.choose(x.id, e) : undefined}
                href={hrefFor ? hrefFor(x) : undefined} onOpen={hrefFor ? undefined : isFolder ? () => go(x.id) : onOpenFile ? () => onOpenFile(x) : undefined} />
            </GridItem>
          );
        })}
      </ContentGrid>
    ) : empty;
  } else {
    content = (
      <FileList label={nameOf(current)} files={shown} view={listView} sort={order} onSortChange={(o) => setSort([o])} selectable={selectable} selected={sel} onSelectionChange={setSel}
        hrefFor={hrefFor} onOpen={(x) => (x.kind === 'folder' ? go(x.id) : onOpenFile && onOpenFile(x))}
        onDownload={onDownload ? (x) => onDownload([x]) : undefined} onRename={onRename} onDelete={onDelete ? (x) => onDelete([x]) : undefined}
        dragType={move ? DRAG : undefined} onMove={move ? (x, to) => move([x], to.id) : undefined}
        moveTargets={move ? [{ id: top.id, name: top.name }].concat(folders) : undefined} rowHeight={viewValue.height} empty={empty} />
    );
  }

  // the tree: the root and every folder, the open folder's parents open
  const node = (f) => {
    const sub = folders.filter((x) => keyOf(x.parent) === f.id);
    return { id: f.id, label: <TreeTarget id={f.id} name={f.name} onMove={move}>{f.name}</TreeTarget>, icon: FolderIcon, children: sub.length ? sub.map(node) : undefined };
  };
  const [open, setOpen] = React.useState([]);
  const expanded = Array.from(new Set(open.concat(path.slice(0, -1))));
  const treeEl = tree ? (
    <div className="plx-file-browser__tree">
      <Resizable label={t.folders} axis="horizontal" defaultWidth={240} minWidth={160} maxWidth={400} className="plx-file-browser__pane">
        <div className="plx-file-browser__tree-scroll" tabIndex={0} role="region" aria-label={t.folders}>
          <Tree label={t.folders} nodes={[node({ id: ROOT, name: top.name })]} selected={current} onSelect={go} expanded={expanded} onExpandedChange={setOpen} />
        </div>
      </Resizable>
    </div>
  ) : null;

  // files dragged in from the computer: the drop overlay over the content, then onUpload
  const hasFiles = (e) => Array.from((e.dataTransfer && e.dataTransfer.types) || []).indexOf('Files') >= 0;
  const dropProps = onUpload ? {
    onDragEnter: (e) => { if (!hasFiles(e)) return; e.preventDefault(); depth.current += 1; setOver(true); },
    onDragOver: (e) => { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; },
    onDragLeave: (e) => { if (!hasFiles(e)) return; depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false); },
    onDrop: (e) => { if (!hasFiles(e)) return; e.preventDefault(); depth.current = 0; setOver(false); const list = Array.from(e.dataTransfer.files || []); if (list.length) onUpload(list, current === ROOT ? top.id : current); },
  } : {};

  const names = kids(current).map((x) => String(x.name).toLowerCase());
  return (
    <section className={cx('plx-file-browser', 'plx-file-browser--' + (layout === 'gallery' ? 'grid' : 'list'), tree && 'plx-file-browser--tree', breadcrumbs && 'plx-file-browser--breadcrumbs', className)} aria-label={t.label}>
      {breadcrumbs ? (
        <Breadcrumbs label={t.path} className="plx-file-browser__path" items={path.map((id) => ({ label: nameOf(id),
          href: hrefFor && id !== ROOT && byId[id] ? hrefFor(byId[id]) : '#' + encodeURIComponent(id === ROOT ? 'root' : String(id)),
          onClick: (e) => { if (!hrefFor) { e.preventDefault(); go(id); } } }))} />
      ) : null}
      {bar}
      <div className="plx-file-browser__body">
        {treeEl}
        <div className="plx-file-browser__content" {...dropProps}>
          {content}
          {onUpload && over ? <DropZone overlay active className="plx-file-browser__drop">{fill(t.drop, { folder: nameOf(current) })}</DropZone> : null}
        </div>
      </div>
      {onUpload ? <input ref={picker} type="file" multiple hidden aria-label={t.upload} onChange={(e) => { const list = Array.from(e.target.files || []); if (list.length) onUpload(list, current === ROOT ? top.id : current); e.target.value = ''; }} /> : null}
      {onCreateFolder ? (
        <PromptDialog open={asking === 'folder'} title={t.newFolder} label={t.folderName} confirmLabel={t.create}
          validate={(v) => (!v.trim() ? t.nameEmpty : names.indexOf(v.trim().toLowerCase()) >= 0 ? fill(t.nameTaken, { name: v.trim() }) : '')}
          onSubmit={(v) => { setAsking(null); onCreateFolder(v.trim(), current === ROOT ? top.id : current); }} onCancel={() => setAsking(null)} />
      ) : null}
      {onDelete ? (
        <DeleteFlow open={asking === 'delete'} onClose={() => setAsking(null)} items={chosen.map((x) => ({ id: x.id, label: x.name }))} noun={t.noun} plural={t.plural}
          onDelete={() => { onDelete(chosen); setSel([]); }} />
      ) : null}
    </section>
  );
}
