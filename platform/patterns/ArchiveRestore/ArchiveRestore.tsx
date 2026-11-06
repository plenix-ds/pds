/* Plenix · ArchiveRestore
   Summary: Reversible archiving with an archived Banner, icon Badge and restore action.
   Usage: <ArchiveRestore archived={archived} onArchive={archive} onRestore={restore} />
   Props:
     archived: controlled status; onArchive(), onRestore(): persistence promises.
     strings: { archive, restore, archived, message, failed }; children: record content; className: extra classes.
   Behavior:
     Status changes only after the caller persists and updates archived. Failure keeps the current state.
     Pending actions cannot repeat. The archived banner stays visible until restoration succeeds.
   Notes:
     Archive is not deletion. The caller controls data access and read-only enforcement.
*/
import React from 'react';
import { Banner } from '../../components/Banner/Banner.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ArchiveIcon from 'plenix-platform/icons/plenix/archive';

/** @public */
export type ArchiveRestoreProps = {
  archived?: boolean;
  onArchive?(): void | Promise<void>;
  onRestore?(): void | Promise<void>;
  strings?: Record<string, string>;
  /** the record's content */
  children?: React.ReactNode;
  className?: string;
};
export function ArchiveRestore({ archived = false, onArchive, onRestore, strings, children, className }: ArchiveRestoreProps) {
  const t: any = useStrings('archiveRestore', strings);
  const [busy, setBusy] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false);
  const run = async (fn: any) => {
    if (lock.current || !fn) return;
    lock.current = true; setBusy(true); setError('');
    try { await fn(); } catch (e) { setError(t.failed); } finally { lock.current = false; setBusy(false); }
  };
  return <Stack className={cx('plx-archive-restore', className)} aria-busy={busy}>
    {archived ? <Banner tone="neutral" icon={ArchiveIcon} title={<Badge tone="neutral" icon={ArchiveIcon}>{t.archived}</Badge>}
      actions={onRestore ? <Button size="sm" disabled={busy} onClick={() => run(onRestore)}>{t.restore}</Button> : null}>{t.message}</Banner>
      : onArchive ? <Button disabled={busy} onClick={() => run(onArchive)}>{t.archive}</Button> : null}
    {error ? <Notice tone="danger">{error}</Notice> : null}{children}
  </Stack>;
}
