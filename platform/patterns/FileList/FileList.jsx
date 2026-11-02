/* Plenix · FileList
   Summary: Many files and folders at once (12 Specialized › Files, assets, and DAM › File list): a list of FileRows (list),
     the same files as a DataGrid people sort, filter and resize by column (table), or the list with its own Sort menu
     above the rows, by name, size, date or owner, folders first (sortable). Every row selects, opens, downloads, renames
     and deletes the same way (FileRow, RenameAction, DeleteFlow); files can be dragged onto folders (the drag-and-drop
     engine) with Move to as the way without dragging. Built from Platform components only.
   Usage:
     <FileList label="Files in Brand kit" files={files} onOpen={open} selectable selected={sel} onSelectionChange={setSel} />
     <FileList label="Files" view="table" files={files} columns={['size', 'modified', 'owner', 'status']} onRename={rename} onDelete={remove} />
     <FileList label="Files" sortable defaultSort={{ field: 'modified', dir: 'desc' }} files={files} />
     <FileList label="Files" files={files} dragType="file" onMove={(file, folder) => move(file, folder)} />
   Props:
     files: the files and folders: [{ id, name, kind: "file" | "folder", size (bytes), count (a folder's items), modified
       ("YYYY-MM-DD" or a Date), owner, status: { tone, icon, label } (a Badge), type (MIME), src (a small picture) }]
       (required)
     label: the list's or the table's accessible name ("Files in Brand kit") (required)
     view: "list" (default: FileRows) | "table" (the DataGrid)
     sortable: the list draws its Sort menu above the rows (the field and the direction) with the count; the table always
       sorts by its headers (default false)
     sort: the order, kept by the page: { field: "name" | "size" | "modified" | "owner", dir: "asc" | "desc" }; folders
       always come first in the list
     defaultSort: the first order when the list keeps it (default { field: "name", dir: "asc" })
     onSortChange(sort): runs when people choose another order
     columns: the facts after the name: any of "size", "modified", "owner", "status" (default ["size", "modified"], plus
       "owner" and "status" when a file has them); a list row always shows the size and the date (FileRow's cells)
     selectable: a checkbox on every row (and select all in the table's header); default false
     selected: the selected files' ids, kept by the page
     onSelectionChange(ids): runs when people check or clear rows
     onOpen(file): a name opens the file or the folder (a button)
     hrefFor(file): a name is a link to the file's page instead
     onDownload(file): the row's Download button (files only; in the table, its right-click menu)
     onRename(file, name): Rename… in More actions: the rename dialog keeps the extension and refuses a name in use
     onDelete(file): Delete in More actions: the confirmation (DeleteFlow), then this
     deleteVariant: DeleteFlow's variant: "confirm" (default) | "trash" | "undo"
     onRestore(file): the Undo of deleteVariant "undo" or "trash"
     dragType: files are dragged onto folders as items of this type (the drag-and-drop engine): a row drags anywhere but
       its controls (a long press with touch), or Space on the focused row picks it up and the arrow keys move between
       folders; the list only
     onMove(file, folder): folders take the files dropped on them (with dragType)
     moveTargets: the folders a file can move to without dragging: [{ id, name }], a Move to submenu in More actions
       (with onMove)
     rowHeight: the table's row height step ("short" default, "medium", "tall", "extra-tall")
     empty: what an empty list shows (default an EmptyState: strings.empty)
     strings: the words: { sort: "Sort", sortBy: "Sort by {field}", field: "Sort by", order: "Order", asc: "Ascending",
       desc: "Descending", name: "Name", size: "Size", modified: "Modified", owner: "Owner", status: "Status",
       count: "{n} items", one: "1 item", empty: "Nothing here yet", open: "Open", download: "Download", rename: "Rename…",
       delete: "Delete", moveTo: "Move to", file: "file", files: "files", folder: "folder", folders: "folders", items:
       "{n} items", item: "{n} item" }
     className: more classes on the list
   Behavior:
     The list is a FileRowList: each row is one Tab stop per control (the checkbox, the name, Download, More actions),
       never one big target; the row takes the hover and selected fills.
     Sort reorders the rows at once, folders first, and says the order in its button ("Sort by size"); the direction is
       its own choice in the menu.
     The table is the DataGrid: the name, then the facts in the data font (the size from bytes, the date in the reader's
       locale), the owner and the status Badge; its headers sort, its right-click menu opens, downloads, renames and
       deletes; selected rows take the DataGrid's selected fill.
     Dragging (dragType, onMove): a file follows the pointer and a folder it can go to shows the drop outline; Escape puts
       it back. Every move is announced, and Move to in More actions does the same without dragging.
     Rename and Delete open their dialogs once, at the list's level, and say what happened in a toast.
     The list's own width decides the facts its rows keep: under 720px the owner gives way, under 560px the date; the
       name, the size, the status and the actions stay.
   Notes:
     Choose the list for files people open one at a time, and the table where they compare by column (size, date,
     owner). Pictures people recognize by sight belong in a grid of MediaCards (FileBrowser's grid).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatBytes, formatDate, formatNumber } from '../../utils/format.ts';
import { File } from '../../components/File/File.tsx';
import { FileRow, FileRowList } from '../../components/FileRow/FileRow.jsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.jsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Menu, MenuItem, MenuRadioGroup, MenuSub } from '../../components/Menu/Menu.tsx';
import { RenameAction } from '../RenameAction/RenameAction.jsx';
import { DeleteFlow } from '../DeleteFlow/DeleteFlow.jsx';
import { useDraggable, useDropTarget } from '../../utils/dnd.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import DownloadTrayIcon from 'plenix-platform/icons/plenix/download-tray';
import FolderIcon from 'plenix-platform/icons/plenix/folder';
import FolderOpenIcon from 'plenix-platform/icons/plenix/folder-open';
import MoveIcon from 'plenix-platform/icons/plenix/move';
import OpenIcon from 'plenix-platform/icons/plenix/open';
import RenameIcon from 'plenix-platform/icons/plenix/rename';
import SortAscendingIcon from 'plenix-platform/icons/plenix/sort-ascending';
import SortDescendingIcon from 'plenix-platform/icons/plenix/sort-descending';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import { fill } from '../../utils/fill.ts';

const FIELDS = ['name', 'size', 'modified', 'owner'];
const idOf = (f) => (f.id === undefined ? f.name : f.id);
const stamp = (v) => (v instanceof Date ? v.toISOString() : String(v || ''));

// the order of the list: folders first, then the field, then the name
export function sortFiles(files, sort) {
  const s = Object.assign({ field: 'name', dir: 'asc' }, sort);
  const sign = s.dir === 'desc' ? -1 : 1;
  const byName = (a, b) => String(a.name || '').localeCompare(String(b.name || ''), undefined, { numeric: true, sensitivity: 'base' });
  const by = (a, b) => {
    if (s.field === 'size') return (a.kind === 'folder' ? a.count || 0 : Number(a.size) || 0) - (b.kind === 'folder' ? b.count || 0 : Number(b.size) || 0);
    if (s.field === 'modified') return stamp(a.modified).localeCompare(stamp(b.modified));
    if (s.field === 'owner') return String(a.owner || '').localeCompare(String(b.owner || ''));
    return byName(a, b);
  };
  return files.slice().sort((a, b) => {
    const fa = a.kind === 'folder' ? 0 : 1, fb = b.kind === 'folder' ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return sign * by(a, b) || byName(a, b);
  });
}

// one row of the list: a file drags onto folders, a folder takes files (the engine's props on the <li>)
function DragRow({ file, dragType, onMove, children }) {
  const folder = file.kind === 'folder';
  const drag = useDraggable({ data: file, type: dragType, name: file.name, handle: false, disabled: !dragType || folder || !onMove });
  const drop = useDropTarget({ name: file.name, accepts: (data, type) => type === dragType && idOf(data) !== idOf(file), onDrop: (data) => onMove && onMove(data, file), disabled: !dragType || !folder || !onMove });
  const props = folder ? drop.props : dragType && onMove ? drag.props : {};
  return <li {...props} className={cx('plx-file-list__item', props.className)}>{children}</li>;
}

export function FileList({ files = [], label, view = 'list', sortable = false, sort, defaultSort, onSortChange, columns, selectable = false, selected = [],
  onSelectionChange, onOpen, hrefFor, onDownload, onRename, onDelete, deleteVariant = 'confirm', onRestore, dragType, onMove, moveTargets,
  rowHeight, empty, strings, className }) {
  const t = useStrings('fileList', strings);
  const [own, setOwn] = React.useState(Object.assign({ field: 'name', dir: 'asc' }, defaultSort));
  const order = Object.assign({ field: 'name', dir: 'asc' }, sort === undefined ? own : sort);
  const setOrder = (next) => { if (sort === undefined) setOwn(next); if (onSortChange) onSortChange(next); };
  const [ask, setAsk] = React.useState(null);   // { kind: "rename" | "delete", file }
  const facts = columns || ['size', 'modified'].concat(files.some((f) => f.owner) ? ['owner'] : [], files.some((f) => f.status) ? ['status'] : []);
  const table = view === 'table';
  const rows = table ? files : sortFiles(files, order);
  const keys = selected || [];
  const toggle = (f, on) => { if (!onSelectionChange) return; const id = idOf(f); onSelectionChange(on ? keys.concat(id) : keys.filter((x) => x !== id)); };
  const others = (f) => files.filter((x) => idOf(x) !== idOf(f)).map((x) => x.name);
  // the folders a file can move to: not itself, not where it is now (a file without a parent is at the root, id null)
  const targetsFor = (f) => (moveTargets || []).filter((x) => idOf(x) !== idOf(f) && idOf(x) !== (f.parent === undefined ? null : f.parent));
  const countText = files.length === 1 ? t.one : fill(t.count, { n: formatNumber(files.length) });

  // the sort menu above the list: the field, then the direction
  const fieldLabel = t[order.field] || t.name;
  const sortMenu = sortable && !table ? (
    <Menu label={t.sort} placement="bottom-end" trigger={<Button size="sm" variant="ghost" icon={order.dir === 'desc' ? SortDescendingIcon : SortAscendingIcon} caret>{fill(t.sortBy, { field: fieldLabel.toLowerCase() })}</Button>}>
      <MenuRadioGroup label={t.field} value={order.field} onChange={(v) => setOrder(Object.assign({}, order, { field: v }))}>
        {FIELDS.filter((k) => k === 'name' || facts.indexOf(k) >= 0).map((k) => <MenuItem key={k} value={k}>{t[k]}</MenuItem>)}
      </MenuRadioGroup>
      <MenuRadioGroup label={t.order} value={order.dir} onChange={(v) => setOrder(Object.assign({}, order, { dir: v }))}>
        <MenuItem value="asc" icon={SortAscendingIcon}>{t.asc}</MenuItem>
        <MenuItem value="desc" icon={SortDescendingIcon}>{t.desc}</MenuItem>
      </MenuRadioGroup>
    </Menu>
  ) : null;

  const dialogs = (
    <>
      {onRename && ask && ask.kind === 'rename' ? (
        <RenameAction variant="dialog" open onClose={() => setAsk(null)} value={ask.file.name} extension={ask.file.kind !== 'folder'} names={others(ask.file)} onRename={(name) => onRename(ask.file, name)} />
      ) : null}
      {onDelete && ask && ask.kind === 'delete' ? (
        <DeleteFlow variant={deleteVariant} open onClose={() => setAsk(null)} items={[{ id: idOf(ask.file), label: ask.file.name }]}
          noun={ask.file.kind === 'folder' ? t.folder : t.file} plural={ask.file.kind === 'folder' ? t.folders : t.files}
          onDelete={() => onDelete(ask.file)} onRestore={onRestore ? () => onRestore(ask.file) : undefined} />
      ) : null}
    </>
  );

  if (!files.length) {
    return (
      <div className={cx('plx-file-list', 'plx-file-list--' + (table ? 'table' : 'list'), sortable && !table && 'plx-file-list--sortable', className)}>
        {empty || <EmptyState icon={FolderOpenIcon} title={t.empty} />}
      </div>
    );
  }

  let body;
  if (table) {
    const sizeText = (f) => (f.kind === 'folder' ? (typeof f.count === 'number' ? fill(f.count === 1 ? t.item : t.items, { n: formatNumber(f.count) }) : '') : typeof f.size === 'number' ? formatBytes(f.size) : (f.size || ''));
    // folders stay first whichever way the name sorts (the comparator compensates for descending order)
    const byName = (a, b, ra, rb, col, dir) => {
      const fa = ra.kind === 'folder', fb = rb.kind === 'folder';
      if (fa !== fb) return (fa ? -1 : 1) * (dir === 'desc' ? -1 : 1);
      return String(a || '').localeCompare(String(b || ''), undefined, { numeric: true, sensitivity: 'base' });
    };
    const cols = [{ title: t.name, field: 'name', kind: 'name', type: 'file', width: '--plx-ref-size-280px', sorter: byName,
      render: (f) => <File name={f.name} kind={f.kind} type={f.type} src={f.src} icon={f.icon} href={hrefFor ? hrefFor(f) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(f) : undefined} /> }];
    if (facts.indexOf('size') >= 0) cols.push({ title: t.size, field: 'size', kind: 'data', type: 'number', sorter: 'number', align: 'right', headerAlign: 'right', render: (f) => sizeText(f) });
    if (facts.indexOf('modified') >= 0) cols.push({ title: t.modified, field: 'modified', kind: 'data', type: 'date', render: (f) => (f.modified ? formatDate(f.modified, { dateStyle: 'medium' }) : '') });
    if (facts.indexOf('owner') >= 0) cols.push({ title: t.owner, field: 'owner', type: 'person' });
    if (facts.indexOf('status') >= 0) cols.push({ title: t.status, field: 'statusLabel', kind: 'center', type: 'select', render: (f) => (f.status ? <Badge tone={f.status.tone} icon={f.status.icon}>{f.status.label}</Badge> : null) });
    const menu = (f) => [].concat(
      onOpen ? [{ label: t.open, icon: f.kind === 'folder' ? FolderOpenIcon : OpenIcon, onSelect: () => onOpen(f) }] : [],
      onDownload && f.kind !== 'folder' ? [{ label: t.download, icon: DownloadTrayIcon, onSelect: () => onDownload(f) }] : [],
      onRename ? [{ label: t.rename, icon: RenameIcon, onSelect: () => setAsk({ kind: 'rename', file: f }) }] : [],
      onDelete ? [{ separator: true }, { label: t.delete, icon: TrashIcon, danger: true, onSelect: () => setAsk({ kind: 'delete', file: f }) }] : []);
    body = (
      <DataGrid label={label} index="id" data={rows.map((f) => Object.assign({}, f, { id: idOf(f), statusLabel: f.status ? f.status.label : '' }))} columns={cols}
        selectable={selectable} selected={selectable ? keys : undefined} onSelectionChange={selectable ? onSelectionChange : undefined}
        sort={[{ field: order.field === 'owner' ? 'owner' : order.field, dir: order.dir }]} rowHeight={rowHeight}
        rowMenu={onOpen || onDownload || onRename || onDelete ? menu : undefined} />
    );
  } else {
    body = (
      <FileRowList label={label} className="plx-file-list__rows">
        {rows.map((f) => {
          const id = idOf(f);
          const moves = onMove ? targetsFor(f) : [];
          return (
            <DragRow key={id} file={f} dragType={dragType} onMove={onMove}>
              <FileRow file={f} selectable={selectable} selected={keys.indexOf(id) >= 0} onSelectChange={(on) => toggle(f, on)}
                href={hrefFor ? hrefFor(f) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(f) : undefined}
                owner={facts.indexOf('owner') >= 0 ? f.owner : undefined}
                status={facts.indexOf('status') >= 0 && f.status ? <Badge tone={f.status.tone} icon={f.status.icon}>{f.status.label}</Badge> : undefined}
                onDownload={onDownload && f.kind !== 'folder' ? () => onDownload(f) : undefined}
                onRename={onRename ? (name) => onRename(f, name) : undefined} names={others(f)}
                onDelete={onDelete ? () => onDelete(f) : undefined} deleteVariant={deleteVariant} onRestore={onRestore ? () => onRestore(f) : undefined}
                actions={moves.length ? (
                  <MenuSub label={t.moveTo} icon={MoveIcon}>
                    {moves.map((x) => <MenuItem key={String(idOf(x))} icon={FolderIcon} onSelect={() => onMove(f, x)}>{x.name}</MenuItem>)}
                  </MenuSub>
                ) : undefined} />
            </DragRow>
          );
        })}
      </FileRowList>
    );
  }

  return (
    <div className={cx('plx-file-list', 'plx-file-list--' + (table ? 'table' : 'list'), sortable && !table && 'plx-file-list--sortable', className)}>
      {sortMenu ? (
        <div className="plx-file-list__bar">
          <Text variant="data" className="plx-file-list__count">{countText}</Text>
          {sortMenu}
        </div>
      ) : null}
      {body}
      {table ? dialogs : null}
    </div>
  );
}
