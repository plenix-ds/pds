/* Plenix · ImportWizard
   Summary: Read an import source, map columns, review rows and report persisted results.
   Usage: <ImportWizard open fields={fields} onRead={parseSource} onImport={persistRows} onClose={close} />
   Props:
     open, title, onClose: dialog lifecycle; fields: [{ id, label, required }].
     onRead(source): resolves { columns: [{ id, label }], rows: objects }; onImport({ source, mapping, rows }): promise.
     strings: { title, mapping, review, results, column, choose, missing, invalid, done, imported, source, cancel }; className.
   Behavior:
     Source parsing precedes the wizard. Required target fields must be mapped; review shows the mapped values.
     Finish persists once, then shows results. Failures retain the map and rows for retry.
   Notes:
     Parsing and import storage belong to the caller. Reopening starts a new import; late read results are ignored.
*/
import React from 'react';
import { ImportDialog } from '../ImportDialog/ImportDialog.jsx';
import { Wizard } from '../Wizard/Wizard.jsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Select } from '../../components/Input/Input.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.jsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';

export function ImportWizard({ open, title, onClose, fields = [], onRead, onImport, strings, className }) {
  const t = useStrings('importWizard', strings);
  const [data, setData] = React.useState(null), [source, setSource] = React.useState(null), [mapping, setMapping] = React.useState({}), [complete, setComplete] = React.useState(false);
  const epoch = React.useRef(0), lock = React.useRef(false), loaded = React.useRef(false);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { epoch.current++; setData(null); setSource(null); setMapping({}); setComplete(false); setBusy(false); loaded.current = false; lock.current = false; return () => { epoch.current++; }; }, [open]);
  const guard = useUnsavedGuard(open && !!data && !complete, t.unsaved);
  const close = guard(() => { if (!lock.current && onClose) onClose(); });
  const read = async (input) => {
    const at = epoch.current, parsed = await onRead(input);
    if (at !== epoch.current) return;
    if (!parsed || !Array.isArray(parsed.columns) || !parsed.columns.length || !Array.isArray(parsed.rows)) throw new Error(t.invalid);
    loaded.current = true; setSource(input); setData(parsed); setMapping({});
  };
  const mapped = data ? data.rows.map((row, i) => fields.reduce((out, f) => ({ ...out, [f.id]: mapping[f.id] ? row[mapping[f.id]] : '' }), { _plxRow: i })) : [];
  const validate = () => fields.some((f) => f.required && !mapping[f.id]) ? t.missing : '';
  const finish = async () => {
    if (lock.current) return; const at = epoch.current; lock.current = true; setBusy(true);
    try { await onImport({ source, mapping, rows: mapped.map(({ _plxRow, ...row }) => row) }); if (at === epoch.current) setComplete(true); }
    finally { if (at === epoch.current) { lock.current = false; setBusy(false); } }
  };
  if (!data) return <ImportDialog open={open} title={title || t.title} onImport={read} strings={strings} onClose={() => { if (!loaded.current && onClose) onClose(); }} />;
  return <Dialog open={open} title={title || t.title} onClose={close} dismissible={!busy}>
    <Stack className={cx('plx-import-wizard', className)}>
      {complete ? <><Badge tone="success" icon={CheckIcon} role="status">{t.imported}</Badge><Text as="h3" variant="heading">{t.results}</Text>
        <Text variant="data">{mapped.length}</Text><Button variant="primary" onClick={onClose}>{t.done}</Button></>
        : <Wizard label={title || t.title} strings={strings} onCancel={close} onComplete={finish} steps={[
          { id: 'mapping', label: t.mapping, validate, content: <Stack>{fields.map((f) => <Field key={f.id} label={f.label} required={f.required}>
            <Select value={mapping[f.id] || ''} options={[{ value: '', label: t.choose }].concat(data.columns.map((c) => ({ value: c.id, label: c.label })))}
              onChange={(e) => setMapping({ ...mapping, [f.id]: e.target.value })} /></Field>)}</Stack> },
          { id: 'review', label: t.review, content: <DataGrid label={t.review} index="_plxRow" data={mapped}
            columns={fields.map((f) => ({ field: f.id, title: f.label, kind: 'wrap' }))} headerMenu={false} /> }
        ]} />}
    </Stack>
  </Dialog>;
}
