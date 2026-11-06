/* Plenix · ExportDialog
   Summary: Explicit format and record scope selection, with optional background export results.
   Usage: <ExportDialog open formats={formats} selectedCount={3} onExport={startExport} onClose={close} />
   Props:
     open, title, onClose: dialog lifecycle; formats: [{ value, label }]; selectedCount: available selected records.
     onExport({ format, scope, background }): resolves optional { href, label }; allowBackground: default true.
     initialBackground: default false; strings: title, format, scope, all, selection, background, export, cancel,
       invalid, failed, ready, queued, download, done; className.
   Behavior:
     Reject empty formats and unavailable selection scope. Await the export and prevent repeat actions.
     Errors keep all options. Background work shows a queued Badge; supplied download URLs are explicit Links.
   Notes:
     Job creation, progress and download authorization belong to the caller. This component never fabricates a file.
*/
import React from 'react';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Select } from '../../components/Input/Input.tsx';
import { Checkbox } from '../../components/Checkbox/Checkbox.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';

/** @public what an export returns when it is ready */
export type ExportResult = { href?: string; label?: string } | void;
/** @public */
export type ExportDialogProps = {
  open?: boolean;
  title?: string;
  onClose?(): void;
  formats?: Array<{ value: string; label: string }>;
  /** how many selected records can be exported */
  selectedCount?: number;
  onExport?(request: { format: string; scope: string; background: boolean }): ExportResult | Promise<ExportResult>;
  allowBackground?: boolean;
  initialBackground?: boolean;
  strings?: Record<string, string>;
  className?: string;
};
export function ExportDialog({ open, title, onClose, formats = [], selectedCount = 0, onExport, allowBackground = true, initialBackground = false, strings, className }: ExportDialogProps) {
  const t: any = useStrings('exportDialog', strings);
  const [format, setFormat] = React.useState<any>(formats[0]?.value || ''), [scope, setScope] = React.useState<any>('all'), [background, setBackground] = React.useState<any>(initialBackground);
  const [busy, setBusy] = React.useState<any>(false), [result, setResult] = React.useState<any>(null), [finished, setFinished] = React.useState<any>(false), [error, setError] = React.useState<any>('');
  const lock = React.useRef<any>(false), epoch = React.useRef<any>(0), initial = React.useRef<any>(null); initial.current = { format: formats[0]?.value || '', background: initialBackground };
  React.useEffect(() => { epoch.current++; lock.current = false; setBusy(false); setFormat(initial.current.format); setScope('all'); setBackground(initial.current.background); setFinished(false); setResult(null); setError(''); return () => { epoch.current++; }; }, [open]);
  const start = async () => {
    if (lock.current) return;
    if (!formats.some((f) => f.value === format) || scope === 'selection' && selectedCount < 1) { setError(t.invalid); return; }
    const at = epoch.current; lock.current = true; setBusy(true); setError('');
    try { const out = await onExport!({ format, scope, background: allowBackground && background }); if (at === epoch.current) { setResult(out); setFinished(true); } }
    catch (e) { if (at === epoch.current) setError(t.failed); }
    finally { if (at === epoch.current) { lock.current = false; setBusy(false); } }
  };
  return <Dialog open={open} title={title || t.title} onClose={() => { if (!lock.current && onClose) onClose(); }} dismissible={!busy}
    footer={finished ? <Button onClick={onClose}>{t.done}</Button> : <><Button disabled={busy} onClick={onClose}>{t.cancel}</Button><Button variant="primary" disabled={busy || !onExport} onClick={start}>{t.export}</Button></>}>
    <Stack className={cx('plx-export-dialog', className)} aria-busy={busy}>
      {finished ? <><Badge icon={background && allowBackground ? RefreshIcon : CheckIcon} tone={background && allowBackground ? 'active' : 'success'} role="status">{background && allowBackground ? t.queued : t.ready}</Badge>
        {result?.href ? <Link href={result.href}>{result.label || t.download}</Link> : null}</>
        : <><Field label={t.format}><Select disabled={busy} value={format} onChange={(e) => setFormat(e.target.value)} options={formats} /></Field>
          <Field label={t.scope}><Select disabled={busy} value={scope} onChange={(e) => setScope(e.target.value)}
            options={[{ value: 'all', label: t.all }, { value: 'selection', label: t.selection, disabled: selectedCount < 1 }]} /></Field>
          {allowBackground ? <Checkbox label={t.background} checked={background} disabled={busy} onChange={(e) => setBackground(e.target.checked)} /> : null}</>}
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Stack>
  </Dialog>;
}
