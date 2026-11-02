/* Plenix · FileRow, FileRowList
   Summary: One file or folder as a line in a list (12 Specialized › Files, assets, and DAM › File row): a checkbox to
     select it, the File (its type icon and its name, which opens it), its facts in their own cells (size, date, owner,
     a status Badge), and its actions at the end: Download, and a More actions menu with Rename… and Delete. While it
     moves (an upload, a download) the row shows its progress, and an error with Try again when the transfer fails.
   Usage:
     <FileRowList label="Uploads">
       <FileRow as="li" file={{ name: 'Letterhead.pdf', size: 1240000, modified: '2026-10-14' }} owner="Maya Chen"
         selectable selected={sel.includes('f1')} onSelectChange={(on) => toggle('f1', on)} onOpen={() => view('f1')}
         onDownload={() => download('f1')} onRename={(name) => rename('f1', name)} onDelete={() => remove('f1')} names={others} />
       <FileRow as="li" file={{ name: 'Cross 014.png', size: 482000 }} progress={42} progressLabel="Uploading" onCancel={stop} />
       <FileRow as="li" file={{ name: 'Border 007.svg', size: 96000 }} error="The connection was lost." onRetry={retry} />
     </FileRowList>
   Props:
     file: what the row shows: File's props ({ name, kind, size, modified, type, src, count, open }); required
     as: the row's element: "div" (default) | "li" (inside a <ul>, so a screen reader counts the files)
     selectable: a checkbox at the start named "Select {name}" (default false)
     selected: the row is selected (its checkbox is checked and the row takes the selected fill); default false
     onSelectChange(checked, event): runs when the checkbox changes
     href, onOpen(): the name opens the file (a link to its page, or a button that opens a viewer or the folder)
     owner: who owns it (text), a cell after the facts
     status: a status Badge (with its icon), a cell after the owner
     progress: a transfer under way: how much is done, 0 to 100 (a ProgressBar in place of the facts and the actions
       other than Cancel); leave it out when no transfer runs
     progressLabel: what the transfer is ("Uploading", "Downloading"); the bar's accessible name with the file's name
     onCancel(): shows Cancel during a transfer
     error: a failed transfer or a file that cannot be opened: the reason, in words (the row takes the error state)
     onRetry(): shows Try again beside the error
     onDownload(): shows the Download button
     onRename(name): Rename… in the More actions menu: the rename dialog (RenameAction, the extension kept)
     names: the other names in the same folder; a new name may not be one of them
     onDelete(file): Delete in the More actions menu: the confirmation (DeleteFlow) and then this
     deleteVariant: DeleteFlow's variant: "confirm" (default) | "trash" | "undo"; onRestore(file): its Undo
     actions: more menu items (MenuItem) at the top of the More actions menu
     strings: the words, for other languages: { select: "Select {name}", more: "More actions for {name}", download:
       "Download {name}", rename: "Rename…", delete: "Delete", cancel: "Cancel", retry: "Try again", transfer:
       "{label} {name}", uploading: "Uploading", file: "file", files: "files", folder: "folder",
       folders: "folders", items: "{n} items", item: "{n} item" }
     className: more classes on the row
     FileRowList.label: the list's accessible name ("Attachments", "Uploads"); FileRowList.children: its FileRows (as="li")
     FileRowList.className: more classes on the <ul>
   Behavior:
     The row is not one big target: the checkbox selects, the name opens, each action is its own button; each is a Tab
       stop in reading order, always visible (never only on hover).
     The row takes the hover fill under the pointer and the selected fill while selected; a failed row keeps its fill and
       shows the danger icon and the reason in words.
     Rename… opens the rename dialog with the base name selected; Delete asks first (or deletes with Undo, by
       deleteVariant) and says what happened in a toast.
     During a transfer the bar is a progressbar named "{label} {name}"; the percent beside it is in the data font.
   Notes:
     Rows go in a FileRowList (as="li": a <ul> without bullets, a line above the first row) for uploads, attachments
       and pickers. Files people compare by column (size, date, owner, sorted and filtered) belong in the DataGrid.
     Other props pass through to the row element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatBytes, formatDate, formatNumber, formatPercent, dateTimeAttr } from '../../utils/format.ts';
import { File } from '../File/File.jsx';
import { Checkbox } from '../Checkbox/Checkbox.tsx';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Menu, MenuItem, MenuDivider } from '../Menu/Menu.jsx';
import { ProgressBar } from '../ProgressBar/ProgressBar.tsx';
import { RenameAction } from '../../patterns/RenameAction/RenameAction.jsx';
import { DeleteFlow } from '../../patterns/DeleteFlow/DeleteFlow.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import DownloadTrayIcon from 'plenix-platform/icons/plenix/download-tray';
import MoreIcon from 'plenix-platform/icons/plenix/more';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import RenameIcon from 'plenix-platform/icons/plenix/rename';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import { fill } from '../../utils/fill.ts';

export function FileRow({ file, as = 'div', selectable = false, selected = false, onSelectChange, href, onOpen, owner, status,
  progress, progressLabel, onCancel, error, onRetry, onDownload, onRename, names, onDelete, deleteVariant = 'confirm', onRestore,
  actions, strings, className, ...rest }) {
  const t = useStrings('fileRow', strings);
  const f = file || {};
  const name = f.name || '';
  const folder = f.kind === 'folder';
  const [ask, setAsk] = React.useState(null);   // "rename" | "delete"
  const moving = typeof progress === 'number';
  const menu = !moving && (onRename || onDelete || actions);
  const withActions = !!(menu || onDownload);
  const Tag = as === 'li' ? 'li' : 'div';
  // the File without its facts: the facts are the row's own cells
  const fileProps = { name, kind: f.kind, type: f.type, src: f.src, icon: f.icon, open: f.open };

  return (
    <Tag className={cx('plx-file-row', moving && 'plx-file-row--progress', withActions && 'plx-file-row--actions', selected && 'is-selected', error && 'is-error', className)} {...rest}>
      {selectable ? (
        <span className="plx-file-row__select">
          <Checkbox aria-label={fill(t.select, { name })} checked={!!selected} onChange={(e) => onSelectChange && onSelectChange(e.target.checked, e)} />
        </span>
      ) : null}
      <span className="plx-file-row__file"><File {...fileProps} href={href} onOpen={onOpen} /></span>
      {error ? (
        <span className="plx-file-row__error" role="alert">
          <span className="plx-file-row__error-icon"><Icon name={AlertIcon} /></span>
          <span className="plx-file-row__error-text">{error}</span>
        </span>
      ) : moving ? (
        <span className="plx-file-row__progress">
          <ProgressBar className="plx-file-row__bar" size="sm" value={Math.max(0, Math.min(100, progress))} label={fill(t.transfer, { label: progressLabel || t.uploading, name })} labelHidden />
          <span className="plx-file-row__percent" aria-hidden="true">{formatPercent(Math.max(0, Math.min(100, progress)) / 100)}</span>
        </span>
      ) : (
        <>
          <FileFacts file={f} t={t} />
          {owner ? <span className="plx-file-row__cell plx-file-row__owner">{owner}</span> : null}
          {status ? <span className="plx-file-row__cell plx-file-row__status">{status}</span> : null}
        </>
      )}
      {withActions || (moving && onCancel) || (error && onRetry) ? (
        <span className="plx-file-row__actions">
          {error && onRetry ? <Button size="xs" icon={RefreshIcon} onClick={onRetry}>{t.retry}</Button> : null}
          {moving && onCancel ? <Button size="xs" variant="ghost" onClick={onCancel}>{t.cancel}</Button> : null}
          {!moving && onDownload ? <Button size="xs" variant="ghost" iconOnly icon={DownloadTrayIcon} label={fill(t.download, { name })} onClick={onDownload} /> : null}
          {menu ? (
            <Menu label={fill(t.more, { name })} placement="bottom-end" trigger={<Button size="xs" variant="ghost" iconOnly icon={MoreIcon} label={fill(t.more, { name })} />}>
              {actions || null}
              {actions && (onRename || onDelete) ? <MenuDivider /> : null}
              {onRename ? <MenuItem icon={RenameIcon} onSelect={() => setAsk('rename')}>{t.rename}</MenuItem> : null}
              {onDelete ? <MenuItem icon={TrashIcon} danger onSelect={() => setAsk('delete')}>{t.delete}</MenuItem> : null}
            </Menu>
          ) : null}
        </span>
      ) : null}
      {onRename ? (
        <RenameAction variant="dialog" open={ask === 'rename'} onClose={() => setAsk(null)} value={name} extension={!folder} names={names} onRename={onRename} />
      ) : null}
      {onDelete ? (
        <DeleteFlow variant={deleteVariant} open={ask === 'delete'} onClose={() => setAsk(null)} items={[{ id: f.id || name, label: name }]}
          noun={folder ? t.folder : t.file} plural={folder ? t.folders : t.files} onDelete={() => onDelete(f)} onRestore={onRestore ? () => onRestore(f) : undefined} />
      ) : null}
    </Tag>
  );
}

// the facts as cells: the size (or a folder's count) and the date, each in the data font
function FileFacts({ file, t }) {
  const folder = file.kind === 'folder';
  const size = folder ? (typeof file.count === 'number' ? fill(file.count === 1 ? t.item : t.items, { n: formatNumber(file.count) }) : '')
    : typeof file.size === 'number' ? formatBytes(file.size) : (file.size || '');
  return (
    <>
      <span className="plx-file-row__cell plx-file-row__size">{size}</span>
      {file.modified ? <time className="plx-file-row__cell plx-file-row__date" dateTime={typeof file.modified === 'string' ? file.modified : dateTimeAttr(file.modified)}>{formatDate(file.modified, { dateStyle: 'medium' })}</time> : null}
    </>
  );
}

export function FileRowList({ label, className, children, ...rest }) {
  return <ul className={cx('plx-file-row-list', className)} aria-label={label} {...rest}>{children}</ul>;
}
