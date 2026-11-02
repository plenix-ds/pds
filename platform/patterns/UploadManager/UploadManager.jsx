/* Plenix · UploadManager, useUploadQueue
   Summary: Files on their way up (12 Specialized › Files, assets, and DAM › Upload manager): a drop zone that also opens
     the system's file and folder pickers, then a queue with a FileRow per file and its own progress (per file progress),
     Cancel while it moves, the reason and Try again when it fails (retry), and the overall progress and counts at the
     top. A panel people keep working beside (panel; docked to the window's bottom end, or in place), or a dialog that
     starts the upload (dialog). useUploadQueue runs the uploads, a few at a time, and checks each file's type and size
     first. Built from Platform components only: the Asset Manager's upload dialog, promoted.
   Usage:
     const queue = useUploadQueue({ upload: (file, { onProgress, signal }) => send(file, onProgress, signal), accept: 'image/*,.pdf', maxSize: 500e6 });
     <UploadManager queue={queue} variant="panel" docked onClose={() => queue.clear()} />
     <UploadManager queue={queue} variant="dialog" open={open} onClose={() => setOpen(false)} hint="PNG, JPG or PDF, up to 500 MB each." />
     <UploadManager items={rows} onCancel={stop} onRetry={again} onRemove={drop} />     (the page keeps the rows)
   Props:
     queue: a useUploadQueue() (the page keeps it, so uploads go on while the dialog is closed or the panel moves)
     upload(file, { onProgress(percent), signal }): without queue, the manager keeps its own queue and runs this for each
       file (a promise; a rejection's message is the reason shown)
     items: the rows kept by the page instead of a queue: [{ id, name, size, type, status: "queued" | "uploading" | "done" |
       "error" | "canceled", progress (0–100), error (the reason), retry (false: the failure cannot be retried, a type or
       a size refused) }]
     onAdd(files): with items, runs with the files people drop or choose
     onCancel(id): with items, Cancel on a moving row
     onRetry(id): with items, Try again on a failed row and Upload again on a canceled one
     onRemove(id): with items, Remove from the list in a finished row's More actions
     onCancelAll(): with items, Cancel all in the head
     onClear(): with items, Clear finished in the head
     variant: "panel" (default) | "dialog"
     docked: the panel sits over the page at the window's bottom end (on a narrow window across its bottom); default false
     dropZone: the drop zone at the top (default: the dialog's, not the panel's)
     accept: the types the manager's own queue takes ("image/*,.pdf"), also the file picker's
     maxSize: the largest file the manager's own queue takes, in bytes
     concurrency: how many files the manager's own queue uploads at once (default 3)
     folders: the drop zone also takes whole folders (Choose a folder; a dropped folder's files keep their path); default true
     hint: the limits, said before people choose ("PNG, JPG or PDF, up to 500 MB each.")
     title: the dialog's title (default strings.dialogTitle)
     open: the dialog is shown (default true)
     onClose(): the dialog's Done and close button; the panel's Close (shown when nothing is moving)
     defaultCollapsed: the panel starts with its list hidden (default false)
     strings: { dialogTitle: "Upload files", queue: "Uploads", drop: "Drag and drop files or folders here", or: "or",
       chooseFiles: "Choose files", chooseFolder: "Choose a folder", uploading: "Uploading {n} files", uploadingOne:
       "Uploading 1 file", done: "{n} uploads complete", doneOne: "1 upload complete", failed: "{n} uploads failed",
       failedOne: "1 upload failed", none: "No uploads", progress: "{done} of {total} uploaded", overall: "Overall
       progress", waiting: "Waiting", uploaded: "Uploaded", canceled: "Canceled", cancelAll: "Cancel all", clear: "Clear
       finished", hide: "Hide the uploads", show: "Show the uploads", close: "Close", finish: "Done", remove: "Remove
       from the list", again: "Upload again", tooLarge: "This file is larger than {max}.", wrongType: "This type of file
       can’t be uploaded here.", error: "The upload failed. Try again.", failedNamed: "{name} failed: {reason}" }
     className: more classes on the manager
     useUploadQueue(options): the queue: options { upload, accept, maxSize, concurrency: default 3, strings }; it returns
       { items, add(files), cancel(id), retry(id), remove(id), cancelAll(), clear() }; add takes File objects, or
       { file, path } from a dropped folder
   Behavior:
     Files are checked as they are added: a type the accept list refuses or a file over maxSize fails at once with the
       reason in words, and no Try again (choose another file). The others wait, then upload a few at a time.
     Each row is a FileRow: waiting and uploading rows show a bar named "Uploading {name}" and its percent in the data
       font, with Cancel; a finished row shows its status Badge with its icon; a failed one the danger icon, the reason
       and Try again; More actions removes a finished row from the list (and uploads a canceled one again).
     The head says what is happening ("Uploading 3 files", "5 uploads complete", "1 upload failed") with the overall bar
       and "4 of 7 uploaded" in the data font (canceled and refused files are not counted; the percent is by size);
       Cancel all while files move, Clear finished afterwards.
     Starting, finishing and failing are announced politely (the live region), each failure with its file and reason.
     The drop zone takes files and whole folders; Choose files and Choose a folder open the system's pickers. The queue
       scrolls past its height and is a named region in the Tab order.
     The panel hides and shows its list (its toggle says which); the dialog's uploads go on after it closes when the page
       keeps the queue.
   Notes:
     One small file in a form is the file input's own business (FileInput); use the manager for many or large files and
     for uploads that outlast the moment. Say the limits before people choose.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { formatBytes, formatNumber, formatPercent } from '../../utils/format.ts';
import { announce } from '../../utils/announce.tsx';
import { useUid } from '../../utils/layer.ts';
import { FileRow, FileRowList } from '../../components/FileRow/FileRow.jsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar.tsx';
import { DropZone } from '../../components/DropZone/DropZone.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { MenuItem } from '../../components/Menu/Menu.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import FolderOpenIcon from 'plenix-platform/icons/plenix/folder-open';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import TextCardIcon from 'plenix-platform/icons/plenix/text-card';
import UploadIcon from 'plenix-platform/icons/plenix/upload';
import UploadN2Icon from 'plenix-platform/icons/plenix/upload-2';
import { dataPhrase, dataNumber } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));
const MOVING = { queued: true, uploading: true };

// does the accept list ("image/*,.pdf") take this file?
function accepted(accept, file) {
  if (!accept) return true;
  const name = String(file.name || '').toLowerCase(), type = String(file.type || '').toLowerCase();
  return String(accept).split(',').map((x) => x.trim().toLowerCase()).filter(Boolean).some((a) => (a.charAt(0) === '.' ? name.endsWith(a)
    : /\/\*$/.test(a) ? type.indexOf(a.slice(0, -1)) === 0 : type === a));
}

// a dropped folder arrives as a directory entry: every file inside joins the queue with its folder path
function walkEntry(entry, prefix, out) {
  return new Promise((resolve) => {
    if (entry.isFile) entry.file((file) => { out.push({ file, path: prefix }); resolve(); }, () => resolve());
    else if (entry.isDirectory) {
      const reader = entry.createReader(), all = [];
      const read = () => reader.readEntries((batch) => {
        if (batch.length) { all.push(...batch); read(); } else Promise.all(all.map((e) => walkEntry(e, prefix + entry.name + '/', out))).then(resolve);
      }, () => resolve());
      read();
    } else resolve();
  });
}
function droppedFiles(dataTransfer) {
  const entries = Array.from(dataTransfer.items || []).map((it) => (it.kind === 'file' && it.webkitGetAsEntry ? it.webkitGetAsEntry() : null));
  if (!entries.length || entries.some((e) => !e)) return Promise.resolve(Array.from(dataTransfer.files || []).map((file) => ({ file, path: '' })));
  const out = [];
  return Promise.all(entries.map((e) => walkEntry(e, '', out))).then(() => out);
}

let nextId = 0;
export function useUploadQueue(options) {
  const o = options || {};
  const t = useStrings('uploadManager', o.strings);
  const [items, setItems] = React.useState([]);
  const controllers = React.useRef({});
  const latest = React.useRef(o); latest.current = o;
  const update = (id, patch) => setItems((list) => list.map((x) => (x.id === id ? Object.assign({}, x, patch) : x)));
  const start = (it) => {
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : { signal: { aborted: false }, abort() { this.signal.aborted = true; } };
    controllers.current[it.id] = ac;
    update(it.id, { status: 'uploading', progress: 0, error: undefined });
    const run = latest.current.upload;
    Promise.resolve()
      .then(() => (run ? run(it.file || it, { onProgress: (p) => { if (!ac.signal.aborted) update(it.id, { progress: clamp(p) }); }, signal: ac.signal }) : undefined))
      .then(() => { if (!ac.signal.aborted) update(it.id, { status: 'done', progress: 100 }); },
        (e) => { if (!ac.signal.aborted) update(it.id, { status: 'error', error: (e && e.message) || t.error, retry: true }); })
      .then(() => { delete controllers.current[it.id]; });
  };
  // the runner: a few at a time (concurrency), the next as one finishes
  React.useEffect(() => {
    const free = Math.max(0, (latest.current.concurrency || 3) - items.filter((x) => x.status === 'uploading').length);
    items.filter((x) => x.status === 'queued').slice(0, free).forEach(start);
  }, [items]);
  const stop = (id) => { const c = controllers.current[id]; if (c) { c.abort(); delete controllers.current[id]; } };
  return {
    items,
    add: (files) => {
      const max = latest.current.maxSize;
      const added = Array.from(files || []).map((x) => {
        const file = x && x.file ? x.file : x;
        const path = x && x.file ? x.path || '' : '';
        const row = { id: 'upl-' + (++nextId), name: path + file.name, size: file.size, type: file.type, file, status: 'queued', progress: 0 };
        if (!accepted(latest.current.accept, file)) return Object.assign(row, { status: 'error', error: t.wrongType, retry: false });
        if (max && file.size > max) return Object.assign(row, { status: 'error', error: fill(t.tooLarge, { max: formatBytes(max) }), retry: false });
        return row;
      });
      setItems((list) => list.concat(added));
    },
    cancel: (id) => { stop(id); update(id, { status: 'canceled', progress: 0 }); },
    retry: (id) => update(id, { status: 'queued', progress: 0, error: undefined }),
    remove: (id) => { stop(id); setItems((list) => list.filter((x) => x.id !== id)); },
    cancelAll: () => { setItems((list) => list.map((x) => { if (!MOVING[x.status]) return x; stop(x.id); return Object.assign({}, x, { status: 'canceled', progress: 0 }); })); },
    clear: () => setItems((list) => list.filter((x) => MOVING[x.status])),
  };
}

export function UploadManager({ queue, upload, items, onAdd, onCancel, onRetry, onRemove, onCancelAll, onClear, variant = 'panel', docked = false, dropZone, accept, maxSize,
  concurrency, folders = true, hint, title, open = true, onClose, defaultCollapsed = false, strings, className }) {
  devWarn('UploadManager', { variant }, { variant: ['panel','dialog'] });
  const t = useStrings('uploadManager', strings);
  const own = useUploadQueue({ upload, accept, maxSize, concurrency, strings });
  const q = queue || (items ? { items, add: onAdd, cancel: onCancel, retry: onRetry, remove: onRemove, cancelAll: onCancelAll, clear: onClear } : own);
  const rows = q.items || [];
  const id = useUid('plx-upload-manager');
  const [collapsed, setCollapsed] = React.useState(!!defaultCollapsed);
  const [over, setOver] = React.useState(false);
  const depth = React.useRef(0);
  const filesInput = React.useRef(null), folderInput = React.useRef(null);
  const dialog = variant === 'dialog';
  const withZone = dropZone === undefined ? dialog : !!dropZone;

  // the counts and the overall progress (weighted by size)
  const n = (s) => rows.filter((x) => x.status === s).length;
  const moving = rows.filter((x) => MOVING[x.status]).length, done = n('done'), failed = n('error'), total = rows.length;
  const weight = (x) => (typeof x.size === 'number' && x.size > 0 ? x.size : 1);
  const live = rows.filter((x) => x.status !== 'canceled' && !(x.status === 'error' && x.retry === false));
  const sum = live.reduce((a, x) => a + weight(x), 0);
  const overall = sum ? live.reduce((a, x) => a + weight(x) * (x.status === 'done' ? 100 : x.status === 'error' ? 0 : clamp(x.progress)), 0) / sum : 0;
  const headline = moving ? (moving === 1 ? t.uploadingOne : fill(t.uploading, { n: formatNumber(moving) }))
    : failed ? (failed === 1 ? t.failedOne : fill(t.failed, { n: formatNumber(failed) }))
      : done ? (done === 1 ? t.doneOne : fill(t.done, { n: formatNumber(done) })) : t.none;

  // what changes is said politely: the start, each failure, the end
  const was = React.useRef({});
  React.useEffect(() => {
    const before = was.current, now = {};
    rows.forEach((x) => { now[x.id] = x.status; if (x.status === 'error' && before[x.id] !== 'error') announce(fill(t.failedNamed, { name: x.name, reason: x.error || t.error })); });
    const wasMoving = Object.keys(before).some((k) => MOVING[before[k]]);
    if (!wasMoving && moving) announce(headline);
    if (wasMoving && !moving && total) announce(headline);
    was.current = now;
  });

  const add = (list) => { if (list && list.length && q.add) q.add(list); };
  const fromInput = (e) => {
    add(Array.from(e.target.files || []).map((file) => ({ file, path: (file.webkitRelativePath || '').split('/').slice(0, -1).map((p) => p + '/').join('') })));
    e.target.value = '';
  };
  const zone = withZone ? (
    <DropZone active={over} className="plx-upload-manager__zone"
      onDragEnter={(e) => { e.preventDefault(); depth.current += 1; setOver(true); }}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
      onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false); }}
      onDrop={(e) => { e.preventDefault(); depth.current = 0; setOver(false); droppedFiles(e.dataTransfer).then(add); }}>
      <Icon name={UploadN2Icon} size="lg" />
      <span className="plx-upload-manager__drop">{t.drop}</span>
      {hint ? <span className="plx-upload-manager__hint">{hint}</span> : null}
      <span className="plx-upload-manager__choose">
        <Button size="sm" icon={TextCardIcon} onClick={() => filesInput.current && filesInput.current.click()}>{t.chooseFiles}</Button>
        {folders ? <Button size="sm" icon={FolderOpenIcon} onClick={() => folderInput.current && folderInput.current.click()}>{t.chooseFolder}</Button> : null}
      </span>
      <input ref={filesInput} type="file" multiple hidden accept={accept} onChange={fromInput} aria-label={t.chooseFiles} />
      {folders ? <input ref={folderInput} type="file" multiple hidden webkitdirectory="" directory="" onChange={fromInput} aria-label={t.chooseFolder} /> : null}
    </DropZone>
  ) : null;

  const row = (x) => {
    const file = { id: x.id, name: x.name, size: x.size, type: x.type };
    if (MOVING[x.status]) {
      return <FileRow key={x.id} as="li" file={file} progress={x.status === 'queued' ? 0 : clamp(x.progress)} progressLabel={x.status === 'queued' ? t.waiting : undefined}
        onCancel={q.cancel ? () => q.cancel(x.id) : undefined} />;
    }
    const removeItem = q.remove ? <MenuItem key="remove" icon={CloseIcon} onSelect={() => q.remove(x.id)}>{t.remove}</MenuItem> : null;
    if (x.status === 'error') {
      return <FileRow key={x.id} as="li" file={file} error={x.error || t.error} onRetry={x.retry !== false && q.retry ? () => q.retry(x.id) : undefined} actions={removeItem || undefined} />;
    }
    const canceled = x.status === 'canceled';
    return <FileRow key={x.id} as="li" file={file}
      status={canceled ? <Badge tone="neutral" icon={CloseIcon}>{t.canceled}</Badge> : <Badge tone="success" icon={CircleCheckIcon}>{t.uploaded}</Badge>}
      actions={canceled && q.retry ? <>{<MenuItem icon={RefreshIcon} onSelect={() => q.retry(x.id)}>{t.again}</MenuItem>}{removeItem}</> : removeItem || undefined} />;
  };
  const list = rows.length ? (
    <div className="plx-upload-manager__queue" tabIndex={0} role="region" aria-label={t.queue}>
      <FileRowList label={t.queue}>{rows.map(row)}</FileRowList>
    </div>
  ) : null;
  const summary = total ? (
    <div className="plx-upload-manager__summary">
      <ProgressBar className="plx-upload-manager__bar" size="sm" value={Math.round(overall)} label={t.overall} labelHidden tone={failed && !moving ? 'danger' : moving ? 'info' : 'success'} />
      <span className="plx-upload-manager__counts">{dataPhrase(t.progress, { done, total: live.length })} · {dataNumber(formatPercent(overall / 100))}</span>
    </div>
  ) : null;
  const finishing = total && !moving;
  const bulk = (
    <>
      {moving && q.cancelAll ? <Button size="sm" variant="ghost" onClick={q.cancelAll}>{t.cancelAll}</Button> : null}
      {finishing && q.clear ? <Button size="sm" variant="ghost" onClick={q.clear}>{t.clear}</Button> : null}
    </>
  );

  if (dialog) {
    return (
      <Dialog open={open} onClose={onClose} title={title || t.dialogTitle} icon={UploadIcon} size="md"
        className={cx('plx-upload-manager', 'plx-upload-manager--dialog', className)}
        footer={<>{bulk}<Button variant="primary" onClick={onClose}>{t.finish}</Button></>}>
        <div className="plx-upload-manager__body">
          {zone}
          {total ? <p className="plx-upload-manager__headline">{dataPhrase(headline)}</p> : null}
          {summary}
          {list}
        </div>
      </Dialog>
    );
  }
  return (
    <section className={cx('plx-upload-manager', 'plx-upload-manager--panel', docked && 'plx-upload-manager--docked', collapsed && 'is-collapsed', className)} aria-labelledby={id + '-title'}>
      <div className="plx-upload-manager__head">
        <h2 id={id + '-title'} className="plx-upload-manager__title">{dataPhrase(headline)}</h2>
        <span className="plx-upload-manager__actions">
          {bulk}
          <Button size="sm" variant="ghost" iconOnly icon={collapsed ? ChevronUpIcon : ChevronDownIcon} label={collapsed ? t.show : t.hide} aria-expanded={!collapsed} aria-controls={id + '-list'} onClick={() => setCollapsed(!collapsed)} />
          {onClose && !moving ? <Button size="sm" variant="ghost" iconOnly icon={CloseIcon} label={t.close} onClick={onClose} /> : null}
        </span>
      </div>
      {summary}
      <div id={id + '-list'} className="plx-upload-manager__body" hidden={collapsed}>
        {zone}
        {list}
      </div>
    </section>
  );
}
