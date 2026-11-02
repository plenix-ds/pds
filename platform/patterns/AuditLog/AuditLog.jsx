/* Plenix · AuditLog
   Summary: A read-only audit DataGrid with actor, timestamp, action, target and optional before/after differences.
   Usage: <AuditLog entries={events} variant="diff" label="Workspace history" />
   Props:
     entries: [{ id, actor: { name, src }, at, action, target, changes: [{ field, before, after }] }].
     variant: table (default) | diff; label; strings: actor, at, action, target, changes, view, field, before, after, close.
     className: additional classes; rows and difference values are rendered as text, never executable HTML.
   Behavior: View changes opens the selected event's diff table. Closing restores focus. No actions mutate the log.
   Notes: Supply authorized immutable audit events; retention, redaction and pagination belong to the caller.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { DataGrid } from '../../components/DataGrid/DataGrid.jsx';
import { Persona } from '../../components/Persona/Persona.tsx';
import { Time } from '../../components/Time/Time.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

const display = (v) => v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
export function AuditLog({ entries = [], variant = 'table', label, strings, className }) {
  devWarn('AuditLog', { variant }, { variant: ['table','diff'] });
  const t = useStrings('auditLog', strings);
  const [active, setActive] = React.useState(null), entry = entries.find((a) => a.id === active);
  const columns = [
    { field: 'actor', title: t.actor, type: 'person', render: (a) => <Persona name={a.actor?.name || ''} src={a.actor?.src} size="xs" /> },
    { field: 'at', title: t.at, kind: 'data', type: 'date', render: (a) => <Time value={a.at} /> },
    { field: 'action', title: t.action, kind: 'wrap' }, { field: 'target', title: t.target, kind: 'wrap' }
  ];
  if (variant === 'diff') columns.push({ field: 'changes', title: t.changes, kind: 'center', sortable: false,
    render: (a) => a.changes?.length ? <Button size="xs" onClick={() => setActive(a.id)}>{t.view}</Button> : null });
  const changes = (entry?.changes || []).map((a, i) => ({ id: i, field: a.field, before: display(a.before), after: display(a.after) }));
  return <Stack className={cx('plx-audit-log', className)}>
    <DataGrid label={label} data={entries} columns={columns} headerMenu={false} />
    <Dialog open={!!entry} title={t.changes} onClose={() => setActive(null)} size="lg" footer={<Button onClick={() => setActive(null)}>{t.close}</Button>}>
      <DataGrid label={t.changes} data={changes} headerMenu={false} columns={[{ field: 'field', title: t.field }, { field: 'before', title: t.before, kind: 'wrap' }, { field: 'after', title: t.after, kind: 'wrap' }]} />
    </Dialog>
  </Stack>;
}