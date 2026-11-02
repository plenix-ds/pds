/* Plenix · ImportDialog
   Summary: Choose a file, paste data or provide an HTTP URL before an explicit import.
   Usage: <ImportDialog open onImport={readSource} onClose={close} />
   Props:
     open, title, onClose: dialog lifecycle; initialMode: "file", "paste" or "url".
     accept: file extensions or MIME types; multiple: accept several files (default false).
     onImport({ mode, files, text, url }): asynchronous reader/importer; validate(source): optional error string.
     strings: { title, file, paste, url, choose, drop, none, import, cancel, invalid, failed, unsaved }; className.
   Behavior:
     Reject empty data, invalid URLs and unsupported dropped files. Draft input survives failures.
     Pending imports cannot repeat or dismiss. Reopening resets the source and guards stale responses.
   Notes:
     The caller owns parsing, server-side validation and URL fetching. The component never fetches an arbitrary URL.
*/
import React from 'react';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Tabs } from '../../components/Tabs/Tabs.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input, Textarea } from '../../components/Input/Input.tsx';
import { FileInput } from '../../components/FileInput/FileInput.tsx';
import { DropZone } from '../../components/DropZone/DropZone.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function ImportDialog({ open, title, onClose, initialMode = 'file', accept = '', multiple = false, onImport, validate, strings, className }) {
  const t = useStrings('importDialog', strings);
  const [mode, setMode] = React.useState(initialMode), [files, setFiles] = React.useState([]), [text, setText] = React.useState(''), [url, setUrl] = React.useState('');
  const [busy, setBusy] = React.useState(false), [error, setError] = React.useState(''), [drag, setDrag] = React.useState(false);
  const lock = React.useRef(false), epoch = React.useRef(0), first = React.useRef(initialMode); first.current = initialMode;
  React.useEffect(() => { epoch.current++; lock.current = false; setBusy(false); setMode(first.current); setFiles([]); setText(''); setUrl(''); setError(''); return () => { epoch.current++; }; }, [open]);
  const guard = useUnsavedGuard(open && !!(files.length || text || url), t.unsaved);
  const close = guard(() => { if (!lock.current && onClose) onClose(); });
  const allowed = (file) => !accept || accept.split(',').some((s) => { const rule = s.trim().toLowerCase(); return rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule) : rule.endsWith('/*') ? file.type.toLowerCase().startsWith(rule.slice(0, -1)) : file.type.toLowerCase() === rule; });
  const submit = async () => {
    if (lock.current) return;
    let validUrl = false; try { validUrl = ['https:', 'http:'].includes(new URL(url.trim()).protocol); } catch (e) { /* invalid source */ }
    if (mode === 'file' && (!files.length || !multiple && files.length > 1 || !files.every(allowed)) || mode === 'paste' && !text.trim() || mode === 'url' && !validUrl) { setError(t.invalid); return; }
    const source = { mode, files: mode === 'file' ? files : [], text: mode === 'paste' ? text : '', url: mode === 'url' ? url.trim() : '' };
    const at = epoch.current; lock.current = true; setBusy(true); setError('');
    try {
      const problem = validate ? await validate(source) : '';
      if (at !== epoch.current) return;
      if (problem) { setError(typeof problem === 'string' ? problem : t.invalid); return; }
      await onImport(source);
      if (at === epoch.current && onClose) onClose();
    } catch (e) { if (at === epoch.current) setError(t.failed); }
    finally { if (at === epoch.current) { lock.current = false; setBusy(false); } }
  };
  return <Dialog open={open} title={title || t.title} onClose={close} dismissible={!busy}
    footer={<><Button disabled={busy} onClick={close}>{t.cancel}</Button><Button variant="primary" disabled={busy} onClick={submit}>{t.import}</Button></>}>
    <Stack className={cx('plx-import-dialog', className)} aria-busy={busy}>
      <Tabs label={title || t.title} variant="folder" value={mode} onChange={setMode} items={[
        { value: 'file', label: t.file, disabled: busy, content: <DropZone active={drag} onDragOver={(e) => e.preventDefault()} onDragEnter={() => !busy && setDrag(true)}
          onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); if (!busy) setFiles(Array.from(e.dataTransfer.files)); }}>
          <Text>{t.drop}</Text><FileInput accept={accept} multiple={multiple} label={t.choose} onChange={setFiles} disabled={busy} strings={strings} />
          <Text variant="data">{files.length ? files.map((f) => f.name).join(', ') : t.none}</Text></DropZone> },
        { value: 'paste', label: t.paste, disabled: busy, content: <Field label={t.paste}><Textarea value={text} disabled={busy} onChange={(e) => setText(e.target.value)} /></Field> },
        { value: 'url', label: t.url, disabled: busy, content: <Field label={t.url}><Input type="url" value={url} disabled={busy} onChange={(e) => setUrl(e.target.value)} /></Field> }
      ]} />
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Stack>
  </Dialog>;
}
