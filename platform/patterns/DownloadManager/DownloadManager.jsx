/* Plenix · DownloadManager
   Summary: A named panel of queued, progressing, ready or failed downloads built from FileRow.
   Usage: <DownloadManager items={jobs} onCancel={cancelJob} onRetry={retryJob} onDownload={downloadFile} />
   Props:
     items: [{ id, file, status: queued | progress | ready | failed, progress, error, href }].
     onCancel(item), onRetry(item), onDownload(item): asynchronous application actions; variant: panel | progress | ready.
     title: list name; strings: title, empty, queued, progress, ready, failed, actionFailed; className.
   Behavior: Progress and errors remain caller-owned. Actions lock per item until settled; failures stay visible for retry.
   Notes: A supplied ready URL is a real Link; onDownload initiates an explicit application download. No transfers start on render.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Panel } from '../../components/Card/Card.tsx';
import { FileRow, FileRowList } from '../../components/FileRow/FileRow.jsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';

export function DownloadManager({ items = [], onCancel, onRetry, onDownload, title, variant = 'panel', strings, className }) {
  devWarn('DownloadManager', { variant }, { variant: ['panel','progress','ready'] });
  const t = useStrings('downloadManager', strings);
  const [pending, setPending] = React.useState({}), [errors, setErrors] = React.useState({});
  const locks = React.useRef(new Set());
  const run = async (item, action) => {
    if (locks.current.has(item.id)) return; locks.current.add(item.id); setPending((p) => ({ ...p, [item.id]: true })); setErrors((p) => ({ ...p, [item.id]: '' }));
    try { await action(item); } catch (e) { setErrors((p) => ({ ...p, [item.id]: t.actionFailed })); }
    finally { locks.current.delete(item.id); setPending((p) => ({ ...p, [item.id]: false })); }
  };
  const content = <Stack className={cx('plx-download-manager', className)}>
    {items.length ? <FileRowList label={title || t.title}>{items.map((a) => <FileRow key={a.id} as="li" file={a.file} aria-busy={!!pending[a.id]}
      progress={a.status === 'progress' ? a.progress : undefined} progressLabel={t.progress}
      error={a.status === 'failed' ? a.error || t.failed : undefined} status={<Badge tone={a.status === 'ready' ? 'success' : a.status === 'failed' ? 'negative' : 'active'} icon={a.status === 'ready' ? CheckIcon : a.status === 'failed' ? AlertIcon : RefreshIcon}>{t[a.status] || t.queued}</Badge>}
      onCancel={onCancel && !pending[a.id] ? () => run(a, onCancel) : undefined} onRetry={onRetry && !pending[a.id] ? () => run(a, onRetry) : undefined}
      onDownload={a.status === 'ready' && onDownload && !pending[a.id] ? () => run(a, onDownload) : undefined} strings={strings}
      href={a.status === 'ready' ? a.href : undefined} />)}</FileRowList> : <EmptyState title={t.empty} />}
    {Object.entries(errors).filter(([, error]) => error).map(([id, error]) => <Notice key={id} tone="danger">{error}</Notice>)}
  </Stack>;
  return variant === 'panel' ? <Panel title={title || t.title}>{content}</Panel> : content;
}