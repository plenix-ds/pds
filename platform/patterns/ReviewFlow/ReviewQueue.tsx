/* Plenix · ReviewQueue
   Summary: The data review workflow: a DataGrid of items waiting for review under a CommandBar whose selection holds Approve, Request changes and Reject. It is its own
     module so a screen that draws a review panel or a status badge does not load the grid, the command bar or the prompt dialog (ADR 0052, issue 1268). Its props, words and
     behavior are documented in ReviewFlow.tsx, with the review panel and the status badge.
   Usage:
     <ReviewQueue label="Waiting for review" items={items} noun="item" onDecision={(ids, decision, reason) => …} />
*/
import React from 'react';
import { announce } from '../../utils/announce.tsx';
import { cx } from '../../utils/cx.ts';
import { formatNumber, formatDate } from '../../utils/format.ts';
import { Text } from '../../components/Text/Text.tsx';
import { PromptDialog } from '../../components/Dialog/Dialog.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import { useOptionalToast } from '../../components/Toast/Toast.tsx';
import { CommandBar as CommandBarJs } from '../CommandBar/CommandBar.tsx';
import { WorkflowStatus } from './WorkflowStatus.tsx';
import type { WorkflowStatusName, ReviewDecision } from './WorkflowStatus.tsx';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import { fill } from '../../utils/fill.ts';

const CommandBar: any = CommandBarJs;

/** @public one item waiting for review (submitted: YYYY-MM-DD) */
export type ReviewQueueItem = { id: string | number; name: string; type?: string; submittedBy?: string; submitted?: string; status?: WorkflowStatusName };
/** @public the prop type of ReviewQueue (ADR 0011) */
export type ReviewQueueProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  items?: ReviewQueueItem[];
  label?: string;
  noun?: string;
  plural?: string;
  onDecision?(ids: (string | number)[], decision: ReviewDecision, reason: string): unknown;
  selected?: (string | number)[];
  onSelectionChange?(ids: (string | number)[]): void;
  strings?: Record<string, string>;
  className?: string;
};
export function ReviewQueue(props: ReviewQueueProps) {
  let { items = [], label, noun, plural, onDecision, selected, onSelectionChange,
  strings, className, ...rest } = props as any;
  const t: any = useStrings('reviewFlow.queue', strings);
  const names: any = useStrings('reviewFlow.statuses');
  const loc = useLocale();
  const builtIn = !noun && !plural;   // the default words: whole counted phrases with the Arabic plural forms, from the catalog
  const many = plural || (noun ? noun + 's' : t.plural);   // the default words come from the catalog
  noun = noun ?? t.noun;
  label = label ?? t.queueLabel;
  const counted = (m: any) => (builtIn ? loc.t('reviewFlow.queue.items', { count: m, n: formatNumber(m) }) : null);
  const toast = useOptionalToast();
  const [own, setOwn] = React.useState([]);
  const sel = selected !== undefined ? selected : own;
  const setSel = (ids: any) => { if (selected === undefined) setOwn(ids); if (onSelectionChange) onSelectionChange(ids); };
  const [ask, setAsk] = React.useState<any>(null);   // "rejected" | "changes-requested" while its dialog is open
  const what = (n: any) => counted(n) ?? (n === 1 ? '1 ' + noun : formatNumber(n) + ' ' + many);
  const run = (decision: any, reason?: any) => {
    const ids = sel.slice();
    if (onDecision) onDecision(ids, decision, reason || '');
    setSel([]); setAsk(null);
    // the default words: one whole counted sentence per decision (Arabic plural forms); an app's own noun keeps the pieces
    const whole = builtIn && t.doneItems && t.doneItems[decision];
    const said = whole ? loc.t('reviewFlow.queue.doneItems.' + decision, { count: ids.length, n: formatNumber(ids.length) })
      : fill(t.done, { what: what(ids.length), decision: names[decision].toLowerCase() });
    if (toast) toast.show(said, { tone: decision === 'approved' ? 'success' : 'info' }); else announce(said);
  };
  const columns: any[] = [
    { title: t.name, field: 'name', kind: 'name' },
    { title: t.type, field: 'type' },
    { title: t.submittedBy, field: 'submittedBy', type: 'person' },
    { title: t.submitted, field: 'submitted', kind: 'data', type: 'date', render: (r: any) => <Text variant="data">{formatDate(r.submitted)}</Text> },
    { title: t.status, field: 'status', kind: 'center', render: (r: any) => <WorkflowStatus status={r.status} strings={strings} /> },
  ];
  return (
    <div className={cx('plx-review-queue', className)} {...rest}>
      <CommandBar label={label} count={counted(items.length) ?? fill(t.count, { n: formatNumber(items.length), plural: items.length === 1 ? noun : many })}
        selection={{ count: sel.length, noun, plural: many, onClear: () => setSel([]), actions: [
          { id: 'approve', label: t.approve, icon: CircleCheckIcon, onSelect: () => run('approved') },
          { id: 'changes', label: t.changes, icon: AlertIcon, onSelect: () => setAsk('changes-requested') },
          { id: 'reject', label: t.reject, icon: CloseIcon, danger: true, onSelect: () => setAsk('rejected') },
        ] }} />
      <DataGrid label={label} data={items} index="id" selectable selected={sel} onSelectionChange={setSel} columns={columns} />
      <PromptDialog open={!!ask} title={fill(ask === 'rejected' ? t.rejectTitle : t.changesTitle, { what: what(sel.length) })}
        label={ask === 'rejected' ? t.reason : t.changesLabel} description={t.reasonHint}
        confirmLabel={ask === 'rejected' ? t.reject : t.changes} validate={(v) => (v.trim() ? '' : t.needReason)}
        onSubmit={(v) => run(ask, v.trim())} onCancel={() => setAsk(null)} />
    </div>
  );
}
